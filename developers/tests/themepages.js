/* Theme Bridge in a real browser: computed styles, not source strings. Each case loads a Legend page
 * from this repo in headless Chrome (smoke.js serves the repo for www.legendmod.ml) and reads the
 * rendered result:
 *   index.html and faq.html visited directly       -> the website design, no bridge stylesheet, no button
 *   index.html#Changelog&lm=... (from the sender)  -> theme colours, background image without the query
 *                                                    token, small corner on buttons / fields, #Changelog kept
 *   Restore website theme on index.html            -> the same computed styles as the direct visit
 *   faq.html#lm=... with Greek                     -> site mode with the image, the button in Greek
 *   changelog.html#v...&lm=...                     -> anchor back in the address and scrolled to
 *   privacy.html / terms.html with a theme         -> theme background, text and heading colours
 *   LMexpress/privacy.html#lm=... (moved page)     -> privacy.html#extension with the language and theme
 *   an embedded videoskins.html / faq.html          -> handshake theme, live update after a theme change,
 *                                                    http links not decorated, no Restore button
 * Screenshots: developers/tests/out/themepages-<case>/shot.png
 * node developers/tests/themepages.js   (needs Chrome, like smoke.js; prints SKIP without it) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { spawnSync } = require('child_process');
const here = __dirname, repo = path.resolve(here, '..', '..'), outRoot = path.join(here, 'out');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (!ok && info !== undefined ? '  ' + JSON.stringify(info).slice(0, 400) : '')); if (!ok) failed++; };

/* the sender block of LMexpress.js, run with test settings, gives the links the game makes */
const lm = fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8');
const block = lm.slice(lm.indexOf('/* -- Legend Mod Theme Bridge (mod-side helpers)'), lm.indexOf('/* After any lm-promo modal is built'));
const DS = { menuPanelColor: '#112233', menuPanelColor2: '#223344', menuMainColor: '#ff3366', menuTextColor: '#f0f0f0', menuTextColor2: '#99aabb',
    menuBg: 'https://www.legendmod.ml/img/Legend.png?token=SECRET123&w=64#frag', menuOpacity: 0.9, menuBtnTextColor: '#ffffff',
    btn1Color: '#3355ff', btn2Color: '#33aaff', btn3Color: '#aa33ff', btn4Color: '#ff33aa', btn1Color2: '#2244ee', btn2Color2: '#2299ee', btn3Color2: '#9922ee', btn4Color2: '#ee2299',
    hudMainColor: '#33ff99', hudColor: 'rgba(10,20,30,0.5)', hudTextColor: '#fafafa', hudFontFamily: 'Ubuntu', hudFontWeight: 700, hudScale: 1.1 };
function senderUrl(url, lang) {
    const ctx = { location: { href: 'https://agar.io/', origin: 'https://agar.io', protocol: 'https:' }, URL, JSON,
        btoa: s => Buffer.from(s, 'latin1').toString('base64'), localStorage: { getItem: () => String(lang || 1) },
        defaultSettings: DS, $: () => ({ val: () => '' }), document: { addEventListener: () => { } },
        getComputedStyle: () => ({ getPropertyValue: k => (k === '--lm-radius' ? '9px' : k === '--lm-radius-s' ? '3px' : '') }),
        setTimeout, clearTimeout };
    ctx.window = ctx; ctx.addEventListener = () => { };
    vm.createContext(ctx); vm.runInContext(block, ctx);
    return ctx.lmThemeUrl(url);
}

/* reads the computed styles of a page (or a frame's document): runs inside the browser */
const READ = `function lmRead(doc) {
    var w = doc.defaultView, de = doc.documentElement, b = doc.body, cs = w.getComputedStyle(b), rs = w.getComputedStyle(de);
    var btn = doc.getElementById('lm-probe-btn'), inp = doc.getElementById('lm-probe-in');
    if (!btn) { btn = doc.createElement('button'); btn.id = 'lm-probe-btn'; btn.textContent = 'x'; b.appendChild(btn); }
    if (!inp) { inp = doc.createElement('input'); inp.type = 'text'; inp.id = 'lm-probe-in'; b.appendChild(inp); }
    var rb = doc.getElementById('lm-bridge-reset'), r = rb && rb.getBoundingClientRect();
    var h = doc.querySelector('h1, h2');
    return { themed: de.classList.contains('lm-themed-root'), classes: de.className, bridgeCss: !!doc.getElementById('lm-bridge-css'),
        bodyBg: cs.backgroundColor, bodyImg: cs.backgroundImage, color: cs.color, heading: h ? w.getComputedStyle(h).color : '',
        mc: rs.getPropertyValue('--lm-mc').trim(), accent: rs.getPropertyValue('--accent').trim(), bodyAccent: w.getComputedStyle(b).getPropertyValue('--accent').trim(),
        hudMc: rs.getPropertyValue('--lm-hud-mc').trim(), hudFont: rs.getPropertyValue('--lm-hud-font').trim(), hudFs: rs.getPropertyValue('--lm-hud-fs').trim(),
        radS: rs.getPropertyValue('--lm-radius-s').trim(), btnRadius: w.getComputedStyle(btn).borderTopLeftRadius, inRadius: w.getComputedStyle(inp).borderTopLeftRadius,
        reset: rb ? { text: rb.textContent, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), vw: w.innerWidth, vh: w.innerHeight,
            pos: w.getComputedStyle(rb).position, radius: w.getComputedStyle(rb).borderTopLeftRadius } : null,
        hash: w.location.hash, href: w.location.href, session: w.sessionStorage.getItem('lmThemeBridge'), off: w.sessionStorage.getItem('lmThemeBridgeOff'),
        lang: de.getAttribute('lang'), scrollY: Math.round(w.scrollY) };
}`;
const wrap = body => '(async () => {\n' + READ + '\nvar sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };\n' +
    'for (var i = 0; i < 80 && document.readyState !== "complete"; i++) await sleep(100);\n' + body + '\n})()';

function run(name, url, probe, secs) {
    const out = path.join(outRoot, 'themepages-' + name);
    fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'probe.js'), wrap(probe));
    const r = spawnSync(process.execPath, [path.join(here, 'smoke.js'), repo, out, String(secs || 3), url], { encoding: 'utf8', timeout: 120000 });
    const text = (r.stdout || '') + (r.stderr || '');
    if (/chrome not found/.test(text)) { console.log('SKIP: ' + text.trim()); process.exit(0); }
    let res = null;
    try { res = JSON.parse(fs.readFileSync(path.join(out, 'result.json'), 'utf8')); } catch (e) { }
    try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
    if (!res || !res.probe || typeof res.probe !== 'object') { check(name + ': the page ran and the probe answered', false, text.slice(-800)); return {}; }
    check(name + ': no page errors', res.errorCount === 0, res.errors);
    console.log('     screenshot: ' + path.join(out, 'shot.png'));
    return res.probe;
}
const rgb = hex => 'rgb(' + [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ') + ')';
const L = 'https://www.legendmod.ml/';

/* ---- direct visits ---- */
/* the home page's purple buttons (the inline Play and extension buttons, the active tab) */
const BTNS = 'var bg = function (sel) { var e = document.querySelector(sel); return e ? getComputedStyle(e).backgroundImage + " | " + getComputedStyle(e).backgroundColor + " | " + getComputedStyle(e).color : ""; };' +
    ' r.btns = { play: bg("a[href=\\"https://expanding.land/\\"][style*=\\"gradient\\"]"), ext: bg(".cta-primary[style]"), tab: bg("#nav a.active, #nav .active") };';
const d1 = run('index-direct', L + 'index.html', 'var r = lmRead(document); ' + BTNS + ' return r;');
check('index direct: the website design (no theme class, no bridge stylesheet, no button)', d1.themed === false && !d1.bridgeCss && !d1.reset && d1.session === null, d1);
check('index direct: its own colours', d1.bodyBg && d1.bodyBg !== rgb(DS.menuPanelColor) && d1.bodyAccent && d1.bodyAccent !== DS.menuMainColor, d1);
const f1 = run('faq-direct', L + 'faq.html', 'return lmRead(document);');
check('faq direct: the website design', f1.themed === false && !f1.bridgeCss && !f1.reset && f1.bodyBg !== rgb(DS.menuPanelColor), f1);

/* ---- index.html from the game, with a hash tab ---- */
const idxUrl = senderUrl(L + 'index.html#Changelog');
check('sender: index link keeps #Changelog first', /index\.html#Changelog&lm=[A-Za-z0-9_-]+$/.test(idxUrl), idxUrl);
const t1 = run('index-themed', idxUrl, 'await sleep(600); var r = lmRead(document); r.tab = (document.querySelector("#nav a.active, #nav .active a, #nav li.active a") || {}).name || ""; ' + BTNS + ' return r;');
check('index themed: html.lm-themed-root and the bridge stylesheet', t1.themed === true && t1.bridgeCss === true && /lm-radius-set/.test(t1.classes) && /lm-bg-set/.test(t1.classes), t1);
check('index themed: page background = panel colour, accent = main colour', t1.bodyBg === rgb(DS.menuPanelColor) && t1.bodyAccent === DS.menuMainColor, t1);
check('index themed: the menu background image, without the query token', /img\/Legend\.png\?w=64/.test(t1.bodyImg) && !/SECRET|token|frag/.test(t1.bodyImg + t1.href + (t1.session || '')), t1.bodyImg);
check('index themed: the theme is taken out of the address, #Changelog stays', t1.hash === '#Changelog' && !/lm=/.test(t1.href), t1.href);
check('index themed: buttons and fields use the small corner (3px)', t1.radS === '3px' && t1.btnRadius === '3px' && t1.inRadius === '3px', t1);
const P = 'rgb(124, 58, 237)', B1 = rgb(DS.btn1Color), BT = rgb(DS.menuBtnTextColor), db = d1.btns || {}, tb = t1.btns || {};
check('index direct: the purple buttons stay purple', ['play', 'ext'].every(k => (db[k] || '').indexOf(P) >= 0), db);
check('index themed: Play and extension buttons and the active tab in the first button colour, no purple left', ['play', 'ext', 'tab'].every(k => (tb[k] || '').indexOf(B1) >= 0 && (tb[k] || '').indexOf(P) < 0 && (tb[k] || '').split(' | ')[2] === BT), tb);
check('index themed: HUD palette and font reach the page', t1.hudMc === DS.hudMainColor && t1.hudFont === 'Ubuntu' && t1.hudFs === '22px', t1);
check('index themed: the Restore website theme button, small, bottom left, on screen', !!t1.reset && t1.reset.pos === 'fixed' && t1.reset.x < 40 && t1.reset.y + t1.reset.h <= t1.reset.vh &&
    t1.reset.y > t1.reset.vh - 60 && t1.reset.h < 40 && t1.reset.w < 260 && t1.reset.radius === '3px' && t1.reset.text === 'Restore website theme', t1.reset);

/* ---- Restore website theme ---- */
const r1 = run('index-reset', senderUrl(L + 'index.html'), 'document.getElementById("lm-bridge-reset").click(); await sleep(900); return lmRead(document);');
check('reset: the theme class, stylesheet and button are gone', r1.themed === false && !r1.bridgeCss && !r1.reset && !/lm-radius-set|lm-bg-set/.test(r1.classes), r1);
check('reset: the computed styles are the direct visit\'s', r1.bodyBg === d1.bodyBg && r1.bodyAccent === d1.bodyAccent && r1.bodyImg === d1.bodyImg && r1.btnRadius === d1.btnRadius && r1.color === d1.color, { reset: r1, direct: d1 });
check('reset: the tab forgets the theme', r1.session === null && r1.off === '1', r1);

/* ---- faq.html in site mode, Greek ---- */
const t2 = run('faq-themed-el', senderUrl(L + 'faq.html', 2), 'await sleep(800); return lmRead(document);');
check('faq themed: panel colour, accent and image', t2.themed && t2.bodyBg === rgb(DS.menuPanelColor) && t2.bodyAccent === DS.menuMainColor && /img\/Legend\.png\?w=64/.test(t2.bodyImg), t2);
check('faq themed: plain button and field use the small corner', t2.btnRadius === '3px' && t2.inRadius === '3px', t2);
check('faq themed: the language comes with the theme and the button is translated', t2.lang === 'el' && t2.reset && t2.reset.text === '\u0395\u03c0\u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac \u03b8\u03ad\u03bc\u03b1\u03c4\u03bf\u03c2 \u03b9\u03c3\u03c4\u03bf\u03c4\u03cc\u03c0\u03bf\u03c5', t2.reset);
check('faq themed: the address has no theme left', t2.hash === '' && !/lm=/.test(t2.href), t2.href);

/* ---- changelog.html (full stylesheet) with a real anchor ---- */
const ids = (fs.readFileSync(path.join(repo, 'changelog.html'), 'utf8').match(/ id="v\d+"/g) || []).map(s => s.slice(5, -1));
const anchor = ids[Math.floor(ids.length / 2)];
const t3 = run('changelog-anchor', senderUrl(L + 'changelog.html#' + anchor), 'await sleep(500); var el = document.getElementById(' + JSON.stringify(anchor) + '); var top = el ? Math.round(el.getBoundingClientRect().top) : null;' +
    ' var atEnd = Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 1; var r = lmRead(document); r.anchorTop = top; r.atEnd = atEnd; return r;');
check('changelog: #' + anchor + ' is back in the address', t3.hash === '#' + anchor && !/lm=/.test(t3.href), t3.href);
check('changelog: the page is scrolled to the anchor', t3.scrollY > 0 && t3.anchorTop !== null && (Math.abs(t3.anchorTop) <= 2 || (t3.atEnd && t3.anchorTop > 0)), { scrollY: t3.scrollY, top: t3.anchorTop, atEnd: t3.atEnd });
check('changelog: full stylesheet, heading = main colour, small corners', t3.themed && t3.bodyBg === rgb(DS.menuPanelColor) && t3.heading === rgb(DS.menuMainColor) && t3.btnRadius === '3px' && t3.inRadius === '3px', t3);

/* ---- privacy.html / terms.html: plain pages without colour variables (in site mode their dark text stayed on the
 * theme's background image); the old LMexpress/privacy.html forwards to privacy.html#extension with the theme ---- */
const back = 'var a = document.querySelector("[data-i18n$=\\".backToExpandingLand\\"]"); r.back = a ? a.href : null;';
['privacy', 'terms'].forEach((pg) => {
    const p = run(pg + '-themed', senderUrl(L + pg + '.html', 2), 'await sleep(600); var r = lmRead(document); ' + back + ' return r;');
    check(pg + ' themed: theme background, text and heading colours', p.themed && p.bodyBg === rgb(DS.menuPanelColor) && p.color === rgb(DS.menuTextColor) && p.heading === rgb(DS.menuMainColor), p);
    check(pg + ': "Back to Expanding Land" goes to expanding.land', p.back === 'https://expanding.land/', p.back);
});
const pv = run('privacy-moved', senderUrl(L + 'LMexpress/privacy.html', 2), 'await sleep(900); var r = lmRead(document); var e = document.getElementById("extension");' +
    ' r.extTop = e ? Math.round(e.getBoundingClientRect().top) : null; return r;');
check('LMexpress/privacy.html: forwarded to privacy.html#extension with the language and theme', /\/privacy\.html#extension$/.test(pv.href || '') && pv.lang === 'el' && pv.themed &&
    pv.bodyBg === rgb(DS.menuPanelColor) && pv.scrollY > 0 && Math.abs(pv.extTop) <= 2, { href: pv.href, lang: pv.lang, themed: pv.themed, scrollY: pv.scrollY, extTop: pv.extTop });

/* ---- companion.html (OBS overlay of the HUD): its boxes take the HUD palette and font, an accent in the link
 * and the transparent background stay (until 3.697 the boxes took the menu palette) ---- */
const comp = 'await sleep(600); var r = lmRead(document); var w = document.querySelector(".w"), h = document.querySelector(".w .lbl");' +
    ' if (w) { var c = getComputedStyle(w); r.box = { bg: c.backgroundColor, color: c.color, font: c.fontFamily, top: c.borderTopColor }; } r.lbl = h ? getComputedStyle(h).color : ""; return r;';
const c1 = run('companion-themed', senderUrl(L + 'companion.html?w=card,mass'), comp);
const cb = c1.box || {};
check('companion themed: the boxes in the HUD colours, accent and font', cb.bg === 'rgba(10, 20, 30, 0.5)' && cb.color === rgb(DS.hudTextColor) && cb.top === rgb(DS.hudMainColor) && /^"?Ubuntu"?$/.test(cb.font || ''), c1.box);
const c2 = run('companion-obs', senderUrl(L + 'companion.html?w=mass&accent=%23ff0000&bg=transparent'), comp);
check('companion with accent and transparent background in the link: both kept', (c2.box || {}).top === 'rgb(255, 0, 0)' && c2.bodyBg === 'rgba(0, 0, 0, 0)', { box: c2.box, bodyBg: c2.bodyBg });

/* ---- embedded pages: ready handshake and live update (the sender block runs in the host page) ---- */
const host = 'window.defaultSettings = ' + JSON.stringify(DS) + '; window.$ = function () { return { val: function () { return ""; } }; };\n' +
    '(0, eval)(' + JSON.stringify(block) + ');\n' +
    'var out = { httpLink: lmThemeUrl("http://www.legendmod.ml/faq.html"), otherSite: lmThemeUrl("https://example.com/"), bg: lmThemeData().bg };\n' +
    'async function frame(src) { sessionStorage.clear(); var f = document.createElement("iframe"); f.src = src; f.style.cssText = "width:760px;height:380px;border:0;display:block"; document.body.appendChild(f);\n' +
    '  for (var i = 0; i < 80; i++) { await sleep(100); try { if (f.contentDocument && f.contentDocument.documentElement.classList.contains("lm-themed-root") && f.contentDocument.readyState === "complete") break; } catch (e) { } }\n' +
    '  await sleep(300); return f; }\n' +
    'var v = await frame("https://www.legendmod.ml/developers/videoskins.html"); out.vHand = lmRead(v.contentDocument);\n' +
    'var q = await frame("https://www.legendmod.ml/faq.html"); out.qHand = lmRead(q.contentDocument);\n' +
    'defaultSettings.menuMainColor = "#00ccff"; defaultSettings.menuPanelColor = "#331100"; lmThemeChanged(); lmThemeChanged(); await sleep(700);\n' +
    'out.vLive = lmRead(v.contentDocument); out.qLive = lmRead(q.contentDocument); out.peers = _lmThemePeers.length;\n' +
    'document.body.style.background = "#222"; return out;';
const e1 = run('embedded', L + '404.html', host, 2);
check('sender in the browser: http Legend link and other sites not decorated', e1.httpLink === 'http://www.legendmod.ml/faq.html' && e1.otherSite === 'https://example.com/', e1);
check('sender in the browser: the query token and fragment are stripped', e1.bg === 'https://www.legendmod.ml/img/Legend.png?w=64', e1.bg);
const vh = e1.vHand || {}, qh = e1.qHand || {};
check('embedded videoskins: themed by the handshake (no #lm in its address)', vh.themed && !/lm=/.test(vh.href || 'lm=') && vh.bodyBg === rgb(DS.menuPanelColor) && vh.heading === rgb(DS.menuMainColor), vh);
check('embedded faq: themed by the handshake', qh.themed && qh.bodyBg === rgb(DS.menuPanelColor) && qh.bodyAccent === DS.menuMainColor, qh);
check('embedded: no Restore button inside the game window', vh.reset === null && qh.reset === null, [vh.reset, qh.reset]);
check('embedded: both frames are registered peers', e1.peers === 2, e1.peers);
const vl = e1.vLive || {}, ql = e1.qLive || {};
check('live update: a theme change reaches open frames without reload (computed colours)', vl.heading === rgb('#00ccff') && vl.bodyBg === rgb('#331100') && ql.bodyAccent === '#00ccff' && ql.bodyBg === rgb('#331100'), { vl, ql });

console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
