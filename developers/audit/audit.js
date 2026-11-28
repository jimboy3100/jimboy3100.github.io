#!/usr/bin/env node
// Repository audit: inventory, identical files, references, reachability from the supported entry
// points, references from the other repositories (Expanding Land, its help site, LegendWorld, Delta),
// references to missing files, and a class for EVERY tracked file:
//   ACTIVE         reached from an entry point (play.html, index.html, the sitemap pages, the userscript,
//                  the extension, LMexpress, LMmobile, the apps, knowledge/, public-urls.json)
//   COMPATIBILITY  kept for old installations / old links / other sites (public-urls.json, other repositories)
//   GENERATED      written by a build script (exceptions.json rules)
//   DEVELOPMENT    tests, tools, sources, repository notes (exceptions.json rules)
//   HISTORICAL     archived pages and snapshots, and files only they use
//   DUPLICATE      not used, and the same bytes are in a used file
//   UNKNOWN        not reached, but its name is written in a used file, in a comment, or it fits a
//                  dynamic path pattern: check by hand before deleting
//   UNREACHABLE    no reference of any kind found (still not enough on its own to delete: old
//                  installations and other sites may load it by URL)
// Output (ignored by git): developers/tests/out/audit/ summary.txt, classification.json/.csv,
// duplicates.json, reachability.json, references.json, missing.json, crossrepo.json, inventory.json,
// network.json (files the recorded headless runs loaded: network.js) and, with --perceptual, perceptual.json
// (pictures that look the same but differ in bytes: perceptual.js, headless Chrome when found).
// Usage: node developers/audit/audit.js [--out DIR] [--no-cross] [--top N] [--quiet] [--network DIR] [--perceptual]
'use strict';
const fs = require('fs');
const path = require('path');
const { inventory, textFiles, readTexts, otherRepoTexts, globMatcher, readJson, git } = require('./inventory');
const R = require('./references');
const { duplicateGroups, folderPairs } = require('./duplicates');
const { reach, orphanGroups, chain, named } = require('./reachability');
const { runtimeLoaded } = require('./network');

const CLASSES = ['ACTIVE', 'COMPATIBILITY', 'GENERATED', 'DEVELOPMENT', 'DUPLICATE', 'HISTORICAL', 'UNREACHABLE', 'UNKNOWN'];

/* folder that holds the other repositories (next to the main checkout, also from a worktree) */
function reposBase(repo) {
    if (process.env.LM_AUDIT_REPOS) return path.resolve(process.env.LM_AUDIT_REPOS);
    try {
        const common = git(repo, ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim();
        return path.dirname(path.dirname(path.resolve(common)));
    } catch (e) { return path.dirname(repo); }
}

/**
 * Inventory + references of every text file.
 * @param {string} repo
 * @param {{cross?: boolean}} [opts]
 */
function load(repo, opts) {
    opts = opts || {};
    repo = path.resolve(repo);
    const inv = inventory(repo);
    const cfg = R.loadConfig(repo);
    const ex = readJson(path.join(repo, 'developers', 'audit', 'exceptions.json'));
    const readText = (rel) => {
        if (texts.has(rel)) return texts.get(rel);
        return fs.readFileSync(path.join(repo, rel), 'utf8');
    };
    const textRels = textFiles(inv);
    const texts = readTexts(inv, textRels);
    const scan = R.scanFiles(repo, textRels, { cfg, inv }, readText);
    const ctx = { repo, inv, cfg, ex, readText, scan, textRels, cross: [] };
    ctx.basesUnused = narrowBases(scan, ex.dynamicBases);
    if (opts.cross !== false) ctx.cross = loadCross(ctx);
    return ctx;
}

/* exceptions.json dynamicBases: a folder base the scan sees as 'dir/' + anything (var IMG = '.../banners/')
   whose every use adds a known subfolder is narrowed to it (narrowTo), or dropped without narrowTo;
   returns the entries that matched nothing (stale) */
function narrowBases(scan, list) {
    const unused = [];
    for (const e of list || []) {
        const from = globMatcher([e.from]);
        let hit = 0;
        for (const [rel, r] of scan) {
            if (!from(rel)) continue;
            r.patterns = r.patterns.filter((pt) => {
                if (pt.prefix !== e.prefix || pt.suffix) return true;
                hit++;
                if (!e.narrowTo) return false;
                pt.prefix = e.narrowTo;
                return true;
            });
        }
        if (!hit) unused.push(e.from + ' ' + e.prefix);
    }
    return unused;
}

function loadCross(ctx) {
    const base = reposBase(ctx.repo);
    const out = [];
    for (const r of ctx.cfg.pu.crossRepos || []) {
        const dir = path.resolve(base, r.path.replace(/^\.\.\//, ''));
        if (!fs.existsSync(path.join(dir, '.git')) || path.resolve(dir) === ctx.repo) { out.push({ name: r.name, dir, present: false }); continue; }
        const texts = otherRepoTexts(dir) || new Map();
        const scan = new Map();
        for (const [rel, t] of texts) {
            if (t.indexOf('legendmod') < 0 && t.indexOf('jimboy') < 0) continue;
            const res = R.extract(rel, t, { cfg: ctx.cfg, inv: ctx.inv, external: true });
            if (res.refs.length) scan.set(rel, res);
        }
        out.push({ name: r.name, dir, present: true, files: texts.size, scan });
    }
    return out;
}

/* references (not in comments) to files that are not on the site; comments listed apart */
function missingRefs(ctx) {
    const ignore = globMatcher(ctx.ex.integrityIgnoreSources || []);
    const out = [];
    const take = (from, r, repoName) => {
        if (!r.strict || (r.status !== 'missing' && r.status !== 'case')) return;
        out.push({ from: repoName ? repoName + ':' + from : from, line: r.line, kind: r.kind, raw: r.raw, path: r.path,
            actual: r.actual, comment: !!r.comment, ignored: !repoName && !!ignore(from) });
    };
    for (const [from, res] of ctx.scan) for (const r of res.refs) take(from, r);
    for (const c of ctx.cross) if (c.present) for (const [from, res] of c.scan) for (const r of res.refs) take(from, r, c.name);
    return out;
}

/* an allowed entry matches by source file (or glob) and missing site path; without 'paths' any path */
function allowedMatcher(list) {
    const items = (list || []).map((e) => ({ e, from: globMatcher([e.from]), paths: e.paths || (e.path ? [e.path] : null), used: new Set() }));
    return {
        items,
        find(m) {
            for (const it of items) {
                if (!it.from(m.from)) continue;
                if (it.paths && it.paths.indexOf(m.path) < 0) continue;
                it.used.add(m.path);
                return it.e;
            }
            return null;
        },
        /* allowed paths that are no longer missing (fixed: the entry can go) */
        stale() {
            const out = [];
            for (const it of items) {
                if (!it.paths) { if (!it.used.size) out.push(it.e.from); continue; }
                for (const p of it.paths) if (!it.used.has(p)) out.push(it.e.from + ' -> ' + p);
            }
            return out;
        }
    };
}

function classify(ctx) {
    const { inv, scan, cfg, ex } = ctx;
    const sizeOf = (p) => { const f = inv.byPath.get(p); return f ? f.size : 0; };
    const exp = (list) => {
        const m = new Map();
        for (const e of list || []) {
            const g = globMatcher([e.path || e.glob]);
            for (const p of inv.sorted) if (g(p) && !m.has(p)) m.set(p, e.why || '');
        }
        return m;
    };
    /* entry points */
    const roots = exp(cfg.pu.entryPoints);
    for (const sm of cfg.pu.sitemaps || []) {
        let xml = '';
        try { xml = ctx.readText(sm); } catch (e) { continue; }
        for (const l of xml.match(/<loc>[^<]+<\/loc>/g) || []) {
            const u = /^(?:https?:)?\/\/([^/]+)(\/[^?#]*)?/i.exec(l.replace(/<\/?loc>/g, '').trim());
            if (!u) continue;
            const c = R.classifyUrl(u[1], u[2], cfg);
            if (!c || c.kind !== 'url') continue;
            const res = R.resolvePath(c.path.replace(/^\/+/, ''), inv);
            if (res.status === 'ok' && !roots.has(res.path)) roots.set(res.path, 'page in ' + sm);
        }
    }
    const collection = globMatcher(cfg.pu.dataDrivenCollections || []);
    const A = reach({ inv, scan, roots, collection, readText: ctx.readText });

    /* compatibility: public-urls.json and files other repositories use */
    const compatRoots = exp(cfg.pu.compatibility);
    const external = new Map();
    for (const c of ctx.cross) {
        if (!c.present) continue;
        for (const [from, res] of c.scan) {
            for (const r of res.refs) {
                if (r.comment || r.status !== 'ok' || !r.target) continue;
                if (!external.has(r.target)) external.set(r.target, []);
                const list = external.get(r.target);
                if (list.length < 8) list.push(c.name + ':' + from + ':' + r.line);
                if (!compatRoots.has(r.target)) compatRoots.set(r.target, 'used by ' + c.name + ' (' + from + ':' + r.line + ')');
            }
        }
    }
    const C = reach({ inv, scan, roots: compatRoots, already: new Set(A.reached.keys()), tokens: A.tokens, allTokens: A.allTokens, collection, readText: ctx.readText });

    /* historical: archived pages, snapshots */
    const rule = globMatcher(ex.rules || []);
    let archived = {};
    try { archived = readJson(path.join(ctx.repo, 'developers', 'i18n', 'scan-config.json')).archived || {}; } catch (e) { archived = {}; }
    const histRoots = new Map();
    Object.keys(archived).forEach((p) => histRoots.set(p, 'archived page (scan-config.json): ' + archived[p]));
    for (const [p, w] of exp(ex.historicalRoots)) histRoots.set(p, w);
    for (const p of inv.sorted) { const r = rule(p); if (r && r.class === 'HISTORICAL' && !histRoots.has(p)) histRoots.set(p, r.why); }
    const used = new Set([...A.reached.keys(), ...C.reached.keys()]);
    const H = reach({ inv, scan, roots: histRoots, already: used, tokens: new Set(), readText: ctx.readText });

    /* mentions in comments of active files */
    const commentMention = new Map();
    for (const p of A.reached.keys()) {
        const res = scan.get(p);
        if (!res) continue;
        for (const r of res.refs) if (r.comment && r.target && !commentMention.has(r.target)) commentMention.set(r.target, p + ':' + r.line);
    }

    const groups = duplicateGroups(inv);
    const groupOf = new Map();
    groups.forEach((g, i) => g.paths.forEach((p) => groupOf.set(p, i)));

    const files = [];
    const first = new Map();
    for (const f of inv.files) {
        const p = f.path;
        const r = rule(p);
        let cls, why, from;
        if (r && (r.class === 'GENERATED' || r.class === 'DEVELOPMENT' || r.class === 'COMPATIBILITY')) { cls = r.class; why = r.why; }
        else if (A.reached.has(p)) { cls = 'ACTIVE'; const i = A.reached.get(p); why = i.kind === 'entry' ? 'entry point: ' + i.why : i.kind === 'dynamic' ? 'dynamic ' + i.pattern + (i.why ? ' (' + i.why + ')' : '') : i.kind; from = chain(A.reached, p); }
        else if (C.reached.has(p)) { cls = 'COMPATIBILITY'; const i = C.reached.get(p); why = i.kind === 'entry' ? i.why : 'used by a compatibility file (' + i.kind + ')'; from = chain(C.reached, p); }
        else if (H.reached.has(p)) { cls = 'HISTORICAL'; const i = H.reached.get(p); why = i.kind === 'entry' ? i.why : 'used only by historical files'; from = chain(H.reached, p); }
        first.set(p, { cls, why, from, rule: r });
    }
    /* duplicates and unknowns need the classes above */
    const usedClass = (q) => { const c = first.get(q); return c && (c.cls === 'ACTIVE' || c.cls === 'COMPATIBILITY' || c.cls === 'GENERATED'); };
    for (const f of inv.files) {
        const p = f.path;
        const c = first.get(p);
        let { cls, why, from } = c;
        if (!cls) {
            const gi = groupOf.get(p);
            const partner = gi === undefined ? null : groups[gi].paths.find((q) => q !== p && usedClass(q));
            if (partner) { cls = 'DUPLICATE'; why = 'same bytes as ' + partner; }
            else if (A.candidates.has(p)) { cls = 'UNKNOWN'; const k = A.candidates.get(p); why = 'fits the dynamic path ' + k.pattern + ' of ' + k.from + ':' + k.line + ', name not found'; }
            else if (commentMention.has(p)) { cls = 'UNKNOWN'; why = 'only in a comment of ' + commentMention.get(p); }
            else if (named(p, A.allTokens)) { cls = 'UNKNOWN'; why = 'its name is written in an active file'; }
            else { cls = 'UNREACHABLE'; why = 'no reference found'; }
        }
        const rec = { path: p, class: cls, why, size: f.size, blob: f.blob };
        if (from && from.length > 1) rec.from = from;
        if (external.has(p)) rec.externalUsers = external.get(p);
        const gi = groupOf.get(p);
        if (gi !== undefined) rec.duplicates = groups[gi].paths.filter((q) => q !== p).slice(0, 10);
        if (c.rule && c.rule.class === 'HISTORICAL' && cls === 'ACTIVE') rec.note = 'listed as historical in exceptions.json but an active file uses it';
        if (archived[p] && cls === 'ACTIVE') rec.note = 'archived in scan-config.json but an active file uses it';
        files.push(rec);
    }
    const byPath = new Map(files.map((x) => [x.path, x]));
    const orphans = orphanGroups(files.filter((x) => x.class === 'UNREACHABLE' || x.class === 'UNKNOWN' || x.class === 'HISTORICAL' || x.class === 'DUPLICATE').map((x) => x.path), scan, sizeOf);
    return { files, byPath, groups, A, C, H, roots, compatRoots, histRoots, external, orphans };
}

function mib(n) { return (n / 1048576).toFixed(2) + ' MiB'; }

function summarize(ctx, res, missing, top) {
    const lines = [];
    const totals = {};
    CLASSES.forEach((c) => { totals[c] = { files: 0, bytes: 0 }; });
    for (const f of res.files) { totals[f.class].files++; totals[f.class].bytes += f.size; }
    const all = res.files.reduce((a, f) => a + f.size, 0);
    lines.push('Legend Mod repository audit');
    lines.push(res.files.length + ' tracked files, ' + mib(all));
    lines.push('');
    lines.push('Classes');
    CLASSES.forEach((c) => lines.push('  ' + c.padEnd(14) + String(totals[c].files).padStart(6) + ' files ' + mib(totals[c].bytes).padStart(12)));
    lines.push('');
    const waste = res.groups.reduce((a, g) => a + g.redundant, 0);
    lines.push('Identical files: ' + res.groups.length + ' groups, ' + res.groups.reduce((a, g) => a + g.count - 1, 0) + ' extra copies, ' + mib(waste));
    lines.push('Folder pairs holding the same files:');
    folderPairs(res.groups).slice(0, 12).forEach((p) => lines.push('  ' + p.pair.padEnd(48) + String(p.count).padStart(6) + ' ' + mib(p.bytes).padStart(12)));
    lines.push('');
    const cls = (p) => res.byPath.get(p).class;
    lines.push('Top candidate groups by size (identical files, at least one copy not used):');
    res.groups.filter((g) => g.paths.some((p) => cls(p) !== 'ACTIVE' && cls(p) !== 'GENERATED')).slice(0, top).forEach((g) => {
        lines.push('  ' + mib(g.redundant).padStart(10) + '  ' + g.paths.map((p) => p + ' [' + cls(p) + ']').join('  =  '));
    });
    lines.push('');
    lines.push('Top identical groups where every copy is used (need an address migration first):');
    res.groups.filter((g) => g.paths.every((p) => cls(p) === 'ACTIVE' || cls(p) === 'GENERATED')).slice(0, Math.min(top, 10)).forEach((g) => {
        lines.push('  ' + mib(g.redundant).padStart(10) + '  ' + g.paths.join('  =  '));
    });
    lines.push('');
    lines.push('Groups of files that only reference each other (not reached from any entry point):');
    res.orphans.slice(0, top).forEach((g) => lines.push('  ' + mib(g.size).padStart(10) + '  ' + g.files.length + ' files: ' + g.files.slice(0, 6).join(', ') + (g.files.length > 6 ? ', ...' : '')));
    lines.push('');
    const byDir = {};
    for (const f of res.files) {
        if (f.class !== 'UNREACHABLE' && f.class !== 'UNKNOWN' && f.class !== 'DUPLICATE' && f.class !== 'HISTORICAL') continue;
        const d = f.path.indexOf('/') < 0 ? '.' : f.path.slice(0, f.path.indexOf('/'));
        const k = d + ' ' + f.class;
        if (!byDir[k]) byDir[k] = { k, files: 0, bytes: 0 };
        byDir[k].files++; byDir[k].bytes += f.size;
    }
    lines.push('Not used, by top folder:');
    Object.values(byDir).sort((a, b) => b.bytes - a.bytes).slice(0, 30).forEach((x) => lines.push('  ' + x.k.padEnd(36) + String(x.files).padStart(6) + ' ' + mib(x.bytes).padStart(12)));
    lines.push('');
    const live = missing.filter((m) => !m.comment && !m.ignored);
    lines.push('References to missing files: ' + live.length + ' (+' + missing.filter((m) => m.comment).length + ' in comments, ' + missing.filter((m) => m.ignored && !m.comment).length + ' in ignored sources)');
    live.slice(0, top).forEach((m) => lines.push('  ' + m.from + ':' + m.line + '  ' + m.raw + (m.actual ? '  (case differs: ' + m.actual + ')' : '')));
    lines.push('');
    lines.push('Other repositories:');
    for (const c of ctx.cross) lines.push('  ' + c.name.padEnd(18) + (c.present ? c.files + ' text files, ' + c.scan.size + ' reference Legend Mod' : 'not found at ' + c.dir));
    lines.push('  ' + res.external.size + ' Legend Mod files are used by other repositories');
    if (res.network) {
        lines.push('');
        const odd = res.files.filter((f) => f.runtimeRuns && f.class !== 'ACTIVE' && f.class !== 'GENERATED' && f.class !== 'DEVELOPMENT');
        lines.push('Runtime network recording: ' + res.network.runs + ' recorded headless runs loaded ' + res.network.paths.size + ' repository files' +
            (res.network.runs ? '; loaded at run time but not reached by the static scan: ' + odd.length : ' (none recorded: run developers/tests/run.js or smoke.js first)'));
        odd.slice(0, top).forEach((f) => lines.push('  ' + f.path + ' [' + f.class + '] loaded in ' + f.runtimeRuns + ' runs'));
    }
    const conflicts = res.files.filter((f) => f.note);
    if (conflicts.length) {
        lines.push('');
        lines.push('Archived / historical but still used:');
        conflicts.forEach((f) => lines.push('  ' + f.path + ' <- ' + (f.from ? f.from.slice(-2, -1)[0] : '?') + '  (' + f.note + ')'));
    }
    return { text: lines.join('\n') + '\n', totals };
}

function main(argv) {
    argv = argv || process.argv.slice(2);
    const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
    const repo = path.resolve(opt('--repo', path.join(__dirname, '..', '..')));
    const out = path.resolve(opt('--out', path.join(repo, 'developers', 'tests', 'out', 'audit')));
    const top = +opt('--top', 25);
    const t0 = Date.now();
    const ctx = load(repo, { cache: true, cross: argv.indexOf('--no-cross') < 0 });
    const missing = missingRefs(ctx);
    const res = classify(ctx);
    /* runtime evidence: what the recorded headless page loads asked for */
    res.network = runtimeLoaded(path.resolve(opt('--network', path.join(repo, 'developers', 'tests', 'out'))));
    for (const f of res.files) if (res.network.paths.has(f.path)) f.runtimeRuns = res.network.paths.get(f.path);
    const sum = summarize(ctx, res, missing, top);
    fs.mkdirSync(out, { recursive: true });
    const w = (name, data) => fs.writeFileSync(path.join(out, name), typeof data === 'string' ? data : JSON.stringify(data, null, 1));
    w('summary.txt', sum.text);
    w('classification.json', { generated: new Date().toISOString(), totals: sum.totals, files: res.files });
    w('classification.csv', 'path,class,size,why\n' + res.files.map((f) => [f.path, f.class, f.size, f.why].map((v) => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n') + '\n');
    w('inventory.json', ctx.inv.files.map((f) => ({ path: f.path, size: f.size, blob: f.blob, ext: f.ext })));
    w('duplicates.json', { groups: res.groups.map((g) => Object.assign({}, g, { classes: g.paths.map((p) => res.byPath.get(p).class) })), folderPairs: folderPairs(res.groups) });
    const obj = (m) => { const o = {}; for (const [k, v] of m) o[k] = v; return o; };
    w('reachability.json', { entryPoints: obj(res.roots), compatibilityRoots: obj(res.compatRoots), historicalRoots: obj(res.histRoots),
        active: obj(res.A.reached), compatibility: obj(res.C.reached), historical: obj(res.H.reached), dynamicCandidates: obj(res.A.candidates), orphanGroups: res.orphans });
    const refs = {};
    for (const [rel, r] of ctx.scan) {
        const list = r.refs.filter((x) => x.status !== 'unresolved').map((x) => ({ line: x.line, kind: x.kind, raw: x.raw, status: x.status, target: x.target, comment: x.comment || undefined }));
        if (list.length || r.patterns.length) refs[rel] = { refs: list, patterns: r.patterns.map((p) => ({ line: p.line, prefix: p.prefix, suffix: p.suffix, how: p.how, comment: p.comment || undefined })) };
    }
    w('references.json', refs);
    w('missing.json', missing);
    w('network.json', { runs: res.network.runs, loaded: obj(res.network.paths) });
    w('crossrepo.json', ctx.cross.map((c) => ({ name: c.name, dir: c.dir, present: c.present, files: c.files,
        references: c.present ? Array.from(c.scan).map(([f, r]) => ({ file: f, refs: r.refs.map((x) => ({ line: x.line, kind: x.kind, raw: x.raw, status: x.status, target: x.target, comment: x.comment || undefined })) })) : [] })));
    if (argv.indexOf('--quiet') < 0) process.stdout.write(sum.text);
    console.log('written to ' + out + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
    return { ctx, res, missing };
}

module.exports = { load, loadCross, narrowBases, missingRefs, allowedMatcher, classify, summarize, main, CLASSES, reposBase };

if (require.main === module) {
    const argv = process.argv.slice(2);
    const r = main(argv);
    if (argv.indexOf('--perceptual') >= 0) {
        const oi = argv.indexOf('--out');
        const out = path.resolve(oi >= 0 ? argv[oi + 1] : path.join(r.ctx.repo, 'developers', 'tests', 'out', 'audit'));
        const cls = (p) => (r.res.byPath.get(p) || {}).class;
        require('./perceptual').perceptualGroups(r.ctx.inv, r.ctx.repo).then((pg) => {
            pg.groups.forEach((g) => { g.classes = g.paths.map(cls); });
            fs.writeFileSync(path.join(out, 'perceptual.json'), JSON.stringify(pg, null, 1));
            console.log('perceptual duplicates: ' + pg.groups.length + ' groups (' + pg.hashed + ' pictures hashed by ' + pg.decoder + ', ' + pg.skipped.notDecoded + ' not decoded), perceptual.json written');
        });
    }
}
