/* Replay memory checks: only the latest game stays in memory (a new recording frees the older
 * ones at its 11th packet, except a playing or saving one), the memory budget (which recordings
 * are freed, when the current one stops), the size of a packet (a view keeps its whole buffer)
 * and that the Replay Studio data (_lmRecM) stops exactly when the packets stop. Every game is
 * recorded: there is no switch. The code is taken from ogario/ogario.v4.js: the helpers, _lmRecM,
 * _lmRecEv, _lmRecBudgetCheck, _lmRecKeepLatest and the packet recording branch of _lmHandlePacket.
 * node developers/tests/replaymemory.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(start) {
    const i = src.indexOf(start);
    if (i < 0) throw Error(start + ' not found');
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
}
const fn = (name) => block('\nfunction ' + name + '(').slice(1);
const ctx = { console: { info() { ctx.infos++; }, log() {} }, infos: 0, Math, Date, Array, DataView, ArrayBuffer, Uint8Array, navigator: {}, document: { getElementById: () => null, activeElement: null } };
ctx.window = ctx;
vm.createContext(ctx);
const overhead = /\nvar LM_REC_PKT_OVERHEAD = \d+;/.exec(src);
if (!overhead) throw Error('LM_REC_PKT_OVERHEAD not found');
vm.runInContext([overhead[0], fn('lmRecRoom'), fn('lmRecByteBudget'), fn('lmRecPacketBytes'), fn('lmRecArrBytes'), fn('lmRecBudgetPlan'), fn('_lmTokenBoxValue'),
    block('window._lmRecM = function') + ';', block('window._lmRecEv = function') + ';', block('window._lmRecBudgetCheck = function') + ';',
    block('window._lmRecKeepLatest = function') + ';'].join('\n'), ctx);
/* the packet recording branch, run as a function of one packet */
vm.runInContext('function recordPacket(data) { var _recServerToken;\n' +
    block('if (lmRecRoom(') + '\n}', ctx);
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const C = ctx, MiB = 1048576, O = ctx.LM_REC_PKT_OVERHEAD;

/* ---- budget by device ---- */
check('budget: unknown memory, desktop 300 MiB', C.lmRecByteBudget(undefined, false) === 300 * MiB);
check('budget: unknown memory, phone 150 MiB', C.lmRecByteBudget(undefined, true) === 150 * MiB);
check('budget: 8 GB desktop 320 MiB, phone 160 MiB', C.lmRecByteBudget(8, false) === 320 * MiB && C.lmRecByteBudget(8, true) === 160 * MiB);
check('budget: 4 GB desktop 192 MiB', C.lmRecByteBudget(4, false) === 192 * MiB);
check('budget: small devices never below 64 MiB', C.lmRecByteBudget(0.5, true) === 64 * MiB && C.lmRecByteBudget(1, false) === 64 * MiB);
check('budget: nonsense memory value falls back', C.lmRecByteBudget(-1, false) === 300 * MiB && C.lmRecByteBudget('x', true) === 150 * MiB);

/* ---- packet sizes ---- */
check('packet: own buffer counts its length', C.lmRecPacketBytes(new DataView(new ArrayBuffer(100))) === 100);
check('packet: a view keeps its whole buffer', C.lmRecPacketBytes(new DataView(new ArrayBuffer(5000), 10, 20)) === 5000);
check('packet: empty slot is 0', C.lmRecPacketBytes(undefined) === 0 && C.lmRecPacketBytes(null) === 0);
const arr = [new DataView(new ArrayBuffer(10)), new DataView(new ArrayBuffer(30))];
check('recording: size with per packet overhead', C.lmRecArrBytes(arr) === 40 + 2 * O);
arr.push(new DataView(new ArrayBuffer(50)));
check('recording: size is measured again when it grows', C.lmRecArrBytes(arr) === 90 + 3 * O);
check('recording: missing or empty is 0', C.lmRecArrBytes(undefined) === 0 && C.lmRecArrBytes([]) === 0);

/* ---- room (shared by packets and Studio data) ---- */
check('room: normal recording', C.lmRecRoom(0, 0, false) && C.lmRecRoom(89999, 104857599, false));
check('room: 90000 packets stop', !C.lmRecRoom(90000, 0, false));
check('room: 100 MiB stop', !C.lmRecRoom(10, 104857600, false));
check('room: budget stop', !C.lmRecRoom(10, 10, true));
check('room: counter not set yet counts as empty', C.lmRecRoom(0, undefined, undefined));

/* ---- plan ---- */
const E = (key, bytes, keep) => ({ key, bytes, keep: !!keep });
let p = C.lmRecBudgetPlan([E('a', 50), E('b', 50)], 50, 200);
check('plan: under budget frees nothing', p.evict.length === 0 && !p.stop);
p = C.lmRecBudgetPlan([E('a', 100), E('b', 100), E('c', 100)], 50, 200);
check('plan: oldest freed first, only as many as needed', JSON.stringify(Array.from(p.evict)) === '["a","b"]' && !p.stop && p.total === 150);
p = C.lmRecBudgetPlan([E('a', 100, true), E('b', 100), E('c', 100)], 50, 200);
check('plan: kept (playing/saving) ones are skipped', JSON.stringify(Array.from(p.evict)) === '["b","c"]' && !p.stop);
p = C.lmRecBudgetPlan([E('a', 100), E('b', 100)], 250, 200);
check('plan: everything freed and still over: stop', p.evict.length === 2 && p.stop);
p = C.lmRecBudgetPlan([E('a', 180, true)], 50, 200);
check('plan: only a kept one left: stop the current one', p.evict.length === 0 && p.stop);
p = C.lmRecBudgetPlan([], 200, 200);
check('plan: exactly at the budget is fine', !p.stop);

/* ---- live: recording, budget check, Studio data ---- */
function session(budget) {
    C.RecordedProtocol = [];
    C.RecordedProtocolArenas = [];
    C.RecordedArenasSpecifications = [];
    C.legendmod = { playingReplayServer: null };
    C.defaultmapsettings = {};
    C.$ = () => ({ val: () => 'wss://live-arena-x.agar.io' });
    C._lmRecBudget = budget;
    C.infos = 0;
}
function keep(key, bytes) {
    const a = [new DataView(new ArrayBuffer(bytes))];
    for (let i = 0; i < 20; i++) a.push(new DataView(new ArrayBuffer(1)));
    C.RecordedProtocol[key] = a;
    C.RecordedProtocolArenas.push(key);
    C.RecordedArenasSpecifications[key] = [1];
}
function start(key) {
    /* what connect() does for a new recording */
    C.temporaryRecordedProtocol = key;
    C.catholicCalculator = 0;
    C._lmRecSlotBytes = 0;
    C._lmRecFull = false;
    C._lmRecChkAt = 0;
    C.RecordedProtocol[key] = [];
    C._lmRecLive = true;
    C.RecordedProtocol[key]._lm = { v: 1, t0: Date.now(), ct: 0, st: 0, t: [], s: [], e: [], c: [] };
    C.RecordedProtocolArenas.push(key);
    C.RecordedArenasSpecifications[key] = [1];
}
const pkt = (n) => new DataView(new ArrayBuffer(n));

/* ---- only the latest game in memory ---- */
session(4096 * MiB);
keep('game1', 1000); keep('game2', 1000);
C.idbUsed = 0;
C.indexedDB = new Proxy({}, { get() { C.idbUsed++; return () => null; } });
start('game3');
for (let i = 0; i < 10; i++) C.recordPacket(pkt(100));
check('latest: 10 packets (a failed connect or reconnect) free nothing yet', C.RecordedProtocolArenas.join() === 'game1,game2,game3' && !!C.RecordedProtocol.game1 && !!C.RecordedProtocol.game2);
C.recordPacket(pkt(100));
check('latest: the 11th packet frees the previous games', C.RecordedProtocolArenas.join() === 'game3' && !C.RecordedProtocol.game1 && !C.RecordedProtocol.game2 &&
    !C.RecordedArenasSpecifications.game1 && !C.RecordedArenasSpecifications.game2 && C.infos === 1);
for (let i = 0; i < 30; i++) C.recordPacket(pkt(100));
check('latest: freed once, the current recording goes on', C.infos === 1 && C.catholicCalculator === 41 && C.RecordedProtocol.game3.length === 41 && !C._lmRecFull);
check('latest: the library (IndexedDB) is not touched', C.idbUsed === 0);
session(4096 * MiB);
keep('watched', 1000); keep('saving', 1000); keep('older', 1000);
C.legendmod.playingReplayServer = 'watched';
C.RecordedProtocol.saving._lmSaving = true;
start('now');
for (let i = 0; i < 11; i++) C.recordPacket(pkt(100));
check('latest: a playing replay and one being saved stay, the others go', C.RecordedProtocolArenas.join() === 'watched,saving,now' && !C.RecordedProtocol.older &&
    C.RecordedProtocol.watched.length === 21 && C.RecordedProtocol.saving.length === 21);
/* an old saved recordReplays: false does nothing: the game is recorded and the previous one freed */
session(4096 * MiB);
keep('before', 1000);
C.defaultmapsettings.recordReplays = false;
start('stillOn');
for (let i = 0; i < 100; i++) C.recordPacket(pkt(100));
check('no switch: an old saved recordReplays false still records, the previous game is freed', C.catholicCalculator === 100 && C._lmRecM() !== null && C.RecordedProtocolArenas.join() === 'stillOn');

/* ---- the budget: recordings opened from the library during a game count too ---- */
session(10 * MiB);
start('cur');
C.recordPacket(pkt(100));
check('live: first packet checks the budget', C._lmRecChkAt === 100 + MiB);
for (let i = 0; i < 10; i++) C.recordPacket(pkt(100));
keep('old1', 3 * MiB); keep('old2', 3 * MiB); keep('old3', 3 * MiB);
check('live: opened after the 11th packet, nothing freed while it fits', C.RecordedProtocolArenas.length === 4);
for (let i = 0; i < 20; i++) C.recordPacket(pkt(100 * 1024)); /* 2 MiB */
check('live: over the budget frees the oldest recording only', C.RecordedProtocolArenas.join() === 'cur,old2,old3' && !C.RecordedProtocol.old1 && !C.RecordedArenasSpecifications.old1);
check('live: still recording', !C._lmRecFull && C.catholicCalculator === 31);
C.legendmod.playingReplayServer = 'old2';
for (let i = 0; i < 40; i++) C.recordPacket(pkt(100 * 1024));
check('live: the playing replay is kept, the next oldest is freed', C.RecordedProtocolArenas.join() === 'cur,old2' && !!C.RecordedProtocol.old2);
for (let i = 0; i < 80 && !C._lmRecFull; i++) C.recordPacket(pkt(100 * 1024));
check('live: nothing left to free: the current recording stops', C._lmRecFull === true && C.RecordedProtocolArenas.join() === 'cur,old2');
const n = C.catholicCalculator, bytes = C._lmRecSlotBytes, arrCur = C.RecordedProtocol.cur;
C.recordPacket(pkt(100));
check('live: no packets after the stop', C.catholicCalculator === n && C._lmRecSlotBytes === bytes && arrCur.length === n);
check('live: times kept for every packet', arrCur._lm.t.length === n);
check('live: Studio data stops with the packets', C._lmRecM() === null);
C._lmRecEv('d', 100);
check('live: no events after the stop', arrCur._lm.e.length === 0);
check('live: stop reported once', C.infos === 3);
check('live: total stays inside the budget plus one check step', C.lmRecArrBytes(C.RecordedProtocol.old2) + bytes + n * O <= 10 * MiB + MiB + 100 * 1024);

/* 100 MiB per recording: Studio data stops too (the timeline desync) */
session(4096 * MiB);
start('big');
C._lmRecChkAt = Infinity; /* only the per recording cap here */
C.recordPacket(pkt(10));
C._lmRecEv('s', 0);
check('100 MiB: Studio data while recording', C._lmRecM() !== null && C.RecordedProtocol.big._lm.e.length === 3);
C._lmRecSlotBytes = 104857600 - 5;
C.recordPacket(pkt(10)); /* crosses 100 MiB: recorded, then stop */
const nb = C.catholicCalculator;
C.recordPacket(pkt(10));
check('100 MiB: packets stop', nb === 2 && C.catholicCalculator === 2);
C._lmRecEv('d', 5);
check('100 MiB: Studio data stops exactly then', C._lmRecM() === null && C.RecordedProtocol.big._lm.e.length === 3);

/* a new recording starts fresh */
start('next');
C.recordPacket(pkt(10));
check('new recording: recording again with Studio data', C.catholicCalculator === 1 && C._lmRecM() !== null);

/* the budget is worked out once from the device when not set */
session(0);
C._lmRecBudget = 0;
C.navigator = { deviceMemory: 4 };
C.isMobile = true;
start('dev');
C.recordPacket(pkt(10));
check('device budget: phone with 4 GB gets 160 MiB', C._lmRecBudget === 160 * MiB);

console.log(failed ? failed + ' FAILED' : 'all replay memory checks passed');
process.exit(failed ? 1 : 0);
