/* Network worker prototype (developers/tests/lib/netpipe.js), checked in Node:
 *  - oracle: the client's own decompressMessage (taken from ogario.v4.js) run in a worker
 *    gives the same bytes, or the same rejection, as on the main thread, for the WASM and the
 *    JS decoder (valid packets of many sizes, malformed and oversized ones);
 *  - the pipe applies every packet once, in arrival order, never drops one: interleaved plain
 *    and LZ4 packets, key evolution (a packet that changes the decryption key queued behind one
 *    in the worker), bounded backpressure, flush on close/reconnect (late results ignored),
 *    a failed or silent worker (falls back to the main thread), a handler that throws, and the
 *    received bytes stay whole for the replay recorder.
 * node developers/tests/netpipe.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const NP = require('./lib/netpipe.js');
const B = require('./lib/bench-scene.js');
const core = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const decText = NP.extractDecompress(core);

let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || !info ? '' : ' (' + info + ')')); if (!ok) failed++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* main-thread reference: the method in a context whose window.buffer.Buffer is Node's Buffer
 * (the client's extras/buffer.js is the same API) */
function mainDecoder(noWasm) {
    const ctx = { console: { warn() { } }, Uint8Array, DataView, WebAssembly: noWasm ? undefined : WebAssembly, atob, RangeError, TypeError, Number };
    ctx.window = ctx;
    ctx.window.buffer = { Buffer: function (ab, off, len) { return Buffer.from(ab, off || 0, len === undefined ? ab.byteLength - (off || 0) : len); } };
    vm.createContext(ctx);
    const fn = vm.runInContext('(' + NP.asFunctionText(decText) + ')', ctx);
    return { ctx, decode: (view) => fn.call({}, view) };
}
function outcome(f) {
    try { const r = f(); return { ok: true, hex: Buffer.from(r.buffer, r.byteOffset, r.byteLength).toString('hex') }; }
    catch (e) { return { ok: false, err: e.name + ': ' + e.message }; }
}
const same = (a, b) => a.ok === b.ok && (a.ok ? a.hex === b.hex : a.err === b.err);

/* fixtures */
function rnd(seed) { const r = B.makeRng(seed); return () => (r() * 256) | 0; }
function data(n, kind, seed) {
    const u = new Uint8Array(n), r = rnd(seed || 7);
    for (let i = 0; i < n; i++) u[i] = kind === 'random' ? r() : kind === 'runs' ? ((i >> 6) & 255) : (r() & 7) + (i % 13);
    return u;
}
function withLen(buf, len) { const u = new Uint8Array(buf.slice(0)); new DataView(u.buffer).setUint32(1, len, true); return u.buffer; }
function fixtures() {
    const list = [];
    [[1, 'mixed'], [6, 'mixed'], [64, 'runs'], [5000, 'mixed'], [70000, 'mixed'], [200000, 'runs'], [300000, 'random'], [1500000, 'mixed']].forEach(([n, k]) => {
        const inner = data(n, k, n); inner[0] = 16;
        list.push({ name: 'valid ' + k + ' ' + n + ' bytes', buf: NP.frame255(inner) });
    });
    /* a real cell update of the dense benchmark world (the private-server layout) */
    const w = B.createWorld(B.scene({ bodies: 1000, food: 10000 }));
    list.push({ name: 'dense world full update', buf: NP.frame255(new Uint8Array(B.encodeUpdate(w, 0, true))) });
    B.step(w);
    list.push({ name: 'dense world delta update', buf: NP.frame255(new Uint8Array(B.encodeUpdate(w, 0, false))) });
    const good = NP.frame255(data(4000, 'mixed', 3));
    const g = new Uint8Array(good);
    list.push({ name: 'malformed: shorter than 6 bytes', buf: new Uint8Array([255, 1, 0, 0, 0]).buffer });
    list.push({ name: 'malformed: output size 0', buf: withLen(good, 0) });
    list.push({ name: 'malformed: output size over 32 MiB', buf: withLen(good, 32 * 1024 * 1024 + 1) });
    list.push({ name: 'malformed: ratio over 256', buf: withLen(good, (g.length - 5) * 256 + 1) });
    list.push({ name: 'malformed: output size larger than the data', buf: withLen(good, 4100) });
    list.push({ name: 'malformed: output size smaller than the data', buf: withLen(good, 3000) });
    list.push({ name: 'malformed: truncated block', buf: good.slice(0, g.length - 40) });
    const zo = new Uint8Array([255, 0, 0, 0, 0, 0x10, 65, 0, 0, 0x00]); new DataView(zo.buffer).setUint32(1, 30, true);
    list.push({ name: 'malformed: zero match offset', buf: zo.buffer });
    const far = new Uint8Array([255, 0, 0, 0, 0, 0x14, 65, 9, 0, 0x00]); new DataView(far.buffer).setUint32(1, 30, true);
    list.push({ name: 'malformed: match offset beyond decoded data', buf: far.buffer });
    const big = new Uint8Array(8 * 1024 * 1024 + 1); big[0] = 255; new DataView(big.buffer).setUint32(1, 100, true);
    list.push({ name: 'malformed: over 8 MiB compressed', buf: big.buffer });
    return list;
}

/* a worker request/answer round trip outside a pipe (oracle) */
function workerDecoder(noWasm) {
    /* noWasm: the worker cannot load the WASM decoder (JS decoder only), as mainDecoder(true) */
    const host = NP.nodeHost((noWasm ? 'globalThis.WebAssembly = undefined; console.warn = function () { };\n' : '') + NP.workerSource(decText));
    const waiting = new Map();
    let q = 0;
    host.onMessage((m) => { if (m && m.warm !== undefined) { const w = waiting.get('warm'); waiting.delete('warm'); if (w) w(m); return; } const r = waiting.get(m.q); waiting.delete(m.q); r(m); });
    return {
        host,
        warm: () => new Promise((res) => { waiting.set('warm', res); host.post({ warm: true }); }),
        decode: (buf) => new Promise((res) => {
            const id = ++q, copy = buf.slice(0);
            waiting.set(id, (m) => res(m.error ? { ok: false, err: m.error.name + ': ' + m.error.message } : { ok: true, hex: Buffer.from(m.out).toString('hex') }));
            host.post({ p: 0, g: 0, q: id, b: copy }, [copy]);
        })
    };
}

/* a host the test answers by hand: post() records, answer() replies like the worker */
function fakeHost(dec) {
    const h = { sent: [], msgFn: null, errFn: null, terminated: false };
    h.post = (m, t) => { if (h.throwOnPost) throw new Error('post failed'); h.sent.push(m); };
    h.onMessage = (fn) => { h.msgFn = fn; };
    h.onError = (fn) => { h.errFn = fn; };
    h.terminate = () => { h.terminated = true; };
    h.answer = (i) => {
        const m = h.sent.splice(i || 0, 1)[0];
        if (!m) return false;
        let r;
        try { const out = dec.decode(new DataView(m.b)); r = { p: m.p, g: m.g, q: m.q, out: out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) }; }
        catch (e) { r = { p: m.p, g: m.g, q: m.q, error: { name: e.name, message: e.message } }; }
        h.msgFn(r);
        return true;
    };
    h.answerAll = () => { while (h.answer(0)) { } };
    return h;
}

/* what the client's handler does with a packet, as a log line: opcode, and for opcode 255 the
 * decoded bytes or the rejection, decoded on the main thread when pre is undefined */
function makeHandler(dec, log) {
    return (view, pre) => {
        const op = view.getUint8(0);
        if (op !== 255) { log.push(op + ':' + Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('hex')); return; }
        let o;
        if (pre && pre.out) o = { ok: true, hex: Buffer.from(pre.out).toString('hex') };
        else if (pre && pre.error) o = { ok: false, err: pre.error.name + ': ' + pre.error.message };
        else o = outcome(() => dec.decode(view));
        log.push('255:' + (o.ok ? o.hex.length + ':' + o.hex.slice(0, 64) + o.hex.slice(-64) : o.err));
    };
}

(async () => {
    const main = mainDecoder();
    const fx = fixtures();
    /* 1. JS decoder on both sides (without WebAssembly; the WASM decoder loads on first use,
     *    asynchronously, so its first packets take the JS decoder in the client too) */
    const jsDec = mainDecoder(true), jd = workerDecoder(true);
    const jsMain = fx.map((f) => outcome(() => jsDec.decode(new DataView(f.buf))));
    const jsWorker = [];
    for (const f of fx) jsWorker.push(await jd.decode(f.buf));
    fx.forEach((f, i) => check('JS decoder, worker = main thread: ' + f.name, same(jsMain[i], jsWorker[i]), JSON.stringify([jsMain[i], jsWorker[i]]).slice(0, 200)));
    await jd.host.terminate();
    /* 2. WASM decoder loaded on both sides */
    const wd = workerDecoder();
    main.decode(new DataView(fx[0].buf));
    await wd.warm();
    for (let i = 0; i < 50 && !main.ctx._lz4wasm; i++) await sleep(20);
    const wasmOn = await wd.warm();
    check('the WASM decoder is loaded on the main thread and in the worker', !!main.ctx._lz4wasm && wasmOn.warm === true);
    const waMain = fx.map((f) => outcome(() => main.decode(new DataView(f.buf))));
    const waWorker = [];
    for (const f of fx) waWorker.push(await wd.decode(f.buf));
    fx.forEach((f, i) => check('WASM decoder, worker = main thread: ' + f.name, same(waMain[i], waWorker[i]), JSON.stringify([waMain[i], waWorker[i]]).slice(0, 200)));
    check('valid packets decode to their content (JS = WASM)', fx.every((f, i) => !jsMain[i].ok || (waMain[i].ok && waMain[i].hex === jsMain[i].hex)));
    check('malformed packets are rejected', fx.filter((f) => f.name.startsWith('malformed')).every((f) => !waMain[fx.indexOf(f)].ok && !jsMain[fx.indexOf(f)].ok));
    await wd.host.terminate();

    /* a mixed stream: plain packets (opcodes 16, 17, 49, 53 ...), valid and malformed LZ4 ones */
    function stream(n, seed) {
        const r = B.makeRng(seed), w = B.createWorld(B.scene({ bodies: 200, food: 1000 })), out = [];
        for (let i = 0; i < n; i++) {
            const k = r();
            if (k < 0.45) { B.step(w); out.push(NP.frame255(new Uint8Array(B.encodeUpdate(w, 0, i % 50 === 0)))); }
            else if (k < 0.5) out.push(fx[11 + ((r() * 8) | 0)].buf.slice(0));
            else { const u = data(1 + ((r() * 40) | 0), 'mixed', i); u[0] = [16, 17, 49, 53, 64, 32, 20][(r() * 7) | 0]; out.push(u.buffer); }
        }
        return out;
    }
    const pkts = stream(400, 11);
    const ref = [];
    const refHandle = makeHandler(main, ref);
    pkts.forEach((b) => refHandle(new DataView(b.slice(0))));

    /* 3. real worker: same log as the synchronous path, in order, nothing dropped */
    {
        const hub = new NP.Hub(NP.nodeHost(NP.workerSource(decText)));
        const log = [], kept = [];
        const p = hub.pipe({ apply: (v, pre) => { kept.push(v); makeHandler(main, log)(v, pre); } });
        const copies = pkts.map((b) => b.slice(0));
        copies.forEach((b) => p.push(b));
        for (let i = 0; i < 200 && log.length < pkts.length; i++) await sleep(10);
        const n0 = log.length;
        p.push(new Uint8Array([17, 1, 2]).buffer);
        const immediate = log.length === n0 + 1;
        log.pop(); kept.pop();
        check('real worker: every packet applied once, in arrival order, same result as now', log.length === ref.length && log.every((l, i) => l === ref[i]), log.length + '/' + ref.length);
        check('real worker: LZ4 packets were decoded in the worker', p.stats.offloaded > 100, JSON.stringify(p.stats));
        check('real worker: received bytes stay whole for the replay recorder', kept.every((v, i) => v.byteLength === pkts[i].byteLength && Buffer.compare(Buffer.from(v.buffer, v.byteOffset, v.byteLength), Buffer.from(pkts[i])) === 0));
        check('real worker: a plain packet with nothing queued is applied at arrival', immediate);
        await hub.host.terminate();
    }

    /* 4. answers in any order (fake host): order of application unchanged */
    {
        const host = fakeHost(main), hub = new NP.Hub(host), log = [];
        const p = hub.pipe({ apply: makeHandler(main, log) });
        const r = B.makeRng(5);
        pkts.forEach((b, i) => { p.push(b.slice(0)); if (r() < 0.3 && host.sent.length) host.answer((r() * host.sent.length) | 0); });
        host.answerAll();
        check('results arriving out of order: still applied in arrival order', log.length === ref.length && log.every((l, i) => l === ref[i]));
    }

    /* 5. key evolution: a packet that changes the key (241 here) queued behind one in the
     *    worker; later packets are decrypted with the new key only after it was applied */
    {
        const enc = (bytes, key) => { const u = new Uint8Array(bytes); for (let i = 0; i < u.length; i++) u[i] ^= (key >>> (i % 4 * 8)) & 255; return u.buffer; };
        const K1 = 0x11223344, K2 = 0x55667788;
        let key = K1;
        const host = fakeHost(main), hub = new NP.Hub(host), log = [];
        const handle = makeHandler(main, log);
        const p = hub.pipe({
            prepare: (raw) => new DataView(enc(new Uint8Array(raw), key)),
            apply: (v, pre) => { if (v.getUint8(0) === 241) key = v.getUint32(1, true); handle(v, pre); }
        });
        const z = NP.frame255(data(3000, 'mixed', 9));
        const k2 = new Uint8Array(5); k2[0] = 241; new DataView(k2.buffer).setUint32(1, K2, true);
        const plain = [z, k2.buffer, new Uint8Array([53, 1, 2, 3]).buffer, NP.frame255(data(2000, 'runs', 2)), new Uint8Array([16, 9, 9]).buffer];
        const wire = [enc(new Uint8Array(z), K1), enc(k2, K1), enc(new Uint8Array(plain[2]), K2), enc(new Uint8Array(plain[3]), K2), enc(new Uint8Array(plain[4]), K2)];
        wire.forEach((b) => p.push(b));
        const before = log.length;
        host.answerAll();
        host.answerAll();
        const exp = [];
        const eh = makeHandler(main, exp);
        plain.forEach((b) => eh(new DataView(b)));
        check('key change queued behind a worker packet: nothing applied before the worker answered', before === 0);
        check('key change queued behind a worker packet: every later packet decrypted with the new key', log.length === exp.length && log.every((l, i) => l === exp[i]), JSON.stringify(log).slice(0, 300));
    }

    /* 6. bounded backpressure: never more than the limits in the worker, nothing dropped */
    {
        const host = fakeHost(main), hub = new NP.Hub(host), log = [];
        const p = hub.pipe({ apply: makeHandler(main, log), maxInflight: 3, maxInflightBytes: 1 << 20 });
        const zs = [];
        for (let i = 0; i < 20; i++) zs.push(NP.frame255(data(20000 + i, 'random', i)));
        let maxSent = 0;
        zs.forEach((b) => { p.push(b.slice(0)); maxSent = Math.max(maxSent, host.sent.length); });
        check('backpressure: at most maxInflight packets in the worker', maxSent === 3 && p.stats.maxInflight === 3, maxSent);
        host.answerAll(); host.answerAll();
        const exp = [], eh = makeHandler(main, exp);
        zs.forEach((b) => eh(new DataView(b)));
        check('backpressure: packets over the limit decoded on the main thread at their turn, none dropped, same order', log.length === 20 && log.every((l, i) => l === exp[i]) && p.stats.bypassed === 17);
        const host2 = fakeHost(main), p2 = new NP.Hub(host2).pipe({ apply: () => { }, maxInflightBytes: 50000 });
        zs.slice(0, 6).forEach((b) => p2.push(b.slice(0)));
        check('backpressure: bytes in the worker bounded by maxInflightBytes', p2.stats.maxInflightBytes <= 50000 && host2.sent.length === 2, p2.stats.maxInflightBytes);
    }

    /* 7. flush (close, socket replaced): everything that arrived is applied now, in order;
     *    late worker results are ignored, nothing applied twice */
    {
        const host = fakeHost(main), hub = new NP.Hub(host), log = [];
        const p = hub.pipe({ apply: makeHandler(main, log) });
        const part = pkts.slice(0, 60);
        part.forEach((b) => p.push(b.slice(0)));
        const pendingAnswers = host.sent.length;
        p.flush();
        const exp = ref.slice(0, 60);
        check('flush: every queued packet applied at once, in order', log.length === 60 && log.every((l, i) => l === exp[i]));
        host.answerAll();
        check('flush: late worker results ignored, nothing applied twice', log.length === 60 && p.stats.staleResults === pendingAnswers && pendingAnswers > 0, p.stats.staleResults + '/' + pendingAnswers);
        p.push(pkts[0].slice(0)); host.answerAll();
        check('flush: the pipe keeps working after it', log.length === 61 && log[60] === ref[0]);
    }

    /* 8. a failed worker: flush, then synchronous for good */
    {
        const host = fakeHost(main), hub = new NP.Hub(host), log = [];
        const p = hub.pipe({ apply: makeHandler(main, log) });
        pkts.slice(0, 30).forEach((b) => p.push(b.slice(0)));
        host.errFn(new Error('worker crashed'));
        check('failed worker: queued packets applied on the main thread, in order', log.length === 30 && log.every((l, i) => l === ref[i]) && host.terminated);
        const sentBefore = host.sent.length;
        pkts.slice(30, 60).forEach((b) => p.push(b.slice(0)));
        check('failed worker: later packets applied at arrival on the main thread', log.length === 60 && log.every((l, i) => l === ref[i]) && host.sent.length === sentBefore);
        const host2 = fakeHost(main), hub2 = new NP.Hub(host2), log2 = [];
        const p2 = hub2.pipe({ apply: makeHandler(main, log2) });
        host2.throwOnPost = true;
        pkts.slice(0, 30).forEach((b) => p2.push(b.slice(0)));
        check('worker refusing a message: same as a failed worker', log2.length === 30 && log2.every((l, i) => l === ref[i]));
        /* refused while the queue is drained (packets prepared after a plain one was applied) */
        const host3 = fakeHost(main), log3 = [];
        const p3 = new NP.Hub(host3).pipe({ apply: makeHandler(main, log3) });
        const seq3 = [NP.frame255(data(900, 'mixed', 4)), new Uint8Array([53, 1]).buffer, NP.frame255(data(700, 'runs', 5)), new Uint8Array([17, 2]).buffer, NP.frame255(data(500, 'mixed', 6))];
        seq3.forEach((b) => p3.push(b.slice(0)));
        host3.throwOnPost = true;
        host3.answer(0);
        const exp3 = [], eh3 = makeHandler(main, exp3);
        seq3.forEach((b) => eh3(new DataView(b)));
        check('worker refusing a message while the queue drains: every packet once, in order', log3.length === exp3.length && log3.every((l, i) => l === exp3[i]), log3.length + '/' + exp3.length);
    }

    /* 9. a silent worker: timed out, then as a failed worker */
    {
        const host = fakeHost(main), hub = new NP.Hub(host, { timeoutMs: 60 }), log = [];
        const p = hub.pipe({ apply: makeHandler(main, log) });
        pkts.slice(0, 20).forEach((b) => p.push(b.slice(0)));
        const before = log.length;
        await sleep(200);
        check('silent worker: the connection is not held (timeout, then the main thread)', log.length === 20 && log.every((l, i) => l === ref[i]) && hub.failed && before < 20, before + ' then ' + log.length);
    }

    /* 10. a handler that throws: reported, the next packets still applied */
    {
        const host = fakeHost(main), hub = new NP.Hub(host), seen = [];
        const reported = [];
        const prevReport = globalThis.reportError;
        globalThis.reportError = (e) => reported.push(e);
        const p = hub.pipe({ apply: (v) => { seen.push(v.getUint8(0)); if (seen.length === 2) throw new Error('handler error'); } });
        [NP.frame255(data(100, 'mixed', 1)), new Uint8Array([17]).buffer, new Uint8Array([53]).buffer, NP.frame255(data(100, 'mixed', 2))].forEach((b) => p.push(b));
        host.answerAll();
        globalThis.reportError = prevReport;
        check('a handler error is reported and does not stop the next packets', seen.join() === '255,17,53,255' && reported.length === 1);
    }

    console.log(failed ? failed + ' check(s) failed' : 'all network worker prototype checks passed');
    process.exit(failed ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + (e && e.stack || e)); process.exit(1); });
