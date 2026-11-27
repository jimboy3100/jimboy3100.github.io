/* Network-off-the-main-thread PROTOTYPE (not loaded by the client): the LZ4 packets (opcode 255)
 * of one connection are decompressed in a worker, everything is still applied on the main thread
 * in arrival order. Measured by developers/tests/netpipe-bench.js, checked by
 * developers/tests/netpipe.js. Kept under developers/ because the measured benefit did not
 * justify a second packet path in ogario.v4.js (numbers in netpipe-bench.js).
 *
 * The worker runs the client's own decompressMessage (its source text, taken from
 * ogario.v4.js or legendmod.decompressMessage.toString()), so limits (8 MiB in, 32 MiB out,
 * ratio 256), the WASM / JS decoder split and every rejection stay exactly the client's.
 *
 * Contract of a pipe (one per connection):
 *  - push(raw) for every received message in arrival order; raw is the socket's ArrayBuffer.
 *    prepare(raw) turns it into the DataView handleMessage takes (decryption stays on the main
 *    thread). It runs at arrival only while every packet still queued is an LZ4 one (opcode 255
 *    only carries cell updates and the border, never a key change); otherwise it runs when the
 *    packet reaches the head of the queue, after the packets before it were applied, so key
 *    evolution (opcode 241) is seen exactly as now.
 *  - apply(view, pre) is called once per packet, in arrival order, never in the middle of
 *    another packet. pre is undefined (decode on the main thread, as now) or
 *    { out: ArrayBuffer } / { error: {name, message} } from the worker.
 *  - Nothing is dropped and nothing is reordered: with the queue empty a packet that needs no
 *    worker is applied at once, at arrival, as now; a packet behind one in the worker waits.
 *  - Byte ownership: the worker gets a copy (transferred, so one copy only), the view handed to
 *    apply is the original, never detached: the replay recorder keeps it as now.
 *  - Backpressure: at most maxInflight packets / maxInflightBytes compressed bytes in the
 *    worker; beyond that a packet stays queued on the main thread and is decoded there when its
 *    turn comes (bounded worker memory, no drop, same order).
 *  - flush(): applies everything queued now, decoding on the main thread whatever is still in
 *    the worker (late results are ignored by generation). Called before a close / socket
 *    replacement is handled, so every packet that arrived is applied before it, as now.
 *  - A failed worker (error event, timeout) makes the pipe flush and go synchronous for good. */
(function (root) {
    'use strict';

    /* the method text "decompressMessage(message) { ... }" (or a function) as a function expression */
    function asFunctionText(src) {
        src = String(src).trim();
        return /^function\b/.test(src) ? src : 'function ' + src;
    }
    /* the method from the core's source text */
    function extractDecompress(coreSrc) {
        var nl = coreSrc.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
        var a = coreSrc.indexOf('        decompressMessage(message) {' + nl);
        var b = coreSrc.indexOf(nl + '        },' + nl, a);
        if (a < 0 || b < 0) throw new Error('decompressMessage not found');
        return coreSrc.slice(a, b + nl.length + 9).trim();
    }

    /* Worker script: a minimal stand-in for window.buffer.Buffer (what decompressMessage uses:
     * new Buffer(arrayBuffer[, offset, length]), .length, .readUInt32LE) and the client's method.
     * Works as a browser worker (self) and as a Node worker_threads worker (parentPort). */
    function workerSource(decompressText) {
        return [
            '"use strict";',
            'var window = typeof self !== "undefined" ? self : globalThis;',
            'function WBuf(ab, off, len) { off = off || 0; var u = new Uint8Array(ab, off, len === undefined ? ab.byteLength - off : len);',
            '  u.readUInt32LE = function (o) { return (this[o] | (this[o + 1] << 8) | (this[o + 2] << 16)) + this[o + 3] * 16777216; }; return u; }',
            'window.buffer = { Buffer: WBuf };',
            'var decompressMessage = ' + asFunctionText(decompressText) + ';',
            'var port = typeof self !== "undefined" && typeof self.postMessage === "function" ? self : require("worker_threads").parentPort;',
            'function onMsg(m) {',
            '  if (m && m.warm) { try { decompressMessage(new DataView(new Uint8Array([255, 1, 0, 0, 0, 16, 0]).buffer)); } catch (e) { } port.postMessage({ warm: !!window._lz4wasm }); return; }',
            '  var t0 = performance.now(), r;',
            '  try { r = decompressMessage(new DataView(m.b)); }',
            '  catch (e) { port.postMessage({ p: m.p, g: m.g, q: m.q, error: { name: e && e.name || "Error", message: e && e.message || String(e) }, wt: performance.now() - t0 }); return; }',
            '  var out = r.byteOffset === 0 && r.byteLength === r.buffer.byteLength ? r.buffer : r.buffer.slice(r.byteOffset, r.byteOffset + r.byteLength);',
            '  port.postMessage({ p: m.p, g: m.g, q: m.q, out: out, wt: performance.now() - t0 }, [out]);',
            '}',
            'if (typeof port.on === "function") port.on("message", onMsg); else self.onmessage = function (e) { onMsg(e.data); };'
        ].join('\n');
    }

    /* One worker shared by every connection's pipe. host: { post(msg, transfer), onMessage(fn),
     * onError(fn), terminate() } (a browser Worker or a Node worker_threads Worker, see the
     * adapters below). */
    function Hub(host, opts) {
        opts = opts || {};
        this.host = host;
        this.pipes = {};
        this.nextId = 1;
        this.failed = false;
        this.timeoutMs = opts.timeoutMs || 2000;
        var self = this;
        host.onMessage(function (m) {
            if (!m || m.warm !== undefined) return;
            var p = self.pipes[m.p];
            if (p) p._result(m);
        });
        host.onError(function (e) { self.fail(e); });
    }
    Hub.prototype.fail = function (e) {
        if (this.failed) return;
        this.failed = true;
        this.failure = e;
        var ids = Object.keys(this.pipes);
        for (var i = 0; i < ids.length; i++) this.pipes[ids[i]]._hubFailed();
        try { this.host.terminate(); } catch (err) { }
    };
    Hub.prototype.pipe = function (opts) {
        var p = new Pipe(this, this.nextId++, opts);
        this.pipes[p.id] = p;
        return p;
    };

    function Pipe(hub, id, opts) {
        this.hub = hub;
        this.id = id;
        this.apply = opts.apply;
        this.prepare = opts.prepare || function (raw) { return new DataView(raw); };
        this.minBytes = opts.minBytes || 0;
        this.maxInflight = opts.maxInflight || 64;
        this.maxInflightBytes = opts.maxInflightBytes || 8 * 1024 * 1024;
        this.now = opts.now || function () { return typeof performance !== 'undefined' ? performance.now() : Date.now(); };
        this.gen = 1;
        this.seq = 0;
        this.q = [];            /* entries in arrival order */
        this.inflight = 0;
        this.inflightBytes = 0;
        this.sync = !!hub.failed; /* true: no worker, every packet as now */
        this.stats = { pushed: 0, applied: 0, offloaded: 0, bypassed: 0, flushedDecodes: 0, staleResults: 0, maxQueue: 0, maxInflight: 0, maxInflightBytes: 0, workerMs: 0 };
        this.onApplied = opts.onApplied || null; /* (entry) after apply: for measurements */
    }
    /* entry states */
    var RAW = 0,      /* not prepared yet: waits for the packets before it */
        READY = 1,    /* prepared, applied (decoded on the main thread if needed) at its turn */
        WORKING = 2,  /* prepared, the copy is in the worker */
        DONE = 3;     /* prepared, worker result in pre */

    Pipe.prototype.push = function (raw) {
        var st = this.stats, t = this.now();
        st.pushed++;
        var e = { q: ++this.seq, op: -1, t: t, raw: raw, view: null, pre: undefined, st: RAW };
        /* decrypt at arrival (as now) unless a queued packet could still change the key; a
         * packet not prepared yet has an unknown opcode (-1) */
        if (this._keyNeutralUpTo(this.q.length)) this._prepare(e);
        /* nothing queued and nothing for the worker: applied now, exactly as before */
        if (!this.q.length && e.st === READY) { this._applyOne(e); return; }
        this.q.push(e);
        if (this.q.length > st.maxQueue) st.maxQueue = this.q.length;
        if (this.q.length === 1) this._drain();
        else this._watch();
    };
    Pipe.prototype._prepare = function (e) {
        e.view = this.prepare(e.raw);
        e.raw = null;
        e.st = READY;
        e.op = e.view && e.view.byteLength ? e.view.getUint8(0) : -1;
        if (this.sync || e.op !== 255 || e.view.byteLength < this.minBytes) return;
        var n = e.view.byteLength;
        if (this.inflight >= this.maxInflight || this.inflightBytes + n > this.maxInflightBytes) { this.stats.bypassed++; return; }
        /* the worker gets its own copy: the view stays whole for apply and the replay recorder */
        var copy = e.view.buffer.slice(e.view.byteOffset, e.view.byteOffset + n);
        e.st = WORKING;
        e.bytes = n;
        e.posted = this.now();
        this.inflight++;
        this.inflightBytes += n;
        var st = this.stats;
        st.offloaded++;
        if (this.inflight > st.maxInflight) st.maxInflight = this.inflight;
        if (this.inflightBytes > st.maxInflightBytes) st.maxInflightBytes = this.inflightBytes;
        try {
            this.hub.host.post({ p: this.id, g: this.gen, q: e.q, b: copy }, [copy]);
        } catch (err) {
            this._release(e);
            e.st = READY;
            this.hub.fail(err);
        }
    };
    Pipe.prototype._release = function (e) {
        if (e.bytes) { this.inflight--; this.inflightBytes -= e.bytes; e.bytes = 0; }
    };
    Pipe.prototype._result = function (m) {
        if (m.g !== this.gen) { this.stats.staleResults++; return; }
        var e = null;
        for (var i = 0; i < this.q.length; i++) if (this.q[i].q === m.q) { e = this.q[i]; break; }
        if (!e || e.st !== WORKING) { this.stats.staleResults++; return; }
        this._release(e);
        e.pre = m.error ? { error: m.error } : { out: m.out };
        e.st = DONE;
        e.got = this.now();
        this.stats.workerMs += m.wt || 0;
        if (this.q[0] === e) this._drain();
    };
    /* applies the head of the queue while it can; a packet in the worker stops it */
    Pipe.prototype._drain = function () {
        var errs = null;
        while (this.q.length) {
            var e = this.q[0];
            if (e.st === RAW) this._prepare(e);
            /* a post that failed flushed the queue (e included) */
            if (this.q[0] !== e) continue;
            if (e.st === WORKING) { this._watch(); break; }
            this.q.shift();
            try { this._applyOne(e); } catch (err) { (errs || (errs = [])).push(err); }
            /* the next RAW ones could not be prepared before this one was applied */
            for (var i = 0; i < this.q.length && this.q[i].st === RAW && this._keyNeutralUpTo(i); i++) this._prepare(this.q[i]);
        }
        if (errs) rethrow(errs);
    };
    /* a worker that does not answer must not hold the connection: after timeoutMs the head
     * packet still in the worker fails the worker (flush, synchronous from then on) */
    Pipe.prototype._watch = function () {
        if (this._wd || !this.q.length) return;
        var self = this, head = this.q[0];
        this._wd = setTimeout(function () {
            self._wd = null;
            if (self.q[0] === head && head.st === WORKING) self.hub.fail(new Error('network worker timeout'));
            else self._watch();
        }, this.hub.timeoutMs);
    };
    Pipe.prototype._keyNeutralUpTo = function (k) {
        for (var i = 0; i < k; i++) if (this.q[i].op !== 255) return false;
        return true;
    };
    Pipe.prototype._applyOne = function (e) {
        this.stats.applied++;
        try { this.apply(e.view, e.pre); }
        finally {
            if (this.onApplied) { e.applied = this.now(); this.onApplied(e); }
            e.pre = undefined;
        }
    };
    /* everything queued is applied now, in order; worker results that come later are ignored */
    Pipe.prototype.flush = function () {
        var errs = null;
        this.gen++;
        while (this.q.length) {
            var e = this.q.shift();
            if (e.st === RAW) { e.view = this.prepare(e.raw); e.raw = null; }
            if (e.st === WORKING) { this._release(e); e.pre = undefined; this.stats.flushedDecodes++; }
            try { this._applyOne(e); } catch (err) { (errs || (errs = [])).push(err); }
        }
        this.inflight = 0;
        this.inflightBytes = 0;
        if (errs) rethrow(errs);
    };
    Pipe.prototype._hubFailed = function () {
        this.sync = true;
        this.flush();
    };
    Pipe.prototype.close = function () {
        this.flush();
        delete this.hub.pipes[this.id];
    };
    /* a handler error must not stop the packets after it; it is still reported */
    function rethrow(errs) {
        for (var i = 0; i < errs.length; i++) {
            (function (e) {
                if (typeof root.reportError === 'function') root.reportError(e);
                else setTimeout(function () { throw e; }, 0);
            })(errs[i]);
        }
    }

    /* host adapters */
    function browserHost(src) {
        var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        var w = new Worker(url);
        return {
            worker: w, url: url,
            post: function (m, t) { w.postMessage(m, t); },
            onMessage: function (fn) { w.onmessage = function (e) { fn(e.data); }; },
            onError: function (fn) { w.onerror = function (e) { if (e && e.preventDefault) e.preventDefault(); fn(e); }; },
            terminate: function () { w.terminate(); URL.revokeObjectURL(url); }
        };
    }
    function nodeHost(src) {
        var W = require('worker_threads').Worker;
        var w = new W(src, { eval: true });
        return {
            worker: w,
            post: function (m, t) { w.postMessage(m, t); },
            onMessage: function (fn) { w.on('message', fn); },
            onError: function (fn) { w.on('error', fn); },
            terminate: function () { return w.terminate(); }
        };
    }

    /* LZ4 block compressor, only to build test fixtures and benchmark packets (greedy hash
     * matcher; last 5 bytes literal, no match starts in the last 12, as the format requires) */
    function lz4Compress(src) {
        var n = src.length, out = new Uint8Array(n + ((n / 255) | 0) + 16), op = 0, anchor = 0, ip = 0;
        var table = new Int32Array(1 << 16).fill(-1), mflimit = n - 12;
        function lit(len) { if (len >= 15) { len -= 15; while (len >= 255) { out[op++] = 255; len -= 255; } out[op++] = len; } }
        while (ip < mflimit) {
            var h = Math.imul(src[ip] | (src[ip + 1] << 8) | (src[ip + 2] << 16) | (src[ip + 3] << 24), 2654435761) >>> 16;
            var ref = table[h];
            table[h] = ip;
            if (ref >= 0 && ip - ref <= 65535 && src[ref] === src[ip] && src[ref + 1] === src[ip + 1] && src[ref + 2] === src[ip + 2] && src[ref + 3] === src[ip + 3]) {
                var ml = 4, lim = n - 5;
                while (ip + ml < lim && src[ref + ml] === src[ip + ml]) ml++;
                var ll = ip - anchor;
                out[op++] = (Math.min(ll, 15) << 4) | Math.min(ml - 4, 15);
                lit(ll);
                out.set(src.subarray(anchor, ip), op); op += ll;
                out[op++] = (ip - ref) & 255; out[op++] = (ip - ref) >>> 8;
                if (ml - 4 >= 15) lit(ml - 4);
                ip += ml;
                anchor = ip;
            } else ip++;
        }
        var last = n - anchor;
        out[op++] = Math.min(last, 15) << 4;
        lit(last);
        out.set(src.subarray(anchor, n), op); op += last;
        return out.slice(0, op);
    }
    /* an opcode 255 packet carrying `inner` (inner[0] is the sub opcode) */
    function frame255(inner) {
        var c = lz4Compress(inner), b = new Uint8Array(5 + c.length);
        b[0] = 255;
        new DataView(b.buffer).setUint32(1, inner.length, true);
        b.set(c, 5);
        return b.buffer;
    }

    var api = { extractDecompress: extractDecompress, asFunctionText: asFunctionText, workerSource: workerSource, Hub: Hub, Pipe: Pipe,
        browserHost: browserHost, nodeHost: nodeHost, lz4Compress: lz4Compress, frame255: frame255 };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.LMNetPipe = api;
})(typeof window !== 'undefined' ? window : globalThis);
