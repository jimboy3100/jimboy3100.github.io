/* Hotkeys window auto-save: runs the real hotkeysSetup of ogario/ogario.v4.js with the real
 * ogario/gamepad.js. A key, a mouse or pad button, DEL and a chat command text are saved 600 ms
 * after the change (one save for a burst, none for a repeated press), the key works at once,
 * Close saves a waiting change and keeps it, Restore asks first, and the window has no Save button.
 * node developers/tests/hotkeysautosave.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const gpSrc = fs.readFileSync(path.join(root, 'ogario', 'gamepad.js'), 'utf8');
const a = v4.indexOf('    var hotkeysSetup = {'), b = v4.indexOf('\n    window.legendmod2 = drawRender;', a);
if (a < 0 || b < 0) { console.log('FAIL hotkeysSetup not found'); process.exit(1); }
const setupSrc = v4.slice(a, b);

let fail = 0;
const check = (n, c, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || extra === undefined ? '' : ' ' + JSON.stringify(extra))); if (!c) fail++; };

function page(opts) {
    opts = opts || {};
    const store = Object.assign({}, opts.store || {}), timers = [], handlers = {}, toasts = [], sets = [];
    let tid = 0, visible = true, bodyHtml = '', full = false, asked = 0;
    const E = {};
    const field = (id, cls) => { E[id] = { id: id, cls: cls, value: '' }; };
    ['hk-feed', 'hk-split', 'hk-chatMessage', 'hk-comm1'].forEach(id => field(id, 'custom-key-in'));
    field('comm1', 'command-in');
    const doc = { activeElement: null, hidden: false, hasFocus: () => true, getElementById: () => null, querySelector: () => null, addEventListener() { }, dispatchEvent() { } };
    const $ = function (sel) {
        let els = [];
        if (sel === doc) return { on(ev, s, f) { handlers[ev + ' ' + s] = f; } };
        if (sel && typeof sel === 'object') els = [sel];
        else if (/^#[\w-]+$/.test(sel)) els = E[sel.slice(1)] ? [E[sel.slice(1)]] : [];
        else if (sel === '#hotkeys .command-in') els = Object.values(E).filter(e => e.cls === 'command-in');
        else if (sel === '#hotkeys-cfg .custom-key-in') els = Object.values(E).filter(e => e.cls === 'custom-key-in');
        const o = {
            val(v) { if (v === undefined) return els[0] && els[0].value; els.forEach(e => { e.value = v; }); return o; },
            attr(n, v) { if (v === undefined && arguments.length < 2) return els[0] && els[0][n]; return o; },
            each(f) { els.forEach(e => f.call(e)); return o; },
            append(h) { if (sel === 'body') bodyHtml += h; return o; },
            perfectScrollbar() { return o; }, closest() { return o; }, find() { return o; },
            fadeOut() { if (sel === '#hotkeys') visible = false; return o; },
            fadeIn() { if (sel === '#hotkeys') visible = true; return o; },
            is() { return visible; },
            text(t) { o._t = t; return o; }, html() { return String(o._t); }
        };
        return o;
    };
    const w = {
        $: $, document: doc, innerWidth: 1000, innerHeight: 800,
        navigator: { getGamepads: () => [] },
        requestAnimationFrame() { }, setInterval() { },
        setTimeout(f, ms) { const t = { id: ++tid, f: f, ms: ms }; timers.push(t); return t.id; },
        clearTimeout(id) { const i = timers.findIndex(t => t.id === id); if (i >= 0) timers.splice(i, 1); },
        Date, Math, Number, JSON, Object, Array, String, RegExp, Error,
        Event: class { constructor(t) { this.type = t; } }, MouseEvent: class { }, WheelEvent: class { },
        localStorage: {
            getItem: k => Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null,
            setItem(k, v) { if (full) throw new Error('QuotaExceededError'); sets.push(k); store[k] = String(v); },
            removeItem(k) { delete store[k]; }
        },
        confirm() { asked++; return opts.confirm !== false; },
        toastr: { info(m) { toasts.push('info:' + m); }, warning(m) { toasts.push('warn:' + m); }, error(m) { toasts.push('error:' + m); } },
        lmT: k => k, _lmTH: k => k, escapeChar: { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' },
        readLocalStorageJSON(k, d) { try { const v = store[k]; return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        lmRenameOldHotkeys() { }, defineChatCommand() { },
        chatCommand: { comm1: 'Hi' },
        hotkeysCommand: {
            'hk-feed': { label: 'Feed', defaultKey: 'W', keyDown() { } },
            'hk-split': { label: 'Split', defaultKey: 'SPACE', keyDown() { } },
            'hk-chatMessage': { label: 'Chat', defaultKey: 'ENTER', keyDown() { } },
            'hk-comm1': { label: '', defaultKey: '1', type: 'command', keyDown() { } }
        },
        defaultmapsettings: {}, application: {}, Settings: null, legendmod5: { gamepadEnabled: true },
        addEventListener(t, f) { (w._L[t] = w._L[t] || []).push(f); }, _L: {}
    };
    w.window = w;
    vm.createContext(w);
    vm.runInContext(gpSrc, w);
    vm.runInContext(setupSrc + '\nwindow.hs = hotkeysSetup;', w);
    const hs = w.hs;
    hs.loadHotkeys();
    hs.setHotkeysMenu();
    hs.refreshHotkeysMenu();
    sets.length = 0;
    return {
        w, hs, store, timers, handlers, toasts, sets, E,
        get bodyHtml() { return bodyHtml; }, get visible() { return visible; }, set visible(v) { visible = v; },
        set full(v) { full = v; }, get asked() { return asked; },
        run() { const q = timers.splice(0); q.forEach(t => t.f()); return q; },
        stored(k) { try { return JSON.parse(store[k || 'ogarioHotkeys']); } catch (e) { return null; } },
        click(sel) { handlers['click ' + sel]({ preventDefault() { } }); }
    };
}

/* the window: Restore and Close, no Save button */
let p = page();
check('no Save button in the Hotkeys window', !/save-hotkeys/.test(p.bodyHtml) && /reset-hotkeys/.test(p.bodyHtml) && /close-hotkeys/.test(p.bodyHtml));
check('no Save click handler', !p.handlers['click #save-hotkeys']);

/* change a key: works at once, stored 600 ms later, one save for a repeated press */
p.hs.setHotkey('F9', 'hk-feed');
check('new key in effect at once', p.w.hotkeys.F9 === 'hk-feed' && !p.w.hotkeys.W, p.w.hotkeys);
check('not written on the keystroke itself', p.sets.indexOf('ogarioHotkeys') < 0);
check('one save waits 600 ms', p.timers.length === 1 && p.timers[0].ms === 600, p.timers.map(t => t.ms));
p.hs.setHotkey('F9', 'hk-feed');
p.hs.setHotkey('F8', 'hk-split');
check('a burst of changes waits for one save', p.timers.length === 1);
p.run();
let st = p.stored();
check('change -> stored', st && st.F9 === 'hk-feed' && st.F8 === 'hk-split' && !st.W && !st.SPACE, st);
check('stored once for the burst', p.sets.filter(k => k === 'ogarioHotkeys').length === 1, p.sets);
check('the field shows the new key', p.E['hk-feed'].value === 'F9', p.E['hk-feed'].value);

/* a reload loads it */
p.hs.loadHotkeys();
check('loads again after a reload', p.w.hotkeys.F9 === 'hk-feed' && p.hs.keysText('hk-feed') === 'F9');

/* clear (DEL, Backspace sends DEL too) */
p.sets.length = 0;
p.hs.setHotkey('DEL', 'hk-feed');
check('clear in effect at once', !Object.keys(p.w.hotkeys).some(k => k !== 'spec-messageKey' && p.w.hotkeys[k] === 'hk-feed'));
p.run();
st = p.stored();
check('clear -> stored', st && !Object.keys(st).some(k => st[k] === 'hk-feed'), st);

/* a mouse button */
p.hs.setHotkey('MOUSE 4', 'hk-split');
p.run();
check('mouse button -> stored', p.stored()['MOUSE 4'] === 'hk-split' && p.stored().F8 === 'hk-split');

/* a gamepad button on the same row */
p.hs.setHotkey('PAD B', 'hk-feed');
check('pad button in effect at once', p.w.LMGamepad.getMap()[1] === 'hk-feed');
check('pad button waits for the save', p.timers.length === 1);
p.run();
let gp = p.stored('lmGamepad');
check('pad button -> stored', gp && gp.map && gp.map[1] === 'hk-feed', gp);
p.hs.setHotkey('DEL', 'hk-feed');
p.run();
gp = p.stored('lmGamepad');
check('DEL frees the pad button and it is stored', gp && gp.map && gp.map[1] !== 'hk-feed', gp && gp.map);

/* a chat command text */
p.E.comm1.value = 'Hello team';
p.handlers['input #hotkeys .command-in']();
check('chat command text waits 600 ms', p.timers.length === 1 && p.timers[0].ms === 600);
p.run();
check('chat command text -> stored and in effect', (p.stored('ogarioCommands') || {}).comm1 === 'Hello team' && p.w.chatCommand.comm1 === 'Hello team');

/* Close keeps the change and saves one still waiting */
p.hs.setHotkey('F7', 'hk-feed');
check('waiting before Close', p.timers.length === 1 && p.stored().F7 !== 'hk-feed');
p.click('#close-hotkeys');
check('Close saves the waiting change at once', p.stored().F7 === 'hk-feed' && p.timers.length === 0);
check('Close keeps the change in effect', p.w.hotkeys.F7 === 'hk-feed');
check('Close closes', p.visible === false);
p.hs.loadHotkeys();
check('kept after a reload', p.w.hotkeys.F7 === 'hk-feed');

/* leaving the page saves a waiting change */
p.hs.setHotkey('F6', 'hk-split');
(p.w._L.pagehide || []).forEach(f => f());
check('pagehide saves a waiting change', p.stored()['F6'] === 'hk-split');

/* full storage: said once, the key still works */
p.full = true;
p.toasts.length = 0;
p.hs.setHotkey('F5', 'hk-feed');
p.hs.setHotkey('F4', 'hk-split');
p.run();
check('full storage: one error toast, key works', p.toasts.filter(t => /^error:/.test(t)).length === 1 && p.w.hotkeys.F5 === 'hk-feed', p.toasts);
p.full = false;
p.click('#close-hotkeys');
check('Close saves what the full storage refused', p.stored().F5 === 'hk-feed');
p.sets.length = 0;
p.click('#close-hotkeys');
check('Close without a change writes nothing', p.sets.length === 0, p.sets);

/* an import wrote gamepad buttons (they take effect at the next load): a later key change saves the
 * keys but not the old pad map over them; a pad change in the window still saves the map */
const importedMap = Object.assign({}, p.w.LMGamepad.defaultMap(), { 2: 'hk-split' });
const imported = JSON.stringify({ v: 1, map: importedMap });
p.store.lmGamepad = imported;
p.hs.setHotkey('F3', 'hk-feed');
p.run();
check('import then a key change: key stored, imported pad buttons kept', p.stored().F3 === 'hk-feed' && p.store.lmGamepad === imported, p.store.lmGamepad);
p.hs.setHotkey('PAD A', 'hk-feed');
p.run();
check('a pad change after it still saves the map', (p.stored('lmGamepad') || {}).map[0] === 'hk-feed');

/* Restore asks first */
let q = page({ confirm: false });
q.hs.setHotkey('F9', 'hk-feed');
q.run();
q.click('#reset-hotkeys');
check('restore asks', q.asked === 1);
check('restore declined: nothing changes', q.w.hotkeys.F9 === 'hk-feed' && q.stored().F9 === 'hk-feed');
q = page({ confirm: true, store: { ogarioHotkeys: JSON.stringify({ F9: 'hk-feed', SPACE: 'hk-split', ENTER: 'hk-chatMessage', 'spec-messageKey': 'ENTER' }) } });
q.hs.setHotkey('PAD A', 'hk-split');
q.run();
q.click('#reset-hotkeys');
st = q.stored();
check('restore confirmed: defaults in effect and stored at once', q.asked === 1 && q.w.hotkeys.W === 'hk-feed' && !q.w.hotkeys.F9 && st.W === 'hk-feed' && !st.F9 && q.timers.length === 0, st);
gp = q.stored('lmGamepad');
check('restore confirmed: default pad buttons stored', gp && JSON.stringify(gp.map) === JSON.stringify(q.w.LMGamepad.defaultMap()));

process.exit(fail ? 1 : 0);
