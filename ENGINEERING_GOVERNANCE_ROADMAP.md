# Engineering Governance Roadmap

This document replaces the active remediation tracker with a broader engineering-governance view.

The archived audit tracker is preserved in `AUDIT_REMEDIATION_TRACKER_ARCHIVED_2026-04-19.md`.

Baseline scores below are the audit snapshot provided on April 19, 2026. The goal of this roadmap is to raise every dimension to at least `8/10`.

Additional expert recommendations were folded into this roadmap after the initial governance draft, especially around a centralized finite-state machine, command validation, strong runtime schemas, and negative-path desktop testing.

Allowed status values:

- `Completed`
- `In Progress`
- `Unstarted`

## Scorecard

| Dimension                             | Audit Baseline | Current After Priority 3 | Target | Status        | Main Governance Gap                                                                                                            |
| ------------------------------------- | -------------: | -----------------------: | -----: | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Correctness                           |           5/10 |                     7/10 |  8/10+ | `In Progress` | The command gate is stronger end to end, but some domain invariants still live in spread-out reducers instead of one engine.   |
| Boundary Security                     |           3/10 |                     8/10 |  8/10+ | `In Progress` | Network ingress is versioned and validated now, but desktop, replay, and storage boundaries still need the same rigor.         |
| State Machine Consistency             |           4/10 |                     8/10 |  8/10+ | `In Progress` | Protocol handlers now depend on the same gate, but the FSM is still not fully declarative for every gameplay subflow.          |
| Online Authority                      |           3/10 |                     8/10 |  8/10+ | `In Progress` | Host authority is now explicit and logged, but ordering, replay, and broader multiplayer resilience still need more coverage.  |
| Electron Security                     |           3/10 |                     6/10 |  8/10+ | `In Progress` | The preload surface is narrowed, but IPC governance and contract tests are still missing.                                      |
| Architecture Layering                 |           4/10 |                     8/10 |  8/10+ | `In Progress` | Large hooks are smaller and cleaner now, but replay, settings, and some UI-only wiring can still be split more deliberately.   |
| Type Contracts                        |           4/10 |                     7/10 |  8/10+ | `In Progress` | Interaction builders are more explicit now, but UI context, modal payloads, and replay/import contracts still need tightening. |
| Test Coverage                         |           5/10 |                     8/10 |  8/10+ | `In Progress` | Pure interaction routing is now covered, but property-based and Electron-level failure coverage are still missing.             |
| Observability / Operations            |           5/10 |                     6/10 |  8/10+ | `Unstarted`   | Logging and updater policy are better, but telemetry, alerting, and release health gates do not exist yet.                     |
| Dependency / Configuration Governance |           4/10 |                     6/10 |  8/10+ | `In Progress` | Sensitive runtime config is better controlled, but vulnerability automation and config ownership remain weak.                  |

## Dimension Summaries

### 1. Correctness

- Status: `In Progress`
- Baseline: `5/10`
- Target: `8/10+`
- Main issue: The game has many rules, but the most important ones are not yet enforced through a single domain-invariant layer.
- Practical path to 8/10+:
- Introduce a centralized finite-state machine (FSM) so the legality of `CURRENT_STATE + ACTION` is decided by one source of truth.
- Create one canonical `domain rules` module for action preconditions and postconditions.
- Move all non-visual rule checks behind reducer-safe command validation at the reducer or middleware boundary.
- Add invariant assertions for impossible states such as invalid turn-owner, illegal phase transitions, and impossible inventory totals.
- Add a global error-handling path so illegal payloads are rejected, reported, and optionally rolled back before they corrupt state.
- Introduce deterministic scenario fixtures for setup, drafting, reserve, buy, and endgame paths.
- Success metric:
- No core action may depend on UI-only guards to remain valid.
- Each rule-heavy action must have one negative-path reducer test and one scenario-level integration test.

### 2. Boundary Security

- Status: `In Progress`
- Baseline: `3/10`
- Target: `8/10+`
- Main issue: Input validation is better than before, but the project still lacks a single governance rule for “all external input is hostile.”
- Practical path to 8/10+:
- Define explicit trust boundaries for renderer, network peer, replay import, Electron runtime config, and local persistence.
- Require schema validation for every boundary-crossing payload before it reaches state mutation, ideally with one reusable schema toolchain such as `Zod` or `TypeBox`.
- Add invariant-preserving sanitizers for imported replay files and runtime config blobs.
- Introduce a dedicated `CommandValidator` layer so all network-originated payloads are validated for role, phase, and permission before reducer access.
- Introduce a small security regression suite that runs on every pull request.
- Success metric:
- Every external entry point maps to a documented validator.
- No unchecked external object is allowed to reach reducer mutation handlers.

### 3. State Machine Consistency

- Status: `In Progress`
- Baseline: `4/10`
- Target: `8/10+`
- Main issue: `turn` and `phase` ownership still span multiple layers, which raises drift and maintenance cost.
- Practical path to 8/10+:
- Define a formal action-to-phase matrix and store it in code, not only in UI behavior.
- Back the transition matrix with a centralized FSM that owns phase changes, turn rotation, and recovery transitions.
- Make reducer branches consume normalized commands instead of raw UI actions where possible.
- Add an illegal-state fallback path so reducers fail closed instead of partially mutating.
- Add a transition-coverage test matrix for every phase-sensitive action.
- Success metric:
- A single source of truth exists for legal transitions.
- Protocol handlers, UI handlers, and reducer logic all depend on the same transition contract.

### 4. Online Authority

- Status: `In Progress`
- Baseline: `3/10`
- Target: `8/10+`
- Main issue: The online model is safer now, but host authority is still too intertwined with generic gameplay dispatch.
- Practical path to 8/10+:
- Separate online intent messages from local reducer actions.
- Introduce protocol versioning and command categories such as `bootstrap`, `intent`, `sync`, and `recovery`.
- Enforce the principle of least privilege so guest-originated requests must match an explicit host-side permission table.
- Route every network action through `CommandValidator` before host approval.
- Add replayable host-side approval logs for guest intents.
- Build explicit desync-recovery tests for stale checksums, late syncs, and invalid retries.
- Success metric:
- Guests can only send approved intent commands, never reducer-ready mutations.
- Recovery behavior is deterministic and covered by automated tests.

### 5. Electron Security

- Status: `In Progress`
- Baseline: `3/10`
- Target: `8/10+`
- Main issue: The raw bridge issue is fixed, but desktop hardening still lacks governance artifacts and automated verification.
- Practical path to 8/10+:
- Maintain a documented IPC allowlist with ownership and threat notes per channel.
- Expose only named bridge functions through `contextBridge.exposeInMainWorld`, never generic `ipcRenderer.send`.
- Validate sender identity and authorization in the main process for privileged desktop actions.
- Add preload-contract tests to ensure only intended APIs are exposed to the renderer.
- Validate runtime desktop configuration payloads at the main-process boundary.
- Add release checks for `contextIsolation`, `nodeIntegration`, updater policy, and preload surface changes.
- Success metric:
- Every exposed Electron API is documented, tested, and intentionally versioned.
- Desktop release reviews fail if a new renderer capability is added without an allowlist update.

### 6. Architecture Layering

- Status: `In Progress`
- Baseline: `4/10`
- Target: `8/10+`
- Main issue: Hooks still mix UI intent building, orchestration, state rules, replay logic, and network concerns.
- Practical path to 8/10+:
- Separate “compute” from “view”: keep complex business logic in pure functions or classes, and let hooks focus on orchestration and UI wiring.
- Split `useGameInteractions` into smaller units such as setup orchestration, board intents, market intents, and debug tooling.
- Prefer domain-specific hooks such as `usePlayer`, `useConnection`, and `useUIStatus` over broad catch-all gameplay hooks.
- Keep `useGameLogic` as a thin composition root rather than a behavior owner.
- Move reducer-independent orchestration into pure modules that are testable without React.
- Introduce a layer map in documentation so new code follows the intended boundaries.
- Success metric:
- No single gameplay hook should own more than one orchestration concern plus local UI state.
- Most business logic becomes testable without mounting React.

### 7. Type Contracts

- Status: `In Progress`
- Baseline: `4/10`
- Target: `8/10+`
- Main issue: Setup and draft flows improved, but several flexible UI and state contracts are still too broad.
- Practical path to 8/10+:
- Validate incoming runtime data with `Zod` or `TypeBox` at the system boundary, then rely on TypeScript for the internal happy path.
- Replace loose UI context maps with explicit typed context objects.
- Narrow modal payloads, market card callbacks, and replay import contracts.
- Add type-level tests or compile-only fixtures for critical action payloads.
- Prefer discriminated unions over ad hoc wide unions so a `type` field narrows the full logic path.
- Success metric:
- The most important runtime shapes are all represented by named DTOs.
- Broad `Record<string, unknown>` usage is limited to intentionally generic extension points.

### 8. Test Coverage

- Status: `In Progress`
- Baseline: `5/10`
- Target: `8/10+`
- Main issue: The suite is stronger than before, but it still under-represents failure, recovery, and desktop-specific behavior.
- Practical path to 8/10+:
- Add a governance-owned negative-path matrix for reducer, protocol, replay import, updater, and runtime config handling.
- Add property-based testing with `fast-check` to generate malformed coordinates, payloads, and state-transition edge cases against the FSM and reducer boundary.
- Add contract tests for preload exposure and Electron runtime config parsing.
- Introduce scenario tests for desync recovery, protocol rejection, and invalid replay files.
- Add `Playwright for Electron` coverage for IPC failure, network interruption, updater edge cases, and desktop-only negative flows.
- Track branch coverage for rule-heavy reducers, not just test count.
- Success metric:
- Every boundary has at least one malformed-input test.
- Every phase-sensitive reducer branch has both happy-path and rejection coverage.

### 9. Observability / Operations

- Status: `Unstarted`
- Baseline: `5/10`
- Target: `8/10+`
- Main issue: The project has logs and an updater, but not an operational discipline.
- Practical path to 8/10+:
- Define release-health telemetry for startup, updater, peer connection, sync recovery, and fatal reducer rejection events.
- Standardize log structure and severity so production logs are searchable and actionable.
- Add a lightweight release checklist for desktop builds, network features, and protocol changes.
- Track failure-rate indicators for updater, connection setup, and sync recovery.
- Success metric:
- Releases have observable health indicators.
- Production logs provide enough signal to diagnose startup, update, and network failures.

### 10. Dependency / Configuration Governance

- Status: `In Progress`
- Baseline: `4/10`
- Target: `8/10+`
- Main issue: Sensitive client configuration improved, but dependency risk review and config ownership are still reactive.
- Practical path to 8/10+:
- Add scheduled dependency audit checks and assign ownership for production vulnerabilities.
- Create a runtime configuration policy covering defaults, validation, secrets, and environment-specific overrides.
- Replace static relay credentials with server-issued short-lived TURN credentials after client authentication.
- Maintain an approved dependency list for security-sensitive libraries such as Electron, PeerJS, and updater-related packages.
- Use `npm overrides` or `yarn resolutions` aggressively for production vulnerability remediation when upstream lag exists, and replace libraries when patching is not viable.
- Add a change-review checklist for new environment variables and desktop runtime flags.
- Success metric:
- Production dependency risk is tracked continuously, not manually.
- Every runtime config value has a documented owner, default, and validation rule.

## Priority-Ordered Governance Work

### Priority 1. Central FSM and Domain Command Gate

- Status: `Completed`
- Why this comes first: This is the highest-leverage step for correctness, state-machine consistency, and boundary safety.
- Deliverables:
- Build a centralized FSM that owns legal transitions for phase, turn, and recovery.
- Build one action-policy matrix covering phase, turn, ownership, and payload requirements.
- Make reducer or middleware validation the final source of truth instead of UI affordances.
- Add reducer invariant assertions, illegal-state fallback behavior, and failure tests.
- Completed in this phase:
- Added a centralized FSM policy module for allowed `from` and `to` phases.
- Routed reducer entry through a shared command gate before any mutation runs.
- Added post-mutation FSM validation and rollback to the previous state on illegal transitions.
- Added snapshot-integrity validation for bootstrap and sync payloads.
- Added dedicated tests for command-gate rejection, snapshot rejection, and impossible transition rollback.
- Raises: `Correctness`, `Boundary Security`, `State Machine Consistency`

### Priority 2. Protocol Decoupling and Authority Contract v2

- Status: `Completed`
- Why this comes second: The current online layer is safer, but it still reuses local action shapes too directly.
- Deliverables:
- Introduce distinct protocol DTOs for guest intent, host approval, sync, and recovery.
- Add a host-side permission table and `CommandValidator` for all network-originated commands.
- Add protocol versioning and recovery test fixtures.
- Separate host approval logging from reducer application.
- Completed in this phase:
- Added protocol v2 DTOs for bootstrap, guest intent, host decision, sync, recovery, and heartbeat traffic.
- Removed reducer `GameAction` from the wire contract and translated intents at the network boundary instead.
- Added host approval logging plus explicit approval and rejection responses for guest requests.
- Added checksum-backed guest verification and recovery-request handling for suspicious or stale approvals.
- Added protocol parser, direction-hardening, authority, and recovery tests.
- Raises: `Online Authority`, `Boundary Security`, `Test Coverage`

### Priority 3. Hook and Orchestration Decomposition

- Status: `Completed`
- Why this comes third: Architecture debt now limits how safely the next features can be added.
- Deliverables:
- Split `useGameInteractions` into smaller concern-specific hooks or pure orchestrators.
- Keep `useGameLogic` as a composition layer only.
- Extract replay orchestration and debug tooling out of gameplay hooks.
- Completed in this phase:
- Split gameplay interaction wiring into smaller board, market, meta, debug, and transient-feedback hooks.
- Moved reducer-independent interaction branching into pure helpers for access control, command building, and history-flattening decisions.
- Kept `useGameLogic` as a thinner composition root by moving online-safe history controls into their own hook.
- Added pure regression tests for interaction access, interaction command builders, and history-flattening decisions.
- Raises: `Architecture Layering`, `Correctness`, `Type Contracts`

### Priority 4. Type Contract Tightening Outside Bootstrap Flows

- Status: `Unstarted`
- Why this comes fourth: The setup path is better, but the rest of the UI and modal surface is still too loose.
- Deliverables:
- Standardize runtime schema validation with `Zod` or `TypeBox` at system ingress points.
- Narrow modal payloads, card callback context, replay file contracts, and imported data DTOs.
- Remove avoidable `Record<string, unknown>` usage in UI-to-domain seams.
- Convert remaining broad unions into discriminated unions where command type determines the logic path.
- Add compile-only fixtures for critical contracts.
- Raises: `Type Contracts`, `Boundary Security`, `Correctness`

### Priority 5. Governance-Owned Negative-Path Test Matrix

- Status: `In Progress`
- Why this comes fifth: The project now needs coverage discipline, not only more tests.
- Deliverables:
- Define a matrix for malformed inputs, illegal transitions, protocol violations, recovery paths, and Electron config failures.
- Add `fast-check` property-based tests for coordinates, payloads, and invalid transition generation.
- Add preload-surface and runtime-config parsing tests.
- Add `Playwright for Electron` scenarios for IPC failure, network interruption, and updater edge cases.
- Track branch coverage on rule-heavy reducers.
- Raises: `Test Coverage`, `Electron Security`, `Online Authority`

### Priority 6. Desktop Security and IPC Governance Pack

- Status: `Unstarted`
- Why this matters: Electron security improves most when capability exposure is treated as a governed interface.
- Deliverables:
- Maintain an IPC allowlist document and contract tests.
- Add release-time checks for desktop security flags and preload changes.
- Validate all main-process runtime inputs using the same policy as other trust boundaries.
- Raises: `Electron Security`, `Boundary Security`, `Observability / Operations`

### Priority 7. Release Observability Baseline

- Status: `Unstarted`
- Why this matters: Once the core logic is safer, the next biggest gap is supportability in production.
- Deliverables:
- Add structured release-health logging for updater, startup, peer connection, and recovery flows.
- Define failure-rate indicators and a release checklist.
- Decide what must be visible in logs and what must be redacted.
- Raises: `Observability / Operations`, `Dependency / Configuration Governance`

### Priority 8. Dependency and Runtime Configuration Governance

- Status: `Unstarted`
- Why this matters: Security and stability will regress unless dependency review and config discipline become routine.
- Deliverables:
- Add automated production dependency audits.
- Document runtime config ownership, validation, and secret handling.
- Replace runtime relay configuration with authenticated short-lived TURN credential delivery when backend support exists.
- Use `npm overrides` or `yarn resolutions` to force critical production security patches when upstream packages lag.
- Review and reduce production dependency vulnerability exposure.
- Raises: `Dependency / Configuration Governance`, `Observability / Operations`

## Already Completed Foundations

These items are already done and should be treated as governance prerequisites, not future work:

- Status: `Completed` - Runtime validation now protects network messages and core action payloads.
- Status: `Completed` - Host authority was tightened with guest allowlists and reducer-side rejection rules.
- Status: `Completed` - A centralized FSM policy and reducer command gate now govern phase legality and illegal-state rollback.
- Status: `Completed` - Protocol v2 now separates bootstrap, guest intent, host approval, sync, and recovery from reducer-ready local actions.
- Status: `Completed` - Gameplay interaction orchestration is now split across smaller hooks and pure decision helpers instead of one monolithic hook.
- Status: `Completed` - The preload bridge now exposes a narrow Electron API instead of raw IPC primitives.
- Status: `Completed` - Production updater policy and runtime ICE injection are now safer than the original audit baseline.
- Status: `Completed` - Setup and draft bootstrap flows now use named DTOs instead of wide untyped payloads.

## Definition of Done for 8/10+

The roadmap should be considered successful only when all of the following are true:

- Status: `Unstarted` - Every trust boundary has documented validation ownership.
- Status: `Unstarted` - Every phase-sensitive action is backed by a canonical transition policy.
- Status: `Unstarted` - Online protocol messages are separated from reducer-ready local actions.
- Status: `Unstarted` - Large gameplay hooks are reduced to orchestration-only roles.
- Status: `Unstarted` - Electron IPC exposure is contract-tested and allowlisted.
- Status: `Unstarted` - Negative-path coverage exists for reducer, protocol, replay, updater, and runtime config boundaries.
- Status: `Unstarted` - Production dependency and runtime configuration governance run continuously, not manually.
