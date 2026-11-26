/* Chat of Expanding Land players without a nick, with real code cut out of ogario/ogario.v4.js:
 * the opcode 99 (chat) case of the packet handler with its string reader, displayChatMessage and
 * the chat-bubble lookup of the frame (the map cell.lmChatLine reads), plus fancyCount2 from
 * ogario.v4.master.js. LegendWorld sends no player or cell id with a chat line (pkt_chat_message:
 * flags, colour, name, text); a guest with no nick comes as "An unnamed cell". Checked: such a
 * line reaches the chat box under a translated label (also a label longer than the 15-character
 * nick limit), it never becomes a bubble (also not over a player really named like the
 * placeholder), named lines and agar.io / other servers behave as before.
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
  /* the opcode 99 case run as the packet handler runs it */
  const onChat = vm.runInContext('(function (data) {\n var textDecoder = new TextDecoder();\n' + reader + ' var s = 1;\n switch (99) {\n' + case99 + ' }\n})', ctx);
  const bubbles = vm.runInContext('(function (now, myNick) {\n var _chatMap = new Map(), _now = now, _chOn = defaultmapsettings.showChat, _myNick = myNick, _lastSentNick = null, _showOwn = defaultmapsettings.showChatMyOwn;\n' + lookup + ' return _chatMap;\n})', ctx);
  const client = { serverType: 'legendworld', isLegendWorld: true, ws: 'wss://x', rgb2Hex: (r, g, b) => '#' + [r, g, b].map(v => (v < 16 ? '0' : '') + v.toString(16)).join('') };
  return {
    ctx, app, box, toasts, client,
    send(name, text, flags, c) {
      const enc = (t) => Array.from(Buffer.from(t, 'utf8')).concat([0]);
      const bytes = [99, flags || 0, 10, 200, 30].concat(enc(name), enc(text));
      onChat.call(c || client, new DataView(new Uint8Array(bytes).buffer));
    },
    bubbles: () => bubbles(Date.now(), 'Me')
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
  b.send('ThisNameIsWayTooLongForChat', 'spam');
  check('other nicks over 15 characters still dropped (as before)', b.box.length === 1);
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

console.log(failed ? failed + ' FAILED' : 'all ok');
process.exit(failed ? 1 : 0);
