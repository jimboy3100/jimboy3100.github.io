/* Truncated packet checks: the game packet handler (handleMessage in ogario/ogario.v4.js)
 * is taken from the source and fed short packets. None may throw, and a cut-short
 * leaderboard keeps the previous one. node developers/tests/packets.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const start = src.indexOf('        handleMessage(data) {\n'.replace(/\n/g, src.includes('\r\n') ? '\r\n' : '\n'));
const end = src.indexOf('        countPps() {', start);
if (start < 0 || end < 0) { console.log('handler not found'); process.exit(1); }
const body = src.slice(start, end).replace(/,\s*$/, '');
const warns = [];
const ctx = {
    console: { log() { }, warn: (...a) => warns.push(a.join(' ')), error: (...a) => warns.push('ERROR ' + a.join(' ')) },
    defaultmapsettings: {}, lmRecRoom: () => false /* no replay recording in this test */, TextDecoder, Uint8Array, DataView, Date, Math, RangeError,
    $: () => ({ val: () => '' }), drawRender: { drawPieChart() { } }, _lmElTeamsActive: () => false,
    application: { customSkinsMap: {}, loadSkin() { } }, LM: { fbOnline: [] },
};
ctx.window = ctx;
vm.createContext(ctx);
const h = vm.runInContext('({' + body + '})', ctx);
Object.assign(h, {
    leaderboard: [], fbOnline: [], friends: 0, playerPosition: 0, serverType: '', playerNick: 'me',
    playerCellIDs: [], indexedCells: {}, handled: 0, handleLeaderboard() { this.handled++; },
});
const pkt = (bytes) => new DataView(new Uint8Array(bytes).buffer);
let failed = 0;
const check = (name, fn) => {
    let ok;
    try { ok = fn(); } catch (e) { ok = false; name += ' (threw ' + e.name + ')'; }
    console.log((ok ? 'ok   ' : 'FAIL ') + name);
    if (!ok) failed++;
};
check('empty packet', () => (h.handleMessage(pkt([])), true));
check('truncated friend information', () => (h.handleMessage(pkt([5, 1, 2])), h.fbOnline.length === 0));
/* a whole board: flags 2|4, "a\0", id 7 */
check('complete leaderboard', () => (h.handleMessage(pkt([53, 6, 97, 0, 7, 0, 0, 0])), h.leaderboard.length === 1 && h.leaderboard[0].nick === 'a' && h.handled === 1));
check('truncated leaderboard keeps the previous board', () => (h.handleMessage(pkt([53, 6, 98, 0, 7, 0])), h.leaderboard.length === 1 && h.leaderboard[0].nick === 'a' && h.handled === 1));
check('truncated leaderboard 54 header', () => (h.handleMessage(pkt([54, 1])), h.leaderboard.length === 1));
check('truncated private leaderboard 49', () => (h.handleMessage(pkt([49, 1, 0])), h.leaderboard.length === 1));
check('truncated viewport information', () => (h.handleMessage(pkt([17, 0, 0, 0, 0])), true));
check('no uncaught errors logged', () => !warns.some(w => w.startsWith('ERROR')));
console.log(failed ? failed + ' check(s) failed' : 'all packet checks passed');
process.exit(failed ? 1 : 0);
