# Legend Mod translations

Every text a player sees comes from the language packs, in the language chosen in Legend Mod's
**Choose Language** list (localStorage `languagemod`: 1 English, 2 Greek, 3 Spanish, 4 Bulgarian,
5 French, 6 Arabic, 7 Traditional Chinese, 8 Russian, 9 German, 10 Turkish, 11 Polish, 12 Dutch, 13 Brazilian Portuguese, 14 Indonesian, 15 Japanese, 16 Italian).
The last four are explicitly marked Beta and opt-in until complete. Missing texts use English, and
`node developers/tests/i18n.js --require-complete` is the release gate; do not remove Beta labels
or enable automatic detection for these locales until that gate passes.
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
`boot`, `site` (texts shared by the web pages), `site-index`, `site-features`, `site-faq`.

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
lmT('site.index.invitedBy', { name: n })   // placeholders
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

## Adding or changing texts (stage 2 steps)

```sh
# 1. English texts into your area (creates src/<area>.json); or edit the JSON directly
node developers/i18n/add.js modules modules.notif.title "Notifications"
node developers/i18n/add.js modules --file new.json        # { "key": "English", ... } or full rows
# 2. what still needs translating (per language), translate, merge back (checks placeholders/tags)
node developers/i18n/todo.js                               # counts
node developers/i18n/todo.js --lang el --area modules --out el.json
node developers/i18n/merge.js el el.json
# 3. build the language files, run the tests
node developers/i18n/build.js
node developers/tests/i18n.js
# 4. replace the hard-coded text in the code with lmT('key') / data-i18n, then check the file
node developers/i18n/scan.js ogario/modules/notifications.js
```

When the English of a key changes, `add.js` empties its translations (they need a new look); a
changed meaning is better a new key.

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

## Tests

- `node developers/tests/i18n.js`: released packs complete (same placeholders/tags); preview gaps reported, key names,
  generated files up to date, old globals, lmT fallbacks, apply(), switching, the page runtime, the
  scanner (strict files must have 0 findings).
- `developers/tests/probes/zzzz-i18n.js` (in `run.js`): live switch to Greek and Arabic in the game page.
- `node developers/tests/i18n-firstrun.js`: headless first visit with a Greek browser (window shown,
  Greek picked, OK saves, never again) and with English stored (never shown). The smoke test pins the
  browser to English and hides the first-visit window (`SMOKE_LANG`, `SMOKE_FIRSTRUN`, `SMOKE_STORAGE`).

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
  twelve, not saved (it keeps following the browser until the player picks one), (4) English.
- First visit (nothing stored, `lmLangAsked` not set): LMexpress.js shows a small window once on the
  main menu (`_lmShowLanguageChooser`, the runtime's `data-lm-lang-picker="manual"` list, the
  browser's language picked). OK = the Choose Language path (saves `languagemod`); the cross / Esc keep
  the browser's language unsaved. Either way `lmLangAsked` = 1.
- Lookup: chosen language, else English, else the key (counted in `LMi18n.missing()`).
- Quick chat commands (`settings.comm0..50`) are sent to teammates: they stay English in every
  language but Polish (as before).
- `convert.js` is the one-off converter from 3.603's tables (kept for the record; do not run it again).
