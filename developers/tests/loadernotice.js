/* Legend Express update notice (LMexpress/LMexpress.js _lmxUpdateNotice, the real code): an older userscript
 * is told about 1.9; the extension is not told to update while the Chrome Web Store still has 1.8.5 (a store
 * install cannot unzip a package over its folder); website visitors get nothing.
 * node developers/tests/loadernotice.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const a = src.indexOf('var LMX_LATEST = '), b = src.indexOf('function startLM(modVersion, loaderName) {');
if (a < 0 || b < 0) { console.log('FAIL code not found'); process.exit(1); }

/* one page load: owner is the single-owner record, ls agar.io's localStorage */
function notice(version, loaderName, owner, ls) {
    const shown = [], ss = {}, store = Object.assign({}, ls || {});
    const ctx = {
        performance: { timeOrigin: 1700000000123.5 },
        sessionStorage: { getItem: (k) => (k === 'lm-loader-owner' ? owner || null : k in ss ? ss[k] : null), setItem: (k, v) => { ss[k] = String(v); } },
        localStorage: { getItem: (k) => (k in store ? store[k] : null) },
        document: { documentElement: { getAttribute: () => null } },
        _lmOnLegendWebsite: () => false, _lmEscHtml: (s) => String(s), _lmxT: (k) => k, _lmxE: (k) => k,
        toastr: { info: (html) => { shown.push(html); return { css() { } }; } }
    };
    vm.createContext(ctx);
    vm.runInContext(src.slice(a, b) + '\nvar __kind = _lmxUpdateNotice(' + JSON.stringify(version) + ', ' + JSON.stringify(loaderName) + ');', ctx);
    return { kind: ctx.__kind, html: shown.join('') };
}

const us = notice('1.8.7', undefined, null);
check('an old userscript (1.8.7) is told about 1.9', us.kind === 'userscript' && /LMexpress\.user\.js/.test(us.html), JSON.stringify(us));
check('userscript 1.9 gets no notice', notice('1.9', 'userscript', 'userscript:1700000000123.5').kind === '');
check('userscript 1.9.1 gets no notice, 1.9 neither (its manager updates it by @version)', notice('1.9.1', 'userscript', 'userscript:1700000000123.5').kind === '' && notice('1.9', 'userscript', 'userscript:1700000000123.5').kind === '');
const ext = notice('1.8.5', undefined, null, { lmExpressEnabled: '1' });
check('the store extension (1.8.5) is not told to unzip a new package', ext.kind === '' && ext.html === '', JSON.stringify(ext));
check('extension 1.9.0 (the zip) gets no notice', notice('1.9.0', 'extension', 'extension:1700000000123.5').kind === '');
check('an older extension (1.8.3) is still told about the store version', notice('1.8.3', undefined, null).kind === 'extension');
check('website visitors get no notice', notice('1.8', 'website', null).kind === '');
console.log(failed ? failed + ' failed' : 'all loader notice checks passed');
process.exit(failed ? 1 : 0);
