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
 * graph, percentiles, long frames, render time, renderer and the adaptive level, and a list of
 * the last 200 timestamped events (freezes of 250 ms - 10 s in the foreground, long tasks,
 * frames that failed, packet gaps, renderer changes, tab hidden / shown, disconnects).
 * Freezes are measured between frame callbacks, before the FPS limit, so its own gaps and a
 * tab in the background are not stalls. All of this is kept only while measuring.
 * Freeze breakdown (with the window open or "Keep recording", not for Adaptive performance
 * alone): the time of the main parts of the game (packets, cell update / sort, render phases,
 * skin and text textures, HUD timers, storage writes) is added up between two frame
 * callbacks, and the long animation frames of the browser (Chrome 123+) say which script
 * callback ran; each freeze gets a line with its biggest parts and a probable contributor
 * when one part took over half of it. Wrapped methods are put back when recording stops.
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
        calmAfter: 60,      /* this long fine after a level came back: forget the earlier bounces */
        renderShare: 0.4,   /* slow counts only while drawing takes at least 40% of the frames as they
                             * really come (1000 / measured FPS): when the time goes to packets,
                             * scripts or the browser, fewer effects cannot make it faster and only
                             * make the game look worse. A second without a drawing time is unknown:
                             * it neither lowers a level nor counts in the check of one. */
        judgeAfter: 6,      /* seconds after a level down to see whether it helped */
        gainFps: 1.05,      /* it helped: FPS up at least 5%, */
        gainRender: 0.85,   /* or drawing at least 15% faster, or the target reached */
        noHelpFor: 600      /* a level that did not help is undone and not tried again for 10 min */
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
        return { level: 0, low: 0, high: 0, upAfter: CTL.upAfter, t: 0, lastUp: -1e9, lastChange: -1e9,
            base: { fps: 0, render: 0, n: 0 }, judge: null, capLevel: MAX_LEVEL, capUntil: -1e9 };
    }

    /* One measured period (dt seconds, usually 1): its FPS, the effective target and the 90th
     * percentile render time in ms (null when unknown). Updates st.level and returns the change
     * made: +1 (one level down in quality), -1 (one level back) or 0.
     * A level goes down only while drawing is what is slow (renderShare), and each level down is
     * checked judgeAfter seconds later: when neither the FPS nor the drawing time got better it
     * is undone at once and that level is not tried again for noHelpFor seconds. */
    function controllerStep(st, fps, target, renderP90, dt, maxLevel) {
        var top = maxLevel || MAX_LEVEL;
        dt = dt > 0 ? dt : 1;
        st.t += dt;
        if (!st.base) { st.base = { fps: 0, render: 0, n: 0 }; st.judge = null; st.capLevel = MAX_LEVEL; st.capUntil = -1e9; }
        if (st.t < st.capUntil) top = Math.min(top, st.capLevel);
        var budget = target > 0 ? 1000 / target : 0;
        var spare = renderP90 == null || !budget || renderP90 < budget * CTL.headroom;
        var known = renderP90 != null && isFinite(renderP90) && renderP90 >= 0;
        var frameMs = fps > 0 ? 1000 / fps : 0;
        var renderBound = known && frameMs > 0 && renderP90 >= frameMs * CTL.renderShare;
        var rt = known ? renderP90 : 0;
        if (fps < target * CTL.lowRatio && renderBound) {
            st.low += dt;
            st.high = 0;
            st.base.fps += fps * dt; st.base.render += rt * dt; st.base.n += dt;
        } else if (fps >= target * CTL.okRatio && spare) {
            st.low = Math.min(st.low, 0);
            st.high += dt;
            st.base = { fps: 0, render: 0, n: 0 };
        } else {
            /* close to the target, or slow for another reason than drawing: neither way; an
             * earlier slow stretch fades out */
            if (st.low > 0) st.low = Math.max(0, st.low - dt);
            st.high = 0;
        }
        /* did the last level down help? */
        var j = st.judge;
        if (j && known) {
            j.fps += fps * dt; j.render += rt * dt; j.n += dt;
            if (j.n >= CTL.judgeAfter) {
                st.judge = null;
                var af = j.fps / j.n, ar = j.render / j.n;
                var helped = af >= target * CTL.okRatio || af >= j.before.fps * CTL.gainFps ||
                    (j.before.render > 0 && ar <= j.before.render * CTL.gainRender);
                if (!helped && st.level > 0) {
                    st.level--;
                    st.capLevel = st.level;
                    st.capUntil = st.t + CTL.noHelpFor;
                    st.low = 0;
                    st.high = 0;
                    st.base = { fps: 0, render: 0, n: 0 };
                    st.lastChange = st.t;
                    return -1;
                }
            }
        }
        if (!st.judge && st.low >= CTL.downAfter && st.level < top) {
            if (st.t - st.lastUp < CTL.bounceWindow) st.upAfter = Math.min(CTL.maxUpAfter, st.upAfter * 2);
            st.level++;
            st.low = -CTL.settle;
            st.high = 0;
            st.lastChange = st.t;
            var bn = st.base.n || 1;
            st.judge = { before: { fps: st.base.n ? st.base.fps / bn : fps, render: st.base.n ? st.base.render / bn : rt }, fps: 0, render: 0, n: 0 };
            st.base = { fps: 0, render: 0, n: 0 };
            return 1;
        }
        if (st.high >= st.upAfter && st.level > 0) {
            st.level--;
            st.high = 0;
            st.low = 0;
            st.judge = null;
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

    /* Texts. The diagnostics window shows them in the chosen language: it passes tr(key, vars),
     * which returns the language pack text of 'modules.perf.' + key (null when there is none).
     * Without tr (the copied report, the trace tools in Node) the English text given here is
     * used: the report is for the developers and stays in English. developers/tests/perf.js
     * checks that every English text here is the same as the English one in the pack. */
    function fmt(s, v) {
        if (v == null) return s;
        if (typeof v !== 'object') v = [v];
        return s.replace(/\{([A-Za-z0-9_]+)\}/g, function (m, k) { return hasOwn(v, k) && v[k] != null ? String(v[k]) : m; });
    }
    function say(tr, k, en, v) {
        var s = tr ? tr(k, v) : null;
        return s == null ? fmt(en, v) : s;
    }
    /* a text part kept for later: shown in English in the report, translated in the window */
    function tp(k, en, v) { return { k: k, en: en, v: v }; }
    function partsText(ip, tr) {
        var out = [];
        for (var i = 0; i < ip.p.length; i++) {
            var p = ip.p[i], s = typeof p === 'string' ? p : say(tr, p.k, p.en, p.v);
            if (s) out.push(s);
        }
        return out.join(ip.s);
    }
    /* renderer names as rendererName() gives them -> their text */
    var RN_KEYS = { 'Canvas2D (WebGL off)': 'rn2dOff', 'Canvas2D (WebGL reset)': 'rn2dReset' };
    function rnPart(name) { return hasOwn(RN_KEYS, name) ? tp(RN_KEYS[name], name) : String(name); }
    function rnText(name, tr) { var p = rnPart(name); return typeof p === 'string' ? p : say(tr, p.k, p.en); }

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

    /* host of a server address: the path and query may hold a token, user:password@ too */
    function hostOf(ws) {
        try {
            var m = /^[a-z][a-z0-9+.\-]*:\/\/(?:[^\/?#@]*@)?(\[[^\]\/?#]*\]|[^\/?#:]+)/i.exec(String(ws || ''));
            return m ? m[1].slice(0, 80) : '';
        } catch (e) { return ''; }
    }

    /* ---- stalls and freezes (diagnostics only: Adaptive performance has its own filter) ---- */
    var STALL_MS = 100, FREEZE_MS = 250, PAUSE_MS = 10000, RETURN_GRACE = 500;

    /* One gap between two frame callbacks (or two drawn frames when the callback times are
     * unknown), in ms. background: the tab was hidden, or was hidden / shown during the gap
     * (the browser stops frames there: not a stall). sinceVisible: ms from the tab being shown
     * again to the end of the gap (-1: not known). Returns '' (normal), 'background',
     * 'pause' (over 10 s: sleep or suspend), 'return' (a slow frame right after the tab came
     * back: listed, not counted), 'stall' (100-250 ms) or 'freeze' (250 ms - 10 s). */
    function classifyGap(g, background, sinceVisible) {
        if (!(g > 0)) return '';
        if (background) return 'background';
        if (g > PAUSE_MS) return 'pause';
        if (g < STALL_MS) return '';
        if (sinceVisible >= 0 && sinceVisible <= RETURN_GRACE) return 'return';
        return g >= FREEZE_MS ? 'freeze' : 'stall';
    }

    /* The last `max` timestamped events (freezes, long tasks, errors...). An event marked
     * `merge` that repeats the previous one within 5 s only counts up (an error every frame). */
    function createEventRing(max) {
        var list = [];
        return {
            max: max,
            list: function () { return list.slice().sort(function (a, b) { return a.t - b.t; }); },
            size: function () { return list.length; },
            clear: function () { list.length = 0; },
            push: function (ev, merge) {
                var last = list[list.length - 1];
                if (merge && last && last.type === ev.type && last.info === ev.info && ev.t - last.tl < 5000) {
                    last.n++; last.tl = ev.t;
                    if (ev.dur > last.dur) last.dur = ev.dur;
                    return last;
                }
                ev.n = 1; ev.tl = ev.t;
                list.push(ev);
                if (list.length > max) list.splice(0, list.length - max);
                return ev;
            }
        };
    }

    function pad(n, l) { n = String(n); while (n.length < (l || 2)) n = '0' + n; return n; }
    /* "21:23:05.120" (local time of a Date.now() value) */
    function timeText(w) {
        var d = new Date(w);
        return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds(), 3);
    }
    /* event types -> their text (other types, e.g. from scripts, are shown as they are) */
    var EV_KEYS = {
        'freeze': 'evFreeze', 'pause': 'evPause', 'long task': 'evLongTask', 'render error': 'evRenderError',
        'renderer': 'evRenderer', 'packet gap': 'evPacketGap', 'visibility': 'evVisibility', 'disconnect': 'evDisconnect', 'connect': 'evConnect'
    };
    /* English details sent by ogario.v4.js (the freeze detector) -> their text */
    var INFO_KEYS = { 'no world update': 'infoNoUpdate', 'no world update, playing': 'infoNoUpdatePlaying' };
    function infoText(ev, tr) {
        if (!tr) return ev.info;
        if (ev.ip) return partsText(ev.ip, tr);
        return hasOwn(INFO_KEYS, ev.info) ? say(tr, INFO_KEYS[ev.info], ev.info) : ev.info;
    }
    /* "21:23:05.120 freeze 1532 ms render 1490 ms" (local time); tr: in the chosen language */
    function eventLine(ev, tr) {
        var type = tr && hasOwn(EV_KEYS, ev.type) ? say(tr, EV_KEYS[ev.type], ev.type) : ev.type, info = infoText(ev, tr);
        return timeText(ev.w) + ' ' + type + (ev.dur ? ' ' + Math.round(ev.dur) + ' ms' : '') + (info ? ' ' + info : '') + (ev.n > 1 ? ' x' + ev.n : '');
    }

    /* ---- freeze attribution (diagnostics only): timing scopes and long animation frames ---- */

    /* The parts of the game that are timed while diagnostics record. Methods are wrapped by
     * name (see PATCHES in the page part), a few render phases have inline markers in
     * ogario.v4.js (window._lmScope.b('grid') ... e(depth)). */
    var SCOPES = ['packets', 'decompress', 'cells update', 'leaderboard', 'cell sort', 'cell compare', 'send position',
        'render', 'WebGL cells', 'WebGL batch', 'grid', 'jelly physics', 'text pass', 'text raster', 'rings/HUD pass',
        'skin texture upload', 'uploadSkinTexture', 'skin canvas job', 'teamboard', 'minimap', 'team players', 'stats HUD',
        'settings save', 'special skins sync', 'video skins', 'replay bar', 'replay budget', 'storage write'];
    var SCOPE_DEPTH = 32;

    /* Self time of named parts of the code between two frame callbacks (a part called inside
     * another counts only for itself), in fixed typed arrays: nothing is allocated per call.
     * b(id or name) returns the depth to give to e(); e() also closes parts left open inside it
     * (an exception thrown past an inline marker). clock: performance.now. */
    function createScopes(clock, names) {
        names = names || SCOPES;
        var n = names.length, ids = {}, i;
        for (i = 0; i < n; i++) ids[names[i]] = i;
        var acc = new Float64Array(n), cnt = new Uint32Array(n);
        var sid = new Int32Array(SCOPE_DEPTH), st = new Float64Array(SCOPE_DEPTH), ch = new Float64Array(SCOPE_DEPTH);
        var depth = 0;
        var S = {
            on: false, n: n, names: names, ids: ids, acc: acc, cnt: cnt, lost: 0,
            depth: function () { return depth; },
            b: function (id) {
                if (typeof id !== 'number') { id = ids[id]; if (id === undefined) return -1; }
                if (depth >= SCOPE_DEPTH) { S.lost++; return -1; }
                sid[depth] = id; ch[depth] = 0; st[depth] = clock();
                return depth++;
            },
            e: function (d) {
                if (!(d >= 0) || d >= depth) return;
                var t = clock();
                while (depth > d) {
                    var k = --depth, incl = t - st[k], self = incl - ch[k];
                    acc[sid[k]] += self > 0 ? self : 0;
                    cnt[sid[k]]++;
                    if (k > 0) ch[k - 1] += incl;
                }
            },
            /* a new frame: the totals start again (a part still open keeps its start) */
            reset: function () { acc.fill(0); cnt.fill(0); },
            /* also forget parts left open (recording turned off and on again) */
            clear: function () { acc.fill(0); cnt.fill(0); depth = 0; },
            total: function () { var s = 0; for (var j = 0; j < n; j++) s += acc[j]; return s; },
            /* fn timed as scope id while S.on; otherwise one check and the call */
            wrap: function (fn, id) {
                if (typeof id !== 'number') id = ids[id];
                var w = function () {
                    if (!S.on) return fn.apply(this, arguments);
                    var d = S.b(id);
                    try { return fn.apply(this, arguments); } finally { S.e(d); }
                };
                w._lmScopeOf = fn;
                return w;
            }
        };
        return S;
    }

    /* The last `slots` frame breakdowns (scope ms, counts and a few numbers each), in
     * preallocated typed arrays: a long frame is copied in without allocating. */
    function createScopeRing(slots, n, metaN) {
        var ms = new Float32Array(slots * n), cn = new Uint16Array(slots * n), meta = new Float64Array(slots * metaN), seq = 0;
        return {
            slots: slots,
            size: function () { return Math.min(seq, slots); },
            seq: function () { return seq; },
            clear: function () { seq = 0; },
            push: function (acc, cnt, m) {
                var s = seq % slots, o = s * n, j;
                for (j = 0; j < n; j++) { ms[o + j] = acc[j]; cn[o + j] = cnt[j] > 65535 ? 65535 : cnt[j]; }
                o = s * metaN;
                for (j = 0; j < metaN; j++) meta[o + j] = m ? m[j] : 0;
                seq++;
                return s;
            },
            /* the kept slots added up (for the report): { ms: [], cnt: [], frames, meta0 } */
            totals: function () {
                var k = Math.min(seq, slots), out = { ms: [], cnt: [], frames: k, gap: 0 }, j, s;
                for (j = 0; j < n; j++) { out.ms.push(0); out.cnt.push(0); }
                for (s = 0; s < k; s++) {
                    for (j = 0; j < n; j++) { out.ms[j] += ms[s * n + j]; out.cnt[j] += cn[s * n + j]; }
                    out.gap += meta[s * metaN + 1];
                }
                return out;
            },
            metaAt: function (s, j) { return meta[s * metaN + j]; },
            msAt: function (s, j) { return ms[s * n + j]; }
        };
    }

    /* the biggest parts of a breakdown: [{ n: name, ms, c: calls }], largest first */
    function topScopes(ms, cnt, names, minMs, max) {
        var out = [];
        for (var i = 0; i < names.length; i++) if (ms[i] >= (minMs || 0) && ms[i] > 0) out.push({ n: names[i], ms: Math.round(ms[i] * 10) / 10, c: cnt ? +cnt[i] || 0 : 0 });
        out.sort(function (a, b) { return b.ms - a.ms; });
        return max ? out.slice(0, max) : out;
    }

    /* A script address reduced to its file name (no path, query, hash or user), and whose it
     * is: 'legendmod', 'agar.io', 'extension', 'page' (the page's own host) or 'other'. */
    function scriptFile(url, pageHost) {
        url = String(url == null ? '' : url);
        if (!url) return { file: '', kind: '' };
        var m = /^([a-z][a-z0-9+.\-]*):\/\/(?:[^\/?#@]*@)?(\[[^\]\/?#]*\]|[^\/?#:]*)(?::\d+)?([^?#]*)/i.exec(url);
        if (!m) {
            var sch = /^([a-z][a-z0-9+.\-]*):/i.exec(url);
            return { file: sch ? sch[1].toLowerCase() + ':' : cleanText(url.split(/[?#;]/)[0].split('/').pop(), 60), kind: 'other' };
        }
        var scheme = m[1].toLowerCase(), host = m[2].toLowerCase();
        var file = m[3].split(';')[0].replace(/\/+$/, '').split('/').pop() || host;
        var kind = /-extension$/.test(scheme) ? 'extension' :
            /(^|\.)(legendmod\.ml|jimboy3100\.github\.io)$/.test(host) ? 'legendmod' :
                /(^|\.)(agar\.io|miniclippt\.com|miniclip\.com)$/.test(host) ? 'agar.io' :
                    pageHost && host === String(pageHost).toLowerCase().split(':')[0] ? 'page' : 'other';
        return { file: cleanText(file, 60), kind: kind };
    }
    /* invokers can hold an address ("https://x/y.js?k=..."): only its file name is kept */
    function cleanInvoker(s) {
        return cleanText(String(s == null ? '' : s).replace(/[a-z][a-z0-9+.\-]*:\/\/[^\s'"()<>]*/gi, function (u) {
            var f = scriptFile(u);
            return f.file || f.kind;
        }), 80);
    }

    var LOAF_MIN = 100; /* long animation frames from this long are kept */
    /* A PerformanceLongAnimationFrameTiming entry as plain, cleaned data: offsets from its
     * start, and its 5 longest scripts. */
    function parseLoaf(e, pageHost) {
        var t = num(e && e.startTime), d = num(e && e.duration);
        var out = {
            t: t, dur: Math.round(d), block: Math.round(num(e && e.blockingDuration)),
            render: e && e.renderStart > 0 ? Math.round(e.renderStart - t) : -1,
            style: e && e.styleAndLayoutStart > 0 ? Math.round(e.styleAndLayoutStart - t) : -1,
            scriptMs: 0, nScripts: 0, scripts: []
        };
        var sc = (e && e.scripts) || [], list = [], i;
        for (i = 0; i < sc.length; i++) if (sc[i]) { list.push(sc[i]); out.scriptMs += num(sc[i].duration); }
        out.scriptMs = Math.round(out.scriptMs);
        out.nScripts = list.length;
        list.sort(function (a, b) { return num(b.duration) - num(a.duration); });
        for (i = 0; i < list.length && i < 5; i++) {
            var s = list[i], f = scriptFile(s.sourceURL, pageHost);
            out.scripts.push({
                inv: cleanInvoker(s.invoker), type: cleanText(s.invokerType, 30), fn: cleanText(s.sourceFunctionName, 60),
                file: f.file, kind: f.kind, pos: s.sourceCharPosition >= 0 ? Math.round(num(s.sourceCharPosition)) : -1,
                dur: Math.round(num(s.duration)), fsl: Math.round(num(s.forcedStyleAndLayoutDuration)),
                at: s.startTime > 0 ? Math.round(s.startTime - t) : -1
            });
        }
        return out;
    }
    /* "uploadSkinTexture (ogario.v4.js:12345678) 241 ms" */
    /* script owners -> their text ('agar.io' is a name) */
    var KIND_KEYS = { 'extension': 'kindExtension', 'page': 'kindPage', 'other': 'kindOther' };
    function kindText(kind, tr) { return hasOwn(KIND_KEYS, kind) ? say(tr, KIND_KEYS[kind], kind) : kind; }
    function scriptText(s, tr) {
        return (s.fn || s.inv || s.type || say(tr, 'script', 'script')) + ' (' + (s.file || '?') + (s.pos >= 0 ? ':' + s.pos : '') + ')' +
            (s.kind && s.kind !== 'legendmod' ? ' [' + kindText(s.kind, tr) + ']' : '') + ' ' + s.dur + ' ms' +
            (s.fsl >= 5 ? say(tr, 'forcedLayout', ', forced layout {0} ms', [s.fsl]) : '') +
            (s.fn && s.inv && s.inv.indexOf(s.fn) < 0 ? say(tr, 'via', ' via {0}', [s.inv]) : '');
    }
    function loafLine(l) {
        return Math.round(l.dur) + ' ms (blocking ' + l.block + ' ms, scripts ' + l.scriptMs + ' ms' +
            (l.style >= 0 ? ', style/layout ' + Math.max(0, l.dur - l.style) + ' ms' : '') + ')' +
            (l.scripts.length ? ': ' + l.scripts.map(scriptText).join('; ') : ': no script');
    }

    /* The name of the function at, or around, a character position of a script's text: a
     * heuristic (braces in strings or comments can mislead it) for anonymous callbacks, e.g.
     * "setInterval callback in window.application.init". */
    var BLOCK_WORDS = /^(if|for|while|switch|catch|with|function|return|typeof|else|do|try|finally|in|of|new|await|yield)$/;
    function nameBefore(text, i) {
        var s = text.slice(Math.max(0, i - 300), i), m, a, c;
        if ((m = /(?:^|[^\w$.])function\s*\*?\s*([A-Za-z_$][\w$]*)?\s*\([^()]*\)\s*$/.exec(s))) {
            if (m[1]) return { name: m[1] };
            var pre = s.slice(0, m.index + 1);
            if ((a = /([A-Za-z_$][\w$.]*)\s*[:=]\s*(?:async\s+)?$/.exec(pre))) return { name: a[1] };
            c = /([A-Za-z_$][\w$.]*)\s*\(\s*(?:[^(),]*,\s*)*$/.exec(pre);
            return { name: '', via: c ? c[1] : '' };
        }
        if ((m = /(?:\(([^()]*)\)|([A-Za-z_$][\w$]*))\s*=>\s*$/.exec(s))) {
            var pre2 = s.slice(0, m.index);
            if ((a = /([A-Za-z_$][\w$.]*)\s*[:=]\s*(?:async\s+)?$/.exec(pre2))) return { name: a[1] };
            c = /([A-Za-z_$][\w$.]*)\s*\(\s*(?:[^(),]*,\s*)*$/.exec(pre2);
            return { name: '', via: c ? c[1] : '' };
        }
        if ((m = /(?:^|[^\w$.])(?:async\s+|get\s+|set\s+|static\s+)?([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*$/.exec(s))) {
            return BLOCK_WORDS.test(m[1]) ? null : { name: m[1] };
        }
        if ((m = /\bclass\s+([A-Za-z_$][\w$]*)[^{};]*$/.exec(s))) return { name: m[1], top: true };
        if ((m = /([A-Za-z_$][\w$.]*)\s*=\s*$/.exec(s))) return { name: m[1], top: true };
        if ((m = /([A-Za-z_$][\w$]*)\s*:\s*$/.exec(s))) return { name: m[1] };
        return null;
    }
    function enclosingName(text, pos, maxBack) {
        text = String(text == null ? '' : text);
        pos = Math.floor(+pos);
        if (!(pos >= 0) || pos > text.length) return '';
        /* the function that starts at pos (long animation frames give the callback's start) */
        var own = '', via = '';
        var hm = /^\s*(?:async\s+)?function\b\s*\*?\s*([A-Za-z_$][\w$]*)?\s*\([^()]*\)\s*\{/.exec(text.slice(pos, pos + 300)) ||
            /^\s*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/.exec(text.slice(pos, pos + 300));
        var start = pos;
        if (hm) {
            var brace = text.indexOf('{', pos + hm[0].length - 1);
            var nb = nameBefore(text, brace);
            if (nb) { own = nb.name || ''; via = nb.via || ''; }
            start = pos - 1;
        }
        var chain = [], depth = 0, lim = Math.max(0, pos - (maxBack || 400000));
        for (var i = start; i >= lim && chain.length < 3; i--) {
            var ch = text.charCodeAt(i);
            if (ch === 125) depth++;
            else if (ch === 123) {
                if (depth > 0) { depth--; continue; }
                var e = nameBefore(text, i);
                if (!e) continue;
                if (e.name) chain.push(e.name);
                else if (!chain.length && !own && !via && e.via) via = e.via;
                if (e.top) break;
            }
        }
        chain.reverse();
        if (own) return chain.concat([own]).join('.');
        if (!via && chain.length) return chain.join('.');
        return (via ? via + ' callback' : 'anonymous function') + (chain.length ? ' in ' + chain.join('.') : '');
    }

    function overlapMs(a0, a1, b0, b1) { return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0)); }
    /* One freeze event (its .bd: the timed parts of the frame gap) put together with the long
     * animation frames and the other events around it. A "probable contributor" only when one
     * part took over half of the freeze; otherwise it is not attributed. Returns { line, probable }. */
    /* opts.tr: the line in the chosen language (the window); probable stays English (it is
     * counted and compared) */
    function classifyFreeze(fz, loafs, evs, opts) {
        opts = opts || {};
        var tr = opts.tr || null;
        var dur = +fz.dur || 0, end = +fz.t || 0, start = end - dur, bd = fz.bd || null, probable = '', probText = '', i;
        var parts = [say(tr, 'cfHead', '{0} ms freeze {1}', [Math.round(dur), timeText(fz.w)])];
        if (bd && bd.r) parts.push(rnText(bd.r, tr));
        if (bd) {
            var top = [];
            for (i = 0; i < bd.s.length && top.length < 3; i++) if (bd.s[i].ms >= 1) top.push(bd.s[i].n + ' ' + Math.round(bd.s[i].ms) + ' ms');
            parts.push(top.length ? top.join(', ') : say(tr, 'cfNoPart', 'no timed part over 1 ms'));
            if (bd.s.length && bd.s[0].ms > dur * 0.5) probable = probText = bd.s[0].n;
        } else if (opts.scopes !== false) parts.push(say(tr, 'cfNoBreakdown', 'no breakdown'));
        var best = null, bestOv = 0;
        for (i = 0; loafs && i < loafs.length; i++) {
            var ov = overlapMs(start, end, loafs[i].t, loafs[i].t + loafs[i].dur);
            if (ov > bestOv) { bestOv = ov; best = loafs[i]; }
        }
        if (best) {
            var sc = best.scripts[0];
            parts.push('LoAF ' + best.dur + ' ms: ' + (sc ? scriptText(sc, tr) : say(tr, 'cfNoScript', 'no script')) +
                (best.style >= 0 && best.dur - best.style >= 20 ? say(tr, 'cfStyle', ', style/layout {0} ms', [best.dur - best.style]) : ''));
            if (!probable && sc && sc.dur > dur * 0.5) {
                var who = (sc.fn || sc.inv || '?'), where = (sc.file || '?') + (sc.kind && sc.kind !== 'legendmod' ? ', ' : '');
                probable = 'script ' + who + ' (' + where + (sc.kind && sc.kind !== 'legendmod' ? sc.kind : '') + ')';
                probText = say(tr, 'cfScript', 'script {0} ({1})', [who, where + (sc.kind && sc.kind !== 'legendmod' ? kindText(sc.kind, tr) : '')]);
            }
            if (!probable && best.style >= 0 && best.dur - best.style > dur * 0.5) {
                probable = 'style and layout (browser)';
                probText = say(tr, 'cfStyleBrowser', probable);
            }
        } else if (opts.loaf) parts.push(say(tr, 'cfLoafNone', 'LoAF: none'));
        else {
            for (i = 0; evs && i < evs.length; i++) if (evs[i].type === 'long task' && overlapMs(start, end, evs[i].t, evs[i].t + evs[i].dur) > 0) { parts.push(say(tr, 'cfLongTask', 'long task {0} ms', [evs[i].dur])); break; }
        }
        var net = say(tr, 'cfNetOk', 'network normal');
        for (i = 0; evs && i < evs.length; i++) {
            var ev = evs[i];
            if (ev.type === 'packet gap' && overlapMs(start, end, ev.t - ev.dur, ev.t) > 0) {
                net = ev.t - ev.dur < start - 250 ? say(tr, 'cfNetGap', 'packet gap {0} ms, began before the freeze (network or server)', [ev.dur]) : say(tr, 'cfNetWait', 'world updates only waited for the freeze');
            } else if (ev.type === 'disconnect' && ev.t >= start - 1000 && ev.t <= end + 1000) net = say(tr, 'cfNetDisc', 'disconnect');
        }
        parts.push(net);
        for (i = 0; evs && i < evs.length; i++) {
            if (evs[i].type === 'visibility' && evs[i].t >= start - 1000 && evs[i].t <= end + 500) {
                var vi = evs[i].info;
                parts.push(vi === 'hidden' ? say(tr, 'cfTabHidden', 'tab hidden nearby') : say(tr, 'cfTabVisible', 'tab visible nearby'));
                break;
            }
        }
        if (bd && (bd.qp || bd.q)) parts.push(bd.qp && tr ? partsText(bd.qp, tr) : bd.q);
        parts.push(probable ? say(tr, 'cfProbable', 'probable contributor: {0}', [probText]) : say(tr, 'cfUnattr', 'unattributed (GC/GPU/browser?)'));
        return { line: parts.join(' \u00b7 '), probable: probable };
    }

    var pure = {
        fmt: fmt, tp: tp, partsText: partsText, EV_KEYS: EV_KEYS, INFO_KEYS: INFO_KEYS, RN_KEYS: RN_KEYS, KIND_KEYS: KIND_KEYS,
        timeText: timeText, SCOPES: SCOPES, createScopes: createScopes, createScopeRing: createScopeRing, topScopes: topScopes,
        scriptFile: scriptFile, cleanInvoker: cleanInvoker, parseLoaf: parseLoaf, scriptText: scriptText, loafLine: loafLine,
        enclosingName: enclosingName, classifyFreeze: classifyFreeze, LOAF_MIN: LOAF_MIN,
        hostOf: hostOf, classifyGap: classifyGap, createEventRing: createEventRing, eventLine: eventLine,
        STALL_MS: STALL_MS, FREEZE_MS: FREEZE_MS, PAUSE_MS: PAUSE_MS,
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
    var EVENTS_MAX = 200;
    var HISTORY_KEY = 'lmNetHistory';

    var dms = function () { return window.legendmod5 || null; };
    var app = function () { return window.application || null; };
    /* language pack texts: T('x') is 'modules.perf.x', TS('x') the menu text 'settings.x' */
    var PFX = 'modules.perf.';
    var T = function (k, vars) { return typeof window.lmT === 'function' ? window.lmT(PFX + k, vars) : k; };
    // i18n-ok: key prefix of the existing menu texts (settings.lmPerfDiag, ...), not a key itself
    var TS = function (k, vars) { return typeof window.lmT === 'function' ? window.lmT('settings.' + k, vars) : k; };
    /* for the pure text functions: null when the pack has no text (they use their English one) */
    var tr = function (k, vars) {
        if (typeof window.lmT !== 'function') return null;
        var s = window.lmT(PFX + k, vars);
        return s === PFX + k ? null : s;
    };
    var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

    /* ---------- frame measuring ---------- */

    /* iv: time between drawn frames; rt: drawing time; sg: the longest wait for a frame
     * callback inside iv (iv without the frames the FPS limit skipped on purpose) */
    var fr = {
        iv: new Float32Array(RING), rt: new Float32Array(RING), sg: new Float32Array(RING), at: 0, n: 0,
        prev: 0, longTotal: 0, frames: 0,
        secStart: 0, secFrames: 0, secTime: 0, secRender: [], secAll: [], secGame: [],
        refreshHz: 0, lastFps: 0, menu: false, overlays: null,
        /* frame callbacks (drawRender.render calls _lmPerfFrame.raf before the FPS limit) */
        rafPrev: 0, rafMax: 0, rafSeen: false, lastT1: 0, lastRt: 0,
        /* the last time the tab was hidden or shown, and shown */
        visAt: 0, visibleAt: 0,
        stallCount: 0, stallMax: 0, stallLast: 0,
        frzN: 0, frzMax: 0, frzTotal: 0, frzLast: 0,
        capped: 0, bgGaps: 0, renderErrors: 0, ltN: 0, ltMax: 0, renderer: ''
    };
    var events = createEventRing(EVENTS_MAX);
    var LONGTASK_LOG = 100; /* long tasks from this long are listed (all are counted) */
    var lto = null; /* PerformanceObserver('longtask') while measuring, where supported */
    var adaptiveOn = false, diagOpen = false, keepRec = false;

    /* ---------- freeze attribution (diagnostics window or "keep recording" only) ----------
     * The time of the parts below is added up between two frame callbacks; a frame gap of
     * 50 ms or more is copied into a ring of the last 32 (no allocation), a freeze keeps its
     * own breakdown. Long animation frames (Chrome 123+) tell which script callback ran. */
    var LOAF_MAX = 60, SLOW_SLOTS = 32, META_N = 8;
    var sc = createScopes(now);
    var slowRing = createScopeRing(SLOW_SLOTS, sc.n, META_N);
    var slowMeta = new Float64Array(META_N); /* t, gap, cells, skin jobs, skin uploads, text bytes, heap MB, timed ms */
    var loafs = createEventRing(LOAF_MAX);
    var loafObs = null, attrOn = false, patched = [];
    /* [object, method, part]: wrapped only while attribution is on, put back when it stops */
    var PATCHES = [
        ['legendmod', 'handleMessage', 'packets'], ['legendmod', 'decompressMessage', 'decompress'],
        ['legendmod', 'updateCells', 'cells update'], ['legendmod', 'handleLeaderboard', 'leaderboard'],
        ['legendmod', 'sortCells', 'cell sort'], ['legendmod', 'compareCells', 'cell compare'], ['legendmod', 'sendPosition', 'send position'],
        ['drawRender', 'renderFrame', 'render'], ['drawRender', 'drawWebGLCellBatch', 'WebGL cells'], ['drawRender', 'drawWebGLBatch', 'WebGL batch'],
        ['drawRender', '_lmRasterText', 'text raster'], ['drawRender', '_lmUploadSkinJob', 'skin texture upload'],
        ['drawRender', 'uploadSkinTexture', 'uploadSkinTexture'],
        ['application', '_lmSkinJobRun', 'skin canvas job'], ['application', 'displayTop5', 'teamboard'],
        ['application', 'drawMiniMap', 'minimap'], ['application', 'updateTeamPlayers', 'team players'],
        ['application', 'displayStats', 'stats HUD'], ['application', 'saveSettings', 'settings save'],
        ['window', 'repeatSendingSpecialSkins', 'special skins sync'], ['window', 'checkVideos', 'video skins'],
        ['window', 'lmReplayBarTick', 'replay bar'], ['window', '_lmRecBudgetCheck', 'replay budget'],
        ['Storage.prototype', 'setItem', 'storage write']
    ];

    function patchTarget(k) {
        if (k === 'window') return window;
        if (k === 'Storage.prototype') return window.Storage ? window.Storage.prototype : null;
        return window[k] || null;
    }
    function installPatches() {
        for (var i = 0; i < PATCHES.length; i++) {
            var p = PATCHES[i], o = patchTarget(p[0]);
            try {
                if (!o || typeof o[p[1]] !== 'function' || o[p[1]]._lmScopeOf) continue;
                var orig = o[p[1]], own = hasOwn(o, p[1]), w = sc.wrap(orig, p[2]);
                o[p[1]] = w;
                if (o[p[1]] === w) patched.push([o, p[1], orig, w, own]);
            } catch (e) { }
        }
    }
    function removePatches() {
        for (var i = 0; i < patched.length; i++) {
            var p = patched[i];
            /* replaced by someone else meanwhile: left there (it only checks sc.on) */
            try {
                if (p[0][p[1]] !== p[3]) continue;
                if (p[4]) p[0][p[1]] = p[2];
                else delete p[0][p[1]];
            } catch (e) { }
        }
        patched.length = 0;
    }

    function observeLoaf(on) {
        if (on && !loafObs) {
            try {
                var PO = window.PerformanceObserver;
                if (!PO || !PO.supportedEntryTypes || PO.supportedEntryTypes.indexOf('long-animation-frame') < 0) return;
                var host = (window.location && window.location.host) || '';
                loafObs = new PO(function (list) {
                    var es = list.getEntries(), n = now(), w = Date.now();
                    for (var i = 0; i < es.length; i++) {
                        if (!(+es[i].duration >= LOAF_MIN)) continue;
                        var l = parseLoaf(es[i], host);
                        l.w = w - (n - l.t);
                        loafs.push(l);
                    }
                });
                loafObs.observe({ type: 'long-animation-frame', buffered: false });
            } catch (e) { loafObs = null; }
        } else if (!on && loafObs) {
            try { loafObs.disconnect(); } catch (e) { }
            loafObs = null;
        }
    }

    function attribution(on) {
        if (on === attrOn) return;
        attrOn = on;
        if (on) {
            installPatches();
            sc.clear();
            sc.on = true;
            window._lmScope = sc;
        } else {
            sc.on = false;
            window._lmScope = null;
            removePatches();
        }
        observeLoaf(on);
    }

    /* queue sizes and totals for a breakdown (into m, no allocation) */
    function fillMeta(m, t, g) {
        var lm = window.legendmod, dr = window.drawRender, a = app();
        m[0] = t; m[1] = g;
        m[2] = lm && lm.cells ? lm.cells.length : 0;
        m[3] = a && a._lmSkinJobs ? a._lmSkinJobs.length : 0;
        m[4] = dr && dr._lmSkinReady ? dr._lmSkinReady.length : 0;
        m[5] = dr ? (+dr._lmTextBytes || 0) + (+dr._lmMassBytes || 0) : 0;
        m[6] = 0;
        try { if (window.performance && performance.memory) m[6] = Math.round(performance.memory.usedJSHeapSize / 1048576); } catch (e) { }
        m[7] = sc.total();
    }
    function metaParts(m) {
        var q = [];
        if (m[2]) q.push(tp('infoCells', '{0} cells', [m[2]]));
        if (m[3]) q.push(tp('qSkinJobs', 'skin jobs {0}', [m[3]]));
        if (m[4]) q.push(tp('qSkinUploads', 'skin uploads {0}', [m[4]]));
        if (m[5]) q.push(tp('qTextTextures', 'text textures {0} MB', [f1(m[5] / 1048576)]));
        return { s: ', ', p: q };
    }
    /* the timed parts of the frame gap that ends now (a freeze: rare, so a small object) */
    function breakdown(t, g) {
        fillMeta(slowMeta, t, g);
        var r = rendererName();
        try { if (r === 'WebGL' && window.WebGL2RenderingContext && window.drawRender.gl instanceof window.WebGL2RenderingContext) r = 'WebGL2'; } catch (e) { }
        var qp = metaParts(slowMeta);
        return { r: r, s: topScopes(sc.acc, sc.cnt, sc.names, 0.5, 8), tot: Math.round(slowMeta[7]), q: partsText(qp, null), qp: qp };
    }
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

    /* Events are kept only while measuring: with diagnostics and Adaptive performance off
     * this returns at once. t: performance.now() time of the event (default: now). */
    /* info: text, or parts ({ s: separator, p: [text or tp()] }) that the window translates;
     * ev.info is always the English text (compared, listed in the report) */
    function pushEvent(type, dur, info, merge, t) {
        if (window._lmPerfFrame !== onFrame) return null;
        var n = now(), ip = null;
        if (t == null) t = n;
        if (info && typeof info === 'object') { ip = info; info = partsText(ip, null); }
        var ev = events.push({ t: t, w: Date.now() - (n - t), type: type, dur: dur > 0 ? Math.round(dur) : 0, info: cleanText(info, 120) }, merge);
        if (ip && ev.n === 1) ev.ip = ip;
        return ev;
    }

    function freezeInfo(t, g) {
        var lm = window.legendmod, out = [];
        /* the frame drawn at the start of the gap took this long */
        if (fr.lastT1 >= t - g && fr.lastRt >= 1) out.push(tp('infoRender', 'render {0} ms', [Math.round(fr.lastRt)]));
        if (fr.menu) out.push(tp('infoMenu', 'menu'));
        else if (lm && lm.play) out.push(tp('infoPlaying', 'playing'));
        if (lm && lm.cells) out.push(tp('infoCells', '{0} cells', [lm.cells.length]));
        try { if (window.performance && performance.memory) out.push(tp('infoHeap', '{0} MB heap', [Math.round(performance.memory.usedJSHeapSize / 1048576)])); } catch (e) { }
        return { s: ', ', p: out };
    }

    /* the tab was hidden, or hidden / shown, during the gap ending at t */
    function inBackground(t, g) { return !!document.hidden || (fr.visAt > 0 && fr.visAt >= t - g); }

    /* a gap between two frame callbacks ending at t: counts stalls and freezes */
    function noteGap(t, g) {
        var kind = classifyGap(g, inBackground(t, g), fr.visibleAt ? t - fr.visibleAt : -1);
        if (!kind) return kind;
        if (kind === 'background') { fr.bgGaps++; return kind; }
        if (kind === 'stall' || kind === 'freeze') {
            fr.stallCount++;
            fr.stallLast = g;
            if (g > fr.stallMax) fr.stallMax = g;
        }
        if (kind === 'freeze') {
            fr.frzN++; fr.frzTotal += g; fr.frzLast = Date.now();
            if (g > fr.frzMax) fr.frzMax = g;
            var fev = pushEvent('freeze', g, freezeInfo(t, g), false, t);
            /* what ran during the gap (attribution on) */
            if (fev && sc.on) fev.bd = breakdown(t, g);
        } else if (kind === 'pause') {
            pushEvent('pause', g, { s: '', p: [tp('infoPause', 'over {0} s, sleep or suspend (not counted)', [PAUSE_MS / 1000])] });
        } else if (kind === 'return' && g >= FREEZE_MS) {
            pushEvent('freeze', g, { s: '', p: [tp('infoReturn', 'right after the tab came back (not counted)')] });
        }
        return kind;
    }

    /* called by drawRender.render() at the start of every frame callback, also of those the
     * FPS limit skips: the callback gaps show the stalls, the FPS limit's own gaps are not */
    function onRaf(t) {
        if (fr.rafPrev) {
            var g = t - fr.rafPrev;
            if (g > fr.rafMax && !inBackground(t, g)) fr.rafMax = g;
            /* attribution: the parts timed since the last callback belong to this gap */
            if (sc.on && g >= LONG_FRAME && g <= PAUSE_MS && !inBackground(t, g)) {
                fillMeta(slowMeta, t, g);
                slowRing.push(sc.acc, sc.cnt, slowMeta);
            }
            noteGap(t, g);
        }
        if (sc.on) sc.reset();
        fr.rafPrev = t;
        fr.rafSeen = true;
    }

    /* called by drawRender.render() around renderFrame() while measuring, also when it threw
     * (err: what it threw) */
    function onFrame(t0, t1, err) {
        var prev = fr.prev;
        var dt = prev ? t0 - prev : 0;
        fr.prev = t0;
        var hidden = document.hidden;
        var menu = menuOpen();
        if (menu !== fr.menu) {
            fr.menu = menu;
            if (adaptiveOn) applyLevel(false);
        }
        if (!fr.secStart) resetSecond(t0);
        var rt = t1 - t0;
        /* the longest wait for the browser in this frame; without callback times (an older
         * caller) the frame gap itself, with the menu left out as before (its FPS cap) */
        var sg = dt;
        if (fr.rafSeen) sg = fr.rafMax;
        else if (!menu) noteGap(t0, dt);
        fr.rafSeen = false; fr.rafMax = 0;
        /* Diagnostics: every frame in the foreground, long ones too (they are the freezes);
         * a gap in which the tab was hidden or the device slept is not a frame time */
        if (!hidden && dt > 0 && dt <= PAUSE_MS && !(prev && fr.visAt >= prev)) {
            fr.iv[fr.at] = dt; fr.rt[fr.at] = rt; fr.sg[fr.at] = sg;
            fr.at = (fr.at + 1) % RING;
            if (fr.n < RING) fr.n++;
            fr.frames++;
            if (sg > LONG_FRAME) fr.longTotal++;
            else if (dt > LONG_FRAME) fr.capped++; /* long only because of the FPS limit */
        }
        /* Adaptive performance: a gap (tab in the background, a stall) is not a frame time */
        if (!hidden && dt > 0 && dt < 1000) {
            fr.secAll.push(dt);
            if (!menu) { fr.secFrames++; fr.secTime += dt; fr.secRender.push(rt); fr.secGame.push(dt); }
        }
        fr.lastT1 = t1; fr.lastRt = rt;
        if (err) {
            fr.renderErrors++;
            pushEvent('render error', rt, String((err && err.message) || err).slice(0, 100), true);
        }
        if (t1 - fr.secStart >= 1000) {
            endSecond();
            resetSecond(t1);
        }
    }
    onFrame.raf = onRaf;

    function endSecond() {
        /* the renderer changed (WebGL lost, turned off...) */
        var rn = rendererName();
        if (fr.renderer && rn !== fr.renderer) pushEvent('renderer', 0, { s: ' -> ', p: [rnPart(fr.renderer), rnPart(rn)] });
        fr.renderer = rn;
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
        var change = controllerStep(ctl, fps, target, p90, fr.secTime / 1000, topLevel());
        /* a lowered value changed meanwhile (hotkey): the player's choice, left alone */
        if (overrides) overrides.check();
        if (change) applyLevel(true);
    }

    /* long tasks of the page (Chrome / Android), only while measuring */
    function longTasks(on) {
        if (on && !lto) {
            try {
                var PO = window.PerformanceObserver;
                if (!PO || !PO.supportedEntryTypes || PO.supportedEntryTypes.indexOf('longtask') < 0) return;
                lto = new PO(function (list) {
                    var es = list.getEntries();
                    for (var i = 0; i < es.length; i++) {
                        var d = +es[i].duration || 0;
                        fr.ltN++;
                        if (d > fr.ltMax) fr.ltMax = d;
                        if (d >= LONGTASK_LOG) pushEvent('long task', d, '', false, +es[i].startTime || null);
                    }
                });
                lto.observe({ entryTypes: ['longtask'] });
            } catch (e) { lto = null; }
        } else if (!on && lto) {
            try { lto.disconnect(); } catch (e) { }
            lto = null;
        }
    }

    function measuring(on) {
        if (on) {
            if (window._lmPerfFrame !== onFrame) {
                fr.prev = 0; fr.secStart = 0;
                fr.rafPrev = 0; fr.rafMax = 0; fr.rafSeen = false; fr.renderer = '';
                window._lmPerfFrame = onFrame;
            }
        } else if (window._lmPerfFrame) {
            window._lmPerfFrame = null;
        }
        longTasks(on);
    }
    /* the diagnostics window, Adaptive performance or "keep recording" need the frame times */
    function wantMeasuring() {
        measuring(adaptiveOn || diagOpen || keepRec);
        /* attribution is for diagnostics only, not for Adaptive performance alone */
        attribution(diagOpen || keepRec);
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

    function applyLevel(levelChanged) {
        var ov = ensureOverrides();
        var level = adaptiveOn ? ctl.level : 0;
        if (ov) sideEffects(ov.sync(level, fr.menu));
        /* level 3 (lower resolution, blurrier) only when the player allowed it */
        applyScale(level >= 3 && topLevel() >= 3);
        if (levelChanged) {
            var s = dms();
            if (s && s.adaptivePerfToasts !== false && window.toastr) {
                /* settings.lmAdaptiveLevel0 .. 3 */
                try { toastr.info(TS('lmAdaptiveLevel' + level)); } catch (e) { }
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
        wantMeasuring();
    }

    /* ---------- network quality ---------- */

    var NET_SAMPLES = 1800; /* 30 minutes at one per second */
    var net = {
        active: false, timer: 0, start: Date.now(), ticks: 0,
        t: [], ping: [], pps: [], open: [],
        pongs: [], ppsLive: [], closes: [], reconnects: 0, hadClose: false, hosts: [],
        lastVal: 0, lastStamp: 0, sampledStamp: 0, lastPeriodicSample: 0
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
            /* P1 fix #32: also sample at a fixed interval (every 5s) so steady-state pings
             * are represented in the average, not just transitions/spikes. */
            var changed = p.v > 0 && (p.v !== net.lastVal || (p.s && p.s !== net.sampledStamp && wall - p.s >= 1500));
            var periodic = p.v > 0 && (!net.lastPeriodicSample || wall - net.lastPeriodicSample >= 5000);
            if (changed || periodic) {
                net.pongs.push(p.v);
                if (net.pongs.length > 5000) net.pongs.shift();
                net.lastVal = p.v;
                net.sampledStamp = p.s;
                if (periodic) net.lastPeriodicSample = wall;
            }
            net.ppsLive.push(pps);
            if (net.ppsLive.length > NET_SAMPLES) net.ppsLive.shift();
        }
        if (++net.ticks % 30 === 0) saveSession();
        if (diagOpen && net.ticks % 2 === 0) drawNetGraph();
    }

    function netEvent(type, info) {
        /* in the event list too, to line disconnects up with freezes */
        if (type === 'close') pushEvent('disconnect', 0, { s: ' ', p: [tp('infoCode', 'code {0}', [Math.round(num(info && info.code))]), info && info.wasClean === false ? tp('notClean', '(not clean)') : ''] });
        else if (type === 'open') pushEvent('connect', 0, hostOf(info && info.ws));
        if (!net.active) return;
        if (type === 'close') {
            var e = info || {};
            var clean = e.wasClean !== false;
            var code = Math.round(num(e.code));
            net.closes.push({ t: Date.now(), code: code, reason: cleanText(e.reason, 60), clean: clean, openMs: Math.round(num(e.openMs)) });
            if (net.closes.length > 200) net.closes.shift();
            /* P1 fix #36: a clean close with code 1000 is a voluntary server hop, not a
             * network disconnect. Only mark hadClose for unexpected disconnects so the
             * reconnect counter and history reflect actual network problems. */
            if (!clean || (code !== 1000 && code !== 0)) net.hadClose = true;
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
            /* P1 fix #31: reset net.start when tracking is enabled, so the session
             * duration measures actual tracking time, not time since page load. */
            net.start = Date.now();
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
    /* When the tab is hidden or shown: a frame gap around it is the browser pausing frames,
     * not a stall (document.hidden is already false by the time the first frame fires). */
    document.addEventListener('visibilitychange', function () {
        var t = now();
        fr.visAt = t;
        if (!document.hidden) fr.visibleAt = t;
        pushEvent('visibility', 0, { s: '', p: [document.hidden ? tp('infoHidden', 'hidden') : tp('infoVisible', 'visible')] });
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
            if (fr.sg[j] > LONG_FRAME) longN++;
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
            (fr.stallCount ? ', stalls \u2265100ms: ' + fr.stallCount + ' (worst ' + Math.round(fr.stallMax || 0) + ' ms)' : '') +
            (fr.capped ? ', ' + fr.capped + ' only long by the FPS limit (not counted)' : ''));
        lines.push(freezeLine(true));
        if (fr.ltN || lto) lines.push('Long tasks (\u226550 ms): ' + fr.ltN + (fr.ltN ? ', worst ' + Math.round(fr.ltMax) + ' ms' : '') + ' (listed from ' + LONGTASK_LOG + ' ms)');
        lines.push('Freeze breakdown: ' + (attrOn ? 'on' : 'off (open this window or keep recording)') + ', long animation frames: ' +
            (loafObs ? 'observed' : attrOn ? 'not supported by this browser' : 'off') +
            ', time origin ' + (window.performance && performance.timeOrigin ? Math.round(performance.timeOrigin) : '-') + ', performance.now ' + Math.round(now()));
        var att = attributed();
        if (att.length) {
            var by = {}, order = [];
            att.forEach(function (a) { var k = a.probable || 'unattributed'; if (!by[k]) { by[k] = 0; order.push(k); } by[k]++; });
            order.sort(function (a, b) { return by[b] - by[a]; });
            lines.push('Probable contributors: ' + order.map(function (k) { return k + ' x' + by[k]; }).join(', '));
        }
        if (fr.renderErrors) lines.push('Frames that failed to draw: ' + fr.renderErrors);
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
        var ev = events.list(), ll = loafs.list(), lopt = loafOpts();
        lines.push('Events (' + ev.length + ', last ' + EVENTS_MAX + ' kept' + (keepRec ? ', recording also with the window closed' : '') + '):');
        ev.forEach(function (e) {
            lines.push('  ' + (e.type === 'freeze' ? classifyFreeze(e, ll, ev, lopt).line + (e.info ? ' (' + e.info + ')' : '') + ' @' + Math.round(e.t) : eventLine(e)));
        });
        var tot = slowRing.totals();
        if (tot.frames) {
            var parts = topScopes(tot.ms, tot.cnt, sc.names, 1, 8);
            lines.push('Slow frames (\u2265' + LONG_FRAME + ' ms, last ' + tot.frames + '): average ' + Math.round(tot.gap / tot.frames) + ' ms, timed parts in total: ' +
                (parts.length ? parts.map(function (p) { return p.n + ' ' + Math.round(p.ms) + ' ms (' + p.c + 'x)'; }).join(', ') : 'none over 1 ms'));
        }
        if (ll.length) {
            lines.push('Long animation frames (\u2265' + LOAF_MIN + ' ms, ' + ll.length + ' kept, last 20):');
            ll.slice(-20).forEach(function (l) { lines.push('  ' + timeText(l.w) + ' ' + loafLine(l) + ' @' + Math.round(l.t)); });
        }
        var hist = readHistory();
        if (hist.length) {
            lines.push('Last sessions:');
            hist.slice(-5).forEach(function (h) { lines.push('  ' + sessionLine(h)); });
        }
        return lines;
    }

    function loafOpts() { return { loaf: !!loafObs || loafs.size() > 0, scopes: attrOn }; }
    /* every counted freeze with its attribution line */
    function attributed() {
        var ev = events.list(), ll = loafs.list(), lopt = loafOpts(), out = [];
        for (var i = 0; i < ev.length; i++) {
            if (ev[i].type !== 'freeze' || /not counted/.test(ev[i].info)) continue;
            var c = classifyFreeze(ev[i], ll, ev, lopt);
            out.push({ t: ev[i].t, w: ev[i].w, dur: ev[i].dur, info: ev[i].info, bd: ev[i].bd || null, line: c.line, probable: c.probable });
        }
        return out;
    }

    /* freezes: foreground frame callback gaps from 250 ms to 10 s */
    /* long: the English line of the report; otherwise the window's line */
    function freezeLine(long) {
        var t = fr.frzLast ? new Date(fr.frzLast) : null;
        var at = t ? pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds()) : '';
        if (!long) {
            return T('freezes', [FREEZE_MS, fr.frzN]) +
                (fr.frzN ? T('freezesWorst', [Math.round(fr.frzMax), Math.round(fr.frzTotal)]) + (t ? T('freezesLast', [at]) : '') : '');
        }
        return 'Freezes (\u2265' + FREEZE_MS + ' ms, foreground): ' + fr.frzN +
            (fr.frzN ? ', worst ' + Math.round(fr.frzMax) + ' ms, total ' + Math.round(fr.frzTotal) + ' ms' + (t ? ', last ' + at : '') : '') +
            (fr.bgGaps ? ' (' + fr.bgGaps + ' background gaps not counted)' : '');
    }

    function fmtDur(ms) {
        var m = Math.round(ms / 60000);
        return m >= 60 ? Math.floor(m / 60) + 'h' + (m % 60 < 10 ? '0' : '') + (m % 60) : m + 'm';
    }
    /* one saved session; tr: in the chosen language (the window), else English (the report).
     * The close reasons are the server's own text. */
    function sessionLine(h, tr) {
        var d = new Date(h.start);
        return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) +
            ' ' + fmtDur(h.dur) + say(tr, 'session', ', ping {0} (p95 {1}) \u00b1{2}, {3} pkt/s, {4} disc.', [h.pingAvg, h.pingP95, h.jitter, h.ppsAvg, h.disc]) +
            (h.reasons.length ? ' [' + h.reasons.map(function (r) { return r.code + (r.reason ? ' ' + r.reason : '') + (r.n > 1 ? ' x' + r.n : ''); }).join('; ') + ']' : '');
    }

    function copyText(text) {
        var done = function () { if (window.toastr) try { toastr.info(TS('lmPerfCopied')); } catch (e) { } };
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

    /* Window position: kept on screen (pure, tested) */
    function clampPos(x, y, w, h, vw, vh) {
        var nx = Math.min(Math.max(0, x), Math.max(0, vw - w));
        var ny = Math.min(Math.max(0, y), Math.max(0, vh - h));
        return { x: Math.round(nx), y: Math.round(ny) };
    }
    var POS_KEY = 'lmPerfDiagPos';
    function loadPos() {
        try {
            var p = JSON.parse(window.localStorage.getItem(POS_KEY) || 'null');
            if (p && typeof p.x === 'number' && typeof p.y === 'number' && isFinite(p.x) && isFinite(p.y)) return p;
        } catch (e) { }
        return null;
    }
    /* Drag the window by its title bar (mouse or touch); the close cross is not a handle.
     * The place is remembered and kept on screen. Moves never reach the game. */
    function makeDraggable(md, handle, skip) {
        handle.style.cursor = 'move';
        handle.style.touchAction = 'none';
        handle.style.userSelect = 'none';
        var place = function (x, y) {
            var r = md.getBoundingClientRect();
            var p = clampPos(x, y, r.width || 380, r.height || 200, window.innerWidth, window.innerHeight);
            md.style.left = p.x + 'px';
            md.style.top = p.y + 'px';
            return p;
        };
        var saved = loadPos();
        if (saved) setTimeout(function () { if (md.parentNode) place(saved.x, saved.y); }, 0);
        var drag = null;
        handle.addEventListener('pointerdown', function (e) {
            if (skip && (e.target === skip || skip.contains(e.target))) return;
            if (e.button !== undefined && e.button > 0) return;
            var r = md.getBoundingClientRect();
            drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
            try { handle.setPointerCapture(e.pointerId); } catch (er) { }
            e.preventDefault();
            e.stopPropagation();
        });
        handle.addEventListener('pointermove', function (e) {
            if (!drag || e.pointerId !== drag.id) return;
            place(e.clientX - drag.dx, e.clientY - drag.dy);
            e.preventDefault();
            e.stopPropagation();
        });
        var end = function (e) {
            if (!drag || e.pointerId !== drag.id) return;
            drag = null;
            try { handle.releasePointerCapture(e.pointerId); } catch (er) { }
            var r = md.getBoundingClientRect();
            try { window.localStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) })); } catch (er) { }
            e.stopPropagation();
        };
        handle.addEventListener('pointerup', end);
        handle.addEventListener('pointercancel', end);
    }

    function openDiag() {
        if (diag) { closeDiag(); return; }
        var ds = window.defaultSettings || {};
        /* var(--lm-*) so the open window follows a theme change; the saved value is the fallback */
        var V = function (n, v, d) { return 'var(--lm-' + n + ',' + (v || d) + ')'; };
        var mc = V('mc', ds.menuMainColor, '#01d9cc'), pc = V('pc', ds.menuPanelColor, '#00243e'), pc2 = V('pc2', ds.menuPanelColor2, '#002f52');
        var tc = V('tc', ds.menuTextColor, '#ffffff'), tc2 = V('tc2', ds.menuTextColor2, '#8096a7');
        /* the stats boxes: Bootstrap gives <pre> a light grey background, so they set their own */
        var box = 'background:rgba(0,0,0,0.25);border:1px solid ' + pc2 + ';border-radius:3px;padding:4px 6px;word-break:normal;';
        /* fits a 915x412 phone: narrow, scrolls inside, the close cross is a large tap target */
        var md = el('div', 'position:fixed;top:8px;left:8px;width:380px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);' +
            'display:flex;flex-direction:column;z-index:2147481000;background:' + pc + ';border:1px solid ' + pc2 + ';border-top:3px solid ' + mc + ';' +
            'border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + tc + ';font-family:inherit;font-size:11px;line-height:1.35;overflow:hidden;');
        md.id = 'lm-perf-diag';
        var head = el('div', 'padding:7px 44px 6px 10px;position:relative;border-bottom:1px solid ' + pc2 + ';background:linear-gradient(180deg,' + pc2 + ' 0%,' + pc + ' 100%);');
        var title = el('div', 'font-size:13px;font-weight:700;color:' + mc + ';letter-spacing:1px;text-transform:uppercase;');
        head.appendChild(title);
        /* the close cross stays at the right (also in Arabic): the head keeps room for it there */
        var x = el('div', 'position:absolute;top:2px;right:4px;cursor:pointer;font-size:18px;color:' + tc2 + ';width:34px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:4px;background:rgba(255,255,255,0.05);', '\u2715');
        x.id = 'lm-perf-diag-close';
        var stop = function (e) { e.preventDefault(); e.stopPropagation(); };
        x.addEventListener('click', function (e) { stop(e); closeDiag(); });
        x.addEventListener('touchend', function (e) { stop(e); closeDiag(); });
        head.appendChild(x);
        md.appendChild(head);
        makeDraggable(md, head, x);
        var body = el('div', 'padding:6px 10px 8px;overflow:auto;-webkit-overflow-scrolling:touch;');
        md.appendChild(body);
        var cv = el('canvas', 'display:block;width:100%;height:64px;background:rgba(0,0,0,0.35);border-radius:3px;');
        cv.width = 360; cv.height = 64;
        cv.dir = 'ltr';
        body.appendChild(cv);
        var stats = el('pre', 'margin:4px 0 6px;white-space:pre-wrap;font:11px/1.35 monospace;color:' + tc + ';' + box);
        body.appendChild(stats);
        var hEvents = el('div', 'font-weight:700;color:' + mc + ';margin-top:2px;');
        body.appendChild(hEvents);
        var evs = el('pre', 'margin:2px 0 6px;white-space:pre-wrap;font:10px/1.35 monospace;color:' + tc2 + ';max-height:84px;overflow:auto;' + box);
        body.appendChild(evs);
        var hNet = el('div', 'font-weight:700;color:' + mc + ';margin-top:2px;');
        body.appendChild(hNet);
        var nv = el('canvas', 'display:block;width:100%;height:56px;background:rgba(0,0,0,0.35);border-radius:3px;margin-top:2px;');
        nv.width = 360; nv.height = 56;
        nv.dir = 'ltr';
        body.appendChild(nv);
        var nstats = el('pre', 'margin:4px 0 6px;white-space:pre-wrap;font:11px/1.35 monospace;color:' + tc + ';' + box);
        body.appendChild(nstats);
        var hSessions = el('div', 'font-weight:700;color:' + mc + ';');
        body.appendChild(hSessions);
        var hist = el('pre', 'margin:2px 0 6px;white-space:pre-wrap;font:10px/1.35 monospace;color:' + tc2 + ';' + box);
        body.appendChild(hist);
        var row = el('div', 'display:flex;gap:6px;flex-wrap:wrap;');
        var btn = function (id, text, fn) {
            var b = el('button', 'cursor:pointer;font-family:inherit;font-size:11px;padding:5px 10px;border-radius:4px;border:1px solid ' + pc2 + ';background:rgba(255,255,255,0.05);color:' + tc + ';', text);
            b.type = 'button';
            b.id = id;
            b.addEventListener('click', function (e) { stop(e); fn(); });
            row.appendChild(b);
            return b;
        };
        var bCopy = btn('lm-perf-copy', '', function () { copyText(reportLines().join('\n')); });
        var bClear = btn('lm-perf-clear', '', function () {
            try { window.localStorage.removeItem(HISTORY_KEY); } catch (e) { }
            updateDiag();
        });
        /* this session only: frame times and events go on with the window closed (it covers
         * part of a phone screen), so a freeze while playing is in the report afterwards */
        var bKeep = btn('lm-perf-keep', '', function () {
            keepRec = !keepRec;
            bKeep.textContent = keepText();
            wantMeasuring();
        });
        body.appendChild(row);
        /* keys and wheel stay in the window (Space would split), clicks do not reach the game */
        ['mousedown', 'mouseup', 'wheel', 'touchstart', 'touchmove', 'keydown', 'keyup'].forEach(function (t) {
            md.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
        });
        document.body.appendChild(md);
        diag = { md: md, cv: cv, stats: stats, evs: evs, nv: nv, nstats: nstats, hist: hist, timer: 0,
            title: title, x: x, hEvents: hEvents, hNet: hNet, hSessions: hSessions, bCopy: bCopy, bClear: bClear, bKeep: bKeep };
        diagTexts();
        diagOpen = true;
        wantMeasuring();
        setNet(true);
        diag.timer = setInterval(function () { try { updateDiag(); } catch (e) { } }, 500);
        updateDiag();
        drawNetGraph();
    }

    function keepText() {
        return T(keepRec ? 'keepOn' : 'keepOff');
    }

    /* the fixed texts of the window (again after a language change); the rest is redrawn
     * every 500 ms by updateDiag */
    function diagTexts() {
        if (!diag) return;
        diag.md.dir = window.LMi18n && window.LMi18n.dir ? window.LMi18n.dir() : 'ltr';
        diag.title.textContent = TS('lmPerfDiag');
        diag.x.title = TS('close');
        diag.x.setAttribute('aria-label', TS('close'));
        diag.hEvents.textContent = TS('lmPerfEvents');
        diag.hNet.textContent = TS('lmNetQuality');
        diag.hSessions.textContent = TS('lmNetSessions');
        diag.bCopy.textContent = TS('lmPerfCopy');
        diag.bClear.textContent = TS('lmNetClear');
        diag.bKeep.textContent = keepText();
    }
    if (window.LMi18n && window.LMi18n.onChange) {
        window.LMi18n.onChange(function () {
            if (!diag) return;
            try { diagTexts(); updateDiag(); drawNetGraph(); } catch (e) { }
        });
    }

    function closeDiag() {
        if (!diag) return;
        clearInterval(diag.timer);
        if (diag.md.parentNode) diag.md.parentNode.removeChild(diag.md);
        diag = null;
        diagOpen = false;
        wantMeasuring();
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
        x.fillText(T('graphFrames', [maxMs, Math.round(target)]), 4, 1);
    }

    function drawNetGraph() {
        if (!diag) return;
        var cv = diag.nv, x = cv.getContext('2d');
        if (!x) return;
        var w = cv.width, h = cv.height, n = net.t.length;
        x.clearRect(0, 0, w, h);
        x.font = '10px sans-serif';
        x.textBaseline = 'top';
        if (!n) { x.fillStyle = 'rgba(255,255,255,0.6)'; x.fillText(T('graphWaiting'), 4, 2); return; }
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
        x.fillStyle = '#ffb84d'; x.fillText(T('graphPing', [Math.round(pMax)]), 4, 1);
        x.fillStyle = '#4da6ff'; x.fillText(T('graphPps', [Math.round(qMax)]), 120, 1);
        x.fillStyle = '#ff4d4d'; x.fillText('| ' + T('graphDisc'), 240, 1);
    }

    function updateDiag() {
        if (!diag) return;
        var st = frameStats(), s = dms() || {}, lm = window.legendmod, dr = window.drawRender;
        drawFrameGraph(st);
        var target = effectiveTarget(s.adaptivePerfTarget, s.fpsLimit, fr.refreshHz);
        diag.stats.textContent =
            'FPS ' + f1(st.fps) + (fr.refreshHz ? T('statRefresh', [fr.refreshHz]) : '') + '\n' +
            'p50 ' + f1(st.p50) + '  p95 ' + f1(st.p95) + '  p99 ' + f1(st.p99) + ' ms\n' +
            T('statLong', [LONG_FRAME, st.longN, st.n, st.longTotal]) + '\n' +
            freezeLine(false) + '\n' +
            T('statRender', [f1(st.render), f1(st.other)]) + '\n' +
            T('statCells', [lm && lm.cells ? lm.cells.length : 0]) + '   ' + rnText(rendererName(), tr) + '\n' +
            T('statScale', [window.devicePixelRatio || 1, dr && dr.dpr ? f1(dr.dpr) : '-']) + '\n' +
            (adaptiveOn ? T('statAdaptiveOn', [ctl.level, MAX_LEVEL, Math.round(target)]) : T('statAdaptiveOff')) + '\n' +
            T('statAttr', [attrOn ? T('on') : T('off'), loafObs ? T('on') : '-']);
        var ev = events.list(), ll = loafs.list(), lopt = loafOpts();
        lopt.tr = tr;
        diag.evs.textContent = ev.length ? ev.slice(-30).reverse().map(function (e) {
            return e.type === 'freeze' ? classifyFreeze(e, ll, ev, lopt).line : eventLine(e, tr);
        }).join('\n') : TS('lmPerfNoEvents');
        var sum = sessionSummary(), pn = pingNow();
        diag.nstats.textContent =
            T('netPing', [pn.v || '-', sum.pingAvg, sum.pingP95, sum.jitter]) + '\n' +
            T('netPackets', [lm ? +lm.pps || 0 : 0, sum.ppsAvg, sum.disc, sum.reconn]) +
            net.closes.slice(-3).map(function (c) {
                /* the reason is the server's own text */
                return '\n  ' + new Date(c.t).toLocaleTimeString() + ' ' + T('infoCode', [c.code]) + (c.reason ? ' ' + c.reason : '') + (c.clean ? '' : ' ' + T('notClean'));
            }).join('');
        var h = readHistory();
        diag.hist.textContent = h.length ? h.slice(-5).reverse().map(function (x) { return sessionLine(x, tr); }).join('\n') :
            (s.netHistory ? T('netNoSessions') : T('netHistOff'));
    }

    /* ---------- wiring ---------- */

    /* Level 3 lowers the internal resolution (the picture gets blurry): only with the
     * "may lower the resolution" option; otherwise Adaptive performance stops at level 2. */
    function topLevel() {
        var s = dms();
        return s && s.adaptivePerfRes === true ? 3 : 2;
    }

    function configChanged() {
        var s = dms();
        if (!s) return;
        /* resolution no longer allowed while at level 3: back to level 2 and full resolution now */
        if (ctl.level > topLevel()) { ctl.level = topLevel(); applyLevel(true); }
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
        /* an event for the diagnostics list (packet gaps from the freeze detector); nothing
         * is kept while measuring is off */
        event: function (type, dur, info) { pushEvent(cleanText(type, 30), +dur || 0, info); },
        events: function () { return events.list(); },
        /* freezes with their breakdown and attribution line; long animation frames (cleaned) */
        freezes: attributed,
        loafs: function () { return loafs.list(); },
        /* for tests: the timing scopes (window._lmScope while attribution is on) */
        _scopes: sc,
        hostOf: hostOf,
        keepRecording: function (on) { keepRec = !!on; wantMeasuring(); },
        history: readHistory,
        /* for tests: force a level as if measured */
        _setLevel: function (l) {
            ctl.level = Math.max(0, Math.min(MAX_LEVEL, l | 0));
            applyLevel(true);
        }
    };

    configChanged();
})();
