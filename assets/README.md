# GemDuel Source Assets

This root `assets/` tree is the production and design source library. It is not the desktop runtime public asset URL tree.

Runtime files that ship through Vite/Electron remain under `apps/desktop/public/assets/`, where `/assets/cards/...`, `/assets/gems/...`, and `/assets/surfaces/...` URL contracts are preserved. Runtime card images are final composed cards; unframed source faces live in this tree.

## Layout

- `card/faces/source/`: unframed source card faces used by the standard-card renderer.
- `card/overlays/`: active card overlay cutouts, card numbers, and overlay normalization notes.
- `card/generated/`: generated card-face source outputs that are still useful for authoring.
- `card/manifests/`: card artwork manifests and production indexes.
- `source/`: original source sheets and standalone production art inputs.
- `archive/`: retired frames, framed card renders, superseded overlays, and preview/contact-sheet material.

Card source and runtime filenames that are keyed by card id must follow `XYZ-cc`: standard levels use `1/2/3`, royal cards use `r`, the color digit is `1 red`, `2 green`, `3 blue`, `4 white`, `5 black`, `6 pearl/pink`, `7 gold/JOKER`, `8 pure-points/gray`, `9 royal`, and the suffix is `re/gr/bl/wh/bk/pe/jo/po/ro`.

Do not move runtime public assets here unless the loading contract is intentionally changed and the desktop app references are updated with tests.
