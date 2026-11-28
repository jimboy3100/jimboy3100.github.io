/* Garix and Sigmally cell updates (opcode 16) with malformed packets, with the real parsers cut
 * out of ogario/ogario.v4.js (garixUpdateCells, _handleSigmallyCellUpdate, _lmWuIncomplete) and
 * run on a small fake world (cell class, index lists, menu / death calls).
 *
 * Oracle: the version of ogario.v4.js before the bounds checks (the parent of the commit that
 * added _lmWuIncomplete, or HEAD while it is not committed, or --old <file>).
 *  - golden packets (eats, updates, new cells with every flag, own cells, names in UTF-8, skins,
 *    removes, the own last cell eaten): the same world, calls and return as before, also with
 *    the map mirrored and with bytes after the remove list;
 *  - every truncation boundary of every golden packet: no exception, and the world is exactly
 *    what the previous version makes of a valid packet that holds only the records wholly
 *    inside the cut (a cut record and everything after it is not applied, nothing half);
 *  - wrong counts, flags without their bytes, strings without their 0 end: nothing of the bad
 *    record applied;
 *  - a bounded seeded fuzz: no exception, the world stays consistent and bounded;
 *  - the parsers never close the socket; an incomplete update is counted and named in the
 *    console at most every 5 s (no packet bytes); a complete one is not;
 *  - the cost on valid dense packets, measured against the previous version.
 * Garix and Sigmally packets never come compressed (opcode 255 goes to updateCells only), so
 * only raw packets apply here.
 * node developers/tests/cellparsers.js [ogario.v4.js] [--old <file>] [--ref <git ref>] */
'use strict';
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..', '..');
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const newSrc = read(pos[0] || path.join(root, 'ogario', 'ogario.v4.js'));
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };

/* ---- the previous version ---- */
function git(a) { return execFileSync('git', ['-C', root].concat(a), { encoding: 'utf8', maxBuffer: 64 * 1048576 }); }
let oldSrc = null, oldName = '';
try {
    if (opt('--old')) { oldSrc = read(opt('--old')); oldName = opt('--old'); }
    else {
        let ref = opt('--ref');
        if (!ref) {
            const intro = git(['log', '--format=%H', '-S_lmWuIncomplete', '--', 'ogario/ogario.v4.js']).trim().split('\n').filter(Boolean).pop();
            ref = intro ? intro + '^' : 'HEAD';
        }
        oldSrc = git(['show', ref + ':ogario/ogario.v4.js']).replace(/\r\n/g, '\n');
        oldName = ref;
    }
} catch (e) { oldSrc = null; }
check('previous version found (' + oldName + ')', !!oldSrc);
check('the previous version is from before the change', !!oldSrc && oldSrc.indexOf('_lmWuIncomplete') < 0);
if (!oldSrc) { console.log('RESULT: FAIL'); process.exit(1); }

/* the method starting at `start`, up to its closing brace (comments and strings skipped) */
function block(text, start) {
    const a = text.indexOf(start);
    if (a < 0) return null;
    let d = 0;
    for (let k = text.indexOf('{', a); k < text.length; k++) {
        const c = text[k];
        if (c === '/' && text[k + 1] === '/') k = text.indexOf('\n', k);
        else if (c === '/' && text[k + 1] === '*') k = text.indexOf('*/', k + 2) + 1;
        else if (c === "'" || c === '"' || c === '`') { for (k++; k < text.length && text[k] !== c; k++) if (text[k] === '\\') k++; }
        else if (c === '{') d++;
        else if (c === '}' && !--d) return text.slice(a, k + 1);
    }
    return null;
}

/* ---- a fake world for the parsers ---- */
let W = null, clock = 1000000;
function makeCtx() {
    const ctx = {
        console: { log() { }, warn(m) { W && W.warns.push(String(m)); }, error() { } },
        Date: { now: () => clock },
        TextDecoder, Uint8Array, DataView, Set, Math, String, Number, escape, decodeURIComponent, RangeError,
        defaultmapsettings: { virusesRange: true, shortMass: false, virMassShots: false, mbSwitchAfterDeath: false },
        LM: { playerCellsMulti: [], multiBoxPlayerExists: false },
        application: {
            hideMenu() { W.calls.push('hideMenu'); }, onPlayerSpawn() { W.calls.push('spawn'); }, onPlayerDeath() { W.calls.push('death'); },
            showMenu(t) { W.calls.push('showMenu ' + t); }, multiboxswap() { W.calls.push('mbswap'); }
        },
        calcTarget() { W.calls.push('calcTarget'); },
        indexedPush(arr, cell, k) { cell[k] = arr.length; arr.push(cell); },
        lmIdxOf(arr, cell, k) { return arr.indexOf(cell); },
        lmTimeAlive() { return 0; }, /* the time alive (timealive.js tests it) */
        ogarbasicassembly: function (id, x, y, size, color, isFood, isVirus) {
            this.id = id; this.x = x; this.y = y; this.size = size; this.color = color; this.isFood = isFood; this.isVirus = isVirus;
            this.targetNick = ''; this.skin = null; this.isPlayerCell = false;
        }
    };
    ctx.ogarbasicassembly.prototype.removeCell = function () {
        W.removed.push(this.id);
        if (W.indexedCells[this.id] === this) delete W.indexedCells[this.id];
        for (const k of ['cells', 'food', 'viruses', 'playerCells']) { const i = W[k].indexOf(this); if (i >= 0) W[k].splice(i, 1); }
        if (this.isPlayerCell) W.removePlayerCell = true;
    };
    ctx.window = { legendmod: { vector: [[0, 0], [1, 1]], vnr: 0 }, userBots: { isAlive: true, startedBots: false }, connectionBots: { send() { } }, autoPlay: false, decodeURIComponent };
    ctx.legendmod = { play: false };
    return ctx;
}
function load(text) {
    const parts = ['        garixUpdateCells(data, offset) {', '        _handleSigmallyCellUpdate(data) {', '        _lmWuIncomplete(server) {', '        _lmSpawnEndsSpectate() {'].map((m) => block(text, m));
    if (!parts[0] || !parts[1]) throw new Error('parser not found');
    /* compiled in this realm with the fake globals as parameters (a vm context puts an
     * interceptor on every global read, which would hide the parsers' own cost) */
    const ctx = makeCtx(), names = Object.keys(ctx);
    const proto = new Function(names.join(','), '"use strict"; return ({' + parts.filter(Boolean).join(',\n') + '});').apply(null, names.map((k) => ctx[k]));
    return { proto, ctx };
}
const NEW = load(newSrc), OLD = load(oldSrc);
check('the new version has the incomplete-update counter', !!NEW.proto._lmWuIncomplete);

function world(impl, mirror) {
    const w = Object.create(impl.proto);
    Object.assign(w, {
        /* 56: an own cell id (opcode 32) for Sigmally; Garix finds its own cells by accountID */
        indexedCells: {}, cells: [], food: [], viruses: [], playerCells: [], playerCellIDs: [56], _playerCellIDSet: new Set(),
        play: false, playerNick: 'Me', playerColor: null, garixTabID1: 777, garixTabID2: 778, gameMode: ':ffa',
        mapMinX: -7000, mapMaxX: 7000, mapMinY: -7000, mapMaxY: 7000, removePlayerCell: false,
        warns: [], calls: [], removed: [], skins: [], pps: 0, closes: 0,
        socket: { close() { W.closes++; } },
        megaFFAscore() { }, countPps() { this.pps++; },
        rgb2Hex(r, g, b) { return '#' + [r, g, b].map((v) => (256 + v).toString(16).slice(1)).join(''); },
        translateX(x) { return this.mapMaxX - (x - this.mapMinX); }, translateY(y) { return this.mapMaxY - (y - this.mapMinY); },
        vanillaskins(name, skin, color) { this.skins.push([name, skin, color]); }
    });
    w._impl = impl;
    impl.ctx.window.legendmod.vnr = mirror ? 1 : 0;
    return w;
}
/* run one packet; returns { ret, err } */
function run(w, proto, bytes, viewPad) {
    W = w;
    w._impl.ctx.window.legendmod.vnr = w._mirror ? 1 : 0;
    /* the view may sit inside a bigger buffer (Sigmally reads data.byteOffset) */
    const pad = viewPad || 0, buf = new Uint8Array(bytes.length + 2 * pad).fill(0xEE);
    buf.set(bytes, pad);
    const dv = new DataView(buf.buffer, pad, bytes.length);
    try {
        const ret = proto === 'garix' ? w.garixUpdateCells(dv, 1) : w._handleSigmallyCellUpdate(dv);
        return { ret, err: null };
    } catch (e) { return { ret: undefined, err: e }; }
}
function snap(w, noPps) {
    const cells = Object.keys(w.indexedCells).sort((a, b) => a - b).map((id) => {
        const c = w.indexedCells[id];
        return [c.id, c.x, c.y, c.size, c.color, c.isFood, c.isVirus, !!c.isEjected, c.isPlayerCell, c.targetX, c.targetY, c.targetSize, c.targetNick, c.skin, c.startX, c.startY, c.startSize, c.updateTime, c.time];
    });
    const ids = (a) => a.map((c) => c.id).join(',');
    return JSON.stringify({
        cells, list: [ids(w.cells), ids(w.food), ids(w.viruses), ids(w.playerCells)], pids: w.playerCellIDs.join(','), set: [...w._playerCellIDSet].join(','),
        play: w.play, pc: w.playerColor, rpc: w.removePlayerCell, calls: w.calls, removed: w.removed, skins: w.skins, pps: noPps ? 0 : w.pps,
        closes: w.closes, bots: w._impl.ctx.window.userBots.isAlive
    });
}

/* ---- packet builders: bytes plus the end of every record ---- */
function Buf() { this.b = []; }
Buf.prototype = {
    u8(v) { this.b.push(v & 255); return this; },
    u16(v) { this.u8(v); this.u8(v >> 8); return this; },
    u32(v) { this.u16(v & 65535); this.u16(v >>> 16); return this; },
    i16(v) { return this.u16(v & 65535); }, i32(v) { return this.u32(v >>> 0); },
    z(s) { for (const ch of unescape(encodeURIComponent(s))) this.u8(ch.charCodeAt(0)); return this.u8(0); },
    get n() { return this.b.length; }
};
/* Garix: {eats:[[eater,eaten]], upd:[node], add:[node], rm:[ids], eatCount, rmCount, tail:[bytes]}
 * node {id,x,y,size,flags,ext,acc,nick:[3],rgb:[3],skin,name} */
function garix(p) {
    const w = new Buf(), ends = { eat: [], upd: [], add: [], rm: [] };
    w.u8(16).u16(p.eatCount != null ? p.eatCount : p.eats.length);
    for (const e of p.eats) { w.u32(e[0]).u32(e[1]); ends.eat.push(w.n); }
    ends.eatSec = w.n;
    const node = (r) => {
        let fl = r.flags || 0;
        if (r.ext != null) fl |= 0x80;
        w.u32(r.id).i32(r.x).i32(r.y).u16(r.size).u8(fl);
        if (fl & 0x80) w.u8(r.ext);
        if (r.ext & 4) w.u32(r.acc);
        if (r.ext & 8) w.u8(r.nick[0]).u8(r.nick[1]).u8(r.nick[2]);
        if (fl & 2) w.u8(r.rgb[0]).u8(r.rgb[1]).u8(r.rgb[2]);
        if (fl & 4) w.z(r.skin);
        if (fl & 8) w.z(r.name);
    };
    for (const r of p.upd) { node(r); ends.upd.push(w.n); }
    w.u32(0); ends.term1 = w.n;
    for (const r of p.add) { node(r); ends.add.push(w.n); }
    w.u32(0); ends.term2 = w.n;
    w.u16(p.rmCount != null ? p.rmCount : p.rm.length);
    for (const id of p.rm) { w.u32(id); ends.rm.push(w.n); }
    ends.rmSec = w.n;
    for (const t of p.tail || []) w.u8(t);
    return { bytes: Uint8Array.from(w.b), ends };
}
/* the valid packet holding only what a cut at c leaves whole */
function garixCut(p, e, c) {
    if (c < e.eatSec) return { eats: [], upd: [], add: [], rm: [] };
    const q = { eats: p.eats, upd: p.upd.filter((r, i) => e.upd[i] <= c), add: [], rm: [] };
    if (c >= e.term1) q.add = p.add.filter((r, i) => e.add[i] <= c);
    if (c >= e.rmSec) q.rm = p.rm;
    return q;
}

/* ---- golden Garix packets ---- */
const G = {
    setup: {
        eats: [], rm: [], upd: [],
        add: [
            { id: 11, x: 100, y: 200, size: 50, flags: 0x0a, rgb: [200, 10, 10], name: 'Alpha' },
            { id: 12, x: -300, y: 400, size: 80, flags: 0x0e, rgb: [10, 200, 10], skin: 'cat', name: 'Béta Ω' },
            { id: 13, x: 0, y: 0, size: 100, flags: 0x03, rgb: [20, 255, 20] },
            { id: 14, x: 50, y: 60, size: 10, flags: 0x42, rgb: [1, 2, 3] },
            { id: 15, x: 70, y: 80, size: 10, flags: 0x42, rgb: [4, 5, 6] },
            { id: 16, x: 500, y: 500, size: 60, flags: 0x8a, ext: 0x0c, acc: 777, nick: [9, 9, 9], rgb: [50, 60, 70], name: 'mine' },
            { id: 17, x: 900, y: -900, size: 30, flags: 0x22, rgb: [8, 8, 8] }
        ]
    },
    play: {
        eats: [[11, 14], [12, 15]],
        upd: [
            { id: 11, x: 110, y: 210, size: 52, flags: 0x02, rgb: [210, 20, 20] },
            { id: 12, x: -290, y: 410, size: 82, flags: 0x08, name: 'Béta Ω 2' },
            { id: 16, x: 510, y: 505, size: 61, flags: 0x00 }
        ],
        add: [
            { id: 21, x: 1, y: 2, size: 11, flags: 0x42, rgb: [7, 7, 7] },
            { id: 22, x: 3, y: 4, size: 40, flags: 0x96, ext: 0x04, acc: 778, rgb: [90, 91, 92], skin: 'https://x/y.png', name: '' },
            { id: 23, x: 5, y: 6, size: 33, flags: 0x8c, ext: 0x08, nick: [1, 1, 1], skin: '', name: '日本' },
            { id: 24, x: 7, y: 8, size: 120, flags: 0x11 }
        ],
        rm: [13, 17, 999]
    },
    death: { eats: [[11, 16], [11, 22]], upd: [{ id: 11, x: 115, y: 215, size: 60, flags: 0 }], add: [], rm: [12] },
    empty: { eats: [], upd: [], add: [], rm: [] }
};
const garixSeq = ['setup', 'play', 'death'];

function goldenCompare(proto, specs, build, seq, label) {
    for (const mirror of [false, true]) for (const tail of [null, [0, 0, 0], [0xff, 1, 2, 3, 4, 5, 6, 7, 8]]) for (const pad of [0, 5]) {
        const wo = world(OLD, mirror), wn = world(NEW, mirror);
        wo._mirror = wn._mirror = mirror;
        let same = true, allTrue = true, info = '';
        for (const k of seq) {
            const sp = Object.assign({}, specs[k], { tail });
            const pk = build(sp).bytes;
            const ro = run(wo, proto, pk, pad), rn = run(wn, proto, pk, pad);
            if (ro.err || rn.err) { same = false; info = k + ': ' + (ro.err || rn.err).message; break; }
            if (snap(wo) !== snap(wn)) { same = false; info = k; break; }
            if (rn.ret !== true) allTrue = false;
        }
        check(label + ' golden packets: same world as before' + (mirror ? ', mirrored map' : '') + (tail ? ', ' + tail.length + ' bytes after the remove list' : '') + (pad ? ', view inside a bigger buffer' : ''), same, info);
        check(label + ' golden packets: complete' + (mirror ? ', mirrored' : '') + (tail ? ', with ' + tail.length + ' bytes after' : '') + (pad ? ', offset view' : ''), allTrue);
        check(label + ' golden packets: no incomplete count, no warning, no socket close', !wn._lmWuBadN && !wn.warns.length && !wn.closes);
    }
}

/* every cut of every golden packet against the previous version on the whole records */
function truncations(proto, specs, build, cutSpec, seq, label) {
    let cuts = 0, bad = 0, threw = 0, oldBad = 0, oldThrew = 0, notFalse = 0, info = '';
    for (let si = 0; si < seq.length; si++) {
        const spec = specs[seq[si]], built = build(spec);
        for (let c = 1; c < built.bytes.length; c++) {
            cuts++;
            const prep = (impl) => { const w = world(impl, false); for (let j = 0; j < si; j++) run(w, proto, build(specs[seq[j]]).bytes); w.calls.length = 0; w.removed.length = 0; w.skins.length = 0; return w; };
            const wn = prep(NEW), wr = prep(OLD), wo = prep(OLD);
            const rn = run(wn, proto, built.bytes.slice(0, c));
            run(wr, proto, build(cutSpec(spec, built.ends, c)).bytes);
            const ro = run(wo, proto, built.bytes.slice(0, c));
            if (rn.err) { threw++; info = info || seq[si] + ' cut ' + c + ': ' + rn.err.message; continue; }
            if (rn.ret !== false) notFalse++;
            if (snap(wn, true) !== snap(wr, true)) { bad++; info = info || seq[si] + ' cut ' + c; }
            if (ro.err) oldThrew++;
            else if (snap(wo, true) !== snap(wr, true)) oldBad++;
            if (wn.closes) bad++;
        }
    }
    console.log('     ' + label + ': ' + cuts + ' cuts; previous version: ' + oldThrew + ' threw, ' + oldBad + ' applied a part of a cut record or read past it');
    check(label + ' every truncation boundary: no exception', !threw, info);
    check(label + ' every truncation boundary: exactly the whole records before the cut are applied (nothing of a cut record or after it)', !bad, info);
    check(label + ' every truncation boundary: reported incomplete', !notFalse, notFalse);
}

/* one packet on the play world: the world before and after, return, count */
function onPlay(proto, build, specs, bytes, seqPre) {
    const w = world(NEW, false);
    for (const k of seqPre) run(w, proto, build(specs[k]).bytes);
    w.calls.length = 0; w.removed.length = 0; w.skins.length = 0;
    const before = snap(w, true), n0 = w._lmWuBadN || 0;
    const r = run(w, proto, bytes);
    return { w, before, after: snap(w, true), r, bad: (w._lmWuBadN || 0) - n0 };
}

/* ---- Garix ---- */
goldenCompare('garix', G, garix, garixSeq, 'Garix');
truncations('garix', G, garix, garixCut, garixSeq, 'Garix');
{
    /* an eat count the packet cannot hold: nothing applied at all */
    const pk = garix(Object.assign({}, G.play, { eatCount: 500 })).bytes;
    const t = onPlay('garix', garix, G, pk, ['setup']), ref = onPlay('garix', garix, G, garix(G.empty).bytes, ['setup']);
    check('Garix eat count bigger than the packet: nothing applied, incomplete', !t.r.err && t.r.ret === false && t.after === ref.after && t.bad === 1);
    /* a remove count bigger than the packet: no remove applied, the rest is */
    const q = garix(Object.assign({}, G.play, { rmCount: 40 })).bytes;
    const a = onPlay('garix', garix, G, q, ['setup']), b = onPlay('garix', garix, G, garix(Object.assign({}, G.play, { rm: [] })).bytes, ['setup']);
    check('Garix remove count bigger than the packet: no remove applied, the rest is, incomplete', !a.r.err && a.r.ret === false && a.after === b.after && a.bad === 1);
    /* ... unless an id 0 ends the list inside the packet (as Delta reads it): applied up to it */
    const z = garix(Object.assign({}, G.play, { rm: [13, 17, 0], rmCount: 40 })).bytes;
    const c = onPlay('garix', garix, G, z, ['setup']), d = onPlay('garix', garix, G, garix(Object.assign({}, G.play, { rm: [13, 17] })).bytes, ['setup']);
    check('Garix remove list ended early by id 0: applied up to it, complete', !c.r.err && c.r.ret === true && c.after === d.after && c.bad === 0);
    /* a flag that promises bytes the packet does not have (last record): that record not applied */
    for (const [what, rec] of [['ext flags byte', { flags: 0x80 }], ['accountID', { flags: 0x80, ext: 4 }], ['nick colour', { flags: 0x80, ext: 8 }], ['rgb', { flags: 0x02 }], ['skin', { flags: 0x04 }], ['name', { flags: 0x08 }]]) {
        const base = { eats: [], upd: [{ id: 11, x: 1, y: 1, size: 20, flags: 0 }], add: [], rm: [] };
        const ok = garix(base).bytes;
        /* the update of 11, then a record 31 with only its fixed part and the flag; no terminators */
        const w = new Buf();
        for (const v of ok.slice(0, ok.length - 10)) w.u8(v);
        w.u32(31).i32(5).i32(5).u16(20).u8(rec.flags);
        if (what !== 'ext flags byte' && (rec.flags & 0x80)) w.u8(rec.ext);
        if (what === 'skin' || what === 'name') w.u8(65).u8(66); /* the string, no 0 */
        const t2 = onPlay('garix', garix, G, Uint8Array.from(w.b), ['setup']);
        const r2 = onPlay('garix', garix, G, garix({ eats: [], upd: [{ id: 11, x: 1, y: 1, size: 20, flags: 0 }], add: [], rm: [] }).bytes, ['setup']);
        check('Garix record whose ' + what + ' is missing: not applied (no cell 31, no skin call), the record before it is', !t2.r.err && t2.r.ret === false && !t2.w.indexedCells[31] && t2.after === r2.after);
    }
    /* a string without its 0 end in the middle cannot be found: it runs to the end, the record is cut */
    const s = garix({ eats: [], upd: [], add: [{ id: 41, x: 1, y: 1, size: 40, flags: 0x08, name: 'x' }], rm: [] }).bytes;
    let t3 = onPlay('garix', garix, G, s.slice(0, s.length - 7), ['setup']); /* without the name's 0, both ends and the remove count */
    check('Garix name without its 0 end: no cell, no name call, incomplete', !t3.r.err && t3.r.ret === false && !t3.w.indexedCells[41] && !t3.w.skins.length && t3.bad === 1);
    /* one id 0 only (a protocol-6 style end) and the remove count: as before, counted incomplete */
    const one = new Buf(); one.u8(16).u16(0).u32(0).u16(0);
    t3 = onPlay('garix', garix, G, Uint8Array.from(one.b), ['setup']);
    check('Garix packet with one section end only: nothing applied, no exception, incomplete', !t3.r.err && t3.r.ret === false && t3.before === t3.after);
    /* packets of 1 and 2 bytes (no eat count): nothing happens, no exception */
    const t4 = onPlay('garix', garix, G, Uint8Array.from([16]), ['setup']), t5 = onPlay('garix', garix, G, Uint8Array.from([16, 0]), ['setup']);
    check('Garix packet without its eat count: no exception, nothing applied', !t4.r.err && !t5.r.err && t4.r.ret === false && t4.before === t4.after && t5.before === t5.after);
}

/* ---- Sigmally ---- */
/* {eats:[[eater,victim]], eatEnd (an eater 0 ends the list; the count is one more), eatCount,
 *  upd:[node], rm:[ids], rmCount, tail}; node {id,x,y,size,flags,m:[3],v,ext,rgb:[3],skin,name,acc} */
function sig(p) {
    const w = new Buf(), ends = { eat: [], upd: [], rm: [] };
    w.u8(16).u16(p.eatCount != null ? p.eatCount : p.eats.length + (p.eatEnd ? 1 : 0));
    for (const e of p.eats) { w.u32(e[0]).u32(e[1]); ends.eat.push(w.n); }
    if (p.eatEnd) w.u32(0);
    ends.eatSec = w.n;
    for (const r of p.upd) {
        let fl = r.flags || 0;
        if (r.ext != null) fl |= 0x80;
        const m = r.m || [0, 0, 0];
        w.u32(r.id).i16(r.x).i16(r.y).u16(r.size).u8(fl).u8(m[0]).u8(m[1]).u8(m[2]).z(r.v || '');
        if (fl & 0x80) w.u8(r.ext);
        if (fl & 2) w.u8(r.rgb[0]).u8(r.rgb[1]).u8(r.rgb[2]);
        if (fl & 4) w.z(r.skin);
        if (fl & 8) w.z(r.name);
        if ((fl & 0x80) && (r.ext & 4)) w.u32(r.acc);
        ends.upd.push(w.n);
    }
    w.u32(0); ends.term = w.n;
    w.u16(p.rmCount != null ? p.rmCount : p.rm.length);
    for (const id of p.rm) { w.u32(id); ends.rm.push(w.n); }
    ends.rmSec = w.n;
    for (const t of p.tail || []) w.u8(t);
    return { bytes: Uint8Array.from(w.b), ends };
}
/* the valid packet holding only what a cut at c leaves whole (a cut eat list drops it all) */
function sigCut(p, e, c) {
    if (c < e.eatSec) return { eats: [], upd: [], rm: [] };
    return { eats: p.eats, eatEnd: p.eatEnd, upd: p.upd.filter((r, i) => e.upd[i] <= c), rm: c >= e.rmSec ? p.rm : [] };
}
/* ---- golden Sigmally packets (56 is the own cell id) ---- */
const S = {
    setup: {
        eats: [], rm: [],
        upd: [
            { id: 11, x: 100, y: 200, size: 50, flags: 0x0a, rgb: [200, 10, 10], name: 'Alpha' },
            { id: 12, x: -300, y: 400, size: 80, flags: 0x0e, rgb: [10, 200, 10], skin: '1%cat', name: 'Béta Ω' },
            { id: 13, x: 0, y: 0, size: 100, flags: 0x03, rgb: [20, 255, 20] },
            { id: 14, x: 50, y: 60, size: 10, flags: 0x02, rgb: [1, 2, 3] },
            { id: 15, x: 70, y: 80, size: 12, flags: 0x00, ext: 0x01 },
            { id: 56, x: 500, y: 500, size: 60, flags: 0x0a, ext: 0x04, acc: 777, rgb: [50, 60, 70], name: 'mine' },
            { id: 17, x: 900, y: -900, size: 30, flags: 0x22, rgb: [8, 8, 8] },
            { id: 18, x: -32000, y: 32000, size: 40, flags: 0x08, m: [3, 1, 0], v: 'zz', name: 'far' }
        ]
    },
    play: {
        eats: [[11, 14], [12, 15]],
        upd: [
            { id: 11, x: 110, y: 210, size: 52, flags: 0x02, rgb: [210, 20, 20] },
            { id: 12, x: -290, y: 410, size: 82, flags: 0x08, name: 'Béta Ω 2' },
            { id: 56, x: 510, y: 505, size: 61, flags: 0x00 },
            { id: 21, x: 1, y: 2, size: 11, flags: 0x02, rgb: [7, 7, 7] },
            { id: 22, x: 3, y: 4, size: 40, flags: 0x0e, ext: 0x04, acc: 778, rgb: [90, 91, 92], skin: 'https://x/y.png', name: '' },
            { id: 23, x: 5, y: 6, size: 33, flags: 0x0c, v: 'q', skin: '', name: '日本' },
            { id: 24, x: 7, y: 8, size: 120, flags: 0x11 }
        ],
        rm: [13, 17, 999]
    },
    death: { eats: [[11, 56], [11, 22]], eatEnd: true, upd: [{ id: 11, x: 115, y: 215, size: 60, flags: 0 }], rm: [12] },
    empty: { eats: [], upd: [], rm: [] }
};
const sigSeq = ['setup', 'play', 'death'];
goldenCompare('sigmally', S, sig, sigSeq, 'Sigmally');
truncations('sigmally', S, sig, sigCut, sigSeq, 'Sigmally');
{
    /* the death packet really ends the own life (so the golden run covers the death path) */
    const d = onPlay('sigmally', sig, S, sig(S.death).bytes, ['setup', 'play']);
    check('Sigmally golden death packet: the own last cell eaten ends the game (death, menu)', d.r.ret === true && d.w.calls.indexOf('death') >= 0 && d.w.calls.indexOf('showMenu 300') >= 0, d.w.calls.join());
    /* an eat count the packet cannot hold, no eater 0: nothing applied at all (an eater 0
     * found further on, even in cell bytes, is read as the list end, as the protocol allows) */
    const pk = sig(Object.assign({}, S.play, { eatCount: 500 })).bytes.slice(0, sig(S.play).ends.eatSec);
    const t = onPlay('sigmally', sig, S, pk, ['setup']), ref = onPlay('sigmally', sig, S, sig(S.empty).bytes, ['setup']);
    check('Sigmally eat count bigger than the packet: nothing applied, incomplete', !t.r.err && t.r.ret === false && t.after === ref.after && t.bad === 1);
    /* ... unless an eater 0 ends the list inside the packet: read up to it, complete */
    const e0 = onPlay('sigmally', sig, S, sig(Object.assign({}, S.play, { eatEnd: true, eatCount: 500 })).bytes, ['setup']);
    const e1 = onPlay('sigmally', sig, S, sig(Object.assign({}, S.play, { eatEnd: true })).bytes, ['setup']);
    check('Sigmally eat list ended early by eater 0: applied up to it, complete', !e0.r.err && e0.r.ret === true && e0.after === e1.after && e0.bad === 0 && e1.w.removed.join() === '14,15,13,17', e1.w.removed.join());
    /* a remove count bigger than the packet: no remove applied, the rest is */
    const a = onPlay('sigmally', sig, S, sig(Object.assign({}, S.play, { rmCount: 40 })).bytes, ['setup']);
    const b = onPlay('sigmally', sig, S, sig(Object.assign({}, S.play, { rm: [] })).bytes, ['setup']);
    check('Sigmally remove count bigger than the packet: no remove applied, the rest is, incomplete', !a.r.err && a.r.ret === false && a.after === b.after && a.bad === 1);
    /* the cell end but no remove count: the cells applied, incomplete */
    const full = sig(S.play);
    const c = onPlay('sigmally', sig, S, full.bytes.slice(0, full.ends.term), ['setup']);
    check('Sigmally packet without its remove count: cells applied, no remove, incomplete', !c.r.err && c.r.ret === false && c.after === b.after && c.bad === 1);
    /* a flag that promises bytes the packet does not have (last record): that record not applied */
    for (const [what, fl, ext] of [['string v 0 end', 0, null], ['ext flags byte', 0x80, null], ['rgb', 0x02, null], ['skin', 0x04, null], ['name', 0x08, null], ['accountID', 0x80, 4]]) {
        const w = new Buf();
        w.u8(16).u16(0);
        w.u32(11).i16(1).i16(1).u16(20).u8(0).u8(0).u8(0).u8(0).u8(0);
        w.u32(31).i16(5).i16(5).u16(20).u8(fl).u8(0).u8(0).u8(0);
        if (what === 'string v 0 end') w.u8(65).u8(66); /* string v, no 0 */
        else w.u8(0);
        if (ext != null) w.u8(ext);
        if (what === 'rgb') w.u8(1).u8(2);
        if (what === 'skin' || what === 'name') w.u8(65).u8(66); /* the string, no 0 */
        if (what === 'accountID') w.u8(1).u8(2).u8(3);
        const t2 = onPlay('sigmally', sig, S, Uint8Array.from(w.b), ['setup']);
        const r2 = onPlay('sigmally', sig, S, sig({ eats: [], upd: [{ id: 11, x: 1, y: 1, size: 20, flags: 0 }], rm: [] }).bytes, ['setup']);
        check('Sigmally record whose ' + what + ' is missing: not applied (no cell 31, no skin call), the record before it is', !t2.r.err && t2.r.ret === false && !t2.w.indexedCells[31] && t2.after === r2.after && t2.bad === 1);
    }
    /* packets of 1 and 2 bytes (no eat count): nothing happens, no exception */
    const t4 = onPlay('sigmally', sig, S, Uint8Array.from([16]), ['setup']), t5 = onPlay('sigmally', sig, S, Uint8Array.from([16, 0]), ['setup']);
    check('Sigmally packet without its eat count: no exception, nothing applied, incomplete', !t4.r.err && !t5.r.err && t4.r.ret === false && t5.r.ret === false && t4.before === t4.after && t5.before === t5.after && t4.bad === 1);
}

/* ---- bounded fuzz ---- */
let seed = 12345;
const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
function fuzz(proto, specs, build, seq, label) {
    let threw = 0, broken = 0, closes = 0, info = '', N = 3000, maxCells = 0;
    for (let it = 0; it < N; it++) {
        const w = world(NEW, !!rnd(2));
        w._mirror = w._impl.ctx.window.legendmod.vnr === 1;
        run(w, proto, build(specs[seq[0]]).bytes);
        const base = Object.keys(w.indexedCells).length;
        const src0 = build(specs[seq[1 + rnd(seq.length - 1)]]).bytes;
        let b = Array.from(src0);
        const m = 1 + rnd(4);
        for (let k = 0; k < m; k++) {
            const op = rnd(5), at = 1 + rnd(Math.max(1, b.length - 1));
            if (op === 0) b[at] = rnd(256);
            else if (op === 1) b = b.slice(0, at);
            else if (op === 2) b.splice(at, 0, rnd(256), rnd(256));
            else if (op === 3) b.splice(at, 1 + rnd(4));
            else { b[at] = 255; if (at + 1 < b.length) b[at + 1] = 255; }
        }
        if (!b.length) b = [16];
        b[0] = 16;
        const r = run(w, proto, Uint8Array.from(b));
        if (r.err) { threw++; info = info || r.err.message; continue; }
        if (typeof r.ret !== 'boolean') broken++;
        /* every listed cell is the indexed one; no cell beyond what the packet could hold */
        let n = 0;
        for (const id in w.indexedCells) { n++; const c = w.indexedCells[id]; if (w.cells.indexOf(c) < 0 && w.food.indexOf(c) < 0) broken++; }
        for (const c of w.cells.concat(w.food)) if (w.indexedCells[c.id] !== c) broken++;
        if (n > base + Math.ceil(b.length / 15)) broken++;
        maxCells = Math.max(maxCells, n);
        if (w.closes) closes++;
    }
    check(label + ' fuzz (' + N + ' mutated packets): no exception', !threw, info);
    check(label + ' fuzz: world consistent and bounded (at most ' + maxCells + ' cells), always a true/false result', !broken, broken);
    check(label + ' fuzz: the socket is never closed', !closes);
}
fuzz('garix', G, garix, garixSeq, 'Garix');
fuzz('sigmally', S, sig, sigSeq, 'Sigmally');

/* ---- diagnostics: count, warning at most every 5 s, no packet bytes ---- */
{
    const w = world(NEW, false);
    run(w, 'garix', garix(G.setup).bytes);
    const bad = garix(G.play).bytes.slice(0, 40);
    for (let i = 0; i < 3; i++) run(w, 'garix', bad);
    const w1 = w.warns.length;
    clock += 6000;
    run(w, 'garix', bad);
    clock += 1000;
    run(w, 'garix', garix(G.empty).bytes);
    check('incomplete updates counted (4) and named once per 5 s (2 warnings), a complete one not counted', w._lmWuBadN === 4 && w1 === 1 && w.warns.length === 2, w._lmWuBadN + ' / ' + w.warns.length);
    check('the warning names the server and the count only (no packet bytes, names or skins)', w.warns.every((m) => /^\[Protocol\] Incomplete Garix cell update: .*\(\d+ so far\)$/.test(m) && !/Alpha|cat|B/.test(m.slice(30))));
    const v = world(NEW, false);
    run(v, 'sigmally', sig(S.setup).bytes);
    run(v, 'sigmally', sig(S.play).bytes.slice(0, 40));
    run(v, 'sigmally', sig(S.empty).bytes);
    check('a Sigmally incomplete update is counted and named Sigmally (no packet bytes)', v._lmWuBadN === 1 && v.warns.length === 1 && /^\[Protocol\] Incomplete Sigmally cell update: .*\(1 so far\)$/.test(v.warns[0]) && !/Alpha|cat/.test(v.warns[0]), v.warns.join());
}

/* ---- cost on valid dense packets ---- */
function bench(proto, mk, label) {
    const pk = mk();
    const prepare = (impl) => { const w = world(impl, false); run(w, proto, pk.setup); return w; };
    const wo = prepare(OLD), wn = prepare(NEW);
    /* one view for all calls: only the parser is timed */
    const dv = new DataView(Uint8Array.from(pk.dense).buffer);
    const call = proto === 'garix' ? (w) => w.garixUpdateCells(dv, 1) : (w) => w._handleSigmallyCellUpdate(dv);
    const time = (w) => { W = w; const t0 = process.hrtime.bigint(); for (let i = 0; i < 100; i++) call(w); return Number(process.hrtime.bigint() - t0) / 100 / 1000; };
    for (let i = 0; i < 20; i++) { time(wo); time(wn); }
    /* alternating pairs; the ratio of each pair (machine load changes slower than a pair) */
    const so = [], sn = [], ratio = [];
    for (let i = 0; i < 81; i++) {
        let a, b;
        if (i & 1) { b = time(wn); a = time(wo); } else { a = time(wo); b = time(wn); }
        so.push(a); sn.push(b); ratio.push(b / a);
    }
    const med = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];
    const mo = med(so), mn = med(sn), mr = med(ratio);
    console.log('     ' + label + ' cost, ' + pk.n + ' records (' + pk.dense.length + ' bytes) per packet: before ' + mo.toFixed(1) + ' us, after ' + mn.toFixed(1) + ' us (medians of 81 alternating runs of 100), after / before median ' + ((mr - 1) * 100).toFixed(1) + ' %');
    check(label + ' cost on valid packets within the noise (median pair ratio <= 1.4; measured above)', mr <= 1.4, mr);
}
bench('garix', () => {
    const add = [], upd = [];
    for (let i = 0; i < 300; i++) add.push({ id: 100 + i, x: i * 7, y: i * 3, size: 20 + (i % 50), flags: i % 5 ? 0x02 : 0x0a, rgb: [i & 255, 9, 9], name: i % 5 ? undefined : 'player' + i });
    for (let i = 0; i < 300; i++) upd.push({ id: 100 + i, x: i * 7 + 1, y: i * 3 + 1, size: 21 + (i % 50), flags: 0 });
    return { setup: garix({ eats: [], upd: [], add, rm: [] }).bytes, dense: garix({ eats: [], upd, add: [], rm: [] }).bytes, n: 300 };
}, 'Garix');
bench('sigmally', () => {
    const add = [], upd = [];
    for (let i = 0; i < 300; i++) add.push({ id: 100 + i, x: i * 7, y: i * 3, size: 20 + (i % 50), flags: i % 5 ? 0x02 : 0x0a, rgb: [i & 255, 9, 9], name: i % 5 ? undefined : 'player' + i });
    for (let i = 0; i < 300; i++) upd.push({ id: 100 + i, x: i * 7 + 1, y: i * 3 + 1, size: 21 + (i % 50), flags: 0 });
    return { setup: sig({ eats: [], upd: add, rm: [] }).bytes, dense: sig({ eats: [], upd, rm: [] }).bytes, n: 300 };
}, 'Sigmally');

console.log('RESULT: ' + (fail ? 'FAIL (' + fail + ')' : 'PASS'));
process.exit(fail ? 1 : 0);
