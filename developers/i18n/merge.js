#!/usr/bin/env node
/*
 * Merges translations back into developers/i18n/src/*.json.
 *
 *   node developers/i18n/merge.js <lang> <file.json> [--force]
 *        file.json: { "key": "translated text", ... } (the output of todo.js, filled in)
 * Every key must already exist in some area file. A text whose placeholders ({0}, {name}, %@,
 * HTML tags) differ from the English one is refused (listed) unless --force. Rebuild afterwards:
 *   node developers/i18n/build.js
 */
'use strict';
const fs = require('fs');
const I = require('./lib');

const [lang, file] = process.argv.slice(2);
const force = process.argv.indexOf('--force') >= 0;
if (I.CODES.indexOf(lang) < 0 || !file) { console.error('usage: node merge.js <' + I.CODES.join('|') + '> <file.json> [--force]'); process.exit(1); }
const tr = JSON.parse(fs.readFileSync(file, 'utf8'));
const all = I.readAll();
const where = {};
Object.keys(all).forEach((a) => Object.keys(all[a]).forEach((k) => { where[k] = a; }));
let n = 0;
const bad = [];
const unknown = [];
const touched = {};
Object.keys(tr).forEach((k) => {
    const v = tr[k];
    if (typeof v !== 'string' || !v.trim()) return;
    const a = where[k];
    if (!a) { unknown.push(k); return; }
    const e = all[a][k];
    if (!force && lang !== 'en' && I.placeholders(v).join('|') !== I.placeholders(e.en).join('|')) { bad.push(k); return; }
    if (e[lang] !== v) { e[lang] = v; n++; touched[a] = 1; }
});
Object.keys(touched).forEach((a) => I.writeArea(a, all[a]));
console.log('merged ' + n + ' ' + lang + ' texts into ' + (Object.keys(touched).join(', ') || 'nothing'));
if (unknown.length) console.log('unknown keys (skipped): ' + unknown.join(', '));
if (bad.length) { console.log('placeholders/tags differ from English (skipped, fix or use --force): ' + bad.join(', ')); process.exitCode = 2; }
