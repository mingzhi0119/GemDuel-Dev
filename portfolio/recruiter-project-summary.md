# Recruiter Project Summary

GemDuel is a React, TypeScript, and Electron strategy-game project organized as a pnpm/Turborepo monorepo, with separate workspaces for the desktop app, shared game/domain logic, reusable UI, TURN service code, and governance tooling. My strongest work centers on making the project easier to verify and review: Replay VNext adds schema validation, replay read/write paths, final-state hashing, summaries, simulation support, and audit tooling for repeatable gameplay checks. The desktop UI also includes replay roundtrip coverage for importing a completed replay, navigating replay history, and re-exporting valid Replay VNext JSON.

I also built Visual Lab, a developer-only review workflow for surface/theme candidates with asset loading, persistent ratings, comments, shared review state, and route-level regression coverage. Around the repo, governance scripts check architecture budgets, package boundaries, Electron IPC policy, dependency health, release checks, and evidence artifacts.

Current verification is intentionally documented with caveats: direct workspace typechecks and several governance checks pass, but full test certification still needs seal-exclusion review renewal. Unity work is represented as staged migration planning and remote parity-candidate evidence, not a completed migration. `[E001, E002, E003, E004, E006, E007, E008, E009]`
