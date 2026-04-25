# Card Asset Agents

## Scope

This folder is for card artwork source assets, overlay cutouts, generated base
art, and artwork manifests. Unframed source card faces live in
`faces/source/`. Runtime desktop assets remain under `apps/desktop/public/assets`
because the UI loads final composed cards and other public art through
`/assets/...` URLs.

## Card-Making Spirit

- Match art to the card's actual `level`, `bonus_color`, `ability`, `points`, and `crowns` from the card data or CSV source.
- Standard card faces are unframed. Do not bake card borders, cost circles,
  point ribbons, bonus badges, numbers, or UI icons into card-face art.
- Final composed standard cards ship from `apps/desktop/public/assets/cards/`;
  do not use that public runtime directory as the renderer's source-face input.
- Current standard card UI structure is layered from transparent overlays in
  `overlays/`; those overlays stay separate from card-face art.
- Archived frame assets live under `../archive/card-frames/` for reference only
  and must not be used by new Figma helper output.
- Color identity does not need to be literal gemstone art. Any strong, readable color element is valid if the card still clearly reads as that color.
- Prefer a single strong focal element with a clean silhouette so the image survives card-size reduction.
- Translate gameplay metadata into visual mood:
  - `again`: looping, repeating, cyclical, echoing, momentum
  - `bonus_gem`: one source yielding an extra shard, relic, spark, fragment, or reward
  - `scroll`: privilege, decree, archive, sacred script, ceremonial document
  - `steal`: covert, predatory, cunning, illicit acquisition
  - `none`: lean on environment, prestige, relic quality, and color identity without forced effect symbolism
- `points` should raise prestige, rarity, or grandeur, but should not automatically make the card royal.
- Any card with `crowns > 0` must introduce royal style cues: throne room, regalia, ceremonial banners, noble architecture, crown motifs, courtly atmosphere, or sovereign relics.
- A crown card can still keep its original level frame. Royal flavor changes the art direction, not the level border.

## Prompt Rules

- Default output is vertical fantasy card art at a strict `3:4` aspect ratio.
- Preferred local working size is `1086x1448`, or another clean `3:4` multiple when a tool requires a different resolution.
- Prompts should request base card-face art with no frame and enough quiet space
  for later overlay placement.
- Prompts should explicitly say: no text, no numbers, no UI icons, no watermark.
- Keep the composition readable at card size; avoid cluttered scenes with many equal-weight focal points.
- Do not overfit every card to a gemstone shrine. Broaden the visual language when the card works better as architecture, ritual objects, weapons, archives, landscapes, celestial scenes, or royal interiors.
- When several cards share a color, vary the subject matter while preserving the same level border family and color identity.

## File Discipline

- Use canonical `card_id` names when an artwork has been definitively matched to a card.
- If an image is intentionally left unmatched, preserve traceability in CSV or mapping files instead of inventing a fake card id.
- Keep prompt documents under `docs/art/card-prompts/`.
- Keep reference PDFs under `docs/references/card-art/`.
- Keep preview/contact-sheet outputs under `../archive/previews/` unless they
  are actively used as source material.
