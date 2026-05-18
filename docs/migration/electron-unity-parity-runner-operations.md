# Electron/Unity Parity Runner Operations

Date: 2026-05-10

## Purpose

`pnpm parity:electron-unity` is the heavyweight cross-renderer evidence gate. It drives the
Electron renderer through `agent-browser`, captures Unity evidence through the Unity Editor, and
writes the parity matrix under `artifacts/electron-unity-parity/`.

Use it for UI/interaction parity closeout and release-candidate evidence. Do not use it as the
default gate for every small Unity iteration.

## Strict UI Alignment Suite

Use the dedicated visual gate for Unity migration claims that require Electron-pixel alignment:

```powershell
pnpm parity:ui-alignment --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment/<run-id>
```

This suite runs the migrated player-facing UI surfaces with strict screenshot comparison and requires
at least 99% similarity for each row. It is fail-closed: any non-equivalent row makes the command exit
non-zero. Rulebook coverage includes the first open state plus page 2 through page 9 through real
`next` or table-of-contents navigation actions.
Preview surfaces also require Electron/Unity semantic-box agreement for the overlay, backdrop, close
button, preview card, and preview actions before the pixel row can pass.
TopBar diagnostics expose score groups, crown/points subgroups, artwork boxes, score values, goals,
player labels, turn counts, and turn words so broad `topbar.score.*` or `topbar.turn.*` regions do
not hide inner-layout drift.
The `ui-alignment` profile waits 3600ms after Electron scenario setup before capture so transient
presentation animations do not create false positive or false negative screenshot deltas. For focused
diagnostics, override that capture delay explicitly:

```powershell
pnpm parity:ui-alignment --scenario royal-featured-card-display --electron-settle-ms 4200 --viewports "1366x768" --out artifacts/electron-unity-ui-alignment/royal-settle-check
```

Focused runs are available during repair work:

```powershell
pnpm parity:ui-alignment --scenario chrome-rulebook-page-9 --viewports "1920x1080" --out artifacts/electron-unity-ui-alignment/rulebook-page-9
```

Multiple focused scenarios can be batched without running the whole matrix:

```powershell
pnpm parity:ui-alignment --scenarios "market-card-preview,market-deck-reserve-preview,reserved-card-preview" --viewports "1366x768" --out artifacts/electron-unity-ui-alignment/preview-1366
```

The two-viewport strict suite can exceed short command timeouts during Unity Editor capture. During
iteration, run one viewport or a focused scenario batch first, then use the two-viewport command only
for final acceptance evidence.

## Pixel Hotspot Diagnostics

After a strict UI-alignment run fails, generate region-level mismatch evidence from the existing
screenshots and `*-visual-diff.json` files:

```powershell
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment/<run-id>
```

Focused hotspot runs are useful when a matrix is large:

```powershell
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment/<run-id> -Scenarios "initial-board-render,player-zone-resource-score" -Viewports "1920x1080,1366x768" -Top 8
```

Add `-CropRoot hotspot-crops` when reviewing visual drift. The analyzer writes Electron, Unity,
and diff PNG crops for each top semantic and grid hotspot under the artifact root, which makes the
next repair target auditable without reopening full-screen screenshots:

```powershell
pnpm parity:ui-hotspots -- -ArtifactRoot artifacts/electron-unity-ui-alignment/<run-id> -Top 8 -CropRoot hotspot-crops
```

The tool writes `hotspot-report.json` and `hotspot-report.md` under the artifact root. Semantic
regions come from the Electron/Unity state boxes already emitted by the parity runner, while grid
regions provide a coarse fallback when a visual gap is outside a named control. Each row reports the
largest semantic hotspot, the largest non-fullscreen semantic hotspot, and the densest semantic
hotspot. The non-fullscreen list filters out regions covering 80% or more of the screenshot, so
preview overlay/backdrop rows still expose the next actionable component underneath. The dense list
sorts component regions by mismatch percentage before pixel count, so tiny but nearly all-wrong
controls such as action buttons, replay controls, labels, and tableau badges are not buried under
large board or player-zone panels. Crop output now includes `semantic-nonfull` and `semantic-dense`
PNG triplets alongside the existing `semantic` and `grid` crops.

The hotspot analyzer uses exact per-pixel comparison inside each region with the same per-row pixel
threshold recorded by the visual diff JSON; it does not apply the runner's positional tolerance, so
use it to localize problem areas rather than to replace the suite's final pass/fail result.

If overriding report paths, use the PowerShell parameter names:

```powershell
pnpm parity:ui-hotspots -- artifacts/electron-unity-ui-alignment/<run-id> -OutJson artifacts/electron-unity-ui-alignment/<run-id>/hotspot-report.json -OutMarkdown artifacts/electron-unity-ui-alignment/<run-id>/hotspot-report.md
```

Do not pass a generic `--out` flag to the hotspot command; PowerShell treats that as ambiguous.

## Fixed Electron Root Compare

When evaluating a Unity candidate, compare old Unity and new Unity against the same Electron
screenshots before claiming improvement. This removes browser recapture noise from the decision:

```powershell
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment/<old-run> --new artifacts/electron-unity-ui-alignment/<new-run> --electron-root artifacts/electron-unity-ui-alignment/<old-run> --out artifacts/electron-unity-ui-alignment/<compare-run>
```

Use `--scenarios` and `--viewports` for focused candidate checks:

```powershell
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment/<old-run> --new artifacts/electron-unity-ui-alignment/<new-run> --electron-root artifacts/electron-unity-ui-alignment/<old-run> --scenarios "reserve-card,p1-reserved-card-display" --viewports "1920x1080,1366x768" --out artifacts/electron-unity-ui-alignment/<compare-run>
```

The command writes `summary.json`, `summary.md`, and old/new diff PNGs. Treat a candidate as
unproven when this fixed-baseline comparison is mixed, unchanged, or dominated by capture-level
noise, even if the raw parity matrix from the new run looks better.

If a newer candidate run contains extra scenarios that an older baseline root did not capture, keep
the default fail-fast behavior for gate evidence. For exploratory candidate review only, pass
`--common-only` to compare rows that exist in all three roots and record omitted rows in
`skippedRows`:

```powershell
pnpm parity:ui-root-compare -- --old artifacts/electron-unity-ui-alignment/<old-run> --new artifacts/electron-unity-ui-alignment/<new-run> --electron-root artifacts/electron-unity-ui-alignment/<old-run> --scenarios "initial-board-render,chrome-settings-open" --viewports "1920x1080,1366x768" --common-only --out artifacts/electron-unity-ui-alignment/<compare-run>
```

Do not use `--common-only` as completion evidence for the full 99% gate; any skipped row remains
unverified.

## Default Migration Workflow

For normal Unity migration iterations, prefer these source and Unity gates first:

```powershell
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check
pnpm typecheck
pnpm lint
```

When Unity Editor validation is required and available, run the current EditMode or capture command
for the specific Unity surface under review. Use the full browser-backed parity matrix only when the
change needs Electron/Unity visual, semantic, or interaction equivalence evidence.

## Browser Process Safety

The parity runner now treats each `agent-browser` session as a scoped resource:

- each Electron scenario opens a unique `gemduel-parity-<viewport>-<scenario>` session;
- each scenario records a guard sample immediately before closing its session, so `peakCount`
  reflects the largest single active session rather than a full-run accumulation;
- that session is closed in `finally` immediately after the scenario screenshot/state artifacts are
  written;
- the final `agent-browser close --all` remains as a last-resort cleanup step;
- a lock at `artifacts/electron-unity-parity/.runner.lock` prevents two parity runners from running
  at the same time.

The runner records a Windows-specific browser process guard in `runner-summary.json`:

```json
{
    "browserProcessGuard": {
        "beforeCount": 1,
        "peakCount": 14,
        "afterCount": 1,
        "orphanCount": 1,
        "cleanupActions": []
    }
}
```

The guard only matches Chrome for Testing processes owned by `agent-browser`:

- `ExecutablePath` under `%USERPROFILE%\.agent-browser\browsers\chrome-*\chrome.exe`;
- or `CommandLine` containing `.agent-browser` / `agent-browser-chrome-`.

Normal Google Chrome and Microsoft Edge are excluded by construction.

## Process Inspection Script

Use the dry-run guard when CPU is high or before starting a long parity run:

```powershell
pnpm parity:browser-guard -- --pretty
```

To fail when too many matched `agent-browser` Chrome processes are present:

```powershell
pnpm parity:browser-guard -- --max 24 --pretty
```

The script defaults to dry-run. If manual cleanup is needed, the destructive mode is explicit:

```powershell
pnpm parity:browser-guard -- --kill --pretty
```

`--kill` still uses the same narrow matcher and does not target normal Chrome or Edge.

## Acceptance Check

For lifecycle verification, run:

```powershell
pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"
```

The run should finish with `browserProcessGuard.afterCount` back at the pre-run baseline, allowing at
most one extra Windows `STATUS_PROCESS_IS_TERMINATING` style orphan. A full parity run should satisfy
the same process convergence rule:

```powershell
pnpm parity:electron-unity -- --viewports "1920x1080,1366x768"
```

If the guard fails, inspect the emitted PID, executable path, and command line before retrying. A
single stuck terminating GPU subprocess can require Windows sign-out or reboot to fully disappear.
