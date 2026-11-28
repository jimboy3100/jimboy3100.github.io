# Legend Mod: implementation decisions for Antigravity / Opus 5.5

2026-11-28. Published source inspected: ogario/ogario.v4.js blob 535a29fcefbb6f4da03b18d054bb8df68ba9e4ed and ogario/modules/discovery.js. Recheck local HEAD; line numbers refer to published baseline. These decisions supplement the Full Map and Multibox master handoffs. Owner delegated design decisions to ChatGPT.

## 1. Initial Multibox activation
KEEP coordinate verification before control transfers to a newly established player. _lmMbStart 25958–25974 waits for spawn/position, with a calibration hold up to 3 seconds. Timeout is not proof of verified orientation. Continue controlling existing living player while new connection is pending; do not unnecessarily delay switching to already verified living players. P2 traditional activation may focus on successful verified spawn; optional P3–P6 must not steal focus by default. Latest explicit selection takes precedence; failed/refused connection leaves existing players operational. Audit _lmMbFocus 26049–26070 and spawn focus latches.

## 2. Discover Features
KEEP existing guide; do not restore Command Centre. discovery.js exposes LMDiscovery.open() (413), currently has no menu entry (12–13). Add one compact entry in existing Information/Help interface, not a permanent HUD button or new panel system. Reuse styling, translations and window stacking. Audit obsolete feature cards and deleted settings; keep useful compatibility documentation.

## 3. One-color cells
CHANGE oneColoredSpectator. Current observation-level colour mutation and early exit from appearance sharing (ogario 2442) couple visual preference to physical identity. Preserve original server colours and authoritative owner/team colours. Resolve simplified appearance in existing rendering colour policy, live reversible without waiting for packets; preserve virus/food/owned and meaningful gameplay colours. Both Canvas2D and WebGL must agree. Profile actual performance; rename Simplified cell colors unless meaningful measured gain justifies performance label. Consolidate if existing setting duplicates it; preserve legacy setting/import compatibility. No second colour cache or renderer.

## 4. Ghost matching
KEEP improved _lmGhostMatch 2055–2104 (sorted ghost x, binary search, single world pass, per-source accumulation); prior nested scan should not return. Retain LM_GHOST_ID_MAX=1.5 provisionally (min .5, reach 2.5 at 2044); not sufficient identity evidence. Accumulation 2095–2101 can combine unrelated same-name/unnamed players. Strengthen conservative identity/ambiguity, size, temporal compatibility, ownership and freshness. Removed/stale/hidden invalid observations must not suppress live ghosts; do not sum across independent sources as if they were separate mass. Consider age of list when evaluating mass change. Test same-name/unnamed neighbors, split groups, own player, ejected mass and stale sources. Preserve corrected camera culling 86418–86428 and coverage freshness 86545–86570. Do not arbitrarily widen tolerances.

## 5. Rotate Map
RESTORE compatibility with Full Map where display transformations are supported, but keep restriction until correctness verified. Do not restore retired orientation-server setting or service (rotateMap setting comment 23129, UI 28841). Use existing local display transformation; raw and canonical coordinates/tile targets stay unchanged. Audit cells, food (lmFoodReplaceAll), viruses, ghosts, camera, minimap, debug rectangles, velocity, jelly geometry and inverse input conversion. Test rotation with Full Map off/on and existing supported player configurations, source reconnect and stale transform. No separate coordinate pipeline.

## 6. Auto-switch after death
CHANGE lmMbFallbackUnit 404–414: when enabled select next living playing slot cyclically, not unconditional P1 preference. Two-player behavior preserved. When disabled, death alone must not switch focus; preserve session and let user deliberately select another living player. Background death never steals focus. Removed/disconnected selected slot requires valid fallback independently of death preference. Session-alive and global menu policy independent of focus setting. No passive spectator selection.

## 7. Persistent profiles
SAVE P1–P6 assignments using existing profile/settings persistence. ensureMbSlots 28060–28082 currently retains P3+ only this session. Keep stable slot identity, durable profile identifiers if available, safe deletion/reordering and migration from saved pair. Preserve assignment when optional slot removed or capacity lowered; no cascading reassignment. Save preferences, not sockets/life/mass/generation; loading never silently creates optional connections. setProfileboxShadow 28095–28103 still highlights only P1/P2; generalise existing slot-aware UI; audit editing context and profile appearance. Do not share authentication tokens.

## 8. Manual split/feed parity
REJECT blanket restriction while P1 dead/spectating. Selected living playing client must support equivalent applicable manual controls independently of P1 life, using existing input and transport paths, respecting game/server limits and capability checks. No extra actions, broadcasting or new automated control strategies. No actions to dead, invalid, stale or passive connections. Audit keyboard/mouse/mobile/gamepad, menu/focus and generation safeguards. Test P1 dead/spectating with selected live secondary in permitted local fixture, and invalid selected player. Preserve existing server protocol behavior.

## 9. Slot colours
APPROVE current LM_MB_RING_DEFAULT_COLORS 3910: P1 #FF2FD6, P2 #00E5FF, P3 #A855F7, P4 #10B981, P5 #FFB020, P6 #FF5A36. Stable slot indicators across rings/minimap/HUD/viewports; selected indication separate. Never overwrite authoritative team/profile colours.

## 10. Default capacity
CORRECT multiboxAmount:3 at 23066 to 2; retain [2,6,1] schema at 23299. Keep existing slider for now, label maximum configured Multibox players. Enable defaults to P1+P2, optional extra players explicit. Lowering capacity must not silently disconnect occupied slots or truncate profiles; block new additions until within limit. Preserve valid user-saved preference; distinguish defaults from migration.

## 11. Development and release
No unchecked pushes. Implement, run relevant targeted existing tests, review regression risk, commit, push only after affected tests pass. No enormous duplicate suites. Offline browser fixtures by default; live tests deliberate, authorised and server-compliant. Never circumvent CAPTCHA/refusal/connection limits. Actual exit statuses required. Coordinate parallel agents editing same functions; avoid conflicting patches. Preserve existing Full Map architecture, authoritative ownership, visual physics, rendering, settings, translations, profiles, performance and backward compatibility. Verify single-player, default two-player, optional configurations and permitted Full Map coexistence. No unrelated changes or duplicate systems.

## Verification limitations
Recommendations above are decisions for implementation, not verified fixes. Local computer was offline during source review; unpublished changes and live behavior not verified. No production edits or tests executed by ChatGPT for this decision review.
