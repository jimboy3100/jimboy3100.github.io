/* Settings > HUD "Leaderboard: collapse repeated (bot) names" (lbHideBots, off by default), with the
 * real handleLeaderboard of ogario/ogario.v4.js in a vm: a nick seen 3+ times is listed once as
 * "name x N"; own, teammate and friend rows and names seen twice are never collapsed.
 * Multibox own rows: marked from each unit's own leaderboard (several units), never from a
 * profile nick; own rows past the shown limit listed in rank order.
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

/* multibox: the rows of our units are marked from each unit's own leaderboard (its server marks
 * that connection's own row), never from a profile nick; several units can be marked */
{
    const cam = src.slice(src.indexOf('var LM_MB_CAMERA_NEAR = '), src.indexOf('/* OgVer set above', src.indexOf('var LM_MB_CAMERA_NEAR = ')));
    vm.runInContext(block('function lmMbAlive(p) {') + '\n' + cam + '\nvar spects = [];', g);
    const own = (n, me) => Array.from({ length: n }, (_, i) => (i === me[0] ? { nick: me[1], id: 'isPlayer' } : { nick: 'x' + i, id: 0 }));
    const unit = (number, lb, o) => Object.assign({ number, player: true, active: true, leaderboard: lb }, o || {});
    const main = () => [{ nick: 'Ann' }, { nick: 'Bob' }, { nick: 'Tom', id: 'isPlayer' }, { nick: 'Joe' }, { nick: 'Cat' }, { nick: 'Dan' }, { nick: 'Eve' }, { nick: 'P2' }];
    const show = (limit, lbRows) => {
        g.defaultmapsettings.lbHideBots = false; g.defaultmapsettings.leaderboardlimit = limit;
        const o = Object.assign(Object.create(lb), { leaderboard: lbRows || main(), ghostCells: [], playerPosition: 3, playerNick: 'Tom' });
        shown = null;
        try { o.handleLeaderboard(); } catch (e) { if (e.message !== 'shown') throw e; }
        return { text: shown || '', o };
    };
    g.LM.multiBoxPlayerExists = true;
    g.window.legendmod = { play: true };
    /* P2's profile nick 'P2' is on the board but nothing says it is ours */
    g.profiles = [{ nick: 'Tom' }, { nick: 'P2' }]; g.application.selectedProfile = 0; g.application.selectedOldProfile = 1;
    g.spects.push(
        unit(5, own(8, [4, 'Cat'])),                       /* row 5: ours (its own board marks it) */
        unit(2, own(8, [1, 'Bob'])),                       /* row 2: ours */
        unit(9, own(8, [3, 'Zed'])),                       /* a packet apart: row 4 shows another nick, not marked */
        unit(7, own(8, [5, 'Dan']), { active: false }),    /* dead: its last board is not evidence */
        unit(3, own(8, [6, 'Eve']), { player: false })     /* a Full Map spectator is no player of ours */
    );
    const r = show(10);
    const me = (r.text.match(/<span class="me">\d+\. <bdi>[^<]*<\/bdi>/g) || []).map((t) => t.replace(/<[^>]+>/g, ''));
    check('multibox: the main row and the rows each unit\'s own board marks are "me" (two units)', me.join('|') === '2. Bob|3. Tom|5. Cat', me.join('|'));
    check('multibox: a row with player 2\'s profile nick and no evidence is not marked', r.text.indexOf('<span class="me">8. <bdi>P2') === -1);
    check('multibox: a dead unit, a spectator and a rank showing another nick are not marked', r.text.indexOf('"me">4.') === -1 && r.text.indexOf('"me">6.') === -1 && r.text.indexOf('"me">7.') === -1);
    check('multibox: playerPositionMulti = the first unit row (0-based)', r.o.playerPositionMulti === 1, r.o.playerPositionMulti);
    /* only 1 row shown: every own row past it is listed below, in rank order */
    const cut1 = show(1);
    const tail = (cut1.text.match(/<span class="me">\d+\. <bdi>[^<]*<\/bdi>/g) || []).map((t) => t.replace(/<[^>]+>/g, ''));
    check('multibox: own rows past the shown limit are listed once each, in rank order', tail.join('|') === '2. Bob|3. Tom|5. Cat', tail.join('|'));
    g.spects.length = 0;
    const none = show(10);
    check('multibox, no unit board marks a row: only the main row', (none.text.match(/class="me"/g) || []).length === 1 && none.o.playerPositionMulti === null);
    g.LM.multiBoxPlayerExists = false;
}

console.log(fail ? fail + ' check(s) failed' : 'all leaderboard bot checks passed');
process.exit(fail ? 1 : 0);
