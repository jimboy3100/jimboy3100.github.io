/* Dying Light optimized assets: banners/dyinglight/manifest.json must tell the truth about every file.
 * - each listed file exists, has the listed byte size and (pictures) the listed decoded size read from the
 *   WebP header; sounds are MP3 files;
 * - the budgets: gameplay backgrounds <= 350 KB, menu backgrounds <= 450 KB, small variants <= 180 KB,
 *   skins square 512 (<= 120 KB, the WebGL skin layer size) and 256, sounds <= 100 KB;
 * - the old files they were made from are still in banners/ (public URLs), videos never autoload.
 * node developers/tests/dyinglightassets.js */
'use strict';
const fs = require('fs'), path = require('path');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
let fail = 0;
const check = (n, c) => { if (!c) { console.log('FAIL ' + n); fail++; } return c; };
const BASE = 'https://www.legendmod.ml/';
const local = (url) => path.join(repo, url.slice(BASE.length));

/* width and height of a WebP file (lossy VP8, lossless VP8L or extended VP8X) */
function webpSize(b) {
    if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
    const fourcc = b.toString('ascii', 12, 16), d = 20;
    if (fourcc === 'VP8X') return { w: 1 + b.readUIntLE(d + 4, 3), h: 1 + b.readUIntLE(d + 7, 3), alpha: !!(b[d] & 0x10) };
    if (fourcc === 'VP8 ') return { w: b.readUInt16LE(d + 6) & 0x3fff, h: b.readUInt16LE(d + 8) & 0x3fff, alpha: false };
    if (fourcc === 'VP8L') { const v = b.readUInt32LE(d + 1); return { w: 1 + (v & 0x3fff), h: 1 + ((v >> 14) & 0x3fff), alpha: !!((v >> 28) & 1) }; }
    return null;
}

const man = JSON.parse(fs.readFileSync(path.join(repo, 'banners', 'dyinglight', 'manifest.json'), 'utf8'));
check('manifest base and skin texture size', man.base === BASE && man.skinTextureSize === 512);
let files = 0;
const KB = 1024;
function picture(kind, g, v) {
    const id = kind + ' ' + g.id + ' ' + v.url;
    if (!check('https legendmod URL: ' + id, v.url.indexOf(BASE + 'banners/dyinglight/' + kind + '/') === 0)) return;
    const p = local(v.url);
    if (!check('file exists: ' + id, fs.existsSync(p))) return;
    const b = fs.readFileSync(p), s = webpSize(b);
    files++;
    check('byte size as listed: ' + id, b.length === v.bytes);
    check('WebP with the listed decoded size: ' + id, s && s.w === v.width && s.h === v.height && v.decodedBytes === v.width * v.height * 4);
    return s;
}
['backgrounds', 'skins', 'effects', 'interface'].forEach((kind) => {
    check('has ' + kind, Array.isArray(man[kind]) && man[kind].length > 0);
    (man[kind] || []).forEach((g) => {
        check('old file kept: ' + g.source, fs.existsSync(local(g.source)) && fs.statSync(local(g.source)).size === g.sourceBytes);
        g.variants.forEach((v) => {
            const s = picture(kind, g, v);
            if (!s) return;
            if (kind === 'backgrounds') {
                const max = v.variant === 'small' ? 180 : g.use === 'menu' ? 450 : 350;
                check('background budget: ' + v.url, v.bytes <= max * KB && (v.variant === 'small' ? v.width <= 1280 && v.height <= 960 : v.width <= 1920 && v.height <= 1440));
            } else if (kind === 'skins') {
                check('skin square at its size with alpha: ' + v.url, v.width === v.size && v.height === v.size && s.alpha && (v.size === 512 || v.size === 256));
                check('skin budget: ' + v.url, v.bytes <= (v.size === 512 ? 120 : 45) * KB);
            } else check('picture budget: ' + v.url, v.bytes <= 150 * KB);
        });
    });
});
check('every Dying Light zombie skin has 512 and 256', man.skins.length === 7 && man.skins.every((g) => g.variants.some((v) => v.size === 512) && g.variants.some((v) => v.size === 256)));
const bgIds = man.backgrounds.map((g) => g.id);
check('backgrounds 0..10 are there', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every((i) => bgIds.indexOf('back' + i) >= 0));

man.sounds.forEach((s) => {
    const p = local(s.url);
    if (!check('sound file exists: ' + s.url, s.url.indexOf(BASE + 'sounds/dyinglight/') === 0 && fs.existsSync(p))) return;
    const b = fs.readFileSync(p);
    files++;
    /* an MP3 starts with an ID3 tag or a frame sync */
    check('MP3 file: ' + s.id, b.toString('ascii', 0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0));
    check('sound byte size as listed and within 100 KB: ' + s.id, b.length === s.bytes && s.bytes <= 100 * KB);
    check('sound fields: ' + s.id, s.format === 'audio/mpeg' && s.durationMs > 0 && s.suggestedGain > 0 && s.suggestedGain <= 1);
    check('old sound kept: ' + s.source, fs.existsSync(local(s.source)));
});
man.videos.forEach((v) => check('video never autoloads, file kept: ' + v.url, v.autoload === false && fs.existsSync(local(v.url))));

/* nothing in the two folders is missing from the manifest */
const listed = new Set();
['backgrounds', 'skins', 'effects', 'interface'].forEach((k) => man[k].forEach((g) => g.variants.forEach((v) => listed.add(local(v.url)))));
man.sounds.forEach((s) => listed.add(local(s.url)));
['banners/dyinglight/backgrounds', 'banners/dyinglight/skins', 'banners/dyinglight/effects', 'banners/dyinglight/interface', 'sounds/dyinglight'].forEach((dir) => {
    fs.readdirSync(path.join(repo, dir)).forEach((f) => check('listed in the manifest: ' + dir + '/' + f, listed.has(path.join(repo, dir, f))));
});

console.log('dyinglightassets: ' + files + ' files checked, ' + (fail ? fail + ' FAILED' : 'all ok'));
process.exit(fail ? 1 : 0);
