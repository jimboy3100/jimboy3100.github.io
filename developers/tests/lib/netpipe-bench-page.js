/* In-page A/B benchmark of the network worker prototype (lib/netpipe.js) in the real client.
 * An expression for the dense-world benchmark's --eval (see developers/tests/netpipe-bench.js):
 * runs while a bench scene is set up (stand-in socket, nothing sent to a server), with the
 * scene's own packets paused and the renderer still drawing every frame.
 *
 * Stream: seeded world (lib/bench-scene.js), first a full cell update then one delta per tick,
 * each sent as an opcode 255 LZ4 packet (inner opcode 16), as agar.io sends most of its traffic.
 *  A (now):    legendmod.handleMessage(view) at arrival, decompressMessage on the main thread.
 *  B (worker): pipe.push(raw) at arrival; the worker decodes; the result is applied through the
 *              same legendmod.handleMessage, decompressMessage answering with the worker's bytes.
 * Rounds alternate A, B, A, B ... in the same page. Each round starts from an empty world
 * (opcode 18, not timed) and sends the same packets at the same 40 ms ticks.
 * Per packet: main-thread ms (A: the whole handler; B: push + apply; the worker message event
 * itself cannot be timed from script), arrival-to-applied ms, and whether a frame was drawn
 * between arrival and application (a frame later on screen). Burst: 30 packets at once. */
(async function () {
    var T = function () { return performance.now(); };
    var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    if (!window.LMNetPipe) await new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.charset = 'utf-8';
        s.src = 'https://www.legendmod.ml/developers/tests/lib/netpipe.js?t=' + Date.now();
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
    });
    var NP = window.LMNetPipe, BD = window.LMBenchDense, l = window.legendmod;
    var opts = window._lmNetBenchOpts || {};
    var ROUNDS = opts.rounds || 6, PER = opts.packets || 120, TICK = 40;
    BD.pause(true);
    await sleep(300);
    var decSrc = l.decompressMessage.toString();
    if (decSrc.indexOf('MAX_COMPRESSED_PACKET_SIZE') < 0) return { error: 'decompressMessage is wrapped, cannot take its source' };
    var orig = l.decompressMessage;
    var owned = Object.prototype.hasOwnProperty.call(l, 'decompressMessage');

    function packets(spec, n) {
        var w = BD.createWorld(BD.scene(spec)), out = [], inners = [], inB = 0, outB = 0;
        for (var i = 0; i < n; i++) {
            if (i) BD.step(w);
            var inner = new Uint8Array(BD.encodeUpdate(w, 0, i === 0));
            var f = NP.frame255(inner);
            out.push(f);
            inners.push(inner);
            inB += f.byteLength; outB += inner.length;
        }
        return { list: out, inners: inners, avgCompressed: Math.round(inB / n), avgDecoded: Math.round(outB / n), first: [out[0].byteLength, new DataView(out[0]).getUint32(1, true)] };
    }

    /* frames: timestamps of rAF callbacks */
    var frames = [], rafOn = true;
    (function f() { if (!rafOn) return; frames.push(T()); requestAnimationFrame(f); })();
    function frameBetween(a, b) {
        for (var i = frames.length - 1; i >= 0; i--) { var t = frames[i]; if (t <= a) return false; if (t < b) return true; }
        return false;
    }
    /* time inside decompressMessage and updateCells (A only, to show where the time goes) */
    var decMs = 0, updMs = 0;
    var origUpd = l.updateCells, updOwned = Object.prototype.hasOwnProperty.call(l, 'updateCells');

    var hub = new NP.Hub(NP.browserHost(NP.workerSource(decSrc)));
    await new Promise(function (res) {
        var w = hub.host.worker, prev = w.onmessage;
        w.onmessage = function (e) { if (e.data && e.data.warm !== undefined) { if (e.data.warm) { w.onmessage = prev; res(); } else w.postMessage({ warm: true }); } else prev(e); };
        w.postMessage({ warm: true });
    });
    var cur = null; /* the worker's answer for the view being applied */
    l.decompressMessage = function (m) {
        var p = cur;
        if (p && p.view === m) {
            cur = null;
            if (p.pre.error) { var er = new RangeError(p.pre.error.message); throw er; }
            return new window.buffer.Buffer(p.pre.out);
        }
        var t0 = T();
        try { return orig.call(this, m); } finally { decMs += T() - t0; }
    };
    l.updateCells = function () { var t0 = T(); try { return origUpd.apply(this, arguments); } finally { updMs += T() - t0; } };

    var rec = null; /* per-round records */
    var applyT0 = 0;
    var pipe = hub.pipe({
        apply: function (view, pre) {
            applyT0 = T();
            if (pre) cur = { view: view, pre: pre };
            try { l.handleMessage(view); } finally { cur = null; }
        },
        onApplied: function (e) {
            var i = e.q - rec.q0;
            rec.main[i] += e.applied - applyT0;
            rec.e2e[i] = e.applied - e.t;
            rec.late[i] = frameBetween(e.t, e.applied) ? 1 : 0;
            rec.done++;
        }
    });

    function stats(a) {
        var s = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; }), n = s.length, sum = 0;
        for (var i = 0; i < n; i++) sum += s[i];
        var p = function (q) { return s.length ? Math.round(BD.percentile(s, q) * 1000) / 1000 : 0; };
        return { mean: Math.round(sum / Math.max(1, n) * 1000) / 1000, p50: p(50), p95: p(95), p99: p(99), max: p(100) };
    }
    function clearWorld() { try { l.handleMessage(new DataView(new Uint8Array([18]).buffer)); } catch (e) { } }

    async function round(mode, set) {
        clearWorld();
        await sleep(120);
        var n = set.list.length;
        rec = { main: new Float64Array(n), e2e: new Float64Array(n), late: new Uint8Array(n), done: 0, k: 0, q0: pipe.seq + 1 };
        decMs = 0; updMs = 0;
        var t0 = T(), i = 0;
        await new Promise(function (resolve) {
            function tick() {
                var copy = set.list[i].slice(0); /* the socket hands a fresh buffer every time */
                rec.k = i;
                var ta = T();
                if (mode === 'A') {
                    l.handleMessage(new DataView(copy));
                    var tb = T();
                    rec.main[i] = tb - ta; rec.e2e[i] = tb - ta; rec.done++;
                } else {
                    pipe.push(copy);
                    rec.main[i] += T() - ta;
                }
                i++;
                if (i < n) setTimeout(tick, Math.max(0, t0 + i * TICK - T()));
                else resolve();
            }
            tick();
        });
        for (var w = 0; w < 100 && rec.done < n; w++) await sleep(10);
        var late = 0;
        for (var j = 0; j < n; j++) late += rec.late[j];
        return { mode: mode, packets: n, applied: rec.done, mainMs: stats(rec.main), e2eMs: stats(rec.e2e), frameLater: late,
            mainTotalMs: Math.round(Array.prototype.reduce.call(rec.main, function (a, b) { return a + b; }, 0) * 100) / 100,
            decodeMsTotal: Math.round(decMs * 100) / 100, updateCellsMsTotal: Math.round(updMs * 100) / 100 };
    }
    /* Upper bound of a worker parse: only reading the records of the update into typed arrays
     * (what a worker could hand over; creating and updating the Cell objects, names, skins and
     * colours stays on the main thread). The private-server layout of lib/bench-scene.js. */
    var scanOut = { id: new Uint32Array(1 << 16), x: new Int32Array(1 << 16), y: new Int32Array(1 << 16), r: new Uint16Array(1 << 16), f: new Uint8Array(1 << 16) };
    function scan(u) {
        var d = new DataView(u.buffer, u.byteOffset, u.byteLength), o = 3, n = 0;
        for (;;) {
            var id = d.getUint32(o, true); o += 4;
            if (!id) break;
            scanOut.id[n] = id; scanOut.x[n] = d.getInt32(o, true); scanOut.y[n] = d.getInt32(o + 4, true); scanOut.r[n] = d.getUint16(o + 8, true);
            var fl = scanOut.f[n] = u[o + 10]; o += 11;
            if (fl & 2) o += 3;
            if (fl & 4) { while (u[o]) o++; o++; }
            if (fl & 8) { while (u[o]) o++; o++; }
            if (fl & 128) o += 3;
            n++;
        }
        var rm = d.getUint16(o, true);
        return n + rm;
    }
    function scanMs(set) {
        var best = Infinity, sink = 0;
        for (var k = 0; k < 7; k++) {
            var t0 = T();
            for (var i = 0; i < set.inners.length; i++) sink += scan(set.inners[i]);
            best = Math.min(best, T() - t0);
        }
        return { perPacketMs: Math.round(best / set.inners.length * 1000) / 1000, records: sink / 7 / set.inners.length | 0 };
    }
    /* 30 packets arriving in one task (after a network hiccup): how long the main thread is busy */
    async function burst(mode, set) {
        clearWorld();
        await sleep(120);
        var n = Math.min(30, set.list.length), copies = [];
        for (var i = 0; i < n; i++) copies.push(set.list[i].slice(0));
        rec = { main: new Float64Array(n), e2e: new Float64Array(n), late: new Uint8Array(n), done: 0, k: 0, q0: pipe.seq + 1 };
        var t0 = T();
        for (i = 0; i < n; i++) { rec.k = i; if (mode === 'A') { l.handleMessage(new DataView(copies[i])); rec.done++; } else pipe.push(copies[i]); }
        var tLoop = T() - t0;
        for (var w = 0; w < 200 && rec.done < n; w++) await sleep(5);
        var tAll = T() - t0;
        return { mode: mode, packets: n, arrivalTaskMs: Math.round(tLoop * 100) / 100, allAppliedMs: Math.round(tAll * 100) / 100,
            applyMsTotal: mode === 'A' ? Math.round(tLoop * 100) / 100 : Math.round(Array.prototype.reduce.call(rec.main, function (a, b) { return a + b; }, 0) * 100) / 100 };
    }

    var out = { opts: { rounds: ROUNDS, packets: PER, tick: TICK }, sets: {} };
    try {
        var specs = opts.specs || [{ name: 'dense b1000-f10000', bodies: 1000, food: 10000 }, { name: 'light b100-f2000', bodies: 100, food: 2000 }];
        for (var si = 0; si < specs.length; si++) {
            var set = packets(specs[si], PER);
            var res = { avgCompressedBytes: set.avgCompressed, avgDecodedBytes: set.avgDecoded, firstPacket: set.first, rounds: [], bursts: [] };
            /* one round of each, not kept: compiled code and caches warm for both */
            await round('A', set); await round('B', set);
            for (var r = 0; r < ROUNDS; r++) res.rounds.push(await round(r % 2 ? 'B' : 'A', set));
            for (r = 0; r < 4; r++) res.bursts.push(await burst(r % 2 ? 'B' : 'A', set));
            res.scanOnly = scanMs(set);
            res.pipe = JSON.parse(JSON.stringify(pipe.stats));
            out.sets[specs[si].name] = res;
        }
        out.calibrateMs = BD.calibrate(T);
    } catch (e) {
        out.error = String(e && e.stack || e);
    } finally {
        rafOn = false;
        if (owned) l.decompressMessage = orig; else delete l.decompressMessage;
        if (updOwned) l.updateCells = origUpd; else delete l.updateCells;
        try { pipe.close(); hub.host.terminate(); } catch (e) { }
        clearWorld();
        BD.pause(false);
    }
    return out;
})()
