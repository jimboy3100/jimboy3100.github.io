/* Legend Mod Gamepad window: stick / zoom / trigger tuning and a live controller test with dead
 * zone calibration (the buttons are bound in the Hotkeys window, like keys and mouse buttons).
 * Loaded by ogario/gamepad.js (LMGamepad.openWindow) the first time the window opens; it only
 * shows and edits what LMGamepad keeps.
 * While the window is open the pad's buttons are only shown here, not used in the game.
 * Sized for a 915x412 phone screen: the body scrolls, the cross and a tap outside close it.
 */
(function () {
    'use strict';
    if (window._lmGamepadUILoaded) return;
    window._lmGamepadUILoaded = true;

    /* texts: developers/i18n/src (modules.gamepadui.*); vars: { l: .., r: .. } for {l} {r} */
    var P = 'modules.gamepadui.';
    function t(k, vars) { return typeof window.lmT === 'function' ? window.lmT(P + k, vars) : k; }
    /* button names: the letters printed on a pad stay, the D-pad directions are translated */
    var DPAD = { 'D-pad up': 'dpadUp', 'D-pad down': 'dpadDown', 'D-pad left': 'dpadLeft', 'D-pad right': 'dpadRight' };
    function buttonTitle(name) { return Object.prototype.hasOwnProperty.call(DPAD, name) ? t('dpad', [t(DPAD[name])]) : name; }
    function buttonChip(name) { return Object.prototype.hasOwnProperty.call(DPAD, name) ? '\u271a ' + t(DPAD[name]) : name; }
    function setDir(e) {
        try { if (e && window.LMi18n && window.LMi18n.dir) e.setAttribute('dir', window.LMi18n.dir()); } catch (er) { }
    }

    var MEASURE_MS = 2000;
    var SLIDERS = [
        ['gamepadDeadzone', 0.05, 0.5, 0.01],
        ['gamepadMoveRange', 0.15, 1, 0.01],
        ['gamepadMoveCurve', 0.5, 3, 0.1],
        ['gamepadZoomSens', 0.2, 4, 0.1],
        ['gamepadTrigger', 0.1, 0.95, 0.05]
    ];

    var modal = null, backdrop = null, body = null, tabsEl = null, msgEl = null;
    var tab = 'tuning';
    var raf = 0;
    var live = null;       // elements the live loop updates on the current tab
    var testPad = -1;      // pad index shown on the Test tab
    var measure = null;    // { until, left, right } while measuring drift

    function G() {
        return window.LMGamepad || null;
    }

    /* colors() gives CSS (var(--lm-x, current) so the open window follows a theme change);
     * colors(true) gives the resolved colours for the stick canvas */
    function colors(raw) {
        var ds = typeof defaultSettings !== 'undefined' && defaultSettings ? defaultSettings : {};
        var r = {
            mc: ds.menuMainColor || '#01d9cc', pc: ds.menuPanelColor || '#00243e', pc2: ds.menuPanelColor2 || '#002f52',
            tc: ds.menuTextColor || '#ffffff', tc2: ds.menuTextColor2 || '#8096a7'
        };
        if (raw) return r;
        return { mc: 'var(--lm-mc,' + r.mc + ')', pc: 'var(--lm-pc,' + r.pc + ')', pc2: 'var(--lm-pc2,' + r.pc2 + ')', tc: 'var(--lm-tc,' + r.tc + ')', tc2: 'var(--lm-tc2,' + r.tc2 + ')' };
    }

    function el(tag, css, text) {
        var e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function btn(text, cls) {
        var b = el('button', '', text);
        b.type = 'button';
        b.className = 'btn btn-sm ' + (cls || 'btn-primary');
        return b;
    }

    function round2(v) {
        return Math.round(v * 100) / 100;
    }

    function note(text) {
        if (!msgEl) return;
        msgEl.textContent = text || '';
        msgEl.style.display = text ? '' : 'none';
    }

    function addStyle(c) {
        /* the shared window look (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        if (document.getElementById('lm-gp-style')) return;
        var s = document.createElement('style');
        s.id = 'lm-gp-style';
        s.textContent =
            // i18n-ok: CSS
            '#lm-gp-modal select,#lm-gp-modal input[type=text]{background:var(--lm-w-field,' + c.pc2 + ');color:' + c.tc + ';border:1px solid ' + c.pc2 + ';border-radius:var(--lm-radius-s,4px);height:var(--lm-w-ctl,30px);font-size:var(--lm-w-fs,12px);padding:0 6px;min-width:0;}' +
            '#lm-gp-modal input[type=range]{width:100%;height:28px;margin:0;}' +
            '#lm-gp-modal .btn{min-height:var(--lm-w-ctl,30px);font-size:var(--lm-w-fs,12px);}' +
            '#lm-gp-modal label{font-weight:400;margin:0;}' +
            '#lm-gp-modal .lm-gp-chip{flex:none;min-width:62px;box-sizing:border-box;padding:0 6px;height:26px;line-height:26px;border-radius:var(--lm-radius-s,4px);text-align:center;font-size:var(--lm-w-fs-s,11px);font-weight:700;background:var(--lm-w-btn-h,rgba(255,255,255,0.08));transition:background .05s;}' +
            // i18n-ok: CSS
            '#lm-gp-modal .lm-gp-chip.on{background:' + c.mc + ';color:' + c.pc + ';}';
        document.head.appendChild(s);
    }

    function buildTuning(c) {
        var g = G();
        var o = g.getOpts();
        var wrap = el('div');
        var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:4px 16px;');
        SLIDERS.forEach(function (d) {
            var k = d[0];
            var box = el('div', 'min-width:0;');
            var top = el('div', 'display:flex;justify-content:space-between;gap:8px;font-size:12px;');
            top.appendChild(el('span', 'overflow:hidden;text-overflow:ellipsis;', t(k)));
            var val = el('span', 'color:' + c.mc + ';font-weight:700;', String(o[k]));
            val.id = 'lm-gp-val-' + k;
            top.appendChild(val);
            var r = document.createElement('input');
            r.type = 'range';
            r.id = 'lm-gp-' + k;
            r.min = d[1];
            r.max = d[2];
            r.step = d[3];
            r.value = o[k];
            /* live while dragging, saved on release */
            r.addEventListener('input', function () {
                var v = parseFloat(r.value);
                val.textContent = String(v);
                if (window.legendmod5) window.legendmod5[k] = v;
            });
            r.addEventListener('change', function () {
                var p = {};
                p[k] = parseFloat(r.value);
                g.setOpts(p);
            });
            box.appendChild(top);
            box.appendChild(r);
            grid.appendChild(box);
        });
        wrap.appendChild(grid);
        var foot = el('div', 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;');
        var reset = btn(t('resetTuning'), 'btn-warning');
        reset.id = 'lm-gp-reset-tuning';
        reset.addEventListener('click', function () { g.resetOpts(); show('tuning'); });
        foot.appendChild(reset);
        wrap.appendChild(foot);
        live = null;
        return wrap;
    }

    function stickBox(c, title, id) {
        var box = el('div', 'display:flex;flex-direction:column;align-items:center;gap:2px;');
        box.appendChild(el('div', 'font-size:11px;color:' + c.tc2 + ';', title));
        var cv = document.createElement('canvas');
        cv.width = 96;
        cv.height = 96;
        cv.id = id;
        cv.style.cssText = 'width:96px;height:96px;';
        box.appendChild(cv);
        var v = el('div', 'font-size:11px;font-family:monospace;', '0.00, 0.00');
        v.setAttribute('dir', 'ltr');
        box.appendChild(v);
        return { box: box, cv: cv, val: v };
    }

    function drawStick(s, x, y, dz, c) {
        var ctx = s.cv.getContext && s.cv.getContext('2d');
        if (!ctx) return;
        var r = 44, cx = 48, cy = 48;
        ctx.clearRect(0, 0, 96, 96);
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.arc(cx, cy, r * dz, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
        var m = Math.sqrt(x * x + y * y);
        ctx.fillStyle = m > dz ? c.mc : c.tc2;
        ctx.beginPath(); ctx.arc(cx + Math.max(-1, Math.min(1, x)) * r, cy + Math.max(-1, Math.min(1, y)) * r, 6, 0, Math.PI * 2); ctx.fill();
        s.val.textContent = (x < 0 ? '' : ' ') + x.toFixed(2) + ', ' + (y < 0 ? '' : ' ') + y.toFixed(2);
    }

    function buildTest(c) {
        var g = G();
        var wrap = el('div');
        var info = el('div', 'font-size:12px;margin-bottom:6px;');
        info.id = 'lm-gp-pads';
        wrap.appendChild(info);
        var chipRow = el('div', 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;');
        var chips = [];
        g.BUTTON_NAMES.forEach(function (name) {
            var chip = el('div', '', buttonChip(name));
            chip.className = 'lm-gp-chip';
            chip.title = buttonTitle(name);
            chips.push(chip);
            chipRow.appendChild(chip);
        });
        wrap.appendChild(chipRow);
        var sticks = el('div', 'display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px;');
        var ls = stickBox(c, t('leftStick'), 'lm-gp-stick-l');
        var rs = stickBox(c, t('rightStick'), 'lm-gp-stick-r');
        sticks.appendChild(ls.box);
        sticks.appendChild(rs.box);
        var cal = el('div', 'flex:1;min-width:220px;display:flex;flex-direction:column;gap:6px;');
        var mb = btn(t('measure'), 'btn-primary');
        mb.id = 'lm-gp-measure';
        var res = el('div', 'font-size:12px;');
        res.id = 'lm-gp-drift';
        var use = btn('', 'btn-success');
        use.id = 'lm-gp-use-deadzone';
        use.style.display = 'none';
        mb.addEventListener('click', function () {
            if (!g.pads().length) { res.textContent = t('noPad'); return; }
            measure = { until: Date.now() + MEASURE_MS, left: 0, right: 0 };
            use.style.display = 'none';
            res.textContent = t('measuring');
        });
        use.addEventListener('click', function () {
            var v = Number(use.getAttribute('data-v'));
            if (!(v > 0)) return;
            g.setOpts({ gamepadDeadzone: v });
            note(t('deadzoneSet', { s: v }));
        });
        cal.appendChild(mb);
        cal.appendChild(res);
        cal.appendChild(use);
        cal.appendChild(el('div', 'font-size:11px;color:' + c.tc2 + ';', t('paused')));
        sticks.appendChild(cal);
        wrap.appendChild(sticks);
        live = { chips: chips, info: info, ls: ls, rs: rs, res: res, use: use, padsKey: null };
        return wrap;
    }

    /* pads line on the Test tab, rebuilt only when the connected pads change */
    function padsInfo(c, list) {
        var g = G();
        var key = list.map(function (p) { return p.index + ':' + p.id; }).join('|');
        if (live.padsKey === key) return;
        live.padsKey = key;
        var info = live.info;
        while (info.firstChild) info.removeChild(info.firstChild);
        if (!list.length) { info.appendChild(el('div', 'color:' + c.tc2 + ';', t('noPad'))); return; }
        if (!list.some(function (p) { return p.index === testPad; })) testPad = list[0].index;
        list.forEach(function (p) {
            var row = el('label', 'display:flex;align-items:center;gap:6px;cursor:pointer;min-height:24px;');
            if (list.length > 1) {
                var rb = document.createElement('input');
                rb.type = 'radio';
                rb.name = 'lm-gp-pad';
                rb.checked = p.index === testPad;
                rb.addEventListener('change', function () { if (rb.checked) testPad = p.index; });
                row.appendChild(rb);
            }
            row.appendChild(el('span', 'color:' + c.mc + ';font-weight:700;flex:none;', t('pad', [p.index + 1])));
            row.appendChild(el('span', 'min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', String(p.id || '').slice(0, 120)));
            row.appendChild(el('span', 'flex:none;font-size:11px;color:' + c.tc2 + ';',
                (p.mapping === 'standard' ? t('standard') : t('otherMapping'))));
            info.appendChild(row);
        });
    }

    function tick() {
        raf = 0;
        if (!modal) return;
        var g = G();
        var c = colors();
        var list = g ? g.pads() : [];
        if (live && live.chips) {
            var down = {};
            list.forEach(function (p) {
                if (live.info && p.index !== testPad && list.length > 1) return;
                var b = p.buttons || [];
                for (var i = 0; i < live.chips.length; i++) if (g.buttonDown(b[i], i)) down[i] = true;
            });
            for (var j = 0; j < live.chips.length; j++) {
                var on = !!down[j];
                if (live.chips[j]._on !== on) { live.chips[j]._on = on; live.chips[j].className = 'lm-gp-chip' + (on ? ' on' : ''); }
            }
        }
        if (live && live.info) {
            padsInfo(c, list);
            var pad = null;
            for (var k = 0; k < list.length; k++) if (list[k].index === testPad) pad = list[k];
            var a = pad && pad.axes ? pad.axes : [];
            var ax = function (i) { var v = Number(a[i]); return isFinite(v) ? v : 0; };
            var dz = g.getOpts().gamepadDeadzone;
            var cr = colors(true);
            drawStick(live.ls, ax(0), ax(1), dz, cr);
            drawStick(live.rs, ax(2), ax(3), dz, cr);
            /* LT / RT pull on their chips */
            [6, 7].forEach(function (i) {
                var b = pad && pad.buttons && pad.buttons[i];
                var v = b && typeof b.value === 'number' ? b.value : 0;
                var txt = g.BUTTON_NAMES[i] + (v > 0 && v < 1 ? ' ' + v.toFixed(2) : '');
                if (live.chips[i].textContent !== txt) live.chips[i].textContent = txt;
            });
            if (measure) {
                if (pad) {
                    measure.left = Math.max(measure.left, Math.sqrt(ax(0) * ax(0) + ax(1) * ax(1)));
                    measure.right = Math.max(measure.right, Math.sqrt(ax(2) * ax(2) + ax(3) * ax(3)));
                }
                if (Date.now() >= measure.until) {
                    var sug = g.suggestDeadzone(Math.max(measure.left, measure.right));
                    live.res.textContent = t('drift', { l: round2(measure.left).toFixed(2), r: round2(measure.right).toFixed(2), s: sug.toFixed(2) });
                    live.use.textContent = t('use', { s: sug.toFixed(2) });
                    live.use.setAttribute('data-v', String(sug));
                    live.use.style.display = '';
                    measure = null;
                }
            }
        }
        raf = requestAnimationFrame(tick);
    }

    function show(name) {
        if (!modal) return;
        tab = name;
        measure = null;
        var c = colors();
        for (var i = 0; i < tabsEl.children.length; i++) {
            var b = tabsEl.children[i];
            var on = b.getAttribute('data-tab') === name;
            b.style.background = on ? c.mc : 'rgba(255,255,255,0.05)';
            b.style.color = on ? c.pc : c.tc2;
            b.style.fontWeight = on ? '700' : '400';
        }
        note('');
        while (body.firstChild) body.removeChild(body.firstChild);
        live = null;
        var f = name === 'test' ? buildTest : buildTuning;
        body.appendChild(f(c));
    }

    function onKey(e) {
        if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); e.stopPropagation(); close(); }
    }

    function close() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        measure = null;
        live = null;
        window.removeEventListener('keydown', onKey, true);
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        modal = backdrop = body = tabsEl = msgEl = null;
        var g = G();
        if (g) g.setSuspended(false);
    }

    function open() {
        var g = G();
        if (!g) return;
        if (modal) close();
        var c = colors();
        addStyle(c);
        g.setSuspended(true);
        /* a tap outside the window closes it */
        backdrop = el('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999994;background:rgba(0,0,0,0.55);');
        backdrop.id = 'lm-gp-backdrop';
        backdrop.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); });
        modal = el('div', 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:720px;max-width:calc(100vw - 16px);' +
            'height:auto;max-height:calc(100vh - 16px);display:flex;flex-direction:column;box-sizing:border-box;z-index:999995;' +
            'background:var(--lm-w-bg,' + c.pc + ');border:1px solid ' + c.pc2 + ';border-top:3px solid ' + c.mc + ';border-radius:var(--lm-radius,6px);' +
            'box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + c.tc + ';font-family:inherit;font-size:var(--lm-w-fs,12px);overflow:hidden;text-align:left;');
        modal.id = 'lm-gp-modal';
        modal.classList.add('lm-modal-container', 'lm-w');
        setDir(modal);
        var head = el('div', 'flex:none;display:flex;align-items:center;gap:8px;padding:var(--lm-w-hpad,6px 8px 6px 12px);border-bottom:1px solid ' + c.pc2 + ';background:var(--lm-w-head,linear-gradient(180deg,' + c.pc2 + ' 0%,' + c.pc + ' 100%));');
        head.appendChild(el('div', 'font-size:var(--lm-w-title,15px);font-weight:700;color:' + c.mc + ';letter-spacing:1px;text-transform:uppercase;flex:none;', '\ud83c\udfae ' + t('title')));
        tabsEl = el('div', 'flex:1;min-width:0;display:flex;align-items:center;gap:4px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;');
        [['tuning', t('tabTuning')], ['test', t('tabTest')]].forEach(function (d) {
            var b = el('div', 'flex:none;cursor:pointer;font-size:var(--lm-w-fs,12px);padding:0 10px;height:var(--lm-w-ctl,30px);line-height:var(--lm-w-ctl,30px);border-radius:var(--lm-radius-s,4px);border:1px solid ' + c.pc2 + ';', d[1]);
            b.id = 'lm-gp-tab-' + d[0];
            b.setAttribute('data-tab', d[0]);
            b.addEventListener('click', function (e) { e.stopPropagation(); show(d[0]); });
            tabsEl.appendChild(b);
        });
        head.appendChild(tabsEl);
        var x = el('div', 'flex:none;cursor:pointer;font-size:18px;color:' + c.tc2 + ';width:var(--lm-w-x,34px);height:var(--lm-w-x,34px);display:flex;align-items:center;justify-content:center;border-radius:var(--lm-radius-s,4px);background:var(--lm-w-btn,rgba(255,255,255,0.06));', '\u2715');
        x.id = 'lm-gp-close';
        x.title = t('close');
        x.setAttribute('role', 'button');
        x.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); });
        head.appendChild(x);
        modal.appendChild(head);
        msgEl = el('div', 'flex:none;padding:4px 12px;font-size:12px;color:' + c.mc + ';border-bottom:1px solid ' + c.pc2 + ';');
        msgEl.id = 'lm-gp-msg';
        msgEl.style.display = 'none';
        modal.appendChild(msgEl);
        body = el('div', 'flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:var(--lm-w-pad,8px 12px 12px);');
        modal.appendChild(body);
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        window.addEventListener('keydown', onKey, true);
        show(tab);
        raf = requestAnimationFrame(tick);
    }

    /* a language change while the window is open: build it again on the same tab */
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function () { if (modal) open(); });

    window.LMGamepadUI = {
        open: open,
        close: close,
        isOpen: function () { return !!modal; },
        show: function (name) { if (modal) show(name); }
    };
})();
