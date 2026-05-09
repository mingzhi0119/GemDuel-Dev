# GemDuel Unity Vertical Slice

This directory is a safe, sidecar Unity skeleton. It is not the production client and does not
replace the current Electron/TypeScript implementation.

## Editor Lock

- Unity Editor: `6000.4.6f1`
- Revision/changeset: `0b051c2e5d54`
- Official release page verified: 2026-05-09
- Required Windows module for release-like local builds: `Windows Build Support (IL2CPP)`
- Unity packages: `com.unity.nuget.newtonsoft-json` and `com.unity.test-framework`

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

## Out Of Scope

- Full gameplay rewrite.
- React UI copy.
- Online or LAN multiplayer.
- Complete AI.
- Complete buff implementation beyond parity fixtures.
- Steamworks.NET or Epic Online Services binaries.
- Real app IDs, secrets, tokens, accounts, or platform configuration.
- Steam Deck Verified claims.

The TypeScript rules engine remains the oracle until Unity passes the replay parity contract.
