/* Benchmark prototype: a PixiJS 7 custom-mesh renderer next to Legend Mod's own WebGL2 cell
 * renderer, on the frozen world of a bench.js scene (developers/tests/lib/bench-scene.js).
 * Not part of the game: play.html never loads this file or PixiJS. developers/bench/pixi-mesh.js
 * evaluates PixiJS and this file in the bench page after a scene is set up.
 *
 * Both sides draw the same snapshot (LM.cells with this frame's jelly points, LM.food), every
 * frame from scratch:
 *   lm    drawRender.drawWebGLCellBatch(LM.cells) on the game's WebGL2 canvas + drawFood() on the
 *         game's Canvas2D canvas (what renderFrame does for them; jelly physics not included)
 *   pixi  the same cells packed into ONE indexed mesh (fill fan + virus border band per cell, in
 *         cell order: painter's order instead of a depth buffer) and the food as ONE instanced
 *         mesh, drawn by a PIXI.Renderer on its own WebGL2 canvas of the same size
 *   lmtext  lm + drawWebGLTextPass (labels; the prototype has no text, shown for reference)
 * Measured: CPU ms per frame (submission), frame interval (unthrottled frames), GPU time with
 * EXT_disjoint_timer_query_webgl2 when Chrome offers it, a synchronous total (frames + 1-pixel
 * readback), draw/GL calls and bytes uploaded per frame, buffer memory, JS heap growth, and the
 * pixel difference and draw order of the two pictures.
 * The geometry packer (BodyPack, FoodPack) is pure and also runs in Node
 * (developers/tests/pixibench.js checks it against the real LM vertex writers). */
(function (root) {
    'use strict';

    /* ------------------------------------------------------------------ */
    /* Pure parts: geometry packing                                        */
    /* ------------------------------------------------------------------ */

    function grown(a, need, Ctor) {
        if (a.length >= need) return a;
        var n = a.length || 256;
        while (n < need) n *= 2;
        var b = new Ctor(n);
        b.set(a);
        return b;
    }
    /* 0xRRGGBB + alpha 0..1 as the bytes r, g, b, a of one Uint32 (little endian: a normalized
     * UNSIGNED_BYTE vec4 attribute reads them in this order) */
    function rgba(cInt, a) {
        var A = Math.round(Math.max(0, Math.min(1, a)) * 255);
        return (((cInt >> 16) & 255) | (((cInt >> 8) & 255) << 8) | ((cInt & 255) << 16) | (A << 24)) >>> 0;
    }

    /* All bodies of a frame in one vertex stream and one index list, cell by cell: the centre and
     * the points (fan), then the band vertices (inner, outer per point). Positions: 2 floats,
     * colour: one packed Uint32 per vertex. The index list depends only on the sequence of point
     * and band counts: cells whose counts match the last frame keep their indices. */
    function BodyPack() {
        this.pos = new Float32Array(8192);
        this.col = new Uint32Array(4096);
        this.idx = new Uint32Array(16384);
        this.starts = new Int32Array(512);
        this.counts = new Int32Array(512);
        this.bands = new Int32Array(512);
        this.idxAt = new Int32Array(512);
        this.nx = new Float32Array(128);
        this.ny = new Float32Array(128);
        this.nv = 0; this.cells = 0; this.ni = 0;
        this.keptCells = 0;   /* cells of the last frame whose indices are still valid */
        this.idxFrom = 0;     /* first index written by the last end() */
        this.validFrom = 0;   /* first cell of this frame whose indices differ */
        this.grew = false;
    }
    BodyPack.prototype.begin = function () {
        this.nv = 0; this.cells = 0; this.validFrom = -1; this.grew = false;
    };
    BodyPack.prototype._room = function (nv) {
        var v = this.nv + nv;
        if (v * 2 > this.pos.length) { this.pos = grown(this.pos, v * 2, Float32Array); this.col = grown(this.col, v, Uint32Array); this.grew = true; }
        var k = this.cells + 1;
        if (k > this.starts.length) {
            this.starts = grown(this.starts, k, Int32Array); this.counts = grown(this.counts, k, Int32Array);
            this.bands = grown(this.bands, k, Int32Array); this.idxAt = grown(this.idxAt, k, Int32Array);
        }
    };
    /* one cell: points (>= 3, {x, y}), centre cx/cy, fill colour, and optionally one band from
     * inner to outer offset along the normals (radial normals for viruses, as LM's spikes) */
    BodyPack.prototype.cell = function (cx, cy, points, fillCol, band, bandIn, bandOut, bandCol, radial) {
        var n = points.length, nb = band ? 1 : 0;
        this._room(n + 1 + nb * 2 * n);
        var p = this.pos, c = this.col, v = this.nv, o = v * 2, i;
        p[o] = cx; p[o + 1] = cy; c[v] = fillCol;
        for (i = 0; i < n; i++) { p[o + 2 + 2 * i] = points[i].x; p[o + 3 + 2 * i] = points[i].y; c[v + 1 + i] = fillCol; }
        var k = this.cells;
        if (this.validFrom < 0 && (k >= this.keptCells || this.counts[k] !== n || this.bands[k] !== nb)) this.validFrom = k;
        this.starts[k] = v; this.counts[k] = n; this.bands[k] = nb;
        v += n + 1;
        if (nb) {
            if (this.nx.length < n) { this.nx = grown(this.nx, n, Float32Array); this.ny = grown(this.ny, n, Float32Array); }
            var nx = this.nx, ny = this.ny;
            for (i = 0; i < n; i++) {
                var cur = points[i], x, y, len, rx = cur.x - cx, ry = cur.y - cy;
                if (radial) { x = rx; y = ry; len = Math.sqrt(x * x + y * y) || 1; }
                else {
                    var pr = points[(i - 1 + n) % n], nxp = points[(i + 1) % n];
                    x = nxp.y - pr.y; y = -(nxp.x - pr.x);
                    if (x * rx + y * ry < 0) { x = -x; y = -y; }
                    len = Math.sqrt(x * x + y * y);
                    if (!len || !isFinite(len)) { x = rx; y = ry; len = Math.sqrt(rx * rx + ry * ry) || 1; }
                }
                nx[i] = x / len; ny[i] = y / len;
            }
            o = v * 2;
            for (i = 0; i < n; i++) {
                var q = points[i];
                p[o] = q.x + nx[i] * bandIn; p[o + 1] = q.y + ny[i] * bandIn; c[v++] = bandCol;
                p[o + 2] = q.x + nx[i] * bandOut; p[o + 3] = q.y + ny[i] * bandOut; c[v++] = bandCol;
                o += 4;
            }
        }
        this.nv = v;
        this.cells++;
    };
    /* the index list from the first changed cell on; returns true when it changed */
    BodyPack.prototype.end = function () {
        var from = this.validFrom < 0 ? this.cells : this.validFrom;
        if (from >= this.cells && this.cells === this.keptCells) return false;
        var at = from > 0 ? this.idxAt[from - 1] + this.counts[from - 1] * 3 * (1 + 2 * this.bands[from - 1]) : 0;
        var need = at, k;
        for (k = from; k < this.cells; k++) need += this.counts[k] * 3 * (1 + 2 * this.bands[k]);
        if (need > this.idx.length) { this.idx = grown(this.idx, need, Uint32Array); this.grew = true; }
        var d = this.idx;
        this.idxFrom = at;
        for (k = from; k < this.cells; k++) {
            var n = this.counts[k], s = this.starts[k], i;
            this.idxAt[k] = at;
            for (i = 0; i < n; i++) { d[at++] = s; d[at++] = s + 1 + i; d[at++] = s + (i + 1 === n ? 1 : i + 2); }
            if (this.bands[k]) {
                var b = s + n + 1;
                for (i = 0; i < n; i++) {
                    var i0 = b + 2 * i, i1 = b + (i + 1 === n ? 0 : 2 * i + 2);
                    d[at++] = i0; d[at++] = i0 + 1; d[at++] = i1 + 1;
                    d[at++] = i0; d[at++] = i1 + 1; d[at++] = i1;
                }
            }
        }
        this.ni = at;
        this.keptCells = this.cells;
        return true;
    };
    BodyPack.prototype.bytes = function () {
        return this.pos.byteLength + this.col.byteLength + this.idx.byteLength;
    };

    /* Food as instances (x, y, radius + one packed colour). With rainbow food the order is that of
     * LM's Canvas2D path: grouped by colour in the order each colour first appears this frame (one
     * fill per colour there), food order inside a group. */
    function FoodPack() {
        this.inst = new Float32Array(3 * 4096);
        this.col = new Uint32Array(4096);
        this.n = 0;
        this.slotOf = new Map(); this.slotCol = []; this.slotGen = new Int32Array(64); this.slotCnt = new Int32Array(64); this.slotAt = new Int32Array(64);
        this.order = new Int32Array(64); this.tmpF = new Int32Array(4096); this.tmpS = new Int32Array(4096);
        this.gen = 0;
    }
    FoodPack.prototype._room = function (n) {
        if (n * 3 > this.inst.length) { this.inst = grown(this.inst, n * 3, Float32Array); this.col = grown(this.col, n, Uint32Array); }
        if (n > this.tmpF.length) { this.tmpF = grown(this.tmpF, n, Int32Array); this.tmpS = grown(this.tmpS, n, Int32Array); }
    };
    /* food: LM.food; o: { minX, maxX, minY, maxY, rainbow, foodSize, defColor, colorInt(css) } */
    FoodPack.prototype.pack = function (food, o) {
        var len = food ? food.length : 0, i, f;
        this.n = 0;
        if (!len) return 0;
        this._room(len);
        var inst = this.inst, col = this.col, n = 0;
        if (!o.rainbow) {
            var r = ((food[0] && food[0].size) ? food[0].size : 10) + o.foodSize;
            var c = rgba(o.colorInt(o.defColor), 1);
            for (i = 0; i < len; i++) {
                f = food[i];
                if (!f || f.invisible || f.x < o.minX || f.x > o.maxX || f.y < o.minY || f.y > o.maxY) continue;
                inst[n * 3] = f.x; inst[n * 3 + 1] = f.y; inst[n * 3 + 2] = r; col[n] = c; n++;
            }
            this.n = n;
            return n;
        }
        var gen = ++this.gen, used = 0, m = 0;
        for (i = 0; i < len; i++) {
            f = food[i];
            if (!f || f.invisible || f.x < o.minX || f.x > o.maxX || f.y < o.minY || f.y > o.maxY) continue;
            var key = f.color || o.defColor, s = this.slotOf.get(key);
            if (s === undefined) {
                s = this.slotCol.length;
                this.slotOf.set(key, s);
                this.slotCol.push(rgba(o.colorInt(key), 1));
                if (s >= this.slotGen.length) {
                    this.slotGen = grown(this.slotGen, s + 1, Int32Array); this.slotCnt = grown(this.slotCnt, s + 1, Int32Array);
                    this.slotAt = grown(this.slotAt, s + 1, Int32Array); this.order = grown(this.order, s + 1, Int32Array);
                }
            }
            if (this.slotGen[s] !== gen) { this.slotGen[s] = gen; this.slotCnt[s] = 0; this.order[used++] = s; }
            this.slotCnt[s]++;
            this.tmpF[m] = i; this.tmpS[m] = s; m++;
        }
        var at = 0;
        for (i = 0; i < used; i++) { this.slotAt[this.order[i]] = at; at += this.slotCnt[this.order[i]]; }
        for (i = 0; i < m; i++) {
            f = food[this.tmpF[i]];
            var sl = this.tmpS[i], w = this.slotAt[sl]++;
            inst[w * 3] = f.x; inst[w * 3 + 1] = f.y; inst[w * 3 + 2] = (f.size || 10) + o.foodSize; col[w] = this.slotCol[sl];
        }
        /* the colour map keeps every colour ever seen; start again when it grows large (as LM) */
        if (this.slotCol.length > 512) { this.slotOf.clear(); this.slotCol.length = 0; }
        this.n = m;
        return m;
    };
    FoodPack.prototype.bytes = function () { return this.inst.byteLength + this.col.byteLength; };

    var pure = { BodyPack: BodyPack, FoodPack: FoodPack, rgba: rgba };
    if (typeof module !== 'undefined' && module.exports) { module.exports = pure; return; }

    /* ------------------------------------------------------------------ */
    /* In the bench page                                                   */
    /* ------------------------------------------------------------------ */

    var now = function () { return performance.now(); };
    var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var raf = function () { return new Promise(function (r) { requestAnimationFrame(r); }); };
    function r2(x) { return Math.round(x * 1000) / 1000; }
    function dist(a) {
        var s = a.slice().sort(function (x, y) { return x - y; });
        var p = function (q) { return s.length ? r2(s[Math.min(s.length - 1, Math.floor(q * s.length))]) : 0; };
        var sum = 0; s.forEach(function (x) { sum += x; });
        return { n: s.length, mean: s.length ? r2(sum / s.length) : 0, p50: p(0.5), p95: p(0.95), p99: p(0.99), max: s.length ? r2(s[s.length - 1]) : 0 };
    }
    function heap() { try { return performance.memory ? performance.memory.usedJSHeapSize : 0; } catch (e) { return 0; } }

    var BODY_VS = 'precision highp float;\nattribute vec2 aPos; attribute vec4 aColor;\nuniform vec2 uCenter; uniform vec2 uScale;\nvarying vec4 vColor;\n' +
        'void main() { vec2 c = (aPos - uCenter) * uScale; gl_Position = vec4(c.x, -c.y, 0.0, 1.0); vColor = aColor; }';
    var BODY_FS = 'precision mediump float;\nvarying vec4 vColor;\nvoid main() { if (vColor.a <= 0.001) discard; gl_FragColor = vColor; }';
    var FOOD_VS = 'precision highp float;\nattribute vec2 aCorner; attribute vec3 aInst; attribute vec4 aColor;\nuniform vec2 uCenter; uniform vec2 uScale; uniform float uPx;\n' +
        'varying vec2 vUV; varying vec4 vColor; varying float vRpx;\n' +
        'void main() { float r = aInst.z; float pad = r + 1.0 / uPx; vec2 w = aInst.xy + aCorner * pad; vec2 c = (w - uCenter) * uScale;\n' +
        '  gl_Position = vec4(c.x, -c.y, 0.0, 1.0); vUV = aCorner * pad / r; vRpx = r * uPx; vColor = aColor; }';
    var FOOD_FS = 'precision mediump float;\nvarying vec2 vUV; varying vec4 vColor; varying float vRpx;\n' +
        'void main() { float a = clamp((1.0 - length(vUV)) * vRpx + 0.5, 0.0, 1.0); if (a <= 0.0) discard; gl_FragColor = vec4(vColor.rgb, vColor.a * a); }';

    /* The shared front end: the frame's snapshot packed once per frame and side, with the same
     * visibility rules and colour rules as drawWebGLCellBatch's jelly path (skins and the virus
     * glow are not part of the prototype: they are counted in `unsupported`). */
    function Front() {
        this.body = new BodyPack();
        this.food = new FoodPack();
        this.unsupported = { skins: 0, glow: 0 };
        this.drawnIds = [];
        this.nf = 0; this.idxChanged = false;
        var dr = window.drawRender;
        this.colorInt = function (c) { var v = dr._lmGlColorInt(c); return v < 0 ? 0xff0000 : v; };
        this.fo = { minX: 0, maxX: 0, minY: 0, maxY: 0, rainbow: false, foodSize: 0, defColor: '', colorInt: this.colorInt };
        this.view = { cx: 0, cy: 0, sx: 1, sy: 1, px: 1 };
    }
    Front.prototype.pack = function (check) {
        var dr = window.drawRender, L = window.legendmod, ms = window.defaultmapsettings, ds = window.defaultSettings;
        var cells = L.cells, bp = this.body;
        var virusStroke = Math.max(0, Number(ds.virusStrokeSize) || 0);
        var hide = L.hideSmallBots, skinsOn = check && typeof window.lmSkinsShown === 'function' && window.lmSkinsShown();
        var playing = !!((L.play && L.playerCells && L.playerCells.length) || (window.multiboxPlayerEnabled && L.playerCellsMulti && L.playerCellsMulti.length));
        var ids = check ? (this.drawnIds = []) : null;
        if (check) { this.unsupported.skins = 0; this.unsupported.glow = ms.virusGlow ? 1 : 0; }
        bp.begin();
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (!cell || cell.invisible || cell.removed || cell.isFood || dr._isDuplicateWebGLSpectatorCell(cell)) continue;
            if (hide && cell.size <= 36) continue;
            if (typeof cell.isInView === 'function') { try { if (!cell.isInView()) continue; } catch (e) { } }
            var pts = cell.points;
            if (!pts || pts.length < 3) return false;
            var bodyHex, strokeHex;
            if (cell.isVirus) {
                var vm = ~~(cell.size * cell.size / 100);
                var vc = vm <= 200 ? ds.virusColor : vm > 220 ? ds.mVirusColor : cell.virusColor;
                var vs = vm <= 200 ? ds.virusStrokeColor : vm > 220 ? ds.mVirusStrokeColor : cell.virusStroke;
                if (ms.virColors && L.play) { bodyHex = window.application.setVirusColor(cell.size); strokeHex = window.application.setVirusStrokeColor(cell.size); }
                else { bodyHex = vc || ds.virusColor || '#33ff33'; strokeHex = vs || ds.virusStrokeColor || bodyHex; }
            } else {
                bodyHex = cell.color || '#808080';
                if (playing && (cell.isPlayerCell || cell.isPlayerCellMulti || cell.playerCellsMulti) && ms.myCustomColor && window.ogarcopythelb && window.ogarcopythelb.color && L.gameMode !== ':teams') bodyHex = window.ogarcopythelb.color;
                if (ms.noColors && !cell.isEjected) bodyHex = '#808080';
                strokeHex = bodyHex;
                /* a skin LM would draw on this cell (asked only in the checking pass: it may queue a load) */
                if (skinsOn && !cell.isEjected && (cell.targetNick || cell.skin)) {
                    try { var sr = dr._resolveWebGLJellySkin(cell, window.application.gameMode === ':party', dr.glSkinArray); if (sr && sr.layer >= 0) this.unsupported.skins++; } catch (e) { }
                }
            }
            if (typeof bodyHex !== 'string' || !bodyHex.trim() || bodyHex.trim().toLowerCase() === 'transparent') bodyHex = '#808080';
            var bc = dr._lmGlColorInt(bodyHex);
            if (bc < 0) bc = cell.isVirus ? 0x33ff33 : 0x808080;
            var sc = dr._lmGlColorInt(strokeHex);
            if (sc < 0) sc = bc;
            var alpha = 1;
            if (cell.isVirus && ms.transparentViruses && ds.virusAlpha < 0.99) alpha = Math.max(0, Math.min(1, Number(ds.virusAlpha) || 0));
            else if (!cell.isVirus && ms.transparentCells && ds.cellsAlpha < 0.99) alpha = Math.max(0, Math.min(1, Number(ds.cellsAlpha) || 0));
            var band = cell.isVirus && virusStroke > 0;
            bp.cell(cell.x, cell.y, pts, rgba(bc, alpha), band, -virusStroke * 0.5, virusStroke * 0.5, band ? rgba(sc, 1) : 0, cell.isVirus);
            if (ids) ids.push(cell.id);
        }
        this.idxChanged = bp.end();
        /* food: the culling box of drawCachedFood */
        var o = this.fo;
        if (window.fullSpectator) {
            o.minX = (L.mapMinX != null ? L.mapMinX : -7071) - 500; o.maxX = (L.mapMaxX != null ? L.mapMaxX : 7071) + 500;
            o.minY = (L.mapMinY != null ? L.mapMinY : -7071) - 500; o.maxY = (L.mapMaxY != null ? L.mapMaxY : 7071) + 500;
        } else {
            var s = dr.scale || 1, hw = dr.canvasWidth / s / 2 + 200, hh = dr.canvasHeight / s / 2 + 200;
            var cx = dr.camX != null ? dr.camX : (L.viewX || 0), cy = dr.camY != null ? dr.camY : (L.viewY || 0);
            o.minX = cx - hw; o.maxX = cx + hw; o.minY = cy - hh; o.maxY = cy + hh;
        }
        o.rainbow = !!ms.rainbowFood; o.foodSize = ds.foodSize; o.defColor = ds.foodColor || '#FF0000';
        this.nf = L.showFood && !(ms.autoHideFoodOnZoom && dr.scale < 0.2) ? this.food.pack(L.food, o) : 0;
        /* the view of LM's jelly shader */
        var v = this.view, sc2 = dr.scale || 1;
        v.cx = dr.camX; v.cy = dr.camY; v.sx = 2 * sc2 / dr.canvasWidth; v.sy = 2 * sc2 / dr.canvasHeight; v.px = sc2 * (dr.dpr || 1);
        return true;
    };

    function addCanvas(c, W, H, id) {
        c.id = id;
        c.width = W; c.height = H;
        c.style.cssText = 'position:fixed;left:0;top:0;width:' + W + 'px;height:' + H + 'px;pointer-events:none;z-index:2147483000;visibility:hidden';
        document.body.appendChild(c);
        return c;
    }

    /* PixiJS: one renderer, a food mesh under a body mesh (custom Shader + Geometry, no Graphics
     * or Sprites), buffers updated with only the used part */
    function PixiSide(front, W, H, antialias) {
        var P = window.PIXI;
        this.front = front;
        this.renderer = new P.Renderer({ width: W, height: H, backgroundAlpha: 0, antialias: antialias, resolution: 1, autoDensity: false });
        this.gl = this.renderer.gl;
        this.webgl2 = this.renderer.context.webGLVersion === 2;
        this.view = addCanvas(this.renderer.view, W, H, 'lm-pixi-bench');
        this.stage = new P.Container();
        var bp = front.body, fp = front.food;
        this.bPos = new P.Buffer(bp.pos, false, false);
        this.bCol = new P.Buffer(bp.col, false, false);
        this.bIdx = new P.Buffer(bp.idx, false, true);
        var g = new P.Geometry().addAttribute('aPos', this.bPos, 2, false, P.TYPES.FLOAT).addAttribute('aColor', this.bCol, 4, true, P.TYPES.UNSIGNED_BYTE).addIndex(this.bIdx);
        this.uB = { uCenter: new Float32Array(2), uScale: new Float32Array(2) };
        this.bodyMesh = new P.Mesh(g, P.Shader.from(BODY_VS, BODY_FS, this.uB));
        this.bodyMesh.state.blendMode = P.BLEND_MODES.NORMAL_NPM;
        this.fInst = new P.Buffer(fp.inst, false, false);
        this.fCol = new P.Buffer(fp.col, false, false);
        var fg = new P.Geometry()
            .addAttribute('aCorner', new P.Buffer(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), true, false), 2, false, P.TYPES.FLOAT)
            .addAttribute('aInst', this.fInst, 3, false, P.TYPES.FLOAT, 0, 0, true)
            .addAttribute('aColor', this.fCol, 4, true, P.TYPES.UNSIGNED_BYTE, 0, 0, true)
            .addIndex(new P.Buffer(new Uint16Array([0, 1, 2, 0, 2, 3]), true, true));
        fg.instanceCount = 0;
        this.uF = { uCenter: new Float32Array(2), uScale: new Float32Array(2), uPx: 1 };
        this.foodMesh = new P.Mesh(fg, P.Shader.from(FOOD_VS, FOOD_FS, this.uF));
        this.foodMesh.state.blendMode = P.BLEND_MODES.NORMAL_NPM;
        this.stage.addChild(this.foodMesh, this.bodyMesh);
        this.allocated = false;
    }
    PixiSide.prototype.upload = function (layers) {
        var f = this.front, bp = f.body, fp = f.food, bs = this.renderer.buffer;
        /* a full-size allocation when an array grew; outside any vertex array (an element buffer
         * bound while a VAO is bound would become that VAO's index buffer) */
        var bodyNew = !this.allocated || this.bPos.data.buffer !== bp.pos.buffer || this.bIdx.data.buffer !== bp.idx.buffer;
        var foodNew = !this.allocated || this.fInst.data.buffer !== fp.inst.buffer;
        if (bodyNew || foodNew) this.renderer.geometry.reset();
        if (bodyNew) { this.bPos.update(bp.pos); this.bCol.update(bp.col); this.bIdx.update(bp.idx); bs.update(this.bPos); bs.update(this.bCol); bs.update(this.bIdx); }
        if (foodNew) { this.fInst.update(fp.inst); this.fCol.update(fp.col); bs.update(this.fInst); bs.update(this.fCol); }
        this.allocated = true;
        this.bPos.update(bp.pos.subarray(0, bp.nv * 2));
        this.bCol.update(bp.col.subarray(0, bp.nv));
        if (f.idxChanged || bodyNew) this.bIdx.update(bp.idx.subarray(0, bp.ni));
        this.bodyMesh.size = bp.ni;
        this.bodyMesh.visible = bp.ni > 0 && layers !== 'food';
        this.fInst.update(fp.inst.subarray(0, f.nf * 3));
        this.fCol.update(fp.col.subarray(0, f.nf));
        this.foodMesh.geometry.instanceCount = f.nf;
        this.foodMesh.size = 6;
        this.foodMesh.visible = f.nf > 0 && layers !== 'bodies';
        var v = f.view;
        this.uB.uCenter[0] = this.uF.uCenter[0] = v.cx; this.uB.uCenter[1] = this.uF.uCenter[1] = v.cy;
        this.uB.uScale[0] = this.uF.uScale[0] = v.sx; this.uB.uScale[1] = this.uF.uScale[1] = v.sy;
        this.uF.uPx = v.px;
    };
    PixiSide.prototype.draw = function () { this.renderer.render(this.stage); };

    /* The same packer and shaders on a raw WebGL2 context of its own: what the numbers are
     * without PixiJS (vertex arrays, bufferSubData of the used part, the changed indices only). */
    function RawSide(front, W, H, antialias) {
        this.front = front;
        this.view = addCanvas(document.createElement('canvas'), W, H, 'lm-raw-bench');
        var gl = this.gl = this.view.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: antialias, depth: false });
        function prog(vs, fs) {
            var p = gl.createProgram();
            [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(function (s) { var x = gl.createShader(s[0]); gl.shaderSource(x, s[1]); gl.compileShader(x); gl.attachShader(p, x); });
            gl.linkProgram(p);
            if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('raw program: ' + gl.getProgramInfoLog(p));
            return p;
        }
        this.pB = prog(BODY_VS, BODY_FS);
        this.pF = prog(FOOD_VS, FOOD_FS);
        this.uB = { c: gl.getUniformLocation(this.pB, 'uCenter'), s: gl.getUniformLocation(this.pB, 'uScale') };
        this.uF = { c: gl.getUniformLocation(this.pF, 'uCenter'), s: gl.getUniformLocation(this.pF, 'uScale'), px: gl.getUniformLocation(this.pF, 'uPx') };
        this.bPos = gl.createBuffer(); this.bCol = gl.createBuffer(); this.bIdx = gl.createBuffer();
        this.fInst = gl.createBuffer(); this.fCol = gl.createBuffer();
        this.vaoB = gl.createVertexArray();
        gl.bindVertexArray(this.vaoB);
        var aP = gl.getAttribLocation(this.pB, 'aPos'), aC = gl.getAttribLocation(this.pB, 'aColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bPos); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bCol); gl.enableVertexAttribArray(aC); gl.vertexAttribPointer(aC, 4, gl.UNSIGNED_BYTE, true, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIdx);
        this.vaoF = gl.createVertexArray();
        gl.bindVertexArray(this.vaoF);
        var corner = gl.createBuffer(), qi = gl.createBuffer();
        var fC = gl.getAttribLocation(this.pF, 'aCorner'), fI = gl.getAttribLocation(this.pF, 'aInst'), fK = gl.getAttribLocation(this.pF, 'aColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, corner); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(fC); gl.vertexAttribPointer(fC, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fInst); gl.enableVertexAttribArray(fI); gl.vertexAttribPointer(fI, 3, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(fI, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fCol); gl.enableVertexAttribArray(fK); gl.vertexAttribPointer(fK, 4, gl.UNSIGNED_BYTE, true, 0, 0); gl.vertexAttribDivisor(fK, 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, qi); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.bindVertexArray(null);
        this.cap = { pos: null, idx: null, inst: null };
        this.layers = '';
    }
    RawSide.prototype.upload = function (layers) {
        var gl = this.gl, f = this.front, bp = f.body, fp = f.food;
        this.layers = layers || '';
        gl.bindVertexArray(null);
        if (this.cap.pos !== bp.pos) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bPos); gl.bufferData(gl.ARRAY_BUFFER, bp.pos.byteLength, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bCol); gl.bufferData(gl.ARRAY_BUFFER, bp.col.byteLength, gl.DYNAMIC_DRAW);
            this.cap.pos = bp.pos;
        }
        var idxAll = false;
        if (this.cap.idx !== bp.idx) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIdx); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bp.idx.byteLength, gl.DYNAMIC_DRAW);
            this.cap.idx = bp.idx; idxAll = true;
        }
        if (this.cap.inst !== fp.inst) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.fInst); gl.bufferData(gl.ARRAY_BUFFER, fp.inst.byteLength, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.fCol); gl.bufferData(gl.ARRAY_BUFFER, fp.col.byteLength, gl.DYNAMIC_DRAW);
            this.cap.inst = fp.inst;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bPos); gl.bufferSubData(gl.ARRAY_BUFFER, 0, bp.pos, 0, bp.nv * 2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bCol); gl.bufferSubData(gl.ARRAY_BUFFER, 0, bp.col, 0, bp.nv);
        if (f.idxChanged || idxAll) {
            var from = idxAll ? 0 : bp.idxFrom;
            if (bp.ni > from) { gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIdx); gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, from * 4, bp.idx, from, bp.ni - from); }
        }
        if (f.nf) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.fInst); gl.bufferSubData(gl.ARRAY_BUFFER, 0, fp.inst, 0, f.nf * 3);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.fCol); gl.bufferSubData(gl.ARRAY_BUFFER, 0, fp.col, 0, f.nf);
        }
    };
    RawSide.prototype.draw = function () {
        var gl = this.gl, f = this.front, v = f.view;
        gl.viewport(0, 0, this.view.width, this.view.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        if (f.nf && this.layers !== 'bodies') {
            gl.useProgram(this.pF);
            gl.uniform2f(this.uF.c, v.cx, v.cy); gl.uniform2f(this.uF.s, v.sx, v.sy); gl.uniform1f(this.uF.px, v.px);
            gl.bindVertexArray(this.vaoF);
            gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, f.nf);
        }
        if (f.body.ni && this.layers !== 'food') {
            gl.useProgram(this.pB);
            gl.uniform2f(this.uB.c, v.cx, v.cy); gl.uniform2f(this.uB.s, v.sx, v.sy);
            gl.bindVertexArray(this.vaoB);
            gl.drawElements(gl.TRIANGLES, f.body.ni, gl.UNSIGNED_INT, 0);
        }
        gl.bindVertexArray(null);
    };

    /* one frame of a mesh side: pack, upload, draw */
    function meshFrame(side, t, layers) {
        var t0 = now();
        if (!side.front.pack(false)) return -1;
        var t1 = now();
        side.upload(layers);
        side.draw();
        if (t) { t.pack += t1 - t0; t.draw += now() - t1; }
        return 0;
    }

    /* the LM side, with renderFrame's steps for these layers */
    function LmSide(foodT) { this.foodT = foodT; }
    LmSide.prototype.bodies = function () {
        var dr = window.drawRender, gl = dr.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        var ok = dr.drawWebGLCellBatch(window.legendmod.cells);
        return ok;
    };
    LmSide.prototype.text = function () {
        var dr = window.drawRender;
        if (dr.glTextProgram && dr.glTextVAO) dr.drawWebGLTextPass(dr.gl, window.legendmod.cells);
    };
    LmSide.prototype.food = function () {
        var dr = window.drawRender, ctx = dr.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, dr.canvas.width, dr.canvas.height);
        ctx.setTransform(this.foodT);
        dr.drawFood();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    LmSide.prototype.frame = function (t, text) {
        var t0 = now();
        var ok = this.bodies();
        if (text) this.text();
        window.drawRender.gl.disable(window.drawRender.gl.DEPTH_TEST);
        var t1 = now();
        this.food();
        if (t) { t.draw += t1 - t0; t.food += now() - t1; }
        return ok ? 0 : -1;
    };

    /* GPU time of the frames (EXT_disjoint_timer_query_webgl2), read a few frames later */
    function GpuTimer(gl) {
        this.gl = gl;
        this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
        this.pending = []; this.free = []; this.out = []; this.disjoint = 0;
    }
    GpuTimer.prototype.begin = function () {
        if (!this.ext) return;
        var q = this.free.pop() || this.gl.createQuery();
        this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, q);
        this.cur = q;
    };
    GpuTimer.prototype.end = function (tag) {
        if (!this.ext || !this.cur) return;
        this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);
        this.pending.push([this.cur, tag]);
        this.cur = null;
        this.poll();
    };
    GpuTimer.prototype.poll = function () {
        var gl = this.gl;
        while (this.pending.length && gl.getQueryParameter(this.pending[0][0], gl.QUERY_RESULT_AVAILABLE)) {
            var p = this.pending.shift();
            if (gl.getParameter(this.ext.GPU_DISJOINT_EXT)) this.disjoint++;
            else this.out.push([p[1], gl.getQueryParameter(p[0], gl.QUERY_RESULT) / 1e6]);
            this.free.push(p[0]);
        }
    };
    GpuTimer.prototype.take = function (tag) {
        var r = [];
        this.out = this.out.filter(function (x) { if (x[1] >= 0 && x[0] === tag) { r.push(x[1]); return false; } return true; });
        return r;
    };

    /* draw calls / GL calls / uploaded bytes of one frame, by wrapping the context */
    function countCalls(gl, fn) {
        var st = { draws: 0, glCalls: 0, uploadBytes: 0, vertices: 0, byName: {} }, names = [];
        for (var k in gl) if (typeof gl[k] === 'function') names.push(k);
        names.forEach(function (k) {
            var f = gl[k];
            gl[k] = function () {
                st.glCalls++;
                st.byName[k] = (st.byName[k] || 0) + 1;
                if (k === 'drawElements' || k === 'drawArrays' || k === 'drawElementsInstanced' || k === 'drawArraysInstanced' || k === 'drawRangeElements') {
                    st.draws++;
                    st.vertices += k === 'drawArrays' ? arguments[2] : k === 'drawArraysInstanced' ? arguments[2] * arguments[3] : k === 'drawElementsInstanced' ? arguments[1] * arguments[4] : k === 'drawRangeElements' ? arguments[3] : arguments[1];
                } else if (k === 'bufferSubData' || k === 'bufferData') {
                    var d = arguments[2];
                    /* bufferSubData(target, offset, src, srcOffset, length) uploads length elements */
                    if (d && d.byteLength !== undefined) st.uploadBytes += k === 'bufferSubData' && arguments.length >= 5 ? arguments[4] * d.BYTES_PER_ELEMENT : d.byteLength;
                }
                return f.apply(gl, arguments);
            };
        });
        try { fn(); } finally { names.forEach(function (k) { delete gl[k]; }); }
        return st;
    }
    function countCtx(ctx, fn) {
        var st = { calls: 0, fills: 0, arcs: 0 }, names = [];
        for (var k in ctx) if (typeof ctx[k] === 'function') names.push(k);
        names.forEach(function (k) {
            var f = ctx[k];
            ctx[k] = function () { st.calls++; if (k === 'fill' || k === 'stroke') st.fills++; if (k === 'arc') st.arcs++; return f.apply(ctx, arguments); };
        });
        try { fn(); } finally { names.forEach(function (k) { delete ctx[k]; }); }
        return st;
    }

    /* pixels: GL rows bottom-up (flip), 2D rows top-down */
    function readGl(gl, W, H) {
        var a = new Uint8Array(W * H * 4);
        gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, a);
        var out = new Uint8ClampedArray(W * H * 4), row = W * 4;
        for (var y = 0; y < H; y++) out.set(a.subarray((H - 1 - y) * row, (H - y) * row), y * row);
        return out;
    }
    /* RGBA of a premultiplied-alpha GL canvas or a 2D canvas, both as straight colour */
    function unpremul(px) {
        for (var i = 0; i < px.length; i += 4) {
            var a = px[i + 3];
            if (a && a < 255) { px[i] = Math.min(255, Math.round(px[i] * 255 / a)); px[i + 1] = Math.min(255, Math.round(px[i + 1] * 255 / a)); px[i + 2] = Math.min(255, Math.round(px[i + 2] * 255 / a)); }
        }
        return px;
    }
    /* differences of two pictures: colour where both are opaque, coverage (alpha) everywhere */
    function diff(a, b, W, H) {
        var n = W * H, cMax = 0, cOver8 = 0, cOver64 = 0, both = 0, aOver32 = 0, aOver128 = 0, aSum = 0, cover = 0;
        var img = new Uint8ClampedArray(n * 4);
        for (var i = 0, j = 0; j < n; i += 4, j++) {
            var aa = a[i + 3], ba = b[i + 3], ad = Math.abs(aa - ba);
            if (aa || ba) cover++;
            aSum += ad;
            if (ad > 32) aOver32++;
            if (ad > 128) aOver128++;
            var d = 0;
            if (aa >= 250 && ba >= 250) {
                both++;
                d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
                if (d > cMax) cMax = d;
                if (d > 8) cOver8++;
                if (d > 64) cOver64++;
            }
            var m = Math.max(d, ad);
            img[i] = m > 64 ? 255 : m * 3; img[i + 1] = m > 8 && m <= 64 ? 200 : 0; img[i + 2] = 0; img[i + 3] = m ? 255 : 0;
        }
        var pc = function (x, of) { return of ? Math.round(x / of * 100000) / 1000 : 0; };
        return {
            coveredPx: cover, opaqueBothPx: both, colourMax: cMax, colourOver8Pct: pc(cOver8, both), colourOver64Pct: pc(cOver64, both),
            alphaMeanAbs: r2(aSum / n), alphaOver32Pct: pc(aOver32, cover), alphaOver128Pct: pc(aOver128, cover), img: img
        };
    }
    function png(px, W, H) {
        var c = document.createElement('canvas');
        c.width = W; c.height = H;
        var x = c.getContext('2d');
        x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
        var t = document.createElement('canvas');
        t.width = W; t.height = H;
        t.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(px), W, H), 0, 0);
        x.drawImage(t, 0, 0);
        return c.toDataURL('image/png');
    }

    var sides = null;

    /* The comparison on the running bench scene. opts: rounds (block groups lm, pixi, raw, raw,
     * pixi, lm; default 3), frames (per block, default 60), warm (frames per block not counted,
     * 5), sync (frames per synchronous run, 20), images (PNG data URLs of the pictures). */
    async function compare(opts) {
        opts = opts || {};
        var dr = window.drawRender, L = window.legendmod, B = window.LMBenchDense;
        if (!window.PIXI) throw new Error('PixiJS is not loaded');
        if (!dr || !dr.gl || !B) throw new Error('no WebGL2 game renderer or bench scene');
        var res = { pixi: window.PIXI.VERSION, scene: B.state().name, settings: {} };
        ['jellyPhisycs', 'rainbowFood', 'transparentCells', 'transparentViruses', 'virusGlow', 'noColors', 'glAntialias', 'customSkins'].forEach(function (k) { res.settings[k] = window.defaultmapsettings[k]; });
        res.settings.virusStrokeSize = window.defaultSettings.virusStrokeSize;
        B.pause(true);
        await sleep(400);
        /* take the frames over: the game's loop keeps running, its renderFrame does nothing */
        var orig = dr.renderFrame, own = Object.prototype.hasOwnProperty.call(dr, 'renderFrame'), foodT = null;
        var origFood = dr.drawFood, ownFood = Object.prototype.hasOwnProperty.call(dr, 'drawFood');
        dr.renderFrame = function () { };
        var rnd = Math.random;
        var hideAll = function () { if (sides) { sides.pixi.view.style.visibility = 'hidden'; sides.raw.view.style.visibility = 'hidden'; } dr.glCanvas.style.visibility = ''; };
        try {
            /* the snapshot: fresh jelly points, a seeded Math.random, 12 frames (as capture()) */
            var s = 777;
            Math.random = function () { s = (Math.imul(s, 48271) % 2147483647 + 2147483647) % 2147483647; return (s - 1) / 2147483646; };
            L.cells.forEach(function (c) { if (c && c.points) { c.points.length = 0; if (c.pointsVel) c.pointsVel.length = 0; } });
            dr.drawFood = function () { foodT = this.ctx.getTransform(); return origFood.apply(this, arguments); };
            for (var f = 0; f < 12; f++) orig.call(dr);
            if (ownFood) dr.drawFood = origFood; else delete dr.drawFood;
            Math.random = rnd;
            res.lmFrameGL = !!dr._lmFrameGL;
            if (!dr._lmFrameGL) { res.error = 'the game drew this scene with Canvas2D (' + dr._lmGlWhy + '): no WebGL2 picture to compare'; return res; }
            if (!foodT) foodT = new DOMMatrix([dr.scale, 0, 0, dr.scale, dr.canvasWidth / 2 - dr.camX * dr.scale, dr.canvasHeight / 2 - dr.camY * dr.scale]);
            var W = dr.glCanvas.width, H = dr.glCanvas.height, aa = window.defaultmapsettings.glAntialias !== false;
            if (!sides || sides.pixi.view.width !== W || sides.pixi.view.height !== H) {
                var h0 = heap();
                var fP = new Front(), pixi = new PixiSide(fP, W, H, aa);
                res.pixiInitHeapMB = r2((heap() - h0) / 1048576);
                sides = { pixi: pixi, raw: new RawSide(new Front(), W, H, aa) };
            }
            var P = sides.pixi, R = sides.raw;
            res.pixiWebGL2 = P.webgl2;
            var lm = new LmSide(foodT);
            var gl = dr.gl;

            /* -------- world counts and draw order -------- */
            if (lm.bodies() !== true) { res.error = 'drawWebGLCellBatch returned false on the snapshot'; return res; }
            gl.disable(gl.DEPTH_TEST);
            var lmIds = [];
            L.cells.forEach(function (c) { if (c && c._webglRendered) lmIds.push(c.id); });
            if (!P.front.pack(true) || !R.front.pack(false)) { res.error = 'a visible cell has no jelly points'; return res; }
            var ids = P.front.drawnIds;
            var same = lmIds.length === ids.length && lmIds.every(function (id, i) { return id === ids[i]; });
            var pts = 0;
            L.cells.forEach(function (c) { if (c && c._webglRendered && c.points) pts += c.points.length; });
            var bp = P.front.body;
            res.world = { cells: L.cells.length, food: L.food.length, drawnBodies: lmIds.length, jellyPoints: pts, foodDrawn: P.front.nf,
                lmVertices: dr._glJellyVertexCount + dr._glJellyStrokeVertexCount, meshVertices: bp.nv, meshIndices: bp.ni };
            res.order = { identical: same, lmBodies: lmIds.length, meshBodies: ids.length };
            res.unsupported = P.front.unsupported;

            /* -------- pictures: bodies alone, food alone -------- */
            var pic = function (side, layers) { side.upload(layers); side.draw(); return unpremul(readGl(side.gl, W, H)); };
            lm.bodies(); gl.disable(gl.DEPTH_TEST);
            var lmPx = unpremul(readGl(gl, W, H));
            var pxPx = pic(P, 'bodies'), rwPx = pic(R, 'bodies');
            lm.food();
            var lmF = dr.ctx.getImageData(0, 0, W, H).data;
            var pxF = pic(P, 'food'), rwF = pic(R, 'food');
            P.upload(''); R.upload('');
            var dB = diff(lmPx, pxPx, W, H), dF = diff(lmF, pxF, W, H), dR = diff(pxPx, rwPx, W, H), dRF = diff(pxF, rwF, W, H);
            var strip = function (d) { var o = Object.assign({}, d); delete o.img; return o; };
            res.parity = { bodies: strip(dB), food: strip(dF), pixiVsRawBodies: strip(dR), pixiVsRawFood: strip(dRF) };
            if (opts.images) res.images = { lmBodies: png(lmPx, W, H), pixiBodies: png(pxPx, W, H), diffBodies: png(dB.img, W, H), lmFood: png(lmF, W, H), pixiFood: png(pxF, W, H), diffFood: png(dF.img, W, H) };

            /* -------- calls per frame (untimed; after one plain frame each, so that no upload of the
             * picture frames is left over) -------- */
            meshFrame(P, null, ''); meshFrame(R, null, '');
            var cl = countCalls(gl, function () { lm.bodies(); gl.disable(gl.DEPTH_TEST); });
            var cf = countCtx(dr.ctx, function () { lm.food(); });
            var cp = countCalls(P.gl, function () { meshFrame(P, null, ''); });
            var cr = countCalls(R.gl, function () { meshFrame(R, null, ''); });
            var callRow = function (c) { return { glDraws: c.draws, glCalls: c.glCalls, uploadBytes: c.uploadBytes, vertices: c.vertices, byName: c.byName }; };
            res.calls = { lm: Object.assign(callRow(cl), { foodCtxCalls: cf.calls, foodCtxFills: cf.fills, foodCtxArcs: cf.arcs }), pixi: callRow(cp), raw: callRow(cr) };
            var arrBytes = function (a) { return a && a.byteLength ? a.byteLength : 0; };
            res.memory = {
                lmJellyArraysMB: r2((arrBytes(dr.glJellyVertexData) + arrBytes(dr.glJellyStrokeVertexData) + arrBytes(dr.glJellyIndexData) + arrBytes(dr.glJellyStrokeIndexData)) / 1048576),
                meshArraysMB: r2((bp.bytes() + P.front.food.bytes()) / 1048576)
            };

            /* -------- timed frames: blocks lm, pixi, raw, raw, pixi, lm (drift cancels), then lmtext -------- */
            var tm = { lm: new GpuTimer(gl), pixi: new GpuTimer(P.gl), raw: new GpuTimer(R.gl) };
            tm.lmtext = tm.lm;
            res.gpuTimer = !!(tm.lm.ext && tm.pixi.ext && tm.raw.ext);
            var rounds = opts.rounds || 3, per = opts.frames || 60, warm = opts.warm != null ? opts.warm : 5;
            var seq = [];
            for (var r = 0; r < rounds; r++) seq.push('lm', 'pixi', 'raw', 'raw', 'pixi', 'lm');
            seq.push('lmtext', 'lmtext');
            var acc = {};
            ['lm', 'pixi', 'raw', 'lmtext'].forEach(function (m) { acc[m] = { cpu: [], pack: [], draw: [], food: [], iv: [], heapPerFrame: [], blocks: 0 }; });
            for (var b = 0; b < seq.length && !res.error; b++) {
                var m = seq[b], A = acc[m], side = m === 'pixi' ? P : m === 'raw' ? R : null;
                P.view.style.visibility = m === 'pixi' ? 'visible' : 'hidden';
                R.view.style.visibility = m === 'raw' ? 'visible' : 'hidden';
                dr.glCanvas.style.visibility = side ? 'hidden' : '';
                var prev = 0, hb = 0, fb = 0;
                for (var k = 0; k < per + warm; k++) {
                    var ts = await raf();
                    var t = { pack: 0, draw: 0, food: 0 }, t0 = now();
                    if (k === warm) hb = heap();
                    tm[m].begin();
                    var rc = side ? meshFrame(side, t, '') : lm.frame(t, m === 'lmtext');
                    tm[m].end(k >= warm ? m : '-');
                    var dt = now() - t0;
                    if (rc < 0) { res.error = m + ' frame failed'; break; }
                    if (k >= warm) {
                        A.cpu.push(dt); A.pack.push(t.pack); A.draw.push(t.draw); A.food.push(t.food);
                        if (prev) A.iv.push(ts - prev);
                        fb++;
                    }
                    prev = k >= warm ? ts : 0;
                }
                var hd = heap() - hb;
                if (hd >= 0 && fb) A.heapPerFrame.push(hd / fb);
                A.blocks++;
            }
            /* the last queries */
            for (var w = 0; w < 10 && (tm.lm.pending.length || tm.pixi.pending.length || tm.raw.pending.length); w++) { await raf(); tm.lm.poll(); tm.pixi.poll(); tm.raw.poll(); }
            hideAll();
            res.timed = {};
            Object.keys(acc).forEach(function (m) {
                var A = acc[m], g = tm[m].take(m), mesh = m === 'pixi' || m === 'raw';
                res.timed[m] = { blocks: A.blocks, cpuMs: dist(A.cpu), packMs: mesh ? dist(A.pack) : undefined, drawMs: dist(A.draw), foodMs: mesh ? undefined : dist(A.food),
                    frameIntervalMs: dist(A.iv), gpuMs: g.length ? dist(g) : null, heapBytesPerFrame: A.heapPerFrame.length ? Math.round(dist(A.heapPerFrame).p50) : null };
            });
            res.gpuDisjoint = tm.lm.disjoint + tm.pixi.disjoint + tm.raw.disjoint;

            /* -------- synchronous total: N frames then a 1-pixel readback, alternating -------- */
            var N = opts.sync || 20, px1 = new Uint8Array(4), sync = { lm: [], pixi: [], raw: [] }, sq = ['lm', 'pixi', 'raw', 'raw', 'pixi', 'lm', 'lm', 'pixi', 'raw'];
            for (var q = 0; q < sq.length; q++) {
                var mm = sq[q], sd = mm === 'pixi' ? P : mm === 'raw' ? R : null;
                await raf();
                var s0 = now();
                for (var z = 0; z < N; z++) { if (sd) meshFrame(sd, null, ''); else lm.frame(null, false); }
                if (sd) sd.gl.readPixels(0, 0, 1, 1, sd.gl.RGBA, sd.gl.UNSIGNED_BYTE, px1);
                else { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px1); dr.ctx.getImageData(0, 0, 1, 1); }
                sync[mm].push((now() - s0) / N);
            }
            res.syncMsPerFrame = { lm: dist(sync.lm), pixi: dist(sync.pixi), raw: dist(sync.raw) };
            return res;
        } finally {
            Math.random = rnd;
            if (own) dr.renderFrame = orig; else delete dr.renderFrame;
            if (dr.drawFood !== origFood) { if (ownFood) dr.drawFood = origFood; else delete dr.drawFood; }
            hideAll();
            B.pause(false);
        }
    }

    root.LMPixiBench = { compare: compare, BodyPack: BodyPack, FoodPack: FoodPack, rgba: rgba };
})(typeof window !== 'undefined' ? window : this);
