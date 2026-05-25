# Screenshot Plan

| Screenshot ID | What to capture                                   | What it proves                                                | Where/how to capture                                                                                                      | Related evidence |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| S001          | Start screen or main desktop renderer shell       | The React/Electron renderer loads and presents the game shell | Run renderer, open `http://localhost:5173/` in browser                                                                    | E001             |
| S002          | Replay menu after importing a completed replay    | The app exposes replay review controls                        | Use replay fixture from `apps/desktop/src/__tests__/fixtures/replayRoundtripFixtures.ts` or a generated Replay VNext JSON | E004             |
| S003          | Replay at first and last step                     | Replay navigation updates visible game state                  | Import replay, click undo/redo controls through history                                                                   | E004             |
| S004          | Visual Lab Surfaces route                         | Visual Lab loads candidate/theme tooling                      | Open `http://localhost:5173/?visualLab=surfaces` in dev mode                                                              | E007             |
| S005          | Visual Lab rating/comment controls                | Ratings/comments are part of the review UI                    | In Surfaces mode, select a style and show rating/comment panel                                                            | E007             |
| S006          | Architecture/boundary check terminal output       | Governance checks are runnable locally                        | Capture `pnpm --dir tools/scripts architecture:check` and `boundaries:check` output                                       | E006, E008       |
| S007          | Current failure summary for seal-exclusion review | Verification is truthful about current gaps                   | Capture failing `tools/scripts test` summary or generated lifecycle failure summary                                       | E008             |
| S008          | Unity migration docs, not branch UI               | Unity migration is documented as staged, not complete         | Open `docs/archive/audits/unity-migration-suitability-assessment-2026-05-04.md` and roadmap sections                      | E009             |

## Missing Visual Evidence

- Browser screenshot of replay import/re-export flow.
- Browser screenshot of Visual Lab with candidate ratings and comments.
- Terminal screenshot after renewing seal-exclusion reviews and re-running full tests.
- Separate worktree screenshot or logs for Unity branch verification, if using Unity claims.
