/* Deleted / moved / re-encoded media: developers/audit/manifest.json must be complete and true.
 * - every record has all fields; an approved deletion is really gone and what replaces it exists;
 * - "internalReferencesMigrated" media records: no tracked text file names the old path any more
 *   (as a path, a URL, or a relative name from a page in the same folder);
 * - re-encoded media keep what a player sees: the animated WebP that replaced a GIF has the GIF's
 *   size, frame count, total duration and loop.
 * node developers/tests/auditmedia.js */
'use strict';
const fs = require('fs'), path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const manPath = path.join(repo, 'developers', 'audit', 'manifest.json');
let man = null;
try { man = JSON.parse(fs.readFileSync(manPath, 'utf8')); } catch (e) { }
check('manifest.json parses and has a records list', man && Array.isArray(man.records));
if (!man || !Array.isArray(man.records)) process.exit(1);

const tracked = new Set(execSync('git ls-files', { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n').filter(Boolean));
const BOOL = ['internalReferencesMigrated', 'legacyResolverSupported', 'externalUrlSupported', 'approvedForDeletion'];
const seen = new Set();
man.records.forEach((r) => {
    const id = r && r.oldPath;
    check('record has oldPath, reason and the four flags: ' + id, typeof id === 'string' && id && typeof r.reason === 'string' && r.reason &&
        'canonicalPath' in r && (r.canonicalPath === null || typeof r.canonicalPath === 'string') && BOOL.every((k) => typeof r[k] === 'boolean'));
    check('oldPath listed once: ' + id, !seen.has(id));
    seen.add(id);
    if (r.approvedForDeletion) check('approved deletion is gone from the tree: ' + id, !tracked.has(id) && !fs.existsSync(path.join(repo, id)));
    /* a file kept for its public URL must still be published */
    if (r.externalUrlSupported && !r.approvedForDeletion) check('kept for its public URL, still in the tree: ' + id, tracked.has(id));
    if (r.canonicalPath && !/^https:\/\//.test(r.canonicalPath)) {
        check('its replacement exists: ' + r.canonicalPath, tracked.has(r.canonicalPath) || fs.existsSync(path.join(repo, r.canonicalPath)));
    }
});

/* text that can name a file: pages, scripts, styles, data, docs, userscript headers */
const TEXT = /\.(html?|js|mjs|css|json|md|txt|xml|ps1|py|svg|webmanifest|yml)$|^[^.]+$/i;
const SKIP = /^(vanillaskins|lowresskins)\//;
/* the registers of the deletions themselves (they name every deleted file on purpose) and the source export nothing loads */
const RECORDS = new Set(['developers/audit/manifest.json', 'developers/i18n/scan-config.json', 'developers/tests/i18n-archived.js',
    'developers/tests/auditmedia.js', 'AllFilesNew.txt']);
const texts = [...tracked].filter((f) => TEXT.test(path.basename(f)) && !SKIP.test(f) && !RECORDS.has(f));
/* media files (pictures, videos, sounds); pages and scripts have their own checks (i18n-archived.js and others) */
const MEDIA = /\.(png|jpe?g|gif|webp|bmp|ico|svg|mp4|webm|mp3|ogg|wav)$/i;
const migrated = man.records.filter((r) => r.internalReferencesMigrated && MEDIA.test(r.oldPath));
const hits = {};
if (migrated.length) {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    texts.forEach((f) => {
        let st; try { st = fs.statSync(path.join(repo, f)); } catch (e) { return; }
        if (!st.isFile() || st.size > 8e6) return;
        const src = fs.readFileSync(path.join(repo, f), 'latin1');
        migrated.forEach((r) => {
            const p = r.oldPath, base = path.basename(p), dir = path.dirname(p);
            const enc = p.split('/').map(encodeURIComponent).join('/');
            let found = src.indexOf(p) >= 0 || src.indexOf(enc) >= 0;
            /* a page in the same folder can name it relatively (src="name.png") */
            if (!found && path.dirname(f) === dir) found = new RegExp('(^|["\'(\\s=]|\\./)' + esc(base) + '(["\')?#\\s]|$)', 'm').test(src);
            if (found) (hits[p] = hits[p] || []).push(f);
        });
    });
}
migrated.forEach((r) => check('nothing in the repository names ' + r.oldPath + (hits[r.oldPath] ? ' (named by ' + hits[r.oldPath].slice(0, 5).join(', ') + ')' : ''), !hits[r.oldPath]));

/* animated WebP chunks: canvas size (VP8X), loop count (ANIM), frames and their durations (ANMF) */
function webpInfo(buf) {
    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
    const info = { w: 0, h: 0, animated: false, loop: -1, frames: 0, ms: 0 };
    for (let o = 12; o + 8 <= buf.length;) {
        const id = buf.toString('ascii', o, o + 4), len = buf.readUInt32LE(o + 4), d = o + 8;
        if (id === 'VP8X') { info.animated = !!(buf[d] & 2); info.w = buf.readUIntLE(d + 4, 3) + 1; info.h = buf.readUIntLE(d + 7, 3) + 1; }
        else if (id === 'ANIM') info.loop = buf.readUInt16LE(d + 4);
        else if (id === 'ANMF') { info.frames++; info.ms += buf.readUIntLE(d + 12, 3); }
        o = d + len + (len & 1);
    }
    return info;
}
/* what the replaced GIFs were: 720x720, 150 frames, 5 s per loop, loops for ever (loop 0) */
const WEBP = { 'Lc/articles/images/Lcgif.webp': { w: 720, h: 720, frames: 150, ms: 5000, loop: 0 } };
Object.keys(WEBP).forEach((f) => {
    const e = WEBP[f];
    let i = null; try { i = webpInfo(fs.readFileSync(path.join(repo, f))); } catch (err) { }
    check(f + ' is an animated WebP of ' + e.w + 'x' + e.h + ', ' + e.frames + ' frames, ' + e.ms + ' ms, loop ' + e.loop +
        (i ? ' (got ' + i.w + 'x' + i.h + ', ' + i.frames + ', ' + i.ms + ' ms, loop ' + i.loop + ')' : ''),
        i && i.animated && i.w === e.w && i.h === e.h && i.frames === e.frames && i.ms === e.ms && i.loop === e.loop);
});

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
