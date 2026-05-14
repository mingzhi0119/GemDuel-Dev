# Local PVP Unity Remaining Migration Summary

Date: 2026-05-13

Status: Local PVP has strong rules-bridge and bounded built-player evidence, but it is not yet a
complete Electron-to-Unity product migration. This document is a document-only handoff for the next
Codex run. It does not change implementation, assets, tests, or generated artifacts.

## Source Inputs

- `AGENTS.md`
- `docs/migration/unity-migration-governance.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `artifacts/electron-unity-parity/local-pvp-simulation-100/2026-05-13T-local-pvp-sim100/local-pvp-simulation-parity-suite-report.json`
- `artifacts/electron-unity-parity/local-pvp-simulation-100/2026-05-13T-local-pvp-sim100/local-pvp-simulation-parity-suite-report.html`
- `artifacts/unity/editmode/drag-selection-results-noquit.xml`

Electron remains the Local PVP product standard for semantics, interaction, visual hierarchy,
accessibility, and UX. Unity may use Unity-native rendering/input only when the observed Electron
behavior is preserved.

## What Is Already Proven

- TypeScript rules/oracle remains the gameplay authority.
- Unity live LocalDev paths can route many Local PVP actions through the rules bridge.
- Focused Unity EditMode evidence exists for rules bridge, replay/rejection behavior, and the
  restored gem-drag midpoint behavior.
- The latest 100-match Local PVP simulation suite passed:
    - `matchCount`: 100
    - `executedMatches`: 100
    - `passed`: 100
    - `failed`: 0
    - `suiteTraceHash`: `90170b13e82e0f5fa3f7cf8f90232dabb7d1e1c9ec321e6144f4c0eb595cd619`
- That suite covered these action families:
    - `BUY_CARD`
    - `DISCARD_GEM`
    - `INITIATE_BUY_JOKER`
    - `INITIATE_RESERVE`
    - `REPLENISH`
    - `RESERVE_CARD`
    - `SELECT_ROYAL_CARD`
    - `STEAL_GEM`
    - `TAKE_BONUS_GEM`
    - `TAKE_GEMS`
- The suite covered multiple Local PVP phase edges including `IDLE -> RESERVE_WAITING_GEM`,
  `IDLE -> SELECT_CARD_COLOR`, `IDLE -> SELECT_ROYAL`, `IDLE -> STEAL_ACTION`,
  `BONUS_ACTION -> IDLE`, `DISCARD_EXCESS_GEMS -> IDLE`, and `SELECT_ROYAL -> IDLE`.

Important limitation: the 100-match suite compares Electron/shared simulation output against the
Unity rules bridge. It is not yet proof that a built Windows Unity Player can receive the same
user-click coordinate stream as Electron from fresh launch to game over.

## Remaining Local PVP Migration Gaps

### 1. Full Built-Player UI Match Playback

The biggest remaining Local PVP gap is end-to-end product UI execution in the built Windows Unity
Player. The next suite must take deterministic Electron Local PVP games and drive Unity through the
real built-player UI, not only through the rules bridge.

Acceptance target:

- Generate at least 100 deterministic Local PVP games.
- Drive Electron and Unity with the same logical action plan.
- For every step, record the Electron target rectangle, Unity visible target rectangle, normalized
  click or drag coordinate, phase before/after, actor, replay event count, and replay-state hash.
- For every legal action, require a state hash change and replay event append unless the action is
  explicitly documented as preview-only.
- For every illegal action, require unchanged state hash and unchanged replay event count.
- Export each replay from Unity, import/review it, and require final review hash equality.
- Report first mismatch with action family, semantic target, normalized coordinate, visible state,
  phase, actor, Electron hash, Unity hash, and replay event count.

### 2. Same-Position Interaction Parity

The user-facing target is stronger than semantic parity: Electron and Unity should respond the same
when a simulated user clicks or drags the same product location.

Still needed:

- Map Electron DOM boxes to Unity `GemDuelViewTarget` boxes by stable semantic key.
- Convert to normalized viewport coordinates so 1920x1080 and 1366x768 can be compared.
- Drive the same coordinate sequence for:
    - take-gems click and drag selection
    - confirm and replenish
    - market card preview, buy, reserve
    - reserve-deck preview and reserve
    - Gold follow-up during reserve
    - cancel reserve
    - Joker color selection
    - royal selection
    - bonus gem selection
    - steal gem selection
    - discard excess gems
    - privilege scroll activation, use, and cancel
    - reserved-card preview, buy, and discard
    - rulebook/settings/restart chrome during Local PVP
    - replay export/import/review entry points relevant to Local PVP

### 3. Action/Edge Coverage Still Needs Product UI Proof

The current action matrix contains many bridge/EditMode/bounded-smoke proofs, but several Local PVP
families still need broader built-player UI coverage and ordering/recovery combinations:

- `INITIATE_BUY_JOKER` and Joker color follow-up actor/order edges.
- `BUY_CARD` reserved-source and market-source edge matrix beyond representative paths.
- `INITIATE_RESERVE`, `RESERVE_CARD`, `INITIATE_RESERVE_DECK`, `RESERVE_DECK`, and
  `CANCEL_RESERVE` ordering, pending-mismatch, and recovery breadth through visible UI.
- `ACTIVATE_PRIVILEGE`, `USE_PRIVILEGE`, and `CANCEL_PRIVILEGE` through the Electron-style
  privilege scroll location below P1/P2, not through a board-panel shortcut.
- `TAKE_BONUS_GEM`, `STEAL_GEM`, and `DISCARD_GEM` broader release-path/order coverage.
- `DISCARD_RESERVED` broader reserved-card ownership, buff, and wrong-phase edges.
- Local PVP replay undo/redo/review parity after exported games.

### 4. Visual And Layout Parity Is Not Yet Locked

Some visual parity issues were fixed or partially addressed in earlier runs, but Local PVP is not
complete until the built Unity Player has pixel/geometry evidence against Electron for every
important Local PVP state.

Required states:

- fresh Local PVP start
- take-gems selection and drag-selection preview
- market card preview
- reserved-card preview and reserved zone density
- reserve waiting for Gold
- Joker color selection
- royal selection
- bonus, steal, privilege, and discard phases
- settings panel open and closed
- rulebook open and closed
- replay review controls after Local PVP export/import
- game over

The report must include screenshot paths, visible target boxes, text samples, font sizes, and a
pixel/geometry verdict. Manual screenshot inspection is not enough.

### 5. Performance Evidence Is Still Needed

The first-confirm/Replenish lag was mitigated by prewarming the live rules apply path. That is not
yet a measured performance claim.

Still needed:

- Built Windows Player cold-start trace for first legal `TAKE_GEMS` confirm.
- Built Windows Player trace for first `REPLENISH`.
- Per-step latency budget and report fields for p50/p95/max duration.
- Failure threshold for regressions that feel like the reported first-confirm lag.
- Evidence that preview open, settings open, and repeated confirm/replenish do not trigger layout
  or rules-engine cold-path stalls.

### 6. Release Runtime Rules Packaging

Local PVP cannot be considered migrated if the built player depends on a development-only bridge
that is not packaged as a release runtime.

Still needed:

- Decide and implement the release runtime strategy for the TypeScript rules engine boundary.
- Prove the packaged Windows player can start Local PVP, execute arbitrary legal games, export and
  review replays, recover after restart, and surface invalid-action errors without dev-only
  fixtures or checkpoint replacement.
- Report exactly which runtime files are packaged and verify no Unity cache, SDK credential, or
  local-only artifact is committed.

### 7. Local PVP Settings, Recovery, And Replay Breadth

Representative release paths exist, but Local PVP completion needs matrix coverage tied to real
settings/recovery/replay behavior.

Still needed:

- Settings combinations that affect Local PVP visibility/input/replay/recovery.
- Save, quit, restart, reload, and continue for games in normal `IDLE` and pending phases.
- Restart during reserve waiting, Joker color selection, royal selection, privilege action, discard,
  bonus, and steal.
- Invalid replay JSON, unsupported schema, missing file, corrupted summary, hash mismatch, failed
  overwrite load, mailbox timeout, malformed bridge response, and corrupt mailbox recovery with
  post-error legal continuation.

### 8. Asset And Placeholder Cleanup

Local PVP still has Unity presentation placeholders that must be audited before a replacement claim.
Current source inspection shows Unity still renders `Privilege Scroll Placeholder` text/glyph
objects and fallback player avatar glyphs such as shield/sword-style symbols. Existing Electron
runtime assets include ability and buff imagery, but Unity runtime resources must be checked slot by
slot before implementation.

Required asset audit:

- privilege scroll under P1/P2
- empty privilege slot
- active privilege scroll state
- player avatar fallback
- active buff avatar image
- buff preview trigger above avatar
- Local PVP chrome icons used in Unity but sourced from Electron runtime assets

Asset policy:

- Prefer mirroring existing approved Electron runtime PNG assets into Unity runtime resources when
  they already exist and match the intended visual.
- If an asset is genuinely missing, use
  `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.
- The image generation flow must inspect slot dimensions, naming conventions, overlay/click zones,
  and existing style references before writing prompts.
- It must produce a prompt manifest, archived candidates under the repo, a score/selection
  document, source paths from `C:\Users\sange\.codex\generated_images`, and dimension/provenance
  validation.
- Do not treat ad hoc SVG placeholders, emoji/glyphs, or unscored generated images as final
  migration assets.

## Local PVP Completion Definition

Local PVP may be called fully migrated only when all of the following are true:

- Built Windows Unity Player starts Classic Local PVP fresh without replay fixture gameplay driver.
- The same deterministic 100-game Local PVP action corpus can be driven through Electron and Unity
  visible UI, including same normalized click/drag locations where applicable.
- Every step has machine-readable evidence: visible state, target geometry, phase, actor,
  action family, state hash before/after, replay event count before/after, legality, and failure
  reason if any.
- Every completed game exports a replay, imports/reviews it, and preserves the final hash.
- All required Local PVP action families have legal and illegal evidence through product UI.
- All required Local PVP phase edges have hash-locked trace evidence through product UI.
- Settings/recovery/replay matrices are green for Local PVP.
- Visual/layout parity is verified by screenshots, target geometry, typography metrics, and
  pixel/geometry reports.
- Performance evidence covers cold first confirm/Replenish and common modal/preview/settings
  paths.
- Release runtime rules packaging is resolved.
- Missing Local PVP assets are either mirrored from approved Electron runtime assets or generated
  through the required imagegen asset-library flow and documented.

## Short `/goal` Prompt For Next Codex Run

```text
/goal 完全迁移 Local PVP 到 Unity。Electron 是唯一产品标准；不要改 Electron/shared contract 来迁就 Unity。只把 LAN/Online/Visual Lab 继续豁免。先读取 docs/migration/local-pvp-unity-remaining-migration-summary-2026-05-13.md、AGENTS.md、unity-migration-governance、product-scope/action-FSM/parity 文档和最新 100 局报告。实现 built Windows Unity Player 的真实 UI/规则/恢复/回放 Local PVP 迁移：生成并运行至少 100 个确定性 Local PVP 对局，让 Electron 和 Unity 用同一逻辑计划与同一归一化点击/拖动位置逐步执行到 game over；每步记录 visible state、target geometry、phase、actor、action family、stateHash、replay event count、legality、failure reason 和 replay hash。修复所有 Unity 不一致，尤其特权卷轴必须在 P1/P2 下方按 Electron 习惯点击后选宝石，drag 选宝石、首次确认/Replenish、市场/保留/预览/设置/皇室/回放/恢复都必须匹配 Electron。若缺少特权、头像、buff 或 chrome 美术资源，必须使用 C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md 生成候选、归档、评分并接入。最终产出 machine-readable JSON/HTML 报告；只有 built-player UI 100/100、replay export/import/review hash、legal/illegal action families、phase edges、settings/recovery matrix、visual/layout/perf evidence 和 release-runtime rules packaging 全绿，才可写 Complete，否则写 Incomplete/Blocked 并列出剩余 blocker。
```
