/* Network diagnostics of the main connection (ogario/ogario.v4.js _lmND, the report of
 * ogario/modules/perf.js): message callbacks, world updates received / attempted / applied /
 * incomplete / rejected / held back on purpose, replay ones, the times of the last callback,
 * attempt and applied update, one generation per connection.
 * The real handleMessage, opcode 16, handleSubmessage (compressed 255), decompressMessage,
 * updateCells, garixUpdateCells, _handleSigmallyCellUpdate, onMessage (Sigmally, Senpa, raw),
 * onOpen, onClose, closeConnection, _finishConnect and the diagnostics helpers run in a vm with
 * stubs and a fake clock. Every packet sequence also runs on a twin without diagnostics: the
 * game state (cells, own cells, play, packets/s calls, timers) must be the same.
 * node developers/tests/netdiag.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : ' (' + info + ')')); if (!c) fail++; };
const cut = (from, to) => { const a = src.indexOf(from), b = a < 0 ? -1 : src.indexOf(to, a + from.length); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };
function block(from, start) {
    const a = src.indexOf(from, start || 0);
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

const parts = {
    hm: cut('        handleMessage(data) {\n', '        countPps() {'),
    parsers: cut('        garixUpdateCells(data, offset) {\n', '        sortCells() {'),
    sub: block('        handleSubmessage(message) {'),
    dec: block('        decompressMessage(message) {'),
    om: cut('        onMessage(message) {\n', '        onError(t) {'),
    open: cut('        onOpen() {\n', '        onMessage(message) {'),
    diag: cut('        _lmResetFreezeDetector(', '        onClose(t) {'),
    close: cut('        onClose(t) {\n', '        replayfunctions() {'),
    cc: cut('        closeConnection() {\n            /* P1 fix', '        isSocketOpen() {'),
    helpers: cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool'),
    isEl: block('function _isExpandingLandClient(')
};
const missing = Object.keys(parts).filter(k => !parts[k]);
if (missing.length) { console.log('FAIL code not found in ogario.v4.js: ' + missing.join(', ')); process.exit(1); }

const noop = function () { };
const clock = { t: 1000 };
/* one game object (the main connection) in its own vm; diag: with the network diagnostics */
function mk(diag) {
    const timers = [];
    const g = {
        console: { log: noop, info: noop, warn: noop, error: (...a) => { g.errors.push(a.join(' ')); } }, errors: [],
        Math: Object.assign(Object.create(Math), { random: () => 0.5 }), Date, JSON, Object, Array, Map, Set, Number, String, Boolean, Uint8Array, Uint32Array, DataView, ArrayBuffer, TextDecoder, RangeError, TypeError, Error,
        isFinite, escape, unescape, decodeURIComponent, encodeURIComponent, parseInt, parseFloat, Infinity, NaN, undefined, atob: (s) => Buffer.from(s, 'base64').toString('binary'),
        performance: { now: () => clock.t },
        setTimeout: (f, ms) => { timers.push(['timeout', ms]); return timers.length; }, clearTimeout: noop,
        setInterval: (f, ms) => { timers.push(['interval', ms]); return timers.length; }, clearInterval: noop,
        localStorage: { getItem: () => null, setItem: noop },
        document: { hidden: false, listeners: {}, addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); } }
    };
    g.window = g;
    g.LMEvents = { _has: () => false, emit: noop, on: noop, off: noop };
    g.buffer = { Buffer: function (ab, off, len) { return Buffer.from(ab, off, len); } };
    g.defaultmapsettings = { recordReplays: false };
    g.$ = () => ({ val: () => '' });
    g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0 }, { get: (t, k) => k in t ? t[k] : noop });
    g.drawRender = { _lmStallMax: 0, _lmStallLogged: 0, _lmFreezeLogged: 0 };
    g.userBots = { startedBots: false };
    g.gameBots = {};
    g.ogario = {};
    g.profiles = [];
    g.consoleMsgLM = '';
    g.ogarbasicassembly = function (id, x, y, size, color, isFood, isVirus) {
        Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, targetSize: size, isPlayerCell: false, targetNick: '', skin: null });
        this.removeCell = function () {
            this.removed = true;
            const L = g.LM;
            let i = L.cells.indexOf(this); if (i !== -1) L.cells.splice(i, 1);
            i = L.food.indexOf(this); if (i !== -1) L.food.splice(i, 1);
            i = L.playerCells.indexOf(this); if (i !== -1) { L.playerCells.splice(i, 1); L.removePlayerCell = true; }
            delete L.indexedCells[this.id];
        };
    };
    vm.createContext(g);
    vm.runInContext(parts.helpers + '\n' + [...parts.helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' ') + '\n' + parts.isEl + '\nthis._isExpandingLandClient = _isExpandingLandClient;', g);
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop });
    g.__h = null;
    vm.runInContext('with (__env) { __h = ({' + [parts.hm, parts.parsers, parts.sub, parts.dec, parts.om, parts.open, parts.diag, parts.close, parts.cc].join(',\n') + '}); }', g);
    const L = g.__h;
    Object.assign(L, {
        serverType: 'private', isLegendWorld: false, connectionIntegrity: false, integrity: false, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
        cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: {}, playerCellsMulti: [],
        vector: [[0, 0]], vnr: 0, play: true, time: 0, mapEvent: {}, decayInfo: {}, ws: 'wss://test.example/', socket: { readyState: 1, OPEN: 1, send: noop, close: noop },
        ppsCalls: 0, countPps() { this.ppsCalls++; }, megaFFAscore: noop, flushMegaFFAscore: noop, flushCellsData: noop, vanillaskins: noop, handleLeaderboard: noop,
        setMapOffset: noop, _lmOnServerBorder: noop, _lmBorderTraceAdd: noop, flushSpecsData: noop, isSocketOpen() { return true; }, sendBuffer: noop, sendMessage: noop,
        createView: (n) => new DataView(new ArrayBuffer(n)), translateX: (x) => x, translateY: (y) => y,
        rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join('')
    });
    g.legendmod = g.LM = L;
    if (diag) L._lmNetDiagStart();
    return { g, L, timers };
}
/* the game state the diagnostics must never change */
function state(t) {
    const L = t.L;
    const cells = Object.keys(L.indexedCells).sort().map(id => { const c = L.indexedCells[id]; return [id, c.targetX, c.targetY, c.targetSize, c.targetNick, c.skin, c.color, !!c.isFood, !!c.isVirus, !!c.isPlayerCell].join(':'); });
    return JSON.stringify({ cells, n: L.cells.length, food: L.food.length, own: L.playerCellIDs.slice(), ownCells: L.playerCells.length, play: L.play, pps: L.ppsCalls, timers: t.timers, mbActive: !!t.g.mainPlayerDeadMbActive });
}
/* the same steps on a game with and one without diagnostics; returns the one with them */
function twin(name, steps, before) {
    const a = mk(true), b = mk(false);
    if (before) { before(a); before(b); }
    let ea = null, eb = null;
    for (const s of steps) {
        try { s(a); } catch (e) { ea = (ea || '') + e.name + ' '; }
        try { s(b); } catch (e) { eb = (eb || '') + e.name + ' '; }
    }
    check(name + ': game state and exceptions the same with and without diagnostics', state(a) === state(b) && ea === eb, state(a) + ' / ' + state(b) + ' ' + ea + ' / ' + eb);
    return a;
}

/* ---- packets ---- */
const bytes = () => {
    const b = [];
    const w = {
        b, u8: (v) => (b.push(v & 255), w), u16: (v) => (w.u8(v), w.u8(v >>> 8)), i16: (v) => w.u16(v & 0xffff),
        u32: (v) => { for (let i = 0; i < 4; i++) w.u8(v >>> (8 * i)); return w; }, str: (s) => { for (const ch of Buffer.from(s, 'utf8')) w.u8(ch); return w.u8(0); },
        dv: () => new DataView(new Uint8Array(b).buffer), ab: () => new Uint8Array(b).buffer
    };
    return w;
};
/* agar.io / Expanding Land / private server opcode 16 (updateCells): eats, records, 0, removes */
function upd(eats, recs, removes, opts) {
    const w = bytes();
    if (!(opts && opts.noOpcode)) w.u8(16);
    w.u16(eats.length); eats.forEach(e => w.u32(e[0]).u32(e[1]));
    recs.forEach(r => {
        const flags = (r.color ? 2 : 0) | (r.name != null ? 8 : 0);
        w.u32(r.id).u32(r.x || 0).u32(r.y || 0).u16(r.size || 100).u8(flags);
        if (r.color) r.color.forEach(w.u8);
        if (r.name != null) w.str(r.name);
    });
    w.u32(0).u16(removes.length); removes.forEach(w.u32);
    return w;
}
const valid = () => upd([], [{ id: 11, x: 100, y: 200, size: 50, color: [9, 8, 7], name: 'A' }, { id: 12, x: 300, y: 300, size: 60, color: [1, 2, 3], name: 'B' }], []).dv();
const empty = () => upd([], [], []).dv();
const truncated = () => { const w = upd([], [{ id: 13, x: 1, y: 2, size: 70, color: [1, 1, 1], name: 'C' }], [11]); return new DataView(new Uint8Array(w.b.slice(0, 14)).buffer); };
const msg = (dv) => ({ data: dv.buffer });
const D = (t) => t.L._lmND;

/* 1. raw opcode 16: valid, empty, malformed */
{
    const t = twin('valid / empty / truncated opcode 16', [
        (t) => { clock.t = 2000; t.L.onMessage(msg(valid())); },
        (t) => { clock.t = 2040; t.L.onMessage(msg(empty())); },
        (t) => { clock.t = 2080; t.L.onMessage(msg(truncated())); }
    ]);
    const d = D(t);
    check('callbacks and world updates counted: 3 received, 3 attempted', d.rx === 3 && d.wRx === 3 && d.wTry === 3, JSON.stringify(d));
    check('valid and empty updates applied, the truncated one rejected (not applied, not incomplete)', d.wOk === 2 && d.wBad === 1 && d.wPart === 0 && d.open === 0);
    check('times: last callback and attempt at the truncated one, last applied at the empty one', d.msgAt === 2080 && d.tryAt === 2080 && d.okAt === 2040 && d.badAt === 2080);
    check('opcode 16 RangeError path keeps packets/s (countPps for all 3, as before)', t.L.ppsCalls === 3);
    check('nothing logged as an error', t.g.errors.length === 0, t.g.errors.join(' | '));
}
/* 1b. opcode 16 whose parser throws another error (not a RangeError): thrown on as before,
 * counted once as a rejected world update, not also as another packet rejected */
{
    const t = twin('opcode 16 parser throwing a TypeError', [
        (t) => { clock.t = 2100; t.L.onMessage(msg(valid())); }
    ], (t) => { t.L.megaFFAscore = function () { throw new TypeError('x'); }; });
    const d = D(t);
    check('TypeError in the parser: one world update rejected, no other packet rejected, nothing open', d.wTry === 1 && d.wBad === 1 && d.pBad === 0 && d.wOk === 0 && d.open === 0, JSON.stringify([d.wBad, d.pBad, d.open]));
}

/* 2. compressed (opcode 255): truncated frame, valid, decompressed but cut short */
{
    const z = (body) => (t) => { t.L.decompressMessage = () => Buffer.from(body); t.L.handleMessage(new DataView(new Uint8Array([255, 0, 0, 0, 0, 0, 0]).buffer)); };
    const t = twin('compressed frames', [
        (t) => { clock.t = 3000; t.L.handleMessage(new DataView(new Uint8Array([255, 1, 2]).buffer)); },
        (t) => { clock.t = 3010; z(new Uint8Array(valid().buffer))(t); },
        (t) => { clock.t = 3020; z(new Uint8Array(truncated().buffer))(t); },
        (t) => { clock.t = 3030; z(new Uint8Array(0))(t); }
    ]);
    const d = D(t);
    check('truncated compressed frame (real decompressMessage): counted as a rejected compressed frame', d.zBad === 2 && d.badAt >= 3000);
    check('compressed world updates: one applied, the cut-short one rejected through the packet handler', d.wRx === 2 && d.wTry === 2 && d.wOk === 1 && d.wBad === 1 && d.pBad === 0);
    check('compressed: packets/s only for the applied one (as before)', t.L.ppsCalls === 1);
}

/* 3. held back on purpose: dead main player while a multibox unit plays, the spawn gate */
{
    const t = twin('held back world updates', [
        (t) => { t.g.mainPlayerDeadMbActive = true; t.L.playerCellsMulti = [{}]; clock.t = 4000; t.L.onMessage(msg(valid())); },
        (t) => { t.L.decompressMessage = () => Buffer.from(new Uint8Array(valid().buffer)); clock.t = 4010; t.L.handleMessage(new DataView(new Uint8Array([255, 0, 0, 0, 0, 0, 0]).buffer)); },
        (t) => { t.g.mainPlayerDeadMbActive = false; t.L._spawnTransitGate = true; clock.t = 4020; t.L.onMessage(msg(valid())); },
        (t) => { t.L._spawnTransitGate = false; clock.t = 4030; t.L.onMessage(msg(valid())); }
    ]);
    const d = D(t);
    check('multibox (raw and compressed) and spawn gate: held back, not attempted, not rejected', d.wMb === 2 && d.wGate === 1 && d.wRx === 4 && d.wTry === 1 && d.wOk === 1 && d.wBad === 0);
    check('held back times kept for the packet gap details', d.mbAt === 4010 && d.gateAt === 4020 && d.okAt === 4030);
    check('held back updates: packets/s only for the one handled, its cells there (as before)', !!t.L.indexedCells[11] && t.L.ppsCalls === 1, t.L.ppsCalls);
}

/* 4. Garix (garixUpdateCells): complete, without the remove list, one section, cut inside a
 * record (its checked parser stops there: incomplete), an eat count the packet cannot hold
 * (dropped before anything is applied: rejected) */
{
    const gx = (opts) => {
        const w = bytes().u8(16).u16(0);
        w.u32(21).u32(10).u32(20).u16(40).u8(0x02).u8(1).u8(2).u8(3);
        w.u32(0);
        if (opts !== 'one-section') { w.u32(22).u32(30).u32(40).u16(50).u8(0); w.u32(0); }
        if (opts !== 'no-remove' && opts !== 'one-section') w.u16(1).u32(99);
        if (opts === 'eats') return new DataView(new Uint8Array([16, 9, 0, 1, 0, 0, 0]).buffer);
        if (opts === 'cut') return new DataView(new Uint8Array(w.b.slice(0, 12)).buffer);
        return w.dv();
    };
    const t = twin('Garix world updates', [
        (t) => { t.L.serverType = 'garix'; clock.t = 5000; t.L.onMessage(msg(gx())); },
        (t) => { clock.t = 5010; t.L.onMessage(msg(gx('no-remove'))); },
        (t) => { clock.t = 5020; t.L.onMessage(msg(gx('one-section'))); },
        (t) => { clock.t = 5030; t.L.onMessage(msg(gx('cut'))); },
        (t) => { clock.t = 5040; t.L.onMessage(msg(gx('eats'))); }
    ]);
    const d = D(t);
    check('Garix: complete update applied; no remove list, a missing section or a record cut short: incomplete (not applied)', d.wOk === 1 && d.wPart === 3 && d.okAt === 5000, JSON.stringify([d.wOk, d.wPart, d.wBad]));
    check('Garix: an eat count the packet cannot hold: rejected (dropped before anything applied), nothing open', d.wBad === 1 && d.wTry === 5 && d.open === 0 && d.badAt === 5040 && d.wLost === 0);
    check('Garix: cells still applied as before by the tolerant parser', !!t.L.indexedCells[21] && !!t.L.indexedCells[22]);
}

/* 5. Sigmally (_handleSigmallyCellUpdate through onMessage, opcode map) */
{
    const sg = (opts) => {
        const w = bytes().u8(16).u16(0);
        w.u32(31).i16(10).i16(20).u16(80).u8(0x08).u8(0).u8(0).u8(0).str('').str('Sig');
        if (opts !== 'no-end') w.u32(0).u16(0);
        return w.dv();
    };
    const map = new Uint8Array(256); for (let i = 0; i < 256; i++) map[i] = i;
    const t = twin('Sigmally world updates', [
        (t) => { Object.assign(t.L, { serverType: 'sigmally', sigHandshakeDone: true, sigOpcodeMapInverse: map }); clock.t = 6000; t.L.onMessage(msg(sg())); },
        (t) => { clock.t = 6010; t.L.onMessage(msg(sg('no-end'))); },
        /* an eat count the packet cannot hold, no eater 0: dropped before anything is applied */
        (t) => { clock.t = 6020; t.L.onMessage(msg(new DataView(new Uint8Array([16, 9, 0, 1, 0, 0, 0]).buffer))); }
    ]);
    const d = D(t);
    check('Sigmally: complete update applied, one without its terminator and remove list incomplete', d.wRx === 3 && d.wOk === 1 && d.wPart === 1 && d.okAt === 6000);
    check('Sigmally: an eat count the packet cannot hold: rejected, nothing open', d.wBad === 1 && d.wLost === 0 && d.open === 0 && d.badAt === 6020, JSON.stringify([d.wBad, d.wLost, d.open]));
    check('Sigmally: the cell is there as before', !!t.L.indexedCells[31] && t.L.indexedCells[31].targetNick === 'Sig');
}

/* 6. Senpa (opcode 20 in onMessage): complete, cut inside a record (incomplete), an eat count the
 * packet cannot hold (rejected); both caught in onMessage, so nothing stays open */
{
    const sp = (cut) => {
        const w = bytes().u8(20).u16(0).u16(1).u32(41).u32(5).u32(6).u16(90).u8(1).u16(0).u16(0);
        return cut ? new DataView(new Uint8Array(w.b.slice(0, 9)).buffer) : w.dv();
    };
    const t = twin('Senpa world updates', [
        (t) => { Object.assign(t.L, { serverType: 'senpa', _senpaPlayers: {}, _senpaClients: {} }); clock.t = 7000; t.L.onMessage(msg(sp())); },
        (t) => { clock.t = 7010; t.L.onMessage(msg(sp(true))); },
        (t) => { clock.t = 7020; t.L.onMessage(msg(sp())); },
        (t) => { clock.t = 7030; t.L.onMessage(msg(new DataView(new Uint8Array([20, 255, 0, 0]).buffer))); }
    ]);
    const d = D(t);
    check('Senpa: complete updates applied; the one cut inside a record incomplete, the eat count that does not fit rejected, none left open', d.wRx === 4 && d.wOk === 2 && d.wPart === 1 && d.wBad === 1 && d.wLost === 0 && d.open === 0 && d.pBad === 0, JSON.stringify([d.wOk, d.wPart, d.wBad, d.wLost, d.open, d.pBad]));
}

/* 7. replay: playback and seek (packets through handleMessage, not a socket callback) */
{
    const t = twin('replay world updates', [
        (t) => { t.g._lmEvReplayOn = true; clock.t = 8000; t.L.handleMessage(valid()); },
        (t) => { t.g._lmReplayQuiet = 1; clock.t = 8010; t.L.handleMessage(empty()); t.g._lmReplayQuiet = 0; }
    ]);
    const d = D(t);
    check('replay: counted as replay world updates (one during a seek), no socket callback', d.wRp === 2 && d.wSeek === 1 && d.rx === 0 && d.wOk === 2);
}

/* 8. a slow parser: the attempt time is its start, the applied time its end */
{
    const t = twin('slow parser', [(t) => { t.L.megaFFAscore = () => { clock.t += 350; }; clock.t = 9000; t.L.onMessage(msg(valid())); }]);
    const d = D(t);
    check('slow parser: callback 9000, attempt 9000, applied 9350 (the callback time is not the arrival)', d.msgAt === 9000 && d.tryAt === 9000 && d.okAt === 9350);
}

/* 9. a hidden tab: world updates received while hidden, callback gaps over a hidden period */
{
    const t = twin('hidden tab', [
        (t) => { clock.t = 10000; t.L.onMessage(msg(empty())); },
        (t) => { t.g.document.hidden = true; clock.t = 10010; (t.g.document.listeners.visibilitychange || []).forEach(f => f()); },
        (t) => { clock.t = 12010; t.L.onMessage(msg(empty())); },
        (t) => { t.g.document.hidden = false; clock.t = 12020; (t.g.document.listeners.visibilitychange || []).forEach(f => f()); },
        (t) => { clock.t = 12520; t.L.onMessage(msg(empty())); },
        (t) => { clock.t = 12600; t.L.onMessage(msg(empty())); }
    ]);
    const d = D(t);
    check('hidden: one world update received while hidden', d.wHid === 1 && d.hidden === false && d.visAt === 12020);
    check('callback gaps: 2010 ms in all, the visible-only longest leaves out the ones over a hidden time or a tab change (80)', d.msgGap === 2010 && d.msgGapVis === 80, d.msgGap + ' / ' + d.msgGapVis);
}

/* 10. generations: open, close, closeConnection (detaches onclose), reconnect, replacement */
{
    const t = mk(true), d = D(t), gaps = [];
    t.g.LMPerf = { packetGap: (...a) => gaps.push(a), netEvent: noop };
    clock.t = 20000; t.L.onMessage(msg(valid()));
    check('first connection: generation 1', d.gen === 1 && d.live && d.rx === 1);
    /* an open packet gap when the connection closes: listed once, with the connection's state */
    t.L._lmLastWorldUpdate = Date.now() - 900; t.g.drawRender._lmStallMax = 800; t.L.play = true;
    clock.t = 20900;
    t.L.closeConnection();
    check('closeConnection: the open packet gap is listed once, while playing', gaps.length === 1 && gaps[0][0] >= 900 && gaps[0][1] === true, JSON.stringify(gaps));
    check('closeConnection: generation ended with its counters kept as the previous one, the current zeroed', d.prev && d.prev.reason === 'closeConnection' && d.prev.rx === 1 && d.prev.wOk === 1 && !d.live && d.rx === 0 && d.wOk === 0);
    const prev1 = d.prev;
    const PP = require(path.join(root, 'ogario', 'modules', 'perf.js'));
    clock.t = 25900;
    check('report lines (perf.js wuLine): no connection open for 5 s; the previous one with why it ended', /^no connection open \(5 s\): callbacks 0,/.test(PP.wuLine(d, clock.t)) &&
        /^connection #1, closeConnection after \d+ s: callbacks 1, world updates received 1, attempted 1, applied 1, incomplete 0, rejected 0, held back: multibox 0, spawn gate 0; last callback 900 ms ago, attempt 900 ms ago, applied 900 ms ago, frame drawn -; longest callback gap 0 ms visible, 0 ms in all$/.test(PP.wuLine(d.prev, d.prev.endAt)),
        PP.wuLine(d, clock.t) + ' | ' + PP.wuLine(d.prev, d.prev.endAt));
    clock.t = 20900;
    t.L.closeConnection();
    t.L.onClose({ code: 1000, reason: '', wasClean: true });
    check('a second closeConnection and a late onClose: nothing listed or ended twice', gaps.length === 1 && d.prev === prev1);
    /* reconnect */
    t.L.ws = 'wss://test.example/'; t.L.socket = { readyState: 1, OPEN: 1, send: noop, close: noop }; t.L.serverType = 'senpa';
    clock.t = 21000; t.L.onOpen();
    check('reconnect (onOpen): generation 2, fresh counters, previous kept', d.gen === 2 && d.live && d.rx === 0 && d.prev === prev1 && d.t0 === 21000);
    clock.t = 21100; t.L.onMessage(msg(bytes().u8(20).u16(0).u16(0).u16(0).u16(0).dv()));
    t.L.onClose({ code: 1006, reason: '', wasClean: false });
    check('onClose: generation 2 ended as close', d.prev.reason === 'close' && d.prev.gen === 2 && d.prev.wOk === 1 && !d.live);
    clock.t = 22000; t.L.onOpen();
    clock.t = 22100; t.L.onOpen();
    check('a new start while connected: the running generation ends as replaced (once)', d.gen === 4 && d.prev.reason === 'replaced' && d.prev.gen === 3);
    const end = d.prev;
    t.L._lmNetDiagEnd('close'); t.L._lmNetDiagEnd('close');
    check('ending twice keeps one previous connection', d.prev !== end && d.prev.gen === 4 && (t.L._lmNetDiagEnd('x'), d.prev.gen === 4 && d.prev.reason === 'close'));
}
/* the same connection steps with and without diagnostics: no other reconnect, timer or state */
twin('open, closeConnection, onClose, reconnect', [
    (t) => { clock.t = 23000; t.L.onMessage(msg(valid())); },
    (t) => { t.L._lmLastWorldUpdate = Date.now() - 900; t.g.drawRender._lmStallMax = 800; t.L.closeConnection(); },
    (t) => { t.L.ws = 'wss://test.example/'; t.L.socket = { readyState: 1, OPEN: 1, send: noop, close: noop }; t.L.serverType = 'senpa'; clock.t = 23500; t.L.onOpen(); },
    (t) => { t.L.ws = 'wss://ffa.legendmod.ml/x'; t.L.onClose({ code: 1006, reason: '', wasClean: false }); }
], (t) => { t.g.LMPerf = { packetGap: noop, netEvent: noop, event: noop }; });

/* 11. a delayed callback of a replaced socket (the real _finishConnect): dropped and counted */
{
    const fc = block('        _finishConnect(url, app) {');
    if (!fc) check('_finishConnect found', false);
    else {
        const g = { console: { log: noop, warn: noop, error: noop }, Math, Date, Number, Object, JSON, parseInt, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop };
        g.window = g;
        g.WebSocket = function (url) { this.url = url; this.readyState = 0; this.close = noop; };
        g.WebSocket.CONNECTING = 0; g.WebSocket.OPEN = 1;
        g.application = new Proxy({}, { get: () => noop });
        g.localStorage = { getItem: () => null, setItem: noop };
        g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: () => noop });
        vm.createContext(g);
        const obj = vm.runInContext('with (__env) { ({' + fc + '}) }', g);
        let got = 0;
        Object.assign(obj, { serverType: 'private', socket: null, ws: 'wss://b.example/', integrity: false, onMessage() { got++; }, onOpen: noop, onClose: noop, onError: noop, _lmND: { stale: 0 } });
        const app = new Proxy(obj, { get: (t, k) => k in t ? t[k] : noop });
        app._finishConnect('wss://a.example/', app);
        const oldHandler = app.socket.onmessage;
        app._finishConnect('wss://b.example/', app);
        oldHandler({ data: new ArrayBuffer(33) });
        app.socket.onmessage({ data: new ArrayBuffer(33) });
        check('delayed callback of the old socket: dropped as before and counted as stale', got === 1 && obj._lmND.stale === 1);
    }
}

/* 12. packet gap details (_lmGapEvent): held back, rejected, hidden, other packets, nothing */
{
    const t = mk(true), d = D(t), gaps = [];
    t.g.LMPerf = { packetGap: (...a) => gaps.push(a) };
    clock.t = 30000; t.L.onMessage(msg(valid()));
    clock.t = 30100; t.L.onMessage(msg(new DataView(new Uint8Array([242]).buffer)));
    clock.t = 30800; t.L.onMessage(msg(valid()));
    t.L._lmGapEvent(700, 0);
    check('gap with another packet handled in it: not held, not rejected, other packets', gaps[0][2] === '' && gaps[0][3] === false && gaps[0][4] === false && gaps[0][5] === true, JSON.stringify(gaps[0]));
    clock.t = 32000; t.L._lmGapEvent(1100, 0);
    check('gap with nothing received', gaps[1][5] === false);
    t.g.mainPlayerDeadMbActive = true; t.L.playerCellsMulti = [{}];
    clock.t = 32500; t.L.onMessage(msg(valid()));
    clock.t = 32600; t.L._lmGapEvent(500, 0);
    check('gap while the dead main player\'s updates are held back: multibox', gaps[2][2] === 'multibox');
    t.g.mainPlayerDeadMbActive = false; t.L.playerCellsMulti = [];
    /* a parsed update, rejected or not, restarts the freeze detector's gap (updateCells sets
     * _lmLastWorldUpdate first): a rejected one can only end a gap, as the render loop sees it
     * 20 ms later; the silence before it is not explained by it */
    clock.t = 33000; t.L.onMessage(msg(truncated()));
    clock.t = 33020; t.L._lmGapEvent(450, 20);
    check('gap ended by a rejected world update: not a gap of rejected updates', gaps[3][3] === false && gaps[3][2] === '', JSON.stringify(gaps[3]));
    /* compressed frames rejected before any parser: they do not restart the gap */
    clock.t = 33100; t.L.handleMessage(new DataView(new Uint8Array([255, 1, 2]).buffer));
    clock.t = 33400; t.L._lmGapEvent(350, 0);
    check('gap with a rejected compressed frame in it', gaps[4][3] === true && gaps[4][2] === '', JSON.stringify(gaps[4]));
    t.g.document.hidden = true; (t.g.document.listeners.visibilitychange || []).forEach(f => f());
    clock.t = 34000; t.L._lmGapEvent(500, 0);
    check('gap while the tab is hidden', gaps[5][4] === true);
    t.L._lmGapEvent(100, 0);
    check('under 250 ms: not listed', gaps.length === 6);
    /* right after the page loaded (the clock starts at 0): nothing that never happened is in the gap */
    const early = mk(false);
    early.L._lmNetDiagStart();
    const eg = []; early.g.LMPerf = { packetGap: (...a) => eg.push(a) };
    clock.t = 300; early.L._lmGapEvent(900, 0);
    check('a gap starting before the page clock began: no held back, rejected, hidden or other packets', eg.length === 1 && eg[0][2] === '' && !eg[0][3] && !eg[0][4] && !eg[0][5], JSON.stringify(eg));
    delete t.g.LMPerf.packetGap; let ev = null; t.g.LMPerf.event = (...a) => { ev = a; };
    t.L.play = false; t.L._lmGapEvent(300, 0);
    check('an older perf.js (no packetGap): the old event', ev && ev[0] === 'packet gap' && ev[1] === 300 && ev[2] === 'no world update');
}

/* 13. cost: the counters are fields of one object, no new key or object per packet */
{
    const a = mk(true);
    const d = D(a), keys = Object.keys(d).length;
    for (let i = 0; i < 3000; i++) { clock.t += 1; a.L.onMessage(msg(i % 3 ? valid() : i % 2 ? empty() : truncated())); }
    check('the same object and the same fields after 3000 packets', D(a) === d && Object.keys(d).length === keys && d.prev === null && d.wTry === 3000);
    /* the real per-packet diagnostics code (the onMessage block and the world update helpers)
     * in a plain context (the game harness above looks every global up through a proxy, which
     * would swamp it): what one world update costs the main thread */
    const block16 = cut('            var _lmNd = this._lmND;\n            if (_lmNd) {\n', '\n            //console.log(message.data)');
    /* compiled in this context, not a vm one: a vm global is looked up through an interceptor */
    const o = new Function('window', 'document', 'performance', 'return ({ entry() {\n' + block16 + '\n},\n' + parts.diag + '});')({}, { hidden: false, addEventListener() { } }, performance);
    o._lmNetDiagStart();
    const N = 1000000;
    const loop = (on) => {
        const t0 = process.hrtime.bigint();
        for (let i = 0; i < N; i++) { if (on) { o.entry(); o._lmWuRx(0); o._lmWuBegin(); o._lmWuEnd(true); } else o.entry.call({}); }
        return Number(process.hrtime.bigint() - t0) / N;
    };
    loop(true); loop(false);
    const on = [], off = [];
    for (let r = 0; r < 5; r++) { off.push(loop(false)); on.push(loop(true)); }
    on.sort((x, y) => x - y); off.sort((x, y) => x - y);
    const ns = on[2] - off[2];
    console.log('info diagnostics per world update (callback + received + attempt + applied): ' + ns.toFixed(0) + ' ns (median of 5 x ' + N + '; performance.now() calls included)');
    check('cost per world update under 2 us, generous for a loaded machine (a world update is parsed in about 0.1-2 ms)', ns < 2000, ns.toFixed(0) + ' ns');
}

console.log(fail ? fail + ' check(s) failed' : 'all network diagnostics checks passed');
process.exit(fail ? 1 : 0);
