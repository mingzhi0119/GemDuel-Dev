# 工程治理独立审计与 9/10 提升路线图

审计日期：`2026-04-19`

审计角色：独立代码审计员

当前总评：`8/10`

前序文档归档：

- `archive/governance/ENGINEERING_GOVERNANCE_ROADMAP_8_OF_10_ARCHIVED_2026-04-19.md`
- `AUDIT_REMEDIATION_TRACKER_ARCHIVED_2026-04-19.md`

强制 `Status` 取值：

- `Completed`
- `In Progress`
- `Unstarted`
- `Blocked`

## 审计输入

| 检查项                  | 结果                                                                                                                                                 | 审计结论                                                                 | Status      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------- |
| `npm run lint`          | 通过                                                                                                                                                 | 基础静态规则仍然有效                                                     | `Completed` |
| `npm test`              | 通过，`34` 个测试文件，`197` 个测试用例                                                                                                              | 回归面稳定，负路径已具备治理基础                                         | `Completed` |
| `npm run test:coverage` | 通过，`Statements 75.07% / Branches 64.65% / Functions 83.1% / Lines 75.07%`                                                                         | 覆盖治理有效，但热点文件离 `9/10` 仍有距离                               | `Completed` |
| `npm run desktop:check` | 通过                                                                                                                                                 | Electron 桌面治理门禁持续生效                                            | `Completed` |
| `npm run deps:check`    | 通过，生产漏洞 `0/0/0/0/0`                                                                                                                           | 依赖治理门禁稳定                                                         | `Completed` |
| 结构抽样                | 已核查 `src/App.tsx`、`src/logic/actionValidation.ts`、`src/hooks/useGameNetwork.ts`、`src/hooks/useOnlineManager.ts`、`electron/main.js` 等核心文件 | 当前主要短板集中在分层、类型契约收敛、热点覆盖率、桌面 E2E、运行告警闭环 | `Completed` |

## 关键结构观察

| 观察项                    | 证据                                                                                                                                                                                                            | 治理影响                                                                          | Status        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------- |
| 大文件仍然偏多            | `src/logic/actionValidation.ts` `762` 行，`src/App.tsx` `699` 行，`src/hooks/useOnlineManager.ts` `421` 行，`src/logic/actions/marketActions.ts` `432` 行，`src/types.ts` `489` 行，`electron/main.js` `438` 行 | 工程边界清晰度不足，影响 `Architecture Layering`、`Type Contracts`、`Correctness` | `In Progress` |
| Hook 目录缺少独立测试文件 | `src/hooks` 下当前没有 `*.test.ts(x)`                                                                                                                                                                           | 在线恢复、连接健康、UI 编排的 `9/10` 证据不够强                                   | `In Progress` |
| 覆盖率热点不均衡          | `gameReducer.ts 56.16%`、`marketActions.ts 54.42%`、`networkProtocol.ts branch 34.61%`                                                                                                                          | 关键路径已被覆盖，但复杂分支仍未达治理级充分性                                    | `In Progress` |
| 边界治理已形成制度化门禁  | `TEST_GOVERNANCE_MATRIX.md`、`ELECTRON_IPC_ALLOWLIST.md`、`DEPENDENCY_RUNTIME_GOVERNANCE.md`、`RELEASE_HEALTH_CHECKLIST.md`、CI workflow 已联动                                                                 | 当前 `8/10` 的主要来源是“有制度、有脚本、有门禁”                                  | `Completed`   |

## 十维度独立评分

| 维度                                                       | 当前分数 | 目标分数 | 审计依据                                                                          | 未达 `9/10` 的主因                                                                  | Status        |
| ---------------------------------------------------------- | -------- | -------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| 1. 正确性 `Correctness`                                    | `8/10`   | `9/10`   | `commandGate`、`fsm`、`gameReducer`、`replayImport` 与 `197` 个测试已形成基础闭环 | 规则仍分散在 reducer/action handler，关键交易与特殊流程仍依赖分布式校验             | `In Progress` |
| 2. 边界安全 `Boundary Security`                            | `8/10`   | `9/10`   | 网络消息、回放导入、ICE runtime、IPC sender 都有显式校验                          | 本地文件导入、渲染层错误呈现、边界清单化仍不够统一                                  | `In Progress` |
| 3. 状态机一致性 `State Machine Consistency`                | `8/10`   | `9/10`   | `fsm.ts` 与 `commandGate.ts` 已能拒绝非法 phase/action 组合                       | 过渡矩阵仍不是完全声明式单一真源，子流程约束仍散落在 handler 中                     | `In Progress` |
| 4. 联机权威模型 `Online Authority`                         | `8/10`   | `9/10`   | `GuestIntent` 权限表、checksum、recovery、host approval log 已具备                | Host 审批与 hook 编排仍耦合，hook 级恢复测试缺失                                    | `In Progress` |
| 5. Electron 安全 `Electron Security`                       | `8/10`   | `9/10`   | preload 合同、IPC allowlist、sender 授权、桌面检查脚本均已落地                    | 缺少运行中窗口级 E2E/故障注入验证                                                   | `In Progress` |
| 6. 架构分层 `Architecture Layering`                        | `7/10`   | `9/10`   | 逻辑层、网络层、桌面层已有边界意识                                                | 仍存在多个超大文件与“编排 + 规则 + UI + IO”混杂现象                                 | `In Progress` |
| 7. 类型契约 `Type Contracts`                               | `8/10`   | `9/10`   | TS + Zod + typed protocol DTO 已覆盖热路径                                        | `src/types.ts` 过于集中，`actionValidation.ts` 仍以手写守卫为主，桌面契约未独立建模 | `In Progress` |
| 8. 测试治理 `Test Coverage`                                | `8/10`   | `9/10`   | 负路径矩阵、属性测试、桌面合同测试、覆盖阈值均已存在                              | 热点覆盖率偏低，hooks 与 Electron 运行态 E2E 不足                                   | `In Progress` |
| 9. 可观测性与运维 `Observability / Operations`             | `7/10`   | `9/10`   | release health 结构化日志、指标聚合、checklist 已存在                             | 仍缺少告警下沉、SLO、导出报表、例行演练                                             | `In Progress` |
| 10. 依赖与配置治理 `Dependency / Configuration Governance` | `8/10`   | `9/10`   | 周期审计、release gate、runtime env policy、生产漏洞为零                          | 缺少 SBOM/license gate、secret scanning、TURN 凭据短时化方案                        | `In Progress` |

## 到 `9/10` 的总体路线图

| 阶段              | 时间窗口    | 聚焦维度                                                                                  | 关键产物                                                     | 阶段验收标准                                                           | Status      |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | ----------- |
| Phase 1: 结构收敛 | 第 `1-2` 周 | `Architecture Layering`、`Type Contracts`、`Correctness`                                  | 模块拆分、契约分层、规则收口                                 | 大文件下降，核心规则不再散落在 UI/hook/handler 多处                    | `Unstarted` |
| Phase 2: 边界加固 | 第 `3-4` 周 | `Boundary Security`、`State Machine Consistency`、`Online Authority`、`Electron Security` | 统一边界清单、状态迁移矩阵、纯函数审批服务、桌面故障注入测试 | 每个外部入口都有 validator、每个 phase-sensitive action 都有矩阵化测试 | `Unstarted` |
| Phase 3: 证据补齐 | 第 `5` 周   | `Test Coverage`                                                                           | hooks 测试、热点覆盖率提升、Electron E2E harness             | 关键热点覆盖率与分支率达到新阈值                                       | `Unstarted` |
| Phase 4: 运维闭环 | 第 `6` 周   | `Observability / Operations`、`Dependency / Configuration Governance`                     | 健康报表、告警阈值、SBOM/license/secret gate                 | 从“可记录”升级到“可发现、可预警、可复盘”                               | `Unstarted` |
| Phase 5: 复审封板 | 第 `7` 周   | 全部维度                                                                                  | 二次独立审计结果                                             | 十个维度全部达到或高于 `9/10`                                          | `Unstarted` |

## 逐维度按步计划

### 1. 正确性 `Correctness`

| Step  | 行动                                                                             | 交付物                                | 验收标准                                                     | Owner        | Status      |
| ----- | -------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ | ------------ | ----------- |
| `1.1` | 抽离统一领域规则层，将交易、保留、皇家选择、特权、回放合法性前置到纯函数规则模块 | `src/logic/domainRules.ts` 或同级模块 | 规则型 action 不再主要依赖 UI 守卫                           | Domain Logic | `Unstarted` |
| `1.2` | 为 `marketActions`、`gameReducer`、`royalActions` 补齐负路径与场景回归           | 新增 reducer/scenario tests           | 每个高风险 action 至少有 `1` 个非法输入测试与 `1` 个场景测试 | Domain Logic | `Unstarted` |
| `1.3` | 统一拒绝原因枚举，避免仅靠 `console.warn` 表达失败                               | 可复用的 rejection reason map         | 失败原因可测试、可记录、可展示                               | Domain Logic | `Unstarted` |

### 2. 边界安全 `Boundary Security`

| Step  | 行动                                                                                 | 交付物                   | 验收标准                                      | Owner                   | Status      |
| ----- | ------------------------------------------------------------------------------------ | ------------------------ | --------------------------------------------- | ----------------------- | ----------- |
| `2.1` | 建立边界清单，覆盖 renderer 输入、网络消息、回放文件、IPC、runtime env、本地文件读取 | `BOUNDARY_INVENTORY.md`  | 每个边界都映射到 owner 与 validator           | Security + Platform     | `Unstarted` |
| `2.2` | 将回放导入与本地文件读取包装成统一安全入口，补齐大小、类型、schema、错误码           | `Replay IO` 安全包装模块 | 任意非法回放输入都 fail closed 且无未处理异常 | Frontend + Domain Logic | `Unstarted` |
| `2.3` | 把安全回归套件接入 PR 必跑集                                                         | CI 流程与安全测试分组    | 新增边界不会绕过测试矩阵                      | Release Engineering     | `Unstarted` |

### 3. 状态机一致性 `State Machine Consistency`

| Step  | 行动                                                      | 交付物                        | 验收标准                                     | Owner             | Status      |
| ----- | --------------------------------------------------------- | ----------------------------- | -------------------------------------------- | ----------------- | ----------- |
| `3.1` | 将 phase/action 合法性整理为单一声明式迁移矩阵            | `src/logic/fsmPolicy.ts`      | 迁移矩阵成为唯一真源                         | Domain Logic      | `Unstarted` |
| `3.2` | 把 handler 中散落的 phase 切换前提上收至 FSM/command gate | FSM policy + slimmer handlers | phase 散落判断显著减少                       | Domain Logic      | `Unstarted` |
| `3.3` | 增加 phase-sensitive transition matrix tests              | 新增 matrix tests             | 每个 phase-sensitive action 都有正反两类测试 | QA + Domain Logic | `Unstarted` |

### 4. 联机权威模型 `Online Authority`

| Step  | 行动                                                                               | 交付物                                 | 验收标准                                 | Owner      | Status      |
| ----- | ---------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------- | ---------- | ----------- |
| `4.1` | 将 host 审批逻辑从 `useGameNetwork` 中抽到纯函数服务层                             | `src/logic/hostApproval.ts` 或同级模块 | host approval 不再依赖 React hook 上下文 | Networking | `Unstarted` |
| `4.2` | 为晚到 decision、checksum mismatch、heartbeat unstable、reconnect 编写 hook 级测试 | `src/hooks/__tests__/...`              | 联机恢复路径有 deterministic tests       | Networking | `Unstarted` |
| `4.3` | 规范化 approval log 与 recovery reason taxonomy                                    | 统一日志结构与 reason enum             | 所有拒绝/恢复都有结构化原因码            | Networking | `Unstarted` |

### 5. Electron 安全 `Electron Security`

| Step  | 行动                                                                                  | 交付物                                  | 验收标准                               | Owner            | Status      |
| ----- | ------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------- | ---------------- | ----------- |
| `5.1` | 补一个桌面窗口级故障注入 harness，覆盖 fail-load、untrusted sender、update edge cases | Electron E2E / harness tests            | 不只检查静态配置，也验证运行态失败路径 | Desktop Platform | `Unstarted` |
| `5.2` | 把 `RELEASE_HEALTH_CHECKLIST.md` 中可机检项脚本化                                     | 新增脚本或 CI 检查                      | 发布前检查不依赖纯人工阅读             | Desktop Platform | `Unstarted` |
| `5.3` | 将 preload/allowlist drift 结果固化为快照差异审计                                     | 快照或 machine-readable policy artifact | 新能力暴露必须伴随显式审计变更         | Desktop Platform | `Unstarted` |

### 6. 架构分层 `Architecture Layering`

| Step  | 行动                                                                                      | 交付物                                     | 验收标准                       | Owner                 | Status      |
| ----- | ----------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------ | --------------------- | ----------- |
| `6.1` | 拆分 `src/App.tsx`，将 replay IO、layout shell、game surface、desktop runtime config 分离 | 更小的 container/component 模块            | `App.tsx` 从超大入口降为装配根 | Frontend              | `Unstarted` |
| `6.2` | 按边界拆分 `actionValidation.ts`、`useOnlineManager.ts`、`types.ts`                       | `validators/`、`network/`、`types/` 子模块 | 文件职责单一，命名与边界一致   | Frontend + Networking | `Unstarted` |
| `6.3` | 输出工程分层图，明确 UI / Hooks / Domain / Network / Desktop 边界                         | `ARCHITECTURE_LAYER_MAP.md`                | 后续新代码有可遵循的层级约束   | Tech Lead             | `Unstarted` |

### 7. 类型契约 `Type Contracts`

| Step  | 行动                                                                     | 交付物                         | 验收标准                           | Owner                   | Status      |
| ----- | ------------------------------------------------------------------------ | ------------------------------ | ---------------------------------- | ----------------------- | ----------- |
| `7.1` | 将 `src/types.ts` 按领域拆分为 `domain`、`network`、`desktop`、`ui` 契约 | `src/types/` 目录              | 类型边界更清楚，跨层依赖减少       | Frontend + Domain Logic | `Unstarted` |
| `7.2` | 将剩余高风险手写守卫逐步迁移到 schema-first validator                    | boundary schema modules        | 关键边界不再依赖超长手写判定链     | Domain Logic            | `Unstarted` |
| `7.3` | 把 `window.electron` 合同独立成桌面契约文件并补强 contract tests         | `src/types/desktop.ts` + tests | renderer 与 preload 合同演进可追踪 | Desktop Platform        | `Unstarted` |

### 8. 测试治理 `Test Coverage`

| Step  | 行动                                                                                          | 交付物                             | 验收标准                                   | Owner                 | Status      |
| ----- | --------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------ | --------------------- | ----------- |
| `8.1` | 先补热点覆盖率：`gameReducer.ts`、`marketActions.ts`、`networkProtocol.ts`                    | 新增 hotspot tests                 | 以上热点文件覆盖率达到新基线               | QA + Domain Logic     | `Unstarted` |
| `8.2` | 新建 `src/hooks/__tests__/`，覆盖 `useGameNetwork`、`useOnlineManager`、`useConnectionHealth` | hook tests                         | 联机恢复与连接健康从逻辑测试扩展到编排测试 | QA + Networking       | `Unstarted` |
| `8.3` | 新增 Electron 运行态 E2E / harness，并提高覆盖阈值                                            | 更新 `vitest.config.ts` 与桌面测试 | 覆盖阈值随热点补强一起提升                 | QA + Desktop Platform | `Unstarted` |

建议的新测试阈值：

- 总体：`Statements >= 80%`
- 总体：`Branches >= 70%`
- 关键热点：`gameReducer.ts >= 75%`
- 关键热点：`marketActions.ts >= 70%`
- 关键热点：`networkProtocol.ts branch >= 60%`

### 9. 可观测性与运维 `Observability / Operations`

| Step  | 行动                                                                  | 交付物               | 验收标准                                 | Owner            | Status      |
| ----- | --------------------------------------------------------------------- | -------------------- | ---------------------------------------- | ---------------- | ----------- |
| `9.1` | 为 release health snapshot 增加可导出的诊断脚本或 dashboard artifact  | 诊断脚本 / 导出 JSON | 会话健康状态可留痕、可比对               | Desktop Platform | `Unstarted` |
| `9.2` | 定义启动、更新、联机、恢复的 SLO 与告警阈值                           | `OPERATIONS_SLO.md`  | 告警从“有日志”提升到“有阈值”             | Operations       | `Unstarted` |
| `9.3` | 建立月度故障演练清单，覆盖 updater fail、IPC reject、network recovery | 演练记录模板         | 关键故障路径被定期验证，不只在代码层验证 | Operations + QA  | `Unstarted` |

### 10. 依赖与配置治理 `Dependency / Configuration Governance`

| Step   | 行动                                               | 交付物                             | 验收标准                                   | Owner                          | Status      |
| ------ | -------------------------------------------------- | ---------------------------------- | ------------------------------------------ | ------------------------------ | ----------- |
| `10.1` | 新增 SBOM 与 license 审计 workflow                 | `dependency-governance` 扩展流水线 | 不只看漏洞，也看供应链可见性与许可证       | Release Engineering            | `Unstarted` |
| `10.2` | 增加 secret scanning 与 env 变更审计规则           | secrets scan + env policy checks   | 新增配置项必须登记 owner、默认值、失效模式 | Security + Release Engineering | `Unstarted` |
| `10.3` | 设计并接入短时 TURN 凭据下发方案，替代长期静态注入 | 服务端签发方案与客户端对接计划     | 运行期敏感凭据不再长期存在于客户端环境变量 | Networking                     | `Blocked`   |

## `9/10` 封板标准

| 维度           | 封板标准                                                      | Status      |
| -------------- | ------------------------------------------------------------- | ----------- |
| 正确性         | 规则型 action 均通过统一规则层与场景测试证明                  | `Unstarted` |
| 边界安全       | 每个外部入口都有 owner、schema、fail-closed 行为              | `Unstarted` |
| 状态机一致性   | phase/action 迁移矩阵成为唯一真源                             | `Unstarted` |
| 联机权威模型   | host approval 与 recovery 具备纯函数核心和 hook 级测试        | `Unstarted` |
| Electron 安全  | 静态门禁 + 运行态故障注入双覆盖                               | `Unstarted` |
| 架构分层       | 超大编排文件被拆解，层级图可执行                              | `Unstarted` |
| 类型契约       | 契约分层完成，边界验证 schema-first                           | `Unstarted` |
| 测试治理       | 热点覆盖率与 hooks/E2E 补齐到新阈值                           | `Unstarted` |
| 可观测性与运维 | 关键健康信号具备导出、阈值、演练、复盘                        | `Unstarted` |
| 依赖与配置治理 | 漏洞、许可证、SBOM、secret、runtime config 全部进入制度化门禁 | `Unstarted` |

## 推荐执行顺序

| 优先级 | 执行动作                                                               | 关联维度      | 预期收益                                       | Status      |
| ------ | ---------------------------------------------------------------------- | ------------- | ---------------------------------------------- | ----------- |
| `P0`   | 拆 `App.tsx`、`actionValidation.ts`、`useOnlineManager.ts`、`types.ts` | `6`、`7`、`1` | 先解决 9 分之前最大的结构性瓶颈                | `Unstarted` |
| `P1`   | 补 hooks 测试与热点覆盖率                                              | `8`、`4`、`1` | 直接提升证据强度，降低回归风险                 | `Unstarted` |
| `P2`   | 完成状态迁移矩阵与边界清单                                             | `2`、`3`      | 把治理知识从“分散在代码里”升级到“可审计的资产” | `Unstarted` |
| `P3`   | 补 Electron 运行态故障注入与运维导出                                   | `5`、`9`      | 让桌面治理从静态门禁升级为运行态治理           | `Unstarted` |
| `P4`   | 扩展依赖治理到 SBOM/license/secret/TURN 凭据                           | `10`          | 补齐供应链与配置治理最后一公里                 | `Unstarted` |
