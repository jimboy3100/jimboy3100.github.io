/* The public settings catalog (knowledge/settings.json, linked from llms.txt) and the visual test
 * checklist (developers/visual-test-checklist.md) against the real code.
 * - Every switch that turns on one of Legend Mod's own modules (a defaultmapsettings key whose
 *   comment names its ogario/modules/<name>.js and that has a Settings switch) is in the catalog:
 *   a clean-up of retired entries had also dropped the live Notification centre switch.
 * - The checklist names only code that exists and only the origins the theme bridge accepts.
 * node developers/tests/knowledge.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (extra ? '  (' + extra + ')' : '')); if (!c) fail++; };

const main = read('ogario/ogario.v4.js');
const lines = main.split('\n');

/* the Settings switches: keys in addOptions([...]) / addOptionTo / addSliderBox calls that are not commented out */
const live = new Set();
for (const line of lines) {
  if (/^\s*\/\//.test(line)) continue;
  let m, re = /addOptions\(\[([^\]]*)\]/g;
  while ((m = re.exec(line))) m[1].replace(/["']([A-Za-z0-9_]+)["']/g, (a, k) => live.add(k));
  re = /add(?:OptionTo|SliderBox)\(\s*["'][^"']*["']\s*,\s*["']([A-Za-z0-9_]+)["']/g;
  while ((m = re.exec(line))) live.add(m[1]);
}
const start = main.indexOf('var defaultmapsettings = {');
check('defaultmapsettings found', start >= 0);
const body = main.slice(start, main.indexOf('\n};', start)).split('\n');
const modules = [];
for (const l of body) {
  const m = /^    ([A-Za-z0-9_]+):\s*(true|false),?\s*\/\*.*\(ogario\/modules\/([a-z0-9-]+)\.js/.exec(l);
  if (m && live.has(m[1])) modules.push(m[1] + ' (' + m[3] + '.js)');
}
check('module switches found', modules.length >= 5, modules.length);

let catalog = null;
try { catalog = JSON.parse(read('knowledge/settings.json')); } catch (e) { }
check('knowledge/settings.json is valid JSON with categories', !!catalog && Array.isArray(catalog.categories));
const listed = new Set();
(catalog && catalog.categories || []).forEach(c => (c.settings || []).forEach(s => listed.add(s)));
const missing = modules.filter(m => !listed.has(m.split(' ')[0]));
check('every module switch is in the settings catalog', missing.length === 0, missing.join(', ') || modules.length + ' switches');

/* the visual checklist */
const list = read('developers/visual-test-checklist.md');
const bridge = read('lib/lm-theme-bridge.js');
const code = [main, bridge, read('LMexpress/LMexpress.js'), read('LMexpress/lm_extended_ui.js'), read('LMmobile/LMmobile.js'), read('LMmobile/LMmobile-editor.js')].join('\n');
const names = [];
list.replace(/`([^`\n]+)`/g, (a, t) => {
  t = t.trim();
  if (/^(--lm-[a-z0-9-]+|\.lm-[a-z0-9-]+|[A-Za-z_$][A-Za-z0-9_$]*(\(\))?)$/.test(t) && !/^(node|calc|var)$/.test(t)) names.push(t.replace(/\(\)$/, '').replace(/^\./, ''));
});
const gone = names.filter(n => code.indexOf(n) < 0);
check('the checklist names only code that exists', names.length > 5 && gone.length === 0, gone.join(', ') || names.length + ' names');
const accepted = (bridge.match(/var LEGEND = \[([^\]]*)\]/) || ['', ''])[1];
const hosts = [];
list.replace(/\b((?:www\.)?legendmod\.[a-z]+|jimboy3100\.github\.io)\b/g, (a, h) => hosts.push(h));
const wrong = hosts.filter(h => accepted.indexOf('https://' + h + "'") < 0 && accepted.indexOf('https://www.' + h + "'") < 0);
check('the checklist names only origins the theme bridge accepts', wrong.length === 0, wrong.join(', ') || hosts.length + ' names');

/* what the checklist says the bridge's image() does is what it does: run the real function */
let image = null;
try {
  const q = /var PUBLIC_Q = [^\n]*;/.exec(bridge)[0], f = bridge.indexOf('function image(v) {');
  const src = bridge.slice(f, bridge.indexOf('\n    }\n', f) + 6);
  image = require('vm').runInNewContext(q + src + '; image', { URL });
} catch (e) { }
check('the bridge image() check is found', typeof image === 'function');
const row = (list.split('\n').find(l => /^\| 7\.1 \|/.test(l)) || '').toLowerCase();
if (image) {
  check('a user:pass@ image is refused as the checklist says', image('https://u:p@i.imgur.com/a.png') === '' && /user:pass@/.test(row) && /refused/.test(row));
  check('a non-https image is refused as the checklist says', image('http://i.imgur.com/a.png') === '' && /non-https/.test(row));
  const frag = image('https://i.imgur.com/a.png#x');
  /* the fragment is dropped, the image itself kept */
  check('the checklist describes what happens to a fragment', frag === 'https://i.imgur.com/a.png' ? !/fragment is refused|or a fragment is refused/.test(row) && /fragment/.test(row) : /fragment is refused|or a fragment is refused/.test(row), frag);
}

console.log(fail ? fail + ' check(s) failed' : 'knowledge: all checks passed');
process.exit(fail ? 1 : 0);
