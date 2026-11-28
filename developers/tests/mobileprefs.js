// Phone controls loader: play.html loads LMmobile.js on phones with the page's own ?v=.
// (The check of the phone preferences against the settings profiles went with the removed
// settings profiles.)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const repo = path.resolve(__dirname, '..', '..');
let failed = 0;
const ok = (cond, name) => { console.log((cond ? 'ok   ' : 'FAIL ') + name); if (!cond) failed++; };
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
