/* Servers window checks: favourite validation, label clean-up, filtering, sorting, server tokens
 * and links, history rows and the "favourite is back" transitions of ogario/modules/servermanager.js.
 * node developers/tests/servermanager.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const mod = fs.readFileSync(path.join(root, 'ogario', 'modules', 'servermanager.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };

const ctx = { console, JSON, Math, Date, Object, Array, Number, String, Map, isFinite, encodeURIComponent, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
vm.createContext(ctx);
/* the client's own token packing (toLong, ranges, awsRegions) */
vm.runInContext(cut('const ranges = [', 'function changeregion()'), ctx);
vm.runInContext(mod, ctx);
const C = ctx.LMServerManager && ctx.LMServerManager.core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C) { console.log('FAIL LMServerManager.core missing'); process.exit(1); }
const J = v => JSON.stringify(v);
const ch = n => String.fromCharCode(n);
/* the client's lexical globals (const) are not properties of the context object */
const G = name => vm.runInContext(name, ctx);

// ── labels
check('label: trimmed, inner spaces collapsed', C.sanitizeLabel('  My   arena ') === 'My arena');
check('label: control, zero-width and direction characters removed',
  C.sanitizeLabel('a' + ch(0) + 'b' + ch(0x200b) + 'c' + ch(0x202e) + 'd' + ch(0x2028) + 'e' + ch(0xfeff)) === 'a b c d e');
check('label: angle brackets removed', C.sanitizeLabel('<img src=x onerror=alert(1)>') === 'img src=x onerror=alert(1)');
check('label: at most 32 characters', C.sanitizeLabel('x'.repeat(80)).length === 32);
check('label: emoji are not cut in half', C.sanitizeLabel('😀'.repeat(40)) === '😀'.repeat(32));
check('label: objects, functions and null give an empty label', C.sanitizeLabel({ a: 1 }) === '' && C.sanitizeLabel(null) === '' && C.sanitizeLabel(function () { }) === '');
check('label: numbers become text', C.sanitizeLabel(42) === '42');

// ── favourites
const arena = C.cleanFav({ type: 'arena', ws: 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu-central-1/1-2-3-4', gm: ':ffa', rg: 'EU-London', label: ' Main ', name: 'London 3', added: 5, last: 7, id: 'forged', extra: 1 });
check('arena: kept, id worked out from the address (not read)', arena && arena.id === 'a:web-arenas-live-v25-0.agario.miniclippt.com/eu-central-1/1-2-3-4');
check('arena: label cleaned, unknown keys dropped', arena && arena.label === 'Main' && !('extra' in arena) && arena.gm === ':ffa' && arena.rg === 'EU-London');
check('a server address that is not agar.io becomes a token server', C.cleanFav({ type: 'arena', ws: 'wss://ffa.legendmod.ml:8080' }).type === 'server');
check('bad addresses dropped', [
  'javascript:alert(1)', 'https://x.com', 'wss://', 'wss://a b.com', 'wss://x.com/"><script>', 'wss://imsolo.pro.replay:2000',
  'wss://api.legendmod.ml/el-room/ABCDEF?t=1', 'wss://' + 'a'.repeat(400), 42, null
].every(ws => C.cleanFav({ type: 'arena', ws: ws }) === null));
check('bad mode and region become empty', (f => f.gm === '' && f.rg === '')(C.cleanFav({ type: 'arena', ws: 'wss://x.agar.io', gm: 'ffa;drop', rg: '<b>' })));
const priv = C.cleanFav({ type: 'private', gm: 10022, name: 'Delta EU FFA' });
check('private: number value kept as text, region Private', priv && priv.gm === '10022' && priv.rg === 'Private' && priv.id === 'p:10022');
check('private: Expanding Land values become type el', C.cleanFav({ type: 'private', gm: '5001' }).type === 'el' && C.cleanFav({ type: 'el', gm: '5002' }).id === 'p:5002');
check('private: bad values and the room picker (5003) dropped', C.cleanFav({ type: 'private', gm: 'abc' }) === null && C.cleanFav({ type: 'private', gm: '5003' }) === null && C.cleanFav({ type: 'private', gm: '1234567' }) === null);
const room = C.cleanFav({ type: 'room', code: ' abc234 ' });
check('room: code upper-cased and checked', room && room.code === 'ABC234' && room.id === 'r:ABC234');
check('room: codes with I, O, 0, 1 or the wrong length dropped', C.cleanFav({ type: 'room', code: 'ABCDE1' }) === null && C.cleanFav({ type: 'room', code: 'ABC' }) === null);
check('unknown type, arrays and text dropped', C.cleanFav({ type: 'evil', ws: 'wss://x.com' }) === null && C.cleanFav([1]) === null && C.cleanFav('x') === null);
check('times: negative, NaN and absurd times become 0', (f => f.added === 0 && f.last === 0)(C.cleanFav({ type: 'room', code: 'ABCDEF', added: -1, last: 1e20 })));

const st = C.cleanStore({ v: 9, notify: 'yes', favs: [
  { type: 'arena', ws: 'wss://x.agar.io:443/' }, { type: 'arena', ws: 'wss://X.agar.io' }, { type: 'room', code: 'ZZZZZZ' }, null, 'x', { type: 'private', gm: 'no' }
], other: 1 });
check('store: duplicates (same server spelled twice) and broken entries dropped', st.favs.length === 2 && st.favs[0].id === 'a:x.agar.io');
check('store: notify only when true, unknown keys dropped', st.notify === false && J(Object.keys(st)) === J(['v', 'favs', 'notify']));
check('store: notify true kept', C.cleanStore({ notify: true }).notify === true);
check('store: nonsense gives an empty store', J(C.cleanStore('x')) === J({ v: 1, favs: [], notify: false }) && J(C.cleanStore([1, 2])) === J({ v: 1, favs: [], notify: false }));
const many = []; for (let i = 0; i < 150; i++) many.push({ type: 'arena', ws: 'wss://s' + i + '.agar.io' });
check('store: at most ' + C.MAX_FAVS + ' favourites', C.cleanStore({ favs: many }).favs.length === C.MAX_FAVS);
check('store: a stored and read again favourite is unchanged', J(C.cleanStore(JSON.parse(J(st))).favs) === J(st.favs));

// ── filter and sort
const rows = [
  { id: 'a:1', type: 'arena', name: 'London 1', rg: 'EU-London', mode: ':ffa', players: 40, last: 300 },
  { id: 'a:2', type: 'arena', name: 'London 2', rg: 'EU-London', mode: ':teams', players: null, last: 0 },
  { id: 'a:3', type: 'arena', name: 'Frankfurt 1', label: 'Best one', rg: 'EU-Frankfurt', mode: ':ffa', players: 75, last: 100 },
  { id: 'p:10022', type: 'private', name: 'Delta EU FFA', rg: 'Private', mode: ':ffa', players: 3, last: 500 },
  { id: 'p:5001', type: 'el', name: 'Expanding Land FFA', rg: 'Private', mode: ':ffa', players: null, last: 200 },
  { id: 'r:ABCDEF', type: 'room', name: 'Private room ABCDEF', code: 'ABCDEF', rg: 'Private', mode: '', players: null, last: 0 },
  { id: 'a:4', type: 'server', name: 'Own server', ws: 'wss://my.server.net:9000', rg: '', mode: '', players: 75, last: 50 }
];
const ids = r => r.map(x => x.id).join(',');
check('filter: mode', ids(C.filterRows(rows, { mode: ':teams' })) === 'a:2');
check('filter: region', ids(C.filterRows(rows, { region: 'EU-London' })) === 'a:1,a:2');
check('filter: type agar.io / private (token servers too) / Expanding Land (rooms too)',
  ids(C.filterRows(rows, { type: 'arena' })) === 'a:1,a:2,a:3' && ids(C.filterRows(rows, { type: 'private' })) === 'p:10022,a:4' && ids(C.filterRows(rows, { type: 'el' })) === 'p:5001,r:ABCDEF');
check('search: label, name, region and mode words, any order, no case', ids(C.filterRows(rows, { q: 'BEST' })) === 'a:3' && ids(C.filterRows(rows, { q: 'ffa london' })) === 'a:1');
check('search: server address and room code', ids(C.filterRows(rows, { q: 'my.server' })) === 'a:4' && ids(C.filterRows(rows, { q: 'abcdef' })) === 'r:ABCDEF');
check('search + filters together', ids(C.filterRows(rows, { q: 'ffa', type: 'arena', region: 'EU-Frankfurt' })) === 'a:3');
check('no filter: everything', C.filterRows(rows, {}).length === rows.length && C.filterRows(rows).length === rows.length);
check('sort players: most first, ties by name, not counted last', ids(C.sortRows(rows, 'players')) === 'a:3,a:4,a:1,p:10022,p:5001,a:2,r:ABCDEF');
check('sort name: the label counts as the name', ids(C.sortRows(rows, 'name')) === 'a:3,p:10022,p:5001,a:1,a:2,a:4,r:ABCDEF');
check('sort last played: newest first, never played last', ids(C.sortRows(rows, 'last')) === 'p:10022,a:1,p:5001,a:3,a:4,a:2,r:ABCDEF');
check('sort does not change the input', ids(rows) === 'a:1,a:2,a:3,p:10022,p:5001,r:ABCDEF,a:4');

// ── tokens and links
const mini = 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu-central-1/1-2-3-4';
const packed = C.tokenFor(mini, C.packer);
check('token: an arena packs like createServerToken', /^[a-z0-9]{7,}$/.test(packed) && packed === G('toLong')([G('awsRegions').indexOf('eu-central-1'), 1, 2, 3, 4]).toString(36).padStart(7, '0'));
check('token: the packed token opens the same arena again (fromLong)', (() => { const p = G('fromLong')(parseInt(packed, 36)); return G('awsRegions')[p[0]] + '/' + p.slice(1).join('-') === 'eu-central-1/1-2-3-4'; })());
check('token: a region the token cannot hold gives the arena address', C.tokenFor('wss://web-arenas-live-v25-0.agario.miniclippt.com/me-central-1/1-2-3-4', C.packer) === 'wss://web-arenas-live-v25-0.agario.miniclippt.com/me-central-1/1-2-3-4');
check('token: without the packer the arena address', C.tokenFor(mini) === mini);
check('token: another server is its address without the scheme', C.tokenFor('wss://ffa.legendmod.ml:8080') === 'ffa.legendmod.ml:8080' && C.tokenFor('wss://api.legendmod.ml/el-teams') === 'api.legendmod.ml/el-teams');
check('link: the TK&PW format', C.buildLink('abc1234', 'my pass&x', 'EU-London', ':ffa', false) === 'https://agar.io/?sip=abc1234&pass=my%20pass%26x&r=EU-London&m=:ffa');
check('link: the website format', C.buildLink('abc1234', '', 'EU-London', ':teams', true) === 'https://agar.io/play?sip=abc1234&pass=&r=EU-London&m=:teams');
check('link: party without region and mode', C.buildLink('abc1234', 'p', 'EU-London', ':party', false) === 'https://agar.io/?sip=abc1234&pass=p');
check('link: private server', C.buildLink('ffa.legendmod.ml:8080', '', 'Private', '5001', false) === 'https://agar.io/?sip=ffa.legendmod.ml:8080&pass=&r=Private&m=5001');

// ── history rows
const hist = [
  { ws: 'wss://ffa.legendmod.ml:8080', gm: '5001', rg: 'Private', at: 900 },
  { ws: mini + '?party_id=X', gm: ':ffa', rg: 'EU-Frankfurt', at: 800 },
  { ws: mini, gm: ':ffa', rg: 'EU-Frankfurt', at: 700 },
  { ws: 'wss://imsolo.pro.replay:2000', gm: '', rg: 'Private', at: 600 },
  { ws: 'wss://dagestan.ws.imsolo.pro/', gm: '7', rg: 'Private', at: 500 },
  { ws: 'wss://my.server.net:9000', gm: ':ffa', rg: 'EU-London', at: 400 },
  { ws: 'javascript:x', at: 1 }, null
];
const hr = C.historyRows(hist, gm => ({ '5001': '👑 Expanding Land FFA', '7': 'Dagestan' })[gm] || '');
check('history: one row per server (newest kept), replays and bad entries dropped', ids(hr) === 'p:5001,a:' + C.hostKey(mini) + ',p:7,a:my.server.net:9000');
check('history: private picks named from the list, Expanding Land typed', hr[0].type === 'el' && hr[0].name === '👑 Expanding Land FFA' && hr[2].type === 'private' && hr[2].name === 'Dagestan');
check('history: last played time kept', hr[0].last === 900 && hr[1].last === 800);
check('history: a token server keeps its mode, has no agar.io region', hr[3].type === 'server' && hr[3].rg === '' && hr[3].gm === ':ffa');

// ── notification transitions and probe pacing
let r1 = C.notifyTransitions({}, { 'a:1': false, 'a:2': true });
check('notify: a first sighting never notifies', r1.ids.length === 0);
let r2 = C.notifyTransitions(r1.next, { 'a:1': true, 'a:2': true });
check('notify: absent then present notifies once', J(r2.ids) === J(['a:1']));
let r3 = C.notifyTransitions(r2.next, { 'a:1': true, 'a:2': true });
check('notify: still present does not notify again', r3.ids.length === 0);
let r4 = C.notifyTransitions(C.notifyTransitions(r3.next, { 'a:1': false }).next, { 'a:1': true });
check('notify: gone and back notifies again; removed favourites are forgotten', J(r4.ids) === J(['a:1']) && !('a:2' in r4.next));
const now = 1e12;
check('probe: never probed is due', C.probeDue(undefined, now));
check('probe: at most once a minute', !C.probeDue({ at: now - 59000 }, now) && C.probeDue({ at: now - C.PROBE_EVERY_MS }, now));
check('probe: a running probe is not due again', !C.probeDue({ at: 0, active: true }, now));
check('status: ok, failed once, offline after two', C.probeStatus({ at: 1, ok: true }) === 'ok' && C.probeStatus({ at: 1, ok: false, fails: 1 }) === 'fail' && C.probeStatus({ at: 1, ok: false, fails: 2 }) === 'offline' && C.probeStatus(null) === '');

// ── leaderboard counting and private modes
check('bots: a name more than twice is bots', J(C.splitBots(['a', 'b', 'bot', 'bot', 'bot', 'c', 'c'])) === J({ players: 4, bots: 3 }));
check('mode from a private server name', C.modeFromName('Delta EU Party 1') === ':party' && C.modeFromName('Delta Experimental') === ':experimental' && C.modeFromName('Delta EU FFA Arcade') === ':ffa' && C.modeFromName('Dagestan') === '');

// ── wiring in the other files
const hk = fs.readFileSync(path.join(root, 'ogario', 'hotkeysCommand.js'), 'utf8');
check('hotkey hk-serverManager has no default key', /'hk-serverManager': \{[\s\S]{0,300}defaultKey: ''/.test(hk));
const cc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'commandcentre.js'), 'utf8');
check('Command Centre lists the Servers window', /id: 'servers'[^\n]*LMServerManager\.open\(\)/.test(cc));
check('export / import carry lmServerFavs with the gameplay settings', /\['lmPerfBackup'[^\]]*'lmServerFavs'[^\]]*\]\.forEach/.test(main) && /_impSet\('lmServerFavs'/.test(main));
check('loader loads the module', main.indexOf("ogario/modules/servermanager.js?v=") !== -1);
check('private server list is shared with the window', /window\._lmPrivateModOptions = _lmPrivateModOptions;/.test(main) && /var privateModOptions = _lmPrivateModOptions\(\);/.test(main));

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
