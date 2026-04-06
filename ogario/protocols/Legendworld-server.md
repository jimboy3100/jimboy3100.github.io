# Expanding Land

**The Highest Performance Agar.io Server — Written in Pure C**

A blazing-fast, single-binary Agar.io private server with dynamic map scaling, designed for 1000+ concurrent players on a single core. Based on [MultiOgarII](https://github.com/AJS-development/MultiOgarII) by Barbosik, completely rewritten in C for maximum performance.

**Version:** 1.2.44 | **By:** jimboy3100 / Expanding Land — [www.expanding.land](https://www.expanding.land)

---

## 🌐 Public Server

A live instance running at **expanding.land**, open to **all mods and custom clients**:

```
wss://ffa.legendmod.ml:8080
```

Paste this address into any Agar.io mod's server/WebSocket field (OGARio, Delta, or any OgarII-compatible client) and play.

> **Note:** The server uses Let's Encrypt TLS certificates. If connecting via a custom domain, ensure HTTPS trust is established first.

---

## Why Expanding Land?

Node.js Agar.io servers (MultiOgarII, OgarII, etc.) hit a wall at ~200 players. Garbage collection pauses, heap fragmentation, and V8 overhead eat the tick budget. **Expanding Land eliminates all of that.**

### Performance vs Node.js MultiOgarII

| Metric | Node.js MultiOgarII | Expanding Land |
|--------|---------------------|----------------|
| **Max stable players** | ~200 | **1000+** |
| **Tick time at 400 players** | ~40 ms (over budget) | **~5 ms** |
| **Memory per cell** | ~64 bytes (V8 object) | **~120 bytes (flat struct, zero GC)** |
| **GC pauses** | 5–50 ms randomly | **0 ms (no GC)** |
| **Startup time** | ~2 seconds | **Instant** |
| **Binary size** | ~50 MB (Node + deps) | **~350 KB** |
| **4× larger map** | Unplayable (>80 ms ticks) | **~8 ms ticks** |
| **100 spectators watching #1** | 100× full world queries | **1 query, 100 sends** |

### Spectator Scaling

In the original Node.js MultiOgarII, every spectator runs its own full update cycle: quadtree query, sort, diff, packet build, and send. With 100 spectators watching the #1 player, that's **100 redundant queries** of the same area — each costing ~0.9 ms.

**Expanding Land groups spectators watching the same target.** The expensive world-state work (quadtree query, sort, and diff) is done **once per group**. Only the final packet encoding is per-spectator (because each client has its own scramble values for anti-cheat). Result:

| Spectators | Node.js cost | Expanding Land cost | Savings |
|-----------|-------------|--------------------|---------| 
| 1 | 1.0 ms | 1.0 ms | — |
| 10 | 10 ms | 2.2 ms | **78%** |
| 50 | 50 ms | 7 ms | **86%** |
| 100 | 100 ms | 13 ms | **87%** |

### Key Optimizations

- **Zero-allocation game loop** — All cells live in a flat contiguous pool. No `malloc` during gameplay, no garbage collector, no fragmentation.
- **Free-list cell allocator** — Cells keep their array index forever. Removed cells' indices go onto a free-list stack. Allocation is O(1) pop, removal is O(1) push. No compaction needed.
- **TLS write thread pool** — Auto-scales with CPU cores (N-1 writer threads, max 31). TLS encryption runs in parallel across cores while the sim thread continues. Fork-join model with lock-free job dispatch via `__sync_fetch_and_add`.
- **CPU affinity pinning** — Sim thread pinned to core 0, writer threads to cores 1, 2, 3… Eliminates cache migration jitter.
- **sqrt() elimination** — `can_eat()` and same-owner merge use squared distances (`dist² < threshold²`), removing all `sqrt()` from collision hot paths.
- **O(n) radix sort** — Cell ID sorting uses 4-pass LSD radix sort (8-bit digits) instead of O(n log n) quicksort. Skips passes for zero bytes.
- **Spatial hash food grid** — Food cells use a 64×64 spatial hash grid instead of a quadtree. O(1) insert/remove, O(k) visibility queries. Much cheaper than quadtree for 64k+ uniform food distributions.
- **Dirty-cell pull model** — Cells are marked dirty on state change (`last_evt_tick`). Viewers pull changes per tick instead of pushing updates for every cell.
- **LZ4 compression threshold** — Packets under 200 bytes sent raw; LZ4 overhead exceeds savings on small payloads.
- **Async logging** — `async_log()` replaces `printf()`. Messages buffer in a ring buffer, flushed by a background thread every 100ms. Game thread never blocks on stdout I/O.
- **TLS busy-spin fix** — `tls_write()` yields CPU on `WANT_WRITE` instead of spinning, preventing 100% CPU on TLS back-pressure.
- **Batched sends** — Split/spawn `pkt_add_node` packets queued instead of immediately TLS-written, reducing per-event syscalls.
- **TCP_NODELAY** — Nagle's algorithm disabled on every client socket. Ensures game packets are sent immediately without 40ms coalescing delay.
- **Cached math** — `pow()` computed once per size change via `exp2(log2())` hardware acceleration, not every tick.
- **O(1) cell removal** — Food/virus tracking arrays use stored indices for constant-time swap-and-remove instead of linear scans.
- **Cache-optimized cell struct** — Hot fields (id, type, position, radius, mass) grouped in first 56 bytes to fit one cache line.
- **Linux `epoll` I/O** — Event-driven networking on Linux eliminates wasted `recv()` syscalls. Windows `select` fallback included.
- **Spectator batching** — Grouped spectators share one quadtree query, sort, and diff. Only per-spectator packet encoding remains (scramble-safe).
- **Per-player send batching** — All per-tick packets queued into a send buffer and flushed in one `send()`.
- **Per-phase profiling** — `clock_gettime` breakdowns of move+qt, collision, send, and flush phases printed every 5 seconds for data-driven optimization.
- **Conditional log macros** — `INFO_LOG` compiles out entirely in `NDEBUG` release builds. Zero runtime cost for verbose logging in production.

### Latency Reduction (Korea → Germany)

For high-ping players (200–350 ms), code can't reduce the base RTT, but it can reduce how much lag is **felt**:

- **Tick timestamp** — Position packets include a server tick counter, enabling smooth client-side interpolation regardless of jitter.
- **Input jitter buffer** — Mouse inputs are smoothed via exponential filter (0.7 factor, ~96 ms to converge). Bursty arrivals from high-ping players no longer cause jerky movement.
- **Viewport LOD** — Food cells near the viewport edge only get position updates on even ticks. Saves ~15-20% bandwidth without visible quality loss.
- **Adaptive tick rate** — Idle or high-RTT spectators (no input in >200 ms) receive updates at 12.5 Hz instead of 25 Hz, halving their bandwidth.

Combined effect for a Korea→Germany player: **~57% less bandwidth, visibly smoother movement.**

---

## Quick Start (Step by Step)

Follow these steps from scratch. No prior experience needed.

### Step 1: Install the tools

You need a **C compiler** and **CMake** installed on your system.

**On Ubuntu / Debian Linux:**
```bash
sudo apt update
sudo apt install build-essential cmake git libssl-dev
```

**On CentOS / RHEL / Fedora:**
```bash
sudo dnf install gcc make cmake git openssl-devel
```

**On macOS:**
```bash
xcode-select --install
brew install cmake git openssl
```

**On Windows:**
1. Install [Git for Windows](https://git-scm.com/download/win)
2. Install [CMake](https://cmake.org/download/) (check "Add to PATH" during install)
3. Install [MinGW-w64](https://www.mingw-w64.org/) or [MSYS2](https://www.msys2.org/) for the GCC compiler
   - If using MSYS2, run: `pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-cmake`

### Step 2: Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/kyriakidisdimitrios/legendworld.git
cd legendworld
```

### Step 3: Build the server

**Linux / macOS:**
```bash
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
```

**Windows (MinGW):**
```bash
mkdir build
cd build
cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release
mingw32-make
```

**Windows (MSVC / Visual Studio):**
```bash
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

If everything works, you'll see `expanding-land` (Linux/macOS) or `expanding-land.exe` (Windows) in the build folder.

### Step 4: Run the server

**Linux / macOS:**
```bash
./expanding-land
```

**Windows:**
```bash
.\expanding-land.exe
```

You should see:
```
=============================================
  expanding-land v1.2.44
  The Highest Performance Agar.io Server
  Based on MultiOgarII by Barbosik
  By jimboy3100 / Expanding Land
  www.expanding.land
=============================================

[Limits] Capacity=1024 Active=1024 Spectators=256 Connections=1280
[Main] Game loop started (25 Hz)
[Main] Connect: ws://localhost:8080
```

The server is now running on port **8080**.

### Step 5: Connect a client

Open any Agar.io client (e.g., [OGARio](https://ogario.ovh) or a custom client) and set the server address to:

```
ws://localhost:8080
```

If connecting from another machine on the same network, use your server's IP:

```
ws://192.168.1.xxx:8080
```

### Step 6: Stop the server

Press `Ctrl+C` in the terminal to stop the server. All connected players will receive a "Server is restarting..." chat message before disconnection.

---

## Running with TLS (wss://)

If you need secure WebSocket connections (required for some clients), you need SSL certificates.

### Generate self-signed certificates (for testing)

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

### Run with TLS

```bash
./expanding-land --tls --cert cert.pem --key key.pem
```

Connect your client to `wss://localhost:8080`.

### For production (real certificates)

Use [Let's Encrypt](https://letsencrypt.org/) with [Certbot](https://certbot.eff.org/) to get free real certificates:

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
./expanding-land --tls --cert /etc/letsencrypt/live/your-domain.com/fullchain.pem --key /etc/letsencrypt/live/your-domain.com/privkey.pem
```

---

## Configuration

Default configuration is embedded in the binary (`src/config.c`). Key defaults:

| Setting | Default | Description |
|---------|---------|-------------|
| Port | `8080` | WebSocket listen port |
| Map size | `14142 × 14142` | Config border (real Agar.io size) |
| Server capacity | `1024` | Total player slots |
| Max active players | `1024` | Playing cap |
| Max spectators | `256` | 25% of capacity |
| Max connections | `1280` | Active + spectators |
| Food amount | `4000` | Food cells at scale 1 |
| Virus amount | `50` | Viruses at scale 1 |
| Tick rate | `25 Hz` | Game updates per second (verified from real Agar.io) |
| Log level | `3` | 0=silent, 1=errors, 2=warnings, 3=verbose |

### MAP_SCALE

Change `MAP_SCALE` in `src/config.h` to resize the entire map. Everything scales automatically:

| Scale | Border | Food | Virus | Cell pool |
|-------|--------|------|-------|-----------|
| x1 | 14142 | 4000 | 50 | 65536 |
| x4 | 28284 | 16000 | 200 | 262144 |
| x8 | 40000 | 32000 | 400 | 524288 |
| x16 | 56569 | 64000 | 800 | 1048576 |

### Dynamic Map Scaling (Expanding Land)

The server dynamically resizes the map based on active player count. It starts small and expands as players join, keeping the map appropriately dense. Each tier scales by ×√2 from the previous. Scale 1.0 = 14142 = real Agar.io map size.

| Tier | Side | Scale | Expand >N | Shrink <N | Food | Virus |
|------|------|-------|-----------|-----------|------|-------|
| 0 | 7071 | 0.25 | (base) | (never) | 1000 | 12 |
| 1 | 10000 | 0.50 | 1 | 0 (never) | 2000 | 25 |
| 2 | 14142 | 1.00 | 30 | 20 | 4000 | 50 |
| 3 | 20000 | 2.00 | 150 | 120 | 8000 | 100 |
| 4 | 28284 | 4.00 | 300 | 240 | 16000 | 200 |
| 5 | 40000 | 8.00 | 600 | 480 | 32000 | 400 |
| 6 | 56569 | 16.00 | 1200 | 960 | 64000 | 800 |

**Contraction phases:** When players leave, the map contracts through a warning phase (60s green zone), danger phase (15s red zone with anti-team penalty), then a 6-second smooth shrink animation. Tier 1 never shrinks back to tier 0. All tier thresholds and durations are configurable in `config.c`.

**Ring spawning:** During expansion, new food and viruses spawn exclusively in the outer ring (newly expanded area). Entities within the pre-expansion area spawn normally as replacements.

### Configurable Gameplay Tuning

These values are also in `config.c`:

| Setting | Default | Description |
|---------|---------|-------------|
| `at_extra_decay_base` | `1.086` | Exponential AT curve steepness — `pow(base, multiplier)` |
| `at_compensation` | `0.005` | Multiplier recovery per decay cycle (natural cooldown) |
| `at_eject_loss` | `0.1` | Multiplier bump per W press (flat, not per cell) |
| `at_split_loss` | `0.5` | Multiplier bump per split action |
| `at_virus_pop_loss` | `0.5` | Multiplier bump per virus pop |
| `at_danger_loss` | `0.01` | Multiplier bump per danger zone cycle |
| `spectator_camera_speed` | `35.0` | Free-roam camera speed (units/tick) |
| `decay_interval` | `100` | Ticks between decay cycles (4 sec) — base decay is **0.8% mass per 4 seconds** (vanilla Agar.io rate, verified from 97,806 real packets) |
| `leaderboard_interval` | `25` | Ticks between leaderboard updates (1 sec) |
| `potion_cell_count` | `3` | Potion drop cells per wave |
| `potion_cell_spawn_interval` | `90000` | Ticks between potion waves (1 hour) |
| `potion_cell_lifetime` | `1500` | Ticks before potion cell despawn (1 min) |

### Tab-Switch Backpressure Fix

When a player switches tabs, the browser stops reading WebSocket data, causing TCP backpressure. The server detects this via `net_is_backpressured()` and:
1. Skips sending updates to that player (prevents stale packet buildup)
2. Forces a full state snapshot when they return (prevents visual glitches)

---

## 🎮 Economy System (Opcode 102)

Full Agar.io economy replication via protobuf opcode 102:

| Feature | Description |
|---------|-------------|
| **Google/Facebook/Discord Auth** | OAuth token login, persistent player identity via hashed UID |
| **XP & Leveling** | Exact Agar.io XP thresholds (max level 100), starting mass bonus per level |
| **Potions** | Award on death (rarity based on performance), brew timer, open for coins/DNA/XP |
| **Potion Drop Cells** | Periodic loot cells that spawn on the map and award potions when eaten |
| **Boosts** | Mass boost (multiplies eaten mass) and XP boost, inventory persistence |
| **Wallet** | Coins + DNA currency, sent on death and potion open |
| **Quests** | Daily quest activation and reward responses |
| **Hourly Bonus** | Timed event coin rewards |
| **Skin Changes** | User settings update for equipped skins |
| **Ping/Pong** | Keep-alive heartbeat (sub-op 30/31) |

### Anti-Teaming System (Delta Extra Decay)

Exponential multiplier-based anti-teaming ported from Delta Server. Instead of tracking discrete events with lifespans, each player has a single `extra_decay_multiplier` float. Teaming actions increase it, time naturally decreases it.

**How it works:**
```
effective_decay = base_decay × pow(1.086, extra_decay_multiplier)
```

| Action | Multiplier bump | Effect at multiplier=5 |
|--------|----------------|------------------------|
| **Split** | `+0.5` | 1.51× decay |
| **W/Eject** | `+0.1` per press | — |
| **Virus pop** | `+0.5` | — |
| **Danger zone** | `+0.01` per cycle | — |

**Recovery:** Multiplier decreases by `0.005` per decay cycle (every 4 seconds). Normal play recovers naturally. No threshold — any teaming action has immediate effect, but the exponential curve means light play barely notices while heavy teamers get punished exponentially.

Clients receive decay info via opcode `0xCA` (202) with the effective multiplier value.

### Player Persistence (`playerdb`)

All player data is stored in a flat binary file (`players.dat`) with automatic format migration (V1 → V2 → V3 → V4 → V5):

| Field | Description |
|-------|-------------|
| `uid` | SHA-hashed Google/Facebook/Discord OAuth token (64 chars) |
| `total_xp`, `level` | Cumulative XP and calculated level (max 100) |
| `games_played`, `total_kills` | Lifetime stats |
| `all_time_peak_mass` | Highest mass ever achieved |
| `coins`, `dna` | Wallet balances |
| `potion_inventory` | Packed potion counts by rarity (4 bytes) |
| `boost_mass`, `boost_xp` | Boost inventory counts (packed) |
| `display_name` | Last known in-game name |
| `equipped_skin` | Vanilla skin ID (e.g., "country_gr") |
| `created_at` | Unix timestamp of first login (V5) |
| `trophies` | Trophy count (V5) |
| `total_mass_consumed` | Lifetime mass eaten (V5) |
| `quests_completed` | Lifetime quests completed (V5) |
| `skins_created` | Lifetime skins created (V5) |

**Persistence model:** Journal-based with dirty tracking. Each tick checks for dirty records and appends journal entries. Full snapshots are written on a longer interval. Max 262,144 unique players.

---

## 🏆 Weekly Leaderboard

Automated Discord leaderboard via GitHub Actions:

- **Schedule:** Every Sunday at 8 PM EEST (configurable cron)
- **Manual trigger:** Available via GitHub Actions UI
- **How it works:**
  1. Parses `players.dat` binary file for top 10 players by XP
  2. Decodes Google JWT tokens for real display names
  3. Sends a Discord embed with medals (🥇🥈🥉), provider icons (🔵 Google / 🟣 Facebook), and #1 player's avatar

---

## 🔄 CI/CD & Monitoring

### Automated Deployment

- Triggers on push to `main` (changes to `src/` or workflows)
- Uploads source, rebuilds, and restarts via SSH
- Nuclear cleanup: kills ALL old processes, force-frees port 8080
- Fallback: if systemd is rate-limited, starts server via `nohup`
- Discord notifications on deploy success/failure

### Server Health Check

- Runs every 15 minutes via cron
- Pings `ffa.legendmod.ml` with curl
- Discord alerts only on **state transitions** (down → alert, back up → recovery)
- Uses GitHub cache to track state — no spam

---

## Architecture

```
legendworld/
├── CMakeLists.txt              # Build configuration (project: expanding-land)
├── README.md                   # This file
├── expanding-land.service      # systemd service file
├── .github/workflows/
│   ├── deploy.yml              # Auto-deploy on push
│   ├── health-check.yml        # Server health monitoring (15 min)
│   └── leaderboard.yml         # Weekly Discord leaderboard
├── scripts/
│   └── leaderboard.py          # Standalone leaderboard parser
├── bots/                       # AI bot system (Node.js)
└── src/
    ├── main.c                  # Entry point, game loop, CLI args
    ├── server.c / .h           # Core game simulation (tick, collisions, vis cache)
    ├── mapscaler.c / .h        # Dynamic map scaling (Expanding Land)
    ├── config.c / .h           # Server configuration & MAP_SCALE
    ├── net.c / .h              # WebSocket server (epoll on Linux, select on Windows)
    ├── client.c / .h           # Client message handling (opcodes)
    ├── cell.c / .h             # Cell struct (cache-optimized), physics, cached speed
    ├── player.c / .h           # Player state, extra decay multiplier, potions, boosts
    ├── playerdb.c / .h         # Persistent player database (journal + snapshot)
    ├── proto102.c / .h         # Protobuf encoder for opcode 102 economy
    ├── discord_oauth.c / .h    # Discord OAuth2 callback handler
    ├── quadtree.c / .h         # Spatial indexing for dynamic cells
    ├── food_grid.h             # Spatial hash grid for food (64×64)
    ├── packet.c / .h           # Protocol packet builders (WebSocket)
    ├── buffer.c / .h           # Binary reader/writer
    ├── tls.c / .h              # Optional TLS via OpenSSL
    ├── write_pool.c / .h       # Auto-scaling TLS write thread pool (max 31 threads)
    ├── async_log.c / .h        # Non-blocking ring-buffer logging
    ├── lz4.c / .h              # LZ4 compression (vendored)
    ├── vec2.h                  # 2D vector math
    ├── event.h                 # Event type definitions
    └── version.h               # Server version string (v1.2.44)
```

### Design Principles

- **Single-threaded authoritative simulation** — One thread runs the game logic. No locks on game state, no races, deterministic behavior.
- **Multi-threaded TLS writes** — TLS encryption is offloaded to N-1 worker threads (max 31) via a fork-join write pool. SSL_write never blocks the sim thread.
- **Flat memory layout** — `Cell cells[65536]` is a contiguous array. Cache-friendly iteration, zero pointer chasing.
- **Dual spatial indexing** — Quadtree for dynamic cells (players, ejected, viruses), spatial hash grid for food. Each optimized for its access pattern.
- **Protocol-compatible** — Speaks the same WebSocket binary protocol as MultiOgarII. Existing clients work without modification.
- **Data-driven optimization** — Per-phase profiling (`[Prof]` output) identifies the actual bottleneck before optimizing.

---

## Protocol

Implements the Agar.io binary WebSocket protocol (protocol version 6, accepts up to 22):

### Standard Opcodes

| Opcode | Direction | Description |
|--------|-----------|-------------|
| `0x00` | C→S | Join (name + skin) |
| `0x01` | C→S | Spectate |
| `0x10` | S→C | Update nodes (add/update/eat/delete) |
| `0x11` | S→C | Update position (camera + tick) |
| `0x12` | S→C | Clear all nodes |
| `0x14` | S→C | Clear owned nodes |
| `0x20` | S→C | Add owned node |
| `0x31` | S→C | FFA leaderboard |
| `0x40` | S→C | Set border |
| `0x45` | S→C | Ghost cells (sent on death) |
| `0x63` | Both | Chat message |
| `0x66` | Both | Opcode 102 — mobile data (protobuf) |
| `0xE2` | S→C | Ping |
| `0xFE` | S→C | Server stats (JSON) |
| `0xFF` | S→C | LZ4-compressed packet |

### Custom Opcodes (Expanding Land / LegendMod)

| Opcode | Direction | Description |
|--------|-----------|-------------|
| `0xC8` (200) | S→C | Map event (expansion/contraction notifications) |
| `0xC9` (201) | S→C | LM stats (alive players + bot count) |
| `0xCA` (202) | S→C | Decay info (extra decay multiplier per player) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `cmake: command not found` | Install CMake: `apt install cmake` (Linux) or download from [cmake.org](https://cmake.org/download/) |
| `gcc: command not found` | Install GCC: `apt install build-essential` (Linux) |
| `Bind failed on port 8080` | Another process is using port 8080. Kill it or change the port |
| `TLS handshake failed` | Check that cert/key files exist and are valid |
| Client can't connect | Check firewall: `sudo ufw allow 8080/tcp` (Linux) |
| Server crashes immediately | Build in Debug mode (`-DCMAKE_BUILD_TYPE=Debug`) to see assertion messages |
| `--tls requires --cert and --key` | Must provide both `--cert` and `--key` when using `--tls` |

---

## 📱 Android App (Google Play — Expanding Land TWA)

The Android app is a **Trusted Web Activity (TWA)** wrapper generated by [PWABuilder](https://www.pwabuilder.com/) on **2026-03-21**. It loads `https://expanding.land` in a full-screen Chrome custom tab with no browser UI.

| Field | Value |
|-------|-------|
| **Package ID** | `land.expanding.twa` |

### Updating the app

1. Make changes to `expanding.land` (the website updates instantly — TWA loads the live site)
2. If you need to update the APK wrapper itself, re-run PWABuilder and use the **same signing key**
3. Upload the new `.aab` to [Google Play Console](https://play.google.com/console)

---

## Credits

- **MultiOgarII** by [Barbosik](https://github.com/AJS-development/MultiOgarII) — original Node.js server this project is based on
- **jimboy3100 / Expanding Land** — C rewrite, performance engineering, and optimization
- **www.expanding.land** — Expanding Land home

---

## License

This project is provided as-is for the Agar.io private server community. Based on the open-source MultiOgarII project.
