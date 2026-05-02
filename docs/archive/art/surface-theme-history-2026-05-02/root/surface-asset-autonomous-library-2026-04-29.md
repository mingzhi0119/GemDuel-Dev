# Surface Asset Autonomous Library - 2026-04-29

## Summary

- Generation method: four worker subagents used built-in Codex Image Gen only; no CLI/API fallback was used.
- Prompt manifest: `docs/art/surface-asset-autonomous-prompts-2026-04-29.md`.
- Candidate archive root: `assets/art-library/surface-autonomous-candidates/2026-04-29/`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count: 72 archived PNGs; target was 72.
- Runtime assets under `apps/desktop/public/assets/surfaces/**` were not overwritten.
- Validation status: `pass`.

## Candidate Count By Style And Slot

| Style             | shell-background | topbar | player-zone-p1 | player-zone-p2 | gem-panel | market-card-back-l1 | market-card-back-l2 | market-card-back-l3 | royal-card-back | Total |
| ----------------- | ---------------: | -----: | -------------: | -------------: | --------: | ------------------: | ------------------: | ------------------: | --------------: | ----: |
| `crystal-anime`   |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `royal-luxury`    |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `dark-arcane`     |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `clean-boardgame` |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |

## Top Picks By Slot

| Slot                  | Top pick                   | Backup                       | Notes                                                                                   |
| --------------------- | -------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| `shell-background`    | `crystal-anime A` (8.3/10) | `crystal-anime B` (8.3/10)   | Shell background candidate; verify subdued center behind the gameplay stage.            |
| `topbar`              | `crystal-anime A` (8.1/10) | `crystal-anime B` (8.0/10)   | TopBar skin candidate; verify React score/crown/turn groups at 25%, 50%, and 75% width. |
| `player-zone-p1`      | `royal-luxury A` (8.1/10)  | `crystal-anime A` (8.0/10)   | P1 PlayerZone rail substrate; verify no baked slots or card-frame silhouettes.          |
| `player-zone-p2`      | `royal-luxury A` (8.1/10)  | `crystal-anime A` (8.0/10)   | P2 PlayerZone rail substrate; verify coherence with P1 and no baked gameplay UI.        |
| `gem-panel`           | `royal-luxury A` (8.5/10)  | `clean-boardgame A` (8.5/10) | Gem panel candidate; verify regular empty 5x5 wells and future grid calibration.        |
| `market-card-back-l1` | `royal-luxury A` (8.3/10)  | `crystal-anime A` (8.2/10)   | L1 market card-back candidate; verify lowest-tier read at 150x200 display size.         |
| `market-card-back-l2` | `royal-luxury B` (8.4/10)  | `royal-luxury A` (8.3/10)    | L2 market card-back candidate; verify mid-tier escalation without symbols.              |
| `market-card-back-l3` | `crystal-anime A` (8.4/10) | `royal-luxury A` (8.4/10)    | L3 market card-back candidate; verify highest-tier richness without text.               |
| `royal-card-back`     | `royal-luxury A` (8.6/10)  | `royal-luxury B` (8.5/10)    | Royal card-back candidate; verify stronger sovereign identity than market backs.        |

## Gem Panel Normalized Grid-Line Evidence

These candidates use intended regular 6x6 normalized calibration lines for future visual verification, not the old absolute lattice as a universal rule. Human promotion should re-measure winners in Visual Lab before code integration.

```json
{
    "x": [0.1, 0.26, 0.42, 0.58, 0.74, 0.9],
    "y": [0.1, 0.26, 0.42, 0.58, 0.74, 0.9]
}
```

## Watchlist / Rejected Notes

| Candidate                                             | Reason                                                                                                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SA-2026-04-29-crystal-anime-shell-background-a`      | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-crystal-anime-shell-background-b`      | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-crystal-anime-topbar-a`                | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-crystal-anime-topbar-b`                | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-crystal-anime-player-zone-p1-a`        | Normalization applied: center-cropped/resized from 1907x825 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-crystal-anime-player-zone-p1-b`        | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-crystal-anime-player-zone-p2-a`        | Normalization applied: center-cropped/resized from 2087x753 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-crystal-anime-player-zone-p2-b`        | Normalization applied: center-cropped/resized from 2087x753 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-crystal-anime-market-card-back-l1-a`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-market-card-back-l1-b`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-market-card-back-l2-a`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-market-card-back-l2-b`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-market-card-back-l3-b`   | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-royal-card-back-a`       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-royal-card-back-b`       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-shell-background-a`       | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-royal-luxury-shell-background-b`       | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-royal-luxury-topbar-a`                 | Normalization applied: center-cropped/resized from 1295x1214 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                   |
| `SA-2026-04-29-royal-luxury-topbar-b`                 | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-royal-luxury-player-zone-p1-a`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-royal-luxury-player-zone-p1-b`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-royal-luxury-player-zone-p2-a`         | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-royal-luxury-player-zone-p2-b`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-royal-luxury-market-card-back-l1-a`    | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-market-card-back-l1-b`    | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-market-card-back-l2-a`    | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-market-card-back-l3-a`    | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-market-card-back-l3-b`    | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-royal-card-back-a`        | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-royal-luxury-royal-card-back-b`        | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-shell-background-a`        | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-dark-arcane-shell-background-b`        | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-dark-arcane-topbar-a`                  | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-dark-arcane-topbar-b`                  | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-dark-arcane-player-zone-p1-a`          | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-dark-arcane-player-zone-p1-b`          | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-dark-arcane-player-zone-p2-a`          | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-dark-arcane-player-zone-p2-b`          | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-dark-arcane-market-card-back-l1-a`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-market-card-back-l1-b`     | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-market-card-back-l2-b`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-market-card-back-l3-a`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-royal-card-back-a`         | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-dark-arcane-royal-card-back-b`         | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-clean-boardgame-shell-background-a`    | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-clean-boardgame-shell-background-b`    | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                       |
| `SA-2026-04-29-clean-boardgame-topbar-a`              | Normalization applied: center-cropped/resized from 1294x1216 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                   |
| `SA-2026-04-29-clean-boardgame-topbar-b`              | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                    |
| `SA-2026-04-29-clean-boardgame-player-zone-p1-a`      | Normalization applied: center-cropped/resized from 2087x753 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-clean-boardgame-player-zone-p1-b`      | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-clean-boardgame-player-zone-p2-a`      | Normalization applied: center-cropped/resized from 2087x753 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-clean-boardgame-player-zone-p2-b`      | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for any generated placeholder rectangles resembling card slots.   |
| `SA-2026-04-29-clean-boardgame-market-card-back-l1-b` | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-clean-boardgame-market-card-back-l2-b` | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-clean-boardgame-market-card-back-l3-a` | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-clean-boardgame-market-card-back-l3-b` | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-clean-boardgame-royal-card-back-a`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts. |
| `SA-2026-04-29-crystal-anime-gem-panel-a`             | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-crystal-anime-gem-panel-b`             | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-royal-luxury-gem-panel-a`              | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-royal-luxury-gem-panel-b`              | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-dark-arcane-gem-panel-a`               | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-dark-arcane-gem-panel-b`               | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-clean-boardgame-gem-panel-a`           | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |
| `SA-2026-04-29-clean-boardgame-gem-panel-b`           | Grid lines are intended normalized calibration evidence; verify cell wells in Visual Lab before runtime promotion.                                                              |

## Candidate Index

| Slot | Style | Variant | Prompt ID | Source path | Archive path | Dimensions | Score | Recommended use | Risk |
| ---- | ----- | ------- | --------- | ----------- | ------------ | ---------- | ----: | --------------- | ---- |

## Validation Results

- Archive PNG count: `72` / `72`.
- Preview manifest parse: `pass`.
- Exact dimension validation: `pass`.
- Source path recording: `pass`.
- Archive path boundary: `pass`, all archive paths are under `assets/art-library/`.
- Contact sheets: `assets/art-library/surface-autonomous-candidates/2026-04-29/contact-sheets/`.
- Errors: none.

## Git Status Summary

`git status --short` after validation:

```text
 M docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md
?? docs/art/surface-asset-autonomous-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-prompts-2026-04-29.md
```

Archive tracking note: `assets/art-library/` is ignored by `.gitignore:40`, so the local candidate archive and Visual Lab manifest exist on disk but do not appear in normal `git status --short`.

`git status --short --ignored=matching assets/art-library/surface-autonomous-candidates/2026-04-29`:

```text
!! assets/art-library/
```
