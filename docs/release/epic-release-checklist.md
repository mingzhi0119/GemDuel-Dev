# Epic Games Store Release Checklist

Last updated: 2026-05-09

This checklist prepares GemDuel for a possible Epic Games Store release without committing Epic
Online Services SDK files, store credentials, organization identifiers, product IDs, secrets,
tokens, or upload artifacts. The first pass is documentation and safety planning only.

External platform rules in this file are planning placeholders. Recheck the current official Epic
Games Store and Epic Online Services documentation before using any store, review, upload, asset,
achievement, cloud save, overlay, crossplay, or account-linking requirement for a real submission.

## Reused GemDuel Gates

- Keep the existing Electron/Windows release governance as the current proof surface.
- Reuse `pnpm release:check`, `pnpm release:artifacts:check`,
  `pnpm release:provenance:check`, `pnpm lifecycle:certify`, and governance artifacts before
  treating a build as store-candidate evidence.
- Run `pnpm secrets:check` after editing any platform documentation, upload template, or release
  checklist.
- Keep platform-specific SDK decisions outside `packages/shared`; gameplay rules must remain pure.

## Store Setup

- Create or confirm Epic developer organization access outside this repository.
- Keep organization IDs, product IDs, sandbox IDs, deployment IDs, client IDs, client secrets,
  private keys, and upload credentials out of git.
- Decide whether Epic is first launch, simultaneous launch with Steam, or post-Steam follow-up.
- Record store owner, build owner, support contact, privacy contact, and release decision owner in
  a private tracker.
- Recheck current official Epic onboarding, account, product, review, tax, and payout
  documentation before store submission.

## Store Metadata

- Prepare product name, short description, long description, feature list, genre/category tags,
  supported OS list, language list, system requirements, content disclosures, support URL, privacy
  URL, and EULA URL.
- Keep player-facing terms aligned with the shared lexicon. Do not hand-maintain a separate
  glossary for store copy.
- Do not advertise achievements, cloud save, online multiplayer, controller support, overlay, or
  crossplay until the submitted build proves those features.
- Recheck current Epic store metadata and page-content requirements before submission.

## Assets

- Prepare a store-facing asset pack that is separate from runtime card, gem, and surface assets.
- Track source, license, generated-art prompt, reviewer, and final export path for every store
  image, video, icon, screenshot, and trailer source.
- Run an IP/originality review before uploading assets that derive from archived references,
  tabletop/card-list references, or generated character/style exploration.
- Recheck current official Epic asset size, format, branding, and trailer requirements before
  upload.

## Legal And Notices

- Prepare public EULA, privacy policy, third-party notices, open-source notices, asset provenance
  summary, and support/contact text.
- Confirm whether Epic overlay, achievements, cloud save, telemetry, crash reports, peer
  networking, or account linking change privacy disclosures.
- Do not commit partner contracts, account records, reviewer conversations, tax records, or
  private legal documents.
- Recheck current Epic legal, privacy, and data handling requirements before submission.

## Build Upload

- Define the upload path outside this repository. Do not commit launcher cache, upload logs with
  account data, credentials, product IDs, or generated manifests that reveal private configuration.
- Pair each uploaded build with local artifact hash, release provenance report, release-health
  evidence, and platform sandbox/channel target.
- Before upload rehearsal, run the current local gate set:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm release:check`
    - `pnpm release:artifacts:check`
    - `pnpm release:provenance:check`
    - `pnpm secrets:check`
- Recheck current official Epic build, artifact, sandbox, and deployment upload documentation
  before the first upload.

## Sandboxes, Channels, And Review

- Define private test sandbox/channel names, promotion policy, rollback owner, tester access,
  release freeze window, and default-live promotion criteria.
- Keep tester identities, access tokens, private keys, deployment IDs, and channel secrets out of
  git.
- Do not assume review durations or launch scheduling rules. Recheck current official Epic review
  and release documentation before planning public dates.

## Achievements, Cloud, Overlay, And Crossplay

- Draft achievement IDs, names, hidden/public flags, and unlock semantics in a private platform
  tracker.
- Require achievement parity with Steam and LocalDev before a dual-platform launch.
- Define cloud save paths, conflict resolution, offline launch behavior, migration from local
  saves, and user-visible failure handling before enabling cloud save.
- Treat overlay availability, account identity, invites, presence, and multiplayer capability flags
  as adapter outputs, not gameplay dependencies.
- Recheck current Epic Online Services documentation before implementing or advertising any of
  these capabilities.

## Steam Plus Epic First-Launch Risks

- Decide whether PC crossplay is required at launch. This affects identity, matchmaking,
  achievements, cloud save, invites, and platform review scope.
- Avoid binding gameplay rules to either Steamworks.NET or EOS. Use the platform service
  abstraction in `docs/migration/platform-services-abstraction.md`.
- Do not mix Steam and Epic identifiers into replay or state-hash contracts.
- Keep platform-specific launch, overlay, achievement, and save behavior outside
  `packages/shared`.

## Manual Platform Steps

- Developer organization setup and permissions.
- Store page fields and asset upload.
- Build upload from a secure local or CI environment.
- Sandbox/channel tester access.
- Review submission.
- Launch scheduling.
- Final platform smoke checks for install, launch, overlay, save path, achievements, cloud save,
  and rollback.
