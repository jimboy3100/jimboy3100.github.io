#!/usr/bin/env node
// Public pages state the same facts as the project facts (knowledge/game.json) and make no
// comparative claim we cannot back up:
// - an arena's player capacity ("up to N players", "N player capacity") is the one in
//   knowledge/game.json maxPlayersPerArena, in the pages, their JSON-LD, the llms files and in
//   every language of the website texts (developers/i18n/src/site-*.json);
// - no "the only agar.io extension / mod / IO game server", "largest IO game arena in the world"
//   or "faster than Node.js" claims (release notes in the changelog keep their wording: they are history).
// Expanding Land's checkout next to this one is checked too when it is there.
// Usage: node developers/tests/sitefacts.js
'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
const parent = path.dirname(repo);
let fails = 0, checked = 0;
const ok = (c, m) => { checked++; if (!c) { fails++; console.log('FAIL ' + m); } };

const game = JSON.parse(fs.readFileSync(path.join(repo, 'knowledge', 'game.json'), 'utf8'));
const CAP = String(game.maxPlayersPerArena);
ok(/^\d+$/.test(CAP), 'knowledge/game.json has maxPlayersPerArena (' + CAP + ')');

/* English claims we cannot prove (no comparison method or evidence behind them) */
const CLAIMS = [
    /\b(the )?only (agar\.?io )?(extension|mod|IO game server)\b/i,
    /\bonly agar\.io extension\b/i,
    /\bIO game server in the world\b/i,
    /\blargest IO game arena\b/i,
    /\bfaster than (typical )?Node\.?js\b/i,
    /\bvs ~?\d+ ?ms on Node\.?js\b/i,
    /* server-controlled bots play in the arenas too */
    /\bno bots\b/i,
    /\b\d[\d,]*\s+(?:concurrent |simultaneous )?real players\b/i,
    /* "video skins (Legend Mod exclusive)": the Compare page lists video skins for Delta too */
    /\(Legend Mod exclusive( feature)?\)/i,
    /\bno other mod\b/i
];
/* "up to 720 players", "1024 concurrent players", "1024 player capacity", "3840 Real Players" */
const CAPACITY = /\b(\d{1,3}(?:,\d{3})+|\d{3,6})\s+(?:real |concurrent |simultaneous )?players?\b/gi;
/* numbers of players that are not an Expanding Land arena's capacity */
const OTHER_NUMBERS = {
    'site.help.best.io.games.theGameThatInvented': "agar.io's own server limit"
};
/* texts of archived pages that tell history as it was */
const HISTORY = {
    'site.extras.noBots': 'credits of the 2020 page (extras/2020.html, not indexed)'
};

const text = (html) => html
    .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&mdash;|&ndash;/g, ' ')
    .replace(/\s+/g, ' ');

function checkText(where, s, key) {
    CLAIMS.some((re) => {
        const m = s.match(re);
        ok(!m, where + ': unproven claim "' + (m ? s.substr(Math.max(0, m.index - 40), 120) : '') + '"');
        return !!m;
    });
    let m;
    CAPACITY.lastIndex = 0;
    while (!OTHER_NUMBERS[key] && (m = CAPACITY.exec(s))) {
        ok(m[1].replace(/,/g, '') === CAP, where + ': player capacity ' + m[1] + ' ("' + s.substr(Math.max(0, m.index - 40), 100) + '"), the project facts say ' + CAP);
    }
}

function sitemapPages(dir, host) {
    const f = path.join(dir, 'sitemap.xml');
    if (!fs.existsSync(f)) return [];
    return (fs.readFileSync(f, 'utf8').match(/<loc>[^<]+<\/loc>/g) || [])
        .map((l) => new URL(l.replace(/<\/?loc>/g, '').trim()))
        .filter((u) => u.hostname === host)
        .map((u) => { let p = decodeURIComponent(u.pathname.replace(/^\//, '')); if (!p || p.endsWith('/')) p += 'index.html'; return p; });
}

function checkSite(dir, host, extraPages) {
    const pages = Array.from(new Set(sitemapPages(dir, host).concat(extraPages)));
    ok(pages.length > 0, host + ': pages to check');
    pages.forEach((p) => {
        if (/^changelog\.html$/.test(p)) return;
        const f = path.join(dir, p);
        if (!fs.existsSync(f)) return;
        checkText(host + '/' + p, text(fs.readFileSync(f, 'utf8')));
    });
    ['llms.txt', 'llms-full.txt', '.well-known/llms.txt', 'manifest.json', 'opensearch.xml'].concat(
        fs.existsSync(path.join(dir, 'knowledge')) ? fs.readdirSync(path.join(dir, 'knowledge'))
            .filter((n) => /\.(json|jsonld|ttl|rdf)$/.test(n) && n !== 'changelog.json').map((n) => 'knowledge/' + n) : []
    ).forEach((p) => {
        const f = path.join(dir, p);
        if (fs.existsSync(f)) checkText(host + '/' + p, fs.readFileSync(f, 'utf8'));
    });
}

/* extras/legendffa.html is the page help.expanding.land shows on its home page */
checkSite(repo, 'www.legendmod.ml', ['index.html', 'faq.html', 'features.html', 'compare.html', 'extras/legendffa.html', 'Lc/Lc.html']);
const el = process.env.CROSS_EL_DIR || path.join(parent, 'expandingland');
if (fs.existsSync(path.join(el, 'index.html'))) checkSite(el, 'expanding.land', ['index.html']);
else console.log('skip: no Expanding Land checkout at ' + el);

/* website texts in every language: the English claim check, and the same capacity number in all languages */
const src = path.join(repo, 'developers', 'i18n', 'src');
/* changelogs keep the wording of their releases (history) */
fs.readdirSync(src).filter((n) => /^site-.*\.json$/.test(n) && !/changelog/.test(n)).forEach((n) => {
    const area = JSON.parse(fs.readFileSync(path.join(src, n), 'utf8'));
    Object.keys(area).forEach((k) => {
        const row = area[k];
        if (!row || typeof row.en !== 'string') return;
        const en = text(row.en);
        if (HISTORY[k]) return;
        checkText(n + ' ' + k + ' (en)', en, k);
        CAPACITY.lastIndex = 0;
        if (OTHER_NUMBERS[k] || !CAPACITY.test(en)) return;
        Object.keys(row).forEach((l) => {
            if (l === 'en' || typeof row[l] !== 'string' || !row[l]) return;
            ok(row[l].indexOf(CAP) >= 0 && !/\b(720|1024)\b/.test(row[l]), n + ' ' + k + ' (' + l + '): states the capacity ' + CAP + ' like English');
        });
    });
});

/* no "Exclusive" badge on the Features page (skins, several servers, gamepads: other mods have them too) */
const featSrc = fs.readFileSync(path.join(src, 'site-features.json'), 'utf8');
ok(!/badge-exclusive/.test(fs.readFileSync(path.join(repo, 'features.html'), 'utf8')), 'features.html has no Exclusive badge');
ok(!/badge-exclusive/.test(featSrc), 'site-features.json has no Exclusive badge in any language');

/* the comparison says who made it (it is published by one of the compared mods) */
const cmp = fs.readFileSync(path.join(repo, 'compare.html'), 'utf8');
const disc = (cmp.match(/<p\b[^>]*data-i18n="site\.compare\.madeByLegendMod"[^>]*>([^<]+)<\/p>/) || [])[1] || '';
ok(/Legend Mod/.test(disc) && /not a neutral/.test(disc), 'compare.html says it is made by the Legend Mod project and is not neutral ("' + disc + '")');

console.log(fails ? 'sitefacts: ' + fails + ' FAILED of ' + checked : 'sitefacts: all ' + checked + ' checks passed');
process.exit(fails ? 1 : 0);
