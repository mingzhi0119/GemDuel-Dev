# Surface Runtime Replacement Worker Prompt Manifest

Created: 2026-04-30T22:06:31.791Z
Source state: `tmp/visual-lab/surface-review-state.json` revision `4338` updated `2026-04-30T21:49:57.700Z`
Plan: `docs/art/visual-lab-review-plans/2026-04-30T22-06-31-791Z/surface-review-plan.json`
Candidate archive root: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/`
Runtime backup root: `assets/art-library/runtime-surface-backups/2026-04-30T22-06-31-791Z/`
Candidate backup root: `assets/art-library/candidate-surface-backups/2026-04-30T22-06-31-791Z/`

Workers must use the imagegen skill and built-in image_gen only. Workers must not edit repo files, copy files into the workspace, normalize files, run scripts, or change runtime assets. Return prompt id, prompt text, generated source absolute path, and failures only.

Global constraints for every prompt:

- No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances.
- Preserve the named style identity and the human annotation mapped into this plan.
- React renders all gameplay content; these PNGs are passive substrate art only.

## Comment Mapping

| Original key                 | Mapped key                           | Comment                                          |
| ---------------------------- | ------------------------------------ | ------------------------------------------------ |
| `runtime:pearl-opaline:dark` | `runtime:current:pearl-opaline:DARK` | 替换素材时 以珍珠白为主要配色，去掉城堡          |
| `runtime:crystal-anime:dark` | `runtime:current:crystal-anime:DARK` | 背景太亮，皇室卡卡背中心空                       |
| `runtime:royal-luxury:dark`  | `runtime:current:royal-luxury:DARK`  | 背景要夜间的金碧辉煌的皇宫，目前宫殿黑色元素太多 |
| `runtime:dark-arcane:dark`   | `runtime:current:dark-arcane:DARK`   | 背景不要城堡                                     |

## Prompts

### SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-A

- Source: `candidate`
- Regen key: `surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:B:gem-panel`
- Slot: `gem-panel`
- Target dimensions: `1254x1254`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/gem-panel/aurora-citadel/SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-A.png`
- Replacement target: `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/gem-panel/aurora-citadel/gem-panel-b.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-A. Source kind: candidate. Style set: surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:B. Style identity: aurora citadel candidate style, moonlit porcelain, jade glass, brushed silver, soft rose-gold pins, restrained aurora refractions.. Slot: gem-panel; target 1254x1254; replacement target assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/gem-panel/aurora-citadel/gem-panel-b.png. Human annotation: regenerate this marked slot while preserving the current style identity. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: gem-panel, exact 1254x1254. Front-facing orthographic square 5x5 grid of empty wells. Straight aligned evenly spaced grid seams; visually align vertical lines near x=100,305,515,726,938,1141 and horizontal lines near y=104,308,512,717,917,1132. Cells must be empty and readable for React-rendered gems. No perspective skew, no gems, no cell icons, no markers. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-B

- Source: `candidate`
- Regen key: `surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:B:gem-panel`
- Slot: `gem-panel`
- Target dimensions: `1254x1254`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/gem-panel/aurora-citadel/SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-B.png`
- Replacement target: `assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/gem-panel/aurora-citadel/gem-panel-b.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel-B. Source kind: candidate. Style set: surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:B. Style identity: aurora citadel candidate style, moonlit porcelain, jade glass, brushed silver, soft rose-gold pins, restrained aurora refractions.. Slot: gem-panel; target 1254x1254; replacement target assets/art-library/surface-autonomous-new-themes-candidates/2026-04-29/gem-panel/aurora-citadel/gem-panel-b.png. Human annotation: regenerate this marked slot while preserving the current style identity. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: gem-panel, exact 1254x1254. Front-facing orthographic square 5x5 grid of empty wells. Straight aligned evenly spaced grid seams; visually align vertical lines near x=100,305,515,726,938,1141 and horizontal lines near y=104,308,512,717,917,1132. Cells must be empty and readable for React-rendered gems. No perspective skew, no gems, no cell icons, no markers. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-A

- Source: `runtime`
- Regen key: `runtime:current:crystal-anime:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/crystal-anime/SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-A. Source kind: runtime. Style set: runtime:current:crystal-anime:DARK. Style identity: transparent luminous crystal anime court, cool blue/cyan/violet crystal refraction, premium and readable; this pass must darken overly bright backgrounds and fill empty royal-card centers.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png. Human annotation: 背景太亮，皇室卡卡背中心空. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-B

- Source: `runtime`
- Regen key: `runtime:current:crystal-anime:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/crystal-anime/SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background-B. Source kind: runtime. Style set: runtime:current:crystal-anime:DARK. Style identity: transparent luminous crystal anime court, cool blue/cyan/violet crystal refraction, premium and readable; this pass must darken overly bright backgrounds and fill empty royal-card centers.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png. Human annotation: 背景太亮，皇室卡卡背中心空. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-A

- Source: `runtime`
- Regen key: `runtime:current:crystal-anime:DARK:royal-card-back`
- Slot: `royal-card-back`
- Target dimensions: `1086x1448`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/royal-card-back/crystal-anime/SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/royal-card-back.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-A. Source kind: runtime. Style set: runtime:current:crystal-anime:DARK. Style identity: transparent luminous crystal anime court, cool blue/cyan/violet crystal refraction, premium and readable; this pass must darken overly bright backgrounds and fill empty royal-card centers.. Slot: royal-card-back; target 1086x1448; replacement target apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/royal-card-back.png. Human annotation: 背景太亮，皇室卡卡背中心空. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: royal-card-back, exact 1086x1448. Prestige card back with complete non-readable center ornament, jewel medallion, crown-like abstract motif, or crystal sovereign geometry. No empty center, no readable symbols, no text, no suit icons. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-B

- Source: `runtime`
- Regen key: `runtime:current:crystal-anime:DARK:royal-card-back`
- Slot: `royal-card-back`
- Target dimensions: `1086x1448`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/royal-card-back/crystal-anime/SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/royal-card-back.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back-B. Source kind: runtime. Style set: runtime:current:crystal-anime:DARK. Style identity: transparent luminous crystal anime court, cool blue/cyan/violet crystal refraction, premium and readable; this pass must darken overly bright backgrounds and fill empty royal-card centers.. Slot: royal-card-back; target 1086x1448; replacement target apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/royal-card-back.png. Human annotation: 背景太亮，皇室卡卡背中心空. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: royal-card-back, exact 1086x1448. Prestige card back with complete non-readable center ornament, jewel medallion, crown-like abstract motif, or crystal sovereign geometry. No empty center, no readable symbols, no text, no suit icons. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-A

- Source: `runtime`
- Regen key: `runtime:current:royal-luxury:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/royal-luxury/SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-A. Source kind: runtime. Style set: runtime:current:royal-luxury:DARK. Style identity: nighttime golden palace luxury, warm gold illumination, deep sapphire/navy enamel, less black visual mass, prestigious but readable.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png. Human annotation: 背景要夜间的金碧辉煌的皇宫，目前宫殿黑色元素太多. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-B

- Source: `runtime`
- Regen key: `runtime:current:royal-luxury:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/royal-luxury/SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background-B. Source kind: runtime. Style set: runtime:current:royal-luxury:DARK. Style identity: nighttime golden palace luxury, warm gold illumination, deep sapphire/navy enamel, less black visual mass, prestigious but readable.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png. Human annotation: 背景要夜间的金碧辉煌的皇宫，目前宫殿黑色元素太多. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-A

- Source: `runtime`
- Regen key: `runtime:current:dark-arcane:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/dark-arcane/SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-A. Source kind: runtime. Style set: runtime:current:dark-arcane:DARK. Style identity: dark arcane observatory and controlled violet/indigo magic, obsidian materials, low-noise readable center; no castles or fortress silhouettes.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png. Human annotation: 背景不要城堡. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-B

- Source: `runtime`
- Regen key: `runtime:current:dark-arcane:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/dark-arcane/SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background-B. Source kind: runtime. Style set: runtime:current:dark-arcane:DARK. Style identity: dark arcane observatory and controlled violet/indigo magic, obsidian materials, low-noise readable center; no castles or fortress silhouettes.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png. Human annotation: 背景不要城堡. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-A

- Source: `runtime`
- Regen key: `runtime:current:pearl-opaline:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/pearl-opaline/SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-A. Source kind: runtime. Style set: runtime:current:pearl-opaline:DARK. Style identity: pearl white opaline fantasy material, nacre, moonlit opal, soft iridescent highlights, readable contrast; no castles.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/shell-background.png. Human annotation: 替换素材时 以珍珠白为主要配色，去掉城堡. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-B

- Source: `runtime`
- Regen key: `runtime:current:pearl-opaline:DARK:shell-background`
- Slot: `shell-background`
- Target dimensions: `3840x1640`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/shell-background/pearl-opaline/SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/shell-background.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background-B. Source kind: runtime. Style set: runtime:current:pearl-opaline:DARK. Style identity: pearl white opaline fantasy material, nacre, moonlit opal, soft iridescent highlights, readable contrast; no castles.. Slot: shell-background; target 3840x1640; replacement target apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/shell-background.png. Human annotation: 替换素材时 以珍珠白为主要配色，去掉城堡. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: shell-background, exact 3840x1640. It covers only the upper shell region: TopBar plus center play area. Keep the gameplay center low-contrast, low-noise, and readable. No framed mat, tablecloth, playmat, center rectangle, platform, strong focal subject, giant sun/moon disk, character, monster, or UI panel. Use one continuous environment/material surface. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-A

- Source: `runtime`
- Regen key: `runtime:current:pearl-opaline:DARK:player-zone`
- Slot: `player-zone`
- Target dimensions: `3840x520`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/player-zone/pearl-opaline/SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-A.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-A. Source kind: runtime. Style set: runtime:current:pearl-opaline:DARK. Style identity: pearl white opaline fantasy material, nacre, moonlit opal, soft iridescent highlights, readable contrast; no castles.. Slot: player-zone; target 3840x520; replacement target apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone.png. Human annotation: 替换素材时 以珍珠白为主要配色，去掉城堡. Variant A: restrained, closest to existing runtime/candidate identity, prioritize readability and conservative integration. Slot requirement: player-zone, exact 3840x520. Wide player rail substrate behind React-rendered player content. Keep zones calm for cards, gems, counters, and identity content. Ornament only at thin trims and outer edges. No baked cards, card silhouettes, reserved slots, labels, counters, buttons, or markers. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```

### SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-B

- Source: `runtime`
- Regen key: `runtime:current:pearl-opaline:DARK:player-zone`
- Slot: `player-zone`
- Target dimensions: `3840x520`
- Planned archive: `assets/art-library/surface-runtime-replacement-candidates/2026-04-30T22-06-31-791Z/player-zone/pearl-opaline/SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-B.png`
- Replacement target: `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone.png`

```text
Create one GemDuel Visual Lab replacement PNG for prompt SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone-B. Source kind: runtime. Style set: runtime:current:pearl-opaline:DARK. Style identity: pearl white opaline fantasy material, nacre, moonlit opal, soft iridescent highlights, readable contrast; no castles.. Slot: player-zone; target 3840x520; replacement target apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone.png. Human annotation: 替换素材时 以珍珠白为主要配色，去掉城堡. Variant B: stronger annotation-directed interpretation, more polished and distinctive, but still gameplay-readable and faithful to the style. Slot requirement: player-zone, exact 3840x520. Wide player rail substrate behind React-rendered player content. Keep zones calm for cards, gems, counters, and identity content. Ornament only at thin trims and outer edges. No baked cards, card silhouettes, reserved slots, labels, counters, buttons, or markers. No text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable writing, fake glyphs, baked UI labels, baked cards, baked counters, gameplay controls, hover rings, selection states, card slots, gem tokens, or placeholder rectangles. React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances. The image must be a clean final game asset, not a UI mockup, not a screenshot, not a contact sheet. Output a single image only.
```
