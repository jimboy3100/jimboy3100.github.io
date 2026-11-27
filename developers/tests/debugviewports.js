/* "Show viewports" (debug, top bar set-debug): the numbered boxes 1 (the main connection's server
 * view) and 2, 3 ... (each multibox unit's), with the real code cut out of ogario/ogario.v4.js:
 * drawViewPorts, _lmUnitFoodBox, calMinMax and drawViewport (drawn on a recording context).
 * Cases: a unit's box is its own server view (the food its connection received) and does not
 * change with the main camera's zoom, so World Spectate (zoomed out over the whole map) no longer
 * blows boxes 2, 3 up past the map; food of another unit or of the main connection is not counted;
 * a unit without food keeps the old screen-sized box; box 1 is gone once the food is (disconnect,
 * server switch) instead of staying at the last server's place; box 1 ignores the units' food.
 * Full Map (full spectator, newViewport with spect.js's getX/getY): spectators still connecting
 * get their boxes once their views arrive; a box at the map's edge stays inside the map with a
 * connection's own map offset and with Rotate Map; a multibox unit gets no full-spectator box.
 * node developers/tests/debugviewports.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
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
const methods = ['        drawViewPorts(ctx) {', '        _lmUnitFoodBox(sp) {', '        calMinMax() {', '        newViewport(ctx, name'].map((m) => [m, block(m)]);
/* a spectator connection's own coordinate conversion (ogario/spect.js) */
const spectSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
const spectGetXY = ['    getX(x) {', '    getY(y) {'].map((m) => block(m, 0, spectSrc));
/* drawViewport is written "drawViewport: function (...)" */
const dv = block('        drawViewport: function (ctx, text');
methods.forEach((m) => { if (!m[1] && m[0].indexOf('_lm') >= 0) m[1] = '        _lmUnitFoodBox() { return null; }'; });
const missing = methods.filter((m) => !m[1]).map((m) => m[0].trim()).concat(dv ? [] : ['drawViewport'])
    .concat(spectGetXY.every(Boolean) ? [] : ['spect.js getX/getY']);
if (missing.length) { console.log('FAIL code not found: ' + missing.join(', ')); process.exit(1); }

function env(o) {
    const LM = { food: [], foodMulti: [], viewXTrue: 0, viewYTrue: 0, multiBoxPlayerExists: o.mb !== false,
        mapMinX: -7071, mapMinY: -7071, mapMaxX: 7071, mapMaxY: 7071, mapOffsetX: 0, mapOffsetY: 0, vector: o.vector || null, vnr: 0 };
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
    vm.runInContext('var drawRender = {' + methods.map((m) => m[1]).concat([dv]).join(',\n') + '};' +
        /* a spectator connection with spect.js's own getX / getY */
        'var SpectXY = class { constructor(p) { Object.assign(this, p); }\n' + spectGetXY.join('\n') + '\n};', c);
    const dr = c.drawRender;
    dr.ctx = ctx2d; dr.canvasWidth = 1600; dr.canvasHeight = 900; dr.scale = o.scale || 0.5;
    return { LM, dr, boxes, spect(p) { const sp = vm.runInContext('(p) => new SpectXY(p)', c)(p); win.spects.push(sp); return sp; }, frame() { boxes.length = 0; dr.calMinMax(); dr.drawViewPorts(ctx2d); return boxes.slice(); } };
}
/* food spread +-r around (cx, cy), owned by connection `spectator` (0 = main) */
function food(list, cx, cy, r, spectator) {
    for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) list.push({ x: cx - r + i * r / 5, y: cy - r + j * r / 5, spectator });
}
const unit = (number, x, y) => ({ number, player: true, playerCellIDs: [number * 1e9 + 1], playerX: x, playerY: y });
const byLabel = (bs, l) => bs.find((b) => b.label === l);
const MAP = 15957;

/* 1. normal view and World Spectate zoom: unit boxes stay the units' server views */
{
    const u1 = unit(1, 4000, 3000), u2 = unit(2, -6000, -2000);
    const e = env({ spects: [u1, u2], scale: 0.5 });
    food(e.LM.food, 0, 0, 2500, 0);
    food(e.LM.foodMulti, 4000, 3000, 2000, 1);
    food(e.LM.foodMulti, -6000, -2000, 1500, 2);
    const normal = e.frame();
    const b2 = byLabel(normal, '2'), b3 = byLabel(normal, '3');
    check('normal view: box 2 is unit 1\'s food box', b2 && Math.round(b2.minX) === 4000 - 2000 - 15 && Math.round(b2.maxX) === 4000 + 2000 - 15, b2 && [b2.minX, b2.maxX]);
    check('normal view: box 3 is unit 2\'s food box (not unit 1\'s food)', b3 && Math.round(b3.minX) === -6000 - 1500 - 15 && Math.round(b3.maxY) === -2000 + 1500 - 15, b3 && [b3.minX, b3.maxY]);
    e.dr.scale = 0.02; /* World Spectate zoomed out over the whole map */
    const world = e.frame();
    const w2 = byLabel(world, '2'), w3 = byLabel(world, '3');
    check('World Spectate: box 2 unchanged by the zoom', w2 && w2.minX === b2.minX && w2.maxX === b2.maxX && w2.minY === b2.minY && w2.maxY === b2.maxY, w2 && [w2.minX, w2.maxX]);
    check('World Spectate: box 3 unchanged by the zoom', w3 && w3.minX === b3.minX && w3.maxY === b3.maxY);
    check('World Spectate: unit boxes inside the map', [w2, w3].every((b) => b && b.minX > -MAP && b.maxX < MAP && b.minY > -MAP && b.maxY < MAP),
        w2 && [w2.minX, w2.maxX, w2.minY, w2.maxY]);
    const w1 = byLabel(world, '1');
    check('box 1 is the main connection\'s food only', w1 && Math.round(w1.minX) === -2515 && Math.round(w1.maxX) === 2485, w1 && [w1.minX, w1.maxX]);
}
/* 2. a unit whose connection has no food yet keeps the old box (main screen size around it) */
{
    const u1 = unit(1, 1000, 500);
    const e = env({ spects: [u1], scale: 0.5 });
    food(e.LM.food, 0, 0, 2500, 0);
    const b = byLabel(e.frame(), '2');
    check('unit without food: screen-sized box around it', b && b.minX === 1000 - 1600 && b.maxX === 1000 + 1600 && b.minY === 500 - 900, b && [b.minX, b.maxX, b.minY]);
}
/* 3. no stale box 1 after the food is gone (disconnect, server switch) */
{
    const e = env({ spects: [], scale: 0.5 });
    food(e.LM.food, 9000, 9000, 2000, 0);
    check('box 1 drawn while there is food', !!byLabel(e.frame(), '1'));
    e.LM.food = [];
    check('no food: box 1 not drawn at the old server view', !byLabel(e.frame(), '1'));
    e.LM.viewXTrue = -3000; /* the food box starts at the main view, like the camera */
    food(e.LM.food, -3000, 0, 1000, 0);
    const b = byLabel(e.frame(), '1');
    check('new server food: box 1 at the new view', b && Math.round(b.maxX) === -2015, b && b.maxX);
}

/* Full Map (full spectator, agar.io): one box "Viewport# n" per spectator connection, around its
 * server camera (getX/getY of its view), held inside the map near its grid point (staticX/Y). */
const finite = (b) => b && [b.minX, b.maxX, b.minY, b.maxY].every(Number.isFinite);
const spectAt = (number, sx, sy) => ({ number, player: false, staticX: sx, staticY: sy, isSpectateEnabled: false, isFreeSpectate: false,
    mapOffsetFixed: false, mapOffsetX: 0, mapOffsetY: 0, fixX: 1, fixY: 1, fix3x: 0, fix3y: 0 });
/* 4. Full Map opened with Show viewports on: the spectators are still connecting (no view yet) */
{
    const e = env({ full: true, mb: false });
    const s1 = e.spect(spectAt(1, -4671, -6071)), s2 = e.spect(spectAt(2, 400, -6071));
    const first = e.frame();
    check('connecting spectators: no box with an unknown place', first.every(finite), JSON.stringify(first));
    [s1, s2].forEach((s) => { s.mapOffsetFixed = true; s.viewX = s.staticX; s.viewY = s.staticY; });
    e.frame();
    const later = e.frame();
    const v1 = byLabel(later, 'Viewport# 1'), v2 = byLabel(later, 'Viewport# 2');
    check('once their views arrive: both spectators have their box', finite(v1) && finite(v2), JSON.stringify(later));
    check('the box is around the spectator\'s view', v2 && Math.abs((v2.minX + v2.maxX) / 2 - 400) < 1, v2 && [v2.minX, v2.maxX]);
}
/* 5. the spectator's own map offset differs from the main connection's (agar.io gives every
 *    connection its own), and with Rotate Map: its box at the map edge still stays inside the map */
for (const c of [{ name: 'own map offset', off: [3000, -2000], vector: null }, { name: 'Rotate Map', off: [0, 0], vector: [[true, true]] }]) {
    const e = env({ full: true, mb: false, vector: c.vector });
    const s = e.spect(spectAt(1, -4671, -6071));
    s.mapOffsetFixed = true; s.mapOffsetX = c.off[0]; s.mapOffsetY = c.off[1];
    /* the server view that getX/getY place exactly at the grid point */
    const flip = (v, min, max) => max - (v - min);
    const mx = c.vector ? flip(-4671, -7071, 7071) : -4671, my = c.vector ? flip(-6071, -7071, 7071) : -6071;
    s.viewX = mx - c.off[0]; s.viewY = my - c.off[1];
    check(c.name + ': the spectator\'s view is at its grid point', Math.abs(s.getX(s.viewX) + 4671) < 1e-6 && Math.abs(s.getY(s.viewY) + 6071) < 1e-6);
    const b = byLabel(e.frame(), 'Viewport# 1');
    check(c.name + ': box held inside the map', b && b.minX >= -7071 - 1e-6 && b.maxY <= 7071 + 1e-6 && Math.min(b.minY, b.maxY) >= -7071 - 1e-6,
        b && [b.minX, b.minY, b.maxX, b.maxY].map(Math.round));
}
/* 6. a multibox unit with Full Map open: its box is its numbered one ("2"), no full-spectator box */
{
    const e = env({ full: true });
    const u = e.spect(Object.assign(spectAt(1, null, null), unit(1, 2000, 1000), { mapOffsetFixed: true, viewX: 2000, viewY: 1000 }));
    food(e.LM.foodMulti, 2000, 1000, 1500, 1);
    const s = e.spect(spectAt(2, -4671, -6071));
    s.mapOffsetFixed = true; s.viewX = -4671; s.viewY = -6071;
    const bs = e.frame();
    check('unit: its box 2 is drawn', !!byLabel(bs, '2'), JSON.stringify(bs.map((b) => b.label)));
    check('unit: no full-spectator box around the unit', !byLabel(bs, 'Viewport# 1'), JSON.stringify(bs.map((b) => b.label)));
    check('spectator next to the unit keeps its box', finite(byLabel(bs, 'Viewport# 2')));
    void u;
}

console.log(failed ? 'FAILED ' + failed : 'all debugviewports checks passed');
process.exit(failed ? 1 : 0);
