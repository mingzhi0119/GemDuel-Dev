# Boundary Inventory

审计日期：`2026-04-19`

## Boundary Matrix

| Boundary                             | Entry Surface                             | Owner                                  | Validator / Gate                                                                | Fail-Closed Behavior                              | Evidence                                                                                               |
| ------------------------------------ | ----------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Renderer action dispatch             | `networkDispatch` / local reducer actions | Frontend + Domain Logic                | `validateCommand`, `getActionRejectionReason`, `fsmPolicy`                      | 非法 action 被拒绝，不进入 reducer 正常路径       | `src/logic/__tests__/fsmPolicyMatrix.test.ts`, `src/logic/__tests__/securityBoundaries.test.ts`        |
| Network message parsing              | PeerJS `data` payload                     | Networking                             | `parseNetworkMessage`, `getInboundMessageCheck`                                 | 畸形消息直接丢弃并记录 `NETWORK_MESSAGE_REJECTED` | `src/logic/__tests__/propertyBoundaries.test.ts`, `src/logic/__tests__/protocolRecoveryMatrix.test.ts` |
| Guest intent authority review        | `HOST_DECISION` / `GUEST_INTENT`          | Networking                             | `reviewHostIntent`, `validateGuestIntentCommand`, checksum verification         | host 拒绝或 guest recovery，不落地未授权状态      | `src/logic/__tests__/hostApproval.test.ts`, `src/hooks/__tests__/useGameNetwork.test.tsx`              |
| Replay local file read               | Renderer file input                       | Frontend + Domain Logic                | `importReplayFromFile`, `validateReplayFileBoundary`, `parseReplayTextBoundary` | 超限、非 JSON、读失败、JSON/schema 非法全部拒绝   | `src/app/io/__tests__/safeReplayImport.test.ts`                                                        |
| Replay schema / deterministic replay | Replay JSON payload                       | Domain Logic                           | `parseReplayFile`, `validateCommand`, reducer replay walk                       | 任意非法历史 fail closed，不导入 history          | `src/logic/__tests__/replayImport.test.ts`                                                             |
| IPC invoke/send                      | `window.electron.*` bridge                | Desktop Platform                       | `validateIpcArgs`, preload allowlist, sender authorization                      | 未授权 sender / 非 allowlist channel 被拒绝       | `electron/__tests__/desktopGovernance.test.ts`, `scripts/check-electron-governance.mjs`                |
| Desktop BrowserWindow security       | Electron main window creation             | Desktop Platform                       | `validateMainWindowOptions`, machine-readable snapshot                          | 安全 flag 漂移使 `desktop:check` 失败             | `electron/__tests__/desktopGovernance.test.ts`, `electron/governance/desktop-policy.snapshot.json`     |
| Runtime env / ICE config             | Renderer runtime bootstrap                | Desktop Platform                       | `runtimeConfig`, schema / sanitization                                          | 非法配置回退默认值并上报 runtime health           | `electron/__tests__/releaseHealth.test.ts`, `npm run desktop:check`                                    |
| Release-health checklist             | Release / CI gate                         | Desktop Platform + Release Engineering | `scripts/check-release-health.mjs`                                              | checklist 与监控契约不一致则阻断 release gate     | `npm run release:check`, `.github/workflows/governance.yml`                                            |
| Dependency / package governance      | CI + local scripts                        | Release Engineering                    | `scripts/check-dependency-governance.mjs`                                       | 漏洞或策略漂移阻断 CI/build                       | `.github/workflows/governance.yml`, `.github/workflows/build.yml`                                      |

## Ownership Notes

- 新增外部入口前，先在本表登记 `Owner`、`Validator / Gate`、`Fail-Closed Behavior`。
- 新增 bridge API、IPC channel 或 BrowserWindow 能力时，必须同步更新 `electron/governance/desktop-policy.snapshot.json`。
- 新增本地文件入口时，优先复用 `src/app/io/safeReplayImport.ts` 这种“边界包装 + 结构化错误码”模式。
