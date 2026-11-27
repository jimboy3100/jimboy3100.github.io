/* Legend Express loaders on agar.io in headless Chrome: the userscript (LMexpress/LMexpress.user.js)
 * and the extension (LMexpress/extension/content.js) run at document start in a windows-1252
 * agar.io page, stop it and write the Legend page over it. The Legend page must really be written
 * (window.stop() at document start made the browser ignore that write: a white page) and agar.io's
 * own scripts must not run. Skipped when Chrome is not found.
 * node developers/tests/agarloader.js [repoDir] */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [];
  for (const b of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]) if (b) c.push(path.join(b, 'Google/Chrome/Application/chrome.exe'));
  c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
  return c.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome || typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('skipped: Chrome or Node 22+ not found'); process.exit(0); }

const read = rel => fs.readFileSync(path.join(repo, rel), 'utf8');
/* the loaders' own APIs, done with a plain XMLHttpRequest */
const loaders = {
  userscript: 'var GM_info = { script: { version: "9.9.9" } }; function GM_registerMenuCommand() { }' +
    'function GM_xmlhttpRequest(o) { var x = new XMLHttpRequest(); x.open(o.method, o.url);' +
    ' x.onload = function () { o.onload({ status: x.status, finalUrl: x.responseURL, responseText: x.responseText }); };' +
    ' x.onerror = function (e) { o.onerror(e); }; x.send(); }\n' + read('LMexpress/LMexpress.user.js'),
  extension: 'var chrome = { runtime: { getManifest: function () { return { version: "9.9.9" }; }, lastError: null,' +
    ' sendMessage: function (m, cb) { var x = new XMLHttpRequest(); x.open("GET", m.url); x.onload = function () { cb({ data: x.responseText }); }; x.send(); } },' +
    ' storage: { local: { get: function (d, cb) { setTimeout(function () { cb({ enabled: true }); }, 30); }, set: function () { } } } };\n' +
    read('LMexpress/extension/texts.js') + '\n' + read('LMexpress/extension/content.js')
};
/* the extension with writer.js (it writes the pages from agar.io's own world, as Firefox needs) */
loaders['extension+writer'] = read('LMexpress/extension/writer.js') + '\n' + loaders.extension;
/* agar.io's page: its scripts mark window.__vanilla; long enough that it is still being parsed */
const agarPage = '<!DOCTYPE html><html><head><meta charset="windows-1252"><title>Agar.io</title></head><body>' +
  '<script>window.__vanilla = 1;</script>' + '<p>agar.io</p>'.repeat(20000) + '<script>window.__vanilla = 2;</script></body></html>';
const legendPage = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="lm-ok">Legend</div>' +
  '<script>window.__lmScript = 1;</script><script>function init(v) { window.__lmInit = v; }</script></body></html>';

const sleep = ms => new Promise(r => setTimeout(r, ms));
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

async function runLoader(name) {
  const port = 9800 + Math.floor(Math.random() * 150);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-agarloader-'));
  const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
  try {
    let ok = false;
    for (let i = 0; i < 300 && !ok; i++) { try { await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); ok = true; } catch (e) { await sleep(200); } }
    if (!ok) throw new Error('chrome did not start');
    const page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
      if (m.method !== 'Fetch.requestPaused') return;
      const u = new URL(m.params.request.url);
      const body = u.hostname === 'agar.io' && m.params.resourceType === 'Document' ? agarPage
        : u.hostname === 'www.legendmod.ml' && u.pathname === '/play.html' ? legendPage : null;
      send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: body == null ? 404 : 200,
        responseHeaders: [{ name: 'Content-Type', value: 'text/html' }, { name: 'Access-Control-Allow-Origin', value: '*' }],
        body: Buffer.from(body || '', 'latin1').toString('base64') });
    };
    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] });
    /* like a document-start userscript / content script: run as soon as agar.io's <html> exists, while its page is parsed */
    await send('Page.addScriptToEvaluateOnNewDocument', { source: 'if (location.hostname === "agar.io") { var __o = new MutationObserver(function () {' +
      ' if (!document.documentElement) return; __o.disconnect();' +
      ' (0, eval)(' + JSON.stringify(loaders[name]) + '); }); __o.observe(document, { childList: true }); }' });
    await send('Page.navigate', { url: 'https://agar.io/' });
    await sleep(4000);
    const r = await send('Runtime.evaluate', { returnByValue: true, expression:
      'JSON.stringify({ legend: !!document.getElementById("lm-ok"), script: window.__lmScript || 0, init: window.__lmInit || "", vanilla: window.__vanilla || 0 })' });
    ws.close();
    return JSON.parse(r.result.value);
  } finally {
    proc.kill();
    await sleep(300);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { }
  }
}

(async () => {
  for (const name of ['userscript', 'extension', 'extension+writer']) {
    const r = await runLoader(name);
    check(name + ': the Legend page is written over agar.io (no white page)', r.legend);
    check(name + ': its scripts run and get the init call', r.script === 1 && r.init === '9.9.9');
    check(name + ': agar.io\'s own scripts do not run', r.vanilla === 0);
  }
  console.log(fail ? fail + ' agar.io loader checks FAILED' : 'all agar.io loader checks passed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL harness', e && e.message); process.exit(1); });
