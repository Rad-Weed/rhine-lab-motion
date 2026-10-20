# AGENTS.md — rhine-lab-motion 使用指令 / Harness Instructions

> 本文件面向**任何具备文件读写能力的 AI harness**（Codex / Cursor / Qwen Code / Gemini CLI / DSH / 自研 agent 等）。
> WorkBuddy 用户请忽略本文件——WorkBuddy 会自动按 SKILL.md 加载本技能。
>
> This file is for any file-capable AI harness. WorkBuddy loads this kit automatically via SKILL.md.

## 你现在的任务 / Your mission

当用户要求"生成莱茵生命风格 / Rhine Lab style / 科研档案风 / 磁带盒未来主义 / 白橙科技感"的网页、界面、PPT 或视频分镜时，**按本包产出一个符合莱茵生命（明日方舟）设计语言的成果**。

## 使用步骤 / How to use this kit

1. **读取设计内核**：本目录 `SKILL.md`（约 1.5k 字，含 8 条设计法则与硬性规则）——必读
2. **按需深入**（渐进式，别一次全读）：
   - 要精确色值/字体/缓动/布局 → `references/design-tokens.md`
   - 要动效实现 → `references/motion-patterns.md`（12 种模式含代码）
   - 要 3D/音效/时长表/暗色主题 → `references/advanced-3d-audio.md`
   - 要深层风格逻辑与 FUI 语法 → `references/style-deep-dive.md`
3. **最快的交付方式**：以 `assets/starter/index.html`（自包含单文件演示）为基底改造；纯 CSS 组件用 `assets/starter/rhinelab.css`；动效函数在 `assets/starter/rhinelab.js`
4. **交付要求**：给用户直接打开的 HTML 必须**单文件自包含**（CSS/JS 内联，不留外链）；3D 需求单独成页（three.js 走 CDN，失败要降级提示）

## 核心规则速查 / Cheat sheet（细节以 references 为准）

```css
:root {
  --rl-paper:#e7e5e1; --rl-card:#f6f5f2; --rl-tab:#e2e0dc; --rl-faint:#c9c6c0;
  --rl-mute:#8b8882; --rl-ink:#111214; --rl-ink-inv:#f2f0eb; --rl-plate:#101112;
  --rl-orange:#ff7b00; --rl-orange-deep:#e35d00; --rl-lime:#b9e432;
  --rl-font-sans:"Montserrat","MiSans","Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif;
  --rl-font-mono:"JetBrains Mono",ui-monospace,Consolas,monospace;
}
```

1. **橙是唯一主强调**（警告/当前/机械交互），lime 只做点缀（光标/在线确认）；暗色场景强调换琥珀 `#c5a16b`（底 `#11181b`）。色彩即状态，永不做装饰
2. **一切皆档案**：编号、日志行、进度条、取景框四角、机密涂抹条、双语字幕、步骤指示器——内容装进档案框架再展示
3. **动效是机械的**：入场 outCubic（stagger 100ms）、数字用里程计、线条按进度绘制、警告闪烁 4Hz、乱码 tick 32ms；至多过冲一次，禁止 bounce
4. **文字入场 = 乱码解码**（字符集 `A-Z0-9#%&*+=/<>`）或打字机（块状 lime 光标）；中文不用乱码，逐字淡入上滑 0.25em
5. **全大写英文标签带宽字距**（0.08–0.3em），章节代号负字距 -0.045em；等宽数字加 `font-variant-numeric:tabular-nums`
6. **idle 永不静止但低频**（<0.2Hz、<5% 位移）：旋转环、扫描线、呼吸、套准点
7. **深色板只允许 白字 + 橙/lime/琥珀 强调**，不做全屏反色
8. 音效一律 **WebAudio 合成**（17 种配方见 rhinelab.js 的 RL_SFX），首次手势后才出声；禁止使用任何原片采样

## 交付自检 / Checklist

- 橙只用于强调？灰阶 ≤4 档？至少一种档案元素（编号/日志/进度/取景框）？
- 入场是机械感（无 bounce）？文字有乱码/打字机/滑入之一？
- HTML 单文件自包含？深色场景无彩色大片？页眉页脚 HUD 就位？
- 若用于开源发布：在 README/NOTICES 注明非官方同人 + 参考项目（见 `references/sources.md` 的模板）

## 兼容性说明 / Compatibility

| Harness | 用法 |
|---|---|
| WorkBuddy | 自动加载 SKILL.md，无需本文件 |
| Claude Code / agent-skills 系 | 把整个文件夹放入 `~/.claude/skills/rhine-lab-motion/`，SKILL.md 格式兼容 |
| Codex / Cursor / Qwen Code / Gemini CLI | 保留本文件于项目根，harness 自动读取 |
| 纯聊天桌面端（千问/Kimi 网页版等，读不了文件） | 改用 `integrations/SKILL-PROMPT.txt`（自包含提示词，粘进系统预设） |
| DSH 等自研 harness | 把包路径加入其上下文配置，或向系统提示注入 SKILL-PROMPT.txt |
