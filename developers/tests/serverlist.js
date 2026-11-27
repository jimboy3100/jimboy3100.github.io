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
/* lmT with the English texts of the language packs (developers/i18n/src), as on the page */
const lmEn = {};
fs.readdirSync(path.join(__dirname, '..', 'i18n', 'src')).forEach((f) => { const a = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'i18n', 'src', f), 'utf8')); Object.keys(a).forEach((k) => { lmEn[k] = a[k].en; }); });
const lmT = (k, v) => (k in lmEn ? String(lmEn[k]).replace(/{([A-Za-z0-9_]+)}/g, (m, n) => (v != null && typeof v !== 'object' ? (n === '0' ? String(v) : m) : (v && v[n] != null ? String(v[n]) : m))) : k);
const ctx = { TextDecoder, lmT };
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
/* The finder row is the list and the Scan button only (no status line under it): sbEnsureUI,
 * sbRender and sbCheckJoin run on small fakes. Scanning shows on the button (Stop, red, stop
 * icon); a failed scan is in the button's tooltip and a failed join is a toast. */
{
    const made = [], toasts = [];
    const el = (id) => ({ id, style: {}, className: '', title: '', textContent: '', disabled: false, options: [], children: [], _ls: {},
        addEventListener(t, f) { this._ls[t] = f; }, appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
        insertBefore(c) { return this.appendChild(c); }, removeChild(c) { this.children = this.children.filter(x => x !== c); return c; } });
    const info = el('server-info');
    const parts = { '#lm-server-list': el('lm-server-list'), '#lm-server-scan': el('lm-server-scan') };
    const span = el(''), icon = el('');
    parts['#lm-server-scan'].querySelector = (q) => (q === 'span' ? span : q === 'i' ? icon : null);
    const doc = {
        head: el('head'), documentElement: el('html'), activeElement: null,
        getElementById: (id) => (id === 'server-info' ? info : id === 'lm-server-list-row' ? made.find(r => r.parentNode === info) || null : null),
        createElement: (t) => { const r = el(''); r.tagName = t; if (t === 'div') made.push(r); r.querySelector = (q) => parts[q] || null; return r; }
    };
    const rctx = { document: doc, window: { toastr: { warning: (m) => toasts.push(m) } }, toastr: null, lmT, JSON, Date, Array, String,
        _lmTH: (k) => lmEn[k] || k, _lmG2Tag: () => '[Servers] ',
        SB: { joinTimeoutMs: 15000 }, SB_MODE_LABELS: { ':ffa': 'FFA' },
        sbScan: { running: false, key: 'eu|ffa', error: '' }, sbJoin: null, sbLastSignature: '',
        sbBuildItems: () => [{ value: 'h1', text: '★ London 3 · 19 players · You are here', title: '', current: true }],
        sbRegionLabel: () => 'London', sbStartScan() {}, sbCancelScan() {}, sbRequestJoin() {}, sbRefreshCounts() {} };
    rctx.toastr = rctx.window.toastr;
    vm.createContext(rctx);
    vm.runInContext(['sbEscHtml', 'sbWarn', 'sbInstallStyles', 'sbEnsureUI', 'sbFillOption', 'sbRender', 'sbCheckJoin'].map(grab).join('\n'), rctx);
    const live = { key: 'eu|ffa', region: 'eu', mode: ':ffa', visible: true, scannable: true, connected: true, alive: false };
    rctx.sbRender(live);
    const row = made[0];
    const btn = parts['#lm-server-scan'];
    check('row: list and Scan button, no status line', row && /id="lm-server-list"/.test(row.innerHTML) && /id="lm-server-scan"/.test(row.innerHTML) && !/lm-server-status/.test(row.innerHTML + doc.head.children.map(c => c.textContent).join('')));
    check('idle: Scan, search icon, no counts-refresh text anywhere', span.textContent === lmEn['game2.sbScan'] && icon.className === 'fa fa-search' && btn.className === 'btn btn-primary' && !/refresh/i.test(row.innerHTML + btn.title));
    rctx.sbScan.running = true;
    rctx.sbRender(live);
    check('scanning: the button is Stop, red, stop icon', span.textContent === lmEn['game2.sbStop'] && btn.className === 'btn btn-danger' && icon.className === 'fa fa-stop' && btn.title === lmEn['game2.sbStopTip']);
    rctx.sbScan.running = false; rctx.sbScan.error = lmEn['game2.sbNoAnswer'];
    rctx.sbRender(live);
    check('a failed scan: the reason in the button tooltip', btn.title.split('\n').pop() === lmEn['game2.sbNoAnswer'] && span.textContent === lmEn['game2.sbScan']);
    rctx.sbJoin = { host: 'h2', key: 'eu|ffa', alias: 'London 5', startedAt: Date.now() - 20000 };
    vm.runInContext('sbCheckJoin({ key: "eu|ffa", currentHost: "h1", connected: true })', rctx);
    check('a join that timed out: a toast names the server', toasts.length === 1 && toasts[0].indexOf('London 5') > 0 && rctx.sbJoin === null);
}
console.log(failed ? failed + ' check(s) failed' : 'all server list checks passed');
process.exit(failed ? 1 : 0);
