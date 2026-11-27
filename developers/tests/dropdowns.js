/* Dropdown lists on the Legend pages that take a Legend Mod theme (lib/lm-theme-bridge.js), in a real
 * browser: the opened list of every select (its options and groups) has fixed readable colours, dark
 * text on a light background, whatever the theme. Chrome draws a select's open list from the
 * option's computed background and colour; an option without its own background shows the select's
 * background, laid over white when it is see-through. The old bridge gave selects a 25% black
 * background and the theme's text colour, so on the skins page the list was a grey box with light
 * grey text. Each case: a page (full or site stylesheet) with a dark, a light (the Agar.io preset)
 * or a grey theme; every select on it, the language list included, plus a .form-control select and
 * a plain one with a group and a disabled choice. Contrast >= 4.5 (WCAG AA) for every choice.
 * The closed list too: its shown choice on its own background (over the page behind it) >= 4.5, in
 * every case and on a direct visit of the home page in its dark theme, where normalize.css gave the
 * language list the page's white text on the browser's white field (the chosen language was invisible).
 * Fields and hints in the theme too: a field's text (>= 4.5) and its placeholder (>= 3, as hint text) on
 * the field, laid over the page behind, with every theme.
 * node developers/tests/dropdowns.js   (needs Chrome, like smoke.js; prints SKIP without it) */
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const here = __dirname, repo = path.resolve(here, '..', '..'), outRoot = path.join(here, 'out');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (!ok && info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); if (!ok) failed++; };

/* the theme the game sends (LMexpress.js lmThemeData: short keys) */
const theme = (pc, pc2, mc, tc, tc2) => ({ pc, pc2, mc, tc, tc2, btc: '#ffffff', b1: '#3355ff', b2: '#33aaff', b3: '#aa33ff', b4: '#ff33aa',
    b1b: '#2244ee', b2b: '#2299ee', b3b: '#9922ee', b4b: '#ee2299', op: '0.96', rad: '6' });
const THEMES = {
    dark: theme('#112233', '#223344', '#ff3366', '#f0f0f0', '#99aabb'),
    /* the light 'Agar.io' preset of the Theme tab */
    light: theme('#ffffff', '#cccccc', '#5bc0de', '#333333', '#999999'),
    /* grey panels with light grey text: the owner's screenshot */
    grey: theme('#7a7a7a', '#8a8a8a', '#01d9cc', '#d8d8d8', '#bbbbbb')
};
const enc = o => Buffer.from(JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const PROBE = `(async () => {
var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
for (var i = 0; i < 80 && document.readyState !== "complete"; i++) await sleep(100);
await sleep(500);
var parse = function (s) { var m = /rgba?\\(([^)]+)\\)/.exec(s || ''); if (!m) return [0, 0, 0, 0]; var p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
var over = function (top, under) { var a = top[3]; return [0, 1, 2].map(function (k) { return top[k] * a + under[k] * (1 - a); }).concat([1]); };
var lum = function (c) { return [0, 1, 2].map(function (k) { var v = c[k] / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (s, v, k) { return s + v * [0.2126, 0.7152, 0.0722][k]; }, 0); };
var ratio = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
var add = function (cls) { var s = document.createElement('select'); if (cls) s.className = cls; s.setAttribute('data-probe', '1'); s.innerHTML = '<optgroup label="Group"><option>One</option><option disabled>Two</option></optgroup><option selected>Three</option>'; document.body.appendChild(s); return s; };
add('form-control'); add('');
var rows = [];
[].forEach.call(document.querySelectorAll('select'), function (sel, n) {
    var sbg = over(parse(getComputedStyle(sel).backgroundColor), [255, 255, 255, 1]);
    [].forEach.call(sel.querySelectorAll('option, optgroup'), function (o, j) {
        if (j > 3) return;
        var cs = getComputedStyle(o), bg = over(parse(cs.backgroundColor), sbg), fg = over(parse(cs.color), bg);
        rows.push({ sel: (sel.id || sel.className || 'select') + '#' + n, el: o.tagName.toLowerCase() + (o.disabled ? ':disabled' : '') + (o.selected ? ':checked' : ''),
            bg: cs.backgroundColor, color: cs.color, ratio: Math.round(ratio(bg, fg) * 100) / 100 });
    });
});
/* closed lists, fields and hints: the colours through a canvas (oklch, color-mix ...), backgrounds laid over the page behind */
var cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
var rgb = function (s) { cv.clearRect(0, 0, 1, 1); cv.fillStyle = 'rgba(0,0,0,0)'; cv.fillStyle = s; cv.fillRect(0, 0, 1, 1); var d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
var under = function (el) { var layers = []; for (var e = el; e; e = e.parentElement) { var c = rgb(getComputedStyle(e).backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] >= 1) break; }
    var bg = [255, 255, 255, 1]; for (var i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg); return bg; };
/* a site page (index, faq ...: data-lm-css="site") styles its own fields, the bridge only its colours: there
 * the page's own lists and fields are measured, not the ones added here */
var site = !!document.querySelector('script[data-lm-css="site"]');
var closed = [];
[].forEach.call(document.querySelectorAll('select'), function (sel, n) {
    var r = sel.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || (site && sel.hasAttribute('data-probe'))) return;
    var bg = under(sel), fg = over(rgb(getComputedStyle(sel).color), bg);
    closed.push({ sel: (sel.id || sel.className || 'select') + '#' + n, color: getComputedStyle(sel).color, bg: getComputedStyle(sel).backgroundColor, ratio: Math.round(ratio(bg, fg) * 100) / 100 });
});
/* a text field with a hint, on the page and on a white card (the monitor's login is one) */
var hints = [];
if (!site) {
var card = document.createElement('div'); card.style.cssText = 'background:#fff;padding:8px'; card.innerHTML = '<input type="text" placeholder="Hint">';
document.body.appendChild(card);
var tf = document.createElement('input'); tf.type = 'password'; tf.placeholder = 'Hint'; document.body.appendChild(tf);
hints = [card.firstChild, tf].map(function (f, n) { var bg = under(f);
    return { el: n ? 'page field' : 'white card field', bg: getComputedStyle(f).backgroundColor, text: Math.round(ratio(bg, over(rgb(getComputedStyle(f).color), bg)) * 100) / 100,
        hint: Math.round(ratio(bg, over(rgb(getComputedStyle(f, '::placeholder').color), bg)) * 100) / 100 }; });
}
return { themed: document.documentElement.classList.contains('lm-themed-root'), dark: document.body.classList.contains('dark-theme'), lang: !!document.querySelector('select.lm-lang-select'), site: site, rows: rows, closed: closed, hints: hints };
})()`;

function run(name, url, env) {
    const out = path.join(outRoot, 'dropdowns-' + name);
    fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'probe.js'), PROBE);
    /* third-party stylesheets (Google Fonts, Font Awesome) fail at once, as in themepages.js: they hold
     * the page until they load, from a busy machine over 10 s, and the probe read a page not built yet */
    const r = spawnSync(process.execPath, [path.join(here, 'smoke.js'), repo, out, '3', url], { encoding: 'utf8', timeout: 120000,
        env: Object.assign({}, process.env, { SMOKE_BLOCK: 'fonts.googleapis.com,fonts.gstatic.com,cdnjs.cloudflare.com' }, env || {}) });
    const text = (r.stdout || '') + (r.stderr || '');
    if (/chrome not found/.test(text)) { console.log('SKIP: ' + text.trim()); process.exit(0); }
    let res = null;
    try { res = JSON.parse(fs.readFileSync(path.join(out, 'result.json'), 'utf8')); } catch (e) { }
    try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
    if (!res || !res.probe || !res.probe.rows) { check(name + ': the page ran and the probe answered', false, text.slice(-800)); return null; }
    return res.probe;
}

const L = 'https://www.legendmod.ml/';
/* skins/index.html: the reported page (full stylesheet), with all three themes; then a full and site pages */
const CASES = [['skins', 'skins/index.html', 'dark'], ['skins', 'skins/index.html', 'light'], ['skins', 'skins/index.html', 'grey'],
    ['changelog', 'changelog.html', 'grey'], ['faq', 'faq.html', 'grey'], ['index', 'index.html', 'light'], ['index', 'index.html', 'dark'], ['index', 'index.html', 'grey'],
    ['themes', 'themes/index.html', 'dark']];
for (const [page, rel, t] of CASES) {
    const name = page + '-' + t;
    const p = run(name, L + rel + '#lm=' + enc(THEMES[t]));
    if (!p) continue;
    check(name + ': the theme is applied', p.themed === true, p);
    if (page === 'skins') check(name + ': the language list is there', p.lang === true, p);
    const bad = p.rows.filter(r => r.ratio < 4.5);
    check(name + ': every open dropdown choice is readable (' + p.rows.length + ' choices, contrast >= 4.5)', p.rows.length >= 6 && !bad.length, bad.slice(0, 6));
    const dis = p.rows.filter(r => /:disabled/.test(r.el)), en = p.rows.filter(r => r.el === 'option');
    check(name + ': a disabled choice still looks different from the others', dis.length > 0 && en.length > 0 && dis.every(d => d.color !== en[0].color), { dis: dis[0], en: en[0] });
    const cbad = p.closed.filter(r => r.ratio < 4.5);
    check(name + ': every closed dropdown shows its choice readably (' + p.closed.length + ' lists, contrast >= 4.5)', p.closed.length >= (p.site ? 1 : 2) && !cbad.length, cbad.slice(0, 4));
    const hbad = p.hints.filter(r => r.text < 4.5 || r.hint < 3);
    if (!p.site) check(name + ': a field (contrast >= 4.5) and its hint (>= 3) are readable, also on a white card', p.hints.length === 2 && !hbad.length, hbad);
}

/* the owner's report: the home page in its dark theme (no Legend Mod theme), the chosen language was
 * white text in a white box */
const hd = run('index-direct-dark', L + 'index.html', { SMOKE_STORAGE: JSON.stringify({ theme: 'dark' }) });
if (hd) {
    const lang = hd.closed.filter(r => /^lm-lang-select/.test(r.sel));
    check('index direct dark: the dark theme is on', hd.dark === true && !hd.themed, { dark: hd.dark, themed: hd.themed });
    check('index direct dark: the closed language list is readable (contrast >= 4.5)', lang.length === 1 && lang[0].ratio >= 4.5, lang);
}

/* a direct visit (no theme): the page's own grey text reached the language list (themes page), shown on
 * the browser's white list; the language list's own style (developers/i18n/runtime.js) keeps it readable */
const dv = run('themes-direct', L + 'themes/index.html');
if (dv) {
    const lang = dv.rows.filter(r => /^lm-lang-select/.test(r.sel)), bad = lang.filter(r => r.ratio < 4.5);
    check('themes direct: the language list is readable (' + lang.length + ' choices, contrast >= 4.5)', !dv.themed && lang.length >= 4 && !bad.length, bad.slice(0, 4));
}

console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
