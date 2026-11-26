/* Driver of the dense-world acceptance benchmark (developers/tests/lib/bench-scene.js) in
 * headless Chrome: loads play.html with every www.legendmod.ml request served from a checkout
 * (as smoke.js; nothing is sent to a game server by the scenes), runs the scenes through the
 * real client and writes
 *   developers/tests/out/bench-<label>.json   every number of every scene
 *   developers/tests/out/bench-<label>.md     a short summary table
 *   developers/tests/out/bench-<label>/       per scene: <scene>.png (deterministic world frame)
 *                                             and <scene>-page.png (the whole page)
 * Started by node developers/tests/bench.js (see there) with these options:
 *   --preset quick|default|full|bots   scene list (default: default)
 *   --scenes a,b                  only these scene names (from the preset)
 *   --repo DIR                    the checkout to serve (default: this one)
 *   --label NAME                  output name (default: date and time)
 *   --compare LABEL|FILE.json     a previous run: per-scene deltas and a pixel diff of the frames
 *   --warm MS / --measure MS      warm-up and measured time per scene (default 2000 / 4000)
 *   --repeat N                    measure every scene N times, keep the median run by render p50
 *   --no-capture                  no screenshots
 *   --vsync                       keep Chrome's frame rate limit (default: unthrottled frames)
 *   --profile                     also a CPU profile of each scene: the 25 functions with the most
 *                                 self time (sampling slows the scene down; numbers are for finding
 *                                 the hot spots, not for comparing runs)
 *   --eval FILE                   an expression evaluated in the page after each scene's measurement
 *                                 (it may return a promise); its value is stored as the scene's extra
 *   --boot MS                     wait after the game started, before the first scene (default 5000)
 * Needs Node 22+ and Chrome (CHROME_PATH, or the usual install locations). */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const here = path.join(__dirname, '..');

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

const TYPES = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.gif': 'image/gif',
    '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff': 'font/woff', '.woff2': 'font/woff2',
    '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stamp() {
    const d = new Date(), p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

function fmtRow(r, prev) {
    const st = r.stages || {};
    const g = (k) => (st[k] ? st[k].msPerFrame : 0);
    const delta = (a, b) => (b == null ? '' : ' (' + (a - b >= 0 ? '+' : '') + (Math.round((a - b) * 100) / 100) + ')');
    const pr = prev || null;
    const c = r.counts || {};
    return '| ' + [r.name, r.fps + (pr ? delta(r.fps, pr.fps) : ''), r.frameMs.p50 + '/' + r.frameMs.p95 + '/' + r.frameMs.p99,
        r.renderMs.p50 + (pr ? delta(r.renderMs.p50, pr.renderMs.p50) : '') + '/' + r.renderMs.p95, r.glShare,
        Math.round(r.packetMsPerSec * 10) / 10, g('jelly prepare') + '/' + g('jelly build') + '/' + g('jelly physics'), g('food'),
        Math.round((g('text pass') + g('text raster')) * 1000) / 1000, c.uploadMs + ' / ' + c.textRasters,
        c.draws, c.pointsSubmitted + '/' + c.pointsIndexed, r.world.cells + '/' + r.world.food, r.heapMB.after,
        r.diff ? (r.diff.sizeDiffers ? 'size' : r.diff.max + ' / ' + r.diff.differingPct + '%') : ''].join(' | ') + ' |';
}

function summaryMd(meta, results, prevByName) {
    const L = [];
    L.push('# Dense-world benchmark ' + meta.label, '');
    L.push('- checkout: ' + meta.repo + (meta.head ? ' at ' + meta.head : ''));
    L.push('- Chrome ' + meta.browser + ', GPU: ' + meta.gpu + ', canvas ' + meta.canvas + ' at DPR ' + meta.dpr + ', zoom ' + meta.scale + (meta.vsync ? ', vsync' : ', unthrottled frames'));
    L.push('- ' + meta.warm + ' ms warm-up, ' + meta.measure + ' ms measured per scene' + (meta.repeat > 1 ? ', median of ' + meta.repeat + ' runs' : '') + (meta.compare ? '; deltas against ' + meta.compare : ''));
    L.push('- machine speed check: CPU ' + meta.calibrationMs + ' ms, GPU ' + meta.calibrationGpuMs + ' ms (fixed workloads in the page; higher while other programs keep the machine busy)');
    L.push('- page errors: ' + meta.errors.length, '');
    L.push('| scene | FPS | frame p50/p95/p99 ms | render p50/p95 ms | GL share | packets ms/s | jelly prep/build/move ms | food ms | text ms | GL upload ms / label rasters | GL draws | jelly points sub/idx | cells/food | heap MB | frame diff max / px |');
    L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    results.forEach((r) => L.push(fmtRow(r, prevByName ? prevByName[r.name] : null)));
    L.push('', 'Stage times are CPU self time per frame (ms) on the main thread (jelly move: the movePoints loop); GL share: frames drawn by the WebGL scene (the rest fell back to Canvas2D).',
        'GL upload ms, label rasters, GL draws and jelly points are per frame from a separate untimed pass.');
    L.push('A frame diff compares the deterministic world frame of each scene with the compared run (max channel difference / share of pixels that differ).');
    return L.join('\n') + '\n';
}

/* self time per function of a CDP CPU profile, largest first */
function topFunctions(profile, max) {
    if (!profile || !profile.nodes) return [];
    const byId = new Map(), self = new Map();
    profile.nodes.forEach((n) => byId.set(n.id, n));
    const dt = profile.timeDeltas || [];
    /* timeDeltas[i] is the time before sample i: a sample lasts until the next one */
    for (let i = 0; i + 1 < profile.samples.length; i++) {
        const n = byId.get(profile.samples[i]);
        if (!n) continue;
        const cf = n.callFrame, key = (cf.functionName || '(anonymous)') + '|' + cf.url.replace(/^https?:\/\/[^/]+\//, '').split('?')[0] + ':' + (cf.lineNumber + 1);
        self.set(key, (self.get(key) || 0) + (dt[i + 1] || 0) / 1000);
    }
    return [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([k, ms]) => ({ fn: k.split('|')[0], at: k.split('|')[1], ms: Math.round(ms) }));
}

async function main(argv) {
    const args = argv.slice();
    const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && i + 1 < args.length ? args[i + 1] : d; };
    const has = (n) => args.indexOf(n) >= 0;
    const repo = path.resolve(opt('--repo', path.join(here, '..', '..')));
    const label = opt('--label', stamp());
    const outRoot = path.join(here, 'out');
    const outDir = path.join(outRoot, 'bench-' + label);
    const warm = +opt('--warm', 2000), measure = +opt('--measure', 4000), repeat = Math.max(1, +opt('--repeat', 1) | 0);
    const capture = !has('--no-capture'), vsync = has('--vsync');
    const benchSrc = fs.readFileSync(path.join(__dirname, 'bench-scene.js'), 'utf8');
    const extraJs = opt('--eval', '') ? fs.readFileSync(opt('--eval', ''), 'utf8') : '';
    const B = require('./bench-scene.js');
    let list = B.matrix(opt('--preset', 'default'));
    const only = opt('--scenes', '');
    if (only) { const want = only.split(','); list = list.filter((s) => want.indexOf(s.name) >= 0); }
    if (!list.length) { console.log('no scenes'); return 1; }

    let prev = null, prevDir = null;
    const cmp = opt('--compare', '');
    if (cmp) {
        const f = fs.existsSync(cmp) ? cmp : path.join(outRoot, 'bench-' + cmp + '.json');
        prev = JSON.parse(fs.readFileSync(f, 'utf8'));
        prevDir = f.replace(/\.json$/, '');
    }
    const prevByName = {};
    if (prev) prev.results.forEach((r) => (prevByName[r.name] = r));

    if (typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('Node 22+ is required (global fetch and WebSocket)'); return 1; }
    const chrome = findChrome();
    if (!chrome) { console.log('bench: Chrome not found (set CHROME_PATH)'); return 2; }
    fs.mkdirSync(outDir, { recursive: true });
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-bench-'));
    const port = 9800 + Math.floor(Math.random() * 400);
    const W = 1600, H = 900;
    const flags = ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check',
        '--window-size=' + W + ',' + H, '--force-device-scale-factor=1', '--enable-precise-memory-info', '--autoplay-policy=no-user-gesture-required', '--lang=en-US',
        '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'];
    if (!vsync) flags.push('--disable-gpu-vsync', '--disable-frame-rate-limit');
    if (process.platform === 'linux') flags.push('--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader');
    flags.push('about:blank');
    const proc = spawn(chrome, flags, { stdio: 'ignore' });
    let id = 0;
    const pending = new Map(), errors = [];
    const cleanup = () => { try { proc.kill(); } catch (e) { } setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { } }, 500); };
    try {
        let ver;
        for (let i = 0; i < 60; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); break; } catch (e) { await sleep(200); } }
        if (!ver) { console.log('bench: Chrome did not start'); return 2; }
        const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
        const page = targets.find((t) => t.type === 'page');
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        const send = (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
        ws.onmessage = (ev) => {
            const m = JSON.parse(ev.data);
            if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
            if (m.method === 'Fetch.requestPaused') {
                const u = new URL(m.params.request.url);
                let rel = decodeURIComponent(u.pathname.replace(/^\//, ''));
                if (rel === '') rel = 'index.html';
                const file = path.join(repo, rel);
                if ((u.hostname === 'jimboy3100.github.io' || u.hostname === 'www.legendmod.ml' || u.hostname === 'legendmod.ml') && fs.existsSync(file) && fs.statSync(file).isFile()) {
                    send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200,
                        responseHeaders: [{ name: 'Content-Type', value: TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' }, { name: 'Access-Control-Allow-Origin', value: '*' }, { name: 'Cache-Control', value: 'no-store' }],
                        body: fs.readFileSync(file).toString('base64') });
                } else send('Fetch.continueRequest', { requestId: m.params.requestId });
            } else if (m.method === 'Runtime.exceptionThrown') {
                const d = m.params.exceptionDetails;
                errors.push('EXC ' + ((d.exception && d.exception.description) || d.text).split('\n').slice(0, 3).join(' | ') + ' @' + (d.url || '').replace(/^https:\/\/[^/]+\//, '') + ':' + d.lineNumber);
            } else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'assert')) {
                errors.push('CONSOLE.ERROR ' + m.params.args.map((a) => (a.value !== undefined ? String(a.value) : (a.description || a.type))).join(' ').slice(0, 300));
            }
        };
        await new Promise((r) => (ws.onopen = r));
        await send('Runtime.enable'); await send('Page.enable');
        await send('Emulation.setUserAgentOverride', { userAgent: (ver['User-Agent'] || '').replace('HeadlessChrome', 'Chrome'), acceptLanguage: 'en-US' });
        await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
        await send('Page.addScriptToEvaluateOnNewDocument', { source: "try { if (!localStorage.getItem('lmLangAsked')) localStorage.setItem('lmLangAsked', '1'); } catch (e) { }" });
        await send('Fetch.enable', { patterns: [{ urlPattern: '*://jimboy3100.github.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }, { urlPattern: '*://legendmod.ml/*' }] });
        await send('Page.navigate', { url: 'https://www.legendmod.ml/play.html' });
        const evalJs = async (expr) => {
            const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
            if (r && r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
            return r && r.result ? r.result.value : undefined;
        };
        let ready = false;
        const tBoot = Date.now();
        for (let i = 0; i < 120 && !ready; i++) {
            await sleep(500);
            try { ready = await evalJs('!!(window.legendmod && window.drawRender && window.drawRender.canvas && window.application && window.jQuery && jQuery("#og-options").children().length)'); } catch (e) { }
        }
        if (!ready) { console.log('bench: the game did not start in the page'); return 3; }
        console.log('bench: game ready after ' + Math.round((Date.now() - tBoot) / 1000) + ' s');
        /* fonts, skins list, first frames */
        await sleep(+opt('--boot', 5000));
        await evalJs(benchSrc + '\n;true');
        const speed = "[LMBenchDense.calibrate(function () { return performance.now(); }), LMBenchDense.calibrateGpu()]";
        const calib = [await evalJs(speed)];
        const browser = String(ver.Browser || '').replace(/^HeadlessChrome\//, '');
        let head = '';
        try { head = require('child_process').execSync('git -C "' + repo + '" rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch (e) { }
        const results = [];
        let gpu = '', canvas = '', dpr = 1;
        console.log('bench: ' + list.length + ' scene(s), ' + warm + ' ms warm-up + ' + measure + ' ms each' + (repeat > 1 ? ' x' + repeat : '') + ', out ' + outDir);
        for (const spec of list) {
            const runs = [];
            if (has('--profile')) { await send('Profiler.enable'); await send('Profiler.setSamplingInterval', { interval: 200 }); await send('Profiler.start'); }
            for (let k = 0; k < repeat; k++) {
                const json = await evalJs('LMBenchDense.run(' + JSON.stringify(spec) + ', ' + JSON.stringify({ warmMs: warm, measureMs: measure }) + ').then(function (r) { return JSON.stringify(r); })');
                runs.push(JSON.parse(json));
            }
            if (extraJs) {
                try { runs[runs.length - 1].extra = await evalJs(extraJs); } catch (e) { runs[runs.length - 1].extra = 'eval failed: ' + e.message; }
                console.log('    extra: ' + JSON.stringify(runs[runs.length - 1].extra).slice(0, 2000));
            }
            let hot = null;
            if (has('--profile')) {
                const pr = await send('Profiler.stop');
                hot = topFunctions(pr && pr.profile, 25);
            }
            runs.sort((a, b) => a.renderMs.p50 - b.renderMs.p50);
            const r = runs[(runs.length - 1) >> 1];
            if (hot) { r.profile = hot; hot.slice(0, 12).forEach((h) => console.log('    ' + h.ms + ' ms  ' + h.fn + '  ' + h.at)); }
            if (repeat > 1) r.repeats = runs.map((x) => ({ fps: x.fps, renderP50: x.renderMs.p50, frameP50: x.frameMs.p50 }));
            gpu = r.gpu; canvas = r.canvas.join('x'); dpr = r.dpr;
            if (capture) {
                const cap = JSON.parse(await evalJs('LMBenchDense.capture().then(function (c) { return JSON.stringify(c); })'));
                const png = path.join(outDir, spec.name + '.png');
                fs.writeFileSync(png, Buffer.from(cap.png.split(',')[1], 'base64'));
                r.capture = { file: path.relative(outRoot, png).replace(/\\/g, '/'), gl: cap.gl, layers: cap.layers, world: cap.world };
                const shot = await send('Page.captureScreenshot', { format: 'png' });
                if (shot && shot.data) fs.writeFileSync(path.join(outDir, spec.name + '-page.png'), Buffer.from(shot.data, 'base64'));
                const prevPng = prevDir ? path.join(prevDir, spec.name + '.png') : null;
                if (prevPng && fs.existsSync(prevPng)) {
                    r.diff = await evalJs('LMBenchDense.diffImages(' + JSON.stringify('data:image/png;base64,' + fs.readFileSync(prevPng).toString('base64')) + ', ' + JSON.stringify(cap.png) + ')');
                }
            }
            results.push(r);
            console.log(fmtRow(r, prevByName[r.name]));
        }
        await evalJs('LMBenchDense.stop(), true');
        calib.push(await evalJs(speed));
        /* CPU: the slower of before and after, how busy the machine was during the run; GPU: after
         * only (before, the page is still uploading skins and fonts: 15-30x slower) */
        const calibrationMs = Math.max(calib[0][0], calib[1][0]), calibrationGpuMs = calib[1][1];
        console.log('bench: machine speed check CPU ' + calib[0][0] + ' / ' + calib[1][0] + ' ms, GPU ' + calib[0][1] + ' / ' + calib[1][1] + ' ms (fixed workloads before / after; lower is faster)');
        const meta = { label, repo, head, browser, gpu, canvas, dpr, scale: B.VIEW.scale, warm, measure, repeat, vsync, compare: cmp || null, errors: [...new Set(errors)], date: new Date().toISOString(), calibrationMs, calibrationGpuMs };
        fs.writeFileSync(path.join(outRoot, 'bench-' + label + '.json'), JSON.stringify({ meta, results }, null, 1));
        fs.writeFileSync(path.join(outRoot, 'bench-' + label + '.md'), summaryMd(meta, results, prev ? prevByName : null));
        console.log('bench: wrote ' + path.join(outRoot, 'bench-' + label + '.json') + ' and .md');
        if (meta.errors.length) { console.log('page errors:'); meta.errors.slice(0, 20).forEach((e) => console.log('  ' + e)); }
        ws.close();
        return 0;
    } finally { cleanup(); }
}

module.exports = { main, summaryMd, fmtRow, findChrome };
if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c || 0), (e) => { console.error(e); process.exit(1); });
