#!/usr/bin/env node
// Texts that tell a player where to find something name a place that is still there, in every
// language of the language sources (developers/i18n/src):
// - Settings > Line split help: mouse buttons are bound in the Hotkeys window's key fields; its
//   Mouse control section is gone (mouse buttons became hotkeys), so the help does not send the
//   player there;
// - the home page's FPS tips: "Short mass" is the Mass format choice Short (12.3k) now.
// Usage: node developers/tests/menupaths.js
'use strict';
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'i18n', 'src');
const read = (f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf8'));
const S = read('settings.json'), G = read('game1.json'), SI = read('site-index.json'), MG = read('pkg-mg.json');
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

const tip = SI['site.index.useShortMassOption'];
ok(tip && tip.en, 'site.index.useShortMassOption exists');
for (const lang of Object.keys(tip || {})) {
    const t = tip[lang], name = S['settings.massFormat'][lang], choice = MG['pkg.mg.massShort'][lang];
    ok(t.indexOf('Short mass') < 0 && t.indexOf(S['settings.shortMass'][lang].replace(/\s*[(（]k[)）]$/, '')) < 0,
        lang + ': FPS tip names the removed "Short mass" switch: ' + t);
    ok(t.indexOf(name) >= 0 && t.indexOf(choice) >= 0, lang + ': FPS tip names "' + name + '" and its choice "' + choice + '": ' + t);
}
/* the English text written into the page (shown before the language pack is applied) */
const page = fs.readFileSync(path.resolve(__dirname, '..', '..', 'index.html'), 'utf8');
const m = page.match(/data-i18n="site\.index\.useShortMassOption">([^<]*)</);
ok(m && m[1] === tip.en, 'index.html has the English FPS tip of the language source: ' + (m && m[1]));

console.log((fails ? 'FAIL' : 'ok') + ' menupaths: ' + checked + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
