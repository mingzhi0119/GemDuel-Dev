# Engineering Governance Phase D Reassessment

Audit date: `2026-04-19`

Scope: reassessment for Phase D in `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md`

Conclusion: Phase D is complete. The remaining gameplay/network hotspots now ship as thinner shells with dedicated support modules and stronger scenario coverage, and the renderer bundle budget has moved from a live large-chunk warning to a governed healthy report. The project moves from `9.5/10` to `9.6/10`, with all ten engineering dimensions now at or above `9.5/10`.

## Phase D Delivered

- Split `src/hooks/useGameNetwork.ts` into a thinner React binding layer backed by `src/hooks/gameNetwork/useNetworkEventHandlers.ts` and `src/hooks/gameNetwork/useHostStateSync.ts`.
- Extracted purchase/reserve support logic into `src/logic/actions/marketActionSupport.ts`, reducing repeated bag/allocation/gold handling inside `src/logic/actions/marketActions.ts`.
- Expanded hotspot evidence in `src/hooks/__tests__/useGameNetwork.test.tsx` with bootstrap success, verified host-decision success, ignored non-host guest intent, and host-sync skip/resume coverage.
- Expanded action hotspot evidence in `src/logic/actions/__tests__/boardActions.test.ts` and `src/logic/actions/__tests__/marketActions.phase3.test.ts` for extortion, Pacifist, aggressive expansion, malformed payload guards, crown instant wins, AGAIN, matched bonus gems, collector reserve steals, and Puppet Master discard recycling.
- Added route- and overlay-level lazy loading in `src/app/routes/GemDuelRoutes.tsx`, `src/app/chrome/AppChrome.tsx`, and `src/app/overlays/AppOverlayStack.tsx` so title/config flows, debug panels, and result overlays are no longer bundled into the base renderer path.
- Added governed manual chunking in `vite.config.ts` for `react-vendor`, `motion-vendor`, `network-vendor`, `ui-vendor`, `game-core`, and `network-core`.
- Exported a healthy bundle budget artifact in `artifacts/governance/bundle-budget.report.json` with largest observed chunk `189.22 kB`, well below the `700 kB` warning budget.
- Updated `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md` so the Phase D roadmap and priority ledger reflect the newly completed seal work.

## Verification Evidence

| Check                          | Result | Notes                                                                                           |
| ------------------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| `npm run boundaries:check`     | Passed | Boundary registry and governance inventory stayed aligned                                       |
| `npm run deps:check`           | Passed | Production dependency audit remained `0/0/0/0/0`                                                |
| `npm run licenses:check`       | Passed | License allowlist gate remained green                                                           |
| `npm run sbom:check`           | Passed | SBOM governance snapshot remained valid                                                         |
| `npm run secrets:check`        | Passed | Secret/env drift gate stayed green                                                              |
| `npm run lint`                 | Passed | New hook modules, action support module, lazy routes, and tests are lint-clean                  |
| `npm run desktop:check`        | Passed | Electron policy and runtime-drill governance snapshots stayed aligned                           |
| `npm run release:check`        | Passed | Release-health checklist and operations governance stayed green                                 |
| `npm run test:security`        | Passed | `14` governance/security-focused files, `72` tests                                              |
| `npm test`                     | Passed | `53` files, `319` tests                                                                         |
| `npm run test:coverage`        | Passed | `Statements 95.54% / Branches 84.67% / Functions 91.20% / Lines 95.54%`                         |
| `npm run build`                | Passed | Production build succeeded with no Vite large-chunk warning                                     |
| `npm run governance:artifacts` | Passed | Exported healthy release reports, governance manifest, and bundle budget report to `artifacts/` |

## Evidence Delta

| Evidence area             | Phase C baseline                           | After Phase D                           | Audit reading                                                                       |
| ------------------------- | ------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------- |
| Multiplayer hook hotspot  | `useGameNetwork.ts` `80.40% / 74.19%`      | `98.00% / 83.33%`                       | React binding is now a thinner coordinator with explicit event/sync submodules      |
| Board action hotspot      | `boardActions.ts` `73.91% / 66.66%`        | `96.89% / 85.91%`                       | Branch-heavy board rules now have seal-grade scenario evidence                      |
| Market action hotspot     | `marketActions.ts` `83.91% / 75.00%`       | `94.46% / 81.05%`                       | Complex buy/reserve flows now clear the hotspot threshold with shared support       |
| Bundle budget posture     | Main chunk warning at `740.11 kB`          | Largest chunk healthy at `189.22 kB`    | Bundle governance moved from warning-state to healthy audited budget                |
| Renderer loading topology | Static route shell + low-frequency imports | Route, overlay, and vendor chunks split | Phase-specific UI is now structurally separated from the base renderer entry path   |
| Overall coverage posture  | `92.97 / 82.73 / 90.78 / 92.97`            | `95.54 / 84.67 / 91.20 / 95.54`         | Coverage is now both higher overall and better distributed across the last hotspots |

## Reassessed Engineering Scores

| Dimension                             | Phase C baseline | Phase D  | Reassessment rationale                                                                                     |
| ------------------------------------- | ---------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Correctness                           | `9.2/10`         | `9.5/10` | Action hotspots and multiplayer success/failure paths now have materially stronger deterministic evidence  |
| Boundary Security                     | `9.5/10`         | `9.5/10` | Boundary posture remains sealed; Phase D primarily improved internal hotspot and performance closure       |
| State Machine Consistency             | `9.2/10`         | `9.5/10` | Phase-sensitive multiplayer and board/action flows now rely less on implicit shell behavior                |
| Online Authority                      | `9.4/10`         | `9.5/10` | Host approval, checksum verification, recovery, and sync-skipping rules now have seal-grade tests          |
| Electron Security                     | `9.6/10`         | `9.6/10` | Electron governance was already ahead of the seal threshold and stayed stable                              |
| Architecture Layering                 | `9.3/10`         | `9.6/10` | `useGameNetwork` and `marketActions` both slimmed down, and bundle strategy now reinforces layer budgets   |
| Type Contracts                        | `9.5/10`         | `9.5/10` | No contract regression; runtime and artifact contracts remain explicit and governed                        |
| Test Coverage                         | `9.5/10`         | `9.6/10` | Total coverage and hotspot distribution both improved beyond the Phase C seal line                         |
| Observability / Operations            | `9.6/10`         | `9.6/10` | Healthy bundle budget artifact now reinforces an already-strong ops loop                                   |
| Dependency / Configuration Governance | `9.5/10`         | `9.5/10` | Governance remains sealed; short-lived TURN minting is still a post-seal improvement rather than a blocker |

### Reassessed total

`9.5/10 -> 9.6/10`

## Phase D Seal Review

| Seal criterion                                                                   | Status      | Evidence                                                                  |
| -------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| Final gameplay/network hotspots are backed by stronger scenario tests            | `Completed` | Updated `boardActions`, `marketActions`, and `useGameNetwork` test suites |
| `useGameNetwork.ts` is reduced to a thinner React-facing coordination shell      | `Completed` | `src/hooks/gameNetwork/useNetworkEventHandlers.ts`, `useHostStateSync.ts` |
| `marketActions.ts` shares repeated reserve/payment logic through support modules | `Completed` | `src/logic/actions/marketActionSupport.ts`                                |
| Route and overlay code splitting remove the renderer large-chunk warning         | `Completed` | Lazy route/ui imports plus governed `manualChunks` in `vite.config.ts`    |
| Bundle budget is healthy and exported as governance evidence                     | `Completed` | `artifacts/governance/bundle-budget.report.json`                          |
| Independent reassessment artifact exists                                         | `Completed` | This document                                                             |

## Residual Risks

1. Short-lived TURN credential minting is still backend-blocked, so multiplayer secret lifecycle can still improve even though the renderer-side authority model now seals.
2. `src/logic/actions/marketActions.ts` is over the branch hotspot line at `81.05%`, but it remains the least-covered action hotspot after Phase D and is the first candidate for any future gameplay rule expansion.
3. Script-side budget/report helpers such as `scripts/buildBudgetReport.js` still trail the app hotspots in branch coverage, though they no longer block the engineering seal.
4. The new lazy route/overlay topology should stay coupled to future UX changes so low-frequency UI does not drift back into the base renderer path.

## Recommended Next Steps

1. Treat short-lived TURN credential delivery and `patch-peer` exception retirement as the next post-seal governance backlog, not as blockers for the current Phase D closure.
2. Keep `marketActions.ts` and the bundle-budget report script on the watchlist for the next rule/performance expansion round.
3. Preserve the current chunk budget and named split policy in future PRs by continuing to export and review `artifacts/governance/bundle-budget.report.json`.
