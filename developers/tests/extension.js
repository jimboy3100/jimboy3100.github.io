/* Legend Express extension (LMexpress/extension/content.js): agar.io's own page is stopped at
 * document_start, before the asynchronous on/off switch answers and the page is downloaded, so a
 * slow worker or download can no longer leave the player in the vanilla game. The switch is
 * mirrored in localStorage; an out-of-date mirror costs one reload.
 * node developers/tests/extension.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'content.js'), 'utf8');
let fail = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) fail++; };

function run(pathname, stored, enabled) {
    const log = [], ls = Object.assign({}, stored || {});
    let storageCb = null, msgCb = null, written = '';
    const docEl = {
        set innerHTML(v) { log.push('clear'); },
        appendChild() { log.push('loading'); }
    };
    const ctx = {
        console: { log() { }, error() { } }, JSON, Object, String, parseInt, navigator: { language: 'en-US' },
        location: { pathname, hash: '', href: 'https://agar.io' + pathname, reload() { log.push('reload'); } },
        localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); } },
        document: {
            documentElement: docEl,
            createElement: () => ({ style: {}, set innerHTML(v) { }, firstChild: { lastChild: {} } }),
            open() { log.push('open'); }, write(h) { written += h; log.push('write'); }, close() { }
        },
        chrome: {
            runtime: { getManifest: () => ({ version: '1.8.4' }), lastError: null, sendMessage: (m, cb) => { log.push('fetch'); msgCb = cb; } },
            storage: { local: { get: (d, cb) => { storageCb = cb; } } }
        }
    };
    ctx.window = ctx;
    ctx.window.stop = () => log.push('stop');
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    const sync = log.slice();
    if (storageCb) storageCb({ enabled: enabled });
    if (msgCb) msgCb({ data: '<html><body>LEGEND</body></html>' });
    return { log, sync, ls, written, ctx };
}

let r = run('/', {}, true);
check('first visit, switch on: agar.io stopped at once, before the switch answers', r.sync.join() === 'stop,clear,loading');
check('then the page is fetched and written with the init call', r.log.indexOf('fetch') > 0 && /LEGEND/.test(r.written) && /init\("1\.8\.4"\)/.test(r.written) && r.ls.lmExpressEnabled === '1');
check('the loading screen is shown once', r.log.filter(x => x === 'loading').length === 1);
r = run('/legendmod', { lmExpressEnabled: '1' }, true);
check('agar.io/legendmod: stopped at once too', r.sync[0] === 'stop' && /LEGEND/.test(r.written));
r = run('/', { lmExpressEnabled: '0' }, false);
check('switch off (mirror off): agar.io left alone, nothing fetched', r.log.length === 0 && r.ls.lmExpressEnabled === '0');
r = run('/', { lmExpressEnabled: '1' }, false);
check('switched off since the last visit: stopped, then one reload with the mirror corrected', r.sync[0] === 'stop' && r.log.indexOf('reload') > 0 && r.log.indexOf('fetch') < 0 && r.ls.lmExpressEnabled === '0');
r = run('/', { lmExpressEnabled: '0' }, true);
check('switched on since the last visit: stopped when the switch answers, then loaded', r.sync.length === 0 && r.log.slice(0, 3).join() === 'stop,clear,loading' && /LEGEND/.test(r.written) && r.ls.lmExpressEnabled === '1');
r = run('/legendmod', { lmExpressEnabled: '0' }, false);
check('agar.io/legendmod with the switch off: back to agar.io', r.ctx.location.href === 'https://agar.io/');
r = run('/shop', {}, true);
check('other agar.io pages: left alone', r.log.length === 0);
r = run('/captcha', {}, true);
check('captcha page: stopped at once, no Legend loading screen, the helper page fetched', r.sync.join() === 'stop,clear' && r.log.indexOf('fetch') > 0);

console.log(fail ? fail + ' FAILED' : 'all extension checks passed');
process.exit(fail ? 1 : 0);
