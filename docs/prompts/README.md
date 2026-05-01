# OMX Managed Prompt Templates

This directory contains active, copy-ready prompt templates for OMX/Codex work in
Gem Duel. Historical prompts and batch evidence remain in `docs/archive/` and
`docs/art/`; this directory is for reusable operating templates.

## Templates

- [Independent Audit Template](omx-independent-audit-template.md)
- [Long Surface Asset Generation Template](omx-long-surface-asset-generation-template.md)
- [Visual Lab Cleanup Replacement Template](omx-visual-lab-cleanup-template.md)

## Rules

- Use these prompts from `/home/sange/projects/GemDuel-Dev` in WSL.
- Use `pnpm` from the repo root.
- Do not commit unless the user explicitly asks and the relevant gates pass.
- Do not use `--madmax`, `--yolo`, broad hooks, global setup/update, file deletion,
  or dependency additions unless the user explicitly authorizes that risk.
- Any prompt that generates images or assets must require the
  `imagegen-asset-library-flow` skill before planning or generation.
