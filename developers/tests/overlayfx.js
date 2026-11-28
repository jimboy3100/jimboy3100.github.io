/* Overlay marks above WebGL cells (teammate indicator, chat bubble, FB friend badge and
 * arrow, special effects) in Node, with real code cut out of ogario/ogario.v4.js:
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
 * (body, ring, labels) in cell order, which is what its depth order gives; the marks of the GL
 * text pass (FB badge, special effect and then the ring; teammate indicator; chat bubble) are
 * painted there by the real _lmGlMarks. A cell whose FB badge or effect stays on the overlay
 * (beyond the GL view, Gladiator, an image without CORS) has its real nick / mass rasters and
 * ring there (the GL ring and text passes skip it), so its reference uses the same rasters. So
 * a difference is always a mark: lost, misplaced, wrong alpha, or above something it is under
 * in Canvas2D. It does not run a GPU: drawWebGLCellBatch and the GPU draw of the text pass are
 * not executed here (glbatch.js compares those pixels).
 * Also the Canvas2D gradient bubbles (opponents, cursor) on a recording context, and which look
 * of Cursor tracking draws (line, bubble, none) for its two switches.
 * Cases: teammate only, chat only, FB badge (with its nick and mass, multibox ring, text and
 * skin alpha, agar.io Teams, no skin, no CORS), FB arrow, special effects (custom skins off, an
 * effect of a cell outside the frame, Hero1 alpha, Gladiator, an image without CORS), the
 * agar.io Teams pie, the chat bubble of a cell outside the GL view, overlapping cells (later cell over a mark or the moved labels,
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
        /* an image without CORS taints the canvas for good (getImageData then throws) */
        if (img.tainted) this.canvas.tainted = true;
        oplog.push(this.canvas.name + ':draw:' + (img.name || img._id));
        this._paint(this._rect(x, y, w, h), img.color || colorFor(img._id || 0), this._alpha * (img.alpha == null ? 1 : img.alpha));
    }
    /* test-side bodies */
    disc(x, y, r, col) {
        const m = this.m, cx = m[0] * x + m[4], cy = m[3] * y + m[5], pr = Math.abs(m[0]) * r;
        this._paint([cx - pr, cy - pr, cx + pr, cy + pr], col, this._alpha, (px, py) => (px - cx) * (px - cx) + (py - cy) * (py - cy) <= pr * pr);
    }
    box(x, y, w, h, col) { this._paint(this._rect(x, y, w, h), col, this._alpha); }
    getImageData() { if (this.canvas.tainted) throw new Error('SecurityError: tainted canvas'); return { data: [0, 0, 0, 0] }; }
    measureText(t) { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); return { width: (m ? +m[1] : 10) * 0.6 * String(t).length }; }
    /* a full circle stroked (the multibox ring), only in the cases that turn it on */
    arc(x, y, r) { this._arc = [x, y, r]; }
    beginPath() { this._arc = null; }
    stroke() {
        if (!strokes.on || !this._arc || typeof this.strokeStyle !== 'string') return;
        const m = this.m, cx = m[0] * this._arc[0] + m[4], cy = m[3] * this._arc[1] + m[5], k = Math.abs(m[0]);
        /* (a line wider than twice the radius covers the centre too) */
        const r0 = Math.max(0, k * (this._arc[2] - this.lineWidth / 2)), r1 = k * (this._arc[2] + this.lineWidth / 2);
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
    /* drawMerge has a brace in a // comment: it ends at the first line that is only "        };" */
    if (name === 'drawMerge') {
        const end = src.indexOf('\n        };', at);
        return end < 0 ? null : src.slice(at, end + 10);
    }
    return block(src, at);
}
const CELL_METHODS = ['draw', 'drawChat', 'lmChatLine', 'lmChatBubble', 'drawMass', 'drawMerge', 'drawSpecialSkin', 'drawImageSpecialSkin', 'layoutNick', 'drawNick', 'lmLabels', 'lmFbBadge',
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
const ringSrc = ['lmMultiboxRingPlayer', 'lmMultiboxRing', 'lmSkinsShown', 'lmOwnColorPlaying', 'lmOwnBodyColor', 'lmMbShadowOn', 'lmMbShadowColor', 'lmColorInt', 'lmDlSync', 'lmDlSkinCell', 'lmDlSkinKey', 'lmWorldSkinKey'].map((n) => {
    const i = src.indexOf('\nfunction ' + n + '(');
    return i < 0 ? '' : block(src, i + 1);
}).join('\n') + '\n' + ['LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_MIN_SCREEN_PX', 'LM_MB_RING_SIZE', '_lmMbRingOut', '_lmColorIntCache', '_lmDl'].map((n) => {
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
/* (the renderer makes its 1x1 CORS probe canvas with it, _lmMkClean) */
globalThis.document = document;
const fbImage = img('fbBadge', 40, 40);
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
    ' function loadIconSpecialSkins() { } function checkVideos() { } function lmMultiboxControlledPlayer() { return 1; } function CellTimerTrigger() { }\n' +
    ringSrc + '\n' +
    'return {' + haveMethods.map((n) => n + ': ' + cellMethod(n)).join(',\n') + '};')(Object.assign({ drawRender: R, SEP: SEP, TextClass: TextClass }, env));
window.iconSpecialSkinEffectsHat3 = img('hat', 64, 64);
/* drawn with a hue-rotate filter: an effect the GL text pass leaves to the overlay */
window.iconSpecialSkinEffectsGladiator = img('gladiator', 64, 64);

/* renderer state */
/* the real selected-cell ring (the frame block calls it; stubbed by default) */
const realDrawRings = R.drawRings;
function stubRings() { }
const main = new SoftCanvas(0, 0, 'main'), glc = new SoftCanvas(0, 0, 'gl'), overlay = new SoftCanvas(0, 0, 'overlay');
Object.assign(R, {
    canvas: main, ctx: main.getContext(), overlayCanvas: overlay, overlayCtx: overlay.getContext(), glCanvas: glc,
    gl: {}, glTextProgram: {}, glTextVAO: {}, glCellProgram: {}, glJellyProgram: {}, glJellyStrokeProgram: {}, glJellyVAO: {}, glJellyVBO: {}, glJellyStrokeVAO: {}, glJellyStrokeVBO: {}, glMbRingProgram: {}, glMbRingVAO: {},
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
/* the multibox ring the text pass draws after a cell's FB badge / effect: the ring model on the
 * GL layer (the GPU draw is not run here) */
R._lmGlRingOne = function (c) {
    const ring = lmRing(c, c.size, R.scale);
    if (ring) R.strokeMultiboxRing(glc.getContext(), c.x, c.y, c.size, ring);
};
const realDeformed = R.drawLegendWorldDeformedCanvasCell;
/* Canvas2D cells: the test model painter; WebGL cells: the real cell.draw (its WebGL branch) */
R.drawLegendWorldDeformedCanvasCell = function (cell, ctx) {
    return cell._webglRendered ? realDeformed.call(this, cell, ctx) : paintCellCanvas(cell, ctx, R._lmFrameGL && R._lmLabelsOnFg(cell));
};
/* the "Player 1 & 2" glow of the model (lmMbShadowColor: own cells while a unit plays): a disc
 * as far as the blur reaches (60 canvas pixels) under the body, in its own colour */
const glowCol = [0.98, 0.02, 0.97];
const glowModel = (c) => !!(ms.multiBoxShadow && LM.playerCellsMulti.length && (c.spectator > 0 ? c.isPlayerCellMulti : c.isPlayerCell));

function setSettings(over) {
    const base = new Function('return ' + F.defaults)();
    for (const k of Object.keys(ms)) delete ms[k];
    Object.assign(ms, base.defaultmapsettings, {
        jellyPhisycs: true, webgl2Acceleration: true, cellContours: false, transparentCells: false, transparentSkins: false, myTransparentSkin: false,
        spawnSpecialEffects: false, multiBoxShadow: false, customSkins: true, noNames: false, showMass: true, showChat: true, teammatesInd: true,
        FBTracking: false, cursorTracking: false, bubbleCursorTracker: false, autoHideNames: false, autoHideMass: false, hideMyName: false, hideMyMass: false,
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
        chatCanvas: null, nickCanvas: null, massCanvas: null, mergeCanvas: null, mass: 0, scale: 1, redrawNick: true, redrawMass: true, redrawChat: true,
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
    if (glowModel(c)) ctx.disc(c.x, c.y, y + 60 / (R.scale * (R.dpr || 1)), glowCol);
    ctx.disc(c.x, c.y, y, c.body);
    const pre = ctx.globalAlpha;
    if (ms.transparentSkins && !(c.isPlayerCell && !ms.myTransparentSkin) || c.isPlayerCell && ms.myTransparentSkin && ds.skinsAlpha < 0.99) ctx.globalAlpha *= ds.skinsAlpha;
    const node = paintSkin(ctx, c);
    if (node && LM.gameMode != ':teams' && ms.FBTracking) {
        const k = application.customSkinsMap[c.targetNick + 'facebookskin'];
        const im = k && application.customSkinsCache[k + '_cached4'];
        if (im) ctx.drawImage(im, c.x - y / 2, c.y - y, y, y);
    }
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
        /* the seconds merge timer after the mass (the real drawMerge, placed from the nick layout) */
        if (fl.mass && c.drawMerge && window.ExternalScripts && window.legendmod5.mergeTimer && c.setMass(c.size)) c.drawMerge(ctx);
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
            /* and the glowing own cells (_lmCellGlow: cell.draw draws them on the overlay) */
            if (c._lmGlowFg > 0 && c._lmGlowFg === R._glSkinFrame) continue;
            c._webglRendered = true;
            gctx.disc(c.x, c.y, c.size, c.body);
            const pre = gctx.globalAlpha;
            if (ms.transparentSkins && !(c.isPlayerCell && !ms.myTransparentSkin) || c.isPlayerCell && ms.myTransparentSkin && ds.skinsAlpha < 0.99) gctx.globalAlpha *= ds.skinsAlpha;
            paintSkin(gctx, c);
            gctx.globalAlpha = pre;
            /* the GL ring and text passes leave out the cells whose ring and labels cell.draw
             * puts on the overlay (above their FB badge / effect) */
            const fg = R._lmLabelsOnFg && R._lmLabelsOnFg(c);
            /* the FB badge, special effect and then the multibox ring of the GL text pass (the
             * real _lmGlMarks 0 and drawSpecialSkin); s.fgLate: after the labels (wrong order,
             * to show the comparison sees it) */
            const fgOk = !fg && R._lmGlMarks && c._lmFgOk === R._glSkinFrame;
            if (fgOk && !s.fgLate) R._lmGlMarks(c, 0);
            const ring = fg || fgOk ? null : lmRing(c, c.size, R.scale);
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
            if (fgOk && s.fgLate) R._lmGlMarks(c, 0);
            /* the merge timer of the GL text pass: the real _lmGlMerge (and drawMerge) */
            if (!fg && R._lmGlMerge && c._lmMgOk === R._glSkinFrame) R._lmGlMerge(c);
            if (mk) R._lmGlMarks(c, 2);
        }
        /* the selected-cell ring of the GL scene when the overlay is taken: the instance
         * drawWebGLSelectedRing draws (buildWebGLSelectedRingData), stroked as that ring */
        if (R._lmRingGl && R.buildWebGLSelectedRingData) {
            const d = new Float64Array(9);
            if (R.buildWebGLSelectedRingData(LM.indexedCells[LM.selected], d)) {
                const lw = d[2] * (1 - d[3]), pa = gctx.globalAlpha;
                gctx.globalAlpha = d[7];
                gctx.strokeStyle = '#' + [d[4], d[5], d[6]].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
                gctx.lineWidth = lw;
                gctx.beginPath(); gctx.arc(d[0], d[1], d[2] - lw / 2); gctx.stroke();
                gctx.globalAlpha = pa;
            }
            R._lmRingGlDone = true;
        }
        gctx.restore();
    }
    if (runCount) runCount.call(R, gl, allowed);
    runFrameBlock.call(R, LM, ms, ds, R, window, gl, false, globalThis._elDeathVisual, [], null);
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
    if ((LM.play || LM.playerCellsMulti.length) && ms.FBTracking && LM.arrowFB && LM.arrowFB[0] && LM.arrowFB[0].visible) R.drawFBTracking(rctx, LM.playerCells, LM.arrowFB[0].x, LM.arrowFB[0].y);
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

/* ---- FB friend badge ---- */
/* In Canvas2D the badge lies over the skin and under the cell's own multibox ring, nick and
 * mass: in a WebGL frame the GL text pass draws it at the cell's depth before them (_lmGlMarks
 * 0), so later cells and their labels cover it as in Canvas2D. A cell beyond the GL view, an
 * effect the pass cannot draw (Gladiator) or an image that is not CORS-clean keep the overlay
 * (the badge and then the cell's labels go there, the GL ring and text passes skip them). */
const why = () => R.GLW_IDS ? R.GLW_IDS[R._lmGlWhy] : '-';
const fgOps = (r) => r.ops.filter((o) => /^overlay:(draw|stroke)/.test(o)).map((o) => o.replace(/^overlay:(draw:)?/, ''));
const glOps = (r) => r.ops.filter((o) => /^gl:(draw|stroke)/.test(o)).map((o) => o.replace(/^gl:(draw:)?/, ''));
/* drawn by the GL text pass: nothing on the overlay, not drawn on the main canvas */
const onGl = (r, name) => !r.shown && glOps(r).includes(name) && !fgOps(r).length && !r.ops.includes('main:draw:' + name);
reset(); setSettings({ map: { FBTracking: true } });
application.customSkinsMap = { 'friendfacebookskin': 'fbk' }; application.customSkinsCache = { 'fbk_cached4': fbImage };
application.skins = { friend: img('friendSkin', 64, 64) };
const friend = makeCell({ x: 0, y: 0, size: 70, targetNick: 'friend' });
scene([friend]);
r = frame(S1);
check('FB badge: WebGL frame, badge visible, pixels equal the Canvas2D order (badge under the nick and mass)', r.gl && marks(r, fbImage) > 0 && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') badge px ' + marks(r, fbImage) + ' ' + r.d.n + ' px');
check('  badge drawn by the GL text pass (no overlay, cell.draw leaves it out), the labels stay on the GL layer', onGl(r, 'fbBadge') && !R._lmLabelsOnFg(friend) && R._lmGlFgDone(friend),
    glOps(r).join(' ') + ' | ' + fgOps(r).join(' ') + ' shown ' + r.shown);
{
    /* sensitivity: the badge drawn after the cell's labels covers its nick */
    const bad = frame(Object.assign({}, S1, { fgLate: true }));
    check('  (the comparison sees it when the badge is drawn over the nick)', bad.gl && bad.d.n > 0, bad.d.n + ' px');
}
r = frame(S1);
check('FB badge, next frame: equal (none left over, none drawn twice)', r.gl && r.d.n === 0 && onGl(r, 'fbBadge') && glOps(r).filter((o) => o === 'fbBadge').length === 1, r.d.n + ' px ' + glOps(r).join(' '));
{
    /* a badge that is not CORS-clean would taint the text canvas: it keeps the overlay */
    const keepImg = application.customSkinsCache.fbk_cached4, dirty = img('fbDirty', 40, 40);
    dirty.tainted = true;
    application.customSkinsCache.fbk_cached4 = dirty;
    const g = frame(S1);
    check('  a badge that is not CORS-clean: WebGL, on the overlay as before (badge, nick, mass), never on the GL layer, equal',
        g.gl && g.d.n === 0 && fgOps(g).join(' ') === 'fbDirty txt txt' && !glOps(g).includes('fbDirty'), g.d.n + ' px ' + fgOps(g).join(' ') + ' | ' + glOps(g).join(' '));
    application.customSkinsCache.fbk_cached4 = keepImg;
}
setSettings({ map: { FBTracking: true }, set: { textAlpha: 0.6 } });
r = frame(S1);
check('FB badge with textAlpha 0.6: labels with the same alpha, drawn once, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
setSettings({ map: { FBTracking: true, transparentSkins: true } });
r = frame(S1);
check('FB badge with transparent skins (jelly on): WebGL, badge with the skin alpha as Canvas2D, equal', r.gl && marks(r, fbImage) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
setSettings({ map: { FBTracking: true, transparentSkins: true, jellyPhisycs: false } });
r = frame(S1);
check('  jelly off (fixed circles keep the old alpha rule): Canvas2D, reason "alpha", equal', !r.gl && why() === 'alpha' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
/* cell contours: the GL batch strokes the bodies itself (glbatch.js compares its pixels with
 * Canvas2D), so they keep WebGL; a renderer without the contour resources stays on Canvas2D */
for (const jelly of [true, false]) {
    setSettings({ map: { cellContours: true, jellyPhisycs: jelly } });
    R.glJellyDrawRings = new Int32Array(8); R.u_cell_contour = {};
    const withRes = R.canUseWebGLScene(LM.cells), whyWith = why();
    delete R.glJellyDrawRings; delete R.u_cell_contour;
    const without = R.canUseWebGLScene(LM.cells), whyWithout = why();
    check('cell contours (jelly ' + (jelly ? 'on' : 'off') + '): WebGL; Canvas2D (reason "contours") only without the contour resources',
        withRes && whyWith === 'webgl' && !without && whyWithout === 'contours', whyWith + ' / ' + whyWithout);
}
/* cell shadows: Canvas2D (reason "cellShadows") while cell.draw's shadow paints something;
 * WebGL when the canvas would paint none (a fully transparent colour, or blur 0 and no offset) */
{
    const cases = [
        [{}, false], [{ cellShadowColor: 'rgba(0,0,0,0)' }, true], [{ cellShadowColor: 'transparent' }, true], [{ cellShadowColor: '#0000' }, true],
        [{ cellShadowColor: '#000000ff' }, false], [{ cellShadowColor: '#00000000' }, true], [{ cellShadowColor: 'hsla(0, 0%, 0%, 0%)' }, true],
        [{ cellShadowColor: 'rgb(0 0 0 / 0)' }, true], [{ cellShadowColor: 'rgba(0,0,0,0.01)' }, false], [{ cellShadowColor: '' }, false], [{ cellShadowColor: 'bogus(0)' }, false],
        [{ cellShadowBlur: 0, cellShadowOffsetX: 0, cellShadowOffsetY: 0 }, true], [{ cellShadowBlur: '0', cellShadowOffsetX: '0', cellShadowOffsetY: 0 }, true],
        [{ cellShadowBlur: 0, cellShadowOffsetX: 0, cellShadowOffsetY: 3 }, false], [{ cellShadowBlur: 0, cellShadowOffsetX: -2, cellShadowOffsetY: 0 }, false],
        [{ cellShadowBlur: 5, cellShadowOffsetX: 0, cellShadowOffsetY: 0 }, false], [{ cellShadowBlur: '', cellShadowOffsetX: 0, cellShadowOffsetY: 0 }, false]
    ];
    const bad = [];
    for (const [set, gl] of cases) {
        setSettings({ map: { showCellShadows: true }, set: set });
        const ok = R.canUseWebGLScene(LM.cells), w = why();
        if (ok !== gl || w !== (gl ? 'webgl' : 'cellShadows')) bad.push(JSON.stringify(set) + ' -> ' + w);
    }
    setSettings({ map: { showCellShadows: false }, set: { cellShadowBlur: 20 } });
    const off = R.canUseWebGLScene(LM.cells), wOff = why();
    check('cell shadows: Canvas2D (reason "cellShadows") only when the canvas shadow paints something (colour alpha > 0 and a blur or offset); off: WebGL',
        bad.length === 0 && off && wOff === 'webgl', bad.join('; ') + ' / off ' + wOff);
}
setSettings({ map: { FBTracking: true } });
LM.gameMode = ':teams';
r = frame(S1);
check('FB badge in agar.io Teams: WebGL (no "teams" reason any more), no badge as in Canvas2D, equal', r.gl && marks(r, fbImage) === 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
LM.gameMode = ':ffa';
application.skins = {};
r = frame(S1);
check('FB friend without a custom skin: no badge in Canvas2D, none in WebGL, labels stay on the GL layer', r.gl && marks(r, fbImage) === 0 && !(R._lmLabelsOnFg && R._lmLabelsOnFg(friend)) && r.d.n === 0, 'gl ' + r.gl);
application.skins = { friend: img('friendSkin', 64, 64) };
/* overlapping cells */
scene([friend, makeCell({ x: 20, y: -80, size: 72, targetNick: 'cover' })]);
r = frame(S1);
check('later bigger cell over the badge: WebGL, it covers the GL badge as in Canvas2D, equal', r.gl && marks(r, fbImage) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
scene([friend, makeCell({ x: 0, y: 105, size: 72, targetNick: 'low' })]);
r = frame(S1);
check('later bigger cell over the cell\'s labels: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
scene([makeCell({ x: 25, y: -45, size: 30, targetNick: 'under' }), friend]);
r = frame(S1);
check('earlier smaller cell under the badge: WebGL, badge and labels above it, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
/* multibox ring: over the badge, under the labels */
strokes.on = true; window.legendmod = LM; LM.multiBoxPlayerExists = true;
setSettings({ map: { FBTracking: true } });
friend.isPlayerCell = true;
scene([friend]);
r = frame(S1);
check('FB badge on an own cell with a multibox ring: WebGL, badge > ring in the GL text pass (labels after them), equal', r.gl && onGl(r, 'fbBadge') && glOps(r).join(' ') === 'fbBadge stroke' && r.d.n === 0,
    'gl ' + r.gl + ' ' + why() + ' ' + glOps(r).join(' ') + ' | ' + fgOps(r).join(' ') + ' ' + r.d.n + ' px');
{
    const bad = frame(Object.assign({}, S1, { fgLate: true }));
    check('  (the comparison sees a ring drawn before the badge)', bad.d.n > 0, bad.d.n + ' px');
    frame(S1);
    friend._webglRendered = true;
    const d9 = new Float32Array(64);
    check('  the GL ring pass leaves that cell out, the text pass gets the same ring instance (_lmMbRingPut)',
        R.buildWebGLMultiboxRingData([LM.cells], d9, 4) === 0 && R._lmMbRingPut(friend, d9, 0) === true && d9[2] === friend.size && d9[0] === friend.x, Array.from(d9.subarray(0, 9)).join(','));
    /* a frame where it has no GL badge: back in the ring pass */
    R._glSkinFrame++;
    check('  a frame where the cell has no GL badge: in the ring pass again', R.buildWebGLMultiboxRingData([LM.cells], d9, 4) === 1);
}
/* the ring is fixed: only on the player you control (player 1 here), its colour, 6% of the radius; old ring settings do nothing */
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
friend._webglRendered = false; friend.isPlayerCell = false; strokes.on = false; LM.multiBoxPlayerExists = false;
/* high DPI, resize */
setSettings({ map: { FBTracking: true } });
const S4 = { W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 10, camY: 5 };
scene([friend]);
r = frame(S4);
check('FB badge at DPR 2, zoom 0.8: WebGL, equal', r.gl && marks(r, fbImage) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
r = frame(Object.assign({}, S4, { W: 230, H: 120 }));
check('FB badge, resized frame: WebGL, badge on the GL layer, equal', r.gl && onGl(r, 'fbBadge') && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
/* WebGL > Canvas2D > WebGL */
const b1 = frame(S1), b2 = frame(Object.assign({}, S1, { glOk: false })), b3 = frame(S1);
check('FB badge, WebGL > Canvas2D > WebGL: every frame equal, badge once', b1.gl && !b2.gl && b3.gl && b1.d.n === 0 && b2.d.n === 0 && b3.d.n === 0 && onGl(b3, 'fbBadge') &&
    glOps(b3).filter((o) => o === 'fbBadge').length === 1, [b1.d.n, b2.d.n, b3.d.n].join('/') + ' ' + glOps(b3).join(' '));

/* ---- FB arrow ---- */

reset(); setSettings({ map: { FBTracking: true } });
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
check('  hat drawn by the GL text pass, labels on the GL layer', onGl(r, 'hat') && !R._lmLabelsOnFg(hatter), glOps(r).join(' ') + ' | ' + fgOps(r).join(' '));
setSettings({ map: { customSkins: false } });
r = frame(S1);
check('special effect with custom skins off: Canvas2D draws none, WebGL none either, equal', r.gl && marks(r, hat) === 0 && r.d.n === 0, 'gl ' + r.gl + ' hat px ' + marks(r, hat) + ' ' + r.d.n + ' px');
setSettings();
scene([hatter, makeCell({ x: 30, y: -60, size: 55, targetNick: 'cover' })]);
r = frame(S1);
check('later bigger cell over the hat: WebGL, it covers the GL hat as in Canvas2D, equal', r.gl && marks(r, hat) > 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
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
check('  order on the GL layer: hat > indicator > (labels) > bubble, no overlay', !r.shown && glOps(r).join(' ') === 'hat teamInd txt', glOps(r).join(' ') + ' | ' + fgOps(r).join(' '));
hatter.size = 50;
/* an effect that fades with save / globalAlpha / restore (Hero1, its alpha from the frame clock):
 * the mark context keeps the alpha stack as Canvas2D does */
reset();
{
    window.iconSpecialSkinEffectsHero1 = img('hero1', 64, 64);
    SEP.hero = 'Hero1';
    R._frameSeconds = 12;
    const hero = makeCell({ x: 0, y: 20, size: 55, targetNick: 'hero' });
    scene([hero, makeCell({ x: -40, y: -70, size: 60, targetNick: 'cover' })]);
    const g = frame(S1);
    check('Hero1 (alpha 0.4 inside save / restore) under a later cell: WebGL, same alpha as Canvas2D, labels after it at full alpha, equal',
        g.gl && onGl(g, 'hero1') && marks(g, window.iconSpecialSkinEffectsHero1) > 0 && g.d.n === 0 && R._lmMarkCtx()._sn === 0, 'gl ' + g.gl + ' onGl ' + onGl(g, 'hero1') + ' marks ' + marks(g, window.iconSpecialSkinEffectsHero1) + ' sn ' + R._lmMarkCtx()._sn + ' ' + glOps(g).join(' ') + ' ' + why() + ' ' + g.d.n + ' px, max ' + g.d.max.toFixed(3));
    delete SEP.hero;
}
/* Gladiator: its helmet is drawn with a hue-rotate canvas filter the GL text pass does not
 * have, so it keeps the overlay (and a later cell over it keeps the frame on Canvas2D) */
reset();
{
    SEP.glad = 'Gladiator';
    const glad = makeCell({ x: 0, y: 20, size: 55, targetNick: 'glad' });
    scene([glad]);
    let g = frame(S1);
    check('Gladiator: WebGL, helmet on the overlay, then the nick and mass, equal', g.gl && g.shown && fgOps(g).join(' ') === 'gladiator txt txt' && !glOps(g).includes('gladiator') && g.d.n === 0,
        'gl ' + g.gl + ' ' + fgOps(g).join(' ') + ' | ' + glOps(g).join(' ') + ' ' + g.d.n + ' px');
    scene([glad, makeCell({ x: 0, y: -60, size: 60, targetNick: 'cover' })]);
    g = frame(S1);
    check('  a later cell over it: Canvas2D (coveredEffect), equal', !g.gl && why() === 'coveredEffect' && g.d.n === 0, 'gl ' + g.gl + ' ' + why() + ' ' + g.d.n + ' px');
    /* a later cell's hat reaching that overlay helmet: the hat goes on the overlay after it
     * (above it, as in Canvas2D) instead of the GL layer under the overlay */
    SEP.later = 'Hat';
    const later = makeCell({ x: 300, y: 20, size: 70, targetNick: 'later' });
    scene([glad, later]);
    g = frame(S1);
    check('  a later cell whose hat reaches it: WebGL, the hat on the overlay after the helmet, equal', g.gl && fgOps(g).join(' ') === 'gladiator txt txt hat txt txt' && R._lmLabelsOnFg(later) && g.d.n === 0,
        'gl ' + g.gl + ' ' + why() + ' ' + fgOps(g).join(' ') + ' ' + g.d.n + ' px');
    delete SEP.glad;
    g = frame(S1);
    check('  without the helmet: the hat on the GL layer again, equal', g.gl && glOps(g).includes('hat') && !R._lmLabelsOnFg(later) && g.d.n === 0, 'gl ' + g.gl + ' ' + fgOps(g).join(' ') + ' | ' + glOps(g).join(' ') + ' ' + g.d.n + ' px');
    delete SEP.later;
    delete SEP.glad;
}
/* an effect image that is not CORS-clean: never drawn into the text canvas (it would taint it
 * and every later label upload would fail); the effect goes back to the overlay from the next
 * frame on, and the image stays usable for Canvas2D */
reset();
{
    const dirtyHat = img('dirtyHat', 64, 64);
    dirtyHat.tainted = true;
    const keepHat = window.iconSpecialSkinEffectsHat3;
    window.iconSpecialSkinEffectsHat3 = dirtyHat;
    SEP.dirty = 'Hat;Smoke';
    const dc = makeCell({ x: 0, y: 20, size: 55, targetNick: 'dirty' });
    scene([dc]);
    const tc = R._textCanvas;
    const g1 = frame(S1);
    const g2 = frame(S1);
    check('effect image without CORS: not drawn on the GL layer, text canvas not tainted, the image not marked failed',
        !glOps(g1).includes('dirtyHat') && !(tc && tc.tainted) && !dirtyHat._failed, glOps(g1).join(' ') + ' tainted ' + !!(tc && tc.tainted) + ' failed ' + dirtyHat._failed);
    check('  next frame: WebGL, on the overlay as before (hat, nick, mass), equal', g2.gl && fgOps(g2).join(' ') === 'dirtyHat txt txt' && g2.d.n === 0, 'gl ' + g2.gl + ' ' + fgOps(g2).join(' ') + ' ' + g2.d.n + ' px');
    window.iconSpecialSkinEffectsHat3 = keepHat;
    delete SEP.dirty;
}
/* agar.io (and Agar2) Teams draws with WebGL too: the team pie goes on the overlay above the
 * GL cells, as in Expanding Land Teams (the real renderFrame lines and late overlay pass) */
reset();
{
    const pieSrc = frameLines('/* WebGL frame: the cells sit above this canvas, so the pie', 'this.renderingDelay +=');
    LM.gameMode = ':teams';
    R.pieChart = img('pie', 40, 40);
    scene([makeCell({ x: 0, y: 0, size: 50, targetNick: 'a' }), makeCell({ x: 60, y: 30, size: 40, targetNick: 'b' })]);
    const g = frame(S1);
    let onOv = null;
    if (pieSrc) {
        R._lmFrameGL = g.gl;
        onOv = new Function('LM', pieSrc + '\nreturn _lmPieOnOverlay;').call(Object.assign(Object.create(R), { ctx: { save() { }, restore() { }, setTransform() { }, drawImage() { } } }), LM);
        oplog.length = 0;
        runLatePass.call(R, LM, window, onOv, null, null, null, (x) => x);
    }
    check('agar.io Teams: WebGL frame (no "teams" reason), equal; the pie goes on the overlay above the GL layer', g.gl && why() === 'webgl' && g.d.n === 0 && onOv === true &&
        oplog.includes('overlay:draw:pie') && overlay.style.display === 'block', 'gl ' + g.gl + ' ' + why() + ' ' + g.d.n + ' px pie on overlay ' + onOv + ' ' + oplog.join(' '));
    LM.gameMode = ':ffa';
    R.pieChart = null;
    R._lmPieOverlayShown = false;
}

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
    /* (the Gladiator helmet (a canvas filter, overlay only) puts mate's marks and labels on the overlay: boxes for the later cells) */
    reset(); team(['mate']); SEP.mate = 'Gladiator';
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
reset(); team(['mate2']); SEP.hatty = 'Gladiator';
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
    /* the entrance while it fades the world in keeps the overlay (_lmFgHeld) */
    LM._elWorldEntrance = { active: true };
    R._elEntranceAlpha = 0.5;
    r = frame(S1);
    const glRingPx = diff(r.out, frame(Object.assign({}, S1)).out).n;
    check('  join entrance fading in (keeps the overlay): WebGL, the GL scene draws the ring last (over the later cell), no overlay, equal',
        r.gl && why() === 'webgl' && !r.shown && R._lmRingGl && r.d.n === 0 && !r.ops.includes('main:stroke') && !r.ops.includes('overlay:stroke') && r.ops.includes('gl:stroke'),
        'gl ' + r.gl + ' ' + why() + ' shown ' + r.shown + ' ' + r.d.n + ' px ' + r.ops.filter((o) => /stroke/.test(o)).join(' '));
    {
        /* sensitivity: the same frame without the GL ring misses it */
        const keep = R.buildWebGLSelectedRingData;
        R.buildWebGLSelectedRingData = () => 0;
        const bad = frame(S1);
        R.buildWebGLSelectedRingData = keep;
        check('  (the comparison sees a missing ring)', bad.gl && bad.d.n > 0 && glRingPx === 0, bad.d.n + ' px');
    }
    globalThis._elDeathVisual = { active: true };
    LM._elWorldEntrance = null;
    r = frame({ W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: 0 });
    /* the death cinematic is drawn over the overlay later: the ring on the overlay, under it */
    check('  death cinematic, DPR 2, zoom 0.8: WebGL, the ring on the overlay, equal', r.gl && !R._lmRingGl && r.shown && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' shown ' + r.shown + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
    globalThis._elDeathVisual = null;
    LM._elWorldEntrance = { active: true };
    R._elEntranceAlpha = 1;
    r = frame(S1);
    check('  join entrance faded in: WebGL, the ring on the overlay (it turns with the world), equal', r.gl && !R._lmRingGl && r.shown && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    globalThis._elDeathVisual = { active: true };
    r = frame({ W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: 0 });
    check('  join entrance with the death cinematic: the GL ring again (the overlay stays still)', r.gl && R._lmRingGl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    globalThis._elDeathVisual = null;
    R._elEntranceAlpha = 0.5;
    team(['over']);
    r = frame(S1);
    check('  join entrance with a teammate indicator (GL text pass): WebGL, ring over it, equal', r.gl && R._lmRingGl && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    team([]);
    sel.size = 15;
    r = frame(S1);
    check('  join entrance, selected cell smaller than the ring width: WebGL, a full disc as the Canvas2D stroke, equal', r.gl && R._lmRingGl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    sel.size = 60;
    const prog = R.glMbRingProgram;
    R.glMbRingProgram = null;
    r = frame(S1);
    check('  join entrance without the ring program: Canvas2D, reason selRing, equal', !r.gl && why() === 'selRing' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    R.glMbRingProgram = prog;
    LM._elWorldEntrance = null;
    r = frame(S1);
    check('  entrance over: the overlay ring again, no GL ring', r.gl && r.shown && !R._lmRingGl && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    LM.selected = null;
    r = frame(S1);
    check('  no cell selected: WebGL, overlay hidden, equal', r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    LM.selected = 999999;
    r = frame(S1);
    check('  selected id of a cell that is gone: WebGL, no ring, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    LM.selected = null; LM.indexedCells = {};
}
R.drawRings = stubRings; strokes.on = false;

/* ---- seconds merge timer (ogario/mergetimer.js) ----
 * cell.drawMerge draws it after the cell's nick and mass (placed from the nick layout): in a
 * WebGL frame the GL text pass draws it there at the cell's depth (_lmGlMerge), so later cells
 * and labels cover it as in Canvas2D; it was a Canvas2D frame (reason merge) while it was on. */
if (R._lmGlMerge) {
    const mergeOn = (map) => { reset(); setSettings({ map: Object.assign({ mergeTimer: true }, map) }); window.ExternalScripts = true; window.legendmod5 = ms; };
    const own = (o) => makeCell(Object.assign({ targetNick: 'me', isPlayerCell: true }, o));
    const a = own({ x: -50, y: 20, size: 55 }), b = own({ x: 55, y: 25, size: 48 });
    const timers = (cells, t) => { window.playerCellsId = {}; for (const c of cells) window.playerCellsId[c.id] = { mergeTime: t, historyMass: [] }; LM.playerCells = cells.slice(); };
    const mpx = (r, c) => c.mergeCanvas && c.mergeCanvas.txtCanvas ? marked(r.out, c.mergeCanvas.txtCanvas.color) : 0;
    mergeOn(); timers([a, b], 25);
    scene([a, b]);
    r = frame(S1);
    check('merge timer on two own cells: WebGL (was Canvas2D "merge"), drawn by the GL text pass, no overlay, equal',
        r.gl && !r.shown && mpx(r, a) > 0 && mpx(r, b) > 0 && R._lmGlMerged(a) && R._lmGlMerged(b) && r.d.n === 0,
        'gl ' + r.gl + ' (' + why() + ') shown ' + r.shown + ' px ' + mpx(r, a) + '/' + mpx(r, b) + ' ' + r.d.n + ' px');
    r = frame(S1);
    check('  next frame: equal (drawn once, cell.draw leaves it out)', r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    {
        /* sensitivity: without the GL timer the frame misses it */
        const keep = R._lmGlMerge;
        R._lmGlMerge = function (c) { c._lmMgAt = this._glSkinFrame; };
        const bad = frame(S1);
        R._lmGlMerge = keep;
        check('  (the comparison sees a missing timer)', bad.gl && bad.d.n > 0, bad.d.n + ' px');
    }
    window.playerCellsId[a.id].mergeTime = 7;
    r = frame(S1);
    check('  another number (redrawn raster): WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    setSettings({ map: { mergeTimer: true }, set: { textAlpha: 0.6 } });
    r = frame({ W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: 0 });
    check('  textAlpha 0.6, DPR 2, zoom 0.8: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px, max ' + r.d.max.toFixed(3));
    /* a taller view: the timer sits above the nick, or under the centre without names */
    const S2 = { W: 240, H: 260, dpr: 1, zoom: 1, camX: 0, camY: 0 };
    setSettings({ map: { mergeTimer: true, noNames: true } });
    r = frame(S2);
    check('  names off (timer under the centre): WebGL, equal', r.gl && mpx(r, a) > 0 && r.d.n === 0, 'gl ' + r.gl + ' px ' + mpx(r, a) + ' ' + r.d.n + ' px');
    setSettings({ map: { mergeTimer: true, hideMyMass: true } });
    r = frame(S1);
    check('  own mass hidden: no timer in both, WebGL, equal', r.gl && mpx(r, a) === 0 && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    mergeOn(); timers([a], 25);
    r = frame(S1);
    check('  one own cell (nothing to merge): no timer, WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + r.d.n + ' px');
    timers([a, b], 25);
    /* a later bigger cell over the timer of a */
    const big = makeCell({ x: -20, y: -95, size: 70, targetNick: 'big' });
    scene([a, b, big]);
    r = frame(S1);
    check('  a later bigger cell over a timer: WebGL, it covers the GL timer as in Canvas2D, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    /* an earlier cell's hat (on the overlay, above the GL layer) over a's timer only: names off
     * and big mass text put the timer well under a's body; b is drawn elsewhere */
    mergeOn(); setSettings({ map: { mergeTimer: true, noNames: true }, set: { massScale: 9 } }); timers([a, b], 25);
    const S3 = { W: 240, H: 420, dpr: 1, zoom: 1, camX: 0, camY: 0 };
    a.y = -100;
    scene([a]);
    frame(S3);
    /* (Gladiator: an effect that stays on the overlay; the GL text pass draws a hat at its
     * cell's depth under the timer, as Canvas2D) */
    SEP.hatty = 'Gladiator';
    /* the helmet (y - 1.2 r to y - 0.53 r) over the middle of the timer */
    const hatty = makeCell({ x: a.x + 8, y: a.y + a._lmMgDy + a._lmMgH / 2 + 14, size: 16, targetNick: 'hatty' });
    check('  (test layout: the effect box stays clear of the body of a)', hatty.y - 2.5 * 16 * 1.08 - 4 > a.y + a.size * 1.15 + 4, a._lmMgDy + ' ' + a._lmMgH);
    scene([hatty, a]);
    a._lmMgF = undefined;
    r = frame(S3);
    check('  an earlier overlay effect over the timer, its place not known yet: Canvas2D, reason merge, equal', !r.gl && why() === 'merge' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    r = frame(S3);
    check('  next frame (place known): Canvas2D (the effect is under the timer in Canvas2D), reason coveredEffect, equal', !r.gl && why() === 'coveredEffect' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    {
        /* sensitivity: kept on WebGL there, the effect covers the timer */
        const keep = R._lmCellMerge;
        R._lmCellMerge = function (c, n) { c._lmMgOk = this._glSkinFrame; return n; };
        const bad = frame(S3);
        R._lmCellMerge = keep;
        check('  (the comparison sees the effect over the GL timer)', bad.gl && bad.d.n > 0, 'gl ' + bad.gl + ' ' + bad.d.n + ' px');
    }
    hatty.x = a.x + 150;
    r = frame(S3);
    check('  effect away from it: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    /* own mass hidden: no timer is drawn, so its place never becomes known; it needs no box */
    setSettings({ map: { mergeTimer: true, noNames: true, hideMyMass: true }, set: { massScale: 9 } });
    hatty.x = a.x;
    a._lmMgF = undefined;
    frame(S3);
    r = frame(S3);
    check('  own mass hidden, effect where the timer would be: WebGL (no timer, no box), equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    setSettings({ map: { mergeTimer: true, noNames: true }, set: { massScale: 9 } });
    hatty.x = a.x + 150;
    frame(S3);
    a.size = 50;
    hatty.x = a.x;
    r = frame(S3);
    check('  the cell changed size since its timer was placed (a split), effect near: Canvas2D, reason merge, equal', !r.gl && why() === 'merge' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    a.size = 55; a.y = 20;
    delete SEP.hatty;
    /* an own cell with an FB badge the GL text pass draws: badge, labels and timer on the GL layer */
    mergeOn({ FBTracking: true }); timers([a, b], 25);
    application.customSkinsMap = { 'mefacebookskin': 'fbk' }; application.customSkinsCache = { 'fbk_cached4': fbImage };
    application.skins = { me: img('meSkin', 64, 64) };
    scene([a]);
    frame(S1);
    r = frame(S1);
    check('  own cell with an FB badge: WebGL, badge, labels and timer on the GL layer, equal', r.gl && !r.shown && R._lmGlFgDone(a) && R._lmGlMerged(a) && mpx(r, a) > 0 && r.d.n === 0,
        'gl ' + r.gl + ' ' + why() + ' shown ' + r.shown + ' px ' + mpx(r, a) + ' ' + r.d.n + ' px');
    /* a badge that keeps the overlay (not CORS-clean): its labels and its timer go there too */
    const fbDirty = img('fbDirty2', 40, 40);
    fbDirty.tainted = true;
    application.customSkinsCache = { 'fbk_cached4': fbDirty };
    frame(S1);
    r = frame(S1);
    check('  own cell with an FB badge on the overlay: WebGL, its timer on the overlay with its labels, equal', r.gl && r.shown && mpx(r, a) > 0 && !R._lmGlMerged(a) && r.d.n === 0,
        'gl ' + r.gl + ' ' + why() + ' shown ' + r.shown + ' px ' + mpx(r, a) + ' ' + r.d.n + ' px');
    const late = makeCell({ x: a.x, y: a.y + a._lmMgDy - 66, size: 60, targetNick: 'late' });
    scene([a, late]);
    r = frame(S1);
    check('  a later cell over the overlay timer: Canvas2D (the overlay is above it), equal', !r.gl && /^covered/.test(why()) && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    reset(); window.ExternalScripts = false; window.playerCellsId = null; LM.playerCells = [];
}

/* ---- no multibox ring program (it failed to build) ----
 * Canvas2D draws the ring, so only a frame with the ringed cell (the controlled unit) in the GL
 * view stays on Canvas2D, not every frame while multiboxing. */
reset(); strokes.on = true; window.legendmod = LM; LM.multiBoxPlayerExists = true;
{
    const prog = R.glMbRingProgram;
    R.glMbRingProgram = null;
    const me = makeCell({ x: -20, y: 0, size: 60, targetNick: 'me', isPlayerCell: true });
    const other = makeCell({ x: 80, y: 30, size: 40, targetNick: 'zz' });
    scene([other, me]);
    r = frame(S1);
    check('no ring program, the ringed own cell on screen: Canvas2D, reason mbRingProg, ring drawn, equal', !r.gl && why() === 'mbRingProg' && r.ops.includes('main:stroke') && r.d.n === 0,
        'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    me.x = 3000;
    r = frame(S1);
    check('  that cell far outside the view: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    me.x = -20;
    R.glMbRingProgram = prog;
    r = frame(S1);
    check('  with the ring program: WebGL (GL ring pass), equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
}
LM.multiBoxPlayerExists = false; strokes.on = false;

/* ---- marks during the Expanding Land death cinematic and join entrance ----
 * The death cinematic is drawn on the overlay after the frame, over what the cell pass put
 * there, as over the Canvas2D world: marks stay WebGL. The entrance turns and fades the world
 * layers, the overlay with them; while it fades them in (or with the cinematic, which stays
 * still) it keeps the overlay and marks need Canvas2D (reason cinematic). */
reset(); SEP.hatter2 = 'Gladiator';
{
    scene([makeCell({ x: 0, y: 10, size: 50, targetNick: 'hatter2' }), makeCell({ x: -80, y: -40, size: 30, targetNick: 'b' })]);
    globalThis._elDeathVisual = { active: true };
    r = frame(S1);
    check('death cinematic, helmet on the overlay: WebGL, helmet drawn there, equal', r.gl && r.shown && r.ops.includes('overlay:draw:gladiator') && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') shown ' + r.shown + ' ' + r.d.n + ' px');
    globalThis._elDeathVisual = null;
    LM._elWorldEntrance = { active: true };
    R._elEntranceAlpha = 1;
    r = frame(S1);
    check('join entrance faded in, helmet: WebGL, on the overlay, equal', r.gl && r.shown && r.ops.includes('overlay:draw:gladiator') && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    R._elEntranceAlpha = 0.4;
    r = frame(S1);
    check('join entrance fading in, helmet: Canvas2D, reason cinematic, equal', !r.gl && why() === 'cinematic' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    R._elEntranceAlpha = 1;
    globalThis._elDeathVisual = { active: true };
    r = frame(S1);
    check('join entrance with the death cinematic, helmet: Canvas2D, reason cinematic, equal', !r.gl && why() === 'cinematic' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    globalThis._elDeathVisual = null;
    LM._elWorldEntrance = null;
    r = frame(S1);
    check('entrance over: WebGL, equal', r.gl && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    delete SEP.hatter2;
    /* the death cinematic shows the overlay it is drawn on: the overlay starts hidden and a
     * frame without overlay marks hid it, so the cinematic was not seen (or only on frames
     * with marks) */
    {
        scene([makeCell({ x: 0, y: 10, size: 50, targetNick: 'plain' })]);
        r = frame(S1);
        const hidden0 = !r.shown;
        const dv = { active: true, startTime: Date.now(), duration: 60000, pieces: [], particles: [], targetX: 0, targetY: 0 };
        const late = () => runLatePass.call(R, LM, window, false, dv, () => null, () => { }, (x) => x);
        globalThis._elDeathVisual = dv;
        frame(S1); late();
        const shown1 = overlay.style.display === 'block';
        /* the next frame without marks keeps it shown for the cinematic */
        frame(S1);
        const kept = overlay.style.display === 'block';
        late();
        check('death cinematic without overlay marks: the overlay it is drawn on is shown, also the next frame',
            hidden0 && shown1 && kept && overlay.style.display === 'block', 'hidden before ' + hidden0 + ' shown ' + shown1 + ' kept ' + kept);
        dv.active = false;
        globalThis._elDeathVisual = null;
        r = frame(S1);
        check('  cinematic over: the overlay hidden again', !r.shown);
    }
    /* the overlay's CSS in renderFrame: with the world layers during the entrance, still with the cinematic */
    const cssA = src.indexOf('var _elOverlayWorld =');
    const cssB = src.indexOf('} /* end of the layer styles (_elLayersIdle) */', cssA);
    check('overlay layer style lines found', cssA > 0 && cssB > cssA);
    if (cssA > 0 && cssB > cssA) {
        const css = new Function('_elEntranceRunning', '_elDeathVisual', '_worldCssTransform', '_shakeCssTransform', '_worldOpacity', '_elTransformOrigin', src.slice(cssA, cssB));
        const o = { overlayCanvas: { style: { transform: '', transformOrigin: '', opacity: '1' } } }, st = o.overlayCanvas.style;
        css.call(o, true, null, 'translate3d(1px, 0px, 0) rotate(0.1rad) scale(0.9)', 'translate3d(1px, 0px, 0)', '0.5', '10px 20px');
        check('  entrance: the overlay turns and fades with the world layers', st.transform === 'translate3d(1px, 0px, 0) rotate(0.1rad) scale(0.9)' && st.transformOrigin === '10px 20px' && st.opacity === '0.5', JSON.stringify(st));
        css.call(o, true, { active: true }, 'rotate(0.1rad) scale(0.9)', '', '0.5', '10px 20px');
        check('  entrance with the death cinematic: only the shake, opaque', st.transform === '' && st.opacity === '1', JSON.stringify(st));
        css.call(o, false, null, 'translate3d(2px, 0px, 0)', 'translate3d(2px, 0px, 0)', '1', '10px 20px');
        check('  no entrance: the shake, opaque', st.transform === 'translate3d(2px, 0px, 0)' && st.opacity === '1', JSON.stringify(st));
    }
}

/* ---- the "Player 1 & 2" glow (multiBoxShadow) ----
 * A glowing own cell is drawn whole by cell.draw on the overlay in the cell order (the GL batch
 * leaves it out); a later cell reaching its glow keeps the frame on Canvas2D (mbShadow). */
reset();
{
    const keepApp = window.application;
    globalThis.profiles = [{ color: '#ff00ff' }, { color: '#00ffff' }];
    window.application = { selectedProfile: 0, mbSlots: [0, 1] };
    setSettings({ map: { multiBoxShadow: true } });
    LM.playerCellsMulti = [{}];
    const me = makeCell({ x: -40, y: 0, size: 40, targetNick: 'me', isPlayerCell: true });
    const under = makeCell({ x: 5, y: 30, size: 20, targetNick: 'u' });
    const far = makeCell({ x: 90, y: -60, size: 30, targetNick: 'far' });
    scene([under, far, me]);
    r = frame(S1);
    const glowPx = marked(r.out, glowCol);
    check('glow: WebGL frame, the glowing cell on the overlay over the earlier cell, equal', r.gl && r.shown && glowPx > 0 && r.d.n === 0,
        'gl ' + r.gl + ' (' + why() + ') shown ' + r.shown + ' glow px ' + glowPx + ' ' + r.d.n + ' px');
    {
        /* sensitivity: drawn by the GL batch (no glow, under nothing) the frame differs */
        const keep = R._lmCellGlow;
        R._lmCellGlow = function (cell, n) { return n; };
        const bad = frame(S1);
        R._lmCellGlow = keep;
        check('  (the comparison sees a glowing cell left to the GL batch)', bad.gl && bad.d.n > 0, bad.d.n + ' px');
    }
    r = frame({ W: 200, H: 140, dpr: 2, zoom: 0.8, camX: 0, camY: 0 });
    check('  DPR 2, zoom 0.8: WebGL, equal', r.gl && r.shown && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    /* a later bigger cell over the glow only (not the body) */
    /* (no nick or mass on it: only its body can reach the glow) */
    const meS = makeCell({ x: -40, y: 0, size: 30, targetNick: 'me', isPlayerCell: true });
    const big = makeCell({ x: 55, y: 20, size: 38, targetNick: '' });
    scene([under, meS, big]);
    r = frame(S1);
    check('later bigger cell over the glow: Canvas2D, reason mbShadow, equal', !r.gl && why() === 'mbShadow' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
    /* two glowing players overlapping: both on the overlay, in the cell order */
    const unit = makeCell({ x: 20, y: 10, size: 45, targetNick: 'unit', isPlayerCellMulti: true, spectator: 1 });
    scene([under, me, unit]);
    r = frame(S1);
    check('two glowing players overlapping: WebGL, equal', r.gl && r.shown && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    /* after an overlay mark of an earlier cell: over it, as in Canvas2D */
    SEP.u = 'Gladiator';
    scene([under, me]);
    r = frame(S1);
    check('glowing cell over an earlier helmet (overlay mark): WebGL, the helmet on the overlay under the glow, equal', r.gl && r.ops.includes('overlay:draw:gladiator') && r.d.n === 0, 'gl ' + r.gl + ' (' + why() + ') ' + r.d.n + ' px');
    delete SEP.u;
    /* far off screen: nothing of it reaches the screen, no overlay for it */
    const away = makeCell({ x: 900, y: 0, size: 40, targetNick: 'me2', isPlayerCell: true });
    scene([under, away]);
    r = frame(S1);
    check('glowing cell far off screen: WebGL, no overlay, equal', r.gl && !r.shown && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    /* far off screen, split, with the merge timer: the cell pass never draws it, so its timer
     * place is never known; that must not keep every frame on Canvas2D (merge) */
    {
        setSettings({ map: { multiBoxShadow: true, mergeTimer: true } });
        window.ExternalScripts = true; window.legendmod5 = ms;
        const s1 = makeCell({ x: 900, y: 0, size: 55, targetNick: 'me2', isPlayerCell: true });
        const s2 = makeCell({ x: 1000, y: 40, size: 50, targetNick: 'me2', isPlayerCell: true });
        window.playerCellsId = { [s1.id]: { mergeTime: 25, historyMass: [] }, [s2.id]: { mergeTime: 25, historyMass: [] } };
        LM.playerCells = [s1, s2];
        scene([under, s1, s2]);
        r = frame(S1);
        const r2 = frame(S1);
        check('glowing split cells far off screen with the merge timer: WebGL, no overlay, equal', r.gl && r2.gl && !r2.shown && r2.d.n === 0,
            'gl ' + r.gl + '/' + r2.gl + ' (' + why() + ') shown ' + r2.shown + ' ' + r2.d.n + ' px');
        /* on screen the timer still gets its box: a later cell over the timer only (not the
         * glow of the body or labels) gives Canvas2D */
        const o1 = makeCell({ x: -40, y: 0, size: 55, targetNick: 'me2', isPlayerCell: true });
        const o2 = makeCell({ x: 60, y: 20, size: 50, targetNick: 'me2', isPlayerCell: true });
        window.playerCellsId = { [o1.id]: { mergeTime: 25, historyMass: [] }, [o2.id]: { mergeTime: 25, historyMass: [] } };
        LM.playerCells = [o1, o2];
        scene([under, o1, o2]);
        frame(S1);
        r = frame(S1);
        check('  on screen with the merge timer: WebGL, both on the overlay, equal', r.gl && r.shown && r.d.n === 0 && o1._lmMgF > 0,
            'gl ' + r.gl + ' (' + why() + ') shown ' + r.shown + ' ' + r.d.n + ' px');
        /* (the timer box is asked for: an unknown timer place gives merge) */
        o1._lmMgF = undefined;
        r = frame(S1);
        check('  on screen, timer place unknown: Canvas2D, reason merge, equal', !r.gl && why() === 'merge' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');
        window.ExternalScripts = false; window.playerCellsId = null; LM.playerCells = [];
        setSettings({ map: { multiBoxShadow: true } });
    }
    setSettings();
    scene([under, far, me]);
    r = frame(S1);
    check('glow off: WebGL, the cell in the GL batch, no overlay, equal', r.gl && !r.shown && me._lmGlowFg !== R._glSkinFrame && r.d.n === 0, 'gl ' + r.gl + ' shown ' + r.shown + ' ' + r.d.n + ' px');
    LM.playerCellsMulti = [];
    window.application = keepApp;
    delete globalThis.profiles;
}

/* ---- the real cell batch (stub WebGL context) leaves out the glowing cells of this frame ---- */
for (const jelly of [false, true]) {
    const LMs = { cells: [], playerCells: [], playerCellsMulti: [], play: false, showCustomSkins: true, gameMode: ':ffa' };
    const app = { gameMode: ':ffa', customSkinsCache: {}, customSkinsMap: {}, customSkinKey() { return null; }, loadSkin() { }, _lmTouchSkin() { }, _lmSkinCacheKey(u) { return u; },
        setVirusColor() { return '#33ff33'; }, setVirusStrokeColor() { return '#33ff33'; }, playSound() { } };
    const Db = new Function('return ' + F.defaults)();
    const envB = { window: { legendmod: LMs, application: app }, LM: LMs, application: app, defaultSettings: Db.defaultSettings,
        defaultmapsettings: Object.assign(Db.defaultmapsettings, { jellyPhisycs: jelly, customSkins: false }), ogarcopythelb: { color: '#01d9cc' }, ogario: { viewScale: 1 } };
    const B = new Function('return (' + F.factory + ')')()(envB);
    /* any GL call is a no-op, constants are 1; the buffers initWebGL makes */
    B.gl = new Proxy({}, { get: (t, k) => typeof k === 'string' && /^[A-Z0-9_]+$/.test(k) ? 1 : function () { return {}; } });
    Object.assign(B, { glCellProgram: {}, glCellInstanceData: new Float32Array(64 * 32), glCellMaxInstances: 64, glJellyStride: 11, glJellyStrokeStride: 7,
        glJellyVertexCapacity: 4096, glJellyVertexData: new Float32Array(4096 * 11), glJellyStrokeCapacity: 4096, glJellyStrokeData: new Float32Array(4096 * 7),
        glJellyIndexCapacity: 16384, glJellyIndexData: new Uint32Array(16384), glJellyDrawCapacity: 64, glJellyProgram: {}, glJellyStrokeProgram: {},
        glJellyVAO: {}, glJellyVBO: {}, glJellyStrokeVAO: {}, glJellyStrokeVBO: {}, glSkinArray: {}, glSkinMap: {},
        _glSkinLayers: { max: 128, next: 0, used: new Array(128).fill(-1), owner: new Array(128).fill(null) },
        scale: 1, camX: 0, camY: 0, canvasWidth: 1920, canvasHeight: 1080, _glSkinFrame: 7 });
    /* the per-cell draw lists of the jelly batch, by their names in the source */
    for (const m of src.matchAll(/this\.(glJelly\w+) =\s*new Int32Array\(\s*this\.glJellyDrawCapacity/g)) B[m[1]] = new Int32Array(64);
    const pts = (n, rr) => Array.from({ length: n }, (_, i) => ({ x: Math.cos(i / n * 2 * Math.PI) * rr, y: Math.sin(i / n * 2 * Math.PI) * rr }));
    const mk = (o) => Object.assign({ x: 0, y: 0, size: 60, color: '#3388ff', targetNick: 'a', skin: '', isPlayerCell: false, isPlayerCellMulti: false,
        isFood: false, isEjected: false, isVirus: false, removed: false, invisible: false, isInView() { return true; }, points: pts(24, 60), maxPointRad: 60 }, o);
    /* glowing this frame (7), in an earlier frame (6) */
    const cs = [mk({}), mk({ isPlayerCell: true, _lmGlowFg: 7 }), mk({ isPlayerCell: true, _lmGlowFg: 6 })];
    let okB;
    try { okB = B.drawWebGLCellBatch(cs) === true; } catch (e) { okB = false; console.log('     ' + e.message); }
    check('cell batch, jelly ' + (jelly ? 'on' : 'off') + ': the glowing cell of this frame left out, the others drawn', okB && cs[0]._webglRendered === true && !cs[1]._webglRendered && cs[2]._webglRendered === true,
        okB + ' ' + cs.map((c) => c._webglRendered).join());
}

/* ---- no marks: no clear, overlay hidden ---- */
reset(); SEP.mate = 'Gladiator';
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
SEP.talk = 'Gladiator';
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
/* the special effect (hat) and the FB friend badge in both branches of the real cell.draw follow
 * the same switch: custom skins (the Canvas2D branch drew them with only Vanilla skins on, WebGL
 * not, so they came and went as frames changed renderer) */
{
    const hatImg = window.iconSpecialSkinEffectsHat3;
    let ok = true, info = '';
    for (const cs of [true, false]) {
        const n = [], f = [];
        for (const gl of [false, true]) {
            reset(); SEP.hatty = 'Hat';
            setSettings({ map: { customSkins: cs, vanillaSkins: true, ownVanillaSkin: true, FBTracking: true } });
            application.customSkinsMap = { 'hattyfacebookskin': 'fbk' }; application.customSkinsCache = { 'fbk_cached4': fbImage };
            application.skins = { hatty: img('hattySkin', 64, 64) };
            const c = makeCell({ x: 5, y: 8, size: 60, targetNick: 'hatty' });
            LM.cells = [c];
            drawReal(c, gl, 1);
            n.push(recCtx.calls.filter((k) => k.im === hatImg).length);
            f.push(recCtx.calls.filter((k) => k.im === fbImage).length);
        }
        info += ' [custom skins ' + cs + ': hat Canvas2D ' + n[0] + ' / WebGL ' + n[1] + ', badge ' + f[0] + ' / ' + f[1] + ']';
        if (n[0] !== n[1] || n[0] !== (cs ? 1 : 0) || f[0] !== f[1] || f[0] !== (cs ? 1 : 0)) ok = false;
    }
    check('real cell.draw: hat and FB badge in both branches with custom skins on, in neither with them off (vanilla skins on)', ok, info);
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
/* (a later cell over mate's Gladiator helmet, an overlay mark) */
SEP.mate = 'Gladiator';
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

/* ---- Dying Light: no WebGL fallback of its own (the BODY_FX gate is gone) ---- */
reset();
scene([makeCell({ x: 0, y: 0, size: 70, targetNick: 'zed' })]);
globalThis.dyinglight1load = 'yes';
r = frame(S1);
globalThis.dyinglight1load = 'no';
check('Dying Light saved on: the frame stays WebGL (no "bodyFx" Canvas2D frame), equal', r.gl && why() !== 'bodyFx' && r.d.n === 0, 'gl ' + r.gl + ' ' + why() + ' ' + r.d.n + ' px');

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
    S.FBTracking = false;
    const run = (ct, bubble) => {
        calls.length = 0; S.cursorTracking = ct; S.bubbleCursorTracker = bubble;
        R.drawPostCellOverlays(R.ctx); R.drawMiscRings();
        return calls.join(',') || 'nothing';
    };
    check('Cursor tracking off, line look: nothing', run(false, false) === 'nothing', run(false, false));
    check('Cursor tracking on, line look: the line only', run(true, false) === 'line', run(true, false));
    check('Cursor tracking on, bubble look: the bubble only', run(true, true) === 'bubble', run(true, true));
    check('Cursor tracking off, bubble look chosen: nothing (the bubble is a look of Cursor tracking)', run(false, true) === 'nothing', run(false, true));
    /* a multibox unit selected: the bubble follows its own cells (it took the main player's) */
    let bubbleCells = null;
    R.drawBCursorTracking = (c, cells) => { bubbleCells = cells; };
    env.window.legendmod.playerCellsMulti = [{ x: 5, y: 5, size: 40, spectator: 2 }, { x: 9, y: 9, size: 40, spectator: 3 }];
    /* each unit's own-cell index (lmUnitCellsInto reads the selected unit's own list) */
    const ownOf = (n) => env.window.legendmod.playerCellsMulti.filter((c) => c.spectator === n);
    globalThis.getActiveSpect = (n) => (n === 2 || n === 3) ? { number: n, player: true, getOwnPlayerCells: () => ownOf(n) } : null;
    env.window.multiboxPlayerEnabled = 2;
    S.cursorTracking = true; S.bubbleCursorTracker = true;
    R.drawMiscRings();
    check('bubble look, unit 2 selected: drawn on unit 2\'s own cells only', !!bubbleCells && bubbleCells.length === 1 && bubbleCells[0].spectator === 2,
        bubbleCells && bubbleCells.map((x) => x.spectator).join('+'));
    env.window.multiboxPlayerEnabled = 0;
    R.drawMiscRings();
    check('bubble look, main player selected: drawn on the main player\'s cells', bubbleCells === LM.playerCells);
    delete env.window.legendmod.playerCellsMulti;
    delete globalThis.getActiveSpect;
    S.cursorTracking = false; S.bubbleCursorTracker = false;
}
}

/* the cell mass text always shows the current mass ("Optimized mass (+/-2%)", which drew it
 * again only after a 2% change, is gone); Mass format 12.3k -> exact shows the exact number at once */
if (haveMethods.includes('setMass')) {
    reset();
    ms.massFormat = 1; ms.hudRelativeMass = false;
    const c = makeCell({ size: 400, shortMass: false });
    c.setMass(400); c.drawMass(main.getContext());
    c.setMass(402); c.drawMass(main.getContext());
    check('mass text: a 1% change is drawn at once', c.redrawMass === true && c.massTxt === '1616' && c.massCanvas.txt === '1616', c.redrawMass + ' ' + c.massTxt + ' ' + (c.massCanvas && c.massCanvas.txt));
    const k = makeCell({ size: 400, shortMass: true });
    k.setMass(400);
    const kTxt = k.massTxt;
    k.shortMass = false;
    k.setMass(401);
    check('mass text: 12.3k -> exact redraws the exact number at once', kTxt === '1.6k' && k.redrawMass === true && k.massTxt === '1608', kTxt + ' ' + k.redrawMass + ' ' + k.massTxt);
}

/* section: Dying Light in the world renderers with the real code: the world skin key every skin
 * path uses (lmWorldSkinKey: the cell's own key, else the Dying Light skin of an eligible cell
 * while it is on, lmDlSync once per frame) and the map background (drawCustomBackgrounds with
 * the Dying Light scene: the Theme's setting unchanged, the two cross-fading, save / restore) */
if (src.includes('\nfunction lmWorldSkinKey(')) {
const F = rendererFactory(src);
const D = new Function('return ' + F.defaults)();
const LMd = { cells: [], playerCells: [], playerCellsMulti: [], gameMode: ':ffa', showCustomSkins: true, mapMinX: -500, mapMinY: -500, mapMaxX: 500, mapMaxY: 500 };
const loads = [];
const OWN = 'https://own.test/a.png', PEND = 'https://own.test/pending.png', ZOMBIE = 'https://www.legendmod.ml/banners/icondyinglightzombie.png';
const app = { customSkinsCache: { [OWN]: { width: 9 } }, _lmSkinCacheKey(u) { return u; }, loadSkin(c, u) { loads.push(u); } };
const win = { legendmod: LMd, application: app };
const env = { window: win, LM: LMd, application: app, defaultSettings: D.defaultSettings, defaultmapsettings: D.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
const R = new Function('return (' + F.factory.replace(/return R;\n\}$/, 'R.__dl = { sync: lmDlSync, key: lmWorldSkinKey }; return R;\n}') + ')')()(env);
const X = R.__dl;
const cell = (o) => Object.assign({ x: 0, y: 0, size: 60, targetNick: 'enemy', isPlayerCell: false, isPlayerCellMulti: false, isFood: false, isEjected: false, isVirus: false, removed: false, invisible: false }, o);
const enemy = cell({});
let asked = 0;
const dl = { on: false, isEnabled() { return this.on; }, getFallbackSkinKey() { asked++; return ZOMBIE; }, getBackground() { return this.bg || null; } };

/* off: never enabled, and LMDyingLight there but off */
check('Dying Light off: lmDlSync says off', X.sync() === false);
check('  a cell keeps its own key, no key stays none', X.key(enemy, OWN) === OWN && X.key(enemy, null) === null && X.key(enemy, PEND) === PEND);
win.LMDyingLight = dl;
check('  LMDyingLight off: the same keys, its skin never asked', X.sync() === false && X.key(enemy, null) === null && X.key(enemy, OWN) === OWN && asked === 0 && loads.length === 0, asked + ' ' + loads.length);

/* on */
dl.on = true;
check('Dying Light on: lmDlSync says on', X.sync() === true);
check('  another player without a skin gets the Dying Light skin, loaded once through loadSkin', X.key(enemy, null) === ZOMBIE && loads.length === 1 && loads[0] === ZOMBIE, loads.join());
app.customSkinsCache[ZOMBIE] = { width: 9 };
X.key(enemy, null);
check('  ... and not loaded again once in the skin cache', loads.length === 1, loads.length);
check('  the own skin wins', X.key(enemy, OWN) === OWN);
check('  a skin still loading (or failed) wins too: no Dying Light skin over it', X.key(enemy, PEND) === PEND);
const no = {
    'the own cell': cell({ isPlayerCell: true }), 'a multibox unit cell': cell({ isPlayerCellMulti: true }), food: cell({ isFood: true }),
    'ejected mass': cell({ isEjected: true }), virus: cell({ isVirus: true }), 'a removed cell': cell({ removed: true }),
    'a hidden cell': cell({ invisible: true }), 'a copy hidden behind another connection': cell({ _lmMbPosDup: true }),
    'mass 9': cell({ size: 30 }), 'no name': cell({ targetNick: '' }), 'a blank name': cell({ targetNick: '   ' })
};
const wrong = Object.keys(no).filter((k) => X.key(no[k], null) !== null);
check('  none for ' + Object.keys(no).join(', '), wrong.length === 0, wrong.join());
LMd.gameMode = ':teams';
check('  none in Teams (no skins there)', X.key(enemy, null) === null);
LMd.gameMode = ':ffa';

/* off again: as before */
dl.on = false;
asked = 0;
check('Dying Light off again: the same keys as before it was on', X.sync() === false && X.key(enemy, null) === null && X.key(enemy, OWN) === OWN && asked === 0);
/* the old expansion script only: its saved switch, its one zombie icon */
delete win.LMDyingLight;
globalThis.dyinglight1load = 'yes';
check('old expansion script (no LMDyingLight), saved on: its zombie icon', X.sync() === true && X.key(enemy, null) === D.defaultSettings.commanderImageDyingLight && X.key(enemy, OWN) === OWN);
globalThis.dyinglight1load = 'no';
check('  saved off: none', X.sync() === false && X.key(enemy, null) === null);

/* the map background */
const pic = (name, ok) => ({ name: name, naturalWidth: ok ? 64 : 0, naturalHeight: ok ? 64 : 0, width: ok ? 64 : 0, height: ok ? 64 : 0 });
function bgCtx() {
    return {
        globalAlpha: 1, depth: 0, draws: [], save() { this.depth++; }, restore() { this.depth--; this.globalAlpha = 1; },
        drawImage(im, x, y, w, h) { if (im.boom) throw new Error('boom'); this.draws.push(im.name + '@' + Math.round(this.globalAlpha * 100) / 100 + ' ' + [x, y, w, h].join(',')); }
    };
}
const keepLm = globalThis.legendmod, keepImage = globalThis.Image;
globalThis.legendmod = LMd;
/* an image that never loads by itself (the test sets its size) */
globalThis.Image = function () { };
try {
    const ds = env.defaultSettings;
    ds.customBackground = 'https://bg.test/theme.png'; ds.backgroundAlpha = 0.8;
    win.LMDyingLight = dl; dl.on = false; X.sync();
    let ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    const themePic = LMd.customMidPic;
    check('background, Dying Light off: the Theme image is the one loaded', !!themePic && themePic._src === ds.customBackground);
    Object.assign(themePic, pic('theme', true));
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('  drawn over the map at the Theme alpha, save / restore balanced', ctx.draws.join('|') === 'theme@0.8 -500,-500,1000,1000' && ctx.depth === 0, ctx.draws.join('|'));
    const night = pic('night', false);
    dl.on = true; dl.bg = { img: night, alpha: 0.5 }; X.sync();
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('Dying Light on, its scene not loaded yet: the Theme image stays', ctx.draws.join('|') === 'theme@0.8 -500,-500,1000,1000' && LMd.customMidPic === themePic, ctx.draws.join('|'));
    Object.assign(night, pic('night', true));
    R.drawCustomBackgrounds(bgCtx());
    LMd._lmMidFadeAt -= 1500;
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    const half = ctx.draws.map((d) => d.split(' ')[0]);
    check('  scene loaded: the two cross-fade (old under new, only these two)', half.length === 2 && /^theme@0\.[34]/.test(half[0]) && /^night@0\.2[45]/.test(half[1]) && ctx.depth === 0, ctx.draws.join('|'));
    LMd._lmMidFadeAt -= 5000;
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('  after the fade: only the scene, at its alpha; the Theme setting unchanged', ctx.draws.join('|') === 'night@0.5 -500,-500,1000,1000' && ds.customBackground === 'https://bg.test/theme.png' && !LMd._lmMidPicNext, ctx.draws.join('|'));
    const bad = pic('bad', false); bad._failed = true;
    dl.bg = { img: bad };
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('  a next scene that failed is skipped: the shown one stays', ctx.draws.join('|') === 'night@0.8 -500,-500,1000,1000', ctx.draws.join('|'));
    const boom = pic('boom', true); boom.boom = true;
    dl.bg = { img: boom, alpha: 1 };
    LMd.customMidPic = boom; LMd._lmMidPicNext = null;
    ctx = bgCtx();
    let threw = false;
    try { R.drawCustomBackgrounds(ctx); } catch (e) { threw = true; }
    check('  a draw that throws: no error, the context restored', !threw && ctx.depth === 0 && ctx.globalAlpha === 1, threw + ' ' + ctx.depth);
    dl.bg = { img: night, alpha: 0.5 }; LMd.customMidPic = night; LMd._lmMidDl = true;
    R.drawCustomBackgrounds(bgCtx());
    dl.on = false; X.sync();
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    const back = LMd._lmMidPicNext;
    check('Dying Light off: the Theme image comes back (loaded again, the scene shown until then)', !!back && back._src === ds.customBackground && ctx.draws.join('|') === 'night@0.5 -500,-500,1000,1000', ctx.draws.join('|'));
    Object.assign(back, pic('theme2', true));
    R.drawCustomBackgrounds(bgCtx());
    LMd._lmMidFadeAt -= 5000;
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('  after its fade: the Theme image alone at the Theme alpha, as before Dying Light', ctx.draws.join('|') === 'theme2@0.8 -500,-500,1000,1000' && LMd.customMidPic === back && !LMd._lmMidDl && !LMd._lmMidPicNext, ctx.draws.join('|'));
    LMd.customMidPic = night; LMd._lmMidDl = true; LMd._lmMidPicNext = null; ds.customBackground = 'https://bg.test/broken.png';
    R.drawCustomBackgrounds(bgCtx());
    LMd._lmMidPicNext._failed = true;
    ctx = bgCtx();
    R.drawCustomBackgrounds(ctx);
    check('  the Theme image failing to come back: nothing drawn, as without Dying Light (no scene left over)', ctx.draws.length === 0 && !LMd._lmMidDl && LMd.customMidPic && LMd.customMidPic._src === ds.customBackground, ctx.draws.join('|'));
} finally {
    globalThis.legendmod = keepLm;
    globalThis.Image = keepImage;
    delete win.LMDyingLight;
}
}

console.log(failed ? failed + ' overlay check(s) FAILED' : 'overlayfx ok');
process.exit(failed ? 1 : 0);
