#!/usr/bin/env node
/*
 * Web pages: a data-i18n element gets its text replaced by the pack text (runtime apply() sets
 * textContent), and the packs hold trimmed texts. A &nbsp; or a space that separates the element
 * from the text or tag next to it must therefore sit outside the element, or the words run
 * together in every language ("FPS ilimitadodesbloqueado").
 *
 *   node developers/tests/i18n-spacing.js [repo]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
const I = require(path.join(repo, 'developers', 'i18n', 'lib'));
const all = I.readAll();
const en = {};
Object.keys(all).forEach((a) => Object.keys(all[a]).forEach((k) => { en[k] = all[a][k].en; }));

function pages(dir, out) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
        if (d.name[0] === '.' || d.name === 'node_modules' || d.name === 'developers') return;
        const p = path.join(dir, d.name);
        if (d.isDirectory()) { if (path.relative(repo, p).split(path.sep).length < 3) pages(p, out); } else if (/\.html$/.test(d.name)) out.push(p);
    });
    return out;
}

/* the text the visitor sees: &nbsp; (U+00A0) and white space as one space, both are lost the same way */
const NBSP = String.fromCharCode(160);
const shown = (s) => s.replace(/&nbsp;/g, ' ').split(NBSP).join(' ').replace(/\s+/g, ' ');
/* at the edge of a block element a lost space changes nothing */
const BLOCK = /^(p|div|li|h[1-6]|td|th|section)$/i;

let fail = 0, checked = 0;
pages(repo, []).forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    if (html.indexOf('lm-i18n.js') < 0) return;
    const re = /<(\w+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/g;
    let m;
    while ((m = re.exec(html))) {
        const tag = m[1], key = m[2], text = m[3];
        if (en[key] === undefined || BLOCK.test(tag)) continue;
        checked++;
        const before = html.charAt(m.index - 1), after = html.charAt(m.index + m[0].length);
        const t = shown(text), packed = shown(en[key]);
        const lost = [];
        /* the element touches what is next to it and its edge space is not in the pack text */
        if (/^[ ]/.test(t) && !/^[ ]/.test(packed) && !/\s/.test(before) && !/^[\r\n]/.test(text)) lost.push('leading space');
        if (/[ ]$/.test(t) && !/[ ]$/.test(packed) && after && !/\s/.test(after) && !/[\r\n][ \t]*$/.test(text)) lost.push('trailing space');
        if (lost.length) {
            fail++;
            console.log('FAIL ' + path.relative(repo, file) + ' ' + key + ': ' + lost.join(', ') + ' would be dropped by the language pack (move it outside the element)');
        }
    }
});
console.log('i18n-spacing: ' + checked + ' data-i18n texts checked, ' + fail + ' problems');
process.exitCode = fail ? 1 : 0;
