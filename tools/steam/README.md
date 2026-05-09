# Steam Tooling Templates

This directory contains non-secret SteamPipe template shapes for future release rehearsals. They are
not ready to upload as-is.

## Rules

- Do not commit real Steam app IDs, depot IDs, branch names that reveal private plans, branch
  passwords, account names, Steam Guard details, build-output paths, SDK binaries, or upload logs.
- Copy templates outside the repository or into an ignored local working directory before filling
  placeholders.
- Recheck current official Steamworks and SteamPipe documentation before using these templates.
- Pair every upload rehearsal with GemDuel release-governance evidence:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm release:check`
    - `pnpm release:artifacts:check`
    - `pnpm release:provenance:check`
    - `pnpm secrets:check`

## Files

- `templates/app_build.vdf.example` shows the app-build shape with placeholder app/build/depot
  references.
- `templates/depot_build_windows.vdf.example` shows a Windows depot content shape with placeholder
  local build paths.

The templates intentionally avoid real identifiers. Keep generated SteamPipe manifests and upload
cache untracked.
