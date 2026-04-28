# GPT-5.5 Pro 审计复核记录（2026-04-28）

本记录用于复核你方提供的 **GPT 5.5 Pro 审计结论**，仅基于 `E:\simonbb\GemDuel-Dev` 本地仓库代码与治理文档，不涉及代码修改。

## 复核结论（结论先行）

1. 你方稿件中的高优先级问题项与当前仓库事实高度重合，属于“可追溯真实问题”。
2. 已确认项中，至少有 4 项为 **发布前高风险（P1/P2）**，应写入治理待办。
3. 建议将该复核作为治理文档的独立附件（本文件），并将其纳入 `docs/README.md` 归档入口。

## 已核实问题（直接证据）

> 风险等级按你的稿件中的定位优先映射，供治理计划引用。

### 1) Electron 主进程 Renderer 来源校验不够硬（P1）

- 位置：`apps/desktop/electron/desktopGovernance.js`
- 证据：
    - `isAllowedRendererUrl` 以 `startsWith` 做来源判断（`getAllowedDevRendererPrefix` + `url.startsWith(...)`）。
    - 生产环境直接接受所有 `file://` 前缀。
- 影响：字符串前缀匹配在边界上有可被构造 URL 绕过的风险，与官方建议不一致。
- 建议：
    - 改为 `URL` 对象严格比对 `protocol/host/port/origin/pathname`；
    - 生产端仅允许可验证的文件路径策略（或自定义安全协议）。

### 2) 发布链路未在工作流显式体现“签名闭环”（P1）

- 位置：`apps/desktop/package.json` + `.github/workflows/build.yml`
- 证据：
    - `apps/desktop/package.json` 构建配置无可见 Windows 代码签名配置（`build.win` 仅声明 `nsis`）。
    - `.github/workflows/build.yml` 在 `release` job 中直接 `pnpm run electron:build -- -p always`，未看到打包产物签名、checksum 或显式发布可信链条步骤。
- 影响：桌面公开发布与自动更新场景中，用户端信任闭环不足。
- 建议：
    - 增加 Windows 代码签名注入与证书治理；
    - 建立发布产物 checksum/签名证明并在 release 健康证据中留痕。

### 3) PeerServer 绑定与生命周期治理仍需收敛（P1）

- 位置：`apps/desktop/electron/main.js`
- 证据：
    - `PeerServer({ port: selectedPort, path: '/gemduel', proxied: true })` 未显式传 host，绑定策略依赖默认行为；
    - 注释写明 “PeerServer doesn't have explicit close method, node will clean up”，`window-all-closed` 路径中未见显式关闭调用。
- 影响：本地/联机边界的可控性与退出清理可追溯性不足，合规发布需要修正。
- 建议：
    - 明确 Host 绑定（本机/局域网分离）；
    - 明确关闭策略，避免依赖运行时隐式清理。

### 4) `main.js` 已记录完整 peer/client 及本地路径，存在最小化泄露空间（P2）

- 位置：`apps/desktop/electron/main.js`
- 证据：
    - 连接/断开事件日志写入 `client.getId()`；
    - 重放导出记录中保留 `outputPath`。
- 影响：可观测性与隐私之间缺少脱敏分级策略。
- 建议：
    - 增加日志分类脱敏（hash 或截断）；
    - 对输出路径统一记录 basename/hash。

### 5) TURN 服务 Bearer 与路由与状态治理不足（P1/P2）

- 位置：`packages/turn-service/src/turnCredentialService.js`
- 证据：
    - `parseBearerToken` 对无 `Bearer` 头也会回退到 `authorization.trim()`；
    - 路由判断使用 `pathname.endsWith('/issue')` 等；
    - `leases` 为进程内 `Map`，无共享持久化；
    - `readJsonBody` 无 body size 限制，服务端未见内置 rate limit。
- 影响：公网暴露时存在授权语义宽松、路由误匹配、横向扩展与滥用防护不足。
- 建议：
    - 强制标准 `Authorization: Bearer <token>`；
    - 改为精确路由匹配；
    - 引入短时可验证 token 或共享状态持久化；
    - 增加体积限制、速率限制与 abuse 测试。

### 6) Vite 预编译缓存 `.vite/deps` 被追踪入库（P2）

- 位置：` .gitignore` + `git ls-files .vite/deps/*`
- 证据：
- `.gitignore` 忽略 `.vite/`，但仓库仍追踪 `.vite/deps/_metadata.json`、`.vite/deps/package.json`。
- 影响：审计链中出现本应可重现的生成物污染与漂移噪音。
- 建议：
    - 从仓库移除并保持 `.gitignore` 约束，或补齐明确 ADR 与更新策略。

### 7) Desktop 依赖版本基线漂移（P2）

- 位置：`package.json`（根）与 `apps/desktop/package.json`
- 证据：
    - 根包 `devDependencies` 使用 `electron: ^39.2.7` / `electron-builder: ^26.0.12`；
    - `apps/desktop/package.json` 使用 `electron: ^39.8.8` / `electron-builder: ^26.8.1`。
- 影响：版本漂移降低供应链可复现性与发布一致性。
- 建议：
    - 统一版本管理来源，避免不同 workspace 使用不同基线。

### 8) GitHub Actions 版本 pin 与权限边界可继续收紧（P2）

- 位置：`.github/workflows/build.yml`
- 证据：
    - `release` job 直接 `contents: write`，发布前未看到最小权限分离的 gate/publish 阶段；
    - actions 使用 tag 级版本（如 `@v4`）而非 SHA。
- 影响：发布链路权限与供应链风险面更大。
- 建议：
    - 采用双阶段 job：先做 gate，再在专用高权限 publish 阶段；
    - actions 引用 SHA 并记录更新策略。

## 与稿件差异说明

- 与 GPT 5.5 Pro 的高风险向量基本一致；本复核未发现与其核心论断明显冲突、且与本地文件可复现的“错误指认”。
- `coverage` 只在此前审计中作为历史阻塞点出现，本次复核重点不重复展开（见 `docs/archive/audits/engineering-audit-report-2026-04-27.md`）。

## 建议治理动作（接入本次复核）

### P1（发布前）

- `desktopGovernance.js`：改造 Renderer 来源校验为 URL 结构化匹配并缩小生产 file 范围。
- `main.js`：收敛 `PeerServer` host + 关闭链路。
- `turnCredentialService.js`：修订 Bearer 语义、精确路由、共享存储或 stateless token 重构。
- 发布链路：加入发布签名、checksum 与验证证据输出。

### P2（本季度）

- 清理 `.vite/deps` 追踪项；
- 统一 Electron / electron-builder 版本边界；
- 改进日志脱敏与最小采样策略；
- Actions permissions 与 action pinning 收紧。

### 复核与交付

- 本记录建议被纳入 `docs/README.md` 的治理档案入口；
- 与 `docs/archive/audits/engineering-audit-report-2026-04-27.md` 形成同一编号序列，避免与历史审计混淆。
