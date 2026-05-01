# Surface Asset Slots

这些静态资源已经接入桌面端游戏界面。设置菜单暴露五套 Surface Style：
`crystal-anime`、`royal-luxury`、`dark-arcane`、`clean-boardgame`、`pearl-opaline`。

已接入的槽位：

- `anime-themes/<style>/dark/shell-background.png`: Shell 上半区背景（TopBar + 中间区，推荐新规格 3840x1640）
- `anime-themes/<style>/dark/player-zone-p1.png`: P1 玩家区背景（推荐新规格，1920x520）
- `anime-themes/<style>/dark/player-zone-p2.png`: P2 玩家区背景（推荐新规格，1920x520）
- `anime-themes/<style>/dark/player-zone.png`: legacy 玩家区背景 fallback；没有 P1/P2 独立图时继续使用
- `anime-themes/<style>/dark/gem-panel.png`: 宝石面板
- `anime-themes/<style>/dark/market-card-back-l1.png`: 1 级市场牌背
- `anime-themes/<style>/dark/market-card-back-l2.png`: 2 级市场牌背
- `anime-themes/<style>/dark/market-card-back-l3.png`: 3 级市场牌背
- `anime-themes/<style>/dark/royal-card-back.png`: 皇室牌背占位资源；皇室区的实际皇室卡必须继续显示卡面

说明：

- 目前代码路径定义在 [surfaceArtwork.ts](/E:/simonbb/GemDuel-Dev/apps/desktop/src/app/shell/surfaceArtwork.ts)。
- Light/Dark runtime 已退役；运行时只读取 `dark` 目录。
- 历史 Light 素材仅可作为归档候选存在，不再作为桌面端运行时资源路径接入。
- 桌面端固定 `3840x2160` 的 16:9 逻辑舞台；非 16:9 视口只通过黑边和整体缩放适配，不改变区域比例。
- 区域合同：TopBar `3840x120`，中间区 `3840x1520`，PlayerZone rail `3840x520`；P1/P2 PlayerZone 各 `1920x520`。
- 不再接入独立桌布 / playmat / TopBar 美术槽位；`shell-background.png` 覆盖 TopBar + 中间区的 `3840x1640` 上半区，TopBar 只保留 React 内容层和底部分割线。PlayerZone 由独立素材覆盖，区域之间靠线条分隔，不靠灰色面板或色差分区。
- PlayerZone 新素材目标尺寸是 `1920x520`，按玩家侧分别输出 `player-zone-p1.png` 与 `player-zone-p2.png`。双方图片可以不同，但同 Theme 下必须风格一致；也可以让 P2 使用 P1 的镜像构图。
- `player-zone.png` 是 legacy / mirror fallback，现有主题和候选库仍可使用；没有侧向独立图时，前端可复用该图并对 P2 fallback 镜像。
- PlayerZone 素材只能作为玩家区环境底图，不要包含卡框、卡槽、预留牌背、假 UI 控件、文字或数字；这些都由 React 渲染。
- 每个 Surface Style 的市场牌堆必须使用 L1/L2/L3 三张独立卡背，且同 Style 内保持低级朴素、高级更华丽的递进关系。
- 直接覆盖对应 Style 目录下的同名文件最省事。
- 如果你想改成 `.jpg` / `.webp`，同步改 `surfaceArtwork.ts` 里的路径即可。
- 为了保证按钮和文字可读性，建议图片本身保留一些中间亮、边缘暗的层次，不要做成纯平铺纯色。
