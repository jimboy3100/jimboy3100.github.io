/* Builds the Legend Express extension packages from LMexpress/extension (one code base):
 *   LMexpress/LegendExpressExtension.zip          Chrome, Edge, Brave, Opera, Vivaldi (manifest as it is)
 *   LMexpress/LegendExpressExtension-firefox.zip  Firefox desktop and Android (manifest from firefoxManifest)
 * node developers/extension-zip.js */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.join(__dirname, '..');
const extDir = path.join(root, 'LMexpress', 'extension');

/* Firefox runs the background script as an event page (no extension service workers) and needs an
 * add-on id; the rest of the manifest and every file are the same */
function firefoxManifest(manifest) {
    const m = JSON.parse(JSON.stringify(manifest));
    m.background = { scripts: [manifest.background.service_worker] };
    m.browser_specific_settings = {
        gecko: {
            id: 'legend-express@legendmod.ml',
            strict_min_version: '140.0',
            /* addons.mozilla.org asks every new add-on to declare its data collection: none */
            data_collection_permissions: { required: ['none'] }
        },
        gecko_android: { strict_min_version: '142.0' }
    };
    return m;
}

/* the package files: everything in the folder except what a browser writes there (_metadata) and dot files */
function packageFiles(dir, prefix) {
    let out = [];
    for (const name of fs.readdirSync(dir).sort()) {
        if (name.startsWith('.') || name === '_metadata') continue;
        const full = path.join(dir, name), rel = prefix ? prefix + '/' + name : name;
        if (fs.statSync(full).isDirectory()) out = out.concat(packageFiles(full, rel));
        else out.push(rel);
    }
    return out;
}

const crcTable = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});
function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}
function dosTime(d) {
    return { time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
        date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() };
}

/* A plain zip (deflate, no folder entries), the files at its top level as the stores expect */
function writeZip(target, entries) {
    const parts = [], central = [];
    let offset = 0;
    for (const e of entries) {
        const name = Buffer.from(e.name, 'utf8'), data = e.data, packed = zlib.deflateRawSync(data, { level: 9 });
        const crc = crc32(data), t = dosTime(e.mtime);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
        local.writeUInt16LE(t.time, 10); local.writeUInt16LE(t.date, 12); local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26);
        const dir = Buffer.alloc(46);
        dir.writeUInt32LE(0x02014b50, 0); dir.writeUInt16LE(20, 4); dir.writeUInt16LE(20, 6); dir.writeUInt16LE(0x0800, 8); dir.writeUInt16LE(8, 10);
        dir.writeUInt16LE(t.time, 12); dir.writeUInt16LE(t.date, 14); dir.writeUInt32LE(crc, 16);
        dir.writeUInt32LE(packed.length, 20); dir.writeUInt32LE(data.length, 24); dir.writeUInt16LE(name.length, 28);
        dir.writeUInt32LE(offset, 42);
        parts.push(local, name, packed);
        central.push(dir, name);
        offset += local.length + name.length + packed.length;
    }
    const centralBuf = Buffer.concat(central), end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralBuf.length, 12); end.writeUInt32LE(offset, 16);
    fs.writeFileSync(target, Buffer.concat(parts.concat([centralBuf, end])));
}

function build() {
    const files = packageFiles(extDir, '');
    const read = (rel) => ({ name: rel, data: fs.readFileSync(path.join(extDir, rel)), mtime: fs.statSync(path.join(extDir, rel)).mtime });
    const chrome = files.map(read);
    const manifest = JSON.parse(fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8'));
    const firefox = chrome.map((e) => e.name !== 'manifest.json' ? e
        : Object.assign({}, e, { data: Buffer.from(JSON.stringify(firefoxManifest(manifest), null, 4).replace(/\n/g, '\r\n') + '\r\n', 'utf8') }));
    writeZip(path.join(root, 'LMexpress', 'LegendExpressExtension.zip'), chrome);
    writeZip(path.join(root, 'LMexpress', 'LegendExpressExtension-firefox.zip'), firefox);
    console.log('Legend Express ' + manifest.version + ': ' + files.length + ' files -> LMexpress/LegendExpressExtension.zip, LMexpress/LegendExpressExtension-firefox.zip');
}

module.exports = { firefoxManifest, packageFiles, writeZip };
if (require.main === module) build();
