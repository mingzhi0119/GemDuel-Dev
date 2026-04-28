# GemDuel-Dev 工程级全生命周期审计报告（Opus 4.7 第二轮）

**审计对象:** `GemDuel-Dev`
**仓库版本:** `5.2.11`
**审计日期:** `2026-04-27`（本地夜间二次复核）
**审计执行者:** Claude Opus 4.7（独立审计 agent，无交付所有权）
**审计方式:** 参照 `docs/archive/engineering-audit-report-2026-04-27.md`、`docs/archive/engineering-audit-report-2026-04-25.md`、`docs/archive/opus-4.7-independent-audit-report-2026-04-21.md` 三份归档报告的模板与方法，执行仓库内完整工程门禁与治理脚本，按十个工程维度评分并输出 P0-P3 阻塞分级。
**审计边界:**

- 本报告只给出证据、评分与整改建议，不执行功能整改、不修改运行时代码、公共 API、游戏逻辑、类型契约或资产。
- 按用户指示，**忽略 GitHub 远端仓库设置（live branch protection / rulesets / Dependabot live drift / CODEOWNERS live routing）**；仍计入 repo-contained 的 desired-state snapshot（`tools/governance/repo-settings.snapshot.json` 等）作为治理证据。

---

## 1) Executive Findings

GemDuel-Dev 的工程治理底盘在本轮审计中表现稳定且成熟：仓库以 `pnpm` + Turborepo 单仓结构组织，层次边界（`apps/desktop` / `packages/shared` / `packages/ui` / `packages/turn-service` / `tools/scripts` / `tools/governance`）在 `AGENTS.md` 与 `docs/governance/*` 内有明确契约；架构、边界、契约、依赖、桌面、发布、SBOM、许可、密钥、CHANGELOG、CODEOWNERS、repo-settings 全部以 snapshot + 检查脚本机制驻留在仓库内，并且分别由 `governance.yml`、`build.yml`、`governance-evidence.yml`、`dependency-governance.yml` 四条工作流多次复用。

**本轮所有"结构 / 接口 / 供应链"类门禁（11 项）全部通过；唯一硬阻塞仍是 `pnpm test:coverage` 失败导致的覆盖率封印链路与 `pnpm lifecycle:certify`、`pnpm governance:artifacts` 级联失败**：

- `lines = 82.33% < 92%`、`statements = 82.33% < 92%`、`functions = 93.68% < 95%`、`branches = 87.38% < 88%`，4 项指标同时跌破阈值。
- 失败根因 90% 集中在 `apps/desktop/src/app/visual-lab/**`（`MotionLabControls.tsx`、`VisualLabRoute.tsx`、`VisualLabConsole.tsx`、`SurfaceLabSelect.tsx`、`useSurfaceLabCatalog.ts`、`visualLabStyles.ts` 等开发者诊断面板新增的 ~975 LOC 全部 0% 覆盖），叠加 `MarketRefillMotion.tsx`（7.82%）和 `useAuthoritativeReplaySync.ts`（35.82%）两个低覆盖叶子。
- 该批文件 21:02 的 `?visualLab=` URL 旁路面板是"内部 QA 工具"，但目前未走 seal exclusion 治理路径，等价于把"未受测的发布路径"与"未受测的开发面板"两类风险混在同一条 seal 阈值里。

与 2026-04-25 的 8.55、2026-04-27 第一轮的 9.00 比较，本轮总分 **8.95**，扣分点结构没有恶化（仍是覆盖率单点高影响阻塞），但"覆盖率债务的根因从纯叶子组件转向了未声明的开发面板"是一项治理姿态的"软漂移"，需要 ADR + seal 政策同步。其余维度（架构、边界、契约、安全、可观测、文档）均维持高位。

- **总体评分:** `8.95 / 10`
- **风险等级:** `Medium`（单点高影响阻塞 + 治理政策小幅漂移）
- **P0 数量:** `0`
- **P1 数量:** `1`
- **P2 数量:** `4`
- **P3 数量:** `4`

---

## 2) Scorecard Table

| 维度                            |     分数 | 关键证据                                                                                                                                                                                                                                                                                                                                       | 主要扣分点                                                                                                                                                                                                               | 置信度 |
| ------------------------------- | -------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 架构分层与模块边界              | `9.6/10` | `pnpm architecture:check` 通过；`lifecycle-governance.dashboard.json` `architecture-warnings = 0 warnings, 0 errors`；`AGENTS.md` 与 `docs/governance/architecture-layer-map.md` 显式约束 6 个层；`forbiddenImportPaths` 以 `tools/scripts/check-architecture-budgets.mjs` 强制执行                                                            | `apps/desktop/src/app/visual-lab/**` 是新增的"开发者面板路由层"，但未在层级契约中显式声明角色（dev-tooling vs production-shell）                                                                                         | High   |
| 逻辑解耦与状态所有权            | `9.2/10` | `boundaries:check` 通过 10 个 governed boundaries；`packages/shared` 仍保持 React/Electron/DOM 零依赖；UI 主要消费 selector/handlers；hook 层承担 orchestration                                                                                                                                                                                | `VisualLabRoute.tsx`（299 LOC）直接组合 `PresentationLayer`、`GamePlaySurface`、`PlayerRail` 与 `TopBar`，是新的"shell 复合面"，与现有 shell exclusion 治理边界耦合但未明确归属                                          | High   |
| 契约、接口与边界验证            | `9.5/10` | `pnpm boundaries:check` 通过 10 个边界；`audit-gates.report.json` 覆盖契约/治理脚本；`tools/governance/contract-registry.snapshot.json` 与 `electron/preloadContract.cjs` 对齐；replay/IPC/network/runtime 全有 zod validator + test ref                                                                                                       | 主要依赖 CI 与 snapshot；live 漂移检测对当前 scope 不算扣分项（按用户指示忽略）                                                                                                                                          | High   |
| 类型安全与静态正确性            | `9.8/10` | `pnpm typecheck` 通过（5/5 tasks successful, FULL TURBO 缓存）；`tsconfig.base.json` 严格模式；shared/ui/desktop/tools 各自 tsc --noEmit                                                                                                                                                                                                       | 无阻塞，仅常规回归风险                                                                                                                                                                                                   | High   |
| 代码质量、可维护性与复杂度      | `8.9/10` | `pnpm lint` 通过 0 errors；prettier + lint-staged + Husky pre-commit；架构预算 0 warnings；`docs/adr/*` 7 项 ADR                                                                                                                                                                                                                               | 1 条 lint warning：`apps/desktop/src/app/visual-lab/MotionLabControls.tsx:24` 的 `react-refresh/only-export-components`（同文件混合导出 `getMotionLabel` 工具函数与 React 组件）                                         | High   |
| 测试策略、覆盖率与防 flake 能力 | `5.5/10` | `pnpm test` 通过（136 files / 819 tests，10.79s）；`pnpm test:security` 通过（12 files / 72 tests，1.57s）；`pnpm bench` 通过 4 项基准；seal 阈值 `92/92/95/88` 在 `vitest.seal.config.ts` 强制                                                                                                                                                | `pnpm test:coverage` 失败 4 项阈值（lines/statements 82.33% < 92%、functions 93.68% < 95%、branches 87.38% < 88%）；6 个 visual-lab 文件 0% 覆盖；`MarketRefillMotion.tsx` 7.82%、`useAuthoritativeReplaySync.ts` 35.82% | High   |
| 安全、依赖与供应链治理          | `9.7/10` | `pnpm deps:check` 通过，生产依赖 `info=0 low=0 moderate=0 high=0 critical=0`；`pnpm sbom:check` 704 components / 13 licenses；`pnpm licenses:check` 13 allowed；`pnpm secrets:check` 扫 3489 文件 / 19 governed env names；`pnpm seal-exclusions:check` 88 reviewed exclusions；`SECURITY.md` 已具体到 `mingzhi0119@gmail.com` 与 advisory URL | 88 条 seal exclusion 中"shell"类增长会让覆盖债务结构化沉淀；建议把 visual-lab 转为 ADR-backed shell exclusion 后纳入复审清单                                                                                             | High   |
| CI/CD、发布与全生命周期管线     | `8.5/10` | 4 条 workflow、16 个 root scripts、`audit-gates.report.json` `7/7 lifecycle sections passed`；`bundle-budget.report.json` 275.9 kB（healthy）；`lifecycle-benchmarks.report.json` 4 项基准全过；`release:check` + `release:provenance:check` 已治理                                                                                            | `pnpm lifecycle:certify` 失败：`tests-coverage` 维度被打 0 分，`Lifecycle dashboard report must be passed and complete`；`pnpm governance:artifacts` 同根因失败                                                          | High   |
| 可观测性、恢复与运行治理        | `9.4/10` | `pnpm desktop:check` 通过 desktop governance + 6 runtime drills；`releaseHealth` / `rendererLogger` 双层；`docs/governance/operations-fault-drills.md` 与 `governance/release-health-fixtures/*.jsonl` 4 套场景；`peer/network/recovery/runtime/security/startup/updater` 7 类指标治理化                                                       | 缺 30 天趋势可视化 dashboard（governance evidence 已保留，但消费仍偏原始 artifact）                                                                                                                                      | High   |
| 文档、规范、ADR 与团队交接能力  | `9.4/10` | `README.md`、`docs/README.md`、`docs/guides/*`、`ARCHITECTURE.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CHANGELOG.md`（已含 v5.2.5–v5.2.11 + Unreleased）、7+ 项 ADR、`CODE_OF_CONDUCT.md`、`docs/governance/*` 完整；`pnpm changelog:check` / `codeowners:check` / `repo-settings:check` 全过                                                   | 文档已显著完善；可继续在审计可操作说明里补一段"visual-lab 模式 → 治理映射"                                                                                                                                               | High   |

**算术平均:** `(9.6 + 9.2 + 9.5 + 9.8 + 8.9 + 5.5 + 9.7 + 8.5 + 9.4 + 9.4) / 10 = 8.95`

---

## 3) Command Evidence Matrix

下表对应仓库根目录在 `2026-04-27 22:38–22:40 (UTC-4)` 之间的本地一次性执行结果，原始日志保存在 `artifacts/_audit/*.log`，关键报告在 `artifacts/governance/`：

| 命令                         |    Exit | 摘要                                                                                       | 备注                                                                                       |
| ---------------------------- | ------: | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `pnpm lint`                  |     `0` | 5/5 tasks successful，`0 errors, 1 warning`                                                | warning 在 `MotionLabControls.tsx:24`                                                      |
| `pnpm typecheck`             |     `0` | 5/5 tasks successful（FULL TURBO 缓存）                                                    | —                                                                                          |
| `pnpm test`                  |     `0` | 136 files / **819** tests passed，10.79s                                                   | —                                                                                          |
| `pnpm test:coverage`         | **`1`** | tests 全过，但 4 项 seal 阈值失败                                                          | `lines 82.33 < 92`、`statements 82.33 < 92`、`functions 93.68 < 95`、`branches 87.38 < 88` |
| `pnpm test:security`         |     `0` | 12 files / 72 tests，1.57s                                                                 | —                                                                                          |
| `pnpm boundaries:check`      |     `0` | Boundary governance check passed for **10** governed boundaries                            | —                                                                                          |
| `pnpm architecture:check`    |     `0` | Architecture budget check passed                                                           | 0 warnings                                                                                 |
| `pnpm deps:check`            |     `0` | Dependency governance check passed；prod audit `info=0 low=0 moderate=0 high=0 critical=0` | —                                                                                          |
| `pnpm sbom:check`            |     `0` | Dependency SBOM gate passed. **Components=704, licenses=13**                               | —                                                                                          |
| `pnpm licenses:check`        |     `0` | License allowlist gate passed. Allowed licenses: 13                                        | —                                                                                          |
| `pnpm secrets:check`         |     `0` | Secret and env drift gate passed. Scanned 3489 text files / 19 governed env names          | —                                                                                          |
| `pnpm seal-exclusions:check` |     `0` | Seal coverage exclusion governance check passed for **88** reviewed exclusions             | —                                                                                          |
| `pnpm desktop:check`         |     `0` | Desktop governance + Runtime drill governance（**6** 场景）                                | —                                                                                          |
| `pnpm release:check`         |     `0` | Release health checklist + Operations SLO + drill assets                                   | —                                                                                          |
| `pnpm changelog:check`       |     `0` | Release changelog governance check passed                                                  | CHANGELOG 含 v5.2.x 完整记录                                                               |
| `pnpm codeowners:check`      |     `0` | CODEOWNERS governance check passed                                                         | snapshot 模式                                                                              |
| `pnpm repo-settings:check`   |     `0` | Repo settings governance desired-state snapshot passed                                     | snapshot 模式                                                                              |
| `pnpm bench`                 |     `0` | Lifecycle benchmark check passed (4 benchmarks)                                            | reducer-init / ai-action / protocol-validation / replay-load-save                          |
| `pnpm bundle:check`          |     `0` | runtime-core 观察到 `275.9 kB`（warning ≥ 600，incident > 700）                            | —                                                                                          |
| `pnpm build`                 |     `0` | runtime-core `282.53 kB / gzip 79.59 kB`，2340 modules，3.37s                              | 包含 `VisualLabRoute-D9k4arfw.js 24.21 kB`                                                 |
| `pnpm audit:gates`           |     `0` | 写出 `artifacts/governance/audit-gates.report.json`                                        | —                                                                                          |
| `pnpm governance:report`     |     `0` | 写出 `artifacts/governance/lifecycle-governance.report.json`（7/7 sections passed）        | —                                                                                          |
| `pnpm lifecycle:certify`     | **`1`** | 失败：`coverage-branch failed: 87.39% / minimum 88.00%`；`tests-coverage` 维度 score=0     | 9/10 维度 score=10                                                                         |
| `pnpm governance:artifacts`  | **`1`** | 失败：`Lifecycle governance dashboard failed 1 check(s).`                                  | 与 lifecycle:certify 同根因                                                                |

**判断:** 11 项核心治理脚本全过、3 项发布门禁全过、生命周期里只有 coverage 链路这一条阻塞，且阻塞被 dashboard、certification、export 三个工具忠实级联表达（这是治理脚本健康的体现，而不是新缺陷）。

---

## 4) Lifecycle Pipeline Review

仓库的全生命周期管线已经很完整，共 16 个 root script + 4 条 workflow + 9 个治理 artifact 输出（见 `lifecycle-governance.report.json` 的 `artifactOutputs`）：

- **`governance.yml`**（PR + 手动）：`repo-settings:check`、`codeowners:check`、`changelog:check`、`audit:gates`、`bench`、`lifecycle:certify` 全部 enforced。
- **`build.yml`**（tag release + 手动）：与 governance 相同的 6 项 + `release:provenance:check`。
- **`governance-evidence.yml`**（每日 cron）：上述 6 项 + `governance:report` + 30 天 artifact retention。
- **`dependency-governance.yml`**（每周 cron）：`repo-settings:check`，配合 SBOM artifact 上传。

`audit-gates.report.json` 显示这 4 条 workflow 与 16 个 root script 的契约关系完全 present。`lifecycle-governance.report.json` 显示 7/7 sections passed（repo-settings / codeowners / release-changelog / benchmark-baseline / seal-exclusion-review / lifecycle-dashboard / audit-gates）。

`lifecycle-governance.dashboard.json` 显示 8 项指标里 7 项 passed、1 项 failed（`coverage-branch 87.39% < 88%`）；这个失败被 `lifecycle:certify` 直接传导成 `tests-coverage` 维度评分 0，进而把整体 certification 标为 `failed` 但 9/10 维度仍为 score=10。

**审计判断:** 管线的"失败传播路径"清晰且可机器消费，**单点修复（覆盖率）即可恢复 9.95–10.0 的本地认证态**。

---

## 5) Logic Decoupling Review

`packages/shared` 持续保持纯领域逻辑（reducer、FSM、action validation、network protocol、replay、selectors、runtime schemas、card/buff data、lexicon），未引入 React/Electron/DOM 依赖。`packages/ui` 持续承载可复用 React 组件，依赖 shared 但不依赖 desktop。`apps/desktop` 承载 Electron renderer shell、hooks、runtime config、LAN/online orchestration 与 shell 组合。

唯一需要重视的解耦层位置是 **`apps/desktop/src/app/visual-lab/**`\*\* 下新出现的"开发者面板路由层"：

- `VisualLabRoute.tsx`（299 LOC）通过 URL `?visualLab=surfaces|motion`（`visualLabMode.ts`）旁路进入，组合 `PresentationLayer` + `GamePlaySurface` + `PlayerRail` + `TopBar`。
- `VisualLabConsole.tsx`（233 LOC）、`SurfaceLabControls.tsx`（211 LOC）、`MotionLabControls.tsx`（211 LOC，含 lint warning）、`SurfaceLabSelect.tsx`（28 LOC）、`useSurfaceLabCatalog.ts`（69 LOC）、`visualLabStyles.ts`（134 LOC）全部 0% 覆盖。
- 该面板编译进生产 bundle（`assets/VisualLabRoute-D9k4arfw.js 24.21 kB`），属于"内部 QA 工具但有 prod surface"的混合身份。

**审计判断:** 这是一处"治理边界尚未追平实现增长"的小漂移：visual-lab 的角色既不属于现有 10 个 governed boundary 之一，也不在 88 条 seal exclusion 之中；其引入的 ~975 LOC 直接扣减了全局 seal 分母覆盖率。建议按"shell exclusion + ADR + smoke test"模式收编。

---

## 6) Priority Defect Register（按 P0–P3 整改）

### P0 — 当前无

无安全高危、数据损坏、核心游戏逻辑错误、契约破坏且无保护的问题。runtime drill、IPC reject、network recovery、release health 全绿。

---

### P1-1: 修复 coverage seal 失败并恢复 lifecycle certification

- **问题:** `pnpm test:coverage` 同时未达 4 项全局阈值，导致 `pnpm lifecycle:certify`、`pnpm governance:artifacts` 级联失败，PR / tag release / governance evidence 三条 workflow 在重跑时会同时被阻断。
- **严重度:** `High`
- **核心证据:**
    - `pnpm test:coverage` exit `1`：`lines 82.33 < 92`，`statements 82.33 < 92`，`functions 93.68 < 95`，`branches 87.38 < 88`。
    - `artifacts/governance/lifecycle-governance.dashboard.json`：`coverage-branch` 状态为 `failed`，`87.39% / minimum 88.00%`。
    - `artifacts/governance/lifecycle-certification.report.json`：`tests-coverage` 维度 `score: 0`，整体 `status: failed`，9/10 维度 score=10。
    - 0% 覆盖文件清单：`SurfaceLabControls.tsx (1-211)`、`SurfaceLabSelect.tsx (1-28)`、`VisualLabConsole.tsx (1-233)`、`VisualLabRoute.tsx (1-299)`、`useSurfaceLabCatalog.ts (1-69)`、`visualLabStyles.ts (3-134)`、`MotionLabControls.tsx (3-190 stmts 0)`；低覆盖叶子：`MarketRefillMotion.tsx (7.82%)`、`useAuthoritativeReplaySync.ts (35.82%)`、`AppChromeSurfaceMenu.tsx (67.51%)`。
- **风险场景:** PR 不能合并、tag release 不能发布、`governance-evidence.yml` 每日巡检失败，整条治理链路告警。
- **建议动作（按收益/复杂度排序）:**
    1. 把 `apps/desktop/src/app/visual-lab/**` 在 `packages/config-vitest/sealExclusions.js` 显式登记为 `shellExclusion`，配合新 ADR `docs/adr/0009-visual-lab-shell-exclusion.md`，并为每个 lab 路由补一条 `renders without throwing` smoke test（≤ 30 行/文件）。
    2. 给 `MarketRefillMotion.tsx` 补一个 presentation-event 触发后的 dom 帧测试（已经有 `presentationEvents.test.ts`，复用即可）。
    3. 给 `useAuthoritativeReplaySync.ts` 补 `host fast-forward / mid-stream resync / no-op` 3 条 hook 行为测试。
    4. 复跑 `pnpm test:coverage` 直至四项 seal 阈值达标且不新增 exclusion baseline 突破（baselineCount 当前 88）。
    5. 复跑 `pnpm lifecycle:certify` 与 `pnpm governance:artifacts`，确认 9 个治理 artifact 同步刷新。
- **整改复杂度:** `Medium`（实质上就是 ~5 条 smoke test + 1 条 ADR + seal-exclusion 列表条目）。
- **预期产出:** `pnpm test:coverage` exit 0、seal 4 项阈值达标、`lifecycle:certify` exit 0、`governance:artifacts` 写出完整 artifact、`tests-coverage` 维度恢复 score=10。
- **验收命令:** `pnpm test:coverage && pnpm lifecycle:certify && pnpm governance:artifacts`
- **建议 owner 角色:** Frontend Platform + Domain Logic（visual-lab 归属确认） + Networking（authoritativeReplaySync）

---

### P2-1: 清除唯一 lint warning（visual-lab 子模块拆分）

- **问题:** `pnpm lint` 0 errors / **1 warning**，与"无告警基线"目标存在 1 步差距。
- **严重度:** `Low`
- **证据:** `apps/desktop/src/app/visual-lab/MotionLabControls.tsx:24` 的 `react-refresh/only-export-components`：同文件同时 `export` `getMotionLabel`（普通工具函数）与 `MotionLabControls`（React 组件）。
- **风险场景:** 在 dev server 中触发 visual-lab 路由时丢失 fast refresh，开发者反馈延迟。
- **建议动作:** 把 `getMotionLabel` 抽到 `apps/desktop/src/app/visual-lab/motionLabLabels.ts`（或并入 `motionLabEvents.ts`），保持 `MotionLabControls.tsx` 仅导出组件。
- **整改复杂度:** `Low`（≤ 10 行变更）
- **验收命令:** `pnpm lint`（要求 `0 errors, 0 warnings`）
- **建议 owner 角色:** Frontend Platform

---

### P2-2: 为覆盖率前置预警建立 PR 阶段反馈

- **问题:** 单次提交可以同时把 4 项 seal 阈值跌破，问题暴露时间集中在全量 coverage 阶段，反馈成本偏高。
- **严重度:** `Medium`
- **证据:** 本次 `test:coverage` 同时触发 lines/statements/functions/branches 四项 ERROR，原因是 visual-lab 一次性引入 ~975 LOC 0 覆盖。
- **风险场景:** 类似的"开发面板/QA 路由"批量落库时再次复现，每次都得在 release 前回炉补测。
- **建议动作:**
    1. 在 PR workflow 增加一段 `pnpm test:coverage` 的 **diff summary**（基于 v8 报告的 per-file 表，对新增/修改文件给出"贡献的覆盖率扣减点数"）。
    2. 把"关键模块（hooks/onlineManager、observability、io、presentation 顶层 events）最低覆盖率"作为补充软门禁，先告警后强制；阈值与 seal 一致。
    3. 在 `architecture-budget-contract` 中增加一条契约：新增进 `apps/desktop/src/app/**` 的目录如果不在 seal exclusion 内，必须在同 PR 提交至少 1 条对应测试或 smoke。
- **整改复杂度:** `Medium`
- **验收命令:** `pnpm test:coverage`（需附带可读 diff 摘要）+ 新加的 PR job 标签
- **建议 owner 角色:** Release Engineering + Developer Experience

---

### P2-3: 将 lifecycle 失败的根因定位标准化（fail-aware error surface）

- **问题:** `pnpm lifecycle:certify` 失败时输出仅给出"维度 + 指标 + 阈值"，不附 evidence 文件路径与建议命令；同样 `pnpm governance:artifacts` 失败仅抛 `Error: Lifecycle governance dashboard failed 1 check(s).`，需要人工跨 3 个 JSON 报告还原全貌。
- **严重度:** `Medium`
- **证据:** 见 `artifacts/_audit/lifecycle-certify.log`、`artifacts/_audit/governance-artifacts.log`。
- **风险场景:** 修复时间被消耗在跨报告导航，特别是新成员或夜间值班场景。
- **建议动作:** 在 `tools/scripts/check-lifecycle-certification.mjs` 与 `tools/scripts/export-governance-artifacts.mjs` 失败分支：
    1. 直接拼出失败维度 → 关联 dashboard 指标 → evidenceRefs → 复跑命令 链路，stdout 第一屏显示。
    2. 写出 `artifacts/governance/lifecycle-failure-summary.md`（短报告），方便 PR/CI 评论摘要直接消费。
- **整改复杂度:** `Low`（脚本侧 < 80 行变更）
- **验收命令:** `pnpm lifecycle:certify`（失败时 stdout 含失败 dimension 名/阈值/evidenceRefs/复跑命令）
- **建议 owner 角色:** Release Engineering

---

### P2-4: 把 visual-lab 旁路从 prod bundle 中显式声明

- **问题:** `apps/desktop/dist/assets/VisualLabRoute-D9k4arfw.js`（24.21 kB）会被打进生产 NSIS 包，但 README/CHANGELOG/governance docs 未声明该路由的可达性、安全约束（是否仅 dev、是否需要 feature flag、是否影响 release health 上报维度）。
- **严重度:** `Medium`
- **证据:**
    - `pnpm build` 生成 `assets/VisualLabRoute-D9k4arfw.js`。
    - `apps/desktop/src/app/visual-lab/visualLabMode.ts` 仅由 `?visualLab=surfaces|motion` URL 参数触发，无环境闸门。
    - `docs/governance/architecture-layer-map.md`、`docs/governance/boundary-inventory.md` 没有 visual-lab 角色。
- **风险场景:** 客户端用户被 URL 引导进入未受测的开发面板，可能触发 presentation/shell 组合 surface 的非预期分支；release-health 指标在 visual-lab 模式下行为未定义。
- **建议动作:**
    1. 在 `vite.config.ts` 中给 visual-lab chunk 加 `import.meta.env.DEV || RUNTIME_CONFIG.allowVisualLab` 守卫（或单独打包并仅在 dev/staging build 中合并）。
    2. 在 `docs/governance/operations-fault-drills.md` 增加"visual-lab 路由旁路"段落，说明该路径的可观测义务（不计入 release-health 异常分母）。
    3. 在 `CHANGELOG.md Unreleased` 写入 visual-lab 引入与治理状态。
- **整改复杂度:** `Medium`
- **验收命令:** `pnpm build && pnpm bundle:check`（visual-lab chunk 仅在 DEV/staging 出现 / prod 不出现，或附 feature flag 注释）
- **建议 owner 角色:** Frontend Platform + Release Engineering

---

### P3-1: 治理趋势可视化（30 天 dashboard）

- **建议:** 基于 `artifacts/governance/*.json` 输出每日 HTML/JSON dashboard，30 天滚动展示 coverage、bundle、bench、release-health、IPC reject、recovery requests、boundary count 等指标。`governance-evidence.yml` 已每日 cron 上传，离最后一公里只差消费层。
- **预期收益:** 慢速退化（5–7 天观察才看出）会被自动捕获，而非人工 spot-check。
- **owner:** Release Engineering

### P3-2: 覆盖率债务模块化拆账（按边界归属）

- **建议:** 把 88 条 seal exclusion 按"shell / wrapper / leaf / static"四类 + 边界 owner（Frontend Platform / Domain Logic / Networking / Desktop Platform / Release Engineering）做月度滚动账本，每月评审至少一类。
- **预期收益:** exclusion 增长来源透明，避免 visual-lab 这类整批 0 覆盖批量摸进 baseline 的二次发生。
- **owner:** Frontend Platform

### P3-3: 给关键 hot-path 增加性能/正确性双门禁

- **建议:** 当前 `pnpm bench` 已有 4 个 lifecycle benchmark（reducer-init / ai-action / protocol-validation / replay-load-save），均 < 18 ms p95。建议把 reducer 子路径（`applyAction` 的高频分支）和 `useAuthoritativeReplaySync` 的递归 fast-forward 加入 bench；同时给 `aiPlayer.ts` 增加 scenario regression（与 2026-04-21 报告同诉求）。
- **预期收益:** 把"性能退化"和"AI 决策 silent regression"提前到 PR 阶段。
- **owner:** Domain Logic + Frontend Platform

### P3-4: 认证报告 ↔ 审计报告 双向联动

- **建议:** 当 `lifecycle-certification.report.json` 状态由 passed 转 failed 时，自动写一个 `docs/archive/engineering-audit-draft-<date>.md` 草稿（包含 dashboard 失败指标、维度分数、建议动作模板），让"审计报告"成为"治理失败时的默认产物"，缩短人工整理路径。
- **预期收益:** 降低审计报告滚动迭代成本。
- **owner:** Release Engineering

---

## 7) Governance Alignment Check

| 治理要求                                              | 状态        | 证据 / 偏差                                                               | 评分影响                                   |
| ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| `pnpm lint` 必须通过                                  | Met         | exit 0；`governance.yml` / `build.yml` / `governance-evidence.yml` 都包含 | —                                          |
| `pnpm typecheck` 必须通过                             | Met         | exit 0；5 个 package 全过                                                 | —                                          |
| `pnpm sbom:check` 必须通过                            | Met         | 704 components / 13 licenses                                              | —                                          |
| `pnpm test` 必须通过                                  | Met         | 819/819 通过                                                              | —                                          |
| `pnpm test:security` 必须通过                         | Met         | 12 files / 72 tests                                                       | —                                          |
| `pnpm test:coverage`（seal）必须通过                  | **Not Met** | 4 项阈值 fail；阻断 PR/release/evidence                                   | Tests Coverage 维度直接 -4.5               |
| `pnpm boundaries:check` 必须通过                      | Met         | 10 governed boundaries                                                    | —                                          |
| `pnpm architecture:check` 必须通过                    | Met         | 0 warnings                                                                | —                                          |
| `pnpm bundle:check` 必须通过                          | Met         | runtime-core 275.9 kB（healthy）                                          | —                                          |
| `pnpm desktop:check` 必须通过                         | Met         | desktop governance + 6 drills                                             | —                                          |
| `pnpm release:check` 必须通过                         | Met         | checklist + SLO + drill assets                                            | —                                          |
| `pnpm release:provenance:check` 必须在 tag build 通过 | Met         | 在 `build.yml:71` 已配置；测试覆盖 release tag provenance CLI             | —                                          |
| 生产依赖 audit = 0 vulns                              | Met         | `info=0 low=0 moderate=0 high=0 critical=0`                               | —                                          |
| `pnpm changelog:check` 必须通过                       | Met         | CHANGELOG 含 v5.2.4–v5.2.11 + Unreleased                                  | —                                          |
| `pnpm codeowners:check` 必须通过                      | Met         | snapshot 模式                                                             | —                                          |
| `pnpm repo-settings:check` 必须通过（snapshot 模式）  | Met         | desired-state snapshot passed                                             | —                                          |
| `pnpm seal-exclusions:check` 必须通过                 | Met         | 88 reviewed exclusions / baseline 88                                      | 但 visual-lab 不在该 88 项中（治理软漂移） |
| `pnpm bench` 必须通过                                 | Met         | 4/4 benchmarks passed                                                     | —                                          |
| `pnpm audit:gates` 必须通过                           | Met         | 写出 `audit-gates.report.json`                                            | —                                          |
| `pnpm governance:report` 必须通过                     | Met         | 7/7 sections passed                                                       | —                                          |
| `pnpm lifecycle:certify` 必须通过                     | **Not Met** | tests-coverage 维度 score=0                                               | CI/CD 维度 -1.0                            |
| `pnpm governance:artifacts` 必须通过                  | **Not Met** | 同根因失败                                                                | CI/CD 维度 -0.5                            |

---

## 8) 与上一轮审计对比（2026-04-25 / 2026-04-27 第一轮）

| 维度                            |    04-25 | 04-27 第一轮 | 04-27 本轮 | 变化                                |
| ------------------------------- | -------: | -----------: | ---------: | ----------------------------------- |
| 架构分层与模块边界              |      8.4 |          9.6 |        9.6 | 持平                                |
| 逻辑解耦与状态所有权            |      8.5 |          9.3 |        9.2 | -0.1（visual-lab 软耦合）           |
| 契约、接口与边界验证            |      9.1 |          9.5 |        9.5 | 持平                                |
| 类型安全与静态正确性            |      9.3 |          9.8 |        9.8 | 持平                                |
| 代码质量、可维护性与复杂度      |      8.2 |          9.0 |        8.9 | -0.1（visual-lab 0 覆盖批量）       |
| 测试策略、覆盖率与防 flake 能力 |      7.3 |          5.5 |        5.5 | 持平（同一阻塞）                    |
| 安全、依赖与供应链治理          |      8.9 |          9.7 |        9.7 | 持平                                |
| CI/CD、发布与全生命周期管线     |      8.4 |          8.8 |        8.5 | -0.3（governance:artifacts 也失败） |
| 可观测性、恢复与运行治理        |      9.0 |          9.4 |        9.4 | 持平                                |
| 文档、规范、ADR 与团队交接能力  |      8.4 |          9.4 |        9.4 | 持平                                |
| **总分**                        | **8.55** |     **9.00** |   **8.95** | -0.05                               |

**判断:** 治理姿态未恶化；细微下调主要来自把 visual-lab 路由的"未声明 + 0 覆盖 + lint warning + 进入 prod bundle"四联问题在 CI/CD 与代码质量维度小幅扣分；只要 P1 修复 + P2 visual-lab 角色声明完成，下次审计应回到 **9.4–9.7**。

---

## 9) Assumptions

- 本报告为 2026-04-27 夜间在 `E:\simonbb\GemDuel-Dev` 的本地点位审计，不代表后续提交或远端 CI 的当前状态。
- 按用户指示**忽略 GitHub 远端仓库设置**：live branch protection、ruleset、Dependabot live drift、CODEOWNERS live routing 不计入本轮评分；repo-contained snapshot（`tools/governance/repo-settings.snapshot.json`、`tools/governance/codeowners-role-map.snapshot.json`）按通过登记。
- `pnpm test:coverage` / `pnpm lifecycle:certify` / `pnpm governance:artifacts` 失败按真实结果记录，没有为通过审计而修改测试或生产代码。
- Windows NSIS-only release target 视为当前项目工程规范，不作为缺陷。
- 工程整改建议按 P1 → P2 → P3 顺序推进。P1 完成前不应宣称"全生命周期管线恢复全绿"。

---

## 10) Verification Evidence

完整命令日志保存在仓库内 `artifacts/_audit/`（本地未跟踪），治理 artifact 在 `artifacts/governance/`：

```text
artifacts/_audit/lint.log
artifacts/_audit/typecheck.log
artifacts/_audit/test.log
artifacts/_audit/test-coverage.log
artifacts/_audit/test-security.log
artifacts/_audit/boundaries.log
artifacts/_audit/architecture.log
artifacts/_audit/deps.log
artifacts/_audit/sbom.log
artifacts/_audit/licenses.log
artifacts/_audit/secrets.log
artifacts/_audit/seal-exclusions.log
artifacts/_audit/desktop.log
artifacts/_audit/release.log
artifacts/_audit/changelog.log
artifacts/_audit/codeowners.log
artifacts/_audit/repo-settings.log
artifacts/_audit/bench.log
artifacts/_audit/build.log
artifacts/_audit/bundle.log
artifacts/_audit/audit-gates.log
artifacts/_audit/governance-report.log
artifacts/_audit/lifecycle-certify.log
artifacts/_audit/governance-artifacts.log

artifacts/governance/audit-gates.report.json
artifacts/governance/audit-gates.report.md
artifacts/governance/bundle-budget.report.json
artifacts/governance/lifecycle-benchmarks.report.json
artifacts/governance/lifecycle-certification.report.json
artifacts/governance/lifecycle-certification.report.md
artifacts/governance/lifecycle-governance.dashboard.json
artifacts/governance/lifecycle-governance.dashboard.md
artifacts/governance/lifecycle-governance.report.json
artifacts/governance/lifecycle-governance.report.md
artifacts/governance/healthy-baseline.release-health.report.json
artifacts/governance/ipc-reject.release-health.report.json
artifacts/governance/network-recovery.release-health.report.json
artifacts/governance/updater-fail.release-health.report.json
```

关键失败摘录：

```text
ERROR: Coverage for lines (82.33%) does not meet global threshold (92%)
ERROR: Coverage for functions (93.68%) does not meet global threshold (95%)
ERROR: Coverage for statements (82.33%) does not meet global threshold (92%)
ERROR: Coverage for branches (87.38%) does not meet global threshold (88%)

Lifecycle certification failed:
- Lifecycle dashboard metric coverage-branch failed: 87.39% / minimum 88.00%.
- Lifecycle dashboard report must be passed and complete.
- Lifecycle certification dimension tests-coverage failed: dashboard metric coverage-branch is failed.

Error: Lifecycle governance dashboard failed 1 check(s).
    at main (file:///E:/simonbb/GemDuel-Dev/tools/scripts/export-governance-artifacts.mjs:215:15)
```

关键 warning 摘录：

```text
apps/desktop/src/app/visual-lab/MotionLabControls.tsx
  24:14  warning  Fast refresh only works when a file only exports components.
                  Use a new file to share constants or functions between components
                  react-refresh/only-export-components
```

---

## 11) 审计结论

仓库的工程治理底盘成熟、机器可读、级联表达清晰。**唯一硬阻塞是覆盖率封印链路**，根因 90% 集中在新加入的 `apps/desktop/src/app/visual-lab/**` 开发者面板路由（共 ~975 LOC，0% 覆盖），叠加 `MarketRefillMotion.tsx`、`useAuthoritativeReplaySync.ts` 两个低覆盖叶子。

**最短闭环:**

1. 把 visual-lab 收编为 `shellExclusion` + ADR + 5 条 smoke test（消除 4 项 seal 失败的主要分母）。
2. 给 `MarketRefillMotion.tsx`、`useAuthoritativeReplaySync.ts` 各补 1–2 条行为测试。
3. 复跑 `pnpm test:coverage && pnpm lifecycle:certify && pnpm governance:artifacts`。
4. 把 `MotionLabControls.tsx` 的工具函数拆出，清掉最后一条 lint warning。
5. 完成 P2-4 visual-lab 旁路声明，确保 prod bundle 治理边界对齐。

完成上述步骤即可让本地认证回到 9.95–10.0、整体审计分回到 9.4–9.7 区间，并恢复 PR / release / evidence 三条 workflow 的全绿态。

— 报告完 —
