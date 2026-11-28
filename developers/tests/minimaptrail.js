/* Minimap trail (Settings > Minimap, showMiniMapTrail) with the real code of ogario/ogario.v4.js:
 * the setting (off by default, a boolean, in the Minimap group under Show minimap), the drawing of
 * the last ~60 s of the own path on the minimap and its reset (not playing, map size change, jump,
 * switched off).
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
const drawSrc = cut('/* optional own trail: a point every 500 ms', 'if (this.miniMapCtx.beginPath(),');
const draw = new Function('defaultmapsettings', 'defaultSettings', 'ogario', 'LM', 'Date', 'r', 'l', 'n', drawSrc);
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

console.log(fail ? fail + ' minimap trail check(s) FAILED' : 'all minimap trail checks passed');
process.exit(fail ? 1 : 0);
