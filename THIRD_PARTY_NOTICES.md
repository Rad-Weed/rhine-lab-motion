# THIRD-PARTY NOTICES / 第三方出处与许可声明

本仓库（rhine-lab-motion）的全部**代码、文档与 WebAudio 合成音效均为原创**，以 MIT 许可发布。
所有第三方内容仅在**思想/方法论层面**作为风格参考，未复制任何受版权保护的素材（图片、音频、模型、字体文件）。

All code, documentation and WebAudio-synthesised sound effects in this repository are **original work** released under the MIT license. Third-party content was referenced at the level of **ideas and methodology only** — no copyrighted assets (images, audio, 3D models, font files) have been copied or redistributed.

---

## 1. 参考的开源项目 / Open-source projects referenced (ideas, not code)

### 1.1 laiyin-video — 莱茵生命同人宣传短片「＋ − ＝ ∞」
- Repository: https://github.com/tmc5csxr9m-cpu/laiyin-video
- Author Bilibili: https://space.bilibili.com/1535117546
- License: **AGPL-3.0-or-later**（代码）；Montserrat / JetBrains Mono 为 SIL OFL 1.1
- 借鉴内容：逐帧渲染的"镜头即纯函数"思路、节拍网格（112 BPM）概念、2D 视觉语汇分类方式。
  本仓库未复制其任何代码；设计常量（色板/缓动参数）系独立观察官方 PV 与公开分析后自行测定与命名。

### 1.2 RhineLabUI — 莱茵生命交互式 3D 终端复刻
- Repository: https://github.com/LBEILC/RhineLabUI
- Live: https://rhine.lubeiluchen.cc/
- Author Bilibili: https://space.bilibili.com/40238601
- License: **MIT**（Copyright (c) 2026 LBEILC）
- 借鉴内容：设计约束方法论（相机校准/材质/运动参数表）、档案阵列交互范式（选中抬起+波浪+抽取）、三轨配乐与分类音效的**组织思路**。
  本仓库未复制其代码、模型（GLB）、配乐或原片音频采样；相关数值（如通道距 5.2、阻尼 4.2）作为公开文档中的技术参数引用并注明。

### 1.3 rhine-lab-art — 莱茵生命交互艺术网站
- Repository: https://github.com/reverieach/rhine-lab-art
- Live: https://rhine.reverieach.com
- Author Bilibili: https://space.bilibili.com/495539214
- 借鉴内容：深色终端登录开场的叙事结构（其本身改编自 RhineLabUI）。
- 注意：该仓库的 Active Theory 发布包、官方 CG 与字体不属于自由授权，本仓库未使用。

### 1.4 Multiplane — 无头 HTML 视频渲染器
- Repository: https://github.com/LBEILC/Multiplane
- License: **Apache-2.0**
- 借鉴内容：仅作为"将网页动效渲染为视频"的工具推荐提及，未复制代码。

## 2. 商业素材边界 / Commercial asset boundaries

- **《明日方舟》(Arknights)、莱茵生命 (Rhine Lab)**：名称、标志、设定、角色、原 PV 的权利归 **Hypergryph / 鹰角网络（Hypergryph Network）**。本仓库为非官方同人风格研究，不包含任何官方美术素材。
- **Novecento Sans Wide**：商业字体（Typotheque）。本仓库**未分发**该字体，仅作推荐提及；开源替代请使用宽体无衬线或固定字形轮廓。
- **MiSans**：小米官方字体，需遵循小米官方许可。本仓库未分发。
- **Montserrat / JetBrains Mono / Orbitron / Share Tech Mono / Titillium Web / Electrolize**：OFL/开源许可字体，仅作推荐提及，本仓库未内嵌字体文件。

## 3. 原片音频采样 / Audio sampling

RhineLabUI 的逐字输入短音源自原 PV（约 6.864–6.986s 的三个 38ms 短音），**不属于**其 MIT 授权范围。
本仓库的所有音效均为 **Web Audio API 实时合成**（振荡器 + 噪声 + 滤波扫频），不含任何原片采样，可安全开源使用。

## 4. 方法论文章 / Methodology articles（思想参考）

- 叶子学堂骨头：《明日方舟》里的「磁带盒未来主义」（微信公众号 / 站酷 ZMTY0MTk4NA）
- 叶子学堂骨头：「明日方舟」里的美学（站酷 ZMTQyNDAyOA）
- 腾讯游戏学院：《明日方舟》UI/UX 分析——藏在「好看」背后的先进性（knowledge/100122）
- 李镇上：《明日方舟》UX 分析：游戏 UI 如何塑造轻盈友好的体验？（站酷 ZMTE0MTIyMA）
- 百度贴吧：「孤星」PV 部分设计细节个人向简要赏析（tid=8386410979）
- FUI 方法论：Curio Design（designbycurio.com）、DESIGN.md（designmd.app）、muriel vocabularies（muriel.mindbendingpixels.com）、Chris Lemke Sci-Fi Interface Reference、StyleRef（styleref.io）、SkillMD
- Arwes 框架设计准则：github.com/arwes/arwes（guidelines）
- 原子朋克谱系：百度百科、artstyles.com 等

以上文章/框架仅作为设计思想来源，本仓库未复制其文本或代码。
