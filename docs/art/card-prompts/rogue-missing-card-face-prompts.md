# Rogue Missing Card Face Prompts

This file tracks Rogue-only cards that needed original source card-face art under
`assets/card/faces/source/` before runtime composition into
`apps/desktop/public/assets/cards/`.

## Card Parameters

| Card id  | Name             | Level | Bonus color | Points | Crowns | Bonus count | Ability   | Cost                      | Assigned source file                  |
| -------- | ---------------- | ----- | ----------- | -----: | -----: | ----------: | --------- | ------------------------- | ------------------------------------- |
| `235-bl` | Sapphire Reprise | 2     | blue        |      1 |      0 |           1 | again     | 5 green, 1 pearl          | `assets/card/faces/source/235-bl.png` |
| `255-bk` | Obsidian Cache   | 2     | black       |      1 |      0 |           2 | bonus_gem | 2 blue, 5 white           | `assets/card/faces/source/255-bk.png` |
| `313-re` | Ruby Writ        | 3     | red         |      3 |      1 |           1 | scroll    | 2 green, 7 black, 1 pearl | `assets/card/faces/source/313-re.png` |
| `353-bk` | Midnight Tithe   | 3     | black       |      3 |      1 |           1 | steal     | 7 red, 2 blue, 1 pearl    | `assets/card/faces/source/353-bk.png` |
| `374-jo` | Privy Crown      | 3     | gold        |      2 |      1 |           1 | scroll    | 6 blue, 2 green, 1 pearl  | `assets/card/faces/source/374-jo.png` |

## Generation Requirements

- PNG, `1086x1448`, portrait 3:4.
- Interior-only fantasy source art. Do not include a card frame, border, ornate
  edge, decorative corner frame, or any outer card boundary.
- No text, watermark, point ribbon, numeric costs, bonus gem badge overlays,
  crown badge overlays, or ability medallions.
- Runtime overlays are composed later by `tools/art/render-standard-card.py`.

## Prompts

### 235-bl - Sapphire Reprise

Create a finished fantasy card-face illustration for a Level 2 blue Rogue card
named Sapphire Reprise. Show a sapphire clockwork relay in a moonlit canal
archive: blue crystal rings repeat around a central mechanism to clearly suggest
replay/again, with polished silver-blue architecture and a premium but not royal
feel. Blue dominates. Leave safe, calm margins for later card template
compositing. No card frame, border, ornate edge, decorative corners, text,
numbers, UI icons, point ribbons, cost tokens, crowns, ability medallions, or
watermark.

### 255-bk - Obsidian Cache

Create a finished fantasy card-face illustration for a Level 2 black Rogue card
named Obsidian Cache. Show a shadow alchemist's vault where one obsidian core
releases a second dark crystal shard, clearly communicating a bonus gem reward.
Use black stone, ink smoke, dim silver highlights, and a centered readable
silhouette. Black identity dominates without royal styling. Leave safe, calm
margins for later card template compositing. No card frame, border, ornate edge,
decorative corners, text, numbers, UI icons, point ribbons, cost tokens, crowns,
ability medallions, or watermark.

### 313-re - Ruby Writ

Create a finished fantasy card-face illustration for a Level 3 red Rogue card
named Ruby Writ. Show a royal scarlet archive or war-room tribunal where a
red-sealed privilege scroll is being claimed from a ceremonial lectern, clearly
communicating scroll/privilege. The scene should feel prestigious enough for 3
points and 1 crown through interior architecture, ruby light, red banners, and
ceremonial drama. Red dominates. Leave safe, calm margins for later card
template compositing. No card frame, border, ornate edge, decorative corners,
text, numbers, UI icons, point ribbons, cost tokens, crown object dominating the
scene, ability medallions, or watermark.

### 353-bk - Midnight Tithe

Create a finished fantasy card-face illustration for a Level 3 black Rogue card
named Midnight Tithe. Show a shadowed royal treasury or midnight vault where a
covert court agent is seizing a dark crown relic, making steal immediately
readable while preserving one-crown prestige through the interior setting only.
Use obsidian stone, black jewel accents, narrow silver light, and dark
ceremonial architecture. Black dominates. Leave safe, calm margins for later
card template compositing. No card frame, border, ornate edge, decorative
corners, text, numbers, UI icons, point ribbons, cost tokens, crown object
dominating the scene, ability medallions, or watermark.

### 374-jo - Privy Crown

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for
a Level 3 Joker Rogue card named Privy Crown. Show a mysterious wildcard council
vault with a luminous privilege scroll hovering above an arcane table,
surrounded by pearl-white marble, indigo velvet, violet glass, silver celestial
instruments, mirrored mask motifs, and a subtle rainbow prism joker gem. The
scroll and wildcard prism gem are the central focal objects. Regal but
restrained, mystic and premium, not gold-dominant. Dominant palette: deep
violet, midnight blue, pearl white, smoky silver; gold only as tiny accent trim
below 10%. Leave safe, calm margins for later card template compositing. No card
frame, border, ornate edge, decorative corners, text, numbers, UI icons, point
ribbons, cost tokens, crown, tiara, coronet, crown relic, crown silhouette,
crown emblem, crown-shaped ornament, ability medallions, or watermark.
