/* Deleted / moved / re-encoded media: developers/audit/manifest.json must be complete and true.
 * - every record has all fields; an approved deletion is really gone and what replaces it exists;
 * - "internalReferencesMigrated" media records: no tracked text file names the old path any more
 *   (as a path, a URL, or a relative name from a page in the same folder);
 * - re-encoded media keep what a player sees: the animated WebP that replaced a GIF has the GIF's
 *   size, frame count, total duration and loop.
 * - pictures re-encoded losslessly at their own address keep their size and bit depth;
 * - the audit's perceptual duplicates (PNG decoder) and runtime network recording (servedPaths).
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
    /* "deleted": false is an approved deletion not carried out yet (the manifest-driven deletion step removes it) */
    if (r.approvedForDeletion && r.deleted !== false) check('approved deletion is gone from the tree: ' + id, !tracked.has(id) && !fs.existsSync(path.join(repo, id)));
    if (r.deleted === false) check('approved deletion not carried out yet is still in the tree: ' + id, tracked.has(id));
    /* a file kept for its public URL must still be published */
    if (r.externalUrlSupported && !r.approvedForDeletion) check('kept for its public URL, still in the tree: ' + id, tracked.has(id));
    if (r.canonicalPath && !/^https:\/\//.test(r.canonicalPath)) {
        check('its replacement exists: ' + r.canonicalPath, tracked.has(r.canonicalPath) || fs.existsSync(path.join(repo, r.canonicalPath)));
    }
});

/* text that can name a file: pages, scripts, styles, data, docs, userscript headers */
const TEXT = /\.(html?|js|mjs|css|json|md|txt|xml|ps1|py|svg|webmanifest|yml)$|^[^.]+$/i;
const SKIP = /^(vanillaskins|lowresskins)\//;
/* the registers of the deletions themselves (they name every deleted file on purpose) */
const RECORDS = new Set(['developers/audit/manifest.json', 'developers/i18n/scan-config.json',
    'developers/tests/auditmedia.js']);
/* the skin resolver's register, its generator input and its test */
const RESOLVER = /^(ogario\/skinregistry\.js$|developers\/skins\/|developers\/tests\/skinresolver\.js$)/;
const texts = [...tracked].filter((f) => TEXT.test(path.basename(f)) && !SKIP.test(f) && !RECORDS.has(f));
/* media files (pictures, videos, sounds); pages and scripts are checked by repo-integrity.js */
const MEDIA = /\.(png|jpe?g|gif|webp|bmp|ico|svg|mp4|webm|mp3|ogg|wav)$/i;
const migrated = man.records.filter((r) => r.internalReferencesMigrated && MEDIA.test(r.oldPath));
/* a file name made of these characters is always cut out whole by NAME (the characters before it end a path) */
const NAME = /[A-Za-z0-9_%+~-][A-Za-z0-9_%+~.-]*\.(?:png|jpe?g|gif|webp|bmp|ico|svg|mp4|webm|mp3|ogg|wav)/gi;
const EXT = /\.(?:png|jpe?g|gif|webp|bmp|ico|svg|mp4|webm|mp3|ogg|wav)/gi;
/* each name cut out, and each start of it that ends in a media extension ("a.png" inside "a.png2.png") */
function namesIn(src) {
    const out = new Set();
    (src.match(NAME) || []).forEach((m) => { out.add(m); EXT.lastIndex = 0; let x; while ((x = EXT.exec(m))) out.add(m.slice(0, x.index + x[0].length)); });
    return out;
}
const SIMPLE = /^[A-Za-z0-9_%+~-][A-Za-z0-9_%+~.-]*$/;
{
    const n = namesIn('url(banners/a.png2.png) src="./b%20c.GIF" x=d.png?v=1 "e.f.jpg"');
    check('the name pre-filter cuts out every media name', ['a.png', 'a.png2.png', 'b%20c.GIF', 'd.png', 'e.f.jpg'].every((s) => n.has(s)));
}
migrated.forEach((r) => {
    r.base = path.basename(r.oldPath); r.encBase = encodeURIComponent(r.base);
    r.simple = SIMPLE.test(r.base) && SIMPLE.test(r.encBase);
});
const hits = {};
if (migrated.length) {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    texts.forEach((f) => {
        let st; try { st = fs.statSync(path.join(repo, f)); } catch (e) { return; }
        if (!st.isFile() || st.size > 8e6) return;
        const src = fs.readFileSync(path.join(repo, f), 'latin1');
        /* every media file name the text holds; only records named there need the full search */
        const names = namesIn(src);
        migrated.forEach((r) => {
            if (r.simple && !names.has(r.base) && !names.has(r.encBase)) return;
            const p = r.oldPath, base = path.basename(p), dir = path.dirname(p);
            const enc = p.split('/').map(encodeURIComponent).join('/');
            let found = src.indexOf(p) >= 0 || src.indexOf(enc) >= 0;
            /* a page in the same folder can name it relatively (src="name.png") */
            if (!found && path.dirname(f) === dir) found = new RegExp('(^|["\'(\\s=]|\\./)' + esc(base) + '(["\')?#\\s]|$)', 'm').test(src);
            /* the skin resolver keeps old skin paths as aliases on purpose (that is the legacy support) */
            if (found && r.legacyResolverSupported && RESOLVER.test(f)) found = false;
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

/* pictures re-encoded losslessly at the same address (same decoded pixels, checked when they were
 * re-encoded): they stay 8-bit PNGs of the same size, and smaller than before */
const PNG = {
    'Lc/PROJETOX.HTML/dragon.png': [1920, 1080, 1139307], 'Lc/PROJETOX.HTML/junk.png': [2509, 1314, 2532971],
    'Lc/PROJETOX.HTML/junk1.png': [2509, 1314, 2384050], 'Lc/PROJETOX.HTML/logo.png': [1536, 1024, 1207122],
    'Lc/PROJETOX.HTML/mido.png': [2850, 1694, 4018182], 'Lc/PROJETOX.HTML/prod.png': [1920, 1052, 1878864],
    'Lc/PROJETOX.HTML/weare.png': [1920, 1080, 1434942], 'banners/Lc2026.png': [1536, 1024, 2817139]
};
Object.keys(PNG).forEach((f) => {
    const [w, h, before] = PNG[f];
    let b = null; try { b = fs.readFileSync(path.join(repo, f)); } catch (e) { }
    const ok = b && b.toString('latin1', 1, 4) === 'PNG' && b.toString('ascii', 12, 16) === 'IHDR';
    const got = ok ? b.readUInt32BE(16) + 'x' + b.readUInt32BE(20) + ', ' + b[24] + '-bit, ' + b.length + ' bytes' : 'not a PNG';
    check(f + ' is an 8-bit PNG of ' + w + 'x' + h + ' under ' + before + ' bytes (got ' + got + ')',
        ok && b.readUInt32BE(16) === w && b.readUInt32BE(20) === h && b[24] === 8 && b.length < before);
});


/* the audit's reference scan reads inline handlers and javascript: links as script, so a page opened by
 * onclick="pop('articles/x.html')" is a reference (Lc/Lc.html opens its articles that way) */
{
    const R = require(path.join(repo, 'developers', 'audit', 'references.js'));
    const exist = new Set(['Lc/Lc.html', 'Lc/articles/a.html', 'Lc/articles/b.html', 'Lc/articles/c.html']);
    const inv = { exist, dirs: new Set(['Lc', 'Lc/articles']), lower: new Map(), sorted: [...exist] };
    const page = '<a onclick="pop(\'articles/a.html\');">A</a><a href="javascript:pop(\'articles/b.html\')">B</a><a title="articles/c.html">C</a>';
    const got = R.extract('Lc/Lc.html', page, { cfg: R.loadConfig(repo), inv }).refs.filter((r) => r.status === 'ok').map((r) => r.target).sort();
    check('references: onclick and javascript: handlers are read as script, a title is not (' + JSON.stringify(got) + ')',
        JSON.stringify(got) === JSON.stringify(['Lc/articles/a.html', 'Lc/articles/b.html']));
}

/* the audit's perceptual duplicates (developers/audit/perceptual.js, PNG decoder without Chrome):
 * the same picture saved another way (other filter, palette, size, a few pixels changed) is one
 * group; another picture, or the same shape in another colour, is not */
{
    const zlib = require('zlib');
    const P = require(path.join(repo, 'developers', 'audit', 'perceptual.js'));
    const crc = (b) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
    const chunk = (type, data) => { const h = Buffer.alloc(8); h.writeUInt32BE(data.length); h.write(type, 4, 'latin1'); const c = Buffer.alloc(4); c.writeUInt32BE(crc(Buffer.concat([Buffer.from(type, 'latin1'), data]))); return Buffer.concat([h, data, c]); };
    /* RGBA PNG of w x h from px(x, y) -> [r, g, b, a], every row with the given filter (0 none, 1 sub) */
    const png = (w, h, px, filter) => {
        const raw = [];
        for (let y = 0; y < h; y++) {
            raw.push(filter);
            const row = [];
            for (let x = 0; x < w; x++) row.push(...px(x, y));
            for (let i = 0; i < row.length; i++) raw.push(filter === 1 ? (row[i] - (i >= 4 ? row[i - 4] : 0)) & 255 : row[i]);
        }
        const ih = Buffer.alloc(13); ih.writeUInt32BE(w); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
        return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(Buffer.from(raw))), chunk('IEND', Buffer.alloc(0))]);
    };
    const face = (s, col, noise) => (x, y) => { const u = x / s, v = y / s, d = Math.hypot(u - 0.5, v - 0.5);
        const on = d < 0.45 && !(Math.hypot(u - 0.33, v - 0.38) < 0.07 || Math.hypot(u - 0.67, v - 0.38) < 0.07 || (v > 0.62 && v < 0.7 && Math.abs(u - 0.5) < 0.2));
        const n = noise && (x * 7 + y * 13) % 29 === 0 ? 9 : 0;
        return on ? [Math.min(255, col[0] + n), col[1], col[2], 255] : [0, 0, 0, 0]; };
    const files = {
        'a.png': png(64, 64, face(64, [230, 40, 40]), 0),
        'b.png': png(64, 64, face(64, [230, 40, 40], true), 1),
        'c.png': png(48, 48, face(48, [230, 40, 40]), 1),
        'blue.png': png(64, 64, face(64, [40, 40, 230]), 0),
        'other.png': png(64, 64, (x, y) => [x * 4, y * 4, 128, 255], 0),
        'flat.png': png(16, 16, () => [10, 200, 10, 255], 0)
    };
    const inv = { files: Object.keys(files).map((p, i) => ({ path: p, blob: 'b' + i, size: files[p].length })) };
    const cells = P.pngCells(files['a.png']);
    check('perceptual: the PNG decoder reads 64x64 RGBA into 9 x 8 colour cells', cells && cells.w === 64 && cells.h === 64 && cells.rgb.length === 216);
    P.perceptualGroups(inv, repo, { chrome: false, read: (p) => files[p] }).then((res) => {
        const g = res.groups.map((x) => x.paths.join(','));
        check('perceptual: re-saved, resized and slightly changed copies are one group, the blue one, another picture and the flat one are not (' + JSON.stringify(g) + ')',
            g.length === 1 && g[0] === 'a.png,b.png,c.png' && res.skipped.flat === 1 && res.decoder === 'png');
        /* runtime network recording: servedPaths of every result.json below a folder */
        const N = require(path.join(repo, 'developers', 'audit', 'network.js'));
        const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'lm-auditnet-'));
        fs.mkdirSync(path.join(tmp, 'run1', 'desktop'), { recursive: true });
        fs.writeFileSync(path.join(tmp, 'run1', 'desktop', 'result.json'), JSON.stringify({ served: 2, servedPaths: ['play.html', 'lib/x.js'] }));
        fs.writeFileSync(path.join(tmp, 'result.json'), JSON.stringify({ served: 1, servedPaths: ['play.html'] }));
        fs.writeFileSync(path.join(tmp, 'other.json'), JSON.stringify({ servedPaths: ['nope.js'] }));
        const net = N.runtimeLoaded(tmp);
        fs.rmSync(tmp, { recursive: true, force: true });
        check('network: two recorded runs, play.html loaded in both, lib/x.js in one, other files ignored', net.runs === 2 && net.paths.get('play.html') === 2 && net.paths.get('lib/x.js') === 1 && !net.paths.has('nope.js'));
        console.log(fail ? fail + ' FAILED' : 'all passed');
        process.exit(fail ? 1 : 0);
    });
}
