/* Mobile control editor checks: the pure parts of LMmobile/LMmobile-editor.js (layout validation,
 * clamping, snapping, overlap detection, entry <-> rectangle).
 * node developers/tests/mobileeditor.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'LMmobile', 'LMmobile-editor.js'), 'utf8');
const ctx = { console, Math, Number, JSON, Array, String, Object, isFinite };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const first = ctx.LMMobileEditor;
vm.runInContext(src, ctx); /* loading twice must keep the first copy */
const E = ctx.LMMobileEditor, P = E._pure;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);

check('loaded twice keeps the first copy', E === first);
check('no host: the editor itself does not start', E.ready === false && typeof E.open === 'undefined');
check('key', E.KEY === 'lm-mobile-layouts');

// entries
{
    const e = P.cleanEntry('split', { cx: 0.5, cy: '0.25', s: 9, o: 0.01, hide: true, junk: 1 });
    check('entry: numbers kept, strings read, ranges clamped', e && e.cx === 0.5 && e.cy === 0.25 && e.s === P.LIM.s[1] && e.o === P.LIM.o[0]);
    check('entry: hide only as an explicit true', e.hide === true && !('junk' in e));
    check('entry: hide "yes" is not hide', !('hide' in P.cleanEntry('split', { cx: 0.5, cy: 0.5, s: 1, hide: 'yes' })));
    check('entry: menu can never be hidden', !('hide' in P.cleanEntry('menu', { cx: 0.1, cy: 0.9, s: 1, hide: true })));
    check('entry: missing size is 1, missing opacity stays missing', (() => { const x = P.cleanEntry('feed', { cx: 0, cy: 1 }); return x.s === 1 && !('o' in x); })());
    check('entry: NaN / missing centre rejected', P.cleanEntry('split', { cx: NaN, cy: 0.5 }) === null && P.cleanEntry('split', { cy: 0.5 }) === null);
    check('entry: out-of-range centre clamped onto the screen', (() => { const x = P.cleanEntry('x4', { cx: -3, cy: 7 }); return x.cx === 0 && x.cy === 1; })());
    check('entry: unknown control rejected', P.cleanEntry('nuke', { cx: 0.5, cy: 0.5 }) === null && P.cleanEntry('__proto__', { cx: 0.5, cy: 0.5 }) === null);
    const z = P.cleanEntry('joystick', { cx: 0.25, cy: 0.5, w: 0.01, h: 3, s: 2, hide: true });
    check('zone: size clamped, no scale, never hidden', z && z.w === P.LIM.zw[0] && z.h === 1 && !('s' in z) && !('hide' in z));
    check('zone: without a size rejected', P.cleanEntry('joystick', { cx: 0.5, cy: 0.5 }) === null);
}

// layouts and the store
{
    check('layout: not an object', P.cleanLayout(null) === null && P.cleanLayout([]) === null && P.cleanLayout({ controls: [] }) === null);
    check('layout: nothing valid is no layout', P.cleanLayout({ controls: { bogus: { cx: 1, cy: 1 } } }) === null);
    const l = P.cleanLayout({ controls: { split: { cx: 0.8, cy: 0.8, s: 1.2 }, bogus: {}, feed: 'x' } });
    check('layout: valid controls kept, the rest dropped', l && Object.keys(l.controls).join() === 'split');
    const st0 = P.cleanStore(null);
    check('store: default', st0.v === 1 && st0.current.landscape === null && st0.current.portrait === null && st0.snap === true && st0.barBottom === false && !P.hasLayout(st0));
    check('store: broken JSON text is the default', JSON.stringify(P.cleanStore('{oops')) === JSON.stringify(st0));
    const raw = {
        current: { landscape: { controls: { split: { cx: 0.7, cy: 0.9, s: 1 } } }, portrait: 'bad' },
        named: { ' Competitive ': { landscape: { controls: { feed: { cx: 0.6, cy: 0.9, s: 1 } } } }, '<b>x</b>': { landscape: null }, '': {}, 'Long name that is far too long for this': {}, Multibox: 5 },
        active: 'Competitive', snap: false, barBottom: 'yes'
    };
    const st = P.cleanStore(JSON.stringify(raw));
    check('store: current per orientation', st.current.landscape && st.current.portrait === null && P.hasLayout(st));
    check('store: named trimmed, tags stripped, bad ones dropped', Object.keys(st.named).join('|') === 'Competitive|bx/b');
    check('store: named keeps both orientations', st.named.Competitive.landscape.controls.feed.cx === 0.6 && st.named.Competitive.portrait === null);
    check('store: active must be a named layout', st.active === 'Competitive' && P.cleanStore({ active: 'Nope' }).active === null);
    check('store: flags only as booleans', st.snap === false && st.barBottom === false);
    const many = { named: {} };
    for (let i = 0; i < 30; i++) many.named['L' + i] = { landscape: null };
    check('store: at most 12 named layouts', Object.keys(P.cleanStore(many).named).length === 12);
    const proto = P.cleanStore('{"named":{"__proto__":{"landscape":null}}}');
    check('store: __proto__ name ignored', Object.keys(proto.named).length === 0 && !('landscape' in proto.named));
    check('name: control characters removed, spaces collapsed', P.cleanName('a\u0000b   c') === 'ab c' && P.cleanName(5) === null);
}

// clamping
{
    const c = P.clampRect({ x: -40, y: 400, w: 80, h: 80 }, 915, 412, 0);
    check('clamp: off the left and bottom comes back fully on screen', c.x === 0 && c.y === 332 && c.w === 80);
    const c2 = P.clampRect({ x: 2000, y: -5, w: 80, h: 80 }, 915, 412, 4);
    check('clamp: with a margin', c2.x === 831 && c2.y === 4);
    const c3 = P.clampRect({ x: 0, y: 0, w: 2000, h: 900 }, 915, 412, 0);
    check('clamp: larger than the screen shrinks to it', c3.w === 915 && c3.h === 412 && c3.x === 0 && c3.y === 0);
    const c4 = P.clampRect({ x: NaN, y: Infinity, w: 50, h: 50 }, 915, 412, 0);
    check('clamp: NaN / Infinity position lands on screen', isFinite(c4.x) && isFinite(c4.y) && c4.x >= 0 && c4.y + 50 <= 412);
    /* rotation: a control at the bottom right of a landscape screen stays visible in portrait */
    const e = { cx: 0.98, cy: 0.98, s: 1.5 };
    const nat = { w: 90, h: 90 };
    const rl = P.entryRect(e, nat, 915, 412), rp = P.entryRect(e, nat, 412, 915);
    check('entryRect: landscape fully on screen', rl.x >= 0 && rl.y >= 0 && rl.x + rl.w <= 915 + 1e-9 && rl.y + rl.h <= 412 + 1e-9);
    check('entryRect: same entry rotated still on screen', rp.x >= 0 && rp.y >= 0 && rp.x + rp.w <= 412 + 1e-9 && rp.y + rp.h <= 915 + 1e-9);
    const big = P.entryRect({ cx: 0.5, cy: 0.5, s: 2.5 }, { w: 200, h: 200 }, 915, 412);
    check('entryRect: a button never larger than the screen', big.h <= 412 && near(big.w, big.h));
    const z = P.entryRect({ cx: 0.25, cy: 0.5, w: 0.5, h: 1 }, null, 915, 412);
    check('entryRect: zone from fractions', near(z.x, 0) && near(z.w, 457.5) && near(z.h, 412));
    check('fitScale', P.fitScale(2, { w: 300, h: 300 }, 915, 412) === 412 / 300 && P.fitScale(1.2, { w: 50, h: 50 }, 915, 412) === 1.2);
}

// snapping
{
    const s = P.snapRect({ x: 101, y: 57, w: 60, h: 60 }, 915, 412, 16, 12, 4);
    check('snap: grid', s.x === 96 && s.y === 64);
    const e1 = P.snapRect({ x: 9, y: 400 - 60 + 3, w: 60, h: 60 }, 915, 412, 16, 12, 4);
    check('snap: near the left and bottom edge sits at the margin', e1.x === 4 && e1.y === 412 - 4 - 60);
    const e2 = P.snapRect({ x: 915 - 60 - 10, y: 10, w: 60, h: 60 }, 915, 412, 16, 12, 4);
    check('snap: right and top edge', e2.x === 915 - 4 - 60 && e2.y === 4);
    const e3 = P.snapRect({ x: 300, y: 200, w: 60, h: 60 }, 915, 412, 0, 0, 4);
    check('snap: off keeps the position', e3.x === 300 && e3.y === 200);
    const e4 = P.snapRect({ x: 905, y: 405, w: 60, h: 60 }, 915, 412, 16, 12, 4);
    check('snap: never off screen', e4.x + 60 <= 915 && e4.y + 60 <= 412);
    const z = P.snapRect({ x: 7, y: -3, w: 400, h: 412 }, 915, 412, 16, 12, 0);
    check('snap: zone flush to the edges (margin 0)', z.x === 0 && z.y === 0);
}

// overlaps
{
    const a = { id: 'a', x: 0, y: 0, w: 100, h: 100, round: true };
    const b = { id: 'b', x: 90, y: 0, w: 100, h: 100, round: true };
    const c = { id: 'c', x: 80, y: 80, w: 100, h: 100, round: true };
    check('overlap: circles side by side', P.overlaps(a, b));
    check('overlap: circles diagonal with the corners touching only', !P.overlaps(a, c));
    check('overlap: same as rectangles they would', P.overlaps({ x: 0, y: 0, w: 100, h: 100 }, { x: 80, y: 80, w: 100, h: 100 }));
    check('overlap: touching edges is no overlap', !P.overlaps({ x: 0, y: 0, w: 50, h: 50 }, { x: 50, y: 0, w: 50, h: 50 }));
    check('overlap: pad lets 2 px go', !P.overlaps({ x: 0, y: 0, w: 50, h: 50 }, { x: 49, y: 0, w: 50, h: 50 }, 2));
    const pairs = P.findOverlaps([a, b, c, { id: 'm1', x: 150, y: 150, w: 40, h: 40, fixed: true }, { id: 'm2', x: 160, y: 160, w: 40, h: 40, fixed: true }], 0);
    const txt = pairs.map(p => p.join('-')).join(',');
    check('findOverlaps: pairs found, two fixed things not compared', txt === 'a-b,b-c,c-m1,c-m2');
    check('findOverlaps: none', P.findOverlaps([a, { id: 'z', x: 500, y: 0, w: 10, h: 10 }]).length === 0);
}

// entry <-> rectangle round trip
{
    const r = { x: 700, y: 300, w: 80, h: 80 };
    const e = P.rectEntry('split', r, 915, 412, { s: 1.25, o: 0.5, hide: true });
    check('rectEntry: centre fractions, keeps size / opacity / hide', near(e.cx, 740 / 915) && near(e.cy, 340 / 412) && e.s === 1.25 && e.o === 0.5 && e.hide === true);
    const back = P.entryRect(e, { w: 64, h: 64 }, 915, 412);
    check('rectEntry -> entryRect: same place', near(back.x, 700) && near(back.y, 300) && near(back.w, 80));
    const ze = P.rectEntry('joystick', { x: 0, y: 0, w: 457.5, h: 412 }, 915, 412);
    check('rectEntry: zone', near(ze.w, 0.5) && near(ze.h, 1) && near(ze.cx, 0.25) && !('s' in ze));
    check('orientation', P.orientOf(915, 412) === 'landscape' && P.orientOf(412, 915) === 'portrait' && P.orientOf(500, 500) === 'landscape');
}

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
