//SPECS v4.8 WORKS UNTIL HERE

/* The profile a unit plays: the one of its player slot (lmMbProfileIdx, ogario.v4.js: P2 is
 * application.mbSlots[1] ...). An older core: by its number, as before. */
function lmUnitProfileIdx(spect) {
    if (typeof lmMbProfileIdx === 'function') return lmMbProfileIdx(spect);
    return (application.mbSlots && spect && spect.number < application.mbSlots.length)
        ? application.mbSlots[spect.number] : application.selectedOldProfile;
}

function loadMultiCellSkin(spect) {
    var prof = profiles[lmUnitProfileIdx(spect)];
    if (prof && prof.nick && prof.skinURL) {
        lmPreloadUnitSkin(prof.skinURL);
    }
}

/*
 * A unit's profile skin is carried by its own cells (cell.skin = the URL), so it is
 * only loaded here. It used to be stored under the profile's nick, which is often
 * the main player's nick too: the main player and the unit then kept swapping skins.
 */
function lmPreloadUnitSkin(url) {
    if (!url || typeof application === 'undefined' || !application || !application.loadSkin) return;
    var clean = application.checkSkinURL ? application.checkSkinURL(url) : url;
    if (clean && application.customSkinsCache && !application.customSkinsCache.hasOwnProperty(clean)) {
        application.loadSkin(application.customSkinsCache, clean);
    }
}

if (typeof window.spects === "undefined" || !window.spects) {
    window.spects = [];
}
var spects = window.spects;

/* The core's indexed-list helpers (lmCellIdx, ogario.v4.js). A cached older core
 * without them gets the plain array operations it was written for. */
var _lmIdxPlain = {
    push: function (a, c) { a.push(c); },
    of: function (a, c) { return a.indexOf(c); },
    remove: function (a, c) { var i = a.indexOf(c); if (i !== -1) a.splice(i, 1); return i !== -1; },
    filter: function (a, p, keep) { return a.filter(keep); }
};
function lmSpectIdx() { return window.lmCellIdx || _lmIdxPlain; }

/* Socket generations of every spect.js connection come from one counter: a new Spect that
 * reuses a number (Full Map off / on, a removed unit) started at 1 again, so (number,
 * generation) repeated and the old object's cells, anchors and colours passed as its own.
 * Always above the connection's previous one. */
var _lmSpectGenSeq = 0;
function lmSpectNextGen(sp) {
    _lmSpectGenSeq = Math.max(_lmSpectGenSeq, (sp && sp.connectionGeneration) || 0) + 1;
    return _lmSpectGenSeq;
}

/* End offset of a whole agar.io world update (opcode 16 body at offset), or -1 when the packet
 * is cut short. updateCells applies each section as it reads it, so a short packet used to
 * apply its eats and first records and then throw. Same layout as updateCells reads:
 * u16 eats x 8 bytes; records until id 0 (u32 id, i32 x, i32 y, u16 size, u8 flags,
 * [u8 ext if flags&128], [rgb if 2], [skin\0 if 4], [name\0 if 8], [u32 account if ext&4]);
 * u16 removals x 4 bytes. Index reads only, no allocation. */
function lmWorldUpdateEnd(view, offset) {
    var len = view.length, n, flags, ext;
    if (!(offset >= 0) || offset + 2 > len) return -1;
    n = view[offset] | (view[offset + 1] << 8);
    offset += 2 + n * 8;
    for (;;) {
        if (offset + 4 > len) return -1;
        if ((view[offset] | view[offset + 1] | view[offset + 2] | view[offset + 3]) === 0) { offset += 4; break; }
        offset += 4;
        if (offset + 11 > len) return -1;
        flags = view[offset + 10];
        offset += 11;
        ext = 0;
        if (flags & 128) { if (offset >= len) return -1; ext = view[offset++]; }
        if (flags & 2) offset += 3;
        if (flags & 4) { while (offset < len && view[offset] !== 0) offset++; if (offset++ >= len) return -1; }
        if (flags & 8) { while (offset < len && view[offset] !== 0) offset++; if (offset++ >= len) return -1; }
        if (ext & 4) offset += 4;
        if (offset > len) return -1;
    }
    if (offset + 2 > len) return -1;
    n = view[offset] | (view[offset + 1] << 8);
    offset += 2 + n * 4;
    return offset > len ? -1 : offset;
}
/* Whether this server sends the agar.io / Expanding Land records lmWorldUpdateEnd reads: the
 * main client's own choice (updateCells isLegacyMultiOgar; Garix has its own parser), with
 * this connection's integrity in place of the main one's */
function lmSpectAgarLayout(integrity) {
    var t = window.legendmod && window.legendmod.serverType;
    if (t === 'garix' || t === 'imsolo' || t === 'agar2' || t === 'private') return false;
    return !!integrity || t === 'expandingland';
}

/*
 * ═══ Coordinates: one transform per connection ═══
 *
 * Every agar.io connection has its own raw frame: its own offset, per axis possibly a
 * mirror of the main connection's, and per axis its own scale (live captures: full
 * borders 14073..14211 wide and 14072..14199 high; the same pellet sits at the same
 * fraction of each connection's border to ~1 unit; sizes are not scaled). All of them
 * share one world frame (map centre = 0, the main connection's orientation, the full map
 * LM_WORLD_SIZE wide and high, edge to edge):
 *
 *     world = s * k * (raw - C) + d          raw = C + s * (world - d) / k
 *
 * C = exact centre of the connection's full-map border (opcode 64; spect.mapOffsetX = -C),
 * k = LM_WORLD_SIZE / that border's width (height for y; spect._lmKX/_lmKY; 1 on private
 * servers and Expanding Land), s = +1 / -1 per axis (spect.fixX/fixY), d = residual
 * verified on shared food (spect.fix3x/fix3y; with C and k exact it stays 0 and the food
 * check only verifies it). Only the full border counts: agar.io sends it twice at the
 * handshake, then view-rect borders (~4250 x 2560) to playing connections, which never
 * set C or k. The main client keeps its cells in its own raw frame (main frame =
 * C_main + world / k_main, LM._lmBorderCX/CY/KX/KY) and Rotate Map is a separate display
 * flip on top (LM.translateX/Y),
 * so raw and world values are never flipped, rounded or snapped. Every incoming
 * coordinate (cells, food, top players, view) goes through rawToWorld and every outgoing
 * one (mouse, multibox movement, spectator targets) through worldToRaw, rounded to the
 * integer the server reads only when it is sent.
 */
var LM_WORLD_SIZE = 14142.135623730952;
function lmRawToWorld(raw, c, s, d, k) { return s * k * (raw - c) + d; }
function lmWorldToRaw(world, c, s, d, k) { return c + s * (world - d) / k; }
/* the main connection's border centre (its raw frame); an older core: its mapOffsetX */
function lmMainCentre(axis) {
    var lm = window.legendmod;
    var c = axis ? lm._lmBorderCY : lm._lmBorderCX;
    return Number.isFinite(c) ? c : -(axis ? lm.mapOffsetY : lm.mapOffsetX);
}
/* the main connection's scale k (world units per raw unit); 1 when unknown (older core, private) */
function lmMainScale(axis) {
    var lm = window.legendmod;
    var k = axis ? lm._lmBorderKY : lm._lmBorderKX;
    return Number.isFinite(k) && k > 0 ? k : 1;
}
/* Rotate Map display flip (self-inverse), as the main client does for its own cells */
function lmDisplayFlip(v, axis) {
    var lm = window.legendmod;
    var vec = lm && lm.vector && lm.vector[lm.vnr];
    if (!vec || !vec[axis]) return v;
    return axis ? lm.mapMaxY - (v - lm.mapMinY) : lm.mapMaxX - (v - lm.mapMinX);
}
/* raw -> drawn (main frame + Rotate Map) with a transform snapshot T (Spect._lmXf) */
function lmXfFwd(v, axis, T) {
    if (!T.ok) return v;
    var res = T.same ? v : lmRawToWorld(v, axis ? T.cy : T.cx, axis ? T.sy : T.sx, axis ? T.dy : T.dx, axis ? T.ky : T.kx) / (axis ? T.mky : T.mkx) + (axis ? T.my : T.mx);
    return lmDisplayFlip(res, axis);
}
/* drawn -> raw (exact, not rounded) with the same snapshot */
function lmXfInv(v, axis, T) {
    if (!T.ok) return v;
    var res = lmDisplayFlip(v, axis);
    return T.same ? res : lmWorldToRaw((res - (axis ? T.my : T.mx)) * (axis ? T.mky : T.mkx), axis ? T.cy : T.cx, axis ? T.sy : T.sx, axis ? T.dy : T.dx, axis ? T.ky : T.kx);
}

/* orientation candidates [sx, sy] against the main connection */
var LM_ORI = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
/*
 * Top players (opcode 69) of the main connection (ref, world) and of this one (obs,
 * raw - C): per candidate, how many pair up one-to-one with the same mass (massTol) and
 * the same place (tol). A player near a centre line fits both signs of that axis, so it
 * adds to both candidates and decides nothing. distinct: a player with two candidates of
 * its mass within tol is ambiguous and not counted.
 */
function lmGhostOrientationCounts(ref, obs, tol, massTol, distinct) {
    var counts = [0, 0, 0, 0], tol2 = tol * tol;
    var order = ref.slice().sort(function (a, b) { return b.mass - a.mass; });
    for (var c = 0; c < 4; c++) {
        var sx = LM_ORI[c][0], sy = LM_ORI[c][1], used = [];
        for (var i = 0; i < order.length; i++) {
            var m = order[i], best = -1, bestD = tol2, n = 0;
            for (var j = 0; j < obs.length; j++) {
                var g = obs[j];
                if (Math.abs(g.mass - m.mass) > massTol * Math.max(g.mass, m.mass)) continue;
                var dx = sx * g.x - m.x, dy = sy * g.y - m.y, dd = dx * dx + dy * dy;
                if (dd > tol2) continue;
                n++;
                if (!used[j] && dd <= bestD) { bestD = dd; best = j; }
            }
            if (best < 0 || (distinct && n !== 1)) continue;
            used[best] = true;
            counts[c]++;
        }
    }
    return counts;
}
/*
 * Top-player lists compared for the orientation: at most LM_GHOST_MAX_DT apart; a player
 * may have moved LM_GHOST_TOL0 + LM_GHOST_SPEED * dt between them (live agar.io FFA,
 * consecutive lists of one connection: p50 132-140, p95 252-297, p99 434 units/s; the
 * tolerance was 150 + 1 per ms, up to 3150 units for lists 3 s apart) and has the same
 * mass within LM_GHOST_MASS (p99 of the change in ~1 s: 2.5%; it was 15%). Two votes are
 * independent evidence only LM_GHOST_VOTE_GAP apart (the next list of the same players a
 * second later is not a second confirmation).
 */
var LM_GHOST_MAX_DT = 1000, LM_GHOST_TOL0 = 60, LM_GHOST_SPEED = 0.5, LM_GHOST_MASS = 0.03, LM_GHOST_VOTE_GAP = 1500;
/* the candidate that clearly wins (at least minBest, minMargin more than any other and the
 * runner-up at most ratio of it), else -1 (ambiguous: wait for more) */
function lmDecideOrientation(counts, minBest, minMargin, ratio) {
    var best = 0, second = 0, c;
    for (c = 1; c < 4; c++) if (counts[c] > counts[best]) best = c;
    for (c = 0; c < 4; c++) if (c !== best && counts[c] > second) second = counts[c];
    var n = counts[best];
    return n >= minBest && n - second >= minMargin && second <= n * ratio ? best : -1;
}

/* Food anchors: a spatial index (32-unit buckets: a 24-unit search reads 3 x 3) of
 * stationary food in world coordinates. A bucket is only an index: two pellets in one
 * bucket stay two pellets. One record per pellet as one source saw it (main: 0); the
 * copies of one pellet from other sources (same size +-1, within LM_ANCHOR_COPY per axis)
 * are one entity, two pellets of one source never are. Flat arrays reused between
 * rebuilds (no object per pellet): bucket chains hashed into LM_ANCHOR_SLOTS heads (a
 * record keeps its bucket, so a hash collision is skipped), an entity is the index of its
 * first record with its records chained (entNext). */
var LM_ANCHOR_CELL = 32;
/* anchors kept per connection (the newest; see Spect._lmAnchorPush) */
var LM_ANCHOR_MAX = 384;
/* copies of one pellet: integer positions and per-axis scales (live max 1.8 apart) */
var LM_ANCHOR_COPY = 4;
var LM_ANCHOR_SLOTS = 16384;
function lmAnchorSlot(gx, gy) { return (Math.imul(gx, 73856093) ^ Math.imul(gy, 19349663)) & (LM_ANCHOR_SLOTS - 1); }
function lmAnchorGrid() {
    var g = { n: 0, cap: 0, q: 0, head: new Int32Array(LM_ANCHOR_SLOTS).fill(-1), pick: new Int32Array(128), a: [], u: [], f: [] };
    lmAnchorGrow(g, 1024);
    return g;
}
function lmAnchorGrow(g, cap) {
    var F = ['x', 'y', 'size', 'gen'], I = ['next', 'gx', 'gy', 'src', 'ent', 'entNext', 'claimQ', 'claimN'], k, v;
    for (k = 0; k < F.length; k++) { v = new Float64Array(cap); if (g[F[k]]) v.set(g[F[k]]); g[F[k]] = v; }
    for (k = 0; k < I.length; k++) { v = new Int32Array(cap); if (g[I[k]]) v.set(g[I[k]]); g[I[k]] = v; }
    g.cap = cap;
}
/* empty for a rebuild: the arrays stay, the pellets and anchors are let go */
function lmAnchorReset(g) {
    g.head.fill(-1);
    for (var i = 0; i < g.n; i++) { g.a[i] = null; g.u[i] = null; g.f[i] = null; }
    g.n = 0;
}
/* one record: a = the anchor and u = the connection (another connection's pellet), f = the main food cell */
function lmAnchorPut(grid, x, y, size, src, a, u, f) {
    if (grid.n === grid.cap) lmAnchorGrow(grid, grid.cap * 2);
    var gx = Math.floor(x / LM_ANCHOR_CELL), gy = Math.floor(y / LM_ANCHOR_CELL), ent = -1;
    for (var ix = gx - 1; ix <= gx + 1 && ent < 0; ix++) {
        for (var iy = gy - 1; iy <= gy + 1 && ent < 0; iy++) {
            for (var j = grid.head[lmAnchorSlot(ix, iy)]; j >= 0; j = grid.next[j]) {
                /* measured against the entity's first record, not any member: copies a few units
                 * apart chained one entity through each other (15 units wide with 6 sources), and
                 * two real pellets became one */
                if (grid.gx[j] !== ix || grid.gy[j] !== iy || grid.ent[j] !== j || Math.abs(grid.size[j] - size) > 1 ||
                    Math.abs(grid.x[j] - x) > LM_ANCHOR_COPY || Math.abs(grid.y[j] - y) > LM_ANCHOR_COPY) continue;
                /* a source is in an entity at most once */
                var e = grid.ent[j], k = e;
                while (k >= 0 && grid.src[k] !== src) k = grid.entNext[k];
                if (k < 0) { ent = e; break; }
            }
        }
    }
    var i = grid.n++, h = lmAnchorSlot(gx, gy);
    grid.x[i] = x; grid.y[i] = y; grid.size[i] = size; grid.src[i] = src; grid.gx[i] = gx; grid.gy[i] = gy;
    grid.a[i] = a || null; grid.u[i] = u || null; grid.f[i] = f || null; grid.gen[i] = a ? a.generation : 0;
    grid.claimQ[i] = 0;
    if (ent < 0) { grid.ent[i] = i; grid.entNext[i] = -1; } else { grid.ent[i] = ent; grid.entNext[i] = grid.entNext[ent]; grid.entNext[ent] = i; }
    grid.next[i] = grid.head[h];
    grid.head[h] = i;
}
/* a record counts while its pellet is there: checked at use, the reference is cached */
function lmAnchorRecLive(grid, i) {
    var f = grid.f[i];
    if (f) return !f.removed;
    var a = grid.a[i];
    return !a || lmAnchorLive(a, grid.gen[i]);
}
/*
 * Residuals (reference - observation) of observed food (world, {x, y, size}) against the
 * reference: per observation the live reference records of the same size (+-1) within R
 * from another connection (needD: only the main food and connections whose d is verified);
 * all of one entity: a candidate match, more than one entity: ambiguous, skipped. An entity
 * claimed by two observations is skipped for both (one-to-one, whatever their order).
 */
function lmAnchorResiduals(grid, obs, R, skipSrc, needD) {
    var out = [], R2 = R * R, reach = Math.ceil(R / LM_ANCHOR_CELL), q = ++grid.q;
    var X = grid.x, Y = grid.y, S = grid.size, GX = grid.gx, GY = grid.gy, SRC = grid.src, ENT = grid.ent, NX = grid.next, U = grid.u;
    var pick = grid.pick.length >= obs.length ? grid.pick : (grid.pick = new Int32Array(obs.length));
    for (var i = 0; i < obs.length; i++) {
        var o = obs[i], gx = Math.floor(o.x / LM_ANCHOR_CELL), gy = Math.floor(o.y / LM_ANCHOR_CELL);
        var best = -1, bestD = Infinity, amb = false;
        for (var ix = gx - reach; ix <= gx + reach; ix++) {
            for (var iy = gy - reach; iy <= gy + reach; iy++) {
                for (var j = grid.head[lmAnchorSlot(ix, iy)]; j >= 0; j = NX[j]) {
                    if (GX[j] !== ix || GY[j] !== iy || SRC[j] === skipSrc || Math.abs(S[j] - o.size) > 1) continue;
                    var dx = X[j] - o.x, dy = Y[j] - o.y, dd = dx * dx + dy * dy;
                    if (dd > R2 || !lmAnchorRecLive(grid, j) || (needD && U[j] && !U[j].foodCalibrated)) continue;
                    if (best >= 0 && ENT[j] !== ENT[best]) amb = true;
                    if (dd < bestD) { best = j; bestD = dd; }
                }
            }
        }
        pick[i] = amb ? -1 : best;
        if (pick[i] >= 0) {
            var e = ENT[best];
            if (grid.claimQ[e] !== q) { grid.claimQ[e] = q; grid.claimN[e] = 0; }
            grid.claimN[e]++;
        }
    }
    for (var m = 0; m < obs.length; m++) {
        var p = pick[m];
        if (p >= 0 && grid.claimN[ENT[p]] === 1) out.push([X[p] - obs[m].x, Y[p] - obs[m].y, m]);
    }
    return out;
}
function lmMedian(a) {
    if (!a.length) return 0;
    var s = a.slice().sort(function (p, q) { return p - q; }), h = s.length >> 1;
    return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
}
/* median residual, the matches within 2 units of it (inliers) and their p95 distance */
function lmRobustOffset(res) {
    var mx = lmMedian(res.map(function (r) { return r[0]; })), my = lmMedian(res.map(function (r) { return r[1]; }));
    var dev = [], all = [], rest = [];
    for (var i = 0; i < res.length; i++) {
        var e = Math.max(Math.abs(res[i][0] - mx), Math.abs(res[i][1] - my));
        all.push(e);
        if (e <= 2) dev.push(e); else rest.push(res[i]);
    }
    var q95 = function (a) { a.sort(function (p, q) { return p - q; }); return a.length ? a[Math.min(a.length - 1, Math.floor(a.length * 0.95))] : Infinity; };
    var alt = 0;
    if (rest.length) {
        var ax = lmMedian(rest.map(function (r) { return r[0]; })), ay = lmMedian(rest.map(function (r) { return r[1]; }));
        for (var k = 0; k < rest.length; k++) if (Math.max(Math.abs(rest[k][0] - ax), Math.abs(rest[k][1] - ay)) <= 2) alt++;
    }
    return { n: res.length, inl: dev.length, mx: mx, my: my, p95: q95(dev), p95All: q95(all), alt: alt };
}
/*
 * A food anchor: one pellet as one connection saw it, for the orientation and residual
 * checks: { sourceId, generation, rawId, rawX, rawY, size, observedAt, alive, cell }.
 * Alive until the pellet is eaten or leaves that connection's view (its cell is removed)
 * or the connection closes or opens a new socket; a dead anchor is never evidence.
 */
function lmAnchorLive(a, gen) {
    if (!a || !a.alive) return false;
    if (a.generation !== gen || (a.cell && (a.cell.removed || a.cell._lmGen !== a.generation))) {
        a.alive = false;
        a.cell = null;
        return false;
    }
    return true;
}
/*
 * Reference food for every connection's check, rebuilt at most once a second: the main
 * connection's food (its frame -> world) and the live anchors of the connections whose
 * orientation is verified (their raw -> world). Rebuilt at once when a transform it was
 * built with changes (the main border; a verified connection's socket, orientation, d or
 * k) and after a connection closes (lmFoodRefInvalidate).
 */
var _lmFoodRef = { t: -Infinity, grid: null, sig: [], sigN: -1, cur: [] };
function lmFoodRefInvalidate() {
    /* rebuilt on its next use (in place: a check holding it sees the new one) */
    _lmFoodRef.t = -Infinity;
    _lmFoodRef.sigN = -1;
}
/* the transforms the reference is built with, as numbers into out; their count */
function lmFoodRefSig(out) {
    var n = 0;
    out[n++] = lmMainCentre(0); out[n++] = lmMainCentre(1); out[n++] = lmMainScale(0); out[n++] = lmMainScale(1);
    var sp = window.spects || [];
    for (var s = 0; s < sp.length; s++) {
        var u = sp[s];
        if (!u || u._lmOri !== 'VERIFIED' || !u.mapOffsetFixed || u._lmSameFrame) continue;
        out[n++] = u.number; out[n++] = u.connectionGeneration; out[n++] = u.mapOffsetX; out[n++] = u.mapOffsetY;
        out[n++] = u.fixX; out[n++] = u.fixY; out[n++] = u.fix3x; out[n++] = u.fix3y; out[n++] = u._lmKX; out[n++] = u._lmKY;
    }
    return n;
}
function lmFoodReference(now) {
    /* fresh: the same transforms, built less than 1 s before now (a clock gone back is not fresh) */
    var R = _lmFoodRef, n = lmFoodRefSig(R.cur), age = now - R.t, same = !!R.grid && n === R.sigN && age >= 0 && age < 1000;
    for (var q = 0; same && q < n; q++) same = R.cur[q] === R.sig[q] || (R.cur[q] !== R.cur[q] && R.sig[q] !== R.sig[q]);
    if (same) return R;
    var grid = R.grid || (R.grid = lmAnchorGrid()), lm = window.legendmod, food = lm.food || [];
    lmAnchorReset(grid);
    var cmx = lmMainCentre(0), cmy = lmMainCentre(1), mkx = lmMainScale(0), mky = lmMainScale(1);
    for (var i = 0; i < food.length; i++) {
        var f = food[i];
        if (!f || f.spectator || f.removed) continue;
        /* its raw position (an older core: the drawn target, Rotate Map undone) */
        var x = Number.isFinite(f._lmRawX) ? f._lmRawX : lmDisplayFlip(Number.isFinite(f.targetX) ? f.targetX : f.x, 0);
        var y = Number.isFinite(f._lmRawY) ? f._lmRawY : lmDisplayFlip(Number.isFinite(f.targetY) ? f.targetY : f.y, 1);
        var size = Number.isFinite(f.targetSize) ? f.targetSize : f.size;
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        lmAnchorPut(grid, (x - cmx) * mkx, (y - cmy) * mky, size, 0, null, null, f);
    }
    var sp = window.spects || [];
    for (var s = 0; s < sp.length; s++) {
        var u = sp[s];
        if (!u || !u._lmAnchors || u._lmOri !== 'VERIFIED' || !u.mapOffsetFixed || u._lmSameFrame) continue;
        for (var a = 0; a < u._lmAnchors.length; a++) {
            var o = u._lmAnchors[a];
            if (lmAnchorLive(o, u.connectionGeneration)) lmAnchorPut(grid, u.rawToWorldX(o.rawX), u.rawToWorldY(o.rawY), o.size, u.number, o, u);
        }
    }
    R.t = now;
    var t = R.sig;
    R.sig = R.cur;
    R.cur = t;
    R.sigN = n;
    return R;
}

/* Opens one multibox unit (a playing connection) in the lowest free player slot and returns it;
 * null when six players are there (slots being opened count) or another one is being made. Its
 * number is max + 1 of what spects holds now (Full Map tiles included), so callers take
 * unit.number from the object returned, never a guessed 1. The slot is held before the unit is
 * made and freed again when making it fails. */
function addBox() {
    const reg = typeof lmMbPlayers !== 'undefined' ? lmMbPlayers : null;
    const r = reg ? reg.reserve() : null;
    if (reg && !r) return null;
    let spect;
    if (reg) reg._busy = true;
    try {
        spect = new Spect({ player: true, slotId: r ? r.slotId : 0, slotEpoch: r ? r.slotEpoch : 0 });
    } catch (e) {
        if (reg) { reg._busy = false; reg.release(r.slotId, r.slotEpoch); }
        throw e;
    }
    if (reg) reg._busy = false;
    spects.push(spect);
    if (reg && !reg.attach(spect)) {
        /* a slot or source taken twice: never two units in one */
        spect._lmRemoved = true;
        spect.closeConnection();
        const i = spects.indexOf(spect);
        if (i !== -1) spects.splice(i, 1);
        reg.release(r.slotId, r.slotEpoch);
        return null;
    }
    if (typeof lmMbSyncExists === 'function') lmMbSyncExists();
    else legendmod.multiBoxPlayerExists = true;
    if (typeof lmMbPlayerEvent === 'function') lmMbPlayerEvent('playerAdded', spect);
    return spect;
}
window.addBox = addBox;

function addSpectator() {
    let spect = new Spect();
    spects.push(spect);
}
window.addSpectator = addSpectator;

/* "View on middle of both (when close)" is decided by drawRender.getMultiboxFrame()
 * (ogario.v4.js), which replaced lmMultiUnitIsClose(). */

/*
 * Server view of one connection, in world units (lmRawToWorld), around its camera (opcode 17:
 * camera and scale). Measured live (agar.io FFA, 15 free spectators at scale 0.4 settled for 2
 * minutes, every pellet centre relative to the camera): at most 2535.8 x 1485.9 from it on
 * every connection, the same in world units on connections whose own scale k differs by up to
 * 0.5% (so the view is applied in world units, not raw ones): 5071.7 x 2971.9, BASE = 2028.7 x
 * 1188.8. That box is where the centre of a pellet (radius 10) is seen: agar.io sends a cell
 * while its circle reaches into the view, not only its centre (recorded captures: the farthest
 * centre grows with the radius, centre distance minus radius stays within 2525.8 x 1475.1), so a
 * cell of radius r is sent while its centre is within half + (r - 10) of the camera
 * (the model in developers/tests/debugviewports.js). The Full Map plan and the drawn box use the pellet box (larger cells
 * are seen farther out, so coverage is never less).
 * scale is pow(min(64 / total size, 1), 0.4) for a player (an estimate: its boxes say "est.")
 * and 0.4 for a free spectator.
 */
var LM_VIEW_BASE_W = 2028.7, LM_VIEW_BASE_H = 1188.8, LM_SPECT_FREE_SCALE = 0.4;
/* out: an array to fill instead of a new one (callers that run every frame) */
function lmServerViewSize(scale, out) {
    if (!(scale > 0.01 && scale <= 4)) scale = LM_SPECT_FREE_SCALE;
    var o = out || [0, 0];
    o[0] = LM_VIEW_BASE_W / scale; o[1] = LM_VIEW_BASE_H / scale;
    return o;
}
/* scratch of Spect._lmServerViewWorld / _lmServerViewDisplay (used at once, never kept) */
var _lmSvSize = [0, 0], _lmSvWorld = [0, 0, 0, 0];
function lmPlayerViewScale(totalSize) {
    return Math.pow(Math.min(64 / (totalSize > 0 ? totalSize : 1), 1), 0.4);
}
window.lmServerViewSize = lmServerViewSize;
window.lmPlayerViewScale = lmPlayerViewScale;

/*
 * Full Map tiles. Per axis, the fewest views that cover the map with LM_FULLMAP_EDGE past both
 * edges and overlap their neighbours by at least LM_FULLMAP_MIN_SEAM; the outer views reach just
 * past the map edge (no view is spent outside the map) and the spare length goes into equal
 * seams. Over the budget, the cover with seams >= 0 is tried, then null. Tile centres are
 * canonical world coordinates (0, 0 = the map centre), converted to each spectator's own raw
 * frame (scale, mirror, offset) when sent. On agar.io (14142 map, measured 5071.7 x 2971.9 view):
 * 3 x 5 = 15 connections, never more (LM_FULLMAP_MAX), seams 528 / 175 units. Live, every
 * spectator camera settled within 0.5 units of its target, so a seam loses at most 1 unit
 * (the earlier centred 3 x 5 cut gave seams 357 / 143 and spent 178 / 72 past each map edge).
 */
var LM_FULLMAP_EDGE = 8, LM_FULLMAP_MIN_SEAM = 64, LM_FULLMAP_MAX = 15;
/* Full Map only on a server with at most 180 players, again at 170 or fewer (LM._lmFullMapCrowdCheck) */
var LM_FULLMAP_MAX_PLAYERS = 180, LM_FULLMAP_REOPEN_PLAYERS = 170;
/* a tile camera within 4 of its target has arrived (live: they settle within 0.5). At most half
 * LM_FULLMAP_EDGE, so an arrived corner tile still reaches 4 past the map edge: with 16 a corner
 * camera 16 inward counted as arrived and left 8 x 8 of the map edge unseen. One threshold for
 * the box label and the sender's cadence below. A target is
 * sent at once when it changes, then every 500 ms while the camera glides there (it keeps
 * moving to the last target sent) and once a second once it has arrived: 2 packets a second
 * per spectator at most (it was 20 while gliding, 300 a second for 15 spectators) */
var LM_TILE_SETTLED = 4, LM_TILE_MOVING_MS = 500, LM_TILE_REFRESH_MS = 1000;
/* A spectator's server view counts (coverage, "arrived", the drawn box) only while it is fresh:
 * its camera (opcode 17, sent with every update of a spectating connection) at most
 * LM_CAM_FRESH_MS old and its world (opcode 16) at most LM_TILE_STALE_MS. A camera from a minute
 * ago still counted as the tile's view and hid the ghost cells inside it. */
var LM_CAM_FRESH_MS = 1000, LM_TILE_STALE_MS = 3000;
/* a tile target waits this long after the border for the orientation (Spect._lmTileRaw) */
var LM_TILE_UNVERIFIED_MS = 5000;
/* a unit's first spawn waits this long at most for its orientation (Spect._lmSpawnHold) */
var LM_MB_SPAWN_HOLD_MS = 3000;
/* tiles on one axis: the fewest views of length view covering map + 2 * edge with seams >= seam */
function lmFullMapAxis(map, view, seam) {
    var span = map + 2 * LM_FULLMAP_EDGE;
    if (view >= span) return 1;
    if (!(view > seam)) return Infinity;
    return Math.ceil((span - seam) / (view - seam) - 1e-9);
}
function lmFullMapPlan(mapW, mapH, viewW, viewH, budget) {
    budget = budget || LM_FULLMAP_MAX;
    if (!(mapW >= 1 && mapH >= 1 && viewW > 1 && viewH > 1)) return null;
    var cols = lmFullMapAxis(mapW, viewW, LM_FULLMAP_MIN_SEAM), rows = lmFullMapAxis(mapH, viewH, LM_FULLMAP_MIN_SEAM);
    if (!(cols * rows <= budget)) { cols = lmFullMapAxis(mapW, viewW, 0); rows = lmFullMapAxis(mapH, viewH, 0); }
    if (!(cols * rows <= budget)) return null;
    var e = LM_FULLMAP_EDGE;
    var stepX = cols > 1 ? (mapW + 2 * e - viewW) / (cols - 1) : 0, stepY = rows > 1 ? (mapH + 2 * e - viewH) / (rows - 1) : 0;
    var x0 = cols > 1 ? -mapW / 2 - e + viewW / 2 : 0, y0 = rows > 1 ? -mapH / 2 - e + viewH / 2 : 0;
    var tiles = [];
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            tiles.push({ index: tiles.length, col: c, row: r, x: x0 + c * stepX, y: y0 + r * stepY });
        }
    }
    return { cols: cols, rows: rows, viewW: viewW, viewH: viewH, stepX: stepX, stepY: stepY,
        seamX: cols > 1 ? viewW - stepX : 0, seamY: rows > 1 ? viewH - stepY : 0,
        /* how far the outer views reach past the map edge */
        marginX: cols > 1 ? e : (viewW - mapW) / 2, marginY: rows > 1 ? e : (viewH - mapH) / 2,
        tiles: tiles };
}
window.lmFullMapPlan = lmFullMapPlan;

/* The Full Map plan (null: the map needs more than LM_FULLMAP_MAX views). Tiles are world
 * coordinates (lmRawToWorld): the full agar.io map is LM_WORLD_SIZE wide and high in them,
 * whatever the main connection's own scale (its border is 14073..14211 wide), so the plan never
 * changes and is made once (LM.addSpect asks for it on every border packet). */
function lmFullMapTilePlan() {
    if (window.lmFullMapLastPlan) return window.lmFullMapLastPlan;
    var view = lmServerViewSize(LM_SPECT_FREE_SCALE);
    var plan = lmFullMapPlan(LM_WORLD_SIZE, LM_WORLD_SIZE, view[0], view[1], LM_FULLMAP_MAX);
    if (plan) window.lmFullMapLastPlan = plan;
    return plan;
}

/*
 * Opens Full Map tile `index` of the plan: one free spectator held on that tile. Which tiles open,
 * and when, is decided by LM._lmSpecReconcile (ogario.v4.js): only from the validated main border
 * (mapOffsetFixed), only the planned tiles that have no spectator yet. It used a fixed 2400 / 1000
 * start, 1024 x 600 x 4.95 steps that only touched (no overlap) and left the grid off centre.
 */
function addFullSpectator(index) {
    var plan = lmFullMapTilePlan(), t = plan && plan.tiles[index];
    if (!t) return null;
    var spect = new Spect({ staticX: t.x, staticY: t.y, tile: t.index });
    spects.push(spect);
    return spect;
}

/* Full Map state per tile, for the console: lmFullMapHealth() counts the tiles per state
 * (Spect._lmTileStateNow) and lists them; perTile ages are ms (-1: none yet). crowd / reason:
 * the grid is held closed (LM._lmSpecReconcile) by the player limit (LM._lmFullMapCrowdCheck),
 * by Teams / Battle Royale, by a replay or Practice (no game server) or until the main border
 * is known, so the planned tiles are not open. What is really seen: covering = the tiles whose
 * view counts as coverage now (Spect._lmCoverageOk, the test the ghost cells use; a moving tile
 * covers where it is), missing = planned tiles with no spectator at all. A replay or Practice
 * showed 15 planned with no tile and no reason. */
window.lmFullMapHealth = function () {
    var plan = window.lmSpecMode === 'full' ? lmFullMapTilePlan() : null, now = Date.now();
    var h = { planned: plan ? plan.tiles.length : 0, live: 0, moving: 0, calibrating: 0, stalled: 0, connecting: 0, failed: 0, refused: 0, captcha: 0,
        covering: 0, missing: 0, crowd: false, reason: '', perTile: [] };
    var LM = window.legendmod;
    if (plan && LM && typeof LM._lmSpecLocal === 'function' && LM._lmSpecLocal()) h.reason = 'replay or Practice (no game server)';
    else if (plan && LM && typeof LM._lmFullMapModeOff === 'function' && LM._lmFullMapModeOff()) h.reason = 'Teams / Battle Royale';
    else if (plan && LM && LM.integrity && LM._lmFullMapCrowd !== false) {
        h.crowd = LM._lmFullMapCrowd === true;
        h.reason = h.crowd ? 'more than ' + LM_FULLMAP_MAX_PLAYERS + ' players (opens again at ' + LM_FULLMAP_REOPEN_PLAYERS + ' or fewer)' : 'waiting for the player count';
    }
    else if (plan && LM && !LM.mapOffsetFixed) h.reason = 'waiting for the map border';
    var list = window.spects || [], seen = plan ? [] : null;
    for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (!s || s.player || s.tile == null || typeof s._lmTileStateNow !== 'function') continue;
        var st = s._lmTileStateNow(now), w = s._lmWorldStamp();
        var covers = typeof s._lmCoverageOk === 'function' && s._lmCoverageOk(now);
        h[st]++;
        if (covers) h.covering++;
        if (seen && s.tile >= 0 && s.tile < h.planned) seen[s.tile] = true;
        h.perTile.push({ tile: s.tile, number: s.number, state: st, reason: s._lmTileReason || '', covers: covers,
            camAge: s._lmCamAt > 0 ? now - s._lmCamAt : -1, worldAge: w > 0 ? now - w : -1 });
    }
    for (var t = 0; t < h.planned; t++) if (!seen[t]) h.missing++;
    h.perTile.sort(function (a, b) { return a.tile - b.tile; });
    return h;
};
/* Reconnects the spectators that gave up (8 failed reconnects): the Full Map tiles and the
 * in-game spectator (it held the in-game mode with nothing open), on the same objects: no new
 * spectator, no second socket. Refused (114) and captcha (85) ones wait for their mode off / on.
 * Returns how many were restarted. */
window.lmFullMapRetry = function () {
    var list = window.spects || [], n = 0;
    for (var i = 0; i < list.length; i++) {
        var s = list[i];
        if (!s || s.player || s._lmTileState !== 'failed' || s.socket) continue;
        s._reconnectAttempts = 0;
        s.connect();
        n++;
    }
    return n;
};

if (!window.spects) window.spects = [];
spects = window.spects;

class Spect {
    constructor(options) {
        options = options || {};
        this.number = spects.reduce(function (max, spect) {
            return spect && spect.number > max ? spect.number : max;
        }, 0) + 1;
        this.player = options.player === true;
        /* the player slot (2..6) and its occupancy (lmMbPlayers, addBox); 0 for a spectator */
        this.slotId = this.player && options.slotId >= 2 ? options.slotId : 0;
        this.slotEpoch = this.slotId ? options.slotEpoch || 0 : 0;
        this.staticX = options.staticX != null ? options.staticX : null;
        this.staticY = options.staticY != null ? options.staticY : null;
        /* Full Map: staticX / staticY are the tile centre in canonical world coordinates (map
         * centre = 0, the main connection's orientation, no Rotate Map); _lmTileRaw converts it
         * to this connection's raw frame just before each send. */
        this.tile = options.tile != null ? options.tile : null;
        this.socket = null;
        this.connectionGeneration = 0;
        this.positionController = null;
        this.staticPositionController = null;
        this.socketErrorTimer = null;
        this.reconnectTimer = null;
        this.pingInterval = null;
        this.mapOffset = 7071 //7071.067811865476
        this.fixX = 1
        this.fixY = 1
        this.closedByUser = false
        /* spectator state (_lmTileStateNow): failed / refused / captcha are kept here, with
         * the reason, by the code that stopped the connection; the others are read live */
        this._lmTileState = 'connecting'
        this._lmTileReason = ''
        if (!legendmod.playerCellsMulti) legendmod.playerCellsMulti = []
        this.integrity = null;
        /* this unit's own cells (_lmAdoptOwn / _lmOwnDrop) and its lives (spawns), never reset */
        this._lmOwn = [];
        this._lmLife = 0;
        this.resetConnectionState();
        this.connect()
    }

    clearAsyncState() {
        /* the multibox login wait of an earlier socket (connect() arms it again for the release) */
        if (this._multiPendingTimer) clearTimeout(this._multiPendingTimer);
        this._multiPendingTimer = null;
        if (this.positionController) clearInterval(this.positionController);
        if (this.staticPositionController) clearInterval(this.staticPositionController);
        if (this.socketErrorTimer) clearTimeout(this.socketErrorTimer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.pingInterval) clearInterval(this.pingInterval);
        if (this._lmRefuseTimer) clearTimeout(this._lmRefuseTimer);
        this._lmRefuseTimer = null;
        this.positionController = null;
        this.staticPositionController = null;
        this.socketErrorTimer = null;
        this.reconnectTimer = null;
        this.pingInterval = null;
    }

    /*
     * Type-30 ping keepalive every 3 s, like the main socket (ReqPing) and Delta
     * (one ping loop per unit). Sent as opcode 102 through this unit's own cipher.
     */
    sendPing() {
        if (!this.integrity || !this.clientKey || !this.isSocketOpen()) return;
        const pingPayload = [8];
        application.writeUint32(pingPayload, Math.floor(Math.random() * 1000)); // pingId
        pingPayload.push(16, 1); // previousRoundtrip = 1
        let uncompressed = [8, 30, 242, 1];
        application.writeUint32(uncompressed, pingPayload.length);
        uncompressed = uncompressed.concat(pingPayload);
        let packet = [102, 8, 1, 18];
        application.writeUint32(packet, uncompressed.length);
        packet = packet.concat(uncompressed);
        this.sendMessage(new DataView(new Uint8Array(packet).buffer));
    }

    resetConnectionState() {
        this.clearAsyncState();
        this.ws = null
        this.nick = null
        this.accessTokenSent = false
        this.protocolKey = null
        this.clientKey = null
        this.clientVersion = null
        this.connectionOpened = false
        this.mapOffsetX = 0
        this.mapOffsetY = 0
        this.mapOffsetFixed = false
        this._lmPendingBorder = null
        this.ghostFixed = false
        this.active = null
        this.targetX = null
        this.targetY = null
        this._lmCamAt = 0
        /* a new socket starts with no run of bad world updates (the totals stay) */
        this._lmBadRun = 0
        /* the last world packet (_lmWorldStamp) was the old socket's */
        this.time = 0
        this._lmWorldAt = 0
        /* ownership is the socket's: none of the old one's ids is pending on the new one */
        this.playerCellIDs = []
        if (!this._lmOwn) this._lmOwn = []
        this.playerScore = 0
        this.fix3x = 0
        this.fix3y = 0
        /* orientation belongs to one connection: a reconnect finds it again */
        this.fixX = 1
        this.fixY = 1
        this._lmOffsetFixedAt = 0
        /* the transform contract (see lmRawToWorld): orientation WAITING_BORDER ->
         * PROVISIONAL -> VERIFIED (<-> CONFLICTED), decided by top players and shared food */
        this._lmSameFrame = false
        this._lmKX = 1
        this._lmKY = 1
        this._lmOri = 'WAITING_BORDER'
        this._lmOriStreakC = -1
        this._lmOriStreakN = 0
        this._lmOriVerifiedC = -1
        this._lmGhostTime = 0
        this._lmGhostPair = null
        this._lmGhostVoteT = 0
        this._lmOwnVoteW = 0
        this._lmSpawnSeenAt = 0
        /* the old socket's anchors are no evidence any more (also in the reference grid) */
        if (this._lmAnchors) for (var _a = 0; _a < this._lmAnchors.length; _a++) {
            if (this._lmAnchors[_a]) { this._lmAnchors[_a].alive = false; this._lmAnchors[_a].cell = null; }
        }
        if (typeof lmFoodRefInvalidate === 'function') lmFoodRefInvalidate();
        this._lmAnchors = []
        this._lmAnchorNext = 0
        this._lmCalibAt = 0
        this._lmCalibSnaps = []
        /* d (fix3x/fix3y) verified on shared food */
        this.foodCalibrated = false
        this.openFirst = false
        this.openSecond = false
        this.openThird = false
        this.annoucementTold = false
        this.friends = 0
        this.leaderboard = []
        this.ghostCells = []
        this.playerSize = 0
        this.playerMass = 0
        this.playerMinMass = 0
        this.playerMaxMass = 0
        this.playerSplitCells = 0
    }

    connect() {
        this.resetConnectionState()
        this.closedByUser = false
        if (!this.player) { this._lmTileState = 'connecting'; this._lmTileReason = ''; }
        this.timeStarted = Date.now()
        this.ws = legendmod.ws
        /* A second connect() (Tab on a unit that is still connecting) left the old socket
         * open on the game server; extra connections count toward the per-IP limit. */
        if (this.socket) {
            const oldSocket = this.socket;
            this.socket = null;
            oldSocket.onopen = oldSocket.onmessage = oldSocket.onerror = oldSocket.onclose = null;
            try { oldSocket.close(); } catch (e) { }
        }
        const generation = this.connectionGeneration = lmSpectNextGen(this);
        /* a login popup still open for the old socket: it is let go after 60 s as before, but
         * that socket's nick is not sent on this one (its own login reply sends it) */
        if (window.MultiPending === this) this._armMultiPendingTimeout(true);
        /* cells of an earlier socket of this unit (a second connect() while connecting) are
         * not this socket's: its ids may name other cells */
        this._lmDropOtherGenerations(generation);
        const createSocket = window.createLegendWebSocket || function (url) { return new WebSocket(url); };
        const socket = createSocket(legendmod.ws);
        this.socket = socket;
        this.integrity =
            typeof socket._lwIntegrity === "boolean"
                ? socket._lwIntegrity
                : Boolean(legendmod.integrity);
        socket.binaryType = 'arraybuffer'
        socket.onopen = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onopen();
        };
        socket.onmessage = (message) => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onmessage(message);
        };
        socket.onerror = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onerror(socket, generation);
        };
        socket.onclose = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onclose(socket, generation);
        };
    }

    onopen() {
        console.log('[SPECT] Game server socket ' + this.number + ' open')
        /* Do not reset the backoff here: a server that accepts and then kicks (login
         * elsewhere, expired token) would loop every second. onclose resets it only
         * after the socket stayed open for a while. */
        this._openedAt = Date.now();


        this.clientVersion = window.master.clientVersion
        this.protocolVersion = window.master.protocolVersion

        let view = this.createView(5);
        view.setUint8(0, 254);
        if (!this.integrity) {
            view.setUint32(1, 6, true);
        } else {
            view.setUint32(1, this.protocolVersion, true);
        }
        this.sendMessage(view);
        view = this.createView(5);
        view.setUint8(0, 255);
        if (!this.integrity) {
            view.setUint32(1, 1, true);
        } else {
            view.setUint32(1, this.clientVersion, true);
        }
        this.sendMessage(view);
        this.connectionOpened = true;


    }

    onmessage(message) {
        message = new DataView(message.data);
        //if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)

        if (this.protocolKey) {
            message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
        }
        try {
            this.handleMessage(message);
        } catch (e) {
            this._lmDecodeError(e);
        }
    }

    /* A packet this connection could not read: counted (_lmDecodeErrors), and at most one
     * warning per connection per minute (a bad stream logged every packet before, or nothing).
     * Any other error is a fault in the handler: logged with its stack, once per message. */
    _lmDecodeError(e) {
        this._lmDecodeErrors = (this._lmDecodeErrors || 0) + 1;
        if (e && typeof e === 'object' && !(e instanceof RangeError)) {
            const seen = this._lmFaultsSeen || (this._lmFaultsSeen = new Set()), key = String(e.message);
            if (seen.has(key) || seen.size >= 32) return;
            seen.add(key);
            console.error('[SPECT] Unit ' + this.number + ' packet handler error:', e && e.stack ? e.stack : e);
            return;
        }
        const now = Date.now();
        if (now - (this._lmDecodeWarnAt || 0) < 60000) return;
        this._lmDecodeWarnAt = now;
        console.warn('[SPECT] Unit ' + this.number + ': unreadable packet (' + this._lmDecodeErrors + ' so far):', e && e.message ? e.message : e);
    }

    onerror(socket, generation) {
        if (this.socketErrorTimer) clearTimeout(this.socketErrorTimer);
        this.socketErrorTimer = setTimeout(() => {
            this.socketErrorTimer = null;
            if (this.socket !== socket || this.connectionGeneration !== generation) return;
            if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) socket.close()
        }, 1000)
        console.log('error')
    }

    onclose(socket, generation) {
        if (this.socket !== socket || this.connectionGeneration !== generation) return;
        const shouldReconnect = !this.closedByUser;
        this.connectionOpened = false
        this.socket = null;
        /* a kicked/dropped unit kept the focus: the main cell and camera stayed frozen for
         * the whole reconnect backoff. A dropped socket is no death: no game-over menu, the
         * unit reconnects in its slot */
        if (this.active) this.terminate('disconnect');
        else if (window.multiboxPlayerEnabled === this.number && legendmod.play) lmSetMbUnit(0);
        if (this.player && typeof lmMbPlayerEvent === 'function') lmMbPlayerEvent('playerDisconnected', this, shouldReconnect ? 'reconnect' : '');
        this.flushCellsData()
        this._lmDropLooks()
        this.resetConnectionState()
        console.log('closed')
        if (shouldReconnect) {
            /*
             * Exponential backoff with a cap. Reconnecting every second forever
             * resent a dead/expired token and, after "login elsewhere", kicked
             * the other session every second.
             */
            if (this._openedAt && Date.now() - this._openedAt > 60000) this._reconnectAttempts = 0;
            this._openedAt = 0;
            this._reconnectAttempts = (this._reconnectAttempts || 0) + 1;
            if (this._reconnectAttempts > 8) {
                console.warn('[SPECT] Unit ' + this.number + ' gave up reconnecting after 8 attempts');
                /* a spectator stays in spects and holds its slot (a Full Map tile is not opened
                 * again by LM.addSpect); window.lmFullMapRetry reconnects it */
                if (!this.player) { this._lmTileState = 'failed'; this._lmTileReason = 'gave up after 8 reconnects'; }
                return;
            }
            var reconnectDelay = Math.min(30000, 1000 * Math.pow(2, this._reconnectAttempts - 1));
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                if (!this.closedByUser && this.connectionGeneration === generation) this.connect();
            }, reconnectDelay);
        }
    }

    closeConnection() {
        this.closedByUser = true
        /* A closed unit must not keep the multibox login slot. */
        if (window.MultiPending === this) window.MultiPending = null
        if (this._multiPendingTimer) { clearTimeout(this._multiPendingTimer); this._multiPendingTimer = null }
        this.connectionGeneration = lmSpectNextGen(this)
        this.clearAsyncState()
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            try {
                this.socket.close();
            } catch (error) {
            }
            this.socket = null;
            this.ws = null;
        }
        this.flushCellsData()
        this._lmDropLooks()
        this.resetConnectionState()
        this.closedByUser = true
    }

    flushCellsData() {
        this.isSpectateEnabled = false
        this.isFreeSpectate = false;
        this.ghostCells = [];
        //this.indexedCells = {};
        //this.deletefromObject("indexedCells")
        //this.cells = [];
        //this.deleteFromArray("cells")
        /* only this unit's own cells leave playerCellsMulti, from its own index (no scan of
         * all units' cells); also when the world dropped them without removeCell() (main
         * connection flush) */
        this._lmOwnClear();
        //this.food = [];
        //this.viruses = [];
        //this.deleteFromArray("viruses")
        /* only this connection's cells, from its own index (no scan of the world's cells) */
        const ownedCells = typeof lmObsOfSource === 'function' ? lmObsOfSource(this.number) : null;
        if (ownedCells) {
            for (let cell of Array.from(ownedCells)) {
                if (cell.spectator === this.number) cell.removeCell();
                else lmObsUntrack(cell);
            }
        }
        /* its pellets are gone, so the food list forgets this connection too: the number is
         * reused (Full Map off / on, reconnect) and an old "fed last frame" kept the next
         * connection's pellets that came before its orientation was verified out of the list
         * for good (no frame in between: hidden tab, food hidden), and an old transform placed
         * all its pellets again on the first frame (ogario.v4.js lmFoodFrame) */
        if (typeof _lmFood !== 'undefined' && _lmFood) {
            _lmFood.feed.delete(this.number);
            _lmFood.sig.delete(this.number);
        }
    }

    /* The shared colours seen on this connection (ogario.v4.js _lmMbLooks, keyed by number and
     * socket generation) end with its socket: they were only dropped with the whole world or at
     * the size cap (which also dropped the live connections' ones), and a new spectator with the
     * same number and generation (Full Map off / on) read the old one's colours. */
    _lmDropLooks() {
        if (typeof _lmMbLooks === 'undefined' || !_lmMbLooks || !_lmMbLooks.size) return;
        var p = this.number + '.';
        _lmMbLooks.forEach(function (v, k) { if (k.lastIndexOf(p, 0) === 0) _lmMbLooks.delete(k); });
    }

    /* Removes this connection's cells that came from another socket generation. */
    _lmDropOtherGenerations(generation) {
        const ownedCells = typeof lmObsOfSource === 'function' ? lmObsOfSource(this.number) : null;
        if (!ownedCells || !ownedCells.size) return;
        for (let cell of Array.from(ownedCells)) {
            if (cell._lmGen !== generation) cell.removeCell();
        }
    }

    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    }

    createView(value) {
        return new DataView(new ArrayBuffer(value));


    }

    sendBuffer(data) {
        if (this.isSocketOpen()) this.socket.send(data.buffer);
    }

    sendMessage(message) {
        if (this.connectionOpened && this.integrity) {
            if (!this.clientKey) {
                return;
            }
            message = this.shiftMessage(message, this.clientKey);
            this.clientKey = this.shiftKey(this.clientKey);
        }
        this.sendBuffer(message);

    }

    sendAction(action) {
        if (!this.isSocketOpen()) {
            return;
        }
        const view = this.createView(1);
        view.setUint8(0, action);
        this.sendMessage(view);

    }

    /*
     * If the multibox login popup is cancelled or blocked, window.MultiPending
     * stayed set and hijacked the next MAIN login. Release it after 60 s and let
     * this unit play as guest.
     */
    _armMultiPendingTimeout(releaseOnly) {
        var spect = this, gen = this.connectionGeneration;
        if (this._multiPendingTimer) clearTimeout(this._multiPendingTimer);
        this._multiPendingTimer = setTimeout(function () {
            spect._multiPendingTimer = null;
            if (window.MultiPending === spect) {
                window.MultiPending = null;
                console.warn('[SPECT] Multibox login not completed; continuing as guest');
                /* only on the socket that waited (a later one sent its nick itself) */
                if (!releaseOnly && !spect.closedByUser && spect.connectionGeneration === gen && typeof spect.handleSendNick === 'function') spect.handleSendNick();
            }
        }, 60000);
    }
    /* this socket and slot wait for the login popup (MultiTokenReady takes its answer only for them) */
    _lmPendLogin() {
        window.MultiPending = this
        this._lmPendGen = this.connectionGeneration
        this._lmPendEpoch = this.slotEpoch
        this._armMultiPendingTimeout()
    }

    //spects[0].sendGplusToken(master.accessToken)
    getTheOppositeSocialToken() {
        /* Google id_tokens live 1 h and FB tokens 1-2 h: drop cached multibox tokens
         * older than 45 min so the login flow runs again instead of resending a dead one. */
        var maxTokenAge = 45 * 60 * 1000;
        if (master.accessTokenGPlus && !(Date.now() - (master.accessTokenGPlusAt || 0) < maxTokenAge)) master.accessTokenGPlus = null;
        if (master.accessTokenFB && !(Date.now() - (master.accessTokenFBAt || 0) < maxTokenAge)) master.accessTokenFB = null;
        if (master.context === "facebook") {
            if (master.accessTokenGPlus) {
                MultiTokenReady(this)
            } else {
                this._lmPendLogin()
                document.getElementById("gplusLogin").click()
                //this.handleSendNick()
                console.log('[SPECT] Login Tokens - Main: Google, Multi: Facebook')
            }
        } else if (master.context === "google") {
            if (master.accessTokenFB) {
                MultiTokenReady(this)
            } else if (!(window.FB && typeof window.FB.login === "function")) {
                /* Facebook SDK not available (blocked): master.facebookLogin() would show a
                 * blocking alert inside the socket handler. Play this unit as guest. */
                if (!this._fbUnavailableToastShown && typeof toastr !== "undefined") {
                    this._fbUnavailableToastShown = true;
                    toastr.warning('<b>[' + lmT('game2.tag.multibox') + ']:</b> ' + lmT('game2.spFbGuest'));
                }
                this.handleSendNick()
            } else {
                this._lmPendLogin()
                master.facebookLogin()
                console.log('[SPECT] Login Tokens - Main: Facebook, Multi: Google')
            }
            //this.handleSendNick()
        } else if (!master.context) {
            //this.sendGplusToken(localStorage.getItem("accessTokenGPlus"))
            console.log('[SPECT] Login Tokens - Main: No, Multi: No')
            this.handleSendNick()
        } else {
            console.log('[SPECT] Login Tokens - Main: No, Multi: No')
            this.handleSendNick()
        }
    }

    sendFbToken(token) {
        this.sendAccessToken(token, 2);
    }

    sendGplusToken(token) {
        this.sendAccessToken(token, 4);
    }

    sendAccessToken(shapes, options, oW) {
        if (!this.integrity) {
            return
        }
        if (this.accessTokenSent) {
            return;
        }
        if (!oW) {
            oW = 102;
        }
        const curr = shapes.length;
        const count = legendmod.clientVersionString.length;
        let data = [oW, 8, 1, 18];
        application.writeUint32(data, curr + count + 23);
        data.push(8, 10, 82);
        application.writeUint32(data, curr + count + 18);
        data.push(8, options, 18, count + 8, 8, 5, 18, count);
        let prev = 0;
        for (; prev < count; prev++) {
            data.push(legendmod.clientVersionString.charCodeAt(prev));
        }
        data.push(24, 0, 32, 0, 26);
        application.writeUint32(data, curr + 3);
        data.push(10);
        application.writeUint32(data, curr);
        prev = 0;
        for (; prev < curr; prev++) {
            data.push(shapes.charCodeAt(prev));
        }
        data = new Uint8Array(data);
        const raw_basefont = new DataView(data.buffer);
        this.sendMessage(raw_basefont);
        /* Servers no longer send 103, so mark the token as sent here (as the main
         * client does); re-sending it on an authenticated socket gets it kicked.
         * resetConnectionState() clears it for the next connection. */
        this.accessTokenSent = true;
    }

    sendCursor() {
        if (this.positionController) clearInterval(this.positionController);
        this.positionController = setInterval(() => {
            /* orientation not verified (transformReady): no cursor or keep-moving offset goes
             * out through the guessed transform, the unit holds on its centre (_lmAimSend) */
            var held = this.player === true && typeof this.transformReady === 'function' && !this.transformReady();
            if (legendmod.pause) {
                this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
            } else if (window.multiboxPlayerEnabled === this.number || this.isFreeSpectate || window.multiboxFollowMouse) {
                /* Only the controlled unit follows the cursor (any truthy value moved every unit).
                 * Same rules as the main cell: line lock / dance aim, and no update while a crazy
                 * double split holds the position (window.lockPosition). */
                this._lmAimSend();

                /* Keep-moving offset in world units (playerX/Y are client space): a raw delta of
                 * this socket ran the other way after a background reconnect on a mirrored socket. */
                this.distX = held ? 0 : this.rawToWorldX(this.convertX(legendmod.cursorX)) - this.rawToWorldX(this.convertX(this.playerX))
                this.distY = held ? 0 : this.rawToWorldY(this.convertY(legendmod.cursorY)) - this.rawToWorldY(this.convertY(this.playerY))
            } else {
                /* "Freeze inactive multibox unit": hold it at its own centre. With "Keep moving"
                 * off too it holds as well, as the inactive main player does (LM.sendPosition): it
                 * sent nothing and kept running to the last target. */
                if ((defaultmapsettings.mbFreeze || !defaultmapsettings.multiKeepMoving || held) && Number.isFinite(this.playerX) && Number.isFinite(this.playerY)) {
                    this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
                } else if (defaultmapsettings.multiKeepMoving) {
                    this.sendPosition(Math.round(this.worldToRawX(this.rawToWorldX(this.convertX(this.playerX)) + this.distX)),
                        Math.round(this.worldToRawY(this.rawToWorldY(this.convertY(this.playerY)) + this.distY)));
                }
            }
        }, 40); /* 40 ms like the main cell's cursor (was 50) */
        //this.sendSpectate()
        //this.sendFreeSpectate()
    }

    /* The aim sent by the cursor loop and before a split or feed (as LM.sendPosition() before the
     * main player's): line lock / dance aim, nothing while a crazy double split holds the
     * position of the controlled unit. */
    _lmAimSend() {
        if (window.lockPosition && window.multiboxPlayerEnabled === this.number) return false;
        /* orientation not verified: the cursor would go out through a guessed (maybe mirrored)
         * transform and steer the unit away from it; it holds on its own centre (exact: that
         * centre comes from its own raw positions through the same transform) */
        if (this.player === true && typeof this.transformReady === 'function' && !this.transformReady()) {
            if (!Number.isFinite(this.playerX) || !Number.isFinite(this.playerY)) return false;
            return this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
        }
        var aim = this._lmAimTarget();
        return this.sendPosition(this.convertX(aim[0]), this.convertY(aim[1]));
    }

    /* LMEvents 'split' for a split of this unit, as LM.sendSplit for the main player's, with unit:
     * its number (count: pieces asked for, before: its own cells then) */
    _lmEmitSplit(count) {
        var E = window.LMEvents;
        if (!this.player || !this.active || !E || typeof E._has !== 'function' || !E._has('split')) return;
        var own = typeof this.getOwnPlayerCells === 'function' ? this.getOwnPlayerCells() : null;
        E.emit('split', { time: Date.now(), count: count, before: own ? own.length : 0, unit: this.number });
    }

    /* Cursor target for the controlled unit, in client space (like legendmod.cursorX/Y).
     * Mirrors LM.sendPosition: line lock snaps to the nearest of 8 directions, dance spins;
     * a running line split keeps its locked cursor (legendmod.cursorX/Y) over both. */
    _lmAimTarget() {
        var cx = legendmod.cursorX, cy = legendmod.cursorY;
        if ((window.followStraight || legendmod.dance) && !legendmod.lineSplitActive && window.multiboxPlayerEnabled === this.number &&
            Number.isFinite(this.playerX) && Number.isFinite(this.playerY)) {
            var d;
            if (window.followStraight) {
                var dx = cx - this.playerX, dy = cy - this.playerY;
                if (dx || dy) {
                    d = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 10) % 8;
                    this._lmLineDir = d;
                } else {
                    d = this._lmLineDir;
                }
            } else {
                d = ~~((Date.now() / 40) % 8);
            }
            if (d !== undefined) {
                var DX = [0, 1, 1, 1, 0, -1, -1, -1], DY = [-1, -1, 0, 1, 1, 1, 0, -1], D = 50000;
                cx = this.playerX + DX[d] * D;
                cy = this.playerY + DY[d] * D;
            }
        }
        return [cx, cy];
    }

    sendSpectate() {
        this.isSpectateEnabled = true
        this.sendAction(1);
    }

    sendFreeSpectate() {
        this.isFreeSpectate = !this.isFreeSpectate
        /* In-game spectator (no static tile position): free spectate follows the
         * cursor. staticX is null for it, never 0, so this branch was dead. */
        if (this.staticX == null) {
            if (this.isFreeSpectate) {
                this.sendCursor()
            } else {
                clearInterval(this.positionController)
                this.positionController = null
            }
        }
        this.sendAction(18);
    }

    /*
     * Full Map: hold this spectator's free camera on its tile. The target goes out at once and
     * every LM_TILE_MOVING_MS (500 ms) while the camera (opcode 17) is on its way or has drifted
     * off (checked every 100 ms); once the camera
     * sits on the target it is only refreshed every LM_TILE_REFRESH_MS (the server keeps the last
     * target, so the old 50 ms resend of an unchanged target was 20 packets a second per
     * spectator for nothing). A changed raw target (orientation or offset found, Rotate Map,
     * recalibration) is sent at once. Nothing is sent before both borders are known: the target
     * was sent unconverted, i.e. to the wrong place, until then.
     */
    startStaticPositionController() {
        if (this.staticPositionController) clearInterval(this.staticPositionController);
        this.staticPositionController = null;
        if (this.staticX == null || this.staticY == null) return;
        this._lmTileSentAt = 0;
        this._lmTileChangedAt = 0;
        this._lmTileSentOn = false;
        this._lmTileSentX = this._lmTileSentY = NaN;
        this.staticPositionController = setInterval(() => this._lmTileTick(), 100);
    }

    /* A world rectangle [minX, minY, maxX, maxY] in the main connection's display space (its
     * frame, then Rotate Map), where getX draws this connection's cells; sorted again after the
     * flip. null until the main border is fixed. */
    _lmWorldRectDisplay(r, out) {
        var LM = legendmod;
        if (!r || !LM || !LM.mapOffsetFixed) return null;
        var x0 = lmDisplayFlip(lmMainCentre(0) + r[0] / lmMainScale(0), 0), x1 = lmDisplayFlip(lmMainCentre(0) + r[2] / lmMainScale(0), 0);
        var y0 = lmDisplayFlip(lmMainCentre(1) + r[1] / lmMainScale(1), 1), y1 = lmDisplayFlip(lmMainCentre(1) + r[3] / lmMainScale(1), 1);
        if (!Number.isFinite(x0) || !Number.isFinite(x1) || !Number.isFinite(y0) || !Number.isFinite(y1)) return null;
        var o = out || [0, 0, 0, 0];
        o[0] = Math.min(x0, x1); o[1] = Math.min(y0, y1); o[2] = Math.max(x0, x1); o[3] = Math.max(y0, y1);
        return o;
    }

    /* Show viewports: this connection's server view around its server camera, drawn where its
     * cells are drawn. out: an array to fill instead of a new one (the ghost cells' coverage,
     * every frame); anyAge: also from a camera that is not fresh (_lmServerViewWorld) */
    _lmServerViewDisplay(out, anyAge) {
        return this._lmWorldRectDisplay(this._lmServerViewWorld(_lmSvWorld, anyAge), out);
    }

    /* The tile centre in the main connection's display space (world -> main frame with its
     * centre and scale, then Rotate Map), where getX draws this connection's cells; null until
     * the main border is fixed. */
    _lmTileDisplay() {
        var LM = legendmod;
        if (this.staticX == null || this.staticY == null || !LM || !LM.mapOffsetFixed) return null;
        var x = lmDisplayFlip(lmMainCentre(0) + this.staticX / lmMainScale(0), 0);
        var y = lmDisplayFlip(lmMainCentre(1) + this.staticY / lmMainScale(1), 1);
        return (Number.isFinite(x) && Number.isFinite(y)) ? [x, y] : null;
    }

    /* The tile centre in this connection's raw frame (what opcode 16 carries); null until this
     * connection's border is fixed too, and until its orientation is verified or
     * LM_TILE_UNVERIFIED_MS after its border (sent with the PROVISIONAL "not mirrored" guess, a
     * mirrored connection flew to the mirror tile first; the timed fallback still sends it so
     * food-only verification can happen). */
    _lmTileRaw(now) {
        if (!this.mapOffsetFixed || this.staticX == null || this.staticY == null || !legendmod || !legendmod.mapOffsetFixed) return null;
        if (!this._lmFeedOk() && !((now || Date.now()) - (this._lmOffsetFixedAt || 0) >= LM_TILE_UNVERIFIED_MS)) return null;
        /* canonical world -> this connection's raw (scale, mirror and offset; Rotate Map is
         * display only, so it does not move the tile) */
        var x = Math.round(this.worldToRawX(this.staticX)), y = Math.round(this.worldToRawY(this.staticY));
        return (Number.isFinite(x) && Number.isFinite(y)) ? [x, y] : null;
    }

    /* is the server camera (opcode 17) on the tile (raw target, default the current one)? Only a
     * fresh camera: an old one is where the camera was, not where it is. */
    _lmTileArrived(raw, now) {
        raw = raw || this._lmTileRaw(now);
        return !!(raw && this._lmCamFresh(now) && Number.isFinite(this.viewX) && Number.isFinite(this.viewY) &&
            Math.abs(this.viewX - raw[0]) <= LM_TILE_SETTLED && Math.abs(this.viewY - raw[1]) <= LM_TILE_SETTLED);
    }

    /* Is the server camera (opcode 17) current? It is at most LM_CAM_FRESH_MS old, or it is a
     * Full Map tile camera that sits on the last target sent, reported after that target was
     * set (or that already sat on that target when it was sent: no newer 17 comes for a camera
     * that does not move), while the socket is open and world updates keep coming
     * (LM_TILE_STALE_MS). How often agar.io sends 17 to a camera that does not move is not
     * measured (live, settled cameras sit exactly on their integer target): if only on change,
     * the age alone made every settled tile stalled after a second. */
    _lmCamFresh(now) {
        if (!(this._lmCamAt > 0)) return false;
        now = now || Date.now();
        if (now - this._lmCamAt <= LM_CAM_FRESH_MS) return true;
        if (this.tile == null || !(this._lmCamAt > (this._lmTileChangedAt || 0) || this._lmTileSentOn === true) || !this.isSocketOpen()) return false;
        var w = this._lmWorldStamp();
        return w > 0 && now - w <= LM_TILE_STALE_MS &&
            Math.abs(this.viewX - this._lmTileSentX) <= LM_TILE_SETTLED && Math.abs(this.viewY - this._lmTileSentY) <= LM_TILE_SETTLED;
    }

    /* time of the last whole world update (_lmWorldAt, set by updateCells once it is parsed to
     * its end; 0 before the first one of this socket) */
    _lmWorldStamp() {
        return this._lmWorldAt || 0;
    }

    /* socket open, camera fresh and a world packet within LM_TILE_STALE_MS */
    _lmFresh(now) {
        now = now || Date.now();
        var w = this._lmWorldStamp();
        return this.isSocketOpen() && this._lmCamFresh(now) && w > 0 && now - w <= LM_TILE_STALE_MS;
    }

    /* May this connection's server view stand for what is there (ghost cells, the settled
     * viewport box)? Fresh (_lmFresh) and its transform verified (_lmFeedOk). */
    _lmCoverageOk(now) {
        return this._lmFresh(now) && this._lmFeedOk();
    }

    /* A spectator's state: failed / refused / captcha as stored (the connection was stopped);
     * otherwise connecting (no open socket, or open without a fresh view for less than
     * LM_TILE_STALE_MS), stalled (open, no fresh view after that), calibrating (orientation not
     * verified), moving (a Full Map tile on its way) or live. */
    _lmTileStateNow(now) {
        var st = this._lmTileState;
        if (st === 'failed' || st === 'refused' || st === 'captcha') return st;
        now = now || Date.now();
        if (!this.isSocketOpen()) st = 'connecting';
        else if (!this._lmFresh(now)) st = this._openedAt && now - this._openedAt > LM_TILE_STALE_MS ? 'stalled' : 'connecting';
        else if (!this._lmFeedOk()) st = 'calibrating';
        else if (this.tile != null && !this._lmTileArrived(null, now)) st = 'moving';
        else st = 'live';
        this._lmTileState = st;
        return st;
    }

    /* A spectator the server will not serve (114 spectate mode full, 85 captcha): closed without
     * a reconnect but kept in spects with its state, so its Full Map slot is not opened again
     * until Full Map goes off and on. One toast per grid: the first tile stopped for this reason. */
    _lmSpectStop(state, reason, text) {
        var first = !spects.some(function (s) { return s && s !== this && !s.player && s._lmTileState === state; }, this);
        this.closeConnection();
        this._lmTileState = state;
        this._lmTileReason = reason;
        if (first) toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + lmT(text));
    }

    /* opcode 114: refused unless this spectator is served anyway (a fresh view, _lmFresh) within
     * LM_TILE_STALE_MS; the mark goes with the socket (clearAsyncState) */
    _lmRefusePending() {
        if (this._lmRefuseTimer) return;
        var gen = this.connectionGeneration;
        this._lmRefuseTimer = setTimeout(() => {
            this._lmRefuseTimer = null;
            if (this.closedByUser || this.connectionGeneration !== gen || this._lmFresh()) return;
            this._lmSpectStop('refused', 'spectate mode is full (opcode 114)', 'pkg.fmg4w.spRefused');
        }, LM_TILE_STALE_MS);
    }

    _lmTileTick(now) {
        now = now || Date.now();
        var raw = this._lmTileRaw(now);
        if (!raw) return;
        var changed = raw[0] !== this._lmTileSentX || raw[1] !== this._lmTileSentY;
        /* a camera reported after the target was set (a refresh of the same target does not count:
         * with 17 only on change, comparing with the last send made a settled tile unsettled), or
         * one already on the target when it was set (the centre tile's camera starts there) */
        var settled = !changed && (this._lmCamAt > (this._lmTileChangedAt || 0) || this._lmTileSentOn === true) && this._lmTileArrived(raw, now);
        if (!changed && now - this._lmTileSentAt < (settled ? LM_TILE_REFRESH_MS : LM_TILE_MOVING_MS)) return;
        if (this.sendPosition(raw[0], raw[1])) {
            if (changed) {
                this._lmTileChangedAt = now;
                this._lmTileSentOn = this._lmCamAt > 0 && Number.isFinite(this.viewX) && Number.isFinite(this.viewY) &&
                    Math.abs(this.viewX - raw[0]) <= LM_TILE_SETTLED && Math.abs(this.viewY - raw[1]) <= LM_TILE_SETTLED;
            }
            this._lmTileSentAt = now;
            this._lmTileSentX = raw[0];
            this._lmTileSentY = raw[1];
        }
    }

    sendBotEject() { //specific private servers
        this.sendAction(23);
    }

    sendBotSplit() { //specific private servers
        this.sendAction(22);
    }

    sendEject() {
        /* aim like the split (it sent the raw cursor: no line lock / dance, no held position) */
        this._lmAimSend();
        this.sendAction(21);
    }

    sendSplit() {
        /* aim like the cursor loop (line lock / dance); a crazy split keeps the held position */
        this._lmAimSend();
        this._lmEmitSplit(1);
        this.sendAction(17);
    }

    /*
     * window.core routes double/triple/quad split and freeze to the active
     * multibox unit; these were missing and threw a TypeError. Same opcodes as
     * the main client (LM.sendDoubleSplit etc.).
     */
    _usesMultiSplitOpcodes() {
        var type = window.legendmod && window.legendmod.serverType;
        return type === 'imsolo' || type === 'agar2' || type === 'garix' || type === 'private';
    }

    /* the atomic opcodes aim as sendSplit does (they sent the raw cursor) and send one 'split'
     * event for all pieces, as the main player's; the fallback's single splits send their own */
    sendDoubleSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this._lmAimSend();
            this._lmEmitSplit(2);
            this.sendAction(28);
        } else {
            this.sendSplit(); this.sendSplit();
        }
    }

    sendTripleSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this._lmAimSend();
            this._lmEmitSplit(3);
            this.sendAction(26);
        } else {
            this.sendSplit(); this.sendSplit(); this.sendSplit();
        }
    }

    sendQuadSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this._lmAimSend();
            this._lmEmitSplit(4);
            this.sendAction(27);
        } else {
            this.sendSplit(); this.sendSplit(); this.sendSplit(); this.sendSplit();
        }
    }

    sendPlayerFreeze() {
        if (this._usesMultiSplitOpcodes()) this.sendAction(32);
    }

    sendNick(nick) {
        if (!this.active) { //if cell didn't start
            //console.log(nick)
            //this.sendNickOnce=true
            const self = this;
            this.playerNick = nick;
            const sendSpawn = function (token) {
                //var token = grecaptcha.getResponse();
                nick = window.unescape(window.encodeURIComponent(self.playerNick));
                const view = self.createView(1 + nick.length + 1 + token.length + 1);
                let pos = 1;
                for (let length = 0; length < nick.length; length++, pos++) view.setUint8(pos, nick.charCodeAt(length))
                pos++
                for (let length = 0; length < token.length; length++, pos++) view.setUint8(pos, token.charCodeAt(length));
                self.sendMessage(view);
            };
            /* Like the main client (LM.sendNick) and Delta: spawn with token "0" on every
             * server. agar.io asks for a v3 token with opcode 87 when it wants one (case 87
             * answers it with 88), so the unit no longer waits up to 20 s for reCAPTCHA. */
            sendSpawn("0");
        }
    }

    sendPosition(x, y) {
        if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
            return;
        }
        let sendX = x;
        let sendY = y;
        if (this.player === true && !this.active && Number.isFinite(this.targetX) && Number.isFinite(this.targetY)) {
            sendX = this.targetX;
            sendY = this.targetY;
        }
        if (!Number.isFinite(sendX) || !Number.isFinite(sendY)) return;
        const view = this.createView(13);
        view.setUint8(0, 16);
        view.setInt32(1, sendX, true);
        view.setInt32(5, sendY, true);
        this.targetX = sendX;
        this.targetY = sendY;
        view.setUint32(9, this.protocolKey, true);
        this.sendMessage(view);
        return true;
    }

    generateClientKey(ip, options) {
        if (!ip.length || !options.byteLength) {
            return null;
        }
        let x = null;
        const Length = 1540483477;
		
        //const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
		// new code 6/8/2024
		var parsedUrl = new URL(ip);
		var ipCheck = parsedUrl.hostname + parsedUrl.pathname.replace(/\/$/g, '');
		
        const newLength = ipCheck.length + options.byteLength;
        const uint8Arr = new Uint8Array(newLength);
        for (let length = 0; length < ipCheck.length; length++) {
            uint8Arr[length] = ipCheck.charCodeAt(length);
        }
        uint8Arr.set(options, ipCheck.length);
        const dataview = new DataView(uint8Arr.buffer);
        let type = newLength - 1;
        const value = (type - 4 & -4) + 4 | 0;
        let newValue = type ^ 255;
        let offset = 0;
        while (type > 3) {
            x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
            newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
            type -= 4;
            offset += 4;
        }
        switch (type) {
            case 3:
                newValue = uint8Arr[value + 2] << 16 ^ newValue;
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 2:
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 1:
                break;
            default:
                x = newValue;
                break;
        }
        if (x !== newValue) {
            x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
        }
        newValue = x >>> 13;
        x = newValue ^ x;
        x = Math.imul(x, Length) | 0;
        newValue = x >>> 15;
        x = newValue ^ x;
        //console.log('[SPECT] Generated client key:', x);
        return x;
    }

    shiftKey(key) {
        const value = 1540483477;
        key = Math.imul(key, value) | 0;
        key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, value) | 0;
        return key >>> 15 ^ key;
    }

    shiftMessage(view, key, write) {
        let length;
        if (!write) {
            for (length = 0; length < view.byteLength; length++) {
                view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
            }
        } else {
            for (length = 0; length < view.length; length++) {
                view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
            }
        }
        return view;
    }

    decompressMessage(message) {
        /* the main client's decoder (it refuses a block that decodes short: the zero tail
         * read as cell records); the copy below is only for a core without it */
        const main = window.legendmod && window.legendmod.decompressMessage;
        if (typeof main === 'function') return main.call(window.legendmod, message);
        const buffer = window.buffer.Buffer;

        if (!message ||
            !message.buffer ||
            typeof message.byteLength !== "number") {
            throw new TypeError(
                "Invalid compressed spectator packet object"
            );
        }

        const messageBuffer =
            new buffer(
                message.buffer,
                message.byteOffset || 0,
                message.byteLength
            );

        const MAX_COMPRESSED_PACKET_SIZE =
            8 * 1024 * 1024;

        const MAX_DECOMPRESSED_PACKET_SIZE =
            32 * 1024 * 1024;

        const MAX_COMPRESSION_RATIO =
            256;

        if (messageBuffer.length < 6) {
            throw new RangeError(
                "Compressed spectator packet is too short"
            );
        }

        if (messageBuffer.length >
            MAX_COMPRESSED_PACKET_SIZE) {
            throw new RangeError(
                "Compressed spectator packet exceeds size limit"
            );
        }

        const outputSize =
            messageBuffer.readUInt32LE(1);

        const compressedSize =
            messageBuffer.length - 5;

        if (!Number.isSafeInteger(outputSize) ||
            outputSize <= 0 ||
            outputSize >
                MAX_DECOMPRESSED_PACKET_SIZE) {
            throw new RangeError(
                "Invalid spectator decompressed size"
            );
        }

        if (compressedSize <= 0 ||
            outputSize >
                compressedSize *
                MAX_COMPRESSION_RATIO) {
            throw new RangeError(
                "Invalid spectator compression ratio"
            );
        }

        var src = new Uint8Array(
            message.buffer,
            (message.byteOffset || 0) + 5,
            compressedSize
        );

        /* ── Try WASM path (shared with main client) ── */
        var wasm = window._lz4wasm;
        if (wasm &&
            compressedSize <= 262144 &&
            outputSize <= 1048576) {
            wasm.mem.set(src, wasm.srcPtr);
            var decoded = wasm.decode(
                compressedSize, outputSize
            );
            if (decoded === outputSize) {
                var out = new Uint8Array(outputSize);
                out.set(
                    wasm.mem.subarray(
                        wasm.dstPtr,
                        wasm.dstPtr + decoded
                    )
                );
                return new buffer(out.buffer);
            }
            throw new RangeError(
                "Spectator LZ4 WASM decompression failed"
            );
        }

        /* ── JS fallback (typed arrays) ── */
        var dst = new Uint8Array(outputSize);
        var sPos = 0, dPos = 0;
        var sEnd = compressedSize;

        while (sPos < sEnd) {
            var token = src[sPos++];

            var litLen = token >>> 4;
            if (litLen === 15) {
                var addByte;
                do {
                    addByte = src[sPos++];
                    litLen += addByte;
                } while (addByte === 255);
            }
            if (sPos + litLen > sEnd) {
                throw new RangeError(
                    "LZ4: literal run out of bounds (spectator)"
                );
            }
            if (litLen > 0) {
                dst.set(
                    src.subarray(sPos, sPos + litLen),
                    dPos
                );
                sPos += litLen;
                dPos += litLen;
            }
            if (sPos >= sEnd) break;

            var offset =
                src[sPos] | (src[sPos + 1] << 8);
            sPos += 2;
            if (offset === 0) {
                throw new RangeError(
                    "LZ4: zero match offset (spectator)"
                );
            }

            var matchLen = (token & 0xF) + 4;
            if ((token & 0xF) === 15) {
                var addByte2;
                do {
                    addByte2 = src[sPos++];
                    matchLen += addByte2;
                } while (addByte2 === 255);
            }

            var matchPos = dPos - offset;
            if (offset >= matchLen) {
                dst.set(
                    dst.subarray(
                        matchPos,
                        matchPos + matchLen
                    ),
                    dPos
                );
                dPos += matchLen;
            } else {
                var mEnd = dPos + matchLen;
                while (dPos < mEnd) {
                    dst[dPos++] = dst[matchPos++];
                }
            }
        }

        if (dPos !== outputSize) {
            throw new RangeError(
                "Spectator LZ4 decompression failed"
            );
        }

        return new buffer(dst.buffer);
    }

    handleMessage(view) {
         let offset;
//view.getStringUTF8();
        let temp;
        const encode = () => {
            let text;
            for (text = ''; ;) {
                const string = view.getUint8(offset++);
                if (string === 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        offset = 0;
        let opCode = view.getUint8(offset++);
        if (opCode === 54) {
            opCode = 53;
        }
        switch (opCode) {
            case 5:

                console.log('[SPECT] case 5');

                break;

            case 17:

                /* This connection's own server camera (its server space). The main
                 * camera follows the unit's drawn cells instead (playerX/Y, see
                 * drawRender.getMultiboxFrame); these packets used to move it too,
                 * between frames and to a slightly different point.
                 * A short packet or a broken position keeps the last camera (a cut one moved x
                 * only); a scale out of (0.01, 4] keeps the last usable one (else the free
                 * spectate scale, as lmServerViewSize) and the position is still taken. */
                if (view.byteLength < offset + 12) { this._lmDecodeError('opcode 17: ' + view.byteLength + ' bytes'); break; }
                {
                    const camX = view.getFloat32(offset, true), camY = view.getFloat32(offset + 4, true), camScale = view.getFloat32(offset + 8, true);
                    if (!Number.isFinite(camX) || !Number.isFinite(camY)) { this._lmDecodeError('opcode 17: bad camera'); break; }
                    this.viewX = camX;
                    this.viewY = camY;
                    if (camScale > 0.01 && camScale <= 4) this.scale = camScale;
                    else if (!(this.scale > 0.01 && this.scale <= 4)) this.scale = LM_SPECT_FREE_SCALE;
                }
                this._lmCamAt = Date.now();
                break;
            case 18:
                /* No key rotation on 18 (same as the main client since PROTO-3 and Delta). */
                if (this.player) this.flushCellsData();
                else {
                    /* A spectator is still (free) spectating on the server: only its entities go.
                     * Its flags were cleared (the in-game spectator's cursor then stopped following
                     * while the server stayed in free spectate), and its old world kept counting
                     * as coverage. The camera stays (a settled camera may get no new 17), coverage
                     * waits for the next world update and the tile target goes out again at the
                     * next tick (as a refresh: the target itself did not change). */
                    var spOn = this.isSpectateEnabled, freeOn = this.isFreeSpectate;
                    this.flushCellsData();
                    this.isSpectateEnabled = spOn;
                    this.isFreeSpectate = freeOn;
                    this.time = 0;
                    this._lmWorldAt = 0;
                    this._lmTileSentAt = 0;
                }
                console.log('[SPECT] case 18');

                break;
            case 32:
                temp = view.getUint32(offset, true);
                /* the cell is adopted now when its record came first, else when it comes */
                this._lmOwnAdd(this.newID(temp));
                this._lmHasSpawned = true;

                this.isSpectateEnabled = false

                //this.active = true
                console.log('[SPECT] case 32');
                /*if (!this.openSecond){
                    this.openSecond = true
                    this.getTheOppositeSocialToken()
                }*/
                break;
            case 50:
                console.log('[SPECT] case 50');

                break;
            case 49: //leaderboard for specific private servers
                this.leaderboard = [];
                const count = view.getUint32(offset, true);
                offset += 4;
                for (let i = 0; i < count; ++i) {
                    let isMe = !!view.getUint32(offset, true);
                    offset += 4;
                    if (isMe) {
                        isMe = 'isPlayer'
                    }
                    let nick;
                    const rawNick = encode();
                    try {
                        nick = window.decodeURIComponent(window.escape(rawNick));
                    } catch (e) {
                        nick = rawNick || '';
                    }
                    temp = null;

                    if (nick.includes('}')) {
                        temp = nick.split('}')[0].split('{')[1]
                        nick = nick.split('}')[1]
                    }
                    if (!application.customSkinsMap[nick] && temp) {
                        core.registerSkin(nick, null, "https://dkyriak.github.io/imsolo/" + temp + ".png", null);
                        application.customSkinsMap[nick + "\'s imsolo.pro bot"] = "https://dkyriak.github.io/imsolo/" + temp + ".png"
                        //core.registerSkin(nick, null, "https://imsolo.pro/web/skins/" + temp + ".png", null);
                    }

                    this.leaderboard.push({
                        id: isMe,
                        nick: nick
                    });
                }
                break;
            //this.handleLeaderboard();
            case 53:
                this.leaderboard = [];
                this.friends = 0;
                for (let position = 0; offset < view.byteLength;) {
                    const flags = view.getUint8(offset++);
                    let nick = '';
                    let id = 0;
                    let isFriend = false;
                    let isFBFriend = false;
                    position++;
                    if (flags & 2) {
                        try {
                            nick = window.decodeURIComponent(window.escape(encode()));
                        } catch (e) {
                            nick = '';
                        }
                    }
                    if (flags & 4) {
                        id = view.getUint32(offset, true);
                        offset += 4;
                    }
                    if (flags & 8) {
                        nick = this.playerNick;
                        id = 'isPlayer';
                        this.playerPosition = position;

                    }
                    if (flags & 16) {
                        isFriend = true;
                        this.friends++;
                    }
                    this.leaderboard.push({
                        nick: nick,
                        id: id,
                        isFriend: isFriend,
                        isFBFriend: isFBFriend
                    });
                }
                break;
            case 54:

                console.log('[SPECT] case 54');
                break;

            case 69:
                /* as the main client: a cut list keeps the last ghost cells (it was cleared,
                 * then threw half-way) */
                if (view.byteLength < 3) { this._lmDecodeError('opcode 69: ' + view.byteLength + ' bytes'); break; }
                const length = view.getUint16(offset, true);
                if (3 + length * 13 > view.byteLength) { this._lmDecodeError('opcode 69: ' + view.byteLength + ' bytes for ' + length + ' records'); break; }
                offset += 2;
                this.ghostCells = [];
                for (let i = 0; i < length; i++) {
                    const x = view.getInt32(offset, true);
                    offset += 4;
                    const y = view.getInt32(offset, true);
                    offset += 4;
                    const mass = view.getUint32(offset, true);
                    offset += 4;
                    //false&&console.log(view.getUint8(offset))
                    offset += 1

                    const size = ~~Math.sqrt(100 * mass);
                    this.ghostCells.push({
                        'x': x,
                        'y': y,
                        'size': size,
                        'mass': mass
                    });
                }
                this._lmGhostTime = Date.now();
                this.GhostFix()
                break;

            case 85:
                console.log('[SPECT] case 85');
                /* A spectator: no unit died and nothing to spawn, so no terminate / menu. It was
                 * removed from spects, and LM.addSpect then opened its Full Map tile again (and
                 * met the captcha again) on the next border packet. */
                if (!this.player) {
                    this._lmSpectStop('captcha', 'captcha requested (opcode 85)', 'pkg.fmg4w.spCaptcha');
                    break;
                }
                toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + lmT('game2.spCaptchaClosed'));
                /* removed like Remove Player (its slot is free again, the others keep theirs) */
                if (typeof lmMbRemoveUnit === 'function') {
                    lmMbRemoveUnit(this, 'removed');
                    break;
                }
                this.terminate()
                /* The v2 captcha is not answered on this socket, so really close the
                 * unit: left connected it stayed in multibox switching and every
                 * respawn() on it got another 85. */
                this.closeConnection()
                var closedIndex = spects.indexOf(this)
                if (closedIndex !== -1) spects.splice(closedIndex, 1)
                if (window.multiboxPlayerEnabled === this.number) lmSetMbUnit(0)
                if (typeof lmMbSyncExists === 'function') lmMbSyncExists()
                else if (this.player && !spects.some(function (s) { return s && s.player; })) legendmod.multiBoxPlayerExists = false

                break;
            case 87:
                var _lm87Sock = this.socket, _lm87Gen = this.connectionGeneration;
                window.agarCaptcha.requestCaptchaV3("play", (a) => {
                    if (!a) return; /* as the main client */
                    /* only to the socket that asked: after a reconnect the token went to the new socket unasked */
                    if (this.socket !== _lm87Sock || this.connectionGeneration !== _lm87Gen) return;
                    const b = this.createView(2 + a.length);
                    b.setUint8(0, 88);
                    for (let c = 0; c < a.length; c++) b.setUint8(1 + c, a.charCodeAt(c));
                    b.setUint8(a.length + 1, 0);
                    this.sendMessage(b)
                });
                break;
            case 102:
                //this.sendCursor()
                //console.log("[SPECT] SendNick with")
                /* Every 102 used to (re)spawn the unit: honour "Background auto-respawn" after
                 * the first life, and never start a new spawn within 2 s of the last one. */
                /* Since these sockets ping every 3 s, the server's pong (type 31) is a 102 too:
                 * it must not trigger a spawn (spectators spawned, dead units captcha'd every 3 s). */
                var _lm102Type = -1;
                try {
                    var _lm102 = window.decodeMobileData(new Uint8Array(view.buffer, view.byteOffset + 1, view.byteLength - 1));
                    if (_lm102 && _lm102.uncompressedData) _lm102Type = _lm102.uncompressedData.type;
                } catch (e102) { }
                /* Spectator sockets never spawn. */
                if (this.player && _lm102Type !== 31 &&
                    (!this._lmHasSpawned || defaultmapsettings.mbAutoRespawn !== false) &&
                    Date.now() - (this._lmLastSpawnReq || 0) > 2000) {
                    this._lmLastSpawnReq = Date.now();
                    this.handleSendNick()
                }
                console.log('[SPECT] case 102');
                //console.log(Date.now() - this.timeStarted, this.player, this.active, this.annoucementTold)
                if (Date.now() - this.timeStarted > 4000 && this.player && !this.active && !this.annoucementTold) {
                    this.annoucementTold = true
                    toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + lmT('game2.spSlowStart'));
                }
                break;
            case 103:
                this.accessTokenSent = true
                console.log('[SPECT] case 103');
                application.cacheCustomSkin(ogarcopythelb.nick, ogario.playerColor, ogarcopythelb.skinURL);
                this.getTheOppositeSocialToken();
                break;
            case 104:
                console.log('[SPECT] case 104');

                break;
            case 114:
                console.error('[Agario] Spectate mode is full')
                console.log('[SPECT] case 114');
                /* the server takes no more spectators: the socket stayed open (and counted
                 * toward the per-IP limit) with a tile sender that reached nobody. Whether agar.io
                 * still serves a spectator after a 114 is not known: it is closed only if it gets
                 * no fresh view within LM_TILE_STALE_MS. */
                if (!this.player) this._lmRefusePending();

                break;
            case 160:

                console.log('[SPECT] case 160');

                break;
            case 161:
                //console.log('case 161');

                break;
            case 176:
                console.log('[SPECT] case 176');

                break;
            case 177:
                console.log('[SPECT] case 177');

                break;
            case 178:

                console.log('[SPECT] case 178');

                break;
            case 179:

                console.log('[SPECT] case 179');

                break;
            case 180:

                console.log('[SPECT] case 180');

                break;
            case 226:
                const ping = view.getUint16(1, true);
                view = this.createView(3);
                view.setUint8(0, 227);
                /* little-endian, like the read above (main client and Delta do the same) */
                view.setUint16(1, ping, true);
                this.sendMessage(view);

                break;
            case 241:
                this.protocolKey = view.getUint32(offset, true);
                //console.log('[SPECT] Received protocol key:', this.protocolKey);
                const agarioReader = new Uint8Array(view.buffer, offset += 4);
                this.clientKey = this.generateClientKey(this.ws, agarioReader);
                if (this.integrity && !this.pingInterval) this.pingInterval = setInterval(() => this.sendPing(), 3000);
                break;
            case 242:
                console.log('[SPECT] case 242')
                this.serverTime = view.getUint32(offset, true) * 1000;
                this.serverTimeDiff = Date.now() - this.serverTime;

                if (this.player == true) {
                    /* one unit logs in with the other provider's account (lmMbTokenSlot), the
                     * others play as guests: one account on two sockets logs the other out */
                    if (typeof lmMbTokenSlot === 'function' && !lmMbTokenSlot(this)) {
                        this.handleSendNick()
                    } else if (!window.MultiWS || window.MultiWS != this.ws) {
                        window.MultiWS = this.ws
                        this.getTheOppositeSocialToken()
                    } else {
                        //console.log("[SPECT] SendNick without")
                        //this.sendCursor()
                        MultiTokenReady(this)
                        this.handleSendNick()
                    }
                } else {
                    this.sendSpectate();
                }
                if (this.staticX != null && this.staticY != null) {
                    this.startStaticPositionController();
                    if (!this.player) {

                        this.sendFreeSpectate()
                    }
                }
                break;
            case 255:
                //this.constantrecalculation2()
                this.handleSubmessage(view);
                this.beforecalculation() //render calculations i put them here to avoid another interval
                break;
            case 16: //specific private servers
                //console.log('[SPECT] case 16');
                this.updateCells(new window.buffer.Buffer(view.buffer), offset);
                //jimboy3100
                if (this.player && this.active && this.getOwnPlayerCells().length === 0) {
                    console.log('[SPECT] Multibox Player ' + this.number + ' lost');
                    this.terminate()
                }
                this.beforecalculation()
                break;
            case 64: //specific private servers
                /* setMapOffset keeps the first usable (on agar.io: full-map) border;
                 * taking only the very first packet could fix a partial one. */
                /* a cut border set some of the four sides, then threw */
                if (view.byteLength < offset + 32) { this._lmDecodeError('opcode 64: ' + view.byteLength + ' bytes'); break; }
                if (!this.mapOffsetFixed) {
                    const message = new window.buffer.Buffer(view.buffer);
                    this.viewMinX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMinY = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxY = message.readDoubleLE(offset);
                    this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                }
                /*if (~~(this.viewMaxX - this.viewMinX) === legendmod.mapSize && ~~(this.viewMaxY - this.viewMinY) === legendmod.mapSize) {
                    window.userBots.offsetX = (this.viewMinX + this.viewMaxX) / 2
                    window.userBots.offsetY = (this.viewMinY + this.viewMaxY) / 2
                }*/
                break;
                //console.log('[SPECT] case 64');

                break;
            case 56:
            case 130:
            case 182:
            case 214:
            case 240:
            case 243:
            case 254:
                break;
            default:
                console.log('[SPECT] Unknown opcode:', view.getUint8(0));
                break;
        }
    }

    handleSendNick() {
        var prof = profiles[lmUnitProfileIdx(this)] || profiles[0];
        if (prof && prof.nick && defaultmapsettings.multiBoxShadow) {
            this.sendNick(prof.nick);
            this.nick = prof.nick;
            if (prof.skinURL) {
                lmPreloadUnitSkin(prof.skinURL);
            }
        } else {
            this.sendNick($("#nick").val());
            this.nick = $("#nick").val();
        }
    }

    /* Kept for older callers: orientation now comes from detectOrientation(). */
    GhostFix() {
        this.detectOrientation();
    }

    /*
     * Offset and orientation known: positions (and the camera) can be trusted.
     * A spectator connection only once its orientation is VERIFIED (or nothing to verify);
     * a multibox unit also while CONFLICTED (it was verified on this socket: it keeps its
     * place, controls and camera while it is checked again). A PROVISIONAL unit (not
     * verified yet, the orientation a guess) has no place on this map: not for the camera,
     * the minimap and the cells round it, its own cells are drawn only where the main
     * connection confirms them (most unit sockets have a mirrored frame: the camera and its
     * cells were at the mirrored place until it was verified, 0.2 - 2.8 s), its first spawn
     * waits for it (_lmSpawnHold) and its cursor holds (_lmAimSend). Its own cell seen by the
     * main connection verifies it within two updates (lmMbFrameHide, _lmOwnCellVote). No
     * timeout ever accepts an unverified orientation: it was taken for good after 10 s
     * without top-player data, and a wrong guess was never corrected.
     */
    transformReady() {
        if (!this.mapOffsetFixed) return false;
        if (!this.integrity || this._lmSameFrame || this._lmOri === 'VERIFIED') return true;
        return this.player === true && this._lmOri === 'CONFLICTED';
    }

    /*
     * May this connection's cells and pellets take part in the cross-connection
     * reconciliation (twins, the shared food list, the food reference)? Only with its
     * transform verified: border known and orientation VERIFIED (or nothing to verify:
     * private servers, Expanding Land). PROVISIONAL and CONFLICTED sources must not
     * hide, replace or be matched with another connection's copies; a multibox unit in
     * those states draws its own cells (PROVISIONAL: only where the main connection has a
     * copy at its place; CONFLICTED: not where it has one at a mirrored place, lmMbFrameHide).
     */
    _lmFeedOk() {
        if (!this.mapOffsetFixed) return false;
        return !this.integrity || this._lmSameFrame || this._lmOri === 'VERIFIED';
    }

    _lmOriSet(state) {
        if (state !== this._lmOri) {
            /* residual evidence is per transform state; d is verified again after a new orientation or a conflict (d itself stays) */
            this._lmXfRev = (this._lmXfRev || 0) + 1;
            this._lmCalibSnaps = [];
            if (state !== 'VERIFIED') this.foodCalibrated = false;
            if (typeof lmFoodRefInvalidate === 'function') lmFoodRefInvalidate();
            /* the food list adds the pellets kept out while not fed when it sees the feed state
             * change (ogario.v4.js lmFoodFrame), but that runs only from drawFood: with no frame
             * between (hidden tab, food hidden) a round trip through CONFLICTED lost them for good */
            if (typeof _lmFood !== 'undefined' && _lmFood) _lmFood.feed.delete(this.number);
        }
        this._lmOri = state;
        this.ghostFixed = state === 'VERIFIED';
    }

    _lmOriIndex() {
        return (this.fixX < 0 ? 1 : 0) + (this.fixY < 0 ? 2 : 0);
    }

    /*
     * One decisive observation (top players or shared food) for candidate c of LM_ORI.
     * PROVISIONAL / CONFLICTED: 2 in a row verify it (3 for a candidate other than the
     * last verified one when CONFLICTED); VERIFIED: one against it makes it CONFLICTED
     * (the cells stay where they are until a candidate is verified again).
     */
    _lmOriVote(c, why) {
        if (this._lmOriStreakC === c) this._lmOriStreakN++;
        else { this._lmOriStreakC = c; this._lmOriStreakN = 1; }
        if (this._lmOri === 'VERIFIED') {
            if (c !== this._lmOriIndex()) {
                this._lmOriSet('CONFLICTED');
                console.warn('[SPECT] Unit ' + this.number + ': ' + why + ' disagree with the verified orientation; checking again');
            }
            return;
        }
        var need = this._lmOri === 'CONFLICTED' && c !== this._lmOriVerifiedC ? 3 : 2;
        if (this._lmOriStreakN < need) return;
        this._lmApplyTransform(LM_ORI[c][0], LM_ORI[c][1], this.fix3x, this.fix3y);
        this._lmOriVerifiedC = c;
        this._lmOriSet('VERIFIED');
        console.log('[SPECT] Unit ' + this.number + ' orientation vs main (x, y):', LM_ORI[c][0], LM_ORI[c][1], '(verified by ' + why + ')');
    }

    /*
     * Its own cells as the main connection sees them (lmMbFrameHide): a main copy of the same
     * server name and size only at its own place (m 0) or only at the place mirrored on x (1),
     * on y (2) or on both (3), and every own cell with such a copy agreeing. One vote for that
     * orientation per world update of this unit while it is not VERIFIED: a unit's new cell is
     * in the main view whenever the players are close, so it is verified within two updates
     * (top players and shared food took 0.2 - 2.8 s).
     */
    _lmOwnCellVote(m) {
        if (!this.mapOffsetFixed || !this.integrity || this._lmSameFrame || this._lmOri === 'VERIFIED' || !(m >= 0 && m <= 3)) return;
        var w = this._lmWorldAt || 0;
        if (!w || w === this._lmOwnVoteW) return;
        this._lmOwnVoteW = w;
        this._lmOriVote(this._lmOriIndex() ^ m, 'its own cell on the main connection');
    }

    /*
     * Is this connection's map mirrored compared with the main one?
     *
     * agar.io can give each connection a mirrored map (per axis). The top players
     * (opcode 69 "ghost cells") are the same players on both connections. Both lists go
     * to world coordinates (k * (raw - C) on each connection, main: rawX/rawY)
     * and each of the 4 candidates is scored by the players that pair up one-to-one by
     * mass AND place (lmGhostOrientationCounts); pairing by mass alone could take the
     * wrong one. Only lists received within LM_GHOST_MAX_DT of each other are compared
     * (players move: the place tolerance grows with the gap by the measured speed bound),
     * each pair of lists once, only players with one candidate of their mass in reach
     * count, a candidate must clearly win (players near a centre line fit both signs), and
     * votes are LM_GHOST_VOTE_GAP apart. Evaluated again on every new pair, also once
     * verified.
     *
     * Private servers don't mirror: nothing to detect there.
     */
    detectOrientation() {
        if (!this.mapOffsetFixed || this._lmSameFrame) return;
        if (!this.integrity) {
            if (this._lmOri !== 'VERIFIED') this._lmOriSet('VERIFIED');
            return;
        }
        var mainList = legendmod.ghostCells, mine = this.ghostCells;
        var tm = legendmod.ghostCellsTime || 0, ts = this._lmGhostTime || 0;
        if (!mainList || !mainList.length || !mine || !mine.length || !tm || !ts) return;
        var dt = Math.abs(tm - ts);
        if (dt > LM_GHOST_MAX_DT) return;
        var last = this._lmGhostPair;
        if (last && (last[0] === tm || last[1] === ts)) return;
        this._lmGhostPair = [tm, ts];
        var cmx = lmMainCentre(0), cmy = lmMainCentre(1), mkx = lmMainScale(0), mky = lmMainScale(1);
        var cx = -this.mapOffsetX, cy = -this.mapOffsetY, kx = this._lmKX || 1, ky = this._lmKY || 1;
        var ref = [], obs = [], i;
        for (i = 0; i < mainList.length; i++) {
            var m = mainList[i];
            if (m && Number.isFinite(m.rawX) && Number.isFinite(m.rawY) && m.mass > 0) ref.push({ x: (m.rawX - cmx) * mkx, y: (m.rawY - cmy) * mky, mass: m.mass });
        }
        for (i = 0; i < mine.length; i++) {
            var g = mine[i];
            if (g && Number.isFinite(g.x) && Number.isFinite(g.y) && g.mass > 0) obs.push({ x: kx * (g.x - cx), y: ky * (g.y - cy), mass: g.mass });
        }
        if (!ref.length || !obs.length) return;
        var counts = lmGhostOrientationCounts(ref, obs, LM_GHOST_TOL0 + LM_GHOST_SPEED * dt, LM_GHOST_MASS, true);
        this._lmGhostCounts = counts;
        var c = lmDecideOrientation(counts, 2, 2, 0.5);
        if (c < 0) return;
        /* the same players a second later are not a second confirmation */
        if (this._lmGhostVoteT && Math.abs(tm - this._lmGhostVoteT) < LM_GHOST_VOTE_GAP) return;
        this._lmGhostVoteT = tm;
        this._lmOriVote(c, counts[c] + ' top players');
    }

    /* Legacy setter: set the orientation and move the cells already placed. */
    setOrientation(fixX, fixY) {
        this._lmApplyTransform(fixX, fixY, this.fix3x, this.fix3y);
        this._lmOriVerifiedC = this._lmOriIndex();
        this._lmOriSet('VERIFIED');
    }

    /* the current transform as a snapshot (see lmXfFwd / lmXfInv) */
    _lmXf() {
        return {
            ok: !!this.mapOffsetFixed, same: !!this._lmSameFrame,
            cx: -this.mapOffsetX, cy: -this.mapOffsetY, sx: this.fixX, sy: this.fixY, dx: this.fix3x, dy: this.fix3y,
            kx: this._lmKX || 1, ky: this._lmKY || 1, mx: lmMainCentre(0), my: lmMainCentre(1), mkx: lmMainScale(0), mky: lmMainScale(1)
        };
    }

    /* new s and d: every cell already placed is reprojected */
    _lmApplyTransform(sx, sy, dx, dy) {
        if (sx === this.fixX && sy === this.fixY && dx === this.fix3x && dy === this.fix3y) return;
        var old = this._lmXf();
        /* pending residual evidence was measured under the old transform; a new orientation needs d verified again */
        this._lmXfRev = (this._lmXfRev || 0) + 1;
        this._lmCalibSnaps = [];
        if (sx !== this.fixX || sy !== this.fixY) this.foodCalibrated = false;
        this.fixX = sx;
        this.fixY = sy;
        this.fix3x = dx;
        this.fix3y = dy;
        if (typeof lmFoodRefInvalidate === 'function') lmFoodRefInvalidate();
        this._lmReproject(old);
    }

    /*
     * Put this connection's cells where the current transform says. The target (the
     * last packet's position) comes from the raw value stored at decode time
     * (_lmRawX/_lmRawY); the drawn and start positions of the running interpolation, and
     * every position of a cell animating its removal (it moves to its eater), are mapped
     * from the old transform to the new one. Both are affine, so this is exact for
     * points between start and target too. Rotate Map is applied the same way by both.
     * This replaces moveExistedCells / _lmRawOf, which rebuilt raw values from drawn ones.
     */
    _lmReproject(oldT) {
        var newT = this._lmXf(), gen = this.connectionGeneration;
        var mapX = function (v) { return lmXfFwd(lmXfInv(v, 0, oldT), 0, newT); };
        var mapY = function (v) { return lmXfFwd(lmXfInv(v, 1, oldT), 1, newT); };
        /* velocity (units per ms, used to extrapolate between packets) follows the linear
         * part of the map only: a flip negates it, a scale scales it, a shift leaves it */
        var kvx = mapX(1) - mapX(0), kvy = mapY(1) - mapY(0);
        this._lmForEachUnitCell(function (cell) {
            if (cell._lmVX) cell._lmVX *= kvx;
            if (cell._lmVY) cell._lmVY *= kvy;
            var live = !cell.removed && cell._lmGen === gen;
            if (Number.isFinite(cell.x)) cell.x = mapX(cell.x);
            if (Number.isFinite(cell.y)) cell.y = mapY(cell.y);
            if (Number.isFinite(cell.startX)) cell.startX = mapX(cell.startX);
            if (Number.isFinite(cell.startY)) cell.startY = mapY(cell.startY);
            if (Number.isFinite(cell.oldX)) cell.oldX = mapX(cell.oldX);
            if (Number.isFinite(cell.oldY)) cell.oldY = mapY(cell.oldY);
            if (live && Number.isFinite(cell._lmRawX)) cell.targetX = lmXfFwd(cell._lmRawX, 0, newT);
            else if (Number.isFinite(cell.targetX)) cell.targetX = mapX(cell.targetX);
            if (live && Number.isFinite(cell._lmRawY)) cell.targetY = lmXfFwd(cell._lmRawY, 1, newT);
            else if (Number.isFinite(cell.targetY)) cell.targetY = mapY(cell.targetY);
        });
    }

    /* Every cell of this unit, including those still animating their removal: its own
     * index (lmObsOfSource, ogario.v4.js) and the short list of removed cells, not a scan
     * of every cell of the world (an older core without the index: the scan). */
    _lmForEachUnitCell(fn) {
        var n = this.number;
        var mine = function (c) { return c && (c._lmSrc === n || c.spectator === n); };
        var own = typeof lmObsOfSource === 'function' ? lmObsOfSource(n) : undefined;
        if (own !== undefined) {
            if (own) own.forEach(function (c) { if (mine(c)) fn(c); });
        } else {
            var cells = legendmod.indexedCells;
            if (cells) {
                for (var id in cells) {
                    if (!Object.prototype.hasOwnProperty.call(cells, id)) continue;
                    if (mine(cells[id])) fn(cells[id]);
                }
            }
        }
        var removed = legendmod.removedCells;
        if (removed) {
            for (var r = 0; r < removed.length; r++) {
                if (mine(removed[r])) fn(removed[r]);
            }
        }
    }

    /* the contract itself (no Rotate Map): this connection's raw <-> world */
    rawToWorldX(x) { return this._lmSameFrame ? (x - lmMainCentre(0)) * lmMainScale(0) : lmRawToWorld(x, -this.mapOffsetX, this.fixX, this.fix3x, this._lmKX || 1); }
    rawToWorldY(y) { return this._lmSameFrame ? (y - lmMainCentre(1)) * lmMainScale(1) : lmRawToWorld(y, -this.mapOffsetY, this.fixY, this.fix3y, this._lmKY || 1); }
    worldToRawX(x) { return this._lmSameFrame ? x / lmMainScale(0) + lmMainCentre(0) : lmWorldToRaw(x, -this.mapOffsetX, this.fixX, this.fix3x, this._lmKX || 1); }
    worldToRawY(y) { return this._lmSameFrame ? y / lmMainScale(1) + lmMainCentre(1) : lmWorldToRaw(y, -this.mapOffsetY, this.fixY, this.fix3y, this._lmKY || 1); }
    /* a point in the main client's raw frame WITHOUT Rotate Map -> the integer raw position
     * this connection sends */
    mainToRawX(x) { return this.mapOffsetFixed ? Math.round(this.worldToRawX((x - lmMainCentre(0)) * lmMainScale(0))) : x; }
    mainToRawY(y) { return this.mapOffsetFixed ? Math.round(this.worldToRawY((y - lmMainCentre(1)) * lmMainScale(1))) : y; }

    /*
     * This connection's raw coordinates -> the main client's drawn coordinates:
     * world = s * k * (raw - C) + d, to the main frame (/ main k + main centre), then the main client's
     * Rotate Map flip. Same arithmetic as lmXfFwd(x, axis, this._lmXf()), written out
     * on its own fields (developers/tests/debugviewports.js runs it alone). Until the
     * orientation is verified the provisional one is used; a later decision reprojects.
     */
    getX(x) {
        if (this.mapOffsetFixed) {
            var res = this._lmSameFrame ? x : (this.fixX * (this._lmKX || 1) * (x + this.mapOffsetX) + this.fix3x) /
                (Number.isFinite(legendmod._lmBorderKX) && legendmod._lmBorderKX > 0 ? legendmod._lmBorderKX : 1) +
                (Number.isFinite(legendmod._lmBorderCX) ? legendmod._lmBorderCX : -legendmod.mapOffsetX);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][0]) {
                res = legendmod.mapMaxX - (res - legendmod.mapMinX);
            }
            return res;
        }
        return x;
    }

    getY(y) {
        if (this.mapOffsetFixed) {
            var res = this._lmSameFrame ? y : (this.fixY * (this._lmKY || 1) * (y + this.mapOffsetY) + this.fix3y) /
                (Number.isFinite(legendmod._lmBorderKY) && legendmod._lmBorderKY > 0 ? legendmod._lmBorderKY : 1) +
                (Number.isFinite(legendmod._lmBorderCY) ? legendmod._lmBorderCY : -legendmod.mapOffsetY);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][1]) {
                res = legendmod.mapMaxY - (res - legendmod.mapMinY);
            }
            return res;
        }
        return y;
    }

    /* Drawn coordinates (cursor, unit centre) -> the integer raw position sent to this
     * connection: the exact inverse of getX, rounded once (setInt32 truncated it, up to
     * 1 unit toward 0). */
    convertX(x) {
        if (!this.mapOffsetFixed) return x; /* getX is the identity until then too */
        return Math.round(lmXfInv(x, 0, this._lmXf()));
    }

    convertY(y) {
        if (!this.mapOffsetFixed) return y;
        return Math.round(lmXfInv(y, 1, this._lmXf()));
    }

    /* a new food pellet seen by this connection: its authoritative raw place, for the checks
     * (see lmAnchorLive); the newest LM_ANCHOR_MAX, oldest replaced first */
    _lmAnchorPush(rawX, rawY, size, now, cell) {
        if (!this._lmAnchors) return;
        var a = { sourceId: this.number, generation: this.connectionGeneration, rawId: cell ? cell._lmRawId : null,
            rawX: rawX, rawY: rawY, size: size, observedAt: now, alive: true, cell: cell || null, voted: false };
        if (this._lmAnchors.length < LM_ANCHOR_MAX) this._lmAnchors.push(a);
        else {
            var old = this._lmAnchors[this._lmAnchorNext];
            if (old) { old.alive = false; old.cell = null; }
            this._lmAnchors[this._lmAnchorNext] = a;
            this._lmAnchorNext = (this._lmAnchorNext + 1) % LM_ANCHOR_MAX;
        }
    }

    /*
     * Orientation and d from stationary food this connection shares with the main one or
     * with any connection whose orientation is verified (lmFoodReference). This replaces
     * calibrateWithFood, which matched food by id (ids need not be shared between
     * connections), used drawn positions, took the mean of 4 pellets, accepted up to 64
     * units and compared only with the main connection. Food is matched here by its
     * authoritative position (raw -> world) and size, one-to-one. For each of the 4
     * candidates: the inliers around the median residual; a clear winner with >= 8 is one
     * orientation vote (against any verified connection). With the orientation verified, on
     * every live anchor: >= 8 inliers (within 2 units of the median residual), at least half
     * the matches, and no second cluster of half their support; the median of two such checks
     * >= 1 s apart under the same transform and main frame (a change drops the pending one)
     * that agree within 1 unit either verifies d (|median| <= 1: agar.io's case, d stays 0)
     * or corrects it and reprojects the cells from raw. Only the main food and connections
     * whose d is verified can correct d; any verified connection can verify it (|median| <= 1
     * against it), so d is verified across the thin overlaps of neighbouring tiles, but a
     * neighbour with a wrong d neither sets nor moves it. Every second until the orientation
     * is verified, every 3 s until d is, then every 15 s as a watch; one odd pellet moves
     * nothing.
     */
    _lmCalibrate(now) {
        if (!this.mapOffsetFixed || this._lmSameFrame || !this._lmAnchors || this._lmAnchors.length < 8) return;
        var every = this._lmOri !== 'VERIFIED' ? 1000 : this.foodCalibrated ? 15000 : 3000;
        if (now - (this._lmCalibAt || 0) < every) return;
        this._lmCalibAt = now;
        /* every live anchor (at most LM_ANCHOR_MAX), newest first (the ring is in arrival
         * order: no sort); the newest 128 no orientation vote used yet are the evidence for the
         * next vote. A d check on a slice of them split the thin overlap with a neighbour
         * (~13-26 shared pellets) below 8 matches per check. */
        var A = this._lmAnchors, len = A.length, gen = this.connectionGeneration;
        var raw = this._lmCalRaw || (this._lmCalRaw = []), fresh = this._lmCalFresh || (this._lmCalFresh = []);
        raw.length = 0;
        fresh.length = 0;
        var start = len < LM_ANCHOR_MAX ? len - 1 : (this._lmAnchorNext - 1 + len) % len;
        for (var i = 0; i < len; i++) {
            var a = A[(start - i + len) % len];
            if (!lmAnchorLive(a, gen)) continue;
            raw.push(a);
            if (!a.voted && fresh.length < 128) fresh.push(a);
        }
        if (raw.length < 8) return;
        var ref = lmFoodReference(now);
        if (!ref.grid.n) return;
        if (this.integrity && fresh.length >= 8) {
            var stats = [], inl = [0, 0, 0, 0];
            for (var c = 0; c < 4; c++) {
                stats[c] = this._lmCalStats(ref, fresh, c);
                inl[c] = stats[c].inl;
            }
            this._lmFoodCounts = inl;
            var win = lmDecideOrientation(inl, 8, 4, 0.25);
            if (win >= 0) {
                /* these pellets were this vote's evidence: the next vote needs other ones */
                var w = stats[win];
                for (var r = 0; r < w.res.length; r++) {
                    var e = w.res[r];
                    if (Math.max(Math.abs(e[0] - w.mx), Math.abs(e[1] - w.my)) <= 2) fresh[e[2]].voted = true;
                }
                this._lmOriVote(win, inl[win] + ' shared food pellets');
                ref = lmFoodReference(now);
            }
        }
        if (this._lmOri !== 'VERIFIED') return;
        var ok = function (st) { return st.inl >= 8 && st.inl >= st.n * 0.5 && st.alt < Math.max(4, st.inl / 2); };
        /* against the main food and the connections whose d is verified: may correct d; else
         * against every verified connection: may only verify it (vonly) */
        var cur = this._lmCalStats(ref, raw, this._lmOriIndex(), true), vonly = false;
        if (!ok(cur)) {
            cur = this._lmCalStats(ref, raw, this._lmOriIndex(), false);
            if (!ok(cur) || Math.abs(cur.mx) > 1 || Math.abs(cur.my) > 1) return;
            vonly = true;
        }
        /* a snap pairs only with one of the same transform revision and main frame */
        var rev = this._lmXfRev || 0, m0 = lmMainCentre(0), m1 = lmMainCentre(1), k0 = lmMainScale(0), k1 = lmMainScale(1);
        var snaps = this._lmCalibSnaps = this._lmCalibSnaps.filter(function (q) { return q.rev === rev && q.m0 === m0 && q.m1 === m1 && q.k0 === k0 && q.k1 === k1; });
        snaps.push({ x: cur.mx, y: cur.my, n: cur.inl, vonly: vonly, rev: rev, m0: m0, m1: m1, k0: k0, k1: k1 });
        if (snaps.length > 2) snaps.shift();
        if (snaps.length < 2) return;
        if (Math.abs(snaps[0].x - snaps[1].x) > 1 || Math.abs(snaps[0].y - snaps[1].y) > 1) {
            snaps.shift();
            return;
        }
        var mx = (snaps[0].x + snaps[1].x) / 2, my = (snaps[0].y + snaps[1].y) / 2;
        if ((snaps[0].vonly || snaps[1].vonly) && (Math.abs(mx) > 1 || Math.abs(my) > 1)) {
            snaps.shift();
            return;
        }
        this._lmCalibSnaps = [];
        if (Math.abs(mx) <= 1 && Math.abs(my) <= 1) {
            if (!this.foodCalibrated) {
                console.log('[SPECT] Unit ' + this.number + ' placement verified on shared food: residual', mx.toFixed(2), my.toFixed(2), '(' + snaps[0].n + ', ' + snaps[1].n + ' pellets)');
            }
            this.foodCalibrated = true;
            return;
        }
        this._lmApplyTransform(this.fixX, this.fixY, this.fix3x + mx, this.fix3y + my);
        this.foodCalibrated = true;
        console.log('[SPECT] Unit ' + this.number + ' food calibration (fix3x, fix3y):', this.fix3x.toFixed(2), this.fix3y.toFixed(2));
    }

    /* Residuals of anchors (world under orientation candidate c) against the reference;
     * the observation objects are reused between calls. */
    _lmCalStats(ref, anchors, c, needD) {
        var cx = -this.mapOffsetX, cy = -this.mapOffsetY, sx = LM_ORI[c][0], sy = LM_ORI[c][1];
        var kx = this._lmKX || 1, ky = this._lmKY || 1;
        var pool = this._lmCalPool || (this._lmCalPool = []), obs = this._lmCalObs || (this._lmCalObs = []);
        obs.length = 0;
        for (var j = 0; j < anchors.length; j++) {
            var o = pool[j] || (pool[j] = { x: 0, y: 0, size: 0 });
            o.x = lmRawToWorld(anchors[j].rawX, cx, sx, this.fix3x, kx);
            o.y = lmRawToWorld(anchors[j].rawY, cy, sy, this.fix3y, ky);
            o.size = anchors[j].size;
            obs.push(o);
        }
        var res = lmAnchorResiduals(ref.grid, obs, 24, this.number, needD);
        var st = lmRobustOffset(res);
        st.res = res;
        return st;
    }

    /*
     * This connection's server view in world coordinates: its camera (opcode 17, raw) and
     * the measured view for its scale (lmServerViewSize): where a pellet's centre is seen (a
     * bigger cell is sent while its circle reaches into it, up to radius - 10 past). null until
     * the border and a camera are known, and while the camera is not fresh (_lmCamFresh) unless
     * anyAge (Show viewports draws an old one as "stale").
     */
    _lmServerViewWorld(out, anyAge) {
        if (!this.mapOffsetFixed || !this._lmCamAt || !Number.isFinite(this.viewX) || !Number.isFinite(this.viewY)) return null;
        if (!anyAge && !this._lmCamFresh()) return null;
        var v = lmServerViewSize(this.scale, _lmSvSize);
        var x = this.rawToWorldX(this.viewX), y = this.rawToWorldY(this.viewY);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        var o = out || [0, 0, 0, 0];
        o[0] = x - v[0] / 2; o[1] = y - v[1] / 2; o[2] = x + v[0] / 2; o[3] = y + v[1] / 2;
        return o;
    }

    /*
     * This connection's map offset, from its own border packet (opcode 64).
     *
     * Every agar.io connection gets its own coordinate offset (and a MultiOgar
     * server that scrambles coordinates does the same per client), so a unit's
     * raw coordinates are not the main client's. The offset used to be copied
     * from the main client whenever the main one was known, which left the unit
     * thousands of units off, often outside the map, until 4 shared food cells
     * were seen (never, when the units were far apart).
     *
     * agar.io also sends smaller borders during play: as on the main client,
     * only the full map (over 14000 x 14000) is used there, and the first one
     * fixes the offset for this connection.
     */
    setMapOffset(left, top, right, bottom) {
        /* four finite numbers with max at least 1 above min on both axes, as the main client's
         * _lmBorderValid: Math.abs took a reversed border (min > max) and fixed a frame from it */
        if (!(Number.isFinite(left) && Number.isFinite(top) && Number.isFinite(right) && Number.isFinite(bottom) &&
            right - left >= 1 && bottom - top >= 1)) return;
        var pWidth = right - left;
        var pHeight = bottom - top;
        if (this.mapOffsetFixed) return;
        var fullMap = pWidth > 14000 && pHeight > 14000;
        var official = this.integrity && !legendmod.isLegendWorld && legendmod.serverType !== 'deltio';
        if (official && !fullMap) return;
        /* main border not known yet (server switch: the main waits for its old socket while this
         * one is already in): the frame would be taken from the main's fallback centre and scale,
         * and nothing moved its cells when the real one came (thousands of units off for their
         * life). Kept until the main border is fixed: LM.addSpect applies it. */
        if (official && !legendmod.mapOffsetFixed) {
            this._lmPendingBorder = [left, top, right, bottom];
            return;
        }
        this._lmPendingBorder = null;

        if (legendmod.isLegendWorld) {
            /* Expanding Land: no per-connection offset and its own map convention:
             * the unit's raw frame is the main one (_lmSameFrame: getX is the
             * identity, also after the main map changes size). */
            if (legendmod.mapOffsetFixed && legendmod.mapOffsetX != null) {
                this._lmSameFrame = true;
                this.mapSize = legendmod.mapSize || 14142;
                this.mapOffset = legendmod.mapOffset || (this.mapSize / 2);
                this.mapOffsetX = legendmod.mapOffsetX;
                this.mapOffsetY = legendmod.mapOffsetY;
                this.mapMinX = legendmod.mapMinX;
                this.mapMinY = legendmod.mapMinY;
                this.mapMaxX = legendmod.mapMaxX;
                this.mapMaxY = legendmod.mapMaxY;
            } else {
                this.mapSize = (this.integrity || fullMap) ? 14142 : pWidth;
                this.mapOffset = this.mapSize / 2;
                this.mapOffsetX = this.mapOffset - right;
                this.mapOffsetY = this.mapOffset - bottom;
                this.mapMinX = -this.mapOffset - this.mapOffsetX;
                this.mapMinY = -this.mapOffset - this.mapOffsetY;
                this.mapMaxX = this.mapOffset - this.mapOffsetX;
                this.mapMaxY = this.mapOffset - this.mapOffsetY;
            }
        } else {
            this.mapSize = (official || fullMap) ? 14142 : pWidth;
            this.mapOffset = this.mapSize / 2;
            /* C = the exact centre of the full border on every server (mapOffsetX = -C).
             * On agar.io this was mapOffset - right like the main client's mapOffsetX:
             * 0.068 off the centre (the border is 14142.1356 wide), the same on both
             * connections until this one is mirrored, then 0.14 off on that axis. getX
             * adds the main client's exact centre (LM._lmBorderCX/CY). */
            this.mapOffsetX = -(left + right) / 2;
            this.mapOffsetY = -(top + bottom) / 2;
            /* k: agar.io scales every connection per axis; the full border spans the whole map */
            this._lmKX = official ? LM_WORLD_SIZE / pWidth : 1;
            this._lmKY = official ? LM_WORLD_SIZE / pHeight : 1;
            this.mapMinX = left;
            this.mapMinY = top;
            this.mapMaxX = right;
            this.mapMaxY = bottom;
        }

        /* the map centre is only a start: a camera (opcode 17) that came before the border is
         * kept (replaced by the centre, it put the view and "arrived" thousands of units off) */
        if (!this._lmCamAt) {
            this.viewX = (right + left) / 2;
            this.viewY = (bottom + top) / 2;
        }
        var placedBefore = this._lmXf(); /* identity: cells that came before the border */
        this.mapOffsetFixed = true;
        if (typeof lmFoodRefInvalidate === 'function') lmFoodRefInvalidate();
        this._lmOffsetFixedAt = Date.now();
        /* no mirroring to find on private servers and Expanding Land; on agar.io the
         * orientation starts as not mirrored (PROVISIONAL) until it is verified */
        this._lmOriSet(!this.integrity || this._lmSameFrame ? 'VERIFIED' : 'PROVISIONAL');
        if (this._lmOri === 'VERIFIED') this._lmOriVerifiedC = this._lmOriIndex();
        this._lmReproject(placedBefore);
        console.log('[SPECT] Unit ' + this.number + ' map centre (x, y):', -this.mapOffsetX, -this.mapOffsetY,
            '| main:', lmMainCentre(0), lmMainCentre(1));
        /* Ghost cells may already be here. */
        this.detectOrientation();

        if (!this.integrity) {
            if (this.player) {
                this.handleSendNick();
            } else if (!this.player) {
                this.sendSpectate();
            }
            if (this.staticX != null && this.staticY != null) {
                this.startStaticPositionController();
                if (!this.player) {
                    this.sendFreeSpectate();
                }
            }
        }
    }

    /* The unit's life ended. reason: 'death' (no own cell left; the default), 'disconnect' (its
     * socket closed: no death, so no game-over menu while something else of ours lives; it
     * reconnects in its slot, and its spawn hides the menu shown when it was the last one) or 'removed'
     * (closed for good: Remove Player, a captcha; the menu when nothing of ours lives, but a
     * later spawn does not hide it). */
    terminate(reason) {
        reason = reason === 'disconnect' || reason === 'removed' ? reason : 'death';
        /* a life of this unit ends here (once: a second call finds it inactive); wasActive: it was
         * the player you control */
        var wasAlive = this.player === true && this.active === true, wasActive = window.multiboxPlayerEnabled === this.number;
        var died = wasAlive && reason === 'death';
        this.active = false;
        this._lmFocusOnSpawn = false;
        /* the next life on this socket is a new spawn for beforecalculation: with the main player
         * dead it takes the focus (mouse and keys stayed on the dead main player) */
        this.openSecond = false;
        this.playerCellIDs = [];
        if (this.positionController) clearInterval(this.positionController);
        this.positionController = null;
        /* its time alive stops (also a lost socket or a removal); a death counts that life as the
         * main player's do (session line, personal bests, match history while controlled) */
        if (typeof lmTimeAlive === 'function') lmTimeAlive(this, 0);
        var life = died && typeof lmMbUnitLifeEnd === 'function' ? lmMbUnitLifeEnd(this, wasActive) : null;
        /* before the focus moves on: 'active' says whether it was the player you control */
        if (died && typeof lmMbPlayerEvent === 'function') {
            lmMbPlayerEvent('playerDied', this, reason, {
                mass: life ? life.mass : Math.round(+this.playerScore || 0), msAlive: life ? life.msAlive : 0,
                scope: typeof lmDeathScope === 'function' ? lmDeathScope(this.number) : 'unit'
            });
        }
        /* the life ended, as application.onPlayerDeath resets the main player: the HUD kept the
         * dead unit's score (the next life showed the best score of all lives) and mass numbers */
        if (this.player) {
            this.playerScore = 0;
            this.playerMass = 0;
            this.playerSize = 0;
            this.playerMinMass = 0;
            this.playerMaxMass = 0;
            this.playerSplitCells = 0;
            this.STE = this.MTE = this.BMTE = this.BSTE = this.TTE = this.PTE = 0;
        }

        // Auto-switch active camera to surviving multibox unit if available
        if (window.multiboxPlayerEnabled === this.number) {
            /* no other living unit: the focus stayed on this dead one and spectating then
             * followed nobody (the main camera ignores its view while a unit has focus).
             * lmMbFallbackUnit: the main player while it plays, else the next living unit in
             * slot order (never a spectator) */
            var nextUnit = 0;
            if (typeof lmMbFallbackUnit === 'function') nextUnit = lmMbFallbackUnit(this, reason);
            else if (!legendmod.play) {
                for (var s = 0; s < spects.length; s++) {
                    if (spects[s] && spects[s] !== this && lmMbAlive(spects[s])) {
                        nextUnit = spects[s].number;
                        break;
                    }
                }
            }
            lmSetMbUnit(nextUnit);
        }
        // Check if any unit is still alive (main player or other units; a spectator is no player)
        var anyAlive = legendmod.play;
        if (!anyAlive) {
            for (var i = 0; i < spects.length; i++) {
                if (lmMbAlive(spects[i])) { anyAlive = true; break; }
            }
        }
        /* a lost socket is no game over while something else of ours lives; the last living
         * player's lost socket left no menu at all (also when it never reconnected) */
        if (reason === 'disconnect' && (anyAlive || !wasAlive)) return;
        /* the player you control died, or nothing of ours lives: its Pause, permanent feed and keys
         * end with it (a background unit's death leaves the ones of the player you steer) */
        if (died && (wasActive || !anyAlive) && typeof application !== 'undefined' && application && typeof application._lmLifeInputEnd === 'function') application._lmLifeInputEnd();

        if (!anyAlive) {
            // Last unit died — show menu
            application.showMenu();
            if (reason === 'removed') return;
            /* the unit's own background respawn (after a lost socket: the one after its reconnect)
             * may hide this menu again (beforecalculation), unless the player uses it first (nick,
             * server list, death card) or it is older than LM_MB_DEATH_MENU_MS */
            window._lmMbDeathMenuAt = Date.now();
            if (!window._lmMbMenuUse && typeof document !== 'undefined' && document && document.addEventListener) {
                window._lmMbMenuUse = function (e) {
                    var t = e && e.target;
                    if (t && t.closest && t.closest('#overlays, .ogario-menu, #helloContainer')) window._lmMbDeathMenuAt = 0;
                };
                ['keydown', 'mousedown', 'touchstart', 'input', 'focusin'].forEach(function (type) {
                    document.addEventListener(type, window._lmMbMenuUse, { capture: true, passive: true });
                });
            }
        }
    }

    respawn() {
        if (!this.player) return;
        /* The player switched to this dead unit: keep the focus on it until it
         * spawns (beforecalculation used to hand it back on the next packet). */
        this._lmWantFocusAt = Date.now();
        this._lmFocusOnSpawn = true;
        if (this.isSocketOpen()) {
            /* Repeated Tab presses must not start a captcha + spawn each. */
            if (Date.now() - (this._lmLastSpawnReq || 0) <= 2000) return;
            this._lmLastSpawnReq = Date.now();
            this.handleSendNick();
        } else if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
            /* already connecting: the server's login reply (opcode 102) spawns it */
            return;
        } else {
            /* a manual respawn gets the full retry budget again */
            this._reconnectAttempts = 0;
            this.connect();
        }
    }

    handleSubmessage(message) {
        try {
            message =
                this.decompressMessage(message);
        } catch (error) {
            /* counted, one warning a minute (see _lmDecodeError); a block that cannot be decoded
             * is a world update lost like a cut one (agar.io sends its updates as opcode 255) */
            this._lmDecodeError(error);
            this._lmBadWorldUpdate();
            return;
        }

        if (!message || message.length < 1) {
            this._lmDecodeError('empty decompressed packet');
            this._lmBadWorldUpdate();
            return;
        }

        let offset = 0;
        switch (message.readUInt8(offset++)) {
            case 16:
                this.updateCells(message, offset);
                //jimboy3100
                if (this.player && this.active && this.getOwnPlayerCells().length === 0) {
                    console.log('[SPECT] Multibox Player ' + this.number + ' lost');
                    this.terminate()
                }
                break;
            case 64:
                /* see the other case 64: the first usable border wins */
                if (message.length < offset + 32) { this._lmDecodeError('opcode 64: ' + message.length + ' bytes'); break; }
                if (!this.mapOffsetFixed) {
                    this.viewMinX = (message.readDoubleLE(offset));
                    offset += 8;
                    this.viewMinY = (message.readDoubleLE(offset));
                    offset += 8;
                    this.viewMaxX = (message.readDoubleLE(offset));
                    offset += 8;
                    this.viewMaxY = (message.readDoubleLE(offset));
                    this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                } //
                //this.timer=Date.now();
                break;
            default:
                console.log('[SPECT] Unknown sub opcode:', message.readUInt8(0));
                break;
        }
    }

    updateCells(view, offset) {
        let cell;
        let length;
        let id;
        const encode = () => {
            let text;
            for (text = ''; ;) {
                const string = view.readUInt8(offset++);
                if (string === 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        /* a packet cut short changes nothing (it used to apply its first sections and throw).
         * Three in a row renew a spectator's / Full Map tile's socket: the server sends only
         * what is new or changed (a pellet once, when it comes into view), so a local flush
         * lost the food and still cells until they changed. Closed as a dropped socket closes:
         * onclose drops this generation's cells, counts the attempt (backoff, gives up after 8)
         * and reconnects; the login reply spectates and sets the tile target again. A playing
         * unit keeps its socket and world (it would lose its cells), its next whole update goes
         * on. Only for the agar.io / Expanding Land layout the pass knows (legacy MultiOgar /
         * Garix: as before). */
        if (lmSpectAgarLayout(this.integrity) && lmWorldUpdateEnd(view, offset) < 0) {
            this._lmBadWorldUpdate();
            return;
        }
        this.time = Date.now();
        this.removePlayerCell = false;
        let eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (length = 0; length < eatEventsLength; length++) {
            const eaterKey = this.newID(view.readUInt32LE(offset));
            const victimKey = this.newID(view.readUInt32LE(offset + 4));
            const eaterCell = legendmod.indexedCells[eaterKey];
            const victimCell = legendmod.indexedCells[victimKey];
            /* an own cell eaten leaves this unit's index, playerCellsMulti and playerCellIDs
             * (once: removeCell() below finds it gone); an id still waiting for its record goes too */
            if (victimCell) {
                if (this._lmOwnDrop(victimCell)) this.removePlayerCell = true;
            } else this._lmOwnForget(victimKey);

            //remove user cell id if victim was his cell
            //delete legendmod.indexedCells[victimID] //don't even wait for Legend mod, delete eaten cells here
            //console.log('victim isFood',victimID.isFood)
            offset += 8;
            /* The victim is gone even when this connection does not know the eater (out of
             * its view): the server sends no removal for it afterwards, so it stayed drawn. */
            if (victimCell) {
                /* Same eat animation as the main connection: moveCell() runs from
                 * start to target over the animation time, counted from updateTime. */
                victimCell.startX = victimCell.x;
                victimCell.startY = victimCell.y;
                victimCell.startSize = victimCell.size;
                victimCell.targetX = eaterCell ? eaterCell.x : victimCell.x;
                victimCell.targetY = eaterCell ? eaterCell.y : victimCell.y;
                victimCell.targetSize = victimCell.size;
                victimCell.time = victimCell.updateTime = this.time;
                victimCell.removeCell(true);
            }
        }
        for (length = 0; ;) {
            id = view.readUInt32LE(offset);
            offset += 4;
            if (id === 0) {
                break;
            }
            let x = view.readInt32LE(offset);
            offset += 4;
            let y = view.readInt32LE(offset);
            offset += 4;
            const size = view.readUInt16LE(offset);
            offset += 2;
            /* this connection's own coordinates and id, as the server sent them */
            const rawX = x, rawY = y, rawId = id;
            /* a connection only receives the cells in its server view: none is hidden or
             * dropped here (a view test and the distance to the main player were computed
             * here and then overridden further down) */
            const invisible = false, remove = false;

            x = this.getX(x);
            y = this.getY(y);

            //

            const flags = view.readUInt8(offset++);
            let extendedFlags = 0;
            if (flags & 128) {
                extendedFlags = view.readUInt8(offset++);
            }
            let color = null
            let skin = null;
            let name = '';
            let accountID = null;
            if (flags & 2) {
                const r = view.readUInt8(offset++);
                const g = view.readUInt8(offset++);
                const b = view.readUInt8(offset++);
                //snez
                color = legendmod.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
            }
            /* the server's colour, before the name, team, profile and food colours below (kept
             * as _lmRawColor: the shared colour of a player on this connection, lmMbLookOf; copies
             * on two connections are not matched by it, each gets its own) */
            const rawColor = color;
            if (flags & 4) {
                skin = encode();
            }
            if (flags & 8) {
                const rawName = encode();
                try {
                    name = window.decodeURIComponent(escape(rawName));
                } catch (e) {
                    name = rawName;
                }
                if (legendmod && legendmod.gameMode && legendmod.gameMode !== ":teams") {
                    legendmod.vanillaskins(name, skin);
                }
            }
            if (flags & 10) {
            }
            const isVirus = flags & 1;
            const isEjected = !!(flags & 32);
            let isFood = extendedFlags & 1;
            const isFriend = extendedFlags & 2;

            if (!this.integrity) { //fix of food for private servers
                if (size < 21) isFood = 1
            }
            /*if (this.player && !this.active && !legendmod.playerCellsMulti.includes(id)){
                invisible = true
            }
            else if  (this.player && this.active){
                invisible = false
            }*/

            id = this.newID(id);

            //FOR COLOR
            /* The unit's own cells take the profile colour, teammates the colour they sent
             * (_lmColorSent, as on the main connection), other named cells the colour first seen
             * for the nick (LM.cellcolors, shared with the main connection, so all connections
             * draw a nick in one colour). Cells without such a colour take the colour this
             * player's copies on the other connections are shown with (lmMbLookOf below,
             * lmMbShareLook in ogario.v4.js): each connection gets its own server colour for one
             * player. As on the main connection, Teams keeps the server's (team) colours and
             * Teams / Party take no nick or teammate colour: a nick's colour from another team
             * painted an enemy, and lmMbShareLook spread it to the main copy. */
            let ownOrTeamColor = false;
            const teamsMode = legendmod.gameMode === ':teams';
            const nickColours = !teamsMode && legendmod.gameMode !== ':party';
            /* a colour sent later without the name (agar.io sends the name once): the name this
             * cell already has, under which its nick colour and shared look are kept */
            let colName = name;
            if (!colName && rawColor && !isVirus && !isFood) {
                const known = legendmod.indexedCells['' + id];
                if (known && known._lmGen === this.connectionGeneration && known._lmSrvName) colName = known._lmSrvName;
            }
            if (!isVirus && !isFood && colName !== "") {
                let ownCustom = false;
                if (this._lmOwnsId(id)) {
                    if (!teamsMode && defaultmapsettings.myCustomColor && profiles[application.selectedProfile]) {
                        color = profiles[application.selectedProfile].color
                        ownOrTeamColor = ownCustom = true
                    }
                } else if (nickColours) {
                    const mates = application.teamPlayers;
                    for (let t = 0; mates && t < mates.length; t++) {
                        if (mates[t] && mates[t].nick === colName && mates[t].color && mates[t]._lmColorSent) {
                            color = mates[t].color
                            ownOrTeamColor = true
                        }
                    }
                }
                if (nickColours && !ownOrTeamColor && legendmod.cellcolors[colName]) {
                    color = legendmod.cellcolors[colName]
                    ownOrTeamColor = true
                }
                /* the profile colour is no colour of the nick (main _lmOwnColorsRestore) */
                if (nickColours && !ownCustom && !legendmod.cellcolors[colName] && color) legendmod.cellcolors[colName] = color
            }
            let look = null;
            if (!isVirus && !isFood && !ownOrTeamColor && rawColor && typeof lmMbLookOf === 'function') {
                look = lmMbLookOf(this.number, this.connectionGeneration, rawColor, colName);
                if (look) color = look.c;
            }
            //

            if (isFood && !defaultmapsettings.rainbowFood) {
                color = defaultSettings.foodColor
            }
            if (defaultmapsettings.oneColoredSpectator && !isFood) {
                color = defaultSettings.foodColor
            }
            cell = null;
            /* every list push stores the cell's slot, so removeCell() never scans */
            var _idx = lmSpectIdx();
            /* A unit id (id + number * 2^32) is no array index: each use as a key turned the number
             * into a string again (a has, a read and a store per cell per packet). Made once. */
            const idKey = '' + id;
            cell = legendmod.indexedCells[idKey] || null;
            if (cell) {
                /* a cell of an earlier socket of this unit under the same id is another cell */
                if (cell._lmGen !== undefined && cell._lmGen !== this.connectionGeneration) {
                    cell.removeCell();
                    cell = null;
                } else {
                    cell.spectator = this.number;
                    /* a colour sent after the cell's first record, or another one, is applied
                     * (as on the main connection); the same server colour again changes nothing
                     * (a shared look or nick colour stays), the unit's own cells keep theirs */
                    if (rawColor && rawColor !== cell._lmRawColor && !isFood && !isVirus && !cell.isPlayerCell) {
                        cell.color = color;
                        cell._lmMbLook = look ? look.c : null;
                        if (look) cell._lmMbLookT = look.t;
                    }
                }
            }
            if (!cell) {
                cell = new window.legendmod1(id, x, y, size, color, isFood, isVirus, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
                cell.time = this.time;
                cell.spectator = this.number;
                /* one observation of this connection: source, socket generation, raw id */
                cell._lmSrc = this.number;
                cell._lmGen = this.connectionGeneration;
                cell._lmRawId = rawId;
                cell._lmRawColor = rawColor || null;
                if (look) {
                    /* made in the colour this player is shown with on the other connections */
                    cell._lmMbLook = look.c;
                    cell._lmMbLookT = look.t;
                }
                lmObsTrack(cell, this.number);
                //if (!isFood) {
                if (!isFood && !remove) {
                    if (isVirus && defaultmapsettings.virusesRange) {
                        _idx.push(legendmod.viruses, cell, '_virusIdx');
                    }
                    //legendmod.cells.push(cell);
                    /* an id the server gave this unit (opcode 32 came first): its own cell */
                    if (this._lmOwnsId(id)) this._lmAdoptOwn(cell);
                } else if (isFood) {
                    /* the connection's pellets (its debug viewport box, _lmConnFoodBoxes); drawn
                     * by the food pass from the reconciled list (lmFoodAdd below), not as cells: added to LM.cells too,
                     * every pellet was drawn once more per connection that saw it */
                    _idx.push(legendmod.foodMulti, cell, '_foodMultiIdx');
                }
                if (!isFood && !remove) _idx.push(legendmod.cells, cell, '_cellsIdx');
                legendmod.indexedCells[idKey] = cell;
            }

            if (name) {
                cell.targetNick = name;
                /* the server's name (copies on other connections are compared by it) */
                cell._lmSrvName = name;
            }
            if (cell.isPlayerCell) {
                cell.targetNick = this.nick
                cell.isPlayerCellMulti = true
            }
            /*
             * Interpolate like the main connection (updateCells in ogario.v4.js):
             * moveCell() goes from where the cell is drawn now to the new position
             * over the animation time. Unit cells used to set only the target and
             * snap the size, and never set updateTime, so after their first
             * 80-120 ms they jumped to each packet (choppy at the server's tick rate,
             * and so was the camera while following the unit).
             */
            if (rawColor) cell._lmRawColor = rawColor;
            cell._lmRawX = rawX;
            cell._lmRawY = rawY;
            if (!isFood) lmObsVelocity(cell, x, y, this.time);
            cell.startX = cell.x;
            cell.startY = cell.y;
            cell.startSize = cell.size;
            cell.targetX = x;
            cell.targetY = y;
            cell.targetSize = size;
            cell.updateTime = this.time;
            cell.isFood = isFood;
            cell.isVirus = isVirus;
            cell.isEjected = isEjected;
            cell.invisible = invisible;
            /* the observation as this connection sent it (source, socket generation, raw id, raw
             * position) is set where the cell is made / updated above; reprojection and the food
             * checks use those, never the drawn (interpolated, mirrored or snapped) position.
             * Each pellet feeds the calibration anchors once. */
            if (isFood && !cell._lmAnchored) {
                cell._lmAnchored = true;
                this._lmAnchorPush(rawX, rawY, size, this.time, cell);
            }
            if (isFood) {
                /* pellets do not move: drawn at the packet position by the food pass */
                cell.x = x;
                cell.y = y;
                cell.size = size;
            }
            /* one entry per pellet of all connections (ogario.v4.js lmFoodAdd) */
            if (isFood && !cell.removed) {
                if (cell._lmFoodEnt) lmFoodTouch(cell);
                /* only while this connection's transform is verified (lmFoodFrame adds its
                 * pellets when it becomes so) */
                else if (this._lmFeedOk()) lmFoodAdd(cell);
                /* it feeds otherwise than the last frame saw and may change back before the next
                 * one (hidden tab, food hidden): the next frame looks at its pellets again */
                if (typeof _lmFood !== 'undefined' && _lmFood.feed.has(this.number) && _lmFood.feed.get(this.number) !== !!this._lmFeedOk()) _lmFood.feed.delete(this.number);
            }

            // In multibox mode or for player cells, cells must NEVER be hidden
            if (this.player || cell.isPlayerCell || cell.isPlayerCellMulti) {
                cell.invisible = false;
            }
            /* the unit's own cells keep its profile skin (see lmPreloadUnitSkin) */
            if (skin && !cell._lmProfileSkin) {
                cell.skin = skin;
            }
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                offset += 4;
                cell.accID = accountID;
                let friend = legendmod.fbOnline.find(element => {
                    return element.id === accountID
                });
                friend !== undefined ? cell.fbID = friend.fbId : void (0);
            }
            if (extendedFlags & 2) {
                cell.isFriend = isFriend;
                //console.log('FB friend cell in view', isFriend)
            }
        }
        // var rmaxedX=rmaxedY=rminedX=rminedY=0

        eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (length = 0; length < eatEventsLength; length++) {
            id = this.newID(view.readUInt32LE(offset));
            offset += 4;
            cell = legendmod.indexedCells[id];
            /* an own cell leaves this unit's index and playerCellIDs once (removeCell() then
             * finds it gone); an id still waiting for its record goes too */
            if (cell) {
                this._lmOwnDrop(cell);
                cell.removeCell();
            } else this._lmOwnForget(id);
        }
        /* orientation and residual checks (each throttled; see the functions) */
        if (this.mapOffsetFixed && this._lmAnchors) {
            if (legendmod.ghostCellsTime && (!this._lmGhostPair || this._lmGhostPair[0] !== legendmod.ghostCellsTime)) this.detectOrientation();
            this._lmCalibrate(this.time);
        }
        /* a whole world update arrived (Full Map coverage reads it) */
        this._lmWorldAt = Date.now();
        this._lmBadRun = 0;
    }

    /* A world update that could not be used (cut short, or an opcode 255 block that does not
     * decode or decodes to nothing): counted, and the third in a row renews a spectator's / Full
     * Map tile's socket (see updateCells). Only for the agar.io / Expanding Land layout. */
    _lmBadWorldUpdate() {
        if (!lmSpectAgarLayout(this.integrity)) return;
        this._lmBadUpdates = (this._lmBadUpdates || 0) + 1;
        this._lmBadRun = (this._lmBadRun || 0) + 1;
        const s = this.socket;
        if (this._lmBadRun === 3 && !this.player && s && !(s.readyState > 1)) {
            /* every renewal counts: no reset of the budget for a socket open > 60 s, so a
             * server sending garbage after a minute backs off and gives up too */
            this._openedAt = 0;
            try { s.close(); } catch (e) { }
        }
    }

    beforecalculation() {
        if (!this.player) return;
        const ownCells = this.getOwnPlayerCells();
        /* a life that ended while its spawn waited (_lmSpawnHold): the next one waits anew */
        if (!ownCells.length && !this.openSecond) this._lmSpawnSeenAt = 0;
        if (ownCells.length) {
            if (!this.openSecond && !(typeof this._lmSpawnHold === 'function' && this._lmSpawnHold(Date.now()))) {
                this.openSecond = true;
                /* only the first spawn after that death may hide its menu, a unit still in its
                 * slot, and not long after (the player may have gone on with the menu) */
                var _lmDeathMenu = window._lmMbDeathMenuAt && Date.now() - window._lmMbDeathMenuAt < LM_MB_DEATH_MENU_MS &&
                    !(this.slotId && typeof lmMbPlayers !== 'undefined' && !lmMbPlayers.isCurrent(this));
                window._lmMbDeathMenuAt = 0;
                /* first spawn of this unit, a spawn the player asked for (Tab), or the player you
                 * control is not alive (the main cell dead, or the unit you control): focus it. A
                 * background reconnect + auto-respawn used to take the focus mid-fight and freeze
                 * the main cell, or another living unit's. */
                var _lmCur = typeof lmMbFocused === 'function' ? lmMbFocused() : (window.multiboxPlayerEnabled ? null : legendmod);
                if (!this._lmSpawnedOnce || this._lmFocusOnSpawn || _lmCur === this || !lmMbAlive(_lmCur)) {
                    lmSetMbUnit(this.number);
                    /* the death menu (terminate: last player died) stayed up over the unit now played;
                     * not a menu the player opened (Esc) or is using (typing a nick, server list) */
                    var _lmAe = typeof document !== 'undefined' && document ? document.activeElement : null;
                    if (!legendmod.play && _lmDeathMenu && !(_lmAe && _lmAe.closest && _lmAe.closest('#overlays, .ogario-menu, #helloContainer')) &&
                        typeof application !== 'undefined' && application && typeof application.hideMenu === 'function') {
                        /* and the auto-respawn's delayed showMenu must not bring it back over the unit */
                        clearTimeout(application._lmAutoRespMenuT);
                        application._lmAutoRespMenuT = null;
                        application.hideMenu();
                    }
                }
                this._lmSpawnedOnce = true;
                this._lmFocusOnSpawn = false;
            }
        } else if (window.multiboxPlayerEnabled === this.number &&
            !(this._lmWantFocusAt && Date.now() - this._lmWantFocusAt < 25000)) {
            let nextUnit = 0;
            if (typeof lmMbFallbackUnit === 'function') nextUnit = lmMbFallbackUnit(this, 'lost');
            else {
                for (let i = 0; i < spects.length; i++) {
                    if (spects[i] && spects[i] !== this && lmMbAlive(spects[i])) {
                        nextUnit = spects[i].number;
                        break;
                    }
                }
            }
            lmSetMbUnit(nextUnit);
        }
        /* also without own cells: its numbers are 0 then (kept the last cells' until terminate) */
        this.calculatePlayerMassAndPosition(ownCells);
    }

    /* The first spawn of a life (its focus, the death menu it hides) waits while the unit has no
     * place on this map yet (transformReady: orientation not verified, the camera would show it
     * at a mirrored place), at most LM_MB_SPAWN_HOLD_MS from its first own cell (then it takes
     * the focus unverified: the camera stays on the placed players, the unit holds). */
    _lmSpawnHold(now) {
        if (this.transformReady()) {
            this._lmSpawnSeenAt = 0;
            return false;
        }
        if (!this._lmSpawnSeenAt) this._lmSpawnSeenAt = now;
        if (now - this._lmSpawnSeenAt < LM_MB_SPAWN_HOLD_MS) return true;
        this._lmSpawnSeenAt = 0;
        return false;
    }

    /* This unit's own cells: its own index, kept by _lmAdoptOwn / _lmOwnDrop (no scan of
     * playerCellsMulti, no new array). Callers only read it. */
    getOwnPlayerCells() {
        return this._lmOwn || (this._lmOwn = []);
    }

    /* The cell ids the server gave this unit (opcode 32) on this socket: playerCellIDs, with
     * _lmOwnIds as its lookup. A new list (a new socket, a death, a flush) replaces both. */
    get playerCellIDs() {
        return this._lmOwnIdList;
    }
    set playerCellIDs(list) {
        this._lmOwnIdList = list;
        const ids = this._lmOwnIds || (this._lmOwnIds = new Set());
        ids.clear();
        for (let i = 0; list && i < list.length; i++) ids.add(list[i]);
    }

    _lmOwnsId(id) {
        return !!this._lmOwnIds && this._lmOwnIds.has(id);
    }

    /* Opcode 32: the id is this unit's on this socket. Its cell is adopted at once when its
     * record came first; else updateCells adopts it when it comes. */
    _lmOwnAdd(id) {
        if (!this._lmOwnsId(id)) {
            if (!this._lmOwnIdList) this.playerCellIDs = [];
            this._lmOwnIds.add(id);
            this._lmOwnIdList.push(id);
        }
        const cell = legendmod.indexedCells['' + id];
        if (cell) this._lmAdoptOwn(cell);
    }

    /* An own id gone before its cell came (eaten or removed while unknown here) */
    _lmOwnForget(id) {
        if (!this._lmOwnIds || !this._lmOwnIds.delete(id)) return;
        const list = this._lmOwnIdList, i = list ? list.indexOf(id) : -1;
        if (i !== -1) list.splice(i, 1);
    }

    /*
     * One own cell joins this unit: its index, the aggregate playerCellsMulti, the profile look
     * and, the first one, the life. From the new-cell record and from opcode 32 (whichever comes
     * second). Only a live cell of this connection's current socket under an id it was given:
     * an old socket's or a removed record is never taken, an adopted one is not taken twice.
     */
    _lmAdoptOwn(cell) {
        if (!cell || cell.removed || cell._lmOwner || cell.isFood || cell.spectator !== this.number ||
            cell._lmGen !== this.connectionGeneration || !this._lmOwnsId(cell.id)) return false;
        const idx = lmSpectIdx();
        cell._lmOwner = this;
        idx.push(this.getOwnPlayerCells(), cell, '_lmOwnIdx');
        cell.isPlayerCell = true;
        cell.isPlayerCellMulti = true;
        cell.invisible = false;
        var _mbProf = profiles[lmUnitProfileIdx(this)];
        /* Teams: the server's team colour, like the main connection (not the
         * food colour of "one colour for spectator cells") */
        if (legendmod.gameMode === ':teams') {
            if (cell._lmRawColor) cell.color = cell._lmRawColor;
            this.playerColor = cell.color;
        } else if (_mbProf) {
            this.playerColor = _mbProf.color || '#000000';
            cell.color = _mbProf.color || '#000000';
        }
        if (_mbProf) {
            if (_mbProf.nick) {
                this.nick = _mbProf.nick;
                cell.targetNick = _mbProf.nick;
            }
            if (_mbProf.skinURL) {
                cell.skin = _mbProf.skinURL;
                cell._lmProfileSkin = true;
                lmPreloadUnitSkin(_mbProf.skinURL);
            }
        }

        idx.push(legendmod.playerCellsMulti, cell, '_playerMultiIdx');
        if (!this.active) {
            console.log('[SPECT] Player cell is active (unit ' + this.number + ')')
            this.active = true
            /* a new life of this unit (lifeGeneration) */
            this._lmLife = (this._lmLife || 0) + 1
            /* its time alive starts with its first own cell (until terminate) */
            if (typeof lmTimeAlive === 'function') lmTimeAlive(this, 1)
            this._lmWantFocusAt = 0
            this.sendCursor()
            loadMultiCellSkin(this)
            if (typeof lmMbPlayerEvent === 'function') lmMbPlayerEvent('playerSpawned', this)
        }
        return true;
    }

    /* An own cell leaves: its index, playerCellsMulti and playerCellIDs, exactly once (every
     * removal path comes here: eats, the remove list, removeCell() in ogario.v4.js). */
    _lmOwnDrop(cell) {
        if (!cell || cell._lmOwner !== this) return false;
        const idx = lmSpectIdx();
        cell._lmOwner = null;
        idx.remove(this.getOwnPlayerCells(), cell, '_lmOwnIdx');
        idx.remove(legendmod.playerCellsMulti, cell, '_playerMultiIdx');
        this._lmOwnForget(cell.id);
        return true;
    }

    /* All own cells and ids go (ClearAll, flush, closed socket): also cells the world dropped
     * without removeCell() (the main connection's flush), O(own cells) */
    _lmOwnClear() {
        const own = this.getOwnPlayerCells(), idx = lmSpectIdx();
        for (let i = own.length - 1; i >= 0; i--) {
            const c = own[i];
            if (!c) continue;
            if (c._lmOwner === this) c._lmOwner = null;
            c._lmOwnIdx = -1;
            if (legendmod.playerCellsMulti) idx.remove(legendmod.playerCellsMulti, c, '_playerMultiIdx');
        }
        own.length = 0;
        this.playerCellIDs = [];
    }

    newID(id) {
        //return id
        /* see LM_UNIT_ID_STEP in ogario.v4.js: agar.io ids go past 1e9 */
        return lmUnitCellId(id, this.number)
    }

    calculatePlayerMassAndPosition(ownCells) {

        let size = 0;
        let targetSize = 0;
        let x = 0;
        let y = 0;
        ownCells = ownCells || this.getOwnPlayerCells();
        const playersLength = ownCells.length;
        /* optional 16-pieces sounds of this unit, by its own cells (lmPieceSound) */
        if (this.player && typeof lmPieceSound === 'function') lmPieceSound(this, playersLength, this.active === true);
        /* no own cell (none yet, or all gone before terminate): no stale mass, size or split numbers */
        if (!playersLength) {
            this.playerSize = this.playerMass = this.playerMinMass = this.playerMaxMass = this.playerSplitCells = 0;
            this.STE = this.MTE = this.BMTE = this.BSTE = this.TTE = this.PTE = 0;
            return;
        }
        for (let length = 0; length < playersLength; length++) {
            const n = ownCells[length];
            size += n.size;
            targetSize += n.targetSize * n.targetSize;
            x += n.x / playersLength;
            y += n.y / playersLength;
        }
        /* The camera (which player, both, zoom) is decided in one place,
         * drawRender.getMultiboxFrame(), from playerX/Y. This used to write the
         * main view centre too, differently from what the camera showed. */
        this.playerX = x;
        this.playerY = y;

        if (!this.openThird) {
            this.openThird = true
            window.targetingLeadX = this.playerX
            window.targetingLeadY = this.playerY
            //legendmod.drawCommander2 = true; // disabled — spawn effects unwanted
        }
        this.playerSize = size;
        this.playerMass = ~~(targetSize / 100);
        this.recalculatePlayerMass(ownCells);
        /* No 10 ms timer chain any more: setView() calls this every frame
         * (LM.updateMultiboxUnitPositions), also while the main player is dead. */
    }

    /* ownCells: this unit's own cells when the caller has them (every frame from
     * calculatePlayerMassAndPosition), else they are collected. Smallest and biggest in one pass:
     * it copied and sorted the cells every frame for two values. */
    recalculatePlayerMass(ownCells) {
        if (this.playerScore = Math.max(this.playerScore, this.playerMass),
        defaultmapsettings.virColors || defaultmapsettings.splitRange || defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.showStatsSTE || defaultmapsettings.tripleSplitRange) {
            const cells = ownCells || this.getOwnPlayerCells();
            const CellLength = cells.length;
            if (CellLength > 0) {
                let minS = Infinity, maxS = -Infinity;
                for (let i = 0; i < CellLength; i++) {
                    const s = cells[i].size;
                    if (s < minS) minS = s;
                    if (s > maxS) maxS = s;
                }
                this.playerMinMass = ~~(minS * minS / 100);
                this.playerMaxMass = ~~(maxS * maxS / 100);
            } else {
                this.playerMinMass = 0;
                this.playerMaxMass = 0;
            }
            this.playerSplitCells = CellLength;
        }
        const mass = (legendmod.selectBiggestCell ? this.playerMaxMass : this.playerMinMass) || 0;
        /* the main player's formula (recalculatePlayerMass in ogario.v4.js): the unit's HUD showed
         * other split / move-to-eat numbers for the same mass */
        this.STE = Math.floor(mass * defaultmapsettings.dominatedRate / 2);
        this.MTE = Math.floor(mass * defaultmapsettings.dominatedRate);
        this.BMTE = Math.ceil(mass * defaultmapsettings.dominationRate);
        this.BSTE = Math.ceil(mass * defaultmapsettings.dominationRate * 2);
        this.TTE = Math.ceil(mass / 6);
        this.PTE = Math.floor(mass * 0.66);
    }
}

window.sendAction = action => {
    legendmod.sendAction(action);
};

/* fromLogin: the answer of the login popup (ogario.v4.master.js), taken only for the socket and
 * slot that asked (a reconnect or a removed unit since: the token stays in master for the next
 * login and nothing is sent) */
function MultiTokenReady(spector, fromLogin) {
    if (!spector) return;
    if (fromLogin && (spector.closedByUser || spector._lmPendGen !== spector.connectionGeneration || spector._lmPendEpoch !== spector.slotEpoch ||
        (spector.slotId && typeof lmMbPlayers !== 'undefined' && !lmMbPlayers.isCurrent(spector)))) return;
    /*
     * The multibox player must log in with the OTHER provider's account.
     * Sending the main account's token logs the main connection out
     * ("Login elsewhere"), so pick the token by the main login context.
     */
    var maxTokenAge = 45 * 60 * 1000;
    var neededAt = master.context === "facebook" ? master.accessTokenGPlusAt : master.accessTokenFBAt;
    var needed = master.context === "facebook" ? master.accessTokenGPlus : master.accessTokenFB;
    if (needed && !(Date.now() - (neededAt || 0) < maxTokenAge)) {
        /* Expired cached token: getTheOppositeSocialToken drops it and logs in again. */
        spector.getTheOppositeSocialToken();
        return;
    }
    if (master.context === "facebook" && master.accessTokenGPlus) {
        spector.sendGplusToken(master.accessTokenGPlus)
    } else if (master.context === "google" && master.accessTokenFB) {
        spector.sendFbToken(master.accessTokenFB)
    }
}
