# Surface Shell Background Continuous Runtime Replacement Library - 2026-04-29

## Goal

Regenerate only the runtime `shell-background.png` assets for the four current
GemDuel Surface Styles. This pass fixes the prior central-panel failure mode by
requiring one continuous full-board material field with no gameplay stage,
playmat, tablecloth, inset rectangle, framed center, gray overlay, card slots,
deck silhouettes, text, or baked UI.

## Workflow Requirements

- Source skill: `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`
- Built-in generation path: Image Gen, with project-bound outputs copied from
  `C:\Users\sange\.codex\generated_images`
- Archive root:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/`
- Runtime replacement scope:
  `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/shell-background.png`
- Styles: `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`
- Variants generated per style: A/B
- Final target dimensions: `3840x2160` PNG

## Old Prompt Audit

Historical 2026-04-27 shell prompts repeatedly used stage/center/edge language
that can induce a separate middle block:

- `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`
  previously described the shell as a surface behind a centered gameplay stage
  and asked for a subdued center with stronger atmosphere at edges.
- `docs/art/surface-asset-autonomous-prompts-2026-04-27.md` used phrases such
  as centered gameplay stage, centered gameplay area, quieter middle,
  ceremonial edge framing, and low-noise center for the gameplay stage.
- `docs/art/*library*.md` records prior shell candidates whose prompts used
  centered stage, calm center, edge/corner decoration, or central play area
  wording, and several notes warned about stage frames or platform-like centers.
- Runtime code consumes `shell-background.png` as a full-screen background image;
  it does not draw the large center panel seen in the current PNGs.

## Shared Shell Prompt Contract

```text
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Composition: seamless 16:9 continuous material field across the entire canvas. Keep the whole image low-noise and readable through subtle material texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse, integrated into the continuous material, and must not form a frame around the center.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center.
```

## Prompt Manifest

### GSC-CA-SHELL-A

- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `A`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/crystal-anime/A/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-CA-SHELL-A
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel in the Crystal Anime style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: a single uninterrupted dark gemstone tabletop made from smoky crystal, deep sapphire glass, subtle violet-cyan refractive facets, and polished black mineral texture. Crystal qualities must be distributed naturally through the whole field, never forming a central crystal slab.
Style/medium: premium stylized anime game UI environment art, dark jewel material, restrained prismatic glow, production-ready 16:9 background.
Composition/framing: seamless continuous material field across the entire canvas. Keep the whole image low-noise and readable through subtle all-over crystal texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse, integrated into the continuous material, and must not form a frame around the center.
Lighting/mood: dark, readable, cool gemstone ambience with soft distributed glints and no high-glare wash.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, crystal frame, central crystal plate.
```

### GSC-CA-SHELL-B

- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `B`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/crystal-anime/B/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-CA-SHELL-B
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate continuous full-board tabletop background for GemDuel in the Crystal Anime style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: one uninterrupted dark amethyst and blue-black crystal tabletop with fine mineral grain, translucent depth, and tiny scattered iridescent veins blended into the material across the full canvas. The surface must read as one continuous table, not a separate center object.
Style/medium: polished anime fantasy UI background, elegant dark crystal, subtle glow, low-noise production asset.
Composition/framing: seamless 16:9 material field with natural non-repeating variation spread across the whole image. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Ornament must remain sparse and embedded in the material without framing the center.
Lighting/mood: controlled cool glow, soft low-contrast texture, no bright center flare.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, geometric center slab.
```

### GSC-RL-SHELL-A

- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `A`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/royal-luxury/A/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-RL-SHELL-A
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel in the Royal Luxury style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: a single uninterrupted black-gold palace tabletop made from dark lacquer, blackened metal, burnished gold dust, and subtle polished inlay embedded into the same continuous surface. Metal and lacquer details must never outline a center stage.
Style/medium: premium royal fantasy board-game UI environment art, elegant black lacquer, restrained gold, expensive but quiet.
Composition/framing: seamless continuous material field across the entire canvas. Keep the whole image low-noise and readable through subtle lacquer and metal texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse, integrated into the continuous material, and must not form a frame around the center.
Lighting/mood: dark refined gold ambience, soft reflections, no high-glare wash.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, crown icon, throne shape.
```

### GSC-RL-SHELL-B

- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `B`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/royal-luxury/B/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-RL-SHELL-B
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate continuous full-board tabletop background for GemDuel in the Royal Luxury style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: one continuous deep black lacquer tabletop with satin gold flecks, dark bronze undertones, subtle marbled varnish, and very fine ornamental material seams blended throughout the whole image. The gold work must feel embedded in one surface, not arranged as a central frame.
Style/medium: refined palace tabletop material, high-end game UI background, understated black-and-gold luxury.
Composition/framing: seamless 16:9 continuous material field with soft distributed material variation. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse and integrated into the same surface.
Lighting/mood: low-glare polished black, muted gold, readable and calm.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, gold border around the middle.
```

### GSC-DA-SHELL-A

- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `A`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/dark-arcane/A/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-DA-SHELL-A
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel in the Dark Arcane style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: a single uninterrupted obsidian and dark copper tabletop with smoky black mineral texture, faint ember-violet depth, and very sparse abstract non-linguistic geometry embedded into the material. Symbols and geometry must not resemble UI, writing, card placement marks, or a center frame.
Style/medium: dark fantasy game UI environment art, premium obsidian tabletop, restrained arcane ambience, production-ready 16:9 background.
Composition/framing: seamless continuous material field across the entire canvas. Keep the whole image low-noise and readable through subtle all-over obsidian texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be sparse, integrated into the continuous material, and must not form a frame around the center.
Lighting/mood: dim arcane atmosphere, dark copper undertone, controlled glow, no high-glare wash.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, summoning circle, magic diagram.
```

### GSC-DA-SHELL-B

- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `B`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/dark-arcane/B/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-DA-SHELL-B
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate continuous full-board tabletop background for GemDuel in the Dark Arcane style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: one continuous black obsidian tabletop with dark bronze dust, charcoal mineral grain, smoky violet shadows, and subtle abstract scratches blended into the surface. Any mystical detail must be non-readable, non-symbolic, and scattered naturally rather than arranged as a gameplay area.
Style/medium: moody fantasy tabletop UI background, dark premium material, understated magic ambience.
Composition/framing: seamless 16:9 continuous material field with low-noise texture distributed across the full canvas. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface.
Lighting/mood: deep obsidian, faint copper warmth, controlled low contrast, no bright spell glow.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, circular altar.
```

### GSC-CB-SHELL-A

- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `A`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/clean-boardgame/A/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-CB-SHELL-A
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create one continuous full-board tabletop background for GemDuel in the Clean Boardgame style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: a single uninterrupted premium matte stone and satin metal tabletop, dark neutral slate, fine mineral grain, restrained brushed-metal flecks, practical board-game readability. Absolutely no gray center panel.
Style/medium: modern premium tabletop UI background, utilitarian, low-noise, polished but not decorative.
Composition/framing: seamless continuous material field across the entire canvas. Keep the whole image readable through subtle all-over material texture only. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface. Any ornament must be minimal, sparse, and integrated into the continuous material.
Lighting/mood: soft studio-dark surface, restrained contrast, no high-glare wash.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, bevelled middle plate.
```

### GSC-CB-SHELL-B

- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `B`
- Target: `3840x2160`
- Planned archive:
  `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/clean-boardgame/B/shell-background.png`

```text
Use case: stylized-concept
Prompt id: GSC-CB-SHELL-B
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate continuous full-board tabletop background for GemDuel in the Clean Boardgame style. This is a passive environment surface, not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel.
Scene/backdrop: one continuous dark graphite stone tabletop with satin nickel undertone, fine matte texture, soft natural variation, and minimal premium board-game material detail. The whole surface should feel like one uninterrupted table plane, with no functional zone in the middle.
Style/medium: clean modern game UI environment art, practical low-noise tabletop, restrained premium materials.
Composition/framing: seamless 16:9 continuous material field across the full canvas. Keep texture subtle and evenly usable for React overlays. Do not create a central rectangle, inset area, platform, stage, mat, panel, border, vignette box, or any visual boundary that separates the middle from the rest of the surface.
Lighting/mood: dark matte neutral, quiet, readable, no bright center or gray overlay.
Constraints: React renders all cards, gems, labels, counts, buttons, hover rings, selection states, score badges, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, card slots, deck silhouettes, separate tablecloth, separate playmat, centered gameplay stage, central panel, inset rectangle, framed center, gray overlay panel, obvious center/edge split, high-glare wash, noisy functional center, rectangular table insert.
```

## Candidate Results

All Image Gen sources were produced under
`C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72`.
Each source was `1672x941` and was normalized to `3840x2160` PNG with a minimal
center crop plus Lanczos resize. The source aspect ratio was already very close
to 16:9, so no meaningful composition loss was observed.

| Prompt id        | Style             | Variant | Source                                                                                                                                  | Archive                                                                                                                                | Dimensions                             | Score | Recommendation     | Notes                                                                                           |
| ---------------- | ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----: | ------------------ | ----------------------------------------------------------------------------------------------- |
| `GSC-CA-SHELL-A` | `crystal-anime`   | `A`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f226c693748196a4d01de558e8a23d.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/crystal-anime/A/shell-background.png`   | source `1672x941`, archive `3840x2160` |   8.2 | Strong backup      | Continuous crystal material; slightly higher local contrast than B.                             |
| `GSC-CA-SHELL-B` | `crystal-anime`   | `B`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f22709242c8196900c47e0b63a72e8.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/crystal-anime/B/shell-background.png`   | source `1672x941`, archive `3840x2160` |   9.0 | Winner             | Best continuous dark crystal field; no center panel or baked UI.                                |
| `GSC-RL-SHELL-A` | `royal-luxury`    | `A`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f227424c488196acc8f36c7c1b5cec.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/royal-luxury/A/shell-background.png`    | source `1672x941`, archive `3840x2160` |   8.8 | Winner             | Black-gold lacquer reads as one continuous surface; gold speckle is busy but not panel-like.    |
| `GSC-RL-SHELL-B` | `royal-luxury`    | `B`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f22773ff808196a7c2709493af2c25.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/royal-luxury/B/shell-background.png`    | source `1672x941`, archive `3840x2160` |   8.1 | Backup             | Continuous, but ornamental flourishes near sides are closer to the old framing risk.            |
| `GSC-DA-SHELL-A` | `dark-arcane`     | `A`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f227c4dc348196bc80337e8616b5e8.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/dark-arcane/A/shell-background.png`     | source `1672x941`, archive `3840x2160` |   6.6 | Reject / watchlist | Continuous surface, but circular abstract marks can read as arcane symbols or gameplay markers. |
| `GSC-DA-SHELL-B` | `dark-arcane`     | `B`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f227ff71f48196b0a27f97639fb6f4.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/dark-arcane/B/shell-background.png`     | source `1672x941`, archive `3840x2160` |   9.1 | Winner             | Strongest dark arcane material pass; no runes, card slots, or center boundary.                  |
| `GSC-CB-SHELL-A` | `clean-boardgame` | `A`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f2284b6f4c8196bee61502c8181225.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/clean-boardgame/A/shell-background.png` | source `1672x941`, archive `3840x2160` |   9.0 | Winner             | Clean continuous stone surface with subtle premium flecks; no gray center panel.                |
| `GSC-CB-SHELL-B` | `clean-boardgame` | `B`     | `C:\Users\sange\.codex\generated_images\019dd96a-0ec9-79b3-a002-13d0f18dbf72\ig_0ebfdd3c575dce300169f2288e41708196a759ed0ea230f764.png` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/shell-background/clean-boardgame/B/shell-background.png` | source `1672x941`, archive `3840x2160` |   8.6 | Backup             | Very safe and continuous, but less style identity than A.                                       |

Candidate contact sheet:
`assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/contact-sheets/shell-background-candidates-contact-sheet.png`

Winner contact sheet:
`assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/contact-sheets/shell-background-continuous-contact-sheet.png`

Machine-readable source map:
`assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/contact-sheets/source-map.json`

## Final Picks

| Runtime style     | Pick             | Winner archive                                                                                                              | Runtime replacement                                                                          |
| ----------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `crystal-anime`   | `GSC-CA-SHELL-B` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/winners/crystal-anime/shell-background.png`   | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`   |
| `royal-luxury`    | `GSC-RL-SHELL-A` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/winners/royal-luxury/shell-background.png`    | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`    |
| `dark-arcane`     | `GSC-DA-SHELL-B` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/winners/dark-arcane/shell-background.png`     | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`     |
| `clean-boardgame` | `GSC-CB-SHELL-A` | `assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/winners/clean-boardgame/shell-background.png` | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/shell-background.png` |

Original runtime backups:
`assets/art-library/surface-autonomous-shell-continuous-candidates/2026-04-29/runtime-backup/<style>/shell-background.png`

## Validation

Completed checks:

- Metadata script checked all candidate, winner, runtime replacement, and
  runtime-backup PNGs: every file is `3840x2160`.
- Manual candidate contact-sheet review: no promoted winner has a central
  rectangle, playmat, stage, inset panel, gray overlay, readable text, fake
  glyph writing, UI control, card slot, or deck silhouette.
- `pnpm typecheck`: passed.
- Browser runtime preview: passed using the already-running Vite dev server at
  `http://127.0.0.1:5173/` with
  `?surfacePreviewStart=local&surfaceStyle=<style>`.
- Runtime screenshot evidence:
  `artifacts/surface-shell-background-verification-2026-04-29/runtime-screenshot-contact-sheet.png`

Full test suite was not run because this pass changed prompt documentation and
PNG assets only; no code, API, type, config, or runtime path logic changed.
