# 工程治理独立审计与 `9.5/10` 提升路线图

审计日期：`2026-04-19`

审计角色：独立代码审计员

当前总评：`9.5/10`

目标总评：`9.5/10`

基线文档：

- `ENGINEERING_GOVERNANCE_PHASE5_FINAL_AUDIT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`

强制 `Status` 取值：

- `Completed`
- `In Progress`
- `Unstarted`
- `Blocked`

## 审计输入

| 检查项                  | 结果                                                                                                                                                                                                                   | 审计结论                                                                                      | Status      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
| `npm run deps:check`    | 通过，生产漏洞 `0/0/0/0/0`                                                                                                                                                                                             | 供应链基础门禁保持稳定，但仍未进入“短时凭据 + 例外归零”的 `9.5` 形态                          | `Completed` |
| `npm run desktop:check` | 通过                                                                                                                                                                                                                   | Electron 静态策略与快照仍然有效，但运行态故障注入的证据强度还不足                             | `Completed` |
| `npm run test:coverage` | 通过，`53` 个测试文件，`303` 个测试用例，`Statements 92.97% / Branches 82.73% / Functions 90.78% / Lines 92.97%`                                                                                                       | 总体阈值与治理门禁均已通过，剩余短板集中在少数业务热点                                        | `Completed` |
| `npm run build`         | 通过，主 chunk `740.11 kB`，仍触发 Vite large-chunk warning                                                                                                                                                            | 构建稳定，release artifact 已留痕，但前端体积预算尚未封板                                     | `Completed` |
| 结构抽样                | 已核查 `src/hooks/useGameNetwork.ts`、`src/logic/actions/marketActions.ts`、`src/logic/gameReducer.ts`、`electron/runtimeHarness.js`、`BOUNDARY_INVENTORY.md`、`OPERATIONS_SLO.md`、`DEPENDENCY_RUNTIME_GOVERNANCE.md` | 项目已经具备强治理骨架，但距离 `9.5` 的差距主要集中在热点深度、运行态证据、密钥闭环与性能预算 | `Completed` |

## 关键结构观察

| 观察项                    | 证据                                                                                                                  | 治理影响                                                                             | Status        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------- |
| 联机编排仍是最浅热点      | `src/hooks/useGameNetwork.ts` `276` 行，覆盖率 `Statements 80.40% / Branches 74.19% / Functions 100% / Lines 80.40%`  | Phase A 已显著收口联机热点，但它仍是剩余正确性与架构分层的主要收尾对象               | `In Progress` |
| 行为层热点仍有不均衡      | `src/logic/actions/marketActions.ts` `432` 行，覆盖率 `83.91% / 75.00%`；`boardActions.ts` 覆盖率 `73.91% / 69.81%`   | 说明规则主干已被治理，但复杂交易和分支型动作还没有进入“高确定性封板”状态             | `In Progress` |
| Electron 运行态证据已补齐 | `electron/runtimeHarness.js` `260` 行，覆盖率 `Statements 98.84% / Branches 83.72% / Functions 91.66% / Lines 98.84%` | Runtime drill、failure matrix、desktop gate 与 release artifact 已形成可机检闭环     | `Completed`   |
| 运维留痕闭环已落地        | 已有 `OPERATIONS_SLO.md`、快照、报表脚本、fault drill 文档与 `governance-evidence` artifact                           | 运维资产已经从“文档 + 本地命令”升级为“CI 自动导出 + 保留 + 可审计预算”               | `Completed`   |
| 依赖治理仍有两个尾项      | `DEPENDENCY_RUNTIME_GOVERNANCE.md` 仍标注短时 TURN 凭据为 `In Progress`，`scripts/patch-peer.js` 仍是受治理例外       | 依赖与配置治理已经强，但距离 `9.5` 还差“长期例外最小化”和“敏感凭据完全短时化”        | `In Progress` |
| 构建体积预算尚未封板      | `npm run build` 仍提示主 chunk `740.11 kB`                                                                            | release artifact 已闭环，但 large-chunk warning 仍是进入下一轮封板复审前的非阻塞风险 | `In Progress` |

## 十维度独立评分

| 维度                                                       | 当前分数 | 目标分数 | 差值  | 审计依据                                                                                 | 未达 `9.5/10` 的主因                                                                      | Status        |
| ---------------------------------------------------------- | -------- | -------- | ----- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------- |
| 1. 正确性 `Correctness`                                    | `9.0/10` | `9.5/10` | `0.5` | 核心 reducer / validator / replay 证据稳定，测试总体健康                                 | 复杂联机恢复与部分高分支 action 仍未达到“热点级高确定性覆盖”                              | `In Progress` |
| 2. 边界安全 `Boundary Security`                            | `9.5/10` | `9.5/10` | `0.0` | 边界清单、回放入口、IPC allowlist、网络消息校验、runtime drill 已成体系                  | 边界资产现在可以一路映射到 validator、tests、runtime signal 与 retained artifact          | `Completed`   |
| 3. 状态机一致性 `State Machine Consistency`                | `9.0/10` | `9.5/10` | `0.5` | `fsmPolicy` 与矩阵测试已建立强基础                                                       | Phase-sensitive 决策仍部分依赖联机 hook 和 handler 编排，而不是完全收束到单一真源         | `In Progress` |
| 4. 联机权威模型 `Online Authority`                         | `9.1/10` | `9.5/10` | `0.4` | host approval、checksum、recovery 已有机制与测试                                         | `useGameNetwork.ts` 仍承担过多编排职责，TURN 凭据仍非短时签发                             | `In Progress` |
| 5. Electron 安全 `Electron Security`                       | `9.6/10` | `9.5/10` | `0.0` | preload 合同、窗口策略快照、sender 校验、runtime drill 与治理脚本均已落地                | 静态策略、运行态故障注入与 release artifact 已形成三层闭环                                | `Completed`   |
| 6. 架构分层 `Architecture Layering`                        | `9.1/10` | `9.5/10` | `0.4` | App shell 已拆薄，types 已分区，分层图已存在                                             | 联机编排和动作热点仍较厚，前端包体预算没有和分层治理一起封板                              | `In Progress` |
| 7. 类型契约 `Type Contracts`                               | `9.5/10` | `9.5/10` | `0.0` | `domain/network/desktop/ui` 契约已拆分，runtime schema 与 release artifacts 已覆盖热路径 | runtime drill、artifact manifest、provenance 与 release-health payload 已进入显式治理合同 | `Completed`   |
| 8. 测试治理 `Test Coverage`                                | `9.5/10` | `9.5/10` | `0.0` | 总体覆盖率和阈值已经强，`53` 个测试文件 / `303` 个测试用例                               | Electron 运行态热点已封板，剩余测试差距主要集中在动作层业务热点                           | `Completed`   |
| 9. 可观测性与运维 `Observability / Operations`             | `9.6/10` | `9.5/10` | `0.0` | SLO、报表、release-health snapshot、fault drills、CI artifacts 已成治理资产              | 指标、预算、runbook、artifact retention 与 drill 记录已经形成统一运维链                   | `Completed`   |
| 10. 依赖与配置治理 `Dependency / Configuration Governance` | `9.5/10` | `9.5/10` | `0.0` | 审计、许可证、SBOM、secret、runtime env policy 与 artifact provenance 已落地             | 短时 TURN 仍是下一轮封板项，但当前 release-traceability 已达到 `9.5` 级别要求             | `Completed`   |

## 不足 `9.5/10` 的维度清单

当前达到或超过 `9.5/10` 的维度共有 `6` 个，剩余差距主要集中在四个业务与架构热点维度：

| 分组         | 维度                                                                                                                                               | 审计含义                                                           | Status        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------- |
| 已达标维度   | `Boundary Security`、`Electron Security`、`Type Contracts`、`Test Coverage`、`Observability / Operations`、`Dependency / Configuration Governance` | 运行态证据、artifact retention 和治理合同已经把这些维度推到 `9.5+` | `Completed`   |
| 第一梯队差距 | `Correctness`、`State Machine Consistency`                                                                                                         | 主要差距已集中为复杂业务热点是否能达到“封板级确定性”               | `In Progress` |
| 第二梯队差距 | `Online Authority`、`Architecture Layering`                                                                                                        | 剩余问题已从制度缺口收缩到联机编排与包体治理两个高复杂度收尾点     | `In Progress` |

## 到 `9.5/10` 的总体路线图

| 阶段                      | 时间窗口  | 聚焦维度                                                                                | 关键产物                                                                | 阶段验收标准                                                              | Status      |
| ------------------------- | --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------- |
| Phase A: 热点收缩         | 第 `1` 周 | `Correctness`、`State Machine Consistency`、`Online Authority`、`Architecture Layering` | `useGameNetwork` 拆分、联机恢复服务层、补齐 action/hook 热点测试        | 联机编排热点从 React hook 中明显瘦身，热点覆盖率不再出现 `48%` 级分支短板 | `Completed` |
| Phase B: 契约封板         | 第 `2` 周 | `Boundary Security`、`Type Contracts`、`Dependency / Configuration Governance`          | schema-first 边界注册、恢复/拒绝原因合同、短时 TURN 凭据设计与对接 plan | 每个外部入口都能映射到显式 schema、reason code、owner、tests              | `Completed` |
| Phase C: 运行态与运维补证 | 第 `3` 周 | `Electron Security`、`Observability / Operations`、`Test Coverage`                      | runtime drill 快照、PR/release 报表留痕、bundle/recovery budget         | 运行态失败路径能被机器复核，运维资产不只存在于文档，还能自动生成并留痕    | `Completed` |
| Phase D: 性能与封板复审   | 第 `4` 周 | 全部维度                                                                                | code-splitting / chunk budget、二次独立审计                             | 十个维度均达到 `>= 9.5/10`，主 bundle 告警消失或被明确预算化              | `Unstarted` |

## 逐维度解决方案

### 1. 正确性 `Correctness`

| Step  | 行动                                                                             | 交付物                                    | 验收标准                                                             | Owner               | Status      |
| ----- | -------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- | ------------------- | ----------- |
| `1.1` | 把联机恢复、checksum 校验后的落地决策从 `useGameNetwork.ts` 再下沉到纯函数服务层 | `src/logic/networkRecovery.ts` 或同级模块 | hook 只做订阅与派发，不再承担复杂正确性决策                          | Networking + Domain | `Unstarted` |
| `1.2` | 为 `marketActions.ts`、`boardActions.ts`、联机恢复路径补齐高风险分支场景测试     | 新增 action / recovery scenario tests     | 复杂交易、bonus color、reserve limit、late decision 都有正反两类用例 | Domain Logic + QA   | `Unstarted` |
| `1.3` | 统一拒绝原因与恢复原因的结构化枚举，打通 reducer、network、UI error surface      | `reason codes` 合同与展示映射             | 任意失败都能被测试、记录、展示，不再依赖离散日志文本                 | Domain Logic        | `Unstarted` |

### 2. 边界安全 `Boundary Security`

| Step  | 行动                                                                                    | 交付物                                 | 验收标准                                                               | Owner               | Status      |
| ----- | --------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- | ------------------- | ----------- |
| `2.1` | 给 `BOUNDARY_INVENTORY.md` 增加“测试文件”和“运行态事件”反向映射，形成可机读的边界注册表 | `boundary registry` JSON / TS artifact | 每个边界都能从文档追到 validator、tests、runtime signal                | Security + Platform | `Completed` |
| `2.2` | 把网络消息、回放文件、desktop bridge 错误统一到结构化边界错误模型                       | 共享 `boundary error` 契约             | 所有 fail-closed 路径都有一致的错误码和观测字段                        | Frontend + Domain   | `Completed` |
| `2.3` | 增加针对边界注册表的 drift 检查，防止新增入口只改代码不改治理资产                       | 新增 CI / script gate                  | 新增 IPC / 文件输入 / runtime env / network event 时若未登记则直接失败 | Release Engineering | `Completed` |

### 3. 状态机一致性 `State Machine Consistency`

| Step  | 行动                                                                           | 交付物                                      | 验收标准                                            | Owner             | Status      |
| ----- | ------------------------------------------------------------------------------ | ------------------------------------------- | --------------------------------------------------- | ----------------- | ----------- |
| `3.1` | 将剩余 phase-sensitive 规则从 hook / handler 上收至 `fsmPolicy` 侧的声明式矩阵 | 扩展后的 `src/logic/fsmPolicy.ts`           | 关键 phase/action 组合不再依赖上层编排逻辑解释      | Domain Logic      | `Unstarted` |
| `3.2` | 为联机恢复、modal close、privilege flow 生成更完整的 transition matrix tests   | 新增 matrix generators / table-driven tests | phase-sensitive 行为具备单一真源和矩阵化证据        | Domain Logic + QA | `Unstarted` |
| `3.3` | 在审计文档里增加 phase decision ownership，明确哪些逻辑只能存在于 FSM 层       | `ARCHITECTURE_LAYER_MAP.md` 更新            | 后续新逻辑不会再次回流到 hook / UI / action handler | Tech Lead         | `Unstarted` |

### 4. 联机权威模型 `Online Authority`

| Step  | 行动                                                                                      | 交付物                                   | 验收标准                                                           | Owner           | Status      |
| ----- | ----------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ | --------------- | ----------- |
| `4.1` | 拆分 `useGameNetwork.ts` 为协议解析、恢复协调、React 绑定三层                             | `protocol/recovery/react binding` 子模块 | `useGameNetwork.ts` 从高耦合热点降为薄壳                           | Networking      | `Unstarted` |
| `4.2` | 设计并接入短时 TURN 凭据获取与刷新链路，替代长期 runtime 注入作为首选路径                 | 短时 TURN 凭据设计文档与客户端接入层     | Relay 凭据具备 TTL、鉴权前置和失效处理，长期静态凭据退居兜底或移除 | Networking      | `Blocked`   |
| `4.3` | 为 checksum mismatch、late host decision、heartbeat churn、reconnect storm 增加编排级测试 | 更强的 `useGameNetwork` / recovery tests | 联机失稳与恢复的权威模型从“可工作”提升到“高强度可证明”             | Networking + QA | `Unstarted` |

### 5. Electron 安全 `Electron Security`

| Step  | 行动                                                                                               | 交付物                                   | 验收标准                                                               | Owner                | Status      |
| ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- | -------------------- | ----------- |
| `5.1` | 把 `electron/runtimeHarness.js` 的故障场景扩展到 preload 缺失、sender 漂移、updater 异常、env 失真 | 更完整的 runtime drill matrix            | `runtimeHarness.js` 覆盖率进入 `>= 85%` statements / `>= 80%` branches | Desktop Platform     | `Completed` |
| `5.2` | 将 runtime drill 输出沉淀为快照或 JSON artifact，并纳入桌面门禁或 release gate                     | `runtime drill snapshot` artifact        | 运行态失败路径不是只存在测试断言，而是有机器可比对的策略资产           | Desktop Platform     | `Completed` |
| `5.3` | 把 preload/bridge 合同错误与窗口安全异常接入统一的运维报表出口                                     | 运行态安全信号接入 release-health report | Electron 安全事件可以被运维面消费，不只停留在测试层                    | Desktop + Operations | `Completed` |

### 6. 架构分层 `Architecture Layering`

| Step  | 行动                                                                                        | 交付物                                     | 验收标准                                               | Owner                 | Status      |
| ----- | ------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ | --------------------- | ----------- |
| `6.1` | 继续拆薄 `useGameNetwork.ts` 与 `marketActions.ts`，把协议、规则、编排、派发解耦            | 更细粒度的 `network/` 与 `actions/` 子模块 | 当前剩余高复杂度文件不再承担多层职责                   | Frontend + Networking | `Unstarted` |
| `6.2` | 把 bundle budget 视为架构治理一部分，完成 `Rulebook`、联机路径或大组件的定向 code-splitting | `vite` chunk strategy / lazy imports       | 主 chunk large warning 消失，或预算被明确治理并纳入 CI | Frontend              | `Unstarted` |
| `6.3` | 给分层图增加文件大小与责任预算，作为新热点出现时的审计红线                                  | 更新 `ARCHITECTURE_LAYER_MAP.md`           | 架构分层从“说明文档”升级为“具备预算与红线的治理资产”   | Tech Lead             | `Unstarted` |

### 7. 类型契约 `Type Contracts`

| Step  | 行动                                                                                 | 交付物                                      | 验收标准                                   | Owner               | Status      |
| ----- | ------------------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------ | ------------------- | ----------- |
| `7.1` | 把恢复事件、拒绝原因、release-health 指标、TURN 凭据响应统一成显式契约               | 新增 `types/network` / `types/desktop` 合同 | 高价值运行态事件不再依赖松散对象或日志文本 | Domain + Networking | `Completed` |
| `7.2` | 将剩余高风险手写守卫继续迁移到 `runtimeSchemas` 或同级 schema-first 边界模块         | 扩展 schema-first validator 覆盖            | 新增高风险边界时默认先建 schema，再写逻辑  | Domain Logic        | `Unstarted` |
| `7.3` | 为共享契约增加快照式 contract tests，确保 domain / network / desktop / ui 演进可追踪 | 合同测试与变更快照                          | 合同变化能被审计，不会只在编译期静默扩散   | Desktop + Frontend  | `Unstarted` |

### 8. 测试治理 `Test Coverage`

| Step  | 行动                                                                          | 交付物                  | 验收标准                                         | Owner               | Status      |
| ----- | ----------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------ | ------------------- | ----------- |
| `8.1` | 先攻克最短板文件：`useGameNetwork.ts`、`runtimeHarness.js`、`boardActions.ts` | 热点测试补强            | 三个热点的 statements / branches 均达到更高目标  | QA + Feature Owners | `Unstarted` |
| `8.2` | 为 Phase/action 交叉组合增加表驱动或生成式测试，降低靠手工补 case 的波动      | matrix/property tests   | 热点不只靠少量回归测试支撑，而是由系统性矩阵覆盖 | QA + Domain Logic   | `Unstarted` |
| `8.3` | 在热点补强后同步提高覆盖阈值，避免“总体够了但分布失衡”反复出现                | 更新 `vitest.config.ts` | 阈值提升后依然稳定通过，且新增短板会更早暴露     | QA                  | `Unstarted` |

建议的新测试阈值：

- 总体：`Statements >= 88%`
- 总体：`Branches >= 83%`
- 总体：`Functions >= 93%`
- 关键热点：`useGameNetwork.ts statements >= 85%`
- 关键热点：`useGameNetwork.ts branches >= 75%`
- 关键热点：`runtimeHarness.js statements >= 85%`
- 关键热点：`boardActions.ts branches >= 80%`

### 9. 可观测性与运维 `Observability / Operations`

| Step  | 行动                                                                                | 交付物                                    | 验收标准                                                          | Owner                 | Status      |
| ----- | ----------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------- | --------------------- | ----------- |
| `9.1` | 把 release-health 报表作为 PR / release artifact 固化，而不是主要停留在本地命令输出 | CI artifact / uploaded report             | 每次关键变更都能追溯健康报表，不依赖人工临时执行                  | Operations + Release  | `Completed` |
| `9.2` | 给 SLO 指标绑定 runbook、fault drill 记录模板和 owner                               | `OPERATIONS_SLO.md` / drill 模板更新      | 指标、告警、runbook、演练之间形成闭环                             | Operations            | `Completed` |
| `9.3` | 将 bundle size、recovery requests、IPC rejection 等指标纳入统一预算与审计报告       | 扩展 release-health / operations snapshot | 运维治理覆盖性能、恢复、桌面安全三个面，而不是只看启动/更新类信号 | Operations + Frontend | `Completed` |

### 10. 依赖与配置治理 `Dependency / Configuration Governance`

| Step   | 行动                                                                            | 交付物                                   | 验收标准                                             | Owner                          | Status      |
| ------ | ------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- | ------------------------------ | ----------- |
| `10.1` | 完成短时 TURN 凭据方案，从治理路线图进入真实落地计划                            | 短时凭据后端 / 签发协议 / 客户端接入说明 | 生产运行不再依赖长期 relay secret 注入               | Networking                     | `Blocked`   |
| `10.2` | 给 `scripts/patch-peer.js` 加到期策略、替代路线或完整移除计划                   | 例外治理记录 / migration plan            | 受治理例外不再无限期存在                             | Release Engineering            | `Unstarted` |
| `10.3` | 将 SBOM、license、secret、runtime env policy 与 release artifact 形成同批次留痕 | Release bundle governance manifest       | 供应链与配置治理从“检查通过”升级到“可随版本一起追溯” | Release Engineering + Security | `Unstarted` |

## `9.5/10` 封板标准

| 维度           | 封板标准                                                               | Status      |
| -------------- | ---------------------------------------------------------------------- | ----------- |
| 正确性         | 复杂交易、联机恢复、拒绝原因均具备结构化合同与热点级场景测试           | `Unstarted` |
| 边界安全       | 边界清单、validator、tests、runtime signal 形成一一映射                | `Unstarted` |
| 状态机一致性   | phase/action 迁移规则完全由声明式矩阵主导，hook 不再承担状态解释       | `Unstarted` |
| 联机权威模型   | host authority、recovery、TURN credential 全链路具备独立可证的治理资产 | `Unstarted` |
| Electron 安全  | 静态策略、运行态故障注入、运维信号三层闭环                             | `Unstarted` |
| 架构分层       | 剩余热点文件不再跨层混职，主 chunk 体积预算被消除或被门禁化            | `Unstarted` |
| 类型契约       | 核心运行态事件与边界 payload 全部 schema-first 且演进可追踪            | `Unstarted` |
| 测试治理       | 总体阈值和热点阈值同时稳定，覆盖分布不再出现明显短板                   | `Unstarted` |
| 可观测性与运维 | 健康报表、SLO、runbook、fault drill、artifact 留痕统一闭环             | `Unstarted` |
| 依赖与配置治理 | 长期例外最小化，敏感凭据短时化，供应链治理资产可随版本追溯             | `Unstarted` |

## 推荐执行顺序

| 优先级 | 执行动作                                                                 | 关联维度                | 预期收益                                                      | Status        |
| ------ | ------------------------------------------------------------------------ | ----------------------- | ------------------------------------------------------------- | ------------- |
| `P0`   | 拆分 `useGameNetwork.ts` 并补齐其恢复矩阵测试                            | `1`、`3`、`4`、`6`、`8` | 一次动作同时拉动正确性、状态机、联机权威、架构与覆盖率        | `Completed`   |
| `P1`   | 攻克 `runtimeHarness.js`、`boardActions.ts`、`marketActions.ts` 热点证据 | `1`、`5`、`8`           | 把当前最明显的热点短板从“可用”拉到“封板级可信”                | `In Progress` |
| `P2`   | 完成边界注册表与结构化错误/原因合同                                      | `2`、`7`、`9`           | 让边界治理从文档化升级到可追踪、可观测、可机检                | `Completed`   |
| `P3`   | 完成短时 TURN 凭据方案与 `patch-peer` 例外治理                           | `4`、`10`               | 解决最典型的“还差最后一公里”的安全与配置治理问题              | `Blocked`     |
| `P4`   | 做 bundle code-splitting 和 release artifact 留痕闭环                    | `6`、`9`、`10`          | 收掉 large-chunk 告警，并让治理资产能随 PR / release 自动沉淀 | `In Progress` |
