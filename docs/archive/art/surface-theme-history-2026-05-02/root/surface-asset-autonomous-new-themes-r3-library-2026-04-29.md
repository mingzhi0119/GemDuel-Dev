# Surface Asset Autonomous New Theme R3 Library - 2026-04-29

## Summary

- Generation method: four worker subagents used built-in Codex Image Gen only; no CLI/API fallback was used.
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r3-prompts-2026-04-29.md`.
- Candidate archive root: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count: `72` archived PNGs; target was `72`.
- These are new Theme candidates only; no runtime enum, runtime asset, or public API was changed.

## Candidate Count By Theme And Slot

| Theme                 | shell-background | topbar | player-zone-p1 | player-zone-p2 | gem-panel | market-card-back-l1 | market-card-back-l2 | market-card-back-l3 | royal-card-back | Total |
| --------------------- | ---------------: | -----: | -------------: | -------------: | --------: | ------------------: | ------------------: | ------------------: | --------------: | ----: |
| `sapphire-clockcourt` |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `coral-moonforge`     |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `ivory-rainharbor`    |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |
| `obsidian-goldleaf`   |                2 |      2 |              2 |              2 |         2 |                   2 |                   2 |                   2 |               2 |    18 |

## Top Picks By Slot

| Slot                  | Top pick                       | Backup                           | Notes                                                                                                  |
| --------------------- | ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `shell-background`    | `obsidian-goldleaf A` (8.2/10) | `sapphire-clockcourt A` (8.2/10) | Shell background candidate; verify subdued continuous material behind the gameplay stage.              |
| `topbar`              | `obsidian-goldleaf A` (8.0/10) | `sapphire-clockcourt A` (8.0/10) | TopBar skin candidate; verify React score/crown/turn groups at 25%, 50%, and 75% width.                |
| `player-zone-p1`      | `obsidian-goldleaf A` (8.1/10) | `sapphire-clockcourt A` (8.1/10) | P1 PlayerZone rail substrate; verify no baked slots or card-frame silhouettes.                         |
| `player-zone-p2`      | `obsidian-goldleaf A` (8.1/10) | `sapphire-clockcourt A` (8.1/10) | P2 PlayerZone rail substrate; verify coherence with P1 and no baked gameplay UI.                       |
| `gem-panel`           | `obsidian-goldleaf A` (8.4/10) | `sapphire-clockcourt A` (8.4/10) | Gem panel candidate; verify regular empty 5x5 wells and future grid calibration.                       |
| `market-card-back-l1` | `obsidian-goldleaf A` (8.3/10) | `sapphire-clockcourt A` (8.2/10) | L1 market card-back candidate; verify complete but restrained center ornament at 150x200 display size. |
| `market-card-back-l2` | `coral-moonforge A` (8.3/10)   | `obsidian-goldleaf A` (8.3/10)   | L2 market card-back candidate; verify mid-tier escalation without symbols.                             |
| `market-card-back-l3` | `obsidian-goldleaf A` (8.4/10) | `obsidian-goldleaf B` (8.4/10)   | L3 market card-back candidate; verify highest-tier richness without text.                              |
| `royal-card-back`     | `obsidian-goldleaf A` (8.5/10) | `sapphire-clockcourt A` (8.5/10) | Royal card-back candidate; verify stronger sovereign identity than market backs.                       |

## Gem Panel Intended Grid-Line Evidence

Promotion should re-measure actual winners in Visual Lab before code integration. Intended normalized 6x6 guide lines used for this batch:

```json
{
    "x": [0.1, 0.26, 0.42, 0.58, 0.74, 0.9],
    "y": [0.1, 0.26, 0.42, 0.58, 0.74, 0.9]
}
```

## Watchlist Notes

| Candidate                                                    | Reason                                                                                                                                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SA-R3-2026-04-29-sapphire-clockcourt-shell-background-a`    | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-sapphire-clockcourt-shell-background-b`    | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-sapphire-clockcourt-topbar-a`              | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-sapphire-clockcourt-topbar-b`              | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p1-a`      | Normalization applied: center-cropped/resized from 1705x922 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p1-b`      | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p2-a`      | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p2-b`      | Normalization applied: center-cropped/resized from 1716x917 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-sapphire-clockcourt-gem-panel-a`           | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-sapphire-clockcourt-gem-panel-b`           | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l1-a` | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l1-b` | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l2-a` | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l2-b` | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l3-a` | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l3-b` | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-sapphire-clockcourt-royal-card-back-a`     | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-sapphire-clockcourt-royal-card-back-b`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-shell-background-a`        | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-coral-moonforge-shell-background-b`        | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-coral-moonforge-topbar-a`                  | Normalization applied: center-cropped/resized from 1295x1214 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                        |
| `SA-R3-2026-04-29-coral-moonforge-topbar-b`                  | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-coral-moonforge-player-zone-p1-a`          | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-coral-moonforge-player-zone-p1-b`          | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-coral-moonforge-player-zone-p2-a`          | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-coral-moonforge-player-zone-p2-b`          | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-coral-moonforge-gem-panel-a`               | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-coral-moonforge-gem-panel-b`               | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l1-a`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l1-b`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l2-a`     | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l2-b`     | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l3-a`     | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-market-card-back-l3-b`     | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-royal-card-back-a`         | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-coral-moonforge-royal-card-back-b`         | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-ivory-rainharbor-shell-background-a`       | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-ivory-rainharbor-shell-background-b`       | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-ivory-rainharbor-topbar-a`                 | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-ivory-rainharbor-topbar-b`                 | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-a`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-b`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-a`         | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-b`         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-ivory-rainharbor-gem-panel-a`              | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-ivory-rainharbor-gem-panel-b`              | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-a`    | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-b`    | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-a`    | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-b`    | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-a`    | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-b`    | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-a`        | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-b`        | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-shell-background-a`      | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-obsidian-goldleaf-shell-background-b`      | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `SA-R3-2026-04-29-obsidian-goldleaf-topbar-a`                | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-obsidian-goldleaf-topbar-b`                | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p1-a`        | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p1-b`        | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p2-a`        | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p2-b`        | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `SA-R3-2026-04-29-obsidian-goldleaf-gem-panel-a`             | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-obsidian-goldleaf-gem-panel-b`             | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l1-a`   | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l1-b`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l2-a`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l2-b`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l3-a`   | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l3-b`   | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `SA-R3-2026-04-29-obsidian-goldleaf-royal-card-back-a`       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `SA-R3-2026-04-29-obsidian-goldleaf-royal-card-back-b`       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |

## Candidate Index

| Slot                  | Theme              | Variant | Prompt ID                                                 | Source path                                                                                                                             | Archive path                                                                                                                               | Dimensions                                            |  Score | Recommended use                                                                                        | Risk                                                                                                                                                                                 |
| --------------------- | ------------------ | ------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | -----: | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shell-background`    | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-shell-background-b`    | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f2650fda908191872b269915d01ec7.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/ivory-rainharbor/shell-background-b.png`       | source 1672x941; target 3840x2160; archive 3840x2160  | 7.9/10 | Shell background candidate; verify subdued continuous material behind the gameplay stage.              | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.                                                                                            |
| `topbar`              | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-topbar-b`              | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f26595100c8191bc3d6c6694a1fc4d.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/ivory-rainharbor/topbar-b.png`                           | source 2048x768; target 3840x360; archive 3840x360    | 7.7/10 | TopBar skin candidate; verify React score/crown/turn groups at 25%, 50%, and 75% width.                | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Check readability at 25%, 50%, and 75% header zones.                         |
| `player-zone-p1`      | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-b`      | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f26601016881919b5dcbfff6d9d0da.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/ivory-rainharbor/player-zone-p1-b.png`           | source 1704x923; target 1920x520; archive 1920x520    | 7.8/10 | P1 PlayerZone rail substrate; verify no baked slots or card-frame silhouettes.                         | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `player-zone-p2`      | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-b`      | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f26674bd388191a1c1cee878c4a955.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/ivory-rainharbor/player-zone-p2-b.png`           | source 1704x923; target 1920x520; archive 1920x520    | 7.8/10 | P2 PlayerZone rail substrate; verify coherence with P1 and no baked gameplay UI.                       | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion. Watch for generated placeholder rectangles resembling card slots.            |
| `gem-panel`           | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-gem-panel-b`           | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f267081e40819188b2b0cc512f7869.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/ivory-rainharbor/gem-panel-b.png`                     | source 1254x1254; target 1254x1254; archive 1254x1254 | 8.1/10 | Gem panel candidate; verify regular empty 5x5 wells and future grid calibration.                       | No normalization applied; inspect generated details before promotion. Grid lines are intended calibration evidence; verify actual cell wells in Visual Lab before runtime promotion. |
| `market-card-back-l1` | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-b` | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f267b0692c81918fe64a83eca72e39.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/ivory-rainharbor/market-card-back-l1-b.png` | source 1086x1449; target 1086x1448; archive 1086x1448 | 7.9/10 | L1 market card-back candidate; verify complete but restrained center ornament at 150x200 display size. | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `market-card-back-l2` | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-b` | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f2684211048191945a7b28b29ba465.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/ivory-rainharbor/market-card-back-l2-b.png` | source 1086x1448; target 1086x1448; archive 1086x1448 | 8.1/10 | L2 market card-back candidate; verify mid-tier escalation without symbols.                             | No normalization applied; inspect generated details before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.                           |
| `market-card-back-l3` | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-b` | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f268f2035c8191af2c9e57c0d7af0a.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/ivory-rainharbor/market-card-back-l3-b.png` | source 1085x1449; target 1086x1448; archive 1086x1448 | 8.1/10 | L3 market card-back candidate; verify highest-tier richness without text.                              | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |
| `royal-card-back`     | `ivory-rainharbor` | `B`     | `SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-b`     | `C:\Users\sange\.codex\generated_images\019ddad9-6984-7710-b336-69f0cca99e1f\ig_0b6f8d5f6602258a0169f269a4945081919ef8c40bc38d59de.png` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/ivory-rainharbor/royal-card-back-b.png`         | source 1086x1449; target 1086x1448; archive 1086x1448 | 8.2/10 | Royal card-back candidate; verify stronger sovereign identity than market backs.                       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion. Verify at 150x200 runtime display size for ornament density and text-like artifacts.      |

## Validation Results

- Archive PNG count: `72` candidate PNGs under the R3 archive, excluding contact sheets.
- Preview manifest parse: `pass`; `preview-manifest.json` contains `72` records.
- Exact dimension validation: `pass`; every archived candidate matches its target dimensions.
- Source path recording: `pass`; every record points to an existing `C:\Users\sange\.codex\generated_images` source file.
- Archive path boundary: `pass`; every archived candidate is under `assets/art-library/`.
- Visual Lab slots present: `shell-background`, `topbar`, `player-zone-p1`, `player-zone-p2`, `gem-panel`, `market-card-back-l1`, `market-card-back-l2`, `market-card-back-l3`, `royal-card-back`.
- Contact sheets: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/contact-sheets/`.
- Ignore policy: `git check-ignore -v` confirms R3 archive PNGs and `preview-manifest.json` are ignored by `.gitignore:40:/assets/art-library/`.
- Browser/frontend tests: not run; this task generated and archived visual assets only, with no runtime code or public API changes.

Validation command output:

```text
records=72
candidate_pngs=72
slots=['gem-panel', 'market-card-back-l1', 'market-card-back-l2', 'market-card-back-l3', 'player-zone-p1', 'player-zone-p2', 'royal-card-back', 'shell-background', 'topbar']
themes=['coral-moonforge', 'ivory-rainharbor', 'obsidian-goldleaf', 'sapphire-clockcourt']
errors=0
```

Git status note: this R3 pass added only the two untracked R3 docs below plus ignored local archive artifacts under `assets/art-library/`. The other modified/untracked files shown here were pre-existing workspace changes and were not edited by this pass.

```text
 M apps/desktop/public/assets/surfaces/README.md
 M apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/market-card-back-l1.png
 M apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/shell-background.png
 M apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/gem-panel.png
 M apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/market-card-back-l1.png
 M apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png
 M apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/market-card-back-l1.png
 M apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png
 M apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/market-card-back-l1.png
 M apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png
 M apps/desktop/src/__tests__/surfaceStyling.test.tsx
 M apps/desktop/src/app/chrome/AppChromeSurfaceMenu.tsx
 M apps/desktop/src/app/chrome/__tests__/AppChrome.test.tsx
 M apps/desktop/src/app/shell/__tests__/gameShellStyles.test.ts
 M apps/desktop/src/app/shell/__tests__/gemPanelSkin.test.ts
 M apps/desktop/src/app/shell/surfaceArtwork.ts
 M apps/desktop/src/app/shell/surfaceTheme.ts
 M apps/desktop/src/app/visual-lab/__tests__/surfaceLabCatalog.test.ts
 M apps/desktop/src/app/visual-lab/surfaceLabTypes.ts
 M apps/desktop/src/hooks/__tests__/useSettings.test.tsx
 M apps/desktop/src/hooks/useSettings.ts
 M docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md
 M packages/shared/src/i18n/catalogs/ui.ts
 M packages/ui/src/components/PlayerZone.tsx
 M packages/ui/src/components/playerZone/PlayerZoneResourcesColumn.tsx
 M packages/ui/src/components/playerZone/PlayerZoneTableauStack.tsx
?? apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/
?? docs/art/Asset_Art_Gen_0429.md
?? docs/art/surface-asset-autonomous-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-prompts-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r2-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r2-prompts-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r3-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r3-prompts-2026-04-29.md
?? docs/art/surface-asset-autonomous-prompts-2026-04-29.md
?? docs/art/surface-runtime-style-promotion-and-l1-regeneration-2026-04-29.md
?? docs/art/surface-shell-background-continuous-runtime-replacement-library-2026-04-29.md
?? docs/art/surface-visual-lab-shell-continuous-replacement-library-2026-04-29.md
?? docs/art/surface-visual-lab-shell-continuous-replacement-prompts-2026-04-29.md
```
