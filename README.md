# SUPER KEEPER ⚽🧤

**Save everything. Pick your chaos. Become the wall.**

A reaction goalkeeper roguelike built for [CrazyGames](https://www.crazygames.com). Mouse = glove, click = dive. One HTML file, zero dependencies, ~40KB.

## Game modes

- **SOLO RUN** — the roguelike gauntlet. Survive matches against escalating fake nations, pick a mutation after each match (GIFTS help you, CHAOS makes shots crazier but multiplies your score), win Penalty Breaks for extra hearts, chase your best score and grade (S "THE GREAT WALL" → D "SWISS CHEESE").
- **PENALTY ROYALE** — fast-paced 8-keeper knockout. Everyone faces the same shots, lowest 2 scores each round are eliminated, live leaderboard, winner takes the crown. (Rivals are simulated locally — real 1v1 netcode is Stage 2, see [ROADMAP.md](ROADMAP.md).)

## Run locally

Any static server works:

```
python -m http.server 8240
```

Then open http://localhost:8240. There is no build step — `index.html` is the entire game.

## Architecture notes

- Fixed-timestep sim loop (1/60s substeps with an accumulator) — survives hidden-tab timer throttling and frame hitches. Never use unclamped `lerp(a,b,dt*k)` easing; it diverges at large dt.
- All art is procedural canvas 2D; all audio is synthesized WebAudio (no asset files).
- CrazyGames SDK v3 is integrated with guarded calls (`sdkStart/sdkStop/sdkHappy`); `happytime()` is rate-limited to 15s because the SDK throttles and logs errors otherwise.
- PEGI-12 safe, instant play (1 click), well under CrazyGames' 50MB / 1500-file Basic Launch caps.

## Debug hooks (for testing)

Open the console and use `window.__sk`:

| Hook | What it does |
|---|---|
| `__sk.info()` | Current state snapshot (mode, score, hp, round…) |
| `__sk.start()` / `__sk.royale()` | Start a solo run / royale from title or game-over |
| `__sk.god(true)` | Auto-save every shot |
| `__sk.autopick(true)` | Auto-advance mutation picks / relim screens / penalty kicks |
| `__sk.step(seconds)` | Deterministically advance the sim (works in hidden tabs) |
| `__sk.speed(x)` | Real-time speed multiplier |
| `__sk.hurt()` | Set HP to 1 |

Full verification recipe: `__sk.god(true); __sk.autopick(true); __sk.start(); __sk.step(60)` should reach match ~5 with a big streak and zero console errors.

## Shipping

See [ROADMAP.md](ROADMAP.md) for the launch plan and post-launch stages.
