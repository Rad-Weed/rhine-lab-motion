<div align="center">

# RHINE LAB MOTION

**莱茵生命（明日方舟）动效风格技能包 · Rhine Lab (Arknights) Motion & UI Style Kit**

*Science-fiction archive-terminal aesthetics for the web — paper white, ink black, warning orange.*

[![Version](https://img.shields.io/badge/version-0.15.3-orange)]() [![License: MIT](https://img.shields.io/badge/license-MIT-green)]() [![Made for WorkBuddy](https://img.shields.io/badge/made%20for-WorkBuddy-blue)]()

一套蒸馏自官方 PV、开源同人项目与电影级 FUI 方法论的**完整设计语言**：
编辑设计系统 · 设计 token · 12+ 动效模式 · ∞ 立体档案卷 · 21 种合成音效 · 终端登录开场。
零版权风险（音效全部 WebAudio 实时合成，无任何原片采样）。

</div>

---

## ✨ 这是什么 / What is this

**中文**：本项目是一套可复用的「莱茵生命」风格设计语言，以 [WorkBuddy](https://www.workbuddy.cn) 技能（skill）形式组织。它的核心不是"动效组件库"，而是一套**编辑设计系统**——把每一页当作一册被投影到屏幕上的印刷档案来排版：网格、字阶、构图纪律、印刷工艺痕迹，动效与音效只是从属。素材提炼自《明日方舟》特别映像《莱茵生命：访问》的视觉语言、高质量开源同人项目（laiyin-video / RhineLabUI / rhine-lab-art / Multiplane）、中文游戏 UI 分析文章，以及好莱坞 FUI（Fictional User Interface）设计方法论。

**English**: A reusable "Rhine Lab" design language, packaged as a [WorkBuddy](https://www.workbuddy.cn) skill. Its core is not a component showcase but an **editorial design system** — every page is composed as a printed dossier projected onto a screen: grid, type scale, composition discipline, and printing artifacts first; motion and sound are subordinate. It distills the visual language of the Arknights promotional film *"Rhine Lab: Access"*, high-quality fan projects (laiyin-video / RhineLabUI / rhine-lab-art / Multiplane), Chinese game-UI analyses, and Hollywood-grade FUI methodology.

> **非官方同人声明 / Unofficial fan work.** 本项目与 Hypergryph / 鹰角网络无隶属、未获认可。Not affiliated with or endorsed by Hypergryph / Hypergryph Network.

## 🌐 在线演示 / Live Demo（GitHub Pages）

| 页面 | 地址 |
|---|---|
| 演示索引 / Demo index | https://rad-weed.github.io/rhine-lab-motion/ |
| **档案册（旗舰）** / Dossier (flagship) | https://rad-weed.github.io/rhine-lab-motion/assets/starter/index.html |
| 动效手册 / Motion lab | https://rad-weed.github.io/rhine-lab-motion/assets/starter/motion-lab.html |
| **∞ 档案卷（3D）** / Archive roll | https://rad-weed.github.io/rhine-lab-motion/assets/starter/scene3d.html |

## 🖼 三个演示 / Three demos

| 文件 | 内容 |
|---|---|
| `assets/starter/index.html` | **档案册（旗舰 / flagship）** — 七版面印刷档案册：封面 / 索引 / 正文 / 数据 / 图版 / 海报 / 版权页。含 45° 网点制版图版、套准/裁切/色条/折线/装订孔、贴纸胶带印章涂抹条、拆封开场、`G` 键网格叠加、21 种音效。整册零 WebGL。 |
| `assets/starter/motion-lab.html` | **动效手册 / motion lab** — 终端登录开场 + 19 个编号板块（排版 / 乱码解码 / 打字机 / 里程计 / 解密 / 警告板 / 故障转场 / 音效馆 / FUI 语法…）+ 自动巡演 + 键盘可达性。同样注入了档案册的印刷版式层。 |
| `assets/starter/scene3d.html` | **∞ 档案卷 / archive roll** — 320 张纸页沿双纽线层层叠压，每页与路径垂直并逐页微旋，形成**一卷有体积、带自阴影的 ∞**（环内 ＋/−）。鼠标靠近鼓起波浪、点击抽出一页并转正、再点展开档案内容。Three.js，需联网。 |

三个页面均为**单文件自包含**（CSS/JS 内联），浏览器直接打开即可运行；只有 3D 页需要联网加载 three.js CDN。

All three pages are **self-contained** (CSS/JS inlined) — just open them in a browser. Only the 3D page needs network access for the three.js CDN.

## 🚀 快速开始 / Quick Start

> 💡 **不想克隆？直接看在线演示 / Prefer a live look?** → https://rad-weed.github.io/rhine-lab-motion/

```bash
# 1. 克隆 / clone
git clone https://github.com/Rad-Weed/rhine-lab-motion.git
cd rhine-lab-motion

# 2. 打开演示 / open the demos（直接双击即可）
#    assets/starter/index.html        ← 档案册（零依赖，建议从这里开始）
#    assets/starter/motion-lab.html   ← 动效手册（零依赖）
#    assets/starter/scene3d.html      ← ∞ 档案卷（需联网加载 three.js）
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
<!-- 动效手册的组件库（token + 动效 + 17 音效） -->
<link rel="stylesheet" href="assets/starter/rhinelab.css">
<script src="assets/starter/rhinelab.js"></script>
```

档案册的版式基座是另一套（更偏印刷）：`assets/dossier/dossier.css` + `dossier.js` + `index.src.html`，组装方式见文件内 `__INLINE_CSS__` / `__INLINE_JS__` 占位符。

The dossier uses a separate print-oriented base: `assets/dossier/` (template + css + js, assembled via `__INLINE_*__` placeholders).

## 🔌 跨 Harness 兼容 / Cross-harness compatibility

| Harness | 安装方式 / How to use |
|---|---|
| WorkBuddy | 自动加载 / auto-loaded |
| Claude Code / agent-skills 系 | 整个文件夹放入 `~/.claude/skills/rhine-lab-motion/` |
| Codex / Cursor / Qwen Code / Gemini CLI | 保留根目录 `AGENTS.md`，自动读取 |
| 千问 / Kimi 桌面端（聊天形态） | 粘贴 `integrations/SKILL-PROMPT.txt` 全文到系统提示 |
| DSH 等自研 harness | 注入 `SKILL-PROMPT.txt` 或把包路径挂进上下文配置 |

## 🎨 设计语言速览 / Design Language at a Glance

### 编辑设计（骨架 / skeleton）

| 项 | 值 |
|---|---|
| 版心 / measure | 1180px，页边 56px |
| 网格 / grid | 12 栏，栏距 20px，基线 8px |
| 字号阶梯 / type scale | 大标题 → 正文 → 脚注，字距随字号光学调整（大到 −0.035em，小到 +0.24em） |
| 构图 / composition | **一页一锚点**、尺度对比 ≈10:1、静区 ≥40%、密→空→密、7:5 非对称版面、注释即纹理 |
| 印刷件 / print artifacts | 13 种：裁切标记、套准靶、色条、折线、装订孔、贴纸、胶带、印章、涂抹条、边注、脚注、图注、校改栏 |
| 网点 / halftone | 45° 网屏，点径 `√density × cell × 0.63`，套准橙点占 1–2% 面积 |

### 色彩（色彩即状态 / colour means status）

| Token | 值 | 语义 |
|---|---|---|
| `--rl-paper` | `#e7e5e1` | 纸面底色 / warm paper base |
| `--rl-ink` | `#111214` | 墨色正文 / ink |
| `--rl-plate` | `#101112` | 深色板 / dark plate |
| `--rl-orange` | `#ff7b00` | **主强调：警告 / 当前 / 机械交互** / primary accent |
| `--rl-lime` | `#b9e432` | 次级点缀：光标 / 在线确认 / secondary accent |
| `--rl-amber`（暗色） | `#c5a16b` | 暗色主题强调 / dark-theme accent |

**六条铁律 / Six iron rules**
1. 一页一个锚点，其余留白——版面先成立，动效才加 / one anchor per page; whitespace before motion
2. 橙是唯一主强调，lime 只做点缀；遮盖用黑版不用专色 / orange only as accent; redaction uses black plate
3. 少即是好（迪特·拉姆斯）——简单几何 × 多层叠加 / less but better
4. 一切皆档案——编号、日志、进度、取景框、涂抹条 / everything is an archive
5. 动效只做三件事：压印、显影、归档——机械缓动，至多过冲一次 / impression, development, filing; no bounce
6. 文字=乱码解码或打字机；数字=里程计；线条=按进度绘制 / decode, typewriter, odometer, draw-on

**进阶**：∞ 档案卷（320 页等弧长布点 / 自阴影 / 实例化）、纸质音效包络（翻页 / 盖章 / 划擦 / 撕封）、三轨自适应 BGM、1080p HUD 布局基准 —— 详见 [`references/`](references/)。

## 📁 结构 / Structure

```
rhine-lab-motion/
├── SKILL.md                        # 技能入口：设计内核（文件而非界面）·工作流·触发方式
├── AGENTS.md                       # 跨 harness 指令（Codex/Cursor/Qwen Code 等自动读取）
├── README.md · LICENSE · THIRD_PARTY_NOTICES.md
├── index.html                      # GitHub Pages 着陆页（演示索引）
├── integrations/
│   ├── SKILL-PROMPT.txt            # 自包含风格提示词（千问/Kimi/DSH 聊天端粘贴用）
│   └── README.md                   # 各 harness 适配矩阵
├── references/
│   ├── editorial-system.md         # ★ 编辑设计系统：网格·字阶·构图六律·13 印刷件·网点·版式模板
│   ├── design-tokens.md            # 色板·字体·缓动库·节拍网格·1080p 布局基准
│   ├── motion-patterns.md          # 12 种动效模式详解与实现
│   ├── advanced-3d-audio.md        # 3D/解密/三轨 BGM/交互音效/暗色主题/时长表
│   ├── style-deep-dive.md          # 深度剖析：舟味配方·孤星 PV·方舟 UI 六角度·FUI 语法·Arwes 准则
│   └── sources.md                  # 全部参考出处与许可（开源必读）
└── assets/
    ├── dossier/                    # 档案册版式基座（源文件，可重新组装）
    │   ├── dossier.css             # 网格·字阶·印刷件·版式模板
    │   ├── dossier.js              # 音频总线·网点制版·拆封·入场
    │   ├── index.src.html          # 七版面模板（__INLINE_CSS__ / __INLINE_JS__ 占位）
    │   ├── lab-retrofit.css        # 手册的印刷版式补丁（可重复注入）
    │   └── lab-retrofit.js
    └── starter/
        ├── index.html              # 档案册（成品，自包含）
        ├── motion-lab.html         # 动效手册（成品，自包含）
        ├── scene3d.html            # ∞ 档案卷（成品，自包含，需联网）
        └── rhinelab.css / rhinelab.js  # 手册组件库（token + 动效 + 17 音效）
```

## ⌨️ 演示页操作 / Demo controls

**档案册 `index.html`**
- 进入：点击封面的 **UNSEAL 印章**（撕封条音效）— click the UNSEAL seal to break the seal
- **G**：叠加/隐藏 12 栏网格与基线，自查版式 — toggle grid & baseline overlay
- 涂抹条 **hover** 显字、贴纸/胶带/印章均为纯 CSS 印刷件 — hover redactions to reveal

**动效手册 `motion-lab.html`**
- **空闲 15s** 自动巡演（每页 10s，左下角有倒计时预告）— idle 15s → auto tour, 10s per section
- **空格 / ↓** 下一页，**↑** 上一页，**Esc** 暂停 — space/↓ next, ↑ prev, Esc pause
- **Tab + Enter** 可在音效馆 / 色板 / 档案卡间纯键盘操作 — full keyboard access

**∞ 档案卷 `scene3d.html`**
- **拖拽**环绕、**滚轮**缩放、**点击**抽出一页并转正、**再点**展开档案内容、**Esc** 归位 — drag / wheel / click to extract / click again to open / Esc to file back
- 鼠标靠近纸卷会鼓起波浪，悬停显示编号与标题 — hover raises a wave and shows the file label

## 📋 版本 / Versions

遵循 `0.x.0` 语义：新功能进位 x，小修进位末位。
SemVer-ish `0.x.0`: minor bump for features, patch for fixes. Current: **0.15.3**.

| 版本 | 变更 / Changes |
|---|---|
| **0.15.3** | 声音与波形修正：①音效改为**颗粒化纸声**（上千个高通脉冲组成的 crackle 颗粒底 + 峰值归一化 + 压缩总线），不再是扫频噪声的呼呼声；电平重标 rustle −29 / extract −20 / insert −23 / stamp −23 dBFS②波浪改为**横波**——位移垂直于纸带（≈ 世界 Z 起伏），不再是沿路径挤压的纵波；③默认动态加强：双频横波 + 纸页绕法线微扭，幅度 0.175/0.105；④**± 始终正对相机**（不限幅，绕到背面也正面朝你，保留 0.34 rad 内倾露厚度） |
| 0.15.2 | 3D 手感与生命感：①拖拽**上下反向**（往下拖镜头抬起）②**悬停时朝镜头抽出一角并转向你**（2.2 单位 + 42% 朝向插值），点击才完全抽出并**向四周发出扩散波**（34ms/单位延迟、4.6 高斯衰减）③**± 限幅 ±60° 朝向相机**（正反面都成立，保留厚度）④阵列自带**沿路径行进的默认微浪**（`sin(t·1.15 − i·0.085)` × 呼吸包络），静止时也在呼吸 |
| 0.15.1 | 3D 页修四处：①音效重做为**纸质音效**（缓起包络 5–35ms + 压缩总线 + 全量重标，峰值 −22~−30 dBFS，不再是噪声爆响）②点开另一张档案时**上一张自动飞回原位**（0.3s 插值 + 复位实例，无残留、无泄漏）③**± 改为三维挤出几何**（倒角/厚度/投影，对齐两瓣面心 ±8.84）④背景场景化：印版边框 + 边缘刻度 + 四角套准靶 + 45° 网点 + 地面测绘网格 + CSS 裁切标记 |
| 0.15.0 | **3D 重构为 ∞ 档案卷**：320 张纸页沿双纽线等弧长层层叠压、每页与路径垂直并逐页微旋，实例化单次绘制 + 自阴影；修 `slerpQuaternions` 与"抽出页命中"两处真 bug |
| 0.14.4 | 堆叠轴改为竖向（每站 5 层）——后被 0.15.0 取代 |
| 0.14.3 | 3D 改为立体纸壳雕塑（56 站点 × 3 层径向外扇 + 环内 ±） |
| 0.14.2 | 3D 首版重构：72 张纸页等弧长排成 ∞ 标志（解决参数均匀 ≠ 视觉均匀） |
| 0.14.1 | 旧演示统一版式：`motion-lab.html` 注入印刷版式层（版口/页码/裁切角标），逻辑零改动 |
| **0.14.0** | **编辑设计重做**：新增 `references/editorial-system.md`；旗舰演示重建为七版面印刷档案册（网点制版/拆封开场/21 音效）；原演示保留为 `motion-lab.html` |
| 0.13.x | 板块动画离场重播、键盘可达性、翻页时序修复（飞行期触发入队、落地统一补播） |
| 0.12.x | 跨 harness 适配（`AGENTS.md` + `SKILL-PROMPT.txt`）；音效链重构（主增益总线 + 全音效重标）；检索框终端式块光标；翻页精准化 |
| 0.11.0 | 二轮调研蒸馏：`style-deep-dive.md`（舟味配方 / 孤星 PV / 方舟 UI 六角度 / FUI 语法 / Arwes 准则）+ FUI 语法板块 |
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
