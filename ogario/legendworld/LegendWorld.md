# LegendWorld.md

## Overview

LegendWorld is a dynamically scaling Agar-style game server where the
playable map expands and contracts based on the number of active
players.

The map always remains **square** and **centered**, and changes size
smoothly when thresholds are crossed.

The system also includes **expansion notifications**, **safe contraction
warnings**, **danger phases**, and **controlled entity cleanup**.

------------------------------------------------------------------------

# Map Size Tiers

The server uses fixed map tiers depending on active player count.

  Player Count   Map Size
  -------------- ---------------
  0--30          5000 × 5000
  31--150        7071 × 7071
  151--300       10000 × 10000
  301--600       14142 × 14142
  601--960       17889 × 17889

The map always expands or contracts **symmetrically from the center**.

------------------------------------------------------------------------

# Hysteresis Thresholds

Separate thresholds are used for expansion and shrinking to prevent the
map from constantly resizing when player counts fluctuate near
boundaries.

### Expansion thresholds

\> 30 → expand to 7071\
\> 150 → expand to 10000\
\> 300 → expand to 14142\
\> 600 → expand to 17889

### Shrink thresholds

\< 25 → shrink to 5000\
\< 130 → shrink to 7071\
\< 260 → shrink to 10000\
\< 520 → shrink to 14142

This produces stable operating bands:

  Map Size   Player Range
  ---------- --------------
  5000       ≤30
  7071       25--150
  10000      130--300
  14142      260--600
  17889      ≥520

------------------------------------------------------------------------

# Map Positioning

The playable map is always centered.

If the center is `(0,0)`:

half = mapSize / 2

minX = -half\
maxX = +half\
minY = -half\
maxY = +half

Expansion adds new area **outside the current borders**.

Contraction removes area **from the outer edges inward**.

The original smaller map always remains at the center of larger maps.

------------------------------------------------------------------------

# Expansion Behavior

When a player threshold is exceeded:

1.  The server sends an **expansion notification opcode**.
2.  Clients receive the **target map size and transition duration**.
3.  The map expands **smoothly over several seconds**.
4.  The newly added outer area becomes playable.

### Food and Virus Population

When expansion occurs:

-   Food and viruses must be **spawned in the newly added region**.
-   The server must respect the **existing density ratios** already
    defined for the game.
-   The ratio of food and viruses across all map sizes must remain
    consistent.

------------------------------------------------------------------------

# Contraction Behavior

When the server decides to contract the map, the process occurs in
**three phases**.

------------------------------------------------------------------------

# Phase 1 --- Warning Phase (Light Green Zone)

The area that will eventually be removed becomes a **warning zone**.

Visual behavior:

-   The outer zone is displayed **light green**.

Gameplay behavior:

-   Players **do not receive extra damage because of the warning
    phase**.
-   Normal game mechanics still apply everywhere:
    -   anti-teaming
    -   virus mechanics
    -   normal gameplay damage

The purpose of this phase is to **inform players that the area will
become unsafe**.

### Duration

Recommended default:

120 seconds

This value should be configurable.

### Restrictions during warning

Immediately when contraction is announced:

-   New players **must not spawn in the soon-to-be-removed area**.
-   New food and viruses **must not spawn in the soon-to-be-removed
    area**.

Existing entities remain until the shrink occurs.

------------------------------------------------------------------------

# Phase 2 --- Danger Phase (Red Zone)

After the warning period ends:

The same outer region becomes a **danger zone**.

Visual behavior:

-   The zone becomes **red**, similar to the Battle Royale danger zone.
-   Unlike Battle Royale, the danger area is **square**, matching the
    map borders.

Gameplay behavior:

-   Cells that remain inside this zone accumulate **additional anti
    penalty**.
-   This additional anti stacks **on top of the normal anti already
    present in the game**.

The additional anti:

-   behaves exactly like existing anti mechanisms in the game
-   follows the same lifecycle as other anti penalties
-   uses the same decay and reset behavior

Example reference behavior:

-   similar lifetime mechanics to **anti penalties generated when
    popping a virus**

Damage or penalty scaling may be applied, but **exact numeric values are
intentionally left unspecified** for tuning later.

------------------------------------------------------------------------

# Phase 3 --- Map Shrink

After the danger phase:

The map begins **shrinking toward the target size**.

Shrink properties:

-   occurs **smoothly over several seconds**
-   the border moves inward continuously
-   the shrink is symmetric around the center

------------------------------------------------------------------------

# Entity Handling During Shrink

Entities are removed **only when the moving border reaches them**.

Entities affected:

-   food
-   viruses
-   ejected mass
-   any neutral map entities

If these objects fall outside the active border during shrink, they are
deleted.

------------------------------------------------------------------------

# Player Cell Handling

Player cells are evaluated individually.

If a player cell ends up outside the valid map border after shrink:

-   that specific cell is deleted

Remaining cells remain active.

If all cells of a player are deleted:

-   the player is considered dead.

Player mass must be recalculated from the surviving cells only.

------------------------------------------------------------------------

# Rendering

Clients must render the following zones:

### Normal gameplay

Standard map rendering.

### Warning phase

Outer zone tinted **light green**.

### Danger phase

Outer zone tinted **red**.

These zones should be visible on:

-   the **main map**
-   the **minimap**

------------------------------------------------------------------------

# Server Events / Opcodes

The server should explicitly notify clients of map events.

Recommended events:

MAP_EXPANSION_START\
MAP_CONTRACTION_WARNING\
MAP_CONTRACTION_DANGER\
MAP_SHRINK_START\
MAP_RESIZE_COMPLETE

Packets should include:

currentMapSize\
targetMapSize\
centerX\
centerY\
transitionDuration\
warningDuration\
timestamp

Clients must **never guess map state from player count**.

All resizing must be **server-authoritative**.

------------------------------------------------------------------------

# Transition Timing

Recommended durations:

map expansion: 5--6 seconds\
map shrink: 5--6 seconds\
warning phase: \~120 seconds\
danger phase: configurable

------------------------------------------------------------------------

# Spawning Rules

During contraction:

-   no spawning outside the **future safe area**
-   new players spawn only inside the **next map tier area**

During expansion:

-   spawning becomes available in newly opened regions.

------------------------------------------------------------------------

# Design Goals

LegendWorld map scaling aims to:

-   keep gameplay density balanced
-   avoid empty oversized maps
-   avoid constant map resizing
-   warn players clearly before contraction
-   ensure fairness when removing map areas
-   keep server behavior deterministic and authoritative.

------------------------------------------------------------------------
------------------------------------------------------------------------

# Implementation Details (Developer Reference)

This section documents how the spec above was implemented across the
server (C) and client (JS).

------------------------------------------------------------------------

## Server Architecture

All LegendWorld logic lives in `LegendWorld/src/` and is controlled by
the `MapScaler` module.

### Files

| File             | Role                                                           |
|------------------|----------------------------------------------------------------|
| `mapscaler.h`    | Data structures: `MapTier`, `MapPhase`, `MapEventType`, `MapScaler` state |
| `mapscaler.c`    | State machine, border interpolation, entity cleanup, scaling   |
| `config.h/c`     | 4 config fields (`lw_enabled`, `lw_warning_duration`, `lw_danger_duration`, `lw_transition_duration`) |
| `packet.h/c`     | `pkt_map_event()` — builds opcode 200 packets                 |
| `server.h`       | `MapScaler map_scaler` and `Border spawn_border` in `GameServer` |
| `server.c`       | Integration into `server_init()`, `server_tick()`, `server_random_pos_padded()` |
| `CMakeLists.txt` | `mapscaler.c` added to build                                  |

### MapScaler State Machine

The `MapScaler` struct in `mapscaler.h` tracks:
- Current and target tier/size
- Current phase (`PHASE_NORMAL`, `PHASE_EXPANDING`, `PHASE_WARNING`, `PHASE_DANGER`, `PHASE_SHRINKING`)
- Phase start tick and durations
- Base food/virus amounts for proportional scaling

`mapscaler_tick()` is called once per `server_tick()` (25Hz). It:
1. Counts active players (those with cells alive)
2. Checks expansion thresholds (highest matching tier wins)
3. Checks shrink thresholds (with hysteresis gap)
4. Manages phase transitions with timing
5. During EXPANDING/SHRINKING: lerps the border over `transition_duration` ticks
6. During SHRINKING: calls `cleanup_outside_border()` to remove entities
7. During DANGER: calls `apply_danger_zone_penalty()` adding `at_eject_penalty * 2` per tick to `anti_team_score`
8. At each phase transition: broadcasts opcode 200 to all connected clients
9. Returns `true` if the border changed (so `server_tick` sends updated `SetBorder` 0x40 packets)

### Tier Definition Table (mapscaler.c)

```c
static const MapTierDef tiers[5] = {
    {5000.0,   0,   0},    // MAP_5000: base, never shrink below
    {7071.0,  30,  25},    // MAP_7071: expand >30, shrink <25
    {10000.0, 150, 130},   // MAP_10000
    {14142.0, 300, 260},   // MAP_14142
    {17889.0, 600, 520},   // MAP_17889
};
```

For testing with few players, change these thresholds (e.g., 2/1 for first tier).

### Spawn Restriction

`server_random_pos_padded()` was modified to use `mapscaler_get_spawn_border()`
during contraction phases. This returns the **target (smaller) border**, so new
food, viruses, and players only spawn inside the future safe area. During normal
play and expansion, it returns the current (full) border.

### Food/Virus Count Scaling

When the map resizes, food and virus target amounts are scaled proportionally
to map area: `new_amount = base_amount * (new_area / base_area)`.

### Config Defaults (config.c)

```c
cfg->lw_enabled = 1;               // enabled for LegendWorld
cfg->lw_warning_duration = 3000;   // 120 seconds at 25Hz
cfg->lw_danger_duration = 750;     // 30 seconds at 25Hz
cfg->lw_transition_duration = 150; // 6 seconds at 25Hz
```

------------------------------------------------------------------------

## Opcode 200 (0xC8) — MapEvent Packet

Custom opcode sent by the LegendWorld server at each phase transition.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (200)
1       1      u8      Event type (1-5)
2       8      f64le   Current map size
10      8      f64le   Target map size
18      8      f64le   Center X (always 0.0)
26      8      f64le   Center Y (always 0.0)
34      4      u32le   Transition duration (ticks)
38      4      u32le   Warning duration (ticks)
Total: 42 bytes
```

### Event Types

| Value | Name                        | When sent                        |
|-------|-----------------------------|----------------------------------|
| 1     | MAP_EXPANSION_START         | Player count exceeds expand threshold |
| 2     | MAP_CONTRACTION_WARNING     | Player count drops below shrink threshold |
| 3     | MAP_CONTRACTION_DANGER      | Warning duration expires         |
| 4     | MAP_SHRINK_START            | Danger duration expires          |
| 5     | MAP_RESIZE_COMPLETE         | Border reaches target size       |

------------------------------------------------------------------------

## Client Implementation (ogario.test.v4.js)

All client changes are **dormant on non-LegendWorld servers**. The opcode 200
handler is guarded by `!LM.integrity` (private server only) and all rendering
checks `LM.mapEvent.active` which defaults to `false`.

### Changes Made

1. **`LM.mapEvent` state object** — Tracks phase, sizes, timing, previous borders.
   Defaults to `active: false, phase: 0`.

2. **`LM.handleMapEvent()`** — Processes the 5 event types:
   - Updates `mapEvent` state (phase, sizes, timing)
   - Shows `toastr` notifications (info for expand, warning for warning phase,
     error for danger phase)
   - Logs colored messages to console

3. **`case 200` in `handleMessage()`** — Parses the 42-byte opcode 200 packet
   using `DataView.getFloat64()` for the f64le values

4. **`drawLegendWorldZone()`** in `drawRender` — Renders the zone overlay on
   the main game canvas:
   - Warning phase: semi-transparent light green (`rgba(100,255,100,0.15)`)
   - Danger phase: pulsing red (`rgba(255,50,50, 0.12-0.20)`)
   - Draws 4 rectangular strips (top/bottom/left/right) between current and
     target borders
   - Draws a colored stroke rectangle at the safe zone edge

5. **Minimap zone rendering** in `drawMiniMap()` — Draws a green or red
   stroke rectangle on the minimap showing the safe zone boundary

### No Impact on Other Game Modes

- Opcode 200 is custom to LegendWorld; no other server sends it
- All rendering is gated behind `LM.mapEvent.active === true`
- `handleMapEvent()` is never called unless opcode 200 is received

------------------------------------------------------------------------

## Phase Flow Diagram

```
                    players > expand_threshold
    NORMAL ─────────────────────────────────────► EXPANDING
      ▲                                              │
      │                                    border lerp complete
      │                                              │
      │◄─────────────────────────────────────────────┘
      │           MAP_RESIZE_COMPLETE
      │
      │         players < shrink_threshold
      └─────────────────────────────────────► WARNING (green zone)
                                                 │
                 players recover?                 │ 120 seconds
                 ◄──── CANCELLED ────┘            │
                                                  ▼
                                             DANGER (red zone)
                                                 │
                                                 │ 30 seconds
                                                 ▼
                                             SHRINKING
                                                 │
                                    border lerp + entity cleanup
                                                 │
                                                 ▼
                                              NORMAL
```

### Contraction Cancellation

If players return above `shrink_threshold + 10` during the WARNING phase,
contraction is cancelled and the server returns to NORMAL. A
MAP_RESIZE_COMPLETE event is sent so the client clears the zone overlay.
