#!/usr/bin/env node
// The language across the Legend sites in headless Chrome (needs Chrome, like run.js; skipped without it).
// www.legendmod.ml / jimboy3100.github.io come from this repo; expanding.land and help.expanding.land are small
// test pages built the way those sites use the runtime (or their real checkouts: CROSS_EL_DIR, CROSS_HELP_DIR).
//  1. expanding.land, nothing chosen: shell and embedded Legend pages follow the browser (English), nothing sent.
//  2. a language chosen on the shell reaches the data-lm-lang-frame iframes (page runtime and mod runtime), and
//     is saved there; one chosen inside a frame comes back to the shell and to the other frame.
//  3. messages from an unmarked frame or a wrong origin change nothing.
//  4. links to the other sites get #lm= with only { lang }; the game page, files and other sites do not.
//  5. help.expanding.land opened with that link: its language, saved, the token taken out of the address.
//  6. a Legend page with the Theme Bridge opened with a language-only #lm=: that language.
//  7. LMexpress/LMexpress.html with Greek saved starts in Greek (it used to load LanguagePackEnglish.js).
//  8. a frame whose address is on jimboy3100.github.io (GitHub Pages sends it on to www.legendmod.ml, as the
//     skins / themes pages of expanding.land and legendffa on help.expanding.land do) gets and sends the language.
//  9. the game (play.html) in a frame, as on help.expanding.land/unblocked.html: a language passed from the shell
//     also shows in its Choose Language list (languagemod), and one chosen there comes back to the shell.
// 10. the Mod Info page, its FAQ and banner and the gift page of the mod show the language passed in #lm=.
// 11. the other live extras pages (promos, members banner, clan history, gamble page) in Greek, Arabic and Japanese.
// Usage: node developers/tests/i18n-crosssite.js
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
if (typeof fetch !== 'function' || typeof WebSocket !== 'function') { console.log('SKIP: Node 22+ needed'); process.exit(0); }
function findChrome() {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    const c = [];
    if (process.platform === 'win32') {
        for (const b of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA, 'C:/Program Files']) if (b) c.push(path.join(b, 'Google/Chrome/Application/chrome.exe'));
    } else if (process.platform === 'darwin') c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
    else for (const n of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) for (const d of (process.env.PATH || '').split(':').concat(['/usr/bin'])) c.push(path.join(d, n));
    return c.find((f) => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}
const chrome = findChrome();
if (!chrome) { console.log('SKIP: chrome not found (set CHROME_PATH)'); process.exit(0); }

const RT = '<script src="https://www.legendmod.ml/lib/lm-i18n.js" data-areas="AREA" charset="utf-8"></script>';
const page = (area, body) => '<!doctype html><html lang="en"><head><meta charset="utf-8">' + RT.replace('AREA', area) + '</head><body>' + body + '</body></html>';
const SHELL = page('site-expandingland', '<span data-lm-lang-picker></span><h1 data-i18n="site.expandingland.playTitle">Play Expanding Land</h1>' +
    '<a id="toHelp" href="https://help.expanding.land/guide.html">help</a> <a id="toHelpAnchor" href="https://help.expanding.land/guide.html#tips">help</a>' +
    ' <a id="toGame" href="https://www.legendmod.ml/play.html">game</a> <a id="toFile" href="https://www.legendmod.ml/banners/x.png">file</a>' +
    ' <a id="toOther" href="https://example.com/">other</a> <a id="toSelf" href="/terms.html">self</a>' +
    '<iframe id="ffa" data-lm-lang-frame src="https://www.legendmod.ml/extras/legendffa.html"></iframe>' +
    '<iframe id="pick" data-lm-lang-frame src="https://jimboy3100.github.io/developers/tests/_cross-picker.html"></iframe>' +
    '<iframe id="mod" data-lm-lang-frame src="https://www.legendmod.ml/developers/tests/_cross-mod.html"></iframe>' +
    '<iframe id="rogue" src="https://www.legendmod.ml/developers/tests/_cross-rogue.html"></iframe>' +
    '<iframe id="evil" src="https://example.com/_cross-evil.html"></iframe>');
const VIRTUAL = {
    'expanding.land/': SHELL,
    'help.expanding.land/guide.html': page('site-help-guide', '<span data-lm-lang-picker></span><p data-i18n="site.help.live">LIVE</p><p id="tips">tips</p>'),
    'www.legendmod.ml/developers/tests/_cross-picker.html': page('site', '<span data-lm-lang-picker></span>'),
    /* the game page's start: the mod runtime and English */
    'www.legendmod.ml/developers/tests/_cross-mod.html': '<!doctype html><html><head><meta charset="utf-8">' +
        '<script src="https://www.legendmod.ml/languages/lm-i18n.js" charset="utf-8"></script><script src="https://www.legendmod.ml/languages/lm-en.js" charset="utf-8"></script></head><body>mod</body></html>',
    /* not marked data-lm-lang-frame: its messages must not count */
    'www.legendmod.ml/developers/tests/_cross-rogue.html': '<!doctype html><html><body><script>setTimeout(function () { parent.postMessage({ type: "lm-lang", lang: 3 }, "https://expanding.land"); }, 50);</script></body></html>',
    'example.com/_cross-evil.html': '<!doctype html><html><body><script>setTimeout(function () { parent.postMessage({ type: "lm-lang", lang: 4 }, "*"); }, 50);</script></body></html>',
    /* 8: a page frame with a jimboy3100.github.io address (GitHub Pages redirects it, see REDIRECT) */
    'expanding.land/redir.html': page('site-expandingland', '<iframe id="moved" data-lm-lang-frame src="https://jimboy3100.github.io/developers/tests/_cross-moved.html"></iframe>'),
    'www.legendmod.ml/developers/tests/_cross-moved.html': page('site', '<span data-lm-lang-picker></span>'),
    /* 9: the game in a frame, as help.expanding.land/unblocked.html embeds it */
    'help.expanding.land/_cross-game.html': page('site-help-unblocked', '<span data-lm-lang-picker></span><iframe id="game" data-lm-lang-frame src="https://jimboy3100.github.io/play.html" style="width:960px;height:600px"></iframe>')
};
/* GitHub Pages serves jimboy3100.github.io under its custom domain (CNAME www.legendmod.ml): pages there answer 301 */
const REDIRECT = ['/developers/tests/_cross-picker.html', '/developers/tests/_cross-moved.html', '/play.html'];
const DIRS = { 'www.legendmod.ml': repo, 'jimboy3100.github.io': repo, 'legendmod.ml': repo };
if (process.env.CROSS_EL_DIR) DIRS['expanding.land'] = process.env.CROSS_EL_DIR;
if (process.env.CROSS_HELP_DIR) DIRS['help.expanding.land'] = process.env.CROSS_HELP_DIR;
const TYPES = { '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.gif': 'image/gif', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };

const out = path.join(__dirname, 'out', 'crosssite-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const port = 9800 + Math.floor(Math.random() * 400);
/* one process for all frames, so every frame can be evaluated from this page target */
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + path.join(out, 'profile'), '--no-first-run',
    '--no-default-browser-check', '--lang=en-US', '--disable-site-isolation-trials', '--disable-features=IsolateOrigins,site-per-process',
    ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage'] : []), 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };

(async () => {
    let ver;
    for (let i = 0; i < 60 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); } catch (e) { await sleep(200); } }
    if (!ver) { console.log('SKIP: chrome did not start'); proc.kill(); process.exit(0); }
    const target = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0; const pending = new Map(); const contexts = new Map(); /* frameId -> main world context */
    const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    ws.onmessage = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return; }
        if (m.method === 'Runtime.executionContextCreated') {
            const c = m.params.context;
            if (c.auxData && c.auxData.isDefault) contexts.set(c.auxData.frameId, c.id);
        } else if (m.method === 'Runtime.executionContextsCleared') contexts.clear();
        else if (m.method === 'Fetch.requestPaused') {
            const u = new URL(m.params.request.url);
            const key = u.hostname + u.pathname;
            if (u.hostname === 'jimboy3100.github.io' && REDIRECT.indexOf(u.pathname) >= 0) {
                send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 301, responseHeaders: [{ name: 'Location', value: 'https://www.legendmod.ml' + u.pathname + u.search }], body: '' });
                return;
            }
            let body = VIRTUAL[key], file = null;
            if (body === undefined && DIRS[u.hostname]) {
                let rel = decodeURIComponent(u.pathname.replace(/^\//, ''));
                if (rel === '' || rel.endsWith('/')) rel += 'index.html';
                file = path.join(DIRS[u.hostname], rel);
                if (fs.existsSync(file) && fs.statSync(file).isFile()) body = fs.readFileSync(file);
            }
            if (body === undefined) {
                if (DIRS[u.hostname] || VIRTUAL[u.hostname + '/'] !== undefined || u.hostname === 'example.com') send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 404, body: '' });
                else send('Fetch.failRequest', { requestId: m.params.requestId, errorReason: 'BlockedByClient' });
                return;
            }
            const ct = TYPES[path.extname(file || u.pathname).toLowerCase()] || 'text/html';
            send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: ct + '; charset=utf-8' }, { name: 'Cache-Control', value: 'no-store' }],
                body: Buffer.from(body).toString('base64') });
        }
    };
    await new Promise((r) => { ws.onopen = r; });
    await send('Page.enable'); await send('Runtime.enable');
    await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });

    const frameIds = async () => {
        const t = await send('Page.getFrameTree');
        const map = { top: t.frameTree.frame.id };
        (t.frameTree.childFrames || []).forEach((c) => { if (c.frame.name || c.frame.id) map[c.frame.url] = c.frame.id; });
        return map;
    };
    const evalIn = async (frameId, expr) => {
        const ctx = contexts.get(frameId);
        const r = await send('Runtime.evaluate', Object.assign({ expression: expr, returnByValue: true, awaitPromise: true }, ctx ? { contextId: ctx } : {}));
        return r && r.result ? r.result.value : undefined;
    };
    const frame = async (urlPart) => { const f = await frameIds(); const k = Object.keys(f).find((u) => u.indexOf(urlPart) >= 0); return k ? f[k] : null; };
    const waitFor = async (fn, ms) => { const t0 = Date.now(); let v; while (!(v = await fn()) && Date.now() - t0 < ms) await sleep(150); return v; };
    const go = async (url) => { await send('Page.navigate', { url }); await sleep(2500); };
    const langOf = async (part) => { const f = await frame(part); return f ? evalIn(f, 'document.documentElement.lang + "|" + (localStorage.getItem("languagemod") || "")') : 'no frame'; };

    /* 1 */
    await go('https://expanding.land/');
    const top = (await frameIds()).top;
    await waitFor(async () => (await langOf('legendffa')) === 'en|', 8000);
    ok((await evalIn(top, 'LMi18n.lang() + "|" + (localStorage.getItem("languagemod") || "")')) === 'en|', '1 shell follows the browser (en), nothing saved');
    ok((await langOf('legendffa')) === 'en|', '1 embedded Legend page: en, nothing saved');
    ok((await langOf('_cross-mod')).indexOf('|') >= 0 && (await langOf('_cross-mod')).split('|')[1] === '', '1 embedded mod runtime: nothing saved');

    /* 2 shell -> frames */
    await evalIn(top, 'LMi18n.setLang(2), 1');
    ok(await waitFor(async () => (await langOf('legendffa')) === 'el|2', 8000), '2 shell choice (Greek) reaches the page frame and is saved there: ' + (await langOf('legendffa')));
    const ffa = await frame('legendffa');
    const GREEK = new RegExp('[' + String.fromCharCode(0x370) + '-' + String.fromCharCode(0x3ff) + ']');
    ok(GREEK.test(await evalIn(ffa, '(document.querySelector(\'[data-i18n-html="site.legendffa.whatIsThis"]\') || {}).textContent || ""')), '2 the embedded legendffa page shows Greek texts');
    const mod = await frame('_cross-mod');
    ok(await waitFor(async () => (await evalIn(mod, 'LMi18n.lang() + "|" + localStorage.getItem("languagemod")')) === 'el|2', 8000), '2 the mod runtime in a frame switches to Greek and saves it');
    /* frame -> shell -> other frames */
    const pick = await frame('_cross-picker');
    await evalIn(pick, 'var s = document.querySelector("select.lm-lang-select"); s.value = "9"; s.dispatchEvent(new Event("change")); 1');
    ok(await waitFor(async () => (await evalIn(top, 'LMi18n.lang() + "|" + localStorage.getItem("languagemod")')) === 'de|9', 8000), '2 a choice inside a frame (German) comes back to the shell and is saved');
    ok(await waitFor(async () => (await langOf('legendffa')) === 'de|9', 8000), '2 ... and reaches the other frames');
    ok(await waitFor(async () => (await evalIn(mod, 'LMi18n.lang()')) === 'de', 8000), '2 ... including the mod runtime');

    /* 3 the rogue frames posted Spanish / Bulgarian at start: never applied; a forged message from the top is ignored too */
    await evalIn(top, 'window.postMessage({ type: "lm-lang", lang: 5 }, "*"), 1');
    await sleep(800);
    ok((await evalIn(top, 'LMi18n.lang()')) === 'de', '3 messages from an unmarked frame, another origin or the page itself change nothing');
    await evalIn(ffa, 'window.postMessage({ type: "lm-lang", lang: 5, theme: { mc: "#ff0000" } }, "*"), 1');
    await sleep(800);
    ok((await evalIn(ffa, 'LMi18n.lang()')) === 'de', '3 a frame ignores a message that is not from its embedding window');

    /* 4 links */
    const href = (sel) => evalIn(top, 'var a = document.querySelector("' + sel + '"); a.addEventListener("click", function (e) { e.preventDefault(); }, { once: true }); a.click(); a.href');
    const dec = (h) => { const m = /[#&]lm=([^&]+)/.exec(h || ''); if (!m) return null; return JSON.parse(Buffer.from(m[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()); };
    const h1 = await href('#toHelp');
    ok(JSON.stringify(dec(h1)) === '{"lang":9}', '4 link to help.expanding.land carries only { lang: 9 }: ' + h1);
    const h2 = await href('#toHelpAnchor');
    ok(/#tips&lm=/.test(h2) && JSON.stringify(dec(h2)) === '{"lang":9}', '4 the link keeps its own anchor first');
    await evalIn(top, 'LMi18n.setLang(2), 1'); await sleep(600);
    ok(JSON.stringify(dec(await href('#toHelp'))) === '{"lang":2}', '4 after another choice the link carries the new language once');
    ok((await href('#toHelp')).split('lm=').length === 2, '4 ... and a single token');
    ok(!dec(await href('#toGame')) && !dec(await href('#toFile')) && !dec(await href('#toOther')) && !dec(await href('#toSelf')), '4 no token on the game page, files, other sites or the same site');

    /* 5 */
    const helpUrl = await href('#toHelp');
    await go(helpUrl);
    const top5 = (await frameIds()).top;
    ok(await waitFor(async () => (await evalIn(top5, 'LMi18n.lang() + "|" + localStorage.getItem("languagemod")')) === 'el|2', 6000), '5 help.expanding.land opened with the link: Greek, saved');
    ok((await evalIn(top5, 'location.href')) === 'https://help.expanding.land/guide.html', '5 the token is taken out of the address');
    ok((await evalIn(top5, 'document.documentElement.lang')) === 'el', '5 its page is marked Greek (html lang)');

    /* 6 Theme Bridge page with a language-only token (French) */
    const tok = Buffer.from('{"lang":5}').toString('base64').replace(/=+$/, '');
    await go('https://www.legendmod.ml/faq.html#lm=' + tok);
    const top6 = (await frameIds()).top;
    ok(await waitFor(async () => (await evalIn(top6, 'LMi18n.lang()')) === 'fr', 6000), '6 a Theme Bridge page takes the language from a language-only #lm=');
    ok((await evalIn(top6, '!(window.lmThemeBridge && lmThemeBridge.isThemed())')) === true, '6 ... and applies no theme');
    /* the monitor loads the Theme Bridge before the runtime: the bridge takes #lm= out first and must keep the language */
    await go('https://www.legendmod.ml/monitor/index.html#lm=' + Buffer.from('{"lang":8}').toString('base64').replace(/=+$/, ''));
    const top6b = (await frameIds()).top;
    ok(await waitFor(async () => (await evalIn(top6b, 'LMi18n.lang()')) === 'ru', 6000), '6 ... also when the Theme Bridge runs first (monitor page): ' + (await evalIn(top6b, 'LMi18n.lang() + " " + location.href')));

    /* 7 LMexpress.html with Greek saved */
    await evalIn(top6, 'localStorage.setItem("languagemod", "2"), 1');
    await go('https://www.legendmod.ml/LMexpress/LMexpress.html');
    await sleep(3000);
    const top7 = (await frameIds()).top;
    const q7 = 'JSON.stringify({ lang: window.LMi18n && LMi18n.lang(), html: document.documentElement.lang, name: (document.querySelector("#UserProfileName [data-i18n]") || {}).textContent, old: !!document.querySelector("script[src*=\\"LanguagePackEnglish\\"]") })';
    /* the page goes on loading the mod after the profile is parsed: wait until the end of <body> applied the texts */
    await waitFor(async () => { const v = JSON.parse((await evalIn(top7, q7)) || "{}"); return GREEK.test(v.name || ""); }, 20000);
    const r7 = await evalIn(top7, q7);
    const v7 = JSON.parse(r7 || '{}');
    ok(v7.lang === 'el' && v7.html === 'el', '7 LMexpress.html starts in the saved language (Greek): ' + r7);
    ok(!v7.old, '7 LMexpress.html no longer loads LanguagePackEnglish.js');
    ok(/[\u0370-\u03ff]/.test(v7.name || ''), '7 its profile labels are Greek at the first render');

    /* 8 (the frames' storage is per embedding site: the frame starts in the shell's Greek from steps 2 and 4) */
    await go('https://expanding.land/redir.html');
    const top8 = (await frameIds()).top;
    await evalIn(top8, 'LMi18n.setLang(10), 1');
    ok(await waitFor(async () => (await langOf('_cross-moved')) === 'tr|10', 8000), '8 a redirected frame (jimboy3100.github.io -> www.legendmod.ml) gets the shell choice (Turkish): ' + (await langOf('_cross-moved')));
    const moved = await frame('_cross-moved');
    if (moved) await evalIn(moved, 'var s = document.querySelector("select.lm-lang-select"); s.value = "5"; s.dispatchEvent(new Event("change")); 1');
    ok(await waitFor(async () => (await evalIn(top8, 'LMi18n.lang()')) === 'fr', 8000), '8 ... and a choice made in it comes back to the shell: ' + (await evalIn(top8, 'LMi18n.lang()')));
    /* two quick choices in the frame (Turkish, then French; both files already there): the first one must not
     * come back to the frame after the second and start both windows switching back and forth */
    await evalIn(top8, 'window._lmSwitches = 0; LMi18n.onChange(function () { window._lmSwitches++; }); 1');
    if (moved) await evalIn(moved, 'window._lmSwitches = 0; LMi18n.onChange(function () { window._lmSwitches++; }); var s = document.querySelector("select.lm-lang-select"); s.value = "10"; s.dispatchEvent(new Event("change")); s.value = "5"; s.dispatchEvent(new Event("change")); 1');
    await sleep(1500);
    const sw = [await evalIn(top8, 'window._lmSwitches + "|" + LMi18n.lang()'), moved ? await evalIn(moved, 'window._lmSwitches + "|" + LMi18n.lang()') : 'no frame'];
    ok(sw[0] === '2|fr' && sw[1] === '2|fr', '8 two quick choices end in the last one, each window switches twice (shell, frame): ' + sw.join(' '));

    /* 9 the game in a frame (help.expanding.land has Greek saved, step 5) */
    await go('https://help.expanding.land/_cross-game.html');
    const top9 = (await frameIds()).top;
    const gameQ = 'JSON.stringify({ lang: window.LMi18n && LMi18n.lang(), list: (document.getElementById("legendlanguages") || {}).value, mod: String(window.languagemod) })';
    const gameState = async () => { const g = await frame('legendmod.ml/play'); return g ? JSON.parse((await evalIn(g, gameQ)) || '{}') : {}; };
    /* the menu (Choose Language list) is built after the mod's scripts loaded */
    await waitFor(async () => !!(await gameState()).list, 60000);
    await evalIn(top9, 'LMi18n.setLang(11), 1');
    await waitFor(async () => { const g = await gameState(); return g.lang === 'pl' && g.list === '11'; }, 10000);
    const g9 = await gameState();
    ok(g9.lang === 'pl' && g9.list === '11' && g9.mod === '11', '9 a language chosen on the shell (Polish) is the game\'s Choose Language value too: ' + JSON.stringify(g9));
    const game = await frame('legendmod.ml/play');
    if (game) await evalIn(game, '$("#legendlanguages").val("3"); changeModLanguage(true); 1');
    ok(await waitFor(async () => (await evalIn(top9, 'LMi18n.lang() + "|" + localStorage.getItem("languagemod")')) === 'es|3', 10000), '9 a language chosen in the game (Spanish) comes back to the shell: ' + (await evalIn(top9, 'LMi18n.lang()')));

    /* 10 the Mod Info page (extras/helper.html), its FAQ frame and the gift page (rewardday2.html) in Arabic,
     * as the mod opens them (language in #lm=): every marked text from the packs, the links in the credits kept */
    const ar = '#lm=' + Buffer.from('{"lang":6}').toString('base64').replace(/=+$/, '');
    const ARABIC = /[؀-ۿ]/;
    for (const [url, sel, links] of [['https://www.legendmod.ml/extras/helper.html', '[data-i18n-html="site.helper.thanks"]', 4],
        ['https://www.legendmod.ml/extras/banneranimated7.html', '[data-i18n="site.helper.faq.q6"]', 0], ['https://www.legendmod.ml/extras/rewardday2.html', '[data-i18n-html="site.rewardday.granted"]', 0],
        ['https://www.legendmod.ml/extras/banneranimated3c.html', '[data-i18n="site.banners.welcomeText"]', 0]]) {
        await go(url + ar);
        const t10 = (await frameIds()).top;
        const q10 = 'JSON.stringify({ lang: window.LMi18n && LMi18n.lang(), dir: document.documentElement.dir, miss: Object.keys(LMi18n.missing()), text: (document.querySelector(\'' + sel + '\') || {}).textContent || "", links: document.querySelectorAll(\'' + sel + ' a\').length, marked: document.querySelectorAll("[data-i18n],[data-i18n-html]").length })';
        await waitFor(async () => ARABIC.test(JSON.parse((await evalIn(t10, q10)) || '{}').text || ''), 8000);
        const v10 = JSON.parse((await evalIn(t10, q10)) || '{}');
        ok(v10.lang === 'ar' && v10.dir === 'rtl' && ARABIC.test(v10.text) && !v10.miss.length && v10.links === links && v10.marked > 3, '10 ' + url.split('/').pop() + ' in Arabic: ' + JSON.stringify(v10).slice(0, 160));
    }

    /* 11 the other live extras pages (Mega FFA promo on the home page, 2020 promo and members banner on the clan
     * page, clan history, the gamble page) in Greek, Arabic and Japanese: marked texts from the packs, the credits'
     * shadow copies (data-text) follow them, texts set by the scripts (scrambled phrases) too, links kept */
    const SCRIPT = { el: /[Ͱ-Ͽ]/, ar: /[؀-ۿ]/, ja: /[぀-ヿ一-鿿]/ };
    for (const [code, num] of [['el', 2], ['ar', 6], ['ja', 15]]) {
        const hash = '#lm=' + Buffer.from('{"lang":' + num + '}').toString('base64').replace(/=+$/, '');
        for (const [url, sel, links] of [['https://www.legendmod.ml/extras/2020.html', '[data-i18n="site.extras.agarIoMegaFfa"]', 0],
            ['https://www.legendmod.ml/extras/banneranimatedLegendmod2020.html', '[data-i18n="site.extras.upcomingUpdates"]', 0],
            ['https://www.legendmod.ml/extras/bannermembers.html', '[data-i18n="site.banners.countryGreece"]', 0],
            ['https://www.legendmod.ml/extras/LcHistory/LcSlideshow.html', '[data-i18n="site.banners.legendOurHeroes"]', 0],
            ['https://www.legendmod.ml/extras/LcHistory/LcHistory.html', '[data-i18n-html="site.extras.forMoreInfoOur"]', 1],
            ['https://www.legendmod.ml/extras/website/gamble.html', '[data-i18n-html="site.gamble.clickHere"]', 1],
            ['https://www.legendmod.ml/extras/banneranimated9.html', '.text', 0]]) {
            await go(url + hash);
            const t11 = (await frameIds()).top;
            const q11 = 'JSON.stringify({ lang: window.LMi18n && LMi18n.lang(), dir: document.documentElement.dir, miss: Object.keys(LMi18n.missing()), text: (document.querySelector(\'' + sel + '\') || {}).textContent || "", links: document.querySelectorAll(\'' + sel + ' a\').length, ' +
                'shadow: [].filter.call(document.querySelectorAll("[data-text][data-i18n]"), function (e) { return e.getAttribute("data-text") !== e.textContent.replace(/\\s+/g, " ").trim(); }).length })';
            await waitFor(async () => SCRIPT[code].test(JSON.parse((await evalIn(t11, q11)) || '{}').text || ''), 10000);
            const v11 = JSON.parse((await evalIn(t11, q11)) || '{}');
            ok(v11.lang === code && (v11.dir === 'rtl') === (code === 'ar') && SCRIPT[code].test(v11.text) && !v11.miss.length && v11.links === links && !v11.shadow,
                '11 ' + url.split('/').pop() + ' in ' + code + ': ' + JSON.stringify(v11).slice(0, 160));
        }
    }

    ws.close(); proc.kill();
    try { fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
    console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
    process.exit(fails ? 1 : 0);

})().catch((e) => { console.log('harness error', e); proc.kill(); process.exit(3); });
