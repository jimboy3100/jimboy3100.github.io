# Legend Mod: Multibox correctness and performance handoff

**Date:** 2026-11-28  
**For:** Claude Opus 5.5 / Visual Studio coding agent  
**Repository:** `jimboy3100/jimboy3100.github.io`  
**Suggested handoff location:** `temp/from-chatgpt-multibox-final-audit-handoff-2026-11-28.md`

## 0. Assignment and boundaries

Read the current local code, compare it with the findings below, and implement all necessary corrections end to end. Make technical decisions yourself according to the existing gameplay contract. Check whether each finding has already been addressed by a newer local or published change before editing.

Multibox is substantially implemented, but two focus-related failures were reproduced against the published production methods. Other findings below are source inconsistencies, policy questions, or performance candidates, not all proven live-game defects. Resolve demonstrated defects first. Where protocol or gameplay intent is uncertain, establish the behaviour from existing tests, settings descriptions, history and available captures before changing it.

Non-negotiable requirements:

- Preserve all existing functionality, gameplay physics, split/feed timing, server support, camera responsiveness, skins, colours, controls and settings unless a demonstrated defect requires a narrowly scoped change.
- Preserve P1–P6, stable player slots, independent sockets, Full Map coexistence, and Rotate Map support. Do not reopen or rebuild already-working subsystems.
- Use the existing registry, input router, lifecycle and transformation functions. Do not add duplicate controllers, settings, renderers, diagnostics, or reconciliation systems.
- Do not bypass server restrictions or captcha requirements. Handle refusals and unavailable connections gracefully.
- Do not enable GitHub Actions. Prefer extending existing targeted tests and running affected cases locally; excessive test suites significantly slow development.
- Do not trade gameplay responsiveness or correctness for a benchmark improvement. No arbitrary packet dropping, reduced movement cadence, or disabling visual features.
- Report completed fixes, exact changed functions, regression results, performance evidence and remaining limitations. Do not declare the feature complete based solely on source inspection.

## 1. Audited revisions and evidence

| File | Published blob SHA |
|---|---|
| `ogario/ogario.v4.js` | `f57b9a8156087a88df94ee815615412bc28d2649` |
| `ogario/spect.js` | `7f15327b92c5c7c803cf5866482560a3dc28ae0d` |
| `developers/tests/ingamespect.js` | `d38e0bbfdf76d82a9499ea8075334416fc454a95` |
| `developers/tests/fullmaplifecycle.js` | `b4d10612af4d7da2278103a01cea96659b89c4c1` |

Line numbers below refer to these revisions; locate methods by name if the source has moved. The Windows development machine was offline at audit time. Two isolated reproductions were executed using the actual published method bodies and synthetic fixtures. Neither the full repository test suite nor live browser gameplay was independently executed. No production changes were made by the auditor.

## 2. P1: Manual player selection bypasses coordinate verification (reproduced)

**Locations:** `ogario.v4.js:26651–26674` (`_lmMbFocus`); `4685–4702` (`lmMbCameraBox`); `81910–81953` (`getMultiboxFrame`); `spect.js:3383–3479` (`beforecalculation`, `_lmSpawnHold`); `1228–1239` (`_lmAimSend`).

Manual focus currently calls `lmSetMbUnit(sp.number)` immediately, then calls `sp.respawn()` if inactive. Automatic spawn focus correctly checks `transformReady()` and uses `_lmFocusWait`. Camera collection excludes unverified units; the aim sender holds an unverified player at its own centre rather than using a guessed transform. Thus manual focus can select a player that is unavailable to the camera and ordinary aiming.

### Exact executed reproduction

Extract `_lmMbFocus` from production. Stub `lmMbUnits()` to return one unit, `lmSetMbUnit()` to record the selected source, `legendmod.play = true`, and empty `profiles`. Use `{number:16, active:true, transformReady:()=>false}` as the target. Start with focus on P1 and invoke `_lmMbFocus(sp)`.

Observed: focus changes to source 16 while its transformation remains unverified.

### Required correction

- Route manual selection, roster selection, forward/back switching, and automatic fallback through a consistent eligibility policy. Reuse `_lmFocusWait`, `_lmFocusOnSpawn`, `_lmFocusClaimed` and existing calibration logic where appropriate; do not create a second focus system.
- Keep an explicit selection pending if the target is spawning or its orientation is not known. Preserve the current usable player until the requested target can safely receive control, when possible. Clearly distinguish pending intent from actual control. If no usable player remains, retain the established dead-player/menu policy without routing actions to an unrelated unit.
- A newer manual choice must cancel earlier pending claims. Remove, reconnect, server change and slot reuse must invalidate obsolete pending claims; check object identity, slot epoch, socket generation and relevant life identity.
- Do not promote a provisional transform to verified simply because three seconds elapsed. Preserve the existing policy for previously verified but temporarily CONFLICTED playing sources unless evidence supports a change.
- Once valid, transfer camera, movement, action target, active slot, HUD and event reporting coherently. Emit `multiboxSwap` only for an actual control change.
- Do not block ordinary dead-player selection/respawn, or prevent users from selecting a desired player when the auto-switch setting is off.

Acceptance: P1 remains usable when selecting an unverified P2; verification completes and the current pending selection is honoured once; selecting P3 meanwhile prevents P2 from stealing focus; no stale request takes control after slot reuse or reconnect. Check manual selection and death-triggered fallback with Full Map on and off.

## 3. P1: Selected dead unit can retain focus after disconnect (reproduced)

**Location:** `spect.js:921–958`, `onclose(socket, generation)`.

```js
if (this.active) this.terminate('disconnect');
else if (window.multiboxPlayerEnabled === this.number && legendmod.play)
    lmSetMbUnit(0);
```

The inactive branch only considers P1, not other surviving players. The selected dead unit can remain selected while its socket is null, including after its reconnect budget is exhausted. The per-frame lost-focus fallback may eventually intervene in some configurations, but it does not make the close transition correct; its explicit-selection grace period or auto-switch policy can also delay recovery.

### Exact executed reproduction

Extract `onclose` from production; stub cleanup/event methods, console and timer. Set selected source 17, P1 dead, selected unit inactive, socket generation 2, matching current socket, `closedByUser=false`, `_reconnectAttempts=8`. Model another surviving unit (source 16); the close branch does not consult it. Invoke `onclose(socket,2)`.

Observed: selected source remains 17, its socket is null and attempts reach 9 (retry budget exhausted). This fixture establishes the immediate branch failure, not the duration of a live gameplay freeze.

### Required correction

- Reuse `lmMbFallbackUnit(sp,'disconnect')` for selected connections that become unavailable, whether they had living cells or not. Ensure the final choice satisfies the safe focus policy from section 2.
- Distinguish an intentional selection of a connected dead player awaiting respawn from an unavailable connection. The auto-switch-after-death setting controls death, not whether a disconnected unit can indefinitely consume input.
- Preserve bounded retry/backoff, manual retry, stable slot and profile. A background reconnect must not unexpectedly steal control.
- Make selected-unit removal, captcha refusal, disable Multibox and server change obey the same focus invariants. Preserve the existing explicit server refusal handling; never reopen repeatedly to evade it.
- Review whether the existing death-menu latch remains correct when the last usable player disappears, including failed reconnects.

Acceptance: P1 dead/P2 living/P3 selected and disconnected => select a usable surviving player according to policy; retry exhaustion does not strand focus; late close callbacks from an old socket cannot change current focus; background reconnect cannot override a newer manual choice.

## 4. P1: Focus and action routing must agree

**Locations:** `ogario.v4.js:319–348` (`getActiveSpect`, `lmSetMbUnit`); `396–407` (`lmMbFocused`, `lmMbSteersLiving`); `4453–4487` (`lmActiveUnit`); `46312+` (`sendPosition`); `89166–89174` (`core.act`).

`lmActiveUnit(true)` resolves the selected source and silently falls back to P1 when it cannot find that source. Other systems still examine `window.multiboxPlayerEnabled` independently. This permits disagreement: actions can target P1 while its movement controller treats it as inactive and the roster/camera still report the stale selection.

The current `core.act()` architecture is good: it checks target object, socket, connection generation, life and socket openness. Preserve it.

### Required correction

- Make the existing central focus transition resolve invalid source IDs before any consumer routes actions. Do not add independent fallback implementations in the camera, HUD and input handlers.
- Ensure `window.multiboxPlayerEnabled`, `lmMbPlayers.activeSlot`, `lmMbFocused()`, `lmActiveUnit()`, selected camera, roster and actual cursor target agree after each transition.
- Preserve legacy compatibility with older `spect.js` where supported, but never let a passive Full Map tile become a playing target. Validate current role and registry membership as appropriate.
- Reject or safely defer an aim-dependent action when its intended target cannot safely be steered; do not send it to an unintended fallback player. Preserve existing behavior for legitimate non-aim-dependent actions.
- Consider synchronous event listeners that remove, add or switch players during a transition. Avoid stale state writes after an emitted lifecycle event.

Acceptance: remove/reconnect/reuse the selected source; verify that no split or feed reaches an unintended player, and that camera/mouse/roster agree with the effective target. Include a passive spectator source ID in a negative fixture.

## 5. P1: Input state on disconnect/removal/death

**Locations:** `spect.js:2836–2925` (`terminate`); `ogario.v4.js:31200–31294` (`onPlayerDeath`, `_lmLifeInputEnd`); `55565–55611` (`_lmMbStop`, `flushSpecsData`); `25906–25937` (`_lmFeedTick`, `macroFeedPerm`); `26084–26120` (`_lmMacroId`, `_lmMacroSame`, `_lmSplitRun`); `89166+` (`core.act`).

`terminate` returns early on some disconnect paths before input cleanup. `_lmLifeInputEnd()` is called for a death, but not consistently for a selected player's removal or disconnect. Existing bound macro identity checks limit the danger of delayed actions; global pause, permanent feed, held keys and position locks still require lifecycle consistency.

### Required correction

Audit each state against its intended owner: player life, socket, current selection, or intentionally global setting. Reuse the current input cleanup and bound action mechanisms; avoid a new blanket reset that breaks held controls or settings during a background player's death.

| State | Required outcome |
|---|---|
| Pause | No unintended inheritance by a newly controlled life after its owner ends |
| Permanent feed | Stop when the bound life/socket becomes invalid |
| Held keyboard/mouse feed | Preserve existing binding semantics; no unintended feed to another player |
| Mobile held feed | Preserve intentional mobile rebind behavior; verify it cannot send to stale/invalid targets |
| Timed split macros | No remaining split after target/socket/life invalidation |
| Line split and crazy split locks | Release invalid owned locks without clearing a newer operation's lock |
| Background death/disconnect | Do not reset the input of an unrelated surviving controlled player |
| Disable Multibox/server change | Invalidate old connection-bound work and release appropriate timers/locks |

Check whether life identity should use the existing `_lmLife` counter in addition to or instead of the `playerCellIDs` array reference in `lmActiveUnit(true)`; do not change unless actual lifecycle semantics justify it. Check away-and-back focus during a delayed macro against intended cancellation semantics; the current equality checks see the identity at execution, not every intervening change.

Acceptance: exercise death, disconnect, remove and disable during permanent feed, pause and a split sequence. Assert zero unintended actions on the next player. Verify background life termination leaves the currently controlled player's valid inputs intact.

## 6. Profile identity and settings (source inconsistency; establish legacy intent)

**Locations:** `spect.js:2248–2260` (`handleSendNick`), `3550–3558` (own-cell profile application); `ogario.v4.js:469–473`, `28683–28735` (`lmMbProfileIdx`, `_lmMbSlotsLoad`, `ensureMbSlots`, `syncFromMbSlots`).

`handleSendNick()` sends a secondary profile nickname only when `defaultmapsettings.multiBoxShadow` is enabled. Otherwise it sends the main nickname from `#nick`. Own-cell assignment later applies the secondary profile nickname and skin independently.

Fixture: P1 nickname Alpha, P2 profile nickname Beta, shadow disabled. P2 sends Alpha while its local cell may display Beta. This is a direct source-level inconsistency, not a live protocol reproduction.

- Determine whether the legacy setting intentionally controls same-nickname spawning or only appearance. Review descriptions, old code and profile UI.
- Prefer independent profile identity and visual settings if that matches the product contract. If same-nickname spawning is intentional, local nickname, server identity, team/leaderboard matching and display labels must remain internally consistent without losing that configuration.
- Do not overwrite raw server identity metadata with a cosmetic nickname. Preserve per-cell own skin assignment and shared appearance reconciliation.
- Preserve persistent P1–P6 assignments and profiles above a temporarily reduced capacity. Reducing the capacity must not disconnect existing players or erase their profiles.

Acceptance: distinct nicknames, same nicknames, different skins, shadow on/off, profile selection, removed/re-added middle slot, capacity reduction/increase, reconnect and server change. Verify actual submitted nickname and displayed nickname according to the chosen documented policy.

## 7. Configured player capacity must be enforced at creation boundary

**Locations:** `ogario.v4.js:240–311` (registry), `462–465` (`lmMbCapacity`), `26583–26604` (`mbEnable`, `mbAddPlayer`); `spect.js:418–446` (`addBox`).

`mbAddPlayer()` enforces configured capacity, but public `window.addBox()` reserves a free registry slot without checking the user's configured maximum. The registry protects the absolute six-player limit but direct callers can bypass a lower configured maximum.

- Enforce the configured limit in the existing creation/reservation boundary before constructing a socket. Count occupied and reserved playing slots including P1, never passive spectators.
- Preserve existing players if capacity is lowered below their count; prevent new additions until capacity permits them. Preserve slot epochs, rollback on construction failure and `_busy` protection.
- Audit direct callers for intentional compatibility. Do not silently remove public APIs.

Acceptance: capacity 2 rejects a direct second secondary creation; capacity 6 permits at most five secondary players; Full Map tiles do not count; failed construction releases reservation; no socket created for rejected additions.

## 8. Camera framing and stalled players (policy/visual verification)

**Locations:** `ogario.v4.js:4622`, `4659–4711`, `81910–81953`.

`getMultiboxFrame()` computes a fitting factor but clamps the zoom contribution to at least `LM_MB_CAMERA_NEAR = 0.8`. For sufficiently distant players it may centre between them without fitting them in the screen. This may be intentional legacy combat zoom behavior; do not blindly remove the clamp.

- Establish existing semantics of focused view, middle-of-both/all, middle-when-close and camera smoothing. Preserve normal combat responsiveness. If the always-middle mode promises fit-all rather than simply centring, correct that mode only.
- With three to six players, verify that the sequential union/weighted calculation does not produce unacceptable slot-order dependence, camera oscillation or an off-screen controlled player. Compare identical positions assigned to different slots.
- `lmMbCameraBox()` excludes unverified sources but does not explicitly reject stalled observations. Establish a safe policy for last-known positions: avoid dragging combined camera toward an indefinitely stalled unit while preserving the player's own cells and short-stall continuity.
- Verify both axes, split-cell bounds, wide/tall screens, manual zoom, rotation and current interpolation. Do not add another camera setting.

## 9. Inactive movement, aim retention and rotation (preserve physics)

**Locations:** `ogario.v4.js:24011–24030` (`lmFoldMbInactive`, `lmMbInactiveMoves`), `46312+` (`sendPosition`); `spect.js:1189–1276` (`sendCursor`, `_lmAimSend`, `_lmAimTarget`).

Keep the consolidated `mbInactive` choice (`move`/`stay`) and migration from `multiKeepMoving`/`mbFreeze`. Do not reintroduce contradictory switches.

The secondary cursor controller sends `_lmAimSend()` but updates `distX/distY` using the ordinary cursor. Effective transmitted aim can differ under line lock, dance, line split or position lock. Verify whether the intended inactive behavior retains the last raw mouse direction or the last effective movement direction.

- Preserve canonical world-space offsets and correct conversion into each connection's raw frame; never transfer guessed orientation into outgoing aim.
- Audit finite initialization/reset of player centre and `distX/distY`, particularly immediately after spawn, reconnect and before the first active cursor tick. Avoid accidental `(0,0)` or non-finite targets; hold or defer when inputs are not valid.
- If effective-aim retention is intended, store the actual accepted movement direction only when appropriate. Do not update retained motion on rejected/locked sends unless explicitly intended. Preserve legacy semantics where proven deliberate.
- Verify Rotate Map during active/inactive movement, pause, line lock and pending split operations. Ensure no double inversion of world-space offsets.
- Keep the 40 ms movement cadence unless measured evidence and control-equivalence tests justify a change.

## 10. Background auto-respawn and login lifecycle (protocol verification)

**Locations:** `spect.js:2071–2096` (opcode 102), `2927–2946` (`respawn`), `728–845` (connection reset/connect), `1079–1141` (pending login), `3745–3767` (`MultiTokenReady`); `ogario.v4.js:543–550` (`lmMbTokenSlot`).

The auto-respawn setting is consumed, passive spectators are excluded, pong type 31 is rejected and spawn requests are rate limited. Actual respawning depends on appropriate server packets. Verify normal death, connection loss, login, and late responses on supported modes using existing captures where possible.

- Do not add a periodic spawn loop without proof that the server flow requires it. Distinguish first spawn, requested respawn, background auto-respawn and reconnect; malformed/unrelated packets must not spawn a player.
- Verify `mbAutoRespawn=false` does not prevent explicit manual respawn and does not unexpectedly spawn after background death. Preserve existing main `autoResp` semantics.
- Verify one alternate social-account holder and guest units do not kick one another. Pending login callbacks must stay bound to the initiating socket and slot; cancellation/timeouts, removal and slot reuse must release appropriate state. Respect server authentication and captcha requirements.
- Preserve generation isolation and bounded retries. Review readiness checks, especially when manual respawn occurs on an open but not yet handshake-ready socket.
- Secondary `sendBuffer()` currently sends `data.buffer` rather than the DataView slice (`spect.js:1048–1050`). Verify all actual call sites and correct offset/length handling if subviews can be passed; preserve encryption/key progression and full-buffer fast path. Do not claim a current live failure without evidence.

## 11. Preserve the existing rendering/reconciliation architecture

The previous Full Map audit identified substantial shared improvements. Do not undo them in a Multibox fix. Relevant mechanisms include:

- Per-connection coordinate transform, generation and ownership isolation.
- Physical-cell reconciliation rather than merging by nickname or raw ID alone.
- Source-local ownership/observation indexes, raw-ID lookup, shared appearance cache, retained spatial grid with revision/drift guards, incremental food reconciliation and bounded pooling.
- Per-player profile skins, Canvas2D/WebGL ring implementations, slot-colour minimap and roster, leaderboard rows, camera bounding boxes and one-pass min/max mass calculation.
- Full Map and Multibox independent lifecycles; opening or closing one must not reopen the other's sockets.

Cross-check both renderers, own/enemy classification, split indicators, mass reference, skin and colour, minimap, roster, and Rotate Map. Preserve visible gameplay information. The previously delivered Full Map handoff addresses remaining shared ghost identity and freshness questions; do not duplicate that investigation or implement a second matcher.

## 12. Performance: measured evidence and targeted follow-up

The audited revision includes genuine shared performance changes. Previously reported developer benchmark medians (not independently rerun during the Multibox audit):

| Scenario | Previous | Latest | Reduction |
|---|---:|---:|---:|
| Multibox + Full Map | 0.847 ms | 0.687 ms | 18.9% |
| Full Map | 0.685 ms | 0.577 ms | 15.8% |
| mb5 | 0.586 ms | 0.517 ms | 11.8% |

A previous isolated ghost-matching benchmark reported about 5.60 ms to 1.53 ms with 4,000 observations and 50 dispersed ghosts. That is a workload-specific result, not a whole-game FPS improvement.

### 12.1. Independent movement timers

Each secondary playing unit uses a 40 ms interval. With P1–P6 the nominal opportunities are 150 position updates per second, before split/feed or Full Map traffic; actual sends vary. Profile callback clustering, packet burst handling and scheduling delay. Preserve the timing and input latency. Do not create a separate scheduler unless measurements prove a need, and then demonstrate equivalent gameplay behaviour.

### 12.2. Duplicate mass/position calculations

`spect.js:3383–3463` (`beforecalculation`), `3661+` (`calculatePlayerMassAndPosition`) and `ogario.v4.js:58495–58503` (`updateMultiboxUnitPositions`) can invoke mass and position calculation through packet and frame paths. Determine whether redundant work occurs with unchanged inputs. Separate authoritative packet data from interpolated frame positions; do not remove required per-frame interpolation or min/max combat calculations.

### 12.3. Action descriptor allocation

`lmActiveUnit(true)` constructs a small descriptor on each invocation, including high-frequency feed. This is a low-priority candidate only if profiling identifies meaningful allocation pressure. Delayed macros retain descriptors: replacing them with a single mutable object breaks identity validation. Preserve immutable snapshot semantics for bound work.

### 12.4. Practical performance measurements

Use the existing profiler/browser DevTools and existing benchmarks, not a new diagnostics subsystem. Record equivalent scenes for P1 only, P1/P2, P1–P6, and permitted Full Map combinations. Include dense cells, split-heavy combat, rapid switches and reconnects. Compare:

- Median, P95/P99 frame times and long tasks; packet callback duration and bursts.
- Reconciliation, interpolation/jelly, Canvas2D/WebGL rendering, camera/HUD costs.
- Allocation/GC pressure and retained objects after repeated add/remove/reconnect cycles.
- Actual position/action cadence and responsiveness, not just average FPS.

Keep workload, rendering settings, browser and hardware comparable. Distinguish independently measured results from prior developer reports. Avoid a renderer rewrite or workers without evidence. If live access is unavailable, state that explicitly rather than estimating live FPS.

## 13. Minimal regression plan (extend existing tests)

Inspect `developers/tests/ingamespect.js` (1,330 lines at audit), `developers/tests/fullmaplifecycle.js` (957 lines), and locate the existing Multibox registry/input/camera fixtures and benchmark scripts in the local repository. Exact names of additional suites were not verified in the audit. Do not invent new parallel suites if existing ones cover the same functions.

Add a small number of focused cases, preferably to existing fixtures:

1. Unverified manual focus with a usable current player; verification, replacement selection, stale slot/socket invalidation.
2. Selected inactive unit disconnects with P1 dead and another survivor; exhausted reconnect budget and both auto-switch settings.
3. Invalid/stale source selection never sends actions to an unintended player; passive spectator excluded.
4. Selected-life termination versus background termination with active pause/feed/split lock, checking existing mobile behavior.
5. Configured capacity at public creation entry, reservation rollback and passive tile coexistence.
6. Profile nickname/shadow contract and movement/camera cases only where the investigation establishes a defect or changes semantics.

Run the affected existing suites once after changes and repeat only failing/changed cases as needed. Run syntax checks on changed JavaScript. Reuse existing performance fixtures if performance-sensitive code changes. No GitHub Actions, mass test generation or unrelated test churn.

## 14. Final acceptance checklist

- [ ] P1–P6 can spawn and play independently where server permits.
- [ ] Slot IDs, connection IDs, epochs and life identities remain distinct; removing a middle unit preserves other slots.
- [ ] Manual and automatic selection respect orientation verification and never select a passive tile.
- [ ] Disconnect, death, removal and retry exhaustion leave valid focus or a deliberate dead/menu state.
- [ ] Background reconnect and late callbacks cannot unexpectedly steal focus.
- [ ] Mouse, keyboard, mobile controls, camera, roster, active ring and event state agree.
- [ ] Delayed splits, held/permanent feed, pause and locks never leak onto an unintended player.
- [ ] Profiles, submitted nicknames, local appearance and skins obey the documented settings contract.
- [ ] Capacity limits are enforced without disconnecting existing players when the limit is lowered.
- [ ] Inactive stay/move and follow-mouse behavior work correctly with rotation, reconnect and active macros.
- [ ] Camera modes and smoothing behave correctly for nearby/distant players and stalled sources.
- [ ] Full Map and Multibox can be toggled independently while playing; no needless reconnects or calibration loss.
- [ ] Rotate Map works with up to six players and permitted Full Map coexistence.
- [ ] Server changes/disable leave no obsolete sockets, timers, ownership, observations or pending actions.
- [ ] Existing shared reconciliation and performance improvements remain intact.
- [ ] Targeted regression results and actual performance evidence are reported; any unverified live behavior is explicitly marked.

## 15. Required report back

Provide a concise table for each finding: already fixed / fixed now / intentional legacy behavior / unresolved / needs live verification. Include changed functions and line references, exact targeted tests and results, performance comparisons where available, and any decisions or trade-offs. Do not present source inspection as live verification. Keep changes scoped to demonstrated defects and justified policy corrections.

**Bottom line:** preserve the existing architecture. The two reproduced focus failures are the first priority, followed by focus/action consistency and lifecycle-specific input cleanup. Profile, capacity, camera, movement and respawn issues require the precise investigations described above. Complete the work rather than stopping at analysis.
