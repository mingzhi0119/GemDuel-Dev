# GemDuel Unity Client Candidate

This directory is a safe, sidecar Unity client candidate. It is parity-gated against the current
Electron renderer and may be treated as an Electron replacement candidate only when the
Electron/Unity parity harness reports `22 Equivalent / 0 Failing / 0 Blocker` and the repository
gates pass.

## Editor Lock

- Unity Editor: `6000.4.6f1`
- Revision/changeset: `0b051c2e5d54`
- Official release page verified: 2026-05-09
- Required Windows module for release-like local builds: `Windows Build Support (IL2CPP)`
- Unity packages: `com.unity.nuget.newtonsoft-json` and `com.unity.test-framework`

## Repository Hygiene

Keep Unity source identity files in git:

- `Assets/**/*.meta`
- `ProjectSettings/*.asset`
- `ProjectSettings/ProjectVersion.txt`

Keep generated local/editor output untracked:

- `Library/`
- `Temp/`
- `Obj/`
- `Logs/`
- `UserSettings/`
- `Builds/`
- `artifacts/`

Windows Unity cannot open this sidecar directly from a WSL ext4 case-sensitive checkout. For local
Unity validation, use a temporary NTFS mirror such as
`C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev`; keep that mirror and all generated Unity
outputs untracked.

## Scope

- Windows build target only.
- 5x5 GemBoard.
- Local PvP.
- Buy, reserve, royal selection, and game-over flow.
- Concept placeholders for SteamAPI init, overlay availability, a test achievement, and local save
  path.
- Replay fixture reading against `fixtures/replay-golden/manifest.json`.

## Current Interaction Status

The current scene implements the Electron/Unity parity matrix as a full local PvP replacement
candidate surface: app shell, local start, board, market, market preview, buy/reserve confirmation,
player zones, replenish/end-turn state, royal featured display, settings, and invalid-action
feedback are all captured by the parity harness. Normal take-gems clicks can select any legal
non-gold board line and immediately update the board plus active player's inventory; the committed
fixture path remains the deterministic oracle for parity-critical revisions.

`Space` still advances the replay fixture as a debug/parity review path. The TypeScript shared rules
engine remains the gameplay oracle, and Unity parity-critical transitions are constrained by replay
checkpoints and semantic automation rather than hand-maintained subjective rule rewrites.

## Out Of Scope

- React UI copy.
- Online or LAN multiplayer.
- Complete AI.
- Complete buff implementation beyond parity fixtures.
- Steamworks.NET or Epic Online Services binaries.
- Real app IDs, secrets, tokens, accounts, or platform configuration.
- Steam Deck Verified claims.

The TypeScript rules engine remains the oracle for gameplay behavior.
