#!/usr/bin/env node
// Transitive reachability: which files are loaded or linked, directly or through other files, from a
// set of entry points. Edges are the resolved references of references.js (comments and github.com
// "view source" links do not count). A dynamic pattern ('banners/' + name + '.png') reaches a file
// only when the file's name also appears in a reached file (or the file is in a data-driven
// collection of public-urls.json, such as the vanilla skins named by agar.io's configuration);
// otherwise the file is kept as a candidate (evidence for UNKNOWN, not for deletion).
// Usage: node developers/audit/reachability.js   (runs the audit and prints the totals)
'use strict';
const { patternMatches } = require('./references');

const TOKEN_RE = /[A-Za-z0-9_$-]+/g;
/* whole file names with a stem of one or two characters ('ok.svg'): such a stem alone proves nothing (see named) */
const SHORT_NAME_RE = /(?<![A-Za-z0-9_$.-])[A-Za-z0-9_$-]{1,2}\.[A-Za-z0-9]{2,5}(?![A-Za-z0-9_$-])/g;
/* words of a text: code (outside the comment ranges) into code, every word into all */
function tokenize(text, code, all, ranges) {
    for (const re of [TOKEN_RE, SHORT_NAME_RE]) {
        re.lastIndex = 0;
        let m, ri = 0;
        while ((m = re.exec(text))) {
            if (all) all.add(m[0]);
            if (ranges && ranges.length) {
                while (ri < ranges.length && ranges[ri][1] <= m.index) ri++;
                if (ri < ranges.length && ranges[ri][0] <= m.index) continue;
            }
            code.add(m[0]);
        }
    }
}

function stemOf(p) {
    const b = p.slice(p.lastIndexOf('/') + 1);
    const i = b.lastIndexOf('.');
    return i > 0 ? b.slice(0, i) : b;
}
/* is the file's name (without extension) written somewhere in the reached files; names of one or two
   characters ('a', '17') are everywhere and prove nothing, unless the whole file name is written ('ok.svg') */
function named(p, tokens) {
    const s = stemOf(p);
    if (s.length < 3) return tokens.has(p.slice(p.lastIndexOf('/') + 1));
    if (tokens.has(s)) return true;
    const parts = s.split(/[^A-Za-z0-9_$-]+/).filter(Boolean);
    return parts.length > 1 && parts.every((x) => tokens.has(x)) && parts.some((x) => x.length >= 3);
}
function lowerBound(arr, s) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < s) lo = m + 1; else hi = m; } return lo; }
function patternFiles(sorted, pt) {
    const out = [];
    if (!pt.prefix && !pt.suffix) return out; /* '' + anything: no information */
    for (let i = lowerBound(sorted, pt.prefix); i < sorted.length && sorted[i].startsWith(pt.prefix); i++) {
        if (patternMatches(pt, sorted[i])) out.push(sorted[i]);
    }
    return out;
}

/**
 * @param {object} o {inv, scan: Map(rel -> {refs, patterns}), roots: Map(path -> why), already?: Set,
 *                    tokens?: Set (names known from earlier levels), collection?: (p) => entry|null,
 *                    readText: (rel) => string}
 * @returns {{reached: Map(path -> {from, kind, line?, why?, pattern?}), tokens: Set (words in code),
 *            allTokens: Set (also in comments), candidates: Map(path -> {from, pattern})}}
 */
function reach(o) {
    const reached = new Map();
    const already = o.already || new Set();
    const tokens = new Set(o.tokens || []);
    const allTokens = new Set(o.allTokens || []);
    const candidates = new Map();
    const queue = [];
    for (const [p, why] of o.roots) queue.push([p, { kind: 'entry', why }]);
    const pending = [];
    const visit = () => {
        while (queue.length) {
            const [p, info] = queue.pop();
            if (reached.has(p) || already.has(p)) continue;
            if (!o.inv.exist.has(p)) continue;
            reached.set(p, info);
            candidates.delete(p);
            const r = o.scan.get(p);
            if (!r) continue;
            try { tokenize(o.readText(p), tokens, allTokens, r.comments); } catch (e) { /* unreadable */ }
            for (const ref of r.refs) {
                if (ref.comment || ref.kind === 'github' || ref.status !== 'ok' || !ref.target) continue;
                if (!reached.has(ref.target) && !already.has(ref.target)) queue.push([ref.target, { from: p, kind: ref.kind, line: ref.line }]);
            }
            for (const pt of r.patterns) if (!pt.comment) pending.push({ pt, from: p });
        }
    };
    visit();
    let changed = true;
    while (changed) {
        changed = false;
        while (pending.length) {
            const { pt, from } = pending.pop();
            for (const f of patternFiles(o.inv.sorted, pt)) {
                if (reached.has(f) || already.has(f)) continue;
                const coll = o.collection && o.collection(f);
                if (coll || named(f, tokens)) { queue.push([f, { from, kind: 'dynamic', pattern: pt.prefix + '*' + pt.suffix, line: pt.line, why: coll ? coll.why : undefined }]); }
                else if (!candidates.has(f)) candidates.set(f, { from, pattern: pt.prefix + '*' + pt.suffix, line: pt.line });
            }
        }
        for (const [f, c] of candidates) {
            if (named(f, tokens)) { queue.push([f, { from: c.from, kind: 'dynamic', pattern: c.pattern, line: c.line }]); }
        }
        if (queue.length) { visit(); changed = true; }
    }
    for (const f of reached.keys()) candidates.delete(f);
    return { reached, tokens, allTokens, candidates };
}

/* groups of files that only reference each other (union of references among the given files) */
function orphanGroups(files, scan, sizeOf) {
    const parent = new Map();
    const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
    for (const f of files) parent.set(f, f);
    for (const f of files) {
        const r = scan.get(f);
        if (!r) continue;
        for (const ref of r.refs) {
            if (ref.comment || !ref.target || !parent.has(ref.target) || ref.target === f) continue;
            const a = find(f), b = find(ref.target);
            if (a !== b) parent.set(a, b);
        }
    }
    const groups = new Map();
    for (const f of files) { const k = find(f); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(f); }
    return Array.from(groups.values()).filter((g) => g.length > 1)
        .map((g) => ({ files: g.sort(), size: g.reduce((a, f) => a + sizeOf(f), 0) }))
        .sort((a, b) => b.size - a.size);
}

/* the chain of files from an entry point to p */
function chain(reached, p, max) {
    const out = [];
    let cur = p;
    for (let i = 0; i < (max || 12) && cur; i++) {
        const info = reached.get(cur);
        if (!info) break;
        out.push(cur);
        cur = info.from;
    }
    return out.reverse();
}

module.exports = { reach, orphanGroups, chain, named, stemOf, tokenize, patternFiles };

if (require.main === module) {
    require('./audit').main(['--quiet-files'].concat(process.argv.slice(2)));
}
