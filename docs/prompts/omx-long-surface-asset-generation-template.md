# OMX Long Surface Asset Generation Template

Use this template for long-running Gem Duel bitmap asset candidate-library work.
This prompt is intentionally bound to the `imagegen-asset-library-flow` skill.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL through the full OMX CLI runtime.

Goal:
Run a long but bounded Image Gen candidate-library pass for Gem Duel surface assets.

Required skill binding:
Before planning or generating any image or asset, you MUST open and follow:
/mnt/c/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md

This is mandatory for every image/asset generation task in this repo. Follow the skill workflow:
1. Main Agent inspects real project constraints.
2. Main Agent writes a complete prompt manifest before generation.
3. Workers may use the imagegen skill and built-in image_gen tool only.
4. Workers must not edit repo files or copy files into the workspace.
5. Main Agent collects outputs from C:\Users\sange\.codex\generated_images or $CODEX_HOME/generated_images.
6. Main Agent archives project-bound candidates into the workspace.
7. Main Agent records prompts, source files, archive paths, dimensions, scores, risks, and pick advice.
8. Main Agent validates file counts, paths, dimensions, source-path records, and git status.

Hard limits:
- Do not use CLI/API image-generation fallbacks unless the user explicitly confirms that fallback in this thread.
- Do not modify runtime assets unless the user explicitly requests a runtime replacement or promotion pass.
- Do not edit source code.
- Do not add dependencies.
- Do not run omx setup/update/uninstall.
- Do not commit.
- Do not delete existing candidates unless the user explicitly approves a cleanup phase.

Current project constraints to inspect before writing prompts:
- AGENTS.md
- docs/omx-workflow.md
- docs/art/README.md
- docs/prompts/omx-visual-lab-cleanup-template.md if this generation will later
  be reviewed in Visual Lab
- latest docs/art/visual-lab-review-plans/*/surface-review-plan.md if extending
  or comparing against reviewed Themes
- apps/desktop/public/assets/surfaces/README.md
- packages/shared/src/lexicon/index.ts only if player-facing terms are referenced
- current source files defining surface style names, runtime surface paths, featured card sizes, gem-panel dimensions, and Visual Lab manifest contracts

Default task shape:
- Candidate-only new Theme/library pass unless the user explicitly asks for runtime replacement.
- For production candidate Theme libraries, prefer one stable style id and
  `variant: main`; do not create A/B Theme variant labels unless the user
  explicitly asks for a comparison batch.
- If multiple candidates for the same base style are intentionally kept after
  review, the cleanup/consolidation pass should rename them `<style>-1`,
  `<style>-2`, `<style>-3` by rating/date/source order.
- React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances.
- Do not bake text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable glyphs, UI labels, counters, controls, cards, hover rings, resource icons, or gameplay affordances into generated images.

Prompt manifest must include:
- stable prompt id
- slot
- style/theme
- variant
- target dimensions and aspect ratio
- planned archive path
- exact project constraints from inspected files
- overlay/readability constraints
- avoid list
- worker assignment grouping, if workers are authorized

Expected asset slots, unless current code/docs say otherwise:
- shell-background
- player-zone-p1
- player-zone-p2
- gem-panel
- market-card-back-l1
- market-card-back-l2
- market-card-back-l3
- royal-card-back

Known dimension contracts to verify against current code/docs before use:
- featured market and royal card sample canvas: 1086x1448
- shell background: 3840x1640
- player-zone-p1/player-zone-p2: 1920x520
- gem panel: 1254x1254
- market-card-back-l1/l2/l3: 1086x1448
- royal-card-back: 1086x1448

Deliverables:
- prompt manifest under docs/art/ with a date and batch name
- archived candidates under assets/art-library/<batch-name>/<date>/
- scoring/selection document under docs/art/
- validation summary
- git status summary

Validation:
- count archived files
- verify dimensions for every archived PNG
- verify source generated-image paths are recorded
- verify planned archive paths exist
- run git status --short

Stop condition:
Stop and report before modifying runtime assets, deleting files, adding dependencies, using CLI/API fallbacks, committing, or widening the task beyond the approved batch.
```
