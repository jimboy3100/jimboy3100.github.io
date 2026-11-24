/* Discover features / What works on this server checks: runs ogario/modules/discovery.js in a vm
 * without a document (only the pure parts are defined) and checks the tables and the stored state.
 * node developers/tests/discovery.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'modules', 'discovery.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const ctx = { JSON, Math, String, Array, Object, Number };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const api = ctx.LMDiscovery;
check('LMDiscovery defined without a document', !!(api && api.core));
check('no window functions without a document', typeof api.open === 'undefined');
const C = api.core;

/* loading twice keeps the first object */
vm.runInContext(src, ctx);
check('guarded against loading twice', ctx.LMDiscovery === api);

/* 1. server types */
{
  const ids = C.SERVER_TYPES.map(s => s.id);
  check('nine server types', ids.length === 9 && new Set(ids).size === 9);
  ['agario', 'expandingland', 'senpa', 'garix', 'sigmally', 'imsolo', 'agar2', 'deltio', 'private'].forEach(t => check('type ' + t, ids.includes(t)));
  /* every type the client sets in connect() is in the table */
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  const i = v4.indexOf('var _earlyType = ');
  const block = v4.slice(i, i + 1600);
  const found = new Set((block.match(/\? '([a-z0-9]+)'|: '([a-z0-9]+)';/g) || []).map(m => m.replace(/[^a-z0-9]/g, '')));
  check('connect() types found', found.size >= 9);
  check('every connect() type is listed', [...found].every(t => ids.includes(t)));
}

/* 2. serverTypeOf */
check('no connection', C.serverTypeOf(null) === '' && C.serverTypeOf(undefined) === '');
check('agario', C.serverTypeOf({ serverType: 'agario' }) === 'agario');
check('LegendWorld counts as Expanding Land', C.serverTypeOf({ serverType: 'agario', isLegendWorld: true }) === 'expandingland');
check('unknown type', C.serverTypeOf({ serverType: '<b>x' }) === '' && C.serverTypeOf({ serverType: 5 }) === '');

/* 3. capability rows */
{
  const ok = C.CAPS.every(r => typeof r.id === 'string' && typeof r.en === 'string' && r.en && typeof r.el === 'string' &&
    Object.keys(r.v).every(k => C.SERVER_TYPES.some(s => s.id === k) && /^[ypun]$/.test(r.v[k])));
  check('rows well formed (known types, y/p/u/n, en + el)', ok);
  check('row ids unique', new Set(C.CAPS.map(r => r.id)).size === C.CAPS.length);
  const row = id => C.CAPS.find(r => r.id === id);
  check('merge countdown only on agar.io', C.SERVER_TYPES.every(s => C.capValue(row('mergeCountdown'), s.id) === (s.id === 'agario' ? 'y' : 'n')));
  check('World Spectate only on Expanding Land', C.capValue(row('worldSpectate'), 'expandingland') === 'y' && C.capValue(row('worldSpectate'), 'agario') === 'n');
  check('replays not on Senpa / Sigmally', C.capValue(row('replays'), 'senpa') === 'n' && C.capValue(row('replays'), 'sigmally') === 'n' && C.capValue(row('replays'), 'imsolo') === 'y');
  check('login on agar.io and Expanding Land only', C.SERVER_TYPES.every(s => (C.capValue(row('login'), s.id) === 'y') === (s.id === 'agario' || s.id === 'expandingland')));
  check('unlisted type counts as no', C.capValue(row('rooms'), 'senpa') === 'n' && C.capValue(null, 'agario') === 'n');
  check('note only for partly', C.capNote(row('serverChat'), 'expandingland', 'en').length > 0 && C.capNote(row('serverChat'), 'garix', 'en') === '');
  check('wildcard note', C.capNote(row('splitMacros'), 'agario', 'en') === C.capNote(row('splitMacros'), 'deltio', 'en') && C.capNote(row('splitMacros'), 'agario', 'en') !== '');
  check('Greek note', C.capNote(row('serverChat'), 'expandingland', 'el') !== C.capNote(row('serverChat'), 'expandingland', 'en'));
  const list = C.capsFor('expandingland', 'en');
  const order = { y: 0, p: 1, u: 2, n: 3 };
  check('capsFor lists every row', list.length === C.CAPS.length);
  check('capsFor sorted works / partly / unverified / no', list.every((r, i) => i === 0 || order[list[i - 1].v] <= order[r.v]));
  check('capsFor Greek labels', C.capsFor('agario', 'el')[0].label !== C.capsFor('agario', 'en')[0].label);
}

/* 4. stored state */
{
  const e = C.parseStore(null);
  check('empty store', e.v === '' && e.seen.length === 0 && e.off === false && e.had === false);
  check('broken JSON', C.parseStore('{x').had === false && C.parseStore('[1]').had === false && C.parseStore('null').had === false);
  check('too long', C.parseStore('x'.repeat(30000)).had === false);
  const p = C.parseStore(JSON.stringify({ v: 'x'.repeat(100), seen: ['a', 'a', 'b c', '<b>', 5, 'ok_1'], off: 'yes' }));
  check('validated', p.had && p.v.length === 40 && JSON.stringify(p.seen) === '["a","ok_1"]' && p.off === false);
  const big = C.parseStore(JSON.stringify({ v: '1', seen: Array.from({ length: 300 }, (_, i) => 'c' + i), off: true }));
  check('seen capped', big.seen.length === C.MAX_SEEN && big.off === true);
  const round = C.parseStore(C.serializeStore({ v: '3.574', seen: ['analytics'], off: true }));
  check('round trip', round.v === '3.574' && round.seen[0] === 'analytics' && round.off === true && round.had);
}

/* 5. auto open once after an update */
{
  const ids = C.CARDS.map(c => c.id);
  const st = (o) => Object.assign({ v: '3.570', seen: [], off: false, had: true }, o);
  check('first visit: never', !C.shouldAutoOpen(C.parseStore(null), '3.574', ids));
  check('same version: no', !C.shouldAutoOpen(st({ v: '3.574' }), '3.574', ids));
  check('update with unseen cards: yes', C.shouldAutoOpen(st(), '3.574', ids));
  check('turned off: no', !C.shouldAutoOpen(st({ off: true }), '3.574', ids));
  check('all seen: no', !C.shouldAutoOpen(st({ seen: ids.slice() }), '3.574', ids));
  check('no version: no', !C.shouldAutoOpen(st(), '', ids));
  const none = C.parseStore(null);
  check('returning player (older NEW badges seen) after an update', C.shouldAutoOpen(C.firstState(none, '3.560', '3.574'), '3.574', ids));
  check('NEW badges of this version: first visit', !C.firstState(none, '3.574', '3.574').had);
  check('no NEW badges: first visit', !C.firstState(none, null, '3.574').had && !C.firstState(none, '', '3.574').had);
  check('stored guide state wins', C.firstState(st({ v: '3.574' }), '3.1', '3.574').v === '3.574');
  check('unseen ids', JSON.stringify(C.unseenIds(st({ seen: ids.slice(1) }), ids)) === JSON.stringify([ids[0]]));
}

/* 6. cards */
{
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  const i = v4.indexOf('var defaultmapsettings = {');
  const dms = v4.slice(i, i + 200000);
  check('card ids unique and valid', new Set(C.CARDS.map(c => c.id)).size === C.CARDS.length && C.CARDS.every(c => /^[A-Za-z0-9_-]{1,40}$/.test(c.id)));
  check('every card has en + el name and text', C.CARDS.every(c => c.en && c.el && c.d && c.d.en && c.d.el));
  let missing = [];
  C.CARDS.forEach(c => c.opts.forEach(k => { if (!new RegExp('\\n\\s+' + k + ': (true|false),').test(dms)) missing.push(k); }));
  check('every card option is a boolean in defaultmapsettings' + (missing.length ? ' (missing ' + missing.join(', ') + ')' : ''), missing.length === 0);
  check('show keys are card options', C.CARDS.every(c => !c.show || Object.keys(c.show).every(k => c.opts.includes(k))));
  check('every card can do something', C.CARDS.every(c => c.opts.length || c.win));
  ['commandCentre', 'hudHelpers', 'replayStudio', 'analytics', 'deathRecap', 'adaptivePerf', 'gamepad', 'profiles', 'notifications', 'hudEditor', 'director', 'companion', 'touchEditor']
    .forEach(id => check('card ' + id, C.CARDS.some(c => c.id === id)));
  /* openers follow the window objects */
  const card = id => C.CARDS.find(c => c.id === id);
  check('opener unavailable without its module', !card('analytics').win.avail());
  let opened = 0;
  ctx.LMAnalytics = { open: () => { opened++; } };
  check('opener available with it', card('analytics').win.avail());
  card('analytics').win.run();
  check('opener runs it', opened === 1);
  let rsArg = null;
  ctx.lmReplayStudio = a => { rsArg = a; };
  card('replayStudio').win.run();
  check('Replay Studio opened through lmReplayStudio("open")', rsArg === 'open');
}

/* 7. wiring: loader, Command Centre entries, toast link */
{
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  check('loaded from ogario.v4.js', /ogario\/modules\/discovery\.js\?v=' \+ \(window\.OgVer/.test(v4));
  const cc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'commandcentre.js'), 'utf8');
  check('Command Centre lists Discover features', /id: 'discover'/.test(cc) && /W\.LMDiscovery\.open\(\)/.test(cc));
  check('Command Centre lists What works on this server', /id: 'serverCaps'/.test(cc) && /W\.LMDiscovery\.openServer\(\)/.test(cc));
  check('Command Centre reveal API', /api\.reveal = function/.test(cc));
  const lx = fs.readFileSync(path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8');
  check("What's new toast links the guide", /lm-dc-toast-link/.test(lx));
}

/* a switch that cannot be changed (disabled / read-only) is refused when toggled (audit A9) */
{
  check('toggleBox exported', typeof C.toggleBox === 'function');
  if (typeof C.toggleBox === 'function') {
    const calls = [];
    ctx.application = { setSettings(k, v) { calls.push([k, v]); } };
    const dis = { id: 'universalChat', checked: false, disabled: true, getAttribute: () => null, closest: () => null };
    check('disabled switch refused', C.toggleBox(dis) === null && dis.checked === false && calls.length === 0);
    const ok = { id: 'showGrid', checked: false, disabled: false, getAttribute: () => null, closest: () => null };
    check('enabled switch toggles', C.toggleBox(ok) === true && ok.checked && calls.length === 1);
  }
}

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
