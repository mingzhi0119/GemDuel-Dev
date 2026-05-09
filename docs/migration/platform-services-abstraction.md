# Platform Services Abstraction

Last updated: 2026-05-09

GemDuel should avoid coupling gameplay to Steamworks.NET, Epic Online Services, Electron, or Unity
platform APIs. Platform services are adapters around release/runtime capabilities; gameplay rules
remain in the shared action/state/replay contracts.

## IPlatformServices Capabilities

- `Init`: initialize the platform adapter and return capability flags.
- `GetUserId`: return an opaque platform user ID for UI/account display only.
- `IsOverlayAvailable`: report whether overlay interactions are available.
- `UnlockAchievement`: unlock an achievement by a game-defined achievement key.
- `ReadCloudSave`: read a named save payload.
- `WriteCloudSave`: write a named save payload.
- `GetLaunchSource`: report Steam, Epic, LocalDev, direct executable, or unknown launch source.
- `OpenStorePage`: open a platform store page or local fallback URL.
- `Multiplayer capability flags`: report invite, presence, relay, crossplay, and account-linking
  capabilities without choosing gameplay transport inside rules code.

## Adapter Responsibilities

| Adapter          | Responsibility                                                                                                                                        | Must Not Own                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Steam adapter    | Steam init, overlay flag, Steam user ID, achievements, cloud save, launch source, store page, Steam-specific multiplayer capability flags.            | Reducer rules, replay hash, card IDs, save schema migration policy.                |
| Epic adapter     | Epic init, overlay/account capability, Epic user ID, achievements, cloud save, launch source, store page, Epic-specific multiplayer capability flags. | Reducer rules, replay hash, Steam IDs, card IDs, save schema migration policy.     |
| LocalDev adapter | Deterministic no-SDK fallback for local development, tests, and offline builds.                                                                       | Real platform claims, live cloud behavior, live achievements, production identity. |

## Unity C# Interface Draft

```csharp
public enum PlatformLaunchSource
{
    LocalDev,
    Steam,
    Epic,
    DirectExecutable,
    Unknown
}

public sealed record PlatformCapabilities(
    bool Overlay,
    bool Achievements,
    bool CloudSave,
    bool Invites,
    bool Presence,
    bool Relay,
    bool Crossplay
);

public interface IPlatformServices
{
    Task<PlatformCapabilities> Init();
    Task<string?> GetUserId();
    Task<bool> IsOverlayAvailable();
    Task UnlockAchievement(string achievementKey);
    Task<byte[]?> ReadCloudSave(string saveName);
    Task WriteCloudSave(string saveName, byte[] payload);
    Task<PlatformLaunchSource> GetLaunchSource();
    Task OpenStorePage(string pageKey);
    PlatformCapabilities Capabilities { get; }
}
```

This is a documentation stub, not runtime code. Do not add SDK packages or live adapters until the
Unity slice explicitly reaches platform smoke testing.

## Current TypeScript Concept Mapping

| Current Concept            | Location                                                              | Platform-Service Mapping                                                      |
| -------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Runtime config policy      | `packages/shared/src/runtimeConfigPolicy.js`, Electron runtime config | Adapter init/config validation, not gameplay state.                           |
| Release health             | `apps/desktop/electron/releaseHealth.js`, governance scripts          | Platform smoke signals and release readiness evidence.                        |
| Local replay export/import | `apps/desktop/src/app/io/*`, `packages/shared/src/replay/*`           | LocalDev save/replay capability; cloud adapter may sync files later.          |
| Local save/settings        | Desktop runtime and renderer settings flows                           | `ReadCloudSave` / `WriteCloudSave` target schema after save policy is frozen. |
| Network capability         | `packages/shared/src/logic/network*`, desktop hooks                   | Capability flags only; gameplay authority remains in shared protocol rules.   |
| Desktop shell launch       | Electron main/preload/runtime config                                  | `GetLaunchSource`, overlay availability, and platform status surface.         |

## Steam Plus Epic Dual-Launch Concerns

- PC crossplay must be a product decision before network, identity, invites, presence, and review
  work begins.
- Achievement parity needs stable game-defined keys that both adapters map to platform-specific
  achievement IDs.
- Cloud save parity needs one canonical save schema, conflict policy, offline behavior, and user
  recovery path.
- Branch/build upload differs by platform and must stay in release tooling, not gameplay code.
- Overlay availability differs by launch source and should be treated as optional UI capability.
- Store page opening differs by platform and should fall back safely in LocalDev.
- Platform account IDs must never enter replay hashes or gameplay state.

Recheck official Steam and Epic documentation before implementing any platform-specific behavior.

## Test Plan

- LocalDev fake initializes without SDKs and returns deterministic capability flags.
- Adapter contract tests verify all adapters implement the same failure semantics.
- Manual overlay smoke verifies overlay availability from each platform client.
- Manual achievement smoke verifies one test achievement unlock and duplicate unlock behavior.
- Manual cloud smoke verifies write, read, offline launch, conflict, and corrupt payload handling.
- Failure mode matrix covers SDK init failure, unavailable overlay, locked achievement backend,
  cloud quota/error, missing platform client, direct executable launch, and account mismatch.

## Open Questions

- Is the first public launch Steam-only, Epic-only, simultaneous Steam/Epic, or staged?
- Is PC crossplay required for first launch?
- Are achievements required at first launch or acceptable as post-launch?
- Is cloud save required at first launch?
- What privacy disclosures are needed for cloud save, crash logs, telemetry, or account linking?
- Which save schema is canonical for Electron-to-Unity migration?

## Implementation Order

1. Keep LocalDev adapter as the first executable implementation.
2. Add game-defined achievement keys and save names in a platform-neutral registry.
3. Add Unity platform-service interface behind dependency injection.
4. Implement Steam adapter only for private smoke builds.
5. Implement Epic adapter only after dual-store launch requirements are confirmed.
6. Add adapter contract tests and manual smoke reports before advertising platform features.

Manual platform-dashboard decisions remain outside git: app IDs, product IDs, branch/channel
configuration, achievement IDs, cloud-save product setup, partner permissions, and release dates.
