# 参考出处与致谢记录（sources）

本 skill 的视觉语言与动效参数整理自以下公开项目与文章。**若基于本 skill 的产出用于开源发布，请按此表注明来源**；各项目许可不同，引用代码/素材前先核对。

## 一、核心参考项目

### 1. laiyin-video（首个参考）
- 仓库：https://github.com/tmc5csxr9m-cpu/laiyin-video
- 作者 B 站：https://space.bilibili.com/1535117546
- 内容：莱茵生命同人宣传短片「＋ − ＝ ∞」（62.5s，1080p30），three.js + Canvas2D 逐帧离线渲染，镜头即"时间→画面"纯函数；子帧运动模糊、转场 shader、贯穿 HUD 层、合成音效与 112BPM 卡点剪辑
- 本 skill 取材：全部颜色常量、缓动函数库、2D 视觉语汇（draw.js：乱码解码 32ms tick、打字机、警告板 4Hz、里程计、HUD chrome 参数、1920×1080 布局基准）
- 许可：**AGPL-3.0-or-later**（代码）；字体 Montserrat/JetBrains Mono 为 OFL；配乐与官方 PV 未随仓库分发
- 用户关注点：**动画变换、界面布局、卡片效果**

### 2. RhineLabUI（效果惊艳，重点学习对象）
- 仓库：https://github.com/LBEILC/RhineLabUI
- 在线体验：https://rhine.lubeiluchen.cc/
- 作者 B 站：https://space.bilibili.com/40238601
- 衍生：RhineLabWallpaper（https://github.com/LBEILC/RhineLabWallpaper，Wallpaper Engine 交互桌面）
- 内容：对官方 PV《莱茵生命：访问》终端界面的可交互 3D 复刻（TS + Three.js + Vite），40 份档案五列循环阵列、360° 查看器与六组拆解、玻璃磨砂⇄清晰解密动画、三轨自适应原创配乐「观测室」、17 类交互音效、PWA
- 本 skill 取材：DESIGN.md 的相机/材质/运动全套参数（波浪阻尼 4.2、抬起高度、过渡时长表、暗色主题色值、品牌排版实测值、Rolling Number 460ms、38ms 逐字音等）
- 许可：**MIT**（代码/模型/原创配乐音效；排除《明日方舟》名称标志原 PV 采样；MiSans/Novecento/Rolling Number 遵循各自许可）
- 用户注：**特别学习其视觉 3D 效果以及 BGM 和点击音效**

### 3. rhine-lab-art（字体与风格特别）
- 仓库：https://github.com/reverieach/rhine-lab-art
- 在线体验：https://rhine.reverieach.com
- 作者 B 站：https://space.bilibili.com/495539214
- 内容：莱茵生命交互艺术网站（基于 open-active-theory 场景适配）：14 幅 CG 展陈、实时 WebGL 三维场景、鼠标粒子交互、深色实验室登录开场（登录开场改编自 RhineLabUI）
- 本 skill 取材：深色终端开场序列（欢迎页停稳后 1.5s 淡入主场景、减少动态偏好直接显示欢迎页）、Novecento Sans Wide + MiSans 字体组合与展品卡片 shader 遮罩避让（左右各 10% 裁切区）
- 许可：非官方个人研究；RhineLabUI 复制部分保留 MIT；Active Theory 发布包与原站字体音乐、官方 CG 不属自由授权——引用需查其 THIRD_PARTY_NOTICES.md

### 4. Multiplane（附属渲染器工具，与前三无直接关系）
- 仓库：https://github.com/LBEILC/Multiplane
- 内容：给 AI agent 用的本地无头 HTML 视频渲染器（名字取自迪士尼多层摄影台）：镜头 = 普通网页 + `render(t)` 纯函数，无头 Chromium 逐帧截图，超采样/运动模糊（不跨硬切）/胶片颗粒，FFmpeg 合成，确定性 lint/verify，三维层累积景深
- 许可：**Apache-2.0**
- 用途：把本 skill 的网页动效渲染成视频/静帧

## 二、官方与文章出处

- 官方视觉参考：《明日方舟》特别映像《莱茵生命：访问》（Hypergryph / 鹰角网络）；《孤星》四周年视觉
- 风格分析：《明日方舟》里的「磁带盒未来主义」（叶子学堂，微信/站酷 ZMTY0MTk4NA）；「明日方舟」里的美学（叶子学堂，站酷 ZMTQyNDAyOA）；《明日方舟》UI/UX 分析——藏在「好看」背后的先进性（腾讯游戏学院 knowledge/100122，六角度长文：画内界面/Fluent 质感/扁平深度/字体体系/焦距底图）；《明日方舟》UX 分析：游戏 UI 如何塑造轻盈友好的体验（李镇上，站酷 ZMTE0MTIyMA/语雀，互斥面板/侧边面板/弱打断/就近原则）；「孤星」PV 设计细节赏析考据（贴吧 8386410979：胶片偏色/文件夹点线面/百叶帘-CRT-光栅）；四年半了《明日方舟》还是那么出人意料（头条 7294212530582045184：孤星原子朋克+磁带盒未来主义基调）
- 复古美学谱系：原子朋克（百度百科 67789564：1950-60s 复古未来主义、苏联未来主义建筑谱系）；Atompunk Aesthetic（artstyles.com：星爆/轨道环/镀铬/原子粉彩）
- 磁带盘/∞标志设计：明日方舟画师 NoriZC（猫头鹰脸谱 + 化工科 +− 气息）

## 二·五、FUI 方法论与开源框架（0.11.0 新增调研）

- Curio Design：What is FUI Sci-Fi HUD（designbycurio.com/zh/learn/fui-sci-fi-hud）——FUI 定义、速度/氛围/戏剧清晰度检验
- DESIGN.md：HUD / Sci-Fi FUI（designmd.app/library/hud-sci-fi-fui）——风格规格卡（色彩/清单/AI 提示词）
- muriel FUI vocabulary（muriel.mindbendingpixels.com/vocabularies/fui）——视觉语法（细线/角标/tabular-nums/leader lines/scanline 3%/stagger 100ms/贝塞尔/圆形语法语义化/glitch 标点化/避雷清单）；Perception NYC、Territory Studio、GMUNK、Jayse Hansen 谱系
- Chris Lemke：Sci-Fi Interface Design Reference（chrislemke.github.io）——视觉特征 16 条 + CSS-only HUD 技法（conic 雷达/扫描线/六边形/辉光脉冲环/角标括号）+ 字体族（Orbitron/Electrolize/Share Tech Mono，Eurostile 血统）
- StyleRef：Sci-Fi HUD Console（styleref.io）——4pt 网格/hairline/角标代边框/语义色/超大等宽数字锚点
- Arwes：arwes.dev（github.com/arwes/arwes）设计动画音效准则——装配/拆解转场、bleeps 声音管理（同声去重/重放重启）、编排器 parallel/sequence/stagger、Titillium Web+Electrolize；设计准则原文见 github.com/iwestlin/arwes/tree/master/guidelines
- SkillMD：Sci-Fi Interface Design（skillmd.com/skills/thedixitjain/sci-fi-interface）——CSS 角标括号实现示例

## 三、开源注明建议（模板）

```
本项目视觉风格参考并致敬《明日方舟》莱茵生命（© Hypergryph / 鹰角网络，同人非官方）。
动效与设计 token 学习自以下开源项目：
- laiyin-video (AGPL-3.0) — github.com/tmc5csxr9m-cpu/laiyin-video
- RhineLabUI (MIT) — github.com/LBEILC/RhineLabUI
- rhine-lab-art — github.com/reverieach/rhine-lab-art
- Multiplane (Apache-2.0) — github.com/LBEILC/Multiplane
字体：MiSans（小米）、Montserrat / JetBrains Mono（OFL）、Novecento Sans Wide（商业授权，需自行处理）
```

## 四、注意事项

- 《明日方舟》、莱茵生命及相关名称、标志、原 PV 的权利归 Hypergryph/鹰角网络，任何产出应声明非官方同人
- 原片音频采样（如 38ms 逐字短音）不随开源代码授权，需自行提取或用合成替代（本 skill starter 的 rlSfx 为 WebAudio 合成，无版权风险）
- Novecento Sans Wide 为商业字体；开源替代可用固定字形轮廓（SVG path）或改用免费宽体字
