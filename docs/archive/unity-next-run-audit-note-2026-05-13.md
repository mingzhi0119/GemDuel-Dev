# Unity Next Run Audit Note - 2026-05-13

Status: Incomplete.

This note is the concise handoff for the May 13 Unity replacement-candidate continuation. It does
not supersede `docs/migration/unity-migration-governance.md`, and it does not claim completion.

## Strongest Retained Evidence

- Strict built-player unique log-path aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
  passed with explicit `--require-report-count 27`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, 27/27 retained launcher
  reports, 716 live commands, 812 mailbox events, all 21 required action families, every current
  release-path proof flag,
  `--require-game-over-count 3`, `--require-game-over-winner p1,p2`, winners `p1` and `p2`, no
  missing required families, no missing required winners, `requireUniqueReportPaths=true`, an empty
  `duplicateReportPaths` list, `requireUniqueSmokeReportPaths=true`, an empty
  `duplicateSmokeReportPaths` list, `requireUniqueLogPaths=true`, empty
  `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` lists, one
  report for each release-path proof family, no failures, and status `incomplete-evidence`.
- Audited built-player winner guard:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
  passed with 3/3 audited game-over reports, 288 live commands, 291 audited successful mailbox
  responses, winners `p1` and `p2`, and status `incomplete-evidence`; the p2-only negative check
  failed closed with `Required built-player game-over winner was not covered: p1`.
- Audited combined winner guard:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
  passed with 8/8 audited launcher reports, 350 commands, 365 audited mailbox responses, one
  invalid-action release-path report, required winners `p1,p2`, and status
  `incomplete-evidence`.
- Audited replay release-path proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`
  passed with `--require-audited-mailbox-responses` and `--require-replay-release-path`, 1/1 fresh
  built-player report, 8 live commands, 9 audited successful mailbox responses, full replay
  release-path coverage, final/review hash `f9eb9e83`, and status `incomplete-evidence`.
- Mailbox audit digest proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passed with `--require-audited-mailbox-response-digests`, 1/1 fresh built-player report, two live
  `take_gems` commands, three audited mailbox responses, 3/3 valid response digests, replay
  release-path coverage, final/review hash `bd4c4bd0`, and status `incomplete-evidence`.
- Launcher args proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passed with `--require-launcher-args`, `launcherArgsMatchSmoke=true`, 1/1 report, 3/3 valid
  response digests, replay release-path coverage, final/review hash `bd4c4bd0`, and status
  `incomplete-evidence`.
- Failure reason coherence proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passed with 1/1 report, zero retained failure reasons, 3/3 valid response digests, replay
  release-path coverage, final/review hash `bd4c4bd0`, and status `incomplete-evidence`.
- File-backed audited mailbox proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  passed with 9/9 parsed audit response files, and
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  passed with 365/365 parsed audit response files, one invalid-action release-path report, three
  game-over reports, winners `p1`/`p2`, and status `incomplete-evidence`.
- Strict audited built-player unique-path proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
  passed with `--require-audited-mailbox-responses`, `--require-report-count 8`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-invalid-action-release-path`,
  `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`: 8/8 audited launcher
  reports, 350 commands, 365 mailbox events, 365/365 valid retained audit response files, 359
  successful responses, twelve required audited action families, one invalid-action release-path
  report, three game-over reports, winners `p1`/`p2`, empty duplicate launcher/nested-smoke/stdout/
  stderr/player-log path lists, no failures, and status `incomplete-evidence`.
- Audited replay plus game-over strict proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
  passed with `--require-audited-mailbox-responses`, `--require-report-count 9`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`: 9/9 audited launcher reports, 358 commands, 374 mailbox
  events, 374/374 valid retained audit response files, 368 successful responses, twelve required
  audited action families, one replay release-path report, one invalid-action release-path report,
  three game-over reports, winners `p1`/`p2`, full replay release-path coverage, empty duplicate
  launcher/nested-smoke/stdout/stderr/player-log path lists, no failures, and status
  `incomplete-evidence`.
- Audited digest-count strict proof:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
  passed with `--require-audited-mailbox-responses`,
  `--require-audited-mailbox-response-digest-count 3`, `--require-report-count 10`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-launcher-args`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`: 10/10 audited launcher reports, 360 commands, 377 mailbox
  events, 377/377 valid retained audit response files, 3 valid audit response digests, 371
  successful responses, twelve required audited action families, two replay release-path reports,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, full replay
  release-path coverage, empty duplicate launcher/nested-smoke/stdout/stderr/player-log path lists,
  launcher-argument validation, no failures, and status `incomplete-evidence`.
- All-release plus audited-digest strict union:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
  passed with `--require-report-count 37`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, every current release-path
  flag, all 21 required action families, `--require-game-over-count 6`, and
  `--require-game-over-winner p1,p2`: 37/37 reports, 1076 commands, 1189 mailbox events, 377 valid
  retained audit response files, 3 valid audit response digests, 371 successful responses, every
  current release-path proof family, six game-over reports, winners `p1`/`p2`, no duplicate
  launcher/nested-smoke/stdout/stderr/player-log paths, no failures, and status
  `incomplete-evidence`. A stricter attempt with `--require-launcher-args` failed closed because
  two earliest 2026-05-11 launcher reports predate the later idle-action-preference argument
  metadata.
- Launcher-args refreshed union:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
  replaces those two oldest reports with current-format fresh built-player smokes and passes with
  `--require-report-count 37`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`,
  `--require-launcher-args`, every current release-path flag, all 21 required action families,
  `--require-game-over-count 6`, and `--require-game-over-winner p1,p2`: 37/37 reports, 1076
  commands, 1189 mailbox events, 421/421 valid retained audit response files, 47 valid audit
  response digests, 415 successful responses, every current release-path proof family, six
  game-over reports, winners `p1`/`p2`, no duplicate evidence paths, no failures, and status
  `incomplete-evidence`.

## Latest Lightweight Validation

- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 57/57
  after the `--require-report-count` guard, including exact retained count and too-high-count
  fail-closed cases.
- The strict report-count aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json`
  passed with `requiredReportCount: 27`, 27/27 reports, 716 commands, 812 mailbox events, all 21
  required families, three game-over reports, winners `p1`/`p2`, every current release-path proof
  family, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the strict report-count aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 59/59
  after the `--require-unique-report-paths` guard, including unique-path and duplicate-path
  fail-closed cases.
- The strict unique-report-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json`
  passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
  `duplicateReportPaths` list, 27/27 reports, 716 commands, 812 mailbox events, all 21 required
  families, three game-over reports, winners `p1`/`p2`, every current release-path proof family, and
  status `incomplete-evidence`.
- `git check-ignore -v` confirmed the strict unique-report-path aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 61/61
  after the `--require-unique-smoke-report-paths` guard, including unique nested smoke-report path
  and duplicate nested smoke-report path fail-closed cases.
- The strict unique nested smoke-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-nested-smoke-report-guard.json`
  passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
  `duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
  `duplicateSmokeReportPaths` list, 27/27 reports, 716 commands, 812 mailbox events, all 21
  required families, three game-over reports, winners `p1`/`p2`, every current release-path proof
  family, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the strict unique nested smoke-report aggregate remains ignored
  under `.gitignore:31:/artifacts/`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 63/63
  after the `--require-unique-log-paths` guard, including unique retained stdout/stderr/player-log
  path and duplicate retained log path fail-closed cases.
- The strict unique log-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
  passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
  `duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
  `duplicateSmokeReportPaths` list, `requireUniqueLogPaths: true`, empty
  `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` lists, 27/27
  reports, 716 commands, 812 mailbox events, all 21 required families, three game-over reports,
  winners `p1`/`p2`, every current release-path proof family, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the strict unique log-path aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- The strict audited unique-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
  passed with 8/8 reports, 350 commands, 365 mailbox events, 365/365 valid audit response files,
  exact report-count and unique report/smoke/log path guards, one invalid-action release-path
  report, winners `p1`/`p2`, no failures, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the strict audited unique-path aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- The audited replay plus game-over strict aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
  passed with 9/9 reports, 358 commands, 374 mailbox events, 374/374 valid audit response files,
  exact report-count and unique report/smoke/log path guards, replay release-path coverage, one
  invalid-action release-path report, winners `p1`/`p2`, no failures, and status
  `incomplete-evidence`.
- `git check-ignore -v` confirmed the audited replay plus game-over strict aggregate remains
  ignored under `.gitignore:31:/artifacts/`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 65/65
  after the `--require-audited-mailbox-response-digest-count` guard, including passing aggregate
  digest-count and missing-digest fail-closed cases.
- The audited digest-count strict aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
  passed with 10/10 reports, 360 commands, 377 mailbox events, 377/377 valid audit response files,
  3 valid response digests, exact report-count and unique report/smoke/log path guards,
  launcher-argument validation, replay release-path coverage, one invalid-action release-path
  report, winners `p1`/`p2`, no failures, and status `incomplete-evidence`.
- The all-release plus audited-digest union
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
  passed with 37/37 reports, 1076 commands, 1189 mailbox events, every release-path proof family,
  all 21 required action families, six game-over reports, winners `p1`/`p2`, 377 valid audit
  response files, 3 valid response digests, no duplicate evidence paths, no failures, and status
  `incomplete-evidence`.
- The refreshed launcher-args union
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
  passed with 37/37 reports, 1076 commands, 1189 mailbox events, every release-path proof family,
  all 21 required action families, `--require-launcher-args`, six game-over reports, winners
  `p1`/`p2`, 421 valid audit response files, 47 valid response digests, no duplicate evidence
  paths, no failures, and status `incomplete-evidence`.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `pnpm exec eslint tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `git check-ignore -v` confirmed the new strict winner-release aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- `git diff --check` passed with existing CRLF warnings only for migration markdown files.
- `Get-Process Unity,GemDuelUnity -ErrorAction SilentlyContinue` returned no running Unity player or
  editor process.
- The later audited replay release-path aggregate also passed its focused summarizer check; it
  strengthens release-path auditability only and does not change the status.
- `git check-ignore -v` confirmed the audited replay release-path launcher report, nested report,
  aggregate, and replay files remain ignored under `.gitignore:31:/artifacts/`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 18/18
  for file-backed audited mailbox response, built-player executable path, stdout capture, and
  stdout/stderr/player-log byte validation, plus nested smoke-report file validation and artifact
  path-boundary validation plus mailbox audit-response path-boundary and request-name validation.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the
  file-backed guard update.
- The executable-path guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
  passed 1/1, and the executable-path guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
  passed 8/8 with 365/365 valid audit response files, while retaining `incomplete-evidence`.
- The stdout-capture guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
  passed 1/1, and the stdout-capture guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
  passed 8/8 with 365/365 valid audit response files, while retaining `incomplete-evidence`.
- The stdout-byte guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
  passed 1/1, and the stdout-byte guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
  passed 8/8 with 365/365 valid audit response files, while retaining `incomplete-evidence`.
- The stderr-byte guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
  passed 1/1, and the stderr-byte guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
  passed 8/8 with 365/365 valid audit response files and retained stdout/stderr/player-log paths,
  while retaining `incomplete-evidence`.
- The nested-smoke-report guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
  passed 1/1, and the nested-smoke-report guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
  passed 8/8 with 365/365 valid audit response files and retained stdout/stderr/player-log paths,
  while retaining `incomplete-evidence`.
- The artifact-path guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
  passed 1/1, and the artifact-path guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
  passed 8/8 with 365/365 valid audit response files and retained stdout/stderr/player-log paths,
  while retaining `incomplete-evidence`.
- The mailbox audit-path guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
  passed 1/1, and the mailbox audit-path guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
  passed 8/8 with 365/365 valid audit response files and retained stdout/stderr/player-log paths,
  while retaining `incomplete-evidence`.
- The mailbox audit request-name guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
  passed 1/1, and the mailbox audit request-name guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
  passed 8/8 with 365/365 valid audit response files and retained stdout/stderr/player-log paths,
  while retaining `incomplete-evidence`.
- The peek-modal summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 37/37,
  including complete peek-modal evidence and missing `close_modal` fail-closed cases. The retained
  peek-modal aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json`
  passed 1/1 with 4 product-surface commands, 10 mailbox events, peek-modal review hash `8399eadd`,
  final hash `26aa66c6`, and status `incomplete-evidence`.
- The recovery invalid-action summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 39/39,
  including complete recovered invalid-action no-mutation/no-recording and continuation evidence
  plus rejected-event-recording fail-closed cases. The retained recovery invalid-action aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json`
  passed 1/1 with 2 product-surface commands, 9 mailbox events, continuation hash `d2b51b3f`, final
  hash `d2fd26e1`, and status `incomplete-evidence`.
- The privilege-cancel summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 41/41,
  including complete privilege phase/event/review evidence and reversed event-order fail-closed
  cases. The retained privilege-cancel aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json`
  passed 1/1 with 3 product-surface commands, 8 mailbox events, privilege-cancel hash `efe66377`,
  final hash `9e3b6f7c`, and status `incomplete-evidence`.
- The reserved-discard summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 43/43,
  including complete `puppet_master` selection, visible discard-control, event-order, count, and
  review-hash evidence plus hidden discard-control fail-closed cases. The retained
  reserved-discard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
  passed 1/1 with 6 product-surface commands, 14 mailbox events, reserved-discard hash `33909286`,
  final hash `fb772d70`, and status `incomplete-evidence`.
- The reserved-buy summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 45/45,
  including complete visible buy-control, reserved-source event, count, and review-hash evidence
  plus non-reserved buy-source fail-closed cases. The retained reserved-buy aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
  passed 1/1 with 6 product-surface commands, 16 mailbox events, reserved-buy hash `47c0e9db`,
  final hash `8ea252da`, and status `incomplete-evidence`.
- The reserve-cancel summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 47/47,
  including complete visible control, phase-reset, cleared pending-reserve, event-order, count, and
  review-hash evidence plus pending-state fail-closed cases. The retained reserve-cancel aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
  passed 1/1 with 6 product-surface commands, 10 mailbox events, reserve-cancel hash `40bdddbf`,
  final hash `bdbabdbb`, and status `incomplete-evidence`.
- The reserve-deck summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 49/49,
  including complete deck/gold control, deck-pending phase, deck/reserved/gold-cell mutation,
  event-order, count, and review-hash evidence plus no-deck-decrement fail-closed cases. The
  retained reserve-deck aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
  passed 1/1 with 6 product-surface commands, 10 mailbox events, reserve-deck hash `da89d9e5`,
  final hash `63df431c`, and status `incomplete-evidence`.
- The reserve-deck-cancel summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 51/51,
  including complete deck/gold reserve/cancel controls, deck-pending cancel phase, restored
  deck/reserved/gold-cell state, event-order, count, and review-hash evidence plus mutated-state
  fail-closed cases. The retained deck-reserve cancel aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
  passed 1/1 with 8 product-surface commands, 12 mailbox events, deck-reserve cancel hash
  `62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`.
- The Joker summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 53/53,
  including complete visible market preview/buy/color controls, color-selection phase transition,
  pending-buy clearing, Joker tableau placement, event-order, count, and review-hash evidence plus
  pending-buy fail-closed cases. The retained Joker aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
  passed 1/1 with 8 product-surface commands, 18 mailbox events, Joker hash `95c8a06c`, final hash
  `95c8a06c`, and status `incomplete-evidence`.
- The draft summary guard focused test
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 55/55,
  including fresh roguelike start, ordered P1/P2 `reroll_draft_pool` and `choose_boon` actions,
  `DRAFT_PHASE` to `IDLE` completion, live replay event counts, and review-hash evidence plus
  draft-phase fail-closed cases. The retained draft aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
  passed 1/1 with 8 product-surface commands, 9 mailbox events, draft hash `851b6356`, final hash
  `851b6356`, and status `incomplete-evidence`. The newer post-no-take-3 retained draft aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
  also passed 1/1 with 6 product-surface commands, 7 mailbox events, draft hash `857c3e58`, final
  hash `857c3e58`, and status `incomplete-evidence`.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the digest
  guard change.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 20/20,
  including digest mismatch and missing digest metadata fail-closed cases.
- Fresh digest smoke `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json`
  passed from `artifacts/unity/build/windows/GemDuelUnity.exe`, and digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passed 1/1 with 3/3 valid audit response digests, replay release-path coverage, and status
  `incomplete-evidence`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 22/22
  after the launcher args guard, including a fail-closed retained seed-argument mismatch case.
- The launcher-args digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passed 1/1 with `--require-launcher-args`, 3/3 valid audit response digests,
  `launcherArgsMatchSmoke=true`, replay release-path coverage, and status `incomplete-evidence`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 23/23
  after the failure reason coherence guard, including a fail-closed stale nested failure-reason
  case.
- The failure-reason digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passed 1/1 with zero retained failure reasons and status `incomplete-evidence`.
- The player-log-byte guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
  passed 1/1, and the player-log-byte guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
  passed 8/8 with 365/365 valid audit response files, while retaining `incomplete-evidence`.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 33/33 after the
  TypeScript bridge CLI `--out` temp cleanup guard. The new case forces output-publication failure
  and verifies no `response.json.*.tmp` file remains.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 34/34 after the
  TypeScript bridge structured error-output guard. The new case feeds malformed request JSON to the
  CLI with `--out` and verifies a structured `BRIDGE_EXECUTION_FAILED` response file plus non-zero
  process exit.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts -t "structured output-file rejection"`
  passed 2/2 targeted tests after the CLI rejected-command output guard. The new case sends a
  valid wrong-actor gameplay command through `vite-node --script ... --out`, verifies process exit
  status `2`, structured `INVALID_ACTOR` rejection JSON, preserved state/hash, empty stdout, and no
  leftover temp response file.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` then passed 35/35,
  including the new rejected-command output guard and the existing malformed request, temp cleanup,
  platform-hash, rejection, golden replay, and simulated game-over bridge coverage.
- `pnpm typecheck` and `pnpm lint` both passed from Turbo cache after the rejected-command output
  guard.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` later passed 36/36 after
  the apply-metadata hash guard. The added case sends the same live `TAKE_GEMS` command with and
  without LocalDev platform/user metadata, verifies matching replay-state hashes, and verifies those
  identifiers stay out of serialized replay state.
- `pnpm typecheck` and `pnpm lint` both passed from Turbo cache after the apply-metadata hash guard.
- `pnpm exec eslint tools/migration/summarize-unity-built-player-smokes.mjs` passed; the focused
  `.test.ts` path is not covered by the current ESLint config and reported the existing ignored-file
  warning with exit 0.
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md` now maps the active
  prompt requirements, named files, suggested commands, final-report categories, prohibitions, and
  stop conditions to current retained evidence and explicit blockers. It preserves `Incomplete`
  status.
- Unity EditMode bridge availability negative-case coverage now checks missing `tools/scripts` and
  missing `tools/migration/unity-rules-engine-bridge.ts` diagnostics in
  `TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured`. The first focused
  `-testFilter` batchmode attempt executed zero tests and is not evidence; the follow-up batchmode
  run produced
  `artifacts/unity/editmode-bridge-availability-negative-20260513-testnames-results.xml`, which
  reports 91/91 passed and includes the updated bridge availability test.
- Unity EditMode mailbox corrupt-response cleanup coverage now checks malformed mailbox response
  JSON in `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles`. The first two full
  EditMode attempts failed inside the new guard and are retained as negative evidence; the next run
  proved the guard passed but exposed a slow product-surface timeout. After aligning that timeout
  with the existing 600-second bounded matrix timeout, the final full rerun
  `artifacts/unity/editmode-mailbox-corrupt-response-timeout-fixed-20260513-results.xml` reports
  91/91 passed and includes the corrupt-response cleanup guard.
- Unity mailbox request cleanup hardening now removes the published request `.json` path from
  `TypeScriptRulesBridgeMailboxClient.Execute` on timeout or response parse failure. The updated
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` test proves timeout and
  corrupt-response paths leave no stale request files, and the full rerun
  `artifacts/unity/editmode-mailbox-request-cleanup-20260513-results.xml` reports 91/91 passed.
- Shared action oracle follow-up validation re-audited commit
  `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c` and found the three prompt-named shared changes are
  already covered by TypeScript oracle tests: deterministic empty board-cell UIDs, deterministic
  offline draft rerolls with P1/P2 ownership separation, and unaffordable buy preservation of
  `pendingBuy`. The focused command
  `pnpm exec vitest run packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`
  passed 3 files and 57 tests. No shared action runtime or Electron gameplay changes were made.
- Built-player replay-review summary guard tests now prove
  `--require-replay-review-release-path` accepts complete visible redo/undo navigation evidence and
  fails closed if visible review-control evidence is missing. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 25/25.
  The retained replay-review launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json`
  with 1/1 report, 4 commands, 10 mailbox events, replay-review hash `db7fb1b7`, and status
  `incomplete-evidence`.
- Built-player replay release-path summary guard tests now prove
  `--require-replay-release-path` accepts complete retained coverage/case/hash evidence and fails
  closed if a required coverage label is missing. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 27/27.
  The retained audited replay release-path launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json`
  with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full replay
  release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`.
- Built-player invalid-action summary guard tests now prove
  `--require-invalid-action-release-path` accepts complete no-mutation/no-recording evidence and
  fails closed if a retained rejected case mutates state. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 29/29.
  The retained audited invalid-action launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json`
  with 1/1 report, 1 product-surface command, 9 mailbox events, 9/9 retained audit response files,
  invalid-action hash `f2780c3f`, and status `incomplete-evidence`.
- Built-player recovery summary guard tests now prove `--require-recovery-release-path` accepts
  complete save/load/continue evidence and fails closed if recovery continuation does not append the
  expected replay event. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 31/31.
  The retained recovery launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json`
  with 1/1 report, 2 product-surface commands, 6 mailbox events, recovery continuation hash
  `8d4178f7`, and status `incomplete-evidence`.
- Built-player settings summary guard tests now prove `--require-settings-release-path` accepts
  complete save/reload and no-gameplay-mutation evidence and fails closed if settings evidence
  records gameplay events. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 33/33.
  The retained settings launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json`
  with 1/1 report, 2 product-surface commands, 5 mailbox events, settings path
  `artifacts/unity/settings/gemduel.preferences.v1.json`, final hash `8668e7ab`, and status
  `incomplete-evidence`.
- Built-player chrome summary guard tests now prove `--require-chrome-release-path` accepts complete
  rulebook/restart evidence and fails closed if rulebook controls change the live replay event
  count. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 35/35.
  The retained chrome launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json`
  with 1/1 report, 2 product-surface commands, 6 mailbox events, chrome restart hash `5304b037`,
  final hash `e3a47e84`, and status `incomplete-evidence`.
- Built-player reserved-discard summary guard tests now prove
  `--require-reserved-discard-release-path` accepts complete `puppet_master` selection, visible
  reserved-card discard controls, event-order, count, and review-hash evidence and fails closed if
  discard-control evidence is hidden. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 43/43.
  The retained reserved-discard launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 14 mailbox events, reserved-discard hash
  `33909286`, final hash `fb772d70`, and status `incomplete-evidence`.
- Built-player reserved-buy summary guard tests now prove
  `--require-reserved-buy-release-path` accepts complete visible reserved-card buy controls,
  reserved-source event-order, count, and review-hash evidence and fails closed if the buy event
  source is not reserved. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 45/45.
  The retained reserved-buy launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 16 mailbox events, reserved-buy hash `47c0e9db`,
  final hash `8ea252da`, and status `incomplete-evidence`.
- Built-player reserve-cancel summary guard tests now prove
  `--require-reserve-cancel-release-path` accepts complete visible reserve/cancel controls,
  phase-reset, cleared pending-reserve, event-order, count, and review-hash evidence and fails closed
  if pending reserve state remains after cancel. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 47/47.
  The retained reserve-cancel launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-cancel hash `40bdddbf`,
  final hash `bdbabdbb`, and status `incomplete-evidence`.
- Built-player reserve-deck summary guard tests now prove
  `--require-reserve-deck-release-path` accepts complete deck/gold control, deck-pending phase,
  deck/reserved/gold-cell mutation, event-order, count, and review-hash evidence and fails closed if
  the deck does not decrement. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 49/49.
  The retained reserve-deck launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-deck hash `da89d9e5`,
  final hash `63df431c`, and status `incomplete-evidence`.
- Built-player reserve-deck-cancel summary guard tests now prove
  `--require-reserve-deck-cancel-release-path` accepts complete deck/gold reserve/cancel controls,
  deck-pending cancel phase, restored deck/reserved/gold-cell state, event-order, count, and
  review-hash evidence and fails closed if cancel mutates deck/reserve row/pending reserve/Gold
  state. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 51/51.
  The retained deck-reserve cancel launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 12 mailbox events, deck-reserve cancel hash
  `62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`.
- Built-player Joker summary guard tests now prove `--require-joker-release-path` accepts complete
  visible market preview/buy/color controls, `SELECT_CARD_COLOR` to `IDLE` transition, Joker
  tableau placement, pending-buy clearing, event-order, count, and review-hash evidence and fails
  closed if pending buy remains after buy. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 53/53.
  The retained Joker launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 18 mailbox events, Joker hash `95c8a06c`, final hash
  `95c8a06c`, and status `incomplete-evidence`.
- Built-player draft summary guard tests now prove `--require-draft-release-path` accepts fresh
  roguelike `reroll-each-player-first` start, ordered P1/P2 `reroll_draft_pool` and `choose_boon`
  actions, `DRAFT_PHASE` to `IDLE` completion, live replay event counts, and review-hash evidence,
  and fails closed if both players' draft selections do not resolve to `IDLE`. The focused command
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 55/55.
  The retained draft launcher report also passed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 9 mailbox events, draft hash `851b6356`, final hash
  `851b6356`, and status `incomplete-evidence`. The newer post-no-take-3 retained draft aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
  also passed 1/1 with 6 product-surface commands, 7 mailbox events, draft hash `857c3e58`, final
  hash `857c3e58`, and status `incomplete-evidence`.

## Remaining Blockers

- Bounded built-player LocalDev smoke is not arbitrary full product-surface Local PvP.
- `TypeScriptGameRulesEngine` remains a LocalDev/evidence bridge; final release-runtime packaging is
  unresolved.
- LAN route is not migrated or user-approved excluded.
- Online route is not migrated or user-approved excluded.
- Visual Lab route is not migrated or user-approved excluded.
- Broader release-path replay/recovery and full product-scope parity remain incomplete.

The correct next-run status is still `Incomplete`, not `Complete`.

## Final Validation Addendum

- Repo/local gates passed in this continuation: summarizer Vitest 73/73 after launcher exit-code,
  timeout, success-flag fail-closed, required-flag metadata, and replay release-path no-mutation
  tests, bridge Vitest 35/35, replay parity verifier with 11 fixtures and 65 rejection cases,
  Unity catalog export/check,
  `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`,
  `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, `pnpm secrets:check`, and `git diff --check`.
- Retained built-player aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-required-flag-metadata-refresh.json`
  passed 37/37 reports with all required release-path metadata flags set to `true`, every current
  release-path proof family covered, six game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- Focused replay no-mutation aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-nomutation.json`
  passed one fresh built-player LocalDev report with `--require-replay-release-path-no-mutation`,
  audited mailbox response/digest checks, all replay release-path cases, eight rejected-import
  no-mutation case records, final hash `1acd96c`, and status `incomplete-evidence`.
- Windows build passed in `artifacts/unity/build-final-validation-fixed-20260513.log` with
  `Build Finished, Result: Success.` and batchmode return code 0.
- The focused replay no-mutation Windows build also passed in
  `artifacts/unity/build-replay-nomutation-20260513.log` with
  `Build Finished, Result: Success.`.
- The first full `pnpm parity:electron-unity` attempt timed out after about 604 seconds. Partial
  artifacts are under `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`; this is
  superseded timeout evidence, not a passing parity gate.
- `pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"` passed only as cleanup
  evidence at `artifacts/electron-unity-parity/2026-05-13T12-26-01-458Z`; Unity capture was
  skipped and the summary retained 27 blocker rows.
- The longer full `pnpm parity:electron-unity` rerun passed after about 805 seconds at
  `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`, with `unity.ok: true`,
  `counts.Equivalent: 54`, viewports `1920x1080` and `1366x768`, and browser process guard counts
  of `1/14/1` inside budget.
- Fresh full Unity EditMode now passes after the smoke-driver fix. The too-short 22-minute run was
  stopped, the longer rerun produced real 90/91 evidence, the focused draft smoke fix rerun
  `artifacts/unity/editmode-draft-smoke-final-fix-20260513-results.xml` passed 1/1, and
  `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` passed 91/91.

Next run should start from `Incomplete`, prioritize remaining product-scope blockers and the
release-runtime TypeScript bridge packaging decision, and avoid claiming replacement-candidate
readiness from the retained built-player ledger plus configured parity alone.
