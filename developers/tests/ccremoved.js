/* The Command Centre is deleted (ogario/modules/commandcentre.js): nothing loads or calls it, a key
 * saved on its hotkey is dropped quietly, its stars are neither exported nor imported, and what it
 * kept in the browser is removed once at start. The functions are taken from ogario/ogario.v4.js
 * and run in a vm.
 * node developers/tests/ccremoved.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

check('module file deleted', !fs.existsSync(path.join(root, 'ogario', 'modules', 'commandcentre.js')));

/* no game script loads it or calls into it (another package must not bring it back) */
const dirs = ['ogario', 'ogario/modules', 'LMexpress', 'LMmobile', 'lib'];
const left = [];
dirs.forEach(d => fs.readdirSync(path.join(root, d)).filter(f => f.endsWith('.js')).forEach(f => {
  const s = read(d + '/' + f);
  if (/LMCommandCentre|commandcentre\.js|commandCentreBar|lm-cc-(open|bar)/.test(s)) left.push(d + '/' + f);
}));
check('no script loads or calls the Command Centre' + (left.length ? ' (' + left.join(', ') + ')' : ''), left.length === 0);
check('no Command Centre hotkey command', !/'hk-commandCentre'\s*:\s*\{/.test(read('ogario/hotkeysCommand.js')));

const v4 = read('ogario/ogario.v4.js');
/* a key saved on the removed hotkey is free again, the other keys stay */
{
  const a = v4.indexOf('function lmRenameOldHotkeys(map) {'), b = v4.indexOf('\n}', a);
  const hk = { K: 'hk-commandCentre', 'CTRL+K': 'hk-commandCentre', W: 'hk-feed' };
  let err = null;
  try { vm.runInNewContext(v4.slice(a, b + 2) + '\nchanged = lmRenameOldHotkeys(hotkeys);', { hotkeys: hk }); } catch (e) { err = e; }
  check('stored key on the Command Centre hotkey dropped', !err && !('K' in hk) && !('CTRL+K' in hk) && hk.W === 'hk-feed');
}
/* the settings export no longer carries its stars */
{
  const a = v4.indexOf('var LM_EXPORT_KEYS = ['), b = v4.indexOf('\n];', a);
  const ctx = {};
  vm.runInNewContext(v4.slice(a, b + 3) + '\nkeys = LM_EXPORT_KEYS.map(function (e) { return e.key; });', ctx);
  check('settings export has no lmCommandCentre', Array.isArray(ctx.keys) && ctx.keys.length > 5 && ctx.keys.indexOf('lmCommandCentre') < 0);
}
/* the start removes what it kept, and a browser without storage gives no error */
{
  const m = /try \{ localStorage\.removeItem\('lmCommandCentre'\); \} catch \(e\) \{ \}/.exec(v4);
  check('start removes the stored Command Centre data', !!m);
  if (m) {
    const store = { lmCommandCentre: '{"fav":["hk:hk-feed"],"recent":[]}', ogarioSettings: '{}' };
    vm.runInNewContext(m[0], { localStorage: { removeItem: k => { delete store[k]; } } });
    check('old stars removed, other data kept', !('lmCommandCentre' in store) && store.ogarioSettings === '{}');
    let err = null;
    try { vm.runInNewContext(m[0], { get localStorage() { throw new Error('blocked'); } }); } catch (e) { err = e; }
    check('blocked storage: no error', !err);
  }
}
check('no quick bar option in the defaults', !/\n\s+commandCentreBar:/.test(v4));

if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
console.log('all Command Centre removal checks passed');
