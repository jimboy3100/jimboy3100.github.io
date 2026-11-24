/* Notification centre + sound mixer checks: runs ogario/modules/notifications.js in a vm
 * with a stub toastr and localStorage (no DOM: the bell and panel are not built).
 * node developers/tests/notifications.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
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
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const flush = () => { const q = timers.splice(0); q.forEach(f => f()); };
  return { ctx, api: ctx.LMNotifications, core: ctx.LMNotifications._core, shown, toastr, toastToken, flush };
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
  check('cat: [SCAN TRICK]: tag -> settings', cat('<b>[SCAN TRICK]:</b> Set a key') === 'settings');
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

/* 10. mixer API with settings, ducking */
{
  const b = boot({ settings: { volMaster: 0.5, volChat: 0.4, volGameplay: 1, volVideo: 0.5, audioDucking: false } });
  check('channel: chat', Math.abs(b.api.channelVolume('chat') - 0.2) < 1e-12);
  check('channel: gameplay', b.api.channelVolume('gameplay') === 0.5);
  check('channel: unknown = master', b.api.channelVolume('whatever') === 0.5);
  check('video: video x master', Math.abs(b.api.videoVolume(0.8) - 0.2) < 1e-12);
  const v = { paused: false, volume: 0.6 };
  b.ctx.videoSkinPlayer = { u: v };
  b.api.soundVolume('chat');
  check('ducking off: video untouched', v.volume === 0.6 && Math.abs(b.api.videoVolume(0.8) - 0.2) < 1e-12);
  b.ctx.legendmod5.audioDucking = true;
  b.api.soundVolume('gameplay');
  check('ducking: gameplay sounds do not duck', v.volume === 0.6);
  b.api.soundVolume('chat');
  check('ducking: playing video lowered at once', Math.abs(v.volume - 0.6 * b.core.DUCK_LEVEL) < 1e-12);
  check('ducking: video volume timer keeps it low', Math.abs(b.api.videoVolume(0.8) - 0.2 * b.core.DUCK_LEVEL) < 1e-12);
  b.api.soundVolume('commands');
  check('ducking: a second sound does not lower it twice', Math.abs(v.volume - 0.6 * b.core.DUCK_LEVEL) < 1e-12);
  const realNow = Date.now;
  b.ctx.Date = { now: () => realNow() + b.core.DUCK_MS + 10 };
  check('ducking: back to normal afterwards', Math.abs(b.api.videoVolume(0.8) - 0.2) < 1e-12);
  const d = boot();
  check('defaults: every channel 1, video unchanged', ['chat', 'commands', 'gameplay', 'video', 'notifications'].every(c => d.api.channelVolume(c) === 1) && d.api.videoVolume(0.42) === 0.42);
}

console.log(fail ? fail + ' failed' : 'all notification checks passed');
process.exit(fail ? 1 : 0);
