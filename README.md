<div align="center">

# RHINE LAB MOTION

**莱茵生命（明日方舟）动效风格技能包 · Rhine Lab (Arknights) Motion & UI Style Kit**

*Science-fiction archive-terminal aesthetics for the web — paper white, ink black, warning orange.*

[![Version](https://img.shields.io/badge/version-0.14.0-orange)]() [![License: MIT](https://img.shields.io/badge/license-MIT-green)]() [![Made for WorkBuddy](https://img.shields.io/badge/made%20for-WorkBuddy-blue)]()

一个蒸馏自官方 PV、开源同人项目与电影级 FUI 方法论的**完整设计语言**：
设计 token · 12+ 动效模式 · Three.js 3D 档案阵列 · 17 种合成音效 · 终端登录开场。
零版权风险（音效全部 WebAudio 实时合成，无任何原片采样）。

</div>

---

## ✨这是什么 / What is this

**中文**：本项目是一套可复用的「莱茵生命」风格动效与 UI 设计语言，以 [WorkBuddy](https://www.workbuddy.cn) 技能（skill）形式组织。它提炼自《明日方舟》特别映像《莱茵生命：访问》的视觉语言、高质量开源同人项目（laiyin-video / RhineLabUI / rhine-lab-art / Multiplane）、中文游戏 UI 分析文章，以及好莱坞 FUI（Fictional User Interface）设计方法论。技能内含完整设计 token、动效模式库、3D 档案阵列实现与可直接运行的演示页。

**English**: A reusable "Rhine Lab" motion & UI design language, packaged as a [WorkBuddy](https://www.workbuddy.cn) skill. It distills the visual language of the Arknights promotional film *"Rhine Lab: Access"*, high-quality fan projects (laiyin-video / RhineLabUI / rhine-lab-art / Multiplane), Chinese game-UI design analyses, and Hollywood-grade FUI (Fictional User Interface) methodology into design tokens, a motion-pattern library, a Three.js 3D archive array, and ready-to-run demo pages.

> **非官方同人声明 / Unofficial fan work.** 本项目与 Hypergryph / 鹰角网络无隶属、未获认可。Not affiliated with or endorsed by Hypergryph / Hypergryph Network.

## 🌐 在线演示 / Live Demo（GitHub Pages）

- **演示索引 / Demo index**: https://rad-weed.github.io/rhine-lab-motion/
- **全要素演示 / Full demo**: https://rad-weed.github.io/rhine-lab-motion/assets/starter/index.html
- **3D 档案阵列 / 3D archive array**: https://rad-weed.github.io/rhine-lab-motion/assets/starter/scene3d.html

## 🖼 效果预览 / Preview

| Demo | 内容 |
|---|---|
| `assets/starter/index.html` | **档案册（旗舰 / flagship）**：七版面印刷档案册——封面 / 索引 / 正文 / 数据 / 图版 / 海报 / 版权页；含网点制版、套准裁切、贴纸胶带印章、拆封开场、`G` 键网格叠加、21 种音效 |
| `assets/starter/motion-lab.html` | **动效手册 / motion lab**：终端登录开场 + 19 个编号板块（排版/乱码/打字机/里程计/解密/警告板/故障转场/音效馆/FUI 语法等）+ 自动巡演 |
| `assets/dossier/` | 版式基座**源文件**：`dossier.css`（网格·字阶·印刷件）、`dossier.js`（音频总线·网点·拆封·入场）、`index.src.html`（七版面模板） |
| `assets/starter/scene3d.html` | **∞ 档案星座 / archive constellation**：72 张纸页沿双纽线等弧长堆叠成悬浮 ∞ 标志；靠近鼓起波浪、点击抽出、再点展开档案内容（Three.js，需联网） |

两个页面均为**单文件自包含**（CSS/JS 内联），浏览器直接打开即可运行。3D 页需联网加载 three.js CDN。

Both pages are **self-contained** (CSS/JS inlined) — just open them in a browser. The 3D page needs network access for the three.js CDN.

## 🚀 快速开始 / Quick Start

> 💡 **不想克隆？直接看在线演示 / Prefer a live look?** → https://rad-weed.github.io/rhine-lab-motion/

```bash
# 1. 克隆 / clone
git clone https://github.com/Rad-Weed/rhine-lab-motion.git
cd rhine-lab-motion

# 2. 打开演示 / open the demos
#    直接双击打开即可：
#    assets/starter/index.html   ← 主演示（零依赖）
#    assets/starter/scene3d.html ← 3D 阵列（需联网加载 three.js）
```

### 作为 WorkBuddy 技能安装 / Install as a WorkBuddy skill

```bash
# 将整个文件夹放入用户技能目录 / copy the whole folder:
#   Linux/macOS: ~/.workbuddy/skills/
#   Windows:     C:\Users\<you>\.workbuddy\skills\
```

之后在 WorkBuddy 对话中一句话调用：**"生成莱茵生命风格"**、**"莱茵生命风格的登录页"**，或输入 `/rhine-lab-motion`。
Then just say *"generate a Rhine Lab style …"* in a WorkBuddy conversation, or use `/rhine-lab-motion`.

### 复用组件 / Reuse as a library

```html
<link rel="stylesheet" href="assets/starter/rhinelab.css">
<script src="assets/starter/rhinelab.js"></script>
```

## 🔌 跨 Harness 兼容 / Cross-harness compatibility

| Harness | 安装方式 / How to use |
|---|---|
| WorkBuddy | 自动加载 / auto-loaded |
| Claude Code / agent-skills 系 | 整个文件夹放入 `~/.claude/skills/rhine-lab-motion/` |
| Codex / Cursor / Qwen Code / Gemini CLI | 保留根目录 `AGENTS.md`，自动读取 |
| 千问 / Kimi 桌面端（聊天形态） | 粘贴 `integrations/SKILL-PROMPT.txt` 全文到系统提示 |
| DSH 等自研 harness | 注入 `SKILL-PROMPT.txt` 或把包路径挂进上下文配置 |

## 🎨 设计语言速览 / Design Language at a Glance

| Token | 值 | 语义 |
|---|---|---|
| `--rl-paper` | `#e7e5e1` | 纸面底色 / warm paper base |
| `--rl-ink` | `#111214` | 墨色正文 / ink |
| `--rl-plate` | `#101112` | 深色板 / dark plate |
| `--rl-orange` | `#ff7b00` | **主强调：警告/当前/机械交互** / primary accent |
| `--rl-lime` | `#b9e432` | 次级点缀：光标/在线确认 / secondary accent |
| `--rl-amber`(暗色) | `#c5a16b` | 暗色主题强调 / dark-theme accent |

**五条铁律 / Five iron rules**
1. 橙是唯一主强调，lime 只做点缀；色彩即状态 / orange is the only primary accent; color means status
2. 少即是好（迪特·拉姆斯）——简单几何 × 多层叠加 / less but better
3. 一切皆档案——编号、日志、进度、取景框、涂抹条 / everything is an archive
4. 动效是机械的不是弹性的——outCubic/outExpo/弹簧(ζ≈0.45)，至多过冲一次 / mechanical easing, no bounce
5. 文字入场=乱码解码(32ms tick)或打字机；数字=里程计；线条=按进度绘制 / decode, typewriter, odometer, draw-on

**进阶**：3D 档案阵列（通道距 5.2 / 波浪阻尼 4.2 / 临界阻尼弹簧 ω=14）、三轨自适应 BGM、17 类交互音效、1080p HUD 布局基准 —— 详见 [`references/`](references/)。

## 📁 结构 / Structure

```
rhine-lab-motion/
├── SKILL.md                        # 技能入口：设计内核/工作流/触发方式
├── AGENTS.md                       # 跨 harness 指令（Codex/Cursor/Qwen Code 等自动读取）
├── integrations/
│   ├── SKILL-PROMPT.txt            # 自包含风格提示词（千问/Kimi/DSH 聊天端粘贴用）
│   └── README.md                   # 各 harness 适配矩阵
├── references/
│   ├── design-tokens.md            # 色板·字体·缓动库·节拍网格·1080p 布局基准
│   ├── motion-patterns.md          # 12 种动效模式详解与实现
│   ├── advanced-3d-audio.md        # 3D 阵列/解密/三轨 BGM/交互音效/暗色主题/时长表
│   ├── style-deep-dive.md          # 深度剖析：舟味配方·孤星 PV·方舟 UI 六角度·FUI 语法·Arwes 准则
│   └── sources.md                  # 全部参考出处与许可（开源必读）
└── assets/starter/
    ├── index.html                  # 自包含全要素演示（自动巡演/翻页）
    ├── scene3d.html                # 独立 3D 档案阵列页
    ├── rhinelab.css / rhinelab.js  # 可复用组件库（token + 动效 + 17 音效）
```

## ⌨️ 演示页操作 / Demo controls

- **空闲 15s** 自动巡演（每页 10s，左下角有倒计时预告）— idle 15s → auto tour, 10s per section
- **空格 / ↓** 下一页，**↑** 上一页，**Esc** 或点击角标暂停 — space/↓ next, ↑ prev, Esc pause
- 3D 页：**拖拽**环绕、**滚轮**缩放、**点击**抽出档案 + 波浪、**再点**开详情面板、**双击**复位视角、闲置 5s 自动慢速环绕 — drag to orbit, click to extract, dbl-click to reset
- 彩蛋交互：色板色块点击播放音阶、雷达点击扫频、检索输入框橙色光标 — palette = musical scale, radar = sweep, caret styled

## 📋 版本 / Versions

遵循 `0.x.0` 语义：新功能进位 x，小修进位末位。
SemVer-ish `0.x.0`: minor bump for features, patch for fixes. Current: **0.14.0**.

| 版本 | 变更 / Changes |
|---|---|
| **0.14.0** | 修复巡演角标暂停失效与键盘翻页误触发巡演；音效增益（scan/power/extract）；导航顺序对齐；色板/雷达音效交互；橙色光标；板块间距与翻页落位；3D 闲置环绕 + 双击复位 |
| 0.12.0 | 跨 harness 适配：`AGENTS.md` + `integrations/SKILL-PROMPT.txt`（千问/Kimi/DSH 可用） |
| 0.11.0 | 二轮调研蒸馏：`style-deep-dive.md`（舟味配方/孤星 PV/方舟 UI 六角度/FUI 语法/Arwes 准则）+ FUI 语法演示板块 |
| 0.10.x | 自动巡演、音效馆（17 种合成音效）、3D 拆独立页、跳动修复 |
| 0.9.0 | 一句话调用：触发词显式化 |

## 📜 许可与出处 / License & Credits

代码以 **MIT** 发布（见 [LICENSE](LICENSE)）。但请注意边界：

- **原创**：本仓库全部代码、文档与 WebAudio 合成音效 —— MIT
- **风格参考（思想层面，未复制素材）**：laiyin-video (AGPL-3.0) · RhineLabUI (MIT) · rhine-lab-art · Multiplane (Apache-2.0) · 官方 PV《莱茵生命：访问》
- **字体边界**：Novecento Sans Wide 为商业字体，项目中仅作推荐未随分发；MiSans 需遵循小米官方许可
- **《明日方舟》相关名称、标志、设定的权利归 Hypergryph / 鹰角网络**

完整出处链接（含各作者 B 站主页）见 [`references/sources.md`](references/sources.md) 与 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
Full attribution: [`references/sources.md`](references/sources.md) (Chinese) & [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

<div align="center">

*＋ ADD KNOWLEDGE · − SUBTRACT LIMITS · ＝ ∞*

</div>
