/* Replay Studio for Legend Mod: a timeline with automatic bookmarks, playback at the recorded
 * speed (0.25x-4x) forwards or backwards, pause and packet-by-packet stepping, colour filters,
 * instant replay of the last seconds, a replay library in IndexedDB and clip export (.lm).
 * It plays every replay: the Replay button, a replay^ server token, Death recap links and
 * ?replay= links (with ?replayStart= / ?replayEnd= packet numbers) all open it.
 *
 * Loaded the first time it is opened (window.lmReplayStudio in ogario.v4.js). The recording side
 * lives in ogario.v4.js: every recording (window.RecordedProtocol[key]) gets ._lm with the time of
 * each packet and a few samples (see window._lmRecM there). Old recordings and .lm files without
 * these times still play: their packets are spaced 40 ms apart (shown as "estimated").
 *
 * .lm files stay readable by older versions: the file is still a JSON array of packets (binary
 * strings) with the game info array last; the Studio data is one extra object at the end of
 * that info array ({lmrs: 1, ...}), which older versions never read.
 *
 * Seeking back empties the world and replays the packets from the newest complete starting point
 * (packet 0, or a "clear all" packet the playback has passed: see CARRY) up to the target, in slices
 * so the page stays responsive; forward seeks only run ahead. Playing backwards goes in such steps
 * (the packets only say what changed, so they cannot be undone one by one); it is not continuous. */
(function () {
    'use strict';
    if (window._lmReplayStudioLoaded) return;
    window._lmReplayStudioLoaded = true;

    /* ------------------------------------------------------------------ */
    /* Pure helpers (unit tested: developers/tests/replaystudio.js)        */
    /* ------------------------------------------------------------------ */

    var EST_MS = 40;                  /* packet spacing assumed for recordings without times */
    var MAX_PACKETS = 200000;
    var MAX_SPAN = 24 * 3600 * 1000;  /* longest believable recording */
    var EV_TYPES = 'dskvpf';
    /* Size budgets for replays read from .lm files and ?replay= links (lib.LIMITS; scripts may
     * change them). A recording stops at 90000 packets or 100 MiB of packets (lmRecRoom in
     * ogario.v4.js); older versions had no byte limit, hence the room above that. A .lm file is
     * 2 to 6 times its packet bytes (3.7 for extras/jim.lm, about 2.1 for compressed agar.io
     * packets, 6 when every byte is a control byte written as \u00XX), so a 100 MiB recording is
     * a file of about 200-370 MiB; 512 MiB is also about the longest text a browser tab holds. */
    var LIMITS = {
        packets: MAX_PACKETS,          /* packets in one replay */
        packetBytes: 4 * 1048576,      /* one packet (a live WebSocket message is far smaller) */
        bytes: 256 * 1048576,          /* all packets of one replay together */
        fileBytes: 512 * 1048576       /* a .lm file, or a link's download, as text */
    };
    function limitErr(what) { var e = new Error('replay too large: ' + what); e.lmBig = true; return e; }
    function staleErr() { var e = new Error('replaced by a newer request'); e.lmStale = true; return e; }

    function isNum(v) { return typeof v === 'number' && isFinite(v); }

    /* absolute times -> whole-ms deltas (smaller in JSON) */
    function encodeTimes(t, n) {
        n = n == null ? t.length : Math.min(n, t.length);
        var out = new Array(n), prev = 0;
        for (var i = 0; i < n; i++) {
            var v = +t[i];
            if (!isNum(v) || v < prev) v = prev;
            v = Math.round(v);
            out[i] = v - prev;
            prev = v;
        }
        return out;
    }
    /* deltas -> absolute times; null when they do not fit n packets or are not valid */
    function decodeTimes(d, n) {
        if (!Array.isArray(d) || d.length !== n) return null;
        var out = new Array(n), acc = 0;
        for (var i = 0; i < n; i++) {
            var v = d[i];
            if (!isNum(v) || v < 0) return null;
            acc += v;
            if (acc > MAX_SPAN) return null;
            out[i] = acc;
        }
        return out;
    }
    /* live times (may lag the packets by one while a packet is handled): non-decreasing copy
     * of the first n entries, or null when too many are missing (then estimate). */
    function cleanTimes(t, n) {
        if (!t || !n) return null;
        var out = new Array(n), prev = 0, bad = 0;
        for (var i = 0; i < n; i++) {
            var v = t[i];
            if (!isNum(v)) { bad++; v = prev; }
            if (v < prev) v = prev;
            out[i] = v;
            prev = v;
        }
        return bad > Math.max(2, n * 0.02) ? null : out;
    }
    function estTimes(n) {
        var out = new Array(n);
        for (var i = 0; i < n; i++) out[i] = i * EST_MS;
        return out;
    }
    /* number of packets whose time is <= ms (the playback position for that time) */
    function posAtTime(t, n, ms) {
        var lo = 0, hi = n;
        while (lo < hi) {
            var mid = (lo + hi) >> 1;
            if (t[mid] <= ms) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
    /* first packet index whose time is >= ms */
    function firstAtOrAfter(t, n, ms) {
        var lo = 0, hi = n;
        while (lo < hi) {
            var mid = (lo + hi) >> 1;
            if (t[mid] < ms) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
    /* newest checkpoint index <= i (cps sorted, starts with 0) */
    function checkpointBefore(cps, i) {
        var lo = 0, hi = cps.length - 1, best = 0;
        while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            if (cps[mid] <= i) { best = cps[mid]; lo = mid + 1; } else hi = mid - 1;
        }
        return best;
    }

    /* flat numeric tuples: keeps whole valid tuples only, at most max of them */
    function cleanFlat(a, stride, max, typeAt) {
        if (!Array.isArray(a)) return [];
        var out = [];
        for (var i = 0; i + stride <= a.length && out.length < max * stride; i += stride) {
            var ok = true;
            for (var j = 0; j < stride; j++) {
                var v = a[i + j];
                if (j === typeAt) { if (typeof v !== 'string' || v.length !== 1 || EV_TYPES.indexOf(v) === -1) { ok = false; break; } }
                else if (!isNum(v) || Math.abs(v) > 1e9) { ok = false; break; }
            }
            if (ok && a[i] >= 0) for (j = 0; j < stride; j++) out.push(a[i + j]);
        }
        return out;
    }
    /* Studio data for a file or library entry: { t (deltas), s, e, c, start } */
    function makeSidecar(meta, n, extra) {
        var side = { lmrs: 1, t: meta && meta.t ? encodeTimes(cleanTimes(meta.t, n) || estTimes(n), n) : null };
        side.s = meta && meta.s ? meta.s.slice() : [];
        side.e = meta && meta.e ? meta.e.slice() : [];
        side.c = meta && meta.c ? meta.c.slice() : [];
        if (!side.t) delete side.t;
        if (extra && extra.start > 0) side.start = extra.start;
        if (protoOk(meta && meta.p)) side.p = meta.p;
        return side;
    }
    /* p: the protocol of the server the packets came from (legendmod.serverType when it was
     * recorded, one of window.LM_REPLAY_PROTOCOLS in ogario.v4.js). Not the replay connection,
     * which is never the original server. Files without it (older ones) guess it from the name. */
    function protoOk(p) {
        var list = window.LM_REPLAY_PROTOCOLS;
        return typeof p === 'string' && !!list && list.indexOf(p) !== -1;
    }
    /* validates an untrusted sidecar (files can come from links); returns
     * { t: absolute times or null, est, s, e, c, start, p } */
    function readSidecar(o, n) {
        var r = { t: null, est: true, s: [], e: [], c: [], start: 0, p: '' };
        if (!o || typeof o !== 'object' || Array.isArray(o) || o.lmrs !== 1) return r;
        var t = decodeTimes(o.t, n);
        if (t) { r.t = t; r.est = false; }
        r.s = cleanFlat(o.s, 4, 100000);
        r.e = cleanFlat(o.e, 3, 60000, 1);
        r.c = cleanFlat(o.c, 3, 150000);
        if (Number.isInteger(o.start) && o.start > 0 && o.start < n) r.start = o.start;
        if (protoOk(o.p)) r.p = o.p;
        return r;
    }
    /* readSidecar's form (an in-memory recording) back to the stored form */
    function sideOut(rs, n) {
        var o = { lmrs: 1, s: rs.s || [], e: rs.e || [], c: rs.c || [] };
        if (rs.t && !rs.est) o.t = encodeTimes(rs.t, n);
        if (rs.start > 0) o.start = rs.start;
        if (protoOk(rs.p)) o.p = rs.p;
        return o;
    }
    function findSidecar(spec) {
        if (!Array.isArray(spec)) return null;
        for (var i = spec.length - 1; i >= 0; i--) {
            var o = spec[i];
            if (o && typeof o === 'object' && !Array.isArray(o) && o.lmrs === 1) return o;
        }
        return null;
    }

    /* Bookmarks from the samples and events (times in ms from the recording start). */
    function detectBookmarks(side, opts) {
        opts = opts || {};
        var e = side.e || [], s = side.s || [], marks = [];
        var endT = isNum(opts.endT) ? opts.endT : Infinity;
        var ev = function (type) {
            var out = [];
            for (var i = 0; i + 2 < e.length; i += 3) if (e[i + 1] === type && e[i] <= endT) out.push([e[i], e[i + 2]]);
            /* recorded in order; a file may not be */
            return out.sort(function (a, b) { return a[0] - b[0]; });
        };
        /* events of one type close together are one bookmark */
        var group = function (list, gap, kind, minN) {
            var cur = null;
            list.forEach(function (x) {
                if (cur && x[0] - cur.last <= gap) { cur.n++; cur.v += x[1]; cur.last = x[0]; return; }
                if (cur && cur.n >= minN) marks.push({ t: cur.t, k: kind, v: cur.v, n: cur.n });
                cur = { t: x[0], last: x[0], v: x[1], n: 1 };
            });
            if (cur && cur.n >= minN) marks.push({ t: cur.t, k: kind, v: cur.v, n: cur.n });
        };
        var deaths = ev('d');
        deaths.forEach(function (d) { marks.push({ t: d[0], k: 'death', v: d[1], n: 1 }); });
        var kills = ev('k');
        group(kills, 1500, 'kill', 1);
        var viruses = ev('v');
        group(viruses, 1000, 'virus', 1);
        /* big split: a burst of 2+ splits within 350 ms (double split or more) */
        var splits = ev('p'), feeds = ev('f'), cur = null;
        var flushSplit = function () { if (cur && cur.n >= 2) marks.push({ t: cur.t, k: 'split', v: cur.n, n: cur.n }); };
        splits.forEach(function (x) {
            if (cur && x[0] - cur.t <= 350) { cur.n += Math.max(1, x[1]); return; }
            flushSplit();
            cur = { t: x[0], n: Math.max(1, x[1]) };
        });
        flushSplit();
        var near = function (list, t, before, after) {
            for (var i = 0; i < list.length; i++) if (list[i][0] >= t - before && list[i][0] <= t + after) return true;
            return false;
        };
        var splitMarks = marks.filter(function (m) { return m.k === 'split'; }).map(function (m) { return [m.t]; });
        /* from the samples: cells jump (splits not sent by this client), 1st place, big loss/gain */
        var prev = null, maxWin = [], wasFirst = false, lostFirstAt = -Infinity, lossCool = -Infinity, gainCool = -Infinity;
        var noKillEvents = !kills.length;
        for (var i = 0; i + 3 < s.length; i += 4) {
            var t = s[i], m = s[i + 1], c = s[i + 2], pos = s[i + 3];
            if (t > endT) break;
            if (prev && t - prev.t <= 700 && c - prev.c >= 6 && !near(splitMarks, t, 1000, 1000) && !near(viruses, t, 700, 100)) {
                marks.push({ t: prev.t, k: 'split', v: c, n: c - prev.c });
                splitMarks.push([prev.t]);
            }
            if (pos === 1 && !wasFirst && t - lostFirstAt >= 5000) marks.push({ t: t, k: 'top1', v: m, n: 1 });
            if (pos === 1) wasFirst = true;
            else if (wasFirst) { wasFirst = false; lostFirstAt = t; }
            /* window of the last 2 s */
            while (maxWin.length && t - maxWin[0][0] > 2000) maxWin.shift();
            var hi = 0, lo = Infinity;
            for (var w = 0; w < maxWin.length; w++) { if (maxWin[w][1] > hi) hi = maxWin[w][1]; if (maxWin[w][1] < lo) lo = maxWin[w][1]; }
            if (m > 0 && hi - m >= 300 && m <= hi * 0.65 && t >= lossCool && !near(feeds, t, 2000, 0)) {
                marks.push({ t: t, k: 'loss', v: hi - m, n: 1 });
                lossCool = t + 3000;
            }
            if (noKillEvents && lo !== Infinity && m - lo >= 200 && m >= lo * 1.3 && t >= gainCool && !near(viruses, t, 1000, 200)) {
                marks.push({ t: t, k: 'gain', v: m - lo, n: 1 });
                gainCool = t + 3000;
            }
            maxWin.push([t, m]);
            prev = { t: t, m: m, c: c };
        }
        /* a loss right before a death is part of that death */
        marks = marks.filter(function (mk) {
            if (mk.k !== 'loss') return true;
            return !deaths.some(function (d) { return d[0] >= mk.t && d[0] - mk.t <= 1500; });
        });
        marks.sort(function (a, b) { return a.t - b.t; });
        return marks;
    }
    function peakMass(side) {
        var p = 0, s = side.s || [], e = side.e || [], i;
        for (i = 1; i < s.length; i += 4) if (s[i] > p) p = s[i];
        for (i = 0; i + 2 < e.length; i += 3) if (e[i + 1] === 'd' && e[i + 2] > p) p = e[i + 2];
        return Math.round(p);
    }

    /* What a packet (a DataView, opened if compressed) gives a clip that starts later (cutInterval
     * carry): its kind, '' for none. A "clear all" keeps these and servers send them again only
     * when they change, so the newest one of each kind before the clip goes with it: the map border
     * (64; 'bg' the handshake one with the game type, 'bf' a full agar.io border, which comes only
     * at the handshake, 'b' the others, such as agar.io's view rects or Expanding Land's tier
     * changes), the Expanding Land beacon (240 'LW', else it is read as a private server), the
     * leaderboard (49, 53, 54), the team pie (50) and the camera (17). */
    function carryKind(d) {
        try {
            var n = d.byteLength, op = d.getUint8(0);
            if (op === 64) {
                if (n < 33) return '';
                var w = d.getFloat64(17, true) - d.getFloat64(1, true), h = d.getFloat64(25, true) - d.getFloat64(9, true);
                if (n >= 37) { var gt = d.getUint32(33, true); if (gt === 0 || gt === 1) return 'bg'; }
                return w > 14000 && h > 14000 ? 'bf' : 'b';
            }
            if (op === 240) return n >= 3 && d.getUint8(1) === 0x4C && d.getUint8(2) === 0x57 ? 'el' : '';
            if (op === 49 || op === 53 || op === 54) return 'lb';
            if (op === 50) return 'pie';
            if (op === 17) return 'cam';
        } catch (e) { }
        return '';
    }
    /* Cut packets [a, b) (indices) for a clip. The world state at a depends on what came
     * before, so the clip starts at the newest world reset <= a (checkpoint). Compact mode
     * leaves out cell updates (isCell) older than warmMs before a: the cells come back with
     * the warm-up packets; names sent only once long before may be missing in such a clip.
     * carry: [index, kind, ...] of the recording in packet order (carryKind); the newest packet
     * of each kind before that checkpoint comes first, at time 0, so the clip has the border,
     * leaderboard and camera the recording had there.
     * Returns { idx: kept original indices, times (rebased), start: playback position, base }. */
    function cutInterval(times, a, b, opts) {
        opts = opts || {};
        var n = times.length;
        a = Math.max(0, Math.min(n - 1, a | 0));
        b = Math.max(a + 1, Math.min(n, b | 0));
        var cps = opts.checkpoints && opts.checkpoints.length ? opts.checkpoints : [0];
        var p = checkpointBefore(cps, a);
        var warm = isNum(opts.warmMs) ? opts.warmMs : 10000;
        var w = Math.max(p, Math.min(a, firstAtOrAfter(times, n, times[a] - warm)));
        var idx = [], i;
        var cy = p > 0 && Array.isArray(opts.carry) ? opts.carry : null, seen = {};
        for (i = cy ? cy.length - 2 : -1; i >= 0; i -= 2) {
            if (!(cy[i] < p) || !cy[i + 1] || seen[cy[i + 1]]) continue;
            seen[cy[i + 1]] = 1;
            idx.push(cy[i]);
        }
        idx.reverse();
        for (i = p; i < w; i++) if (!opts.compact || !opts.isCell || !opts.isCell(i)) idx.push(i);
        for (i = w; i < b; i++) idx.push(i);
        var base = opts.compact ? times[w] : times[p];
        var nt = idx.map(function (j) { return Math.max(0, times[j] - base); });
        var start = 0;
        while (start < idx.length && idx[start] < a) start++;
        return { idx: idx, times: nt, start: start, base: base, endT: times[b - 1] };
    }
    /* samples/events/cursor of the clip span, rebased */
    function cutSide(side, base, fromT, toT) {
        var f = function (a, stride) {
            var out = [];
            for (var i = 0; i + stride <= (a || []).length; i += stride) {
                if (a[i] < fromT || a[i] > toT) continue;
                out.push(a[i] - base);
                for (var j = 1; j < stride; j++) out.push(a[i + j]);
            }
            return out;
        };
        return { s: f(side.s, 4), e: f(side.e, 3), c: f(side.c, 3) };
    }

    /* Library entries (metadata only; the packets are stored separately) */
    function cleanText(v, max) {
        return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
    }
    function validateRecord(r) {
        if (!r || typeof r !== 'object' || Array.isArray(r)) return null;
        if (typeof r.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(r.id)) return null;
        if (!isNum(r.date) || r.date <= 0) return null;
        if (!Number.isInteger(r.packets) || r.packets < 1 || r.packets > MAX_PACKETS) return null;
        var tags = Array.isArray(r.tags) ? r.tags : [];
        var out = {
            id: r.id,
            v: 1,
            name: cleanText(r.name, 80) || 'Replay', // i18n-ok: stored default name of a library entry (data, not UI)
            tags: [],
            date: r.date,
            server: cleanText(r.server, 200),
            key: cleanText(r.key, 300),
            nick: cleanText(r.nick, 60),
            duration: isNum(r.duration) && r.duration >= 0 ? Math.min(r.duration, MAX_SPAN) : 0,
            peakMass: isNum(r.peakMass) && r.peakMass >= 0 ? Math.round(Math.min(r.peakMass, 1e9)) : 0,
            packets: r.packets,
            bytes: isNum(r.bytes) && r.bytes >= 0 ? r.bytes : 0,
            marks: Number.isInteger(r.marks) && r.marks >= 0 ? r.marks : 0,
            est: !!r.est,
            clip: !!r.clip
        };
        for (var i = 0; i < tags.length && out.tags.length < 10; i++) {
            var tg = cleanText(tags[i], 24).toLowerCase();
            if (tg && out.tags.indexOf(tg) === -1) out.tags.push(tg);
        }
        return out;
    }
    function parseTags(text) {
        return String(text || '').split(/[,;#]+/).map(function (x) { return cleanText(x, 24).toLowerCase(); }).filter(Boolean).slice(0, 10);
    }
    function sortRecords(list, how) {
        var f = {
            old: function (a, b) { return a.date - b.date; },
            name: function (a, b) { return a.name.localeCompare(b.name); },
            duration: function (a, b) { return b.duration - a.duration; },
            mass: function (a, b) { return b.peakMass - a.peakMass; },
            size: function (a, b) { return b.bytes - a.bytes; }
        }[how] || function (a, b) { return b.date - a.date; };
        return list.slice().sort(f);
    }
    function searchRecords(list, q) {
        q = cleanText(q, 80).toLowerCase();
        if (!q) return list;
        var words = q.split(/\s+/);
        return list.filter(function (r) {
            var hay = (r.name + ' ' + r.server + ' ' + r.nick + ' ' + r.tags.map(function (t) { return '#' + t; }).join(' ')).toLowerCase();
            return words.every(function (w) { return hay.indexOf(w.replace(/^#/, '')) !== -1; });
        });
    }

    /* packets <-> one buffer + lengths (IndexedDB) */
    function viewBytes(dv) { return new Uint8Array(dv.buffer, dv.byteOffset || 0, dv.byteLength); }
    function packPackets(list) {
        var total = 0, i;
        for (i = 0; i < list.length; i++) total += list[i] ? list[i].byteLength : 0;
        /* checked before the copy is allocated */
        if (list.length > LIMITS.packets) throw limitErr('packets');
        if (total > LIMITS.bytes) throw limitErr('bytes');
        var buf = new Uint8Array(total), lens = new Uint32Array(list.length), off = 0;
        for (i = 0; i < list.length; i++) {
            if (!list[i]) continue;
            buf.set(viewBytes(list[i]), off);
            lens[i] = list[i].byteLength;
            off += list[i].byteLength;
        }
        return { buf: buf.buffer, lens: lens.buffer };
    }
    /* each packet gets its own buffer, like live ones (some handlers read data.buffer) */
    function unpackPackets(buf, lens) {
        if (!(buf instanceof ArrayBuffer) || !(lens instanceof ArrayBuffer) || lens.byteLength % 4) return null;
        var L = new Uint32Array(lens), off = 0, i, sum = 0;
        /* the lengths must fit the stored bytes before any packet is copied */
        if (L.length > LIMITS.packets) return null;
        for (i = 0; i < L.length; i++) sum += L[i];
        if (sum > buf.byteLength) return null;
        var out = new Array(L.length);
        for (i = 0; i < L.length; i++) {
            if (off + L[i] > buf.byteLength) return null;
            out[i] = new DataView(buf.slice(off, off + L[i]));
            off += L[i];
        }
        return out;
    }
    /* .lm text: a JSON array of packets as binary strings, the game info array last (the layout
     * of the old replay window's files, which open here unchanged) */
    function binStr(dv) {
        var bytes = viewBytes(dv), out = '';
        for (var i = 0; i < bytes.length; i += 32768) out += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
        return out;
    }
    function strView(str) {
        var n = str.length, buf = new ArrayBuffer(n), v = new Uint8Array(buf);
        for (var i = 0; i < n; i++) {
            var c = str.charCodeAt(i);
            /* every character is one byte: a bigger one means the file is not a replay (it was
             * cut to its low byte, which turned the text into other packets) */
            if (c > 255) throw new Error('packet byte ' + i + ' out of range');
            v[i] = c;
        }
        return new DataView(buf);
    }
    /* game info for a file: [date, mode, region, nick, skins JSON, ..., Studio data] */
    function fileSpec(spec, side) {
        var out = [];
        (Array.isArray(spec) ? spec : []).forEach(function (v) {
            if (v && typeof v === 'object') return; /* an older Studio object */
            out.push(v);
        });
        while (out.length < 4) out.push(out.length === 0 ? Date.now() : '');
        if (out.length < 5) out.push('{}');
        if (side) out.push(side);
        return out;
    }
    function lmFileParts(packets, spec, side) {
        var parts = ['['];
        for (var i = 0; i < packets.length; i++) parts.push(JSON.stringify(packets[i] ? binStr(packets[i]) : ''), ',');
        parts.push(JSON.stringify(fileSpec(spec, side)), ']');
        return parts;
    }
    function parseLmText(text) {
        if (text.length > LIMITS.fileBytes) throw limitErr('file');
        var a = JSON.parse(text);
        if (!Array.isArray(a) || a.length < 2) throw new Error('not a replay file');
        if (a.length - 1 > LIMITS.packets) throw limitErr('packets');
        var n = a.length - 1, packets = new Array(n), i, total = 0;
        /* all packets are checked before their bytes are allocated */
        for (i = 0; i < n; i++) {
            if (typeof a[i] !== 'string') throw new Error('packet ' + i + ' is not a string');
            if (a[i].length > LIMITS.packetBytes) throw limitErr('packet ' + i);
            total += a[i].length;
        }
        if (total > LIMITS.bytes) throw limitErr('bytes');
        for (i = 0; i < n; i++) packets[i] = strView(a[i]);
        var spec = Array.isArray(a[n]) ? a[n] : [];
        return { packets: packets, spec: spec, side: readSidecar(findSidecar(spec), n) };
    }

    /* ?replay= links: an http(s) address of a .lm file (https from an https page, where the
     * browser blocks http anyway) without a user name or password in it. Files on any site
     * load (links point to several), when that site allows it (CORS). { url, name } or null. */
    function replayUrl(raw, page) {
        raw = String(raw == null ? '' : raw).trim();
        /* jimboy3100.github.io answers with a 301 that has no CORS header; www.legendmod.ml allows the load */
        raw = raw.replace(/^(https?:)?\/\/jimboy3100\.github\.io\//i, 'https://www.legendmod.ml/');
        if (!raw || raw.length > 2048 || typeof URL !== 'function') return null;
        var u;
        try { u = new URL(raw, page || undefined); } catch (e) { return null; }
        var pageHttps = !page || /^https:/i.test(page);
        if (!(u.protocol === 'https:' || (u.protocol === 'http:' && !pageHttps))) return null;
        if (u.username || u.password) return null;
        var lmName = function (s) {
            var x;
            try { x = decodeURIComponent(String(s || '')); } catch (e) { return ''; }
            x = x.split(/[\/\\]/).pop();
            return /\.lm$/i.test(x) ? x : '';
        };
        var name = lmName(u.pathname);
        /* a download address that names the file in its query (?file=match.lm) */
        if (!name && u.searchParams) u.searchParams.forEach(function (v) { if (!name) name = lmName(v); });
        if (!name) return null;
        return { url: u.href, name: cleanText(name, 100) };
    }
    /* a download's text, refused as soon as it passes max bytes (Content-Length first, then
     * while it streams); cur() false = the download was replaced: it stops */
    function readCapped(r, max, cur) {
        var len = parseInt(r.headers && typeof r.headers.get === 'function' ? r.headers.get('content-length') : '', 10);
        if (len > max) return Promise.reject(limitErr('download'));
        var rd = r.body && typeof r.body.getReader === 'function' && typeof TextDecoder === 'function' ? r.body.getReader() : null;
        if (!rd) return Promise.resolve(r.text()).then(function (t) { if (t.length > max) throw limitErr('download'); return t; });
        var dec = new TextDecoder('utf-8'), parts = [], got = 0;
        var stop = function (e) { try { rd.cancel(); } catch (x) { } throw e; };
        var next = function () {
            return rd.read().then(function (c) {
                if (!cur()) return stop(staleErr());
                if (c.done) { parts.push(dec.decode()); return parts.join(''); }
                got += c.value.byteLength;
                if (got > max) return stop(limitErr('download'));
                parts.push(dec.decode(c.value, { stream: true }));
                return next();
            });
        };
        return next();
    }
    /* one link download at a time: a newer load() or cancel() makes the older one stale (its
     * result is dropped even when it still arrives) and aborts its request.
     * o: { fetch(url, opts), done(text, job), fail(error, job), limit() } */
    function urlLoader(o) {
        var id = 0, ctl = null, busy = false;
        var api = {
            load: function (job) {
                api.cancel();
                var my = id, cur = function () { return my === id; };
                ctl = typeof AbortController === 'function' ? new AbortController() : null;
                busy = true;
                var opt = { cache: 'no-store' };
                if (ctl) opt.signal = ctl.signal;
                /* started at once: the request it replaces is already aborted */
                var req;
                try { req = Promise.resolve(o.fetch(job.url, opt)); } catch (e) { req = Promise.reject(e); }
                return req.then(function (r) {
                    if (!cur()) throw staleErr();
                    if (!r || !r.ok) throw new Error('HTTP ' + (r && r.status));
                    return readCapped(r, o.limit(), cur);
                }).then(function (text) {
                    if (!cur()) return false;
                    busy = false; ctl = null;
                    o.done(text, job);
                    return true;
                }).catch(function (e) {
                    if (!cur() || (e && (e.name === 'AbortError' || e.lmStale))) return false;
                    busy = false; ctl = null;
                    o.fail(e, job);
                    return false;
                });
            },
            cancel: function () {
                id++;
                if (ctl) { try { ctl.abort(); } catch (e) { } }
                ctl = null; busy = false;
            },
            pending: function () { return busy; }
        };
        return api;
    }
    /* what a finished link download does: 'watch' plays it at once (a link opened at start or
     * from the menu, or another replay playing); 'ask' while a live game is played: the Studio
     * shows it and Play asks before leaving the game, like any replay started while playing */
    function urlPlan(l, replaying) { return l && l.play && !replaying ? 'ask' : 'watch'; }

    function fmtTime(ms) {
        ms = Math.max(0, ms || 0);
        var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
        s = s % 60;
        return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    function fmtMass(v) { v = Math.round(v || 0); return v >= 10000 ? (v / 1000).toFixed(1) + 'k' : String(v); }
    function fmtBytes(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
    function serverLabel(key) {
        key = String(key || '').replace(/\.lm$/i, '').replace(/\(\d+\)$/, '');
        var m = /^wss?:\/\/([^\/?#]+)/i.exec(key);
        return (m ? m[1] : key).slice(0, 60);
    }

    var lib = {
        EST_MS: EST_MS, encodeTimes: encodeTimes, decodeTimes: decodeTimes, cleanTimes: cleanTimes, estTimes: estTimes,
        posAtTime: posAtTime, firstAtOrAfter: firstAtOrAfter, checkpointBefore: checkpointBefore, carryKind: carryKind,
        makeSidecar: makeSidecar, readSidecar: readSidecar, findSidecar: findSidecar,
        detectBookmarks: detectBookmarks, peakMass: peakMass, cutInterval: cutInterval, cutSide: cutSide,
        validateRecord: validateRecord, parseTags: parseTags, sortRecords: sortRecords, searchRecords: searchRecords,
        packPackets: packPackets, unpackPackets: unpackPackets, lmFileParts: lmFileParts, parseLmText: parseLmText,
        fileSpec: fileSpec, fmtTime: fmtTime, serverLabel: serverLabel,
        LIMITS: LIMITS, strView: strView, sideOut: sideOut, replayUrl: replayUrl, readCapped: readCapped,
        urlLoader: urlLoader, urlPlan: urlPlan
    };

    var RS = window.LMReplayStudio = { lib: lib };
    /* Node tests load this file without a page */
    if (!window.document || !window.document.createElement) return;

    /* ------------------------------------------------------------------ */
    /* Text                                                                */
    /* ------------------------------------------------------------------ */
    /* texts come from the language packs (developers/i18n/src/modules*.json) */
    var TK = 'modules.replaystudio.';
    /* the backwards play, colour filter and ?replay= link texts (developers/i18n/src/pkg-rp.json) */
    var TK2 = { playRev: 1, fx: 1, fxNone: 1, fxGrey: 1, fxSepia: 1, fxHue: 1, urlFailed: 1, urlNotLm: 1 };
    /* size limit, link check and source server texts (developers/i18n/src/pkg-n56.json) */
    var TK3 = { tooBig: 1, urlBad: 1, proto: 1, protoGuess: 1, protoPriv: 1 };
    function T(k, v) { return typeof window.lmT === 'function' ? window.lmT((TK3[k] ? 'pkg.n56.' : TK2[k] ? 'pkg.rp.' : TK) + k, v) : k; }
    /* K('play'): a label read again after a language change (see relabels) */
    function K(k) { return function () { return T(k); }; }
    function dirNow() { return window.LMi18n && window.LMi18n.dir ? window.LMi18n.dir() : 'ltr'; }
    /* setters of the window's fixed labels, run again when the language changes */
    var relabels = [];
    function L(fn) { relabels.push(fn); fn(); }
    var KIND = {
        death: { c: '#ff4d4d', s: '\u2716' }, kill: { c: '#ffb020', s: '\u25cf' }, virus: { c: '#3ddc84', s: '\u2739' },
        split: { c: '#4da3ff', s: '\u2194' }, top1: { c: '#ffd700', s: '\u2605' }, loss: { c: '#ff7ab6', s: '\u25bc' },
        gain: { c: '#c792ea', s: '\u25b2' }
    };
    function markLabel(m) {
        var l = T(m.k);
        if (m.k === 'kill') l += (m.n > 1 ? ' \u00d7' + m.n : '') + ' +' + fmtMass(m.v);
        else if (m.k === 'virus' && m.n > 1) l += ' \u00d7' + m.n;
        else if (m.k === 'split') l += ' \u00d7' + m.n;
        else if (m.k === 'death') l += ' (' + fmtMass(m.v) + ')';
        else if (m.k === 'loss') l += ' -' + fmtMass(m.v);
        else if (m.k === 'gain') l += ' +' + fmtMass(m.v);
        return l;
    }
    function toast(kind, text) { if (window.toastr) toastr[kind](String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')); }

    /* ------------------------------------------------------------------ */
    /* Recordings in memory                                                */
    /* ------------------------------------------------------------------ */
    function LM() { return window.legendmod || null; }
    function dms() { return typeof defaultmapsettings !== 'undefined' ? defaultmapsettings : (window.legendmod5 || {}); }
    function recArr(key) { return key != null && window.RecordedProtocol ? window.RecordedProtocol[key] : null; }
    function recKeys() {
        var a = window.RecordedProtocolArenas || [];
        return a.filter(function (k) { var r = recArr(k); return r && r.length > 10; });
    }
    function liveKey() {
        var k = window.temporaryRecordedProtocol, a = recArr(k);
        return window._lmRecLive && a ? k : null;
    }
    function inReplay() { var l = LM(); return !!(l && String(l.ws || '').indexOf('replay') !== -1); }
    function inReplayOf(key) {
        var l = LM();
        return inReplay() && l.playingReplayServer === key && String($('#server-token').val() || '').indexOf('replay^' + key) !== -1;
    }
    /* the recording the Studio shows: times, samples, bookmarks, checkpoints */
    var REC = null;
    function openRec(key) {
        var arr = recArr(key);
        if (!arr) return null;
        if (REC && REC.key === key && REC.arr === arr) { refreshRec(); return REC; }
        var spec = (window.RecordedArenasSpecifications || {})[key];
        var side = arr._lmSide || null;
        if (!side) {
            var meta = arr._lm;
            side = meta ? { t: null, est: false, s: meta.s, e: meta.e, c: meta.c, start: 0, live: meta } : readSidecar(findSidecar(spec), arr.length);
            if (!meta && !side.t) side.est = true;
            arr._lmSide = side;
        }
        REC = { key: key, arr: arr, spec: Array.isArray(spec) ? spec : [], side: side, n: 0, t: null, marks: [], cps: [0], cpSet: {}, carry: [], cpsScan: 0, marksAt: -1 };
        refreshRec();
        return REC;
    }
    /* a recording that is still being recorded grows: extend times, checkpoints, bookmarks */
    function refreshRec() {
        var r = REC;
        if (!r) return;
        var n = r.arr.length;
        if (n === r.n && r.t) return;
        var meta = r.side.live;
        /* still recording: the copy of its times is refreshed once a second */
        if (meta && r.t && Date.now() - r.refAt < 1000) return;
        r.refAt = Date.now();
        if (meta) {
            var t = cleanTimes(meta.t, n);
            if (!t) { t = estTimes(n); r.side.est = true; } else r.side.est = false;
            r.t = t;
        } else if (r.side.t && r.side.t.length === n) {
            r.t = r.side.t;
        } else {
            r.t = estTimes(n);
            r.side.est = true;
        }
        r.n = n;
        for (var i = r.cpsScan; i < n; i++) {
            var d = r.arr[i];
            if (!d || !d.byteLength) continue;
            var op = d.getUint8(0), dv = d;
            /* P1 fix #40: LZ4-compressed packets (opcode 255) must be decompressed
             * before the opcode can be checked. Without this, cps stays [0] for
             * compressed recordings and all backward seeks replay from packet 0. */
            if (op === 255) {
                var l = LM();
                if (l && typeof l.decompressMessage === 'function') {
                    try { var m = l.decompressMessage(d); if (m && m.length) { op = m.readUInt8(0); if (op === 64) dv = new DataView(m.buffer, m.byteOffset || 0, m.length); } } catch (e) { }
                }
            }
            if (op === 18 && i > 0) { r.cps.push(i); r.cpSet[i] = 1; }
            /* what a clip that starts at a later checkpoint takes along (cutInterval carry) */
            var ck = (op === 64 || op === 240 || op === 49 || op === 50 || op === 53 || op === 54 || op === 17) ? carryKind(dv) : '';
            if (ck) r.carry.push(i, ck);
        }
        r.cpsScan = n;
        r.endT = n ? r.t[n - 1] : 0;
        r.marks = detectBookmarks(r.side, { endT: r.endT });
    }
    /* time at a playback position (packets handled); before the first packet it is that
     * packet's time, so playing from the start does not wait for the connection set-up */
    function tAt(pos) { return REC && REC.n ? REC.t[Math.max(1, Math.min(pos, REC.n)) - 1] : 0; }

    /* ------------------------------------------------------------------ */
    /* Playback driver                                                     */
    /* ------------------------------------------------------------------ */
    /* dir: 1 forwards, -1 backwards; stopAt: pause there (the End packet of a ?replay= link) */
    /* driving: the playback session (the Studio plays the replay connection shown); playing / paused /
     * at the end is only the transport inside it. base, cpRec: the starting states (see CARRY) */
    var P = { driving: false, playing: false, pos: 0, speed: 1, dir: 1, stopAt: 0, baseWall: 0, baseT: 0, timer: 0, ff: null, pending: null, warnCount: 0, inMs: null, outMs: null, base: null, cpRec: null, cpN: 0, chatTo: 0 };
    var SPEEDS = [0.25, 0.5, 1, 2, 4];
    /* fx: colour filter of the replay's cells ('' none, grey, sepia, hue) */
    var FX = ['', 'grey', 'sepia', 'hue'];
    var OPT = { cur: true, spl: true, compact: true, speed: 1, sort: 'new', fx: '' };
    try {
        var _o = JSON.parse(localStorage.getItem('lmReplayStudio') || 'null');
        if (_o && typeof _o === 'object') {
            if (typeof _o.cur === 'boolean') OPT.cur = _o.cur;
            if (typeof _o.spl === 'boolean') OPT.spl = _o.spl;
            if (typeof _o.compact === 'boolean') OPT.compact = _o.compact;
            if (SPEEDS.indexOf(_o.speed) !== -1) OPT.speed = _o.speed;
            if (typeof _o.sort === 'string' && /^(new|old|name|duration|mass|size)$/.test(_o.sort)) OPT.sort = _o.sort;
            if (FX.indexOf(_o.fx) !== -1) OPT.fx = _o.fx;
        }
    } catch (e) { }
    P.speed = OPT.speed;
    function saveOpt() { try { localStorage.setItem('lmReplayStudio', JSON.stringify(OPT)); } catch (e) { } }
    /* the cell renderer (ogario.v4.js) reads these flags while a replay is shown; with one set,
     * replays draw with Canvas2D, which has the filters */
    function applyFx() {
        window.replayGreyScale = OPT.fx === 'grey';
        window.replaySepia = OPT.fx === 'sepia';
        window.replayHueRotate = OPT.fx === 'hue';
    }
    applyFx();
    /* where the playback is (ms of the recording) at the time now */
    function vNow(now) { return P.baseT + (now - P.baseWall) * P.speed * P.dir; }
    /* the replay bar and the phone pause button show the paused state */
    function setPaused(on) { window._lmReplayPaused = !!on; }
    /* The replay context (window._lmEvReplayOn, LMEvents context 'replay'; Analytics, Death recap,
     * macros and the match history skip it): on at the take-over of a replay connection, off only once
     * that connection is left for a live server (dispose 'left', from ogario.v4.js). Pause, the end,
     * stepping, seeking and closing the Studio keep it: the replay world is still what is shown.
     * ctxKey: the recording it was started for (another one gets its own replayStart). */
    var ctxKey = null;
    function evReplay(on, reason, start) {
        ctxKey = on && REC ? REC.key : null;
        if (typeof window._lmEvReplay === 'function') window._lmEvReplay(on, reason, start == null ? P.pos : start);
    }

    function active() {
        return !!(P.driving && REC && inReplayOf(REC.key) && recArr(REC.key) === REC.arr);
    }
    function stopTimers() {
        if (P.timer) { clearTimeout(P.timer); P.timer = 0; }
        if (P.ff && P.ff.timer) clearTimeout(P.ff.timer);
        P.ff = null;
        window._lmReplayHoldUntil = 0;
    }
    /* The one end of a playback session: another recording chosen or imported, the recording gone,
     * the Studio closed, Back to game, the replay connection lost, or a live server joined ('left').
     * Close and Back to game differ only in what follows: closing leaves the stopped replay world on
     * screen until a server is joined, Back to game joins the previous server. Safe to call again. */
    function dispose(reason) {
        stopTimers();
        P.driving = false;
        P.playing = false;
        P.stopAt = 0;
        P.base = P.cpRec = null;
        P.cpN = 0;
        if (reason === 'left') P.pending = null;
        setPaused(false);
        restoreSkins();
        overlayClear();
        if (window._lmEvReplayOn && !inReplay()) evReplay(false, reason === 'left' ? 'left' : 'stopped');
        ui();
    }

    /* What a world reset (lmReplayResetWorld) keeps but the packets change: the map border (Expanding
     * Land grows and shrinks it), the camera, the leaderboard, the colours by name. A rebuild puts back
     * the copy taken at its starting packet, so it ends where playing forwards got: P.base is taken at
     * the take-over (before packet 0), P.cpRec[i] before "clear all" packet i when the playback passes
     * it (only those checkpoints are used). Own cells and every other cell go with the reset. */
    var CARRY = ['mapMinX', 'mapMinY', 'mapMaxX', 'mapMaxY', 'mapMidX', 'mapMidY', 'mapOffsetX', 'mapOffsetY', 'mapOffset', 'mapOffsetFixed',
        'mapSize', 'mapTier', 'viewMinX', 'viewMinY', 'viewMaxX', 'viewMaxY', '_lmServerBorder', 'isLegendWorld', 'gameMode',
        'viewX', 'viewY', 'viewXTrue', 'viewYTrue', 'scale', 'play', 'playerColor', 'leaderboard', 'playerPosition', 'pieChart', 'ghostCells', 'cellcolors'];
    var CP_MAX = 64;
    /* a copy one level deep (leaderboard rows, colours by name); frozen values are shared */
    function copy1(v) {
        if (!v || typeof v !== 'object' || Object.isFrozen(v)) return v;
        if (Array.isArray(v)) return v.map(copy1Obj);
        return copy1Obj(v);
    }
    function copy1Obj(v) {
        if (!v || typeof v !== 'object' || Object.isFrozen(v)) return v;
        return Array.isArray(v) ? v.slice() : Object.assign(Object.create(Object.getPrototypeOf(v)), v);
    }
    function grab() {
        var l = LM(), o = {};
        if (!l) return null;
        for (var i = 0; i < CARRY.length; i++) o[CARRY[i]] = copy1(l[CARRY[i]]);
        return o;
    }
    function putBack(o) {
        var l = LM();
        if (!l || !o) return;
        for (var i = 0; i < CARRY.length; i++) l[CARRY[i]] = copy1(o[CARRY[i]]);
    }
    /* the newest checkpoint at or before packet i whose starting state is known (else 0) */
    function startFor(i) {
        var cps = REC.cps, c = checkpointBefore(cps, i);
        for (var j = cps.length - 1; j > 0 && c > 0; j--) {
            if (cps[j] <= c && P.cpRec && P.cpRec[cps[j]]) return cps[j];
        }
        return 0;
    }
    /* an empty world as it was before the newest complete starting point for target; returns it */
    function rebuildAt(target) {
        var c = target > 0 ? startFor(target - 1) : 0;
        if (window.lmReplayResetWorld) window.lmReplayResetWorld();
        putBack(c ? P.cpRec[c] : P.base);
        P.pos = c; /* the replay bar follows the rebuild (setPos) */
        return c;
    }
    /* quiet: a packet of a seek or a step backwards (seekTo). The game then changes only the world
     * (window._lmReplayQuiet, see lmReplayChatCut in ogario.v4.js): what the packets did besides was
     * shown already or is skipped over. 2: this packet's chat lines are still in the chat box
     * (P.chatTo: the packets of this session whose chat lines are there). The packet number goes
     * with its chat lines (window._lmRpAt), so seeking back can take them out again. */
    function handle(i, quiet) {
        var d = REC.arr[i], l = LM();
        if (!d || !l) return;
        if (P.cpRec && REC.cpSet[i] && !P.cpRec[i] && P.cpN < CP_MAX) { P.cpRec[i] = grab(); P.cpN++; }
        window._lmRpAt = i;
        window._lmReplayQuiet = quiet ? (i < P.chatTo ? 2 : 1) : 0;
        try { l.handleMessage(d); } catch (e) {
            /* P1 fix #48: allow up to 5 warnings per replay instead of silencing after the first */
            if (P.warnCount < 5) { P.warnCount++; console.warn('[Replay Studio] packet ' + i + ' failed:', e); }
        } finally {
            window._lmReplayQuiet = 0;
            window._lmRpAt = -1;
        }
        if (i >= P.chatTo) P.chatTo = i + 1;
    }
    /* Toasts have no one place in the game to check: while the packets of a seek are handled (one
     * slice, synchronously) a toastr whose toasts do nothing stands in. Returns the real one. */
    var hushed = null;
    function hushToasts() {
        var t = window.toastr;
        if (!t || t._lmHushed) return null;
        if (!hushed || Object.getPrototypeOf(hushed) !== t) {
            var none = function () { return window.jQuery ? window.jQuery() : undefined; };
            hushed = Object.create(t);
            hushed._lmHushed = true;
            hushed.success = hushed.info = hushed.warning = hushed.error = none;
        }
        window.toastr = hushed;
        return t;
    }
    /* the frames drawn while a seek is rebuilt in slices would show the world running up to the
     * target: the game keeps its last frame until then (drawRender.render). An end time, renewed
     * by every slice, so a lost job can never keep the picture for good. 5 s: a slow or busy
     * device can stall 1 to 3 s between two slices, and with 1 s the frames then showed the
     * world half rebuilt */
    var HOLD_MS = 5000;
    function setPos(pos) {
        P.pos = pos;
        var l = LM();
        /* the replay bar: not the rebuild of a step backwards running up to it */
        if (l && !(P.ff && P.ff.rev)) l.playingReplayRecord = pos;
    }
    function tick() {
        P.timer = 0;
        if (!active()) { if (P.driving) dispose('stopped'); return; }
        if (!P.playing) return;
        refreshRec();
        var now = performance.now(), vt = vNow(now), k = 0;
        if (P.dir < 0) {
            /* backwards, in steps: handling an earlier packet again does not undo a later one (a cell
             * it removed stays removed), so each step rebuilds the world at the earlier packet
             * (seekTo). The playback time runs on meanwhile: a slow rebuild gives fewer, longer steps */
            if (P.pos <= 1) { atEnd(); return; }
            if (vt - REC.t[P.pos - 2] > 3000) { P.baseT = vt = REC.t[P.pos - 2] + 40; P.baseWall = now; }
            var back = Math.max(1, posAtTime(REC.t, REC.n, vt));
            if (back < P.pos) { seekTo(back, true, true); return; }
            P.timer = setTimeout(tick, Math.max(0, Math.min(250, (vt - REC.t[P.pos - 1]) / P.speed + 1)));
            return;
        }
        /* the End packet of a ?replay= link */
        if (P.stopAt && P.pos >= P.stopAt) { P.stopAt = 0; pause(); return; }
        /* skip dead air: gaps over 3 s (a hidden tab while recording) */
        if (P.pos < REC.n && REC.t[P.pos] - vt > 3000) { P.baseT = vt = REC.t[P.pos] - 40; P.baseWall = now; }
        var lim = P.stopAt ? Math.min(REC.n, P.stopAt) : REC.n;
        while (P.pos < lim && REC.t[P.pos] <= vt && k < 300) { handle(P.pos); setPos(P.pos + 1); k++; }
        if (k >= 300) { P.baseT = tAt(P.pos); P.baseWall = now; } /* the page cannot keep up: slow down instead of freezing */
        if (P.pos >= REC.n) {
            /* P1 fix #43: when playing a live recording, the playhead can reach the end
             * of currently available packets while recording is still ongoing. Instead of
             * stopping permanently, wait 200ms and try again (refreshRec will pick up
             * newly recorded packets). Only stop if the recording is not live. */
            if (liveKey() === REC.key) {
                P.timer = setTimeout(tick, 200);
                return;
            }
            atEnd(); return;
        }
        if (P.stopAt && P.pos >= P.stopAt) { P.stopAt = 0; pause(); return; }
        var d = (REC.t[P.pos] - vt) / P.speed;
        P.timer = setTimeout(tick, Math.max(0, Math.min(250, d)));
    }
    /* dir: 1 forwards, -1 backwards, none: the direction it played last */
    function play(dir) {
        if (dir) P.dir = dir < 0 ? -1 : 1;
        if (!REC) return;
        if (!P.driving || !active()) {
            var at = P.driving ? P.pos : (P.pos || REC.side.start || 0);
            startReplay(REC.key, P.dir < 0 && at <= 1 ? REC.n : at, true);
            return;
        }
        if (P.ff) { P.ff.resume = true; return; }
        if (P.dir > 0 && P.pos >= REC.n) { seekTo(REC.side.start || 0, true); return; }
        /* backwards from the start: from the end, like the old replay window's negative delay */
        if (P.dir < 0 && P.pos <= 1) { seekTo(REC.n, true); return; }
        setPaused(false);
        P.playing = true;
        P.baseT = tAt(P.pos);
        P.baseWall = performance.now();
        if (P.timer) clearTimeout(P.timer);
        P.timer = 0;
        tick();
        ui();
        overlayOn();
    }
    /* the end of the playback, either way: the session goes on (paused there; step, seek or play again) */
    function atEnd() {
        P.playing = false;
        setPaused(true);
        ui();
    }
    /* a step backwards is rebuilt (revStep): show it, then the next one after at least REV_GAP ms
     * and at least as long as the rebuild took (never more than half of the time rebuilding) */
    var REV_GAP = 100;
    function revStepDone(job) {
        P.playing = true;
        setPaused(false);
        if (P.timer) clearTimeout(P.timer);
        P.timer = setTimeout(tick, Math.max(REV_GAP, performance.now() - job.t0));
        ui();
    }
    function pause() {
        P.playing = false;
        if (P.driving) setPaused(true);
        if (P.timer) { clearTimeout(P.timer); P.timer = 0; }
        if (P.ff) P.ff.resume = false;
        ui();
    }
    /* run packets until target (packets handled), in slices of ~25 ms; rev: a step of playing backwards */
    function seekTo(target, resume, rev) {
        if (!REC) return;
        refreshRec();
        target = Math.max(0, Math.min(REC.n, target | 0));
        if (!P.driving || !active()) { startReplay(REC.key, target, resume == null ? P.playing : resume); return; }
        var wasPlaying = resume == null ? (P.playing || !!(P.ff && P.ff.resume)) : resume;
        if (P.stopAt && target >= P.stopAt) P.stopAt = 0;
        stopTimers();
        P.playing = false;
        /* back: the packets only add, change and remove, so the world is emptied and rebuilt from a
         * complete starting point (cells of the later position would stay as ghosts) */
        /* the chat lines of the packets from target on go too (they come again when played) */
        if (target < P.pos) {
            rebuildAt(target);
            if (target < P.chatTo) { if (window.lmReplayChatCut) window.lmReplayChatCut(+window._lmRpSess || 0, target); P.chatTo = target; }
        }
        var job = P.ff = { target: target, resume: wasPlaying, timer: 0, from: P.pos, rev: !!rev, t0: performance.now() };
        if (rev && LM()) LM().playingReplayRecord = target;
        var step = function () {
            job.timer = 0;
            if (P.ff !== job) return;
            if (!active()) { dispose('stopped'); return; }
            var t0 = performance.now(), toasts = hushToasts();
            try {
                while (P.pos < job.target) {
                    handle(P.pos, true);
                    setPos(P.pos + 1);
                    /* P1 fix #41: check the 25ms budget every 4 packets instead of every 16.
                     * Heavy world-update packets can take 15-20ms each, so 16 of them
                     * could lock the UI for 240-320ms before yielding. */
                    if ((P.pos & 3) === 0 && performance.now() - t0 > 25) break;
                }
            } finally {
                if (toasts) window.toastr = toasts;
            }
            if (P.pos < job.target) {
                window._lmReplayHoldUntil = performance.now() + HOLD_MS;
                job.timer = setTimeout(step, 0); ui(); return;
            }
            P.ff = null;
            window._lmReplayHoldUntil = 0;
            setPos(P.pos);
            if (job.resume && job.rev && P.dir < 0) revStepDone(job);
            else if (job.resume) play(); else ui();
            overlayOn();
        };
        step();
    }
    function seekTime(ms, resume) { if (REC) seekTo(posAtTime(REC.t, REC.n, ms), resume); }
    /* the position shown: while a seek or a step backwards is rebuilt, where it goes */
    function shownPos() { return P.ff ? P.ff.target : P.pos; }
    function stepPacket(dir) {
        if (!REC) return;
        if (!P.driving || !active()) { startReplay(REC.key, Math.max(0, P.pos + dir), false); return; }
        var at = shownPos();
        pause();
        if (dir > 0 && !P.ff) { if (P.pos < REC.n) { handle(P.pos); setPos(P.pos + 1); } ui(); }
        else seekTo(at + (dir > 0 ? 1 : -1), false);
    }
    var leaveAt = 0;
    /* opens the replay connection (the live server is left) and takes over in takeOver() */
    /* quiet: joined for the player (a link, Death recap), not added to the recent servers */
    function startReplay(key, pos, autoplay, quiet) {
        var l = LM();
        if (!l || !recArr(key)) return;
        if (inReplayOf(key)) {
            P.pending = { key: key, pos: pos, autoplay: autoplay, at: Date.now() };
            if (typeof window.playReplayLM === 'function') window.playReplayLM(key, 0);
            return;
        }
        if (!inReplay() && l.play && Date.now() - leaveAt > 4000) {
            leaveAt = Date.now();
            toast('info', T('leave'));
            return;
        }
        leaveAt = 0;
        P.pending = { key: key, pos: pos, autoplay: autoplay, at: Date.now() };
        $('#server-token').val('replay^' + key);
        if (quiet && window.application && typeof application.gameServerJoin === 'function') application.gameServerJoin('replay^' + key);
        else $('#server-join').trigger('click');
    }
    /* plays a recording from packet pos on, in the Studio window (Death recap links, a replay^
     * token joined without the Studio, ?replay= links); seeks when it already plays */
    function watch(key, pos) {
        if (!recArr(key)) return false;
        open(key);
        P.dir = 1;
        pos = Math.max(0, pos | 0);
        if (active() && REC.key === key) { seekTo(pos, true); return true; }
        leaveAt = Date.now(); /* asked for: no "leaves the game" notice */
        startReplay(key, pos, true, true);
        return true;
    }
    /* called by playReplayLM after it emptied the world: true = the Studio plays this replay */
    RS.takeOver = function (key, startAt) {
        var p = P.pending;
        P.pending = null;
        if (!p || p.key !== key || Date.now() - p.at > 30000 || !recArr(key)) {
            if (P.driving) dispose('stopped');
            return false;
        }
        if (P.driving && REC && REC.key !== key) dispose('stopped');
        stopTimers();
        openRec(key);
        P.driving = true;
        P.playing = false;
        P.warnCount = 0;
        setPos(0);
        /* a new session: its chat lines are told apart from earlier ones (lmReplayChatCut) */
        window._lmRpSess = (+window._lmRpSess || 0) + 1;
        P.chatTo = 0;
        /* playReplayLM has just emptied the world: the state before packet 0, no checkpoints yet */
        P.base = grab();
        P.cpRec = {};
        P.cpN = 0;
        applySkins(REC.spec);
        /* one replayStart per recording shown (switching recordings: the old one stops first) */
        if (window._lmEvReplayOn && ctxKey !== key) evReplay(false, 'stopped');
        evReplay(true, '', p.pos || 0);
        setPaused(!p.autoplay);
        $('#pause-hud').hide();
        seekTo(p.pos || 0, !!p.autoplay);
        ui();
        return true;
    };
    RS.isDriving = function () { return active(); };
    /* ogario.v4.js (replayfunctions): a live server was joined, the replay is left */
    RS.dispose = function (reason) { dispose(reason === 'left' ? 'left' : 'stopped'); };
    /* the replay hotkeys (ogario.v4.js lmReplayTogglePause / Speed / Seek) */
    RS.command = function (cmd, arg) {
        if (cmd === 'pause') { if (P.playing || (P.ff && P.ff.resume)) pause(); else play(); return true; }
        if (cmd === 'speed') { setSpeed(arg < 1 ? P.speed * 2 : P.speed / 2); toast('info', T('speed') + ' ' + P.speed + 'x'); return true; }
        if (cmd === 'seek') { seekTo(shownPos() + (arg | 0)); return true; }
        return false;
    };
    function setSpeed(v) {
        v = Math.max(0.25, Math.min(4, v));
        /* playing backwards, the clock also runs while a step is rebuilt */
        if (P.playing || (P.ff && P.ff.rev && P.ff.resume)) { var now = performance.now(); P.baseT = vNow(now); P.baseWall = now; }
        P.speed = v;
        OPT.speed = v;
        saveOpt();
        /* P2 fix #88: reschedule the active tick timer so the new speed takes
         * effect immediately, rather than waiting for the old-speed timer to fire.
         * Backwards the timer is the pause between two rebuilt steps (revStepDone): it stays. */
        if (P.playing && P.timer && P.dir > 0) { clearTimeout(P.timer); P.timer = setTimeout(tick, 0); }
        ui();
    }
    /* skins saved with the recording: plain nick -> http(s) URL pairs (as playReplayLM).
     * P1 fix: save a backup of overwritten entries so they can be restored after replay. */
    var skinBackup = null;
    function applySkins(spec) {
        var app = window.application;
        if (!app || !app.customSkinsMap || typeof spec[4] !== 'string') return;
        try {
            var o = JSON.parse(spec[4]);
            if (!o || typeof o !== 'object') return;
            skinBackup = skinBackup || {};
            Object.keys(o).forEach(function (k) {
                var u = o[k];
                if (k === '__proto__' || k === 'constructor' || k === 'prototype') return;
                if (typeof u !== 'string' || !/^https?:\/\/[^\s"'<>`]+$/i.test(u)) return;
                /* only save the original the first time (subsequent replays shouldn't clobber it) */
                if (!Object.prototype.hasOwnProperty.call(skinBackup, k)) skinBackup[k] = app.customSkinsMap[k];
                app.customSkinsMap[k] = u;
            });
        } catch (e) { }
    }
    function restoreSkins() {
        if (!skinBackup) return;
        var app = window.application;
        if (app && app.customSkinsMap) {
            Object.keys(skinBackup).forEach(function (k) {
                if (skinBackup[k] === undefined) delete app.customSkinsMap[k];
                else app.customSkinsMap[k] = skinBackup[k];
            });
        }
        skinBackup = null;
    }

    /* instant replay: the last N seconds of the current recording. A replay needs the game
     * connection, so while alive it waits for the death instead of leaving the server. */
    var armed = false;
    function instantSecs() { var v = +dms().instantReplaySecs; return v >= 15 && v <= 60 ? v : 30; }
    function instant() {
        if (dms().recordReplays === false) { toast('warning', T('recOff')); return; }
        if (inReplay()) {
            if (active()) { P.dir = 1; seekTime(REC.endT - instantSecs() * 1000, true); }
            return;
        }
        var key = liveKey(), arr = recArr(key);
        if (!arr || arr.length <= 10) { toast('info', T('nothing')); return; }
        var l = LM();
        if (l && l.play) {
            setArmed(!armed);
            toast('info', T(armed ? 'armed' : 'disarmed'));
            return;
        }
        openInstant(key);
    }
    /* listens for the death only while armed */
    var deathTimer = 0;
    function onDeath() {
        if (!armed || inReplay()) return;
        var key = liveKey();
        var deathSocket = window.legendmod && window.legendmod.socket;
        /* cancel any previous pending timer (multi-cell sequential consumption) */
        if (deathTimer) { clearTimeout(deathTimer); deathTimer = 0; }
        /* a moment for the last packets (the eat) to arrive */
        deathTimer = setTimeout(function () {
            deathTimer = 0;
            if (!armed || inReplay()) return;
            /* P0 fix: verify freshness - liveKey() must still match the death's key */
            if (liveKey() !== key) return;
            /* abort if the player has already respawned or is spawning */
            var l = LM();
            if (l && (l.play || l.isSpawning)) return;
            /* P0 fix: compare actual socket objects, not URL strings */
            if (!window.legendmod || window.legendmod.socket !== deathSocket) return;
            openInstant(key);
        }, 900);
    }
    function cancelDeathTimer() {
        if (deathTimer) { clearTimeout(deathTimer); deathTimer = 0; }
    }
    function setArmed(on) {
        armed = !!on;
        cancelDeathTimer();
        if (!window.LMEvents) return;
        LMEvents.off('death', onDeath);
        LMEvents.off('spawn', cancelDeathTimer);
        if (armed) {
            LMEvents.on('death', onDeath);
            LMEvents.on('spawn', cancelDeathTimer);
        }
    }
    function openInstant(key) {
        setArmed(false);
        if (!recArr(key)) return;
        open(key);
        openRec(key);
        P.pos = 0;
        P.dir = 1;
        leaveAt = Date.now(); /* asked for: no "leaves the game" notice */
        startReplay(key, posAtTime(REC.t, REC.n, REC.endT - instantSecs() * 1000), true);
    }

    /* ------------------------------------------------------------------ */
    /* Overlays: recorded cursor and split moments                         */
    /* ------------------------------------------------------------------ */
    var ov = null, ovRaf = 0;
    function overlayOn() {
        if (ovRaf || !(OPT.cur || OPT.spl) || !P.driving) return;
        ovRaf = requestAnimationFrame(drawOverlay);
    }
    function overlayClear() {
        if (ovRaf) { cancelAnimationFrame(ovRaf); ovRaf = 0; }
        /* P2 fix #87: remove the overlay canvas from the DOM when clearing,
         * preventing an orphaned canvas when the game canvas is replaced */
        if (ov) {
            try { ov.getContext('2d').clearRect(0, 0, ov.width, ov.height); } catch (e) { }
            if (ov.parentNode) ov.parentNode.removeChild(ov);
            ov = null;
        }
    }
    function lastIdx(a, stride, t) {
        var lo = 0, hi = Math.floor(a.length / stride) - 1, best = -1;
        while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            if (a[mid * stride] <= t) { best = mid; lo = mid + 1; } else hi = mid - 1;
        }
        return best;
    }
    function drawOverlay() {
        ovRaf = 0;
        if (!P.driving || !active() || !(OPT.cur || OPT.spl)) { overlayClear(); return; }
        /* a seek being rebuilt: the overlay of the last frame stays, like the game's (HOLD_MS) */
        if (P.ff && window._lmReplayHoldUntil) { ovRaf = requestAnimationFrame(drawOverlay); return; }
        var game = document.getElementById('canvas'), dr = window.drawRender, l = LM();
        if (!game || !dr || !l) return;
        if (!ov) {
            ov = document.createElement('canvas');
            ov.id = 'lm-rs-overlay';
            ov.style.cssText = 'position:fixed;pointer-events:none;';
            game.insertAdjacentElement('afterend', ov);
            var z = getComputedStyle(game).zIndex;
            ov.style.zIndex = z && z !== 'auto' ? z : '1';
        }
        var r = game.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
        var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
        if (ov.width !== w || ov.height !== h) { ov.width = w; ov.height = h; }
        ov.style.left = r.left + 'px'; ov.style.top = r.top + 'px'; ov.style.width = r.width + 'px'; ov.style.height = r.height + 'px';
        var ctx = ov.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, w, h);
        var k = (r.width / (dr.canvasWidth || r.width || 1)) * dpr;
        var sx = function (x) { return ((x - dr.camX) * dr.scale + (dr.canvasWidth || r.width) / 2) * k; };
        var sy = function (y) { return ((y - dr.camY) * dr.scale + (dr.canvasHeight || r.height) / 2) * k; };
        var vt = !P.playing ? tAt(P.pos) : P.dir < 0 ? Math.max(tAt(P.pos - 1), vNow(performance.now())) : Math.min(tAt(P.pos + 1), vNow(performance.now()));
        /* own cells' centre */
        var cx = 0, cy = 0, cn = 0, cs = 0;
        (l.playerCells || []).forEach(function (c) { if (c && isNum(c.x)) { cx += c.x; cy += c.y; cn++; cs = Math.max(cs, c.size || 0); } });
        if (cn) { cx /= cn; cy /= cn; }
        var side = REC.side;
        if (OPT.cur && side.c && side.c.length) {
            var i = lastIdx(side.c, 3, vt);
            if (i >= 0 && vt - side.c[i * 3] < 1500) {
                var px = sx(side.c[i * 3 + 1]), py = sy(side.c[i * 3 + 2]);
                ctx.lineWidth = 2 * dpr;
                ctx.strokeStyle = 'rgba(255,255,255,0.85)';
                if (cn) {
                    ctx.setLineDash([6 * dpr, 6 * dpr]);
                    ctx.beginPath(); ctx.moveTo(sx(cx), sy(cy)); ctx.lineTo(px, py); ctx.stroke();
                    ctx.setLineDash([]);
                }
                ctx.beginPath(); ctx.arc(px, py, 9 * dpr, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(px - 14 * dpr, py); ctx.lineTo(px + 14 * dpr, py); ctx.moveTo(px, py - 14 * dpr); ctx.lineTo(px, py + 14 * dpr); ctx.stroke();
            }
        }
        if (OPT.spl && cn && side.e && side.e.length) {
            var j = lastIdx(side.e, 3, vt);
            for (; j >= 0 && vt - side.e[j * 3] < 700; j--) {
                if (side.e[j * 3 + 1] !== 'p') continue;
                var age = (vt - side.e[j * 3]) / 700;
                ctx.globalAlpha = 1 - age;
                ctx.strokeStyle = KIND.split.c;
                ctx.lineWidth = 4 * dpr;
                ctx.beginPath(); ctx.arc(sx(cx), sy(cy), (cs * dr.scale * k) + (20 + 60 * age) * dpr, 0, Math.PI * 2); ctx.stroke();
                ctx.font = 'bold ' + Math.round(16 * dpr) + 'px sans-serif';
                ctx.fillStyle = KIND.split.c;
                ctx.textAlign = 'center';
                ctx.fillText(T('splitOv') + (side.e[j * 3 + 2] > 1 ? ' \u00d7' + side.e[j * 3 + 2] : ''), sx(cx), sy(cy) - (cs * dr.scale * k) - 28 * dpr);
                ctx.globalAlpha = 1;
                break;
            }
        }
        ovRaf = requestAnimationFrame(drawOverlay);
    }

    /* ------------------------------------------------------------------ */
    /* Library (IndexedDB: 'meta' entries for the list, 'data' packets)    */
    /* ------------------------------------------------------------------ */
    var dbP = null;
    function db() {
        if (dbP) return dbP;
        dbP = new Promise(function (res, rej) {
            try {
                if (!window.indexedDB) throw new Error('no IndexedDB');
                var rq = indexedDB.open('lmReplayStudio', 1);
                rq.onupgradeneeded = function () {
                    var d = rq.result;
                    if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'id' });
                    if (!d.objectStoreNames.contains('data')) d.createObjectStore('data', { keyPath: 'id' });
                };
                rq.onsuccess = function () { res(rq.result); };
                rq.onerror = function () { rej(rq.error || new Error('IndexedDB open failed')); };
                rq.onblocked = function () { rej(new Error('IndexedDB blocked')); };
            } catch (e) { rej(e); }
        });
        dbP.catch(function () { dbP = null; });
        return dbP;
    }
    function txDone(tx) {
        return new Promise(function (res, rej) {
            tx.oncomplete = function () { res(); };
            tx.onerror = function () { rej(tx.error); };
            tx.onabort = function () { rej(tx.error || new Error('aborted')); };
        });
    }
    function libList() {
        return db().then(function (d) {
            return new Promise(function (res, rej) {
                var rq = d.transaction('meta', 'readonly').objectStore('meta').getAll();
                rq.onsuccess = function () { res((rq.result || []).map(validateRecord).filter(Boolean)); };
                rq.onerror = function () { rej(rq.error); };
            });
        });
    }
    function libGet(id) {
        return db().then(function (d) {
            return new Promise(function (res, rej) {
                var tx = d.transaction(['meta', 'data'], 'readonly'), out = {};
                tx.objectStore('meta').get(id).onsuccess = function (e) { out.meta = validateRecord(e.target.result); };
                tx.objectStore('data').get(id).onsuccess = function (e) { out.data = e.target.result; };
                tx.oncomplete = function () { res(out); };
                tx.onerror = function () { rej(tx.error); };
            });
        });
    }
    function quotaCheck(bytes) {
        if (!navigator.storage || !navigator.storage.estimate) return Promise.resolve();
        return navigator.storage.estimate().then(function (q) {
            if (q && q.quota && q.usage != null && q.quota - q.usage < bytes * 1.2 + 1048576) {
                var e = new Error('quota'); e.name = 'QuotaExceededError'; throw e;
            }
        }, function () { });
    }
    function libPut(meta, data) {
        meta = validateRecord(meta);
        if (!meta) return Promise.reject(new Error('invalid entry'));
        data.id = meta.id;
        return quotaCheck(meta.bytes).then(db).then(function (d) {
            var tx = d.transaction(['meta', 'data'], 'readwrite');
            tx.objectStore('data').put(data);
            tx.objectStore('meta').put(meta);
            return txDone(tx);
        }).then(function () { return meta; });
    }
    function libUpdateMeta(meta) {
        meta = validateRecord(meta);
        if (!meta) return Promise.reject(new Error('invalid entry'));
        return db().then(function (d) {
            var tx = d.transaction('meta', 'readwrite');
            tx.objectStore('meta').put(meta);
            return txDone(tx);
        });
    }
    function libDelete(id) {
        return db().then(function (d) {
            var tx = d.transaction(['meta', 'data'], 'readwrite');
            tx.objectStore('meta').delete(id);
            tx.objectStore('data').delete(id);
            return txDone(tx);
        });
    }
    function libError(e) {
        var q = e && (e.name === 'QuotaExceededError' || /quota/i.test(String(e.message || e)));
        toast('error', q ? T('quota') : T('noLib'));
        if (!q) console.warn('[Replay Studio] library:', e);
    }
    function newId() { return 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1e8).toString(36); }
    /* a library entry from packets + Studio data */
    function buildEntry(o) {
        var side = o.side, packed = packPackets(o.packets);
        var n = o.packets.length, t = side.t ? decodeTimes(side.t, n) : null;
        var rs = readSidecar(side, n);
        var spec = Array.isArray(o.spec) ? o.spec.filter(function (v) { return !(v && typeof v === 'object'); }) : [];
        var meta = {
            id: newId(), name: o.name, tags: o.tags || [], date: +spec[0] > 0 ? +spec[0] : Date.now(),
            server: serverLabel(o.key), key: o.key, nick: typeof spec[3] === 'string' ? spec[3] : '',
            duration: t ? t[n - 1] : n * EST_MS, peakMass: peakMass(rs), packets: n,
            bytes: packed.buf.byteLength + packed.lens.byteLength, marks: detectBookmarks(rs, {}).length, est: !t, clip: !!o.clip
        };
        return { meta: meta, data: { buf: packed.buf, lens: packed.lens, spec: spec, side: side } };
    }
    function defaultName(key, spec) {
        var d = new Date(+spec[0] > 0 ? +spec[0] : Date.now());
        var p = function (v) { return (v < 10 ? '0' : '') + v; };
        var nick = typeof spec[3] === 'string' && spec[3] ? ' ' + spec[3] : '';
        return (d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ' ' + serverLabel(key) + nick).slice(0, 80);
    }
    function saveMemory(key) {
        var arr = recArr(key);
        if (!arr || arr.length <= 10) return;
        /* P2 fix #90: prevent duplicate saves by flagging while in progress */
        if (arr._lmSaving) return;
        arr._lmSaving = true;
        var spec = (window.RecordedArenasSpecifications || {})[key] || [];
        var side;
        if (arr._lm) side = makeSidecar(arr._lm, arr.length);
        else if (arr._lmSide) side = sideOut(arr._lmSide, arr.length);
        else side = { lmrs: 1, s: [], e: [], c: [] };
        var entry;
        try { entry = buildEntry({ packets: arr.slice(0, arr.length), spec: spec, side: side, key: key, name: defaultName(key, spec) }); } catch (e) {
            /* over the size budget (LIMITS): nothing was allocated */
            arr._lmSaving = false;
            importError(e);
            return;
        }
        return libPut(entry.meta, entry.data).then(function (m) {
            arr._lmSaving = false;
            /* a recording still in progress can be saved again later (it keeps growing) */
            if (key !== liveKey()) arr._lmLib = m.id;
            toast('success', T('saved') + ': ' + m.name);
            refreshLibrary();
            ui();
        }, function (e) { arr._lmSaving = false; libError(e); });
    }
    /* a library entry as an in-memory recording (the replay engine plays RecordedProtocol keys) */
    function materialize(meta, data) {
        var packets = data ? unpackPackets(data.buf, data.lens) : null;
        if (!packets || packets.length !== meta.packets) { toast('error', T('badFile')); return null; }
        return addMemory(meta.key || meta.name, packets, Array.isArray(data.spec) ? data.spec : [], data.side, meta.id);
    }
    function addMemory(baseKey, packets, spec, sideObj, libId) {
        var rp = window.RecordedProtocol, specs = window.RecordedArenasSpecifications, list = window.RecordedProtocolArenas;
        if (!rp || !specs || !list) return null;
        for (var i = 0; i < list.length; i++) { var a0 = rp[list[i]]; if (libId && a0 && a0._lmLib === libId) return list[i]; }
        /* P1 fix: cap the number of in-memory recordings to prevent unbounded growth
         * when importing many replays. Keep at most 10; evict the oldest non-live one. */
        while (list.length >= 10) {
            var evictIdx = -1, lk = liveKey();
            for (var j = 0; j < list.length; j++) {
                if (list[j] !== lk && list[j] !== (window.legendmod || {}).playingReplayServer) { evictIdx = j; break; }
            }
            if (evictIdx < 0) break;
            var evicted = list.splice(evictIdx, 1)[0];
            delete rp[evicted]; delete specs[evicted];
        }
        baseKey = String(baseKey || 'replay').replace(/\^/g, '');
        var ext = /\.lm$/i.test(baseKey) ? '.lm' : '', root = baseKey.replace(/\.lm$/i, '').replace(/\(\d+\)$/, ''), key = root + ext;
        for (i = 1; (rp[key] || specs[key]) && i < 100; i++) key = root + '(' + i + ')' + ext;
        var arr = packets.slice();
        arr._lmSide = readSidecar(sideObj, packets.length);
        if (libId) arr._lmLib = libId;
        rp[key] = arr;
        specs[key] = spec.filter(function (v) { return !(v && typeof v === 'object'); });
        list.push(key);
        return key;
    }
    function download(parts, name) {
        var blob = new Blob(parts, { type: 'text/plain' }), url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        /* P2 fix #85: strip existing .lm extension before adding one, preventing double .lm.lm */
        a.download = String(name || 'replay').replace(/[\\\/:*?"<>|]+/g, '_').replace(/\.lm$/i, '').slice(0, 100) + '.lm';
        a.href = url;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 10000);
    }
    function exportMemory(key) {
        var arr = recArr(key);
        if (!arr) return;
        var spec = (window.RecordedArenasSpecifications || {})[key] || [];
        var side = arr._lm ? makeSidecar(arr._lm, arr.length)
            : arr._lmSide && (!arr._lmSide.est || arr._lmSide.p) ? sideOut(arr._lmSide, arr.length) : null;
        download(lmFileParts(arr.slice(0, arr.length), spec, side), String(key).replace(/\.lm$/i, ''));
    }
    function exportLibrary(meta) {
        libGet(meta.id).then(function (o) {
            var packets = o.data && unpackPackets(o.data.buf, o.data.lens);
            if (!packets) { toast('error', T('badFile')); return; }
            download(lmFileParts(packets, o.data.spec, o.data.side), meta.name);
        }, libError);
    }
    /* a file or link that could not be opened: told, the game goes on */
    function importError(e) {
        console.warn('[Replay Studio] replay not opened:', e && e.message);
        toast('error', e && e.lmBig ? T('tooBig') : T('badFile'));
    }
    /* a .lm file's text: into memory and the library; returns the recording's key or null */
    function importText(text, name) {
        var parsed, side, entry;
        name = String(name || 'replay.lm');
        try {
            parsed = parseLmText(String(text || ''));
            side = sideOut(parsed.side, parsed.packets.length);
            /* the library copy first: over the budget nothing is kept in memory */
            entry = buildEntry({ packets: parsed.packets, spec: parsed.spec, side: side, key: name, name: name.replace(/\.lm$/i, ''), clip: parsed.side.start > 0 });
        } catch (e) { importError(e); return null; }
        var key = addMemory(name, parsed.packets, parsed.spec, side, null);
        if (!key) return null;
        libPut(entry.meta, entry.data).then(function (m) {
            var a = recArr(key);
            if (a) a._lmLib = m.id;
            refreshLibrary();
        }, libError);
        return key;
    }
    function importFile(file) {
        if (!file) return;
        /* refused before the whole file is read into memory */
        if (file.size > LIMITS.fileBytes) { importError(limitErr('file')); return; }
        var fr = new FileReader();
        fr.onload = function () {
            var key = importText(fr.result, file.name);
            if (!key) return;
            select(key);
            setTab('player');
        };
        fr.onerror = function () { toast('error', T('badFile')); };
        fr.readAsText(file, 'UTF-8');
    }
    /* ?replay=<.lm URL>&replayStart=<packet>&replayEnd=<packet> (the links on the website):
     * downloads the file, plays it from Start and pauses at End. Only the newest link counts:
     * a newer one, closing the Studio or watching another replay cancels the download. */
    var urlJob = urlLoader({
        fetch: function (u, o) { return fetch(u, o); },
        limit: function () { return LIMITS.fileBytes; },
        done: function (text, job) {
            var key = importText(text, job.name);
            if (key) urlOpen(key, job.start, job.end);
        },
        fail: function (e, job) {
            console.warn('[Replay Studio] ' + job.url + ':', e);
            if (e && e.lmBig) importError(e); else toast('error', T('urlFailed'));
        }
    });
    function loadUrl(url, start, end) {
        var u = replayUrl(url, location.href);
        if (!u) { toast('warning', String(url || '').indexOf('.lm') === -1 ? T('urlNotLm') : T('urlBad')); return; }
        if (typeof fetch !== 'function') { toast('error', T('urlFailed')); return; }
        urlJob.load({ url: u.url, name: u.name, start: start, end: end });
    }
    function urlOpen(key, start, end) {
        open(key);
        setTab('player');
        var last = REC.n - 1, a = parseInt(start, 10), b = parseInt(end, 10);
        a = a >= 0 && a <= last ? a : 0;
        b = b > a && b <= last ? b : 0;
        if (b) { P.inMs = tAt(a + 1); P.outMs = tAt(b + 1); }
        if (urlPlan(LM(), inReplay()) === 'ask') {
            /* the download finished during a live game: it is not left by itself; this is the
             * usual notice, and Play (within a few seconds) watches from Start */
            P.pos = a;
            P.stopAt = b ? b + 1 : 0;
            leaveAt = 0;
            startReplay(key, a, true, true);
            ui();
            return;
        }
        watch(key, a);
        /* after watch(): the new playback clears an End left from before */
        P.stopAt = b ? b + 1 : 0;
        if (window.application && typeof application.onSpectate === 'function') { try { application.onSpectate(); } catch (e) { } }
    }
    /* The server a recording comes from decides how its packets are read (ogario.v4.js
     * lmReplaySourceType). New recordings store it; for older files it is guessed from the
     * name, which a renamed file fools: the list shows the guess and lets the player choose. */
    var PROTO_NAMES = { agario: 'Agar.io', expandingland: 'Expanding Land', imsolo: 'Imsolo', agar2: 'Agar2', garix: 'Garix', sigmally: 'Sigmally', senpa: 'Senpa', deltio: 'Delt.io' };
    function protoName(p) { return p === 'private' ? T('protoPriv') : PROTO_NAMES[p] || p; }
    function recProto(r) {
        var s = r && r.side, p = s && (s.p || (s.live && s.live.p));
        return protoOk(p) ? p : '';
    }
    function protoUi() {
        if (!W || !W.proto) return;
        var list = window.LM_REPLAY_PROTOCOLS || [];
        var guess = REC && typeof window.lmReplayGuessType === 'function' ? window.lmReplayGuessType(REC.key) : '';
        W.proto.style.display = REC && list.length ? '' : 'none';
        if (!REC) return;
        var first = T('protoGuess', [protoName(guess)]), sig = REC.key + '|' + first + '|' + T('proto');
        if (W.protoSig !== sig) {
            W.protoSig = sig;
            while (W.proto.firstChild) W.proto.removeChild(W.proto.firstChild);
            var o = el('option', '', first);
            o.value = '';
            W.proto.appendChild(o);
            list.forEach(function (k) { var x = el('option', '', protoName(k)); x.value = k; W.proto.appendChild(x); });
            W.proto.title = T('proto');
            W.proto.setAttribute('aria-label', T('proto'));
        }
        var p = recProto(REC);
        if (W.proto.value !== p) W.proto.value = p;
    }
    /* the player's choice ('' = guess from the name); kept in saves, exports and clips made after it */
    function setProto(v) {
        if (!REC || (v && !protoOk(v))) return;
        REC.side.p = v;
        if (REC.side.live) { if (v) REC.side.live.p = v; else delete REC.side.live.p; }
        if (active() && typeof window.lmReplayApplyType === 'function') {
            window.lmReplayApplyType(REC.key);
            /* the packets so far were read the other way: read them again up to here */
            var at = P.pos, go = P.playing || !!(P.ff && P.ff.resume);
            /* starting states kept at "clear all" packets were read the other way too */
            if (P.cpRec) { P.cpRec = {}; P.cpN = 0; }
            seekTo(0, false);
            seekTo(at, go);
        }
        ui();
    }
    /* clip [In, Out] of the shown recording */
    function makeClip() {
        if (!REC || P.inMs == null || P.outMs == null || P.outMs <= P.inMs) { toast('info', T('needIO')); return null; }
        refreshRec();
        var a = firstAtOrAfter(REC.t, REC.n, P.inMs), b = posAtTime(REC.t, REC.n, P.outMs);
        if (b - a < 2) { toast('info', T('needIO')); return null; }
        var l = LM();
        var isCell = function (i) {
            var d = REC.arr[i];
            if (!d || !d.byteLength) return false;
            var op = d.getUint8(0);
            if (op === 16) return true;
            if (op === 255 && l && typeof l.decompressMessage === 'function') {
                try { var m = l.decompressMessage(d); return !!(m && m.length && m.readUInt8(0) === 16); } catch (e) { return false; }
            }
            return false;
        };
        var cut = cutInterval(REC.t, a, b, { checkpoints: REC.cps, carry: REC.carry, compact: OPT.compact, isCell: isCell, warmMs: 10000 });
        var cs = cutSide(REC.side, cut.base, cut.base, cut.endT);
        var side = { lmrs: 1, t: encodeTimes(cut.times), s: cs.s, e: cs.e, c: cs.c };
        if (cut.start > 0) side.start = cut.start;
        /* a clip comes from the same server */
        if (recProto(REC)) side.p = recProto(REC);
        var packets = cut.idx.map(function (i) { return REC.arr[i]; });
        var spec = REC.spec.filter(function (v) { return !(v && typeof v === 'object'); }).slice();
        if (+spec[0] > 0) spec[0] = +spec[0] + Math.round(P.inMs);
        return { packets: packets, spec: spec, side: side, name: defaultName(REC.key, REC.spec) + ' ' + T('clip') + ' ' + fmtTime(P.inMs) + '-' + fmtTime(P.outMs) };
    }

    /* ------------------------------------------------------------------ */
    /* Window                                                              */
    /* ------------------------------------------------------------------ */
    var W = null, tab = 'player', uiTimer = 0, libCache = [], libState = 'idle', delArm = null;
    function el(tag, css, text, attrs) {
        var e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text != null) e.textContent = text;
        if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
        return e;
    }
    /* label and title: text, or a function (K) for labels that follow the language; only the
     * window built once uses functions (list rows are rebuilt and use plain text) */
    function val(v) { return typeof v === 'function' ? v() : v; }
    function btn(label, title, fn, css) {
        var b = el('button', css || '', null, { type: 'button', 'class': 'lm-rs-b' });
        var setL = function () { var l = val(label); b.textContent = l; b.setAttribute('title', val(title) || l); };
        if (typeof label === 'function' || typeof title === 'function') relabels.push(setL);
        setL();
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(e); });
        return b;
    }
    function accent() { return (window.defaultSettings && defaultSettings.menuMainColor) || '#01d9cc'; }
    /* window chrome follows the menu theme live (CSS variables set by the theme); canvas keeps accent() */
    function cssMc() { return 'var(--lm-mc,' + accent() + ')'; }
    function build() {
        if (W) return W;
        /* the shared window look (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        /* above the phone controls (LMmobile z-index 100000-100004) so its buttons take the taps */
        var st = el('style');
        st.textContent =
            '#lm-rs{position:fixed;left:50%;transform:translateX(-50%);bottom:30px;width:min(760px,calc(100vw - 12px));max-height:calc(100vh - 40px);' + // i18n-ok: CSS
            'z-index:100005;display:flex;flex-direction:column;background:var(--lm-w-bg,var(--lm-pc,rgba(14,17,23,.95)));color:var(--lm-tc,#e8e8e8);font-size:var(--lm-w-fs,12px);line-height:1.3;font-family:inherit;overflow:hidden;' +
            'border:1px solid var(--lm-pc2,rgba(255,255,255,.15));border-top:3px solid ' + cssMc() + ';border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);touch-action:manipulation;user-select:none;-webkit-user-select:none;}' + // i18n-ok: CSS
            '#lm-rs *{box-sizing:border-box;}' +
            '#lm-rs .lm-rs-hd{border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.15));background:var(--lm-w-head,linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%));}' +
            '#lm-rs .lm-rs-hd>b{font-size:var(--lm-w-title,12px);}' +
            '#lm-rs .lm-rs-b{min-height:var(--lm-w-ctl,30px);min-width:var(--lm-w-ctl,30px);padding:2px 8px;margin:0 3px 0 0;border:1px solid var(--lm-pc2,rgba(255,255,255,.18));border-radius:var(--lm-radius-s,5px);background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc,#eee);font:inherit;cursor:pointer;white-space:nowrap;flex:0 0 auto;}' +
            '#lm-rs .lm-rs-b:hover{background:var(--lm-w-btn-h,rgba(255,255,255,.16));}' +
            '#lm-rs .lm-rs-b.on{border-color:' + cssMc() + ';color:' + cssMc() + ';}' + // i18n-ok: CSS
            '#lm-rs .lm-rs-b:disabled{opacity:.4;cursor:default;}' +
            '#lm-rs .lm-rs-row{display:flex;align-items:center;padding:3px 8px;gap:2px;}' +
            '#lm-rs .lm-rs-scroll{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin;}' +
            '#lm-rs select,#lm-rs input[type=text],#lm-rs input[type=search]{min-height:var(--lm-w-ctl,30px);background:var(--lm-w-field,var(--lm-pc2,#1d222b));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.2));border-radius:var(--lm-radius-s,5px);font:inherit;padding:2px 6px;}' +
            '#lm-rs label{display:inline-flex;align-items:center;gap:3px;margin-right:8px;white-space:nowrap;cursor:pointer;}' +
            '#lm-rs .lm-rs-track{position:relative;height:26px;margin:2px 8px;background:rgba(255,255,255,.08);border-radius:var(--lm-radius-s,5px);cursor:pointer;touch-action:none;}' +
            '#lm-rs .lm-rs-fill{position:absolute;left:0;top:0;bottom:0;background:rgba(255,255,255,.12);border-radius:5px 0 0 5px;pointer-events:none;}' +
            '#lm-rs .lm-rs-io{position:absolute;top:0;bottom:0;background:rgba(255,215,0,.16);border-left:2px solid #ffd700;border-right:2px solid #ffd700;pointer-events:none;}' +
            '#lm-rs .lm-rs-head{position:absolute;top:-2px;bottom:-2px;width:2px;margin-left:-1px;background:#fff;pointer-events:none;}' +
            '#lm-rs .lm-rs-mk{position:absolute;top:0;bottom:0;width:14px;margin-left:-7px;display:flex;align-items:center;justify-content:center;font-size:10px;cursor:pointer;}' +
            '#lm-rs .lm-rs-mk i{display:block;width:4px;height:16px;border-radius:2px;pointer-events:none;}' +
            '#lm-rs .lm-rs-chip{display:inline-flex;align-items:center;gap:4px;min-height:26px;padding:1px 8px;margin-right:4px;border-radius:13px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);cursor:pointer;white-space:nowrap;flex:0 0 auto;}' +
            '#lm-rs .lm-rs-item{padding:5px 8px;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.08));}' +
            '#lm-rs .lm-rs-tag{display:inline-block;padding:0 6px;margin:0 3px 0 0;border-radius:8px;background:var(--lm-w-btn-h,rgba(255,255,255,.1));font-size:var(--lm-w-fs-s,11px);}' +
            '#lm-rs .lm-rs-dim{opacity:.7;}' +
            '#lm-rs.min .lm-rs-full{display:none!important;}' +
            '@media (max-height:460px){#lm-rs{bottom:4px;max-height:calc(100vh - 8px);font-size:11px;}#lm-rs .lm-rs-b{min-height:28px;}}';
        document.head.appendChild(st);
        W = el('div', '', null, { id: 'lm-rs', role: 'dialog' });
        W.classList.add('lm-modal-container', 'lm-w');
        L(function () { W.setAttribute('aria-label', T('title')); W.dir = dirNow(); });
        /* clicks and taps on the window are not game input */
        ['mousedown', 'mouseup', 'pointerdown', 'touchstart', 'touchend', 'wheel', 'contextmenu', 'dblclick'].forEach(function (t) {
            W.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
        });
        /* typing in the search or rename boxes is not a hotkey */
        ['keydown', 'keyup', 'keypress'].forEach(function (t) {
            W.addEventListener(t, function (e) { if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) e.stopPropagation(); });
        });
        /* P0 fix: block game-action keys (split, feed, spawn, spectate) from reaching
         * the game engine while Replay Studio is driving playback. This prevents macros
         * from firing, the player from accidentally spawning, and camera desyncs.
         * active(): a paused replay left for a live server must not keep blocking them. */
        var BLOCK_KEYS = { ' ': 1, w: 1, W: 1, e: 1, E: 1, r: 1, R: 1, t: 1, T: 1, Enter: 1, Escape: 1 };
        /* typing in a text box is not game input: those letters, space, Enter and Esc could not be
         * typed (Command Centre search, chat, renaming a recording) and Esc did not close the box */
        var typingIn = function (t) { return !!(t && (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName) || t.isContentEditable)); };
        document.addEventListener('keydown', function (e) {
            if (P.driving && BLOCK_KEYS[e.key] && !typingIn(e.target) && active()) { e.stopImmediatePropagation(); e.preventDefault(); }
        }, true);
        document.addEventListener('keyup', function (e) {
            if (P.driving && BLOCK_KEYS[e.key] && !typingIn(e.target) && active()) { e.stopImmediatePropagation(); e.preventDefault(); }
        }, true);
        /* header */
        /* header, timeline and transport stay left-to-right in Arabic too (close button on the right) */
        var head = el('div', 'display:flex;align-items:center;padding:var(--lm-w-hpad,4px 4px 4px 10px);gap:4px;', null, { 'class': 'lm-rs-hd', dir: 'ltr' });
        var hb = el('b', 'margin-right:6px;color:' + cssMc() + ';white-space:nowrap;text-transform:uppercase;letter-spacing:1px;');
        L(function () { hb.textContent = T('title'); });
        head.appendChild(hb);
        W.tabP = btn(K('player'), '', function () { setTab('player'); });
        W.tabL = btn(K('library'), '', function () { setTab('library'); });
        W.tabP.classList.add('lm-rs-full'); W.tabL.classList.add('lm-rs-full');
        head.appendChild(W.tabP); head.appendChild(W.tabL);
        head.appendChild(el('span', 'flex:1 1 auto;'));
        W.minB = btn('\u2581', K('minimize'), function () { W.classList.toggle('min'); });
        head.appendChild(W.minB);
        head.appendChild(btn('\u2715', K('close'), close, 'min-width:38px;font-size:15px;color:var(--lm-tc2,#eee);'));
        W.appendChild(head);
        /* player */
        var pv = W.pv = el('div', 'display:flex;flex-direction:column;min-height:0;');
        var r1 = el('div', '', null, { 'class': 'lm-rs-row lm-rs-full' });
        W.sel = el('select', 'max-width:46%;flex:0 1 auto;');
        W.sel.addEventListener('change', function () { select(W.sel.value); });
        r1.appendChild(W.sel);
        W.info = el('span', 'flex:1 1 auto;margin-left:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', '', { 'class': 'lm-rs-dim' });
        r1.appendChild(W.info);
        pv.appendChild(r1);
        /* timeline */
        var tr = W.track = el('div', '', null, { 'class': 'lm-rs-track', dir: 'ltr' });
        W.io = el('div', 'display:none;', null, { 'class': 'lm-rs-io' });
        W.fill = el('div', '', null, { 'class': 'lm-rs-fill' });
        W.marks = el('div', 'position:absolute;inset:0;');
        W.headEl = el('div', '', null, { 'class': 'lm-rs-head' });
        tr.appendChild(W.fill); tr.appendChild(W.io); tr.appendChild(W.marks); tr.appendChild(W.headEl);
        var dragging = false, dragMs = null;
        var frac = function (e) { var r = tr.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))); };
        tr.addEventListener('pointerdown', function (e) {
            if (!REC || e.target.classList.contains('lm-rs-mk')) return;
            dragging = true; dragMs = frac(e) * REC.endT;
            try { tr.setPointerCapture(e.pointerId); } catch (x) { }
            ui();
        });
        tr.addEventListener('pointermove', function (e) { if (dragging && REC) { dragMs = frac(e) * REC.endT; W.headEl.style.left = (frac(e) * 100) + '%'; W.time.textContent = fmtTime(dragMs) + ' / ' + fmtTime(REC.endT); } });
        var endDrag = function () { if (!dragging) return; dragging = false; if (REC && dragMs != null) seekTime(dragMs); dragMs = null; };
        tr.addEventListener('pointerup', endDrag);
        tr.addEventListener('pointercancel', function () { dragging = false; dragMs = null; ui(); });
        W.isDragging = function () { return dragging; };
        pv.appendChild(tr);
        /* controls */
        var r2 = el('div', '', null, { 'class': 'lm-rs-row lm-rs-scroll', dir: 'ltr' });
        W.time = el('span', 'min-width:84px;margin-right:4px;font-variant-numeric:tabular-nums;white-space:nowrap;');
        r2.appendChild(W.time);
        r2.appendChild(btn('\u23ee', K('toStart'), function () { seekTo(REC ? REC.side.start || 0 : 0); }));
        r2.appendChild(btn('-5', K('back5'), function () { seekTime(tAt(P.pos) - 5000); }));
        r2.appendChild(btn('\u25c0|', K('stepB'), function () { stepPacket(-1); }));
        /* backwards at the chosen speed (the old replay window's negative delay) */
        W.revB = btn('\u25c0', K('playRev'), function () { if ((P.playing || (P.ff && P.ff.resume)) && P.dir < 0) pause(); else play(-1); }, 'min-width:42px;');
        r2.appendChild(W.revB);
        W.playB = btn('\u25b6', K('play'), function () { if ((P.playing || (P.ff && P.ff.resume)) && P.dir > 0) pause(); else play(1); }, 'min-width:42px;');
        r2.appendChild(W.playB);
        r2.appendChild(btn('|\u25b6', K('stepF'), function () { stepPacket(1); }));
        r2.appendChild(btn('+5', K('fwd5'), function () { seekTime(tAt(P.pos) + 5000); }));
        W.spd = el('select', 'margin-right:3px;');
        L(function () { W.spd.title = T('speed'); });
        SPEEDS.forEach(function (v) { var o = el('option', '', v + 'x'); o.value = String(v); W.spd.appendChild(o); });
        W.spd.addEventListener('change', function () { setSpeed(+W.spd.value); });
        r2.appendChild(W.spd);
        var full = function (b) { b.classList.add('lm-rs-full'); return b; };
        r2.appendChild(full(btn(function () { return '[ ' + T('inPt'); }, K('inTitle'), function () { P.inMs = tAt(P.pos); if (P.outMs != null && P.outMs <= P.inMs) P.outMs = null; ui(); })));
        r2.appendChild(full(btn(function () { return T('outPt') + ' ]'; }, K('outTitle'), function () { P.outMs = tAt(P.pos); if (P.inMs != null && P.inMs >= P.outMs) P.inMs = null; ui(); })));
        r2.appendChild(full(btn('\u2715[]', '', function () { P.inMs = P.outMs = null; ui(); })));
        r2.appendChild(full(btn(K('clipX'), '', function () { var c = makeClip(); if (c) download(lmFileParts(c.packets, c.spec, c.side), c.name); })));
        r2.appendChild(full(btn(K('clipL'), '', function () {
            var c = makeClip();
            if (!c) return;
            var entry = buildEntry({ packets: c.packets, spec: c.spec, side: c.side, key: REC.key, name: c.name, tags: ['clip'], clip: true });
            libPut(entry.meta, entry.data).then(function (m) { toast('success', T('saved') + ': ' + m.name); refreshLibrary(); }, libError);
        })));
        W.saveB = full(btn(K('save'), '', function () { if (REC) saveMemory(REC.key); }));
        r2.appendChild(W.saveB);
        r2.appendChild(full(btn(K('export'), '', function () { if (REC) exportMemory(REC.key); })));
        r2.appendChild(full(btn(K('instant'), '', function () { instant(); })));
        W.secs = el('select', 'margin-right:3px;');
        W.secs.classList.add('lm-rs-full');
        [15, 30, 45, 60].forEach(function (v) { var o = el('option'); o.value = String(v); W.secs.appendChild(o); });
        L(function () {
            W.secs.title = T('instant');
            for (var i = 0; i < W.secs.options.length; i++) W.secs.options[i].textContent = T('secsN', [W.secs.options[i].value]);
        });
        W.secs.addEventListener('change', function () {
            var d = dms();
            d.instantReplaySecs = +W.secs.value;
            try { if (window.application && application.saveSettings) application.saveSettings(d, 'ogarioSettings'); } catch (e) { }
            /* change: the slider's knob (rangeslider) moves to the value too; with val() alone it
             * stayed where it was while the number next to it changed */
            $('#instantReplaySecs-slider').val(d.instantReplaySecs).trigger('change'); $('#instantReplaySecs-value').text(d.instantReplaySecs);
        });
        r2.appendChild(W.secs);
        /* leave the replay: end the session (skins back), then join the previous server */
        W.backB = btn(K('backGame'), '', function () { dispose('stopped'); if (window._lmJoinPrevServer) window._lmJoinPrevServer(); });
        r2.appendChild(W.backB);
        pv.appendChild(r2);
        /* overlay toggles + bookmark chips */
        var r3 = el('div', '', null, { 'class': 'lm-rs-row lm-rs-scroll lm-rs-full' });
        var chk = function (key, label, title) {
            var lb = el('label'), c = el('input', '', null, { type: 'checkbox' }), tn = document.createTextNode('');
            c.checked = !!OPT[key];
            c.addEventListener('change', function () { OPT[key] = c.checked; saveOpt(); if (key !== 'compact') { overlayClear(); overlayOn(); } });
            lb.appendChild(c); lb.appendChild(tn);
            L(function () { tn.nodeValue = T(label); lb.title = T(title || label); });
            return lb;
        };
        r3.appendChild(chk('cur', 'cursor'));
        r3.appendChild(chk('spl', 'splits'));
        r3.appendChild(chk('compact', 'compact', 'compactT'));
        /* colour filter of the replay's cells */
        W.fx = el('select', 'margin-right:6px;');
        [['', 'fxNone'], ['grey', 'fxGrey'], ['sepia', 'fxSepia'], ['hue', 'fxHue']].forEach(function (f) {
            var o = el('option'); o.value = f[0]; W.fx.appendChild(o);
            L(function () { o.textContent = T(f[1]); });
        });
        L(function () { W.fx.title = T('fx'); W.fx.setAttribute('aria-label', T('fx')); });
        W.fx.value = OPT.fx;
        W.fx.addEventListener('change', function () { OPT.fx = FX.indexOf(W.fx.value) !== -1 ? W.fx.value : ''; saveOpt(); applyFx(); });
        r3.appendChild(W.fx);
        /* the server the replay was recorded on (see protoUi) */
        W.proto = el('select', 'margin-right:6px;max-width:150px;');
        W.proto.addEventListener('change', function () { setProto(W.proto.value); });
        r3.appendChild(W.proto);
        W.chips = el('div', 'display:flex;flex:1 1 auto;');
        r3.appendChild(W.chips);
        pv.appendChild(r3);
        W.appendChild(pv);
        /* library */
        var lv = W.lv = el('div', 'display:none;flex-direction:column;min-height:0;flex:1 1 auto;', null, { 'class': 'lm-rs-full' });
        var l1 = el('div', '', null, { 'class': 'lm-rs-row' });
        W.q = el('input', 'flex:1 1 auto;min-width:60px;', null, { type: 'search' });
        L(function () { W.q.setAttribute('placeholder', T('search')); });
        W.q.addEventListener('input', drawLibrary);
        l1.appendChild(W.q);
        W.sort = el('select', 'margin:0 3px;');
        [['new', 'sortNew'], ['old', 'sortOld'], ['name', 'sortName'], ['duration', 'sortDur'], ['mass', 'sortMass'], ['size', 'sortSize']].forEach(function (s) {
            var o = el('option'); o.value = s[0]; W.sort.appendChild(o);
            L(function () { o.textContent = T(s[1]); });
        });
        W.sort.value = OPT.sort;
        W.sort.addEventListener('change', function () { OPT.sort = W.sort.value; saveOpt(); drawLibrary(); });
        l1.appendChild(W.sort);
        var file = el('input', 'display:none;', null, { type: 'file', accept: '.lm,text/plain' });
        file.addEventListener('change', function () { importFile(file.files && file.files[0]); file.value = ''; });
        l1.appendChild(file);
        l1.appendChild(btn(K('import'), '', function () { file.click(); }));
        lv.appendChild(l1);
        W.mem = el('div', 'padding:0 8px 4px;');
        lv.appendChild(W.mem);
        W.list = el('div', 'overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:60px;max-height:calc(100vh - 190px);');
        lv.appendChild(W.list);
        W.usage = el('div', 'padding:3px 8px 5px;', '', { 'class': 'lm-rs-dim' });
        lv.appendChild(W.usage);
        W.appendChild(lv);
        document.body.appendChild(W);
        return W;
    }
    function setTab(t) {
        tab = t;
        if (!W) return;
        W.classList.remove('min');
        W.pv.style.display = t === 'player' ? 'flex' : 'none';
        W.lv.style.display = t === 'library' ? 'flex' : 'none';
        W.tabP.classList.toggle('on', t === 'player');
        W.tabL.classList.toggle('on', t === 'library');
        if (t === 'library') refreshLibrary();
    }
    function select(key) {
        if (!recArr(key)) return;
        /* another recording (chosen, imported, from the library): the playing one's session ends */
        if (P.driving && REC && REC.key !== key) dispose('stopped');
        if (!REC || REC.key !== key) { openRec(key); P.pos = P.driving ? P.pos : 0; P.inMs = P.outMs = null; P.stopAt = 0; W && (W.marksSig = ''); }
        ui();
    }
    function open(key) {
        build();
        W.style.display = 'flex';
        if (key && recArr(key)) select(key);
        else if (!REC || !recArr(REC.key)) {
            var l = LM(), cur = l && l.playingReplayServer && inReplayOf(l.playingReplayServer) ? l.playingReplayServer : null;
            var keys = recKeys(), lk = liveKey();
            var k = cur && recArr(cur) ? cur : (lk && recArr(lk) && recArr(lk).length > 10 ? lk : keys[keys.length - 1]);
            if (k) select(k);
        }
        setTab(tab);
        if (!uiTimer) uiTimer = setInterval(ui, 250);
        ui();
    }
    function close() {
        if (W) W.style.display = 'none';
        if (uiTimer) { clearInterval(uiTimer); uiTimer = 0; }
        /* a ?replay= download still running would open the Studio again when it arrives */
        urlJob.cancel();
        /* closing ends the playback session (see dispose): the stopped replay world stays shown,
         * still as a replay, until a server is joined */
        dispose('stopped');
        cancelDeathTimer();
    }
    function isOpen() { return !!(W && W.style.display !== 'none'); }
    function ui() {
        /* the shown recording was dropped from memory (newer ones pushed it out) */
        if (REC && recArr(REC.key) !== REC.arr) { REC = null; if (P.driving) { dispose('stopped'); return; } P.playing = false; }
        /* the replay was left while paused (a live server joined): nothing ticks to notice it */
        if (P.driving && !P.ff && !active()) { dispose('stopped'); return; }
        if (!W || W.style.display === 'none') return;
        /* recordings list */
        var keys = recKeys(), sig = keys.join('\n') + '|' + liveKey();
        if (W.selSig !== sig) {
            W.selSig = sig;
            while (W.sel.firstChild) W.sel.removeChild(W.sel.firstChild);
            keys.forEach(function (k) {
                var sp = (window.RecordedArenasSpecifications || {})[k] || [], d0 = +sp[0] > 0 ? new Date(+sp[0]) : null;
                var hm = d0 ? d0.getHours() + ':' + (d0.getMinutes() < 10 ? '0' : '') + d0.getMinutes() + ' ' : '';
                var o = el('option', '', hm + serverLabel(k) + (k === liveKey() ? ' \u25cf' : ''));
                o.value = k;
                W.sel.appendChild(o);
            });
        }
        if (REC) W.sel.value = REC.key;
        var lb = document.getElementById('lm-replay-bar');
        W.style.bottom = lb && lb.style.display !== 'none' && W.offsetHeight < innerHeight - 80 ? (parseInt(lb.style.bottom, 10) || 14) + 16 + 'px' : '';
        if (!REC) {
            W.info.textContent = T('noRec');
            W.time.textContent = '';
            W.marks.textContent = '';
            W.chips.textContent = '';
            W.fill.style.width = '0';
            W.headEl.style.left = '0';
            W.playB.disabled = true;
            W.revB.disabled = true;
            W.backB.style.display = inReplay() ? '' : 'none';
            protoUi();
            return;
        }
        refreshRec();
        W.playB.disabled = false;
        W.revB.disabled = false;
        var spec = REC.spec, d = +spec[0] > 0 ? new Date(+spec[0]) : null;
        /* game info of the recording: region and mode as the old replay window showed them, then the nick */
        var si = function (v) { return typeof v === 'string' && v ? ' \u00b7 ' + v.slice(0, 40) : ''; };
        W.info.textContent = (d ? d.toLocaleString() + ' \u00b7 ' : '') + serverLabel(REC.key) + si(spec[2]) + si(spec[1]) + si(spec[3]) +
            ' \u00b7 ' + T('packets', [REC.n]) + (REC.side.est ? ' \u00b7 ' + T('est') : '') + (REC.key === liveKey() ? ' \u00b7 ' + T('live') : '') +
            (REC.arr._lmLib ? ' \u00b7 ' + T('saved') : '');
        var total = Math.max(1, REC.endT);
        /* a step of playing backwards shows where it goes, not the rebuild running up to it */
        var revJob = P.ff && P.ff.rev, cur = tAt(revJob ? P.ff.target : P.pos);
        if (!(W.isDragging && W.isDragging())) {
            W.headEl.style.left = Math.min(100, cur / total * 100) + '%';
            W.time.textContent = (P.ff && !revJob ? T('seeking') + ' ' + Math.round((P.pos - P.ff.from) / Math.max(1, P.ff.target - P.ff.from) * 100) + '%' : fmtTime(cur) + ' / ' + fmtTime(REC.endT));
        }
        W.fill.style.width = Math.min(100, cur / total * 100) + '%';
        if (P.inMs != null || P.outMs != null) {
            var a = P.inMs != null ? P.inMs : 0, b = P.outMs != null ? P.outMs : REC.endT;
            W.io.style.display = '';
            W.io.style.left = (a / total * 100) + '%';
            W.io.style.width = Math.max(0, (b - a) / total * 100) + '%';
        } else W.io.style.display = 'none';
        var playing = P.playing || !!(P.ff && P.ff.resume), fwd = playing && P.dir > 0, rev = playing && P.dir < 0;
        W.playB.textContent = fwd ? '\u275a\u275a' : '\u25b6';
        W.playB.title = fwd ? T('pause') : T('play');
        W.revB.textContent = rev ? '\u275a\u275a' : '\u25c0';
        W.revB.title = rev ? T('pause') : T('playRev');
        W.revB.classList.toggle('on', rev);
        if (W.fx.value !== OPT.fx) W.fx.value = OPT.fx;
        protoUi();
        if (String(P.speed) !== W.spd.value) W.spd.value = String(P.speed);
        if (String(instantSecs()) !== W.secs.value) W.secs.value = String(instantSecs());
        W.backB.style.display = inReplay() ? '' : 'none';
        /* P2 fix #90: also disable save when the recording has no _lmLib yet but
         * a save is already in progress (prevents duplicate saves from rapid clicks) */
        W.saveB.disabled = !!REC.arr._lmLib || !!REC.arr._lmSaving;
        /* markers (rebuilt only when they change) */
        var msig = REC.key + ':' + REC.marks.length + ':' + Math.round(total / 1000);
        if (W.marksSig !== msig) {
            W.marksSig = msig;
            W.marks.textContent = '';
            W.chips.textContent = '';
            REC.marks.forEach(function (m) {
                var k = KIND[m.k] || KIND.kill, label = markLabel(m) + ' ' + fmtTime(m.t);
                var jump = function (e) { e.preventDefault(); e.stopPropagation(); seekTime(Math.max(0, m.t - 2000)); };
                var mk = el('div', 'left:' + (m.t / total * 100) + '%;', null, { 'class': 'lm-rs-mk', title: label });
                var bar = el('i', 'background:' + k.c + ';');
                mk.appendChild(bar);
                mk.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
                mk.addEventListener('click', jump);
                W.marks.appendChild(mk);
                var chip = el('span', '', null, { 'class': 'lm-rs-chip', title: label });
                chip.appendChild(el('b', 'color:' + k.c + ';', k.s));
                chip.appendChild(document.createTextNode(markLabel(m) + ' \u00b7 ' + fmtTime(m.t)));
                chip.addEventListener('click', jump);
                W.chips.appendChild(chip);
            });
        }
    }

    /* library list */
    function refreshLibrary() {
        if (!W) return;
        libState = 'loading';
        drawLibrary();
        libList().then(function (list) { libCache = list; libState = 'ok'; drawLibrary(); }, function () { libState = 'error'; drawLibrary(); });
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(function (q) {
                if (W && q && q.quota) W.usage.textContent = T('storage') + ': ' + fmtBytes(q.usage || 0) + ' / ' + fmtBytes(q.quota);
            }, function () { });
        }
    }
    function drawLibrary() {
        if (!W || tab !== 'library') return;
        /* recordings in memory that are not saved yet */
        W.mem.textContent = '';
        var unsaved = recKeys().filter(function (k) { return !recArr(k)._lmLib; });
        if (unsaved.length) {
            W.mem.appendChild(el('div', 'margin:2px 0;', T('inMem'), { 'class': 'lm-rs-dim' }));
            var row = el('div', 'display:flex;', null, { 'class': 'lm-rs-scroll' });
            unsaved.forEach(function (k) {
                row.appendChild(btn('\u2b07 ' + serverLabel(k) + (k === liveKey() ? ' \u25cf' : ''), T('save'), function () { saveMemory(k); }));
            });
            W.mem.appendChild(row);
        }
        W.list.textContent = '';
        if (libState === 'error') { W.list.appendChild(el('div', 'padding:10px 8px;', T('noLib'))); return; }
        var list = sortRecords(searchRecords(libCache, W.q.value), W.sort.value);
        if (!list.length) { W.list.appendChild(el('div', 'padding:10px 8px;', libState === 'loading' ? '\u2026' : T('empty'), { 'class': 'lm-rs-dim' })); return; }
        list.forEach(function (m) { W.list.appendChild(libItem(m)); });
    }
    function libItem(m) {
        var it = el('div', '', null, { 'class': 'lm-rs-item' });
        var top = el('div', 'display:flex;align-items:center;gap:4px;');
        var name = el('b', 'flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', m.name);
        top.appendChild(name);
        top.appendChild(btn('\u25b6', T('play'), function () {
            libGet(m.id).then(function (o) {
                if (!o.meta || !o.data) { toast('error', T('badFile')); return; }
                var key = materialize(o.meta, o.data);
                if (!key) return;
                select(key);
                setTab('player');
                play(1);
            }, libError);
        }));
        top.appendChild(btn('\u270e', T('rename'), function () { editField(it, m, 'name'); }));
        top.appendChild(btn('#', T('tags'), function () { editField(it, m, 'tags'); }));
        top.appendChild(btn('\u2b07', T('export'), function () { exportLibrary(m); }));
        var del = btn('\u2716', T('del'), function () {
            if (delArm !== m.id) { delArm = m.id; del.textContent = T('delSure'); setTimeout(function () { if (delArm === m.id) { delArm = null; del.textContent = '\u2716'; } }, 3000); return; }
            delArm = null;
            libDelete(m.id).then(function () {
                (window.RecordedProtocolArenas || []).forEach(function (k) { var a = recArr(k); if (a && a._lmLib === m.id) delete a._lmLib; });
                refreshLibrary();
            }, libError);
        });
        top.appendChild(del);
        it.appendChild(top);
        var sub = el('div', 'margin-top:2px;', null, { 'class': 'lm-rs-dim' });
        m.tags.forEach(function (t) { sub.appendChild(el('span', '', '#' + t, { 'class': 'lm-rs-tag' })); });
        sub.appendChild(document.createTextNode(new Date(m.date).toLocaleString() + ' \u00b7 ' + m.server + (m.nick ? ' \u00b7 ' + m.nick : '') + ' \u00b7 ' + fmtTime(m.duration) +
            (m.est ? '~' : '') + (m.peakMass ? ' \u00b7 ' + T('peak') + ' ' + fmtMass(m.peakMass) : '') + ' \u00b7 ' + fmtBytes(m.bytes) + (m.marks ? ' \u00b7 ' + m.marks + ' \u2691' : '')));
        it.appendChild(sub);
        return it;
    }
    function editField(it, m, field) {
        var box = el('div', 'display:flex;gap:4px;margin-top:4px;');
        var inp = el('input', 'flex:1 1 auto;min-width:40px;', null, { type: 'text', maxlength: field === 'name' ? '80' : '260' });
        inp.value = field === 'name' ? m.name : m.tags.join(', ');
        var done = function (saveIt) {
            if (saveIt) {
                var nm = JSON.parse(JSON.stringify(m));
                if (field === 'name') nm.name = inp.value; else nm.tags = parseTags(inp.value);
                libUpdateMeta(nm).then(refreshLibrary, libError);
            }
            box.remove();
        };
        inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') done(true); else if (e.key === 'Escape') done(false); });
        inp.addEventListener('keyup', function (e) { e.stopPropagation(); });
        box.appendChild(inp);
        box.appendChild(btn('\u2713', '', function () { done(true); }));
        box.appendChild(btn('\u2715', '', function () { done(false); }));
        it.appendChild(box);
        inp.focus();
    }

    /* a language change: the fixed labels, then everything ui() and the library draw */
    if (window.LMi18n && window.LMi18n.onChange) window.LMi18n.onChange(function () {
        if (!W) return;
        relabels.forEach(function (f) { try { f(); } catch (e) { } });
        W.marksSig = '';
        if (isOpen()) { ui(); if (tab === 'library') refreshLibrary(); }
    });

    /* entry point used by ogario.v4.js (window.lmReplayStudio) and the hotkeys */
    RS.run = function (action, arg) {
        /* another replay asked for (Death recap, instant replay, a replay^ token): a pending
         * ?replay= download no longer is what the player wants */
        if (action === 'instant' || action === 'watch') urlJob.cancel();
        if (action === 'instant') return instant();
        if (action === 'toggle') return isOpen() ? close() : open(arg);
        if (action === 'close') return close();
        /* arg: [recording key, start packet] */
        if (action === 'watch') return Array.isArray(arg) ? watch(arg[0], arg[1]) : watch(arg, 0);
        /* arg: [URL, start packet, end packet] */
        if (action === 'url') return Array.isArray(arg) ? loadUrl(arg[0], arg[1], arg[2]) : loadUrl(arg);
        return open(arg);
    };
    RS.open = open;
    RS.close = close;
    /* the library for scripts and the smoke test */
    RS.store = { list: libList, get: libGet, put: libPut, update: libUpdateMeta, remove: libDelete };
    RS.state = function () {
        return { open: isOpen(), key: REC && REC.key, pos: P.pos, n: REC ? REC.n : 0, playing: P.playing, driving: P.driving, speed: P.speed, dir: P.dir, fx: OPT.fx, stopAt: P.stopAt, marks: REC ? REC.marks.length : 0, armed: armed, seeking: !!P.ff };
    };
    /* the transport without the window, for scripts and developers/tests/replaystudio.js */
    RS.drive = { play: play, pause: pause, seek: seekTo, step: stepPacket, select: select, clip: function (inMs, outMs) { P.inMs = inMs; P.outMs = outMs; return makeClip(); } };
})();
