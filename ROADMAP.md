# SUPER KEEPER — Ship Plan

Goal: live on CrazyGames **before the World Cup final (~July 19, 2026)** to catch the discovery wave, then grow into real multiplayer if metrics justify it.

## Phase 0 — Build ✅ (done July 3, 2026)

- [x] Core keeper loop: glove tracking, dive commit/cooldown, slow-mo close calls
- [x] Solo roguelike: escalating nations, 10 mutations (5 GIFT / 5 CHAOS + score mult), Penalty Breaks, hearts, clean sheets, grades
- [x] Art pass: floodlit night stadium, living crowd (wave, flags, phone flashes), ball-tracking keeper eyes, golden balls, hit-stop, fireworks, duck
- [x] PENALTY ROYALE: 8-keeper knockout, live leaderboard, eliminations, champion trophy (local rivals)
- [x] DUEL CUP: 1v1 best-of-5 shootout ladder (quarter/semi/final) — defend their shot, then strike back; sudden death; rival taunts. This is the exact loop real netcode drops into later.
- [x] Stage-2 server scaffold in `server/duel-server.js` (Node ws rooms, server-judged saves) — ready to deploy, not used by the shipped build
- [x] CrazyGames SDK v3 wired (gameplayStart/Stop, rate-limited happytime)
- [x] Verified end-to-end via `__sk` debug hooks (solo → game over; royale → champion; duel → cup won incl. sudden death)

## Phase 1 — SHIP THIS WEEK 🚢

The remaining work is **not code**:

- [ ] **Playtest on a real mouse + trackpad + touch.** Tune the 3 feel dials (all single constants in `index.html`): glove speed `1500`, dive duration `.22`/cooldown `.8`, base flight time `.62`.
- [ ] **CrazyGames developer account** — sign up at developer.crazygames.com
- [ ] **Thumbnail/cover art** — their top discovery lever. Needs: 16:9 cover (min 1920×1080), 1:1 icon (512×512). Concept: the keeper mid-dive, golden ball just off the glove, floodlights behind.
- [ ] **Store copy** — title, short pitch ("Save everything. 8-keeper Royale. Pick your chaos."), tags: goalkeeper, football, soccer, arcade, roguelike, io
- [ ] **Submit for Basic Launch** — review takes days; submit EARLY in the week
- [ ] Watch the Basic Launch dashboards: avg playtime, conversion-to-gameplay, D1 retention decide Full Launch (= real revenue)

## Phase 2 — Post-launch tuning (weeks 1–4)

- [ ] Difficulty curve from real metrics (where do players die/quit?)
- [ ] Rewarded ads via SDK: "watch ad → +1 heart" on death, "2x score" on clean sheet — this is the main revenue lever beyond banners
- [ ] More mutations (cheap content: each is ~5 lines)
- [ ] Daily challenge: seeded shot sequence, everyone faces the same day (retention driver)
- [ ] Royale polish: rival "form" streaks, revenge rivals that reappear

## Phase 3 — Real multiplayer (only if Phase 2 metrics are strong)

- [x] 1v1 DUEL gameplay loop — shipped as DUEL CUP vs AI rivals; netcode swaps in behind the same state machine
- [ ] Deploy `server/duel-server.js` to Fly/Railway (~$0–7/mo, needs your account), point client at the WSS URL, replace `duelRival()` AI with socket messages
- [ ] CrazyGames SDK **invite links** so friends join a room directly
- [ ] Swap Royale bots for real players when concurrent traffic supports matchmaking; keep bots as backfill (players never see an empty lobby)
- [ ] Teams/2v2 only after duels prove out

## Hard constraints (do not violate)

- No real brands/likenesses: no FIFA, no real nations/players — fake nations only (IP rejection risk)
- PEGI-12: no blood, no gambling mechanics with real money
- Initial download ≤ 50MB, ≤ 1500 files (we're at ~40KB / 3 files 😎)
- New users must reach gameplay in ≤ 1 click
