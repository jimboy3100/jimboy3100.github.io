/* Legend Express extension (LMexpress/extension) loaded as a real extension into headless Chrome
 * (CDP Extensions.loadUnpacked), with agar.io and www.legendmod.ml answered by this test:
 * - agar.io/ is sent to agar.io/legendmod/ by rules_legend.json, so agar.io's own page (its game
 *   scripts, WASM and ads) is never downloaded; the address bar gets agar.io/?query#hash back
 * - the Legend page is written over it with init("<version>", "extension"), and the extension
 *   names itself owner (sessionStorage lm-loader-owner, html[data-lm-loader])
 * - a userscript that named itself owner of the page first: the extension leaves the page alone
 * - other paths (/hslo) are left alone; with the switch off agar.io/ is agar.io's own page again
 * Skipped when Chrome (or a Chrome that can load an unpacked extension over CDP) is not found.
 * node developers/tests/extensionreal.js */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const repo = path.join(__dirname, '..', '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [];
  for (const b of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]) if (b) c.push(path.join(b, 'Google/Chrome/Application/chrome.exe'));
  c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
  return c.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome) { console.log('skipped: Chrome not found'); process.exit(0); }

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const version = JSON.parse(fs.readFileSync(path.join(repo, 'LMexpress', 'extension', 'manifest.json'), 'utf8')).version;

/* agar.io's front page: its scripts mark window.__vanilla (they must never be requested) */
const agarFront = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Agar.io</title>' +
  '<script src="https://agar.io/bundle_test.js"></script></head><body><script>window.__vanilla = 1;</script></body></html>';
/* agar.io's answer for every other path: its 404 page, without a charset */
const agar404 = '<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center></body></html>';
const legendPage = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>LM test</title></head><body><div id="lm-ok">Legend</div>' +
  '<script>function init(v, l) { window.__lmInit = v + "/" + (l || ""); }</script></body></html>';

/* the protocol of the userscript: check first, then name itself owner */
const FAKE_USERSCRIPT = '(function () { if (location.hostname !== "agar.io") return; var other = false;' +
  ' [function () { return sessionStorage.getItem("lm-loader-owner"); }, function () { return document.documentElement.getAttribute("data-lm-loader"); }].forEach(function (f) {' +
  ' try { var m = /^(extension|userscript):(.+)$/.exec(f() || ""); if (m && m[1] !== "userscript" && Number(m[2]) === performance.timeOrigin) other = true; } catch (e) { } });' +
  ' window.__us = other ? "skipped" : "ran"; if (!other) try { sessionStorage.setItem("lm-loader-owner", "userscript:" + performance.timeOrigin); } catch (e) { } })();';

const STATE = 'JSON.stringify({ href: location.href, charset: document.characterSet, title: document.title,' +
  ' legend: !!document.getElementById("lm-ok"), text: (document.getElementById("lm-ok") || {}).textContent || "", init: window.__lmInit || "",' +
  ' vanilla: window.__vanilla || 0, us: window.__us || "", attr: document.documentElement.getAttribute("data-lm-loader"),' +
  ' owner: sessionStorage.getItem("lm-loader-owner"), origin: performance.timeOrigin, url: localStorage.getItem("url") })';

(async () => {
  const extCopy = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-ext-'));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-extreal-'));
  /* a copy: Chrome writes _metadata/ into an unpacked extension folder */
  fs.cpSync(path.join(repo, 'LMexpress', 'extension'), extCopy, { recursive: true });
  const proc = spawn(chrome, ['--headless=new', '--remote-debugging-pipe', '--enable-unsafe-extension-debugging',
    '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'],
    { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const pipeOut = proc.stdio[3], pipeIn = proc.stdio[4];
  let id = 0, buf = '';
  const pending = new Map(), requested = [];
  const send = (method, params = {}, sessionId) => new Promise(res => {
    const i = ++id; pending.set(i, res); pipeOut.write(JSON.stringify({ id: i, method, params, sessionId }) + '\0');
  });
  pipeIn.on('data', d => {
    buf += d.toString('utf8');
    let i;
    while ((i = buf.indexOf('\0')) >= 0) {
      const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); continue; }
      if (m.method === 'Target.attachedToTarget') {
        /* the extension's service worker downloads the Legend page: answer it there too */
        const s = m.params.sessionId;
        send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] }, s)
          .then(() => send('Runtime.runIfWaitingForDebugger', {}, s));
      }
      if (m.method !== 'Fetch.requestPaused') continue;
      const u = new URL(m.params.request.url);
      requested.push(m.params.resourceType + ' ' + u.href);
      const body = u.hostname === 'agar.io' ? (u.pathname === '/' && m.params.resourceType === 'Document' ? agarFront : u.pathname === '/bundle_test.js' ? 'window.__vanilla = 2;' : agar404)
        : u.pathname === '/play.html' ? legendPage : '';
      const status = u.hostname === 'agar.io' && u.pathname !== '/' && u.pathname !== '/bundle_test.js' ? 404 : 200;
      const type = u.pathname.endsWith('.js') ? 'application/javascript' : u.hostname === 'agar.io' && status === 404 ? 'text/html' : 'text/html; charset=utf-8';
      send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: status,
        responseHeaders: [{ name: 'Content-Type', value: type }, { name: 'Access-Control-Allow-Origin', value: '*' }],
        body: Buffer.from(body, 'utf8').toString('base64') }, m.sessionId);
    }
  });
  async function tab(url, preload) {
    const t = await send('Target.createTarget', { url: 'about:blank' });
    const s = (await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true })).result.sessionId;
    await send('Page.enable', {}, s);
    await send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] }, s);
    if (preload) await send('Page.addScriptToEvaluateOnNewDocument', { source: preload }, s);
    requested.length = 0;
    await send('Page.navigate', { url }, s);
    return s;
  }
  /* the page's state after wait ms; with until, as soon as until(state) holds (at most 4 x wait: a busy machine) */
  async function state(s, wait, until) {
    let v = null;
    for (let t = 0; t < (until ? 4 * wait : wait) + 1; t += 250) {
      await sleep(250);
      if (!until && t + 250 < wait) continue;
      const r = await send('Runtime.evaluate', { expression: STATE, returnByValue: true }, s);
      try { v = JSON.parse(r.result.result.value); } catch (e) { v = null; continue; }
      if (!until || until(v)) break;
    }
    if (process.env.DBG) console.log(requested.join(' | ') + '\n' + JSON.stringify(v));
    return v || {};
  }
  const legendInit = (x) => x.legend && !!x.init;
  try {
    const ld = await send('Extensions.loadUnpacked', { path: extCopy });
    if (!ld.result) { console.log('skipped: this Chrome cannot load an unpacked extension over CDP (' + (ld.error && ld.error.message) + ')'); return; }
    const extId = ld.result.id;
    /* the service worker of the extension, for its download of the Legend page */
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true,
      filter: [{ type: 'service_worker', exclude: false }, { exclude: true }] });
    await sleep(1500);
    let s = await tab('https://agar.io/?sip=1.2.3.4:1500#ffa');
    let r = await state(s, 4000, legendInit);
    const docs = requested.filter(x => x.startsWith('Document '));
    check('agar.io/ is sent to agar.io/legendmod/: agar.io\'s front page is never requested', docs.join() === 'Document https://agar.io/legendmod/?sip=1.2.3.4:1500' && !requested.some(x => /bundle_test/.test(x)));
    check('the address bar shows agar.io/ with the launch link again, and it is saved for Legend Mod', r.href === 'https://agar.io/?sip=1.2.3.4:1500#ffa' && r.url === 'https://agar.io/?sip=1.2.3.4:1500#ffa');
    check('the Legend page is written, with init("' + version + '", "extension")', r.legend && r.init === version + '/extension' && r.vanilla === 0);
    /* (the UTF-8 header of rules_legend.json is not applied to answers given over CDP: checked on the real agar.io) */
    check('the extension is the owner of this page load', r.owner === 'extension:' + r.origin && r.attr === r.owner);

    s = await tab('https://agar.io/', FAKE_USERSCRIPT);
    r = await state(s, 3000);
    check('a userscript that took the page first: the extension leaves it alone', r.us === 'ran' && r.owner === 'userscript:' + r.origin && !r.legend && r.attr === null);

    s = await tab('https://agar.io/', 'window.__us = "pending"; setTimeout(function () {' + FAKE_USERSCRIPT + '}, 300);');
    r = await state(s, 3000, (x) => legendInit(x) && x.us === 'skipped');
    check('a userscript that comes after the extension does nothing', r.us === 'skipped' && r.legend && r.owner === 'extension:' + r.origin);

    s = await tab('https://agar.io/hslo');
    r = await state(s, 2000);
    check('agar.io/hslo is left alone (no owner, not redirected, no Legend page)', r.href === 'https://agar.io/hslo' && !r.legend && r.attr === null && r.title === '404 Not Found');

    const p = await tab('chrome-extension://' + extId + '/popup.html');
    await sleep(1000);
    await send('Runtime.evaluate', { expression: 'new Promise(r => chrome.storage.local.set({ enabled: false }, () => r(1)))', awaitPromise: true }, p);
    await sleep(1000);
    s = await tab('https://agar.io/');
    r = await state(s, 4000);
    check('switch off: agar.io/ is agar.io\'s own page (not redirected, not taken over)', r.href === 'https://agar.io/' && r.title === 'Agar.io' && r.vanilla === 1 && requested.includes('Script https://agar.io/bundle_test.js') && !r.legend && r.attr === null);
    await send('Runtime.evaluate', { expression: 'new Promise(r => chrome.storage.local.set({ enabled: true }, () => r(1)))', awaitPromise: true }, p);
    await sleep(1000);
    await send('Page.navigate', { url: 'https://agar.io/' }, s);
    r = await state(s, 5000, legendInit);
    check('switched on again: agar.io/ is taken over again (one reload for the out-of-date mirror)', r.legend && r.init === version + '/extension' && r.href === 'https://agar.io/');
  } finally {
    try { await send('Browser.close'); } catch (e) { }
    await sleep(500);
    try { proc.kill(); } catch (e) { }
    await sleep(300);
    for (const d of [profile, extCopy]) try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) { }
  }
  console.log(fail ? fail + ' real extension checks FAILED' : 'all real extension checks passed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL harness', e && e.stack); process.exit(1); });
setTimeout(() => { console.log('FAIL timeout'); process.exit(1); }, 120000).unref();
