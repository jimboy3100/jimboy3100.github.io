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

console.log(fail ? fail + ' failed' : 'all replay studio checks passed');
process.exit(fail ? 1 : 0);
