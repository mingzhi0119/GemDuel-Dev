# GemDuel-Dev 工程级全生命周期审计报告

**审计对象:** `GemDuel-Dev`  
**仓库版本:** `5.2.11`  
**审计日期:** `2026-04-27`  
**审计方式:** 参照既有归档报告模板，执行仓库内完整工程门禁与治理脚本，按十个工程维度评分并输出 P0-P3 阻塞分级。  
**审计边界:** 本报告只给出证据、评分与整改建议，不执行功能整改。

---

## Executive Summary

本轮审计显示仓库治理主链路总体健康：`lint`、`typecheck`、`test`、`boundaries:check`、`architecture:check`、`deps:check`、`desktop:check`、`release:check`、`repo-settings:check`、`audit:gates`、`governance:report` 均通过；架构预算告警已清零（`0 warnings, 0 errors`），依赖安全审计仍为零漏洞。

唯一实质性阻塞仍集中在覆盖率封印链路：`pnpm test:coverage` 失败，且不仅分支覆盖率未达线（`87.38% < 88%`），语句与行覆盖率也未达当前 seal 阈值（`82.33% < 92%`），函数覆盖率也低于要求（`93.68% < 95%`）。由此直接导致 `pnpm lifecycle:certify` 失败，`tests-coverage` 维度在认证打分中被判定为 0。

**总体评分:** `9.00 / 10`  
**风险等级:** `Medium`（单点高影响阻塞）  
**P0 数量:** `0`  
**P1 数量:** `1`  
**P2 数量:** `3`  
**P3 数量:** `3`

---

## 10 维 Scorecard

| 维度                            |     分数 | 关键证据                                                                                          | 主要扣分点                                                                                  |
| ------------------------------- | -------: | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 架构分层与模块边界              | `9.6/10` | `pnpm architecture:check` 通过；`lifecycle-governance.dashboard.json` 显示 `0 warnings, 0 errors` | 尚未验证 GitHub live ruleset 漂移（仅 snapshot 模式）                                       |
| 逻辑解耦与状态所有权            | `9.3/10` | `boundaries:check` 通过，10 个治理边界一致                                                        | 仍需持续监控 UI/Hook 体积增长趋势                                                           |
| 契约、接口与边界验证            | `9.5/10` | `pnpm boundaries:check` 通过；`audit-gates.report.json` 覆盖契约门禁命令                          | 主要依赖 CI 与 snapshot，live 漂移检测仍是可选                                              |
| 类型安全与静态正确性            | `9.8/10` | `pnpm typecheck` 通过（5/5 tasks successful）                                                     | 无阻塞，仅常规回归风险                                                                      |
| 代码质量、可维护性与复杂度      | `9.0/10` | `pnpm lint` 通过                                                                                  | 存在 1 条 lint warning（`MotionLabControls.tsx` 的 `react-refresh/only-export-components`） |
| 测试策略、覆盖率与防 flake 能力 | `5.5/10` | `pnpm test` 通过（`136` files / `819` tests）；`test:coverage` 失败                               | 覆盖率 seal 多项未达阈值，是当前唯一发布阻塞                                                |
| 安全、依赖与供应链治理          | `9.7/10` | `deps:check` 通过；生产依赖审计 `info=0 low=0 moderate=0 high=0 critical=0`                       | 供应链面当前无阻塞，维持监控即可                                                            |
| CI/CD、发布与全生命周期管线     | `8.8/10` | `release:check`、`audit:gates`、`governance:report` 通过                                          | `lifecycle:certify` 被 coverage 失败级联阻断                                                |
| 可观测性、恢复与运行治理        | `9.4/10` | `desktop:check` 通过；6 个 runtime drills 通过                                                    | 运行治理健康，建议继续做趋势可视化                                                          |
| 文档、规范、ADR 与团队交接能力  | `9.4/10` | `repo-settings:check`、`codeowners`、`changelog` 均纳入治理脚本                                   | 文档已明显完善，但仍可增强审计可操作说明                                                    |

**算术平均:** `(9.6 + 9.3 + 9.5 + 9.8 + 9.0 + 5.5 + 9.7 + 8.8 + 9.4 + 9.4) / 10 = 9.00`

---

## Command Evidence Matrix

| 命令                       | Exit | 摘要                                                                                             |
| -------------------------- | ---: | ------------------------------------------------------------------------------------------------ |
| `pnpm lint`                |  `0` | 通过，`0 errors, 1 warning`                                                                      |
| `pnpm typecheck`           |  `0` | 通过，5/5 tasks successful                                                                       |
| `pnpm test`                |  `0` | 通过，`136` files / `819` tests                                                                  |
| `pnpm test:coverage`       |  `1` | 失败：`lines 82.33 < 92`，`statements 82.33 < 92`，`functions 93.68 < 95`，`branches 87.38 < 88` |
| `pnpm boundaries:check`    |  `0` | 通过，10 个 governed boundaries                                                                  |
| `pnpm architecture:check`  |  `0` | 通过，Architecture budget check passed                                                           |
| `pnpm deps:check`          |  `0` | 通过，生产依赖漏洞全 0                                                                           |
| `pnpm desktop:check`       |  `0` | 通过，desktop governance + 6 drills                                                              |
| `pnpm release:check`       |  `0` | 通过，release checklist/SLO/drill assets                                                         |
| `pnpm lifecycle:certify`   |  `1` | 失败：`coverage-branch failed: 87.39% / minimum 88.00%`                                          |
| `pnpm repo-settings:check` |  `0` | desired-state snapshot passed                                                                    |
| `pnpm audit:gates`         |  `0` | 写出 `artifacts/governance/audit-gates.report.json`                                              |
| `pnpm governance:report`   |  `0` | 写出 `artifacts/governance/lifecycle-governance.report.json`                                     |

---

## P0-P3 阻塞与整改计划

### P0

当前无。

### P1-1: 修复 coverage seal 失败并恢复 lifecycle certification

- **问题:** 覆盖率门禁失败导致生命周期认证失败。
- **证据:**
    - `pnpm test:coverage` 失败：`lines/statements/functions/branches` 均低于全局阈值。
    - `artifacts/governance/lifecycle-governance.dashboard.json`：`coverage-branch` 状态为 `failed`（`87.39% / minimum 88.00%`）。
    - `artifacts/governance/lifecycle-certification.report.json`：`tests-coverage` 维度 `score: 0`，整体 `status: failed`。
- **影响:** 阻断“十维本地认证”与对应 CI 主链路的全绿宣告。
- **建议动作:**
    1. 优先补齐低覆盖业务路径的分支测试；
    2. 对新增 UI 与交互分支补充行为测试/快照测试；
    3. 在不新增 exclusion 的前提下恢复 seal 阈值达标。
- **验收命令:** `pnpm test:coverage && pnpm lifecycle:certify`

### P2-1: 清除 lint warning

- **问题:** 存在 1 条 lint warning。
- **证据:** `apps/desktop/src/app/visual-lab/MotionLabControls.tsx`（`react-refresh/only-export-components`）。
- **影响:** 不阻塞发布，但影响“无告警基线”。
- **建议动作:** 将非组件导出拆分到独立模块。
- **验收命令:** `pnpm lint`

### P2-2: 为覆盖率下降建立预警前置

- **问题:** 单次变更导致 coverage seal 多指标同时跌破阈值。
- **证据:** 本次 `test:coverage` 同时触发 4 项全局阈值失败。
- **影响:** 问题暴露滞后到全量覆盖阶段，反馈成本偏高。
- **建议动作:**
    - 在 PR 阶段增加低成本 coverage diff 摘要；
    - 将“关键模块最低覆盖率”作为补充软门禁（先告警后强制）。
- **验收命令:** `pnpm test:coverage`（需附带可读 diff 摘要）

### P2-3: 将 lifecycle fail 的根因定位标准化

- **问题:** `lifecycle:certify` 失败时，团队需手工回溯到 dashboard 报告定位根因。
- **证据:** 当前失败信息虽包含指标名，但仍需跳转多个报告文件。
- **影响:** 修复路径查找耗时，影响故障恢复速度。
- **建议动作:** 在认证失败输出中直接附上失败指标、阈值、文件路径、建议命令。
- **验收命令:** `pnpm lifecycle:certify`

### P3-1: 治理趋势可视化增强

- **建议:** 基于 `artifacts/governance/*.json` 输出 30 天趋势视图，持续观察 coverage、bundle、drill 指标。

### P3-2: 覆盖率债务模块化拆账

- **建议:** 将低覆盖区域按模块归属（UI 交互、网络边界、回放链路）拆分为月度债务清单，逐项消减。

### P3-3: 认证报告与审计报告自动联动

- **建议:** 当 `lifecycle-certification.report.json` 失败时自动生成审计草稿模板，减少人工整理成本。

---

## 与上一版审计（2026-04-25）对比

对照 `docs/archive/engineering-audit-report-2026-04-25.md`：

- **总分变化:** `8.55 -> 9.00`（`+0.45`）  
  说明：结构治理项（架构预算、治理脚本覆盖）提升明显，抵消了 coverage 的单点拖累。
- **阻塞结构变化:**
    - 仍保留同一主阻塞：coverage seal / lifecycle certification。
    - 架构预算告警由“多文件 warning”收敛到 `0 warnings`。
    - lint 告警从此前多项收敛为 1 项。
- **风险姿态:** 维持 `Medium`。当前是“单点阻塞型中风险”，不是“多点系统性失稳”。

---

## 审计结论

仓库当前不满足“全绿发布治理态”，唯一硬阻塞是覆盖率封印链路。  
最短闭环路径：

1. 修复 `test:coverage` 四项阈值失败；
2. 复跑 `pnpm lifecycle:certify`；
3. 将 lint warning 清零并再次执行完整命令链确认。
