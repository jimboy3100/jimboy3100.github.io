/* More than 128 skins on screen: the WebGL skin texture array holds 128 skins; when every layer
 * was drawn in this or the previous frame, a second array of 128 layers is made (layers
 * 128-255, sampled from u_skinArray2) instead of leaving the other skins body-only.
 *
 * Without a browser: lmSkinLayersGrow and the layer pick over both arrays.
 * In headless Chrome (skipped without Chrome), the real drawRender:
 *   - 160 different skins drawn in every frame: every one gets its own layer (the version in git
 *     HEAD, or --old FILE, gives 128 and leaves 32 body-only), with the same texels as the
 *     previous version uploads for that skin;
 *   - the cell shader and the jelly shader: cells whose skins are in the second array give the
 *     same frame, to the bit, as the same cells with the same skins in the first array;
 *   - 100 skins (fewer than 128): no second array is made (no extra GPU memory);
 *   - a context lost while it had a second array: the next context never makes one.
 * The frames of 128 skins or fewer are compared with the previous version by glbatch.js
 * (node developers/tests/glbatch.js --ref HEAD).
 * Usage: node developers/tests/skinbanks.js [--old FILE] [--new FILE] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { spawn, execFileSync } = require('child_process');
const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
const NEW_SRC = fs.readFileSync(opt('--new', path.join(root, 'ogario', 'ogario.v4.js')), 'utf8').replace(/\r\n/g, '\n');
let OLD_SRC = null;
try {
    OLD_SRC = (opt('--old', null) ? fs.readFileSync(opt('--old'), 'utf8') : execFileSync('git', ['-C', root, 'show', 'HEAD:ogario/ogario.v4.js'], { encoding: 'utf8', maxBuffer: 64 * 1048576 })).replace(/\r\n/g, '\n');
} catch (e) { }

function grab(src, name) {
    const i = src.indexOf('    function ' + name + '(');
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

/* ---- 1. layer bookkeeping ---- */
{
    const C = {};
    vm.createContext(C);
    vm.runInContext(['lmSkinLayersNew', 'lmSkinLayerPick', 'lmSkinLayerTake', 'lmSkinLayerTouch', 'lmSkinLayersGrow'].map((n) => grab(NEW_SRC, n)).join('\n'), C);
    const st = C.lmSkinLayersNew(4);
    for (let i = 0; i < 4; i++) C.lmSkinLayerTake(st, C.lmSkinLayerPick(st, 10), { keys: ['a' + i] }, 10);
    check('all layers drawn this frame: none free', C.lmSkinLayerPick(st, 10) === -1);
    C.lmSkinLayersGrow(st, 4);
    const got = [];
    for (let i = 0; i < 4; i++) { const l = C.lmSkinLayerPick(st, 10); got.push(l); C.lmSkinLayerTake(st, l, { keys: ['b' + i] }, 10); }
    check('grown: the new layers are handed out in order after the old ones', got.join() === '4,5,6,7' && st.max === 8 && st.used.length === 8 && st.owner.length === 8);
    check('grown: full again in the same frame', C.lmSkinLayerPick(st, 10) === -1);
    C.lmSkinLayerTouch(st, 6, 12);
    check('grown: the least recently drawn layer over both arrays is reused later', C.lmSkinLayerPick(st, 12) === 0 && (C.lmSkinLayerTouch(st, 7, 12), C.lmSkinLayerTouch(st, 6, 12), true));
    check('touch covers the new layers', st.used[7] === 12);
}

/* ---- 2. the renderer in headless Chrome ---- */
function pageLib() {
    function paint(k) {
        var c = document.createElement('canvas');
        c.width = c.height = 512;
        var x = c.getContext('2d');
        for (var i = 0; i < 5; i++) {
            x.fillStyle = 'hsl(' + ((k * 23 + i * 71) % 360) + ',80%,' + (28 + i * 11) + '%)';
            x.fillRect(0, i * 103, 512, 104);
        }
        x.fillStyle = '#fff'; x.font = '700 140px Arial'; x.fillText(String(k), 60, 300);
        if (k % 5 === 2) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,0.5)'; x.fillRect(0, 0, 256, 512); }
        return c;
    }
    function frame() { return new Promise(function (d) { requestAnimationFrame(d); }); }
    function texels(R, layer) {
        var gl = R.gl, fb = gl.createFramebuffer(), b = new Uint8Array(512 * 512 * 4);
        var arr = layer >= 128 ? R.glSkinArray2 : R.glSkinArray;
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
        gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, arr, 0, layer % 128);
        gl.readPixels(0, 0, 512, 512, gl.RGBA, gl.UNSIGNED_BYTE, b);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);
        var h = 2166136261;
        for (var i = 0; i < b.length; i += 3) h = Math.imul(h ^ b[i], 16777619);
        return h >>> 0;
    }
    var canvases = null;
    function skins(n) {
        if (!canvases || canvases.length < n) { canvases = []; for (var k = 0; k < n; k++) canvases.push(paint(k)); }
        return canvases.slice(0, n);
    }
    function make(factorySrc, defaults) {
        var env = { window: { navigator: { deviceMemory: 8 }, devicePixelRatio: 1, legendmod: { cells: [] } }, LM: { cells: [] }, application: { customSkinsCache: {} },
            defaultSettings: defaults.defaultSettings, defaultmapsettings: defaults.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
        var R = (0, eval)('(' + factorySrc + ')')(env);
        var canvas = document.createElement('canvas');
        canvas.width = 640; canvas.height = 480;
        R.glCanvas = canvas; R.canvasWidth = 640; R.canvasHeight = 480;
        R.initWebGL();
        if (!R.gl) throw new Error('initWebGL failed');
        return R;
    }
    /* n skins drawn in every frame (each frame asks for the ones without a layer, as the cell
     * batch does) until all have one or nothing changes for 120 frames */
    async function many(factorySrc, defaults, n, from) {
        var R = make(factorySrc, defaults), list = skins((from || 0) + n).slice(from || 0);
        var urls = list.map(function (_, i) { return 'https://skins.test/m' + ((from || 0) + i) + '.png'; });
        var last = -1, still = 0;
        for (var f = 0; f < 900 && still < 120; f++) {
            R._glSkinFrame = (R._glSkinFrame || 0) + 1;
            var have = 0;
            for (var i = 0; i < n; i++) {
                var l = R.glSkinMap[urls[i]];
                if (l === undefined) l = R.uploadSkinTexture(urls[i], list[i]);
                if (l >= 0) { R._lmSkinLayerUsed(l); have++; }
            }
            if (have === n) break;
            if (have === last) still++; else { still = 0; last = have; }
            await frame();
        }
        var layers = urls.map(function (u) { return R.glSkinMap[u] >= 0 ? R.glSkinMap[u] : -1; });
        var hashes = layers.map(function (l) { return l >= 0 ? texels(R, l) : -1; });
        var res = { frames: f, mapped: layers.filter(function (l) { return l >= 0; }).length, distinct: new Set(layers.filter(function (l) { return l >= 0; })).size,
            high: layers.filter(function (l) { return l >= 128; }).length, second: !!R.glSkinArray2, hashes: hashes, glError: R.gl.getError() };
        R.gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    /* the same cells drawn with their skins in the second array, then in the first one */
    function drawOracle(glb, factorySrc, defaults, jelly) {
        window.__glbSkinned = {};
        var n = 32, scene = [];
        for (var i = 0; i < n; i++) {
            var r = 70 + (i % 4) * 9, cx = -800 + (i % 8) * 220, cy = -390 + Math.floor(i / 8) * 230, pts = [];
            for (var k = 0; k < 40; k++) pts.push(cx + Math.cos(k / 40 * 2 * Math.PI) * r * (1 + 0.04 * Math.sin(k * 3 + i)), cy + Math.sin(k / 40 * 2 * Math.PI) * r * (1 + 0.04 * Math.cos(k * 2 + i)));
            scene.push({ id: 1000 + i, x: cx, y: cy, size: r, isVirus: false, maxPointRad: r, pts: pts, color: ['#ff3b3b', '#3388ff', '#33ff66', '#ffcc00'][i % 4], nick: 'bank' + i });
        }
        var o = glb.setup(factorySrc, defaults, { scale: 1, jelly: jelly, map: { noNames: true, showMass: false } }, scene), R = o.R, gl = R.gl;
        var list = skins(n), urls = [];
        R._lmSkinBankAdd();
        for (i = 0; i < n; i++) {
            var url = 'https://skins.test/o' + i + '.png';
            urls.push(url);
            o.env.application.customSkinsMap['bank' + i] = url;
            o.env.application.customSkinsCache[url] = list[i];
            o.env.application.customSkinsCache[url + '_cached'] = list[i];
            /* the same picture into layer i of the second array and layer 40 + i of the first */
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, R.glSkinArray2);
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, 512, 512, 1, gl.RGBA, gl.UNSIGNED_BYTE, list[i]);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, R.glSkinArray);
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 40 + i, 512, 512, 1, gl.RGBA, gl.UNSIGNED_BYTE, list[i]);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        }
        var shot = function (base) {
            for (var j = 0; j < n; j++) R.glSkinMap[urls[j]] = base + j;
            glb.frame(o);
            var ok = glb.frame(o);
            return { ok: ok, px: glb.pixels(R) };
        };
        var hi = shot(128), lo = shot(40);
        var diff = 0, lit = 0, skinned = 0;
        for (var p = 0; p < hi.px.length; p++) {
            if (hi.px[p] !== lo.px[p]) diff++;
            if ((p & 3) === 3 && hi.px[p]) lit++;
        }
        /* the frame shows the skins: different from the same cells without skins */
        for (j = 0; j < n; j++) R.glSkinMap[urls[j]] = undefined;
        for (j = 0; j < n; j++) delete o.env.application.customSkinsMap['bank' + j];
        glb.frame(o);
        glb.frame(o);
        var none = glb.pixels(R);
        for (p = 0; p < none.length; p++) if (none[p] !== lo.px[p]) skinned++;
        var err = gl.getError();
        gl.getExtension('WEBGL_lose_context').loseContext();
        return { okHi: hi.ok, okLo: lo.ok, differing: diff, lit: lit, skinnedDiff: skinned, glError: err };
    }
    /* a context lost while it had a second array: none again in the next context */
    async function lostWithBank(factorySrc, defaults) {
        var R = make(factorySrc, defaults);
        var made = R._lmSkinBankAdd() && !!R.glSkinArray2;
        var ext = R.gl.getExtension('WEBGL_lose_context');
        await new Promise(function (done) {
            R.glCanvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); R.gl = null; setTimeout(function () { ext.restoreContext(); }, 0); }, { once: true });
            R.glCanvas.addEventListener('webglcontextrestored', function () { R.gl = null; R.glSkinMap = {}; R._glSkinLayers = null; R.initWebGL(); done(); }, { once: true });
            ext.loseContext();
        });
        var after = R._lmSkinBankAdd();
        var res = { made: made, secondAfter: !!R.glSkinArray2, addAfter: after, layers: R._lmSkinLayers().max };
        R.gl.getExtension('WEBGL_lose_context').loseContext();
        return res;
    }
    return { many: many, drawOracle: drawOracle, lostWithBank: lostWithBank };
}

async function browser() {
    const glb = require('./glbatch.js');
    const chrome = glb.findChrome();
    if (!chrome) { console.log('     (Chrome not found: browser part skipped)'); return; }
    if (!glb.pageLib) { console.log('     (glbatch.js has no pageLib export: browser part skipped)'); return; }
    const NEW = glb.rendererFactory(NEW_SRC), OLD = OLD_SRC ? glb.rendererFactory(OLD_SRC) : null;
    const port = 10200 + Math.floor(Math.random() * 400);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-skinbanks-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', '--ignore-gpu-blocklist', '--window-size=1920,1080',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []), 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws;
    try {
        let ver;
        for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); } catch (e) { await sleep(200); } }
        if (!ver) { console.log('     (Chrome did not start: browser part skipped)'); return; }
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
        await evaluate('window.__glbSkinned = {}; window.__glb = (' + glb.pageLib.toString() + ')(); window.__sb = (' + pageLib.toString() + ')(); window.__sbNew = ' + JSON.stringify(NEW.factory) +
            '; window.__sbOld = ' + JSON.stringify(OLD ? OLD.factory : null) + '; window.__sbDefaults = ' + NEW.defaults + '; true');

        const n = await evaluate('__sb.many(__sbNew, __sbDefaults, 160)');
        console.log('     160 skins drawn in every frame: ' + n.mapped + ' with a layer (' + n.distinct + ' layers, ' + n.high + ' in the second array) after ' + n.frames + ' frames');
        check('160 skins on screen: every one has its own layer, 32 of them in the second array, no GL error', n.mapped === 160 && n.distinct === 160 && n.high === 32 && n.second && n.glError === 0);
        if (OLD) {
            const o = await evaluate('__sb.many(__sbOld, __sbDefaults, 160)');
            console.log('     previous version, 160 skins drawn in every frame: ' + o.mapped + ' with a layer, the rest body-only');
            const a = await evaluate('__sb.many(__sbOld, __sbDefaults, 100)'), b = await evaluate('__sb.many(__sbOld, __sbDefaults, 60, 100)');
            const ref = a.hashes.concat(b.hashes);
            check('160 skins: every layer holds the texels the previous version uploads for that skin', n.hashes.every((h, i) => h === ref[i]) && ref.every((h) => h !== -1));
        }
        const few = await evaluate('__sb.many(__sbNew, __sbDefaults, 100)');
        check('100 skins: no second array (no extra GPU memory below 129 skins)', few.mapped === 100 && !few.second && few.high === 0);
        for (const jelly of [false, true]) {
            const d = await evaluate('__sb.drawOracle(__glb, __sbNew, __sbDefaults, ' + jelly + ')');
            console.log('     ' + (jelly ? 'jelly' : 'circle') + ' cells, skins in the second array vs the first: ' + d.differing + ' channels differ (' + d.lit + ' lit pixels; ' + d.skinnedDiff + ' channels differ from the same cells without skins)');
            check((jelly ? 'jelly shader' : 'cell shader') + ': skins from the second array give the same frame to the bit as from the first, no GL error',
                d.okHi && d.okLo && d.differing === 0 && d.lit > 100000 && d.skinnedDiff > 100000 && d.glError === 0);
        }
        const l = await evaluate('__sb.lostWithBank(__sbNew, __sbDefaults)');
        check('context lost while it had a second array: the next context makes none (it may have been the memory too many)', l.made && !l.secondAfter && !l.addAfter && l.layers === 128);
        if (errors.length) { console.log('page errors:\n  ' + errors.join('\n  ')); failed++; }
    } finally {
        try { ws && ws.close(); } catch (e) { }
        proc.kill();
        setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } }, 300);
    }
}

browser().then(() => {
    console.log(failed ? failed + ' check(s) failed' : 'all skin bank checks passed');
    setTimeout(() => process.exit(failed ? 1 : 0), 400);
}, (e) => {
    console.log('skinbanks error: ' + (e && e.stack || e));
    setTimeout(() => process.exit(1), 400);
});
