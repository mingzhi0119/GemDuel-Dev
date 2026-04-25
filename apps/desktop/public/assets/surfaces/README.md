# Surface Asset Slots

这些静态资源已经接入桌面端游戏界面。后续如果要换背景或桌布，直接替换同名文件即可。

已接入的槽位：

- `light/background-shell.png`: Light mode 整体背景
- `light/tablecloth-playmat.png`: Light mode 桌布 / 主游玩区底板
- `light/panel-gem-board.png`: Light mode 宝石面板
- `light/background-market.png`: Light mode 市场区域背景
- `dark/background-shell.png`: Dark mode 整体背景
- `dark/tablecloth-playmat.png`: Dark mode 桌布 / 主游玩区底板
- `dark/panel-gem-board.png`: Dark mode 宝石面板
- `dark/background-market.png`: Dark mode 市场区域背景

说明：

- 目前代码路径定义在 [surfaceArtwork.ts](/E:/simonbb/GemDuel-Dev/apps/desktop/src/app/shell/surfaceArtwork.ts)。
- 直接覆盖同名文件最省事。
- 如果你想改成 `.jpg` / `.webp`，同步改 `surfaceArtwork.ts` 里的路径即可。
- 为了保证按钮和文字可读性，建议图片本身保留一些中间亮、边缘暗的层次，不要做成纯平铺纯色。
