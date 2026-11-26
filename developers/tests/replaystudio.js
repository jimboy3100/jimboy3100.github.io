/* Replay Studio logic: packet times, bookmarks, clip cutting, .lm files and library entries.
 * Loads ogario/modules/replaystudio.js without a page (only its pure helpers run).
 * node developers/tests/replaystudio.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'replaystudio.js'), 'utf8');
const ctx = { console, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite, Number, String, Array, Object };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const L = ctx.LMReplayStudio && ctx.LMReplayStudio.lib;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
check('module exposes its helpers without a page', !!L && typeof L.detectBookmarks === 'function');

/* 1. times */
const t = [0, 40, 41, 120, 120, 1000];
const d = L.encodeTimes(t);
check('times: deltas round trip', same(L.decodeTimes(d, t.length), t));
check('times: wrong length is rejected', L.decodeTimes(d, t.length + 1) === null);
check('times: negative delta is rejected', L.decodeTimes([0, 5, -1], 3) === null);
check('times: non-number is rejected', L.decodeTimes([0, 'x', 1], 3) === null);
check('times: longer than a day is rejected', L.decodeTimes([0, 25 * 3600 * 1000], 2) === null);
check('times: going backwards is clamped when encoding', same(L.decodeTimes(L.encodeTimes([0, 50, 30, 60]), 4), [0, 50, 50, 60]));
check('times: live copy fills one gap', same(L.cleanTimes([0, 10, undefined, 30], 4), [0, 10, 10, 30]));
check('times: live copy with many gaps falls back', L.cleanTimes(new Array(100).fill(undefined), 100) === null);
check('times: estimate is 40 ms per packet', same(L.estTimes(3), [0, 40, 80]));
check('position at a time counts packets up to it', L.posAtTime(t, t.length, 120) === 5 && L.posAtTime(t, t.length, -1) === 0 && L.posAtTime(t, t.length, 5000) === 6);
check('first packet at or after a time', L.firstAtOrAfter(t, t.length, 41) === 2 && L.firstAtOrAfter(t, t.length, 42) === 3);
check('checkpoint before an index', L.checkpointBefore([0, 50, 90], 89) === 50 && L.checkpointBefore([0, 50, 90], 90) === 90 && L.checkpointBefore([0], 7) === 0);

/* 2. sidecar */
const meta = { t: [0, 10, 20, 30], s: [0, 100, 1, 0], e: [5, 'd', 900], c: [1, 2, 3] };
const side = L.makeSidecar(meta, 4);
check('sidecar: marked and with deltas', side.lmrs === 1 && same(side.t, [0, 10, 10, 10]));
const rs = L.readSidecar(JSON.parse(JSON.stringify(side)), 4);
check('sidecar: read back', !rs.est && same(rs.t, [0, 10, 20, 30]) && same(rs.e, [5, 'd', 900]) && same(rs.s, [0, 100, 1, 0]));
check('sidecar: other packet count means estimated times', L.readSidecar(side, 5).est === true);
check('sidecar: not an object is ignored', L.readSidecar('x', 4).est && L.readSidecar([1], 4).s.length === 0);
const bad = L.readSidecar({ lmrs: 1, s: [0, 1, 2, 3, 'x', 1, 2, 3, 5, 6, 7, 8], e: [1, 'z', 3, 2, 'k', 50, 3, 'k'], c: [1, 2], start: 99 }, 4);
check('sidecar: bad tuples and unknown event types are dropped', same(bad.s, [0, 1, 2, 3, 5, 6, 7, 8]) && same(bad.e, [2, 'k', 50]) && same(bad.c, []) && bad.start === 0);
check('sidecar: found in the game info array', L.findSidecar([1, 'm', 'r', 'n', '{}', side]) === side && L.findSidecar([1, 2]) === null && L.findSidecar(null) === null);

/* 3. bookmarks */
const ev = [];
const E = (tm, ty, v) => ev.push(tm, ty, v);
E(1000, 'k', 100); E(1500, 'k', 50); E(5000, 'k', 30);        // two kills (first two grouped)
E(8000, 'v', 1); E(8500, 'v', 1);                             // one virus bookmark x2
E(10000, 'p', 1);                                             // single split: no bookmark
E(12000, 'p', 1); E(12200, 'p', 1); E(12300, 'p', 1);         // triple split
E(20000, 'p', 2);                                             // double split macro
E(30000, 'd', 5000);
const sm = [];
const S = (tm, m, c, p) => sm.push(tm, m, c, p);
S(14000, 1000, 1, 3); S(14250, 1000, 1, 1); S(14500, 1000, 1, 1); // reaches 1st
S(14750, 1000, 1, 2); S(15000, 1000, 1, 1);                       // back to 1st within 5 s: no new mark
S(16000, 2000, 1, 1); S(16250, 900, 1, 2);                        // big loss 1100
S(25000, 2000, 1, 2); S(25250, 2000, 10, 2);                      // cells jump +9: split without a sent split
S(29000, 6000, 3, 2); S(29250, 3000, 3, 2);                       // loss right before the death: dropped
const marks = L.detectBookmarks({ e: ev, s: sm });
const kinds = marks.map(m => m.k + (m.n > 1 ? m.n : '')).join(',');
check('bookmarks: kinds in time order (' + kinds + ')', kinds === 'kill2,kill,virus2,split3,top1,loss,split2,split9,death');
check('bookmarks: grouped kill sums the mass', marks[0].v === 150 && marks[0].t === 1000);
check('bookmarks: death carries the mass', marks[marks.length - 1].v === 5000);
check('bookmarks: loss amount', marks.find(m => m.k === 'loss').v === 1100);
check('bookmarks: end time limits them', L.detectBookmarks({ e: ev, s: sm }, { endT: 9000 }).length === 3);
const feedLoss = L.detectBookmarks({ e: [16100, 'f', 0], s: [16000, 2000, 1, 0, 16250, 900, 1, 0] });
check('bookmarks: mass lost while feeding is not a loss', feedLoss.length === 0);
const gain = L.detectBookmarks({ e: [], s: [0, 500, 1, 0, 250, 900, 1, 0] });
check('bookmarks: big gain without kill events', gain.length === 1 && gain[0].k === 'gain' && gain[0].v === 400);
check('bookmarks: no gain bookmark when kills are recorded', L.detectBookmarks({ e: [100, 'k', 30], s: [0, 500, 1, 0, 250, 900, 1, 0] }).every(m => m.k !== 'gain'));
const vir = L.detectBookmarks({ e: [1000, 'v', 1], s: [900, 500, 1, 0, 1100, 500, 12, 0] });
check('bookmarks: cells from a virus pop are not a split', vir.length === 1 && vir[0].k === 'virus');
check('peak mass from samples and deaths', L.peakMass({ s: sm, e: ev }) === 6000);

/* 4. clips */
const times = []; for (let i = 0; i < 1000; i++) times.push(i * 100); // 100 s, 10 packets/s
const cell = i => i % 2 === 1;                                        // odd packets are cell updates
const exact = L.cutInterval(times, 600, 700, { checkpoints: [0, 300], compact: false });
check('clip exact: starts at the newest checkpoint', exact.idx[0] === 300 && exact.idx.length === 400 && exact.idx[exact.idx.length - 1] === 699);
check('clip exact: playback starts at In', exact.idx[exact.start] === 600 && exact.times[exact.start] === 30000);
check('clip exact: times rebased to 0', exact.times[0] === 0);
const small = L.cutInterval(times, 600, 700, { checkpoints: [0, 300], compact: true, isCell: cell, warmMs: 10000 });
check('clip small: old cell updates left out', small.idx.length === 100 + 200 && small.idx.filter(i => i < 500).every(i => i % 2 === 0));
check('clip small: warm-up keeps everything', small.idx.indexOf(500) !== -1 && small.idx.indexOf(501) !== -1);
check('clip small: start at In, earlier packets at time 0', small.idx[small.start] === 600 && small.times[small.start] === 10000 && small.times[0] === 0);
check('clip: times never go back', small.times.every((v, i, a) => !i || v >= a[i - 1]));
check('clip: In at a checkpoint starts there', L.cutInterval(times, 300, 310, { checkpoints: [0, 300] }).idx[0] === 300);
check('clip: out of range is clamped', L.cutInterval(times, -5, 5000, {}).idx.length === 1000);
const cs = L.cutSide({ s: [5000, 1, 1, 0, 65000, 2, 1, 0], e: [61000, 'k', 30, 80000, 'd', 9], c: [] }, 50000, 50000, 69900);
check('clip: samples and events of the span, rebased', same(cs.s, [15000, 2, 1, 0]) && same(cs.e, [11000, 'k', 30]));

/* 5. .lm files */
const pk = [new DataView(new Uint8Array([16, 1, 2, 255]).buffer), new DataView(new Uint8Array([18]).buffer), new DataView(new Uint8Array([0, 200, 7]).buffer, 1, 2)];
const spec = [1700000000000, ':ffa', 'EU', 'nick', '{"a":"https://x/y.png"}'];
const text = L.lmFileParts(pk, spec, { lmrs: 1, t: [0, 20, 20], s: [], e: [], c: [] }).join('');
const arr = JSON.parse(text);
check('file: old layout (packets then the game info array)', arr.length === 4 && typeof arr[0] === 'string' && Array.isArray(arr[3]) && arr[3][4] === spec[4]);
const back = L.parseLmText(text);
check('file: packets read back (view offsets kept)', back.packets.length === 3 && same(Array.from(new Uint8Array(back.packets[2].buffer)), [200, 7]) && back.packets[0].getUint8(3) === 255);
check('file: Studio data read back', !back.side.est && same(back.side.t, [0, 20, 40]));
const old = L.parseLmText(JSON.stringify(['\u0010\u0001', '\u0012', [1, 'm', 'r', 'n']]));
check('file: old file without Studio data', old.packets.length === 2 && old.side.est === true);
check('file: old file ending with null', L.parseLmText(JSON.stringify(['\u0010', null])).packets.length === 1);
/* a file saved by the old replay window (LMexpress/replay.js saveTextAsFile, now removed):
 * each packet's whole buffer as a binary string (ab2str, in 32 KB chunks), the game info last */
const oldAb2str = buf => { const b = new Uint8Array(buf); let o = ''; for (let i = 0; i < b.length; i += 32768) o += String.fromCharCode.apply(null, b.subarray(i, i + 32768)); return o; };
const big = new Uint8Array(70000); for (let i = 0; i < big.length; i++) big[i] = (i * 7) & 255;
const oldPk = [new Uint8Array([16, 0, 128, 255]).buffer, new Uint8Array([18]).buffer, big.buffer];
const oldSpec = [1600000000000, ':party', 'EU-London', 'old nick', '{"old nick":"https://example.com/s.png"}'];
const oldWin = L.parseLmText(JSON.stringify(oldPk.map(oldAb2str).concat([oldSpec])));
check('file: old replay window file opens (bytes, big packet, game info, estimated times)', oldWin.packets.length === 3 &&
  same(Array.from(new Uint8Array(oldWin.packets[0].buffer)), [16, 0, 128, 255]) && oldWin.packets[2].byteLength === 70000 &&
  oldWin.packets[2].getUint8(69999) === big[69999] && same(oldWin.spec, oldSpec) && oldWin.side.est === true && oldWin.side.start === 0);
const resaved = JSON.parse(L.lmFileParts(oldWin.packets, oldWin.spec, null).join(''));
check('file: an old file exported again keeps the old layout', resaved.length === 4 && resaved[0] === oldAb2str(oldPk[0]) && same(resaved[3], oldSpec));
let threw = false; try { L.parseLmText('{"a":1}'); } catch (e) { threw = true; }
check('file: not a replay is rejected', threw);
check('file: game info padded for old readers (skins slot)', same(L.fileSpec([5], null), [5, '', '', '', '{}']));
check('file: an older Studio object is replaced, not doubled', L.fileSpec([1, 'm', 'r', 'n', '{}', { lmrs: 1 }], { lmrs: 1, x: 1 }).filter(v => v && typeof v === 'object').length === 1);

/* 6. library entries */
const packed = L.packPackets(pk);
const un = L.unpackPackets(packed.buf, packed.lens);
check('library: packets pack and unpack', un.length === 3 && un[2].byteLength === 2 && un[2].getUint8(0) === 200 && un[0].buffer !== un[1].buffer);
check('library: damaged lengths are rejected', L.unpackPackets(packed.buf, new Uint32Array([99]).buffer) === null && L.unpackPackets('x', packed.lens) === null);
const good = { id: 'r1abc', name: '  My  game\u0007 ', tags: ['Kill', 'kill', ' best ', '', 'x'.repeat(40)], date: 1700000000000, server: 'expanding.land', packets: 120, duration: 60000, peakMass: 12000.4, bytes: 5000 };
const v = L.validateRecord(good);
check('library: valid entry kept, text cleaned', v && v.name === 'My  game' && v.peakMass === 12000);
check('library: tags trimmed, lower case, unique, short', v && same(v.tags, ['kill', 'best', 'x'.repeat(24)]));
check('library: bad id rejected', L.validateRecord(Object.assign({}, good, { id: '../x' })) === null);
check('library: bad date rejected', L.validateRecord(Object.assign({}, good, { date: 'today' })) === null);
check('library: bad packet count rejected', L.validateRecord(Object.assign({}, good, { packets: 0 })) === null && L.validateRecord(Object.assign({}, good, { packets: 1.5 })) === null);
check('library: not an object rejected', L.validateRecord(null) === null && L.validateRecord([good]) === null);
check('library: bad numbers become 0', L.validateRecord(Object.assign({}, good, { duration: -5, peakMass: NaN })).duration === 0);
check('library: tags from text', same(L.parseTags('Kill, #top; funny,,'), ['kill', 'top', 'funny']));
const lst = [L.validateRecord(good), L.validateRecord(Object.assign({}, good, { id: 'r2', name: 'Another', tags: ['top'], date: 1800000000000, peakMass: 5 }))];
check('library: search by tag and words', L.searchRecords(lst, '#top').length === 1 && L.searchRecords(lst, 'my game').length === 1 && L.searchRecords(lst, '').length === 2);
check('library: sort newest / by mass', L.sortRecords(lst, 'new')[0].id === 'r2' && L.sortRecords(lst, 'mass')[0].id === 'r1abc' && L.sortRecords(lst, 'name')[0].name === 'Another');
check('server label from a key', L.serverLabel('wss://eu.expanding.land:443/x?t=1(2)') === 'eu.expanding.land:443' && L.serverLabel('abc1234(3).lm') === 'abc1234');

/* 7. playback: the real driver (RS.drive) on a fake clock, with the game's own replay hooks taken from
 * ogario/ogario.v4.js (LMEvents, _lmEvReplay, lmReplayResetWorld, playReplayLM, replayfunctions,
 * onPlayerDeath) and a small stand-in protocol whose packets add, move, eat and remove cells, set own
 * cells, the border, the camera and the leaderboard, and clear all (18) or own cells (20). The world
 * after every step must equal the packets played forwards from the take-over up to that position. */
{
const v4 = fs.readFileSync(process.argv[3] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const NL4 = v4.includes('\r\n') ? '\r\n' : '\n';
const cut4 = (from, to) => { const a = v4.indexOf(from.replace(/\n/g, NL4)), b = v4.indexOf(to.replace(/\n/g, NL4), a + 1); return a < 0 || b < 0 ? null : v4.slice(a, b); };
const coreSrc = {
  events: cut4('/* LMEvents: hooks for user scripts', 'window.spects = window.spects'),
  reset: cut4('function lmReplayResetWorld() {', 'window.lmReplayResetWorld = lmReplayResetWorld;'),
  ev: cut4('function _lmEvReplay(on, reason, start) {', 'window._lmEvReplay = _lmEvReplay;'),
  play: cut4('function playReplayLM(temp, startAt) {', '/* Replay controls (hotkeys'),
  rf: cut4('        replayfunctions() {\n', '        closeConnection() {'),
  death: cut4('        onPlayerDeath() {\n', '        findOwnedVanillaSkin() {')
};
check('game replay hooks found in ogario.v4.js', Object.keys(coreSrc).every(k => coreSrc[k]));
const pk = (...b) => new DataView(new Uint8Array(b).buffer);
/* the stand-in protocol: 1 add id x size, 2 remove id, 3 eat eater eaten, 4 move id x, 32 own id,
 * 20 clear own, 18 clear all (Expanding Land keeps the border), 64 border half-size/10, 17 camera x,
 * 49 leaderboard n (also your place) */
function applyPk(w, d, env) {
  const op = d.getUint8(0), a = d.byteLength > 1 ? d.getUint8(1) : 0, b = d.byteLength > 2 ? d.getUint8(2) : 0, c = d.byteLength > 3 ? d.getUint8(3) : 0;
  const del = id => { const x = w.indexedCells[id]; if (!x) return; delete w.indexedCells[id]; w.cells = w.cells.filter(e => e !== x); const o = w.playerCellIDs.indexOf(id); if (o !== -1) { w.playerCellIDs.splice(o, 1); w.playerCells = w.playerCells.filter(e => e !== x); if (!w.playerCellIDs.length && w.play) { w.play = false; env && env.died(); } } };
  if (op === 1) { del(a); const x = { id: a, x: b, size: c }; w.indexedCells[a] = x; w.cells.push(x); w.cellcolors['n' + a] = w.cellcolors['n' + a] || '#' + a; }
  else if (op === 2) del(a);
  else if (op === 3) { const e = w.indexedCells[a], v = w.indexedCells[b]; if (e && v) { e.size += v.size; del(b); } }
  else if (op === 4) { if (w.indexedCells[a]) w.indexedCells[a].x = b; }
  else if (op === 32) { if (w.playerCellIDs.indexOf(a) === -1) w.playerCellIDs.push(a); const x = w.indexedCells[a]; if (x && w.playerCells.indexOf(x) === -1) w.playerCells.push(x); if (!w.play) { w.play = true; env && env.spawned(); } }
  else if (op === 20) { w.playerCellIDs = []; w.playerCells = []; }
  else if (op === 18) { w.indexedCells = {}; w.cells = []; w.playerCells = []; w.playerCellIDs = []; if (!w.isLegendWorld) { w.mapMinX = -70; w.mapMaxX = 70; w.mapSize = 140; } }
  else if (op === 64) { w.mapMinX = -a * 10; w.mapMaxX = a * 10; w.mapSize = a * 20; w._lmServerBorder = Object.freeze({ minX: -a * 10, maxX: a * 10 }); }
  else if (op === 17) { w.viewX = a; w.scale = b / 10; }
  else if (op === 49) { w.leaderboard = []; for (let i = 0; i < a; i++) w.leaderboard.push({ nick: 'p' + i + '.' + b, id: i }); w.playerPosition = a; }
}
const WORLD_KEYS = ['indexedCells', 'cells', 'playerCells', 'playerCellIDs', 'cellcolors', 'play', 'mapMinX', 'mapMaxX', 'mapSize', '_lmServerBorder', 'viewX', 'scale', 'leaderboard', 'playerPosition', 'isLegendWorld'];
function cloneWorld(l) {
  const w = {};
  WORLD_KEYS.forEach(k => { w[k] = l[k]; });
  w.indexedCells = {}; w.cells = []; w.playerCells = [];
  Object.values(l.indexedCells).forEach(x => { const y = Object.assign({}, x); w.indexedCells[y.id] = y; w.cells.push(y); });
  w.playerCells = l.playerCells.map(x => w.indexedCells[x.id]).filter(Boolean);
  w.playerCellIDs = l.playerCellIDs.slice(); w.cellcolors = Object.assign({}, l.cellcolors); w.leaderboard = JSON.parse(JSON.stringify(l.leaderboard || []));
  return w;
}
function sig(w) {
  return JSON.stringify({
    cells: Object.values(w.indexedCells).map(x => [x.id, x.x, x.size]).sort((p, q) => p[0] - q[0]), list: w.cells.length,
    own: w.playerCellIDs.slice().sort(), ownCells: w.playerCells.length, colors: Object.keys(w.cellcolors).sort().length, play: !!w.play,
    border: [w.mapMinX, w.mapMaxX, w.mapSize, w._lmServerBorder && w._lmServerBorder.maxX], cam: [w.viewX, w.scale],
    lb: (w.leaderboard || []).map(e => e.nick), place: w.playerPosition
  });
}
function driverEnv(packets, opts) {
  opts = opts || {};
  let clock = 1000, tid = 0, timers = [], token = '';
  const g = { console: { log() { }, warn() { }, error: console.error }, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite, Number, String, Array, Object, Map, Set, WeakSet, Promise, parseInt, Boolean };
  g.window = g;
  g.document = { createElement: () => ({}), getElementById: () => null };
  g.performance = { now: () => clock };
  g.setTimeout = (fn, ms) => { timers.push({ id: ++tid, at: clock + Math.max(0, +ms || 0), fn }); return tid; };
  g.clearTimeout = id => { timers = timers.filter(t => t.id !== id); };
  g.setInterval = () => 0; g.clearInterval = () => { };
  g.requestAnimationFrame = () => 0; g.cancelAnimationFrame = () => { };
  g.localStorage = { getItem: () => null, setItem() { } };
  g.defaultmapsettings = { recordReplays: true, personalBests: true, matchHistory: true };
  const env = { g, handled: 0, seenCtx: [], log: [], ctxLog: [], hist: [], costMs: opts.costMs || 0, busy: 0 };
  /* a live connection or a replay one (recreateWS: replay tokens play 500 ms after the connect) */
  const connect = t => {
    token = t;
    const rf = vm.runInContext('({' + coreSrc.rf.replace(/,\s*$/, '') + '}).replayfunctions', g);
    if (t.indexOf('replay') !== -1) {
      l.ws = 'wss://imsolo.pro.replay:2000';
      rf.call(l);
      g.setTimeout(() => { if (String(l.ws).indexOf('replay') !== -1) g.playReplayLM(t.split('^')[1]); }, 500);
    } else { l.ws = t; rf.call(l); }
  };
  env.connect = connect;
  g.$ = sel => ({ val(v) { if (v === undefined) return sel === '#server-token' ? token : ''; if (sel === '#server-token') token = v; }, trigger() { if (sel === '#server-join') g.setTimeout(() => connect(token), 5); }, hide() { }, text: () => '' });
  g.application = { customSkinsMap: { bob: 'https://own.example/bob.png' }, flushData() { }, gameServerJoin(t) { token = t; g.setTimeout(() => connect(t), 5); } };
  const l = g.legendmod = {
    ws: 'wss://live.example:443', play: false, indexedCells: {}, cells: [], playerCells: [], playerCellIDs: [], food: [], viruses: [], removedCells: [], cellcolors: Object.create(null),
    mapMinX: -500, mapMaxX: 500, mapSize: 1000, _lmServerBorder: null, viewX: 77, scale: 1, leaderboard: [{ nick: 'live', id: 9 }], playerPosition: 3, isLegendWorld: !!opts.el,
    handleMessage(d) { env.handled++; env.seenCtx.push(!!g._lmEvReplayOn); if (env.costMs) { clock += env.costMs; env.busy += env.costMs; } applyPk(l, d, env); }
  };
  env.l = l;
  /* LMEvents: the game emits spawn / death from the packets and massUpdate every frame while playing */
  vm.createContext(g);
  vm.runInContext(coreSrc.events + '\n' + coreSrc.reset + '\nwindow.lmReplayResetWorld = lmReplayResetWorld;\n' + coreSrc.ev + '\nwindow._lmEvReplay = _lmEvReplay;\n' + coreSrc.play + '\nwindow.playReplayLM = playReplayLM;', g);
  ['spawn', 'death', 'massUpdate'].forEach(n => g.LMEvents.on(n, d => env.ctxLog.push(n + ':' + d.context)));
  ['replayStart', 'replayStop'].forEach(n => g.LMEvents.on(n, d => env.log.push(n + (d.reason ? ':' + d.reason : ''))));
  env.spawned = () => g.LMEvents.emit('spawn', { time: clock });
  env.died = () => g.LMEvents.emit('death', { time: clock, mass: 1, msAlive: 1 });
  env.frame = () => { if (l.play) g.LMEvents.emit('massUpdate', { mass: 10, cells: l.playerCells.length }); };
  /* recordings */
  g.RecordedProtocol = {}; g.RecordedArenasSpecifications = {}; g.RecordedProtocolArenas = [];
  env.add = (key, list, skins) => {
    const arr = list.slice();
    arr._lmSide = { t: list.map((_, i) => i * 40), est: false, s: [], e: [], c: [], start: 0 };
    g.RecordedProtocol[key] = arr; g.RecordedArenasSpecifications[key] = [1700000000000, ':ffa', 'EU', 'nick', JSON.stringify(skins || { bob: 'https://rec.example/bob.png' })];
    g.RecordedProtocolArenas.push(key);
    return key;
  };
  vm.runInContext(fs.readFileSync(opts.module || process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'replaystudio.js'), 'utf8'), g);
  env.RS = g.LMReplayStudio;
  env.advance = (ms, each) => {
    const end = clock + ms;
    for (; ;) {
      timers.sort((p, q) => p.at - q.at || p.id - q.id);
      const t = timers[0];
      if (!t || t.at > end) break;
      timers.shift();
      if (t.at > clock) clock = t.at;
      t.fn();
      env.frame();
      if (each) each();
    }
    clock = Math.max(clock, end);
  };
  env.now = () => clock;
  /* the world played forwards from the take-over up to pos */
  env.ref = pos => { const w = cloneWorld(env.base); const arr = g.RecordedProtocol[env.key]; for (let i = 0; i < pos; i++) applyPk(w, arr[i], null); return sig(w); };
  const take = g.playReplayLM;
  g.playReplayLM = function (k, s) { env.key = k; const r0 = take(k, s); return r0; };
  env.start = (key, pos, autoplay) => {
    env.key = key;
    env.RS.drive.select(key);
    /* the state at the take-over (after playReplayLM emptied the world), for the reference */
    const to = env.RS.takeOver;
    env.RS.takeOver = function (k, s) { env.base = cloneWorld(l); return to.call(this, k, s); };
    if (autoplay) env.RS.drive.play(1); else env.RS.drive.seek(pos, false);
    env.advance(600);
    env.RS.takeOver = to;
  };
  env.st = () => env.RS.state();
  return env;
}
if (Object.keys(coreSrc).every(k => coreSrc[k])) {
  /* the auditor's case: A added, B added, A removed; one step back from 3 shows A and B */
  {
    const e = driverEnv();
    const k = e.add('wss://a.example/1', [pk(1, 1, 10, 5), pk(1, 2, 20, 5), pk(2, 1), pk(4, 2, 30), pk(4, 2, 31), pk(4, 2, 32), pk(4, 2, 33), pk(4, 2, 34), pk(4, 2, 35), pk(4, 2, 36), pk(4, 2, 37), pk(4, 2, 38)]);
    e.start(k, 3, false);
    const at3 = sig(e.l) === e.ref(3);
    e.RS.drive.play(-1);
    let first = null;
    e.advance(2000, () => { if (first === null && !e.st().seeking && e.st().pos === 2) first = sig(e.l); });
    check('backwards: one step from 3 back to 2 shows A and B again (A was removed by packet 3)', at3 && first === e.ref(2) && Object.keys(JSON.parse(first).cells).length === 2);
  }
  /* add/remove/eat/spawn/border expand+shrink/multibox with checkpoints, both map kinds */
  const big = [pk(64, 50), pk(49, 3, 1), pk(17, 5, 10)];
  for (let i = 1; i <= 12; i++) big.push(pk(1, i, i * 3, 4 + i));
  big.push(pk(32, 1), pk(4, 1, 99), pk(3, 1, 2), pk(3, 1, 3), pk(2, 4), pk(64, 80), pk(17, 9, 12), pk(49, 4, 2)); // eat, remove, border grows
  big.push(pk(32, 5), pk(32, 6), pk(3, 5, 7), pk(20), pk(32, 8), pk(2, 9), pk(18));                               // multibox units, clear own, clear all
  for (let i = 20; i <= 30; i++) big.push(pk(1, i, i, 3));
  big.push(pk(32, 20), pk(3, 20, 21), pk(64, 60), pk(49, 2, 3), pk(2, 22), pk(17, 40, 8), pk(3, 20, 23), pk(18)); // border shrinks, clear all
  for (let i = 40; i <= 50; i++) big.push(pk(1, i, i, 2), pk(4, i, i + 1));
  big.push(pk(32, 40), pk(2, 40), pk(32, 41), pk(64, 70), pk(49, 5, 4), pk(3, 41, 42), pk(2, 43));                 // death and respawn
  for (let i = 0; i < 20; i++) big.push(pk(4, 44, i));
  [false, true].forEach(el => {
    const name = el ? 'Expanding Land' : 'agar.io-like';
    const e = driverEnv(null, { el });
    const k = e.add('wss://b.example/' + (el ? 'el' : 'ag'), big);
    e.start(k, big.length, false);
    check(name + ': forwards to the end equals the packets', sig(e.l) === e.ref(big.length) && e.st().pos === big.length);
    /* a seek back: the newest complete checkpoint, its border, camera and leaderboard */
    const h0 = e.handled;
    e.RS.drive.seek(70, false);
    const cps = []; for (let i = 0; i < big.length; i++) if (big[i].getUint8(0) === 18) cps.push(i);
    const from = cps.filter(c => c <= 69).pop();
    check(name + ': seek back rebuilds from the newest checkpoint (' + (e.handled - h0) + ' packets) and equals the packets', sig(e.l) === e.ref(70) && e.handled - h0 === 70 - from);
    e.RS.drive.seek(big.length, false);
    /* playing backwards to the start: every step shown equals the packets up to it */
    /* gaps: between two steps backwards (not the first one after starting to go back) */
    let steps = 0, bad = [], lastPos = e.st().pos, lastAt = -1, gaps = [];
    const watch = () => {
      const s = e.st();
      if (s.seeking || s.pos === lastPos) return;
      steps++;
      if (sig(e.l) !== e.ref(s.pos)) bad.push(s.pos);
      if (s.pos < lastPos && s.dir < 0) { if (lastAt >= 0) gaps.push(e.now() - lastAt); lastAt = e.now(); } else lastAt = -1;
      lastPos = s.pos;
    };
    e.RS.drive.play(-1);
    e.advance(1500, watch);
    /* speed change and pause while going back, forwards again, then back again */
    e.RS.command('speed', 0.5);
    e.advance(1000, watch);
    e.RS.drive.pause();
    lastAt = -1;
    const pPos = e.st().pos, pSig = sig(e.l);
    e.advance(1000, watch);
    check(name + ': pause while going back holds an exact world', e.st().pos === pPos && sig(e.l) === pSig && pSig === e.ref(pPos) && !e.st().playing);
    e.RS.drive.play(1);
    e.advance(700, watch);
    lastAt = -1;
    e.RS.drive.play(-1);
    e.advance(20000, watch);
    check(name + ': backwards in ' + steps + ' steps, each one the world of its position' + (bad.length ? ' (wrong at ' + bad.slice(0, 5).join(',') + ')' : ''), steps > 10 && !bad.length);
    check(name + ': backwards reaches the start, paused, still a replay', e.st().pos === 1 && !e.st().playing && e.g._lmReplayPaused === true && e.g._lmEvReplayOn === true && sig(e.l) === e.ref(1));
    check(name + ': steps backwards are at least 100 ms apart (' + Math.min.apply(null, gaps) + ' ms)', gaps.length > 5 && gaps.every(x => x >= 100));
  }
  );
  /* a slow page: every packet costs 2 ms, so one step back rebuilds for up to ~100 ms */
  {
    const e = driverEnv();
    const k = e.add('wss://c.example/1', big);
    e.start(k, big.length, false);
    e.costMs = 2; e.busy = 0;
    const t0 = e.now(), h0 = e.handled;
    let bad = 0, lastPos = e.st().pos;
    e.RS.drive.play(-1);
    e.advance(5000, () => { const s = e.st(); if (!s.seeking && s.pos !== lastPos) { lastPos = s.pos; if (sig(e.l) !== e.ref(s.pos)) bad++; } });
    const share = e.busy / (e.now() - t0);
    check('slow page: going back stays exact and rebuilds at most about half of the time (' + Math.round(share * 100) + '%, ' + (e.handled - h0) + ' packets)', !bad && share <= 0.55 && e.st().pos < big.length);
    /* a step pressed while a step backwards is still being rebuilt goes from where that one goes */
    e.RS.drive.seek(big.length, false);
    e.RS.drive.play(-1);
    let target = -1;
    e.advance(3000, () => { if (target < 0 && e.st().seeking && e.st().pos < e.l.playingReplayRecord - 3) { target = e.l.playingReplayRecord; e.RS.drive.step(-1); } });
    check('slow page: step back during a rebuilt step lands one before it, exact (' + target + ' -> ' + e.st().pos + ')', target > 0 && e.st().pos === target - 1 && !e.st().playing && sig(e.l) === e.ref(target - 1));
  }
  /* the lifecycle */
  const small = [pk(64, 50), pk(1, 1, 10, 5), pk(32, 1), pk(1, 2, 20, 5), pk(4, 1, 11), pk(4, 1, 12), pk(4, 1, 13), pk(4, 1, 14), pk(4, 1, 15), pk(4, 1, 16), pk(4, 1, 17), pk(4, 1, 18)];
  const noLive = e => e.ctxLog.filter(x => /:live$/.test(x));
  {
    const e = driverEnv();
    const k = e.add('wss://d.example/1', small);
    e.start(k, 0, true);
    e.advance(3000);
    const endSt = e.st(), endCtx = e.g._lmEvReplayOn, endPaused = e.g._lmReplayPaused;
    e.RS.drive.step(-1); e.advance(100);
    e.RS.drive.seek(3); e.advance(100);
    e.RS.drive.step(1); e.advance(100);
    e.advance(2000);
    check('end -> step -> seek: the end pauses at the last packet and stays a replay', endSt.pos === small.length && !endSt.playing && endSt.driving && endCtx === true && endPaused === true);
    check('end -> step -> seek: every packet is handled as a replay, one replayStart, no replayStop (' + e.log.join(' ') + ')', e.seenCtx.length > small.length && e.seenCtx.every(Boolean) && e.log.join() === 'replayStart');
    check('end -> step -> seek: no live spawn or massUpdate (' + noLive(e).slice(0, 3).join(' ') + ')', e.ctxLog.length > 0 && !noLive(e).length);
    /* reverse end leaves the same state as the end */
    e.RS.drive.play(-1); e.advance(5000);
    const rs = e.st();
    check('reverse end: the same as the end (paused at the first packet, still a replay, no event)', rs.pos === 1 && !rs.playing && rs.driving && e.g._lmReplayPaused === true && e.g._lmEvReplayOn === true && e.log.join() === 'replayStart');
  }
  {
    /* another recording chosen while one plays, then the Studio closed, then a live server */
    const e = driverEnv();
    const k1 = e.add('wss://e.example/1', small), k2 = e.add('wss://e.example/2', small, { bob: 'https://rec2.example/bob.png' });
    e.start(k1, 0, true);
    e.advance(200);
    const during = e.g.application.customSkinsMap.bob;
    e.RS.drive.select(k2);
    const afterSel = e.g.application.customSkinsMap.bob, selSt = e.st();
    e.RS.close();
    e.advance(2000);
    check('change selection then close: the recording\'s skins were used and are back after the change', during === 'https://rec.example/bob.png' && afterSel === 'https://own.example/bob.png' && e.g.application.customSkinsMap.bob === 'https://own.example/bob.png');
    check('change selection then close: the session ended, nothing paused, the stopped replay world is still a replay', !selSt.driving && !selSt.playing && !e.st().driving && e.g._lmReplayPaused === false && e.g._lmEvReplayOn === true && !noLive(e).length);
    e.connect('wss://live.example:443');
    e.advance(100);
    check('change selection then close: joining a live server ends the replay once (' + e.log.join(' ') + ')', e.g._lmEvReplayOn === false && e.log.join() === 'replayStart,replayStop:left');
  }
  {
    /* paused replay -> a live server: everything is back at once (nothing ticks while paused) */
    const e = driverEnv();
    const k = e.add('wss://f.example/1', small);
    e.start(k, 0, true);
    e.advance(200);
    e.RS.drive.pause();
    e.advance(500);
    e.connect('wss://live.example:443');
    const s = e.st();
    check('paused replay -> live: session ended, skins and pause flag back, replayStop left (' + e.log.join(' ') + ')', !s.driving && !s.playing && e.g._lmReplayPaused === false && e.g.application.customSkinsMap.bob === 'https://own.example/bob.png' && e.g._lmEvReplayOn === false && e.log.join() === 'replayStart,replayStop:left');
    e.l.play = true; e.advance(300); e.frame();
    check('paused replay -> live: the live game is live again', /massUpdate:live$/.test(e.ctxLog[e.ctxLog.length - 1]));
  }
  {
    /* a recording imported (or opened from the library) while another plays: the new one plays as its own replay */
    const e = driverEnv();
    const k1 = e.add('wss://g.example/1', small);
    e.start(k1, 0, true);
    e.advance(200);
    const k2 = e.add('imported.lm', small, { bob: 'https://imp.example/bob.png' });
    e.RS.drive.select(k2);
    const mid = e.g.application.customSkinsMap.bob;
    e.RS.drive.play(1);
    e.advance(3000);
    const s = e.st();
    check('import while active: the old session ends (own skins), the import plays with its skins', mid === 'https://own.example/bob.png' && s.driving && s.key === k2 && s.pos === small.length && e.g.application.customSkinsMap.bob === 'https://imp.example/bob.png');
    check('import while active: replayStop for the old recording, replayStart for the new one, all as a replay (' + e.log.join(' ') + ')', e.log.join() === 'replayStart,replayStop:stopped,replayStart' && e.seenCtx.every(Boolean) && !noLive(e).length);
  }
  /* the game's death handler: no session stats, personal bests or match history for a replay */
  {
    const noop = () => { };
    const calls = [];
    const g = { Math, Date, JSON, Object, Array, String, Number, console: { log: noop, warn: noop } };
    g.window = g;
    g.LMEvents = { _has: () => false, emit: noop };
    g.defaultmapsettings = { personalBests: true, matchHistory: true };
    g.ogario = { playerScore: 900, play: true };
    g._lmSessionStats = () => calls.push('stats'); g._lmPersonalBests = () => { calls.push('best'); return {}; }; g._lmMatchHistory = () => calls.push('history');
    g.$ = () => ({ text: () => '', val: () => '' });
    g.__env = new Proxy({}, { has: (t, k) => typeof k === 'string' && !(k in g), get: () => noop });
    vm.createContext(g);
    const app = vm.runInContext('with (__env) { ({' + coreSrc.death.replace(/,\s*$/, '') + '}) }', g);
    Object.assign(app, { _lmLifeStartAt: Date.now() - 5000, sendPlayerDeath: noop, updateDeathLocations: noop, unlockButtons: noop, autoResp: noop });
    g._lmEvReplayOn = true;
    app.onPlayerDeath();
    const inReplay = calls.slice();
    calls.length = 0; g._lmEvReplayOn = false; app._lmLastDeathAt = 0; g.ogario.play = true; app._lmLifeStartAt = Date.now() - 5000;
    app.onPlayerDeath();
    check('death in a replay: no session stats, personal best or match history (' + inReplay.join(',') + '); a live death has them (' + calls.join(',') + ')', !inReplay.length && calls.join() === 'stats,best,history');
  }
}

}
console.log(fail ? fail + ' failed' : 'all replay studio checks passed');
process.exit(fail ? 1 : 0);
