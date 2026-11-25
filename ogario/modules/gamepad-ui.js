/* Legend Mod Gamepad window: button map, stick / zoom / trigger tuning, named profiles and a live
 * controller test with dead zone calibration. Loaded by ogario/gamepad.js (LMGamepad.openWindow)
 * the first time the window opens; it only shows and edits what LMGamepad keeps.
 * While the window is open the pad's buttons are only shown here, not used in the game.
 * Sized for a 915x412 phone screen: the body scrolls, the cross and a tap outside close it.
 */
(function () {
    'use strict';
    if (window._lmGamepadUILoaded) return;
    window._lmGamepadUILoaded = true;

    var TEXT = {
        en: {
            title: 'Gamepad',
            tabButtons: 'Buttons',
            tabTuning: 'Sensitivity',
            tabProfiles: 'Profiles',
            tabTest: 'Test',
            close: 'Close',
            off: 'Gamepad support is off: the pad does nothing in the game until it is on.',
            enable: 'Gamepad / controller support',
            none: '(none)',
            groupGamepad: 'Gamepad',
            groupHotkeys: 'Hotkeys',
            unknown: 'Unknown command',
            buttonsHint: 'A hotkey that has a release action (macro feed, scan trick...) stays held as long as the button is.',
            resetButtons: 'Default buttons',
            resetTuning: 'Default sensitivity',
            gamepadDeadzone: 'Stick dead zone',
            gamepadMoveRange: 'Movement range (part of the screen)',
            gamepadMoveCurve: 'Movement curve (1 = linear, higher = finer small moves)',
            gamepadZoomSens: 'Zoom speed (right stick)',
            gamepadTrigger: 'LT / RT pressed from',
            gamepadInvertX: 'Invert left stick left / right',
            gamepadInvertY: 'Invert left stick up / down',
            gamepadInvertZoom: 'Invert zoom direction',
            gamepadVibrate: 'Vibrate on split and death (pads that support it)',
            testVibration: 'Test vibration',
            noVibration: 'No connected pad reports vibration support in this browser.',
            profileName: 'Profile name',
            save: 'Save',
            load: 'Load',
            del: 'Delete',
            profilesHint: 'A profile keeps the buttons and the sensitivity settings. Saving with an existing name replaces it.',
            noProfiles: 'No profiles saved yet.',
            saved: 'Saved',
            loaded: 'Loaded',
            deleted: 'Deleted',
            saveFailed: 'Could not save: enter a name (20 profiles at most), or the browser storage is full.',
            confirmDelete: 'Delete this profile?',
            noPad: 'No controller found. Connect one and press any button on it (browsers show a pad only after a button press).',
            pad: 'Pad',
            standard: 'standard mapping',
            otherMapping: 'non-standard mapping: buttons may differ',
            vibration: 'vibration',
            yes: 'yes',
            no: 'no',
            leftStick: 'Left stick (move)',
            rightStick: 'Right stick (zoom)',
            measure: 'Measure stick drift',
            measuring: 'Leave the sticks alone...',
            drift: 'Rest drift: left {l}, right {r}. Suggested dead zone: {s}',
            use: 'Use {s}',
            deadzoneSet: 'Dead zone set to {s}',
            paused: 'The pad is paused in the game while this window is open.'
        },
        el: {
            title: 'Gamepad',
            tabButtons: 'Κουμπιά',
            tabTuning: 'Ευαισθησία',
            tabProfiles: 'Προφίλ',
            tabTest: 'Δοκιμή',
            close: 'Κλείσιμο',
            off: 'Η υποστήριξη gamepad είναι κλειστή: το χειριστήριο δεν κάνει τίποτα στο παιχνίδι μέχρι να ανοίξει.',
            enable: 'Υποστήριξη gamepad / χειριστηρίου',
            none: '(κανένα)',
            groupGamepad: 'Gamepad',
            groupHotkeys: 'Πλήκτρα συντόμευσης',
            unknown: 'Άγνωστη εντολή',
            buttonsHint: 'Μια συντόμευση με ενέργεια αφήματος (macro feed, scan trick...) μένει πατημένη όσο είναι πατημένο το κουμπί.',
            resetButtons: 'Προεπιλεγμένα κουμπιά',
            resetTuning: 'Προεπιλεγμένη ευαισθησία',
            gamepadDeadzone: 'Νεκρή ζώνη μοχλού',
            gamepadMoveRange: 'Εύρος κίνησης (μέρος της οθόνης)',
            gamepadMoveCurve: 'Καμπύλη κίνησης (1 = γραμμική, μεγαλύτερη = πιο λεπτές μικρές κινήσεις)',
            gamepadZoomSens: 'Ταχύτητα ζουμ (δεξής μοχλός)',
            gamepadTrigger: 'LT / RT πατημένα από',
            gamepadInvertX: 'Αντιστροφή αριστερού μοχλού αριστερά / δεξιά',
            gamepadInvertY: 'Αντιστροφή αριστερού μοχλού πάνω / κάτω',
            gamepadInvertZoom: 'Αντιστροφή κατεύθυνσης ζουμ',
            gamepadVibrate: 'Δόνηση σε split και θάνατο (όπου υποστηρίζεται)',
            testVibration: 'Δοκιμή δόνησης',
            noVibration: 'Κανένα συνδεδεμένο χειριστήριο δεν υποστηρίζει δόνηση σε αυτόν τον browser.',
            profileName: 'Όνομα προφίλ',
            save: 'Αποθήκευση',
            load: 'Φόρτωση',
            del: 'Διαγραφή',
            profilesHint: 'Ένα προφίλ κρατά τα κουμπιά και τις ρυθμίσεις ευαισθησίας. Αποθήκευση με υπάρχον όνομα το αντικαθιστά.',
            noProfiles: 'Δεν υπάρχουν αποθηκευμένα προφίλ.',
            saved: 'Αποθηκεύτηκε',
            loaded: 'Φορτώθηκε',
            deleted: 'Διαγράφηκε',
            saveFailed: 'Δεν αποθηκεύτηκε: γράψε ένα όνομα (έως 20 προφίλ) ή ο χώρος του browser είναι γεμάτος.',
            confirmDelete: 'Διαγραφή αυτού του προφίλ;',
            noPad: 'Δεν βρέθηκε χειριστήριο. Σύνδεσε ένα και πάτησε ένα κουμπί του (οι browsers δείχνουν το χειριστήριο μόνο μετά από πάτημα).',
            pad: 'Χειριστήριο',
            standard: 'τυπική αντιστοίχιση',
            otherMapping: 'μη τυπική αντιστοίχιση: τα κουμπιά μπορεί να διαφέρουν',
            vibration: 'δόνηση',
            yes: 'ναι',
            no: 'όχι',
            leftStick: 'Αριστερός μοχλός (κίνηση)',
            rightStick: 'Δεξής μοχλός (ζουμ)',
            measure: 'Μέτρηση απόκλισης μοχλών',
            measuring: 'Άφησε τους μοχλούς ελεύθερους...',
            drift: 'Απόκλιση σε ηρεμία: αριστερός {l}, δεξής {r}. Προτεινόμενη νεκρή ζώνη: {s}',
            use: 'Χρήση {s}',
            deadzoneSet: 'Νεκρή ζώνη: {s}',
            paused: 'Το χειριστήριο δεν δρα στο παιχνίδι όσο είναι ανοιχτό αυτό το παράθυρο.'
        }
    };
    function lang() {
        try { return window.localStorage.getItem('languagemod') === '2' ? 'el' : 'en'; } catch (e) { return 'en'; }
    }
    function t(k, vars) {
        var l = TEXT[lang()] || TEXT.en;
        var s = l[k] || TEXT.en[k] || k;
        if (vars) for (var v in vars) s = s.split('{' + v + '}').join(String(vars[v]));
        return s;
    }

    var MEASURE_MS = 2000;
    var SLIDERS = [
        ['gamepadDeadzone', 0.05, 0.5, 0.01],
        ['gamepadMoveRange', 0.15, 1, 0.01],
        ['gamepadMoveCurve', 0.5, 3, 0.1],
        ['gamepadZoomSens', 0.2, 4, 0.1],
        ['gamepadTrigger', 0.1, 0.95, 0.05]
    ];
    var TOGGLES = ['gamepadInvertX', 'gamepadInvertY', 'gamepadInvertZoom', 'gamepadVibrate'];

    var modal = null, backdrop = null, body = null, tabsEl = null, msgEl = null;
    var tab = 'buttons';
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
        if (document.getElementById('lm-gp-style')) return;
        var s = document.createElement('style');
        s.id = 'lm-gp-style';
        s.textContent =
            '#lm-gp-modal select,#lm-gp-modal input[type=text]{background:' + c.pc2 + ';color:' + c.tc + ';border:1px solid rgba(255,255,255,0.15);border-radius:var(--lm-radius-s,4px);height:30px;font-size:12px;padding:0 6px;min-width:0;}' +
            '#lm-gp-modal input[type=range]{width:100%;height:28px;margin:0;}' +
            '#lm-gp-modal input[type=checkbox]{width:18px;height:18px;margin:0 8px 0 0;flex:none;}' +
            '#lm-gp-modal .btn{min-height:30px;}' +
            '#lm-gp-modal label{font-weight:400;margin:0;}' +
            '#lm-gp-modal .lm-gp-chip{flex:none;min-width:62px;box-sizing:border-box;padding:0 6px;height:26px;line-height:26px;border-radius:var(--lm-radius-s,4px);text-align:center;font-size:11px;font-weight:700;background:rgba(255,255,255,0.08);transition:background .05s;}' +
            '#lm-gp-modal .lm-gp-chip.on{background:' + c.mc + ';color:' + c.pc + ';}';
        document.head.appendChild(s);
    }

    /* hotkeys of the registry, in its order (the same list as the mouse button choices) */
    function hotkeyList() {
        var out = [];
        var h = window.hotkeysCommand || (typeof hotkeysCommand !== 'undefined' ? hotkeysCommand : null);
        if (!h) return out;
        for (var id in h) {
            if (!Object.prototype.hasOwnProperty.call(h, id) || !/^hk-/.test(id)) continue;
            var label = '';
            try { label = h[id] && h[id].label; } catch (e) { label = ''; }
            out.push([id, typeof label === 'string' && label ? label : id]);
        }
        return out;
    }

    /* one select with every action, cloned for each button */
    function actionSelect() {
        var g = G();
        var s = document.createElement('select');
        var o = document.createElement('option');
        o.value = 'none';
        o.textContent = t('none');
        s.appendChild(o);
        var og = document.createElement('optgroup');
        og.label = t('groupGamepad');
        for (var a in g.ACTIONS) {
            o = document.createElement('option');
            o.value = a;
            o.textContent = g.ACTIONS[a];
            og.appendChild(o);
        }
        s.appendChild(og);
        og = document.createElement('optgroup');
        og.label = t('groupHotkeys');
        hotkeyList().forEach(function (h) {
            o = document.createElement('option');
            o.value = h[0];
            o.textContent = h[1];
            og.appendChild(o);
        });
        s.appendChild(og);
        return s;
    }

    function setSelect(sel, value) {
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === value) { sel.selectedIndex = i; return; }
        }
        /* a hotkey that no longer exists (or not loaded yet): keep it visible */
        var o = document.createElement('option');
        o.value = value;
        o.textContent = t('unknown') + ': ' + value;
        sel.appendChild(o);
        sel.value = value;
    }

    function offNotice(c) {
        var s = window.legendmod5;
        var box = el('div', 'display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:6px 8px;margin-bottom:6px;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.05);');
        var lab = el('label', 'display:flex;align-items:center;cursor:pointer;');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'lm-gp-enable';
        cb.checked = !!(s && s.gamepadEnabled);
        lab.appendChild(cb);
        lab.appendChild(el('span', 'color:' + c.mc + ';font-weight:700;', t('enable')));
        box.appendChild(lab);
        var hint = el('div', 'flex-basis:100%;font-size:11px;color:' + c.tc2 + ';', t('off'));
        hint.style.display = cb.checked ? 'none' : '';
        box.appendChild(hint);
        cb.addEventListener('change', function () {
            if (!s) return;
            s.gamepadEnabled = cb.checked;
            hint.style.display = cb.checked ? 'none' : '';
            /* the menu switch shows it and saves the settings */
            var a = window.application;
            try { if (a && a.syncHotkeyOption) a.syncHotkeyOption('gamepadEnabled'); else if (a && a.saveSettings) a.saveSettings(s, 'ogarioSettings'); } catch (e) { }
        });
        return box;
    }

    function buildButtons(c) {
        var g = G();
        var wrap = el('div');
        wrap.appendChild(offNotice(c));
        var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:5px 12px;');
        var m = g.getMap();
        var tpl = actionSelect();
        var chips = [];
        g.BUTTON_NAMES.forEach(function (name, i) {
            var row = el('div', 'display:flex;align-items:center;gap:6px;min-width:0;');
            var chip = el('div', '', name.replace('D-pad ', '✚ '));
            chip.className = 'lm-gp-chip';
            chip.title = name;
            chips.push(chip);
            var sel = tpl.cloneNode(true);
            sel.id = 'lm-gp-btn-' + i;
            sel.style.flex = '1';
            sel.style.width = '100%';
            setSelect(sel, m[i]);
            sel.addEventListener('change', function () {
                if (!g.setButton(i, sel.value)) setSelect(sel, g.getMap()[i]);
            });
            row.appendChild(chip);
            row.appendChild(sel);
            grid.appendChild(row);
        });
        wrap.appendChild(grid);
        var foot = el('div', 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px;');
        var reset = btn(t('resetButtons'), 'btn-warning');
        reset.id = 'lm-gp-reset-buttons';
        reset.addEventListener('click', function () { g.resetMap(); show('buttons'); });
        foot.appendChild(reset);
        foot.appendChild(el('div', 'flex:1;min-width:200px;font-size:11px;color:' + c.tc2 + ';', t('buttonsHint')));
        wrap.appendChild(foot);
        live = { chips: chips };
        return wrap;
    }

    function buildTuning(c) {
        var g = G();
        var o = g.getOpts();
        var wrap = el('div');
        wrap.appendChild(offNotice(c));
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
        var tg = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px 16px;margin-top:8px;');
        TOGGLES.forEach(function (k) {
            var lab = el('label', 'display:flex;align-items:center;cursor:pointer;font-size:12px;min-height:28px;');
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'lm-gp-' + k;
            cb.checked = !!o[k];
            cb.addEventListener('change', function () {
                var p = {};
                p[k] = cb.checked;
                g.setOpts(p);
            });
            lab.appendChild(cb);
            lab.appendChild(el('span', '', t(k)));
            tg.appendChild(lab);
        });
        wrap.appendChild(tg);
        var foot = el('div', 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;');
        var vib = btn(t('testVibration'), 'btn-primary');
        vib.id = 'lm-gp-vibrate';
        vib.addEventListener('click', function () {
            var any = false;
            g.pads().forEach(function (p) { if (g.testRumble(p)) any = true; });
            if (!any) note(t('noVibration'));
        });
        var reset = btn(t('resetTuning'), 'btn-warning');
        reset.id = 'lm-gp-reset-tuning';
        reset.addEventListener('click', function () { g.resetOpts(); show('tuning'); });
        foot.appendChild(vib);
        foot.appendChild(reset);
        wrap.appendChild(foot);
        live = null;
        return wrap;
    }

    function buildProfiles(c) {
        var g = G();
        var wrap = el('div');
        var row = el('div', 'display:flex;gap:8px;align-items:center;');
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.id = 'lm-gp-profile-name';
        inp.maxLength = 32;
        inp.placeholder = t('profileName');
        inp.autocomplete = 'off';
        inp.style.flex = '1';
        var save = btn(t('save'), 'btn-success');
        save.id = 'lm-gp-profile-save';
        var doSave = function () {
            var n = g.saveProfile(inp.value);
            if (n) { show('profiles'); note(t('saved') + ': ' + n); } else note(t('saveFailed'));
        };
        save.addEventListener('click', doSave);
        inp.addEventListener('keydown', function (e) {
            e.stopPropagation();
            if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); doSave(); }
        });
        row.appendChild(inp);
        row.appendChild(save);
        wrap.appendChild(row);
        wrap.appendChild(el('div', 'font-size:11px;color:' + c.tc2 + ';margin:4px 0 8px;', t('profilesHint')));
        var list = g.profiles();
        if (!list.length) wrap.appendChild(el('div', 'padding:10px;text-align:center;color:' + c.tc2 + ';', t('noProfiles')));
        list.forEach(function (name) {
            var r = el('div', 'display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06);');
            r.className = 'lm-gp-profile';
            r.appendChild(el('div', 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;', name));
            var ld = btn(t('load'), 'btn-primary');
            ld.addEventListener('click', function () {
                if (g.loadProfile(name)) note(t('loaded') + ': ' + name);
            });
            var dl = btn(t('del'), 'btn-danger');
            dl.addEventListener('click', function () {
                if (!window.confirm(t('confirmDelete') + '\n' + name)) return;
                if (g.deleteProfile(name)) { show('profiles'); note(t('deleted') + ': ' + name); }
            });
            r.appendChild(ld);
            r.appendChild(dl);
            wrap.appendChild(r);
        });
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
            var chip = el('div', '', name.replace('D-pad ', '✚ '));
            chip.className = 'lm-gp-chip';
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
            row.appendChild(el('span', 'color:' + c.mc + ';font-weight:700;flex:none;', t('pad') + ' ' + (p.index + 1)));
            row.appendChild(el('span', 'min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', String(p.id || '').slice(0, 120)));
            row.appendChild(el('span', 'flex:none;font-size:11px;color:' + c.tc2 + ';',
                (p.mapping === 'standard' ? t('standard') : t('otherMapping')) + ', ' + t('vibration') + ': ' + (g.canVibrate(p) ? t('yes') : t('no'))));
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
        var f = name === 'tuning' ? buildTuning : name === 'profiles' ? buildProfiles : name === 'test' ? buildTest : buildButtons;
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
        backdrop = el('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;background:rgba(0,0,0,0.55);');
        backdrop.id = 'lm-gp-backdrop';
        backdrop.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); });
        modal = el('div', 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:720px;max-width:calc(100vw - 16px);' +
            'height:auto;max-height:calc(100vh - 16px);display:flex;flex-direction:column;box-sizing:border-box;z-index:2147483647;' +
            'background:' + c.pc + ';border:1px solid ' + c.pc2 + ';border-top:3px solid ' + c.mc + ';border-radius:var(--lm-radius,6px);' +
            'box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + c.tc + ';font-family:inherit;font-size:12px;overflow:hidden;text-align:left;');
        modal.id = 'lm-gp-modal';
        var head = el('div', 'flex:none;display:flex;align-items:center;gap:8px;padding:6px 8px 6px 12px;border-bottom:1px solid ' + c.pc2 + ';background:linear-gradient(180deg,' + c.pc2 + ' 0%,' + c.pc + ' 100%);');
        head.appendChild(el('div', 'font-size:15px;font-weight:700;color:' + c.mc + ';letter-spacing:1px;text-transform:uppercase;flex:none;', '🎮 ' + t('title')));
        tabsEl = el('div', 'flex:1;min-width:0;display:flex;align-items:center;gap:4px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;');
        [['buttons', t('tabButtons')], ['tuning', t('tabTuning')], ['profiles', t('tabProfiles')], ['test', t('tabTest')]].forEach(function (d) {
            var b = el('div', 'flex:none;cursor:pointer;font-size:12px;padding:0 10px;height:30px;line-height:30px;border-radius:var(--lm-radius-s,4px);border:1px solid ' + c.pc2 + ';', d[1]);
            b.id = 'lm-gp-tab-' + d[0];
            b.setAttribute('data-tab', d[0]);
            b.addEventListener('click', function (e) { e.stopPropagation(); show(d[0]); });
            tabsEl.appendChild(b);
        });
        head.appendChild(tabsEl);
        var x = el('div', 'flex:none;cursor:pointer;font-size:18px;color:' + c.tc2 + ';width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,0.06);', '✕');
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
        body = el('div', 'flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:8px 12px 12px;');
        modal.appendChild(body);
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        window.addEventListener('keydown', onKey, true);
        show(tab);
        raf = requestAnimationFrame(tick);
    }

    window.LMGamepadUI = {
        open: open,
        close: close,
        isOpen: function () { return !!modal; },
        show: function (name) { if (modal) show(name); }
    };
})();
