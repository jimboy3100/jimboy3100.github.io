/* Notification centre + sound mixer checks: runs ogario/modules/notifications.js in a vm
 * with a stub toastr and localStorage (no DOM: the bell and panel are not built).
 * node developers/tests/notifications.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'notifications.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeStorage(limit) {
  const data = {};
  return {
    data,
    getItem: k => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => {
      v = String(v);
      const used = Object.keys(data).reduce((s, x) => s + (x === k ? 0 : data[x].length), 0);
      if (limit && used + v.length > limit) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      data[k] = v;
    },
    removeItem: k => { delete data[k]; }
  };
}

function boot(opts) {
  opts = opts || {};
  const shown = [];
  const toastToken = { css() { return this; } };
  const toastr = {};
  ['success', 'info', 'warning', 'error'].forEach(t => {
    toastr[t] = function (msg, title, o) { shown.push({ t, msg, title, o, self: this }); return toastToken; };
  });
  toastr.clear = () => {};
  const timers = [];
  const ctx = {
    toastr,
    localStorage: opts.storage || makeStorage(),
    legendmod5: Object.assign({ notificationCentre: true }, opts.settings || {}),
    jQuery: () => ({ length: 0, css() { return this; }, jquery: 'stub' }),
    setTimeout: (f) => { timers.push(f); return timers.length; },
    clearTimeout: () => {},
    Date, Math, Number, JSON, String, Array, Object
  };
  /* window events (pagehide) when the test asks for them */
  if (opts.ev) ctx.addEventListener = (n, f) => { (opts.ev[n] = opts.ev[n] || []).push(f); };
  ctx.window = ctx;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(src, ctx);
  const flush = () => { const q = timers.splice(0); q.forEach(f => f()); };
  return { ctx, api: ctx.LMNotifications, core: ctx.LMNotifications._core, shown, toastr, toastToken, flush };
}

/* 0. labels: the settings texts of the language packs, following a language change */
{
  const { core, ctx } = boot();
  check('labels: category and type from the packs', core.catLabel('party') === i18n.t('settings.lmNotifCatParty') && core.typeLabel('error') === i18n.t('settings.lmNotifTypeError') && core.catLabel('party') !== 'settings.lmNotifCatParty');
  check('labels: unknown category / type fall back to Other / Info', core.catLabel('nope') === i18n.t('settings.lmNotifCatOther') && core.typeLabel('nope') === i18n.t('settings.lmNotifTypeInfo'));
  ctx.LMi18n.setLang('el', { save: false });
  check('labels: Greek after a language change', core.catLabel('party') === i18n.t('settings.lmNotifCatParty', null, 'el') && core.catLabel('party') !== i18n.t('settings.lmNotifCatParty'));
  ctx.LMi18n.setLang('en', { save: false });
}

/* 1. HTML stripping */
{
  const { core } = boot();
  check('strip: tags removed, entities decoded', core.stripHtml('<b>[SERVER]:</b> Reward &amp; more &#x1F381; &lt;x&gt;') === '[SERVER]: Reward & more \u{1F381} <x>');
  check('strip: script/style content dropped', core.stripHtml('a<script>alert(1)</script>b<style>p{}</style>c') === 'a b c');
  check('strip: attributes with > inside quotes do not leak handlers', !/onerror/i.test(core.stripHtml('<img src=x onerror="alert(1)">hi')));
  check('strip: stray < kept as text, no markup', core.stripHtml('1 < 2 and 3 > 2') === '1 2 and 3 > 2' || core.stripHtml('1 < 2 and 3 > 2') === '1 < 2 and 3 > 2');
  check('strip: br and blocks become spaces', core.stripHtml('one<br>two<div>three</div>four') === 'one two three four');
  check('strip: control chars and bad code points removed', core.stripHtml('a&#0;b&#xD800;c\u0007d') === 'abc d');
  check('strip: comments removed', core.stripHtml('x<!-- <b>y</b> -->z') === 'x z');
  check('strip: non-strings', core.stripHtml(null) === '' && core.stripHtml(5) === '5' && core.stripHtml({}) === '');
  check('strip: jQuery-like object uses text()', core.stripHtml({ text: () => 'from jq' }) === 'from jq');
  const long = core.stripHtml('x'.repeat(1000));
  check('strip: capped at MAX_TEXT with ellipsis', long.length === core.MAX_TEXT && long.endsWith('…'));
}

/* 2. category detection */
{
  const { core } = boot();
  const cat = html => core.detectCategory(html, core.stripHtml(html));
  check('cat: [SETTINGS]: tag', cat('<b>[SETTINGS]:</b> Saved') === 'settings');
  check('cat: [PARTY]: tag', cat('<b>[PARTY]:</b> Invalid Agar.io Party code.') === 'party');
  check('cat: [AUTH]: tag -> connection', cat('<b>[AUTH]:</b> Unexpected disconnect detected.') === 'connection');
  check('cat: badge unlocked -> achievements', cat('<b>\u{1F3C5}</b> Badge unlocked: Hunter') === 'achievements');
  check('cat: personal best', cat('New best! 12000 mass') === 'bests');
  check('cat: party invitation via [PARTY]', cat('<b>[PARTY]:</b> Bob invited you to a party. Click to join.') === 'party');
  check('cat: [SERVER] invitation by content', cat('<b>[SERVER]:</b> Invitation reward received!') === 'party');
  check('cat: replay', cat('Replays are recorded again from the next server you join.') === 'replay');
  check('cat: [SERVER] disconnect -> connection', cat('<b>[SERVER]:</b> User disconnected. Ping error') === 'connection');
  check('cat: connection lost', cat('Connection to the server was lost. Press Play to reconnect.') === 'connection');
  check('cat: chat popup by markup wins over words', cat('<span class="message-nick" style="color:red">Bob: </span><span class="message-text">party invite replay</span>') === 'chat');
  check('cat: command popup', cat('<span class="command-nick">Bob: </span><span class="command-text">Feed me</span>') === 'chat');
  check('cat: [CHAT]: tag', cat('<b>[CHAT]:</b> Chat is not connected, message not sent.') === 'chat');
  check('cat: export/import -> settings', cat('Settings exported to clipboard') === 'settings');
  check('cat: other', cat('<b>[POTION]:</b> Potion brewed') === 'other');
  check('cat: unknown tag falls back to the text', cat('<b>[SERVER]:</b> Activating reward link...') === 'other');
}

/* 3. wrapper: identical behaviour, return values, recording */
{
  const b = boot();
  const r = b.toastr.warning('<b>[SERVER]:</b> Facebook login NOT allowed', 'T', { closeButton: true });
  check('wrap: original called with the same arguments', b.shown.length === 1 && b.shown[0].msg === '<b>[SERVER]:</b> Facebook login NOT allowed' && b.shown[0].title === 'T' && b.shown[0].o.closeButton === true);
  check('wrap: same return value (chainable .css)', r === b.toastToken);
  check('wrap: this is toastr', b.shown[0].self === b.toastr);
  check('wrap: wrapped once', b.core.wrapToastr(b.toastr) === false);
  const items = b.api.items();
  check('record: one item, plain text with title', items.length === 1 && items[0].text === 'T: [SERVER]: Facebook login NOT allowed' && items[0].type === 'warning');
  check('record: time is a timestamp', Math.abs(items[0].t - Date.now()) < 5000);
  check('unread count', b.api.unread() === 1);
  b.api.markAllRead();
  check('mark all read', b.api.unread() === 0);
  b.toastr.info('Replay only: watch a replay first.');
  check('unread after a new one', b.api.unread() === 1 && b.api.items()[1].category === 'replay');
  b.api.clear();
  check('clear', b.api.items().length === 0 && b.api.unread() === 0);
}

/* 4. option off: pass-through, nothing stored */
{
  const storage = makeStorage();
  const b = boot({ settings: { notificationCentre: false }, storage });
  const r = b.toastr.error('<b>[ERROR]:</b> x');
  b.flush();
  check('off: toast shown, same return value', b.shown.length === 1 && r === b.toastToken);
  check('off: nothing recorded or written', b.api.items().length === 0 && storage.getItem('lmNotifications') === null);
}

/* 5. muted category: recorded, not shown, still chainable */
{
  const b = boot();
  b.api.setMuted('chat', true);
  const r = b.toastr.success('<span class="message-nick">Bob: </span><span class="message-text">hi</span>');
  check('mute: toast not shown', b.shown.length === 0);
  check('mute: recorded anyway', b.api.items().length === 1 && b.api.items()[0].category === 'chat' && b.api.items()[0].text === 'Bob: hi');
  check('mute: returns a chainable empty set', r && typeof r.css === 'function' && r.length === 0);
  b.toastr.info('<b>[SETTINGS]:</b> other categories still show');
  check('mute: other categories shown', b.shown.length === 1);
  b.api.setMuted('chat', false);
  b.toastr.success('<span class="message-nick">A: </span>x');
  check('unmute: shown again', b.shown.length === 2);
  check('default: nothing muted', boot().api.categories.every(c => !boot().api.isMuted(c)));
}

/* 5a. showAlways (the chat box's user lists, the mute / unmute answers): shown although its
 * category is muted, recorded once; with the option off shown and not recorded */
{
  const b = boot();
  b.api.setMuted('other', true);
  b.toastr.info('Muted users: none');
  check('showAlways: a plain toast of the muted category is held back', b.shown.length === 0);
  const r = b.api.showAlways('error', 'Muted users: <strong>Bob</strong>', 'T', { closeButton: true });
  check('showAlways: shown with its title and options', b.shown.length === 1 && b.shown[0].t === 'error' && b.shown[0].title === 'T' && b.shown[0].o && b.shown[0].o.closeButton === true);
  check('showAlways: returns the toast', r === b.toastToken);
  check('showAlways: recorded once', b.api.items().length === 2 && b.api.items()[1].text.indexOf('Bob') >= 0);
  check('showAlways: unknown type does nothing', b.api.showAlways('nope', 'x') === undefined && b.shown.length === 1);
  const off = boot({ settings: { notificationCentre: false } });
  off.api.showAlways('info', 'x');
  check('showAlways: option off: shown, not recorded', off.shown.length === 1 && off.api.items().length === 0);
}

/* 5b. the panel's mute boxes follow LMNotifications.setMuted while the panel is built (until
 * 3.693 they kept the state they were built with), with a small stand-in for the page */
{
  const b = boot();
  const mk = tag => {
    const e = { tagName: tag, children: [], style: {}, classList: { add() { } }, ev: {}, parentNode: null,
      setAttribute() { }, addEventListener(n, f) { (e.ev[n] = e.ev[n] || []).push(f); }, removeEventListener() { },
      appendChild(c) { c.parentNode = e; e.children.push(c); return c; }, removeChild(c) { e.children.splice(e.children.indexOf(c), 1); c.parentNode = null; return c; },
      get firstChild() { return e.children[0] || null; } };
    return e;
  };
  const body = mk('body'), head = mk('head');
  b.ctx.document = { body, head, createElement: mk, createDocumentFragment: () => mk('frag'), createTextNode: t => ({ textContent: t }), getElementById: () => null };
  b.ctx.addEventListener = () => {}; b.ctx.removeEventListener = () => {};
  b.api.open();
  const all = [];
  const walk = e => { all.push(e); (e.children || []).forEach(walk); };
  walk(body);
  const boxes = all.filter(e => e.type === 'checkbox');
  const i = b.api.categories.indexOf('chat');
  check('mute boxes: one per category in the panel', boxes.length === b.api.categories.length && i >= 0 && boxes[i].checked === false);
  b.api.setMuted('chat', true);
  check('mute boxes: setMuted while the panel is built ticks its box', boxes[i].checked === true);
  b.api.close();
  b.api.setMuted('chat', false);
  check('mute boxes: also while the panel is closed (it is kept, hidden)', boxes[i].checked === false && !b.api.isMuted('chat'));
  boxes[i].checked = true;
  boxes[i].ev.change.forEach(f => f({}));
  check('mute boxes: a tick in the panel still mutes', b.api.isMuted('chat'));
}

/* 6. caps, storage, validation */
{
  const storage = makeStorage();
  const b = boot({ storage });
  for (let i = 0; i < 260; i++) b.toastr.info('n' + i);
  b.flush();
  const items = b.api.items();
  check('cap: last 200 kept', items.length === 200 && items[0].text === 'n60' && items[199].text === 'n259');
  const stored = JSON.parse(storage.getItem('lmNotifications'));
  check('stored: valid JSON with 200 items', stored.items.length === 200);
  const b2 = boot({ storage });
  check('reload: items restored', b2.api.items().length === 200 && b2.api.items()[199].text === 'n259');
  b2.toastr.info('after reload');
  check('reload: ids continue', b2.api.items()[199].id === 261);

  const ser = b.core.serializeStore({ nextId: 999, items: Array.from({ length: 200 }, (_, i) => ({ id: i + 1, t: 1, ty: 'info', c: 'other', m: 'x'.repeat(300) })) }, 20000);
  check('size cap: JSON under the byte limit, oldest dropped', ser.length <= 20000 && JSON.parse(ser).items.length > 0 && JSON.parse(ser).items.slice(-1)[0].id === 200);

  const p = b.core.parseStore(JSON.stringify({ nextId: 5, items: [
    { id: 1, t: 10, ty: 'info', c: 'other', m: 'ok' },
    { id: 2, t: 10, ty: 'bogus', c: 'other', m: 'bad type' },
    { id: 3, t: 10, ty: 'info', c: 'nope', m: 'bad cat' },
    { id: 4, t: 'x', ty: 'info', c: 'other', m: 'bad time' },
    { id: 1, t: 10, ty: 'info', c: 'other', m: 'duplicate id' },
    { id: 6, t: 10, ty: 'error', c: 'chat', m: '<b>kept as text</b>' },
    null, 7, 'x'
  ] }));
  check('validate: bad entries dropped', p.items.length === 2 && p.items[0].m === 'ok' && p.items[1].id === 6);
  check('validate: nextId past the last id', p.nextId === 7);
  check('validate: garbage JSON -> empty', b.core.parseStore('{not json').items.length === 0 && b.core.parseStore('null').items.length === 0 && b.core.parseStore('[1,2]').items.length === 0);
  const pr = b.core.parsePrefs(JSON.stringify({ readId: -3, muted: { chat: true, other: 'yes', evil: true }, cat: 'zzz', type: 'error' }));
  check('validate prefs', pr.readId === 0 && pr.muted.chat === true && !pr.muted.other && !pr.muted.evil && pr.cat === 'all' && pr.type === 'error');
}

/* 7. storage full / blocked */
{
  const storage = makeStorage(3000);
  const b = boot({ storage });
  for (let i = 0; i < 100; i++) b.toastr.info('message number ' + i + ' ' + 'y'.repeat(40));
  let threw = false;
  try { b.flush(); } catch (e) { threw = true; }
  check('full storage: no exception', !threw);
  check('full storage: still in memory', b.api.items().length === 100);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  let ok = true;
  try { const b3 = boot({ storage: blocked }); b3.toastr.info('x'); b3.flush(); ok = b3.shown.length === 1 && b3.api.items().length === 1; } catch (e) { ok = false; }
  check('blocked storage: toasts and recording work', ok);
}

/* 8. filters */
{
  const b = boot();
  b.toastr.info('<b>[SETTINGS]:</b> a');
  b.toastr.error('<b>[SETTINGS]:</b> b');
  b.toastr.error('Connection lost');
  const f = b.core.filterItems(b.ctx.LMNotifications._core.sanitizeItems(b.api.items().map(i => ({ id: i.id, t: i.t, ty: i.type, c: i.category, m: i.text }))), 'settings', 'error');
  check('filter: category + type', f.length === 1 && f[0].m === '[SETTINGS]: b');
  const all = b.core.filterItems(b.api.items().map(i => ({ id: i.id, t: i.t, ty: i.type, c: i.category, m: i.text })), 'all', 'all');
  check('filter: newest first', all.length === 3 && all[0].m === 'Connection lost');
}

/* 8b. Export / Import Settings carries the muted categories and reloads the page: a list save still
 * waiting at pagehide (a toast in the last second) keeps what the import wrote */
{
  const ev = {}, storage = makeStorage();
  const b = boot({ storage, ev });
  b.api.setMuted('chat', true);
  b.toastr.info('a toast just before the import');
  /* the import: this device's read mark and filter stay, the muted categories come from the file */
  const p = JSON.parse(storage.getItem('lmNotificationPrefs'));
  p.muted = { party: true };
  storage.setItem('lmNotificationPrefs', JSON.stringify(p));
  b.ctx._lmSettingsReload = true;
  (ev.pagehide || []).forEach(f => f());
  const after = JSON.parse(storage.getItem('lmNotificationPrefs'));
  check('import + reload: the imported muted categories stay', JSON.stringify(after.muted) === JSON.stringify({ party: true }));
  check('import + reload: the pending list save is still written', JSON.parse(storage.getItem('lmNotifications') || '{}').items.length === 1);
  /* without an import the pending save writes as before */
  const ev2 = {}, st2 = makeStorage();
  const b2 = boot({ storage: st2, ev: ev2 });
  b2.toastr.info('x');
  (ev2.pagehide || []).forEach(f => f());
  check('pagehide: the pending list save is written', JSON.parse(st2.getItem('lmNotifications') || '{}').items.length === 1);
}

/* 9. volume math */
{
  const { core } = boot();
  check('mix: defaults unchanged', core.mixVolume(0.37, 1, 1, 1) === 0.37 && core.mixVolume(1, undefined, undefined) === 1);
  check('mix: channel x master', Math.abs(core.mixVolume(1, 0.5, 0.5, 1) - 0.25) < 1e-12);
  check('mix: ducking', Math.abs(core.mixVolume(0.8, 1, 1, core.DUCK_LEVEL) - 0.8 * core.DUCK_LEVEL) < 1e-12);
  check('mix: clamped to 0..1', core.mixVolume(3, 1, 1) === 1 && core.mixVolume(-1, 1, 1) === 0 && core.mixVolume(1, 7, 1) === 1 && core.mixVolume(1, -2, 1) === 0);
  check('mix: NaN base -> 0, bad setting -> 1', core.mixVolume(NaN, 1, 1) === 0 && core.mixVolume(0.5, 'x', null) === 0.5);
  check('mix: numeric strings', Math.abs(core.mixVolume(1, '0.5', '1') - 0.5) < 1e-12);
}

/* 10. mixer API with settings, ducking: only for sounds that really play and can be heard */
(async () => {
  const tick = () => new Promise(r => setImmediate(r));
  const b = boot({ settings: { volMaster: 0.5, volChat: 0.4, volGameplay: 1, volVideo: 0.5, audioDucking: false } });
  check('channel: chat', Math.abs(b.api.channelVolume('chat') - 0.2) < 1e-12);
  check('channel: gameplay', b.api.channelVolume('gameplay') === 0.5);
  check('channel: unknown = master', b.api.channelVolume('whatever') === 0.5);
  /* a leftover volVideo (the removed second video slider) is not used: the level x master */
  check('video: level x master only', Math.abs(b.api.videoVolume(0.8) - 0.4) < 1e-12);
  check('video: no video channel any more (master)', b.api.channelVolume('video') === 0.5);
  let T = Date.now();
  b.ctx.Date = { now: () => T };
  const v = { paused: false, volume: 0.6 };
  b.ctx.videoSkinPlayer = { u: v };
  /* an Audio stand-in: play() resolves or rejects, ended / error listeners */
  const sound = (o) => {
    const a = Object.assign({ volume: 1, muted: false, paused: true, ended: false, duration: NaN, currentTime: 0, L: {} }, o || {});
    a.addEventListener = (n, f) => { (a.L[n] = a.L[n] || []).push(f); };
    a.fire = n => (a.L[n] || []).forEach(f => f());
    a.play = () => { if (a.refuse) return Promise.reject(new Error('NotAllowedError')); a.paused = false; return Promise.resolve(); };
    return a;
  };
  const low = () => Math.abs(b.api.videoVolume(0.8) - 0.4 * b.core.DUCK_LEVEL) < 1e-12;
  const normal = () => Math.abs(b.api.videoVolume(0.8) - 0.4) < 1e-12;
  b.api.play(sound(), 'chat'); await tick();
  check('ducking off: video untouched', v.volume === 0.6 && normal());
  b.ctx.legendmod5.audioDucking = true;
  b.api.soundVolume('chat');
  check('ducking: asking for a volume alone does not duck (nothing plays yet)', v.volume === 0.6 && normal());
  b.api.play(sound(), 'gameplay'); await tick();
  check('ducking: gameplay sounds do not duck', v.volume === 0.6 && normal());
  b.ctx.legendmod5.volChat = 0;
  b.api.play(sound(), 'chat'); await tick();
  check('ducking: a muted channel (volume 0) does not duck', v.volume === 0.6 && normal());
  b.ctx.legendmod5.volChat = 0.4;
  b.api.play(sound({ muted: true }), 'chat'); await tick();
  check('ducking: a muted element does not duck', v.volume === 0.6 && normal());
  b.api.play(sound({ refuse: true }), 'chat'); await tick();
  check('ducking: a refused play() does not duck', v.volume === 0.6 && normal());
  const s1 = sound();
  b.api.play(s1, 'chat');
  check('ducking: not before play() succeeded', v.volume === 0.6);
  await tick();
  check('ducking: playing video lowered once the sound plays', Math.abs(v.volume - 0.6 * b.core.DUCK_LEVEL) < 1e-12);
  check('ducking: video volume timer keeps it low', low());
  b.api.play(sound(), 'commands'); await tick();
  check('ducking: a second sound does not lower it twice', Math.abs(v.volume - 0.6 * b.core.DUCK_LEVEL) < 1e-12);
  T += b.core.DUCK_MS + 10;
  check('ducking: unknown length: back to normal after DUCK_MS', normal());
  /* bounded by the sound's length, ended / error */
  b.api.play(sound({ duration: 0.4 }), 'chat'); await tick();
  check('ducking: short sound ducks', low());
  T += 450;
  check('ducking: short sound: back to normal after its length (0.4 s)', normal());
  const s2 = sound({ duration: 3 });
  b.api.play(s2, 'chat'); await tick();
  T += 500;
  s2.fire('ended');
  check('ducking: ended: back to normal at once', normal());
  const s3 = sound();
  b.api.play(s3, 'chat'); await tick();
  s3.fire('error');
  check('ducking: error: back to normal at once', normal());
  b.api.play(sound({ duration: 600 }), 'notifications'); await tick();
  T += b.core.DUCK_MAX_MS + 10;
  check('ducking: a long sound ducks at most DUCK_MAX_MS', normal());
  /* overlapping: the latest deadline counts, an early end of one keeps the other */
  const long = sound({ duration: 5 }), short = sound({ duration: 0.3 });
  b.api.play(long, 'chat'); await tick();
  T += 100;
  b.api.play(short, 'chat'); await tick();
  T += 1000;
  check('ducking: overlap: a shorter later sound keeps the longer deadline', low());
  short.fire('ended');
  check('ducking: overlap: the other sound ending keeps this duck', low());
  T += 4000;
  check('ducking: overlap: back to normal after the long one', normal());
  /* the core path: application.playSound asks soundVolume, plays, then duckPlayback */
  const s4 = sound({ duration: 1 });
  s4.volume = b.api.soundVolume('chat');
  if (typeof b.api.duckPlayback === 'function') b.api.duckPlayback(s4, 'chat', s4.play()); await tick();
  check('ducking: duckPlayback for the core sounds', typeof b.api.duckPlayback === 'function' && low());
  const d = boot();
  check('defaults: every channel 1, video unchanged', ['chat', 'commands', 'gameplay', 'video', 'notifications'].every(c => d.api.channelVolume(c) === 1) && d.api.videoVolume(0.42) === 0.42);

  console.log(fail ? fail + ' failed' : 'all notification checks passed');
  process.exit(fail ? 1 : 0);
})();
