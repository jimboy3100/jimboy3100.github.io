/* Phones: the button rows above the minimap (shortcuts, images, commands, scripts, administration:
 * the .hud children LMexpress.js puts into #minimap-hud above its top edge), with the real code of
 * LMmobile/LMmobile.js in a vm (the minimap tap and repositionButtons):
 * a tap on such a row is the button's only (the minimap is not enlarged or shrunk), a tap on the
 * minimap itself still toggles it; 4x / 16x are placed above the shown rows (they lay over them),
 * hidden rows and a minimap without rows keep the old place.
 * node developers/tests/minimaprows.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const mob = fs.readFileSync(path.join(root, 'LMmobile', 'LMmobile.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
const cutIn = (a, b) => { const i = mob.indexOf(a), j = mob.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in LMmobile.js: ' + a); return mob.slice(i, j); };

const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
function el(id, cls, r) {
    const props = {};
    return {
        id, children: [], parentNode: null, _r: r || rect(0, 0, 0, 0), _ls: {}, dataset: {},
        classList: { contains: (c) => (cls || []).indexOf(c) >= 0 },
        style: { setProperty(k, v) { props[k] = v; }, getPropertyValue: (k) => props[k] || '', removeProperty(k) { delete props[k]; }, _p: props },
        getBoundingClientRect() { return this._r; },
        addEventListener(t, f) { this._ls[t] = f; },
        /* only the one selector the code asks for: a .hud child of #minimap-hud */
        closest(sel) {
            if (sel !== '#minimap-hud > .hud') return null;
            for (let x = this; x; x = x.parentNode) if (x.parentNode && x.parentNode.id === 'minimap-hud' && x.classList.contains('hud')) return x;
            return null;
        }
    };
}
/* a phone 800 x 400, the minimap 150 x 150 at the bottom right (scaled 0.5: the rows are 15 px tall) */
const VW = 800, VH = 400;
const mm = el('minimap-hud', [], rect(640, 240, 150, 150));
const canvas = el('minimap', []); canvas.parentNode = mm;
const shortcuts = el('shortcuts-hud', ['hud'], rect(685, 225, 105, 15)); shortcuts.parentNode = mm;
const images = el('images-hud', ['hud'], rect(0, 0, 0, 0)); images.parentNode = mm; /* hidden */
const btn = el('', []); btn.parentNode = shortcuts;
mm.children.push(canvas, shortcuts, images);
const byId = { 'minimap-hud': mm };
const timers = [];
const ctx = {
    console, Math, Object, Number, String, parseFloat, innerWidth: VW, innerHeight: VH,
    document: { getElementById: (id) => byId[id] || null },
    setTimeout(f) { timers.push(f); return timers.length; }, clearTimeout() { },
    rootR: el('lm-mc-r', [], rect(520, 300, 110, 96)), smallR: el('lm-mc-sm', [], rect(0, 0, 0, 0)), drawer: el('lm-mc-d', [], rect(4, 350, 300, 40)),
    prefs: { btnScale: 1 }, hudTaps() { }, layoutRefresh() { }, fitLeaderboard() { }
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cutIn('        function repositionButtons() {', '        /* The leaderboard (top right)'), ctx);
vm.runInContext(cutIn("        (function () {\n            var mm = document.getElementById('minimap-hud');", '        /* HUD auto-fade removed'), ctx);
const tap = (target) => { mm._ls.touchstart({ target, stopPropagation() { } }); };
const scaleNow = () => mm.style._p.transform || '';

// ── taps
tap(btn);
check('a tap on a button of the shortcut row does not enlarge the minimap', scaleNow() === '', scaleNow());
check('... and places 4x / 16x again (the button may show another row)', timers.length === 1);
tap(shortcuts);
check('a tap on the row itself (between its buttons) neither', scaleNow() === '');
tap(canvas);
check('a tap on the minimap enlarges it', scaleNow() === 'scale(1)', scaleNow());
tap(btn);
check('a row tap on the enlarged minimap keeps it enlarged', scaleNow() === 'scale(1)', scaleNow());
tap(canvas);
check('a second tap on the minimap shrinks it back', scaleNow() === 'scale(0.5)', scaleNow());

// ── 4x / 16x above the shown rows
ctx.repositionButtons();
const bottom = () => ctx.smallR.style.bottom;
check('4x / 16x above the shown shortcut row (it lay over it): bottom ' + bottom(), bottom() === (VH - 225 + 6) + 'px', bottom());
images._r = rect(685, 210, 105, 15);
ctx.repositionButtons();
check('a second row shown (images): above both, bottom ' + bottom(), bottom() === (VH - 210 + 6) + 'px', bottom());
shortcuts._r = images._r = rect(0, 0, 0, 0);
ctx.repositionButtons();
check('no row shown: right above the minimap as before, bottom ' + bottom(), bottom() === (VH - 240 + 6) + 'px', bottom());
check('Split / Feed stay left of the minimap', ctx.rootR.style.right === (VW - 640 + 8) + 'px' && ctx.rootR.style.bottom === '4px');

console.log(fail ? fail + ' FAILED' : 'all minimap row checks passed');
process.exit(fail ? 1 : 0);
