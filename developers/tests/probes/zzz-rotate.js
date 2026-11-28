// Rotate Map rendered geometry, in the real page: a stand-in world (as lib/bench-scene.js builds it:
// packets through stand-in sockets, nothing sent to any server) with the main player, a multibox
// unit (real spect.js, its own offset frame) and two Full Map tiles (real spect.js spectators, their
// own offset frames), cells, a virus, pellets of every connection, an opcode 69 ghost list, a moving
// cell, the viewports and the cursor. For each Rotate Map orientation (the 4 flips, reached from
// each other) a frame is drawn in Canvas2D and in WebGL and read back: every cell, pellet and the
// virus is found by its colour exactly once at the display place of its world position, the ghost
// outside every view is drawn (Canvas2D arc) at its flipped place and the one inside a tile's view
// is not, the camera is on the main player's flipped place (no jump in the first frame after a
// flip), the viewport boxes are the flipped server views of the tiles and hold the tiles' cells,
// the moving cell keeps its server direction (drawn the other way on a flipped axis), and the
// cursor on a drawn point sends that point's raw target on the main socket and on the unit's;
// the paused main player keeps its raw hold point across a flip. Runs late: it leaves the server.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod, dr = window.drawRender, app = window.application;
  if (!lm || !dr || !app || typeof lm.handleMessage !== 'function' || typeof Spect !== 'function' || !window.spects ||
      typeof app.settechvnr !== 'function' || typeof window.addBox !== 'function') return { skip: 'game not ready' };
  if (!dr.canvas || !(dr.canvasWidth > 0)) return { skip: 'no game canvas' };

  /* ---------- packets (the layouts of lib/bench-scene.js) ---------- */
  function Wr() { this.b = []; this.dv = new DataView(new ArrayBuffer(8)); }
  Wr.prototype.u8 = function (v) { this.b.push(v & 255); return this; };
  Wr.prototype.n = function (k, set, v) { this.dv[set](0, v, true); for (var i = 0; i < k; i++) this.b.push(this.dv.getUint8(i)); return this; };
  Wr.prototype.u16 = function (v) { return this.n(2, 'setUint16', v); };
  Wr.prototype.u32 = function (v) { return this.n(4, 'setUint32', v >>> 0); };
  Wr.prototype.i32 = function (v) { return this.n(4, 'setInt32', v | 0); };
  Wr.prototype.f32 = function (v) { return this.n(4, 'setFloat32', v); };
  Wr.prototype.f64 = function (v) { return this.n(8, 'setFloat64', v); };
  Wr.prototype.done = function () { return new Uint8Array(this.b).buffer; };
  var pBorder = function (b) { return new Wr().u8(64).f64(b[0]).f64(b[1]).f64(b[2]).f64(b[3]).done(); };
  var pOwn = function (id) { return new Wr().u8(32).u32(id).done(); };
  var pCam = function (x, y, s) { return new Wr().u8(17).f32(x).f32(y).f32(s).done(); };
  var pGhosts = function (list) { var w = new Wr().u8(69).u16(list.length); list.forEach(function (g) { w.i32(g[0]).i32(g[1]).u32(g[2]).u8(0); }); return w.done(); };

  /* ---------- the scene (main raw coordinates; every other connection sees raw = main raw + its offset) ---------- */
  var B = [-5000, -6000, 9142, 8142];                 /* the main border, not centred on 0: a flip maps x to 4142 - x, y to 2142 - y */
  var MID = [(B[0] + B[2]) / 2, (B[1] + B[3]) / 2];  /* the main centre (world 0, 0) */
  var VS = typeof lmServerViewSize === 'function' ? lmServerViewSize(0.4) : [5071.75, 2972];
  var conns = [
    { name: 'main', off: [0, 0] },
    { name: 'unit', off: [3000, -2000] },
    { name: 'tile1', off: [-1000, 3000], tile: 0, at: [Math.round(-166 - VS[0] / 2), 300] },
    { name: 'tile2', off: [500, 500], tile: 1, at: [1000, Math.round(1815 + VS[1] / 2)] }
  ];
  /* entities: id, main-raw x, y, size, colour, the connections that see it (the first two: the own cells of the main socket and the unit) */
  var E = [
    { k: 'main player', id: 1, x: 1000, y: 500, r: 150, c: [40, 90, 200], see: [0, 1] },
    { k: 'unit player', id: 2, x: 1900, y: 300, r: 130, c: [230, 120, 30], see: [0, 1] },
    { k: 'player P1', id: 10, x: 300, y: 600, r: 110, c: [200, 40, 160], see: [0, 1] },
    { k: 'player P2 (unit only)', id: 11, x: 2500, y: -300, r: 95, c: [120, 200, 40], see: [1] },
    { k: 'virus', id: 12, x: 1000, y: 1250, r: 100, c: [51, 255, 51], see: [0], virus: true },
    { k: 'moving cell', id: 13, x: -300, y: -500, r: 85, c: [250, 230, 60], see: [0], vx: 6, vy: 3, moving: true },
    { k: 'tile 1 cell', id: 20, x: -900, y: 200, r: 100, c: [60, 220, 220], see: [2] },
    { k: 'tile 2 cell', id: 21, x: 2000, y: 1950, r: 70, c: [250, 90, 90], see: [3] }
  ];
  var FOOD = [[500, 150, [0]], [1500, 150, [0]], [500, 850, [0]], [1500, 850, [0, 1]], [2300, 700, [1]], [-1100, 900, [2]], [300, 1900, [3]]]
    .map(function (f, i) { return { id: 50 + i, x: f[0], y: f[1], r: 12, see: f[2] }; });
  /* ghosts (opcode 69 on the main socket): G outside every view (drawn), G2 inside tile 1's view with no cell (stale: not drawn) */
  var GH = [{ k: 'G', x: 3000, y: 1300, mass: 400, drawn: true }, { k: 'G2', x: -1300, y: 1200, mass: 225, drawn: false }];
  var cellId = function (ci, id) { return ci ? id + 1000 * ci : id; };
  function update(ci, fresh) {
    var c = conns[ci], main = ci === 0, w = new Wr().u8(16).u16(0);
    var put = function (id, x, y, r, col, type) {
      var isNew = fresh || !c.sent[id];
      c.sent[id] = true;
      var flags = (main ? 0x80 : 0) | (type === 2 ? 1 : 0) | (isNew ? 2 : 0);
      w.u32(cellId(ci, id)).i32(Math.round(x + c.off[0])).i32(Math.round(y + c.off[1])).u16(r).u8(flags);
      if (isNew) w.u8(col[0]).u8(col[1]).u8(col[2]);
      if (main) w.u16(type).u8(0);
    };
    E.forEach(function (e) { if (e.see.indexOf(ci) >= 0) put(e.id, e.x, e.y, e.r, e.c, e.virus ? 2 : 0); });
    FOOD.forEach(function (f) { if (f.see.indexOf(ci) >= 0) put(f.id, f.x, f.y, f.r, [255, 255, 255], 1); });
    w.u32(0).u16(0);
    return w.done();
  }
  var feed = function (c, buf) { if (c.sp) { if (c.sp.socket && c.sp.socket.onmessage) c.sp.socket.onmessage({ data: buf }); } else lm.handleMessage(new DataView(buf)); };
  var rawCam = function (c) { return [Math.round(c.at[0] - MID[0] + (c.border[0] + c.border[2]) / 2), Math.round(c.at[1] - MID[1] + (c.border[1] + c.border[3]) / 2)]; };
  var mv = E.filter(function (e) { return e.moving; })[0];
  mv.turns = [0, 0];
  function tick() {
    mv.x += mv.vx; mv.y += mv.vy;
    if (mv.x > 600 || mv.x < -700) { mv.vx = -mv.vx; mv.turns[0]++; }
    if (mv.y > -380 || mv.y < -640) { mv.vy = -mv.vy; mv.turns[1]++; }
    for (var i = 0; i < conns.length; i++) {
      var c = conns[i];
      try {
        feed(c, update(i, false));
        if (c.tile != null) { var cam = rawCam(c); feed(c, pCam(cam[0], cam[1], 0.4)); }
      } catch (e) { errs.push(c.name + ' packet: ' + e); }
    }
    try { lm.handleMessage(new DataView(pGhosts(GH.map(function (g) { return [g.x, g.y, g.mass]; })))); } catch (e) { errs.push('ghost list: ' + e); }
  }

  /* ---------- set up (as LMBenchDense setup: leave the server, stand-in sockets) ---------- */
  var errs = [], sends = [];
  var fakeSocket = function (url, log) {
    return { readyState: 1, OPEN: 1, CONNECTING: 0, CLOSING: 2, CLOSED: 3, binaryType: 'arraybuffer', bufferedAmount: 0, url: url, _lwIntegrity: false,
      onopen: null, onmessage: null, onclose: null, onerror: null, send: function (m) { if (log) log.push(m); }, close: function () { this.readyState = 3; } };
  };
  var D = window.defaultmapsettings, DS = window.defaultSettings;
  var set = { jellyPhisycs: false, noNames: true, showMass: false, rainbowFood: false, showGrid: false, showMapBorders: false, showBgSectors: false, oppRings: false,
    oppColors: false, splitRange: false, virusesRange: false, cursorTracking: false, transparentCells: false, transparentSkins: false, fpsLimit: 0, showGhostCells: true,
    debug: false, webgl2Acceleration: true, middleMultiView: false, middleMultiViewWhenClose: false, centerWeightCamera: false, autoHideFood: false, autoHideFoodOnZoom: false,
    mbFreeze: false, multiKeepMoving: false };
  var prev = {}, prevDS = { foodColor: DS.foodColor }, prevLm = { showCustomSkins: lm.showCustomSkins, showFood: lm.showFood, serverType: lm.serverType, integrity: lm.integrity,
    connectionIntegrity: lm.connectionIntegrity, gameMode: lm.gameMode, pause: lm.pause };
  Object.keys(set).forEach(function (k) { prev[k] = D[k]; D[k] = set[k]; });
  DS.foodColor = '#ff00ff';
  if (dr.preDrawPellet) try { dr.preDrawPellet(); } catch (e) { }
  lm.showCustomSkins = false; lm.showFood = true;
  var tok = document.getElementById('server-token'), prevTok = tok ? tok.value : '', prevFull = window.fullSpectator, prevRec = window.temporaryRecordedProtocol;
  var origSetView = dr.setView, ownSetView = Object.prototype.hasOwnProperty.call(dr, 'setView');
  var S = Math.min(dr.canvasWidth / 5400, dr.canvasHeight / 3400);
  var timer = null, created = [], prevCreate = window.createLegendWebSocket;
  info.view = { css: [dr.canvasWidth, dr.canvasHeight], dpr: dr.dpr || 1, scale: Math.round(S * 1000) / 1000 };
  try {
    if (window.LMPractice && window.LMPractice.on && window.LMPractice.stop) window.LMPractice.stop(false);
    if (lm._reconnTimer) { clearTimeout(lm._reconnTimer); lm._reconnTimer = null; }
    lm._reconnAttempts = 0; lm._reconnStartTime = 0; lm._lmReconnWs = null;
    lm._connectSeq = (lm._connectSeq || 0) + 1;
    try { lm.closeConnection(); } catch (e) { }
    if (tok) tok.value = '';
    window.temporaryRecordedProtocol = null;
    try { lm.flushCellsData(); } catch (e) { }
    if (typeof app._resetRotationVectorTable === 'function') app._resetRotationVectorTable();
    lm.vnr = 0;
    window.multiboxPlayerEnabled = null; window.mainPlayerDeadMbActive = false;
    lm.play = false; lm._spawnTransitGate = false; lm.pause = false;
    lm.socket = fakeSocket('lm-bench://local', sends); lm.ws = 'lm-bench://local';
    lm.serverType = 'private'; lm.integrity = false; lm.connectionIntegrity = false; lm.connectionOpened = true;
    lm.protocolKey = 0; lm.clientKey = null; lm.isLegendWorld = false;
    if (lm.gameMode === ':teams' || lm.gameMode === ':party' || lm.gameMode === ':battleroyale') lm.gameMode = ':ffa';
    /* a fixed zoom; the camera position is the game's own */
    dr.setView = function () { var r = origSetView.apply(this, arguments); this.scale = S; lm.viewScale = S; return r; };
    conns.forEach(function (c) { c.sent = {}; c.border = [B[0] + c.off[0], B[1] + c.off[1], B[2] + c.off[0], B[3] + c.off[1]]; });
    lm.handleMessage(new DataView(new Uint8Array([18]).buffer));
    feed(conns[0], pBorder(B));
    feed(conns[0], pOwn(1));
    feed(conns[0], update(0, true));
    lm.play = true;
    window.fullSpectator = true;
    window.createLegendWebSocket = function (url) { return fakeSocket(url, null); };
    try {
      var u = window.addBox();
      if (!u) throw new Error('no free multibox slot');
      conns[1].sp = u; created.push(u);
      u.socket.onopen();
      feed(conns[1], pBorder(conns[1].border));
      feed(conns[1], pOwn(cellId(1, 2)));
      feed(conns[1], update(1, true));
      [2, 3].forEach(function (i) {
        var c = conns[i];
        var sp = new Spect({ staticX: c.at[0] - MID[0], staticY: c.at[1] - MID[1], tile: c.tile });
        window.spects.push(sp); created.push(sp); c.sp = sp;
        sp.socket.onopen();
        feed(c, pBorder(c.border));
        var cam = rawCam(c);
        feed(c, pCam(cam[0], cam[1], 0.4));
        feed(c, update(i, true));
      });
    } finally {
      if (prevCreate === undefined) { try { delete window.createLegendWebSocket; } catch (e) { window.createLegendWebSocket = undefined; } } else window.createLegendWebSocket = prevCreate;
    }
    tick();
    timer = setInterval(tick, 40);
    await sleep(1500);
    /* the main player is the one controlled (a unit's first spawn may take the focus) */
    info.focusAfterSpawn = window.multiboxPlayerEnabled || 0;
    var setFocus = function (n) { if (typeof lmSetMbUnit === 'function') lmSetMbUnit(n); else window.multiboxPlayerEnabled = n || null; };
    setFocus(0);
    await sleep(300);

    /* ---------- reading a frame ---------- */
    var flipOf = function (v) { var m = [[0, 0], [1, 0], [1, 1], [0, 1]][v]; return [!!m[0], !!m[1]]; };
    var T = function (v, x, y) { var f = flipOf(v); return [f[0] ? B[0] + B[2] - x : x, f[1] ? B[1] + B[3] - y : y]; };
    var units = function (e) { return [e.x, e.y]; };
    function frame(opt) {
      opt = opt || {};
      var arcs = [], boxes = [], ctx = dr.ctx, oArc = ctx.arc, oGhost = dr.drawGhostCells, oBox = dr.drawViewport, inGhost = false;
      var ownGhost = Object.prototype.hasOwnProperty.call(dr, 'drawGhostCells'), ownBox = Object.prototype.hasOwnProperty.call(dr, 'drawViewport');
      ctx.arc = function (x, y, r) { if (inGhost) { var m = ctx.getTransform(); arcs.push({ x: x, y: y, r: r, sx: m.a * x + m.c * y + m.e, sy: m.b * x + m.d * y + m.f }); } return oArc.apply(this, arguments); };
      dr.drawGhostCells = function () { inGhost = true; try { return oGhost.apply(this, arguments); } finally { inGhost = false; } };
      dr.drawViewport = function (c, text, a, b, cc, d) { boxes.push({ t: String(text), r: [a, b, cc, d] }); return oBox.apply(this, arguments); };
      D.debug = !!opt.boxes;
      var out = {};
      try {
        dr.renderFrame();
        out.gl = !!dr._lmFrameGL; out.why = dr._lmGlWhy; out.cam = [dr.camX, dr.camY]; out.scale = dr.scale; out.dpr = dr.dpr || 1; out.cw = dr.canvasWidth; out.ch = dr.canvasHeight;
        if (opt.pixels) {
          var base = dr.canvas, W = base.width, H = base.height, cv = document.createElement('canvas');
          cv.width = W; cv.height = H;
          var x = cv.getContext('2d');
          x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
          var layers = [dr.backgroundCanvas, dr.gridCanvas, dr.canvas, dr.glCanvas, dr.overlayCanvas].filter(function (e) { return e && e.width && e.style.display !== 'none'; });
          layers.sort(function (p, q) { return (+getComputedStyle(p).zIndex || 0) - (+getComputedStyle(q).zIndex || 0); });
          layers.forEach(function (e) { try { x.drawImage(e, 0, 0, W, H); } catch (err) { } });
          out.img = x.getImageData(0, 0, W, H); out.W = W; out.H = H;
        }
      } finally {
        ctx.arc = oArc;
        if (ownGhost) dr.drawGhostCells = oGhost; else delete dr.drawGhostCells;
        if (ownBox) dr.drawViewport = oBox; else delete dr.drawViewport;
        D.debug = false;
      }
      out.arcs = arcs; out.boxes = boxes;
      out.px = function (p) { return [out.dpr * ((p[0] - out.cam[0]) * out.scale + out.cw / 2), out.dpr * ((p[1] - out.cam[1]) * out.scale + out.ch / 2)]; };
      return out;
    }
    var pix = function (f, p) { var q = f.px(p), i = (Math.round(q[1]) * f.W + Math.round(q[0])) * 4, d = f.img.data; return [d[i], d[i + 1], d[i + 2]]; };
    var hex = function (h) { h = String(h || '').replace('#', ''); return h.length === 6 ? [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] : null; };
    /* connected areas of the frame in one of the colours (each channel within tol) */
    function blobs(f, cols, tol, skip) {
      var W = f.W, H = f.H, d = f.img.data, n = W * H, mask = new Uint8Array(n), out = [], st = new Int32Array(n), i, k;
      for (i = 0; i < n; i++) {
        var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
        if (skip && skip[i]) continue;
        for (k = 0; k < cols.length; k++) { var c = cols[k]; if (Math.abs(r - c[0]) <= tol && Math.abs(g - c[1]) <= tol && Math.abs(b - c[2]) <= tol) { mask[i] = 1; break; } }
      }
      for (i = 0; i < n; i++) {
        if (mask[i] !== 1) continue;
        var sp = 0, cnt = 0, sx = 0, sy = 0;
        st[sp++] = i; mask[i] = 2;
        while (sp) {
          var j = st[--sp], jx = j % W, jy = (j - jx) / W;
          cnt++; sx += jx; sy += jy;
          if (jx > 0 && mask[j - 1] === 1) { mask[j - 1] = 2; st[sp++] = j - 1; }
          if (jx < W - 1 && mask[j + 1] === 1) { mask[j + 1] = 2; st[sp++] = j + 1; }
          if (jy > 0 && mask[j - W] === 1) { mask[j - W] = 2; st[sp++] = j - W; }
          if (jy < H - 1 && mask[j + W] === 1) { mask[j + W] = 2; st[sp++] = j + W; }
        }
        out.push({ n: cnt, x: sx / cnt + 0.5, y: sy / cnt + 0.5 });
      }
      return out;
    }
    var cellOf = function (ci, id) { return lm.indexedCells[ci ? (typeof lmUnitCellId === 'function' ? lmUnitCellId(cellId(ci, id), conns[ci].sp.number) : cellId(ci, id)) : id]; };

    /* the colours, from the unflipped frame of each renderer: what is drawn at each entity's place */
    var palette = {};
    var near = function (a, b, t) { return Math.abs(a[0] - b[0]) <= t && Math.abs(a[1] - b[1]) <= t && Math.abs(a[2] - b[2]) <= t; };
    function learn(f, rk) {
      var p = palette[rk] = { bg: pix(f, [B[0] + 300, B[1] + 300]), groups: [] };
      var bad = [];
      E.forEach(function (e) {
        if (e.moving) return;
        var c = pix(f, units(e)), cols = [c];
        e.see.forEach(function (ci) { var cell = cellOf(ci, e.id), h = cell && hex(cell.color); if (h) cols.push(h); });
        if (near(c, p.bg, 12)) bad.push(e.k);
        /* entities drawn in one colour (the own cells of every player of ours) are one group */
        var g = p.groups.filter(function (q) { return near(q.c, c, 10); })[0];
        if (!g) p.groups.push(g = { c: c, cols: [], es: [] });
        g.cols = g.cols.concat(cols); g.es.push(e);
      });
      var fc = pix(f, [FOOD[0].x, FOOD[0].y]);
      p.food = [fc, [255, 0, 255]];
      if (bad.length) fail.push(rk + ' vnr 0: nothing drawn at the place of ' + bad.join(', '));
      info.groups = p.groups.map(function (g) { return g.es.map(function (e) { return e.k; }).join('+'); });
    }
    /* every entity found exactly once where its world position is drawn under orientation v (in
     * its colour group: as many areas of the colour as entities, one at each place); the drawn
     * ghosts (soft glow) are left out of the search */
    function checkPixels(f, v, label, rk) {
      var p = palette[rk], rpx = f.scale * f.dpr, bad = [];
      var skip = new Uint8Array(f.W * f.H);
      f.arcs.forEach(function (a) {
        var R = (a.r * f.scale + 48) * f.dpr;
        for (var yy = Math.max(0, Math.floor(a.sy - R)); yy < Math.min(f.H, Math.ceil(a.sy + R)); yy++)
          for (var xx = Math.max(0, Math.floor(a.sx - R)); xx < Math.min(f.W, Math.ceil(a.sx + R)); xx++) if (Math.hypot(xx - a.sx, yy - a.sy) < R) skip[yy * f.W + xx] = 1;
      });
      var mc = cellOf(0, mv.id), mvAt = mc ? [mc.x, mc.y] : null;
      var groups = p.groups.slice();
      if (mvAt) { var mh = hex(mc.color); groups.push({ cols: [pix(f, mvAt)].concat(mh ? [mh] : []), es: [mv], at: [mvAt] }); }
      else bad.push('moving cell: no cell');
      groups.forEach(function (g) {
        var min = Infinity;
        g.es.forEach(function (e) { min = Math.min(min, Math.max(6, 0.08 * Math.PI * e.r * e.r * rpx * rpx)); });
        var bl = blobs(f, g.cols, 10, skip).filter(function (b) { return b.n >= min; }), used = {};
        g.es.forEach(function (e, i) {
          var at = f.px(g.at ? g.at[i] : T(v, e.x, e.y)), tol = Math.max(2.5, 0.12 * e.r * rpx), k = -1;
          for (var j = 0; j < bl.length; j++) if (!used[j] && Math.hypot(bl[j].x - at[0], bl[j].y - at[1]) <= tol) { k = j; break; }
          if (k < 0) bad.push(e.k + ' not drawn at ' + Math.round(at[0]) + ',' + Math.round(at[1])); else used[k] = true;
        });
        if (bl.length !== g.es.length) bad.push(g.es.map(function (e) { return e.k; }).join(' + ') + ': ' + bl.length + ' drawn (' +
          bl.slice(0, 4).map(function (b) { return Math.round(b.x) + ',' + Math.round(b.y) + '/' + b.n; }).join(' ') + ')');
      });
      /* pellets: one colour for all; every pellet once, nothing else */
      var fr = (FOOD[0].r + (DS.foodSize || 0)) * rpx, fbl = blobs(f, p.food, 16, skip).filter(function (b) { return b.n >= Math.max(3, 0.25 * Math.PI * fr * fr); });
      var miss = [], used = {};
      FOOD.forEach(function (fd) {
        var at = f.px(T(v, fd.x, fd.y)), k = -1;
        for (var i = 0; i < fbl.length; i++) if (!used[i] && Math.hypot(fbl[i].x - at[0], fbl[i].y - at[1]) <= Math.max(2.5, 0.3 * fr)) { k = i; break; }
        if (k < 0) miss.push(fd.x + ',' + fd.y); else used[k] = true;
      });
      if (miss.length || fbl.length !== FOOD.length) bad.push('pellets (' + fbl.length + ' drawn of ' + FOOD.length + ', missing ' + miss.join(' ') + ')');
      if (bad.length) fail.push(label + ': ' + bad.join('; '));
      return !bad.length;
    }
    /* the ghosts: drawn by drawGhostCells (Canvas2D arcs) */
    function checkGhosts(f, v, label) {
      var bad = [];
      GH.forEach(function (g) {
        var w = T(v, g.x, g.y), sz = Math.floor(Math.sqrt(100 * g.mass));
        var at = f.arcs.filter(function (a) { return Math.abs(a.r - sz) < 1 && Math.hypot(a.x - w[0], a.y - w[1]) < 1; });
        var px = f.px(w), scr = f.arcs.filter(function (a) { return Math.abs(a.r - sz) < 1 && Math.hypot(a.sx - px[0], a.sy - px[1]) < 1.5; });
        var mirror = f.arcs.filter(function (a) { return Math.abs(a.r - sz) < 1 && !(Math.hypot(a.x - w[0], a.y - w[1]) < 1); });
        if (g.drawn ? !(at.length === 1 && scr.length === 1 && !mirror.length) : (at.length || mirror.length))
          bad.push(g.k + (g.drawn ? ' not drawn once at its flipped place' : ' drawn (inside tile 1\'s view)') + ' [' + f.arcs.map(function (a) { return Math.round(a.x) + ',' + Math.round(a.y) + '/' + Math.round(a.r); }).join(' ') + ']');
      });
      if (bad.length) fail.push(label + ': ' + bad.join('; '));
    }
    /* the viewport boxes: the tiles' server views, flipped; the main box and the unit's food box
     * the flips of the unflipped ones; the map box the border */
    var boxes0 = null;
    var norm = function (r) { return [Math.min(r[0], r[2]), Math.min(r[1], r[3]), Math.max(r[0], r[2]), Math.max(r[1], r[3])]; };
    var flipBox = function (v, r) { var a = T(v, r[0], r[1]), b = T(v, r[2], r[3]); return norm([a[0], a[1], b[0], b[1]]); };
    var sameBox = function (a, b, t) { return a && b && Math.abs(a[0] - b[0]) <= t && Math.abs(a[1] - b[1]) <= t && Math.abs(a[2] - b[2]) <= t && Math.abs(a[3] - b[3]) <= t; };
    function checkBoxes(f, v, label) {
      var bad = [], by = {};
      f.boxes.forEach(function (b) { (by[b.t] = by[b.t] || []).push(norm(b.r)); });
      if (!sameBox(by.map && by.map[0], B, 0.01)) bad.push('map box ' + JSON.stringify(by.map));
      [2, 3].forEach(function (ci) {
        var c = conns[ci], name = 'Viewport# ' + c.sp.number, got = by[name];
        var want = flipBox(v, [c.at[0] - VS[0] / 2, c.at[1] - VS[1] / 2, c.at[0] + VS[0] / 2, c.at[1] + VS[1] / 2]);
        if (!got || got.length !== 1) { bad.push(name + ' drawn ' + (got ? got.length : 0) + ' times (boxes: ' + Object.keys(by).join(', ') + ')'); return; }
        if (!sameBox(got[0], want, 1)) bad.push(name + ' at ' + got[0].map(Math.round) + ', its view ' + want.map(Math.round));
        E.forEach(function (e) {
          if (e.see.indexOf(ci) < 0) return;
          var p = T(v, e.x, e.y);
          if (!(p[0] > got[0][0] && p[0] < got[0][2] && p[1] > got[0][1] && p[1] < got[0][3])) bad.push(name + ' does not hold ' + e.k);
        });
      });
      if (v === 0) boxes0 = by;
      else if (boxes0) ['1', String(conns[1].sp.number + 1)].forEach(function (k) {
        if (!(by[k] && boxes0[k] && sameBox(by[k][0], flipBox(v, boxes0[k][0]), 1))) bad.push('box ' + k + ' ' + JSON.stringify(by[k]) + ' is not the flip of ' + JSON.stringify(boxes0[k]));
      });
      else bad.push('no unflipped boxes');
      if (bad.length) fail.push(label + ': ' + bad.join('; '));
    }
    /* the camera: on the main player's drawn place */
    function checkCam(f, v, label, tol) {
      var w = T(v, E[0].x, E[0].y);
      if (!(Math.abs(f.cam[0] - w[0]) <= tol && Math.abs(f.cam[1] - w[1]) <= tol)) fail.push(label + ': camera at ' + f.cam.map(Math.round) + ', the main player at ' + w);
    }
    /* the cursor on the drawn place of main-raw point P: the main socket sends P, the unit (controlled) P + its offset */
    var lastPos = function (log) {
      for (var i = log.length - 1; i >= 0; i--) {
        var m = log[i], dv = m instanceof DataView ? m : new DataView(m.buffer || m, m.byteOffset || 0, m.byteLength);
        if (dv.byteLength >= 9 && dv.getUint8(0) === 16) return [dv.getInt32(1, true), dv.getInt32(5, true)];
      }
      return null;
    };
    function checkCursor(v, label) {
      var P = [1700, 950], w = T(v, P[0], P[1]), bad = [];
      var aim = function () {
        lm.clientX = (w[0] - dr.camX) * lm.viewScale + lm.canvasWidth / 2;
        lm.clientY = (w[1] - dr.camY) * lm.viewScale + lm.canvasHeight / 2;
        lm.getCursorPosition();
      };
      aim();
      sends.length = 0;
      lm._lmLastCursorAt = 0;
      lm.sendPosition();
      var m = lastPos(sends);
      if (!(m && Math.abs(m[0] - P[0]) <= 1 && Math.abs(m[1] - P[1]) <= 1)) bad.push('main sent ' + m + ' for raw ' + P + ' (cursor ' + [lm.cursorX, lm.cursorY].map(Math.round) + ')');
      var u = conns[1].sp, got = [], orig = u.sendPosition, own = Object.prototype.hasOwnProperty.call(u, 'sendPosition');
      u.sendPosition = function (x, y) { got.push([x, y]); return true; };
      var prevMb = window.multiboxPlayerEnabled;
      try { setFocus(u.number); aim(); u._lmAimSend(); } finally { setFocus(prevMb || 0); if (own) u.sendPosition = orig; else delete u.sendPosition; }
      var uw = [P[0] + conns[1].off[0], P[1] + conns[1].off[1]], g = got[got.length - 1];
      if (!(g && g[0] === uw[0] && g[1] === uw[1])) bad.push('unit sent ' + g + ' for its raw ' + uw);
      if (bad.length) fail.push(label + ': ' + bad.join('; '));
    }
    /* the moving cell keeps its server direction: drawn the other way on a flipped axis */
    var mvRaw = function () { return [mv.x, mv.y]; };

    /* ---------- the orientations ---------- */
    /* every orientation reached from every other one; then again with jelly physics (its perimeter is flipped too) */
    var passes = [{ jelly: false, order: [0, 1, 2, 3, 0, 2, 1, 3, 0] }, { jelly: true, order: [0, 3, 1, 2, 0] }], seen = {}, glOk = !!dr.gl, glFrames = 0;
    info.renderers = glOk ? ['Canvas2D', 'WebGL'] : ['Canvas2D'];
    for (var pi = 0; pi < passes.length && fail.length <= 40; pi++) {
      var order = passes[pi].order, jl = passes[pi].jelly ? ' jelly' : '';
      D.jellyPhisycs = passes[pi].jelly;
      for (var oi = 0; oi < order.length; oi++) {
        var v = order[oi], pv = oi ? order[oi - 1] : 0;
        if (oi) {
          D.webgl2Acceleration = false;
          /* fresh packets of every connection first (the checks above took a while: nothing came meanwhile) */
          await sleep(150);
          var before = frame({}), mc = cellOf(0, mv.id), mx = mc ? [mc.x, mc.y] : null, r0 = mvRaw(), t0 = mv.turns.slice();
          app.settechvnr(v);
          if (lm.vnr !== v) { fail.push('settechvnr(' + v + ') left vnr ' + lm.vnr); break; }
          var first = frame({ pixels: true }), rel = flipOf(v).map(function (a, i) { return a !== flipOf(pv)[i]; });
          var lab = 'vnr ' + pv + ' -> ' + v + jl + ' first frame';
          /* the camera and every cell go with the map in the first frame (no jump, no second copy) */
          var bc = [rel[0] ? B[0] + B[2] - before.cam[0] : before.cam[0], rel[1] ? B[1] + B[3] - before.cam[1] : before.cam[1]];
          if (!(Math.abs(first.cam[0] - bc[0]) <= 2 && Math.abs(first.cam[1] - bc[1]) <= 2)) fail.push(lab + ': camera jumped from ' + before.cam.map(Math.round) + ' to ' + first.cam.map(Math.round));
          checkPixels(first, v, lab, 'Canvas2D');
          checkGhosts(first, v, lab);
          if (mx) {
            var m1c = cellOf(0, mv.id), m1 = m1c ? { x: m1c.x, y: m1c.y } : null, want1 = [rel[0] ? B[0] + B[2] - mx[0] : mx[0], rel[1] ? B[1] + B[3] - mx[1] : mx[1]];
            if (!m1 || Math.hypot(m1.x - want1[0], m1.y - want1[1]) > 20) fail.push(lab + ': the moving cell at ' + (m1 && [m1.x, m1.y].map(Math.round)) + ', flipped from ' + want1.map(Math.round));
            await sleep(200);
            frame({});
            var m2 = cellOf(0, mv.id), r1 = mvRaw(), dRaw = [r1[0] - r0[0], r1[1] - r0[1]], fl = flipOf(v);
            var dWant = [fl[0] ? -dRaw[0] : dRaw[0], fl[1] ? -dRaw[1] : dRaw[1]], dGot = m2 ? [m2.x - m1.x, m2.y - m1.y] : [0, 0];
            for (var ax = 0; ax < 2; ax++) {
              /* (an axis on which it turned meanwhile is not judged: the drawn cell lags the server) */
              if (mv.turns[ax] === t0[ax] && Math.abs(dWant[ax]) > 8 && !(Math.sign(dGot[ax]) === Math.sign(dWant[ax]) && Math.abs(dGot[ax]) > 2))
                fail.push(lab + ': the moving cell went ' + dGot.map(Math.round) + ' after the flip, its server move ' + dRaw.map(Math.round) + ' is drawn as ' + dWant.map(Math.round));
            }
            var tx = T(v, mv.x, mv.y), m2t = m2 ? [m2.targetX, m2.targetY] : null;
            if (!m2t || Math.hypot(m2t[0] - tx[0], m2t[1] - tx[1]) > Math.hypot(mv.vx, mv.vy) * 3 + 1) fail.push(lab + ': the moving cell\'s target ' + m2t + ', its flipped server place ' + tx);
          }
        }
        for (var ri = 0; ri < info.renderers.length; ri++) {
          var rk = info.renderers[ri];
          D.webgl2Acceleration = rk === 'WebGL';
          for (var w8 = 0; w8 < 3; w8++) { await sleep(60); frame({}); }
          var f = frame({ pixels: true }), label = rk + jl + ' vnr ' + v + (oi ? ' (from ' + pv + ')' : '');
          if (rk === 'WebGL') { if (f.gl) glFrames++; else { fail.push(label + ': the frame fell back to Canvas2D (' + f.why + ')'); continue; } }
          if (!palette[rk]) learn(f, rk);
          checkPixels(f, v, label, rk);
          checkCam(f, v, label, 2);
          checkGhosts(f, v, label);
          seen[v] = true;
        }
        D.webgl2Acceleration = false;
        var fb = frame({ boxes: true });
        if (!pi) { checkBoxes(fb, v, 'viewports vnr ' + v); checkCursor(v, 'cursor vnr ' + v); }
        if (fail.length > 40) break;
      }
    }
    info.orientations = Object.keys(seen).length;
    info.glFrames = glFrames;
    if (info.orientations !== 4) fail.push('only ' + info.orientations + ' orientations checked');

    /* ---------- paused: the hold point keeps its server place across a flip ---------- */
    app.settechvnr(0);
    frame({});
    lm.pause = true;
    lm.resetTargetPosition();
    var hold = function () { sends.length = 0; lm._lmLastCursorAt = 0; lm.sendPosition(); return lastPos(sends); };
    var h0 = hold();
    [1, 2, 3, 0].forEach(function (v) {
      app.settechvnr(v);
      var h = hold();
      if (!(h && h0 && Math.abs(h[0] - h0[0]) <= 1 && Math.abs(h[1] - h0[1]) <= 1)) fail.push('paused, Rotate Map to vnr ' + v + ': the main player is sent to ' + h + ', it held at ' + h0);
    });
    lm.pause = false;
    if (errs.length) fail.push('packet errors: ' + errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail.push('probe error: ' + (e && e.stack || e));
  } finally {
    /* ---------- tear down ---------- */
    if (timer) clearInterval(timer);
    try { app.settechvnr(0); } catch (e) { }
    lm.pause = prevLm.pause;
    created.forEach(function (s) { try { s.closeConnection(); } catch (e) { } var i = window.spects.indexOf(s); if (i >= 0) window.spects.splice(i, 1); });
    if (!window.spects.some(function (x) { return x && x.player; })) lm.multiBoxPlayerExists = false;
    window.fullSpectator = prevFull;
    window.multiboxPlayerEnabled = null;
    if (lm.socket && lm.socket.url === 'lm-bench://local') { lm.socket.readyState = 3; lm.socket = null; lm.ws = null; lm.connectionOpened = false; }
    try { lm.flushCellsData(); } catch (e) { }
    lm.play = false;
    ['serverType', 'integrity', 'connectionIntegrity', 'gameMode', 'showCustomSkins', 'showFood'].forEach(function (k) { lm[k] = prevLm[k]; });
    if (ownSetView) dr.setView = origSetView; else delete dr.setView;
    Object.keys(prev).forEach(function (k) { D[k] = prev[k]; });
    DS.foodColor = prevDS.foodColor;
    if (dr.preDrawPellet) try { dr.preDrawPellet(); } catch (e) { }
    if (tok && tok.value === '') tok.value = prevTok;
    if (window.temporaryRecordedProtocol == null) window.temporaryRecordedProtocol = prevRec;
    try { if (app.showMenu) app.showMenu(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
