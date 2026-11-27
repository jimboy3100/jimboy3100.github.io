/* Expanding Land cell identities: the server sends a cell's colour, skin and name only in the
 * record that adds it; later records for it are plain updates. The client wipes its cells when
 * the player presses Play / respawns (flushCellsData(true), the onPlay transit gate), but the
 * server still counts those cells as known and keeps sending plain updates, so they came back
 * with no nick, no skin and no colour (grey) until they left the view. The real handleMessage,
 * updateCells, _lmCellIdentityScan and flushCellsData of ogario/ogario.v4.js run in a vm with
 * stubs and are fed Expanding Land packets.
 * node developers/tests/elidentity.js [ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const cut = (from, to) => { const a = src.indexOf(from), b = src.indexOf(to, a); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };
function block(from) {
    const a = src.indexOf(from);
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

const hm = cut('        handleMessage(data) {\n', '        countPps() {');
/* from the identity scan (when present) through updateCells */
const uc = cut(src.includes('        _lmCellIdentityScan(view, offset) {\n') ? '        _lmCellIdentityScan(view, offset) {\n' : '        updateCells(view, offset) {\n', '        sortCells() {');
const fl = cut('        flushCellsData(preserveMapGeometry) {\n', '        /* Spectator toggles');
const isEl = block('function _isExpandingLandClient(');
const helpers = cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool');
if (!hm || !uc || !fl || !isEl || !helpers) { console.log('FAIL game handler not found in ogario.v4.js'); process.exit(1); }

const noop = function () { };
const g = { console: { log: noop, warn: noop, error: (...a) => { g.errors.push(a.join(' ')); } }, errors: [], Math, Date, JSON, Object, Array, Map, Set, Number, String, Boolean, Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, Error, isFinite, escape, unescape, decodeURIComponent, encodeURIComponent, parseInt, parseFloat, Infinity, NaN, undefined, performance, setTimeout, clearTimeout };
g.window = g;
g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
g.buffer = { Buffer: function (ab) { return Buffer.from(ab); } };
g.defaultmapsettings = { recordReplays: false };
g.$ = () => ({ val: () => '' });
g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0 }, { get: (t, k) => k in t ? t[k] : noop });
g.drawRender = new Proxy({}, { get: () => noop });
g.userBots = { startedBots: false };
g.profiles = [];
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
vm.runInContext(helpers + '\n' + [...helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' ') + '\n' + isEl + '\nthis._isExpandingLandClient = _isExpandingLandClient;', g);
g.__h = null;
g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop });
vm.runInContext('with (__env) { __h = ({' + hm + ',\n' + uc + ',\n' + fl + '}); }', g);
const L = g.__h;
Object.assign(L, {
    serverType: 'expandingland', isLegendWorld: true, connectionIntegrity: false, integrity: false, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
    cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: {}, playerCellsMulti: [],
    vector: [[0, 0]], vnr: 0, play: true, time: 0, mapEvent: {}, decayInfo: {},
    countPps: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushSpecsData: noop,
    rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join(''), _lmKeepMainSuppressed: () => false
});
g.legendmod = g.LM = L;

/* an Expanding Land world update (opcode 16): eats [eater, victim], records, removes. A record
 * with color / skin / name is what the server writes when it adds a cell (packet.c), without
 * them a plain update; food has extended flag 1. */
function packet(eats, recs, removes) {
    const b = [];
    const u8 = (v) => b.push(v & 255), u16 = (v) => { u8(v); u8(v >>> 8); }, u32 = (v) => { for (let i = 0; i < 4; i++) u8(v >>> (8 * i)); };
    const str = (s) => { for (const ch of Buffer.from(s, 'utf8')) u8(ch); u8(0); };
    u8(16); u16(eats.length);
    eats.forEach(e => { u32(e[0]); u32(e[1]); });
    recs.forEach(r => {
        const flags = (r.food ? 0x80 : 0) | (r.color ? 2 : 0) | (r.skin != null ? 4 : 0) | (r.name != null ? 8 : 0);
        u32(r.id); u32(r.x || 0); u32(r.y || 0); u16(r.size || 100); u8(flags);
        if (r.food) u8(1);
        if (r.color) r.color.forEach(u8);
        if (r.skin != null) str(r.skin);
        if (r.name != null) str(r.name);
    });
    u32(0); u16(removes.length); removes.forEach(u32);
    return new DataView(new Uint8Array(b).buffer);
}
const feed = (eats, recs, removes) => L.handleMessage(packet(eats, recs, removes));
const cell = (id) => L.indexedCells[id];
const grey = (c) => !c || (!c.targetNick && !c.skin && !c.color);

/* the world before Play: two bots, an orphaned piece (empty name and skin), food */
feed([], [
    { id: 101, size: 120, color: [200, 50, 50], skin: 'https://jimboy3000.github.io/vanillaskins/a.png', name: 'Bot ★ A' },
    { id: 102, size: 90, color: [50, 200, 50], skin: '', name: 'Bot B' },
    { id: 103, size: 150, color: [50, 50, 200], skin: '', name: '' },
    { id: 900, size: 12, color: [10, 20, 30], food: true }
], []);
const before = { a: Object.assign({}, cell(101)), b: Object.assign({}, cell(102)) };
check('add records: cells with nick, skin and colour', before.a.targetNick === 'Bot ★ A' && before.a.skin === 'https://jimboy3000.github.io/vanillaskins/a.png' && !!before.a.color && before.b.targetNick === 'Bot B');

/* Play: the client wipes its cells, the server keeps them and sends plain updates */
L.flushCellsData(true);
check('respawn wipe empties the world', L.cells.length === 0 && !cell(101));
feed([], [{ id: 101, size: 121 }, { id: 102, size: 91 }, { id: 103, size: 150 }, { id: 900, size: 12, food: true }], []);
const a = cell(101), b2 = cell(102), o = cell(103);
check('after the wipe a plain update brings the cell back with its nick, skin and colour (was nameless and grey)',
    !!a && a.targetNick === before.a.targetNick && a.skin === before.a.skin && a.color === before.a.color && a.targetSize === 121);
check('a second cell gets its own nick and colour back', !!b2 && b2.targetNick === 'Bot B' && b2.color === before.b.color);
check('an orphaned piece (sent with an empty name) stays without a name', !!o && o.targetNick === '' && !!o.color);
check('food stays food', !!cell(900) && cell(900).isFood && L.food.length === 1);

/* a name refresh (bot respawned with a new identity) replaces what is kept */
feed([], [{ id: 102, skin: 'https://jimboy3000.github.io/vanillaskins/b.png', name: 'Bot B2' }], []);
L.flushCellsData(true);
feed([], [{ id: 102 }], []);
check('a refreshed name and skin are the ones that come back', !!cell(102) && cell(102).targetNick === 'Bot B2' && cell(102).skin === 'https://jimboy3000.github.io/vanillaskins/b.png' && cell(102).color === before.b.color);

/* the onPlay transit gate drops world updates until the spawn: the cells those updates add
 * still get their identity when plain updates follow */
L._spawnTransitGate = true;
feed([], [{ id: 104, size: 80, color: [220, 220, 20], skin: '', name: 'Gate C' }], [102]);
check('while the transit gate is on, no cell is added', !cell(104));
L._spawnTransitGate = false;
feed([], [{ id: 104, size: 81 }], []);
check('a cell added during the transit gate shows its nick and colour later', !!cell(104) && cell(104).targetNick === 'Gate C' && !!cell(104).color);

/* the server removes and eats: nothing is kept for those ids */
feed([[101, 104]], [], [103]);
const mem = L._lmCellIdentity;
check('removed, eaten and gate-removed cells are forgotten', !!mem && !mem.has(103) && !mem.has(104) && !mem.has(102) && mem.has(101) && !mem.has(900));
check('a removed id seen again in a plain update has nothing to restore', (feed([], [{ id: 103 }], []), cell(103) && cell(103).targetNick === '' && !cell(103).color));

/* another connection: everything kept is dropped */
L.flushCellsData();
check('a connection-level flush forgets every identity', !!L._lmCellIdentity && L._lmCellIdentity.size === 0);

/* other servers: nothing is kept */
L._lmCellIdentity = undefined;
Object.assign(L, { serverType: 'private', isLegendWorld: false, gameMode: ':ffa' });
L.flushCellsData();
feed([], [{ id: 201, size: 120, color: [200, 50, 50], name: 'Other' }], []);
check('other servers: no identities kept', L._lmCellIdentity === undefined && !!cell(201) && cell(201).targetNick === 'Other');

/* agar.io (same record format): the multibox death switch (onPlayerDeath, main player dead, a unit
 * plays) wipes the cells of the main socket, which stays open and drops its updates meanwhile.
 * Its pellets and viruses went out of the index but stayed in LM.food / LM.viruses: the server's
 * remove records could not find them (ghosts for good) and a pellet sent again was there twice.
 * The players came back from plain updates without colour or name. */
const deathSwitch = block("if (defaultmapsettings.mbSwitchAfterDeath && typeof spects !== 'undefined' && spects && spects.length > 0) {");
if (!deathSwitch) { console.log('FAIL onPlayerDeath multibox switch not found'); process.exit(1); }
g.__death = null;
vm.runInContext('with (__env) { __death = function () { ' + deathSwitch + ' }; }', g);
Object.assign(L, { serverType: 'agario', isLegendWorld: false, connectionIntegrity: true, gameMode: ':ffa' });
L.flushCellsData();
L.cells = []; L.food = []; L.viruses = []; L.indexedCells = {};
feed([], [
    { id: 301, size: 140, color: [200, 40, 40], skin: '', name: 'Enemy' },
    { id: 951, size: 12, color: [10, 20, 30], food: true }
], []);
const enemyColor = cell(301) && cell(301).color;
g.defaultmapsettings.mbSwitchAfterDeath = true;
g.spects = [{ number: 1, active: true }];
g.lmSetMbUnit = (n) => { g.multiboxPlayerEnabled = n; };
const pellet = L.food[0];
g.__death();
check('death switch: the focus goes to the living unit', g.multiboxPlayerEnabled === 1 && g.mainPlayerDeadMbActive === true);
check('death switch: the main socket pellets leave the food list with the index (were ghosts)', L.food.length === 0 && !cell(951) && !cell(301));
/* dropped while held: only the identities are kept current */
L._lmKeepMainSuppressed = () => true;
feed([], [{ id: 302, size: 100, color: [40, 200, 40], skin: '', name: 'Newcomer' }], []);
check('held: no cell is added', !cell(302));
g.mainPlayerDeadMbActive = false;
L._lmKeepMainSuppressed = () => false;
feed([], [{ id: 301, size: 141 }, { id: 302, size: 101 }, { id: 951, size: 12, color: [10, 20, 30], food: true }], []);
check('after the hold a plain update brings the wiped player back with its name and colour (was grey)', !!cell(301) && cell(301).targetNick === 'Enemy' && cell(301).color === enemyColor);
check('a player added while held comes back with its name', !!cell(302) && cell(302).targetNick === 'Newcomer' && !!cell(302).color);
check('a pellet sent again is there once', L.food.length === 1 && L.food[0] !== pellet);
feed([], [], [951, 301]);
check('the server removes it: gone (was a ghost that could not be removed)', L.food.length === 0 && !cell(301));
L.flushCellsData();
check('agar.io: another connection drops the identities', L._lmCellIdentity == null);
check('nothing logged as an error', g.errors.length === 0);

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
