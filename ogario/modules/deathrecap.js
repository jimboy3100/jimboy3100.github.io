/* Legend Mod death recap.
 * Option (Settings > Stats, off by default): gameOverStats (the Game Over card, which shows the
 * recap of the last 20 s).
 * While it is off this file registers no listeners and runs no timers. While it is on it
 * samples your own mass and cell count
 * 4 times a second while you are alive (fixed ring buffers, nothing allocated per sample), and the
 * eat loop of ogario.v4.js reports exact eats of and by your cells. Only data the client already
 * receives is used: the biggest visible enemy near you, the eat events and, on Expanding Land, the
 * server's killer info in the game over packet (legendmod._lmKiller with server: true).
 * With multibox the recap is of the player you control: one life at a time (slot, slotEpoch and
 * life), the main player's or a unit's (its own cells and mass). It follows the player you switch
 * to while that one lives and stays on the last one while the one you control is dead. A unit's
 * life has no eat events (the eat loop is the main connection's) and no server killer report; the
 * Game Over card (the main player's) shows only the main player's life.
 */
(function () {
    'use strict';
    if (window._lmDeathRecapLoaded) return;
    window._lmDeathRecapLoaded = true;

    var SAMPLE_MS = 250;
    var CAP = 128;              /* samples kept: 32 s */
    var EV_CAP = 64;            /* events kept (splits, merges, eats, losses) */
    var RECAP_MS = 20000;       /* the recap covers the last 20 s */
    var LOSS_WIN = 2000;        /* a loss is a drop within 2 s ... */
    var LOSS_PCT = 15;          /* ... of at least 15 % (recap) ... */
    var LOSS_MIN = 100;         /* ... and at least 100 mass */

    /* ---------- pure helpers (also used by developers/tests/deathrecap.js) ---------- */

    function fmtNum(n) {
        n = Math.round(+n || 0);
        var s = String(Math.abs(n)), out = '';
        while (s.length > 3) { out = ',' + s.slice(-3) + out; s = s.slice(0, -3); }
        return (n < 0 ? '-' : '') + s + out;
    }

    function makeRing(cap) {
        var nn = new Array(cap);
        for (var i = 0; i < cap; i++) nn[i] = null;
        return { cap: cap, len: 0, head: 0, t: new Float64Array(cap), m: new Float64Array(cap), c: new Uint16Array(cap), p: new Int32Array(cap), nn: nn, nm: new Float64Array(cap) };
    }
    function ringClear(R) { R.len = 0; R.head = 0; for (var i = 0; i < R.cap; i++) R.nn[i] = null; }
    /* nick: biggest visible enemy near you that is bigger than one of your cells ('' = unnamed, null = none) */
    function ringPush(R, t, m, c, p, nick, nmass) {
        var i = R.head;
        R.t[i] = t; R.m[i] = m; R.c[i] = c; R.p[i] = p; R.nn[i] = nick; R.nm[i] = nmass || 0;
        R.head = (i + 1) % R.cap;
        if (R.len < R.cap) R.len++;
    }
    /* buffer index of the k-th oldest sample */
    function ringIdx(R, k) { return (R.head - R.len + k + R.cap * 2) % R.cap; }
    /* the last sample at or before t (the oldest one when all are later); -1 when empty */
    function sampleAt(R, t) {
        if (!R.len) return -1;
        var best = ringIdx(R, 0);
        for (var k = 0; k < R.len; k++) {
            var i = ringIdx(R, k);
            if (R.t[i] <= t) best = i; else break;
        }
        return best;
    }
    function peakSince(R, since) {
        var peak = 0;
        for (var k = R.len - 1; k >= 0; k--) {
            var i = ringIdx(R, k);
            if (R.t[i] < since) break;
            if (R.m[i] > peak) peak = R.m[i];
        }
        return peak;
    }
    /* the mass lost since the peak when it is a real loss, else 0 */
    function lossCheck(peak, mass, pct, minAbs) {
        var drop = peak - mass;
        if (!(peak > 0) || drop < (minAbs || 0) || drop * 100 < pct * peak) return 0;
        return drop;
    }
    /* the enemy that ate the most of your cells in [t0, t1] (exact eat events), or null */
    function attribute(events, t0, t1) {
        var sums = null, best = null, bestA = 0;
        for (var i = 0; i < events.length; i++) {
            var e = events[i];
            if (!e || e.type !== 'eaten' || e.t2 < t0 || e.t > t1) continue;
            sums = sums || {};
            var k = (e.v ? '\u0001virus' : '\u0002' + e.nick);
            sums[k] = (sums[k] || 0) + e.a;
            if (sums[k] > bestA) { bestA = sums[k]; best = e; }
        }
        return best ? { nick: best.nick, virus: !!best.v, a: bestA } : null;
    }

    var SCORE = { loss: 100, virus: 70, split: 50, eaten: 40, ate: 30, merge: 20 };

    /* The last ~20 s as 3-6 steps: where you started, up to 4 notable events, how you died.
     * R: sample ring; events: plain array of { type, t, t2, a, peak, nick, v, near };
     * killer: { nick, virus, exact } or null. Steps: { kind, t, s (seconds before death), ... }. */
    function summarise(R, events, deathAt, killer, opt) {
        opt = opt || {};
        var span = opt.span || RECAP_MS, maxMid = opt.maxMid || 4, steps = [];
        if (!R.len) return steps;
        var startT = Math.max(deathAt - span, R.t[ringIdx(R, 0)]);
        var si = sampleAt(R, startT);
        steps.push({ kind: 'mass', t: R.t[si], m: R.m[si], c: R.c[si] });
        var cellsAfter = function (t) { var i = sampleAt(R, t + 300); return i < 0 ? 0 : R.c[i]; };
        var losses = [], cands = [], i, e;
        for (i = 0; i < events.length; i++) {
            e = events[i];
            if (e && e.type === 'loss' && e.t > startT && e.t <= deathAt) losses.push(e);
        }
        var kNick = killer ? killer.nick : null;
        for (i = 0; i < events.length; i++) {
            e = events[i];
            if (!e || e.t <= startT || e.t > deathAt + 500) continue;
            var st = null;
            if (e.type === 'loss') {
                /* the death step already says it when the loss ends in the death */
                if (e.t >= deathAt - 1500) continue;
                var who = attribute(events, e.t - LOSS_WIN - 500, e.t2 + 500);
                st = { kind: 'loss', t: e.t, a: e.a, pct: e.peak ? Math.round(e.a * 100 / e.peak) : 0 };
                if (who) { st.nick = who.nick; st.virus = who.virus; st.exact = true; }
                else if (e.near != null) { st.nick = e.near; st.exact = false; }
                st.score = SCORE.loss + Math.min(100, st.pct);
            } else if (e.type === 'eaten') {
                var covered = false;
                for (var j = 0; j < losses.length; j++) if (e.t2 >= losses[j].t - LOSS_WIN - 500 && e.t <= losses[j].t2 + 500) { covered = true; break; }
                if (covered) continue;
                if (e.t >= deathAt - 1500 && killer && !e.v && e.nick === kNick) continue;
                st = { kind: 'eaten', t: e.t, a: e.a, nick: e.nick, virus: !!e.v, exact: true, score: SCORE.eaten };
            } else if (e.type === 'split' || e.type === 'virus') {
                /* t2 is the sample that saw the last cell count rise */
                var ci = sampleAt(R, e.t2);
                st = { kind: e.type, t: e.t, c: ci < 0 ? 0 : R.c[ci], score: SCORE[e.type] };
            } else if (e.type === 'merge') {
                st = { kind: 'merge', t: e.t, c: cellsAfter(e.t2), score: SCORE.merge };
            } else if (e.type === 'ate') {
                st = { kind: 'ate', t: e.t, a: e.a, nick: e.nick, score: SCORE.ate + Math.min(30, e.a / 100) };
            }
            if (st) cands.push(st);
        }
        if (cands.length > maxMid) {
            cands.sort(function (x, y) { return y.score - x.score || x.t - y.t; });
            cands.length = maxMid;
        }
        cands.sort(function (x, y) { return x.t - y.t; });
        for (i = 0; i < cands.length; i++) steps.push(cands[i]);
        /* nothing happened: one more mass step half way, so the recap still shows a trend */
        if (!cands.length && deathAt - startT >= 6000) {
            var mi = sampleAt(R, (startT + deathAt) / 2);
            if (mi >= 0 && R.t[mi] - steps[0].t >= 3000) steps.push({ kind: 'mass', t: R.t[mi], m: R.m[mi], c: R.c[mi] });
        }
        var d = { kind: 'death', t: deathAt };
        if (killer) { d.nick = killer.nick; d.virus = !!killer.virus; d.exact = !!killer.exact; }
        steps.push(d);
        for (i = 0; i < steps.length; i++) { steps[i].s = Math.min(0, Math.round((steps[i].t - deathAt) / 1000)); delete steps[i].score; }
        return steps;
    }

    /* texts come from the language packs (developers/i18n/src/modules*.json): {0} {1} are filled in by lmT */
    var TK = 'modules.deathrecap.';
    function tr(key, args) { return typeof window.lmT === 'function' ? window.lmT(TK + key, args) : key; }
    function dir() { return window.LMi18n && window.LMi18n.dir ? window.LMi18n.dir() : 'ltr'; }
    function who(nick, virus) {
        if (virus) return tr('virusCell');
        return nick ? String(nick).slice(0, 40) : tr('unnamed');
    }
    /* plain text of one step (insert with textContent: nicks come from players) */
    function stepText(st) {
        var cells = function (c) { return c === 1 ? tr('cell') : tr('cells', [c]); };
        switch (st.kind) {
            case 'mass': return tr('mass', [fmtNum(st.m), cells(st.c)]);
            case 'split': return tr('split', [cells(st.c)]);
            case 'virus': return tr('virus', [cells(st.c)]);
            case 'merge': return tr('merge', [cells(st.c)]);
            case 'loss':
                if (st.nick == null && !st.virus) return tr('loss', [fmtNum(st.a)]);
                return tr(st.exact ? 'lossTo' : 'lossNear', [fmtNum(st.a), who(st.nick, st.virus)]);
            case 'eaten': return tr('eaten', [fmtNum(st.a), who(st.nick, st.virus)]);
            case 'ate': return tr('ate', [fmtNum(st.a), who(st.nick, false)]);
            case 'death':
                if (st.nick == null && !st.virus) return tr('eatenNone');
                return tr(st.exact ? 'eatenBy' : 'eatenNear', [who(st.nick, st.virus)]);
        }
        return '';
    }
    function stepLabel(st) { return st.kind === 'death' ? '\u2620' : (st.s === 0 ? '-0 s' : st.s + ' s'); }

    /* ---------- live state ---------- */

    var R = makeRing(CAP);
    var EV = new Array(EV_CAP), evHead = 0, evLen = 0;
    for (var _i = 0; _i < EV_CAP; _i++) EV[_i] = { type: '', t: 0, t2: 0, a: 0, peak: 0, low: 0, nick: null, near: null, v: false };
    var timer = null, listening = false, prevCells = 0, recSlot = null, lastAlive = 0;
    var recap = null;       /* last recap of the main player: { steps, spark, deathAt, slot, player } */
    var unitRecap = null;   /* last recap of a multibox unit's life (player: its slot) */
    /* the life the ring follows: its player (window.legendmod or a unit), slot and key
     * ('slot:slotEpoch:life'); recapKey: the main player's life of recap */
    var trackP = null, trackSlot = 0, trackKey = '', recapKey = '';
    var recapEl = null;     /* recap panel on the open Game Over card */
    var cardTheme = null;

    function opts() {
        var s = window.legendmod5;
        return s ? { recap: !!s.gameOverStats } : { recap: false };
    }

    function evAdd(type, t) {
        var e = EV[evHead];
        evHead = (evHead + 1) % EV_CAP;
        if (evLen < EV_CAP) evLen++;
        e.type = type; e.t = t; e.t2 = t; e.a = 0; e.peak = 0; e.low = 0; e.nick = null; e.near = null; e.v = false;
        return e;
    }
    /* the newest event of this type still open at 'since' (t2 >= since); nick compared when given.
     * Every kept event is looked at: an older one can still be open (its t2 moves on) behind a
     * newer one that is over, e.g. eats of one player around a split */
    function evFind(type, since, nick, virus) {
        for (var k = 0; k < evLen; k++) {
            var e = EV[(evHead - 1 - k + EV_CAP * 2) % EV_CAP];
            if (e.t2 < since) continue;
            if (e.type === type && (nick === undefined || (e.nick === nick && e.v === !!virus))) return e;
        }
        return null;
    }
    function evClear() { evHead = 0; evLen = 0; for (var i = 0; i < EV_CAP; i++) { EV[i].type = ''; EV[i].nick = null; EV[i].near = null; } }
    function evList() {
        var out = [];
        for (var k = evLen - 1; k >= 0; k--) {
            var e = EV[(evHead - 1 - k + EV_CAP * 2) % EV_CAP];
            if (e.type) out.push({ type: e.type, t: e.t, t2: e.t2, a: e.a, peak: e.peak, nick: e.nick, near: e.near, v: e.v });
        }
        return out;
    }

    /* packet index of the replay recording now (catholicCalculator), -1 when not recording */
    function recPacket(lm) {
        var rp = window.RecordedProtocol, slot = window.temporaryRecordedProtocol;
        if (!rp || !slot || !rp[slot] || rp[slot].length !== window.catholicCalculator) return -1;
        if (lm.ws && String(lm.ws).indexOf('replay') !== -1) return -1;
        if (recSlot === null) recSlot = slot;
        else if (recSlot !== slot) return -1;
        return window.catholicCalculator | 0;
    }

    /* a player of ours alive: the main client while it plays, a multibox unit (player) with a life */
    function alive(p) {
        var lm = window.legendmod;
        return !!p && (p === lm ? !!lm.play : p.player === true && p.active === true);
    }
    function keyOf(p) {
        var lm = window.legendmod;
        if (p === lm) return '1:0:' + (+lm._lmLife || 0);
        return (p.slotId >= 2 ? p.slotId : 2) + ':' + (+p.slotEpoch || 0) + ':' + (+p._lmLife || 0);
    }
    /* the player the recap follows now: the one you control while it lives, else the one followed
     * so far while it still lives (the same life), else none */
    function followed() {
        var lm = window.legendmod, n = +window.multiboxPlayerEnabled || 0;
        var c = n ? (typeof window.getActiveSpect === 'function' ? window.getActiveSpect(n) : null) : lm;
        if (alive(c)) return c;
        return trackP && alive(trackP) && keyOf(trackP) === trackKey ? trackP : null;
    }
    /* the ring starts over for another life (another player, or the next life of the same one) */
    function follow(p) {
        var k = keyOf(p);
        if (k === trackKey && p === trackP) return;
        if (trackKey) { ringClear(R); evClear(); prevCells = 0; recSlot = null; lastAlive = 0; }
        trackP = p; trackKey = k; trackSlot = p === window.legendmod ? 1 : (p.slotId >= 2 ? p.slotId : 2);
    }
    function tick() {
        var lm = window.legendmod;
        if (!lm || !liveNow()) return;
        var me = followed();
        /* nothing of ours to follow: the timer starts again with a spawn or a switch */
        if (!me) { stopTimer(); return; }
        follow(me);
        /* the main player's cells and mass, or the unit's own (spect.js getOwnPlayerCells) */
        var unit = me !== lm;
        var pc = unit ? (typeof me.getOwnPlayerCells === 'function' ? me.getOwnPlayerCells() : null) : lm.playerCells, n = pc ? pc.length : 0;
        if (!n) return;
        var now = Date.now(), mass = +me.playerMass || 0, i, j;
        lastAlive = now;
        /* biggest visible enemy cell near me that could eat at least my smallest cell */
        var minOwn = Infinity;
        for (i = 0; i < n; i++) if (pc[i].size < minOwn) minOwn = pc[i].size;
        var best = null, bestSize = 0, cells = lm.cells;
        for (i = 0; cells && i < cells.length; i++) {
            var c = cells[i];
            /* a Full Map tile's copy hidden behind its twin (my own cell seen by a tile) is no threat */
            if (!c || c.isFood || c.isVirus || c.isEjected || c.isPlayerCell || c.isPlayerCellMulti || c._lmMbPosDup || c.invisible) continue;
            var sz = c.size;
            if (!(sz > bestSize) || sz < 40 || sz < minOwn * 1.1) continue;
            for (j = 0; j < n; j++) {
                var o = pc[j], dx = c.x - o.x, dy = c.y - o.y, lim = sz + o.size + Math.max(400, sz * 2.5);
                if (dx * dx + dy * dy <= lim * lim) { best = c; bestSize = sz; break; }
            }
        }
        ringPush(R, now, mass, n, recPacket(lm), best ? (best.targetNick || '') : null, best ? ~~(bestSize * bestSize / 100) : 0);
        /* more cells: a virus pop when an own cell just ate a virus, else a split */
        if (prevCells && n > prevCells) {
            var v = evFind('virus', now - 1500);
            if (v) v.t2 = now;
            else {
                var sp = evFind('split', now - 1000);
                if (sp) sp.t2 = now; else evAdd('split', now);
            }
        }
        prevCells = n;
        /* quick mass loss (one episode until 2.5 s without a further drop).
         * P1 fix: check for W-macro ejection - if we have recent 'ate' events by us
         * (eject mass is tracked as small eats on the other side) or no 'eaten' events
         * exist in the loss window, attribute() will return null and we fall back to
         * the nearest visible enemy (which is an inexact attribution, not a confident one). */
        var L = evFind('loss', now - 2500);
        if (L) {
            if (mass < L.low) { L.low = mass; L.a = L.peak - mass; L.t2 = now; }
        } else {
            var peak = peakSince(R, now - LOSS_WIN);
            var drop = lossCheck(peak, mass, LOSS_PCT, LOSS_MIN);
            if (drop) {
                L = evAdd('loss', now);
                L.peak = peak; L.low = mass; L.a = drop;
                /* Use attribute() to find who actually ate our cells during this loss.
                 * Only fall back to nearest visible enemy when no eat events confirm the killer. */
                var attrib = attribute(evList(), now - LOSS_WIN - 500, now + 500);
                if (attrib) { L.near = attrib.nick; L.v = attrib.virus; }
                else {
                    L.near = R.nn[(R.head - 1 + R.cap) % R.cap];
                    if (L.near == null) { var ni = sampleAt(R, now - LOSS_WIN); if (ni >= 0) L.near = R.nn[ni]; }
                }
            }
        }
    }

    /* From the eat loop (ogario.v4.js), only while an option is on: an eat with my cell as eater or victim. */
    function eat(eater, victim, eaterMine, victimMine, vSize) {
        /* Replay Studio handling packets again to rebuild a seek or a step backwards (ogario.v4.js
         * lmReplayChatCut): those eats were shown already or are skipped over */
        if (!eater || !victim || window._lmReplayQuiet) return;
        /* the eat loop's cells are the main player's: a unit's life followed gets none */
        if (trackSlot > 1) return;
        var now = Date.now(), vm = ~~(vSize * vSize / 100), e;
        if (eaterMine && victimMine) {
            e = evFind('merge', now - 1500);
            if (e) e.t2 = now; else evAdd('merge', now);
            return;
        }
        if (eaterMine) {
            if (victim.isVirus) {
                e = evFind('virus', now - 1000);
                if (e) e.t2 = now; else evAdd('virus', now);
                return;
            }
            if (victim.isFood || victim.isEjected || victim.isPlayerCellMulti || (!victim.targetNick && vm < 20)) return;
            var nick = victim.targetNick || '';
            e = evFind('ate', now - 2000, nick, false);
            if (!e) { e = evAdd('ate', now); e.nick = nick; }
            e.a += vm; e.t2 = now;
            return;
        }
        if (victimMine) {
            if (eater.isPlayerCellMulti) return;
            var en = eater.isVirus ? '' : (eater.targetNick || ''), ev = !!eater.isVirus;
            e = evFind('eaten', now - 2000, en, ev);
            if (!e) { e = evAdd('eaten', now); e.nick = en; e.v = ev; }
            e.a += vm; e.t2 = now;
            lastAlive = now;
        }
    }

    function killerNow() {
        /* the server's report (_lmKiller) is of the main player's death */
        var lm = window.legendmod, k = trackSlot > 1 ? null : lm && lm._lmKiller, now = Date.now();
        /* Expanding Land: the server's own report */
        if (k && k.server && now - (k.at || 0) < 15000) return { nick: String(k.nick || ''), virus: !!k.virus, exact: true };
        /* find the eaten event with the LARGEST mass in the 2-second death window,
           not just the most recent one (which could be a tiny pellet eaten after the lethal blow) */
        var since = lastAlive - 2000, bestEat = null, bestA = 0;
        for (var ki = 0; ki < evLen; ki++) {
            var ev = EV[(evHead - 1 - ki + EV_CAP * 2) % EV_CAP];
            /* not break: an eat count still open sits behind newer events already over (evFind) */
            if (ev.t2 < since) continue;
            if (ev.type === 'eaten' && ev.a > bestA) { bestA = ev.a; bestEat = ev; }
        }
        if (bestEat) return { nick: bestEat.nick, virus: bestEat.v, exact: true };
        if (k && now - (k.at || 0) < 15000) return { nick: String(k.nick || ''), virus: !!k.virus, exact: true };
        if (R.len) {
            var last = R.nn[R.head ? R.head - 1 : R.cap - 1];
            if (last != null) return { nick: last, virus: false, exact: false };
        }
        return null;
    }

    function buildRecap() {
        if (!R.len) return null;
        var deathAt = Math.max(lastAlive, R.t[(R.head - 1 + R.cap) % R.cap]);
        var killer = killerNow(), events = evList();
        var steps = summarise(R, events, deathAt, killer);
        var spark = [], first = steps.length ? steps[0].t : deathAt, pk0 = -1, pk1 = -1;
        for (var k = 0; k < R.len; k++) {
            var i = ringIdx(R, k);
            if (R.t[i] < first) continue;
            spark.push(R.m[i]);
            if (R.p[i] >= 0) { if (pk0 < 0) pk0 = R.p[i]; pk1 = R.p[i]; }
        }
        /* replay links only while the recording kept growing during this part of the life */
        var slot = recSlot && pk1 > pk0 && window.RecordedProtocol && window.RecordedProtocol[recSlot] && typeof window.lmReplayWatchAt === 'function' ? recSlot : null;
        if (slot) {
            for (var s = 0; s < steps.length; s++) {
                var si = sampleAt(R, steps[s].t - 1500);
                steps[s].pkt = si >= 0 && R.p[si] >= 0 ? R.p[si] : -1;
            }
        }
        return { steps: steps, spark: spark, first: first, deathAt: deathAt, slot: slot, killer: killer, player: trackSlot || 1 };
    }

    /* ---------- Game Over card ---------- */

    function themeOf(th) {
        th = th || {};
        var r = { mc: th.mc || '#01d9cc', pc: th.pc || '#00243e', pc2: th.pc2 || '#002f52', tc: th.tc || '#ffffff', tc2: th.tc2 || '#8096a7' };
        /* r.* for the canvas (no CSS variables there); r.v.* for the page, following a theme change */
        r.v = { mc: 'var(--lm-mc,' + r.mc + ')', pc: 'var(--lm-pc,' + r.pc + ')', pc2: 'var(--lm-pc2,' + r.pc2 + ')', tc: 'var(--lm-tc,' + r.tc + ')', tc2: 'var(--lm-tc2,' + r.tc2 + ')' };
        return r;
    }
    function drawSpark(cv, rc, th) {
        var g = cv.getContext && cv.getContext('2d');
        if (!g || rc.spark.length < 2) return;
        var w = cv.width, h = cv.height, max = 1, i, d = rc.spark;
        for (i = 0; i < d.length; i++) if (d[i] > max) max = d[i];
        var px = function (k) { return k / (d.length - 1) * (w - 2) + 1; }, py = function (m) { return h - 2 - m / max * (h - 6); };
        /* step marks */
        g.fillStyle = th.tc2; g.globalAlpha = 0.5;
        var span = Math.max(1, rc.deathAt - rc.first);
        for (i = 0; i < rc.steps.length; i++) g.fillRect(Math.round((rc.steps[i].t - rc.first) / span * (w - 2)) + 1, 0, 1, h);
        g.globalAlpha = 1;
        g.beginPath();
        for (i = 0; i < d.length; i++) { if (i) g.lineTo(px(i), py(d[i])); else g.moveTo(px(i), py(d[i])); }
        g.strokeStyle = th.mc; g.lineWidth = 1.5; g.stroke();
        g.lineTo(w - 1, h - 1); g.lineTo(1, h - 1); g.closePath();
        g.globalAlpha = 0.18; g.fillStyle = th.mc; g.fill(); g.globalAlpha = 1;
    }
    /* again: the same recap in the new language (no rebuild: the killer info may have expired since) */
    function renderPanel(again) {
        if (!recapEl || !recapEl.parentNode || !document.body.contains(recapEl)) { recapEl = null; return; }
        /* the card is the main player's: the ring while it follows that life, else (multibox: it
         * follows a unit since) the recap made at that death */
        var lmKey = window.legendmod ? keyOf(window.legendmod) : '', live = !trackKey || trackKey === lmKey;
        var rc = again && recap ? recap : live ? buildRecap() : recapKey === lmKey ? recap : null;
        if (live) recap = rc || recap;
        var th = cardTheme;
        recapEl.dir = dir();
        while (recapEl.firstChild) recapEl.removeChild(recapEl.firstChild);
        var title = document.createElement('div');
        title.style.cssText = 'font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:' + th.v.mc + ';margin-bottom:4px;';
        title.textContent = '\u23f1 ' + tr('title');
        recapEl.appendChild(title);
        if (!rc) return;
        var cv = document.createElement('canvas');
        var cw = recapEl._lmWide ? 228 : 276;
        cv.width = cw; cv.height = 28;
        cv.style.cssText = 'width:' + cw + 'px;height:28px;display:block;border-radius:var(--lm-radius-s,4px);background:rgba(0,0,0,0.2);margin-bottom:4px;';
        recapEl.appendChild(cv);
        try { drawSpark(cv, rc, th); } catch (e) { }
        for (var i = 0; i < rc.steps.length; i++) {
            var st = rc.steps[i], row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:2px 2px;font-size:var(--lm-w-fs-s,11px);line-height:1.3;';
            var lb = document.createElement('span');
            lb.dir = 'ltr';
            lb.style.cssText = 'flex:0 0 34px;text-align:right;color:' + th.v.tc2 + ';font-variant-numeric:tabular-nums;';
            lb.textContent = stepLabel(st);
            var tx = document.createElement('span');
            tx.style.cssText = 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:' + (st.kind === 'death' || (st.kind === 'loss' && st.exact) ? th.v.mc : th.v.tc) + ';' + (st.kind === 'death' ? 'font-weight:700;' : '');
            tx.textContent = stepText(st);
            tx.title = tx.textContent;
            row.appendChild(lb); row.appendChild(tx);
            if (rc.slot && st.pkt >= 0) {
                var a = document.createElement('span');
                a.textContent = '\u25b6';
                a.title = tr('watch');
                a.setAttribute('role', 'button');
                a.style.cssText = 'flex:0 0 auto;cursor:pointer;color:' + th.v.mc + ';padding:0 4px;min-width:18px;text-align:center;border-radius:var(--lm-radius-s,3px);background:rgba(255,255,255,0.06);';
                (function (slot, pkt) {
                    a.addEventListener('click', function (ev) {
                        ev.stopPropagation();
                        var m = document.getElementById('lm-gameover-modal');
                        if (window.lmReplayWatchAt && window.lmReplayWatchAt(slot, pkt) && m && m.parentNode) m.parentNode.removeChild(m);
                    });
                })(rc.slot, st.pkt);
                row.appendChild(a);
            }
            recapEl.appendChild(row);
        }
    }
    /* Called by showSessionStats after the card is in the page. */
    function card(modal, theme) {
        /* the shared window sizes (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        if (!modal) return;
        var o = opts();
        cardTheme = themeOf(theme);
        if (!o.recap) return;
        /* the card is the main player's game over: only its life's recap (with multibox the ring
         * may follow a unit by now) */
        var lmKey = window.legendmod ? keyOf(window.legendmod) : '';
        if (trackKey && trackKey !== lmKey && recapKey !== lmKey) return;
        if (!R.len && !recap) return;
        var th = cardTheme, el = document.createElement('div'), wide = (window.innerWidth || 0) >= 830;
        el.id = 'lm-go-recap';
        el._lmWide = wide;
        if (wide) {
            /* beside the card (a 915x412 phone has room for both; the card alone is already tall) */
            el.style.cssText = 'position:absolute;left:calc(100% + 8px);top:0;width:252px;box-sizing:border-box;max-height:calc(100vh - 8px);overflow-y:auto;' +
                'background:var(--lm-w-bg,' + th.v.pc + ');border:1px solid ' + th.v.pc2 + ';border-top:3px solid ' + th.v.mc + ';border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,0.5);padding:var(--lm-w-pad,8px 10px);color:' + th.v.tc + ';';
            modal.style.marginLeft = '-130px';
            modal.appendChild(el);
            try {
                var r = el.getBoundingClientRect();
                if (r.top < 4) el.style.top = Math.round(4 - r.top) + 'px';
            } catch (e) { }
        } else {
            var c = modal.querySelector('.lm-go-card') || modal;
            el.style.cssText = 'padding:6px 12px 10px;border-top:1px solid ' + th.v.pc2 + ';';
            c.appendChild(el);
        }
        recapEl = el;
        renderPanel();
    }
    /* ---------- life cycle ---------- */

    /* practice arena and replay lives get no recap (LMEvents context; older cores: the flags) */
    function liveNow() { return !(window.LMPractice && window.LMPractice.on) && !window._lmEvReplayOn; }
    function liveEvent(e) { return e && e.context ? e.context === 'live' : liveNow(); }
    /* the main player's spawn: a new life (not while you control another player that lives:
     * that life is followed on) */
    function onSpawn(e) {
        recapEl = null;
        if (!liveEvent(e)) { stopTimer(); return; }
        if (!(trackSlot > 1 && alive(trackP) && trackP === followed())) {
            ringClear(R); evClear();
            prevCells = 0; recSlot = null; lastAlive = 0;
            trackP = window.legendmod || null; trackKey = trackP ? keyOf(trackP) : ''; trackSlot = trackP ? 1 : 0;
        }
        start();
    }
    /* the recap of the life followed, at its death */
    function ended() {
        if (trackSlot > 1) { if (opts().recap) unitRecap = buildRecap(); return; }
        recapKey = trackKey;
        /* the card can come before the last eat packet: show the final state */
        if (recapEl) renderPanel();
        else if (opts().recap) recap = buildRecap();
    }
    function onDeath(e) {
        if (!liveEvent(e)) { stopTimer(); return; }
        if (trackSlot <= 1) ended();
        if (!followed()) stopTimer();
    }
    /* a multibox unit's death (the main player's comes as 'death'): its recap when it is the life
     * followed; a spawn or a switch (re)starts the timer */
    function onPlayerDied(e) {
        if (e && e.role === 'unit' && liveEvent(e) && trackSlot > 1 && trackKey === e.slot + ':' + (+e.slotEpoch || 0) + ':' + (+e.life || 0)) ended();
        if (!followed()) stopTimer();
    }
    function onPlayerStart(e) { if (liveEvent(e)) start(); }
    function start() {
        var lm = window.legendmod;
        if (!timer && lm && (lm.play || followed()) && liveNow()) timer = setInterval(function () { try { tick(); } catch (e) { } }, SAMPLE_MS);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    /* Start or stop everything from the option; ogario.v4.js calls it when it changes. */
    function sync() {
        var o = opts(), on = o.recap, E = window.LMEvents;
        window._lmDROn = on;
        if (on && !listening && E) {
            E.on('spawn', onSpawn); E.on('death', onDeath);
            E.on('playerDied', onPlayerDied); E.on('playerSpawned', onPlayerStart); E.on('multiboxSwap', onPlayerStart);
            /* P1 fix: listen for server changes to flush stale buffers and prevent
             * cross-server killer attribution bleed */
            E.on('serverChange', onServerChange);
            listening = true; start();
        }
        else if (!on && listening) {
            if (E) {
                E.off('spawn', onSpawn); E.off('death', onDeath); E.off('serverChange', onServerChange);
                E.off('playerDied', onPlayerDied); E.off('playerSpawned', onPlayerStart); E.off('multiboxSwap', onPlayerStart);
            }
            listening = false;
            stopTimer(); ringClear(R); evClear(); recapEl = null; recap = unitRecap = null;
            trackP = null; trackSlot = 0; trackKey = recapKey = '';
        }
    }
    function onServerChange() {
        stopTimer(); ringClear(R); evClear();
        prevCells = 0; recSlot = null; lastAlive = 0;
        recapEl = null; recap = unitRecap = null;
        trackP = null; trackSlot = 0; trackKey = recapKey = '';
    }

    window.LMDeathRecap = {
        sync: sync,
        eat: eat,
        card: card,
        /* the recap of the main player's last death (steps as shown on the card), or null */
        last: function () { return recap; },
        /* the recap of the last death of a player slot (1 the main player, 2-6 a multibox unit) */
        lastOf: function (slot) { return slot > 1 ? (unitRecap && unitRecap.player === slot ? unitRecap : null) : recap; },
        /* who ate me by the recap's rule (the server's report, else the most mass taken in the last
         * 2 s): the Game Over card's "Eaten by" and the match history name the same player */
        killer: function () { return killerNow(); },
        _pure: { fmtNum: fmtNum, makeRing: makeRing, ringPush: ringPush, sampleAt: sampleAt, peakSince: peakSince, lossCheck: lossCheck, attribute: attribute, summarise: summarise, stepText: stepText, stepLabel: stepLabel },
        /* for developers/tests (unit test and smoke probe): feed samples and events by hand */
        _test: {
            tick: tick, onSpawn: onSpawn, onDeath: onDeath, onPlayerDied: onPlayerDied, build: buildRecap,
            sample: function (t, m, c, nick) { ringPush(R, t, m, c, -1, nick == null ? null : nick, 0); lastAlive = Math.max(lastAlive, t); },
            event: function (type, t, a, nick, peak) { var e = evAdd(type, t); e.a = a || 0; e.nick = nick == null ? null : nick; e.peak = peak || 0; e.low = e.peak - e.a; return e; },
            reset: function () { ringClear(R); evClear(); prevCells = 0; recSlot = null; lastAlive = 0; recapEl = null; recap = unitRecap = null; trackP = null; trackSlot = 0; trackKey = recapKey = ''; }
        }
    };
    /* a language change redraws the open recap panel */
    if (window.LMi18n && window.LMi18n.onChange) window.LMi18n.onChange(function () { if (recapEl) renderPanel(true); });
    sync();
})();
