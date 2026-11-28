/* Settings > HUD "Leaderboard: collapse repeated (bot) names" (lbHideBots, off by default), with the
 * real handleLeaderboard of ogario/ogario.v4.js in a vm: a nick seen 3+ times is listed once as
 * "name x N"; own, teammate and friend rows and names seen twice are never collapsed.
 * node developers/tests/lbbots.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (info ? '  (' + info + ')' : '')); if (!c) fail++; };

/* from a marker to the brace that closes its first block (skips strings and comments) */
function block(from) {
    const a = src.indexOf(from);
    if (a < 0) throw new Error('not found in ogario.v4.js: ' + from);
    let i = src.indexOf('{', a), depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i], nx = src[i + 1];
        if (ch === '/' && nx === '/') { i = src.indexOf('\n', i); continue; }
        if (ch === '/' && nx === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { for (i++; src[i] !== ch; i++) if (src[i] === '\\') i++; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return src.slice(a, i + 1);
    }
    throw new Error('unclosed block: ' + from);
}

let shown = null;
const g = {
    console, Math, Object, Set, Array, String, performance: { now: () => 0 }, Date,
    application: { top5: [], checkSkinURL: (u) => u, escapeHTML: (t) => String(t), displayLeaderboard(t) { shown = t; throw new Error('shown'); } },
    lmTeamSkinMap: () => ({}), ogarcopythelb: { clanTag: '' }, profiles: [], LM: { multiBoxPlayerExists: false },
    defaultmapsettings: { leaderboardlimit: 10, lbHideBots: false, showLbData: false }
};
g.window = g;
g.window.LMEvents = { _has: () => false };
g.legendmod = { gameMode: ':ffa' };
vm.createContext(g);
const lb = vm.runInContext('({' + block('        handleLeaderboard() {') + '})', g);

function run(on) {
    g.defaultmapsettings.lbHideBots = on;
    const o = Object.assign(Object.create(lb), {
        leaderboard: [{ nick: 'bot' }, { nick: 'Ann' }, { nick: 'bot' }, { nick: 'Tom', id: 'isPlayer' }, { nick: 'bot' }, { nick: 'Two' }, { nick: 'Two' }],
        ghostCells: [], playerPosition: 4
    });
    shown = null;
    try { o.handleLeaderboard(); } catch (e) { if (e.message !== 'shown') throw e; }
    return shown || '';
}
const off = run(false), on = run(true);
const rows = (t) => (t.match(/<bdi>[^<]*<\/bdi>/g) || []).length;
check('off: every row listed as before', rows(off) === 7 && off.indexOf('×') === -1, off);
check('on: a nick seen 3 times is listed once with its count, at its first rank', rows(on) === 5 && on.indexOf('1. <bdi>bot</bdi> <span class="top5-mass-color">×3</span>') !== -1 && on.indexOf('3. <bdi>bot') === -1, on);
check('on: the own row and a name seen twice stay', on.indexOf('<span class="me">4. <bdi>Tom</bdi>') !== -1 && on.indexOf('6. <bdi>Two') !== -1 && on.indexOf('7. <bdi>Two') !== -1);

console.log(fail ? fail + ' check(s) failed' : 'all leaderboard bot checks passed');
process.exit(fail ? 1 : 0);
