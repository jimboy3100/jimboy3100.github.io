/* Writes the shared Legend Express bootstrap (developers/loader/shared.js) into both loaders, between their
 * lmx-shared markers: the userscript LMexpress/LMexpress.user.js and the extension's LMexpress/extension/content.js.
 * Everything outside the markers is that loader's own browser adapter.
 *   node developers/loader-build.js            write both
 *   node developers/loader-build.js --check    exit 1 when one is out of date (nothing written)
 * After a change of content.js, rebuild the extension packages: node developers/extension-zip.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const SOURCE = path.join(__dirname, 'loader', 'shared.js');
const TARGETS = ['LMexpress/LMexpress.user.js', 'LMexpress/extension/content.js'];
const A = '/* lmx-shared:start */', B = '/* lmx-shared:end */';

const norm = (s) => s.replace(/\r\n/g, '\n');
/* the source without its header comment (the region names it instead) */
function region() {
    const src = norm(fs.readFileSync(SOURCE, 'utf8'));
    const body = src.replace(/^\/\*[\s\S]*?\*\/\n+/, '');
    if (/[^\x00-\x7e]/.test(body)) throw new Error('developers/loader/shared.js must be ASCII (the userscript is)');
    return A + ' /* GENERATED from developers/loader/shared.js by developers/loader-build.js: edit it there */\n' + body.replace(/\n*$/, '\n');
}

function build() {
    const out = {}, shared = region();
    for (const rel of TARGETS) {
        const old = norm(fs.readFileSync(path.join(root, rel), 'utf8'));
        const a = old.indexOf(A), b = old.indexOf(B);
        if (a < 0 || b < a) throw new Error(rel + ': lmx-shared markers not found');
        out[rel] = old.slice(0, a) + shared + old.slice(b);
    }
    return out;
}

function run(check) {
    const files = build(), stale = [];
    for (const rel of Object.keys(files)) {
        const file = path.join(root, rel), old = fs.readFileSync(file, 'utf8');
        if (norm(old) === files[rel]) continue;
        stale.push(rel);
        /* keep the file's own line endings */
        if (!check) fs.writeFileSync(file, /\r\n/.test(old) ? files[rel].replace(/\n/g, '\r\n') : files[rel]);
    }
    return stale;
}

module.exports = { build, run, region, TARGETS };

if (require.main === module) {
    const check = process.argv.indexOf('--check') >= 0;
    const stale = run(check);
    if (check && stale.length) {
        console.log('out of date (run node developers/loader-build.js): ' + stale.join(', '));
        process.exit(1);
    }
    console.log(stale.length ? (check ? '' : 'written: ') + stale.join(', ') : 'loaders up to date');
}
