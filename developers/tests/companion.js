/* Stream overlay / companion checks: runs ogario/modules/companion.js in a vm (no DOM, so only
 * the pure helpers in LMCompanion.core exist) and tests the state builder (hidden information
 * never published), the throttling and the URL parameters of companion.html.
 * node developers/tests/companion.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const repo = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(repo, 'ogario', 'modules', 'companion.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const ctx = { URL, Date, Math, Number, JSON, String, Array, Object, isFinite };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const C = ctx.LMCompanion && ctx.LMCompanion.core;
check('LMCompanion.core defined without a document', !!C);
check('no game part without a document', ctx.LMCompanion && !ctx.LMCompanion.open);
vm.runInContext(src, ctx);
check('loading twice keeps the first copy', ctx.LMCompanion.core === C);
/* objects from the vm: compare as JSON */
const J = v => JSON.stringify(v);

/* ── state builder ── */
const full = {
  playing: true, mass: 1234.6, best: 2000, cells: 7, rank: 3, bestRank: 2, alive: 65432, kills: 5,
  nick: 'Streamer', skin: 'https://i.imgur.com/skin.png', country: 'GR', server: 'live-arena-abc.agar.io', serverType: 'agario', mode: 'FFA',
  lb: [{ nick: 'Top', me: false }, { nick: 'Second', me: false }, { nick: 'Streamer', me: true }].concat(Array.from({ length: 12 }, (_, i) => ({ nick: 'P' + i }))),
  map: {
    own: { x: 0.5, y: 0.25 }, team: [{ x: 0.1, y: 0.2, nick: '[TAG] mate', color: '#ff0000' }],
    ghosts: [{ x: 0.9, y: 0.9, r: 0.01 }], trail: Array.from({ length: 150 }, (_, i) => ({ x: i / 150, y: 0.5 }))
  },
  chat: [{ nick: 'Streamer', text: 'hello', own: true }, { nick: 'Other', text: 'split!', cmd: true }]
};
let st = C.buildState(full, {});
check('mass rounded', st.mass === 1235 && st.best === 2000 && st.cells === 7 && st.rank === 3 && st.kills === 5);
check('time alive kept while playing', st.alive === 65432);
check('nick, skin, country, server published by default', st.nick === 'Streamer' && st.skin === 'https://i.imgur.com/skin.png' && st.country === 'gr' && st.server === 'live-arena-abc.agar.io');
check('leaderboard cut to 10 with own entry', st.lb.length === 10 && st.lb[2].me === true && st.lb[2].nick === 'Streamer');
check('trail cut to the last 120 points', st.map.trail.length === 120 && st.map.trail[119].x === Math.round(149 / 150 * 1000) / 1000);
check('teammate nick and colour kept', st.map.team[0].nick === '[TAG] mate' && st.map.team[0].color === '#ff0000');
check('chat not published without its option', st.chat === undefined);
st = C.buildState(full, { chat: true });
check('chat published with its option', st.chat && st.chat.length === 2 && st.chat[1].cmd === true && st.chat[0].own === true);

st = C.buildState(full, { streamMode: true, chat: true });
const sj = J(st);
check('stream mode: no own nick anywhere', st.nick === '' && st.lb[2].nick === '' && st.lb[2].me === true && st.chat[0].nick === '' && sj.indexOf('Streamer') < 0);
check('stream mode: no skin, country, server address', st.skin === '' && st.country === '' && st.server === '' && sj.indexOf('imgur') < 0 && sj.indexOf('agar.io') < 0);
check('stream mode: no teammate nicks (clan tag)', st.map.team[0].nick === '' && sj.indexOf('TAG') < 0);
check('stream mode: other players and numbers kept', st.lb[0].nick === 'Top' && st.mass === 1235 && st.serverType === 'agario');
st = C.buildState(full, { hideSkinUrl: true });
check('hide skin URL: no skin, nick kept', st.skin === '' && st.nick === 'Streamer' && J(st).indexOf('imgur') < 0);
st = C.buildState(full, { hidecountry: true });
check('hide my country: no country', st.country === '' && J(st).indexOf('"gr"') < 0 && st.nick === 'Streamer');

st = C.buildState(Object.assign({}, full, { playing: false }), {});
check('not playing: no time alive, no own dot', st.alive === 0 && st.map.own === null);
st = C.buildState({
  playing: true, mass: 'x', rank: -4, nick: 'a‮b\u0000c' + 'z'.repeat(100), skin: 'javascript:alert(1)', country: 'greece',
  lb: 'nope', map: { own: { x: 'a', y: 1 }, team: [null, { x: 0.2, y: 0.3, color: 'red;background:url(x)' }], ghosts: [{ x: 5, y: -3, r: 9 }], trail: [{ x: NaN, y: 1 }] },
  chat: [{ nick: '<b>x</b>', text: '' }, { nick: 'n', text: '<img src=x onerror=alert(1)>' }]
}, { chat: true });
check('bad numbers become 0', st.mass === 0 && st.rank === 0);
check('control / bidi characters removed, nick cut to 40', st.nick.indexOf('‮') < 0 && st.nick.indexOf('\u0000') < 0 && st.nick.length === 40);
check('only https skins', st.skin === '');
check('country must be two letters', st.country === '');
check('bad leaderboard ignored', Array.isArray(st.lb) && st.lb.length === 0);
check('bad points dropped, out of range clamped', st.map.own === null && st.map.team.length === 1 && st.map.team[0].color === '' &&
  st.map.ghosts[0].x === 1.05 && st.map.ghosts[0].y === -0.05 && st.map.ghosts[0].r === 0.2 && st.map.trail.length === 0);
check('empty chat lines dropped, text kept as plain text', st.chat.length === 1 && st.chat[0].text === '<img src=x onerror=alert(1)>');
const once = C.buildState(full, { streamMode: true, chat: true });
check('builder is idempotent (the page runs it again)', J(C.buildState(once, { chat: true })) === J(once));
check('safe defaults for nothing', J(C.buildState(null)) === J(C.buildState({})) && C.buildState(undefined).playing === false);

/* ── events ── */
check('unknown event type dropped', C.buildEvent({ type: 'eval' }) === null && C.buildEvent(null) === null);
const k = C.buildEvent({ type: 'kill', t: 5, nick: 'v\u0007ictim', mass: 99.6, extra: 'x' });
check('kill event cleaned', k.type === 'kill' && k.nick === 'victim' && k.mass === 100 && k.extra === undefined);
const b = C.buildEvent({ type: 'best', mass: 10, alive: 20, massRecord: 1, timeRecord: 0 });
check('personal best event', b.massRecord === true && b.timeRecord === false && b.mass === 10 && b.alive === 20);
check('event builder idempotent', J(C.buildEvent(k)) === J(k));

/* ── stream mode: names in kill events and chat ── */
const ks = C.buildEvent({ type: 'kill', t: 5, nick: 'Victim', mass: 50 }, { streamMode: true });
check('stream mode: no eaten player name in kill events', ks.nick === '' && ks.mass === 50 && J(C.buildEvent(ks)) === J(ks));
st = C.buildState(full, { streamMode: true, chat: true });
check('stream mode: no chat sender names (not only own lines)', st.chat.length === 2 && st.chat.every(c => c.nick === '' && c.text === '[redacted]') && J(st).indexOf('Other') < 0);
check('stream mode: the state says so, building again keeps it hidden', st.stream === true && C.buildState(Object.assign({}, full, { stream: true }), { chat: true }).nick === '' &&
  C.buildState(full, { chat: true }).stream === false);

/* ── in the game: stream mode switched, server changed (module with stub DOM / events) ── */
{
  const msgs = [], L = {}, timers = [];
  const g = {
    URL, Date, Math, Number, JSON, String, Array, Object, isFinite,
    document: { createElement: () => ({ style: {}, addEventListener() { }, appendChild() { } }), getElementById: () => null },
    BroadcastChannel: function () { this.postMessage = m => msgs.push(JSON.parse(JSON.stringify(m))); this.close = () => { }; },
    LMEvents: { on: (n, f) => { (L[n] = L[n] || []).push(f); }, off: (n, f) => { L[n] = (L[n] || []).filter(x => x !== f); } },
    legendmod5: { companionLive: true, companionChat: true, streamMode: false },
    legendmod: { play: true, playerMass: 100, leaderboard: [] },
    localStorage: { getItem: () => null },
    location: { hostname: 'www.legendmod.ml' },
    setTimeout: f => { timers.push(f); return timers.length; }, clearTimeout() { }, setInterval: () => 1, clearInterval() { },
    addEventListener() { }, removeEventListener() { }
  };
  g.window = g;
  vm.createContext(g);
  vm.runInContext(src, g);
  timers.shift()();
  const emit = (n, d) => (L[n] || []).forEach(f => f(d));
  const lastState = () => { g.LMCompanion.publishNow(); const s = msgs.filter(m => m.kind === 'state'); return s[s.length - 1].state; };
  check('game part runs with the option on', g.LMCompanion.isOn());
  emit('chat', { nick: 'Other', text: 'hi', type: 'message' });
  check('normal mode: chat sender shown', lastState().chat[0].nick === 'Other');
  g.legendmod5.streamMode = true;
  check('stream mode switched on: chat kept so far is dropped', lastState().chat.length === 0);
  emit('chat', { nick: 'Other', text: 'hi again', type: 'message' });
  check('stream mode: new chat line without sender', lastState().chat[0].nick === '' && J(lastState()).indexOf('Other') < 0);
  emit('kill', { nick: 'Victim', mass: 120 });
  const ev = msgs.filter(m => m.kind === 'event').pop();
  check('stream mode: kill event published without the name', ev && ev.event.type === 'kill' && ev.event.nick === '' && J(msgs).indexOf('Victim') < 0);
  g.legendmod5.streamMode = false;
  check('stream mode switched off: lines from stream mode dropped', lastState().chat.length === 0);
  emit('chat', { nick: 'Old server', text: 'x', type: 'message' });
  emit('serverChange', { host: 'b.example' });
  check('server change: chat of the old server dropped', lastState().chat.length === 0);
}

/* ── throttling ── */
const posted = [];
const pub = C.createPublisher((s, now) => posted.push([s.n, now]), { interval: 250, keepalive: 2000 });
check('first state posted', pub.offer({ n: 1 }, 1000) === true);
check('within 250 ms: not posted', pub.offer({ n: 2 }, 1100) === false && pub.offer({ n: 2 }, 1249) === false);
check('after 250 ms: posted', pub.offer({ n: 2 }, 1250) === true);
check('unchanged state not repeated', pub.offer({ n: 2 }, 1600) === false && pub.offer({ n: 2 }, 3000) === false);
check('unchanged state repeated after the keepalive', pub.offer({ n: 2 }, 3250) === true);
check('force posts at once', pub.offer({ n: 2 }, 3260, true) === true);
let n = 0;
for (let t = 10000; t < 20000; t += 16) if (pub.offer({ n: t }, t)) n++;
check('a changing state at 60 fps is posted at most 4 times per second (' + n + ' in 10 s)', n >= 38 && n <= 40);
pub.reset();
check('reset: posts again at once', pub.offer({ n: 2 }, 20001) === true);
const allow = C.createRateLimit(3, 1000);
check('rate limit', allow(0) && allow(10) && allow(20) && !allow(30) && allow(1001));

/* ── URL parameters ── */
let p = C.parseParams('');
check('no parameters: setup page with the default widgets', p.setup === true && J(p.widgets) === J(C.DEFAULT_WIDGETS) && p.bg === 'dark' && p.scale === 1 && p.layout === 'column');
p = C.parseParams('?w=mass,rank&bg=transparent');
check('w=mass,rank&bg=transparent', p.setup === false && J(p.widgets) === '["mass","rank"]' && p.bg === 'transparent');
p = C.parseParams('?w=map,lb,feed,kills,unknown,map&layout=grid&scale=9&bg=00ff00');
check('aliases, unknown and repeated widgets', J(p.widgets) === '["minimap","leaderboard","events"]');
check('layout, scale clamped, bare hex colour', p.layout === 'grid' && p.scale === 3 && p.bg === '#00ff00');
p = C.parseParams('?w=chat&scale=0.1&bg=red;x&layout=evil&lines=100&feed=0');
check('bad values fall back', p.scale === 0.5 && p.bg === 'dark' && p.layout === 'column' && p.lines === 20 && p.feed === 1);
p = C.parseParams('?w=card&bg=green&scale=abc');
check('green background, scale not a number', p.bg === '#00ff00' && p.scale === 1);
p = C.parseParams('?w=card&wm=' + encodeURIComponent('<script>alert(1)</script>‮') + '&wmimg=' + encodeURIComponent('javascript:alert(1)') + '&wmpos=xx&accent=' + encodeURIComponent('#123456'));
check('watermark text kept as plain text, cut', p.wm === '<script>alert(1)</script>' && p.wm.length <= 60);
check('watermark image must be https', p.wmImg === '' && p.wmPos === 'br' && p.accent === '#123456');
p = C.parseParams('?w=card&wmimg=' + encodeURIComponent('https://example.com/logo.png') + '&wmpos=tl');
check('https watermark image', p.wmImg === 'https://example.com/logo.png' && p.wmPos === 'tl');
check('watermark image: no quotes, credentials or http', C.safeUrl('https://a.b/x".png') === '' && C.safeUrl('https://u:p@a.b/x.png') === '' && C.safeUrl('http://a.b/x.png') === '' && C.safeUrl('https://' + 'a'.repeat(600)) === '');
p = C.parseParams('?w=%E0%A4%A&W=card');
check('broken percent encoding skipped, keys case-insensitive', p.setup === false && J(p.widgets) === '["card"]');
p = C.parseParams('?widgets=time+stats&demo=1');
check('widgets= and spaces, demo', J(p.widgets) === '["time","stats"]' && p.demo === true);
const cfg = { widgets: ['card', 'minimap'], layout: 'row', bg: 'transparent', scale: 1.5, wm: 'My stream & co', wmImg: 'https://example.com/a.png', wmPos: 'tl', accent: '#ff00ff', lines: 6, feed: 3 };
const back = C.parseParams(C.buildQuery(cfg));
check('buildQuery round trip', J(back.widgets) === J(cfg.widgets) && back.layout === 'row' && back.bg === 'transparent' && back.scale === 1.5 &&
  back.wm === cfg.wm && back.wmImg === cfg.wmImg && back.wmPos === 'tl' && back.accent === '#ff00ff' && back.feed === 3 && back.setup === false);

/* ── where "Open companion" goes ── */
let plan = C.openPlan({ hostname: 'www.legendmod.ml', protocol: 'https:', origin: 'https://www.legendmod.ml' }, false);
check('legendmod.ml: same origin, BroadcastChannel', plan.mode === 'bc' && plan.url === 'https://www.legendmod.ml/companion.html');
plan = C.openPlan({ hostname: 'jimboy3100.github.io', protocol: 'https:', origin: 'https://jimboy3100.github.io' }, false);
check('github.io: same origin', plan.mode === 'bc' && plan.url === 'https://jimboy3100.github.io/companion.html');
plan = C.openPlan({ hostname: 'agar.io', protocol: 'https:', origin: 'https://agar.io' }, false);
check('agar.io: window on www.legendmod.ml', plan.mode === 'popup' && plan.url === 'https://www.legendmod.ml/companion.html' && plan.reason === 'origin');
plan = C.openPlan({ hostname: 'www.legendmod.ml', protocol: 'https:', origin: 'https://www.legendmod.ml' }, true);
check('inside a frame: window (the channel is partitioned by the top site)', plan.mode === 'popup' && plan.reason === 'frame');
plan = C.openPlan({ hostname: 'evil-legendmod.ml', protocol: 'https:', origin: 'https://evil-legendmod.ml' }, false);
check('look-alike host is not trusted', plan.mode === 'popup');

/* ── page and loader wiring ── */
const page = fs.readFileSync(path.join(repo, 'companion.html'), 'utf8');
check('companion.html loads the module as a page', page.indexOf('window.LMCompanionPage = true') >= 0 && page.indexOf('src="ogario/modules/companion.js"') >= 0);
check('companion.html loads nothing from other sites', !/<script[^>]+src="https?:/i.test(page) && !/<link[^>]+href="https?:/i.test(page));
check('companion.html never uses innerHTML', page.indexOf('innerHTML') < 0 && src.indexOf('innerHTML') < 0);
check('companion.html mentions WebRTC pairing as not supported', /WebRTC/.test(page));
const v4 = fs.readFileSync(path.join(repo, 'ogario', 'ogario.v4.js'), 'utf8');
check('option off by default', /companionLive: false,/.test(v4) && /companionChat: false,/.test(v4));
check('loader entry', v4.indexOf("ogario/modules/companion.js?v=") >= 0);

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
