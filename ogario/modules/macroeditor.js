/* Legend Mod custom macros (loaded the first time the editor opens or a custom macro hotkey is
 * pressed; also at start when macros are saved). Three slots, each a short sequence of the
 * existing actions: split, feed, wait N ms, move to the mouse. Actions go through the same
 * functions as the split and feed hotkeys (application.split / application.feed / sendPosition)
 * and are never closer together than the existing macros allow (20 ms between splits, like the
 * lowest "Macro split delay", 10 ms between feeds, like permanent macro feed). A dry run plays
 * the timeline without sending anything. Hotkeys "Custom macro 1-3" have no default key.
 */
(function () {
    'use strict';
    var W = window, D = document;
    if (W._lmMacroEditorLoaded) return;
    W._lmMacroEditorLoaded = true;

    var KEY = 'lmCustomMacros';
    var LIMITS = {
        slots: 3,
        maxSteps: 24,
        maxRepeat: 8,       /* "split x4" = four splits, each at least gapSplit apart */
        maxWait: 2000,
        maxTotal: 5000,     /* the whole sequence ends within 5 s */
        maxEvents: 48,      /* splits + feeds + mouse moves sent by one run */
        gapSplit: 20,       /* ms, the lowest "Macro split delay" slider value */
        gapFeed: 10,        /* ms, the fastest permanent macro feed */
        nameLen: 24
    };
    var ACTIONS = ['split', 'feed', 'wait', 'mouse'];

    /* === Pure helpers (unit tested in developers/tests/skinmacro.js) === */

    function int(v, a, b, d) {
        v = Math.round(Number(v));
        if (!isFinite(v)) v = d;
        return v < a ? a : v > b ? b : v;
    }
    function cleanName(n, i) {
        var s = String(n == null ? '' : n).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, LIMITS.nameLen);
        /* the default name is stored with the macro, in the language of that moment */
        return s || t('defaultName', i + 1);
    }
    function cleanStep(s) {
        if (!s || typeof s !== 'object' || ACTIONS.indexOf(s.a) < 0) return null;
        if (s.a === 'wait') return { a: 'wait', ms: int(s.ms, LIMITS.gapFeed, LIMITS.maxWait, 100) };
        if (s.a === 'mouse') return { a: 'mouse' };
        return { a: s.a, n: int(s.n, 1, LIMITS.maxRepeat, 1) };
    }
    function cleanMacro(m, i) {
        m = m && typeof m === 'object' ? m : {};
        var steps = Array.isArray(m.steps) ? m.steps : [];
        var out = [];
        for (var k = 0; k < steps.length && out.length < LIMITS.maxSteps; k++) {
            var st = cleanStep(steps[k]);
            if (st) out.push(st);
        }
        return { name: cleanName(m.name, i || 0), steps: out };
    }
    function cleanData(raw) {
        var o = raw;
        if (typeof raw === 'string') { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        var slots = o && typeof o === 'object' && Array.isArray(o.slots) ? o.slots : [];
        var res = { v: 1, slots: [] };
        for (var i = 0; i < LIMITS.slots; i++) res.slots.push(cleanMacro(slots[i], i));
        return res;
    }
    function minGap(prev, next) {
        if (!prev) return 0;
        return (prev === 'split' || next === 'split') ? LIMITS.gapSplit : LIMITS.gapFeed;
    }
    /* Times of every action of a sequence. An action that comes sooner than the minimum gap
     * after the previous one is moved later ("moved" counts them); actions after 5 s or past
     * the event limit are dropped. */
    function compile(steps) {
        var events = [], tm = 0, last = null, lastAt = 0, moved = 0, dropped = 0;
        var list = cleanMacro({ steps: steps }).steps;
        for (var i = 0; i < list.length; i++) {
            var s = list[i];
            if (s.a === 'wait') { tm += s.ms; continue; }
            var reps = s.a === 'mouse' ? 1 : s.n;
            for (var r = 0; r < reps; r++) {
                var at = Math.max(tm, last ? lastAt + minGap(last, s.a) : 0);
                if (at > LIMITS.maxTotal || events.length >= LIMITS.maxEvents) { dropped++; continue; }
                /* repeats of one step are spaced by design: only a step's first action counts */
                if (at > tm && r === 0) moved++;
                events.push({ t: at, a: s.a, i: i });
                last = s.a; lastAt = at; tm = at;
            }
        }
        var total = Math.min(Math.max(tm, lastAt), LIMITS.maxTotal);
        return { events: events, total: total, moved: moved, dropped: dropped };
    }
    var core = { LIMITS: LIMITS, ACTIONS: ACTIONS, cleanStep: cleanStep, cleanMacro: cleanMacro, cleanData: cleanData, compile: compile, minGap: minGap, KEY: KEY };

    /* === Text: developers/i18n/src (modules.macroeditor.*); t('key', a, b) fills {0} {1} === */

    var P = 'modules.macroeditor.';
    function t(k) {
        var v = Array.prototype.slice.call(arguments, 1);
        return typeof W.lmT === 'function' ? W.lmT(P + k, v.length ? v : undefined) : k;
    }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
    function toast(kind, text) { try { if (W.toastr) W.toastr[kind](esc(text)); } catch (e) { } }

    /* === Storage === */

    var data = load();
    function load() { try { return cleanData(W.localStorage.getItem(KEY)); } catch (e) { return cleanData(null); } }
    function save() {
        data = cleanData(data);
        try {
            var any = data.slots.some(function (m) { return m.steps.length; });
            if (any) W.localStorage.setItem(KEY, JSON.stringify(data));
            else W.localStorage.removeItem(KEY);
            return true;
        } catch (e) { toast('warning', t('saveFail')); return false; }
    }

    /* === Running (the same send functions as the split / feed hotkeys) === */

    var running = null;
    function activeUnit() {
        var n = W.multiboxPlayerEnabled;
        if (n && typeof W.getActiveSpect === 'function') { var sp = W.getActiveSpect(n); if (sp) return sp; }
        return W.legendmod || null;
    }
    function nowMs() { try { return W.performance.now(); } catch (e) { return Date.now(); } }
    /* What the macro was started for: the unit you control, its connection (the socket object
     * itself, so a reconnect or a server switch with the same unit number is noticed), whether it
     * is alive and which life (the main player's spawn time), and the practice / replay state.
     * Any change stops the rest of the macro. */
    function context() {
        var n = W.multiboxPlayerEnabled || 0, u = activeUnit();
        var sp = n && u && u !== W.legendmod, app = W.application;
        return {
            n: n, u: u, sock: u ? u.socket || null : null,
            alive: !!(u && (sp ? u.active : u.play)),
            life: sp ? 0 : (app && app._lmLifeStartAt) || 0,
            practice: !!(W.LMPractice && W.LMPractice.on),
            replay: !!W._lmEvReplayOn
        };
    }
    function sameContext(a) {
        var b = context();
        return b.alive && b.n === a.n && b.u === a.u && b.sock === a.sock && b.life === a.life && b.practice === a.practice && !b.replay;
    }
    function hidden() { try { return !!(D.hidden || D.visibilityState === 'hidden'); } catch (e) { return false; } }
    function exec(a) {
        var app = W.application;
        try {
            if (a === 'split') { if (app && app.split) app.split(); }
            else if (a === 'feed') { if (app && app.feed) app.feed(); }
            else if (a === 'mouse') { var u = activeUnit(); if (u && typeof u.sendPosition === 'function') u.sendPosition(); }
        } catch (e) { }
    }
    /* the tab losing focus, a death, a spawn, a server switch or a replay starting / stopping
     * stop a running macro at once (the checks before each action catch the rest) */
    var STOP_EVENTS = ['death', 'spawn', 'serverChange', 'replayStart', 'replayStop'];
    function onStopEvent() { stopRun(); }
    function onVisibility() { if (hidden()) stopRun(); }
    function listen(on) {
        var ev = W.LMEvents, i;
        try {
            if (ev && typeof ev.on === 'function') for (i = 0; i < STOP_EVENTS.length; i++) ev[on ? 'on' : 'off'](STOP_EVENTS[i], onStopEvent);
            if (typeof W.addEventListener === 'function') W[on ? 'addEventListener' : 'removeEventListener']('blur', onStopEvent);
            if (typeof D.addEventListener === 'function') D[on ? 'addEventListener' : 'removeEventListener']('visibilitychange', onVisibility);
        } catch (e) { }
    }
    function stopRun() {
        if (!running) return;
        clearTimeout(running.timer);
        running = null;
        listen(false);
    }
    /* One custom macro at a time: a press while one runs is ignored, so two runs can never
     * interleave and send faster than the gaps above. Actions are sent one after another: each
     * waits its planned distance after the previous action was really sent, so a stalled page
     * delays the rest instead of sending the overdue actions together. */
    function runSlot(n) {
        n = int(n, 1, LIMITS.slots, 1);
        if (running) return false;
        var m = data.slots[n - 1];
        if (!m || !m.steps.length) { toast('info', t('noSteps', n)); return false; }
        var plan = compile(m.steps), evs = plan.events;
        if (!evs.length) return false;
        var ctx = context();
        /* nothing to control: dead, in the menu, watching a replay or the tab in the background */
        if (!ctx.u || !ctx.alive || ctx.replay || hidden()) return false;
        var run = { slot: n, timer: 0, ctx: ctx, start: nowMs(), lastAt: 0, i: 0 };
        running = run;
        listen(true);
        var next = function () {
            if (running !== run) return;
            if (run.i >= evs.length) { running = null; listen(false); return; }
            var ev = evs[run.i], now = nowMs();
            /* the planned distance to the previous action, counted from when it was really sent */
            var due = (run.i ? run.lastAt : run.start) + ev.t - (run.i ? evs[run.i - 1].t : 0);
            if (due - now > 0) { run.timer = setTimeout(next, due - now); return; }
            /* a stall that pushed the macro far past its length: its timing means nothing now */
            if (now - run.start > LIMITS.maxTotal + 1000 || !sameContext(run.ctx)) { stopRun(); return; }
            exec(ev.a);
            run.lastAt = nowMs(); run.i++;
            /* free the slot only after the last action plus the split gap */
            run.timer = setTimeout(next, run.i < evs.length ? evs[run.i].t - ev.t : LIMITS.gapSplit);
        };
        next();
        return true;
    }

    /* === Editor window === */

    var root = null, panel = null, slot = 0, listEl = null, nameIn = null, tlEl = null, infoEl = null, keyEl = null;
    var testBtn = null, clearBtn = null, clearArm = 0, dryRun = null, slotBtns = [];

    function isOpen() { return !!(root && root.parentNode); }
    function injectStyle() {
        if (D.getElementById('lm-me-css')) return;
        var s = D.createElement('style');
        s.id = 'lm-me-css';
        /* window chrome follows the menu theme (--lm-* from ogario.v4.js, the old colours as
         * fallbacks); the split / feed / mouse colours are the timeline legend and stay fixed */
        s.textContent =
            '#lm-me{position:fixed;left:0;top:0;right:0;bottom:0;z-index:999992;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:13px;line-height:1.35;color:var(--lm-tc,#eee)}' +
            '#lm-me-p{width:min(640px,calc(100vw - 12px));max-height:calc(100vh - 12px);box-sizing:border-box;display:flex;flex-direction:column;background:var(--lm-pc,#00243e);border:1px solid var(--lm-pc2,#002f52);border-top:3px solid var(--lm-mc,#01d9cc);border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden}' +
            '#lm-me-p .lm-me-h{display:flex;align-items:center;gap:4px;padding:6px 8px;border-bottom:1px solid var(--lm-pc2,#002f52);background:linear-gradient(180deg,var(--lm-pc2,#002f52) 0%,var(--lm-pc,#00243e) 100%)}' +
            '#lm-me-p .lm-me-t{flex:1;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--lm-mc,#01d9cc);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-me-p .lm-me-body{overflow-y:auto;padding:6px;-webkit-overflow-scrolling:touch;min-height:0;display:flex;flex-direction:column;gap:6px}' +
            '#lm-me-p .lm-me-body>*{flex:none}' +
            '#lm-me-p .lm-me-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px}' +
            '#lm-me-p input[type=text],#lm-me-p input[type=number],#lm-me-p select{background:rgba(0,0,0,.25);color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,#002f52);border-radius:var(--lm-radius-s,4px);height:30px;padding:0 6px;font:inherit;min-width:0;outline:none}' +
            '#lm-me-p input[type=text]:focus,#lm-me-p input[type=number]:focus,#lm-me-p select:focus{border-color:var(--lm-mc,#01d9cc)}' +
            '#lm-me-p input[type=text]{flex:1;min-width:120px}#lm-me-p input[type=number]{width:72px}' +
            '#lm-me-p .lm-me-b{background:rgba(255,255,255,.05);color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,#002f52);border-radius:var(--lm-radius-s,4px);min-width:30px;min-height:30px;padding:0 8px;font:inherit;cursor:pointer;touch-action:manipulation}' +
            '#lm-me-p .lm-me-b:hover{background:rgba(255,255,255,.12)}#lm-me-p .lm-me-b[disabled]{opacity:.4;cursor:not-allowed}' +
            '#lm-me-p .lm-me-b.on{border-color:var(--lm-mc,#01d9cc);color:var(--lm-mc,#01d9cc)}#lm-me-p .lm-me-b.go{border-color:#3c9e5a;background:rgba(60,158,90,.35)}#lm-me-p .lm-me-b.warn{border-color:#c0504d}' +
            '#lm-me-p .lm-me-x{min-width:36px;min-height:36px;font-size:18px;line-height:1;padding:0;color:var(--lm-tc2,#8096a7);border-color:transparent}' +
            '#lm-me-p .lm-me-s{display:flex;align-items:center;gap:4px;padding:2px 3px;border-radius:var(--lm-radius-s,3px);background:rgba(255,255,255,.04)}' +
            '#lm-me-p .lm-me-s.hit{background:rgba(255,210,0,.18)}' +
            '#lm-me-p .lm-me-s .ix{width:22px;text-align:right;opacity:.6;font-size:11px}' +
            '#lm-me-p .lm-me-s .nm{flex:1;min-width:70px}' +
            '#lm-me-p .lm-me-s .lm-me-b{width:30px;padding:0;flex:none}' +
            '#lm-me-p .lm-me-note{font-size:11px;color:var(--lm-tc2,#8096a7)}' +
            '#lm-me-p .lm-me-tl{position:relative;height:34px;border-radius:var(--lm-radius-s,4px);background:rgba(0,0,0,.25);border:1px solid var(--lm-pc2,#002f52);overflow:hidden}' +
            '#lm-me-p .lm-me-ev{position:absolute;top:4px;width:4px;height:24px;margin-left:-2px;border-radius:2px;opacity:.8}' +
            '#lm-me-p .lm-me-ev.split{background:#01d9cc}#lm-me-p .lm-me-ev.feed{background:#ffd200;top:10px;height:18px}#lm-me-p .lm-me-ev.mouse{background:#e0605c;top:14px;height:14px}' +
            '#lm-me-p .lm-me-ev.done{opacity:1;box-shadow:0 0 6px #fff}' +
            '#lm-me-p .lm-me-ph{position:absolute;top:0;bottom:0;width:2px;background:#fff;display:none}' +
            '#lm-me-p .lm-me-lg{font-size:11px;opacity:.8}#lm-me-p .lm-me-lg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin:0 3px 0 8px;vertical-align:-1px}' +
            '@media (pointer:coarse){#lm-me-p .lm-me-b{min-height:36px;min-width:36px}#lm-me-p .lm-me-s .lm-me-b{width:36px}}';
        (D.head || D.documentElement).appendChild(s);
    }
    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function btn(text, title, fn, cls) {
        var b = mk('button', 'lm-me-b' + (cls ? ' ' + cls : ''), text);
        b.type = 'button';
        if (title) { b.title = title; b.setAttribute('aria-label', title); }
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
        return b;
    }
    function cur() { return data.slots[slot]; }
    function changed() { save(); renderSteps(); renderTimeline(); }
    function boundKey(n) {
        var hk = W.hotkeys, id = 'hk-customMacro' + n;
        if (!hk || typeof hk !== 'object') return '';
        for (var k in hk) if (Object.prototype.hasOwnProperty.call(hk, k) && hk[k] === id) return k;
        return '';
    }
    function addStep(a) {
        var m = cur();
        if (m.steps.length >= LIMITS.maxSteps) { toast('info', t('full', LIMITS.maxSteps)); return; }
        m.steps.push(cleanStep(a === 'wait' ? { a: a, ms: 100 } : { a: a, n: 1 }));
        changed();
    }
    function renderSteps() {
        if (!listEl) return;
        listEl.textContent = '';
        var m = cur();
        if (nameIn && D.activeElement !== nameIn) nameIn.value = m.name;
        if (!m.steps.length) listEl.appendChild(mk('div', 'lm-me-note', t('empty')));
        m.steps.forEach(function (s, i) {
            var row = mk('div', 'lm-me-s');
            row.setAttribute('data-i', String(i));
            row.appendChild(mk('span', 'ix', String(i + 1)));
            var sel = D.createElement('select');
            sel.className = 'nm';
            sel.setAttribute('aria-label', t('action'));
            ACTIONS.forEach(function (a) {
                var o = D.createElement('option');
                o.value = a; o.textContent = t(a);
                if (a === s.a) o.selected = true;
                sel.appendChild(o);
            });
            sel.addEventListener('change', function () {
                m.steps[i] = cleanStep(sel.value === 'wait' ? { a: 'wait', ms: s.ms || 100 } : { a: sel.value, n: s.n || 1 });
                changed();
            });
            row.appendChild(sel);
            if (s.a !== 'mouse') {
                var num = D.createElement('input');
                num.type = 'number';
                num.inputMode = 'numeric';
                var isWait = s.a === 'wait';
                num.min = String(isWait ? LIMITS.gapFeed : 1);
                num.max = String(isWait ? LIMITS.maxWait : LIMITS.maxRepeat);
                num.step = isWait ? '10' : '1';
                num.value = String(isWait ? s.ms : s.n);
                num.setAttribute('aria-label', isWait ? 'ms' : t('times'));
                num.addEventListener('keydown', function (e) { e.stopPropagation(); });
                num.addEventListener('change', function () {
                    m.steps[i] = cleanStep(isWait ? { a: 'wait', ms: num.value } : { a: s.a, n: num.value });
                    changed();
                });
                row.appendChild(num);
                row.appendChild(mk('span', 'lm-me-note', isWait ? 'ms' : t('times')));
            }
            var up = btn('\u2191', t('up'), function () { if (i > 0) { var x = m.steps[i - 1]; m.steps[i - 1] = m.steps[i]; m.steps[i] = x; changed(); } });
            var dn = btn('\u2193', t('down'), function () { if (i < m.steps.length - 1) { var x = m.steps[i + 1]; m.steps[i + 1] = m.steps[i]; m.steps[i] = x; changed(); } });
            up.disabled = i === 0; dn.disabled = i === m.steps.length - 1;
            row.appendChild(up); row.appendChild(dn);
            row.appendChild(btn('\u00d7', t('del'), function () { m.steps.splice(i, 1); changed(); }, 'warn'));
            listEl.appendChild(row);
        });
        slotBtns.forEach(function (b, i) { b.classList.toggle('on', i === slot); });
        if (keyEl) { var k = boundKey(slot + 1); keyEl.textContent = k ? t('key', k) : t('noKey', slot + 1); }
    }
    function renderTimeline() {
        if (!tlEl) return;
        stopDry();
        tlEl.textContent = '';
        var plan = compile(cur().steps), span = Math.max(plan.total, 100);
        plan.events.forEach(function (ev, k) {
            var m = mk('div', 'lm-me-ev ' + ev.a);
            m.style.left = (3 + 94 * ev.t / span) + '%';
            m.title = t('at', ev.t, t(ev.a));
            m.setAttribute('data-k', String(k));
            tlEl.appendChild(m);
        });
        var ph = mk('div', 'lm-me-ph');
        tlEl.appendChild(ph);
        if (infoEl) {
            var parts = [t('sum', plan.events.length, plan.total)];
            if (plan.moved) parts.push(t('movedN', plan.moved));
            if (plan.dropped) parts.push(t('droppedN', plan.dropped, LIMITS.maxTotal / 1000, LIMITS.maxEvents));
            infoEl.textContent = parts.join(' \u00b7 ');
        }
        if (testBtn) testBtn.disabled = !plan.events.length;
    }
    /* plays the timeline in real time; nothing is sent */
    function stopDry() {
        if (!dryRun) return;
        dryRun.stop = true;
        dryRun = null;
        if (testBtn) testBtn.textContent = t('test');
        if (!listEl) return;
        Array.prototype.forEach.call(listEl.querySelectorAll('.lm-me-s.hit'), function (r) { r.classList.remove('hit'); });
    }
    function startDry() {
        if (dryRun) { stopDry(); renderTimeline(); return; }
        renderTimeline();
        var plan = compile(cur().steps), span = Math.max(plan.total, 100);
        if (!plan.events.length || !tlEl) return;
        var ph = tlEl.querySelector('.lm-me-ph'), marks = tlEl.querySelectorAll('.lm-me-ev');
        var run = { stop: false, start: (W.performance ? performance.now() : Date.now()), k: 0 };
        dryRun = run;
        testBtn.textContent = t('stop');
        ph.style.display = 'block';
        var frame = function () {
            if (run.stop || !isOpen()) return;
            var el = (W.performance ? performance.now() : Date.now()) - run.start;
            ph.style.left = (3 + 94 * Math.min(el, span) / span) + '%';
            while (run.k < plan.events.length && plan.events[run.k].t <= el) {
                var ev = plan.events[run.k];
                if (marks[run.k]) marks[run.k].classList.add('done');
                var rows = listEl ? listEl.querySelectorAll('.lm-me-s') : [];
                Array.prototype.forEach.call(rows, function (r) { r.classList.toggle('hit', r.getAttribute('data-i') === String(ev.i)); });
                run.k++;
            }
            if (el >= span + 400) { stopDry(); return; }
            (W.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(frame);
        };
        frame();
    }
    function build() {
        injectStyle();
        root = mk('div');
        root.id = 'lm-me';
        root.addEventListener('pointerdown', function (e) { if (e.target === root) close(); });
        panel = mk('div');
        panel.id = 'lm-me-p';
        panel.className = 'lm-modal-container';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', t('title'));
        try { if (W.LMi18n && W.LMi18n.dir) panel.setAttribute('dir', W.LMi18n.dir()); } catch (e) { }
        var head = mk('div', 'lm-me-h');
        head.appendChild(mk('div', 'lm-me-t', t('title')));
        head.appendChild(btn('\u2715', t('close'), close, 'lm-me-x'));
        panel.appendChild(head);
        var body = mk('div', 'lm-me-body');

        var r1 = mk('div', 'lm-me-row');
        slotBtns = [];
        for (var i = 0; i < LIMITS.slots; i++) {
            (function (n) {
                var b = btn(t('slot', n + 1), t('slot', n + 1), function () { slot = n; clearArm = 0; if (clearBtn) clearBtn.textContent = t('clear'); renderSteps(); renderTimeline(); }, 'lm-me-slot');
                slotBtns.push(b);
                r1.appendChild(b);
            })(i);
        }
        nameIn = D.createElement('input');
        nameIn.type = 'text'; nameIn.id = 'lm-me-name'; nameIn.placeholder = t('namePh'); nameIn.maxLength = LIMITS.nameLen;
        nameIn.addEventListener('keydown', function (e) { e.stopPropagation(); });
        nameIn.addEventListener('change', function () { cur().name = cleanName(nameIn.value, slot); save(); nameIn.value = cur().name; });
        r1.appendChild(nameIn);
        body.appendChild(r1);
        keyEl = mk('div', 'lm-me-note');
        body.appendChild(keyEl);

        /* timeline and dry run first: on a phone they stay in view above a long step list */
        tlEl = mk('div', 'lm-me-tl');
        tlEl.setAttribute('dir', 'ltr');
        body.appendChild(tlEl);
        var lg = mk('div', 'lm-me-lg');
        [['split', '#01d9cc'], ['feed', '#ffd200'], ['mouse', '#e0605c']].forEach(function (p) {
            var sw = mk('i'); sw.style.background = p[1];
            lg.appendChild(sw); lg.appendChild(D.createTextNode(t(p[0])));
        });
        infoEl = mk('div', 'lm-me-note');
        body.appendChild(infoEl);

        var r3 = mk('div', 'lm-me-row');
        r3.appendChild(lg);
        testBtn = btn(t('test'), t('dry'), startDry, 'go lm-me-test');
        r3.appendChild(testBtn);
        clearBtn = btn(t('clear'), t('clear'), function () {
            var now = Date.now();
            if (now - clearArm > 3000) { clearArm = now; clearBtn.textContent = t('clearSure'); return; }
            clearArm = 0; clearBtn.textContent = t('clear');
            data.slots[slot] = cleanMacro(null, slot);
            changed();
        }, 'warn');
        r3.appendChild(clearBtn);
        r3.appendChild(mk('span', 'lm-me-note', t('dry')));
        body.appendChild(r3);

        listEl = mk('div', 'lm-me-list');
        listEl.style.cssText = 'display:flex;flex-direction:column;gap:3px';
        body.appendChild(listEl);

        var r2 = mk('div', 'lm-me-row');
        r2.appendChild(mk('span', 'lm-me-note', t('addTo')));
        ACTIONS.forEach(function (a) { r2.appendChild(btn('+ ' + t(a), t('addStep', t(a)), function () { addStep(a); }, 'lm-me-add-' + a)); });
        body.appendChild(r2);

        body.appendChild(mk('div', 'lm-me-note', t('limits', LIMITS.maxSteps, LIMITS.maxTotal / 1000, LIMITS.gapSplit, LIMITS.gapFeed)));
        panel.appendChild(body);
        root.appendChild(panel);
    }
    function onKey(e) {
        if (!isOpen()) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
    }
    function open(n) {
        if (n != null) slot = int(n, 1, LIMITS.slots, 1) - 1;
        if (!isOpen()) {
            data = load();
            build();
            D.body.appendChild(root);
            W.addEventListener('keydown', onKey, true);
        }
        renderSteps();
        renderTimeline();
        return true;
    }
    function close() {
        stopDry();
        if (!root) return;
        W.removeEventListener('keydown', onKey, true);
        if (root.parentNode) root.parentNode.removeChild(root);
        root = panel = listEl = nameIn = tlEl = infoEl = keyEl = testBtn = clearBtn = null;
        slotBtns = [];
    }
    function toggle() { if (isOpen()) close(); else open(); }
    /* a language change while the editor is open: build it again in the new language */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () {
        if (!isOpen()) return;
        var at = slot;
        close();
        open(at + 1);
    });
    function run(action, arg) {
        if (action === 'run') return runSlot(arg);
        if (action === 'close') return close();
        if (action === 'toggle') return toggle();
        if (action === 'load') return true;
        return open(arg);
    }

    W.LMMacroEditor = {
        core: core, open: open, close: close, toggle: toggle, isOpen: isOpen, run: run, runSlot: runSlot,
        isRunning: function () { return !!running; },
        stop: stopRun,
        macros: function () { return cleanData(data); },
        /* for scripts and tests: replace one slot (validated, saved) */
        setMacro: function (n, m) { n = int(n, 1, LIMITS.slots, 1); data.slots[n - 1] = cleanMacro(m, n - 1); var ok = save(); if (isOpen()) { renderSteps(); renderTimeline(); } return ok; }
    };
})();
