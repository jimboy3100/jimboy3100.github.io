#!/usr/bin/env node
// What the website says about its releases, its feed and its search box is true:
// - rss.xml and opensearch.xml point only at files and changelog anchors that exist here, and the
//   pages link the feed and the search description that exist; no page description, feed text or
//   search description calls Legend Mod "the best agar.io extension" (nothing backs that up).
// Usage: node developers/tests/releasefacts.js
'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
let fails = 0, checked = 0;
const ok = (c, m) => { checked++; if (!c) { fails++; console.log('FAIL ' + m); } };
const read = (f) => fs.readFileSync(path.join(repo, f), 'utf8');
const SITE_HOSTS = ['www.legendmod.ml', 'legendmod.ml', 'jimboy3100.github.io'];
const SUPERLATIVE = /\bthe best agar\.?io (extension|mod|client)\b/i;

/* the local file (and anchor) an address of this site leads to; null for other sites */
function local(u) {
    const url = new URL(u, 'https://www.legendmod.ml/');
    if (SITE_HOSTS.indexOf(url.hostname) < 0) return null;
    let p = decodeURIComponent(url.pathname.replace(/^\//, ''));
    if (!p || p.endsWith('/')) p += 'index.html';
    return { file: p, hash: url.hash.replace(/^#/, '') };
}
function exists(u, where) {
    const l = local(u);
    ok(!!l, where + ': ' + u + ' is an address of this site');
    if (!l) return;
    const f = path.join(repo, l.file);
    ok(fs.existsSync(f), where + ': ' + u + ' leads to ' + l.file + ', which does not exist');
    if (l.hash && fs.existsSync(f)) ok(new RegExp('\\sid="' + l.hash + '"').test(fs.readFileSync(f, 'utf8')), where + ': ' + u + ' names #' + l.hash + ', which ' + l.file + ' does not have');
}
const tags = (xml, name) => (xml.match(new RegExp('<' + name + '\\b[^>]*>([\\s\\S]*?)</' + name + '>', 'g')) || [])
    .map((t) => t.replace(new RegExp('^<' + name + '\\b[^>]*>|</' + name + '>$', 'g'), '').trim());

/* ---- rss.xml ---- */
const rss = read('rss.xml');
const channel = rss.replace(/<item>[\s\S]*<\/item>/, '');
ok(/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(rss) && /<rss version="2\.0"/.test(rss), 'rss.xml is an RSS 2.0 document');
exists(tags(channel, 'link')[0], 'rss.xml channel link');
exists((rss.match(/<atom:link href="([^"]+)" rel="self"/) || [])[1] || '', 'rss.xml self link');
exists(tags(tags(channel, 'image')[0] || '', 'url')[0] || '', 'rss.xml image');
const items = tags(rss, 'item');
ok(items.length > 0, 'rss.xml has items');
items.forEach((it, i) => {
    const link = tags(it, 'link')[0] || '';
    exists(link, 'rss.xml item ' + (i + 1));
    ok(tags(it, 'guid')[0] === link, 'rss.xml item ' + (i + 1) + ': its guid is its link (' + link + ')');
});
tags(rss, 'description').forEach((d) => ok(!SUPERLATIVE.test(d), 'rss.xml: unproven claim "' + d.slice(0, 120) + '"'));

/* ---- opensearch.xml ---- */
const os = read('opensearch.xml');
ok(/<OpenSearchDescription xmlns="http:\/\/a9\.com\/-\/spec\/opensearch\/1\.1\/">/.test(os), 'opensearch.xml is an OpenSearch 1.1 description');
exists(tags(os, 'Image')[0] || '', 'opensearch.xml image');
exists((os.match(/<Url type="application\/opensearchdescription\+xml" rel="self" template="([^"]+)"/) || [])[1] || '', 'opensearch.xml self link');
const search = (os.match(/<Url type="text\/html" template="([^"]+)"/) || [])[1] || '';
ok(/\{searchTerms\}/.test(search) && /site:www\.legendmod\.ml\b/.test(search), 'opensearch.xml searches this site for the typed words (' + search + ')');
ok(!SUPERLATIVE.test(os), 'opensearch.xml: no "the best" claim');

/* ---- the pages: their feed and search links, and their descriptions ---- */
const pages = (read('sitemap.xml').match(/<loc>[^<]+<\/loc>/g) || []).map((l) => local(l.replace(/<\/?loc>/g, '').trim())).filter(Boolean).map((l) => l.file);
ok(pages.length > 10, 'sitemap pages to check (' + pages.length + ')');
Array.from(new Set(pages)).forEach((p) => {
    if (!fs.existsSync(path.join(repo, p))) return;
    const html = read(p);
    (html.match(/<link\b[^>]*>/gi) || []).forEach((l) => {
        if (!/rel="(alternate|search)"/i.test(l) || !/type="application\/(rss\+xml|opensearchdescription\+xml)"/i.test(l)) return;
        const href = (l.match(/href="([^"]+)"/) || [])[1] || '';
        if (local(href)) exists(href, p + ' ' + (/rss/.test(l) ? 'feed' : 'search') + ' link');
    });
    (html.match(/<meta\b[^>]*(?:name|property)="(?:description|og:description|twitter:description|dcterms\.description)"[^>]*>/gi) || []).forEach((m) => {
        const c = (m.match(/content="([^"]*)"/) || [])[1] || '';
        ok(!SUPERLATIVE.test(c), p + ': unproven claim in its description "' + c.slice(0, 120) + '"');
    });
});

console.log(fails ? 'releasefacts: ' + fails + ' FAILED of ' + checked : 'releasefacts: all ' + checked + ' checks passed');
process.exit(fails ? 1 : 0);
