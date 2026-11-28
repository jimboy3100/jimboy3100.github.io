// Live Full Map slice through the real multibox / Full Map hide step (lmMultiboxPositionTwin and the
// frame compaction cut from drawRender in ogario.v4.js): agar.io gives every connection its own
// colour for one player cell, so copies are matched by kind, size, server name and time-aligned
// position, never by colour. Checks, on 19 frames (every 5th of 91, 2.6 s) of a live agar.io FFA
// capture (main + 15 Full Map spectators gliding to their tiles, so views overlap a lot): every
// physical cell is drawn once (cells seen by up to 10 connections, each copy in its own server
// colour), a cell next to a copy is never hidden, the drawn copy does not switch while the same
// connections see the cell, and the drawn colour does not change.
// Usage: node developers/tests/fullmaptwin.js [ogario.v4.js]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../../ogario/ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const start = src.indexOf('var LM_UNIT_ID_STEP');
const endMark = src.indexOf('function lmMultiboxPositionTwin(');
const end = src.indexOf('\n}\n', endMark);
if (start < 0 || endMark < 0 || end < 0) throw new Error('multibox twin functions not found in ogario.v4.js');
const code = src.slice(start, end + 3);
const ca = src.indexOf('var _cW = 0;'), cb = src.indexOf('* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION', ca);
if (ca < 0 || cb < 0) throw new Error('frame compaction not found in ogario.v4.js');
const compact = src.slice(ca, cb).slice(0, src.slice(ca, cb).lastIndexOf('/*'));
/* the frame: its hide step (lmMbFrameHide, before compareCells), then the compaction */
const loop = 'function _frame() { var LM = window.legendmod, i, cell;\nlmMbFrameHide();\n' + compact + '\n}';

let failed = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (info === undefined ? '' : '  [' + info + ']'));
    if (!ok) failed++;
}

const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'lib/fullmap-twin-live.json'), 'utf8'));
const NF = fix.fields, S = fix.strs, T0 = 100000;
const spects = [];
for (let k = 1; k <= 15; k++) spects.push({ number: k, staticX: 0 });
const ctx = vm.createContext({ window: { legendmod: { cells: [], indexedCells: {}, time: 0 }, spects },
    Number, Math, Map, Float64Array, Int32Array, Array });
vm.runInContext(code + '\n' + loop, ctx);
const LM = ctx.window.legendmod;

const obs = new Map();
const conns = new Set();
let gtFrames = [];
for (const [ft, rows] of fix.frames) {
    const now = T0 + ft, seen = new Set();
    for (let o = 0; o < rows.length; o += NF) {
        const conn = rows[o], key = rows[o + 1], fl = rows[o + 7];
        conns.add(conn);
        let c = obs.get(key);
        /* a cell that left the view and came back is a new cell object, as in LM */
        if (!c || c.removed) {
            const raw = S[rows[o + 5]];
            c = { id: key, spectator: conn, color: raw, _lmRawColor: raw, isFood: false, removed: false, invisible: false,
                isVirus: !!(fl & 4), isEjected: !!(fl & 8), isPlayerCell: !!(fl & 16), isPlayerCellMulti: !!(fl & 32) };
            obs.set(key, c);
            LM.cells.push(c);
        }
        const nick = rows[o + 6] >= 0 ? S[rows[o + 6]] : null;
        if (nick) c._lmSrvName = nick;
        c.x = c.targetX = rows[o + 2];
        c.y = c.targetY = rows[o + 3];
        c.size = c.targetSize = rows[o + 4];
        c.updateTime = T0 + rows[o + 8];
        c._lmVX = rows[o + 9] / 1000;
        c._lmVY = rows[o + 10] / 1000;
        seen.add(c);
    }
    for (const c of obs.values()) if (!c.removed && !seen.has(c)) c.removed = true;
    LM.time = now;
    ctx._frame();
    /* this frame's state of each observation (the cell objects go on to the next frame) */
    const snap = [...seen].filter((c) => !c.isVirus && !c.isEjected).map((c) => ({ id: c.id, spectator: c.spectator, size: c.targetSize, _lmSrvName: c._lmSrvName,
        _lmRawColor: c._lmRawColor, targetX: c.targetX, targetY: c.targetY, updateTime: c.updateTime, _lmVX: c._lmVX, _lmVY: c._lmVY, drawn: !c.invisible, colour: c.color }));
    gtFrames.push({ now, cells: snap });
}

/* Ground truth, independent of the rule: copies of one cell are the mutual nearest cells of two
 * connections with the same size (2 %, it grows between packets) and name, within max(20, 0.2 r) + 60 ms of their speeds of each
 * other (positions moved to the frame's time), joined into one cell per group (one per connection). */
function truth(f) {
    const pos = (c) => { const dt = Math.max(-200, Math.min(200, f.now - c.updateTime)); return [c.targetX + c._lmVX * dt, c.targetY + c._lmVY * dt]; };
    const P = new Map(f.cells.map((c) => [c, pos(c)]));
    const same = (a, b) => a.spectator !== b.spectator && Math.abs(a.size - b.size) <= Math.max(2, 0.02 * a.size) && (a._lmSrvName || '') === (b._lmSrvName || '');
    const d = (a, b) => Math.hypot(P.get(a)[0] - P.get(b)[0], P.get(a)[1] - P.get(b)[1]);
    const nearestOn = (a, conn) => { let best = null, bd = Infinity; for (const b of f.cells) if (b.spectator === conn && same(a, b) && d(a, b) < bd) { bd = d(a, b); best = b; } return best; };
    const parent = new Map(f.cells.map((c) => [c, c]));
    const root = (c) => { while (parent.get(c) !== c) c = parent.get(c); return c; };
    const members = new Map(f.cells.map((c) => [c, new Set([c.spectator])]));
    for (const a of f.cells) for (const b of f.cells) {
        if (a.id >= b.id || !same(a, b)) continue;
        const sp = Math.abs(a._lmVX) + Math.abs(a._lmVY) + Math.abs(b._lmVX) + Math.abs(b._lmVY);
        if (d(a, b) > Math.max(20, 0.2 * a.size) + 60 * sp) continue;
        if (nearestOn(a, b.spectator) !== b || nearestOn(b, a.spectator) !== a) continue;
        const ra = root(a), rb = root(b);
        if (ra === rb) continue;
        const ma = members.get(ra), mb = members.get(rb);
        if ([...mb].some((x) => ma.has(x))) continue;
        parent.set(rb, ra);
        for (const x of mb) ma.add(x);
    }
    const groups = new Map();
    for (const c of f.cells) { const r = root(c); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(c); }
    return [...groups.values()];
}

let groups = 0, multi = 0, maxCopies = 0, five = 0, sameColourCopies = 0, copies = 0, twice = 0, never = 0, hiddenAlone = 0;
let switches = 0, linked = 0, colourChanges = 0, colourLinked = 0;
let prev = null;
for (const f of gtFrames) {
    const gs = truth(f), now = new Map();
    for (const g of gs) {
        groups++;
        const drawnCopies = g.filter((c) => c.drawn);
        if (g.length > 1) {
            multi++;
            copies += g.length;
            maxCopies = Math.max(maxCopies, g.length);
            if (g.length >= 5) five++;
            if (new Set(g.map((c) => c._lmRawColor)).size !== g.length) sameColourCopies++;
            if (drawnCopies.length > 1) twice++;
        } else if (!drawnCopies.length) hiddenAlone++;
        if (!drawnCopies.length && g.length > 1) never++;
        const rep = drawnCopies[0] || null, sig = g.map((c) => c.id).sort((a, b) => a - b).join(',');
        for (const c of g) now.set(c.id, { rep: rep && rep.id, sig, colour: rep ? rep.colour : null });
        if (prev && rep) {
            const p = g.map((c) => prev.get(c.id)).find(Boolean);
            if (p && p.rep) {
                colourLinked++;
                if (p.colour !== rep.colour) colourChanges++;
                if (p.sig === sig) { linked++; if (p.rep !== rep.id) switches++; }
            }
        }
    }
    prev = now;
}
console.log('slice: ' + gtFrames.length + ' frames, ' + conns.size + ' connections, ' + groups + ' cells (frames x cells), ' + multi + ' seen by 2 to ' + maxCopies + ' connections (' + copies + ' copies)');
check('live slice: cells seen by 5 or more connections at once', conns.size >= 5 && maxCopies >= 5 && five >= 50, conns.size + ' connections, ' + five + ' cells seen by 5 or more, max ' + maxCopies + ' copies');
check('every copy of one cell has its own server colour (colour cannot match copies)', multi > 300 && sameColourCopies === 0, sameColourCopies + ' of ' + multi);
/* at most 0.5 %: a piece of a split that moment (its speed from two packets differs a lot between
 * connections) is where the reference and the rule can disagree (none in this slice; in an earlier
 * capture one piece of a 4-way split, radius 50 to 53 at 600 units/s, in 726) */
check('each cell seen by several connections is drawn exactly once', twice <= multi * 0.005 && never === 0, twice + ' drawn twice, ' + never + ' not drawn, of ' + multi);
check('a cell seen by one connection only is never hidden', hiddenAlone <= (groups - multi) * 0.005, hiddenAlone + ' of ' + (groups - multi));
check('the drawn copy does not switch while the same connections see the cell', linked > 200 && switches === 0, switches + ' of ' + linked);
check('the drawn colour of a cell does not change', colourLinked > 200 && colourChanges === 0, colourChanges + ' of ' + colourLinked);

/* The shared colour cache (_lmMbLooks, real _lmMbLookSet / lmMbLookOf): at its cap of 4096 keys
 * it was cleared whole, and a live player's look, stamped on the cell as stored, was never stored
 * again (its copies' split pieces lost the shared colour); a server name that came after the first
 * store was never stored under the name either. */
{
    vm.runInContext('lmMbLooksReset()', ctx);
    ctx._live = [];
    vm.runInContext('for (var p = 0; p < 20; p++) _live.push({ spectator: 3, _lmGen: 1, _lmRawColor: "#1122" + (10 + p), _lmSrvName: "p" + p, color: "#4455" + (10 + p), _lmMbLookT: 10 });' +
        /* 5000 other looks, one per frame, while the 20 live ones are stored each frame (lmMbShareLook) */
        'for (var i = 0; i < 5000; i++) { _lmMbLookSet({ spectator: 4, _lmGen: 1, _lmRawColor: "#a" + i, _lmSrvName: "o" + i, color: "#b" + i, _lmMbLookT: 11 }); for (var q = 0; q < 20; q++) _lmMbLookSet(_live[q]); }', ctx);
    const kept = vm.runInContext('_live.filter(function (c, p) { var e = lmMbLookOf(3, 1, "#1122" + (10 + p), "p" + p); return e && e.c === c.color; }).length', ctx);
    const size = vm.runInContext('_lmMbLooks.size', ctx);
    check('colour cache past 4096 keys: the 20 live players keep their shared colour, the map stays capped', kept === 20 && size <= 4096, kept + ' of 20, size ' + size);
    const oldest = vm.runInContext('!!lmMbLookOf(4, 1, "#a0", "o0")', ctx);
    check('colour cache past 4096 keys: the oldest unused look is the one dropped', !oldest);
    /* a look only read (a player stored once, whose new pieces read it) stays; a pair stored
     * every frame is not stored again whenever another look is dropped (no global churn) */
    vm.runInContext('lmMbLooksReset(); var _P = { spectator: 7, _lmGen: 1, _lmRawColor: "#aa0000", _lmSrvName: "P", color: "#00ff00", _lmMbLookT: 5 }; _lmMbLookSet(_P);' +
        'var _Q = { spectator: 8, _lmGen: 1, _lmRawColor: "#bb0000", _lmSrvName: "Q", color: "#0000ff", _lmMbLookT: 6 }; _lmMbLookSet(_Q);' +
        'var _qSets = 0, _set = _lmMbLooks.set; _lmMbLooks.set = function (k, v) { if (k === "8.1|#bb0000|Q") _qSets++; return _set.call(this, k, v); };' +
        'for (var i = 0; i < 4100; i++) { _lmMbLookSet({ spectator: 2, _lmGen: 1, _lmRawColor: "#c" + i, _lmSrvName: "n" + i, color: "#123456", _lmMbLookT: i });' +
        ' _lmMbLookSet(_Q); if (i % 1000 === 999) lmMbLookOf(7, 1, "#aa0000", "P"); } delete _lmMbLooks.set;', ctx);
    check('colour cache: a live look that is only read survives 4100 new keys', !!vm.runInContext('lmMbLookOf(7, 1, "#aa0000", "P")', ctx));
    const qSets = vm.runInContext('_qSets', ctx);
    check('colour cache: a pair stored every frame is stored again only when its own look is dropped (' + qSets + ' of 4100 frames)', qSets <= 1 && !!vm.runInContext('lmMbLookOf(8, 1, "#bb0000", "Q")', ctx), qSets);
    vm.runInContext('var _late = { spectator: 5, _lmGen: 1, _lmRawColor: "#010203", _lmSrvName: null, color: "#0a0b0c", _lmMbLookT: 20 };' +
        '_lmMbLookSet(_late); _late._lmSrvName = "carol"; _lmMbLookSet(_late);', ctx);
    check('colour cache: a server name that arrives later is stored under the name', !!vm.runInContext('lmMbLookOf(5, 1, "#010203", "carol")', ctx));
    vm.runInContext('_lmMbLookSet({ spectator: 6, _lmGen: 1, _lmRawColor: "#111111", _lmSrvName: "same", color: "#aa0000", _lmMbLookT: 30 });' +
        '_lmMbLookSet({ spectator: 6, _lmGen: 1, _lmRawColor: "#222222", _lmSrvName: "same", color: "#00aa00", _lmMbLookT: 31 });', ctx);
    const a = vm.runInContext('lmMbLookOf(6, 1, "#111111", "same")', ctx), b = vm.runInContext('lmMbLookOf(6, 1, "#222222", "same")', ctx);
    check('colour cache: two players of one name with other server colours keep their own looks', !!a && !!b && a.c === '#aa0000' && b.c === '#00aa00');
    vm.runInContext('lmMbLooksReset(); _lmMbLookSet(_live[0])', ctx);
    check('colour cache: a cell stored before a reset is stored again after it', !!vm.runInContext('lmMbLookOf(3, 1, "#112210", "p0")', ctx));
}

/* ---------- the result does not depend on the order of LM.cells ---------- */
function fresh(n) {
    const sp = [];
    for (let k = 1; k <= (n || 15); k++) sp.push({ number: k, staticX: 0 });
    const c = vm.createContext({ window: { legendmod: { cells: [], indexedCells: {}, time: 0 }, spects: sp }, Number, Math, Map, Float64Array, Int32Array, Array });
    vm.runInContext(code + '\n' + loop, c);
    return c;
}
/* hidden copies behind a copy that is hidden too (then the cell may be drawn by no connection) */
const chains = (cs) => cs.filter((c) => !c.removed && c.invisible && c._lmMbTwin && c._lmMbTwin.invisible).length;
const stateOf = (cs) => cs.map((c) => 'S' + c.spectator + ':' + (c.invisible ? 'H>' + (c._lmMbTwin ? 'S' + c._lmMbTwin.spectator : '-') : 'D')).join(' ');
{
    /* sources 1, 2, 3 see one named cell (radius 50) at x 0, 7 and 14: 1-2 and 2-3 are in
     * tolerance (8), 1-3 is not; in list order 2 could hide behind 1 and 3 behind the hidden 2 */
    const perms = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
    const seen = new Set();
    let bad = 0;
    for (const p of perms) {
        const c = fresh(3), L = c.window.legendmod, cs = {};
        for (const s of p) { cs[s] = { id: s * 4294967296 + 1, spectator: s, x: [0, 0, 7, 14][s], y: 0, size: 50, targetSize: 50, color: '#3f3', _lmRawColor: '#3f3',
            isFood: false, removed: false, invisible: false, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false, _lmSrvName: 'X' }; L.cells.push(cs[s]); }
        for (let f = 0; f < 3; f++) {
            L.time += 16; c._frame();
            const all = [cs[1], cs[2], cs[3]];
            seen.add(stateOf(all));
            if (chains(all) || all.some((x) => x.invisible && (!x._lmMbTwin || x._lmMbTwin.invisible))) bad++;
        }
    }
    check('one cell 0 / 7 / 14 on 3 sources: the same result in all 6 list orders and 3 frames, no hidden copy behind a hidden one',
        seen.size === 1 && bad === 0, [...seen].join(' | ') + ', bad ' + bad);
}
{
    /* the live slice again with LM.cells reversed and shuffled every frame */
    function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
    function replay(mode, seed) {
        const c = fresh(15), L = c.window.legendmod, ob = new Map(), rnd = rng(seed), out = [];
        for (const [ft, rows] of fix.frames) {
            const seen = new Set();
            for (let o = 0; o < rows.length; o += NF) {
                const conn = rows[o], key = rows[o + 1], fl = rows[o + 7];
                let x = ob.get(key);
                if (!x || x.removed) {
                    const raw = S[rows[o + 5]];
                    x = { id: key, spectator: conn, color: raw, _lmRawColor: raw, isFood: false, removed: false, invisible: false,
                        isVirus: !!(fl & 4), isEjected: !!(fl & 8), isPlayerCell: !!(fl & 16), isPlayerCellMulti: !!(fl & 32) };
                    ob.set(key, x); L.cells.push(x);
                }
                const nick = rows[o + 6] >= 0 ? S[rows[o + 6]] : null;
                if (nick) x._lmSrvName = nick;
                x.x = x.targetX = rows[o + 2]; x.y = x.targetY = rows[o + 3];
                x.size = x.targetSize = rows[o + 4]; x.updateTime = T0 + rows[o + 8];
                x._lmVX = rows[o + 9] / 1000; x._lmVY = rows[o + 10] / 1000;
                seen.add(x);
            }
            for (const x of ob.values()) if (!x.removed && !seen.has(x)) x.removed = true;
            if (mode === 'rev') L.cells.reverse();
            if (mode === 'shuf') for (let i = L.cells.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = L.cells[i]; L.cells[i] = L.cells[j]; L.cells[j] = t; }
            L.time = T0 + ft; c._frame();
            const liveC = L.cells.filter((x) => !x.removed);
            out.push({ ids: liveC.filter((x) => !x.invisible).map((x) => x.id).sort((a, b) => a - b).join(','), chains: chains(liveC) });
        }
        return out;
    }
    const base = replay('nat', 1);
    let differ = 0, ch = base.reduce((a, r) => a + r.chains, 0);
    for (const [m, s] of [['rev', 1], ['shuf', 1], ['shuf', 2], ['shuf', 3]]) {
        const r = replay(m, s);
        differ += r.filter((x, i) => x.ids !== base[i].ids).length;
        ch += r.reduce((a, x) => a + x.chains, 0);
    }
    check('live slice in reversed and shuffled list orders: the same copies drawn every frame', differ === 0, differ + ' frames differ');
    check('live slice: no hidden copy behind a hidden copy, in any order', ch === 0, ch);
}

/* ---------- connections whose transform is not verified ---------- */
const feedMap = (c, m) => c.window.spects.forEach((s) => { s._lmFeedOk = () => m[s.number] !== false; });
const mkc = (L, id, sp, x, size, extra) => { const o = Object.assign({ id, spectator: sp, x, y: 1000, size, targetSize: size, color: '#3f3', _lmRawColor: '#3f3',
    isFood: false, removed: false, invisible: false, isVirus: false, isEjected: false, isPlayerCell: false, isPlayerCellMulti: false }, extra || {}); L.cells.push(o); return o; };
{
    /* unit 2 PROVISIONAL: its own cell "U" (mirrored, at a wrong place) lands on other players' unnamed cells */
    const c = fresh(3), L = c.window.legendmod;
    feedMap(c, { 2: false });
    const own = mkc(L, 2 * 4294967296 + 1, 2, 1000, 80, { isPlayerCellMulti: true, _lmSrvName: 'U' });
    const v3 = mkc(L, 3 * 4294967296 + 5, 3, 1003, 80);
    const m0 = mkc(L, 77, 0, 1002, 80);
    for (let f = 0; f < 2; f++) { L.time += 16; c._frame(); }
    check('unverified unit: its own cell stays drawn and hides no unnamed cell of a verified connection',
        !own.invisible && !m0.invisible && v3.invisible && v3._lmMbTwin === m0, stateOf([own, v3, m0]));
}
for (const order of [[3, 2], [2, 3]]) {
    /* a kept link to a copy whose connection turns CONFLICTED this frame */
    const c = fresh(3), L = c.window.legendmod, fm = {}, cs = {};
    feedMap(c, fm);
    for (const s of order) cs[s] = mkc(L, s * 4294967296 + 1, s, 500 + (s === 3 ? 2 : 0), 60, { _lmSrvName: 'P' });
    L.time += 16; c._frame();
    const before = stateOf([cs[2], cs[3]]);
    fm[2] = false;
    L.time += 16; c._frame();
    check('kept link to a copy of a connection that turns CONFLICTED (list order ' + order + '): the verified copy drawn alone',
        before === 'S2:D S3:H>S2' && cs[2].invisible && !cs[3].invisible && !cs[3]._lmMbTwin, before + ' -> ' + stateOf([cs[2], cs[3]]));
}
{
    const c = fresh(3), L = c.window.legendmod;
    const feeds = vm.runInContext('lmSrcFeeds', c), mbFeeds = vm.runInContext('_lmMbFeeds', c);
    const a = mkc(L, 1 * 4294967296 + 1, 1, 0, 60), b = mkc(L, 3 * 4294967296 + 1, 3, 2, 60);
    c.window.spects.splice(0, 1); /* connection 1 gone from window.spects, its cell still listed */
    L.time += 16; c._frame();
    check('a connection that is not there does not feed; a spect.js without _lmFeedOk (older copy) does',
        feeds(null) === false && feeds({}) === true && mbFeeds({ spectator: 9 }) === false && mbFeeds({ spectator: 0 }) === true);
    check('a cell of a connection gone from window.spects: not drawn, the verified copy drawn', a.invisible && !b.invisible && !b._lmMbTwin, stateOf([a, b]));
}

if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all live Full Map twin checks passed');
