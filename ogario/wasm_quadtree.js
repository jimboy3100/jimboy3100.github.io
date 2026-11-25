/*
 * wasm_quadtree.js — collision index for jelly physics (global name WasmQuadTree kept, the
 * game code looks it up by that name)
 *
 * Every frame LM.updateQuadtree() puts the perimeter points of all jelly cells in here and
 * movePoints() then asks, for each of its own points, "is a point of another cell within
 * 5 units?". The points are kept in one packed Float32Array sorted into a row-major grid of
 * buckets (at least 10 units wide), so one question reads 1-2 contiguous runs (the bucket
 * columns of a row are next to each other) and stops at the first point that really touches.
 * Consecutive points of a cell are close together, so consecutive questions read memory that
 * is already in the cache.
 *
 * This used to wrap quadtree.wasm. That module held at most 32768 points and returned at
 * most 4096 results per query, so on crowded screens some cells silently lost their
 * collisions, and every query called back into JS for each point it found. Positions are
 * stored as float32 and the query boxes are rounded exactly as the module rounded them, so
 * the answers are the ones it gave, without its limits.
 *
 * Usage:
 *   WasmQuadTree.rebuild(x, y, w, h, cells);   // cells = [{points: [{x,y},...]}], viewport box
 *   var ord = WasmQuadTree.beginCell(cell);    // before a cell changes its points (movePoints)
 *   WasmQuadTree.touches(px, py, ord);         // a point of another cell within 5 units?
 *   WasmQuadTree.anyForeign(x, y, w, h, ord);  // any point of another cell in the box?
 *   WasmQuadTree.some({x, y, w, h}, test);     // like PointQuadTree.some
 */

var WasmQuadTree = (function () {
    'use strict';

    var fround = Math.fround;
    var MIN_STEP = 10;        /* a 10x10 query box then covers at most 2x2 buckets */
    var MIN_BUCKETS = 65536;  /* bucket table size allowed regardless of the point count */

    /* Point storage, grown by doubling and reused every frame (no per-frame allocation).
     * px/py/own/bucketOf/refs: insertion order. Sorted by bucket: packed (float32 x, y and the
     * owner per point, read by every question), exact (the float64 x, y at build time) and
     * sortedRef (index into refs). Sorting indexes instead of the point objects saves a second
     * object-reference write per point. */
    var cap = 0;
    var px = null, py = null, own = null, bucketOf = null;
    var packed = null, exact = null;
    var refs = [];
    var sortedRef = null;
    var count = 0;

    /* moved[ord] = 1 once that cell's movePoints() started this frame (beginCell): its points
     * then have new positions and are read from the point objects. Until then the build-time
     * position is the current one, read from `exact` without touching the scattered objects. */
    var moved = new Uint8Array(256);

    /* start[b] .. start[b + 1] are the sorted points of bucket b = row * cols + col. */
    var start = null;
    var cols = 0, rows = 0, inv = 0.1;
    var originX = 0, originY = 0;

    /* Each rebuild gets a new number; a cell's ordinal is valid only for the build that set it. */
    var buildId = 0;
    var cellCount = 0;

    function ensureCapacity(n) {
        if (n <= cap) return;
        var c = cap || 4096;
        while (c < n) c *= 2;
        px = new Float64Array(c); py = new Float64Array(c);
        own = new Int32Array(c); bucketOf = new Int32Array(c);
        packed = new Float32Array(c * 3);
        exact = new Float64Array(c * 2);
        sortedRef = new Int32Array(c);
        /* Point references grow by push: setting a large length or writing far past the end
         * would turn the arrays into slow dictionary storage. */
        while (refs.length < c) refs.push(null);
        cap = c;
    }

    /**
     * Rebuild the index for the current viewport.
     * Same cells and points as before: cells that are not removed, not food, with at least
     * 3 points; finite points inside the viewport box (compared in float32 like the WASM
     * module did). Always complete.
     */
    function rebuild(x, y, w, h, cells) {
        buildId++;
        cellCount = 0;
        var rootX0 = fround(x), rootY0 = fround(y);
        var rootX1 = fround(rootX0 + fround(w)), rootY1 = fround(rootY0 + fround(h));

        var total = 0;
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (c && c.points) total += c.points.length;
        }
        ensureCapacity(total);
        var previous = count;

        var n = 0;
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var ci = 0; ci < cells.length; ci++) {
            var cell = cells[ci];
            if (!cell || cell.removed || cell.isFood || !cell.points || cell.points.length < 3) continue;
            /* The same cell object listed twice keeps one ordinal, so its points never count
             * as another cell's (movePoints compared item.parent !== self). */
            var ord;
            if (cell._lmJellyQtBuild === buildId) ord = cell._lmJellyQtOrd;
            else { ord = cellCount++; cell._lmJellyQtBuild = buildId; cell._lmJellyQtOrd = ord; }
            var pts = cell.points;
            for (var k = 0; k < pts.length; k++) {
                var pt = pts[k];
                if (!pt || !isFinite(pt.x) || !isFinite(pt.y)) continue;
                /* movePoints() of the JS fallback filters collisions with item.parent !== self
                 * (points are made with it; reasserted for points of a recycled cell) */
                if (pt.parent !== cell) pt.parent = cell;
                var fx = fround(pt.x), fy = fround(pt.y);
                if (fx < rootX0 || fx > rootX1 || fy < rootY0 || fy > rootY1) continue;
                px[n] = pt.x; py[n] = pt.y; own[n] = ord; refs[n] = pt;
                if (fx < minX) minX = fx;
                if (fx > maxX) maxX = fx;
                if (fy < minY) minY = fy;
                if (fy > maxY) maxY = fy;
                n++;
            }
        }
        count = n;
        if (moved.length < cellCount) moved = new Uint8Array(Math.max(cellCount, moved.length * 2));
        else moved.fill(0, 0, cellCount);
        /* Do not keep last frame's extra points (and their cells) alive. */
        for (var r = n; r < previous; r++) refs[r] = null;
        if (n === 0) { cols = rows = 0; return true; }

        /* Buckets span the indexed points. 10 units wide when that fits the table budget,
         * wider when zoomed far out (a query box then covers fewer, fuller buckets; the
         * answers are the same, only the bucket a point is in changes). */
        originX = minX; originY = minY;
        var spanX = maxX - minX, spanY = maxY - minY;
        var budget = Math.max(MIN_BUCKETS, n * 2);
        var step = MIN_STEP;
        inv = 1 / step;
        while ((Math.floor(spanX * inv) + 1) * (Math.floor(spanY * inv) + 1) > budget) {
            step *= 1.25;
            inv = 1 / step;
        }
        cols = Math.floor(spanX * inv) + 1;
        rows = Math.floor(spanY * inv) + 1;
        var buckets = cols * rows;
        if (!start || start.length < buckets + 1) start = new Int32Array(Math.max(buckets + 1, MIN_BUCKETS + 1));
        else start.fill(0, 0, buckets + 1);

        /* Counting sort by bucket into contiguous runs. */
        for (var j = 0; j < n; j++) {
            var b = Math.floor((fround(px[j]) - originX) * inv) + Math.floor((fround(py[j]) - originY) * inv) * cols;
            bucketOf[j] = b;
            start[b + 1]++;
        }
        for (var t = 0; t < buckets; t++) start[t + 1] += start[t];
        /* start[b] is now the first slot of bucket b; fill moving it as a cursor, then shift
         * back (each start[b] ends where bucket b + 1 begins). */
        for (var q = 0; q < n; q++) {
            var slot = start[bucketOf[q]]++;
            var o = slot * 3;
            /* the Float32Array rounds like fround() */
            packed[o] = px[q]; packed[o + 1] = py[q]; packed[o + 2] = own[q];
            exact[slot * 2] = px[q]; exact[slot * 2 + 1] = py[q];
            sortedRef[slot] = q;
        }
        for (var u = buckets; u > 0; u--) start[u] = start[u - 1];
        start[0] = 0;
        return true;
    }

    /** The cell's number in the current index, -1 when it is not in it. */
    function ordOf(cell) {
        return cell && cell._lmJellyQtBuild === buildId ? cell._lmJellyQtOrd : -1;
    }

    /**
     * movePoints() calls this before it changes any of its points: from now on questions read
     * this cell's positions from its point objects. Returns ordOf(cell).
     */
    function beginCell(cell) {
        var ord = ordOf(cell);
        if (ord >= 0) moved[ord] = 1;
        return ord;
    }

    /**
     * movePoints() collision question for one perimeter point at (x, y): is there a point of
     * another cell whose indexed position lies in the 10x10 box around (x, y) and whose current
     * position is within 5 units? (The old quadtree.some(box, test) with the same box and test,
     * stopping at the first point that passes the test, not the first point in the box.)
     */
    function touches(x, y, ord) {
        if (count === 0) return false;
        var ax = fround(x - 5), ay = fround(y - 5);
        var axe = fround(ax + 10), aye = fround(ay + 10);
        var c0 = Math.floor((ax - originX) * inv), c1 = Math.floor((axe - originX) * inv);
        var r0 = Math.floor((ay - originY) * inv), r1 = Math.floor((aye - originY) * inv);
        if (c0 < 0) c0 = 0;
        if (c1 >= cols) c1 = cols - 1;
        if (r0 < 0) r0 = 0;
        if (r1 >= rows) r1 = rows - 1;
        /* box beside all points (or NaN): start[] past the last bucket is not this frame's */
        if (!(c0 <= c1)) return false;
        for (var row = r0; row <= r1; row++) {
            var base = row * cols;
            /* columns c0..c1 of one row are one contiguous run */
            for (var k = start[base + c0], e = start[base + c1 + 1]; k < e; k++) {
                var o = k * 3;
                var owner = packed[o + 2];
                if (owner === ord) continue;
                var qx = packed[o];
                if (qx < ax || qx > axe) continue;
                var qy = packed[o + 1];
                if (qy < ay || qy > aye) continue;
                /* distance from the point's current position */
                var dx, dy;
                if (moved[owner] === 1) {
                    var it = refs[sortedRef[k]];
                    dx = it.x - x; dy = it.y - y;
                } else {
                    dx = exact[k * 2] - x; dy = exact[k * 2 + 1] - y;
                }
                if (dx * dx + dy * dy <= 25) return true;
            }
        }
        return false;
    }

    /**
     * Broad phase of movePoints(): is there any point of another cell (indexed position) in the
     * box x, y, w, h? Reads one contiguous run per bucket row and only the packed array.
     */
    function anyForeign(x, y, w, h, ord) {
        if (count === 0) return false;
        var ax = fround(x), ay = fround(y);
        var axe = fround(ax + fround(w)), aye = fround(ay + fround(h));
        var c0 = Math.floor((ax - originX) * inv), c1 = Math.floor((axe - originX) * inv);
        var r0 = Math.floor((ay - originY) * inv), r1 = Math.floor((aye - originY) * inv);
        if (c0 < 0) c0 = 0;
        if (c1 >= cols) c1 = cols - 1;
        if (r0 < 0) r0 = 0;
        if (r1 >= rows) r1 = rows - 1;
        /* box beside all points (or NaN): start[] past the last bucket is not this frame's */
        if (!(c0 <= c1)) return false;
        for (var row = r0; row <= r1; row++) {
            var base = row * cols;
            for (var k = start[base + c0], e = start[base + c1 + 1]; k < e; k++) {
                var o = k * 3;
                if (packed[o + 2] === ord) continue;
                var qx = packed[o], qy = packed[o + 1];
                if (qx >= ax && qx <= axe && qy >= ay && qy <= aye) return true;
            }
        }
        return false;
    }

    /* Points in the box; visit(point) returning true stops the walk. A box covering more
     * buckets than there are points is answered by scanning all points (same result). */
    function walkBox(aabb, visit) {
        if (count === 0) return false;
        var ax = fround(aabb.x), ay = fround(aabb.y);
        var axe = fround(ax + fround(aabb.w)), aye = fround(ay + fround(aabb.h));
        var k, e, o;
        var c0 = Math.floor((ax - originX) * inv), c1 = Math.floor((axe - originX) * inv);
        var r0 = Math.floor((ay - originY) * inv), r1 = Math.floor((aye - originY) * inv);
        if (c0 < 0) c0 = 0;
        if (c1 >= cols) c1 = cols - 1;
        if (r0 < 0) r0 = 0;
        if (r1 >= rows) r1 = rows - 1;
        if (!(c1 >= c0) || !(r1 >= r0)) return false;
        if ((c1 - c0 + 1) * (r1 - r0 + 1) > count) {
            for (k = 0; k < count; k++) {
                o = k * 3;
                if (packed[o] >= ax && packed[o] <= axe && packed[o + 1] >= ay && packed[o + 1] <= aye && visit(refs[sortedRef[k]])) return true;
            }
            return false;
        }
        for (var row = r0; row <= r1; row++) {
            var base = row * cols;
            for (k = start[base + c0], e = start[base + c1 + 1]; k < e; k++) {
                o = k * 3;
                if (packed[o] >= ax && packed[o] <= axe && packed[o + 1] >= ay && packed[o + 1] <= aye && visit(refs[sortedRef[k]])) return true;
            }
        }
        return false;
    }

    /**
     * Test if any point in the AABB satisfies the test callback (PointQuadTree.some API;
     * complete, no result limit).
     */
    function some(aabb, test) {
        return walkBox(aabb, test);
    }

    /**
     * All points within an AABB (complete, no result limit).
     */
    function query(aabb) {
        var results = [];
        walkBox(aabb, function (pt) { results.push(pt); return false; });
        return results;
    }

    /** Release point references and reset counts (disconnect/jelly disabled/empty scene). */
    function clear() {
        for (var i = 0; i < count; i++) refs[i] = null;
        count = 0;
        cellCount = 0;
        cols = rows = 0;
        buildId++;
    }

    function stats() {
        return { nodes: cols * rows, points: count, cells: cellCount };
    }

    /* Kept for the loader in ogario.v4.js; nothing to download any more. */
    function init() {
        return Promise.resolve();
    }

    return {
        init: init,
        rebuild: rebuild,
        clear: clear,
        ordOf: ordOf,
        beginCell: beginCell,
        touches: touches,
        anyForeign: anyForeign,
        some: some,
        query: query,
        stats: stats,
        get size() { return count; },
        get ready() { return true; }
    };
})();
