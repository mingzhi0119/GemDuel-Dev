# Steam Release Checklist

Last updated: 2026-05-09

This checklist prepares GemDuel for a future Steam release without adding Steamworks SDK files,
app IDs, credentials, account details, or binary upload artifacts to the repository. The current
Electron/TypeScript client remains the release-governed build until a Unity vertical slice proves
itself against the replay parity contract.

External platform rules in this file are planning placeholders. Recheck the current official
Steamworks documentation before using any timing, asset, review, branch, depot, controller,
Steam Deck, cloud, or achievement requirement for an actual submission.

## Reused GemDuel Gates

- Keep the Windows NSIS release path as the current governed release target.
- Reuse `pnpm release:check`, `pnpm release:artifacts:check`,
  `pnpm release:provenance:check`, `pnpm lifecycle:certify`, and governance artifact export
  before treating a build as store-candidate evidence.
- Keep `pnpm secrets:check` green after editing store docs, build templates, or release notes.
- Use the existing release-health indicators from `docs/governance/release-health-checklist.md`
  as local smoke evidence before any platform upload rehearsal.
- Export retained governance evidence when release behavior, provenance handling, or artifact
  policy changes.

## Store Setup

- Create or confirm Steam partner access outside this repository.
- Keep real Steam app IDs, depot IDs, branch passwords, Steam Guard workflows, and upload
  credentials out of git.
- Record the app name, product identity, supported OS list, age-rating needs, language list,
  privacy contact, support contact, and release owner in the private platform tracker.
- Confirm whether the first public target is full release, demo, playtest, or Early Access.
- Recheck current Steamworks store, review, Coming Soon, tax, payment, and partner rules in the
  official documentation before starting store submission.

## Store Metadata

- Prepare short description, long description, feature bullets, genre tags, language support,
  system requirements, controller notes, accessibility notes, and content disclosures.
- Keep player-facing terminology aligned with `packages/shared/src/lexicon/index.ts`.
- Do not copy archived migration/audit language directly into the store page; turn it into
  player-facing product copy.
- Validate that every store checkbox is implemented in the submitted build. Mark unimplemented
  items such as cloud save, achievements, online multiplayer, Steam Input, or controller support
  as future work until verified in the build.
- Recheck current official Steam store metadata rules before submission.

## Assets

- Build a separate store art package for capsules, library assets, icons, screenshots, trailers,
  and press screenshots.
- Track asset provenance for every shipped capsule, screenshot, trailer source, audio source,
  font, card image, gem image, surface image, and generated-art prompt chain.
- Keep third-party references, archived inspiration, and local generation scratch outputs out of
  shipped store assets unless legal review explicitly clears them.
- Verify image dimensions, transparency rules, forbidden text overlays, mature-content handling,
  and trailer requirements against the current official Steamworks asset documentation.

## Legal And Notices

- Prepare public EULA, privacy policy, third-party notices, open-source license notices, asset
  provenance summary, and support/contact text.
- Confirm whether cloud save, telemetry, crash logs, online services, or peer connections change
  privacy disclosures.
- Do not commit account records, tax forms, bank details, partner contracts, reviewer emails,
  or private support credentials.
- Recheck official Steamworks legal, privacy, and data handling requirements before submission.

## Build Upload

- Use `tools/steam/templates/*.vdf.example` as non-secret shape references only.
- Copy templates outside the repo or into an ignored local working folder before replacing
  placeholders with real app/depot IDs.
- Keep build output, SteamPipe cache, manifest outputs, credentials, logs with account names,
  and branch passwords untracked.
- Before upload rehearsal, run the current local gate set:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm release:check`
    - `pnpm release:artifacts:check`
    - `pnpm release:provenance:check`
    - `pnpm secrets:check`
- Recheck current SteamPipe, depot, branch, and build upload instructions in the official
  Steamworks documentation before the first upload.

## Branches And Depots

- Define Windows depot ownership, install directory layout, executable path, launch options,
  redistributables, private test branch policy, beta branch naming, default branch promotion,
  rollback owner, and release freeze window.
- Keep branch passwords, reviewer keys, playtest keys, and tester identities outside git.
- Record each upload with build hash, artifact hash, provenance report path, local gate evidence,
  and platform branch target.
- Recheck current Steam branch/depot behavior before changing public availability.

## Review And Coming Soon

- Plan separate readiness gates for store page review and build review.
- Do not assume old review durations. Recheck current official Steamworks timelines before
  scheduling Coming Soon, review submission, launch, or sale windows.
- Verify that the Coming Soon page, screenshots, trailers, supported features, and build behavior
  describe the same product state.
- Keep the release owner accountable for manual platform-dashboard checks that cannot be proven
  by repository tests.

## Achievements, Cloud, Controller, And Steam Deck

- Draft achievement IDs and names in a private platform tracker before implementing adapters.
- Require achievement parity across Steam, Epic, LocalDev, and any Unity adapter before first
  dual-store release.
- Define cloud save paths, conflict behavior, offline launch behavior, and manual recovery steps
  before enabling cloud save.
- Treat Steam Deck and controller support as separate verification lanes. Recheck current
  Steam Deck and Steam Input documentation before advertising support.
- Do not claim Steam Deck Verified, full controller support, cloud save, overlay, or achievements
  until a platform smoke test proves each claim on the submitted build.

## Crossplay And Multiplayer Risk

- Current online/LAN behavior is not part of the Unity vertical slice.
- If Steam and Epic launch together, decide whether PC crossplay is required before committing
  achievements, invites, cloud save, identity, or network transport assumptions.
- Keep gameplay authority and replay validation in `packages/shared` contracts until a Unity
  implementation passes replay parity.
- Recheck platform rules for crossplay, account linking, overlay behavior, invites, and presence
  before designing public multiplayer features.

## Manual Platform Steps

- Partner account creation and permissions.
- App credit/payment/account setup.
- Store page fields and asset upload.
- Build upload from a secure local or CI environment.
- Private branch tester access.
- Review submission.
- Coming Soon and launch scheduling.
- Final platform smoke checks for install, launch, overlay, save path, achievements, and rollback.
