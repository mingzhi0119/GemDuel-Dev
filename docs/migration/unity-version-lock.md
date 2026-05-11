# Unity Version Lock

Last updated: 2026-05-11

The Unity project is pinned to a concrete editor version so Codex, Unity Hub, and manual reviewers
all target the same project state. Previous sidecar-prototype language is superseded by
`docs/migration/unity-migration-governance.md`; this lock now supports full Unity migration
execution and release-candidate validation.

## Current Lock

- Unity stream: Unity 6.4 release line.
- Editor version in `clients/unity/ProjectSettings/ProjectVersion.txt`: `6000.4.6f1`.
- Editor revision/changeset: `0b051c2e5d54`.
- Official Unity release page verified: 2026-05-09.
- Official Unity release date for this editor: 2026-05-05.
- First target build profile: Windows desktop.
- Required Unity module for release-like local Windows builds: `Windows Build Support (IL2CPP)`.
- Package manifest: intentionally minimal, currently limited to Unity official
  `com.unity.nuget.newtonsoft-json` and `com.unity.test-framework`.
- Package lock: `clients/unity/Packages/packages-lock.json` records the resolved Unity Test
  Framework, NUnit extension, Newtonsoft JSON, IMGUI, and JSON serialization packages.

Recheck current official Unity editor, licensing, platform module, and long-term-support guidance
before upgrading away from this version. The checked official release page for this lock is
<https://unity.com/releases/editor/whats-new/6000.4.6f1>.

The Unity 6000.4.6f1 release notes list Unity platform toolkit packages among upstream package
changes, but this repository must not add Steamworks.NET, Epic Online Services, Unity Platform
Toolkit packages, analytics, crash reporting, or platform SDK adapters until a separate platform
dependency review approves them.

## Upgrade Rules

- Do not upgrade Unity as part of gameplay-rule work.
- Record any future editor version, Unity Hub module list, Windows build support module, and
  package manifest diff in this file before changing the lock.
- Keep generated `Library/`, `Temp/`, `Obj/`, `Logs/`, `UserSettings/`, and `Builds/` out of git.
- Do not add Steamworks.NET, EOS, analytics, crash reporting, addressables, input packages, or
  render-pipeline packages until the full-migration gate explicitly needs them and a dependency
  review is complete.

## Acceptance Evidence

The first Unity open after this lock should confirm:

- exact Unity editor version and revision: `6000.4.6f1 (0b051c2e5d54)`;
- installed platform modules, especially Windows Build Support (IL2CPP);
- package manifest and package lock remain limited to approved Unity packages;
- local OS used for the first open;
- confirmation that no generated cache directories were committed;
- replay fixture verifier status from `tools/migration/verify-replay-parity.ts`.
