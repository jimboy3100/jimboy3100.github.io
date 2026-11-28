# Legend Mod | Full Map final correctness and performance handoff

**Date:** 2026-11-28  
**Recipient:** Claude / Opus implementation agent  
**Repository:** `jimboy3100/jimboy3100.github.io`  
**Suggested handoff location:** `temp/from-chatgpt-fullmap-final-performance-handoff-2026-11-28.md`  
**Scope:** Full Map, ghost reconciliation, shared Multibox reconciliation, spectator food, packet processing, performance and final acceptance.

## 1. Objective and operating rules

Finish the remaining Full Map correctness issues and verify the actual performance improvements without dismantling the architecture that has already been corrected. Full Map must continue working while the user is playing, including permitted Multibox configurations. The main and secondary playing clients must remain independent of passive tile lifecycle management.

This is a targeted completion pass, not authorization for a new Full Map renderer, another spatial-index subsystem, a second diagnostic system, a new settings page or a broad refactor. Do not remove existing functionality to improve benchmark numbers. Preserve unrelated work and local modifications. Do not push, deploy, or enable GitHub Actions merely to perform this handoff.

**Before editing:** inspect `git status`, the actual current branch and HEAD, the current implementations and the existing relevant tests. The audit references the following previously inspected Git blob prefixes:

| File | Previously inspected blob |
|---|---|
| `ogario/ogario.v4.js` | `f57b9a815608` |
| `ogario/spect.js` | `7f15327b92c5` |

Line numbers below refer to that snapshot and may have moved. Search by function name rather than editing by line number alone. If a later change already addresses a finding, verify it and mark it resolved instead of implementing another solution. Check both source behavior and real call sites. Identify the actual loaded source/build artifact before claiming a fix affects gameplay.

### Evidence boundary

This handoff consolidates the latest supplied ChatGPT audit; it is not a new inspection of HEAD. The audit reports nine isolated ghost scenarios and an independently executed synthetic ghost benchmark, plus source inspection of six regression-test files and eight commits. The complete repository suites, unpublished local changes and live browser gameplay were not independently verified. Some remaining findings are confirmed synthetic ambiguities; others are source-level risks or protocol questions, explicitly identified below. Do not turn a hypothesis into a confirmed bug without checking it.

## 2. Prior corrections and optimizations to preserve

The four original ghost false-suppression cases passed in the last isolated reproduction: same-name touching players without raw-colour evidence; unrelated cross-source players; an unrelated owned-cell nickname; nonfeeding secondary owned cells. Matching a valid player and retaining an unmatched ghost still worked; old socket-generation observations were excluded.

Preserve these existing mechanisms and check for regressions in affected areas only:

- Independent Full Map/Multibox/playing lifecycles; preserve passive sockets across spawn and respawn; turning either feature off must not close the other's connections.
- Canonical tile coordinates; independent offsets and orientation; calibration anchors and ambiguity checks; transform revision and socket-generation isolation; stationary-camera freshness; successful-world-update timestamps and malformed-packet handling.
- Rotate Map during play, spectate and pause; transformed cells, ghosts, cameras, cursor and locked targets, minimap trails and food; preserve canonical tile placement. Preserve manual versus automatic orientation precedence.
- Population gating, including unknown versus valid empty leaderboard, suspension above 180 and reopening at 170 or fewer (verify the existing configured thresholds rather than hardcoding duplicates). Existing mode and server-refusal restrictions remain authoritative.
- Reconciled physical cells, bounded deterministic food matching, correct food representative relocation, original server colour handling, viewport culling and removal of duplicate visual representations.
- Existing Full Map health categories (`connected`, `calibrated`, `covering`, `contributing`, `live`, `missing`) and the shared `lmSrcContributes()` predicate.
- Ghost reach-box grid, reusable typed arrays, bounded grouping and early rejection; retained Multibox spatial index; raw-ID lookup; bounded spectator food pooling; appearance-cache fast path; existing jelly-step budget.

Do not reopen previously fixed subsystems merely because a different implementation is possible. No blanket disabling of ghosts, jelly, skins, food, map rotation or concurrent playing clients.

## 3. P1: Complete ghost identity safeguards

Relevant areas in `ogario.v4.js`: `_lmGhostMatch()`, `_lmGhostGroups()`, `_lmMbFeeds()`, the ghost-list decoder and its leaderboard association. Review the real observation schema and producer/consumer chain before altering any matching predicate.

### 3.1 Same nickname and raw colour are not authoritative player identity

**Evidence:** The previous audit reproduced two independent same-source players with nickname `X`, raw colour `#123456`, radii 60, x positions -60 and +60, and a ghost of radius 100 near the origin. Their combined squared-radius mass ratio is 0.72. The grouping heuristic may combine them and suppress the ghost. The fixture labels the observations as distinct players; those labels may not exist in the actual protocol.

The snapshot's grouping path around line 2429 contains a condition equivalent to:

```js
if (col && cb._lmRawColor === aCol)
    _lmGhostJoin(_lmGhostPar1, a, b);
```

**Required work:**

1. Determine whether the supported official-server packet formats expose a reliable player-owner identifier, a verified leaderboard self marker, or other evidence that can distinguish a split player from neighbouring players. Do not mistake raw physical-cell IDs for player IDs. Do not use rendered/shared colour as identity.
2. Retain the already validated `_lmMbTwin` relationships for matching observations of the same physical cell across sources. Audit their current-generation/freshness assumptions. A twin edge does not by itself prove two different physical cells have the same owner.
3. Keep strong evidence separate from weak grouping evidence (nickname, colour, proximity, plausible mass). Do not use a weak transitive edge to erase a genuinely competing hypothesis. Do not sum duplicate cross-source observations as independent mass.
4. If ambiguity can be detected with existing evidence, favour retaining an uncertain ghost over falsely suppressing it. Use the existing ghost display behavior; do not introduce a second ghost renderer or an extra user setting.
5. If the true split-player and two-independent-player fixtures are observationally identical, acknowledge the information-theoretic limitation. Do not promise perfect identity or design a complex heuristic around unavailable fixture-only IDs. Choose a conservative, bounded policy after evaluating normal split-heavy gameplay; report the residual ambiguity and false-retention trade-off explicitly.

**Acceptance:** Existing valid single-player and split-player cases remain functional where evidence supports them. Distinguishable competing players cannot be merged merely because their names/colours and positions agree. For indistinguishable fixtures, explicitly document the chosen consistent behavior. No arbitrary threshold tightening that causes widespread duplicate ghosts.

### 3.2 Owned-cell accumulation must not bypass ambiguity analysis

**Evidence:** The latest isolated reproduction had a ghost `X`, a nearby owned player `X`, and an independent nearby enemy `X`, both plausible by mass. The ghost was suppressed. Around lines 2296–2304, an eligible owned-mass match sets `h = 1` and exits before ordinary competing-candidate analysis.

**Required work:**

- Audit what actually establishes the ghost's ownership. A fresh, reliably paired server self marker can justify a direct main-player match, subject to the marker's documented semantics. Nickname equality, owned status and mass compatibility alone cannot establish that the ghost belongs to the owned player.
- When ownership is not authoritative, submit owned hypotheses to the same ambiguity decision as other hypotheses, preserving per-player/per-source mass accounting. Avoid charging the same physical cell twice if it appears through several connections.
- Keep the fast path only if its prerequisites prove the association or establish that no competing plausible candidate can be present. Do not reintroduce the old unrelated-own-nickname failure.
- Preserve owned-cell rendering, movement, camera behavior and removal semantics regardless of whether an owned observation is allowed to suppress a ghost.

**Acceptance:** A valid self ghost can be suppressed; a different-name owned cell cannot suppress it; a name-only owned match cannot override a distinguishable competing enemy; stale or previous-generation owned observations cannot establish identity.

### 3.3 Main-source freshness must be explicit for ghost identity

**Evidence:** The audit identified a source-level inconsistency, not a confirmed live failure. `_lmGhostMatch()` uses `_lmMbFeeds(c)` (around line 2255), whose snapshot implementation returns true automatically for the main source (`!(c.spectator > 0)`). Main-source coverage already has freshness checks; ghost evidence may bypass them.

**Required work:** Trace the main-source successful-world-update timestamp, connection generation, reset paths and source orientation/transform validity. Reuse the relevant existing freshness policy rather than inventing unrelated timers. Check whether upstream collection already excludes stale main cells. If not, add a narrowly scoped ghost-evidence gate, evaluated once per source per reconciliation where practical. Do not globally change `_lmMbFeeds()` behavior or remove the main player's gameplay cells simply to prevent ghost suppression. Use successful validated world updates, not arbitrary traffic, outgoing input, camera updates or malformed packet arrivals, as evidence of freshness. Do not incorrectly treat an unchanged incremental cell as stale when the source is healthy.

**Acceptance:** Main connection stalls while passive sources remain healthy; old main observations cease to establish ghost identity at the intended eligibility boundary. A valid main update restores eligibility. Reconnection, server switching and old-generation objects cannot restore stale evidence. Normal main rendering and gameplay continue according to existing recovery policy.

## 4. P1: Verify ghost-list and leaderboard snapshot association

**Evidence:** Around line 87249, a ghost is associated by positional index:

```js
var _gRow = ghostsCells[length].rawX !== undefined && LM.leaderboard
    ? LM.leaderboard[length]
    : null;
```

The audit did not establish that the two server messages refer to the same snapshot or order. This matters because a wrong nickname or self marker can invalidate the improved matching algorithm.

**Required work:** Inspect actual opcode handlers, packet layout, version/mode differences, list truncation, sort order, sequence/generation state, and existing recordings. Determine whether the protocol guarantees rank correspondence and pairing, including when a leaderboard changes before or after a ghost update. Do not assume close timestamps establish the same snapshot. Do not add a new network protocol or fabricate owner IDs. If a server guarantee or equivalent validated pairing exists, preserve it and document its evidence. Otherwise prevent unverified row metadata from serving as strong identity evidence. Prefer an unknown/uncertain identity state over a confidently wrong name or self marker; retain existing ghost geometry and rendering. Clear or invalidate association metadata on connection generation change, malformed updates and incompatible list changes according to the proven semantics.

**Acceptance:** Exercise leaderboard reorder, mismatched lengths, either packet arrival order, empty list, self-row movement, reconnect and supported mode changes. A stale or unrelated row must not become authoritative self/identity evidence. If packet captures are unavailable, state that protocol verification is blocked and adopt only a safe, evidence-supported policy; do not claim protocol correctness.

## 5. P2: Audit retained reconciliation spatial index

**Relevant commit:** `df55608906` (from previous audit). Functions `_lmMbBuildGrid()`, `_lmMbGridFor()`, `_lmMbGridKept()`. Snapshot state: `_lmMbPktRev`, `_lmMbGridRev`, `LM_MB_GRID_MAX_AGE = 100` ms. Retained index expands candidate search by a conservative maximum drift derived from velocity and elapsed time. Actual matching must use current interpolated positions.

This is a meaningful optimization. Preserve it; do not return to unconditional per-frame rebuilds unless correctness cannot be maintained with targeted invalidation.

### Required invariant

For the same observations and render timestamp, the retained index must not exclude any candidate a fresh index would admit. The final reconciliation result, including deterministic tie-breaking, must agree with the fresh-index implementation. Extra broad-phase candidates are acceptable if the exact matcher rejects them. Audit all mutation paths affecting membership, eligibility, position and velocity, including:

| Mutation / boundary | Required behavior |
|---|---|
| Valid world packet or direct entity mutation | Revision invalidation or a proven equivalent retained-index check |
| New/removed/eaten cell; raw ID reuse | No obsolete membership or stale object association |
| Source removal, reconnect, generation change | No retired-source candidates |
| Source stall, recovery, calibration or eligibility change | Correct current-source membership even without a packet revision |
| Rotate Map, offset correction, orientation or transform revision | Rebuild or update index before querying transformed positions |
| Ownership/observation stamp changes | Correct matching priority and eligibility |
| Interpolation/extrapolation boundaries or clock discontinuity | Conservative finite drift or safe fresh rebuild |
| Fast movement and exact bucket/radius boundaries | No false negatives; stable tie handling |
| Age at, before and after retention limit | Consistent invalidation with the existing timebase |

Review how maximum speed is obtained and whether interpolation clamping, discontinuities, coordinate transforms or changes to velocity invalidate its bound. Do not add a full world scan solely to validate the cache if it cancels the performance benefit; use existing mutation revisions and checks where possible. If a missed invalidation is found, repair the producer or predicate and add a compact paired retained-versus-fresh regression to an existing reconciliation test. A test-only forced-rebuild path is acceptable if needed; do not expose another gameplay setting.

## 6. P2: Verify spectator food-object pooling

**Source:** `spect.js`, pool cap `LM_SPECT_FOOD_POOL = 256`, allocation around 3227, release around 3637–3653; `_lmRenew()` in `ogario.v4.js` around 39471. Existing `developers/tests/fullmapfood.js` includes fresh-versus-reused field comparison and previously drawn nonfood exclusions. Maximum configured retained capacity across 15 passive tiles is 3,840 objects; actual retention depends on lifecycle and population.

**Required work:** Trace a pellet through construction, packet update, source registration, matching, removal/eat animation, release, pool storage, reuse and source teardown. Audit every reference holder, including raw-ID and global cell maps, source-local entity indexes, shared food observations/components, calibration anchors, retained render lists/spatial entries, and any delayed callbacks or animations. Before reuse, the old logical cell must have no externally usable reference that can mutate or remove its successor. Guard against duplicate release; ensure generation/reset paths cannot revive retired cells.

Rerunning `ogarbasicassembly.call(this, ...)` does not delete dynamically attached fields. Compare constructor-initialized and lazily attached fields across the object's actual lifetime. Clear only relevant transient fields and preserve valid method/prototype contracts. The release guard should reject objects with unresolved references; do not weaken safety checks to improve reuse rate. A pooled food object must not retain old owner, account, color/appearance, matching, animation or coordinate metadata. Inspect whether constructor execution still allocates closures or temporary arrays, including the arrays replaced by reused `points` and `pointsVel`.

**Acceptance:** Verify old raw ID removed/new raw ID indexed, identical observable state for fresh versus reused pellet, eat/removal paths, double release, reset/reconnect and late-reference safety. The pool stays bounded and teardown obeys existing lifecycle policy. Measure allocation and GC benefits in browser; retain the pool unless an actual defect or material measured regression justifies revising it. Do not introduce global object pools or a broad cell-constructor rewrite.

## 7. P2: Clarify food freshness policy

**Evidence:** `lmFoodFrame()` around line 4276 uses `lmSrcFeeds(sp)`, while player reconciliation and Full Map health use `lmSrcContributes(sp, now)` (which adds the stall check). Playing sources are treated differently from passive sources in the stale-source logic. This is a policy discrepancy requiring verification, not a confirmed defect.

Food is stationary and incremental packets need not repeat unchanged pellets. A healthy source that has not sent a particular pellet again is not equivalent to a stalled source. Inspect how a reconciled physical pellet retains source membership, how removals and negative coverage evidence are interpreted, and how other sources override or replace old observations. Verify a stalled playing source cannot keep a genuinely obsolete pellet alive indefinitely when fresh, verified overlapping observations provide sufficient removal evidence. Do not interpret absence from an incremental packet as a removal, or absence outside reliable source coverage as negative evidence.

If a change is needed, scope it to food evidence eligibility/representative selection and the existing cleanup rules. Do not blindly substitute `lmSrcContributes()` everywhere or erase all food on every brief stall. Preserve representative relocation, deterministic bounded food components and recovery without excessive churn. Distinguish stale evidence from actual rendering fallback and state the policy explicitly.

**Acceptance:** Healthy unchanged pellets persist; stale conflicting observations cannot indefinitely override reliable removal evidence; sources recovering or leaving do not create duplicates or holes; valid uncovered pellets are not erased based on absence of evidence.

## 8. P2: Verify optimized raw-ID and appearance paths

These are audit targets, not known unresolved bugs. Make changes only if inspection or a targeted reproduction finds a defect.

- `spect.js` `_lmCellOf(ids, rawId, id)` around line 3622; commit `f9000d0959`: verify numeric per-source lookup, fallback composite key, cell identity/generation, creation/update/eat/removal synchronization, reconnect and pooled-object reuse. Ensure fallback cannot return a removed or previous-generation object. Maintain valid protocol ID semantics (including unsigned values where applicable). Do not remove fallback until all relevant call sites are understood.
- `ogario.v4.js` `_lmMbLookSet()` around 2862–2911: verify appearance epoch fast path, bounded cache eviction, source/generation/identity transitions, raw-colour changes, and recycled objects. A cached association must not survive replacement of the physical observation or incorrectly transfer appearance across players. Preserve the optimized unchanged-entry path.
- Existing `lmFullMapHealth()` and `lmSrcContributes()` around `spect.js:575–632` and `ogario.v4.js:2702`: preserve shared eligibility semantics; verify actual contribution and freshness diagnostics against the renderer, not merely connection state. A calibrated or geometrically covering tile need not currently contribute.

## 9. Performance: measured improvements and remaining profiling

### Previously measured evidence

The supplied audit reports an isolated benchmark of the previous and latest ghost algorithms with 4,000 observations, 50 distributed ghosts, 400 matching iterations per measurement, 50 warm-up iterations and three measurements per version.

| Run | Previous | Latest |
|---|---:|---:|
| 1 | 5.215 ms | 1.533 ms |
| 2 | 5.718 ms | 1.528 ms |
| 3 | 5.598 ms | 1.435 ms |
| Median (rounded) | 5.60 ms | 1.53 ms |

Approximately 72.7% lower isolated execution time, or 3.7x speedup. This does not imply a 3.7x game-wide speedup. The spatial grid (`LM_GHOST_GRID_N = 32`, `LM_GHOST_GRID_MIN = 256`) and early filtering are worth preserving.

The retained-index commit reported these separate developer benchmark results (not independently rerun in the supplied audit):

| Configuration | Previous median | Latest median | Reduction |
|---|---:|---:|---:|
| Multibox + 15 Full Map tiles | 0.847 ms | 0.687 ms | 18.9% |
| 15 Full Map tiles | 0.685 ms | 0.577 ms | 15.8% |
| mb5 | 0.586 ms | 0.517 ms | 11.8% |

The commit also reported identical frame-level E2E reconciliation traces. Check the actual benchmark definitions and commit if relying on these results.

### 9.1 Dense ghost workload

At `LM_GHOST_GROUP_MAX = 128`, one all-pairs pass can perform 8,128 comparisons. Multiple grouping passes and overlapping ghost reach boxes may increase total cost. The previous benchmark used distributed ghosts and does not establish worst-case behavior.

Reuse an existing benchmark and run three scene variants: distributed ghosts; many overlapping large ghost reach boxes; split-heavy same-name players. Compare correctness output and matching cost under equal inputs, with the same warm-up and measurement process. Inspect actual candidate counts, cap behavior and deterministic results where useful. Do not silently drop plausible competing candidates on cap overflow and then claim an unambiguous match. Preserve bounded work; a conservative unmatched result is preferable to an unsupported positive match. Optimize only measured bottlenecks. Avoid new per-frame allocations, per-cell timers, per-ghost full scans or sorting that cancels the existing gain.

### 9.2 Packet bursts and long-task profiling

Full Map multiplies incoming observation traffic. With 15 passive tiles the conceptual client counts are 16 with P1, 17 with P1/P2 and 21 with six playing clients, before any other auxiliary connection. These are possible architecture workloads, not a guarantee of official-server permission. Respect existing connection/mode/population restrictions and do not bypass refusals to run benchmarks.

Use existing recordings, browser DevTools Performance and existing profiling counters rather than building a new instrumentation subsystem. Use comparable scene, viewport, rendering settings, browser, device, connection configuration and duration. Separate normal play from Full Map activation/calibration, steady state, packet bursts and reconnects. Compare Full Map off/on and Full Map + permitted Multibox configurations; include a sustained busy scene.

| Measure | Purpose |
|---|---|
| Packet handler count, duration and burst distribution by source | Distinguish parse/mutation pressure from drawing |
| Time since successful world update and update-processing latency | Separate delayed processing from missing network updates |
| Reconciliation, food, ghost and grid rebuild/reuse costs | Identify real hot paths and retained-index benefit |
| Jelly simulation and Canvas2D/WebGL rendering | Distinguish physics and rendering overhead |
| Allocation rate, heap trend, GC pauses and retained objects | Verify pooling and absence of retention leaks |
| Frame time median, p95, p99, worst recurring spikes | Detect regressions invisible in average FPS |
| Main-thread long tasks (50 ms or more), counts and duration | Investigate freezes and responsiveness |

Collect only temporary or existing instrumentation needed for diagnosis. Avoid permanent verbose per-packet logging and hot-loop timers. Separate network-side delay, packet processing, garbage collection, GPU/rendering and actual frame scheduling before labeling a freeze as a server freeze.

**Do not** discard incremental packets, arbitrarily throttle incoming protocol updates, reorder per-socket packet application, weaken packet validation, bypass calibration, reduce connection counts by removing a supported feature, or hide visible cells to improve benchmark scores. Do not introduce a worker, Pixi.js or a new renderer without profiling evidence and separate architectural justification. If packet bursts dominate, identify the exact allocation, lookup, parser, mutation or reconciliation cost and make a targeted correction preserving protocol semantics. If there is no material hotspot, stop optimizing.

### 9.3 Performance acceptance

Compare current pre-change baseline and final version on the same fixtures, not two unrelated live games. Record actual measured values, run counts, scene size, browser/runtime and whether the results are synthetic or live. Aim to preserve the measured gains and avoid material regressions in p95/p99 and long-task behavior. Treat 16.67 ms (60 Hz) and 8.33 ms (120 Hz) as total frame-budget reference points, not guarantees. Do not invent a target FPS independent of hardware and server conditions. If a correctness fix increases cost, quantify it, investigate a bounded implementation and explain the trade-off; do not revert a necessary correctness safeguard silently.

## 10. Minimal regression strategy: do not expand test overhead unnecessarily

The existing tests already cover extensive food reconciliation, orientation and lifecycle behavior. Extend relevant suites only; do not create duplicate suites, run a massive new combinatorial matrix or repeat full-repository tests after each small change. Locate the actual test runner and invocation in the current repository. Do not assume an npm script or command exists without checking.

| Existing test area | Compact additional coverage, if not already present |
|---|---|
| `developers/tests/fullmaplifecycle.js` or current ghost test location | Owned/enemy ambiguity; main stall/recovery and generation; same-colour ambiguous cases with an explicit policy; leaderboard pairing/order if relevant |
| `developers/tests/fullmapfood.js` | Pool reference/reuse invariants and stale-source conflicting evidence only if missing |
| Existing Multibox reconciliation tests/benchmark | Paired retained-versus-fresh index comparison covering actual invalidation boundaries; preserve deterministic traces |
| `developers/tests/ingamespect.js` | Only add cases if a lifecycle/rotation/source-gating mutation path is not already covered |
| Existing performance benchmark | Three ghost density scenarios and before/after comparison |

Run the affected focused tests once after implementation, fix genuine failures, rerun affected failures, and perform one final relevant integration/regression run. Preserve existing assertions; do not weaken them just to obtain a pass. Report test commands and results, including skipped or unavailable checks and the reason. No new dependencies, CI workflows or GitHub Actions for this handoff. No repetitive exhaustive stress tests unless needed to reproduce a real failure.

## 11. Final manual acceptance checklist

When a permitted real-server/browser session is available, check the following. Record actual outcomes, not assumptions derived from source tests. Use existing debug controls and profiling. Do not leave extra instrumentation or settings behind.

- [ ] Full Map opens in supported modes, tiles calibrate, corner/edge coverage and viewport seams are correct, and diagnostics distinguish stale/noncontributing tiles.
- [ ] No systematic duplicate physical cells/skins, unskinned colour flicker, duplicate pellets, ghost trails or false suppression in ordinary and split-heavy play.
- [ ] Main player can spawn, move, split, eject and respawn while Full Map remains active without unnecessarily recreating passive sockets.
- [ ] Supported Multibox configurations coexist with Full Map. Toggling one feature does not disrupt the other or change active control unexpectedly.
- [ ] Rotate Map works while playing, spectating, paused and using permitted Multibox; cells, cameras, viewport rectangles, minimap, targets and food stay aligned.
- [ ] Stalled tiles/main source, recovery, socket replacement and server switches do not revive previous-generation observations or leave persistent duplicate cells/food.
- [ ] Existing population hysteresis, refusals, mode restrictions and Practice/Replay cleanup remain correct.
- [ ] Sustained busy gameplay has no new recurring frame spikes, excessive allocation growth, stale state or input responsiveness regressions attributable to the changes.
- [ ] Existing user settings and visual effects continue working; no duplicate implementation or unrequested feature was introduced.

## 12. Implementation sequence and final report

1. Establish current source revision and determine which findings are already fixed. Identify the supported ghost identity and leaderboard evidence before changing the matcher.
2. Address owned ambiguity, main freshness and metadata association in the smallest coherent changeset. Resolve distinguishable same-colour cases or document the unavoidable ambiguity policy. Preserve the ghost grid and prior fixes.
3. Audit retained-index invalidation, pooling, food freshness, raw-ID lookup and appearance caching. Fix only demonstrated defects, with compact regression coverage.
4. Run relevant existing tests and controlled benchmarks. Profile actual browser gameplay if available. Investigate demonstrated hotspots, not speculative rewrites.
5. Report changed files/functions, exact tests run, before/after measurements, remaining limitations and whether the loaded client artifact contains the fixes. Provide an actionable remaining list if any check is blocked.

Use this reporting table for each item:

| Finding | Status (fixed / already fixed / verified correct / residual limitation / blocked) | Evidence (file/function, reproduction/test, measurement) | Remaining action |
|---|---|---|---|
| Ghost identity and same-colour ambiguity | | | |
| Owned vs enemy candidate ambiguity | | | |
| Main-source freshness | | | |
| Leaderboard association | | | |
| Retained spatial index | | | |
| Food pooling | | | |
| Food freshness | | | |
| Raw-ID / appearance cache | | | |
| Dense ghost performance | | | |
| Packet bursts and live gameplay | | | |

**Definition of done:** All reproducible, distinguishable correctness defects are resolved; existing Full Map and Multibox functionality is preserved; affected tests pass; performance gains are retained or any necessary trade-offs are measured and explained; residual protocol ambiguity is documented; live acceptance is completed or explicitly marked unverified. Do not claim Full Map is completely fixed merely because synthetic tests pass. Do not keep adding heuristics to solve distinctions the server does not expose. No broad rewrite is requested.
