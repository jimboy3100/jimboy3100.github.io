/* Cell colours from the server to the screen, with real code cut out of ogario/ogario.v4.js.
 *
 * Node part: the real handleMessage / updateCells / flushCellsData run in a vm and are fed
 * agar.io world updates (opcode 16). A record without colour keeps the known colour, a new cell
 * without colour has none (the renderers draw their neutral fallback, never black), a later
 * colour is applied, server black (0,0,0) stays black, channels below 16 are padded, a cut
 * packet changes no colour. Multibox with the unit far away: the parser hides no main cell.
 *
 * Headless Chrome part (skipped without Chrome): the real window.drawRender (WebGL batch) and
 * the real cell.draw (Canvas2D), jelly on and off. A string that is no colour ('#f80ff',
 * '#NaNNaNNaN') is drawn with the same neutral fallback by both renderers (Canvas2D filled it
 * with its default black and cached that disc), real black stays black, a valid colour is
 * the same in both.
 * node developers/tests/cellcolors.js [ogario.v4.js] */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs'), vm = require('vm'), path = require('path'), os = require('os');
const { rendererFactory, findChrome } = require('./glbatch.js');

const root = path.join(__dirname, '..', '..');
/* [ogario.v4.js] [--no-chrome] */
const ARGS = process.argv.slice(2), NO_CHROME = ARGS.indexOf('--no-chrome') >= 0, FILE = ARGS.filter((a) => a.slice(0, 2) !== '--')[0];
const src = fs.readFileSync(FILE || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + JSON.stringify(info) + ']')); if (!ok) failed++; };
const cut = (from, to) => { const a = src.indexOf(from), b = src.indexOf(to, a); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };
function block(from) {
    const a = typeof from === 'number' ? from : src.indexOf(from);
    if (a < 0) return null;
    let i = src.indexOf('{', a), depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i], nx = src[i + 1];
        if (ch === '/' && nx === '/') { i = src.indexOf('\n', i); continue; }
        if (ch === '/' && nx === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { for (i++; src[i] !== ch; i++) if (src[i] === '\\') i++; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return src.slice(a, i + 1);
    }
    return null;
}

/* ---------------- node: the real packet parser ---------------- */
const hm = cut('        handleMessage(data) {\n', '        countPps() {');
const uc = cut(src.includes('        _lmCellIdentityScan(view, offset) {\n') ? '        _lmCellIdentityScan(view, offset) {\n' : '        updateCells(view, offset) {\n', '        sortCells() {');
const fl = cut('        flushCellsData(preserveMapGeometry) {\n', '        /* Spectator toggles');
const isEl = block('function _isExpandingLandClient(');
const helpers = cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool');
const lmc = block('\nfunction lmColorInt(');
if (!hm || !uc || !fl || !isEl || !helpers || !lmc) { console.log('FAIL game handler not found in ogario.v4.js'); process.exit(1); }

const noop = function () { };
const g = { console: { log: noop, warn: noop, error: (...a) => { g.errors.push(a.join(' ')); } }, errors: [], Math, Date, JSON, Object, Array, Map, Set, Number, String, Boolean, Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, Error, isFinite, escape, unescape, decodeURIComponent, encodeURIComponent, parseInt, parseFloat, Infinity, NaN, undefined, performance, setTimeout, clearTimeout };
g.window = g;
g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
g.buffer = { Buffer: function (ab) { return Buffer.from(ab); } };
g.defaultmapsettings = {};
g.$ = () => ({ val: () => '' });
g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0, selectedProfile: 0 }, { get: (t, k) => k in t ? t[k] : noop });
g.drawRender = new Proxy({}, { get: () => noop });
g.userBots = { startedBots: false };
g.profiles = [];
g.document = { createElement: () => ({ getContext: () => null }) };
g.ogarbasicassembly = function (id, x, y, size, color, isFood, isVirus) {
    Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, targetSize: size, isPlayerCell: false, targetNick: '', skin: null });
    this.removeCell = function () {
        this.removed = true;
        const L = g.LM;
        let i = L.cells.indexOf(this); if (i !== -1) L.cells.splice(i, 1);
        i = L.food.indexOf(this); if (i !== -1) L.food.splice(i, 1);
        delete L.indexedCells[this.id];
    };
};
vm.createContext(g);
vm.runInContext(helpers + '\n' + [...helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' ') + '\n' + isEl +
    '\nthis._isExpandingLandClient = _isExpandingLandClient;\nvar _lmColorIntCache = new Map(), _lmColorCtx = null;\n' + lmc + '\nthis.lmColorInt = lmColorInt;', g);
g.__h = null;
g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop });
vm.runInContext('with (__env) { __h = ({' + hm + ',\n' + uc + ',\n' + fl + '}); }', g);
const L = g.__h;
function reset(o) {
    Object.assign(L, {
        serverType: 'agario', isLegendWorld: false, connectionIntegrity: true, integrity: true, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
        cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: Object.create(null), playerCellsMulti: [],
        multiBoxPlayerExists: false, vector: [[0, 0]], vnr: 0, play: true, time: 0, mapEvent: {}, decayInfo: {}, _colorByRawMap: null,
        countPps: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushSpecsData: noop,
        _lmKeepMainSuppressed: () => false
    }, o || {});
    g.application.teamPlayers = [];
}
reset();
g.legendmod = g.LM = L;
/* agar.io opcode 16: u16 eats, records [u32 id, i32 x, i32 y, u16 size, u8 flags, (u8 ext), (rgb),
 * (skin\0), (name\0), (u32 account id if ext & 4)], u32 0, u16 removes */
function packet(recs) {
    const b = [], u8 = v => b.push(v & 255), u16 = v => { u8(v); u8(v >>> 8); }, u32 = v => { for (let i = 0; i < 4; i++) u8(v >>> (8 * i)); };
    const str = s => { for (const ch of Buffer.from(s, 'utf8')) u8(ch); u8(0); };
    u8(16); u16(0);
    recs.forEach(r => {
        const ext = (r.food ? 1 : 0) | (r.acc != null ? 4 : 0);
        const flags = (ext ? 0x80 : 0) | (r.virus ? 1 : 0) | (r.color ? 2 : 0) | (r.skin != null ? 4 : 0) | (r.name != null ? 8 : 0);
        u32(r.id); u32(r.x || 1000); u32(r.y || 1000); u16(r.size || 100); u8(flags);
        if (ext) u8(ext);
        if (r.color) r.color.forEach(u8);
        if (r.skin != null) str(r.skin);
        if (r.name != null) str(r.name);
        if (r.acc != null) u32(r.acc);
    });
    u32(0); u16(0);
    return new DataView(new Uint8Array(b).buffer);
}
const feed = recs => L.handleMessage(packet(recs));
const C = id => L.indexedCells[id] ? L.indexedCells[id].color : '(no cell)';
const hex = (r, gg, b) => '#' + [r, gg, b].map(v => (~~(0.9 * v)).toString(16).padStart(2, '0')).join('');

/* section: a record's colour is optional */
feed([{ id: 11, color: [255, 0, 0], name: 'Red', skin: '' }]);
check('a new cell takes its colour', C(11) === hex(255, 0, 0), C(11));
feed([{ id: 11, size: 110 }]);
check('an update without colour keeps it', C(11) === hex(255, 0, 0), C(11));
feed([{ id: 12, size: 90 }]);
check('a new cell without colour has none (not black)', C(12) === null, C(12));
feed([{ id: 12, color: [10, 200, 30], name: 'Late', skin: '' }]);
check('a later colour is applied', C(12) === hex(10, 200, 30), C(12));
feed([{ id: 13, color: [0, 0, 0], name: 'Coal', skin: '' }]);
check('server black (0,0,0) stays black', C(13) === '#000000', C(13));
feed([{ id: 14, color: [15, 128, 255], name: 'Pad', skin: '' }]);
check('channels below 16 are padded (15,128,255)', C(14) === hex(15, 128, 255) && /^#[0-9a-f]{6}$/.test(C(14)), C(14));
const pk = packet([{ id: 11, color: [0, 255, 0] }, { id: 15, color: [1, 2, 3], name: 'Cut', skin: '' }]);
L.handleMessage(new DataView(pk.buffer.slice(0, pk.byteLength - 12)));
check('a cut packet changes no colour', C(11) === hex(0, 255, 0) || C(11) === hex(255, 0, 0), C(11));
check('the cut record makes no half cell with a wrong colour', C(15) === '(no cell)' || C(15) === hex(1, 2, 3), C(15));

/* section: "My custom colour" turned off gives the own cells their server colour back */
reset();
g.profiles = [{ nick: 'Me', color: '#000000' }];
g.defaultmapsettings.myCustomColor = true;
L.playerCellIDs = [21, 22];
feed([{ id: 21, color: [200, 40, 40], name: 'Me', skin: '' }]);
check('own cell with my custom colour (black profile colour) is black', C(21) === '#000000', C(21));
g.defaultmapsettings.myCustomColor = false;
if (typeof L._lmOwnColorsRestore === 'function') L._lmOwnColorsRestore();
check('turned off: the own cell has its server colour again', C(21) === hex(200, 40, 40), C(21));
feed([{ id: 22, color: [200, 40, 40], name: 'Me', skin: '' }]);
check('turned off: a new own piece has the server colour too', C(22) === hex(200, 40, 40), C(22));
/* a spectator / multibox connection had remembered the own nick with the profile colour (spect.js) */
reset();
g.defaultmapsettings.myCustomColor = true;
L.playerCellIDs = [23, 24];
L.cellcolors.Me = '#000000';
feed([{ id: 23, color: [200, 40, 40], name: 'Me', skin: '' }]);
g.defaultmapsettings.myCustomColor = false;
if (typeof L._lmOwnColorsRestore === 'function') L._lmOwnColorsRestore();
feed([{ id: 24, color: [200, 40, 40], name: 'Me', skin: '' }]);
check('turned off after a spectator remembered the profile colour: server colour, also for a new piece', C(23) === hex(200, 40, 40) && C(24) === hex(200, 40, 40), [C(23), C(24)]);
g.profiles = [];

/* section: team colours (the Legend Mod relay) */
const mmc = block('\nfunction minimapCell(');
g.defaultSettings = { miniMapTeammatesColor: '#ffffff' };
vm.runInContext(mmc + '\nthis.minimapCell = minimapCell;', g);
const mate = (nick, col) => { const m = new g.minimapCell(1, nick, nick, ''); m.setColor(col, col); return m; };
reset();
g.application.teamPlayers = [mate('Plain', undefined), mate('Blue', '#3366ff'), mate('Ink', '#000000')];
feed([{ id: 31, color: [200, 40, 40], name: 'Plain', skin: '' }, { id: 32, color: [40, 200, 40], name: 'Blue', skin: '' }, { id: 33, color: [40, 40, 200], name: 'Ink', skin: '' }]);
check('a teammate that sent no colour keeps the server colour (the minimap white is not a cell colour)', C(31) === hex(200, 40, 40), C(31));
check('a teammate that sent a colour is drawn in it', C(32) === '#3366ff', C(32));
check('a teammate that sent black is black (an explicit colour)', C(33) === '#000000', C(33));
/* a stranger with the same server colour as the teammate: its nameless pieces keep their own */
feed([{ id: 34, color: [40, 200, 40], name: 'Stranger', skin: '' }]);
/* the teammate's cell again (a later record), then a nameless piece with that server colour */
feed([{ id: 32, color: [40, 200, 40], name: 'Blue' }]);
feed([{ id: 35, color: [40, 200, 40], size: 40 }]);
check('a stranger with the teammate\'s server colour keeps it', C(34) === hex(40, 200, 40), C(34));
check('a nameless piece of that server colour is not given the team colour', C(35) === hex(40, 200, 40), C(35));
reset();
g.application.teamPlayers = [mate('Blue', '#3366ff')];
feed([{ id: 36, color: [40, 200, 40], name: 'Blue', skin: '' }]);
feed([{ id: 37, color: [40, 200, 40], size: 40 }]);
check('a nameless piece of the teammate (no other nick with that colour) has the team colour', C(37) === '#3366ff', C(37));
/* the teammate and a stranger with one server colour both seen before the teammate's colour came
 * over the relay: the stranger's nameless piece cannot be told from the teammate's */
reset();
feed([{ id: 38, color: [40, 200, 40], name: 'Blue', skin: '' }, { id: 39, color: [40, 200, 40], name: 'Stranger', skin: '' }]);
g.application.teamPlayers = [mate('Blue', '#3366ff')];
feed([{ id: 38, color: [40, 200, 40], name: 'Blue' }]);
feed([{ id: 40, color: [40, 200, 40], size: 40 }]);
check('team colour came later: the teammate is drawn in it', C(38) === '#3366ff', C(38));
check('team colour came later: a nameless piece of a server colour two nicks have keeps it', C(40) === hex(40, 200, 40), C(40));
g.application.teamPlayers = [];

/* section: the colour remembered per nick belongs to one server */
reset();
feed([{ id: 41, color: [1, 1, 1], name: 'Bob', skin: '' }]);
feed([{ id: 42, color: [0, 200, 0], name: 'Bob', skin: '' }]);
check('one server: a nick keeps the colour first seen (all its cells one colour)', C(41) === '#000000' && C(42) === '#000000', [C(41), C(42)]);
L.flushCellsData(true);
feed([{ id: 43, color: [0, 200, 0], name: 'Bob', skin: '' }]);
check('respawn on that server: still the same colour', C(43) === '#000000', C(43));
L.flushCellsData();
feed([{ id: 44, color: [0, 200, 0], name: 'Bob', skin: '' }]);
check('the next server: the nick has its server colour, not the previous server\'s', C(44) === hex(0, 200, 0), C(44));

/* section: multibox on agar.io, the unit far from the main player. The parser hid every main
 * cell outside a box made of a screen at (0,0) and the unit's pellets (isInViewCustom3, while
 * playerCellsMulti had a cell): the main player's own cells and everything around them were not
 * drawn. A copy of a cell seen by both connections is hidden by the twin search, not here. */
{
    reset({ multiBoxPlayerExists: true, playerCellsMulti: [{ id: 1 }], camMinMultiX: -5115, camMinMultiY: -4295, camMaxMultiX: 960, camMaxMultiY: 540 });
    const old = block('        isInViewCustom3(');
    if (old) Object.assign(L, vm.runInContext('({' + old + '})', g));
    L.playerCellIDs = [61];
    feed([{ id: 61, x: 3000, y: 3000, color: [200, 40, 40], name: 'Me', skin: '' }, { id: 62, x: 3050, y: 3000, size: 10, food: true }, { id: 63, x: -2900, y: -3000, color: [9, 99, 199], name: 'Near unit', skin: '' }]);
    const shown = (id) => !!L.indexedCells[id] && L.indexedCells[id].invisible !== true;
    check('multibox, unit far away: the main player\'s own cell is drawn', shown(61), L.indexedCells[61] && L.indexedCells[61].invisible);
    check('multibox, unit far away: the pellet next to it is drawn', shown(62));
    check('multibox, unit far away: a main cell beside the unit is drawn', shown(63));
}

/* section: WebGL colour settings (ghost cells, bubbles): the real drawRender with a GL stub */
{
    const F0 = rendererFactory(src);
    const D0 = new Function('return ' + F0.defaults)();
    const env = { window: { navigator: {}, devicePixelRatio: 1, legendmod: {} }, LM: { gameMode: ':ffa' }, application: {}, defaultSettings: D0.defaultSettings,
        defaultmapsettings: D0.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
    const R0 = new Function('return (' + F0.factory.replace(/return R;\n\}$/, 'R.__lmColorInt = lmColorInt; return R;\n}') + ')')()(env);
    const gl = new Proxy({}, { get: (t, k) => (k in t ? t[k] : (typeof k === 'string' && /^[A-Z_0-9]+$/.test(k) ? 0 : noop)) });
    Object.assign(R0, { gl, glProgram: {}, glInstanceData: new Float32Array(70), glMaxInstances: 10, canvasWidth: 800, canvasHeight: 600, camX: 0, camY: 0, scale: 1 });
    R0.glBubbleData = new Float32Array(90);
    R0.glBubbleProgram = {};
    const rgbOf = (fn, col) => {
        R0.glInstanceData.fill(-1);
        R0.glBubbleData.fill(-1);
        const cell = [{ x: 0, y: 0, size: 50, targetX: 10, targetY: 0 }];
        if (fn === 'drawWebGLFilledBatch') R0.drawWebGLFilledBatch(cell, col, 1);
        else R0.drawWebGLBubbleBatchCursor(cell, 100, 0, col, 1);
        const at = fn === 'drawWebGLFilledBatch' ? [R0.glInstanceData, 3] : [R0.glBubbleData, 5];
        return Array.from(at[0].slice(at[1], at[1] + 3)).map((v) => Math.round(v * 255));
    };
    for (const fn of ['drawWebGLFilledBatch', 'drawWebGLBubbleBatchCursor']) {
        if (typeof R0[fn] !== 'function') continue;
        check(fn + ': a black colour setting is drawn black', JSON.stringify(rgbOf(fn, '#000000')) === '[0,0,0]', rgbOf(fn, '#000000'));
        check(fn + ': #3366ff is drawn #3366ff', JSON.stringify(rgbOf(fn, '#3366ff')) === '[51,102,255]', rgbOf(fn, '#3366ff'));
    }
    check('_lmGlColorInt reads bare hex digits', R0._lmGlColorInt('abc') === 0xaabbcc && R0._lmGlColorInt('3366ff') === 0x3366ff);
    check('... and lmColorInt still says \'abc\' is no colour (Canvas2D cannot draw it)', R0.__lmColorInt('abc') === -1, R0.__lmColorInt('abc'));
}

/* ---------------- headless Chrome: real WebGL + real Canvas2D ---------------- */
const cellStart = src.indexOf('function ogarbasicassembly(');
const cellEnd = src.indexOf('}).call(ogarbasicassembly.prototype)');
function cellMethod(name) {
    const re = new RegExp('\\n\\s*this\\.' + name + ' = function', 'g');
    re.lastIndex = cellStart;
    let m = null;
    for (let x; (x = re.exec(src)) && x.index < cellEnd;) m = x;
    if (!m) throw new Error('cell method ' + name + ' not found');
    return block(src.indexOf('function', m.index));
}
const F = rendererFactory(src);
const protoSrc = '(function (env) {\n' +
    'var window = env.window, LM = env.LM, legendmod = env.LM, application = env.application, defaultSettings = env.defaultSettings,\n' +
    '  defaultmapsettings = env.defaultmapsettings, drawRender = env.drawRender, ogario = env.ogario, ogarcopythelb = env.ogarcopythelb,\n' +
    '  SpecialEffectPlayers = {}, profiles = [], dyinglight1load = "no", _EAT_PULSE_DURATION = 150, _EAT_PULSE_MAGNITUDE = 0.08;\n' +
    block('\nfunction lmSkinsShown(').slice(1) + '\n' + lmc.slice(1) + '\nvar _lmColorIntCache = new Map(), _lmColorCtx = null;\n' +
    /* the gradient avatar of a cell without colour: stubbed to the plain grey under it */
    'function _getFallbackGradient() { return null; }\n' +
    'return { draw: ' + cellMethod('draw') + ' };\n})';

function pageLib() {
    var W = 200, H = 200;
    var NOSKIN = { customSkins: false, videoSkins: false, noNames: true, showMass: false, showChat: false, teammatesInd: false, FBTracking: false,
        oppColors: false, cellContours: false, transparentCells: false, transparentSkins: false, transparentViruses: false, multiBoxShadow: false,
        spawnSpecialEffects: false, virusGlow: false, showCellShadows: false };
    function makeEnv(defaults, cfg) {
        var ds = Object.assign({}, defaults.defaultSettings, cfg.settings || {});
        var dm = Object.assign({}, defaults.defaultmapsettings, NOSKIN, { jellyPhisycs: !!cfg.jelly, webgl2Acceleration: !!cfg.gl }, cfg.map || {});
        var LM = { cells: [], playerCells: [], playerCellsMulti: [], play: !!cfg.play, showCustomSkins: true, gameMode: ':ffa', hideSmallBots: false,
            multiBoxPlayerExists: false, removedCells: [], sortCells: false, indexedCells: {}, selected: null };
        var application = { gameMode: ':ffa', customSkinsMap: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },
            setAutoHideCellInfo: function () { return false; }, getCustomSkin: function () { return null; }, customSkinKey: function () { return null; },
            setVirusColor: function () { return ds.virusColor; }, setVirusStrokeColor: function () { return ds.virusStrokeColor; }, playSound: function () { } };
        var win = { navigator: { deviceMemory: 8 }, devicePixelRatio: 1, legendmod5: { optimizedMass: true } };
        win.legendmod = LM;
        win.multiboxPlayerEnabled = 0;
        win.fullSpectator = false;
        win.clientProfiler = null;
        return { window: win, LM: LM, application: application, defaultSettings: ds, defaultmapsettings: dm, ogarcopythelb: cfg.own || {}, ogario: { viewScale: 1 } };
    }
    function lobes(x, y, size, n) {
        var pts = [];
        for (var i = 0; i < n; i++) { var a = i * 2 * Math.PI / n; pts.push({ x: x + size * Math.cos(a), y: y + size * Math.sin(a) }); }
        return pts;
    }
    function render(factorySrc, protoSrc, defaults, cfg) {
        var env = makeEnv(defaults, cfg);
        var R = (0, eval)('(' + factorySrc + ')')(env);
        env.window.drawRender = R;
        env.drawRender = R;
        var proto = (0, eval)(protoSrc)(env);
        var main = document.createElement('canvas'), out = document.createElement('canvas'), ov = document.createElement('canvas'), glc = document.createElement('canvas');
        main.width = out.width = ov.width = glc.width = W;
        main.height = out.height = ov.height = glc.height = H;
        R.glCanvas = glc; R.canvasWidth = W; R.canvasHeight = H;
        R.initWebGL();
        if (!R.gl) throw new Error('initWebGL failed');
        R.overlayCanvas = ov; R.overlayCtx = ov.getContext('2d');
        R.scale = 1; R.camX = 0; R.camY = 0; R._skinHalf = false;
        var cells = cfg.cells.map(function (o) {
            var c = Object.create(proto);
            return Object.assign(c, { isVirus: false, isFood: false, isEjected: false, invisible: false, removed: false, alpha: 0, redrawed: 0, _eatPulseTime: 0,
                targetNick: '', nick: '', skin: '', isPlayerCell: false, isPlayerCellMulti: false, spectator: 0, mass: 0, pi2: 2 * Math.PI,
                points: cfg.jelly ? lobes(o.x, o.y, o.size, 48) : [], maxPointRad: o.size, isInView: function () { return true; } }, o);
        });
        env.LM.cells = cells;
        env.LM.playerCells = cells.filter(function (c) { return c.isPlayerCell; });
        var gl = R.gl;
        gl.viewport(0, 0, W, H);
        R._jellyFrameId = (R._jellyFrameId || 0) + 1;
        for (var i = 0; i < cells.length; i++) { cells[i]._jellyFrameId = R._jellyFrameId; cells[i]._webglRendered = false; }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var m = main.getContext('2d');
        m.fillStyle = '#ffffff';
        m.fillRect(0, 0, W, H);
        /* a fill left by earlier drawing: an ignored fillStyle must not show it */
        m.fillStyle = '#00ff00';
        m.save();
        m.translate(W / 2, H / 2);
        var useGl = R.canUseWebGLScene(cells), drew = false;
        if (useGl) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            drew = R.drawWebGLCellBatch(cells);
            if (!drew) { gl.clear(gl.COLOR_BUFFER_BIT); for (i = 0; i < cells.length; i++) cells[i]._webglRendered = false; }
        }
        for (i = 0; i < cells.length; i++) cells[i].draw(m, false);
        m.restore();
        var o = out.getContext('2d');
        o.drawImage(main, 0, 0);
        o.drawImage(glc, 0, 0);
        var px = o.getImageData(W / 2, H / 2, 1, 1).data;
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
        return { gl: !!(useGl && drew), why: R._lmGlFallback || '', px: [px[0], px[1], px[2]], keys: Object.keys(R.cellsColored || {}),
            colors: cells.map(function (c) { return c.color; }) };
    }
    return { render: render };
}

async function chromePart() {
    const chrome = NO_CHROME ? null : findChrome();
    if (!chrome) { console.log('cellcolors: Chrome part skipped (Chrome not found; set CHROME_PATH)'); return; }
    const port = 9400 + Math.floor(Math.random() * 400);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-cellcolors-'));
    const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run',
        '--no-default-browser-check', '--ignore-gpu-blocklist', '--window-size=400,300',
        ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] : []), 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let ws;
    const stop = () => { try { ws && ws.close(); } catch (e) { } proc.kill(); return sleep(300).then(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { } }); };
    try {
        let ver;
        for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch('http://127.0.0.1:' + port + '/json/version')).json(); } catch (e) { await sleep(200); } }
        if (!ver) { console.log('cellcolors: Chrome part skipped (Chrome did not start)'); return stop(); }
        const page = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()).find((t) => t.type === 'page');
        ws = new WebSocket(page.webSocketDebuggerUrl);
        let id = 0;
        const pending = new Map();
        ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
        await new Promise((r) => (ws.onopen = r));
        const send = (method, params) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
        const evaluate = async (expr) => {
            const m = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
            if (m.error) throw new Error(m.error.message);
            if (m.result.exceptionDetails) throw new Error((m.result.exceptionDetails.exception && m.result.exceptionDetails.exception.description) || m.result.exceptionDetails.text);
            return m.result.result.value;
        };
        await evaluate('window.dyinglight1load = "no"; window.__cc = (' + pageLib.toString() + ')(); window.__ccF = ' + JSON.stringify(F.factory) + '; window.__ccP = ' + JSON.stringify(protoSrc) +
            '; window.__ccD = ' + F.defaults + '; true');
        const draw = (cfg) => evaluate('__cc.render(__ccF, __ccP, __ccD, ' + JSON.stringify(cfg) + ')');
        const near = (a, b) => a && b && Math.abs(a[0] - b[0]) <= 2 && Math.abs(a[1] - b[1]) <= 2 && Math.abs(a[2] - b[2]) <= 2;
        const CASES = [['valid red', '#ff3b3b', [255, 59, 59]], ['server black', '#000000', [0, 0, 0]], ['5 hex digits', '#f80ff', [128, 128, 128]],
            ['NaN hex', '#NaNNaNNaN', [128, 128, 128]], ['no colour (null)', null, [128, 128, 128]]];
        for (const jelly of [false, true]) for (const [name, col, want] of CASES) {
            const cells = [{ id: 1, x: 0, y: 0, size: 60, color: col }];
            const a = await draw({ jelly, gl: true, cells }), b = await draw({ jelly, gl: false, cells });
            const tag = (jelly ? 'jelly on, ' : 'jelly off, ') + name;
            check(tag + ': WebGL ' + JSON.stringify(want), near(a.px, want), [a.px, a.gl, a.why]);
            check(tag + ': Canvas2D the same', near(b.px, want), b.px);
            check(tag + ': no disc cached for a string that is no colour', b.keys.every((k) => /^#[0-9a-f]{6}$/i.test(k)), b.keys);
        }
        /* own cell, "My custom colour": drawn in the custom colour by both, the cell keeps its own */
        for (const jelly of [false, true]) for (const on of [true, false]) {
            const cells = [{ id: 2, x: 0, y: 0, size: 60, color: '#ff3b3b', isPlayerCell: true }];
            const cfg = { jelly, play: true, own: { color: '#123456' }, map: { myCustomColor: on }, cells };
            const a = await draw(Object.assign({ gl: true }, cfg)), b = await draw(Object.assign({ gl: false }, cfg));
            const want = on ? [0x12, 0x34, 0x56] : [255, 59, 59], tag = (jelly ? 'jelly on' : 'jelly off') + ', own cell, my custom colour ' + (on ? 'on' : 'off');
            check(tag + ': WebGL ' + JSON.stringify(want), near(a.px, want), a.px);
            check(tag + ': Canvas2D the same', near(b.px, want), b.px);
            check(tag + ': Canvas2D leaves the cell its own colour', b.colors[0] === '#ff3b3b', b.colors);
        }
    } finally {
        await stop();
    }
}

chromePart().then(() => {
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('all cell colour checks passed');
}, (e) => { console.log('cellcolors error:', e && e.stack || e); process.exit(1); });
