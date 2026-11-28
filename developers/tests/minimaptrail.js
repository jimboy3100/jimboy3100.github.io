/* Minimap trail (Settings > Minimap, showMiniMapTrail) with the real code of ogario/ogario.v4.js:
 * the setting (off by default, a boolean, in the Minimap group under Show minimap), the drawing of
 * the last ~60 s of the own path on the minimap and its reset (not playing, map size change, jump,
 * switched off); with multibox units: the trail is P1's path in P1's colour, and a dot for P1 and
 * each placed unit in its slot colour (lmMbMiniMapMarkers), the controlled one marked.
 * node developers/tests/minimaptrail.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* the setting: default, value check */
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
const D = ctx.LM_SETTINGS_DEFAULTS, V = ctx.lmSettingValue;
check('showMiniMapTrail is a setting, off by default', D.showMiniMapTrail === false);
check('a saved value is read (true / "true" kept, other types refused)', V('showMiniMapTrail', true) === true && V('showMiniMapTrail', 'true') === true && V('showMiniMapTrail', 5) === undefined);
check('its switch is in Settings > Minimap', /this\.addOptions\(\[[^\]]*"showMiniMapTrail"[^\]]*\], "miniMapGroup"\)/.test(main));
check('it depends on Show minimap', /showMiniMap: \[[^\]]*'showMiniMapTrail'/.test(main));

/* the drawing block of the minimap draw (r, l: map offset, n: scale) */
const drawSrc = cut('/* optional own trail: a point every 500 ms', '/* multibox: a dot for each of our players');
const draw = new Function('defaultmapsettings', 'defaultSettings', 'ogario', 'LM', 'Date', 'r', 'l', 'n', 'LM_MB_RING_DEFAULT_COLORS', drawSrc);
const COLORS = vm.runInNewContext(cut('var LM_MB_RING_DEFAULT_COLORS', 'var LM_MB_RING_SIZE') + '; LM_MB_RING_DEFAULT_COLORS');
function makeCtx() {
  const ops = [];
  return {
    ops, save() { ops.push('save'); }, restore() { ops.push('restore'); }, beginPath() { ops.push('begin'); },
    moveTo(x, y) { ops.push(['M', x, y]); }, lineTo(x, y) { ops.push(['L', x, y]); }, stroke() { ops.push(['stroke', this.strokeStyle, this.globalAlpha]); }
  };
}
let now = 100000;
const clock = { now: () => now };
const app = { miniMapCtx: makeCtx() };
const set = { showMiniMapTrail: true };
const theme = { miniMapMyCellColor: '#abcdef' };
const og = { play: true, playerX: 0, playerY: 0 };
const LM = { mapSize: 14142 };
const frame = () => draw.call(app, set, theme, og, LM, clock, 7071, 7071, 0.01);

frame();
check('the first frame on a map only notes the map size', app._lmTrail.length === 0 && app._lmTrailMap === 14142);
frame();
check('first point stored, nothing drawn from a single point', app._lmTrail.length === 1 && !app.miniMapCtx.ops.some(o => o[0] === 'stroke'));
for (let i = 1; i <= 5; i++) { now += 500; og.playerX = i * 100; frame(); }
check('a point every 500 ms', app._lmTrail.length === 6);
now += 100; og.playerX = 650; app.miniMapCtx = makeCtx(); frame();
check('no point between the 500 ms steps', app._lmTrail.length === 6);
const ops = app.miniMapCtx.ops, st = ops.find(o => o[0] === 'stroke'), lines = ops.filter(o => o[0] === 'L');
check('the path is drawn in the own dot colour, half transparent', st && st[1] === '#abcdef' && st[2] === 0.45 && ops[0] === 'save' && ops[ops.length - 1] === 'restore');
check('the line starts at the oldest point and ends at the player', ops.find(o => o[0] === 'M')[1] === (0 + 7071) * 0.01 && Math.abs(lines[lines.length - 1][1] - (650 + 7071) * 0.01) < 1e-9);
for (let i = 0; i < 200; i++) { now += 500; og.playerX = 650 + i; frame(); }
check('at most 120 points (~60 s)', app._lmTrail.length === 120);

now += 500; og.playerX = 650 + 200 + 5000; frame();
check('a jump (respawn, multibox swap) starts a new trail', app._lmTrail.length === 1);
og.play = false; frame();
check('cleared when not playing (death, spectating)', app._lmTrail.length === 0);
og.play = true; now += 500; frame(); now += 500; og.playerX += 10; frame();
LM.mapSize = 7000; frame();
check('cleared on a map size change (other server)', app._lmTrail.length === 0);
set.showMiniMapTrail = false; app.miniMapCtx = makeCtx(); now += 500; frame();
check('off: nothing stored or drawn', app._lmTrail.length === 0 && app.miniMapCtx.ops.length === 0);

/* switching it off empties the stored path (the case of setSettings) */
const caseSrc = cut("case 'showMiniMapTrail':", 'break;');
const onSet = new Function('id', 'checked', 'switch (id) { ' + caseSrc + 'break; }');
const app2 = { _lmTrail: [{ x: 1, y: 1 }, { x: 2, y: 2 }] };
onSet.call(app2, 'showMiniMapTrail', true);
const keptOn = app2._lmTrail.length === 2;
onSet.call(app2, 'showMiniMapTrail', false);
check('switched off: the stored path is emptied (kept while on)', keptOn && app2._lmTrail.length === 0);

/* multibox: the trail is P1's own path (the camera may be on a unit or between the players) */
{
    set.showMiniMapTrail = true;
    const lmM = { mapSize: 14142, multiBoxPlayerExists: true };
    const o = { play: true, playerX: 3000, playerY: 3000, playerCells: [{ x: 100, y: 0, size: 50 }], viewXTrue: 100, viewYTrue: 0 };
    const app3 = { miniMapCtx: makeCtx() };
    const f3 = () => draw.call(app3, set, theme, o, lmM, clock, 7071, 7071, 0.01, COLORS);
    f3();
    for (let i = 1; i <= 4; i++) { now += 500; o.viewXTrue = 100 + i * 50; f3(); }
    check('multibox: the trail follows P1 (not the camera centre)', app3._lmTrail.length === 4 && app3._lmTrail.every((p, i) => p.x === 150 + i * 50 && p.y === 0));
    now += 500; o.playerX = -6000; o.viewXTrue = 400; app3.miniMapCtx = makeCtx(); f3();
    const st3 = app3.miniMapCtx.ops.find((x) => x[0] === 'stroke'), ln3 = app3.miniMapCtx.ops.filter((x) => x[0] === 'L');
    check('multibox: the camera jumping to a unit far away keeps the trail', app3._lmTrail.length === 5);
    check('multibox: the trail is drawn in P1\'s colour and ends at P1', st3 && st3[1] === COLORS[1] && Math.abs(ln3[ln3.length - 1][1] - (400 + 7071) * 0.01) < 1e-9);
    o.play = false; o.playerCells = []; f3();
    check('multibox: P1 dead: its trail is cleared as before', app3._lmTrail.length === 0);
}

/* multibox: a dot for each of our players (lmMbMiniMapMarkers) with the real camera helpers */
{
    const mctx = { console, Math, Number, Infinity, NaN, isFinite };
    mctx.window = mctx;
    vm.createContext(mctx);
    vm.runInContext(cut('var LM_MB_RING_DEFAULT_COLORS', 'var LM_MB_RING_SIZE'), mctx);
    vm.runInContext(cut('var LM_MB_CAMERA_NEAR = ', '/* OgVer set above'), mctx);
    vm.runInContext('var spects = []; function getActiveSpect(n) { for (var i = 0; i < spects.length; i++) if (spects[i] && spects[i].number === n && spects[i].player !== false) return spects[i]; return null; }', mctx);
    const lm = { multiBoxPlayerExists: true, play: true, playerCells: [{ x: 10, y: 20, size: 40 }], viewXTrue: 10, viewYTrue: 20 };
    mctx.legendmod = lm;
    const unit = (number, x, y, o) => Object.assign({ number, player: true, active: true, playerCellIDs: [1], playerX: x, playerY: y, playerSize: 30,
        transformReady: () => true, getOwnPlayerCells() { return this.playerCellIDs.length ? [{ x, y, size: 30 }] : []; } }, o || {});
    /* unit numbers 5, 2, 18 (slots: 2 -> P2, 5 -> P3, 18 -> P4), 7 a Full Map spectator with cells */
    mctx.spects.push(unit(5, 500, 600), unit(18, 900, 900, { playerCellIDs: [] }), { number: 7, player: false, active: true, playerCellIDs: [1], playerX: -500, playerY: 0, getOwnPlayerCells: () => [{ x: -500, y: 0, size: 30 }] }, unit(2, 200, 300));
    const th = { miniMapMyCellSize: 5, miniMapMyCellStrokeSize: 2, miniMapMyCellStrokeColor: '#ffffff', miniMapMyCellColor: '#abcdef' };
    const dots = () => {
        const ops = [];
        let cur = null;
        const c = {
            beginPath() { cur = { stroke: false }; }, closePath() { }, arc(x, y, rad) { cur.x = x; cur.y = y; cur.r = rad; },
            stroke() { cur.stroke = this.strokeStyle; }, fill() { cur.fill = this.fillStyle; ops.push(cur); }
        };
        const drawn = mctx.lmMbMiniMapMarkers(c, 7071, 7071, 0.01, th);
        return { drawn, ops };
    };
    const at = (x) => (x + 7071) * 0.01;
    mctx.multiboxPlayerEnabled = 5;
    let d = dots();
    const byX = (x) => d.ops.filter((o) => Math.abs(o.x - at(x)) < 1e-9);
    check('multibox: one dot for P1 and for each placed unit (no dead unit, no spectator)', d.drawn && d.ops.length === 3 && byX(10).length === 1 && byX(200).length === 1 && byX(500).length === 1);
    check('multibox: each dot in its slot colour (P1 #FF2FD6, unit 2 = P2 #00E5FF, unit 5 = P3 #A855F7)', byX(10)[0].fill === '#FF2FD6' && byX(200)[0].fill === '#00E5FF' && byX(500)[0].fill === '#A855F7');
    check('multibox: the player you control drawn last, full size with the own dot\'s stroke; the others smaller', d.ops[2] === byX(500)[0] && d.ops[2].r === 5 && d.ops[2].stroke === '#ffffff' && byX(10)[0].r === 3.75 && !byX(10)[0].stroke && !byX(200)[0].stroke);
    check('multibox: the palette has six slot colours', ['#FF2FD6', '#00E5FF', '#A855F7', '#10B981', '#FFB020', '#FF5A36'].every((c, i) => mctx.LM_MB_RING_DEFAULT_COLORS[i + 1] === c));
    mctx.multiboxPlayerEnabled = null;
    d = dots();
    check('multibox, P1 controlled: P1 is the full-size dot', d.ops.length === 3 && d.ops[2].fill === '#FF2FD6' && d.ops[2].r === 5);
    lm.playerCells = []; lm.play = false;
    d = dots();
    check('multibox, P1 dead: the units keep their dots', d.drawn && d.ops.length === 2 && d.ops.every((o) => o.fill !== '#FF2FD6'));
    mctx.spects.length = 0;
    d = dots();
    check('nobody placed: nothing drawn, the own dot is drawn as before', !d.drawn && d.ops.length === 0);
    lm.multiBoxPlayerExists = false; lm.playerCells = [{ x: 1, y: 1, size: 9 }];
    d = dots();
    check('no multibox: nothing drawn here (the own dot as before)', !d.drawn && d.ops.length === 0);
    const dotSrc = cut('/* multibox: a dot for each of our players', 'if (this.teamPlayers.length) {');
    check('the minimap draws the own dot only when no multibox dot was drawn', /if \(!lmMbMiniMapMarkers\(this\.miniMapCtx, r, l, n, defaultSettings\)\) \{/.test(dotSrc));
}

console.log(fail ? fail + ' minimap trail check(s) FAILED' : 'all minimap trail checks passed');
process.exit(fail ? 1 : 0);
