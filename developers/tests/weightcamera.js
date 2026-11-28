/* Camera on the centre of mass (Settings > Zoom, centerWeightCamera) with the real code of
 * ogario/ogario.v4.js: the setting (off by default, a boolean, in the Zoom group), the camera
 * (calculatePlayerMassAndPosition + setView: off = plain average of the own cells, on = the
 * mass-weighted centre, reached with the usual glide), the sent cursor (getCursorPosition: the
 * world point under the mouse on the drawn screen, alone and with a multibox unit), spectating.
 * node developers/tests/weightcamera.js [other ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* the setting: default, value check, menu group */
const sctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
sctx.window = sctx;
sctx.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
vm.createContext(sctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), sctx);
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), sctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), sctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), sctx);
const D = sctx.LM_SETTINGS_DEFAULTS, V = sctx.lmSettingValue;
check('centerWeightCamera is a setting, off by default', D.centerWeightCamera === false);
check('a saved value is read (true / "true" kept, other types refused)', V('centerWeightCamera', true) === true && V('centerWeightCamera', 'true') === true && V('centerWeightCamera', 5) === undefined);
check('its switch is in Settings > Zoom', /this\.addOptions\(\[[^\]]*"centerWeightCamera"[^\]]*\], "zoomGroup"\)/.test(main));

/* the camera and the cursor: the real methods, with the multibox helpers */
const ctx = { console, Math, Number, Infinity, NaN, isFinite, performance: { now: () => t } };
let t = 1000;
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cut('var LM_MB_CAMERA_NEAR = ', '/* OgVer set above'), ctx);
vm.runInContext('var playersLength = 0, spects = [], defaultmapsettings = {}; function getActiveSpect(n) { return spects[n - 1] || null; }', ctx);
ctx.LMEvents = { _has: () => false };
const LM = vm.runInContext('({\n' + cut('        calculatePlayerMassAndPosition() {', '        recalculatePlayerMass() {') +
  cut('        getCursorPosition() {', '        getLineSplitSettings() {') + '\n})', ctx);
Object.assign(LM, { recalculatePlayerMass() { }, play: true, playerCells: [], canvasWidth: 1920, canvasHeight: 1080, viewScale: 0.5, autoZoom: false, zoomValue: 1, scale: 1, serverType: 'agario' });
const R = vm.runInContext('({\n' + cut('        _lmSpectCenter(sp) {', '        renderFrame() {') + '\n})', ctx);
Object.assign(R, { canvasWidth: 1920, canvasHeight: 1080, scale: 0.5 });
ctx.LM = ctx.legendmod = LM; ctx.drawRender = R;
const S = ctx.defaultmapsettings;
Object.assign(S, { cameraSmoothLerp: true, middleMultiView: false, middleMultiViewWhenClose: false });
const frame = () => { t += 16.667; R.setView(); LM.viewScale = R.scale; LM.getCursorPosition(); };
const run = n => { for (let i = 0; i < n; i++) frame(); };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1);

/* after a split: one big cell (size 400) and eight pieces (size 60) 1500 to the right */
const big = { x: 0, y: 0, size: 400, targetSize: 400 };
const pieces = Array.from({ length: 8 }, (_, i) => ({ x: 1500, y: (i - 3.5) * 130, size: 60, targetSize: 60 }));
LM.playerCells = [big].concat(pieces);
const avgX = 8 * 1500 / 9, wX = 8 * 3600 * 1500 / (160000 + 8 * 3600);
LM.clientX = 960 + 100; LM.clientY = 540; /* mouse 100 px right of the screen centre */

S.centerWeightCamera = false;
run(30);
check('off: the camera is on the plain average of the own cells, as before', near(R.camX, avgX) && near(R.camY, 0));
check('off: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));

S.centerWeightCamera = true;
const steps = [];
let last = R.camX;
for (let i = 0; i < 12; i++) { frame(); steps.push(last - R.camX); last = R.camX; }
check('on: the camera glides to the mass-weighted centre (no jump, every step smaller)', steps[0] < (avgX - wX) * 0.7 && steps.every((s, i) => s > 0 && (i === 0 || s < steps[i - 1])));
run(30);
check('on: the camera is on the mass-weighted centre (not the plain average: ' + Math.round(wX) + ' vs ' + Math.round(avgX) + ')', near(R.camX, wX) && near(R.camY, 0) && !near(wX, avgX, 500));
check('on: viewX keeps the plain average (minimap, sectors and multibox read it)', near(LM.viewX, avgX));
check('on: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));
LM.clientX = 960; LM.clientY = 540; frame();
check('on: the mouse at the screen centre sends the screen centre', near(LM.cursorX, R.camX) && near(LM.cursorY, R.camY));
LM.clientX = 1060;

/* a multibox unit alive far away, the main player controlled: the multibox frame keeps the camera */
const unitCells = [{ x: 9000, y: 9000, size: 200 }];
const unit = { player: true, playerCellIDs: [1], playerX: 9000, playerY: 9000, playerSize: 200, getOwnPlayerCells: () => unitCells, calculatePlayerMassAndPosition() { } };
ctx.spects.push(unit); LM.multiBoxPlayerExists = true; ctx.multiboxPlayerEnabled = 0;
run(40);
check('multibox, main controlled: the multibox frame keeps the camera (on the main player)', near(R.camX, avgX) && near(R.camY, 0));
check('multibox, main controlled: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));
ctx.multiboxPlayerEnabled = 1;
run(60);
check('multibox, unit controlled: the camera is on the unit and the cursor under the mouse', near(R.camX, 9000) && near(LM.cursorX, R.camX + 100 / R.scale));
check('multibox frame: setView writes no window.middleMultiViewFlag (nothing read it)', !('middleMultiViewFlag' in ctx));
ctx.spects.length = 0; LM.multiBoxPlayerExists = false; ctx.multiboxPlayerEnabled = 0;

/* spectating (not playing): the server's view centre, the option changes nothing */
run(30);
LM.play = false; LM.playerCells = []; LM.viewX = 3000; LM.viewY = -2000;
run(400);
check('spectating: the camera follows the view centre as before', near(R.camX, 3000, 5) && near(R.camY, -2000, 5));

console.log(fail ? 'FAILED ' + fail : 'all ok');
process.exit(fail ? 1 : 0);
