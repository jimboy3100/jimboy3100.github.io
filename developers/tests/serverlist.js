/* Server list (agar.io scan) counting checks: the helpers are taken from ogario/ogario.v4.js.
 * The player count comes from the whole leaderboard (53/54), not the 20-player minimap list.
 * node developers/tests/serverlist.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
function grab(name) {
    const i = src.indexOf('    function ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    let d = 0, j = src.indexOf('{', i);
    for (let k = j; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
}
const ctx = { TextDecoder };
vm.createContext(ctx);
vm.runInContext(['sbPlayers', 'sbPopulationText', 'sbSplitBots', 'sbReadCString', 'sbReadLeaderboardNicks', 'sbReadPopulation', 'sbNameSet', 'sbSameArena'].map(grab).join('\n'), ctx);
const enc = s => Array.from(Buffer.from(s, 'utf8'));
/* flags 2|4: nick + id */
const rec = nick => [6].concat(enc(nick), [0], [1, 0, 0, 0]);
const lb = (op, nicks) => Uint8Array.from([op].concat(op === 54 ? [0, 0] : [], ...nicks.map(rec)));
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

const names = [];
for (let i = 0; i < 74; i++) names.push('p' + i);
for (let i = 0; i < 27; i++) names.push('bot');
const n = ctx.sbReadLeaderboardNicks(lb(53, names));
check('53: every record read (101)', n && n.length === 101);
const sp = ctx.sbSplitBots(n);
check('players and bots split as the footer does (74 + 27)', sp.players === 74 && sp.bots === 27);
check('text', ctx.sbPopulationText(74, 27) === '74 players · 27 bots' && ctx.sbPopulationText(1, 0) === '1 player');
check('two players with the same name stay players', ctx.sbSplitBots(['a', 'a', 'b']).players === 3);
check('54 with its uint16 header', (ctx.sbReadLeaderboardNicks(lb(54, ['x', 'y'])) || []).length === 2);
check('empty leaderboard: 0', (ctx.sbReadLeaderboardNicks(Uint8Array.of(53)) || [1]).length === 0);
check('cut-short record: null', ctx.sbReadLeaderboardNicks(lb(53, ['abc']).slice(0, 6)) === null);
check('other opcodes: null', ctx.sbReadLeaderboardNicks(Uint8Array.of(69, 0, 0)) === null);
check('unnamed record (flags 4 only)', (ctx.sbReadLeaderboardNicks(Uint8Array.of(53, 4, 1, 0, 0, 0)) || []).join() === '');
/* one arena under two addresses: mostly the same named players at about the same time */
const boardA = names.slice(0, 40), boardB = names.slice(3, 45);
const setA = ctx.sbNameSet(boardA), setB = ctx.sbNameSet(boardB);
check('name set drops bot groups and unnamed cells', ctx.sbNameSet(['', '', '', 'x', 'bot', 'bot', 'bot']).join() === 'x');
check('same players a minute apart: same arena', ctx.sbSameArena(setA, 1000, setB, 61000));
check('same players 5 minutes apart: not judged', !ctx.sbSameArena(setA, 1000, setB, 301000));
check('different players: different arenas', !ctx.sbSameArena(setA, 1000, ctx.sbNameSet(names.slice(40, 74)), 1000));
check('fewer than 5 names: not judged', !ctx.sbSameArena(['a', 'b', 'c'], 1, ['a', 'b', 'c'], 1));
console.log(failed ? failed + ' check(s) failed' : 'all server list checks passed');
process.exit(failed ? 1 : 0);
