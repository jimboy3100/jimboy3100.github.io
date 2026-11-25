/* "Record replays" switched off (by hand, a settings profile, a preset or an auto rule) must not
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
        $: () => ({ val: () => 'wss://live-arena.example:443' })
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext([overhead ? overhead[0] : '', fn('lmRecRoom'), fn('lmRecPacketBytes'), fn('lmRecByteBudget'), fn('lmRecArrBytes'), fn('lmRecBudgetPlan'), fn('lmRecFreeMemory'),
        (block('window._lmRecBudgetCheck = function') || '') + ';',
        (block('window._lmRecKeepOnClear = function') || '') + ';', (block('window._lmRecClearMemory = function') || '') + ';',
        'function setRec(checked) {\n' + caseBody + '\n}',
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
    /* a new connection, like connect() */
    ctx.reconnect = () => {
        ctx.temporaryRecordedProtocol = 'next';
        ctx.RecordedProtocol.next = [];
        ctx.RecordedProtocolArenas.push('next');
        ctx.catholicCalculator = 0; ctx._lmRecSlotBytes = 0; ctx._lmRecFull = false;
        ctx._lmRecLive = ctx.defaultmapsettings.recordReplays !== false;
    };
    return { ctx, toasts, asked };
}
const pk = () => new DataView(new ArrayBuffer(8));

/* switching off keeps every recording */
{
    const { ctx, toasts } = boot();
    ctx.legendmod.playingReplayServer = 'old2';
    ctx.defaultmapsettings.recordReplays = false;
    ctx.setRec(false);
    check('off: all recordings stay in memory', ctx.RecordedProtocolArenas.join() === 'old1,old2,old3,live' && ['old1', 'old2', 'old3', 'live'].every(k => ctx.RecordedProtocol[k] && ctx.RecordedProtocol[k].length === 20));
    check('off: their details stay', ['old1', 'old2', 'old3', 'live'].every(k => Array.isArray(ctx.RecordedArenasSpecifications[k])));
    check('off: the player is told this connection is not recorded any more', toasts.some(t => /not recorded/i.test(t[1])));
    ctx.recordPacket(pk());
    check('off: no new packets', (ctx.RecordedProtocol.live || []).length === 20);
    /* back on during the same connection: no resumed recording with a gap */
    ctx.defaultmapsettings.recordReplays = true;
    ctx.setRec(true);
    ctx.recordPacket(pk());
    check('on again: this connection stays unrecorded (no gap)', (ctx.RecordedProtocol.live || []).length === 20);
    check('on again: told it records from the next server', toasts.some(t => /next server/i.test(t[1])));
    ctx.reconnect();
    ctx.recordPacket(pk());
    check('on again: the next connection records', ctx.RecordedProtocol.next.length === 1);
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
        ctx.defaultmapsettings.recordReplays = false;
        ctx.setRec(false);
        ctx.RecordedProtocol.old2._lmSaving = false;
        ctx.legendmod.playingReplayServer = null;
        check('clear: a stopped live recording can be freed too', ctx._lmRecClearMemory(false) === 3 && ctx.RecordedProtocolArenas.length === 0);
        check('clear: nothing left: says so, no confirm', ctx._lmRecClearMemory(true) === 0 && asked.length === 2 && toasts.some(t => /No replay recordings/.test(t[1])));
    }
}

console.log(failed ? failed + ' failed' : 'all replay clear checks passed');
process.exit(failed ? 1 : 0);
