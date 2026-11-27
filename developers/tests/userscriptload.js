/* Legend Express userscript (LMexpress/LMexpress.user.js) on a stand-in agar.io in headless Chrome,
 * run like a userscript manager runs it (in a JS world of its own), at true document start and LATE
 * (after agar.io's page loaded: a userscript manager that was still waking up, e.g. the first visit
 * after the browser started). The stand-in agar.io has heavy scripts, a game WebSocket, an interval, a
 * requestAnimationFrame loop, a Worker and a service worker, like the real one. It checks: the takeover
 * (a themed loading screen at once, agar.io never on screen and never running), the single-owner protocol
 * with the extension, every routing mode (/normal leaves agar.io untouched), the launch link, the release
 * cache (a new release, a damaged copy, a copy that does not start the mod, the server down), the bounded
 * recovery of a late start (one reload, never a loop) and the Tampermonkey / Greasemonkey 4 / plain-fetch
 * APIs. With --report it prints the times (loading screen, Legend Mod on screen) and what of agar.io still
 * runs behind Legend Mod. --loader <file> runs another loader file (an older version, to compare).
 * Skipped when Chrome or Node 22+ is not found.
 * node developers/tests/userscriptload.js [repoDir] [--report] [--loader <file>] */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), crypto = require('crypto');
const args = process.argv.slice(2);
const report = args.includes('--report');
const li = args.indexOf('--loader');
const loaderFile = li >= 0 ? path.resolve(args[li + 1]) : null;
const repo = path.resolve(args.filter((a, i) => a.indexOf('--') !== 0 && (li < 0 || i !== li + 1))[0] || path.join(__dirname, '..', '..'));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [];
  for (const b of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]) if (b) c.push(path.join(b, 'Google/Chrome/Application/chrome.exe'));
  c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
  return c.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome || typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('skipped: Chrome or Node 22+ not found'); process.exit(0); }

const loaderSrc = fs.readFileSync(loaderFile || path.join(repo, 'LMexpress', 'LMexpress.user.js'), 'utf8');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (info !== undefined && (!c || report) ? '  [' + info + ']' : '')); if (!c) fail++; };

/* agar.io's game server: a WebSocket that sends a message every 20 ms, like a game socket does */
const openSockets = new Set();
const wsServer = http.createServer((q, s) => { s.writeHead(404); s.end(); });
wsServer.on('upgrade', (req, sock) => {
  const accept = crypto.createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  sock.openedAt = Date.now();
  openSockets.add(sock);
  const frame = Buffer.concat([Buffer.from([0x81, 100]), Buffer.alloc(100, 65)]);
  const t = setInterval(() => { try { sock.write(frame); } catch (e) { } }, 20);
  const done = () => { clearInterval(t); openSockets.delete(sock); };
  sock.on('close', done); sock.on('error', done); sock.on('end', done);
  sock.on('data', d => { if ((d[0] & 0x0f) === 8) { try { sock.end(); } catch (e) { } done(); } });
});

/* the stand-in agar.io: its bundle takes 150 ms to run, then runs the game: an interval, a frame loop,
 * the game socket, a worker and a service worker, each costing some CPU; all counted in window.__agar */
const agarPage = () => '<!DOCTYPE html><html><head><meta charset="windows-1252"><title>Agar.io</title>' +
  '<script src="/bundle.js"></script></head><body><canvas id="canvas"></canvas><h1 id="agar-vanilla">AGARIO-VANILLA</h1>' +
  '<p>agar.io</p>'.repeat(2000) + '</body></html>';
const agarBundle = (wsPort, server) => '/*' + 'x'.repeat(1500000) + '*/\n' +
  'function __busy(ms) { var e = performance.now() + ms; while (performance.now() < e) { } }\n' +
  '__busy(150); window.__agar = { ticks: 0, raf: 0, ws: 0, worker: 0 };\n' +
  /* agar.io's own code tidying the address (the launch link must survive it) */
  (server.agarStrip ? 'history.replaceState(null, "", "/");\n' : '') +
  'setInterval(function () { __busy(2); window.__agar.ticks++; }, 16);\n' +
  '(function loop() { __busy(1); window.__agar.raf++; requestAnimationFrame(loop); })();\n' +
  'try { var s = new WebSocket("ws://127.0.0.1:' + wsPort + '/"); s.onmessage = function () { __busy(0.5); window.__agar.ws++; }; s.onerror = function () { window.__agar.wsErr = 1; }; s.onopen = function () { window.__agar.wsOpen = 1; }; } catch (e) { window.__agar.wsErr = String(e); }\n' +
  'try { var w = new Worker(URL.createObjectURL(new Blob(["setInterval(function () { postMessage(1); }, 50);"]))); w.onmessage = function () { window.__agar.worker++; }; } catch (e) { }\n' +
  (server.sw ? 'try { navigator.serviceWorker.register("/sw.js").then(function () { window.__agar.sw = 1; }, function (e) { window.__agar.sw = String(e); }); } catch (e) { }\n' : '');
/* agar.io's service worker: serves agar.io's page from its cache once it has it (a fast cached agar.io) */
const agarSw = 'self.addEventListener("install", function (e) { self.skipWaiting(); e.waitUntil(caches.open("a").then(function (c) { return c.add("/"); })); });' +
  'self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });' +
  'self.addEventListener("fetch", function (e) { if (e.request.mode !== "navigate" || new URL(e.request.url).pathname !== "/") return;' +
  ' e.respondWith(caches.match("/").then(function (r) { return r || fetch(e.request); })); });';
/* Legend Mod's play.html: its init() comes from LMexpress.js, like the real one */
const legendPage = (release) => '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Legend Mod</title>' +
  '<link rel="stylesheet" href="https://www.legendmod.ml/LMexpress/master.css?v=3.699"></head><body><div id="lm-ok">Legend</div>' +
  '<div id="lm-release">' + release + '</div>' + '<!-- ' + 'play.html '.repeat(150) + '-->' +
  '<script src="https://www.legendmod.ml/LMexpress/LMexpress.js?v=3.699"></script>' +
  '<script>window.__lmScript = 1; requestAnimationFrame(function () { window.__lmPaint = Date.now(); });</script></body></html>';
const lmExpressJs = 'function init(v) { window.__lmInit = v; window.__lmInits = (window.__lmInits || 0) + 1; }';

/* the userscript managers' APIs. tm: GM_* (Tampermonkey, Violentmonkey), GM storage kept here in
 * localStorage under __gm_; gm4: only GM.* with promises (Greasemonkey 4, Safari managers); none: no
 * GM request function at all (the loader uses fetch) */
const xhrBody = 'var x = new XMLHttpRequest(); x.open(o.method, o.url);' +
  ' x.onload = function () { o.onload({ status: x.status, finalUrl: x.responseURL, responseText: x.responseText, responseHeaders: x.getAllResponseHeaders() }); };' +
  ' x.onerror = function (e) { o.onerror(e); }; x.send();';
const apis = {
  tm: 'var GM_info = { scriptHandler: "Tampermonkey", version: "5.3", script: { version: "9.9.9" } }; function GM_registerMenuCommand() { }' +
    'function GM_getValue(k, d) { var v = localStorage.getItem("__gm_" + k); return v == null ? d : JSON.parse(v); }' +
    'function GM_setValue(k, v) { localStorage.setItem("__gm_" + k, JSON.stringify(v)); }' +
    'function GM_deleteValue(k) { localStorage.removeItem("__gm_" + k); }' +
    'function GM_xmlhttpRequest(o) { ' + xhrBody + ' }\n',
  gm4: 'var GM = { info: { scriptHandler: "Greasemonkey", version: "4.13", script: { version: "9.9.9" } },' +
    ' getValue: function (k, d) { return new Promise(function (r) { setTimeout(function () { var v = localStorage.getItem("__gm_" + k); r(v == null ? d : JSON.parse(v)); }, 5); }); },' +
    ' setValue: function (k, v) { localStorage.setItem("__gm_" + k, JSON.stringify(v)); return Promise.resolve(); },' +
    ' deleteValue: function (k) { localStorage.removeItem("__gm_" + k); return Promise.resolve(); },' +
    ' xmlHttpRequest: function (o) { ' + xhrBody + ' } };\n',
  none: 'var GM_info = { scriptHandler: "Userscripts", script: { version: "9.9.9" } };\n'
};
/* per visit, from the cookie __h = "<timing>.<api>.<owner>". timing: early (as soon as agar.io's <html>
 * exists: document start), late (300 ms after its load event), lateOnce (late on the first visit of the
 * tab only), off (no userscript). owner: ext (the extension already owns this page load), stale (an
 * extension value from an earlier page load), none */
const injected = 'if (location.hostname === "agar.io") { (function () {' +
  ' var h = (/(?:^|; )__h=([^;]*)/.exec(document.cookie) || [])[1] || "off"; var p = h.split("."), timing = p[0], api = p[1] || "tm", owner = p[2] || "none";' +
  ' if (timing === "off") return; var srcs = ' + JSON.stringify(apis) + ', loader = ' + JSON.stringify(loaderSrc) + ';' +
  ' var run = function () {' +
  '  if (owner === "ext") { try { sessionStorage.setItem("lm-loader-owner", "extension:" + performance.timeOrigin); } catch (e) { } document.documentElement.setAttribute("data-lm-loader", "extension:" + performance.timeOrigin); }' +
  '  if (owner === "stale") { try { sessionStorage.setItem("lm-loader-owner", "extension:12345.5"); } catch (e) { } }' +
  '  (0, eval)(srcs[api] + loader); };' +
  ' var seen = false; try { seen = !!sessionStorage.getItem("__harnessSeen"); sessionStorage.setItem("__harnessSeen", "1"); } catch (e) { }' +
  ' if (timing === "late" || (timing === "lateOnce" && !seen)) { addEventListener("load", function () { setTimeout(run, 300); }); return; }' +
  ' if (document.documentElement) { run(); return; }' +
  ' var o = new MutationObserver(function () { if (!document.documentElement) return; o.disconnect(); run(); });' +
  ' o.observe(document, { childList: true }); })(); }';

async function withChrome(server, fn) {
  const port = 9600 + Math.floor(Math.random() * 300);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-usload-'));
  const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--allow-running-insecure-content', '--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights,LocalNetworkAccessChecks', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  const counts = { agarDoc: 0, play: 0, bundle: 0, hslo: 0, captcha: 0, lmx: 0, sw: 0 };
  let ws;
  try {
    let ok = false;
    for (let i = 0; i < 300 && !ok; i++) { try { await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); ok = true; } catch (e) { await sleep(200); } }
    if (!ok) throw new Error('chrome did not start');
    const page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find(t => t.type === 'page');
    ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    const send = (method, params = {}, sessionId) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify(Object.assign({ id: i, method, params }, sessionId ? { sessionId } : {}))); });
    const reply = (m, code, body, type, headers, delay) => setTimeout(() => send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: code,
      responseHeaders: [{ name: 'Content-Type', value: type || 'text/html' }, { name: 'Access-Control-Allow-Origin', value: '*' }].concat(headers || []),
      body: Buffer.from(body, 'latin1').toString('base64') }, m.sessionId), delay || 0);
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
      /* agar.io's service worker: its own requests are intercepted in its own session */
      if (m.method === 'Target.attachedToTarget') {
        const sid = m.params.sessionId;
        send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }] }, sid).then(() => send('Runtime.runIfWaitingForDebugger', {}, sid));
        return;
      }
      if (m.method !== 'Fetch.requestPaused') return;
      const u = new URL(m.params.request.url);
      if (u.hostname === 'agar.io' && u.pathname === '/__reset') return reply(m, 200, '<!DOCTYPE html><html><body>reset</body></html>');
      if (u.hostname === 'agar.io' && u.pathname === '/sw.js') { counts.sw++; return reply(m, 200, agarSw, 'text/javascript'); }
      if (u.hostname === 'agar.io' && u.pathname === '/bundle.js') { counts.bundle++; return reply(m, 200, agarBundle(wsServer.address().port, server), 'text/javascript', null, 400); }
      if (u.hostname === 'agar.io' && u.pathname === '/favicon.ico') return reply(m, 404, '');
      /* agar.io's page (also when its service worker fetches it for its cache) */
      if (u.hostname === 'agar.io') { if (m.params.resourceType === 'Document') counts.agarDoc++; return reply(m, 200, agarPage(), null, null, 200); }
      if (u.hostname === 'www.legendmod.ml' && u.pathname === '/play.html') {
        counts.play++;
        return reply(m, server.playStatus || 200, server.playStatus >= 400 ? 'server error' : legendPage(server.release), null, [{ name: 'Cache-Control', value: 'max-age=' + server.maxAge }], server.playDelay);
      }
      if (u.hostname === 'www.legendmod.ml' && u.pathname === '/LMexpress/LMexpress.js') { counts.lmx++; return reply(m, server.lmxStatus || 200, server.lmxStatus >= 400 ? '' : lmExpressJs, 'text/javascript', null, 30); }
      if (u.hostname === 'www.legendmod.ml' && u.pathname === '/ogario/captcha.html') { counts.captcha++; return reply(m, 200, '<!DOCTYPE html><html><body><div id="captcha-ok">captcha</div></body></html>', null, null, 100); }
      if (u.hostname === 'hslo.io') { counts.hslo++; return reply(m, 200, 'document.title = "HSLO-OK" + (document.body ? " body" : "");', 'text/javascript', null, 100); }
      reply(m, 404, '');
    };
    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Performance.enable');
    await send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }, { urlPattern: '*://hslo.io/*' }] });
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
    /* like a userscript manager: in a JS world of its own, not the page's */
    await send('Page.addScriptToEvaluateOnNewDocument', { source: injected, worldName: 'userscript' });
    /* a first navigation warms Chrome up, so the timings below are the loader's own */
    await send('Page.navigate', { url: 'https://www.legendmod.ml/warmup' });
    await sleep(1500);
    /* what is on screen at each painted frame, logged with its time in sessionStorage (it survives a reload) */
    await send('Page.addScriptToEvaluateOnNewDocument', { source: 'if (location.hostname === "agar.io") (function () { var last = "";' +
      ' function state() { var d = document; if (d.getElementById("lm-ok")) return "legend"; if (d.getElementById("lmx-loading")) return "loader";' +
      ' if (d.getElementById("lmx-error")) return "error"; if (d.getElementById("agar-vanilla")) return "agar"; return d.body && d.body.textContent.trim() ? "other" : "blank"; }' +
      ' function note() { var s = state(); if (s !== last) { last = s; try { var l = JSON.parse(sessionStorage.getItem("__tl") || "[]");' +
      ' l.push([s, Date.now()]); sessionStorage.setItem("__tl", JSON.stringify(l)); } catch (e) { } } }' +
      /* frames, and the page's changes too (a late start cancels the frames that were pending, this one's as well) */
      ' (function frame() { note(); requestAnimationFrame(frame); })();' +
      ' new MutationObserver(note).observe(document, { childList: true, subtree: true }); })();' });
    const evalPage = async (expr) => { const r = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: expr }); return r && r.result ? r.result.value : undefined; };
    const setMode = (h) => send('Network.setCookie', { name: '__h', value: h, domain: 'agar.io', path: '/', secure: true });
    /* a clean agar.io: no storage of the loader, the release cache, the tab's session or a service worker */
    async function reset() {
      await setMode('off');
      await send('Page.navigate', { url: 'https://agar.io/__reset' });
      await sleep(400);
      await evalPage('(async function () { localStorage.clear(); sessionStorage.clear(); try { var r = await navigator.serviceWorker.getRegistrations(); for (var i = 0; i < r.length; i++) await r[i].unregister(); } catch (e) { } return 1; })()');
      await sleep(200);
    }
    /* what is on screen, until Legend Mod (or untilExpr) shows */
    async function visit(url, h, opts) {
      opts = opts || {};
      await setMode(h);
      try { await evalPage('sessionStorage.removeItem("__tl")'); } catch (e) { }
      const before = Object.assign({}, counts);
      const t0 = Date.now();
      await send('Page.navigate', { url });
      let seq = [], shown = -1;
      while (Date.now() - t0 < (opts.maxMs || 12000)) {
        await sleep(150);
        let l = null; try { l = JSON.parse(await evalPage('sessionStorage.getItem("__tl")') || 'null'); } catch (e) { }
        if (!l) continue;
        seq = l.filter(x => x[1] >= t0).map(x => ({ s: x[0], t: x[1] - t0 }));
        const done = opts.untilExpr ? await evalPage(opts.untilExpr) : seq.some(x => x.s === 'legend');
        if (done) { const lg = seq.find(x => x.s === 'legend'); shown = lg ? lg.t : Date.now() - t0; break; }
      }
      /* the loader's last steps (the init signal, the background check of the release) */
      await sleep(opts.settle || 600);
      try { const l = JSON.parse(await evalPage('sessionStorage.getItem("__tl")') || 'null'); if (l) seq = l.filter(x => x[1] >= t0).map(x => ({ s: x[0], t: x[1] - t0 })); } catch (e) { }
      const d = {}; for (const k in counts) d[k] = counts[k] - before[k];
      const ld = seq.find(x => x.s === 'loader');
      let info = {};
      try {
        info = JSON.parse(await evalPage('JSON.stringify({ boot: JSON.parse(sessionStorage.getItem("lmx-boot") || "null"), url: localStorage.getItem("url"),' +
          ' release: (document.getElementById("lm-release") || {}).textContent || "", init: window.__lmInit || "", inits: window.__lmInits || 0, href: location.href,' +
          ' title: document.title, owner: sessionStorage.getItem("lm-loader-owner"), sw: !!navigator.serviceWorker.controller,' +
          ' agar: window.__agar || null, loading: !!document.getElementById("lmx-loading"), text: document.body ? document.body.textContent.slice(0, 200) : "" })') || '{}');
      } catch (e) { }
      return Object.assign({ t0, shown, loader: ld ? ld.t : -1, seq, counts: d, boot: null }, info);
    }
    /* what of agar.io still runs behind Legend Mod: counters over 2 s, its sockets opened since the visit began, main-thread CPU */
    async function leftovers(since) {
      await sleep(500);
      const metric = async () => { const r = await send('Performance.getMetrics'); const f = (r.metrics || []).find(x => x.name === 'TaskDuration'); return f ? f.value : 0; };
      const a = JSON.parse(await evalPage('JSON.stringify(window.__agar || null)') || 'null'), ca = await metric();
      await sleep(2000);
      const b = JSON.parse(await evalPage('JSON.stringify(window.__agar || null)') || 'null'), cb = await metric();
      const d = k => (a && b ? b[k] - a[k] : 0);
      return { ticks: d('ticks'), raf: d('raf'), ws: d('ws'), worker: d('worker'), sockets: [...openSockets].filter(x => x.openedAt >= (since || 0)).length, wsState: b ? (b.wsOpen ? 'open' : b.wsErr ? 'err ' + b.wsErr : 'none') : '-', cpu: Math.round((cb - ca) / 2 * 100) };
    }
    return await fn({ visit, leftovers, evalPage, reset, counts, server });
  } finally {
    try { ws && ws.close(); } catch (e) { }
    proc.kill();
    await sleep(400);
    for (const s of openSockets) { try { s.destroy(); } catch (e) { } }
    openSockets.clear();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { }
  }
}

const fmt = v => v.seq.map(x => x.s + '@' + x.t).join(' > ') + ' | loading screen ' + v.loader + ' ms, Legend shown ' + v.shown + ' ms';
const fmtL = l => 'timers ' + l.ticks + ', frames ' + l.raf + ', socket msgs ' + l.ws + ', worker msgs ' + l.worker + ' (per 2 s), open sockets ' + l.sockets + ' (' + l.wsState + '), main-thread CPU ' + l.cpu + '%';
const boot = v => v.boot || { states: [], source: '', conflict: '', manager: '' };
const lastState = v => boot(v).states.length ? boot(v).states[boot(v).states.length - 1][0] : '-';
const quiet = l => l.ticks === 0 && l.raf === 0 && l.ws === 0 && l.worker === 0 && l.sockets === 0;
const LAUNCH = 'https://agar.io/?sip=127.0.0.1:1&pass=abc#party1';
const rpt = (name, v, l) => { if (report) console.log('  ' + name + ': ' + fmt(v) + (l ? '\n      ' + fmtL(l) : '') + '\n      agar.io page loads ' + v.counts.agarDoc + ', play.html requests ' + v.counts.play + ', boot ' + JSON.stringify(v.boot)); };

(async () => {
  /* the site's real play.html is what the release cache keeps (the loader's own test of a Legend page) */
  const legendTest = /function isLegendHtml\(html\) \{[\s\S]*?\r?\n\}/.exec(loaderSrc);
  if (legendTest) {
    const isLegend = new Function(legendTest[0] + '; return isLegendHtml;')();
    const play = fs.readFileSync(path.join(repo, 'play.html'), 'utf8');
    check('release cache: the real play.html is kept, an error or portal page is not', isLegend(play) && !isLegend('<html><body>' + 'x'.repeat(2000) + '</body></html>') && !isLegend(play.slice(0, 5000)));
  }
  /* the mod's "can be updated" notice (LMexpress.js startLM) compares the loader's version number by number:
   * this userscript's 1.9 is not an old version */
  const below = /function lmxVersionBelow\(a, b\) \{[\s\S]*?\r?\n\}/.exec(fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8'));
  check('LMexpress.js: lmxVersionBelow found', !!below);
  if (below) {
    const f = new Function(below[0] + '; return lmxVersionBelow;')();
    check('update notice: 1.7 is below 1.8; 1.8, 1.8.5, 1.8.7, 1.9, 1.9.1, 1.10 and 2.0 are not',
      f('1.7', '1.8') && f('1.7.9', '1.8') && ['1.8', '1.8.5', '1.8.7', '1.9', '1.9.1', '1.10', '2.0'].every(x => !f(x, '1.8')) && f('1.8.7', '1.9') && !f('1.10', '1.9'));
  }
  await new Promise(r => wsServer.listen(0, '127.0.0.1', r));
  const server = { release: 'r1', maxAge: 600, playDelay: 500 };
  await withChrome(server, async ({ visit, leftovers, evalPage, reset }) => {
    /* 1. document start: the loading screen at once, then Legend Mod; agar.io never on screen, never runs */
    await reset();
    let v = await visit(LAUNCH, 'early.tm'), l = await leftovers(v.t0);
    rpt('document start', v, l);
    check('document start: Legend Mod is shown, the themed loading screen before it (no blank page)', v.shown > 0 && v.loader >= 0 && v.loader <= v.shown && !v.seq.some(x => x.s === 'blank' && x.t > v.loader && x.t < v.shown), fmt(v));
    check('document start: agar.io is never on screen and nothing of it runs', !v.seq.some(x => x.s === 'agar') && quiet(l), fmtL(l));
    check('document start: init(<version>) runs exactly once, the loader reaches READY', v.init === '9.9.9' && v.inits === 1 && lastState(v) === 'READY', JSON.stringify(v.boot));
    check('the launch link (?sip= ?pass= #party) is kept for Legend Mod', v.url === LAUNCH && v.href === LAUNCH, v.url);
    check('the page owner is the userscript of this page load', /^userscript:/.test(v.owner || ''), v.owner);

    /* 2. the release cache: Legend Mod's server is slow (3 s): the saved play.html runs at once */
    server.playDelay = 3000;
    v = await visit('https://agar.io/', 'early.tm', { settle: 3200 });
    rpt('cached release, slow server', v);
    check('cached release: Legend Mod is shown long before the slow server answers', v.shown > 0 && v.shown < 2500 && boot(v).source === 'cache' && v.release === 'r1', fmt(v));
    check('cached release: the server is still asked (the release is checked on every visit)', v.counts.play === 1, v.counts.play);

    /* 3. a new release, the server answering quickly: used on this same visit */
    server.playDelay = 50; server.release = 'r2';
    v = await visit('https://agar.io/', 'early.tm');
    check('new release, fast server: the new play.html is used at once', v.release === 'r2' && boot(v).source === 'network', v.release + ' ' + boot(v).source);
    /* 4. a new release on a slow server: the saved one now, the new one on the next visit */
    server.playDelay = 1500; server.release = 'r3';
    v = await visit('https://agar.io/', 'early.tm', { settle: 1800 });
    const v2 = await visit('https://agar.io/', 'early.tm', { settle: 1800 });
    check('new release, slow server: the saved release now, the new release on the next visit', v.release === 'r2' && v2.release === 'r3', v.release + ' then ' + v2.release);

    /* 5. a damaged saved copy (its checksum): not used, the page comes from the server */
    server.playDelay = 300; server.release = 'r4';
    await evalPage('(function () { var k = "__gm_release-2", r = JSON.parse(localStorage.getItem(k)); r.html = r.html.replace("Legend", "Legenx"); localStorage.setItem(k, JSON.stringify(r)); return 1; })()');
    v = await visit('https://agar.io/', 'early.tm');
    check('damaged saved release: dropped, Legend Mod from the server', v.release === 'r4' && boot(v).source === 'network' && boot(v).conflict === 'cache-damaged' && v.init === '9.9.9', JSON.stringify(v.boot));

    /* 6. a saved copy that does not start the mod (LMexpress.js missing): dropped, one reload, no loop */
    server.lmxStatus = 404; server.playDelay = 1200;
    v = await visit('https://agar.io/', 'early.tm', { settle: 4000, untilExpr: 'false', maxMs: 5000 });
    rpt('cached page without init', v);
    check('saved release without init: dropped and loaded once more from the server, never a loop', v.counts.agarDoc === 2 && lastState(v) === 'FAILED' && boot(v).source === 'network', v.counts.agarDoc + ' ' + JSON.stringify(v.boot));
    server.lmxStatus = 0;

    /* 7. Legend Mod's server down, nothing saved: an error page with Try again (no white page), one retry */
    await reset();
    server.playStatus = 503; server.playDelay = 50;
    v = await visit('https://agar.io/', 'early.tm', { untilExpr: '!!document.getElementById("lmx-error")', settle: 300 });
    check('server down, nothing saved: an error page to try again, after one retry', v.seq.some(x => x.s === 'error') && v.counts.play === 2 && lastState(v) === 'FAILED', fmt(v) + ' play ' + v.counts.play);
    /* 8. ... with a saved release: Legend Mod runs from it */
    server.playStatus = 0;
    await visit('https://agar.io/', 'early.tm');
    server.playStatus = 503;
    v = await visit('https://agar.io/', 'early.tm');
    check('server down, a release saved: Legend Mod runs from it', v.shown > 0 && v.init === '9.9.9' && boot(v).source === 'cache', JSON.stringify(v.boot));
    server.playStatus = 0; server.playDelay = 500;

    /* 9. single owner: the extension owns this page load: the userscript does nothing */
    await reset();
    v = await visit('https://agar.io/', 'early.tm.ext', { untilExpr: '!!(window.__agar && window.__agar.ticks > 5)', settle: 300 });
    check('extension owns the page: the userscript does nothing (agar.io as the extension left it)', v.seq.some(x => x.s === 'agar') && !v.seq.some(x => x.s === 'loader') && v.counts.play === 0 && /^extension:/.test(v.owner || ''), fmt(v));
    v = await visit('https://agar.io/', 'early.tm.stale');
    check('an owner from an earlier page load is not live: the userscript runs', v.shown > 0 && /^userscript:/.test(v.owner || ''), v.owner);

    /* 10. /normal: agar.io untouched, not downloaded again, never a loading screen */
    v = await visit('https://agar.io/normal', 'early.tm', { untilExpr: '!!(window.__agar && window.__agar.ticks > 5)', settle: 300 });
    rpt('/normal', v);
    check('/normal: agar.io runs untouched (one page download, no loading screen, no Legend page)', v.counts.agarDoc === 1 && v.counts.play === 0 && !v.seq.some(x => x.s === 'loader') && !!v.agar && v.agar.ticks > 5, fmt(v));

    /* 11. the other modes */
    v = await visit('https://agar.io/captcha', 'early.tm', { untilExpr: '!!document.getElementById("captcha-ok")' });
    check('/captcha: the captcha helper page', v.counts.captcha === 1 && v.text.indexOf('captcha') >= 0, v.text);
    v = await visit('https://agar.io/hslo', 'early.tm', { untilExpr: 'document.title.indexOf("HSLO-OK") === 0', settle: 300 });
    check('/hslo: its userscript runs on an empty page (the loading screen gone)', v.title.indexOf('HSLO-OK') === 0 && !v.loading && v.counts.agarDoc === 1 && v.counts.hslo === 1, v.title);
    v = await visit('https://agar.io/delta', 'early.tm', { untilExpr: '!!document.querySelector("a[href*=greasyfork]")', settle: 200 });
    check('/delta: the Delta install notice', v.text.length > 0 && v.counts.play === 0 && lastState(v) === 'READY', v.text);
    v = await visit('https://agar.io/mobile?sip=127.0.0.1:2', 'early.tm');
    check('/mobile: Legend Mod with its launch link', v.shown > 0 && v.init === '9.9.9' && v.url === 'https://agar.io/mobile?sip=127.0.0.1:2', v.url);

    /* 12. Greasemonkey 4 / Safari managers (GM.* promises only) and a manager without a request function */
    await reset();
    v = await visit('https://agar.io/', 'early.gm4');
    const g2 = await visit('https://agar.io/', 'early.gm4');
    check('GM.* only (Greasemonkey 4): Legend Mod, and the release saved with GM.setValue', v.shown > 0 && v.init === '9.9.9' && boot(g2).source === 'cache' && boot(g2).manager === 'Greasemonkey 4.13', JSON.stringify(g2.boot));
    await reset();
    v = await visit('https://agar.io/', 'early.none');
    check('no GM request function: Legend Mod loaded with fetch', v.shown > 0 && v.init === '9.9.9', JSON.stringify(v.boot));

    /* 13. late on the first visit only (the manager was waking up): one reload, then nothing of agar.io */
    await reset();
    server.agarStrip = true;
    v = await visit(LAUNCH, 'lateOnce.tm', { settle: 800 }); l = await leftovers(v.t0);
    rpt('late once', v, l);
    check('late start: Legend Mod is shown after one reload', v.shown > 0 && v.counts.agarDoc === 2 && boot(v).conflict === 'late-start-reloaded', fmt(v));
    check('late start: nothing of agar.io keeps running behind Legend Mod (timers, frames, socket, worker)', quiet(l), fmtL(l));
    check('late start: the launch link survives agar.io tidying the address', v.url === LAUNCH, v.url);

    /* 14. late on every visit (reloading does not help in this browser): never a reload loop */
    await reset();
    v = await visit(LAUNCH, 'late.tm', { settle: 800 }); l = await leftovers(v.t0);
    const n2 = await visit('https://agar.io/', 'late.tm', { settle: 800 }), l2 = await leftovers(n2.t0);
    rpt('late always', v, l); rpt('late always, next visit', n2, l2);
    check('late every time: Legend Mod is shown', v.shown > 0 && n2.shown > 0, fmt(v) + ' / ' + fmt(n2));
    check('late every time: one reload, none on the next visit (no loop)', v.counts.agarDoc === 2 && n2.counts.agarDoc === 1, v.counts.agarDoc + ' then ' + n2.counts.agarDoc);
    check('late every time: agar.io\'s timers and frames are cancelled behind Legend Mod', l2.ticks === 0 && l2.raf === 0 && boot(n2).conflict === 'late-start', fmtL(l2));
    check('late every time: the launch link survives agar.io tidying the address', v.url === LAUNCH, v.url);
    server.agarStrip = false;

    /* 15. a fast cached agar.io (served by its own service worker): still no competing agar.io */
    await reset();
    server.sw = true;
    v = await visit('https://agar.io/', 'off', { untilExpr: '!!navigator.serviceWorker.controller', maxMs: 6000, settle: 300 });
    const swOk = v.sw;
    if (swOk) {
      v = await visit('https://agar.io/', 'early.tm'); l = await leftovers(v.t0);
      rpt('agar.io from its service worker', v, l);
      check('agar.io served by its service worker: Legend Mod, nothing of agar.io runs', v.sw && v.shown > 0 && quiet(l), 'controlled ' + v.sw + '; ' + fmtL(l));
    } else console.log('skip agar.io service worker check: it did not register here (' + JSON.stringify(v.agar && v.agar.sw) + ')');
  });

  console.log(fail ? fail + ' userscript load checks FAILED' : 'all userscript load checks passed');
  wsServer.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL harness', e && e.stack); process.exit(1); });
