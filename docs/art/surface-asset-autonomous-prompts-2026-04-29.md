# Surface Asset Autonomous Prompt Manifest - 2026-04-29

Generated for the GemDuel runtime-replacement candidate library. This manifest was written before Image Gen delegation, following `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md` and `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`.

## Source Of Truth

- `AGENTS.md`
- `docs/guides/frontend-layout-guide.md`
- `apps/desktop/public/assets/surfaces/README.md`
- `apps/desktop/src/app/shell/surfaceArtwork.ts`
- `apps/desktop/src/app/shell/playerZoneSurfaceStyles.ts`
- `apps/desktop/src/app/shell/surfaceTheme.ts`
- `apps/desktop/src/app/shell/surfacePreviewQuery.ts`
- `apps/desktop/src/app/visual-lab/surfaceLabCatalog.ts`
- `apps/desktop/vite.config.ts`
- `packages/ui/src/components/card/cardSizing.ts`
- `packages/ui/src/components/Card.tsx`
- `packages/ui/src/components/market/MarketDeckBack.tsx`
- `docs/art/surface-anime-asset-library-2026-04-26.md`
- `docs/art/surface-anime-gem-panel-refined-prompts-2026-04-26.md`
- `docs/art/surface-anime-player-zone-refined-2026-04-26.md`

## Global Constraints

- Runtime replacement candidates use exactly `crystal-anime`, `royal-luxury`, `dark-arcane`, and `clean-boardgame`.
- Do not overwrite `apps/desktop/public/assets/surfaces/**`; archive only under `assets/art-library/surface-autonomous-candidates/2026-04-29/`.
- Use `player-zone-p1.png` and `player-zone-p2.png` as the primary PlayerZone contract; do not treat `player-zone.png` as a main output.
- Gem panel target is `1254x1254`; record future calibration as normalized 6x6 grid-line arrays.
- Card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and must remain usable when downsampled into `FEATURED_CARD_SIZE` `150x200`.
- React renders all labels, counts, icons, levels, gems, controls, hover rings, selection states, and gameplay affordances.

## Prompt Records

| Prompt ID                                             | Batch                           | Date         | Slot                  | Style             | Variant |      Target | Planned Archive Path                                                                                                        |
| ----------------------------------------------------- | ------------------------------- | ------------ | --------------------- | ----------------- | ------- | ----------: | --------------------------------------------------------------------------------------------------------------------------- |
| `SA-2026-04-29-crystal-anime-shell-background-a`      | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `crystal-anime`   | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/crystal-anime/shell-background-a.png`         |
| `SA-2026-04-29-crystal-anime-shell-background-b`      | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `crystal-anime`   | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/crystal-anime/shell-background-b.png`         |
| `SA-2026-04-29-crystal-anime-topbar-a`                | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `crystal-anime`   | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/crystal-anime/topbar-a.png`                             |
| `SA-2026-04-29-crystal-anime-topbar-b`                | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `crystal-anime`   | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/crystal-anime/topbar-b.png`                             |
| `SA-2026-04-29-crystal-anime-player-zone-p1-a`        | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `crystal-anime`   | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/crystal-anime/player-zone-p1-a.png`             |
| `SA-2026-04-29-crystal-anime-player-zone-p1-b`        | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `crystal-anime`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/crystal-anime/player-zone-p1-b.png`             |
| `SA-2026-04-29-crystal-anime-player-zone-p2-a`        | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `crystal-anime`   | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/crystal-anime/player-zone-p2-a.png`             |
| `SA-2026-04-29-crystal-anime-player-zone-p2-b`        | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `crystal-anime`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/crystal-anime/player-zone-p2-b.png`             |
| `SA-2026-04-29-crystal-anime-gem-panel-a`             | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `crystal-anime`   | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/crystal-anime/gem-panel-a.png`                       |
| `SA-2026-04-29-crystal-anime-gem-panel-b`             | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `crystal-anime`   | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/crystal-anime/gem-panel-b.png`                       |
| `SA-2026-04-29-crystal-anime-market-card-back-l1-a`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `crystal-anime`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/crystal-anime/market-card-back-l1-a.png`   |
| `SA-2026-04-29-crystal-anime-market-card-back-l1-b`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `crystal-anime`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/crystal-anime/market-card-back-l1-b.png`   |
| `SA-2026-04-29-crystal-anime-market-card-back-l2-a`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `crystal-anime`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/crystal-anime/market-card-back-l2-a.png`   |
| `SA-2026-04-29-crystal-anime-market-card-back-l2-b`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `crystal-anime`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/crystal-anime/market-card-back-l2-b.png`   |
| `SA-2026-04-29-crystal-anime-market-card-back-l3-a`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `crystal-anime`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/crystal-anime/market-card-back-l3-a.png`   |
| `SA-2026-04-29-crystal-anime-market-card-back-l3-b`   | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `crystal-anime`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/crystal-anime/market-card-back-l3-b.png`   |
| `SA-2026-04-29-crystal-anime-royal-card-back-a`       | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `crystal-anime`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/crystal-anime/royal-card-back-a.png`           |
| `SA-2026-04-29-crystal-anime-royal-card-back-b`       | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `crystal-anime`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/crystal-anime/royal-card-back-b.png`           |
| `SA-2026-04-29-royal-luxury-shell-background-a`       | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `royal-luxury`    | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/royal-luxury/shell-background-a.png`          |
| `SA-2026-04-29-royal-luxury-shell-background-b`       | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `royal-luxury`    | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/royal-luxury/shell-background-b.png`          |
| `SA-2026-04-29-royal-luxury-topbar-a`                 | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `royal-luxury`    | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/royal-luxury/topbar-a.png`                              |
| `SA-2026-04-29-royal-luxury-topbar-b`                 | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `royal-luxury`    | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/royal-luxury/topbar-b.png`                              |
| `SA-2026-04-29-royal-luxury-player-zone-p1-a`         | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `royal-luxury`    | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/royal-luxury/player-zone-p1-a.png`              |
| `SA-2026-04-29-royal-luxury-player-zone-p1-b`         | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `royal-luxury`    | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/royal-luxury/player-zone-p1-b.png`              |
| `SA-2026-04-29-royal-luxury-player-zone-p2-a`         | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `royal-luxury`    | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/royal-luxury/player-zone-p2-a.png`              |
| `SA-2026-04-29-royal-luxury-player-zone-p2-b`         | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `royal-luxury`    | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/royal-luxury/player-zone-p2-b.png`              |
| `SA-2026-04-29-royal-luxury-gem-panel-a`              | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `royal-luxury`    | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/royal-luxury/gem-panel-a.png`                        |
| `SA-2026-04-29-royal-luxury-gem-panel-b`              | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `royal-luxury`    | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/royal-luxury/gem-panel-b.png`                        |
| `SA-2026-04-29-royal-luxury-market-card-back-l1-a`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `royal-luxury`    | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/royal-luxury/market-card-back-l1-a.png`    |
| `SA-2026-04-29-royal-luxury-market-card-back-l1-b`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `royal-luxury`    | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/royal-luxury/market-card-back-l1-b.png`    |
| `SA-2026-04-29-royal-luxury-market-card-back-l2-a`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `royal-luxury`    | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/royal-luxury/market-card-back-l2-a.png`    |
| `SA-2026-04-29-royal-luxury-market-card-back-l2-b`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `royal-luxury`    | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/royal-luxury/market-card-back-l2-b.png`    |
| `SA-2026-04-29-royal-luxury-market-card-back-l3-a`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `royal-luxury`    | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/royal-luxury/market-card-back-l3-a.png`    |
| `SA-2026-04-29-royal-luxury-market-card-back-l3-b`    | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `royal-luxury`    | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/royal-luxury/market-card-back-l3-b.png`    |
| `SA-2026-04-29-royal-luxury-royal-card-back-a`        | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `royal-luxury`    | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/royal-luxury/royal-card-back-a.png`            |
| `SA-2026-04-29-royal-luxury-royal-card-back-b`        | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `royal-luxury`    | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/royal-luxury/royal-card-back-b.png`            |
| `SA-2026-04-29-dark-arcane-shell-background-a`        | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `dark-arcane`     | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/dark-arcane/shell-background-a.png`           |
| `SA-2026-04-29-dark-arcane-shell-background-b`        | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `dark-arcane`     | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/dark-arcane/shell-background-b.png`           |
| `SA-2026-04-29-dark-arcane-topbar-a`                  | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `dark-arcane`     | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/dark-arcane/topbar-a.png`                               |
| `SA-2026-04-29-dark-arcane-topbar-b`                  | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `dark-arcane`     | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/dark-arcane/topbar-b.png`                               |
| `SA-2026-04-29-dark-arcane-player-zone-p1-a`          | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `dark-arcane`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/dark-arcane/player-zone-p1-a.png`               |
| `SA-2026-04-29-dark-arcane-player-zone-p1-b`          | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `dark-arcane`     | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/dark-arcane/player-zone-p1-b.png`               |
| `SA-2026-04-29-dark-arcane-player-zone-p2-a`          | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `dark-arcane`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/dark-arcane/player-zone-p2-a.png`               |
| `SA-2026-04-29-dark-arcane-player-zone-p2-b`          | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `dark-arcane`     | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/dark-arcane/player-zone-p2-b.png`               |
| `SA-2026-04-29-dark-arcane-gem-panel-a`               | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `dark-arcane`     | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/dark-arcane/gem-panel-a.png`                         |
| `SA-2026-04-29-dark-arcane-gem-panel-b`               | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `dark-arcane`     | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/dark-arcane/gem-panel-b.png`                         |
| `SA-2026-04-29-dark-arcane-market-card-back-l1-a`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `dark-arcane`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/dark-arcane/market-card-back-l1-a.png`     |
| `SA-2026-04-29-dark-arcane-market-card-back-l1-b`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `dark-arcane`     | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/dark-arcane/market-card-back-l1-b.png`     |
| `SA-2026-04-29-dark-arcane-market-card-back-l2-a`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `dark-arcane`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/dark-arcane/market-card-back-l2-a.png`     |
| `SA-2026-04-29-dark-arcane-market-card-back-l2-b`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `dark-arcane`     | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/dark-arcane/market-card-back-l2-b.png`     |
| `SA-2026-04-29-dark-arcane-market-card-back-l3-a`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `dark-arcane`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/dark-arcane/market-card-back-l3-a.png`     |
| `SA-2026-04-29-dark-arcane-market-card-back-l3-b`     | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `dark-arcane`     | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/dark-arcane/market-card-back-l3-b.png`     |
| `SA-2026-04-29-dark-arcane-royal-card-back-a`         | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `dark-arcane`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/dark-arcane/royal-card-back-a.png`             |
| `SA-2026-04-29-dark-arcane-royal-card-back-b`         | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `dark-arcane`     | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/dark-arcane/royal-card-back-b.png`             |
| `SA-2026-04-29-clean-boardgame-shell-background-a`    | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `clean-boardgame` | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/clean-boardgame/shell-background-a.png`       |
| `SA-2026-04-29-clean-boardgame-shell-background-b`    | `surface-autonomous-candidates` | `2026-04-29` | `shell-background`    | `clean-boardgame` | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/clean-boardgame/shell-background-b.png`       |
| `SA-2026-04-29-clean-boardgame-topbar-a`              | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `clean-boardgame` | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/clean-boardgame/topbar-a.png`                           |
| `SA-2026-04-29-clean-boardgame-topbar-b`              | `surface-autonomous-candidates` | `2026-04-29` | `topbar`              | `clean-boardgame` | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/clean-boardgame/topbar-b.png`                           |
| `SA-2026-04-29-clean-boardgame-player-zone-p1-a`      | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `clean-boardgame` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/clean-boardgame/player-zone-p1-a.png`           |
| `SA-2026-04-29-clean-boardgame-player-zone-p1-b`      | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p1`      | `clean-boardgame` | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/clean-boardgame/player-zone-p1-b.png`           |
| `SA-2026-04-29-clean-boardgame-player-zone-p2-a`      | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `clean-boardgame` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/clean-boardgame/player-zone-p2-a.png`           |
| `SA-2026-04-29-clean-boardgame-player-zone-p2-b`      | `surface-autonomous-candidates` | `2026-04-29` | `player-zone-p2`      | `clean-boardgame` | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/clean-boardgame/player-zone-p2-b.png`           |
| `SA-2026-04-29-clean-boardgame-gem-panel-a`           | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `clean-boardgame` | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/clean-boardgame/gem-panel-a.png`                     |
| `SA-2026-04-29-clean-boardgame-gem-panel-b`           | `surface-autonomous-candidates` | `2026-04-29` | `gem-panel`           | `clean-boardgame` | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/clean-boardgame/gem-panel-b.png`                     |
| `SA-2026-04-29-clean-boardgame-market-card-back-l1-a` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `clean-boardgame` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/clean-boardgame/market-card-back-l1-a.png` |
| `SA-2026-04-29-clean-boardgame-market-card-back-l1-b` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l1` | `clean-boardgame` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/clean-boardgame/market-card-back-l1-b.png` |
| `SA-2026-04-29-clean-boardgame-market-card-back-l2-a` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `clean-boardgame` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/clean-boardgame/market-card-back-l2-a.png` |
| `SA-2026-04-29-clean-boardgame-market-card-back-l2-b` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l2` | `clean-boardgame` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/clean-boardgame/market-card-back-l2-b.png` |
| `SA-2026-04-29-clean-boardgame-market-card-back-l3-a` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `clean-boardgame` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/clean-boardgame/market-card-back-l3-a.png` |
| `SA-2026-04-29-clean-boardgame-market-card-back-l3-b` | `surface-autonomous-candidates` | `2026-04-29` | `market-card-back-l3` | `clean-boardgame` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/clean-boardgame/market-card-back-l3-b.png` |
| `SA-2026-04-29-clean-boardgame-royal-card-back-a`     | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `clean-boardgame` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/clean-boardgame/royal-card-back-a.png`         |
| `SA-2026-04-29-clean-boardgame-royal-card-back-b`     | `surface-autonomous-candidates` | `2026-04-29` | `royal-card-back`     | `clean-boardgame` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/clean-boardgame/royal-card-back-b.png`         |

## Full Prompts

### Crystal Anime (`crystal-anime`)

#### SA-2026-04-29-crystal-anime-shell-background-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/crystal-anime/shell-background-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-shell-background-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/crystal-anime/shell-background-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-topbar-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/crystal-anime/topbar-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-topbar-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/crystal-anime/topbar-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-player-zone-p1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/crystal-anime/player-zone-p1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-player-zone-p1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/crystal-anime/player-zone-p1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-player-zone-p2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/crystal-anime/player-zone-p2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-player-zone-p2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/crystal-anime/player-zone-p2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-gem-panel-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/crystal-anime/gem-panel-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-gem-panel-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/crystal-anime/gem-panel-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/crystal-anime/market-card-back-l1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/crystal-anime/market-card-back-l1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/crystal-anime/market-card-back-l2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/crystal-anime/market-card-back-l2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l3-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/crystal-anime/market-card-back-l3-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-market-card-back-l3-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/crystal-anime/market-card-back-l3-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-royal-card-back-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `crystal-anime`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/crystal-anime/royal-card-back-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-crystal-anime-royal-card-back-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `crystal-anime`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/crystal-anime/royal-card-back-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `crystal-anime` (Crystal Anime). Style recipe: translucent gemstones, prismatic glass, crisp crystal facets, controlled anime glow, readable dark base, cyan pearl and violet accents with material contrast. Style identity: jewel-like anime energy with polished crystal surfaces and disciplined glow. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### Royal Luxury (`royal-luxury`)

#### SA-2026-04-29-royal-luxury-shell-background-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/royal-luxury/shell-background-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-shell-background-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/royal-luxury/shell-background-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-topbar-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/royal-luxury/topbar-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-topbar-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/royal-luxury/topbar-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-player-zone-p1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/royal-luxury/player-zone-p1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-player-zone-p1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/royal-luxury/player-zone-p1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-player-zone-p2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/royal-luxury/player-zone-p2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-player-zone-p2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/royal-luxury/player-zone-p2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-gem-panel-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/royal-luxury/gem-panel-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-gem-panel-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/royal-luxury/gem-panel-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/royal-luxury/market-card-back-l1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/royal-luxury/market-card-back-l1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/royal-luxury/market-card-back-l2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/royal-luxury/market-card-back-l2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l3-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/royal-luxury/market-card-back-l3-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-market-card-back-l3-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/royal-luxury/market-card-back-l3-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-royal-card-back-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `royal-luxury`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/royal-luxury/royal-card-back-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-royal-luxury-royal-card-back-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `royal-luxury`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/royal-luxury/royal-card-back-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `royal-luxury` (Royal Luxury). Style recipe: deep dark high contrast, burnished gold, palace metalwork, crown and court materials, premium royal tabletop atmosphere, restrained jewel highlights. Style identity: sovereign prestige, court-metal trim, dark polished luxury. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### Dark Arcane (`dark-arcane`)

#### SA-2026-04-29-dark-arcane-shell-background-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/dark-arcane/shell-background-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-shell-background-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/dark-arcane/shell-background-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-topbar-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/dark-arcane/topbar-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-topbar-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/dark-arcane/topbar-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-player-zone-p1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/dark-arcane/player-zone-p1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-player-zone-p1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/dark-arcane/player-zone-p1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-player-zone-p2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/dark-arcane/player-zone-p2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-player-zone-p2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/dark-arcane/player-zone-p2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-gem-panel-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/dark-arcane/gem-panel-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-gem-panel-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/dark-arcane/gem-panel-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/dark-arcane/market-card-back-l1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/dark-arcane/market-card-back-l1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/dark-arcane/market-card-back-l2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/dark-arcane/market-card-back-l2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l3-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/dark-arcane/market-card-back-l3-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-market-card-back-l3-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/dark-arcane/market-card-back-l3-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-royal-card-back-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `dark-arcane`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/dark-arcane/royal-card-back-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-dark-arcane-royal-card-back-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `dark-arcane`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/dark-arcane/royal-card-back-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `dark-arcane` (Dark Arcane). Style recipe: dark magical card table, obsidian stone, restrained non-linguistic sigil geometry, dim jewel glow, no fake writing, violet ember edge light. Style identity: dark magical tabletop, practical low-noise arcane ornament, no readable runes. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### Clean Boardgame (`clean-boardgame`)

#### SA-2026-04-29-clean-boardgame-shell-background-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/clean-boardgame/shell-background-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-shell-background-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive filename: `shell-background-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/shell-background/clean-boardgame/shell-background-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-topbar-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/clean-boardgame/topbar-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-topbar-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive filename: `topbar-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/topbar/clean-boardgame/topbar-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-player-zone-p1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/clean-boardgame/player-zone-p1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-player-zone-p1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p1/clean-boardgame/player-zone-p1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-player-zone-p2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/clean-boardgame/player-zone-p2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-player-zone-p2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive filename: `player-zone-p2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/player-zone-p2/clean-boardgame/player-zone-p2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Side-specific P2 player rail background in the same style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-gem-panel-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/clean-boardgame/gem-panel-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-gem-panel-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive filename: `gem-panel-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/gem-panel/clean-boardgame/gem-panel-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l1-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/clean-boardgame/market-card-back-l1-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l1-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l1-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l1/clean-boardgame/market-card-back-l1-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l2-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/clean-boardgame/market-card-back-l2-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l2-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l2-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l2/clean-boardgame/market-card-back-l2-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l3-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/clean-boardgame/market-card-back-l3-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-market-card-back-l3-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `market-card-back-l3-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/market-card-back-l3/clean-boardgame/market-card-back-l3-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-royal-card-back-a

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `clean-boardgame`
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-a.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/clean-boardgame/royal-card-back-a.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant A should emphasize the primary slot identity and strongest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

#### SA-2026-04-29-clean-boardgame-royal-card-back-b

- Batch: `surface-autonomous-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Style: `clean-boardgame`
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive filename: `royal-card-back-b.png`
- Planned archive path: `assets/art-library/surface-autonomous-candidates/2026-04-29/royal-card-back/clean-boardgame/royal-card-back-b.png`
- Overlay constraints: keep readable space for current React-rendered gameplay chrome; do not bake labels, cards, counters, gems, controls, or selection affordances into the bitmap.
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for GemDuel Surface Style `clean-boardgame` (Clean Boardgame). Style recipe: modern premium board-game tabletop, matte materials, neutral readable surfaces, low noise, restrained brass ivory slate trim. Style identity: production-safe boardgame readability with premium neutral materials. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the style family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```
