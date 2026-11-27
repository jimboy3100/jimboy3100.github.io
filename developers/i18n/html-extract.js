#!/usr/bin/env node
/*
 * Moves the texts of a web page into the language packs: marks every text of <body> with
 * data-i18n / data-i18n-html / data-i18n-<attribute> and adds its English to developers/i18n/src.
 *
 *   node developers/i18n/html-extract.js <page.html> [--area site-<page>] [--dry]
 *
 * - an element whose content is text and inline tags only (b, a, span, br, code...) gets
 *   data-i18n="key" (plain text) or data-i18n-html="key" (with its inline tags; translators keep them)
 * - a text next to block elements is wrapped in <span data-i18n="key">
 * - title / placeholder / alt / aria-label / button value get data-i18n-<attribute>="key"
 * - adds <script src="https://www.legendmod.ml/lib/lm-i18n.js" data-areas="site-<page>" charset="utf-8"> before </head>
 *   (nothing else in <head> changes) when the page has none
 * The English stays in the HTML (search engines read it; without JavaScript the page is English).
 * Keys: <prefix>.<first words>; a text that already has a key (same English) reuses it.
 * Texts the scanner would not report (brand names, numbers, code) are left alone. Run it again after
 * editing a page: marked elements are skipped. Then: todo.js, translate, merge.js, build.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const I = require('./lib');
const { textLike, config } = require('./scan');

const args = process.argv.slice(2);
const file = args.find((a) => a.indexOf('--') !== 0 && /\.html?$/i.test(a));
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
if (!file) { console.error('usage: node html-extract.js <page.html> [--area site-<page>] [--dry]'); process.exit(1); }
/* index.html -> index, nicks/index.html -> nicks, skins/skins3.html -> skins-skins3 */
const relPage = path.relative(I.ROOT, path.resolve(I.ROOT, file)).split(path.sep).join('/');
const pageName = relPage.replace(/\.html?$/i, '').replace(/\/index$/i, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'page';
/* one area (src file, language file) per page: stage-2 pages never touch each other's files */
const area = opt('--area', 'site-' + pageName);
const prefix = I.areaPrefix(area).replace(/\.$/, '');
const dry = args.indexOf('--dry') >= 0;

const abs = path.resolve(I.ROOT, file);
const orig = fs.readFileSync(abs, 'utf8');
const crlf = /\r\n/.test(orig);
const html = orig.replace(/\r\n/g, '\n');

/* ---------- a small HTML tree with source positions ---------- */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const INLINE = new Set(['a', 'b', 'strong', 'i', 'em', 'span', 'small', 'code', 'kbd', 'br', 'sup', 'sub', 'u', 'mark', 'abbr', 'time', 's', 'img', 'bdi', 'q', 'cite', 'var', 'wbr', 'del', 'ins']);
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'textarea', 'pre', 'select', 'canvas', 'iframe', 'video', 'audio', 'math']);
function parse(src) {
    const root = { tag: '#root', children: [], attrs: {} };
    const stack = [root];
    const re = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
    let last = 0, m;
    const top = () => stack[stack.length - 1];
    while ((m = re.exec(src))) {
        if (m.index > last) top().children.push({ text: src.slice(last, m.index), start: last, end: m.index });
        last = re.lastIndex;
        if (m[0].indexOf('<!') === 0) continue;
        const tag = m[2].toLowerCase();
        if (m[1]) {
            for (let k = stack.length - 1; k > 0; k--) if (stack[k].tag === tag) { stack[k].closeStart = m.index; stack.length = k; break; }
            continue;
        }
        const attrs = {};
        const ar = /\s([^\s=>\/]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        let am;
        while ((am = ar.exec(m[3] || ''))) attrs[am[1].toLowerCase()] = am[3] != null ? am[3] : am[4] != null ? am[4] : (am[5] != null ? am[5] : '');
        const el = { tag, attrs, openStart: m.index, nameEnd: m.index + 1 + m[2].length, openEnd: re.lastIndex, children: [], parent: top() };
        top().children.push(el);
        if (tag === 'script' || tag === 'style' || tag === 'textarea') {
            const endRe = new RegExp('</' + tag + '\\s*>', 'ig');
            endRe.lastIndex = re.lastIndex;
            const e = endRe.exec(src);
            el.closeStart = e ? e.index : src.length;
            re.lastIndex = last = e ? e.index + e[0].length : src.length;
            continue;
        }
        if (!VOID.has(tag) && !m[4]) stack.push(el);
    }
    if (last < src.length) top().children.push({ text: src.slice(last), start: last, end: src.length });
    return root;
}

/* ---------- keys ---------- */
const all = I.readAll();
const byEnglish = {};
/* only keys the page loads: the shared site texts (site.json) and its own area */
Object.keys(all).forEach((a) => { if (a === 'site' || a === area) Object.keys(all[a]).forEach((k) => { if (!byEnglish[all[a][k].en]) byEnglish[all[a][k].en] = k; }); });
const data = all[area] || {};
const used = new Set();
Object.keys(all).forEach((a) => Object.keys(all[a]).forEach((k) => used.add(k)));
const added = {};
function keyFor(en) {
    if (byEnglish[en]) return byEnglish[en];
    let k = prefix + '.' + I.slug(en.replace(/<[^>]*>/g, ' ').replace(/^[^A-Za-z]+/, ''), 'text');
    if (used.has(k)) { let i = 2; while (used.has(k + i)) i++; k += i; }
    used.add(k);
    byEnglish[en] = k;
    data[k] = { en };
    added[k] = en;
    return k;
}

const allow = ((config.allow && config.allow['*']) || []).concat((config.allow && config.allow[path.relative(I.ROOT, abs).split(path.sep).join('/')]) || [])
    .map((x) => (x[0] === '/' ? new RegExp(x.slice(1, x.lastIndexOf('/')), x.slice(x.lastIndexOf('/') + 1)) : x));
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, '&');
const squash = (s) => s.replace(/\s+/g, ' ').trim();
function wanted(text) {
    const x = textLike(text);
    if (!x) return false;
    return !allow.some((a) => (typeof a === 'string' ? a === x : a.test(x)));
}

/* ---------- decide ---------- */
const edits = []; /* { at, insert } */
/* data-i18n-off="why": kept in one language on purpose (release notes from the git history), as scan.js reads it */
const marked = (el) => Object.keys(el.attrs).some((a) => a === 'data-i18n' || a === 'data-i18n-html' || a === 'data-i18n-off');
function inlineOnly(el) {
    return el.children.every((c) => c.text != null || (INLINE.has(c.tag) && !marked(c) && inlineOnly(c)));
}
function plainText(el) {
    return el.children.map((c) => (c.text != null ? c.text : (c.tag === 'br' ? ' ' : plainText(c)))).join('');
}
function addAttr(el, name, key) {
    edits.push({ at: el.nameEnd, insert: ' ' + name + '="' + key + '"' });
}
let counts = { text: 0, html: 0, wrap: 0, attr: 0 };
function attrs(el) {
    ['title', 'placeholder', 'alt', 'aria-label', 'value', 'data-original-title'].forEach((a) => {
        const v = el.attrs[a];
        if (v == null || el.attrs['data-i18n-' + a] != null || el.attrs['data-i18n-off'] != null) return;
        if (a === 'value' && !/^(button|submit|reset)$/i.test(el.attrs.type || '')) return;
        const t = squash(decode(v));
        if (!wanted(t)) return;
        addAttr(el, 'data-i18n-' + a, keyFor(t));
        counts.attr++;
    });
}
function visit(el, inHead) {
    if (el.tag === 'head') inHead = true;
    if (SKIP.has(el.tag)) return;
    if (!inHead && el.tag !== '#root') attrs(el);
    if (inHead || marked(el)) { if (!marked(el)) el.children.forEach((c) => { if (c.tag) visit(c, inHead); }); return; }
    const hasEl = el.children.some((c) => c.tag);
    if (el.tag !== '#root' && el.tag !== 'html' && el.tag !== 'body' && el.closeStart != null && inlineOnly(el) && wanted(squash(decode(plainText(el)))) &&
        (!hasEl || el.children.some((c) => c.text != null && wanted(squash(decode(c.text)))))) {
        if (!hasEl) {
            addAttr(el, 'data-i18n', keyFor(squash(decode(plainText(el)))));
            counts.text++;
        } else {
            const inner = squash(html.slice(el.openEnd, el.closeStart));
            addAttr(el, 'data-i18n-html', keyFor(inner));
            counts.html++;
            /* attributes of the inline children stay English inside the HTML text: mark none */
        }
        return;
    }
    el.children.forEach((c) => {
        if (c.tag) { visit(c, inHead); return; }
        if (el.tag === '#root' || el.tag === 'html' || inHead) return;
        const t = squash(decode(c.text));
        if (!wanted(t)) return;
        const lead = c.text.length - c.text.replace(/^\s+/, '').length;
        const trail = c.text.length - c.text.replace(/\s+$/, '').length;
        edits.push({ at: c.start + lead, insert: '<span data-i18n="' + keyFor(t) + '">' });
        edits.push({ at: c.end - trail, insert: '</span>', after: true });
        counts.wrap++;
    });
}
const tree = parse(html);
visit(tree, false);

/* the page loader, once, at the end of <head> */
let out = html;
if (!/lib\/lm-i18n\.js/.test(html)) {
    const h = html.search(/<\/head\s*>/i);
    if (h >= 0) edits.push({ at: h, insert: '    <!-- texts in the visitor\'s language (Legend Mod\'s language packs, developers/i18n) -->\n    <script src="https://www.legendmod.ml/lib/lm-i18n.js" data-areas="' + area + '" charset="utf-8"></script>\n' });
} else if (!new RegExp('data-areas="[^"]*\\b' + area + '\\b').test(html)) {
    console.log('note: the page loads lib/lm-i18n.js already: make sure its data-areas names ' + area);
}
edits.sort((a, b) => b.at - a.at || (a.after ? -1 : 1));
edits.forEach((e) => { out = out.slice(0, e.at) + e.insert + out.slice(e.at); });

console.log(file + ': ' + JSON.stringify(counts) + ', ' + Object.keys(added).length + ' new keys in ' + area + '.json');
if (!dry) {
    fs.writeFileSync(abs, crlf ? out.replace(/\n/g, '\r\n') : out);
    all[area] = data;
    I.writeArea(area, data);
}
