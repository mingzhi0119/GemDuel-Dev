# OMX Visual Lab Cleanup And Theme Consolidation Template

Use this template when Visual Lab has already been reviewed by a human and the
next task is to regenerate marked assets, delete rejected Themes, and produce a
clean curated candidate Theme library.

This is a production asset prompt. Because it creates or replaces bitmap assets,
it is bound to the `imagegen-asset-library-flow` skill.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL through Codex.

Goal:
Use the current Visual Lab surface review state to regenerate marked assets,
delete rejected candidate Themes, consolidate the surviving Themes, and preserve
human ratings.

Required skill binding:
Before planning, prompt writing, generation, collection, normalization,
replacement, consolidation, or reporting, you MUST open and follow:
/mnt/c/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md

Generation ownership:
- Main Agent writes all prompts, prepares assignments, validates dimensions,
  copies/replaces files, updates manifests/state, consolidates Theme naming, and
  writes reports.
- Subagents/workers perform Image Gen only.
- Subagents must use the imagegen skill and built-in image_gen tool only.
- Subagents must not edit repo files, copy files into the workspace, run git, or
  modify manifests/state.
- Each Subagent returns only prompt id, prompt text, generated source path, and
  failures.

Source of truth:
- Use `tmp/visual-lab/surface-review-state.json` as the review source unless the
  user names a specific frozen plan.
- If stale candidate manifest metadata prevents reviewed sets from matching
  state ids, repair manifest `batch/date` first and write a frozen review plan.
- Runtime Themes are rating-preserved references. Do not rename, delete, or
  overwrite runtime assets unless the user explicitly asks for runtime
  replacement.

Human review rules:
- Rating `1`: delete the whole candidate Theme group. Do not regenerate it.
- Rating `4`, `7`, or `10`: keep the Theme.
- Any Theme or slot with a human comment must have that comment embedded in the
  generation prompt as a mandatory hard constraint.
- Rating values must remain unchanged after replacement/consolidation.
- If regeneration succeeds, clear completed regen marks and comments from
  `tmp/visual-lab/surface-review-state.json`.
- If any regeneration fails, do not clear that failed item’s regen mark/comment;
  report the failure and continue only for successful items.

Deletion policy:
- For this reviewed cleanup flow, 1-point candidate Themes may be deleted without
  backup when the user explicitly says so.
- Always write a delete report listing deleted sets, deleted files, missing
  files, and pruned manifest records.
- Do not delete runtime assets.

Prompt requirements:
- Include prompt id, source kind, rating, old set id, style, former variant,
  slot, target dimensions, target archive path, original asset path, and human
  comment if present.
- State that React renders all labels, counts, icons, levels, gems, cards,
  buttons, hover rings, selection states, and gameplay affordances.
- Forbid text, numbers, Chinese, English, Roman numerals, logos, watermarks,
  fake alphabets, readable glyphs, UI labels, counters, controls, cards, hover
  rings, selection states, screenshots, contact-sheet layouts, and app chrome.
- Use current slot contracts:
  - `shell-background`: 3840x1640
  - `player-zone-p1`: 1920x520
  - `player-zone-p2`: 1920x520
  - `gem-panel`: 1254x1254
  - `market-card-back-l1`: 1086x1448
  - `market-card-back-l2`: 1086x1448
  - `market-card-back-l3`: 1086x1448
  - `royal-card-back`: 1086x1448

Theme consolidation rules:
- Consolidate all kept candidate Themes into a new candidate library:
  `assets/art-library/surface-autonomous-curated-theme-candidates/<run-timestamp>/`
- Remove old `A`/`B` variant labels from directory names, manifest records,
  prompt ids, and Visual Lab display names.
- Use `variant: main` in curated manifest records.
- The UI should hide the `main` variant label.
- When multiple kept Themes share the same base style, sort by:
  1. rating descending
  2. newer date descending
  3. old source id ascending
  Then rename them `<style>-1`, `<style>-2`, `<style>-3`.
- Do not keep old source set ids or source prompt ids inside curated manifest
  records if that would leave A/B variant labels in the production manifest.
  Put provenance in the consolidation report instead.
- Canonicalize all curated PNGs to the target dimensions above. If an existing
  kept source image has older dimensions, normalize it and record the risk.

State handling:
- Preserve runtime ratings.
- Migrate kept candidate ratings from old set ids to curated set ids.
- Remove deleted 1-point candidate ratings.
- Clear completed regen marks and comments.
- Leave failed regen marks/comments intact.

Recommended command shape:
- `pnpm visual-lab:surface:review:validate`
- `node tools/scripts/visual-lab-surface-review.mjs repair-manifests`
- `node tools/scripts/visual-lab-surface-review.mjs write-plan`
- `node tools/scripts/visual-lab-surface-review.mjs apply --plan <plan.json> --phase delete-rating1 --confirm-delete-rating1`
- `node tools/scripts/visual-lab-surface-review.mjs prepare-replacements --plan <plan.json>`
- Subagents run Image Gen from assignment files.
- Main Agent fills source map with generated source paths.
- `node tools/scripts/visual-lab-surface-review.mjs finalize-replacements --plan <plan.json> --sources <filled-source-map.json>`
- `node tools/scripts/visual-lab-surface-review.mjs consolidate --plan <plan.json> --run-timestamp <timestamp>`

Validation:
- `pnpm visual-lab:surface:review:validate`
- focused tests for Visual Lab review tooling
- `pnpm typecheck`
- `pnpm architecture:check`
- consolidated manifest checks:
  - set ids unique
  - archive paths exist
  - required slots complete
  - PNG dimensions match target contracts
  - no A/B variant labels remain in curated directories, manifest records, or
    prompt ids
  - 1-point Themes no longer appear in manifests/catalog/state
- Confirm `http://localhost:5173/?visualLab=surfaces` can load.

Deliverables:
- frozen review plan
- delete-rating1 report
- replacement prompt manifest and source map
- Subagent assignment files and filled generated-source map
- completion report
- consolidation report
- final validation summary
- git status summary

Stop and ask only when:
- the requested decision is destructive beyond the explicit 1-point Theme delete
  policy
- runtime assets would be overwritten
- credentials or external production systems are needed
- a human comment conflicts with an explicit user instruction
- generation failures would require changing scope
```
