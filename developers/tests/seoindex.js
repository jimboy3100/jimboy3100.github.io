#!/usr/bin/env node
// Search engines get the pages we mean: every tracked web page is one of
// - in sitemap.xml (a page we want found),
// - kept out by robots.txt (Disallow) or marked noindex (tools the mod opens, helpers, old copies),
// - a listed exception below (verification files, dated clan articles reached by links);
// and no page is titled only with a host name. Expanding Land's checkout next to this one is checked too.
// Usage: node developers/tests/seoindex.js
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repo = path.resolve(__dirname, '..', '..');
const parent = path.dirname(repo);
let fails = 0, checked = 0;
const ok = (c, m) => { checked++; if (!c) { fails++; console.log('FAIL ' + m); } };

const EXCEPTIONS = {
    'www.legendmod.ml': [
        [/^google[0-9a-f]+\.html$/, 'search console verification file (its content must stay as given)'],
        [/^\.well-known\/pki-validation\//, 'certificate validation file'],
        [/^Lc\/articles\/[^/]+\.html$/, 'dated Legend Clan articles, reached by links from the clan pages'],
        [/^extras\/legendffa\.html$/, 'the Expanding Land FFA explainer shown on help.expanding.land']
    ],
    'expanding.land': []
};

function checkSite(dir, host) {
    const files = cp.execFileSync('git', ['-C', dir, 'ls-files', '*.html', '*.HTML', '*.htm'], { encoding: 'utf8' })
        .split('\n').filter(Boolean);
    const sm = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
    const locs = new Set((sm.match(/<loc>[^<]+<\/loc>/g) || []).map((l) => {
        const u = new URL(l.replace(/<\/?loc>/g, '').trim());
        let p = decodeURIComponent(u.pathname.replace(/^\//, ''));
        if (!p || p.endsWith('/')) p += 'index.html';
        return u.hostname === host ? p : null;
    }).filter(Boolean));
    const disallow = fs.readFileSync(path.join(dir, 'robots.txt'), 'utf8').split(/\r?\n/)
        .filter((l) => /^disallow:/i.test(l)).map((l) => l.split(':').slice(1).join(':').trim().replace(/^\//, '')).filter(Boolean);
    let n = 0;
    files.forEach((f) => {
        const html = fs.readFileSync(path.join(dir, f), 'utf8');
        const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
        const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
        if (title) ok(!/^\s*[\w.-]+\.(?:github\.io|ml|land|com)\s*$/i.test(title), host + '/' + f + ': the title is only a host name ("' + title.trim() + '")');
        if (locs.has(f)) { ok(!noindex, host + '/' + f + ': in the sitemap and noindex'); return; }
        if (disallow.some((d) => f.indexOf(d) === 0)) return;
        if ((EXCEPTIONS[host] || []).some((e) => e[0].test(f))) return;
        n++;
        ok(noindex, host + '/' + f + ': not in the sitemap, not kept out by robots.txt and not marked noindex');
    });
    ok(files.length > 0, host + ': ' + files.length + ' pages (' + n + ' outside the sitemap)');
}

checkSite(repo, 'www.legendmod.ml');

/* a Legend Clan article dated in its title (day.month.year) gives that day as its publication date,
 * not the day the file was last changed */
fs.readdirSync(path.join(repo, 'Lc', 'articles')).filter((n) => /\.html$/.test(n)).forEach((n) => {
    const html = fs.readFileSync(path.join(repo, 'Lc', 'articles', n), 'utf8');
    const d = ((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '').match(/\b(\d{1,2})\.(\d{1,2})\.(20\d\d)\b/);
    if (!d) return;
    const want = d[3] + '-' + ('0' + d[2]).slice(-2) + '-' + ('0' + d[1]).slice(-2);
    const got = (html.match(/itemprop="datePublished"\s+content="([^"]*)"/) || [])[1];
    ok(got === want, 'Lc/articles/' + n + ': datePublished ' + got + ', its title says ' + want);
});
const el = process.env.CROSS_EL_DIR || path.join(parent, 'expandingland');
if (fs.existsSync(path.join(el, 'sitemap.xml'))) checkSite(el, 'expanding.land');
else console.log('skip: no Expanding Land checkout at ' + el);

console.log(fails ? 'seoindex: ' + fails + ' FAILED of ' + checked : 'seoindex: all ' + checked + ' checks passed');
process.exit(fails ? 1 : 0);
