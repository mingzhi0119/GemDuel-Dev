# GemDuel Unity Migration Suitability Assessment - 2026-05-04

## Verdict

**Conditional, not immediate.**

GemDuel is technically suitable for a Unity migration **only if the goal is a long-term native release client** for Steam/mobile/console-style distribution. It is **not suitable for an immediate full rewrite** if the near-term goal is to keep improving the current Windows desktop board-game experience, because the current React/Electron version already has a working rules engine, replay system, local/PvE/online flows, production gates, and a large regression-test base.

Recommended decision:

- **Do not replace the current client yet.**
- **Use Unity for a limited vertical-slice prototype first.**
- **Keep the current TypeScript implementation as the rules oracle until Unity proves one complete match, replay validation, and release packaging.**
- **Do not treat Unity migration as release readiness.** Legal/IP cleanup, store-facing UX, accessibility, QA, trailer/store assets, achievements/cloud saves, and platform compliance remain separate release blockers.

## Executive Scorecard

| Dimension                                 | Score | Assessment                                                                                                   |
| ----------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------ |
| Technical feasibility                     | 8/10  | The game is a 2D board/card strategy title; Unity can render and ship this class of game well.               |
| Existing-code portability                 | 4/10  | Data, replay schemas, tests, and art are reusable; React components and Electron shell are not direct ports. |
| Business fit for a real release           | 6/10  | Fit improves if targeting Steam/mobile/console; weak if the only target is Windows desktop/local play.       |
| Player benefit                            | 6/10  | Potentially better native feel and platform reach; high near-term regression risk.                           |
| Engineering cost efficiency               | 4/10  | Full migration rewrites a large amount of working UI, orchestration, networking, and release governance.     |
| Current release readiness after migration | 3/10  | Unity does not solve IP/legal, onboarding, platform compliance, or store-production gaps by itself.          |

Overall recommendation: **prototype first, migrate only after a measurable go/no-go gate.**

## Why Unity Is Plausible

Unity supports the target shape of this product:

- The current game is primarily 2D board, card, gem, menu, animation, and replay presentation, which maps naturally to Unity 2D + UI.
- Unity's platform browser lists supported platform families including mobile, desktop, web, servers, XR, and closed platforms, with missing build modules installable through Unity Hub.
- Unity UI Toolkit is a retained-mode runtime UI system with stylesheet/layout concepts familiar to web developers, so some layout thinking can transfer even though React code cannot.
- Unity Personal remains free under the current USD 200K revenue/funding threshold; Pro is required above that threshold and for console/Apple Vision Pro publishing.

Current official Unity facts checked on 2026-05-04:

- Unity Personal eligibility and commercial-use threshold: <https://unity.com/products/unity-personal>
- Unity 2026 plan/pricing threshold and Pro requirement: <https://unity.com/products/pricing-updates>
- Runtime Fee cancellation and return to seat-based subscriptions: <https://support.unity.com/hc/en-us/articles/30322080156692-Cancellation-of-the-Runtime-Fee-and-Pricing-Changes>
- Unity 6000.4.6f1 project version lock target, verified 2026-05-09:
  <https://unity.com/releases/editor/whats-new/6000.4.6f1>
- Unity platform browser/build-profile support model: <https://docs.unity3d.com/ja/current/Manual/platform-browser-reference.html>
- UI Toolkit runtime UI model: <https://docs.unity3d.com/2023.2/Documentation/Manual/UIElements.html>

## Local Evidence From This Repository

### Current architecture is already production-shaped

Evidence:

- `README.md` defines the project as a `pnpm` + Turborepo monorepo for a React + TypeScript + Electron strategy game, with dedicated app, shared logic, UI, TURN service, scripts, and governance workspaces.
- `README.md` also states desktop release packaging is currently Windows NSIS only.
- `docs/architecture/overview.md` separates `apps/desktop`, `packages/shared`, `packages/ui`, `packages/turn-service`, `tools/scripts`, and `tools/governance`.
- `docs/governance/architecture-layer-map.md` explicitly assigns domain logic, network contracts, UI shell, desktop platform, and governance scripts to separate layers.

Inference:

The current codebase is not a quick prototype that needs an engine to become structured. It already has a serious app architecture. Unity would be a client/runtime rewrite, not an architecture rescue.

### The rules core is the best migration asset

Evidence:

- `packages/shared/src/types/domain-core.ts` defines engine-neutral domain objects: gems, cards, buffs, game modes, phases, players, board cells, market/deck state, and setup payloads.
- `packages/shared/src/types/domain-actions.ts` defines a discriminated union for all game actions.
- `packages/shared/src/logic/gameReducer.ts` centralizes action dispatch and validates commands before mutation and post-action state after mutation.
- `packages/shared/src/logic/contractSchemasCore.ts` and `packages/shared/src/logic/contractSchemasGameState.ts` define runtime schemas for modes, phases, colors, boards, decks, market, cards, and action payloads.

Inference:

The strongest migration path is to preserve these contracts as the source of truth, then port the rule engine to C# with golden replay/action tests. Directly rewriting gameplay inside Unity scenes or MonoBehaviours would be a regression risk.

### Replay and test evidence are valuable but must be re-created in Unity

Evidence:

- `packages/shared/src/replay/schema.ts` defines strict Replay vNext structures for match info, init snapshots, state snapshots, checkpoints, events, and sync payloads.
- `packages/shared/src/replay/runtime.ts` serializes and inflates runtime cards, buffs, royal cards, market/deck state, and replay snapshots.
- `docs/guides/testing.md` documents verification across domain logic, network/authority, replay import, lexicon/copy, desktop shell, release governance, and lifecycle evidence.

Inference:

Replay is a major advantage for migration because it can become the acceptance corpus for Unity. The cost is that Unity needs its own replay reader/player or a compatibility bridge, otherwise the project loses one of its strongest QA tools.

### The current UI is deeply React/Electron-specific

Evidence:

- `apps/desktop/src/App.tsx` wires React state, settings, replay IO, LAN matchmaking, runtime config, responsive layout, and route selection.
- `apps/desktop/src/app/routes/GemDuelRoutes.tsx` lazy-loads React route surfaces for config, online, LAN, draft, game, and Visual Lab.
- `apps/desktop/src/app/shell/GameShell.tsx` composes React UI components, overlays, presentation events, card previews, player rails, top bar, app chrome, and gameplay surface.
- `packages/ui/src/components/GameBoard.tsx`, `packages/ui/src/components/Card.tsx`, and `packages/ui/src/components/gameBoard/AnimatedGemButton.tsx` depend on React, Tailwind-style class composition, browser pointer events, Framer Motion, DOM layout, and image URLs.
- `apps/desktop/package.json` depends on `react`, `react-dom`, `electron`, `framer-motion`, `peerjs`, `lucide-react`, and Vite/Electron tooling.

Inference:

Most visible Unity work is not "porting components"; it is rebuilding scene hierarchy, prefabs, UI Toolkit/uGUI screens, input handling, animation sequencing, overlays, card preview flows, and menu routing.

### Networking and desktop release are not automatic wins

Evidence:

- `apps/desktop/src/hooks/useGameNetwork.ts` coordinates host/guest sync, guest intents, replay sync, PeerJS/online manager state, and local dispatch.
- `packages/shared/src/logic/networkProtocol.ts` maps game actions to bootstrap and guest-intent commands and enforces host/guest inbound-message direction.
- `docs/governance/boundary-inventory.md` treats renderer action dispatch, network parsing, guest-intent authority review, replay import, IPC bridge, desktop window security, runtime relay profile, release health, and dependency governance as explicit boundaries.
- `docs/governance/release-health-checklist.md` requires lint, tests, coverage, desktop checks, release artifact checks, provenance checks, benchmarks, governance reports, and lifecycle certification before desktop release work.

Inference:

Unity can simplify some Electron-specific security concerns, but it does not remove multiplayer authority, replay sync, transport, release evidence, or CI needs. If networking remains PeerJS/TURN-style or is replaced with Unity services/Netcode/Steam relay, that is a separate architecture decision.

### Assets are usable but not release-clean by default

Evidence:

- `assets/card/AGENTS.md` defines card source assets, overlay discipline, canonical IDs, and `1086x1448` preferred working size.
- `assets/card/faces/README.md` states runtime composed cards live under `apps/desktop/public/assets/cards/`, while source faces live under `assets/card/faces/source/`.
- `packages/ui/src/components/card/cardArtwork.ts` maps runtime card IDs to `/assets/cards/{id}.png`.
- `packages/ui/src/components/GemArtwork.tsx` maps gem images to `/assets/gems/{color}.png`.
- `apps/desktop/src/app/shell/surfaceArtwork.ts` maps surface themes to runtime `/assets/surfaces/...` paths and contains per-theme gem-panel geometry.
- Measured on 2026-05-04: `apps/desktop/public/assets/cards` has 84 card PNGs, `apps/desktop/public/assets/surfaces` has 70 files, and `apps/desktop/public/assets` has 200 total files at max depth 3.

Inference:

Art can seed a Unity prototype, but Unity import settings, sprite slicing, atlas packing, DPI scaling, compression, nine-slice/panel geometry, and addressable bundles would need new production setup.

## Code Volume Estimate

Measured with tracked files on 2026-05-04:

| Area                                            | Current non-test LOC | Unity reuse expectation                                      |
| ----------------------------------------------- | -------------------: | ------------------------------------------------------------ |
| `packages/shared/src`                           |              ~15,034 | Reuse as spec/oracle; likely C# rewrite for production.      |
| `packages/ui/src`                               |              ~11,785 | Mostly rewrite as Unity UI/prefabs/scenes.                   |
| `apps/desktop/src` + `apps/desktop/electron`    |              ~13,673 | Mostly rewrite; some runtime concepts and UX flows reusable. |
| `packages/shared/src/logic/actions` + AI subset |               ~2,697 | Highest-value gameplay port target.                          |

Practical migration code amount:

| Workstream                        | New Unity-side amount | Notes                                                                                |
| --------------------------------- | --------------------: | ------------------------------------------------------------------------------------ |
| C# domain model, reducer, actions |            6k-10k LOC | Must preserve command validation, phases, buffs, royal logic, card/gem economics.    |
| Replay import/export/player       |             3k-6k LOC | Needed to keep current replay QA and review mode.                                    |
| UI, board, cards, overlays, menus | 8k-15k LOC equivalent | Includes scenes, prefabs, UI Toolkit/uGUI, input, responsiveness, and accessibility. |
| Animation and presentation        |  2k-5k LOC equivalent | Rebuild card/gem flights, market refill, royal unlock, handoff, previews.            |
| Networking and LAN/online         |             3k-8k LOC | Depends on keeping existing protocol vs replacing transport.                         |
| Build/release/CI/governance       |     1k-3k LOC/scripts | Unity build automation, store packaging, signing, checksums, regression gates.       |
| Test harness/golden corpus        |             4k-8k LOC | C# unit tests plus replay parity checks; not optional if rules must remain stable.   |

Total realistic new work: **27k-55k LOC-equivalent plus Unity scenes/prefabs/import metadata.**

Minimum useful Unity vertical slice: **2k-5k LOC-equivalent** if limited to local PvP, one surface theme, one complete match, card/gem display, and replay parity for a small corpus.

## Player Impact

### Positive impact if migration succeeds

- More "native game" feel: fullscreen, controller/touch paths, richer transitions, stronger audio/visual feedback.
- Better platform expansion path: Steam Deck, mobile, console, and possible storefront integrations become more natural than Electron.
- Potentially smoother asset-driven presentation: sprites, atlases, particle effects, shader/VFX, and timeline-like sequencing can be easier to polish in Unity.
- Better long-term identity if the game evolves beyond a desktop board UI into a fully authored digital board-game product.

### Negative or risky impact during migration

- Feature freeze/regression risk: rules, buffs, replay review, online authority, card previews, and surface themes would need parity before players gain anything.
- Current UI muscle memory changes: board selection, card preview, reserve/buy, royal selection, replay controls, rulebook, and menu flows would feel different.
- Accessibility and text quality can regress: current DOM/React affordances do not automatically transfer to Unity.
- Online reliability can regress unless the network protocol is ported with tests instead of rebuilt ad hoc.
- Existing art may look worse at first because Unity import/compression/scale settings need tuning.

## Release-Readiness Risks Independent Of Unity

These risks matter before calling the product a real release game:

1. **IP/originality risk.** The repo contains `docs/references/card-art/Splendor_Duel_Card_List-v3.pdf`, and the product structure is visibly close to a commercial tabletop genre/reference. A commercial release needs legal review and likely stronger originalization of rules, card catalog, terminology, and presentation.
2. **Third-party character/theme risk.** Archived surface-theme generation docs include Genshin Impact and Honkai: Star Rail character-faithful candidate work. The runtime assets appear generic today, but release preparation should audit all runtime and archived shipped assets for brand/character dependency.
3. **No root license/notice evidence found.** A store release should include explicit project license, third-party notices, asset provenance, and generated-art provenance.
4. **Store production gaps.** Unity does not create Steam achievements, cloud saves, controller prompts, crash reporting, trailers, store capsule art, privacy disclosures, or console certification assets automatically.
5. **Rules onboarding.** The game needs a release-grade tutorial/onboarding path, not only a rulebook and existing local menus.

These are not arguments against Unity; they are arguments against assuming engine migration equals publishability.

## Migration Options

### Option A - Keep Electron, polish current game

Best when:

- Target is Windows desktop/local PvP/PvE.
- Need to ship or demo soon.
- Current browser/Electron performance is acceptable.
- Main work is rules, UI clarity, art polish, replay, and release governance.

Assessment: **highest ROI for near-term delivery.**

### Option B - Unity vertical slice beside current repo

Best when:

- The goal is to test whether Unity materially improves feel, input, animation, and packaging.
- You want objective proof before committing to a rewrite.
- Current TypeScript game remains the reference implementation.

Assessment: **recommended next step if Unity is seriously being considered.**

Required slice:

- Local PvP complete match.
- 5x5 gem board.
- Market, reserve, buy, royal selection, and winner flow.
- One card-art and gem-art import path.
- Replay import for at least 10 golden matches.
- Parity checks against TypeScript replay/state hashes.

Go/no-go threshold:

- One complete match without manual debug actions.
- 95%+ action parity on selected golden replay corpus.
- No unresolved IP/runtime-asset blocker in the slice.
- Unity build package can be produced repeatably on the intended first release platform.

### Option C - Full Unity migration

Best when:

- Target platforms require native game packaging beyond Electron.
- You accept a multi-phase rewrite.
- Legal/IP originalization is already resolved.
- A C# gameplay test harness is funded as first-class work.

Assessment: **possible, but not recommended before Option B succeeds.**

## Suggested Phased Plan

### Phase 0 - Pre-migration release audit

Goal: decide whether the product is legally and commercially eligible to become a release game.

Deliverables:

- IP/originality audit of rules, terminology, card data, and art references.
- Runtime asset provenance table.
- Store target decision: Windows Steam only vs Steam + Steam Deck vs mobile vs console.
- Release-grade product identity: title, visual identity, capsule art direction, tutorial promise.

Exit gate:

- No known unlicensed tabletop/card-list/character dependency in the intended shipped product.

### Phase 1 - Engine-neutral contract freeze

Goal: make the current TypeScript game a migration oracle.

Deliverables:

- Golden replay corpus from live gameplay, AI simulation, and edge cases.
- Engine-neutral action/state schema snapshot.
- State hash format that Unity can reproduce.
- Migration checklist for every action in `GameAction`.

Exit gate:

- Current repo can produce replay/action fixtures that a Unity test runner can consume.

### Phase 2 - Unity vertical slice

Goal: prove feel and parity with minimum scope.

Deliverables:

- Unity project with one local PvP complete match.
- C# port of core actions needed for the slice.
- Board/card/gem UI, one theme, and basic animations.
- Replay import/parity runner for the golden corpus subset.

Exit gate:

- The slice is visibly better enough to justify rewriting the rest.

### Phase 3 - Full client migration

Goal: replace the user-facing desktop client only after parity confidence exists.

Deliverables:

- Full gameplay and buff parity.
- PVE AI parity or improved AI.
- Replay review mode.
- Rulebook/tutorial.
- Settings/localization/audio.
- Release packaging and crash telemetry.

Exit gate:

- Unity build passes equivalent domain, replay, smoke, release, and provenance gates.

### Phase 4 - Platform release hardening

Goal: turn the Unity build into a store product.

Deliverables:

- Steam/target-store integration.
- Controller/Steam Deck/touch validation where applicable.
- Accessibility pass.
- Save/cloud/replay storage decisions.
- Store capsule/trailer/screenshots.
- Signing, checksums, installer/build provenance.

Exit gate:

- Release candidate can pass the target storefront checklist.

## Final Recommendation

GemDuel **can become a real release game**, but Unity is not the first blocker and not a guaranteed accelerator.

Best path:

1. Keep the current TypeScript/Electron game as the authoritative implementation.
2. Run IP/originality and asset-provenance cleanup before any commercial-release positioning.
3. Build a Unity vertical slice only after the target storefront/platform is chosen.
4. Commit to full migration only if the Unity slice clearly improves player feel and passes replay parity.

If the target is **near-term Windows desktop release**, stay on the current stack and polish. If the target is **Steam Deck/mobile/console or a visually richer native digital board game**, Unity is a reasonable candidate, but only as a staged migration with replay-driven parity gates.
