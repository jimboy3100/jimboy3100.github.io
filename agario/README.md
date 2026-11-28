# agario/

Copies of agar.io's own client files. Legend Mod does not load them in the game, except `live/`.

- `live/` is in use: `live/GameConfiguration.json` is the fallback game configuration
  (`fallbackUrl` in `ogario/ogario.v4.master.js`), `live/versions.json` lists the configurations
  (`LMexpress/LMexpress.js`) and `live/flags/` holds the flag skins. Do not move or delete it.
- Reference copies of agar.io's current client (updated 2026-11-18): `agario.core.js` and
  `agario.core.wasm`, `mc/agario.js`, `bundle_start.js`, `bundle_commons.js`, `bundle_end.js`,
  `css/styles.css`, `environment.js`. Code comments cite them for agar.io's behaviour (for example the
  Ping message fields in `mc/agario.js`), and the probe `developers/tests/probes/keys-held.js` reads
  agar.io's key handler from `bundle_start.js`. Replace them with newer copies from agar.io; do not edit them.

Older snapshots (`mc/agario2.js`, `mc/agarioold.js`, `agariogenerated.core.js`,
`agariogeneratedcomments.core.js`, and the 2017 client `master.js`, `main_out.js`, `i18n.js`, `css/master.css`,
`img/star.png`) were removed; they are in the git history and listed in
`developers/audit/manifest.json`.
