# 莱茵生命设计 Token（design tokens）

来源：官方 PV《莱茵生命：访问》/《孤星》视觉语言 + 同人逐帧渲染短片（laiyin-video，AGPL）代码中的常量提炼。

## 一、色板

### 底色与墨色（占画面 90% 以上）

| 变量 | Hex | 用途 |
|---|---|---|
| `--rl-paper` | `#e7e5e1` | 纸面底色（暖灰白，主背景） |
| `--rl-card` | `#f6f5f2` | 卡片底色（比纸面更亮一档） |
| `--rl-tab` | `#e2e0dc` | 标签页/分区底色 |
| `--rl-faint` | `#c9c6c0` | 极浅灰（分割线、次要底） |
| `--rl-mute` | `#8b8882` | 弱化灰（次要文字） |
| `--rl-ink` | `#111214` | 主墨色（正文、结构线） |
| `--rl-ink-inv` | `#f2f0eb` | 深色板上的反白字 |
| `--rl-plate` | `#101112` | 深色板（胶囊、黑块、黑板） |

### 强调色（占比 < 10%）

| 变量 | Hex | 用途 |
|---|---|---|
| `--rl-orange` | `#ff7b00` | **主强调**：警告、当前项、机械交互、步骤指示 |
| `--rl-orange-deep` | `#e35d00` | 深橙（橙的按下态/渐变端） |
| `--rl-lime` | `#b9e432` | 次级点缀：打字机光标、高亮边框、套准点 |

### 网格线（低存在感）

- 方格网格：`rgba(17,18,20,0.06)`
- 蜂窝六边形网格：`rgba(17,18,20,0.08)`（六边形外接圆半径约 26px @1080p）
- 机密照片边框：`rgba(17,18,20,0.35)`

**灰阶纪律**：mute / faint / card / paper 四档足够，不要发明第五档灰。

## 二、字体系统

| 用途 | 字体 | 回退链 | 字重 |
|---|---|---|---|
| 中文 | MiSans | `"Noto Sans CJK SC","Source Han Sans SC","PingFang SC","Microsoft YaHei",sans-serif` | 500 默认 |
| 英文标题/正文 | Montserrat | 系统无衬线兜底 | 500 默认，标题 600/700，轻数据 300 |
| 等宽数据/编号 | JetBrains Mono | `ui-monospace,Consolas,monospace` | 400/600 |

CSS 变量：

```css
--rl-font-sans: "Montserrat","MiSans","Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif;
--rl-font-mono: "JetBrains Mono",ui-monospace,Consolas,monospace;
```

### 字距（tracking）规范

- 全大写英文标签：`letter-spacing: 0.08em ~ 0.3em`（如 "WARNING" 用 6px @30px 字号）
- 章节代号（4 字母）：`-0.045em`（紧凑、机械感）
- 大标题：`-0.3px ~ -0.5px`
- 双语字幕：中文 23px/500/tracking 2px，英文 11px/600/tracking 3.2px
- `fitTracking` 技巧：副标题用 JS 调整字距精确铺满指定宽度

## 三、缓动函数库

参考片使用的完整缓动集合（t 归一化 0..1）：

| 名称 | 公式 / CSS | 使用场景 |
|---|---|---|
| `outCubic` | `1-(1-t)³` / `cubic-bezier(0.33,1,0.68,1)` | **默认入场**，90% 场景 |
| `outQuart` | `1-(1-t)⁴` | 快速展开（括号、进度条） |
| `outQuint` | `1-(1-t)⁵` | 大块面板展开 |
| `outExpo` | `1-2^(-10t)` / `cubic-bezier(0.16,1,0.3,1)` | 数字/数据闪现 |
| `inOutExpo` | 对称指数 | 运镜、位移 |
| `inOutSine` | `-(cos(πt)-1)/2` | 循环漂移（烟雾、背景） |
| `smooth` | `t²(3-2t)` | 透明度、颜色过渡 |
| `outBack` | `1+c3(t-1)³+s(t-1)², s=1.70158` | 徽章、图标落位（轻微过冲一次） |
| `spring` | 临界阻尼阶跃 `1-(1+ωt)e^(-ωt)`，ω≈14/s | 机械跟随（无过冲） |
| `springy` | 欠阻尼 ζ≈0.45，ω≈18/s | 允许过冲一次的机械部件 |

**禁用**：多圈弹跳（bounce）、橡皮筋式弹性。机械感 = 至多过冲一次。

JS 参考实现：

```js
const outCubic = t => 1 - Math.pow(1 - Math.min(Math.max(t,0),1), 3);
const outExpo  = t => { t = Math.min(Math.max(t,0),1); return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };
const spring   = (t, w = 14) => t <= 0 ? 0 : 1 - (1 + w * t) * Math.exp(-w * t);
const springy  = (t, w = 18, z = 0.45) => {
  if (t <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
};
```

## 四、节拍网格（配乐剪辑用）

- BPM 112 → 一拍 `0.5357s`，一小节 `2.1429s`
- 所有入场、转场、镜头切换对齐拍点；一小节 = 一个完整叙事小节
- 确定性噪声（乱码、抖动用，保证逐帧渲染可复现）：

```js
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return x - Math.floor(x); };
const hash2 = (a, b) => hash(a * 157.31 + b * 113.97);
```

## 五、布局基准（1920×1080）

| 元素 | 位置/尺寸 |
|---|---|
| 左侧竖轨线 | x=429，宽 2px，lime 标记块 38×22（左偏 18） |
| 页脚（右下） | y=967：横线 24×5 + "POWERED BY RHINE LAB"，18.5px |
| 双语字幕 | 居中 x=960，y=1006；深色板模式左右各留 18px，板高 62 |
| 步骤指示器 | 右上角 x=1860，5 节点间距 44 |
| 页眉 | 左：RHINE LAB 主标 46px/700/字距 0.92；中：SYNTHESIZE INFORMATION 17.6px；右：ANALYSIS(300)+OS(700) |
| 取景框四角 | 角长 18px，线宽 2px |
| 括号 bracket | 34px，线宽 7px |
| 数据行 | 行高 20px，字号 12px，值列偏移 120px |
| 日志行 | 行高 17px，字号 10.5px，行前 `·` 偏移 -10px |

## 六、官方站点实测补充（0.17.0，2026-10 采集）

完整数据与复测方法见 `official-pages.md`；这里是可直接抄进 CSS 的部分。

### 6.1 双模式色板

```css
/* 档案模式（纸）——本 skill 默认 */
--rl-paper:#f6f3eb;        /* 暖纸；官方 terra 用更冷的 #f7f7f7，二选一，不要混 */
--rl-ink:#151513;
--rl-orange:#e9521c;       /* 运行态 */
--rl-crimson:#b0243b;      /* 归档态：印章/批注/卷宗号/已阅 */
--rl-crimson-deep:#cd1a37; /* 印章按下/双色套印 */
--rl-warn-yellow:#fff000;  /* 极小面积标记，官方 terra 实测 */

/* 站点模式（黑）——终端页/展陈页/门厅页 */
--rl-black:#000;
--rl-panel:#1d1f20;
--rl-panel-2:#242424;
--rl-cyan:#18d1ff;         /* 唯一高亮色 */
--rl-grey-1:#d2d2d2; --rl-grey-2:#ababab; --rl-grey-3:#8d8d8d; --rl-grey-4:#585858;
--rl-scrim:.35 / .5 / .7 / .8;  /* 模糊背景前的压暗四档 */
```

### 6.2 官方字阶（rem = 16px，实测出现频次排序）

| px | rem | 用途 |
|---|---|---|
| 14 | .875 | 正文（官方最高频） |
| 20 | 1.25 | 小标题/导语（第二高频） |
| 18 / 16 / 12 | 1.125 / 1 / .75 | 副标 / 正文备选 / 微排版 |
| 24 / 32 / 40 | 1.5 / 2 / 2.5 | 章节标题 |
| 60 / 112 | 3.75 / 7 | 大锚点（**112 = 一个字撑一页**） |

- 显示级字距 `-0.05em`（官方 10 处，全在 60px 以上）
- 导航/标签：`2px` / `1px`；装饰竖排 `.5em`；胶囊 `.1em`

### 6.3 官方时值

| 时长 | 场景 | 备注 |
|---|---|---|
| `.3s` | 默认微交互（opacity / color / bg / transform） | 两站都是最高频 |
| `.4s cubic-bezier(.22,.58,.12,.98)` | 位移+淡入需要手感时 | 泰拉记事社 |
| `.6s` | 面板展开 / 图片显影 | |
| `1s` | hero 转场 / 整屏切换 | |

**必须记住的一条**：官方把 `visibility` 绑在同一时长上——
`transition:opacity .3s,visibility .3s`。隐藏后立即脱离事件，且动画中不闪。

### 6.4 声音策略

官方站点音频挂**显式开关**（ak 官网顶栏有音量按钮），默认不出声。
→ 循环音/BGM 一律默认静音；只有用户手势后的**一次性反馈音**可以立即响。
