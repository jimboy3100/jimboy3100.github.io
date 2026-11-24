# Legend Mod tests

Smoke tests that load the mod in headless Chrome and check that it starts cleanly.

## Run locally

Needs Node 22 or newer (global `fetch` and `WebSocket`) and Google Chrome or Chromium.

```
node developers/tests/run.js
```

Options: `--secs N` (wait before probing, default 14, or env `SMOKE_SECS`),
`--only desktop` / `--only mobile`, `--keep` (keep the Chrome profile in the output folder).
Chrome is found automatically; set `CHROME_PATH` to use a specific binary.
Output goes to `developers/tests/out/` (ignored by git).

## What it checks

1. `node --check` on the main scripts (`ogario/`, `LMexpress/`, `LMmobile/`).
2. A desktop and a mobile (touch emulation) run of `play.html`. Every request for
   `www.legendmod.ml` / `jimboy3100.github.io` is served from this checkout; everything
   else (agar.io, game servers) is loaded live.
3. The probes in `probes/` run in the page: core globals exist, the settings menu is built,
   every hotkey command is well formed, and a few UI actions (menu tabs, hotkeys window,
   toggles) run without throwing.

The run fails on a syntax error, an uncaught page exception, a `console.error`, or a probe failure.
Network/console log errors are printed as warnings only, because the live servers are not always reachable.

## Single runs

```
node developers/tests/smoke.js <repoDir> <outDir> [secs] [url] [mobile]
```

If `<outDir>/probe.js` exists it is evaluated in the page (an expression, usually an async IIFE
returning a string) and printed as `PROBE:`. A summary is written to `<outDir>/result.json`.
Use a fresh `outDir` for each run; it holds the Chrome profile.

A probe in `probes/` is one expression that resolves to `{ fail: [...], info: {...} }`;
any entry in `fail` (or a thrown error) fails the run.

`crlf.js <repoDir>` restores each modified file's original line endings (CRLF or LF) after editing.
