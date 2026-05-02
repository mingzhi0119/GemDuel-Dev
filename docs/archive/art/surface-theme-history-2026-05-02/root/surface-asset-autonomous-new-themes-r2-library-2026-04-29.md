# GemDuel Surface Asset Autonomous New Themes R2 Library - 2026-04-29

## Summary

- Batch: `surface-autonomous-new-themes-r2-candidates`
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r2-prompts-2026-04-29.md`
- Archive root: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29`
- Visual Lab preview manifest: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/contact-sheets/preview-manifest.json`
- Scope: candidate library only; no runtime surface assets were overwritten and no code/runtime theme enum was changed.
- Generation path: subagents used built-in Image Gen only; Main Agent copied from `C:\Users\sange\.codex\generated_images` and normalized/archive-copied into the repo candidate library.

## Candidate Counts

### By Style

- `sunken-opal`: `18`
- `clockwork-garden`: `18`
- `storm-temple`: `18`
- `velvet-noir`: `18`

### By Slot

- `shell-background`: `8`
- `topbar`: `8`
- `player-zone-p1`: `8`
- `player-zone-p2`: `8`
- `gem-panel`: `8`
- `market-card-back-l1`: `8`
- `market-card-back-l2`: `8`
- `market-card-back-l3`: `8`
- `royal-card-back`: `8`

## Top Picks By Slot

- `shell-background`: `storm-temple A` (8.5/10), `sunken-opal A` (8.4/10)
- `topbar`: `velvet-noir A` (8.4/10), `velvet-noir B` (8.3/10)
- `player-zone-p1`: `storm-temple A` (8.2/10), `velvet-noir A` (8.2/10)
- `player-zone-p2`: `storm-temple A` (8.2/10), `velvet-noir A` (8.2/10)
- `gem-panel`: `clockwork-garden A` (8.6/10), `sunken-opal A` (8.5/10)
- `market-card-back-l1`: `velvet-noir A` (8.3/10), `sunken-opal A` (8.2/10)
- `market-card-back-l2`: `clockwork-garden A` (8.4/10), `velvet-noir A` (8.4/10)
- `market-card-back-l3`: `velvet-noir A` (8.6/10), `clockwork-garden A` (8.5/10)
- `royal-card-back`: `velvet-noir A` (8.7/10), `velvet-noir B` (8.6/10)

## Watchlist / Rejected

- Hard rejects: none.
- Image Gen failures: none reported by workers.
- Watchlist: all normalized/cropped files require visual review before promotion; card backs need 150x200 runtime-size review; PlayerZone assets need substrate-only review; TopBar assets need 25%/50%/75% readability review; gem panels need human calibration review before promoting grid constants.
- Theme-specific watchlist: `clockwork-garden` gearwork can resemble numerals or dial marks; `sunken-opal` can over-brighten with caustics; `storm-temple` can over-glare with lightning; `velvet-noir` can crush dark details.

## Gem Panel Normalized Grid-Line Notes

- Intended normalized 6x6 grid-line arrays for every `gem-panel` candidate in this batch: `x = [0.10, 0.26, 0.42, 0.58, 0.74, 0.90]`, `y = [0.10, 0.26, 0.42, 0.58, 0.74, 0.90]`.
- These are calibration evidence for future review, not promoted code constants and not the old fixed absolute lattice.

## Candidate Source / Archive Table

| slot                  | style          | variant | promptId                                                  | source path                                                                                                                             | archive path                                                                                                                           | dimensions                                            |  score | recommendation                                                                   | risk                                                                                                                                                                                                                                                                              |
| --------------------- | -------------- | ------: | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -----: | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell-background`    | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-shell-background-a`     | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21bd96f108197915bfd8ba79466db.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/sunken-opal/shell-background-a.png`        | source 1672x941; target 3840x2160; archive 3840x2160  | 8.4/10 | Shell background candidate; verify subdued center behind gameplay stage.         | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.; Review pale pearl/caustic highlights for foreground contrast.                                                                                                                          |
| `topbar`              | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-topbar-a`               | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21c6b5c0c8197b29eb54f0c1f6cc8.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/sunken-opal/topbar-a.png`                            | source 2048x768; target 3840x360; archive 3840x360    | 8.0/10 | TopBar candidate; verify React score/crown/turn readability.                     | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion.; Check readable zones near 25%, 50%, and 75% width for score/crown/turn UI.; Review pale pearl/caustic highlights for foreground contrast.                                |
| `player-zone-p1`      | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p1-a`       | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21cfc2c98819791b9cd49d0c3fd64.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/sunken-opal/player-zone-p1-a.png`            | source 1704x923; target 1920x520; archive 1920x520    | 8.1/10 | P1 PlayerZone rail substrate candidate; verify no baked slots or controls.       | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion.; Watch for generated placeholder rectangles resembling card slots; PlayerZone must remain substrate-only.; Review pale pearl/caustic highlights for foreground contrast.  |
| `player-zone-p2`      | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p2-a`       | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21d91878881978d6605f857935d06.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/sunken-opal/player-zone-p2-a.png`            | source 1704x923; target 1920x520; archive 1920x520    | 8.1/10 | P2 PlayerZone rail substrate candidate; verify coherence with P1.                | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion.; Watch for generated placeholder rectangles resembling card slots; PlayerZone must remain substrate-only.; Review pale pearl/caustic highlights for foreground contrast.  |
| `gem-panel`           | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-gem-panel-a`            | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21e3b6b0881978cc85687e46a389a.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/sunken-opal/gem-panel-a.png`                      | source 1254x1254; target 1254x1254; archive 1254x1254 | 8.5/10 | Gem panel candidate; verify regular empty 5x5 wells and calibration.             | Grid lines are intended normalized calibration evidence; verify empty 5x5 wells before runtime promotion.; Review pale pearl/caustic highlights for foreground contrast.                                                                                                          |
| `market-card-back-l1` | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l1-a`  | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21f229fd48197b340097881f9f9ca.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/sunken-opal/market-card-back-l1-a.png`  | source 1085x1450; target 1086x1448; archive 1086x1448 | 8.2/10 | L1 market card-back candidate; verify lowest-tier simplicity.                    | Normalization applied: resized from 1085x1450 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review pale pearl/caustic highlights for foreground contrast.                                   |
| `market-card-back-l2` | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l2-a`  | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f21ff357588197a795e0c1a3ff53cd.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/sunken-opal/market-card-back-l2-a.png`  | source 1086x1449; target 1086x1448; archive 1086x1448 | 8.3/10 | L2 market card-back candidate; verify mid-tier escalation.                       | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review pale pearl/caustic highlights for foreground contrast.                                   |
| `market-card-back-l3` | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l3-a`  | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f220e675588197a95eb9ffffaddb3f.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/sunken-opal/market-card-back-l3-a.png`  | source 1085x1449; target 1086x1448; archive 1086x1448 | 8.4/10 | L3 market card-back candidate; verify highest-tier richness.                     | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review pale pearl/caustic highlights for foreground contrast.                                   |
| `royal-card-back`     | `sunken-opal`  |     `A` | `SA-NEW-R2-2026-04-29-sunken-opal-royal-card-back-a`      | `C:\Users\sange\.codex\generated_images\019dd9bb-e4e3-7741-8dbb-3f295e07d574\ig_0a8314727c603dc90169f221e257e8819783cbe13f56a11c34.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/sunken-opal/royal-card-back-a.png`          | source 1086x1449; target 1086x1448; archive 1086x1448 | 8.4/10 | Royal card-back candidate; verify stronger sovereign identity than market backs. | Normalization applied: resized from 1086x1449 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review pale pearl/caustic highlights for foreground contrast.                                   |
| `shell-background`    | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-shell-background-a`    | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21bbccbe48190b2a29f61302730ec.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/storm-temple/shell-background-a.png`       | source 1672x941; target 3840x2160; archive 3840x2160  | 8.5/10 | Shell background candidate; verify subdued center behind gameplay stage.         | Normalization applied: resized from 1672x941 to 3840x2160; inspect crop before promotion.; Review lightning accents for excessive glare in overlay areas.                                                                                                                         |
| `topbar`              | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-topbar-a`              | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21c539cc48190864218d1d90523fb.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/storm-temple/topbar-a.png`                           | source 2048x768; target 3840x360; archive 3840x360    | 8.2/10 | TopBar candidate; verify React score/crown/turn readability.                     | Normalization applied: center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion.; Check readable zones near 25%, 50%, and 75% width for score/crown/turn UI.; Review lightning accents for excessive glare in overlay areas.                               |
| `player-zone-p1`      | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-player-zone-p1-a`      | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21cb688788190b4feedb68e9ca431.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/storm-temple/player-zone-p1-a.png`           | source 1704x923; target 1920x520; archive 1920x520    | 8.2/10 | P1 PlayerZone rail substrate candidate; verify no baked slots or controls.       | Normalization applied: center-cropped/resized from 1704x923 to 1920x520; inspect crop before promotion.; Watch for generated placeholder rectangles resembling card slots; PlayerZone must remain substrate-only.; Review lightning accents for excessive glare in overlay areas. |
| `player-zone-p2`      | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-player-zone-p2-a`      | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21d320ce08190af2876f969ad8933.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/storm-temple/player-zone-p2-a.png`           | source 1705x923; target 1920x520; archive 1920x520    | 8.2/10 | P2 PlayerZone rail substrate candidate; verify coherence with P1.                | Normalization applied: center-cropped/resized from 1705x923 to 1920x520; inspect crop before promotion.; Watch for generated placeholder rectangles resembling card slots; PlayerZone must remain substrate-only.; Review lightning accents for excessive glare in overlay areas. |
| `gem-panel`           | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-gem-panel-a`           | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21d9cc1748190a54b988faea94e31.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/storm-temple/gem-panel-a.png`                     | source 1254x1254; target 1254x1254; archive 1254x1254 | 8.4/10 | Gem panel candidate; verify regular empty 5x5 wells and calibration.             | Grid lines are intended normalized calibration evidence; verify empty 5x5 wells before runtime promotion.; Review lightning accents for excessive glare in overlay areas.                                                                                                         |
| `market-card-back-l1` | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l1-a` | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21e549b54819097c7918b33d809bf.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/storm-temple/market-card-back-l1-a.png` | source 1085x1449; target 1086x1448; archive 1086x1448 | 8.1/10 | L1 market card-back candidate; verify lowest-tier simplicity.                    | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review lightning accents for excessive glare in overlay areas.                                  |
| `market-card-back-l2` | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l2-a` | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21eef8f888190996e27748eb5249c.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/storm-temple/market-card-back-l2-a.png` | source 1085x1449; target 1086x1448; archive 1086x1448 | 8.2/10 | L2 market card-back candidate; verify mid-tier escalation.                       | Normalization applied: resized from 1085x1449 to 1086x1448; inspect crop before promotion.; Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review lightning accents for excessive glare in overlay areas.                                  |
| `market-card-back-l3` | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l3-a` | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f21f94199081908675c5426ba172c8.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/storm-temple/market-card-back-l3-a.png` | source 1086x1448; target 1086x1448; archive 1086x1448 | 8.4/10 | L3 market card-back candidate; verify highest-tier richness.                     | Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review lightning accents for excessive glare in overlay areas.                                                                                                                              |
| `royal-card-back`     | `storm-temple` |     `A` | `SA-NEW-R2-2026-04-29-storm-temple-royal-card-back-a`     | `C:\Users\sange\.codex\generated_images\019dd9bb-ee02-7ac2-8aa8-509525c58783\ig_08e216d58f4c9c6f0169f2204be2508190822986fe1026b090.png` | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/storm-temple/royal-card-back-a.png`         | source 1086x1448; target 1086x1448; archive 1086x1448 | 8.5/10 | Royal card-back candidate; verify stronger sovereign identity than market backs. | Verify at 150x200 runtime display size for ornament density and text-like artifacts.; Review lightning accents for excessive glare in overlay areas.                                                                                                                              |

## Validation Results

- Archive PNG count: `72` / `72`.
- Preview manifest parse: `pass`.
- Exact dimension validation: `pass`.
- Source path recording: `pass`.
- Archive path boundary: `pass`, all archive paths are under `assets/art-library/`.
- Contact sheets: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/contact-sheets`.
- Errors: none.

## Git Status Summary

Final `git status --short` after validation:

```text
 M docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md
?? docs/art/surface-asset-autonomous-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-prompts-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r2-library-2026-04-29.md
?? docs/art/surface-asset-autonomous-new-themes-r2-prompts-2026-04-29.md
?? docs/art/surface-asset-autonomous-prompts-2026-04-29.md
```

Ignored archive check:

```text
!! assets/art-library/
```

Archive note: `assets/art-library/` is ignored, so candidate PNGs and Visual Lab manifests are local review artifacts unless ignore policy changes. The modified `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md` was already present before this asset-generation pass and was treated as user-owned.
