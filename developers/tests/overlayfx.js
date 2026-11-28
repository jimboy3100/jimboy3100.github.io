/* Overlay marks above WebGL cells (teammate indicator, chat bubble, friend arrow,
 * special effects) in Node, with real code cut out of ogario/ogario.v4.js:
 *   - the frame block of renderFrame from the renderer label to the pings (overlay
 *     preparation, cell pass, post-cell effects, FB arrow) and its late overlay pass
 *     (pie / death cinematic);
 *   - window.drawRender (canUseWebGLScene and its helpers, drawTeammatesInd, drawMiscRings,
 *     drawPostCellOverlays, drawLegendWorldDeformedCanvasCell);
 *   - the cell methods draw (its WebGL branch), drawChat, drawSpecialSkin, the nick layout
 *     and label rules, and the text raster class.
 * Everything draws on a small software 2D canvas (affine transform without rotation,
 * globalAlpha, clearRect, drawImage, source-over, resize clears). Each frame is composed
 * like the page (main canvas, GL canvas, overlay canvas when shown) and compared pixel by
 * pixel with the same scene painted in Canvas2D order (body, FB badge, special effects,
 * multibox ring, teammate indicator, nick and mass, chat bubble, one cell after the other,
 * then the FB arrow). Bodies and labels are test models (discs, label boxes about 0.6 em
 * per character) painted the same way in both; the GL layer is that model painted per cell
 * (body, ring, labels) in cell order, which is what its depth order gives. A cell with an FB
 * badge or effect has its real nick / mass rasters and ring on the overlay (the GL ring and
 * text passes skip it), so its reference uses the same rasters. So a difference is always a
 * mark: lost, misplaced, wrong alpha, or above something it is under in Canvas2D.
 * It does not run a GPU: drawWebGLCellBatch and the text pass are not executed here.
 * Also the Canvas2D gradient bubbles (opponents, cursor) on a recording context, and which look
 * of Cursor tracking draws (line, bubble, none) for its two switches.
 * Cases: teammate only, chat only, FB badge (with its nick and mass, multibox ring, text and
 * skin alpha, Teams, no skin), FB arrow, special effects (custom skins off, an effect of a
 * cell outside the frame), the chat bubble of a cell outside the GL view, overlapping cells (later cell over a mark or the moved labels,
 * earlier cell under it, own labels), Canvas/WebGL transitions, frames with no marks (no
 * clear, overlay hidden), high DPI, resize between frames, WebGL context loss, the order of
 * the overlay calls, and the frame counters by Canvas2D reason.
 * node developers/tests/overlayfx.js [ogario.v4.js] */
'use strict';
const fs = require('fs');
const path = require('path');
const { rendererFactory } = require('./glbatch.js');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

/* ---------------- software canvas ---------------- */
let nextId = 1;
const strokes = { on: false };
const oplog = [];
function colorFor(id) {
    /* distinct, stable colours per source */
    const h = (id * 0.618033988749895) % 1;
    return [0.2 + 0.8 * h, 0.2 + 0.8 * ((h * 7.31) % 1), 0.2 + 0.8 * ((h * 3.17) % 1)];
}
class SoftCanvas {
    constructor(w, h, name) {
        this._id = nextId++;
        this.name = name || ('c' + this._id);
        this.color = colorFor(this._id);
        this.style = { display: '' };
        this._w = w | 0; this._h = h | 0;
        this._ctx = null;
        this._alloc();
    }
    _alloc() { this.px = new Float64Array(Math.max(0, this._w * this._h * 4)); if (this._ctx) this._ctx._reset(); }
    get width() { return this._w; }
    set width(v) { this._w = v | 0; this._alloc(); oplog.push(this.name + ':resize'); }
    get height() { return this._h; }
    set height(v) { this._h = v | 0; this._alloc(); oplog.push(this.name + ':resize'); }
    getContext() { return this._ctx || (this._ctx = new SoftCtx(this)); }
}
class SoftCtx {
    constructor(canvas) { this.canvas = canvas; this._reset(); }
    _reset() { this.m = [1, 0, 0, 1, 0, 0]; this._alpha = 1; this.stack = []; this.font = '10px sans-serif'; this.fillStyle = '#000'; this.strokeStyle = '#000'; this.lineWidth = 1; }
    get globalAlpha() { return this._alpha; }
    set globalAlpha(v) { if (typeof v === 'number' && v >= 0 && v <= 1) this._alpha = v; }
    save() { this.stack.push({ m: this.m.slice(), a: this._alpha }); }
    restore() { const s = this.stack.pop(); if (s) { this.m = s.m; this._alpha = s.a; } }
    setTransform(a, b, c, d, e, f) {
        if (a && typeof a === 'object') { this.m = [a.a, a.b, a.c, a.d, a.e, a.f]; } else this.m = [a, b, c, d, e, f];
        if (this.canvas.name === 'overlay') oplog.push('overlay:transform');
    }
    getTransform() { const m = this.m; return { a: m[0], b: m[1], c: m[2], d: m[3], e: m[4], f: m[5] }; }
    translate(x, y) { const m = this.m; m[4] += m[0] * x + m[2] * y; m[5] += m[1] * x + m[3] * y; }
    scale(x, y) { const m = this.m; m[0] *= x; m[1] *= x; m[2] *= y; m[3] *= y; }
    _rect(x, y, w, h) {
        const m = this.m;
        if (m[1] || m[2]) throw new Error('rotation not supported by the test canvas');
        const xa = m[0] * x + m[4], xb = m[0] * (x + w) + m[4], ya = m[3] * y + m[5], yb = m[3] * (y + h) + m[5];
        return [Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb)];
    }
    _paint(r, col, a, shape) {
        const c = this.canvas, W = c._w, H = c._h, px = c.px;
        const i0 = Math.max(0, Math.ceil(r[0] - 0.5)), i1 = Math.min(W - 1, Math.ceil(r[2] - 0.5) - 1);
        const j0 = Math.max(0, Math.ceil(r[1] - 0.5)), j1 = Math.min(H - 1, Math.ceil(r[3] - 0.5) - 1);
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
            if (shape && !shape(i + 0.5, j + 0.5)) continue;
            const o = (j * W + i) * 4, k = 1 - a;
            px[o] = col[0] * a + px[o] * k; px[o + 1] = col[1] * a + px[o + 1] * k; px[o + 2] = col[2] * a + px[o + 2] * k; px[o + 3] = a + px[o + 3] * k;
        }
    }
    clearRect(x, y, w, h) {
        const r = this._rect(x, y, w, h), c = this.canvas, W = c._w, H = c._h;
        for (let j = Math.max(0, Math.floor(r[1])); j < Math.min(H, Math.ceil(r[3])); j++) for (let i = Math.max(0, Math.floor(r[0])); i < Math.min(W, Math.ceil(r[2])); i++) c.px.fill(0, (j * W + i) * 4, (j * W + i) * 4 + 4);
        oplog.push(c.name + ':clear');
    }
    drawImage(img) {
        const a = arguments;
        let x, y, w, h;
        if (a.length >= 9) { x = a[5]; y = a[6]; w = a[7]; h = a[8]; } else if (a.length >= 5) { x = a[1]; y = a[2]; w = a[3]; h = a[4]; } else { x = a[1]; y = a[2]; w = img.width; h = img.height; }
        if (!img || !(img.width > 0) || !(img.height > 0)) return;
        oplog.push(this.canvas.name + ':draw:' + (img.name || img._id));
        this._paint(this._rect(x, y, w, h), img.color || colorFor(img._id || 0), this._alpha * (img.alpha == null ? 1 : img.alpha));
    }
    /* test-side bodies */
    disc(x, y, r, col) {
        const m = this.m, cx = m[0] * x + m[4], cy = m[3] * y + m[5], pr = Math.abs(m[0]) * r;
        this._paint([cx - pr, cy - pr, cx + pr, cy + pr], col, this._alpha, (px, py) => (px - cx) * (px - cx) + (py - cy) * (py - cy) <= pr * pr);
    }
    box(x, y, w, h, col) { this._paint(this._rect(x, y, w, h), col, this._alpha); }
    measureText(t) { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); return { width: (m ? +m[1] : 10) * 0.6 * String(t).length }; }
    /* a full circle stroked (the multibox ring), only in the cases that turn it on */
    arc(x, y, r) { this._arc = [x, y, r]; }
    beginPath() { this._arc = null; }
    stroke() {
        if (!strokes.on || !this._arc || typeof this.strokeStyle !== 'string') return;
        const m = this.m, cx = m[0] * this._arc[0] + m[4], cy = m[3] * this._arc[1] + m[5], k = Math.abs(m[0]);
        const r0 = k * (this._arc[2] - this.lineWidth / 2), r1 = k * (this._arc[2] + this.lineWidth / 2);
        let h = 0; for (const ch of this.strokeStyle) h = (h * 31 + ch.charCodeAt(0)) % 9973;
        oplog.push(this.canvas.name + ':stroke');
        this._paint([cx - r1, cy - r1, cx + r1, cy + r1], colorFor(h), this._alpha, (px, py) => { const d = (px - cx) * (px - cx) + (py - cy) * (py - cy); return d <= r1 * r1 && d >= r0 * r0; });
    }
    fillText() { } strokeText() { } closePath() { } moveTo() { } lineTo() { } fill() { } clip() { } setLineDash() { } fillRect() { } strokeRect() { } rect() { }
}
function composite(layers, W, H) {
    const out = new Float64Array(W * H * 4);
    for (const c of layers) {
        if (!c) continue;
        /* a layer of another size than the frame is shown stretched: counted as all wrong */
        if (c._w !== W || c._h !== H) { out.mismatch = c.name + ' ' + c._w + 'x' + c._h; continue; }
        const px = c.px;
        for (let o = 0; o < out.length; o += 4) {
            const a = px[o + 3], k = 1 - a;
            out[o] = px[o] + out[o] * k; out[o + 1] = px[o + 1] + out[o + 1] * k; out[o + 2] = px[o + 2] + out[o + 2] * k; out[o + 3] = a + out[o + 3] * k;
        }
    }
    return out;
}
function diff(a, b) {
    if (a.mismatch) return { n: a.length / 4, max: 1, mismatch: a.mismatch };
    let n = 0, max = 0;
    for (let o = 0; o < a.length; o += 4) {
        let p = 0;
        for (let k = 0; k < 4; k++) { const d = Math.abs(a[o + k] - b[o + k]); if (d > p) p = d; }
        if (p > 1e-6) n++;
        if (p > max) max = p;
    }
    return { n: n, max: max };
}
/* pixels whose colour is the colour of this source painted at alpha a over anything */
function marked(px, col) {
    let n = 0;
    for (let o = 0; o < px.length; o += 4) if (px[o + 3] > 0 && Math.abs(px[o] / px[o + 3] - col[0]) < 1e-6 && Math.abs(px[o + 1] / px[o + 3] - col[1]) < 1e-6 && Math.abs(px[o + 2] / px[o + 3] - col[2]) < 1e-6) n++;
    return n;
}

/* ---------------- code from ogario.v4.js ---------------- */
function block(s, i) {
    let d = 0;
    const j = s.indexOf('{', i);
    for (let k = j; k < s.length; k++) {
        if (s[k] === '{') d++;
        else if (s[k] === '}' && !--d) return s.slice(i, k + 1);
    }
    throw new Error('unbalanced block at ' + i);
}
const cellStart = src.indexOf('function ogarbasicassembly(');
const cellEnd = src.indexOf('}).call(ogarbasicassembly.prototype)');
function cellMethod(name) {
    const re = new RegExp('\\n\\s*this\\.' + name + ' = function', 'g');
    re.lastIndex = cellStart;
    /* the last one: an old copy of setMass sits in a comment above the real one */
    let m = null;
    for (let x; (x = re.exec(src)) && x.index < cellEnd;) m = x;
    if (!m) return null;
    const at = src.indexOf('function', m.index);
    return block(src, at);
}
const CELL_METHODS = ['draw', 'drawChat', 'lmChatLine', 'lmChatBubble', 'drawMass', 'drawSpecialSkin', 'drawImageSpecialSkin', 'layoutNick', 'drawNick',
    'setNick', 'setMass', 'setDrawing', 'setDrawingScale', 'setScale', 'setFontSize', 'setStrokeSize'];
const haveMethods = CELL_METHODS.filter((n) => cellMethod(n));
const frameA = src.indexOf('/* whether this frame was drawn by WebGL (the pie overlay below, the benches) */');
const frameEndM = src.indexOf('this.drawLmPings(_lmFxCtx);', frameA);
const frameSrc = src.slice(frameA, src.indexOf('\n', frameEndM));
const lateA = src.indexOf('if (this.overlayCanvas) {\n                var oCtx = this.overlayCanvas.getContext(\'2d\');');
const lateSrc = block(src, lateA);
const textClassSrc = block(src, src.indexOf('function irenderfromagario()'));
const autoHideSrc = block(src, src.indexOf('setAutoHideCellInfo(t) {'));
/* the multibox ring rule and the skin gate cell.draw uses (absent in older versions) */
const ringSrc = ['lmMultiboxRingPlayer', 'lmMultiboxRing', 'lmSkinsShown', 'lmColorInt'].map((n) => {
    const i = src.indexOf('\nfunction ' + n + '(');
    return i < 0 ? '' : block(src, i + 1);
}).join('\n') + '\n' + ['LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_MIN_SCREEN_PX', 'LM_MB_RING_SIZE', '_lmMbRingOut', '_lmColorIntCache'].map((n) => {
    const m = new RegExp('\\nvar ' + n + ' = [^\\n]*').exec(src);
    return m ? m[0].slice(1) : '';
}).join('\n');

/* ---------------- environment ---------------- */
const F = rendererFactory(src);
const D = new Function('return ' + F.defaults)();
const ds = D.defaultSettings, ms = D.defaultmapsettings;
function img(name, w, h) { return { _id: nextId++, name: name, width: w, height: h, naturalWidth: w, naturalHeight: h, complete: true, color: colorFor(nextId * 13) }; }
const LM = { cells: [], playerCells: [], playerCellsMulti: [], play: false, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false, indexedCells: {}, selected: null, time: 100000, arrowFB: null, cursorX: 0, cursorY: 0 };
const ogario = { viewScale: 1 };
const window = { teammatenicks: [], _lmTeammateNickSet: new Set(), LM_DPR: 1, legendmod5: {}, innerWidth: 240, innerHeight: 160, legendmod: LM };
/* an Array, as SpecialEffectPlayers in ogario.v4.js */
const SEP = [];
const document = { createElement: () => new SoftCanvas(0, 0, 'txt') };
const application = {
    customSkinsMap: {}, customSkinsCache: {},
    getCustomSkin(nick) { return this.skins && this.skins[nick] || null; },
    /* Cell.draw: getCustomSkin in two steps (the key also names a video skin) */
    customSkinKey(nick) { return this.skins && this.skins[nick] ? nick : null; },
    getCachedSkin(cache, key) { return this.skins && this.skins[key] || null; },
    setAutoHideCellInfo: new Function('ogario', 'return function ' + autoHideSrc.replace(/^setAutoHideCellInfo/, ''))(ogario)
};
const env = { window: window, LM: LM, application: application, defaultSettings: ds, defaultmapsettings: ms, ogarcopythelb: {}, ogario: ogario };
globalThis.SpecialEffectPlayers = SEP;
globalThis._EAT_PULSE_MAGNITUDE = 0.08;
globalThis._EAT_PULSE_DURATION = 150;
globalThis._elDeathVisual = null;
globalThis.dyinglight1load = 'no';
globalThis._lmElTeamsActive = () => false;
const R = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/\}$/, ''))(env);
const TextClass = new Function('document', 'window', textClassSrc + '\nreturn irenderfromagario;')(document, window);
const proto = new Function('env', 'var window = env.window, LM = env.LM, legendmod = env.LM, application = env.application, defaultSettings = env.defaultSettings,' +
    ' defaultmapsettings = env.defaultmapsettings, drawRender = env.drawRender, ogario = env.ogario, SpecialEffectPlayers = env.SEP,' +
    ' irenderfromagario = env.TextClass, _EAT_PULSE_DURATION = 150, _EAT_PULSE_MAGNITUDE = 0.08;' +
    ' function loadIconSpecialSkins() { } function checkVideos() { } function lmMultiboxControlledPlayer() { return 1; }\n' +
    ringSrc + '\n' +
    'return {' + haveMethods.map((n) => n + ': ' + cellMethod(n)).join(',\n') + '};')(Object.assign({ drawRender: R, SEP: SEP, TextClass: TextClass }, env));
window.iconSpecialSkinEffectsHat3 = img('hat', 64, 64);

/* renderer state */
/* the real selected-cell ring (the frame block calls it; stubbed by default) */
const realDrawRings = R.drawRings;
function stubRings() { }
const main = new SoftCanvas(0, 0, 'main'), glc = new SoftCanvas(0, 0, 'gl'), overlay = new SoftCanvas(0, 0, 'overlay');
Object.assign(R, {
    canvas: main, ctx: main.getContext(), overlayCanvas: overlay, overlayCtx: overlay.getContext(), glCanvas: glc,
    gl: {}, glTextProgram: {}, glCellProgram: {}, glJellyProgram: {}, glJellyStrokeProgram: {}, glJellyVAO: {}, glJellyVBO: {}, glJellyStrokeVAO: {}, glJellyStrokeVBO: {}, glMbRingProgram: {},
    indicator: img('teamInd', 90, 50), heartIndicator: img('heartInd', 50, 50), smileIndicator: img('smileInd', 150, 150),
    isLegendWorldMapDeformationVisible: () => false, drawRings: stubRings, drawRMB() { }, drawViewPorts() { },
    drawFBTracking(ctx, players, x, y) { ctx.drawImage(fbArrow, x - 10, y - 10, 20, 20); }
});
const fbArrow = img('fbArrow', 20, 20);
/* a quad of the GL text pass: the image painted on the GL layer at that place and alpha (the
 * texture cache and the GPU draw are not run here) */
R._lmGlMarkQuad = function (src, x, y, w, h, z, a) {
    const g = glc.getContext(), p = g.globalAlpha;
    g.globalAlpha = a;
    if (w === undefined) g.drawImage(src, x, y); else g.drawImage(src, x, y, w, h);
    g.globalAlpha = p;
};
const realDeformed = R.drawLegendWorldDeformedCanvasCell;
/* Canvas2D cells: the test model painter; WebGL cells: the real cell.draw (its WebGL branch) */
R.drawLegendWorldDeformedCanvasCell = function (cell, ctx) { return cell._webglRendered ? realDeformed.call(this, cell, ctx) : paintCellCanvas(cell, ctx); };

function setSettings(over) {
    const base = new Function('return ' + F.defaults)();
    for (const k of Object.keys(ms)) delete ms[k];
    Object.assign(ms, base.defaultmapsettings, {
        jellyPhisycs: true, webgl2Acceleration: true, cellContours: false, transparentCells: false, transparentSkins: false, myTransparentSkin: false,
        spawnSpecialEffects: false, multiBoxShadow: false, customSkins: true, noNames: false, showMass: true, showChat: true, teammatesInd: true,
        cursorTracking: false, bubbleCursorTracker: false, autoHideNames: false, autoHideMass: false, hideMyName: false, hideMyMass: false,
        hideEnemiesMass: false, hideTeammatesNames: false, oppColors: false, oppRings: false, debug: false, namesStroke: false, massStroke: false
    }, over && over.map);
    Object.assign(ds, base.defaultSettings, { indicators: 'normal', textAlpha: 1, namesScale: 1, massScale: 3, skinsAlpha: 0.7 }, over && over.set);
}

let cellIds = 1;
function makeCell(o) {
    const c = Object.create(proto);
    Object.assign(c, {
        id: cellIds++, x: 0, y: 0, size: 50, targetNick: '', nick: '', color: '#888', skin: '', isPlayerCell: false, isPlayerCellMulti: false,
        isVirus: false, isFood: false, isEjected: false, invisible: false, removed: false, alpha: 0, redrawed: 0, _eatPulseTime: 0, margin: 0,
        chatCanvas: null, nickCanvas: null, massCanvas: null, mass: 0, scale: 1, redrawNick: true, redrawMass: true, redrawChat: true,
        pi2: 2 * Math.PI, virMassSize: 0, nickScale: 1, massScale: 3, strokeScale: 1, body: colorFor(nextId++ * 7), labelCol: colorFor(nextId++ * 11)
    }, o);
    return c;
}

/* ---- the Canvas2D order of cell.draw, with model bodies and labels ---- */
function labelFlags(c) {
    if (ms.noNames && !ms.showMass || c._lmDrawNoText) return { on: false };
    let rec = false;
    if (!c.isPlayerCell && (rec = application.setAutoHideCellInfo(c.size)) && ms.autoHideNames && ms.autoHideMass) return { on: false };
    const node = ms.customSkins && LM.showCustomSkins && !c.isEjected ? application.getCustomSkin(c.targetNick) : null;
    return {
        on: true,
        nick: !(ms.noNames || rec && ms.autoHideNames || c.isPlayerCell && ms.hideMyName || node && ms.hideTeammatesNames),
        mass: !(!ms.showMass || rec && ms.autoHideMass || c.isPlayerCell && ms.hideMyMass || ms.hideEnemiesMass && !c.isPlayerCell && !c.isVirus)
    };
}
function paintLabels(ctx, c, fl) {
    const f = Math.max(c.size * 0.3, 26) * (ds.namesScale || 1);
    if (fl.nick && c.targetNick && !c.isVirus) { const w = 0.6 * f * c.targetNick.length; ctx.box(c.x - w / 2, c.y - 0.7 * f, w, 1.4 * f, c.labelCol); }
    if (fl.mass && c.size > 40) {
        const mf = f * 0.85 * (ds.massScale || 3) / 3, t = String(~~(c.size * c.size / 100)), w = 0.6 * mf * t.length;
        ctx.box(c.x - w / 2, c.y + 0.7 * f, w, 1.4 * mf, c.labelCol);
    }
}
function paintSkin(ctx, c) {
    const node = ms.customSkins && LM.showCustomSkins && !c.isEjected ? application.getCustomSkin(c.targetNick) : null;
    if (node) ctx.disc(c.x, c.y, c.size, node.color);
    return node;
}
const nullCtx = { drawImage() { } };
const lmRing = new Function('window', 'defaultmapsettings', 'function lmMultiboxControlledPlayer() { return 1; }\n' + ringSrc +
    '\nreturn typeof lmMultiboxRing === "function" ? lmMultiboxRing : function () { return null; };')(window, ms);
/* realText: the cell's real nick / mass rasters (drawNick, drawMass), as the overlay has them
 * for a WebGL cell with an FB badge or effect; otherwise the label model of the GL layer */
function paintCellCanvas(c, ctx, realText) {
    if ((LM.hideSmallBots && c.size <= 36) || c.invisible) return;
    ctx.save();
    const y = c.size;
    ctx.disc(c.x, c.y, y, c.body);
    const pre = ctx.globalAlpha;
    if (ms.transparentSkins && !(c.isPlayerCell && !ms.myTransparentSkin) || c.isPlayerCell && ms.myTransparentSkin && ds.skinsAlpha < 0.99) ctx.globalAlpha *= ds.skinsAlpha;
    const node = paintSkin(ctx, c);
    ctx.globalAlpha = pre;
    if (typeof SEP[c.targetNick] === 'string' && SEP[c.targetNick] && ms.customSkins && LM.showCustomSkins) c.drawSpecialSkin(ctx, y);
    const ring = lmRing(c, y, R.scale);
    if (ring) R.strokeMultiboxRing(ctx, c.x, c.y, y, ring);
    if (ms.teammatesInd && !c.isPlayerCell && y <= 800 && window.teammatenicks && c.targetNick != '' && window._lmTeammateNickSet.has(c.targetNick)) R.drawTeammatesInd(ctx, c.x, c.y, y);
    const fl = labelFlags(c);
    if (fl.on) {
        c.setDrawing(); c.setDrawingScale();
        if (ds.textAlpha != 1) ctx.globalAlpha *= ds.textAlpha;
        if (fl.nick && c.setNick(c.targetNick)) c.drawNick(realText ? ctx : nullCtx);
        if (realText) {
            if (fl.mass && c.setMass(c.size)) c.drawMass(ctx);
        } else paintLabels(ctx, c, fl);
    }
    /* the chat bubble last, on its own setting (not tied to the labels) */
    const ce = c.lmChatLine();
    if (ce) c.lmChatBubble(ctx, ce, fl.on, !!(fl.on && fl.nick && c.targetNick && !c.isVirus));
    ctx.restore();
}
function worldTransform(ctx, s) {
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    ctx.translate(s.W / 2, s.H / 2);
    ctx.scale(s.zoom, s.zoom);
    ctx.translate(-s.camX, -s.camY);
}
function drawable(c) { return c && !c.invisible && !c.removed && !c.isFood && !(LM.hideSmallBots && c.size <= 36); }

/* ---- one frame through the real frame block and late pass ---- */
const runFrameBlock = new Function('LM', 'defaultmapsettings', 'defaultSettings', 'drawRender', 'window', 'unifiedWebGLWorldOK', '_elEntranceRunning',
    '_elDeathVisual', '_deathParticles', '_getParticleBlob', frameSrc);
/* renderFrame: the Canvas2D reason before canUseWebGLScene and the frame count after the
 * WebGL world pass (absent in older versions) */
function frameLines(from, to) {
    const i = src.indexOf(from);
    if (i < 0) return null;
    const j = src.indexOf(to, i);
    return j < 0 ? null : src.slice(i, j);
}
const whySrc = frameLines('/* the reason when canUseWebGLScene is not reached', 'var unifiedWebGLAllowed =');
const countSrc = frameLines('/* frames by renderer and Canvas2D reason', '/* whether this frame was drawn by WebGL');
const runWhy = whySrc ? new Function('defaultmapsettings', whySrc) : null;
const runCount = countSrc ? new Function('unifiedWebGLWorldOK', 'unifiedWebGLAllowed', countSrc) : null;
const runLatePass = new Function('LM', 'window', '_lmPieOnOverlay', '_elDeathVisual', '_getParticleBlob', '_drawExpandingLandDeathSnapshotCell', '_lmPieX', lateSrc);
function frame(s) {
    oplog.length = 0;
    const pw = Math.round(s.W * s.dpr), ph = Math.round(s.H * s.dpr);
    window.LM_DPR = s.dpr; ogario.viewScale = s.zoom;
    Object.assign(R, { canvasWidth: s.W, canvasHeight: s.H, dpr: s.dpr, scale: s.zoom, camX: s.camX, camY: s.camY });
    if (main.width !== pw || main.height !== ph) { main.width = pw; main.height = ph; glc.width = pw; glc.height = ph; }
    /* resizeCanvas sizes the overlay at start; later size changes are left to the frame code */
    if (!overlay.width) { overlay.width = pw; overlay.height = ph; }
    oplog.length = 0;
    const mctx = main.getContext(), gctx = glc.getContext();
    mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.clearRect(0, 0, pw, ph);
    gctx.setTransform(1, 0, 0, 1, 0, 0); gctx.clearRect(0, 0, pw, ph);
    oplog.length = 0;
    mctx.save(); worldTransform(mctx, s);
    for (const c of LM.cells) c._webglRendered = false;
    if (runWhy) runWhy.call(R, ms);
    /* batchFail: allowed, but drawWebGLCellBatch failed (Canvas2D frame) */
    const allowed = s.glOk !== false && !!R.gl && R.canUseWebGLScene(LM.cells);
    const gl = allowed && !s.batchFail;
    if (gl) {
        /* the GL layer: bodies and labels in cell order */
        gctx.save(); worldTransform(gctx, s);
        /* the GL batch leaves out bodies outside the view and 200 around it, as
         * drawWebGLCellBatch (cell.draw then draws them in its Canvas2D branch) */
        const cull = s.cull != null ? s.cull : 200;
        const vx = s.W / 2 / s.zoom + cull, vy = s.H / 2 / s.zoom + cull;
        for (const c of LM.cells) {
            if (!drawable(c)) continue;
            if (c.x + c.size < s.camX - vx || c.x - c.size > s.camX + vx || c.y + c.size < s.camY - vy || c.y - c.size > s.camY + vy) continue;
            c._webglRendered = true;
            gctx.disc(c.x, c.y, c.size, c.body);
            const pre = gctx.globalAlpha;
            if (ms.transparentSkins && !(c.isPlayerCell && !ms.myTransparentSkin) || c.isPlayerCell && ms.myTransparentSkin && ds.skinsAlpha < 0.99) gctx.globalAlpha *= ds.skinsAlpha;
            paintSkin(gctx, c);
            gctx.globalAlpha = pre;
            /* the GL ring and text passes leave out the cells whose ring and labels cell.draw
             * puts on the overlay (above their FB badge / effect) */
            const fg = R._lmLabelsOnFg && R._lmLabelsOnFg(c);
            const ring = fg ? null : lmRing(c, c.size, R.scale);
            if (ring) R.strokeMultiboxRing(gctx, c.x, c.y, c.size, ring);
            /* the teammate indicator and chat bubble of the GL text pass: the real _lmGlMarks
             * (and the Canvas2D code it runs), its quads painted here (_lmGlMarkQuad), before
             * and after the cell's labels */
            const mk = !fg && R._lmGlMarks && c._lmMkOk === R._glSkinFrame;
            if (mk) R._lmGlMarks(c, 1);
            gctx.globalAlpha = pre * (ds.textAlpha != null ? ds.textAlpha : 1);
            const fl = labelFlags(c);
            if (fl.on && !fg) paintLabels(gctx, c, fl);
            gctx.globalAlpha = pre;
            if (mk) R._lmGlMarks(c, 2);
        }
        gctx.restore();
    }
    if (runCount) runCount.call(R, gl, allowed);
    runFrameBlock.call(R, LM, ms, ds, R, window, gl, false, null, [], null);
    mctx.restore();
    runLatePass.call(R, LM, window, false, null, null, null, null);
    const shown = overlay.style.display === 'block';
    const out = composite([main, gl ? glc : null, shown ? overlay : null], pw, ph);
    /* reference: the same scene in Canvas2D order */
    const ref = new SoftCanvas(pw, ph, 'ref'), rctx = ref.getContext();
    worldTransform(rctx, s);
    for (const c of LM.cells) if (drawable(c)) paintCellCanvas(c, rctx, gl && R._lmLabelsOnFg && R._lmLabelsOnFg(c));
    /* drawRings: after the whole cell pass, over every cell */
    if (R.drawRings !== stubRings) R.drawRings(rctx);
    if ((LM.play || LM.playerCellsMulti.length) && LM.arrowFB && LM.arrowFB[0] && LM.arrowFB[0].visible) R.drawFBTracking(rctx, LM.playerCells, LM.arrowFB[0].x, LM.arrowFB[0].y);
    const ops = oplog.slice();
    return { gl: gl, shown: shown, out: out, ref: composite([ref], pw, ph), d: diff(out, composite([ref], pw, ph)), ops: ops };
}
function scene(cells) { LM.cells = cells.slice().sort((a, b) => a.size - b.size || a.id - b.id); }
function team(nicks) { window.teammatenicks = nicks.slice(); window._lmTeammateNickSet = new Set(nicks); }
function chat(nick, ago) { R._chatLookup = new Map([[nick, { message: 'hello there', time: LM.time - (ago == null ? 3000 : ago) }]]); }
function reset() { setSettings(); team([]); R._chatLookup = new Map(); for (const k of Object.keys(SEP)) delete SEP[k]; application.customSkinsMap = {}; application.customSkinsCache = {}; application.skins = {}; LM.play = false; LM.arrowFB = null; R._webglDisabledUntil = 0; }
const S1 = { W: 240, H: 160, dpr: 1, zoom: 1, camX: 0, camY: 0 };
/* overlay calls of a frame: cleared before its first mark, never after it */
function orderOk(ops) {
    const first = ops.findIndex((o) => /^overlay:draw:/.test(o));
    if (first < 0) return false;
    const lastClear = ops.reduce((k, o, i) => (o === 'overlay:clear' || o === 'overlay:resize') ? i : k, -1);
    return lastClear < first;
}
const marks = (r, im) => marked(r.out, im.color);

console.log('methods from ogario.v4.js: ' + haveMethods.join(', '));

/* ---- teammate indicator only ---- */
reset(); team(['mate']);
scene([makeCell({ x: -20, y: 30, size: 40, targetNick: 'mate' }), makeCell({ x: 90, y: -50, size: 25, targetNick: 'zz' })]);
let r = frame(S1);
check('teammate only: WebGL frame', r.gl);
check('teammate only: the indicator survives the frame', marks(r, R.indicator) > 0, 'ind px ' + marks(r, R.indicator) + ' order ' + r.ops.filter((o) => /^overlay/.test(o)).join(' > '));
check('teammate only: drawn by the GL text pass at the cell\'s depth, no overlay', !r.shown && r.ops.includes('gl:draw:teamInd') && !r.ops.includes('overlay:draw:teamInd'), r.ops.filter((o) => /teamInd|^overlay/.test(o)).join(' > '));
check('teammate only: pixels equal the Canvas2D order', r.d.n === 0, r.d.n + ' px, max ' + r.d.max.toFixed(3));
r = frame(S1);
check('teammate only, next frame: still equal (no stale marks, no double draw)', r.gl && r.d.n === 0, r.d.n + ' px');

/* ---- chat bubble only ---- */
reset(); chat('talk');
const talker = makeCell({ x: 10, y: -10, size: 60, targetNick: 'talk' });
scene([talker, makeCell({ x: -90, y: 40, size: 30, targetNick: 'b' })]);
r = frame(S1);
check('chat only, first frame of a line: WebGL (the GL text pass lays the bubble out itself), equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
r = frame(S1);
const chatCol = talker.chatCanvas && talker.chatCanvas.txtCanvas ? talker.chatCanvas.txtCanvas.color : [9, 9, 9];
check('chat only, next frame: WebGL, the bubble survives on the GL layer', r.gl && marked(r.out, chatCol) > 0 && !r.shown, 'gl ' + r.gl + ' chat px ' + marked(r.out, chatCol) + ' shown ' + r.shown);
check('chat only: pixels equal the Canvas2D order', r.d.n === 0, r.d.n + ' px, max ' + r.d.max.toFixed(3));
setSettings({ set: { textAlpha: 0.6 } });
r = frame(S1);
check('chat with textAlpha 0.6: same alpha as Canvas2D', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
setSettings({ map: { showMass: false } });
r = frame(S1);
check('chat with mass labels off: the bubble stays (its own setting), WebGL, equal', r.gl && marked(r.out, chatCol) > 0 && r.d.n === 0, 'gl ' + r.gl + ' chat px ' + marked(r.out, chatCol) + ' ' + r.d.n + ' px');
setSettings({ map: { showMass: false, noNames: true } });
r = frame(S1);
check('chat with names and mass off: the bubble stays, WebGL, equal', r.gl && marked(r.out, chatCol) > 0 && r.d.n === 0, 'gl ' + r.gl + ' chat px ' + marked(r.out, chatCol) + ' ' + r.d.n + ' px');
setSettings({ map: { showChat: false } });
r = frame(S1);
check('showChat off: no bubble in either renderer, WebGL, equal', r.gl && marked(r.out, chatCol) === 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');

/* ---- marks on the overlay ---- */
const why = () => R.GLW_IDS ? R.GLW_IDS[R._lmGlWhy] : '-';
const fgOps = (r) => r.ops.filter((o) => /^overlay:(draw|stroke)/.test(o)).map((o) => o.replace(/^overlay:(draw:)?/, ''));
/* the ring is fixed: only on the player you control (player 1 here), its colour, 6% of the radius; old ring settings do nothing */
reset(); window.legendmod = LM; LM.multiBoxPlayerExists = true;
(function () {
    const keep = Object.assign({}, ms);
    Object.assign(ms, { mbRingsP1: false, mbRingsP2: true, mbRingSizeP1: 50, mbRingColorP1: '#000000' });
    const own = lmRing({ isPlayerCell: true }, 100, 1), unit = lmRing({ spectator: 1, isPlayerCellMulti: true }, 100, 1);
    LM.multiBoxPlayerExists = false;
    const solo = lmRing({ isPlayerCell: true }, 100, 1);
    LM.multiBoxPlayerExists = true;
    Object.keys(ms).forEach((k) => { if (!(k in keep)) delete ms[k]; });
    Object.assign(ms, keep);
    check('multibox ring: on the player you control only, its fixed colour and width; none without multibox',
        own && own.player === 1 && own.color === '#FF2FD6' && Math.abs(own.width - 6) < 1e-9 && unit === null && solo === null, JSON.stringify([own, unit, solo]));
})();
LM.multiBoxPlayerExists = false;

/* ---- FB arrow ---- */

reset(); setSettings();
LM.play = true; LM.arrowFB = [{ x: 60, y: -30, visible: true }];
scene([makeCell({ x: 0, y: 0, size: 50, targetNick: 'me' })]);
r = frame(S1);
check('FB arrow: WebGL frame, arrow on the overlay survives the late pass, equal', r.gl && r.shown && marks(r, fbArrow) > 0 && r.d.n === 0, 'gl ' + r.gl + ' arrow px ' + marks(r, fbArrow) + ' ' + r.d.n + ' px');
LM.play = false; LM.arrowFB = null;

/* ---- special effects only ---- */
reset(); SEP.hatter = 'Hat';
const hatter = makeCell({ x: 0, y: 10, size: 50, targetNick: 'hatter' });
scene([hatter]);
r = frame(S1);
const hat = window.iconSpecialSkinEffectsHat3;
check('special effect: WebGL frame, hat visible, equal (under the cell\'s nick as in Canvas2D)', r.gl && marks(r, hat) > 0 && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') hat px ' + marks(r, hat) + ' ' + r.d.n + ' px');
check('  hat, then the nick and mass on the overlay', fgOps(r).join(' ') === 'hat txt txt', fgOps(r).join(' '));
setSettings({ map: { customSkins: false } });
r = frame(S1);
check('special effect with custom skins off: Canvas2D draws none, WebGL none either, equal', r.gl && marks(r, hat) === 0 && r.d.n === 0, 'gl ' + r.gl + ' hat px ' + marks(r, hat) + ' ' + r.d.n + ' px');
setSettings();
scene([hatter, makeCell({ x: 30, y: -60, size: 55, targetNick: 'cover' })]);
r = frame(S1);
check('later bigger cell over the hat: Canvas2D, reason "coveredEffect", equal', !r.gl && why() === 'coveredEffect' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
scene([makeCell({ x: 20, y: -45, size: 25, targetNick: 'under' }), hatter]);
r = frame(S1);
check('earlier smaller cell under the hat: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
/* an effect drawn by a cell outside the frame: Splash reaches 1.6 radii to the right */
window.iconSpecialSkinEffectsSplash = img('splash', 64, 64);
SEP.splasher = 'Splash';
const splasher = makeCell({ x: -880, y: 0, size: 500, targetNick: 'splasher' });
scene([makeCell({ x: 80, y: 50, size: 20, targetNick: 'dot' }), splasher]);
r = frame(S1);
check('effect of a cell outside the frame reaching in: WebGL, equal', r.gl && marks(r, window.iconSpecialSkinEffectsSplash) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
/* a big cell below the screen (beyond the GL view, the batch leaves its body out): its hat reaches in over
 * an earlier small cell and lies above it, as in Canvas2D */
{
    SEP.lowhat = 'Hat';
    const lowHat = makeCell({ x: 0, y: 790, size: 500, targetNick: 'lowhat' }), small = makeCell({ x: 0, y: 60, size: 25, targetNick: 's' });
    scene([small, lowHat]);
    const g = frame(S1);
    check('hat of a cell below the screen over an earlier cell: WebGL, hat above that cell, equal', g.gl && marks(g, hat) > 0 && g.d.n === 0,
        'gl ' + g.gl + ' ' + why() + ' hat px ' + marks(g, hat) + ' ' + g.d.n + ' px');
    delete SEP.lowhat;
}
/* (a teammate on screen: the overlay is in use this frame; no labels on the big cell, whose
 * label box would reach the teammate's indicator) */
team(['dot']); setSettings({ map: { showMass: false } });
scene([makeCell({ x: 80, y: 50, size: 20, targetNick: 'dot' }), splasher, makeCell({ x: -600, y: 0, size: 520, targetNick: '' })]);
r = frame(S1);
check('  a later cell over that effect: Canvas2D, reason "coveredEffect", equal', !r.gl && why() === 'coveredEffect' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
delete SEP.splasher; team([]); setSettings();
/* effect + teammate indicator + chat on one cell, at high DPI */
team(['hatter']); chat('hatter'); hatter._lmChatAt = undefined; hatter.size = 60;
const S5 = { W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: -40 };
scene([hatter]);
frame(S5);
r = frame(S5);
check('effect + teammate indicator + chat bubble on one cell, DPR 2: WebGL, equal', r.gl && marks(r, hat) > 0 && marks(r, R.indicator) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
check('  order: hat > indicator > nick > mass > bubble', fgOps(r).join(' ') === 'hat teamInd txt txt txt', fgOps(r).join(' '));
hatter.size = 50;
/* multibox ring: over the effect, under the labels (as in Canvas2D) */
team([]); chat(null); setSettings(); strokes.on = true; window.legendmod = LM; LM.multiBoxPlayerExists = true;
hatter.isPlayerCell = true;
scene([hatter]);
r = frame(S1);
check('special effect on an own cell with a multibox ring: WebGL, hat > ring > labels on the overlay, equal', r.gl && fgOps(r).join(' ') === 'hat stroke txt txt' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + fgOps(r).join(' ') + ' ' + r.d.n + ' px');
hatter.isPlayerCell = false; hatter._webglRendered = false; strokes.on = false; LM.multiBoxPlayerExists = false;

/* nicks that name an Array member ("at", "map"...) or an effect that is not a string: no
 * effect, no draw error, the labels stay where they are (they were moved to the overlay and
 * then lost when drawSpecialSkin threw on a method of the list) */
reset();
{
    let errs = 0, ok = true, info = '';
    const ce = console.error;
    console.error = function () { errs++; };
    SEP.num = 5;
    for (const nick of ['at', 'map', 'num']) {
        const c = makeCell({ x: 0, y: 10, size: 60, targetNick: nick });
        scene([c]);
        const g = frame(S1);
        if (!(g.gl && !R._lmLabelsOnFg(c) && g.d.n === 0)) { ok = false; info += ' [' + nick + ': gl ' + g.gl + ' ' + why() + ' onFg ' + R._lmLabelsOnFg(c) + ' ' + g.d.n + ' px]'; }
    }
    console.error = ce;
    delete SEP.num;
    check('nicks "at" / "map", an effect that is not a string: WebGL, no effect, labels kept on the GL layer, equal', ok, info);
    check('  no cell draw errors', errs === 0, errs + ' errors');
}

/* The teammate indicator and chat bubble of a cell whose body the GL batch leaves out: the
 * cell is drawn in the Canvas2D branch, on the main canvas under the GL layer, so a mark of it
 * reaching the screen was under the GL cells drawn before it; it goes on the overlay with the
 * cell, as in Canvas2D. A chat bubble keeps its size on screen, so zoomed out it reaches far. */
{
    reset();
    const S4 = Object.assign({}, S1, { zoom: 0.25 });
    R._chatLookup = new Map([['far', { message: 'a chat line long enough to reach well across the edge of the screen, and then some more words', time: LM.time - 3000 }]]);
    const far = makeCell({ x: 480 + 200 + 80, y: 0, size: 45, targetNick: 'far' }), under = makeCell({ x: 450, y: -66, size: 30, targetNick: '' });
    scene([under, far]);
    let g = frame(S4);
    g = frame(S4);
    const col = far.chatCanvas && far.chatCanvas.txtCanvas ? far.chatCanvas.txtCanvas.color : [9, 9, 9];
    check('chat bubble of a cell beyond the GL view reaching in over an earlier cell: WebGL, bubble above that cell, equal', g.gl && R._lmLabelsOnFg(far) &&
        marked(g.out, col) > 0 && g.d.n === 0, 'gl ' + g.gl + ' ' + why() + ' far w ' + far._lmChatW + ' h ' + far._lmChatH + ' dy ' + far._lmChatDy + ' chat px ' + marked(g.out, col) + ' ' + g.d.n + ' px');
    /* a later cell over that bubble: Canvas2D */
    const big = makeCell({ x: 470, y: -66, size: 50, targetNick: '' });
    scene([under, far, big]);
    g = frame(S4);
    check('  a later cell over it: Canvas2D (coveredChat), equal', !g.gl && why() === 'coveredChat' && g.d.n === 0, 'gl ' + g.gl + ' ' + why() + ' ' + g.d.n + ' px');
    /* the bubble off screen: WebGL, nothing on the overlay for it */
    far.x = 480 + 200 + 2000;
    scene([under, far]);
    frame(S4);
    g = frame(S4);
    check('  the bubble wholly off screen: WebGL, no overlay mark for it, equal', g.gl && R._lmFgFxN === 0 && !R._lmLabelsOnFg(far) && g.d.n === 0, 'gl ' + g.gl + ' ' + why() + ' boxes ' + R._lmFgFxN + ' ' + g.d.n + ' px');
    /* a teammate just below the screen: inside the GL view, its indicator on the overlay */
    reset(); team(['mate']);
    const mate = makeCell({ x: 0, y: 80 + 45, size: 40, targetNick: 'mate' }), dot = makeCell({ x: 0, y: 60, size: 20, targetNick: '' });
    scene([dot, mate]);
    g = frame(S1);
    check('teammate just below the screen, indicator over an earlier cell: WebGL, equal', g.gl && !R._lmLabelsOnFg(mate) && marks(g, R.indicator) > 0 && g.d.n === 0,
        'gl ' + g.gl + ' ' + why() + ' ind px ' + marks(g, R.indicator) + ' ' + g.d.n + ' px');
}
/* label widths (the mark boxes): the font check runs once per frame, not for every later cell
 * (two document.fonts reads per cell); a web font load or a font change in a later frame still
 * measures again */
{
    /* (the hat puts mate's marks and labels on the overlay: boxes for the later cells) */
    reset(); team(['mate']); SEP.mate = 'Hat';
    const saved = globalThis.document;
    let reads = 0, st = 'loading';
    globalThis.document = { fonts: { get status() { reads++; return st; } } };
    /* the text canvas the widths are measured on */
    const savedTc = R._textCtx;
    R._textCtx = { font: '', measureText: (t) => ({ width: 55 * String(t).length }) };
    try {
        const cs = [makeCell({ x: -100, y: -40, size: 15, targetNick: 'mate' })];
        for (let i = 0; i < 20; i++) cs.push(makeCell({ x: -60 + i * 9, y: 40, size: 16 + i * 0.1, targetNick: 'n' + i }));
        scene(cs);
        let g = frame(S1);
        reads = 0;
        const gen0 = R._lmEmGen;
        g = frame(S1);
        check('label widths: the font check reads document.fonts once in a frame with marks and 20 later cells', g.gl && R._lmFgFxN > 0 && reads === 1 && R._lmEmGen === gen0,
            'gl ' + g.gl + ' ' + why() + ' boxes ' + R._lmFgFxN + ' reads ' + reads);
        st = 'loaded';
        g = frame(S1);
        check('  web fonts loaded in a later frame: measured again', R._lmEmGen === gen0 + 1);
        ds.namesFontFamily = 'Arial';
        g = frame(S1);
        check('  a nick font change in a later frame: measured again (new font)', R._lmEmGen === gen0 + 2 && R._lmEmFont === (ds.namesFontWeight || 'bold') + ' 100px Arial');
        check('  still equal', g.gl && g.d.n === 0, 'gl ' + g.gl + ' ' + g.d.n + ' px');
    } finally {
        globalThis.document = saved;
        R._textCtx = savedTc;
        setSettings();
    }
}
/* ---- overlapping cells ---- */

reset(); team(['mate']);
const mate = makeCell({ x: 0, y: 40, size: 40, targetNick: 'mate' });
scene([mate, makeCell({ x: 10, y: -70, size: 60, targetNick: 'big' })]);
r = frame(S1);
check('later bigger cell over the indicator: WebGL, it covers the GL indicator as in Canvas2D, equal', r.gl && r.d.n === 0 && marks(r, R.indicator) > 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
scene([mate, makeCell({ x: 15, y: -40, size: 20, targetNick: 'small' })]);
r = frame(S1);
check('earlier smaller cell under the indicator: WebGL, indicator above it as in Canvas2D, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
scene([mate, makeCell({ x: -100, y: 40, size: 60, targetNick: 'farbig' })]);
r = frame(S1);
check('later bigger cell away from the indicator: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
scene([mate, makeCell({ x: 200, y: -60, size: 45, targetNick: 'a very long nickname here' })]);
r = frame(S1);
check('later cell whose long nick may reach the indicator: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
setSettings({ set: { namesScale: 3 } });
scene([makeCell({ x: 0, y: 40, size: 41, targetNick: 'mate' })]);
r = frame(S1);
check('indicator that may meet its own big nick (drawn after it in Canvas2D): WebGL, nick over it, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
reset(); chat('talk'); talker._lmChatAt = undefined;
scene([talker, makeCell({ x: 15, y: 40, size: 90, targetNick: 'cover' })]);
frame(S1);
r = frame(S1);
check('later bigger cell over a chat bubble: WebGL, it covers the GL bubble as in Canvas2D, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
/* an overlay mark of an earlier cell (its labels with an effect) under a later GL indicator */
reset(); team(['mate2']); SEP.hatty = 'Hat';
{
    const hatty = makeCell({ x: 0, y: 30, size: 30, targetNick: 'hatty' });
    const m2 = makeCell({ x: 20, y: 60, size: 35, targetNick: 'mate2' });
    scene([hatty, m2]);
    r = frame(S1);
    check('later teammate whose GL indicator reaches an earlier overlay effect: Canvas2D (the overlay is above the GL layer), equal', !r.gl && /^covered/.test(why()) && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    m2.x = 200;
    r = frame(S1);
    check('  away from it: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
}

/* ---- selected-cell ring (sticky cells) ----
 * drawRings strokes it after the whole cell pass, over every cell and label: in a WebGL frame
 * on the overlay at that point (the main canvas is under the GL cells). */
reset(); strokes.on = true; R.drawRings = realDrawRings;
{
    const sel = makeCell({ x: -10, y: 0, size: 60, targetNick: 'sel' });
    const over = makeCell({ x: 40, y: 10, size: 70, targetNick: 'over' });
    scene([sel, over]);
    LM.indexedCells = {}; LM.indexedCells[sel.id] = sel; LM.selected = sel.id;
    LM.selected = null;
    const none = frame(S1);
    LM.selected = sel.id;
    r = frame(S1);
    /* pixels the ring changes (it is under the later cell when it is on the main canvas) */
    const ringPx = diff(r.out, none.out).n;
    check('selected-cell ring: WebGL frame, the ring on the overlay over the later cell too, equal', r.gl && r.shown && ringPx > 0 && r.d.n === 0,
        'gl ' + r.gl + ' (' + why() + ') shown ' + r.shown + ' ring px ' + ringPx + ' ' + r.d.n + ' px');
    r = frame({ W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: 0 });
    check('  DPR 2, zoom 0.8: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
    team(['over']);
    r = frame(S1);
    check('  with a teammate indicator: WebGL, ring over the indicator, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    team([]);
    LM._elWorldEntrance = { active: true };
    r = frame(S1);
    check('  join entrance (keeps the overlay): Canvas2D, reason selRing, equal', !r.gl && why() === 'selRing' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    LM._elWorldEntrance = null;
    LM.selected = null;
    r = frame(S1);
    check('  no cell selected: WebGL, overlay hidden, equal', r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    LM.selected = 999999;
    r = frame(S1);
    check('  selected id of a cell that is gone: WebGL, no ring, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    LM.selected = null; LM.indexedCells = {};
}
R.drawRings = stubRings; strokes.on = false;

/* ---- no marks: no clear, overlay hidden ---- */
reset(); SEP.mate = 'Hat';
scene([makeCell({ x: 0, y: 40, size: 40, targetNick: 'mate' })]);
frame(S1);
delete SEP.mate;
r = frame(S1);
check('marks gone: WebGL frame without the overlay (hidden)', r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown);
check('  it was cleared once (it held marks)', r.ops.filter((o) => o === 'overlay:clear').length === 1, r.ops.join(' '));
r = frame(S1);
check('  next frame: no overlay clear at all', r.ops.filter((o) => o === 'overlay:clear').length === 0, r.ops.join(' '));

/* ---- Canvas2D / WebGL transitions ---- */
reset(); team(['mate']);
scene([makeCell({ x: -30, y: 30, size: 40, targetNick: 'mate' }), makeCell({ x: 80, y: 20, size: 30, targetNick: 'o' })]);
const t1 = frame(S1), t2 = frame(Object.assign({}, S1, { glOk: false })), t3 = frame(S1);
check('WebGL > Canvas2D > WebGL: every frame equal to Canvas2D', t1.gl && !t2.gl && t3.gl && t1.d.n === 0 && t2.d.n === 0 && t3.d.n === 0, [t1.d.n, t2.d.n, t3.d.n].join('/'));
check('  the Canvas2D frame hides the overlay', !t2.shown);

/* ---- high DPI ---- */
reset(); team(['mate']); chat('talk'); talker._lmChatAt = undefined;
const S2 = { W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 20, camY: -10 };
talker.x = 90; talker.y = 30;
scene([makeCell({ x: -40, y: 30, size: 40, targetNick: 'mate' }), talker]);
frame(S2);
r = frame(S2);
check('DPR 2, zoom 0.8: WebGL, indicator and bubble survive, equal', r.gl && marks(r, R.indicator) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));

/* ---- resize between frames ---- */
const S3 = Object.assign({}, S2, { W: 260, H: 150 });
/* (a mark the overlay holds: the indicator and bubble are on the GL layer) */
SEP.talk = 'Hat';
r = frame(S3);
check('resized frame: overlay resized before its marks, marks kept, equal', r.gl && overlay.width === 520 && orderOk(r.ops) && r.d.n === 0, 'gl ' + r.gl + ' ' + overlay.width + 'x' + overlay.height + ' ' + r.d.n + ' px ' + r.ops.filter((o) => /^overlay/.test(o)).join(' > '));
r = frame(S3);
check('  next frame at the new size: equal', r.gl && r.d.n === 0, r.d.n + ' px');

/* ---- WebGL context loss ---- */
reset(); team(['mate']);
scene([makeCell({ x: -30, y: 30, size: 40, targetNick: 'mate' })]);
frame(S1);
R._webglDisabledUntil = Date.now() + 5000; /* what the webglcontextlost listener sets */
r = frame(S1);
check('context lost: Canvas2D, overlay hidden, equal', !r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
R._webglDisabledUntil = 0;
r = frame(S1);
check('context back: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');

/* ---- the real cell.draw, both branches: the chat bubble follows showChat only ----
 * Here cell.draw also runs its Canvas2D branch (bodies fall back to a no-op fill), on a
 * canvas that records every drawImage of the cell's chat raster. */
window.drawRender = R;
if (!R.cellsColored) R.cellsColored = {};
R.preDrawCellsColors = function () { };
globalThis.lmMultiboxRing = () => null;
class RecCtx extends SoftCtx {
    constructor(c) { super(c); this.calls = []; }
    drawImage(im, x, y, w, h) { this.calls.push({ im: im, x: x, y: y, w: w, h: h, a: this.globalAlpha }); return super.drawImage.apply(this, arguments); }
}
const recCv = new SoftCanvas(240, 160, 'rec'), recCtx = new RecCtx(recCv);
recCv._ctx = recCtx;
const errLog = console.error;
let drawErrors = 0;
console.error = function () { drawErrors++; errLog.apply(console, arguments); };
/* one draw of cell c (gl: its WebGL branch), the chat bubble draws it made */
function drawReal(c, gl, zoom, moved) {
    const s = Object.assign({}, S1, { zoom: zoom });
    ogario.viewScale = zoom; R.scale = zoom; window.LM_DPR = 1; R._foregroundCtx = null;
    recCtx.setTransform(1, 0, 0, 1, 0, 0); recCtx.clearRect(0, 0, 240, 160); recCtx.calls.length = 0;
    worldTransform(recCtx, s);
    c._webglRendered = gl;
    c.draw(recCtx, moved);
    return recCtx.calls.filter((k) => c.chatCanvas && k.im === c.chatCanvas.txtCanvas);
}
const variants = [
    ['names and mass shown', {}],
    ['names off', { noNames: true }],
    ['mass off', { showMass: false }],
    ['names and mass off', { noNames: true, showMass: false }],
    ['own name and mass hidden', { hideMyName: true, hideMyMass: true }],
    ['enemy mass hidden', { hideEnemiesMass: true }],
    ['auto-hide names and mass', { autoHideNames: true, autoHideMass: true }]
];
let mtxOk = true, mtxInfo = '', mtxN = 0;
for (const own of [false, true]) {
    for (const zoom of [1, 0.4]) {
        const who = (own ? 'own' : 'enemy') + ' cell, zoom ' + zoom;
        const c = makeCell({ x: 5, y: 8, size: 60, targetNick: 'talk', isPlayerCell: own });
        let ref = null;
        for (const sc of [true, false]) {
            for (const [vn, vmap] of variants) {
                for (const gl of [false, true]) {
                    reset(); chat('talk');
                    setSettings({ map: Object.assign({ showChat: sc }, vmap), set: { textAlpha: 0.8 } });
                    LM.cells = [c];
                    const b = drawReal(c, gl, zoom);
                    mtxN++;
                    const tag = who + ', showChat ' + sc + ', ' + vn + ', ' + (gl ? 'WebGL' : 'Canvas2D');
                    if (!sc) { if (b.length) { mtxOk = false; mtxInfo += ' [' + tag + ': ' + b.length + ' bubbles]'; } continue; }
                    if (b.length !== 1) { mtxOk = false; mtxInfo += ' [' + tag + ': ' + b.length + ' bubbles]'; continue; }
                    const k = b[0], key = [k.x, k.y, k.w, k.h, k.a.toFixed(6)].join(',');
                    if (ref === null) ref = key;
                    else if (key !== ref) { mtxOk = false; mtxInfo += ' [' + tag + ': ' + key + ' vs ' + ref + ']'; }
                }
            }
        }
    }
}
check('real cell.draw, ' + mtxN + ' cases: showChat on = one bubble, off = none, same place and alpha whatever names/mass show (own/enemy, zoom 1/0.4, Canvas2D/WebGL)', mtxOk, mtxInfo);
reset(); chat('talk'); setSettings({ map: { noNames: true, showMass: false } });
{
    const c = makeCell({ x: 5, y: 8, size: 60, targetNick: 'talk', nick: 'stale' });
    LM.cells = [c];
    const b = drawReal(c, false, 1);
    check('names off with a stale this.nick: the bubble of targetNick', b.length === 1, b.length + ' bubbles');
    const ref = drawReal(makeCell({ x: 5, y: 8, size: 60, targetNick: 'talk' }), false, 1);
    check('  placed above where the nick would be (not on the cell centre)', b.length === 1 && ref.length === 1 && b[0].y === ref[0].y && b[0].y < c.y, b.length && (b[0].y + ' vs ' + (ref[0] && ref[0].y)));
    c._lmDrawNoText = true;
    const n1 = drawReal(c, false, 1).length, n2 = drawReal(c, true, 1).length;
    c._lmDrawNoText = false;
    check('removed cell drawn without text (_lmDrawNoText): no bubble in either branch', n1 === 0 && n2 === 0, n1 + '/' + n2);
    c.moveCell = function () { };
    const n3 = drawReal(c, false, 1, true).length;
    check('cell drawn with cellMoved: no bubble', n3 === 0, n3);
    const sm = makeCell({ x: 5, y: 8, size: 40, targetNick: 'talk' });
    const n4 = drawReal(sm, false, 1).length + drawReal(sm, true, 1).length;
    check('cell of size 40 or less: no bubble (as before)', n4 === 0, n4);
}
check('real cell.draw: no draw errors', drawErrors === 0, drawErrors);
console.error = errLog;

/* frames with names and mass hidden: one bubble per frame, equal to Canvas2D, zoom changes */
reset(); chat('talk'); setSettings({ map: { noNames: true, showMass: false } });
{
    const t2 = makeCell({ x: 10, y: -10, size: 60, targetNick: 'talk' });
    scene([t2, makeCell({ x: -90, y: 40, size: 30, targetNick: 'b' })]);
    frame(S1);
    t2.chatCanvas.txtCanvas.name = 'chatTxt';
    let ok = true, info = '';
    for (const zoom of [1, 0.7, 1.3]) {
        const fr = frame(Object.assign({}, S1, { zoom: zoom }));
        const fr2 = frame(Object.assign({}, S1, { zoom: zoom }));
        const n = fr2.ops.filter((o) => /^(main|overlay|gl):draw:chatTxt$/.test(o)).length;
        if (!(fr.d.n === 0 && fr2.d.n === 0 && fr2.gl && n === 1)) { ok = false; info += ' [zoom ' + zoom + ': gl ' + fr2.gl + ' ' + fr.d.n + '/' + fr2.d.n + ' px, ' + n + ' bubbles]'; }
    }
    check('names and mass off, zoom 1/0.7/1.3: WebGL, exactly one bubble per frame, equal to Canvas2D', ok, info);
    scene([t2, makeCell({ x: 15, y: 40, size: 90, targetNick: 'cover' })]);
    frame(S1);
    r = frame(S1);
    check('names and mass off, later bigger cell over the bubble: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
}

/* ---- the per-frame chat lookup (renderFrame): built only for showChat, stops at expiry ---- */
const lookA = src.indexOf('/* Build chat/command lookup map once per frame');
const lookSrc = src.slice(lookA, src.indexOf('/* Precompute per-frame constants for cell draw', lookA));
const runLookup = new Function('LM', 'application', 'defaultmapsettings', '$', 'drawRender', lookSrc);
let histReads = 0;
/* counts the lines read */
function history(lines) {
    return new Proxy(lines, { get(t, k) { if (typeof k === 'string' && /^\d+$/.test(k)) histReads++; return t[k]; } });
}
function lookup(mapOver, chatLines, cmdLines, myNick) {
    setSettings({ map: mapOver });
    const app = { chatHistory: history(chatLines), commandHistory: history(cmdLines), lastSentNick: null };
    const jq = () => ({ val: () => myNick || '', on() { } });
    const host = { _chatLookup: null };
    histReads = 0;
    runLookup.call(host, LM, app, ms, jq, host);
    return host._chatLookup;
}
{
    const now = LM.time, old = [];
    for (let i = 0; i < 2000; i++) old.push({ nick: 'p' + (i % 50), message: 'old ' + i, time: now - 600000 + i });
    const live = [{ nick: 'a', message: 'hi', time: now - 9000 }, { nick: 'me', message: 'mine', time: now - 5000 }, { nick: 'a', message: 'newer', time: now - 1000 }];
    const cmds = [{ nick: 'p1', message: 'old cmd', time: now - 60000 }, { nick: 'b', message: 'cmd', time: now - 2000 }];
    let m = lookup({ showChat: false }, old.concat(live), cmds, 'me');
    check('chat lookup with showChat off: empty, no history line read', m.size === 0 && histReads === 0, m.size + ' entries, ' + histReads + ' reads');
    m = lookup({ showChat: true, showChatMyOwn: false }, old.concat(live), cmds, 'me');
    check('chat lookup: live lines only, newest per nick, own line left out (showChatMyOwn off)', m.size === 2 && m.get('a').message === 'newer' && m.get('b').message === 'cmd' && !m.has('me'), [...m.keys()].join(','));
    check('  the scans stop at the first expired line (not at 2000 old ones)', histReads <= live.length + cmds.length + 2, histReads + ' reads');
    m = lookup({ showChat: true, showChatMyOwn: true }, old.concat(live), cmds, 'me');
    check('chat lookup with showChatMyOwn on: own line in', m.has('me') && m.get('me').message === 'mine', [...m.keys()].join(','));
    m = lookup({ showChat: true }, [{ nick: 'a', message: 'chat', time: now - 3000 }], [{ nick: 'a', message: 'cmd later', time: now - 1000 }], 'me');
    check('chat lookup: a later command line replaces the chat line of that nick', m.get('a').message === 'cmd later', m.get('a') && m.get('a').message);
}

/* ---- why a frame is Canvas2D: the frame counters by reason ---- */
reset(); team(['mate']);
const mate2 = makeCell({ x: 0, y: 40, size: 40, targetNick: 'mate' });
scene([mate2]);
R._lmGlWhyN = null;
for (let i = 0; i < 3; i++) frame(S1);
const counts = R._lmGlWhyN;
/* (a later cell over mate's hat, an overlay mark) */
SEP.mate = 'Hat';
scene([mate2, makeCell({ x: 10, y: -70, size: 60, targetNick: 'big' })]);
frame(S1); frame(S1);
delete SEP.mate;
scene([mate2]);
frame(Object.assign({}, S1, { batchFail: true }));
const glKeep = R.gl;
R.gl = null; R._lmGlLost = true; /* what the webglcontextlost listener leaves */
r = frame(S1);
check('context lost (no context): Canvas2D, equal', !r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
setSettings({ map: { webgl2Acceleration: false } });
team(['mate']);
frame(S1);
setSettings(); team(['mate']);
R.gl = glKeep;
frame(S1);
R._webglDisabledUntil = Date.now() + 5000;
frame(S1);
R._webglDisabledUntil = 0;
const C = R._lmGlWhyN, G = R.GLW || {};
check('renderer counters exist (real renderFrame lines)', !!(runWhy && runCount && C && C.length === 32), 'why ' + !!runWhy + ' count ' + !!runCount);
if (C) {
    const named = (k) => C[G[k]];
    check('  4 WebGL frames, 2 coveredEffect, 1 batch, 1 contextLost, 1 off, 1 reset', named('WEBGL') === 4 && named('COVER_FX') === 2 && named('BATCH') === 1 &&
        named('LOST') === 1 && named('OFF') === 1 && named('RESET') === 1, Array.from(C).map((v, i) => v ? R.GLW_IDS[i] + ' ' + v : '').filter(Boolean).join(', '));
    check('  context back: no longer counted as lost', R._lmGlLost === false);
    check('  one counter array for all frames (no per-frame allocation)', C === counts);
    check('  every reason has a name', Object.keys(G).every((k) => typeof R.GLW_IDS[G[k]] === 'string') && new Set(R.GLW_IDS).size === R.GLW_IDS.length);
}

/* ---- the mark box check of later cells: same first hit as the full scan, far cells skip it ---- */
reset(); setSettings();
{
    /* the full scan over every box (the check before the bounds of all boxes were kept) */
    const fullScan = (cell, n) => {
        const rb = cell.size * 1.15 + 4, x = cell.x, y = cell.y, b = R._lmFxBoxes;
        R._lmLabelExt(cell);
        const lw = R._lmExtW, lh = R._lmExtH;
        for (let k = 0; k < n; k += 4) {
            const x0 = b[k], y0 = b[k + 1], x1 = b[k + 2], y1 = b[k + 3];
            let hit = lw > 0 && x - lw < x1 && x + lw > x0 && y - lh < y1 && y + lh > y0;
            if (!hit) {
                const ddx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0, ddy = y < y0 ? y0 - y : y > y1 ? y - y1 : 0;
                hit = ddx * ddx + ddy * ddy < rb * rb;
            }
            if (hit) return R._lmFxKinds[k >> 2] || R.GLW.COVERED;
        }
        return 0;
    };
    let s = 11;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const kinds = [R.GLW.COVER_TEAM, R.GLW.COVER_CHAT, R.GLW.COVER_FB, R.GLW.COVER_FX, R.GLW.COVER_LABELS];
    let same = true, hits = 0, misses = 0, info = '';
    for (let round = 0; round < 40 && same; round++) {
        /* a frame's boxes; some rounds drop the last ones again (a mark wholly off screen) */
        let n = 0;
        const boxes = 1 + (rnd() * 30 | 0), cx = (rnd() - 0.5) * 8000, cy = (rnd() - 0.5) * 8000;
        for (let k = 0; k < boxes; k++) {
            const x0 = cx + (rnd() - 0.5) * 1500, y0 = cy + (rnd() - 0.5) * 1500;
            const m = R._lmFxPush(n, x0, y0, x0 + rnd() * 300, y0 + rnd() * 200, kinds[rnd() * kinds.length | 0]);
            n = round % 3 === 0 && k === boxes - 1 && boxes > 1 ? n : m;
        }
        for (let t = 0; t < 200; t++) {
            const near = rnd() < 0.5;
            const cell = makeCell({ x: (near ? cx : 0) + (rnd() - 0.5) * (near ? 2500 : 14000), y: (near ? cy : 0) + (rnd() - 0.5) * (near ? 2500 : 14000),
                size: 10 + rnd() * 600, targetNick: rnd() < 0.6 ? 'cell' + t : '' });
            const want = fullScan(cell, n), got = R._lmFxCovered(cell, n);
            if (want) hits++; else misses++;
            if (want !== got) { same = false; info = 'round ' + round + ' cell ' + t + ' want ' + want + ' got ' + got; break; }
        }
    }
    check('mark boxes: a later cell gets the same first covering box as the full scan (8000 cells, hits and misses)', same && hits > 100 && misses > 100, info || hits + ' hits ' + misses + ' misses');
    /* a cell far from every mark reads none of the boxes */
    let n = 0;
    for (let k = 0; k < 200; k++) n = R._lmFxPush(n, k * 3, 0, k * 3 + 20, 20, R.GLW.COVER_TEAM);
    const real = R._lmFxBoxes;
    let reads = 0;
    R._lmFxBoxes = new Proxy(real, { get(t, p) { if (typeof p === 'string' && /^\d+$/.test(p)) reads++; return t[p]; } });
    const far = makeCell({ x: 5000, y: 5000, size: 80, targetNick: 'far' });
    const got = R._lmFxCovered(far, n);
    R._lmFxBoxes = real;
    check('  a cell far from all 200 marks: no hit, no box read', got === 0 && reads === 0, reads + ' reads');
}

/* section: gradient bubbles with the real drawRender on a recording 2D context: the opponent
 * bubbles (drawBubbleCircles, toward where the cell moves) and the cursor bubble (drawBCursorTracking
 * on Canvas2D, toward the cursor) make exactly the canvas calls of the loops they had before they
 * shared one helper (same transform, gradient, alpha and arc) */
{
const F = rendererFactory(src);
const D = new Function('return ' + F.defaults)();
const LM = { play: true, playerCells: [], playerCellsMulti: [], cursorX: 0, cursorY: 0, integrity: true };
const env = { window: { navigator: {}, devicePixelRatio: 1, legendmod: {} }, LM, application: {}, defaultSettings: D.defaultSettings,
    defaultmapsettings: D.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
const R = new Function('return (' + F.factory + ')')()(env);

/* every call and property write, rounded so the same maths gives the same text */
function recorder() {
    const log = [];
    const n = (v) => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);
    const grad = (args) => ({ addColorStop: (...a) => log.push('stop ' + a.map(n).join(',')), _a: args });
    const ctx = new Proxy({}, {
        get(t, k) {
            if (k === 'createLinearGradient') return (...a) => { log.push('grad ' + a.map(n).join(',')); return grad(a); };
            return (...a) => log.push(String(k) + ' ' + a.map(n).join(','));
        },
        set(t, k, v) { log.push(String(k) + '=' + (v && v._a ? 'grad' : n(v))); return true; }
    });
    return { ctx, log };
}
/* the loop as it was before the helper: translate, rotate, gradient, alpha, arc at size - r */
function reference(cells, angleOf, color, alpha, resetAlpha) {
    const { ctx, log } = recorder();
    for (const t of cells) {
        if (!t) continue;
        const r = t.size / 3;
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(angleOf(t));
        const g = ctx.createLinearGradient(0, -t.size, 0, r * 2 - t.size);
        g.addColorStop(0, color); g.addColorStop(1, color + '00');
        ctx.fillStyle = g; ctx.globalAlpha = alpha; ctx.beginPath();
        ctx.arc(0, -(t.size - r), r, 0, Math.PI * 2, false); ctx.fill();
        if (resetAlpha) ctx.globalAlpha = 1;
        ctx.restore();
    }
    return log;
}
const cells = [{ x: 100, y: -40, size: 90, targetX: 130, targetY: 10 }, null, { x: -300, y: 250, size: 33, targetX: -300, targetY: 250 },
    { x: 7, y: 9, size: 400, targetX: -50, targetY: -80 }];
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* restore() puts globalAlpha back, so the opponent loop's extra "globalAlpha = 1" before it changed nothing */
const noReset = (log) => log.filter((x, i) => !(x === 'globalAlpha=1' && log[i + 1] === 'restore '));

{
    const { ctx, log } = recorder();
    R.drawBubbleCircles(ctx, cells, 15, 13, 0.75, '#ff0000');
    const ref = reference(cells, (t) => Math.atan2(t.targetX - t.x, t.y - t.targetY), '#ff0000', 0.75, true);
    check('opponent bubbles: the same canvas calls as before (direction of movement)', same(noReset(log), noReset(ref)), log.length + ' vs ' + ref.length);
    check('opponent bubbles: one gradient per cell', log.filter((x) => x.startsWith('grad ')).length === 3);
}
{
    D.defaultmapsettings.webgl2Acceleration = false;
    D.defaultSettings.darkTheme = true;
    D.defaultSettings.cursorTrackingColor = '#00ccff';
    const { ctx, log } = recorder();
    R.drawBCursorTracking(ctx, cells, 500, -200);
    const ref = reference(cells, (t) => Math.atan2(-200 - t.y, 500 - t.x) + Math.PI / 2, '#00ccff', 0.75, false);
    check('cursor bubble (Canvas2D): the same canvas calls as before (toward the cursor)', same(noReset(log), noReset(ref)), log.length + ' vs ' + ref.length);
    D.defaultSettings.darkTheme = false;
    const r2 = recorder();
    R.drawBCursorTracking(r2.ctx, cells, 500, -200);
    check('cursor bubble: light theme alpha 0.35', r2.log.indexOf('globalAlpha=0.35') >= 0);
}
/* Cursor tracking and its looks: which one draws */
{
    const calls = [];
    R.drawSplitVectorGuide = () => calls.push('line');
    R.drawMergeProgressRings = () => { };
    R.drawBCursorTracking = () => calls.push('bubble');
    R.drawFBTracking = () => { };
    R.ctx = recorder().ctx;
    LM.playerCells = [{ x: 1, y: 1, size: 50, isInView: () => true }];
    LM.cursorX = 300; LM.cursorY = 300;
    const S = D.defaultmapsettings;
    const run = (ct, bubble) => {
        calls.length = 0; S.cursorTracking = ct; S.bubbleCursorTracker = bubble;
        R.drawPostCellOverlays(R.ctx); R.drawMiscRings();
        return calls.join(',') || 'nothing';
    };
    check('Cursor tracking off, line look: nothing', run(false, false) === 'nothing', run(false, false));
    check('Cursor tracking on, line look: the line only', run(true, false) === 'line', run(true, false));
    check('Cursor tracking on, bubble look: the bubble only', run(true, true) === 'bubble', run(true, true));
    check('Cursor tracking off, bubble look chosen: nothing (the bubble is a look of Cursor tracking)', run(false, true) === 'nothing', run(false, true));
}
}

/* the cell mass text is drawn again only after a 2% change (fixed: the Optimized mass switch is gone);
 * Mass format 12.3k -> exact shows the exact number at once (4f44055b) */
if (haveMethods.includes('setMass')) {
    reset();
    ms.massFormat = 1; ms.hudRelativeMass = false;
    const c = makeCell({ size: 400, shortMass: false });
    c.setMass(400); c.lastMass = c.mass;
    c.setMass(402);
    const small = c.redrawMass;
    c.setMass(410);
    check('mass text: a 1% change keeps the drawn text, a 5% change redraws it', !small && c.redrawMass === true && c.massTxt === '1681', small + ' ' + c.redrawMass + ' ' + c.massTxt);
    const k = makeCell({ size: 400, shortMass: true });
    k.setMass(400); k.lastMass = k.mass;
    const kTxt = k.massTxt;
    k.shortMass = false;
    k.setMass(401);
    check('mass text: 12.3k -> exact redraws the exact number at once', kTxt === '1.6k' && k.redrawMass === true && k.massTxt === '1608', kTxt + ' ' + k.redrawMass + ' ' + k.massTxt);
}

console.log(failed ? failed + ' overlay check(s) FAILED' : 'overlayfx ok');
process.exit(failed ? 1 : 0);
