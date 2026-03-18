# MultiOgar / MultiOgarII WebSocket Protocol — Extended

**Version:** Protocol 4–24 (Legacy Protocol) - protocol version 6 recommended for full compatibility

**Reference server:** Custom fork based on jimboy3100/imsolo-servers / ThebigbossCE/ImSoloServers

**Reference client:** Custom Agar2 application (Development Agar2 Application project for Web and Desktop production builds) and ImSolo.pro Web Client

**Protocol supported by clients:** ImSolo.pro / Agar2.com / Legend Mod / Delta v3 / Delta v4 / Solo Extension

**Outdated clients:** HSLO / Agartool / Cigar2

**Last updated:** 2026-03-18

---

This document describes the binary WebSocket protocol used by the LegacyProtocol server implementation for ImSolo.pro and Agar2.com. All values are little-endian. Strings in protocol ≤5 are UCS-2 (2 bytes per char, null-terminated with 0x0000). Strings in protocol 6+ are UTF-8 (1 byte per ASCII char, null-terminated with 0x00).

## Table of Contents

1. [API — Getting a GameServer URL](#api--getting-a-gameserver-url-matchmaker--load-balancer)
2. [Connection & Handshake](#connection--handshake)
3. [Anti-Cheat & Security](#anti-cheat--security)
4. [Client → Server Messages](#client--server-messages)
5. [Server → Client Messages](#server--client-messages)
6. [UpdateNodes (0x10) — The Core Packet](#updatenodes-0x10--the-core-packet)
7. [Cell Types](#cell-types)
8. [Extended Cell Flags (Protocol 6+)](#extended-cell-flags-protocol-610)
9. [Protocol Version Ranges](#protocol-version-ranges)
10. [Changelog vs Original MultiOgar](#changelog-vs-original-multiogar)

---

## API — Getting a GameServer URL (Matchmaker / Load Balancer)

This document focuses on the binary WebSocket protocol, but the Agar2 client typically does one HTTP request first to discover which game server to connect to for a given region + gamemode.

### Summary (client flow)

1. User picks Region and Mode in the dashboard UI.
2. Client calls: `GET {baseUrl}/getserver/{mode}`
3. Response JSON contains `gameurl` (a `ws://` or `wss://` URL).
4. Client connects to `gameurl` via WebSocket and then performs the handshake described in [Connection & Handshake](#connection--handshake).

### Base URL by region (current Agar2 app)

| Region | baseUrl |
|--------|---------|
| Europe | `https://manage-eu.agar2.com/getserver/` |
| North America | `https://agar2.com/getserver/` |
| Other / fallback | `https://loadbalancer.static.imsolo.pro/getserver/` |

The final request URL is formed by concatenating `baseUrl + mode` (no extra slash needed because the base URLs above already end with `/`).

### Gamemode strings

| UI label (Mode) | `{mode}` value to request |
|----------------|--------------------------|
| FFA | `FFA` |
| Experimental | `Experimental` |
| Teams | `Teams` |
| Party | `Party` |

### Agar2 servers

Available servers: FFA, Experimental, Teams, Party — Realistic agar servers and experience

**EUROPE:**
- `GET https://manage-eu.agar2.com/getserver/FFA`
- `GET https://manage-eu.agar2.com/getserver/Experimental`
- `GET https://manage-eu.agar2.com/getserver/Teams`
- `GET https://manage-eu.agar2.com/getserver/Party`

**NORTH AMERICA:**
- `GET https://agar2.com/getserver/FFA`
- `GET https://agar2.com/getserver/Experimental`
- `GET https://agar2.com/getserver/Teams`
- `GET https://agar2.com/getserver/Party`

### ImSolo.pro servers

Available servers: Rookery, Dagestan (Megasplit), Arctida (selfeed), Maxisplit (x32) — Realistic agar servers with fun and bots

- `GET https://loadbalancer.static.imsolo.pro/getserver/rookery`
- `GET https://loadbalancer.static.imsolo.pro/getserver/megasplit`
- `GET https://loadbalancer.static.imsolo.pro/getserver/selfeed`
- `GET https://loadbalancer.static.imsolo.pro/getserver/x32`

### Response format

The client expects JSON with at least the field:

```json
{
  "gameurl": "wss://example.game.host:port"
}
```

The `gameurl` is used directly as the WebSocket URL for the LegacyProtocol connection.

---

## Connection & Handshake

The client connects via WebSocket (binary mode). On connection open, it sends three packets in sequence:

### Step 1: Protocol Version (0xFE)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFE (254)
1-4     uint32    Protocol version (4–24)
```

**Total: 5 bytes.** Versions below 4 are clamped to 4.

### Step 2: Client Key (0xFF)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFF (255)
1-4     uint32    Client key (unused, typically 0)
```

**Total: 5 bytes.** On receipt the server creates the player object and sends the PlayerID packet back.

### Step 3: Auth Packet (0x02) — Optional - Only for Agar2

Sent immediately after connection if the user is logged in:

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x02 (2)
1..N    string    Account UUID (null-terminated, 25 chars)
```

If the UUID is valid, the server verifies it against the account system and sends an AuthSuccess (0xC9) response. If not sent within 250 ticks, the player is marked as a guest. This method is only used for Agar2, and not for ImSolo.

### Server Response

After the key packet, the server sends:

1. **PlayerID (0xFA)** — The player's assigned ID
2. **ClearAll (0x12)** — Reset client state
3. **SetBorder (0x40)** — Map boundaries, game mode, and server name
4. **ChatMessage (0x63)** — Welcome messages (if configured, usually ignored)

---

## Anti-Cheat & Security

### Scramble Values

The original MultiOgar scramble system (scrambleX, scrambleY, scrambleId) is **not used** in this implementation — all scramble values are effectively 0.

### Connection Security

| Check | Description |
|-------|-------------|
| Origin filtering | Checks origin header against allowed origins for monthly statistic reports |
| Canvas fingerprint | Required unless origin is in the skip-verification whitelist (only for ImSolo.pro vanilla), discontinued in favor of privacy |
| reCAPTCHA v3 | Verified server-side via Google API; score below threshold disconnects (only for ImSolo.pro vanilla) |
| IP challenge | Optional secondary verification via external IP challenge API (only for ImSolo.pro vanilla, kinda discontinued) |
| IP proxy detection | Detects suspicious IP connections, and verifies for proxy usage using the ImSolo API |
| Ban check | Checks IP, UUID, and canvas fingerprint against ban database (canvas fingerprint discontinued since 2024) |
| Account verification | UUIDs are verified against the account system API |

---

## Client → Server Messages

All client messages start with a **1-byte opcode**. Little-endian byte order.

### 0x00 — Spawn (Join Game)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x00
1..N    string    Player nickname (null-terminated)
N..M    string    Skin name (null-terminated)
M..O    string    Account UUID (null-terminated, fallback to stored userID)
O..P    string    Party code (null-terminated, max 7 chars)
P..Q    uint16    (optional) Target unit ID for multibox routing
```

- Protocol ≤5: strings are **UCS-2**
- Protocol 6+: strings are **UTF-8**
- Falls through to case 1 (Spectate) — requesting spectate after spawn data is parsed

### 0x01 — Spectate

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x01
```

**Total: 1 byte.** Enters spectator mode.

### 0x02 — Auth (Account UUID) - Agar2 exclusive

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x02
1..N    string    Account UUID (null-terminated, 25 chars)
```

Sent immediately after connection open. Only accepted once per connection. The server verifies the UUID against the account system and responds with AuthSuccess (0xC9) on success.

### 0x04 — Shop Action - Agar2 exclusive

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x04 (4)
1       uint8     Action type (see table below)
2..N    string    (optional) Boost type or slot number (UTF-8, null-terminated)
```

**Action types:**

| Value | Action | String field |
|-------|--------|-------------|
| 1 | Claim free coins | — |
| 2 | Buy boost | Boost type name |
| 3 | Activate boost | Boost type name |
| 4 | Get boost status | — |
| 5 | Get potion status | — |
| 6 | Start brew potion | Slot number (as string) |
| 7 | Open potion | Slot number (as string) |

Rate-limited: 1 request per second (shop and potion actions have separate cooldowns).

### 0x10 — Mouse Position

#### Protocol 4 (21 bytes):

```
Offset  Type      Description
0       uint8     0x10
1-8     float64   Mouse X
9-16    float64   Mouse Y
17-20   uint32    (unused)
```

#### Protocol 5 early (9 bytes):

```
0       uint8     0x10
1-2     int16     Mouse X
3-4     int16     Mouse Y
5-8     uint32    (unused)
```

#### Protocol 5 late / 6+ (13 bytes):

```
0       uint8     0x10
1-4     int32     Mouse X
5-8     int32     Mouse Y
9-12    uint32    (unused)
```

#### With multibox routing (15 bytes):

```
0       uint8     0x10
1-2     uint16    Target unit ID
3-6     int32     Mouse X
7-10    int32     Mouse Y
11-14   uint32    (unused)
```

The server distinguishes protocol variant by message length (9 / 13 / 15 / 21 bytes).

### 0x11 — Split (Space)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x11 (17)
1-2     uint16    (optional) Target unit ID for multibox
```

**1 or 3 bytes.** Splits all cells toward current mouse position. If controlling minions, splits all minions instead. Supports optional unit ID for multibox routing.

### 0x12 — Q Press

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x12 (18)
```

**Total: 1 byte.** Toggles minion control if minions are present, otherwise triggers gamemode-specific Q action.

### 0x13 — Q Release

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x13 (19)
```

**Total: 1 byte.** Resets Q press state.

### 0x15 — Eject Mass (W)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x15 (21)
1-2     uint16    (optional) Target unit ID for multibox
```

**1 or 3 bytes.** Ejects mass toward mouse position. Supports minion control, multibox control, and unit ID routing.

### 0x16 — Minion Split (E key / ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x16 (22)
```

**Total: 1 byte.** Splits all minions. Requires `minionEnableERTPControls` setting.

### 0x17 — Minion Eject (R key / ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x17 (23)
```

**Total: 1 byte.** Ejects mass from all minions. Requires `minionEnableERTPControls` setting.

### 0x18 — Minion Freeze Toggle (T key / ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x18 (24)
```

**Total: 1 byte.** Toggles minion freeze state. Requires `minionEnableERTPControls` setting.

### 0x19 — Minion Roam (Not implemented)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x19 (25)
```

**Total: 1 byte.** Reserved but not implemented.

### 0x1A — Triple Split

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1A (26)
```

**Total: 1 byte.** Triple-split all cells (or minions if controlling them).

### 0x1B — Quad Split

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1B (27)
```

**Total: 1 byte.** Quad-split (16-split) all cells (or minions if controlling them).

### 0x1C — Double Split

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1C (28)
1-2     uint16    (optional) Target unit ID for multibox
```

**1 or 3 bytes.** Double-split all cells. Supports minion control, multibox control, and unit ID routing.

### 0x1D — Minion Double Split (ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1D (29)
```

**Total: 1 byte.** Double-splits all minions. Requires `minionEnableERTPControls`.

### 0x1E — Minion Quad Split (ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1E (30)
```

**Total: 1 byte.** Quad-splits all minions. Requires `minionEnableERTPControls`.

### 0x1F — Minion Triple Split (ERTP)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x1F (31)
```

**Total: 1 byte.** Triple-splits all minions. Requires `minionEnableERTPControls`.

### 0x20 — Player Freeze Toggle

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x20 (32)
```

**Total: 1 byte.** Toggles freeze state on the player's own cells.

### 0x21 — Eject Booster: Freeze

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x21 (33)
```

**Total: 1 byte.** Ejects a freeze booster cell. Requires `worldEnableBoosterControls` setting.

### 0x22 — Eject Booster: Speed

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x22 (34)
```

**Total: 1 byte.** Ejects a speed booster cell. Requires `worldEnableBoosterControls`.

### 0x23 — Eject Booster: Speed Instant

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x23 (35)
```

**Total: 1 byte.** Ejects an instant speed booster cell. Requires `worldEnableBoosterControls`.

### 0x24 — Eject Booster: Virus

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x24 (36)
```

**Total: 1 byte.** Ejects a virus booster cell. Requires `worldEnableBoosterControls`.

### 0x25 — Eject Booster: Shield

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x25 (37)
```

**Total: 1 byte.** Ejects a shield booster cell. Requires `worldEnableBoosterControls`.

### 0x28 — Random Spawn Request

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x28 (40)
```

**Total: 1 byte.** Requests a one-time random respawn location.

### 0x29 — Toggle Permanent Random Respawn

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x29 (41)
```

**Total: 1 byte.** Toggles whether the player always respawns at random locations.

### 0x2D — TAB Press (Multibox Toggle)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x2D (45)
```

**Total: 1 byte.** Toggles control between the main player and the multibox instance. Requires `playerEnableTABBasedControl` and `worldMultiboxInstancesPerPlayer > 0`.

### 0x31 — Spectate Specific Player

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x31 (49)
1-2     uint16    Player ID to spectate
```

**Total: 3 bytes.** Sets the spectating target to the player with the given ID.

### 0x32 — Ban Player (Anti-Cheat Trigger)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x32 (50)
```

**Total: 1 byte.** Triggers immediate permanent ban of the sender. Used as an anti-cheat measure (triggered by client-side cheat detection).

### 0x63 — Chat Message

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x63 (99)
1       uint8     Flags (client sends 0x00)
2..N    (skip)    Variable-length reserved bytes based on flags
N..M    string    Message text (null-terminated)
```

**Flag skip calculation:** `2 * ((flags & 2) + (flags & 4) + (flags & 8))` bytes.

- Protocol ≤5: message text is **UCS-2**
- Protocol 6+: message text is **UTF-8**
- Messages starting with `/` are treated as **commands** (bypass moderation)
- Server-side moderation via external API (3 warnings → auto-mute)

### 0xFE — Request Server Stats

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFE (254)
```

**Total: 1 byte.** Also used as a **heartbeat/ping** mechanism. The client sends this every 2 seconds via a Web Worker to survive tab throttling.

---

## Server → Client Messages

All server messages start with a **1-byte opcode**. Little-endian byte order.

### 0x10 — UpdateNodes (Cell Updates)

The main game-state packet, sent every tick (~25 Hz). See the [detailed section below](#updatenodes-0x10--the-core-packet).

### 0x11 — UpdatePosition (Camera)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x11 (17)
1-4     float32    Camera X
5-8     float32    Camera Y
9-12    float32    Camera zoom scale
```

**Total: 13 bytes.** Sent in spectate mode to tell the client where to center its viewport.

### 0x12 — ClearAll

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x12 (18)
```

**Total: 1 byte.** Client must clear all known cells and reset state. Sent during handshake and on world reset. Also resets the leaderboard.

### 0x14 — ClearOwned

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x14 (20)
```

**Total: 1 byte.** Client clears its owned cell list. *Currently not actively used by the client.*

### 0x15 — Death Notification

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x15 (21)
```

**Total: 1 byte.** Sent when the player dies. The client resets score, clears owned cells, and shows the death summary / dashboard. Only sent to protocol ≤10.

### 0x20 — AddNode (Own Cell)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x20 (32)
1-4     uint32    Cell ID
```

**Total: 5 bytes.** Tells the client it now owns this cell (e.g., after spawning or splitting).

### 0x30 — TextBoard (Protocol 4–13)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x30 (48)
1-4     uint32     Number of text entries
For each entry:
  +0    string     Text line (null-terminated, encoding per protocol)
```

Used for text-based leaderboards on protocols 4–13. On protocol 14+, text boards use opcode 0x35 instead.

### 0x31 — Leaderboard (FFA)

#### Protocol 4–10:

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x31 (49)
1-4     uint32     Number of entries
For each entry:
  +0    uint32     Cell ID (protocol 4–5) or isMe flag (protocol 6: 1=self, 0=other)
  +4    string     Name (null-terminated, encoding per protocol)
```

#### Protocol 11–13:

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x33 (51)
For each entry:
  +0    uint8      8 = self (uses client's own name), 2 = other
  +1    string     Name (UTF-8, null-terminated) — only if flag is 2
```

#### Protocol 14+:

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x35 (53)
For each entry:
  +0    uint8      8 = self (uses client's own name), 2 = other
  +1    string     Name (UTF-8, null-terminated) — only if flag is 2
```

### 0x32 — Leaderboard (Team / Pie Chart)

#### Protocol 4–20:

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x32 (50)
1-4     uint32     Number of teams
For each team:
  +0    float32    Team score (0.0 to 1.0, fraction of total)
```

#### Protocol 21+:

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x32 (50)
1-4     uint32     Number of teams
For each team:
  +0    float32    Team score
  +4    uint8      Color R
  +5    uint8      Color G
  +6    uint8      Color B
```

Protocol 21+ adds **team color** to each pie slice entry.

### 0x40 — SetBorder (Map Boundaries)

#### Without game type (33 bytes, border update):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x40 (64)
1-8     float64    Border minX
9-16    float64    Border minY
17-24   float64    Border maxX
25-32   float64    Border maxY
```

#### With game type (variable, initial handshake):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x40 (64)
1-8     float64    Border minX
9-16    float64    Border minY
17-24   float64    Border maxX
25-32   float64    Border maxY
33-36   uint32     Game mode (0=FFA, 1=Teams, 2=Experimental)
37..N   string     Server name (null-terminated, encoding per protocol)
```

### 0x63 — ChatMessage

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x63 (99)
1       uint8      Flags
2       uint8      Color R
3       uint8      Color G
4       uint8      Color B
5..N    string     Sender name (null-terminated)
N..M    string     Message text (null-terminated)
```

**Flag bits:**

| Bit | Hex | Meaning |
|-----|-----|---------|
| 2 | 0x04 | Moderator message |
| 6 | 0x40 | Admin message |
| 7 | 0x80 | Server message |

- Protocol ≤5: strings are **UCS-2**
- Protocol 6+: strings are **UTF-8**

### 0xC8 — ShopResponse (200)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xC8 (200)
1       uint8      Action type (matches client request: 1–7)
2       uint8      Success (1 = true, 0 = false)
3-6     int32      Current coin balance
7-10    int32      Remaining seconds (for cooldown-based actions)
11..N   string     Error message or JSON data (UTF-8, null-terminated)
```

**JSON payload varies by action type:**

| Action | Success payload |
|--------|----------------|
| 1 (Free coins) | — (coins/remaining in header fields) |
| 2 (Buy boost) | `{"inventory": [...], "activeBoosts": [...]}` |
| 3 (Activate boost) | `{"inventory": [...], "activeBoosts": [...]}` |
| 4 (Boost status) | `{"inventory": [...], "activeBoosts": [...]}` |
| 5 (Potion status) | `{"slots": [...], "dna": N, "trophies": N, "weeklyTrophies": N}` |
| 6 (Start brew) | `{"slot": N, "tier": N, "status": "...", "remainingMs": N, "slots": [...]}` |
| 7 (Open potion) | `{"tier": N, "rewards": [...], "dna": N, "trophies": N, "weeklyTrophies": N, "slots": [...]}` |

### 0xC9 — AuthSuccess (201)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xC9 (201)
```

**Total: 1 byte.** Sent after successful UUID verification. Client uses this to flush pending shop actions and request initial boost/potion status.

### 0xF9 — BattleBorder Update (249)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xF9 (249)
1-2     uint16     Enabled (0 = disabled, 1 = enabled)
3-4     uint16     Center X
5-6     uint16     Center Y
7-10    int32      Radius
```

**Total: 11 bytes.** Sent periodically when battle royale mode is active. Only sent to protocol ≤10.

### 0xFA — PlayerID (250)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xFA (250)
1-2     uint16     Player ID
```

**Total: 3 bytes.** Sent immediately after the key handshake to inform the client of its assigned player ID. Also sent when a multibox instance is ready.

### 0xFB — Party Friend Update (251)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xFB (251)
1       uint8      Has friend (1 = yes, 0 = no)
If has friend:
  2-5   int32      Friend X position
  6-9   int32      Friend Y position
  10..N string     Friend nickname (UTF-8, null-terminated)
  N..M  string     Friend skin (UTF-8, null-terminated)
```

Sent to players who share the same party code. Contains the nearest party friend's position and identity.

### 0xFC — Minimap Ghost Cells (252)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xFC (252)
1-2     uint16     Number of ghost cells
For each ghost cell:
  +0    uint16     Player ID
  +2    int32      Player X position
  +6    int32      Player Y position
  +10   int32      Total mass
  +14   string     Player color as hex string (UTF-8, e.g. "#ff0000", null-terminated)
  +N    string     Player name (UTF-8, null-terminated)
```

Sent periodically for minimap rendering. Only sent to protocol ≤10. Frequency controlled by `minimapGhostCellsUpdateTicks` setting.

### 0xFE — ServerStat (254)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0xFE (254)
1..N    string     JSON stats (null-terminated, encoding per protocol)
```

**Extended JSON payload (beyond original MultiOgar):**

```json
{
  "mode": "ffa",
  "update": 12.5,
  "playersTotal": 50,
  "playersAlive": 35,
  "playersSpect": 15,
  "playersLimit": 100,
  "myStats": {
    "spawnedAt": 1710412800000,
    "eatenViruses": 3,
    "eatenPellets": 250,
    "eatenMothercells": 0,
    "eatenBoosters": 1,
    "partyFriends": 2
  },
  "abilities": {
    "enabled": true,
    "freeze": 5,
    "speed": 3,
    "virus": 0,
    "shield": 1
  }
}
```

---

## UpdateNodes (0x10) — The Core Packet

This is the most complex and most frequently sent packet. It contains all cell state changes for one tick.

### Overall Structure

```
[opcode: 1B] [eat_section] [update_section] [remove_section]
```

### Eat Section

```
Offset  Type       Description
─────   ────       ───────────
0-1     uint16     Number of eat records
For each eat record (8 bytes):
  +0    uint32     Hunter cell ID — the cell that ate
  +4    uint32     Prey cell ID — the cell that was eaten
```

### Update Section

Contains both **new cells** and **updated cells**. The format varies significantly by protocol version range. Terminated by `uint32 0x00000000`.

#### Protocol 4–5 (writeCellData4):

```
uint32    Cell ID
int16/32  X position (int16 for proto 4, int32 for proto 5)
int16/32  Y position (int16 for proto 4, int32 for proto 5)
uint16    Cell radius
uint8×3   Color R, G, B (always sent)
uint8     Flags
(if flag 0x04) string   Skin name (UCS-2, null-terminated) — new cells only
string    Name (UCS-2, null-terminated) — new cells: name, updates: empty (0x0000)
uint16    UUID or 0x0000 terminator
```

#### Protocol 6–10 (writeCellData6):

```
uint32    Cell ID
int32     X position
int32     Y position
uint16    Cell radius
uint8     Flags
(if flag 0x02) uint8×3  Color R, G, B
(if flag 0x04) string   Skin name (UTF-8, null-terminated)
(if flag 0x08) string   Cell name (UTF-8, null-terminated)
(if flag 0x40) uint16   Owner player ID
(if flag 0x80) Extended flags section:
    uint16    Cell type (see Cell Types table)
    string    Party code (UTF-8, null-terminated)
```

#### Protocol 11+ (writeCellData11):

```
uint32    Cell ID
int32     X position
int32     Y position
uint16    Cell radius
uint8     Flags
(if flag 0x80) uint8    Cell sub-type indicator (1 = food)
(if flag 0x02) uint8×3  Color R, G, B
(if flag 0x04) string   Skin name (UTF-8, null-terminated)
(if flag 0x08) string   Cell name (UTF-8, null-terminated)
```

### Flag Bits

| Bit | Hex | Protocol 4–5 | Protocol 6–10 | Protocol 11+ |
|-----|-----|-------------|---------------|-------------|
| 0 | 0x01 | isSpiked (virus) | isSpiked (virus) | isSpiked (virus) |
| 1 | 0x02 | — | isColorPresent | isColorPresent |
| 2 | 0x04 | isSkinPresent | isSkinPresent | isSkinPresent |
| 3 | 0x08 | — | isNamePresent | isNamePresent |
| 4 | 0x10 | isAgitated | isAgitated | isAgitated |
| 5 | 0x20 | isEjected | isEjected | isEjected |
| 6 | 0x40 | — | hasPlayerID | isEjectedByOther (eject owner ≠ self) |
| 7 | 0x80 | — | hasExtendedFlags | isFood (type === 1) sub-type byte follows |

### Remove Section

```
Protocol ≤5:
  uint32    Number of removed cell IDs
  For each:
    uint32  Cell ID

Protocol 6+:
  uint16    Number of removed cell IDs
  For each:
    uint32  Cell ID
```

---

## Cell Types

The server has expanded cell types beyond the original 5:

| Value | Cell Type | Class | isSpiked | Notes |
|-------|-----------|-------|----------|-------|
| 0 | Player cell | `PlayerCell` | No | Standard player cell |
| 1 | Food / Pellet | `Pellet` | No | Small static food |
| 2 | Virus | `Virus` | Yes | Splits players on contact |
| 3 | Ejected mass | `EjectedCell` | No | Mass from W key |
| 4 | Mother cell | `Mothercell` | Yes | Spawns food, experimental mode |
| 5 | Event pellet | `EventPellet` | No | Special event food |
| 6 | Booster | `Booster` | No | Red booster cell |
| 7 | Power Booster: Freeze | `PowerBoosterFreeze` | No | Grants freeze ability |
| 8 | Power Booster: Speed | `PowerBoosterSpeed` | No | Grants speed ability |
| 9 | Power Booster: Virus | `PowerBoosterVirus` | No | Grants virus shooting ability |
| 10 | Power Booster: Shield | `PowerBoosterShield` | No | Grants shield ability |
| 11 | Player (Frozen) | Dynamic override | No | Player cell while frozen |
| 12 | Player (Speed) | Dynamic override | No | Player cell while speed-boosted |
| 13 | Player (Virus) | Dynamic override | No | Player cell while virus-boosted |
| 14 | Player (Shield) | Dynamic override | No | Player cell while shielded |

> **Note:** Types 11–14 are dynamic overrides — the server replaces a player cell's type value based on the player's active ability state. They only appear in the extended flags section of protocol 6–10 cell data.

---

## Extended Cell Flags (Protocol 6–10)

Protocol 6–10 introduced a rich extended data section sent with cell updates when flag 0x80 is set:

```
uint16    Cell type (see Cell Types table above)
string    Party code (UTF-8, null-terminated)
```

When flag 0x40 is set (hasPlayerID):

```
uint16    Owner player ID (0 if no owner)
```

This allows the client to:
- Identify the true type of any cell (food, virus, booster, etc.)
- Link cells to their owning player by player ID
- Show party code for team/party grouping on the minimap

---

## Protocol Version Ranges

The server supports protocols 4–24, grouped into functional tiers:

| Protocol Range | Cell Data Format | FFA Leaderboard | Text Board | Pie Leaderboard | Strings |
|----------------|-----------------|-----------------|------------|-----------------|---------|
| 4–5 | writeCellData4 | Opcode 0x31, cell ID / isMe | Opcode 0x30 | Opcode 0x32 (weights only) | UCS-2 |
| 6–10 | writeCellData6 + extended flags | Opcode 0x31, isMe flag | Opcode 0x30 | Opcode 0x32 (weights only) | UTF-8 |
| 11–13 | writeCellData11 | Opcode 0x33 (51), flag-based | Opcode 0x30 | Opcode 0x32 (weights only) | UTF-8 |
| 14–20 | writeCellData11 | Opcode 0x35 (53), flag-based | Opcode 0x35 (53) | Opcode 0x32 (weights only) | UTF-8 |
| 21–24 | writeCellData11 | Opcode 0x35 (53), flag-based | Opcode 0x35 (53) | Opcode 0x32 (weights + colors) | UTF-8 |

**Protocol-gated features:**
- Protocol ≤10: Receives minimap ghost cells (0xFC), battle border updates (0xF9), death notifications (0x15)
- Protocol ≥6: Uses UTF-8 strings, flag-gated cell colors, int32 coordinates
- Protocol 6–10: Receives extended cell flags (player ID, cell type, party code)
- Protocol ≥11: Gets food type indicator byte in cell updates
- Protocol ≥14: Uses opcode 0x35 for both FFA leaderboard and text board
- Protocol ≥21: Pie leaderboard includes team colors

---

## Quick Reference

### Client → Server

| Opcode | Hex | Name | Size | New? |
|--------|-----|------|------|------|
| 0 | 0x00 | Spawn/Join | Variable | Modified (added skin, UUID, party code, multibox) |
| 1 | 0x01 | Spectate | 1 | — |
| 2 | 0x02 | Auth (UUID) | Variable | ✦ NEW |
| 4 | 0x04 | Shop Action | Variable | ✦ NEW |
| 16 | 0x10 | Mouse Position | 9/13/15/21 | Modified (added 15-byte multibox variant) |
| 17 | 0x11 | Split | 1–3 | Modified (added multibox unit ID) |
| 18 | 0x12 | Q Press | 1 | — |
| 19 | 0x13 | Q Release | 1 | ✦ NEW |
| 21 | 0x15 | Eject Mass (W) | 1–3 | Modified (added multibox unit ID) |
| 22 | 0x16 | Minion Split (E) | 1 | ✦ NEW |
| 23 | 0x17 | Minion Eject (R) | 1 | ✦ NEW |
| 24 | 0x18 | Minion Freeze (T) | 1 | ✦ NEW |
| 25 | 0x19 | Minion Roam | 1 | ✦ NEW (not implemented) |
| 26 | 0x1A | Triple Split | 1 | ✦ NEW |
| 27 | 0x1B | Quad Split | 1 | ✦ NEW |
| 28 | 0x1C | Double Split | 1–3 | ✦ NEW |
| 29 | 0x1D | Minion Double | 1 | ✦ NEW |
| 30 | 0x1E | Minion Quad | 1 | ✦ NEW |
| 31 | 0x1F | Minion Triple | 1 | ✦ NEW |
| 32 | 0x20 | Player Freeze | 1 | ✦ NEW |
| 33 | 0x21 | Booster: Freeze | 1 | ✦ NEW |
| 34 | 0x22 | Booster: Speed | 1 | ✦ NEW |
| 35 | 0x23 | Booster: Speed Instant | 1 | ✦ NEW |
| 36 | 0x24 | Booster: Virus | 1 | ✦ NEW |
| 37 | 0x25 | Booster: Shield | 1 | ✦ NEW |
| 40 | 0x28 | Random Spawn | 1 | ✦ NEW |
| 41 | 0x29 | Toggle Random Respawn | 1 | ✦ NEW |
| 45 | 0x2D | TAB (Multibox Toggle) | 1 | ✦ NEW |
| 49 | 0x31 | Spectate Player | 3 | ✦ NEW |
| 50 | 0x32 | Ban Self (Anti-Cheat) | 1 | ✦ NEW |
| 99 | 0x63 | Chat Message | Variable | — |
| 254 | 0xFE | Request Stats / Ping | 1 | Modified (used as heartbeat) |

### Server → Client

| Opcode | Hex | Name | Size | New? |
|--------|-----|------|------|------|
| 16 | 0x10 | UpdateNodes | Variable | Modified (extended flags, playerID, cellType, partyCode) |
| 17 | 0x11 | UpdatePosition | 13 | — |
| 18 | 0x12 | ClearAll | 1 | — |
| 20 | 0x14 | ClearOwned | 1 | — |
| 21 | 0x15 | Death Notification | 1 | ✦ NEW |
| 32 | 0x20 | AddNode (own cell) | 5 | — |
| 48 | 0x30 | TextBoard (old) | Variable | — |
| 49 | 0x31 | Leaderboard FFA (old) | Variable | — |
| 50 | 0x32 | Leaderboard Team/Pie | Variable | Modified (colors in proto 21+) |
| 51 | 0x33 | Leaderboard FFA (proto 11–13) | Variable | ✦ NEW |
| 53 | 0x35 | Leaderboard FFA / TextBoard (proto 14+) | Variable | ✦ NEW |
| 64 | 0x40 | SetBorder | 33 or Variable | — |
| 99 | 0x63 | ChatMessage | Variable | Modified (moderator flag changed to bit 2) |
| 200 | 0xC8 | ShopResponse | Variable | ✦ NEW |
| 201 | 0xC9 | AuthSuccess | 1 | ✦ NEW |
| 249 | 0xF9 | BattleBorder Update | 11 | ✦ NEW |
| 250 | 0xFA | PlayerID | 3 | ✦ NEW |
| 251 | 0xFB | Party Friend Update | Variable | ✦ NEW |
| 252 | 0xFC | Minimap Ghost Cells | Variable | ✦ NEW |
| 254 | 0xFE | ServerStat | Variable | Modified (extended JSON) |

---

## Changelog vs Original MultiOgar

### ✦ New Client → Server Opcodes

| Opcode | Name | Purpose |
|--------|------|---------|
| 0x02 | Auth | Account UUID verification |
| 0x04 | Shop Action | In-game shop purchases, boosts, and potions |
| 0x13 | Q Release | Q key release event |
| 0x16–0x18 | Minion ERTP | Minion split/eject/freeze controls |
| 0x19 | Minion Roam | Reserved (not implemented) |
| 0x1A–0x1C | Multi-Split | Triple, quad, and double split macros |
| 0x1D–0x1F | Minion Multi-Split | Minion double/quad/triple split macros |
| 0x20 | Player Freeze | Self-freeze toggle |
| 0x21–0x25 | Booster Ejects | Freeze/speed/virus/shield booster cells |
| 0x28–0x29 | Random Spawn | Random spawn request and toggle |
| 0x2D | TAB | Multibox toggle between main player and multibox instance |
| 0x31 | Spectate Player | Spectate a specific player by ID |
| 0x32 | Ban Self | Client-side cheat detection trigger |

### ✦ New Server → Client Opcodes

| Opcode | Name | Purpose |
|--------|------|---------|
| 0x15 | Death | Player death notification |
| 0x33 | FFA Leaderboard v2 | Flag-based leaderboard for protocol 11–13 |
| 0x35 | FFA Leaderboard v3 / TextBoard | Flag-based leaderboard and text board for protocol 14+ |
| 0xC8 | ShopResponse | Shop/boost/potion action results with JSON payload |
| 0xC9 | AuthSuccess | Account verification success signal |
| 0xF9 | BattleBorder | Battle royale shrinking border data |
| 0xFA | PlayerID | Assigned player ID on join |
| 0xFB | PartyFriend | Nearest party friend position and identity |
| 0xFC | MinimapGhostCells | All player positions for minimap rendering |

### ✦ Modified from Original MultiOgar

| Feature | Original MultiOgar | Current Implementation |
|---------|-------------------|----------------------|
| Spawn packet (0x00) | Name + token | Name + skin + UUID + party code + optional multibox unit ID |
| Mouse packet (0x10) | 9/13/21 bytes | Added 15-byte multibox variant |
| Split/Eject (0x11, 0x15) | Fixed 1 byte | Optional 2-byte unit ID suffix for multibox routing |
| Cell data (0x10 update) | Flags 0x01–0x20 | Added flags 0x40 (playerID) and 0x80 (extended: cellType + partyCode) |
| Cell types | 0–4 (player, food, virus, eject, mother) | 0–14 (added event pellet, boosters, power boosters, player states) |
| Pie leaderboard | Weights only | Protocol 21+ adds team colors |
| FFA leaderboard | Single format | 3 format variants by protocol range |
| ServerStats JSON | Basic stats | Extended with myStats (eaten counts) and abilities (booster counts) |
| Chat flags | Moderator=0x20, Admin=0x40, Server=0x80 | Moderator=0x04, Admin=0x40, Server=0x80 |
| Anti-cheat scramble | scrambleX/Y/Id used | Values always 0 (not used) |
| Protocol range | 4–6 | 4–24 (with functional tiers at 6, 11, 14, 21) |

### ✦ Removed from Original MultiOgar

| Feature | Original | Status |
|---------|----------|--------|
| Opcode 0x05 (Facebook IDs) | Pipe-delimited friend IDs for highlighting | Removed — replaced by party code system |
| Anti-cheat scramble | Per-client XOR scramble for coordinates/IDs | Disabled (all values are 0) |
| Protocol key validation | Key must be 0 for protocol >6 | Key value is stored but not validated |
| Opcode 0x36 (54) leaderboard mapping | Some clients mapped 54→53 | Not used |
| Opcode 0x45 (69) ghost cells | Fork extension for minimap | Replaced by opcode 0xFC (252) |
| Opcode 0x55/0x57 captcha | Some forks' captcha request | Replaced by reCAPTCHA v3 in connection handshake |

---

*Document generated from analysis of the LegacyProtocol server implementation (`/home/servers/running/FFA-1/src/`) and cross-referenced with the Agar2 client application (`/home/agar2_application/src/game/network/`). For server implementation details, refer to `src/protocols/LegacyProtocol.js` and `src/sockets/Connection.js`.*
