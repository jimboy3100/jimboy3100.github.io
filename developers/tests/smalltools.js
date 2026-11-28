/* Small tools and accessibility: the key check, debug info redaction, radial sector choice
 * and the accessibility helpers (pure parts of ogario/modules/smalltools.js
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

/* ── radial: sector choice ── */
check('radial: up is sector 0 of 8', C.pickSector(0, -100, 8, 20) === 0);
check('radial: right is sector 2 of 8', C.pickSector(100, 0, 8, 20) === 2);
check('radial: down is sector 4 of 8', C.pickSector(0, 100, 8, 20) === 4);
check('radial: left is sector 6 of 8', C.pickSector(-100, 0, 8, 20) === 6);
check('radial: up-right diagonal is sector 1 of 8', C.pickSector(70, -70, 8, 20) === 1);
check('radial: just left of up still sector 0 (wraps)', C.pickSector(-10, -100, 8, 20) === 0);
check('radial: boundary between 0 and 1 (22.5 deg) goes to 1', C.pickSector(Math.sin(Math.PI / 8 + 0.001) * 100, -Math.cos(Math.PI / 8 + 0.001) * 100, 8, 0) === 1);
check('radial: inside the dead zone = none', C.pickSector(5, -5, 8, 20) === -1);
check('radial: no sectors = none', C.pickSector(0, -100, 0, 0) === -1);
check('radial: one sector takes every direction', C.pickSector(-100, 30, 1, 10) === 0);
check('radial: 3 sectors: up 0, lower right 1, lower left 2', C.pickSector(0, -50, 3, 0) === 0 && C.pickSector(50, 40, 3, 0) === 1 && C.pickSector(-50, 40, 3, 0) === 2);
check('radial: bad numbers = centre', C.pickSector('x', null, 8, 10) === -1);
check('radial: sector angle of slot 2/8 is 90 deg', Math.abs(C.sectorAngle(2, 8) - Math.PI / 2) < 1e-9);
for (let n = 1; n <= 8; n++) {
    let ok = true;
    for (let i = 0; i < n; i++) { const a = C.sectorAngle(i, n); if (C.pickSector(Math.sin(a) * 80, -Math.cos(a) * 80, n, 10) !== i) ok = false; }
    check('radial: each centre angle picks its own sector (' + n + ' items)', ok);
}

/* ── radial: stored list ── */
const exists = id => id !== 'hk-gone';
check('radial store: object form, order kept', J(C.cleanRadial({ v: 1, items: ['hk-split', 'hk-feed'] }, exists)) === J(['hk-split', 'hk-feed']));
check('radial store: plain array accepted', J(C.cleanRadial(['hk-split'], exists)) === J(['hk-split']));
check('radial store: duplicates, junk, the ring itself and removed commands dropped',
    J(C.cleanRadial({ items: ['hk-split', 'hk-split', 5, null, '<b>', 'hk-radialMenu', 'hk-gone', 'split', 'hk-' + 'x'.repeat(60), 'hk-feed'] }, exists)) === J(['hk-split', 'hk-feed']));
check('radial store: at most 8', C.cleanRadial({ items: Array.from({ length: 12 }, (_, i) => 'hk-c' + i) }).length === 8);
check('radial store: garbage gives an empty ring', J(C.cleanRadial('x')) === '[]' && J(C.cleanRadial(null)) === '[]' && J(C.cleanRadial({ items: 'hk-split' })) === '[]');

/* ── the custom macros are removed; the radial menu and the screenshot window are back ── */
{
    const store = new Map([['lmRadialMenu', '{"v":1,"items":["hk-split"]}'], ['lmSmallTools', '{"shot":{"lb":true}}'], ['other', 'x']]);
    const node = () => ({ style: {}, classList: { add() { }, remove() { } }, appendChild() { }, addEventListener() { } });
    const c2 = { console, localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
        document: { createElement: node, getElementById: () => null, querySelector: sel => (sel.indexOf('og-settings') >= 0 ? { click() { c2._tab = (c2._tab || 0) + 1; } } : null), head: node(), body: node() },
        addEventListener() { }, removeEventListener() { }, setTimeout: () => 0, application: { showMenu() { c2._menu = (c2._menu || 0) + 1; } } };
    c2.window = c2;
    vm.createContext(c2);
    i18n(c2);
    vm.runInContext(fs.readFileSync(path.join(dir, 'smalltools.js'), 'utf8'), c2);
    const T = c2.LMSmallTools;
    check('their stored data (radial commands, screenshot options) is kept at start', store.get('lmRadialMenu') === '{"v":1,"items":["hk-split"]}' && store.get('lmSmallTools') === '{"shot":{"lb":true}}' && store.get('other') === 'x');
    let jumped = false;
    try { jumped = T.jump('showMass'); } catch (e) { jumped = 'threw ' + e.message; }
    check('jump (Settings search hints): opens the menu at the Settings tab, no error', jumped === true && c2._menu === 1 && c2._tab === 1);
    check('the windows and the ring API are back, Show/hide HUD and Capture stay', typeof T.open === 'function' && typeof T.toggle === 'function' && typeof T.radialDown === 'function' && typeof T.radialUp === 'function' && typeof T.shotToggle === 'function' && typeof T.capture === 'function');
    /* the key check of the Hotkeys window (setHotkey): browser and Legend Mod keys */
    const kw = T.keyCheck('CTRL+W'), kf = T.keyCheck('F11'), ke = T.keyCheck('ESC');
    check('key check: Ctrl+W is kept by the browser (refused), reason from the language pack', !!kw && kw.level === 'block' && kw.what === i18n.t('modules.smalltools.bk.closeTab') && kw.what === 'closes the tab' && kw.msg.indexOf('CTRL+W') >= 0);
    check('key check: F11 may still reach the browser (warning)', !!kf && kf.level === 'warn');
    check('key check: Esc is the menu key (refused)', !!ke && ke.level === 'block' && ke.what === i18n.t('modules.smalltools.usedBy', i18n.t('modules.smalltools.menuEsc')));
    check('key check: plain keys and shortcuts the game takes are fine', T.keyCheck('Q') === null && T.keyCheck('F5') === null && T.keyCheck('CTRL+1') === null);
    c2.LMi18n.setLang('el', { save: false });
    const kg = T.keyCheck('CTRL+W');
    check('key check: the reason follows the language (Greek)', !!kg && kg.what === i18n.t('modules.smalltools.bk.closeTab', null, 'el') && kg.what !== 'closes the tab');
    c2.LMi18n.setLang('en', { save: false });
    /* the conflict list of the Hotkeys window is removed */
    check('removed: the conflict list (no conflicts, renderConflicts, refreshConflicts, findConflicts)', !('conflicts' in T) && !('renderConflicts' in T) && !('refreshConflicts' in T) && !('findConflicts' in T._core));
}
{
    const v4 = fs.readFileSync(path.join(dir, '..', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
    const a = v4.indexOf('function lmRenameOldHotkeys(map) {'), b = v4.indexOf('\n}', a);
    const hk = { R: 'hk-radialMenu', T: 'hk-radialEditor', P: 'hk-screenshotCapture', O: 'hk-screenshotTool', M: 'hk-customMacro1', N: 'hk-customMacro3', B: 'hk-notifCentre', 'ALT+H': 'hk-showHUD', W: 'hk-feed' };
    vm.runInNewContext(v4.slice(a, b + 2) + '\nlmRenameOldHotkeys(hk);', { hk });
    check('a key on the custom macros, the radial editor, the screenshot window and the notification centre is free again; the radial menu, Capture and Alt+H keys stay', J(hk) === J({ R: 'hk-radialMenu', P: 'hk-screenshotCapture', 'ALT+H': 'hk-showHUD', W: 'hk-feed' }));
    const hc = fs.readFileSync(path.join(dir, '..', 'hotkeysCommand.js'), 'utf8');
    check('the radial menu and Capture screenshot are hotkeys (no default keys); the radial editor, screenshot window, notification centre and custom macro ones are gone',
        ['hk-radialMenu', 'hk-screenshotCapture'].every(id => { const i = hc.indexOf("'" + id + "': {"); return i >= 0 && hc.slice(i, i + 200).indexOf("defaultKey: ''") >= 0; }) && !/'hk-(customMacro[1-3]|radialEditor|screenshotTool|notifCentre)'/.test(hc) && /'hk-showHUD'/.test(hc));
    /* the phone M1-M3 option's label (named by the settings profiles' phone list) is not shipped */
    const en = fs.readFileSync(path.join(dir, '..', '..', 'languages', 'lm-en.js'), 'utf8');
    check('removed: the phone custom macro buttons text is not shipped', en.indexOf('pkg.agm.') >= 0 && en.indexOf('pkg.agm.m_macroBtns') < 0);
}

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

check('screenshot options: only true counts', J(C.cleanShotOpts({ lb: true, map: 'yes' })) === J({ lb: true, map: false }) && J(C.cleanShotOpts(null)) === J({ lb: false, map: false }));

/* ── accessibility ── */
check('a11y: text scale clamped', A.cleanScale(2) === 1.6 && A.cleanScale(0.5) === 1 && A.cleanScale('x') === 1 && A.cleanScale(1.234) === 1.23);
check('a11y: scale rule keeps the ratio to the parent', A.scaleRule('#x', 0.8, 1.25) === '#x{font-size:100% !important;}' && A.scaleRule('#x', 0, 2) === '');

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
