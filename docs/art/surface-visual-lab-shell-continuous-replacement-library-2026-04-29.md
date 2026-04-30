# Visual Lab Continuous Shell Background Replacement Library - 2026-04-29

## Summary

This report records the subagent-driven replacement pass for every `shell-background.png` asset currently connected to Visual Lab.

- Required workflow: `C:/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md`
- Prompt manifest: `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/prompt-manifest.json`
- Replacement manifest: `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/replacement-manifest.json`
- Current-target backups: `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/target-backups/`
- Generated source archive: `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/generated-sources/`
- Normalized replacements: `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/normalized-replacements/`

## Scope Evidence

Visual Lab candidate assets are served by `apps/desktop/vite.config.ts` from directories matching `surface-autonomous(?:-.+)?-candidates` under `assets/art-library`, using each `preview-manifest.json` record's archive path. Runtime Visual Lab entries are appended by `apps/desktop/src/app/visual-lab/surfaceLabCatalog.ts`, where the `shell-background` slot resolves to `shell-background.png` under each runtime theme. The surface asset README states that `shell-background.png` is the only full-board desktop background and that there is no separate tablecloth or playmat slot.

## Prompt Contract

All worker prompts used the shared continuous full-board shell prompt from `docs/art/surface-visual-lab-shell-continuous-replacement-prompts-2026-04-29.md`: the shell bitmap is passive full-screen tabletop material, React renders all UI, and the bitmap must not contain a centered stage, playmat, tablecloth, inset rectangle, central panel, edge-vs-center split, text, symbols, UI, card slots, or deck silhouettes.

## Target Counts

| Source                            | Count |
| --------------------------------- | ----: |
| Candidate Visual Lab shell assets |    98 |
| Runtime Visual Lab shell assets   |     4 |
| Total replaced                    |   102 |

## Candidate Roots

| Root                                             | Shell replacements |
| ------------------------------------------------ | -----------------: |
| `runtime`                                        |                  4 |
| `surface-autonomous-artisan-styles-candidates`   |                  8 |
| `surface-autonomous-candidates`                  |                 16 |
| `surface-autonomous-extra-styles-candidates`     |                  8 |
| `surface-autonomous-followup-candidates`         |                  2 |
| `surface-autonomous-legendary-styles-candidates` |                  8 |
| `surface-autonomous-luminous-styles-candidates`  |                  8 |
| `surface-autonomous-mythic-styles-candidates`    |                  8 |
| `surface-autonomous-new-styles-candidates`       |                  8 |
| `surface-autonomous-new-themes-candidates`       |                  8 |
| `surface-autonomous-new-themes-r2-candidates`    |                  8 |
| `surface-autonomous-prismatic-styles-candidates` |                  8 |
| `surface-autonomous-ultra-styles-candidates`     |                  8 |

## Runtime Replacements

| Style             | Runtime path                                                                                 | Subagent source                                                                                                                         | Dimensions |
| ----------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `crystal-anime`   | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`   | `C:\Users\sange\.codex\generated_images\019dda38-c2b3-7541-b3af-402e195d54e9\ig_0d8fb6ecc65e055b0169f23d973ab48194b1daa06e28db28fd.png` | 3840x2160  |
| `royal-luxury`    | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`    | `C:\Users\sange\.codex\generated_images\019dda38-c2b3-7541-b3af-402e195d54e9\ig_0d8fb6ecc65e055b0169f23dce81d48194a38a2ac8f9fa2209.png` | 3840x2160  |
| `dark-arcane`     | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`     | `C:\Users\sange\.codex\generated_images\019dda38-c2b3-7541-b3af-402e195d54e9\ig_0d8fb6ecc65e055b0169f23e21f680819488bcde9e470d2cf2.png` | 3840x2160  |
| `clean-boardgame` | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/shell-background.png` | `C:\Users\sange\.codex\generated_images\019dda38-c2b3-7541-b3af-402e195d54e9\ig_0d8fb6ecc65e055b0169f23e5f8c448194be9f4ccea64eba83.png` | 3840x2160  |

## Validation

- Metadata check passed for 102 replaced files: every target is PNG `3840x2160`.
- One worker-generated source was rejected and excluded: `ig_08739184a75f69030169f239072824819094647c40a6e0dfeb.png`, because Worker 2 reported it was a transcription-mismatch attempt before regenerating `VL-SHELL-19` with the exact manifest prompt.
- Normalization used center-crop/resize to exact `3840x2160` where Image Gen returned a non-exact size.
- Browser spot check passed on `http://127.0.0.1:5173/` for the four runtime styles with zero browser console errors reported during capture.
- Browser screenshot contact sheet: `artifacts/surface-visual-lab-shell-continuous-verification-2026-04-29/runtime-browser-contact-sheet.png`.
- Manual review status: contact sheets created for human review; browser runtime screenshots confirm the four live theme paths resolve.

## Contact Sheets

Runtime-only contact sheet:

- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/runtime-shell-background-contact-sheet.png`

Full target contact sheets:

- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-01.png`
- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-02.png`
- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-03.png`
- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-04.png`
- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-05.png`
- `assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/contact-sheets/shell-background-contact-sheet-06.png`

## Style Counts

| Style                       | Shell replacements |
| --------------------------- | -----------------: |
| `arctic-rosequartz`         |                  2 |
| `astral-navigator`          |                  2 |
| `astral-orchid`             |                  2 |
| `aurora-citadel`            |                  2 |
| `aurora-porcelain-court`    |                  1 |
| `aurora-steel`              |                  2 |
| `bamboo-ink`                |                  2 |
| `basalt-aquamarine`         |                  2 |
| `celestial-copper`          |                  2 |
| `cerulean-cloisonne`        |                  2 |
| `clean-boardgame`           |                  5 |
| `clockwork-garden`          |                  2 |
| `crimson-onyx`              |                  2 |
| `crystal-anime`             |                  5 |
| `dark-arcane`               |                  5 |
| `ember-forge`               |                  4 |
| `frosted-amberglass`        |                  2 |
| `garnet-meteorite`          |                  2 |
| `glacier-silver`            |                  2 |
| `ivory-verdigris`           |                  2 |
| `lapis-sunburst`            |                  2 |
| `lotus-porcelain`           |                  2 |
| `midnight-navigator`        |                  2 |
| `mistwood-silverleaf`       |                  2 |
| `moonlit-jade`              |                  2 |
| `moss-agate`                |                  2 |
| `neon-noir`                 |                  2 |
| `nocturne-pearl`            |                  2 |
| `opal-rain`                 |                  2 |
| `paper-lantern`             |                  2 |
| `pearl-opaline`             |                  2 |
| `porcelain-cinnabar`        |                  2 |
| `prism-slate`               |                  2 |
| `royal-luxury`              |                  5 |
| `sakura-obsidian`           |                  2 |
| `solar-enamel`              |                  2 |
| `storm-temple`              |                  2 |
| `stormglass-reliquary`      |                  2 |
| `sunken-brass`              |                  2 |
| `sunken-opal`               |                  2 |
| `thunder-amethyst`          |                  2 |
| `velvet-noir`               |                  2 |
| `verdant-brass-observatory` |                  1 |
| `verdant-bronze`            |                  2 |
| `volcanic-rose-gold`        |                  2 |

## Asset Rows

| Prompt id                                           | Source      | Style                       | Variant | Target                                                                                                                                            | Dimensions  | Score | Watchlist                                                        |
| --------------------------------------------------- | ----------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----: | ---------------------------------------------------------------- |
| `VL-SHELL-01-CANDIDATE-CERULEAN-CLOISONNE-A`        | `candidate` | `cerulean-cloisonne`        | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-a.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-02-CANDIDATE-CERULEAN-CLOISONNE-B`        | `candidate` | `cerulean-cloisonne`        | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-b.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-03-CANDIDATE-GARNET-METEORITE-A`          | `candidate` | `garnet-meteorite`          | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-a.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-04-CANDIDATE-GARNET-METEORITE-B`          | `candidate` | `garnet-meteorite`          | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-b.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-05-CANDIDATE-MISTWOOD-SILVERLEAF-A`       | `candidate` | `mistwood-silverleaf`       | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-a.png`          | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-06-CANDIDATE-MISTWOOD-SILVERLEAF-B`       | `candidate` | `mistwood-silverleaf`       | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-b.png`          | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-07-CANDIDATE-PRISM-SLATE-A`               | `candidate` | `prism-slate`               | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-a.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-08-CANDIDATE-PRISM-SLATE-B`               | `candidate` | `prism-slate`               | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-b.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-09-CANDIDATE-CLEAN-BOARDGAME-A`           | `candidate` | `clean-boardgame`           | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/a/shell-background.png`                             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-10-CANDIDATE-CLEAN-BOARDGAME-B`           | `candidate` | `clean-boardgame`           | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/b/shell-background.png`                             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-11-CANDIDATE-CRYSTAL-ANIME-A`             | `candidate` | `crystal-anime`             | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/a/shell-background.png`                               | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-12-CANDIDATE-CRYSTAL-ANIME-B`             | `candidate` | `crystal-anime`             | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/b/shell-background.png`                               | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-13-CANDIDATE-DARK-ARCANE-A`               | `candidate` | `dark-arcane`               | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/a/shell-background.png`                                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-14-CANDIDATE-DARK-ARCANE-B`               | `candidate` | `dark-arcane`               | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/b/shell-background.png`                                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-15-CANDIDATE-ROYAL-LUXURY-A`              | `candidate` | `royal-luxury`              | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/a/shell-background.png`                                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-16-CANDIDATE-ROYAL-LUXURY-B`              | `candidate` | `royal-luxury`              | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/b/shell-background.png`                                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-25-CANDIDATE-SAKURA-OBSIDIAN-A`           | `candidate` | `sakura-obsidian`           | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/a/shell-background.png`                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-26-CANDIDATE-SAKURA-OBSIDIAN-B`           | `candidate` | `sakura-obsidian`           | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/b/shell-background.png`                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-27-CANDIDATE-SOLAR-ENAMEL-A`              | `candidate` | `solar-enamel`              | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/a/shell-background.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-28-CANDIDATE-SOLAR-ENAMEL-B`              | `candidate` | `solar-enamel`              | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/b/shell-background.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-29-CANDIDATE-STORMGLASS-RELIQUARY-A`      | `candidate` | `stormglass-reliquary`      | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/a/shell-background.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-30-CANDIDATE-STORMGLASS-RELIQUARY-B`      | `candidate` | `stormglass-reliquary`      | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/b/shell-background.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-31-CANDIDATE-VERDANT-BRONZE-A`            | `candidate` | `verdant-bronze`            | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/a/shell-background.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-32-CANDIDATE-VERDANT-BRONZE-B`            | `candidate` | `verdant-bronze`            | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/b/shell-background.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-33-CANDIDATE-AURORA-PORCELAIN-COURT-A`    | `candidate` | `aurora-porcelain-court`    | `a`     | `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/shell-background/aurora-porcelain-court/a/shell-background.png`    | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-34-CANDIDATE-VERDANT-BRASS-OBSERVATORY-A` | `candidate` | `verdant-brass-observatory` | `a`     | `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/shell-background/verdant-brass-observatory/a/shell-background.png` | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-35-CANDIDATE-BAMBOO-INK-A`                | `candidate` | `bamboo-ink`                | `A`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/bamboo-ink/shell-background-a.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-37-CANDIDATE-LAPIS-SUNBURST-A`            | `candidate` | `lapis-sunburst`            | `A`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/lapis-sunburst/shell-background-a.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-40-CANDIDATE-OPAL-RAIN-B`                 | `candidate` | `opal-rain`                 | `B`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/opal-rain/shell-background-b.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-43-CANDIDATE-ARCTIC-ROSEQUARTZ-A`         | `candidate` | `arctic-rosequartz`         | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-a.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-44-CANDIDATE-ARCTIC-ROSEQUARTZ-B`         | `candidate` | `arctic-rosequartz`         | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-b.png`           | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-45-CANDIDATE-PAPER-LANTERN-A`             | `candidate` | `paper-lantern`             | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-a.png`               | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-46-CANDIDATE-PAPER-LANTERN-B`             | `candidate` | `paper-lantern`             | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-b.png`               | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-47-CANDIDATE-SUNKEN-BRASS-A`              | `candidate` | `sunken-brass`              | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-a.png`                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-48-CANDIDATE-SUNKEN-BRASS-B`              | `candidate` | `sunken-brass`              | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-b.png`                | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-49-CANDIDATE-THUNDER-AMETHYST-A`          | `candidate` | `thunder-amethyst`          | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-a.png`            | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-50-CANDIDATE-THUNDER-AMETHYST-B`          | `candidate` | `thunder-amethyst`          | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-b.png`            | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-51-CANDIDATE-ASTRAL-ORCHID-A`             | `candidate` | `astral-orchid`             | `A`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/astral-orchid/A/shell-background.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-54-CANDIDATE-AURORA-STEEL-B`              | `candidate` | `aurora-steel`              | `B`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/aurora-steel/B/shell-background.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-56-CANDIDATE-BASALT-AQUAMARINE-B`         | `candidate` | `basalt-aquamarine`         | `B`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/basalt-aquamarine/B/shell-background.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-57-CANDIDATE-PORCELAIN-CINNABAR-A`        | `candidate` | `porcelain-cinnabar`        | `A`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/porcelain-cinnabar/A/shell-background.png`            | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-59-CANDIDATE-EMBER-FORGE-A`               | `candidate` | `ember-forge`               | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/a/shell-background.png`                      | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-60-CANDIDATE-EMBER-FORGE-B`               | `candidate` | `ember-forge`               | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/b/shell-background.png`                      | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-61-CANDIDATE-MOONLIT-JADE-A`              | `candidate` | `moonlit-jade`              | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/a/shell-background.png`                     | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-62-CANDIDATE-MOONLIT-JADE-B`              | `candidate` | `moonlit-jade`              | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/b/shell-background.png`                     | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-63-CANDIDATE-NEON-NOIR-A`                 | `candidate` | `neon-noir`                 | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/a/shell-background.png`                        | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-64-CANDIDATE-NEON-NOIR-B`                 | `candidate` | `neon-noir`                 | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/b/shell-background.png`                        | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-65-CANDIDATE-PEARL-OPALINE-A`             | `candidate` | `pearl-opaline`             | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/a/shell-background.png`                    | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-66-CANDIDATE-PEARL-OPALINE-B`             | `candidate` | `pearl-opaline`             | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/b/shell-background.png`                    | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-67-CANDIDATE-ASTRAL-NAVIGATOR-A`          | `candidate` | `astral-navigator`          | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/astral-navigator/shell-background-a.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-68-CANDIDATE-ASTRAL-NAVIGATOR-B`          | `candidate` | `astral-navigator`          | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/astral-navigator/shell-background-b.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-69-CANDIDATE-AURORA-CITADEL-A`            | `candidate` | `aurora-citadel`            | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/aurora-citadel/shell-background-a.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-70-CANDIDATE-AURORA-CITADEL-B`            | `candidate` | `aurora-citadel`            | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/aurora-citadel/shell-background-b.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-73-CANDIDATE-LOTUS-PORCELAIN-A`           | `candidate` | `lotus-porcelain`           | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/lotus-porcelain/shell-background-a.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-74-CANDIDATE-LOTUS-PORCELAIN-B`           | `candidate` | `lotus-porcelain`           | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/lotus-porcelain/shell-background-b.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-77-CANDIDATE-STORM-TEMPLE-A`              | `candidate` | `storm-temple`              | `a`     | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/storm-temple/shell-background-a.png`                  | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-79-CANDIDATE-SUNKEN-OPAL-A`               | `candidate` | `sunken-opal`               | `a`     | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/sunken-opal/shell-background-a.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-89-CANDIDATE-NOCTURNE-PEARL-A`            | `candidate` | `nocturne-pearl`            | `A`     | `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/nocturne-pearl/shell-background-a.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-91-CANDIDATE-CRIMSON-ONYX-A`              | `candidate` | `crimson-onyx`              | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/A/shell-background.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-92-CANDIDATE-CRIMSON-ONYX-B`              | `candidate` | `crimson-onyx`              | `B`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/B/shell-background.png`                   | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-93-CANDIDATE-GLACIER-SILVER-A`            | `candidate` | `glacier-silver`            | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/glacier-silver/A/shell-background.png`                 | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-97-CANDIDATE-MIDNIGHT-NAVIGATOR-A`        | `candidate` | `midnight-navigator`        | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/midnight-navigator/A/shell-background.png`             | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-99-RUNTIME-CRYSTAL-ANIME-DARK`            | `runtime`   | `crystal-anime`             | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`                                                        | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-100-RUNTIME-ROYAL-LUXURY-DARK`            | `runtime`   | `royal-luxury`              | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`                                                         | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-101-RUNTIME-DARK-ARCANE-DARK`             | `runtime`   | `dark-arcane`               | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`                                                          | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
| `VL-SHELL-102-RUNTIME-CLEAN-BOARDGAME-DARK`         | `runtime`   | `clean-boardgame`           | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/shell-background.png`                                                      | `3840x2160` |     8 | Watch for subtle accidental center emphasis in final human pass. |
