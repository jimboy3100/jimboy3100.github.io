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
    loadSkin() { }, _lmTouchSkin() { }, customSkinKey(nick) { return (nick && this.customSkinsMap[nick]) || null; }, setVirusColor() { return '#33ff33'; }, setVirusStrokeColor() { return '#33ff33'; }, playSound() { } };
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
    'return { New: lmTextAtlasNew, Alloc: lmTextAtlasAlloc, Free: lmTextAtlasFree, Layers: lmTextAtlasLayers, Step: lmTextAtlasStep, MaxPages: lmTextAtlasMaxPages };')({});
{
    const steps = [1, 2, 3, 5, 9, 16, 17, 21, 25, 33, 41].map((n) => A.Step(n, 1000));
    check('atlas layers: powers of two up to 16, then steps of a quarter (' + steps.join(',') + ')', steps.join() === '1,2,4,8,16,16,20,24,28,40,48' && A.Step(30, 24) === 24);
    const MB = 1048576;
    check('atlas pages: twice the text + mass budgets (64 MB: 24 pages, no longer held to 16), within the GPU layer limit, at least 2',
        A.MaxPages(64 * MB, 2048, 1024, 2048) === 24 && A.MaxPages(64 * MB, 2048, 1024, 20) === 20 && A.MaxPages(32 * MB, 2048, 1024, 2048) === 12 &&
        A.MaxPages(16 * MB, 2048, 1024, 2048) === 6 && A.MaxPages(1 * MB, 2048, 1024, 2048) === 2);
}
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
        createFramebuffer() { return {}; }, bindFramebuffer() { }, deleteFramebuffer() { }, framebufferTextureLayer() { }, framebufferTexture2D() { },
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
    /* into the atlas through a 2D upload and a GPU copy: texSubImage3D from the canvas waited for the GPU */
    check('nick texture goes into the atlas (no texture of its own, 2D upload + GPU copy), bytes counted as before', !!e1.slot && !e1.tex && T._lmTextBytes === e1.w * e1.h * 4 && log.join() === 'storage 1,img,copy 0');
    const cell = {};
    const m1 = T._lmMassTexture(cell, '1234', Fn, '#fff', '#000', 10), slot1 = m1.slot;
    log.length = 0;
    T._lmMassTexture(cell, '1235', Fn, '#fff', '#000', 10);
    check('mass value of the same width: drawn again in its own slot', m1.slot === slot1 && log.join() === 'img,copy 0');
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

    /* a full atlas: slots of labels not drawn in this or the last frame are given to new ones;
     * a label left with its own texture goes into the atlas once a slot is free */
    const T2 = new Function('return (' + F.factory + ')')()(env2);
    Object.assign(T2, { gl: tg, glTextProgram: {}, glTextVAO: {} });
    T2.initWebGLTextAtlas(tg, () => ({}), {});
    Object.assign(T2, { glTextCache: new Map(), glTextCacheMaxSize: 100000, _lmTextBytes: 0, _lmMassTex: null, _lmMassBytes: 0, _lmTextFrame: 0, _lmTextIdleTimer: 1,
        _lmTextBudget: 1 << 30, _textCanvas: { width: 0, height: 0 }, scale: 1, camX: 0, camY: 0, canvasWidth: 1920, canvasHeight: 1080,
        _textCtx: T._textCtx, getLegendWorldAttachedRenderPoint: (x, y) => ({ x, y }) });
    const nick = (i) => T2.getOrCreateTextTexture('n' + String(i).padStart(3, '0'), Fn, '#fff', '#000', 10);
    T2._lmTextFrameBegin();
    nick(0);
    T2._lmTextAtlas.alloc.maxPages = 2;
    const made = [];
    let fallback = null;
    for (let i = 0; i < 400 && !fallback; i++) { const e = nick(i); if (e.tex) fallback = { i, e }; else made.push(e); }
    check('full atlas of labels drawn this frame: nothing is evicted, the new label keeps its own texture', !!fallback && made.length > 50 && made.every((e) => e.slot && !e.slot.freed) && T2.glTextCache.size === made.length + 1);
    T2._lmTextFrameBegin();
    for (let i = 10; i < 20; i++) nick(i);
    T2._lmTextFrameBegin();
    for (let i = 0; i < 10; i++) nick(i);
    const before = T2.glTextCache.size;
    log.length = 0;
    const fresh = T2.getOrCreateTextTexture('zzzz', Fn, '#fff', '#000', 10);
    const sumBytes = () => { let b = 0; T2.glTextCache.forEach((e) => (b += e.bytes)); return b; };
    check('full atlas: a new label takes the slot of the least recently drawn one (not drawn this or last frame)', !!fresh.slot && !fresh.tex && !T2.glTextCache.has('n020|' + Fn + '|#fff|#000|10') &&
        T2.glTextCache.size === before && T2._lmTextBytes === sumBytes());
    let keptRecent = true;
    for (let i = 0; i < 20; i++) { const e = T2.glTextCache.get('n' + String(i).padStart(3, '0') + '|' + Fn + '|#fff|#000|10'); if (!e || !e.slot || e.slot.freed) keptRecent = false; }
    check('full atlas: labels drawn this or last frame keep their slots', keptRecent);
    /* the label with its own texture: no free slot yet (the reclaimed one was taken) */
    log.length = 0;
    nick(fallback.i);
    check('label with its own texture and no free slot: stays as it is', !!fallback.e.tex && !fallback.e.slot && log.indexOf('copy 0') < 0 && log.indexOf('copy 1') < 0);
    const gone = T2.glTextCache.get('n021|' + Fn + '|#fff|#000|10');
    T2._lmTextRelease(gone);
    T2._lmTextBytes -= gone.bytes;
    T2.glTextCache.delete('n021|' + Fn + '|#fff|#000|10');
    log.length = 0;
    const back = nick(fallback.i);
    check('a slot freed: the label with its own texture is copied into the atlas on the GPU and its texture deleted', back === fallback.e && !!back.slot && !back.tex &&
        log.some((l) => /^copy /.test(l)) && log.some((l) => /^del /.test(l)) && !log.some((l) => l === 'img'));
    /* mass texts of cells gone from view give their slots too */
    T2._lmMassTex = new Map();
    T2._lmTextFrameBegin();
    for (let i = 0; i < 20; i++) nick(i);
    const cells = [];
    let massSlots = 0;
    for (let i = 0; i < 40; i++) { const c = { id: i }; cells.push(c); const m = T2._lmMassTexture(c, String(1000 + i), Fn, '#fff', '#000', 10); if (m && m.slot) massSlots++; }
    T2._lmTextFrameBegin();
    T2._lmTextFrameBegin();
    /* every nick drawn in this frame: only the mass texts are stale */
    T2.glTextCache.forEach((e) => (e.frame = T2._lmTextFrame));
    const massBefore = T2._lmMassTex.size;
    let fresh2 = 0;
    for (let i = 0; i < 6; i++) { const e = T2.getOrCreateTextTexture('m' + i, Fn, '#fff', '#000', 10); if (e.slot) fresh2++; }
    let massBytes = 0;
    T2._lmMassTex.forEach((e) => (massBytes += e.bytes));
    check('full atlas: mass texts of cells not drawn lately give their slots (' + massSlots + ' mass slots, ' + fresh2 + '/6 new labels in the atlas, pool ' + massBefore + ' -> ' + T2._lmMassTex.size + ')',
        massSlots === 40 && fresh2 === 6 && T2._lmMassTex.size < massBefore && T2._lmMassTex.size >= massBefore - 6 && T2._lmMassBytes === massBytes && T2._lmTextBytes === sumBytes());
}

/* ---- label atlas banks: growing adds a texture array and never copies the pages in use; a bank
 * above the labels is given back after 10 s without one; units and per-page layer codes ---- */
{
    const tg = stubGL();
    let texN = 0, unit = 0;
    const log = [], bound = {};
    Object.assign(tg, {
        TEXTURE_2D: 0xde1, TEXTURE1: 0x84c1, RGBA: 0x1908, RGBA8: 0x8058, UNSIGNED_BYTE: 0x1401, NO_ERROR: 0, MAX_ARRAY_TEXTURE_LAYERS: 0x88ff,
        READ_FRAMEBUFFER: 0x8ca8, READ_FRAMEBUFFER_BINDING: 0x8caa, COLOR_ATTACHMENT0: 0x8ce0, TRIANGLE_STRIP: 5, LESS: 0x201,
        TEXTURE_MIN_FILTER: 1, TEXTURE_MAG_FILTER: 2, TEXTURE_WRAP_S: 3, TEXTURE_WRAP_T: 4, LINEAR: 5, CLAMP_TO_EDGE: 6,
        getError() { return 0; }, getParameter(p) { return p === this.MAX_ARRAY_TEXTURE_LAYERS ? 2048 : null; }, isContextLost() { return false; },
        createTexture() { return { id: 't' + (++texN) }; }, deleteTexture(t) { log.push('del ' + (t && t.id)); },
        activeTexture(u) { unit = u - this.TEXTURE0; }, bindTexture(t, x) { if (t === this.TEXTURE_2D_ARRAY) bound[unit] = x; },
        texStorage3D(t, l, f, w, h, d) { log.push('storage ' + d); }, texParameteri() { }, texSubImage3D(t, l, x, y, z) { log.push('sub3d ' + z); },
        texImage2D() { }, texSubImage2D() { },
        createFramebuffer() { return {}; }, bindFramebuffer() { }, deleteFramebuffer() { }, framebufferTextureLayer(t, at, tex, lv, l) { log.push('fblayer ' + l); }, framebufferTexture2D() { },
        copyTexSubImage3D(t, l, x, y, z) { log.push('copy ' + bound[1].id + ':' + z); },
        vertexAttribDivisor() { }, uniform1f() { }, uniform1i() { },
        drawArraysInstanced(m, f, c, n) { log.push('inst ' + n); }, drawArrays() { }
    });
    const env3 = Object.assign({}, env, { defaultSettings: Object.assign({}, env.defaultSettings), defaultmapsettings: Object.assign({}, env.defaultmapsettings) });
    const T = new Function('return (' + F.factory + ')')()(env3);
    Object.assign(T, { gl: tg, glTextProgram: {}, glTextVAO: {} });
    T.initWebGLTextAtlas(tg, () => ({}), {});
    let clock = 1e6;
    const realNow = Date.now;
    Date.now = () => clock;
    try {
        Object.assign(T, { glTextCache: new Map(), glTextCacheMaxSize: 100000, _lmTextBytes: 0, _lmMassTex: null, _lmMassBytes: 0, _lmTextFrame: 0, _lmTextIdleTimer: 1,
            _lmTextBudget: 1 << 30, _textCanvas: { width: 0, height: 0 }, scale: 1, camX: 0, camY: 0, canvasWidth: 1920, canvasHeight: 1080,
            _textCtx: { font: '', measureText: (t) => ({ width: t.length * 50 }), setTransform() { }, clearRect() { }, scale() { }, strokeText() { }, fillText() { } },
            getLegendWorldAttachedRenderPoint: (x, y) => ({ x, y }) });
        /* 360 px labels 40 characters wide: two to a page (two 504-texel shelves of a full-width label) */
        const F3 = 'bold 360px Ubuntu', txt = (i) => 'x'.repeat(39) + String.fromCharCode(65 + i), key = (i) => txt(i) + '|' + F3 + '|#fff|#000|10';
        const big = (i) => T.getOrCreateTextTexture(txt(i), F3, '#fff', '#000', 10);
        T._lmTextFrameBegin();
        const a = T._lmTextAtlasGet();
        check('atlas banks: no more pages than 8 banks hold (28 with the step sizes), when the budget allows more', a.alloc.maxPages === 28 && T.glTextAtlasBanks === 8);
        const es = [];
        for (let i = 0; i < 18; i++) es.push(big(i));
        const pages = es.map((e) => e.slot && e.slot.page);
        check('atlas banks: 18 labels on pages 0..8, two to a page (' + pages.join(',') + ')', pages.join() === '0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8');
        check('atlas banks: growing makes banks of the step sizes (1, 1, 2, 4, 8 pages: 16), the pages in use are never copied (one copy per label, no page read)',
            log.filter((l) => /^storage/.test(l)).join() === 'storage 1,storage 1,storage 2,storage 4,storage 8' && a.layers === 16 && a.banks.length === 5 &&
            log.filter((l) => /^copy/.test(l)).length === 18 && !log.some((l) => /^fblayer|^del/.test(l)));
        const e10 = es[10]; /* page 5: bank 3 (pages 4..7), its second layer */
        check('atlas banks: a label goes into the layer of its bank (page 5 = bank 3 layer 1), a_layer = bank * 4096 + layer',
            a.code[5] === 3 * 4096 + 1 && a.banks[3].start === 4 && log.indexOf('copy ' + a.banks[3].tex.id + ':1') >= 0 && T._lmTextAtlasBankOf(a, 5) === a.banks[3]);
        T._lmTextBatchOn = true; T._lmTextBatchN = 0; T._lmTextProg = 1;
        T.drawWebGLTextQuad(e10, 0, 0, 0, 30, 0.5);
        T.drawWebGLTextQuad(es[0], 0, 0, 0, 30, 0.5);
        for (const k in bound) delete bound[k];
        T._lmTextFlush();
        T._lmTextBatchOn = false;
        const units = [1, 4, 5, 6, 7, 8, 9, 10];
        check('atlas banks: instance layer codes, and every unit of the program holds its bank (bank 0 where there is no bank)',
            T.glTextAtlasData[10] === 3 * 4096 + 1 && T.glTextAtlasData[21] === 0 && units.every((u, b) => bound[u] === (a.banks[b] || a.banks[0]).tex));
        /* the labels on pages 2..8 go (banks 2, 3 and 4 empty), the others stay */
        const release = (i) => { const e = T.glTextCache.get(key(i)); T._lmTextRelease(e); T._lmTextBytes -= e.bytes; T.glTextCache.delete(key(i)); };
        for (let i = 4; i < 18; i++) release(i);
        const lastTex = a.banks[4].tex.id;
        log.length = 0;
        const toCheck = () => { do T._lmTextFrameBegin(); while (T._lmTextFrame % 60); };
        toCheck();
        clock += 5000;
        toCheck();
        check('atlas banks: banks without labels are kept for 10 s (no make-and-delete while the scene keeps changing)', a.banks.length === 5 && !log.some((l) => /^del/.test(l)));
        clock += 5000;
        toCheck();
        check('atlas banks: after 10 s the last empty bank is given back, nothing copied', a.banks.length === 4 && a.layers === 8 && log.join() === 'del ' + lastTex && a.code.length === 8 && a.alloc.pages.length <= 8);
        toCheck();
        check('atlas banks: one bank per check; the next empty one follows', a.banks.length === 3 && a.layers === 4 && a.alloc.pages.length <= 4);
        /* a label on the last bank (pages 2..3) again: it is kept */
        const back = big(20);
        clock += 20000;
        toCheck(); toCheck();
        check('atlas banks: a bank holding a label again stays (page ' + (back.slot && back.slot.page) + ')', a.banks.length === 3 && !!back.slot && back.slot.page === 2);
        /* growing again: new banks, no copy */
        log.length = 0;
        for (let i = 21; i < 34; i++) big(i);
        check('atlas banks: growing again only adds banks (no page copied)', a.banks.length === 5 && log.filter((l) => /^storage/.test(l)).join() === 'storage 4,storage 8' && !log.some((l) => /^fblayer|^del/.test(l)));
        for (let i = 0; i < 4; i++) release(i);
        for (let i = 20; i < 34; i++) release(i);
        for (let k = 0; k < 8; k++) { clock += 11000; toCheck(); }
        check('atlas banks: with no label left, every bank but bank 0 (one page) is given back', a.banks.length === 1 && a.layers === 1);
        T.getOrCreateTextTexture('last', F3, '#fff', '#000', 10);
        log.length = 0;
        T._lmTextPassAt = 0;
        for (let k = 0; k < 20 && T.glTextCache.size; k++) T._lmTextIdle();
        check('atlas banks: the text pass stops: the atlas and its banks are deleted', T._lmTextAtlas === null && log.indexOf('del ' + a.banks[0].tex.id) >= 0);
    } finally { Date.now = realNow; }
}

if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
console.log('renderbatch ok');
