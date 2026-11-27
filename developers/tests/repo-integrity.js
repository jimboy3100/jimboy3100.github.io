#!/usr/bin/env node
// Repository integrity: no reference to a file that is not on the site.
// - every text file of the repository (HTML attributes, CSS url() / @import, extension and web app
//   manifests, userscript metadata, and absolute www.legendmod.ml / legendmod.ml / jimboy3100.github.io
//   addresses anywhere) is read by developers/audit/references.js; a complete reference (not a dynamic
//   'dir/' + name pattern, not inside a comment) must resolve on GitHub Pages: exact letter case,
//   folder index.html, extensionless .html;
// - the same for the Legend Mod addresses used by the other repositories next to this one (Expanding
//   Land, its help site, LegendWorld, Delta), when they are there: deleting a file they load fails here;
// - known old broken references are listed, with the reason, in developers/audit/exceptions.json
//   "missingAllowed" (a listed path that is found again is reported, so the entry can go);
// - developers/audit/manifest.json (deleted / moved files) is well formed (manifestrefs.js checks its approval rule).
// Usage: node developers/tests/repo-integrity.js [--no-cross] [--list] [--comments]
//   --list      print every reference to a missing file as JSON (for exceptions.json)
//   --comments  also print references to missing files found inside comments (not failures)
'use strict';
const path = require('path');
const A = require('../audit/audit');
const R = require('../audit/references');
const { readJson } = require('../audit/inventory');

const repo = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);
const t0 = Date.now();
let fails = 0;
const fail = (m) => { fails++; console.log('FAIL ' + m); };

const ctx = A.load(repo, { cross: argv.indexOf('--no-cross') < 0 });
const missing = A.missingRefs(ctx);
const allowed = A.allowedMatcher(ctx.ex.missingAllowed);
const live = missing.filter((m) => !m.comment && !m.ignored);
if (argv.indexOf('--list') >= 0) { console.log(JSON.stringify(live, null, 1)); process.exit(0); }

const seen = new Set();
let known = 0, defects = 0;
for (const m of live) {
    const key = m.from + '|' + m.path;
    const a = allowed.find(m);
    if (a) { if (!seen.has(key)) { known++; if (a.defect) defects++; } seen.add(key); continue; }
    if (seen.has(key)) continue;
    seen.add(key);
    fail(m.from + ':' + m.line + ' refers to ' + m.raw + (m.actual
        ? ' - the file is ' + m.actual + ' (GitHub Pages is case-sensitive)'
        : ' - ' + (m.path || '(site root)') + ' is not in the repository') +
        ' (fix the reference, or list it with the reason in developers/audit/exceptions.json "missingAllowed")');
}
for (const s of allowed.stale()) console.log('note: exceptions.json missingAllowed ' + s + ' is not missing any more; the entry can go');
if (argv.indexOf('--comments') >= 0) {
    for (const m of missing.filter((x) => x.comment)) console.log('comment: ' + m.from + ':' + m.line + ' ' + m.raw);
}

/* the deletion manifest */
const FIELDS = { oldPath: 'string', canonicalPath: 'string|null', reason: 'string', internalReferencesMigrated: 'boolean',
    legacyResolverSupported: 'boolean', externalUrlSupported: 'boolean', approvedForDeletion: 'boolean' };
let man = null;
try { man = readJson(path.join(repo, 'developers', 'audit', 'manifest.json')); } catch (e) { fail('developers/audit/manifest.json: ' + e.message); }
const records = man && Array.isArray(man.records) ? man.records : [];
if (man && !Array.isArray(man.records)) fail('developers/audit/manifest.json: "records" must be an array');
const olds = new Set();
records.forEach((r, i) => {
    const id = 'manifest.json record ' + i + (r && r.oldPath ? ' (' + r.oldPath + ')' : '');
    if (!r || typeof r !== 'object') { fail(id + ': not an object'); return; }
    for (const k of Object.keys(FIELDS)) {
        const type = r[k] === null ? 'null' : typeof r[k];
        if (FIELDS[k].split('|').indexOf(type) < 0) fail(id + ': ' + k + ' must be ' + FIELDS[k] + ' (is ' + type + ')');
    }
    if (typeof r.oldPath !== 'string') return;
    if (olds.has(r.oldPath)) fail(id + ': oldPath listed twice');
    olds.add(r.oldPath);
    if (typeof r.canonicalPath === 'string') {
        const res = R.resolvePath(r.canonicalPath, ctx.inv);
        if (res.status !== 'ok' && res.status !== 'dir') fail(id + ': canonicalPath ' + r.canonicalPath + ' is not in the repository');
    }
    /* the approval rule (migrated consumers, legacy and external evidence) is checked by manifestrefs.js */
});

const crossInfo = ctx.cross.map((c) => c.name + (c.present ? '' : ' (not found)')).join(', ');
console.log('repo-integrity: ' + ctx.scan.size + ' files read, ' + live.length + ' references to missing files (' + known +
    ' known, ' + defects + ' of them broken links still to fix), ' + missing.filter((m) => m.comment).length + ' more in comments, ' +
    records.length + ' manifest records' + (crossInfo ? '; other repositories: ' + crossInfo : '') + ' - ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
if (fails) { console.log(fails + ' failure(s)'); process.exit(1); }
console.log('repo-integrity: OK');
