#!/usr/bin/env node
// developers/audit/manifest.json: every file removed or moved for good (approvedForDeletion) is
// gone from the tree, its new place exists, and no tracked file still points at the old path
// (relative, root-relative or as a www.legendmod.ml / jimboy3100.github.io URL).
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

const raw = JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'audit', 'manifest.json'), 'utf8'));
const records = Array.isArray(raw) ? raw : (raw.records || raw.entries || []);
const KEYS = ['oldPath', 'canonicalPath', 'reason', 'internalReferencesMigrated', 'legacyResolverSupported', 'externalUrlSupported', 'approvedForDeletion'];
records.forEach((r, i) => KEYS.forEach((k) => ok(k in r, 'record ' + i + ' (' + r.oldPath + ') has no ' + k)));

const tracked = execSync('git -c core.quotepath=off ls-files', { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n').filter(Boolean);
const trackedSet = new Set(tracked);
/* files that may name removed paths: the manifest and the tests that check they stay removed */
const SKIP = new Set(['developers/audit/manifest.json', 'developers/tests/i18n-archived.js', 'developers/tests/manifestrefs.js', 'developers/tests/concatexport.js', 'developers/tests/swretire.js']);
/* the scanner's config: its lists of deleted pages and assets are records too, the rest (files to scan) is not */
const SCAN_CONFIG = 'developers/i18n/scan-config.json';
const RECORD_KEYS = ['deleted', 'deletedAssets'];
const TEXT = /\.(js|cjs|mjs|html?|css|json|jsonld|md|txt|xml|ps1|py|yml|yaml|ttl|rdf|webmanifest)$/i;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const gone = records.filter((r) => r.approvedForDeletion);
gone.forEach((r) => {
    ok(!trackedSet.has(r.oldPath), r.oldPath + ' is approved for deletion but still tracked');
    if (r.canonicalPath) ok(trackedSet.has(r.canonicalPath), r.oldPath + ': its new place ' + r.canonicalPath + ' is missing');
});
/* the old path as a path of its own: not the tail of a longer path, except after a site origin
 * (https://www.legendmod.ml/lib/sw.js) or as a root-relative path (/lib/sw.js) */
const patterns = gone.map((r) => ({
    r,
    re: new RegExp('(^|[^\\w./-]|(?:legendmod\\.ml|jimboy3100\\.github\\.io|jimboy3000\\.github\\.io)/|(?:^|[^\\w./-])/)' + esc(r.oldPath) + '(?![\\w-])')
}));
tracked.forEach((f) => {
    if (SKIP.has(f) || !TEXT.test(f)) return;
    let src;
    try { src = fs.readFileSync(path.join(repo, f), 'utf8'); } catch (e) { return; }
    if (f === SCAN_CONFIG) {
        try { const c = JSON.parse(src); RECORD_KEYS.forEach((k) => delete c[k]); src = JSON.stringify(c, null, 1); } catch (e) { }
    }
    patterns.forEach((p) => {
        const s = p.r.canonicalPath ? src.split(p.r.canonicalPath).join(' ') : src;
        if (p.re.test(s)) ok(false, f + ' still points at the removed ' + p.r.oldPath);
    });
});

console.log(records.length + ' manifest records, ' + gone.length + ' removed paths checked in ' + tracked.length + ' files');
console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
