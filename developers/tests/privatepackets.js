/* Malformed packets of the private-server protocols: Senpa (onMessage, its own reader),
 * Imsolo / Agar2 (handleMessage opcode 252, minimap ghost cells; 251, party friend) and delt.io
 * (53, Delta's leaderboard). Replays play their packets through the same handlers (Replay Studio
 * handle -> handleMessage, the protocol stored with the replay). The real handlers are taken
 * from ogario/ogario.v4.js and run in a vm with a small world (cells with removeCell, the
 * index helpers, a WASM stand-in that records what it is given).
 *
 * Golden packets are built from the documented layouts (Delta ProtocolSenpa for Senpa, the
 * comments of handleMessage for 252); GOLDEN below is the world they gave with the handlers as
 * they were before the checks (and --old FILE compares with such a file directly). Then:
 * every truncation boundary of every golden packet, malformed counts / types / lengths /
 * terminators, a bounded seeded fuzz, and the cost of valid packets.
 * A packet that is cut short or malformed must never throw out of the handler, must change
 * nothing when its first section does not fit, must never apply a record that is not whole
 * (no half-added cell, no move section in part, no anti-cheat array cut short given to the
 * WASM module), must not count in packets/s, and must keep the previous ghost list.
 * node developers/tests/privatepackets.js [--src FILE] [--old FILE] [--bench] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const SRC = read(opt('--src') || path.join(root, 'ogario', 'ogario.v4.js'));
const OLD = opt('--old') ? read(opt('--old')) : null;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function method(src, head, next) {
    const a = src.indexOf('\n        ' + head), b = src.indexOf('\n        ' + next, a + 1);
    if (a < 0 || b < 0) throw new Error('not found: ' + head);
    return src.slice(a, b).replace(/,\s*$/, '');
}

/* ---------- a world for the handlers ---------- */
function makeWorld(src) {
    let body = method(src, 'onMessage(message) {', 'onError(t) {') + ',\n' + method(src, 'handleMessage(data) {', 'countPps() {');
    /* the spawn's spectate reset, called by the handlers (older sources have none) */
    if (src.indexOf('\n        _lmSpawnEndsSpectate() {') >= 0) body += ',\n' + method(src, '_lmSpawnEndsSpectate() {', 'sendFreeSpectate() {');
    const ctx = {
        console: { log() { }, warn: (...a) => ctx.warns.push(a.join(' ')), error: (...a) => ctx.warns.push('ERROR ' + a.join(' ')) },
        warns: [], Math, JSON, Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, TypeError, Error, String, Number, Object, Array, Map, Set,
        Date: { now: () => ctx.clock }, clock: 1000, queueMicrotask() { },
        lmRecRoom: () => false /* no replay recording in this test */, defaultmapsettings: { shortMass: false, virMassShots: false, virusesRange: false },
        $: () => ({ val: () => '' }), lmT: (k) => k, toastr: { warning() { ctx.toasts++; } }, toasts: 0,
        application: { hideMenu() { }, showMenu() { ctx.menus++; }, onPlayerSpawn() { ctx.spawns++; }, onPlayerDeath() { ctx.deaths++; }, customSkinsMap: {}, loadSkin() { } },
        menus: 0, spawns: 0, deaths: 0, allocs: [],
        userBots: { isAlive: false, startedBots: false }, connectionBots: { send() { } },
        _SenpaModule: { _alloc(k, a) { ctx.allocs.push([k, Array.from(a)]); } },
        ogario: {}, drawRender: { drawPieChart() { } }, _lmElTeamsActive: () => false,
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(`
        function indexedPush(arr, c, k) { c[k] = arr.length; arr.push(c); }
        function lmIdxOf(arr, c, k) { return arr.indexOf(c); }
        function lmTimeAlive() { return 0; } /* the time alive (timealive.js tests it) */
        function lmIdxRemove(arr, c) { var i = arr.indexOf(c); if (i >= 0) arr.splice(i, 1); }
        function ogarbasicassembly(id, x, y, size, color, isFood, isVirus, a, b, c) {
            this.id = id; this.x = x; this.y = y; this.size = size; this.color = color;
            this.isFood = !!isFood; this.isVirus = !!isVirus; this.isPlayerCell = false; this.targetNick = '';
        }
        ogarbasicassembly.prototype.removeCell = function () {
            var app = window.app;
            this.removed = true;
            if (this.isPlayerCell) { lmIdxRemove(app.playerCells, this); app.removePlayerCell = true; }
            lmIdxRemove(app.cells, this); lmIdxRemove(app.food, this); lmIdxRemove(app.viruses, this);
            delete app.indexedCells[this.id];
        };
        var LM = { fbOnline: [] };
    `, ctx);
    const app = vm.runInContext('({' + body + '})', ctx);
    Object.assign(app, {
        serverType: 'senpa', indexedCells: {}, cells: [], food: [], viruses: [], playerCells: [], playerCellIDs: [], _playerCellIDSet: new Set(),
        _senpaClients: {}, _senpaPlayers: {}, _senpaMyClientID: -1, _senpaAuthSent: false, play: false, playerNick: 'me', pps: 0,
        leaderboard: [], fbOnline: [], cellsOut: 0, sent: [],
        socket: { send: (b) => app.sent.push(Array.from(new Uint8Array(b))) },
        megaFFAscore() { this.mega = (this.mega || 0) + 1; }, countPps() { this.pps++; },
        translateX: (x) => 1000 - x, translateY: (y) => 1000 - y,
        rgb2Hex: (r, g, b) => '#' + [r, g, b].map(v => ('0' + v.toString(16)).slice(-2)).join(''),
        handleLeaderboard() { }, flushCellsData() { },
    });
    ctx.app = app;
    ctx.legendmod = { vector: [[0, 0], [1, 0]], vnr: 0 };
    ctx.ctx = ctx;
    return { app, ctx };
}
/* what the packets left: the world, the stores, the map, what was sent / given to WASM */
function snap(w) {
    const a = w.app, c = w.ctx;
    const cells = Object.keys(a.indexedCells).sort((x, y) => x - y).map(k => {
        const e = a.indexedCells[k];
        return [e.id, e.x, e.y, e.size, e.color, e.isFood, e.isVirus, e.isPlayerCell, e.targetNick, e.startX, e.startY, e.startSize, e.targetX, e.targetY, e.targetSize, e.updateTime];
    });
    const ids = (l) => l.map(e => e.id);
    return JSON.stringify({
        cells, list: ids(a.cells), food: ids(a.food), viruses: ids(a.viruses), own: ids(a.playerCells), ownIds: a.playerCellIDs.slice(), ownSet: [...a._playerCellIDSet],
        clients: a._senpaClients, players: a._senpaPlayers, me: a._senpaMyClientID, auth: a._senpaAuthSent,
        map: [a.mapMinX, a.mapMinY, a.mapMaxX, a.mapMaxY, a.mapOffsetX, a.mapSize, a.mapSizeW], view: [a.viewX, a.viewY],
        og: [c.ogario.mapMaxX, c.ogario.leaderboard, c.ogario.ghostCells], pps: a.pps, mega: a.mega || 0, play: a.play,
        sent: a.sent, allocs: c.allocs, deaths: c.deaths, spawns: c.spawns, menus: c.menus, toasts: c.toasts,
        ghosts: a.imsoloGhostCells, byId: a.imsoloPlayersByID ? [...a.imsoloPlayersByID.keys()] : null, pid: a.imsoloPlayerID,
    });
}

/* ---------- Senpa packets (Delta ProtocolSenpa; u24 colours big-endian) ---------- */
class W {
    constructor() { this.b = []; }
    u8(v) { this.b.push(v & 255); return this; }
    u16(v) { return this.u8(v).u8(v >> 8); }
    u24(v) { return this.u8(v >> 16).u8(v >> 8).u8(v); }
    u32(v) { return this.u16(v & 0xffff).u16(v >>> 16); }
    i32(v) { return this.u32(v >>> 0); }
    s16(s) { this.u8(s.length); for (const ch of s) this.u16(ch.charCodeAt(0)); return this; }
    s8(s) { this.u8(s.length); for (const ch of s) this.u8(ch.charCodeAt(0)); return this; }
    z(s) { for (const ch of s) this.u8(ch.charCodeAt(0)); return this.u8(0); }
    get bytes() { return this.b.slice(); }
}
const init = new W().u8(0).u32(14142).u16(7).u8(2).u16(1).u16(2).bytes;
const resize = new W().u8(1).u32(9000).bytes;
const clients = new W().u8(10)
    .u8(2).u16(7).u8(0).s16('Me').s16('T').u24(0x112233).u8(0).s16('LC').u16(8).u8(1).s16('Bot').s16('').u24(0x445566).u8(1).s16('')
    .u8(1).u16(8).u8(1 | 4 | 8).s16('Bot2').u24(0x778899).u8(0).s16('X')
    .u8(0).bytes;
const players = new W().u8(11)
    .u8(2).u16(1).u16(7).u24(0xaabbcc).s8('skin1').u32(3).u16(2).u16(8).u24(0x010203).s8('').u32(0)
    .u8(1).u16(2).u8(1 | 2 | 4).u24(0x0a0b0c).s8('s2').u32(9)
    .u8(0).bytes;
/* records with their byte ranges, so the expected outcome of every cut is known */
function world(spec) {
    const w = new W().u8(20), marks = [];
    w.u16(spec.eat.length); spec.eat.forEach(e => w.u32(e[0]).u32(e[1]));
    marks.push({ end: w.b.length + 2, kind: 'eatsec' });
    w.u16(spec.add.length);
    spec.add.forEach(c => {
        w.u32(c.id).i32(c.x).i32(c.y).u16(c.size).u8(c.type);
        if (c.type === 0) w.u16(c.pid).u24(c.color);
        else if (c.type === 2) w.u24(c.color);
        else if (c.type === 5) { w.u16(c.ac.length); c.ac.forEach(v => w.u8(v)); }
        marks.push({ end: w.b.length, kind: 'add', id: c.id, type: c.type });
    });
    w.u16(spec.move.length); spec.move.forEach(m => w.u32(m[0]).i32(m[1]).i32(m[2]).u16(m[3]));
    marks.push({ end: w.b.length, kind: 'movesec' });
    w.u16(spec.rem.length + (spec.remZero ? 1 : 0)); spec.rem.forEach(id => w.u32(id));
    if (spec.remZero) w.u32(0);
    marks.push({ end: w.b.length, kind: 'remsec' });
    (spec.extra || []).forEach(v => w.u8(v));
    return { bytes: w.bytes, marks };
}
const w1 = world({ eat: [], add: [
    { id: 101, x: 500, y: 600, size: 40, type: 0, pid: 1, color: 0xff0000 },
    { id: 102, x: -20, y: 30, size: 10, type: 3 },
    { id: 103, x: 700, y: 700, size: 100, type: 1 },
    { id: 104, x: 650, y: 610, size: 15, type: 2, color: 0x00ff00 },
    { id: 105, x: 1, y: 2, size: 3, type: 5, ac: [9, 8, 7, 6] },
    { id: 5024, x: 0, y: 0, size: 1, type: 4 },
    { id: 106, x: 900, y: 100, size: 60, type: 0, pid: 2, color: 0x0000ff },
], move: [], rem: [] });
const w2 = world({ eat: [[101, 102], [999, 104]], add: [{ id: 107, x: 10, y: 20, size: 30, type: 2, color: 0x123456 }],
    move: [[101, 510, 605, 44], [103, 700, 690, 101], [4242, 1, 1, 1]], rem: [106, 777], remZero: true, extra: [0, 0, 0, 0, 1, 0x10, 0x27, 0, 0] });
const w3 = world({ eat: [[106, 101]], add: [], move: [[103, 1, 2, 3]], rem: [], extra: [] });
const lb = new W().u8(21).u8(2).u16(7).u32(500).u16(8).u32(20).bytes;
const mini = new W().u8(22).u8(2).u16(1).i32(10).i32(20).u16(30).u16(2).i32(-5).i32(7).u16(9).bytes;
const spectPt = new W().u8(23).i32(400).i32(300).bytes;
const captcha = new W().u8(7).u8(0).u8(2).bytes;
const timeLeft = new W().u8(5).u32(77).bytes;
const SENPA = [['init', init], ['resize', resize], ['clients', clients], ['players', players], ['world add', w1.bytes], ['world eat/move/remove', w2.bytes],
    ['world own death', w3.bytes], ['leaderboard', lb], ['minimap', mini], ['spectate point', spectPt], ['captcha', captcha], ['time left', timeLeft]];

/* ---------- Imsolo / Agar2 ghost cells (252): u16 n x {u16 player, i32 x, i32 y, i32 mass, color\0, name\0} ---------- */
const ghost = (recs, count) => {
    const w = new W().u8(252).u16(count == null ? recs.length : count);
    recs.forEach(r => w.u16(r[0]).i32(r[1]).i32(r[2]).i32(r[3]).z(r[4]).z(r[5]));
    return w.bytes;
};
const g1 = ghost([[3, 100, 200, 5000, '#ff0000', 'alpha'], [4, -50, 60, 70, '#00ff00', 'beta']]);
const g2 = ghost([[5, 1, 2, 3, '#0000ff', 'gamma']]);

const feedSenpa = (w, bytes) => w.app.onMessage({ data: new Uint8Array(bytes).buffer });
const feed252 = (w, bytes) => w.app.handleMessage(new DataView(new Uint8Array(bytes).buffer));
function senpaSession(src, upto) {
    const w = makeWorld(src);
    for (let i = 0; i < SENPA.length && i < (upto == null ? SENPA.length : upto); i++) { w.ctx.clock += 40; feedSenpa(w, SENPA[i][1]); }
    return w;
}
function ghostSession(src, extra) {
    const w = makeWorld(src);
    w.app.serverType = 'imsolo';
    /* a nameless cell of player 4: the ghost list names it */
    w.app.cells.push({ id: 1, imsoloOwnerID: 4, name: '' }, { id: 2, imsoloOwnerID: 9, name: '' });
    [g1].concat(extra || []).forEach(p => feed252(w, p));
    return w;
}
const ghostSnap = (w) => snap(w) + JSON.stringify(w.app.cells.map(c => c.name));

/* ---------- 1. golden: the same world as before the checks ---------- */
/* Each step's snapshot hashed (FNV-1a) with the handlers before the checks (6c9f13cf). */
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16); };
function goldenTrace(src) {
    const w = makeWorld(src), out = [];
    SENPA.forEach(([n, b]) => { w.ctx.clock += 40; feedSenpa(w, b); out.push(n + ':' + fnv(snap(w))); });
    const g = ghostSession(src, [g2]);
    out.push('ghosts:' + fnv(ghostSnap(g)));
    return out;
}
const GOLDEN = ['init:cf611d7e', 'resize:da587e2d', 'clients:f65ce955', 'players:481982e2', 'world add:4302a5e3', 'world eat/move/remove:feef68de',
    'world own death:5bccba3a', 'leaderboard:6e0618e', 'minimap:6f6513a8', 'spectate point:5b2dfb59', 'captcha:f4635dbc', 'time left:f4635dbc', 'ghosts:6cc3260b'];
const trace = goldenTrace(SRC);
if (args.includes('--print-golden')) console.log(JSON.stringify(trace));
check('golden: every valid Senpa and ghost-cell packet leaves the same world as before (' + trace.length + ' steps)', JSON.stringify(trace) === JSON.stringify(GOLDEN));
if (OLD) check('golden: the same world as --old step by step', JSON.stringify(goldenTrace(OLD)) === JSON.stringify(trace));
{
    const w = senpaSession(SRC);
    const a = w.app;
    check('golden: cells added with their types, the sentinel skipped, own cell tracked, moves and removals applied',
        !a.indexedCells[5024] && !a.indexedCells[106] && !a.indexedCells[102] && !a.indexedCells[101] && a.indexedCells[103].targetY === 2 && !!a.indexedCells[107] && w.ctx.deaths === 1 && w.ctx.spawns === 1);
    check('golden: anti-cheat array given whole, packets/s counted once per world update', JSON.stringify(w.ctx.allocs) === JSON.stringify([[8, [9, 8, 7, 6]]]) && a.pps === 3);
    check('golden: no truncation warning for valid packets', !w.ctx.warns.some(s => /truncated/.test(s)));
}

/* ---------- 2. every truncation boundary ---------- */
{
    let thrown = 0, changed = 0, counted = 0, cases = 0, half = 0, moveSplit = 0, allocBad = 0;
    SENPA.forEach(([name, bytes], idx) => {
        const base = senpaSession(SRC, idx);
        const before = snap(base);
        for (let L = 1; L < bytes.length; L++) {
            const w = senpaSession(SRC, idx);
            const pps0 = w.app.pps;
            try { feedSenpa(w, bytes.slice(0, L)); } catch (e) { thrown++; continue; }
            cases++;
            /* a world update is whole once its removals are (what follows is optional) */
            const spec0 = bytes[0] !== 20 ? null : name === 'world add' ? w1 : name === 'world own death' ? w3 : w2;
            const whole = !!spec0 && L >= spec0.marks.find(m => m.kind === 'remsec').end;
            if ((w.app.pps !== pps0) !== whole) counted++;
            if (whole) continue;
            if (bytes[0] !== 20) { if (snap(w) !== before && !(bytes[0] === 10 || bytes[0] === 11)) changed++; continue; }
            /* world update: what its cut allows, and nothing of a record that is not whole */
            const spec = name === 'world add' ? w1 : name === 'world own death' ? w3 : w2;
            const eatEnd = spec.marks[0].end;
            if (L < eatEnd) { if (snap(w) !== before) changed++; continue; }
            spec.marks.filter(m => m.kind === 'add').forEach(m => {
                const has = !!w.app.indexedCells[m.id] || m.id === 5024;
                if ((m.end <= L) !== has && m.id !== 5024) half++;
            });
            const moveEnd = spec.marks.find(m => m.kind === 'movesec').end;
            if (name === 'world eat/move/remove') {
                const c101 = w.app.indexedCells[101], c103 = w.app.indexedCells[103];
                const moved = [c103 && c103.targetSize === 101].filter(Boolean).length;
                if (L < moveEnd && moved) moveSplit++;
                void c101;
            }
            if (w.ctx.allocs.some(x => x[0] === 8 && x[1].length !== 4)) allocBad++;
        }
    });
    check('truncation: no cut packet throws out of the Senpa handler (' + cases + ' cuts)', thrown === 0);
    check('truncation: a cut packet is not counted in packets/s (a world update cut only in its optional extras is whole and counted)', counted === 0);
    check('truncation: a cut world update whose eat events do not fit, and any other cut packet but 10/11, changes nothing', changed === 0);
    check('truncation: an added cell exists exactly when its whole record was there', half === 0);
    check('truncation: moves are applied all or none', moveSplit === 0);
    check('truncation: the anti-cheat array is never given cut short', allocBad === 0);
}
/* client / player store updates (10 / 11) are records applied one by one; a cut keeps whole ones only */
{
    let bad = 0;
    for (let L = 1; L < clients.length; L++) {
        const w = senpaSession(SRC, 2);
        try { feedSenpa(w, clients.slice(0, L)); } catch (e) { bad++; continue; }
        for (const k in w.app._senpaClients) { const c = w.app._senpaClients[k]; if (typeof c.name !== 'string' || typeof c.color !== 'number') bad++; }
    }
    check('truncation: a cut clients update stores whole records only', bad === 0);
}
/* the death check still runs after a cut that came after an own cell was eaten */
{
    const w = senpaSession(SRC, 6);
    const own = w.app.playerCells.length;
    const cut = w3.bytes.slice(0, w3.marks[0].end + 1);
    let threw = false;
    try { feedSenpa(w, cut); } catch (e) { threw = true; }
    check('truncation: own cell eaten, packet cut after it: the death is still seen (was missed until the next removal)', !threw && own === 1 && w.ctx.deaths === 1 && w.app.play === false);
}

/* ---------- 3. malformed counts, types, lengths ---------- */
{
    const cases = [
        ['eat count 65535 in a small packet', new W().u8(20).u16(65535).u32(101).u32(102).u16(0).u16(0).u16(0).bytes, true],
        ['added count 65535, one record', new W().u8(20).u16(0).u16(65535).u32(300).i32(1).i32(1).u16(5).u8(1).u16(0).u16(0).bytes, false],
        ['moved count larger than its records', new W().u8(20).u16(0).u16(0).u16(9).u32(103).i32(5).i32(5).u16(5).u16(0).bytes, false],
        ['anti-cheat length past the end', new W().u8(20).u16(0).u16(1).u32(301).i32(1).i32(1).u16(5).u8(5).u16(500).u8(1).u8(2).bytes, false],
        ['player cell without its colour', new W().u8(20).u16(0).u16(1).u32(302).i32(1).i32(1).u16(5).u8(0).u16(1).bytes, false],
        ['removed count without records and no 0', new W().u8(20).u16(0).u16(0).u16(0).u16(3).u32(103).bytes, false],
        ['init with a player count past the end', new W().u8(0).u32(5000).u16(1).u8(9).u16(1).bytes, true],
        ['clients with a nick length past the end', new W().u8(10).u8(1).u16(30).u8(0).u8(200).u16(65).bytes, true],
        ['leaderboard count past the end', new W().u8(21).u8(50).u16(7).u32(1).bytes, true],
        ['minimap count past the end', new W().u8(22).u8(9).u16(1).i32(1).i32(1).u16(1).bytes, true],
    ];
    cases.forEach(([n, b, same]) => {
        const w = senpaSession(SRC, 5), before = snap(w), pps = w.app.pps;
        let threw = false;
        try { feedSenpa(w, b); } catch (e) { threw = true; }
        const after = snap(w);
        let ok = !threw && w.app.pps === pps && (!same || after === before);
        if (n.startsWith('added count')) ok = ok && !!w.app.indexedCells[300];
        if (n.startsWith('moved count')) ok = ok && w.app.indexedCells[103].targetSize !== 5;
        if (n.startsWith('anti-cheat')) ok = ok && !w.ctx.allocs.some(x => x[1].length === 2) && !w.app.indexedCells[301];
        if (n.startsWith('player cell')) ok = ok && !w.app.indexedCells[302];
        if (n.startsWith('removed count')) ok = ok && !w.app.indexedCells[103];
        check('malformed: ' + n, ok);
    });
    /* a removal list ended by 0 before its count is valid (Delta reads it the same way) */
    const w = senpaSession(SRC, 5), pps = w.app.pps;
    try { feedSenpa(w, new W().u8(20).u16(0).u16(0).u16(0).u16(5).u32(103).u32(0).bytes); } catch (e) { }
    check('valid: a removal list ended early by id 0 is applied and counted', !w.app.indexedCells[103] && w.app.pps === pps + 1);
    const w4 = senpaSession(SRC, 5), pps4 = w4.app.pps;
    try { feedSenpa(w4, new W().u8(20).u16(0).u16(0).u16(0).u16(0).u8(1).u32(9000).bytes); } catch (e) { }
    check('valid: extra bytes after the removals (active tab, border) are ignored, the update counted', w4.app.pps === pps4 + 1 && w4.ctx.warns.length === 0);
}

/* ---------- 4. Imsolo / Agar2 ghost cells (252) ---------- */
{
    const ref = ghostSession(SRC);
    const refSnap = ghostSnap(ref);
    check('ghosts: the whole list is used and names a nameless cell of its player', ref.app.imsoloGhostCells.length === 2 && ref.app.cells[0].name === 'beta' && ref.app.cells[1].name === '');
    let bad = 0, thrown = 0;
    for (let L = 1; L < g2.length; L++) {
        const w = ghostSession(SRC);
        try { feed252(w, g2.slice(0, L)); } catch (e) { thrown++; continue; }
        if (ghostSnap(w) !== refSnap) bad++;
    }
    check('ghosts: every cut of a ghost packet keeps the previous list and names, nothing thrown', bad === 0 && thrown === 0);
    const w = ghostSession(SRC, [ghost([[5, 1, 2, 3, '#0000ff', 'gamma']], 3)]);
    check('ghosts: a count larger than its records keeps the previous list', ghostSnap(w) === refSnap);
    const named = ghostSession(SRC);
    named.app.cells[0].name = '';
    feed252(named, ghost([[4, 1, 2, 3, '#0000ff', 'del']]).slice(0, -1));
    check('ghosts: a name without its terminator is not given to a cell', named.app.cells[0].name === '');
    const w0 = ghostSession(SRC, [ghost([])]);
    check('ghosts: an empty list is valid and clears the list', w0.app.imsoloGhostCells.length === 0 && w0.app.imsoloPlayersByID.size === 0);
    const other = makeWorld(SRC);
    other.app.serverType = 'agario';
    feed252(other, g1);
    check('ghosts: other servers ignore opcode 252 as before', other.app.imsoloGhostCells === undefined);
}

/* ---------- 4b. delt.io leaderboard (53) and Imsolo / Agar2 party friend (251) ---------- */
/* 53 (Delta ProtocolLegacy.writeLeaderboard): records until the end {u8 flags 2|4, name\0, u32 player id};
 * our own row is the one whose id is the account id of our cell. 251: u8 has, [i32 x, i32 y, nick\0, skin\0]. */
const lb53 = (rows) => { const w = new W().u8(53); rows.forEach(r => w.u8(6).z(r[0]).u32(r[1])); return w.bytes; };
const lbA = lb53([['Alpha', 11], ['Me', 22], ['Gamma', 33]]);
const pf = (x, y, nick, skin) => new W().u8(251).u8(1).i32(x).i32(y).z(nick).z(skin).bytes;
const pfA = pf(120, -40, 'Buddy', 'sk1');
function lbSession(src) {
    const w = makeWorld(src);
    Object.assign(w.app, { serverType: 'deltio', playerNick: 'me', playerCellIDs: [5], fbOnline: [], leaderboard: [{ nick: 'old', id: 1 }], friends: 0, playerPosition: 7, lbShown: 0 });
    w.app.indexedCells[5] = { id: 5, accID: 22 };
    w.app.handleLeaderboard = function () { this.lbShown++; };
    return w;
}
const lbSnap = (w) => JSON.stringify([w.app.leaderboard, w.app.friends, w.app.playerPosition, w.app.lbShown]);
function pfSession(src, first) {
    const w = makeWorld(src);
    w.app.serverType = 'agar2';
    if (first) feed252(w, first);
    return w;
}
{
    const w = lbSession(SRC);
    feed252(w, lbA);
    const l = w.app.leaderboard;
    check('delt.io board: the whole board is shown, our row found by its account id', l.length === 3 && l[1].id === 'isPlayer' && l[1].nick === 'me' && l[0].nick === 'Alpha' && l[2].id === 33 && w.app.playerPosition === 2 && w.app.lbShown === 1);
    if (OLD) { const o = lbSession(OLD); feed252(o, lbA); check('delt.io board: a valid board gives the same as --old', lbSnap(o) === lbSnap(w)); }
    const ref = lbSnap(lbSession(SRC));
    let bad = 0, thrown = 0, nameCut = 0;
    for (let L = 2; L < lbA.length; L++) {
        const c = lbSession(SRC);
        try { feed252(c, lbA.slice(0, L)); } catch (e) { thrown++; continue; }
        /* cut just after a whole record: a shorter board that is still whole */
        const whole = L === 1 + 11 || L === 1 + 11 + 8;
        if (!whole && lbSnap(c) !== ref) bad++;
        if (c.app.leaderboard.some(r => r.nick && ['Alpha', 'Me', 'Gamma', 'me', 'old'].indexOf(r.nick) === -1)) nameCut++;
    }
    check('delt.io board: every cut keeps the previous board, nothing thrown, no name shown cut short', bad === 0 && thrown === 0 && nameCut === 0);
    const e0 = lbSession(SRC); feed252(e0, [53]);
    check('delt.io board: an empty board is valid', e0.app.leaderboard.length === 0 && e0.app.lbShown === 1);
    const ag = lbSession(SRC); ag.app.serverType = 'agario'; feed252(ag, lbA);
    check('agar.io board: the same layout reads the same (no own row without flag 8)', ag.app.leaderboard.length === 3 && ag.app.leaderboard[1].id === 22);
    /* rows with a name only (flag 2, no id after it): a cut inside the last name is not caught
     * by a missing id (delt.io always sends the id, so its boards were already kept whole) */
    const nameOnly = new W().u8(53).u8(2).z('Alpha').u8(2).z('Beta').bytes;
    let shown = 0;
    for (let L = 9; L < nameOnly.length; L++) {
        const c = lbSession(SRC); c.app.serverType = 'agario';
        feed252(c, nameOnly.slice(0, L));
        if (c.app.leaderboard.some(r => r.nick && r.nick !== 'Beta' && r.nick.length < 4 && r.nick !== 'old')) shown++;
    }
    const full = lbSession(SRC); full.app.serverType = 'agario'; feed252(full, nameOnly);
    check('agar.io board: a name cut at the end of the packet is not shown, the previous board stays (was: "B", "Be", "Bet" shown)', shown === 0 && full.app.leaderboard.map(r => r.nick).join() === 'Alpha,Beta');
}
{
    const w = pfSession(SRC, pfA);
    const f = w.app.imsoloPartyFriend;
    check('party friend: a whole record is stored', !!f && f.x === 120 && f.y === -40 && f.nick === 'Buddy' && f.skin === 'sk1');
    if (OLD) { const o = pfSession(OLD, pfA); check('party friend: a valid record gives the same as --old', JSON.stringify(o.app.imsoloPartyFriend) === JSON.stringify(f)); }
    const pfB = pf(7, 8, 'Other', 'sk2');
    let bad = 0, thrown = 0;
    for (let L = 1; L < pfB.length; L++) {
        const c = pfSession(SRC, pfA);
        try { feed252(c, pfB.slice(0, L)); } catch (e) { thrown++; continue; }
        if (JSON.stringify(c.app.imsoloPartyFriend) !== JSON.stringify(f)) bad++;
    }
    check('party friend: every cut keeps the previous friend, nothing thrown (was: a cut nick or skin was stored)', bad === 0 && thrown === 0);
    const off = pfSession(SRC, pfA); feed252(off, [251, 0]);
    check('party friend: has 0 clears the friend', off.app.imsoloPartyFriend === null);
    const empty = pfSession(SRC, pf(1, 2, '', ''));
    check('party friend: empty nick and skin are valid', !!empty.app.imsoloPartyFriend && empty.app.imsoloPartyFriend.nick === '');
}

/* ---------- 5. bounded fuzz (seeded): no throw, bounded memory ---------- */
{
    let seed = 12345;
    const rnd = () => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296;
    const w = senpaSession(SRC);
    const g = ghostSession(SRC);
    let thrown = 0, n = 0;
    const heap0 = process.memoryUsage().heapUsed;
    const pool = SENPA.map(x => x[1]).concat([g1, g2]);
    for (let i = 0; i < 20000; i++) {
        const src = pool[(rnd() * pool.length) | 0];
        let b = src.slice(0, 1 + ((rnd() * src.length) | 0));
        const flips = (rnd() * 4) | 0;
        for (let f = 0; f < flips; f++) b[1 + ((rnd() * (b.length - 1)) | 0)] = (rnd() * 256) | 0;
        if (rnd() < 0.2) b = [b[0]].concat(Array.from({ length: (rnd() * 64) | 0 }, () => (rnd() * 256) | 0));
        try { if (b[0] === 252) feed252(g, b); else feedSenpa(w, b); n++; } catch (e) { thrown++; }
    }
    /* the handleMessage records of 4b, mutated and cut */
    const lbW = lbSession(SRC), pfW = pfSession(SRC, pfA);
    let thrown2 = 0;
    for (let i = 0; i < 5000; i++) {
        const src = (i & 1) ? pfA : lbA;
        const b = src.slice(0, 1 + ((rnd() * src.length) | 0));
        const flips = (rnd() * 4) | 0;
        for (let f = 0; f < flips; f++) b[1 + ((rnd() * (b.length - 1)) | 0)] = (rnd() * 256) | 0;
        try { feed252((i & 1) ? pfW : lbW, b); } catch (e) { thrown2++; }
    }
    check('fuzz: 5000 mutated and cut delt.io boards / party friend packets, none throws', thrown2 === 0);
    const cellsN = Object.keys(w.app.indexedCells).length;
    const grow = (process.memoryUsage().heapUsed - heap0) / 1048576;
    check('fuzz: 20000 mutated and cut packets, none throws out of a handler', thrown === 0 && n === 20000);
    check('fuzz: memory stays bounded (' + cellsN + ' cells, ' + grow.toFixed(1) + ' MB heap change)', cellsN < 70000 && grow < 200);
    check('fuzz: no error logged besides the truncation warnings', !w.ctx.warns.concat(g.ctx.warns).some(s => s.startsWith('ERROR')));
}

/* ---------- 6. cost on valid packets ---------- */
function bench(src) {
    const w = senpaSession(src, 6);
    /* a busy update: 200 moves of known cells, 50 adds, 20 eats, 20 removals */
    const add = [], move = [], eat = [], rem = [];
    for (let i = 0; i < 50; i++) add.push({ id: 2000 + i, x: i, y: i, size: 20, type: i % 3 === 0 ? 0 : 3, pid: 1, color: 0x334455 });
    for (let i = 0; i < 200; i++) move.push([2000 + (i % 50), i, i, 21]);
    for (let i = 0; i < 20; i++) eat.push([2000 + i, 3000 + i]);
    for (let i = 0; i < 20; i++) rem.push(4000 + i);
    const p = new Uint8Array(world({ eat, add, move, rem }).bytes).buffer;
    const t = process.hrtime.bigint();
    for (let i = 0; i < 1500; i++) w.app.onMessage({ data: p });
    return Number(process.hrtime.bigint() - t) / 1500 / 1000;
}
if (args.includes('--bench') && OLD) {
    const r = { old: [], neu: [] };
    /* alternating, the order switched each round */
    for (let k = 0; k < 11; k++) {
        if (k & 1) { r.neu.push(bench(SRC)); r.old.push(bench(OLD)); } else { r.old.push(bench(OLD)); r.neu.push(bench(SRC)); }
    }
    const med = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];
    console.log('bench: busy Senpa world update (290 records), median of 11 alternating runs: before ' + med(r.old).toFixed(2) + ' us, after ' + med(r.neu).toFixed(2) + ' us per packet');
}

console.log(fail ? fail + ' check(s) failed' : 'all private-server packet checks passed');
process.exit(fail ? 1 : 0);
