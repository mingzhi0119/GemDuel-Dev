# Unity Next Run Audit Note - 2026-05-11

Status: Incomplete.

This continuation advanced Unity replacement-candidate evidence, but it did not close the
replacement-candidate gate. The Windows player can now be built, launched from the ignored build
output, and driven through a bounded LocalDev mailbox smoke that applies real TypeScript
rules-engine commands and preserves replay hashes. The remaining blockers are product-scope breadth,
LAN/online/Visual Lab decisions, and the final release-runtime packaging decision for the TypeScript
bridge.

## Baseline

- Branch: `codex/unity-electron-parity-candidate`
- Starting `git status --short --branch`:
  `## codex/unity-electron-parity-candidate...origin/codex/unity-electron-parity-candidate`
- Starting `git log --oneline -5`:
  `5f6a179`, `6e8af1b`, `95a85b7`, `e9f8807`, `9090fc2`
- Starting `git diff --name-only`: empty

## Work Completed

- Added a governed built-player smoke entrypoint:
  `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs` and
  `tools/migration/run-unity-built-player-smoke.mjs`.
- Added the governed `GEMDUEL_RULES_BRIDGE_MAILBOX_DIR` LocalDev transport after direct
  child-process launch from the Windows player failed for both `cmd.exe`/`pnpm.CMD` and direct
  `node.exe`.
- Added a reusable LocalDev product-surface smoke helper:
  `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`.
- Broadened bounded Local PvP product-surface evidence to five deterministic scenarios with live
  replay recording, export/import/review hash preservation, explicit no-fixture/no-checkpoint
  checks, market buy, and market reserve/cancel coverage.
- Added `tools/migration/summarize-unity-built-player-smokes.mjs` to validate and aggregate
  successful built-player smoke launcher reports into a machine-readable matrix artifact.
- Added `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs` and
  wired `tools/migration/run-unity-built-player-smoke.mjs --include-replay-release-path` so a
  Windows player smoke can exercise replay file-path error recovery inside the built player.
- Strengthened replay release-path validation for invalid JSON, missing file, unsupported schema
  version, corrupted summary count, final hash mismatch, overwrite/reload, and clean error recovery
  without mutating live gameplay state.
- Hardened `TypeScriptGameRulesEngine` LocalDev availability checks, repository-root resolution,
  `GEMDUEL_PNPM_PATH` handling, output-file bridge responses, mailbox request/response handling,
  timeout/error reporting, atomic mailbox response publication, response read retry, best-effort
  response cleanup, and temp-file cleanup behavior.
- Added governance for `GEMDUEL_PNPM_PATH`, `GEMDUEL_RULES_BRIDGE_MAILBOX_DIR`, and inherited
  `PATH` usage in `packages/shared/src/runtimeConfigPolicy.js` and
  `docs/governance/dependency-runtime-governance.md`.
- Re-audited the prior shared gameplay action diffs with tests for deterministic empty-cell UIDs,
  deterministic draft reroll behavior, and unaffordable-buy pending state preservation. No shared
  gameplay runtime logic was changed in this continuation.

## Evidence

- Replay parity: `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed for 11 fixtures and 54 rejection cases.
- Bridge/shared focused tests:
  `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`
  passed 88 tests after the `--out` response-file regression was added.
- Unity product-surface matrix:
  `artifacts/unity/editmode-product-surface-breadth-20260511-results.xml` passed 1/1 and wrote
  `artifacts/unity/product-surface-local-pvp-matrix-20260511.json`.
- Unity replay release-path recovery:
  `clients/unity/artifacts/unity/editmode-replay-release-path-20260511-results.xml` passed 1/1.
- Unity final EditMode:
  `artifacts/unity/editmode-mailbox-response-hardening-20260511-results.xml` passed 65/65, start
  `2026-05-11 22:54:47Z`, end `2026-05-11 23:11:19Z`, duration `992.1037968` seconds.
- Unity Windows build:
  `artifacts/unity/build-replay-release-path-smoke-20260511.log` reports `Build Successful` and
  batchmode exit code 0 after the built-player replay release-path smoke update.
- Built-player smoke:
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json` passed with
  live replay export/import/review, action families `take_gems`, `buy_card`, `click_board_cell`,
  `discard_gem`, `replenish`, `reserve_card`, and `cancel_gem_selection`, and final hashes
  `7d3f696c`, `5c804aa7`, and `9704183f`.
- Built-player replay release-path smoke:
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json` passed inside
  `GemDuelUnity.exe` with 8 live commands, `take_gems`, `buy_card`, `select_joker_color`, hash
  `95c8a06c`, invalid JSON, missing file, unsupported schema, corrupted summary, final hash
  mismatch, failed overwrite load, and valid overwrite/reload/review coverage.
- Built-player smoke matrix:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` passed validation
  for 4/4 launcher reports, 64 bridge-backed commands, 68 mailbox events, all required built-player
  smoke action families, one replay release-path report, and status `incomplete-evidence`.
- Electron-Unity parity:
  `pnpm parity:electron-unity` passed 54 equivalent rows in
  `artifacts/electron-unity-parity/2026-05-11T23-16-38-250Z/`.
- Repo gates passed:
  `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm release:check`,
  `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, and
  `pnpm secrets:check`. `pnpm bundle:check` and `pnpm release:artifacts:check` also passed after the
  final build.

## Built-Player Transport Finding

The first built-player attempts proved that `System.Diagnostics.Process.Start` from the Windows
player could not launch either `cmd.exe`/`pnpm.CMD` or direct `node.exe`; both failed with
`Native error= Success`. That direct child-process path remains unsuitable as release evidence.

The run then added a governed LocalDev mailbox transport. A rebuilt-player smoke exposed a Windows
response-file sharing race at the mailbox boundary; response publication is now atomic and Unity
mailbox response read/delete is retried or best-effort cleaned up. The built-player reports
`smoke-2026-05-11T22-24-33-783Z.launcher.json`,
`smoke-2026-05-11T23-32-01-688Z.launcher.json`, and
`smoke-2026-05-11T23-34-28-626Z.launcher.json`, and
`smoke-2026-05-11T23-50-03-972Z.launcher.json` are successful bounded smoke proofs: the player
starts fresh, enters Local PvP through the documented automation entrypoint, receives TypeScript
bridge responses via the ignored mailbox, applies real commands, records live replay events,
exports/imports/reviews the replay, covers balanced, longer, reserve-focused, and replay
release-path action families, and preserves final hashes `7d3f696c`, `5c804aa7`, `95c8a06c`, and
`9704183f`. This strengthens fresh-launch smoke evidence for LocalDev only. The aggregate matrix
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` validates these four
reports together, but it does not settle the final packaged release-runtime strategy.

## Remaining Blockers

- Built Windows player fresh-launch gameplay/replay evidence now exists for several bounded LocalDev
  mailbox smoke paths, including one built-player replay release-path recovery proof, but not for
  broad arbitrary product-surface play or final release-runtime packaging.
- Product-surface Local PvP coverage is broader but still bounded; it does not prove arbitrary full
  product play across every action family.
- LAN, online, and Visual Lab remain either unmigrated blockers or require explicit user-approved
  exclusion.
- TypeScriptGameRulesEngine remains a LocalDev/evidence bridge. It is not certified as the final
  packaged release runtime.
- Completion must not be claimed from Editor/EditMode pass, Windows build success, configured parity
  equivalence, fixture-backed UI evidence, seeded smoke evidence, or built-player launch without
  broad gameplay/replay proof.

## Next Safest Scope

1. Decide whether the LocalDev mailbox bridge is acceptable evidence-only automation and separately
   resolve the final release-runtime packaging strategy.
2. Expand the bounded product-surface action-family matrix only where it closes named parity-matrix
   blockers.
3. Get a clear implement/defer/exclude decision for LAN, online, and Visual Lab before any
   replacement-candidate completion claim.
