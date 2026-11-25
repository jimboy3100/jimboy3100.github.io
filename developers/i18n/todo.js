#!/usr/bin/env node
/*
 * Lists texts that still need a translation, as JSON ready to hand to a translator.
 *
 *   node developers/i18n/todo.js                     counts per area and language
 *   node developers/i18n/todo.js --lang el [--area settings] [--same] [--out file.json]
 *        { "key": "English text", ... } for every empty el text (with --same also the el texts
 *        that are a copy of the English one; quick chat commands settings.commN are left out:
 *        they are sent to teammates and stay English on purpose)
 * Fill the values in and give the file back with: node developers/i18n/merge.js el file.json
 */
'use strict';
const fs = require('fs');
const I = require('./lib');

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? (args[i + 1] || true) : null; };
const lang = opt('--lang');
const area = opt('--area');
const same = args.indexOf('--same') >= 0;
const all = I.readAll();

function wanted(key, e, code) {
    if (e.allowEmpty) return false;
    if (!e[code]) return true;
    return same && code !== 'en' && e[code] === e.en && !/^settings\.comm\d+$/.test(key) && key !== 'pack.translator';
}

if (!lang) {
    Object.keys(all).forEach((a) => {
        const counts = {};
        Object.keys(all[a]).forEach((k) => I.CODES.forEach((c) => { if (wanted(k, all[a][k], c)) counts[c] = (counts[c] || 0) + 1; }));
        console.log(a.padEnd(12), Object.keys(all[a]).length + ' keys', JSON.stringify(counts));
    });
    process.exit(0);
}
if (I.CODES.indexOf(lang) < 0) { console.error('unknown language ' + lang + ' (one of ' + I.CODES.join(' ') + ')'); process.exit(1); }
const res = {};
Object.keys(all).forEach((a) => {
    if (area && a !== area) return;
    Object.keys(all[a]).forEach((k) => { if (wanted(k, all[a][k], lang)) res[k] = all[a][k].en; });
});
const text = JSON.stringify(res, null, 2) + '\n';
const out = opt('--out');
if (out) { fs.writeFileSync(out, text); console.log(Object.keys(res).length + ' texts -> ' + out); } else process.stdout.write(text);
