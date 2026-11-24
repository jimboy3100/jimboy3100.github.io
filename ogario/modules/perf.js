/* Legend Mod: adaptive performance, performance diagnostics and network quality history.
 *
 * Adaptive performance (option, off by default): measures the real frame times and, when the
 * game stays below the chosen FPS target, turns costly effects off one level at a time
 * (1: decorative effects, 2: jelly physics and video skins, 3: lower internal resolution).
 * When the game has been comfortably fast for longer, the levels come back one at a time.
 * The changes are runtime only: what is saved, exported and shown in the menu are the
 * player's own values, and while the menu is open the own values are in place, so a reload,
 * a preset or Performance mode never sees (or keeps) a lowered value.
 *
 * Diagnostics window (hotkey without a default key, or the button in Animation): frame time
 * graph, percentiles, long frames, render time, renderer and the adaptive level.
 * Network quality history (option, off by default): ping, jitter, packet rate and
 * disconnects of this session, with a short summary of the last sessions.
 *
 * Cost while everything is off: the render loop checks one global (window._lmPerfFrame) per
 * frame and the connection checks one when it opens or closes; no timers run.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------------------------
     * Pure logic (no DOM): also loaded by developers/tests/perf.js
     * ------------------------------------------------------------------------------------ */

    var TARGETS = [30, 60, 90, 120];
    var LEVEL_KEYS = [
        [],
        ['suckAnimation', 'eatPulse', 'borderGlow', 'animatedRainbowColor', 'showBgSectors', 'hudBlur'],
        ['jellyPhisycs', 'videoSkins']
    ];
    var MAX_LEVEL = 3;
    var CTL = {
        lowRatio: 0.9,      /* below 90% of the target counts as too slow */
        okRatio: 0.97,      /* at least 97% of the target (with render time to spare) counts as fast */
        headroom: 0.6,      /* "to spare": 90th percentile render time under 60% of the frame budget */
        downAfter: 3,       /* seconds too slow before one level down */
        settle: 2,          /* after a level down: extra seconds before the next one (let it show) */
        upAfter: 10,        /* seconds fast before one level back */
        maxUpAfter: 120,
        bounceWindow: 20,   /* too slow again this soon after a level came back: wait twice as long */
        calmAfter: 60       /* this long fine after a level came back: forget the earlier bounces */
    };
    var REFRESH_RATES = [24, 30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 180, 240];

    function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

    function snapTarget(v) {
        v = +v;
        if (!isFinite(v)) return 60;
        var best = TARGETS[0];
        for (var i = 1; i < TARGETS.length; i++) if (Math.abs(TARGETS[i] - v) < Math.abs(best - v)) best = TARGETS[i];
        return best;
    }

    /* p-th percentile (0..100) of an ascending array, linear between the two nearest ranks */
    function percentile(sorted, p) {
        var n = sorted ? sorted.length : 0;
        if (!n) return 0;
        if (n === 1 || p <= 0) return sorted[0];
        if (p >= 100) return sorted[n - 1];
        var r = (p / 100) * (n - 1), lo = Math.floor(r), hi = Math.min(n - 1, lo + 1);
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (r - lo);
    }
    function sortNum(a, b) { return a - b; }
    function sortedCopy(arr) { return Array.prototype.slice.call(arr).sort(sortNum); }

    /* a measured refresh rate close to a usual one is that one (59.7 -> 60) */
    function snapRefresh(hz) {
        if (!(hz > 0)) return 0;
        for (var i = 0; i < REFRESH_RATES.length; i++) if (Math.abs(hz - REFRESH_RATES[i]) <= REFRESH_RATES[i] * 0.05) return REFRESH_RATES[i];
        return Math.round(hz);
    }

    /* The target that can be reached: not above the FPS limit or the screen's refresh rate.
     * The refresh rate is the fastest the frames have come; a value under 50 is not trusted
     * (a slow phone that never drew faster than 30 FPS would otherwise never be helped). */
    function effectiveTarget(target, fpsLimit, refreshHz) {
        var t = snapTarget(target);
        fpsLimit = +fpsLimit;
        if (fpsLimit > 0 && fpsLimit < t) t = fpsLimit;
        if (refreshHz >= 50 && refreshHz < t) t = refreshHz;
        return t;
    }

    /* Frames that come at an even pace while drawing takes under half of each one are waiting
     * for the screen (a 30 Hz power-saving mode, for example), not for the game: fewer effects
     * would not make them faster. sortedIv: the frame times of one second, ascending. */
    function displayBound(sortedIv, renderP90) {
        if (!sortedIv || sortedIv.length < 10 || renderP90 == null) return false;
        var p10 = percentile(sortedIv, 10), p50 = percentile(sortedIv, 50), p90 = percentile(sortedIv, 90);
        return p10 > 0 && p90 / p10 < 1.15 && renderP90 < p50 * 0.5;
    }

    function newController() {
        return { level: 0, low: 0, high: 0, upAfter: CTL.upAfter, t: 0, lastUp: -1e9, lastChange: -1e9 };
    }

    /* One measured period (dt seconds, usually 1): its FPS, the effective target and the 90th
     * percentile render time in ms (null when unknown). Updates st.level and returns the change
     * made: +1 (one level down in quality), -1 (one level back) or 0. */
    function controllerStep(st, fps, target, renderP90, dt) {
        dt = dt > 0 ? dt : 1;
        st.t += dt;
        var spare = renderP90 == null || !(target > 0) || renderP90 < (1000 / target) * CTL.headroom;
        if (fps < target * CTL.lowRatio) {
            st.low += dt;
            st.high = 0;
        } else if (fps >= target * CTL.okRatio && spare) {
            st.low = Math.min(st.low, 0);
            st.high += dt;
        } else {
            /* close to the target: neither way; an earlier slow stretch fades out */
            if (st.low > 0) st.low = Math.max(0, st.low - dt);
            st.high = 0;
        }
        if (st.low >= CTL.downAfter && st.level < MAX_LEVEL) {
            if (st.t - st.lastUp < CTL.bounceWindow) st.upAfter = Math.min(CTL.maxUpAfter, st.upAfter * 2);
            st.level++;
            st.low = -CTL.settle;
            st.high = 0;
            st.lastChange = st.t;
            return 1;
        }
        if (st.high >= st.upAfter && st.level > 0) {
            st.level--;
            st.high = 0;
            st.low = 0;
            st.lastUp = st.lastChange = st.t;
            return -1;
        }
        if (st.upAfter > CTL.upAfter && st.lastChange === st.lastUp && st.t - st.lastUp >= CTL.calmAfter) st.upAfter = CTL.upAfter;
        return 0;
    }

    function loweredValue(k) { return k === 'hudBlur' ? 0 : false; }
    function isOn(k, v) { return k === 'hudBlur' ? +v > 0 : v === true; }
    /* the settings lowered at a level (levels 1 and 2; level 3 is the resolution) */
    function keysForLevel(level) {
        var out = [];
        for (var l = 1; l <= Math.min(level, LEVEL_KEYS.length - 1); l++) out = out.concat(LEVEL_KEYS[l]);
        return out;
    }

    /* Runtime-only changes to the settings object. The player's own value of every lowered key
     * is kept here and put back exactly; userView() gives the settings as the player set them
     * (used when they are saved or exported). A key whose value is no longer the lowered one was
     * changed by the player meanwhile (hotkey, preset): that is kept and the key is left alone
     * for the rest of the session. */
    function createOverrides(settings, mirror) {
        var saved = {}, locked = {}, size = 0;
        var set = function (k, v, changed) {
            settings[k] = v;
            if (mirror && hasOwn(mirror, k)) mirror[k] = v;
            if (changed) changed.push(k);
        };
        var drop = function (k) { delete saved[k]; size--; };
        var o = {
            size: function () { return size; },
            isLowered: function (k) { return hasOwn(saved, k); },
            isLocked: function (k) { return !!locked[k]; },
            userValue: function (k) { return hasOwn(saved, k) ? saved[k] : settings[k]; },
            lower: function (k, changed) {
                if (hasOwn(saved, k) || locked[k] || !hasOwn(settings, k) || !isOn(k, settings[k])) return false;
                saved[k] = settings[k];
                size++;
                set(k, loweredValue(k), changed);
                return true;
            },
            restore: function (k, changed) {
                if (!hasOwn(saved, k)) return false;
                var v = saved[k];
                drop(k);
                if (settings[k] == loweredValue(k)) set(k, v, changed);
                else locked[k] = true;
                return true;
            },
            restoreAll: function (changed) {
                var keys = Object.keys(saved);
                for (var i = 0; i < keys.length; i++) if (hasOwn(saved, keys[i])) o.restore(keys[i], changed);
            },
            /* values changed by someone else since they were lowered */
            check: function () {
                var found = false, keys = Object.keys(saved);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    if (hasOwn(saved, k) && settings[k] !== loweredValue(k)) { drop(k); locked[k] = true; found = true; }
                }
                return found;
            },
            /* the player sets k (called before the new value is stored) */
            userChanged: function (k) {
                if (!hasOwn(saved, k)) return false;
                drop(k);
                locked[k] = true;
                return true;
            },
            userView: function (obj) {
                obj = obj || settings;
                var out = {}, k;
                for (k in obj) if (hasOwn(obj, k)) out[k] = obj[k];
                for (k in saved) if (hasOwn(saved, k) && obj[k] === loweredValue(k)) out[k] = saved[k];
                return out;
            },
            /* make the lowered keys match a level; none while the menu is open */
            sync: function (level, menuOpen, changed) {
                changed = changed || [];
                o.check();
                var want = menuOpen ? [] : keysForLevel(level), k;
                for (k in saved) if (hasOwn(saved, k) && want.indexOf(k) < 0) o.restore(k, changed);
                for (var i = 0; i < want.length; i++) o.lower(want[i], changed);
                return changed;
            }
        };
        return o;
    }

    /* average change between consecutive pings */
    function jitter(pings) {
        if (!pings || pings.length < 2) return 0;
        var s = 0;
        for (var i = 1; i < pings.length; i++) s += Math.abs(pings[i] - pings[i - 1]);
        return s / (pings.length - 1);
    }

    function cleanText(v, max) {
        return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max || 60);
    }
    function num(v, def) { v = +v; return isFinite(v) ? v : (def || 0); }

    var HISTORY_MAX = 10;
    /* stored history -> a clean array (it may be old, edited or broken) */
    function validateHistory(raw) {
        if (!Array.isArray(raw)) return [];
        var out = [];
        for (var i = 0; i < raw.length && out.length < HISTORY_MAX * 2; i++) {
            var s = raw[i];
            if (!s || typeof s !== 'object' || !(num(s.start) > 0)) continue;
            var reasons = Array.isArray(s.reasons) ? s.reasons.slice(0, 3).filter(function (r) { return r && typeof r === 'object'; }).map(function (r) {
                return { code: Math.round(num(r.code)), reason: cleanText(r.reason, 60), n: Math.max(1, Math.round(num(r.n, 1))) };
            }) : [];
            out.push({
                start: num(s.start), dur: Math.max(0, num(s.dur)), n: Math.max(0, Math.round(num(s.n))),
                pingAvg: Math.max(0, num(s.pingAvg)), pingP95: Math.max(0, num(s.pingP95)), jitter: Math.max(0, num(s.jitter)),
                ppsAvg: Math.max(0, num(s.ppsAvg)), disc: Math.max(0, Math.round(num(s.disc))), reconn: Math.max(0, Math.round(num(s.reconn))),
                reasons: reasons,
                hosts: Array.isArray(s.hosts) ? s.hosts.slice(0, 3).map(function (h) { return cleanText(h, 80); }) : []
            });
        }
        return out.slice(-HISTORY_MAX);
    }

    /* this session's summary: pings (pong samples), pps samples (while connected), close events */
    function summarizeSession(start, end, pings, ppsSamples, closes, reconnects, hosts) {
        var sp = sortedCopy(pings), sum = 0, i;
        for (i = 0; i < pings.length; i++) sum += pings[i];
        var ps = 0;
        for (i = 0; i < ppsSamples.length; i++) ps += ppsSamples[i];
        var byCode = {}, order = [];
        for (i = 0; i < closes.length; i++) {
            var key = closes[i].code + '|' + closes[i].reason;
            if (!byCode[key]) { byCode[key] = { code: closes[i].code, reason: closes[i].reason, n: 0 }; order.push(key); }
            byCode[key].n++;
        }
        order.sort(function (a, b) { return byCode[b].n - byCode[a].n; });
        return {
            start: start, dur: Math.max(0, end - start), n: pings.length,
            pingAvg: pings.length ? Math.round(sum / pings.length) : 0,
            pingP95: Math.round(percentile(sp, 95)),
            jitter: Math.round(jitter(pings) * 10) / 10,
            ppsAvg: ppsSamples.length ? Math.round(ps / ppsSamples.length) : 0,
            disc: closes.length, reconn: reconnects,
            reasons: order.slice(0, 3).map(function (k) { return byCode[k]; }),
            hosts: (hosts || []).slice(0, 3)
        };
    }

    /* the session list with this session put in (replaced when already there), capped */
    function mergeHistory(list, summary) {
        var out = validateHistory(list).filter(function (s) { return s.start !== summary.start; });
        out.push(summary);
        out.sort(function (a, b) { return a.start - b.start; });
        return out.slice(-HISTORY_MAX);
    }

    var pure = {
        TARGETS: TARGETS, LEVEL_KEYS: LEVEL_KEYS, MAX_LEVEL: MAX_LEVEL, CTL: CTL,
        snapTarget: snapTarget, percentile: percentile, sortedCopy: sortedCopy, snapRefresh: snapRefresh,
        effectiveTarget: effectiveTarget, displayBound: displayBound, newController: newController, controllerStep: controllerStep,
        keysForLevel: keysForLevel, createOverrides: createOverrides, jitter: jitter,
        validateHistory: validateHistory, summarizeSession: summarizeSession, mergeHistory: mergeHistory
    };

    if (typeof window === 'undefined') {
        if (typeof module === 'object' && module.exports) module.exports = pure;
        return;
    }

    /* ------------------------------------------------------------------------------------
     * In the page
     * ------------------------------------------------------------------------------------ */

    if (window._lmPerfLoaded) return;
    window._lmPerfLoaded = true;

    var RING = 600; /* frames kept for the diagnostics window */
    var LONG_FRAME = 50; /* ms */
    var HISTORY_KEY = 'lmNetHistory';

    var dms = function () { return window.legendmod5 || null; };
    var app = function () { return window.application || null; };
    var T = function (k, en) {
        var t = window.textLanguage && window.textLanguage[k];
        return (typeof t === 'string' && t) ? t : en;
    };
    var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

    /* ---------- frame measuring ---------- */

    var fr = {
        iv: new Float32Array(RING), rt: new Float32Array(RING), at: 0, n: 0,
        prev: 0, longTotal: 0, frames: 0,
        secStart: 0, secFrames: 0, secTime: 0, secRender: [], secAll: [], secGame: [],
        refreshHz: 0, lastFps: 0, menu: false, overlays: null
    };
    var adaptiveOn = false, diagOpen = false;
    var ctl = newController();
    var overrides = null;
    var scaleApplied = 0;

    function menuOpen() {
        var ov = fr.overlays && fr.overlays.isConnected ? fr.overlays : (fr.overlays = document.getElementById('overlays'));
        /* the inline style only, as the menu FPS cap reads it: no layout work per frame */
        return !!(ov && ov.style.display !== 'none');
    }

    function resetSecond(t) {
        fr.secStart = t; fr.secFrames = 0; fr.secTime = 0; fr.secRender.length = 0; fr.secAll.length = 0; fr.secGame.length = 0;
    }

    /* called by drawRender.render() around renderFrame() while measuring */
    function onFrame(t0, t1) {
        var dt = fr.prev ? t0 - fr.prev : 0;
        fr.prev = t0;
        var hidden = document.hidden;
        var menu = menuOpen();
        if (menu !== fr.menu) {
            fr.menu = menu;
            if (adaptiveOn) applyLevel(false);
        }
        if (!fr.secStart) resetSecond(t0);
        /* a gap (tab in the background, a stall) is not a frame time */
        if (!hidden && dt > 0 && dt < 1000) {
            fr.secAll.push(dt);
            var rt = t1 - t0;
            fr.iv[fr.at] = dt; fr.rt[fr.at] = rt;
            fr.at = (fr.at + 1) % RING;
            if (fr.n < RING) fr.n++;
            fr.frames++;
            if (dt > LONG_FRAME) fr.longTotal++;
            if (!menu) { fr.secFrames++; fr.secTime += dt; fr.secRender.push(rt); fr.secGame.push(dt); }
        }
        /* Track stalls (100ms–10s) that the normal frame window ignores.
         * Skip when the tab was recently hidden (the first rAF after a background tab
         * returns has document.hidden already false, but the gap is from the tab being
         * in the background — not a real stall). Also cap at 10s: laptop sleep or
         * hibernation is not a game stall. Skip when the menu is open: the menuFpsCap
         * deliberately throttles frames, producing 100ms+ gaps that are not stalls. */
        if (!hidden && !menu && dt >= 100 && dt <= 10000 && (!fr._hiddenUntil || t0 - fr._hiddenUntil > 500)) {
            fr.stallCount = (fr.stallCount || 0) + 1;
            fr.stallLast = dt;
            if (!fr.stallMax || dt > fr.stallMax) fr.stallMax = dt;
        }
        if (t1 - fr.secStart >= 1000) {
            endSecond();
            resetSecond(t1);
        }
    }

    function endSecond() {
        /* refresh rate: the fastest regular frames seen (menu frames count: they are cheap) */
        if (fr.secAll.length >= 20) {
            var p10 = percentile(sortedCopy(fr.secAll), 10);
            var hz = p10 > 0 ? snapRefresh(1000 / p10) : 0;
            if (hz > fr.refreshHz && hz <= 500) fr.refreshHz = hz;
        }
        if (fr.secTime < 500) return; /* mostly menu or hidden: not a measurement */
        var fps = fr.secFrames * 1000 / fr.secTime;
        fr.lastFps = fps;
        if (!adaptiveOn) return;
        var s = dms();
        var target = effectiveTarget(s ? s.adaptivePerfTarget : 60, s ? s.fpsLimit : 0, fr.refreshHz);
        var p90 = fr.secRender.length ? percentile(sortedCopy(fr.secRender), 90) : null;
        /* held back by the screen: as good as it gets, counts as reaching the target */
        if (fps < target && displayBound(sortedCopy(fr.secGame), p90)) fps = target;
        var change = controllerStep(ctl, fps, target, p90, fr.secTime / 1000);
        /* a lowered value changed meanwhile (hotkey): the player's choice, left alone */
        if (overrides) overrides.check();
        if (change) applyLevel(true);
    }

    function measuring(on) {
        if (on) {
            if (window._lmPerfFrame !== onFrame) {
                fr.prev = 0; fr.secStart = 0;
                window._lmPerfFrame = onFrame;
            }
        } else if (window._lmPerfFrame) {
            window._lmPerfFrame = null;
        }
    }

    /* ---------- applying a level ---------- */

    function ensureOverrides() {
        var s = dms();
        if (!s) return null;
        if (!overrides) {
            overrides = createOverrides(s, window.ogario || window.legendmod || null);
            /* saving and exporting serialize the settings: they get the player's own values */
            try {
                Object.defineProperty(s, 'toJSON', {
                    value: function () {
                        if (overrides && overrides.size()) return overrides.userView(this);
                        /* return a shallow copy even when nothing is lowered: consumers could
                           mutate a live reference (the JSON serializer is safe, but profiles.js
                           reads individual keys and would see changes made by later code). */
                        var copy = {}, kk; for (kk in this) if (hasOwn(this, kk)) copy[kk] = this[kk]; return copy;
                    },
                    enumerable: false, configurable: true, writable: true
                });
            } catch (e) { }
        }
        return overrides;
    }

    function baseDpr() {
        var s = dms() || {};
        var d = (s.highDPI || window.LM_IS_MOBILE) ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        var a = app(), q = a && a.canvasScale;
        if (typeof q === 'number' && q > 0 && q < 1) d *= q;
        return d;
    }

    /* level 3: a lower backing-store resolution (drawRender.resizeCanvas reads _lmAdaptiveScale) */
    function applyScale(on) {
        var want = 0;
        if (on) {
            var b = baseDpr();
            want = b > 1.05 ? Math.max(0.5, 1 / b) : 0.75;
        }
        if (want === scaleApplied) return;
        scaleApplied = want;
        window._lmAdaptiveScale = want;
        try { if (window.drawRender && drawRender.resizeCanvas) drawRender.resizeCanvas(); } catch (e) { }
    }

    function sideEffects(changed) {
        var a = app();
        if (!a || !changed.length) return;
        try { if (changed.indexOf('animatedRainbowColor') >= 0 && a.setAnimatedRainbowColor) a.setAnimatedRainbowColor(); } catch (e) { }
        try { if (changed.indexOf('hudBlur') >= 0 && a.applyHudBlur) a.applyHudBlur(); } catch (e) { }
    }

    var LEVEL_TEXT = [
        ['lmAdaptiveLevel0', 'Adaptive performance: all effects are back'],
        ['lmAdaptiveLevel1', 'Adaptive performance: level 1 (decorative effects off for now)'],
        ['lmAdaptiveLevel2', 'Adaptive performance: level 2 (jelly physics and video skins off for now)'],
        ['lmAdaptiveLevel3', 'Adaptive performance: level 3 (lower resolution for now)']
    ];

    function applyLevel(levelChanged) {
        var ov = ensureOverrides();
        var level = adaptiveOn ? ctl.level : 0;
        if (ov) sideEffects(ov.sync(level, fr.menu));
        applyScale(level >= 3);
        if (levelChanged) {
            var s = dms();
            if (s && s.adaptivePerfToasts !== false && window.toastr) {
                try { toastr.info(T(LEVEL_TEXT[level][0], LEVEL_TEXT[level][1])); } catch (e) { }
            }
            updateDiag();
        }
    }

    function setAdaptive(on) {
        if (on === adaptiveOn) return;
        adaptiveOn = on;
        if (!on) {
            ctl = newController();
            applyLevel(false);
        } else {
            ctl = newController();
            fr.menu = menuOpen();
        }
        measuring(adaptiveOn || diagOpen);
    }

    /* ---------- network quality ---------- */

    var NET_SAMPLES = 1800; /* 30 minutes at one per second */
    var net = {
        active: false, timer: 0, start: Date.now(), ticks: 0,
        t: [], ping: [], pps: [], open: [],
        pongs: [], ppsLive: [], closes: [], reconnects: 0, hadClose: false, hosts: [],
        lastVal: 0, lastStamp: 0, sampledStamp: 0
    };

    function pingNow() {
        /* agar.io pings through drawRender (opcode 31), the other servers through legendmod */
        var lm = window.legendmod, dr = window.drawRender;
        var aStamp = +window.agarpingstarted || 0, lStamp = lm ? +lm.pingTime || 0 : 0;
        if (aStamp >= lStamp && dr && +dr.ping > 0) return { v: +dr.ping, s: aStamp };
        if (lm && +lm.ping > 0) return { v: +lm.ping, s: lStamp };
        return { v: 0, s: 0 };
    }

    function netTick() {
        var lm = window.legendmod;
        var open = !!(lm && lm.isSocketOpen && lm.isSocketOpen());
        var p = pingNow(), wall = Date.now();
        var pps = open && lm ? Math.max(0, +lm.pps || 0) : 0;
        net.t.push(wall); net.ping.push(open ? p.v : 0); net.pps.push(pps); net.open.push(open ? 1 : 0);
        if (net.t.length > NET_SAMPLES) { net.t.shift(); net.ping.shift(); net.pps.shift(); net.open.shift(); }
        if (open) {
            /* a new answer: the value changed, or a ping was sent long enough ago to be answered */
            if (p.v > 0 && (p.v !== net.lastVal || (p.s && p.s !== net.sampledStamp && wall - p.s >= 1500))) {
                net.pongs.push(p.v);
                if (net.pongs.length > 5000) net.pongs.shift();
                net.lastVal = p.v;
                net.sampledStamp = p.s;
            }
            net.ppsLive.push(pps);
            if (net.ppsLive.length > NET_SAMPLES) net.ppsLive.shift();
        }
        if (++net.ticks % 30 === 0) saveSession();
        if (diagOpen && net.ticks % 2 === 0) drawNetGraph();
    }

    function hostOf(ws) {
        try {
            var m = /^[a-z]+:\/\/([^\/?#:]+)/i.exec(String(ws || ''));
            return m ? m[1].slice(0, 80) : '';
        } catch (e) { return ''; }
    }

    function netEvent(type, info) {
        if (!net.active) return;
        if (type === 'close') {
            var e = info || {};
            net.closes.push({ t: Date.now(), code: Math.round(num(e.code)), reason: cleanText(e.reason, 60), clean: e.wasClean !== false, openMs: Math.round(num(e.openMs)) });
            if (net.closes.length > 200) net.closes.shift();
            net.hadClose = true;
        } else if (type === 'open') {
            if (net.hadClose) { net.reconnects++; net.hadClose = false; }
            var h = hostOf(info && info.ws);
            if (h && net.hosts.indexOf(h) < 0) { net.hosts.push(h); if (net.hosts.length > 3) net.hosts.shift(); }
        }
    }

    function readHistory() {
        try { return validateHistory(JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]')); } catch (e) { return []; }
    }

    function sessionSummary() {
        return summarizeSession(net.start, Date.now(), net.pongs, net.ppsLive, net.closes, net.reconnects, net.hosts);
    }

    /* only with the option on: the diagnostics window alone keeps nothing */
    function saveSession() {
        var s = dms();
        if (!s || !s.netHistory) return;
        if (net.pongs.length < 5 && !net.closes.length) return;
        try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(mergeHistory(readHistory(), sessionSummary()))); } catch (e) { }
    }

    function setNet(on) {
        if (on === net.active) return;
        net.active = on;
        if (on) {
            net.timer = setInterval(function () { try { netTick(); } catch (e) { } }, 1000);
            /* already connected: count this server */
            var lm = window.legendmod;
            if (lm && lm.isSocketOpen && lm.isSocketOpen()) netEvent('open', { ws: lm.ws });
        } else {
            clearInterval(net.timer);
            net.timer = 0;
        }
    }

    window.addEventListener('pagehide', function () { if (net.active) saveSession(); });
    /* Track when the tab returns from background so the stall detector can ignore the
     * first rAF gap (document.hidden is already false by the time the first frame fires). */
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) fr._hiddenUntil = performance.now();
    });

    /* ---------- diagnostics window ---------- */

    var diag = null;

    function rendererName() {
        var dr = window.drawRender, s = dms() || {};
        if (!dr) return '-';
        if (dr._lmFrameGL) return 'WebGL';
        if (s.webgl2Acceleration === false) return 'Canvas2D (WebGL off)';
        if (dr._webglDisabledUntil && Date.now() < dr._webglDisabledUntil) return 'Canvas2D (WebGL reset)';
        return 'Canvas2D';
    }

    function frameStats() {
        var n = fr.n, iv = [], rt = [], i, si = 0, sr = 0, longN = 0;
        for (i = 0; i < n; i++) {
            var j = (fr.at - n + i + RING) % RING;
            iv.push(fr.iv[j]); rt.push(fr.rt[j]);
            si += fr.iv[j]; sr += fr.rt[j];
            if (fr.iv[j] > LONG_FRAME) longN++;
        }
        var s = sortedCopy(iv);
        return {
            n: n, list: iv,
            fps: si > 0 ? n * 1000 / si : 0,
            p50: percentile(s, 50), p95: percentile(s, 95), p99: percentile(s, 99),
            longN: longN, longTotal: fr.longTotal,
            render: n ? sr / n : 0, other: n ? Math.max(0, (si - sr) / n) : 0
        };
    }

    function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }

    function reportLines() {
        var s = dms() || {}, st = frameStats(), lm = window.legendmod, dr = window.drawRender;
        var target = effectiveTarget(s.adaptivePerfTarget, s.fpsLimit, fr.refreshHz);
        var cells = lm && lm.cells ? lm.cells.length : 0;
        var lines = [];
        lines.push('Legend Mod ' + (window.OgVer || '') + ' performance report, ' + new Date().toISOString());
        lines.push('FPS: ' + f1(st.fps) + ' (last ' + st.n + ' frames)');
        lines.push('Frame time p50/p95/p99: ' + f1(st.p50) + ' / ' + f1(st.p95) + ' / ' + f1(st.p99) + ' ms');
        lines.push('Long frames (>' + LONG_FRAME + ' ms): ' + st.longN + ' recent, ' + st.longTotal + ' measured in total' +
            (fr.stallCount ? ', stalls ≥100ms: ' + fr.stallCount + ' (worst ' + Math.round(fr.stallMax || 0) + ' ms)' : ''));
        lines.push('Render ' + f1(st.render) + ' ms, other ' + f1(st.other) + ' ms per frame');
        lines.push('Cells: ' + cells + ', renderer: ' + rendererName());
        lines.push('devicePixelRatio: ' + (window.devicePixelRatio || 1) + ', render scale: ' + (dr && dr.dpr ? f1(dr.dpr) : '-') +
            ', screen ' + window.innerWidth + 'x' + window.innerHeight + (fr.refreshHz ? ', refresh ~' + fr.refreshHz + ' Hz' : ''));
        lines.push('Adaptive performance: ' + (adaptiveOn ? 'on, level ' + ctl.level + '/' + MAX_LEVEL + ', target ' + snapTarget(s.adaptivePerfTarget) +
            (target !== snapTarget(s.adaptivePerfTarget) ? ' (reachable ' + Math.round(target) + ')' : '') : 'off') +
            ', FPS limit ' + (+s.fpsLimit || 'off') + ', performance mode ' + (s.performanceMode ? 'on' : 'off'));
        var sum = sessionSummary(), pn = pingNow();
        lines.push('Network: ping ' + (pn.v || '-') + ' ms, avg ' + sum.pingAvg + ', p95 ' + sum.pingP95 + ', jitter ' + sum.jitter +
            ' ms, packets/s ' + (lm ? +lm.pps || 0 : 0) + ' (avg ' + sum.ppsAvg + '), disconnects ' + sum.disc + ', reconnects ' + sum.reconn);
        net.closes.slice(-5).forEach(function (c) {
            lines.push('  closed ' + new Date(c.t).toLocaleTimeString() + ': code ' + c.code + (c.reason ? ' "' + c.reason + '"' : '') + (c.clean ? '' : ' (not clean)') + (c.openMs ? ', open ' + Math.round(c.openMs / 1000) + ' s' : ''));
        });
        var hist = readHistory();
        if (hist.length) {
            lines.push('Last sessions:');
            hist.slice(-5).forEach(function (h) { lines.push('  ' + sessionLine(h)); });
        }
        return lines;
    }

    function fmtDur(ms) {
        var m = Math.round(ms / 60000);
        return m >= 60 ? Math.floor(m / 60) + 'h' + (m % 60 < 10 ? '0' : '') + (m % 60) : m + 'm';
    }
    function sessionLine(h) {
        var d = new Date(h.start);
        return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) +
            ' ' + fmtDur(h.dur) + ', ping ' + h.pingAvg + ' (p95 ' + h.pingP95 + ') ±' + h.jitter + ', ' + h.ppsAvg + ' pkt/s, ' +
            h.disc + ' disc.' + (h.reasons.length ? ' [' + h.reasons.map(function (r) { return r.code + (r.reason ? ' ' + r.reason : '') + (r.n > 1 ? ' x' + r.n : ''); }).join('; ') + ']' : '');
    }

    function copyText(text) {
        var done = function () { if (window.toastr) try { toastr.info(T('lmPerfCopied', 'Report copied')); } catch (e) { } };
        var fallback = function () {
            try {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                done();
            } catch (e) { }
        };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); return; }
        } catch (e) { }
        fallback();
    }

    function el(tag, css, text) {
        var e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function openDiag() {
        if (diag) { closeDiag(); return; }
        var ds = window.defaultSettings || {};
        var mc = ds.menuMainColor || '#01d9cc', pc = ds.menuPanelColor || '#00243e', pc2 = ds.menuPanelColor2 || '#002f52';
        var tc = ds.menuTextColor || '#ffffff', tc2 = ds.menuTextColor2 || '#8096a7';
        /* fits a 915x412 phone: narrow, scrolls inside, the close cross is a large tap target */
        var md = el('div', 'position:fixed;top:8px;left:8px;width:380px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);' +
            'display:flex;flex-direction:column;z-index:2147483646;background:' + pc + ';border:1px solid ' + pc2 + ';border-top:3px solid ' + mc + ';' +
            'border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + tc + ';font:11px/1.35 sans-serif;overflow:hidden;opacity:0.94;');
        md.id = 'lm-perf-diag';
        var head = el('div', 'padding:6px 44px 6px 10px;position:relative;border-bottom:1px solid ' + pc2 + ';');
        head.appendChild(el('div', 'font-size:13px;font-weight:700;color:' + mc + ';letter-spacing:.5px;', T('lmPerfDiag', 'Performance diagnostics')));
        var x = el('div', 'position:absolute;top:2px;right:4px;cursor:pointer;font-size:18px;color:' + tc2 + ';width:34px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:4px;background:rgba(255,255,255,0.06);', '✕');
        x.id = 'lm-perf-diag-close';
        x.title = T('close', 'Close');
        var stop = function (e) { e.preventDefault(); e.stopPropagation(); };
        x.addEventListener('click', function (e) { stop(e); closeDiag(); });
        x.addEventListener('touchend', function (e) { stop(e); closeDiag(); });
        head.appendChild(x);
        md.appendChild(head);
        var body = el('div', 'padding:6px 10px 8px;overflow:auto;-webkit-overflow-scrolling:touch;');
        md.appendChild(body);
        var cv = el('canvas', 'display:block;width:100%;height:64px;background:rgba(0,0,0,0.35);border-radius:3px;');
        cv.width = 360; cv.height = 64;
        body.appendChild(cv);
        var stats = el('pre', 'margin:4px 0 6px;white-space:pre-wrap;font:11px/1.35 monospace;color:' + tc + ';');
        body.appendChild(stats);
        body.appendChild(el('div', 'font-weight:700;color:' + mc + ';margin-top:2px;', T('lmNetQuality', 'Network quality (this session)')));
        var nv = el('canvas', 'display:block;width:100%;height:56px;background:rgba(0,0,0,0.35);border-radius:3px;margin-top:2px;');
        nv.width = 360; nv.height = 56;
        body.appendChild(nv);
        var nstats = el('pre', 'margin:4px 0 6px;white-space:pre-wrap;font:11px/1.35 monospace;color:' + tc + ';');
        body.appendChild(nstats);
        body.appendChild(el('div', 'font-weight:700;color:' + mc + ';', T('lmNetSessions', 'Last sessions')));
        var hist = el('pre', 'margin:2px 0 6px;white-space:pre-wrap;font:10px/1.35 monospace;color:' + tc2 + ';');
        body.appendChild(hist);
        var row = el('div', 'display:flex;gap:6px;flex-wrap:wrap;');
        var btn = function (id, text, fn) {
            var b = el('button', 'cursor:pointer;font-size:11px;padding:5px 10px;border-radius:4px;border:1px solid ' + pc2 + ';background:rgba(255,255,255,0.08);color:' + tc + ';', text);
            b.type = 'button';
            b.id = id;
            b.addEventListener('click', function (e) { stop(e); fn(); });
            row.appendChild(b);
        };
        btn('lm-perf-copy', T('lmPerfCopy', 'Copy report'), function () { copyText(reportLines().join('\n')); });
        btn('lm-perf-clear', T('lmNetClear', 'Clear history'), function () {
            try { window.localStorage.removeItem(HISTORY_KEY); } catch (e) { }
            updateDiag();
        });
        body.appendChild(row);
        /* keys and wheel stay in the window (Space would split), clicks do not reach the game */
        ['mousedown', 'mouseup', 'wheel', 'touchstart', 'touchmove', 'keydown', 'keyup'].forEach(function (t) {
            md.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
        });
        document.body.appendChild(md);
        diag = { md: md, cv: cv, stats: stats, nv: nv, nstats: nstats, hist: hist, timer: 0 };
        diagOpen = true;
        measuring(true);
        setNet(true);
        diag.timer = setInterval(function () { try { updateDiag(); } catch (e) { } }, 500);
        updateDiag();
        drawNetGraph();
    }

    function closeDiag() {
        if (!diag) return;
        clearInterval(diag.timer);
        if (diag.md.parentNode) diag.md.parentNode.removeChild(diag.md);
        diag = null;
        diagOpen = false;
        measuring(adaptiveOn);
        var s = dms();
        setNet(!!(s && s.netHistory));
    }

    function drawFrameGraph(st) {
        var cv = diag.cv, x = cv.getContext('2d');
        if (!x) return;
        var w = cv.width, h = cv.height, s = dms() || {};
        x.clearRect(0, 0, w, h);
        var maxMs = 50, list = st.list.slice(-w / 2);
        var y = function (ms) { return h - 1 - Math.min(1, ms / maxMs) * (h - 12); };
        var target = effectiveTarget(s.adaptivePerfTarget, s.fpsLimit, fr.refreshHz);
        for (var i = 0; i < list.length; i++) {
            var ms = list[i];
            x.fillStyle = ms > LONG_FRAME ? '#ff4d4d' : ms > 1000 / target * 1.1 ? '#ffb84d' : '#5fe35f';
            var top = y(ms);
            x.fillRect(w - (list.length - i) * 2, top, 1.5, h - top);
        }
        x.strokeStyle = 'rgba(255,255,255,0.45)';
        x.setLineDash([3, 3]);
        x.beginPath(); x.moveTo(0, y(1000 / target)); x.lineTo(w, y(1000 / target)); x.stroke();
        x.setLineDash([]);
        x.fillStyle = 'rgba(255,255,255,0.8)';
        x.font = '10px sans-serif';
        x.textBaseline = 'top';
        x.fillText(T('lmPerfFrameTime', 'frame time') + ' (0-' + maxMs + ' ms), --- ' + Math.round(target) + ' FPS', 4, 1);
    }

    function drawNetGraph() {
        if (!diag) return;
        var cv = diag.nv, x = cv.getContext('2d');
        if (!x) return;
        var w = cv.width, h = cv.height, n = net.t.length;
        x.clearRect(0, 0, w, h);
        x.font = '10px sans-serif';
        x.textBaseline = 'top';
        if (!n) { x.fillStyle = 'rgba(255,255,255,0.6)'; x.fillText(T('lmNetWaiting', 'collecting...'), 4, 2); return; }
        /* the whole session, squeezed to the width (the highest value of each column) */
        var cols = Math.min(w, n), per = n / cols, pMax = 100, qMax = 30, i, j;
        for (i = 0; i < n; i++) { if (net.ping[i] > pMax) pMax = net.ping[i]; if (net.pps[i] > qMax) qMax = net.pps[i]; }
        var line = function (arr, max, col) {
            x.beginPath();
            for (var c = 0; c < cols; c++) {
                var a = Math.floor(c * per), b = Math.max(a + 1, Math.floor((c + 1) * per)), m = 0;
                for (j = a; j < b && j < n; j++) if (arr[j] > m) m = arr[j];
                var px = c * (w / cols), py = h - 2 - Math.min(1, m / max) * (h - 14);
                if (c) x.lineTo(px, py); else x.moveTo(px, py);
            }
            x.strokeStyle = col; x.lineWidth = 1.2; x.stroke();
        };
        line(net.pps, qMax, '#4da6ff');
        line(net.ping, pMax, '#ffb84d');
        /* disconnects: red marks */
        var t0 = net.t[0], t1 = net.t[n - 1] || t0 + 1;
        x.fillStyle = '#ff4d4d';
        net.closes.forEach(function (c) {
            if (c.t < t0) return;
            x.fillRect(Math.min(w - 2, (c.t - t0) / Math.max(1, t1 - t0) * w), 10, 2, h - 10);
        });
        x.fillStyle = '#ffb84d'; x.fillText('ping (max ' + Math.round(pMax) + ')', 4, 1);
        x.fillStyle = '#4da6ff'; x.fillText('pkt/s (max ' + Math.round(qMax) + ')', 120, 1);
        x.fillStyle = '#ff4d4d'; x.fillText('| ' + T('lmNetDisc', 'disconnect'), 240, 1);
    }

    function updateDiag() {
        if (!diag) return;
        var st = frameStats(), s = dms() || {}, lm = window.legendmod, dr = window.drawRender;
        drawFrameGraph(st);
        var target = effectiveTarget(s.adaptivePerfTarget, s.fpsLimit, fr.refreshHz);
        diag.stats.textContent =
            'FPS ' + f1(st.fps) + (fr.refreshHz ? '   refresh ~' + fr.refreshHz + ' Hz' : '') + '\n' +
            'p50 ' + f1(st.p50) + '  p95 ' + f1(st.p95) + '  p99 ' + f1(st.p99) + ' ms\n' +
            T('lmPerfLong', 'Long frames') + ' (>' + LONG_FRAME + ' ms): ' + st.longN + ' / ' + st.n + '   ' + T('lmPerfTotal', 'total') + ' ' + st.longTotal + '\n' +
            T('lmPerfRender', 'Render') + ' ' + f1(st.render) + ' ms   ' + T('lmPerfOther', 'other') + ' ' + f1(st.other) + ' ms\n' +
            T('lmPerfCells', 'Cells') + ' ' + (lm && lm.cells ? lm.cells.length : 0) + '   ' + rendererName() + '\n' +
            'devicePixelRatio ' + (window.devicePixelRatio || 1) + '   ' + T('lmPerfScale', 'render scale') + ' ' + (dr && dr.dpr ? f1(dr.dpr) : '-') + '\n' +
            T('lmAdaptiveShort', 'Adaptive performance') + ': ' + (adaptiveOn ? ctl.level + '/' + MAX_LEVEL + ' (' + Math.round(target) + ' FPS)' : T('lmOff', 'off'));
        var sum = sessionSummary(), pn = pingNow();
        diag.nstats.textContent =
            'ping ' + (pn.v || '-') + ' ms   avg ' + sum.pingAvg + '   p95 ' + sum.pingP95 + '   jitter ' + sum.jitter + ' ms\n' +
            'pkt/s ' + (lm ? +lm.pps || 0 : 0) + ' (avg ' + sum.ppsAvg + ')   ' + T('lmNetDiscs', 'disconnects') + ' ' + sum.disc + '   ' + T('lmNetReconn', 'reconnects') + ' ' + sum.reconn +
            net.closes.slice(-3).map(function (c) {
                return '\n  ' + new Date(c.t).toLocaleTimeString() + ' code ' + c.code + (c.reason ? ' ' + c.reason : '') + (c.clean ? '' : ' (not clean)');
            }).join('');
        var h = readHistory();
        diag.hist.textContent = h.length ? h.slice(-5).reverse().map(sessionLine).join('\n') :
            (s.netHistory ? T('lmNetNoSessions', 'No sessions saved yet.') : T('lmNetHistOff', 'Turn on "Network quality history" (Animation) to keep a summary of each session.'));
    }

    /* ---------- wiring ---------- */

    function configChanged() {
        var s = dms();
        if (!s) return;
        setAdaptive(!!s.adaptivePerf);
        setNet(!!s.netHistory || diagOpen);
    }

    /* setSettings(id, value) calls this first, before the value is stored */
    function onSetting(id) {
        if (!overrides) return;
        if (id === 'performanceMode') {
            /* Performance mode backs up the current values: they must be the player's own */
            var ch = [];
            overrides.restoreAll(ch);
            sideEffects(ch);
            return;
        }
        overrides.userChanged(id);
    }

    window.LMPerf = {
        _pure: pure,
        configChanged: configChanged,
        onSetting: onSetting,
        netEvent: netEvent,
        openDiag: openDiag,
        closeDiag: closeDiag,
        toggleDiag: function () { if (diag) closeDiag(); else openDiag(); },
        /* the value the player set (not a lowered one) */
        userValue: function (k) { var s = dms(); return overrides ? overrides.userValue(k) : (s ? s[k] : undefined); },
        level: function () { return adaptiveOn ? ctl.level : 0; },
        report: function () { return reportLines().join('\n'); },
        history: readHistory,
        /* for tests: force a level as if measured */
        _setLevel: function (l) {
            ctl.level = Math.max(0, Math.min(MAX_LEVEL, l | 0));
            applyLevel(true);
        }
    };

    configChanged();
})();
