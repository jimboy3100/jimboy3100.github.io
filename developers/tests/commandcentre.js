/* Command Centre search, ranking, storage and quick bar placement (pure helpers of
 * ogario/modules/commandcentre.js, loaded in a vm without a document).
 * node developers/tests/commandcentre.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'commandcentre.js'), 'utf8');
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);
const C = ctx.LMCommandCentre && ctx.LMCommandCentre._core;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
if (!C) { console.log('FAIL core helpers not exported'); process.exit(1); }

// normalize / splitKey
check('normalize: case, accents, markup, punctuation', C.normalize('  <b>Show</b> Mini-Map  (Grid) ') === 'show mini map grid');
check('normalize: Greek tonos and final sigma', C.normalize('Εμφάνιση Πλέγματος') === 'εμφανιση πλεγματοσ');
check('splitKey: camelCase words and the raw key', C.splitKey('showMiniMapGrid') === 'show mini map grid showminimapgrid');
check('splitKey: hotkey prefix dropped', C.splitKey('hk-showSplitRange') === 'show split range showsplitrange');
check('splitKey: acronym', C.splitKey('highDPI') === 'high dpi highdpi');

// scoreText ordering
const s = (q, t) => C.scoreText(C.normalize(q), C.normalize(t));
check('exact > prefix', s('grid', 'grid') > s('grid', 'grid color'));
check('prefix > word start', s('grid', 'grid color') > s('grid', 'show grid'));
check('word start > inside a word', s('map', 'show map') > s('map', 'minimap'));
check('inside a word matches', s('map', 'minimap') > 0);
check('all words, any order', s('grid show', 'show grid') >= 400);
check('missing word: no token match', s('grid xyz', 'show grid') < 400);
check('letters in order (fuzzy) match', s('shgr', 'show grid') > 0);
check('fuzzy < substring', s('shgr', 'show grid') < s('grid', 'show grid'));
check('fuzzy prefers word starts', s('smm', 'show mini map') > s('smm', 'summary mismatch'));
check('scattered letters: no match', s('sd', 'show the very long label with d') === 0);
check('no match', s('zzz', 'show grid') === 0);
check('one letter only matches as a substring', s('x', 'show grid') === 0 && s('g', 'show grid') > 0);
check('empty query or text: 0', s('', 'a') === 0 && s('a', '') === 0);

// items and ranking
const items = [
  { id: 'opt:showGrid', kind: 'opt', label: 'Εμφάνιση πλέγματος', en: 'Show grid', key: 'showGrid', section: 'Grid' },
  { id: 'opt:showMiniMapGrid', kind: 'opt', label: 'Show minimap grid', en: 'Show minimap grid', key: 'showMiniMapGrid', section: 'Minimap' },
  { id: 'set:gridColor', kind: 'set', label: 'Grid color', en: 'Grid color', key: 'gridColor', section: 'Theme' },
  { id: 'hk-x', kind: 'hk', label: 'Show / hide grid', en: 'Show / hide grid', key: 'hk-showGrid', section: 'Hotkey' },
  { id: 'set:hudBlur', kind: 'set', label: 'Blur', en: 'Blur', key: 'hudBlur', section: 'HUD' },
  { id: 'win:matchHistory', kind: 'win', label: 'Ιστορικό αγώνων', en: 'Match history', key: 'matchHistory', section: 'Window' },
  { id: 'opt:noColors', kind: 'opt', label: 'No colors', en: 'No colors', key: 'noColors', section: 'Colors' }
];
const ids = r => r.map(x => x.item.id);
const clone = () => items.map(x => Object.assign({}, x));
let r = C.rank(clone(), 'grid', {});
check('rank: only matches', r.length === 4 && !ids(r).includes('opt:noColors'));
check('rank: prefix match first ("Grid color")', r[0].item.id === 'set:gridColor');
r = C.rank(clone(), 'show grid', {});
check('rank: English label found when the label is translated', ids(r)[0] === 'opt:showGrid');
r = C.rank(clone(), 'πλεγμα', {});
check('rank: translated label without accents', ids(r)[0] === 'opt:showGrid');
r = C.rank(clone(), 'showminimap', {});
check('rank: setting key', ids(r)[0] === 'opt:showMiniMapGrid');
r = C.rank(clone(), 'hud blur', {});
check('rank: words over label and section', ids(r)[0] === 'set:hudBlur');
r = C.rank(clone(), 'match', {});
check('rank: window by English label', ids(r)[0] === 'win:matchHistory');
r = C.rank(clone(), 'grid', { fav: ['opt:showMiniMapGrid'] });
check('rank: favourite raised among equals', ids(r).indexOf('opt:showMiniMapGrid') < C.rank(clone(), 'grid', {}).map(x => x.item.id).indexOf('opt:showMiniMapGrid'));
check('rank: favourite does not beat a much better match', ids(r)[0] === 'set:gridColor');
r = C.rank(clone(), '', { fav: ['opt:noColors'], recent: ['set:hudBlur', 'opt:noColors'] });
check('rank: empty query = favourites, recent, rest', ids(r)[0] === 'opt:noColors' && r[0].group === 0 && ids(r)[1] === 'set:hudBlur' && r[1].group === 1 && r.length === items.length);
check('rank: empty query keeps list order for the rest', ids(r).slice(2).join() === ['opt:showGrid', 'opt:showMiniMapGrid', 'set:gridColor', 'hk-x', 'win:matchHistory'].join());
r = C.rank(clone(), 'grid', { recent: ['opt:showMiniMapGrid'] });
check('rank: recent raised', ids(r).indexOf('opt:showMiniMapGrid') <= 1);
const many = [];
for (let i = 0; i < 600; i++) many.push({ id: 'opt:k' + i, kind: 'opt', label: 'Setting number ' + i, en: 'Setting number ' + i, key: 'k' + i, section: 'S' });
const t0 = Date.now();
for (let i = 0; i < 20; i++) C.rank(many, 'set nu ' + i, {});
check('rank: 600 items x 20 queries in under 1.5 s', Date.now() - t0 < 1500);

// storage
let st = C.parseStore('{"fav":["opt:showGrid","bad id",5,"opt:showGrid","win:matchHistory"],"recent":"x"}');
check('store: valid ids kept once, junk dropped', st.fav.join() === 'opt:showGrid,win:matchHistory' && Array.isArray(st.recent) && st.recent.length === 0);
check('store: corrupt JSON reads empty', C.parseStore('{oops').fav.length === 0 && C.parseStore(null).recent.length === 0 && C.parseStore('[1,2]').fav.length === 0);
check('store: unknown kind rejected', C.parseStore({ fav: ['evil:x', 'hk:hk-feed', 'opt:<img>'] }).fav.join() === 'hk:hk-feed');
const longFav = []; for (let i = 0; i < 50; i++) longFav.push('opt:k' + i);
check('store: favourites capped', C.parseStore({ fav: longFav }).fav.length === 30);
// stars and recent entries of merged / moved items stay on what took their place
st = C.parseStore({ fav: ['opt:shortMass', 'opt:fpsAtTop', 'opt:statsAtCenter', 'hk:hk-screenshotMode', 'hk:hk-zoomRecall2', 'win:lab', 'opt:showGrid'], recent: ['opt:mouseCommand4', 'set:mouse4Click', 'opt:gamepadEnabled', 'hk:hk-lmLab'] });
check('store: merged items keep their star on the successor', st.fav.join() === 'set:massFormat,set:statsPosition,hk:hk-showHUD,hk:hk-zoom2,win:plugins,opt:showGrid');
check('store: moved controls keep their recent entry on their block', st.recent.join() === 'sec:lmHkMouse,sec:lmHkGamepad,hk:hk-lmPlugins');
check('store: a star on a Game Over card part stays on the card switch', C.parseStore({ fav: ['opt:massGraph', 'opt:showKiller', 'opt:deathRecap'] }).fav.join() === 'opt:gameOverStats');
check('store: a star on the old Collections button switch stays on the Skin collections command', C.parseStore({ fav: ['opt:skinCollections'] }).fav.join() === 'hk:hk-skinCollections');
check('store: a star on the old Ghost cells info switch stays on Ghost cells', C.parseStore({ fav: ['opt:showGhostCellsInfo'] }).fav.join() === 'opt:showGhostCells');
check('store: a star on the old developer console switch goes to the Performance section', C.parseStore({ fav: ['opt:showDevConsole'] }).fav.join() === 'sec:perfGroup');
check('store: a star on the successor and its old item is one star', C.parseStore({ fav: ['set:massFormat', 'opt:shortMass'] }).fav.join() === 'set:massFormat');
st = { fav: [], recent: [] };
for (let i = 0; i < 20; i++) st = C.withRecent(st, 'opt:k' + (i % 15));
check('recent: newest first, no duplicates, capped', st.recent[0] === 'opt:k4' && st.recent.length === 12 && new Set(st.recent).size === 12);
st = C.withFav(st, 'opt:a', true); st = C.withFav(st, 'opt:b', true); st = C.withFav(st, 'opt:a', true);
check('fav: add keeps order, no duplicates', st.fav.join() === 'opt:b,opt:a');
st = C.withFav(st, 'opt:b', false);
check('fav: remove', st.fav.join() === 'opt:a');

// quick bar placement
const view = { w: 915, h: 412 };
const rowS = { w: 300, h: 40 }, colS = { w: 110, h: 220 };
const R = (l, t, w, h) => ({ left: l, top: t, right: l + w, bottom: t + h });
const hits = (p, rects, m) => { const sz = p.dir === 'row' ? rowS : colS; const a = R(p.x - m, p.y - m, sz.w + 2 * m, sz.h + 2 * m); return rects.some(b => Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)); };
let p = C.placeBar(view, rowS, colS, []);
check('bar: free screen -> top centre row', p.dir === 'row' && p.y === 4 && p.x === Math.round((915 - 300) / 2));
// phone: leaderboard top right, minimap bottom right, buttons, event banner at the top centre
const phone = [R(700, 4, 211, 160), R(815, 312, 96, 96), R(2, 360, 300, 50), R(760, 170, 150, 140), R(300, 28, 315, 22), R(4, 4, 120, 20), R(4, 30, 140, 90)];
p = C.placeBar(view, rowS, colS, phone);
check('bar: phone layout -> clear spot found', p.overlap === 0 && !hits(p, phone, 6));
check('bar: inside the screen', p.x >= 0 && p.y >= 0 && p.x + (p.dir === 'row' ? rowS.w : colS.w) <= view.w && p.y + (p.dir === 'row' ? rowS.h : colS.h) <= view.h);
// busy() callback marks the whole top band as taken
p = C.placeBar(view, rowS, colS, [], r0 => r0.top < 150);
check('bar: busy spots skipped', p.y >= 150 || p.dir === 'col');
// nothing fits: least overlap, still a position
p = C.placeBar(view, rowS, colS, [R(0, 0, 915, 412)]);
check('bar: full screen covered -> a fallback spot', typeof p.x === 'number' && p.overlap > 0);
// too wide for a row: a column
p = C.placeBar({ w: 280, h: 600 }, rowS, colS, []);
check('bar: row wider than the screen -> column', p.dir === 'col');

// switches that cannot be changed are refused when run, not only hidden (audit A9)
{
  const calls = [];
  ctx.application = { setSettings(k, v) { calls.push([k, v]); } };
  const box = (o) => Object.assign({ id: 'universalChat', checked: false, disabled: false, readOnly: false, getAttribute: () => null, closest: () => null }, o);
  check('toggle: exported', typeof C.toggleOpt === 'function');
  if (typeof C.toggleOpt === 'function') {
    const dis = box({ disabled: true });
    C.toggleOpt(dis);
    check('toggle: a disabled switch is not changed', dis.checked === false && calls.length === 0);
    const ro = box({ readOnly: true });
    C.toggleOpt(ro);
    const aria = box({ getAttribute: n => (n === 'aria-disabled' ? 'true' : null) });
    C.toggleOpt(aria);
    check('toggle: read-only and aria-disabled switches are not changed', !ro.checked && !aria.checked && calls.length === 0);
    const ok = box({ id: 'showGrid' });
    C.toggleOpt(ok);
    check('toggle: an enabled switch still changes', ok.checked === true && calls.length === 1 && calls[0][0] === 'showGrid');
  }
}

// a brief press from the quick bar never releases a key / gamepad held command (audit A9)
{
  check('tap: exported', typeof C.makeTapper === 'function');
  if (typeof C.makeTapper === 'function') {
    const log = [], timers = [];
    let held = false;
    const cmd = { keyDown() { log.push('down'); }, keyUp() { log.push('up'); } };
    const tap = C.makeTapper({
      command: id => (id === 'hk-macroFeed' ? cmd : null),
      held: () => held,
      setTimeout: (f, ms) => { timers.push(f); return timers.length; },
      clearTimeout: id => { timers[id - 1] = null; }
    });
    const flush = () => { const t = timers.slice(); timers.length = 0; t.forEach(f => f && f()); };
    held = true;
    tap('hk-macroFeed');
    flush();
    check('tap: a command held by a key is neither pressed again nor released', log.length === 0);
    held = false;
    tap('hk-macroFeed');
    held = true; /* the key is pressed during the brief press */
    flush();
    check('tap: the auto release skips a command a key took over', log.join() === 'down');
    held = false; log.length = 0;
    tap('hk-macroFeed'); tap('hk-macroFeed'); /* two quick bar presses overlap */
    flush();
    check('tap: overlapping presses: one down, one up', log.join() === 'down,up');
  }
}

// texts come from the language packs and follow a language change
{
  check('text: helper exported', typeof C.t === 'function');
  if (typeof C.t === 'function') {
    const en = i18n.t('modules.commandcentre.title');
    check('text: English title from the packs', en === 'Command Centre' && C.t('title') === en);
    check('text: placeholder from the packs', C.t('ph') === i18n.t('modules.commandcentre.ph'));
    check('text: English label of another area (the core matchHistory key)', C.enOf('matchHistory') === i18n.t('matchHistory') && C.enOf('settings.exportImport') === i18n.t('settings.exportImport'));
    ctx.LMi18n.setLang('el', { save: false });
    const el = i18n.t('modules.commandcentre.title', null, 'el');
    check('text: Greek after a language change', C.t('title') === el && el !== en);
    check('text: the English label for searching stays English', C.enOf('modules.commandcentre.replays') === i18n.t('modules.commandcentre.replays'));
    ctx.LMi18n.setLang('en', { save: false });
    check('text: back to English', C.t('title') === en);
  }
}

console.log(fail ? fail + ' failed' : 'all command centre checks passed');
process.exit(fail ? 1 : 0);
