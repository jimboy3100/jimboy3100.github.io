/* Malformed world updates on agar.io / Expanding Land / private servers (the normal parser):
 * the real handleMessage, handleSubmessage, decompressMessage, updateCells,
 * _lmCellIdentityScan and flushCellsData of ogario/ogario.v4.js run in a vm with the site's own
 * Buffer (extras/buffer.js) and are fed
 *   - golden packets: the 979 world updates of the real recording extras/jim.lm (private server,
 *     protocol 6 records) and agar.io / Expanding Land packets written to the layouts below,
 *     plain (opcode 16) and LZ4 compressed (opcode 255); the world they build must stay exactly
 *     the one of the parser before this check (GOLDEN digests),
 *   - every truncation of them, malformed counts, flags and string terminators, a bounded fuzz.
 * A packet cut short must change nothing it has not read in full: no eat, record or removal
 * from a section the packet does not hold whole. It never throws out of handleMessage.
 *
 * Opcode 16 layout (agar.io, Expanding Land packet.c pkt_update_nodes_full, MultiOgar):
 *   u16 eatCount, eatCount x {u32 eater, u32 victim}
 *   records until u32 id 0: u32 id, i32 x, i32 y, u16 size, u8 flags,
 *     agar.io / EL: [u8 ext if flags&0x80], [rgb if flags&2], [skin\0 if 4], [name\0 if 8], [u32 account if ext&4]
 *     protocol 6-10 (private, imsolo, agar2): [rgb if 2], [skin\0 if 4], [name\0 if 8], [u16 owner if 0x40], [u16 type, party\0 if 0x80]
 *   u16 removeCount, removeCount x u32 id
 * Opcode 255: u8 255, u32 LE decompressed size, LZ4 block of the inner packet (16 or 64).
 * Opcode 49 (Expanding Land pkt_leaderboard_ffa, MultiOgar): u32 count, count x {u32 isMe, name\0}.
 *
 * node developers/tests/malformed.js [ogario.v4.js] [--old old-ogario.v4.js] (--old: also time
 * the valid packets with that version) */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const oldAt = args.indexOf('--old');
const oldFile = oldAt >= 0 ? args.splice(oldAt, 2)[1] : null;
const srcFile = args[0] || path.join(root, 'ogario', 'ogario.v4.js');
const bufferSrc = fs.readFileSync(path.join(root, 'extras', 'buffer.js'), 'utf8');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function parts(src) {
    src = src.replace(/\r\n/g, '\n');
    const cut = (from, to) => { const a = src.indexOf(from), b = src.indexOf(to, a); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };
    const block = (from) => {
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
    };
    const p = {
        dm: cut('        decompressMessage(message) {\n', '        /* ── Expanding Land: Handle map resize'),
        hm: cut('        handleMessage(data) {\n', '        countPps() {'),
        sub: cut('        handleSubmessage(message) {\n', '        handleLeaderboard() {'),
        uc: cut('        _lmCellIdentityScan(view, offset) {\n', '        sortCells() {'),
        fl: cut('        flushCellsData(preserveMapGeometry) {\n', '        /* Spectator toggles'),
        isEl: block('function _isExpandingLandClient('),
        helpers: cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool'),
    };
    for (const k in p) if (!p[k]) { console.log('FAIL ' + k + ' not found in ' + srcFile); process.exit(1); }
    /* the spawn (opcode 32) ends every spectate mode through this method (versions before it: none) */
    p.sp = block('        _lmSpawnEndsSpectate() {');
    return p;
}

/* one game client of the given source, with stubs for everything around the parser */
function client(src) {
    const p = parts(src);
    const noop = function () { };
    const g = {
        console: { log: noop, info: noop, warn: (...a) => g.warns.push(a.join(' ')), error: (...a) => g.errors.push(a.join(' ')) }, warns: [], errors: [],
        Math, Date, JSON, Object, Array, Map, Set, Number, String, Boolean, Uint8Array, Uint16Array, Uint32Array, Int32Array, Float32Array, Float64Array,
        DataView, ArrayBuffer, TextDecoder, RangeError, TypeError, Error, isFinite, isNaN, escape, unescape, decodeURIComponent, encodeURIComponent,
        parseInt, parseFloat, Infinity, NaN, undefined, performance, setTimeout: () => 0, clearTimeout: noop, Symbol, Reflect, Proxy, Promise, WebAssembly,
        atob: (s) => Buffer.from(s, 'base64').toString('latin1')
    };
    g.window = g; g.self = g; g.global = g;
    vm.createContext(g);
    vm.runInContext(bufferSrc, g);
    g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
    g.defaultmapsettings = { recordReplays: false };
    g.$ = () => new Proxy({}, { get: (t, k) => k === 'val' ? () => '' : () => g.$() });
    g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0 }, { get: (t, k) => k in t ? t[k] : noop });
    g.drawRender = new Proxy({}, { get: () => noop });
    g.core = new Proxy({}, { get: () => noop });
    g.userBots = { startedBots: false };
    g.profiles = [];
    g.spects = [];
    g.ogarbasicassembly = function (id, x, y, size, color, isFood, isVirus) {
        Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, targetSize: size, isPlayerCell: false, targetNick: '', skin: null });
        this.removeCell = function () {
            this.removed = true;
            const L = g.LM;
            for (const k of ['cells', 'food', 'viruses', 'playerCells']) { const i = L[k].indexOf(this); if (i !== -1) L[k].splice(i, 1); }
            delete L.indexedCells[this.id];
        };
    };
    vm.runInContext(p.helpers + '\n' + [...p.helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' ') + '\n' + p.isEl + '\nthis._isExpandingLandClient = _isExpandingLandClient;', g);
    g.__h = null;
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop });
    vm.runInContext('with (__env) { __h = ({' + [p.dm, p.hm, p.sub, p.uc, p.fl].concat(p.sp ? [p.sp] : []).join(',\n') + '}); }', g);
    const L = g.__h;
    L.pps = 0;
    Object.assign(L, {
        countPps() { this.pps++; }, megaFFAscore: noop, vanillaskins: noop, setMapOffset: noop, flushSpecsData: noop, _lmOnServerBorder: noop,
        handleLeaderboard() { this.lbShown = (this.lbShown || 0) + 1; }, translateX: (v) => v, translateY: (v) => v,
        rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join(''), _lmKeepMainSuppressed: () => true,
        isInView: () => true, calculatebgpi: () => 4
    });
    g.legendmod = g.LM = L;
    L.g = g;
    return L;
}
function reset(L, kind) {
    Object.assign(L, {
        serverType: kind, isLegendWorld: kind === 'expandingland', connectionIntegrity: kind === 'agario', integrity: kind === 'agario',
        gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [], friends: 0, playerPosition: 0, lbShown: 0,
        cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: {}, playerCellsMulti: [],
        vector: [[0, 0]], vnr: 0, play: false, time: 0, mapEvent: {}, decayInfo: {}, ghostCells: [], pps: 0,
        _lmCellIdentity: undefined, _spawnTransitGate: false, _playerCellIDSet: undefined
    });
    L.g.mainPlayerDeadMbActive = false;
    L.g.errors.length = 0;
    return L;
}
/* the world as the renderer sees it (never the test's own stub fields) */
function state(L) {
    const cells = Object.keys(L.indexedCells).map(Number).sort((a, b) => a - b).map(id => {
        const c = L.indexedCells[id];
        return [id, c.targetX, c.targetY, c.targetSize, c.x, c.y, c.color, c.skin, c.targetNick, !!c.isFood, !!c.isVirus, !!c.isEjected, !!c.removed, c.accID, !!c.isPlayerCell, c.imsoloOwnerID, !!c.isFriend];
    });
    const idm = L._lmCellIdentity ? [...L._lmCellIdentity.entries()].sort((a, b) => a[0] - b[0]) : null;
    return JSON.stringify({
        cells, n: [L.cells.length, L.food.length, L.viruses.length, L.playerCells.length], pc: L.playerCellIDs.slice(), idm,
        lb: L.leaderboard, lbShown: L.lbShown, play: L.play, pps: L.pps
    });
}
const digest = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

/* ---- packets ---- */
function writer() {
    const b = [];
    const w = {
        b, u8: (v) => (b.push(v & 255), w), u16: (v) => (w.u8(v), w.u8(v >>> 8)), u32: (v) => { for (let i = 0; i < 4; i++) w.u8(v >>> (8 * i)); return w; },
        str: (s) => { for (const ch of Buffer.from(s, 'utf8')) w.u8(ch); return w.u8(0); }
    };
    return w;
}
const view = (bytes) => new DataView(new Uint8Array(bytes).buffer);
/* opcode 16, agar.io / Expanding Land records (legacy: protocol 6-10 records); `marks` gets the
 * byte offset where each section and record ends */
function world(eats, recs, removes, legacy, marks) {
    const w = writer();
    w.u8(16).u16(eats.length);
    eats.forEach(e => { w.u32(e[0]); w.u32(e[1]); });
    if (marks) marks.eats = w.b.length;
    if (marks) marks.recs = [];
    recs.forEach(r => {
        let flags = (r.virus ? 1 : 0) | (r.color ? 2 : 0) | (r.skin != null ? 4 : 0) | (r.name != null ? 8 : 0) | (r.ejected ? 32 : 0);
        let ext = (r.food ? 1 : 0) | (r.friend ? 2 : 0) | (r.acc != null ? 4 : 0);
        if (legacy) flags |= (r.owner ? 0x40 : 0) | (r.type != null ? 0x80 : 0);
        else if (ext || r.ext0) flags |= 0x80;
        w.u32(r.id).u32(r.x || 0).u32(r.y || 0).u16(r.size || 100).u8(flags);
        if (!legacy && (flags & 0x80)) w.u8(ext);
        if (r.color) r.color.forEach(w.u8);
        if (r.skin != null) w.str(r.skin);
        if (r.name != null) w.str(r.name);
        if (legacy && r.owner) w.u16(r.owner);
        if (legacy && r.type != null) { w.u16(r.type); w.str(r.party || ''); }
        if (!legacy && r.acc != null) w.u32(r.acc);
        if (marks) marks.recs.push(w.b.length);
    });
    w.u32(0);
    if (marks) marks.term = w.b.length;
    w.u16(removes.length); removes.forEach(w.u32);
    if (marks) marks.end = w.b.length;
    return w.b;
}
function board49(rows) {
    const w = writer();
    w.u8(49).u32(rows.length);
    rows.forEach(r => { w.u32(r[0]); w.str(r[1]); });
    return w.b;
}
/* LZ4 block (greedy, 4-byte hash, the end rules of the format: last 5 bytes literals, no match
 * starting in the last 12) */
function lz4(src) {
    const out = [], n = src.length, table = new Map();
    let anchor = 0, i = 0;
    const len = (v) => { for (; v >= 255; v -= 255) out.push(255); out.push(v); };
    const seq = (litEnd, off, mlen) => {
        const lit = litEnd - anchor;
        out.push((Math.min(lit, 15) << 4) | (mlen ? Math.min(mlen - 4, 15) : 0));
        if (lit >= 15) len(lit - 15);
        for (let k = anchor; k < litEnd; k++) out.push(src[k]);
        if (!mlen) return;
        out.push(off & 255, off >>> 8);
        if (mlen - 4 >= 15) len(mlen - 4 - 15);
    };
    while (i + 12 <= n) {
        const key = src[i] | (src[i + 1] << 8) | (src[i + 2] << 16) | (src[i + 3] << 24);
        const cand = table.get(key);
        table.set(key, i);
        if (cand !== undefined && i - cand <= 65535 && i - cand > 0) {
            let m = 4;
            while (i + m < n - 5 && src[cand + m] === src[i + m]) m++;
            seq(i, i - cand, m);
            i += m; anchor = i;
        } else i++;
    }
    seq(n, 0, 0);
    return out;
}
function compressed(inner) {
    const w = writer();
    w.u8(255).u32(inner.length);
    lz4(inner).forEach(w.u8);
    return w.b;
}

/* jim.lm: the packets of a real recording, read by the replay library */
function jimPackets() {
    const ctx = { console: { log() { }, info() { }, warn() { } }, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite,
        Number, String, Array, Object, Promise, URL, TextDecoder, AbortController, setTimeout, parseInt };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'replaystudio.js'), 'utf8'), ctx);
    return ctx.LMReplayStudio.lib.parseLmText(fs.readFileSync(path.join(root, 'extras', 'jim.lm'), 'utf8')).packets
        .map(d => Array.from(new Uint8Array(d.buffer, d.byteOffset, d.byteLength)));
}

/* agar.io: players with account ids and friends, food, a virus, ejected mass, eats and removes */
const AG = [
    world([], [
        { id: 11, x: 100, y: 200, size: 120, color: [200, 50, 50], skin: '%skin_a', name: 'Alpha', acc: 7001 },
        { id: 12, x: -300, y: 50, size: 90, color: [50, 200, 50], name: 'Bravo ★', acc: 7002, friend: true },
        { id: 13, x: 10, y: 10, size: 100, color: [20, 200, 20], virus: true, ext0: true },
        { id: 900, x: 5, y: 6, size: 12, color: [10, 20, 30], food: true },
        { id: 901, x: 7, y: 8, size: 12, color: [10, 20, 31], food: true },
        { id: 14, x: 40, y: 40, size: 38, color: [1, 2, 3], ejected: true }
    ], []),
    world([[11, 900]], [{ id: 11, x: 104, y: 204, size: 121 }, { id: 12, x: -296, y: 52, size: 91, acc: 7002 }], [900]),
    world([[12, 14]], [{ id: 15, x: 500, y: 500, size: 60, color: [9, 9, 9], skin: '', name: 'Charlie' }, { id: 11, x: 110, y: 210, size: 122 }], [14, 901, 4242])
];
/* Expanding Land: add records with skin and name, plain updates, food (ext 1), identity memory */
const EL = [
    world([], [
        { id: 101, x: 1000, y: 1000, size: 120, color: [200, 50, 50], skin: 'https://jimboy3000.github.io/vanillaskins/a.png', name: 'Bot ★ A' },
        { id: 102, x: 1200, y: 900, size: 90, color: [50, 200, 50], skin: '', name: 'Bot B' },
        { id: 950, x: 3, y: 4, size: 12, color: [10, 20, 30], food: true },
        { id: 951, x: 5, y: 4, size: 12, color: [10, 20, 30], food: true }
    ], []),
    world([[101, 950]], [{ id: 101, x: 1004, y: 1001, size: 121 }, { id: 102, x: 1201, y: 902, size: 91, skin: '', name: 'Bot B2' }], [950]),
    world([], [{ id: 103, x: 800, y: 800, size: 70, color: [1, 2, 3], skin: '', name: '' }, { id: 101, x: 1010, y: 1003, size: 122 }], [951])
];
/* protocol 6-10 records (imsolo / agar2 / private): owner id and cell type + party code */
const LEG = [
    world([], [
        { id: 21, x: 10, y: 20, size: 120, color: [200, 0, 0], name: 'Owner', owner: 5 },
        { id: 22, x: 30, y: 40, size: 12, color: [0, 0, 200], type: 1, party: '' },
        { id: 23, x: 50, y: 60, size: 80, color: [0, 200, 0], name: 'P', type: 0, party: 'ABCD' }
    ], [], true),
    world([[21, 22]], [{ id: 21, x: 12, y: 22, size: 121, owner: 5 }, { id: 24, x: 1, y: 1, size: 50, color: [3, 3, 3], name: '', owner: 5, type: 0, party: 'X' }], [22], true)
];
const SETS = [['agario', AG], ['expandingland', EL], ['private', LEG]];

const L = client(fs.readFileSync(srcFile, 'utf8'));
const feed = (bytes) => L.handleMessage(view(bytes));
const run = (kind, pkts) => { reset(L, kind); const out = []; for (const p of pkts) { feed(p); out.push(state(L)); } return out; };

/* ---- 1. golden packets: the same world as the parser before these checks ---- */
const JIM = jimPackets();
const GOLDEN = {
    jim: 'cef000da50f4a2d2', agario: '4bc3eda8a9df831f', expandingland: 'b9657b526225ee96', private: '90ca56fe22df407e', board: 'e3c0a026c75535fc'
};
const goldens = {};
{
    const jim = run('private', JIM);
    goldens.jim = digest(jim.join('\n'));
    check('jim.lm (' + JIM.length + ' real packets, ' + JIM.filter(p => p[0] === 16).length + ' world updates) builds the golden world (' + goldens.jim + ')', goldens.jim === GOLDEN.jim);
    check('jim.lm: nothing logged as an error', L.g.errors.length === 0 && L.cells.length > 0);
    for (const [kind, pkts] of SETS) {
        const plain = run(kind, pkts);
        goldens[kind] = digest(plain.join('\n'));
        check(kind + ': golden packets build the golden world (' + goldens[kind] + ')', goldens[kind] === GOLDEN[kind]);
        const packed = run(kind, pkts.map(compressed));
        check(kind + ': the same packets LZ4 compressed (opcode 255) build the same world', packed.join('\n') === plain.join('\n'));
        check(kind + ': nothing logged as an error', L.g.errors.length === 0);
    }
    const jimPacked = run('private', JIM.map(p => p[0] === 16 ? compressed(p) : p));
    check('jim.lm compressed: the same world', digest(jimPacked.join('\n')) === goldens.jim);
    reset(L, 'expandingland');
    feed(board49([[0, 'Bot ★ A'], [1, 'Me'], [0, 'Bot B']]));
    goldens.board = digest(state(L));
    check('opcode 49 board (Expanding Land layout) is the golden one (' + goldens.board + ')', goldens.board === GOLDEN.board && L.leaderboard.length === 3 && L.lbShown === 1);
}

/* ---- 2. every truncation of every golden packet, plain and compressed ---- */
/* Expected after a cut at byte n: sections the packet holds whole are applied, a record cut
 * short is not, a cut-short eat or remove list is not applied at all. */
function expectedCut(kind, pre, eats, recs, rems, legacy, marks, n) {
    reset(L, kind);
    pre.forEach(feed);
    if (n < marks.eats) return state(L);
    let k = 0;
    while (k < recs.length && marks.recs[k] <= n) k++;
    const whole = n >= marks.end;
    const before = L.pps;
    feed(world(eats, recs.slice(0, k), whole ? rems : [], legacy));
    if (!whole) L.pps = before; /* counted separately below */
    return state(L);
}
let cutN = 0, cutBad = [], cutThrew = 0, cutPps = [];
const truncSets = [
    ['agario', false, [AG[0]], [[11, 900], [12, 901]], [{ id: 11, x: 104, y: 204, size: 121 }, { id: 12, x: -296, y: 52, size: 91, acc: 7002, color: [5, 6, 7], skin: '%s', name: 'Bravo ★' }, { id: 16, x: 1, y: 2, size: 33, color: [4, 4, 4], acc: 9, friend: true }], [900, 13]],
    ['expandingland', false, [EL[0]], [[101, 950], [102, 951]], [{ id: 101, x: 1004, y: 1001, size: 121 }, { id: 102, x: 1201, y: 902, size: 91, skin: '', name: 'Bot B2' }, { id: 104, x: 7, y: 7, size: 60, color: [9, 8, 7], skin: 'https://jimboy3000.github.io/vanillaskins/b.png', name: 'Neu' }], [950, 102]],
    ['private', true, [LEG[0]], [[21, 22], [23, 21]], [{ id: 21, x: 12, y: 22, size: 121, owner: 5 }, { id: 24, x: 1, y: 1, size: 50, color: [3, 3, 3], name: 'Q', owner: 5, type: 0, party: 'XY' }], [22, 23]]
];
for (const [kind, legacy, pre, eats, recs, rems] of truncSets) {
    const marks = {};
    const full = world(eats, recs, rems, legacy, marks);
    for (const packed of [false, true]) {
        for (let n = 1; n < full.length; n++) {
            const want = expectedCut(kind, pre, eats, recs, rems, legacy, marks, n);
            reset(L, kind);
            pre.forEach(feed);
            const pps0 = L.pps;
            const cut = full.slice(0, n);
            try { feed(packed ? compressed(cut) : cut); } catch (e) { cutThrew++; }
            cutN++;
            const ppsAdded = L.pps - pps0;
            L.pps = pps0;
            if (state(L) !== want) cutBad.push(kind + (packed ? ' 255' : ' 16') + ' cut at ' + n + '/' + full.length);
            /* raw opcode 16 counts every packet (PPS as before), a compressed one only when it was read */
            if (ppsAdded !== (packed ? 0 : 1)) cutPps.push(kind + (packed ? ' 255' : ' 16') + ' @' + n + ' pps+' + ppsAdded);
        }
    }
}
check('every truncation (' + cutN + ' cuts, plain and compressed): no throw out of handleMessage', cutThrew === 0);
check('every truncation: only sections held whole are applied, no cut-short record, eat or remove list' + (cutBad.length ? ' (' + cutBad.length + ' wrong, e.g. ' + cutBad.slice(0, 4).join('; ') + ')' : ''), cutBad.length === 0);
check('every truncation: packets/s as before (plain opcode 16 counted, compressed not)' + (cutPps.length ? ' (' + cutPps.slice(0, 3).join('; ') + ')' : ''), cutPps.length === 0);

/* ---- 3. malformed counts, flags and terminators ---- */
function same(kind, pre, bad) {
    reset(L, kind);
    pre.forEach(feed);
    const before = state(L);
    let threw = false;
    try { feed(bad); } catch (e) { threw = true; }
    const pps = L.pps; L.pps = 0;
    const after = state(L);
    L.pps = pps;
    return !threw && after === before.replace(/"pps":\d+/, '"pps":0');
}
{
    const eatHuge = world([[11, 12]], [], [], false); eatHuge[1] = 0xff; eatHuge[2] = 0xff;
    check('eat count 65535 with one eat in the packet: no eat applied, nothing changes', same('agario', [AG[0]], eatHuge));
    const eatOne = world([[11, 12]], [], [], false).slice(0, 3 + 4);
    check('eat list cut inside its first record: nothing changes', same('agario', [AG[0]], eatOne));
    /* remove count larger than the ids it carries */
    const rem = world([], [], [11, 12], false); rem[rem.length - 10] = 9;
    reset(L, 'agario'); feed(AG[0]); feed(rem);
    check('remove count 9 with 2 ids: no cell removed', !!L.indexedCells[11] && !!L.indexedCells[12] && L.g.errors.length === 0);
    const remPartial = world([[11, 900]], [{ id: 11, x: 999, y: 999, size: 150 }], [900, 12], false); remPartial[remPartial.length - 10] = 3;
    reset(L, 'agario'); feed(AG[0]); feed(remPartial);
    check('valid eats and records with a cut-short remove list: eats and records applied, no removal',
        !L.indexedCells[900] && L.indexedCells[11] && L.indexedCells[11].targetX === 999 && !!L.indexedCells[12]);
    /* a name without its terminator: the record is not applied */
    const noTerm = world([], [{ id: 31, x: 1, y: 1, size: 50, color: [1, 1, 1], name: 'Zed' }], [], false).slice(0, -(4 + 2 + 1));
    reset(L, 'agario'); feed(noTerm);
    check('name without terminator at the end: the record is not added', !L.indexedCells[31]);
    const skinNoTerm = world([], [{ id: 32, x: 1, y: 1, size: 50, skin: 'abc' }], [], false).slice(0, -(4 + 2 + 1));
    check('skin without terminator: the record is not added', same('agario', [], skinNoTerm) || (reset(L, 'agario'), feed(skinNoTerm), !L.indexedCells[32]));
    /* account id flag (ext 4) without its 4 bytes: the cell is not created half-read */
    const accCut = world([], [{ id: 33, x: 1, y: 1, size: 50, color: [1, 1, 1], name: 'Acc', acc: 0x01020304 }], [], false);
    const accShort = accCut.slice(0, accCut.length - 6 - 2);
    reset(L, 'agario'); feed(accShort);
    check('agar.io account id flag without its 4 bytes: the cell is not added', !L.indexedCells[33]);
    reset(L, 'agario'); feed(AG[0]);
    const accUpd = world([], [{ id: 11, x: 555, y: 555, size: 130, acc: 9999 }], [], false);
    feed(accUpd.slice(0, accUpd.length - 6 - 2));
    check('...and an existing cell is not moved by that record', L.indexedCells[11].targetX === 100 && L.indexedCells[11].accID === 7001);
    /* protocol 6-10: owner id / party code cut short */
    const own = world([], [{ id: 41, x: 1, y: 1, size: 50, color: [1, 1, 1], name: '', owner: 5 }], [], true);
    reset(L, 'private'); feed(own.slice(0, own.length - 6 - 1));
    check('protocol 6-10 owner id cut short: the record is not added', !L.indexedCells[41]);
    const party = world([], [{ id: 42, x: 1, y: 1, size: 50, color: [1, 1, 1], name: 'N', type: 0, party: 'LONGCODE' }], [], true);
    reset(L, 'private'); feed(party.slice(0, party.length - 6 - 4));
    check('protocol 6-10 party code without terminator: the record is not added', !L.indexedCells[42]);
    /* no terminator after the records */
    const noEnd = world([[11, 900]], [{ id: 11, x: 120, y: 220, size: 123 }], [], false).slice(0, -6);
    reset(L, 'agario'); feed(AG[0]); feed(noEnd);
    check('records without the closing id 0: eats and whole records applied, no removal', !L.indexedCells[900] && L.indexedCells[11].targetX === 120);
    /* Expanding Land identity memory is not touched by a cut-short eat list or record */
    reset(L, 'expandingland'); feed(EL[0]);
    const idm0 = JSON.stringify([...L._lmCellIdentity.entries()]);
    const elEat = world([[101, 102], [101, 101]], [], [], false).slice(0, 3 + 12);
    feed(elEat);
    const elRec = world([], [{ id: 102, x: 1, y: 1, size: 91, skin: 'https://x/y.png', name: 'Changed' }], [], false);
    feed(elRec.slice(0, elRec.length - 6 - 3));
    check('Expanding Land: a cut-short eat list or name record changes no kept identity', JSON.stringify([...L._lmCellIdentity.entries()]) === idm0 && !!L.indexedCells[102]);
    /* the identity scan of dropped updates (dead main with a multibox unit) */
    reset(L, 'expandingland'); feed(EL[0]);
    L.g.mainPlayerDeadMbActive = true;
    const scanCut = world([[101, 102]], [{ id: 105, x: 1, y: 1, size: 60, color: [1, 1, 1], skin: '', name: 'Late' }], [101], false);
    feed(scanCut.slice(0, 3 + 4));
    const keptAfterEatCut = L._lmCellIdentity.has(102);
    scanCut[scanCut.length - 6] = 5;
    feed(scanCut);
    check('dropped update (dead main player): the identity scan keeps every identity of a cut-short eat or remove list',
        keptAfterEatCut && L._lmCellIdentity.has(101) && L._lmCellIdentity.has(105) && !L._lmCellIdentity.has(102));
    check('dropped update: the world is not changed and nothing logged', !!L.indexedCells[102] && !L.indexedCells[105] && L.g.errors.length === 0);
    L.g.mainPlayerDeadMbActive = false;
}

/* ---- 4. compressed packets: the decoder's limits stay, a bad one changes nothing ---- */
{
    const inner = AG[1];
    const good = compressed(inner);
    const bad = [];
    const sz = (b, v) => { b = b.slice(); b[1] = v & 255; b[2] = (v >>> 8) & 255; b[3] = (v >>> 16) & 255; b[4] = v >>> 24; return b; };
    bad.push(['declared size one byte more', sz(good, inner.length + 1)]);
    bad.push(['declared size one byte less', sz(good, inner.length - 1)]);
    bad.push(['declared size 0', sz(good, 0)]);
    bad.push(['declared size above 32 MB', sz(good, 33 * 1024 * 1024)]);
    bad.push(['ratio above 256', sz(good, (good.length - 5) * 256 + 1)]);
    bad.push(['shorter than 6 bytes', [255, 1, 0, 0, 0]]);
    bad.push(['LZ4 block cut short', good.slice(0, good.length - 3)]);
    const off = good.slice(); off.push(0x0f, 0xff, 0xff); bad.push(['match offset beyond the decoded data', off]);
    const empty64 = [255].concat(Array.from(Buffer.from([inner.length & 255, inner.length >> 8, 0, 0]))).concat([0x10, 7]);
    bad.push(['literals beyond the declared size', empty64]);
    for (const [name, b] of bad) check('compressed: ' + name + ': dropped, the world unchanged', same('agario', [AG[0]], b));
    reset(L, 'agario'); feed(AG[0]); feed(good);
    check('compressed: the valid packet is applied', L.indexedCells[11].targetX === 104 && L.pps === 2);
}

/* ---- 5. opcode 49 (Expanding Land / private leaderboard): a board cut short keeps the previous one ---- */
{
    const full = board49([[0, 'Bot ★ A'], [1, 'Me'], [0, 'Bot B']]);
    let bad = [];
    for (let n = 1; n < full.length; n++) {
        reset(L, 'expandingland');
        feed(board49([[0, 'Old']]));
        try { feed(full.slice(0, n)); } catch (e) { bad.push(n + ' threw'); continue; }
        if (!(L.leaderboard.length === 1 && L.leaderboard[0].nick === 'Old' && L.lbShown === 1)) bad.push(n);
    }
    check('opcode 49: every truncation keeps the previous board' + (bad.length ? ' (not at ' + bad.slice(0, 6).join(', ') + ')' : ''), bad.length === 0);
    reset(L, 'expandingland');
    feed(board49([[0, 'Old']]));
    const big = full.slice(); big[1] = 201;
    feed(big);
    check('opcode 49: a count above 200 keeps the previous board', L.leaderboard.length === 1 && L.leaderboard[0].nick === 'Old');
    feed(board49([]));
    check('opcode 49: an empty board is a board', L.leaderboard.length === 0 && L.lbShown === 2);
}

/* ---- 5b. opcode 53 (agar.io leaderboard: {u8 flags, [name\0 if 2], [u32 id if 4]} until the end)
 * and 252 (protocol 6-10 minimap: u16 count, {u16 id, i32 x, i32 y, i32 mass, color\0, name\0}) ---- */
{
    const b53 = (rows) => { const w = writer(); w.u8(53); rows.forEach(r => { w.u8(r[0]); if (r[0] & 2) w.str(r[1]); if (r[0] & 4) w.u32(r[2]); }); return w.b; };
    const full = b53([[2, 'Alpha'], [6, 'Bravo ★', 77], [8]]);
    reset(L, 'agario'); feed(b53([[2, 'Old']]));
    const lb0 = JSON.stringify(L.leaderboard);
    feed(full);
    check('opcode 53: a whole board is shown', L.leaderboard.length === 3 && L.leaderboard[1].nick === 'Bravo ★' && L.leaderboard[1].id === 77 && L.lbShown === 2);
    const cut53 = [];
    for (let n = 2; n < full.length; n++) {
        reset(L, 'agario'); feed(b53([[2, 'Old']]));
        feed(full.slice(0, n));
        /* opcode 53 has no row count: a cut between two rows is a shorter whole board */
        const whole = n === b53([[2, 'Alpha']]).length || n === full.length - 1;
        if (!whole && (JSON.stringify(L.leaderboard) !== lb0 || L.lbShown !== 1)) cut53.push(n);
    }
    check('opcode 53: every cut inside a name or id keeps the previous board' + (cut53.length ? ' (not at ' + cut53.slice(0, 6).join(', ') + ')' : ''), cut53.length === 0);

    const b252 = (rows) => { const w = writer(); w.u8(252).u16(rows.length); rows.forEach(r => { w.u16(r[0]).u32(r[1]).u32(r[2]).u32(r[3]); w.str(r[4]); w.str(r[5]); }); return w.b; };
    const g = b252([[5, 100, -200, 3000, '#ff0000', 'Owner'], [6, 1, 2, 30, '', 'Two']]);
    reset(L, 'private'); feed(b252([[9, 0, 0, 1, '#000000', 'Prev']]));
    const prev = JSON.stringify([L.imsoloGhostCells, [...L.imsoloPlayersByID.entries()]]);
    feed(g);
    check('opcode 252: a whole list is kept with its owner names',
        L.imsoloGhostCells.length === 2 && L.imsoloGhostCells[0].x === 100 && L.imsoloGhostCells[0].y === -200 && L.imsoloPlayersByID.get(6).name === 'Two' && !L.imsoloPlayersByID.has(9));
    const cut252 = [];
    for (let n = 3; n < g.length; n++) {
        reset(L, 'private'); feed(b252([[9, 0, 0, 1, '#000000', 'Prev']]));
        feed(g.slice(0, n));
        if (JSON.stringify([L.imsoloGhostCells, [...L.imsoloPlayersByID.entries()]]) !== prev) cut252.push(n);
    }
    check('opcode 252: every truncation keeps the previous ghost cells and owner names' + (cut252.length ? ' (not at ' + cut252.slice(0, 6).join(', ') + ')' : ''), cut252.length === 0);
}

/* ---- 6. bounded fuzz: mutated golden packets never throw, the world stays bounded ---- */
{
    let seed = 0x5eed1e55;
    const rnd = () => { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; return seed / 4294967296; };
    const pool = AG.concat(EL, LEG, JIM.filter(p => p[0] === 16).slice(0, 40));
    let threw = 0, maxCells = 0, errs = 0;
    for (let it = 0; it < 3000; it++) {
        if (it % 300 === 0) { reset(L, ['agario', 'expandingland', 'private'][it / 300 % 3]); }
        const p = pool[(rnd() * pool.length) | 0].slice();
        const op = (rnd() * 5) | 0;
        if (op === 0) for (let k = 0; k < 1 + rnd() * 4; k++) p[1 + ((rnd() * (p.length - 1)) | 0)] ^= 1 << ((rnd() * 8) | 0);
        else if (op === 1) p.length = 1 + ((rnd() * (p.length - 1)) | 0);
        else if (op === 2) { p[1] = (rnd() * 256) | 0; p[2] = (rnd() * 256) | 0; }
        else if (op === 3) for (let k = 0; k < 8; k++) p.push((rnd() * 256) | 0);
        else p[p.length - 2] = (rnd() * 256) | 0;
        try { feed(rnd() < 0.3 ? compressed(p) : p); } catch (e) { threw++; }
        maxCells = Math.max(maxCells, L.cells.length + L.food.length);
        errs += L.g.errors.length; L.g.errors.length = 0;
    }
    check('fuzz (3000 mutated packets, plain and compressed): nothing thrown out of handleMessage', threw === 0);
    check('fuzz: nothing logged as an error, the world bounded (' + maxCells + ' cells at most)', errs === 0 && maxCells < 5000);
}

/* ---- 7. cost on valid packets: the 979 world updates of jim.lm ---- */
function timeIt(LL) {
    const pk = JIM.filter(p => p[0] === 16).map(view);
    const once = () => { reset(LL, 'private'); for (const d of pk) LL.handleMessage(d); };
    for (let i = 0; i < 5; i++) once();
    const t = [];
    for (let r = 0; r < 15; r++) { const t0 = process.hrtime.bigint(); for (let i = 0; i < 4; i++) once(); t.push(Number(process.hrtime.bigint() - t0) / 1e6 / (4 * pk.length)); }
    t.sort((a, b) => a - b);
    return t[7];
}
{
    const us = timeIt(L) * 1000;
    console.log('info valid packets: ' + us.toFixed(2) + ' us per world update (median of 15 runs of 4 x ' + JIM.filter(p => p[0] === 16).length + ')');
    if (oldFile) {
        const O = client(fs.readFileSync(oldFile, 'utf8'));
        const usOld = timeIt(O) * 1000, usNew = timeIt(L) * 1000;
        console.log('info --old ' + path.basename(oldFile) + ': ' + usOld.toFixed(2) + ' us, this version ' + usNew.toFixed(2) + ' us (' + ((usNew / usOld - 1) * 100).toFixed(1) + '%)');
    }
}

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
