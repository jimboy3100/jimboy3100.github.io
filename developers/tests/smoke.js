// Smoke test: load play.html in headless Chrome with every request to
// jimboy3100.github.io / www.legendmod.ml served from the local repo.
// Usage: node smoke.js <repoDir> <outDir> [seconds] [url] [mobile]
// Needs Node 22+ (global fetch and WebSocket) and Chrome/Chromium.
// Chrome: env CHROME_PATH, otherwise the usual install locations are tried.
// If <outDir>/probe.js exists it is evaluated in the page after [seconds].
// A machine-readable summary is written to <outDir>/result.json.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
const out = process.argv[3];
const secs = Number(process.argv[4] || 25);
const startUrl = process.argv[5] || 'https://www.legendmod.ml/play.html';
const mobile = process.argv[6] === 'mobile';
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
const port = 9300 + Math.floor(Math.random() * 500);
fs.mkdirSync(out, { recursive: true });
const profile = path.join(out, 'profile');

const types = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json',
  '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };

const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
  '--no-first-run', '--no-default-browser-check', '--window-size=1600,900', '--autoplay-policy=no-user-gesture-required',
  ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []),
  'about:blank'], { stdio: 'ignore' });
proc.on('error', e => { console.log('chrome failed to start:', e.message); process.exit(2); });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let id = 0; const pending = new Map(); const errors = []; const logs = [];
let served = 0, missing = [], probeValue;

(async () => {
  let ver;
  for (let i = 0; i < 50; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); break; } catch (e) { await sleep(200); } }
  if (!ver) { console.log('chrome did not start'); proc.kill(); process.exit(2); }
  const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.onmessage = async ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
    if (m.method === 'Fetch.requestPaused') {
      const u = new URL(m.params.request.url);
      let rel = decodeURIComponent(u.pathname.replace(/^\//, ''));
      if (rel === '' ) rel = 'index.html';
      const file = path.join(repo, rel);
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
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'warning' && m.params.args[0] && String(m.params.args[0].value || '').indexOf('JQMIGRATE') === 0) {
      const fr = m.params.stackTrace && m.params.stackTrace.callFrames.find(c => c.url.indexOf('jquery-3.7.1') < 0);
      errors.push('MIGRATE ' + String(m.params.args[0].value).slice(0, 200) + (fr ? ' @' + fr.url.replace(/^https:\/\/[^/]+\//, '') + ':' + fr.lineNumber : ''));
    } else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'assert')) {
      const txt = m.params.args.map(a => a.value !== undefined ? String(a.value) : (a.description || a.type)).join(' ');
      const fr = m.params.stackTrace && m.params.stackTrace.callFrames[0];
      errors.push('CONSOLE.ERROR ' + txt.slice(0, 300) + (fr ? ' @' + fr.url.replace(/^https:\/\/[^/]+\//, '') + ':' + fr.lineNumber : ''));
    } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      logs.push('LOG ' + m.params.entry.source + ' ' + (m.params.entry.text || '').slice(0, 200) + ' ' + (m.params.entry.url || ''));
    }
  };
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*://jimboy3100.github.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }, { urlPattern: '*://legendmod.ml/*' }] });
  if (mobile) {
    await send('Emulation.setDeviceMetricsOverride', { width: 915, height: 412, deviceScaleFactor: 2.6, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'pointer', value: 'coarse' }, { name: 'any-pointer', value: 'coarse' }] });
  }
  await send('Page.navigate', { url: startUrl });
  await sleep(secs * 1000);
  // run optional probe expression
  const probeFile = path.join(out, 'probe.js');
  if (fs.existsSync(probeFile)) {
    const r = await send('Runtime.evaluate', { expression: fs.readFileSync(probeFile, 'utf8'), awaitPromise: true, returnByValue: true });
    probeValue = r && r.result && r.result.value !== undefined ? r.result.value : r;
    console.log('PROBE:', JSON.stringify(probeValue).slice(0, 4000));
    await sleep(1500);
  }
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) fs.writeFileSync(path.join(out, 'shot.png'), Buffer.from(shot.data, 'base64'));
  console.log('served from repo:', served, ' missing on disk:', [...new Set(missing)].slice(0, 15).join(', '));
  console.log('errors:', errors.length);
  [...new Set(errors)].forEach(e => console.log('  ' + e));
  console.log('log errors:', logs.length);
  [...new Set(logs)].slice(0, 25).forEach(e => console.log('  ' + e));
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ served, missing: [...new Set(missing)], errors: [...new Set(errors)], errorCount: errors.length,
    logErrors: [...new Set(logs)], logErrorCount: logs.length, probe: probeValue === undefined ? null : probeValue }, null, 2));
  ws.close(); proc.kill(); process.exit(0);
})().catch(e => { console.log('harness error', e); proc.kill(); process.exit(3); });
