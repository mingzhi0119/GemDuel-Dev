# GPT-5.5 Pro 复核报告改进意见与整改计划（2026-04-28）

**仓库：** `E:\simonbb\GemDuel-Dev`  
**日期：** `2026-04-28`  
**工作模式：** 只读核对源码与治理文件；除本 Markdown 外不修改任何文件。  
**被审阅报告：** `docs/archive/audits/gpt-5.5-pro-2026-04-28-revalidation.md`

## 总体判断

`gpt-5.5-pro-2026-04-28-revalidation.md` 中列出的核心问题大体真实存在，整改方向也基本合理。需要改进的是报告表达方式：部分条目把“代码事实”“部署假设”和“风险等级”写在同一段里，适合作为初筛记录，但还不够适合作为可执行整改 backlog。

本轮确认的最高优先级整改方向是：

1. 加固 Electron renderer 来源信任边界。
2. 明确 PeerServer 绑定地址与关闭生命周期。
3. 加固 TURN credential service 的授权、路由、请求体与状态模型。
4. 在现有 release tag provenance 之外，补齐桌面发布产物签名、checksum、attestation 或等价验证证据。

## 审计报告应该改进的地方

### 1. 区分事实、风险和假设

当前报告经常先列出代码事实，然后直接映射成生产风险。这个方向没有错，但执行整改时需要拆成三层：

- **代码事实：** 仓库中可以直接复现的内容。
- **风险解释：** 为什么该事实会扩大风险面。
- **成立假设：** 什么部署场景或攻击前提会让风险成为发布阻塞。

例子：`desktopGovernance.js` 的确使用 `startsWith` 做 renderer URL 判断，但 `authorizeIpcSender` 同时会校验 `senderId === mainWindowId`。报告应保留该问题，同时说明 sender identity check 降低了风险面，但不能替代结构化 URL 校验。

### 2. 发布链路问题需要更精准

发布链路问题真实存在，但原报告措辞应收紧。仓库不是完全没有 release provenance：

- `.github/workflows/build.yml` 在 `electron:build` 之前运行 `pnpm run release:provenance:check`。
- `tools/scripts/releaseTagProvenance.js` 校验 release ref 必须是 tag，并校验 commit 可从默认分支到达。
- release workflow 会导出 governance artifacts。

因此更准确的表述不是“没有可信链路”，而是：**缺少桌面安装包产物级别的签名、checksum manifest、artifact attestation 与可验证记录**。这仍是高优先级发布问题，但不是“完全没有 provenance”。

### 3. 每条问题应补齐行级证据和测试期望

原报告已经列出文件名，但整改执行者仍需重新定位具体入口。建议每条问题补齐：

- 源码行级证据；
- 当前已有测试是否锁定了旧行为；
- 需要新增的负向回归测试；
- 闭环验收命令。

### 4. 统一 P1/P2 判定口径

建议将风险等级改为以下口径：

| 问题                                 | 建议等级                           | 理由                                                           |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------- |
| Renderer URL 信任边界                | `P1`                               | IPC 来源边界必须在发布前结构化校验。                           |
| TURN 授权、路由、请求体、状态模型    | 公网服务为 `P1`，仅本地服务为 `P2` | 暴露范围决定严重性。                                           |
| 发布产物签名、checksum、attestation  | 公开桌面发布为 `P1`                | 用户端需要可验证安装包真实性。                                 |
| PeerServer host/lifecycle            | `P1/P2`                            | 若实际可绑定到 LAN/公网则偏 `P1`；若仅本地则为高优先级治理项。 |
| peer/client ID 与本地路径日志        | `P2`                               | 属于最小化泄露和治理证据污染问题。                             |
| `.vite/deps` 被跟踪                  | `P2/P3`                            | 真实的可复现性与仓库卫生问题，不是运行时漏洞。                 |
| Electron / electron-builder 版本漂移 | `P2`                               | 供应链可复现性问题。                                           |
| Actions SHA pin 与权限拆分           | `P2`                               | 重要加固项，但低于运行时信任边界。                             |

### 5. 报告应记录已有缓解措施

建议报告显式列出已有缓解措施，避免后续整改重复发明：

- IPC 已有 sender identity check 和 allowlisted channel schema。
- 仓库已有 desktop governance 与 release-health 检查。
- release workflow 已有多项 gate，且已有 release tag provenance。
- TURN 凭证架构已经在 ADR-0004 中定义为 ephemeral runtime bundle。

这些缓解措施不能关闭问题，但会影响整改方案的正确边界。

## 逐项复核结论

|   # | 问题                                           | 是否存在 | 建议是否合理     | 修正意见                                                                                                                       |
| --: | ---------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
|   1 | Electron renderer URL 使用前缀匹配             | 是       | 合理             | `isAllowedRendererUrl` 的 dev 分支使用 `startsWith(...)`，生产分支接受 `file://` 前缀；应改为结构化 URL 与打包路径 allowlist。 |
|   2 | 发布链路缺少签名/checksum 证据                 | 基本是   | 合理，但需改措辞 | 已有 tag provenance；缺的是安装包产物真实性证据。                                                                              |
|   3 | PeerServer host 与生命周期隐式                 | 是       | 合理             | 未显式 host，关闭路径只记录 intent；修复前需确认 PeerJS 返回对象的关闭 API。                                                   |
|   4 | 日志包含 peer/client ID 与 replay outputPath   | 是       | 合理             | 建议按 P2 做脱敏和路径最小化；若日志上传为治理证据，优先级上调。                                                               |
|   5 | TURN service Bearer、路由、状态、body 控制不足 | 是       | 合理             | 这是最大的一组服务侧加固项，应拆成 contract、abuse control、state model 三类任务。                                             |
|   6 | `.vite/deps` 被跟踪入库                        | 是       | 合理             | 应从 git tracking 移除，并用 `git check-ignore` 与 `git ls-files` 证明边界。                                                   |
|   7 | Electron 依赖版本基线漂移                      | 是       | 合理             | 应统一 root/app 版本治理来源，或明确 dual ownership 的 ADR/治理规则。                                                          |
|   8 | Workflow 权限与 action pin 可收紧              | 是       | 合理             | 应拆分 gate/publish 权限，并将 SHA pin 或更新策略覆盖到所有 workflow。                                                         |

## 整改计划

### Phase 0：整改 backlog 固化

**目标：** 在不改代码的前提下，把复核结论变成可执行任务。

- 将本文中的风险等级口径合并进后续整改 backlog。
- 每个问题单独建任务，不要合并成一个笼统的 security cleanup。
- 明确发布场景：内部包、LAN-only、公开桌面发布。TURN 与 PeerServer 的等级依赖该场景。
- 明确发布真实性目标：Windows Authenticode、checksum manifest、GitHub artifact attestation，或三者都要。

**退出标准：**

- 每个问题都有 owner、等级、验收命令和 rollback note。
- 哪些项是 release blocker 已明确。

#### Phase 0 落地记录

**执行状态：** 已完成 backlog 固化；未进入代码整改。

**规划场景：**

- 默认按 **公开 Windows NSIS 桌面发布** 管理风险，因为仓库当前 release target 是 Windows NSIS，且 release workflow 会发布桌面产物。
- 默认 **LAN/联机能力可用**，因此 PeerServer 与 TURN service 先按真实运行边界处理。
- TURN service 若最终确认只在可信内网或本地开发使用，`TURN-001` 可从 `P1` 调整为 `P2`；在确认前保持 `P1`。

**发布真实性目标：**

- Windows 安装包需要可验证签名，优先采用 Windows Authenticode。
- 每个发布产物需要 SHA256 checksum manifest。
- release evidence 需要能关联 tag、commit、SBOM/governance artifacts、安装包 checksum；若 GitHub artifact attestation 可用，应纳入同一链路。
- 现有 `release:provenance:check` 保留为 tag/branch provenance gate，不替代产物签名与 checksum。

#### Phase 0 Backlog

| ID            | 问题                                       | Owner                               | 等级    | Release blocker                      | 验收命令                                                                                                                                                 | Rollback note                                                                                               |
| ------------- | ------------------------------------------ | ----------------------------------- | ------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `DESKTOP-001` | Renderer URL trust validation              | Desktop Platform                    | `P1`    | 是                                   | `pnpm desktop:check`; `pnpm test -- --run apps/desktop/electron/__tests__/desktopGovernance.test.ts`; `pnpm test:security`                               | 如误拦合法 renderer，回滚到上一版 `desktopGovernance.js` 并保留新增负向测试为 skipped/todo 证据。           |
| `TURN-001`    | TURN Bearer、路由、请求体、状态模型加固    | Networking / TURN Service           | `P1`    | 是，除非确认 TURN service 不公网暴露 | `pnpm test -- --run packages/turn-service/src/__tests__/turnCredentialService.test.ts`; `pnpm test:security`; `pnpm boundaries:check`; `pnpm deps:check` | 若共享状态或 stateless lease 方案影响兼容性，先回滚状态模型改动，保留 Bearer/路由/size limit 的可独立补丁。 |
| `PEER-001`    | PeerServer host 与 shutdown lifecycle      | Desktop Networking                  | `P1/P2` | 条件是；若默认可能 LAN/公网绑定则是  | `pnpm desktop:check`; `pnpm test:security`; LAN smoke test                                                                                               | 若 host 收紧破坏 LAN 匹配，回滚 host policy 到上版并保留显式 shutdown 与 health evidence。                  |
| `RELEASE-001` | 安装包签名、checksum、attestation/evidence | Release Engineering                 | `P1`    | 是，针对公开桌面发布                 | `pnpm release:check`; `pnpm lifecycle:certify`; 需要签名验证时加 `pnpm electron:build`                                                                   | 若证书或 CI secret 未就绪，保留 checksum/evidence 脚本，暂不启用签名 gate 为硬阻塞。                        |
| `LOG-001`     | peer/client ID 与 replay path 日志最小化   | Runtime Governance                  | `P2`    | 否；若日志上传为治理证据则上调       | `pnpm desktop:check` 加 release-health 脱敏测试                                                                                                          | 若脱敏影响故障定位，回滚展示格式但保留 hash/basename helper 以便二次接入。                                  |
| `HYGIENE-001` | 移除 tracked `.vite/deps` cache            | Repo Hygiene                        | `P2/P3` | 否                                   | `git ls-files .vite/deps`; `git check-ignore .vite/deps/_metadata.json`; `pnpm deps:check`                                                               | 如发现这些文件被某脚本硬依赖，回滚移除操作并补 ADR 解释为何必须跟踪。                                       |
| `DEPS-001`    | Electron / electron-builder 版本基线统一   | Supply Chain Governance             | `P2`    | 否；若影响打包则上调                 | `pnpm install --frozen-lockfile`; `pnpm deps:check`; `pnpm desktop:check`                                                                                | 如统一版本导致 electron-builder 行为变化，回滚版本选择并把 dual ownership 写入治理文档。                    |
| `CI-001`      | Workflow 权限拆分与 action pinning         | Release Engineering / CI Governance | `P2`    | 否；release publish job 例外需谨慎   | `pnpm repo-settings:check`; release dry-run/tag rehearsal                                                                                                | 如 SHA pin 或权限拆分导致 publish 失败，先回滚 workflow 权限结构，保留 action update policy 文档。          |

#### Phase 0 执行队列

1. `DESKTOP-001` 与 `TURN-001` 优先进入 Phase 1，因为它们是明确运行时信任边界。
2. `RELEASE-001` 与证书/CI secret 强相关，应并行做方案确认，但不要阻塞 renderer/TURN 的代码整改。
3. `PEER-001` 在改代码前先确认 PeerJS close API 与 LAN 绑定需求。
4. `LOG-001`、`HYGIENE-001`、`DEPS-001`、`CI-001` 可作为独立 P2 PR，不应混入 P1 运行边界 PR。

### Phase 1：发布前运行边界加固

#### 1. Renderer 来源校验

**预计涉及文件：**

- `apps/desktop/electron/desktopGovernance.js`
- `apps/desktop/electron/__tests__/desktopGovernance.test.ts`
- `docs/governance/electron-ipc-allowlist.md`

**整改方向：**

- 用 `new URL(...)` 解析替代字符串前缀匹配。
- dev 模式精确比对 protocol、hostname、port 和受治理的 pathname。
- production 模式仅允许打包产物内的 renderer entry 路径，不接受任意 `file://`。
- 增加 prefix spoof、encoded path、query/path confusion、任意 `file://` 的负向测试。

**验收：**

```powershell
pnpm desktop:check
pnpm test -- --run apps/desktop/electron/__tests__/desktopGovernance.test.ts
pnpm test:security
```

#### 2. PeerServer 绑定与关闭生命周期

**预计涉及文件：**

- `apps/desktop/electron/main.js`
- `apps/desktop/electron/__tests__/*`
- 若 host policy 变化，同步更新 runtime governance 文档。

**整改方向：**

- 先验证 PeerJS `PeerServer(...)` 返回对象的 close/dispose 语义。
- 默认显式绑定到预期 interface；若 LAN matchmaking 需要局域网绑定，应将 LAN opt-in 写清楚。
- 在 health context 中记录 host/port。
- 在 `window-all-closed` 或进程退出前显式关闭 server。
- 增加 runtime drill 或单元测试证明 shutdown path 被调用。

**验收：**

```powershell
pnpm desktop:check
pnpm test:security
```

如 host 策略影响 LAN 匹配，还需要人工 LAN smoke test。

#### 3. TURN credential service 加固

**预计涉及文件：**

- `packages/turn-service/src/turnCredentialService.js`
- `packages/turn-service/src/__tests__/turnCredentialService.test.ts`
- `docs/adr/0004-turn-credential-lifecycle.md`
- `docs/governance/dependency-runtime-governance.md`

**整改方向：**

- 强制 `Authorization: Bearer <token>`，禁止无 Bearer fallback。
- 将 `pathname.endsWith(...)` 改为 base path normalization 后的精确路由匹配。
- 在 JSON parse 前增加请求体大小限制。
- 增加 rate limit，或明确要求部署层提供 rate limit 并用测试/文档固化。
- 公网部署场景下，将进程内 `Map` lease 状态替换为 stateless verifiable lease 或共享存储。

**验收：**

```powershell
pnpm test -- --run packages/turn-service/src/__tests__/turnCredentialService.test.ts
pnpm test:security
pnpm boundaries:check
pnpm deps:check
```

#### 4. 发布产物真实性闭环

**预计涉及文件：**

- `.github/workflows/build.yml`
- `apps/desktop/package.json`
- `tools/scripts/*release*`
- `docs/governance/release-health-checklist.md`
- 若扩展 release checks，同步更新 governance snapshots。

**整改方向：**

- 增加 Windows NSIS 安装包签名配置。
- 为安装包输出 SHA256 checksum manifest。
- 将签名/checksum 证据随 release 发布或纳入 governance artifacts。
- 如项目需要可验证 provenance，增加 artifact attestation。
- 保留并扩展现有 `release:provenance:check`，不要替换它。

**验收：**

```powershell
pnpm release:check
pnpm lifecycle:certify
```

如同一周期验证桌面打包/签名：

```powershell
pnpm electron:build
```

### Phase 2：P2 治理与仓库卫生

#### 5. 日志脱敏与路径最小化

**整改方向：**

- peer/client ID 采用 hash、截断或稳定匿名 ID。
- replay export 记录 basename、hash 或 governed artifact ID，不记录完整本地路径。
- 保留调试关联能力，但减少本地身份和路径暴露。

**验收：**

```powershell
pnpm desktop:check
```

并补充 release-health 脱敏回归测试。

#### 6. 移除被跟踪的 Vite cache

**整改方向：**

- 从 git tracking 中移除 `.vite/deps/_metadata.json` 与 `.vite/deps/package.json`。
- 保持 `.gitignore` 中的 `.vite/` 规则。
- 如果该问题曾反复出现，再增加轻量治理检查。

**验收：**

```powershell
git ls-files .vite/deps
git check-ignore .vite/deps/_metadata.json
pnpm deps:check
```

期望 `git ls-files .vite/deps` 无输出，`git check-ignore` 能命中 ignore 规则。

#### 7. 统一 Electron / electron-builder 版本治理

**整改方向：**

- 选择 root-owned 或 app-owned 的版本治理方式。
- 消除 root `package.json` 与 `apps/desktop/package.json` 的版本漂移，或用文档/ADR 说明双源治理是有意设计。
- 如当前 `deps:check` 无法捕捉该类漂移，补充依赖治理规则。

**验收：**

```powershell
pnpm install --frozen-lockfile
pnpm deps:check
pnpm desktop:check
```

#### 8. Workflow 权限拆分与 action pinning

**整改方向：**

- 将只读 gate job 与需要 `contents: write` 的 publish job 拆分。
- 第三方 actions 使用 commit SHA pin，或记录明确的更新策略。
- 覆盖所有 workflow，不只处理 `build.yml`。

**验收：**

```powershell
pnpm repo-settings:check
```

如 release workflow 结构变化，应进行 tag rehearsal 或等价 dry-run。

### Phase 3：全生命周期认证

完成整改后运行本地完整门禁：

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm boundaries:check
pnpm architecture:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
pnpm governance:artifacts
pnpm governance:evidence:check -- --artifacts-dir artifacts/governance
pnpm lifecycle:certify
```

如本轮包含桌面签名/打包验证，再运行：

```powershell
pnpm electron:build
```

## 建议 PR 切片

|  PR | 范围                                          | 风险  | 备注                                    |
| --: | --------------------------------------------- | ----- | --------------------------------------- |
|   1 | Renderer URL trust validation                 | 高    | 面小但安全关键。                        |
|   2 | TURN service contract 和 route hardening      | 高    | state model 若引入存储，应单独拆出。    |
|   3 | PeerServer host 和 lifecycle                  | 中/高 | 需人工验证 LAN 行为。                   |
|   4 | release signing/checksum/attestation          | 高    | 可能依赖证书和 CI secret。              |
|   5 | 日志脱敏                                      | 中    | 应包含 release-health 回归测试。        |
|   6 | `.vite/deps` cleanup 与 Electron 版本基线统一 | 低/中 | 适合独立仓库卫生 PR。                   |
|   7 | workflow 权限拆分与 action pinning            | 中    | 需与 release owner 协调，避免破坏发布。 |

## Definition of Done

每个问题只有同时满足以下条件，才算关闭：

- 代码整改已落地；
- 回归测试覆盖旧失败模式；
- 受影响治理文档和 snapshots 同步更新；
- 对应 focused command 通过；
- release-blocking 项在关闭前通过 `pnpm lifecycle:certify`。
