/* Legend Express userscript (LMexpress/LMexpress.user.js) in real Firefox, run the two ways Firefox
 * userscript managers run a script: in an add-on content script's sandbox (Greasemonkey 4, and other
 * managers in their content mode), where Firefox refuses document.open() on the page ("The operation is
 * insecure"), and in the page's own world (Violentmonkey's page mode). A temporary add-on (WebDriver BiDi)
 * runs the loader with a Greasemonkey 4 style GM.* API at document start on a stand-in agar.io served from
 * 127.0.0.1. Checks per world: agar.io/ shows the loading screen, then Legend Mod with init() once, and
 * agar.io's own script never runs; /normal leaves agar.io alone; /delta shows its notice; /captcha the
 * captcha helper. Skipped when Firefox or Node 22+ is not found.
 * node developers/tests/userscriptfirefox.js [repoDir] [--loader <file>] */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const args = process.argv.slice(2);
const li = args.indexOf('--loader');
const repo = path.resolve(args.filter((a, i) => a.indexOf('--') !== 0 && (li < 0 || i !== li + 1))[0] || path.join(__dirname, '..', '..'));
const loader = fs.readFileSync(li >= 0 ? path.resolve(args[li + 1]) : path.join(repo, 'LMexpress', 'LMexpress.user.js'), 'utf8');

function findFirefox() {
  if (process.env.FIREFOX_PATH) return process.env.FIREFOX_PATH;
  const c = [];
  for (const b of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)']]) if (b) c.push(path.join(b, 'Mozilla Firefox/firefox.exe'));
  c.push('/Applications/Firefox.app/Contents/MacOS/firefox', '/usr/bin/firefox', '/usr/lib/firefox/firefox');
  return c.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const firefox = findFirefox();
if (!firefox || typeof WebSocket !== 'function') { console.log('skipped: Firefox or Node 22+ not found'); process.exit(0); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (!c && info !== undefined ? '  [' + info + ']' : '')); if (!c) fail++; };

/* the stand-in agar.io (its script is slow to arrive, like agar.io's bundle) and Legend Mod's pages */
const counts = { doc: 0, play: 0, captcha: 0 };
const srv = http.createServer((q, s) => {
  const u = new URL(q.url, 'http://127.0.0.1');
  const send = (body, type, delay) => setTimeout(() => { s.writeHead(200, { 'Content-Type': type || 'text/html', 'Cache-Control': 'no-store' }); s.end(body); }, delay || 0);
  if (u.pathname === '/bundle.js') return send('window.__agarRan = 1; setInterval(function () { window.__agarTicks = (window.__agarTicks || 0) + 1; }, 16);', 'text/javascript', 300);
  if (u.pathname === '/play.html') {
    counts.play++;
    return send('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Legend Mod</title></head><body><div id="lm-ok">Legend</div><!-- ' + 'play.html '.repeat(150) +
      ' --><script src="http://127.0.0.1:' + srv.address().port + '/LMexpress/LMexpress.js"></script></body></html>', 'text/html', 600);
  }
  if (u.pathname === '/LMexpress/LMexpress.js') return send('function init(v) { window.__lmInit = v; window.__lmInits = (window.__lmInits || 0) + 1; }', 'text/javascript', 30);
  if (u.pathname === '/ogario/captcha.html') { counts.captcha++; return send('<!DOCTYPE html><html><body><div id="captcha-ok">captcha</div></body></html>', 'text/html', 50); }
  if (u.pathname === '/reset') return send('<!DOCTYPE html><html><body>reset</body></html>');
  if (u.pathname === '/favicon.ico') { s.writeHead(404); return s.end(); }
  counts.doc++;
  send('<!DOCTYPE html><html><head><title>Agar.io</title><script src="/bundle.js"></script></head><body><h1 id="agar-vanilla">AGARIO</h1>' + '<p>agar.io</p>'.repeat(500) + '</body></html>', 'text/html', 100);
});

/* what is on the page, read from the page's own world */
const STATE = 'JSON.stringify({ legend: !!document.getElementById("lm-ok"), loading: !!document.getElementById("lmx-loading"),' +
  ' agar: !!document.getElementById("agar-vanilla"), captcha: !!document.getElementById("captcha-ok"), notice: !!document.querySelector("a[href*=greasyfork]"),' +
  ' init: window.__lmInit || "", inits: window.__lmInits || 0, agarRan: !!window.__agarRan, owner: document.documentElement ? document.documentElement.getAttribute("data-lm-loader") : "",' +
  ' boot: JSON.parse(sessionStorage.getItem("lmx-boot") || "null"), url: localStorage.getItem("url") })';

async function inFirefox(world, port, fn) {
  /* a Greasemonkey 4 style API: GM.* with promises only; its requests go to the stand-in servers */
  const gm = 'var GM = { info: { scriptHandler: "Greasemonkey", version: "4.13", script: { version: "9.9.9" } },' +
    ' getValue: function (k, d) { return Promise.resolve(d); }, setValue: function () { return Promise.resolve(); }, deleteValue: function () { return Promise.resolve(); },' +
    ' xmlHttpRequest: function (o) { var x = new XMLHttpRequest(); x.open("GET", o.url.replace("https://www.legendmod.ml/", "http://127.0.0.1:' + port + '/"));' +
    ' x.onload = function () { o.onload({ status: x.status, finalUrl: o.url, responseText: x.responseText }); }; x.onerror = function (e) { o.onerror(e); }; x.send(); } };\n';
  const ext = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-usff-ext-'));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-usff-prof-'));
  fs.writeFileSync(path.join(ext, 'manifest.json'), JSON.stringify({ manifest_version: 2, name: 'userscript ' + world, version: '1.0',
    browser_specific_settings: { gecko: { id: 'lmx-usff-' + world + '@example.org' } },
    content_scripts: [{ matches: ['http://127.0.0.1/*'], js: ['run.js'], run_at: 'document_start' }] }));
  const skip = 'if (location.pathname !== "/reset") ';
  fs.writeFileSync(path.join(ext, 'run.js'), world === 'sandbox' ? skip + '{\n' + gm + loader + '\n}'
    : skip + '{ var s = document.createElement("script"); s.textContent = ' + JSON.stringify(gm + loader) + '; document.documentElement.appendChild(s); s.remove(); }');
  fs.writeFileSync(path.join(profile, 'user.js'), 'user_pref("browser.shell.checkDefaultBrowser", false);\nuser_pref("datareporting.policy.dataSubmissionEnabled", false);\n');
  const dport = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(firefox, ['--headless', '--no-remote', '--profile', profile, '--remote-debugging-port', String(dport), 'about:blank'], { stdio: 'ignore' });
  let ws, id = 0; const pending = new Map(); const errors = [];
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  try {
    let ok = false;
    for (let i = 0; i < 200 && !ok; i++) {
      try { ws = new WebSocket('ws://127.0.0.1:' + dport + '/session'); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; }); ok = true; } catch (e) { await sleep(300); }
    }
    if (!ok) throw new Error('firefox did not start');
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method === 'log.entryAdded' && m.params.level === 'error') errors.push(m.params.text);
    };
    const s = await send('session.new', { capabilities: {} });
    if (s.error) throw new Error('session ' + s.error + ' ' + s.message);
    await send('session.subscribe', { events: ['log.entryAdded'] });
    const inst = await send('webExtension.install', { extensionData: { type: 'path', path: ext } });
    if (inst.error) throw new Error('add-on install ' + inst.error + ' ' + inst.message);
    const ctx = (await send('browsingContext.getTree', {})).result.contexts[0].context;
    const state = async () => { const r = await send('script.evaluate', { expression: STATE, target: { context: ctx }, awaitPromise: false }); try { return JSON.parse(r.result.result.value); } catch (e) { return null; } };
    await send('browsingContext.navigate', { context: ctx, url: 'http://127.0.0.1:' + port + '/reset', wait: 'complete' });
    await send('script.evaluate', { expression: 'localStorage.clear(), sessionStorage.clear(), 1', target: { context: ctx }, awaitPromise: false });
    /* a visit: every state seen until done(state) or 15 s, then the last one */
    const visit = async (p, done) => {
      errors.length = 0;
      const before = Object.assign({}, counts), seen = [];
      await send('browsingContext.navigate', { context: ctx, url: 'http://127.0.0.1:' + port + p, wait: 'none' });
      const t0 = Date.now();
      let st = null;
      while (Date.now() - t0 < 15000) {
        await sleep(60);
        st = await state();
        if (!st) continue;
        seen.push(st);
        if (done(st)) break;
      }
      await sleep(400);
      st = await state() || st || {};
      const d = {}; for (const k in counts) d[k] = counts[k] - before[k];
      return Object.assign(st, { seen, counts: d, errors: errors.slice() });
    };
    return await fn(visit);
  } finally {
    try { await send('browser.close'); } catch (e) { }
    await sleep(1000);
    try { proc.kill(); } catch (e) { }
    try { ws && ws.close(); } catch (e) { }
    await sleep(500);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { }
    try { fs.rmSync(ext, { recursive: true, force: true }); } catch (e) { }
  }
}

const last = v => v.boot && v.boot.states.length ? v.boot.states[v.boot.states.length - 1][0] : '-';
const brief = v => JSON.stringify({ legend: v.legend, init: v.init, inits: v.inits, agarRan: v.agarRan, state: last(v), counts: v.counts, errors: v.errors.slice(0, 3) });

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const port = srv.address().port, origin = 'http://127.0.0.1:' + port;
  for (const world of ['sandbox', 'page']) {
    const name = world === 'sandbox' ? 'Firefox content-script sandbox (Greasemonkey 4)' : 'Firefox page world (Violentmonkey page mode)';
    try {
      await inFirefox(world, port, async (visit) => {
        let v = await visit('/?sip=1.2.3.4:1500#party', st => st.legend && st.inits > 0);
        check(name + ': agar.io/ shows Legend Mod, init() runs once, the loader reaches READY', v.legend && v.init === '9.9.9' && v.inits === 1 && last(v) === 'READY', brief(v));
        check(name + ': the loading screen first, agar.io never on screen, its script never runs',
          v.seen.some(x => x.loading && !x.legend) && !v.seen.some(x => x.agar) && !v.agarRan && v.counts.doc === 1, brief(v));
        check(name + ': no page error (no "operation is insecure")', v.errors.length === 0, v.errors.join(' | '));
        check(name + ': the owner is the userscript, the launch link is kept', /^userscript:/.test(v.owner || '') && v.url === origin + '/?sip=1.2.3.4:1500#party', v.owner + ' ' + v.url);
        v = await visit('/normal', st => st.agarRan);
        check(name + ': /normal leaves agar.io alone (one page download, no loading screen)', v.agar && v.agarRan && !v.seen.some(x => x.loading) && v.counts.doc === 1 && v.counts.play === 0, brief(v));
        v = await visit('/delta', st => st.notice);
        check(name + ': /delta shows the Delta notice', v.notice && !v.agarRan && v.counts.play === 0, brief(v));
        v = await visit('/captcha', st => st.captcha);
        check(name + ': /captcha shows the captcha helper page', v.captcha && !v.agarRan && v.counts.captcha === 1, brief(v));
      });
    } catch (e) { check(name + ': harness', false, e && e.message); }
  }
  srv.close();
  console.log(fail ? fail + ' Firefox userscript checks FAILED' : 'all Firefox userscript checks passed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL harness', e && e.stack); process.exit(1); });
setTimeout(() => { console.log('FAIL harness: timed out'); process.exit(1); }, 240000).unref();
