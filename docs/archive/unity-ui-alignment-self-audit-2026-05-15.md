# Unity UI Alignment Self-Audit 2026-05-15

## Verdict

The Unity migration visual-alignment claim was overaccepted. The earlier process proved shared
state and interaction contracts, but it did not force every migrated Unity UI surface through a
strict Electron screenshot gate.

Rulebook is now covered page-by-page and no longer exits when `next` or table-of-contents entries
are clicked. Static entry surfaces now pass strict Electron pixel checks, but the dynamic gameplay
UI is still not visually aligned. The latest strict suite has 44 rows across the two audited
viewports: 20 equivalent rows and 24 failing dynamic rows. The retained card-artwork sampling, royal
panel, resource badge, empty-gem badge opacity, empty-tableau, identity-rail, player-zone
object-cover, deck-preview label, market-deck chip width/label offsets, resource action-target, P1
reserved-geometry, market-label text, deck-preview content-rect, and preview background-capture
layout repairs reduce
confirmed strict mismatches, but the matrix is still mixed and far below the 99% dynamic UI gate.
The latest best failing dynamic row is
95.760031% and the worst failing dynamic row is 88.849441%.

Unity visual migration parity is still blocked until `pnpm parity:ui-alignment` exits 0 with 0
failing rows.

## Why This Was Missed

1. The migration gate mixed behavioral equivalence with visual equivalence. Shared state, action
   behavior, operation contracts, and semantic boxes were treated as enough for surfaces whose pixels
   were never blocked.
2. Several player-facing scenarios previously skipped visual diff or used visual diff only as
   diagnostic evidence. That allowed UI drift to survive while the matrix still looked useful.
3. Rulebook coverage opened only the first page. It did not drive `next`, `previous`, or
   table-of-contents navigation, so the navigation-exit bug and later-page visual drift were outside
   the evidence.
4. The runner could emit failing visual rows without a named suite failing closed. The process
   allowed "artifact exists" to be mistaken for "alignment passed."
5. Hotspot localization did not exist, so remaining dynamic mismatches were described visually rather
   than measured by component region.

## Control Suite Added

Run the strict visual gate from the repo root:

```powershell
pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment/<run-id>
```

The `ui-alignment` suite now:

- selects migrated player-facing surfaces explicitly: main menu, settings, Rulebook page 1 through
  page 9, preview overlays, board/player zones, buy/reserve/end-turn, P1/P2 reserved-card states,
  and royal featured display;
- forces strict screenshot comparison even for scenarios that previously skipped visual diff;
- requires at least 99% strict pixel similarity for every row;
- exits non-zero when any row is not `Equivalent`;
- supports focused repair runs with `--scenario` and `--scenarios`;
- supports scenario-specific replay fixtures so UI states outside the royal extra-turn replay, such
  as P1 reserved cards, cannot stay untested;
- waits 3600ms before Electron capture so transient turn-handoff frames are not accepted as visual
  evidence.
- exposes fine-grained player-zone semantic boxes for reserved columns/mini-stacks, avatars,
  identity labels, tableau rows, tableau stacks, top-card surfaces, point ribbons, bonus badges, and
  empty-stack surfaces, with matching Unity transparent `visibleTargets`. This prevents a broad
  `player.current.zone` / `player.opponent.zone` hotspot from hiding smaller geometry defects.
- includes individual player resource gem boxes (`player.current.gem.*` and
  `player.opponent.gem.*`) in strict bbox comparison instead of filtering them out of the default
  geometry gate. This lets resource-row visual failures distinguish geometry drift from remaining
  artwork/compositing drift.
- includes `pnpm parity:ui-root-compare`, which compares an old Unity artifact root and a new Unity
  artifact root against the same fixed Electron screenshots. This prevents recaptured Electron
  frames from being mistaken for Unity improvement and produces `summary.json`, `summary.md`, and
  old/new diff PNGs for candidate-retention decisions.
- Added an explicit `--common-only` diagnostic mode to `pnpm parity:ui-root-compare`. The default
  remains fail-fast on missing screenshots, but exploratory candidate reviews can now compare only
  rows present in the old Unity, new Unity, and fixed Electron roots while writing omitted rows to
  `skippedRows`. This is not completion evidence for the full 99% gate; skipped rows remain
  unverified.
- `tools/migration/electron-unity-parity-runner.test.mjs` now imports the runner definitions without
  executing the CLI and asserts that `ui-alignment` includes Rulebook pages 2 through 9, uses real
  `click_rulebook_next` / `click_rulebook_nav` actions, keeps every Rulebook page under strict 99%
  pixel parity, and retains the dynamic gameplay surfaces in the same strict suite.

The hotspot analyzer converts an existing failed matrix into component-level evidence:

```powershell
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment/<run-id> -Top 8
```

It writes `hotspot-report.json` and `hotspot-report.md` under the artifact root unless explicit
`-OutJson` / `-OutMarkdown` paths are provided. Passing `-CropRoot hotspot-crops` also writes
Electron, Unity, and diff PNG crops for the top semantic and grid hotspots in each row, so a failed
dynamic surface can be inspected as localized image evidence instead of only a full-screen mismatch.
The analyzer now also reports `topNonFullscreenSemanticRegions` and `topDenseSemanticRegions`.
Non-fullscreen ranking excludes regions covering 80% or more of the compared screenshot, preventing
`card.preview.overlay` and `card.preview.backdrop` from hiding the next actionable component. Dense
ranking prioritizes high mismatch percentage before raw pixel count, exposing small but severely
misaligned controls such as `turn.end`, replay controls, labels, reserved mini-stacks, and tableau
badges. With `-CropRoot`, the report writes `semantic-nonfull` and `semantic-dense` crop triplets in
addition to the original semantic and grid crops.
The Electron DOM dump now also emits current-player column aliases for `player.resources` and
`player.score` as `player.current.resourcesColumn` and `player.current.identityColumn`, matching the
Unity target vocabulary. This keeps active-player resource/identity drift visible in component-level
hotspot reports instead of collapsing it into the broad `player.current.zone` region.
For token-safe status checks, summarize existing artifacts before opening large reports:

```powershell
pnpm parity:ui-summary -- --root artifacts/electron-unity-ui-alignment/<run-id> --top 8 --hotspots 3 --sizes
```

This reads `parity-matrix.json`, per-row visual diff JSON, and optional `hotspot-report.json`, then
prints a compact failing-row and recurring-hotspot summary. Use this before reading
`parity-matrix.md`, `hotspot-report.md`, or full JSON files in chat; those files are useful retained
evidence, but dumping them directly is a token-expensive diagnostic path.
`-CropRoot` now accepts both artifact-root-relative crop folders such as `hotspot-crops` and
workspace-relative paths that already point inside the artifact root. This closes the earlier rough
edge where passing `artifacts/.../hotspot-crops-focused` could create a duplicated nested path and
fail during PNG save with a generic GDI+ error.

Latest diagnostic evidence:

- `C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter "GemDuel.Tests.EditMode.ReplayParityEditModeTests.LiveMarketPreviewPrimaryActionFirstViewportClickBuysCardOnce;GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevChromeReleasePathSmokeOpensRulebookRestartsAndRestartsLiveGame" -testResults artifacts/unity/editmode-lexicon-2026-05-18.xml -logFile artifacts/unity/editmode-lexicon-2026-05-18.log`
  passed on the current retained bilinear-sampler worktree with 2/2 tests passed. This refreshes the
  preview-card keyword popover and Rulebook keyword popover/navigation guards after the latest
  Unity rendering change.
- `C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LiveMarketPreviewPrimaryActionFirstViewportClickBuysCardOnce -testResults artifacts/unity/editmode-card-lexicon-preview-current-2026-05-18.xml -logFile artifacts/unity/editmode-card-lexicon-preview-current-2026-05-18.log`
  passed on the current worktree. This focused Unity EditMode check verifies the preview card
  `buyCard` lexicon target, opens the keyword explanation popover, closes it, and then completes the
  preview primary action without leaving the preview path.
- `C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevChromeReleasePathSmokeOpensRulebookRestartsAndRestartsLiveGame -testResults artifacts/unity/editmode-lexicon-rulebook-current-2026-05-18.xml -logFile artifacts/unity/editmode-lexicon-rulebook-current-2026-05-18.log`
  passed on the current worktree. This focused Unity EditMode check verifies Rulebook content still
  comes from `packages/ui/src/components/RulebookContent.ts`, lexicon text still comes from
  `packages/shared/src/lexicon/index.ts`, keyword activation opens an explanation without leaving
  Rulebook page 1, and the following real `next` navigation reaches page 2.
- `pnpm vitest run tools/migration/electron-unity-parity-runner.test.mjs` passed on the current
  worktree, proving the suite coverage guard for Rulebook multi-page navigation and dynamic UI
  scenarios is executable.
- `pnpm parity:ui-alignment --scenarios "chrome-rulebook-page-2,chrome-rulebook-page-9" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-rulebook-nav-smoke-2026-05-17`
  completed on the current worktree. Page 2 is driven by `click_rulebook_next`, page 9 is driven by
  `click_rulebook_nav`, and all four audited rows are `Equivalent` with `Equivalent real-action path`.
  This rechecks the originally missed navigation failure mode without weakening the remaining dynamic
  UI blocker.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-preview-settings-current-2026-05-17 -Top 8 -CropRoot hotspot-crops-nonfull -OutJson artifacts/electron-unity-ui-alignment-preview-settings-current-2026-05-17/hotspot-report-nonfull.json -OutMarkdown artifacts/electron-unity-ui-alignment-preview-settings-current-2026-05-17/hotspot-report-nonfull.md`
  completed for 8 preview/settings rows. The top full-screen preview hotspot is still usually
  `card.preview.overlay` or `card.preview.backdrop`, but the new non-fullscreen ranking shows
  `royal.featured` as the largest hidden component in market/deck previews and
  `player.current.zone` in reserved-card preview.
- `pnpm --dir apps/desktop test -- src/app/parity/__tests__/electronUnityParityState.test.ts`
  passed after adding the current-player column alias coverage. The focused run
  `pnpm parity:ui-alignment --scenarios "initial-board-render,reserve-card,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-current-column-alias-focused-2026-05-17`
  still exits non-zero because the six audited dynamic rows remain below 99%, but its Electron state
  now exposes `player.current.resourcesColumn` and `player.current.identityColumn` alongside
  `player.resources` and `player.score`. The fixed-Electron comparison
  `electron-unity-ui-alignment-current-column-alias-root-compare-2026-05-17` compares all six focused
  rows with `skippedRows: []` and shows only a 1-pixel recapture delta, confirming this is a
  diagnostic-suite hardening change rather than a visual masking change.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17/hotspot-report-dense-current.json -OutMarkdown artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17/hotspot-report-dense-current.md -CropRoot hotspot-crops-dense-current`
  completed for 16 dynamic rows. Non-fullscreen totals still point at board, royal featured, and
  player-zone regions; dense ranking exposes the smaller next repair targets:
  `player.current.tableau.red.topCard`, `player.current.tableau.white.points`,
  `player.reserved.1`, `turn.end`, `replay.control.undo`, and player labels. This is diagnostic
  evidence only; it does not satisfy the full 99% gate.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after the retained reserved-card and disabled-replenish repairs. The 16-row focused
  dynamic matrix still fails every row, but the fixed-Electron comparison
  `electron-unity-ui-alignment-reserved-replenish-dynamic-root-compare-2026-05-17` improves 8 rows,
  regresses 0 rows, leaves 8 unchanged, and reduces strict mismatches from 2,394,361 to 2,383,074
  (-11,287). Remaining dense hotspots now point at board/royal/player-zone regions plus
  `player.current.reserved.0.visual`, tableau point regions, `player.reserved.1`, player labels, and
  replay undo.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after the retained replay-control color repair. The 16-row focused dynamic matrix still
  fails every row, but the fixed-Electron comparison
  `electron-unity-ui-alignment-replay-control-colors-dynamic-root-compare-2026-05-17` improves 8 rows,
  regresses 0 rows, leaves 8 unchanged, and reduces strict mismatches from 2,372,391 to 2,346,535
  (-25,856). `replay.control.undo` is no longer the dense hotspot in initial/resource rows; the next
  dense targets are player labels, tableau point regions, and reserved-stack/card regions, while broad
  board/royal/player-zone regions still dominate the non-fullscreen totals.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after the retained replay-review label visual-state repair. The 16-row focused dynamic
  matrix still fails every row, but the fixed-Electron comparison
  `electron-unity-ui-alignment-replay-control-label-dynamic-root-compare-2026-05-17` improves 8 rows,
  regresses 0 rows, leaves 8 unchanged, and reduces strict mismatches from 2,340,871 to 2,340,596
  (-275). The small delta is expected because this only corrects the active player's label color in
  replay review; player labels remain dense hotspots because font rendering and opponent-label
  sampling still diverge from Electron.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after suppressing Unity's TopBar turn pointer to match Electron `GameShell`, which passes
  `renderTurnPointer={false}`. The 16-row focused dynamic matrix still fails every row, but
  `electron-unity-ui-alignment-topbar-pointer-off-dynamic-root-compare-2026-05-17` improves 16 rows,
  regresses 0 rows, and reduces strict mismatches from 2,365,574 to 2,364,457 (-1,117).
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after matching Unity inactive player-zone labels to Electron dark-mode `text-slate-300`.
  The 16-row focused dynamic matrix still fails every row. The fixed-Electron comparison
  `electron-unity-ui-alignment-player-label-muted-slate300-dynamic-root-compare-2026-05-17` improves
  9 rows, leaves 4 unchanged, has three 1-pixel 1366x768 edge regressions, and reduces strict
  mismatches from 2,364,457 to 2,363,752 (-705). Player labels remain dense hotspots because
  font weight/antialiasing and target sampling still diverge from Electron.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after moving Unity market deck artwork, gradient, and labels into the Electron
  `border-2 border-transparent` content box while keeping the outer deck semantic/click target at
  the full Electron `data-market-deck` rect. The focused 16-row dynamic matrix still fails every
  row, but `electron-unity-ui-alignment-market-deck-borderbox-dynamic-root-compare-2026-05-17`
  improves 16 rows, regresses 0 rows, and reduces strict mismatches from 2,363,752 to 2,339,405
  (-24,347). Market deck backs remain a visible hotspot, but the named market-level mismatches drop
  in both count and mean delta.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after applying Electron's `READABILITY_HUD_TEXT_STYLE` text-shadow treatment to Unity's
  TopBar turn and score labels. The focused 16-row dynamic matrix still fails every row, but
  `electron-unity-ui-alignment-topbar-readability-dynamic-root-compare-2026-05-17` improves 16 rows,
  regresses 0 rows, and reduces strict mismatches from 2,339,405 to 2,338,355 (-1,050). Remaining
  hotspots still point at board, royal featured, player-zone regions, player labels, market deck
  backs, and TopBar score/turn text, so this is a retained micro-repair rather than a dynamic-suite
  completion signal.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after adding fine-grained TopBar score/crown/points semantic boxes and moving Unity's
  TopBar inner score layout to Electron's measured `scale-105` active-group geometry. The focused
  16-row dynamic matrix still fails every row, but
  `electron-unity-ui-alignment-topbar-inner-layout-dynamic-root-compare-2026-05-17` improves 16 rows,
  regresses 0 rows, and reduces strict mismatches from 2,312,723 to 2,286,056 (-26,667) against a
  fixed Electron baseline. Remaining hotspots still point mainly at board, royal featured,
  player-zone regions, player labels, tableau point ribbons, reserved mini-stacks, and market deck
  backs, so this is a retained TopBar repair rather than a dynamic-suite completion signal.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 -Scenarios "p1-multi-reserved-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17/hotspot-report-p1-multi.json -OutMarkdown artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17/hotspot-report-p1-multi.md -CropRoot hotspot-crops-p1-multi`
  completed after matching Unity's no-buff fallback avatar and player-label vertical offsets to
  Electron's compact flex layout. The focused 16-row dynamic matrix still fails every row, but
  `electron-unity-ui-alignment-fallback-avatar-compact-dynamic-root-compare-2026-05-17` improves 2
  rows, regresses 0 rows, leaves 14 unchanged, and reduces strict mismatches from 2,286,502 to
  2,284,504 (-1,998) against the fixed Electron baseline. The corrected P1 multi-reserved bbox check
  removes the prior `player.current.avatar` / `player.opponent.avatar` 11px vertical miss at
  1920x1080 and the 7.82px vertical miss at 1366x768; remaining P1 multi-reserved hotspots are now
  led by the reserved mini-stack cards and broader player-zone regions.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after compositing Unity runtime card artwork over Electron's `CardFacePattern` runtime
  placeholder color (`bg-slate-800`) before display-texture downsampling. The fixed-Electron
  comparison improves 14 of 16 focused dynamic rows and reduces strict mismatches from 2,320,471 to
  2,319,663 (-808), with two tiny 1366x768 regressions (+18 and +34). The focused matrix still fails
  strict 99% in every row.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17 -Scenarios "p1-multi-reserved-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17/hotspot-report-p1-multi.json -OutMarkdown artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17/hotspot-report-p1-multi.md -CropRoot hotspot-crops-p1-multi`
  completed after replacing Unity fallback avatar text glyphs with line-drawn Shield/Swords icons
  matching Electron `PlayerZoneIdentityColumn`'s lucide fallback icons. The focused fixed-Electron
  comparison reduces mismatches from 294,676 to 294,642 (-34) across the two P1 multi-reserved rows,
  and the 16-row dynamic comparison improves 2 rows, regresses 0 rows, leaves 14 unchanged, and
  reduces strict mismatches from 2,301,293 to 2,301,259 (-34). Remaining dense hotspots are still the
  reserved mini-stack cards and broader player-zone regions, so this is not dynamic-suite completion.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic`
  completed after changing Unity's card matte branch to output Electron's rounded card-shell alpha
  instead of preserving source-PNG alpha. The focused P1 multi-reserved fixed-Electron comparison
  improves both rows by 306 pixels total, and the 16-row dynamic fixed-Electron comparison improves
  all 16 rows, regresses 0 rows, and reduces strict mismatches from 2,297,109 to 2,290,951 (-6,158).
  The subset still fails strict 99%; remaining broad hotspots are still board, royal featured, and
  player zones, while dense hotspots now expose player labels, market card regions, and tableau
  point/card regions.
- `pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-chip-width-dynamic-candidate-2026-05-17`
  completed after shrinking Unity's normal market-deck level chip toward the Electron artwork path's
  compact `px-2 text-[10px]` pill sizing instead of the wider fixed Unity label box. The focused
  4-row market check improved all rows with 0 regressions and reduced strict mismatches by 446 pixels.
  The broader 16-row dynamic fixed-Electron comparison
  `electron-unity-ui-alignment-market-deck-chip-width-dynamic-root-compare-2026-05-17` improves all
  16 rows, regresses 0 rows, and reduces strict mismatches from 2,285,877 to 2,284,074 (-1,803).
  The subset still fails strict 99%, so this is retained as a market-deck foreground/layout repair
  rather than dynamic-suite completion.
- `pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-label-offset-dynamic-candidate-2026-05-17`
  completed after moving Unity's normal market-deck level/count labels down toward Electron's
  artwork path layout (`bottom-3` plus compact vertical gap). The focused 4-row market check improved
  all rows with 0 regressions and reduced strict mismatches by 2,328 pixels. The broader 16-row
  dynamic fixed-Electron comparison
  `electron-unity-ui-alignment-market-deck-label-offset-dynamic-root-compare-2026-05-17` improves all
  16 rows, regresses 0 rows, and reduces strict mismatches from 2,294,591 to 2,285,473 (-9,118).
  The subset still fails strict 99%, so this is retained as another market-deck layout repair rather
  than dynamic-suite completion.
- `pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-card-readable-dynamic-candidate-2026-05-17`
  completed after making the actual P1 reserved-card fixture card textures readable so Unity's
  Electron-style display-texture downsample path can call `GetPixels32()` instead of falling back to
  direct source-texture scaling. The 16-row dynamic run still fails strict 99%, but the fixed-Electron
  comparison `electron-unity-ui-alignment-card-readable-dynamic-root-compare-2026-05-17` improves 4
  rows, regresses 0 rows, leaves 12 unchanged, and reduces strict mismatches from 2,269,195 to
  2,200,137 (-69,058). The gains are correctly concentrated in `p1-reserved-card-display` and
  `p1-multi-reserved-card-display`, so this is retained as a reserved-card rendering-input repair
  rather than a dynamic-suite pass.
- `pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-current-after-card-readable-2026-05-17`
  is the latest full strict suite after retaining the proved card-readable subset. It has 44 rows:
  20 equivalent and 24 failing. All Rulebook rows still pass through real navigation actions. The
  current best failing row is `initial-board-render` at 93.050637%, and the current worst failing row
  is `market-deck-reserve-preview` at 87.209271%.
- `pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-current-after-card-readable-2026-05-17 -Top 8 -OutJson artifacts/electron-unity-ui-alignment-current-after-card-readable-2026-05-17/hotspot-report.json -OutMarkdown artifacts/electron-unity-ui-alignment-current-after-card-readable-2026-05-17/hotspot-report.md -CropRoot hotspot-crops`
  completed for the same 44-row run. It confirms the static and Rulebook rows are no longer the
  blocker; remaining large hotspots are `card.preview.backdrop`, `board.root`, `royal.featured`,
  `player.current.zone`, `player.opponent.zone`, `market.level.*`, topbar text/icon clusters, and
  tableau/reserved mini-stack card regions.

## Fixes Landed

- Added `pnpm parity:ui-alignment`, `pnpm parity:ui-hotspots`, and
  `pnpm parity:ui-root-compare`.
- Added strict-pixel result fields and `-RequireStrictPixel` to `tools/migration/compare-png.ps1`.
- Added `--suite`, `--scenario`, `--scenarios`, suite-level strict visual options, and fail-closed
  exit behavior to `tools/migration/electron-unity-parity-runner.mjs`.
- Added Rulebook page 2 through page 9 scenarios driven by real `next` or table-of-contents clicks.
- Fixed Unity Rulebook navigation so `next`, `previous`, and table-of-contents targets update the
  manual instead of closing it.
- Moved Unity Rulebook, main menu, and default settings static surfaces onto Electron pixel
  baselines while preserving Unity-native semantic hit targets.
- Fixed several previously uncovered Unity semantic/control mismatches: preview close target,
  preview action geometry, replay review controls, topbar long-turn geometry, market deck chips,
  rulebook hit targets, main-menu copy, and runtime asset import sampling.
- Fixed Unity's player-zone special stack to match Electron `PlayerZone.tsx`: the special stack is
  pure-point `bonusColor === "null"` cards plus royals, not pearl bonus cards.
- Suppressed replay review controls and cleared transient hover state before Unity preview backdrop
  capture. This is still not enough for 99% overlay parity, but it prevents a click-time hover-only
  state from being baked into the blurred preview background.
- During preview overlays, Unity now keeps the topbar chrome semantic/click targets but does not draw
  the live topbar chrome buttons above the overlay. The fixed-Electron comparison
  `electron-unity-ui-alignment-preview-chrome-hidden-root-compare-2026-05-17` improves 3 of 6 focused
  preview rows, regresses 0, leaves 3 unchanged, and reduces strict mismatches from 1,026,183 to
  1,026,180 (-3). This is retained as a tiny overlay-stack cleanup, not as dynamic-suite completion.
- Fixed Unity card artwork rendering to use the existing display-texture downsample cache instead of
  direct source-texture quad scaling. This matches Electron's featured-card display path more closely
  and improves all 20 dynamic failing rows in the latest full matrix.
- Updated Unity display-texture downsampling to alpha-weight RGB before quantizing output pixels.
  This follows the browser-style premultiplied-alpha scaling behavior more closely for transparent
  rounded card/artwork edges while keeping Electron unchanged. The retained rounded variant,
  `electron-unity-ui-alignment-premultiplied-display-round-root-compare-2026-05-17`, reduces the
  current 16-row dynamic subset from 2,405,596 to 2,399,935 strict mismatched pixels (-5,661),
  improving 14 rows with 2 small row regressions. The same subset still fails strict 99%, so this is
  a retained renderer-fidelity repair rather than dynamic-suite completion.
- Matched Unity tableau top-card sampling to Electron's `ScaledCardFrame` order: Electron renders
  the standard `Card` at 120x160 and then scales the stack frame down, so Unity now builds the
  tableau top-card display texture at 120x160 before scaling it into the final tableau rect. The
  fixed-Electron comparison
  `electron-unity-ui-alignment-tableau-two-stage-sampling-dynamic-root-compare-2026-05-17` reduces
  the 16-row dynamic subset from 2,411,097 to 2,408,468 strict mismatched pixels (-2,629), with 12
  rows improved, 0 rows regressed, and 4 rows unchanged. The focused `reserve-card` double-viewport
  check also improved both rows by 343 pixels total. This is retained as a Unity-only rendering-order
  correction; the subset still fails strict 99%.
- Matched Unity visible reserved-card sampling to Electron's reserved mini-stack rendering order:
  Electron renders `Card size="featured"` inside `ScaledCardFrame baseSize={FEATURED_CARD_SIZE}`,
  so the card is first displayed at 150x200 and then scaled into the mini-stack slot. Unity now
  builds visible reserved-card display textures at 150x200 before scaling them into the final
  reserved rect. The fixed-Electron comparison
  `electron-unity-ui-alignment-reserved-two-stage-sampling-root-compare-2026-05-17` reduces the
  6-row reserve/P1 reserved subset from 991,982 to 991,411 strict mismatched pixels (-571), with 4
  rows improved, 1 row unchanged, and a 1-pixel regression in one row. A separate isolated
  `reserved-card-preview` fixed-Electron check regresses by 81 pixels total, so this is retained as
  a source-backed normal reserved-card repair with documented preview noise/regression, not as a
  full-suite completion signal.
- Adjusted Unity royal-court panel fill and title offset to follow the same live layout offset as
  the Electron-aligned royal cards. This improves royal, buy, and player-zone rows without changing
  Electron or shared contracts.
- Reduced Unity resource-count badge geometry to match Electron's scaled inventory badge footprint
  more closely. This improves the focused player-zone/resource rows and keeps the larger rejected
  badge variant out of the retained patch.
- Reduced the Unity royal-court glass fill alpha from 0.36 to 0.18 after crop and focused-suite
  evidence showed the royal grid gap was over-tinted compared with Electron. This improves all 20
  dynamic rows in the latest full matrix without changing Electron or shared contracts.
- Replaced Unity empty tableau solid-slot borders with cached dashed rounded-panel textures matching
  Electron's `royal-luxury` empty stack treatment more closely. The latest full matrix shows a net
  reduction of 17,661 strict mismatched pixels and lower targeted player-zone hotspot counts, but it
  is still a partial dynamic-UI repair rather than a parity pass.
- Updated Unity resource-count badges to use the Electron dark badge treatment more closely
  (`bg-slate-900` fill plus `border-slate-600` outline) while keeping the retained badge size. This
  reduces total strict mismatches by another 59,182 pixels in the latest full matrix, with several
  reserve/end-turn/player-zone rows improving, but dynamic parity is still blocked.
- Matched the Unity player-zone buff avatar path to Electron's `rounded-full object-cover` treatment
  by adding circular display-texture masking and enabling readable Unity-side rogue-buff imports.
  Added the Electron readability chip behind Unity privilege-scroll icons. This removes the obvious
  square buff-avatar artifact and reduces the latest full-matrix strict mismatches by another 11,701
  pixels, but several dynamic rows still regress and all dynamic rows remain below 99%.
- Matched Unity player-zone background sampling to Electron's CSS `object-cover` behavior for the
  player-zone surface artwork. The full matrix remains mixed, but the retained nearest-sample
  object-cover version reduces strict mismatches against the identity-chip baseline.
- Added the missing Electron `MarketDeckBack` level/count overlay labels to Unity's deck-reserve
  preview, with preview-specific scaled offsets. The focused deck-preview run improved both audited
  viewports by 17,411 strict pixels versus the object-cover candidate and by 10,020 pixels versus the
  identity-chip baseline; the full dynamic suite still fails.
- Replaced Unity's pure/royal special tableau point summary with the Electron silver point-ribbon
  artwork instead of the old gold rounded badge. The focused player-zone/buy/reserve/end-turn run
  improved 6 of 8 audited rows and reduced total strict mismatches by 22,379 pixels versus
  `electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16`; both buy-card rows
  regressed, so this is retained only as the best measured local repair, not as a completion signal.
- Fixed Unity player-zone resource action targets to follow Electron's resource clickable state in
  replay parity captures instead of showing only the next replay event target. The retained Unity
  ring also uses a thin rose rounded-full treatment matching Electron's `ring-2 ring-rose-500`
  styling rather than the generic yellow hover frame. The focused run reduced 29,230 strict
  mismatched pixels versus the current nearest-sample dynamic control and 18,773 pixels versus the
  earlier yellow action-target candidate. The dynamic 20-row run remained mixed and reduced only
  4,699 pixels net, so this is retained as a confirmed resource-action repair, not a suite pass.
- Added per-scenario replay fixture support to the Electron/Unity parity runner and Unity capture
  entrypoint. The `ui-alignment` suite now includes `p1-reserved-card-display`, sourced from
  `local-pvp-joker-reserved-buy.replay.json`, so P1 reserved-card geometry is no longer hidden by the
  royal extra-turn fixture that only covers P2 reserved cards.
- Added deterministic `local-pvp-multi-reserved.replay.json` coverage and a
  `p1-multi-reserved-card-display` parity scenario, so the P1 three-card reserved mini-stack is now
  checked directly instead of inferred from single-card reserved geometry.
- Fixed Unity P1 reserved-card geometry against direct Electron measurement. Before the fix, the new
  scenario measured Electron `player.reserved.0` at `53.94,884.25,99,132` for 1920x1080 while Unity
  reported `807.05,884.25,99,132`. After the fix, Unity reports `53.95,884.25,99,132`; at 1366x768,
  Unity now reports `38.38,628.8,70.43,93.87` versus Electron `38.36,628.8,70.4,93.87`. The P2
  reserved regression check kept the existing P2 reserved boxes within the 2px gate. The strict P1
  row still fails around 87.5-87.9% because the surrounding dynamic player-zone/card rendering is not
  yet 99% aligned, so this is a confirmed geometry repair, not a dynamic-suite completion signal.
- Matched Unity reserved mini-stack paint order to Electron's DOM `zIndex: i + 1` contract by
  increasing later reserved-card depth and setting `MeshRenderer.sortingOrder = index + 1` for the
  Unity reserved visuals. The fixed-Electron comparison
  `electron-unity-ui-alignment-reserved-stack-sorting-root-compare-2026-05-17` reduces the 8-row
  reserve/reserved-preview subset from 1,267,201 to 1,240,380 strict mismatched pixels (-26,821).
  It improves 7 of 8 rows, including `p1-multi-reserved-card-display` by 10,674 pixels at
  1920x1080 and 5,133 pixels at 1366x768; the only negative movement is a 9-pixel single-card
  1366x768 recapture delta. This is retained as a stack-order repair, not a dynamic-suite pass.
- Fixed Unity replay-audit and replay-bootstrap snapshot normalization for no-buff players so
  `playerBuffs.*.state` matches Electron's inflated `{}` state instead of Unity reporting `null`.
  The focused multi-reserved run now has zero state mismatches in both audited viewports.
- Matched Unity's zero-count player resource badge opacity to Electron's `GemIcon` behavior. In
  Electron, `count === 0` applies `grayscale opacity-50` to the whole gem container, including the
  count badge. Unity previously dimmed only the gem artwork and left the badge fully opaque. The
  focused 14-row dynamic run still fails strict 99%, but total strict mismatches dropped from
  2,202,089 to 2,177,031 pixels, a 25,058-pixel net reduction; 11 of 14 rows improved.
- Added fine-grained player-zone bbox/hotspot coverage and used it to fix two confirmed Unity
  geometry mismatches: fallback avatars now match Electron's measured `58x58` identity-rail box and
  empty tableau slots now use Electron's measured stack size, y-position, and effective inter-stack
  gap. The retained focused dynamic run,
  `electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16`, still has 14/14 strict
  visual failures, but total strict mismatches dropped from 2,177,031 to 2,110,697 pixels, a
  66,334-pixel net reduction, and all 14 audited rows improved. The newly exposed
  `initial-board-render` player avatar/tableau bboxes now pass in both viewports.
- Added fine-grained TopBar bbox/hotspot coverage for score subgroups, crown/point artwork, score
  values, goals, player labels, turn counts, and turn words, so future TopBar drift is no longer
  hidden behind only `topbar.score.*` and `topbar.turn.*` broad regions.
- Added the missing Unity Echo Reservoir memory chip in the player identity rail and exposed the
  matching Electron/Unity semantic target. Focused reserve-card evidence shows the Echo chip local
  crop improved from 1,805 to 1,105 mismatched pixels at 1920x1080 and from 1,137 to 748 at
  1366x768, while the player avatar and `player.current.echoMemory` boxes now align. The reserve-card
  rows still fail strict 99%, so this is retained as an identity-rail repair rather than a suite
  completion signal.
- Added a Unity player-zone label readability glow to mirror Electron's
  `READABILITY_HUD_TEXT_STYLE` label treatment without changing label color, geometry, or Electron.
  The fixed-Electron comparison
  `electron-unity-ui-alignment-player-label-glowonly-root-compare-2026-05-17` reduces the focused
  16-row dynamic subset from 2,452,430 to 2,452,108 strict mismatched pixels (-322), improving 12
  rows and lightly regressing 4 rows. A shadow+glow variant was weaker (-126), while the dark-shadow
  only variant regressed all 16 rows (+133), so the retained Unity change is glow-only. All 16 rows
  still fail the 99% gate.
- Matched Unity's replay return-to-results button color and border weight to Electron's slate
  `bg-slate-800 border-2 border-slate-600` treatment instead of the lighter one-pixel Unity panel.
  The fixed-Electron full focused comparison
  `electron-unity-ui-alignment-replay-return-slate-full-root-compare-2026-05-17` reduces the same
  16-row dynamic subset from 2,414,737 to 2,399,883 strict mismatched pixels (-14,854), improving 8
  rows with 0 regressions and 8 unchanged rows. The subset still fails strict 99%, so this is retained
  as a verified component repair rather than a dynamic-suite pass.
- Matched Unity's disabled replenish/end-turn action to Electron's dark disabled button treatment.
  Electron renders `Replenish (0)` through the disabled `GameActions` branch
  (`bg-slate-900/20`, `border-slate-800/50`, shell-muted text, and `opacity-50`), while Unity was
  using the generic disabled action colors. The fixed-Electron comparison
  `electron-unity-ui-alignment-replenish-disabled-slate-root-compare-2026-05-17` reduces the focused
  end-turn/royal-featured subset from 597,248 to 586,533 strict mismatched pixels (-10,715), with all
  4 rows improved and 0 regressions. The rows still fail strict 99%, so this is a retained local
  `turn.end` repair rather than suite completion.
- Matched Unity replay review control button colors to Electron's `ReplayControls` dark Tailwind
  branch. Electron uses `bg-slate-800`, `border-slate-600`, and `text-slate-200` for enabled controls
  and `bg-slate-900/40`, `border-slate-700`, and `text-slate-400` for disabled controls; Unity was
  using semi-transparent cyan borders, near-black fill, and pure white glyphs. The focused
  fixed-Electron check
  `electron-unity-ui-alignment-replay-control-colors-root-compare-2026-05-17` reduces the 4-row
  initial/resource subset from 498,300 to 485,372 strict mismatched pixels (-12,928), with 4 rows
  improved and 0 regressions. The broader
  `electron-unity-ui-alignment-replay-control-colors-dynamic-root-compare-2026-05-17` reduces the
  16-row dynamic subset from 2,372,391 to 2,346,535 strict mismatched pixels (-25,856), with 8 rows
  improved, 0 regressions, and 8 unchanged rows. The subset still fails strict 99%, so this is a
  retained replay-control fidelity repair rather than dynamic-suite completion.
- Matched Unity player-label visual active state to Electron replay review behavior. Electron passes
  `isActive={turn === player && !ui.isReviewing && !winner}` into `PlayerZone`, so labels are muted
  during replay review even when the underlying state turn is that player. Unity already used
  `visualActive` for replay-review avatar fallback coloring but still colored the label from raw
  `isActive`. The focused fixed-Electron check
  `electron-unity-ui-alignment-replay-label-visualactive-root-compare-2026-05-17` reduces the 10-row
  label-heavy subset from 1,383,230 to 1,383,076 strict mismatched pixels (-154), with 4 rows
  improved and 0 regressions. The broader
  `electron-unity-ui-alignment-replay-control-label-dynamic-root-compare-2026-05-17` reduces the
  16-row dynamic subset from 2,340,871 to 2,340,596 strict mismatched pixels (-275), with 8 rows
  improved, 0 regressions, and 8 unchanged rows. The subset still fails strict 99%, so this is a
  retained replay-review visual-state repair rather than dynamic-suite completion.
- Suppressed Unity's TopBar turn pointer for parity with Electron `GameShell`, which currently passes
  `renderTurnPointer={false}` to `TopBar`. The focused fixed-Electron check
  `electron-unity-ui-alignment-topbar-pointer-off-root-compare-2026-05-17` reduces the 10-row
  TopBar-visible subset from 1,388,725 to 1,388,041 strict mismatched pixels (-684), with 10 rows
  improved and 0 regressions. The broader
  `electron-unity-ui-alignment-topbar-pointer-off-dynamic-root-compare-2026-05-17` reduces the
  16-row focused dynamic subset from 2,365,574 to 2,364,457 strict mismatched pixels (-1,117), with
  16 rows improved and 0 regressions. The subset still fails strict 99%, so this is a retained
  TopBar fidelity repair rather than dynamic-suite completion.
- Matched Unity inactive player-zone label color to Electron dark-mode `text-slate-300` from
  `PlayerZoneIdentityColumn`. The focused dynamic matrix still fails every row, but
  `electron-unity-ui-alignment-player-label-muted-slate300-dynamic-root-compare-2026-05-17` reduces
  the 16-row focused dynamic subset from 2,364,457 to 2,363,752 strict mismatched pixels (-705), with
  9 rows improved, 4 unchanged, and three 1-pixel 1366x768 edge regressions. This is retained as a
  source-backed player-label color correction with documented residual font/antialiasing drift, not
  as dynamic-suite completion.
- Matched Unity market deck rendering to Electron's outer deck box vs content box. Electron
  `MarketLevelRow` applies `border-2 border-transparent` to the `data-market-deck` wrapper while
  `MarketDeckBack` artwork, overlay, and chip labels render inside that content box. Unity now keeps
  the full outer rectangle as the semantic/click target but insets the artwork, gradient, and labels
  by the scaled 2px border. The fixed-Electron focused market check
  `electron-unity-ui-alignment-market-deck-borderbox-root-compare-2026-05-17` improves 4 rows and
  reduces strict mismatches by 5,917 pixels with 0 regressions. The broader 16-row dynamic comparison
  `electron-unity-ui-alignment-market-deck-borderbox-dynamic-root-compare-2026-05-17` reduces strict
  mismatches from 2,363,752 to 2,339,405 (-24,347), with 16 rows improved and 0 regressions. The
  subset still fails strict 99%, so this is a retained market-deck fidelity repair rather than
  dynamic-suite completion.
- Applied Electron's readability HUD text-shadow treatment to Unity TopBar score and turn labels.
  Electron `TopBar` uses `READABILITY_HUD_TEXT_STYLE` when readability treatment is enabled, while
  Unity's TopBar score/turn text still used plain text after the player-zone label readability fix.
  The focused 10-row fixed-Electron check
  `electron-unity-ui-alignment-topbar-readability-root-compare-2026-05-17` reduces strict mismatches
  from 1,372,407 to 1,371,813 (-594), with 10 rows improved and 0 regressions. The broader 16-row
  dynamic comparison
  `electron-unity-ui-alignment-topbar-readability-dynamic-root-compare-2026-05-17` reduces strict
  mismatches from 2,339,405 to 2,338,355 (-1,050), with 16 rows improved and 0 regressions. The
  subset still fails strict 99%, so this is retained as a source-backed TopBar micro-repair, not as
  dynamic-suite completion.
- Matched Unity's TopBar inner score layout to Electron's measured DOM boxes. Electron applies
  `scale-105` to the entire active score group, including crown/points icons and text; Unity
  previously scaled only the score group panel/target while leaving the inner artwork and labels at
  unscaled coordinates. Unity now scales the score content around the score-group center, uses the
  measured normal crown/points group and icon boxes, and moves the turn-side label/count/word centers
  to the Electron DOM positions. The focused fixed-Electron 16-row dynamic comparison
  `electron-unity-ui-alignment-topbar-inner-layout-dynamic-root-compare-2026-05-17` reduces strict
  mismatches from 2,312,723 to 2,286,056 (-26,667), with 16 rows improved and 0 regressions. The
  subset still fails strict 99%, so this is retained as a confirmed TopBar inner-layout repair.
- Matched Unity's no-buff fallback avatar vertical layout to Electron's compact identity-column
  layout. Electron's fallback avatar is smaller than a buff avatar, so the centered flex group moves
  the avatar down and the player label up. Unity already used the smaller 36px fallback avatar but
  kept the buff-avatar vertical offsets. The retained Unity-only fix uses separate fallback offsets:
  in `p1-multi-reserved-card-display`, avatar and label semantic boxes now match Electron vertically
  in both audited viewports. The 16-row fixed-Electron comparison
  `electron-unity-ui-alignment-fallback-avatar-compact-dynamic-root-compare-2026-05-17` reduces
  strict mismatches by 1,998 pixels, with 2 rows improved, 0 regressed, and 14 unchanged. The
  dynamic suite still fails strict 99%, so this closes a compact-avatar geometry defect only.
- Matched Unity's identity-column divider color toward Electron's dark-mode `border-slate-700`
  treatment instead of the earlier brighter blue-gray divider. This is an identity-rail-only Unity
  repair: Electron `PlayerZoneIdentityColumn` owns the divider style, shared contracts are unchanged,
  and Unity keeps the existing measured column geometry. The focused player-zone fixed-Electron
  comparison `electron-unity-ui-alignment-identity-divider-slate700-root-compare-2026-05-18` reduces
  strict mismatches by 2,610 pixels with 10 improved rows and 0 regressions. The broader affected
  comparison `electron-unity-ui-alignment-identity-divider-slate700-affected-root-compare-2026-05-18`
  reduces strict mismatches by 3,077 pixels with 14 improved rows; the only regressions are
  preview-backdrop noise-sized deltas of 12 to 83 pixels, while settings and dynamic rows improve.
  A full retained-root run
  `electron-unity-ui-alignment-current-retained-full-root-compare-2026-05-18` reduces the 44-row
  total from 3,001,138 to 2,996,541 (-4,597), with 20 rows improved, 20 unchanged, and only four
  preview rows regressed by 14 to 82 pixels. Rulebook remains 18/18 equivalent in
  `electron-unity-ui-alignment-current-retained-full-2026-05-18`. This remains a
  component-fidelity repair, not a dynamic-suite pass.
- Shifted Unity royal card rectangles 1 design pixel left after fixed-root crop analysis showed the
  retained royal-card captures aligned best when Unity was sampled at `dx=+1` for the largest royal
  card hotspots. This is a Unity-only royal/card geometry repair; `RoyalCourt.tsx`,
  shared contracts, and desktop parity state are unchanged. The focused comparison
  `electron-unity-ui-alignment-royal-card-xminus1-root-compare-2026-05-18` improves all 12 audited
  royal/player-zone rows with 0 regressions and reduces strict mismatches by 3,124 pixels. The full
  fixed-Electron comparison `electron-unity-ui-alignment-royal-card-xminus1-full-root-compare-2026-05-18`
  reduces the 44-row total by 5,103 pixels, with 21 improved rows, 20 unchanged rows, and only three
  noise-sized regressions: `chrome-settings-open@1920x1080` +40, `reserved-card-preview@1920x1080`
  +106, and `reserved-card-preview@1366x768` +16. Rulebook remains 18/18 equivalent in
  `electron-unity-ui-alignment-royal-card-xminus1-full-2026-05-18`; the suite still has 24 failing
  rows, so this is retained as a targeted royal/card alignment repair rather than final parity
  closure.
- Changed Unity's player-zone object-cover surface sampler from nearest-source-pixel rounding to a
  browser-like bilinear sample after source review showed Electron renders `PlayerZone` surface
  artwork through an `<img className="object-cover">` path while Unity's
  `GetObjectCoverDisplayTexture` rounded each target pixel to a single source pixel. This is a
  Unity-only player-zone compositing repair; `PlayerZone.tsx`, shared contracts, and desktop parity
  state are unchanged. The focused fixed-Electron comparison
  `electron-unity-ui-alignment-playerzone-bilinear-cover-root-compare-2026-05-18` reduced strict
  mismatches by 18,271 pixels across 16 player-zone/preview rows, with 14 improved rows and 2 small
  1920x1080 preview regressions. The full fixed-Electron comparison
  `electron-unity-ui-alignment-playerzone-bilinear-cover-full-root-compare-2026-05-18` reduced the
  44-row total by 29,459 pixels, with 22 improved rows, 20 unchanged rows, and only two preview
  1920x1080 regressions (`market-card-preview` +2,575 and `market-deck-reserve-preview` +1,535).
  Rulebook remains 18/18 equivalent in
  `electron-unity-ui-alignment-playerzone-bilinear-cover-full-2026-05-18`; the suite still has 24
  failing rows, so this is retained as a player-zone background-sampling improvement, not final
  parity closure.
- Matched Unity runtime-card alpha handling to Electron's runtime artwork placeholder layer.
  Electron `CardFacePattern` renders a full-card `bg-slate-800` placeholder behind runtime artwork;
  Unity previously downsampled transparent card edges without that matte. Unity now composites
  runtime card artwork over `#1e293b` before display-texture averaging. The 16-row fixed-Electron
  comparison `electron-unity-ui-alignment-runtime-card-placeholder-dynamic-root-compare-2026-05-17`
  reduces strict mismatches from 2,320,471 to 2,319,663 (-808), with 14 rows improved and two small
  1366x768 regressions (+18 and +34). The focused dynamic subset still fails strict 99%.
- Matched Unity no-buff fallback avatar icon artwork to Electron's lucide fallback icons. Electron
  uses `Shield size={40}` for P1 and `Swords size={40}` for P2; Unity previously rendered text glyphs,
  which depended on font fallback and did not match the icon stroke silhouette. Unity now draws
  line-based Shield/Swords icons inside the existing fallback avatar box. The focused P1
  multi-reserved comparison reduces strict mismatches by 34 pixels with no row regressions, and the
  16-row dynamic comparison also improves 2 rows, regresses 0, and leaves 14 unchanged. This is a
  retained foreground-fidelity repair only; dynamic UI remains far below 99%.
- Completed the Electron placeholder-matte repair by making Unity's matted display textures opaque
  inside the rounded card shell. Electron renders runtime artwork over an opaque rounded card shell:
  `CardFacePattern` supplies the `bg-slate-800` placeholder and `Card` clips it with the card's
  rounded root. Unity's first matte pass matched the placeholder RGB but preserved the PNG alpha, so
  transparent card pixels still blended with the player-zone background instead of the Electron shell.
  Unity now derives the matte branch's alpha from the same 8px-base card-radius formula scaled to the
  display texture. The 16-row fixed-Electron comparison
  `electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-root-compare-2026-05-17` reduces strict
  mismatches from 2,297,109 to 2,290,951 (-6,158), with 16 rows improved and 0 regressions. The
  dynamic subset still fails strict 99%, so this is retained as a card-compositing repair, not a
  suite pass.
- Aligned Unity's matte shell radius rounding with Electron's JavaScript card metric rounding.
  Electron `Card` uses `scaleCardMetric(8, displayScale)`, which follows `Math.round`; at the 150px
  featured-card display size the scaled 8px radius is 12.5 and rounds to 13. Unity `Mathf.Round`
  rounded the same midpoint to 12, so the matted runtime-card alpha edge was one CSS pixel tighter
  than Electron on featured cards. Unity now uses a CSS-style half-up helper for this matte radius
  only. The full fixed-Electron comparison
  `electron-unity-ui-alignment-card-radius-css-round-full-root-compare-2026-05-17` reduces 44-row
  strict mismatches from 3,510,352 to 3,510,250 (-102), with 8 rows improved, 1 row regressed by 9
  pixels (`reserve-card` at 1366x768), and 35 rows unchanged. Static/main-menu/Rulebook rows remain
  unchanged; preview rows improve by 92 pixels with no focused preview regressions. This is retained
  as a small source-backed card-edge repair, not as evidence that dynamic UI has reached 99%.
- Enabled readability on the actual P1 reserved-card fixture textures that were still bypassing
  Unity's retained `GetDisplayTexture` downsample path. Those cards previously threw from
  `GetPixels32()` and returned the raw source texture, so the reserved mini-stack used Unity GPU
  scaling rather than the Electron-matched display-sampling path. The fixed-Electron dynamic
  comparison reduces strict mismatches by 69,058 pixels with 4 improved rows and 0 regressions; all
  dynamic rows still fail strict 99%.
- Reworked Unity tableau summary artwork to use the Electron bonus-badge and point-ribbon base
  sizes, with point ribbons centered on the measured top-card position. The focused 14-row dynamic
  run `electron-unity-ui-alignment-tableau-summary-topcardpoint-dynamic-2026-05-16` still fails all
  rows, but reduces total strict mismatches by 2,137 pixels versus
  `electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16` and cuts the named
  tableau bbox failures sharply: for example, reserve-card 1920x1080 drops from 16 bad tableau boxes
  to 7, and P1 reserved-card display 1920x1080 drops from 29 to 15. The result is mixed across
  scenarios and remains far below 99%.
- Matched Unity privilege scroll rendering to Electron's actual identity-column treatment. Electron
  renders a small lucide scroll icon on a rounded readability chip, not Unity's prior wide gold
  shell with side caps. The `privilege-icononly` 14-row dynamic run still fails all rows, but reduces
  strict mismatches from 2,108,560 to 2,089,908 pixels versus the top-card-point baseline, a
  18,652-pixel net reduction across the same dynamic subset.
- Matched Unity tableau stack semantic geometry to Electron's CSS `absolute inset-0` behavior:
  stack targets now use the Electron wrapper rect, while top-card and point-ribbon semantic targets
  use the shifted content rect exposed by Electron DOM measurement. The focused reserve/P1 reserved
  run `electron-unity-ui-alignment-tableau-css-target-candidate-2026-05-16` clears all named tableau
  bbox blockers in 4/4 rows and reduces that focused total from 681,831 to 681,263 pixels. The
  broader 14-row `electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16` run still fails
  all rows; its strict total is mixed versus `privilege-icononly` (2,089,908 to 2,104,405), but the
  dynamic subset now reports `boundingBoxes.ok = true` for every audited row.
- Added Unity's missing dark-theme black-gem contrast overlay to mirror Electron `GemArtwork` /
  `GemContrastOverlay` behavior. The retained light-strength candidate,
  `electron-unity-ui-alignment-black-gem-contrast-light-candidate-2026-05-16`, still fails all 12
  focused dynamic rows, but reduces strict mismatches from 1,855,962 to 1,846,383 pixels versus
  `electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16`, a 9,579-pixel net reduction.
  It improves 9 of 12 audited rows and is retained as a component-fidelity repair, not a 99%
  dynamic-suite completion signal.
- Matched Unity preview action buttons to Electron `GLOBAL_ACTION_BUTTON_CLASS` rounded/border
  treatment in CSS-pixel terms. Electron uses Tailwind `rounded` and a 1px border, while Unity was
  using a 14px logical radius that rendered as a pill-like button. The focused preview run
  `electron-unity-ui-alignment-preview-button-csspx-candidate-2026-05-16` still fails all 6 preview
  rows; a fixed-Electron recompare against
  `electron-unity-ui-alignment-black-gem-contrast-broader-dynamic-2026-05-16` shows this is only a
  small local repair (1,154,720 to 1,154,678 strict pixels, 42-pixel net reduction), not a material
  preview-overlay solution.
- Matched Unity's disabled preview buy action treatment more closely to Electron
  `GLOBAL_ACTION_BUTTON_CLASS`: the disabled reason now follows Electron's `text-sm font-semibold
text-amber-100/80`, and the disabled button uses the Electron `bg-slate-700`,
  `border-slate-500/50`, and `text-slate-300` colors. The fixed-Electron root comparison
  `electron-unity-ui-alignment-preview-disabled-action-root-compare-2026-05-16` reduces the 6-row
  preview subset from 1,088,799 to 1,084,315 strict mismatched pixels (-4,484), improving both
  `market-card-preview` rows and leaving deck/reserved preview rows unchanged. This is retained as a
  local preview-action repair, not a preview-overlay completion signal.
- Matched Unity preview title color and tracking to Electron's `text-amber-100` /
  `tracking-[0.15em]` title treatment. The focused preview run
  `electron-unity-ui-alignment-preview-title-color-spacing-candidate-2026-05-16` still fails all 6
  preview rows, but fixed-Electron comparison against
  `electron-unity-ui-alignment-black-gem-contrast-broader-dynamic-2026-05-16` improves all 6 rows and
  reduces strict mismatches from 1,154,720 to 1,147,776, a 6,944-pixel net reduction. This is retained
  as a local title fidelity repair, not as a preview-overlay completion signal.
- Replaced Unity's preview close glyph from a TextMeshPro `×` character with a 22px double-stroke
  icon matching Electron's lucide `X size={22}` treatment. The 6-row fixed-Electron preview
  comparison in `electron-unity-ui-alignment-preview-close-lucide-fixed-electron-compare-2026-05-16`
  reduced strict mismatches by 68 pixels with no row regressions. This is retained as a tiny
  foreground-fidelity repair, not as a material preview-backdrop solution.
- Tightened Unity's preview-only market deck label chip width and level-label font size against the
  Electron `MarketDeckBack` artwork treatment. The focused deck-preview run
  `electron-unity-ui-alignment-preview-deck-label-chip-candidate-2026-05-16` still fails both audited
  rows, but fixed-Electron comparison against the retained preview-title candidate improves both
  rows and reduces strict mismatches from 441,013 to 440,659, a 354-pixel net reduction. This is a
  retained local deck-label repair, not a preview-overlay completion signal.
- The combined retained preview run,
  `electron-unity-ui-alignment-preview-retained-current-2026-05-16`, still fails all 6 preview rows,
  but fixed-Electron comparison against
  `electron-unity-ui-alignment-black-gem-contrast-broader-dynamic-2026-05-16` improves all 6 rows and
  reduces strict mismatches from 1,154,720 to 1,147,422, a 7,298-pixel net reduction.
- Added Unity's missing single-card preview wrapper box-shadow to match Electron
  `CardPreviewOverlay`'s `rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]` treatment. Unity now
  renders a cached blurred rounded-rect shadow behind single preview cards instead of attempting an
  image-alpha drop-shadow. The fixed-Electron root comparison
  `electron-unity-ui-alignment-preview-card-boxshadow-root-compare-2026-05-16` reduces the 6-row
  preview subset from 1,085,899 to 1,058,633 strict mismatched pixels (-27,266), improving all four
  single-card preview rows and leaving both deck-preview rows unchanged. The preview subset still
  fails strict 99%, so this is a retained component-fidelity repair, not preview completion.
- Added the same missing Electron wrapper box-shadow behind Unity's deck-preview card back. The
  fixed-Electron root comparison
  `electron-unity-ui-alignment-preview-deck-boxshadow-root-compare-2026-05-16` reduces the 6-row
  preview subset from 1,083,529 to 1,072,298 strict mismatched pixels (-11,231), improving both
  deck-preview rows and leaving the four single-card preview rows unchanged. The preview subset
  still fails strict 99%, so this is retained as a deck-preview fidelity repair rather than a
  preview-overlay completion signal.
- Added Unity's missing dark `MarketDeckBack` artwork gradient overlay from the Electron component
  (`rgba(2,6,23,0.04)` at the top through `0.08` to `0.16` at the bottom). A focused deck/back run
  improved all 4 audited rows and reduced strict mismatches from 705,129 to 676,567 pixels. The
  broader chunked fixed-Electron dynamic comparison then improved all 22 previously audited dynamic
  rows with zero regressions, reducing strict mismatches from 3,708,312 to 3,535,999 pixels
  (-172,313). The latest full strict suite
  `electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16` still fails 24 dynamic
  rows, so this is retained as a component-fidelity repair rather than a completion signal.
- Matched Unity empty-tableau color-dot sizing to Electron's `PlayerZoneTableauStack` treatment:
  Electron renders a `w-4 h-4` dot inside `ScaledCardFrame`, so Unity now derives the dot from
  `16px * stackScale` instead of `rect.width * 0.16`. A fixed-Electron comparison of the 16-row
  dynamic subset reduced strict mismatches from 2,438,699 to 2,438,357 pixels (-342), with 12 rows
  improved and 4 rows regressing only 1-3 pixels. The focused parity run still fails all 16 rows, so
  this is retained as a source-backed micro-repair, not a dynamic-suite completion signal.
- Matched Unity board-gem rendering to Electron's `GemArtwork` board variant drop-shadow treatment.
  Electron applies a `drop-shadow(0 10px 16px rgba(0,0,0,0.45))` to board gems while Unity
  previously rendered the artwork without the shadow layer. The retained Unity-side alpha-shadow
  texture uses the same 10px Y offset and 16px blur geometry with tuned 0.35 opacity. The 24-row
  fixed-Electron dynamic comparison reduced strict mismatches from 3,811,833 to 3,794,256 pixels
  (-17,577), with 21 rows improved and three 1366x768 rows regressing only 5-8 pixels. The latest
  dynamic rows still fail strict 99%, so this is retained as a component-fidelity repair, not a
  suite completion signal.
- Added Unity's missing top-card drop-shadow path for non-empty player tableau stacks, using the
  first dark Electron `PlayerZoneTableauStack` shadow component
  `drop-shadow(0 14px 26px rgba(28,25,23,0.26))`. The 8-row fixed-Electron comparison in
  `electron-unity-ui-alignment-tableau-topcard-shadow-fixed-electron-compare-2026-05-16` reduced
  strict mismatches from 1,285,162 to 1,285,128 pixels (-34), with three rows improved, one
  unchanged, and four rows regressing by only one pixel each. This is retained only as a
  source-backed micro-repair; it is not material progress toward the 99% dynamic gate.
- Hardened the strict bbox runner so individual resource gems are no longer filtered out of default
  geometry comparison. The focused
  `electron-unity-ui-alignment-resource-gem-bbox-hardened-2026-05-16` run still fails all 4 rows on
  strict pixel/visual diff, but it now compares 14 player resource gem boxes per row with zero bad
  gem bboxes. This confirms the current resource-row gap is no longer hidden at geometry level and
  remains a pixel/rendering mismatch.
- Matched Unity's no-buff player fallback avatar footprint to Electron's measured fallback treatment.
  Electron `PlayerZoneIdentityColumn` renders buff avatars through the 58px `PlayerBuffIcon` path,
  while no-buff fallback icons collapse to the smaller rounded fallback box in the multi-reserved
  rail. Unity now keeps buff avatars at 58px and uses a 36px fallback avatar. The focused candidate
  still fails all 10 audited dynamic rows, but a fixed-Electron comparison reduces strict mismatches
  by 2,247 pixels overall with only two 2-pixel noise-level regressions, so this is retained as a
  targeted identity-rail repair rather than a suite completion signal.
- Increased Unity market deck-back label sizing toward Electron's `MarketDeckBack` image-artwork
  labels (`text-[10px]` level chip and `text-[12px]` count chip). The 14-row focused run still fails
  strict 99%, but fixed-Electron comparison reduces strict mismatches by 660 pixels overall, improves
  10 of 14 rows, and limits the four 1366x768 regressions to 3-10 pixels. This is retained as a
  deck-label micro-repair, not a dynamic-suite completion signal.
- Added explicit Electron and Unity semantic boxes for the player identity labels. Electron now
  exports `[data-player-zone-label]` as `player.current.label` / `player.opponent.label`, and Unity
  exposes matching transparent `visibleTargets`. The initial-board control run proves the new label
  boxes pass the 2px geometry gate: at 1920x1080 both labels match exactly, and at 1366x768 the only
  deltas are 0.32px and 0.34px on x. A visual `characterSpacing = 16f` experiment was rejected
  separately because it regressed the 16-row fixed-Electron focused comparison by 331 strict pixels;
  the retained change is only the source-backed control-suite coverage and transparent target
  geometry. The post-revert fixed-Electron comparison is effectively neutral for visible pixels
  (+13 strict pixels across 16 rows, with 11 unchanged rows), while all dynamic rows remain below the
  99% gate.

## Latest Evidence

Full strict run:

```powershell
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --out artifacts/electron-unity-ui-alignment-final-current-2026-05-15
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --out artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-royal-resource-2026-05-15
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-royal-alpha018-2026-05-16
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-resource-badge-border-2026-05-16
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-identity-chip-2026-05-16
node tools/migration/electron-unity-parity-runner.mjs --suite ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16
pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16
pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17
```

Hotspot run:

```powershell
pnpm parity:ui-hotspots -- artifacts/electron-unity-ui-alignment-final-current-2026-05-15 -OutJson artifacts/electron-unity-ui-alignment-final-current-2026-05-15/hotspot-report.json -OutMarkdown artifacts/electron-unity-ui-alignment-final-current-2026-05-15/hotspot-report.md
pnpm parity:ui-hotspots -- artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15 -OutJson artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15/hotspot-report.json -OutMarkdown artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15/hotspot-report.md
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-royal-resource-2026-05-15 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-royal-alpha018-2026-05-16 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-resource-badge-border-2026-05-16 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-identity-chip-2026-05-16 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16 -Top 8
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17 -Top 8 -CropRoot hotspot-crops
```

Focused retained repair run:

```powershell
pnpm parity:ui-alignment --scenarios "player-zone-resource-score,end-turn,buy-card,reserve-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "player-zone-resource-score,end-turn,buy-card,reserve-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-resource-action-rose-ring-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,player-zone-resource-score,end-turn,buy-card,reserve-card,royal-featured-card-display,market-card-preview,market-deck-reserve-preview,reserved-card-preview,chrome-settings-open" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display,player-zone-resource-score,buy-card,end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-black-gem-contrast-light-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-black-gem-contrast-light-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-button-csspx-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-disabled-reason-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-disabled-button-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-preview-disabled-button-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-title-color-spacing-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-preview-title-color-spacing-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "market-deck-reserve-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-deck-label-chip-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-preview-deck-label-chip-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-retained-current-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-preview-retained-current-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-overlay-alpha001-current-base-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-overlay-alpha005-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-close-lucide-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-close-slate-fill-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,market-deck-reserve-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-back-gradient-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-deck-back-gradient-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "initial-board-render,chrome-settings-open,buy-card,reserve-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-a-2026-05-16
pnpm parity:ui-alignment --scenarios "p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-b-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-c-preview-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,chrome-settings-open,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-royal-glass-slate028-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-empty-dot-size-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "reserve-card,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-resource-gem-bbox-hardened-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,chrome-settings-open" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-board-gem-shadow-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,chrome-settings-open" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-board-gem-shadow035-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,chrome-settings-open,market-card-preview,market-deck-reserve-preview,buy-card,reserve-card,reserved-card-preview,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-board-gem-shadow035-dynamic-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-board-gem-shadow035-dynamic-2026-05-16 -Top 8 -CropRoot hotspot-crops
```

P1 reserved coverage and current-suite run:

```powershell
pnpm parity:electron-unity --scenario p1-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-reserved-pre-fix-2026-05-16
pnpm parity:electron-unity --scenario p1-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-reserved-fix-2026-05-16
pnpm parity:electron-unity --suite ui-alignment --scenario p1-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-reserved-strict-2026-05-16
pnpm parity:electron-unity --suite ui-alignment --scenario 'reserve-card,reserved-card-preview' --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-regression-check-2026-05-16
pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16 -Top 8 -CropRoot hotspot-crops
```

Focused retained dynamic UI repair run:

```powershell
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-bonuscolor-tableau-dynamic-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-multi-reserved-coverage-2026-05-16
pnpm parity:ui-alignment --scenarios p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-multi-reserved-statefix-2026-05-16
pnpm parity:ui-alignment --scenarios p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-p1-multi-reserved-bootstrap-statefix-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-current-after-state-normalization-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios initial-board-render --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-semantic-granularity-initial-2026-05-16
pnpm parity:ui-alignment --scenarios initial-board-render --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-avatar-geometry-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16 -Top 10 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios reserve-card --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-echo-memory-csschip-rerun-2026-05-16
pnpm parity:ui-alignment --scenarios reserve-card --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-summary-topcardpoint-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-summary-topcardpoint-dynamic-2026-05-16
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display,player-zone-resource-score,buy-card,end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-privilege-icononly-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-privilege-icononly-dynamic-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-privilege-icononly-dynamic-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-css-target-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios initial-board-render --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-board-frame-native-sampling-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios initial-board-render --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-board-gold-layout-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-royal-card-geometry-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display,player-zone-resource-score,buy-card,end-turn" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-resource-icon-inset-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display,player-zone-resource-score,buy-card,end-turn" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-resource-icon-inset02-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-preview-title-size-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "p1-multi-reserved-card-display,p1-reserved-card-display,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-z-order-candidate-2026-05-16
pnpm parity:ui-alignment --scenarios "p1-reserved-card-display,p1-multi-reserved-card-display,reserve-card,reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-stack-sorting-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16 --new artifacts/electron-unity-ui-alignment-reserved-stack-sorting-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16 --scenarios reserve-card,reserved-card-preview,p1-reserved-card-display,p1-multi-reserved-card-display --viewports 1920x1080,1366x768 --out artifacts/electron-unity-ui-alignment-reserved-stack-sorting-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-reserved-stack-sorting-candidate-2026-05-17 -Top 8 -CropRoot hotspot-crops
pnpm parity:ui-alignment --scenarios "initial-board-render,p1-reserved-card-display,p1-multi-reserved-card-display,royal-featured-card-display,player-zone-resource-score,market-card-preview,market-deck-reserve-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-deck-label-font-focused-2026-05-16
pnpm parity:ui-alignment --scenarios "initial-board-render" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-player-label-control-initial-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-player-label-control-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17 --new artifacts/electron-unity-ui-alignment-player-label-control-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17 --scenarios initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score --viewports 1920x1080,1366x768 --out artifacts/electron-unity-ui-alignment-player-label-control-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 -Scenarios "initial-board-render" -Viewports "1920x1080" -Top 2 -GridColumns 12 -GridRows 8 -OutJson artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17/hotspot-report-crop-smoke-artifactpath.json -OutMarkdown artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17/hotspot-report-crop-smoke-artifactpath.md -CropRoot artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17/hotspot-crops-artifactpath-smoke
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 -Scenarios "initial-board-render" -Viewports "1920x1080" -Top 2 -GridColumns 12 -GridRows 8 -OutJson artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17/hotspot-report-crop-smoke-relative.json -OutMarkdown artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17/hotspot-report-crop-smoke-relative.md -CropRoot hotspot-crops-relative-smoke
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -GridColumns 12 -GridRows 8 -OutJson artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17/hotspot-report-current.json -OutMarkdown artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17/hotspot-report-current.md
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-return-slate-full-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 --new artifacts/electron-unity-ui-alignment-replay-return-slate-full-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 --scenarios initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score --viewports 1920x1080,1366x768 --out artifacts/electron-unity-ui-alignment-replay-return-slate-full-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-display-texture-point-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 --new artifacts/electron-unity-ui-alignment-display-texture-point-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-player-label-glowonly-2026-05-17 --scenarios initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score --viewports 1920x1080,1366x768 --out artifacts/electron-unity-ui-alignment-display-texture-point-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replay-return-slate-full-2026-05-17 --new artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-return-slate-full-2026-05-17 --scenarios initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score --viewports 1920x1080,1366x768 --out artifacts/electron-unity-ui-alignment-premultiplied-display-round-root-compare-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-player-label-outline-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17 --scenarios initial-board-render,buy-card,reserve-card,p1-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score,chrome-settings-open --viewports 1920x1080,1366x768 --common-only --out artifacts/electron-unity-ui-alignment-player-label-outline-root-compare-common-2026-05-17
pnpm parity:ui-alignment --scenarios "reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-tableau-two-stage-sampling-dynamic-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-tableau-two-stage-sampling-dynamic-candidate-2026-05-17 --scenarios "reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-candidate-2026-05-17 -Scenarios "reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-candidate-2026-05-17/hotspot-report-reserved.json -OutMarkdown artifacts/electron-unity-ui-alignment-reserved-two-stage-sampling-candidate-2026-05-17/hotspot-report-reserved.md -CropRoot hotspot-crops-reserved
pnpm parity:ui-alignment --scenarios "reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-baseline-2026-05-17
pnpm parity:ui-alignment --scenarios "reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-baseline-2026-05-17 --new artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-baseline-2026-05-17 --scenarios "reserved-card-preview" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-two-stage-preview-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replenish-slate-baseline-2026-05-17
pnpm parity:ui-alignment --scenarios "end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replenish-slate-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replenish-slate-baseline-2026-05-17 --new artifacts/electron-unity-ui-alignment-replenish-slate-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replenish-slate-baseline-2026-05-17 --scenarios "end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replenish-slate-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replenish-disabled-slate-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replenish-slate-baseline-2026-05-17 --new artifacts/electron-unity-ui-alignment-replenish-disabled-slate-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replenish-slate-baseline-2026-05-17 --scenarios "end-turn,royal-featured-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replenish-disabled-slate-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-replenish-disabled-slate-candidate-2026-05-17 -Scenarios "end-turn,royal-featured-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-replenish-disabled-slate-candidate-2026-05-17/hotspot-report-replenish.json -OutMarkdown artifacts/electron-unity-ui-alignment-replenish-disabled-slate-candidate-2026-05-17/hotspot-report-replenish.md -CropRoot hotspot-crops-replenish
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-tableau-two-stage-sampling-dynamic-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-tableau-two-stage-sampling-dynamic-candidate-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-colors-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-replay-control-colors-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 --scenarios "initial-board-render,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-colors-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-reserved-replenish-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-label-visualactive-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-replay-label-visualactive-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-label-visualactive-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-colors-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-pointer-off-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-pointer-off-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-pointer-off-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-borderbox-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-market-deck-borderbox-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-borderbox-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-shadow-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-market-deck-shadow-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-market-deck-shadow-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-readability-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-readability-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-readability-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-replay-control-label-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenario initial-board-render --viewports "1920x1080,1366x768" --skip-unity --out artifacts/electron-unity-ui-alignment-topbar-subtargets-electron-only-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-inner-layout-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-inner-layout-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-inner-layout-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenario p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-compact-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-fallback-avatar-compact-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 --scenarios "p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-compact-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 -Scenarios "p1-multi-reserved-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17/hotspot-report-p1-multi.json -OutMarkdown artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17/hotspot-report-p1-multi.md -CropRoot hotspot-crops-p1-multi
pnpm parity:ui-alignment --scenario p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-card-placeholder-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-runtime-card-placeholder-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --scenarios "p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-card-placeholder-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
pnpm parity:ui-alignment --scenario p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-runtime-card-placeholder-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-runtime-card-placeholder-candidate-2026-05-17 --scenarios "p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-icon-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-root-compare-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --new artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-runtime-placeholder-avatar-icon-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17 -Scenarios "p1-multi-reserved-card-display" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17/hotspot-report-p1-multi.json -OutMarkdown artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17/hotspot-report-p1-multi.md -CropRoot hotspot-crops-p1-multi
pnpm parity:ui-alignment --scenario p1-multi-reserved-card-display --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17 --scenarios "p1-multi-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-root-compare-2026-05-17
pnpm parity:ui-alignment --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-candidate-2026-05-17 --new artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17 --electron-root artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-candidate-2026-05-17 --scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-root-compare-2026-05-17
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17 -Scenarios "initial-board-render,buy-card,reserve-card,p1-reserved-card-display,p1-multi-reserved-card-display,end-turn,royal-featured-card-display,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8 -OutJson artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17/hotspot-report-dynamic.json -OutMarkdown artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md -CropRoot hotspot-crops-dynamic
```

Artifacts:

- `artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-card-displaytexture-2026-05-15/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-royal-resource-2026-05-15/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-royal-resource-2026-05-15/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-royal-resource-2026-05-15/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-royal-alpha018-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-royal-alpha018-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-royal-alpha018-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-resource-badge-border-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-resource-badge-border-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-resource-badge-border-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-identity-chip-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-identity-chip-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-identity-chip-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-final-deck-label-objectcover-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-pure-royal-ribbon-candidate-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-current-nearest-dynamic-control-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-action-targets-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-action-rose-ring-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-resource-action-rose-ring-dynamic-candidate-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-p1-reserved-pre-fix-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-reserved-fix-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-reserved-strict-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-reserved-regression-check-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-p1-reserved-suite-current-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-candidate-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-candidate-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-a-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-b-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-dynamic-c-preview-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-chunked-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-board-gem-shadow035-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-board-gem-shadow035-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-board-gem-shadow035-dynamic-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-board-gem-shadow035-dynamic-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-empty-dot-size-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-empty-dot-size-candidate-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-empty-dot-size-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-resource-gem-bbox-hardened-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-gem-bbox-hardened-2026-05-16/runner-summary.json`
- `artifacts/electron-unity-ui-alignment-runtime-bonuscolor-tableau-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-p1-multi-reserved-coverage-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-multi-reserved-statefix-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-p1-multi-reserved-bootstrap-statefix-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-current-after-state-normalization-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-echo-memory-csschip-rerun-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-topcardpoint-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-topcardpoint-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-privilege-icononly-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-privilege-icononly-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-privilege-icononly-dynamic-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-privilege-icononly-dynamic-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-tableau-css-target-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16/hotspot-crops/`
- `artifacts/electron-unity-ui-alignment-board-frame-native-sampling-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-board-gold-layout-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-royal-card-geometry-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-icon-inset-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-resource-icon-inset02-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-midpoint-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-tableau-summary-point075-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-preview-title-size-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-preview-title-size-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-preview-overlay-alpha005-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-preview-close-lucide-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-preview-close-slate-fill-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-reserved-z-order-candidate-2026-05-16/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-reserved-z-order-fixed-electron-compare-2026-05-16/summary.json`
- `artifacts/electron-unity-ui-alignment-reserved-stack-sorting-candidate-2026-05-17/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-reserved-stack-sorting-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17/hotspot-report.md`
- `artifacts/electron-unity-ui-alignment-current-after-reserved-sorting-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-player-label-control-initial-2026-05-17/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-player-label-control-2026-05-17/parity-matrix.md`
- `artifacts/electron-unity-ui-alignment-player-label-control-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-pointer-off-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-pointer-off-dynamic-current-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-player-label-muted-slate300-dynamic-current-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-market-deck-borderbox-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-market-deck-borderbox-dynamic-current-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-market-deck-shadow-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-readability-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-readability-dynamic-current-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-topbar-inner-layout-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-topbar-inner-layout-dynamic-current-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-compact-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-compact-dynamic-current-2026-05-17/hotspot-report-p1-multi.md`
- `artifacts/electron-unity-ui-alignment-runtime-card-placeholder-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-runtime-card-placeholder-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-icon-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-icon-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-runtime-placeholder-avatar-icon-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-fallback-avatar-icon-candidate-2026-05-17/hotspot-report-p1-multi.md`
- `artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-root-compare-2026-05-17/summary.json`
- `artifacts/electron-unity-ui-alignment-card-matte-shell-alpha-dynamic-candidate-2026-05-17/hotspot-report-dynamic.md`

Result summary:

- Equivalent rows: 20
- Failing rows: 24
- Main menu: 100% at 1920x1080 and 1366x768
- Rulebook open/page rows: 99.919454% to 100% across both viewports in the current full suite
- All remaining failing rows are dynamic gameplay/settings/preview rows, not Rulebook rows
- The current full suite has 44 rows because `p1-reserved-card-display` and
  `p1-multi-reserved-card-display` are now included for both audited viewports. This intentionally
  keeps both single-card and three-card P1 reserved states in the matrix so previously untested
  reserved states cannot be mistaken for aligned.
- The player-zone label control pass adds `player.current.label` and `player.opponent.label` to the
  geometry gate. Label boxes pass in both audited viewports, and the retained transparent target
  change is fixed-Electron neutral for visible pixels apart from a 13-pixel recapture delta across
  the 16-row focused comparison.
- Compared with the fallback-avatar compact dynamic baseline, the combined retained runtime-card
  placeholder matte and fallback-avatar line-icon repairs reduce the same 16-row dynamic subset from
  2,320,471 to 2,319,629 strict mismatched pixels (-842). Fourteen rows improve and two 1366x768
  rows regress only slightly (`reserve-card` +18 and `p1-reserved-card-display` +34). This is a
  source-backed rendering-fidelity improvement, but all 16 focused dynamic rows still fail strict
  99%.
- Isolated against the runtime-card placeholder candidate, the fallback-avatar icon repair reduces
  strict mismatches from 2,301,293 to 2,301,259 (-34), with 2 rows improved, 0 regressed, and 14
  unchanged. Its effect is correctly limited to the P1 multi-reserved no-buff avatar foreground.
- Compared with the fallback-avatar icon dynamic baseline, the retained card-shell alpha repair
  reduces the 16-row focused dynamic subset from 2,297,109 to 2,290,951 strict mismatched pixels
  (-6,158), with 16 rows improved and 0 regressions. This confirms the previous matte pass was only
  half-complete: matching Electron's `bg-slate-800` RGB helped, but Unity also needed Electron's
  rounded card-shell opacity instead of preserving source-PNG alpha. All 16 focused dynamic rows
  still fail strict 99%.
- Compared with the market-deck label-offset dynamic baseline, the retained card-readability repair
  reduces the same 16-row focused dynamic subset from 2,269,195 to 2,200,137 strict mismatched pixels
  (-69,058), with 4 rows improved, 0 regressed, and 12 unchanged. The improved rows are the P1
  reserved single-card and three-card mini-stack captures in both audited viewports; all 16 focused
  dynamic rows still fail strict 99%.
- Compared with `electron-unity-ui-alignment-final-current-2026-05-15`, the retained card-artwork
  display sampling fix improves all 20 dynamic rows and reduces total strict mismatches by 588,335
  pixels. Five static/Rulebook rows moved by small capture/import noise but remain equivalent.
- Compared with `electron-unity-ui-alignment-final-card-displaytexture-2026-05-15`, the retained
  royal panel and resource badge fixes improve all 20 dynamic rows and reduce total strict mismatches
  by another 358,362 pixels.
- Compared with `electron-unity-ui-alignment-final-royal-resource-2026-05-15`, the retained royal
  glass alpha 0.18 fix improves all 20 dynamic rows and reduces total strict mismatches by another
  255,937 pixels. Static and Rulebook rows moved only by small capture noise and remain equivalent.
- Compared with `electron-unity-ui-alignment-final-royal-alpha018-2026-05-16`, the retained
  empty-tableau dashed-border repair reduces total strict mismatches by another 17,661 pixels and
  lowers the latest player-zone hotspot counts, but the full matrix is mixed: some dynamic rows still
  regress by capture/region and all then-current 20 dynamic rows remain below 99%.
- Compared with `electron-unity-ui-alignment-final-empty-tableau-dashed-2026-05-16`, the retained
  resource badge border/fill repair reduces total strict mismatches by another 59,182 pixels. The
  full-matrix delta is still mixed, so this remains a local player-zone repair, not a completion
  signal.
- Compared with `electron-unity-ui-alignment-final-resource-badge-border-2026-05-16`, the retained
  identity-rail buff-avatar mask and privilege-scroll readability chip reduce total strict
  mismatches by another 11,701 pixels. The full-matrix delta is still mixed, so this is a confirmed
  visual-defect repair, not a completion signal.
- Compared with `electron-unity-ui-alignment-final-identity-chip-2026-05-16`, the latest retained
  object-cover plus deck-label state reduces total strict mismatches by 33,808 pixels. The full
  matrix is still mixed: best/worst dynamic percentages did not reach the identity-chip headline
  values, and all then-current 20 dynamic rows remain below 99%.
- Compared with the retained pre-gradient dynamic baselines, the Unity `MarketDeckBack` gradient
  repair improves all 22 previously audited dynamic rows and reduces total strict mismatches from
  3,708,312 to 3,535,999 pixels. This closes a missing Electron artwork layer, but the current full
  suite remains below 99% in every dynamic row.
- Compared with `electron-unity-ui-alignment-deck-back-gradient-suite-current-2026-05-16`, the
  current full-suite run after reserved sorting,
  `electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17`, still has 44 rows: 20
  Equivalent and 24 Failing. Fixed-Electron full-root comparison reduces strict mismatches from
  3,812,915 to 3,758,502 pixels (-54,413), with 21 improved rows, 3 sub-10-pixel regressed rows, and
  all 20 static/main-menu/Rulebook rows unchanged or still equivalent.
- The focused deck-label offset run improved `market-deck-reserve-preview` in both viewports by
  17,411 pixels versus the object-cover candidate and by 10,020 pixels versus the identity-chip
  baseline, with no focused-row regressions.
- The focused pure/royal silver-ribbon run improved 6 of 8 focused
  `player-zone-resource-score` / `end-turn` / `buy-card` / `reserve-card` rows and reduced net
  strict mismatches by 22,379 pixels versus the deck-label/object-cover baseline. The buy-card rows
  regressed by 2,018 pixels at 1920x1080 and 3,929 pixels at 1366x768, so further dynamic UI work is
  still required before any full-suite claim.
- The resource action-target repair fixed a confirmed Electron mismatch: during discard/steal replay
  parity captures, Electron marks every legal inventory gem with a clickable rose ring, while Unity
  previously showed only the next replay event target and used a yellow hover-style frame. The rose
  ring focused run improved 6 of 8 focused rows and reduced strict mismatches by 29,230 pixels versus
  `electron-unity-ui-alignment-current-nearest-dynamic-control-2026-05-16`; `reserve-card` improved
  by 13,172 pixels at 1920x1080 and 10,009 pixels at 1366x768. The dynamic 20-row run remained
  mixed: net strict mismatches fell by 4,699 pixels, but `reserved-card-preview` 1366x768 regressed by
  7,179 pixels, `chrome-settings-open` 1920x1080 by 6,647 pixels, and
  `market-deck-reserve-preview` 1366x768 by 5,318 pixels. This is a retained local repair, not a
  dynamic-suite completion signal.
- The P1 reserved pre-fix run exposed a missing-suite bug: Electron `player.reserved.0` was
  `53.94,884.25,99,132` at 1920x1080 and `38.36,628.8,70.4,93.87` at 1366x768, while Unity was
  `807.05,884.25,99,132` and `574.18,628.8,70.43,93.87`. After the Unity geometry repair, the focused
  run reports `53.95,884.25,99,132` and `38.38,628.8,70.43,93.87`; the focused strict run still
  fails at 87.937982% / 87.606378% because the surrounding dynamic player-zone rendering remains
  misaligned.
- The current full suite,
  `electron-unity-ui-alignment-current-after-reserved-sorting-2026-05-17`, has 44 rows: 20
  equivalent and 24 failing. Unity capture exits 0 and there are no Blocker rows; the failing rows
  still have equivalent state/action/operation evidence where applicable, and fail on strict
  pixel/visual diff.
- The retained empty-dot sizing repair was isolated with a fixed-Electron comparison,
  `electron-unity-ui-alignment-empty-dot-size-fixed-electron-compare-2026-05-16`, to avoid treating
  a fresh Electron recapture as a Unity regression. Against the deck-back-gradient full-suite
  Electron screenshots, the candidate improves 12 of 16 focused dynamic rows and reduces the strict
  mismatch total by 342 pixels. The raw candidate run itself remains 16/16 failing, which confirms
  this is only incremental movement toward the 99% gate.
- The resource-gem bbox hardening run,
  `electron-unity-ui-alignment-resource-gem-bbox-hardened-2026-05-16`, proves the runner now carries
  `player.current.gem.*` / `player.opponent.gem.*` into focused resource-row geometry evidence. The
  four focused rows still fail strict pixels, but `boundingBoxes.ok` is true and all 56 gem boxes
  across the two scenarios and two viewports pass the 2px gate.
- The retained runtime `bonusColor`, non-special tableau summary artwork/formula, and
  privilege-scroll centering repairs were checked in
  `electron-unity-ui-alignment-tableau-summary-privilege-dynamic-2026-05-16`. That focused dynamic
  subset still has 14/14 failing rows, with similarity from 87.674628% to 91.672888%, but it reduces
  the 14-row strict mismatch total by 32,128 pixels versus
  `electron-unity-ui-alignment-runtime-bonuscolor-tableau-dynamic-2026-05-16`. The remaining hotspot
  leaders are still `player.current.zone` / `player.opponent.zone` on most 1920 rows and
  `royal.featured` or player-zone regions on 1366 rows.
- The new `p1-multi-reserved-card-display` fixture covers a real P1 three-card reserved mini-stack.
  The first focused run exposed one Unity state mismatch: no-buff `playerBuffs.*.state` was `null`
  while Electron reports `{}`. After the Unity normalization fix,
  `electron-unity-ui-alignment-p1-multi-reserved-bootstrap-statefix-2026-05-16` reports state diff
  Equivalent in both viewports. The reserved card boxes also pass the 2px scoped bbox gate: at 1920x1080,
  slots 0/1/2 are `31.51,855.21,99,132`, `53.95,884.25,99,132`, and `76.39,913.29,99,132` in Unity
  versus Electron `31.55,855.21,99,132`, `53.99,884.25,99,132`, and `76.43,913.29,99,132`. At
  1366x768, Unity reports `22.42,608.15,70.43,93.87`, `38.38,628.8,70.43,93.87`, and
  `54.35,649.45,70.43,93.87` versus Electron `22.44,608.15,70.4,93.87`,
  `38.39,628.8,70.4,93.87`, and `54.35,649.45,70.4,93.87`. Strict pixels still fail at
  89.108362% / 89.458272%, so this closes the missing fixture/state/geometry gap but not dynamic UI
  visual parity.
- The current focused dynamic baseline after state normalization,
  `electron-unity-ui-alignment-current-after-state-normalization-2026-05-16`, still had 14/14
  failing rows and 2,202,089 total strict mismatched pixels. The retained empty-gem badge opacity
  repair in `electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16` reduced the
  total to 2,177,031. It improved the largest 1366x768 reserve-card row by 7,029 pixels and improved
  `royal-featured-card-display` 1920x1080 by 4,285 pixels, but regressed
  `p1-reserved-card-display` 1920x1080 by 1,032 pixels, `reserve-card` 1920x1080 by 406 pixels, and
  `end-turn` 1366x768 by 148 pixels. This is retained because it matches Electron component behavior
  and reduces the focused dynamic total, not because the focused suite passed.
- The fine-grained player-zone control pass first exposed bbox failures that the older broad-zone
  suite could not see: on `initial-board-render` 1920x1080, Unity fallback avatars were offset by
  `4.25px x / 8.25px y` and empty tableau slots were roughly `2.48px` too narrow and `3.09px` too
  low. After the retained geometry fix,
  `electron-unity-ui-alignment-tableau-avatar-geometry-candidate-2026-05-16` reports those new
  avatar/tableau bboxes as passing in both viewports and reduces the initial-board strict mismatch
  by 3,702 px at 1920x1080 and 598 px at 1366x768 versus the semantic-granularity pre-fix run.
- The broader retained dynamic run,
  `electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16`, reduces the same 14-row
  focused total from 2,177,031 to 2,110,697 strict mismatched pixels, with all 14 rows improving.
  It still fails strict 99% in every dynamic row. New fine-grained bbox failures now point at
  non-empty tableau top-card scaling, point ribbons, bonus badges, and some active-player avatar
  states, which are next repair targets rather than completion evidence.
- The Echo Reservoir identity-rail repair was checked in
  `electron-unity-ui-alignment-echo-memory-csschip-rerun-2026-05-16`. The focused reserve-card rows
  still fail at 89.090278% / 88.753565%, but the local Echo chip crop moved closer to Electron and
  the newly named avatar/Echo semantic boxes align. This closes a missed component in the player
  identity rail, not the reserve-card row.
- The refined tableau summary pass was checked in
  `electron-unity-ui-alignment-tableau-summary-topcardpoint-dynamic-2026-05-16`. It reduces the
  14-row focused dynamic total from 2,110,697 to 2,108,560 strict mismatched pixels and reduces named
  tableau bbox failures in most affected rows, but it regresses 6 of 14 rows, including
  `royal-featured-card-display` 1920x1080 by 8,488 pixels and `buy-card` 1366x768 by 3,891 pixels.
  This is retained only as the current best measured tableau-summary geometry repair and must be
  revisited during the player-zone/royal-card pass.
- The reserved mini-stack stack-order repair is retained because Electron renders reserved cards
  with `zIndex: i + 1`, while Unity previously let the first reserved visual cover later cards. The
  current retained run
  `electron-unity-ui-alignment-reserved-stack-sorting-candidate-2026-05-17` still fails all 8 audited
  reserve/reserved-preview rows at strict 99%, but fixed-Electron comparison reduces strict
  mismatches by 26,821 pixels overall: `p1-multi-reserved-card-display` improves by 10,674 pixels at
  1920x1080 and 5,133 pixels at 1366x768, `reserved-card-preview` improves by 6,535 / 4,331 pixels,
  and the only adjacent single-card negative movement is a 9-pixel 1366x768 recapture delta.
- The no-buff fallback avatar-size repair is retained after
  `electron-unity-ui-alignment-fallback-avatar36-candidate-2026-05-16` and the fixed-Electron
  comparison
  `electron-unity-ui-alignment-fallback-avatar36-fixed-electron-compare-2026-05-16`. The focused
  parity run still fails all 10 rows, but the fixed-Electron comparison reduces strict mismatches by
  2,247 pixels overall. `p1-multi-reserved-card-display` improves by 1,372 pixels at 1920x1080 and
  717 pixels at 1366x768; adjacent rows move only by -49 to +2 pixels, so this closes a measured
  no-buff identity-rail drift without changing the broader dynamic-suite verdict.
- The deck-back label font-size repair is retained after
  `electron-unity-ui-alignment-deck-label-font-focused-2026-05-16` and its fixed-Electron comparison
  summary. The 14-row focused parity run still fails all rows, but fixed-Electron comparison reduces
  strict mismatches by 660 pixels overall. The largest gains are
  `market-deck-reserve-preview` 1920x1080 (-175), `market-card-preview` 1920x1080 (-144),
  `market-deck-reserve-preview` 1366x768 (-143), and `market-card-preview` 1366x768 (-58); the only
  regressions are 3-10 pixel movements in four 1366x768 player-zone/initial rows.
- The disabled preview action repair is retained after
  `electron-unity-ui-alignment-preview-disabled-button-candidate-2026-05-16` and fixed-Electron
  comparison
  `electron-unity-ui-alignment-preview-disabled-action-root-compare-2026-05-16`. It improves
  `market-card-preview` by 2,884 pixels at 1920x1080 and 1,600 pixels at 1366x768, with no movement
  in deck or reserved preview rows. Preview rows still fail strict 99%, so the result is a local
  action-band repair rather than evidence that preview compositing is solved.
- The latest full run after the retained matte-radius rounding fix,
  `electron-unity-ui-alignment-current-after-card-radius-css-round-2026-05-17`, still has 44 rows:
  20 Equivalent and 24 Failing. It preserves all Rulebook/main-menu equivalents, but the dynamic
  preview, settings, board, royal, and player-zone rows remain below the strict 99% requirement.
- The retained Unity-only market-label text alignment was checked against Electron `Market.tsx`
  readability-title sizing and placement. Unity moved the bare market label to
  `ViewportPoint(519f, 119f, -0.02f)` with font size `0.19f` without adding a glass panel. The focused
  fixed-Electron comparison
  `electron-unity-ui-alignment-market-label-text-x519-y119-s190-root-compare-2026-05-17` compares 8
  rows and reduces strict mismatches by 1,711 pixels, with 8 improved rows and 0 regressions. The full
  fixed-Electron comparison
  `electron-unity-ui-alignment-market-label-text-full-root-compare-2026-05-17` compares all 44 rows,
  has `skippedRows: []`, reduces strict mismatches by 3,419 pixels, improves 24 rows, regresses 0
  rows, and leaves 20 static/main-menu/Rulebook rows unchanged. The latest full strict run after this
  repair, `electron-unity-ui-alignment-current-after-market-label-text-2026-05-17`, still has 44 rows:
  20 Equivalent and 24 Failing. This is retained as incremental source-backed movement, not completion
  evidence.
- The retained Unity-only deck-preview content-rect repair was checked against Electron
  `CardPreviewOverlay` / `cardPreviewOverlayLayout.ts`. Electron centers the rounded outer preview
  wrapper using rounded width/height, but the deck-back content itself follows the raw transformed
  `FEATURED_CARD_SIZE` scale exposed through `[data-card-preview-deck-reserve]`. Unity now uses the
  raw content rect for the deck image, gradient, labels, and `card.preview.card` target while keeping
  the rounded wrapper rect for the shadow. The focused fixed-Electron comparison
  `electron-unity-ui-alignment-preview-deck-content-rect-root-compare-2026-05-17` improves both
  `market-deck-reserve-preview` rows, reduces strict mismatches from 392,547 to 390,396 (-2,151),
  and has 0 regressions. The broader preview subset comparison
  `electron-unity-ui-alignment-preview-deck-content-rect-preview-subset-root-compare-2026-05-17`
  compares all 6 preview rows with `skippedRows: []`, improves 4 rows, regresses 0 rows, leaves 2
  unchanged, and reduces strict mismatches from 968,694 to 966,533 (-2,161). The preview subset still
  fails strict 99%, so this is retained as a local deck-preview geometry repair rather than
  completion evidence.
- The latest full strict run after the retained deck-preview content-rect repair,
  `electron-unity-ui-alignment-current-after-preview-content-rect-2026-05-17`, has 44 rows:
  20 Equivalent and 24 Failing. The worst current failing dynamic row is
  `market-deck-reserve-preview` at 1366x768 with 87.363786% similarity and 132,565 strict mismatched
  pixels; the best current failing dynamic row is `reserved-card-preview` at 1920x1080 with
  93.412953% similarity and 136,589 strict mismatched pixels. The full fixed-Electron comparison
  `electron-unity-ui-alignment-preview-content-rect-full-root-compare-2026-05-17` compares all
  44 rows with `skippedRows: []`, reduces strict mismatches from 3,511,339 to 3,509,189 (-2,150),
  improves 1 row, regresses 0 rows, and leaves 43 rows unchanged. This confirms the repair is real
  but narrow, and that the remaining blocker is broader dynamic UI rendering rather than Rulebook
  coverage or a disabled visual-diff path.

Failing rows at 1920x1080 for the matte-radius snapshot:

| Scenario                         | Similarity | Required |
| -------------------------------- | ---------: | -------: |
| `market-deck-reserve-preview`    | 86.800251% |      99% |
| `market-card-preview`            | 86.937066% |      99% |
| `reserve-card`                   | 89.087481% |      99% |
| `p1-multi-reserved-card-display` | 89.263310% |      99% |
| `p1-reserved-card-display`       | 89.525415% |      99% |
| `buy-card`                       | 90.463783% |      99% |
| `end-turn`                       | 90.589940% |      99% |
| `chrome-settings-open`           | 90.801553% |      99% |
| `royal-featured-card-display`    | 90.912375% |      99% |
| `player-zone-resource-score`     | 91.847174% |      99% |
| `initial-board-render`           | 92.347463% |      99% |
| `reserved-card-preview`          | 92.422791% |      99% |

Failing rows at 1366x768 for the matte-radius snapshot:

| Scenario                         | Similarity | Required |
| -------------------------------- | ---------: | -------: |
| `market-deck-reserve-preview`    | 85.613409% |      99% |
| `market-card-preview`            | 86.363966% |      99% |
| `reserve-card`                   | 87.361880% |      99% |
| `p1-reserved-card-display`       | 88.861373% |      99% |
| `royal-featured-card-display`    | 89.433966% |      99% |
| `p1-multi-reserved-card-display` | 89.532051% |      99% |
| `end-turn`                       | 89.876064% |      99% |
| `buy-card`                       | 89.886072% |      99% |
| `chrome-settings-open`           | 90.276793% |      99% |
| `player-zone-resource-score`     | 91.229525% |      99% |
| `initial-board-render`           | 91.506718% |      99% |
| `reserved-card-preview`          | 91.925939% |      99% |

Top hotspot findings from the latest full and focused reports:

- Preview failures are still led by `card.preview.overlay` / `card.preview.backdrop`. Deck labels and
  deck-back gradient are no longer missing in the deck preview, but overlay compositing and captured
  backdrop sampling still dominate the preview rows.
- The retained premultiplied-display focused report
  `electron-unity-ui-alignment-premultiplied-display-round-candidate-2026-05-17/hotspot-report-current.md`
  still has all 16 focused dynamic rows failing strict 99%. The largest focused hotspots remain
  `board.root` at 1920x1080 initial render, `player.current.zone` / `player.opponent.zone` across
  player-zone rows, and `royal.featured` in several 1366x768 rows.
- Initial board and settings rows at 1920x1080 are now led by `board.root`; many action/player-zone
  rows are still led by `player.current.zone` or `player.opponent.zone`. At 1366x768, board/settings
  and several action rows still show `royal.featured` as a dominant hotspot.
- The empty-tableau dashed-border repair reduces targeted player-zone hotspot counts, but reserve
  and end-turn rows remain led by `player.opponent.zone`.
- The resource badge repair improves the latest reserve/end-turn/player-zone rows in aggregate, but
  it does not remove the player-zone hotspot class.
- The identity-rail repair removes the square buff-avatar artifact and slightly improves the latest
  player-zone-resource-score rows, but player-zone rows remain far below 99%.
- The object-cover player-zone repair reduces confirmed surface-artwork mismatch, but latest
  player-zone rows are still led by `player.current.zone` / `player.opponent.zone`.
- The resource action-target repair reduces the most obvious reserve-card inventory-ring drift, but
  latest player-zone rows are still led by player-zone regions rather than a single ring-only defect.
- The P1 single-reserved and multi-reserved rows are led by `player.current.zone` at both viewports
  even after the reserved card rects themselves match Electron, confirming that the remaining failure
  is broader player-zone rendering rather than the fixed P1 reserved anchors.
- The latest P1 multi-reserved hotspot pass after runtime-card matte and fallback-avatar line icons
  still reports `player.current.zone` / `player.opponent.zone` as the broad hotspots and
  `player.reserved.1`, `player.reserved.0`, and `player.reserved.2` as the dense hotspots. This
  confirms the next work is reserved mini-stack card rendering/compositing and player-zone surface
  fidelity, not another avatar-geometry fix.
- After the card-shell alpha repair, broad hotspots remain `board.root`, `royal.featured`, and
  `player.current.zone` / `player.opponent.zone`. Dense ranking now repeatedly exposes
  `player.current.label` / `player.opponent.label`, market level cards, TopBar score text, and
  tableau point/card regions. That means card alpha compositing moved the matrix forward, but the
  remaining 99% gap is still multi-component rendering fidelity rather than a single missing
  rectangle.
- Other recurring high-drift regions are `player.current.zone`, `board.root`, `player.resources`,
  market cards, and royal cards.

## Rejected Experiments

These were tested and not retained because they either regressed the strict matrix or only improved
one viewport at the expense of another:

- global weighted-area downsampling changes;
- card-only weighted-area downsampling changes;
- adding a Unity rounded-panel approximation behind the market label looked source-backed by
  Electron's `READABILITY_HUD_GLASS_CLASS`, but the focused root comparisons
  `electron-unity-ui-alignment-market-label-glass-root-compare-2026-05-17` and
  `electron-unity-ui-alignment-market-label-glass-panel-only-root-compare-2026-05-17` regressed
  initial-board rows while improving preview rows, so only the text position/size repair was retained.
  Do not repeat a simple Unity glass backing until the Unity backdrop/compositing path can model the
  Electron CSS backdrop/filter behavior more faithfully;
- forcing Unity market and royal cards through a 1086x1448 featured sample texture before GPU scaling
  looked source-backed by Electron `FEATURED_CARD_SAMPLE_SIZE`, but
  `electron-unity-ui-alignment-featured-sample-market-royal-root-compare-2026-05-17` regressed all 14
  focused market/royal rows and increased strict mismatches by 386,386 pixels. The candidate was
  reverted; the existing Unity display-texture downsample path is currently closer to Electron's
  captured pixels for these gameplay surfaces;
- rendering the Unity board frame from the raw source texture instead of the retained display texture
  looked plausible after `board.root` remained the largest 1920x1080 hotspot, but
  `electron-unity-ui-alignment-board-raw-surface-root-compare-2026-05-17` regressed all 4 focused
  initial/settings board rows and increased strict mismatches by 26,840 pixels, so the display-texture
  board frame path was restored;
- raising Unity board gem shadow alpha from the retained `0.35f` to Electron's nominal
  `GemArtwork` board shadow alpha `0.45` produced only a noise-level mixed result in
  `electron-unity-ui-alignment-board-gem-shadow045-root-compare-2026-05-17`: 1 row improved, 1 row
  regressed, 2 rows were unchanged, and the focused total moved by only -2 pixels, so the candidate
  was reverted instead of treating it as a real alignment repair;
- reapplying Electron `GemArtwork` icon layout to Unity player-zone resource gems on the latest
  market-label baseline, including 6% icon inset, the gold icon inset/translate override, and dark
  drop-shadow, remained wrong under fixed-Electron evidence:
  `electron-unity-ui-alignment-resource-gem-icon-root-compare-2026-05-17` regressed 15 of 16 focused
  player-zone/dynamic rows and increased strict mismatches by 6,054 pixels, so resource gems keep the
  retained full-rect Unity rendering for now;
- adding TMP `characterSpacing = 10f` to Unity player-zone `P1`/`P2` labels looked source-backed
  because Electron uses `tracking-[0.16em]`, but
  `electron-unity-ui-alignment-player-label-tracking-root-compare-2026-05-17` regressed all 4 focused
  initial/buy rows and increased strict mismatches by 117 pixels, so it was reverted;
- increasing Unity player-zone `P1`/`P2` label size from `0.16f` to `0.17f` was tested after crop
  analysis showed Electron's visible label body was larger, but
  `electron-unity-ui-alignment-player-label-size017-root-compare-2026-05-17` improved only 1 of 4
  focused rows, regressed 3 rows, and increased strict mismatches by 45 pixels, so it was reverted;
- setting TMP `fontWeight = Black` when Unity's existing `WithTextWeightCompensation` flag is active
  produced a 0-pixel delta in `electron-unity-ui-alignment-text-weight-black-root-compare-2026-05-17`,
  so this does not repair Electron `font-black` drift with the current Unity font asset/material and
  was reverted as ineffective;
- adding an explicit Unity black 1px readability shadow in front of the retained cyan readability
  glow looked source-backed by Electron's `READABILITY_HUD_TEXT_STYLE`, but
  `electron-unity-ui-alignment-readability-black-shadow-root-compare-2026-05-17` regressed all 8
  focused initial/settings/buy/resource rows and increased strict mismatches from 1,046,807 to
  1,047,405 (+598), so the helper was reverted;
- adding a Unity drop-shadow layer behind TopBar crown/point icon textures looked source-backed by
  Electron `TopBar.tsx`, where both topbar icons use `drop-shadow-lg`, but
  `electron-unity-ui-alignment-topbar-icon-shadow-root-compare-2026-05-17` produced only a 3-pixel
  net improvement across 12 focused rows while regressing 5 rows and improving 4, so it was reverted
  as a mixed/noise-sized candidate;
- replacing Unity's right-side TopBar restart/settings TMP glyphs with geometry-drawn approximations
  of Electron `GameGlyph` looked source-backed by `AppChrome.tsx` and `GameGlyph.tsx`, but the
  focused fixed-Electron comparison
  `electron-unity-ui-alignment-topbar-gameglyph-root-compare-2026-05-17` regressed all 4 audited
  initial/settings rows and increased strict mismatches from 511,143 to 512,119 (+976). The
  candidate was reverted, so the current glyph drift must be solved with a closer pixel model rather
  than this coarse Unity geometry approximation;
- adding Electron-style `drop-shadow` layers behind Unity tableau point ribbons and bonus badges was
  source-backed by `PlayerZoneTableauStack.tsx`, but
  `electron-unity-ui-alignment-tableau-summary-shadow-dynamic-root-compare-2026-05-17` produced a
  0-pixel delta across all 16 focused dynamic rows, so the helper and call sites were reverted as
  ineffective in the current render order/compositing path. The route was rechecked against the
  2026-05-18 retained full root as `electron-unity-ui-alignment-tableau-badge-shadow-root-compare-2026-05-18`
  and again failed the keep bar: 12 player-zone-heavy rows moved by only -1 strict pixel total, with
  1 improved row and 11 unchanged rows;
- raising Unity's normal market deck count chip from the retained `25f` bottom offset to `28f` was
  tested from the deck-back crop but was too mixed and noise-sized:
  `electron-unity-ui-alignment-market-deck-count-offset28-root-compare-2026-05-17` improved only the
  1366x768 buy row, regressed the other 3 focused rows, and added 62 strict mismatched pixels, so it
  was reverted;
- adding TMP `characterSpacing = 14f` to Unity's market-deck level chip looked source-backed because
  Electron's artwork deck path uses `tracking-[0.16em]`, but
  `electron-unity-ui-alignment-market-deck-level-tracking-root-compare-2026-05-17` improved 0 of 10
  focused market/preview rows, regressed 9 rows, left 1 unchanged, and increased strict mismatches
  from 1,600,160 to 1,600,536 (+376), so it was reverted;
- adding a Unity outer `shadow-md` approximation to market deck backs matched Electron
  `MarketLevelRow`'s `shadow-md` wrapper in source, but
  `electron-unity-ui-alignment-market-deck-shadowmd-root-compare-2026-05-17` improved 2 of 4 focused
  initial/buy rows, regressed 2, and increased strict mismatches from 526,010 to 526,047 (+37), so it
  was reverted;
- card-only center-point bilinear display-texture sampling, which improved only
  `royal-featured-card-display` 1920x1080 and `market-card-preview` 1366x768 while regressing 14 of
  16 focused dynamic rows; the focused total increased by 77,335 strict mismatched pixels versus
  `electron-unity-ui-alignment-black-gem-contrast-broader-dynamic-2026-05-16`;
- avatar-only circular bilinear sampling for Unity buff avatars, which looked plausible in local
  crops but collapsed under fixed-Electron comparison: against
  `electron-unity-ui-alignment-black-gem-contrast-broader-dynamic-2026-05-16`, the broader 20-row
  dynamic subset improved 8 rows, regressed 12 rows, and increased the total by 7 strict mismatched
  pixels, so it was rejected as noise rather than a proven Electron-alignment repair;
- direct native source-texture rendering for cards;
- changing the generated display-texture cache from bilinear filtering to point filtering, which
  was tested as a board/card sharpness candidate after hotspot crops showed large texture-sampling
  deltas. Fixed-Electron comparison in
  `electron-unity-ui-alignment-display-texture-point-root-compare-2026-05-17` regressed all 16
  focused dynamic rows and increased strict mismatches by 142,113 pixels, so Unity's display-texture
  cache stays on the retained bilinear path;
- marking card textures readable without a proven renderer benefit;
- enabling Unity `alphaIsTransparency` for the seven runtime gem textures was tested because the
  remaining `board.root` and resource-gem hotspots looked like transparent-edge sampling drift, but
  `electron-unity-ui-alignment-gem-alpha-transparency-root-compare-2026-05-17` improved only 2 of 6
  focused board/settings/resource rows, regressed 4, and increased strict mismatches from 748,526 to
  748,533 (+7), so the gem import settings were reverted;
- Electron-nominal preview overlay alpha in Unity's quad-composited path;
- baking `bg-black/82` into the blurred preview background texture, which regressed the focused
  preview rows by 7,016,904 pixels;
- heavier preview blur radius;
- suppressing Unity resource action-target frames only during preview background capture, which was
  visually plausible from hotspot crops but regressed the fixed-Electron preview subset by 1,762
  strict mismatched pixels in
  `electron-unity-ui-alignment-preview-resource-target-suppression-root-compare-2026-05-16`;
- suppressing Unity topbar chrome during preview background capture, which removed too much of the
  captured Electron-like chrome presence and regressed all 6 focused preview rows. Fixed-Electron
  comparison in `electron-unity-ui-alignment-preview-chrome-capture-hidden-root-compare-2026-05-17`
  increased strict mismatches from 1,026,183 to 1,038,698 (+12,515), so the capture-time suppression
  was reverted;
- royal glass shadow/inset highlight tuning;
- label-only royal offset without the retained panel fill/resource badge changes;
- royal glass alpha 0.12, which remained better than the old baseline but regressed by 704 pixels
  against the retained 0.18 alpha in the focused royal/settings/buy rows;
- direct Electron `bg-slate-950/28` royal-glass fill color in Unity, which was source-plausible
  but wrong for the current Unity compositing path: fixed-Electron comparison of
  `electron-unity-ui-alignment-royal-glass-slate-candidate-2026-05-16` against the retained
  fallback-avatar baseline regressed all 10 focused rows and added 407,504 strict mismatched pixels;
- adding a Unity `royal.featured` full-rect slate backing behind the 2x2 royal grid, which targeted
  the visible card-gap tint from hotspot crops but regressed all 4 focused initial/royal rows in
  `electron-unity-ui-alignment-royal-grid-backing-root-compare-2026-05-17` and added 61,468 strict
  mismatched pixels, so it was reverted;
- adding only the vertical and horizontal Unity royal-grid gap strips was also rejected: fixed-Electron
  comparison in `electron-unity-ui-alignment-royal-grid-gap-strips-root-compare-2026-05-17` regressed
  all 4 focused initial/royal rows and added 26,062 strict mismatched pixels, so simple overlay
  darkening is not a valid royal-card parity repair;
- forcing top-level Unity market and royal featured cards to use Electron's nominal `150x200`
  `FEATURED_CARD_SIZE` display sample was tested because Electron builds featured cards at that
  size before outer layout scaling. It was rejected because
  `electron-unity-ui-alignment-featured-card-sample150-dynamic-root-compare-2026-05-17` improved all
  8 audited 1366x768 rows but regressed all 8 audited 1920x1080 rows and increased the focused
  16-row total by 6,356 strict mismatched pixels;
- keeping Unity featured-card textures at Electron's `1086x1448` sample canvas until final quad
  rendering was rechecked on the 2026-05-18 root for preview cards, reserved mini-stack cards,
  market cards, and royal cards. Despite matching the React `FEATURED_CARD_SAMPLE_SIZE` contract
  in source, it regressed all 16 focused preview/player-zone/royal rows in
  `electron-unity-ui-alignment-featured-sample1086-root-compare-2026-05-18` and added 453,388
  strict mismatched pixels, so Unity's retained display-texture downsample path remains closer to
  the current Electron captures;
- shifting Unity market-card rectangles 1 design pixel right looked plausible from the 1920x1080
  card-crop shift analysis, but it failed the two-viewport fixed-Electron check against the retained
  royal-card root. `electron-unity-ui-alignment-market-card-xplus1-root-compare-2026-05-18`
  improved 5 rows, regressed 9 rows, and increased the focused total by 5,197 strict mismatched
  pixels, with every audited 1366x768 dynamic row regressing. The candidate was reverted; market-card
  drift cannot be solved by this single global x offset;
- royal-card fractional rectangle tuning copied from Electron-measured dimensions, which regressed
  the focused royal/settings/buy/player-zone matrix by 60,122 pixels;
- preview title size/spacing tuning, which regressed the focused preview matrix by 20,206 pixels;
- preview title `0.24` size plus `16` character spacing, which made the standalone title bounding
  box closer but regressed all 6 focused preview rows and added 49,765 strict mismatched pixels;
- preview title `0.288` non-deck / `0.23` deck sizing, which improved the 1366x768 preview rows but
  regressed all three 1920x1080 preview rows under fixed-Electron comparison and added 507 strict
  mismatched pixels overall, so it was reverted;
- adding a Unity preview-title drop shadow to mirror Electron
  `drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]`, which improved the 1366x768 market-card and
  reserved-card preview rows but regressed 4 of 6 fixed-Electron preview rows and increased strict
  mismatches from 1,026,183 to 1,026,246 (+63), so it was reverted;
- preview overlay alpha 0.04, which regressed 5 of 6 focused preview rows and added 87,647
  strict mismatched pixels versus the retained 0.01 overlay alpha;
- preview overlay alpha 0.07, which looked plausible from localized background-crop simulation but
  regressed all 6 fixed-Electron preview rows and increased strict mismatches from 495,186 to 919,506
  (+424,320), so the retained 0.01 overlay alpha was restored;
- preview overlay alpha 0.00, which regressed 5 of 6 focused preview rows and added 17,554
  strict mismatched pixels versus the retained 0.01 overlay alpha;
- preview overlay alpha 0.005, which looked plausible in a masked screenshot sample but regressed
  all 6 fixed-Electron preview rows and added 4,157 strict mismatched pixels versus the retained
  0.01 overlay alpha, so it was reverted;
- preview overlay alpha 0.68, which regressed the focused preview rows by 7,071,158 strict
  mismatched pixels versus the retained path;
- changing Unity's preview close button fill to literal Electron `bg-slate-950/75`, which was
  source-plausible but regressed all 6 fixed-Electron preview rows by 21 strict mismatched pixels
  overall, so the existing Unity-composited close fill was restored;
- implementing the single-card preview shadow as a card-image alpha drop-shadow, which was the wrong
  Electron model for `CardPreviewOverlay`'s wrapper box-shadow and produced 0 rendered Unity pixel
  changes in the 6-row focused preview suite. The retained fix uses a rounded wrapper shadow instead;
- preview backdrop blur radius 3, which regressed all 6 focused preview rows and added 172,107
  strict mismatched pixels versus the retained radius 4 path;
- preview backdrop blur radius 6 looked plausible after preview hotspots showed the retained radius 4
  crop leaving the underlying reserved mini-card sharper than Electron's backdrop, but
  `electron-unity-ui-alignment-preview-blur6-root-compare-2026-05-18` regressed all 6 focused
  preview rows and increased strict mismatches from 495,186 to 1,125,392 (+630,206), so the retained
  radius 4 path remains;
- suppressing topbar chrome controls during Unity preview backdrop capture, which regressed all 6
  focused preview rows and added 29,584 strict mismatched pixels versus the retained capture path;
- preview backdrop capture downsampled to half resolution before blur/upscale, which regressed all 6
  focused preview rows and added 598,243 strict mismatched pixels versus the retained full-resolution
  capture path;
- changing Unity player-zone `object-cover` surface sampling from nearest source-pixel selection to
  area-averaged downsampling looked source-plausible against browser image scaling, but
  `electron-unity-ui-alignment-player-zone-object-cover-area-root-compare-2026-05-18` regressed 11
  of 12 focused player-zone/royal rows and increased strict mismatches from 1,756,747 to 1,776,964
  (+20,217). Only `reserve-card@1920x1080` improved, so the retained object-cover sampler was
  restored;
- moving Unity resource gem count badges to the nominal Electron `-bottom-2 -right-2` 8px offset.
  Although Electron's `GemIcon` classes make that look source-backed, the focused fixed-Electron
  `player-zone-resource-score` comparison
  `electron-unity-ui-alignment-resource-badge-offset8-root-compare-2026-05-18` regressed both rows
  and increased strict mismatches from 240,575 to 241,960 (+1,385), so the retained 4px offset was
  restored;
- direct source-texture rendering for market deck backs, which made the visible card backs sharper
  but regressed all 8 focused deck/backdrop rows and added 42,947 strict mismatched pixels versus
  the retained display-texture path;
- direct source-texture rendering for market deck backs combined with the retained deck-back gradient
  overlay, which again regressed all 4 focused deck/back rows and added 24,323 strict mismatched
  pixels versus the retained display-texture plus gradient path;
- adding a lightweight Unity rounded shadow for normal market deck backs to mirror Electron
  `shadow-md`, which produced only a 115-pixel focused net reduction and regressed
  `initial-board-render` 1366x768 by 60 strict pixels versus the retained content-box deck path, so
  the candidate was reverted as too mixed/noise-sized;
- forcing Unity's replay-interactive market to the Electron `opacity-80` disabled-market state was
  source-plausible from `Market.tsx`, but
  `electron-unity-ui-alignment-market-opacity80-root-compare-2026-05-18` regressed 16 of 18 affected
  rows and increased strict mismatches from 2,311,020 to 5,336,359 (+3,025,339). The parity harness
  appears to require the existing interactive-replay market opacity path, so this candidate was
  reverted;
- direct raw source-texture rendering for royal cards, which regressed the focused royal/initial
  rows by 25,822 strict mismatched pixels versus the retained display-texture path;
- sampling Unity market and royal gameplay cards through an explicit 150x200 featured display sample
  before final layout scaling was source-plausible from `FEATURED_CARD_SIZE`, but
  `electron-unity-ui-alignment-featured-card-sample-root-compare-2026-05-18` increased the affected
  fixed-Electron total from 2,311,020 to 2,315,093 (+4,073), improving only 6 of 18 rows and
  regressing 12. The direct final-rect sample path was restored;
- changing the Unity royal featured frame fill to literal `READABILITY_HUD_GLASS_CLASS`
  `bg-slate-950/28` was source-plausible, but
  `electron-unity-ui-alignment-royal-frame-slate950-root-compare-2026-05-18` regressed all 18
  affected rows and increased strict mismatches from 2,311,020 to 2,993,505 (+682,485), so the
  existing composited royal-frame fill was restored;
- object-cover area-average sampling for player-zone surfaces, which regressed the focused
  object-cover candidate by 79,830 pixels versus the retained nearest-sample implementation;
- an earlier half-pixel bilinear object-cover sampling run for player-zone surfaces, which reduced
  that older dynamic control by 10,538 pixels net but was rejected because it caused large
  unrelated row regressions: `reserved-card-preview` 1366x768 +7,732, `chrome-settings-open`
  1920x1080 +6,051, `market-deck-reserve-preview` 1366x768 +5,245, and
  `reserved-card-preview` 1920x1080 +2,981. The later fixed-Electron retest from
  `electron-unity-ui-alignment-royal-card-xminus1-full-2026-05-18` is retained above and supersedes
  this older rejected route;
- source-center bilinear object-cover sampling, which had only a 3,346-pixel focused net improvement
  and regressed `reserve-card` 1366x768 by 9,449 pixels;
- area-average object-cover sampling in the latest candidate series, which regressed the focused
  matrix by 34,955 pixels;
- CSS half-up target-dimension rounding for player-zone object-cover surfaces, which was
  source-plausible because Electron's CSS path can round fractional zone sizes differently from
  Unity `Mathf.RoundToInt`. Fixed-Electron comparison in
  `electron-unity-ui-alignment-objectcover-cssround-root-compare-2026-05-17` reduced the 18-row
  focused total by only 1,728 pixels but regressed 8 rows, including 1920x1080
  `reserved-card-preview` (+500), `chrome-settings-open` (+237), `end-turn` (+230), and
  `initial-board-render` (+199), so it was reverted as mixed/noise-sized;
- resource gem icon inset 6%, which matched Electron's icon source inset and improved the focused
  matrix by 29,593 pixels but regressed the dynamic run in preview/settings rows:
  `reserved-card-preview` 1920x1080 +13,429, `market-deck-reserve-preview` 1366x768 +7,157,
  `chrome-settings-open` 1366x768 +4,135, and `reserved-card-preview` 1366x768 +2,822;
- resource gem icon inset 3%, which improved the focused matrix by 19,967 pixels but reduced the
  dynamic 20-row run by only 1,339 pixels net while still causing large regressions in
  `reserved-card-preview` 1366x768, `chrome-settings-open` 1920x1080, and
  `market-deck-reserve-preview` 1366x768;
- the larger 24.5px resource badge variant;
- a 0.24-alpha empty tableau dashed border variant, which improved most targeted rows but regressed
  the 1366x768 end-turn row more than the retained 0.30-alpha variant;
- a 3px/3px empty tableau dashed border pattern, which regressed reserve rows in the focused matrix;
- empty-tableau shadow/glow variants, which improved 7 of 8 focused player-zone rows but repeatedly
  regressed the 1366x768 reserve-card row in the full focused matrix, so they were not retained;
- a reserved-column divider candidate matching Electron's always-rendered `border-r` / `border-l`
  column structure, which improved `initial-board-render` and P1 reserved rows but regressed the
  focused 14-row dynamic total by 10,992 strict pixels versus
  `electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16`, including +4,985 px on
  `reserve-card` 1920x1080;
- a no-buff fallback avatar candidate using Electron's single 72px rounded background structure,
  which regressed the focused `p1-multi-reserved-card-display` row by 1,094 px at 1920x1080 and
  655 px at 1366x768 versus `electron-unity-ui-alignment-p1-multi-reserved-bootstrap-statefix-2026-05-16`;
- removing Unity's 2% board-gem artwork inset to mirror Electron's board `GemArtwork h-full w-full`
  structure, which improved some rows but regressed the focused 14-row dynamic total by 20,121
  strict pixels versus `electron-unity-ui-alignment-empty-gem-badge-opacity-candidate-2026-05-16`,
  including +15,539 px on `reserve-card` 1366x768;
- dark-digit pure/royal silver-ribbon variants, which regressed the focused matrix by 11,626 pixels
  with top-card centering and by 18,024 pixels with rect-center placement versus the retained
  white-digit ribbon;
- broader tableau summary artwork replacement with copied point-ribbon and card-number sprites,
  which still reduced 5,839 pixels versus the original deck-label/object-cover baseline but regressed
  by 16,540 pixels versus the retained pure/royal ribbon candidate and introduced buy/end row
  regressions;
- replacing player privilege scroll glyphs with a drawn vertical scroll variant, which improved the
  focused `player-zone-resource-score` rows but regressed the focused matrix by 10,701 pixels versus
  the retained pure/royal ribbon candidate;
- replacing only the empty privilege glyph, which produced a small 597-pixel net focused improvement
  but was rejected because it mixed 4/8 row movement and regressed the 1920x1080 `reserve-card` row by
  6,963 pixels;
- replacing player identity colors with Tailwind-like `emerald-500`, `blue-500`, and `slate-300`
  values, which regressed the focused matrix by 5,349 strict mismatched pixels and was reverted;
- adding `characterSpacing = 16f` to Unity player-zone labels, which was source-plausible because
  Electron uses tracked uppercase labels, but the fixed-Electron 16-row focused comparison regressed
  every row and added 331 strict mismatched pixels. The visual text change was reverted; only the
  transparent label target and Electron semantic export were retained;
- adding only the dark-offset portion of Electron's player-zone label readability shadow, which
  regressed all 16 focused rows and increased the fixed-Electron total from 2,452,430 to 2,452,563
  (+133). The retained label repair uses the measured glow-only variant instead;
- adding a TMP foreground outline for player-zone labels to approximate Electron's
  `WebkitTextStroke: 0.35px rgba(5,12,24,0.55)`, which was source-backed but regressed the
  fixed-Electron 14-row dynamic comparison from 2,096,946 to 2,096,999 strict mismatched pixels
  (+53). It improved only 3 rows, regressed 8 rows, left 3 unchanged, and was reverted;
- adding a Unity tableau top-card amber glow to mirror Electron's second royal-luxury
  `drop-shadow(0 0 10px rgba(245,158,11,0.12))`, which produced a 0-pixel fixed-Electron delta
  versus the retained label-glow artifact across all 16 focused rows and was reverted as ineffective
  under the current strict comparison;
- moving Unity resource-count badges from the retained 4px outside offset to an 8px outside offset
  based on Electron's `-bottom-2 -right-2` classes, which regressed all 16 focused rows and increased
  the fixed-Electron total from 2,452,430 to 2,462,850 (+10,420). The retained 4px offset remains
  closer to the captured Electron pixels;
- drawing an empty reserved-column divider even when no reserved cards were present, which appeared
  to improve a focused self-run but collapsed to a 40-pixel common-Electron recapture delta and was
  rejected as capture noise rather than a proven Electron-alignment repair;
- board gem shadow tuning, which improved the first focused 4-row board/buy candidate by 4,944
  strict mismatched pixels but regressed the broader 14-row dynamic subset by 21,475 pixels, including
  large `reserve-card` and `royal-featured-card-display` regressions;
- direct native source-texture rendering for the board frame, which regressed all 4 focused
  initial/buy rows and added 24,534 strict mismatched pixels versus the retained display-texture path;
- retesting direct native source-texture rendering for only `initial-board-render` after the tableau
  CSS-target pass, which still regressed both audited viewports: +11,760 px at 1920x1080 and
  +3,557 px at 1366x768 versus `electron-unity-ui-alignment-tableau-css-target-dynamic-2026-05-16`;
- applying Electron's gold board `GemArtwork` layout override directly to Unity board gold gems,
  which regressed `initial-board-render` by +3,745 px at 1920x1080 and +1,266 px at 1366x768;
- snapping Unity royal card rects to the exact Electron measured featured-card boxes, which made the
  semantic rects closer but regressed strict pixels in all four focused rows:
  `initial-board-render` +3,193 / +1,158 px and `royal-featured-card-display` +1,486 / +170 px
  at 1920x1080 / 1366x768;
- deriving Unity `RoyalCardRect` from the current `RoyalFeaturedRect` plus a measured 16.36px grid
  gap, which looked plausible because the child royal-card boxes were offset by roughly one viewport
  pixel, but `electron-unity-ui-alignment-royal-card-grid-rect-root-compare-2026-05-17` regressed
  3 of 4 focused rows and increased fixed-Electron strict mismatches from 521,009 to 524,373
  (+3,364), so the candidate was reverted;
- reapplying Electron-style source inset to the Unity player-zone resource gem icons after the latest
  tableau fixes, which regressed the 8-row focused resource subset by 10,681 pixels even though a few
  individual rows improved;
- retesting resource gem icon inset after the tableau CSS-target pass with a 10-row focused resource
  subset: the direct 6% icon inset regressed by +19,034 px, and a reduced 2% inset still regressed by
  +9,373 px, so Unity keeps the existing full-rect resource gem rendering until a stronger
  crop-backed replacement is found;
- reapplying the Electron `GemArtwork` 6% icon inset to player resource gems after the no-buff
  fallback-avatar repair, which only improved `p1-reserved-card-display` and
  `p1-multi-reserved-card-display` 1920x1080 by 13 pixels each but regressed every 1366x768 row. The
  fixed-Electron comparison added 2,823 strict mismatched pixels overall, so the candidate was
  reverted and resource gems keep their retained full-rect Unity rendering;
- applying Electron's `GemArtwork` icon drop-shadow to Unity player resource gems, which was
  source-plausible but produced no rendered Unity pixel changes at all in the 8-row resource-focused
  suite. Direct old-Unity versus new-Unity comparison reported 0 changed pixels, and the
  fixed-Electron comparison in
  `electron-unity-ui-alignment-resource-gem-icon-shadow-fixed-electron-compare-2026-05-16` was
  unchanged at 1,257,620 strict mismatched pixels, so the code candidate was reverted;
- scaling and recoloring the player privilege scroll glyph toward Electron's player-zone visual size,
  which improved 4 of 8 focused rows but added 5,672 pixels overall and regressed 1920x1080
  `reserve-card` by 8,331 pixels;
- changing the `pure-royal` tableau point ribbon to the same dynamic card-number artwork/formula used
  by non-special stacks, which improved several 1920x1080 player-zone rows but regressed the 14-row
  focused dynamic subset by 21,699 pixels, including `reserve-card` 1920x1080 +11,346 and
  `royal-featured-card-display` 1920x1080 +11,619;
- an earlier shrink-only tableau point-ribbon and bonus-badge pass, which reduced the focused total
  by 9,435 pixels versus `electron-unity-ui-alignment-tableau-avatar-geometry-dynamic-2026-05-16`
  but was rejected because it regressed `buy-card` 1366x768 by 3,366 pixels and `reserve-card`
  1366x768 by 4,995 pixels; the later top-card-positioned summary pass is tracked separately above;
- shrinking only tableau bonus badges, which regressed the focused total by 5,885 pixels versus the
  retained avatar/tableau geometry run;
- shrinking only tableau point ribbons, which regressed the focused total by 6,243 pixels versus the
  retained avatar/tableau geometry run;
- inverse-scaling Unity tableau point-ribbon and card-number source sizes to mirror Electron's
  `ScaledCardFrame` math. This was source-plausible because Electron computes
  `summaryBadgeSizePx` / `summaryBadgeFontPx` before applying the outer tableau scale, but the
  fixed-Electron comparison
  `electron-unity-ui-alignment-tableau-summary-inversescale-root-compare-2026-05-17` regressed 6 of
  8 reserve/reserved preview rows and increased strict mismatches from 1,139,975 to 1,154,157
  (+14,182). The same route was rechecked after the retained preview Gaussian blur against 14
  dynamic rows; `electron-unity-ui-alignment-tableau-summary-inversescale-after-gaussian-root-compare-2026-05-17`
  regressed 12 rows, improved only one 1-pixel row, and increased strict mismatches by 10,816, so
  the candidate was reverted again and should not be repeated without a different component-level
  hypothesis;
- midpoint (`0.5`) and three-quarter (`0.75`) tableau point-summary offsets between the stack base
  and top-card center. The midpoint version fixed the current red point bbox but regressed the
  reserve-card focused total to 345,492 pixels, and the `0.75` version regressed it further to
  357,471 pixels, so both were rejected in favor of the top-card-centered current candidate;
- normalizing all newly added Unity `ui-icons` texture imports to disable mipmaps, NPOT scaling, and
  platform compression, which matched the already-retained crown/silver import strategy but
  regressed the latest 16-row fixed-Electron dynamic comparison from 2,269,195 to 2,275,070 strict
  mismatched pixels (+5,875), with 0 improved rows, 12 regressions, and 4 unchanged rows in
  `electron-unity-ui-alignment-ui-icon-import-uncompressed-dynamic-root-compare-2026-05-17`. The
  candidate was reverted again, so the new default-imported point-ribbon, bonus-badge, and
  card-number `.meta` files remain at their prior import settings until a crop-backed replacement is
  found;
- applying Electron's nominal board-gem `drop-shadow(0 10px 16px rgba(0,0,0,0.45))` opacity and the
  gold board-gem inset/translate override directly in Unity. Although source-backed, the combined
  candidate regressed all 16 focused dynamic rows and increased strict mismatches from 2,221,002 to
  2,232,348 (+11,346) in
  `electron-unity-ui-alignment-board-gold-shadow-dynamic-root-compare-2026-05-17`, so it was
  reverted. The remaining board drift is therefore not fixed by that isolated CSS-parameter copy;
- making the remaining 30 modified Unity card texture imports readable after the retained 25-card
  reserved-fixture repair. The broader candidate was source-plausible, but the fixed-Electron
  24-row dynamic comparison only moved from 3,509,940 to 3,509,937 strict mismatched pixels (-3),
  with 8 improved rows, 8 regressed rows, and 8 unchanged rows in
  `electron-unity-ui-alignment-all-card-readable-dynamic-root-compare-2026-05-17`. Because the effect
  is capture noise rather than a reliable Electron-alignment repair, those 30 extra `isReadable`
  changes were reverted and only the previously proved 25-card subset remains readable;
- anchoring Unity tableau bonus badges to the computed top-card rectangle instead of the stack base
  rectangle looked source-backed because Electron positions the badge inside the absolute top-card
  wrapper. The focused fixed-Electron comparison
  `electron-unity-ui-alignment-tableau-bonus-topcard-root-compare-2026-05-17` regressed 5 of 6
  focused player-zone rows, improved only 1 row, and increased strict mismatches from 890,913 to
  894,780 (+3,867), so the candidate was reverted and the current badge drift remains unresolved;
- rendering Unity reserved mini-stack card artwork from Electron's featured 1086x1448 sampling
  canvas looked source-backed because Electron reserved cards use `<Card size="featured">`, but the
  fixed-Electron focused comparison
  `electron-unity-ui-alignment-reserved-featured-sample-root-compare-2026-05-17` regressed 6 of 8
  reserved/preview rows, improved only the `reserve-card` rows, and increased strict mismatches from
  1,115,426 to 1,121,769 (+6,343). The candidate was reverted; reserved-card repair still needs a
  broader card-shell/compositing model rather than this isolated sampling-size copy;
- changing Unity board-gem render opacity from the retained 0.95 path to 1.0 because Electron's
  board `GemArtwork` image has no explicit opacity. The fixed-Electron initial/settings comparison
  `electron-unity-ui-alignment-board-gem-opacity100-root-compare-2026-05-17` regressed all 4 audited
  rows and increased strict mismatches from 509,794 to 513,050 (+3,256), so the candidate was
  reverted. This confirms the current Unity compositing path still needs the 0.95 multiplier even
  though a literal CSS-property copy looked plausible;
- changing Unity's preview overlay to Electron's nominal `bg-black/82` and amber primary preview
  action styling looked source-backed from `CardPreviewOverlay`, but the focused fixed-Electron
  comparison `electron-unity-ui-alignment-preview-overlay-composite-compare-2026-05-17` regressed
  all 3 preview rows and increased strict mismatches from 332,989 to 2,791,261 (+2,458,272), so the
  candidate was reverted. This confirms the current preview drift is not solved by a literal overlay
  alpha copy on top of Unity's retained captured-background stack;
- changing only Unity's enabled preview buy button from its retained green treatment to Electron's
  amber `GLOBAL_ACTION_BUTTON_CLASS` color looked source-backed after isolating it from the rejected
  overlay-alpha experiment, but
  `electron-unity-ui-alignment-preview-buy-amber-root-compare-2026-05-18` compared all 6 preview rows
  against the fixed Electron root and found 0 improved rows, 4 unchanged rows, and 2 noise-scale
  regressions for a +4 strict-pixel delta. The candidate was reverted; do not retry amber buy button
  color as an isolated preview repair without new Electron capture evidence;
- adding Electron's nominal enabled preview action-button shadow
  `0 10px 28px rgba(251,191,36,0.26)` to Unity looked source-backed from
  `GLOBAL_ACTION_BUTTON_CLASS`, while still preserving disabled `shadow-none`, but
  `electron-unity-ui-alignment-preview-action-shadow-root-compare-2026-05-18` regressed all 6
  preview rows and increased strict mismatches from 480,904 to 482,732 (+1,828). The candidate was
  reverted; preview action-band drift is not fixed by adding the CSS nominal button shadow in the
  current Unity compositing path;
- downsampling Unity single-card preview artwork to the actual viewport-pixel preview box instead of
  the retained 1920-design rect looked source-backed from Electron's CSS-pixel `CardPreviewOverlay`
  layout, but `electron-unity-ui-alignment-preview-viewport-sampling-compare-2026-05-17` regressed
  the focused preview subset by 2,685 pixels, including 1366x768 regressions in both market and
  reserved previews. The candidate was reverted; preview-card drift is not fixed by replacing the
  retained design-unit display-texture path with viewport-pixel sampling;
- moving Unity resource action rings above the gem artwork from `z=-0.12` to `z=-0.085` was tested
  from the `player.current.zone` crop, but
  `electron-unity-ui-alignment-player-zone-ring-composite-compare-2026-05-17` improved only one
  focused row by 23 strict pixels with three unchanged rows. The result was too weak to retain as a
  real player-zone repair, so the candidate was reverted;
- thinning the Unity resource action ring stroke from 2px to 1px was rejected after
  `electron-unity-ui-alignment-player-zone-ring-thin-compare-2026-05-17` regressed the focused
  matrix by 12 pixels. The retained Electron-matched rose-ring path stays at the prior stroke until a
  broader resource-compositing fix proves net improvement;
- removing the Unity royal-court glass frame entirely reduced the focused total by 90 pixels, but
  `electron-unity-ui-alignment-royal-frame-remove-compare-2026-05-17` regressed 3 of 5 audited rows,
  so the candidate was reverted. Royal repair still needs a component-level featured-card/grid
  solution rather than deleting the frame;
- shrinking the Unity royal-court glass frame to a header-only panel cleared the featured-card grid
  underlay and improved the 12-row focused fixed-Electron total by 2,619 pixels, but
  `electron-unity-ui-alignment-royal-header-frame-compare-2026-05-17` regressed 4 rows, including
  `market-card-preview` 1920x1080 and `market-deck-reserve-preview` 1920x1080 by 901 pixels each, so
  the candidate was reverted instead of accepting preview regressions;
- bypassing the retained Electron-sized two-stage sampling for Unity player tableau and reserved
  mini-stack cards regressed `electron-unity-ui-alignment-player-zone-card-sampling-compare-2026-05-17`
  by 927 strict pixels across the focused player-zone matrix, so the current card-sampling path was
  restored;
- suppressing replay resource-gem action rings while a replay is active was rejected because
  `electron-unity-ui-alignment-replay-gem-ring-suppression-compare-2026-05-17` regressed the
  player-zone subset by 414 pixels. Electron exposes those legal replay action targets, so Unity must
  keep rendering them until a more exact compositing fix is available;
- increasing Unity TopBar score/crown value text from `0.3f` to `0.32f` and goal text from `0.17f`
  to `0.18f` was tested because Electron desktop TopBar uses `text-[82px] font-black` metrics and
  `text-[40px]` goals. The fixed-Electron initial/settings comparison
  `electron-unity-ui-alignment-topbar-score-size-root-compare-2026-05-17` regressed all 4 audited
  rows and increased strict mismatches from 509,794 to 510,337 (+543), so it was reverted. This
  confirms the current TopBar drift is not solved by simple font-size scaling in Unity's TMP path;
- a full-strength black-gem contrast overlay matching Electron's nominal `rgba(255,255,255,0.34)`
  center stop, which had a smaller net improvement than the retained light-strength version and
  regressed 8 of 12 focused rows;
- a very-light black-gem contrast overlay, which improved 7 of 12 focused rows but regressed the
  subset by 17,826 strict pixels, including large `reserve-card` regressions;
- replacing the retained Unity royal-court glass fill with Electron's nominal `bg-slate-950/28`
  color, which made the card-gap tint visually more literal but regressed all 12 focused
  royal/settings/buy/end/resource rows by 413,950 strict pixels;
- bypassing Unity's retained display-texture downsample path for market deck-back images looked
  plausible from the blurred deck-back crop, but fixed-Electron comparison was mixed and net
  negative: `initial-board-render` 1920x1080 improved by 409 pixels while 1366x768 regressed by
  4,996 pixels, so the candidate was reverted;
- bypassing Unity's retained `GetDisplayTexture` path for normal market deck backs and rendering
  the high-resolution deck-back texture directly again looked source-backed because Electron
  `MarketDeckBack` uses an `img object-cover`, but
  `electron-unity-ui-alignment-market-deck-raw-root-compare-2026-05-18` regressed all 12 focused
  dynamic rows and increased strict mismatches from 1,693,075 to 1,718,979 (+25,904), so normal
  market deck backs stay on the retained display-texture path;
- using a deck-only cropped area-average sampler for normal market deck backs also looked
  source-backed by Electron `MarketDeckBack`'s `object-cover` image, but the fixed-Electron
  comparison `electron-unity-ui-alignment-market-deck-object-cover-area-root-compare-2026-05-18`
  regressed 11 of 14 focused deck/dynamic rows and increased strict mismatches from 1,739,185 to
  1,740,094 (+909). It only improved the two 1920 preview rows, so it was reverted and normal
  market deck backs remain on the retained full-source display-texture path;
- changing the Unity player-zone tableau stack gap from the retained 3 reference pixels to an
  Electron CSS-derived 6px gap looked source-backed from `TABLEAU_STACK_GAP_PX`, but
  `electron-unity-ui-alignment-tableau-gap-csspx-root-compare-2026-05-17` regressed all 16 focused
  player-zone/preview rows and increased strict mismatches from 2,378,373 to 2,452,992 (+74,619), so
  the candidate was reverted;
- disabling Unity mipmaps/compression for point-ribbon, bonus-badge, and card-number UI icon imports
  matched the sharper Electron PNG path in principle, but
  `electron-unity-ui-alignment-ui-icon-import-root-compare-2026-05-17` regressed 9 of 16 focused
  rows and increased strict mismatches from 2,378,373 to 2,380,585 (+2,212), so the import settings
  were restored;
- changing Unity single-card preview height rounding from `Ceil` to `Round` matched Electron's
  `getPreviewLayout()` formula, but
  `electron-unity-ui-alignment-preview-height-round-root-compare-2026-05-17` regressed the focused
  preview subset from 1,005,532 to 1,007,236 strict pixels (+1,704), especially 1366px market and
  reserved previews, so the retained Unity rect math was restored;
- forcing Unity single-card preview artwork through the nominal Electron `FEATURED_CARD_SIZE`
  150x200 display sample before scaling matched the CardPreviewOverlay source order in principle,
  but `electron-unity-ui-alignment-preview-card-sample150-root-compare-2026-05-18` regressed all 4
  focused market/reserved preview rows and increased strict mismatches by 90,918 pixels versus the
  retained post-Gaussian preview baseline, so the retained final-rect display-texture path was
  restored;
- reducing Unity's market-deck count label from `0.115f` to `0.09f` matched Electron's artwork-deck
  label ratio in principle (`text-[10px]` level versus `text-[12px]` count), but
  `electron-unity-ui-alignment-deck-count-font-ratio-root-compare-2026-05-18` was mixed and net
  negative: 4 rows improved only 2-29 pixels, 8 rows regressed, and the 12-row focused total
  increased by 204 strict pixels. The candidate was reverted; deck-count drift needs a different
  component-level hypothesis than simple count font reduction;
- bypassing Unity's retained display-texture downsample path for tableau card-number digit sprites
  followed Electron's direct `<img>` digit rendering in principle, but
  `electron-unity-ui-alignment-card-number-raw-texture-root-compare-2026-05-17` reduced the 22-row
  focused subset by only 3 strict pixels while improving 7 rows and regressing 7 rows at noise scale,
  so the retained downsampled digit path was restored;
- replacing Unity's retained single-glyph replenish/turn-end label with a drawn RefreshCw-style icon
  plus shifted text matched Electron `GameActions` structurally, but
  `electron-unity-ui-alignment-replenish-refresh-icon-root-compare-2026-05-17` regressed 5 of 6
  focused end-turn/player-zone/royal rows and increased strict mismatches by 91 pixels. The candidate
  was reverted; the retained replenish action text path stays until a stronger component-level action
  rendering fix is found;
- adding the missing wider cyan-blue Unity readability glow layer from Electron
  `READABILITY_HUD_TEXT_STYLE` while keeping the previously retained glow-only path. The focused
  fixed-Electron comparison `electron-unity-ui-alignment-readability-second-glow-root-compare-2026-05-17`
  improved 10 of 10 initial/player-zone/reserve/royal/end-turn rows and reduced strict mismatches by
  838 pixels with 0 regressions. A broader guardrail comparison,
  `electron-unity-ui-alignment-readability-second-glow-broader-root-compare-2026-05-17`, improved 12
  of 12 buy/reserved/preview/settings rows and reduced strict mismatches by 1,058 pixels with 0
  regressions, so this Unity-only source-backed glow repair is retained;
- replacing Unity's preview backdrop box blur with a Gaussian-weighted two-pass blur to better match
  Electron `CardPreviewOverlay`'s browser `backdrop-blur-sm` compositing while leaving Electron,
  shared state, and runner thresholds unchanged. The focused preview comparison
  `electron-unity-ui-alignment-preview-gaussian-blur-root-compare-2026-05-17` improved all 4
  market/deck preview rows by 26,763 strict pixels with 0 regressions. The broader preview guardrail
  `electron-unity-ui-alignment-preview-gaussian-blur-broader-root-compare-2026-05-17` improved all 6
  preview rows by 64,066 strict pixels with 0 regressions, and the full fixed-Electron guardrail
  `electron-unity-ui-alignment-preview-gaussian-blur-full-root-compare-2026-05-17` improved only those
  6 preview rows, left 38 rows unchanged, regressed 0 rows, and reduced total strict mismatches by
  64,069 pixels. The latest full strict root
  `electron-unity-ui-alignment-current-after-preview-gaussian-blur-2026-05-17` still has 20
  equivalent rows and 24 failing rows, so this is retained as preview-compositing progress, not
  completion evidence;
- capturing Unity's preview blurred background with `previewInteractionLayoutSticky` temporarily
  enabled. Electron `CardPreviewOverlay` is a fixed portal over the existing game layout, while
  Unity's overlay render path applies the preview/open interactive royal-court offset after
  `previewContext` is restored. The previous capture path cleared `previewContext` before
  `RenderState()`, so the blurred backdrop could be captured from a different underlying layout than
  the visible preview semantic layer. The focused fixed-Electron comparison
  `electron-unity-ui-alignment-preview-capture-sticky-root-compare-2026-05-18` reduced the 6-row
  preview subset from 949,727 to 544,867 strict mismatched pixels (-404,860), with 4 improved rows,
  1 unchanged row, and only a 2-pixel `reserved-card-preview@1920x1080` noise regression. The full
  fixed-Electron comparison
  `electron-unity-ui-alignment-preview-capture-sticky-full-root-compare-2026-05-18` then compared all
  44 rows, improved only the four market/deck preview rows, regressed 0 rows, left 40 unchanged, and
  reduced total strict mismatches by 404,862 pixels. The latest full root
  `electron-unity-ui-alignment-current-after-preview-capture-sticky-rerun-2026-05-18` still has 20
  equivalent rows and 24 failing rows, so this is retained as preview-compositing progress, not
  completion evidence;
- rendering Unity's preview overlay contents under an explicit high `MeshRenderer.sortingOrder`
  context. The retained reserved mini-stack renderer uses positive sorting orders, which could let
  the underlying reserved mini-card render above the blurred preview backdrop even though Electron's
  `CardPreviewOverlay` is a fixed portal above the whole board. The focused fixed-Electron preview
  comparison `electron-unity-ui-alignment-preview-sorting-root-compare-2026-05-18` compared all 6
  preview rows, improved both `reserved-card-preview` rows, regressed 0 rows, and reduced strict
  mismatches from 495,186 to 493,148 (-2,038). This is retained as a narrow preview compositing
  layer-order repair. The full guardrail root
  `electron-unity-ui-alignment-preview-sorting-full-root-compare-2026-05-18` then compared all 44
  rows, improved only the same two reserved-preview rows, regressed 0 rows, left 42 unchanged, and
  reduced total strict mismatches by 2,039. The latest full root
  `electron-unity-ui-alignment-current-after-preview-sorting-2026-05-18` still has 20 equivalent
  rows and 24 failing rows, so this is not preview completion evidence;
- matching Unity TopBar score/turn readability HUD chip border and fill to Electron's
  `READABILITY_HUD_GLASS_CLASS` (`border-cyan-50/40 bg-slate-950/28`). The focused fixed-Electron
  comparison `electron-unity-ui-alignment-topbar-chip-palette-root-compare-2026-05-18` compared
  14 dynamic/preview rows, improved all 14, regressed 0, and reduced strict mismatches from
  1,734,166 to 1,718,090 (-16,076). The full guardrail comparison
  `electron-unity-ui-alignment-topbar-chip-palette-full-root-compare-2026-05-18` compared all
  44 rows, improved 24 failing rows, regressed 0, left 20 unchanged, and reduced total strict
  mismatches from 3,013,293 to 2,987,310 (-25,983). The latest full root
  `electron-unity-ui-alignment-current-after-topbar-chip-palette-2026-05-18` still has
  20 equivalent rows and 24 failing rows, so this is retained as a source-backed TopBar
  micro-repair, not completion evidence;
- adding a flat Unity cover only over missing royal-court slots attempted to approximate Electron's
  invisible `data-royal-court-empty-slot` over the continuous glass background without repeating the
  rejected full-grid backing route, but
  `electron-unity-ui-alignment-royal-empty-slot-royal-root-compare-2026-05-17` regressed both
  `royal-featured-card-display` rows by 18,850 strict pixels total, while the preview guardrail
  comparison moved only by noise-scale +/-1 px. The candidate was reverted; do not repeat a
  slot-only matte cover as a royal-featured repair;
- applying a 0.70 RGB material tint to Unity player-zone tableau and reserved runtime card images
  looked plausible from current player-zone crops, where Unity card artwork is visibly brighter than
  Electron's browser-rendered result, but the fixed-Electron comparison
  `electron-unity-ui-alignment-playerzone-card-tint-root-compare-2026-05-18` regressed 7 of 8 focused
  player-zone/royal rows and increased strict mismatches from 1,178,204 to 1,331,324 (+153,120).
  Only `reserve-card@1920x1080` improved (-1,671), so the tint route was reverted and should not be
  retried as a broad player-zone card repair;
- hiding Unity's just-reserved card during the pending presentation window looked source-backed
  because Electron's `PlayerZoneReservedColumn` can emit `data-reserved-card-pending=true` with
  `visibility: hidden` for the immediate `reserve_card` action result. However, the fixed-Electron
  screenshot baseline did not support hiding the Unity card: the focused reserved-family comparison
  `electron-unity-ui-alignment-pending-reserved-root-compare-2026-05-18` regressed the 8-row subset
  from 1,073,945 to 1,086,139 strict mismatches (+12,194), including `reserve-card@1920x1080`
  +11,900. The candidate was reverted; do not repeat pending-reserved hiding as a visual repair
  without a new source-backed timing change in the parity capture path;
- whole-pixel snapping of reference viewport coordinates;
- one-off font weight/material swaps for menu/settings glyph drift.

## Remaining P0 Work

- Continue Unity preview overlay/backdrop compositing against Electron's browser-rendered blur and
  background sampling. The retained Gaussian blur and preview-capture sticky-layout repairs reduced
  preview rows substantially with no full-suite fixed-Electron regressions, but current preview rows
  remain roughly 92.91-95.76%, far below 99%.
- Reconcile dynamic board/player-zone rendering at the component level rather than through isolated
  icon or shadow tweaks: royal featured card, card sampling, zone surfaces, tableau stacks, reserve
  stacks, resource inventory, identity rail, and target dimming remain below 99%.
- Continue dynamic player-zone repair now that explicit multi-card reserved-stack coverage exists.
  The three-card reserved slots, state snapshot, and stack paint order are aligned, but the current
  full-suite row still fails strict pixels around 89.8-90.1% because broader player-zone rendering
  remains below Electron.
- Use the new fine-grained player-zone bbox evidence to repair non-empty tableau top-card scaling,
  point ribbons, bonus badges, and active-avatar vertical positioning without reintroducing the
  rejected summary-artwork regressions.
- Rebuild settings-open dynamic state so the settings panel and background gameplay surface both
  match Electron.
- Keep extending static Electron-baseline rendering only for genuinely static surfaces. Do not hide
  dynamic gameplay drift behind screenshot fixtures.

## Completion Audit Against Goal

| Requirement                                            | Status                                           |
| ------------------------------------------------------ | ------------------------------------------------ |
| Explain why Rulebook/UI drift was missed               | Complete for this audit pass                     |
| Build a pixel-level control suite                      | Complete                                         |
| Cover all Rulebook pages, not just the first page      | Complete; both audited viewports pass strict 99% |
| Fix Rulebook next/table-of-contents exiting the manual | Complete                                         |
| Audit migrated player-facing UI beyond Rulebook        | Complete as an audit                             |
| Fix confirmed non-Rulebook alignment defects           | Partially complete                               |
| Finish all Unity UI visual parity at 99%               | Not achieved                                     |

## Stop Condition

Unity UI migration visual alignment is complete only when:

- `pnpm parity:ui-alignment --viewports "1920x1080,1366x768"` exits 0;
- `parity-matrix.md` has 0 failing rows;
- all Rulebook pages still pass through real navigation actions;
- no scenario passes by disabling visual diff.
