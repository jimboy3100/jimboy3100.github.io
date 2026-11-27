#!/usr/bin/env node
/* Release notes from the git history: changelog.html gets an anchor (#v3701) for every released
 * build that has none yet, newest first, and rss.xml lists the newest releases of the page.
 * A build is released by its "Version 3.xxx" commit; its date is that commit's date and its notes
 * are the subjects of the commits since the build before it (commits that change only developer
 * files, such as tests, tools and notes, are left out). The project facts (knowledge graph in its
 * three formats, llms-full.txt, the home page's structured data) then give the newest build of the
 * page as Legend Mod's softwareVersion. Run it after a "Version 3.xxx" commit:
 *   node developers/tools/changelog-releases.js          (writes changelog.html and rss.xml)
 *   node developers/tools/changelog-releases.js --check  (exit 1 when they are not up to date)
 * The functions are exported for developers/tests/releasefacts.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const RSS_ITEMS = 20;
const git = (repo, args) => cp.execFileSync('git', ['-C', repo].concat(args), { encoding: 'utf8', maxBuffer: 1 << 28 });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const anchorOf = (v) => 'v' + v.replace('.', '');
const versionOf = (id) => id.slice(1, 2) + '.' + id.slice(2);

/* the released builds, oldest first: {v, hash, date (YYYY-MM-DD of the commit), iso}; a build
 * number given twice counts from its newest commit */
function releases(repo) {
    const seen = {};
    git(repo, ['log', '--format=%H%x09%aI%x09%s', '--grep=^Version [0-9]\\.[0-9][0-9][0-9]']).split('\n').forEach((l) => {
        const p = l.split('\t'), m = /^Version (\d\.\d{3})\b/.exec(p[2] || '');
        if (m && !seen[m[1]]) seen[m[1]] = { v: m[1], hash: p[0], iso: p[1], date: p[1].slice(0, 10) };
    });
    return Object.keys(seen).map((k) => seen[k]).sort((a, b) => parseFloat(a.v) - parseFloat(b.v));
}

/* what a "Version 3.xxx" commit says besides the number ("Version 3.618 - Theme/HUD fixes, ..." ->
 * "Theme/HUD fixes, ..."), '' for the number alone */
function versionText(subject) {
    let t = subject.replace(/^Version \d\.\d{3}\b\s*/, '');
    if (/^\(.*\)$/.test(t)) t = t.slice(1, -1);
    return t.replace(/^[-;:,]\s*/, '').trim();
}

/* a commit that players do not see: only developer files, a build number alone, or only line endings */
function devOnly(subject, files) {
    if (/^Version \d\.\d{3}\b/.test(subject)) return !versionText(subject);
    if (/\bno line of code changes\b/i.test(subject)) return true;
    return files.length > 0 && files.every((f) => /^developers\//.test(f) || /\.md$/i.test(f));
}

/* one changelog line from a commit subject: its area (text before the first ": "), its first
 * sentence, and a tag from its words */
function noteOf(subject) {
    let area = '', rest = subject.trim().replace(/^(fix|feat|seo|perf|docs|chore)(\([^)]*\))?:\s*/i, '');
    if (/^Version \d\.\d{3}\b/.test(rest)) rest = versionText(rest);
    /* a file or code name (ogario.v4.js, skinsAndDeals) keeps its case */
    const cap = (s) => /^\S*\.\S|^[a-z]+[A-Z]/.test(s) ? s : s.charAt(0).toUpperCase() + s.slice(1);
    const m = /^([A-Za-z0-9][^:;]{1,58}?): (.+)$/.exec(rest);
    if (m && !/[.(]$/.test(m[1])) { area = cap(m[1]); rest = m[2]; }
    /* the first sentence: up to a "; " or ". X" outside brackets */
    for (let i = 0, d = 0; i < rest.length; i++) {
        const c = rest[i];
        if (c === '(') d++;
        else if (c === ')') d = Math.max(0, d - 1);
        else if (!d && rest[i + 1] === ' ' && (c === ';' || (c === '.' && /[A-Z(]/.test(rest[i + 2] || '')))) { rest = rest.slice(0, i); break; }
    }
    if (rest.length > 230) rest = rest.slice(0, 230).replace(/[\s,]+\S*$/, '') + '…';
    /* a cut inside brackets ends before the open bracket */
    while ((rest.match(/\(/g) || []).length > (rest.match(/\)/g) || []).length) rest = rest.slice(0, rest.lastIndexOf('(')).replace(/[\s,;:]+$/, '') + '…';
    rest = rest.replace(/[.\s]+$/, '').replace(/……$/, '…');
    if (!area) rest = cap(rest);
    let tag = 'change';
    if (/\b\d+(\.\d+)?\s?ms\b|\bper frame\b|\bfaster\b|\bstall|\bCPU\b|\ballocat|\bcosts? (less|about half)|\bhalf as much\b|\bO\(1\)/i.test(area + ': ' + rest)) tag = 'perf';
    else if (/^New\b|\b(adds?|added|new (option|switch|setting|window|button|hotkey|tool|feature|command|tab|page|mode|panel)s?)\b/i.test(area + ': ' + rest)) tag = 'new';
    else if (/\bno longer\b|\bagain\b|\bwrong\b|\berror\b|\bthrew\b|\bbroke|\bbug\b|\bfix(ed|es)?\b|\binstead of\b|\bstuck\b|\bmissing\b|\bwas (not|cut|hidden|lost)\b/i.test(subject)) tag = 'fix';
    return { area: area, text: rest, tag: tag };
}

/* the notes of a release: the player-facing commits since the build before it, oldest first;
 * a note already in seen (an earlier release, a commit applied twice) is listed once */
function notesOf(repo, prev, rel, seen) {
    seen = seen || new Set();
    const out = git(repo, ['log', '--no-merges', '--reverse', '--format=%x01%H%x09%s', '--name-only', prev.hash + '..' + rel.hash]);
    return out.split('\x01').filter(Boolean).map((b) => {
        const lines = b.split('\n'), head = lines[0].split('\t');
        return { hash: head[0], subject: head.slice(1).join('\t'), files: lines.slice(1).map((s) => s.trim()).filter(Boolean) };
    }).filter((c) => !devOnly(c.subject, c.files)).map((c) => noteOf(c.subject)).filter((n) => {
        const k = (n.area ? n.area + ' — ' : '') + n.text;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}

const TAGS = { new: 'New', fix: 'Fix', perf: 'Perf', change: 'Change' };
function titleOf(notes) {
    const areas = [];
    notes.forEach((n) => { if (n.area && n.area.length <= 40 && areas.indexOf(n.area) < 0) areas.push(n.area); });
    /* no short area: the first note's area or text up to its first comma or bracket, at most 6 words */
    if (!areas.length) return notes.length ? (notes[0].area || notes[0].text).split(/,| \(/)[0].split(/\s+/).slice(0, 6).join(' ').replace(/[,;:…]+$/, '') : 'Build update';
    const a = areas.slice(0, 3);
    return a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' & ' + a[a.length - 1];
}
function blockOf(rel, prev, notes) {
    const li = notes.length ? notes.map((n) => '            <li><span class="tag tag-' + n.tag + '">' + TAGS[n.tag] + '</span> ' +
        (n.area ? '<strong>' + esc(n.area) + '</strong> — ' : '') + esc(n.text) + '</li>') :
        ['            <li><span class="tag tag-change">Change</span> New build number; the code changes are on <a href="https://github.com/jimboy3100/jimboy3100.github.io/compare/' +
            prev.hash.slice(0, 8) + '...' + rel.hash.slice(0, 8) + '" target="_blank" rel="noopener">GitHub</a></li>'];
    /* English only: the notes are commit subjects (lang, and no language pack keys: data-i18n-off) */
    return ['    <div class="version" id="' + anchorOf(rel.v) + '" lang="en" data-i18n-off="release notes from the git history">',
        '        <div class="version-header">',
        '            <span class="version-number">v' + rel.v + '</span>',
        '            <span class="version-title">' + esc(titleOf(notes)) + '</span>',
        '            <time class="version-date" datetime="' + rel.date + '">' + rel.date + '</time>',
        '        </div>',
        '        <ul>'].concat(li, ['        </ul>', '    </div>', '', '']).join('\n');
}

const ANCHOR = /<div class="version" id="(v\d+)"[^>]*>/g;
const anchors = (html) => { const a = []; let m; ANCHOR.lastIndex = 0; while ((m = ANCHOR.exec(html))) a.push(m[1]); return a; };

/* changelog.html with every released build that has no anchor yet (above the newest one), and
 * with each release's date element giving the date of its "Version" commit */
function updateChangelog(repo, html) {
    const rels = releases(repo), byV = {};
    rels.forEach((r) => { byV[r.v] = r; });
    const have = anchors(html).map(versionOf);
    const newest = have.length ? Math.max.apply(null, have.map(parseFloat)) : 0;
    const seen = new Set(changelogEntries(html).reduce((a, e) => a.concat(e.items), []));
    let add = '';
    for (let i = 1; i < rels.length; i++) {
        if (parseFloat(rels[i].v) > newest) add = blockOf(rels[i], rels[i - 1], notesOf(repo, rels[i - 1], rels[i], seen)) + add;
    }
    const first = html.indexOf('    <div class="version" id="');
    if (add) html = first >= 0 ? html.slice(0, first) + add + html.slice(first) : html;
    return html.replace(/(<div class="version" id="(v\d+)"[^>]*>(?:(?!<div class="version" )[\s\S])*?)<span\b[^>]*class="version-date"[^>]*>[^<]*<\/span>/g, (all, head, id) => {
        const r = byV[versionOf(id)];
        return r ? head + '<time class="version-date" datetime="' + r.date + '">' + r.date + '</time>' : all;
    });
}

/* the releases of changelog.html, newest first: {id, v, title, date, text} */
function changelogEntries(html) {
    const out = [];
    const re = /<div class="version" id="(v\d+)"[^>]*>([\s\S]*?)\n    <\/div>/g;
    let m;
    while ((m = re.exec(html))) {
        const b = m[2], plain = (s) => unesc(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
        out.push({
            id: m[1], v: versionOf(m[1]),
            title: plain((b.match(/class="version-title">([\s\S]*?)<\/span>/) || [])[1] || ''),
            date: (b.match(/class="version-date" datetime="([\d-]+)"/) || [])[1] || '',
            items: (b.match(/<li\b[^>]*>[\s\S]*?<\/li>/g) || []).map((l) => plain(l.replace(/<span class="tag[^"]*">[^<]*<\/span>/, '')))
        });
    }
    return out;
}

const rfc822 = (iso) => new Date(iso).toUTCString().replace(/GMT$/, '+0000');
/* rss.xml with the newest releases of changelog.html, each dated by its "Version" commit */
function updateRss(repo, rss, html) {
    const byV = {};
    releases(repo).forEach((r) => { byV[r.v] = r; });
    const entries = changelogEntries(html).filter((e) => byV[e.v]).slice(0, RSS_ITEMS);
    if (!entries.length) return rss;
    const items = entries.map((e) => {
        let d = e.items.join(' · ');
        if (d.length > 600) d = d.slice(0, 600).replace(/\s+\S*$/, '') + '…';
        const url = 'https://www.legendmod.ml/changelog.html#' + e.id;
        return ['    <item>',
            '      <title>' + esc('v' + e.v + ' — ' + e.title) + '</title>',
            '      <link>' + url + '</link>',
            '      <guid isPermaLink="true">' + url + '</guid>',
            '      <pubDate>' + rfc822(byV[e.v].iso) + '</pubDate>',
            '      <description>' + esc(d) + '</description>',
            '    </item>'].join('\n');
    }).join('\n\n');
    const a = rss.indexOf('    <item>'), b = rss.lastIndexOf('</item>');
    if (a < 0 || b < 0) return rss;
    rss = rss.slice(0, a) + items + rss.slice(b + '</item>'.length);
    return rss.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>/, '<lastBuildDate>' + rfc822(byV[entries[0].v].iso) + '</lastBuildDate>');
}

/* Where the project facts give Legend Mod's build (the #app entity's softwareVersion): file -> the
 * pattern of that number (its first group is the text before it). They all give the newest build of
 * the changelog. */
const BUILD_FACTS = {
    'knowledge/graph.jsonld': /("@id": "https:\/\/www\.legendmod\.ml\/#app",[\s\S]*?"softwareVersion": ")([^"]*)"/,
    'knowledge/graph.ttl': /(<https:\/\/www\.legendmod\.ml\/#app> a [\s\S]*?schema:softwareVersion ")([^"]*)"/,
    'knowledge/graph.rdf': /(<rdf:Description rdf:about="https:\/\/www\.legendmod\.ml\/#app">[\s\S]*?<schema:softwareVersion>)([^<]*)</,
    'llms-full.txt': /(\nVersion: )(\S*)\r?\n/,
    'index.html': /("@id": "https:\/\/www\.legendmod\.ml\/#app",[\s\S]*?"softwareVersion": ")([^"]*)"/
};
/* the build each fact file states: {file: version or null} */
function buildFacts(repo) {
    const out = {};
    Object.keys(BUILD_FACTS).forEach((f) => {
        const m = BUILD_FACTS[f].exec(fs.readFileSync(path.join(repo, f), 'utf8'));
        out[f] = m ? m[2] : null;
    });
    return out;
}
/* the fact files with the build v (llms-full.txt also gets its Updated day): {file: new text} for those that change */
function updateBuildFacts(repo, v, day) {
    const out = {};
    Object.keys(BUILD_FACTS).forEach((f) => {
        const s = fs.readFileSync(path.join(repo, f), 'utf8');
        const m = BUILD_FACTS[f].exec(s);
        if (!m || m[2] === v) return;
        let t = s.slice(0, m.index) + m[1] + v + s.slice(m.index + m[1].length + m[2].length);
        if (f === 'llms-full.txt' && day) t = t.replace(/\nUpdated: [\d-]+/, '\nUpdated: ' + day);
        out[f] = t;
    });
    return out;
}

module.exports = { releases, devOnly, noteOf, notesOf, anchors, versionOf, anchorOf, changelogEntries, updateChangelog, updateRss, rfc822, BUILD_FACTS, buildFacts, updateBuildFacts };

if (require.main === module) {
    const check = process.argv.indexOf('--check') >= 0;
    const lf = (s) => s.replace(/\r\n/g, '\n');
    const cl = path.join(REPO, 'changelog.html'), rs = path.join(REPO, 'rss.xml');
    const html = lf(fs.readFileSync(cl, 'utf8')), rss = lf(fs.readFileSync(rs, 'utf8'));
    const html2 = updateChangelog(REPO, html), rss2 = updateRss(REPO, rss, html2);
    const newest = changelogEntries(html2)[0] || {};
    const facts = newest.v ? updateBuildFacts(REPO, newest.v, newest.date) : {};
    const stale = [html2 !== html && 'changelog.html', rss2 !== rss && 'rss.xml'].concat(Object.keys(facts)).filter(Boolean);
    if (check) {
        console.log(stale.length ? 'not up to date: ' + stale.join(', ') : 'changelog.html, rss.xml and the build in the project facts are up to date');
        process.exit(stale.length ? 1 : 0);
    }
    Object.keys(facts).forEach((f) => fs.writeFileSync(path.join(REPO, f), facts[f]));
    if (html2 !== html) {
        fs.writeFileSync(cl, html2);
        /* the sitemap gives the day of the newest release as the page's last change */
        const sm = path.join(REPO, 'sitemap.xml'), day = (changelogEntries(html2)[0] || {}).date;
        const xml = fs.readFileSync(sm, 'utf8');
        const xml2 = xml.replace(/(<loc>https:\/\/www\.legendmod\.ml\/changelog\.html<\/loc><lastmod>)([\d-]+)(<\/lastmod>)/, (a, p, d, s) => p + (day && day > d ? day : d) + s);
        if (xml2 !== xml) fs.writeFileSync(sm, xml2);
    }
    if (rss2 !== rss) fs.writeFileSync(rs, rss2);
    console.log(stale.length ? 'updated: ' + stale.join(', ') + ' (' + (anchors(html2).length - anchors(html).length) + ' new releases)' : 'nothing to update');
}
