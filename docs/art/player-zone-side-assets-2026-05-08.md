# PlayerZone Side Asset Regeneration - 2026-05-08

## Scope

- Target slots: `player-zone-p1.png` and `player-zone-p2.png`.
- Runtime destination: `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`.
- Required runtime size: `1920x520`.
- Generated styles: `royal-luxury`, `crystal-anime`, `dark-arcane`, `clean-boardgame`, `pearl-opaline`.
- Existing side-specific style left unchanged: `lotus-porcelain`.

## Project Constraints

- GemDuel uses a fixed `3840x2160` 16:9 desktop stage.
- Player rail is `3840x520`; each side-specific PlayerZone is `1920x520`.
- PlayerZone artwork is an environment/background layer only.
- React renders labels, numbers, icons, gems, cards, card slots, buttons, counters, hover rings, and selection states.
- Generated artwork must not include text, numbers, logos, watermarks, fake UI, cards, card slots, gems, counters, buttons, screenshots, or app chrome.

## Generation Notes

The `imagegen-asset-library-flow` workflow was used with five worker subagents, one per missing runtime style. The built-in image generation tool completed all ten requested images but did not expose source paths to the workers. The main agent recovered the generated sources from `C:\Users\sange\.codex\generated_images` by worker id and timestamp.

The generated source dimensions did not match the requested `1920x520`; most sources were approximately `1704x923`. Each selected source was normalized with high-quality resampling to the runtime contract size `1920x520`. This preserves a complete panel frame and fixes the runtime missing-asset fallback, but it carries a visual risk of non-uniform vertical compression.

Local candidate archive:

- `assets/art-library/player-zone-side-assets-2026-05-08/<style>/player-zone-p1.png`
- `assets/art-library/player-zone-side-assets-2026-05-08/<style>/player-zone-p2.png`

`assets/art-library/` is ignored by git in this repository; the runtime copies under `apps/desktop/public/assets/surfaces/anime-themes/` are the committed assets.

## Selected Assets

| Style           | Slot | Prompt id                               | Source path                                                                                                                             | Source size | Runtime path                                                                               | Runtime size | Score | Risks                                                                                    |
| --------------- | ---- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------ | ------------ | ----- | ---------------------------------------------------------------------------------------- |
| royal-luxury    | P1   | `PZ-SIDE-2026-05-08-royal-luxury-p1`    | `C:\Users\sange\.codex\generated_images\019e05f0-65ea-7df2-a7d1-6b8fe771f5d2\ig_0b767e78b91439ef0169fd6ccdac488198b2aa9e5da8439213.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/player-zone-p1.png`    | `1920x520`   | 8     | Non-uniform normalization; ornate left detail may compete with P1 identity column.       |
| royal-luxury    | P2   | `PZ-SIDE-2026-05-08-royal-luxury-p2`    | `C:\Users\sange\.codex\generated_images\019e05f0-65ea-7df2-a7d1-6b8fe771f5d2\ig_0b767e78b91439ef0169fd6d00e9108198b6d8c566a0e34da0.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/player-zone-p2.png`    | `1920x520`   | 8     | Non-uniform normalization; right ornament is visually heavier than legacy fallback.      |
| crystal-anime   | P1   | `PZ-SIDE-2026-05-08-crystal-anime-p1`   | `C:\Users\sange\.codex\generated_images\019e05f0-c285-7871-8989-17fec2a01cef\ig_0b433129daa3f8f50169fd6cd928cc819a9c6637b8878b31cb.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/player-zone-p1.png`   | `1920x520`   | 8     | Non-uniform normalization; center glow should be watched behind light text.              |
| crystal-anime   | P2   | `PZ-SIDE-2026-05-08-crystal-anime-p2`   | `C:\Users\sange\.codex\generated_images\019e05f0-c285-7871-8989-17fec2a01cef\ig_0b433129daa3f8f50169fd6cfdd054819aac0c9d081a4499f7.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/player-zone-p2.png`   | `1920x520`   | 7     | Non-uniform normalization; background scene detail is busier than P1.                    |
| dark-arcane     | P1   | `PZ-SIDE-2026-05-08-dark-arcane-p1`     | `C:\Users\sange\.codex\generated_images\019e05f1-361b-73e1-b0b3-7287579b14bb\ig_04aedb0a9fee731c0169fd6cfa2340819ba6f420c7034577e6.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/player-zone-p1.png`     | `1920x520`   | 8     | Non-uniform normalization; very dark palette may reduce border visibility.               |
| dark-arcane     | P2   | `PZ-SIDE-2026-05-08-dark-arcane-p2`     | `C:\Users\sange\.codex\generated_images\019e05f1-361b-73e1-b0b3-7287579b14bb\ig_04aedb0a9fee731c0169fd6d1dfddc819b8005a1b3c4323e00.png` | `1756x896`  | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/player-zone-p2.png`     | `1920x520`   | 8     | Non-uniform normalization; bright right energy may need visual review under active glow. |
| clean-boardgame | P1   | `PZ-SIDE-2026-05-08-clean-boardgame-p1` | `C:\Users\sange\.codex\generated_images\019e05f1-8013-7d72-84d8-3751b682c0fd\ig_0437875557a086200169fd6d084838819bbdd95d13020981b1.png` | `1705x923`  | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/player-zone-p1.png` | `1920x520`   | 9     | Non-uniform normalization; safest readability profile.                                   |
| clean-boardgame | P2   | `PZ-SIDE-2026-05-08-clean-boardgame-p2` | `C:\Users\sange\.codex\generated_images\019e05f1-8013-7d72-84d8-3751b682c0fd\ig_0437875557a086200169fd6d3b3978819ba54636d71061f0e5.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/player-zone-p2.png` | `1920x520`   | 9     | Non-uniform normalization; safest readability profile.                                   |
| pearl-opaline   | P1   | `PZ-SIDE-2026-05-08-pearl-opaline-p1`   | `C:\Users\sange\.codex\generated_images\019e05f1-cb94-7690-960e-b50a16236459\ig_0cc08f27e8b1bc3d0169fd6d2f0404819b9b980a2923ae7381.png` | `1705x923`  | `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone-p1.png`   | `1920x520`   | 7     | Non-uniform normalization; light center may need foreground contrast review.             |
| pearl-opaline   | P2   | `PZ-SIDE-2026-05-08-pearl-opaline-p2`   | `C:\Users\sange\.codex\generated_images\019e05f1-cb94-7690-960e-b50a16236459\ig_0cc08f27e8b1bc3d0169fd6d64d698819ba3f15dff5f620d71.png` | `1704x923`  | `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/player-zone-p2.png`   | `1920x520`   | 7     | Non-uniform normalization; light center may need foreground contrast review.             |

## Pick Advice

- Strongest runtime-safe pair: `clean-boardgame`, because it has the quietest center and least ornate interference.
- Strongest default-style fix: `royal-luxury`, because it replaces the missing P1/P2 files that caused the observed fallback crop/stretch problem.
- Watchlist: `pearl-opaline`, because the center is visually light and should be checked under all foreground text treatments.
