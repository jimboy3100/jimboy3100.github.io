#!/usr/bin/env node
/*
 * Hard-coded text scanner: finds texts a player can see that are written in a file instead of coming
 * from the language packs (developers/i18n/src).
 *
 *   node developers/i18n/scan.js <file>...            findings of these files (path:line  kind  text)
 *   node developers/i18n/scan.js --strict <file>...   the same, exit 1 when there is any finding
 *   node developers/i18n/scan.js --report             counts for every file of the stage-2 groups
 *   node developers/i18n/scan.js --json <file>...     findings as JSON
 *
 * JavaScript: string literals that end up on screen: arguments of toastr.*, alert/confirm/prompt,
 * .text/.html/.append/.prepend/.after/.before/.attr('title'|'placeholder'...), assignments to
 * innerHTML/textContent/innerText/title/placeholder, UI object fields (label:, title:, text:, desc:,
 * tooltip:, placeholder:, message:, hint:), and any literal holding HTML with text in it.
 * Calls of the translation functions (lmT, _lmTH, ...) are fine; their key must exist in the packs
 * (kind "key": a key the packs do not have, e.g. lmT('x', 'English') whose English is the fallback).
 * HTML: text between tags and title/placeholder/alt/aria-label/value attributes, outside <head>,
 * <script> (scanned as JavaScript) and <style>, unless the element carries data-i18n / data-i18n-html /
 * data-i18n-<attribute>.
 * Not reported: console.*, throw, lines (or the line after a comment line) containing "i18n-ok"
 * (write why: e.g. // i18n-ok: chat command sent to teammates), and the allowlist in
 * developers/i18n/scan-config.json ("allow": { "<file>" or "*": ["exact text", "/regex/"] }).
 * Heuristic by design: a finding may be a false positive (allowlist it); a text built from pieces
 * may be missed.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const I = require('./lib');

const CONFIG_FILE = path.join(__dirname, 'scan-config.json');
const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) : {};
const KEY_FNS = config.keyFunctions || ['lmT', '_lmTH', '_lmUR', '_lmMT', '_lmMhT', '_lmBdgT', '_lmTx', 'LMi18n.t'];

let knownKeys = null;
function keys() {
    if (knownKeys) return knownKeys;
    knownKeys = new Set();
    const all = I.readAll();
    Object.keys(all).forEach((a) => Object.keys(all[a]).forEach((k) => knownKeys.add(k)));
    return knownKeys;
}

/* ---------- JavaScript tokenizer: string literals with their position ---------- */
const REGEX_BEFORE = /(^|[=(,:\[!&|?{};+\-*%<>~^]|\breturn|\btypeof|\bcase|\bdo|\belse|\bin|\bof|\bvoid|\byield|\bawait)\s*$/;
function jsLiterals(src) {
    const out = [];
    let i = 0;
    const n = src.length;
    let code = ''; /* the code seen so far with strings blanked (for context) */
    const push = (start, end, raw, tpl) => {
        out.push({ start, end, raw, tpl, ctx: code.slice(-240) });
        code += tpl ? '`S`' : '"S"';
    };
    while (i < n) {
        const c = src[i];
        const d = src[i + 1];
        if (c === '/' && d === '/') { const e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
        if (c === '/' && d === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; code += ' '; continue; }
        if (c === '"' || c === "'") {
            let j = i + 1;
            while (j < n && src[j] !== c && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
            push(i, j + 1, src.slice(i + 1, j), false);
            i = j + 1;
            continue;
        }
        if (c === '`') {
            /* template: ${...} parts become a mark; nested templates inside are skipped over */
            let j = i + 1, raw = '';
            while (j < n && src[j] !== '`') {
                if (src[j] === '\\') { raw += src[j] + (src[j + 1] || ''); j += 2; continue; }
                if (src[j] === '$' && src[j + 1] === '{') {
                    let depth = 1; j += 2;
                    while (j < n && depth) {
                        const ch = src[j];
                        if (ch === '{') depth++;
                        else if (ch === '}') depth--;
                        else if (ch === '"' || ch === "'") { const q = ch; j++; while (j < n && src[j] !== q && src[j] !== '\n') { if (src[j] === '\\') j++; j++; } }
                        else if (ch === '`') { j++; while (j < n && src[j] !== '`') { if (src[j] === '\\') j++; j++; } }
                        j++;
                    }
                    raw += '\u0001';
                    continue;
                }
                raw += src[j];
                j++;
            }
            push(i, j + 1, raw, true);
            i = j + 1;
            continue;
        }
        if (c === '/' && REGEX_BEFORE.test(code)) {
            let j = i + 1, cls = false;
            while (j < n && src[j] !== '\n') {
                if (src[j] === '\\') { j += 2; continue; }
                if (src[j] === '[') cls = true;
                else if (src[j] === ']') cls = false;
                else if (src[j] === '/' && !cls) break;
                j++;
            }
            if (src[j] === '/') {
                j++;
                while (j < n && /[a-z]/i.test(src[j])) j++;
                code += '/R/';
                i = j;
                continue;
            }
        }
        code += c;
        if (code.length > 4000) code = code.slice(-2000);
        i++;
    }
    return out;
}

/* ---------- what counts as text ---------- */
const BRAND = /^(Legend Mod|Legend|LM|LM Express|agar\.io|Agar\.io|Expanding Land|Discord|YouTube|Youtube|GitHub|Twitch|Facebook|Google|Imsolo|Delta|FPS|WebGL|WebGL2|Canvas2D|OK|PNG|JSON|CSV|URL|HUD|ID|IP|PvP|FFA|x\d+|v\d[\d.]*)$/;
function decode(s) {
    return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#\d+;|&#x[0-9a-f]+;|&[a-z]+;/gi, ' ');
}
function textLike(s) {
    s = decode(String(s)).replace(/\u0001/g, ' ').replace(/\\[nrt]/g, ' ').trim();
    if (s.length < 2) return null;
    if (!/[A-Za-z]{2}/.test(s)) return null;
    if (/^(https?:|data:|mailto:|javascript:|wss?:|\/\/|\.\/|\/)/i.test(s)) return null;
    if (/^[#.\[][\w\-\[\]="'.#: >*]+$/.test(s)) return null;                     /* selectors */
    if (/^[#.]/.test(s) && s.split(',').every((p) => /^\s*[#.]?[\w\-.#:>\s\[\]="'*]*$/.test(p) && (/[#.]/.test(p) || !p.trim()))) return null; /* selector lists */
    if (/^[\w\-]+\s*:\s*[^:]+;?(\s*[\w\-]+\s*:\s*[^:;]+;?)*$/.test(s) && /;|px|%|#|rgb|!important/.test(s)) return null; /* css */
    if (/^[\w\-./]+\.(js|css|png|jpe?g|gif|svg|webp|mp3|mp4|wav|ogg|json|html?|ico|woff2?)(\?.*)?$/i.test(s)) return null;
    if (/^[a-z0-9_$\-.]+$/.test(s)) return null;                                  /* identifiers, keys, lower-case tokens */
    if (/^[A-Z0-9_]+$/.test(s) && s.length <= 3) return null;
    if (/^[\w$]+(\.[\w$]+)+$/.test(s)) return null;                               /* a.b.c */
    if (/^(true|false|null|undefined|NaN)$/.test(s)) return null;
    if (BRAND.test(s)) return null;
    if (/\{[^{}]*:[^{}]*\}/.test(s) && /[;{]\s*[\w-]+\s*:/.test(s)) return null;   /* a style sheet */
    if (/^\W*(ms|px|em|fps|kb|mb|gb|x)\W*$/i.test(s)) return null;               /* units */
    if (/^[^A-Za-z]*[A-Za-z]{2}[^A-Za-z]*$/.test(s) && !/^[A-Z][a-z]$/.test(s.replace(/[^A-Za-z]/g, ''))) return null; /* "px", "%s" */
    /* code-ish: function calls, operators */
    if (/^[\w$.]+\(.*\)$/.test(s) && !/\s\w+\s/.test(s)) return null;
    return s.replace(/\s+/g, ' ');
}

/* text nodes and visible attributes of an HTML fragment (string literal or page) */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const ATTRS = ['title', 'placeholder', 'alt', 'aria-label', 'data-original-title', 'value', 'label'];
function htmlParts(html, onText, onAttr, onScript) {
    const re = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
    const stack = [];
    let last = 0, m;
    const translated = () => stack.some((e) => e.i18n);
    const inHead = () => stack.some((e) => e.tag === 'head');
    while ((m = re.exec(html))) {
        const text = html.slice(last, m.index);
        if (text.trim() && !translated() && !inHead()) onText(text, last);
        last = re.lastIndex;
        if (m[0].indexOf('<!') === 0) continue;
        const close = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '';
        if (close) {
            for (let k = stack.length - 1; k >= 0; k--) if (stack[k].tag === tag) { stack.length = k; break; }
            continue;
        }
        const has = (a) => new RegExp('\\s' + a + '\\s*=', 'i').test(attrs);
        const attrRe = /\s([^\s=>\/]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        let am;
        const found = {};
        while ((am = attrRe.exec(attrs))) found[am[1].toLowerCase()] = am[3] != null ? am[3] : am[4] != null ? am[4] : am[5];
        if (!inHead() && !stack.some((e) => e.html)) { /* the attributes inside data-i18n-html are part of its pack text */
            ATTRS.forEach((a) => {
                if (found[a] == null || has('data-i18n-' + a)) return;
                if (a === 'value' && !/^(button|submit|reset)$/i.test(found.type || '')) return;
                if (a === 'data-original-title' && has('data-i18n-title')) return;
                onAttr(a, found[a], m.index);
            });
            Object.keys(found).forEach((a) => {
                if (/^data-i18n/.test(a) && found[a]) onAttr('key', found[a], m.index, true);
            });
        }
        if (tag === 'script' || tag === 'style') {
            const endTag = new RegExp('</' + tag + '\\s*>', 'ig');
            endTag.lastIndex = re.lastIndex;
            const e = endTag.exec(html);
            const body = html.slice(re.lastIndex, e ? e.index : html.length);
            if (tag === 'script' && onScript && !/\bsrc\s*=/.test(attrs) && !/type\s*=\s*["']?(application\/ld\+json|text\/template|text\/html)/i.test(attrs)) onScript(body, re.lastIndex);
            re.lastIndex = last = e ? e.index + e[0].length : html.length;
            continue;
        }
        if (!VOID.has(tag) && !m[4]) stack.push({ tag, i18n: has('data-i18n') || has('data-i18n-html'), html: has('data-i18n-html') });
    }
    const tail = html.slice(last);
    if (tail.trim() && !translated() && !inHead()) onText(tail, last);
}

/* ---------- JavaScript findings ---------- */
const SINK = new RegExp([
    '\\btoastr\\s*(\\.\\s*\\w+|\\[\\s*["\']\\w+["\']\\s*\\])\\s*\\(',
    '\\b(alert|confirm|prompt)\\s*\\(',
    '\\.\\s*(text|html|append|prepend|after|before|replaceWith|tooltip)\\s*\\(',
    '\\.\\s*attr\\s*\\(\\s*["\'](title|placeholder|data-original-title|aria-label|alt|value)["\']\\s*,',
    '\\.\\s*setAttribute\\s*\\(\\s*["\'](title|placeholder|data-original-title|aria-label|alt)["\']\\s*,',
    '\\.\\s*(innerHTML|outerHTML|textContent|innerText|title|placeholder)\\s*\\+?=(?!=)',
    '\\binsertAdjacentHTML\\s*\\(',
    '\\bdocument\\.write(ln)?\\s*\\(',
    '[{,]\\s*["\']?(label|title|text|desc|description|tooltip|placeholder|message|msg|hint|caption|help|note|heading|header|subtitle|name)["\']?\\s*:'
].join('|'));
const NOT_VISIBLE = /\b(console\s*\.\s*\w+|throw\s+new\s+\w+|new\s+Error|\.log|addEventListener|removeEventListener|querySelector(All)?|getElementById|getElementsBy\w+|\$\s*\(\s*$|localStorage\.\w+|sessionStorage\.\w+|require|import|postMessage|setItem|getItem|removeItem|classList\.\w+|\.css|\.on|\.off|\.find|\.is|\.hasClass|\.addClass|\.removeClass|\.toggleClass|\.data|\.prop|\.attr|\.val|\.closest|\.filter|\.children|\.parent|\.trigger|fetch|open|\.send|\.match|\.test|\.replace|\.split|\.indexOf|\.includes|\.startsWith|\.endsWith|RegExp|keyCode|key\s*===?)\s*\(?\s*$/;

function statementCtx(ctx) {
    /* the current statement: after the last ; { } (strings were blanked, so these are code) */
    const k = Math.max(ctx.lastIndexOf(';'), ctx.lastIndexOf('{\n'), ctx.lastIndexOf('}\n'));
    return k >= 0 ? ctx.slice(k + 1) : ctx;
}
function lineOf(src, pos, cache) {
    let lo = 0, hi = cache.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (cache[mid] <= pos) lo = mid; else hi = mid - 1; }
    return lo + 1;
}
function lineStarts(src) {
    const a = [0];
    for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) a.push(i + 1);
    return a;
}
function okLines(src) {
    /* "i18n-ok" on a line: that line; on a comment line of its own: also the next line */
    const set = new Set();
    src.split('\n').forEach((l, i) => {
        if (l.indexOf('i18n-ok') < 0) return;
        set.add(i + 1);
        if (/^\s*(\/\/|\/\*|\*|<!--)/.test(l)) set.add(i + 2);
    });
    return set;
}

function scanJs(src, offset, base, findings) {
    const lits = jsLiterals(src);
    const fnRe = new RegExp('(^|[^\\w$.])(' + KEY_FNS.map((f) => f.replace(/\./g, '\\.')).join('|') + ')\\s*\\(\\s*$');
    const fnArg2 = new RegExp('(^|[^\\w$.])(' + KEY_FNS.map((f) => f.replace(/\./g, '\\.')).join('|') + ')\\s*\\(\\s*"S"\\s*,\\s*$');
    lits.forEach((L) => {
        const ctx = L.ctx;
        const pos = offset + L.start;
        if (fnRe.test(ctx)) {
            if (!L.tpl && /^[A-Za-z][\w.\-]*$/.test(L.raw) && !keys().has(L.raw)) findings.push({ pos, kind: 'key', text: L.raw });
            return;
        }
        if (fnArg2.test(ctx)) return; /* the English fallback of a translation call (its key is checked) */
        const stmt = statementCtx(ctx);
        if (/\b(console\s*\.\s*\w+|throw\b|new\s+Error)\s*\(/.test(stmt) && !SINK.test(stmt.replace(/^[\s\S]*\b(console\s*\.\s*\w+|throw\b|new\s+Error)\s*\(/, ''))) return;
        if (NOT_VISIBLE.test(ctx)) return;
        let raw = L.raw.replace(/\\(["'`\\/])/g, '$1');
        /* a piece inside a tag: '" type="range" min="' */
        if (!/[<>]/.test(raw) && /[\w-]=\s*["']|^\s*["']\s*[\w-]+=/.test(raw)) return;
        if (/<[a-zA-Z!\/]|^[^<>]*["'][^<>]*\/?>|=\s*["']$/.test(raw)) {
            /* HTML in the literal (often a piece of a concatenation): drop a tag cut at either end
             * ('<option value="' + v + '">'), then its text nodes and visible attributes */
            raw = raw.replace(/<[a-zA-Z!\/][^<>]*$/, ' ').replace(/^[^<>]*?["'][^<>]*?>/, ' ').replace(/^[^<>"']*=\s*["'][^<>]*$/, ' ');
            let any = false;
            htmlParts(raw, (t) => { const x = textLike(t); if (x) { findings.push({ pos, kind: 'html', text: x }); any = true; } },
                (a, v, at, isKey) => {
                    if (isKey) { if (!keys().has(v) && /^[A-Za-z][\w.\-]*$/.test(v)) findings.push({ pos, kind: 'key', text: v }); return; }
                    const x = textLike(v); if (x) findings.push({ pos, kind: 'attr', text: a + '="' + x + '"' });
                });
            if (any) return;
            return;
        }
        if (!SINK.test(stmt)) return;
        const x = textLike(raw);
        if (!x) return;
        /* single lower-case words in a sink are usually ids or classes */
        if (!/\s/.test(x) && !/^[A-Z]/.test(x) && !/[.!?:]$/.test(x)) return;
        findings.push({ pos, kind: 'text', text: x });
    });
}

function scanHtml(src, findings) {
    htmlParts(src,
        (t, at) => { const x = textLike(t); if (x) findings.push({ pos: at + (t.length - t.replace(/^\s+/, '').length), kind: 'html', text: x }); },
        (a, v, at, isKey) => {
            if (isKey) { if (!keys().has(v)) findings.push({ pos: at, kind: 'key', text: v }); return; }
            const x = textLike(v); if (x) findings.push({ pos: at, kind: 'attr', text: a + '="' + x + '"' });
        },
        (body, at) => scanJs(body, at, null, findings));
}

function allowList(rel) {
    const a = (config.allow && config.allow['*']) || [];
    const b = (config.allow && config.allow[rel]) || [];
    return a.concat(b).map((x) => (x.length > 2 && x[0] === '/' && x.lastIndexOf('/') > 0 ? new RegExp(x.slice(1, x.lastIndexOf('/')), x.slice(x.lastIndexOf('/') + 1)) : x));
}

function scanFile(file) {
    const abs = path.resolve(I.ROOT, file);
    const rel = path.relative(I.ROOT, abs).split(path.sep).join('/');
    const src = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
    const findings = [];
    if (/\.html?$/i.test(rel)) scanHtml(src, findings);
    else scanJs(src, 0, null, findings);
    const starts = lineStarts(src);
    const ok = okLines(src);
    const allow = allowList(rel);
    const seen = new Set();
    return findings.map((f) => Object.assign(f, { file: rel, line: lineOf(src, f.pos, starts) }))
        .filter((f) => !ok.has(f.line))
        .filter((f) => !allow.some((a) => (typeof a === 'string' ? a === f.text : a.test(f.text))))
        .filter((f) => { const id = f.line + '|' + f.kind + '|' + f.text; if (seen.has(id)) return false; seen.add(id); return true; })
        .map((f) => ({ file: f.file, line: f.line, kind: f.kind, text: f.text }));
}

/* ---------- groups (stage 2's work list) ---------- */
function listFiles(dir, re, deep) {
    const abs = path.join(I.ROOT, dir);
    if (!fs.existsSync(abs)) return [];
    let out = [];
    fs.readdirSync(abs, { withFileTypes: true }).forEach((d) => {
        const rel = (dir ? dir + '/' : '') + d.name;
        if (d.isDirectory()) { if (deep) out = out.concat(listFiles(rel, re, deep)); }
        else if (re.test(d.name)) out.push(rel);
    });
    return out.sort();
}
function groups() {
    const g = config.groups || {};
    const res = {};
    Object.keys(g).forEach((name) => {
        let files = [];
        g[name].forEach((spec) => {
            /* "dir/*.js", "dir/**.html" (recursive) or a file */
            const m = /^(.*?)\/?\*(\*)?(\.[a-z]+)$/.exec(spec);
            if (m) files = files.concat(listFiles(m[1], new RegExp('\\' + m[3] + '$', 'i'), !!m[2]));
            else if (fs.existsSync(path.join(I.ROOT, spec))) files.push(spec);
        });
        const skip = (config.skip || []).map((s) => new RegExp(s));
        res[name] = [...new Set(files)].filter((f) => !skip.some((r) => r.test(f)));
    });
    return res;
}

module.exports = { scanFile, groups, jsLiterals, textLike, config };

if (require.main === module) {
    const args = process.argv.slice(2);
    const strict = args.indexOf('--strict') >= 0;
    const json = args.indexOf('--json') >= 0;
    if (args.indexOf('--report') >= 0) {
        const g = groups();
        let total = 0;
        Object.keys(g).forEach((name) => {
            let sum = 0;
            const rows = g[name].map((f) => { const n = scanFile(f).length; sum += n; return [f, n]; });
            total += sum;
            console.log('\n' + name + ': ' + sum);
            rows.filter((r) => r[1]).sort((a, b) => b[1] - a[1]).forEach((r) => console.log('  ' + String(r[1]).padStart(5) + '  ' + r[0]));
        });
        console.log('\ntotal: ' + total + '  (strict, must stay 0: ' + (config.strict || []).join(', ') + ')');
        process.exit(0);
    }
    const files = args.filter((a) => a.indexOf('--') !== 0);
    let all = [];
    files.forEach((f) => { all = all.concat(scanFile(f)); });
    if (json) console.log(JSON.stringify(all, null, 2));
    else all.forEach((f) => console.log(f.file + ':' + f.line + '  ' + f.kind.padEnd(4) + '  ' + f.text.slice(0, 140)));
    if (!json) console.log(all.length + ' finding(s) in ' + files.length + ' file(s)');
    if (strict && all.length) process.exit(1);
}
