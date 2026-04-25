# Card Face Source Assets

`source/` contains the unframed `1086x1448` card-face PNGs keyed by RealCards
card id. Filenames must be `{card_id}.png` and card ids must follow the
canonical `XYZ-cc` rule, such as `151-bk` or `374-jo`. These files are the
input art for `tools/art/render-standard-card.py`.

Runtime `/assets/cards/{id}.png` files live under
`apps/desktop/public/assets/cards/` and are final composed card images with
overlays applied.
