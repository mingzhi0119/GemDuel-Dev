# Visual Lab Continuous Shell Background Replacement Prompts - 2026-04-29

## Scope

This prompt manifest is for the 2026-04-29 replacement pass requested for every shell background currently connected to Visual Lab. It follows `C:/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md`: Main Agent owns inspection, manifest, archive, scoring, validation, and runtime promotion; worker subagents generate images only with Image Gen and do not edit repository files.

Targets discovered from the actual Visual Lab wiring:

- Candidate shell backgrounds from `assets/art-library/surface-autonomous*-candidates/**/preview-manifest.json`: 98
- Runtime shell backgrounds from `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/shell-background.png`: 4
- Total shell replacements: 102

## Visual Lab Evidence

- `apps/desktop/vite.config.ts` serves candidate manifest records from directories matching `surface-autonomous(?:-.+)?-candidates` under `assets/art-library` and exposes archive paths via `/__surface-lab/assets/...`.
- `apps/desktop/src/app/visual-lab/surfaceLabCatalog.ts` appends runtime theme asset sets and resolves `shell-background` to `shell-background.png`.
- `apps/desktop/public/assets/surfaces/README.md` states that `shell-background.png` is the only full-board desktop background and that no separate tablecloth or playmat slot is connected.

## Shared Shell Prompt Base

```text
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Composition: seamless 16:9 continuous material field across the entire canvas. Keep the whole image low-noise and readable through subtle material texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse, integrated into the continuous material, and must not form a frame around the center.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center.
```

## Style Briefs

| Style                | Shell prompt addition                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `astral-navigator`   | continuous dark star-map-inspired polished tabletop with abstract navigational shimmer; no maps, compass marks, constellations, glyphs, or readable symbols.                           |
| `astral-orchid`      | continuous deep violet-black nacre and polished stone tabletop with faint orchid nebula sheen; sparse star dust remains abstract and non-symbolic.                                     |
| `aurora-citadel`     | continuous cool metal and stone palace-material tabletop with aurora glints; no architecture, walls, stage, throne platform, or framed center.                                         |
| `aurora-steel`       | continuous brushed dark steel tabletop with subtle aurora iridescence; directional brushing stays full-field and never outlines a center rectangle.                                    |
| `bamboo-ink`         | continuous dark lacquered bamboo fiber and ink-wash tabletop material; subtle brush-grain variation spreads across the whole canvas without forming panels or scroll borders.          |
| `basalt-aquamarine`  | continuous charcoal basalt tabletop with aquamarine mineral specks and faint veins; keep contrast low and distributed across the whole board.                                          |
| `celestial-copper`   | continuous dark copper alloy tabletop with subtle celestial patina specks; no constellation lines, planetary icons, or glyph-like markings.                                            |
| `clean-boardgame`    | continuous premium matte stone or satin metal tabletop; practical, low-noise, and absolutely no gray center panel or functional middle zone.                                           |
| `clockwork-garden`   | continuous burnished brass and dark green patina tabletop; tiny abstract mechanical texture is embedded and cannot read as controls, gears, counters, or UI.                           |
| `crimson-onyx`       | continuous black onyx tabletop with muted crimson mineral veins; veins remain natural and do not create borders, slots, or a centered arena.                                           |
| `crystal-anime`      | continuous dark gemstone and crystal tabletop material; anime-polished facets and soft cyan-violet glow spread naturally across the whole field, never forming a central crystal slab. |
| `dark-arcane`        | continuous obsidian, dark copper, and low arcane atmosphere; abstract geometry is allowed only as faint mineral structure, never readable runes, text, UI, or a center boundary.       |
| `ember-forge`        | continuous tempered dark iron and ember enamel tabletop; ember glow is diffuse and material-bound, not a furnace scene or hot center area.                                             |
| `frosted-amberglass` | continuous smoky amber glass tabletop with frosted inclusions; keep reflections broad and soft, with no high-glare wash or center pane.                                                |
| `glacier-silver`     | continuous dark glacial stone and satin silver vein tabletop; cold highlights are subtle and distributed, without a center ice plate.                                                  |
| `ivory-verdigris`    | continuous aged ivory ceramic and verdigris patina tabletop; muted practical finish, no ornate frame, crest, tile grid, or plaque.                                                     |
| `lapis-sunburst`     | continuous deep lapis stone tabletop with muted gold mineral warmth diffused through the material; no sun emblem, radial center, or framed medallion.                                  |
| `lotus-porcelain`    | continuous dark porcelain tabletop with soft lotus-glaze blooms integrated into the material; no literal flower frame, medallion, or central motif.                                    |
| `midnight-navigator` | continuous midnight metal and stone tabletop with abstract blue navigational shimmer; no maps, compass roses, labels, or center dashboard.                                             |
| `moss-agate`         | continuous dark moss agate stone tabletop with low-contrast green organic inclusions; no garden scene, leaves, border, or central clearing.                                            |
| `nocturne-pearl`     | continuous nocturne pearl-shell and matte lacquer tabletop; pearlescence is restrained and full-field, with no pearl medallion or framed middle.                                       |
| `opal-rain`          | continuous dusky opal and rainy glass tabletop material; pearlescent flecks are embedded evenly and do not create puddles, text, or a center field.                                    |
| `porcelain-cinnabar` | continuous dark porcelain glaze tabletop with restrained cinnabar mineral marbling; no ceramic tile grid, crest, seal, or center plaque.                                               |
| `royal-luxury`       | continuous black-gold lacquer and satin metal tabletop material; sparse palace ornament is embedded into the surface and never becomes a center stage, medallion, or frame.            |
| `storm-temple`       | continuous storm-polished slate and subdued bronze tabletop material; abstract storm energy stays low-noise and does not form temple architecture or a play stage.                     |
| `sunken-opal`        | continuous underwater opal stone tabletop with low-contrast caustic shimmer; no scene horizon, ruins, framed pool, or central water panel.                                             |
| `velvet-noir`        | continuous black noir lacquer and matte mineral tabletop with soft velvet-like finish; avoid any separate fabric cloth or tablecloth behavior.                                         |
| `volcanic-rose-gold` | continuous black volcanic stone tabletop with rose-gold mineral seams; warm glow appears as natural veining across the full surface, not a central slab.                               |

## Candidate Roots

| Visual Lab candidate root                        | Shell targets |
| ------------------------------------------------ | ------------: |
| `surface-autonomous-artisan-styles-candidates`   |             8 |
| `surface-autonomous-candidates`                  |            16 |
| `surface-autonomous-extra-styles-candidates`     |             8 |
| `surface-autonomous-followup-candidates`         |             2 |
| `surface-autonomous-legendary-styles-candidates` |             8 |
| `surface-autonomous-luminous-styles-candidates`  |             8 |
| `surface-autonomous-mythic-styles-candidates`    |             8 |
| `surface-autonomous-new-styles-candidates`       |             8 |
| `surface-autonomous-new-themes-candidates`       |             8 |
| `surface-autonomous-new-themes-r2-candidates`    |             8 |
| `surface-autonomous-prismatic-styles-candidates` |             8 |
| `surface-autonomous-ultra-styles-candidates`     |             8 |

## Target Manifest

The complete machine-readable manifest with full prompt text is archived at:

`assets/art-library/surface-autonomous-visual-lab-shell-continuous-replacements/2026-04-29/prompt-manifest.json`

| Prompt id                                           | Source      | Style                       | Variant | Replacement target                                                                                                                                |
| --------------------------------------------------- | ----------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VL-SHELL-01-CANDIDATE-CERULEAN-CLOISONNE-A`        | `candidate` | `cerulean-cloisonne`        | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-a.png`           |
| `VL-SHELL-02-CANDIDATE-CERULEAN-CLOISONNE-B`        | `candidate` | `cerulean-cloisonne`        | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-b.png`           |
| `VL-SHELL-03-CANDIDATE-GARNET-METEORITE-A`          | `candidate` | `garnet-meteorite`          | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-a.png`             |
| `VL-SHELL-04-CANDIDATE-GARNET-METEORITE-B`          | `candidate` | `garnet-meteorite`          | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-b.png`             |
| `VL-SHELL-05-CANDIDATE-MISTWOOD-SILVERLEAF-A`       | `candidate` | `mistwood-silverleaf`       | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-a.png`          |
| `VL-SHELL-06-CANDIDATE-MISTWOOD-SILVERLEAF-B`       | `candidate` | `mistwood-silverleaf`       | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-b.png`          |
| `VL-SHELL-07-CANDIDATE-PRISM-SLATE-A`               | `candidate` | `prism-slate`               | `A`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-a.png`                  |
| `VL-SHELL-08-CANDIDATE-PRISM-SLATE-B`               | `candidate` | `prism-slate`               | `B`     | `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-b.png`                  |
| `VL-SHELL-09-CANDIDATE-CLEAN-BOARDGAME-A`           | `candidate` | `clean-boardgame`           | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/a/shell-background.png`                             |
| `VL-SHELL-10-CANDIDATE-CLEAN-BOARDGAME-B`           | `candidate` | `clean-boardgame`           | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/b/shell-background.png`                             |
| `VL-SHELL-11-CANDIDATE-CRYSTAL-ANIME-A`             | `candidate` | `crystal-anime`             | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/a/shell-background.png`                               |
| `VL-SHELL-12-CANDIDATE-CRYSTAL-ANIME-B`             | `candidate` | `crystal-anime`             | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/b/shell-background.png`                               |
| `VL-SHELL-13-CANDIDATE-DARK-ARCANE-A`               | `candidate` | `dark-arcane`               | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/a/shell-background.png`                                 |
| `VL-SHELL-14-CANDIDATE-DARK-ARCANE-B`               | `candidate` | `dark-arcane`               | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/b/shell-background.png`                                 |
| `VL-SHELL-15-CANDIDATE-ROYAL-LUXURY-A`              | `candidate` | `royal-luxury`              | `a`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/a/shell-background.png`                                |
| `VL-SHELL-16-CANDIDATE-ROYAL-LUXURY-B`              | `candidate` | `royal-luxury`              | `b`     | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/b/shell-background.png`                                |
| `VL-SHELL-25-CANDIDATE-SAKURA-OBSIDIAN-A`           | `candidate` | `sakura-obsidian`           | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/a/shell-background.png`                |
| `VL-SHELL-26-CANDIDATE-SAKURA-OBSIDIAN-B`           | `candidate` | `sakura-obsidian`           | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/b/shell-background.png`                |
| `VL-SHELL-27-CANDIDATE-SOLAR-ENAMEL-A`              | `candidate` | `solar-enamel`              | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/a/shell-background.png`                   |
| `VL-SHELL-28-CANDIDATE-SOLAR-ENAMEL-B`              | `candidate` | `solar-enamel`              | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/b/shell-background.png`                   |
| `VL-SHELL-29-CANDIDATE-STORMGLASS-RELIQUARY-A`      | `candidate` | `stormglass-reliquary`      | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/a/shell-background.png`           |
| `VL-SHELL-30-CANDIDATE-STORMGLASS-RELIQUARY-B`      | `candidate` | `stormglass-reliquary`      | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/b/shell-background.png`           |
| `VL-SHELL-31-CANDIDATE-VERDANT-BRONZE-A`            | `candidate` | `verdant-bronze`            | `a`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/a/shell-background.png`                 |
| `VL-SHELL-32-CANDIDATE-VERDANT-BRONZE-B`            | `candidate` | `verdant-bronze`            | `b`     | `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/b/shell-background.png`                 |
| `VL-SHELL-33-CANDIDATE-AURORA-PORCELAIN-COURT-A`    | `candidate` | `aurora-porcelain-court`    | `a`     | `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/shell-background/aurora-porcelain-court/a/shell-background.png`    |
| `VL-SHELL-34-CANDIDATE-VERDANT-BRASS-OBSERVATORY-A` | `candidate` | `verdant-brass-observatory` | `a`     | `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/shell-background/verdant-brass-observatory/a/shell-background.png` |
| `VL-SHELL-35-CANDIDATE-BAMBOO-INK-A`                | `candidate` | `bamboo-ink`                | `A`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/bamboo-ink/shell-background-a.png`                 |
| `VL-SHELL-37-CANDIDATE-LAPIS-SUNBURST-A`            | `candidate` | `lapis-sunburst`            | `A`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/lapis-sunburst/shell-background-a.png`             |
| `VL-SHELL-40-CANDIDATE-OPAL-RAIN-B`                 | `candidate` | `opal-rain`                 | `B`     | `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/opal-rain/shell-background-b.png`                  |
| `VL-SHELL-43-CANDIDATE-ARCTIC-ROSEQUARTZ-A`         | `candidate` | `arctic-rosequartz`         | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-a.png`           |
| `VL-SHELL-44-CANDIDATE-ARCTIC-ROSEQUARTZ-B`         | `candidate` | `arctic-rosequartz`         | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-b.png`           |
| `VL-SHELL-45-CANDIDATE-PAPER-LANTERN-A`             | `candidate` | `paper-lantern`             | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-a.png`               |
| `VL-SHELL-46-CANDIDATE-PAPER-LANTERN-B`             | `candidate` | `paper-lantern`             | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-b.png`               |
| `VL-SHELL-47-CANDIDATE-SUNKEN-BRASS-A`              | `candidate` | `sunken-brass`              | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-a.png`                |
| `VL-SHELL-48-CANDIDATE-SUNKEN-BRASS-B`              | `candidate` | `sunken-brass`              | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-b.png`                |
| `VL-SHELL-49-CANDIDATE-THUNDER-AMETHYST-A`          | `candidate` | `thunder-amethyst`          | `A`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-a.png`            |
| `VL-SHELL-50-CANDIDATE-THUNDER-AMETHYST-B`          | `candidate` | `thunder-amethyst`          | `B`     | `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-b.png`            |
| `VL-SHELL-51-CANDIDATE-ASTRAL-ORCHID-A`             | `candidate` | `astral-orchid`             | `A`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/astral-orchid/A/shell-background.png`                 |
| `VL-SHELL-54-CANDIDATE-AURORA-STEEL-B`              | `candidate` | `aurora-steel`              | `B`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/aurora-steel/B/shell-background.png`                  |
| `VL-SHELL-56-CANDIDATE-BASALT-AQUAMARINE-B`         | `candidate` | `basalt-aquamarine`         | `B`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/basalt-aquamarine/B/shell-background.png`             |
| `VL-SHELL-57-CANDIDATE-PORCELAIN-CINNABAR-A`        | `candidate` | `porcelain-cinnabar`        | `A`     | `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/porcelain-cinnabar/A/shell-background.png`            |
| `VL-SHELL-59-CANDIDATE-EMBER-FORGE-A`               | `candidate` | `ember-forge`               | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/a/shell-background.png`                      |
| `VL-SHELL-60-CANDIDATE-EMBER-FORGE-B`               | `candidate` | `ember-forge`               | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/b/shell-background.png`                      |
| `VL-SHELL-61-CANDIDATE-MOONLIT-JADE-A`              | `candidate` | `moonlit-jade`              | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/a/shell-background.png`                     |
| `VL-SHELL-62-CANDIDATE-MOONLIT-JADE-B`              | `candidate` | `moonlit-jade`              | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/b/shell-background.png`                     |
| `VL-SHELL-63-CANDIDATE-NEON-NOIR-A`                 | `candidate` | `neon-noir`                 | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/a/shell-background.png`                        |
| `VL-SHELL-64-CANDIDATE-NEON-NOIR-B`                 | `candidate` | `neon-noir`                 | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/b/shell-background.png`                        |
| `VL-SHELL-65-CANDIDATE-PEARL-OPALINE-A`             | `candidate` | `pearl-opaline`             | `a`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/a/shell-background.png`                    |
| `VL-SHELL-66-CANDIDATE-PEARL-OPALINE-B`             | `candidate` | `pearl-opaline`             | `b`     | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/b/shell-background.png`                    |
| `VL-SHELL-67-CANDIDATE-ASTRAL-NAVIGATOR-A`          | `candidate` | `astral-navigator`          | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/astral-navigator/shell-background-a.png`                 |
| `VL-SHELL-68-CANDIDATE-ASTRAL-NAVIGATOR-B`          | `candidate` | `astral-navigator`          | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/astral-navigator/shell-background-b.png`                 |
| `VL-SHELL-69-CANDIDATE-AURORA-CITADEL-A`            | `candidate` | `aurora-citadel`            | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/aurora-citadel/shell-background-a.png`                   |
| `VL-SHELL-70-CANDIDATE-AURORA-CITADEL-B`            | `candidate` | `aurora-citadel`            | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/aurora-citadel/shell-background-b.png`                   |
| `VL-SHELL-73-CANDIDATE-LOTUS-PORCELAIN-A`           | `candidate` | `lotus-porcelain`           | `A`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/lotus-porcelain/shell-background-a.png`                  |
| `VL-SHELL-74-CANDIDATE-LOTUS-PORCELAIN-B`           | `candidate` | `lotus-porcelain`           | `B`     | `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/shell-background/lotus-porcelain/shell-background-b.png`                  |
| `VL-SHELL-77-CANDIDATE-STORM-TEMPLE-A`              | `candidate` | `storm-temple`              | `a`     | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/storm-temple/shell-background-a.png`                  |
| `VL-SHELL-79-CANDIDATE-SUNKEN-OPAL-A`               | `candidate` | `sunken-opal`               | `a`     | `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/sunken-opal/shell-background-a.png`                   |
| `VL-SHELL-89-CANDIDATE-NOCTURNE-PEARL-A`            | `candidate` | `nocturne-pearl`            | `A`     | `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/nocturne-pearl/shell-background-a.png`             |
| `VL-SHELL-91-CANDIDATE-CRIMSON-ONYX-A`              | `candidate` | `crimson-onyx`              | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/A/shell-background.png`                   |
| `VL-SHELL-92-CANDIDATE-CRIMSON-ONYX-B`              | `candidate` | `crimson-onyx`              | `B`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/B/shell-background.png`                   |
| `VL-SHELL-93-CANDIDATE-GLACIER-SILVER-A`            | `candidate` | `glacier-silver`            | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/glacier-silver/A/shell-background.png`                 |
| `VL-SHELL-97-CANDIDATE-MIDNIGHT-NAVIGATOR-A`        | `candidate` | `midnight-navigator`        | `A`     | `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/midnight-navigator/A/shell-background.png`             |
| `VL-SHELL-99-RUNTIME-CRYSTAL-ANIME-DARK`            | `runtime`   | `crystal-anime`             | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`                                                        |
| `VL-SHELL-100-RUNTIME-ROYAL-LUXURY-DARK`            | `runtime`   | `royal-luxury`              | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`                                                         |
| `VL-SHELL-101-RUNTIME-DARK-ARCANE-DARK`             | `runtime`   | `dark-arcane`               | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`                                                          |
| `VL-SHELL-102-RUNTIME-CLEAN-BOARDGAME-DARK`         | `runtime`   | `clean-boardgame`           | `DARK`  | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/shell-background.png`                                                      |
