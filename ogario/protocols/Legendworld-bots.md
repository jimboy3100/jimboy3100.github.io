# 🤖 Expanding Land Smart Bots v4

AI-powered bots with personality, intelligence tiers, social behavior, emotional states, and advanced tactical decision-making. Designed for stress-testing the Expanding Land server.

## Quick Start

```bash
# 1. Start the server (from project root)
.\expanding-land.exe

# 2. In another terminal, start bots
cd bots
npm install
node index.js 100 ws://localhost:8080
```

## Usage

```bash
# Default: 10 bots → ws://localhost:8080
node index.js

# Custom count + server
node index.js 100 ws://localhost:8080
node index.js 50 wss://ffa.legendmod.ml:8080
```

## Bot Architecture

Each bot has 3 independent trait axes (rolled at spawn):

| Axis | Options | Effect |
|------|---------|--------|
| **Personality** | ghost, farmer, predator, brawler, trickster, diplomat, survivor, hothead | Base weights for survival/aggression/farming |
| **Intelligence** | dummy (20%), average (35%), smart (30%), genius (15%) | IQ gates: split-kills, virus tactics, deception, aim accuracy |
| **Social** | solo (50%), teamer (30%), opportunist (15%), betrayer (5%) | Cooperation, W-feeding, trust-building, betrayal |

### Decision Systems

- **Brain** — Scores ~65 candidate actions per tick, picks the best
- **Perception** — Threat/prey/neutral classification, food clusters, idle cells
- **Emotions** — Confidence, anxiety, aggression, frustration modulate decisions
- **Formation** — Multi-cell spread, merge timing, compact movement
- **Contraction** — Zone-aware scoring for Expanding Land's shrinking maps
- **Anti-Team** — Budget-based split/eject tracking with decay projection
- **Memory** — Player encounter history, spatial danger zones
- **Trust** — W-test tracking, ally identification

### Action Labels (65 canonical labels)

Strategic: `flee`, `chase`, `farm`, `hold`, `split-kill`, `popsplit`, `tricksplit`, `virus-fire`, `virus-eat`, `bait-trap`, `merge-regroup`, and more.

Recovery: `drift-center`, `commit-forward`, `detour`, `explore-fresh`.

Cognitive: `restraint`, `observe`, `freeze`, `reaction-delay`.

Social: `social-W`, `team-feed`, `team-protect`, `BETRAY`, `trust-test-W`.

Zone: `leave-doomed`, `contraction-nudge`, `contraction-farm`, `contraction-ambush`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `BOT_COUNT` | `10` | Number of bots (1st CLI arg) |
| `SERVER_URL` | `ws://localhost:8080` | Target server (2nd CLI arg) |
| `BATCH_SIZE` | `5` | Bots per connection wave |
| `BATCH_DELAY` | `300ms` | Delay between waves |
| `AI_TICK_MS` | `100ms` | Decision rate (10 Hz) |
| `DEBUG_LOGGING` | `false` | Console output for first 3 bots |
| `DEBUG_ASSERTIONS` | `false` | Invariant checks (brain.js) |

## Performance

- **Queued splits/ejects** — No setInterval timers, actions drain from main tick
- **Tick-based cooldowns** — No setTimeout anywhere, all decay is tick-counted
- **Candidate screening** — Drops weak candidates before expensive analysis
- **Cached geometry** — Border distance computed once per tick
- **Squared distance** — Comparison-only checks avoid sqrt

## Stop

Press `Ctrl+C` to gracefully disconnect all bots.
