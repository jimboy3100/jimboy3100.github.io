// Phone preferences (LMmobile.js 'lm-mobile-prefs') and settings profiles (ogario/modules/profiles.js):
// every preference the phone controls have is kept by a settings profile (MOBILE_SCHEMA), its default is
// a valid value there, and the profile comparison has a name for it in every language. The objects are
// taken from the real sources. Up to 3.698 six later preferences (fixed joystick, dead zone, compact
// leaderboard, a since removed response curve, zoom and free spectate buttons) had no name: the comparison showed
// "modules.profiles.m_fixedJoystick" (now pkg.agm.m_<key>).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const repo = path.resolve(__dirname, '..', '..');
let failed = 0;
const ok = (cond, name) => { console.log((cond ? 'ok   ' : 'FAIL ') + name); if (!cond) failed++; };
/* the object literal that follows `marker` in a source file, evaluated on its own */
function literal(file, marker) {
  const src = fs.readFileSync(path.join(repo, file), 'utf8');
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(marker + ' not found in ' + file);
  let i = src.indexOf('{', at), depth = 0, j = i;
  for (; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) break;
  }
  return vm.runInNewContext('(' + src.slice(i, j + 1) + ')');
}
const prefs = literal('LMmobile/LMmobile.js', 'var prefs = {');
const schema = literal('ogario/modules/profiles.js', 'var MOBILE_SCHEMA = {');
const texts = {};
fs.readdirSync(path.join(repo, 'developers', 'i18n', 'src')).filter(f => f.endsWith('.json')).forEach(f => {
  Object.assign(texts, JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'i18n', 'src', f), 'utf8')));
});
const LANGS = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl', 'pt', 'id', 'ja', 'it'];
Object.keys(prefs).forEach(k => {
  const r = schema[k], v = prefs[k];
  ok(r !== undefined, k + ': kept by settings profiles');
  if (r === undefined) return;
  if (Array.isArray(r) && typeof r[0] === 'string') ok(r.indexOf(v) >= 0, k + ': default ' + JSON.stringify(v) + ' is one of ' + r.join('/'));
  else if (Array.isArray(r)) ok(typeof v === 'number' && v >= r[0] && v <= r[1], k + ': default ' + v + ' within ' + r.join('..'));
  else ok(typeof v === 'boolean', k + ': default is a switch');
  /* the profile window's own name, or the phone controls' one (profiles.js label()) */
  const t = texts['modules.profiles.m_' + k] || texts['pkg.agm.m_' + k];
  ok(!!t && LANGS.every(l => typeof t[l] === 'string' && t[l].trim()), k + ': named in the profile comparison in all ' + LANGS.length + ' languages');
});
Object.keys(schema).forEach(k => ok(k in prefs, k + ': a profile key the phone controls have'));
/* play.html loads LMmobile.js on phones with the page's own ?v= (it stayed at 3.697 while the page was
 * at 3.702: a phone could keep an old LMmobile.js from its cache next to new files) */
{
  const page = fs.readFileSync(path.join(repo, 'play.html'), 'utf8');
  const loader = /<script>\s*(\/\* A touch-only device[\s\S]*?)<\/script>/.exec(page);
  const core = /src="([^"]*\/ogario\/ogario\.v4\.js\?v=[^"]+)"/.exec(page);
  ok(!!loader && !!core, 'play.html: the phone loader and the ogario.v4.js tag found');
  if (loader && core) {
    const added = [];
    const doc = { querySelector: (sel) => (sel === 'script[src*="/ogario/ogario.v4.js"]' ? { src: core[1] } : null),
      createElement: () => ({}), body: { appendChild: (el) => added.push(el) } };
    const mm = (q) => ({ matches: q === '(pointer: coarse)' });
    vm.runInNewContext(loader[1], { document: doc, window: { matchMedia: mm }, matchMedia: mm });
    const v = /\?v=[^&#"]+/.exec(core[1])[0];
    ok(added.length === 1 && added[0].src === 'https://www.legendmod.ml/LMmobile/LMmobile.js' + v,
      'play.html: a phone loads LMmobile.js with the page\'s version (' + v + '): ' + (added[0] && added[0].src));
  }
}
console.log(failed ? failed + ' check(s) failed' : 'all phone preference checks passed');
process.exit(failed ? 1 : 0);
