#!/usr/bin/env node
// Every page in sitemap.xml is translated or a documented exception:
// - a web page loads https://www.legendmod.ml/lib/lm-i18n.js; every area in its data-areas exists
//   (developers/i18n/src/<area>.json), and every key it uses (data-i18n* attributes and lmT / key-function
//   calls in its own scripts) is in the areas it loads (site + data-areas, + the mod's areas with "mod");
// - a game page loads the mod runtime (languages/lm-i18n.js) and its keys are in the mod's areas;
// - no page loads an old languages/LanguagePack*.js (it switched the chosen language back to English);
// - the page is in scan-config.json "strict" (no hard-coded texts left);
// - otherwise it is listed in EXCEPTIONS below or in scan-config.json "archived", with the reason.
// Usage: node developers/tests/i18n-sitemap.js
'use strict';
const fs = require('fs');
const path = require('path');
const I = require('../i18n/lib');

const repo = path.resolve(__dirname, '..', '..');
const config = JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'i18n', 'scan-config.json'), 'utf8'));
/* pages that need no runtime, and why */
const EXCEPTIONS = {
    'nicks/emoji/index.html': 'an emoji grid to copy from: no text of its own'
};
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

const all = I.readAll();
const areaKeys = {};
Object.keys(all).forEach((a) => { areaKeys[a] = new Set(Object.keys(all[a])); });
const modAreas = Object.keys(all).filter((a) => !I.isSiteArea(a));
const has = (areas, k) => areas.some((a) => areaKeys[a] && areaKeys[a].has(k));

const xml = fs.readFileSync(path.join(repo, 'sitemap.xml'), 'utf8');
const locs = (xml.match(/<loc>[^<]+<\/loc>/g) || []).map((l) => l.replace(/<\/?loc>/g, '').trim());
ok(locs.length > 20, 'sitemap.xml lists ' + locs.length + ' pages');
const KEY_FNS = (config.keyFunctions || ['lmT']).map((f) => f.replace(/\./g, '\\.'));
const callRe = new RegExp('(?:^|[^\\w$.])(?:' + KEY_FNS.join('|') + ')\\(\\s*([\'"])([A-Za-z0-9_.-]+)\\1', 'g');
let checked = 0, keys = 0;
locs.forEach((loc) => {
    const u = new URL(loc);
    if (u.hostname !== 'www.legendmod.ml') return;
    let rel = decodeURIComponent(u.pathname.replace(/^\//, ''));
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = path.join(repo, rel);
    if (!fs.existsSync(file)) { ok(false, loc + ': ' + rel + ' is missing'); return; }
    checked++;
    if (EXCEPTIONS[rel] || (config.archived || {})[rel]) return;
    const html = fs.readFileSync(file, 'utf8');
    const site = /<script[^>]+src="https:\/\/www\.legendmod\.ml\/lib\/lm-i18n\.js[^"]*"[^>]*>/.exec(html);
    const mod = /<script[^>]+src="https:\/\/www\.legendmod\.ml\/languages\/lm-i18n\.js[^"]*"[^>]*>/.test(html);
    ok(site || mod, rel + ': no translation runtime (lib/lm-i18n.js or languages/lm-i18n.js) and no documented exception');
    ok(!/languages\/LanguagePack[A-Za-z]+\.js/.test(html), rel + ': loads an old LanguagePack*.js');
    ok(config.strict.indexOf(rel) >= 0, rel + ': not in scan-config.json "strict"');
    let areas = ['site'];
    if (site) {
        const m = /data-areas="([^"]*)"/.exec(site[0]);
        (m ? m[1].split(/[\s,]+/).filter(Boolean) : []).forEach((a) => {
            if (a === 'mod') { areas = areas.concat(modAreas); return; }
            ok(!!all[a], rel + ': data-areas names "' + a + '", which has no developers/i18n/src/' + a + '.json');
            areas.push(a);
        });
    }
    if (mod) areas = areas.concat(modAreas);
    const used = new Set();
    (html.match(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g) || []).forEach((x) => {
        if (/^data-i18n-vars=/.test(x)) return;
        used.add(x.replace(/^[^"]*"/, '').replace(/"$/, ''));
    });
    let m;
    /* a key that ends with a dot is a prefix the script completes (lmT('site.x.' + name)) */
    while ((m = callRe.exec(html))) if (/\./.test(m[2]) && !/\.$/.test(m[2])) used.add(m[2]);
    used.forEach((k) => { keys++; ok(has(areas, k), rel + ': key ' + k + ' is in none of its areas (' + areas.filter((a) => a.indexOf('site') === 0).join(', ') + (mod ? ', mod' : '') + ')'); });
});
/* The pages of expanding.land and help.expanding.land use the same runtime and areas from this repo: every key
 * they use must be in the areas they load, or that text stays English in every language (the binding-policy
 * note of their privacy and terms pages did). Their checkouts: CROSS_EL_DIR / CROSS_HELP_DIR, else next to
 * this repo; skipped when not there. */
const parent = path.resolve(repo, '..');
const SIBLINGS = [['expanding.land', process.env.CROSS_EL_DIR || path.join(parent, 'expandingland')],
    ['help.expanding.land', process.env.CROSS_HELP_DIR || path.join(parent, 'legendworld-help')]];
let sibPages = 0;
SIBLINGS.forEach(([host, dir]) => {
    if (!fs.existsSync(path.join(dir, 'index.html'))) { console.log('skip ' + host + ': no checkout at ' + dir); return; }
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
        if (e.name.charAt(0) === '.' || e.name === 'node_modules') return;
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (/\.html$/.test(e.name)) {
            const html = fs.readFileSync(f, 'utf8');
            const site = /<script[^>]+src="https:\/\/www\.legendmod\.ml\/lib\/lm-i18n\.js[^"]*"[^>]*>/.exec(html);
            if (!site) return;
            sibPages++;
            const rel = host + '/' + path.relative(dir, f).split(path.sep).join('/');
            const m = /data-areas="([^"]*)"/.exec(site[0]);
            let areas = ['site'];
            (m ? m[1].split(/[\s,]+/).filter(Boolean) : []).forEach((a) => { if (a === 'mod') areas = areas.concat(modAreas); else areas.push(a); });
            (html.match(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g) || []).forEach((x) => {
                if (/^data-i18n-vars=/.test(x)) return;
                const k = x.replace(/^[^"]*"/, '').replace(/"$/, '');
                keys++;
                ok(has(areas, k), rel + ': key ' + k + ' is in none of its areas (' + areas.filter((a) => a.indexOf('site') === 0).join(', ') + ')');
            });
        }
    });
    walk(dir);
});
if (sibPages) console.log(sibPages + ' pages of expanding.land / help.expanding.land checked');
console.log(checked + ' sitemap pages, ' + keys + ' keys checked; exceptions: ' + Object.keys(EXCEPTIONS).map((k) => k + ' (' + EXCEPTIONS[k] + ')').join('; ') +
    '; archived: ' + locs.map((l) => { const r = new URL(l).pathname.replace(/^\//, '').replace(/(^|\/)$/, '$1index.html'); return (config.archived || {})[r] ? r : null; }).filter(Boolean).join(', '));
console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
