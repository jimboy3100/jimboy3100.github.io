#!/usr/bin/env node
/*
 * Builds ogario/skinregistry.js, the skin asset registry read by ogario/skinresolver.js, from the
 * file hashes of vanillaskins/, lowresskins/ and agario/live/flags/ in this repository and of the
 * independent mirror https://jimboy3000.github.io/ (snapshot developers/skins/mirror-jimboy3000.txt).
 *
 * Files with the same bytes are one resource: the registry names one canonical path for them and
 * lists the other paths as aliases. Only hash-verified aliases are written; nothing is guessed from
 * names (no space/underscore or case folding: the hosting is case-sensitive).
 *
 *   node developers/skins/build-registry.js                 write ogario/skinregistry.js
 *   node developers/skins/build-registry.js --check         exit 1 if ogario/skinregistry.js is out of date
 *   node developers/skins/build-registry.js --manifest      also add/refresh the duplicate records in
 *                                                            developers/audit/manifest.json
 *   node developers/skins/build-registry.js --refresh-mirror  fetch the mirror's file list again (network)
 *   node developers/skins/build-registry.js --report        print the duplicate groups
 *   node developers/skins/build-registry.js --alias <path>=<canonical>@<sha>   record a downloaded copy
 *       that was not kept (scripts/skin-registry.ps1); the next build keeps <path> resolvable
 *
 * Registry fields (all paths are file paths, not URLs: "fungi_warlord%20.png" is a file whose
 * name holds a literal %20, "fungi_warlord .png" one with a space):
 *   lr  lowresskins/ files that are their own canonical resource ("|"-separated names). Every
 *       other lowresskins/<n> is the resource vanillaskins/<n> (verified here for each file that
 *       exists), and so is every vanillaskins2/<n> not listed in a or j.
 *   a   alias path -> canonical path, for every other duplicate.
 *   x   canonical paths in vanillaskins/ and lowresskins/ the mirror does not hold byte-identical:
 *       they are delivered from www.legendmod.ml only.
 *   j   resources only the mirror holds (no copy in this repository): delivered from the mirror only.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'ogario', 'skinregistry.js');
const MIRROR = path.join(__dirname, 'mirror-jimboy3000.txt');
const MANIFEST = path.join(ROOT, 'developers', 'audit', 'manifest.json');
const DIRS = ['vanillaskins', 'lowresskins', 'agario/live/flags'];
const MIRROR_DIRS = ['vanillaskins', 'lowresskins', 'vanillaskins2'];
const IMG = /\.(png|jpe?g|gif|webp)$/i;
const MANAGED_DIR = /^(vanillaskins2?|lowresskins|agario\/live\/flags)\/[^\/]+$/;
const DIR_RANK = { 'vanillaskins': 0, 'agario/live/flags': 1, 'lowresskins': 2, 'vanillaskins2': 3 };

const args = new Set(process.argv.slice(2));

function blobSha(buf) {
    return crypto.createHash('sha1').update('blob ' + buf.length + '\0').update(buf).digest('hex');
}
function dirOf(p) { return p.slice(0, p.lastIndexOf('/')); }
function nameOf(p) { return p.slice(p.lastIndexOf('/') + 1); }
function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/* names the official configuration uses (preferred as canonical names) */
function configNames() {
    const set = new Set();
    try {
        const g = JSON.parse(fs.readFileSync(path.join(ROOT, 'agario/live/GameConfiguration.json'), 'utf8')).gameConfig;
        (g['Gameplay - Equippable Skins'] || []).forEach((s) => { if (s.image && s.image !== 'uses_spine') set.add(s.image); });
        (g['Gameplay - Free Skins'] || []).forEach((s) => { if (s.image) set.add(s.image); });
        (g['Visual - Prod. Spine Animations'] || []).forEach((s) => { if (s.spineFileName) set.add(s.spineFileName + '.png'); });
    } catch (e) { /* the ranking still works without it */ }
    return set;
}
const CONFIG = configNames();

/* canonical choice inside a group of identical files: vanillaskins first, then a clean name
 * (no space, %, leading or trailing underscore), a name the official config uses, the shorter
 * name, then code-unit order (deterministic) */
function rank(p) {
    const n = nameOf(p);
    const base = n.replace(IMG, '');
    const unclean = /[\s%]/.test(n) || /^_/.test(base) || /_$/.test(base) ? 1 : 0;
    return [DIR_RANK[dirOf(p)] != null ? DIR_RANK[dirOf(p)] : 9, unclean, CONFIG.has(n) ? 0 : 1, n.length];
}
function pickCanonical(paths) {
    return paths.slice().sort((a, b) => {
        const ra = rank(a), rb = rank(b);
        for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
        return cmp(a, b);
    })[0];
}

function scanLocal() {
    const files = [];
    for (const d of DIRS) {
        const abs = path.join(ROOT, d);
        if (!fs.existsSync(abs)) continue;
        for (const n of fs.readdirSync(abs)) {
            if (!IMG.test(n)) continue;
            const f = path.join(abs, n);
            if (!fs.statSync(f).isFile()) continue;
            files.push({ p: d + '/' + n, sha: blobSha(fs.readFileSync(f)) });
        }
    }
    files.sort((a, b) => cmp(a.p, b.p));
    return files;
}

function readMirror() {
    const out = [];
    for (const line of fs.readFileSync(MIRROR, 'utf8').split(/\r?\n/)) {
        if (!line || line[0] === '#') continue;
        const sp = line.indexOf(' ');
        const p = line.slice(sp + 1);
        if (IMG.test(p)) out.push({ p: p, sha: line.slice(0, sp) });
    }
    return out;
}

function refreshMirror() {
    const https = require('https');
    const url = 'https://api.github.com/repos/jimboy3000/jimboy3000.github.io/git/trees/HEAD?recursive=1';
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'skin-registry-builder', 'Accept': 'application/vnd.github+json' } }, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (c) => { body += c; });
            res.on('end', () => {
                try {
                    const j = JSON.parse(body);
                    if (!j.tree || j.truncated) throw new Error('unexpected tree response');
                    const rows = j.tree.filter((e) => e.type === 'blob' && MIRROR_DIRS.indexOf(dirOf(e.path)) !== -1)
                        .sort((a, b) => cmp(a.path, b.path)).map((e) => e.sha.slice(0, 16) + ' ' + e.path);
                    const head = fs.readFileSync(MIRROR, 'utf8').split(/\r?\n/).filter((l) => l[0] === '#');
                    fs.writeFileSync(MIRROR, head.concat(rows).join('\n') + '\n');
                    console.log('mirror snapshot: ' + rows.length + ' files');
                    resolve();
                } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function build() {
    const local = scanLocal();
    const mirror = readMirror();
    const short = (sha) => sha.slice(0, 16);

    /* local groups by content */
    const bySha = new Map();
    for (const f of local) {
        if (!bySha.has(f.sha)) bySha.set(f.sha, []);
        bySha.get(f.sha).push(f.p);
    }
    const canonOf = new Map();   /* local path -> canonical path */
    const groups = [];
    const canonByShort = new Map();
    for (const [sha, paths] of bySha) {
        const c = pickCanonical(paths);
        for (const p of paths) canonOf.set(p, c);
        canonByShort.set(short(sha), c);
        if (paths.length > 1) groups.push({ sha: sha, canonical: c, paths: paths.slice().sort(cmp) });
    }
    const localSet = new Set(local.map((f) => f.p));
    const localShort = new Map(local.map((f) => [f.p, short(f.sha)]));

    /* mirror: same-path copies, mirror-only resources, mirror paths of local resources */
    const mirrorHas = new Set();
    const mirrorOnly = new Map();     /* short sha -> mirror paths */
    const mirrorAlias = new Map();    /* mirror path -> local canonical */
    const conflicts = [];
    for (const m of mirror) {
        if (localSet.has(m.p)) {
            if (localShort.get(m.p) === m.sha) mirrorHas.add(m.p);
            else conflicts.push(m.p);
            continue;
        }
        const c = canonByShort.get(m.sha);
        if (c) { mirrorAlias.set(m.p, c); continue; }
        if (!mirrorOnly.has(m.sha)) mirrorOnly.set(m.sha, []);
        mirrorOnly.get(m.sha).push(m.p);
    }
    /* a canonical file is on the mirror when the mirror holds it at the same path */
    const onMirror = (c) => mirrorHas.has(c);

    const lr = [];
    const a = Object.create(null);
    const j = [];
    const errorsLegacy = [];
    /* the resolver's implicit rule for lowresskins/<n> and vanillaskins2/<n> */
    const implicit = (p) => {
        const d = dirOf(p), n = nameOf(p);
        if (d === 'lowresskins' && lr.indexOf(n) === -1) return 'vanillaskins/' + n;
        if (d === 'vanillaskins2') return 'vanillaskins/' + n;
        return p;
    };
    for (const f of local) if (dirOf(f.p) === 'lowresskins' && canonOf.get(f.p) === f.p) lr.push(nameOf(f.p));
    lr.sort(cmp);
    const resolveLikeRuntime = (p) => {
        if (a[p]) return a[p];
        const q = implicit(p);
        return a[q] || q;
    };
    /* explicit entries only where the implicit rule (applied before the alias table) is not enough;
     * vanillaskins/ and the flags first, so lowresskins/<n> can lean on vanillaskins/<n>'s entry */
    const ordered = local.filter((f) => dirOf(f.p) !== 'lowresskins').concat(local.filter((f) => dirOf(f.p) === 'lowresskins'));
    for (const f of ordered) {
        const c = canonOf.get(f.p);
        if (c === f.p) continue;
        if (resolveLikeRuntime(f.p) !== c) a[f.p] = c;
    }
    for (const [, paths] of mirrorOnly) {
        const c = pickCanonical(paths);
        j.push(c);
        for (const p of paths) if (p !== c && resolveLikeRuntime(p) !== c) a[p] = c;
    }
    for (const [p, c] of mirrorAlias) if (resolveLikeRuntime(p) !== c) a[p] = c;
    j.sort(cmp);
    /* files already deleted (or never kept, see --alias) stay resolvable: their manifest record names
     * the canonical file and the hash both had when it was written */
    const legacy = [];
    for (const r of readManifest().records) {
        if (!r || !r.oldPath || !r.canonicalPath || localSet.has(r.oldPath) || !MANAGED_DIR.test(r.oldPath)) continue;
        const c = canonOf.get(r.canonicalPath) || (j.indexOf(r.canonicalPath) !== -1 ? r.canonicalPath : null);
        if (!c) { errorsLegacy.push(r.oldPath + ' (canonical ' + r.canonicalPath + ' is gone)'); continue; }
        if (r.sha && localShort.get(r.canonicalPath) && r.sha.slice(0, 16) !== localShort.get(r.canonicalPath)) { errorsLegacy.push(r.oldPath + ' (canonical changed since the record)'); continue; }
        legacy.push(r.oldPath);
        if (resolveLikeRuntime(r.oldPath) !== c) a[r.oldPath] = c;
    }
    if (errorsLegacy.length) throw new Error('manifest aliases do not resolve: ' + errorsLegacy.slice(0, 10).join(', '));

    const x = [];
    for (const c of new Set(canonOf.values())) {
        const d = dirOf(c);
        if ((d === 'vanillaskins' || d === 'lowresskins') && !onMirror(c)) x.push(c);
    }
    x.sort(cmp);

    /* every local and mirror path must resolve to the canonical of its bytes */
    const errors = [];
    for (const f of local) if (resolveLikeRuntime(f.p) !== canonOf.get(f.p)) errors.push(f.p);
    for (const [p, c] of mirrorAlias) if (resolveLikeRuntime(p) !== c) errors.push(p);
    if (errors.length) throw new Error('registry does not resolve: ' + errors.slice(0, 10).join(', '));

    const aliasSorted = {};
    Object.keys(a).sort(cmp).forEach((k) => { aliasSorted[k] = a[k]; });
    const digest = crypto.createHash('sha1').update(JSON.stringify([local, mirror])).digest('hex').slice(0, 16);
    const data = { v: 1, src: digest, lr: lr.join('|'), a: aliasSorted, x: x.join('|'), j: j.join('|') };
    return { data, groups, conflicts, local, mirrorOnly, mirrorAlias, canonOf, onMirror, legacy };
}

function render(data) {
    return '/* Skin asset registry, generated by developers/skins/build-registry.js from the file hashes of\n' +
        ' * vanillaskins/, lowresskins/, agario/live/flags/ and the jimboy3000.github.io mirror. Do not edit:\n' +
        ' * run node developers/skins/build-registry.js. Read by ogario/skinresolver.js. */\n' +
        '(function (r) { if (window.LMSkinResolver && window.LMSkinResolver.setRegistry) window.LMSkinResolver.setRegistry(r); else window.LMSkinRegistry = r; })(' +
        JSON.stringify(data) + ');\n';
}

/* deletion manifest records for the duplicates (developers/audit/manifest.json). The evidence
 * texts are kept once in the manifest's "evidence" table; a record names its entry. "deleted":
 * false = the file is still in the tree (approved records are deleted later, from this list). */
const EVIDENCE = {
    'skin-lowres-sync': 'Added on 2026-11-20 by the lowres sync commits b60ea2d3 / 43460ee2 (copies of vanillaskins/). Never linked by skins/index.html, the shop, the skin checker, the rotator, Expanding Land, the help site, LegendWorld or Delta; no engine version requested www.legendmod.ml/lowresskins/<name> for these names (its fallbacks went to the jimboy3000.github.io mirror, whose lowresskins/ never had them). Every request for it now resolves to the canonical file (ogario/skinresolver.js).',
    'skin-gallery-link': 'Linked by skins/index.html for years; the gallery copies the picture URL into the custom skin field, so saved profiles and shared configs hold it. GitHub Pages cannot redirect a deleted image: it stays published.',
    'skin-config-name': 'A file name of the official agar.io configuration (two products with the same picture): old clients and other mods request it by that name. Stays published.',
    'skin-flag-name': 'A flag name skin: old clients build agario/live/flags/<name>.png from the player name. Stays published.',
    'skin-old-variant': 'A spelling of the file name that older configurations and older Legend Mod versions (space -> underscore) requested; public since 2025-12 / 2026-03. Stays published until those clients are gone.',
    'skin-download-copy': 'Never published: the download script found the same bytes already in the repository and did not keep the copy.'
};
/* the approval rule of the manifest (developers/tests/manifestrefs.js): a record approved without an
 * external URL names its evidence in verification.external (the text is in the evidence table) */
const VERIFIED_ON = '2026-11-27';
function verification(ev) {
    return { on: VERIFIED_ON, external: 'evidence ' + ev };
}
function manifestRecords(res) {
    const out = [];
    const recentSet = recentlyAdded();
    const gallery = (fs.existsSync(path.join(ROOT, 'skins/index.html')) ? fs.readFileSync(path.join(ROOT, 'skins/index.html'), 'utf8') : '') + galleryHistory();
    for (const g of res.groups) {
        for (const p of g.paths) {
            if (p === g.canonical) continue;
            const d = dirOf(p);
            let ev;
            if (gallery.indexOf(encodeURI(p)) !== -1 || gallery.indexOf(p) !== -1) ev = 'skin-gallery-link';
            else if (recentSet.has(p) && d === 'lowresskins') ev = 'skin-lowres-sync';
            else if (d === 'agario/live/flags') ev = 'skin-flag-name';
            else if (CONFIG.has(nameOf(p))) ev = 'skin-config-name';
            else ev = 'skin-old-variant';
            const external = ev !== 'skin-lowres-sync';
            const r = {
                oldPath: p, canonicalPath: g.canonical, reason: 'byte-identical copy', sha: g.sha.slice(0, 16),
                internalReferencesMigrated: true, legacyResolverSupported: true, legacyResolverNeeded: true,
                externalUrlSupported: external, externalUrlNeeded: external, approvedForDeletion: !external, deleted: false, evidence: ev, package: 'CL3W'
            };
            if (!external) r.verification = verification(ev);
            out.push(r);
        }
    }
    return out;
}
/* every lowresskins / vanillaskins link the gallery ever had (git history) */
function galleryHistory() {
    try {
        return require('child_process').execFileSync('git', ['-C', ROOT, 'log', '-p', '--format=', '--', 'skins/index.html'], { encoding: 'utf8', maxBuffer: 1 << 28 })
            .split(/\r?\n/).filter((l) => /skins\//.test(l)).join('\n');
    } catch (e) { return ''; }
}
function recentlyAdded() {
    const set = new Set();
    try {
        const cp = require('child_process');
        for (const c of ['b60ea2d3', '43460ee2']) {
            const s = cp.execFileSync('git', ['-C', ROOT, '-c', 'core.quotepath=off', 'show', '--name-only', '--diff-filter=A', '--format=', c], { encoding: 'utf8', maxBuffer: 1 << 26 });
            s.split(/\r?\n/).forEach((l) => { if (l) set.add(l.replace(/^"|"$/g, '')); });
        }
    } catch (e) { /* without git history every record stays externally supported (safe) */ }
    return set;
}
function readManifest() {
    let m = { version: 1, evidence: {}, records: [] };
    if (fs.existsSync(MANIFEST)) m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    if (!Array.isArray(m.records)) m.records = [];
    return m;
}
function writeManifest(records, keepPaths, prune) {
    const m = readManifest();
    const mine = new Map(records.map((r) => [r.oldPath, r]));
    /* records of other packages stay as they are (order and layout); ours are replaced; ours for
     * files already deleted stay (keepPaths, marked deleted) */
    const keep = new Set(keepPaths || []);
    const others = [], ours = [];
    for (const r of m.records) {
        const isOurs = r.package === 'CL3W';
        if (mine.has(r.oldPath) && (isOurs || !r.package)) continue;
        if (isOurs) {
            if (prune && !keep.has(r.oldPath)) continue;
            if (keep.has(r.oldPath)) r.deleted = true;
            ours.push(r);
            continue;
        }
        others.push(r);
    }
    for (const r of records) ours.push(r);
    ours.sort((x, y) => cmp(x.oldPath, y.oldPath));
    m.evidence = Object.assign(m.evidence || {}, EVIDENCE);
    fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
    const head = Object.assign({}, m);
    delete head.records;
    const top = JSON.stringify(head, null, 2);
    /* the skin records one per line (1800 of them): small diffs, easy merges between packages */
    const lines = others.map((r) => JSON.stringify(r, null, 2).replace(/^/gm, '    ')).concat(ours.map((r) => '    ' + JSON.stringify(r)));
    fs.writeFileSync(MANIFEST, top.slice(0, -2) + ',\n  "records": [\n' + lines.join(',\n') + '\n  ]\n}\n');
    console.log('manifest: ' + records.length + ' skin duplicate records (' + records.filter((r) => r.approvedForDeletion).length + ' approved for deletion, ' + records.filter((r) => r.deleted === false).length + ' still in the tree)');
}

/* --alias <path>=<canonical>@<git blob sha>: a download script fetched <path> and found it
 * byte-identical to <canonical>; it did not keep the copy. The record keeps <path> resolvable. */
function addAlias(spec) {
    const m = /^(.+)=(.+)@([0-9a-f]{40})$/.exec(spec || '');
    if (!m || !MANAGED_DIR.test(m[1])) throw new Error('--alias wants <path>=<canonical path>@<40-hex git blob sha>');
    const file = path.join(ROOT, m[2]);
    if (!fs.existsSync(file) || blobSha(fs.readFileSync(file)) !== m[3]) throw new Error('--alias: ' + m[2] + ' does not have the hash ' + m[3]);
    writeManifest([{
        oldPath: m[1], canonicalPath: m[2], reason: 'byte-identical copy (downloaded, not kept)', sha: m[3].slice(0, 16),
        internalReferencesMigrated: true, legacyResolverSupported: true, legacyResolverNeeded: true,
        externalUrlSupported: false, externalUrlNeeded: false, approvedForDeletion: true,
        deleted: true, evidence: 'skin-download-copy', package: 'CL3W', verification: verification('skin-download-copy')
    }], [m[1]]);
}

async function main() {
    const ai = process.argv.indexOf('--alias');
    if (ai !== -1) { addAlias(process.argv[ai + 1]); return; }
    if (args.has('--refresh-mirror')) await refreshMirror();
    const res = build();
    const text = render(res.data);
    if (args.has('--report')) {
        for (const g of res.groups) if (g.paths.some((p) => p !== g.canonical && (dirOf(p) !== 'lowresskins' || nameOf(p) !== nameOf(g.canonical)))) console.log(g.canonical + ' <= ' + g.paths.filter((p) => p !== g.canonical).join(', '));
        console.log('groups ' + res.groups.length + ', mirror-only ' + res.data.j.split('|').length + ', not on mirror ' + res.data.x.split('|').length + ', conflicts ' + res.conflicts.length);
    }
    if (args.has('--check')) {
        const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
        if (cur !== text) { console.error('ogario/skinregistry.js is out of date: run node developers/skins/build-registry.js'); process.exit(1); }
        console.log('ogario/skinregistry.js is up to date');
        return;
    }
    fs.writeFileSync(OUT, text);
    console.log('wrote ogario/skinregistry.js (' + text.length + ' bytes)');
    if (args.has('--manifest')) writeManifest(manifestRecords(res), res.legacy, true);
}
if (require.main === module) main().catch((e) => { console.error(e.message || e); process.exit(1); });
module.exports = { build, render, blobSha };
