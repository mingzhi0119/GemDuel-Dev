# Unity 迁移与 Steam 发行准备计划 - 2026-05-08

## 1. 目标更新

本文件取代上一版英文计划，目标从“是否为了 3D 宝石 / 3D 背景迁移 Unity”重新定义为：

**最终要做一个可登录 Steam 平台、可通过 Steam 客户端下载安装和游玩的发行版游戏。**

因此，Unity 迁移不再只是视觉技术选择，而是 Steam 发行客户端路线的一部分。评估重点变为：

- Unity 是否能更好地支撑 Steam 发行版的长期形态；
- 当前 React / Electron 客户端是否仍适合作为正式 Steam 发行客户端；
- Unity 迁移前需要冻结哪些规则、资产、测试和发行流程；
- 你本机和账号层面需要准备哪些软件和工具。

## 2. 重新评估结论

### 2.1 结论

如果最终目标是 **Steam 平台正式发行版**，Unity 的战略价值明显上升，但仍然不建议现在直接全量重写。

推荐路线：

1. 当前 React / Electron 版本继续作为规则、玩法、Replay、UI/UX 验证的权威实现。
2. Visual Lab 继续作为 3D 宝石、卡牌厚度、3D 背景的视觉实验区。
3. 同步准备 Steamworks 发行账号、商店页素材、构建上传流程、Steam Deck / 控制器要求。
4. 新建 Unity vertical slice，只做最小可游玩的 Steam 原生原型。
5. 只有当 Unity 原型在“视觉表现、手感、规则一致性、Steam 集成、构建上传”上全部通过，才进入正式迁移。

### 2.2 为什么 Steam 目标会改变判断

如果只是本地桌面游戏，继续 Electron + Three 是低成本路线。

但 Steam 发行版会额外要求：

- 稳定的安装包 / depot / build / branch 流程；
- Steam Overlay、成就、云存档、Steam Input、Steam Deck 兼容性等平台能力；
- 商店页、截图、宣传图、预告片、Coming Soon 页面和 Valve 审核；
- 更明确的全屏、手柄、性能、崩溃日志、存档路径、版本更新和发行节奏；
- 更强的原生游戏观感。

这些方面 Unity 比 Electron 更接近标准游戏发行工作流，尤其当你希望未来支持 Steam Deck、控制器、移动端或更重的 3D 场景时。

## 3. 当前推荐路线

| 阶段           | 技术路线                              | 目的                           | 是否替代主游戏       |
| -------------- | ------------------------------------- | ------------------------------ | -------------------- |
| 当前阶段       | React / Electron + Visual Lab + Three | 验证玩法、UX、3D视觉方向       | 否                   |
| Steam 预研阶段 | Steamworks 账号 + 当前构建上传演练    | 理解 Steam 发行流程            | 否                   |
| Unity 原型阶段 | Unity vertical slice                  | 验证原生 3D 客户端是否值得迁移 | 否                   |
| 迁移决策阶段   | Unity 与当前客户端对比                | 看是否满足迁移门槛             | 未定                 |
| 正式迁移阶段   | Unity 完整客户端                      | 面向 Steam 发行版              | 是，但必须先通过门槛 |

## 4. Steam 发行必须理解的事实

以下信息基于 2026-05-08 查询的官方 Steamworks / Unity 文档。

### 4.1 Steam Direct 费用

- 每个要在 Steam 分发的新 app 需要支付 **100 USD 或等值费用**的 Steam Direct Fee。
- 费用会绑定到支付者的 Steam 账号作为 app credit。
- 该费用不可退款，但产品达到至少 **1000 USD Adjusted Gross Revenue** 后可在后续付款中 recoup。
- 已有 Steamworks partner 中，只有拥有 Admin 权限的用户可以购买 app credit。

### 4.2 Steamworks SDK 与上传

- Steamworks SDK 是上传内容到 Steam 所需的工具包。
- SDK 中包含 ContentBuilder、SteamCMD、SteamPipeGUI 等上传工具。
- Steam build 由一个或多个 depot 组成。
- SteamPipe 上传会生成 manifest，Steam 后台可以把 build 设置到 default branch 或 beta branch。

### 4.3 商店页与构建审核

- Steam 商店页审核通常需要 3-5 个工作日，但应至少预留 7 个工作日。
- 产品 build 审核也通常需要 3-5 个工作日，也建议至少预留 7 个工作日。
- build 必须能在商店页声明支持的所有操作系统上正常启动。
- 商店页勾选的功能必须已经在当前 build 中实现。
- Steam 要求 Coming Soon 页面至少上线 **两周** 后才能正式 release。

### 4.4 Steam 图像素材

Steam 商店和库需要多种图像资产。当前官方页面列出的关键尺寸包括：

- Header Capsule：920 x 430
- Small Capsule：462 x 174
- Main Capsule：1232 x 706
- Vertical Capsule：748 x 896
- Screenshots：至少 1920 x 1080，16:9
- Page Background：1438 x 810，可选
- Shortcut Icon：256 x 256
- App Icon：184 x 184
- Library Capsule：600 x 900
- Library Hero：3840 x 1240
- Library Logo：宽 1280 或高 720 的 PNG
- Library Header Capsule：920 x 430

这意味着当前游戏内资产并不能直接等同于 Steam 商店资产。需要单独做发行美术包。

### 4.5 Steam Deck / 控制器

如果目标包含 Steam Deck，必须提前按 Steam Deck 兼容要求设计：

- 默认控制器配置必须能访问全部内容；
- 屏幕按钮提示应匹配 Steam Deck 或 Xbox 手柄，不应在手柄输入时显示键鼠 glyph；
- 如需文本输入，应使用 Steamworks 文本输入 API 或内置可用手柄操作的输入法；
- 推荐支持 1280 x 800，或至少 1280 x 720；
- 最小字体字符高度不应低于 9px，官方建议尽量达到 12px；
- 不建议依赖 launcher；如果有 launcher，也必须可用手柄完整操作；
- 默认配置下应有可玩的帧率。

这对当前桌面鼠标优先 UI 是重大约束。Unity 迁移如果面向 Steam Deck，应从第一天就设计手柄导航和文字可读性。

## 5. Unity 是否成为上佳路线

### 5.1 Unity 更适合的情况

Unity 更适合以下目标：

- Steam 发行版希望有完整原生游戏观感；
- 未来重视 Steam Deck、手柄、全屏、粒子、光照、相机、场景调度；
- 3D 背景不是装饰图，而是可被灯光、镜头和层级组织的真实场景；
- 卡牌、宝石、棋盘、UI 动效会持续向“数字桌游”方向升级；
- 希望后续有移动端或更多平台可能性；
- 愿意为规则移植、Replay parity、Steam 集成、构建管线付出一次较大工程成本。

### 5.2 Unity 不适合立刻全量替换的原因

当前项目已有：

- 完整 TypeScript 规则引擎；
- Replay / 审计 / 本地门禁；
- PvE、本地 PvP、Online、LAN 相关流程；
- Visual Lab 和资产审查工作流；
- 大量 React 组件、DOM 交互、键盘/按钮/可访问性路径。

Unity 不能直接复用这些 UI。迁移不是“换渲染器”，而是重做客户端。

所以正确做法是：

**Unity 先做一个 Steam vertical slice，证明值得迁，再决定是否完整迁移。**

## 6. Steam 发行导向的迁移门槛

进入完整 Unity 迁移前，必须满足以下门槛：

1. **Steam 目标明确**
    - Windows Steam only；
    - Windows + Steam Deck；
    - Steam + 后续移动端；
    - 是否 Early Access；
    - 是否需要 Demo / Playtest。

2. **规则合同冻结**
    - `packages/shared` 的 action/state/replay schema 可导出为引擎无关文档或 JSON fixture；
    - 有 deterministic state hash；
    - Unity 可用同一 action stream 复现关键状态。

3. **Replay parity corpus 完成**
    - 本地 PvP；
    - AI；
    - reserve；
    - royal selection；
    - extra turn；
    - buff；
    - 网络/隐藏信息边界；
    - game over。

4. **Steam vertical slice 通过**
    - Unity build 可由 SteamPipe 上传到 Steam 后台测试 branch；
    - Steam 客户端可安装并启动；
    - Steam Overlay 可用；
    - 基础成就或 Steam API 初始化验证通过；
    - 可完整打一局 local PvP。

5. **发行美术包有方向**
    - Steam capsule / library / icon / screenshots 有统一风格；
    - 3D 背景和宝石风格已在 Visual Lab 或 Unity 原型中被确认；
    - 没有明显 IP / 素材授权风险。

## 7. Unity Vertical Slice 范围

### 7.1 第一版只做这些

- Windows Steam build；
- 16:9 原生游戏画面；
- Local PvP；
- 5x5 3D GemBoard；
- 基础市场卡牌；
- reserve / buy / royal selection；
- P1/P2 回合显示；
- 一套 3D 背景或半 3D 场景；
- Steam API 初始化；
- Steam Overlay 检查；
- 一个测试成就；
- 一个本地存档 / 设置路径；
- SteamPipe 上传到 private beta branch。

### 7.2 第一版不要做这些

- Online / LAN；
- 完整 AI；
- 完整 roguelike/buff；
- 完整 Visual Lab；
- 多语言商店页；
- Steam Deck Verified 追求；
- Trading Cards；
- Workshop；
- Cloud Save 正式发布；
- macOS/Linux；
- 移动端。

## 8. Steam 功能分层

### P0：发行必须有

- Steamworks app 创建；
- Steam Direct fee / app credit；
- Windows build；
- SteamPipe depot 上传；
- default / beta branch 管理；
- Steam 客户端启动验证；
- 商店页审核；
- build 审核；
- Coming Soon 至少两周；
- 发行素材；
- 隐私、EULA、第三方 notice、资产 provenance。

### P1：强烈建议首发有

- Steam Overlay；
- Steam Achievements；
- Cloud Save；
- Steam Input / controller config；
- crash log / player log 收集策略；
- demo 或 playtest 分支策略；
- Steam Deck 可玩性目标。

### P2：可以后续加

- Trading Cards；
- leaderboards；
- Steam Rich Presence；
- remote play together；
- Workshop；
- DLC；
- macOS/Linux depots；
- Steam Deck Verified 申请。

## 9. 你需要准备的软件

### 9.1 Steam / 发行相关

必备：

1. **Steam 客户端**
    - 用来测试安装、启动、Overlay、分支切换。

2. **Steam 账号**
    - 建议启用 Steam Guard Mobile Authenticator。
    - 未来设置 build live / default branch 更新会涉及账号授权。

3. **Steamworks Partner 账号**
    - 需要完成 Steamworks onboarding、税务/付款/身份资料。

4. **Steam Direct app credit**
    - 每个 Steam app 需要 100 USD 或等值费用。

5. **Steamworks SDK**
    - 用于 ContentBuilder、SteamCMD、SteamPipeGUI。
    - 这是上传 build 到 Steam 的核心工具。

6. **SteamCMD / SteamPipeGUI**
    - SteamCMD：命令行上传；
    - SteamPipeGUI：Windows 上更直观的上传辅助工具。

推荐：

7. **一个专用 builder Steam 账号**
    - 只赋予上传 build 所需权限；
    - 避免日常主账号直接用于自动化上传。

8. **Steamworks.NET**
    - Unity 中常用的 Steamworks C# 封装；
    - 用于 SteamAPI 初始化、Overlay、Achievements、Stats、Cloud、SteamID 等。

### 9.2 Unity 开发相关

必备：

1. **Unity Hub**
    - 安装和管理 Unity Editor、模块、许可证。

2. **Unity Editor LTS / Unity 6 LTS 线**
    - 建议选一个长期维护版本，不要频繁跟随 beta。
    - 一旦项目建立，版本要锁定。

3. **Windows Build Support**
    - Windows Steam 发行必须能构建 Windows standalone。

4. **Windows Build Support (IL2CPP)**
    - 建议安装；
    - IL2CPP 构建时间更长，但更接近发行构建要求。

5. **Visual Studio 2022**
    - 安装 `.NET desktop development`；
    - 安装 `Desktop development with C++`，用于 IL2CPP / C++ 编译链；
    - 安装 Windows SDK。

6. **Git**
    - Unity 项目必须用版本控制；
    - `.meta` 文件必须提交。

7. **Git LFS**
    - 如果 Unity 项目进入主仓库，建议用于大贴图、音频、二进制资产。

推荐：

8. **Rider 或 Visual Studio Code**
    - C# 脚本编辑。

9. **Unity Version Control / Plastic SCM 或继续 Git**
    - 如果大量二进制资产和多人协作，Unity Version Control 有优势；
    - 如果仍以当前 monorepo 为主，先用 Git + LFS 更简单。

10. **RenderDoc**

- 调试图形、材质、GPU 问题。

11. **Blender**

- 制作或检查 3D 宝石、卡牌厚度、棋盘、背景模型。

12. **Substance 3D Painter / Designer 或替代工具**

- 如果后续需要 PBR 材质。

13. **TexturePacker / Unity Sprite Atlas**

- 管理 2D 卡牌、图标、UI 图集。

### 9.3 美术与发行素材相关

必备：

1. **图像编辑工具**
    - Photoshop、Affinity Photo、Krita、GIMP 任一；
    - 用于 Steam capsule、library asset、icon、截图后期。

2. **视频录制工具**
    - OBS Studio；
    - 用于 Steam 预告片素材、动效记录。

3. **视频剪辑工具**
    - DaVinci Resolve、Premiere、CapCut Desktop 任一；
    - 用于 Steam trailer。

4. **本项目已有 Image Gen 工作流**
    - 继续使用 `imagegen-asset-library-flow` 管理候选资产；
    - 但 Steam 发行素材必须额外做 provenance 和 IP 风险检查。

### 9.4 QA / 性能相关

推荐：

1. **Steam Deck 实机**
    - 如果目标包含 Steam Deck，强烈建议购买或借用实机。

2. **Xbox 手柄**
    - Steam Deck / Steam Input 的最低体验验证参考。

3. **低配 Windows 测试机**
    - 用于验证发行版性能、分辨率、显卡兼容性。

4. **崩溃与日志工具**
    - Unity Cloud Diagnostics、Sentry、Backtrace 或自建日志上传；
    - 首发前至少要能定位启动失败。

## 10. 本项目需要先做的准备工作

### 10.1 Steam 发行准备

- 建立 Steamworks partner 账号；
- 支付 app credit；
- 创建 Steam app；
- 决定是否需要 Demo / Playtest app；
- 建立 Steam build 上传目录规范；
- 设计 depot / branch 命名；
- 建立 SteamPipe VDF 模板；
- 明确 Steam 商店页首批素材需求；
- 写 release checklist。

### 10.2 规则迁移准备

- 导出 `packages/shared` 的 action/state schema；
- 建立 replay golden corpus；
- 建立 state hash；
- 列出 Unity slice 必须支持的 `GameAction`；
- 把 card ID、gem、royal、buff 数据格式固定为可迁移 JSON。

### 10.3 视觉迁移准备

- 在 Visual Lab 中继续完成：
    - 3D GemBoard；
    - card slab；
    - 3D background prototype；
    - lighting presets；
    - reduced-motion 预览；
    - 16:9 截图证据。

- 产出 Unity 可用规格：
    - 宝石尺寸比例；
    - 卡牌厚度；
    - 棋盘世界坐标比例；
    - 背景深度层；
    - 相机距离；
    - 动效时长；
    - 材质方向。

### 10.4 资产与 IP 准备

- 资产 provenance 表；
- card / gem / background / UI source 与 runtime 资产映射；
- Steam capsule 独立美术方向；
- 生成图像的授权与提示词记录；
- 检查是否存在第三方 IP、桌游规则相似性、角色风格依赖；
- 建立 third-party notice / license 文档。

## 11. 推荐的执行顺序

### Phase 0：Steam 发行预研

目标：把 Steam 发行流程弄清楚，不碰 Unity 大迁移。

产物：

- Steamworks partner / app credit / app 创建；
- Steamworks SDK 下载；
- SteamPipe 上传 demo 文件夹测试；
- Steam 图像素材清单；
- 发行 checklist。

### Phase 1：当前客户端 Steam 上传演练

目标：确认当前 Electron build 也能作为 Steam build 被上传和安装。

原因：

即使未来迁 Unity，也应该先理解 SteamPipe、depot、branch、审核路径。不要把 Unity 迁移和 Steam 发行流程混在一起。

产物：

- Windows build 上传到 private branch；
- Steam 客户端安装启动；
- basic launch test；
- build logs / manifest 记录。

### Phase 2：Visual Lab 3D 定型

目标：在当前项目中把 3D 宝石、3D 背景方向定下来。

产物：

- approved screenshots；
- 3D style spec；
- material / lighting / animation notes；
- Unity transfer spec。

### Phase 3：Unity Steam Vertical Slice

目标：做一个最小 Unity Steam 发行原型。

产物：

- `clients/unity/` 或独立 Unity repo；
- Windows Unity build；
- Steamworks.NET 初始化；
- Overlay 可用；
- 一个测试成就；
- Local PvP 一局；
- SteamPipe private branch 安装运行。

### Phase 4：迁移决策

只有当 Phase 3 明显优于当前客户端时，才进入完整迁移。

判断标准：

- 视觉表现明显更强；
- Steam 集成更自然；
- 手柄/Steam Deck 路线可行；
- 规则 parity 可维护；
- 构建和上传可自动化；
- 不会让主游戏长期停摆。

## 12. 建议的仓库结构

如果 Unity 放进当前 monorepo：

```text
clients/
  unity/
    Assets/
      GemDuel/
        Art/
        Materials/
        Prefabs/
        Scenes/
        Scripts/
        Tests/
    Packages/
    ProjectSettings/
    UserSettings/        # 通常不提交
```

必须新增：

- Unity `.gitignore`；
- Git LFS 规则；
- Unity 版本锁定文档；
- Steamworks SDK 不直接提交到仓库，除非明确许可和策略；
- 自动导出 TypeScript replay fixtures 的脚本；
- Unity 读取 fixtures 的测试 runner。

如果 Unity 独立 repo：

- 当前 repo 保持规则 oracle；
- Unity repo 消费导出的 fixture package；
- 两边通过版本号或 fixture manifest 对齐。

## 13. 风险清单

### 高风险

- 规则重写导致玩法不一致；
- Replay parity 丢失；
- Steam Deck / 手柄体验不达标；
- 资产授权或 IP 风险；
- Unity 项目二进制资产污染 Git；
- Steam 商店素材不合规；
- Steam build 审核时间被低估。

### 中风险

- IL2CPP 构建慢；
- Unity UI 重做成本高；
- 云存档路径设计不当；
- Steam Overlay / 成就初始化失败；
- 全屏和分辨率设置不符合桌游阅读需求。

### 低风险

- 单纯 3D 宝石技术实现；
- 单机 local PvP vertical slice；
- Steam private branch 上传测试。

## 14. 不应该做的事

- 不要现在直接停止当前客户端开发。
- 不要因为 3D 背景想法就立刻全量迁 Unity。
- 不要让 Unity 场景对象直接持有不可测试的玩法规则。
- 不要跳过 SteamPipe 上传演练。
- 不要等到游戏做完才准备 Steam 图像素材。
- 不要没有 Steam Deck 实机就宣称 Deck 兼容。
- 不要把 raw/source 素材随 Unity 项目一起提交。

## 15. 最终建议

面向 Steam 发行版，Unity 是值得认真准备的路线，但它应该先作为 **Steam vertical slice** 被验证，而不是直接替代当前客户端。

最稳妥的下一步不是“马上迁 Unity”，而是：

1. 准备 Steamworks 账号和 Steam SDK；
2. 用当前 Windows build 先跑通 SteamPipe private branch；
3. 在 Visual Lab 完成 3D 宝石和 3D 背景视觉定型；
4. 再创建 Unity 原型；
5. 用 Steam 客户端真实安装运行 Unity slice；
6. 用 replay/state hash 判断 Unity 是否有资格成为正式客户端。

如果最终目标确认为 Steam 正式发行，Unity 很可能是长期更好的客户端形态；但迁移必须由 Steam 构建、规则 parity、资产 provenance 和玩家可读性共同驱动，而不是由单个 3D 特效驱动。

## 16. 参考资料

- Steam Direct Fee: <https://partner.steamgames.com/doc/gettingstarted/appfee>
- Steamworks SDK: <https://partner.steamgames.com/doc/sdk>
- Uploading to Steam / SteamPipe: <https://partner.steamgames.com/doc/sdk/uploading>
- Steam Builds: <https://partner.steamgames.com/doc/store/application/builds>
- Steam Review Process: <https://partner.steamgames.com/doc/store/review_process>
- Steam Release Options / Coming Soon: <https://partner.steamgames.com/doc/store/types>
- Steam Graphical Assets: <https://partner.steamgames.com/doc/store/assets>
- Steam Deck Compatibility: <https://partner.steamgames.com/doc/steamdeck/compat>
- Steam Achievements: <https://partner.steamgames.com/doc/features/achievements/ach_guide>
- Steamworks.NET: <https://steamworks.github.io/gettingstarted/>
- Unity Hub modules: <https://docs.unity.com/en-us/hub/add-modules>
- Unity license tiers: <https://support.unity.com/hc/en-us/articles/28114350573460-Which-Unity-Editor-license-should-I-use-purchase>
