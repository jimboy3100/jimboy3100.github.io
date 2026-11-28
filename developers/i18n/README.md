# Legend Mod translations

Every text a player sees comes from the language packs, in the language chosen in Legend Mod's
**Choose Language** list (localStorage `languagemod`: 1 English, 2 Greek, 3 Spanish, 4 Bulgarian,
5 French, 6 Arabic, 7 Traditional Chinese, 8 Russian, 9 German, 10 Turkish, 11 Polish, 12 Dutch, 13 Brazilian Portuguese, 14 Indonesian, 15 Japanese, 16 Italian).
All 16 are released, and a browser in any of them gets its language on the first visit.
**New and changed texts are written in English only.** A text another language does not have yet shows
in English there (the runtime, the extension and the userscript loader all fall back to English), and
`node developers/tests/i18n.js` passes; it only prints how many texts each language still lacks.
A translation pass fills them later, all at once (`todo.js` / `merge.js` below).
The numbers are append-only: a new language gets the next number, existing ones never move.
The web pages on www.legendmod.ml use the same packs.

## Files

| Path | What |
| --- | --- |
| `developers/i18n/src/<area>.json` | **The only place texts live.** `{ "key": { "en": "...", "el": "...", ... all 16 } }` |
| `developers/i18n/runtime.js` | the runtime source (`window.LMi18n`, `window.lmT`); ASCII only |
| `languages/lm-<code>.js` | generated: the mod's texts (every area except `site*`), one file per language |
| `languages/lm-site-<code>.js`, `languages/lm-site-<page>-<code>.js` | generated: web-page texts, one file per site area and language |
| `languages/lm-i18n.js` | generated: runtime for the mod (+ the table of old global names) |
| `lib/lm-i18n.js` | generated: runtime for the web pages (language picker, Theme Bridge language) |
| `languages/LanguagePack<Name>.js` | generated: the old addresses, small loaders that switch the old globals |
| `play.html` (between `i18n:boot` markers) | generated: the loading-screen text (`boot.loading`) |

Generated files are committed (the site has no build step) and must never be edited by hand.

Areas today: `core` (lmT's old table, bare keys, plus `core.*`), `packs` (the old
LanguagePack variables, `pack.*`, the old name in `"global"`), `settings` (settings/theme/hotkey
labels = `textLanguage`, `settings.*`), `agario` (agar.io's page texts = `i18n_dict`, `agario.*`),
`boot`, `site` (texts shared by the web pages), `site-index`, `site-features`, `site-faq`,
`site-banners` (the banner iframes in extras/: Mod Info, gift page, home page, clan pages, members,
clan history slideshow), `site-extras` (the 2020 promo videos and the clan birthday pages in
extras/), `site-gamble` (extras/website/gamble.html and its game). The scanner does not see texts a
script sets (phrase arrays) or SVG text: open the page and look for English that is left.

## Keys

- A key starts with its area name, dashes as dots: `settings.showMass`, `site.index.heroTitle`,
  `modules.notif.title` in `modules.json`. Only `core.json` also holds the old un-prefixed lmT keys
  (`leagues`, `gameOver`...); do not add new bare keys.
- One area file per work package (feature, module group, page): parallel work then never touches the
  same file. A key must exist in one area only (the test checks it).
- Name keys after their meaning, not their position (`modules.notif.markAllRead`, not `text12`).
- Fields other than the 16 languages: `"global"` (old global variable kept in sync, packs only),
  `"note"` (context for translators), `"allowEmpty": true` (empty on purpose in every language).

## Placeholders and HTML

- `{0} {1}` (array or single value) and `{name}` (object): `lmT('core.x', [5])`, `lmT('core.y', { name: nick })`.
- agar.io's own texts keep their `%@`, `%mode%`.
- HTML tags may appear in a text that is shown as HTML (toasts, `data-i18n-html`). Every language
  must have the same placeholders and the same tags (the test compares them).
- Never put player or server text into a pack text; pass it as a placeholder value, escaped when the
  result is used as HTML.

## Using texts in code

```js
lmT('core.langChanged')                    // the chosen language, else English, else the key
lmT('some.key', { name: n })              // placeholders
LMi18n.lang()        // 'el'      LMi18n.num() -> '2'      LMi18n.dir() -> 'rtl' for Arabic
LMi18n.onChange(function (code, prev) { /* re-render your window */ });   // returns an unsubscribe fn
LMi18n.apply(rootElement)   // fills data-i18n* elements inside rootElement
LMi18n.missing()            // { key: count } of keys asked for that no pack has (debug)
LMi18n.table({ 'myplugin.hello': { en: 'Hello', el: 'Γεια' } })   // a plugin's own texts at run time
LMi18n.setLang(2)           // switch (loads the file, saves languagemod, runs onChange + apply)
```

Old callers keep working: `lmT(key) === key` still means "missing" (code that passes its own English,
like `_lmTH('key', 'English')`, falls back). `textLanguage.x` is `settings.x`; the old globals
(`Languageletter12a`, `Premadeletter5`, `translator`...) follow the chosen language;
`i18n('page_play')` is `agario.page_play`. On a language change `textLanguage` is updated in place,
agar.io's `data-itr` texts, `data-i18n` elements and LanguagePackHandler.js are applied again; the
settings rows built at start-up change on the next reload (the toast says so).

HTML built by code: mark it and apply it, no per-element code:

```js
box.innerHTML = '<button data-i18n="modules.notif.clear" data-i18n-title="modules.notif.clearTip"></button>';
LMi18n.apply(box);
```

Attributes: `data-i18n` (text), `data-i18n-html` (pack HTML, trusted texts only), `data-i18n-title`
(also updates Bootstrap's `data-original-title`), `data-i18n-placeholder`, `data-i18n-aria-label`,
`data-i18n-alt`, `data-i18n-value`, `data-i18n-data-original-title`, and `data-i18n-vars='{"0":"5"}'`.

## Adding or changing texts

```sh
# 1. English texts into your area (creates src/<area>.json); or edit the JSON directly ("en" only)
node developers/i18n/add.js modules modules.notif.title "Notifications"
node developers/i18n/add.js modules --file new.json        # { "key": "English", ... } or full rows
# 2. build the language files (also the extension's), run the tests
node developers/i18n/build.js
node developers/i18n/extension.js
node developers/tests/i18n.js
# 3. replace the hard-coded text in the code with lmT('key') / data-i18n, then check the file
node developers/i18n/scan.js ogario/modules/smalltools.js
```

Do not translate the other 15 languages in a feature change. When the English of a key changes,
`add.js` empties its translations, so those languages show the new English until the translation pass
(editing the JSON by hand: empty them too when the meaning changed); a changed meaning is better a new
key. Removing a key: delete its row (all languages are in that one row).

The translation pass (once in a while, all languages at once):

```sh
node developers/i18n/todo.js                               # per area: how many texts each language lacks
node developers/i18n/todo.js --lang el --area modules --out el.json   # the English texts el lacks, to translate
node developers/i18n/merge.js el el.json                   # back into src (checks placeholders/tags)
node developers/i18n/build.js && node developers/i18n/extension.js && node developers/tests/i18n.js
```

## Web pages

A page includes the runtime once, at the end of `<head>` (nothing else in `<head>` changes; the
English stays in the HTML for search engines and visitors without JavaScript):

```html
<script src="https://www.legendmod.ml/lib/lm-i18n.js" data-areas="site-features" charset="utf-8"></script>
```

`data-areas` names the page's own area(s); `site` (shared texts) is always loaded, and `mod` loads the
mod's texts. The language: (a) the one Legend Mod passed with the Theme Bridge (`#lm=<base64 JSON>` /
`?lm=` / postMessage `{type: 'lm-theme', theme: {lang: n}}`, also saved), (b) localStorage
`languagemod` (shared with play.html on www.legendmod.ml), (c) the browser language, (d) English.
`<html lang>` is set, and `dir="rtl"` for Arabic. `<span data-lm-lang-picker></span>` renders a
language list (saves `languagemod`).

Converting a page:

```sh
node developers/i18n/html-extract.js changelog.html     # marks the texts, writes src/site-changelog.json, adds the script tag
node developers/i18n/scan.js changelog.html             # what is left: usually texts built by the page's scripts
```

Texts a page's script builds: use `lmT('site.changelog.x')` (the page's English file is loaded
before the page's scripts run) or build HTML with `data-i18n` and call `LMi18n.apply(el)`. Shared
texts (menu, footer) go in `site.json`.

From the mod (agar.io or another origin), links to www.legendmod.ml / jimboy3100.github.io pages
get `#lm=` with the language and theme (LMexpress.js `lmThemeHash`), iframes get the postMessage.

Other Legend sites (expanding.land, help.expanding.land) load the same `lib/lm-i18n.js` with their own
areas (`site-expandingland*`, `site-help*`, `site-knowledge`, built here into `languages/`). Their storage is
their own, so the language the visitor **chose** (saved `languagemod`, never a browser fallback) is passed on,
and nothing else (no theme, no login data):
- iframes marked `data-lm-lang-frame` get `{type: 'lm-lang', lang: 1-16}` when they load and on every choice,
  sent to the exact origin of their `src`; a choice made inside such a frame (page or mod runtime) is sent back
  to the embedding window (its exact origin) and on to the other marked frames;
- links to the other sites get `#lm=<base64url {"lang": n}>` (not play.html, whose hash is a party code, nor
  files); the page that opens reads it, saves it and takes it out of the address; a Theme Bridge theme on the
  link is left as it is;
- accepted only from the embedding window, the opener or a marked frame, on the origins in `PEERS`
  (runtime.js: www.legendmod.ml, jimboy3100.github.io, expanding.land, help.expanding.land).

## Tests

- `node developers/tests/i18n.js`: English present for every key, a translation that exists has the
  same placeholders/tags as the English, texts not translated yet left out of the generated files (so
  English shows; their count per language is printed, not a failure), key names, generated files up to date, old globals, lmT fallbacks, apply(), switching, the page runtime, the
  scanner (strict files must have 0 findings).
- `developers/tests/probes/zzzz-i18n.js` (in `run.js`): live switch to Greek and Arabic in the game page.
- The smoke test pins the browser to English and hides the first-visit window (`SMOKE_LANG`, `SMOKE_FIRSTRUN`,
  `SMOKE_STORAGE`).

## Hard-coded text scanner

```sh
node developers/i18n/scan.js <file>...            # findings: file:line kind text
node developers/i18n/scan.js --strict <file>...   # exit 1 on any finding
node developers/i18n/scan.js --report             # counts per file for the stage-2 groups
```

Kinds: `text` (a literal in toastr/alert/.text()/innerHTML/title=/label: ...), `html` (text inside
an HTML literal or page), `attr` (title/placeholder/alt/aria-label/value), `key` (an lmT/_lmTH key
or data-i18n key the packs do not have). Not user-visible or meant to stay: add `i18n-ok` with the
reason on the line (or on a comment line just above), or an entry in `scan-config.json` `"allow"`
(per file or `"*"`, exact text or `"/regex/"`). Brand names, numbers and key names are ignored.
`scan-config.json` `"strict"` lists the files that must stay at 0: add each file you finish
(the test `developers/tests/i18n.js` enforces it). The goal is every file in the list.

## Design notes

- Loading: play.html loads `languages/lm-i18n.js` and `lm-en.js`; the runtime writes the chosen
  language's file right after itself while the page is parsed (`document.write`, also on agar.io
  where play.html is written with `document.write`). An inline guard after them loads what is missing
  synchronously (Chrome may refuse document.write scripts). Files created at run time use absolute
  `https://www.legendmod.ml/` URLs, `charset="utf-8"`, and fall back to jimboy3100.github.io.
- Which language: the mod and the pages use (1) a language passed with the Theme Bridge (`#lm=`), saved,
  (2) localStorage `languagemod` (Choose Language), (3) the browser's language when it is one of the
  16 (only the first two letters count: pt-PT also gets Brazilian Portuguese; the old code `in` is
  Indonesian), not saved (it keeps following the browser until the player picks one), (4) English.
- First visit (nothing stored, `lmLangAsked` not set): LMexpress.js shows a small window once on the
  main menu (`_lmShowLanguageChooser`, the runtime's `data-lm-lang-picker="manual"` list, the
  browser's language picked). OK = the Choose Language path (saves `languagemod`); the cross / Esc keep
  the browser's language unsaved. Either way `lmLangAsked` = 1.
- Lookup: chosen language, else English, else the key (counted in `LMi18n.missing()`).
- Quick chat commands (`settings.comm0..50`) are sent to teammates: they stay English in every
  language but Polish (as before).
- `convert.js` is the one-off converter from 3.603's tables (kept for the record; do not run it again).
