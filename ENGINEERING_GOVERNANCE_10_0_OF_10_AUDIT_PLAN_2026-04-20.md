# 工程治理独立审计与 `10.0/10` 提升路线图

审计日期：`2026-04-20`

审计角色：独立代码审计员

当前总评：`9.9/10`

目标总评：`10.0/10`

基线文档：

- `ENGINEERING_GOVERNANCE_PHASE_D_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE5_FINAL_AUDIT_2026-04-20.md`
- `DEPENDENCY_RUNTIME_GOVERNANCE.md`

强制 `Status` 取值：

- `Completed`
- `In Progress`
- `Unstarted`
- `Blocked`

## `2026-04-20` 最终复审更新

- `P0` 到 `P4` 已全部完成，并已通过当天重新执行的治理 gate、全量测试、覆盖率、构建、治理产物导出与桌面打包烟雾验证。
- 新的独立复审结论见 `ENGINEERING_GOVERNANCE_PHASE5_FINAL_AUDIT_2026-04-20.md`：项目已从 `9.6/10` 提升到 `9.9/10`，但本轮复审没有直接授予无条件 `10.0/10` 封板。
- 剩余差距已不再是 TURN、`patch-peer`、`reason code`、FSM 真源或 contract snapshot 这类原始阻塞，而是两条更硬的封板条件：`ARCHITECTURE_LAYER_MAP.md` 的预算/ownership 尚未由专门 gate 强制执行，以及 `vitest.config.ts` 的覆盖率硬阈值仍低于路线图里建议的 `10.0/10` 水位。
- 下方阻塞表与分阶段表保留了最初规划语义；最终状态应以本节更新和最终复审文档为准。

## 总体判断

当前版本已经达到“高强度工程治理”的 `9.6/10`，但离 `10.0/10` 的最后差距不再主要来自仓内热点拆分或覆盖率补强，而是来自两类更硬的系统性条件：

1. 必须消除跨系统外部依赖造成的剩余不确定性，尤其是短时 TURN 凭据的真实服务端签发、轮换、吊销闭环。
2. 必须把现有强治理能力继续升级为“不可回退”的硬门禁，包括 `reason code` 真源、FSM 单一真源、合同快照、release batch traceability，以及依赖例外归零。

若只做仓内增强而不落地服务端短时凭据与依赖例外退场，本项目的现实上限更接近 `9.8 ~ 9.9/10`；若能同时完成外部依赖闭环与最后一层机器可审计门禁，则 `10.0/10` 具备可达性。

## 审计输入

| 检查项               | 结果                                                                                                                                                                                                   | 审计结论                                                                                                                   | Status      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Phase D 复评分基线   | 已复核 `ENGINEERING_GOVERNANCE_PHASE_D_REASSESSMENT_2026-04-19.md`，当前十维度均 `>= 9.5/10`，总评 `9.6/10`                                                                                            | 项目已经越过“封板线”，但尚未消除所有长期不确定性                                                                           | `Completed` |
| `9.5/10` 路线图回查  | 已复核 `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md` 中所有未完成尾项                                                                                                                    | 目前仍存在 `reason code` 真源、FSM ownership、contract snapshot、TURN、`patch-peer` 等尾项                                 | `Completed` |
| 依赖与运行态治理回查 | 已复核 `DEPENDENCY_RUNTIME_GOVERNANCE.md`                                                                                                                                                              | `GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON` 已有合同，但服务端短时凭据签发仍未在仓内闭环；`scripts/patch-peer.js` 仍是受治理例外 | `Completed` |
| 结构抽样             | 已核查 `src/logic/fsmPolicy.ts`、`src/logic/runtimeSchemas.ts`、`src/types/network.ts`、`src/types/runtime.ts`、`src/hooks/useGameNetwork.ts`、`scripts/patch-peer.js`、`scripts/buildBudgetReport.js` | 关键路径已经很强，但最后一公里更多是“系统真源”和“例外归零”问题，而不是简单的代码风格问题                                   | `Completed` |
| 仓库状态             | `git status --short --branch` 显示 `main` 分支相对远端 `ahead 13`，工作区 clean                                                                                                                        | 本路线图基于当前已验证代码状态，不存在未提交脏改动干扰审计判断                                                             | `Completed` |

## 决定性阻塞强度排序

| 阻塞编号 | 决定性阻塞                                                                                                        | 阻塞强度   | 影响维度                | 为什么它是决定性阻塞                                                                     | Status      |
| -------- | ----------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| `B0`     | 服务端短时 TURN 凭据签发、刷新、吊销链路尚未真实落地                                                              | `Critical` | `4`、`10`               | 没有这条链路，就无法声明联机敏感凭据已经从长期注入过渡到受鉴权、可轮换、可失效的满分形态 | `Blocked`   |
| `B1`     | `scripts/patch-peer.js` 仍是受治理依赖例外                                                                        | `Critical` | `5`、`10`               | `10/10` 不接受长期存在的桌面构建 workaround，即便例外已被记录，也仍然不是最终态          | `Unstarted` |
| `B2`     | 失败/拒绝/恢复原因尚未形成跨 reducer、network、UI 的统一 `reason code` 真源                                       | `High`     | `1`、`2`、`3`、`7`、`9` | 只要错误面仍依赖离散消息或局部映射，就不能证明“所有失败都可测试、可展示、可审计”         | `Unstarted` |
| `B3`     | 剩余 phase-sensitive 决策尚未完全收敛到 `fsmPolicy` 声明式矩阵                                                    | `High`     | `1`、`3`、`6`、`8`      | `10/10` 需要 phase/action 组合只存在一个真源，而不是由 handler、hook、UI 共同解释        | `Unstarted` |
| `B4`     | 共享合同还缺快照式 contract tests，剩余高风险边界也未完全 schema-first 化                                         | `High`     | `2`、`7`、`10`          | 仅靠 TS 编译和局部运行时验证还不够，合同演进本身也要可追踪、可审计                       | `Unstarted` |
| `B5`     | release batch traceability 还未把 SBOM、license、secret、runtime、bundle、release-health 完整绑定为同批次治理资产 | `Medium`   | `8`、`9`、`10`          | 没有同批次追溯，就仍然存在“检查都通过，但版本级证据未完全对齐”的治理缝隙                 | `Unstarted` |

## 十维度 `10.0/10` 独立评分差距

| 维度                                                       | 当前分数 | 目标分数  | 差值  | 决定性阻塞             | 达到 `10.0/10` 的关键条件                                                                                  | Status        |
| ---------------------------------------------------------- | -------- | --------- | ----- | ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------------- |
| 1. 正确性 `Correctness`                                    | `9.5/10` | `10.0/10` | `0.5` | `B2`、`B3`             | 所有高风险失败路径都有统一 `reason code`、矩阵化状态迁移证据和可重复回放测试                               | `In Progress` |
| 2. 边界安全 `Boundary Security`                            | `9.5/10` | `10.0/10` | `0.5` | `B2`、`B4`             | 每个边界都 schema-first、登记可追溯、错误模型统一，且新增入口若未登记直接失败                              | `In Progress` |
| 3. 状态机一致性 `State Machine Consistency`                | `9.5/10` | `10.0/10` | `0.5` | `B2`、`B3`             | phase/action/recovery 决策完全收敛到 `src/logic/fsmPolicy.ts` 与矩阵生成器，不再分散在 hook / handler / UI | `In Progress` |
| 4. 联机权威模型 `Online Authority`                         | `9.5/10` | `10.0/10` | `0.5` | `B0`                   | host authority 之外，TURN 凭据也必须变成受鉴权、短时化、可轮换、可吊销的治理资产                           | `Blocked`     |
| 5. Electron 安全 `Electron Security`                       | `9.6/10` | `10.0/10` | `0.4` | `B1`                   | 桌面路径不能再依赖 `node_modules` 级补丁例外，运行态/静态策略/供应链都必须无长期 workaround                | `In Progress` |
| 6. 架构分层 `Architecture Layering`                        | `9.6/10` | `10.0/10` | `0.4` | `B3`                   | 分层图不仅描述结构，还要约束文件体积、职责预算和 phase decision ownership，且可被门禁复核                  | `In Progress` |
| 7. 类型契约 `Type Contracts`                               | `9.5/10` | `10.0/10` | `0.5` | `B2`、`B4`             | `domain/network/desktop/ui/runtime` 合同要有统一错误码、合同快照与可追踪演进记录                           | `In Progress` |
| 8. 测试治理 `Test Coverage`                                | `9.6/10` | `10.0/10` | `0.4` | `B3`、`B5`             | 从“高覆盖”升级到“证明级覆盖”：矩阵生成、属性式测试、热点阈值和 release 证据同步抬高                        | `In Progress` |
| 9. 可观测性与运维 `Observability / Operations`             | `9.6/10` | `10.0/10` | `0.4` | `B2`、`B5`             | 错误/恢复/IPC/性能/凭据全都能进入统一报表，并与版本级 artifact 一同保留和追溯                              | `In Progress` |
| 10. 依赖与配置治理 `Dependency / Configuration Governance` | `9.5/10` | `10.0/10` | `0.5` | `B0`、`B1`、`B4`、`B5` | 短时凭据真实落地、依赖例外归零、release manifest 成批次留痕，且无“仅文档治理”的残留                        | `Blocked`     |

## 到 `10.0/10` 的总体路线图

| 阶段                    | 建议时序    | 聚焦阻塞   | 关键产物                                                                         | 阶段验收标准                                                           | Status      |
| ----------------------- | ----------- | ---------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| Phase E: 决策合同统一   | 第 `1` 周   | `B2`       | `reason code` 真源、`boundary error` 真源、UI 展示映射、运维报表映射             | 所有失败/拒绝/恢复都能以统一结构化合同贯通 reducer、network、UI、ops   | `Unstarted` |
| Phase F: FSM 单一真源   | 第 `2` 周   | `B3`       | `fsmPolicy` 扩展、matrix generator、ownership 文档、property/table-driven tests  | phase-sensitive 决策不再散落在 hook / handler / UI，矩阵测试成为主证据 | `Unstarted` |
| Phase G: 凭据与例外归零 | 第 `3-4` 周 | `B0`、`B1` | 短时 TURN 服务端签发方案与客户端接入、`patch-peer` 移除或替代迁移                | 联机凭据短时化真实可用，桌面构建链路不再依赖长期 patch 例外            | `Blocked`   |
| Phase H: 版本级封板     | 第 `5` 周   | `B4`、`B5` | contract snapshots、schema-first 收尾、release governance manifest、二次独立审计 | 所有治理资产能随版本整批次追溯，且十维度均具备不可回退门禁             | `Unstarted` |

## 逐维度解决方案

### 1. 正确性 `Correctness`

| Step  | 行动                                                                       | 交付物                                                                 | 验收标准                                               | Owner                     | Status      |
| ----- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------- | ----------- |
| `1.1` | 把拒绝原因、恢复原因、边界失败原因统一成共享 `reason code` 合同            | `src/types/network.ts`、`src/types/runtime.ts`、`src/types/ui.ts` 更新 | 任意失败都能被测试、记录、展示，且不再依赖自由文本判断 | Domain Logic + Networking | `Unstarted` |
| `1.2` | 为复杂联机恢复、action 失败、边界拒绝场景增加“成功/失败/重试/回退”对称用例 | 新增 scenario tests 与 replay fixtures                                 | 每个高风险流程至少有正反两类用例和结构化断言           | Domain Logic + QA         | `Unstarted` |
| `1.3` | 将 `reason code` 接入 release-health / runtime drill 出口                  | 运维报表字段扩展                                                       | 错误语义在产品层和审计层保持一致                       | Operations + Platform     | `Unstarted` |

### 2. 边界安全 `Boundary Security`

| Step  | 行动                                                                              | 交付物                           | 验收标准                               | Owner               | Status      |
| ----- | --------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------- | ------------------- | ----------- |
| `2.1` | 将剩余高风险手写守卫迁移到 `src/logic/runtimeSchemas.ts` 或同级 schema-first 模块 | 扩展 validator 覆盖面            | 高风险边界默认先写 schema，再写逻辑    | Security + Domain   | `Unstarted` |
| `2.2` | 为边界错误增加快照式合同测试                                                      | boundary/contract snapshot tests | 合同变化会触发显式审计，而不是静默扩散 | Security + QA       | `Unstarted` |
| `2.3` | 把边界注册表和错误码注册表一起做 drift gate                                       | CI / script gate                 | 新边界或新错误码未登记即失败           | Release Engineering | `Unstarted` |

### 3. 状态机一致性 `State Machine Consistency`

| Step  | 行动                                                                | 交付物                    | 验收标准                                              | Owner             | Status      |
| ----- | ------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- | ----------------- | ----------- |
| `3.1` | 将剩余 phase-sensitive 规则继续上收至 `src/logic/fsmPolicy.ts`      | 扩展后的 `fsmPolicy` 矩阵 | phase/action/privilege/recovery 决策不再由外层解释    | Domain Logic      | `Unstarted` |
| `3.2` | 为 phase 迁移和联机恢复引入 matrix generator / property-style tests | matrix tests、生成式测试  | 关键迁移规则从“挑 case”提升到“系统性穷举/抽样证明”    | Domain Logic + QA | `Unstarted` |
| `3.3` | 在 `ARCHITECTURE_LAYER_MAP.md` 补齐 phase decision ownership        | 更新后的架构图            | 后续逻辑回流到 hook / UI / handler 会被明确判定为越界 | Tech Lead         | `Unstarted` |

### 4. 联机权威模型 `Online Authority`

| Step  | 行动                                                                                     | 交付物                                                                     | 验收标准                                                   | Owner                | Status    |
| ----- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------- | --------- |
| `4.1` | 设计短时 TURN 凭据服务端签发、鉴权、轮换、吊销协议                                       | 设计文档、服务端接口、客户端 fetch/refresh flow                            | 凭据具备 TTL、身份前置、失效处理和观测字段                 | Networking + Backend | `Blocked` |
| `4.2` | 将 renderer / desktop runtime 从“优先读取 runtime bundle”升级为“优先在线获取短时 bundle” | `electron/runtimeConfig.js`、`src/app/runtime/useRuntimeAppConfig.ts` 更新 | 长期 relay secret 不再是主路径，只保留受治理兜底或完全移除 | Networking + Desktop | `Blocked` |
| `4.3` | 为 credential expired、fetch fail、refresh fail、revoke、fallback deny 增加权威模型测试  | 新增 authority / recovery tests                                            | 凭据生命周期异常也能被机器证明是 fail-closed               | Networking + QA      | `Blocked` |

### 5. Electron 安全 `Electron Security`

| Step  | 行动                                                           | 交付物                             | 验收标准                                                       | Owner                          | Status      |
| ----- | -------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------- | ------------------------------ | ----------- |
| `5.1` | 为 `peer` 依赖找到无补丁升级路径、替代库或构建侧无侵入修复方案 | migration plan / dependency change | `scripts/patch-peer.js` 不再参与正式构建链路                   | Desktop Platform               | `Unstarted` |
| `5.2` | 将例外退场写入依赖治理与 release gate                          | 文档、workflow、gate 更新          | 任何重新引入 `patch-peer` 或同类 workaround 的变更都会触发门禁 | Release Engineering + Security | `Unstarted` |

### 6. 架构分层 `Architecture Layering`

| Step  | 行动                                                              | 交付物         | 验收标准                                 | Owner                           | Status      |
| ----- | ----------------------------------------------------------------- | -------------- | ---------------------------------------- | ------------------------------- | ----------- |
| `6.1` | 给 `ARCHITECTURE_LAYER_MAP.md` 增加文件体积预算、职责预算和 owner | 更新后的分层图 | 热点回潮不再只能靠人工观察，而有明确红线 | Tech Lead                       | `Unstarted` |
| `6.2` | 把 phase decision ownership 和 budget gate 纳入审计与 CI          | 文档 + gate    | 新逻辑若跨层混职或突破预算可被自动识别   | Tech Lead + Release Engineering | `Unstarted` |

### 7. 类型契约 `Type Contracts`

| Step  | 行动                                                                                  | 交付物         | 验收标准                                        | Owner              | Status      |
| ----- | ------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------- | ------------------ | ----------- |
| `7.1` | 为 `domain/network/desktop/ui/runtime` 核心合同增加快照式 contract tests              | 合同测试与快照 | 合同变更会留下可审计 diff，而不是只在编译期通过 | Frontend + Desktop | `Unstarted` |
| `7.2` | 将 `reason code`、`boundary error`、release-health payload、TURN payload 纳入显式合同 | 合同统一更新   | 高价值运行态对象不再依赖松散结构                | Domain + Platform  | `Unstarted` |

### 8. 测试治理 `Test Coverage`

| Step  | 行动                                                                        | 交付物                      | 验收标准                                   | Owner               | Status      |
| ----- | --------------------------------------------------------------------------- | --------------------------- | ------------------------------------------ | ------------------- | ----------- |
| `8.1` | 从场景测试升级为矩阵测试与属性式测试                                        | matrix/property test suites | 关键流程不再依赖“手工补 case”维持高分      | QA + Domain Logic   | `Unstarted` |
| `8.2` | 提高总体阈值和热点阈值                                                      | `vitest.config.ts` 更新     | 阈值提升后仍稳定通过，且新增短板能更早暴露 | QA                  | `Unstarted` |
| `8.3` | 将 `scripts/buildBudgetReport.js`、治理导出脚本等非业务热点也拉高到满分附近 | scripts/tests 更新          | 版本治理证据链不再弱于产品主路径           | Release Engineering | `Unstarted` |

建议的 `10.0/10` 测试阈值：

- 总体：`Statements >= 95%`
- 总体：`Branches >= 90%`
- 总体：`Functions >= 95%`
- 总体：`Lines >= 95%`
- 关键热点：`marketActions.ts branches >= 90%`
- 关键热点：`fsmPolicy` / transition matrix `branches >= 90%`
- 关键热点：`runtime / governance scripts branches >= 90%`

### 9. 可观测性与运维 `Observability / Operations`

| Step  | 行动                                                                                                  | 交付物                | 验收标准                                         | Owner                            | Status      |
| ----- | ----------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ | -------------------------------- | ----------- |
| `9.1` | 将 `reason code`、边界错误、凭据状态、IPC rejection、bundle budget 统一并入 release-health 报表       | 扩展报表与快照        | 关键异常可以跨产品、桌面、网络、发布维度统一追踪 | Operations + Platform            | `Unstarted` |
| `9.2` | 把 release-health、runtime drill、bundle budget、SBOM、license、secret 组合成同批次 artifact manifest | `governance manifest` | 任一发布版本都能反向定位完整治理证据集           | Operations + Release Engineering | `Unstarted` |

### 10. 依赖与配置治理 `Dependency / Configuration Governance`

| Step   | 行动                                                                           | 交付物                      | 验收标准                                         | Owner                          | Status      |
| ------ | ------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------------ | ------------------------------ | ----------- |
| `10.1` | 完成短时 TURN 凭据真实落地，而不是仅保留路线图和 runtime preference            | 服务端、客户端、文档、测试  | 生产运行不再依赖长期 relay secret 注入主路径     | Networking + Backend           | `Blocked`   |
| `10.2` | 完整移除 `scripts/patch-peer.js` 或以正式升级替代                              | 依赖升级 / 替代实现         | 受治理例外归零，桌面构建链路不再修改第三方包内容 | Desktop Platform               | `Unstarted` |
| `10.3` | 把 SBOM、license、secret、runtime、bundle、release-health 形成版本级同批次留痕 | release governance manifest | 治理资产可随版本一起上传、比对、审计和追责       | Release Engineering + Security | `Unstarted` |

## `10.0/10` 封板标准

| 维度           | 封板标准                                                                   | Status      |
| -------------- | -------------------------------------------------------------------------- | ----------- |
| 正确性         | 所有高风险失败都具备统一 `reason code`、矩阵化迁移证据和可回放验证         | `Unstarted` |
| 边界安全       | 所有外部入口都 schema-first、注册在册、错误码统一、未登记即门禁失败        | `Unstarted` |
| 状态机一致性   | phase/action/recovery 真源只存在于 `fsmPolicy` 与矩阵生成器                | `Unstarted` |
| 联机权威模型   | host authority 与 TURN credential lifecycle 均可独立审计且真实短时化       | `Blocked`   |
| Electron 安全  | preload、runtime、dependency delivery path 均无长期例外和补丁式 workaround | `Unstarted` |
| 架构分层       | 分层图具备预算、红线、ownership 和 CI gate，不靠人工维持                   | `Unstarted` |
| 类型契约       | 核心合同全部显式、schema-first、带快照、带变更追踪                         | `Unstarted` |
| 测试治理       | 总体阈值、热点阈值、矩阵测试、属性式测试同时稳定通过                       | `Unstarted` |
| 可观测性与运维 | 关键异常、指标、故障演练和 release 资产可跨版本同批次追溯                  | `Unstarted` |
| 依赖与配置治理 | 敏感凭据完全短时化、例外归零、供应链与运行态治理可随版本一起审计           | `Blocked`   |

## 推荐执行顺序

| 优先级 | 执行动作                                                         | 关联阻塞   | 关联维度                | 预期收益                                                    | Status      |
| ------ | ---------------------------------------------------------------- | ---------- | ----------------------- | ----------------------------------------------------------- | ----------- |
| `P0`   | 先完成 `reason code` 真源、`boundary error` 真源和 UI / ops 映射 | `B2`       | `1`、`2`、`3`、`7`、`9` | 一次动作同时提升正确性、边界、安全、合同和可观测性的一致性  | `Completed` |
| `P1`   | 再完成 `fsmPolicy` 收口、matrix generator、phase ownership 文档  | `B3`       | `1`、`3`、`6`、`8`      | 把最后的 phase-sensitive 解释权从外层组件彻底收回到单一真源 | `Completed` |
| `P2`   | 为核心合同补齐 snapshot tests，并将剩余边界迁移到 schema-first   | `B4`       | `2`、`7`、`10`          | 让合同演进本身变成可审计资产，而不是仅靠编译期约束          | `Completed` |
| `P3`   | 并行推进短时 TURN 服务端签发与客户端 refresh / revoke 接入       | `B0`       | `4`、`10`               | 解决冲击 `10/10` 的最硬外部阻塞                             | `Completed` |
| `P4`   | 退场 `patch-peer` 例外，并把 release manifest 做成同批次治理资产 | `B1`、`B5` | `5`、`9`、`10`          | 清除长期 workaround，并完成版本级证据闭环                   | `Completed` |
| `P5`   | 进行新一轮独立复审，确认 `P0-P4` 收尾状态并记录剩余封板差距      | 全部       | 全部                    | 让 `10.0/10` 审计结论以当天实测证据而非旧推断为准           | `Completed` |

## 关键路径说明

1. `B0` 是唯一明确依赖服务端/外部系统的硬阻塞，因此它决定了 `10.0/10` 的最短工期。
2. `B1` 是唯一明确依赖依赖升级或替代迁移的供应链阻塞，因此必须与 `B0` 并行推进，不能等最后再做。
3. `B2`、`B3`、`B4`、`B5` 均可在当前仓库内先行落地，建议优先完成，以避免在服务端阻塞期间浪费工程窗口。
4. 当 `B0` 与 `B1` 未解时，本项目可以继续增强，但不建议在审计上声称达到 `10.0/10`。
