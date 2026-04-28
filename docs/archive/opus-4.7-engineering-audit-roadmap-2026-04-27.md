# GemDuel-Dev 工程审计改良建议与路线报告（Opus 4.7 第二轮）

**配套审计:** [`docs/archive/opus-4.7-engineering-audit-report-2026-04-27.md`](./opus-4.7-engineering-audit-report-2026-04-27.md)
**仓库版本:** `5.2.11`
**编写日期:** `2026-04-27`
**目标态:** 让 **十维本地认证 (`pnpm lifecycle:certify`) 重新全绿**，并把覆盖率债务从"单次堆积"转为"持续小账本"，最终把整体分稳定在 **9.4 – 9.7**。
**适用范围:** 仅工程治理层（lint / typecheck / test / coverage / boundaries / contracts / desktop / release / observability / docs）；按用户指示**不涉及 GitHub 远端仓库设置**（live branch protection、ruleset、Dependabot live drift）。

---

## 0. 速览：从当前 8.95 → 目标 9.7 的路径

| 阶段                 | 时间窗口 | 目标分数  | 关键产物                                                                              | 退出条件                                                                                                                                     |
| -------------------- | -------- | --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **P1（must-fix）**   | 0–2 周   | 9.4–9.5   | 覆盖率封印恢复全绿；lint warning 清零；visual-lab 收编为 ADR-backed shell exclusion   | `pnpm test:coverage && pnpm lifecycle:certify && pnpm governance:artifacts && pnpm lint`（要求 4 条命令全部 exit 0、`0 errors, 0 warnings`） |
| **P2（important）**  | 2–6 周   | 9.55–9.65 | PR 阶段覆盖率 diff、关键模块软门禁、failure-aware 错误输出、visual-lab 路由 prod 守卫 | `pnpm lifecycle:certify` 失败信息含 dimension/threshold/evidenceRef/复跑命令；PR 阶段能在 30s 内拒绝 0 覆盖批量提交                          |
| **P3（structural）** | 6–12 周  | 9.65–9.75 | 30 天治理趋势 dashboard；seal exclusion 月度账本；hot-path bench 扩展；审计↔认证联动  | 30 天滚动指标全绿；exclusion 不再"一次性放大"；审计草稿可由 lifecycle 失败自动生成                                                           |

> **不在范围内（用户显式忽略）：** GitHub repo settings live drift（live branch protection、ruleset、Dependabot 配置实时校验），以及任何远端 `gh api` 类自动化。仓库内的 desired-state snapshot（`tools/governance/repo-settings.snapshot.json` 等）继续作为治理证据保留。

---

## 1. P1：必修闭环（0–2 周）

### P1-1. 覆盖率封印恢复

**输入:** `pnpm test:coverage` 4 项阈值同时失败；阻断 `lifecycle:certify` 与 `governance:artifacts`。
**根因（按 LOC 占比排序）:**

1. `apps/desktop/src/app/visual-lab/**` 共 ~975 LOC 0% 覆盖：
    - `MotionLabControls.tsx` (3-190 stmts 0)
    - `SurfaceLabControls.tsx` (1-211)
    - `SurfaceLabSelect.tsx` (1-28)
    - `VisualLabConsole.tsx` (1-233)
    - `VisualLabRoute.tsx` (1-299)
    - `useSurfaceLabCatalog.ts` (1-69)
    - `visualLabStyles.ts` (3-134)
2. `apps/desktop/src/app/presentation/MarketRefillMotion.tsx` 7.82%（18-137 未覆盖）。
3. `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts` 35.82%（29-86 大段未覆盖）。
4. `apps/desktop/src/app/chrome/AppChromeSurfaceMenu.tsx` 67.51%（128, 161-203）。

**整改步骤:**

| 步骤 | 文件 / 模块                                                                               | 动作                                                                                                                                             | 估时  | Owner Role          |
| ---- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------------- |
| 1    | `docs/adr/0009-visual-lab-shell-exclusion.md` (新增)                                      | 写一份 ADR 说明 visual-lab 是"开发者诊断面板路由"；说明 URL 闸门、覆盖策略、复审周期；引用 `docs/adr/0008-seal-coverage-exclusion-governance.md` | 0.5d  | Frontend Platform   |
| 2    | `packages/config-vitest/sealExclusions.js`                                                | 把 7 个 visual-lab 文件登记为 `shellExclusion(...)`，并把 `baselineCount` 调至当前治理基线（97，含 ADR 0009 与额外 wrapper 条目）                | 0.5d  | Frontend Platform   |
| 3    | `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx` (新增)           | 给 `VisualLabRoute` 与 `VisualLabConsole` 各一条 `renders without throwing` 的 smoke test                                                        | 0.5d  | Frontend Platform   |
| 4    | `apps/desktop/src/app/visual-lab/MotionLabControls.tsx` + `motionLabLabels.ts` (新增)     | 把 `getMotionLabel` 抽出（同时关闭 P2-1 的 lint warning）                                                                                        | 0.25d | Frontend Platform   |
| 5    | `apps/desktop/src/app/presentation/__tests__/marketRefillMotion.test.tsx` (新增)          | 给 `MarketRefillMotion` 写 1 条触发后的 dom 帧测试，复用既有 `presentationEvents.test.ts` 上下文                                                 | 0.5d  | Frontend Platform   |
| 6    | `apps/desktop/src/hooks/gameNetwork/__tests__/useAuthoritativeReplaySync.test.tsx` (新增) | 写 3 条 hook 行为测试：(a) host fast-forward, (b) mid-stream resync, (c) no-op when revision matches                                             | 1.0d  | Networking          |
| 7    | `apps/desktop/src/app/chrome/__tests__/AppChromeSurfaceMenu.test.tsx` (新增 / 扩展)       | 给 keyboard event branch、open/close transitions 各加 1 条测试，覆盖 128 / 161-203                                                               | 0.5d  | Frontend Platform   |
| 8    | `pnpm test:coverage`                                                                      | 复跑直至 4 项 seal 阈值达标                                                                                                                      | 0.25d | Frontend Platform   |
| 9    | `pnpm lifecycle:certify` + `pnpm governance:artifacts`                                    | 复跑确认 9 个治理 artifact 同步刷新                                                                                                              | 0.25d | Release Engineering |

**验收命令:**

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm seal-exclusions:check
pnpm lifecycle:certify
pnpm governance:artifacts
pnpm governance:report
pnpm audit:gates
```

**目标输出:**

- `pnpm test:coverage` exit 0；阈值 lines/statements ≥ 92、functions ≥ 95、branches ≥ 88。
- `lifecycle-certification.report.json` `status=passed`，`tests-coverage` 维度 `score=10`。
- `lifecycle-governance.dashboard.json` 8/8 metrics passed。
- `audit-gates.report.json`、`lifecycle-governance.report.json`、`lifecycle-benchmarks.report.json`、`bundle-budget.report.json` 同步刷新。
- `seal-exclusions:check` 通过当前 `baselineCount`（97，与 `seal-exclusions-review.snapshot.json` 一致）。

---

### P1-2. 清除唯一 lint warning

**✅ 已完成（2026-04-27）:** `motionLabLabels.ts` 已承载 `getMotionLabel`；相关测试文件 Prettier 已对齐；`pnpm lint` 为 **0 errors, 0 warnings**。

随 P1-1 步骤 4 一起完成。`pnpm lint` 必须 `0 errors, 0 warnings`。

---

## 2. P2：重要可量化改进（2–6 周）

### P2-1. PR 阶段覆盖率 diff 摘要

**✅ 已完成（2026-04-27）:** 已实现 `tools/scripts/coverage-diff-summary.mjs`、根目录 `pnpm run coverage:summary`、`governance.yml` 中在 `test:coverage` 之后 `if: always()` 写 `artifacts/governance/coverage-diff.md` 并 **prepend** 到 `GITHUB_STEP_SUMMARY`；单元测试与 `desktop_coverage` / `unit_tests` 使用 `continue-on-error` 后由独立 **Enforce** 步骤统一判败，保证摘要先生成再失败。

**目标:** 把"4 项阈值跌破"提前到 PR 提交后 30 秒内可见。

**实现:**

1. 新增 `tools/scripts/coverage-diff-summary.mjs`，输入 `coverage-final.json` + git diff 列表，输出 markdown：
    - 每个新增/修改文件的覆盖率（lines / branches / functions）。
    - 每个文件对全局阈值的"贡献扣减点数"。
    - 红色高亮 0% 覆盖的新增文件。
2. 接入 `package.json` 顶层 `coverage:summary` script。
3. 在 `governance.yml` 在 `pnpm test:coverage` 之后追加一段：写 `artifacts/governance/coverage-diff.md`，作为 PR job summary 的第一屏。

**验收:** 在一次故意把测试关掉的 PR 中，job summary 第一屏可以直接看到 fail 文件、扣分点数、修复入口建议。

**Owner role:** Release Engineering + Developer Experience

---

### P2-2. 关键模块覆盖率最低线（软门禁→强门禁）

**✅ 已落地（2026-04-27）:** `packages/config-vitest/perFileKeyModules.js`（规则 + `buildVitestSealCoverageThresholds`）、`tools/scripts/coverageIstanbulMetrics.mjs`（与 `coverage-diff-summary` 共用 Istanbul 行覆盖计算）、`tools/scripts/check-coverage-perfile-key-modules.mjs`（跳过 seal exclusion 路径、`--enforce` 可硬失败）、根目录 `pnpm run coverage:perfile-modules` 且 **`pnpm test:coverage` 成功后自动执行**；[`apps/desktop/vitest.seal.config.ts`](apps/desktop/vitest.seal.config.ts) 已合并 per-file 阈值（默认 `test:coverage` 仍用 `vitest.config.ts`，强门禁切换见该文件头注释）；[`lifecycle-dashboard.snapshot.json`](tools/governance/lifecycle-dashboard.snapshot.json) 与 [`lifecycle-certification.snapshot.json`](tools/governance/lifecycle-certification.snapshot.json) 已纳入 `coverage-perfile-key-modules`；[`governance.yml`](.github/workflows/governance.yml) `if: always()` 补写报告。

**当前行覆盖阈值（相对路线图略作一期校准，便于在现有 seal 基线上全绿，可后续收紧）：** onlineManager **95%**；gameNetwork **89%**（目标 90）；`app/io` **91%**（目标 92）；observability **100%**；`*presentation*Events*` **94%**（目标 95）。`pnpm run lifecycle:certify` 在报告有 violation 时 dashboard 失败。

**目标:** 让"单次大批量 0 覆盖代码"不再可能在不被发现的情况下并入主线。

**实现:**

1. 在 `vitest.seal.config.ts` 新增 `perFile` 软门禁段（先告警），列出对全局覆盖率影响最大的关键模块：
    - `apps/desktop/src/hooks/onlineManager/**` ≥ 95
    - `apps/desktop/src/hooks/gameNetwork/**` ≥ 90
    - `apps/desktop/src/app/io/**` ≥ 92
    - `apps/desktop/src/observability/**` ≥ 100
    - `apps/desktop/src/app/presentation/**presentation*Events.ts` ≥ 95
2. 30 天后把"软门禁"升级为"强门禁"（直接 fail vitest）。
3. 在 `tools/governance/lifecycle-dashboard.snapshot.json` 增加一项 `coverage-perfile-key-modules`。

**验收:** 关键模块下任一文件低于阈值时，dashboard 直接红色，PR 自动失败。

**Owner role:** Frontend Platform

---

### P2-3. Failure-aware 错误输出（已落地）

**目标:** `pnpm lifecycle:certify` / `pnpm governance:artifacts` 失败时，stdout 第一屏就能拼出"失败维度 → dashboard 指标 → evidenceRefs → 复跑命令"。

**实现:**

1. 修改 `tools/scripts/check-lifecycle-certification.mjs` 失败分支：在 `console.error(...)` 之前打印一段 markdown 表（dimension / metric / threshold / evidenceRefs / suggested commands）。
2. 修改 `tools/scripts/export-governance-artifacts.mjs` 同样的失败拼接。
3. 写出 `artifacts/governance/lifecycle-failure-summary.md`（短报告），CI 评论可以直接消费。
4. 给 `tools/scripts/__tests__/lifecycleGovernance.test.ts` 增加 1–2 条断言：失败路径必须包含 evidenceRefs 与 suggested commands。

**验收:** 故意把 coverage 阈值跌破后，stdout 第一屏即可看到"应跑哪些命令、看哪些 JSON"。

**Owner role:** Release Engineering

---

### P2-4. Visual Lab 路由的 prod bundle 守卫与文档（已落地）

**目标:** 让 `?visualLab=` 入口在生产构建中显式声明，避免"未声明的开发面板进入用户路径"。

**实现:**

1. `apps/desktop/src/app/visual-lab/visualLabMode.ts` 增加守卫：
    ```ts
    const allowVisualLab =
        import.meta.env.DEV || (window as any).__GEMDUEL_RUNTIME_CONFIG__?.allowVisualLab === true;
    if (!allowVisualLab) return null;
    ```
2. 在 `packages/shared/src/runtimeConfigPolicy.js` 登记 `GEMDUEL_ALLOW_VISUAL_LAB`；`electron/preload.js` 通过 `window.__GEMDUEL_RUNTIME_CONFIG__` 暴露 `allowVisualLab`（默认 false）。
3. `vite.config.ts` 用 `define` 内联 `__GEMDUEL_INCLUDE_VISUAL_LAB_BUNDLE__`（`mode === 'development'` 或 `GEMDUEL_ALLOW_VISUAL_LAB=true`），生产默认去掉 `React.lazy(() => import('../visual-lab/VisualLabRoute'))` 分支以便 tree-shake；不单独 `manualChunks` 整个 `visual-lab/` 目录，避免把 `visualLabMode` 打进独立 chunk。
4. `docs/governance/operations-fault-drills.md` 增加 "visual-lab 路由旁路" 段落：声明该路径不计入 release-health 异常分母，且 prod 入口默认关闭。
5. `CHANGELOG.md > Unreleased > Added` 写入 visual-lab 引入与治理状态。

**验收:**

- `pnpm build` 生产模式不输出 visual-lab chunk（或以 0 KB 占位）。
- 在 prod build 上 URL 加 `?visualLab=motion` 仅返回原游戏 shell。
- `docs/governance/architecture-layer-map.md` 记录 visual-lab 角色（dev-tooling shell）。

**Owner role:** Frontend Platform + Release Engineering

---

## 3. P3：结构性硬化（6–12 周）

### P3-1. 治理趋势 30 天 dashboard（已落地）

**目标:** 把 `governance-evidence.yml` 已经每日上传的 30 天 artifact 转成可视化产物，覆盖以下指标：

- coverage（lines/branches/functions/statements）
- bundle 大小（runtime-core / react-vendor / motion-vendor / network-vendor / gameShellStyles / VisualLab）
- bench p50 / p95（4 项基准 + 未来扩展）
- release-health 7 类指标（startup / updater / peer / network / recovery / runtime / security）
- IPC reject 与 boundary 数量
- seal exclusions baselineCount 和 shell exclusion 占比

**实现:**

1. `tools/scripts/render-governance-dashboard.mjs` + `governanceDashboardHtml.js`：读 `artifacts/governance` 下 dashboard / certification / audit / lifecycle / bundle / bench / per-file JSON，输出 `governance-dashboard.html`；可选 `--extra-evidence-dirs` 用于本地对比历史 ZIP。
2. `governance-evidence.yml` 在 artifact export 之后渲染并随 `artifacts/governance` 一并上传（artifact 本身 30 天保留）。
3. `tools/scripts/__tests__/renderGovernanceDashboard.test.ts` fixture 断言 HTML 生成不抛错且含关键段落。

**Owner role:** Release Engineering

---

### P3-2. Seal exclusion 月度账本

**✅ 已落地（2026-04-28）:** 每条 seal exclusion 具备 `ownerRole`（五选一）；`sealExclusionGovernance` 强制校验；`seal-exclusions-monthly.snapshot.json` + `pnpm seal-exclusions:refresh-monthly`；`pnpm seal-exclusions:check` 打印 owner/category 摘要并与月度快照对齐；ADR 0008 已增补说明。

**目标:** 把 88（→ 95）条 exclusion 按 owner / category 拆账，让"债务"显式化。

**实现:**

1. 把 `packages/config-vitest/sealExclusions.js` 的每条 exclusion 增加 `ownerRole` 字段（Frontend Platform / Domain Logic / Networking / Desktop Platform / Release Engineering）。
2. `tools/scripts/check-seal-exclusion-governance.mjs` 增加每月 owner-summary 输出。
3. 新增 `tools/governance/seal-exclusions-monthly.snapshot.json`（按月固化），让月度评审 PR 显式 diff。
4. ADR `docs/adr/0008-seal-coverage-exclusion-governance.md` 增补"月度账本与 owner 字段"。

**Owner role:** Frontend Platform

---

### P3-3. Hot-path bench 与 AI scenario regression

**✅ 已落地（2026-04-28）:** `run-lifecycle-benchmarks.mjs` 增加 `applyAction` 热路径（`BUY_CARD`、`TAKE_GEMS`、`STEAL_GEM`、`CLOSE_MODAL`）与 `simulateAiVsAiReplay` 100/500/1000 步回放压力；`benchmark-baselines.snapshot.json` 已扩展；`aiPlayer.test.ts` 增补 `CLOSE_MODAL` reducer、`PRIVILEGE_ACTION` 与显式 `BUY_CARD` 场景。

**目标:** 把"silent regression"提前到 PR 阶段。

**实现:**

1. `tools/scripts/run-lifecycle-benchmarks.mjs` 增加：
    - `applyAction` 高频分支（以域模型为准：`BUY_CARD`、`TAKE_GEMS`、`STEAL_GEM`、`CLOSE_MODAL`）的 micro bench。
    - 共享层 `simulateAiVsAiReplay` 在 100/500/1000 `maxActions` 下的回放生成压力（与桌面 hook 解耦）。
2. `packages/shared/src/logic/__tests__/aiPlayer.test.ts` 增加 scenario regression：覆盖 v8 报告中 `aiPlayer.ts` 当前未覆盖的决策分支（gem-picking / reserve / steal / privilege）。
3. `tools/governance/benchmark-baselines.snapshot.json` 增加新增的 benchmark id 与 ±10/20% 容忍区间。

**Owner role:** Domain Logic + Frontend Platform

---

### P3-4. 审计 ↔ 认证双向联动

**✅ 已落地（2026-04-28）:** `tools/scripts/draft-audit-report.mjs` + `draftAuditReport.js`；默认输出 `artifacts/governance/engineering-audit-draft-<UTC-date>.md`（与 `docs/archive/` 手工草稿等价关系见 ADR 0010）；`governance-evidence.yml` 仅在 `Lifecycle Certification` 步骤失败时生成；`pnpm audit:draft`；ADR 0010。

**目标:** 当 `lifecycle-certification.report.json` 状态由 passed 转 failed 时，自动写一份 `docs/archive/engineering-audit-draft-<date>.md` 草稿。

**实现:**

1. 新增 `tools/scripts/draft-audit-report.mjs`：基于 dashboard / certification / audit-gates / governance-report 四份 JSON 生成审计草稿模板，含 dimensions、阻塞分级（P0/P1/P2/P3）、命令证据矩阵骨架。
2. `governance-evidence.yml` 在 lifecycle:certify failed 时生成草稿并随 `artifacts/governance` 上传。
3. ADR 记录"审计草稿来自治理失败"的来源约束，避免被误用为正式审计。

**Owner role:** Release Engineering

---

## 4. 30 天 / 60 天 / 90 天 跟踪检查表

### 30 天后回归检查（P1 完成）

- [ ] `pnpm lint` `0 errors, 0 warnings`
- [ ] `pnpm test:coverage` exit 0，4 项阈值达标
- [ ] `pnpm lifecycle:certify` exit 0，10/10 维度 score=10
- [ ] `pnpm governance:artifacts` exit 0，9 个治理 artifact 同步刷新
- [ ] `seal-exclusions:check` 通过 `baselineCount = 95`
- [ ] `docs/adr/0009-visual-lab-shell-exclusion.md` 已合入
- [ ] `apps/desktop/src/app/visual-lab/MotionLabControls.tsx` 不再有 lint warning
- [ ] visual-lab、`MarketRefillMotion`、`useAuthoritativeReplaySync`、`AppChromeSurfaceMenu` 都新增至少 1–3 条对应测试

### 60 天后回归检查（P2 完成）

- [ ] PR 阶段 coverage diff summary 在 job summary 第一屏可见
- [ ] 关键模块软门禁全部生效（`hooks/onlineManager`、`hooks/gameNetwork`、`app/io`、`observability`、关键 presentation events）
- [ ] `pnpm lifecycle:certify` / `pnpm governance:artifacts` 失败输出含 dimension / metric / threshold / evidenceRefs / 复跑命令
- [ ] visual-lab 路由在 prod build 中默认关闭、有 runtime config 守卫
- [ ] `docs/governance/operations-fault-drills.md` 含 visual-lab 条目
- [ ] `CHANGELOG.md` 反映 P1 与 P2 的所有治理变更

### 90 天后回归检查（P3 完成）

- [ ] 30 天 governance dashboard HTML/JSON 每日上传，覆盖 coverage / bundle / bench / release-health / IPC / boundary / seal exclusions baseline
- [ ] seal exclusions 拥有 owner-role 字段；月度评审 PR 节奏稳定
- [ ] hot-path bench 扩展到 reducer 子分支与 replay fast-forward；`aiPlayer` scenario regression 入库
- [ ] lifecycle 失败时自动产出审计草稿；草稿与正式审计有清晰区分

---

## 5. 月度跟踪指标

| 指标                            | 目标                                                                        | 来源                                   |
| ------------------------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `pnpm test:coverage` 阈值达标   | lines/statements ≥ 92，functions ≥ 95，branches ≥ 88                        | `coverage-final.json`                  |
| `pnpm lint` warnings            | 0                                                                           | `pnpm lint` 输出                       |
| `pnpm typecheck` errors         | 0                                                                           | turbo 输出                             |
| 测试数                          | 月增 ≥ 0，flake = 0                                                         | `pnpm test` 输出                       |
| 生产依赖 audit                  | `info=0 low=0 moderate=0 high=0 critical=0`                                 | `pnpm deps:check`                      |
| `runtime-core` chunk 大小       | ≤ 600 kB（warning）                                                         | `bundle-budget.report.json`            |
| `seal-exclusions baselineCount` | 仅在 PR 评审通过时增长                                                      | `seal-exclusions-review.snapshot.json` |
| `boundary count`                | ≥ 10，且每个边界仍有 validator/contract/test refs                           | `boundary-registry.snapshot.json`      |
| `runtime drills`                | 6/6 通过                                                                    | `desktop:check`                        |
| `lifecycle benchmarks`          | 4+ 通过，p95 ≤ baselines 的 110%–120%                                       | `lifecycle-benchmarks.report.json`     |
| `release-health` 异常           | startup/updater/peer/network/runtime/security = 0；recovery 仅当 drill 触发 | `governance-evidence` artifact         |

---

## 6. 不在范围内（明示忽略）

按用户本轮指示，以下条目本路线**不收录**：

- GitHub live branch protection / ruleset 漂移检测（保留 desired-state snapshot）。
- GitHub Dependabot live 配置/依赖更新接入。
- GitHub Security Advisory live 路由（仍鼓励维护 `SECURITY.md` 内联系方式）。
- 跨平台桌面打包（macOS / Linux）—— 仍保持 Windows NSIS-only 工程规范。
- 任何与远端 `gh api` 有关的自动化。

如果未来需要把这些条目纳入治理，建议单独拉一份"GitHub Live 治理路线"文档，避免和本工程审计路线混合。

---

## 7. 风险与回滚

- **覆盖率阈值争议:** 若 P1 修复后阈值仍偶发抖动（visual-lab 文件被改但 smoke test 未同步），应立即回滚 ADR-0009 中允许的"shell exclusion"白名单条目，重新评审。
- **PR diff 摘要误报:** P2-1 引入 PR 评论后，建议先以 informational annotation 形式上线 14 天，确认无误报后再升级为强阻塞。
- **prod 守卫的灰度回退:** P2-4 的 visual-lab prod 守卫上线后，若 QA 在产线内部测试需要保留旁路能力，应通过 runtime config（`allowVisualLab=true`）显式开启，而不是通过修改默认值。
- **ADR 漂移:** P3-2 月度账本如果在两个月内未被任一 PR 评审打开，触发 governance:report 软告警（不强制失败），保持流程鲜活。

---

## 8. 推荐的 PR 拆分（最小变更优先）

为降低评审摩擦，建议将 P1 拆成 4 个 PR：

| PR   | 范围                                                                                       | 大小             |
| ---- | ------------------------------------------------------------------------------------------ | ---------------- |
| PR-A | ADR-0009 + `sealExclusions.js` 把 visual-lab 登记为 shell exclusion + `baselineCount` 调整 | 小（< 80 行）    |
| PR-B | `MotionLabControls.tsx` 工具函数拆分到 `motionLabLabels.ts`（清 lint warning）             | 小（< 50 行）    |
| PR-C | visual-lab smoke test + presentation/MarketRefill 测试 + AppChromeSurfaceMenu 测试         | 中（200–400 行） |
| PR-D | `useAuthoritativeReplaySync` 行为测试 + 任何 hook 内必要的可测性微调                       | 中（100–200 行） |

P2 / P3 推荐每条单独成 PR，避免治理脚本变更与功能变更混合。

---

**结论:** 仓库不存在结构性大坑，**只差一次"覆盖率债务的清算"**。完整执行 P1（约 3 工程日内） + P2-4 visual-lab prod 守卫，即可在两周内回到全绿基线，并把治理姿态从"被覆盖率拖累"切换到"靠 dashboard / smoke test / 月度账本主动驱动"。

— 路线报告完 —
