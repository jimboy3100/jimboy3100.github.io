/* Expanding Land reward reminder bell (LMexpress/lm_extended_ui.js, next to Claim All): with the bell
 * on (localStorage lmClaimRemind '1'), one toast when a reward becomes ready, none for what was ready
 * at load, none while playing (it waits for the menu), none with the bell off; a click on the bell
 * switches it. The real _lmUpdateClaimLabel and bell click handler run in a vm with a small fake page.
 * node developers/tests/claimremind.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'lm_extended_ui.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const a = src.indexOf('    window._lmUpdateClaimLabel = function (force) {');
const b = src.indexOf('    setInterval(function () { if (!document.hidden) window._lmUpdateClaimLabel(false); }, 30000);', a);
check('the claim label and the bell handler are in lm_extended_ui.js', a > 0 && b > a);
check('the bell button is next to Claim All', /<button id="lm-claim-remind"/.test(src));

const store = {}, toasts = [];
let handler = null, hourly = 100;
const st = { className: '', textContent: '' };
const btn = { disabled: false, textContent: 'Claim All', innerHTML: '', querySelector: () => st, appendChild() { } };
const ctx = {
    document: { getElementById: id => (id === 'lm-claim-all-btn' ? btn : null), createElement: () => st },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    toastr: { info: m => toasts.push(m) },
    _lmUE: k => k, _lmUR: (k, v) => k + (v || []).join(':'),
    getLiveTimedEventSecondsRemaining: k => (k === 'hourlyBonus' ? hourly : 99),
    _lmActiveQuests: [{ expiresAt: Date.now() + 60000 }],
    legendmod: { play: false },
    $: () => ({ off() { return this; }, on(ev, sel, f) { handler = f; return this; } })
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src.slice(a, b), ctx);
const upd = () => ctx._lmUpdateClaimLabel(false);

upd();
hourly = 0; upd();
check('bell off: no toast when a reward becomes ready', toasts.length === 0);
hourly = 100; upd();
store.lmClaimRemind = '1';
hourly = 0; upd();
check('bell on: one toast when a reward becomes ready', toasts.length === 1 && toasts[0].indexOf('rewardReady') >= 0);
upd();
check('still ready: no second toast', toasts.length === 1);
hourly = 100; upd();
ctx.legendmod.play = true; hourly = 0; upd();
check('while playing: no toast yet', toasts.length === 1);
ctx.legendmod.play = false; upd();
check('back in the menu: the toast comes', toasts.length === 2);
delete ctx._lmClaimWasReady;
hourly = 0; upd();
check('first check after load: what is ready already gives no toast', toasts.length === 2);

const bell = { textContent: '' };
check('bell click handler installed', typeof handler === 'function');
if (handler) {
    handler.call(bell, { preventDefault() { } });
    check('click: bell off, saved, told', store.lmClaimRemind === '0' && bell.textContent === '🔕' && toasts[toasts.length - 1] === 'remindOff');
    handler.call(bell, { preventDefault() { } });
    check('click again: bell on, saved, told', store.lmClaimRemind === '1' && bell.textContent === '🔔' && toasts[toasts.length - 1] === 'remindOn');
}
check('its saved on / off is no longer deleted at load', !/localStorage\.removeItem\('lmClaimRemind'\)/.test(src));

console.log(fail ? fail + ' failed' : 'all reward bell checks passed');
process.exit(fail ? 1 : 0);
