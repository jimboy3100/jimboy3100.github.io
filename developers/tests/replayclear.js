/* "Record replays" switched off (by hand, a preset or a script) must not
 * free the recordings already in memory: only new packets stop, for the rest of this connection.
 * Freeing them is the explicit, confirmed "Clear recordings in memory" (window._lmRecClearMemory),
 * which keeps a replay that is playing, one being saved and the one still being recorded.
 * The code is taken from ogario/ogario.v4.js: the recordReplays case of setSettings, the packet
 * recording branch of _lmHandlePacket and the clear helpers.
 * node developers/tests/replayclear.js [ogario.v4.js] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(start) {
    const i = src.indexOf(start);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const fn = (name) => { const b = block('\nfunction ' + name + '('); return b ? b.slice(1) : ''; };
const ci = src.indexOf("                    case 'recordReplays':\n");
const caseBody = ci < 0 ? null : src.slice(ci + "                    case 'recordReplays':\n".length, src.indexOf('                        break;', ci));
const pkt = block('if (defaultmapsettings.recordReplays !== false && lmRecRoom(');
if (!caseBody || !pkt) { console.log('FAIL code not found'); process.exit(1); }
const overhead = /\nvar LM_REC_PKT_OVERHEAD = \d+;/.exec(src);
/* the start of a connection's recording slot in replayfunctions (connect): counters, the stop flag,
 * the array, whether Replay Studio data is kept */
const slotA = src.indexOf('                window.catholicCalculator = 0\n'), slotB = src.indexOf('window.RecordedProtocolArenas.push(window.temporaryRecordedProtocol)', slotA);
const slotCode = slotA < 0 || slotB < 0 || slotB - slotA > 3000 ? null : src.slice(slotA, slotB);
if (!slotCode) { console.log('FAIL connection slot code not found'); process.exit(1); }

let failed = 0;
/* the English texts of the language packs (developers/i18n/src), as lmT gives them */
const EN = {}; Object.values(require('../i18n/lib').readAll()).forEach((a) => Object.keys(a).forEach((k) => { EN[k] = a[k].en; }));
const enT = (k, v) => { const s = EN[k]; if (s === undefined) return k; if (v == null) return s; if (typeof v !== 'object') v = [v]; return s.replace(/{([A-Za-z0-9_]+)}/g, (m, n) => (v[n] != null ? String(v[n]) : m)); };
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

function boot() {
    const toasts = [], asked = [];
    const ctx = {
        console: { info() { }, log() { } }, Math, Date, Array, Object, JSON, String, DataView, ArrayBuffer, navigator: {},
        toastr: { info(m) { toasts.push(['info', m]); }, success(m) { toasts.push(['success', m]); } },
        confirm(m) { asked.push(m); return ctx.answer; }, answer: true,
        lmT: enT, _lmMhT: (k, en) => { const t = enT(k); return t !== k ? t : en; },
        defaultmapsettings: { recordReplays: true },
        legendmod: { playingReplayServer: null },
        $: () => ({ val: () => 'wss://live-arena.example:443' }),
        document: { getElementById: () => null, activeElement: null }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext([overhead ? overhead[0] : '', fn('lmRecRoom'), fn('lmRecPacketBytes'), fn('lmRecByteBudget'), fn('lmRecArrBytes'), fn('lmRecBudgetPlan'), fn('lmRecFreeMemory'), fn('_lmTokenBoxValue'),
        (block('window._lmRecBudgetCheck = function') || '') + ';',
        (block('window._lmRecKeepOnClear = function') || '') + ';', (block('window._lmRecClearMemory = function') || '') + ';',
        /* like setSettings: the value it had, then the new one stored, then the case */
        'function setRec(checked) {\nvar _lmSetWas = defaultmapsettings.recordReplays;\ndefaultmapsettings.recordReplays = checked;\n' + caseBody + '\n}',
        'function recordPacket(data) { var _recServerToken;\n' + pkt + '\n}'].join('\n'), ctx);
    /* 3 older recordings and the one of this connection */
    ctx.RecordedProtocol = [];
    ctx.RecordedProtocolArenas = [];
    ctx.RecordedArenasSpecifications = [];
    ['old1', 'old2', 'old3', 'live'].forEach((k, i) => {
        ctx.RecordedProtocol[k] = Array.from({ length: 20 }, () => new DataView(new ArrayBuffer(8)));
        ctx.RecordedProtocolArenas.push(k);
        ctx.RecordedArenasSpecifications[k] = [i];
    });
    ctx.temporaryRecordedProtocol = 'live';
    ctx.catholicCalculator = 20;
    ctx._lmRecSlotBytes = 160;
    ctx._lmRecFull = false;
    ctx._lmRecChkAt = 1e9;
    ctx._lmRecLive = true;
    /* a new connection: connect()'s own slot code */
    vm.runInContext('function newSlot() {\n' + slotCode + '\n}', ctx);
    ctx.reconnect = () => {
        ctx.temporaryRecordedProtocol = 'next';
        ctx.RecordedProtocolArenas.push('next');
        ctx.newSlot();
    };
    return { ctx, toasts, asked };
}
const pk = () => new DataView(new ArrayBuffer(8));

/* switching off keeps every recording */
{
    const { ctx, toasts } = boot();
    ctx.legendmod.playingReplayServer = 'old2';
    ctx.setRec(false);
    check('off: all recordings stay in memory', ctx.RecordedProtocolArenas.join() === 'old1,old2,old3,live' && ['old1', 'old2', 'old3', 'live'].every(k => ctx.RecordedProtocol[k] && ctx.RecordedProtocol[k].length === 20));
    check('off: their details stay', ['old1', 'old2', 'old3', 'live'].every(k => Array.isArray(ctx.RecordedArenasSpecifications[k])));
    check('off: the player is told this connection is not recorded any more', toasts.some(t => /not recorded/i.test(t[1])));
    ctx.recordPacket(pk());
    check('off: no new packets', (ctx.RecordedProtocol.live || []).length === 20);
    /* back on during the same connection: no resumed recording with a gap */
    ctx.setRec(true);
    ctx.recordPacket(pk());
    check('on again: this connection stays unrecorded (no gap)', (ctx.RecordedProtocol.live || []).length === 20);
    check('on again: told it records from the next server', toasts.some(t => /next server/i.test(t[1])));
    ctx.reconnect();
    ctx.recordPacket(pk());
    check('on again: the next connection records', ctx.RecordedProtocol.next.length === 1);
}

/* joined with recording off, switched on during that game (a preset, a script or the
 * switch): nothing is recorded from the middle of the connection (it would have no map border, no
 * own cells and no times); the next connection records */
{
    const { ctx, toasts } = boot();
    ctx.defaultmapsettings.recordReplays = false;
    ctx.reconnect();
    ctx.recordPacket(pk());
    check('joined while off: nothing recorded', ctx.RecordedProtocol.next.length === 0 && !ctx.RecordedProtocol.next._lm);
    ctx.setRec(true);
    ctx.recordPacket(pk()); ctx.recordPacket(pk());
    check('joined while off, switched on: no packets from the middle of the connection (' + ctx.RecordedProtocol.next.length + ')', ctx.RecordedProtocol.next.length === 0);
    check('joined while off, switched on: told it records from the next server', toasts.some(t => /next server/i.test(t[1])));
    ctx.temporaryRecordedProtocol = 'next2';
    ctx.RecordedProtocolArenas.push('next2');
    ctx.newSlot();
    ctx.recordPacket(pk());
    check('joined while off, switched on: the next connection records', ctx.RecordedProtocol.next2.length === 1 && !!ctx.RecordedProtocol.next2._lm);
}

/* a press of the Settings switch sends the old value first (Switchery in a label), then the new
 * one: each press gives the notice of what it did, once */
{
    const { ctx, toasts } = boot();
    const press = (v) => { const n = toasts.length; ctx.setRec(!v); ctx.setRec(v); return toasts.slice(n).map(t => t[1]); };
    let t = press(false);
    check('switch off: told once (' + t.join(' | ') + ')', t.length === 1 && /not recorded/i.test(t[0]));
    t = press(true);
    check('switch on: only the next-server notice (' + t.join(' | ') + ')', t.length === 1 && /next server/i.test(t[0]));
    ctx.recordPacket(pk());
    check('switch on: this connection stays unrecorded', ctx.RecordedProtocol.live.length === 20);
    t = press(false);
    check('switch off again in the same game: told it is not recorded, not "next server" (' + t.join(' | ') + ')', t.length === 1 && /not recorded/i.test(t[0]));
    t = press(true);
    check('switch on again: only the next-server notice (' + t.join(' | ') + ')', t.length === 1 && /next server/i.test(t[0]));
    /* a script or preset giving the value it already has: no notice */
    const n = toasts.length;
    ctx.setRec(true);
    check('the same value again: no notice', toasts.length === n);
}
/* joined with recording off, switched on, then off again: the off press says so */
{
    const { ctx, toasts } = boot();
    ctx.defaultmapsettings.recordReplays = false;
    ctx.reconnect();
    const press = (v) => { const n = toasts.length; ctx.setRec(!v); ctx.setRec(v); return toasts.slice(n).map(t => t[1]); };
    let t = press(true);
    check('joined off, switch on: the next-server notice (' + t.join(' | ') + ')', t.length === 1 && /next server/i.test(t[0]));
    t = press(false);
    check('joined off, on, off: told it is not recorded, not "next server" (' + t.join(' | ') + ')', t.length === 1 && /not recorded/i.test(t[0]));
}
/* the memory budget stopped this recording, then the switch is turned off: it says so */
{
    const { ctx, toasts } = boot();
    ctx._lmRecFull = true;
    const n = toasts.length;
    ctx.setRec(true); ctx.setRec(false);
    const t = toasts.slice(n).map(x => x[1]);
    check('memory full, switch off: told it is not recorded, not "next server" (' + t.join(' | ') + ')', t.length === 1 && /not recorded/i.test(t[0]));
}

/* the explicit clear */
{
    const { ctx, toasts, asked } = boot();
    check('clear: helper exists', typeof ctx._lmRecClearMemory === 'function');
    if (typeof ctx._lmRecClearMemory === 'function') {
        ctx.legendmod.playingReplayServer = 'old1';
        ctx.RecordedProtocol.old2._lmSaving = true;
        ctx.answer = false;
        check('clear: cancelled confirm frees nothing', ctx._lmRecClearMemory(true) === 0 && ctx.RecordedProtocolArenas.length === 4 && asked.length === 1 && /\b1\b/.test(asked[0]));
        ctx.answer = true;
        const n = ctx._lmRecClearMemory(true);
        check('clear: frees the others (' + n + ')', n === 1 && !ctx.RecordedProtocol.old3 && !ctx.RecordedArenasSpecifications.old3);
        check('clear: keeps the playing, the saving and the live recording', ctx.RecordedProtocolArenas.join() === 'old1,old2,live');
        check('clear: says how many were freed', toasts.some(t => t[0] === 'success' && /1/.test(t[1])));
        ctx.setRec(false);
        ctx.RecordedProtocol.old2._lmSaving = false;
        ctx.legendmod.playingReplayServer = null;
        check('clear: a stopped live recording can be freed too', ctx._lmRecClearMemory(false) === 3 && ctx.RecordedProtocolArenas.length === 0);
        check('clear: nothing left: says so, no confirm', ctx._lmRecClearMemory(true) === 0 && asked.length === 2 && toasts.some(t => /No replay recordings/.test(t[1])));
    }
}

console.log(failed ? failed + ' failed' : 'all replay clear checks passed');
process.exit(failed ? 1 : 0);
