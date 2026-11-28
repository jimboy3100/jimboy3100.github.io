/* One HUD hide: Show/hide HUD (Alt+H) hides the whole HUD with the capture chip of the former
 * Screenshot mode; the real ogario/hotkeysCommand.js, application.setShowHUD and loadHotkeys of
 * ogario.v4.js in a vm.
 *   - Screenshot mode is not listed any more; a stored reference to it (mouse, gamepad, radial,
 *     Command Centre star) runs Show/hide HUD
 *   - Show/hide HUD toggles the full hide of ogario/modules/smalltools.js; without it the HUD box
 *   - a keyboard key on Screenshot mode moves to Show/hide HUD when that has no key
 * node developers/tests/hudhide.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const hkSrc = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
const ogSrc = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const J = v => JSON.stringify(v);

/* application.setShowHUD, extracted */
const sStart = ogSrc.indexOf('        setShowHUD() {');
const sEnd = ogSrc.indexOf('        setShowGrid() {', sStart);
check('setShowHUD found', sStart > 0 && sEnd > sStart);

function load(withTools) {
    const calls = [];
    const ctx = { console, Object, String, Array, JSON, Math, lmT: k => k, textLanguage: {}, chatCommand: {}, toastr: { info() { } } };
    ctx.window = ctx;
    ctx.$ = sel => ({ toggle() { calls.push(['toggle', sel]); }, trigger() { }, val() { return ''; } });
    if (withTools) ctx.LMSmallTools = { shotToggle() { calls.push(['hide all']); }, toggle(n) { calls.push(['window', n]); }, capture() { calls.push(['capture']); } };
    vm.createContext(ctx);
    ctx.application = vm.runInContext('({\n' + ogSrc.slice(sStart, sEnd) + '\n})', ctx);
    vm.runInContext(hkSrc, ctx);
    return { hc: ctx.hotkeysCommand, calls };
}

{
    const { hc, calls } = load(true);
    check('Screenshot mode is not listed any more', Object.keys(hc).indexOf('hk-screenshotMode') < 0);
    check('Show/hide HUD keeps Alt+H; Capture stays, the Screenshot window hotkey is gone', hc['hk-showHUD'].defaultKey === 'ALT+H' && !!hc['hk-screenshotCapture'] && !hc['hk-screenshotTool']);
    hc['hk-showHUD'].keyDown();
    check('Alt+H hides the whole HUD (the former Screenshot mode, with its Capture chip)', J(calls) === J([['hide all']]));
    calls.length = 0;
    check('a stored Screenshot mode reference (mouse / gamepad / radial) runs Show/hide HUD', hc.hasOwnProperty('hk-screenshotMode') && (hc['hk-screenshotMode'].keyDown(), J(calls) === J([['hide all']])));
}
{
    const { hc, calls } = load(false);
    hc['hk-showHUD'].keyDown();
    check('without the small tools module: the HUD box as before', J(calls) === J([['toggle', '#overlays-hud']]));
}

/* loadHotkeys, extracted */
{
    const start = ogSrc.indexOf('        loadHotkeys() {');
    let i = ogSrc.indexOf('{', start), d = 0;
    for (; i < ogSrc.length; i++) { const c = ogSrc[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) break; } }
    const body = ogSrc.slice(start, i + 1);
    /* the rule for commands merged into others (lmRenameOldHotkeys), which loadHotkeys calls */
    const rs = ogSrc.indexOf('function lmRenameOldHotkeys(map) {'), re = ogSrc.indexOf('\n}', rs);
    const renameSrc = ogSrc.slice(rs, re + 2);
    function run(stored) {
        const ctx = { JSON, Object, String, hotkeys: null, chatCommand: {}, readLocalStorageJSON: k => (k === 'ogarioHotkeys' ? JSON.parse(JSON.stringify(stored)) : null) };
        vm.createContext(ctx);
        vm.runInContext(renameSrc, ctx);
        vm.runInContext('var setup = {' + body + ', migrateBrowserSpecificHotkeys() {}, migrateMouseControls() {}, addMissingDefaultHotkeys() {}, syncMessageKey() {}, loadDefaultHotkeys() {} }; setup.loadHotkeys(); var out = hotkeys;', ctx);
        return ctx.out;
    }
    let h = run({ 'F9': 'hk-screenshotMode', 'Q': 'hk-feed' });
    check('a key on Screenshot mode goes to Show/hide HUD when that has no key', h.F9 === 'hk-showHUD' && h.Q === 'hk-feed');
    h = run({ 'F9': 'hk-screenshotMode', 'ALT+H': 'hk-showHUD' });
    check('Show/hide HUD keeps Alt+H; the Screenshot mode key is free again', h['ALT+H'] === 'hk-showHUD' && !('F9' in h));
    h = run({ 'ALT+H': 'hk-showHUD', 'W': 'hk-split' });
    check('nothing changes without Screenshot mode', J(h) === J({ 'ALT+H': 'hk-showHUD', 'W': 'hk-split' }));
}

console.log(fail ? fail + ' failed' : 'all HUD hide checks passed');
process.exit(fail ? 1 : 0);
