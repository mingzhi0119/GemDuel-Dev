# Card Art Prompt Archive

This archive preserves the prompt trace for the accepted GemDuel card-face artwork. Unframed source card faces live under `assets/card/faces/source/`, while runtime final composed card images live under `apps/desktop/public/assets/cards/` and are referenced by canonical `card_id`.

## Archive Notes

- Consolidated from retired per-batch prompt files in the legacy card-art working folder.
- The 22 early card prompts were regenerated on 2026-04-23 because those images only had legacy artwork-map provenance and some did not clearly match card metadata.
- Repeated global generation rules, local generated-image paths, and empty unmatched-map files were removed from the active workflow.
- Card ids match `packages/shared/src/data/realCards*.ts`; runtime final card assets use `/assets/cards/{card_id}.png`.

## Prompt Entries

### l1-bk-0

- Source prompt file: `L1-BLACK-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bk-0.png`
- Card data: level 1, bonus_color=black, ability=none, points=0, crowns=0

Prompt:

Card data: level 1, black, `ability=none`, `points=0`, `crowns=0`

Prompt:

Create a fantasy card illustration with an ornate silver octagonal Level 1 frame, consistent with the rest of the L1 set. Show a silent obsidian reliquary chamber with a single black focal relic on a low pedestal, surrounded by dim silver candlelight, charcoal silk banners, faint runic dust, and polished dark stone. The mood is restrained, foundational, and readable at card size, with black as the dominant identity color but without a required gemstone look. Keep the composition centered and elegant, low-complexity, high clarity, silver frame only, no text, no symbols overlay, no watermark.

### l1-bk-1

- Source prompt file: `L1-BLACK-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bk-1.png`
- Card data: level 1, bonus_color=black, ability=again, points=0, crowns=0

Prompt:

Card data: level 1, black, `ability=again`, `points=0`, `crowns=0`

Prompt:

Create a fantasy card illustration with the same ornate silver octagonal Level 1 frame. Depict a black-themed time-loop sanctum: a suspended obsidian pendulum, circular eclipse rings, repeated shadow trails, and curling black silk or smoke spiraling around the center to suggest replay, return, and momentum. The card should feel nimble and recursive rather than regal, with crisp readability and a strong central silhouette. Black must remain the key color identity, silver frame only, no gold accents, no text, no UI, no watermark.

### l1-bk-2

- Source prompt file: `L1-BLACK-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bk-2.png`
- Card data: level 1, bonus_color=black, ability=bonus_gem, points=0, crowns=0

Prompt:

Card data: level 1, black, `ability=bonus_gem`, `points=0`, `crowns=0`

Prompt:

Create a fantasy card illustration with the same ornate silver octagonal Level 1 frame. Show a shadow alchemist's altar where a black relic is releasing an extra shard, extra spark, or secondary black fragment from its core, clearly communicating a bonus reward. The scene can use obsidian, ink, smoke, or dark crystal motifs, but the key idea is that one black source is producing another. Keep the visual read immediate and centered, with silver trim, cool highlights, layered darkness, and no text, no number badges, no watermark.

### l1-bk-3

- Source prompt file: `L1-BLACK-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bk-3.png`
- Card data: level 1, bonus_color=black, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, black, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create a fantasy card illustration with the same ornate silver octagonal Level 1 frame. Depict a more prestigious black-aligned environment than a basic L1 card: a midnight observatory balcony, black marble monument, or elevated shadow shrine lit by pale moonlight and silver reflections. The focal object should feel valuable and accomplished, signaling 1 point, but it must not read as royal. Use refined composition, stronger contrast, and a more memorable centerpiece while keeping black as the core color identity. No gold frame, no UI, no text, no watermark.

### l1-bk-4

- Source prompt file: `L1-BLACK-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bk-4.png`
- Card data: level 1, bonus_color=black, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, black, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create a fantasy card illustration with the same ornate silver octagonal Level 1 frame, but introduce clear royal styling because this card carries a crown. Show a black royal regalia scene: an obsidian crown, dark velvet, silver filigree, a moonlit throne dais, and noble ceremonial atmosphere. The art should feel unmistakably regal without upgrading the frame to gold. Black remains the main color identity through crown jewels, fabric, throne materials, or shadow-glass elements. Keep the composition centered, elegant, and readable at card size, with no text, no UI symbols, and no watermark.

### l1-re-5

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-re-5.png`
- Card data: level 1, bonus_color=red, ability=none, points=0, crowns=0

Prompt:

Card data: level 1, red, `ability=none`, `points=0`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 vertical aspect ratio for a Level 1 red card. Show a quiet crimson reliquary courtyard with a single red crystal relic on a low pedestal, ember-lit stone arches, red banners, warm sunset haze, and polished dark floors reflecting ruby light. The scene should feel foundational and color-driven, not royal and not prestigious: no crown motifs, no throne, no looping or replay symbolism, and no extra shard reward. Keep one clear centered focal subject, leave safe margins on all edges for later L1_Edge compositing, no frame, no border, no text, no numbers, no UI icons, no watermark.

### l1-re-6

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-re-6.png`
- Card data: level 1, bonus_color=red, ability=again, points=0, crowns=0

Prompt:

Card data: level 1, red, `ability=again`, `points=0`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 vertical aspect ratio for a Level 1 red card. Depict a crimson canal terrace or ember-lit red city overlook where repeating arches, mirrored bridges, red pennants, and circular flame trails guide the eye back toward a central ruby marker, clearly communicating replay, return, cyclical motion, and momentum. Red must dominate through banners, domes, crystal markers, and warm firelight, while the card remains non-royal and 0-point in mood. Keep the composition readable at card size with a strong central path, leave safe margins on all edges for later L1_Edge compositing, no frame, no border, no text, no numbers, no UI icons, no watermark.

### l1-re-7

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-re-7.png`
- Card data: level 1, bonus_color=red, ability=bonus_gem, points=0, crowns=0

Prompt:

Card data: level 1, red, `ability=bonus_gem`, `points=0`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 vertical aspect ratio for a Level 1 red card. Show an ornate red crystal focus or ceremonial gem-staff resting on deep crimson cloth, with one dominant ruby source visibly releasing a second smaller red shard, spark, or gem fragment from its core so the bonus reward is obvious at a glance. Use dark metal filigree, ruby glow, and controlled magical light, but avoid royal crown cues, throne imagery, and prestige framing. Keep the main relic centered and uncluttered, leave safe margins on all edges for later L1_Edge compositing, no frame, no border, no text, no numbers, no UI icons, no watermark.

### l1-re-8

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-re-8.png`
- Card data: level 1, bonus_color=red, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, red, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 red card. Show a high-value red-aligned environment such as a crimson shrine, ember-lit monument, or ruby chamber, clearly more prestigious than a basic starter card but not royal. Red must dominate through focal relic, light, banners, flame, or stone accents. No frame, no text, no watermark.

### l1-re-9

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-re-9.png`
- Card data: level 1, bonus_color=red, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, red, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 red card with a crown. Show unmistakable royal red regalia: a ruby crown, ceremonial red drapery, court architecture, and noble atmosphere. The card must feel regal because it carries a crown, while keeping red as the dominant identity color. No frame, no text, no watermark.

### l1-gr-10

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-gr-10.png`
- Card data: level 1, bonus_color=green, ability=none, points=0, crowns=0

Prompt:

Card data: level 1, green, `ability=none`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 green card. Show a quiet verdant sanctum with a green focal relic, moss-dark stone, vinework, filtered light, and a calm foundational mood. Green should read immediately through foliage, jade glass, emerald light, or botanical structure, without forcing a gemstone shrine. No frame, no text, no watermark.

### l1-gr-11

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-gr-11.png`
- Card data: level 1, bonus_color=green, ability=again, points=0, crowns=0

Prompt:

Card data: level 1, green, `ability=again`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 green card. Depict a looping growth chamber where roots, vines, or jade rings spiral around a green relic in repeating cycles, clearly communicating replay, recurrence, and momentum. Green must dominate the scene and the silhouette must stay readable at card size. No frame, no text, no watermark.

### l1-gr-12

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-gr-12.png`
- Card data: level 1, bonus_color=green, ability=bonus_gem, points=0, crowns=0

Prompt:

Card data: level 1, green, `ability=bonus_gem`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 green card. Show a living altar where one emerald source relic blossoms, splits, or emits a second smaller green fragment, making the extra reward obvious at a glance. The image should feel magical, fertile, and controlled, with green as the strong identity color. No frame, no text, no watermark.

### l1-gr-13

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-gr-13.png`
- Card data: level 1, bonus_color=green, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, green, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 green card. Show a more prestigious green-aligned location such as a lofty jade terrace, sacred arbor platform, or emerald-lit garden monument that signals 1-point value without becoming royal. Green must remain the core visual identity. No frame, no text, no watermark.

### l1-gr-14

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-gr-14.png`
- Card data: level 1, bonus_color=green, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, green, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 green card with a crown. Show royal green styling: an emerald crown, noble banners, ceremonial garden court, and sovereign architecture or regalia. The image must feel courtly and regal because the card carries a crown. No frame, no text, no watermark.

### l1-bl-15

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bl-15.png`
- Card data: level 1, bonus_color=blue, ability=none, points=0, crowns=0

Prompt:

Card data: level 1, blue, `ability=none`, `points=0`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 vertical aspect ratio for a Level 1 blue card. Show a calm midnight celestial chart or sapphire star-map chamber with one central blue gem compass emitting a steady blue beam into a deep star field, surrounded by delicate constellations and cool astronomical lines. The image should read as blue identity and quiet environment only: no replay loops, no extra shard reward, no crown motifs, no throne, and no royal atmosphere. Keep one clean focal sapphire at center with broad dark-blue negative space, leave safe margins on all edges for later L1_Edge compositing, no frame, no border, no text, no numbers, no UI icons, no watermark.

### l1-bl-16

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bl-16.png`
- Card data: level 1, bonus_color=blue, ability=again, points=0, crowns=0

Prompt:

Card data: level 1, blue, `ability=again`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 blue card. Show a moonlit tidal observatory where a floating sapphire astrolabe keeps tracing the same arc through mist and sea-light, with repeating wave rings and cyclical motion that clearly suggests replay and return. Blue must dominate through water, night sky reflections, and the focal relic. No border, no text, no watermark.

### l1-bl-17

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bl-17.png`
- Card data: level 1, bonus_color=blue, ability=bonus_gem, points=0, crowns=0

Prompt:

Card data: level 1, blue, `ability=bonus_gem`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 blue card. Show a deepwater altar where one blue source relic releases a second smaller blue shard from its core, with liquid light, spray, and cold luminous energy making the bonus reward instantly readable. Blue must be the identity color. No frame, no text, no watermark.

### l1-bl-18

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bl-18.png`
- Card data: level 1, bonus_color=blue, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, blue, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 blue card. Depict a refined blue prestige scene such as a cliffside star pool, sapphire monument, or elevated sea observatory, elegant and valuable enough to signal 1 point but not royal. Blue should dominate through sky, water, glass, or luminous stone. No frame, no text, no watermark.

### l1-bl-19

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-bl-19.png`
- Card data: level 1, bonus_color=blue, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, blue, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 blue card with a crown. Show unmistakable royal blue regalia: a sapphire crown on a ceremonial cushion, moonlit court architecture, noble drapery, and a sovereign atmosphere. The art must feel regal because the card has a crown, while blue remains the main color identity. No frame, no text, no watermark.

### l1-wh-20

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-wh-20.png`
- Card data: level 1, bonus_color=white, ability=none, points=0, crowns=0

Prompt:

Card data: level 1, white, `ability=none`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 white card. Show a bright alabaster sanctum with a clear white focal element, soft luminous air, pale stone, and calm sacred atmosphere. White should dominate through light, ivory, crystal glass, snow marble, or radiant architecture. No frame, no text, no watermark.

### l1-wh-21

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-wh-21.png`
- Card data: level 1, bonus_color=white, ability=again, points=0, crowns=0

Prompt:

Card data: level 1, white, `ability=again`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 white card. Depict a luminous cyclical hall where white rings, mirrored light paths, or repeating celestial arcs clearly suggest replay, return, and recurrence. The subject should stay centered and readable at card size, with white as the identity color. No frame, no text, no watermark.

### l1-wh-22

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-wh-22.png`
- Card data: level 1, bonus_color=white, ability=bonus_gem, points=0, crowns=0

Prompt:

Card data: level 1, white, `ability=bonus_gem`, `points=0`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 white card. Show a radiant altar where a white source relic emits a second smaller white fragment, spark, or shard, making the bonus reward immediately readable. Use clean bright lighting, pale materials, and crisp focal clarity. No frame, no text, no watermark.

### l1-wh-23

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-wh-23.png`
- Card data: level 1, bonus_color=white, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, white, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 white card. Show a refined white prestige setting such as a high alabaster terrace, luminous archive, or sacred marble monument that signals 1-point value without reading as royal. White should remain the dominant identity through light, fabric, architecture, or focal relic. No frame, no text, no watermark.

### l1-wh-24

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-wh-24.png`
- Card data: level 1, bonus_color=white, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, white, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 white card with a crown. Show royal white styling: a pearl-white or silver-white crown, noble curtains, moonlit or sunlit ceremonial court, and a sovereign atmosphere. The image must clearly feel regal because the card has a crown. No frame, no text, no watermark.

### l1-po-25

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-po-25.png`
- Card data: level 1, bonus_color=null, ability=none, points=3, crowns=0

Prompt:

Card data: level 1, neutral, `ability=none`, `points=3`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 neutral card with unusually high prestige. Show a monumental neutral masterpiece: pale stone, pearl-white light, balanced geometry, sacred symmetry, and a centerpiece that feels rare and exceptional enough to justify 3 points. Avoid strong allegiance to any one gem color; the scene should read as neutral, luminous, and grand rather than royal. No frame, no text, no watermark.

### l1-jo-26

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-jo-26.png`
- Card data: level 1, bonus_color=gold, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, gold, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 gold card. Show a luminous gilded relic chamber with warm gold identity, polished metalwork, radiant highlights, and a centerpiece valuable enough to imply 1 point without royal cues. Gold should be the unmistakable color identity through light, metal, and ornament. No frame, no text, no watermark.

### l1-jo-27

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-jo-27.png`
- Card data: level 1, bonus_color=gold, ability=none, points=0, crowns=1

Prompt:

Card data: level 1, gold, `ability=none`, `points=0`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 gold card with a crown. Show a sovereign golden regalia scene with a radiant crown, ceremonial throne dais, noble fabrics, and regal symmetry. The card must feel royal because it has a crown, and gold must dominate the identity. No frame, no text, no watermark.

### l1-jo-28

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-jo-28.png`
- Card data: level 1, bonus_color=gold, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, gold, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 gold card. Depict a different gold prestige subject from the other gold cards, such as a sunlit reliquary bridge, gilded vault mechanism, or radiant ceremonial artifact, clearly valuable enough to imply 1 point but not royal. No frame, no text, no watermark.

### l1-jo-29

- Source prompt file: `L1-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel1.ts`
- Runtime asset: `/assets/cards/l1-jo-29.png`
- Card data: level 1, bonus_color=gold, ability=none, points=1, crowns=0

Prompt:

Card data: level 1, gold, `ability=none`, `points=1`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 1 gold card. Show another distinct gold prestige composition, such as an illuminated treasury altar, solar mirror relic, or warm metallic sanctuary, again signaling 1-point value without royal styling. Gold should remain the dominant identity color. No frame, no text, no watermark.

### l2-bk-32

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bk-32.png`
- Card data: level 2, bonus_color=black, ability=steal, points=1, crowns=0

Prompt:

Card data: level 2, black, `ability=steal`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 black card. Show a covert, predatory theft inside a rich obsidian vault: one black crystal relic is being silently taken from a shadowed pedestal by a dark-gloved hand or clawlike silhouette, with black marble, smoke, narrow candlelight, and restrained gold luxury suggesting 1-point prestige without royal cues. Black must dominate the identity, and the single stolen black relic must be the clear focal bonus source. No frame, no border, no text, no written numbers, no UI icons, no watermark. Keep the main subject centered with safe, low-detail margins for later L2_Edge compositing.

### l2-bk-33

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bk-33.png`
- Card data: level 2, bonus_color=black, ability=none, points=1, crowns=0

Prompt:

Card data: level 2, black, `ability=none`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 black card. Depict a refined dark reliquary chamber with exactly two matched obsidian bonus relics on twin pedestals, black stone arches, lacquered shadow surfaces, candle reflections, and modest rare-metal accents that signal 1-point value. The scene should feel prestigious but not royal, with no throne, no crown, and no regalia. Black must be the dominant identity color, and the paired black relics must read as the two bonus sources. No frame, no border, no text, no written numbers, no UI icons, no watermark. Keep the composition readable at card size with safe margins for later L2_Edge compositing.

### l2-bk-34

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bk-34.png`
- Card data: level 2, bonus_color=black, ability=none, points=2, crowns=1

Prompt:

Card data: level 2, black, `ability=none`, `points=2`, `crowns=1`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 black card with one crown. Show a royal black ceremonial hall centered on a single obsidian crown-relic or black sovereign jewel displayed on a raised dais, surrounded by dark velvet banners, noble black marble architecture, subtle court regalia, and high ceremonial lighting that clearly feels like 2-point prestige. The image must read royal through the interior scene, not through any card frame, and the single black focal relic must remain the only bonus source. No frame, no border, no text, no written numbers, no UI icons, no watermark. Keep important details away from the outer edges for L2_Edge compositing.

### l2-bk-35

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bk-35.png`
- Card data: level 2, bonus_color=black, ability=scroll, points=2, crowns=0

Prompt:

Card data: level 2, black, `ability=scroll`, `points=2`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 black card. Show a prestigious dark archive where a sealed black decree scroll rests on an obsidian lectern under high ceremonial lighting, with rich shadow, lacquered stone, black silk, and rare metallic accents that clearly signal 2-point value. Black must dominate the mood and the focal scroll must be instantly readable. No frame, no text, no watermark.

### l2-re-36

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-re-36.png`
- Card data: level 2, bonus_color=red, ability=steal, points=1, crowns=0

Prompt:

Card data: level 2, red, `ability=steal`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 red card. Show a covert crimson treasure chamber where a masked gloved hand or hooked shadow-tool is illicitly stealing one glowing red source relic from a guarded pedestal, with predatory lighting, ember haze, lacquered red stone, and enough refinement to signal 1 point without royal cues. Keep the main action centered with generous low-detail edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-re-37

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-re-37.png`
- Card data: level 2, bonus_color=red, ability=none, points=1, crowns=0

Prompt:

Card data: level 2, red, `ability=none`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 red card. Depict a refined crimson reliquary hall with exactly two matched red source relics presented as a unified central altar arrangement, warm forge-glow, ruby glass, red banners, and restrained prestige suitable for 1 point. The scene should not imply an active ability and must not feel royal. Keep all important forms inside a central safe area with calm edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-re-38

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-re-38.png`
- Card data: level 2, bonus_color=red, ability=none, points=2, crowns=1

Prompt:

Card data: level 2, red, `ability=none`, `points=2`, `crowns=1`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 red card with 1 crown. Show a royal crimson ceremonial hall where one ruby-red crown and one red source relic share a radiant dais, surrounded by noble red drapery, court architecture, polished stone, and sovereign regalia. The image should feel valuable enough for 2 points and clearly royal because the card has 1 crown, with no active ability symbolism. Keep a generous central safe area and low-detail edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-re-39

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-re-39.png`
- Card data: level 2, bonus_color=red, ability=scroll, points=2, crowns=0

Prompt:

Card data: level 2, red, `ability=scroll`, `points=2`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 red card. Show a prestigious crimson archive where one sealed red decree scroll rests on a carved stone lectern, marked by wax seals, ribbon bands, ember-lit shelves, and ceremonial document handling without readable writing. The scroll must read as an official decree or archive relic, and the scene should feel rare enough for 2 points without royal cues. Keep the focal scroll centered with safe, low-detail margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-gr-40

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-gr-40.png`
- Card data: level 2, bonus_color=green, ability=steal, points=1, crowns=0

Prompt:

Card data: level 2, green, `ability=steal`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 green card. Show a covert emerald conservatory vault where a cunning gloved hand slips one glowing green source relic from a vine-carved pedestal, with predatory shadow, jade glass, cultivated foliage, and controlled green light. The scene should clearly communicate illicit acquisition and feel worth 1 point without royal styling. Keep the action centered with low-detail edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-gr-41

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-gr-41.png`
- Card data: level 2, bonus_color=green, ability=none, points=1, crowns=0

Prompt:

Card data: level 2, green, `ability=none`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 green card. Depict a polished living garden archive with exactly two matched green source relics nested in a single jade-and-vine altar, filtered emerald light, cultivated leaves, and refined natural architecture suitable for 1 point. The image should be calm, prestigious, and non-royal, with no active ability symbolism. Keep the paired focal elements in the central safe area and leave quiet edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-gr-42

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-gr-42.png`
- Card data: level 2, bonus_color=green, ability=none, points=2, crowns=1

Prompt:

Card data: level 2, green, `ability=none`, `points=2`, `crowns=1`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 green card with 1 crown. Show a royal emerald garden court where one green source relic and one ceremonial crown motif sit on a noble vine-carved dais, with cultivated foliage, court banners, jade architecture, and sovereign atmosphere. The scene must read as royal because the card has 1 crown and prestigious enough for 2 points, without suggesting an active ability. Keep the composition centered with safe low-detail margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-gr-43

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-gr-43.png`
- Card data: level 2, bonus_color=green, ability=scroll, points=2, crowns=0

Prompt:

Card data: level 2, green, `ability=scroll`, `points=2`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 green card. Depict a refined living archive where an emerald decree scroll lies open on an elevated vine-carved stand in a luminous garden library, with jade glass, cultivated foliage, sacred script energy, and elevated prestige appropriate for a 2-point card. Green must be the clear identity color. No frame, no text, no watermark.

### l2-bl-44

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bl-44.png`
- Card data: level 2, bonus_color=blue, ability=steal, points=1, crowns=0

Prompt:

Card data: level 2, blue, `ability=steal`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 blue card. Show a covert, predatory sapphire heist inside a moonlit blue vault: one luminous blue crystal is being lifted from a pedestal by a stealthy shadow hand, reflected in polished dark stone and cold blue glass, with narrow beams of light and watchful, dangerous atmosphere. Blue must dominate the identity, the steal ability must read as illicit acquisition rather than open ceremony, and the single blue relic must be the clear bonus source. No frame, no border, no text, no written numbers, no UI icons, no watermark. Keep the focal action centered with safe margins for later L2_Edge compositing.

### l2-bl-45

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bl-45.png`
- Card data: level 2, bonus_color=blue, ability=none, points=1, crowns=0

Prompt:

Card data: level 2, blue, `ability=none`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 blue card. Depict an elegant sapphire observatory chamber with exactly two matched blue crystal bonus relics glowing on paired stands, deep blue drapery, cool moonlight, polished stone, and refined architectural detail that suggests 1-point prestige. The scene should be valuable and atmospheric but not royal, with no crown, throne, or sovereign regalia. Blue must be the dominant identity color, and the two blue relics must read clearly as the two bonus sources. No frame, no border, no text, no written numbers, no UI icons, no watermark. Leave clean safe margins for later L2_Edge compositing.

### l2-bl-46

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bl-46.png`
- Card data: level 2, bonus_color=blue, ability=none, points=2, crowns=1

Prompt:

Card data: level 2, blue, `ability=none`, `points=2`, `crowns=1`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict vertical 3:4 aspect ratio for a Level 2 blue card with one crown. Show a royal sapphire court interior centered on a single blue crown-jewel relic on a ceremonial dais, with moonlit blue banners, noble arches, polished palace stone, restrained regalia, and a sovereign atmosphere that clearly supports one crown and 2-point prestige. Blue must dominate through light, fabric, and the central relic, while royal flavor comes from the throne-room setting rather than any generated frame. No frame, no border, no text, no written numbers, no UI icons, no watermark. Keep the main subject centered and preserve safe outer margins for L2_Edge compositing.

### l2-bl-47

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-bl-47.png`
- Card data: level 2, bonus_color=blue, ability=scroll, points=2, crowns=0

Prompt:

Card data: level 2, blue, `ability=scroll`, `points=2`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 blue card. Show a moonlit oceanic archive where a sapphire decree scroll floats above a polished pedestal in a vaulted observatory library, with tidal reflections, deep blue drapery, elegant architecture, and enough grandeur to read as a 2-point treasure. Blue must dominate through light, fabric, and surrounding atmosphere. No frame, no text, no watermark.

### l2-wh-48

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-wh-48.png`
- Card data: level 2, bonus_color=white, ability=steal, points=1, crowns=0

Prompt:

Card data: level 2, white, `ability=steal`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 white card. Show a covert alabaster sanctuary theft where a pale gloved hand or slender shadow-tool quietly removes one luminous white source relic from a marble pedestal, with crisp white light, predatory stillness, pearl surfaces, and sacred architecture. The action must read as illicit acquisition while staying elegant enough for 1 point and not royal. Keep the focal theft centered with safe low-detail margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-wh-49

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-wh-49.png`
- Card data: level 2, bonus_color=white, ability=none, points=1, crowns=0

Prompt:

Card data: level 2, white, `ability=none`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 white card. Depict a refined alabaster reliquary with exactly two matched white source relics glowing together on one clean central altar, surrounded by pearl marble, soft celestial light, pale crystal, and restrained prestige appropriate for 1 point. The scene should be non-royal and should not imply an active ability. Keep the focal pair within a central safe area and leave calm edge margins for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-wh-50

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-wh-50.png`
- Card data: level 2, bonus_color=white, ability=none, points=2, crowns=1

Prompt:

Card data: level 2, white, `ability=none`, `points=2`, `crowns=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 white card with a crown and 2 points. Show an unmistakably royal white ceremonial hall with a pearl-white crown displayed on a radiant dais, noble marble architecture, pale banners, refined regalia, and high prestige that feels both sovereign and valuable. White must remain the dominant identity color. No frame, no text, no watermark.

### l2-wh-51

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-wh-51.png`
- Card data: level 2, bonus_color=white, ability=scroll, points=2, crowns=0

Prompt:

Card data: level 2, white, `ability=scroll`, `points=2`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 white card. Show a luminous sanctum archive where a sacred white scroll is presented on an alabaster stand amid radiant columns, soft celestial light, and immaculate ceremonial order. The scroll must read clearly, and the overall scene should feel richer and rarer than a starter card to justify 2 points. No frame, no text, no watermark.

### l2-po-53

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-po-53.png`
- Card data: level 2, bonus_color=null, ability=none, points=5, crowns=0

Prompt:

Card data: level 2, neutral, `ability=none`, `points=5`, `crowns=0`, `bonusCount=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 neutral card of exceptional prestige. Show a monumental neutral archive-reliquary built from pale stone, pearl light, clear crystal, and balanced geometry, with one grand central masterpiece that feels valuable enough for 5 points while avoiding any strong faction color, bonus source, crown motif, throne cue, or royal atmosphere. Keep the masterpiece centered with generous safe margins and low-detail edges for L2_Edge compositing. No frame, no border, no text, no numbers, no UI icons, no watermark.

### l2-jo-54

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-jo-54.png`
- Card data: level 2, bonus_color=gold, ability=none, points=2, crowns=0

Prompt:

Card data: level 2, gold, `ability=none`, `points=2`, `crowns=0`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 gold card. Show a high-prestige gilded reliquary interior with a single luxurious focal artifact, radiant warm light, intricate metalwork, and ceremonial opulence that clearly signals 2-point value without becoming explicitly royal. Gold must dominate the visual identity. No frame, no text, no watermark.

### l2-jo-55

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-jo-55.png`
- Card data: level 2, bonus_color=gold, ability=none, points=0, crowns=2

Prompt:

Card data: level 2, gold, `ability=none`, `points=0`, `crowns=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 gold card with 2 crowns. Show a strongly royal golden throne-room composition with twin crown motifs, sovereign regalia, lavish banners, and a stately ceremonial atmosphere. The scene should feel more explicitly courtly than the non-crown gold card, with gold as the dominant identity color. No frame, no text, no watermark.

### l2-jo-56

- Source prompt file: `L2-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel2.ts`
- Runtime asset: `/assets/cards/l2-jo-56.png`
- Card data: level 2, bonus_color=gold, ability=none, points=0, crowns=2

Prompt:

Card data: level 2, gold, `ability=none`, `points=0`, `crowns=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 gold card with 2 crowns. Create a distinct second royal gold composition from the other crowned gold card, such as a sunlit coronation vault, paired golden crowns on a ceremonial bridge, or an imperial regalia chamber with strong symmetry and court grandeur. Keep gold as the main identity color and make the royal status unmistakable. No frame, no text, no watermark.

### l2-at-71

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l2-at-71.png`
- Card data: level 2, bonus_color=red, ability=again, points=1, crowns=0

Prompt:

Card data: level 2, red, `ability=again`, `points=1`, `crowns=0`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 red card. Show a refined crimson echo-sanctuary where a red focal relic, weapon, or ritual engine visibly loops through the same path again and again, with repeating ember arcs, cyclical motion, and a clear sense of replay and return. The scene should feel more prestigious than a starter card and valuable enough to signal 1 point, but not royal. Red must dominate through flame, banners, lacquer, or glowing stone. No frame, no text, no watermark.

### l2-cr-72

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l2-cr-72.png`
- Card data: level 2, bonus_color=green, ability=scroll, points=0, crowns=2

Prompt:

Card data: level 2, green, `ability=scroll`, `points=0`, `crowns=2`, `bonusCount=1`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 green card with 2 crowns. Show a royal green decree chamber where an emerald ceremonial scroll rests on a noble stand before a courtly garden throne setting, with sovereign banners, refined architecture, cultivated foliage, and unmistakable crown-coded grandeur. The scroll must read instantly, and the art should feel regal because the card has 2 crowns. No frame, no text, no watermark.

### l2-ef-73

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l2-ef-73.png`
- Card data: level 2, bonus_color=white, ability=bonus_gem, points=1, crowns=0

Prompt:

Card data: level 2, white, `ability=bonus_gem`, `points=1`, `crowns=0`, `bonusCount=2`

Prompt:

Create interior-only fantasy card art in a strict 3:4 aspect ratio for a Level 2 white card. Show a radiant alabaster altar where one luminous white source relic emits two smaller white shards or fragments, making the bonus reward count of 2 feel obvious at a glance. The scene should be elegant and more prestigious than a basic bonus card, enough to suggest 1 point, but not royal. White must dominate through light, marble, crystal, and sacred atmosphere. No frame, no text, no watermark.

### l3-bk-58

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-bk-58.png`
- Card data: level 3, bonus_color=black, ability=none, points=3, crowns=2

Prompt:

Card data: level 3, black, `bonus_color=black`, `ability=none`, `points=3`, `crowns=2`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 black card. The image must already include the full final border: an ornate gilded frame integrated into the image, studded with black gemstone inlays and dark jewel accents all around the border, clearly reading as a premium Level 3 frame. Inside the border, show a royal obsidian throne sanctum with sovereign black regalia, twin crown motifs, velvet shadow, lacquered stone, and aristocratic menace. The interior should feel worth 3 points and unmistakably royal because the card has 2 crowns. No text, no watermark.

### l3-bk-59

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-bk-59.png`
- Card data: level 3, bonus_color=black, ability=none, points=4, crowns=0

Prompt:

Card data: level 3, black, `bonus_color=black`, `ability=none`, `points=4`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 black card. The image must already include the full final border: an integrated luxurious gold frame studded with black gemstones and dark jewel ornament, visible on all sides and clearly part of the finished image. Inside the frame, depict an exceptional black masterpiece such as a colossal obsidian relic chamber, abyssal mirror monument, or forbidden eclipse altar with overwhelming prestige and rare grandeur appropriate for 4 points, but without explicit royal court cues. Black must dominate the mood. No text, no watermark.

### l3-re-60

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-re-60.png`
- Card data: level 3, bonus_color=red, ability=none, points=3, crowns=2

Prompt:

Card data: level 3, red, `ability=none`, `points=3`, `crowns=2`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 red card. The image must already include the full final border: an integrated ornate gold frame with red ruby gemstone inlays and crimson jewel studs on all sides, clearly reading as a premium Level 3 frame. Inside the border, show a royal ruby oasis throne sanctuary at sunset, with towering red crystal formations, sovereign pavilions, ceremonial crimson banners, twin crown motifs worked into the architecture, and noble desert-palace grandeur. The scene must feel unmistakably royal because the card has 2 crowns, while still matching a prestigious 3-point red card. Red must dominate through ruby crystal, sunset sky, lacquered banners, and warm reflected light. Use one unified scene only, not a split panel. No text, no numbers, no UI icons, no watermark.

### l3-re-61

- Source prompt file: `early-card-regeneration-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-re-61.png`
- Card data: level 3, bonus_color=red, ability=none, points=4, crowns=0

Prompt:

Card data: level 3, red, `ability=none`, `points=4`, `crowns=0`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 red card. The image must already include the full final border: a luxurious ornate gold frame integrated into the artwork, studded with red ruby gemstone inlays and crimson jewel accents around every side, visibly richer than lower-level frames. Inside the frame, depict an extraordinary high-prestige red masterpiece such as a monumental ruby-domed citadel, grand crimson gem cathedral, or vast ceremonial red-stone vault, rare and impressive enough for 4 points. The card should feel elite, costly, and architectural, but explicitly not royal: no crowns, no throne, no sovereign regalia, no royal court. Red must dominate through ruby glass, crimson banners, polished stone, and glowing gem light. Use one unified scene only, not a split panel. No text, no numbers, no UI icons, no watermark.

### l3-gr-62

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-gr-62.png`
- Card data: level 3, bonus_color=green, ability=none, points=3, crowns=2

Prompt:

Card data: level 3, green, `bonus_color=green`, `ability=none`, `points=3`, `crowns=2`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 green card. The final image must include a complete integrated Level 3 border: ornate gold framing enriched with emerald gemstone inlays and green jewel studs all around the border. Inside the border, show a sovereign emerald court garden with ceremonial regalia, noble architecture, living banners, and an elevated royal atmosphere that clearly reflects 2 crowns while still feeling valuable enough for 3 points. Green must be the dominant identity color. No text, no watermark.

### l3-gr-63

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-gr-63.png`
- Card data: level 3, bonus_color=green, ability=none, points=4, crowns=0

Prompt:

Card data: level 3, green, `bonus_color=green`, `ability=none`, `points=4`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 green card. The image must already contain the full final jewel-studded border: a rich gold frame with emerald inlays and green gem accents integrated into the composition. Within the frame, depict a transcendent green masterpiece such as a monumental jade world-tree sanctuary, celestial arbor reliquary, or impossible living cathedral, clearly rarer and grander than ordinary prestige cards and worthy of 4 points, but not specifically royal. No text, no watermark.

### l3-bl-64

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-bl-64.png`
- Card data: level 3, bonus_color=blue, ability=none, points=3, crowns=2

Prompt:

Card data: level 3, blue, `bonus_color=blue`, `ability=none`, `points=3`, `crowns=2`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 blue card. The finished image must include an integrated premium border: an ornate gold frame lined with sapphire gemstone inlays and blue jewel accents on all sides, clearly visible as part of the final card art. Inside the border, show a royal moonlit ocean court with deep blue regalia, sovereign architecture, elevated ceremonial atmosphere, and obvious crown-coded grandeur suitable for 2 crowns and 3 points. Blue must dominate the palette. Use a single unified scene only, not a diptych or split layout. No text, no watermark.

### l3-bl-65

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-bl-65.png`
- Card data: level 3, bonus_color=blue, ability=none, points=4, crowns=0

Prompt:

Card data: level 3, blue, `bonus_color=blue`, `ability=none`, `points=4`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 blue card. The image must already include the full final border: a jewel-rich gold frame integrated into the artwork, decorated with sapphire inlays and blue gemstone studs. Inside the frame, depict a breathtaking blue prestige scene such as a star-sea observatory of impossible scale, a radiant abyssal cathedral, or a cosmic tidal monument, rare and grand enough to justify 4 points without explicit royal court cues. Use a single unified scene only, not a diptych or split layout. No text, no watermark.

### l3-wh-66

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-wh-66.png`
- Card data: level 3, bonus_color=white, ability=none, points=3, crowns=2

Prompt:

Card data: level 3, white, `bonus_color=white`, `ability=none`, `points=3`, `crowns=2`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 white card. The final image must include the complete card border in-image: an ornate gold frame with pearl-white gemstone inlays, pale crystal accents, and luminous jewel details embedded around the border, clearly reading as a Level 3 frame. Inside the border, show an exalted royal white sanctuary with noble banners, sovereign regalia, radiant ceremonial architecture, and unmistakable crown-coded majesty suitable for 2 crowns and 3 points. White must dominate the mood. No text, no watermark.

### l3-wh-67

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-wh-67.png`
- Card data: level 3, bonus_color=white, ability=none, points=4, crowns=0

Prompt:

Card data: level 3, white, `bonus_color=white`, `ability=none`, `points=4`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 white card. The image must already include the final integrated border: a lavish gold frame studded with pearl-white crystals and pale jewel accents on every side. Inside the frame, depict a sublime white masterpiece such as a celestial marble archive, impossible alabaster monument, or radiant sacred vault with extraordinary serenity and prestige appropriate for 4 points, but not explicitly royal. No text, no watermark.

### l3-po-68

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-po-68.png`
- Card data: level 3, bonus_color=null, ability=none, points=6, crowns=0

Prompt:

Card data: level 3, neutral, `bonus_color=null`, `ability=none`, `points=6`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 neutral card of extreme prestige. The final image must include the full integrated Level 3 border: an ornate gold frame studded with pale diamond-like crystals, pearl inlays, and neutral luminous gemstone accents rather than any strong faction color. Inside the border, show a transcendent neutral masterpiece worthy of 6 points, such as a monumental world-axis crystal, sacred universal reliquary, or divine geometric sanctuary, surpassing all ordinary prestige cards in grandeur while remaining neutral rather than royal. No text, no watermark.

### l3-jo-69

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-jo-69.png`
- Card data: level 3, bonus_color=gold, ability=none, points=0, crowns=3

Prompt:

Card data: level 3, gold, `bonus_color=gold`, `ability=none`, `points=0`, `crowns=3`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 gold card with 3 crowns. The image must already include the full final border: an integrated ornate gold frame enriched with amber, citrine, or golden gemstone inlays all around the border, visibly jewel-studded and premium. Inside the frame, show an imperial coronation chamber of overwhelming royal power with triple-crown symbolism, supreme regalia, sacred banners, and absolute sovereign spectacle. The card should feel like the apex royal gold image. No text, no watermark.

### l3-jo-70

- Source prompt file: `L3-remaining-prompts.md`
- Source card data: `packages/shared/src/data/realCardsLevel3.ts`
- Runtime asset: `/assets/cards/l3-jo-70.png`
- Card data: level 3, bonus_color=gold, ability=again, points=3, crowns=0

Prompt:

Card data: level 3, gold, `bonus_color=gold`, `ability=again`, `points=3`, `crowns=0`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 gold card. The image must already include the final integrated border: a rich ornate gold frame studded with amber or citrine gemstone accents, clearly part of the finished card art. Inside the border, show a prestigious cyclical golden phenomenon such as looping solar rings, repeating ceremonial mirrors, or an echoing sun-mechanism sanctuary that clearly communicates `again` through visible repetition and return, while still feeling rare and valuable enough for 3 points. No text, no watermark.

### l3-wh-75

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l3-wh-75.png`
- Card data: level 3, bonus_color=white, ability=none, points=3, crowns=1

Prompt:

Card data: level 3, white, `ability=none`, `points=3`, `crowns=1`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 white card. The final image must include the complete card border in-image: an ornate gold frame with pearl-white gemstone inlays and pale crystal accents embedded around the border, clearly reading as a premium Level 3 frame. Inside the border, show a majestic white sovereign sanctuary with one-crown royal cues, radiant marble architecture, ceremonial banners, and luminous prestige suitable for 3 points. White must dominate the mood. No text, no watermark.

### l3-jo-76

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l3-jo-76.png`
- Card data: level 3, bonus_color=gold, ability=steal, points=3, crowns=2

Prompt:

Card data: level 3, gold, `ability=steal`, `points=3`, `crowns=2`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 gold card. The image must already include the full final border: an integrated ornate gold frame enriched with amber or citrine gemstone inlays all around the border, visibly jewel-studded and premium. Inside the frame, show a royal golden treasury or coronation vault where an illicit acquisition is happening: a cunning hand, masked sovereign thief, or covert royal agent seizing a priceless crown relic or golden treasure. The card must still feel regal because it has 2 crowns, but the mood should clearly communicate `steal` through covert, predatory, illicit acquisition. No text, no watermark.

### l3-gr-77

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l3-gr-77.png`
- Card data: level 3, bonus_color=green, ability=again, points=3, crowns=1

Prompt:

Card data: level 3, green, `ability=again`, `points=3`, `crowns=1`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 green card. The final image must include a complete integrated Level 3 border: ornate gold framing enriched with emerald gemstone inlays and green jewel studs all around the border. Inside the border, show a royal green sanctum where loops of living vines, repeating jade rings, or cyclical growth patterns clearly communicate `again`, while noble architecture and one-crown regalia add royal prestige suitable for 3 points. Green must dominate the identity color. No text, no watermark.

### l3-bl-78

- Source prompt file: `Rogue-L2-L3-prompts.md`
- Source card data: `packages/shared/src/data/realCardsRogue.ts`
- Runtime asset: `/assets/cards/l3-bl-78.png`
- Card data: level 3, bonus_color=blue, ability=bonus_gem, points=3, crowns=1

Prompt:

Card data: level 3, blue, `ability=bonus_gem`, `points=3`, `crowns=1`, `bonusCount=1`

Prompt:

Create finished fantasy card art in a strict 3:4 aspect ratio for a Level 3 blue card. The final image must include an integrated premium border: an ornate gold frame lined with sapphire gemstone inlays and blue jewel accents on all sides, clearly visible as part of the final card art. Inside the border, show a royal moonlit sapphire reliquary or oceanic altar where one dominant blue source relic releases a second smaller blue shard, making the `bonus_gem` reward instantly readable. The scene should feel regal because the card has 1 crown and valuable enough for 3 points. Use a single unified scene only. No text, no watermark.
