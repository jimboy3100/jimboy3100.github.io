# Expanding Land

## Overview

Expanding Land is a high-performance Agar-style game server written in pure C,
designed for 1000+ concurrent players on a single core. The playable map
dynamically expands and contracts based on the number of active players.

The map always remains **square** and **centered**, and changes size smoothly
when thresholds are crossed. The system includes **expansion notifications**,
**safe contraction warnings**, **danger phases**, and **controlled entity
cleanup**.

**Server Version:** 1.2.44
**Play at:** [expanding.land](https://expanding.land)
**Connect:** `wss://ffa.legendmod.ml:8080`

---

## Performance vs Node.js

| Metric | Node.js MultiOgarII | Expanding Land |
|--------|---------------------|----------------|
| **Max stable players** | ~200 | **1000+** |
| **Tick time at 400 players** | ~40 ms (over budget) | **~5 ms** |
| **GC pauses** | 5–50 ms randomly | **0 ms (no GC)** |
| **Binary size** | ~50 MB (Node + deps) | **~350 KB** |
| **Spectator batching** | 100× full world queries | **1 query, 100 sends** |

### Spectator Scaling

Grouped spectators share one quadtree query, sort, and diff. Only per-spectator
packet encoding remains (each client has its own scramble values for anti-cheat):

| Spectators | Node.js cost | Expanding Land cost | Savings |
|-----------|-------------|--------------------|---------| 
| 1 | 1.0 ms | 1.0 ms | — |
| 10 | 10 ms | 2.2 ms | **78%** |
| 50 | 50 ms | 7 ms | **86%** |
| 100 | 100 ms | 13 ms | **87%** |

---

# Map Size Tiers

Scale 1.0 = 14142 = real Agar.io map size. Each tier scales by ×√2.

| Tier | Side   | Scale  | Food   | Virus | Expand >N | Shrink <N |
|------|--------|--------|--------|-------|-----------|-----------|
| 0    | 7071   | 0.25   | 1000   | 12    | (base)    | (never)   |
| 1    | 10000  | 0.50   | 2000   | 25    | 1         | 0 (never) |
| 2    | 14142  | 1.00   | 4000   | 50    | 30        | 20        |
| 3    | 20000  | 2.00   | 8000   | 100   | 120       | 90        |
| 4    | 28284  | 4.00   | 16000  | 200   | 240       | 180       |
| 5    | 40000  | 8.00   | 32000  | 400   | 480       | 360       |
| 6    | 56569  | 16.00  | 64000  | 800   | 960       | 720       |
| 7    | 80000  | 32.00  | 128000 | 1600  | 1920      | 1440      |
| 8    | 113137 | 64.00  | 256000 | 3200  | 3840      | 2880      |
| 9    | 160000 | 128.00 | 512000 | 6400  | 7680      | 5760      |

The map always expands or contracts **symmetrically from the center**.
Tier 0 is the boot tier — the server instantly expands to tier 1 when the
first player connects. Tier 1 never shrinks back to tier 0.

---

# Hysteresis Thresholds

Separate thresholds prevent constant resizing when player counts fluctuate
near boundaries. Starting from tier 3, thresholds follow a doubling pattern
(base: expand 120, shrink 90).

| Map Size | Scale  | Player Range |
|----------|--------|--------------|
| 7071     | 0.25   | 0–30         |
| 10000    | 0.50   | 1–120        |
| 14142    | 1.00   | 20–240       |
| 20000    | 2.00   | 90–480       |
| 28284    | 4.00   | 180–960      |
| 40000    | 8.00   | 360–1920     |
| 56569    | 16.00  | 720–3840     |
| 80000    | 32.00  | 1440–7680    |
| 113137   | 64.00  | 2880+        |
| 160000   | 128.00 | 5760+        |

---

# Map Positioning

The playable map is always centered at `(0, 0)`:

```
half = mapSize / 2
minX = -half    maxX = +half
minY = -half    maxY = +half
```

Expansion adds new area **outside** the current borders.
Contraction removes area **from the outer edges inward**.

---

# Contraction Phases

## Phase 1 — Warning Phase (Light Green Zone)

- Outer zone displayed **light green**
- Normal gameplay mechanics still apply
- **No new spawning** in the soon-to-be-removed area
- Default duration: **60 seconds** (configurable, `lw_warning_duration = 1500 ticks`)

If players return above `shrink_threshold + 10` during this phase,
contraction is **cancelled**.

## Phase 2 — Danger Phase (Red Zone)

- Zone becomes **red** (pulsing)
- Cells in the zone accumulate **additional anti-team penalty**
- Stacks on top of normal anti-team penalties
- Default duration: **15 seconds** (configurable, `lw_danger_duration = 375 ticks`)

## Phase 3 — Map Shrink

- Border moves inward **smoothly over 6 seconds**
- Entities outside the moving border are removed
- Player cells outside the border are deleted individually
- If all cells are deleted, the player dies

---

# Transition Timing

| Phase            | Duration    | Ticks (25Hz) |
|------------------|-------------|-------------|
| Expansion        | 6 seconds   | 150         |
| Warning (green)  | 60 seconds  | 1500        |
| Danger (red)     | 15 seconds  | 375         |
| Shrink animation | 6 seconds   | 150         |

All values are configurable in `config.c`.

---

# Ring Spawning

During expansion, new food and viruses spawn **exclusively in the outer ring**
(newly expanded area). Entities within the pre-expansion area spawn normally
as replacements.

---

# Protocol

Implements the Agar.io binary WebSocket protocol (version 6, accepts up to 22).

## Standard Opcodes

| Opcode       | Direction | Description |
|--------------|-----------|-------------|
| `0x00` (0)   | C→S       | Join (name + skin) |
| `0x01` (1)   | C→S       | Spectate |
| `0x0C` (12)  | C→S       | Skin URL (UTF-16LE, no null terminator) |
| `0x10` (16)  | C→S       | Mouse position (movement input) |
| `0x10` (16)  | S→C       | Update nodes (add/update/eat/delete) |
| `0x11` (17)  | C→S       | Split / spectate toggle target |
| `0x11` (17)  | S→C       | Update position (camera + scale + tick) |
| `0x12` (18)  | C→S       | Spectate toggle (Q key — free-roam ↔ grouped) |
| `0x12` (18)  | S→C       | Clear all nodes |
| `0x14` (20)  | S→C       | Clear owned nodes |
| `0x15` (21)  | C→S       | Eject mass (W key) |
| `0x20` (32)  | S→C       | Add owned node |
| `0x31` (49)  | S→C       | FFA leaderboard |
| `0x37` (55)  | C→S       | Full map spectate (toggle) |
| `0x38` (56)  | C→S       | Full map center spectate (toggle, camera pinned to 0,0) |
| `0x39` (57)  | C→S       | Quit game (orphan cells — they remain edible on the map) |
| `0x40` (64)  | S→C       | Set border |
| `0x45` (69)  | S→C       | Ghost cells (sent on death) |
| `0x56` (86)  | C→S       | Recaptcha token (ignored — not needed for private servers) |
| `0x63` (99)  | Both      | Chat message |
| `0x66` (102) | Both      | Mobile data — protobuf (economy, auth, potions) |
| `0xE2` (226) | S→C       | Ping |
| `0xE3` (227) | C→S       | Pong (client echoes ping) |
| `0xFE` (254) | Both      | Server stats — C→S requests, S→C responds with JSON |
| `0xFF` (255) | S→C       | LZ4-compressed packet |

## Handshake Opcodes

| Opcode       | Direction | Description |
|--------------|-----------|-------------|
| `0xFE` (254) | C→S       | Protocol version (first handshake byte — u32le, range 1–22) |
| `0xFF` (255) | C→S       | Handshake key (second handshake byte — u32le, Delta sends client version) |

## Custom Opcodes (Expanding Land / LegendMod)

| Opcode        | Direction | Description |
|---------------|-----------|-------------|
| `0xC8` (200)  | S→C       | Map event (expansion/contraction notifications) |
| `0xC9` (201)  | S→C       | LM stats (alive players + bot count) |
| `0xC9` (201)  | C→S       | LM identification (`[201, type]` — 1=client, 2=bot) |
| `0xCA` (202)  | S→C       | Decay info (extra decay multiplier per player) |
| `0xCA` (202)  | C→S       | Team message (`[202][u8 type][UTF-16LE message...]`) |
| `0xCB` (203)  | C→S       | Set clan tag (`[203][UTF-8 tag, null-terminated]`, max 15 chars) |
| `0xCC` (204)  | C→S       | Profile info (`[204][provider][socialId\0][displayName\0]`) |
| `0xF0` (240)  | S→C       | LW handshake beacon (`[0xF0, 'L', 'W']` — identifies Expanding Land) |
| `0xF0` (240)  | C→S       | LM handshake response (`[0xF0, 'L', 'M']` — identifies LegendMod client) |

---

## Opcode 200 (0xC8) — MapEvent Packet

Custom opcode sent at each map phase transition. Also sent during handshake
so the client knows the current map state immediately upon connecting.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (200 / 0xC8)
1       1      u8      Event type (1-5)
2       8      f64le   Current map size
10      8      f64le   Target map size
18      8      f64le   Center X (always 0.0)
26      8      f64le   Center Y (always 0.0)
34      4      u32le   Transition duration (ticks)
38      4      u32le   Warning duration (ticks)
42      1      u8      Current tier index (0-9)
Total: 43 bytes
```

### Event Types

| Value | Name                    | When sent |
|-------|-------------------------|-----------|
| 1     | MAP_EXPANSION_START     | Player count exceeds expand threshold |
| 2     | MAP_CONTRACTION_WARNING | Player count drops below shrink threshold |
| 3     | MAP_CONTRACTION_DANGER  | Warning duration expires |
| 4     | MAP_SHRINK_START        | Danger duration expires |
| 5     | MAP_RESIZE_COMPLETE     | Border reaches target size |

---

## Opcode 201 (0xC9) — LM Stats (S→C)

Sent every leaderboard interval (~1 second). Updates the "Total" display in
LegendMod UI.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (201 / 0xC9)
1       2      u16le   Alive player count (cells > 0)
3       2      u16le   Bot count (always 0 — server can't distinguish)
Total: 5 bytes
```

## Opcode 201 (0xC9) — LM Identification (C→S)

Sent by the client to identify itself as a LegendMod client or bot.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (201 / 0xC9)
1       1      u8      Client type (1 = LegendMod client, 2 = LegendMod bot)
Total: 2 bytes
```

---

## Opcode 202 (0xCA) — Decay Info (S→C)

Per-player extra decay multiplier info. Sent every leaderboard interval
(~1 second) to alive players only. The wire format is backward-compatible
with legacy clients — per-type fields are zeroed, and the multiplier is
reported via the existing score/threshold/multiplier fields.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (202 / 0xCA)
1       2      u16le   Extra decay multiplier (× 10000, e.g. 5000 = 0.5)
3       2      u16le   AT threshold (always 0 — no threshold in new system)
5       2      u16le   Effective decay multiplier (× 100, from pow(base, multiplier))
7       5×5    types   Per-type breakdown (zeroed for backward compatibility)
32      1      u8      In danger zone (0 or 1)
33      2      u16le   Danger phase seconds remaining
35      1      u8      Decay interval (seconds between decay cycles)
Total: 36 bytes
```

### Decay Calculation

```
effective_decay = base_decay × pow(1.086, extra_decay_multiplier)
```

The multiplier increases with teaming actions and decreases by 0.005
per decay cycle (compensation constant).

---

## Opcode 202 (0xCA) — Team Message (C→S)

Sent by clients to broadcast a message to teammates (same clan tag).

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (202 / 0xCA)
1       1      u8      Message type
2       N      u16le[] UTF-16LE encoded message (null-terminated)
```

Rate limited: 1 message per 2 seconds (50 ticks).

---

## Opcode 203 (0xCB) — Set Clan Tag (C→S)

Sets the player's team/clan tag for team message routing.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (203 / 0xCB)
1       N      u8[]    UTF-8 tag string (null-terminated, max 15 chars)
```

---

## Opcode 204 (0xCC) — Profile Info (C→S)

Sent after login to provide social profile data. The server uses this
to populate the player's display name and social ID, then resends the
login response (opcode 102, sub-op 11) with the complete profile data.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (204 / 0xCC)
1       1      u8      Auth provider (0=unknown, 1=Google, 2=Facebook, 3=Discord)
2       N      u8[]    Social ID (null-terminated, max 31 chars)
2+N     M      u8[]    Display name (null-terminated, max 63 chars)
```

---

## Opcode 240 (0xF0) — LW Beacon / LM Handshake

### Server → Client (LW Beacon)

Sent during handshake to identify the server as an Expanding Land instance.
Clients use this to activate LegendWorld-specific UI features.

```
Offset  Size   Type    Field
0       1      u8      Opcode (240 / 0xF0)
1       1      u8      'L' (0x4C)
2       1      u8      'W' (0x57)
Total: 3 bytes
```

### Client → Server (LM Response)

Sent by LegendMod clients to confirm they recognize the LW beacon.

```
Offset  Size   Type    Field
0       1      u8      Opcode (240 / 0xF0)
1       1      u8      'L' (0x4C)
2       1      u8      'M' (0x4D)
Total: 3 bytes
```

---

## Opcode 0x45 (69) — Ghost Cells

Sent on player death. Contains the last known positions and masses of the
player's cells for death screen rendering.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x45)
1       2      u16le   Cell count
3       N×13   cells   Ghost cell array
```

### Ghost Cell Entry (13 bytes each)

```
Offset  Size   Type    Field
0       4      i32le   X position
4       4      i32le   Y position
8       4      u32le   Mass
12      1      u8      Flags (reserved, always 0)
```

---

## Opcode 0x11 (17) — Update Position

Camera position and viewport scale, sent every tick to each player.

### Binary Format

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x11)
1       4      f32le   Camera X (+ scramble offset)
5       4      f32le   Camera Y (+ scramble offset)
9       4      f32le   Scale (zoom level)
13      4      u32le   Server tick counter (for client-side interpolation)
Total: 17 bytes
```

---

## Opcode 0x10 (16) — Update Nodes (Protocol 6)

The main game state update packet sent each tick. Contains eat records,
update/add records for cells, and delete records.

### Cell Flags Byte

| Bit | Mask   | Name              | Description |
|-----|--------|-------------------|-------------|
| 0   | `0x01` | isVirus           | Cell is a virus |
| 1   | `0x02` | isColorPresent    | Color bytes follow (always set on add) |
| 2   | `0x04` | isSkinPresent     | Skin string follows (UTF-8, null-terminated) |
| 3   | `0x08` | isNamePresent     | Name string follows (UTF-8, null-terminated) |
| 4   | `0x10` | isAgitated        | Virus is agitated (fed 7 times) |
| 5   | `0x20` | isOwnEjected      | Ejected mass belonging to the viewing player |
| 6   | `0x40` | isOtherEjected    | Ejected mass belonging to another player |
| 7   | `0x80` | hasExtendedFlags  | Extended flags byte follows |

### Extended Flags Byte (only when bit 7 is set)

| Bit | Mask   | Name    | Description |
|-----|--------|---------|-------------|
| 0   | `0x01` | isFood  | Cell is food (lightweight rendering) |

---

## Opcode 102 (0x66) — Mobile Data (Protobuf)

Full Agar.io economy replication via protobuf sub-opcodes:

| Sub-opcode | Direction | Description |
|-----------|-----------|-------------|
| 10        | C→S       | Login request (auth token) |
| 11        | S→C       | Login response (wallet, potions, XP, level, profile) |
| 20        | S→C       | Disconnect |
| 30/31     | Both      | Ping / Pong keep-alive |
| 62        | S→C       | Game Over (triggers death screen, session stats, potions) |
| 75        | S→C       | Wallet update (coins + DNA) |
| 81        | S→C       | Update user settings response (skin change) |
| 111       | S→C       | Activate timed event response (hourly bonus coins) |
| 113       | S→C       | Activate boost response (mass/XP boost) |
| 115       | S→C       | Activate quest response |
| 123       | S→C       | Brew potion response |
| 125       | S→C       | Open potion response (coins/DNA reward) |

### Economy Features

| Feature | Description |
|---------|-------------|
| **Auth** | Google / Facebook / Discord OAuth login, persistent player identity |
| **XP & Leveling** | Exact Agar.io XP thresholds (max level 100), starting mass bonus |
| **Potions** | Award on death (rarity based on performance), brew timer, open for coins/DNA/XP |
| **Potion Drop Cells** | Periodic loot cells that spawn on the map, award 3 random potions |
| **Boosts** | Mass boost (multiplies eaten mass) and XP boost, inventory persistence |
| **Wallet** | Coins + DNA currency |
| **Quests** | Daily quest activation and reward responses |
| **Hourly Bonus** | Timed event coin rewards |
| **Skins** | User settings update for equipped skins |

### Potion Drop Cells

| Setting | Default | Description |
|---------|---------|-------------|
| `potion_cell_count` | 3 | Cells per wave |
| `potion_cell_spawn_interval` | 90000 ticks | Time between waves (1 hour) |
| `potion_cell_lifetime` | 1500 ticks | Despawn timer (1 minute) |

Any player cell can eat a potion cell regardless of size.

### Potion Rarity & Brew Times

| Rarity | Brew Duration | Coin Reward | DNA Reward |
|--------|---------------|-------------|------------|
| Common | 30 seconds (750 ticks) | 10–30 | — |
| Uncommon | 2 minutes (3000 ticks) | 30–80 | 1 |
| Exotic | 10 minutes (15000 ticks) | 80–200 | 2–3 |
| Legendary | 30 minutes (45000 ticks) | 200–900 | 5–10 |

---

# Leaderboard

Updated every **25 ticks (1 second)**. Uses a sorted top-N insertion
(partial selection, O(n×k) where k=max_lb entries). Default max entries: **20**.

### Dirty-flag Optimization

The leaderboard packet is pre-serialized with all `isMe=0`. For each player,
the `isMe` field is patched (set to 1) at the stored byte offset, sent,
then unpatched. Packet is only re-serialized when `lb_dirty` is true
(membership or scores changed).

### Cell Count Rebuild (v1.2.44)

When cells are eaten, `is_removed` is set but `cell_count` was not
decremented. Starting in v1.2.44, the leaderboard update rebuilds
`cell_count` from actual live (non-removed) cells, ensuring dead players
are immediately removed from the leaderboard.

---

# Anti-Teaming System (Delta Extra Decay)

Exponential multiplier-based anti-teaming ported from Delta Server. Each player
has a single `extra_decay_multiplier` float — teaming actions increase it, time
naturally decreases it. Communicated to clients via opcode 202.

### Formula

```
effective_decay = base_decay × pow(1.086, extra_decay_multiplier)
```

### Multiplier Bumps

| Action | Bump | Notes |
|--------|------|-------|
| **Split** | `+0.5` | Per split action |
| **W/Eject** | `+0.1` | Per W press (flat, not per cell) |
| **Virus pop** | `+0.5` | Per virus consumed |
| **Danger zone** | `+0.01` | Per decay cycle in outer ring |

### Config Values

| Setting | Value | Description |
|---------|-------|-------------|
| `at_extra_decay_base` | `1.086` | Exponential curve steepness |
| `at_compensation` | `0.005` | Multiplier recovery per decay cycle |
| `at_split_loss` | `0.5` | Multiplier bump per split |
| `at_eject_loss` | `0.1` | Multiplier bump per W press |
| `at_virus_pop_loss` | `0.5` | Multiplier bump per virus pop |
| `at_danger_loss` | `0.01` | Multiplier bump per danger zone cycle |
| `player_decay_rate` | `0.002` | Base decay (0.8%/4s) |
| `decay_interval` | `100` | How often decay runs (4s at 25Hz) |

### Recovery

Multiplier decreases by `0.005` per decay cycle. At multiplier=0, decay is 1×
base. At multiplier=5, decay is 1.51×. At multiplier=10, decay is 2.28×.

---

# Gameplay Mechanics

## Split Queue

Splits are **queued, not immediate**. Rapid space presses (1→2→4→8→16)
are processed atomically in one tick before collisions. This prevents
viruses from popping partially-split cells.

## Quit Game (Opcode 57)

When a player quits via opcode 57, their cells are **orphaned** (owner
cleared), not deleted. The cells remain on the map as ownerless blobs
that other players can eat — no mass is denied.

## Eject Throttle

Ejects are throttled to 1 per 5 ticks (200ms), matching real Agar.io
behavior.

## Tab-Switch Backpressure

When a player switches browser tabs, the browser stops reading WebSocket
data, causing TCP backpressure. The server detects this and:
1. Skips sending updates to that player (prevents stale packet buildup)
2. Forces a full state snapshot when they return (prevents visual glitches)

## Latency Reduction

- **Tick timestamp** — Position packets include a server tick counter for
  smooth client-side interpolation regardless of jitter
- **Input jitter buffer** — Mouse inputs smoothed via exponential filter
  (0.7 factor, ~96 ms to converge)
- **Viewport LOD** — Food cells near viewport edge get position updates
  on even ticks only (~15–20% bandwidth savings)
- **Adaptive tick rate** — Idle or high-RTT spectators (no input in >200 ms)
  receive updates at 12.5 Hz instead of 25 Hz, halving their bandwidth

---

# Player Persistence (playerdb)

All player data stored in `players.dat` with automatic format migration
(V1 → V2 → V3 → V4 → V5).

| Field | Description |
|-------|-------------|
| `uid` | SHA-hashed OAuth token (64 chars) |
| `total_xp`, `level` | Cumulative XP, calculated level (max 100) |
| `games_played`, `total_kills` | Lifetime stats |
| `all_time_peak_mass` | Highest mass ever achieved |
| `coins`, `dna` | Wallet balances |
| `potion_inventory` | Packed potion counts by rarity |
| `boost_mass`, `boost_xp` | Boost inventory counts |
| `display_name` | Last known in-game name |
| `equipped_skin` | Vanilla skin ID |
| `created_at` | Unix timestamp of first login |
| `trophies` | Trophy count |
| `total_mass_consumed` | Lifetime mass eaten |
| `quests_completed` | Lifetime quests completed |
| `skins_created` | Lifetime skins created |

Max 262,144 unique players. Journal-based persistence with dirty tracking.

---

# Server Architecture

## Source Files

| File | Role |
|------|------|
| `main.c` | Entry point, game loop, CLI args |
| `server.c / .h` | Core simulation (tick, collisions, visibility, leaderboard) |
| `mapscaler.c / .h` | Dynamic map scaling (Expanding Land phases) |
| `config.c / .h` | Configuration & MAP_SCALE |
| `net.c / .h` | WebSocket server (epoll on Linux, select on Windows) |
| `client.c / .h` | Client message handling (opcodes) |
| `cell.c / .h` | Cell struct (cache-optimized), physics |
| `player.c / .h` | Player state, extra decay multiplier, potions, boosts |
| `playerdb.c / .h` | Persistent player database (journal + snapshot) |
| `proto102.c / .h` | Protobuf encoder for opcode 102 economy |
| `discord_oauth.c / .h` | Discord OAuth2 callback handler |
| `quadtree.c / .h` | Spatial indexing for dynamic cells |
| `food_grid.h` | Spatial hash grid for food (64×64) |
| `packet.c / .h` | Protocol packet builders |
| `buffer.c / .h` | Binary reader/writer |
| `tls.c / .h` | Optional TLS via OpenSSL |
| `write_pool.c / .h` | Auto-scaling TLS write thread pool (max 31 threads) |
| `async_log.c / .h` | Non-blocking ring-buffer logging |
| `lz4.c / .h` | LZ4 compression (vendored) |
| `vec2.h` | 2D vector math |
| `event.h` | Event type definitions |
| `version.h` | Server version string |

## Key Optimizations

- **Zero-allocation game loop** — flat contiguous cell pool, no malloc during gameplay
- **Free-list cell allocator** — O(1) allocation and removal
- **TLS write thread pool** — auto-scales with CPU cores (N-1 threads, max 31)
- **CPU affinity pinning** — sim thread pinned to core 0
- **sqrt() elimination** — squared distances in collision hot paths
- **O(n) radix sort** — 4-pass LSD radix sort for cell IDs
- **Spatial hash food grid** — 64×64 grid, O(1) insert/remove
- **Dirty-cell pull model** — viewers pull changes per tick
- **LZ4 compression threshold** — packets under 200 bytes sent raw
- **Spectator batching** — grouped spectators share one quadtree query
- **Async logging** — ring buffer, flushed by background thread every 100ms
- **TCP_NODELAY** — Nagle's algorithm disabled on every socket
- **Cached math** — `pow()` computed once per size change via hardware `exp2/log2`
- **O(1) cell removal** — stored indices for constant-time swap-and-remove
- **Cache-optimized cell struct** — hot fields in first 56 bytes (one cache line)
- **Per-player send batching** — all per-tick packets queued into one `send()`
- **Conditional log macros** — compile out entirely in release builds

## Configuration Defaults

| Setting | Default | Description |
|---------|---------|-------------|
| Port | `8080` | WebSocket listen port |
| Capacity | `1024` | Total player slots |
| Max active | `1024` | Playing cap |
| Max spectators | `256` | 25% of capacity |
| Max connections | `1280` | Active + spectators |
| Food | `4000` | At scale 1 |
| Viruses | `50` | At scale 1 |
| Tick rate | `25 Hz` | Game updates per second |
| Leaderboard interval | `25 ticks` | 1 second |
| Leaderboard entries | `20` | Max entries shown |
| Decay interval | `100 ticks` | 4 seconds |
| LZ4 threshold | `200 bytes` | Min packet size for compression |

---

# Handshake Sequence

When a client connects, the following handshake sequence occurs:

```
1. C→S: [0xFE][protocol:u32le]     — protocol version (1-22)
2. C→S: [0xFF][key:u32le]          — handshake key (Delta sends client version)
3. S→C: Opcode 0x12 (ClearAll)
4. S→C: Opcode 0x40 (SetBorder)    — border + game type + server name
5. S→C: Chat message               — server version string
6. S→C: Chat message               — welcome message (if configured)
7. S→C: [0xF0, 'L', 'W']          — LW beacon (Expanding Land identification)
8. S→C: Opcode 0xC8 (MapEvent)     — current map phase + tier
9. C→S: [0xF0, 'L', 'M']          — LM ack (if LegendMod client)
```

All handshake packets (steps 3–8) are batched into one send.

---

# Client Implementation (ogario)

All client changes are **dormant on non-Expanding Land servers**. Opcode 200
handler is guarded by `!LM.integrity` (private server only). All rendering
checks `LM.mapEvent.active` which defaults to `false`.

### Map Event State Object

`LM.mapEvent` tracks phase, sizes, timing, previous borders. Defaults to
`active: false, phase: 0`.

### Zone Rendering

- **Warning phase:** semi-transparent light green (`rgba(100,255,100,0.15)`)
- **Danger phase:** pulsing red (`rgba(255,50,50, 0.12-0.20)`)
- Draws 4 rectangular strips (top/bottom/left/right) between current and
  target borders
- Draws a colored stroke rectangle at the safe zone edge
- Also rendered on the **minimap**

---

# Phase Flow Diagram

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
                 players recover?                 │ 60 seconds
                 ◄──── CANCELLED ────┘            │
                                                  ▼
                                             DANGER (red zone)
                                                 │
                                                 │ 15 seconds
                                                 ▼
                                             SHRINKING
                                                 │
                                    border lerp + entity cleanup
                                                 │
                                                 ▼
                                              NORMAL
```

---

# Changelog (Recent)

### v1.2.44
- **Fix:** Stale leaderboard — dead players (all cells eaten) now
  immediately removed. `cell_count` is rebuilt from live cells during
  leaderboard update.
- **Migration:** Anti-teaming system rewritten — replaced discrete event-based
  system with Delta exponential multiplier (`at_extra_decay_base=1.086`).
- **Tuning:** Contraction phases shortened — warning 120s → 60s, danger 30s → 15s.
- **Tuning:** Tier 1 expand threshold 0 → 1 (needs at least 1 player).

### v1.2.43
- FPS section text readability fix (dark mode)
- Updated player capacity references to 1024

### v1.2.33+
- Economy system (opcode 102) — XP, potions, boosts, wallet
- Discord OAuth integration
- Player persistence (playerdb V5)
- Anti-teaming exponential multiplier system (Delta architecture)
- Potion drop cells
- LW beacon handshake (opcode 0xF0)
- Team chat (opcode 202 C→S), clan tags (opcode 203)
- Profile info (opcode 204) with auto-resend of login response
- Full map spectate (opcodes 55/56) + quit game (opcode 57)
- Split queue (atomic multi-split processing)
- Weekly Discord leaderboard (GitHub Actions)
- Automated deployment (CI/CD)
