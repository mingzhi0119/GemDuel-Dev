# Demo Script

## 2-Minute Demo

1. Open the project README and package scripts.
    - Show this is a pnpm/Turborepo React + TypeScript + Electron monorepo.
    - Evidence: E001.

2. Show Replay vNext docs and source.
    - Open `docs/guides/replay-vnext.md`.
    - Open `packages/shared/src/replay/writer.ts`.
    - Say: "Replay files capture gameplay data, final-state hashes, summaries, and auditable metadata."
    - Evidence: E003.

3. Show replay roundtrip test.
    - Open `apps/desktop/src/__tests__/replayRoundtrip.test.tsx`.
    - Highlight the completed replay import/sweep/re-export test.
    - Evidence: E004.

4. Show Visual Lab.
    - Run the renderer if doing a live demo: `pnpm dev` from repo root when `pnpm` is on PATH, then visit `http://localhost:5173/?visualLab=surfaces`.
    - Show candidate review, rating, and comment surfaces.
    - Evidence: E007.

5. Close with verification honesty.
    - Show `portfolio/evidence-ledger.md`.
    - Say: "Current typechecks and several governance checks pass; full test runs need seal-exclusion review renewal before I would claim green certification."
    - Evidence: E008.

## 5-Minute Technical Walkthrough

1. Architecture and boundaries.
    - Files: `README.md`, `docs/governance/architecture-layer-map.md`, `docs/governance/boundary-inventory.md`.
    - Explain why shared logic is separate from Electron/UI.
    - Evidence: E001, E006.

2. Replay implementation.
    - Files: `packages/shared/src/replay/writer.ts`, `packages/shared/src/replay/schema.ts`, `packages/shared/src/replay/simulation.ts`, `packages/shared/src/replay/audit.ts`.
    - Explain schema validation, final-state hashes, AI replay generation, and audit output.
    - Evidence: E003.

3. Replay UI and network sync.
    - Files: `apps/desktop/src/__tests__/replayRoundtrip.test.tsx`, `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts`.
    - Explain replay import/export and full/delta sync safeguards.
    - Evidence: E004, E005.

4. Dev tooling and governance.
    - Files: `apps/desktop/vite.config.ts`, `apps/desktop/src/app/visual-lab`, `tools/scripts`.
    - Explain Visual Lab review state, architecture/boundary checks, desktop governance, and release-health checks.
    - Evidence: E006, E007.

5. Truthful close.
    - State what is proven and what is not: no production users, no completed Unity migration on `main`, no full green certification today.
    - Evidence: E008, E009.
