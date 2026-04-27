# Surface Asset Slots

这些静态资源已经接入桌面端游戏界面。新设置菜单只暴露四套 Anime Theme：
`crystal-anime`、`royal-luxury`、`dark-arcane`、`clean-boardgame`。

已接入的槽位：

- `anime-themes/<theme>/dark/shell-background.png`: Dark mode 整体背景
- `anime-themes/<theme>/dark/topbar.png`: Dark mode 顶栏背景
- `anime-themes/<theme>/dark/player-zone.png`: Dark mode 玩家区背景
- `anime-themes/<theme>/dark/gem-panel.png`: Dark mode 宝石面板
- `anime-themes/<theme>/dark/market-card-back-l1.png`: Dark mode 1 级市场牌背
- `anime-themes/<theme>/dark/market-card-back-l2.png`: Dark mode 2 级市场牌背
- `anime-themes/<theme>/dark/market-card-back-l3.png`: Dark mode 3 级市场牌背
- `anime-themes/<theme>/dark/royal-card-back.png`: Dark mode 皇室牌背占位资源；皇室区的实际皇室卡必须继续显示卡面
- `anime-themes/<theme>/light/...`: Light mode 使用同名槽位

说明：

- 目前代码路径定义在 [surfaceArtwork.ts](/E:/simonbb/GemDuel-Dev/apps/desktop/src/app/shell/surfaceArtwork.ts)。
- Theme A 素材归入 `dark`，Theme B 素材归入 `light`；设置里只选择 Theme，Dark/Light 按应用模式自动切换。
- Light/Dark 只表示素材自身元素的明暗倾向，不代表前端要叠白色或黑色蒙皮；TopBar、玩家区和中场都应优先展示原始位图，只保留必要的文字/按钮可读性样式。
- 不再接入独立桌布 / playmat 槽位；`shell-background.png` 是整张游戏桌面的唯一大背景，中心区和玩家区靠线条分隔，不靠灰色面板或色差分区。
- `player-zone.png` 只能作为玩家区环境底图，不要包含卡框、卡槽、预留牌背、假 UI 控件、文字或数字；这些都由 React 渲染。
- 每个 Theme 的市场牌堆必须使用 L1/L2/L3 三张独立卡背，且同 Theme 内保持低级朴素、高级更华丽的递进关系。
- 直接覆盖对应 Theme 目录下的同名文件最省事。
- 如果你想改成 `.jpg` / `.webp`，同步改 `surfaceArtwork.ts` 里的路径即可。
- 为了保证按钮和文字可读性，建议图片本身保留一些中间亮、边缘暗的层次，不要做成纯平铺纯色。
