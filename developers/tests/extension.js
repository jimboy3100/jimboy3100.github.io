/* Legend Express extension (LMexpress/extension/content.js): agar.io's own page is stopped at
 * document_start, before the asynchronous on/off switch answers and the page is downloaded, so a
 * slow worker or download can no longer leave the player in the vanilla game. The switch is
 * mirrored in localStorage; an out-of-date mirror costs one reload. Only one Legend Express loader
 * owns a page load (lm-loader-owner); rules_legend.json; the Firefox package (developers/extension-zip.js).
 * node developers/tests/extension.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'content.js'), 'utf8');
/* the manifest runs texts.js (the generated texts) before content.js, in the same scope */
const texts = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'texts.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'manifest.json'), 'utf8'));
let fail = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) fail++; };

/* opts: session (sessionStorage), attr (html[data-lm-loader] at the start), search, hash, writer (writer.js
 * is loaded: it takes the pages), fails (how many downloads fail) */
function run(pathname, stored, enabled, opts) {
    opts = opts || {};
    const log = [], ls = Object.assign({}, stored || {}), ss = Object.assign({}, opts.session || {});
    let storageCb = null, msgCb = null, written = '', attr = opts.attr || null, fails = opts.fails || 0;
    const timers = [];
    const docEl = {
        set innerHTML(v) { log.push('clear'); },
        appendChild() { log.push('loading'); },
        getAttribute: (k) => (k === 'data-lm-loader' ? attr : null),
        setAttribute: (k, v) => { if (k === 'data-lm-loader') attr = v; }
    };
    const search = opts.search || '', hash = opts.hash || '';
    const ctx = {
        console: { log() { }, error() { } }, JSON, Object, String, Number, Date, parseInt, navigator: { language: 'en-US' },
        performance: { timeOrigin: 1700000000123.5 },
        setTimeout: (f) => { timers.push(f); },
        location: { pathname, search, hash, href: 'https://agar.io' + pathname + search + hash, reload() { log.push('reload'); } },
        history: { state: null, replaceState: (s, t, u) => { log.push('replace ' + u); ctx.location.href = 'https://agar.io' + u; } },
        localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); } },
        sessionStorage: { getItem: (k) => (k in ss ? ss[k] : null), setItem: (k, v) => { ss[k] = String(v); } },
        CustomEvent: function (type, init) { this.type = type; this.detail = init.detail; this.cancelable = init.cancelable; },
        document: {
            documentElement: docEl,
            createElement: () => ({ style: {}, set innerHTML(v) { }, firstChild: { lastChild: {} } }),
            open() { log.push('open'); }, write(h) { written += h; log.push('write'); }, close() { }
        },
        chrome: {
            runtime: {
                getManifest: () => ({ version: '1.8.4' }), lastError: null,
                sendMessage: (m, cb) => { log.push(m.type === 'fetch' ? 'fetch' : m.type); msgCb = cb; }
            },
            storage: { local: { get: (d, cb) => { storageCb = cb; }, set() { } } }
        }
    };
    ctx.window = ctx;
    ctx.window.stop = () => log.push('stop');
    /* writer.js in agar.io's own world: it cancels the event and writes the page itself */
    ctx.window.dispatchEvent = (e) => {
        if (!opts.writer || e.type !== 'lmx-write-page') return true;
        written += e.detail; log.push('writer');
        return false;
    };
    vm.createContext(ctx);
    vm.runInContext(texts, ctx);
    vm.runInContext(src, ctx);
    const sync = log.slice();
    if (storageCb) storageCb({ enabled: enabled });
    /* the downloads: the failed ones, each followed by the timer of the next try */
    for (let i = 0; i < 4 && msgCb; i++) {
        const cb = msgCb; msgCb = null;
        cb(fails-- > 0 ? { error: 'status 503' } : { data: '<html><body>LEGEND</body></html>' });
        while (timers.length) timers.shift()();
    }
    return { log, sync, ls, ss, written, ctx, attr: () => attr };
}
const ORIGIN = 1700000000123.5;

const cs = manifest.content_scripts;
check('manifest: writer.js runs first, in agar.io\'s own world, then texts.js and content.js', cs.length === 2 && cs[0].js.join() === 'writer.js' && cs[0].world === 'MAIN' &&
    cs[1].js.join() === 'texts.js,content.js' && !cs[1].world && cs.every(c => c.run_at === 'document_start' && c.matches.join() === 'https://agar.io/*'));
let r = run('/', {}, true);
check('first visit, switch on: agar.io stopped at once, before the switch answers', r.sync.join() === 'open,write,clear,loading');
/* window.stop() marks agar.io's parser as aborted and the browser then ignores the Legend page's document.write (white page) */
check('agar.io is never stopped with window.stop()', r.log.indexOf('stop') < 0);
check('then the page is fetched and written with the init call naming the extension', r.log.indexOf('fetch') > 0 && /LEGEND/.test(r.written) && /init\("1\.8\.4", "extension"\)/.test(r.written) && r.ls.lmExpressEnabled === '1');
check('the loading screen is shown once', r.log.filter(x => x === 'loading').length === 1);
check('it names itself owner of this page load (sessionStorage and html attribute)', r.ss['lm-loader-owner'] === 'extension:' + ORIGIN && r.attr() === 'extension:' + ORIGIN);
r = run('/', {}, true, { writer: true });
check('with writer.js (Firefox refuses document.open() from the isolated world): every page goes through it', r.log.indexOf('open') < 0 && r.log.filter(x => x === 'writer').length === 2 && /LEGEND/.test(r.written));
r = run('/legendmod', { lmExpressEnabled: '1' }, true);
check('agar.io/legendmod: stopped at once too', r.sync[0] === 'open' && /LEGEND/.test(r.written));
r = run('/legendmod/', {}, true, { search: '?sip=1.2.3.4:1500', hash: '#ffa' });
check('agar.io/ sent to agar.io/legendmod/ by the rule: the address is agar.io/?query#hash again before it is saved',
    r.sync[0] === 'replace /?sip=1.2.3.4:1500#ffa' && r.ls.url === 'https://agar.io/?sip=1.2.3.4:1500#ffa' && /LEGEND/.test(r.written));
r = run('/', { lmExpressEnabled: '0' }, false);
check('switch off (mirror off): agar.io left alone, nothing fetched', r.log.length === 0 && r.ls.lmExpressEnabled === '0' && !r.ss['lm-loader-owner']);
r = run('/', { lmExpressEnabled: '1' }, false);
check('switched off since the last visit: stopped, then one reload with the mirror corrected', r.sync[0] === 'open' && r.log.indexOf('reload') > 0 && r.log.indexOf('fetch') < 0 && r.ls.lmExpressEnabled === '0');
r = run('/', { lmExpressEnabled: '0' }, true);
/* taking over a page that ran for a while would leave agar.io's scripts, timers and connections running beside Legend Mod */
check('switched on since the last visit: one reload (taken over at its start then), no late takeover', r.sync.length === 0 && r.log.join() === 'reload' && r.ls.lmExpressEnabled === '1');
r = run('/', { lmExpressEnabled: '0' }, true, { session: { lmExpressReload: String(Date.now()) } });
check('...but never a reload loop: reloaded less than 10 s ago, it is taken over late', r.log.slice(0, 4).join() === 'open,write,clear,loading' && /LEGEND/.test(r.written) && r.ss['lm-loader-owner'] === 'extension:' + ORIGIN);
r = run('/legendmod/', { lmExpressEnabled: '0' }, true, { search: '?pass=x', session: { lmExpressReload: String(Date.now()) } });
check('...and then the address is agar.io/?query again too', r.log.indexOf('replace /?pass=x') >= 0 && r.ls.url === 'https://agar.io/?pass=x');
r = run('/legendmod', { lmExpressEnabled: '0' }, false);
check('agar.io/legendmod with the switch off: the agar.io/ rule is switched off first, then back to agar.io', r.log.join() === 'syncRules' && r.ctx.location.href === 'https://agar.io/');
r = run('/legendmod/', { lmExpressEnabled: '0' }, false, { search: '?sip=x', hash: '#h', session: { lmExpressLeft: String(Date.now()) } });
check('...at most once in 10 s (a rule that could not be switched off makes no loop)', r.log.length === 0);
r = run('/shop', {}, true);
check('other agar.io pages: left alone', r.log.length === 0 && !r.ss['lm-loader-owner']);
r = run('/hslo', {}, true);
check('userscript modes (/hslo): left alone, not claimed (the userscript may run them)', r.log.length === 0 && !r.ss['lm-loader-owner'] && r.attr() === null);
r = run('/captcha', {}, true);
check('captcha page: stopped at once, no Legend loading screen, the helper page fetched', r.sync.join() === 'open,write,clear' && r.log.indexOf('fetch') > 0);
r = run('/', {}, true, { fails: 1 });
check('a failed download is tried once more, then the page is written', r.log.filter(x => x === 'fetch').length === 2 && /LEGEND/.test(r.written) && !/Legend Express<\/title>/.test(r.written));
r = run('/', {}, true, { fails: 5 });
check('two failed downloads: the error page (with Try again), no endless retries', r.log.filter(x => x === 'fetch').length === 2 && /<title>Legend Express<\/title>/.test(r.written) && /status 503/.test(r.written));

/* the single-owner record: "<extension|userscript>:<performance.timeOrigin>" */
r = run('/', {}, true, { session: { 'lm-loader-owner': 'userscript:' + ORIGIN } });
check('the userscript owns this page load (sessionStorage): the extension does nothing at all', r.log.length === 0 && r.ss['lm-loader-owner'] === 'userscript:' + ORIGIN && r.attr() === null);
r = run('/', {}, true, { attr: 'userscript:' + ORIGIN });
check('the userscript owns this page load (html attribute only): the extension does nothing at all', r.log.length === 0 && !r.ss['lm-loader-owner']);
r = run('/', { lmExpressEnabled: '1' }, false, { session: { 'lm-loader-owner': 'userscript:' + ORIGIN } });
check('...not even the reload of an out-of-date switch', r.log.length === 0);
r = run('/legendmod', { lmExpressEnabled: '0' }, false, { session: { 'lm-loader-owner': 'userscript:' + ORIGIN } });
check('...nor the way back to agar.io with the switch off', r.log.length === 0 && r.ctx.location.href === 'https://agar.io/legendmod');
r = run('/', {}, true, { session: { 'lm-loader-owner': 'userscript:1699999999999.5' } });
check('a record of an earlier page load (another timeOrigin): taken over, record replaced', /LEGEND/.test(r.written) && r.ss['lm-loader-owner'] === 'extension:' + ORIGIN);
r = run('/', {}, true, { session: { 'lm-loader-owner': 'extension:' + ORIGIN } });
check('its own record: taken over as usual', /LEGEND/.test(r.written));
r = run('/', { lmExpressEnabled: '0' }, true, { session: { lmExpressReload: String(Date.now()) } });
check('switched on late: claimed when it takes over', r.ss['lm-loader-owner'] === 'extension:' + ORIGIN);

/* rules_legend.json: only agar.io/ itself (Legend Mod's address), only the top page */
const rules = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'rules_legend.json'), 'utf8'));
const redirect = rules.find(x => x.action.type === 'redirect'), header = rules.find(x => x.action.type === 'modifyHeaders');
const ruleRe = new RegExp(redirect.condition.regexFilter), headerRe = new RegExp(header.condition.regexFilter);
const sub = (u) => u.replace(ruleRe, redirect.action.redirect.regexSubstitution.replace(/\\(\d)/g, '$$$1'));
check('rule: agar.io/ and agar.io/?query go to agar.io/legendmod/ with the query', ruleRe.test('https://agar.io/') && sub('https://agar.io/') === 'https://agar.io/legendmod/' &&
    sub('https://agar.io/?sip=1.2.3.4:1500&pass=x') === 'https://agar.io/legendmod/?sip=1.2.3.4:1500&pass=x');
check('rule: nothing else of agar.io (other modes, agar.io\'s files, the auth and captcha pages)', !['https://agar.io/normal', 'https://agar.io/hslo', 'https://agar.io/legendmod', 'https://agar.io/legendmod/',
    'https://agar.io/captcha', 'https://agar.io/agario.core.js', 'https://agar.io/mc/agario.js', 'https://agar.io/bundle_end.b1b02ab7da05e612b2ea.js', 'https://agar.io/index.html', 'https://www.agar.io/',
    'https://agar.io.evil.example/', 'http://agar.io/', 'https://accounts.google.com/?r=https://agar.io/'].some(u => ruleRe.test(u)));
check('rule: top page only (never agar.io in a frame of another mod, never scripts or XHR)', redirect.condition.resourceTypes.join() === 'main_frame');
check('header rule: UTF-8 only on the Legend and captcha pages (agar.io\'s 404 page has no charset)', ['https://agar.io/legendmod/', 'https://agar.io/legendmod/?sip=1', 'https://agar.io/legendmod', 'https://agar.io/captcha'].every(u => headerRe.test(u)) &&
    !['https://agar.io/', 'https://agar.io/hslo', 'https://agar.io/legendmodx', 'https://agar.io/captcha.js', 'https://agar.io/agario.core.js'].some(u => headerRe.test(u)) &&
    header.condition.resourceTypes.join() === 'main_frame,sub_frame' && header.action.responseHeaders.length === 1 && /charset=utf-8/.test(header.action.responseHeaders[0].value));
check('manifest: the rule set is declared and enabled; the rule follows the switch (background.js)', manifest.declarative_net_request.rule_resources.some(x => x.id === 'legend_page' && x.path === 'rules_legend.json' && x.enabled) &&
    /updateEnabledRulesets/.test(fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', 'background.js'), 'utf8')));

/* the Firefox package: same files, the manifest differs only where Firefox needs it */
const { firefoxManifest, packageFiles } = require('../extension-zip.js');
const ff = firefoxManifest(manifest);
check('Firefox manifest: background as an event page, an add-on id, data collection declared', ff.background.scripts.join() === 'background.js' && !ff.background.service_worker &&
    /@/.test(ff.browser_specific_settings.gecko.id) && ff.browser_specific_settings.gecko.data_collection_permissions.required.join() === 'none' && parseFloat(ff.browser_specific_settings.gecko.strict_min_version) >= 128);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
check('Firefox manifest: everything else unchanged', Object.keys(manifest).every(k => k === 'background' || same(manifest[k], ff[k])) && !manifest.browser_specific_settings);
const pkg = packageFiles(path.join(__dirname, '..', '..', 'LMexpress', 'extension'), '');
check('package: every file the manifest names, nothing Chrome writes into the folder', ['writer.js', 'texts.js', 'content.js', 'background.js', 'popup.html', 'popup.js', 'rules_legend.json', 'rules_sigmally.json', 'manifest.json', '_locales/en/messages.json'].every(f => pkg.includes(f)) &&
    !pkg.some(f => f.startsWith('_metadata')));
const [major, minor] = manifest.version.split('.').map(Number);
check('manifest version 1.9 or newer (the version LMexpress.js compares)', major > 1 || (major === 1 && minor >= 9));

for (const [i, c] of ['pt', 'id', 'ja', 'it'].entries()) {
    const n = i + 13;
    const r2 = run('/', { languagemod: String(n) }, true);
    check(c + ': stored language accepted', r2.ctx.lmxExtLang(String(n)) === n);
    check(c + ': actual loading translation', r2.ctx.lmxExtText('boot.loading', n) !== r2.ctx.lmxExtText('boot.loading', 1));
    r2.ctx.navigator.language = c === 'pt' ? 'pt-BR' : c + '-XX';
    check(c + ': a browser in this language gets it (no stored language)', r2.ctx.lmxExtLang(null) === n);
    /* Chrome's own locale folder (store page, chrome://extensions) */
    const loc = { pt: 'pt_BR', id: 'id', ja: 'ja', it: 'it' }[c];
    const msg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'extension', '_locales', loc, 'messages.json'), 'utf8'));
    check(c + ': _locales/' + loc + ' description', !!(msg.description && msg.description.message));
}
r = run('/', {}, true);
r.ctx.navigator.language = 'in-ID';
check('old Indonesian code "in": Indonesian', r.ctx.lmxExtLang(null) === 14);
r.ctx.navigator.language = 'el-GR';
check('the first twelve unchanged: Greek browser -> 2', r.ctx.lmxExtLang(null) === 2 && r.ctx.lmxExtLang('12') === 12);
r.ctx.navigator.language = 'sv-SE';
check('an unsupported browser language: English', r.ctx.lmxExtLang(null) === 1);

/* the userscript loader (Tampermonkey): its own language pick, run as written */
const us = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'LMexpress.user.js'), 'utf8');
const usLang = /var lmxLang = \(function \(\) \{[\s\S]*?\r?\n\}\)\(\);/.exec(us);
check('userscript: lmxLang found', !!usLang);
const pick = (nav, stored) => vm.runInNewContext(usLang[0] + ';lmxLang', {
    navigator: { language: nav }, localStorage: { getItem: (k) => (k === 'languagemod' ? stored : null) }, parseInt, String
});
if (usLang) {
    check('userscript: pt-BR / id / ja / it browsers get 13-16', pick('pt-BR', null) === 13 && pick('id-ID', null) === 14 && pick('ja-JP', null) === 15 && pick('it-IT', null) === 16);
    check('userscript: "in" is Indonesian, unknown is English, stored wins', pick('in', null) === 14 && pick('sv', null) === 1 && pick('ja-JP', '2') === 2 && pick('fr-FR', null) === 5);
}
console.log(fail ? fail + ' FAILED' : 'all extension checks passed');
process.exit(fail ? 1 : 0);
