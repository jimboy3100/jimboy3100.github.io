/* "Show viewports" (debug, top bar set-debug) and the Full Map tiles, with the real code cut out of
 * ogario/ogario.v4.js (drawViewPorts, _lmConnFoodBoxes, calMinMax, drawViewport,
 * drawn on a recording context) and ogario/spect.js (the server view estimate, lmFullMapPlan,
 * getX/getY/convertX/convertY and the tile target code of a spectator connection).
 * Boxes: 1 = the main connection's food box, 2, 3 ... = a multibox unit's (unit number + 1),
 * "n est." = a unit without food (estimated from its size), "Viewport# n" = a spectator's server
 * view around its server camera (measured size; settled views that overlap drawn up to the middle
 * of the overlap), "Viewport# n moving" = the same on its way to its tile, "... unverified" = its
 * orientation not verified, "Viewport# n food" = no camera yet, its food box, "map". No box
 * without a real view (no planned tile, nothing for a connecting or closed spectator).
 * Cases: no box changes with zoom, window size or the controlled unit; units are found by role
 * and number (a spectator before a unit in spects), 0 is a valid unit centre; the food box is
 * padded on both sides; a Full Map spectator's food stays out of box 2; the
 * Full Map grid from the measured view covers the map with overlapping seams within 15
 * connections; a tile target goes to the connection's raw frame and back for all 4 orientations
 * with and without Rotate Map; targets go out at most twice a second; a spectator box contains
 * exactly the cells its view contains (4 orientations x per-axis scales x Rotate Map); on a live
 * capture of 15 settled Full Map spectators every pellet is inside its box, the boxes are tight
 * and neighbouring views overlap, while the drawn boxes do not overlap, each inside its view, and
 * neighbours meet; on FFA, Experimental and Party captures every pellet is inside its view and the
 * farthest one per axis is within LM_FULLMAP_EDGE of the planned view, and no pellet of the
 * captures is out of view by the radius-aware test (isOutsideServerView).
 * node developers/tests/debugviewports.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const spectSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function block(start, from, text) {
    text = text || src;
    const i = text.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = text.indexOf('{', i); k < text.length; k++) {
        if (text[k] === '{') d++;
        else if (text[k] === '}' && !--d) return text.slice(i, k + 1);
    }
    return null;
}
const methods = ['        drawViewPorts(ctx) {', '        _lmViewTrim(g, n) {', '        _lmConnFoodBoxes(list) {', '        calMinMax() {'].map((m) => [m, block(m)]);
const spectMethods = ['    getX(x) {', '    getY(y) {', '    convertX(x) {', '    convertY(y) {', '    _lmTileDisplay() {', '    _lmTileRaw() {', '    _lmTileTick(now) {',
    '    _lmXf() {', '    worldToRawX(x) {', '    worldToRawY(y) {', '    rawToWorldX(x) {', '    rawToWorldY(y) {', '    _lmTileArrived(raw) {',
    '    _lmWorldRectDisplay(r, out) {', '    _lmServerViewDisplay(out) {', '    _lmServerViewWorld(out) {', '    _lmFeedOk() {', '    isOutsideServerView(rawX, rawY, size) {']
    .map((m) => [m, block(m, 0, spectSrc)]);
/* the coordinate contract (lmRawToWorld ... lmXfInv), top of spect.js, which those methods use */
const xf0 = spectSrc.indexOf('var LM_WORLD_SIZE'), xf1 = spectSrc.indexOf('/* orientation candidates');
/* the server view estimate and the planner: top of spect.js, up to addFullSpectator */
const head0 = spectSrc.indexOf('var LM_VIEW_BASE_W'), head1 = spectSrc.indexOf('function addFullSpectator() {');
const dv = block('        drawViewport: function (ctx, text');
/* the per-connection observation index (lmObsTrack, lmObsOfSource) the test pellets are tracked in */
const obs0 = src.indexOf('var _lmSrcObs = new Map();'), obs1 = src.indexOf('/* Speed of a cell', obs0);
const missing = methods.concat(spectMethods).filter((m) => !m[1]).map((m) => m[0].trim()).concat(dv ? [] : ['drawViewport'])
    .concat(head0 >= 0 && head1 > head0 ? [] : ['spect.js lmServerViewSize / lmFullMapPlan'])
    .concat(xf0 >= 0 && xf1 > xf0 ? [] : ['spect.js coordinate contract'])
    .concat(obs0 >= 0 && obs1 > obs0 ? [] : ['lmObsTrack / lmObsOfSource']);
if (missing.length) { console.log('FAIL code not found: ' + missing.join(', ')); process.exit(1); }

function env(o) {
    o = o || {};
    const LM = { food: [], foodMulti: [], viewXTrue: 0, viewYTrue: 0, multiBoxPlayerExists: o.mb !== false, mapOffsetFixed: true,
        mapMinX: -7071, mapMinY: -7071, mapMaxX: 7071, mapMaxY: 7071, mapOffsetX: 0, mapOffsetY: 0, vector: o.vector || null, vnr: 0 };
    if (o.main) Object.assign(LM, o.main);
    const boxes = [];
    const ctx2d = {
        fillText(text, x, y) { this._t = text; },
        beginPath() { this._p = []; }, moveTo(x, y) { this._p.push([x, y]); }, lineTo(x, y) { this._p.push([x, y]); },
        closePath() { }, stroke() {
            const xs = this._p.map((p) => p[0]), ys = this._p.map((p) => p[1]);
            boxes.push({ label: this._t, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) });
        }
    };
    const win = { fullSpectator: !!o.full, spects: o.spects || [] };
    win.legendmod = LM;
    const c = { window: win, LM, legendmod: LM, spects: win.spects, defaultSettings: { foodSize: 5, bordersColor: '#ff0000' },
        defaultmapsettings: { multiboxAmount: 3 }, Math, Number, String, console, document: { hidden: false } };
    vm.createContext(c);
    vm.runInContext(src.slice(obs0, obs1) + spectSrc.slice(xf0, xf1) + spectSrc.slice(head0, head1) +
        'var drawRender = {' + methods.map((m) => m[1]).concat([dv]).join(',\n') + '};' +
        /* a spectator connection with spect.js's own coordinate and tile code */
        'var SpectXY = class { constructor(p) { this.sent = []; Object.assign(this, p); }\n' +
        'sendPosition(x, y) { if (this.offline) return; this.sent.push([x, y, this.clock]); return true; }\n' +
        spectMethods.map((m) => m[1]).join('\n') + '\n};', c);
    const dr = c.drawRender;
    /* pellets put into foodMulti go into their connection's index too, as in spect.js */
    Object.defineProperty(LM.foodMulti, 'track', { value: (cell, n) => c.lmObsTrack(cell, n) });
    dr.ctx = ctx2d; dr.canvasWidth = 1600; dr.canvasHeight = 900; dr.scale = o.scale || 0.5;
    return { c, LM, dr, win, boxes, spect(p) { const sp = vm.runInContext('(p) => new SpectXY(p)', c)(p); win.spects.push(sp); return sp; },
        frame() { boxes.length = 0; dr.calMinMax(); dr.drawViewPorts(ctx2d); return boxes.slice(); } };
}
/* food spread +-r around (cx, cy), owned by connection `spectator` (0 = main) */
function food(list, cx, cy, r, spectator) {
    for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) {
        const f = { x: cx - r + i * r / 5, y: cy - r + j * r / 5, spectator, isFood: true, _foodMultiIdx: list.length };
        list.push(f);
        if (list.track && spectator > 0) list.track(f, spectator);
    }
}
const unit = (number, x, y) => ({ number, player: true, playerCellIDs: [number * 1e9 + 1], playerX: x, playerY: y, playerSize: 100 });
const byLabel = (bs, l) => bs.find((b) => b.label === l);
const same = (a, b) => !!a && !!b && a.minX === b.minX && a.maxX === b.maxX && a.minY === b.minY && a.maxY === b.maxY;
const MAP = 15957;

/* 1. boxes 1, 2, 3: food boxes padded on both sides; unchanged by zoom, window size, unit switch */
{
    const u1 = unit(1, 4000, 3000), u2 = unit(2, -6000, -2000);
    const e = env({ spects: [u1, u2], scale: 0.5 });
    food(e.LM.food, 0, 0, 2500, 0);
    food(e.LM.foodMulti, 4000, 3000, 2000, 1);
    food(e.LM.foodMulti, -6000, -2000, 1500, 2);
    const normal = e.frame();
    const b1 = byLabel(normal, '1'), b2 = byLabel(normal, '2'), b3 = byLabel(normal, '3');
    check('box 2 is unit 1\'s food box, padded by the food radius on both sides', b2 && b2.minX === 4000 - 2000 - 15 && b2.maxX === 4000 + 2000 + 15 && b2.maxY === 3000 + 2000 + 15, b2 && [b2.minX, b2.maxX, b2.maxY]);
    check('box 3 is unit 2\'s food box (not unit 1\'s food)', b3 && b3.minX === -6000 - 1500 - 15 && b3.maxY === -2000 + 1500 + 15, b3 && [b3.minX, b3.maxY]);
    check('box 1 is the main connection\'s food only, padded on both sides', b1 && b1.minX === -2515 && b1.maxX === 2515, b1 && [b1.minX, b1.maxX]);
    e.dr.scale = 0.02; /* World Spectate zoomed out over the whole map */
    const world = e.frame();
    check('zoom: boxes 1, 2, 3 unchanged', same(byLabel(world, '1'), b1) && same(byLabel(world, '2'), b2) && same(byLabel(world, '3'), b3));
    e.dr.canvasWidth = 3840; e.dr.canvasHeight = 600; e.dr.scale = 1.3; /* browser resize */
    check('window resize: boxes unchanged', same(byLabel(e.frame(), '2'), b2) && same(byLabel(e.frame(), '1'), b1));
    e.win.multiboxPlayerEnabled = 2; e.LM.viewXTrue = 0; /* switch the controlled unit */
    const sw = e.frame();
    check('switching units: boxes 2 and 3 stay', same(byLabel(sw, '2'), b2) && same(byLabel(sw, '3'), b3));
    check('unit boxes inside the map', [b2, b3].every((b) => b.minX > -MAP && b.maxX < MAP && b.minY > -MAP && b.maxY < MAP));
}
/* 2. a unit without food: estimated server view from its size, not the main screen around it */
{
    const u1 = unit(1, 1000, 500);
    const e = env({ spects: [u1], scale: 0.5 });
    food(e.LM.food, 0, 0, 2500, 0);
    const b = byLabel(e.frame(), '2 est.');
    const s = Math.pow(64 / 100, 0.4), w = 2028.7 / s;
    check('unit without food: "2 est." box from its size', b && Math.abs(b.maxX - b.minX - w) < 1e-6 && Math.abs((b.minX + b.maxX) / 2 - 1000) < 1e-6, b && [b.minX, b.maxX]);
    e.dr.scale = 0.05; e.dr.canvasWidth = 400;
    check('unit without food: estimate unchanged by zoom and window size', same(byLabel(e.frame(), '2 est.'), b));
}
/* 3. units by role and number: a spectator before the unit, a unit at x = 0 */
{
    const e = env({ full: true });
    e.spect({ number: 1, player: false, staticX: 0, staticY: 0, mapOffsetFixed: false });
    const u = e.spect(Object.assign(unit(2, 0, 0)));
    food(e.LM.foodMulti, 0, 0, 1000, 2);
    const bs = e.frame();
    check('a unit after a spectator in spects gets its box (unit number + 1)', !!byLabel(bs, '3'), JSON.stringify(bs.map((b) => b.label)));
    check('a unit at the map centre (x = 0) gets its box', byLabel(bs, '3') && byLabel(bs, '3').minX === -1015);
    void u;
}
/* 4. no stale box 1 after the food is gone (disconnect, server switch) */
{
    const e = env({ spects: [], scale: 0.5 });
    food(e.LM.food, 9000, 9000, 2000, 0);
    check('box 1 drawn while there is food', !!byLabel(e.frame(), '1'));
    e.LM.food = [];
    check('no food: box 1 not drawn at the old server view', !byLabel(e.frame(), '1'));
}
/* 5. a Full Map spectator's food is not a unit's: box 2 and the multibox culling box exclude it */
{
    const e = env({ full: true });
    e.spect(Object.assign(unit(1, 2000, 1000), { mapOffsetFixed: true }));
    food(e.LM.foodMulti, 2000, 1000, 1500, 1);
    e.spect({ number: 2, player: false, staticX: -4500, staticY: -5600, mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0 });
    food(e.LM.foodMulti, -4500, -5600, 2400, 2);
    const bs = e.frame();
    const b2 = byLabel(bs, '2'), v2 = byLabel(bs, 'Viewport# 2 food');
    check('box 2 is the unit\'s food only', b2 && b2.minX === 2000 - 1500 - 15 && b2.maxY === 1000 + 1500 + 15, b2 && [b2.minX, b2.maxY]);
    check('the spectator has its own food box', v2 && v2.minX === -4500 - 2400 - 15);
    check('no full-spectator box around the unit', !byLabel(bs, 'Viewport# 1'));
}

/* ---- Full Map ---- */
const spectAt = (number, sx, sy, o) => Object.assign({ number, player: false, staticX: sx, staticY: sy, isSpectateEnabled: true, isFreeSpectate: true,
    mapOffsetFixed: false, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmKX: 1, _lmKY: 1, _lmCamAt: 0 }, o || {});
const covers = (plan, vw, vh, half) => {
    for (let x = -half; x <= half; x += 37) for (let y = -half; y <= half; y += 37) {
        if (!plan.tiles.some((t) => Math.abs(x - t.x) <= vw / 2 && Math.abs(y - t.y) <= vh / 2)) return [x, y];
    }
    return null;
};
/* 6. the grid from the measured view: 15 connections on agar.io, seams overlap, outer views at the edge */
{
    const e = env({ full: true, mb: false });
    const view = e.c.lmServerViewSize();
    /* live: every pellet centre of 15 settled free spectators within 2535.8 x 1485.9 of the camera */
    check('free spectator server view: measured 5071.7 x 2971.9 (scale 0.4)', Math.abs(view[0] - 5071.75) < 0.01 && Math.abs(view[1] - 2972) < 0.01, view);
    const plan = e.c.lmFullMapPlan(14142.135623730952, 14142.135623730952, view[0], view[1], 15);
    check('agar.io map: 3 x 5 = 15 connections (no more than before)', plan && plan.cols === 3 && plan.rows === 5 && plan.tiles.length === 15, plan && [plan.cols, plan.rows]);
    check('the tiles cover the whole map', plan && covers(plan, view[0], view[1], 7071.07) === null, plan && covers(plan, view[0], view[1], 7071.07));
    check('seams overlap by 528 / 175 (the centred cut: 357 / 143)', plan && Math.abs(plan.seamX - 528.56) < 0.1 && Math.abs(plan.seamY - 175.47) < 0.1 &&
        Math.abs(view[0] - plan.stepX - plan.seamX) < 1e-9, plan && [plan.seamX, plan.seamY]);
    const ext = plan && [Math.min(...plan.tiles.map((t) => t.x - view[0] / 2)), Math.max(...plan.tiles.map((t) => t.x + view[0] / 2)),
        Math.min(...plan.tiles.map((t) => t.y - view[1] / 2)), Math.max(...plan.tiles.map((t) => t.y + view[1] / 2))];
    check('the outer views reach 8 past every map edge, no more', ext && ext.every((v, i) => Math.abs(Math.abs(v) - 7071.07 - 8) < 0.01), ext);
    check('the grid is centred: a mirrored tile is another tile', plan && plan.tiles.every((t) => plan.tiles.some((u) => Math.abs(u.x + t.x) < 1e-6 && Math.abs(u.y + t.y) < 1e-6)));
    /* cameras settle within 0.5 units (live): seams lose at most 1 unit, the edge reach 0.5 */
    check('cameras 0.5 off: still covered', plan && covers({ tiles: plan.tiles.map((t) => ({ x: t.x + 0.5 * (t.col - 1), y: t.y - 0.5 })) }, view[0], view[1], 7071.07) === null);
    const old = e.c.lmFullMapPlan(14142.135623730952, 14142.135623730952, 5000, 2940, 15);
    check('the 5000 x 2940 food-box estimate still fits 3 x 5 with seams', old && old.tiles.length === 15 && old.seamY > 100, old && [old.cols, old.rows, old.seamY]);
    check('a slightly bigger map than 14142 still gets 15 (seams >= 0 inside the budget)', (e.c.lmFullMapPlan(14700, 14700, view[0], view[1], 15) || {}).tiles.length === 15);
    check('a map that needs more than 15 connections is refused', e.c.lmFullMapPlan(14142, 14142, 3000, 2000, 15) === null);
}
/* 7. tile target -> this connection's raw frame -> back, for all 4 orientations, Rotate Map on/off */
{
    let bad = [];
    for (const rot of [null, [[true, false]], [[false, true]], [[true, true]]]) {
        for (const fx of [1, -1]) for (const fy of [1, -1]) {
            const e = env({ full: true, mb: false, vector: rot, main: { mapOffsetX: 1234, mapOffsetY: -777, mapMinX: -7071 - 1234, mapMaxX: 7071 - 1234, mapMinY: -7071 + 777, mapMaxY: 7071 + 777 } });
            const s = e.spect(spectAt(1, -4714, 5656.8, { mapOffsetFixed: true, mapOffsetX: -2500, mapOffsetY: 3100, fixX: fx, fixY: fy }));
            const raw = s._lmTileRaw(), d = s._lmTileDisplay();
            const backX = s.getX(raw[0]), backY = s.getY(raw[1]);
            /* display -> world: undo Rotate Map, take the map centre off */
            const v = rot && rot[0];
            const ux = v && v[0] ? e.LM.mapMaxX - (backX - e.LM.mapMinX) : backX, uy = v && v[1] ? e.LM.mapMaxY - (backY - e.LM.mapMinY) : backY;
            const wx = ux - (e.LM.mapMinX + e.LM.mapMaxX) / 2, wy = uy - (e.LM.mapMinY + e.LM.mapMaxY) / 2;
            /* the raw target is this connection's own frame: border centre + orientation * world */
            const rx = 2500 + fx * -4714, ry = -3100 + fy * 5656.8;
            if (Math.abs(wx + 4714) > 0.51 || Math.abs(wy - 5656.8) > 0.51 || Math.abs(raw[0] - rx) > 0.51 || Math.abs(raw[1] - ry) > 0.51 ||
                Math.abs(backX - d[0]) > 0.51) bad.push([JSON.stringify(rot), fx, fy, raw, [wx, wy]].join(' '));
        }
    }
    check('tile target round-trips to raw and back (4 orientations x Rotate Map)', !bad.length, bad.join(' | '));
}
/* 8. sending: nothing before the borders, at once, every 500 ms on the way, once a second when there */
{
    const e = env({ full: true, mb: false });
    const s = e.spect(spectAt(1, 0, -5657));
    s.clock = 1000; s._lmTileSentAt = 0; s._lmTileSentX = s._lmTileSentY = NaN;
    s._lmTileTick(1000);
    check('no send before this connection\'s border is fixed (it went out unconverted)', s.sent.length === 0);
    s.mapOffsetFixed = true;
    s._lmTileTick(1000);
    check('sent at once when the border is known', s.sent.length === 1 && s.sent[0][1] === -5657, JSON.stringify(s.sent));
    for (let t = 1100; t < 1500; t += 100) s._lmTileTick(t);
    check('not again within 500 ms while the camera glides (it was every 50 ms)', s.sent.length === 1, s.sent.length);
    s._lmTileTick(1500);
    check('every 500 ms while the camera is on its way', s.sent.length === 2);
    s.viewX = 3; s.viewY = -5645; s._lmCamAt = 1560; /* opcode 17: the camera is 12 off: there */
    for (let t = 1600; t < 2500; t += 100) s._lmTileTick(t);
    check('camera on the tile: no resend for a second', s.sent.length === 2, s.sent.length);
    s._lmTileTick(2500);
    check('camera on the tile: refreshed after a second', s.sent.length === 3, s.sent.length);
    s._lmCamAt = 2560; s.viewY = -5620; /* 37 off: not there (it was "there" within 64) */
    s._lmTileTick(2600); s._lmTileTick(2900);
    check('camera 37 off the tile: not there, back to 500 ms', s.sent.length === 3 && (s._lmTileTick(3000), s.sent.length === 4), s.sent.length);
    s._lmCamAt = 3010; s.viewY = -5657;
    s.fixY = -1; /* orientation found: the raw target changes */
    s._lmTileTick(3020);
    check('a changed raw target goes out at once', s.sent.length === 5 && s.sent[4][1] === 5657, JSON.stringify(s.sent[4]));
    s.offline = true; s._lmTileTick(3600); s.offline = false;
    s._lmTileTick(3610);
    check('a send the socket refused is retried', s.sent.length === 6);
    let n = 0; const s2 = e.spect(spectAt(2, 0, 0, { mapOffsetFixed: true })); s2.sendPosition = () => (n++, true);
    for (let t = 0; t < 20000; t += 100) s2._lmTileTick(t);
    check('a camera that never arrives: at most 2 targets a second (it was 20)', n <= 41, n);
}
/* 9. spectator boxes: none while connecting, the tile and "moving" on the way, one box when there */
{
    const e = env({ full: true, mb: false });
    const s = e.spect(spectAt(1, -4543.2, -5593.1));
    const first = e.frame();
    check('connecting spectator: no box at all (its planned tile is no view; it drew "Tile 1")', first.length === 1 && first[0].label === 'map', JSON.stringify(first.map((b) => b.label)));
    s.mapOffsetFixed = true; s.viewX = 0; s.viewY = 0;
    check('a camera from the border centre only (no opcode 17): no box yet', !e.frame().some((b) => /^Viewport#/.test(b.label)));
    s._lmCamAt = 1; s.scale = 0.4;
    const mv = e.frame(), moving = byLabel(mv, 'Viewport# 1 moving');
    check('gliding from the map centre: "moving" box around the server camera, no tile box', moving && Math.abs((moving.minX + moving.maxX) / 2) < 1e-6 &&
        Math.abs(moving.maxX - moving.minX - 5071.75) < 1e-6 && mv.length === 2, moving && [moving.minX, moving.maxX, mv.length]);
    s.viewX = -4543.2 + 0.4; s.viewY = -5593.1 - 0.3; /* settled (live: within 0.5) */
    const at = e.frame(), box = byLabel(at, 'Viewport# 1');
    check('on its tile: one box (Viewport# 1)', box && at.length === 2 && !byLabel(at, 'Viewport# 1 moving') &&
        Math.abs(box.minX - (-4543.2 + 0.4 - 5071.75 / 2)) < 1e-6, JSON.stringify(at.map((b) => b.label)));
    e.dr.scale = 0.03; e.dr.canvasWidth = 5000;
    check('box unchanged by zoom and window size', same(byLabel(e.frame(), 'Viewport# 1'), box));
    e.LM.vector = [[true, true]];
    const rt = byLabel(e.frame(), 'Viewport# 1');
    check('Rotate Map: the box mirrored with the map', rt && Math.abs((rt.minX + rt.maxX) / 2 - (4543.2 - 0.4)) < 1e-6 && Math.abs((rt.minY + rt.maxY) / 2 - (5593.1 + 0.3)) < 1e-6);
    e.LM.vector = null;
    /* orientation PROVISIONAL / CONFLICTED: placed with the guess (maybe the mirror tile), its
     * cells not drawn: never the settled white box (it was 'Viewport# 1', 9086 units off) */
    s.integrity = true;
    for (const st of ['PROVISIONAL', 'CONFLICTED']) {
        s._lmOri = st;
        const u = e.frame();
        check('orientation ' + st + ': "Viewport# 1 unverified" in the estimate colour', !!byLabel(u, 'Viewport# 1 unverified') && !byLabel(u, 'Viewport# 1') && u.length === 2, JSON.stringify(u.map((b) => b.label)));
    }
    s._lmOri = 'VERIFIED';
    check('orientation VERIFIED: "Viewport# 1"', !!byLabel(e.frame(), 'Viewport# 1'));
    s._lmOri = 'PROVISIONAL'; s.viewX = 0; s.viewY = 0;
    check('gliding and unverified: "Viewport# 1 moving unverified"', !!byLabel(e.frame(), 'Viewport# 1 moving unverified'));
    s._lmOri = 'VERIFIED';
    s._lmCamAt = 0; food(e.LM.foodMulti, 100, 200, 300, 1);
    check('no camera but food: its food box, labelled food', !!byLabel(e.frame(), 'Viewport# 1 food'));
    /* socket closed (onclose: resetConnectionState, flushCellsData) or given up: no view, no box */
    e.LM.foodMulti = []; s.mapOffsetFixed = false;
    check('closed or given-up spectator: no box (it drew "Tile 1" like one still connecting)', e.frame().length === 1);
}
/* 10. boxes in the frame the cells are drawn in: 4 orientations x per-axis scale x Rotate Map */
{
    let bad = [], n = 0;
    for (const rot of [null, [[true, false]], [[false, true]], [[true, true]]]) {
        for (const fx of [1, -1]) for (const fy of [1, -1]) for (const [kx, ky] of [[1, 1], [0.995453, 1.004765], [1.004869, 0.996175]]) {
            const e = env({ full: true, mb: false, vector: rot, main: { mapOffsetX: -2990, mapOffsetY: -3148, _lmBorderCX: 2990, _lmBorderCY: 3148,
                _lmBorderKX: 1.00268, _lmBorderKY: 1.00388, mapMinX: 2990 - 7052, mapMaxX: 2990 + 7052, mapMinY: 3148 - 7044, mapMaxY: 3148 + 7044 } });
            const cam = [1234, -2345];
            const s = e.spect(spectAt(1, 0, 0, { mapOffsetFixed: true, mapOffsetX: 1764, mapOffsetY: -2040, fixX: fx, fixY: fy, _lmKX: kx, _lmKY: ky,
                viewX: cam[0], viewY: cam[1], scale: 0.4, _lmCamAt: 1, staticX: null, staticY: null }));
            const b = byLabel(e.frame(), 'Viewport# 1');
            if (!b) { bad.push('no box ' + [JSON.stringify(rot), fx, fy, kx].join()); continue; }
            /* raw points just inside / outside the server view (world half size / k), drawn by getX like the cells */
            const hw = 5071.75 / 2 / kx, hh = 2972 / 2 / ky;
            for (const [ox, oy, inside] of [[hw - 1, 0, true], [-hw + 1, hh - 1, true], [0, -hh + 1, true], [hw + 1, 0, false], [0, -hh - 1, false], [-hw - 1, hh + 1, false]]) {
                const x = s.getX(cam[0] + ox), y = s.getY(cam[1] + oy);
                const isIn = x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY;
                n++;
                if (isIn !== inside) bad.push([JSON.stringify(rot), fx, fy, kx, ox.toFixed(0), oy.toFixed(0), inside].join());
            }
        }
    }
    check('a cell just inside the server view is drawn inside the box, just outside outside (' + n + ' points, 4 orientations x 3 scales x Rotate Map)', !bad.length, bad.slice(0, 4).join(' | '));
}
/* 11. live agar.io (15 settled Full Map spectators, developers/tests/lib/fullmap-views-live.json):
 *     every pellet a spectator got is inside its box, the box is tight, neighbours overlap */
{
    const L = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'fullmap-views-live.json'), 'utf8'));
    for (const rot of [null, [[true, true]]]) {
        const mb = L.main.border, W = 14142.135623730952;
        const e = env({ full: true, mb: false, vector: rot, main: { mapOffsetX: -(mb[0] + mb[2]) / 2, mapOffsetY: -(mb[1] + mb[3]) / 2, _lmBorderCX: (mb[0] + mb[2]) / 2, _lmBorderCY: (mb[1] + mb[3]) / 2,
            _lmBorderKX: W / (mb[2] - mb[0]), _lmBorderKY: W / (mb[3] - mb[1]), mapMinX: mb[0], mapMinY: mb[1], mapMaxX: mb[2], mapMaxY: mb[3] } });
        const sps = L.sp.map((q) => e.spect(spectAt(q.n, q.staticX, q.staticY, { mapOffsetFixed: true, mapOffsetX: -(q.border[0] + q.border[2]) / 2, mapOffsetY: -(q.border[1] + q.border[3]) / 2,
            fixX: q.s[0], fixY: q.s[1], _lmKX: W / (q.border[2] - q.border[0]), _lmKY: W / (q.border[3] - q.border[1]), viewX: q.cam[0], viewY: q.cam[1], scale: q.cam[2], _lmCamAt: 1 })));
        const bs = e.frame();
        const tag = rot ? ' (Rotate Map)' : '';
        check('live: 15 spectators on their tiles, 15 boxes labelled Viewport# n, no tile or moving boxes' + tag,
            L.sp.every((q) => byLabel(bs, 'Viewport# ' + q.n)) && !bs.some((b) => /^Tile|moving/.test(b.label)), JSON.stringify(bs.map((b) => b.label)));
        let outside = [], gaps = [];
        const mapB = byLabel(bs, 'map');
        /* the real views (what the server sends); the drawn boxes are trimmed where they overlap */
        const real = (sp) => { const r = sp._lmServerViewDisplay(); return { minX: r[0], minY: r[1], maxX: r[2], maxY: r[3] }; };
        L.sp.forEach((q, i) => {
            const sp = sps[i], b = real(sp);
            const pts = q.food.map((f) => [sp.getX(f[0]), sp.getY(f[1])]);
            for (const p of pts) if (p[0] < b.minX - 1 || p[0] > b.maxX + 1 || p[1] < b.minY - 1 || p[1] > b.maxY + 1) outside.push(q.n + ':' + p.map((v) => v.toFixed(1)));
            /* tight: on every side away from the map edge a pellet came within 40 of the box edge (pellets are sparse) */
            const g = [Math.min(...pts.map((p) => p[0] - b.minX)), Math.min(...pts.map((p) => b.maxX - p[0])), Math.min(...pts.map((p) => p[1] - b.minY)), Math.min(...pts.map((p) => b.maxY - p[1]))];
            const atEdge = [b.minX < mapB.minX + 30, b.maxX > mapB.maxX - 30, b.minY < mapB.minY + 30, b.maxY > mapB.maxY - 30];
            g.forEach((v, k) => { if (!atEdge[k] && v > 40) gaps.push(q.n + ':' + 'LRTB'[k] + v.toFixed(1)); });
        });
        check('live: every pellet a spectator got while settled is inside its view' + tag, !outside.length, outside.slice(0, 5).join(' '));
        /* the ghost cells read every spectator's view every frame into one kept array: same box */
        const keep = [0, 0, 0, 0];
        const same = sps.every((sp) => { const a = sp._lmServerViewDisplay(), b = sp._lmServerViewDisplay(keep); return b === keep && a.every((v, k) => v === b[k]); });
        check('live: the view filled into a kept array is the same box (no new array)' + tag, same);
        check('live: the views are tight (a pellet within 40 of every inner edge)' + tag, !gaps.length, gaps.join(' '));
        /* neighbours on the grid (tile index: row * 3 + col of 6024750d's centred 3 x 5 cut) */
        const spOf = (t) => sps[L.sp.findIndex((q) => q.tile === t)];
        const ov = (a, b, k) => Math.min(a[k ? 'maxY' : 'maxX'], b[k ? 'maxY' : 'maxX']) - Math.max(a[k ? 'minY' : 'minX'], b[k ? 'minY' : 'minX']);
        let minX = Infinity, minY = Infinity, meetX = 0, meetY = 0;
        for (let t = 0; t < 15; t++) {
            const a = real(spOf(t)), da = byLabel(bs, 'Viewport# ' + spOf(t).number);
            if (t % 3 < 2) { const r = spOf(t + 1); minX = Math.min(minX, ov(a, real(r), 0)); meetX = Math.max(meetX, Math.abs(ov(da, byLabel(bs, 'Viewport# ' + r.number), 0))); }
            if (t < 12) { const d = spOf(t + 3); minY = Math.min(minY, ov(a, real(d), 1)); meetY = Math.max(meetY, Math.abs(ov(da, byLabel(bs, 'Viewport# ' + d.number), 1))); }
        }
        check('live: neighbouring views overlap (at least 350 / 140 on the centred cut)' + tag, minX >= 350 && minY >= 140, [minX.toFixed(1), minY.toFixed(1)]);
        /* drawn: no two boxes overlap (borders meet in one line, not two parallel ones), each
         * drawn box inside its own real view, neighbours meet (within a unit: cameras settle
         * within 0.5) */
        const drawn = bs.filter((b) => b.label !== 'map');
        let crossing = [], notInView = [];
        for (let i = 0; i < drawn.length; i++) {
            const a = drawn[i];
            for (let j = i + 1; j < drawn.length; j++) if (ov(a, drawn[j], 0) > 1e-9 && ov(a, drawn[j], 1) > 1e-9) crossing.push(a.label + '/' + drawn[j].label);
            const sp = sps.find((p) => 'Viewport# ' + p.number === a.label), r = sp && real(sp);
            if (!r || a.minX < r.minX - 1e-9 || a.maxX > r.maxX + 1e-9 || a.minY < r.minY - 1e-9 || a.maxY > r.maxY + 1e-9) notInView.push(a.label);
        }
        check('live: no two drawn boxes overlap (the seams were drawn as two parallel lines)' + tag, drawn.length === 15 && !crossing.length, drawn.length + ' ' + crossing.length + ' ' + crossing.slice(0, 4).join(' '));
        check('live: every drawn box is a real view and inside it' + tag, !notInView.length, notInView.join(' '));
        check('live: neighbouring drawn boxes meet (gap or overlap at most 1 unit)' + tag, meetX <= 1 && meetY <= 1, [meetX.toFixed(2), meetY.toFixed(2)]);
    }
}

/* 12. live agar.io FFA, Experimental and Party (developers/tests/lib/fullmap-modes-live.json, main + 15
 *     free spectators each; the settled ones): the server view is the same in every mode, so one view
 *     base serves them all: every pellet nearest a side of a view is inside its box (2 units: camera and
 *     integer positions; one FFA pellet was 1.4 past), and per mode the farthest pellet seen on each axis
 *     (either side) is within LM_FULLMAP_EDGE of the planned half view (the outer views still reach the
 *     map edge). One
 *     snapshot each, so pellets are too sparse here for the tightness check of case 11 */
{
    const M = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', 'fullmap-modes-live.json'), 'utf8'));
    const W = 14142.135623730952;
    check('live modes: FFA, Experimental and Party captured, 8 or more settled views each',
        ['ffa', 'exp', 'party'].every((l) => M.modes.some((m) => m.label === l && m.views.length >= 8)), M.modes.map((m) => m.label + ':' + m.views.length).join());
    for (const m of M.modes) for (const rot of [null, [[true, true]], [[true, false]]]) {
        const mb = m.main.border;
        const e = env({ full: true, mb: false, vector: rot, main: { mapOffsetX: -(mb[0] + mb[2]) / 2, mapOffsetY: -(mb[1] + mb[3]) / 2, _lmBorderCX: (mb[0] + mb[2]) / 2, _lmBorderCY: (mb[1] + mb[3]) / 2,
            _lmBorderKX: W / (mb[2] - mb[0]), _lmBorderKY: W / (mb[3] - mb[1]), mapMinX: mb[0], mapMinY: mb[1], mapMaxX: mb[2], mapMaxY: mb[3] } });
        const sps = m.views.map((q) => e.spect(spectAt(q.n, null, null, { mapOffsetFixed: true, mapOffsetX: -(q.border[0] + q.border[2]) / 2, mapOffsetY: -(q.border[1] + q.border[3]) / 2,
            fixX: q.s[0], fixY: q.s[1], _lmKX: W / (q.border[2] - q.border[0]), _lmKY: W / (q.border[3] - q.border[1]), viewX: q.cam[0], viewY: q.cam[1], scale: q.cam[2], _lmCamAt: 1 })));
        const bs = e.frame();
        const tag = ' (' + m.label + (rot ? ', Rotate Map ' + JSON.stringify(rot[0]) : '') + ')';
        const outside = [], far = [0, 0, 0, 0];
        let sent = 0;
        m.views.forEach((q, i) => {
            const sp = sps[i], r = sp._lmServerViewDisplay();
            if (!byLabel(bs, 'Viewport# ' + q.n) || !r) { outside.push(q.n + ': no box'); return; }
            const b = { minX: r[0], minY: r[1], maxX: r[2], maxY: r[3] };
            const pts = q.ext.map((f) => [sp.getX(f[0]), sp.getY(f[1])]);
            /* every pellet the server sent is in view by the radius-aware test */
            for (const f of q.ext) if (sp.isOutsideServerView(f[0], f[1], f[2])) sent++;
            for (const p of pts) if (p[0] < b.minX - 2 || p[0] > b.maxX + 2 || p[1] < b.minY - 2 || p[1] > b.maxY + 2) outside.push(q.n + ':' + p.map((v) => v.toFixed(1)));
            /* world distance from the camera per side (-x, +x, -y, +y) */
            const cx = sp.rawToWorldX(q.cam[0]), cy = sp.rawToWorldY(q.cam[1]);
            for (const f of q.ext) {
                const dx = sp.rawToWorldX(f[0]) - cx, dy = sp.rawToWorldY(f[1]) - cy;
                far[0] = Math.max(far[0], -dx); far[1] = Math.max(far[1], dx); far[2] = Math.max(far[2], -dy); far[3] = Math.max(far[3], dy);
            }
        });
        check('live: every pellet nearest a side of a settled view is inside its view' + tag, !outside.length, outside.slice(0, 5).join(' '));
        check('live: no pellet the server sent is out of view by isOutsideServerView with its size' + tag, sent === 0, sent);
        if (rot) continue;
        const plan = e.c.lmFullMapPlan(W, W, ...e.c.lmServerViewSize(e.c.LM_SPECT_FREE_SCALE));
        const edge = vm.runInContext('LM_FULLMAP_EDGE', e.c);
        const short = [plan.viewW / 2 - Math.max(far[0], far[1]), plan.viewH / 2 - Math.max(far[2], far[3])];
        check('live: the farthest pellet per axis is at most ' + edge + ' inside the planned half view and at most 2 past it (x ' + short[0].toFixed(1) + ', y ' + short[1].toFixed(1) + ')' + tag,
            short.every((v) => v >= -2 && v <= edge));
    }
}

console.log(failed ? 'FAILED ' + failed : 'all debugviewports checks passed');
process.exit(failed ? 1 : 0);
