#!/usr/bin/env node
// Reference extraction: what each text file of the repository (or of another repository) points at.
// - absolute URLs of the site's own hosts (www.legendmod.ml, legendmod.ml, jimboy3100.github.io) and
//   of this repository on raw.githubusercontent.com / cdn.jsdelivr.net / github.com, in any text file;
// - HTML attributes (src, href, poster, srcset, data-src ...), CSS url() / @import, extension and web
//   app manifests, userscript metadata (@require, @icon, @updateURL ...);
// - relative path strings in scripts and JSON ('img/x.png', "ogario/modules/x.js"), also in inline
//   handlers and javascript: links (onclick="pop('articles/x.html')"), resolved against the file's
//   folder and the site root (weak: a script runs in the page that loads it);
// - dynamic paths: 'https://www.legendmod.ml/banners/' + name + '.png', `.../${x}.js`, 'dir/' + x,
//   kept as patterns (prefix, suffix) instead of single files.
// Each reference says whether it is in a comment, and how it resolves on GitHub Pages (exact case,
// folder index.html, extensionless .html).
// Usage: node developers/audit/references.js <file> [repoDir]   (prints the references of one file)
'use strict';
const fs = require('fs');
const path = require('path');
const { readJson, ext } = require('./inventory');

const ASSET_EXT = 'png|jpe?g|gif|webp|svg|ico|bmp|avif|mp4|webm|ogv|mov|mp3|ogg|oga|wav|m4a|flac|js|mjs|css|json|jsonld|html?|txt|xml|woff2?|ttf|otf|eot|wasm|cur|ani|zip|apk|md|pdf|webmanifest';
const REL_RE = new RegExp('([\'"`])((?:\\.{1,2}\\/|\\/)?(?:[\\w\\-.%@ ]+\\/)*[\\w\\-.%@ ]*[\\w\\-%@]\\.(?:' + ASSET_EXT + '))(?:[?#][^\'"`\\r\\n]*)?\\1', 'gi');
/* markup built in a script string: '<img src="/banners/x.png">' (the attribute value, quoted inside the string) */
const ATTR_IN_STR_RE = /\b(?:src|href|poster|data-src|data-original|data-href|background)\s*=\s*\\?(["'])([^"'\\<>\s+]+)\\?\1/gi;
const DIR_PREFIX_RE = /(['"`])((?:\.{1,2}\/|\/)?(?:[\w\-.]+\/)+)\1(?=\s*\+)/g;
/* brackets stay in (nicks/emoji/DisMojiPicker[1].js); a closing one without an opening one is markdown */
const URL_RE = /(?:\b(https?):)?\/\/([a-z0-9][a-z0-9.-]*\.[a-z]{2,})(:\d+)?(\/[^\s'"`<>()\\{}|^,;$]*)?/gi;
const ESC_URL_RE = /\bhttps?:\\\/\\\/([a-z0-9][a-z0-9.-]*\.[a-z]{2,})((?:\\\/[^\s'"`<>()\\{}|^,;$]*)*)/gi;
const ATTRS = new Set(['src', 'href', 'poster', 'data-src', 'data-href', 'data', 'srcset', 'data-srcset', 'background',
    'action', 'manifest', 'icon', 'formaction', 'xlink:href', 'data-bg', 'data-image', 'data-img', 'data-video', 'data-url', 'lowsrc']);
const JS_EXT = new Set(['js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx']);
const HTML_EXT = new Set(['html', 'htm', 'svg', 'xml', 'php', 'vue']);

function loadConfig(repo) {
    const pu = readJson(path.join(repo, 'developers', 'audit', 'public-urls.json'));
    const own = new Set((pu.hosts.own || []).map((h) => h.toLowerCase()));
    const mirror = new Set((pu.hosts.mirror || []).map((h) => h.toLowerCase()));
    const ownRepo = (pu.hosts.ownRepo || 'jimboy3100/jimboy3100.github.io').toLowerCase();
    return { own, mirror, ownRepo, pu };
}

/* ---------- comment ranges ---------- */
function skipStr(t, i, to, q) {
    for (let j = i + 1; j < to; j++) {
        const c = t.charCodeAt(j);
        if (c === 92) { j++; continue; }
        if (c === q) return j + 1;
        if (c === 10 && q !== 96) return j; /* unterminated */
    }
    return to;
}
const REGEX_AFTER = new Set('(,=:[!&|?{};+-*%<>~^'.split(''));
const REGEX_WORDS = new Set(['return', 'typeof', 'case', 'in', 'of', 'void', 'delete', 'instanceof', 'new', 'throw', 'else', 'do', 'yield', 'await']);
function regexAllowed(t, i, last, lastAt) {
    if (last === '') return true;
    if (REGEX_AFTER.has(last)) return true;
    if (/[\w$]/.test(last)) {
        let s = lastAt;
        while (s > 0 && /[\w$]/.test(t[s - 1])) s--;
        return REGEX_WORDS.has(t.slice(s, lastAt + 1));
    }
    return false;
}
function skipRegex(t, i, to) {
    let cls = false;
    for (let j = i + 1; j < to; j++) {
        const c = t[j];
        if (c === '\\') { j++; continue; }
        if (c === '\n') return -1;
        if (cls) { if (c === ']') cls = false; continue; }
        if (c === '[') { cls = true; continue; }
        if (c === '/') { j++; while (j < to && /[a-z]/i.test(t[j])) j++; return j; }
    }
    return -1;
}
/* JavaScript comments between from and to; returns the index where it stopped (the closing brace of a
   template substitution when depth goes below 0) */
function jsComments(t, from, to, out, inTemplate) {
    let i = from, last = '', lastAt = -1, depth = 0;
    while (i < to) {
        const c = t.charCodeAt(i);
        if (c === 47) {
            const n = t.charCodeAt(i + 1);
            if (n === 47) { let e = t.indexOf('\n', i); if (e < 0 || e > to) e = to; out.push([i, e]); i = e; continue; }
            if (n === 42) { let e = t.indexOf('*/', i + 2); e = e < 0 || e > to ? to : e + 2; out.push([i, e]); i = e; continue; }
            if (regexAllowed(t, i, last, lastAt)) {
                const e = skipRegex(t, i, to);
                if (e > 0) { i = e; last = ')'; lastAt = e - 1; continue; }
            }
            last = '/'; lastAt = i; i++; continue;
        }
        if (c === 39 || c === 34) { i = skipStr(t, i, to, c); last = '"'; lastAt = i - 1; continue; }
        if (c === 96) { i = skipTemplate(t, i, to, out); last = '"'; lastAt = i - 1; continue; }
        if (inTemplate) {
            if (c === 123) depth++;
            else if (c === 125) { if (depth === 0) return i + 1; depth--; }
        }
        if (c > 32) { last = t[i]; lastAt = i; }
        i++;
    }
    return to;
}
function skipTemplate(t, i, to, out) {
    for (let j = i + 1; j < to; j++) {
        const c = t.charCodeAt(j);
        if (c === 92) { j++; continue; }
        if (c === 96) return j + 1;
        if (c === 36 && t.charCodeAt(j + 1) === 123) { j = jsComments(t, j + 2, to, out, true) - 1; }
    }
    return to;
}
function cssComments(t, from, to, out) {
    let i = t.indexOf('/*', from);
    while (i >= 0 && i < to) { let e = t.indexOf('*/', i + 2); e = e < 0 || e > to ? to : e + 2; out.push([i, e]); i = t.indexOf('/*', e); }
}
/* script and style bodies of an HTML page */
function htmlBlocks(t) {
    const scripts = [], styles = [];
    const re = /<(script|style)\b([^>]*)>/gi, lt = t.toLowerCase();
    let m;
    while ((m = re.exec(t))) {
        const close = lt.indexOf('</' + m[1].toLowerCase(), re.lastIndex);
        const end = close < 0 ? t.length : close;
        (m[1].toLowerCase() === 'script' ? scripts : styles).push([re.lastIndex, end, m[2]]);
        re.lastIndex = end;
    }
    return { scripts, styles };
}
function commentRanges(t, kind, blocks) {
    const out = [];
    if (kind === 'js') jsComments(t, 0, t.length, out, false);
    else if (kind === 'css') cssComments(t, 0, t.length, out);
    else if (kind === 'html') {
        let i = t.indexOf('<!--');
        while (i >= 0) { let e = t.indexOf('-->', i + 4); e = e < 0 ? t.length : e + 3; out.push([i, e]); i = t.indexOf('<!--', e); }
        for (const b of blocks.scripts) if (!/type\s*=\s*["']?(text\/(html|template|x-template)|application\/(ld\+)?json)/i.test(b[2])) jsComments(t, b[0], b[1], out, false);
        for (const b of blocks.styles) cssComments(t, b[0], b[1], out);
    }
    out.sort((a, b) => a[0] - b[0]);
    return out;
}
function inRanges(ranges, at) {
    let lo = 0, hi = ranges.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (ranges[mid][1] <= at) lo = mid + 1;
        else if (ranges[mid][0] > at) hi = mid - 1;
        else return true;
    }
    return false;
}

/* ---------- dynamic concatenation ---------- */
function skipWs(t, i) { while (i < t.length && /\s/.test(t[i])) i++; return i; }
function balanced(t, i) {
    const open = t[i], close = open === '(' ? ')' : ']';
    let d = 0;
    for (let j = i; j < t.length && j < i + 400; j++) {
        const c = t[j];
        if (c === '"' || c === "'" || c === '`') { j = skipStr(t, j, t.length, c.charCodeAt(0)) - 1; continue; }
        if (c === open) d++;
        else if (c === close) { d--; if (!d) return j + 1; }
        else if (c === ';') return -1;
    }
    return -1;
}
function exprEnd(t, i) {
    let j = i;
    if (t[j] === '!' || t[j] === '-') j++;
    while (j < t.length) {
        const c = t[j];
        if (/[\w$.]/.test(c)) { j++; continue; }
        if (c === '(' || c === '[') { const e = balanced(t, j); if (e < 0) return j; j = e; continue; }
        if (c === '?' && t[j + 1] === '.') { j += 2; continue; }
        break;
    }
    return j;
}
/* after the closing quote of a string: + operands up to the end of the expression */
function concatTail(t, i) {
    let staticAdd = '', dynamic = false, suffix = null, k = i;
    for (let n = 0; n < 12; n++) {
        k = skipWs(t, k);
        if (t[k] !== '+' || t[k + 1] === '+' || t[k + 1] === '=') break;
        k = skipWs(t, k + 1);
        const q = t[k];
        if (q === "'" || q === '"' || q === '`') {
            const end = skipStr(t, k, t.length, q.charCodeAt(0));
            if (t[end - 1] !== q) break;
            const val = t.slice(k + 1, end - 1);
            if (q === '`' && val.indexOf('${') >= 0) { dynamic = true; break; }
            if (!dynamic) staticAdd += val; else { suffix = val; break; }
            k = end;
        } else {
            const end = exprEnd(t, k);
            if (end <= k) break;
            dynamic = true; k = end;
        }
    }
    return { staticAdd, dynamic, suffix };
}
function templateTail(t, i) {
    /* i at '$' of '${' */
    let d = 0, j = i + 1;
    for (; j < t.length && j < i + 400; j++) { if (t[j] === '{') d++; else if (t[j] === '}') { d--; if (!d) break; } }
    let s = '';
    for (j++; j < t.length && j < i + 600; j++) { if (t[j] === '`' || (t[j] === '$' && t[j + 1] === '{')) break; s += t[j]; }
    return s;
}
function cutQuery(s) { const q = s.search(/[?#]/); return q < 0 ? s : s.slice(0, q); }

/* ---------- path resolution (GitHub Pages) ---------- */
function decode(p) { try { return decodeURIComponent(p); } catch (e) { return p; } }
/* p: site path without the leading '/', query and hash */
function resolvePath(p, inv) {
    const dec = decode(p);
    const cands = dec === p ? [p] : [dec, p];
    for (const c of cands) {
        if (c === '' || c.endsWith('/')) {
            const d = c.replace(/\/$/, '');
            if (inv.exist.has(c + 'index.html')) return { status: 'ok', path: c + 'index.html' };
            if (d === '' || inv.dirs.has(d)) return { status: 'dir', path: d };
            continue;
        }
        if (inv.exist.has(c)) return { status: 'ok', path: c };
        if (inv.exist.has(c + '.html')) return { status: 'ok', path: c + '.html' };
        if (inv.dirs.has(c)) return inv.exist.has(c + '/index.html') ? { status: 'ok', path: c + '/index.html' } : { status: 'dir', path: c };
    }
    for (const c of cands) {
        const k = c.replace(/\/$/, '').toLowerCase();
        const l = inv.lower.get(k) || inv.lower.get(k + '.html') || inv.lower.get(k + '/index.html');
        if (l && l[0] !== c.replace(/\/$/, '')) return { status: 'case', path: c, actual: l[0] };
    }
    return { status: 'missing', path: dec };
}
function joinRel(fromRel, v) {
    if (v[0] === '/') return path.posix.normalize(v).replace(/^\/+/, '');
    const dir = path.posix.dirname(fromRel);
    let p = path.posix.normalize((dir === '.' ? '' : dir + '/') + v);
    while (p.startsWith('../')) p = p.slice(3); /* a browser stops at the site root */
    if (p === '..' || p === '.') p = '';
    return p;
}

/* an absolute URL: {kind, path} for the own site / repository, or null */
function classifyUrl(host, upath, cfg) {
    host = host.toLowerCase();
    upath = upath || '/';
    if (cfg.own.has(host)) return { kind: 'url', path: upath };
    if (cfg.mirror.has(host)) return { kind: 'mirror', path: upath };
    const lp = upath.toLowerCase(), r = '/' + cfg.ownRepo + '/';
    if (host === 'raw.githubusercontent.com' && lp.startsWith(r)) {
        const rest = upath.slice(r.length), s = rest.indexOf('/');
        const ref = s < 0 ? rest : rest.slice(0, s);
        return { kind: 'raw', path: s < 0 ? '/' : rest.slice(s), ref };
    }
    if (host === 'cdn.jsdelivr.net' && lp.startsWith('/gh' + r.slice(0, -1))) {
        let rest = upath.slice(('/gh' + r).length - 1);
        let ref = 'master';
        if (rest[0] === '@') { const s = rest.indexOf('/'); ref = rest.slice(1, s < 0 ? rest.length : s); rest = s < 0 ? '/' : rest.slice(s); }
        return { kind: 'raw', path: rest || '/', ref };
    }
    if (host === 'github.com' && lp.startsWith(r)) {
        const m = /^\/(blob|raw|tree)\/([^/]+)(\/.*)?$/.exec(upath.slice(r.length - 1));
        if (m) return { kind: m[1] === 'raw' ? 'raw' : 'github', path: m[3] || '/', ref: m[2] };
        return null;
    }
    return null;
}

/* ---------- one file ---------- */
function lineIndex(t) {
    const nl = [];
    for (let i = t.indexOf('\n'); i >= 0; i = t.indexOf('\n', i + 1)) nl.push(i);
    return (at) => { let lo = 0, hi = nl.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nl[m] < at) lo = m + 1; else hi = m; } return lo + 1; };
}

/**
 * @param {string} rel  file path (repository relative, or 'repo:path' for another repository)
 * @param {string} t    its text
 * @param {object} ctx  {cfg, inv, external: bool (another repository: only absolute URLs)}
 * @returns {{refs: object[], patterns: object[], comments?: number[][]}} comments: [start, end) ranges
 * ref: {kind, raw, at, line, comment, strict, status, target?, actual?, ref?}
 *   kind url|raw|github|mirror (absolute), html|css|manifest (relative, strict), rel (script string, weak)
 *   status ok|dir|case|missing (mirror / other ref: unchecked)
 */
function extract(rel, t, ctx) {
    const cfg = ctx.cfg, inv = ctx.inv;
    const e = ext(rel), base = rel.slice(rel.lastIndexOf('/') + 1).toLowerCase();
    const kind = JS_EXT.has(e) ? 'js' : e === 'css' ? 'css' : HTML_EXT.has(e) ? 'html' : 'other';
    const blocks = kind === 'html' ? htmlBlocks(t) : { scripts: [], styles: [] };
    const comments = commentRanges(t, kind, blocks);
    const line = lineIndex(t);
    const refs = [], patterns = [];
    const seen = new Set(), seenAt = new Set();
    const scriptish = kind === 'js' || e === 'json' || kind === 'html';
    const inScript = (at) => kind === 'js' || (kind === 'html' && blocks.scripts.some((b) => at >= b[0] && at < b[1]));
    let usMeta = null;
    if (kind === 'js') { const a = t.indexOf('==UserScript=='), b = t.indexOf('==/UserScript=='); if (a >= 0 && b > a) usMeta = [a, b]; }

    const add = (r) => {
        const key = r.at + '|' + r.raw;
        if (seen.has(key)) return;
        seen.add(key);
        seenAt.add(r.at);
        r.line = line(r.at);
        /* the ==UserScript== block is // comments, but its @require / @resource / @icon lines are loaded */
        r.comment = r.kind === 'userscript' ? false : inRanges(comments, r.at);
        refs.push(r);
    };
    const addPattern = (prefix, suffix, raw, at, how) => {
        patterns.push({ prefix, suffix: cutQuery((suffix || '').split(/["'\s\\<>]/)[0]), raw, at, line: line(at), comment: inRanges(comments, at), how });
    };
    /* a site path (no leading '/'), checked */
    const sitePath = (kindName, p, raw, at, strict, extra) => {
        if (!p && p !== '') return;
        if (p.indexOf('*') >= 0) return; /* host permission / match pattern */
        const r = Object.assign({ kind: kindName, raw, at, strict }, extra || {});
        if (inv) {
            const res = resolvePath(p, inv);
            r.status = res.status; r.target = res.status === 'ok' || res.status === 'dir' ? res.path : undefined;
            if (res.status === 'case') r.actual = res.actual;
            if (res.status === 'missing' || res.status === 'case') r.path = res.path;
            /* a folder address in a script is a base that names are added to later */
            if (res.status === 'dir' && !ctx.external && extra && extra.script && (kindName === 'url' || kindName === 'raw')) addPattern(res.path === '' ? '' : res.path + '/', '', raw, at, 'folder');
        }
        add(r);
    };

    /* absolute URLs (also JSON-escaped ones: https:\/\/www.legendmod.ml\/x.png in saved settings) */
    let m;
    const urlHits = [];
    URL_RE.lastIndex = 0;
    while ((m = URL_RE.exec(t))) {
        if (!m[1] && !/['"(=\s,[]/.test(t[m.index - 1] || '')) continue; /* "//" not a protocol-relative URL */
        urlHits.push({ at: m.index, end: m.index + m[0].length, raw: m[0], host: m[2], port: !!m[3], upath: m[4], escaped: false });
    }
    if (t.indexOf(':\\/\\/') >= 0) {
        ESC_URL_RE.lastIndex = 0;
        while ((m = ESC_URL_RE.exec(t))) urlHits.push({ at: m.index, end: m.index + m[0].length, raw: m[0].replace(/\\\//g, '/'), host: m[1], port: false, upath: (m[2] || '').replace(/\\\//g, '/'), escaped: true });
    }
    for (const h of urlHits) {
        const at = h.at;
        if (h.port) continue; /* GitHub Pages has no other port */
        const c = classifyUrl(h.host, h.upath, cfg);
        if (!c) continue;
        let upath = c.path;
        const end = h.end;
        let raw = h.raw;
        /* prose and markup around a URL: "&quot;", "file.js:120:5" (stack traces), trailing punctuation */
        upath = upath.replace(/&(quot|apos|#\d+|#x[0-9a-f]+|gt|lt)\b.*$/i, '').replace(/(\.[a-z0-9]+):\d+(:\d+)?$/i, '$1');
        let trimmed = upath;
        for (let k = 0; k < 4; k++) {
            trimmed = trimmed.replace(/[.!?:]+$/, '');
            if (/\]$/.test(trimmed) && (trimmed.match(/\[/g) || []).length < (trimmed.match(/\]/g) || []).length) trimmed = trimmed.slice(0, -1);
        }
        if (c.kind === 'github') trimmed = trimmed.replace(/\/+$/, '') || '/';
        const wasTrimmed = trimmed !== upath || upath !== c.path;
        upath = trimmed;
        const q = t[end];
        const script = !h.escaped && (kind === 'js' || inScript(at));
        let dyn = null;
        if (!h.escaped && !wasTrimmed && scriptish && upath.search(/[?#]/) < 0) {
            if (q === "'" || q === '"' || q === '`') {
                const tail = concatTail(t, end + 1);
                if (tail.dynamic) dyn = { suffix: tail.suffix || '', staticAdd: tail.staticAdd };
                else if (tail.staticAdd) { upath += tail.staticAdd; raw += ' + ' + JSON.stringify(tail.staticAdd); }
            } else if (q === '$' && t[end + 1] === '{') dyn = { suffix: templateTail(t, end), staticAdd: '' };
        }
        const isUs = usMeta && at > usMeta[0] && at < usMeta[1];
        if (c.kind === 'mirror') {
            const p = cutQuery(upath).replace(/^\/+/, '');
            if (dyn) addPattern(p + dyn.staticAdd, dyn.suffix, raw, at, 'mirror');
            else add({ kind: 'mirror', raw, at, strict: false, status: 'unchecked', mirrorPath: decode(p) });
            continue;
        }
        if ((c.kind === 'raw' || c.kind === 'github') && c.ref && !/^(master|main|HEAD)$/i.test(c.ref)) {
            add({ kind: c.kind, raw, at, strict: false, status: 'unchecked', ref: c.ref });
            continue;
        }
        const p = cutQuery(upath).replace(/^\/+/, '');
        if (dyn) {
            if (!ctx.external) addPattern(p + dyn.staticAdd, dyn.suffix, raw, at, c.kind);
            continue;
        }
        /* var base = 'https://www.legendmod.ml/cursors/cursor_', ...: a missing name without extension in a
           script is a base that is completed later, not a file */
        if (script && !ctx.external && inv && upath.search(/[?#]/) < 0 && !/\.[A-Za-z0-9]{1,5}$/.test(p) && !p.endsWith('/') && p !== '' &&
            resolvePath(p, inv).status === 'missing') { addPattern(p, '', raw, at, 'base'); continue; }
        sitePath(isUs ? 'userscript' : c.kind, p, raw, at, true, { script });
    }
    if (ctx.external) return { refs, patterns };

    /* HTML attributes; inline handlers (onclick="pop('articles/x.html')") and javascript: links are script */
    const handlerZones = [];
    if (kind === 'html') {
        const bm = /<base\s[^>]*href\s*=\s*["']([^"']+)["']/i.exec(t);
        let baseRel = null;
        if (bm) {
            const bu = /^(?:https?:)?\/\/([^/]+)(\/.*)?$/i.exec(bm[1]);
            if (bu) { const c = classifyUrl(bu[1], bu[2], cfg); if (c && c.kind === 'url') baseRel = c.path.replace(/^\/+/, ''); }
            else baseRel = joinRel(rel, bm[1]);
            if (baseRel !== null && !baseRel.endsWith('/') && baseRel !== '') baseRel = path.posix.dirname(baseRel) === '.' ? '' : path.posix.dirname(baseRel) + '/';
        }
        const tagRe = /<([a-zA-Z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
        const attrRe = /\s([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
        let tm;
        while ((tm = tagRe.exec(t))) {
            if (blocks.scripts.some((b) => tm.index >= b[0] && tm.index < b[1])) continue;
            if (blocks.styles.some((b) => tm.index >= b[0] && tm.index < b[1])) continue;
            const tag = tm[1].toLowerCase();
            if (tag === 'base') continue;
            attrRe.lastIndex = 0;
            let am;
            while ((am = attrRe.exec(tm[2]))) {
                const name = am[1].toLowerCase();
                const js = /^on[a-z]+$/.test(name) || /^\s*javascript:/i.test(am[2] !== undefined ? am[2] : am[3] !== undefined ? am[3] : am[4] || '');
                if (js) {
                    const vs = tm.index + 1 + tm[1].length + am.index + am[0].indexOf('=') + 1;
                    handlerZones.push([vs, tm.index + 1 + tm[1].length + am.index + am[0].length]);
                    continue;
                }
                if (!ATTRS.has(name)) continue;
                if (tag === 'link' && /rel\s*=\s*["']?(preconnect|dns-prefetch)/i.test(tm[2])) continue;
                const val = (am[2] !== undefined ? am[2] : am[3] !== undefined ? am[3] : am[4]).trim().replace(/&amp;/g, '&');
                const at = tm.index + 1 + tm[1].length + am.index + 1;
                const vals = name.indexOf('srcset') >= 0 ? val.split(',').map((s) => s.trim().split(/\s+/)[0]) : [val];
                for (const v of vals) htmlValue(v, at);
            }
        }
        function htmlValue(v, at) {
            if (!v || /^(#|javascript:|mailto:|tel:|data:|blob:|about:|sms:|whatsapp:|intent:|chrome:|market:|steam:|discord:|\{|\$|%7B)/i.test(v)) return;
            if (/\$\{|\{\{|'\s*\+|"\s*\+|\+\s*'|<%/.test(v)) return;
            if (/^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith('//')) return; /* absolute: handled above */
            const p = cutQuery(v);
            if (p === '' && v[0] === '?') return; /* the page itself */
            const joined = baseRel !== null && v[0] !== '/' ? joinRel(baseRel + 'x', p) : joinRel(rel, p);
            sitePath('html', joined, v, at, true);
        }
    }

    /* CSS url() and @import: strict in style sheets and pages, weak in scripts */
    if (kind === 'css' || kind === 'html' || kind === 'js') {
        const cssRe = /url\(\s*(['"]?)([^'")\s]+)\1\s*\)|@import\s+(['"])([^'"]+)\3/gi;
        while ((m = cssRe.exec(t))) {
            const v = (m[2] || m[4]).replace(/\\/g, '');
            if (/^(data:|#|about:|blob:)/i.test(v) || /^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith('//')) continue;
            if (/\$\{|['"+]/.test(v) || /^\s*$/.test(v)) continue;
            const strict = kind === 'css' || (kind === 'html' && !inScript(m.index));
            if (strict) sitePath('css', joinRel(rel, cutQuery(v)), v, m.index, true);
            else if (/\.[a-z0-9]{2,5}$/i.test(cutQuery(v))) weakRel(v, m.index); /* not URL(x) / createObjectURL(x) */
        }
    }

    /* manifests */
    if ((base === 'manifest.json' || e === 'webmanifest') && inv) {
        let j = null;
        try { j = JSON.parse(t.replace(/^\s+/, '')); } catch (err) { j = null; }
        if (j && typeof j === 'object') {
            const vals = [];
            const push = (v) => { if (typeof v === 'string' && v && !/^[a-z]+:/i.test(v) && v.indexOf('*') < 0) vals.push(v); };
            const icons = (o) => { if (o && typeof o === 'object') Object.values(o).forEach((v) => (typeof v === 'string' ? push(v) : v && push(v.src))); };
            (j.content_scripts || []).forEach((cs) => { (cs.js || []).forEach(push); (cs.css || []).forEach(push); });
            if (j.background) { push(j.background.service_worker); push(j.background.page); (j.background.scripts || []).forEach(push); }
            ['action', 'browser_action', 'page_action'].forEach((k) => { if (j[k]) { push(j[k].default_popup); icons(typeof j[k].default_icon === 'string' ? { a: j[k].default_icon } : j[k].default_icon); } });
            icons(j.icons);
            push(j.options_page); if (j.options_ui) push(j.options_ui.page);
            if (j.declarative_net_request) (j.declarative_net_request.rule_resources || []).forEach((r) => push(r.path));
            (j.web_accessible_resources || []).forEach((w) => (typeof w === 'string' ? push(w) : (w.resources || []).forEach(push)));
            (j.screenshots || []).forEach((s) => push(s && s.src));
            push(j.start_url && j.start_url.replace(/[?#].*$/, '') || undefined);
            if (j.default_locale) {
                /* the browser reads every _locales/<language>/messages.json next to the manifest */
                const d = path.posix.dirname(rel), pre = (d === '.' ? '' : d + '/') + '_locales/';
                push('_locales/' + j.default_locale + '/messages.json');
                for (const p of inv.sorted) if (p.startsWith(pre) && p.endsWith('/messages.json')) push(p.slice(pre.length - '_locales/'.length));
            }
            vals.forEach((v) => {
                const i = Math.max(0, t.indexOf('"' + v + '"'));
                const p = cutQuery(v);
                if (p === '' || p === '.' || p === './') return;
                sitePath('manifest', joinRel(rel, p), v, i, true);
            });
        }
    }

    /* relative strings in scripts and JSON (weak), and 'dir/' + x patterns */
    function weakRel(v, at) {
        const p = cutQuery(v);
        if (!p || /^[a-z][a-z0-9+.-]*:/i.test(p)) return;
        const cands = p[0] === '/' ? [p.replace(/^\/+/, '')] : [joinRel(rel, p), joinRel('x', p)];
        let hit = null;
        for (const c of cands) { const r = resolvePath(c, inv); if (r.status === 'ok') { hit = r.path; break; } }
        add({ kind: 'rel', raw: v, at, strict: false, status: hit ? 'ok' : 'unresolved', target: hit || undefined });
    }
    if (inv && (kind === 'js' || e === 'json' || e === 'jsonld' || kind === 'html')) {
        const zones = kind === 'html' ? blocks.scripts.concat(handlerZones) : [[0, t.length]];
        for (const z of zones) {
            const s = t.slice(z[0], z[1]);
            REL_RE.lastIndex = 0;
            while ((m = REL_RE.exec(s))) {
                const at = z[0] + m.index;
                if (seenAt.has(at + 1)) continue;
                weakRel(m[2], at + 1);
                REL_RE.lastIndex = m.index + m[0].length - 1;
            }
            if (e === 'json') continue;
            ATTR_IN_STR_RE.lastIndex = 0;
            while ((m = ATTR_IN_STR_RE.exec(s))) {
                const v = m[2], at = z[0] + m.index + m[0].indexOf(v);
                if (seenAt.has(at) || v.startsWith('//') || /^(#|[a-z][a-z0-9+.-]*:)/i.test(v) || v.indexOf('${') >= 0) continue;
                if (cutQuery(v) && /\.[a-z0-9]{2,5}$/i.test(cutQuery(v))) weakRel(v, at);
            }
            DIR_PREFIX_RE.lastIndex = 0;
            while ((m = DIR_PREFIX_RE.exec(s))) {
                const at = z[0] + m.index;
                const v = m[2];
                const tail = concatTail(t, at + m[0].length);
                if (!tail.dynamic) continue;
                const cands = v[0] === '/' ? [v.replace(/^\/+/, '')] : [joinRel(rel, v) + '/', joinRel('x', v) + '/'];
                for (const c of cands) {
                    const d = c.replace(/\/+$/, '');
                    if (d && inv.dirs.has(d)) { addPattern(d + '/' + tail.staticAdd, tail.suffix || '', v, at + 1, 'rel'); break; }
                }
            }
        }
    }
    return { refs, patterns, comments };
}

/* every text file: Map(rel -> {refs, patterns}) */
function scanFiles(repo, rels, ctx, readText) {
    const out = new Map();
    for (const rel of rels) {
        let t;
        try { t = readText ? readText(rel) : fs.readFileSync(path.join(repo, rel), 'utf8'); } catch (err) { continue; }
        out.set(rel, extract(rel, t, ctx));
    }
    return out;
}

/* does a pattern match a site path */
function patternMatches(pt, p) {
    if (!p.startsWith(pt.prefix)) return false;
    if (pt.suffix && !p.endsWith(pt.suffix)) return false;
    const mid = p.slice(pt.prefix.length, p.length - pt.suffix.length);
    if (!mid) return false;
    if (pt.suffix && mid.indexOf('/') >= 0) return false; /* 'dir/' + name + '.png': one folder */
    return true;
}

module.exports = { loadConfig, extract, scanFiles, resolvePath, joinRel, classifyUrl, patternMatches, commentRanges, decode };

if (require.main === module) {
    const repo = path.resolve(process.argv[3] || path.join(__dirname, '..', '..'));
    const { inventory } = require('./inventory');
    const inv = inventory(repo, { sizes: false });
    const rel = path.relative(repo, path.resolve(process.argv[2])).replace(/\\/g, '/');
    const r = extract(rel, fs.readFileSync(path.join(repo, rel), 'utf8'), { cfg: loadConfig(repo), inv });
    r.refs.forEach((x) => console.log(x.line + '\t' + x.kind + (x.comment ? ' (comment)' : '') + '\t' + x.status + '\t' + x.raw + (x.target ? ' -> ' + x.target : '') + (x.actual ? ' (case: ' + x.actual + ')' : '')));
    r.patterns.forEach((x) => console.log(x.line + '\tpattern ' + x.how + (x.comment ? ' (comment)' : '') + '\t' + x.prefix + '*' + x.suffix));
}
