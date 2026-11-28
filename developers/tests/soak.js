/* Short soak (a few seconds instead of an hour of play): the real code is put through many rounds
 * of connect / spawn / death / Full Map on and off, and the timers, intervals, sockets, listeners
 * and heap it leaves behind are counted after every round. Nothing may pile up:
 * 1. spectators (ogario/spect.js with LM._lmSpecSetMode / _lmSpecReconcile / addSpect /
 *    flushSpecsData of ogario.v4.js): Full Map on (15 tiles, handshake, intervals running), a few
 *    tiles dropped by the server and reconnected, in-game spectator, a multibox unit that dies,
 *    a server switch, Full Map off: back to no socket, timer, interval or spectator each round,
 *    and no observation (the cells each tile saw, in the per-connection index lmObsTrack /
 *    lmObsOfSource of ogario.v4.js) left in the index or the world;
 *    the death-menu listeners of a unit are added once only;
 * 1b. Multibox 2.0 (the real lmMbPlayers, application.mbEnable / mbAddPlayer / mbRemovePlayer /
 *    mbDisable, spect.js addBox and the units' own cells, LM.flushCellsData of a server change):
 *    with Full Map off and on by turns, enable, Add Player up to six, a seventh refused, a middle
 *    slot (P4) removed and used again, multibox off, three players again and a server change: the
 *    sockets, timeouts, intervals, listeners, the registry (slots, reserved, bySource, ordered),
 *    window.spects, legendmod.playerCellsMulti and each unit's own index are back to none each
 *    round, and the peak and the unit numbers are the same every round;
 * 2. LMEvents (ogario.v4.js) with the death recap module: spawn / death / server change and its
 *    switch off and on: the listener lists keep their size, at most one sampling interval, none
 *    after a death;
 * 3. the heap after a garbage collection grows by less than a few MB over the later rounds.
 * node developers/tests/soak.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), v8 = require('v8');
const root = path.join(__dirname, '..', '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const src = read('ogario/ogario.v4.js'), spectSrc = read('ogario/spect.js'), drSrc = read('ogario/modules/deathrecap.js');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
const cut = (s, from, to) => { const a = s.indexOf(from), b = a < 0 ? -1 : s.indexOf(to, a + from.length); if (a < 0 || b < 0) throw new Error('code not found: ' + from.trim()); return s.slice(a, b); };
const t0 = Date.now();

/* ---- a fake clock that keeps every pending timeout and interval ---- */
function clock() {
    const c = { now: 1e9, seq: 0, live: new Map() };
    c.setTimeout = (fn, ms) => { const id = ++c.seq; c.live.set(id, { fn, at: c.now + (+ms || 0), every: 0 }); return id; };
    c.setInterval = (fn, ms) => { const id = ++c.seq; c.live.set(id, { fn, at: c.now + Math.max(1, +ms || 0), every: Math.max(1, +ms || 0) }); return id; };
    c.clear = (id) => { c.live.delete(id); };
    c.advance = (ms) => {
        const end = c.now + ms;
        for (let fired = 0; ; fired++) {
            if (fired > 200000) throw new Error('timers keep firing: a leak');
            let id = 0, t = null;
            for (const [k, v] of c.live) if (v.at <= end && (!t || v.at < t.at)) { id = k; t = v; }
            if (!t) break;
            c.now = t.at;
            if (t.every) t.at += t.every; else c.live.delete(id);
            t.fn();
        }
        c.now = end;
    };
    c.count = () => { let to = 0, iv = 0; for (const v of c.live.values()) { if (v.every) iv++; else to++; } return { to, iv }; };
    return c;
}
function listeners() {
    const m = new Map();
    return {
        m, add(t, f) { if (!m.has(t)) m.set(t, new Set()); m.get(t).add(f); }, remove(t, f) { if (m.has(t)) m.get(t).delete(f); },
        size() { let n = 0; for (const s of m.values()) n += s.size; return n; }
    };
}
const heapMB = () => process.memoryUsage().heapUsed / 1048576;
v8.setFlagsFromString('--expose_gc');
const gc = vm.runInNewContext('gc');

/* ============ 1. spectators: Full Map, in-game spectator, multibox unit ============ */
const S = (() => {
    const C = clock(), docL = listeners(), sockets = new Set();
    class WS {
        constructor(url) { this.url = url; this.readyState = 0; this.sent = 0; sockets.add(this); }
        send() { this.sent++; }
        close() { if (this.readyState !== 3) { this.readyState = 3; sockets.delete(this); } }
    }
    WS.prototype.CONNECTING = WS.CONNECTING = 0; WS.prototype.OPEN = WS.OPEN = 1; WS.prototype.CLOSING = WS.CLOSING = 2; WS.prototype.CLOSED = WS.CLOSED = 3;
    class FakeDate extends Date { static now() { return C.now; } }
    const W = 14142.135623730952, h = W / 2;
    const LM = {
        ws: 'wss://live-arena-abcde.agar.io:443', integrity: true, mapOffsetFixed: true, _lmFullMapCrowd: false, gameMode: ':ffa', play: true,
        mapOffsetX: 0, mapOffsetY: 0, _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1, mapMinX: -h, mapMaxX: h, mapMinY: -h, mapMaxY: h,
        vector: [[0, 0], [1, 0], [1, 1], [0, 1]], vnr: 0, indexedCells: {}, removedCells: [], cells: [], food: [], foodMulti: [], viruses: [],
        playerCellsMulti: [], ghostCells: [], cellcolors: {}, fbOnline: [], cursorX: 0, cursorY: 0, rgb2Hex: () => '#ffffff', vanillaskins() { }
    };
    const jq = { val: () => '', show() { return jq; }, hide() { return jq; } };
    const ctx = {
        legendmod: LM, console: { log() { }, warn() { }, error() { } }, Math, Number, String, Array, Object, Map, Set, WeakSet, JSON, Uint8Array, DataView, ArrayBuffer,
        Float64Array, Int32Array, Buffer, URL, Date: FakeDate, WebSocket: WS, Infinity, NaN, isFinite, parseInt, parseFloat,
        setTimeout: C.setTimeout, setInterval: C.setInterval, clearTimeout: C.clear, clearInterval: C.clear,
        document: { addEventListener: (t, f) => docL.add(t, f), removeEventListener: (t, f) => docL.remove(t, f) },
        master: { clientVersion: 31100, protocolVersion: 23 }, proLicenceUID: 'x', clanTagLc: '',
        defaultmapsettings: {}, defaultSettings: { foodColor: '#5000ff' }, profiles: [], Premadeletter123: 'LM',
        application: { teamPlayers: [], menuShown: 0, showMenu() { this.menuShown++; }, writeUint32(a, v) { a.push(v & 255, (v >> 8) & 255, (v >> 16) & 255, v >>> 24); } },
        toastr: { warning() { }, error() { }, info() { } }, lmT: (k) => k, $: () => jq,
        lmSetMbUnit(n) { ctx.multiboxPlayerEnabled = n || null; }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    /* the per-connection observation index of the core (a spectator's flushCellsData empties it) */
    vm.runInContext(cut(src, 'var _lmSrcObs = new Map();', '/* Speed of a cell'), ctx);
    vm.runInContext(spectSrc + '\n;window.Spect = Spect;', ctx);
    /* the core's "Inactive players" rule, which the cursor loop of spect.js reads */
    vm.runInContext(cut(src, 'function lmMbInactiveMoves() {', '/* The HUD editor'), ctx);
    /* the core's "a player of ours alive" test, which spect.js calls on a death */
    vm.runInContext(cut(src, 'function lmMbAlive(p) {', 'window.lmMbAlive = lmMbAlive;'), ctx);
    /* one method of the LM object, up to its closing brace (the comment before the next one left out) */
    const m = (name, next) => { const b = cut(src, '        ' + name + '(', next); return b.slice(0, b.lastIndexOf('\n        }') + 10); };
    const methods = [
        m('_lmSpecSetMode', '        _lmFullMapCrowdCheck('), m('_lmFullMapModeOff', '        _lmSpecLocal('), m('_lmSpecLocal', '        _lmSpecReconcile('),
        m('_lmSpecReconcile', '        flushSpecsData('), m('flushSpecsData', '        _lmBorderValid('), m('addSpect', '        isInView(')
    ];
    vm.runInContext('Object.assign(legendmod, {\n' + methods.join(',\n') + '\n});', ctx);
    /* a spectator's handshake as the server sends it: protocol key (241; the ping interval starts
     * on agar.io), server time (242: spectate, its tile's camera interval, free spectate), border */
    function handshake(sp) {
        if (!sp.socket || sp.socket.readyState !== 0) return;
        sp.socket.readyState = 1; sp.socket.onopen();
        const k = new DataView(new ArrayBuffer(9)); k.setUint8(0, 241); k.setUint32(1, 12345, true);
        sp.handleMessage(k);
        const t = new DataView(new ArrayBuffer(5)); t.setUint8(0, 242); t.setUint32(1, 1700000000, true);
        sp.handleMessage(t);
        sp.setMapOffset(-h, -h, h, h);
    }
    /* cells a tile sees (in the world and its connection's index; removeCell takes them out of both) */
    function observe(sp, k) {
        for (let i = 0; i < k; i++) {
            const c = { id: sp.number * 1e6 + i, spectator: sp.number, removed: false,
                removeCell() { if (this.removed) return; this.removed = true; ctx.lmObsUntrack(this); const j = LM.cells.indexOf(this); if (j >= 0) LM.cells.splice(j, 1); } };
            LM.cells.push(c);
            ctx.lmObsTrack(c, sp.number);
        }
    }
    const obsLeft = () => { let n = 0; ctx._lmSrcObs.forEach((set) => { n += set.size; }); return n + LM.cells.filter((c) => c.spectator > 0).length; };
    const drop = (sp) => { const s = sp.socket; if (!s) return; s.readyState = 3; sockets.delete(s); s.onclose({ code: 1006 }); };
    const live = () => [...sockets].filter((s) => s.onmessage).length;
    function state() { const c = C.count(); return { sockets: live(), timeouts: c.to, intervals: c.iv, spects: ctx.window.spects.length, doc: docL.size(), obs: obsLeft() }; }
    let peakSockets = 0, peakIntervals = 0, roundsOk = 0, maxTiles = 0, sentOk = true, peakObs = 0;
    const after = [];
    function round(r) {
        LM._lmSpecSetMode('full');
        const tiles = ctx.window.spects.filter((s) => s.tile != null);
        maxTiles = Math.max(maxTiles, tiles.length);
        tiles.forEach(handshake);
        tiles.forEach((s) => observe(s, 20));
        C.advance(1500);
        if (!tiles.every((s) => s.socket && s.socket.sent > 2)) sentOk = false;
        /* three tiles dropped by the server: each reconnects once after its backoff */
        tiles.slice(0, 3).forEach(drop);
        C.advance(1100);
        tiles.slice(0, 3).forEach(handshake);
        tiles.slice(0, 3).forEach((s) => observe(s, 20));
        LM.addSpect(); /* the next main border packet: nothing new opens */
        /* a multibox unit that dies with the main player dead: the menu and its listeners */
        ctx.addBox();
        const unit = ctx.window.spects[ctx.window.spects.length - 1];
        unit.socket.readyState = 1; unit.socket.onopen(); unit.active = true; LM.play = false;
        unit.terminate();
        LM.play = true;
        const st = state();
        peakSockets = Math.max(peakSockets, st.sockets); peakIntervals = Math.max(peakIntervals, st.intervals); peakObs = Math.max(peakObs, st.obs);
        if (r % 4 === 1) {
            /* server switch or lost main connection while Full Map is on (LM.connect / onClose:
             * flushCellsData() flushes the spectators, flushSpecsData) */
            LM.flushSpecsData();
            LM._lmSpecSetMode('ingame');
            ctx.window.spects.forEach(handshake);
            C.advance(500);
            LM._lmSpecSetMode('off');
        } else {
            LM._lmSpecSetMode('ingame');
            ctx.window.spects.filter((s) => s.tile == null && !s.player).forEach(handshake);
            C.advance(500);
            LM._lmSpecSetMode('off');
            unit.closeConnection();
            ctx.window.spects = ctx.window.spects.filter((s) => s !== unit);
        }
        C.advance(60000); /* any late retry would show up as a socket now */
        const end = state();
        after.push(end);
        if (!end.sockets && !end.timeouts && !end.intervals && !end.spects && !end.obs) roundsOk++;
    }
    return { round, after, get peakSockets() { return peakSockets; }, get peakIntervals() { return peakIntervals; }, get roundsOk() { return roundsOk; },
        get maxTiles() { return maxTiles; }, get sentOk() { return sentOk; }, get peakObs() { return peakObs; }, menus: () => ctx.application.menuShown };
})();

/* ============ 1b. Multibox 2.0: up to six players through the player calls, then a server change ============ */
const M = (() => {
    const C = clock(), docL = listeners(), sockets = new Set();
    class WS {
        constructor(url) { this.url = url; this.readyState = 0; this.sent = 0; sockets.add(this); }
        send() { this.sent++; }
        close() { if (this.readyState !== 3) { this.readyState = 3; sockets.delete(this); } }
    }
    WS.prototype.CONNECTING = WS.CONNECTING = 0; WS.prototype.OPEN = WS.OPEN = 1; WS.prototype.CLOSING = WS.CLOSING = 2; WS.prototype.CLOSED = WS.CLOSED = 3;
    class FakeDate extends Date { static now() { return C.now; } }
    const W = 14142.135623730952, h = W / 2;
    /* the border the main connection's handshake gives (a server change clears it, the new server's sets it again) */
    const border = { mapOffsetFixed: true, mapOffsetX: 0, mapOffsetY: 0, mapMinX: -h, mapMaxX: h, mapMinY: -h, mapMaxY: h };
    const LM = Object.assign({
        ws: 'wss://live-arena-abcde.agar.io:443', integrity: true, isLegendWorld: false, _lmFullMapCrowd: false, gameMode: ':ffa', play: true,
        _lmBorderCX: 0, _lmBorderCY: 0, _lmBorderKX: 1, _lmBorderKY: 1,
        vector: [[0, 0], [1, 0], [1, 1], [0, 1]], vnr: 0, indexedCells: {}, removedCells: [], cells: [], food: [], foodMulti: [], viruses: [],
        playerCells: [], playerCellsMulti: [], ghostCells: [], cellcolors: {}, fbOnline: [], cursorX: 0, cursorY: 0, rgb2Hex: () => '#ffffff', vanillaskins() { }
    }, border);
    const jq = { val: () => '', show() { return jq; }, hide() { return jq; } };
    const ctx = {
        legendmod: LM, LM, console: { log() { }, warn() { }, error() { } }, Math, Number, String, Array, Object, Map, Set, WeakSet, JSON, Uint8Array, DataView, ArrayBuffer,
        Float64Array, Int32Array, Buffer, URL, Date: FakeDate, WebSocket: WS, Infinity, NaN, isFinite, parseInt, parseFloat,
        setTimeout: C.setTimeout, setInterval: C.setInterval, clearTimeout: C.clear, clearInterval: C.clear,
        document: { addEventListener: (t, f) => docL.add(t, f), removeEventListener: (t, f) => docL.remove(t, f) },
        master: { clientVersion: 31100, protocolVersion: 23 }, proLicenceUID: 'x', clanTagLc: '',
        defaultmapsettings: { multiboxAmount: 6 }, defaultSettings: { foodColor: '#5000ff' }, profiles: [], Premadeletter123: 'LM',
        application: { teamPlayers: [], menuShown: 0, showMenu() { this.menuShown++; }, writeUint32(a, v) { a.push(v & 255, (v >> 8) & 255, (v >> 16) & 255, v >>> 24); } },
        toastr: { warning() { }, error() { }, info() { } }, lmT: (k) => k, $: () => jq,
        play() { LM.play = true; }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    /* the real core: LMEvents (its listener table where the test can count it) .. lmMbPlayers and
     * the multibox functions, lmTimeAlive, the indexed lists (window.lmCellIdx, as the core sets it) */
    const evSrc = cut(src, '/* LMEvents: hooks for user scripts', 'window.OgVer');
    if (evSrc.indexOf('var L = Object.create(null)') < 0) throw new Error('LMEvents listener table not found');
    vm.runInContext(evSrc.replace('var L = Object.create(null)', 'var L = window._lmSoakL = Object.create(null)') + '\n' +
        cut(src, 'function lmTimeAlive(p, n, now) {', '/* Session summary') + '\n' + cut(src, '    function quickSwapDelete(arr, index, idxProp) {', '    var ogarCellPool') +
        '\nwindow.lmCellIdx = { push: indexedPush, of: lmIdxOf, remove: lmIdxRemove, filter: lmIdxFilter };', ctx);
    vm.runInContext(spectSrc + '\n;window.Spect = Spect;', ctx);
    vm.runInContext(cut(src, 'function lmMbInactiveMoves() {', '/* The HUD editor'), ctx);
    const m = (name, next) => { const b = cut(src, '        ' + name + '(', next); return b.slice(0, b.lastIndexOf('\n        }') + 10); };
    const lmMethods = [
        m('_lmSpecSetMode', '        _lmFullMapCrowdCheck('), m('_lmFullMapModeOff', '        _lmSpecLocal('), m('_lmSpecLocal', '        _lmSpecReconcile('),
        m('_lmSpecReconcile', '        _lmMbStop('), m('_lmMbStop', '        flushSpecsData('), m('flushSpecsData', '        _lmBorderValid('), m('addSpect', '        isInView('),
        m('flushCellsData', '        /* Spectator toggles')
    ];
    const appMethods = [m('_lmMbStart', '        /* Multibox players, one implementation'), m('mbEnable', '        mbDisable('), m('mbDisable', '        mbAddPlayer('),
        m('mbAddPlayer', '        mbRemovePlayer('), m('mbRemovePlayer', '        mbSelectPlayer(')];
    vm.runInContext('Object.assign(legendmod, {\n' + lmMethods.join(',\n') + '\n});\nObject.assign(application, {\n' + appMethods.join(',\n') + '\n});', ctx);
    const app = ctx.application, reg = ctx.lmMbPlayers;
    function handshake(sp) {
        if (!sp.socket || sp.socket.readyState !== 0) return;
        sp.socket.readyState = 1; sp.socket.onopen();
        const k = new DataView(new ArrayBuffer(9)); k.setUint8(0, 241); k.setUint32(1, 12345, true);
        sp.handleMessage(k);
        if (sp.player) return; /* a unit's login (242) is not part of this */
        const t = new DataView(new ArrayBuffer(5)); t.setUint8(0, 242); t.setUint32(1, 1700000000, true);
        sp.handleMessage(t);
        sp.setMapOffset(-h, -h, h, h);
    }
    const live = () => [...sockets].filter((s) => s.onmessage).length;
    /* a unit's life: its socket opens and the server gives it CELLS own cells (opcode 32 after their records) */
    const CELLS = 3, made = [], cells = [];
    function bring(u) {
        if (!u) return null;
        made.push(u);
        handshake(u);
        for (let j = 0; j < CELLS; j++) {
            const id = u.number * 1000 + j + 1;
            const c = { id, spectator: u.number, _lmGen: u.connectionGeneration, removed: false, isFood: false, x: 0, y: 0, size: 60 };
            LM.indexedCells['' + id] = c;
            cells.push(c);
            u._lmOwnAdd(id);
        }
        return u;
    }
    /* per round: the players, their events, what was open at the peak */
    const ev = { playerAdded: 0, playerRemoved: 0, playerSpawned: 0 };
    Object.keys(ev).forEach((t) => ctx.LMEvents.on(t, () => { ev[t]++; }));
    const evL = () => JSON.stringify(Object.keys(ctx._lmSoakL).sort().map((k) => k + ':' + ctx._lmSoakL[k].length));
    const evBase = evL(), docBase = docL.size();
    const slotsOf = () => reg.ordered.map((u) => u.slotId).join();
    const bySourceOk = () => reg.bySource.size === reg.ordered.length && reg.ordered.every((u) => reg.bySource.get(u.number) === u);
    const units = () => ctx.window.spects.filter((s) => s && s.player);
    const bad = [], rounds = [];
    let roundsOk = 0;
    const need = (r, what, ok) => { if (!ok) bad.push('round ' + r + ': ' + what); return ok; };
    function round(r) {
        const fm = r % 2 === 1, b0 = bad.length;
        made.length = 0; cells.length = 0;
        Object.keys(ev).forEach((t) => { ev[t] = 0; });
        if (fm) {
            LM._lmSpecSetMode('full');
            ctx.window.spects.forEach(handshake);
            C.advance(300);
        }
        const tiles = live();
        if (fm) need(r, 'Full Map on: 15 tiles', tiles === 15);
        /* enable: one unit (P2); the main player stays controlled until P2's first spawn takes the
         * focus (fbf552277: a unit is not steered before its orientation is known); enable again
         * opens nothing */
        const u2 = bring(app.mbEnable());
        need(r, 'enable: P2 in slot 2, the main player still controlled until its spawn', !!u2 && u2.slotId === 2 && !ctx.multiboxPlayerEnabled && app.mbEnable() === u2 && units().length === 1);
        /* Add Player up to six players (Settings "Maximum Multibox players" 6), then no more */
        for (let i = 0; i < 4; i++) bring(app.mbAddPlayer());
        const epoch = reg._epoch, nums = units().map((u) => u.number).join();
        need(r, 'six players: slots 2..6, one socket each', slotsOf() === '2,3,4,5,6' && reg.count() === 6 && bySourceOk() && live() === tiles + 5 &&
            LM.playerCellsMulti.length === 5 * CELLS && ctx.window.spects.length === tiles + 5);
        need(r, 'a seventh: none, no socket, no reservation', app.mbAddPlayer() === null && live() === tiles + 5 && reg._epoch === epoch && units().length === 5);
        /* P3..P6 of Add Player never take the focus at their spawn (decision 1), P2 of enable does */
        need(r, 'P2 may take the focus at its spawn, P3..P6 may not', units().map((u) => (u._lmFocusClaimed ? 'c' : '-') + u.slotId).join() === '-2,c3,c4,c5,c6');
        C.advance(200); /* the units' cursor loops (and the tiles') run */
        const peak = { sockets: live(), intervals: C.count().iv, timeouts: C.count().to, nums };
        /* remove a middle slot (P4): the others keep their slots and numbers */
        const p4 = reg.get(4), n4 = p4.number, e4 = p4.slotEpoch;
        need(r, 'remove P4', app.mbRemovePlayer(4) === true && reg.get(4) === null && !reg.bySource.has(n4) && slotsOf() === '2,3,5,6' && bySourceOk() &&
            !p4.socket && !ctx.window.spects.includes(p4) && p4._lmOwn.length === 0 && LM.playerCellsMulti.length === 4 * CELLS && live() === tiles + 4 &&
            units().map((u) => u.number).join() === nums.split(',').filter((n) => +n !== n4).join());
        /* Add Player again: the free slot 4 with a new slotEpoch */
        const q4 = bring(app.mbAddPlayer());
        need(r, 'add again: slot 4 reused with a new slotEpoch', !!q4 && q4.slotId === 4 && q4.slotEpoch > e4 && reg.get(4) === q4 && slotsOf() === '2,3,4,5,6' && bySourceOk() &&
            live() === tiles + 5 && LM.playerCellsMulti.length === 5 * CELLS);
        /* multibox off: every unit closes, the tiles stay */
        need(r, 'disable: five units closed, the tiles stay', app.mbDisable() === 5 && !reg.ordered.length && !reg.bySource.size && live() === tiles &&
            !units().length && LM.playerCellsMulti.length === 0 && ctx.multiboxPlayerEnabled == null && LM.multiBoxPlayerExists === false);
        /* three players again, the focus on P3, then a server change (LM.connect: the connection's own flush) */
        bring(app.mbEnable()); bring(app.mbAddPlayer()); bring(app.mbAddPlayer());
        const p3 = reg.get(3);
        if (need(r, 'P3 there for the focus', !!p3)) ctx.lmSetMbUnit(p3.number);
        C.advance(100);
        need(r, 'three players again in slots 2..4', slotsOf() === '2,3,4' && bySourceOk() && live() === tiles + 3 && LM.playerCellsMulti.length === 3 * CELLS);
        LM.flushCellsData();
        need(r, 'server change: every socket closed, the slots free, focus on P1', live() === 0 && !ctx.window.spects.length && !reg.ordered.length &&
            ctx.multiboxPlayerEnabled == null && reg.activeSlot === 1);
        Object.assign(LM, border); /* the next server's handshake */
        if (fm) LM._lmSpecSetMode('off');
        C.advance(60000); /* a late reconnect or retry would show up now */
        const cnt = C.count();
        const end = {
            sockets: live(), timeouts: cnt.to, intervals: cnt.iv, spects: ctx.window.spects.length, doc: docL.size() - docBase, ev: evL() === evBase,
            reg: reg.slots.every((s) => s === null) && reg.reserved.every((x) => x === 0) && reg.bySource.size === 0 && reg.ordered.length === 0 &&
                reg._busy === false && reg.tokenSlot === 0 && reg.activeSlot === 1,
            multi: LM.playerCellsMulti.length, focus: ctx.multiboxPlayerEnabled == null && LM.multiBoxPlayerExists === false,
            own: made.every((u) => u._lmOwn.length === 0 && (!u._lmOwnIds || u._lmOwnIds.size === 0) && (!u.playerCellIDs || !u.playerCellIDs.length) && !u.socket && !u.positionController && !u.pingInterval),
            cells: cells.every((c) => c._lmOwner == null && !(c._playerMultiIdx >= 0)),
            events: ev.playerAdded === 9 && ev.playerRemoved === 9 && ev.playerSpawned === 9
        };
        need(r, 'back to the baseline ' + JSON.stringify(end), !end.sockets && !end.timeouts && !end.intervals && !end.spects && !end.doc && end.ev && end.reg &&
            !end.multi && end.focus && end.own && end.cells && end.events);
        rounds.push({ fm, peak });
        if (bad.length === b0) roundsOk++;
    }
    /* nothing grows from round to round: the same peak (sockets, intervals, timeouts) and unit numbers per Full Map state */
    function steady() {
        const ref = {};
        return rounds.every((x) => { const k = x.fm ? 'fm' : 'off', s = JSON.stringify(x.peak); if (!(k in ref)) ref[k] = s; return ref[k] === s; });
    }
    return { round, bad, rounds, steady, get roundsOk() { return roundsOk; } };
})();

/* ============ 2. LMEvents + death recap: spawn / death / server change ============ */
const E = (() => {
    const C = clock();
    class El {
        constructor() { this.children = []; this.style = {}; this.textContent = ''; this.parentNode = null; }
        get firstChild() { return this.children[0] || null; }
        get nextSibling() { const a = this.parentNode ? this.parentNode.children : []; return a[a.indexOf(this) + 1] || null; }
        appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
        removeChild(c) { this.children = this.children.filter((x) => x !== c); c.parentNode = null; return c; }
        getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
        querySelector() { return null; }
    }
    const body = new El(), byId = {};
    body.contains = () => false;
    const store = {};
    const ctx = {
        Date: { now: () => C.now }, Math, Number, String, Array, Object, Float64Array, Int32Array, Uint16Array, Infinity, isFinite, WeakSet,
        console: { log() { }, warn() { }, error() { } },
        setTimeout: C.setTimeout, setInterval: C.setInterval, clearTimeout: C.clear, clearInterval: C.clear,
        localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
        document: { getElementById: (id) => (byId[id] && byId[id].parentNode ? byId[id] : null), createElement: () => new El(), body },
        innerWidth: 915, innerHeight: 412, lmT: (k) => k,
        legendmod5: { gameOverStats: true },
        legendmod: { play: false, playerCells: [], cells: [], playerMass: 0, ws: 'wss://x' }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    /* the real LMEvents, with its (private) listener table kept where the test can count it */
    const evSrc = cut(src, '/* LMEvents: hooks for user scripts', 'window.spects = window.spects || [];');
    if (evSrc.indexOf('var L = Object.create(null)') < 0) throw new Error('LMEvents listener table not found');
    vm.runInContext(evSrc.replace('var L = Object.create(null)', 'var L = window._lmSoakL = Object.create(null)'), ctx);
    vm.runInContext(drSrc, ctx);
    ctx.LMDeathRecap.sync();
    const ev = ctx.LMEvents, lm = ctx.legendmod;
    const counts = () => ['spawn', 'death', 'serverChange'].map((n) => (ctx._lmSoakL[n] || []).length);
    let maxIv = 0, ivAfterDeath = 0, listOk = true;
    const base = JSON.stringify(counts());
    function round(r) {
        lm.play = true; lm.playerCells = [{ size: 100, x: 0, y: 0 }]; lm.playerMass = 100;
        ev.emit('spawn', { time: C.now });
        C.advance(1200);
        maxIv = Math.max(maxIv, C.count().iv);
        lm.play = false; lm.playerCells = [];
        ev.emit('death', { time: C.now, mass: 100, msAlive: 1200, unit: 0, scope: 'all' });
        ivAfterDeath = Math.max(ivAfterDeath, C.count().iv);
        if (r % 5 === 0) ev.emit('serverChange', { from: 'a', to: 'b' });
        if (r % 7 === 0) { ctx.legendmod5.gameOverStats = false; ctx.LMDeathRecap.sync(); ctx.legendmod5.gameOverStats = true; ctx.LMDeathRecap.sync(); }
        C.advance(10000);
        if (JSON.stringify(counts()) !== base) listOk = false;
    }
    return { round, base, get maxIv() { return maxIv; }, get ivAfterDeath() { return ivAfterDeath; }, get listOk() { return listOk; }, pending: () => C.count(), listeners: counts };
})();

/* ============ the soak ============ */
const N = 40;
S.round(0); E.round(0); M.round(0);
gc(); const heap0 = heapMB();
/* a round that leaves something behind ends the soak (leaked intervals would only slow the later rounds down) */
for (let r = 1; r <= N && S.roundsOk === r && M.roundsOk === r && E.listOk; r++) { S.round(r); E.round(r); M.round(r); }
gc(); const heap1 = heapMB();

const a = S.after;
check('Full Map on opens the planned tiles (' + S.maxTiles + '), each sends its camera after the handshake', S.maxTiles === 15 && S.sentOk);
check('while on: at most the 15 tiles + 1 unit open (peak ' + S.peakSockets + ' sockets, ' + S.peakIntervals + ' intervals)', S.peakSockets <= 16 && S.peakSockets >= 15 && S.peakIntervals >= 15 && S.peakIntervals <= 33);
check('every round ends with no socket, timeout, interval, spectator or observation left (' + S.roundsOk + '/' + a.length + ' of ' + (N + 1) + ', ' + S.peakObs + ' observations while on, index + world)', S.roundsOk === a.length && S.peakObs === 2 * 15 * 20, JSON.stringify(a.find((x) => x.sockets || x.timeouts || x.intervals || x.spects || x.obs)));
check('a dying unit adds the death-menu listeners once (5), not once per death', a.every((x) => x.doc === 5) && S.menus() === a.length, a.map((x) => x.doc).join(','));
check('multibox: ' + M.roundsOk + '/' + M.rounds.length + ' rounds of six players (enable, add, a seventh refused, remove P4, add again, off, a server change) end with no socket, timer, listener, slot, reservation, source, spect, playerCellsMulti or own cell left',
    M.roundsOk === M.rounds.length && M.rounds.length === N + 1, M.bad.slice(0, 3).join(' / '));
check('multibox: the peak and the unit numbers are the same every round, nothing grows (off ' + JSON.stringify(M.rounds[0] && M.rounds[0].peak) + ', Full Map ' + JSON.stringify(M.rounds[1] && M.rounds[1].peak) + ')', M.steady() && M.rounds.some((x) => x.fm) && M.rounds.some((x) => !x.fm),
    JSON.stringify(M.rounds.slice(0, 2).map((x) => x.peak)));
check('LMEvents: spawn / death / server change listener lists keep their size over ' + (N + 1) + ' lives and switch toggles (' + E.base + ')', E.listOk && E.base === '[1,1,1]', JSON.stringify(E.listeners()));
check('death recap: one sampling interval while alive, none after the death or at the end', E.maxIv === 1 && E.ivAfterDeath === 0 && E.pending().iv === 0, E.maxIv + '/' + E.ivAfterDeath + '/' + E.pending().iv);
check('heap after GC: +' + (heap1 - heap0).toFixed(2) + ' MB over ' + N + ' rounds (< 4 MB)', heap1 - heap0 < 4);
console.log('soak: ' + a.length + ' rounds in ' + (Date.now() - t0) + ' ms');
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
