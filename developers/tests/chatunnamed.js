/* Chat of Expanding Land players without a nick, with real code cut out of ogario/ogario.v4.js:
 * the opcode 99 (chat) case of the packet handler with its string reader, displayChatMessage and
 * the chat-bubble lookup of the frame (the map cell.lmChatLine reads), plus fancyCount2 from
 * ogario.v4.master.js. LegendWorld sends no player or cell id with a chat line (pkt_chat_message:
 * flags, colour, name, text); a guest with no nick comes as "An unnamed cell". Checked: such a
 * line reaches the chat box under a translated label (also a label longer than the 15-character
 * nick limit), it never becomes a bubble (also not over a player really named like the
 * placeholder), named lines and agar.io / other servers behave as before. Also: a logged-in
 * player without a nick (sent under the account name, which can be longer than 15 characters) is
 * shown with the full name kept, while relay / team / other-server lines keep the nick limit.
 * And: with Settings > Disable chat on, opcode 99 lines are dropped like relay lines.
 * node developers/tests/chatunnamed.js [ogario.v4.js] */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const i18n = require('./lib/i18n-env');

const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const master = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.master.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function between(text, a, b, from) {
  const i = text.indexOf(a, from || 0);
  if (i < 0) throw new Error('marker not found: ' + a.slice(0, 60));
  const j = text.indexOf(b, i + a.length);
  if (j < 0) throw new Error('end marker not found: ' + b.slice(0, 60));
  return text.slice(i, j);
}
/* a function from its header to the matching closing brace */
function fnFrom(text, header) {
  const i = text.indexOf(header);
  if (i < 0) throw new Error('function not found: ' + header);
  let d = 0, k = text.indexOf('{', i);
  for (; k < text.length; k++) {
    if (text[k] === '{') d++;
    else if (text[k] === '}' && --d === 0) return text.slice(i, k + 1);
  }
  throw new Error('unbalanced: ' + header);
}

const helpers = (() => {
  const i = src.indexOf('var LM_EL_UNNAMED_SENDER');
  return i < 0 ? '' : between(src, 'var LM_EL_UNNAMED_SENDER', '/* Expanding Land team chat (opcode 202');
})();
const reader = between(src, '            var encode = function () {\n                var start = s;', '            var s = 0;\n            var opcode');
const case99 = between(src, '                case 99: //chat for specific private servers', '                case 102:');
const dcmHead = src.search(/\n {8}displayChatMessage\(time, caseof, plId, msg[^)]*\) \{/) + 1;
/* the method up to the next one (its strings hold braces): drop the closing "}," */
const dcm = between(src.slice(dcmHead), 'displayChatMessage(', '        displayUserList(').replace(/\},\s*$/, '}');
const lookup = between(src, '            var _ch = application.chatHistory;', '            var _cmd = application.commandHistory;');
const fancy = fnFrom(master, 'function fancyCount2(');
/* the relay (agar.io / Delta chat) packet reader */
const rcm = between(src, '        readChatMessage(t) {', '        sendChatMessage(type, message) {').replace(/\},\s*$/, '}');
/* knows the echo of a line this socket just sent (Expanding Land own lines) */
const ownEcho = fnFrom(src, '        _lmElOwnChatEcho(text, socket) {').trim();

function boot(lang) {
  const box = [], toasts = [];
  const jq = (sel) => {
    const o = {
      val: () => (sel === '#clantag' ? ctx._tag : sel === '#nick' ? ctx._nick : ''),
      append: (html) => { if (sel === '#chat-box') box.push(html); return o; },
      slice: () => o, remove: () => o, perfectScrollbar: () => o, stop: () => o, animate: () => o, prop: () => 0
    };
    return o;
  };
  const ctx = {
    console, Date, Math, JSON, String, Array, Object, Map, Uint8Array, DataView, TextDecoder,
    $: jq, _tag: '', _nick: 'Me',
    toastr: { success: (h) => toasts.push(h), warning: (h) => toasts.push(h) },
    document: { getElementById: () => null, hidden: false, createElement: () => ({}), head: { appendChild() {} } },
    defaultmapsettings: { showChat: true, showChatBox: true, hideChat: true, chatSounds: false, coloredNicks: false, chatShowId: false, showChatMyOwn: false },
    legendmod: { cellcolors: {} },
    LM: { time: 0 },
    consoleMsgLM: '',
    _lmElTeamsActive: () => false
  };
  ctx.window = ctx;
  ctx.window.chatLimit = 15;
  ctx.window.LMEvents = { _has: () => false };
  vm.createContext(ctx);
  i18n(ctx, lang);
  vm.runInContext(fancy + '\n' + helpers, ctx);
  const app = {
    playerID: 1, chatHistory: [], commandHistory: [], chatUsers: {},
    escapeHTML: (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    parseMessage(t) { return this.escapeHTML(t); },
    _lmChatHidden: () => false,
    addChatUser(id, nick) { this.chatUsers[id] = nick; },
    isChatUserMuted: () => false,
    serverChatUserId: (nick) => 0x40000000 + nick.length
  };
  ctx.application = app;
  vm.runInContext('application.displayChatMessage = function ' + dcm + ';', ctx);
  vm.runInContext('application._lmElOwnChatEcho = function ' + ownEcho.replace(/^_lmElOwnChatEcho/, '') + ';', ctx);
  vm.runInContext('application.readChatMessage = function ' + rcm.replace(/^readChatMessage/, '') + ';', ctx);
  /* the opcode 99 case run as the packet handler runs it */
  const onChat = vm.runInContext('(function (data) {\n var textDecoder = new TextDecoder();\n' + reader + ' var s = 1;\n switch (99) {\n' + case99 + ' }\n})', ctx);
  const bubbles = vm.runInContext('(function (now, myNick) {\n var _chatMap = new Map(), _now = now, _chOn = defaultmapsettings.showChat, _myNick = myNick, _lastSentNick = null, _showOwn = defaultmapsettings.showChatMyOwn;\n' + lookup + ' return _chatMap;\n})', ctx);
  const client = { serverType: 'legendworld', isLegendWorld: true, ws: 'wss://x', socket: {}, rgb2Hex: (r, g, b) => '#' + [r, g, b].map(v => (v < 16 ? '0' : '') + v.toString(16)).join('') };
  return {
    ctx, app, box, toasts, client,
    send(name, text, flags, c) {
      const enc = (t) => Array.from(Buffer.from(t, 'utf8')).concat([0]);
      const bytes = [99, flags || 0, 10, 200, 30].concat(enc(name), enc(text));
      onChat.call(c || client, new DataView(new Uint8Array(bytes).buffer));
    },
    bubbles: () => bubbles(Date.now(), 'Me'),
    /* a relay chat packet: [op][type][u32 player id][u32 target][UTF-16LE "nick: text"] */
    relay(line, plId) {
      const v = new DataView(new ArrayBuffer(10 + 2 * line.length + 2));
      v.setUint8(0, 100); v.setUint8(1, 101); v.setUint32(2, plId || 7, true); v.setUint32(6, 0, true);
      for (let i = 0; i < line.length; i++) v.setUint16(10 + 2 * i, line.charCodeAt(i), true);
      app.readChatMessage(v);
    }
  };
}

const label = (lang) => i18n.t('pkg.z2.unnamedSender', null, lang);
check('the label is in the language packs (English and Greek differ)', label() && label() !== 'pkg.z2.unnamedSender' && label('el') && label('el') !== label());

{
  const b = boot();
  b.send('An unnamed cell', 'Bob is a noob');
  const last = b.box[b.box.length - 1] || '';
  check('guest line in the chat box, under the label', b.box.length === 1 && last.indexOf(label() + ': </span>') !== -1 && last.indexOf('Bob is a noob') !== -1 && last.indexOf('An unnamed cell') === -1, last);
  check('guest line kept in the history, marked as no bubble', b.app.chatHistory.length === 1 && b.app.chatHistory[0].noBubble === true && b.app.chatHistory[0].nick === label());
  const map = b.bubbles();
  check('guest line never becomes a bubble', map.size === 0);
  b.send('An unnamed cell', 'second line');
  check('same guest id for the mute list (from the server name, not the label)', Object.keys(b.app.chatUsers).length === 1);
}
{
  /* a player really named like the placeholder: his own cells would match a bubble keyed by it */
  const b = boot();
  b.send('Bob', 'hi all');
  b.send('An unnamed cell', 'I eat Bob');
  const map = b.bubbles();
  check('named line: bubble as before', map.has('Bob') && map.get('Bob').message === 'hi all' && !b.app.chatHistory[0].noBubble);
  check('no bubble under the placeholder name or the label', !map.has('An unnamed cell') && !map.has(label()));
}
{
  const b = boot('el');
  b.send('An unnamed cell', 'geia');
  const last = b.box[b.box.length - 1] || '';
  check('Greek label (longer than the 15-character nick limit) still shown', label('el').length > 15 && last.indexOf(label('el') + ': </span>') !== -1, last);
}
{
  const b = boot();
  b.send('An unnamed cell', 'restart soon', 128);
  const last = b.box[b.box.length - 1] || '';
  check('a server line is not relabelled', last.indexOf('[SERVER] An unnamed cell') !== -1, last);
}
{
  /* agar.io and other private servers: the name is a nick like any other */
  const b = boot();
  b.send('An unnamed cell', 'hello', 0, Object.assign({}, b.client, { serverType: 'imsolo', isLegendWorld: false }));
  const last = b.box[b.box.length - 1] || '';
  check('other servers unchanged: name kept, bubble keyed by it', last.indexOf('An unnamed cell: </span>') !== -1 && b.bubbles().has('An unnamed cell'), last);
}
{
  /* team chat with a clan tag comes back as 99 with "nick: text" */
  const b = boot();
  b.ctx._tag = 'LM';
  b.send('An unnamed cell', 'An unnamed cell: go left');
  const last = b.box[b.box.length - 1] || '';
  check('team line of a guest: labelled, no bubble', last.indexOf(label() + ': </span>') !== -1 && last.indexOf('go left') !== -1 && b.bubbles().size === 0, last);
}

/* Expanding Land names longer than the 15-character nick limit: a logged-in player without a nick
 * is sent under the account name (LegendWorld server_send_chat: nick, else display_name), which
 * the server does not cut to 15 characters (player_set_identity only cuts nicks). */
const LONG = 'Christopher Alexander Smith';
const nickText = (html) => {
  const m = /<span class="message-nick"[^>]*>(.*?: )<\/span><span class="message-text">/.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, '') : null;
};
{
  const b = boot();
  b.send(LONG, 'anyone up for teams?');
  const last = b.box[b.box.length - 1] || '';
  check('account name over 15 characters: line shown', b.box.length === 1 && last.indexOf('anyone up for teams?') !== -1, last);
  check('the full name stays in the nick text (click to reply), cut short only on screen', nickText(last) === LONG + ': ' && /class="lm-chat-longnick"[^>]*title="Christopher Alexander Smith"[^>]*text-overflow:ellipsis/.test(last), last);
  check('history and bubble keyed by the full name (the cells carry it too)', b.app.chatHistory.length === 1 && b.app.chatHistory[0].nick === LONG && b.bubbles().has(LONG) && b.bubbles().get(LONG).message === 'anyone up for teams?');
  check('mute list under the full name', Object.keys(b.app.chatUsers).map(k => b.app.chatUsers[k]).indexOf(LONG) !== -1);
  b.send('Bob', 'hi');
  const bob = b.box[b.box.length - 1] || '';
  check('short nick: no cut-short markup', nickText(bob) === 'Bob: ' && bob.indexOf('lm-chat-longnick') === -1, bob);
}
{
  const b = boot();
  b.send('Dr: Who of Gallifrey', 'exterminate');
  const last = b.box[b.box.length - 1] || '';
  check('account name holding ": " kept whole', nickText(last) === 'Dr: Who of Gallifrey: ' && b.app.chatHistory[0].nick === 'Dr: Who of Gallifrey' && b.app.chatHistory[0].message === 'exterminate', last);
}
{
  const b = boot();
  b.send(LONG, 'server notice', 64);
  const last = b.box[b.box.length - 1] || '';
  check('admin with a long account name shown', b.box.length === 1 && nickText(last) === '[ADMIN] ' + LONG + ': ', last);
  b.send('An <b>unnamed</b> xxxxxxxxxxx', 'x');
  check('long name escaped in the text and the tooltip', b.box[1] && b.box[1].indexOf('<b>') === -1 && b.box[1].indexOf('title="An &lt;b&gt;') !== -1, b.box[1]);
}
{
  /* the name is only trusted from the packet's name field: text that looks like a long nick is not */
  const b = boot();
  b.send('Bob', 'ThisNameIsWayTooLongForChat: spam');
  const last = b.box[b.box.length - 1] || '';
  check('a long "nick" inside the text is just text', nickText(last) === 'Bob: ' && last.indexOf('ThisNameIsWayTooLongForChat: spam') !== -1, last);
}
{
  /* team chat with a clan tag: the nick is the one the sender's client wrote into the text */
  const b = boot();
  b.ctx._tag = 'LM';
  b.send('Bob', 'ThisNameIsWayTooLongForChat: spam');
  check('team line with a long nick in the text: still dropped', b.box.length === 0);
}
{
  /* agar.io / Delta / chat relay lines and other private servers keep the 15-character limit */
  const b = boot();
  b.relay('ThisNameIsWayTooLongForChat: spam');
  check('relay line with a long nick: still dropped', b.box.length === 0);
  b.relay('Tom: hello there');
  check('relay line with a normal nick: shown as before', b.box.length === 1 && nickText(b.box[0]) === 'Tom: ' && b.box[0].indexOf('lm-chat-longnick') === -1, b.box[0]);
  b.send(LONG, 'spam', 0, Object.assign({}, b.client, { serverType: 'imsolo', isLegendWorld: false }));
  check('other private servers: long name still dropped', b.box.length === 1);
}

/* Team chat (202) of a player without a nick: his client writes "Unnamed: text" (sendChatMessage),
 * the server forwards it as 99 under its own name for him (account name, or the guest placeholder;
 * LegendWorld server_send_team_chat) */
const msgText = (html) => { const m = /<span class="message-text">(.*?)<\/span>/.exec(html); return m ? m[1] : null; };
{
  const b = boot();
  b.ctx._lmElTeamsActive = () => true;
  b.send(LONG, 'Unnamed: push left');
  let last = b.box[b.box.length - 1] || '';
  check('Teams, no tag: account-name team mate shown under the account name, no "Unnamed:" in the text', nickText(last) === LONG + ': ' && msgText(last) === 'push left', last);
  check('... bubble and mute list under the account name', b.bubbles().has(LONG) && Object.keys(b.app.chatUsers).map(k => b.app.chatUsers[k]).indexOf(LONG) !== -1);
  b.send('An unnamed cell', 'Unnamed: hi');
  last = b.box[b.box.length - 1] || '';
  check('Teams, no tag: guest team mate under the label, no bubble', nickText(last) === label() + ': ' && msgText(last) === 'hi' && !b.bubbles().has(label()), last);
  b.send('Bob', 'Bob: hi');
  last = b.box[b.box.length - 1] || '';
  check('Teams, no tag: named team mate as before', nickText(last) === 'Bob: ' && msgText(last) === 'hi', last);
  b.send('Unnamed', 'Unnamed: me');
  last = b.box[b.box.length - 1] || '';
  check('a player really named Unnamed: as before', nickText(last) === 'Unnamed: ' && msgText(last) === 'me', last);
  b.send('Bob', 'Alice: I am Alice');
  last = b.box[b.box.length - 1] || '';
  check('another nick written in the text is not taken as the sender', nickText(last) === 'Bob: ' && msgText(last) === 'Alice: I am Alice', last);
}
{
  const b = boot();
  b.ctx._tag = 'LM';
  b.send(LONG, 'Unnamed: go');
  const last = b.box[b.box.length - 1] || '';
  check('clan tag: no-nick account team mate under the account name (not one shared "Unnamed")', nickText(last) === LONG + ': ' && msgText(last) === 'go' && Object.keys(b.app.chatUsers).map(k => b.app.chatUsers[k]).indexOf(LONG) !== -1, last);
  b.send('Bob', 'Bob: hi');
  check('clan tag: named team mate as before', nickText(b.box[b.box.length - 1]) === 'Bob: ' && msgText(b.box[b.box.length - 1]) === 'hi', b.box[b.box.length - 1]);
}
{
  const b = boot();
  b.ctx._lmElTeamsActive = () => true;
  b.send('Bob', 'Unnamed: hi', 0, Object.assign({}, b.client, { serverType: 'imsolo', isLegendWorld: false }));
  const last = b.box[b.box.length - 1] || '';
  check('other servers: text untouched', nickText(last) === 'Bob: ' && msgText(last) === 'Unnamed: hi', last);
}

{
  /* Expanding Land echoes your public line under the server's name with no sender id: the line this
   * socket just sent is your own (no mute button, own:true), the same text from anyone else is not */
  const b = boot();
  const seen = [];
  b.ctx.window.LMEvents = { _has: () => true, emit: (n, d) => seen.push(d) };
  b.app._lmElSentChat = [{ text: 'gg all', at: Date.now(), socket: b.client.socket }];
  b.send('MyAccountName', 'gg all');
  let last = b.box[b.box.length - 1] || '';
  check('own echo: no mute button, reported own', last.indexOf('mute-user') === -1 && msgText(last) === 'gg all' && seen[0] && seen[0].own === true, last + ' ' + JSON.stringify(seen));
  b.send('Stranger', 'gg all');
  last = b.box[b.box.length - 1] || '';
  check('same text again (not sent again): a stranger, with a mute button', last.indexOf('mute-user') !== -1 && seen[1] && seen[1].own === false, last);
  b.app._lmElSentChat = [{ text: 'old', at: Date.now() - 6000, socket: b.client.socket }, { text: 'other', at: Date.now(), socket: {} }];
  b.send('MyAccountName', 'old');
  b.send('MyAccountName', 'other');
  check('older than 5 s or sent on another socket: not own', b.box.slice(-2).every(h => h.indexOf('mute-user') !== -1) && b.app._lmElSentChat.length === 0, b.box.slice(-2).join(' | '));
}

{
  /* Settings > Disable chat: Expanding Land / private server chat (99) is dropped like relay chat,
   * no hidden chat box lines, no history (bubbles), no events (notifications, companion page) */
  const b = boot();
  const seen = [];
  b.ctx.window.LMEvents = { _has: () => true, emit: (n, d) => seen.push(d) };
  b.ctx.defaultmapsettings.disableChat = true;
  b.send('Bob', 'hi all');
  b.send('Admin', 'notice', 64);
  b.ctx._tag = 'LM';
  b.send('Bob', 'Bob: team line');
  b.relay('Tom: hello there');
  check('Disable chat: no line from opcode 99 or the relay', b.box.length === 0 && b.toasts.length === 0 && b.app.chatHistory.length === 0 && b.bubbles().size === 0 && seen.length === 0,
    b.box.length + ' ' + b.app.chatHistory.length + ' ' + seen.length);
  b.ctx.defaultmapsettings.disableChat = false;
  b.ctx._tag = '';
  b.send('Bob', 'back on');
  check('Disable chat off again: lines shown', b.box.length === 1 && b.bubbles().has('Bob'));
}

console.log(failed ? failed + ' FAILED' : 'all ok');
process.exit(failed ? 1 : 0);
