# Electron/Unity Operation Parity Contract

This contract keeps Unity migration work aligned by operation, not just by screenshots.
For the same viewport, Electron and Unity must expose the same semantic target, accept the
same pointer operation, and end in the same gameplay state.

## Contract Fields

- `action`: parity harness action name, for example `click_market_deck`.
- `semanticKey`: the visible target key both clients must expose before the operation.
- `input`: `click` or `hover`.
- `expectPreview`: optional preview expectation after the operation.
- `expectSemanticKeys`: optional post-operation semantic keys that must be visible on both sides,
  such as the preview card and reserve action.
- `expectStateStable`: true for preview-only operations that must not mutate gameplay state.
- `rectTolerancePx`: optional rectangle tolerance. The runner default is 8 px.

Example:

```json
{
    "action": "click_market_deck",
    "input": "click",
    "semanticKey": "market.level.1",
    "expectPreview": { "visible": true, "source": "deck", "level": 1 },
    "expectSemanticKeys": ["card.preview.card", "card.preview.action.reserve"],
    "expectStateStable": true
}
```

## Current Covered Operations

- `market-card-preview`: clicking `market.card.1.0` opens preview without mutating gameplay.
- `market-deck-reserve-preview`: clicking `market.level.1` opens deck reserve preview without
  committing `reserve_deck`; both clients must expose `card.preview.card` and
  `card.preview.action.reserve`.
- `draft-hover-feedback`: hovering `draft.buff.1` exposes the same hover target without
  mutating gameplay.

## Acceptance

Run:

```powershell
pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"
```

For full validation with Unity installed, run:

```powershell
pnpm parity:electron-unity -- --viewports "1920x1080,1366x768"
```

Each scenario writes `*-operation-contract.json` under
`artifacts/electron-unity-parity/<run>/diff/<scenario>/`. The matrix column
`Operation contract result` must be `Equivalent operation contract` for covered scenarios.
