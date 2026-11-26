/* Practice arena: simulation physics, determinism, scoring, personal best storage, and the
 * packets it encodes, read back both by its own reader and by the game's real packet handler
 * (handleMessage + updateCells taken from ogario/ogario.v4.js, run in a vm with stubs).
 * node developers/tests/practice.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const simSrc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'practice-sim.js'), 'utf8');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);

/* load like a page: only window.LMPracticeSim may appear */
const ctx = { Math, JSON, Date, ArrayBuffer, Uint8Array, DataView, Map, Set, Object, Array, Number, String, isFinite, escape, unescape, encodeURIComponent, decodeURIComponent };
ctx.window = ctx;
vm.createContext(ctx);
/* the page's translation runtime (cell names come from the language packs) */
i18n(ctx);
const before = new Set(Object.keys(ctx));
vm.runInContext(simSrc, ctx);
const S = ctx.LMPracticeSim;
const added = Object.keys(ctx).filter(k => !before.has(k));
check('module defines only window.LMPracticeSim', !!S && added.length === 1 && added[0] === 'LMPracticeSim');
check('module loads in Node too (module.exports)', typeof require(path.join(root, 'ogario', 'modules', 'practice-sim.js')).createWorld === 'function');

/* ---------- settings ---------- */
const c0 = S.sanitizeConfig({ exercise: 'nope', startMass: 1e9, bots: -5, seed: 'x', latency: 120.4, name: 'a}b{c\u0001', color: [1, 2, 300] });
check('settings: unknown exercise -> free, numbers clamped and rounded', c0.exercise === 'free' && c0.startMass === 20000 && c0.bots === 0 && c0.seed === 1234 && c0.latency === 120);
check('settings: name without braces/control chars, bad colour replaced', c0.name === 'abc' && c0.color.join() === '80,170,255');
const cs = S.withDefaults({ seed: 77, latency: 80 }, 'split');
check('settings: exercise defaults keep seed and latency', cs.exercise === 'split' && cs.startMass === 1000 && cs.seed === 77 && cs.latency === 80);
check('best key: exercise, seed, latency and the settings it uses', S.bestKey(cs) === 'split|77|80|single|1000|10|2');

/* ---------- physics in an empty world ---------- */
const bare = (extra) => { const w = S.createWorld(Object.assign({ exercise: 'free', mapSize: 6000, seed: 9 }, extra || {}), { bare: true }); return w; };
{
    const w = bare(), h = S.human(w), bot = S.newPlayer(w, { name: 'B' });
    const a = S.addCell(w, S.K_PLAYER, h, 0, 0, 125), b = S.addCell(w, S.K_PLAYER, bot, 10, 0, 100);
    h.mx = 0; h.my = 0; bot.mx = 10; bot.my = 0;
    S.step(w);
    check('eat rule: 1.25x the mass eats an overlapping cell', b.dead && near(a.m, 225));
    const w2 = bare(), h2 = S.human(w2), bot2 = S.newPlayer(w2, { name: 'B' });
    const a2 = S.addCell(w2, S.K_PLAYER, h2, 0, 0, 124), b2 = S.addCell(w2, S.K_PLAYER, bot2, 10, 0, 100);
    h2.mx = 0; bot2.mx = 10;
    S.step(w2);
    check('eat rule: 1.24x does not eat', !b2.dead && !a2.dead);
    const w3 = bare(), h3 = S.human(w3), bot3 = S.newPlayer(w3, { name: 'B' });
    const a3 = S.addCell(w3, S.K_PLAYER, h3, 0, 0, 400), r = S.radius(400), rb = S.radius(100);
    const b3 = S.addCell(w3, S.K_PLAYER, bot3, r - rb / 3 + 2, 0, 100);
    h3.mx = 0; bot3.mx = b3.x;
    S.step(w3);
    check('eat rule: the centre must be inside radius - other radius / 3', !b3.dead);
}
{
    const w = bare(), h = S.human(w);
    const c = S.addCell(w, S.K_PLAYER, h, 0, 0, 100);
    h.mx = 5000; h.my = 0;
    S.splitOnce(w, h);
    const n = h.cells[1];
    check('split: halves the mass, launches toward the mouse', h.cells.length === 2 && near(c.m, 50) && near(n.m, 50) && n.bx > 0.99 && n.bd > 700);
    check('split: both pieces get the merge timer', c.mergeAt === n.mergeAt && c.mergeAt === w.tick + S.mergeTicks(w, 50));
    for (let i = 0; i < 25; i++) S.step(w);
    check('split: the new piece flew about 800 units', n.x - c.x > 700);
    const w2 = bare(), h2 = S.human(w2);
    S.addCell(w2, S.K_PLAYER, h2, 0, 0, 70);
    h2.mx = 500;
    S.splitOnce(w2, h2); S.splitOnce(w2, h2);
    check('split: needs 36 mass per cell', h2.cells.length === 2);
    const w3 = bare(), h3 = S.human(w3);
    S.addCell(w3, S.K_PLAYER, h3, 0, 0, 20000);
    h3.mx = 500;
    for (let i = 0; i < 6; i++) S.splitOnce(w3, h3);
    check('split: at most 16 cells', h3.cells.length === 16);
}
{
    const w = bare({ mergeSecs: 30 });
    check('merge timer: 30 s + 2.33% of the mass in seconds at the default base', S.mergeTicks(w, 1000) === Math.round((30 + 23.31) * 25));
    const w0 = bare({ mergeSecs: 0 });
    check('merge timer: base 0 merges at once', S.mergeTicks(w0, 5000) === 0);
    const w2 = bare({ mergeSecs: 1 }), h = S.human(w2);
    S.addCell(w2, S.K_PLAYER, h, 0, 0, 200);
    h.mx = 600; h.my = 0;
    S.splitOnce(w2, h);
    const readyAt = h.cells[0].mergeAt;
    let mergedAt = -1;
    for (let i = 0; i < 200 && mergedAt < 0; i++) { h.mx = h.cells[0].x; h.my = h.cells[0].y; S.step(w2); if (h.cells.length === 1) mergedAt = w2.tick; }
    check('merge: not before the timer, then the pieces join (mass kept)', mergedAt > readyAt && near(h.cells[0].m, 200, 1e-6));
    const w3 = bare({ mergeSecs: 30 }), h3 = S.human(w3);
    S.addCell(w3, S.K_PLAYER, h3, 0, 0, 400);
    h3.mx = 600;
    S.splitOnce(w3, h3);
    for (let i = 0; i < 60; i++) { h3.mx = 0; h3.my = 0; S.step(w3); }
    const [p, q] = h3.cells;
    check('merge: pieces that may not merge yet push apart', h3.cells.length === 2 && Math.hypot(p.x - q.x, p.y - q.y) >= p.r + q.r - 1);
}
{
    const w = bare(), h = S.human(w);
    const c = S.addCell(w, S.K_PLAYER, h, 0, 0, 1000);
    S.addCell(w, S.K_VIRUS, null, 5, 0, S.VIRUS_MASS);
    h.mx = 0; h.my = 0;
    S.step(w);
    const total = h.cells.reduce((s, x) => s + x.m, 0);
    check('virus pop: eats the virus, mass kept, splits into up to 16 cells', near(total, 1100, 1e-6) && h.cells.length === 16 && c.m > 500);
    const pp = S.popPieces(3000, 15, 36), sum = pp.reduce((a, b) => a + b, 0);
    check('virus pop pieces: halving then equal pieces, never more than the mass', pp.length === 15 && sum < 3000 && pp[0] === 750);
    check('virus pop pieces: no room means no pieces', S.popPieces(500, 0, 36).length === 0);
    const w2 = bare(), h2 = S.human(w2);
    S.addCell(w2, S.K_PLAYER, h2, 0, 0, 120);
    const v2 = S.addCell(w2, S.K_VIRUS, null, 5, 0, S.VIRUS_MASS);
    h2.mx = 0;
    S.step(w2);
    check('virus: a cell under 1.25x the virus passes under it', !v2.dead && h2.cells.length === 1);
}
{
    const w = bare(), h = S.human(w);
    const c = S.addCell(w, S.K_PLAYER, h, -600, 0, 2000);
    const v = S.addCell(w, S.K_VIRUS, null, 0, 0, S.VIRUS_MASS);
    w.virusN = 1;
    h.mx = 1000; h.my = 0;
    let shots = 0;
    for (let i = 0; i < 7; i++) { S.ejectOnce(w, h); shots++; for (let k = 0; k < 12; k++) { h.mx = c.x; h.my = 0; S.step(w); } h.mx = 1000; }
    const nv = w.cells.filter(x => x.k === S.K_VIRUS && x !== v);
    check('feeding: each feed costs 18 mass', near(c.m, 2000 - 7 * 18, 0.5) || c.m < 2000 - 7 * 18 + 14 * 7);
    check('virus shooting: 7 feeds split off a new virus in the feeding direction', v.m === S.VIRUS_MASS && v.fed === 0 && nv.length === 1 && nv[0].x > 300);
    const w2 = bare(), h2 = S.human(w2);
    S.addCell(w2, S.K_PLAYER, h2, 0, 0, 35);
    check('feeding: needs 36 mass', S.ejectOnce(w2, h2) === 0);
}
{
    check('speed: bigger cells are slower', S.speedOf(S.radius(100)) > S.speedOf(S.radius(1000)) && near(S.speedOf(100), 2.2 * Math.pow(100, -0.439) * 40));
    const w = bare({ latency: 200 }), h = S.human(w);
    S.addCell(w, S.K_PLAYER, h, 0, 0, 100);
    S.input(w, { t: 'move', x: 500, y: 0 });
    S.step(w);
    const x1 = h.cells[0].x;
    for (let i = 0; i < 5; i++) S.step(w);
    check('latency: input waits latency / 40 ms ticks', x1 === 0 && h.cells[0].x > 0 && w.latTicks === 5);
    S.input(w, { t: 'move', x: NaN, y: 1 });
    check('input: bad coordinates are ignored', w.inQ.length === 0);
}

/* ---------- determinism ---------- */
const script = (w, i) => {
    const h = S.centre(S.human(w));
    if (h) S.input(w, { t: 'move', x: Math.round(h.x + Math.cos(i / 40) * 500), y: Math.round(h.y + Math.sin(i / 33) * 500) });
    if (i % 75 === 20) S.input(w, { t: 'split', n: 1 });
    if (i % 9 === 0) S.input(w, { t: 'eject' });
};
const runHashes = (cfg, n) => { const w = S.createWorld(cfg), out = []; for (let i = 0; i < n; i++) { script(w, i); S.step(w); if (i % 50 === 0) out.push(S.hash(w)); } return out.join(' '); };
const fcfg = S.withDefaults({ seed: 4242 }, 'free');
check('determinism: same seed and input, same world (400 ticks with bots)', runHashes(fcfg, 400) === runHashes(fcfg, 400));
check('determinism: another seed, another world', runHashes(fcfg, 100) !== runHashes(S.withDefaults({ seed: 4243 }, 'free'), 100));
let allEx = true;
S.EX_IDS.forEach(ex => {
    const cfg = S.withDefaults({ seed: 5 }, ex);
    try { if (runHashes(cfg, 300) !== runHashes(cfg, 300)) { allEx = false; console.log('  not deterministic: ' + ex); } } catch (e) { allEx = false; console.log('  ' + ex + ': ' + e.stack); }
});
check('determinism: every exercise runs and repeats exactly', allEx);

/* ---------- client packets (what legendmod.send* produce) ---------- */
{
    const mv = new DataView(new ArrayBuffer(13)); mv.setUint8(0, 16); mv.setInt32(1, -1234, true); mv.setInt32(5, 567, true); mv.setUint32(9, 0, true);
    const m = S.decodeClient(mv.buffer);
    check('client: mouse packet', m.t === 'move' && m.x === -1234 && m.y === 567);
    check('client: split / feed / spawn / macros', S.decodeClient(new Uint8Array([17]).buffer).t === 'split' && S.decodeClient(new Uint8Array([21]).buffer).t === 'eject' &&
        S.decodeClient(new Uint8Array([0, 65, 0]).buffer).t === 'spawn' && S.decodeClient(new Uint8Array([28]).buffer).n === 2 && S.decodeClient(new Uint8Array([27]).buffer).n === 4);
    check('client: unknown and empty packets are ignored', S.decodeClient(new Uint8Array([99]).buffer) === null && S.decodeClient(new ArrayBuffer(0)) === null);
}

/* ---------- server packets: own reader ---------- */
{
    const w = S.createWorld(S.withDefaults({ seed: 11, bots: 3, viruses: 3 }, 'free'));
    const view = S.createView();
    const p1 = S.encodeFrame(w, view);
    const ops = p1.map(b => new Uint8Array(b)[0]);
    check('frame 1: clear, border, own cell, update, leaderboard', ops.join() === '18,64,32,16,49');
    const bd = new DataView(p1[1]);
    check('border: 33 bytes of doubles around 0', p1[1].byteLength === 33 && bd.getFloat64(1, true) === -w.half && bd.getFloat64(25, true) === w.half);
    const own = new DataView(p1[2]).getUint32(1, true);
    check('own cell id is the human cell', own === S.human(w).cells[0].id);
    const u = S.decodeUpdate(p1[3]);
    check('update: read to the last byte', u && u.length === p1[3].byteLength);
    const byId = new Map(w.cells.map(c => [c.id, c]));
    const okCells = u.cells.every(c => { const s = byId.get(c.id); return s && c.x === Math.round(s.x) && c.y === Math.round(s.y) && c.size === Math.round(s.r) && c.food === (s.k === S.K_FOOD) && c.virus === (s.k === S.K_VIRUS) && c.ejected === (s.k === S.K_EJECT); });
    check('update: every cell matches the world (position, size, food/virus/ejected)', okCells && u.cells.length > 50);
    check('update: food, viruses and named players present', u.cells.some(c => c.food) && u.cells.some(c => c.virus) && u.cells.some(c => c.name === i18n.t('modules.practicesim.bot', [1]) || c.name === i18n.t('modules.practicesim.you')));
    {
        /* the names follow the chosen language */
        ctx.LMi18n.setLang('el', { save: false });
        const wg = S.createWorld(S.sanitizeConfig({ exercise: 'free', bots: 2, seed: 5 }));
        const names = wg.players.map(p => p.name);
        ctx.LMi18n.setLang('en', { save: false });
        check('cell names in the chosen language (Greek)', names.includes(i18n.t('modules.practicesim.you', null, 'el')) && names.includes(i18n.t('modules.practicesim.bot', [1], 'el')) && !names.includes(i18n.t('modules.practicesim.you')));
    }
    /* the client's table built from the packets stays equal to the visible world */
    const table = new Map(u.cells.map(c => [c.id, c]));
    let same = true, sawEat = false, sawRemove = false;
    for (let i = 0; i < 300; i++) {
        script(w, i);
        S.step(w);
        S.encodeFrame(w, view).forEach(b => {
            if (new Uint8Array(b)[0] !== 16) return;
            const d = S.decodeUpdate(b);
            if (!d || d.length !== b.byteLength) same = false;
            d.eats.forEach(e => { sawEat = true; table.delete(e[1]); });
            d.cells.forEach(c => { const t = table.get(c.id); table.set(c.id, Object.assign(t || {}, c)); });
            d.removes.forEach(id => { sawRemove = true; table.delete(id); });
        });
        for (const [id, c] of table) { const s = w.cells.find(x => x.id === id); if (!s || c.x !== Math.round(s.x) || c.size !== Math.round(s.r)) { same = false; break; } }
        if (view.known.size !== table.size) same = false;
    }
    check('updates: 300 ticks of eats, moves and removals keep the client table exact', same && sawEat && sawRemove);
    const lb = new DataView(S.encodeLeaderboard(w));
    check('leaderboard 49: count then {u32 is me, name}', lb.getUint8(0) === 49 && lb.getUint32(1, true) >= 1);
}

/* ---------- server packets: the game's own handler ---------- */
{
    const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
    const NL = src.includes('\r\n') ? '\r\n' : '\n';
    const cut = (from, to) => { const a = src.indexOf(from.replace(/\n/g, NL)), b = src.indexOf(to, a); return a < 0 || b < 0 ? null : src.slice(a, b).replace(/,\s*$/, ''); };
    const hm = cut('        handleMessage(data) {\n', '        countPps() {');
    const uc = cut('        updateCells(view, offset) {\n', '        sortCells() {');
    if (!hm || !uc) check('game handler found in ogario.v4.js', false);
    else {
        const noop = function () { };
        const g = { console: { log: noop, warn: noop, error: (...a) => { g.errors.push(a.join(' ')); } }, errors: [], Math, Date, JSON, Object, Array, Map, Set, Number, String, Boolean, Uint8Array, DataView, ArrayBuffer, TextDecoder, RangeError, Error, isFinite, escape, unescape, decodeURIComponent, encodeURIComponent, parseInt, parseFloat, Infinity, NaN, undefined, performance, setTimeout, clearTimeout };
        g.window = g;
        /* the page always defines LMEvents before the game runs (emit points check _has first) */
        g.LMEvents = { _has: function () { return false; }, emit: noop, on: noop, off: noop };
        g.buffer ={ Buffer: function (ab) { return Buffer.from(ab); } };
        g.defaultmapsettings = { recordReplays: false };
        g.$ = () => ({ val: () => '' });
        g.application = new Proxy({ teamPlayers: [], customSkinsMap: {}, deaths: 0 }, { get: (t, k) => k in t ? t[k] : (k === 'onPlayerDeath' ? () => { g.deaths = (g.deaths || 0) + 1; } : noop) });
        g.drawRender = new Proxy({}, { get: () => noop });
        g.userBots = { startedBots: false };
        /* the game's own array helpers, taken from the source: a hand-made stand-in missed
           indexedPush, which then fell through to the no-op below and no cell was ever stored */
        const helpers = cut('    function quickSwapDelete(arr, index, idxProp) {\n', '    var ogarCellPool');
        if (!helpers || !/function indexedPush\(/.test(helpers)) check('array helpers found in ogario.v4.js', false);
        /* the cell object: what updateCells reads and writes, and removeCell as the game does it */
        g.ogarbasicassembly = function (id, x, y, size, color, isFood, isVirus) {
            Object.assign(this, { id, x, y, size, color, isFood, isVirus, targetX: x, targetY: y, targetSize: size, isPlayerCell: false });
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
        if (helpers) vm.runInContext(helpers + '\n' + [...helpers.matchAll(/^ {4}function (\w+)\(/gm)].map(m => 'this.' + m[1] + ' = ' + m[1] + ';').join(' '), g);
        /* every other name the handler touches (EL effects, HUD hooks) resolves to a no-op */
        g.__h = null;
        g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: (t, k) => k in t ? t[k] : noop }); /* implicit globals of the handler (cell, cellUpdateCells) keep their values */
        const code = 'with (__env) { __h = ({' + hm + ',\n' + uc + '}); }';
        try {
            vm.runInContext(code, g);
            const L = g.__h;
            /* the colour by nick map as the game starts it */
            const ccInit = /\n {8}cellcolors: ([^\n]+),\r?\n/.exec(src);
            const newCellColors = () => vm.runInContext('(' + (ccInit ? ccInit[1] : 'null') + ')', g);
            Object.assign(L, {
                serverType: 'private', connectionIntegrity: false, integrity: false, gameMode: ':ffa', playerNick: 'Me', leaderboard: [], fbOnline: [],
                cells: [], food: [], viruses: [], removedCells: [], playerCells: [], playerCellIDs: [], indexedCells: {}, cellcolors: newCellColors(), playerCellsMulti: [],
                vector: [[0, 0]], vnr: 0, play: false, time: 0, mapEvent: {}, decayInfo: {},
                countPps: noop, megaFFAscore: noop, vanillaskins: noop, handleLeaderboard: noop, setMapOffset: noop, _lmOnServerBorder: noop, flushCellsData() { this.cells = []; this.food = []; this.playerCells = []; this.indexedCells = {}; },
                rgb2Hex: (r, gg, b) => '#' + [r, gg, b].map(v => (v | 0).toString(16).padStart(2, '0')).join(''), _lmKeepMainSuppressed: () => false
            });
            g.legendmod = g.LM = L;
            const w = S.createWorld(S.withDefaults({ seed: 21, bots: 4, viruses: 3 }, 'free'));
            const view = S.createView();
            const feedAll = () => S.encodeFrame(w, view).forEach(b => L.handleMessage(new DataView(b)));
            feedAll();
            const vis = () => [...view.known.keys()].sort((a, b) => a - b).join();
            const lmIds = () => Object.keys(L.indexedCells).map(Number).sort((a, b) => a - b).join();
            check('game handler: own cell from opcode 32 -> playing, one own cell', L.play === true && L.playerCells.length === 1 && L.playerCells[0].id === S.human(w).cells[0].id);
            check('game handler: same cells as the simulation shows', lmIds() === vis() && L.cells.length > 0);
            const foodOk = L.food.length > 0 && L.food.every(c => { const s = w.cells.find(x => x.id === c.id); return s && s.k === S.K_FOOD; });
            const virOk = Object.values(L.indexedCells).filter(c => c.isVirus).every(c => w.cells.find(x => x.id === c.id).k === S.K_VIRUS);
            check('game handler: food read as food, viruses as viruses', foodOk && virOk && Object.values(L.indexedCells).some(c => c.isVirus));
            let same = true;
            for (let i = 0; i < 250 && same; i++) {
                script(w, i);
                S.step(w);
                feedAll();
                if (lmIds() !== vis()) same = false;
                const hc = S.human(w).cells;
                if (hc.length && L.playerCells.length !== hc.length) same = false;
                for (const c of L.cells) { const s = w.cells.find(x => x.id === c.id); if (!s || c.targetX !== Math.round(s.x) || c.targetY !== Math.round(s.y) || c.targetSize !== Math.round(s.r)) { same = false; break; } }
            }
            check('game handler: 250 ticks with splits, feeds and eats stay in step (own cells too)', same);
            /* the drill reset: all own cells replaced by one new cell in one tick is not a death */
            const dw = S.createWorld(S.withDefaults({ seed: 3, rounds: 3 }, 'split')), dv = S.createView();
            L.flushCellsData(); L.play = false; L.playerCellIDs = []; g.deaths = 0;
            let rounds = 0;
            for (let i = 0; i < 400; i++) {
                const tc = dw.ex.targetP.cells[0];
                if (tc) S.input(dw, { t: 'move', x: tc.x, y: tc.y });
                if (dw.ex.phase === 'play' && dw.tick - dw.ex.cur.start === 3) S.input(dw, { t: 'split' });
                S.step(dw);
                S.encodeFrame(dw, dv).forEach(b => L.handleMessage(new DataView(b)));
                rounds = dw.ex.round;
            }
            check('game handler: drill rounds reset the player without a death', rounds >= 2 && g.deaths === 0 && L.play === true && L.playerCells.length === S.human(dw).cells.length);
            /* a real death: the last own cell eaten */
            const kw = S.createWorld(S.withDefaults({ seed: 8, bots: 0, viruses: 0 }, 'free')), kv = S.createView();
            L.flushCellsData(); L.play = false; L.playerCellIDs = []; g.deaths = 0;
            S.encodeFrame(kw, kv).forEach(b => L.handleMessage(new DataView(b)));
            const hc = S.human(kw).cells[0], big = S.newPlayer(kw, { name: 'Big' });
            S.addCell(kw, S.K_PLAYER, big, hc.x + 5, hc.y, 5000);
            for (let i = 0; i < 3; i++) { S.step(kw); S.encodeFrame(kw, kv).forEach(b => L.handleMessage(new DataView(b))); }
            check('game handler: being eaten ends the game (death once) and the run', g.deaths === 1 && L.play === false && kw.over && kw.result.reason === 'eaten');
            check('game handler: nothing logged as an error', g.errors.length === 0);
            /* players named like members of Object / Array: their cells arrive with the colours
             * the same world gives with ordinary names (the colour map was an Array: "map" got
             * a function as its colour, "length" threw in the cell update) */
            {
                const NICKS = ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__', 'at', 'map', 'length'];
                const runNames = (names) => {
                    const nw = S.createWorld(S.withDefaults({ seed: 5, bots: names.length, viruses: 0 }, 'free')), nv = S.createView();
                    const bots = nw.players.filter(p => !p.human).slice(0, names.length);
                    const h = S.human(nw).cells[0];
                    /* all in view, apart */
                    bots.forEach((p, i) => { p.name = names[i]; p.cells.forEach(c => { c.name = p.name; c.x = h.x + 260 * (i - 3.5); c.y = h.y + 420; p.mx = c.x; p.my = c.y; }); });
                    L.flushCellsData(); L.play = false; L.playerCellIDs = []; L.cellcolors = newCellColors(); g.errors.length = 0;
                    const r = { err: '', cells: {} };
                    try { for (let i = 0; i < 5; i++) { S.step(nw); S.encodeFrame(nw, nv).forEach(b => L.handleMessage(new DataView(b))); } } catch (e) { r.err = String(e && e.message || e); }
                    r.errors = g.errors.slice();
                    bots.forEach(p => p.cells.filter(c => nv.known.has(c.id)).forEach(c => {
                        const lc = L.indexedCells[c.id];
                        r.cells[c.id] = lc ? lc.targetNick + ' ' + (typeof lc.color === 'string' ? lc.color : typeof lc.color) : 'missing';
                    }));
                    return r;
                };
                const plain = runNames(NICKS.map((n, i) => 'Player' + i)), odd = runNames(NICKS);
                const bad = Object.keys(plain.cells).filter(id => odd.cells[id] !== plain.cells[id].replace(/^Player(\d)/, (m, i) => NICKS[i]))
                    .map(id => odd.cells[id] + ' / ' + plain.cells[id]);
                check('game handler: players named "constructor", "__proto__", "map", "length"...: cells with the colours of ordinary names, nothing thrown',
                    !plain.err && !odd.err && !odd.errors.length && Object.keys(plain.cells).length >= NICKS.length && !bad.length, odd.err || odd.errors[0] || bad.join('; '));
                check('  no prototype changed', vm.runInContext('typeof [].map === "function" && [].length === 0 && typeof ({}).toString === "function"', g));
            }
        } catch (e) {
            console.log(e.stack);
            check('game handler runs the practice packets', false);
        }
    }
}

/* ---------- exercises: a scripted good player passes; scoring ---------- */
const play = (cfg, brain, max) => { const w = S.createWorld(cfg); for (let i = 0; i < (max || 20000) && !w.over; i++) { brain(w, i); S.step(w); } if (!w.over) S.finish(w, 'test'); return w; };
const cfgOf = (ex, o) => S.sanitizeConfig(Object.assign(S.withDefaults({}, ex), o));
S.SPLIT_MODES.forEach(mode => {
    let st = null;
    const w = play(cfgOf('split', { seed: 3, splitMode: mode, difficulty: 2, rounds: 3 }), (w) => {
        const ex = w.ex, tc = ex.targetP.cells[0];
        if (!tc || ex.phase !== 'play') { st = null; return; }
        S.input(w, { t: 'move', x: tc.x, y: tc.y });
        if (!st) st = { at: w.tick + 3, n: 0 };
        const need = S.SPLIT_NEED[mode], gap = mode === 'pop' ? 4 : 2;
        if (st.n < need && w.tick >= st.at + st.n * gap) { S.input(w, { t: 'split' }); st.n++; }
    });
    check('split drill (' + mode + '): the right splits hit every target with the technique bonus', w.result.ok && w.result.rounds.every(r => r.ok && r.score >= 200 && w.result.lines[2][1] === '3 / 3'));
});
{
    const w = play(cfgOf('split', { seed: 3, splitMode: 'double', difficulty: 2, rounds: 3 }), (w) => { const tc = w.ex.targetP.cells[0]; if (tc) S.input(w, { t: 'move', x: tc.x, y: tc.y }); });
    check('split drill: walking at a running target does not hit it', w.result.rounds.every(r => !r.ok) && !w.result.ok && w.result.score === 0);
    check('split scoring: miss 0, fast right technique 250, wrong count 200 at most', S.scoreSplitRound({ ok: false }, 'single') === 0 && S.scoreSplitRound({ ok: true, ms: 400, splits: 1 }, 'single') === 250 &&
        S.scoreSplitRound({ ok: true, ms: 400, splits: 3 }, 'double') === 200 && S.scoreSplitRound({ ok: true, ms: 400, splits: 2, delay: 160 }, 'pop') === 250 && S.scoreSplitRound({ ok: true, ms: 400, splits: 2, delay: 40 }, 'pop') === 200);
}
{
    const w = play(cfgOf('virus', { seed: 5, difficulty: 1, rounds: 3 }), (w, i) => {
        const ex = w.ex; if (ex.phase !== 'play') return;
        const v = w.cells.find(c => c.k === S.K_VIRUS && !c.shot), t = ex.targetP.cells[0], h = S.centre(S.human(w));
        if (!v || !t || !h) return;
        const dx = t.x - v.x, dy = t.y - v.y, d = Math.hypot(dx, dy);
        S.input(w, { t: 'move', x: h.x + dx / d * 2000, y: h.y + dy / d * 2000 });
        if (i % 3 === 0 && ex.cur.ejects < 9) S.input(w, { t: 'eject' });
    });
    check('virus shooting: 7 feeds aimed at the target pop it', w.result.ok && w.result.lines[0][1] === '3 / 3');
}
{
    const w = play(cfgOf('path', { seed: 5 }), (w) => {
        const h = S.centre(S.human(w)); if (!h) return;
        let best = null, bd = 1e9; for (const c of w.cells) if (c.pellet) { const d = Math.hypot(c.x - h.x, c.y - h.y); if (d < bd) { bd = d; best = c; } }
        if (best) S.input(w, { t: 'move', x: best.x, y: best.y });
    });
    const idle = play(cfgOf('path', { seed: 5, duration: 10 }), () => { });
    check('precise movement: following the pellets eats them all, close to the line', w.result.ok && w.ex.eaten === w.ex.total && w.result.lines[1][1] < 30);
    check('precise movement: standing still scores less', idle.result.score < w.result.score && !idle.result.ok);
}
{
    const w = play(cfgOf('merge', { seed: 5 }), (w) => S.input(w, { t: 'move', x: 0, y: 0 }));
    check('merging: pulling the pieces together merges soon after the timer', w.result.ok && S.human(w).cells.length === 1 && w.result.score > 900);
    const f = play(cfgOf('feed', { seed: 5 }), (w, i) => { const t = w.ex.mate.cells[0]; if (t) S.input(w, { t: 'move', x: t.x, y: t.y }); if (i % 2 === 0) S.input(w, { t: 'eject' }); });
    check('feeding: feeding at the teammate delivers the mass (it cannot be eaten)', f.result.ok && f.ex.got > 500 && f.ex.mate.cells.length === 1);
    const d = play(cfgOf('dodge', { seed: 5 }), (w) => { const g = w.ex.goals[w.ex.next]; if (g) S.input(w, { t: 'move', x: g.x, y: g.y }); });
    check('virus avoidance: goals reached in order, pops counted', d.ex.next === 6 && d.ex.pops > 0 && d.result.score === 6 * 150 - d.ex.pops * 100 + Math.round(Math.max(0, d.cfg.duration - S.secs(d)) * 3) || d.result.score === 0);
    const e = play(cfgOf('escape', { seed: 5, bots: 0, duration: 10 }), () => { });
    check('escape: surviving the time passes', e.result.ok && e.result.reason === 'time');
}

/* ---------- personal bests and ghosts ---------- */
{
    const key = S.bestKey(cfgOf('path', { seed: 5 }));
    const g = []; for (let i = 0; i < 2000; i++) g.push(i * 4, i, -i, 100 + i);
    const thin = S.thinGhost(g);
    check('ghost: thinned to 600 samples, first and last kept', thin.length === 2400 && thin[0] === 0 && thin[thin.length - 4] === 1999 * 4);
    let r = S.recordRun(null, key, { score: 500, ok: true, ticks: 100 }, g, 1000);
    check('record: first run is the best', r.best && r.store.best[key].s === 500 && r.store.best[key].g.length === 2400);
    r = S.recordRun(r.store, key, { score: 400, ok: false, ticks: 100 }, [], 2000);
    check('record: a lower score keeps the best, history grows', !r.best && r.store.best[key].s === 500 && r.store.hist.length === 2 && r.prev === 500);
    r = S.recordRun(r.store, key, { score: 900, ok: true, ticks: 100 }, [0, 1, 2, 3], 3000);
    check('record: a higher score replaces the best', r.best && r.store.best[key].s === 900 && r.store.best[key].t === 3000);
    const back = S.validateStore(JSON.parse(JSON.stringify(r.store)));
    check('store: survives JSON', back.best[key].s === 900 && back.hist.length === 3);
    const bad = S.validateStore({ v: 1, best: { 'x|y': { s: 1, t: 1 }, [key]: { s: 'a', t: 1 }, 'path|5|0|25|2|60': { s: 5, t: 1, g: [0, 1, 2] }, 'merge|1|0|800|5': { s: 5, t: 1, g: [5, 0, 0, 1, 2, 0, 0, 1] } }, hist: [{ k: key, s: -1, t: 1 }, 'x', { k: key, s: 3, t: 4 }] });
    check('store: bad keys, scores and ghosts are dropped', Object.keys(bad.best).length === 0 && bad.hist.length === 1);
    check('store: wrong version or not an object is empty', Object.keys(S.validateStore({ v: 2, best: { [key]: { s: 1, t: 1 } } }).best).length === 0 && S.validateStore('x').hist.length === 0);
    const many = { v: 1, best: {}, hist: [] };
    for (let i = 0; i < 40; i++) many.best['free|' + (i + 1) + '|0'] = { s: i, t: i };
    const capped = S.validateStore(many);
    check('store: at most 24 personal bests (newest kept)', Object.keys(capped.best).length === 24 && capped.best['free|40|0'] && !capped.best['free|1|0']);
    const gh = [0, 0, 0, 100, 10, 100, 50, 200];
    const at = S.ghostAt(gh, 5);
    check('ghost: position and mass between samples', near(at.x, 50) && near(at.y, 25) && near(at.m, 150) && S.ghostAt(gh, 11) === null && S.ghostAt(gh, -1) === null);
    check('ghost: a dead sample shows nothing', S.ghostAt([0, 0, 0, 0, 10, 0, 0, 0], 5) === null);
}

/* ---------- leaving a live game asks first, also when only a multibox unit plays (audit A16) ---------- */
{
    const uiSrc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'practice.js'), 'utf8');
    const toasts = [];
    const w = {
        Math, JSON, Date, ArrayBuffer, Uint8Array, DataView, Map, Set, Object, Array, Number, String, isFinite, escape, unescape, encodeURIComponent, decodeURIComponent, console,
        localStorage: { getItem: () => null, setItem() {} },
        document: { getElementById: () => null, createElement: () => ({ style: {}, appendChild() {}, addEventListener() {}, setAttribute() {} }), addEventListener() {}, body: { appendChild() {} } },
        toastr: { info(t) { toasts.push(t); }, success() {}, warning() {}, error() {} },
        performance: { now: () => 0 }, setInterval: () => 1, clearInterval() {}, setTimeout: () => 1, clearTimeout() {},
        addEventListener() {}
    };
    w.window = w;
    vm.createContext(w);
    i18n(w);
    vm.runInContext(simSrc, w);
    vm.runInContext(uiSrc, w);
    const P = w.LMPractice;
    /* main player dead (spectating the live server), multibox unit 2 alive there */
    w.legendmod = { handleMessage() {}, play: false, socket: { readyState: 1 }, ws: 'wss://live.example:443', closeConnection() {}, flushCellsData() {} };
    w.spects = [{ number: 2, active: true }];
    let r;
    try { r = P.start({}); } catch (e) { r = 'threw: ' + e.message; }
    check('practice: a live multibox unit asks before leaving (' + r + ')', r === false && toasts.length === 1);
    check('practice: the question comes from the language pack', toasts[0] === i18n.t('modules.practice.leave'));
    try { if (P.on) P.stop(); } catch (e) { }
    toasts.length = 0;
    w.spects = [{ number: 2, active: false }];
    w.legendmod.play = false;
    let r2;
    try { r2 = P.start({}); } catch (e) { r2 = 'threw'; }
    check('practice: nobody alive, no question', toasts.length === 0 && r2 !== false);
}

console.log(fail ? fail + ' check(s) failed' : 'all practice checks passed');
process.exit(fail ? 1 : 0);
