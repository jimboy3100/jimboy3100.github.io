#!/usr/bin/env node
// Pages outside the live site, as recorded in developers/i18n/scan-config.json:
// - "archived" { file: why }: kept in the tree but unreachable. The file exists and no file of the repo
//   links to it outside comments, except from a function that nothing calls (DEAD_FN below).
// - "redirects" { file: why }: compatibility pages that only forward old links. The file exists, sends the
//   visitor to a page that exists (meta refresh and location.replace agree), is noindex and loads nothing.
// - "deleted" { file: why } and "deletedAssets" { file: page it belonged to }: removed with their own
//   CSS/JS/images/media. They are gone, nothing in the repo refers to them any more (not even a comment),
//   each asset belonged to a deleted page (or to a deleted file of one), and each has a record in
//   developers/audit/manifest.json.
// - every reference into the subfolders of those files (extras/website/normalize.css ...) resolves.
// The whole repo is searched (every tracked text file: pages, scripts, userscripts, extension, knowledge,
// languages, tests, scripts/*.ps1); only the records of the deletion are left out (RECORDS). The checkouts
// of expanding.land, help.expanding.land, LegendWorld and Delta (CROSS_EL_DIR, CROSS_HELP_DIR, CROSS_LW_DIR,
// CROSS_DELTA_DIR, else next to this repo; skipped when not there) must not load a deleted file either.
// Usage: node developers/tests/i18n-archived.js [repo]
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
const config = JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'i18n', 'scan-config.json'), 'utf8'));
const archived = Object.keys(config.archived || {});
const redirects = Object.keys(config.redirects || {});
const deleted = Object.keys(config.deleted || {});
const deletedAssets = config.deletedAssets || {};
const gone = deleted.concat(Object.keys(deletedAssets));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

/* a link that sits inside a function no live code calls (the call is commented out): { file: function } */
const DEAD_FN = {};
/* the records of the deletion itself, and the concatenated source export that nothing loads */
const RECORDS = new Set(['developers/i18n/scan-config.json', 'developers/audit/manifest.json',
    'developers/tests/i18n-archived.js', 'AllFilesNew.txt']);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exists = (rel) => { try { return fs.statSync(path.join(repo, rel)).isFile(); } catch (e) { return false; } };
const strip = (src, file) => (/\.html?$/i.test(file) ? src.replace(/<!--[\s\S]*?-->/g, ' ') : src)
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\'"])\/\/[^\n]*/g, '$1');

/* how a file is referred to: its path (from any origin, or relative), and its own name when that name
 * is not a generic one (then folder/name); a folder's index.html is also linked as the folder */
const GENERIC = /^(index\d*\.html?|bundle(new)?\.css|style(sheet)?\.css|main\.js)$/i;
const needle = (rel) => {
    const b = path.posix.basename(rel);
    return GENERIC.test(b) ? path.posix.basename(path.posix.dirname(rel)) + '/' + b : b;
};
function refRe(rel) {
    const alts = [esc(rel), esc(needle(rel))];
    if (/^index\.html?$/i.test(path.posix.basename(rel))) alts.push(esc(path.posix.dirname(rel)) + '/(?=["\'#?\\s<)`]|$)');
    /* not inside a longer name (loader.html is not $.preloader.html(), 5agario.html is not x5agario.html) */
    return new RegExp('(^|[^\\w.-])(' + alts.join('|') + ')', 'm');
}
/* git grep -l: the tracked text files of a checkout that contain any of the strings */
function grepFiles(dir, strings) {
    if (!strings.length) return [];
    const args = ['grep', '-I', '-l', '-F'];
    strings.forEach((s) => args.push('-e', s));
    try { return execFileSync('git', args, { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n').filter(Boolean); }
    catch (e) { return (e.stdout || '').split('\n').filter(Boolean); }
}
const read = (dir, f) => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch (e) { return ''; } };
const lineOf = (src, i) => src.slice(0, i).split('\n').length;

/* every file is in one list only */
const seen = {};
[['archived', archived], ['redirects', redirects], ['deleted', deleted], ['deletedAssets', Object.keys(deletedAssets)]].forEach(([k, list]) => {
    list.forEach((f) => { ok(!seen[f], f + ' is in both "' + seen[f] + '" and "' + k + '"'); seen[f] = k; });
});

/* archived: kept, unreachable from any file outside comments */
archived.forEach((a) => {
    ok(exists(a), 'archived file is missing: ' + a);
    const re = refRe(a);
    const hits = grepFiles(repo, [needle(a)]).filter((f) => f !== a && !RECORDS.has(f) && archived.indexOf(f) < 0)
        .map((f) => ({ f, src: strip(read(repo, f), f) })).filter((x) => re.test(x.src));
    const fn = DEAD_FN[a];
    if (!fn) { ok(hits.length === 0, a + ' is linked from live code: ' + hits.map((h) => h.f).join(', ')); return; }
    /* every link sits in that function, and no live code calls it */
    const callRe = new RegExp('(^|[^\\w$.])' + fn + '\\s*\\(', 'g');
    const defRe = new RegExp('function\\s+' + fn + '\\s*\\(', 'g');
    const calls = grepFiles(repo, [fn]).filter((f) => !RECORDS.has(f)).map((f) => strip(read(repo, f), f))
        .reduce((n, src) => n + (src.match(callRe) || []).length - (src.match(defRe) || []).length, 0);
    ok(calls === 0, a + ': ' + fn + '() is called ' + calls + ' time(s)');
    hits.forEach((h) => {
        const at = h.src.search(re);
        const d = h.src.lastIndexOf('function ', at);
        ok(d >= 0 && h.src.slice(d, d + 9 + fn.length) === 'function ' + fn, a + ' is linked from ' + h.f + ' outside ' + fn + '()');
    });
});

/* redirects: forward to a page that exists */
const toRel = (u) => {
    const m = /^(?:https?:)?\/\/(?:www\.)?(?:legendmod\.ml|jimboy3100\.github\.io)(\/[^?#]*)?/.exec(u);
    if (!m) return null;
    let p = decodeURIComponent((m[1] || '/').replace(/^\//, ''));
    if (p === '' || p.endsWith('/')) p += 'index.html';
    return p;
};
redirects.forEach((r) => {
    ok(exists(r), 'compatibility redirect is missing: ' + r);
    const html = read(repo, r);
    const meta = /<meta\s+http-equiv=["']refresh["']\s+content=["']\s*\d+\s*;\s*url=([^"']+)["']/i.exec(html);
    const js = /location\.replace\(\s*['"]([^'"]+)['"]/.exec(html);
    ok(!!meta, r + ': no <meta http-equiv="refresh"> redirect');
    if (meta) {
        const t = toRel(meta[1]);
        ok(!!t && exists(t), r + ': redirects to ' + meta[1] + ', which is not a page of this site');
        ok(!js || js[1] === meta[1], r + ': location.replace(' + (js && js[1]) + ') and the meta refresh (' + meta[1] + ') disagree');
    }
    ok(/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html), r + ': not noindex');
    ok(!/<script[^>]+src=/i.test(html) && !/<link[^>]+rel=["']stylesheet/i.test(html), r + ': loads scripts or stylesheets (a redirect needs none)');
});

/* deleted: gone, and referred to by nothing */
gone.forEach((g) => ok(!exists(g), 'deleted file is back: ' + g));
Object.keys(deletedAssets).forEach((a) => {
    const owner = deletedAssets[a];
    ok(deleted.indexOf(owner) >= 0 || !!deletedAssets[owner], a + ' belonged to ' + owner + ', which is not deleted');
});
const res = gone.map((g) => [g, refRe(g)]);
grepFiles(repo, [...new Set(gone.map(needle))]).filter((f) => !RECORDS.has(f)).forEach((f) => {
    const src = read(repo, f);
    res.forEach(([g, re]) => {
        const m = re.exec(src);
        if (m) ok(false, g + ' is deleted but ' + f + ':' + lineOf(src, m.index) + ' still refers to it');
    });
});

/* nothing refers to a missing file of the folders the deleted files and redirects were in */
/* subfolders only: banners/ and extras/ are shared by everything, their deleted files are checked above */
const dirs = [...new Set(gone.concat(redirects).map((f) => path.posix.dirname(f)))].filter((d) => d.indexOf('/') > 0);
const dirRe = new RegExp('(?:(?:https?:)?//(?:www\\.)?(?:legendmod\\.ml|jimboy3100\\.github\\.io)/|["\'(=]/)(' +
    dirs.map(esc).join('|') + ')/([\\w%~@+-][\\w.%~@+-]*\\.[A-Za-z0-9]{2,5})(?=[?#"\'\\s)<`\\\\]|$)', 'g');
let dirRefs = 0;
grepFiles(repo, dirs.map((d) => d + '/')).filter((f) => !RECORDS.has(f)).forEach((f) => {
    const src = read(repo, f);
    let m;
    dirRe.lastIndex = 0;
    while ((m = dirRe.exec(src))) {
        let rel = m[1] + '/' + m[2];
        try { rel = decodeURIComponent(rel); } catch (e) { }
        dirRefs++;
        ok(exists(rel), f + ':' + lineOf(src, m.index) + ' refers to ' + rel + ', which does not exist');
    }
});

/* every deleted file has its record in the deletion manifest */
let manifest = null;
try { manifest = JSON.parse(read(repo, 'developers/audit/manifest.json')); } catch (e) { }
ok(!gone.length || !!manifest, 'developers/audit/manifest.json is missing or not JSON');
const records = manifest ? (Array.isArray(manifest) ? manifest : manifest.records || []) : [];
const byPath = {};
records.forEach((r) => { if (r && r.oldPath) byPath[r.oldPath] = r; });
gone.forEach((g) => {
    const r = byPath[g];
    ok(!!r, g + ': no record in developers/audit/manifest.json');
    if (!r) return;
    ['canonicalPath', 'reason', 'internalReferencesMigrated', 'legacyResolverSupported', 'externalUrlSupported', 'approvedForDeletion']
        .forEach((k) => ok(k in r, g + ': manifest record has no "' + k + '"'));
    ok(r.internalReferencesMigrated === true && r.approvedForDeletion === true, g + ': deleted but its manifest record is not migrated and approved');
});

/* the sibling sites must not load a deleted file of this one (they use absolute URLs) */
const parent = path.resolve(repo, '..');
const SIBLINGS = [['expanding.land', process.env.CROSS_EL_DIR || path.join(parent, 'expandingland')],
    ['help.expanding.land', process.env.CROSS_HELP_DIR || path.join(parent, 'legendworld-help')],
    ['LegendWorld', process.env.CROSS_LW_DIR || path.join(parent, 'LegendWorld')],
    ['Delta', process.env.CROSS_DELTA_DIR || path.join(parent, 'deltav4')]];
let sibs = 0;
const urlRes = gone.map((g) => [g, new RegExp('(?:legendmod\\.ml|jimboy3100\\.github\\.io)/' + esc(g) + '(?![\\w.-])')]);
SIBLINGS.forEach(([name, dir]) => {
    if (!fs.existsSync(path.join(dir, '.git'))) { console.log('skip ' + name + ': no checkout at ' + dir); return; }
    sibs++;
    grepFiles(dir, gone).forEach((f) => {
        const src = read(dir, f);
        urlRes.forEach(([g, re]) => ok(!re.test(src), name + ' ' + f + ' loads ' + g + ', which is deleted'));
    });
});

console.log(archived.length + ' archived, ' + redirects.length + ' compatibility redirects, ' + deleted.length + ' deleted pages, ' +
    Object.keys(deletedAssets).length + ' deleted assets checked; ' + dirRefs + ' references into their folders resolve; ' + sibs + ' sibling checkouts searched');
console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
