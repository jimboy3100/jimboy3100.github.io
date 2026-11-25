/* WebGL cell renderer check and benchmark in headless Chrome (real GPU when Chrome has one).
 *
 * Loads the real renderer (the window.drawRender object of ogario/ogario.v4.js and the helper
 * functions it calls) twice into one page: the working copy and a reference version (by default
 * the last version before the jelly bodies and labels were batched). Both draw the same seeded
 * scene (cells with real jelly points from developers/tests/bench-dense.js, skins, transparent
 * skins, viruses, own and multibox cells, nick and mass labels with Unicode) on their own
 * WebGL2 canvas with the same steps as renderFrame: clear, drawWebGLCellBatch, the multibox
 * rings, the nick/mass text pass. Then:
 *   - the pixels of the two are compared (jelly on/off x labels on/off, transparency, zoom);
 *   - with --bench: draw calls, GL calls and bytes uploaded per frame (counted by wrapping the
 *     context), and the CPU time of the cell batch + text pass per frame (without the wrapper;
 *     "sync" adds a 1-pixel readPixels, so it also contains the GPU process / driver work),
 *     for 100/500/1000/2000 bodies with labels on.
 *
 * Usage:
 *   node developers/tests/glbatch.js              visual comparison (quick)
 *   node developers/tests/glbatch.js --bench      + benchmark table
 *     --ref REF      git revision of the reference version (default c677d1ba = 3.608)
 *     --old FILE     reference ogario.v4.js from a file instead of git
 *     --bodies a,b   body counts for --bench (default 100,500,1000,2000)
 *     --frames N     timed frames per scene (default 30, after 5 warm-up frames)
 *     --out DIR      also write the diff stats as JSON there
 *     --dump DIR     write both pictures of every case as PNG there
 * Needs Node 22+ and Chrome (CHROME_PATH or the usual install places); without Chrome it only
 * prints that it was skipped. */
'use strict';
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const bench = require('./bench-dense.js');

const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
const BENCH = args.indexOf('--bench') >= 0;

function findChrome() {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    const cands = [];
    if (process.platform === 'win32') {
        for (const base of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA, 'C:/Program Files', 'C:/Program Files (x86)']) {
            if (base) cands.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Chromium/Application/chrome.exe'));
        }
    } else if (process.platform === 'darwin') {
        cands.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium');
    } else {
        const dirs = (process.env.PATH || '').split(path.delimiter).concat(['/usr/bin', '/usr/local/bin', '/snap/bin']);
        for (const n of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) for (const d of dirs) if (d) cands.push(path.join(d, n));
    }
    return cands.find((f) => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}

/* ---- the renderer source, cut out of ogario.v4.js ---- */
function block(src, i) {
    let d = 0;
    const j = src.indexOf('{', i);
    for (let k = j; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    throw new Error('unbalanced block at ' + i);
}
function grabFn(src, name) {
    const m = new RegExp('\\n {0,4}function ' + name + '\\(').exec(src);
    return m ? block(src, m.index + 1) : null;
}
function grabVar(src, name) {
    const m = new RegExp('\\nvar ' + name + ' = [^\\n]*').exec(src);
    return m ? m[0].slice(1) : null;
}
/* Helper functions the renderer calls (missing ones are simply left out: an older version may
 * not have them). lmMassTexDue is replaced below so every mass label is drawn in the first frame
 * (the real rule spreads new mass textures over frames, which would make the comparison depend
 * on timing). */
const HELPERS = ['lmTextTexBudget', 'lmTextCacheEvict', 'lmMassDue', 'lmMassLag', 'lmMassPoolTrim',
    'lmSkinLayersNew', 'lmSkinLayerPick', 'lmSkinLayerTake', 'lmSkinLayerTouch',
    'lmMultiboxRingPlayer', 'lmMultiboxRingColor', 'lmMultiboxRing',
    'lmJellyFanIndices', 'lmJellyBandIndices', 'lmTextAtlasNew', 'lmTextAtlasAlloc', 'lmTextAtlasFree', 'lmTextAtlasLayers'];
const VARS = ['LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_MIN_SCREEN_PX'];

function rendererFactory(src) {
    src = src.replace(/\r\n/g, '\n');
    const start = src.indexOf('    window.drawRender = {');
    if (start < 0) throw new Error('window.drawRender not found');
    /* the literal ends at the first line that is only "    }" (brace counting would trip over
     * braces in its strings and regular expressions) */
    const endM = /\n    \};?[ \t]*\n/.exec(src.slice(start));
    if (!endM) throw new Error('end of window.drawRender not found');
    const lit = src.slice(start + '    window.drawRender = '.length, start + endM.index + endM[0].indexOf('}') + 1);
    const parts = [];
    for (const n of HELPERS) { const f = grabFn(src, n); if (f) parts.push(f); }
    for (const n of VARS) { const v = grabVar(src, n); if (v) parts.push(v); }
    const settings = (name) => block(src, src.indexOf('var ' + name + ' = {') + ('var ' + name + ' = ').length);
    return {
        defaults: '{ defaultSettings: ' + settings('defaultSettings') + ',\n defaultmapsettings: ' + settings('defaultmapsettings') + ' }',
        factory: 'function (env) {\n' +
            'var window = env.window, LM = env.LM, application = env.application, defaultSettings = env.defaultSettings,\n' +
            '  defaultmapsettings = env.defaultmapsettings, ogarcopythelb = env.ogarcopythelb, ogario = env.ogario;\n' +
            'function lmMultiboxIdMaster() { return null; }\n' +
            'function lmMultiboxControlledPlayer() { return 1; }\n' +
            parts.join('\n') + '\n' +
            'function lmMassTexDue(entry, text, style) { return entry && entry.txt === text && entry.style === style ? 0 : 1; }\n' +
            'var R = ' + lit + ';\n' +
            'return R;\n}'
    };
}

function readOld() {
    const file = opt('--old', null);
    if (file) return fs.readFileSync(file, 'utf8');
    const ref = opt('--ref', 'c677d1ba');
    return execFileSync('git', ['-C', root, 'show', ref + ':ogario/ogario.v4.js'], { encoding: 'utf8', maxBuffer: 64 * 1048576 });
}

/* ---- seeded scene: real jelly points from the physics harness ---- */
const NICKS = ['Legend', 'Ωmega', 'ΛΕΓΕΝΤ', '[TAG] Hero', '玩家一号', 'ñandú', '🔥fire🔥', 'Zed', 'agar.io', 'sk1n', 'Ματθαίος', 'x', '★Star★', 'Ünïcødé', ''];
const SKINNED = { 'Legend': 0, 'Ωmega': 1, '[TAG] Hero': 2, 'sk1n': 3, 'Zed': 1 };
const COLORS = ['#ff3b3b', '#33ff66', '#3388ff', '#ffcc00', '#cc33ff', '#00e5ff', '#ff8800', '#888888', '#ffffff', '#1a1a1a'];

async function buildScene(J, nBodies, seed) {
    J.setRandomSeed(seed);
    const cells = bench.makeScene(J, nBodies, 0, seed);
    const scratch = [];
    for (let f = 0; f < 6; f++) { bench.stepWorld(J, cells); bench.runFrame(J, scratch, false); }
    const rng = bench.makeRng(seed + 1);
    const out = [];
    for (const c of cells) {
        if (!c.points || c.points.length < 3) continue;
        const pts = new Array(c.points.length * 2);
        for (let i = 0; i < c.points.length; i++) { pts[2 * i] = c.points[i].x; pts[2 * i + 1] = c.points[i].y; }
        const o = { id: c.id, x: c.x, y: c.y, size: c.size, isVirus: !!c.isVirus, maxPointRad: c.maxPointRad || c.size, pts: pts };
        if (!c.isVirus) {
            o.color = COLORS[(rng() * COLORS.length) | 0];
            o.nick = NICKS[(rng() * NICKS.length) | 0];
            const r = rng();
            if (r < 0.06) o.own = 1; else if (r < 0.1) o.own = 2;
        }
        out.push(o);
    }
    /* small -> large, the order LM.cells is sorted in */
    out.sort((a, b) => a.size - b.size || a.id - b.id);
    return out;
}

/* ---- the page side (serialised into the page) ---- */
function pageLib() {
    var W = 1920, H = 1080;
    function skinCanvas(k) {
        var c = document.createElement('canvas');
        c.width = c.height = 512;
        var x = c.getContext('2d');
        x.clearRect(0, 0, 512, 512);
        var cols = [['#d33', '#fd3'], ['#36f', '#fff'], ['#2a5', '#000'], ['#a3f', '#3fa']][k];
        for (var i = 0; i < 8; i++) {
            x.fillStyle = cols[i & 1];
            x.beginPath();
            x.moveTo(256, 256);
            x.arc(256, 256, 256, i * Math.PI / 4, (i + 1) * Math.PI / 4);
            x.fill();
        }
        if (k === 1) x.clearRect(160, 160, 192, 192);
        if (k === 3) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(0, 0, 512, 256); }
        return c;
    }
    function makeEnv(defaults, cfg) {
        var ds = Object.assign({}, defaults.defaultSettings, cfg.settings || {});
        var dm = Object.assign({}, defaults.defaultmapsettings, { jellyPhisycs: !!cfg.jelly, customSkins: true, virusGlow: true,
            mbRingsP1: true, mbRingsP2: true }, cfg.map || {});
        var LM = { cells: [], playerCells: [], playerCellsMulti: [], play: true, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false,
            multiBoxPlayerExists: true, removedCells: [], sortCells: false, indexedCells: {} };
        var application = { gameMode: ':ffa', customSkinsMap: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },
            setAutoHideCellInfo: function (t) { return t <= 40 || window.__glbScale < 0.5 && t < 550 && t < 25 / window.__glbScale; },
            getCustomSkin: function (nick) { return this.customSkinsMap[nick] || null; },
            /* stand-in for the shared lookup (application.customSkinKey): the name map only */
            customSkinKey: function (nick) { return (nick && this.customSkinsMap[nick]) || null; },
            setVirusColor: function () { return ds.virusColor; }, setVirusStrokeColor: function () { return ds.virusStrokeColor; },
            playSound: function () { } };
        var win = { navigator: { deviceMemory: 8 }, devicePixelRatio: 1 };
        win.legendmod = LM;
        win.multiboxPlayerEnabled = 0;
        win.fullSpectator = false;
        win.clientProfiler = null;
        return { window: win, LM: LM, application: application, defaultSettings: ds, defaultmapsettings: dm,
            ogarcopythelb: { color: '#01d9cc' }, ogario: { viewScale: cfg.scale } };
    }
    function makeCells(env, scene) {
        var LM = env.LM, cells = [];
        for (var i = 0; i < scene.length; i++) {
            var s = scene[i], pts = [];
            for (var k = 0; k < s.pts.length; k += 2) pts.push({ x: s.pts[k], y: s.pts[k + 1] });
            var c = { id: s.id, x: s.x, y: s.y, size: s.size, isVirus: s.isVirus, isFood: false, isEjected: false, invisible: false, removed: false,
                points: pts, maxPointRad: s.maxPointRad, color: s.color || '#33ff33', targetNick: s.nick || '', skin: '', alpha: 1,
                isPlayerCell: s.own === 1, isPlayerCellMulti: s.own === 2, spectator: s.own === 2 ? 1 : 0, mass: 0,
                isInView: function () { return true; } };
            cells.push(c);
            if (s.own === 1) LM.playerCells.push(c);
            if (s.own === 2) LM.playerCellsMulti.push(c);
        }
        LM.cells = cells;
        return cells;
    }
    function setup(factorySrc, defaults, cfg, scene) {
        var env = makeEnv(defaults, cfg);
        window.__glbScale = cfg.scale;
        var R = (0, eval)('(' + factorySrc + ')')(env);
        var canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        R.glCanvas = canvas;
        R.canvasWidth = W; R.canvasHeight = H;
        R.initWebGL();
        if (!R.gl) throw new Error('initWebGL failed');
        R.gl.viewport(0, 0, W, H);
        R.scale = cfg.scale; R.camX = cfg.camX || 0; R.camY = cfg.camY || 0;
        R._skinHalf = false;
        uploadSkins(R, env);
        makeCells(env, scene);
        return { R: R, env: env };
    }
    /* skins: put four test skins into texture-array layers and map nicks to them */
    function uploadSkins(R, env) {
        var gl = R.gl, urls = [];
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, R.glSkinArray);
        for (var k = 0; k < 4; k++) {
            var url = 'https://skins.test/' + k + '.png';
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, k, 512, 512, 1, gl.RGBA, gl.UNSIGNED_BYTE, skinCanvas(k));
            R.glSkinMap[url] = k;
            env.application.customSkinsCache[url] = skinCanvas(k);
            urls.push(url);
        }
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        var skinned = window.__glbSkinned;
        Object.keys(skinned).forEach(function (n) { env.application.customSkinsMap[n] = urls[skinned[n]]; });
    }
    /* WebGL context lost and given back: what the webglcontextrestored handler of initWebGL does,
     * then the skins again (the game uploads them again as they are drawn) */
    function loseAndRestore(o) {
        var R = o.R, gl = R.gl, ext = gl.getExtension('WEBGL_lose_context');
        return new Promise(function (done) {
            R.glCanvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); R.gl = null; setTimeout(function () { ext.restoreContext(); }, 0); }, { once: true });
            R.glCanvas.addEventListener('webglcontextrestored', function () {
                R.gl = null;
                R.glSkinMap = {};
                R._glSkinLayers = null;
                R.glTextCache = new Map();
                R._lmTextBytes = 0;
                R._lmMassTex = null;
                R._lmMassBytes = 0;
                R._lmTextAtlas = null;
                R.initWebGL();
                R.gl.viewport(0, 0, W, H);
                uploadSkins(R, o.env);
                done();
            }, { once: true });
            ext.loseContext();
        });
    }
    /* the nick/mass pass as it is inline in renderFrame before drawWebGLTextPass existed */
    function textPassInline(R, env) {
        var worldGl = R.gl, LM = env.LM, defaultSettings = env.defaultSettings;
        if (!(R.glTextProgram && R.glTextVAO)) return;
        R._lmTextFrameBegin();
        worldGl.enable(worldGl.DEPTH_TEST);
        worldGl.depthFunc(worldGl.LEQUAL);
        worldGl.depthMask(false);
        var s = R.scale || 1;
        worldGl.useProgram(R.glTextProgram);
        worldGl.uniform2f(R.u_text_viewCenter, R.camX, R.camY);
        worldGl.uniform2f(R.u_text_viewScale, 2.0 * s / R.canvasWidth, 2.0 * s / R.canvasHeight);
        worldGl.uniform1i(R.u_text_tex, 0);
        worldGl.uniform1f(R.u_text_alpha, defaultSettings.textAlpha != null ? defaultSettings.textAlpha : 1.0);
        worldGl.bindVertexArray(R.glTextVAO);
        for (var i = 0; i < LM.cells.length; i++) {
            var c = LM.cells[i];
            if (!c || !c._webglRendered) continue;
            try { R.drawWebGLCellText(c); } catch (e) { }
        }
        worldGl.bindVertexArray(null);
        worldGl.depthMask(true);
        worldGl.depthFunc(worldGl.LESS);
    }
    function frame(o) {
        var R = o.R, gl = R.gl, env = o.env;
        R._jellyFrameId = (R._jellyFrameId || 0) + 1;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        var t0 = performance.now();
        var ok = R.drawWebGLCellBatch(env.LM.cells);
        if (!ok) return false;
        var t1 = performance.now();
        R.drawWebGLMultiboxRings();
        if (typeof R.drawWebGLTextPass === 'function') R.drawWebGLTextPass(gl, env.LM.cells);
        else textPassInline(R, env);
        gl.disable(gl.DEPTH_TEST);
        o.tCells = t1 - t0;
        o.tText = performance.now() - t1;
        return true;
    }
    function pixels(R) {
        var gl = R.gl, buf = new Uint8Array(W * H * 4);
        gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        return buf;
    }
    /* the frame as a PNG data URL (rows flipped: readPixels starts at the bottom) */
    function png(px) {
        var c = document.createElement('canvas');
        c.width = W; c.height = H;
        var x = c.getContext('2d'), img = x.createImageData(W, H);
        for (var y = 0; y < H; y++) img.data.set(px.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4);
        x.putImageData(img, 0, 0);
        return c.toDataURL('image/png');
    }
    function diff(a, b) {
        var max = 0, sum = 0, n = 0, big = 0, lit = 0, hash = 0;
        for (var i = 0; i < a.length; i++) {
            hash = (Math.imul(hash, 31) + b[i]) | 0;
            var d = Math.abs(a[i] - b[i]);
            if (d) { n++; sum += d; if (d > max) max = d; if (d > 8) big++; }
            if ((i & 3) === 3 && a[i]) lit++;
        }
        return { max: max, mean: sum / a.length, differing: n, over8: big, litPixels: lit, hashNew: hash };
    }
    /* counts draw calls, GL calls and uploaded bytes by wrapping the context's methods */
    function instrument(gl) {
        var st = { draws: 0, calls: 0, bytes: 0 };
        var draw = { drawArrays: 1, drawElements: 1, drawArraysInstanced: 1, drawElementsInstanced: 1, drawRangeElements: 1 };
        var names = [];
        for (var k in gl) if (typeof gl[k] === 'function' && k !== 'getError') names.push(k);
        names.forEach(function (k) {
            var f = gl[k];
            gl[k] = function () {
                st.calls++;
                if (draw[k]) st.draws++;
                if (k === 'bufferSubData' || k === 'bufferData') {
                    var d = arguments[2];
                    if (d && d.byteLength !== undefined) st.bytes += d.byteLength;
                } else if (k === 'texSubImage2D' || k === 'texImage2D' || k === 'texSubImage3D' || k === 'texImage3D') {
                    var src = arguments[arguments.length - 1];
                    if (src && src.width) st.bytes += src.width * src.height * 4;
                }
                return f.apply(gl, arguments);
            };
        });
        return { st: st, remove: function () { names.forEach(function (k) { delete gl[k]; }); } };
    }
    function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.length ? s[(s.length - 1) >> 1] : 0; }
    /* Label atlas uploads of the working copy: each label made through getOrCreateTextTexture must
     * hold, in its atlas slot, exactly the texels its own texture gets from the same raster
     * (texImage2D, the per-label path before the atlas), and no texSubImage3D may read a canvas
     * (that read waits for the GPU: tens of ms per label on integrated GPUs). */
    function atlasUploads(src, defaults) {
        var o = setup(src, defaults, { scale: 0.35, jelly: true }, []), R = o.R, gl = R.gl;
        var labels = [['Legend', '700 34px Ubuntu', '#ffffff', '#000000', 3], ['1.5k', '700 26px Ubuntu', '#ffffff', '#000000', 3], ['7', '700 12px Ubuntu', '#ffffff', '#000000', 2],
            ['ΛΕΓΕΝΤ ★', '700 40px Ubuntu', '#ffcc00', '#202020', 4], ['P123', '400 18px Arial', 'rgba(255,255,255,0.7)', '', 0],
            ['玩家🔥', '700 64px Ubuntu', '#33ff33', '#000', 5], ['half', '700 30px Ubuntu', 'rgba(200,100,50,0.5)', 'rgba(0,0,0,0.3)', 3]];
        var canvasReads = 0, t3 = gl.texSubImage3D;
        gl.texSubImage3D = function () { var s = arguments[arguments.length - 1]; if (s && s.getContext) canvasReads++; return t3.apply(gl, arguments); };
        var res = { canvasReads: 0, inAtlas: 0, max: 0, differing: 0, labels: labels.length };
        var fb = gl.createFramebuffer(), own = gl.createTexture();
        function read(attach, w, h) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
            attach();
            var b = new Uint8Array(w * h * 4);
            gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, b);
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            return b;
        }
        try {
            for (var i = 0; i < labels.length; i++) {
                var l = labels[i], e = R.getOrCreateTextTexture(l[0], l[1], l[2], l[3], l[4]);
                if (!e || !e.slot) continue;
                res.inAtlas++;
                var a = R._lmTextAtlas, sl = e.slot;
                var got = read(function () { gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, a.tex, 0, sl.page); }, 2048, 1024);
                R._lmRasterText(l[0], l[1], l[2], l[3], l[4]);
                gl.bindTexture(gl.TEXTURE_2D, own);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, R._textCanvas);
                gl.bindTexture(gl.TEXTURE_2D, null);
                var want = read(function () { gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, own, 0); }, e.w, e.h);
                for (var y = 0; y < e.h; y++) for (var x = 0; x < e.w * 4; x++) {
                    var d = Math.abs(got[((sl.y + y) * 2048 + sl.x) * 4 + x] - want[y * e.w * 4 + x]);
                    if (d) { res.differing++; if (d > res.max) res.max = d; }
                }
            }
        } finally { gl.texSubImage3D = t3; }
        res.canvasReads = canvasReads;
        res.glError = gl.getError();
        gl.deleteFramebuffer(fb); gl.deleteTexture(own);
        gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    return {
        atlasUploads: atlasUploads,
        compare: async function (oldSrc, newSrc, defaults, cfg, scene) {
            var a = setup(oldSrc, defaults, cfg, scene), b = setup(newSrc, defaults, cfg, scene);
            /* two frames: textures are made in the first, the second is the steady state */
            frame(a); frame(b);
            if (cfg.restore) {
                await loseAndRestore(a);
                await loseAndRestore(b);
                frame(a); frame(b);
            }
            var okA = frame(a), okB = frame(b);
            var pa = pixels(a.R), pb = pixels(b.R);
            var r = diff(pa, pb);
            r.okOld = okA; r.okNew = okB;
            r.glError = b.R.gl.getError();
            if (cfg.dump) { r.pngOld = png(pa); r.pngNew = png(pb); }
            a.R.gl.getExtension('WEBGL_lose_context').loseContext();
            b.R.gl.getExtension('WEBGL_lose_context').loseContext();
            return r;
        },
        bench: function (src, defaults, cfg, scene, frames) {
            var o = setup(src, defaults, cfg, scene), gl = o.R.gl;
            /* churn: the smallest body loses or gets back a point in every frame, so the point
             * counts of the whole frame change (the worst case for reusing index lists) */
            var c0 = o.env.LM.cells[0], spare = null;
            var churn = function () {
                if (!cfg.churn) return;
                if (spare) { c0.points.push(spare); spare = null; } else spare = c0.points.pop();
            };
            for (var w = 0; w < 5; w++) { churn(); frame(o); }
            var ins = instrument(gl);
            churn();
            frame(o);
            var st = ins.st;
            ins.remove();
            var px = new Uint8Array(4), submit = [], sync = [], tc = [], tt = [];
            gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
            for (var f = 0; f < frames; f++) {
                churn();
                var t0 = performance.now();
                frame(o);
                var t1 = performance.now();
                gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
                var t2 = performance.now();
                submit.push(t1 - t0);
                sync.push(t2 - t0);
                tc.push(o.tCells);
                tt.push(o.tText);
            }
            var e = gl.getExtension('WEBGL_debug_renderer_info');
            var res = { draws: st.draws, calls: st.calls, bytes: st.bytes, submit: median(submit), sync: median(sync), cells: median(tc), text: median(tt),
                renderer: gl.getParameter(e ? e.UNMASKED_RENDERER_WEBGL : gl.RENDERER) };
            gl.getExtension('WEBGL_lose_context').loseContext();
            return res;
        }
    };
}

async function main() {
    const chrome = findChrome();
    if (!chrome) { console.log('glbatch: skipped (Chrome not found; set CHROME_PATH)'); return; }
    let oldText;
    try { oldText = readOld(); } catch (e) { console.log('glbatch: skipped (reference version not available: ' + e.message.split('\n')[0] + ')'); return; }
    const NEW = rendererFactory(fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8'));
    const OLD = rendererFactory(oldText);

    const J = bench.loadJelly();
    await J.initWasm();
    J.setEngine('wasm');

    const port = 9300 + Math.floor(Math.random() * 500);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-glbatch-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', '--ignore-gpu-blocklist', '--window-size=1920,1080',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []), 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws;
    const done = (code) => { try { ws && ws.close(); } catch (e) { } proc.kill(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } process.exit(code); }, 300); };
    try {
        let ver;
        for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); } catch (e) { await sleep(200); } }
        if (!ver) { console.log('glbatch: skipped (Chrome did not start)'); return done(0); }
        const page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page');
        ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 0;
        const pending = new Map(), errors = [];
        ws.onmessage = (ev) => {
            const m = JSON.parse(ev.data);
            if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
            else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
        };
        await new Promise((r) => (ws.onopen = r));
        const send = (method, params) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
        const evaluate = async (expr) => {
            const m = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
            if (m.error) throw new Error(m.error.message);
            if (m.result.exceptionDetails) throw new Error((m.result.exceptionDetails.exception && m.result.exceptionDetails.exception.description) || m.result.exceptionDetails.text);
            return m.result.result.value;
        };
        await send('Runtime.enable');
        await evaluate('window.__glbSkinned = ' + JSON.stringify(SKINNED) + '; window.__glb = (' + pageLib.toString() + ')(); ' +
            'window.__glbOld = ' + JSON.stringify(OLD.factory) + '; window.__glbNew = ' + JSON.stringify(NEW.factory) + '; ' +
            'window.__glbDefaults = ' + NEW.defaults + '; true');

        const sceneCache = new Map();
        const scene = async (n, seed) => {
            const k = n + ':' + seed;
            if (!sceneCache.has(k)) sceneCache.set(k, await buildScene(J, n, seed));
            return sceneCache.get(k);
        };
        let failed = 0;
        const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

        /* ---- visual comparison ---- */
        const cases = [
            { name: 'jelly on, labels on', jelly: true },
            { name: 'jelly off, labels on', jelly: false },
            { name: 'jelly on, labels off', jelly: true, map: { noNames: true, showMass: false } },
            { name: 'jelly off, labels off', jelly: false, map: { noNames: true, showMass: false } },
            { name: 'jelly on, transparent cells/skins/viruses, text alpha', jelly: true,
                map: { transparentCells: true, transparentSkins: true, transparentViruses: true },
                settings: { cellsAlpha: 0.6, skinsAlpha: 0.5, virusAlpha: 0.4, textAlpha: 0.7 } },
            { name: 'jelly on, zoomed in (large labels), short mass, no strokes', jelly: true, scale: 1.1, camX: 300, camY: -200,
                map: { shortMass: true, namesStroke: false, massStroke: false } },
            { name: 'jelly on, hide own name/mass, hide teammates names', jelly: true, map: { hideMyName: true, hideMyMass: true, hideTeammatesNames: true } },
            { name: 'jelly on, labels on, after WebGL context loss and restore', jelly: true, restore: true },
            { name: 'jelly off, labels on, after WebGL context loss and restore', jelly: false, restore: true }
        ];
        const stats = [];
        for (const c of cases) {
            const cfg = Object.assign({ scale: 0.35, dump: !!opt('--dump', null) }, c);
            const sc = await scene(500, 777);
            const r = await evaluate('__glb.compare(__glbOld, __glbNew, __glbDefaults, ' + JSON.stringify(cfg) + ', ' + JSON.stringify(sc) + ')');
            if (r.pngOld) {
                for (const k of ['pngOld', 'pngNew']) {
                    fs.writeFileSync(path.join(opt('--dump'), 'case' + cases.indexOf(c) + '-' + k.slice(3).toLowerCase() + '.png'), Buffer.from(r[k].split(',')[1], 'base64'));
                    delete r[k];
                }
            }
            stats.push(Object.assign({ case: c.name }, r));
            const pct = (100 * r.differing / (1920 * 1080 * 4)).toFixed(3);
            console.log('     ' + c.name + ': max diff ' + r.max + ', mean ' + r.mean.toFixed(5) + ', channels differing ' + r.differing + ' (' + pct + '%), >8: ' + r.over8 + ', lit pixels ' + r.litPixels);
            check(c.name + ': both draw on WebGL, no GL error', r.okOld && r.okNew && r.glError === 0);
            /* identical geometry and textures: only rounding of the sub-texel weights may differ */
            check(c.name + ': same picture as the reference (max channel diff <= 8, < 0.05% channels over 8)', r.max <= 8 || r.over8 < 1920 * 1080 * 4 * 0.0005);
            check(c.name + ': the scene is not empty', r.litPixels > 1920 * 1080 * 0.05);
        }
        /* the labels are really drawn: labels on and off give different pictures */
        check('labels are drawn (labels on and off differ)', stats[0].hashNew !== stats[2].hashNew && stats[1].hashNew !== stats[3].hashNew);
        const au = await evaluate('__glb.atlasUploads(__glbNew, __glbDefaults)');
        console.log('     label atlas: ' + au.inAtlas + '/' + au.labels + ' labels in the atlas, texels differing from their own texture ' + au.differing + ' (max ' + au.max + '), canvas reads by texSubImage3D ' + au.canvasReads);
        check('label atlas: every label in the atlas, the same texels as its own texture, no GL error', au.inAtlas === au.labels && au.differing === 0 && au.glError === 0);
        check('label atlas: no texSubImage3D from a canvas (a GPU wait per label)', au.canvasReads === 0);
        if (errors.length) { console.log('page errors:\n  ' + errors.join('\n  ')); failed++; }
        if (opt('--out', null)) fs.writeFileSync(path.join(opt('--out'), 'glbatch-diff.json'), JSON.stringify(stats, null, 2));

        /* ---- CPU profile of the working copy's frames (--profile N bodies, --jelly off) ---- */
        if (opt('--profile', null)) {
            const n = parseInt(opt('--profile'), 10);
            const sc = await scene(n, 4242 + n);
            const cfg = { scale: 0.35, jelly: opt('--jelly', 'on') !== 'off' };
            await send('Profiler.enable');
            await send('Profiler.setSamplingInterval', { interval: 100 });
            await send('Profiler.start');
            await evaluate('__glb.bench(__glbNew, __glbDefaults, ' + JSON.stringify(cfg) + ', ' + JSON.stringify(sc) + ', 40)');
            const prof = (await send('Profiler.stop')).result.profile;
            const self = new Map();
            const dt = prof.timeDeltas, byId = new Map(prof.nodes.map((nd) => [nd.id, nd]));
            const hits = new Map();
            prof.samples.forEach((sid, i) => hits.set(sid, (hits.get(sid) || 0) + (dt[i] || 0)));
            hits.forEach((us, sid) => {
                const cf = byId.get(sid).callFrame;
                const k = (cf.functionName || '(anon)') + ' :' + cf.lineNumber;
                self.set(k, (self.get(k) || 0) + us);
            });
            const total = [...self.values()].reduce((a, b) => a + b, 0);
            console.log('\nself time, ' + n + ' bodies, jelly ' + (cfg.jelly ? 'on' : 'off') + ' (45 frames incl. setup):');
            [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, us]) => console.log('  ' + (us / 1000).toFixed(1).padStart(8) + ' ms ' + (100 * us / total).toFixed(1).padStart(5) + '%  ' + k));
        }

        /* ---- benchmark ---- */
        if (BENCH) {
            const bodies = opt('--bodies', '100,500,1000,2000').split(',').map(Number);
            const frames = parseInt(opt('--frames', '30'), 10);
            const rows = [];
            const repeats = parseInt(opt('--repeat', '3'), 10);
            /* the lower median of several alternating runs: background load on the machine only
             * ever adds time */
            const best = (a, b) => { if (!a) return b; for (const k of ['submit', 'sync', 'cells', 'text']) a[k] = Math.min(a[k], b[k]); return a; };
            const modes = [{ label: 'on ', jelly: true }, { label: 'on*', jelly: true, churn: true }, { label: 'off', jelly: false }];
            for (const m of modes) {
                for (const n of bodies) {
                    const sc = await scene(n, 4242 + n);
                    const cfg = { scale: 0.35, jelly: m.jelly, churn: !!m.churn };
                    let o = null, nw = null;
                    for (let r = 0; r < repeats; r++) {
                        o = best(o, await evaluate('__glb.bench(__glbOld, __glbDefaults, ' + JSON.stringify(cfg) + ', ' + JSON.stringify(sc) + ', ' + frames + ')'));
                        nw = best(nw, await evaluate('__glb.bench(__glbNew, __glbDefaults, ' + JSON.stringify(cfg) + ', ' + JSON.stringify(sc) + ', ' + frames + ')'));
                    }
                    rows.push({ jelly: m.label, n, cells: sc.length, o, nw });
                }
            }
            console.log('\nrenderer: ' + rows[0].o.renderer);
            console.log('per frame, labels on (reference -> working copy; on* = point counts change every frame); CPU ms = median JS time of cell batch + rings + text pass; sync = until a 1-pixel readPixels returns');
            console.log('jelly bodies cells | draw calls     | GL calls        | upload KB         | CPU ms        | (bodies / labels)          | sync ms');
            for (const r of rows) {
                const f = (a, b, d) => (d !== undefined ? a.toFixed(d) : a) + ' -> ' + (d !== undefined ? b.toFixed(d) : b);
                console.log([r.jelly.padEnd(5), String(r.n).padStart(6), String(r.cells).padStart(5), '|',
                    f(r.o.draws, r.nw.draws).padEnd(14), '|', f(r.o.calls, r.nw.calls).padEnd(15), '|', f(r.o.bytes / 1024, r.nw.bytes / 1024, 0).padEnd(17), '|',
                    f(r.o.submit, r.nw.submit, 2).padEnd(13), '|', (f(r.o.cells, r.nw.cells, 2) + ' / ' + f(r.o.text, r.nw.text, 2)).padEnd(26), '|', f(r.o.sync, r.nw.sync, 2)].join(' '));
            }
            if (args.indexOf('--json') >= 0) console.log(JSON.stringify(rows));
        }
        if (failed) { console.log(failed + ' check(s) failed'); return done(1); }
        console.log('glbatch ok' + (BENCH ? '' : ' (run with --bench for draw calls, upload bytes and CPU time)'));
        return done(0);
    } catch (e) {
        console.log('glbatch error:', e && e.stack || e);
        return done(1);
    }
}

module.exports = { rendererFactory, findChrome };

if (require.main === module) main();
