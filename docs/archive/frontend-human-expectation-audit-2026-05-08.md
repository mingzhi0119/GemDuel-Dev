# Frontend Human-Expectation Audit Report

## 1. Executive Summary

- 本次审计范围：`GemDuel-Dev` Vite renderer 前端，包含 Start page、语言切换、Classic/Roguelike 入口、Local PvP、AI、Online Duel、LAN Duel、主游戏棋盘、市场卡预览、保留流程、Restart/Rulebook 弹层、Roguelike Draft、Visual Lab Surfaces/Motion/Readability。
- 使用的浏览器/视口：`agent-browser 0.26.0`；桌面 `1440x900`；窄桌面 `900x700`。移动端/设备模拟按用户要求排除，未作为问题记录。
- 实际测试路径：`http://127.0.0.1:5173/`；Start -> English/中文；Start -> Classic -> AI；Start -> Roguelike -> AI draft；Start -> Online Duel；Start -> LAN Duel；Start -> Visual Lab -> Surfaces/Motion/Readability；游戏内市场卡预览、Reserve、Restart、Rulebook、浏览器 Back/Forward/Reload、键盘 Esc/Tab。
- 未覆盖的非移动范围：真实双端 Online 成功连接、真实两实例 LAN 成功匹配、完整胜利结算后的 Review 全流程、生产 build、Electron 原生窗口/IPC 行为、长局所有 buff 分支。
- 产品比例条件：本项目仅原生支持 `16:9` 逻辑舞台；任何其他视口比例都应在该 `16:9` 舞台外加黑边，不应解释为需要原生支持任意比例布局。
- 总体判断：核心游戏在标准桌面可进入并可操作，但多个关键路径依赖本地 React 状态和固定尺寸布局，且窄桌面没有稳定遵守 `16:9` 舞台加黑边契约，导致浏览器返回、窄桌面、联机失败、LAN fallback、Visual Lab 控制面板、弹窗键盘行为明显违背普通用户预期。
- 最严重的 3 个问题：
    - Start 页窄桌面下 Visual Lab 实际覆盖 Online/LAN 点击区域，用户点击 LAN 会打开 Visual Lab。
    - Online/LAN 失败状态没有以用户可理解方式呈现，一个静默失败，一个进入近似空白死胡同。
    - Visual Lab 的 Surfaces/Motion 关键控制在 1440x900 视口中不可滚动、不可达，审计目标工具本身核心操作被挡在视口外。

## 2. Severity Legend

- P0：核心流程不可用、严重误导、数据/状态破坏
- P1：核心体验明显反人类，用户很可能卡住或误操作
- P2：明显不顺手、不符合习惯，但有替代路径
- P3：轻微体验问题、文案/视觉/反馈可优化

## 3. Findings

### [P1] 窄桌面 Start 页 Visual Lab 覆盖 Online/LAN 点击目标

- 用户路径：在 `900x700` 桌面浏览器打开 Start 页，尝试点击 `LAN Duel`。
- 用户预期：看到 `LAN Duel` 卡片时，点击卡片应进入 LAN Duel 页面。
- 实际表现：点击 `LAN Duel` 的视觉区域后打开的是 Visual Lab 菜单，页面仍停留在 `/`。
- 为什么不符合人类习惯：用户按可见文字和按钮边界行动，但实际命中另一个浮层按钮；这属于点击区域与视觉区域不一致，会让用户误以为 LAN 入口坏了。
- 复现步骤：
    1. `agent-browser --session gd-audit set viewport 900 700`
    2. 打开 `http://127.0.0.1:5173/`
    3. 点击 `LAN Duel`
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-start-900.png`
    - DOM/布局观察：`Online` 约为 `x=177 y=561 w=267 h=91`，`LAN` 约为 `x=463 y=561 w=260 h=91`，`Visual Lab` 约为 `x=410 y=555 w=458 h=113`，三者发生实际覆盖。
    - 交互结果：点击 `LAN Duel` 后 snapshot 出现 `Surfaces`、`Motion`、`Readability` 按钮，而不是 LAN 页面。
- 代码证据：
    - 文件：`packages/ui/src/components/GameConfigMenu.tsx`
    - 相关组件/函数/状态：`GameConfigMenu` 的 `showVisualLabMenu`，Start 页 Online/LAN 区域，Visual Lab 绝对定位入口。
    - 根因分析：Start 页 root 使用 `overflow-hidden`；Online/LAN 作为正常流布局渲染在底部区域；Visual Lab 入口在同一个容器中用 `absolute bottom-8 right-8 z-10` 固定到右下角，且按钮 `min-h-28`、宽度很大，没有避让主入口或根据窄桌面降级为更小的工具按钮。`useViewportFitScale` 只缩放主内容块，不参与 Visual Lab 浮层定位。
- 建议修复方向：在窄桌面下将 Visual Lab 收缩为小图标按钮、移入工具菜单，或让 Start 页底部主入口为浮层预留安全区；同时用 hit-area 回归检查 `900x700`。
- 修复风险：中等；涉及 Start 页布局和 Visual Lab 入口位置，但不应触碰游戏逻辑。
- 是否建议立即修：Yes

### [P1] 浏览器 Back 不理解应用内入口状态，Opponent 选择页直接离开应用

- 用户路径：Start -> Classic -> Opponent selection，然后按浏览器 Back。
- 用户预期：Back 应返回上一层 `Classic/Roguelike` 模式选择，或至少回到 Start 页。
- 实际表现：URL 仍是 `/`，浏览器 Back 导航到 `about:blank`，应用消失。
- 为什么不符合人类习惯：用户进入了一个看起来像页面的下一步，但浏览器历史没有记录这一层；Back 不是撤回一步，而是退出产品。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/`
    2. 点击 `Classic`
    3. 在 Opponent selection 页面按浏览器 Back
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-opponent-1440.png`
    - URL 观察：进入 Opponent selection 后 URL 仍为 `http://127.0.0.1:5173/`；Back 后 URL 为 `about:blank`。
- 代码证据：
    - 文件：`packages/ui/src/components/GameConfigMenu.tsx`
    - 文件：`apps/desktop/src/app/routes/GemDuelRoutes.tsx`
    - 相关组件/函数/状态：`gameConfig` 本地 state；`historyControls.historyLength`；`ui.matchmakingRoute`。
    - 根因分析：Classic/Roguelike 到 Opponent selection 的转场只调用 `setGameConfig(...)`，没有写入 URL 或 browser history。顶层路由也不是 BrowserRouter，而是在 `GemDuelRoutes` 中根据 `historyControls.historyLength` 和 `matchmakingRoute` 分支渲染。浏览器无法知道内部页层。
- 建议修复方向：为入口层级引入轻量 URL/search state 或 `history.pushState`，并监听 `popstate` 回退到上一级；至少在 Start 子步骤内拦截 Back 做内部返回。
- 修复风险：中等；需要梳理 Start/Online/LAN/Draft/Game 的状态恢复规则。
- 是否建议立即修：Yes

### [P1] LAN Duel 在浏览器环境下进入近似空白死胡同

- 用户路径：Start -> `LAN Duel`。
- 用户预期：看到搜索中、不可用、错误、重试，或清晰解释浏览器环境不支持 LAN。
- 实际表现：8 秒后页面只有 `RETURN TO TITLE`、`LAN DUEL`、`AUTO-MATCHED LOCAL ARENA`，没有搜索状态、失败文案、重试按钮或下一步。
- 为什么不符合人类习惯：用户进入一个模式后没有状态反馈，也不知道是否正在匹配、是否需要打开第二个窗口、是否失败，只能返回标题。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/`
    2. 点击 `LAN Duel`
    3. 等待约 8 秒
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-lan-8s-1440.png`
    - DOM snapshot：仅见 `RETURN TO TITLE` button 和 `LAN DUEL` heading；卡片内容为空。
- 代码证据：
    - 文件：`apps/desktop/src/hooks/useLanMatchmaking.ts`
    - 文件：`packages/ui/src/components/LanMenu.tsx`
    - 文件：`apps/desktop/src/App.tsx`
    - 相关组件/函数/状态：`FALLBACK_STATE.phase = 'idle'`；`LanMenu`；`App` 的 LAN startSearch effect。
    - 根因分析：浏览器无 `window.electron` 时 `useLanMatchmaking.startSearch()` 返回 `FALLBACK_STATE`，phase 仍为 `idle`。`LanMenu` 只渲染 `searching`、`matched/starting`、`error` 三类内容，没有 `idle` fallback UI。`App` 的 effect 在 `matchmakingRoute === 'lan' && lan.state.phase === 'idle'` 时不断尝试 `startSearch`，但浏览器 fallback 仍回到 `idle`，UI 因没有 idle 分支而空掉。
- 建议修复方向：给浏览器/Vite 环境明确的 LAN 不可用或模拟搜索 fallback；`LanMenu` 必须渲染 `idle` 状态，并提供重试/返回/说明。
- 修复风险：低到中；可局限在 LAN UI 和 hook fallback，不影响 Electron LAN 成功路径。
- 是否建议立即修：Yes

### [P1] Online 连接失败只进 Console，不给用户错误和恢复指导

- 用户路径：Start -> `Online Duel`，输入无效 peer id 后点击 Connect。
- 用户预期：连接失败后看到失败原因、重试建议、服务器不可达提示，按钮状态能恢复。
- 实际表现：UI 长时间停留在 `STATUS: DISCONNECTED • SERVER: CLOUD (SECURE)`；Connect 按钮恢复可点，但没有错误文案。Console 有 PeerJS/网络错误。
- 为什么不符合人类习惯：用户看不见 Console；静默失败让用户不知道是 ID 错、网络错、服务器错，还是仍在等待。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/`
    2. 点击 `Online Duel`
    3. 在 opponent match id 输入 `not-a-real-peer`
    4. 点击 `Connect`，等待 7 秒
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-online-invalid-connect-7s.png`
    - Console 观察：`PeerJS: Error retrieving ID (TypeError) Failed to fetch`、`PeerJS: Aborting!`、`Could not get an ID from the server`、`[NET] Peer Error: {type: "server-error"...}`。
- 代码证据：
    - 文件：`packages/ui/src/components/OnlineMenu.tsx`
    - 文件：`apps/desktop/src/hooks/useOnlineManager.ts`
    - 文件：`apps/desktop/src/hooks/onlineManager/peerLifecycle.ts`
    - 相关组件/函数/状态：`connectionStatus`、`connectToPeer`、`peer.on('error')`。
    - 根因分析：Online UI 只有 `peerId`、`connectionStatus` 和 `isHost`，没有错误状态字段；`peerLifecycle.peer.on('error')` 只 `reportRendererEvent` / console log，不把错误映射到 UI state；`connectToPeer` 在 peer 未就绪时也只上报日志。`OnlineMenu` footer 只能显示 `DISCONNECTED/CONNECTING/CONNECTED`，无法呈现失败原因或修复动作。
- 建议修复方向：给 online manager 增加用户可见的 `errorMessage`/`lastErrorKind`，在 PeerJS server-error、unavailable-id、not-ready、timeout 时渲染可恢复错误；Connect 失败后提供 Retry 和检查 ID/server 的文案。
- 修复风险：中等；涉及 online manager 类型和 UI，但可保持协议层不变。
- 是否建议立即修：Yes

### [P1] Visual Lab Surfaces 评分/评论控件在 1440x900 中不可达

- 用户路径：Start -> Visual Lab -> `Surfaces`。
- 用户预期：审计/评分工具的核心评分按钮和评论框应该在桌面视口内可见，或面板内部可滚动到。
- 实际表现：`Style rating` 和 `Style comment` 出现在 body text，但实际按钮/textarea 位于视口底部之外；尝试页面滚动后 `window.scrollY` 仍为 `0`，无法到达。
- 为什么不符合人类习惯：这是 Visual Lab 的核心任务控件，用户能看到标题暗示却无法使用，像页面卡死或控件缺失。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/?visualLab=surfaces`
    2. 使用 `1440x900` 视口
    3. 尝试滚动或查找 `Rate current style 1`
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-visual-surfaces-1440.png`
    - 滚动后截图：`/tmp/gemduel-audit-visual-surfaces-scroll.png`
    - DOM/布局观察：`Rate current style 1` y 约 `1007`，bottom 约 `1039`，`Style comment` y 约 `1070`，均超过 900px 视口；`documentElement.scrollHeight` 为 900，页面不可滚动。
- 代码证据：
    - 文件：`apps/desktop/src/app/visual-lab/VisualLabRoute.tsx`
    - 文件：`apps/desktop/src/app/visual-lab/VisualLabConsole.tsx`
    - 文件：`apps/desktop/src/app/visual-lab/SurfaceLabControls.tsx`
    - 相关组件/函数/状态：`VisualLabRoute` root grid；`VisualLabConsole` portal aside；`maxHeight`；`SurfaceLabControls`。
    - 根因分析：Visual Lab route root 使用 `h-full ... overflow-hidden`，页面不可滚；console 是 fixed portal，计算 `height: calc(100vh - 108px)`，内部虽然有 `overflow-y-auto`，但实际上 Surfaces 内容先渲染大量 selectors、slot overrides、review state，再渲染 rating/comment，导致核心 review 控件自然排在面板底部。当前默认位置和高度没有保证核心控件首屏可用。
- 建议修复方向：把评分/评论提升到 Console 顶部或 sticky footer；保留内部滚动但确保可滚区域可操作；给 Visual Lab 添加面板高度/可滚动回归。
- 修复风险：低到中；Visual Lab 专用 UI，逻辑风险低。
- 是否建议立即修：Yes

### [P1] Visual Lab Motion 的 Trigger/Repeat/Clear 核心控件在 1440x900 中不可达

- 用户路径：Start -> Visual Lab -> `Motion`。
- 用户预期：Motion Lab 应能选择事件并点击 Trigger/Repeat/Clear 触发动效。
- 实际表现：Motion Trigger 的 Event/Player/Gem/Message/Hold/Trigger/Repeat/Clear 都在视口下方，无法滚动到。
- 为什么不符合人类习惯：工具名是 Motion，但触发动效的主按钮不可见，用户只能看默认状态，无法完成核心任务。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/?visualLab=motion`
    2. 使用 `1440x900` 视口
    3. 查找 `TRIGGER`/`REPEAT`/`CLEAR`
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-visual-motion-1440.png`
    - DOM/布局观察：`Motion Trigger` Event select y 约 `1234`；Trigger/Repeat/Clear y 约 `1641`；页面 scrollHeight 仍等于视口高度。
- 代码证据：
    - 文件：`apps/desktop/src/app/visual-lab/VisualLabConsole.tsx`
    - 文件：`apps/desktop/src/app/visual-lab/MotionLabControls.tsx`
    - 相关组件/函数/状态：`mode === 'motion'` 时先渲染 `SurfaceLabControls`、rating/comment，再渲染 `MotionLabControls`。
    - 根因分析：Motion controls 被追加在 Surface controls 和 rating/comment 后面；同一个固定 console 面板承载 Surfaces 和 Motion 两套控制，内容顺序没有按当前 mode 的主任务优先级重排。外层固定/hidden 让页面无法兜底滚动。
- 建议修复方向：Motion mode 下把 `MotionLabControls` 放在面板顶部；或分 tab/accordion 并默认展开 Motion Trigger；同时验证 `Trigger` 按钮在 1440x900 首屏可见。
- 修复风险：低到中；主要是 Visual Lab 控件排序和滚动策略。
- 是否建议立即修：Yes

### [P1] 窄桌面游戏主界面布局被裁切且出现异常几何

- 用户路径：`900x700` 桌面浏览器，Start -> Classic -> vs AI。
- 用户预期：窄桌面至少应保持棋盘、市场、玩家区可扫描，并提供滚动、缩放或清晰降级布局。
- 实际表现：市场和棋盘部分跑出左侧，多个 player-zone 元素出现极端 DOM box 值，页面没有可用滚动条。
- 为什么不符合人类习惯：这是桌面浏览器的窄窗口，不是手机模拟；用户缩小窗口后核心游戏不应变成不可理解的裁切场景。
- 复现步骤：
    1. `agent-browser --session gd-audit set viewport 900 700`
    2. 打开 `/`
    3. 点击 `Classic`
    4. 点击 `AI`
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-game-900.png`
    - DOM/布局观察：Market box 约 `x=-168 y=174 w=22 h=5`；部分棋盘 cell x 为负；若干 player-zone button box 出现百万级坐标/尺寸；`scrollWidth=900`、`scrollHeight=700`，没有恢复路径。
- 代码证据：
    - 文件：`apps/desktop/src/hooks/useResponsiveLayout.ts`
    - 文件：`apps/desktop/src/app/routes/GemDuelRoutes.tsx`
    - 文件：`apps/desktop/src/app/shell/GamePlaySurface.tsx`
    - 文件：`apps/desktop/src/app/shell/gameShellStyles.ts`
    - 相关组件/函数/状态：`calculateResponsiveLayout`；`layoutMode`; `boardScale`; `zoneScale`; `DesktopStage` 条件渲染。
    - 根因分析：`900x700` 因低于 `MOBILE_BREAKPOINT = 1024` 进入 `layoutMode: 'mobile'`，`GemDuelRoutes` 不再使用 `DesktopStage`。但 `GameShell`/`GamePlaySurface` 仍使用桌面式三列市场/棋盘/royal 结构，只是套用 mobile scale 常量，根容器继续 `overflow-hidden`。这形成了“桌面结构 + mobile scale + 无滚动”的混合状态。
- 建议修复方向：给窄桌面保留 `16:9` desktop-stage 缩放并在非 `16:9` 区域显示黑边；不要让 `900x700` 落入半成品 mobile 分支，也不要把它改造成新的原生非 `16:9` 布局；添加 900x700 主游戏截图/DOM 回归。
- 修复风险：中到高；涉及 responsive layout contract，需回归 1440x900、1280x720、900x700 以及真实移动策略，但移动本轮不作为审计范围。
- 是否建议立即修：Yes

### [P2] Restart 确认层不是完整 modal：Esc 不关闭，Tab 可进入背景控件

- 用户路径：游戏内点击右上角 Restart，打开 `Restart Game?` 确认层。
- 用户预期：Esc 关闭；Tab 只在 Cancel/Confirm Restart 内循环；背景控件不可聚焦。
- 实际表现：Esc 不关闭；Tab 顺序可移动到背景 Settings、Market、卡牌等控件。
- 为什么不符合人类习惯：确认重开是危险操作，modal 应明确控制焦点，防止误触背景或键盘用户迷失。
- 复现步骤：
    1. Start -> Classic -> AI
    2. 点击右上角 Restart
    3. 按 Esc
    4. 多次按 Tab
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-restart-modal2.png`
    - DOM snapshot：`Restart Game?`、`Cancel`、`Confirm Restart` 可见，同时背景 `Settings`、Market、卡牌控件仍在交互树中。
- 代码证据：
    - 文件：`apps/desktop/src/app/overlays/AppOverlayStack.tsx`
    - 文件：`apps/desktop/src/app/shell/GameShell.tsx`
    - 相关组件/函数/状态：`showRestartConfirm`；`setShowRestartConfirm`; `onCancelRestart`; `onConfirmRestart`。
    - 根因分析：Restart 确认层只是绝对定位 `div`，未设置 `role="dialog"`、`aria-modal`、`aria-labelledby`，没有 keydown Escape handler，也没有焦点 trap 或背景 inert。相比 `CardPreviewOverlay` 已有 Escape handler，Restart modal 行为不一致。
- 建议修复方向：抽一个通用 modal primitive 或至少给 Restart 层补齐 dialog semantics、Escape close、initial focus、focus trap/background inert。
- 修复风险：中等；需要小心不影响 Rulebook/Winner/CardPreview 现有弹层。
- 是否建议立即修：Yes

### [P2] Card Preview 有两个同名 Close 按钮，且 disabled Buy 没有原因

- 用户路径：游戏内点击市场卡，打开 Card Preview。
- 用户预期：预览层有一个清晰关闭按钮；不可购买时应说明缺少资源或行动条件。
- 实际表现：交互树中有两个 `Close card preview` button，一个是全屏背景关闭层，一个是右上角 X；`BUY CARD` disabled，但没有 tooltip、原因或缺少资源提示。
- 为什么不符合人类习惯：同名关闭按钮让键盘/读屏用户困惑；disabled 主操作没有解释，用户只能猜是资源不足、回合错误还是规则限制。
- 复现步骤：
    1. Start -> Classic -> AI
    2. 点击任意市场卡
    3. 查看 snapshot 或 Tab 顺序
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-card-preview-1440.png`
    - Snapshot：出现两个 `button "Close card preview"`；`BUY CARD` disabled，`RESERVE` enabled。
- 代码证据：
    - 文件：`packages/ui/src/components/CardPreviewOverlay.tsx`
    - 文件：`apps/desktop/src/app/shell/gameShellCardPreviewModel.tsx`
    - 相关组件/函数/状态：overlay backdrop close button；X close button；`createGameShellCardPreviewModel`; `canBuyPreviewCard`; `canReservePreviewCard`。
    - 根因分析：`CardPreviewOverlay` 同时渲染一个全屏透明 close button 和一个 X close button，两者 aria-label 完全相同。Action model 只传 `disabled` boolean 和 label，没有 disabled reason 字段；购买能力由 `canAfford`/phase/source check 计算后直接变成 disabled UI。
- 建议修复方向：背景关闭层改为 `aria-hidden` 或不同 label 并避免进入 Tab 顺序；为 disabled actions 增加 `disabledReason`，在按钮旁/tooltip/status 中显示缺少资源或当前不可行动原因。
- 修复风险：中等；触及通用 CardPreviewOverlay action API。
- 是否建议立即修：Yes

### [P2] Reserve 后 Gold 选择提示只告诉规则，不告诉用户可点哪里

- 用户路径：Card Preview -> `RESERVE`，进入取 Gold 的 follow-up。
- 用户预期：页面应明显标出可选 Gold，说明“选择一个高亮 Gold 或取消”，误点时给恢复路径。
- 实际表现：状态栏显示 `Select a Gold gem.`；误点普通 gem 后只显示 `Must select a Gold gem!`。棋盘 DOM 中 board cells 本身无文字标签，用户只能凭视觉找金色。
- 为什么不符合人类习惯：用户刚从卡牌预览进入 follow-up，焦点突然回到棋盘；文案没有空间位置、没有数量提示、没有说明可取消，错点反馈只重复规则。
- 复现步骤：
    1. Start -> Classic -> AI
    2. 点击市场卡打开 preview
    3. 点击 `RESERVE`
    4. 点击非 Gold gem
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-after-reserve-1440.png`
    - 错点后截图：`/tmp/gemduel-audit-after-gold-select-1440.png`
    - 页面观察：提示 `Select a Gold gem.` 和 `Must select a Gold gem!`，Cancel 按钮存在但不在提示文案中说明。
- 代码证据：
    - 文件：`packages/shared/src/logic/interactionCommands.ts`
    - 文件：`packages/shared/src/logic/interactionManager.ts`
    - 文件：`packages/ui/src/components/GameBoard.tsx`
    - 文件：`packages/ui/src/components/gameBoard/AnimatedGemButton.tsx`
    - 相关组件/函数/状态：`buildReserveCardFlow`; `buildReserveDeckFlow`; `boardInteractionMode === 'reserve-gold'`; `isTarget`; `AnimatedGemButton`。
    - 根因分析：Reserve flow prompt 是硬编码 `Select a Gold gem.`；错误是硬编码 `Must select a Gold gem!`。GameBoard 确实计算 `isTarget = isGold` 并给目标加 ring 动画，但 `AnimatedGemButton` 没有 `aria-label`/目标说明，提示层也不展示“高亮目标/可取消”的恢复指导。
- 建议修复方向：把 follow-up prompt 扩展为用户动作文案，例如“Select one highlighted Gold gem on the board, or Cancel.”；为 gold target button 增加可访问 label；错点错误提示包含恢复动作。
- 修复风险：低；主要是文案和 aria，不改规则。
- 是否建议立即修：Yes

### [P2] 键盘/辅助技术标签暴露内部 card id，棋盘 gem 按钮缺少可读名称

- 用户路径：游戏内使用 Tab/读 DOM snapshot 操作棋盘和市场。
- 用户预期：市场卡和棋盘格应以人类可理解的信息命名，例如卡名、等级、分数、成本、gem 颜色和坐标。
- 实际表现：市场卡标签是 `Preview card 321-gr-3-1778208542637` 这类 runtime id；棋盘 gem button 没有可读 label，snapshot 多为 focusable generic/button。
- 为什么不符合人类习惯：键盘用户无法判断焦点落在哪张卡或哪个 gem；内部 ID 不是玩家信息，不能帮助决策。
- 复现步骤：
    1. Start -> Classic -> AI
    2. 使用 `agent-browser snapshot -i`
    3. 多次按 Tab 观察焦点/交互树
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-game-initial-1440.png`
    - Snapshot 观察：市场卡为 `Preview card <runtime id>`；棋盘区域出现多个无具体 label 的 focusable board controls。
- 代码证据：
    - 文件：`packages/ui/src/components/Card.tsx`
    - 文件：`packages/ui/src/components/gameBoard/AnimatedGemButton.tsx`
    - 文件：`packages/ui/src/components/GameBoard.tsx`
    - 相关组件/函数/状态：`rootAriaLabel`; `AnimatedGemButton` root `<button>`。
    - 根因分析：`Card.tsx` 的 `rootAriaLabel` 直接拼接 `card.id`；`AnimatedGemButton` 渲染 `<button>` 但没有 `aria-label` 或 title。视觉上玩家能看卡面/宝石图，交互树却没有同等语义。
- 建议修复方向：为 Card 生成玩家可读 label；为 gem button 增加 `aria-label`，包含颜色、row/col、是否可选/目标状态；保留 `data-*` 给测试，不把 runtime id 暴露给用户标签。
- 修复风险：低到中；影响测试快照和可访问文案，需要更新对应断言。
- 是否建议立即修：Yes

### [P3] Visual Lab 退出按钮被命名为 Restart，但实际是关闭并返回 Start

- 用户路径：进入 Visual Lab Readability/Surfaces/Motion，点击右上角 restart 图标。
- 用户预期：`Restart` 表示重启当前游戏/实验，通常需要确认；关闭 lab 应叫 Close/Exit/Back to title。
- 实际表现：按钮 aria/tooltip 为 `Restart`，点击后删除 `visualLab` query 并返回 Start 页。
- 为什么不符合人类习惯：危险操作词和实际行为不一致；用户可能因为害怕重启而不敢点，或误以为会重置 Visual Lab 状态。
- 复现步骤：
    1. 打开 `http://127.0.0.1:5173/?visualLab=readability`
    2. 点击右上角 `Restart`
    3. 观察返回 `/`
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-visual-restart-click.png`
    - URL 观察：从 `/?visualLab=readability` 回到 `/`。
- 代码证据：
    - 文件：`apps/desktop/src/app/visual-lab/VisualLabRoute.tsx`
    - 文件：`apps/desktop/src/app/visual-lab/VisualLabRestartButton.tsx`
    - 文件：`apps/desktop/src/App.tsx`
    - 相关组件/函数/状态：`VisualLabRestartButton`; `label={t('settings.restart')}`; `handleCloseVisualLabToStartPage`。
    - 根因分析：Visual Lab 专用关闭按钮复用了 `settings.restart` 文案和 restart glyph，但实际 `onClick` 调用的是 `closeVisualLabToStartPage`，只是移除 query 参数并 `window.location.assign` 回标题页。
- 建议修复方向：按钮命名为 `Close Visual Lab` 或 `Back to title`，必要时换成 X/arrow-left icon；不要复用 restart 文案。
- 修复风险：低；文案/图标变更。
- 是否建议立即修：No

### [P2] Visual Lab 进入/退出使用 full navigation，Back 行为和用户心理模型不一致

- 用户路径：Start -> Visual Lab -> Surfaces，然后使用浏览器 Back 或关闭按钮。
- 用户预期：Visual Lab 是工具模式，Back 应回到 Start 或上一层 Visual Lab 菜单；关闭按钮应轻量退出。
- 实际表现：Open/Close 都通过 `window.location.assign` 改 query，形成页面级 navigation；Start 页的 Visual Lab 菜单状态不恢复，和内部状态路由的其他入口行为不一致。
- 为什么不符合人类习惯：同一个产品里有的入口是无 URL 的 React 状态，有的是 query navigation；用户无法预测 Back/Forward 会切换哪一层。
- 复现步骤：
    1. Start -> 打开 Visual Lab menu -> `Surfaces`
    2. 点击右上角 `Restart`/Close
    3. 使用浏览器 Back/Forward 观察 query 和 Start state
- 浏览器证据：
    - 截图：`/tmp/gemduel-audit-visual-menu-1440.png`
    - 截图：`/tmp/gemduel-audit-visual-restart-click.png`
    - URL 观察：Visual Lab 使用 `?visualLab=surfaces|motion|readability`；Start/Opponent/Online/LAN 大多不使用 URL 层级。
- 代码证据：
    - 文件：`apps/desktop/src/App.tsx`
    - 文件：`apps/desktop/src/app/routes/GemDuelRoutes.tsx`
    - 相关组件/函数/状态：`handleOpenVisualLab`; `handleCloseVisualLabToStartPage`; `getVisualLabMode`; `matchmakingRoute`。
    - 根因分析：Visual Lab 是 query-param route，Start/Opponent/Online/LAN 是 local state route。两套路由模型混用，导致浏览器历史对某些页面有效、对某些页面无效。
- 建议修复方向：统一顶层 route/state policy：Start 子页面、matchmaking、Visual Lab 至少用同一 URL/search-state 规则；Back 行为写成产品级 acceptance test。
- 修复风险：中等；需要明确 route ownership，但可以分阶段做。
- 是否建议立即修：No

## 4. Cross-Cutting Problems

- 路由和页面状态耦合混乱：Start/Opponent/Online/LAN 主要靠 React local state，Visual Lab 靠 query param，浏览器 Back/Forward 行为不统一。
- 缺少统一 Button/Action 状态规范：Online、Card Preview、Reserve follow-up 对 disabled、failure、retry、reason 的表达不一致。
- 缺少统一 modal 规范：Card Preview 有 Escape 但双 close；Restart 没有 dialog semantics、Escape 和 focus trap；Rulebook 行为相对更接近用户预期。
- 固定尺寸和 `overflow-hidden` 使用过多：Start 页、LAN/Online 页、GameShell、Visual Lab 都倾向隐藏溢出，导致窄桌面和工具面板没有自然恢复路径。
- `16:9` 舞台契约没有被所有桌面视口稳定执行：非 `16:9` 桌面窗口应显示黑边并继续渲染同一个逻辑舞台，而不是落入未完成的 mobile/窄屏混合布局。
- Visual Lab 控制台没有按任务优先级布局：Surfaces/Motion/Readability 共用一个长面板，当前 mode 的主操作可能被次要配置挤到不可达区域。
- 玩家可理解语义不足：市场卡、棋盘 gem、reserve follow-up 仍把内部 ID 或纯规则错误暴露给用户，而不是解释下一步动作。
- 联机错误状态没有产品化：PeerJS/LAN bridge 错误主要进入日志或 fallback state，UI 没有稳定的 error/empty/retry 模式。

## 5. Recommended Fix Order

1. 先修 P1 入口/死胡同问题：Start 页 Visual Lab 覆盖、LAN idle blank、Online silent failure。这些会让用户在进入产品前就误判功能坏掉。
2. 再修 Visual Lab 可达性：Surfaces rating/comment 和 Motion trigger 是工具核心路径，且修复范围相对局部。
3. 然后修窄桌面主游戏布局：这是 `16:9` 舞台加黑边的 responsive contract 问题，建议单独做布局回归，不混入文案修复。
4. 接着修 modal/action 规范：Restart modal、Card Preview disabled reason、双 close、Reserve prompt 可以作为统一 overlay/action 规范的一批。
5. 最后修 P3 文案/路由一致性问题：Visual Lab Restart 命名和 route policy 可在前面风险较高问题稳定后统一清理。

## 6. Patch Plan, but do not implement

- 最小改动方案：
    - Start 页：在 `GameConfigMenu` 中让 Visual Lab 入口避让 Online/LAN；为 `900x700` 添加布局断言或 screenshot check。
    - LAN：给 `LanMenu` 增加 `idle` fallback；浏览器无 Electron bridge 时显示明确不可用/重试/返回状态，避免空白卡片。
    - Online：给 `useOnlineManager`/peer lifecycle 增加 UI-facing error state，并让 `OnlineMenu` 展示错误、retry 和可修复文案。
    - Visual Lab：重排 `VisualLabConsole` 内容。Surfaces mode 把 rating/comment 放到顶部或 sticky；Motion mode 把 `MotionLabControls` 放到顶部；确保内部 scroll 可达。
    - Responsive：调整 `calculateResponsiveLayout` 对 `900x700` fine-pointer 桌面浏览器的策略，强制使用 `16:9` desktop-stage 缩放和黑边，避免进入半成品 mobile 游戏布局；不新增原生非 `16:9` 布局。
    - Modal/action：为 Restart 确认层补 dialog semantics、Escape、focus trap；清理 CardPreview 双 close 和 disabled reason。
    - Reserve/aria：扩展 reserve follow-up prompt/error，给 Card/Gem button 使用人类可读 aria-label。
    - Visual Lab close：把 label/glyph 从 Restart 改为 Close/Back to title。
- 涉及文件：
    - `packages/ui/src/components/GameConfigMenu.tsx`
    - `packages/ui/src/components/LanMenu.tsx`
    - `packages/ui/src/components/OnlineMenu.tsx`
    - `apps/desktop/src/hooks/useOnlineManager.ts`
    - `apps/desktop/src/hooks/onlineManager/peerLifecycle.ts`
    - `apps/desktop/src/hooks/useLanMatchmaking.ts`
    - `apps/desktop/src/app/visual-lab/VisualLabConsole.tsx`
    - `apps/desktop/src/app/visual-lab/SurfaceLabControls.tsx`
    - `apps/desktop/src/app/visual-lab/MotionLabControls.tsx`
    - `apps/desktop/src/app/visual-lab/VisualLabRestartButton.tsx`
    - `apps/desktop/src/app/visual-lab/VisualLabRoute.tsx`
    - `apps/desktop/src/hooks/useResponsiveLayout.ts`
    - `apps/desktop/src/app/overlays/AppOverlayStack.tsx`
    - `packages/ui/src/components/CardPreviewOverlay.tsx`
    - `apps/desktop/src/app/shell/gameShellCardPreviewModel.tsx`
    - `packages/ui/src/components/Card.tsx`
    - `packages/ui/src/components/GameBoard.tsx`
    - `packages/ui/src/components/gameBoard/AnimatedGemButton.tsx`
    - `packages/shared/src/logic/interactionCommands.ts`
    - `packages/shared/src/logic/interactionManager.ts`
- 预期行为变化：
    - `900x700` Start 页点击 Online/LAN 不再命中 Visual Lab。
    - 浏览器环境进入 LAN 时不再出现空白死胡同。
    - Online server/peer 失败在页面可见，并提供 retry/修复提示。
    - Visual Lab Surfaces/Motion 核心控件在 `1440x900` 可见或可滚动到。
    - `900x700` 主游戏渲染在居中的 `16:9` 舞台内，非 `16:9` 区域显示黑边，不再裁切到不可用状态。
    - Restart modal 符合 Esc/Tab/aria 习惯。
    - Card Preview 和 Reserve follow-up 给出更明确的 disabled/target/恢复说明。
- 需要回归测试的路径：
    - `1440x900` Start -> English/中文 -> Classic/Roguelike -> AI/Local PvP。
    - `900x700` Start -> Online/LAN/Visual Lab，验证点击区域互不覆盖。
    - `900x700` Classic -> AI，验证棋盘/市场/玩家区在 `16:9` 舞台内可用，外围黑边符合产品比例条件。
    - Online server unavailable、invalid peer id、empty input、retry。
    - LAN browser fallback、Electron LAN bridge available、searching、matched、error、retry。
    - Visual Lab `?visualLab=surfaces|motion|readability`，验证核心控制首屏/滚动可达、close/back 行为。
    - Game card preview：Esc、background close、X close、disabled Buy reason、Reserve。
    - Restart modal：Esc、Cancel、Confirm、Tab focus trap。
    - Reserve follow-up：正确 Gold、错误 gem、Cancel、keyboard/aria labels。
