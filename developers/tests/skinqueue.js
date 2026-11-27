/* Skin queue checks: the frame budget the skin canvases (application._lmSkinJobsSchedule) and the
 * GPU skin uploads (drawRender._lmScheduleSkinUploads) share, and the upload queue of the WebGL
 * renderer (decode cap, byte cap, stale skins, the upload of pictures createImageBitmap cannot
 * decode).
 *
 * Without a browser:
 *   - lmSkinJobsRun without the shared budget runs exactly the jobs the previous version ran
 *     (the version in git HEAD, or --old FILE), for random job costs;
 *   - with it: one budget for both queues in a frame, a queue that ran nothing in its previous
 *     frame always moves, a new frame (or a timer) starts with the whole budget;
 *   - a simulated burst (both queues full, random job costs): skin ms per frame p50/p95/p99/max
 *     and frames until both are done, previous version vs this one.
 * In headless Chrome (skipped without Chrome), the real drawRender of both versions:
 *   - 120 new skins on screen at once: createImageBitmap calls running at once, decoded bitmap
 *     bytes held, frames until every skin has its layer, ms of skin work per frame, and the
 *     texels of every layer (must be the same in both versions);
 *   - skins no draw asks for any more: closed without taking a layer, uploaded when asked again;
 *   - an image createImageBitmap cannot decode: not uploaded inside the draw any more, the same
 *     texels from the frame job;
 *   - a decode that finishes after the context was lost: its bitmap is closed at once.
 * Usage: node developers/tests/skinqueue.js [--old FILE] [--new FILE] [--runs N] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { spawn, execFileSync } = require('child_process');
const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
const NEW_SRC = fs.readFileSync(opt('--new', path.join(root, 'ogario', 'ogario.v4.js')), 'utf8').replace(/\r\n/g, '\n');
let OLD_SRC;
try {
    OLD_SRC = opt('--old', null) ? fs.readFileSync(opt('--old'), 'utf8') : execFileSync('git', ['-C', root, 'show', 'HEAD:ogario/ogario.v4.js'], { encoding: 'utf8', maxBuffer: 64 * 1048576 });
    OLD_SRC = OLD_SRC.replace(/\r\n/g, '\n');
} catch (e) { OLD_SRC = null; }

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
function load(src) {
    const ctx = {};
    vm.createContext(ctx);
    vm.runInContext(['lmSkinJobPick', 'lmSkinJobsRun', 'lmSkinSlack'].map((n) => grab(src, n)).filter(Boolean).join('\n'), ctx);
    return ctx;
}
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const N = load(NEW_SRC), O = OLD_SRC && grab(OLD_SRC, 'lmSkinJobsRun') ? load(OLD_SRC) : null;
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* ---- 1. without the shared budget: the same jobs as before ---- */
if (O) {
    let same = true;
    for (let seed = 1; seed <= 300 && same; seed++) {
        const r = rng(seed), costs = Array.from({ length: 40 }, () => (r() < 0.1 ? 5 + r() * 25 : r() * 3));
        const mk = () => costs.map((c, i) => ({ id: i, c, seen: r() < 0.3 ? 4990 : 0 }));
        const a = mk(), b = a.map((j) => Object.assign({}, j));
        let avgA = 0, avgB = 0;
        for (let f = 0; f < 60 && (a.length || b.length); f++) {
            let ta = 0, tb = 0;
            const da = [], db = [];
            avgA = O.lmSkinJobsRun(a, 4, avgA, () => ta, 5000, 1000, (j) => { da.push(j.id); ta += j.c; });
            avgB = N.lmSkinJobsRun(b, 4, avgB, () => tb, 5000, 1000, (j) => { db.push(j.id); tb += j.c; });
            if (da.join() !== db.join() || avgA !== avgB) same = false;
        }
    }
    check('no shared budget: the same jobs in the same frames and order as the previous version (300 random queues)', same);
} else console.log('     (previous version not available: oracle skipped)');

/* ---- 2. the shared budget ---- */
{
    const slack = N.lmSkinSlack(), laneA = { starved: false }, laneB = { starved: false };
    check('one shared state', N.lmSkinSlack() === slack);
    let t = 0;
    const clock = () => t;
    const run = (q, stamp, lane) => { const d = []; N.lmSkinJobsRun(q, 4, 1, clock, 0, 1000, (j) => { d.push(j.id); t += j.c; }, slack, stamp, lane); return d; };
    const Q = (n, c) => Array.from({ length: n }, (_, i) => ({ id: i, c, seen: 0 }));
    let qa = Q(30, 1), qb = Q(10, 1);
    let da = run(qa, 100, laneA), db = run(qb, 100, laneB);
    check('same frame: the first queue uses the budget, the second waits', da.length === 4 && db.length === 0 && laneB.starved);
    da = run(qa, 116, laneA); db = run(qb, 116, laneB);
    check('next frame: the queue that waited runs its first job even with the budget used', da.length === 4 && db.length === 1 && !laneB.starved);
    da = run(qa, 132, laneA); db = run(qb, 132, laneB);
    check('...and waits again in the frame after (it moves at least every other frame)', db.length === 0 && laneB.starved);
    qa = Q(1, 1);
    qb = Q(10, 1);
    da = run(qa, 148, laneA); db = run(qb, 148, laneB);
    check('what is left of the budget is used by the second queue', da.length === 1 && db.length === 3);
    qa = Q(3, 1);
    run(qa, null, laneA);
    db = run(Q(5, 1), null, laneB);
    check('from a timer (hidden tab, no frame time): each call has the whole budget, as before', db.length === 4);
    const big = [{ id: 'big', c: 30, seen: 0 }];
    laneA.starved = false;
    da = run(big, 200, laneA);
    check('the first queue of a frame always runs its first job (as before)', da.join() === 'big');
    check('...and the time is counted for the frame', slack.used === 30 && slack.stamp === 200);
}

/* ---- 3. simulated burst: per-frame skin work, previous version vs shared budget ---- */
function simulate(fns, shared, seed) {
    const r = rng(seed);
    /* canvas jobs: mostly 0.5-3 ms, some 5-25 ms (large images); uploads 0.4-1.5 ms, a few 4-10 ms */
    const cpu = Array.from({ length: 150 }, (_, i) => ({ id: i, c: r() < 0.08 ? 5 + r() * 20 : 0.5 + r() * 2.5, seen: 0 }));
    const gpu = Array.from({ length: 150 }, (_, i) => ({ id: i, c: r() < 0.05 ? 4 + r() * 6 : 0.4 + r() * 1.1, seen: 0 }));
    const slack = shared ? { stamp: null, used: 0 } : null, la = { starved: false }, lb = { starved: false };
    let avgA = 0, avgB = 0, t = 0;
    const clock = () => t, per = [];
    let f = 0;
    for (; f < 2000 && (cpu.length || gpu.length); f++) {
        const t0 = t;
        if (cpu.length) avgA = fns.lmSkinJobsRun(cpu, 4, avgA, clock, 0, 1000, (j) => { t += j.c; }, slack, f, la);
        if (gpu.length) avgB = fns.lmSkinJobsRun(gpu, 4, avgB, clock, 0, 2, (j) => { t += j.c; }, slack, f, lb);
        per.push(t - t0);
    }
    return { per, frames: f };
}
function pct(a, p) { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p / 100 * s.length))]; }
function stats(list) { return { p50: pct(list, 50), p95: pct(list, 95), p99: pct(list, 99), max: Math.max.apply(null, list) }; }
{
    const before = [], after = [];
    let fb = 0, fa = 0;
    for (let s = 1; s <= 40; s++) {
        const b = simulate(O || N, false, s), a = simulate(N, true, s);
        before.push.apply(before, b.per); after.push.apply(after, a.per);
        fb += b.frames; fa += a.frames;
    }
    const sb = stats(before), sa = stats(after), f2 = (x) => x.toFixed(2);
    console.log('     simulated burst (150 canvas jobs + 150 uploads, 40 seeds, fake clock), skin ms per frame p50/p95/p99/max:');
    console.log('       two budgets (before): ' + [sb.p50, sb.p95, sb.p99, sb.max].map(f2).join(' / ') + ', frames to finish ' + (fb / 40).toFixed(1));
    console.log('       shared budget (now):  ' + [sa.p50, sa.p95, sa.p99, sa.max].map(f2).join(' / ') + ', frames to finish ' + (fa / 40).toFixed(1));
    check('shared budget: p95 and p99 skin work per frame not above the two budgets', sa.p95 <= sb.p95 && sa.p99 <= sb.p99);
    check('shared budget: every skin still done, in at most twice the frames', fa <= 2 * fb);
}

/* ---- 4. the real renderer in headless Chrome ---- */
function pageLib() {
    function paint(k, w, h, alpha) {
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var x = c.getContext('2d');
        for (var i = 0; i < 6; i++) {
            x.fillStyle = 'hsl(' + ((k * 47 + i * 61) % 360) + ',75%,' + (30 + i * 9) + '%)';
            x.fillRect(i * w / 6, 0, w / 6 + 1, h);
        }
        x.fillStyle = '#fff'; x.font = '700 ' + (h / 4 | 0) + 'px Arial'; x.fillText('S' + k, w / 6, h / 2);
        if (alpha) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,0.45)'; x.fillRect(0, 0, w, h / 3); }
        return c;
    }
    function img(c) {
        return new Promise(function (d) { c.toBlob(d, 'image/png'); }).then(function (blob) {
            var im = new Image();
            im.src = URL.createObjectURL(blob);
            return im.decode().then(function () { im._lmBlob = blob; return im; });
        });
    }
    /* what cacheSkin makes: a 512 px canvas cut to a circle, with the image behind it */
    function cut(im) {
        var c = document.createElement('canvas');
        c.width = c.height = 512;
        var x = c.getContext('2d');
        x.beginPath(); x.arc(256, 256, 256, 0, 2 * Math.PI, false); x.clip();
        x.drawImage(im, 0, 0, 512, 512);
        c._lmSrc = im; c._lmCircle = true;
        return c;
    }
    var imgs = null;
    async function images(n) {
        if (imgs && imgs.length >= n) return imgs;
        imgs = [];
        for (var k = 0; k < n; k++) imgs.push(await img(paint(k, k % 3 ? 512 : 400, 512, k % 4 === 1)));
        return imgs;
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
    /* counts createImageBitmap calls running at once, bitmaps alive, and times the skin frame jobs */
    function instrument(R) {
        var st = { inflight: 0, maxInflight: 0, alive: 0, maxAlive: 0, made: 0, closed: 0, jobMs: [], drawUploads3D: 0 };
        var cib = window.createImageBitmap;
        window.createImageBitmap = function () {
            st.inflight++; st.made++;
            if (st.inflight > st.maxInflight) st.maxInflight = st.inflight;
            return cib.apply(window, arguments).then(function (b) {
                st.inflight--; st.alive++;
                if (st.alive > st.maxAlive) st.maxAlive = st.alive;
                var close = b.close;
                b.close = function () { if (!b._c) { b._c = 1; st.alive--; st.closed++; } return close.call(b); };
                return b;
            }, function (e) { st.inflight--; throw e; });
        };
        st.restore = function () { window.createImageBitmap = cib; };
        var raf = window.requestAnimationFrame;
        st.frameMs = {};
        window.requestAnimationFrame = function (f) {
            return raf.call(window, function (stamp) {
                var t = performance.now();
                st.stamp = stamp;
                f(stamp);
                st.frameMs[stamp] = (st.frameMs[stamp] || 0) + performance.now() - t;
            });
        };
        st.restoreRaf = function () { window.requestAnimationFrame = raf; };
        return st;
    }
    function frame() { return new Promise(function (d) { requestAnimationFrame(d); }); }
    function texels(R, layer) {
        var gl = R.gl, fb = gl.createFramebuffer(), b = new Uint8Array(512 * 512 * 4);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fb);
        gl.framebufferTextureLayer(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, R.glSkinArray, 0, layer);
        gl.readPixels(0, 0, 512, 512, gl.RGBA, gl.UNSIGNED_BYTE, b);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);
        return b;
    }
    function hash(b) { var h = 2166136261; for (var i = 0; i < b.length; i += 3) h = Math.imul(h ^ b[i], 16777619); return h >>> 0; }
    /* every frame: the draw asks for each skin on screen that has no layer yet (as the cell batch) */
    async function burst(factorySrc, defaults, n) {
        var list = await images(n);
        var R = make(factorySrc, defaults);
        /* the skin canvases (as cacheSkin made them earlier) and a renderer that has run for a
         * while: the GPU process has drawn the 120 canvases and set up the context (shader
         * compiles, the 128 MB skin array). Made at once right before the burst, the first
         * upload's framebuffer check waited 100-1900 ms for that work, in both versions, longer
         * the sooner it came. */
        var nodes = list.map(cut);
        for (var w = 0; w < 30; w++) await frame();
        var st = instrument(R);
        var up = [], ou = R._lmUploadSkinJob;
        R._lmUploadSkinJob = function () { if (!up.length) st.firstUp = st.stamp; var t = performance.now(); var r = ou.apply(this, arguments); up.push(+(performance.now() - t).toFixed(1)); return r; };
        var gp = [], og = R._lmSkinGpuPut;
        R._lmSkinGpuPut = function () { var t = performance.now(); var r = og.apply(this, arguments); gp.push(+(performance.now() - t).toFixed(1)); return r; };
        var urls = list.map(function (_, i) { return 'https://skins.test/q' + i + '.png'; });
        var drawMs = [], frames = 0;
        for (; frames < 600; frames++) {
            R._glSkinFrame = (R._glSkinFrame || 0) + 1;
            var t = performance.now(), missing = 0;
            for (var i = 0; i < n; i++) {
                var l = R.glSkinMap[urls[i]];
                if (l === undefined) { l = R.uploadSkinTexture(urls[i], nodes[i]); missing++; }
                if (l >= 0) R._lmSkinLayerUsed(l);
            }
            drawMs.push(performance.now() - t);
            if (!missing) break;
            await frame();
        }
        st.restore(); st.restoreRaf();
        var hashes = urls.map(function (u) { return R.glSkinMap[u] >= 0 ? hash(texels(R, R.glSkinMap[u])) : -1; });
        /* the frame of the first upload into a new context is left out of the per-frame numbers
         * (returned as warm): 20-170 ms in both versions, mostly the first _lmSkinGpuPut */
        var warm = st.frameMs[st.firstUp] || 0;
        var fm = Object.keys(st.frameMs).sort(function (a, b) { return a - b; }).filter(function (k) { return +k !== st.firstUp; }).map(function (k) { return st.frameMs[k]; });
        var err = R.gl.getError();
        R.gl.getExtension('WEBGL_lose_context').loseContext();
        return { frames: frames, uploaded: hashes.filter(function (h) { return h !== -1; }).length, hashes: hashes, maxInflight: st.maxInflight,
            maxAliveMB: st.maxAlive, made: st.made, closed: st.closed, jobMs: fm, drawMs: drawMs, glError: err, up: up, gp: gp, warm: warm };
    }
    /* skins asked for once and then no more for over 60 frames: 8 whose decode is running
     * (closed when it finishes) and 6 plain canvases waiting in the ready queue (dropped by the
     * next frame job); 20 others stay on screen. Then all are asked for again. */
    async function stale(factorySrc, defaults) {
        var list = await images(28);
        var R = make(factorySrc, defaults), st = instrument(R);
        var nodes = list.map(cut), urls = list.map(function (_, i) { return 'https://skins.test/s' + i + '.png'; });
        var plain = [], purls = [];
        for (var p = 0; p < 6; p++) {
            var pc = cut(list[p]);
            pc._lmSrc = null;
            plain.push(pc);
            purls.push('https://skins.test/p' + p + '.png');
        }
        R._glSkinFrame = 1;
        for (var i = 20; i < 28; i++) R.uploadSkinTexture(urls[i], nodes[i]);
        for (p = 0; p < 6; p++) R.uploadSkinTexture(purls[p], plain[p]);
        /* 100 frames pass before any of them is done (as when the queue is long) */
        R._glSkinFrame += 100;
        var f;
        for (f = 0; f < 400; f++) {
            R._glSkinFrame++;
            var miss = 0;
            for (i = 0; i < 20; i++) {
                var l = R.glSkinMap[urls[i]];
                if (l === undefined) { l = R.uploadSkinTexture(urls[i], nodes[i]); miss++; }
                if (l >= 0) R._lmSkinLayerUsed(l);
            }
            await frame();
            if (!miss && !st.inflight && !(R._lmSkinReady || []).length) break;
        }
        var on = 0, off = 0;
        for (i = 0; i < 28; i++) if (R.glSkinMap[urls[i]] >= 0) { if (i < 20) on++; else off++; }
        for (p = 0; p < 6; p++) if (R.glSkinMap[purls[p]] >= 0) off++;
        var aliveAfter = st.alive;
        /* asked for again: uploaded */
        for (f = 0; f < 300; f++) {
            R._glSkinFrame++;
            var miss2 = 0;
            for (i = 0; i < 34; i++) {
                var u = i < 28 ? urls[i] : purls[i - 28], nd = i < 28 ? nodes[i] : plain[i - 28];
                var l2 = R.glSkinMap[u];
                if (l2 === undefined) { l2 = R.uploadSkinTexture(u, nd); miss2++; }
                if (l2 >= 0) R._lmSkinLayerUsed(l2);
            }
            if (!miss2) break;
            await frame();
        }
        var again = 0;
        for (i = 20; i < 34; i++) if (R.glSkinMap[i < 28 ? urls[i] : purls[i - 28]] >= 0) again++;
        st.restore(); st.restoreRaf();
        R.gl.getExtension('WEBGL_lose_context').loseContext();
        return { on: on, off: off, aliveAfter: aliveAfter, again: again, closed: st.closed, made: st.made };
    }
    /* an image createImageBitmap could not decode (_lmBmpFail): where its upload happens and its texels */
    async function fallback(factorySrc, defaults) {
        var list = await images(3);
        var R = make(factorySrc, defaults), gl = R.gl;
        var inDraw = 0, drawing = false, t3 = gl.texSubImage3D;
        gl.texSubImage3D = function () { if (drawing) inDraw++; return t3.apply(gl, arguments); };
        var res = [];
        for (var k = 0; k < 3; k++) {
            var node = list[k];
            node._lmBmpFail = true;
            var url = 'https://skins.test/f' + k + '.png', got, f = 0;
            for (; f < 100; f++) {
                R._glSkinFrame = (R._glSkinFrame || 0) + 1;
                drawing = true;
                got = R.glSkinMap[url] === undefined ? R.uploadSkinTexture(url, node) : R.glSkinMap[url];
                drawing = false;
                if (got >= 0) break;
                await frame();
            }
            res.push(got >= 0 ? hash(texels(R, got)) : -1);
            delete node._lmBmpFail;
        }
        gl.texSubImage3D = t3;
        var err = gl.getError();
        gl.getExtension('WEBGL_lose_context').loseContext();
        return { hashes: res, inDraw: inDraw, glError: err };
    }
    /* decodes started, then the context is lost before they finish */
    async function lost(factorySrc, defaults) {
        var list = await images(8);
        var R = make(factorySrc, defaults), st = instrument(R);
        var nodes = list.map(cut);
        R._glSkinFrame = 1;
        for (var i = 0; i < 8; i++) R.uploadSkinTexture('https://skins.test/l' + i + '.png', nodes[i]);
        R.gl.getExtension('WEBGL_lose_context').loseContext();
        R.gl = null;
        var t0 = performance.now();
        while (st.inflight && performance.now() - t0 < 5000) await frame();
        var aliveAtOnce = st.alive;
        for (i = 0; i < 5; i++) await frame();
        st.restore(); st.restoreRaf();
        return { made: st.made, aliveAtOnce: aliveAtOnce, alive: st.alive };
    }
    return { burst: burst, stale: stale, fallback: fallback, lost: lost };
}

async function browser() {
    let glb;
    try { glb = require('./glbatch.js'); } catch (e) { console.log('     (glbatch.js not loadable: browser part skipped)'); return; }
    const chrome = glb.findChrome();
    if (!chrome) { console.log('     (Chrome not found: browser part skipped)'); return; }
    if (!OLD_SRC) { console.log('     (previous version not available: browser part skipped)'); return; }
    const NEW = glb.rendererFactory(NEW_SRC), OLD = glb.rendererFactory(OLD_SRC);
    const port = 9800 + Math.floor(Math.random() * 400);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-skinqueue-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', '--ignore-gpu-blocklist', '--window-size=800,600',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []), 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws;
    const close = () => { try { ws && ws.close(); } catch (e) { } proc.kill(); setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } }, 300); };
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
        await evaluate('window.__sq = (' + pageLib.toString() + ')(); window.__sqOld = ' + JSON.stringify(OLD.factory) + '; window.__sqNew = ' + JSON.stringify(NEW.factory) +
            '; window.__sqDefaults = ' + NEW.defaults + '; true');

        /* alternating runs: the machine may be busy, so old and new take turns */
        const runs = +opt('--runs', 3);
        const res = { old: [], new: [] };
        for (let r = 0; r < runs; r++) {
            for (const which of r % 2 ? ['new', 'old'] : ['old', 'new']) {
                res[which].push(await evaluate('__sq.burst(__sq' + (which === 'old' ? 'Old' : 'New') + ', __sqDefaults, 120)'));
            }
        }
        const f2 = (x) => x.toFixed(2);
        const all = (k, f) => [].concat.apply([], res[k].map(f));
        for (const k of ['old', 'new']) {
            const j = stats(all(k, (x) => x.jobMs)), d = stats(all(k, (x) => x.drawMs));
            console.log('     120 new skins at once, ' + k + ' (' + runs + ' runs): skin frame jobs ms p50/p95/p99/max ' + [j.p50, j.p95, j.p99, j.max].map(f2).join('/') +
                ', draw-side ms p50/p95/p99/max ' + [d.p50, d.p95, d.p99, d.max].map(f2).join('/') + ' (per run max ' + res[k].map((x) => f2(Math.max.apply(null, x.drawMs))).join(',') + ')' + ', frames until all have a layer ' + res[k].map((x) => x.frames).join(',') +
                ', createImageBitmap at once max ' + Math.max.apply(null, res[k].map((x) => x.maxInflight)) +
                ', decoded bitmaps held max ' + Math.max.apply(null, res[k].map((x) => x.maxAliveMB)) + ' (1 MB each)');
        }
        for (const k of ['old', 'new']) {
            const top = [];
            res[k].forEach((x, r) => x.jobMs.forEach((v, i) => top.push([v, r, i])));
            top.sort((a, b) => b[0] - a[0]);
            console.log('       ' + k + ' slowest frame jobs (ms@run:frame): ' + top.slice(0, 8).map((t) => f2(t[0]) + '@' + t[1] + ':' + t[2]).join(' ') +
                '; frames over 16 ms ' + top.filter((t) => t[0] > 16).length + ', over 50 ms ' + top.filter((t) => t[0] > 50).length);
        }
        for (const k of ['old', 'new']) console.log('       ' + k + ' frame of the first upload (left out above) ms: ' + res[k].map((x) => f2(x.warm) + ' (first _lmSkinGpuPut ' + x.gp[0] + ')').join(', '));
        const o = res.old[0], n = res.new[0];
        check('120 skins: every skin has its layer in both versions, no GL error', res.old.concat(res.new).every((x) => x.uploaded === 120 && x.glError === 0));
        check('120 skins: the same texels in every layer as the previous version', res.new.every((x) => x.hashes.join() === o.hashes.join()));
        check('120 skins: at most 8 decodes at once and at most 32 decoded bitmaps held', res.new.every((x) => x.maxInflight <= 8 && x.maxAliveMB <= 32));
        check('120 skins: every bitmap closed', res.new.every((x) => x.closed === x.made));
        const fo = all('old', (x) => [x.frames]), fn = all('new', (x) => [x.frames]);
        check('120 skins: done in at most 1.5x the frames of the previous version', Math.max.apply(null, fn) <= 1.5 * Math.max.apply(null, fo) + 5);

        const so = await evaluate('__sq.stale(__sqOld, __sqDefaults)'), sn = await evaluate('__sq.stale(__sqNew, __sqDefaults)');
        console.log('     stale skins: previous version ' + JSON.stringify(so) + ', now ' + JSON.stringify(sn));
        check('stale skins: the skins on screen get their layer', sn.on === 20);
        check('stale skins: skins no draw asked for in 60 frames take no layer, their bitmaps are closed', sn.off === 0 && sn.aliveAfter === 0);
        check('stale skins: asked for again later, they are uploaded', sn.again === 14 && sn.closed === sn.made);

        const ko = await evaluate('__sq.fallback(__sqOld, __sqDefaults)'), kn = await evaluate('__sq.fallback(__sqNew, __sqDefaults)');
        console.log('     undecodable image: texSubImage3D inside the draw: previous version ' + ko.inDraw + ', now ' + kn.inDraw);
        check('undecodable image: uploaded from the frame job, not inside the draw', ko.inDraw === 3 && kn.inDraw === 0);
        check('undecodable image: the same texels as the synchronous upload, no GL error', kn.hashes.every((h) => h !== -1) && kn.hashes.join() === ko.hashes.join() && kn.glError === 0);

        const lo = await evaluate('__sq.lost(__sqOld, __sqDefaults)'), ln = await evaluate('__sq.lost(__sqNew, __sqDefaults)');
        console.log('     decodes finishing after a context loss: bitmaps still open, previous version ' + lo.alive + ', now ' + ln.alive);
        check('context lost: bitmaps that finish decoding then are closed at once', ln.made === 8 && ln.aliveAtOnce === 0 && ln.alive === 0);
        if (errors.length) { console.log('page errors:\n  ' + errors.join('\n  ')); failed++; }
    } finally {
        close();
    }
}

browser().then(() => {
    console.log(failed ? failed + ' check(s) failed' : 'all skin queue checks passed');
    setTimeout(() => process.exit(failed ? 1 : 0), 400);
}, (e) => {
    console.log('skinqueue error: ' + (e && e.stack || e));
    setTimeout(() => process.exit(1), 400);
});
