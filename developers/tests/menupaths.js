#!/usr/bin/env node
// Texts that tell a player where to find something name a place that is still there, in every
// language of the language sources (developers/i18n/src):
// - Settings > Line split help: mouse buttons are bound in the Hotkeys window's key fields; its
//   Mouse control section is gone (mouse buttons became hotkeys), so the help does not send the
//   player there.
// Usage: node developers/tests/menupaths.js
'use strict';
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'i18n', 'src');
const read = (f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf8'));
const S = read('settings.json'), G = read('game1.json');
let fails = 0, checked = 0;
const ok = (c, m) => { checked++; if (!c) { fails++; console.log('FAIL ' + m); } };

/* the old section's name is still in the sources (settings.mouseGroup): an older export or a
 * script may show it, but no help text may point at it */
const help = G['game1.set.lineSplitHelp'];
ok(help && help.en, 'game1.set.lineSplitHelp exists');
for (const lang of Object.keys(help || {})) {
    const t = help[lang], gone = S['settings.mouseGroup'][lang], win = S['settings.hotkeys'][lang];
    ok(gone && t.indexOf(gone) < 0, lang + ': Line split help sends the player to the removed "' + gone + '" section: ' + t.slice(0, 160));
    ok(win && t.indexOf(win) >= 0, lang + ': Line split help names the Hotkeys window ("' + win + '")');
}

console.log((fails ? 'FAIL' : 'ok') + ' menupaths: ' + checked + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
