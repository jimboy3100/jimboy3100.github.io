/* Shortcut bar rows above the minimap (LMexpress.js, legacy, kept as they were): the real functions
 * run against a small fake jQuery. Checks: the Imgur icons / Script commands / Youtube videos /
 * Mini scripts rows open one at a time; a Youtube button posts its [yt] link to team chat only with
 * a clan tag; a Script command is sent as Legend.Mod&?player=..&?com=.. and the receiving side acts
 * on it (Team5 board image, NamePerm and Troll on Death after the toast's button, the troll also
 * without the Dying Light script's playSound); the admin row's disconnect buttons type their line
 * and a teammate gets the reconnect toast.
 * node developers/tests/shortcutrows.js [LMexpress.js] [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
const og = fs.readFileSync(process.argv[3] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
/* a top-level function up to the next top-level function */
const fn = (text, name) => {
    const a = text.indexOf('\nfunction ' + name + '(');
    if (a < 0) { check('found function ' + name, false); return ''; }
    const b = text.indexOf('\nfunction ', a + 1);
    return text.slice(a, b < 0 ? undefined : b);
};
const names = ['seticonfunction', 'setmessagecomfunction', 'setytfunction', 'setscriptingfunction',
    'NoseticonReturn', 'YesseticonReturn', 'NosetMsgComReturn', 'YessetMsgComReturn', 'NosetytReturn', 'YessetytReturn',
    'NosetScriptingComReturn', 'YessetScriptingComReturn', 'sendyt1', 'sendyt6', 'msgcommand1f', 'msgcommand2f',
    'msgcommand3f', 'msgcommand4f', 'msgcommand6f', 'dosendmsgcommand', 'settrolling', 'disconnect2min', 'disconnectnow',
    'dosendadmincommand', 'MsgCommands1', '_lmEscHtml'];
const code = names.map((n) => fn(src, n)).join('\n') + fn(og, 'getParameterByName');

/* fake jQuery: one state object per selector */
const els = {};
const node = (sel) => {
    if (els[sel]) return els[sel];
    const e = els[sel] = { sel, shown: null, cssv: {}, v: '', handlers: [], length: 1, removed: false };
    e.show = () => { e.shown = true; return e; };
    e.hide = () => { e.shown = false; return e; };
    e.css = (k, v) => { if (typeof k === 'object') { Object.assign(e.cssv, k); return e; } if (v === undefined) return e.cssv[k]; e.cssv[k] = v; return e; };
    e.val = (v) => { if (v === undefined) return e.v; e.v = v; return e; };
    e.click = (f) => { if (f) e.handlers.push(f); else e.handlers.forEach((h) => h()); return e; };
    e.find = (s) => node(sel + ' ' + s);
    e.attr = () => e; e.text = () => e; e.html = () => e; e.remove = () => { e.removed = true; };
    return e;
};
const toasts = [], sent = [], typed = [], audio = [];
let submits = 0;
const toast = (kind) => (msg) => { const t = node('toast' + toasts.length); toasts.push({ kind, msg, el: t }); return t; };
const ctx = {
    console: { log() { }, warn() { } }, encodeURIComponent, decodeURIComponent, RegExp, String,
    $: node, toastr: { info: toast('info'), warning: toast('warning'), success: toast('success') },
    application: { lastSentClanTag: 'LM', sendChatMessage: (op, text) => sent.push([op, text]) },
    document: { getElementById: (id) => ({ value: node('#' + id).v }) },
    KeyEvent: { simulate: (k) => typed.push(node('#message').v) },
    setTimeout: (f) => { f(); return 1; }, clearTimeout() { },
    newsubmit: () => { submits++; }, lmHudBgImage() { }, lmHudBgSaved: () => '', canvasbimg: '',
    Audio: function (url) { audio.push(url); this.play = () => ({ catch() { } }); },
    _lmxT: (k) => k, _lmxE: (k) => k,
    Premadeletter22: 'Player', Premadeletter23: 'asks', Premadeletter24: 'Yes', Premadeletter25: 'No', Premadeletter26: 'name',
    Premadeletter27: 'troll', Premadeletter39: 'no tag', Premadeletter123: 'Team',
    seticon: 'YES', setmessagecom: 'YES', setyt: 'YES', setscriptingcom: 'YES', AdminRights: 0,
    playerMsg: '', commandMsg: '', otherMsg: '', LegendClanSymbol: '0',
    yt1url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', yt6url: 'https://www.youtube.com/watch?v=promo000001'
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const shown = () => ['#images-hud', '#msgcommands-hud', '#yt-hud', '#scripting-hud'].filter((s) => node(s).shown).join();

/* 1. the rows open one at a time, a second press closes the open one */
ctx.setytfunction();
check('Youtube button opens the Youtube videos row', shown() === '#yt-hud', shown());
ctx.setmessagecomfunction();
check('Script commands button: its row replaces the Youtube row', shown() === '#msgcommands-hud', shown());
ctx.seticonfunction();
check('Imgur icons button: its row replaces the Script commands row', shown() === '#images-hud', shown());
ctx.setscriptingfunction(); ctx.setmessagecomfunction();
check('Mini scripts then Script commands: only Script commands open', shown() === '#msgcommands-hud', shown());
ctx.setmessagecomfunction();
check('a second press closes the row', shown() === '', shown());

/* 2. a Youtube button posts its link to team chat only with a clan tag */
node('#clantag').v = ''; node('#nick').v = 'Bob';
ctx.sendyt1();
check('no clan tag: nothing sent, a hint shown', sent.length === 0 && toasts.length === 1 && toasts[0].kind === 'info', JSON.stringify(sent));
node('#clantag').v = 'LM';
ctx.sendyt1(); ctx.sendyt6();
check('Youtube 1 and 6 post [yt]link[/yt] on the team chat (101)', sent.length === 2 && sent[0][0] === 101 && sent[0][1] === '[yt]' + ctx.yt1url + '[/yt]' && sent[1][1] === '[yt]' + ctx.yt6url + '[/yt]', JSON.stringify(sent));

/* 3. script commands are sent in the format the receiving side reads */
sent.length = 0; node('#nick').v = 'Me & you';
ctx.msgcommand1f(); ctx.msgcommand2f(); ctx.msgcommand3f(); ctx.msgcommand4f(); ctx.msgcommand6f();
check('Hello / Laugh / Name / Troll / Insane sent with the nick and command',
    sent.map((s) => s[1]).join('|') === ['Hello', 'Team5', 'NamePerm', 'dTroll2', 'HideAll'].map((c) => 'Legend.Mod&?player=Me%20%26%20you&?com=' + c + '&?do=').join('|'), sent.map((s) => s[1]).join('|'));
sent.length = 0; node('#clantag').v = '';
const before = toasts.length;
ctx.msgcommand1f();
check('script command without a clan tag: nothing sent, a warning', sent.length === 0 && toasts.length === before + 1 && toasts[before].kind === 'warning');

/* 4. the receiving side */
const msgEl = node('msg-line');
ctx.MsgCommands1('Legend.Mod&?player=Bob&?com=Team5&?do=', 'Bob', msgEl);
check('Team5: the team board shows the laugh banner, the command line leaves the chat', /icogeneral\.gif/.test(node('#top5-hud').cssv['background-image'] || '') && msgEl.removed);
let t0 = toasts.length;
ctx.MsgCommands1('Legend.Mod&?player=Bob&?com=NamePerm&?do=', 'Bob', node('m2'));
check('NamePerm: a toast asks first', toasts.length === t0 + 1 && /Bob/.test(toasts[t0].msg));
toasts[t0].el.find('.btn.btn-sm.btn-primary.btn-play.btn-do-NamePerm').click();
check('NamePerm accepted: the nick becomes the sender\'s and Play is pressed', node('#nick').v === 'Bob' && submits === 1, node('#nick').v + ' ' + submits);
t0 = toasts.length;
ctx.MsgCommands1('Legend.Mod&?player=Bob&?com=dTroll2&?do=', 'Bob', node('m3'));
let err = '';
try { toasts[t0].el.find('.btn.btn-sm.btn-primary.btn-play.btn-do-troll').click(); } catch (e) { err = e.message; }
check('Troll on Death accepted: troll sound and backgrounds, no playSound needed', !err && audio.length === 1 && /troll1\.mp3$/.test(audio[0]) && /giphy/.test(node('#leaderboard-hud').cssv['background-image'] || ''), err || audio.join());
node('#message-box').cssv.display = 'none'; node('#clantag').v = 'LM'; submits = 0;
ctx.MsgCommands1('Legend.Mod&?player=Bob&?com=Hello&?do=', 'Bob', node('m4'));
check('Hello: renamed to Hello Team, then the own nick back, Play pressed twice', node('#nick').v === 'Bob' && submits === 2, node('#nick').v + ' ' + submits);

/* 5. admin row: disconnect buttons type their line; a teammate without the clan symbol gets the toast */
typed.length = 0; const t1 = toasts.length;
ctx.disconnect2min();
check('disconnect buttons do nothing without admin rights', typed.length === 0 && toasts.length === t1);
ctx.AdminRights = 1;
ctx.disconnect2min(); ctx.disconnectnow();
check('disconnect in 2 minutes / now type their command line', typed.includes('https://agar.io/sip=151.80.91.73:1511&?do=&?com=EU-London') && typed.includes('https://agar.io/sip=151.80.91.73:1511&?do=&?com=RU-Russia'), typed.join(' '));
const t2 = toasts.length; node('#nick').v = 'Bob';
ctx.MsgCommands1('https://agar.io/sip=151.80.91.73:1511&?do=&?com=EU-London', 'Admin', node('m5'));
check('a teammate gets the reconnect toast', toasts.length === t2 + 1 && /asksReconnect/.test(toasts[t2].msg));
console.log(failed ? failed + ' failed' : 'all shortcut row checks passed');
process.exit(failed ? 1 : 0);
