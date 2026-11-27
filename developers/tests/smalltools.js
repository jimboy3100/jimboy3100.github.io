/* Small tools and accessibility: debug info redaction, the removed radial menu and screenshot
 * window (gone, their stored data removed at start, a key on their hotkeys freed) and the
 * accessibility helpers (pure parts of ogario/modules/smalltools.js
 * and ogario/modules/accessibility.js, loaded in a vm without a document).
 * node developers/tests/smalltools.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const dir = path.join(__dirname, '..', '..', 'ogario', 'modules');
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'smalltools.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'accessibility.js'), 'utf8'), ctx);
const C = ctx.LMSmallTools && ctx.LMSmallTools._core;
const A = ctx.LMAccessibility && ctx.LMAccessibility._core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C || !A) { console.log('FAIL core helpers not exported'); process.exit(1); }
const J = x => JSON.stringify(x);

/* ── the radial menu and the screenshot window are removed ── */
check('removed: no radial or screenshot options helpers', !('pickSector' in C) && !('cleanRadial' in C) && !('cleanShotOpts' in C));
{
    const store = new Map([['lmRadialMenu', '{"v":1,"items":["hk-split"]}'], ['lmSmallTools', '{"shot":{"lb":true}}'], ['other', 'x']]);
    const node = () => ({ style: {}, classList: { add() { }, remove() { } }, appendChild() { }, addEventListener() { } });
    const c2 = { console, localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
        document: { createElement: node, getElementById: () => null, head: node(), body: node() }, addEventListener() { }, removeEventListener() { } };
    c2.window = c2;
    vm.createContext(c2);
    i18n(c2);
    vm.runInContext(fs.readFileSync(path.join(dir, 'smalltools.js'), 'utf8'), c2);
    const T = c2.LMSmallTools;
    check('removed: their stored data goes at start, other keys stay', !store.has('lmRadialMenu') && !store.has('lmSmallTools') && store.get('other') === 'x');
    check('removed: no window or ring API left, Show/hide HUD and Capture stay', !T.open && !T.toggle && !T.radialDown && !T.radialClose && typeof T.shotToggle === 'function' && typeof T.capture === 'function');
}
{
    const v4 = fs.readFileSync(path.join(dir, '..', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
    const a = v4.indexOf('function lmRenameOldHotkeys(map) {'), b = v4.indexOf('\n}', a);
    const hk = { R: 'hk-radialMenu', T: 'hk-radialEditor', P: 'hk-screenshotCapture', O: 'hk-screenshotTool', 'ALT+H': 'hk-showHUD', W: 'hk-feed' };
    vm.runInNewContext(v4.slice(a, b + 2) + '\nlmRenameOldHotkeys(hk);', { hk });
    check('removed: a key on their hotkeys is free again, Alt+H stays', J(hk) === J({ 'ALT+H': 'hk-showHUD', W: 'hk-feed' }));
    const hc = fs.readFileSync(path.join(dir, '..', 'hotkeysCommand.js'), 'utf8');
    check('removed: their hotkeys are gone', !/'hk-(radialMenu|radialEditor|screenshotCapture|screenshotTool)'/.test(hc) && /'hk-showHUD'/.test(hc));
}

/* ── the hotkey conflict list is gone (the key check of the Hotkeys window stays) ── */
check('no conflict list', !('findConflicts' in C) && !!C.BROWSER_KEYS['CTRL+W']);

/* ── redaction ── */
const rep = [
    'GET wss://live-arena-12ab.agar.io:443/?token=abcdef123456&party=XYZ failed',
    'https://i.imgur.com/AbCdEf1.png could not load',
    'at https://www.legendmod.ml/ogario/ogario.v4.js:120:5',
    'login {"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}',
    'password=hunter22 uid: 9988776655 user_id=42',
    'mail me at someone@example.com from 192.168.1.20:8080',
    'Bearer abc.def-ghi',
    'session 0123456789abcdef0123456789abcdef ended',
    'player MyNickName died, clan [TAG] ok',
    'TypeError: Cannot read properties of undefined (reading \'x\')'
].join('\n');
const red = C.redact(rep, ['MyNickName', '[TAG]', 'ab', '', null]);
check('redact: token in a query string', red.indexOf('abcdef123456') < 0);
check('redact: game server address', red.indexOf('live-arena') < 0);
check('redact: skin URL', red.indexOf('imgur') < 0 && red.indexOf('AbCdEf1') < 0);
check('redact: known script URL and line kept', red.indexOf('https://www.legendmod.ml/ogario/ogario.v4.js:120:5') >= 0);
check('redact: JWT', red.indexOf('eyJhbGci') < 0 && red.indexOf('SflKxw') < 0);
check('redact: password and ids', red.indexOf('hunter22') < 0 && red.indexOf('9988776655') < 0 && !/user_id=42/.test(red));
check('redact: e-mail and IP', red.indexOf('someone@example.com') < 0 && red.indexOf('192.168.1.20') < 0);
check('redact: bearer token', red.indexOf('abc.def-ghi') < 0);
check('redact: long hex id', red.indexOf('0123456789abcdef0123') < 0);
check('redact: nick and clan tag', red.indexOf('MyNickName') < 0 && red.indexOf('[TAG]') < 0);
check('redact: too-short secrets do not mangle text', red.indexOf('Cannot read properties') >= 0 && red.indexOf('player') >= 0);
check('redact: error text kept', red.indexOf("TypeError: Cannot read properties of undefined (reading 'x')") >= 0);
check('redact: nothing -> empty string', C.redact(null) === '' && C.redact(undefined, null) === '');
/* Settings > Copy debug info: server addresses kept, their paths and queries not */
const dbg = C.redact(['Server: wss://live-arena-12ab.agar.io:443/?token=abc123 (agario)', 'Server: wss://203.0.113.9:2001/el-room/SECRETROOM42 (expandingland)',
    'Page: www.legendmod.ml, browser: Mozilla/5.0 (Linux; Android 10) Chrome/120.0.0.0 Mobile', 'skin https://i.imgur.com/AbCdEf1.png failed', 'nick MyNickName'].join('\n'), ['MyNickName'], { keepHosts: true });
check('debug info: game server host and port kept', dbg.indexOf('wss://live-arena-12ab.agar.io:443') >= 0 && dbg.indexOf('wss://203.0.113.9:2001') >= 0);
check('debug info: room path and token gone', dbg.indexOf('SECRETROOM42') < 0 && dbg.indexOf('abc123') < 0);
check('debug info: browser version not taken for an IP', dbg.indexOf('Chrome/120.0.0.0') >= 0);
check('debug info: skin file and nick gone', dbg.indexOf('AbCdEf1') < 0 && dbg.indexOf('MyNickName') < 0);


/* ── accessibility ── */
check('a11y: text scale clamped', A.cleanScale(2) === 1.6 && A.cleanScale(0.5) === 1 && A.cleanScale('x') === 1 && A.cleanScale(1.234) === 1.23);
check('a11y: scale rule keeps the ratio to the parent', A.scaleRule('#x', 0.8, 1.25) === '#x{font-size:100% !important;}' && A.scaleRule('#x', 0, 2) === '');

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
