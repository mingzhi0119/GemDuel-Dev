@omx-visual-lab-cleanup-template.md To Codex GPT-5.5 High:

我已经在 Visual Lab 完成了一轮评分。请按 `docs/prompts/omx-visual-lab-cleanup-template.md`
执行素材重生成与 Theme 整理。

硬性要求：

- 以当前 `tmp/visual-lab/surface-review-state.json` 为源；若 manifest stale 导致评分对不上，先修复 stale manifest 并冻结本轮 plan。
- 1 分 candidate Theme 整组删除，不生成替换图，不备份，但必须写删除报告。
- 4/7/10 分 candidate Theme 保留，rating 数值不变。
- 所有有评语的 Theme/slot，重生成 prompt 必须把评语写成 mandatory hard constraint。
- Main Agent 负责编写 prompt、拆 assignment、汇总 source path、校验尺寸、替换、整理 manifest/state、写报告。
- 生图必须让 Subagents 执行；Subagents 只允许使用 Image Gen，不能编辑 repo，不能复制文件，不能改 manifest/state。
- Subagents 返回 prompt id、prompt text、generated source path、失败项。
- 完成替换后，把保留 Theme 合并到新的 curated candidate library：
  `assets/art-library/surface-autonomous-curated-theme-candidates/<run-timestamp>/`
- 合并时去掉 A/B 变体标签；manifest 内统一 `variant: main`，UI 不显示 `main`。
- 同 base style 多套保留时按 rating desc、newer date desc、old source id asc 排序，命名为 `<style>-1`、`<style>-2`、`<style>-3`。
- curated manifest、prompt id、目录路径中不允许残留 A/B 作为 Theme 变体标签；旧 provenance 放进 report，不放进生产 manifest record。
- 所有 consolidated PNG 必须规范化到当前 slot target dimensions。
- 最终保留 runtime ratings；迁移 candidate ratings 到新 set id；删除 1 分 ratings；清空已完成 regen marks/comments。
- 若有任何重生成失败，不清空对应失败项的 regen mark/comment，报告失败并保留未完成项。

验证要求：

- `pnpm visual-lab:surface:review:validate`
- focused Visual Lab review tooling tests
- `pnpm typecheck`
- `pnpm architecture:check`
- consolidated manifest/state 自检：set id 唯一、路径存在、slot 完整、PNG 尺寸正确、无 A/B 变体残留、1 分 Theme 不在 manifest/catalog/state。
- 检查 `http://localhost:5173/?visualLab=surfaces` 可加载。
