# GemDuel-Dev 工程级全生命周期审计报告

**审计对象:** `GemDuel-Dev`
**仓库版本:** `5.2.11`
**审计日期:** `2026-04-25`
**审计方式:** 独立工程审计。基于仓库工程规范、治理文档、CI/Release 配置、边界快照、契约快照、静态代码阅读和本地完整门禁执行结果。
**审计边界:** 本报告只记录发现和整改建议，不实施代码整改，不变更运行时代码、公共 API、游戏逻辑、类型契约或资产。

---

## Executive Summary

GemDuel-Dev 已经具备较成熟的工程治理基础：仓库有清晰的 `pnpm` + Turborepo 单仓结构，`packages/shared`、`packages/ui`、`apps/desktop`、`tools/scripts` 的职责边界在 `AGENTS.md` 和 `docs/governance/*` 中有明确规则；关键边界也已有机器可读快照和门禁，例如 `boundary-registry.snapshot.json`、`contract-registry.snapshot.json`、桌面安全策略、依赖 SBOM、Release Health 和 Runtime Drill。

本次审计最重要的结论是：**全生命周期管线设计完整，但当前点位不是全绿基线**。`pnpm test`、`pnpm typecheck`、`pnpm lint`、`pnpm architecture:check`、`pnpm boundaries:check`、`pnpm deps:check`、`pnpm desktop:check`、`pnpm release:check`、`pnpm build`、`pnpm bundle:check`、`pnpm test:security`、`pnpm governance:artifacts && pnpm governance:evidence:check` 均可完成；但 `pnpm test:coverage` 失败，原因是全局分支覆盖率 `87.57%` 低于门槛 `88%`。这会阻断 PR、Release 和 Governance Evidence 工作流，是当前唯一 P1 级工程缺口。

代码结构方面，项目的契约化和边界治理强于一般桌面应用：网络协议、Replay、IPC、Runtime Config、Release Health、依赖与许可均有不同程度的 fail-closed 机制。主要风险集中在三类：覆盖率封印已经低于治理阈值、若干 UI/Hook/Desktop 文件超过 review budget 但未触及 hard limit、以及团队治理材料仍偏“文档 checklist”，例如 CODEOWNERS 单一 owner、分支保护未以可验证 snapshot 固化。

**总体评分:** `8.55 / 10`
**风险等级:** `Medium`
**P0 数量:** `0`
**P1 数量:** `1`
**P2 数量:** `6`
**P3 数量:** `5`

---

## 10 维 Scorecard

| 维度                            |     分数 | 关键证据                                                                                                           | 主要扣分点                                                                        |
| ------------------------------- | -------: | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 架构分层与模块边界              | `8.4/10` | `AGENTS.md` 明确 workspace 边界；`architecture:check` 通过；`boundary-registry.snapshot.json` 覆盖 10 个边界       | 7 个文件超过 review budget，虽然未触发 hard limit                                 |
| 逻辑解耦与状态所有权            | `8.5/10` | `packages/shared` 保持领域逻辑核心；UI 主要消费 selector/handlers；Hook 层承担 orchestration                       | `useGameNetwork.ts` 接近 orchestration review budget，状态协调仍有继续拆分空间    |
| 契约、接口与边界验证            | `9.1/10` | `boundaries:check` 通过，10 个 governed boundaries；Replay/IPC/网络协议均有 validator/test refs                    | CODEOWNERS 与边界 owner 角色不一致，repo settings 仍偏 checklist                  |
| 类型安全与静态正确性            | `9.3/10` | `pnpm typecheck` 通过；严格 TS 配置由 workspace 统一管理；共享类型集中在 `packages/shared/src/types`               | 仍需持续约束测试辅助和脚本里的显式 escape hatch                                   |
| 代码质量、可维护性与复杂度      | `8.2/10` | `pnpm lint` 退出码 0；Husky + lint-staged 已启用；大部分复杂逻辑有测试                                             | lint 仍有 2 个 hook warning；若干文件超过 review budget                           |
| 测试策略、覆盖率与防 flake 能力 | `7.3/10` | `pnpm test` 通过，126 个 test files / 713 tests；`test:security` 通过                                              | `pnpm test:coverage` 失败，分支覆盖率 `87.57% < 88%`                              |
| 安全、依赖与供应链治理          | `8.9/10` | `deps:check` 通过；生产 audit 为 `info=0, low=0, moderate=0, high=0, critical=0`；SBOM/License/Secret gate 存在    | `SECURITY.md` 没有具体邮箱或 advisory URL fallback                                |
| CI/CD、发布与全生命周期管线     | `8.4/10` | PR、tag release、dependency cron、governance evidence cron 均存在；release provenance gate 已进入 release workflow | coverage gate 当前失败；分支保护只在 checklist 中描述，未形成 repo 可验证规则快照 |
| 可观测性、恢复与运行治理        | `9.0/10` | `desktop:check` 通过；Release Health、Runtime Drill、IPC reject、network recovery 有治理快照                       | 缺少长期趋势 dashboard 或性能/运行指标历史化视图                                  |
| 文档、规范、ADR 与团队交接能力  | `8.4/10` | `docs/README.md`、governance docs、ADR、CONTRIBUTING、SECURITY、CHANGELOG 存在                                     | `CHANGELOG.md` 无 released-version 记录；缺少 `CODE_OF_CONDUCT.md`                |

**算术平均:** `(8.4 + 8.5 + 9.1 + 9.3 + 8.2 + 7.3 + 8.9 + 8.4 + 9.0 + 8.4) / 10 = 8.55`

---

## Lifecycle Pipeline Review

当前生命周期管线覆盖了从开发、PR、依赖治理、发布、运行证据保留到故障演练的主链路：

- `governance.yml` 在 PR 和手动触发时运行 license、SBOM、secret、dependency、boundary、architecture、lint、typecheck、security test、unit test、coverage seal、seal exclusion、release health、desktop check、build、bundle budget、governance evidence。
- `build.yml` 在 `v*` tag 和手动触发时运行 release gate，并在发布前执行 `release:provenance:check`，降低从 feature branch 或不可追溯 SHA 发布的风险。
- `dependency-governance.yml` 每周一运行生产依赖治理，并上传 SBOM artifact。
- `governance-evidence.yml` 每日 10:00 UTC 在默认分支执行治理证据巡检，并保留 `governance-evidence` 30 天。

本地门禁证据显示，生命周期链路的结构是完整的，但当前状态不是 release-ready：

| 命令                                                          | 结果               | 摘要                                                      |
| ------------------------------------------------------------- | ------------------ | --------------------------------------------------------- |
| `pnpm typecheck`                                              | Pass               | 5/5 tasks successful                                      |
| `pnpm lint`                                                   | Pass with warnings | 0 errors, 2 warnings                                      |
| `pnpm test`                                                   | Pass               | 126 test files / 713 tests passed                         |
| `pnpm test:coverage`                                          | **Fail**           | branch coverage `87.57%`, threshold `88%`                 |
| `pnpm architecture:check`                                     | Pass with warnings | 7 files exceed review budget                              |
| `pnpm boundaries:check`                                       | Pass               | 10 governed boundaries                                    |
| `pnpm deps:check`                                             | Pass               | production audit all zero                                 |
| `pnpm desktop:check`                                          | Pass               | desktop governance and 6 runtime drills                   |
| `pnpm release:check`                                          | Pass               | checklist, operations SLO, drill assets                   |
| `pnpm build`                                                  | Pass               | runtime-core built at `282.12 kB`                         |
| `pnpm bundle:check`                                           | Pass               | runtime-core observed `275.51 kB`, below warning `600 kB` |
| `pnpm test:security`                                          | Pass               | security regression suite completed                       |
| `pnpm governance:artifacts && pnpm governance:evidence:check` | Pass               | governance evidence health passed                         |

**审计判断:** 管线设计达到工程级，但 release seal 被 coverage gate 阻断。P1 的优先级高于其他结构性优化。

---

## Contract & Boundary Review

契约和边界治理是本仓库的强项。`docs/governance/boundary-inventory.md` 与 `tools/governance/boundary-registry.snapshot.json` 将 10 个关键边界纳入治理：

- Renderer action dispatch
- Network message parsing
- Guest intent authority review
- Replay local file read
- Replay schema deterministic replay
- IPC bridge
- Desktop window security
- Runtime relay profile
- Release health checklist
- Dependency governance

这些边界有 validator refs、contract refs、runtime signals、test refs 和 fail-closed behavior。`pnpm boundaries:check` 返回 `Boundary governance check passed for 10 governed boundaries`，说明当前源代码与边界快照一致。

契约层也有较好的机器证据：

- `tools/governance/contract-registry.snapshot.json` 记录领域、桥接、网络、运行时等 contract schema。
- `apps/desktop/electron/preloadContract.cjs` 与 `docs/governance/electron-ipc-allowlist.md` 由 desktop governance gate 校验。
- Replay import 使用安全边界，`safeReplayImport` 与 shared replay loader/reader 测试覆盖非法 JSON、旧版本和非确定性 replay。
- 依赖、许可、SBOM、secret 和 runtime drill 均有独立 gate。

主要缺口不是契约缺失，而是“契约外治理”仍有人工依赖：

- CODEOWNERS 全部路由到 `@mingzhi0119`，与边界 registry 中的 Frontend + Domain Logic、Networking、Desktop Platform、Release Engineering 等 owner role 不完全一致。
- 分支保护、required checks 和直接 push 限制只记录在 `docs/governance/repo-settings-checklist.md`，没有可审计的 GitHub ruleset snapshot 或自动比对脚本。

**审计判断:** 技术契约成熟，组织/仓库设置契约还需要机器化。

---

## Logic Decoupling Review

项目整体符合“shared 领域逻辑纯化、UI 消费领域状态、desktop 平台隔离”的方向：

- `packages/shared` 承载 reducer、FSM、action validation、network protocol、replay、selectors、runtime schemas、card/buff data 等领域与契约代码。
- `packages/ui` 承载 React UI 和展示组件，可依赖 shared，但不依赖 `apps/desktop`。
- `apps/desktop` 负责 Electron renderer shell、hooks、runtime config、LAN/online orchestration 和 shell 组合。
- `tools/scripts` 承载治理、发布、证据导出和维护脚本。

当前解耦风险集中在 orchestration 和大型 UI 组合面：

- `apps/desktop/src/hooks/useGameNetwork.ts` 超出 hooks review budget：`303 > 300`，并有一个 `react-hooks/exhaustive-deps` warning。
- `apps/desktop/electron/lanDiscoveryService.js` 超出 Desktop Platform review budget：`458 > 400`。
- `AppChrome.tsx`、`Card.tsx`、`RulebookContent.ts`、`TopBar.tsx` 等 UI 组合或展示文件超过 review budget。
- `buffCopyCatalog.ts` 属于 reference data，但体量 `458 > 400`，后续本地化和词条扩展会继续放大。

这些问题没有破坏 hard limit，因此不是 P1；但它们会降低长期维护速度，并增加局部变更时误触状态和展示逻辑的概率。

**审计判断:** 核心逻辑没有明显越界，但 warning-band 文件需要 P2 拆分或 ADR 化，避免 warning 长期常态化。

---

## P0-P3 Remediation Plan

### P0 - 当前无

本轮审计未发现阻断发布以外的安全高危、数据损坏、核心游戏逻辑错误、契约破坏且无保护的问题。

### P1-1: 修复 coverage seal 失败

- **问题:** `pnpm test:coverage` 失败。
- **证据:** 覆盖率报告显示 `All files` 分支覆盖率为 `87.57%`，低于全局门槛 `88%`；713 个测试本身全部通过。
- **风险场景:** PR、tag release、governance evidence patrol 都包含 Coverage Seal Gate；当前点位若在 CI 重新执行会阻断合并、发布和每日证据巡检。
- **整改步骤:** 优先补齐低分支覆盖文件的负路径和 fallback 分支测试；建议先处理 `apps/desktop/src/hooks/gameNetwork/eventHandlers.ts`、`apps/desktop/electron/lanDiscoveryService.js`、`apps/desktop/src/app/io/safeReplayImport.ts`、`apps/desktop/src/app/io/useReplayIO.ts`、`apps/desktop/src/app/shell/gameShellStyles.ts`、`apps/desktop/src/hooks/useGameLogic.ts`。
- **验收标准:** `pnpm test:coverage` 退出码为 0，分支覆盖率大于等于 `88%`，且不新增 seal exclusion。
- **验证命令:** `pnpm test:coverage`
- **建议 owner 角色:** Frontend Platform + Networking

### P2-1: 消除 architecture review budget warnings

- **问题:** `pnpm architecture:check` 虽然通过，但有 7 个 review budget warning。
- **证据:** `lanDiscoveryService.js 458 > 400`、`AppChrome.tsx 404 > 400`、`useGameNetwork.ts 303 > 300`、`buffCopyCatalog.ts 458 > 400`、`Card.tsx 439 > 400`、`RulebookContent.ts 442 > 400`、`TopBar.tsx 455 > 400`。
- **风险场景:** warning 长期存在会让架构预算失去早期预警意义，后续功能更容易推到 hard limit。
- **整改步骤:** 将组合 UI 的纯展示子块拆出；将 hook orchestration 的网络事件处理拆到已存在的 gameNetwork helper；将静态 copy/catalog 拆为按主题或 level 的小文件；对确实不可拆的文件补 ADR。
- **验收标准:** `pnpm architecture:check` 无 warning，或每个保留 warning 都有 ADR 和明确到期复审日期。
- **验证命令:** `pnpm architecture:check`
- **建议 owner 角色:** Frontend Platform + Desktop Platform + Domain Data

### P2-2: 将 lint warning 降为 0

- **问题:** `pnpm lint` 通过但存在 2 个 React Hook warning。
- **证据:** `apps/desktop/src/hooks/useGameNetwork.ts:295` 有 unnecessary dependency `authoritativeReplayRevision`；`apps/desktop/src/hooks/useOnlineManager.ts:82` 缺少 dependency `getCurrentReplayFullSyncRef`。
- **风险场景:** Hook dependency warning 可能隐藏 stale closure 或无意义重渲染；在网络同步和 replay full sync 场景中会放大排障成本。
- **整改步骤:** 逐个复查 hook 依赖来源；能移除的依赖直接移除；缺失依赖如为 stable ref 则通过局部封装或注释解释，否则加入依赖并补测试。
- **验收标准:** `pnpm lint` 输出 `0 errors, 0 warnings`。
- **验证命令:** `pnpm lint`
- **建议 owner 角色:** Frontend Platform

### P2-3: 将 GitHub repo settings 从 checklist 升级为可审计 snapshot

- **问题:** 分支保护和 required checks 只在文档中列出。
- **证据:** `docs/governance/repo-settings-checklist.md` 要求保护默认分支、要求 PR、要求 `governance` 和 `production-audit`，但仓库中没有 ruleset snapshot 或 live check 脚本。
- **风险场景:** 管理员在 GitHub UI 中临时放宽分支保护后，仓库内门禁仍会显示绿色，审计无法从 repo 发现 drift。
- **整改步骤:** 通过 GitHub Rulesets API 导出默认分支规则到 `tools/governance/repo-ruleset.snapshot.json`；新增 `tools/scripts/check-repo-settings-governance.mjs`；在 governance workflow 中加入只读比对 gate。
- **验收标准:** live repo ruleset 与 snapshot 不一致时 CI 失败；规则更新必须经过 PR。
- **验证命令:** `pnpm repo-settings:check` 或新增等价脚本
- **建议 owner 角色:** Release Engineering

### P2-4: 明确 CODEOWNERS 与边界 owner role 的关系

- **问题:** CODEOWNERS 全部路由到 `@mingzhi0119`，而边界 registry 使用多个 owner role。
- **证据:** `.github/CODEOWNERS` 中所有路径均指向单一用户；`boundary-registry.snapshot.json` 中存在 Frontend + Domain Logic、Networking、Desktop Platform、Release Engineering 等角色。
- **风险场景:** 团队扩张后，网络契约、桌面平台和 UI 展示改动无法自动路由到对应专业 reviewer；边界 owner 成为文档标签。
- **整改步骤:** 若项目保持单维护者，新增 ADR 说明 role 到单 maintainer 的映射；若进入多人维护，按边界角色拆分 CODEOWNERS。
- **验收标准:** CODEOWNERS 与边界 owner role 的关系可审计，且贡献文档说明 reviewer 策略。
- **验证命令:** 人工 review + `pnpm boundaries:check`
- **建议 owner 角色:** Engineering Lead

### P2-5: 补强安全披露渠道

- **问题:** `SECURITY.md` 要求私密披露，但没有给出具体邮箱、advisory URL 或 PGP 信息。
- **证据:** 当前文档写明优先 private GitHub security advisory；不可用时使用 repo owner 的 private maintainer channel，但没有具体地址。
- **风险场景:** 外部报告者无法找到私密渠道，只能开 public issue 或放弃报告。
- **整改步骤:** 增加 GitHub Security Advisory 新建链接或专用安全邮箱；明确响应 SLA；如果不公开邮箱，至少给出可执行的私密联系方式。
- **验收标准:** `SECURITY.md` 中存在一个无需额外上下文即可使用的私密披露入口。
- **验证命令:** Markdown review
- **建议 owner 角色:** Engineering Lead + Security Owner

### P2-6: 将 Release/Changelog 纳入发布闭环

- **问题:** `CHANGELOG.md` 只有 `Unreleased`，没有已发布版本记录。
- **证据:** 当前 `CHANGELOG.md` 无 `v5.x` released section；release workflow 已具备 tag 发布能力。
- **风险场景:** 发布后无法从仓库追溯某个 installer 包含的行为变更、治理变更和已知风险。
- **整改步骤:** 从 git tag 和合并历史回填 `v5.x` 发布记录；在 release checklist 或 workflow 中加入 “tag 必须存在 changelog section” 检查。
- **验收标准:** 最新 release tag 在 `CHANGELOG.md` 中有日期和变更摘要。
- **验证命令:** 新增 changelog gate 或人工 review
- **建议 owner 角色:** Release Engineering

### P3-1: 为高价值路径建立性能基准

- **问题:** 当前有 bundle budget，但没有 reducer、AI、network protocol、replay load/save 的微基准。
- **证据:** `bundle:check` 通过且 runtime-core 低于阈值，但 repo 中未见独立 benchmark 脚本。
- **风险场景:** 算法或 replay 变更导致热路径退化，只有用户体验变慢后才被发现。
- **整改步骤:** 新增 `pnpm bench`，覆盖 `applyAction`、`computeAiAction`、network validation、replay load/save；报告 median 和 p95。
- **验收标准:** benchmark JSON 可生成，并定义超过 10%-20% 的回归阈值。
- **验证命令:** `pnpm bench`
- **建议 owner 角色:** Domain Logic + Frontend Platform

### P3-2: 建立治理趋势 dashboard

- **问题:** governance evidence 已保留，但趋势消费仍偏原始 artifact。
- **证据:** `governance:evidence:check` 通过，artifact retention 为 30 天；未见统一趋势 dashboard。
- **风险场景:** 运行健康、bundle size、覆盖率和 release drill 的缓慢退化不易被日常发现。
- **整改步骤:** 将每日 governance evidence 汇总为 HTML/JSON dashboard，展示 30 天趋势。
- **验收标准:** 每次 evidence patrol 上传 dashboard artifact，并可查看关键指标趋势。
- **验证命令:** `pnpm governance:artifacts && pnpm governance:report`
- **建议 owner 角色:** Release Engineering

### P3-3: 补充 Contributor 行为规范与 onboarding

- **问题:** 缺少 `CODE_OF_CONDUCT.md`，新贡献者 onboarding 仍分散。
- **证据:** `CONTRIBUTING.md` 存在，但 `CODE_OF_CONDUCT.md` 不存在。
- **风险场景:** 开源或多人协作时，行为预期、升级路径和社区治理不清楚。
- **整改步骤:** 新增简洁行为规范；在 README/CONTRIBUTING 中链接；补一个 10 分钟本地 green path onboarding。
- **验收标准:** 新贡献者从 clone 到本地关键 gate 的步骤完整。
- **验证命令:** Markdown review
- **建议 owner 角色:** Engineering Lead

### P3-4: 定期复审 seal exclusions

- **问题:** seal exclusions 已治理，但数量较多，后续容易把测试债长期合法化。
- **证据:** `packages/config-vitest/sealExclusions.js` 中 baseline count 为 76，ADR-0008 要求 30 天复审。
- **风险场景:** 新增展示壳或 wrapper 通过 exclusion 逃离测试，而没有对应 smoke test 或行为说明。
- **整改步骤:** 将 exclusion review 纳入每月治理巡检；对 shell exclusion 要求 smoke test 链接；禁止无 ADR 的 shell exclusion。
- **验收标准:** `seal-exclusions:check` 持续通过，且每个新增 exclusion 都有明确分类和复审日期。
- **验证命令:** `pnpm seal-exclusions:check`
- **建议 owner 角色:** Frontend Platform

### P3-5: 改善本地门禁反馈速度和可读性

- **问题:** 完整门禁已经较全面，但失败时输出庞大，定位成本较高。
- **证据:** `pnpm test:coverage` 失败时测试全部通过，但真正失败原因在日志末尾；全量输出包含大量 expected negative-path console。
- **风险场景:** 开发者在本地或 CI 中需要从海量日志里找单一阈值失败，增加恢复时间。
- **整改步骤:** 增加门禁汇总脚本，收集每个 gate 的 exit code、耗时、关键失败摘要；CI artifact 保存完整日志但 job summary 展示短摘要。
- **验收标准:** 任一 gate 失败时，GitHub job summary 第一屏能看到失败命令、失败阈值和建议入口。
- **验证命令:** 新增 `pnpm audit:gates` 或等价脚本
- **建议 owner 角色:** Release Engineering + Developer Experience

---

## Verification Evidence

本轮命令在 `E:\simonbb\GemDuel-Dev` 本地执行，详细日志保存在临时目录 `C:\Users\sange\AppData\Local\Temp\gemduel-audit-2026-04-25`。

| 命令                                                          | Exit |    耗时 | 审计摘要                                                 |
| ------------------------------------------------------------- | ---: | ------: | -------------------------------------------------------- |
| `pnpm typecheck`                                              |  `0` |  `0.6s` | 5/5 tasks successful，缓存命中                           |
| `pnpm lint`                                                   |  `0` |  `0.5s` | 5/5 tasks successful，2 warnings                         |
| `pnpm test`                                                   |  `0` | `10.2s` | 126 files / 713 tests passed                             |
| `pnpm test:coverage`                                          |  `1` | `15.1s` | tests passed，但 branch coverage `87.57% < 88%`          |
| `pnpm architecture:check`                                     |  `0` |  `0.8s` | 通过，7 个 review budget warnings                        |
| `pnpm boundaries:check`                                       |  `0` |  `0.7s` | 10 governed boundaries passed                            |
| `pnpm deps:check`                                             |  `0` | `12.7s` | production audit all zero                                |
| `pnpm desktop:check`                                          |  `0` |  `0.8s` | desktop governance + 6 runtime drills passed             |
| `pnpm release:check`                                          |  `0` |  `0.8s` | release checklist, SLO, drill assets passed              |
| `pnpm build`                                                  |  `0` | `13.4s` | build passed，runtime-core `282.12 kB`                   |
| `pnpm bundle:check`                                           |  `0` |  `0.7s` | runtime-core observed `275.51 kB`，低于 warning `600 kB` |
| `pnpm test:security`                                          |  `0` |  `2.9s` | security regression suite passed                         |
| `pnpm governance:artifacts && pnpm governance:evidence:check` |  `0` |  `1.3s` | governance evidence health passed                        |

关键失败证据：

```text
ERROR: Coverage for branches (87.57%) does not meet global threshold (88%)
```

关键 warning 证据：

```text
apps/desktop/src/hooks/useGameNetwork.ts:295
React Hook useMemo has an unnecessary dependency: 'authoritativeReplayRevision'.

apps/desktop/src/hooks/useOnlineManager.ts:82
React Hook useCallback has a missing dependency: 'getCurrentReplayFullSyncRef'.
```

```text
lanDiscoveryService.js 458 > 400
AppChrome.tsx 404 > 400
useGameNetwork.ts 303 > 300
buffCopyCatalog.ts 458 > 400
Card.tsx 439 > 400
RulebookContent.ts 442 > 400
TopBar.tsx 455 > 400
```

---

## Assumptions

- 本报告为 2026-04-25 的点位审计，不代表后续提交或远端 CI 的当前状态。
- 本轮未查询 GitHub live branch protection 或 ruleset API；分支保护结论仅基于仓库内文档和 workflow。
- `pnpm test:coverage` 失败按真实结果记录，没有为通过审计而修改测试或生产代码。
- Windows NSIS-only release target 被视为当前项目工程规范，不作为缺陷；只建议保持文档一致。
- 工程整改应按 P1 -> P2 -> P3 顺序推进，P1 完成前不应宣称全生命周期管线恢复全绿。
