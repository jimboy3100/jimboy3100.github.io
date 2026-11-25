/* WebGL batching checks in Node (no browser): the index lists of the jelly batch
 * (lmJellyFanIndices / lmJellyBandIndices: the same triangles, in the same order, as one
 * TRIANGLE_FAN per body and six band vertices per edge), and the real drawWebGLCellBatch jelly
 * path from ogario/ogario.v4.js run against a recording stub WebGL2 context over many frames of
 * a changing world (points added and removed, cells hidden, shown, added and removed, skins and
 * viruses with bands, buffer growth, a batch stopped halfway): what the stub GPU holds after
 * each frame must draw exactly every visible body, in order, with no stale indices.
 * Also the label atlas: its shelf allocator, and the renderer's text methods with it (slots, mass
 * drawn again in place, frees, a full atlas, draw order with a label that keeps its own texture).
 * The pixel comparison with real WebGL is developers/tests/glbatch.js.
 * node developers/tests/renderbatch.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { rendererFactory } = require('./glbatch.js');
const { makeRng } = require('./bench-dense.js');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

const F = rendererFactory(src);
const defaults = new Function('return ' + F.defaults)();

/* ---- the index helpers on their own ---- */
const helpers = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/var R = [\s\S]*$/, '') +
    'return { fan: lmJellyFanIndices, band: lmJellyBandIndices };')({});
{
    const n = 7, c = 10, out = new Uint32Array(3 * n + 5);
    const end = helpers.fan(out, 5, c, n);
    /* TRIANGLE_FAN over [c, c+1 .. c+n, c+1]: triangle k = (v0, v(k+1), v(k+2)) */
    const fan = [c]; for (let i = 0; i < n; i++) fan.push(c + 1 + i); fan.push(c + 1);
    const want = []; for (let k = 0; k + 2 < fan.length; k++) want.push(fan[0], fan[k + 1], fan[k + 2]);
    check('fan indices: the triangles of one TRIANGLE_FAN with the first point repeated, same order', end === 5 + 3 * n && Array.from(out.slice(5, end)).join() === want.join());
    const bo = new Uint32Array(6 * n);
    helpers.band(bo, 0, 100, n);
    const bw = [];
    for (let e = 0; e < n; e++) {
        const j = (e + 1) % n, i0 = 100 + 2 * e, o0 = i0 + 1, i1 = 100 + 2 * j, o1 = i1 + 1;
        bw.push(i0, o0, o1, i0, o1, i1);
    }
    check('band indices: (inner i, outer i, outer i+1), (inner i, outer i+1, inner i+1) per edge, closing on point 0', Array.from(bo).join() === bw.join());
}

/* ---- recording stub WebGL2 ---- */
function stubGL() {
    let nextId = 1;
    const gl = {
        ARRAY_BUFFER: 0x8892, ELEMENT_ARRAY_BUFFER: 0x8893, DYNAMIC_DRAW: 0x88e8, FLOAT: 0x1406, TRIANGLES: 4, TRIANGLE_FAN: 6,
        UNSIGNED_INT: 0x1405, DEPTH_TEST: 0xb71, LEQUAL: 0x203, BLEND: 0xbe2, SRC_ALPHA: 0x302, ONE_MINUS_SRC_ALPHA: 0x303, ONE: 1,
        TEXTURE0: 0x84c0, TEXTURE_2D_ARRAY: 0x8c1a,
        vao: null, array: null, draws: [], uploads: 0, idxBytes: 0, defaultVao: { elem: null },
        createVertexArray() { return { id: nextId++, elem: null }; },
        bindVertexArray(v) { this.vao = v; },
        createBuffer() { return { id: nextId++, data: null }; },
        bindBuffer(t, b) { if (t === this.ARRAY_BUFFER) this.array = b; else (this.vao || this.defaultVao).elem = b; },
        target(t) { return t === this.ARRAY_BUFFER ? this.array : (this.vao || this.defaultVao).elem; },
        bufferData(t, size) {
            const b = this.target(t);
            /* new storage: contents undefined, here 0xffffffff / NaN so stale use shows */
            b.data = t === this.ARRAY_BUFFER ? new Float32Array(size / 4).fill(NaN) : new Uint32Array(size / 4).fill(0xffffffff);
        },
        bufferSubData(t, off, d) {
            const b = this.target(t);
            if (off / 4 + d.length > b.data.length) throw new Error('bufferSubData past the end');
            b.data.set(d, off / 4);
            this.uploads++;
            if (t === this.ELEMENT_ARRAY_BUFFER) this.idxBytes += d.byteLength;
        },
        getAttribLocation() { return 0; }, enableVertexAttribArray() { }, vertexAttribPointer() { }, getUniformLocation() { return {}; },
        enable() { }, disable() { }, depthFunc() { }, depthMask() { }, blendFuncSeparate() { }, activeTexture() { }, bindTexture() { },
        useProgram() { }, uniform2f() { }, uniform1i() { },
        drawElements(mode, count, type, offset) { this.draws.push({ kind: 'elements', mode, count, type, offset, vao: this.vao }); },
        drawArrays(mode, first, count) { this.draws.push({ kind: 'arrays', mode, first, count, vao: this.vao }); }
    };
    return gl;
}

/* ---- the real renderer with stubs ---- */
const LM = { cells: [], playerCells: [], playerCellsMulti: [], play: false, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false };
const application = { gameMode: ':ffa', customSkinsMap: { skinned: 'https://skins.test/a.png' }, customSkinsCache: { 'https://skins.test/a.png': { width: 512 } },
    loadSkin() { }, _lmTouchSkin() { }, setVirusColor() { return '#33ff33'; }, setVirusStrokeColor() { return '#33ff33'; }, playSound() { } };
const env = { window: { legendmod: LM }, LM, application, defaultSettings: Object.assign({}, defaults.defaultSettings),
    defaultmapsettings: Object.assign({}, defaults.defaultmapsettings, { jellyPhisycs: true, customSkins: true, virusGlow: true }),
    ogarcopythelb: { color: '#01d9cc' }, ogario: { viewScale: 0.35 } };
const R = new Function('return (' + F.factory + ')')()(env);
const gl = stubGL();
R.gl = gl;
R.initWebGLJellyRenderer(gl, () => ({}));
check('jelly renderer initialised on the stub (programs, buffers)', !!(R.glJellyProgram && R.glJellyVBO && R.glJellyStrokeVBO));
R.glSkinArray = { id: 'skins' };
R.glSkinMap = { 'https://skins.test/a.png': 3 };
R._glSkinLayers = { max: 128, next: 0, used: new Array(128).fill(-1), owner: new Array(128).fill(null) };
R.scale = 0.35; R.camX = 0; R.camY = 0; R.canvasWidth = 1920; R.canvasHeight = 1080;

const rng = makeRng(31337);
let nextId = 1;
function makeCell(kind) {
    const size = kind === 'virus' ? 100 : 20 + rng() * 300;
    const n = kind === 'virus' ? 100 : 5 + ((rng() * 116) | 0);
    const c = { id: nextId++, x: (rng() - 0.5) * 5000, y: (rng() - 0.5) * 3000, size, isVirus: kind === 'virus', isFood: false, isEjected: false,
        invisible: false, removed: false, color: '#3388ff', targetNick: kind === 'skin' ? 'skinned' : (rng() < 0.5 ? 'plain' : ''), skin: '',
        points: [], maxPointRad: size, inView: true, isInView() { return this.inView; } };
    for (let i = 0; i < n; i++) addPoint(c);
    return c;
}
function addPoint(c) {
    const a = rng() * Math.PI * 2, r = c.size * (0.9 + rng() * 0.2);
    c.points.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
}
const kinds = () => { const r = rng(); return r < 0.1 ? 'virus' : r < 0.35 ? 'skin' : 'plain'; };
let cells = [];
for (let i = 0; i < 300; i++) cells.push(makeCell(kinds()));
const sortCells = () => cells.sort((a, b) => a.size - b.size || a.id - b.id);

/* what the frame must draw: every visible body in cell order, z from its cell index */
function expected() {
    const out = [];
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (!c || c.invisible || c.removed || c.isFood || !c.isInView()) continue;
        const z = cells.length > 1 ? 0.9 - (i / (cells.length - 1)) * 0.89 : 0.45;
        const bands = c.isVirus ? 2 : c.targetNick === 'skinned' ? 1 : 0;
        out.push({ c, z: Math.fround(z), bands });
    }
    return out;
}
function verifyFrame(tag) {
    const exp = expected();
    const fill = gl.draws.filter((d) => d.vao === R.glJellyVAO), stroke = gl.draws.filter((d) => d.vao === R.glJellyStrokeVAO);
    const errs = [];
    if (gl.draws.some((d) => d.kind === 'arrays')) errs.push('per-cell drawArrays used');
    if (fill.length !== 1) errs.push('fill draws: ' + fill.length);
    const idx = R.glJellyIBO.data, vtx = R.glJellyVBO.data, st = R.glJellyStride;
    let k = 0, nTri = 0;
    const totalPts = exp.reduce((a, e) => a + e.c.points.length, 0);
    if (fill[0] && fill[0].count !== totalPts * 3) errs.push('fill index count ' + fill[0].count + ' != ' + totalPts * 3);
    /* walk the uploaded index list: each body's fan triangles, in cell order */
    for (const e of exp) {
        const pts = e.c.points, n = pts.length;
        for (let t = 0; t < n && errs.length < 5; t++, nTri++) {
            const a = idx[k++], b = idx[k++], cc = idx[k++];
            const want = [[e.c.x, e.c.y], [pts[t].x, pts[t].y], [pts[(t + 1) % n].x, pts[(t + 1) % n].y]];
            [a, b, cc].forEach((v, m) => {
                if (!(v * st < vtx.length) || vtx[v * st] !== Math.fround(want[m][0]) || vtx[v * st + 1] !== Math.fround(want[m][1]) || vtx[v * st + 10] !== e.z) {
                    errs.push('fill triangle ' + nTri + ' vertex ' + m + ' (index ' + v + ') does not match cell ' + e.c.id);
                }
            });
        }
    }
    const bandPts = exp.reduce((a, e) => a + e.c.points.length * e.bands, 0);
    if (bandPts && (stroke.length !== 1 || stroke[0].count !== bandPts * 6)) errs.push('stroke draw ' + (stroke[0] && stroke[0].count) + ' != ' + bandPts * 6);
    if (!bandPts && stroke.length) errs.push('stroke drawn without bands');
    if (bandPts && stroke[0]) {
        const si = R.glJellyStrokeIBO.data, sv = R.glJellyStrokeVBO.data, ss = R.glJellyStrokeStride;
        let q = 0;
        for (const e of exp) {
            for (let b = 0; b < e.bands && errs.length < 5; b++) {
                const n = e.c.points.length;
                for (let t = 0; t < n * 6; t++) {
                    const v = si[q++];
                    if (!(v * ss < sv.length) || sv[v * ss + 6] !== e.z) { errs.push('band index ' + (q - 1) + ' -> vertex ' + v + ' not of cell ' + e.c.id); break; }
                }
            }
        }
    }
    if (R._glJellyIdxCells !== exp.length) errs.push('_glJellyIdxCells ' + R._glJellyIdxCells + ' != ' + exp.length);
    return errs;
}

let frameErrs = [], frames = 0, idxBytesStatic = -1, aborted = 0, grew = false;
const capFill0 = R.glJellyIndexCapacity;
for (let f = 0; f < 160; f++) {
    /* change the world */
    const r = rng();
    if (f > 0 && f % 40 === 0) { /* static frame: nothing changes */ }
    else if (r < 0.25) { for (let m = 0; m < 5; m++) { const c = cells[(rng() * cells.length) | 0]; if (rng() < 0.5 && c.points.length > 5) c.points.pop(); else addPoint(c); } }
    else if (r < 0.4) { const c = cells[(rng() * cells.length) | 0]; c.invisible = !c.invisible; }
    else if (r < 0.5) { const c = cells[(rng() * cells.length) | 0]; c.inView = !c.inView; }
    else if (r < 0.6) { cells.splice((rng() * cells.length) | 0, 1); }
    else if (r < 0.7) { cells.push(makeCell(kinds())); sortCells(); }
    else if (r < 0.75) { const c = cells[(rng() * cells.length) | 0]; c.targetNick = c.targetNick === 'skinned' ? 'plain' : 'skinned'; }
    if (f === 90) { for (let i = 0; i < 1500; i++) cells.push(makeCell('virus')); sortCells(); }
    if (f === 100) cells.splice(0, 1600);
    /* a body without points halfway: the whole batch stops (Canvas draws that frame) */
    let broken = null;
    if (f % 23 === 11) { broken = cells[(cells.length / 2) | 0]; broken._saved = broken.points; broken.points = [broken.points[0]]; }
    gl.draws.length = 0;
    const before = gl.idxBytes;
    const ok = R.drawWebGLCellBatch(cells);
    if (broken) {
        if (ok) frameErrs.push('frame ' + f + ': a body without points did not stop the batch');
        aborted++;
        broken.points = broken._saved;
        continue;
    }
    frames++;
    if (R.glJellyIndexCapacity > capFill0) grew = true;
    const errs = verifyFrame(f);
    if (errs.length) frameErrs.push('frame ' + f + ': ' + errs.join('; '));
    if (f > 0 && f % 40 === 0) idxBytesStatic = Math.max(idxBytesStatic, gl.idxBytes - before);
}
check('160 frames of a changing world (' + frames + ' drawn, ' + aborted + ' stopped halfway): every frame draws each visible body once, in cell order, from the uploaded indices', frameErrs.length === 0);
if (frameErrs.length) console.log('  ' + frameErrs.slice(0, 6).join('\n  '));
check('one drawElements for all bodies and one for all bands (no per-cell draws)', frameErrs.every((e) => e.indexOf('draws') < 0));
check('index buffers grew for 1500 extra viruses (and the frame after still matched)', grew);
check('a frame with the same point counts uploads no indices', idxBytesStatic === 0);

/* context restore: a fresh initWebGLJellyRenderer starts with no uploaded indices */
R.initWebGLJellyRenderer(gl, () => ({}));
gl.draws.length = 0;
R.drawWebGLCellBatch(cells);
check('after the renderer is set up again (context restore) every index is uploaded again', verifyFrame('restore').length === 0);

/* ---- label atlas: the shelf allocator ---- */
const A = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/var R = [\s\S]*$/, '') +
    'return { New: lmTextAtlasNew, Alloc: lmTextAtlasAlloc, Free: lmTextAtlasFree, Layers: lmTextAtlasLayers };')({});
{
    const arng = makeRng(99);
    const at = A.New(2048, 1024, 6);
    const live = [];
    let bad = 0;
    const overlap = (a, b) => a.page === b.page && a.x < b.x + b.cw && b.x < a.x + a.cw && a.y < b.y + b.h && b.y < a.y + a.h;
    for (let step = 0; step < 6000; step++) {
        if (live.length && arng() < 0.45) {
            const k = (arng() * live.length) | 0;
            A.Free(at, live[k].s);
            live.splice(k, 1);
            continue;
        }
        const w = 1 + ((arng() < 0.1 ? 2047 : 400) * arng() | 0), h = arng() < 0.5 ? 140 : 9 + ((arng() * 120) | 0);
        const s = A.Alloc(at, w, h);
        if (!s) continue;
        if (s.cw < w || s.h < h || s.x + s.cw > 2048 || s.y + s.h > 1024 || s.page >= 6) bad++;
        for (const o of live) if (overlap(o.s, s)) bad++;
        live.push({ s, w, h });
    }
    check('atlas: 6000 random allocations / frees: slots inside their page, big enough, never overlapping', bad === 0 && live.length > 50);
    check('atlas: at most maxPages pages', at.pages.length <= 6);
    for (const o of live) A.Free(at, o.s);
    check('atlas: everything freed: every page empty again (shelves removed, free spans merged)', at.pages.every((p) => !p.shelves.length && p.top === 0) && A.Layers(at) === 0);
    const at2 = A.New(2048, 1024, 1);
    check('atlas: too big for a page: no slot', A.Alloc(at2, 2049, 10) === null && A.Alloc(at2, 10, 1025) === null);
    let n = 0;
    while (A.Alloc(at2, 2048, 512)) n++;
    check('atlas: a full atlas gives no slot (the label then keeps its own texture)', n === 2 && A.Alloc(at2, 8, 8) === null);
    const at3 = A.New(2048, 1024, 4);
    const s1 = A.Alloc(at3, 300, 140), s2 = A.Alloc(at3, 300, 140);
    check('atlas: labels of one height share a shelf side by side', s1.y === s2.y && s2.x === s1.x + 304);
    A.Free(at3, s1);
    const s3 = A.Alloc(at3, 290, 140);
    check('atlas: a freed span is used again', s3.x === s1.x && s3.y === s1.y);
}

/* ---- label atlas in the renderer: stores, frees, draw order ---- */
{
    const tg = stubGL();
    let texN = 0;
    const log = [];
    Object.assign(tg, {
        TEXTURE_2D: 0xde1, TEXTURE1: 0x84c1, RGBA: 0x1908, RGBA8: 0x8058, UNSIGNED_BYTE: 0x1401, NO_ERROR: 0, MAX_ARRAY_TEXTURE_LAYERS: 0x88ff,
        READ_FRAMEBUFFER: 0x8ca8, READ_FRAMEBUFFER_BINDING: 0x8caa, COLOR_ATTACHMENT0: 0x8ce0, TRIANGLE_STRIP: 5, LESS: 0x201,
        TEXTURE_MIN_FILTER: 1, TEXTURE_MAG_FILTER: 2, TEXTURE_WRAP_S: 3, TEXTURE_WRAP_T: 4, LINEAR: 5, CLAMP_TO_EDGE: 6,
        getError() { return 0; }, getParameter(p) { return p === this.MAX_ARRAY_TEXTURE_LAYERS ? 2048 : null; }, isContextLost() { return false; },
        createTexture() { return { id: 't' + (++texN) }; }, deleteTexture(t) { log.push('del ' + (t && t.id)); },
        texStorage3D(t, l, f, w, h, d) { log.push('storage ' + d); }, texParameteri() { }, texSubImage3D(t, l, x, y, z) { log.push('sub3d ' + z); },
        texImage2D() { log.push('img'); }, texSubImage2D() { log.push('sub'); },
        createFramebuffer() { return {}; }, bindFramebuffer() { }, deleteFramebuffer() { }, framebufferTextureLayer() { },
        copyTexSubImage3D(t, l, x, y, z) { log.push('copy ' + z); },
        vertexAttribDivisor() { }, uniform1f() { }, uniform1i() { },
        drawArraysInstanced(m, f, c, n) { log.push('inst ' + n); }, drawArrays() { log.push('one'); }
    });
    const env2 = Object.assign({}, env, { defaultSettings: Object.assign({}, env.defaultSettings), defaultmapsettings: Object.assign({}, env.defaultmapsettings) });
    const T = new Function('return (' + F.factory + ')')()(env2);
    T.gl = tg;
    T.glTextProgram = {};
    T.glTextVAO = {};
    T.initWebGLTextAtlas(tg, () => ({}), {});
    check('atlas program set up on a WebGL2 context', !!T.glTextAtlasProgram);
    Object.assign(T, { glTextCache: new Map(), glTextCacheMaxSize: 500, _lmTextBytes: 0, _lmMassTex: null, _lmMassBytes: 0, _lmTextFrame: 0, _lmTextIdleTimer: 1,
        _textCanvas: { width: 0, height: 0 }, scale: 1, camX: 0, camY: 0, canvasWidth: 1920, canvasHeight: 1080,
        _textCtx: { font: '', measureText: (t) => ({ width: t.length * 50 }), setTransform() { }, clearRect() { }, scale() { }, strokeText() { }, fillText() { } },
        getLegendWorldAttachedRenderPoint: (x, y) => ({ x, y }) });
    const Fn = 'bold 100px Ubuntu';
    T._lmTextFrameBegin();
    const e1 = T.getOrCreateTextTexture('nick', Fn, '#fff', '#000', 10);
    check('nick texture goes into the atlas (no texture of its own), bytes counted as before', !!e1.slot && !e1.tex && T._lmTextBytes === e1.w * e1.h * 4 && log.join() === 'storage 1,sub3d 0');
    const cell = {};
    const m1 = T._lmMassTexture(cell, '1234', Fn, '#fff', '#000', 10), slot1 = m1.slot;
    log.length = 0;
    T._lmMassTexture(cell, '1235', Fn, '#fff', '#000', 10);
    check('mass value of the same width: drawn again in its own slot', m1.slot === slot1 && log.join() === 'sub3d 0');
    T._lmMassTexture(cell, '123456789', Fn, '#fff', '#000', 10);
    check('mass value wider than its slot: a new slot, the old one freed', m1.slot !== slot1 && slot1.freed === true);
    /* no room left: the atlas cannot get more pages */
    T._lmTextAtlas.alloc.maxPages = T._lmTextAtlas.alloc.pages.length;
    let big = null;
    for (let i = 0; i < 40 && !(big && big.tex); i++) big = T.getOrCreateTextTexture('x'.repeat(40) + i, 'bold 360px Ubuntu', '#fff', '#000', 10);
    check('atlas full: the label keeps its own texture', !!(big && big.tex && !big.slot));
    /* draw order: atlas, atlas, own texture, atlas -> instanced(2), one, instanced(1) */
    log.length = 0;
    T._lmTextBatchOn = true;
    T._lmTextBatchN = 0;
    T._lmTextProg = 1;
    T.drawWebGLTextQuad(e1, 0, 0, 0, 30, 0.5);
    T.drawWebGLTextQuad(m1, 0, 0, 10, 20, 0.5);
    T.drawWebGLTextQuad(big, 5, 5, 0, 30, 0.4);
    T.drawWebGLTextQuad(e1, 9, 9, 0, 30, 0.3);
    T._lmTextFlush();
    T._lmTextBatchOn = false;
    check('labels keep their order: queued atlas labels are drawn before a label with its own texture', log.filter((l) => /^(inst|one)/.test(l)).join() === 'inst 2,one,inst 1');
    const d = T.glTextAtlasData;
    check('instance data: world position, half size, offset, depth, texel rectangle and page', d[0] === 9 && d[5] === Math.fround(0.3) && d[6] === e1.slot.x && d[8] === e1.w && d[9] === e1.h && d[10] === e1.slot.page);
    /* the text pass stops: everything is freed, the atlas texture too */
    T._lmTextPassAt = 0;
    for (let k = 0; k < 20 && (T.glTextCache.size || (T._lmMassTex && T._lmMassTex.size)); k++) T._lmTextIdle();
    check('idle: every label freed and the atlas texture deleted', !T.glTextCache.size && !T._lmMassTex.size && T._lmTextAtlas === null && T._lmTextBytes === 0 && T._lmMassBytes === 0);
}

if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
console.log('renderbatch ok');
