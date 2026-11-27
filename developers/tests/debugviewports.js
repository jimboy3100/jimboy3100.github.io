/* "Show viewports" (debug, top bar set-debug) and the Full Map tiles, with the real code cut out of
 * ogario/ogario.v4.js (drawViewPorts, _lmConnFoodBoxes, calMinMax, calMinMaxMulti, drawViewport,
 * drawn on a recording context) and ogario/spect.js (the server view estimate, lmFullMapPlan,
 * getX/getY/convertX/convertY and the tile target code of a spectator connection).
 * Boxes: 1 = the main connection's food box, 2, 3 ... = a multibox unit's (unit number + 1),
 * "n est." = a unit without food (estimated from its size), "Viewport# n" = a spectator's food box,
 * "Viewport# n est." = around its server camera, "Tile n" = its planned Full Map tile, "map".
 * Cases: no box changes with zoom, window size or the controlled unit; units are found by role
 * and number (a spectator before a unit in spects), 0 is a valid unit centre; the food box is
 * padded on both sides; a Full Map spectator's food stays out of box 2 and calMinMaxMulti; the
 * Full Map grid covers the map with overlapping seams within 15 connections; a tile target goes
 * to the connection's raw frame and back for all 4 orientations with and without Rotate Map; an
 * unchanged target is not resent every 50 ms once the camera is there.
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
const methods = ['        drawViewPorts(ctx) {', '        _lmConnFoodBoxes(list) {', '        calMinMax() {', '        calMinMaxMulti() {'].map((m) => [m, block(m)]);
const spectMethods = ['    getX(x) {', '    getY(y) {', '    convertX(x) {', '    convertY(y) {', '    _lmTileDisplay() {', '    _lmTileRaw() {', '    _lmTileTick(now) {']
    .map((m) => [m, block(m, 0, spectSrc)]);
/* the server view estimate and the planner: top of spect.js, up to addFullSpectator */
const head0 = spectSrc.indexOf('var LM_VIEW_BASE_W'), head1 = spectSrc.indexOf('function addFullSpectator() {');
const dv = block('        drawViewport: function (ctx, text');
const missing = methods.concat(spectMethods).filter((m) => !m[1]).map((m) => m[0].trim()).concat(dv ? [] : ['drawViewport'])
    .concat(head0 >= 0 && head1 > head0 ? [] : ['spect.js lmServerViewSize / lmFullMapPlan']);
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
    vm.runInContext(spectSrc.slice(head0, head1) +
        'var drawRender = {' + methods.map((m) => m[1]).concat([dv]).join(',\n') + '};' +
        /* a spectator connection with spect.js's own coordinate and tile code */
        'var SpectXY = class { constructor(p) { this.sent = []; Object.assign(this, p); }\n' +
        'sendPosition(x, y) { if (this.offline) return; this.sent.push([x, y, this.clock]); return true; }\n' +
        spectMethods.map((m) => m[1]).join('\n') + '\n};', c);
    const dr = c.drawRender;
    dr.ctx = ctx2d; dr.canvasWidth = 1600; dr.canvasHeight = 900; dr.scale = o.scale || 0.5;
    return { c, LM, dr, win, boxes, spect(p) { const sp = vm.runInContext('(p) => new SpectXY(p)', c)(p); win.spects.push(sp); return sp; },
        frame() { boxes.length = 0; dr.calMinMax(); dr.drawViewPorts(ctx2d); return boxes.slice(); } };
}
/* food spread +-r around (cx, cy), owned by connection `spectator` (0 = main) */
function food(list, cx, cy, r, spectator) {
    for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) list.push({ x: cx - r + i * r / 5, y: cy - r + j * r / 5, spectator });
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
    const s = Math.pow(64 / 100, 0.4), w = 1024 * 1.985 / s;
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
    const b2 = byLabel(bs, '2'), v2 = byLabel(bs, 'Viewport# 2');
    check('box 2 is the unit\'s food only', b2 && b2.minX === 2000 - 1500 - 15 && b2.maxY === 1000 + 1500 + 15, b2 && [b2.minX, b2.maxY]);
    check('the spectator has its own food box', v2 && v2.minX === -4500 - 2400 - 15);
    check('no full-spectator box around the unit', !byLabel(bs, 'Viewport# 1'));
    e.win.multiboxPlayerEnabled = null;
    e.LM.camMinMultiX = e.LM.camMaxMultiX = e.LM.camMinMultiY = e.LM.camMaxMultiY = NaN;
    e.LM.playerCellsMulti = [{}];
    e.dr.calMinMaxMulti();
    check('calMinMaxMulti: the units\' food only, padded on both sides', e.LM.camMinMultiX === 2000 - 1500 - 15 && e.LM.camMaxMultiX === 2000 + 1500 + 15 && e.LM.camMinMultiY === 1000 - 1500 - 15,
        [e.LM.camMinMultiX, e.LM.camMaxMultiX, e.LM.camMinMultiY]);
}

/* ---- Full Map ---- */
const spectAt = (number, sx, sy, o) => Object.assign({ number, player: false, staticX: sx, staticY: sy, isSpectateEnabled: true, isFreeSpectate: true,
    mapOffsetFixed: false, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0, _lmCamAt: 0 }, o || {});
/* 6. the grid: 15 connections on agar.io; union covers the whole map, seams overlap, centred */
{
    const e = env({ full: true, mb: false });
    const view = e.c.lmServerViewSize();
    check('free spectator view estimate: 1024 x 600 x 4.95', Math.abs(view[0] - 1024 * 4.95) < 1e-6 && Math.abs(view[1] - 600 * 4.95) < 1e-6, view);
    const covers = (plan, vw, vh, half) => {
        for (let x = -half; x <= half; x += 37) for (let y = -half; y <= half; y += 37) {
            if (!plan.tiles.some((t) => Math.abs(x - t.x) <= vw / 2 && Math.abs(y - t.y) <= vh / 2)) return [x, y];
        }
        return null;
    };
    const plan = e.c.lmFullMapPlan(14142, 14142, view[0], view[1], 15);
    check('agar.io map: 3 x 5 = 15 connections (no more than before)', plan && plan.cols === 3 && plan.rows === 5 && plan.tiles.length === 15, plan && [plan.cols, plan.rows]);
    check('the tiles cover the whole map', plan && covers(plan, view[0], view[1], 7071) === null, plan && covers(plan, view[0], view[1], 7071));
    check('every seam overlaps by at least 120', plan && view[0] - plan.stepX >= 120 && view[1] - plan.stepY >= 120, plan && [view[0] - plan.stepX, view[1] - plan.stepY]);
    check('outer tiles reach at least 60 past the map edge on every side', plan && Math.min(...plan.tiles.map((t) => t.x - view[0] / 2)) <= -7131 &&
        Math.max(...plan.tiles.map((t) => t.x + view[0] / 2)) >= 7131 && Math.min(...plan.tiles.map((t) => t.y - view[1] / 2)) <= -7131 && Math.max(...plan.tiles.map((t) => t.y + view[1] / 2)) >= 7131);
    check('the grid is centred: a mirrored tile is another tile', plan && plan.tiles.every((t) => plan.tiles.some((u) => Math.abs(u.x + t.x) < 1e-6 && Math.abs(u.y + t.y) < 1e-6)));
    /* a view 4% smaller than the estimate (MultiOgar's 5050 x 2950 is 0.7% smaller) is still covered */
    check('a 4% smaller real view still covers the map', plan && covers(plan, view[0] * 0.96, view[1] * 0.96, 7071) === null);
    check('a slightly bigger map than 14142 still gets 15 (plain cover inside the budget)', (e.c.lmFullMapPlan(14300, 14300, view[0], view[1], 15) || {}).tiles.length === 15);
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
/* 8. sending: nothing before the borders, at once, every 50 ms on the way, once a second when there */
{
    const e = env({ full: true, mb: false });
    const s = e.spect(spectAt(1, 0, -5657));
    s.clock = 1000; s._lmTileSentAt = 0; s._lmTileSentX = s._lmTileSentY = NaN;
    s._lmTileTick(1000);
    check('no send before this connection\'s border is fixed (it went out unconverted)', s.sent.length === 0);
    s.mapOffsetFixed = true;
    s._lmTileTick(1000);
    check('sent at once when the border is known', s.sent.length === 1 && s.sent[0][1] === -5657, JSON.stringify(s.sent));
    s._lmTileTick(1020);
    check('not again within 50 ms', s.sent.length === 1);
    s._lmTileTick(1050);
    check('every 50 ms while the camera is on its way', s.sent.length === 2);
    s.viewX = 3; s.viewY = -5600; s._lmCamAt = 1060; /* opcode 17: the camera is there */
    for (let t = 1100; t < 2050; t += 50) s._lmTileTick(t);
    check('camera on the tile: no resend for a second', s.sent.length === 2, s.sent.length);
    s._lmTileTick(2050);
    check('camera on the tile: refreshed after a second', s.sent.length === 3, s.sent.length);
    s._lmCamAt = 2060; s.viewX = 900; /* drifted off */
    s._lmTileTick(2100);
    check('camera drifted: back to 50 ms', s.sent.length === 4);
    s._lmCamAt = 2110; s.viewX = 0;
    s.fixY = -1; /* orientation found: the raw target changes */
    s._lmTileTick(2120);
    check('a changed raw target goes out at once', s.sent.length === 5 && s.sent[4][1] === 5657, JSON.stringify(s.sent[4]));
    s.offline = true; s._lmTileTick(2400); s.offline = false;
    s._lmTileTick(2410);
    check('a send the socket refused is retried', s.sent.length === 6);
}
/* 9. spectator boxes: none while connecting, then around the server camera; the tile box */
{
    const e = env({ full: true, mb: false });
    const s = e.spect(spectAt(1, -4714, -5657));
    const first = e.frame();
    check('connecting spectator: no viewport box', !first.some((b) => /^Viewport#/.test(b.label)), JSON.stringify(first.map((b) => b.label)));
    check('its planned tile is drawn', !!byLabel(first, 'Tile 1'));
    s.mapOffsetFixed = true; s.viewX = 400; s.viewY = -6000;
    check('a camera from the border centre only (no opcode 17): no box yet', !byLabel(e.frame(), 'Viewport# 1 est.'));
    s._lmCamAt = 1; s.scale = 0;
    const est = byLabel(e.frame(), 'Viewport# 1 est.');
    check('camera known: estimated box around it, labelled est.', est && Math.abs((est.minX + est.maxX) / 2 - 400) < 1e-6 && Math.abs(est.maxX - est.minX - 1024 * 4.95) < 1e-6, est && [est.minX, est.maxX]);
    e.dr.scale = 0.03; e.dr.canvasWidth = 5000;
    check('estimated box unchanged by zoom and window size', same(byLabel(e.frame(), 'Viewport# 1 est.'), est));
    const tile = byLabel(e.frame(), 'Tile 1');
    check('tile box at the tile centre with the planned size', tile && Math.abs((tile.minX + tile.maxX) / 2 + 4714) < 1e-6 && Math.abs(tile.maxX - tile.minX - 1024 * 4.95) < 1e-6);
    e.LM.vector = [[true, true]];
    const rt = byLabel(e.frame(), 'Tile 1');
    check('Rotate Map: tile box mirrored with the map', rt && Math.abs((rt.minX + rt.maxX) / 2 - 4714) < 1e-6);
}

console.log(failed ? 'FAILED ' + failed : 'all debugviewports checks passed');
process.exit(failed ? 1 : 0);
