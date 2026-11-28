/* Short soak (a few seconds instead of an hour of play): the real code is put through many rounds
 * of connect / spawn / death / Full Map on and off, and the timers, intervals, sockets, listeners
 * and heap it leaves behind are counted after every round. Nothing may pile up:
 * 1. spectators (ogario/spect.js with LM._lmSpecSetMode / _lmSpecReconcile / addSpect /
 *    flushSpecsData of ogario.v4.js): Full Map on (15 tiles, handshake, intervals running), a few
 *    tiles dropped by the server and reconnected, in-game spectator, a multibox unit that dies,
 *    a server switch, Full Map off: back to no socket, timer, interval or spectator each round;
 *    the death-menu listeners of a unit are added once only;
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
    vm.runInContext(spectSrc + '\n;window.Spect = Spect;', ctx);
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
    const drop = (sp) => { const s = sp.socket; if (!s) return; s.readyState = 3; sockets.delete(s); s.onclose({ code: 1006 }); };
    const live = () => [...sockets].filter((s) => s.onmessage).length;
    function state() { const c = C.count(); return { sockets: live(), timeouts: c.to, intervals: c.iv, spects: ctx.window.spects.length, doc: docL.size() }; }
    let peakSockets = 0, peakIntervals = 0, roundsOk = 0, maxTiles = 0, sentOk = true;
    const after = [];
    function round(r) {
        LM._lmSpecSetMode('full');
        const tiles = ctx.window.spects.filter((s) => s.tile != null);
        maxTiles = Math.max(maxTiles, tiles.length);
        tiles.forEach(handshake);
        C.advance(1500);
        if (!tiles.every((s) => s.socket && s.socket.sent > 2)) sentOk = false;
        /* three tiles dropped by the server: each reconnects once after its backoff */
        tiles.slice(0, 3).forEach(drop);
        C.advance(1100);
        tiles.slice(0, 3).forEach(handshake);
        LM.addSpect(); /* the next main border packet: nothing new opens */
        /* a multibox unit that dies with the main player dead: the menu and its listeners */
        ctx.addBox();
        const unit = ctx.window.spects[ctx.window.spects.length - 1];
        unit.socket.readyState = 1; unit.socket.onopen(); unit.active = true; LM.play = false;
        unit.terminate();
        LM.play = true;
        const st = state();
        peakSockets = Math.max(peakSockets, st.sockets); peakIntervals = Math.max(peakIntervals, st.intervals);
        if (r % 4 === 1) {
            /* server switch while Full Map is on (LM.connect flushes the spectators) */
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
        if (!end.sockets && !end.timeouts && !end.intervals && !end.spects) roundsOk++;
    }
    return { round, after, get peakSockets() { return peakSockets; }, get peakIntervals() { return peakIntervals; }, get roundsOk() { return roundsOk; },
        get maxTiles() { return maxTiles; }, get sentOk() { return sentOk; }, menus: () => ctx.application.menuShown };
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
        legendmod5: { gameOverStats: true, massLossAlert: true, massLossPct: 30 },
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
        if (r % 7 === 0) { ctx.legendmod5.gameOverStats = ctx.legendmod5.massLossAlert = false; ctx.LMDeathRecap.sync(); ctx.legendmod5.gameOverStats = ctx.legendmod5.massLossAlert = true; ctx.LMDeathRecap.sync(); }
        C.advance(10000);
        if (JSON.stringify(counts()) !== base) listOk = false;
    }
    return { round, base, get maxIv() { return maxIv; }, get ivAfterDeath() { return ivAfterDeath; }, get listOk() { return listOk; }, pending: () => C.count(), listeners: counts };
})();

/* ============ the soak ============ */
const N = 40;
S.round(0); E.round(0);
gc(); const heap0 = heapMB();
/* a round that leaves something behind ends the soak (leaked intervals would only slow the later rounds down) */
for (let r = 1; r <= N && S.roundsOk === r && E.listOk; r++) { S.round(r); E.round(r); }
gc(); const heap1 = heapMB();

const a = S.after;
check('Full Map on opens the planned tiles (' + S.maxTiles + '), each sends its camera after the handshake', S.maxTiles === 15 && S.sentOk);
check('while on: at most the 15 tiles + 1 unit open (peak ' + S.peakSockets + ' sockets, ' + S.peakIntervals + ' intervals)', S.peakSockets <= 16 && S.peakSockets >= 15 && S.peakIntervals >= 15 && S.peakIntervals <= 33);
check('every round ends with no socket, timeout, interval or spectator left (' + S.roundsOk + '/' + a.length + ' of ' + (N + 1) + ')', S.roundsOk === a.length, JSON.stringify(a.find((x) => x.sockets || x.timeouts || x.intervals || x.spects)));
check('a dying unit adds the death-menu listeners once (5), not once per death', a.every((x) => x.doc === 5) && S.menus() === a.length, a.map((x) => x.doc).join(','));
check('LMEvents: spawn / death / server change listener lists keep their size over ' + (N + 1) + ' lives and switch toggles (' + E.base + ')', E.listOk && E.base === '[1,1,1]', JSON.stringify(E.listeners()));
check('death recap: one sampling interval while alive, none after the death or at the end', E.maxIv === 1 && E.ivAfterDeath === 0 && E.pending().iv === 0, E.maxIv + '/' + E.ivAfterDeath + '/' + E.pending().iv);
check('heap after GC: +' + (heap1 - heap0).toFixed(2) + ' MB over ' + N + ' rounds (< 4 MB)', heap1 - heap0 < 4);
console.log('soak: ' + a.length + ' rounds in ' + (Date.now() - t0) + ' ms');
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
