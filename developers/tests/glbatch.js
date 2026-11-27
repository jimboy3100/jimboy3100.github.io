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
    'lmSkinLayersNew', 'lmSkinLayerPick', 'lmSkinLayerTake', 'lmSkinLayerTouch', 'lmSkinUnpremulLut', 'lmSkinJobPick', 'lmSkinJobsRun', 'lmSkinSlack',
    'lmMultiboxRingPlayer', 'lmMultiboxRingColor', 'lmMultiboxRing',
    'lmJellyFanIndices', 'lmJellyBandIndices', 'lmTextAtlasNew', 'lmTextAtlasAlloc', 'lmTextAtlasFree', 'lmTextAtlasLayers', 'lmTextAtlasStep', 'lmTextAtlasMaxPages',
    'lmSkinsShown', 'lmColorInt'];
const VARS = ['LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_MIN_SCREEN_PX', '_lmColorIntCache'];

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
            /* the atlas full (no more pages): a new label keeps its own texture; once slots are
             * freed it is copied into the atlas (_lmTextAdopt) and must hold the same texels */
            if (typeof R._lmTextAdopt === 'function') {
                var at = R._lmTextAtlas, fillers = [], late = null, lf = ['L000000', '700 150px Ubuntu', '#ff8040', '#000000', 6];
                at.alloc.maxPages = at.alloc.pages.length;
                for (var k = 0; k < 400 && !late; k++) {
                    var fe = R.getOrCreateTextTexture('L' + (100000 + k), lf[1], lf[2], lf[3], lf[4]);
                    if (fe && fe.tex) late = { e: fe, text: 'L' + (100000 + k) };
                    else if (fe) fillers.push('L' + (100000 + k) + '|' + lf[1] + '|' + lf[2] + '|' + lf[3] + '|' + lf[4]);
                }
                res.adoptFallback = !!late;
                if (late) {
                    /* the first labels of that size give their slots back */
                    for (var q = 0; q < 6 && q < fillers.length; q++) {
                        var old = R.glTextCache.get(fillers[q]);
                        R._lmTextRelease(old);
                        R._lmTextBytes -= old.bytes;
                        R.glTextCache.delete(fillers[q]);
                    }
                    var e2 = R.getOrCreateTextTexture(late.text, lf[1], lf[2], lf[3], lf[4]);
                    res.adopted = e2 === late.e && !!e2.slot && !e2.tex;
                    if (res.adopted) {
                        var sl2 = e2.slot;
                        var got2 = read(function () { gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, at.tex, 0, sl2.page); }, 2048, 1024);
                        R._lmRasterText(late.text, lf[1], lf[2], lf[3], lf[4]);
                        gl.bindTexture(gl.TEXTURE_2D, own);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, R._textCanvas);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        var want2 = read(function () { gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, own, 0); }, e2.w, e2.h);
                        res.adoptDiffering = 0;
                        for (var y2 = 0; y2 < e2.h; y2++) for (var x2 = 0; x2 < e2.w * 4; x2++) {
                            if (got2[((sl2.y + y2) * 2048 + sl2.x) * 4 + x2] !== want2[y2 * e2.w * 4 + x2]) res.adoptDiffering++;
                        }
                    }
                }
            }
        } finally { gl.texSubImage3D = t3; }
        res.canvasReads = canvasReads;
        res.glError = gl.getError();
        gl.deleteFramebuffer(fb); gl.deleteTexture(own);
        gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    /* A dense world's labels (the bench's 1500 big cells: about a thousand mass texts at the
     * fixed 100 px raster and hundreds of nicks in many sizes, 17 pages of texels) need more than the 16 pages the
     * atlas was held to: every label must still get a slot (no texture and draw call of its own),
     * within the page limit of the memory budget. capPages: the old limit, for comparison. */
    function atlasCapacity(src, defaults, capPages) {
        var o = setup(src, defaults, { scale: 0.35, jelly: true }, []), R = o.R, gl = R.gl;
        var res = { labels: 0, own: 0, pages: 0, layers: 0, maxPages: 0, texels: 0 };
        if (typeof R._lmTextAtlasGet !== 'function') { gl.getExtension('WEBGL_lose_context').loseContext(); return null; }
        R._lmTextFrame = 5;
        var a = R._lmTextAtlasGet();
        if (capPages) a.alloc.maxPages = Math.min(a.alloc.maxPages, capPages);
        var sizes = [16, 18, 20, 23, 26, 29, 33, 37, 41, 47, 53, 59, 67, 75, 84];
        for (var i = 0; i < 450; i++) {
            var e = R.getOrCreateTextTexture('Player ' + i, '700 ' + sizes[i % sizes.length] + 'px Ubuntu', '#ffffff', '#000000', Math.round(sizes[i % sizes.length] * 0.1));
            res.labels++;
            if (!e || !e.slot) res.own++;
            if (e) res.texels += e.w * e.h;
        }
        /* mass texts until the labels hold 17 pages of texels: more than 16 pages can take */
        for (var m = 0; m < 3000 && res.texels < 17 * a.w * a.h; m++) {
            var me = R._lmMassTexture({ id: m }, String(1000 + (m * 7) % 9000), '700 100px Ubuntu', '#ffffff', '#000000', 10);
            res.labels++;
            if (!me || !me.slot) res.own++;
            if (me) res.texels += me.w * me.h;
        }
        res.pages = R._lmTextAtlas.alloc.pages.length;
        res.layers = R._lmTextAtlas.layers;
        res.maxPages = R._lmTextAtlas.alloc.maxPages;
        res.glError = gl.getError();
        gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    /* one virus in the middle of the screen with the theme's virus colours of cfg.settings: the
     * colour of its body */
    function virusPixel(src, defaults, cfg) {
        var pts = [], n = 64, r = 120;
        for (var i = 0; i < n; i++) pts.push(Math.cos(i / n * 2 * Math.PI) * r, Math.sin(i / n * 2 * Math.PI) * r);
        var o = setup(src, defaults, cfg, [{ id: 1, x: 0, y: 0, size: r, isVirus: true, maxPointRad: r, pts: pts }]);
        frame(o);
        var ok = frame(o), gl = o.R.gl, px = new Uint8Array(4);
        /* inside the body, away from the mass label in the middle */
        gl.readPixels(W / 2 + 60, H / 2 + 40, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        var err = gl.getError();
        gl.getExtension('WEBGL_lose_context').loseContext();
        return { ok: ok, px: Array.prototype.slice.call(px), glError: err };
    }
    /* Skin layer uploads: the same skins go through uploadSkinTexture of the reference and of the
     * working copy (decoded off the main thread, cut to the circle, put into a layer from a
     * requestAnimationFrame job; the canvas path for nodes without an image behind them) and
     * every layer must hold the same texels in both. Skins: opaque, with soft transparency, an
     * odd-sized one (resized), a 2-frame sheet (_lmSrcRect), one decoded from its Blob, a 256 px
     * cacheSkin canvas (graphics medium), an image without a canvas (no circle cut) and a canvas
     * without an image behind it. Also counts texSubImage3D / texImage2D calls that read a canvas
     * the browser keeps in CPU memory (that upload waits for the GPU: 20-70 ms per skin). */
    async function skinUploads(oldSrc, newSrc, defaults) {
        function paint(w, h, kind) {
            var c = document.createElement('canvas');
            c.width = w; c.height = h;
            var x = c.getContext('2d');
            for (var i = 0; i < 12; i++) {
                x.fillStyle = 'hsl(' + (i * 37 + kind * 50) + ',80%,' + (35 + (i % 3) * 15) + '%)';
                x.fillRect((i % 4) * w / 4, ((i / 4) | 0) * h / 3, w / 4 + 1, h / 3 + 1);
            }
            x.strokeStyle = '#fff'; x.lineWidth = 7;
            x.beginPath(); x.moveTo(0, 0); x.lineTo(w, h); x.moveTo(w, 0); x.lineTo(0, h); x.stroke();
            x.font = '700 ' + Math.round(h / 4) + 'px Arial'; x.fillStyle = '#000'; x.fillText('LM' + kind, w / 5, h / 2);
            if (kind === 1 || kind === 4) {
                /* soft transparency: an alpha ramp and a hole */
                x.globalCompositeOperation = 'destination-out';
                var g = x.createLinearGradient(0, 0, w, 0);
                g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.9)');
                x.fillStyle = g; x.fillRect(0, 0, w, h);
                x.fillStyle = 'rgba(0,0,0,0.5)'; x.beginPath(); x.arc(w / 2, h / 2, h / 6, 0, 7); x.fill();
            }
            return c;
        }
        function load(c) {
            return new Promise(function (done) { c.toBlob(done, 'image/png'); }).then(function (blob) {
                var img = new Image();
                img.src = URL.createObjectURL(blob);
                return img.decode().then(function () { return { img: img, blob: blob }; });
            });
        }
        function cutCanvas(img, depth, rect) {
            var c = document.createElement('canvas');
            c.width = c.height = depth;
            var x = c.getContext('2d');
            x.beginPath(); x.arc(depth / 2, depth / 2, depth / 2, 0, 2 * Math.PI, false); x.clip();
            if (rect) x.drawImage(img, rect[0], rect[1], rect[2], rect[3], 0, 0, depth, depth);
            else x.drawImage(img, 0, 0, depth, depth);
            c._lmSrc = img; c._lmCircle = true;
            if (rect) c._lmSrcRect = rect;
            return c;
        }
        var specs = [[512, 512, 0, 'canvas'], [512, 512, 1, 'canvas'], [300, 220, 2, 'canvas'], [1024, 512, 3, 'sheet'], [512, 512, 4, 'blob'],
            [512, 512, 5, 'canvas256'], [400, 400, 6, 'image'], [512, 512, 7, 'plain']];
        var imgs = [];
        for (var s = 0; s < specs.length; s++) imgs.push(await load(paint(specs[s][0], specs[s][1], specs[s][2])));
        function nodes() {
            return specs.map(function (sp, i) {
                var im = imgs[i].img;
                if (sp[3] === 'image') return im;
                if (sp[3] === 'plain') { var p = cutCanvas(im, 512); p._lmSrc = null; p._lmCircle = true; return p; }
                if (sp[3] === 'sheet') return cutCanvas(im, 512, [0, 0, sp[0] / 2, sp[1]]);
                if (sp[3] === 'blob') { var b = new Image(); b.src = im.src; b._lmBlob = imgs[i].blob; return b.decode().then(function () { return cutCanvas(b, 512); }); }
                return cutCanvas(im, sp[3] === 'canvas256' ? 256 : 512);
            });
        }
        async function run(src) {
            var o = setup(src, defaults, { scale: 0.35, jelly: true }, []), R = o.R, gl = R.gl;
            var st = { cpuReads: 0, canvasReads3D: 0 };
            var t3 = gl.texSubImage3D, t2 = gl.texImage2D;
            /* a canvas made with willReadFrequently (or one Chrome moved to the CPU) */
            var cpu = function (c) { try { return !!(c && c.getContext && c._lmCtx && c._lmCtx.getContextAttributes && c._lmCtx.getContextAttributes().willReadFrequently); } catch (e) { return false; } };
            gl.texSubImage3D = function () { var c = arguments[arguments.length - 1]; if (c && c.getContext) st.canvasReads3D++; if (cpu(c)) st.cpuReads++; return t3.apply(gl, arguments); };
            gl.texImage2D = function () { var c = arguments[arguments.length - 1]; if (cpu(c)) st.cpuReads++; return t2.apply(gl, arguments); };
            var ns = await Promise.all(nodes()), layers = [];
            for (var i = 0; i < ns.length; i++) {
                var url = 'https://skins.test/up' + i + '.png';
                R._glSkinFrame = (R._glSkinFrame || 0) + 3;
                R.uploadSkinTexture(url, ns[i]);
                for (var f = 0; f < 200 && !(R.glSkinMap[url] >= 0) && R.glSkinMap[url] !== -1; f++) await new Promise(function (d) { requestAnimationFrame(d); });
                layers.push(R.glSkinMap[url]);
            }
            gl.texSubImage3D = t3; gl.texImage2D = t2;
            var fb = gl.createFramebuffer(), texels = [];
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
            for (var l = 0; l < layers.length; l++) {
                var b = new Uint8Array(512 * 512 * 4);
                if (layers[l] >= 0) {
                    gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, R.glSkinArray, 0, layers[l]);
                    gl.readPixels(0, 0, 512, 512, gl.RGBA, gl.UNSIGNED_BYTE, b);
                }
                texels.push(b);
            }
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
            st.layers = layers;
            st.glError = gl.getError();
            st.texels = texels;
            gl.getExtension('WEBGL_lose_context').loseContext();
            return st;
        }
        var a = await run(oldSrc), b = await run(newSrc);
        var res = { skins: specs.length, uploadedOld: 0, uploadedNew: 0, differing: 0, max: 0, partial: 0, perSkin: [], cpuReadsOld: a.cpuReads, cpuReadsNew: b.cpuReads,
            canvasReads3DNew: b.canvasReads3D, glError: b.glError };
        for (var k = 0; k < specs.length; k++) {
            if (a.layers[k] >= 0) res.uploadedOld++;
            if (b.layers[k] >= 0) res.uploadedNew++;
            var ta = a.texels[k], tb = b.texels[k], dn = 0, partial = 0;
            for (var q = 0; q < ta.length; q++) {
                var d = Math.abs(ta[q] - tb[q]);
                if (d) { dn++; if (d > res.max) res.max = d; }
                if ((q & 3) === 3 && ta[q] > 0 && ta[q] < 255) partial++;
            }
            res.differing += dn;
            res.partial += partial;
            res.perSkin.push(specs[k][3] + specs[k][2] + ':' + dn);
        }
        res.sweep = gpuPutSweep(newSrc, defaults);
        return res;
    }
    /* Every premultiplied colour value at every alpha (a CPU canvas filled with putImageData)
     * through _lmSkinGpuPut must give the texels texSubImage3D from that canvas gives (the
     * browser's CPU conversion), and the GL state the frame relies on must be as before. */
    function gpuPutSweep(src, defaults0) {
        var o = setup(src, defaults0, { scale: 0.35, jelly: true }, []), R = o.R, gl = R.gl;
        var res = { available: typeof R._lmSkinGpuPut === 'function' && !!R._lmSkinPut, differing: 0, max: 0, state: [] };
        if (!res.available) { gl.getExtension('WEBGL_lose_context').loseContext(); return res; }
        var cv = document.createElement('canvas');
        cv.width = cv.height = 512;
        var cx = cv.getContext('2d', { willReadFrequently: true }), id = cx.createImageData(512, 512);
        for (var y = 0; y < 512; y++) for (var x = 0; x < 512; x++) {
            /* quadrants: colour value x & 255 at alpha y & 255, with different channel orders */
            var u = x & 255, al = y & 255, q = (x >> 8) + 2 * (y >> 8), i = (y * 512 + x) * 4;
            id.data[i] = q & 1 ? 255 - u : u; id.data[i + 1] = q & 2 ? u : 255 - u; id.data[i + 2] = (u * 7 + q * 50) & 255; id.data[i + 3] = al;
        }
        cx.putImageData(id, 0, 0);
        /* the frame's state before the upload job */
        var vao = gl.createVertexArray();
        gl.useProgram(R.glProgram);
        gl.bindVertexArray(vao);
        gl.enable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
        gl.viewport(0, 0, W, H);
        gl.activeTexture(gl.TEXTURE0);
        var snap = function () {
            return [gl.getParameter(gl.CURRENT_PROGRAM) === R.glProgram, gl.getParameter(gl.VERTEX_ARRAY_BINDING) === vao, gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING) === null,
                Array.from(gl.getParameter(gl.VIEWPORT)).join(), gl.isEnabled(gl.BLEND), gl.isEnabled(gl.DEPTH_TEST), gl.isEnabled(gl.DITHER), gl.getParameter(gl.ACTIVE_TEXTURE),
                gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL)].join('|');
        };
        var before = snap();
        R._lmSkinGpuPut(cv, 5, true);
        var after = snap();
        res.stateKept = before === after;
        res.state = [before, after];
        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, R.glSkinArray);
        gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 6, 512, 512, 1, gl.RGBA, gl.UNSIGNED_BYTE, cv);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        var fb = gl.createFramebuffer(), got = new Uint8Array(512 * 512 * 4), want = new Uint8Array(512 * 512 * 4);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
        gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, R.glSkinArray, 0, 5);
        gl.readPixels(0, 0, 512, 512, gl.RGBA, gl.UNSIGNED_BYTE, got);
        gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, R.glSkinArray, 0, 6);
        gl.readPixels(0, 0, 512, 512, gl.RGBA, gl.UNSIGNED_BYTE, want);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        for (var k = 0; k < got.length; k++) {
            var d = Math.abs(got[k] - want[k]);
            if (d) { res.differing++; if (d > res.max) res.max = d; }
        }
        res.glError = gl.getError();
        /* a texture array that cannot be drawn into (no storage: incomplete attachment): false,
         * so the caller uploads from the canvas, and the frame's state as before */
        var realArr = R.glSkinArray, bad = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, bad);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        gl.useProgram(R.glProgram);
        gl.bindVertexArray(vao);
        gl.enable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
        gl.viewport(0, 0, W, H);
        gl.activeTexture(gl.TEXTURE0);
        var before2 = snap();
        R.glSkinArray = bad;
        var put2;
        try { put2 = R._lmSkinGpuPut(cv, 0, true); } catch (e) { put2 = 'threw ' + e; }
        R.glSkinArray = realArr;
        res.incomplete = { result: put2, stateKept: snap() === before2, glError: gl.getError() };
        /* the real array again: drawn on the GPU (asked once per array) */
        var put3 = R._lmSkinGpuPut(cv, 5, true);
        res.incomplete.realAgain = put3;
        gl.bindVertexArray(null);
        gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    return {
        atlasUploads: atlasUploads,
        atlasCapacity: atlasCapacity,
        virusPixel: virusPixel,
        skinUploads: skinUploads,
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
        const capOld = await evaluate('__glb.atlasCapacity(__glbNew, __glbDefaults, 16)');
        const cap = await evaluate('__glb.atlasCapacity(__glbNew, __glbDefaults, 0)');
        if (cap) {
            console.log('     dense labels: ' + cap.labels + ' labels, ' + cap.own + ' with their own texture, ' + cap.pages + ' pages used (' + cap.layers + ' allocated, limit ' + cap.maxPages + '), ' + (cap.texels / 2097152).toFixed(1) + ' pages of label texels' +
                (capOld ? '; held to 16 pages: ' + capOld.own + ' with their own texture' : ''));
            check('label atlas: a dense world\'s labels all get a slot (more than 16 pages, within the memory budget), no GL error',
                cap.own === 0 && cap.pages > 16 && cap.layers <= cap.maxPages && cap.glError === 0);
        }
        if (au.adoptFallback !== undefined) {
            console.log('     full atlas: a new label kept its own texture ' + au.adoptFallback + ', moved into the atlas once slots were freed ' + au.adopted + ', texels differing ' + au.adoptDiffering);
            check('label atlas full: the label keeps its own texture, then goes into a freed slot with the same texels', au.adoptFallback && au.adopted && au.adoptDiffering === 0 && au.glError === 0);
        }
        check('label atlas: no texSubImage3D from a canvas (a GPU wait per label)', au.canvasReads === 0);
        /* the virus colour of the Theme tab in every format it accepts (and Canvas2D draws): WebGL
         * read only #rgb and #rrggbb and drew the others grey (a green virus turned grey whenever
         * no skin made the frame fall back to Canvas2D) */
        const VCOLS = [['green', [0, 128, 0]], ['#00ff00ff', [0, 255, 0]], ['rgb(0, 255, 0)', [0, 255, 0]], ['rgba(0,200,0,1)', [0, 200, 0]], ['#0f0', [0, 255, 0]], ['#33ff33', [51, 255, 51]]];
        for (const jelly of [false, true]) {
            for (const [col, want] of VCOLS) {
                const cfg = { scale: 1, jelly: jelly, map: { virColors: false, virusGlow: false, transparentViruses: false }, settings: { virusColor: col, virusStrokeColor: col } };
                const nw = await evaluate('__glb.virusPixel(__glbNew, __glbDefaults, ' + JSON.stringify(cfg) + ')');
                let ref = null;
                try { ref = await evaluate('__glb.virusPixel(__glbOld, __glbDefaults, ' + JSON.stringify(cfg) + ')'); } catch (e) { }
                const near = nw.px.slice(0, 3).every((v, i) => Math.abs(v - want[i]) <= 3);
                console.log('     virus colour ' + col + ', jelly ' + (jelly ? 'on' : 'off') + ': body ' + nw.px.join(',') + (ref ? ' (reference ' + ref.px.join(',') + ')' : ''));
                check('jelly ' + (jelly ? 'on' : 'off') + ': a virus coloured ' + col + ' is drawn in that colour on WebGL', nw.ok && nw.glError === 0 && near);
            }
        }
        const su = await evaluate('__glb.skinUploads(__glbOld, __glbNew, __glbDefaults)');
        console.log('     skin layers: ' + su.uploadedNew + '/' + su.skins + ' uploaded (reference ' + su.uploadedOld + '), texels differing from the reference ' + su.differing + ' (max ' + su.max + ', ' +
            su.partial + ' semi-transparent texels) [' + su.perSkin.join(' ') + '], uploads from a CPU canvas: reference ' + su.cpuReadsOld + ', now ' + su.cpuReadsNew +
            ', texSubImage3D from a canvas now ' + su.canvasReads3DNew);
        check('skin layers: every skin uploaded, the same texels as the reference upload, no GL error', su.uploadedNew === su.skins && su.uploadedOld === su.skins && su.differing === 0 && su.glError === 0);
        check('skin layers: no upload from a CPU canvas and no texSubImage3D from a canvas (a GPU wait of 20-70 ms per new skin)', su.cpuReadsNew === 0 && su.canvasReads3DNew === 0);
        const sw = su.sweep;
        console.log('     GPU skin upload, every colour value at every alpha: texels differing from the canvas upload ' + sw.differing + ' (max ' + sw.max + '), GL state kept ' + sw.stateKept +
            (sw.stateKept ? '' : ' (' + sw.state.join(' -> ') + ')'));
        check('GPU skin upload: the same texels as texSubImage3D from the canvas for every premultiplied value, GL state as before, no GL error',
            sw.available && sw.differing === 0 && sw.stateKept && sw.glError === 0);
        console.log('     GPU skin upload into a layer that cannot be drawn into: ' + JSON.stringify(sw.incomplete));
        check('GPU skin upload: a layer that cannot be drawn into gives false (the canvas upload runs), GL state as before; the real layers still go on the GPU',
            !!sw.incomplete && sw.incomplete.result === false && sw.incomplete.stateKept && sw.incomplete.realAgain === true);
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
