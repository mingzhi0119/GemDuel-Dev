# GemDuel Visual Lab Character Theme Library - 2026-05-01T083328Z

- Source of truth: `docs/art/Asset_Art_Gen_0501.md`
- Prompt manifest: `docs/art/surface-character-theme-prompts-2026-05-01T083328Z.md`
- Archive root: `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/`
- Preview manifest: `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/contact-sheets/preview-manifest.json`
- Runtime policy: candidate-only; no runtime asset overwrite; no finalize; no commit or push.
- Main process policy: no direct image generation; workers generated sources with Image Gen, main copied/normalized/scored only.

## Summary

- Planned prompts: 96
- Archived PNG candidates: 96
- Complete style/variant sets: 12/12
- Target-dimension archives: 60
- Dimension-watch archives: 36
- Normalization counts: `copied-exact` 18, `copied-raw` 48, `minor-card-edge-normalized` 30
- Review status counts: `accepted-candidate` 49, `watch` 47

## Complete Sets

| Style            | Variant | Complete | Target-dimension slots | Notes                                                             |
| ---------------- | ------: | -------: | ---------------------: | ----------------------------------------------------------------- |
| `genshin-furina` |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `genshin-furina` |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `genshin-kokomi` |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `genshin-kokomi` |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `genshin-navia`  |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `genshin-navia`  |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-castorice`  |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-castorice`  |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-firefly`    |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-firefly`    |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-robin`      |     `A` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |
| `hsr-robin`      |     `B` |   `true` |                    5/8 | usable candidate set; dimension watch likely on shell/player-zone |

## Candidate Scorecard

| Prompt ID                                                         | Slot                  | Style            | Variant | Source dims | Archive dims | Normalization                | Score | Status               | Risk / watch notes                                                                                                                             |
| ----------------------------------------------------------------- | --------------------- | ---------------- | ------: | ----------: | -----------: | ---------------------------- | ----: | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-shell-background-A`     | `shell-background`    | `genshin-navia`  |     `A` |  `1918x820` |   `1918x820` | `copied-raw`                 |   7.0 | `watch`              | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, not exact 3840x1640              |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-shell-background-B`     | `shell-background`    | `genshin-navia`  |     `B` |  `1919x820` |   `1919x820` | `copied-raw`                 |   7.0 | `watch`              | archived 1919x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, not exact 3840x1640              |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p1-A`       | `player-zone-p1`      | `genshin-navia`  |     `A` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p1-B`       | `player-zone-p1`      | `genshin-navia`  |     `B` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p2-A`       | `player-zone-p2`      | `genshin-navia`  |     `A` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p2-B`       | `player-zone-p2`      | `genshin-navia`  |     `B` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-gem-panel-A`            | `gem-panel`           | `genshin-navia`  |     `A` | `1254x1254` |  `1254x1254` | `copied-raw`                 |   8.2 | `accepted-candidate` | looks compliant; ornate grid seams                                                                                                             |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-gem-panel-B`            | `gem-panel`           | `genshin-navia`  |     `B` | `1254x1254` |  `1254x1254` | `copied-raw`                 |   8.2 | `accepted-candidate` | looks compliant; stronger border density                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l1-A`  | `market-card-back-l1` | `genshin-navia`  |     `A` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | looks compliant                                                                                                                                |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l1-B`  | `market-card-back-l1` | `genshin-navia`  |     `B` | `1085x1450` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | slight dimension drift; no hard visual failure                                                                                                 |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l2-A`  | `market-card-back-l2` | `genshin-navia`  |     `A` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | slight dimension drift; no hard visual failure                                                                                                 |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l2-B`  | `market-card-back-l2` | `genshin-navia`  |     `B` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | looks compliant                                                                                                                                |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l3-A`  | `market-card-back-l3` | `genshin-navia`  |     `A` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | looks compliant                                                                                                                                |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-market-card-back-l3-B`  | `market-card-back-l3` | `genshin-navia`  |     `B` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | looks compliant                                                                                                                                |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-royal-card-back-A`      | `royal-card-back`     | `genshin-navia`  |     `A` | `1085x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | slight dimension drift; no hard visual failure                                                                                                 |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-royal-card-back-B`      | `royal-card-back`     | `genshin-navia`  |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | slight dimension drift; no hard visual failure                                                                                                 |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-shell-background-A`    | `shell-background`    | `genshin-kokomi` |     `A` |  `1918x820` |   `1918x820` | `copied-raw`                 |   7.0 | `watch`              | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; wide aspect close to target ratio; not target pixel size |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-player-zone-p1-A`      | `player-zone-p1`      | `genshin-kokomi` |     `A` |  `1870x841` |   `1870x841` | `copied-raw`                 |   6.2 | `watch`              | archived 1870x841, target 1920x520; rail aspect mismatch; raw archive only; too tall for 1920x520 rail                                         |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-player-zone-p2-A`      | `player-zone-p2`      | `genshin-kokomi` |     `A` |  `1705x923` |   `1705x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1705x923, target 1920x520; rail aspect mismatch; raw archive only; too tall for 1920x520 rail                                         |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-gem-panel-A`           | `gem-panel`           | `genshin-kokomi` |     `A` | `1254x1254` |  `1254x1254` | `copied-raw`                 |   7.0 | `watch`              | retry after glyph/symbol risk                                                                                                                  |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l1-A` | `market-card-back-l1` | `genshin-kokomi` |     `A` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | target dimensions                                                                                                                              |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l2-A` | `market-card-back-l2` | `genshin-kokomi` |     `A` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | target dimensions                                                                                                                              |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l3-A` | `market-card-back-l3` | `genshin-kokomi` |     `A` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   7.0 | `watch`              | 1px height over target; watch central emblem                                                                                                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-royal-card-back-A`     | `royal-card-back`     | `genshin-kokomi` |     `A` | `1085x1449` |  `1086x1448` | `minor-card-edge-normalized` |   7.0 | `watch`              | slight width/height mismatch                                                                                                                   |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-shell-background-B`     | `shell-background`    | `hsr-castorice`  |     `B` |  `1918x820` |   `1918x820` | `copied-raw`                 |   7.0 | `watch`              | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; actual size differs from 3840x1640 target                |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-player-zone-p1-B`       | `player-zone-p1`      | `hsr-castorice`  |     `B` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; actual size/aspect differs from 1920x520 target                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-player-zone-p2-B`       | `player-zone-p2`      | `hsr-castorice`  |     `B` |  `1703x923` |   `1703x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1703x923, target 1920x520; rail aspect mismatch; raw archive only; actual size/aspect differs from 1920x520 target                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-gem-panel-B`            | `gem-panel`           | `hsr-castorice`  |     `B` | `1254x1254` |  `1254x1254` | `copied-raw`                 |   7.0 | `watch`              | watch seam/grid strength                                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-market-card-back-l1-B`  | `market-card-back-l1` | `hsr-castorice`  |     `B` | `1086x1448` |  `1086x1448` | `copied-exact`               |   8.2 | `accepted-candidate` | target dimensions                                                                                                                              |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-market-card-back-l2-B`  | `market-card-back-l2` | `hsr-castorice`  |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | 1px height drift                                                                                                                               |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-market-card-back-l3-B`  | `market-card-back-l3` | `hsr-castorice`  |     `B` | `1085x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | minor width/height drift                                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-royal-card-back-B`      | `royal-card-back`     | `hsr-castorice`  |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | 1px height drift                                                                                                                               |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-shell-background-B`       | `shell-background`    | `hsr-firefly`    |     `B` |  `1919x820` |   `1919x820` | `copied-raw`                 |   7.0 | `watch`              | archived 1919x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, half-size-ish output             |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-player-zone-p1-B`         | `player-zone-p1`      | `hsr-firefly`    |     `B` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; severe aspect mismatch for 1920x520 rail                           |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-player-zone-p2-B`         | `player-zone-p2`      | `hsr-firefly`    |     `B` |  `1704x923` |   `1704x923` | `copied-raw`                 |   6.2 | `watch`              | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; severe aspect mismatch for 1920x520 rail                           |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-gem-panel-B`              | `gem-panel`           | `hsr-firefly`    |     `B` | `1254x1254` |  `1254x1254` | `copied-raw`                 |   7.0 | `watch`              | watch strong armor-eye read                                                                                                                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-market-card-back-l1-B`    | `market-card-back-l1` | `hsr-firefly`    |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   7.0 | `watch`              | 1px height over; central crest mask-like                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-market-card-back-l2-B`    | `market-card-back-l2` | `hsr-firefly`    |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | 1px height over target                                                                                                                         |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-market-card-back-l3-B`    | `market-card-back-l3` | `hsr-firefly`    |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   7.0 | `watch`              | retry after paired eye-like shapes; 1px height over                                                                                            |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-royal-card-back-B`        | `royal-card-back`     | `hsr-firefly`    |     `B` | `1086x1449` |  `1086x1448` | `minor-card-edge-normalized` |   8.2 | `accepted-candidate` | 1px height over; central prestige may read armor-like                                                                                          |

## Strongest Immediate Candidates

- `SA-CHAR-2026-05-01T083328Z-genshin-furina-gem-panel-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/gem-panel/genshin-furina/A/gem-panel.png` (1254x1254, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-gem-panel-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/gem-panel/genshin-furina/B/gem-panel.png` (1254x1254, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l1-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l1/genshin-furina/A/market-card-back-l1.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l1-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l1/genshin-furina/B/market-card-back-l1.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l2-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l2/genshin-furina/A/market-card-back-l2.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l2-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l2/genshin-furina/B/market-card-back-l2.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l3-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l3/genshin-furina/A/market-card-back-l3.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-market-card-back-l3-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l3/genshin-furina/B/market-card-back-l3.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-royal-card-back-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/royal-card-back/genshin-furina/A/royal-card-back.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-furina-royal-card-back-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/royal-card-back/genshin-furina/B/royal-card-back.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l1-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l1/genshin-kokomi/A/market-card-back-l1.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l1-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l1/genshin-kokomi/B/market-card-back-l1.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l2-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l2/genshin-kokomi/A/market-card-back-l2.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l2-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l2/genshin-kokomi/B/market-card-back-l2.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l3-B` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/market-card-back-l3/genshin-kokomi/B/market-card-back-l3.png` (1086x1448, score 8.2)
- `SA-CHAR-2026-05-01T083328Z-genshin-navia-gem-panel-A` -> `assets/art-library/surface-autonomous-character-theme-candidates/2026-05-01T083328Z/gem-panel/genshin-navia/A/gem-panel.png` (1254x1254, score 8.2)

## Reject / Watchlist Summary

- Shell backgrounds are archived raw when generated below target resolution; promote only after review/upscale/regeneration.
- PlayerZone candidates still frequently miss the 1920x520 rail ratio; raw archive only, watch-only for Visual Lab comparison.
- Card backs with 1-2px edge mismatch were normalized to `1086x1448` when technically safe.
- Firefly abstract armor/eye-like motif risk and Kokomi/Robin/Furina symbol-like motif risk are retained in notes for human review.
- Restricted slots were worker-screened for no faces, bodies, portraits, hands, eyes, or silhouettes; final promotion still needs human visual review.

| Prompt ID                                                         | Status  | Reason                                                                                                                                         |
| ----------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-shell-background-A`     | `watch` | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, not exact 3840x1640              |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-shell-background-B`     | `watch` | archived 1919x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, not exact 3840x1640              |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p1-A`       | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p1-B`       | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p2-A`       | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-navia-player-zone-p2-B`       | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; dimension/aspect watch: not 1920x520 rail canvas                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-shell-background-A`    | `watch` | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; wide aspect close to target ratio; not target pixel size |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-player-zone-p1-A`      | `watch` | archived 1870x841, target 1920x520; rail aspect mismatch; raw archive only; too tall for 1920x520 rail                                         |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-player-zone-p2-A`      | `watch` | archived 1705x923, target 1920x520; rail aspect mismatch; raw archive only; too tall for 1920x520 rail                                         |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-gem-panel-A`           | `watch` | retry after glyph/symbol risk                                                                                                                  |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-market-card-back-l3-A` | `watch` | 1px height over target; watch central emblem                                                                                                   |
| `SA-CHAR-2026-05-01T083328Z-genshin-kokomi-royal-card-back-A`     | `watch` | slight width/height mismatch                                                                                                                   |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-shell-background-B`     | `watch` | archived 1918x820, target 3840x1640; below target shell resolution; raw archive only; actual size differs from 3840x1640 target                |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-player-zone-p1-B`       | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; actual size/aspect differs from 1920x520 target                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-player-zone-p2-B`       | `watch` | archived 1703x923, target 1920x520; rail aspect mismatch; raw archive only; actual size/aspect differs from 1920x520 target                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-castorice-gem-panel-B`            | `watch` | watch seam/grid strength                                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-shell-background-B`       | `watch` | archived 1919x820, target 3840x1640; below target shell resolution; raw archive only; aspect close to target, half-size-ish output             |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-player-zone-p1-B`         | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; severe aspect mismatch for 1920x520 rail                           |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-player-zone-p2-B`         | `watch` | archived 1704x923, target 1920x520; rail aspect mismatch; raw archive only; severe aspect mismatch for 1920x520 rail                           |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-gem-panel-B`              | `watch` | watch strong armor-eye read                                                                                                                    |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-market-card-back-l1-B`    | `watch` | 1px height over; central crest mask-like                                                                                                       |
| `SA-CHAR-2026-05-01T083328Z-hsr-firefly-market-card-back-l3-B`    | `watch` | retry after paired eye-like shapes; 1px height over                                                                                            |

## Source Paths

All source files remain under `$CODEX_HOME/generated_images`; archived candidates are copied under the candidate root. Full source paths are recorded in the preview manifest.

## Validation Notes

- Expected file count: 96 archived PNG candidates plus `contact-sheets/preview-manifest.json`.
- No files were written under `apps/desktop/public/assets/surfaces`.
- No commit or push was performed.
