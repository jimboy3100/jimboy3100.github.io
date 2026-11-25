#!/usr/bin/env node
/*
 * Adds English texts to an area file (creates developers/i18n/src/<area>.json when it is new).
 *
 *   node developers/i18n/add.js <area> <key> "<English text>"
 *   node developers/i18n/add.js <area> --file new.json      new.json: { "key": "English text", ... }
 *                                                           or { "key": { "en": "..", "el": "..", ... } }
 * Keys must start with the area name, dashes as dots: core -> "core.", site-index -> "site.index." (core.json
 * also holds the old un-prefixed lmT keys). An existing key
 * keeps its translations unless its English changed (then they are emptied: they need a new look).
 * Then: node developers/i18n/todo.js --lang el --area <area> > el.json, translate, merge.js, build.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const I = require('./lib');

const [area, a2, a3] = process.argv.slice(2);
if (!area || !/^[a-z0-9-]+$/.test(area) || !a2) {
    console.error('usage: node add.js <area> <key> "<English>"  |  node add.js <area> --file new.json');
    process.exit(1);
}
let items;
if (a2 === '--file') items = JSON.parse(fs.readFileSync(a3, 'utf8'));
else { items = {}; items[a2] = a3; }
const file = path.join(I.SRC, area + '.json');
const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const all = I.readAll();
let added = 0, changed = 0;
const errors = [];
Object.keys(items).forEach((k) => {
    if (k.indexOf(I.areaPrefix(area)) !== 0) { errors.push(k + ': must start with "' + I.areaPrefix(area) + '"'); return; }
    Object.keys(all).forEach((a) => { if (a !== area && all[a][k]) errors.push(k + ': already in ' + a + '.json'); });
    const v = items[k];
    const row = typeof v === 'string' ? { en: v } : v;
    if (!row || typeof row.en !== 'string' || !row.en) { errors.push(k + ': no English text'); return; }
    const old = data[k];
    if (!old) { data[k] = row; added++; return; }
    if (old.en !== row.en) { I.CODES.forEach((c) => { if (c !== 'en' && !row[c]) old[c] = ''; }); changed++; }
    Object.keys(row).forEach((f) => { if (row[f] !== '') old[f] = row[f]; });
});
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
I.writeArea(area, data);
console.log(area + '.json: ' + added + ' added, ' + changed + ' with a new English text');
