/* Theme bridge checks: lib/lm-theme-bridge.js runs against a stub page. Messages are accepted
 * only from the parent / opener window on a Legend origin, only colours and https images pass,
 * removing the background clears the image, getTheme() returns the last applied theme, opacity
 * and the corner radius reach the page. The sender side (lmThemeOrigins in LMexpress.js) sends
 * only to Legend pages.
 * node developers/tests/themebridge.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'lib', 'lm-theme-bridge.js'), 'utf8');
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

function page(opts) {
    opts = opts || {};
    const props = {}, listeners = {}, classes = new Set(), bodyClasses = new Set(), styles = [];
    const style = { setProperty: (k, v) => { props[k] = String(v); }, removeProperty: k => { delete props[k]; } };
    const de = { style, classList: { add: c => classes.add(c) }, appendChild: n => styles.push(n) };
    const document = {
        documentElement: de, head: { appendChild: n => styles.push(n) },
        body: { classList: { add: c => bodyClasses.add(c) } },
        getElementById: id => styles.find(s => s.id === id) || null,
        createElement: () => ({ id: '', textContent: '' }),
        addEventListener: () => {}
    };
    const parent = {}, opener = opts.opener || null;
    const window = {
        location: { hash: opts.hash || '', search: opts.search || '', origin: opts.origin || 'https://www.legendmod.ml' },
        addEventListener: (t, fn) => { listeners[t] = fn; },
        parent, opener
    };
    window.window = window;
    const ctx = { window, document, atob: s => Buffer.from(s, 'base64').toString('latin1'), JSON, console };
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return { ctx, props, listeners, classes, bodyClasses, styles, parent, opener, api: window.lmThemeBridge,
        send: (data, origin, source) => listeners.message({ data, origin, source }) };
}
const enc = o => Buffer.from(JSON.stringify(o), 'latin1').toString('base64');
const T = { pc: '#112233', pc2: '#223344', mc: '#ff0000', tc: '#000000', tc2: '#555555', btc: '#fefefe',
    b1: '#010101', b2: '#020202', b3: '#030303', b4: '#040404', b1b: '#111111', b2b: '#121212', b3b: '#131313', b4b: '#141414',
    op: '0.5', bg: 'https://i.imgur.com/abc.png', rad: '0' };

/* ---- direct visitors ---- */
let p = page();
check('no theme in the URL: nothing applied, no stylesheet', !p.api.isThemed() && p.api.getTheme() === null && !p.styles.length && !p.classes.size);

/* ---- hash ---- */
p = page({ hash: '#lm=' + enc(T) });
check('hash: the theme is applied', p.api.isThemed() && p.props['--lm-pc'] === '#112233' && p.props['--lm-mc'] === '#ff0000');
check('hash: button colours and hover colours use the mod names', p.props['--lm-btn1'] === '#010101' && p.props['--lm-btn4b'] === '#141414' && p.props['--lm-btn-tc'] === '#fefefe');
check('hash: opacity, background image and radius', p.props['--lm-op'] === '0.5' && p.props['--lm-menu-bg'] === 'url("https://i.imgur.com/abc.png")' && p.props['--lm-radius'] === '0px');
check('hash: getTheme() is the applied theme', p.api.getTheme().mc === '#ff0000' && p.api.getTheme().rad === '0');
check('hash: html and body are marked', p.classes.has('lm-themed-root') && p.bodyClasses.has('lm-themed'));
check('stylesheet: one, with the opacity and the hover colours', p.styles.length === 1 && /--lm-op/.test(p.styles[0].textContent) && /\.btn-primary:hover \{ background: var\(--lm-btn1b/.test(p.styles[0].textContent));
check('stylesheet: the older names stay as aliases', /--lm-b1: var\(--lm-btn1\)/.test(p.styles[0].textContent) && /--lm-bg-url: var\(--lm-menu-bg/.test(p.styles[0].textContent));
check('search ?lm= also works', page({ search: '?lm=' + enc(T) }).props['--lm-tc'] === '#000000');
check('a broken hash is ignored', !page({ hash: '#lm=%%%' }).api.isThemed());

/* ---- messages ---- */
p = page();
p.send({ type: 'lm-theme', theme: T }, 'https://evil.example', p.parent);
check('message from an unrelated origin is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'https://www.legendmod.ml', {});
check('message from a window that is not the parent or opener is refused', !p.api.isThemed());
p.send({ type: 'lm-theme', theme: T }, 'https://agar.io', p.parent);
check('message from the parent on agar.io is accepted', p.api.isThemed() && p.props['--lm-mc'] === '#ff0000');
check('getTheme() returns a theme received by message', p.api.getTheme() && p.api.getTheme().pc === '#112233');
p.send({ type: 'other', theme: Object.assign({}, T, { mc: '#00ff00' }) }, 'https://agar.io', p.parent);
check('a message of another type is ignored', p.props['--lm-mc'] === '#ff0000');
const op = page({ opener: {} });
op.send({ type: 'lm-theme', theme: T }, 'https://jimboy3100.github.io', op.opener);
check('message from the opener on a Legend origin is accepted', op.api.isThemed());

/* ---- removing the background ---- */
p.send({ type: 'lm-theme', theme: Object.assign({}, T, { bg: '' }) }, 'https://agar.io', p.parent);
check('removing the background clears the image', p.props['--lm-menu-bg'] === 'none' && p.api.getTheme().bg === '');
p.send({ type: 'lm-theme', theme: Object.assign({}, T, { rad: '' }) }, 'https://agar.io', p.parent);
check('no corner choice removes the radius', !('--lm-radius' in p.props));

/* ---- validation ---- */
const C = p.api.clean;
const bad = C({ pc: 'red;}body{display:none', mc: 'url(https://x/y.png)', tc: 'expression(alert(1))', b1: '#12345', tc2: 'rgba(1,2,3,.5)',
    bg: 'javascript:alert(1)', op: '5', rad: '-3', pass: 'secret', token: 'x' });
check('CSS injection in a colour falls back to the default', bad.pc === '#00243e' && bad.mc === '#01d9cc' && bad.tc === '#ffffff' && bad.b1 === '#018cf6');
check('rgba colours pass', bad.tc2 === 'rgba(1,2,3,.5)');
check('only https images pass', bad.bg === '' && C({ bg: 'http://x.com/a.png' }).bg === '' && C({ bg: 'https://x.com/a.png") ; x' }).bg === '' && C({ bg: 'https://x.com/a.png' }).bg === 'https://x.com/a.png');
check('opacity out of range falls back, radius out of range is dropped', bad.op === '0.96' && bad.rad === '' && C({ op: 0.3 }).op === '0.3' && C({ rad: 10 }).rad === '10');
check('unknown keys (account data) are dropped', !('pass' in bad) && !('token' in bad));
check('a non-object is not a theme', C(null) === null && C('x') === null && p.api.apply(42) === false);

/* ---- sender: lmThemeOrigins from LMexpress.js ---- */
const lm = fs.readFileSync(path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8');
const i = lm.indexOf('function lmThemeOrigins(');
let d = 0, j = lm.indexOf('{', i), body = '';
for (let k = j; k < lm.length; k++) { if (lm[k] === '{') d++; else if (lm[k] === '}' && !--d) { body = lm.slice(i, k + 1); break; } }
const sctx = { location: { href: 'https://agar.io/', origin: 'https://agar.io' }, URL };
vm.createContext(sctx);
vm.runInContext(body, sctx);
const O = sctx.lmThemeOrigins;
check('sender: a Legend page gets both Legend origins (github.io redirects)', O('https://jimboy3100.github.io/extras/helper.html').join() === 'https://www.legendmod.ml,https://jimboy3100.github.io' && O('https://www.legendmod.ml/x').length === 2);
check('sender: a third-party frame gets nothing', O('https://www.youtube.com/embed/x').length === 0 && O('https://legendmod.ml.evil.com/').length === 0 && O('').length === 1 && O('javascript:1').length === 0);
check('sender: never "*"', !/postMessage\(msg, '\*'\)/.test(lm));

console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
