/* Cell shadows (showCellShadows) with the WebGL renderer, using real code cut out of
 * ogario/ogario.v4.js.
 *
 * The drop shadow is the Canvas2D shadow of cell.draw; the GPU cell batch has no shadow pass,
 * so canUseWebGLScene keeps every frame with a shadowed cell on screen on Canvas2D (fallback
 * reason 'cellShadows'). Food and ejected mass cast no shadow and do not force Canvas2D.
 *
 * Node part (always): the real canUseWebGLScene on stub GL resources: shadows off keeps WebGL;
 * on with a cell or virus on screen goes to Canvas2D with the reason; frames with only food,
 * ejected mass or off-screen cells keep WebGL; the reason is cleared on the next frame.
 *
 * Headless Chrome part (skipped without Chrome): the real window.drawRender (initWebGL,
 * canUseWebGLScene, drawWebGLCellBatch) on a real WebGL2 canvas and the real cell.draw on a real
 * 2D canvas, composed like the page (main canvas, GL canvas above). Two overlapping cells (the
 * bigger one drawn later), food and ejected mass, jelly on (deformed perimeter) and off, the
 * WebGL renderer and plain Canvas2D, shadows off, default shadow (blur 20, offset 4) and a hard
 * shadow (blur 0, offset 8). Pixels: the shadow falls on the background and on the earlier
 * cell, never on the later cell, follows the jelly perimeter, is absent around food and ejected
 * mass, blur 0 is a hard edge, and the WebGL renderer with shadows on gives exactly the Canvas2D
 * picture.
 * node developers/tests/cellshadows.js [ogario.v4.js] */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { rendererFactory, findChrome } = require('./glbatch.js');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

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
    let m = null;
    for (let x; (x = re.exec(src)) && x.index < cellEnd;) m = x;
    if (!m) throw new Error('cell method ' + name + ' not found');
    return block(src, src.indexOf('function', m.index));
}
function topFn(name) {
    const m = new RegExp('\\nfunction ' + name + '\\(').exec(src);
    if (!m) throw new Error(name + ' not found');
    return block(src, m.index + 1);
}

const F = rendererFactory(src);
const D = new Function('return ' + F.defaults)();

/* ---------------- Node: the real canUseWebGLScene ---------------- */
{
    const LM = { cells: [], playerCells: [], playerCellsMulti: [], play: false, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false, indexedCells: {}, selected: null };
    const ms = Object.assign({}, D.defaultmapsettings, { webgl2Acceleration: true, cellContours: false, teammatesInd: false, FBTracking: false, showChat: false, spawnSpecialEffects: false, multiBoxShadow: false });
    const env = { window: { legendmod5: { optimizedMass: true } }, LM: LM, application: { customSkinsMap: {} }, defaultSettings: Object.assign({}, D.defaultSettings), defaultmapsettings: ms, ogarcopythelb: {}, ogario: { viewScale: 1 } };
    globalThis.dyinglight1load = 'no';
    const R = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/\}$/, ''))(env);
    Object.assign(R, { gl: {}, glCanvas: {}, glTextProgram: {}, overlayCtx: {}, glCellProgram: {}, glJellyProgram: {}, glJellyStrokeProgram: {}, glJellyVAO: {}, glJellyVBO: {},
        glJellyStrokeVAO: {}, glJellyStrokeVBO: {}, glMbRingProgram: {}, canvasWidth: 800, canvasHeight: 600, scale: 1, camX: 0, camY: 0 });
    const cell = (o) => Object.assign({ x: 0, y: 0, size: 60, isFood: false, isEjected: false, isVirus: false, invisible: false, removed: false, targetNick: '', nick: '' }, o);
    const player = cell({ x: 10, y: 10, size: 80 }), virus = cell({ x: -100, size: 100, isVirus: true });
    const food = cell({ x: 50, y: -50, size: 10, isFood: true }), ej = cell({ x: -50, y: 50, size: 18, isEjected: true });
    const far = cell({ x: 5000, y: 5000, size: 80 });
    const run = (cells) => { LM.cells = cells; const ok = R.canUseWebGLScene(cells); return { ok: ok, why: R._lmGlFallback }; };
    for (const jelly of [true, false]) {
        const J = 'jelly ' + (jelly ? 'on' : 'off') + ': ';
        ms.jellyPhisycs = jelly;
        ms.showCellShadows = false;
        let r = run([food, ej, player]);
        check(J + 'shadows off, cells on screen: WebGL, no fallback reason', r.ok === true && !r.why, JSON.stringify(r));
        ms.showCellShadows = true;
        r = run([food, ej, player]);
        check(J + 'shadows on, a cell on screen: Canvas2D, reason cellShadows', r.ok === false && r.why === 'cellShadows', JSON.stringify(r));
        r = run([virus]);
        check(J + 'shadows on, a virus on screen: Canvas2D, reason cellShadows', r.ok === false && r.why === 'cellShadows', JSON.stringify(r));
        r = run([food, ej]);
        check(J + 'shadows on, only food and ejected mass on screen: WebGL (they cast no shadow)', r.ok === true && !r.why, JSON.stringify(r));
        r = run([ej, far]);
        check(J + 'shadows on, the shadowed cell is off screen: WebGL', r.ok === true && !r.why, JSON.stringify(r));
        run([player]);
        ms.showCellShadows = false;
        r = run([player]);
        check(J + 'shadows turned off again: WebGL, the reason of the last frame is cleared', r.ok === true && !r.why, JSON.stringify(r));
    }
    /* "Spawn special effects" has no effect any more (no switch): a saved true keeps WebGL */
    ms.spawnSpecialEffects = true;
    const rs = run([food, ej, player]);
    check('a saved spawnSpecialEffects = true: WebGL, no Canvas2D reason', rs.ok === true && !rs.why, JSON.stringify(rs));
    ms.spawnSpecialEffects = false;
}

/* ---------------- headless Chrome: real WebGL + real Canvas2D ---------------- */
const protoSrc = '(function (env) {\n' +
    'var window = env.window, LM = env.LM, legendmod = env.LM, application = env.application, defaultSettings = env.defaultSettings,\n' +
    '  defaultmapsettings = env.defaultmapsettings, drawRender = env.drawRender, ogario = env.ogario, ogarcopythelb = env.ogarcopythelb,\n' +
    '  SpecialEffectPlayers = {}, profiles = [], dyinglight1load = "no", _EAT_PULSE_DURATION = 150, _EAT_PULSE_MAGNITUDE = 0.08;\n' +
    topFn('lmSkinsShown') + '\n' + topFn('lmColorInt') + '\nvar _lmColorIntCache = new Map(), _lmColorCtx = null;\n' +
    /* only for cells without a valid colour (none here) */
    'function _getFallbackGradient() { return null; }\n' +
    'return { draw: ' + cellMethod('draw') + ' };\n})';

function pageLib() {
    var W = 400, H = 300;
    var NOSKIN = { customSkins: false, videoSkins: false, noNames: true, showMass: false, showChat: false, teammatesInd: false, FBTracking: false,
        oppColors: false, cellContours: false, transparentCells: false, transparentSkins: false, transparentViruses: false, multiBoxShadow: false,
        spawnSpecialEffects: false, virusGlow: false };
    function makeEnv(defaults, cfg) {
        var ds = Object.assign({}, defaults.defaultSettings, cfg.settings || {});
        var dm = Object.assign({}, defaults.defaultmapsettings, NOSKIN, { jellyPhisycs: !!cfg.jelly, webgl2Acceleration: !!cfg.gl, showCellShadows: !!cfg.shadows });
        var LM = { cells: [], playerCells: [], playerCellsMulti: [], play: false, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false,
            multiBoxPlayerExists: false, removedCells: [], sortCells: false, indexedCells: {}, selected: null };
        var application = { gameMode: ':ffa', customSkinsMap: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },
            setAutoHideCellInfo: function () { return false; }, getCustomSkin: function () { return null; }, customSkinKey: function () { return null; },
            setVirusColor: function () { return ds.virusColor; }, setVirusStrokeColor: function () { return ds.virusStrokeColor; }, playSound: function () { } };
        var win = { navigator: { deviceMemory: 8 }, devicePixelRatio: 1, legendmod5: { optimizedMass: true } };
        win.legendmod = LM;
        win.multiboxPlayerEnabled = 0;
        win.fullSpectator = false;
        win.clientProfiler = null;
        return { window: win, LM: LM, application: application, defaultSettings: ds, defaultmapsettings: dm, ogarcopythelb: {}, ogario: { viewScale: 1 } };
    }
    /* jelly perimeter with three lobes: r = size * (1 + 0.1 cos 3a) */
    function lobes(x, y, size, n, depth) {
        var pts = [];
        for (var i = 0; i < n; i++) {
            var a = i * 2 * Math.PI / n, r = size * (1 + depth * Math.cos(3 * a));
            pts.push({ x: x + r * Math.cos(a), y: y + r * Math.sin(a) });
        }
        return pts;
    }
    function makeCells(proto, env, jelly) {
        var list = [
            { id: 3, x: -140, y: 100, size: 8, isFood: true, color: '#33ff66' },
            { id: 4, x: -140, y: -90, size: 16, isEjected: true, color: '#ffcc00' },
            { id: 1, x: 95, y: 65, size: 50, color: '#3388ff' },
            { id: 2, x: 0, y: 0, size: 70, color: '#ff3b3b' }
        ];
        var cells = list.map(function (o) {
            var c = Object.create(proto);
            var round = o.isFood || o.isEjected;
            return Object.assign(c, { isVirus: false, isFood: false, isEjected: false, invisible: false, removed: false, alpha: 0, redrawed: 0, _eatPulseTime: 0,
                targetNick: '', nick: '', skin: '', isPlayerCell: false, isPlayerCellMulti: false, spectator: 0, mass: 0, pi2: 2 * Math.PI,
                points: jelly ? lobes(o.x, o.y, o.size, round ? 16 : 48, round ? 0 : 0.1) : [],
                maxPointRad: jelly && !round ? o.size * 1.1 : o.size, isInView: function () { return true; } }, o);
        });
        env.LM.cells = cells;
        return cells;
    }
    var shared = null;
    function canvases() {
        if (shared) return shared;
        var main = document.createElement('canvas'), out = document.createElement('canvas'), ov = document.createElement('canvas');
        main.width = out.width = ov.width = W;
        main.height = out.height = ov.height = H;
        shared = { main: main, out: out, ov: ov };
        return shared;
    }
    /* one frame like renderFrame: background, GL decision and batch, the cell pass, then the
     * page composition (GL canvas above the main canvas) */
    function render(factorySrc, protoSrc, defaults, cfg) {
        var cv = canvases();
        var env = makeEnv(defaults, cfg);
        var R = (0, eval)('(' + factorySrc + ')')(env);
        env.window.drawRender = R;
        env.drawRender = R;
        var proto = (0, eval)(protoSrc)(env);
        /* a fresh GL canvas per run: initWebGL builds its programs on the context */
        var glc = document.createElement('canvas');
        glc.width = W; glc.height = H;
        R.glCanvas = glc;
        R.canvasWidth = W; R.canvasHeight = H;
        R.initWebGL();
        if (!R.gl) throw new Error('initWebGL failed');
        R.overlayCanvas = cv.ov; R.overlayCtx = cv.ov.getContext('2d');
        R.scale = 1; R.camX = 0; R.camY = 0; R._skinHalf = false;
        var cells = makeCells(proto, env, cfg.jelly);
        var gl = R.gl;
        gl.viewport(0, 0, W, H);
        R._jellyFrameId = (R._jellyFrameId || 0) + 1;
        for (var i = 0; i < cells.length; i++) { cells[i]._jellyFrameId = R._jellyFrameId; cells[i]._webglRendered = false; }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var m = cv.main.getContext('2d');
        m.setTransform(1, 0, 0, 1, 0, 0);
        m.globalAlpha = 1;
        m.fillStyle = '#ffffff';
        m.fillRect(0, 0, W, H);
        m.save();
        m.translate(W / 2, H / 2);
        m.scale(R.scale, R.scale);
        m.translate(-R.camX, -R.camY);
        var useGl = R.canUseWebGLScene(cells), why = R._lmGlFallback || '', drew = false;
        if (useGl) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            drew = R.drawWebGLCellBatch(cells);
            gl.disable(gl.DEPTH_TEST);
            if (!drew) {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                for (i = 0; i < cells.length; i++) cells[i]._webglRendered = false;
            }
        }
        /* (cell.draw clears the flag of a GPU body) */
        var glBodies = cells.filter(function (c) { return c._webglRendered; }).length;
        for (i = 0; i < cells.length; i++) cells[i].draw(m, false);
        m.restore();
        var o = cv.out.getContext('2d');
        o.setTransform(1, 0, 0, 1, 0, 0);
        o.clearRect(0, 0, W, H);
        o.drawImage(cv.main, 0, 0);
        o.drawImage(glc, 0, 0);
        var px = o.getImageData(0, 0, W, H).data;
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
        return { gl: !!(useGl && drew), why: why, px: px, glBodies: glBodies };
    }
    return {
        run: function (factorySrc, protoSrc, defaults, cfg, points) {
            var a = render(factorySrc, protoSrc, defaults, cfg);
            /* the same frame with WebGL acceleration off: the Canvas2D picture */
            var b = render(factorySrc, protoSrc, defaults, Object.assign({}, cfg, { gl: false }));
            var diff = 0;
            for (var i = 0; i < a.px.length; i += 4) {
                if (Math.abs(a.px[i] - b.px[i]) > 2 || Math.abs(a.px[i + 1] - b.px[i + 1]) > 2 || Math.abs(a.px[i + 2] - b.px[i + 2]) > 2) diff++;
            }
            var samples = {};
            Object.keys(points).forEach(function (k) {
                var x = Math.round(W / 2 + points[k][0]), y = Math.round(H / 2 + points[k][1]), j = (y * W + x) * 4;
                samples[k] = [a.px[j], a.px[j + 1], a.px[j + 2]];
            });
            return { gl: a.gl, why: a.why, glBodies: a.glBodies, diffVsCanvas: diff, samples: samples };
        }
    };
}

async function chromePart() {
    const chrome = findChrome();
    if (!chrome) { console.log('cellshadows: Chrome part skipped (Chrome not found; set CHROME_PATH)'); return; }
    const port = 9800 + Math.floor(Math.random() * 400);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-cellshadows-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', '--ignore-gpu-blocklist', '--window-size=800,600',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []), 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws;
    const stop = () => { try { ws && ws.close(); } catch (e) { } proc.kill(); return sleep(300).then(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } }); };
    try {
        let ver;
        for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); } catch (e) { await sleep(200); } }
        if (!ver) { console.log('cellshadows: Chrome part skipped (Chrome did not start)'); return stop(); }
        const page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page');
        ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 0;
        const pending = new Map();
        ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
        await new Promise((r) => (ws.onopen = r));
        const send = (method, params) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
        const evaluate = async (expr) => {
            const m = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
            if (m.error) throw new Error(m.error.message);
            if (m.result.exceptionDetails) throw new Error((m.result.exceptionDetails.exception && m.result.exceptionDetails.exception.description) || m.result.exceptionDetails.text);
            return m.result.result.value;
        };
        await evaluate('window.dyinglight1load = "no"; window.__cs = (' + pageLib.toString() + ')(); window.__csF = ' + JSON.stringify(F.factory) + '; window.__csP = ' + JSON.stringify(protoSrc) +
            '; window.__csD = ' + F.defaults + '; true');

        /* sample points (world = screen offset from the centre, zoom 1). B (0,0) r70 is drawn after
         * A (95,65) r50; they overlap. Food (-140,100) and ejected mass (-140,-90). */
        const fr = 8 + D.defaultSettings.foodSize, er = 16, d = (r) => (r + 5) / Math.SQRT2;
        const P = {
            belowB: [0, 74],             /* background just below B: in its shadow (both offsets) */
            clearB: [0, 84],             /* background below that: outside the hard shadow */
            aInBShadow: [64, 37],        /* on A's body, outside B, inside B's hard shadow */
            bInner: [45, 35],            /* on B, just outside A: A's shadow must not show on B */
            lobe: [80, 8],               /* outside B, inside its hard shadow only with the jelly lobe at angle 0 */
            food: [-140 + d(fr), 100 + d(fr)],
            ejected: [-140 + d(er), -90 + d(er)]
        };
        const WHITE = [255, 255, 255], A = [51, 136, 255], B = [255, 59, 59], k = 0.65;
        const near = (a, b, t) => a && a.every((v, i) => Math.abs(v - b[i]) <= t);
        const SH = { off: null, soft: { settings: {} }, hard: { settings: { cellShadowBlur: 0, cellShadowOffsetX: 8, cellShadowOffsetY: 8 } } };
        for (const jelly of [false, true]) for (const gl of [true, false]) for (const sh of ['off', 'soft', 'hard']) {
            const cfg = { jelly: jelly, gl: gl, shadows: sh !== 'off', settings: sh === 'off' ? {} : SH[sh].settings };
            const r = await evaluate('__cs.run(__csF, __csP, __csD, ' + JSON.stringify(cfg) + ', ' + JSON.stringify(P) + ')');
            const s = r.samples, N = 'jelly ' + (jelly ? 'on ' : 'off') + ', ' + (gl ? 'WebGL ' : 'Canvas') + ', shadow ' + sh + ': ';
            const info = JSON.stringify(r);
            if (gl && sh === 'off') check(N + 'cells drawn by the GPU batch (no fallback while shadows are off)', r.gl && r.glBodies === 3 && !r.why, info);
            if (gl && sh !== 'off') check(N + 'frame falls back to Canvas2D with reason cellShadows', !r.gl && r.why === 'cellShadows', info);
            if (!gl) check(N + 'plain Canvas2D frame', !r.gl, info);
            if (sh !== 'off') check(N + 'picture identical to the Canvas2D renderer', r.diffVsCanvas === 0, info);
            check(N + 'later cell B is never darkened by the earlier cell\'s shadow', near(s.bInner, B, 3), info);
            check(N + 'no shadow around food', near(s.food, WHITE, 1), info);
            check(N + 'no shadow around ejected mass', near(s.ejected, WHITE, 1), info);
            if (sh === 'off') {
                check(N + 'no shadow below B', near(s.belowB, WHITE, 1) && near(s.lobe, WHITE, 1), info);
                check(N + 'A shows its own colour', near(s.aInBShadow, A, 3), info);
            } else {
                check(N + 'shadow on the background below B', s.belowB[0] < 245 && s.belowB[0] === s.belowB[1] && s.belowB[1] === s.belowB[2], info);
            }
            if (sh === 'hard') {
                check(N + 'blur 0 is a hard shadow: full shadow inside, clean background past its edge', near(s.belowB, WHITE.map((v) => v * k), 3) && near(s.clearB, WHITE, 1), info);
                check(N + 'B\'s shadow falls on the earlier, overlapping cell A', near(s.aInBShadow, A.map((v) => v * k), 3), info);
                check(N + (jelly ? 'shadow follows the jelly lobe' : 'circle: no shadow where only a jelly lobe would cast one'), near(s.lobe, jelly ? WHITE.map((v) => v * k) : WHITE, 3), info);
            }
        }
    } finally {
        await stop();
    }
}

chromePart().then(() => {
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('cellshadows ok');
}, (e) => { console.log('cellshadows error:', e && e.stack || e); process.exit(1); });
