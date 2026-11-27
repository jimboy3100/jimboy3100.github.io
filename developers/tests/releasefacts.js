#!/usr/bin/env node
// What the website says about its releases, its feed and its search box is true:
// - rss.xml and opensearch.xml point only at files and changelog anchors that exist here, and the
//   pages link the feed and the search description that exist; no page description, feed text or
//   search description calls Legend Mod "the best agar.io extension" (nothing backs that up);
// - changelog.html has an anchor (#v3701) for every released build (a "Version 3.xxx" commit) from
//   its oldest one on, newest first, dated by that commit, and is at most 10 builds behind;
//   rss.xml lists its newest releases with the times of their "Version" commits
//   (developers/tools/changelog-releases.js writes both).
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

/* ---- releases: changelog.html and rss.xml against the "Version 3.xxx" commits ---- */
const tool = require(path.join(repo, 'developers', 'tools', 'changelog-releases.js'));
let rels = [];
try { rels = tool.releases(repo); } catch (e) { console.log('skip releases: no git history (' + e.message.split('\n')[0] + ')'); }
if (rels.length) {
    const byV = {};
    rels.forEach((r) => { byV[r.v] = r; });
    const html = read('changelog.html');
    const entries = tool.changelogEntries(html);
    const ids = tool.anchors(html);
    ok(entries.length === ids.length && entries.length > 0, 'changelog.html: every release block is read (' + entries.length + ' of ' + ids.length + ')');
    const vs = ids.map(tool.versionOf).map(parseFloat);
    ok(vs.every((v, i) => !i || v < vs[i - 1]), 'changelog.html: releases newest first, each once');
    ids.forEach((id) => ok(!!byV[tool.versionOf(id)], 'changelog.html #' + id + ': a released build (it has a "Version ' + tool.versionOf(id) + '" commit)'));
    /* every build released since the oldest one on the page has its anchor */
    const oldest = vs[vs.length - 1], newest = vs[0];
    const missing = rels.filter((r) => parseFloat(r.v) >= oldest && parseFloat(r.v) <= newest && ids.indexOf(tool.anchorOf(r.v)) < 0).map((r) => r.v);
    ok(!missing.length, 'changelog.html: no released build is left out (' + missing.join(', ') + ')');
    /* a few builds may come out before their notes are written, not more */
    const behind = rels.filter((r) => parseFloat(r.v) > newest).map((r) => r.v);
    ok(behind.length <= 10, 'changelog.html stops at v' + newest.toFixed(3) + ', ' + behind.length + ' released builds after it (' + behind.slice(0, 3).join(', ') + '...): run node developers/tools/changelog-releases.js');
    entries.forEach((e) => {
        const r = byV[e.v];
        if (!r) return;
        ok(e.date === r.date, 'changelog.html #' + e.id + ': dated ' + e.date + ', its "Version" commit is from ' + r.date);
        ok(new RegExp('id="' + e.id + '"[^>]*>\\s*<div class="version-header">\\s*<span class="version-number">v' + e.v.replace('.', '\\.') + '</span>').test(html), 'changelog.html #' + e.id + ': shows v' + e.v);
        ok(e.title && e.items.length > 0, 'changelog.html #' + e.id + ': has a title and notes');
    });
    /* a release without language pack keys says it is English (lang) and why it has no keys
     * (data-i18n-off, which the hard-coded text scanner developers/i18n/scan.js honours) */
    (html.match(/<div class="version" id="v\d+"[^>]*>[\s\S]*?\n    <\/div>/g) || []).forEach((b) => {
        if (/data-i18n(-html)?="/.test(b)) return;
        ok(/^<div class="version" id="v\d+" lang="en" data-i18n-off="[^"]+">/.test(b), 'changelog.html ' + b.slice(0, 40) + ': English notes without pack keys are marked lang="en" data-i18n-off');
    });

    /* rss.xml: the newest releases of the page, each dated by its "Version" commit */
    const feed = tags(rss, 'item').map((it) => ({ title: tags(it, 'title')[0] || '', link: tags(it, 'link')[0] || '', date: tags(it, 'pubDate')[0] || '' }));
    ok(feed.length >= Math.min(10, entries.length), 'rss.xml lists the newest releases (' + feed.length + ')');
    feed.forEach((f, i) => {
        const e = entries[i] || {};
        ok(f.link === 'https://www.legendmod.ml/changelog.html#' + e.id, 'rss.xml item ' + (i + 1) + ' is the page\'s release ' + (i + 1) + ' (#' + e.id + '), not ' + f.link);
        ok(f.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>') === 'v' + e.v + ' — ' + e.title, 'rss.xml item ' + (i + 1) + ': title "' + f.title + '" is the page\'s "' + e.title + '"');
        const d = new Date(f.date);
        ok(!isNaN(d) && d.toUTCString().replace(/GMT$/, '+0000') === f.date, 'rss.xml item ' + (i + 1) + ': pubDate "' + f.date + '" is a valid RFC 822 date (weekday included)');
        const r = byV[e.v];
        ok(!!r && d.getTime() === new Date(r.iso).getTime(), 'rss.xml item ' + (i + 1) + ': pubDate ' + f.date + ' is the time of its "Version ' + e.v + '" commit (' + (r && r.iso) + ')');
    });
    const last = tags(channel, 'lastBuildDate')[0] || '';
    ok(!!feed[0] && last === feed[0].date, 'rss.xml lastBuildDate "' + last + '" is its newest item\'s date');

    /* the notes come from commit subjects as the tool reads them */
    const n1 = tool.noteOf('Hotkeys window: Close is the last button on the right again (Bound keys; Conflicts); the rest. Test x.js');
    ok(n1.area === 'Hotkeys window' && n1.text === 'Close is the last button on the right again (Bound keys; Conflicts)' && n1.tag === 'fix', 'a note: area, first sentence outside brackets, tag (' + JSON.stringify(n1) + ')');
    const n2 = tool.noteOf('Version 3.618 - Theme/HUD fixes, O(1) removeCell');
    ok(n2.text === 'Theme/HUD fixes, O(1) removeCell' && !n2.area, 'a "Version" commit with text gives its text (' + JSON.stringify(n2) + ')');
    ok(tool.devOnly('Version 3.701', ['play.html']) && !tool.devOnly('Version 3.618 - Theme fixes', ['play.html']) &&
        tool.devOnly('Probe x: passes', ['developers/tests/probes/x.js', 'developers/README.md']) && !tool.devOnly('Menu: y', ['developers/tests/a.js', 'ogario/ogario.v4.js']),
    'commits players do not see are left out (build number alone, developer files only)');
}

/* ---- versions in the project facts ---- */
/* softwareVersion of every entity in the three graph files: the same in each */
const jsonld = JSON.parse(read('knowledge/graph.jsonld'));
const vJson = {}, vTtl = {}, vRdf = {};
(jsonld['@graph'] || []).forEach((n) => { if (n['@id'] && n.softwareVersion) vJson[n['@id']] = String(n.softwareVersion); });
read('knowledge/graph.ttl').split(/\r?\n(?=<[^>]+> a )/).forEach((b) => {
    const s = /^<([^>]+)> a /.exec(b), v = /schema:softwareVersion "([^"]*)"/.exec(b);
    if (s && v) vTtl[s[1]] = v[1];
});
(read('knowledge/graph.rdf').match(/<rdf:Description rdf:about="[^"]+">[\s\S]*?<\/rdf:Description>/g) || []).forEach((b) => {
    const v = /<schema:softwareVersion>([^<]*)</.exec(b);
    if (v) vRdf[/rdf:about="([^"]+)"/.exec(b)[1]] = v[1];
});
const sorted = (o) => JSON.stringify(Object.keys(o).sort().map((k) => [k, o[k]]));
ok(Object.keys(vJson).length >= 2, 'graph.jsonld gives softwareVersions (' + sorted(vJson) + ')');
ok(sorted(vJson) === sorted(vTtl) && sorted(vJson) === sorted(vRdf), 'graph.jsonld, graph.ttl and graph.rdf give the same softwareVersions: ' + sorted(vJson) + ' / ' + sorted(vTtl) + ' / ' + sorted(vRdf));

/* Legend Mod's build: one number in every fact file, the newest release of the changelog, released and not newer than the code */
const facts = tool.buildFacts(repo);
const builds = Array.from(new Set(Object.keys(facts).map((f) => facts[f])));
ok(builds.length === 1 && /^\d\.\d{3}$/.test(builds[0]), 'every fact file gives one build of Legend Mod: ' + JSON.stringify(facts));
const ogVer = (read('ogario/ogario.v4.js').match(/window\.OgVer = ([\d.]+);/) || [])[1];
ok(!!ogVer && parseFloat(builds[0]) <= parseFloat(ogVer), 'the stated build ' + builds[0] + ' is not newer than window.OgVer ' + ogVer);
if (rels.length) {
    const newestAnchor = tool.versionOf(tool.anchors(read('changelog.html'))[0] || 'v0');
    ok(builds[0] === newestAnchor, 'the stated build ' + builds[0] + ' is the changelog\'s newest release ' + newestAnchor + ' (node developers/tools/changelog-releases.js sets both)');
    ok(rels.some((r) => r.v === builds[0]), 'the stated build ' + builds[0] + ' has its "Version" commit');
}

/* Legend Express extension: one version in the facts, one the extension manifest really had */
const ext = JSON.parse(read('knowledge/extension.json'));
const llms = read('llms-full.txt');
const llmsExt = (llms.match(/Chrome extension "Legend Express" \(manifest v3, version ([\d.]+)/) || [])[1];
ok(!!ext.version && vJson['https://www.legendmod.ml/#extension'] === ext.version && llmsExt === ext.version,
    'the extension version is the same in graph.jsonld (' + vJson['https://www.legendmod.ml/#extension'] + '), knowledge/extension.json (' + ext.version + ') and llms-full.txt (' + llmsExt + ')');
const manifestNow = JSON.parse(read('LMexpress/extension/manifest.json')).version;
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
ok(cmp(ext.version, manifestNow) <= 0, 'the stated extension version ' + ext.version + ' is not newer than the manifest (' + manifestNow + ')');
if (rels.length) {
    let had = '';
    try { had = require('child_process').execFileSync('git', ['-C', repo, 'log', '--format=%h', '-S"version": "' + ext.version + '"', '--', 'LMexpress/extension/manifest.json'], { encoding: 'utf8' }).trim(); } catch (e) { }
    ok(!!had, 'the extension manifest had the version ' + ext.version + ' (git history)');
}

/* Legend Express userscript: its @version everywhere it is named */
const us = (read('LMexpress/LMexpress.user.js').match(/\/\/ @version\s+(\S+)/) || [])[1];
const latest = (read('LMexpress/LMexpress.js').match(/var LMX_LATEST = \{ userscript: '([^']+)'/) || [])[1];
const llmsUs = (llms.match(/\*\*Userscript\*\*:[^\n]*version (\d+(?:\.\d+)*)/) || [])[1];
const home = read('index.html');
const homeUs = (home.match(/data-i18n-html="site\.index\.legendExpressV18"[\s\S]*?Legend Express v([\d.]+)/) || [])[1];
ok(!!us && latest === us && llmsUs === us && homeUs === us, 'the userscript version ' + us + ' is the update notice\'s newest (' + latest + '), llms-full.txt\'s (' + llmsUs + ') and the home page install button\'s (' + homeUs + ')');
const packs = JSON.parse(read('developers/i18n/src/site-index.json'))['site.index.legendExpressV18'] || {};
const wrongLang = Object.keys(packs).filter((l) => (packs[l].match(/Legend Express v([\d.]+)/) || [])[1] !== us);
ok(Object.keys(packs).length >= 12 && !wrongLang.length, 'the install button names Legend Express v' + us + ' in every language (' + (wrongLang.map((l) => l + ': ' + packs[l].replace(/<[^>]+>/g, '').trim()).join(', ') || Object.keys(packs).length + ' languages') + ')');

console.log(fails ? 'releasefacts: ' + fails + ' FAILED of ' + checked : 'releasefacts: all ' + checked + ' checks passed');
process.exit(fails ? 1 : 0);
