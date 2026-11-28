/* Premium for the players of the builds before 2026-11-28, with the real functions cut out of
 * LMexpress.js: once per browser, a browser with "timesopened" (stored by every build since 2017)
 * and no lasting licence gets proLicenceUID "permanent" and one thank-you toast; an existing licence
 * stays, a fresh browser only gets the marker, a second start does nothing. The licence checks
 * that clear a giveaway or Mega FFA licence leave "permanent" alone.
 * node developers/tests/legacypremium.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repo = path.resolve(__dirname, '..', '..');
const lmx = fs.readFileSync(path.join(repo, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : ' -> ' + JSON.stringify(info)));
    if (!ok) fail++;
}
const cut = (src, start, end) => { const a = src.indexOf(start); const b = src.indexOf(end, a); return a < 0 || b < 0 ? '' : src.slice(a, b); };

const src = cut(lmx, 'function _lmLegacyPremiumCheck(ls) {', 'window.proLicenceUID = localStorage.getItem("proLicenceUID");');
check('check found, before the licence and timesopened are read', src.length > 0 &&
    lmx.indexOf('if (_lmLegacyPremiumCheck(localStorage)) _lmLegacyPremiumToast(0);') < lmx.indexOf('var timesopened = localStorage.getItem("timesopened");'));

function store(init) {
    const m = new Map(Object.entries(init || {}));
    return { m, getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
}
function run(ls, toastr) {
    const toasts = [];
    const ctx = { window: {}, localStorage: ls, setTimeout: () => { }, Date };
    ctx.window.lmT = k => k;
    if (toastr !== false) ctx.window.toastr = ctx.toastr = { warning: t => { toasts.push(t); return { css: () => { } }; } };
    ctx._lmxT = k => k;
    vm.createContext(ctx);
    /* the real start lines: the check, then the toast */
    vm.runInContext(src, ctx);
    return toasts;
}

let ls = store();
let t = run(ls);
check('fresh browser: marker only, no licence, no toast', /^\d{4}-\d\d-\d\d$/.test(ls.getItem('lmLegacyCheck')) && ls.getItem('proLicenceUID') === null && t.length === 0);

ls = store({ timesopened: '57' });
t = run(ls);
check('earlier user without Premium: permanent licence, one thank-you toast', ls.getItem('proLicenceUID') === 'permanent' && t.length === 1 && t[0] === 'pkg.legpremw.thanks');
t = run(ls);
check('second start: nothing', ls.getItem('proLicenceUID') === 'permanent' && t.length === 0);
ls.removeItem('proLicenceUID');
t = run(ls);
check('second start after the licence was removed: not given again', ls.getItem('proLicenceUID') === null && t.length === 0);

ls = store({ timesopened: '0', proLicenceUID: 'null' });
t = run(ls);
check('stored "null" licence counts as none', ls.getItem('proLicenceUID') === 'permanent' && t.length === 1);

ls = store({ timesopened: '3', proLicenceUID: 'Donator2019' });
t = run(ls);
check('earlier user with Premium: licence unchanged, marker, no toast', ls.getItem('proLicenceUID') === 'Donator2019' && ls.getItem('lmLegacyCheck') !== null && t.length === 0);

ls = store({ timesopened: '3', proLicenceUID: 'Give' });
t = run(ls);
check('a giveaway licence (it ends) becomes permanent', ls.getItem('proLicenceUID') === 'permanent' && t.length === 1);

ls = store({ timesopened: '9' });
const ctxNoToast = run(ls, false);
check('without toastr the licence is still given (toast waits)', ls.getItem('proLicenceUID') === 'permanent' && ctxNoToast.length === 0);

/* the licence checks that clear licences leave "permanent" alone */
const pu = cut(lmx, 'function PremiumUsers() {', 'function PremiumUsersLMscore() {');
const init = cut(lmx, 'function initializeLM(modVersion) {', '/* by their agar.io text key too');
function premiumRun(lic) {
    const m = store({ proLicenceUID: lic });
    const ctx = { window: { proLicenceUID: lic, agarioUID: 'u1' }, localStorage: m, console, toastr: { warning: () => ({ css: () => { } }) }, _lmxT: k => k,
        ProLicenceUsersTable: { ProLicenceUsers: {} } };
    vm.createContext(ctx);
    /* initializeLM up to its Mega FFA clean-up */
    vm.runInContext(pu + init + '}\nPremiumUsers(); initializeLM();', ctx);
    return [ctx.window.proLicenceUID, m.getItem('proLicenceUID')];
}
check('PremiumUsers and initializeLM keep "permanent"', JSON.stringify(premiumRun('permanent')) === '["permanent","permanent"]', premiumRun('permanent'));
check('(control) a giveaway licence not in the table is cleared', premiumRun('Give')[0] === null);

const lang = fs.readFileSync(path.join(repo, 'languages', 'lm-en.js'), 'utf8');
check('toast text in the English pack', lang.includes('pkg.legpremw.thanks') && /Full Map/.test(lang) && /Watermarks/.test(lang));

console.log(fail ? 'FAILED ' + fail : 'ALL OK');
process.exit(fail ? 1 : 0);
