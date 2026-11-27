/* Legend Express update notice (LMexpress/LMexpress.js startLM -> _lmxUpdateNotice), with the real functions
 * cut out of LMexpress.js and the real language packs:
 * - versions compare by number: 1.7, 1.8, 1.8.5, 1.8.7 are older than 1.9; 1.9, 1.9.0, 1.9.1, 1.10, 2.0 are not
 * - which loader started Legend Mod: init(version, "userscript"|"extension"|"website"), the single-owner
 *   record of the 1.9 loaders (sessionStorage lm-loader-owner / html[data-lm-loader], this page load's
 *   timeOrigin only), the website (www.legendmod.ml, expanding.land frames), and old loaders that name
 *   nothing (old userscripts, old extension 1.8.0-1.8.5)
 * - userscripts get the userscript link, the extension gets the extension steps, website visitors nothing
 * - shown once per tab session; texts in all 16 languages, escaped
 * node developers/tests/lmxupdate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const i18n = require('./lib/i18n-env');
const L = require('../i18n/lib');

const repo = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) fail++; };

function block(i) {
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    throw new Error('unbalanced block at ' + i);
}
function fn(name) {
    const m = new RegExp('\\nfunction ' + name + '\\(').exec(src);
    if (!m) throw new Error('function ' + name + ' not found in LMexpress.js');
    return block(m.index + 1);
}
function line(re) {
    const m = re.exec(src);
    if (!m) throw new Error('not found: ' + re);
    return m[0];
}
const code = [
    line(/\nfunction _lmxT\([^\n]*/), line(/\nfunction _lmxE\([^\n]*/),
    line(/\nvar LMX_LATEST = [^\n]*/), line(/\nvar LMX_OWNER_SINCE = [^\n]*/), line(/\nvar LMX_UPDATE_URL = [^\n]*/),
    fn('_lmOnLegendWebsite'), fn('_lmEscHtml'), fn('_lmxCompareVersions'), fn('_lmxOwnerLoader'), fn('_lmxLoaderKind'), fn('_lmxUpdateNotice')
].join('\n');

/* a page: host, timeOrigin, storage, the toasts it showed */
function page(opts) {
    opts = opts || {};
    const store = (o) => { const s = Object.assign({}, o); return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); }, _s: s }; };
    const toasts = [];
    const ctx = {
        console,
        location: { hostname: opts.host || 'agar.io' },
        performance: opts.timeOrigin === -1 ? { timing: { navigationStart: 1764230400123 } } : { timeOrigin: opts.timeOrigin || 1764230400123.4 },
        sessionStorage: opts.session || store(opts.sessionData),
        localStorage: store(opts.localData),
        document: { documentElement: { getAttribute: (k) => (k === 'data-lm-loader' && opts.attr) || null } },
        toastr: { info: (html, title, o) => { toasts.push({ html, o }); return { css() { return this; } }; } }
    };
    ctx.window = ctx;
    i18n(ctx, opts.lang || 'en');
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    ctx.toasts = toasts;
    return ctx;
}

/* 1. numeric comparison */
const p0 = page();
const cmp = p0._lmxCompareVersions;
for (const v of ['1.7', '1.7.1', '1.8', '1.8.0', '1.8.5', '1.8.7', '1.3', '0.1']) check(v + ' is older than 1.9', cmp(v, '1.9') === -1, cmp(v, '1.9'));
for (const v of ['1.9', '1.9.0']) check(v + ' equals 1.9', cmp(v, '1.9') === 0, cmp(v, '1.9'));
for (const v of ['1.9.1', '1.10', '1.10.0', '2.0', '2']) check(v + ' is newer than 1.9', cmp(v, '1.9') === 1, cmp(v, '1.9'));
check('1.10 is newer than 1.9.9', cmp('1.10', '1.9.9') === 1);
check('a missing version counts as oldest', cmp(undefined, '1.9') === -1 && cmp('', '1.9') === -1);

/* 2. loader kind and notice per install */
const TO = 1764230400123.4;
const cases = [
    /* [name, init args, page options, expected kind or '' (no notice), link] */
    ['old userscript 1.8.7 (no loader name)', ['1.8.7'], {}, 'userscript'],
    ['old userscript 1.8.6', ['1.8.6'], {}, 'userscript'],
    ['old userscript 1.8.5 (no extension switch mirror)', ['1.8.5'], {}, 'userscript'],
    ['old userscript 1.8', ['1.8'], {}, 'userscript'],
    ['old userscript 1.7', ['1.7'], {}, 'userscript'],
    ['old extension 1.8.5 (its switch mirror lmExpressEnabled)', ['1.8.5'], { localData: { lmExpressEnabled: '1' } }, 'extension'],
    ['old extension 1.8.4', ['1.8.4'], { localData: { lmExpressEnabled: '1' } }, 'extension'],
    ['old extension 1.8.3', ['1.8.3'], {}, 'extension'],
    ['old extension 1.8.0', ['1.8.0'], {}, 'extension'],
    ['userscript 1.8.7 beside a (stale) extension switch mirror', ['1.8.7'], { localData: { lmExpressEnabled: '0' } }, 'userscript'],
    ['userscript 1.9 naming itself', ['1.9', 'userscript'], {}, ''],
    ['userscript 1.9 by its owner record', ['1.9'], { sessionData: { 'lm-loader-owner': 'userscript:' + TO } }, ''],
    ['userscript 1.9.1', ['1.9.1', 'userscript'], {}, ''],
    ['userscript 1.10', ['1.10', 'userscript'], {}, ''],
    ['userscript 2.0', ['2.0'], {}, ''],
    ['extension 1.9.0 naming itself', ['1.9.0', 'extension'], {}, ''],
    ['extension 1.9.0 by its owner attribute', ['1.9.0'], { attr: 'extension:' + TO }, ''],
    ['a named userscript 1.8.7', ['1.8.7', 'userscript'], { localData: { lmExpressEnabled: '1' } }, 'userscript'],
    ['a named extension 1.8.5', ['1.8.5', 'extension'], {}, 'extension'],
    ['old userscript 1.8.7 beside extension 1.9 (the extension owns the page)', ['1.8.7'], { sessionData: { 'lm-loader-owner': 'extension:' + TO }, localData: { lmExpressEnabled: '1' } }, 'userscript'],
    ['old extension 1.8.5 beside userscript 1.9 (the userscript owns the page)', ['1.8.5'], { sessionData: { 'lm-loader-owner': 'userscript:' + TO } }, 'extension'],
    ['extension 1.9 owner record in a browser without timeOrigin (navigationStart)', ['1.9.0'], { timeOrigin: -1, sessionData: { 'lm-loader-owner': 'extension:1764230400123' } }, ''],
    ['old userscript 1.8.7 beside extension 1.9, without timeOrigin', ['1.8.7'], { timeOrigin: -1, sessionData: { 'lm-loader-owner': 'extension:1764230400123' }, localData: { lmExpressEnabled: '1' } }, 'userscript'],
    ['old extension 1.8.5 and an owner record of an earlier page load', ['1.8.5'], { sessionData: { 'lm-loader-owner': 'userscript:12345.6' }, localData: { lmExpressEnabled: '1' } }, 'extension'],
    ['website www.legendmod.ml (init("1.8", "website"))', ['1.8', 'website'], { host: 'www.legendmod.ml' }, ''],
    ['website without a loader name', ['1.8'], { host: 'www.legendmod.ml' }, ''],
    ['website jimboy3100.github.io', ['1.8'], { host: 'jimboy3100.github.io' }, ''],
    ['website expanding.land', ['1.8'], { host: 'expanding.land' }, ''],
    ['a missing version from a userscript', [undefined, 'userscript'], {}, 'userscript']
];
for (const [name, args, opts, want] of cases) {
    const p = page(opts);
    let got, err = '';
    try { got = p._lmxUpdateNotice(args[0], args[1]); } catch (e) { err = String(e); }
    check(name + ': ' + (want ? want + ' notice' : 'no notice'), !err && got === want && p.toasts.length === (want ? 1 : 0), err || got + ' / ' + p.toasts.length + ' toasts');
    if (!want || !p.toasts.length) continue;
    const html = p.toasts[0].html;
    const link = want === 'userscript' ? 'https://www.legendmod.ml/LMexpress/LMexpress.user.js' : 'https://www.legendmod.ml/LMexpress/LegendExpressExtension.zip';
    check(name + ': link ' + link, html.indexOf('href="' + link + '"') >= 0 && (html.match(/href=/g) || []).length === 1, html);
    check(name + ': the extension steps only for the extension', (html.indexOf(i18n.t('lmx.ex.updateExtension')) >= 0) === (want === 'extension'), html);
    check(name + ': says 1.9 and the installed version', html.indexOf('<b>1.9</b>') >= 0 && html.indexOf('<b>v' + (args[0] == null ? '' : args[0]) + '</b>') >= 0, html);
    check(name + ': stays 20 s', p.toasts[0].o && p.toasts[0].o.timeOut === 20000, JSON.stringify(p.toasts[0].o));
}

/* 3. once per tab session (the session storage is shared by the page loads of the tab) */
const sess = (() => { const s = {}; return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); } }; })();
const a = page({ session: sess }), b = page({ session: sess, timeOrigin: TO + 5000 });
a._lmxUpdateNotice('1.8.7');
b._lmxUpdateNotice('1.8.7');
check('shown once per tab session (second page load: none)', a.toasts.length === 1 && b.toasts.length === 0, a.toasts.length + ' ' + b.toasts.length);
const c = page({ session: sess, timeOrigin: TO + 9000, localData: { lmExpressEnabled: '1' } });
c._lmxUpdateNotice('1.8.5', 'extension');
check('a different loader in the same tab session still gets its own notice', c.toasts.length === 1);
const noStore = page({ session: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } } });
let thrown = '';
try { noStore._lmxUpdateNotice('1.8.7'); } catch (e) { thrown = String(e); }
check('blocked session storage: still shown, no error', !thrown && noStore.toasts.length === 1, thrown);

/* 4. escaping and all languages */
const evil = page();
evil._lmxUpdateNotice('1.8"><img src=x onerror=alert(1)>', 'userscript');
check('the version text is escaped', evil.toasts.length === 1 && evil.toasts[0].html.indexOf('<img') < 0, evil.toasts[0] && evil.toasts[0].html);
for (const code of L.CODES) {
    const p = page({ lang: code, localData: { lmExpressEnabled: '1' } });
    p._lmxUpdateNotice('1.8.5', 'extension');
    const html = p.toasts.length ? p.toasts[0].html : '';
    const t = (k) => i18n.t(k, null, code);
    const own = ['lmx.ex.updateAvailable', 'lmx.ex.updateLink', 'lmx.ex.updateExtension'].every((k) => t(k) && t(k) !== k);
    check(code + ': notice in its language', own && html.indexOf(t('lmx.ex.updateLink')) >= 0 && html.indexOf(t('lmx.ex.updateExtension')) >= 0 &&
        html.indexOf('\u0001') < 0 && html.indexOf('\u0002') < 0 && html.indexOf('{0}') < 0 && html.indexOf('{1}') < 0, html.slice(0, 160));
}

/* 5. init(version, loader) -> startLM -> the notice, for a page that is ready and one that is still loading;
 * the website starts LM as "website" */
for (const ready of [true, false]) {
    const p = page();
    let observer = null, started = 0;
    p.adminstuff = () => { };
    p.initializeLM = () => { started++; };
    p.document.getElementById = () => (ready || observer === 'done' ? {} : null);
    p.document.body = {};
    p.MutationObserver = function (cb) { this.observe = () => { observer = cb; }; this.disconnect = () => { }; };
    vm.runInContext(fn('startLM') + '\n' + fn('init'), p);
    p.init('1.8.5', 'extension');
    if (!ready) { const cb = observer; observer = 'done'; cb([], { disconnect() { } }); }
    check('init(1.8.5, "extension") on a ' + (ready ? 'ready' : 'loading') + ' page: extension notice, LM started once', started === 1 && p.toasts.length === 1 &&
        p.toasts[0].html.indexOf('LegendExpressExtension.zip') >= 0 && p.LMVersion === '1.8.5', started + ' ' + p.toasts.length);
}
const web = block(src.indexOf('if (_lmOnLegendWebsite()) {'));
check('the website starts LM as "website"', /\binit\(modVersion, "website"\)/.test(web), web.slice(0, 300));

/* 6. In headless Chrome (skipped without it): a loader at document start on agar.io writes the owner record and
 * replaces agar.io's page with document.open()/write() like the loaders; in the written page the real functions
 * still find this page load's record (same timeOrigin), a reload ignores the old record, and the once-per-session
 * mark survives the reload in the tab's real sessionStorage. */
async function inChrome() {
    const { spawn } = require('child_process');
    const os = require('os');
    const chrome = process.env.CHROME_PATH || [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA]
        .filter(Boolean).map((b) => path.join(b, 'Google/Chrome/Application/chrome.exe'))
        .concat(['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'])
        .find((f) => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
    if (!chrome || typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('skipped (Chrome or Node 22+ not found): headless Chrome checks'); return; }
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const legend = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="lm">Legend</div><script>' +
        'var toastr = { info: function (h) { (window.__toasts = window.__toasts || []).push(h); return { css: function () { } }; } };\n' +
        code + '\nwindow.__owner = _lmxOwnerLoader(); window.__shown = _lmxUpdateNotice("1.8.5");</script></body></html>';
    const agar = '<!DOCTYPE html><html><head><title>Agar.io</title></head><body>' + '<p>agar.io</p>'.repeat(5000) + '<script>window.__vanilla = 1;</script></body></html>';
    /* the loader: on the first load only (sessionStorage flag), so the reload shows a stale record */
    const loader = 'if (!sessionStorage.getItem("__second")) { sessionStorage.setItem("lm-loader-owner", "extension:" + performance.timeOrigin);' +
        ' document.documentElement.setAttribute("data-lm-loader", "extension:" + performance.timeOrigin); }' +
        ' window.__t0 = performance.timeOrigin; var x = new XMLHttpRequest(); x.open("GET", "https://www.legendmod.ml/play.html", false); x.send();' +
        ' document.open(); document.write(x.responseText); document.close();';
    const port = 9950 + Math.floor(Math.random() * 40);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-lmxupdate-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', ...(process.platform === 'linux' ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
    try {
        let ok = false;
        for (let i = 0; i < 300 && !ok; i++) { try { await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); ok = true; } catch (e) { await sleep(200); } }
        if (!ok) throw new Error('chrome did not start');
        const tab = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page');
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        let id = 0; const pending = new Map();
        const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
        ws.onmessage = (ev) => {
            const m = JSON.parse(ev.data);
            if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
            if (m.method !== 'Fetch.requestPaused') return;
            const u = new URL(m.params.request.url);
            const body = u.hostname === 'agar.io' && m.params.resourceType === 'Document' ? agar : u.hostname === 'www.legendmod.ml' && u.pathname === '/play.html' ? legend : null;
            send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: body == null ? 404 : 200,
                responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }, { name: 'Access-Control-Allow-Origin', value: '*' }],
                body: Buffer.from(body || '', 'utf8').toString('base64') });
        };
        await new Promise((r) => { ws.onopen = r; });
        await send('Page.enable');
        await send('Fetch.enable', { patterns: [{ urlPattern: '*://agar.io/*' }, { urlPattern: '*://www.legendmod.ml/*' }] });
        /* no Player Monitor entry for this test browser (lib/nopresence.js) */
        await send('Page.addScriptToEvaluateOnNewDocument', { source: require('./lib/nopresence').source });
        await send('Page.addScriptToEvaluateOnNewDocument', { source: 'if (location.hostname === "agar.io") { var __o = new MutationObserver(function () {' +
            ' if (!document.documentElement) return; __o.disconnect(); (0, eval)(' + JSON.stringify(loader) + '); }); __o.observe(document, { childList: true }); }' });
        const state = async () => JSON.parse((await send('Runtime.evaluate', { returnByValue: true, expression:
            'JSON.stringify({ lm: !!document.getElementById("lm"), vanilla: window.__vanilla || 0, owner: window.__owner, shown: window.__shown, toasts: (window.__toasts || []).length,' +
            ' sameOrigin: window.__t0 === performance.timeOrigin, attr: document.documentElement.getAttribute("data-lm-loader") })' })).result.value);
        await send('Page.navigate', { url: 'https://agar.io/' });
        await sleep(2500);
        const first = await state();
        check('Chrome: the page written over agar.io is up (agar.io\'s script did not run)', first.lm && !first.vanilla, JSON.stringify(first));
        check('Chrome: document.open() keeps performance.timeOrigin, the owner record is found', first.sameOrigin && first.owner === 'extension', JSON.stringify(first));
        check('Chrome: an old userscript 1.8.5 beside the 1.9 extension gets the userscript notice', first.shown === 'userscript' && first.toasts === 1, JSON.stringify(first));
        await send('Runtime.evaluate', { expression: 'sessionStorage.setItem("__second", "1"); location.reload();' });
        await sleep(2500);
        const second = await state();
        check('Chrome: after a reload the old owner record is ignored', second.lm && second.owner === '', JSON.stringify(second));
        check('Chrome: the notice is not shown again in this tab session', second.shown === '' && second.toasts === 0, JSON.stringify(second));
        ws.close();
    } finally {
        proc.kill();
        await sleep(400);
        try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { }
    }
}

inChrome().catch((e) => { check('headless Chrome harness', false, e && e.message); }).then(() => {
    console.log(fail ? 'FAILED: ' + fail : 'all passed');
    process.exit(fail ? 1 : 0);
});
