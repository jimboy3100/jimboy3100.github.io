/* Zoom level hotkeys with saved zooms (the former "zoom bookmarks" are the zoom levels now):
 * the real ogario/hotkeysCommand.js and the real loadHotkeys of ogario.v4.js in a vm.
 *   - Zoom level 1-5 (Alt+1-5) go to the zoom saved for that level, else to their fixed zoom
 *   - Save the current zoom as zoom level 1-5 exist, without default keys
 *   - "Go to zoom bookmark 1-3" are not listed any more, but a stored reference still runs the level
 *   - a keyboard key bound to them moves to the zoom level when that level has no key
 * node developers/tests/zoomlevels.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const hkSrc = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
const ogSrc = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* hotkeysCommand.js runs as a classic script with globals */
function loadCommands(helpers) {
    const calls = [];
    const ctx = {
        console, Object, String, Array, JSON, Math,
        lmT: k => k, textLanguage: {}, chatCommand: {},
        application: { setZoom: v => calls.push(['setZoom', v]) },
        toastr: { info() { } }, $: () => ({ trigger() { }, val() { return ''; } })
    };
    ctx.window = ctx;
    if (helpers) ctx.LMHudHelpers = { zoomRecall: (n, z) => calls.push(['recall', n, z]), zoomSave: n => calls.push(['save', n]) };
    vm.createContext(ctx);
    vm.runInContext(hkSrc, ctx);
    return { hc: ctx.hotkeysCommand, calls };
}

{
    const { hc, calls } = loadCommands(true);
    const ids = Object.keys(hc);
    check('the former "Go to zoom bookmark" hotkeys are not listed', !ids.some(id => /^hk-zoomRecall/.test(id)));
    check('Save the current zoom as zoom level 1-5, no default keys', [1, 2, 3, 4, 5].every(n => hc['hk-zoomSave' + n] && hc['hk-zoomSave' + n].defaultKey === ''));
    check('zoom levels keep Alt+1-5', [1, 2, 3, 4, 5].every(n => hc['hk-zoom' + n].defaultKey === 'ALT+' + n));
    const fixed = [0.5, 0.25, 0.125, 0.075, 0.05];
    [1, 2, 3, 4, 5].forEach(n => hc['hk-zoom' + n].keyDown());
    check('zoom level n goes to its saved zoom, else its fixed one', JSON.stringify(calls) === JSON.stringify(fixed.map((z, i) => ['recall', i + 1, z])));
    calls.length = 0;
    hc['hk-zoomSave5'].keyDown();
    check('save zoom level 5', JSON.stringify(calls) === JSON.stringify([['save', 5]]));
    calls.length = 0;
    hc['hk-zoomRecall2'].keyDown();
    check('a stored "Go to zoom bookmark 2" (mouse / gamepad / radial) runs zoom level 2', JSON.stringify(calls) === JSON.stringify([['recall', 2, 0.25]]) && hc.hasOwnProperty('hk-zoomRecall2'));
}
{
    const { hc, calls } = loadCommands(false);
    hc['hk-zoom3'].keyDown();
    check('without the HUD helpers module: the fixed zoom as before', JSON.stringify(calls) === JSON.stringify([['setZoom', 0.125]]));
}

/* loadHotkeys, extracted from ogario.v4.js */
{
    const start = ogSrc.indexOf('        loadHotkeys() {');
    if (start < 0) { check('loadHotkeys found', false); process.exit(1); }
    let i = ogSrc.indexOf('{', start), d = 0;
    for (; i < ogSrc.length; i++) { const c = ogSrc[i]; if (c === '{') d++; else if (c === '}') { d--; if (!d) break; } }
    const body = ogSrc.slice(start, i + 1);
    function run(stored) {
        const ctx = { JSON, Object, String, hotkeys: null, chatCommand: {}, readLocalStorageJSON: k => (k === 'ogarioHotkeys' ? JSON.parse(JSON.stringify(stored)) : null) };
        vm.createContext(ctx);
        vm.runInContext('var setup = {' + body + ', migrateBrowserSpecificHotkeys() {}, addMissingDefaultHotkeys() {}, syncMessageKey() {}, loadDefaultHotkeys() {} }; setup.loadHotkeys(); var out = hotkeys;', ctx);
        return ctx.out;
    }
    let h = run({ 'X': 'hk-zoomRecall1', 'ALT+2': 'hk-zoom2', 'Y': 'hk-zoomRecall2', 'Q': 'hk-feed' });
    check('a key on "Go to zoom bookmark 1" goes to zoom level 1 (no key of its own)', h.X === 'hk-zoom1');
    check('zoom level 2 keeps its key; the bookmark key is free again', h['ALT+2'] === 'hk-zoom2' && !('Y' in h));
    check('other keys stay', h.Q === 'hk-feed');
    h = run({ 'ALT+1': 'hk-zoom1', 'W': 'hk-split' });
    check('nothing changes without the former hotkeys', JSON.stringify(h) === JSON.stringify({ 'ALT+1': 'hk-zoom1', 'W': 'hk-split' }));
}

console.log(fail ? fail + ' failed' : 'all zoom level checks passed');
process.exit(fail ? 1 : 0);
