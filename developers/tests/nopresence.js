/* Test browsers send no Player Monitor presence (lib/nopresence.js): the page script every Chrome test
 * harness installs drops the "update_details" messages to wss://api.legendmod.ml/lm-ws (nick, server,
 * playing) and passes everything else (lm-ws search and pong, other sockets, the game's binary packets).
 * node developers/tests/nopresence.js   (no browser, well under a second) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const here = __dirname;

let failed = 0;
const check = (name, ok, more) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || !more ? '' : ': ' + more)); if (!ok) failed++; };

/* the real page script, run on a WebSocket whose send records what reaches the network */
const sent = [];
function FakeSocket(url) { this.url = url; }
FakeSocket.prototype.send = function (d) { sent.push([this.url, d]); };
const ctx = vm.createContext({ WebSocket: FakeSocket, JSON });
vm.runInContext(require('./lib/nopresence').source, ctx);
const ws = (url, d) => { sent.length = 0; new FakeSocket(url).send(d); return sent.length; };
const lm = 'wss://api.legendmod.ml/lm-ws';
const details = JSON.stringify({ id: 'lm-x', type: 'update_details', data: { nickname: 'Profile #1', server: 'live-arena-ffa.legendmod.ml:8080.agar.io&r=Private&m=5001', isPlaying: true } });

check('update_details to lm-ws is dropped', ws(lm, details) === 0);
check('update_details to lm-ws over ws:// / other case is dropped', ws('WSS://API.legendmod.ml/lm-ws/', details) === 0);
check('lm-ws server list search still sent', ws(lm, JSON.stringify({ type: 'search', data: '' })) === 1);
check('lm-ws pong still sent', ws(lm, JSON.stringify({ type: 'pong' })) === 1);
check('a nick containing "update_details" in another message still sent', ws(lm, JSON.stringify({ type: 'search', data: 'update_details' })) === 1);
check('non-JSON text to lm-ws still sent', ws(lm, 'update_details{') === 1);
check('update_details to another server still sent', ws('wss://ffa.legendmod.ml:8080', details) === 1);
check('binary game packets still sent', ws('wss://ffa.legendmod.ml:8080', new Uint8Array([254, 6, 0, 0, 0])) === 1 && ws(lm, new Uint8Array([1])) === 1);

/* every harness that opens a Legend Mod page installs it before the page loads */
const harnesses = ['smoke.js', 'lib/bench-client.js', 'trace.js', 'agarloader.js'];
for (const f of harnesses) {
  const src = fs.readFileSync(path.join(here, f), 'utf8');
  const at = src.search(/addScriptToEvaluateOnNewDocument', \{ source: require\('\.\/(lib\/)?nopresence'\)\.source \}/);
  const nav = src.indexOf("Page.navigate'", at);
  check(f + ' installs it before navigating', at >= 0 && nav > at);
}

console.log(failed ? failed + ' FAILED' : 'all passed');
process.exit(failed ? 1 : 0);
