# Unity Vertical Slice Scope

Last updated: 2026-05-09

The Unity vertical slice is a sidecar prototype. It must prove whether a native game client is worth
continuing without destabilizing the current Electron/TypeScript game.

## Source Decisions

- Current TypeScript/Electron remains the rules oracle.
- Unity is not allowed to become a second rules source of truth until it passes replay parity.
- `packages/shared` remains pure and cannot depend on Unity, Steamworks, EOS, React, Electron, or
  DOM APIs.
- Replay golden fixtures are the bridge between the current rules implementation and Unity.

## Included In Slice

- Windows build target.
- 16:9 desktop presentation.
- 5x5 GemBoard.
- Local PvP.
- Market cards sufficient for buy/reserve flow.
- Reserve from market and reserve-deck concept.
- Buy from market and reserved card concept.
- Royal selection, including the extra-turn royal ability case.
- Game-over display.
- SteamAPI init concept slot.
- Overlay availability concept slot.
- Test achievement concept slot.
- Local save path concept.
- Fixture reader design against `fixtures/replay-golden/manifest.json`.

## Excluded From Slice

- Online multiplayer.
- LAN multiplayer.
- Complete AI.
- Full buff catalog.
- Full Visual Lab.
- Complete release packaging automation.
- Steamworks.NET or EOS SDK binaries.
- Real app IDs, secrets, tokens, account config, branch passwords, or platform upload output.
- Steam Deck Verified target.
- Full controller certification.
- Trading Cards, Workshop, Rich Presence, leaderboards, DLC, macOS, Linux, mobile, or console.

## Go / No-Go Gate

Unity is allowed to continue beyond the slice only after:

- it can read every committed replay golden fixture;
- the C# reducer produces expected final hashes for the fixture corpus;
- one local PvP match can be played through without debug actions;
- the Windows build can be produced repeatably on a governed machine;
- platform concept slots stay behind interfaces and do not leak into gameplay rules;
- no untracked Unity cache or local settings are required for a clean checkout.

## Stop Conditions

Stop the Unity branch and keep Electron as the shipping client if:

- Unity cannot reproduce the replay hash contract without rule divergence;
- the slice requires broad gameplay rewrites before it can display core board state;
- platform SDK concerns start coupling to game state or action contracts;
- generated Unity project churn makes review quality worse than the migration evidence it adds.
