/* AgarTool team server (wss://minimap.agartool.io) in Legend Express (LMexpress/LMexpress.js universalchat),
 * with the real ATPacket and my.atArena cut out of LMexpress.js, no network:
 * - strings are UTF-8 ending in a 0 byte: the server's real hello answer 9b "4-1991" 00 reads as the
 *   player ID (a 16-bit length before the text made every packet unreadable both ways)
 * - a room join (157 tag arena), a state (161) and a chat (66) are written byte for byte as AgarTool's
 *   own clients write them; a 0 byte inside a string is dropped; a string without its 0 byte throws
 * - the room of a game server: the token of live-arena-<token>.agar.io, else the whole address
 * node developers/tests/agartool.js */
'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : ' -> ' + info));
    if (!ok) fail++;
}

const a = src.indexOf('    function ATPacket(data)'), b = src.indexOf('    var stat = {', a);
check('ATPacket found in LMexpress.js', a > 0 && b > a);
const ATPacket = new Function(src.slice(a, b) + '\nreturn ATPacket;')();
const bytes = (p) => Array.from(new Uint8Array(p.get()));
const nul = (s) => Array.from(Buffer.from(s, 'utf8')).concat(0);

// the server's hello answer, as captured from minimap.agartool.io
const hello = new ATPacket(new Uint8Array([0x9b, 0x34, 0x2d, 0x31, 0x39, 0x39, 0x31, 0x00]).buffer);
check('hello answer opcode', hello.readUInt8() === 155);
check('hello answer player ID', hello.readUTF8String() === '4-1991');

// room join 157: tag, arena
const join = new ATPacket(); join.setCommandID(157); join.writeUTF8String('ΛΜ'); join.writeUTF8String('abc123');
check('room join bytes', JSON.stringify(bytes(join)) === JSON.stringify([157].concat(nul('ΛΜ'), nul('abc123'))), bytes(join));

// state 161: flags, nick, alive, x, y
const st = new ATPacket(); st.setCommandID(161); st.writeUInt8(1 | 8 | 16 | 32); st.writeUTF8String('Me'); st.writeBoolean(true); st.writeInt32(-5); st.writeInt32(7);
check('state bytes', JSON.stringify(bytes(st)) === JSON.stringify([161, 57].concat(nul('Me'), [1, 251, 255, 255, 255, 7, 0, 0, 0])), bytes(st));

// chat 66 round trip, empty strings and a 0 byte inside
const chat = new ATPacket(); chat.setCommandID(66); chat.writeUInt8(0); chat.writeUTF8String('a\0b'); chat.writeUTF8String('');
check('a 0 byte inside a string is dropped', JSON.stringify(bytes(chat)) === JSON.stringify([66, 0].concat(nul('ab'), [0])), bytes(chat));
const back = new ATPacket(chat.get()); back.readUInt8(); back.readUInt8();
check('chat reads back', back.readUTF8String() === 'ab' && back.readUTF8String() === '');
let threw = false;
const cut = new ATPacket(new Uint8Array([66, 0, 0x41]).buffer);
cut.readUInt8(); cut.readUInt8();
try { cut.readUTF8String(); } catch (e) { threw = e instanceof RangeError; }
check('a string without its 0 byte throws a RangeError', threw);

// room names
const s = src.indexOf('    my.atArena = function'), e = src.indexOf('\n    };', s);
check('my.atArena found', s > 0 && e > s);
const arenaFor = (ws) => s < 0 ? undefined : new Function('LM', 'var my = {};\n' + src.slice(s, e + 7) + '\nreturn my.atArena();')(ws === null ? undefined : { ws: ws });
check('live-arena address -> token', arenaFor('wss://live-arena-1q2w3e.agar.io:443') === '1q2w3e', arenaFor('wss://live-arena-1q2w3e.agar.io:443'));
const off = 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu/1-2-3-4:1501';
check('other address -> the address', arenaFor(off) === off, arenaFor(off));
check('no game address -> no room', arenaFor(null) === '' && arenaFor('') === '');

console.log(fail ? fail + ' failed' : 'all agartool checks passed');
process.exit(fail ? 1 : 0);
