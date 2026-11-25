/* Main menu layout: the real _lmMenuFitPlan from ogario/ogario.v4.js (run in a vm) for the window
 * sizes players use. The menu (header + tab bar + footer around the settings list) must be inside
 * the window with a margin, the settings list gets the room that is left (never under its few
 * rows unless the content is shorter), the scale is the player's hudScale whenever it fits and
 * never larger, and the menu is centred. The numbers are the menu's real sizes at 3.628
 * (920 px wide; settings tab: 210 px around the list, list 640/590/490 px; side column 544 px).
 * The old layout (scale fitted, then multiplied by hudScale; top 250 px minus 30% of the height)
 * is checked too, to show the sizes where it cut the top bar or the footer.
 * node developers/tests/menufit.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function block(from) {
    const a = src.indexOf(from);
    if (a < 0) throw new Error('not found in ogario.v4.js: ' + from);
    let i = src.indexOf('{', a), depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i];
        if (ch === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
        if (ch === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue; }
        if (ch === "'" || ch === '"') { const q = ch; for (i++; src[i] !== q; i++) if (src[i] === '\\') i++; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return src.slice(a, i + 1);
    }
    throw new Error('unclosed block: ' + from);
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(block('function _lmMenuFitPlan(o)') + '\nthis.plan = _lmMenuFitPlan;', ctx);
const plan = ctx.plan;
check('plan function extracted', typeof plan === 'function');

/* old layout (3.628 ogarhusettings), for the before numbers */
function oldTopBottom(vw, vh, H, W, k) {
    let s = Math.min(1, vh / H, Math.max(0.2, (vw - 16) / W)) * k;
    let d = vh <= 992 ? 250 : vh <= 1080 ? 300 : vh < 1440 ? 420 : 520;
    if (k > 1) d = d / k;
    const top = d - 0.3 * H; /* translate(-50%,-30%) scale(s), origin centre top */
    return { top, bottom: top + s * H };
}
const cssMax = vh => vh <= 650 ? 490 : vh <= 820 ? 590 : 640;
const sizes = [[1366, 768], [1666, 820], [1666, 821], [1366, 650], [1366, 651], [1920, 1080], [1280, 720], [915, 412], [412, 915], [2560, 1440]];
let oldBad = 0;
for (const [vw, vh] of sizes) {
    for (const k of [0.5, 0.9, 1, 1.25, 1.5]) {
        for (const fixedH of [210, 260, 330]) { /* header/footer: English, long translation, text scale 1.6 */
            const o = { vw, vh, margin: 8, minRegion: 160, menuW: 920, desired: k, hasRegion: true, othersH: 544, designMax: cssMax(vh), regionContent: 12000, fixedH };
            const p = plan(o);
            const listH = Math.min(o.regionContent, p.region), h = Math.max(fixedH + listH, o.othersH);
            const top = p.top, bottom = top + p.scale * h, half = p.scale * o.menuW / 2;
            const tag = vw + 'x' + vh + ' hud ' + k + ' fixed ' + fixedH;
            const inside = top >= 8 - 0.5 && bottom <= vh - 8 + 0.5 && p.left - half >= 8 - 0.5 && p.left + half <= vw - 8 + 0.5;
            if (!inside) check(tag + ': inside the window (' + top + '..' + bottom.toFixed(1) + ')', false);
            if (p.scale > k + 1e-9) check(tag + ': scale ' + p.scale + ' not above hudScale', false);
            if (p.region < Math.min(160, o.designMax)) check(tag + ': list keeps its rows (' + p.region + ')', false);
            if (p.region > o.designMax) check(tag + ': list not above the stylesheet height', false);
            /* the player's scale stays whenever it fits with the shortest list */
            const fitsAtK = k * Math.max(fixedH + 160, 544) <= vh - 16 && k * 920 <= vw - 16;
            if (fitsAtK && Math.abs(p.scale - k) > 1e-3) check(tag + ': keeps hudScale ' + k + ' (got ' + p.scale + ')', false);
            /* centred vertically while it fits */
            if (Math.abs((top - 8) - (vh - 16 - p.scale * h) / 2) > 1) check(tag + ': centred', false);
            const ob = oldTopBottom(vw, vh, fixedH + cssMax(vh), 920, k);
            if (ob.top < 0 || ob.bottom > vh) oldBad++;
        }
    }
}
check('every size, hudScale and header height: menu inside, list kept, hudScale kept when it fits, centred', fail === 0);
console.log('     (old layout: ' + oldBad + ' of ' + sizes.length * 15 + ' cases cut the top bar or the footer)');
check('the old layout really failed some of them (the test can tell)', oldBad > 0);

/* the owner's window: 1666x896 screen, about 821 px for the page, hudScale 1 */
const owner = plan({ vw: 1666, vh: 821, margin: 8, minRegion: 160, menuW: 920, desired: 1, hasRegion: true, othersH: 544, designMax: 640, regionContent: 12000, fixedH: 210 });
check('1666x821: full size (scale 1), list ' + owner.region + ' px, top ' + owner.top, owner.scale === 1 && owner.top >= 8 && owner.top + 210 + owner.region <= 821 - 8);
const old = oldTopBottom(1666, 821, 850, 920, 1);
check('1666x821: the old layout put the top bar above the window (' + old.top + ')', old.top < 0);

/* short content: the list is only as tall as its rows; no list: the tallest column decides */
const short = plan({ vw: 1366, vh: 768, margin: 8, minRegion: 160, menuW: 920, desired: 1, hasRegion: true, othersH: 544, designMax: 590, regionContent: 90, fixedH: 210 });
check('short list: scale 1, nothing shrunk below its content', short.scale === 1 && short.region >= 90);
const none = plan({ vw: 915, vh: 412, margin: 8, minRegion: 160, menuW: 920, desired: 1, hasRegion: false, othersH: 0, fixedH: 690 });
check('phone, tab without a list: whole tab inside (' + none.scale + ')', none.top >= 8 && none.top + none.scale * 690 <= 404.5 && 920 * none.scale <= 899.5);
const narrow = plan({ vw: 412, vh: 915, margin: 8, minRegion: 160, menuW: 920, desired: 1, hasRegion: true, othersH: 544, designMax: 640, regionContent: 12000, fixedH: 210 });
check('phone portrait: width decides, list at its full stylesheet height', Math.abs(narrow.scale - 396 / 920) < 1e-3 && narrow.region === 640);
const bad = plan({ vw: 1366, vh: 768, margin: 8, minRegion: 160, menuW: 920, desired: NaN, hasRegion: false, othersH: 0, fixedH: 605 });
check('a broken hudScale counts as 1', bad.scale === 1);

console.log(fail ? 'FAILED ' + fail : 'all menu layout checks passed');
process.exit(fail ? 1 : 0);
