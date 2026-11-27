/* The launch link (?sip= ?pass= ?replay= party) of each agar.io tab reaches Legend Mod in that tab, also
 * when two tabs load at the same time (a restored session, links opened together). The loaders keep the
 * link in localStorage "url", which all agar.io tabs share, so a tab could start with the other tab's
 * server or party; since 1.9 they also keep it per tab (sessionStorage "lm-launch-url" with the page
 * load's timeOrigin), and LMexpress.js (_lmLaunchLink) takes that one when it belongs to this page load.
 * Headless Chrome with the real userscript (in a world of its own, like Tampermonkey) and the real
 * unpacked extension; the Legend page runs the real _lmLaunchLink from LMexpress.js.
 * Skipped when Chrome or Node 22+ is not found; the extension part when this Chrome cannot load an
 * unpacked extension over CDP.
 * node developers/tests/launchlink.js [repoDir] [--ref <commit>]  (--ref: the files of that commit) */
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const args = process.argv.slice(2);
const ri = args.indexOf('--ref');
const ref = ri >= 0 ? args[ri + 1] : null;
const repo = path.resolve(args.filter((a, i) => a.indexOf('--') !== 0 && (ri < 0 || i !== ri + 1))[0] || path.join(__dirname, '..', '..'));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [];
  for (const b of [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]) if (b) c.push(path.join(b, 'Google/Chrome/Application/chrome.exe'));
  c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser');
  return c.find(f => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome || typeof fetch !== 'function') { console.log('skipped: Chrome or Node 22+ not found'); process.exit(0); }

const read = (rel) => ref ? execFileSync('git', ['-C', repo, 'show', ref + ':' + rel], { encoding: 'utf8', maxBuffer: 64 << 20 }) : fs.readFileSync(path.join(repo, rel), 'utf8');
const userscript = read('LMexpress/LMexpress.user.js');
const lmxSrc = read('LMexpress/LMexpress.js');
/* the real function; a version without it read localStorage "url" only */
const fnMatch = /function _lmLaunchLink\(\) \{[\s\S]*?\r?\n\}/.exec(lmxSrc);
const launchFn = fnMatch ? fnMatch[0] : 'function _lmLaunchLink() { return localStorage.getItem("url"); }';
const extDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-launch-ext-'));
for (const f of ['manifest.json', 'background.js', 'content.js', 'writer.js', 'texts.js', 'rules_legend.json', 'rules_sigmally.json', 'popup.html', 'popup.js']) {
  try { fs.writeFileSync(path.join(extDir, f), read('LMexpress/extension/' + f)); } catch (e) { }
}
fs.cpSync(path.join(repo, 'LMexpress', 'extension', '_locales'), path.join(extDir, '_locales'), { recursive: true });
for (const f of ['icon16.png', 'icon48.png', 'icon128.png']) fs.copyFileSync(path.join(repo, 'LMexpress', 'extension', f), path.join(extDir, f));

const sleep = ms => new Promise(r => setTimeout(r, ms));
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (!c && info !== undefined ? '  [' + info + ']' : '')); if (!c) fail++; };

const tmApi = 'var GM_info = { scriptHandler: "Tampermonkey", version: "5.3", script: { version: "1.9" } }; function GM_registerMenuCommand() { }' +
  'function GM_getValue(k, d) { return d; } function GM_setValue() { } function GM_deleteValue() { }' +
  'function GM_xmlhttpRequest(o) { var x = new XMLHttpRequest(); x.open(o.method, o.url); x.onload = function () { o.onload({ status: x.status, finalUrl: x.responseURL, responseText: x.responseText }); }; x.onerror = function (e) { o.onerror(e); }; x.send(); }\n';
/* the userscript at document start, when the __us cookie is "on" */
const injected = 'if (location.hostname === "agar.io" && /(?:^|; )__us=on/.test(document.cookie)) (0, eval)(' + JSON.stringify(tmApi + userscript) + ');';
const agarFront = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Agar.io</title></head><body><h1>AGAR</h1></body></html>';
const agar404 = '<html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>';
/* a play.html the loaders accept; its LMexpress.js runs the real _lmLaunchLink, after a download time */
const legendPage = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>LM test</title></head><body><div id="lm-ok">Legend</div><!-- ' + 'play.html '.repeat(150) + ' -->' +
  '<script src="https://www.legendmod.ml/LMexpress/LMexpress.js"></script></body></html>';
const lmJs = launchFn + '\nwindow.__link = _lmLaunchLink(); try { localStorage.setItem("url", location.href); } catch (e) { } function init() { window.__init = 1; }';

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-launch-prof-'));
  const proc = spawn(chrome, ['--headless=new', '--remote-debugging-pipe', '--enable-unsafe-extension-debugging', '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const pipeOut = proc.stdio[3], pipeIn = proc.stdio[4];
  let id = 0, buf = '';
  const pending = new Map();
  const send = (method, params = {}, sessionId) => new Promise(res => { const i = ++id; pending.set(i, res); pipeOut.write(JSON.stringify({ id: i, method, params, sessionId }) + '\0'); });
  pipeIn.on('data', d => {
    buf += d.toString('utf8'); let i;
    while ((i = buf.indexOf('\0')) >= 0) {
      const m = JSON.parse(buf.slice(0, i)); buf = buf.slice(i + 1);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); continue; }
      if (m.method === 'Target.attachedToTarget') {
        const s = m.params.sessionId;
        send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] }, s).then(() => send('Runtime.runIfWaitingForDebugger', {}, s));
      }
      if (m.method !== 'Fetch.requestPaused') continue;
      const u = new URL(m.params.request.url);
      let body = '', status = 200, type = 'text/html; charset=utf-8', delay = 0;
      if (u.hostname === 'agar.io') { if (u.pathname === '/') body = agarFront; else { body = agar404; status = 404; type = 'text/html'; } }
      else if (u.pathname === '/play.html') { body = legendPage; delay = 300; }
      /* LMexpress.js comes some time after the loader saved the link (on the real site: seconds) */
      else if (u.pathname === '/LMexpress/LMexpress.js') { body = lmJs; type = 'application/javascript'; delay = 600; }
      else status = 404;
      setTimeout(() => send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: status,
        responseHeaders: [{ name: 'Content-Type', value: type }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(body, 'utf8').toString('base64') }, m.sessionId), delay);
    }
  });
  async function tab(url, us) {
    const t = await send('Target.createTarget', { url: 'about:blank' });
    const s = (await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true })).result.sessionId;
    await send('Page.enable', {}, s);
    await send('Network.enable', {}, s);
    await send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] }, s);
    await send('Page.addScriptToEvaluateOnNewDocument', { source: injected, worldName: 'tampermonkey' }, s);
    await send('Network.setCookie', { name: '__us', value: us ? 'on' : 'off', domain: 'agar.io', path: '/', secure: true }, s);
    if (url) send('Page.navigate', { url }, s);
    return s;
  }
  const evalIn = async (s, expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }, s); return r.result && r.result.result ? r.result.result.value : undefined; };
  /* the link Legend Mod got in tab s, once its LMexpress.js ran */
  async function linkOf(s) {
    for (let i = 0; i < 40; i++) { const v = await evalIn(s, 'window.__link === undefined ? null : String(window.__link)'); if (v !== null && v !== undefined) return v; await sleep(200); }
    return '(Legend Mod did not start)';
  }
  const A = 'https://agar.io/?sip=1.1.1.1:1111&pass=a#partyA', B = 'https://agar.io/?sip=2.2.2.2:2222&pass=b#partyB';
  async function twoTabs(name, us) {
    for (const gap of [0, 100, 250]) {
      const a = await tab(A, us); await sleep(gap);
      const b = await tab(B, us);
      const la = await linkOf(a), lb = await linkOf(b);
      check(name + ', two tabs ' + gap + ' ms apart: each tab gets its own launch link', la === A && lb === B, 'tab A got ' + la + ', tab B got ' + lb);
      for (const s of [a, b]) try { await send('Target.closeTarget', { targetId: (await send('Target.getTargetInfo', {}, s)).result.targetInfo.targetId }); } catch (e) { }
    }
  }
  try {
    /* the userscript alone */
    await twoTabs('userscript', true);
    /* LMexpress.js on its own: a record of an earlier page load in this tab (another timeOrigin) is not
     * used, the one of this page load is; an old loader that wrote only "url" still works */
    const s = await tab('https://agar.io/', false);
    await sleep(800);
    const own = await evalIn(s, '(function () {' + launchFn + '; var r = [];' +
      ' localStorage.setItem("url", "https://agar.io/?sip=old"); sessionStorage.setItem("lm-launch-url", JSON.stringify({ o: performance.timeOrigin - 5000, url: "https://agar.io/?sip=stale" })); r.push(_lmLaunchLink());' +
      ' sessionStorage.setItem("lm-launch-url", JSON.stringify({ o: String(performance.timeOrigin), url: "https://agar.io/?sip=mine" })); r.push(_lmLaunchLink());' +
      ' sessionStorage.setItem("lm-launch-url", "{broken"); r.push(_lmLaunchLink()); sessionStorage.removeItem("lm-launch-url"); r.push(_lmLaunchLink()); return r.join(" "); })()');
    if (fnMatch) check('_lmLaunchLink: this page load\'s record wins, a stale or broken one falls back to localStorage "url"', own === 'https://agar.io/?sip=old https://agar.io/?sip=mine https://agar.io/?sip=old https://agar.io/?sip=old', own);
    /* the extension alone */
    const ld = await send('Extensions.loadUnpacked', { path: extDir });
    if (!ld.result) console.log('skip extension part: this Chrome cannot load an unpacked extension over CDP (' + (ld.error && ld.error.message) + ')');
    else {
      await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true, filter: [{ type: 'service_worker', exclude: false }, { exclude: true }] });
      await sleep(1500);
      await twoTabs('extension', false);
    }
  } finally {
    try { await send('Browser.close'); } catch (e) { }
    await sleep(500);
    try { proc.kill(); } catch (e) { }
    await sleep(300);
    for (const d of [profile, extDir]) try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) { }
  }
  console.log(fail ? fail + ' launch link checks FAILED' : 'all launch link checks passed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FAIL harness', e && e.stack); process.exit(1); });
setTimeout(() => { console.log('FAIL timeout'); process.exit(1); }, 150000).unref();
