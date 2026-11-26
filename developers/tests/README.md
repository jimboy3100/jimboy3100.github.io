# Legend Mod tests

Smoke tests that load the mod in headless Chrome and check that it starts cleanly.

## Run locally

Needs Node 22 or newer (global `fetch` and `WebSocket`) and Google Chrome or Chromium.

```
node developers/tests/run.js
```

Options: `--secs N` (wait before probing, default 14, or env `SMOKE_SECS`),
`--only desktop` / `--only mobile`, `--keep` (keep the Chrome profile in the output folder),
`--probes a,b` (only these probes from `probes/`, or env `SMOKE_PROBES`), `--limit N` (seconds the probes
may take per run, or env `SMOKE_LIMIT`; default 10 per probe, at least 120). Each probe line shows its time;
when the limit is hit the probes that finished are still reported and the one that was running is named.
Chrome is found automatically; set `CHROME_PATH` to use a specific binary.
Output goes to `developers/tests/out/` (ignored by git).

## What it checks

1. `node --check` on the main scripts (`ogario/`, `LMexpress/`, `LMmobile/`).
2. A desktop and a mobile (touch emulation) run of `play.html`. Every request for
   `www.legendmod.ml` / `jimboy3100.github.io` is served from this checkout; everything
   else (agar.io, game servers) is loaded live.
3. The probes in `probes/` run in the page: core globals exist, the settings menu is built,
   every hotkey command is well formed, the Gamepad window opens, fits and closes, and a few UI
   actions (menu tabs, hotkeys window, toggles) run without throwing.

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

## Freeze trace (on your own PC)

When the game stops for a moment every few seconds, this finds out what ran during the stop:

```
node developers/tests/trace.js --secs 120
```

1. A normal Chrome window opens on `https://www.legendmod.ml/play.html` with a temporary
   profile (no extensions, nothing from your own profile).
2. Play normally (pick a server, spawn, play as usual). Do not close the window.
3. It stops by itself after 120 s, or as soon as Legend Mod's Performance diagnostics have
   counted 3 freezes (each one is printed when it happens). Ctrl+C stops earlier.
4. The summary is printed and saved next to the trace in `developers/tests/out/`
   (ignored by git, nothing is uploaded):
   `trace-<time>.json` (open it in Chrome DevTools > Performance > Load profile) and
   `trace-<time>-summary.txt` (the summary plus Legend Mod's own performance report).

For every task of 100 ms or more on the page's main thread the summary shows the JavaScript
functions that took its time (self time, labelled `legendmod`, `agar.io`, `extension` or
`other`), the garbage collection and the GPU process work during it, a verdict (JavaScript of
whom, garbage collection, a GPU stall, browser work) and Legend Mod's own freeze line for it.
Freezes without a long task are listed separately (GPU or browser).

Options: `--url <address>` (another page, e.g. `--url https://agar.io` for a baseline without
Legend Mod), `--secs N`, `--until-freezes N` (0: only the time limit), `--no-gpu` (smaller trace),
`--out <dir>`, `--keep-profile`. Without any option it only prints its usage.
`trace-summary.js` tests the summary with a small synthetic trace.

The same freeze breakdown is in the game: Performance diagnostics (button in Animation, or its
hotkey), then "Keep recording when closed" and Copy report. Each freeze line there looks like
`287 ms freeze 22:41:10.384 · WebGL2 · skin texture upload 241 ms, cells update 21 ms, render 17 ms · LoAF ... · network normal · probable contributor: ...`.

## Dense-scene jelly benchmark

```
node developers/tests/bench-dense.js --bench
```

Loads the real jelly physics code (Cell.updateNumPoints / movePoints, LM.prepareJellyCells,
LM.updateQuadtree, ogario/wasm_quadtree.js) into Node, builds a seeded world of 100/500/1000/2000
bodies (viruses, overlapping clusters, coincident cells, some off screen) with 2k/10k food and
prints p50/p95 ms per frame for each phase: point preparation, index build, the collision queries
on their own, movePoints and a triangle-fan vertex fill, plus points prepared / indexed.
Options: `--frames N`, `--bodies a,b`, `--food a,b`, `--engine wasm|js|both` (the WasmQuadTree index
or the JS PointQuadTree fallback), `--src file` / `--qt file` (another ogario.v4.js / wasm_quadtree.js,
e.g. an older version from `git show`), `--json`. Without `--bench` it runs a quick self-check.
`jelly.js` checks the collision index against a direct scan and whole frames against the
previous code.

## Dense-world acceptance benchmark (whole client)

```
node developers/tests/bench.js                     # self-check in Node, no browser (also run with the other tests)
node developers/tests/bench.js --quick             # regression gate against bench-baseline.json
node developers/tests/bench.js --quick --update-baseline
node developers/tests/bench.js --run               # the full table (17 scenes)
```

Loads `play.html` in headless Chrome (every www.legendmod.ml request from this checkout, as
smoke.js), leaves the live server like the Practice arena does and feeds seeded worlds to the real
client through a stand-in socket (private-server packets for the main connection, the unit layout
for a real multibox unit): 100/500/1000/2000 bodies (players of 1-8 pieces, viruses, coincident
pieces, some off screen; 3% grow or shrink every tick so mass texts change), 2k/10k food with
churn, 1 or 2 sockets, crowded and wide layouts. Every scene has the same settings, 1600x900 at
DPR 1, zoom 0.4, camera fixed, jelly on (the default) unless the name says `nojelly`. Per scene:
frame time p50/p95/p99 and FPS (frames unthrottled), renderFrame CPU p50/p95, CPU self time per
frame of the timed parts (the Performance diagnostics scope names plus jelly prepare / build /
move, food, eligibility), the share of frames drawn by the WebGL scene (renderer fallback), and
from a separate untimed pass the WebGL draw calls, time inside GL upload calls (a GPU wait shows
there), label rasters, jelly points submitted / indexed, cells / food and the JS heap. It writes
`out/bench-<label>.json` (every number) and `.md` (a table), and per scene a deterministic world
frame `<scene>.png` for pixel comparisons.

`--run --preset bots` runs scenes like Expanding Land with its bots (150 bodies, every player with its own
name and skin image, players dying and coming back with a new id, name and skin), next to the same
world without skins, with skins but almost no respawns, and with names only: what bots cost in skins,
labels and packets.

`--run` takes the options of `lib/bench-client.js`: `--preset quick|default|full|bots`, `--scenes a,b`,
`--repo DIR` (serve another checkout, e.g. a `git worktree` of an older commit, for an A/B),
`--compare LABEL` (deltas and a pixel diff of the world frames against an earlier run),
`--warm MS` / `--measure MS`, `--repeat N`, `--profile` (top functions by CPU self time),
`--eval FILE` (an expression evaluated in the page after each scene), `--vsync`, `--no-capture`.

`--quick` runs 4 scenes (about a minute after the page has loaded) and compares them with
`bench-baseline.json`. The limits are generous so it does not flake: GL draw calls, jelly points
(fewer points means less jelly detail), the WebGL frame share and the world size always count;
render p50 / frame p95 only when the baseline comes from the same GPU and Chrome major version
and the machine is not busy (fixed CPU and GPU workloads in the page, run around the scenes, are
at most 1.4x slower than for the baseline); otherwise they are printed as info. A scene that fails
is measured once more and the better run counts. Other programs using the GPU (for example other
headless Chrome tests) still slow every timing down: run it, and store a baseline, on an idle
machine. Store a new baseline with `--update-baseline` when a change is meant to alter these
numbers, and say why in the commit. Without Chrome it is skipped.
The same scenes run from the browser console of the game page: see the top of `lib/bench-scene.js`.

## WebGL batching check and benchmark

```
node developers/tests/glbatch.js            # pixel comparison with the reference version
node developers/tests/glbatch.js --bench    # + draw calls, GL calls, upload bytes, CPU ms per frame
```

Loads the real renderer (`window.drawRender` of ogario.v4.js) twice into one headless Chrome page,
the working copy and a reference version (`--ref REF`, default the last version before the jelly
bodies and labels were batched, or `--old file`), and draws the same seeded scene (real jelly points
from bench-dense.js, skins, transparent skins, viruses, own and multibox cells, Unicode nicks and
mass) with both: jelly on/off, labels on/off, transparency, zoomed in, hidden own/teammate labels.
Prints the max/mean pixel difference per case. `--bench` adds a table for 100/500/1000/2000 bodies
with labels on (`--bodies`, `--frames`, `--repeat`); `on*` rows change the point counts in every
frame. `--profile N` prints the CPU self time of the working copy's frames.
It also checks the label atlas uploads: each label's atlas slot must hold exactly the texels its
own texture would get, and no `texSubImage3D` may read a canvas (that read waits for the GPU). With the atlas full, a new label keeps its own texture and, once slots are freed, must go into the atlas with the same texels.
Skipped (exit 0) without Chrome. `renderbatch.js` checks the index lists and the jelly batch against
a recording stub WebGL context in Node, over many frames of a changing world.

`overlayfx.js` checks the marks drawn above WebGL cells on the overlay canvas (teammate indicator,
chat bubble, FB badge and arrow, special effects): the real frame block of renderFrame, its late
overlay pass, canUseWebGLScene and the cell methods run on a small software 2D canvas, and each
frame (main + GL + overlay) must equal, pixel by pixel, the same scene in Canvas2D order. Covers
overlapping cells, Canvas2D/WebGL switches, frames without marks, DPR 2, resize and context loss.
Bodies and labels are models and no GPU runs. `node developers/tests/overlayfx.js [ogario.v4.js]`

`cellshadows.js` checks cell shadows (showCellShadows) with the WebGL renderer: the real
canUseWebGLScene in Node (a frame with a shadowed cell on screen goes to Canvas2D with the reason
`cellShadows`; food, ejected mass and off-screen cells keep WebGL), then in headless Chrome the
real WebGL batch and the real cell.draw composed like the page, jelly on/off, WebGL/Canvas2D,
shadows off/default/blur 0, with overlapping cells, food and ejected mass. The Chrome part is
skipped without Chrome. `node developers/tests/cellshadows.js [ogario.v4.js]`
