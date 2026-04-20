# Expanding Land Protocol — Garix Integration Guide

Expanding Land (LegendWorld) implements the standard Agar.io binary WebSocket
protocol (version 6, accepts 1–22). This document covers the exact wire
formats and the **specific differences** that cause issues for Garix clients.

**Server:** `wss://ffa.legendmod.ml:8080`
**Version:** 1.2.44
**Tick rate:** 25 Hz
**Scramble:** Disabled (`scramble_level = 0` — all IDs and coordinates are raw)

---

## Known Garix Issues & Fixes

### 1. Mouse Doesn't Work

**Symptom:** Player cell doesn't move or moves erratically.

**Cause:** The server's mouse handler accepts **exactly three** packet lengths.
Any other length is silently dropped (logged as `[Mouse] UNKNOWN len=N`).

Garix sends **15-byte** mouse packets:
```
[0x10][tabID:u16le][x:i32le][y:i32le][pad:4B] = 15 bytes ❌ REJECTED
```

**Fix:** Strip the `tabID` field and send standard **13-byte** packets:
```
[0x10][x:i32le][y:i32le][0x00000000:u32le] = 13 bytes ✅ ACCEPTED
```

The last 4 bytes (protocol key) are ignored by private servers — send `0`.

### 2. Incomplete Map in Spectator Mode

**Symptom:** Spectating shows only a portion of the map; borders seem wrong.

**Three causes:**

#### A. SetBorder has two formats

The server sends opcode `0x40` in **two** different formats. Clients must
check packet length to determine which one:

| When | Length | Format |
|------|--------|--------|
| Handshake + Join | **38+ bytes** (variable) | Extended: `[0x40][4×f64le][gameType:u32le][name:str\0]` |
| Dynamic map resize | **33 bytes** (fixed) | Simple: `[0x40][4×f64le]` (no game type, no name) |

If Garix always reads the extended format (with gameType + name), the 33-byte
simple packets during map resize will have leftover bytes that corrupt the
stream.

**Fix:** Check `len`: `== 33` → simple (4× f64 only), `> 33` → extended.

#### B. UpdatePosition is 17 bytes (not 13)

Expanding Land sends a **4-byte tick counter** after the standard camera data:

```
Standard (13 bytes):  [0x11][camX:f32le][camY:f32le][scale:f32le]
EL (17 bytes):        [0x11][camX:f32le][camY:f32le][scale:f32le][tick:u32le]
```

If Garix reads only 13 bytes, the 4 leftover bytes corrupt the next packet.

**Fix:** Check `len` for opcode `0x11`: `13` → standard, `17` → EL.

#### C. Spectator viewport is server-limited

The server only sends cells within a calculated viewbox. At the default
spectator scale (`0.25`), the viewbox is approximately **4040 × 2360** world
units — **not the full map**.

The viewbox formula:
```
half_w = (1920 + 100) / scale / 2
half_h = (1080 + 100) / scale / 2
```

At `scale = 0.25`: `half_w = 4040`, `half_h = 2360`.

**Fix:** To see the entire map, send opcode **55** (full-map free spectate)
or **56** (full-map center-locked spectate) after entering spectate mode.

---

## Handshake Sequence

```
1. C→S: [0xFE][protocol_version:u32le]    — accepts 1–22
2. C→S: [0xFF][key:u32le]                 — any value (Delta sends client version)
3. S→C: [0x12]                            — ClearAll (reset client state)
4. S→C: [0x40][borders...][gameType][name] — SetBorder (extended format)
5. S→C: [0x63][...] ×2                    — Chat: server version + welcome
6. S→C: [0xF0][0x4C][0x57]               — LW beacon ("LW" — safe to ignore)
7. S→C: [0xC8][...]                       — MapEvent (safe to ignore)
```

All handshake packets (3–7) arrive batched in one WebSocket message.

> **Note:** There is no challenge/key exchange like Garix's `171→172→205→187`
> flow. The handshake is two packets and done.

---

## Complete Opcode Reference

### Client → Server

| Opcode | Hex | Length | Format | Description |
|--------|-----|--------|--------|-------------|
| 0 | `0x00` | variable | `[0][name:strUTF8\0]` | Join (spawn) |
| 1 | `0x01` | 1 | `[1]` | Enter spectate |
| 12 | `0x0C` | variable | `[12][skin:UTF16LE]` | Skin URL (no null term) |
| **16** | `0x10` | **13** | `[16][x:i32le][y:i32le][key:u32le]` | **Mouse position** |
| 17 | `0x11` | 1 | `[17]` | Split (alive) / next target (spectate) |
| 18 | `0x12` | 1 | `[18]` | Toggle free ↔ grouped spectate |
| 21 | `0x15` | 1 | `[21]` | Eject mass |
| 55 | `0x37` | 1 | `[55]` | Full-map spectate (toggle) |
| 56 | `0x38` | 1 | `[56]` | Full-map center spectate (toggle) |
| 57 | `0x39` | 1 | `[57]` | Quit game (orphan cells) |
| 86 | `0x56` | variable | `[86][token:strASCII\0]` | Recaptcha (ignored) |
| 99 | `0x63` | variable | `[99][flags:u8][msg...]` | Chat message |
| 102 | `0x66` | variable | `[102][protobuf...]` | Auth/economy (optional) |
| 201 | `0xC9` | 2 | `[201][type:u8]` | LM client ID (optional) |
| 202 | `0xCA` | variable | `[202][type:u8][msg:UTF16LE]` | Team chat (optional) |
| 203 | `0xCB` | variable | `[203][tag:strUTF8\0]` | Set clan tag (optional) |
| 204 | `0xCC` | variable | `[204][provider:u8][id\0][name\0]` | Profile info (optional) |
| 227 | `0xE3` | 3 | `[227][pingID:u16le]` | Pong (required) |
| 240 | `0xF0` | 3 | `[240][0x4C][0x4D]` | LM handshake ack (optional) |
| 254 | `0xFE` | 1 | `[254]` | Request server stats |

### Server → Client

| Opcode | Hex | Length | Description |
|--------|-----|--------|-------------|
| 16 | `0x10` | variable | UpdateNodes (cell add/update/eat/delete) |
| **17** | `0x11` | **17** | **UpdatePosition (camera + scale + tick)** |
| 18 | `0x12` | 1 | ClearAll (handshake only) |
| 20 | `0x14` | 1 | ClearOwned |
| 32 | `0x20` | 5 | AddNode (your cell ID) |
| 49 | `0x31` | variable | FFA leaderboard |
| **64** | `0x40` | **33 or 38+** | **SetBorder (simple or extended)** |
| 69 | `0x45` | variable | Ghost cells (death screen) |
| 99 | `0x63` | variable | Chat message |
| 102 | `0x66` | variable | Economy protobuf (safe to ignore) |
| 200 | `0xC8` | 43 | MapEvent — EL extension (safe to ignore) |
| 201 | `0xC9` | 5 | LM stats (safe to ignore) |
| 202 | `0xCA` | 36 | Decay info (safe to ignore) |
| 226 | `0xE2` | 3 | Ping (must reply with 0xE3) |
| 240 | `0xF0` | 3 | LW beacon (safe to ignore) |
| 254 | `0xFE` | variable | Server stats (JSON) |
| **255** | `0xFF` | variable | **LZ4 compressed packet** |

---

## Wire Format Details

### Opcode 0x10 (16) — Mouse Position (C→S)

Accepted lengths only: **13**, **9**, or **21** bytes.

```
Protocol 6/7 (13 bytes) ✅ USE THIS:
  Offset  Size  Type    Field
  0       1     u8      Opcode (0x10)
  1       4     i32le   Mouse X (world coords)
  5       4     i32le   Mouse Y (world coords)
  9       4     u32le   Protocol key (send 0)

Protocol 5 (9 bytes):
  0       1     u8      Opcode (0x10)
  1       2     i16le   Mouse X
  3       2     i16le   Mouse Y
  5       4     —       Padding

Protocol 4 (21 bytes):
  0       1     u8      Opcode (0x10)
  1       8     f64le   Mouse X
  9       8     f64le   Mouse Y
  17      4     —       Padding
```

With `scramble_level = 0`, coordinates are raw world positions — no offset
to add or subtract.

---

### Opcode 0x40 (64) — SetBorder (S→C)

#### Extended Format (len > 33)

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x40)
1       8      f64le   Min X (left border)
9       8      f64le   Min Y (top border)
17      8      f64le   Max X (right border)
25      8      f64le   Max Y (bottom border)
33      4      u32le   Game type (0=FFA, 1=Teams, 2=Experimental, 0xFFFFFFFF=resend)
37      N+1    str     Server name (UTF-8, null-terminated)
```

#### Simple Format (len == 33)

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x40)
1       8      f64le   Min X
9       8      f64le   Min Y
17      8      f64le   Max X
25      8      f64le   Max Y
Total: 33 bytes
```

Map is always centered at `(0, 0)`:
```
half = mapSize / 2
minX = -half,  maxX = +half
minY = -half,  maxY = +half
```

Example at default size (14142): `minX = -7071, maxX = 7071`.

---

### Opcode 0x11 (17) — UpdatePosition (S→C)

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x11)
1       4      f32le   Camera X (center of viewport)
5       4      f32le   Camera Y
9       4      f32le   Scale (zoom level)
13      4      u32le   Server tick counter (EL extension)
Total: 17 bytes
```

Scale values:
| State | Scale |
|-------|-------|
| Playing | `pow(min(64/totalRadius, 1), 0.4)` — dynamic |
| Free spectate | `0.25` (fixed) |
| Grouped spectate | Matches #1's scale (EMA smoothed) |
| Full-map spectate (op 55/56) | Auto-fit: `min(2020/worldW, 1180/worldH)` |

---

### Opcode 0x10 (16) — UpdateNodes (S→C)

Standard protocol 6 format:

```
[0x10]
[eatCount: u16le]
  [hunterID: u32le][victimID: u32le]     × eatCount
[cell records until terminator...]
  [cellID: u32le]                         (0 = end)
  [x: i32le]
  [y: i32le]
  [radius: u16le]                         (visual radius, NOT mass)
  [flags: u8]
  [extFlags: u8]?                         (only if flags & 0x80)
  [R: u8][G: u8][B: u8]?                 (only if flags & 0x02)
  [skin: strUTF8\0]?                      (only if flags & 0x04)
  [name: strUTF8\0]?                      (only if flags & 0x08)
[terminator: u32le = 0]
[removeCount: u16le]
  [cellID: u32le]                         × removeCount
```

#### Flags byte

| Bit | Mask | Name | Payload |
|-----|------|------|---------|
| 0 | `0x01` | isVirus | — |
| 1 | `0x02` | hasColor | R, G, B bytes follow |
| 2 | `0x04` | hasSkin | UTF-8 null-terminated string |
| 3 | `0x08` | hasName | UTF-8 null-terminated string |
| 4 | `0x10` | isAgitated | Virus pulsing (fed 7+ times) |
| 5 | `0x20` | isOwnEjected | Viewer's ejected mass |
| 6 | `0x40` | isOtherEjected | Other player's ejected mass |
| 7 | `0x80` | hasExtFlags | 1-byte extended flags follows |

#### Extended flags byte (when flags & 0x80)

| Bit | Mask | Name | Description |
|-----|------|------|-------------|
| 0 | `0x01` | isFood | Lightweight food cell rendering |

With `scramble_level = 0`: all cell IDs are raw (no XOR), all positions are
raw world coordinates (no offset).

---

### Opcode 0xFF (255) — LZ4 Compressed Packet (S→C)

```
Offset  Size   Type    Field
0       1      u8      Opcode (0xFF)
1       4      u32le   Uncompressed size
5       N      bytes   LZ4-compressed payload
```

Decompress, then process the result as a normal packet (first byte = opcode).
Only packets **≥ 200 bytes** are compressed.

---

### Opcode 0x20 (32) — AddNode (S→C)

```
Offset  Size   Type    Field
0       1      u8      Opcode (0x20)
1       4      u32le   Cell ID (your owned cell)
Total: 5 bytes
```

---

### Opcode 0x31 (49) — FFA Leaderboard (S→C)

```
[0x31][entryCount: u32le]
Per entry:
  [isMe: u32le]      (1 = this is the receiving player)
  [name: strUTF8\0]
```

Sent every 25 ticks (1 second).

---

### Opcode 0x45 (69) — Ghost Cells (S→C)

Sent on death for death screen rendering.

```
[0x45][cellCount: u16le]
Per cell (13 bytes):
  [x: i32le][y: i32le][mass: u32le][flags: u8 = 0]
```

Ghost cell positions are **raw world coordinates** (no scramble).

---

### Opcode 0x63 (99) — Chat Message (S→C)

```
[0x63][flags: u8][R: u8][G: u8][B: u8][senderName: str\0][message: str\0]
```

`flags & 0x80` = server message (not from a player).

---

### Opcode 0xE2 (226) — Ping / 0xE3 (227) — Pong

```
Ping (S→C): [0xE2][pingID: u16le]
Pong (C→S): [0xE3][pingID: u16le]    ← echo the same ID
```

**Required.** Server disconnects after 300 seconds without a pong.

---

### Opcode 0xFE (254) — Server Stats

```
Request (C→S): [0xFE]
Response (S→C): [0xFE][json: str]
  JSON: {"current_players":N,"max_players":N,"gamemode":N,"uptime":N}
```

---

## Spectator Camera System

The server drives the spectator camera **entirely server-side**. The client
does NOT compute its own spectate viewport — it just renders what the server
sends via opcode `0x11`.

### Modes

| C→S Opcode | Mode | Camera | Scale |
|-----------|------|--------|-------|
| 1 | Grouped spectate | Follows #1 | Matches #1's scale |
| 18 (Q key) | Toggle free ↔ grouped | — | — |
| 17 (Space) | Next target (grouped) | Cycles targets | — |
| 55 | Full-map free | Mouse-driven | Auto-fit entire map |
| 56 | Full-map center | Locked to (0,0) | Auto-fit entire map |

### Free-Roam Camera Movement

Client sends mouse via opcode `0x10`. Server moves the camera toward it:

```c
speed = min(distance_to_mouse, 35.0);  // 35 units/tick
center += normalize(mouse - center) * speed;
// Clamped to map borders
```

### Full-Map Scale Calculation

```c
scale = min((1920 + 100) / worldWidth, (1080 + 100) / worldHeight);
```

---

## Expanding Land Custom Opcodes (Safe to Ignore)

These opcodes are safe to ignore — they are not required for basic gameplay:

| Opcode | Hex | Len | Direction | Description |
|--------|-----|-----|-----------|-------------|
| 200 | `0xC8` | 43 | S→C | Map resize event (tier change notification) |
| 201 | `0xC9` | 5 | S→C | Alive player count |
| 202 | `0xCA` | 36 | S→C | Anti-team decay info |
| 240 | `0xF0` | 3 | S→C | LW beacon `['L','W']` — identifies EL server |
| 102 | `0x66` | var | S→C | Economy protobuf (XP, potions, auth) |

---

## Quick Checklist

To connect Garix to Expanding Land and have everything work:

- [ ] **Handshake:** Send `[0xFE][proto:u32le]` then `[0xFF][key:u32le]`
- [ ] **Mouse:** Send **13-byte** packets — no `tabID` field
- [ ] **SetBorder:** Handle both 33-byte (simple) and 38+-byte (extended)
- [ ] **UpdatePosition:** Handle 17-byte packets (13 + 4-byte tick counter)
- [ ] **LZ4:** Decompress opcode `0xFF` before processing inner packet
- [ ] **Ping/Pong:** Echo opcode `0xE2` back as `0xE3`
- [ ] **Unknown opcodes:** Silently ignore 200, 201, 202, 240, 102
- [ ] **Full map spec:** Send opcode 55 or 56 for complete map visibility
- [ ] **No `shiftMessage`:** No protocol key encryption — send raw bytes
- [ ] **No tabID on splits:** Send standard 1-byte `[17]` / `[21]`, no tabID
