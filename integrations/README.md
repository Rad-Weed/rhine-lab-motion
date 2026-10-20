# integrations — 跨 Harness 适配 / Cross-harness adapters

让 rhine-lab-motion 不止能在 WorkBuddy 里用。按你的 harness 类型选方案：

## 方案总览 / Adapter matrix

| 你的 Harness | 方案 | 文件 |
|---|---|---|
| **WorkBuddy** | 原生技能，自动加载 | 无需任何操作 |
| **Claude Code** 及 agent-skills 系（SKILL.md 规范） | 把整个 `rhine-lab-motion/` 放入 `~/.claude/skills/`（或项目 `.claude/skills/`） | 即用 |
| **Codex / Cursor / Qwen Code / Gemini CLI / 多数代码 agent** | 保留 `AGENTS.md` 于项目根目录，harness 会自动读取 | `AGENTS.md`（仓库根） |
| **千问 / Kimi 桌面端**（聊天形态，无法读取本地文件） | 把下方提示词全文粘贴进"系统提示 / 自定义指令 / 智能体人设" | `integrations/SKILL-PROMPT.txt` |
| **DSH 等自研 harness** | ① 若能配置系统提示 → 注入 `SKILL-PROMPT.txt` 全文；② 若能挂上下文文件 → 把技能包路径写进配置并指示 agent 先读 `AGENTS.md` | 二选一 |

## SKILL-PROMPT.txt 使用说明

1. 打开 `SKILL-PROMPT.txt`，全选复制（约 3.5k 字，一次性成本）。
2. 粘贴到目标应用的系统提示位置：
   - 千问（网页/桌面）：智能体创建 → 系统提示词；或对话内"自定义指令"
   - Kimi：Kimi+ 智能体提示词 / 常用语
   - DSH：其系统提示或预设槽位
3. 之后对话里直接说"生成莱茵生命风格的××"，AI 就会输出符合风格的
   单文件 HTML（设计令牌、铁律、配方全部内嵌，无需该应用能读文件）。
4. 提示词为自包含设计，可单独分发；更新时随技能包版本一起换。

## 说明

- `SKILL-PROMPT.txt` 是 `references/` 全部内容的**有损压缩**：保留 token、
  八条铁律、9 个高频配方、开场序列、音效最小配方与交付要求；
  精确到像素的参数表仍以 references 为准（供能读文件的 harness 使用）。
- 各 harness 对 SKILL.md 规范的支持在演进，若某工具已原生支持
  agent-skills，优先用原生方式。
