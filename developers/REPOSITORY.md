# Repository structure and deletion rules

This repository is the Legend Mod website and game, served as it is by GitHub Pages at
https://www.legendmod.ml (also jimboy3100.github.io). There is no build step on the site: every tracked
file is a public URL, and players, userscripts, the extension, the mobile app, Expanding Land, its help
site and Delta may load any of them by that URL.

## What lives where

| Path | What it is |
| --- | --- |
| `play.html`, `index.html` and the other root pages | The game page, the home page and the site pages in `sitemap.xml`. Root files such as `CNAME`, `.nojekyll`, `google*.html`, `7e0ef7e8...txt` and `a1b2c3...indexnow.txt` (site verification and IndexNow keys), `robots.txt`, `opensearch.xml`, `rss.xml`, `manifest.json`, `llms.txt`, `llms-full.txt`, `LICENSE`, `MITlicence.txt` and `VERSION.txt` (asked for by old installed userscripts) stay. |
| `ogario/` | The game core (`ogario.v4.js`), its modules (`modules/`), the in-game spectator (`spect.js`) and small entry points loaded by `play.html` (keep even tiny ones such as `ogario.v4.static.js`). |
| `LMexpress/` | The loader layer: userscript (`LMexpress.user.js`), `LMexpress.js`, shop, extension sources (`extension/`) and the extension zips, the Android app (`mobileApp/`). |
| `LMmobile/` | Mobile controls and layout. |
| `lib/` | One shared copy of each library (see `lib/README.md`); `lib/lm-i18n.js` and `lib/lm-theme-bridge.js` are shared with the other sites. |
| `languages/` | Language packs. `lm-*.js` are generated from `developers/i18n/src/*.json` by `node developers/i18n/build.js` and `node developers/i18n/extension.js` (committed on purpose, never edit them by hand); `LanguagePack*.js` are kept for old URLs. |
| `vanillaskins/`, `lowresskins/`, `skins/`, `banners/`, `cursors/`, `sounds/`, `img/`, `fonts/`, `css/`, `themes/` | Skins, pictures, sounds, fonts, styles and the themes page. Saved settings, profiles, cloud configs and replays hold many of these addresses. |
| `agario/` | Copies of agar.io's client; `agario/live/` is in use (see `agario/README.md`). |
| `Lc/` | The Legend Clan site: `Lc.html`, `index.html`, rules, members, articles, the Discord sign-in relay (`auth/`) and two design drafts (`PROJETOX.HTML/`, `legend-clan-redesign/`, translated, not linked yet). |
| `extras/` | Smaller pages and tools opened by the game or the site (gift day, skin rotators, plugins, Legend Clan history); `extras/website/index.html` redirects old links. |
| `ExampleScripts/` | Userscripts that pages or modes still link: `Neoprivate.js` and `gamepad.user.js` (userscript modes), `LMTiny.user.js` and `BleedingMod.user.js` (home page), `LMAgartool.user.js` / `LMtoAgartool.user.js` with what they load, `expanding-land-description.html` (in the sitemap) and a few small add-ons. `agario-bots2/` is the bot servers' code. |
| `agarscripts/` | Old Legend userscripts that pages still link (`DiscordSIP.user.js`, `VidMod.user.js`, `Voicechat.user.js`, `legendmod.user.js`, `goodoldlegendmod.user.js`) and `icon16.png`. |
| `server-side/` | Source of the small servers behind the site (socket and monitor server, settings store, clan server and extension), kept as reference for redeploying them; the site never loads them. |
| `discordBot/` | Public terms of service and privacy policy of the Discord bot. |
| `scripts/` | Maintenance scripts that download skins (PowerShell). |
| `knowledge/`, `.well-known/` | Facts for search engines and assistants, app links, security contact, certificate validation. |
| `developers/` | The developers page, `i18n/` (language sources, scanner, build), `tests/` (local test suite, see `tests/README.md`), `tools/`, `bench/`, `audit/manifest.json`. |
| `apps/`, `wasm/`, `monitor/`, `nicks/`, `creator/`, `AjaxData/` | iOS app sources, WebAssembly parser sources and builds, the player monitor pages, nickname tools, the author's documents, old licence data. |

## Deletion rules

1. Deleting or moving a file is a dependency migration. Fix every consumer in the same change: the game
   (`ogario/`), `LMexpress/`, `LMmobile/`, the extension, the userscript, `skins/`, shop and rotator, the
   site pages, `knowledge/`, the language sources and generated packs, the tests and `scripts/`.
2. Search before deleting: every tracked text file here, also built paths (string concatenation, templates,
   maps, JSON), and the other repositories that load this site by URL (expandingland, legendworld-help,
   LegendWorld, deltav4). Search the git history too: an old installed userscript, extension zip or app may
   still ask for the address, and GitHub Pages cannot redirect a deleted file. "No reference found" alone is
   not enough evidence; say what you searched.
3. Old saved data must keep working: settings, profiles, cloud configs, replays and imported themes hold
   addresses. Resolve old paths where they are used; never rewrite saved data destructively.
4. Every deleted or moved file gets a record in `developers/audit/manifest.json` (`oldPath`,
   `canonicalPath`, `reason`, `internalReferencesMigrated`, `legacyResolverSupported`,
   `externalUrlSupported`, `legacyResolverNeeded`, `externalUrlNeeded`, `verification`,
   `approvedForDeletion`). A file leaves the tree only when its record is approved;
   `developers/tests/manifestrefs.js` checks the records, that removed files are gone and that nothing still
   points at them. Archived and deleted pages are also listed in `developers/i18n/scan-config.json` and
   checked by `developers/tests/i18n-archived.js`.
5. The git history is the archive. Do not keep historical copies, snapshots of other clients or scratch code
   in the tree "for reference", and do not create new repositories for them.
6. Never delete: `agario/live/`, the generated language packs and their sources, `languages/LanguagePack*.js`,
   the redirect pages (`skins/skins.html`, `skins3.html`, `skinsworking.html`, `extras/website/index.html`),
   the extension zips, `LMexpress/mobileApp/`, `knowledge/`, `llms*.txt`, `.well-known/`, `CNAME` and the
   verification files.
