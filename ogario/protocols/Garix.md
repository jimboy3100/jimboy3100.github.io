# Network Protocol — Garix Server

## Overview

Binary WebSocket connection. All multi-byte integers are **Little Endian** unless noted otherwise.  
The handshake must complete within **8 seconds** or the server closes with code 1002.

> **Important:** The handshake uses `clientProtocol = 1`, but the server internally
> converts this to **protocol 6** for all packet formats. All in-game packets
> (UpdateNodes, Leaderboard, Border, Chat, etc.) use the **Protocol 6–10** wire format.

---

## Handshake (4 steps)

### Step 1 — Client → Server: `opcode 171` (Protocol)

```
[1B: 0xAB=171] [4B: clientProtocol LE32] [4B: unixTime LE32]
Total: 9 bytes
```

**Server validations:**
- Exact length = 9 bytes.
- `clientProtocol` must match `serverProtocolVersion` (see config).
- `|serverTime - clientTime| <= 30` seconds.
- On failure → closes with 1002. Repeated failures → temporary IP ban.

---

### Step 2 — Server → Client: `opcode 172` (Seed)

```
[1B: 0xAC=172] [4B: randomSeed LE32]
Total: 5 bytes
```

The server generates a random uint32 `seed` and sends it to the client.

---

### Step 3 — Client → Server: `opcode 205` (Key)

```
[1B: 0xCD=205] [4B: key LE32]
Total: 5 bytes
```

**Key calculation (client side):**
```
key = (clientProtocol XOR clientTime) XOR 0x6F67
key = key & 0xFFFFFFFF
```

The server recalculates the same formula and verifies it matches.

---

### Step 4 — Client → Server: `opcode 187` (Final answer)

```
[1B: 0xBB=187] [4B: answer LE32]
Total: 5 bytes
```

**Answer calculation (client side):**
```
answer = (seed XOR clientProtocol) & 0xFFFFFFFF
```

The server verifies it. If correct → sends `[0xDC=220]` (1 byte) as confirmation and transitions to Auth state.

---

### Step 5 — Client → Server: `opcode 221` (Auth / JWT)

**4-second timeout** from receiving opcode 220.

```
Guest:  [1B: 0xDD=221]                              ← just the opcode, NO payload
Login:  [1B: 0xDD=221] [N bytes: JWT as UTF-8]       ← JWT starting with "ey"
```

> **Critical:** For guest auth, send exactly **1 byte** `[0xDD]`. Sending `[0xDD, 0x00]`
> is treated as a 1-byte token that fails validation.

- The server responds with `opcode 222`:
  ```
  [1B: 0xDE=222] [1B: success 0|1] [N bytes: reason UTF-8]
  ```
  - Guest auth returns `success=0, reason="guest"` — this is **normal** and the
    connection proceeds. The server still sends DualInfo and enables all in-game opcodes.
  - JWT auth returns `success=1` on success, or `success=0, reason="invalid token"` on failure.

Once auth is complete → the server enables all in-game opcodes.

---

## Client opcodes (in-game state)

| Opcode (dec) | Hex  | Handler         | Bytes | Description |
|:---:|:---:|---|:---:|---|
| 0   | 0x00 | `onJoin`        | var   | Join game: `[0x00][tabID LE16][nick/skin UTF-16z or UTF-8z]` |
| 1   | 0x01 | `onSpectate`    | 1     | Enter spectator mode |
| 2   | 0x02 | `onSpectateNick`| var   | Set nick while spectating |
| 16  | 0x10 | `onMouse`       | 11/15/23 | Cursor position (see below) |
| 17  | 0x11 | `onKeySpace`    | 3     | Split: `[0x11][tabID LE16]` |
| 18  | 0x12 | `onKeyQ`        | 1     | Toggle minion follow |
| 21  | 0x15 | `onKeyW`        | 3     | Eject mass: `[0x15][tabID LE16]` |
| 22  | 0x16 | `onKeyE`        | 1     | Split minions |
| 23  | 0x17 | `onKeyR`        | 1     | Eject from minions |
| 24  | 0x18 | `onKeyT`        | 1     | Toggle minions frozen |
| 25  | 0x19 | `onKeyP`        | 1     | Toggle minion food collection |
| 26  | 0x1A | `onKeyO`        | 1     | Toggle frozen (OP only) |
| 27  | 0x1B | `onKeyM`        | 1     | Force merge (OP only) |
| 28  | 0x1C | `onKeyI`        | 1     | Supersplitter (OP only) |
| 29  | 0x1D | `onKeyK`        | 1     | Kill yourself (OP only) |
| 30  | 0x1E | `onKeyY`        | 1     | Increase size (OP only) |
| 31  | 0x1F | `onKeyU`        | 1     | Decrease size (OP only) |
| 33  | 0x21 | `onKeyL`        | 1     | Clear all non-player nodes (OP only) |
| 34  | 0x22 | `onKeyH`        | 1     | Explode cells (OP only) |
| 35  | 0x23 | `onKeyZ`        | 1     | Random color (OP only) |
| 36  | 0x24 | `onKeyX`        | 1     | Toggle rainbow mode |
| 37  | 0x25 | `onKeyS`        | 1     | Spawn virus at cursor (OP only) |
| 38  | 0x26 | `onKeyC`        | 1     | Cycle food brush size (OP only) |
| 39  | 0x27 | `onKeyG`        | 1     | Teleport to cursor (OP only) |
| 40  | 0x28 | `onKeyJ`        | 1     | Spawn food at cursor (OP only) |
| 41  | 0x29 | `onKeyB`        | 1     | Random food color (OP only) |
| 42  | 0x2A | `onKeyV`        | 1     | Eject mass toward cursor (OP only) |
| 43  | 0x2B | `onKeyN`        | 1     | Explode food from cells (OP only) |
| 44  | 0x2C | `onChangeTeam`  | var   | Change team: `[0x2C][name UTF-8z]` (red/green/blue) |
| 80  | 0x50 | `onKeyTag`      | var   | Set tag: `[0x50][tag UTF-8z]` (max 20 chars) |
| 99  | 0x63 | `onChat`        | var   | Chat message (see below) |
| 122 | 0x7A | `onMinimap`     | 1     | Request minimap data |
| 200 | 0xC8 | `onPing`        | 5     | `[0xC8][echo LE32]` → server replies `[0xC9][echo LE32]` |
| 221 | 0xDD | `onAuthToken`   | var   | Re-authenticate with JWT while in-game |
| 254 | 0xFE | `onStat`        | 1     | Request server stats |

> [!CAUTION]
> **Ping keepalive is mandatory.** The server disconnects (code 1002) if no `opcode 200`
> is received within **8 seconds** of entering the in-game state. Send pings every 3–5 seconds.

---

## `onMouse` format (opcode 16)

> **Critical:** The server uses `message.length` to determine coordinate precision.
> It does NOT parse x/y in the handler — it stores the raw buffer and parses later
> in the game tick. Sending the wrong packet size causes coordinates to be read
> at the wrong precision.

```
[0x10][tabID LE16] + coordinates depending on total message length:

11 bytes → x = Int16LE(3),  y = Int16LE(5)   + 4 trailing bytes
15 bytes → x = Int32LE(3),  y = Int32LE(7)   + 4 trailing bytes
23 bytes → x = Float64LE(3), y = Float64LE(11) + 4 trailing bytes

Byte layout (15-byte / Int32 example):
  [0]    opcode 0x10
  [1-2]  tabID  UInt16LE
  [3-6]  x      Int32LE
  [7-10] y      Int32LE
  [11-14] padding / unused (4 bytes to reach 15 total)
```

**Server-side handler (`onMouse`):**
```js
onMouse(message) {
    if (message.length === 15 || message.length === 11 || message.length === 23) {
        let tabID = message.readUInt16LE(1);
        if (dualMode && playerTracker2 && tabID === playerTracker2.tabID) {
            this.mouseData2 = Buffer.concat([message]);
        } else {
            this.mouseData = Buffer.concat([message]);
        }
    }
}
```

**Implementation notes:**
- Use **15-byte** packets for Int32 precision (recommended).
- The `tabID` determines which player tracker receives the mouse data (dual tab support).
- Coordinates are in scrambled world space — the server subtracts `scrambleX` / `scrambleY` internally.
- Any message length other than 11/15/23 is silently ignored.

---

## `onJoin` format (opcode 0)

```
[0x00][tabID LE16][nick...]

Protocol <= 6 → nick as null-terminated UTF-8
Protocol >  6 → nick as null-terminated UTF-16 LE
```

**Nick with custom skin:**
```
<https://i.imgur.com/XXXXXXX.png>NameHere
 ^------- valid imgur HTTPS URL --------^^-- nick --^
```

Only URLs from `i.imgur.com` with extension `.png/.jpg/.jpeg/.webp/.gif` are accepted.

---

## `onChat` format (opcode 99)

```
[0x63][flags 1B][reserved bytes][tabID (if flag&1)][text UTF-8z or UTF-16z]

flags bit 0 = includes tabID (2 bytes Big Endian after reserved)
flags bit 1 = 4 reserved bytes
flags bit 2 = 8 reserved bytes
flags bit 3 = 16 reserved bytes
```

Chat is rate-limited to **20 ticks** between messages.

---

## Server → Client opcodes

| Opcode | Description |
|:---:|---|
| 172 (0xAC) | Handshake seed |
| 201 (0xC9) | Pong (ping echo reply) |
| 220 (0xDC) | Handshake completed OK |
| 222 (0xDE) | Authentication result |

(Other world-update, border, chat, and stat packets depend on the server's Packet builders.)

---

## Security notes

- Opcodes `254` and `255` before handshake is complete → immediate disconnect.
- Ping watchdog: if opcode 200 is not received within **8 seconds** in-game → closes with 1002.
- Mouse coordinates outside `border * 2.3` → automatic 10-minute IP ban.
- Repeated handshake failures → escalating temporary ban.

---

## Tab ID system

The server supports **dual mode** — a single WebSocket connection can control two independent player cells simultaneously (two browser tabs sharing one socket).

Each connection has up to two `playerTracker` objects, each with a unique `tabID` (a random uint16 assigned by the server on connect). The client must tell the server which tab is performing each action by including the `tabID` in the relevant packets.

### How tabID is assigned

The server assigns `tabID` values when the connection is established. They are sent to the client inside the `DualInfo` packet (server → client) right after the handshake completes. The client must store both tabIDs and use the correct one per action.

### Which packets require tabID

| Opcode | tabID position | Notes |
|:---:|---|---|
| 0 (onJoin) | bytes 1–2 (LE16) | Identifies which tab is joining |
| 16 (onMouse) | bytes 1–2 (LE16) | Identifies which tab moved the cursor |
| 17 (onKeySpace) | bytes 1–2 (LE16) | Identifies which tab is splitting |
| 21 (onKeyW) | bytes 1–2 (LE16) | Identifies which tab is ejecting |
| 99 (onChat) | after reserved bytes, if `flags & 1` (BE16) | Identifies which tab sent the message |

### Which packets do NOT carry tabID

All 1-byte key packets (Q, E, R, T, P, O, M, I, K, Y, U, L, H, Z, X, S, C, G, J, B, V, N) do **not** carry a tabID. The server always applies those actions to `playerTracker` (tab 1). Minion controls and OP commands are tab-1 only.

### Dual mode behavior

- If `dualMode` is disabled in the server config, `onJoin` packets targeting tab 2 are rejected with opcode `0xA2`.
- Mouse, split, and eject actions are routed independently per tab — tab 1 and tab 2 can move and split at the same time.
- Chat messages can be sent from either tab by including the correct tabID with `flags & 1`.
- If the tabID in a packet does not match either tracker, the packet is ignored.

### Example: dual mode join sequence

```
Client connects → receives DualInfo with tabID_1 and tabID_2

Tab 1 join:  [0x00][tabID_1 LE16][nick UTF-16z]
Tab 2 join:  [0x00][tabID_2 LE16][nick UTF-16z]

Tab 1 split: [0x11][tabID_1 LE16]
Tab 2 split: [0x11][tabID_2 LE16]

Tab 1 mouse: [0x10][tabID_1 LE16][x Int32LE][y Int32LE]
Tab 2 mouse: [0x10][tabID_2 LE16][x Int32LE][y Int32LE]
```

# Server → Client Packets — Garix Server
> All packets are binary WebSocket frames. All integers are **Little Endian** unless noted.  
> Node IDs are always XOR'd with `scrambleID` before sending.  
> Coordinates are always offset by `scrambleX` / `scrambleY` before sending.

---

## Quick reference

| Opcode | Hex  | Packet            |
|:------:|:----:|-------------------|
| 16     | 0x10 | UpdateNodes       |
| 17     | 0x11 | UpdatePosition    |
| 18     | 0x12 | ClearAll          |
| 20     | 0x14 | ClearOwned        |
| 32     | 0x20 | AddNode           |
| 48     | 0x30 | LeaderboardPosition |
| 49     | 0x31 | UpdateLeaderboard (FFA / Text) |
| 50     | 0x32 | UpdateLeaderboard (Teams) |
| 53     | 0x35 | UpdateLeaderboard (protocol ≥ 11) |
| 64     | 0x40 | SetBorder         |
| 99     | 0x63 | ChatMessage       |
| 122    | 0x7A | Minimap           |
| 161    | 0xA1 | DualInfo          |
| 254    | 0xFE | ServerStat        |

---

## UpdateNodes — `0x10`

Sent every tick. Contains eaten nodes, updated nodes, and removed nodes.  
Format varies by protocol version.

### Protocol ≤ 4

```
[0x10]

--- Eat list ---
[eatCount UInt16]
  for each: [hunterID UInt32] [eatenID UInt32]   ← both XOR scrambleID

--- Update + Add nodes (loop until nodeID = 0) ---
  [nodeID   UInt32]   ← XOR scrambleID; 0 = end of list
  [x        Int16]    ← + scrambleX
  [y        Int16]    ← + scrambleY
  [size     UInt16]
  [r        UInt8]
  [g        UInt8]
  [b        UInt8]
  [flags    UInt8]
    bit 0 (0x01) = spiked (virus)
    bit 4 (0x10) = agitated
    bit 5 (0x20) = ejected mass
  --- only on ADD nodes ---
  [name     UTF-16z]  ← UInt16 = 0 if no name
[0x00 0x00 0x00 0x00]  ← terminator

--- Remove list ---
[removeCount UInt32]
  for each: [nodeID UInt32]  ← XOR scrambleID
  (includes both eaten + deleted nodes)
```

---

### Protocol 5

```
[0x10]

--- Eat list ---
[eatCount UInt16]
  for each: [hunterID UInt32] [eatenID UInt32]

--- Update + Add nodes (loop until nodeID = 0) ---
  [nodeID   UInt32]
  [x        Int32]    ← + scrambleX  (upgraded from Int16)
  [y        Int32]    ← + scrambleY
  [size     UInt16]
  [r        UInt8]
  [g        UInt8]
  [b        UInt8]
  [flags    UInt8]
    bit 0 (0x01) = spiked
    bit 2 (0x04) = has skin   ← new in protocol 5
    bit 4 (0x10) = agitated
    bit 5 (0x20) = ejected mass
  --- only on ADD nodes ---
  [if flag 0x04] [skin  UTF-8z]
  [name          UTF-16z]     ← UInt16 = 0 if no name
[0x00 0x00 0x00 0x00]

--- Remove list ---
[removeCount UInt32]
  for each: [nodeID UInt32]
```

---

### Protocol 6–10 (Active format — server converts protocol 1 → 6)

> **Wire structure:** The server writes updated nodes, then added nodes,
> then **ONE** `writeUInt32(0)` terminator. There are **no separate terminators**
> between the update and add sections. Use **flag 0x40** to distinguish:
> - `flags & 0x40` → **Added node** (has tabID, possibly skin/name/nickColor)
> - `!(flags & 0x40)` → **Updated node** (position/size/color only)

```
[0x10]

--- Eat list ---
[eatCount UInt16]
  for each: [hunterID UInt32] [eatenID UInt32]   ← both XOR scrambleID

--- Nodes (single loop: updates then adds, read until nodeID = 0) ---
  [nodeID   UInt32]   ← XOR scrambleID; 0 = end of ALL nodes
  [x        UInt32]   ← position.x + scrambleX (signed via >> 0)
  [y        UInt32]   ← position.y + scrambleY (signed via >> 0)
  [size     UInt16]
  [flags    UInt16]

  Common flag bits:
    bit  0 (0x0001) = spiked (virus)
    bit  1 (0x0002) = has color
    bit  4 (0x0010) = agitated
    bit  5 (0x0020) = ejected mass
    bit  7 (0x0080) = pellet/food (cellType === 1)

  Added-node-only flag bits (when flag 0x40 is set):
    bit  2 (0x0004) = has skin
    bit  3 (0x0008) = has name
    bit  6 (0x0040) = has tabID        ← always set for adds
    bit  8 (0x0100) = has nickColor

  [if flag 0x0002] [r UInt8][g UInt8][b UInt8]

  --- Only when flag 0x0040 is set (ADDED node) ---
  [if flag 0x0004] [skin  UTF-8z]      ← _skinUtf8 from owner
  [if flag 0x0008] [name  UTF-8z]      ← _nameUtf8 from owner
  [tabID           UInt16]             ← owner's tabID (0 if no owner)
  [if flag 0x0100] [r UInt8][g UInt8][b UInt8]   ← nick color

[0x00 0x00 0x00 0x00]   ← single terminator for both sections

--- Remove list ---
[removeCount UInt16]   ← downgraded to UInt16 (was UInt32 in proto < 6)
  for each: [nodeID UInt32]   ← XOR scrambleID
  (includes both eaten + deleted nodes)
```

**Server-side flag construction (from `writeUpdateItems6`):**
```
Updated nodes:
  cellType === 0 (player) → flags |= 0x02 (has color)
  node.spiked             → flags |= 0x01
  node.isAgitated         → flags |= 0x10
  cellType === 3 (eject)  → flags |= 0x20
  cellType === 1 (food)   → flags |= 0x80

Added nodes (all of the above, plus):
  flags |= 0x02           always (color always sent)
  flags |= 0x40           always (tabID always sent)
  has skin                → flags |= 0x04
  has name                → flags |= 0x08
  has nickColor           → flags |= 0x100
```

---

### Protocol ≥ 11

```
[0x10]

--- Eat list ---
[eatCount UInt16]
  for each: [hunterID UInt32] [eatenID UInt32]

--- Updated nodes (loop until nodeID = 0) ---
  [nodeID   UInt32]
  [x        Int32]
  [y        Int32]
  [size     UInt16]
  [flags    UInt8]    ← back to UInt8
    bit 0 (0x01) = spiked
    bit 1 (0x02) = has color
    bit 4 (0x10) = agitated
    bit 5 (0x20) = ejected mass
    bit 7 (0x80) = pellet/food
  [if flag 0x80] [subtype UInt8]  = 0x01
  [if flag 0x02] [r UInt8][g UInt8][b UInt8]

--- Added nodes (loop until nodeID = 0) ---
  [nodeID   UInt32]
  [x        Int32]
  [y        Int32]
  [size     UInt16]
  [flags    UInt8]
    bit 0 (0x01) = spiked
    bit 1 (0x02) = has color    ← always set
    bit 2 (0x04) = has skin
    bit 3 (0x08) = has name
    bit 4 (0x10) = agitated
    bit 5 (0x20) = ejected mass
    bit 7 (0x80) = pellet/food
  [if flag 0x80] [subtype UInt8] = 0x01
  [if flag 0x02] [r UInt8][g UInt8][b UInt8]
  [if flag 0x04] [skin  UTF-8z]
  [if flag 0x08] [name  UTF-8z]
[0x00 0x00 0x00 0x00]

--- Remove list ---
[removeCount UInt16]
  for each: [nodeID UInt32]
```

---

## UpdatePosition — `0x11`

Sent to spectators to set the camera position.

```
[0x11]
[x     Float32]   ← + scrambleX
[y     Float32]   ← + scrambleY
[scale Float32]
```

---

## ClearAll — `0x12`

Clears all nodes from the client. Sent once on join.

```
[0x12]
Total: 1 byte
```

---

## ClearOwned — `0x14`

Clears only nodes owned by this player.

```
[0x14]
Total: 1 byte
```

---

## AddNode — `0x20`

Notifies the client that one of its own cells was added (own player node).

```
[0x20]
[nodeID UInt32]   ← XOR scrambleID
Total: 5 bytes
```

---

## LeaderboardPosition — `0x30`

Tells the client its own rank on the leaderboard.  
Sent alongside UpdateLeaderboard on protocol ≥ 11.

```
[0x30]
[position UInt16]   ← 1-based rank (0 = not ranked)
Total: 3 bytes
```

---

## UpdateLeaderboard — `0x31` / `0x32` / `0x35`

Three variants depending on game mode and protocol.

---

### FFA / Text — protocol ≤ 5 → `0x31`

```
[0x31]
[count UInt32]
  for each entry:
    [nodeID UInt32]   ← own cell nodeID if self, else 0
    [name   UTF-16z]  ← UInt16 = 0 if no name
```

---

### FFA — protocol 6–10 → `0x31`

```
[0x31]
[count UInt32]
  for each entry:
    [playerID UInt32]
    [name     UTF-8z]   ← null terminator
    [mass     UInt32]   ← floor(totalSize² / 100)
    [sector   UTF-8z]   ← grid sector e.g. "A1"–"E5"
    [color    UTF-8z]   ← hex string e.g. "#ff8800"
```

---

### FFA — protocol ≥ 11 → `0x35`

Sends LeaderboardPosition (0x30) separately first, then:

```
[0x35]
  for each entry:
    [entryFlags UInt8]
      0x09 = this is the local player
      0x02 = another player
    [if 0x09]
      [highlight UInt16] = 1
    [if 0x02]
      [name UTF-8z]   ← empty byte if no name
```

---

### Text/Custom — protocol ≤ 10 → `0x31`

```
[0x31]
[count UInt32]
  for each entry:
    [if protocol < 11] [padding UInt32] = 0
    [text UTF-16z or UTF-8z depending on protocol]
```

---

### Text/Custom — protocol ≥ 11 → `0x35`

```
[0x35]
  for each entry:
    [entryFlags UInt8] = 0x02
    [text UTF-8z]
```

---

### Teams — `0x32`

```
[0x32]
[teamCount UInt32]
  for each team:
    [score Float32]   ← normalized 0.0–1.0

[teamCount UInt32]
  for each team:
    [playerCount UInt32]   ← alive players on this team

[teamCount UInt32]
  for each team:
    [r UInt8][g UInt8][b UInt8]   ← team color
```

---

## SetBorder — `0x40`

Sent once on join. Defines world boundaries and server info.

```
[0x40]
[minX Float64]   ← + scrambleX
[minY Float64]   ← + scrambleY
[maxX Float64]   ← + scrambleX
[maxY Float64]   ← + scrambleY
[gameType UInt32]   ← gameMode ID (omitted if gameType is null)
[serverName UTF-16z or UTF-8z depending on protocol]
```

If `gameType` is null (legacy mode), the packet is exactly 33 bytes:
```
[0x40][minX Float64][minY Float64][maxX Float64][maxY Float64]
Total: 33 bytes
```

---

## ChatMessage — `0x63`

Sent whenever someone chats or the server sends a system message.

### System message (no sender)

```
[0x63]
[flags  UInt8]  = 0x80 (FLAG_SERVER)
[r      UInt8]  = 0x3F
[g      UInt8]  = 0x3F
[b      UInt8]  = 0xC0
[name   UTF-16z or UTF-8z]   ← "🚨SERVER"
[text   UTF-16z or UTF-8z]
```

### Player message — simple (no role prefix)

```
[0x63]
[flags  UInt8]  = 0x00
[r      UInt8]
[g      UInt8]
[b      UInt8]
[name   UTF-16z or UTF-8z]
[text   UTF-16z or UTF-8z]
```

### Player message — with role prefix (Admin / Mod)

```
[0x63]
[flags  UInt8]
  bit 7 (0x80) = server message
  bit 6 (0x40) = sender is Admin
  bit 5 (0x20) = sender is Mod
  bit 2 (0x04) = split color mode (prefix + nick have different colors)
[prefixColor r UInt8]
[prefixColor g UInt8]
[prefixColor b UInt8]
[nickColor   r UInt8]
[nickColor   g UInt8]
[nickColor   b UInt8]
[prefixLength UInt8]   ← byte length of the prefix in UTF-8
[name   UTF-16z or UTF-8z]   ← full name including prefix
[text   UTF-16z or UTF-8z]
```

String encoding: UTF-16z for protocol < 6, UTF-8z for protocol ≥ 6.

---

## Minimap — `0x7A`

Sent on demand when the client sends opcode 122.

```
[0x7A]
[count UInt16]
  for each visible teammate:
    [x    Float32]   ← centerPos.x + scrambleX
    [y    Float32]   ← centerPos.y + scrambleY
    [rgb  UInt32]    ← (r << 16) | (g << 8) | b
    [name UTF-8z]
```

Only players on the same team (Teams mode) or same tag are included.  
Bots, spectators, removed players, and self are excluded.

---

## DualInfo — `0xA1`

Sent once after handshake. Tells the client its tab IDs.

```
[0xA1]
[tabCount UInt8]   ← 1 or 2
[tabID_1  UInt16]
[tabID_2  UInt16]  ← 0 if only one tab
Total: 6 bytes
```

---

## ServerStat — `0xFE`

Sent on demand when the client sends opcode 254. Rate-limited to 25 ticks.

```
[0xFE]
[json UTF-8z]
```

JSON payload:
```json
{
  "name":         "string",
  "mode":         "string",
  "uptime":       12345,
  "update":       "1.234",
  "playersTotal": 10,
  "playersAlive": 7,
  "playersDead":  3,
  "playersSpect": 2,
  "botsTotal":    5,
  "playersLimit": 100
}

ws = new WebSocket(wsUrl, [fingerprint]);
    async function generateFingerprint() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("garix.io fp", 2, 15);
        ctx.fillStyle = "rgba(102,204,0,0.7)";
        ctx.fillText("garix.io fp", 4, 17);
        let canvasData = canvas.toDataURL();
        let webgl = "";
        try {
            let gl = document.createElement("canvas").getContext("webgl");
            let ext = gl.getExtension("WEBGL_debug_renderer_info");
            if (ext) webgl = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        } catch (e) {}
        let raw = [navigator.userAgent, screen.width + "x" + screen.height + "x" + screen.colorDepth, navigator.language, navigator.hardwareConcurrency || 0, new Date().getTimezoneOffset(), canvasData.slice(-50), webgl].join("|");
        let encoder = new TextEncoder();
        let data = encoder.encode(raw);
        let hashBuffer = await crypto.subtle.digest("SHA-256", data);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        return hex.slice(0, 32)
    }
