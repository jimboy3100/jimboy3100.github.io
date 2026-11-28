/* The 10 s special-effect skin heartbeat (repeatSendingSpecialSkins in ogario/ogario.v4.js), taken
 * from the source: what it sends, for which nick, and how often it reads the nick box.
 * node developers/tests/specialskins.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const a = src.indexOf('\nfunction repeatSendingSpecialSkins() {'), b = src.indexOf('\n}\n', a);
if (a < 0 || b < 0) { console.log('FAIL repeatSendingSpecialSkins not found'); process.exit(1); }
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
function run(o) {
    const reads = { nick: 0, clantag: 0 }, sent = [], animated = [];
    const box = { '#nick': o.nick, '#clantag': o.tag };
    const ctx = {
        document: { hidden: !!o.hidden },
        localStorage: { getItem: () => o.stored },
        $: (sel) => ({ val: () => { reads[sel.slice(1)]++; return box[sel]; } }),
        application: { lastSentNick: o.last, sendSocket3Info: (k, v) => sent.push(k + ':' + v) },
        SpecialEffectPlayers: {},
        animateCustomSkin: (n, t) => animated.push(n + ':' + t),
        clanTagLc: 'ZZX', proLicenceUID: o.pro, tempAnimatedCoolArray: o.cool || [],
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(src.slice(a, b + 2) + '\nrepeatSendingSpecialSkins();', ctx);
    return { reads, sent, animated, players: ctx.SpecialEffectPlayers, last: ctx.application.lastSentNick };
}
let r = run({ stored: 'Fire', nick: 'me?', tag: 'ZZX', last: '' });
check('clan nick with ?: effect sent, animated for the nick', r.sent.join() === 'spfc:Fire' && r.animated.join() === 'me?:Fire' && r.players['me?'] === 'Fire' && r.last === 'me?');
check('the nick box is read once per tick', r.reads.nick === 1);
r = run({ stored: 'Fire', nick: 'other', tag: 'ZZX', last: 'old' });
check('no licence, no ? nick: nothing sent', r.sent.length === 0 && r.animated.length === 0);
r = run({ stored: 'Byzantium', nick: 'x', tag: '', last: 'old' });
check('Byzantium: sent, kept under the last sent nick', r.sent.join() === 'spfc:Byzantium' && r.players.old === 'Byzantium' && r.animated.join() === 'x:Byzantium');
r = run({ stored: 'null', nick: 'me?', tag: 'ZZX', last: '' });
check('stored "null": nothing sent, the nick box not read', r.sent.length === 0 && r.reads.nick === 0);
r = run({ stored: 'Fire', nick: 'me?', tag: 'ZZX', last: '', hidden: true });
check('hidden tab: nothing', r.sent.length === 0 && r.reads.nick === 0);
r = run({ stored: 'Cool1', nick: 'p', tag: '', last: '', pro: 'uid', cool: [] });
check('licence: sent', r.sent.join() === 'spfc:Cool1' && r.last === 'p');
console.log(failed ? failed + ' FAILED' : 'all special skin heartbeat checks passed');
process.exit(failed ? 1 : 0);
