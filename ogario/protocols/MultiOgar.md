# MultiOgar / MultiOgarII WebSocket Protocol

**Version:** Protocol 4, 5, and 6  
**Reference server:** [Barbosik/MultiOgar](https://github.com/Barbosik/MultiOgar)  
**Reference client:** [ogario.test.v4.js](https://github.com/jimboy3100/jimboy3100.github.io/blob/master/ogario/ogario.test.v4.js)

> This document describes the binary WebSocket protocol used by **MultiOgar** and **MultiOgarII** private Agar.io servers. All values are **little-endian** unless noted otherwise. Strings in protocol ≤5 are **UCS-2** (2 bytes per char, null-terminated with `0x0000`). Strings in protocol 6+ are **UTF-8** (1 byte per ASCII char, null-terminated with `0x00`).

---

## Table of Contents

1. [Connection & Handshake](#connection--handshake)
2. [Anti-Cheat Scramble](#anti-cheat-scramble)
3. [Client → Server Messages](#client--server-messages)
4. [Server → Client Messages](#server--client-messages)
5. [UpdateNodes (0x10) — The Core Packet](#updatenodes-0x10--the-core-packet)
6. [Protocol Version Differences](#protocol-version-differences)
7. [Compatibility Notes](#compatibility-notes)

---

## Connection & Handshake

The client connects via **WebSocket** (binary mode). On connection open, it sends two packets in sequence:

### Step 1: Protocol Version (0xFE)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFE (254)
1-4     uint32    Protocol version (e.g., 4, 5, or 6)
```

**Total: 5 bytes**

### Step 2: Client Key (0xFF)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFF (255)
1-4     uint32    Client key (used for message XOR cipher)
```

**Total: 5 bytes**

For protocol ≤6, the key is typically `0` or a random value. For protocol >6, the key **must** be `0` or the server rejects the connection.

### Server Response

After both handshake packets, the server sends:

1. **ClearAll (0x12)** — Reset client state
2. **SetBorder (0x40)** — Map boundaries, game mode, and server name
3. **ChatMessage (0x63)** — Welcome messages (server name, MOTD)

---

## Anti-Cheat Scramble

MultiOgar uses per-client scramble values to prevent memory-reading cheats:

| Scramble | Purpose |
|----------|---------|
| `scrambleX` | Added to all X coordinates sent to clients |
| `scrambleY` | Added to all Y coordinates sent to clients |
| `scrambleId` | XOR'd with all cell IDs sent to clients |

Clients must subtract or XOR these values to recover true game-state values. The scramble values are embedded in the SetBorder packet. On private servers without the official client, the scramble values are typically `0`.

---

## Client → Server Messages

All client messages start with a **1-byte opcode**. Little-endian byte order.

### 0x00 — Spawn (Join Game)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x00
1..N    string     Player nickname (null-terminated)
N+1..M  string     Spawn token / captcha response (null-terminated)
```

- Protocol ≤5: strings are **UCS-2** (2 bytes per char, terminated with `0x0000`)
- Protocol 6+: strings are **UTF-8** (1 byte per char, terminated with `0x00`)
- On private servers the token is typically `"0"` or empty

### 0x01 — Spectate

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x01
```

**Total: 1 byte.** Enters spectator mode. Only accepted when the player has no cells.

### 0x05 — Facebook Friend IDs

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x05
1..N    string    Pipe-delimited friend IDs (UTF-8, null-terminated)
```

> **Note:** This is a client extension, not part of base MultiOgar. Some forks support it for friend detection on the leaderboard.

### 0x10 — Mouse Position

```
Protocol 4 (21 bytes):
  Offset  Type       Description
  0       uint8      0x10
  1-8     float64    Mouse X (+ scrambleX)
  9-16    float64    Mouse Y (+ scrambleY)
  17-20   uint32     (unused, reserved)

Protocol 5 early (9 bytes):
  Offset  Type       Description
  0       uint8      0x10
  1-2     int16      Mouse X (+ scrambleX)
  3-4     int16      Mouse Y (+ scrambleY)
  5-8     uint32     (unused, reserved)

Protocol 5 late / 6+ (13 bytes):
  Offset  Type       Description
  0       uint8      0x10
  1-4     int32      Mouse X (+ scrambleX)
  5-8     int32      Mouse Y (+ scrambleY)
  9-12    uint32     (unused, reserved)
```

The server distinguishes the protocol variant by message length (21 / 9 / 13 bytes).

### 0x11 — Split (Space)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x11 (17)
```

**Total: 1 byte.** Splits all player cells toward the current mouse position.

### 0x12 — Toggle Free Spectate / Q Press

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x12 (18)
```

**Total: 1 byte.** In spectate mode: toggles between follow-#1 and free-roam. In gameplay: triggers Q action (used for minion control in some servers).

### 0x15 — Eject Mass (W)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x15 (21)
```

**Total: 1 byte.** Ejects a mass pellet toward the current mouse position.

### 0x63 — Chat Message

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x63 (99)
1       uint8      Flags (typically 0x00 from client)
2..N    (reserved)  Variable-length reserved bytes based on flags
N..M    string     Chat message text (null-terminated)
```

**Flag bits (from server perspective — client sends 0x00):**

| Bit | Hex | Meaning |
|-----|-----|---------|
| 1 | 0x02 | Has 4-byte reserved field |
| 2 | 0x04 | Has 8-byte reserved field |
| 3 | 0x08 | Has 16-byte reserved field |

- Protocol ≤5: message text is **UCS-2**
- Protocol 6+: message text is **UTF-8**

### 0xFE — Request Server Stats

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFE (254)
```

**Total: 1 byte.** Server responds with a ServerStat packet (also opcode 0xFE). Rate-limited to once per tick (40ms).

---

## Server → Client Messages

All server messages start with a **1-byte opcode**. Little-endian byte order.

### 0x10 — UpdateNodes (Cell Updates)

The main game-state packet, sent every tick (25 Hz). See the [detailed section below](#updatenodes-0x10--the-core-packet).

### 0x11 — UpdatePosition (Camera)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x11 (17)
1-4     float32    Camera X (+ scrambleX)
5-8     float32    Camera Y (+ scrambleY)
9-12    float32    Camera zoom scale (smaller = more zoomed out)
```

**Total: 13 bytes.** Sent every tick to tell the client where to center its viewport.

### 0x12 — ClearAll

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x12 (18)
```

**Total: 1 byte.** Client must clear all known cells and reset state. Sent during handshake and on reconnect.

### 0x14 — ClearOwned

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x14 (20)
```

**Total: 1 byte.** Client must clear the list of cells it owns (playerCellIDs). Sent when the player dies.

### 0x20 — AddNode (Own Cell)

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0x20 (32)
1-4     uint32    Cell ID (XOR'd with scrambleId)
```

**Total: 5 bytes.** Tells the client it now owns this cell (e.g., after spawning or splitting).

### 0x31 — Leaderboard (FFA / UserText)

#### Protocol ≤5 (FFA):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x31 (49)
1-4     uint32     Number of entries
For each entry:
  +0    uint32     Cell ID (0 = not player, XOR scrambleId = self)
  +4    string     Name (UCS-2, null-terminated)
```

#### Protocol 6+ (FFA):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x31 (49)
1-4     uint32     Number of entries
For each entry:
  +0    uint32     isMe flag (1 = self, 0 = other)
  +4    string     Name (UTF-8, null-terminated)
```

### 0x32 — Leaderboard (Team)

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x32 (50)
1-4     uint32     Number of teams
For each team:
  +0    float32    Team score (0.0 to 1.0, fraction of total mass)
```

### 0x35 — Leaderboard (Extended FFA)

> **Note:** This is a **fork extension** used by some MultiOgarII variants. Opcode 53 (0x35) uses a flag-based system similar to real Agar.io protocol.

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x35 (53) — note: opcode 54 maps to 53 in some clients
For each entry (repeat until end of buffer):
  +0    uint8      Flags
  ...   (variable) Fields based on flags
```

**Flag bits:**

| Bit | Hex | Meaning |
|-----|-----|---------|
| 1 | 0x02 | Name present (UTF-8, null-terminated) |
| 2 | 0x04 | Cell ID present (uint32) |
| 3 | 0x08 | Is current player (uses client's own nick) |
| 4 | 0x10 | Is friend |

### 0x40 — SetBorder (Map Boundaries)

#### Without game type (33 bytes, border update):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x40 (64)
1-8     float64    Border minX (+ scrambleX)
9-16    float64    Border minY (+ scrambleY)
17-24   float64    Border maxX (+ scrambleX)
25-32   float64    Border maxY (+ scrambleY)
```

#### With game type (variable, initial handshake):

```
Offset  Type       Description
─────   ────       ───────────
0       uint8      0x40 (64)
1-8     float64    Border minX (+ scrambleX)
9-16    float64    Border minY (+ scrambleY)
17-24   float64    Border maxX (+ scrambleX)
25-32   float64    Border maxY (+ scrambleY)
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
| 5 | 0x20 | Moderator message |
| 6 | 0x40 | Admin message |
| 7 | 0x80 | Server message |

- Protocol ≤5: strings are **UCS-2**
- Protocol 6+: strings are **UTF-8**

### 0xFE — ServerStat

```
Offset  Type      Description
─────   ────      ───────────
0       uint8     0xFE (254)
1..N    string    JSON stats (null-terminated UTF-8)
```

JSON typically contains: `{"current_players": N, "max_players": N, "gamemode": "...", "update_time": N}`

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
  +0    uint32     Hunter cell ID (^ scrambleId) — the cell that ate
  +4    uint32     Prey cell ID (^ scrambleId) — the cell that was eaten
```

This allows the client to animate one cell absorbing another.

### Update Section

Contains both **updated cells** (existing cells with new position/size) and **new cells** (cells appearing for the first time in this client's viewport). The format varies by protocol version.

#### Protocol 4 (per cell record):

```
uint32    Cell ID (^ scrambleId)
int16     X position (+ scrambleX)
int16     Y position (+ scrambleY)
uint16    Cell radius (size, NOT mass — mass = size² / 100)
uint8     Color R
uint8     Color G
uint8     Color B
uint8     Flags
uint16+   Name (UCS-2, null-terminated) — empty for updates, present for adds
```

#### Protocol 5 (per cell record):

```
uint32    Cell ID (^ scrambleId)
int32     X position (+ scrambleX)
int32     Y position (+ scrambleY)
uint16    Cell radius
uint8     Color R
uint8     Color G
uint8     Color B
uint8     Flags
(if flag 0x04) string   Skin name (UTF-8, null-terminated) — new cells only
uint16+   Name (UCS-2, null-terminated) — empty for updates, present for adds
```

#### Protocol 6+ (per cell record):

```
uint32    Cell ID (^ scrambleId)
int32     X position (+ scrambleX)
int32     Y position (+ scrambleY)
uint16    Cell radius
uint8     Flags
(if flag 0x02) uint8×3  Color R, G, B
(if flag 0x04) string   Skin name (UTF-8, null-terminated) — new cells only
(if flag 0x08) string   Cell name (UTF-8, null-terminated) — new cells only
```

**Terminator:** `uint32 0x00000000` marks the end of the update section.

### Flag Bits

| Bit | Hex | Protocol 4 | Protocol 5 | Protocol 6+ |
|-----|-----|-----------|-----------|-------------|
| 0 | 0x01 | isVirus | isVirus | isVirus |
| 1 | 0x02 | — | — | isColorPresent |
| 2 | 0x04 | — | isSkinPresent | isSkinPresent |
| 3 | 0x08 | — | — | isNamePresent |
| 4 | 0x10 | isAgitated | isAgitated | isAgitated |
| 5 | 0x20 | isEjected | isEjected | isEjected |

### Remove Section

```
Protocol ≤5:
  uint32    Number of removed cell IDs
  For each:
    uint32  Cell ID (^ scrambleId)

Protocol 6+:
  uint16    Number of removed cell IDs
  For each:
    uint32  Cell ID (^ scrambleId)
```

This includes both eaten cells (from eat section) and cells that left the viewport.

---

## Protocol Version Differences

| Feature | Protocol 4 | Protocol 5 | Protocol 6+ |
|---------|-----------|-----------|-------------|
| **Strings** | UCS-2 (2B/char) | UCS-2 (names) / UTF-8 (skins) | UTF-8 (1B/char) |
| **Mouse position** | float64 (21B) | int16 (9B) or int32 (13B) | int32 (13B) |
| **Cell coordinates** | int16 | int32 | int32 |
| **Color in updates** | Always sent | Always sent | Flag-gated (0x02) |
| **Skin support** | No | Yes (flag 0x04) | Yes (flag 0x04) |
| **Name in updates** | UCS-2 field | UCS-2 field | Flag-gated (0x08) |
| **Remove count type** | uint32 | uint32 | uint16 |
| **Leaderboard isMe** | Cell ID match | Cell ID match | Flag (1 or 0) |

---

## Compatibility Notes

### Barbosik/MultiOgar vs MultiOgarII forks

This protocol is **fully compatible** with the original [Barbosik/MultiOgar](https://github.com/Barbosik/MultiOgar). The following minor differences exist in some **MultiOgarII** forks (e.g., [AJS-development/MultiOgarII](https://github.com/AJS-development/MultiOgarII)):

| Feature | MultiOgar (Barbosik) | MultiOgarII forks |
|---------|---------------------|-------------------|
| Opcode 0x05 (FB IDs) | Not handled | Some forks handle for friend highlighting |
| Opcode 0x35 (53) leaderboard | Uses opcode 0x31 (49) only | Some forks add flagged leaderboard (0x35/53) |
| Opcode 0x36 (54) | Not used | Mapped to 0x35 (53) in some clients |
| Opcode 0x45 (69) ghost cells | Not present | Added by some forks for minimap |
| Opcode 0x55 (85) captcha request | Not present | Added by some forks |
| Opcode 0x57 (87) captcha v3 | Not present | Added by some forks |
| Chat opcode 0x63 (99) | Server→Client only | Some forks also use Client→Server 0x63 |
| Ejected mass type | `cellType == 3` | Same (`cellType == 3`) |
| Protocol scramble | Via `shiftKey/shiftMessage` | Same mechanism (XOR cipher) |

### Cell Types

| Value | Cell Type |
|-------|-----------|
| 0 | Player cell |
| 1 | Food |
| 2 | Virus |
| 3 | Ejected mass |
| 4 | Mother cell (experimental mode) |

> **Note:** Cell types are **not** sent in UpdateNodes packets. They are inferred from flags (isVirus, isEjected) and context (size, behavior). Food cells have no flags set and are small (~10-20 radius).

### Skin Format

Skins are sent as UTF-8 strings in the cell name/skin field:

- **Custom URL skin:** `%skinname` (prefix `%` indicates a registered skin name)
- **Standard skin:** Direct name lookup, typically from the server's skin list

### Mass vs Size

The protocol sends **cell radius (size)**, not mass. The relationship is:

```
mass = size² / 100
size = sqrt(mass * 100)
```

For example, a cell of radius 100 has mass 100.

---

## Quick Reference

### Client → Server

| Opcode | Hex | Name | Size |
|--------|-----|------|------|
| 0 | 0x00 | Spawn/Join | Variable |
| 1 | 0x01 | Spectate | 1 |
| 5 | 0x05 | Facebook IDs | Variable |
| 16 | 0x10 | Mouse Position | 9/13/21 |
| 17 | 0x11 | Split (Space) | 1 |
| 18 | 0x12 | Q / Free Spectate | 1 |
| 21 | 0x15 | Eject Mass (W) | 1 |
| 99 | 0x63 | Chat Message | Variable |
| 254 | 0xFE | Request Stats | 1 |

### Server → Client

| Opcode | Hex | Name | Size |
|--------|-----|------|------|
| 16 | 0x10 | UpdateNodes | Variable |
| 17 | 0x11 | UpdatePosition | 13 |
| 18 | 0x12 | ClearAll | 1 |
| 20 | 0x14 | ClearOwned | 1 |
| 32 | 0x20 | AddNode (own cell) | 5 |
| 49 | 0x31 | Leaderboard FFA | Variable |
| 50 | 0x32 | Leaderboard Team | Variable |
| 64 | 0x40 | SetBorder | 33 or Variable |
| 99 | 0x63 | ChatMessage | Variable |
| 254 | 0xFE | ServerStat | Variable |

---

*Document generated from analysis of [ogario.test.v4.js](https://github.com/jimboy3100/jimboy3100.github.io/blob/master/ogario/ogario.test.v4.js) and cross-referenced with [Barbosik/MultiOgar](https://github.com/Barbosik/MultiOgar) source code. For server implementation details, refer to `src/packet/` in the MultiOgar repository.*
