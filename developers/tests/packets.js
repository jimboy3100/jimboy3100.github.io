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
/* which connection the last whole board came from (_lmLbSeq): Full Map counts an empty board as 0
 * players only when it is a whole board of this connection (LM._lmFullMapCrowdCheck) */
check('a cut-short board marks no receipt for this connection', () => (h._connectSeq = 7, h.handleMessage(pkt([53, 6, 98, 0, 7, 0])), h._lmLbSeq !== 7 && h.leaderboard.length === 1));
check('a whole board with nobody in it: empty list, received on this connection', () => (h.handleMessage(pkt([53])), h.leaderboard.length === 0 && h._lmLbSeq === 7 && h.handled === 2));
check('a whole board: received on this connection', () => (h._connectSeq = 8, h.handleMessage(pkt([53, 6, 97, 0, 7, 0, 0, 0])), h.leaderboard.length === 1 && h._lmLbSeq === 8 && h.handled === 3));
check('truncated leaderboard 54 header', () => (h.handleMessage(pkt([54, 1])), h.leaderboard.length === 1));
check('truncated private leaderboard 49', () => (h.handleMessage(pkt([49, 1, 0])), h.leaderboard.length === 1));
check('truncated viewport information', () => (h.handleMessage(pkt([17, 0, 0, 0, 0])), true));
check('no uncaught errors logged', () => !warns.some(w => w.startsWith('ERROR')));

/* FB friend lookup (_lmFbFriend): the same entry as list.find(e => e.id === id), from an index */
{
    const a = src.indexOf('var _lmFbIdx = '), b = src.indexOf('\n}', src.indexOf('function _lmFbFriend(', a));
    check('FB friend index found', () => a > 0 && b > a);
    vm.runInContext(src.slice(a, b + 2), ctx);
    const F = ctx._lmFbFriend;
    const find = (list, id) => list.find((e) => e.id === id);
    let same = true, seed = 7;
    const rnd = (n) => (seed = (seed * 1103515245 + 12345) % 2147483648) % n;
    const ids = [0, 1, 2, 3, 7, 4294967295, 'isPlayer', undefined, NaN, -0];
    for (let round = 0; round < 300 && same; round++) {
        const list = [];
        for (let i = rnd(8); i > 0; i--) list.push({ id: ids[rnd(ids.length)], fbId: 'f' + round + '_' + i });
        for (const id of ids) if (F(list, id) !== find(list, id)) same = false;
        list.push({ id: 3, fbId: 'late' }); /* the list grew (opcode 5 pushes one by one) */
        for (const id of ids) if (F(list, id) !== find(list, id)) same = false;
        list.length = 0; /* a reset empties it in place */
        if (F(list, 3) !== undefined) same = false;
    }
    check('FB friend index: same first match as find (duplicates, undefined, NaN, -0, growth, reset)', () => same);
    /* through the handler: opcode 5 lists friend 7, the leaderboard names it with its fbId */
    ctx.LM = h;
    h.handleMessage(pkt([5, 7, 0, 0, 0, 120, 0]));
    h.handleMessage(pkt([53, 6, 97, 0, 7, 0, 0, 0]));
    check('FB friend on the leaderboard', () => h.fbOnline.length === 1 && h.leaderboard[0].isFBFriend === 'x');
    h.handleMessage(pkt([5]));
    h.handleMessage(pkt([53, 6, 97, 0, 7, 0, 0, 0]));
    check('FB friends list replaced: the old friend is not found', () => h.fbOnline.length === 0 && h.leaderboard[0].isFBFriend === false);
}
console.log(failed ? failed + ' check(s) failed' : 'all packet checks passed');
process.exit(failed ? 1 : 0);
