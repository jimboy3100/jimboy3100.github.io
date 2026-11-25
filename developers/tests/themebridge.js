/* Theme bridge checks: lib/lm-theme-bridge.js runs against a stub page. Messages are accepted
 * only from the parent / opener window on an exact HTTPS Legend or agar.io origin, only valid colours
 * and safe https images pass, the theme value is size-checked before decoding, the #anchor a link had
 * comes back, the HUD palette / font / corners reach the page, Restore website theme clears it for the
 * tab, and an embedded page says "lm-theme-ready" once. The sender side (LMexpress.js) decorates only
 * exact HTTPS Legend links, keeps the anchor, strips query tokens and logins from the background image,
 * stays bounded and sends live updates only to the pages that said ready.
 * Rendered styles in a real browser: developers/tests/themepages.js.
 * node developers/tests/themebridge.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'lib', 'lm-theme-bridge.js'), 'utf8');
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

function cls() { const s = new Set(); return { set: s, add: c => s.add(c), remove: c => s.delete(c), contains: c => s.has(c) }; }
function page(opts) {
    opts = opts || {};
    const props = {}, listeners = {}, classes = cls(), bodyClasses = cls(), styles = [], bodyKids = [], posted = [], replaced = [];
    const style = { setProperty: (k, v) => { props[k] = String(v); }, removeProperty: k => { delete props[k]; } };
    const attrs = {};
    const de = { style, classList: classes, appendChild: n => { n.parentNode = de; styles.push(n); },
        removeChild: n => { const i = styles.indexOf(n); if (i >= 0) styles.splice(i, 1); },
        setAttribute: (k, v) => { attrs[k] = String(v); }, removeAttribute: k => { delete attrs[k]; } };
    const session = opts.session || {};
    const docListeners = {};
    let decodes = 0;
    const head = { appendChild: n => { n.parentNode = head; styles.push(n); }, removeChild: n => { const i = styles.indexOf(n); if (i >= 0) styles.splice(i, 1); } };
    const body = { classList: bodyClasses, appendChild: n => { n.parentNode = body; bodyKids.push(n); },
        removeChild: n => { const i = bodyKids.indexOf(n); if (i >= 0) bodyKids.splice(i, 1); } };
    const all = () => styles.concat(bodyKids);
    const document = {
        documentElement: de, head, body, readyState: 'loading', referrer: opts.referrer || '',
        getElementById: id => all().find(s => s.id === id) || null,
        getElementsByName: () => [],
        createElement: tag => { const ev = {}, at = {}; return { tagName: tag, id: '', textContent: '', attrs: at, ev, setAttribute: (k, v) => { at[k] = v; }, addEventListener: (t, fn) => { ev[t] = fn; } }; },
        addEventListener: (t, fn) => { docListeners[t] = fn; },
        currentScript: { getAttribute: k => k === 'data-lm-css' ? (opts.mode || null) : k === 'data-lm-reset' ? (opts.reset || null) : null }
    };
    const opener = opts.opener || null;
    const loc = { hash: opts.hash || '', search: opts.search || '', origin: 'https://www.legendmod.ml', pathname: '/index.html', href: 'https://www.legendmod.ml/index.html' };
    if (opts.ancestors) loc.ancestorOrigins = opts.ancestors;
    const window = {
        location: loc,
        history: { state: null, replaceState: (s, t, u) => { replaced.push(u); const m = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(u); loc.search = m[2] || ''; loc.hash = m[3] || ''; } },
        addEventListener: (t, fn) => { listeners[t] = fn; },
        opener, scrollY: 0,
        sessionStorage: { getItem: k => (k in session ? session[k] : null), setItem: (k, v) => { session[k] = String(v); }, removeItem: k => { delete session[k]; } }
    };
    window.parent = opts.top ? window : (opts.parent || { postMessage: (m, o) => posted.push({ to: 'parent', m, o }) });
    if (opener && !opener.postMessage) opener.postMessage = (m, o) => posted.push({ to: 'opener', m, o });
    window.window = window;
    const ctx = { window, document, atob: s => { decodes++; return Buffer.from(s, 'base64').toString('latin1'); }, btoa: s => Buffer.from(s, 'latin1').toString('base64'), JSON, console, URL };
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return { ctx, attrs, session, docListeners, props, listeners, classes: classes.set, bodyClasses: bodyClasses.set, styles, bodyKids, posted, replaced, loc,
        parent: window.parent, opener, api: window.lmThemeBridge, decodes: () => decodes,
        send: (data, origin, source) => listeners.message({ data, origin, source }) };
}
/* the sender's encoding: UTF-8 base64url */
const enc = o => Buffer.from(JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const encOld = o => Buffer.from(JSON.stringify(o), 'latin1').toString('base64');
const T = { pc: '#112233', pc2: '#223344', mc: '#ff0000', tc: '#000000', tc2: '#555555', btc: '#fefefe',
    b1: '#010101', b2: '#020202', b3: '#030303', b4: '#040404', b1b: '#111111', b2b: '#121212', b3b: '#131313', b4b: '#141414',
    op: '0.5', bg: 'https://i.imgur.com/abc.png', rad: '0' };

/* ---- direct visitors ---- */
let p = page();
check('no theme in the URL: nothing applied, no stylesheet', !p.api.isThemed() && p.api.getTheme() === null && !p.styles.length && !p.classes.size);
check('direct visit: the address is left alone', p.replaced.length === 0);
check('direct visit at the top: no ready message is sent', page({ top: true }).posted.length === 0);

/* ---- hash ---- */
p = page({ hash: '#lm=' + enc(T) });
check('hash: the theme is applied', p.api.isThemed() && p.props['--lm-pc'] === '#112233' && p.props['--lm-mc'] === '#ff0000');
check('hash: button colours and hover colours use the mod names', p.props['--lm-btn1'] === '#010101' && p.props['--lm-btn4b'] === '#141414' && p.props['--lm-btn-tc'] === '#fefefe');
check('hash: opacity, background image and radius', p.props['--lm-op'] === '0.5' && p.props['--lm-menu-bg'] === 'url("https://i.imgur.com/abc.png")' && p.props['--lm-radius'] === '0px' && p.props['--lm-radius-s'] === '0px');
check('hash: getTheme() is the applied theme', p.api.getTheme().mc === '#ff0000' && p.api.getTheme().rad === '0');
check('hash: html and body are marked, the image too', p.classes.has('lm-themed-root') && p.classes.has('lm-bg-set') && p.bodyClasses.has('lm-themed'));
check('hash: taken out of the address', p.replaced.length === 1 && p.replaced[0] === '/index.html' && p.loc.hash === '');
check('stylesheet: one, with the opacity and the hover colours', p.styles.length === 1 && /--lm-op/.test(p.styles[0].textContent) && /\.btn-primary:hover \{ background: var\(--lm-btn1b/.test(p.styles[0].textContent));
check('stylesheet: the older names stay as aliases', /--lm-b1: var\(--lm-btn1\)/.test(p.styles[0].textContent) && /--lm-bg-url: var\(--lm-menu-bg/.test(p.styles[0].textContent));
check('stylesheet: plain buttons and fields use the small corner', /button:not\(\.btn\):not\(\.close\)[^}]*border-radius: var\(--lm-radius-s, 4px\)/.test(p.styles[0].textContent) &&
    /textarea, select \{[^}]*border-radius: var\(--lm-radius-s, 4px\)/.test(p.styles[0].textContent) && /html\.lm-radius-set button:not\(\.close\)[^{]*\{ border-radius: var\(--lm-radius-s\) !important/.test(p.styles[0].textContent));
check('search ?lm= also works and is taken out, the rest of the query stays', (() => { const q = page({ search: '?a=1&lm=' + enc(T) }); return q.props['--lm-tc'] === '#000000' && q.replaced[0] === '/index.html?a=1'; })());
check('a broken hash is ignored', !page({ hash: '#lm=%%%' }).api.isThemed() && !page({ hash: '#lm=' + Buffer.from('[1,2]').toString('base64') }).api.isThemed());
check('an older plain base64 link still works', page({ hash: '#lm=' + encOld(T) }).props['--lm-mc'] === '#ff0000');
const big = page({ hash: '#lm=' + 'A'.repeat(5000) });
check('a value over 4096 characters is refused before it is decoded', !big.api.isThemed() && big.decodes() === 0);

/* ---- anchors ---- */
const an = page({ hash: '#controls&lm=' + enc(T) });
check('anchor: #controls&lm=... applies the theme and the address is #controls again', an.api.isThemed() && an.replaced[0] === '/index.html#controls' && an.loc.hash === '#controls');
const an2 = page({ hash: '#Changelog&x=1&lm=' + enc(T) });
check('anchor: other hash parts stay in order', an2.loc.hash === '#Changelog&x=1');
check('hashchange: a new #lm= is applied and taken out', (() => { const h = page(); h.loc.hash = '#faq&lm=' + enc(T); h.listeners.hashchange(); return h.api.isThemed() && h.loc.hash === '#faq'; })());

/* ---- HUD palette, font, corners ---- */
const H = Object.assign({}, T, { hm: '#00ff00', hb: 'rgba(36,36,36,0.49)', ht: '#eeeeee', hf: 'Roboto Condensed', hw: '400', hs: '1.2', rad: '10', rs: '6' });
const hp = page({ hash: '#lm=' + enc(H) });
check('HUD colours become --lm-hud-mc/bg/tc', hp.props['--lm-hud-mc'] === '#00ff00' && hp.props['--lm-hud-bg'] === 'rgba(36,36,36,0.49)' && hp.props['--lm-hud-tc'] === '#eeeeee');
check('HUD font, weight, scale and size', hp.props['--lm-hud-font'] === 'Roboto Condensed' && hp.props['--lm-hud-fw'] === '400' && hp.props['--lm-hud-scale'] === '1.2' && hp.props['--lm-hud-fs'] === '24px');
check('the small corner --lm-radius-s', hp.props['--lm-radius'] === '10px' && hp.props['--lm-radius-s'] === '6px' && hp.classes.has('lm-radius-set'));
check('an older link with only rad gets a small corner too', page({ hash: '#lm=' + enc(Object.assign({}, T, { rad: '10' })) }).props['--lm-radius-s'] === '6px');
check('HUD font with CSS characters is dropped', hp.api.clean(Object.assign({}, T, { hf: 'x;}body{', hw: '5000', hs: '9' })).hf === '' && hp.api.clean(Object.assign({}, T, { hw: '5000' })).hw === '' && hp.api.clean(Object.assign({}, T, { hs: '9' })).hs === '');

/* ---- messages ---- */
p = page();
p.send({ type: 'lm-theme', theme: T }, 'https://evil.example', p.parent);
check('message from an unrelated origin is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'http://www.legendmod.ml', p.parent);
check('message from an http Legend origin is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'https://www.legendmod.ml:8443', p.parent);
check('message from another port is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'https://www.legendmod.ml', {});
check('message from a window that is not the parent or opener is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: [1, 2] }, 'https://agar.io', p.parent);
check('a theme that is an array is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'https://agar.io', p.parent);
check('message from the parent on agar.io is accepted', p.api.isThemed() && p.props['--lm-mc'] === '#ff0000');
check('getTheme() returns a theme received by message', p.api.getTheme() && p.api.getTheme().pc === '#112233');
p.send({ type: 'other', theme: Object.assign({}, T, { mc: '#00ff00' }) }, 'https://agar.io', p.parent);
check('a message of another type is ignored', p.props['--lm-mc'] === '#ff0000');
p.send({ type: 'lm-theme', theme: Object.assign({}, T, { mc: '#00ff00' }) }, 'https://legendmod.ml', p.parent);
check('a live update from the bare legendmod.ml origin is applied', p.props['--lm-mc'] === '#00ff00');
const op = page({ opener: {} });
op.send({ type: 'lm-theme', theme: T }, 'https://jimboy3100.github.io', op.opener);
check('message from the opener on a Legend origin is accepted', op.api.isThemed());

/* ---- removing the background ---- */
p.send({ type: 'lm-theme', theme: Object.assign({}, T, { bg: '' }) }, 'https://agar.io', p.parent);
check('removing the background clears the image', p.props['--lm-menu-bg'] === 'none' && p.api.getTheme().bg === '' && !p.classes.has('lm-bg-set'));
p.send({ type: 'lm-theme', theme: Object.assign({}, T, { rad: '' }) }, 'https://agar.io', p.parent);
check('no corner choice removes both radii', !('--lm-radius' in p.props) && !('--lm-radius-s' in p.props) && !p.classes.has('lm-radius-set'));

/* ---- validation ---- */
const C = p.api.clean;
const bad = C({ pc: 'red;}body{display:none', mc: 'url(https://x/y.png)', tc: 'expression(alert(1))', b1: '#12345', tc2: 'rgba(1,2,3,.5)',
    bg: 'javascript:alert(1)', op: '5', rad: '-3', pass: 'secret', token: 'x' });
check('CSS injection in a colour falls back to the default', bad.pc === '#00243e' && bad.mc === '#01d9cc' && bad.tc === '#ffffff' && bad.b1 === '#018cf6');
check('rgba colours pass', bad.tc2 === 'rgba(1,2,3,.5)' && C({ pc: 'rgb(1 2 3 / 50%)' }).pc === 'rgb(1 2 3 / 50%)' && C({ pc: 'hsl(120deg, 50%, 50%)' }).pc === 'hsl(120deg, 50%, 50%)');
check('malformed colour functions are refused', C({ pc: 'rgb(1,2)', mc: '#fff' }).pc === '#00243e' && C({ pc: 'rgba(,,,,)', mc: '#fff' }).pc === '#00243e' && C({ pc: 'rgb(1,2,3,4,5,6)', mc: '#fff' }).pc === '#00243e');
check('only real colour names pass', C({ pc: 'Red', mc: 'foobar' }).pc === 'Red' && C({ pc: 'Red', mc: 'foobar' }).mc === '#01d9cc' && C({ pc: 'expression', mc: '#fff' }).pc === '#00243e' && C({ pc: 'rebeccapurple' }).pc === 'rebeccapurple');
check('long values are refused', C({ pc: 'rgb(' + '1,'.repeat(40) + '1)', mc: '#fff' }).pc === '#00243e' && C(Object.assign({}, T, { op: '0.5' + '0'.repeat(20) })).op === '0.96');
check('clean([]), clean({}) and objects without one valid colour are not themes', C([]) === null && C({}) === null && C({ bg: 'https://x.com/a.png' }) === null && C({ pc: 'nope', op: 0.5 }) === null && C([T]) === null);
check('an object with too many keys is not a theme', C(Object.assign({}, T, Object.fromEntries(Array.from({ length: 70 }, (_, i) => ['k' + i, 1])))) === null);
const I = s => C({ mc: '#fff', bg: s }).bg;
check('only https images pass', bad.bg === '' && I('http://x.com/a.png') === '' && I('https://x.com/a.png") ; x') === '' && I('https://x.com/a.png') === 'https://x.com/a.png' && I('data:image/png;base64,AAA') === '');
check('image: a login in the address drops the image', I('https://user:pass@x.com/a.png') === '' && I('https://token@x.com/a.png') === '');
check('image: query tokens and the fragment are stripped, public size values stay', I('https://x.com/a.png?token=SECRET&w=200#frag') === 'https://x.com/a.png?w=200' && I('https://x.com/a.png?sig=abc&exp=1') === 'https://x.com/a.png');
check('image: a Unicode path passes (encoded)', I('https://example.com/\u03b5\u03b9\u03ba\u03cc\u03bd\u03b1.png') === 'https://example.com/%CE%B5%CE%B9%CE%BA%CF%8C%CE%BD%CE%B1.png');
check('opacity out of range falls back, radius out of range is dropped', bad.op === '0.96' && bad.rad === '' && C({ mc: '#fff', op: 0.3 }).op === '0.3' && C({ mc: '#fff', rad: 10 }).rad === '10');
check('unknown keys (account data) are dropped', !('pass' in bad) && !('token' in bad));
check('a non-object is not a theme', C(null) === null && C('x') === null && p.api.apply(42) === false && p.api.apply([]) === false);

/* ---- language and the tab's session ---- */
const lp = page({ hash: '#lm=' + enc(Object.assign({}, T, { lang: 2 })) });
check('language: the Legend Mod language number becomes a code on html', lp.attrs['data-lm-lang'] === 'el' && lp.api.getLang() === 'el' && lp.api.getTheme().lang === '2');
check('language: urlLang() keeps the number from the address for lm-i18n.js', lp.api.urlLang() === '2' && page({ session: lp.session }).api.urlLang() === '');
check('language: only 1-12 passes', C({ mc: '#fff', lang: 13 }).lang === '' && C({ mc: '#fff', lang: 'en' }).lang === '' && C({ mc: '#fff', lang: '12' }).lang === '12' && page({ hash: '#lm=' + enc(T) }).api.getLang() === '');
const kept = page({ session: lp.session });
check('session: another Legend page in the same tab keeps the theme and language', kept.api.isThemed() && kept.props['--lm-mc'] === '#ff0000' && kept.attrs['data-lm-lang'] === 'el');
check('session: a new tab without #lm= shows the normal design', !page({ session: {} }).api.isThemed());
const junk = page({ session: { lmThemeBridge: '{"mc":"red;}x{","pc":"#123","token":"abc"}' } });
check('session: a stored value is validated again', junk.api.getTheme().mc === '#01d9cc' && !('token' in junk.api.getTheme()));
check('session: an oversized stored value is ignored', !page({ session: { lmThemeBridge: JSON.stringify(Object.assign({}, T, { x: 'y'.repeat(9000) })) } }).api.isThemed());

/* ---- Restore website theme ---- */
const tp = page({ top: true, hash: '#lm=' + enc(H) });
const btn = tp.bodyKids.find(n => n.id === 'lm-bridge-reset');
check('reset: a top-level themed page shows the Restore website theme button', !!btn && btn.tagName === 'button' && btn.textContent === 'Restore website theme' && btn.attrs['data-i18n'] === 'site.restoreTheme');
check('reset: its style is in the bridge stylesheet (fixed, small corner)', /#lm-bridge-reset \{ position: fixed !important;[^}]*border-radius: var\(--lm-radius-s, 4px\)/.test(tp.styles[0].textContent));
btn.ev.click();
check('reset: the variables, classes, stylesheet and button are gone', !tp.api.isThemed() && !Object.keys(tp.props).length && !tp.classes.size && !tp.bodyClasses.size && !tp.styles.length && !tp.bodyKids.length && !('data-lm-lang' in tp.attrs));
check('reset: the tab forgets the theme and stays off', !('lmThemeBridge' in tp.session) && tp.session.lmThemeBridgeOff === '1' && tp.api.isOff());
tp.send({ type: 'lm-theme', theme: T }, 'https://agar.io', tp.parent);
check('reset: a later live update from the game is ignored', !tp.api.isThemed());
check('reset: the next Legend page in the tab keeps the website design', !page({ session: tp.session }).api.isThemed());
check('reset: a new link from the game themes the tab again', (() => { const n = page({ session: tp.session, hash: '#lm=' + enc(T) }); return n.api.isThemed() && !n.api.isOff(); })());
check('reset: embedded pages and data-lm-reset="off" get no button', !page({ hash: '#lm=' + enc(T) }).bodyKids.length && !page({ top: true, reset: 'off', hash: '#lm=' + enc(T) }).bodyKids.length);

/* ---- ready handshake ---- */
const fr = page({ ancestors: ['https://agar.io'] });
check('handshake: an embedded page says lm-theme-ready once, to the exact game origin', fr.posted.length === 1 && fr.posted[0].m.type === 'lm-theme-ready' && fr.posted[0].o === 'https://agar.io' && fr.posted[0].to === 'parent');
check('handshake: the referrer is used without ancestorOrigins', page({ referrer: 'https://www.legendmod.ml/play.html' }).posted[0].o === 'https://www.legendmod.ml');
check('handshake: nothing is said to another site or over http', !page({ ancestors: ['https://evil.example'] }).posted.length && !page({ referrer: 'http://agar.io/' }).posted.length);
check('handshake: a tab opened by the game tells its opener', (() => { const o = page({ top: true, opener: {}, referrer: 'https://agar.io/' }); return o.posted.length === 1 && o.posted[0].to === 'opener'; })());
check('handshake: nothing after Restore website theme', !page({ ancestors: ['https://agar.io'], session: { lmThemeBridgeOff: '1' } }).posted.length);

/* ---- website pages ---- */
const sp = page({ hash: '#lm=' + enc(H), mode: 'site' });
const sct = sp.styles[0].textContent;
check('site mode: the page variables are mapped, not the generic stylesheet', sct.includes('--accent: var(--lm-mc)') && !sct.includes('.btn-primary') && sct.includes('html.lm-themed-root'));
check('site mode: the menu background image, except pages with their own (companion OBS)', /html\.lm-themed-root\.lm-bg-set body:not\(\.bg-transparent\):not\(\[style\*="background"\]\) \{ background-image: var\(--lm-menu-bg\) !important/.test(sct));
check('site mode: small corner for buttons and fields', sct.includes('--radius-sm: var(--lm-radius-s)') && /lm-radius-set button,[^{]*select,[^{]*textarea \{ border-radius: var\(--lm-radius-s\) !important/.test(sct));
check('site mode: the corner choice sets lm-radius-set', sp.classes.has('lm-radius-set'));
const U = sp.api.url;
const dec = u => JSON.parse(Buffer.from(u.split('lm=')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
check('links to Legend pages keep the theme', U('/faq.html').startsWith('https://www.legendmod.ml/faq.html#lm=') && dec(U('/faq.html')).mc === '#ff0000' && dec(U('/faq.html')).hm === '#00ff00');
check('a hash tab stays first and an old theme is replaced', /#Changelog&lm=/.test(U('https://www.legendmod.ml/#Changelog&lm=AAAA')) && U('https://www.legendmod.ml/#Changelog&lm=AAAA').split('lm=').length === 2);
check('other sites, files and the game page get no theme', U('https://github.com/x') === 'https://github.com/x' && U('/lib/a.js') === '/lib/a.js' && U('https://www.legendmod.ml/play.html') === 'https://www.legendmod.ml/play.html');
check('http and other ports get no theme', U('http://www.legendmod.ml/faq.html') === 'http://www.legendmod.ml/faq.html' && U('https://www.legendmod.ml:8443/faq.html') === 'https://www.legendmod.ml:8443/faq.html' && U('https://legendmod.ml.evil.com/') === 'https://legendmod.ml.evil.com/');
check('no theme: links are left alone', page().api.url('/faq.html') === '/faq.html');
const a = { href: '', getAttribute: () => '/features.html' };
sp.docListeners.click({ target: { closest: () => a } });
check('clicking a link adds the theme', /features.html#lm=/.test(a.href));

/* ---- sender: the Theme Bridge block of LMexpress.js ---- */
const lm = fs.readFileSync(path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8');
const from = lm.indexOf('/* -- Legend Mod Theme Bridge (mod-side helpers)'), to = lm.indexOf('/* After any lm-promo modal is built');
check('sender: the bridge block is found', from > 0 && to > from);
const block = lm.slice(from, to);
function sender(ds, opt) {
    opt = opt || {};
    const wl = {}, timers = [];
    const sctx = {
        location: { href: opt.href || 'https://agar.io/', origin: opt.origin || 'https://agar.io', protocol: 'https:' }, URL, JSON,
        btoa: s => Buffer.from(s, 'latin1').toString('base64'), localStorage: { getItem: () => '2' },
        defaultSettings: ds, $: () => ({ val: () => '' }),
        getComputedStyle: () => ({ getPropertyValue: k => (opt.radius && k === '--lm-radius' ? '10px' : opt.radius && k === '--lm-radius-s' ? '6px' : '') }),
        document: { addEventListener: () => { }, documentElement: {} },
        setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout: id => { if (id) timers[id - 1] = null; }
    };
    sctx.window = sctx;
    sctx.addEventListener = (t, fn) => { wl[t] = fn; };
    vm.createContext(sctx);
    vm.runInContext(block, sctx);
    sctx._msg = wl.message;
    sctx._flush = () => { const t = timers.splice(0); t.forEach(fn => fn && fn()); };
    return sctx;
}
const DS = { menuPanelColor: '#112233', menuPanelColor2: '#223344', menuMainColor: '#ff0000', menuTextColor: '#000000', menuTextColor2: '#555555',
    menuBg: 'https://example.com/\u03b5\u03b9\u03ba\u03cc\u03bd\u03b1.png', menuOpacity: 0.9, menuBtnTextColor: '#fefefe',
    btn1Color: '#010101', btn2Color: '#020202', btn3Color: '#030303', btn4Color: '#040404', btn1Color2: '#111111', btn2Color2: '#121212', btn3Color2: '#131313', btn4Color2: '#141414',
    hudMainColor: '#00ff00', hudColor: 'rgba(36,36,36,0.49)', hudTextColor: '#eeeeee', hudFontFamily: 'Ubuntu', hudFontWeight: 700, hudScale: 1.1 };
const S = sender(DS, { radius: true });
const sdec = u => JSON.parse(Buffer.from(u.split('lm=')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
check('sender: exact HTTPS Legend links get the theme', /^https:\/\/www\.legendmod\.ml\/faq\.html#lm=[A-Za-z0-9_-]+$/.test(S.lmThemeUrl('https://www.legendmod.ml/faq.html')) &&
    /#lm=/.test(S.lmThemeUrl('https://legendmod.ml/')) && /#lm=/.test(S.lmThemeUrl('https://jimboy3100.github.io/themes/')));
check('sender: http Legend links are never decorated', S.lmThemeUrl('http://www.legendmod.ml/faq.html') === 'http://www.legendmod.ml/faq.html' && S.lmThemeUrl('http://jimboy3100.github.io/') === 'http://jimboy3100.github.io/');
check('sender: other ports, look-alike hosts, files and the game page are not decorated', S.lmThemeUrl('https://www.legendmod.ml:8443/x') === 'https://www.legendmod.ml:8443/x' &&
    S.lmThemeUrl('https://legendmod.ml.evil.com/') === 'https://legendmod.ml.evil.com/' && S.lmThemeUrl('https://www.legendmod.ml/lib/a.js') === 'https://www.legendmod.ml/lib/a.js' &&
    S.lmThemeUrl('https://www.legendmod.ml/play.html') === 'https://www.legendmod.ml/play.html' && S.lmThemeUrl('/faq.html') === '/faq.html');
const withAnchor = S.lmThemeUrl('https://www.legendmod.ml/faq.html#controls');
check('sender: the anchor stays first (#controls&lm=...)', /^https:\/\/www\.legendmod\.ml\/faq\.html#controls&lm=[A-Za-z0-9_-]+$/.test(withAnchor) && S.lmThemeUrl(withAnchor).split('lm=').length === 2);
const rt = page({ hash: withAnchor.slice(withAnchor.indexOf('#')) });
check('sender -> page: the page gets the theme and #controls back', rt.api.isThemed() && rt.loc.hash === '#controls' && rt.props['--lm-mc'] === '#ff0000');
const sd = sdec(withAnchor);
check('sender: UTF-8 base64url, a Greek background URL survives (encoded)', sd.bg === 'https://example.com/%CE%B5%CE%B9%CE%BA%CF%8C%CE%BD%CE%B1.png' && rt.props['--lm-menu-bg'] === 'url("' + sd.bg + '")');
check('sender: the HUD palette, font and corners are in the theme', sd.hm === '#00ff00' && sd.hb === 'rgba(36,36,36,0.49)' && sd.ht === '#eeeeee' && sd.hf === 'Ubuntu' && sd.hw === '700' && sd.hs === '1.1' && sd.rad === '10' && sd.rs === '6' && sd.lang === '2');
check('sender -> page: HUD variables on the page', rt.props['--lm-hud-mc'] === '#00ff00' && rt.props['--lm-hud-font'] === 'Ubuntu' && rt.props['--lm-hud-fw'] === '700' && rt.props['--lm-radius-s'] === '6px');
const tok = sdec(sender(Object.assign({}, DS, { menuBg: 'https://cdn.example.com/bg.png?token=SECRET123&w=800#x' })).lmThemeUrl('https://www.legendmod.ml/'));
check('sender: a query token in the background is not exported', tok.bg === 'https://cdn.example.com/bg.png?w=800' && JSON.stringify(tok).indexOf('SECRET123') < 0);
check('sender: a background with a login or over http is left out', sdec(sender(Object.assign({}, DS, { menuBg: 'https://me:pw@x.com/a.png' })).lmThemeUrl('https://www.legendmod.ml/')).bg === '' &&
    sdec(sender(Object.assign({}, DS, { menuBg: 'http://x.com/a.png' })).lmThemeUrl('https://www.legendmod.ml/')).bg === '');
const longBg = sender(Object.assign({}, DS, { menuBg: 'https://x.com/' + 'a'.repeat(1000) + '.png' })).lmThemeUrl('https://www.legendmod.ml/');
check('sender: the value stays bounded', longBg.split('lm=')[1].length <= 4000);
check('sender: a bad colour from imported settings is replaced before it is sent', sdec(sender(Object.assign({}, DS, { menuMainColor: 'red;}x{' })).lmThemeUrl('https://www.legendmod.ml/')).mc === '#01d9cc');
const O = S.lmThemeOrigins;
check('sender: a Legend page gets all Legend origins (github.io redirects)', O('https://jimboy3100.github.io/extras/helper.html').join() === 'https://www.legendmod.ml,https://legendmod.ml,https://jimboy3100.github.io' && O('https://www.legendmod.ml/x').length === 3 && O('https://legendmod.ml/x').length === 3);
check('sender: a third-party frame gets nothing', O('https://www.youtube.com/embed/x').length === 0 && O('https://legendmod.ml.evil.com/').length === 0 && O('').length === 1 && O('javascript:1').length === 0 && O('http://www.legendmod.ml/').length === 0);
check('sender: never "*"', !/postMessage\([^)]*'\*'\)/.test(block));

/* ---- sender: ready handshake and live updates ---- */
const L = sender(DS);
const win = (closed) => { const w = { got: [], closed: !!closed }; w.postMessage = (m, o) => w.got.push({ m, o }); return w; };
const f1 = win();
L._msg({ data: { type: 'lm-theme-ready' }, origin: 'https://www.legendmod.ml', source: f1 });
check('live: a Legend page that says ready gets the theme at its exact origin', f1.got.length === 1 && f1.got[0].o === 'https://www.legendmod.ml' && f1.got[0].m.type === 'lm-theme' && f1.got[0].m.theme.mc === '#ff0000');
const ev1 = win();
L._msg({ data: { type: 'lm-theme-ready' }, origin: 'https://evil.example', source: ev1 });
L._msg({ data: { type: 'lm-theme-ready' }, origin: 'http://www.legendmod.ml', source: ev1 });
check('live: another site or http gets nothing', ev1.got.length === 0);
DS.menuMainColor = '#0000ff';
L.lmThemeChanged(); L.lmThemeChanged(); L.lmThemeChanged();
L._flush();
check('live: a theme change reaches the page once (debounced), with the new colour', f1.got.length === 2 && f1.got[1].m.theme.mc === '#0000ff' && f1.got[1].o === 'https://www.legendmod.ml');
f1.closed = true;
L.lmThemeChanged(); L._flush();
check('live: a closed page is dropped', f1.got.length === 2);
const many = Array.from({ length: 20 }, () => win());
many.forEach(w => L._msg({ data: { type: 'lm-theme-ready' }, origin: 'https://jimboy3100.github.io', source: w }));
L.lmThemeChanged(); L._flush();
check('live: at most 16 pages are kept', many.filter(w => w.got.length === 2).length === 16 && many.slice(0, 4).every(w => w.got.length === 1));
const rep = win();
for (let i = 0; i < 60; i++) L._msg({ data: { type: 'lm-theme-ready' }, origin: 'https://www.legendmod.ml', source: rep });
check('live: the answers to one window are bounded', rep.got.length === 50);
const pg = page();
pg.send(f1.got[1].m, 'https://agar.io', pg.parent);
check('live: the page applies what the sender sends', pg.props['--lm-mc'] === '#0000ff' && pg.props['--lm-hud-mc'] === '#00ff00');
check('live: the theme setters notify (ogario addCustomCSS) and Rounded / Square HUD too',
    /window\.lmThemeChanged === 'function' && \/\^\(menu\\w\*CSS\|lmWinCSS\|hudCSS\|hudFontVarCSS\|hudScaleVarCSS\)\$\/\.test\(name\)\) window\.lmThemeChanged\(\)/.test(fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8')) &&
    /setProperty\('--lm-radius-s'[^\n]*\n[^\n]*\n\s*if \(typeof lmThemeChanged === 'function'\) lmThemeChanged\(\);/.test(lm));

console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
