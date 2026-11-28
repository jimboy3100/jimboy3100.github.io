/* Discover features checks: runs ogario/modules/discovery.js in a vm without a document (only the
 * pure parts are defined) and checks the cards and the stored state.
 * node developers/tests/discovery.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'modules', 'discovery.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const ctx = { JSON, Math, String, Array, Object, Number };
ctx.window = ctx;
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);
const api = ctx.LMDiscovery;
/* a text of the packs in English and in Greek (both present, not the key) */
const P = 'modules.discovery.';
const inPacks = k => ctx.LMi18n.has(P + k, 'en') && i18n.t(P + k, null, 'el') !== P + k;
check('LMDiscovery defined without a document', !!(api && api.core));
check('no window functions without a document', typeof api.open === 'undefined');
const C = api.core;

/* loading twice keeps the first object */
vm.runInContext(src, ctx);
check('guarded against loading twice', ctx.LMDiscovery === api);

/* the "What works on this server" table window is removed with its server types and rows */
check('no server table', C.SERVER_TYPES === undefined && C.CAPS === undefined && C.capsFor === undefined && C.serverTypeOf === undefined);
check('no server table texts', !ctx.LMi18n.has(P + 'cap.replays', 'en') && !ctx.LMi18n.has(P + 'tabServer', 'en') && !ctx.LMi18n.has('modules.commandcentre.serverCaps', 'en'));
check('no server tab or table code', !/renderServer|lm-dc-caps|lm-dc-type|openServer|data-tab/.test(src));

/* 4. stored state */
{
  const e = C.parseStore(null);
  check('empty store', e.v === '' && e.seen.length === 0 && e.had === false);
  check('broken JSON', C.parseStore('{x').had === false && C.parseStore('[1]').had === false && C.parseStore('null').had === false);
  check('too long', C.parseStore('x'.repeat(30000)).had === false);
  const p = C.parseStore(JSON.stringify({ v: 'x'.repeat(100), seen: ['a', 'a', 'b c', '<b>', 5, 'ok_1'], off: 'yes' }));
  check('validated', p.had && p.v.length === 40 && JSON.stringify(p.seen) === '["a","ok_1"]');
  const big = C.parseStore(JSON.stringify({ v: '1', seen: Array.from({ length: 300 }, (_, i) => 'c' + i), off: true }));
  check('seen capped', big.seen.length === C.MAX_SEEN);
  const round = C.parseStore(C.serializeStore({ v: '3.574', seen: ['analytics'], off: true }));
  check('round trip', round.v === '3.574' && round.seen[0] === 'analytics' && round.had);
  /* the old "Show after updates" switch is dropped from the store: the window never opens by itself */
  check('old auto-open switch dropped', !('off' in round) && JSON.parse(C.serializeStore({ v: '1', seen: [], off: true })).off === undefined);
}

/* 5. NEW cards (the window no longer opens by itself after an update) */
{
  const ids = C.CARDS.map(c => c.id);
  check('unseen ids', JSON.stringify(C.unseenIds({ v: '3.570', seen: ids.slice(1), had: true }, ids)) === JSON.stringify([ids[0]]));
  check('no auto-open logic left', C.shouldAutoOpen === undefined && C.firstState === undefined);
}

/* 6. cards */
{
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  const i = v4.indexOf('var defaultmapsettings = {');
  const dms = v4.slice(i, i + 200000);
  check('card ids unique and valid', new Set(C.CARDS.map(c => c.id)).size === C.CARDS.length && C.CARDS.every(c => /^[A-Za-z0-9_-]{1,40}$/.test(c.id)));
  check('every card has a name and text in the packs (en + el)', C.CARDS.every(c => inPacks('card.' + c.id) && inPacks('card.' + c.id + '.desc')));
  check('core text helper', C.t('title') === i18n.t(P + 'title') && C.t('title') === 'Discover features');
  let missing = [];
  C.CARDS.forEach(c => c.opts.forEach(k => { if (!new RegExp('\\n\\s+' + k + ': (true|false),').test(dms)) missing.push(k); }));
  check('every card option is a boolean in defaultmapsettings' + (missing.length ? ' (missing ' + missing.join(', ') + ')' : ''), missing.length === 0);
  check('show keys are card options', C.CARDS.every(c => !c.show || Object.keys(c.show).every(k => c.opts.includes(k))));
  check('every card can do something', C.CARDS.every(c => c.opts.length || c.win));
  ['hudHelpers', 'replayStudio', 'analytics', 'deathRecap', 'gamepad', 'notifications', 'hudEditor', 'director', 'touchEditor']
    .forEach(id => check('card ' + id, C.CARDS.some(c => c.id === id)));
  /* features removed since have no card (Performance mode, settings profiles, stream companion, custom macros) */
  check('no card of a removed feature', !['adaptivePerf', 'profiles', 'companion', 'macroEditor'].some(id => C.CARDS.some(c => c.id === id)));
  /* openers follow the window objects */
  const card = id => C.CARDS.find(c => c.id === id);
  check('opener unavailable without its module', !card('director').win.avail());
  let opened = 0;
  ctx.LMDirector = { open: () => { opened++; } };
  check('opener available with it', card('director').win.avail());
  card('director').win.run();
  check('opener runs it', opened === 1);
  let rsArg = null;
  ctx.lmReplayStudio = (a, b) => { rsArg = b ? a + ':' + b : a; };
  card('replayStudio').win.run();
  check('Replay Studio opened through lmReplayStudio("open")', rsArg === 'open');
  card('analytics').win.run();
  check('game stats: the Replays window at its Dashboard (lmReplayStudio("view", "dash"))', rsArg === 'view:dash');
}

/* 7. wiring: loader; no card or entry of the deleted Command Centre */
{
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  check('loaded from ogario.v4.js', /ogario\/modules\/discovery\.js\?v=' \+ \(window\.OgVer/.test(v4));
  check('no Command Centre card', !C.CARDS.some(c => c.id === 'commandCentre'));
  check('the Command Centre module is gone', !fs.existsSync(path.join(root, 'ogario', 'modules', 'commandcentre.js')));
  const lx = fs.readFileSync(path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8');
  check("What's new toast: no Discover link", !/lm-dc-toast-link|lmx\.ex\.discoverFeatures/.test(lx) && !/lm-dc-toast-link/.test(src));
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

/* new cards and versioned "seen" */
{
  const card = id => C.CARDS.find(c => c.id === id);
  ['practice', 'themeWorkshop', 'accessibility', 'plugins'].forEach(id => check('new card ' + id, !!card(id)));
  /* the Lab experiments are in the User Scripts window: one card for both */
  check('no Lab card of its own', !card('lab'));
  let arg = null;
  ctx.lmPractice = a => { arg = a; };
  card('practice').win.run();
  check('Practice opened through lmPractice("open")', arg === 'open');
  let tw = 0;
  ctx.LMThemeWorkshop = { open: () => { tw++; } };
  card('themeWorkshop').win.run();
  check('Theme workshop opened', tw === 1);
  arg = null;
  ctx.LMPlugins = { open: a => { arg = a; } };
  card('plugins').win.run();
  check('User Scripts opened on the plugins view', arg === 'plugins');
  check('Accessibility switches', card('accessibility').opts.join() === 'reducedMotion');

  /* seen keys: unchanged cards keep their id (old stores still count), a changed card is NEW again */
  check('seenKey: plain id without cv', C.seenKey({ id: 'analytics' }) === 'analytics' && C.seenKey({ id: 'analytics', cv: 1 }) === 'analytics');
  check('seenKey: version suffix, valid stored id', C.seenKey({ id: 'analytics', cv: 2 }) === 'analytics-v2' && C.parseStore(JSON.stringify({ seen: ['analytics-v2'] })).seen[0] === 'analytics-v2');
  const old = C.parseStore(JSON.stringify({ v: '3.580', seen: ['gamepad', 'analytics', 'companion'] }));
  const cards = [{ id: 'gamepad' }, { id: 'analytics', cv: 2 }, { id: 'companion' }, { id: 'practice' }];
  const unseen = C.unseenIds(old, cards.map(C.seenKey));
  check('changed and new cards only are NEW', unseen.join() === 'analytics-v2,practice');
  C.markSeen(old, cards);
  check('markSeen: old version replaced, nothing else lost', old.seen.indexOf('analytics') < 0 && ['gamepad', 'analytics-v2', 'companion', 'practice'].every(k => old.seen.includes(k)) && old.seen.length === 4);
  check('after marking: nothing NEW', C.unseenIds(old, cards.map(C.seenKey)).length === 0);
  check('markSeen keeps ids of other cards with a common prefix', C.markSeen({ seen: ['labX', 'lab'] }, [{ id: 'lab', cv: 2 }]).seen.join() === 'labX,lab-v2');
  const rt = C.parseStore(C.serializeStore(old));
  check('versioned keys survive a round trip', rt.seen.includes('analytics-v2'));

}

/* its one entry: the "Discover features" button in the footer of the Mod Info window (the real
 * extras/legendhelper.js, the 'i' of the menu's quick bar); no HUD button, no panel of its own */
{
  const helper = fs.readFileSync(path.join(root, 'extras', 'legendhelper.js'), 'utf8');
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  check("the menu's 'i' opens the Mod Info window", /id="ModInfoQuick"[^>]*onclick="openhelper\(\);return false;"/.test(v4) && /extras\/legendhelper\.js/.test(v4));
  check('Mod Info footer has the entry, with the guide\'s own title text and the footer\'s button style',
    /id="DiscoverFeaturesBtn" onclick="return openDiscoverFromHelper\(event\);" class="btn btn-primary" style="margin-left:10px;">' \+ _lmHTx\('modules\.discovery\.title'\)/.test(helper));
  /* every place that opens it: only that entry (scripts call LMDiscovery.open themselves) */
  const openers = [];
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).forEach(e => {
    const p = d + '/' + e.name;
    if (e.isDirectory()) { if (!/^(node_modules|\.git)$/.test(e.name)) walk(p); }
    else if (/\.(js|html)$/.test(e.name) && /LMDiscovery\.open\b/.test(fs.readFileSync(path.join(root, p), 'utf8'))) openers.push(p);
  });
  ['ogario', 'LMexpress', 'LMmobile', 'extras', 'languages'].forEach(walk);
  check('one entry only (no HUD button, no other menu entry)' + (openers.length !== 2 ? ' (' + openers.join(', ') + ')' : ''),
    openers.sort().join() === 'extras/legendhelper.js,ogario/modules/discovery.js');

  /* the real file in a vm with a small jQuery stand-in */
  const run = withDiscovery => {
    const log = { html: '', removed: [], restored: 0, hidden: 0, opened: 0, order: [] };
    const $ = sel => {
      const o = {
        append: h => { if (sel === 'body') log.html += h; return o; },
        remove: () => { log.removed.push(sel); log.order.push('close'); return o; },
        stop: () => o, show: () => o, hide: () => o, html: () => o, attr: () => o, click: () => o
      };
      return o;
    };
    const hc = { $, JSON, String, lmT: k => k === 'modules.discovery.title' ? 'Discover features' : k,
      lmMenuPanelsHide: () => { log.hidden++; }, lmMenuPanelsRestore: () => { log.restored++; } };
    hc.window = hc;
    if (withDiscovery) hc.LMDiscovery = { open: () => { log.opened++; log.order.push('open'); } };
    vm.createContext(hc);
    vm.runInContext(helper, hc);
    return { hc, log };
  };
  const a = run(true);
  check('the window shows the entry when the guide is loaded', /<button type="button" id="DiscoverFeaturesBtn"[^>]*><span data-i18n="modules\.discovery\.title">Discover features<\/span><\/button>/.test(a.log.html) && a.log.hidden === 1);
  let prevented = 0;
  const ev = { preventDefault: () => { prevented++; }, stopPropagation: () => { }, stopImmediatePropagation: () => { } };
  const r = vm.runInContext('openDiscoverFromHelper', a.hc)(ev);
  check('the entry opens the guide once', a.log.opened === 1 && r === false && prevented === 1);
  check('the Mod Info window closes first and the menu comes back under the guide',
    a.log.order.join() === 'close,open' && a.log.removed[0] === '#legendhelper' && a.log.restored === 1);
  const b = run(false);
  check('no entry without the guide (no button that does nothing)', b.log.html.indexOf('DiscoverFeaturesBtn') < 0 && b.log.html.indexOf('TemplatesBtn') > 0);
}

/* no card points at a missing feature: each card's window function is defined in the mod's code,
 * each switch is a menu option (addOptions), and the English texts name no removed feature */
{
  const files = [];
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).forEach(e => {
    const p = d + '/' + e.name;
    if (e.isDirectory()) walk(p);
    else if (/\.js$/.test(e.name) && p !== 'ogario/modules/discovery.js') files.push(fs.readFileSync(path.join(root, p), 'utf8'));
  });
  ['ogario', 'LMexpress', 'LMmobile'].forEach(walk);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const defined = p => {
    const parts = p.split('.'), top = parts[0], name = parts[parts.length - 1];
    const def = new RegExp('(window|W|root)\\.' + esc(top) + '\\s*=');
    return files.some(s => def.test(s) && (parts.length === 1 || new RegExp('(\\b' + esc(name) + '\\s*:|\\.' + esc(name) + '\\s*=)').test(s)));
  };
  const wins = C.CARDS.filter(c => c.win);
  const bad = wins.filter(c => typeof c.win.path !== 'string' || !defined(c.win.path)).map(c => c.id);
  check('every card window is defined in the code' + (bad.length ? ' (missing ' + bad.join(', ') + ')' : ''), wins.length >= 10 && bad.length === 0);
  const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
  const menuOpts = new Set();
  (v4.match(/this\.addOptions\(\[[^\]]*\]/g) || []).forEach(m => (m.match(/"([A-Za-z0-9_]+)"/g) || []).forEach(k => menuOpts.add(k.slice(1, -1))));
  const noBox = [];
  C.CARDS.forEach(c => c.opts.forEach(k => { if (!menuOpts.has(k)) noBox.push(k); }));
  check('every card switch is a settings menu checkbox' + (noBox.length ? ' (missing ' + noBox.join(', ') + ')' : ''), noBox.length === 0);
  const removed = /command cent|catalog|profile|performance mode|stream companion|macro|merge countdown|cell (mass )?panel|share/i;
  const named = C.CARDS.filter(c => removed.test(i18n.t(P + 'card.' + c.id + '.desc')) || removed.test(i18n.t(P + 'card.' + c.id))).map(c => c.id);
  check('no card text names a removed feature' + (named.length ? ' (' + named.join(', ') + ')' : ''), named.length === 0);
  check('no card of the removed Command Centre, profile search, settings profiles or Performance mode',
    !C.CARDS.some(c => /command|centre|profile|search|perf/i.test(c.id + ' ' + (c.win && c.win.path || ''))));
}

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
