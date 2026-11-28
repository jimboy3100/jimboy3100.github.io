#!/usr/bin/env node
// Perceptual duplicates: pictures that look the same but are not the same bytes (re-encoded, resized,
// another format, a few changed pixels). Each picture is reduced to 9 x 8 average colour cells (alpha
// blended over mid grey) and a 64-bit difference hash of their brightness (dHash: one bit per pair of
// neighbouring cells). Two pictures are alike when their hashes differ in at most --max bits (default
// 5), their shapes agree and their cell colours are close (so a red and a blue copy of one icon stay
// apart). Byte-identical copies are left to duplicates.js: a group is listed when it holds at least
// two different files.
// Decoding: headless Chrome (when found) decodes every format (PNG, JPEG, GIF, WebP, also WebP data
// in a .png file, which many skins are); without Chrome (--no-chrome) only real PNGs are decoded here
// with Node's zlib, and the rest is counted as skipped. Flat pictures (one colour) are skipped: their
// hash says nothing.
// Usage: node developers/audit/perceptual.js [repoDir] [--max N] [--top N] [--no-chrome]
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

const SIG = '89504e470d0a1a0a';
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
const IMAGE = /\.(png|jpe?g|gif|webp)$/i;

/**
 * Decode a PNG (not interlaced) into 9 x 8 average colour cells.
 * @param {Buffer} buf
 * @returns {{w: number, h: number, rgb: number[]} | null} rgb: 72 x [r, g, b]; null: not a PNG this reads
 */
function pngCells(buf) {
    if (buf.length < 33 || buf.toString('hex', 0, 8) !== SIG) return null;
    let w = 0, h = 0, depth = 0, type = 0, interlace = 0, plte = null, trns = null;
    const idat = [];
    for (let o = 8; o + 8 <= buf.length;) {
        const len = buf.readUInt32BE(o), kind = buf.toString('latin1', o + 4, o + 8), d = o + 8;
        if (d + len > buf.length) break;
        if (kind === 'IHDR') { w = buf.readUInt32BE(d); h = buf.readUInt32BE(d + 4); depth = buf[d + 8]; type = buf[d + 9]; interlace = buf[d + 12]; }
        else if (kind === 'PLTE') plte = buf.subarray(d, d + len);
        else if (kind === 'tRNS') trns = buf.subarray(d, d + len);
        else if (kind === 'IDAT') idat.push(buf.subarray(d, d + len));
        else if (kind === 'IEND') break;
        o = d + len + 4;
    }
    const ch = CHANNELS[type];
    if (!w || !h || !ch || interlace || !idat.length || (type === 3 && !plte) || [1, 2, 4, 8, 16].indexOf(depth) < 0) return null;
    let raw;
    try { raw = zlib.inflateSync(Buffer.concat(idat)); } catch (e) { return null; }
    const bitsPx = ch * depth, stride = Math.ceil(w * bitsPx / 8), bpp = Math.max(1, bitsPx >> 3);
    if (raw.length < (stride + 1) * h) return null;
    const sum = new Float64Array(216), cnt = new Float64Array(72);
    let prev = Buffer.alloc(stride), cur = Buffer.alloc(stride);
    const maxV = (1 << Math.min(depth, 8)) - 1, k = depth === 16 ? 2 : 1;
    for (let y = 0; y < h; y++) {
        const f = raw[y * (stride + 1)], s = y * (stride + 1) + 1;
        for (let i = 0; i < stride; i++) {
            const x = raw[s + i], a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
            let v;
            if (f === 0) v = x;
            else if (f === 1) v = x + a;
            else if (f === 2) v = x + b;
            else if (f === 3) v = x + ((a + b) >> 1);
            else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
            else return null;
            cur[i] = v & 255;
        }
        const row = Math.floor(y * 8 / h) * 9;
        for (let x = 0; x < w; x++) {
            let r, g, bl, al = 255;
            if (type === 3 || depth < 8) {
                const v = depth < 8 ? (cur[(x * depth) >> 3] >> (8 - depth - ((x * depth) & 7))) & maxV : cur[x];
                if (type === 3) { r = plte[v * 3]; g = plte[v * 3 + 1]; bl = plte[v * 3 + 2]; if (trns && v < trns.length) al = trns[v]; }
                else { r = g = bl = v * 255 / maxV; }
            } else {
                const o = x * ch * k;
                if (type === 0) { r = g = bl = cur[o]; }
                else if (type === 4) { r = g = bl = cur[o]; al = cur[o + k]; }
                else { r = cur[o]; g = cur[o + k]; bl = cur[o + 2 * k]; if (type === 6) al = cur[o + 3 * k]; }
            }
            const A = al / 255, cell = row + Math.floor(x * 9 / w);
            sum[cell * 3] += r * A + 128 * (1 - A);
            sum[cell * 3 + 1] += g * A + 128 * (1 - A);
            sum[cell * 3 + 2] += bl * A + 128 * (1 - A);
            cnt[cell]++;
        }
        const t = prev; prev = cur; cur = t;
    }
    const rgb = [];
    for (let i = 0; i < 216; i++) rgb.push(cnt[(i / 3) | 0] ? sum[i] / cnt[(i / 3) | 0] : 128);
    return { w, h, rgb };
}

/** dHash of the cells' brightness: [hi, lo] 32-bit halves; null when the picture is flat */
function dhash(rgb) {
    const L = [];
    for (let i = 0; i < 72; i++) L.push(0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2]);
    if (Math.max.apply(null, L) - Math.min.apply(null, L) < 8) return null;
    let hi = 0, lo = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        const bit = L[y * 9 + x] > L[y * 9 + x + 1] ? 1 : 0, n = y * 8 + x;
        if (n < 32) hi = (hi | (bit << n)) >>> 0; else lo = (lo | (bit << (n - 32))) >>> 0;
    }
    return [hi, lo];
}

function pop(v) { v = v - ((v >>> 1) & 0x55555555); v = (v & 0x33333333) + ((v >>> 2) & 0x33333333); return (((v + (v >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; }
function distance(a, b) { return pop((a[0] ^ b[0]) >>> 0) + pop((a[1] ^ b[1]) >>> 0); }
/** mean absolute difference of the cell colours (0..255) */
function colourDiff(a, b) { let s = 0; for (let i = 0; i < 216; i++) s += Math.abs(a[i] - b[i]); return s / 216; }

/* ---- decoding in headless Chrome (every format the browser reads) ---- */
const PAGE_FN = 'async function (b64) {' +
    ' const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);' +
    ' let bmp; try { bmp = await createImageBitmap(new Blob([u8])); } catch (e) { return null; }' +
    ' const W = 72, H = 64, c = new OffscreenCanvas(W, H), g = c.getContext("2d"); g.imageSmoothingQuality = "high";' +
    ' g.drawImage(bmp, 0, 0, W, H); const d = g.getImageData(0, 0, W, H).data, s = new Array(216).fill(0);' +
    ' for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = (y * W + x) * 4, A = d[o + 3] / 255, k = ((y >> 3) * 9 + (x >> 3)) * 3;' +
    ' s[k] += d[o] * A + 128 * (1 - A); s[k + 1] += d[o + 1] * A + 128 * (1 - A); s[k + 2] += d[o + 2] * A + 128 * (1 - A); }' +
    ' return { w: bmp.width, h: bmp.height, rgb: s.map((v) => v / 64) }; }';

function findChrome() {
    try { return require('../tests/lib/bench-client').findChrome(); } catch (e) { return null; }
}

/**
 * Decode pictures in a headless Chrome. Returns null when no Chrome could be started.
 * @param {string[]} rels
 * @param {function(string): Buffer} read
 * @returns {Promise<Map<string, {w, h, rgb}|null> | null>}
 */
async function chromeCells(rels, read) {
    const chrome = findChrome();
    if (!chrome || typeof WebSocket === 'undefined') return null;
    const { spawn } = require('child_process');
    const testChrome = require('../tests/lib/testchrome');
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-audit-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage'] : []), 'about:blank'], { stdio: 'ignore' });
    let exited = false;
    proc.on('exit', () => { exited = true; });
    proc.on('error', () => { exited = true; });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws = null;
    try {
        let port = 0;
        for (const until = Date.now() + 30000; !port && !exited && Date.now() < until;) {
            try { const l = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split(/\r?\n/); if (+l[0] > 0) port = +l[0]; } catch (e) { }
            if (!port) await sleep(200);
        }
        if (!port) return null;
        let page = null;
        for (const until = Date.now() + 30000; !page && Date.now() < until;) {
            try { page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page'); } catch (e) { await sleep(200); }
        }
        if (!page) return null;
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
        let id = 0;
        const pending = new Map();
        ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || {}); pending.delete(m.id); } };
        const send = (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
        const out = new Map();
        /* a few pictures at a time, so a slow one does not hold the rest */
        for (let i = 0; i < rels.length; i += 8) {
            const part = rels.slice(i, i + 8);
            const got = await Promise.all(part.map((rel) => send('Runtime.evaluate', {
                expression: '(' + PAGE_FN + ')(' + JSON.stringify(read(rel).toString('base64')) + ')', awaitPromise: true, returnByValue: true })));
            part.forEach((rel, j) => { const r = got[j] && got[j].result; out.set(rel, r && r.value ? r.value : null); });
        }
        return out;
    } catch (e) {
        return null;
    } finally {
        try { if (ws) ws.close(); } catch (e) { }
        testChrome.cleanupProfile(profile, { pid: exited ? 0 : proc.pid });
    }
}

/**
 * Group the pictures of the inventory that look alike.
 * @param {{files: Array<{path, blob, size}>}} inv
 * @param {string} repo
 * @param {{max?: number, colour?: number, chrome?: boolean, read?: function(string): Buffer}} [opts]
 * @returns {Promise<{groups: Array<{paths: string[], blobs: number, size: number, distance: number}>, hashed: number, decoder: string, skipped: Object<string, number>}>}
 */
async function perceptualGroups(inv, repo, opts) {
    opts = opts || {};
    const max = opts.max === undefined ? 5 : opts.max;
    const maxColour = opts.colour === undefined ? 16 : opts.colour;
    const read = opts.read || ((p) => fs.readFileSync(path.join(repo, p)));
    const pics = inv.files.filter((f) => IMAGE.test(f.path));
    const viaChrome = opts.chrome === false ? null : await chromeCells(pics.map((f) => f.path), read);
    const items = [], skipped = { notDecoded: 0, flat: 0 };
    for (const f of pics) {
        let d = null;
        if (viaChrome) d = viaChrome.get(f.path);
        else { try { d = pngCells(read(f.path)); } catch (e) { d = null; } }
        if (!d) { skipped.notDecoded++; continue; }
        const hsh = dhash(d.rgb);
        if (!hsh) { skipped.flat++; continue; }
        items.push({ path: f.path, blob: f.blob, size: f.size, ratio: d.w / d.h, rgb: d.rgb, hash: hsh });
    }
    /* union-find over close pairs of the same shape and colours */
    const parent = items.map((_, i) => i);
    const find = (i) => { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i; };
    const far = new Map();
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            const a = items[i], b = items[j];
            if (Math.abs(a.ratio - b.ratio) > 0.05 * Math.max(a.ratio, b.ratio)) continue;
            const dd = distance(a.hash, b.hash);
            if (dd > max || colourDiff(a.rgb, b.rgb) > maxColour) continue;
            const ri = find(i), rj = find(j);
            const m = Math.max(far.get(ri) || 0, far.get(rj) || 0, dd);
            if (ri !== rj) parent[ri] = rj;
            far.set(find(j), m);
        }
    }
    const by = new Map();
    items.forEach((it, i) => { const r = find(i); if (!by.has(r)) by.set(r, []); by.get(r).push(it); });
    const groups = [];
    for (const [r, list] of by) {
        const blobs = new Set(list.map((x) => x.blob));
        if (list.length < 2 || blobs.size < 2) continue;
        const size = list.reduce((a, x) => a + x.size, 0) - Math.max.apply(null, list.map((x) => x.size));
        groups.push({ paths: list.map((x) => x.path).sort(), blobs: blobs.size, size, distance: far.get(r) || 0 });
    }
    groups.sort((a, b) => b.size - a.size || a.paths[0].localeCompare(b.paths[0]));
    return { groups, hashed: items.length, decoder: viaChrome ? 'chrome' : 'png', skipped };
}

module.exports = { pngCells, dhash, distance, colourDiff, perceptualGroups };

if (require.main === module) {
    const { inventory } = require('./inventory');
    const args = process.argv.slice(2);
    const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? +args[i + 1] : d; };
    const repo = args.find((a, i) => a[0] !== '-' && args[i - 1] !== '--max' && args[i - 1] !== '--top') || path.resolve(__dirname, '..', '..');
    const t0 = Date.now();
    perceptualGroups(inventory(repo), repo, { max: opt('--max', 5), chrome: args.indexOf('--no-chrome') < 0 }).then((res) => {
        console.log(res.groups.length + ' groups of pictures that look the same but differ in bytes (' + res.hashed + ' pictures hashed by ' + res.decoder +
            '; skipped: ' + res.skipped.notDecoded + ' not decoded, ' + res.skipped.flat + ' flat) in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
        res.groups.slice(0, opt('--top', 30)).forEach((g) => console.log((g.size / 1048576).toFixed(2).padStart(7) + ' MiB  d<=' + g.distance + '  ' + g.paths.join('  ~  ')));
    });
}
