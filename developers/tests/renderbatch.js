/* WebGL batching checks in Node (no browser): the index lists of the jelly batch
 * (lmJellyFanIndices / lmJellyBandIndices: the same triangles, in the same order, as one
 * TRIANGLE_FAN per body and six band vertices per edge), and the real drawWebGLCellBatch jelly
 * path from ogario/ogario.v4.js run against a recording stub WebGL2 context over many frames of
 * a changing world (points added and removed, cells hidden, shown, added and removed, skins and
 * viruses with bands, buffer growth, a batch stopped halfway): what the stub GPU holds after
 * each frame must draw exactly every visible body, in order, with no stale indices.
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

if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
console.log('renderbatch ok');
