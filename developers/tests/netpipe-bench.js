/* Benchmark of the network worker prototype (lib/netpipe.js) in the real client, headless
 * Chrome: alternating A (now: decode on the main thread) / B (decode in a worker) rounds in one
 * page, through the dense-world benchmark driver (lib/bench-client.js --eval, a bench scene as the
 * stand-in server; nothing is sent to a game server). In-page part: lib/netpipe-bench-page.js.
 *   node developers/tests/netpipe-bench.js             self-check in Node, no browser (run with the other tests)
 *   node developers/tests/netpipe-bench.js --run [--rounds 6] [--packets 120] [--unthrottled] [--repo DIR]
 * Writes developers/tests/out/bench-netpipe-*.json (ignored by git) and prints per set: main-thread
 * ms per packet, arrival-to-applied ms, packets that reached the screen one frame later, a burst
 * of 30 packets in one task, and the time of only reading the update's records.
 *
 * Measured 2026-11-27 (Chrome 158, vsync, the machine busy with other jobs: rounds of the same
 * mode differ by up to 2x; 2 runs of 3 A + 3 B rounds x 100 packets at 40 ms; medians of rounds):
 *   dense, 1000 bodies + 10k food, 14.6 KB compressed / 21.4 KB decoded per packet:
 *     main thread per packet A 2.34 / 1.95 ms, B 2.24 / 1.78 ms; decompressMessage is 8-10 % of
 *     A (0.16-0.25 ms), updateCells 85-90 %; arrival to applied p50 A 1.6 / 1.5, B 2.65 / 2.0 ms,
 *     p95 A 4.3 / 2.6, B 9.6 / 6.7 ms, max B 30-83 ms; 1-3 of 100 packets a frame later in B.
 *   light, 100 bodies + 2k food, 1.9 KB / 2.5 KB per packet: main thread A 0.49 / 0.63 ms,
 *     B 0.51 / 0.75 ms (the message round trip costs more than the decoding it saves); arrival
 *     to applied p50 A 0.4 / 0.35, B 0.8 / 1.0 ms, p95 B 10-12 ms; 7-8 of 100 a frame later.
 *   reading the records only (all a worker parse could take: Cell objects, names, skins and
 *     colours stay on the main thread): 0.027 ms per dense packet, 0.003 ms per light one.
 *   --unthrottled (frames as fast as Chrome draws): B arrival to applied p50 20-85 ms, every
 *     packet a frame later (worker answers wait behind the frames).
 *   A burst of 30 packets in one task is shorter in B (1-2 ms instead of 43-53 ms), but the
 *     world is complete only after 104-136 ms instead of 43-53 ms; a real socket delivers every
 *     message in its own task anyway, so frames already run between packets now.
 * Decision: the client keeps decoding on the main thread (no measured gain beyond the noise,
 * later world updates). What would move real time off the main thread is updateCells' own work
 * (Cell objects, skins, names), which cannot run in a worker without moving the world there. */
'use strict';
const fs = require('fs');
const path = require('path');
const client = require('./lib/bench-client.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && i + 1 < args.length ? args[i + 1] : d; };
/* without --run: the in-page part compiles and the prototype loads (no browser) */
if (args.indexOf('--run') < 0) {
    const NP = require('./lib/netpipe.js');
    let ok = typeof NP.Hub === 'function' && typeof NP.frame255 === 'function';
    try { new Function(fs.readFileSync(path.join(__dirname, 'lib', 'netpipe-bench-page.js'), 'utf8')); } catch (e) { ok = false; console.log('FAIL netpipe-bench-page.js: ' + e.message); }
    console.log(ok ? 'netpipe-bench self-check: ok (browser run: --run)' : 'netpipe-bench self-check: FAIL');
    process.exit(ok ? 0 : 1);
}
const outRoot = path.join(__dirname, 'out');
fs.mkdirSync(outRoot, { recursive: true });
const label = 'netpipe-' + Date.now();
const evalFile = path.join(outRoot, label + '-eval.js');
fs.writeFileSync(evalFile, 'window._lmNetBenchOpts = ' + JSON.stringify({ rounds: +opt('--rounds', 6), packets: +opt('--packets', 120) }) + ';\n' +
    fs.readFileSync(path.join(__dirname, 'lib', 'netpipe-bench-page.js'), 'utf8'));

function row(r) {
    return [r.mode, r.applied + '/' + r.packets, r.mainMs.mean + ' / ' + r.mainMs.p95 + ' / ' + r.mainMs.max, r.e2eMs.p50 + ' / ' + r.e2eMs.p95 + ' / ' + r.e2eMs.max,
        r.frameLater, r.mainTotalMs, r.decodeMsTotal, r.updateCellsMsTotal].join(' | ');
}
function median(a) { const s = a.slice().sort((x, y) => x - y); return s.length ? s[(s.length - 1) >> 1] : 0; }

(async () => {
    const pass = ['--preset', 'quick', '--scenes', 'b100-f2000-s1', '--eval', evalFile, '--no-capture', '--warm', '800', '--measure', '800', '--label', label];
    if (opt('--repo')) pass.push('--repo', opt('--repo'));
    /* frames at the display rate as players have them; --unthrottled: as fast as Chrome can draw */
    if (args.indexOf('--unthrottled') < 0) pass.push('--vsync');
    const code = await client.main(pass);
    try { fs.unlinkSync(evalFile); } catch (e) { }
    if (code) { console.log('netpipe-bench: benchmark driver failed (' + code + ')'); process.exit(code); }
    const json = JSON.parse(fs.readFileSync(path.join(outRoot, 'bench-' + label + '.json'), 'utf8'));
    const ex = json.results[0] && json.results[0].extra;
    if (!ex || ex.error || typeof ex !== 'object') { console.log('netpipe-bench: in-page part failed: ' + JSON.stringify(ex).slice(0, 2000)); process.exit(1); }
    console.log('\nnetpipe-bench: ' + json.meta.browser + ', machine speed check ' + JSON.stringify(ex.calibrateMs) + ' ms (bench.js calibrate; higher = busier)');
    for (const name of Object.keys(ex.sets)) {
        const s = ex.sets[name];
        console.log('\n' + name + ': ' + s.avgCompressedBytes + ' B compressed / ' + s.avgDecodedBytes + ' B decoded per packet (first, full update: ' + s.firstPacket.join(' / ') + ')');
        console.log('mode | applied | main ms mean / p95 / max | arrival->applied ms p50 / p95 / max | a frame later | main ms total | in decompress | in updateCells');
        s.rounds.forEach((r) => console.log(row(r)));
        const by = (m, f) => s.rounds.filter((r) => r.mode === m).map(f);
        console.log('median of rounds: main ms mean A ' + median(by('A', (r) => r.mainMs.mean)) + ' / B ' + median(by('B', (r) => r.mainMs.mean)) +
            '; main total A ' + median(by('A', (r) => r.mainTotalMs)) + ' / B ' + median(by('B', (r) => r.mainTotalMs)) +
            '; arrival->applied p50 A ' + median(by('A', (r) => r.e2eMs.p50)) + ' / B ' + median(by('B', (r) => r.e2eMs.p50)) +
            '; a frame later A ' + median(by('A', (r) => r.frameLater)) + ' / B ' + median(by('B', (r) => r.frameLater)) + ' of ' + s.rounds[0].packets);
        console.log('bursts of ' + s.bursts[0].packets + ' (mode: arrival task ms, all applied ms, apply ms): ' + s.bursts.map((b) => b.mode + ' ' + b.arrivalTaskMs + '/' + b.allAppliedMs + '/' + b.applyMsTotal).join(', '));
        console.log('reading the records only (upper bound of what a worker parse could take off the main thread): ' + s.scanOnly.perPacketMs + ' ms per packet, ' + s.scanOnly.records + ' records');
        console.log('pipe: ' + JSON.stringify(s.pipe));
    }
    process.exit(0);
})().catch((e) => { console.log('netpipe-bench: ' + (e && e.stack || e)); process.exit(1); });
