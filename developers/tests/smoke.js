// Smoke test: load play.html in headless Chrome with every request to
// jimboy3100.github.io / www.legendmod.ml served from the local repo.
// Usage: node smoke.js <repoDir> <outDir> [seconds] [url] [mobile]
// Env: SMOKE_LANG (browser language, default en-US), SMOKE_STORAGE (JSON of localStorage values set
// before the page runs), SMOKE_FIRSTRUN=1 (show the one-time language window; hidden otherwise).
// SMOKE_VIEWPORT=WxH (mobile only): another phone screen than the default 915x412, e.g. 640x360 or 412x915.
// SMOKE_SWAP='rel/path.js=C:/other/file.js;...': serve those repo files from other files (e.g. the previous
// version, to see a new probe fail there) without touching the checkout.
// SMOKE_PROBE_LIMIT=N: the probe may take N seconds; then result.json keeps the results so far
// (window.__lmProbeRes), timedOut names the probe that was running (console.debug('[lm-probe]', name)) and the exit code is 4.
// Needs Node 22+ (global fetch and WebSocket) and Chrome/Chromium.
// Chrome: env CHROME_PATH, otherwise the usual install locations are tried.
// If <outDir>/probe.js exists it is evaluated in the page after [seconds]. A probe can send real mouse
// clicks / touch taps and key presses with window.__lmInput (see Runtime.bindingCalled below).
// A machine-readable summary is written to <outDir>/result.json.
// On every exit (also a timeout, an error or a failed start) Chrome is ended with all its child processes
// and <outDir>/profile is removed; SMOKE_KEEP_PROFILE=1 keeps the profile (run.js --keep).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const testChrome = require('./lib/testchrome');

const repo = process.argv[2];
const out = process.argv[3];
const secs = Number(process.argv[4] || 25);
const startUrl = process.argv[5] || 'https://www.legendmod.ml/play.html';
const mobile = process.argv[6] === 'mobile';
const swaps = {};
String(process.env.SMOKE_SWAP || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) swaps[p.slice(0, i).trim().replace(/^\//, '')] = p.slice(i + 1).trim(); });
if (!repo || !out) { console.log('usage: node smoke.js <repoDir> <outDir> [seconds] [url] [mobile]'); process.exit(1); }
if (typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('Node 22+ is required (global fetch and WebSocket)'); process.exit(1); }
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
  return cands.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome) { console.log('chrome not found: set CHROME_PATH'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const profile = path.join(out, 'profile');
/* --remote-debugging-port=0: Chrome takes a free port and writes it to DevToolsActivePort in this
 * run's own profile, so runs in parallel never talk to each other's Chrome (a random fixed port
 * could belong to another run's browser, whose pages load another checkout) */
const portFile = path.join(profile, 'DevToolsActivePort');
try { fs.rmSync(portFile, { force: true }); } catch (e) { console.log('chrome did not start: the profile is in use by another Chrome (' + profile + ')'); process.exit(2); }

const types = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json',
  '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };

const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + profile,
  '--no-first-run', '--no-default-browser-check', '--window-size=1600,900', '--autoplay-policy=no-user-gesture-required',
  /* the browser language: English unless SMOKE_LANG says otherwise (the mod follows it when no language is chosen) */
  '--lang=' + (process.env.SMOKE_LANG || 'en-US'),
  ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []),
  'about:blank'], { stdio: 'ignore' });
proc.on('error', e => { console.log('chrome failed to start:', e.message); finish(2); });
let procExit = null;
proc.on('exit', c => { procExit = c; });
/* every way out ends this run's Chrome: proc.kill() ended only the browser process, and on Windows its
 * GPU, network, renderer and crashpad processes kept running and kept the profile (and its folder) */
let ws = null, finishing = false;
function finish(code) {
  if (finishing) return;
  finishing = true;
  try { if (ws) ws.close(); } catch (e) { }
  testChrome.cleanupProfile(profile, { pid: procExit === null ? proc.pid : 0, keep: process.env.SMOKE_KEEP_PROFILE === '1' });
  process.exit(code);
}
/* Ctrl+C, or the console closed */
['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'].forEach(s => { try { process.on(s, () => { console.log('smoke run stopped (' + s + ')'); finish(130); }); } catch (e) { } });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let id = 0; const pending = new Map(); const errors = []; const logs = [];
let served = 0, missing = [], probeValue;
/* console.debug('[lm-probe]', name) from the probe (run.js) starts the probe of that name ('' after
 * the last one): its time goes to probeTimes and <outDir>/progress.json names the running one */
let probeStart = 0, probeNow = { name: '', at: 0 }, timedOut = null;
const probeTimes = {};
function probeMark(name) {
  const now = Date.now();
  if (probeNow.name) probeTimes[probeNow.name] = Math.round((now - probeNow.at) / 100) / 10;
  probeNow = { name: name, at: now };
  try { fs.writeFileSync(path.join(out, 'progress.json'), JSON.stringify({ probe: name, at: now, start: probeStart, times: probeTimes })); } catch (e) { }
}

(async () => {
  /* DevToolsActivePort: line 1 the port, line 2 the browser's own /devtools/browser/<id> path */
  let port = 0, browserPath = '', ver;
  for (let i = 0; i < 150 && !port && procExit === null; i++) {
    try { const l = fs.readFileSync(portFile, 'utf8').split(/\r?\n/); if (Number(l[0]) > 0 && l[1]) { port = Number(l[0]); browserPath = l[1].trim(); } } catch (e) { }
    if (!port) await sleep(200);
  }
  if (!port) { console.log('chrome did not start' + (procExit !== null ? ' (it exited, code ' + procExit + ')' : ': no DevToolsActivePort in ' + profile)); finish(2); }
  for (let i = 0; i < 50 && procExit === null; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); break; } catch (e) { await sleep(200); } }
  if (!ver) { console.log('chrome did not start: no answer on DevTools port ' + port); finish(2); }
  /* the browser on that port must be the one this run started, not another run's */
  if (!String(ver.webSocketDebuggerUrl || '').endsWith(browserPath)) { console.log('chrome did not start: DevTools port ' + port + ' belongs to another Chrome (' + ver.webSocketDebuggerUrl + ', expected ' + browserPath + ')'); finish(2); }
  const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  const page = targets.find(t => t.type === 'page');
  if (!page) { console.log('chrome did not start: no page target on DevTools port ' + port); finish(2); }
  ws = new WebSocket(page.webSocketDebuggerUrl);
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.onmessage = async ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
    if (m.method === 'Fetch.requestPaused') {
      const u = new URL(m.params.request.url);
      let rel = decodeURIComponent(u.pathname.replace(/^\//, ''));
      if (rel === '' ) rel = 'index.html';
      const swap = swaps[rel];
      const file = swap || path.join(repo, rel);
      if ((u.hostname === 'jimboy3100.github.io' || u.hostname === 'www.legendmod.ml' || u.hostname === 'legendmod.ml') && fs.existsSync(file) && fs.statSync(file).isFile()) {
        served++;
        let buf = fs.readFileSync(file);
        if (process.env.JQMIGRATE && rel.endsWith('lib/jquery-3.7.1.min.js')) buf = Buffer.concat([buf, Buffer.from('\n'), fs.readFileSync(process.env.JQMIGRATE)]);
        const body = buf.toString('base64');
        const ct = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
        send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200,
          responseHeaders: [{ name: 'Content-Type', value: ct }, { name: 'Access-Control-Allow-Origin', value: '*' }, { name: 'Cache-Control', value: 'no-store' }], body });
      } else {
        if (u.hostname === 'jimboy3100.github.io' || u.hostname === 'www.legendmod.ml') missing.push(u.pathname);
        send('Fetch.continueRequest', { requestId: m.params.requestId });
      }
    } else if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      errors.push('EXC ' + ((d.exception && d.exception.description) || d.text).split('\n').slice(0, 3).join(' | ') + ' @' + (d.url || '').replace(/^https:\/\/[^/]+\//, '') + ':' + d.lineNumber);
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'debug' && m.params.args[0] && m.params.args[0].value === '[lm-probe]') {
      probeMark(String((m.params.args[1] && m.params.args[1].value) || ''));
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'warning' && m.params.args[0] && String(m.params.args[0].value || '').indexOf('JQMIGRATE') === 0) {
      const fr = m.params.stackTrace && m.params.stackTrace.callFrames.find(c => c.url.indexOf('jquery-3.7.1') < 0);
      errors.push('MIGRATE ' + String(m.params.args[0].value).slice(0, 200) + (fr ? ' @' + fr.url.replace(/^https:\/\/[^/]+\//, '') + ':' + fr.lineNumber : ''));
    } else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'assert')) {
      const txt = m.params.args.map(a => a.value !== undefined ? String(a.value) : (a.description || a.type)).join(' ');
      const fr = m.params.stackTrace && m.params.stackTrace.callFrames[0];
      errors.push('CONSOLE.ERROR ' + txt.slice(0, 300) + (fr ? ' @' + fr.url.replace(/^https:\/\/[^/]+\//, '') + ':' + fr.lineNumber : ''));
    } else if (m.method === 'Runtime.bindingCalled' && m.params.name === '__lmInput') {
      /* a probe asks for a real click or tap (trusted input, like a player's): window.__lmInput(JSON
       * { id, type: 'click' | 'tap', x, y }) in viewport pixels, or a real key press on the focused
       * element: { id, type: 'key', key, code, keyCode, shift }; window.__lmInputDone(id) is called after.
       * A key with text: '3' types it. Held input: type 'keydown' / 'keyup' (one half of a key press; ctrl / alt / shift modifiers, also on mouse buttons),
       * 'move' { x, y }, 'mousedown' / 'mouseup' { x, y, button: 'left' | 'middle' | 'right' | 'back' | 'forward' } */
      let q = null;
      try { q = JSON.parse(m.params.payload); } catch (e) { }
      if (!q) return;
      const x = Number(q.x) || 0, y = Number(q.y) || 0;
      const BTN = { left: 1, right: 2, middle: 4, back: 8, forward: 16 };
      const button = BTN[q.button] ? q.button : 'left';
      /* modifiers held with the input (a mouse button with Shift: Shift + left click) */
      const mods = (q.alt ? 1 : 0) | (q.ctrl ? 2 : 0) | (q.shift ? 8 : 0);
      if (q.type === 'key' || q.type === 'keydown' || q.type === 'keyup') {
        const k = { key: String(q.key || ''), code: String(q.code || q.key || ''), windowsVirtualKeyCode: Number(q.keyCode) || 0, nativeVirtualKeyCode: Number(q.keyCode) || 0, modifiers: mods };
        /* text: the key also types it into the focused field (a rawKeyDown types nothing) */
        if (q.type !== 'keyup') await send('Input.dispatchKeyEvent', Object.assign(q.text ? { type: 'keyDown', text: String(q.text), unmodifiedText: String(q.text) } : { type: 'rawKeyDown' }, k));
        if (q.type !== 'keydown') await send('Input.dispatchKeyEvent', Object.assign({ type: 'keyUp' }, k));
      } else if (q.type === 'move') {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
      } else if (q.type === 'mousedown') {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button, buttons: BTN[button], clickCount: 1, modifiers: mods });
      } else if (q.type === 'mouseup') {
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button, buttons: 0, clickCount: 1, modifiers: mods });
      } else if (q.type === 'tap') {
        await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 });
      }
      send('Runtime.evaluate', { expression: 'window.__lmInputDone && window.__lmInputDone(' + JSON.stringify(String(q.id)) + ')' });
    } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      logs.push('LOG ' + m.params.entry.source + ' ' + (m.params.entry.text || '').slice(0, 200) + ' ' + (m.params.entry.url || ''));
    }
  };
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  await send('Runtime.addBinding', { name: '__lmInput' });
  await send('Emulation.setUserAgentOverride', { userAgent: ver['User-Agent'] || '', acceptLanguage: process.env.SMOKE_LANG || 'en-US' });
  await send('Emulation.setLocaleOverride', { locale: process.env.SMOKE_LANG || 'en-US' });
  /* SMOKE_STORAGE='{"key":"value"}': localStorage set before the page's scripts run (only where it is empty) */
  if (process.env.SMOKE_STORAGE) await send('Page.addScriptToEvaluateOnNewDocument', { source: 'try { var o = ' + process.env.SMOKE_STORAGE + '; for (var k in o) if (localStorage.getItem(k) == null) localStorage.setItem(k, o[k]); } catch (e) { }' });
  /* like --no-first-run: the one-time language window stays away unless SMOKE_FIRSTRUN asks for it
   * (developers/tests/i18n-firstrun.js); the probes test it on purpose */
  if (!process.env.SMOKE_FIRSTRUN) await send('Page.addScriptToEvaluateOnNewDocument', { source: "try { if (!localStorage.getItem('lmLangAsked')) localStorage.setItem('lmLangAsked', '1'); } catch (e) { }" });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*://jimboy3100.github.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }, { urlPattern: '*://legendmod.ml/*' }] });
  if (mobile) {
    const vp = /^(\d{3,4})x(\d{3,4})$/.exec(process.env.SMOKE_VIEWPORT || '');
    await send('Emulation.setDeviceMetricsOverride', { width: vp ? +vp[1] : 915, height: vp ? +vp[2] : 412, deviceScaleFactor: 2.6, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'pointer', value: 'coarse' }, { name: 'any-pointer', value: 'coarse' }] });
  }
  await send('Page.navigate', { url: startUrl });
  await sleep(secs * 1000);
  // run optional probe expression
  const probeFile = path.join(out, 'probe.js');
  if (fs.existsSync(probeFile)) {
    probeStart = Date.now();
    /* SMOKE_PROBE_LIMIT (seconds, 0 = none): the probes stop there; the results so far
     * (window.__lmProbeRes, run.js) are kept and the probe that was running is named */
    const lim = Number(process.env.SMOKE_PROBE_LIMIT) || 0;
    const ev = send('Runtime.evaluate', { expression: fs.readFileSync(probeFile, 'utf8'), awaitPromise: true, returnByValue: true });
    const r = await (lim > 0 ? Promise.race([ev, sleep(lim * 1000).then(() => 'timeout')]) : ev);
    if (r === 'timeout') {
      const now = probeNow;
      timedOut = { probe: now.name, probeSecs: now.name ? Math.round((Date.now() - now.at) / 1000) : 0, secs: Math.round((Date.now() - probeStart) / 1000) };
      console.log('PROBE TIMEOUT after ' + timedOut.secs + ' s' + (now.name ? ', in ' + now.name + ' (for ' + timedOut.probeSecs + ' s)' : ''));
      const pr = await Promise.race([send('Runtime.evaluate', { expression: 'JSON.stringify(window.__lmProbeRes || null)', returnByValue: true }), sleep(10000)]);
      probeValue = pr && pr.result && typeof pr.result.value === 'string' && pr.result.value !== 'null' ? pr.result.value : null;
    } else {
      probeValue = r && r.result && r.result.value !== undefined ? r.result.value : r;
      console.log('PROBE:', JSON.stringify(probeValue).slice(0, 4000));
      await sleep(1500);
    }
  }
  const shot = await Promise.race([send('Page.captureScreenshot', { format: 'png' }), sleep(15000)]);
  if (shot && shot.data) fs.writeFileSync(path.join(out, 'shot.png'), Buffer.from(shot.data, 'base64'));
  console.log('served from repo:', served, ' missing on disk:', [...new Set(missing)].slice(0, 15).join(', '));
  console.log('errors:', errors.length);
  [...new Set(errors)].forEach(e => console.log('  ' + e));
  console.log('log errors:', logs.length);
  [...new Set(logs)].slice(0, 25).forEach(e => console.log('  ' + e));
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ served, missing: [...new Set(missing)], errors: [...new Set(errors)], errorCount: errors.length,
    logErrors: [...new Set(logs)], logErrorCount: logs.length, probe: probeValue === undefined ? null : probeValue, probeTimes, timedOut }, null, 2));
  finish(timedOut ? 4 : 0);
})().catch(e => { console.log('harness error', e); finish(3); });
