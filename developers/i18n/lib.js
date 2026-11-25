/*
 * Shared helpers for the i18n tools (build.js, todo.js, merge.js, convert.js, scan.js, the tests).
 * Plain Node, no dependencies.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(__dirname, 'src');

/* Index + 1 = the number Legend Mod stores in localStorage 'languagemod' (Choose Language list). */
const CODES = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl', 'pt', 'id', 'ja', 'it'];
const PREVIEW_CODES = ['pt', 'id', 'ja', 'it'];
const NAMES = {
    en: 'English', el: 'Ελληνικά', es: 'Español', bg: 'Български', fr: 'Français', ar: 'العربية',
    zh: '繁體中文', ru: 'Русский', de: 'Deutsch', tr: 'Türkçe', pl: 'Polski', nl: 'Nederlands', pt: 'Português (Brasil)', id: 'Bahasa Indonesia', ja: '日本語', it: 'Italiano'
};
/* old file names: languages/LanguagePack<Name>.js */
const PACK_NAMES = {
    en: 'English', el: 'Greek', es: 'Spanish', bg: 'Bulgarian', fr: 'French', ar: 'Arabic',
    zh: 'TraditionalChinese', ru: 'Russian', de: 'German', tr: 'Turkish', pl: 'Polish', nl: 'Dutch', pt: 'Portuguese', id: 'Indonesian', ja: 'Japanese', it: 'Italian'
};

/* camelCase name from the first words of an English text ("Connect to server" -> connectToServer) */
function slug(en, fallback) {
    const words = String(en).replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').match(/[A-Za-z0-9]+/g) || [];
    const w = words.slice(0, 4).map((x, i) => {
        x = x.toLowerCase();
        return i ? x.charAt(0).toUpperCase() + x.slice(1) : x;
    }).join('');
    if (!w || /^[0-9]/.test(w)) return String(fallback || 'text').replace(/[^A-Za-z0-9_]/g, '');
    return w;
}

/* fields of a src entry that are not languages ("global": old global var name, "note": for translators) */
const isLang = (f) => CODES.indexOf(f) >= 0;

function orderEntry(e) {
    const o = {};
    Object.keys(e).filter((f) => !isLang(f)).sort().forEach((f) => { o[f] = e[f]; });
    CODES.forEach((c) => { o[c] = e[c] == null ? '' : e[c]; });
    Object.keys(e).filter((f) => !isLang(f) && !(f in o)).forEach((f) => { o[f] = e[f]; });
    return o;
}

function areaFiles() {
    return fs.readdirSync(SRC).filter((f) => /^[a-z0-9-]+\.json$/.test(f)).sort();
}

/* every area: { area: { key: entry } } in file-name order */
function readAll() {
    const all = {};
    areaFiles().forEach((f) => {
        all[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
    });
    return all;
}

function serializeArea(obj) {
    const o = {};
    Object.keys(obj).forEach((k) => { o[k] = orderEntry(obj[k]); });
    return JSON.stringify(o, null, 2) + '\n';
}

function writeArea(area, obj) {
    fs.writeFileSync(path.join(SRC, area + '.json'), serializeArea(obj));
}

/* Site areas (site.json, site-<page>.json) each go to their own languages/lm-<area>-<code>.js, the
 * rest to lm-<code>.js: a web page loads the shared site texts and its own, not the mod's ~2000. */
/* the key prefix of an area: site-index -> site.index. (core.json also holds the old un-prefixed lmT keys) */
/* packs.json (the old LanguagePack variables) uses pack.* */
const areaPrefix = (area) => (area === 'packs' ? 'pack.' : area.replace(/-/g, '.') + '.');
const isSiteArea = (area) => area === 'site' || area.indexOf('site-') === 0;

/* the parts of a text that must stay the same in every language */
function placeholders(s) {
    s = String(s || '');
    const out = [];
    (s.match(/\{[A-Za-z0-9_]+\}/g) || []).forEach((x) => out.push(x));
    (s.match(/%@|%[a-z_]+%|%[sdi]\b/g) || []).forEach((x) => out.push(x));
    (s.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g) || []).forEach((x) => out.push(x.toLowerCase()));
    (s.match(/\$\{[^}]*\}/g) || []).forEach((x) => out.push(x));
    return out.sort();
}

module.exports = { ROOT, SRC, CODES, PREVIEW_CODES, NAMES, PACK_NAMES, slug, isLang, orderEntry, areaFiles, readAll, serializeArea, writeArea, isSiteArea, areaPrefix, placeholders };
