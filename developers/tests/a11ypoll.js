/* Accessibility module without its 2 s settings poll: ogario/modules/accessibility.js runs in a vm
 * with a small fake document. With the default text sizes no setInterval runs; a profile / preset /
 * import (settingsChange) applies the new text sizes at once; only a HUD text
 * size other than 1 keeps a 2 s timer (it measures HUD parts made later), and it stops at 1 again.
 * node developers/tests/a11ypoll.js [accessibility.js] [--old <older accessibility.js>] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv } = require('./lib/fakedom');
const args = process.argv.slice(2);
const oi = args.indexOf('--old');
const oldPath = oi >= 0 ? args.splice(oi, 2)[1] : null;
const srcPath = args[0] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'accessibility.js');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function suite(label, src) {
  const res = {};
  const DEF = { a11yTextScale: 1, a11yHudTextScale: 1 };
  let e = makeEnv(DEF);
  i18n(e.ctx);
  e.run(src);
  e.flush();
  const root = e.doc.documentElement.style;
  res.noTimerDefault = e.intervals.size === 0;
  /* a profile sets the menu text size: applied right after the event, still no timer */
  e.ctx.defaultmapsettings.a11yTextScale = 1.3;
  e.ctx.LMEvents.emit('settingsChange', { key: 'a11yTextScale', value: 1.3 });
  e.flush();
  res.menuApplied = root['--lm-font-scale'] === '1.3';
  res.noTimerMenu = e.intervals.size === 0;
  /* HUD text size 1.2: applied, and the one timer for HUD parts made later */
  e.ctx.defaultmapsettings.a11yHudTextScale = 1.2;
  e.ctx.LMEvents.emit('settingsChange', { key: 'a11yHudTextScale', value: 1.2 });
  e.flush();
  res.hudApplied = root['--lm-hud-text-scale'] === '1.2';
  res.hudTimer = e.intervals.size === 1;
  e.ctx.LMAccessibility.remeasure();
  res.hudTimerOne = e.intervals.size === 1;
  /* back to 1: timer stopped */
  e.ctx.defaultmapsettings.a11yHudTextScale = 1;
  e.ctx.LMEvents.emit('settingsChange', { key: 'a11yHudTextScale', value: 1 });
  e.flush();
  res.hudBack = root['--lm-hud-text-scale'] === '1';
  res.hudTimerStopped = e.intervals.size === 0;
  /* the removed size symbols: an old saved a11yIndicators value adds no canvas, timer or frame hook */
  e.ctx.defaultmapsettings.a11yIndicators = true;
  e.ctx.LMEvents.emit('settingsChange', { key: 'a11yIndicators', value: true });
  e.flush();
  res.noSymbols = !e.doc.getElementById('lm-a11y-ind') && e.intervals.size === 0;
  res.noSymbolApi = !('frame' in e.ctx.LMAccessibility) && !('drawSymbol' in e.ctx.LMAccessibility) && !('classify' in e.ctx.LMAccessibility._core);
  /* another key: nothing */
  e.ctx.defaultmapsettings.a11yTextScale = 1.5;
  e.ctx.LMEvents.emit('settingsChange', { key: 'showGrid', value: true });
  e.flush();
  res.otherKeyIgnored = root['--lm-font-scale'] === '1.3';

  /* HUD text size already set at start: the timer runs from the start */
  e = makeEnv(Object.assign({}, DEF, { a11yHudTextScale: 1.4 }));
  i18n(e.ctx);
  e.run(src);
  e.flush();
  res.hudAtStart = e.intervals.size === 1 && e.doc.documentElement.style['--lm-hud-text-scale'] === '1.4';
  console.log('  ' + label + ': ' + JSON.stringify(res));
  return res;
}

const r = suite('current', fs.readFileSync(srcPath, 'utf8'));
check('default text sizes: no setInterval', r.noTimerDefault);
check('settingsChange a11yTextScale: applied at once, still no timer', r.menuApplied && r.noTimerMenu);
check('settingsChange a11yHudTextScale 1.2: applied, one timer for HUD parts made later', r.hudApplied && r.hudTimer && r.hudTimerOne);
check('HUD text size back to 1: applied, timer stopped', r.hudBack && r.hudTimerStopped);
check('size symbols removed: an old saved a11yIndicators adds nothing', r.noSymbols && r.noSymbolApi);
check('another key changes nothing', r.otherKeyIgnored);
check('HUD text size set at start: its timer runs from the start', r.hudAtStart);
if (oldPath) {
  const o = suite('older', fs.readFileSync(oldPath, 'utf8'));
  check('older version polled with default settings (comparison is real)', !o.noTimerDefault);
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
