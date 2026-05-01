# OMX Visual Lab Cleanup Replacement Template

Use this template for Visual Lab asset cleanup and replacement planning. Because
it generates replacement images/assets, it is also bound to the
`imagegen-asset-library-flow` skill.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL through the full OMX CLI runtime.

Goal:
Run a bounded Visual Lab surface cleanup/replacement pass for selected candidate assets.

Required skill binding:
Before planning, generating, collecting, normalizing, replacing, or documenting any image or asset, you MUST open and follow:
/mnt/c/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md

This is mandatory for every image/asset generation task in this repo. Workers may use only the imagegen skill and built-in image_gen tool. Workers must not edit repo files, copy files into the workspace, or make code changes. Main Agent owns manifest creation, output collection, normalization, archive/replacement writes, reports, and validation.

Hard limits:
- Do not touch source code unless the user explicitly adds an implementation phase.
- Do not modify runtime assets unless the selected Visual Lab plan explicitly targets runtime replacement and the user approves that phase.
- Do not delete existing candidates without a backup/report phase.
- Do not add dependencies.
- Do not run omx setup/update/uninstall.
- Do not commit.
- Do not use CLI/API image-generation fallbacks unless explicitly confirmed.

Read first:
- AGENTS.md
- docs/omx-workflow.md
- docs/art/visual-lab-surface-cleanup-prompts-2026-04-30.md
- latest docs/art/visual-lab-review-plans/*/surface-review-plan.md
- latest docs/art/visual-lab-review-plans/*/surface-review-plan.json
- latest docs/art/visual-lab-review-plans/*/surface-review-worker-prompt-manifest.md
- tools/scripts/visual-lab-surface-review.mjs
- tools/scripts/visual-lab-surface-review-plan-core.mjs
- tools/scripts/visual-lab-surface-review-manifest.mjs
- tools/scripts/visual-lab-surface-review-actions.mjs
- apps/desktop/src/app/visual-lab/ files only if the user asks to inspect UI behavior

Phase shape:
P0 Read-only inspection:
- identify the current Visual Lab plan timestamp
- identify selected assets, replacement targets, backup requirements, and rating preservation rules
- run no generation
- modify no files

P1 Prompt manifest:
- produce or update the replacement prompt manifest only
- include prompt id, set id, slot, rating, target dimensions, replacement path, full prompt, and avoid list
- explicitly state that React renders labels, counts, icons, levels, gems, buttons, hover rings, selection state, and gameplay affordances
- do not generate images yet unless the user approved generation in this phase

P2 Generation:
- workers generate only assigned prompts with imagegen + built-in image_gen
- workers return prompt id, prompt text, generated source path, and failures
- workers do not edit repo files

P3 Collection and replacement:
- Main Agent collects from C:\Users\sange\.codex\generated_images or $CODEX_HOME/generated_images
- verify dimensions
- normalize only when needed and record risk
- write backups/replacements only for approved targets
- preserve human ratings in reports

P4 Validation:
- pnpm visual-lab:surface:review:validate
- git status --short
- file count and dimension checks
- inspect backup/replacement reports

Useful commands:
- pnpm visual-lab:surface:review:validate
- pnpm visual-lab:surface:review:prepare-replacements
- pnpm visual-lab:surface:review:apply
- pnpm visual-lab:surface:review:finalize-replacements

Do not run apply/finalize commands unless the user explicitly approves the replacement phase.

Deliverables:
- replacement prompt manifest under docs/art/ or the active visual-lab-review-plans/<timestamp>/ folder
- generated candidate source-path record
- runtime/candidate backup report when replacements are applied
- scorecard or completion report
- git status summary

Stop condition:
Stop and report before runtime replacement, deletion, apply/finalize, dependency changes, code edits, CLI/API image fallbacks, or commit.
```
