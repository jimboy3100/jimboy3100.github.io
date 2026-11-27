/* The main connection's world beside multibox / spectator units, the spawn gate across
 * connections, and the death in a world update cut short. The real handleMessage, updateCells
 * and flushCellsData of ogario/ogario.v4.js (and the wipe of application.onPlayerDeath beside a
 * living unit) run in a vm with stubs:
 * - the main death beside a living unit and the spawn under the Expanding Land spawn gate drop
 *   the main socket's world and keep the units' cells, pellets and viruses (their viruses left
 *   LM.viruses: spect.js lists a virus once, so its range ring was gone)
 * node developers/tests/mainflush.js [ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  ' + JSON.stringify(info))); if (!c) fail++; };
const cut = (from, to) => { const a = src.indexOf(from), b = src.indexOf(to, a); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };

const hm = cut('        handleMessage(data) {\n', '        countPps() {');
const uc = cut('        _lmCellIdentityScan(view, offset) {\n', '        sortCells() {');
const fl = cut('        flushCellsData(preserveMapGeometry) {\n', '        /* Spectator toggles');
const helpers = cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool');
/* the wipe of application.onPlayerDeath when it switches to a living unit */
const Q = String.fromCharCode(39);
const wipe = cut("// Flush main client's cells (spectator=0 or undefined)", '// Flag to suppress main client adding spectator cells');
if (!hm || !uc || !fl || !helpers || !wipe) { console.log('FAIL game handler not found in ogario.v4.js'); process.exit(1); }

function client() {
    const noop = function () { };
    const g = {
        console: { log: noop, warn: noop, error: (...a) => { g.errors.push(a.join(' ')); } }, errors: [], Math, Date, JSON, Object, Array, Map, Set, Number, String, Boolean,
        Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, Error, isFinite, escape, unescape, decodeURIComponent, encodeURIComponent, parseInt, parseFloat,
        Infinity, NaN, undefined, performance, timers: [], cleared: []
    };
    g.window = g;
    g.setTimeout = (fn, ms) => { g.timers.push(ms); return 1000 + g.timers.length; };
    g.clearTimeout = (id) => { g.cleared.push(id); };
    g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
    g.buffer = { Buffer: function (ab) { return Buffer.from(ab); } };
    g.defaultmapsettings = { recordReplays: false, virusesRange: true };
    g.$ = () => new Proxy({}, { get: (t, k) => k === 'val' ? () => '' : () => g.$() });
    g.document = { getElementById: () => null };
    g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0, onPlayerDeath() { g.deaths++; } }, { get: (t, k) => k in t ? t[k] : noop });
    g.deaths = 0;
    g.drawRender = new Proxy({}, { get: () => noop });
    g.userBots = { startedBots: false, isAlive: true };
    g.profiles = [];
    g.spects = [];
    g.ogarbasicassembly = function (id, x, y, size, color, isFood, isVirus) {
        Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, targetSize: size, isPlayerCell: false, targetNick: '', skin: null });
        /* the list part of the real removeCell (lmIdxRemove from each list, an own cell sets removePlayerCell) */
        this.removeCell = function () {
            const L = g.LM;
            this.removed = true;
            g.lmIdxRemove(L.cells, this, '_cellsIdx');
            g.lmIdxRemove(L.viruses, this, '_virusIdx');
            g.lmIdxRemove(L.food, this, '_foodIdx');
            g.lmIdxRemove(L.foodMulti, this, '_foodMultiIdx');
            g.lmIdxRemove(L.playerCellsMulti, this, '_playerMultiIdx');
            if (g.lmIdxRemove(L.playerCells, this, '_playerIdx')) {
                L.removePlayerCell = true;
                const k = L.playerCellIDs.indexOf(this.id);
                if (k !== -1) L.playerCellIDs.splice(k, 1);
            }
            delete L.indexedCells[this.id];
        };
    };
    vm.createContext(g);
    vm.runInContext(helpers + '\n' + [...helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' '), g);
    g.__h = null;
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop });
    vm.runInContext('with (__env) { __h = ({' + hm + ',\n' + uc + ',\n' + fl + '}); }', g);
    const L = g.__h;
    Object.assign(L, {
        serverType: 'expandingland', isLegendWorld: true, connectionIntegrity: false, integrity: false, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
        cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: {}, playerCellsMulti: [], foodMulti: [],
        vector: [[0, 0]], vnr: 0, play: false, time: 0, mapEvent: {}, decayInfo: {},
        countPps: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushSpecsData: noop, _lmSpawnEndsSpectate: noop,
        rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join(''), _lmKeepMainSuppressed: () => false
    });
    g.legendmod = g.LM = L;
    L.g = g;
    return L;
}

/* an Expanding Land world update (opcode 16): eats [eater, victim], records, removes. Food has
 * extended flag 1; a virus record is a plain record the test marks as a virus afterwards. */
function packet(eats, recs, removes) {
    const b = [];
    const u8 = (v) => b.push(v & 255), u16 = (v) => { u8(v); u8(v >>> 8); }, u32 = (v) => { for (let i = 0; i < 4; i++) u8(v >>> (8 * i)); };
    const str = (s) => { for (const ch of Buffer.from(s, 'utf8')) u8(ch); u8(0); };
    u8(16); u16(eats.length);
    eats.forEach(e => { u32(e[0]); u32(e[1]); });
    recs.forEach(r => {
        const flags = (r.food ? 0x80 : 0) | (r.virus ? 1 : 0) | (r.color ? 2 : 0) | (r.name != null ? 8 : 0);
        u32(r.id); u32(r.x || 0); u32(r.y || 0); u16(r.size || 100); u8(flags);
        if (r.food) u8(1);
        if (r.color) r.color.forEach(u8);
        if (r.name != null) str(r.name);
    });
    u32(0); u16(removes.length); removes.forEach(u32);
    return b;
}
const dv = (bytes) => new DataView(new Uint8Array(bytes).buffer);
const feed = (L, eats, recs, removes) => L.handleMessage(dv(packet(eats, recs, removes)));

/* a multibox unit's cells as spect.js stores them (spectator = unit number, ids 'u<n>:<raw>') */
function addUnit(L) {
    const G = L.g.ogarbasicassembly;
    const own = new G('u1:77', 0, 0, 200, '#ff0000', false, false); own.spectator = 1;
    const pel = new G('u1:5', 1, 1, 12, '#00ff00', true, false); pel.spectator = 1;
    const vir = new G('u1:6', 2, 2, 100, '#33ff33', false, true); vir.spectator = 1;
    L.indexedCells[own.id] = own; L.g.indexedPush(L.cells, own, '_cellsIdx'); L.g.indexedPush(L.playerCellsMulti, own, '_playerMultiIdx');
    L.indexedCells[pel.id] = pel; L.g.indexedPush(L.foodMulti, pel, '_foodMultiIdx');
    L.indexedCells[vir.id] = vir; L.g.indexedPush(L.cells, vir, '_cellsIdx'); L.g.indexedPush(L.viruses, vir, '_virusIdx');
    L.g.spects = [{ number: 1, player: true, active: true, playerCellIDs: [77], flushCellsData() { this.flushed = true; } }];
    return { own, pel, vir };
}
const mainWorld = (L) => feed(L, [], [
    { id: 11, x: 100, y: 200, size: 120, color: [200, 50, 50], name: 'Alpha' },
    { id: 13, x: 10, y: 10, size: 100, color: [20, 200, 20], virus: true },
    { id: 900, x: 5, y: 6, size: 12, color: [10, 20, 30], food: true }
], []);
const unitKept = (L, u) => !!L.indexedCells['u1:77'] && !!L.indexedCells['u1:5'] && !!L.indexedCells['u1:6'] && L.cells.includes(u.own) &&
    L.playerCellsMulti.includes(u.own) && L.foodMulti.includes(u.pel) && L.viruses.includes(u.vir);
const mainGone = (L) => !L.indexedCells[11] && !L.indexedCells[13] && !L.indexedCells[900] && !L.food.some(c => c.id === 900) &&
    !L.viruses.some(c => c.id === 13) && !L.cells.some(c => c.id === 11);

/* ---- 1. main death beside a living unit (the onPlayerDeath wipe), the spawn under the gate ---- */
{
    const L = client();
    mainWorld(L);
    const u = addUnit(L);
    vm.runInContext('(function(){' + wipe + '})()', L.g);
    check('main death wipe: the main socket' + Q + 's cell, pellet and virus go', mainGone(L), { food: L.food.map(c => c.id), viruses: L.viruses.map(c => c.id) });
    check('main death wipe: the unit' + Q + 's cell, pellet and virus stay (its virus left LM.viruses)', unitKept(L, u), { viruses: L.viruses.map(c => c.id) });
}
{
    /* the spawn (opcode 32) under the Expanding Land spawn gate drops the main socket's world the same way */
    const M = client();
    mainWorld(M);
    const u = addUnit(M);
    M._spawnTransitGate = true; /* Play pressed while dead */
    M.handleMessage(dv([32, 11, 0, 0, 0]));
    check('spawn under the gate: the main socket\'s cells, pellet and virus go, the gate opens', mainGone(M) && M._spawnTransitGate === false);
    check('spawn under the gate: the unit\'s cell, pellet and virus stay (its virus left LM.viruses)', unitKept(M, u), { viruses: M.viruses.map(c => c.id) });
}

console.log(fail ? fail + ' FAILED' : 'all main flush checks passed');
process.exit(fail ? 1 : 0);
