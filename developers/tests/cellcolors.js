/* Cell colours from the server to the screen, with real code cut out of ogario/ogario.v4.js.
 *
 * Node part: the real handleMessage / updateCells / flushCellsData run in a vm and are fed
 * agar.io world updates (opcode 16). A record without colour keeps the known colour, a new cell
 * without colour has none (the renderers draw their neutral fallback, never black), a later
 * colour is applied, server black (0,0,0) stays black, channels below 16 are padded, a cut
 * packet changes no colour. Multibox with the unit far away: the parser hides no main cell. Battle
 * Royale follows the same rules.
 *
 * Headless Chrome part (skipped without Chrome): the real window.drawRender (WebGL batch) and
 * the real cell.draw (Canvas2D), jelly on and off. A string that is no colour ('#f80ff',
 * '#NaNNaNNaN') is drawn with the same neutral fallback by both renderers (Canvas2D filled it
 * with its default black and cached that disc), real black stays black, a valid colour is
 * the same in both. The whole cell draw runs (labels, rings, skins). An own multibox unit's cells
 * keep my custom colour whatever unit has the focus. A skin that is loading, failed (also by CORS
 * or decoding), dropped from the cache, a video not started or an animated skin still loading
 * shows the cell's colour in both renderers; a ready skin, an animated skin's second picture and a
 * skin the GPU cannot take show the skin. Each cell's draw leaves the drawing state (save depth,
 * clip, alpha, composite, filter, colours, lines, shadow, transform) as it found it after skins,
 * shadows, rings, contours and labels, so the next cell looks as when drawn alone.
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
        countPps: noop, _lmWuIncomplete: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushSpecsData: noop,
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
/* the server's RGB unscaled (_lmServerColor) beside the shown 0.9 colour and _lmRawColor */
const S = id => L.indexedCells[id] ? L.indexedCells[id]._lmServerColor : '(no cell)';
feed([{ id: 16, color: [255, 10, 200], name: 'True', skin: '' }]);
check('the server colour is the packet RGB, unscaled', S(16) === '#ff0ac8' && C(16) === hex(255, 10, 200) && L.indexedCells[16]._lmRawColor === hex(255, 10, 200), [S(16), C(16)]);
feed([{ id: 16, size: 120 }]);
check('a record without colour keeps the server colour', S(16) === '#ff0ac8', S(16));
feed([{ id: 16, color: [1, 2, 3] }]);
check('a later server colour replaces it', S(16) === '#010203', S(16));
feed([{ id: 17, size: 90 }]);
check('a new cell without colour has no server colour (not black)', S(17) == null, S(17));

/* section: Battle Royale (':battleroyale'): only the main connection's parser draws there (Full Map
 * is refused in it), with the same colour rules as FFA */
reset({ gameMode: ':battleroyale' });
feed([{ id: 51, color: [255, 0, 0], name: 'BrRed', skin: '' }]);
check('Battle Royale: a new cell takes its colour', C(51) === hex(255, 0, 0), C(51));
feed([{ id: 51, size: 120 }]);
check('Battle Royale: an update without colour keeps it', C(51) === hex(255, 0, 0), C(51));
feed([{ id: 52, size: 90 }]);
check('Battle Royale: a new cell without colour has none (not black)', C(52) === null, C(52));
feed([{ id: 52, color: [10, 200, 30], name: 'BrLate', skin: '' }]);
check('Battle Royale: a later colour is applied', C(52) === hex(10, 200, 30), C(52));
feed([{ id: 53, color: [0, 0, 0], name: 'BrCoal', skin: '' }, { id: 54, color: [15, 128, 255], name: 'BrPad', skin: '' }]);
check('Battle Royale: server black stays black, channels below 16 are padded', C(53) === '#000000' && C(54) === hex(15, 128, 255), [C(53), C(54)]);
feed([{ id: 55, color: [255, 0, 0], size: 40 }]);
check('Battle Royale: a nameless piece of a player has its colour', C(55) === hex(255, 0, 0), C(55));
g.profiles = [{ nick: 'Me', color: '#123456' }];
g.defaultmapsettings.myCustomColor = true;
L.playerCellIDs = [56];
feed([{ id: 56, color: [200, 40, 40], name: 'Me', skin: '' }]);
check('Battle Royale: own cell with my custom colour', C(56) === '#123456', C(56));
g.defaultmapsettings.myCustomColor = false;
if (typeof L._lmOwnColorsRestore === 'function') L._lmOwnColorsRestore();
check('Battle Royale: my custom colour off gives the server colour back', C(56) === hex(200, 40, 40), C(56));
g.profiles = [];

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
/* the whole cell prototype (draw with its labels, skins and rings) and the text canvases, when found */
const protoA = src.indexOf('    (function () {\n        this.reset = function'), txtA = src.indexOf('    function irenderfromagario() {');
const wholeProto = protoA > 0 && protoA < cellEnd && txtA > 0 && txtA < cellStart;
const protoSrc = '(function (env) {\n' +
    'var window = env.window, LM = env.LM, legendmod = env.LM, application = env.application, defaultSettings = env.defaultSettings,\n' +
    '  defaultmapsettings = env.defaultmapsettings, drawRender = env.drawRender, ogario = env.ogario, ogarcopythelb = env.ogarcopythelb,\n' +
    '  SpecialEffectPlayers = {}, profiles = env.profiles || [], dyinglight1load = "no", _EAT_PULSE_DURATION = 150, _EAT_PULSE_MAGNITUDE = 0.08;\n' +
    block('\nfunction lmSkinsShown(').slice(1) + '\n' + lmc.slice(1) + '\nvar _lmColorIntCache = new Map(), _lmColorCtx = null;\n' +
    /* the own colour and "Player 1 & 2" glow rules (absent in older versions) */
    ['lmOwnColorPlaying', 'lmOwnBodyColor', 'lmMbShadowOn', 'lmMbShadowColor'].map((n) => src.includes('\nfunction ' + n + '(') ? block('\nfunction ' + n + '(').slice(1) + '\n' : '').join('') +
    /* the world skin key, Dying Light off: the cell's own key (absent in older versions) */
    (src.includes('\nfunction lmWorldSkinKey(') ? block('\nfunction lmWorldSkinKey(').slice(1) + '\nvar _lmDl = false;\n' : '') +
    /* the gradient avatar of a cell without colour: stubbed to the plain grey under it */
    'function _getFallbackGradient() { return null; }\n' +
    /* the multibox ring of the cell you control (unit 1 while multiboxPlayerEnabled is set) */
    'function checkVideos() { }\nfunction lmMultiboxControlledPlayer() { return window.multiboxPlayerEnabled ? 2 : 1; }\n' +
    ['LM_MB_RING_MIN_SCREEN_PX', 'LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_SIZE', '_lmMbRingOut'].map((n) => {
        const m = new RegExp('\\nvar ' + n + ' = [^\\n]*').exec(src);
        return m ? m[0].slice(1) : '';
    }).join('\n') + '\n' +
    ['lmMultiboxRingPlayer', 'lmMultiboxRing'].map((n) => (block('\nfunction ' + n + '(') || '').slice(1)).join('\n') + '\n' +
    (wholeProto ? src.slice(txtA, cellStart) + '\nvar proto = {};\n' + src.slice(protoA, cellEnd) + '}).call(proto);\nreturn proto;\n})'
        : 'return { draw: ' + cellMethod('draw') + ' };\n})');
/* the skin lookup of the game (getCachedSkin over the URL's cache keys) */
const skinAppSrc = '(function (env) {\nvar drawRender = env.drawRender;\n' + block('\nfunction _isValidSkin(').slice(1) +
    '\nreturn {\n' + block('        getCachedSkin(skinCache, skinMap) {') + ',\n' + block('        _lmUrlKeys(url) {') + '\n};\n})';

function pageLib() {
    var W = 200, H = 200;
    var NOSKIN = { customSkins: false, videoSkins: false, noNames: true, showMass: false, showChat: false, teammatesInd: false, FBTracking: false,
        oppColors: false, cellContours: false, transparentCells: false, transparentSkins: false, transparentViruses: false, multiBoxShadow: false,
        spawnSpecialEffects: false, virusGlow: false, showCellShadows: false };
    function makeEnv(defaults, cfg) {
        var ds = Object.assign({}, defaults.defaultSettings, cfg.settings || {});
        var dm = Object.assign({}, defaults.defaultmapsettings, NOSKIN, { jellyPhisycs: !!cfg.jelly, webgl2Acceleration: !!cfg.gl }, cfg.map || {});
        var LM = { cells: [], playerCells: [], playerCellsMulti: [], play: !!cfg.play, showCustomSkins: true, gameMode: cfg.mode || ':ffa', hideSmallBots: false,
            multiBoxPlayerExists: false, removedCells: [], sortCells: false, indexedCells: {}, selected: null };
        var application = { gameMode: cfg.mode || ':ffa', customSkinsMap: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },
            setAutoHideCellInfo: function () { return false; }, getCustomSkin: function () { return null; }, customSkinKey: function () { return null; },
            setVirusColor: function () { return ds.virusColor; }, setVirusStrokeColor: function () { return ds.virusStrokeColor; }, playSound: function () { },
            selectedProfile: 0, selectedOldProfile: 0 };
        var win = { navigator: { deviceMemory: 8 }, devicePixelRatio: 1, legendmod5: {} };
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
    /* a skin picture of one colour */
    function skinCv(col) {
        var c = document.createElement('canvas');
        c.width = c.height = 64;
        var x = c.getContext('2d');
        x.fillStyle = col;
        x.fillRect(0, 0, 64, 64);
        return c;
    }
    /* the skin of every cell with a name, in one state of its life (the cache as loadSkin leaves it) */
    function setSkin(R, env, state) {
        var app = env.application, cache = app.customSkinsCache, video = state === 'video';
        var url = video ? 'https://skins.test/s.mp4' : 'https://skins.test/s.png';
        app.customSkinKey = function (nick) { return nick ? url : null; };
        /* a ready skin is on the GPU already (its upload is asynchronous) */
        var onGpu = function (key, cv, layer) {
            var gl = R.gl, n = R.glSkinTexSize || 512;
            if (!gl) return;
            var big = document.createElement('canvas');
            big.width = big.height = n;
            big.getContext('2d').drawImage(cv, 0, 0, n, n);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, R.glSkinArray);
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, layer, n, n, 1, gl.RGBA, gl.UNSIGNED_BYTE, big);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
            R.glSkinMap[key] = layer;
        };
        if (state === 'ready') { cache[url] = skinCv('#0000ff'); onGpu(url, cache[url], 0); }
        /* requested, the picture not loaded yet */
        else if (state === 'loading') cache[url] = new Image();
        /* load error, refused by CORS or not decodable: loadSkin marks it failed */
        else if (state === 'failed') { cache[url] = skinCv('#0000ff'); cache[url]._failed = true; }
        /* dropped from the cache (or never asked for): asked again, nothing to draw yet */
        else if (state === 'evicted') { }
        /* a video skin whose video has not started: the frame goes to Canvas2D */
        else if (video) { env.defaultmapsettings.videoSkins = true; env.window.videoSkinPlayer = {}; }
        /* an animated skin (two pictures), both still loading */
        else if (state === 'animLoading') { cache[url] = new Image(); cache[url + '_cached3'] = new Image(); R._skinHalf = true; }
        /* an animated skin showing its second picture */
        else if (state === 'animSecond') {
            cache[url] = skinCv('#0000ff'); cache[url + '_cached3'] = skinCv('#00ff00'); R._skinHalf = true;
            onGpu(url, cache[url], 0); onGpu(url + '_cached3', cache[url + '_cached3'], 1);
        }
        /* loaded, but the GPU cannot take it (a picture without CORS): Canvas2D draws the frame */
        else if (state === 'gpuRefused') { cache[url] = skinCv('#0000ff'); if (R.glSkinMap) R.glSkinMap[url] = -1; }
    }
    /* the drawing state a cell's draw must leave as it found it */
    function snap(c, depth) {
        var t = c.getTransform();
        return [c.globalAlpha, c.globalCompositeOperation, c.filter, c.fillStyle, c.strokeStyle, c.lineWidth, c.lineJoin, c.shadowBlur, c.shadowColor,
            c.shadowOffsetX, c.shadowOffsetY, [t.a, t.b, t.c, t.d, t.e, t.f].join(','), depth].join('|');
    }
    function counted(c) {
        var d = { n: 0 }, save = c.save, restore = c.restore;
        c.save = function () { d.n++; return save.call(this); };
        c.restore = function () { d.n--; return restore.call(this); };
        return d;
    }
    function render(factorySrc, protoSrc, defaults, cfg, skinAppSrc) {
        var env = makeEnv(defaults, cfg);
        env.profiles = cfg.profiles || [];
        if (cfg.mates) { env.window.teammatenicks = cfg.mates; env.window._lmTeammateNickSet = new Set(cfg.mates); }
        var R = (0, eval)('(' + factorySrc + ')')(env);
        env.window.drawRender = R;
        env.drawRender = R;
        if (skinAppSrc) Object.assign(env.application, (0, eval)(skinAppSrc)(env));
        var proto = (0, eval)(protoSrc)(env);
        var main = document.createElement('canvas'), ov = document.createElement('canvas');
        /* one GL canvas for every draw: its context is made once (a new one per draw cost about 0.2 s) */
        var glc = window.__ccGlc || (window.__ccGlc = document.createElement('canvas'));
        main.width = ov.width = glc.width = W;
        main.height = ov.height = glc.height = H;
        R.glCanvas = glc; R.canvasWidth = W; R.canvasHeight = H;
        /* a Canvas2D frame needs no GL context (making one per draw was most of the time) */
        if (cfg.gl) {
            R.initWebGL();
            if (!R.gl) throw new Error('initWebGL failed');
        }
        R.overlayCanvas = ov; R.overlayCtx = ov.getContext('2d');
        R.scale = 1; R.camX = 0; R.camY = 0; R._skinHalf = false;
        if (cfg.skin) setSkin(R, env, cfg.skin);
        var cells = cfg.cells.map(function (o) {
            var c = Object.create(proto);
            return Object.assign(c, { isVirus: false, isFood: false, isEjected: false, invisible: false, removed: false, alpha: 0, redrawed: 0, _eatPulseTime: 0,
                targetNick: '', nick: '', skin: '', isPlayerCell: false, isPlayerCellMulti: false, spectator: 0, mass: 0, pi2: 2 * Math.PI,
                points: cfg.jelly ? lobes(o.x, o.y, o.size, 48) : [], maxPointRad: o.size, isInView: function () { return true; } }, o);
        });
        env.LM.cells = cells;
        env.LM.playerCells = cells.filter(function (c) { return c.isPlayerCell && !(c.spectator > 0); });
        env.LM.playerCellsMulti = cells.filter(function (c) { return c.isPlayerCellMulti; });
        /* multibox: the unit you control (0 = the main player) */
        if (cfg.focus != null) { env.LM.multiBoxPlayerExists = true; env.window.multiboxPlayerEnabled = cfg.focus; }
        var gl = R.gl;
        if (gl) gl.viewport(0, 0, W, H);
        R._jellyFrameId = (R._jellyFrameId || 0) + 1;
        for (var i = 0; i < cells.length; i++) { cells[i]._jellyFrameId = R._jellyFrameId; cells[i]._webglRendered = false; }
        if (gl) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        var m = main.getContext('2d'), fg = R.overlayCtx;
        m.fillStyle = '#ffffff';
        m.fillRect(0, 0, W, H);
        /* a fill left by earlier drawing: an ignored fillStyle must not show it */
        m.fillStyle = '#00ff00';
        var dm = counted(m), df = counted(fg);
        m.save();
        m.translate(W / 2, H / 2);
        fg.setTransform(m.getTransform());
        var useGl = !!gl && R.canUseWebGLScene(cells), drew = false;
        if (useGl) {
            gl.enable(gl.BLEND);
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            drew = R.drawWebGLCellBatch(cells);
            if (!drew) { gl.clear(gl.COLOR_BUFFER_BIT); for (i = 0; i < cells.length; i++) cells[i]._webglRendered = false; }
        }
        /* the overlay above the GL layer, as in a frame drawn by WebGL */
        R._foregroundCtx = useGl && drew ? fg : null;
        var leaks = [], errors = [], cerr = console.error;
        console.error = function () { errors.push([].slice.call(arguments).map(String).join(' ').slice(0, 300)); };
        try {
            for (i = 0; i < cells.length; i++) {
                var b0 = snap(m, dm.n), f0 = snap(fg, df.n);
                cells[i].draw(m, false);
                var b1 = snap(m, dm.n), f1 = snap(fg, df.n);
                if (b0 !== b1) leaks.push('cell ' + cells[i].id + ' main: ' + b0 + ' -> ' + b1);
                if (f0 !== f1) leaks.push('cell ' + cells[i].id + ' overlay: ' + f0 + ' -> ' + f1);
            }
        } finally {
            console.error = cerr;
        }
        /* a clip left by a draw would keep this corner white */
        m.save();
        m.setTransform(1, 0, 0, 1, 0, 0);
        m.fillStyle = '#0000ff';
        m.fillRect(0, 0, 2, 2);
        m.restore();
        var corner = m.getImageData(0, 0, 1, 1).data;
        m.restore();
        /* the pixel the three layers make at a point: the main canvas, the GL canvas over it (read
         * with readPixels, premultiplied; drawing the GL canvas into a 2D one cost about 0.1 s), the overlay */
        var pixel = function (at) {
            var sx = W / 2 + at[0], sy = H / 2 + at[1];
            var mp = m.getImageData(sx, sy, 1, 1).data, px = [mp[0], mp[1], mp[2]];
            if (gl) {
                var gp = new Uint8Array(4);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.readPixels(sx, H - 1 - sy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, gp);
                px = px.map(function (v, k) { return gp[k] + v * (1 - gp[3] / 255); });
            }
            var op = fg.getImageData(sx, sy, 1, 1).data;
            return px.map(function (v, k) { return Math.round(op[k] * op[3] / 255 + v * (1 - op[3] / 255)); });
        };
        var px = pixel(cfg.at || [0, 0]), px2 = cfg.at2 ? pixel(cfg.at2) : null;
        return { gl: !!(useGl && drew), why: R._lmGlFallback || '', px: px, px2: px2, keys: Object.keys(R.cellsColored || {}),
            colors: cells.map(function (c) { return c.color; }), leaks: leaks, errors: errors, depth: [dm.n, df.n],
            clipFree: corner[0] === 0 && corner[1] === 0 && corner[2] === 255 };
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
            '; window.__ccS = ' + JSON.stringify(skinAppSrc) + '; window.__ccD = ' + F.defaults + '; true');
        const draw = (cfg) => evaluate('__cc.render(__ccF, __ccP, __ccD, ' + JSON.stringify(cfg) + ', __ccS)');
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
        /* a multibox unit's own cell while the main player is dead and no unit is selected: both
         * renderers decide "playing" the same way (lmOwnColorPlaying), so both draw the own colour
         * (WebGL needed the main player's cells or a selected unit) */
        for (const jelly of [false, true]) {
            const cells = [{ id: 3, x: 0, y: 0, size: 60, color: '#ff3b3b', isPlayerCell: true, isPlayerCellMulti: true, spectator: 1 }];
            const cfg = { jelly, play: false, own: { color: '#123456' }, map: { myCustomColor: true }, cells };
            const a = await draw(Object.assign({ gl: true }, cfg)), b = await draw(Object.assign({ gl: false }, cfg));
            const want = [0x12, 0x34, 0x56], tag = (jelly ? 'jelly on' : 'jelly off') + ', unit cell, main player dead, no unit selected';
            check(tag + ': WebGL draws the own colour', near(a.px, want), [a.px, a.gl, a.why]);
            check(tag + ': Canvas2D the same', near(b.px, want), b.px);
        }
        /* the draws above ran the whole cell draw without an error (labels, rings and skins included) */
        {
            const r = await draw({ jelly: true, gl: false, cells: [{ id: 9, x: 0, y: 0, size: 60, color: '#ff3b3b' }] });
            check('the cell draw runs to its end (no error caught in it)', r.errors.length === 0, r.errors);
        }
        /* multibox: a unit's own cell has the same colour whatever unit you control, the main player
         * alive or dead, in both renderers, and its cell keeps its own colour */
        for (const [jelly, on] of [[false, true]]) {
            const unit = { id: 3, x: 0, y: 0, size: 60, color: '#ff3b3b', isPlayerCell: true, isPlayerCellMulti: true, spectator: 1 };
            const want = on ? [0x12, 0x34, 0x56] : [255, 59, 59];
            for (const [mainAlive, focus] of [[true, 0], [true, 1], [false, 1], [false, 0]]) {
                const cells = [unit].concat(mainAlive ? [{ id: 4, x: 400, y: 400, size: 30, color: '#3366ff', isPlayerCell: true }] : []);
                const cfg = { jelly, play: mainAlive, focus, own: { color: '#123456' }, map: { myCustomColor: on }, cells };
                const a = await draw(Object.assign({ gl: true }, cfg)), b = await draw(Object.assign({ gl: false }, cfg));
                const tag = (jelly ? 'jelly on' : 'jelly off') + ', my custom colour ' + (on ? 'on' : 'off') + ', main ' + (mainAlive ? 'alive' : 'dead') +
                    ', focus on ' + (focus ? 'the unit' : 'the main player') + ': the unit\'s cell';
                check(tag + ' in WebGL ' + JSON.stringify(want), near(a.px, want), [a.px, a.gl, a.why]);
                check(tag + ' in Canvas2D the same', near(b.px, want), b.px);
                check(tag + ' keeps its colour', a.colors[0] === '#ff3b3b' && b.colors[0] === '#ff3b3b', [a.colors, b.colors]);
            }
        }
        /* Battle Royale: a cell in its colour, an own cell in my custom colour, in both renderers */
        for (const jelly of [false]) {
            const cfg = { jelly, mode: ':battleroyale', play: true, own: { color: '#123456' }, map: { myCustomColor: true }, at: [-50, 0], at2: [50, 0],
                cells: [{ id: 11, x: -50, y: 0, size: 40, color: '#ff3b3b' }, { id: 12, x: 50, y: 0, size: 40, color: '#ff3b3b', isPlayerCell: true }] };
            const a = await draw(Object.assign({ gl: true }, cfg)), b = await draw(Object.assign({ gl: false }, cfg));
            const tag = 'Battle Royale, jelly ' + (jelly ? 'on' : 'off');
            check(tag + ': a cell in its colour in WebGL and Canvas2D', near(a.px, [255, 59, 59]) && near(b.px, [255, 59, 59]), [a.px, b.px, a.gl]);
            check(tag + ': the own cell in my custom colour in WebGL and Canvas2D', near(a.px2, [0x12, 0x34, 0x56]) && near(b.px2, [0x12, 0x34, 0x56]), [a.px2, b.px2]);
        }
        /* skins: a cell with a valid colour is drawn in it while its skin is not drawable (loading,
         * failed or refused by CORS, dropped from the cache, a video not started, an animated skin
         * still loading), by both renderers; a skin never changes the cell's colour. A ready skin,
         * the second picture of an animated one and a skin the GPU cannot take (drawn by Canvas2D)
         * show the skin. */
        const SKINS = [['ready', [0, 0, 255]], ['loading', null], ['failed', null], ['evicted', null], ['video', null], ['animLoading', null],
            ['animSecond', [0, 255, 0]], ['gpuRefused', [0, 0, 255]]];
        /* (jelly on: the states its own resolver tells apart) */
        for (const jelly of [false, true]) for (const [state, skinPx] of SKINS.filter((k) => !jelly || /^(ready|loading|gpuRefused)$/.test(k[0]))) {
            const cells = [{ id: 5, x: 0, y: 0, size: 60, color: '#ff3b3b', targetNick: 'Sk' }];
            const cfg = { jelly, skin: state, map: { customSkins: true }, cells };
            const a = await draw(Object.assign({ gl: true }, cfg)), b = await draw(Object.assign({ gl: false }, cfg));
            const want = skinPx || [255, 59, 59], tag = (jelly ? 'jelly on' : 'jelly off') + ', skin ' + state + ': ' + (skinPx ? 'the skin' : 'the cell colour');
            check(tag + ' in WebGL ' + JSON.stringify(want), near(a.px, want), [a.px, a.gl, a.why]);
            check(tag + ' in Canvas2D ' + JSON.stringify(want), near(b.px, want), b.px);
            check((jelly ? 'jelly on' : 'jelly off') + ', skin ' + state + ': the cell keeps its colour, no error', a.colors[0] === '#ff3b3b' && b.colors[0] === '#ff3b3b' &&
                !a.errors.length && !b.errors.length, [a.colors, b.colors, a.errors, b.errors]);
        }
        /* drawing state: what a cell's skin (jelly clip), shadow, multibox shadow and ring, opponent
         * ring, transparency, contour, nick, mass, teammate indicator and a virus with its glow set
         * is undone by the end of its draw (no save without restore, no clip, alpha, composite,
         * filter, colour, line or shadow left), so the next cell's body is drawn as when it is
         * drawn alone. The same in a WebGL frame (the marks on the overlay). */
        for (const [gl, jelly, contours] of [[false, false, false], [false, true, false], [false, false, true], [false, true, true], [true, false, false], [true, true, false]]) {
            const plain = { id: 8, x: 55, y: 55, size: 30, color: '#3366ff' };
            const busy = [
                { id: 6, x: -55, y: -55, size: 45, color: '#ff3b3b', targetNick: 'Dirty', oppColor: '#ffff00' },
                { id: 7, x: 55, y: -55, size: 45, color: '#ff3b3b', targetNick: 'Dirty', isPlayerCell: true, isPlayerCellMulti: true, spectator: 1 },
                { id: 10, x: -55, y: 55, size: 40, color: '#33ff33', isVirus: true }];
            const cfg = { gl, jelly, play: true, focus: 1, skin: 'ready', at: [55, 55], profiles: [{ nick: 'Dirty', color: '#00ffff' }], mates: ['Dirty'],
                map: { customSkins: true, noNames: false, showMass: true, showCellShadows: true, transparentCells: true, transparentSkins: true, oppColors: true,
                    multiBoxShadow: true, teammatesInd: true, virusGlow: true, cellContours: contours },
                settings: { cellsAlpha: 0.6, skinsAlpha: 0.5, textAlpha: 0.7 } };
            const after = await draw(Object.assign({}, cfg, { cells: busy.concat([plain]) })), alone = await draw(Object.assign({}, cfg, { cells: [plain] }));
            const tag = (gl ? 'WebGL frame' : 'Canvas2D') + ', jelly ' + (jelly ? 'on' : 'off') + ', contours ' + (contours ? 'on' : 'off');
            check(tag + ': every cell leaves the drawing state as it found it', after.leaks.length === 0 && after.depth.join() === '0,0', [after.leaks, after.depth]);
            check(tag + ': no clip is left', after.clipFree);
            check(tag + ': the cell after skins, shadows, rings and labels looks as when drawn alone', near(after.px, alone.px) && !near(alone.px, [255, 255, 255]),
                [after.px, alone.px]);
            check(tag + ': no error caught in a cell draw', !after.errors.length, after.errors);
        }
    } finally {
        await stop();
    }
}

chromePart().then(() => {
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('all cell colour checks passed');
}, (e) => { console.log('cellcolors error:', e && e.stack || e); process.exit(1); });
