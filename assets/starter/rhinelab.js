/* Rhine Lab motion library — 提炼自莱茵生命同人短片（laiyin-video, AGPL）与官方 PV 语言 */

/* ── 缓动 ── */
const EASE = {
  outCubic: (t) => 1 - Math.pow(1 - clamp01(t), 3),
  outQuart: (t) => 1 - Math.pow(1 - clamp01(t), 4),
  outExpo: (t) => { t = clamp01(t); return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); },
  smooth: (t) => { t = clamp01(t); return t * t * (3 - 2 * t); },
};
const clamp01 = (x) => Math.min(1, Math.max(0, x));

/* 确定性噪声（乱码/抖动可复现） */
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return x - Math.floor(x); }
function hash2(a, b) { return hash(a * 157.31 + b * 113.97); }

/* ── 模式 1：乱码解码显现 ── */
const RL_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
function rlScramble(el, { duration = 800, tail = 3, tick = 32 } = {}) {
  const target = el.dataset.text ?? el.textContent;
  el.dataset.text = target;
  const t0 = performance.now();
  let raf;
  const frame = (now) => {
    const p = clamp01((now - t0) / duration);
    const solved = Math.floor(EASE.outCubic(p) * target.length);
    const t = Math.floor(now / tick);
    let out = target.slice(0, solved);
    for (let i = solved; i < Math.min(target.length, solved + tail); i++)
      out += RL_GLYPHS[Math.floor(hash2(i + (el.dataset.seed | 0) * 31, t) * RL_GLYPHS.length)];
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(frame);
    else el.textContent = target;
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* ── 模式 2：打字机 + 块状光标（逐字音效，最短间隔 24ms） ── */
function rlType(el, { duration = 900 } = {}) {
  const target = el.dataset.text ?? el.textContent;
  el.dataset.text = target;
  const t0 = performance.now();
  let lastN = -1, lastTick = 0;
  const frame = (now) => {
    const p = clamp01((now - t0) / duration);
    const n = Math.floor(EASE.outCubic(p) * target.length);
    if (n > lastN && now - lastTick >= 24) { rlSfx("type"); lastTick = now; }
    lastN = n;
    el.innerHTML = target.slice(0, n) + '<span style="display:inline-block;width:0.55em;height:0.95em;background:var(--rl-lime);vertical-align:-0.12em;margin-left:2px"></span>';
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  };
  requestAnimationFrame(frame);
}

/* ── 模式 3：中文字符逐个滑入 ── */
function rlCjkReveal(el, { duration = 900 } = {}) {
  const text = el.textContent;
  el.textContent = "";
  const chars = [...text].map((ch) => {
    const s = document.createElement("span");
    s.className = "cjk-in";
    s.textContent = ch;
    el.appendChild(s);
    return s;
  });
  chars.forEach((s, i) => {
    s.style.animationDelay = `${(i / chars.length) * duration}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add("show")));
  });
}

/* ── 模式 5：里程计数字 ── */
function rlOdometer(el, { to = 99999, duration = 1600 } = {}) {
  const from = 0;
  const t0 = performance.now();
  const fmt = (n) => Math.floor(n).toLocaleString("en-US");
  const frame = (now) => {
    const p = clamp01((now - t0) / duration);
    el.textContent = fmt(from + (to - from) * EASE.outExpo(p));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ── 模式 4：分级入场（staggered） ── */
function rlStagger(rows, { unit = 300, offsets = [0, 0.5, 1.1] } = {}) {
  rows.forEach((row, i) => {
    const off = offsets[i % offsets.length] * unit;
    setTimeout(() => row.classList.add("show"), off + Math.floor(i / offsets.length) * unit);
  });
}

/* ── 模式 10：∞ 标记按笔顺绘制 ── */
function rlMark(svg, { duration = 1400 } = {}) {
  const paths = svg.querySelectorAll("path");
  paths.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.33,1,0.68,1)`;
    requestAnimationFrame(() => requestAnimationFrame(() => (p.style.strokeDashoffset = 0)));
  });
}

/* ── WebAudio 合成音效库（17 种，无版权风险，替代原片采样） ──
   glass=玻璃轻碰 ui=电子反馈 thump=机械归位 type=打字 beep=确认音 chime=成功和弦
   alarm=警告双音 scan=扫描扫频 whoosh=转场噪声 step=步进刻度 unlock=解锁 lock=落锁
   power=上电 extract=档案抽出 insert=档案归位 glitch=数据故障 error=拒绝 */
const RL_SFX = {
  glass:  { f: 3200, type: "sine",   dur: 0.02,  g: 0.12, drop: 0.6 },
  ui:     { f: 640,  type: "square", dur: 0.045, g: 0.05, drop: 0.6 },
  thump:  { f: 190,  type: "sine",   dur: 0.05,  g: 0.2,  drop: 0.6 },
  type:   { f: 2200, type: "square", dur: 0.008, g: 0.028, drop: 0.5 },
  beep:   { f: 1200, type: "sine",   dur: 0.06,  g: 0.06, drop: 0.9 },
  chime:  { notes: [659.25, 880], type: "sine", dur: 0.16, g: 0.07, gap: 0.09 },
  alarm:  { notes: [880, 660, 880, 660, 880, 660], type: "square", dur: 0.09, g: 0.045, gap: 0.1 },
  scan:   { sweep: [400, 1600], type: "sawtooth", dur: 1.2, g: 0.12 },
  whoosh: { noise: true, dur: 0.32, g: 0.09, sweepFilter: [3200, 260] },
  step:   { f: 1400, type: "triangle", dur: 0.012, g: 0.05, drop: 0.7 },
  unlock: { notes: [523.25, 783.99], type: "sine", dur: 0.13, g: 0.07, gap: 0.09 },
  lock:   { notes: [392, 246.94], type: "square", dur: 0.1, g: 0.05, gap: 0.11 },
  power:  { sweep: [120, 480], type: "sawtooth", dur: 0.5, g: 0.13 },
  extract:{ noise: true, dur: 0.28, g: 0.16, sweepFilter: [500, 3000] },
  insert: { noise: true, dur: 0.26, g: 0.13, sweepFilter: [2800, 300] },
  glitch: { notes: [820, 320, 1650, 520, 1230, 410], type: "square", dur: 0.012, g: 0.04, gap: 0.022 },
  error:  { notes: [220, 220], type: "square", dur: 0.12, g: 0.06, gap: 0.16 },
};
function rlAC() { return (window._rlAC ??= new (window.AudioContext || window.webkitAudioContext)()); }
function rlSfx(kind = "glass", ctx = null) {
  try {
    ctx ??= rlAC();
    if (ctx.state === "suspended") ctx.resume();
    const P = RL_SFX[kind]; if (!P) return;
    const t0 = ctx.currentTime;
    if (P.noise) { // 噪声 + 低通扫频（转场嗖声）
      const len = Math.ceil(ctx.sampleRate * P.dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = "lowpass";
      flt.frequency.setValueAtTime(P.sweepFilter[0], t0);
      flt.frequency.exponentialRampToValueAtTime(P.sweepFilter[1], t0 + P.dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(P.g, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + P.dur);
      src.connect(flt).connect(g).connect(ctx.destination); src.start(t0); src.stop(t0 + P.dur);
      return;
    }
    const play = (f, t) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = P.type; o.frequency.setValueAtTime(f, t);
      if (P.sweep) o.frequency.exponentialRampToValueAtTime(P.sweep[1], t + P.dur);
      else if (P.drop) o.frequency.exponentialRampToValueAtTime(f * P.drop, t + P.dur * 4);
      const stopAt = P.sweep ? P.dur : P.dur * 4;   // 扫频随包络收尾，不长鸣
      g.gain.setValueAtTime(P.g, t);
      g.gain.setValueAtTime(P.g, t + P.dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + stopAt);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + stopAt + 0.02);
    };
    if (P.notes) P.notes.forEach((f, i) => play(f, t0 + i * (P.gap ?? 0)));
    else play(P.sweep ? P.sweep[0] : P.f, t0);   // sweep 型从起始频率起振
  } catch (e) { /* 无音频环境时静默降级 */ }
}
/* 悬停音限流（>=70ms 一次） */
let _lastGlass = 0;
function rlSfxGlass() { const n = performance.now(); if (n - _lastGlass > 70) { _lastGlass = n; rlSfx("glass"); } }

/* ── 3D 档案卡阵列：悬停抬起 + 选中波浪扩散 + 音效 ── */
function rlArchiveCards(container) {
  const cards = [...container.querySelectorAll(".rl-card")];
  cards.forEach((card, idx) => {
    card.addEventListener("mouseenter", () => { card.classList.add("hover"); rlSfx("glass"); });
    card.addEventListener("mouseleave", () => card.classList.remove("hover"));
    card.addEventListener("click", () => {
      rlSfx("ui");
      const sel = container.querySelector(".rl-card.selected");
      if (sel && sel !== card) { sel.classList.remove("selected"); rlSfx("thump"); }
      card.classList.add("selected");
      // 波浪：按索引距离给兄弟卡片设置幅度与延迟，重排后重播动画
      cards.forEach((c, j) => {
        if (c === card) return;
        const d = Math.abs(j - idx);
        c.style.setProperty("--wave", `${Math.max(0, 10 - d * 2.5)}px`);
        c.style.setProperty("--wave-delay", `${d * 90}ms`);
        c.classList.remove("waving");
        void c.offsetWidth; // 强制重排以重播同名动画
        c.classList.add("waving");
      });
    });
  });
}

/* ── 滚动数字时钟：时/分/秒独立更新，变化的段播放 tick 动画 ── */
function rlClock(el) {
  const seg = {};
  ["h", "m", "s"].forEach((k) => (seg[k] = el.querySelector(`.seg-${k}`)));
  const pad = (n) => String(n).padStart(2, "0");
  const set = (k, v) => {
    if (seg[k].textContent !== v) {
      seg[k].textContent = v;
      seg[k].classList.remove("tick");
      void seg[k].offsetWidth;
      seg[k].classList.add("tick");
    }
  };
  const loop = () => {
    const d = new Date();
    set("h", pad(d.getHours())); set("m", pad(d.getMinutes())); set("s", pad(d.getSeconds()));
  };
  loop();
  setInterval(loop, 1000);
}

/* ── 故障撕裂转场（点击触发 0.35s） ── */
function rlGlitch(el, btn) {
  btn?.addEventListener("click", () => {
    rlSfx("ui");
    el.classList.remove("glitching");
    void el.offsetWidth;
    el.classList.add("glitching");
  });
}

/* ── 解密动画开关：对角线合拢 → 遮挡条退开 → 磨砂变清晰 ── */
function rlDecrypt(el) {
  el.addEventListener("click", () => {
    const open = el.classList.toggle("open");
    rlSfx(open ? "ui" : "thump");
  });
}

/* ══════════ 终端登录开场（boot sequence） ══════════ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function rlBoot(overlay) {
  if (overlay.dataset.running) return;
  overlay.dataset.running = "1";
  // 减少动态效果偏好：直接跳过开场
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    overlay.classList.add("off");
    delete overlay.dataset.running;
    return;
  }
  overlay.classList.remove("off", "scanning", "flashing");
  const lines = [...overlay.querySelectorAll(".b-line")];
  const ring = overlay.querySelector(".b-ring-wrap");
  const welcome = overlay.querySelector(".b-welcome");
  lines.forEach((l) => l.classList.remove("show"));
  ring?.classList.remove("show");
  welcome?.classList.remove("show");
  let skipped = false;
  const skipBtn = overlay.querySelector(".b-skip");
  if (skipBtn) skipBtn.onclick = () => { skipped = true; };
  const wait = async (ms) => { await sleep(ms); if (skipped) throw "skip"; };

  try {
    await wait(300);
    for (const line of lines) {           // 三行错峰逐字输入 + 打字音
      line.classList.add("show");
      const text = line.dataset.text || line.textContent;
      line.dataset.text = text; line.textContent = "";
      for (const ch of text) {
        line.textContent += ch;
        if (ch !== " ") rlSfx("type");
        await wait(16 + Math.random() * 24);
      }
      await wait(110);
    }
    await wait(180);
    if (ring) ring.classList.add("show"); // 权限环扫描 + 扫频音
    overlay.classList.add("scanning");
    rlSfx("scan");
    await wait(1250);
    const okLine = lines[lines.length - 1];
    okLine.textContent = okLine.dataset.text;
    okLine.classList.add("ok");
    rlSfx("beep"); rlSfx("chime");        // 授权成功
    await wait(420);
    if (welcome) welcome.classList.add("show"); // 欢迎页
    rlSfx("whoosh");
    await wait(1100);
    overlay.classList.add("flashing");    // 白场闪切
    await wait(320);
  } catch (e) { /* 用户跳过 */ }
  finally {
    overlay.classList.add("off");         // 任何路径都保证关闭遮罩
    delete overlay.dataset.running;
  }
}

/* ══════════ 3D 档案阵列 v2（Three.js：圆角玻璃卡 + Canvas 标签 + 详情面板 + 波浪 + 呼吸） ══════════ */
const RL_ARCHIVE_DATA = (() => {
  const cats = [
    ["OA", "ORIGINIUM ARTS", "源石技艺部", ["源石技艺应用总纲", "术式回路兼容性", "法阵稳定性观测", "源石增益迭代实验", "共振阈值测定", "抗干扰场测试", "载体技艺评估", "边缘术式归档"]],
    ["BT", "BIOTECH", "生命科学部", ["细胞活性培养报告", "源石病病理切片", "免疫应答观测", "基因图谱比对", "药剂配比修订", "临床前试验纪要", "组织再生评估", "样本库巡检记录"]],
    ["DF", "DEFENSE", "防御工程部", ["复合装甲应力测试", "护盾发生器标定", "封锁协议演练", "结构件疲劳分析", "边境哨站布局", "紧急制动方案", "拦截弹道记录", "冗余系统检验"]],
    ["EN", "ENERGY", "能源转化部", ["源石供能效率", "储能单元循环", "电网负载调度", "热力学损耗审计", "反应堆压力曲线", "耦合输电实验", "应急电源演练", "转换矩阵校准"]],
    ["LG", "LOGISTICS", "后勤中枢", ["物资流转清单", "仓储温湿度台账", "运输路线优化", "耗材寿命统计", "排班与权限表", "设备巡检日志", "废弃物处理规程", "跨部门调拨单"]],
  ];
  const bodies = [
    "本档案收录第七次修订后的全部观测数据。实验序列在受控条件下重复 12 次，波动幅度稳定在允许区间内；原始记录已按 IV 级保密协议归档，查阅需两名主任级授权会签。",
    "核心结论：当前迭代方案较上一版本效率提升约 8.3%，但长期稳定性仍待验证。建议在下一年度预算周期内追加三组对照实验，并同步更新风险评估模型。",
    "本页为公共可读摘要。完整数据表、影像资料与附属实验体名单存于独立分区；未授权访问将触发 SECTOR LOCKDOWN 并记录操作者身份。",
    "历次修订摘要：R1 初版建立基线；R3 引入双盲复核；R5 修正采样偏差并撤回两项结论；R7 当前版本——补充低温工况数据，撤销 R5 中一项保留意见。",
  ];
  let n = 0; const list = [];
  cats.forEach(([code, cat, cn, titles]) => titles.forEach((title) => {
    n += 1;
    list.push({ no: "X-" + String(n).padStart(3, "0"), code, cat, cn, title, level: 2 + (n % 3), rev: 1 + (n % 7), body: bodies[n % bodies.length] });
  }));
  return list;
})();

async function rlLoadTHREE() {
  const urls = ["three",
    "https://unpkg.com/three@0.160.0/build/three.module.js",
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"];
  for (const u of urls) { try { return await import(u); } catch (e) {} }
  return null;
}

async function rlScene3D(container) {
  if (container.dataset.built) return;
  container.dataset.built = "1";
  const THREE = await rlLoadTHREE();
  if (!THREE) { container.innerHTML += '<div class="s-fail">WEBGL MODULE UNAVAILABLE — CHECK NETWORK</div>'; return; }

  const W = () => container.clientWidth, H = () => container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2.5, window.devicePixelRatio));
  renderer.setSize(W(), H());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe7e5e1);
  scene.fog = new THREE.Fog(0xe7e5e1, 22, 54);

  // 环境反射：canvas 渐变 → PMREM（不依赖 examples addons）
  try {
    const ec = document.createElement("canvas"); ec.width = 16; ec.height = 256;
    const ex = ec.getContext("2d");
    const eg = ex.createLinearGradient(0, 0, 0, 256);
    eg.addColorStop(0, "#ffffff"); eg.addColorStop(0.55, "#e7e5e1"); eg.addColorStop(1, "#b3b0ab");
    ex.fillStyle = eg; ex.fillRect(0, 0, 16, 256);
    const etex = new THREE.CanvasTexture(ec); etex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(etex).texture;
  } catch (e) {}

  const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.5, 140);

  // 灯光（RhineLabUI DESIGN.md 基准）+ 柔影
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(new THREE.HemisphereLight(0xfff6ec, 0xc9c6c0, 0.45));
  const key = new THREE.DirectionalLight(0xfff2e0, 1.6);
  key.position.set(-9, 16, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 70 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);

  // 地面（接收柔影）
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 44), new THREE.ShadowMaterial({ opacity: 0.1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -14.4;
  ground.receiveShadow = true;
  scene.add(ground);

  // 尘埃粒子（氛围）
  {
    const N = 220, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (hash(i) - 0.5) * 32;
      pos[i * 3 + 1] = (hash(i + 99) - 0.5) * 28;
      pos[i * 3 + 2] = (hash(i + 197) - 0.5) * 22;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x8b8882, size: 0.07, transparent: true, opacity: 0.4, depthWrite: false }));
    scene.add(dust);
    scene.userData.dust = dust;
  }

  // ── 几何与贴图 ──
  const rounded = (w, h, r) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2); s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0);
    s.lineTo(w / 2, h / 2 - r); s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2);
    s.lineTo(-w / 2 + r, h / 2); s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI);
    s.lineTo(-w / 2, -h / 2 + r); s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5);
    return s;
  };
  const coverGeo = new THREE.ExtrudeGeometry(rounded(4.5, 3.1, 0.28), { depth: 0.2, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3, curveSegments: 14 });
  coverGeo.center();
  const frameShape = rounded(4.78, 3.38, 0.32);
  frameShape.holes.push(rounded(4.42, 3.02, 0.24));
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 0.14, bevelEnabled: false, curveSegments: 14 });
  frameGeo.center();
  const coreGeo = new THREE.BoxGeometry(4.1, 2.7, 0.16);
  const tabGeo = new THREE.BoxGeometry(0.72, 0.2, 0.3);

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.5, metalness: 0.15 });
  const coreSide = new THREE.MeshStandardMaterial({ color: 0x1a1c1e, roughness: 0.65 });
  const tabMat = new THREE.MeshStandardMaterial({ color: 0xff7b00, roughness: 0.35 });

  // Canvas 标签贴图：编号 / 类别 / 双语标题 / 条码 / ∞ 落款
  const makeLabel = (m) => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 352;
    const x = c.getContext("2d");
    x.fillStyle = "#f6f5f2"; x.fillRect(0, 0, 512, 352);
    x.strokeStyle = "#c9c6c0"; x.lineWidth = 3; x.strokeRect(6, 6, 500, 340);
    x.textBaseline = "middle";
    x.fillStyle = "#101112"; x.fillRect(24, 24, 12 + m.code.length * 13, 34);
    x.fillStyle = "#f2f0eb"; x.font = "600 19px Consolas, monospace"; x.textAlign = "left";
    x.fillText(m.code, 34, 42);
    x.fillStyle = "#8b8882"; x.font = "600 15px Consolas, monospace";
    x.fillText(m.cat, 24 + 12 + m.code.length * 13 + 14, 42);
    x.fillStyle = "#ff7b00"; x.font = "700 52px Consolas, monospace";
    x.fillText(m.no, 24, 106);
    x.fillStyle = "#111214"; x.font = "700 33px 'Microsoft YaHei', 'PingFang SC', sans-serif";
    x.fillText(m.title, 24, 168);
    x.fillStyle = "#8b8882"; x.font = "600 17px Consolas, monospace";
    x.fillText(m.cn + " / REV." + m.rev, 24, 208);
    x.fillStyle = "#111214";
    let bx = 24, bi = 0;
    while (bx < 300) { const w2 = 2 + Math.floor(hash(bi) * 5); if (hash(bi + 50) > 0.35) x.fillRect(bx, 248, w2, 46); bx += w2 + 3 + Math.floor(hash(bi + 99) * 5); bi++; }
    x.fillStyle = "#8b8882"; x.font = "600 15px Consolas, monospace";
    x.fillText("CLEARANCE LV." + m.level, 316, 262);
    x.strokeStyle = "#111214"; x.lineWidth = 6;
    x.beginPath(); x.arc(394, 306, 15, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(426, 306, 15, 0, Math.PI * 2); x.stroke();
    x.fillStyle = "#8b8882"; x.font = "700 14px Consolas, monospace";
    x.fillText("RHINE-LAB", 24, 316);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return tex;
  };
  const colSprite = (txt) => {
    const c = document.createElement("canvas"); c.width = 128; c.height = 64;
    const x = c.getContext("2d");
    x.fillStyle = "#101112"; x.fillRect(0, 0, 128, 64);
    x.fillStyle = "#f2f0eb"; x.font = "700 30px Consolas, monospace";
    x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 64, 34);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0.85 }));
    sp.scale.set(1.7, 0.85, 1);
    return sp;
  };

  // ── 40 份档案：5 列科室 × 8 行 ──
  const COLS = 5, ROWS = 8, GAPX = 5.2, GAPY = 3.55;
  const cards = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const m = RL_ARCHIVE_DATA[c * ROWS + r];
    const g = new THREE.Group();
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xf4f2ee, roughness: 0.42, metalness: 0, transmission: 0.82, thickness: 0.4, ior: 1.4 });
    const cover = new THREE.Mesh(coverGeo, glass); cover.position.z = 0.24; cover.castShadow = true;
    const frame = new THREE.Mesh(frameGeo, frameMat); frame.castShadow = true;
    const coreMats = [coreSide, coreSide, coreSide, coreSide, new THREE.MeshStandardMaterial({ map: makeLabel(m), roughness: 0.7 }), coreSide];
    const core = new THREE.Mesh(coreGeo, coreMats); core.position.z = -0.05;
    const tab = new THREE.Mesh(tabGeo, tabMat); tab.position.set(1.5, 1.56, 0.12);
    g.add(frame, core, cover, tab);
    g.position.set((c - (COLS - 1) / 2) * GAPX, (r - (ROWS - 1) / 2) * GAPY, 0);
    g.userData = { m, c, r, y: 0, vy: 0, z: 0, hover: 0, yaw: 0, phase: hash2(c, r) * Math.PI * 2, base: g.position.y, selected: false, glass };
    scene.add(g); cards.push(g);
  }
  for (let c = 0; c < COLS; c++) {
    const sp = colSprite(RL_ARCHIVE_DATA[c * ROWS].code);
    sp.position.set((c - (COLS - 1) / 2) * GAPX, (ROWS / 2) * GAPY + 1.7, 0);
    scene.add(sp);
  }

  // ── 轨道相机 + 详情面板 + 交互 ──
  const cam = { theta: 0.5, phi: 1.24, r: 17, vTheta: 0, vPhi: 0, rT: 17 };
  const focus = new THREE.Vector3(0, 0, 0), focusT = new THREE.Vector3(0, 0, 0);
  let dragging = false, px = 0, py = 0, mouseNDC = null, hovered = null, selected = null;
  let lastTouch = performance.now();

  const detail = container.querySelector(".s-detail");
  const hudSel = container.querySelector(".s-hud .sel");
  const deselect = () => {
    if (!selected) return;
    selected.userData.selected = false; selected = null;
    focusT.set(0, 0, 0); cam.rT = 17;
    if (hudSel) hudSel.textContent = "";
    if (detail) detail.classList.remove("on");
  };
  const openDetail = (g) => {
    if (!detail) return;
    const m = g.userData.m;
    detail.querySelector(".d-no").textContent = m.no;
    detail.querySelector(".d-cat").textContent = m.cat + " / " + m.cn;
    const t = detail.querySelector("h3");
    t.dataset.text = m.title;
    rlScramble(t, { duration: 550 });
    detail.querySelector(".d-rev").textContent = "REV." + m.rev + " / 2026";
    detail.querySelector(".d-idx").textContent = (cards.indexOf(g) + 1) + " / 40";
    detail.querySelector(".d-lv").textContent = "LEVEL " + m.level;
    detail.querySelector(".d-body").textContent = m.body;
    detail.classList.add("on");
  };
  detail?.querySelector(".d-close")?.addEventListener("click", () => { deselect(); rlSfx("thump"); });
  detail?.querySelector(".d-access")?.addEventListener("click", () => rlSfx("whoosh"));

  const toSpherical = () => {
    camera.position.set(
      focus.x + cam.r * Math.sin(cam.phi) * Math.sin(cam.theta),
      focus.y + cam.r * Math.cos(cam.phi),
      focus.z + cam.r * Math.sin(cam.phi) * Math.cos(cam.theta)
    );
    camera.lookAt(focus);
  };
  toSpherical();

  container.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; lastTouch = performance.now(); try { container.setPointerCapture(e.pointerId); } catch (err) {} });
  container.addEventListener("pointerup", (e) => {
    dragging = false;
    if (Math.hypot(e.clientX - px, e.clientY - py) >= 6) return; // 拖拽不是点击
    if (hovered) {
      if (selected === hovered) { openDetail(hovered); rlSfx("ui"); }
      else {
        deselect();
        selected = hovered;
        const s = selected.userData;
        s.selected = true; s.vy += 2.4;
        rlSfx("ui");
        if (hudSel) hudSel.textContent = "SELECT " + s.m.no;
        focusT.set(selected.position.x * 0.45, selected.position.y * 0.45, 0);
        cam.rT = 14;
        cards.forEach((c2) => {              // 波浪按网格距离传导（阻尼 4.2 冲击）
          if (c2 === selected) return;
          const d = Math.abs(c2.userData.c - s.c) + Math.abs(c2.userData.r - s.r);
          setTimeout(() => { c2.userData.vy += 1.5 / (1 + d * 0.7); }, d * 80);
        });
      }
    } else deselect();
  });
  container.addEventListener("pointermove", (e) => {
    const rect = container.getBoundingClientRect();
    mouseNDC = { x: ((e.clientX - rect.left) / rect.width) * 2 - 1, y: -((e.clientY - rect.top) / rect.height) * 2 + 1 };
    lastTouch = performance.now();
    if (dragging) {
      cam.vTheta -= (e.clientX - px) * 0.0035;
      cam.vPhi += (e.clientY - py) * 0.0028;
      px = e.clientX; py = e.clientY;
    }
  });
  container.addEventListener("pointerleave", () => { mouseNDC = null; });
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    lastTouch = performance.now();
    cam.rT = Math.min(30, Math.max(9, cam.rT + e.deltaY * 0.01));
  }, { passive: false });
  container.addEventListener("dblclick", () => {            // 双击复位视角
    deselect(); cam.theta = 0.5; cam.phi = 1.24; cam.vTheta = 0; cam.vPhi = 0;
    cam.rT = 17; rlSfx("ui");
  });

  const ray = new THREE.Raycaster();
  let last = performance.now(), t = 0;
  (function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; t += dt;

    if (!dragging) { cam.vTheta *= 0.92; cam.vPhi *= 0.92; }
    if (!dragging && now - lastTouch > 5000) cam.theta += dt * 0.06;   // 闲置 5s 慢速环绕
    cam.theta += cam.vTheta * dt;
    cam.phi = Math.min(1.45, Math.max(0.35, cam.phi + cam.vPhi * dt));
    cam.r += (cam.rT - cam.r) * Math.min(1, dt * 5);
    focus.lerp(focusT, Math.min(1, dt * 4));
    toSpherical();

    if (mouseNDC && !dragging) {
      ray.setFromCamera(mouseNDC, camera);
      const hit = ray.intersectObjects(cards, true)[0];
      let obj = hit ? hit.object : null;
      while (obj && obj.userData.base === undefined) obj = obj.parent;
      if (obj !== hovered) {
        hovered = obj && obj.userData.base !== undefined ? obj : null;
        if (hovered) rlSfxGlass();
        container.style.cursor = hovered ? "pointer" : "grab";
      }
    }

    const w = 14;
    for (const g of cards) {
      const s = g.userData;
      const hoverT = (hovered === g && !s.selected) ? 0.3 : 0;
      s.hover += (hoverT - s.hover) * Math.min(1, dt * 10);
      const target = s.selected ? 0.9 : 0;
      s.vy += ((target - s.y) * w * w - 2 * w * s.vy) * dt;   // 临界阻尼弹簧（ω=14）
      s.y += s.vy * dt;
      const breathe = Math.sin(t * Math.PI * 2 / 8 + s.phase) * 0.05 + Math.sin(t * Math.PI * 2 / 13 + s.phase * 1.7) * 0.04;
      g.position.y = s.base + s.y + s.hover + breathe;
      const zT = s.selected ? 3.1 : (hovered === g ? 0.35 : 0);   // 抽出阵列而非上顶（避免穿模）
      s.z += (zT - s.z) * Math.min(1, dt * 5);
      g.position.z = s.z;
      const yawT = s.selected ? Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z) : 0;
      s.yaw += (yawT - s.yaw) * Math.min(1, dt * 4);           // 选中卡转向镜头（"先转正"）
      g.rotation.y = s.yaw;
      s.glass.roughness += ((s.selected ? 0.06 : 0.42) - s.glass.roughness) * Math.min(1, dt * 4); // 磨砂⇄清晰
    }
    if (scene.userData.dust) scene.userData.dust.rotation.y = t * 0.01;

    renderer.render(scene, camera);
  })(performance.now());

  new ResizeObserver(() => {
    camera.aspect = W() / H(); camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  }).observe(container);
}

/* ── 终端日志：定时追加 + 打字音 + 自动滚底 ── */
function rlTerminal(el) {
  const LINES = [
    ["SYNC delta archive index — 0.42s", ""],
    ["LOAD texture atlas [12/12] — ok", "ok"],
    ["WARN thermal margin narrowing — 3.1C", "hot"],
    ["DECODE segment R7 -> checksum pass", "ok"],
    ["SCAN node 12 latency — 41ms", ""],
    ["AUTH token refreshed [0x7F]", ""],
    ["TRACE route rerouted via RELAY-04", ""],
    ["ARCHIVE X-{0} touched by operator", ""],
    ["PURGE temp cache — 128 MiB freed", "ok"],
    ["CALIB optical bench — drift 0.0004", ""],
  ];
  let i = 0, visible = false;
  new IntersectionObserver((es) => es.forEach((e) => {
    visible = e.isIntersecting;
    if (visible && el.children.length === 0) { tick(); tick(); }  // 首次可见立即补两行
  }), { threshold: 0.15 }).observe(el);
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    if (!visible) return;                       // 不在看板时不刷新
    const [txt, cls] = LINES[i % LINES.length];
    i++;
    const d = new Date();
    const ln = document.createElement("div");
    ln.className = "ln " + cls;
    ln.innerHTML = '<span class="tm">' + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "</span>" +
      txt.replace("{0}", String(1 + Math.floor(hash(i) * 40)).padStart(3, "0"));
    el.appendChild(ln);
    while (el.children.length > 9) el.removeChild(el.firstChild);
    el.scrollTop = el.scrollHeight;
    rlSfx("type");
  };
  setInterval(tick, 1200);
}

/* ── 检索：过滤卡片 + 计数回显 + 终端式块状光标 ── */
function rlSearch(input, cardsEl, cntEl) {
  const cards = [...cardsEl.querySelectorAll(".rl-card")];
  input.addEventListener("input", () => {
    rlSfx("type");
    const q = input.value.trim().toLowerCase();
    let n = 0;
    cards.forEach((c) => {
      const hit = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = hit ? "" : "none";
      if (hit) n++;
    });
    if (cntEl) cntEl.textContent = String(n).padStart(2, "0") + " / " + cards.length;
  });
  // 终端式闪烁小方块光标：镜像 span 测量文本宽度（等宽字体，精确）
  const bar = input.parentElement;
  const caret = document.createElement("i");
  caret.className = "search-caret";
  bar.appendChild(caret);
  const mirror = document.createElement("span");
  const cs = getComputedStyle(input);
  Object.assign(mirror.style, { position: "absolute", visibility: "hidden", whiteSpace: "pre",
    fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing });
  document.body.appendChild(mirror);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;
  const padB = parseFloat(cs.paddingBottom) || 0;
  const update = () => {
    const on = document.activeElement === input;
    caret.style.display = on ? "block" : "none";
    if (!on) return;
    mirror.textContent = input.value.slice(0, input.selectionStart ?? input.value.length);
    const lineH = input.clientHeight - padT - padB;
    const x = Math.min(mirror.getBoundingClientRect().width, input.clientWidth - padL - caret.offsetWidth - 2);
    caret.style.left = (input.offsetLeft + padL + x) + "px";
    caret.style.top = (input.offsetTop + padT) + "px";
    caret.style.height = lineH + "px";
  };
  ["input", "keyup", "click", "focus", "select"].forEach((ev) =>
    input.addEventListener(ev, () => requestAnimationFrame(update)));
  input.addEventListener("blur", update);
  update();
}

/* ── 音效馆：17 种合成音效试听 ── */
const RL_SFX_META = [
  ["glass", "GLASS", "玻璃轻碰 · 悬停卡片"],
  ["ui", "UI", "电子反馈 · 点击确认"],
  ["thump", "THUMP", "机械归位 · 退卡落定"],
  ["type", "TYPE", "逐字打字 · 输入流"],
  ["beep", "BEEP", "确认音 · 授权通过"],
  ["chime", "CHIME", "成功和弦 · 双音上扬"],
  ["alarm", "ALARM", "警告双音 · 封锁闪烁"],
  ["scan", "SCAN", "扫描扫频 · 权限环"],
  ["whoosh", "WHOOSH", "转场嗖声 · 白场闪切"],
  ["step", "STEP", "步进刻度 · 指示切换"],
  ["unlock", "UNLOCK", "解锁 · 上扬双音"],
  ["lock", "LOCK", "落锁 · 下沉双音"],
  ["power", "POWER", "系统上电 · 低频升压"],
  ["extract", "EXTRACT", "档案抽出 · 气流上扫"],
  ["insert", "INSERT", "档案归位 · 气流下扫"],
  ["glitch", "GLITCH", "数据故障 · 随机毛刺"],
  ["error", "ERROR", "拒绝访问 · 低鸣双振"],
];
function rlSfxLab(grid) {
  if (grid.dataset.built) return;
  grid.dataset.built = "1";
  RL_SFX_META.forEach(([key, en, cn]) => {
    const d = document.createElement("div");
    d.className = "sfx";
    d.dataset.sfx = key;
    d.innerHTML = "<b>" + en + "</b><span>" + cn + "</span><i>▸ PLAY</i>";
    d.addEventListener("click", () => {
      rlSfx(key);
      d.classList.remove("hit"); void d.offsetWidth; d.classList.add("hit");
    });
    grid.appendChild(d);
  });
  const all = document.querySelector("[data-sfx-all]");
  all?.addEventListener("click", () => {
    rlSfx("power");
    const cards = [...grid.querySelectorAll(".sfx")];
    cards.forEach((c, i) => setTimeout(() => {
      c.classList.remove("hit"); void c.offsetWidth; c.classList.add("hit");
      rlSfx(c.dataset.sfx);
      if (i === cards.length - 1) setTimeout(() => rlSfx("chime"), 500);
    }, i * 520));
  });
}

/* ── 自动巡演 v2：不与用户抢滚动 ──
   闲置 15s 启动（角标有倒计时预告）；每页 10s；
   空格/↓ 下一页、↑ 上一页、Esc 暂停；
   巡演中任何点击/滚轮/触摸 → 立即暂停，滚轮始终自由滚动 */
function rlTour() {
  const pages = [...document.querySelectorAll(".page > section[id], .page > .mark-wrap")];
  if (pages.length < 2 || window._rlTour) return;
  window._rlTour = true;
  let idx = 0, playing = false, timer = null, idleTimer = null, idleTick = null, idleLeft = 0;

  const badge = document.createElement("div");
  badge.className = "tour-badge";
  badge.title = "点击暂停/继续 · Esc 暂停 · 空格/↓ 下一页";
  badge.innerHTML = "<b>▶ TOUR</b><span></span>";
  document.body.appendChild(badge);
  const label = badge.querySelector("span");

  const show = () => {
    if (playing) label.textContent = String(idx + 1).padStart(2, "0") + " / " + pages.length + " · 10s";
    else if (idleLeft > 0) label.textContent = "IDLE " + idleLeft + "s → TOUR";
    else label.textContent = String(idx + 1).padStart(2, "0") + " / " + pages.length + " · PAUSED";
    badge.classList.toggle("paused", !playing);
  };
  const go = (i) => {
    idx = ((i % pages.length) + pages.length) % pages.length;
    pages[idx].scrollIntoView({ behavior: "smooth", block: "start" });
    show();
  };
  const startTimer = () => { clearInterval(timer); if (playing) timer = setInterval(() => go(idx + 1), 10000); };
  const play = (on) => { playing = on; startTimer(); show(); };
  const next = () => { go(idx + 1); };   // 手动翻页不自动重启巡演
  const pause = () => play(false);

  const stopIdle = () => { clearTimeout(idleTimer); clearInterval(idleTick); idleLeft = 0; };
  const armIdle = () => {
    if (playing) return;
    stopIdle();
    idleLeft = 15;
    show();
    idleTick = setInterval(() => {
      idleLeft--;
      if (idleLeft <= 0) { stopIdle(); go(0); play(true); rlSfx("power"); }
      else show();
    }, 1000);
  };
  // 巡演中：点击/滚轮/触摸 = 用户接管，立即暂停（滚轮始终自由滚动）
  ["pointerdown", "wheel", "touchstart"].forEach((ev) =>
    document.addEventListener(ev, () => { if (playing) pause(); armIdle(); }, { passive: true }));
  // 鼠标移动只重置空闲倒计时，不打断巡演
  document.addEventListener("pointermove", armIdle, { passive: true });

  window.addEventListener("keydown", (e) => {
    const paging = e.code === "Space" || e.code === "ArrowDown" || e.code === "ArrowUp";
    if (e.target.closest("input,textarea")) {
      if (playing) pause();          // 输入框打字 = 接管，暂停巡演
      armIdle();                     // ★ 打键也重置空闲倒计时（0.12.1 丢失的监听）
      return;
    }
    if (paging) {
      e.preventDefault();
      go(e.code === "ArrowUp" ? idx - 1 : idx + 1);
      if (playing) startTimer();     // 巡演中翻页 → 重置 10s 计时并继续；暂停中则保持暂停
      armIdle();
      return;
    }
    if (e.code === "Escape") { play(false); armIdle(); return; }
    if (playing) pause();
    armIdle();
  });
  badge.addEventListener("pointerdown", (e) => e.stopPropagation());  // 防止文档层抢先 pause 破坏 toggle
badge.addEventListener("click", () => { play(!playing); rlSfx(playing ? "ui" : "thump"); });

  armIdle();
}

/* ── 色板音阶：色块按序播放对应音高 ── */
function rlNote(freq) {
  try {
    const ctx = rlAC(); if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.4);
  } catch (e) {}
}
function rlPalette(el) {
  [...el.querySelectorAll(".sw")].forEach((sw, i) => {
    sw.addEventListener("click", () => rlNote(320 * Math.pow(2, i / 12)));
    sw.addEventListener("mouseenter", () => rlSfx("step"));
  });
}
/* ── 雷达：扫掠自动触发——扫线每扫过目标点一次，播放一声 BEEP 并闪亮目标 ── */
function rlRadar(el) {
  if (el.dataset.radarOn) return;
  el.dataset.radarOn = "1";
  const sweep = el.querySelector(".sweep");
  const blip = el.querySelector(".blip");
  const PERIOD = 3600;                 // ms/圈（与 CSS 3.6s 同步）
  const BLIP_ANGLE = 19;               // 目标点方位角：顶部顺时针约 19°
  let visible = false, prev = null;
  new IntersectionObserver((es) => es.forEach((e) => (visible = e.isIntersecting)), { threshold: 0.2 }).observe(el);
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) { prev = null; return; }
    const ang = ((now % PERIOD) / PERIOD) * 360;
    if (sweep) sweep.style.transform = "rotate(" + ang + "deg)";
    const crossed = prev !== null && (
      (prev < BLIP_ANGLE && ang >= BLIP_ANGLE) ||
      (ang < prev && (BLIP_ANGLE <= ang || BLIP_ANGLE > prev)));
    if (crossed) {
      rlSfx("beep");
      if (blip) { blip.classList.remove("ping"); void blip.offsetWidth; blip.classList.add("ping"); }
    }
    prev = ang;
  })(performance.now());
}

/* ── 页面编排：进入视口时触发 ── */
/* ── 页面编排：进入视口时触发 ── */
/* ── 页面编排：进入视口时触发 ── */
/* ── 页面编排：进入视口时触发 ── */
/* ── 页面编排：进入视口时触发 ── */
/* ── 页面编排：进入视口时触发 ── */
function rlActivate() {
  if (window._rlActive) return; // 防重复初始化
  window._rlActive = 1;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = "1";
      const el = e.target;
      if (el.hasAttribute("data-scramble")) rlScramble(el);
      if (el.hasAttribute("data-type")) rlType(el);
      if (el.hasAttribute("data-cjk")) rlCjkReveal(el);
      if (el.hasAttribute("data-odometer")) rlOdometer(el, { to: +el.dataset.odometer });
      if (el.hasAttribute("data-warning")) { el.classList.add("on"); rlSfx("alarm"); }
      if (el.hasAttribute("data-bar")) el.classList.add("on");
      if (el.hasAttribute("data-mark")) rlMark(el);
      if (el.hasAttribute("data-rows")) rlStagger([...el.querySelectorAll(".row")]);
      if (el.hasAttribute("data-cards")) rlArchiveCards(el);
      if (el.hasAttribute("data-clock")) rlClock(el);
      if (el.hasAttribute("data-decrypt")) rlDecrypt(el);
      if (el.hasAttribute("data-glitch")) rlGlitch(el, document.querySelector(el.dataset.glitch ? el.dataset.glitch : "#glitch-btn") || null);
      if (el.hasAttribute("data-scene3d")) rlScene3D(el);
      if (el.hasAttribute("data-terminal")) rlTerminal(el);
      if (el.hasAttribute("data-search")) rlSearch(el, document.querySelector(el.dataset.target), document.querySelector(el.dataset.count));
      if (el.hasAttribute("data-sfx-lab")) rlSfxLab(el);
      if (el.hasAttribute("data-palette")) rlPalette(el);
      if (el.hasAttribute("data-radar")) rlRadar(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("[data-scramble],[data-type],[data-cjk],[data-odometer],[data-warning],[data-bar],[data-mark],[data-rows],[data-cards],[data-clock],[data-decrypt],[data-glitch],[data-scene3d],[data-terminal],[data-search],[data-sfx-lab],[data-palette],[data-radar]")
    .forEach((el) => io.observe(el));
  // 所有 .rl-btn 附加电子反馈音
  document.querySelectorAll(".rl-btn").forEach((b) => {
    if (b.id === "glitch-btn") return;
    b.addEventListener("click", () => rlSfx("ui"));
  });
  rlTour();
  // 音频解锁：浏览器要求首次用户手势后才能出声
  document.addEventListener("pointerdown", () => { try { rlAC().resume(); } catch (e) {} }, { once: true });
  // 终端登录开场：载入即播；REPLAY BOOT 按钮重播
  const boot = document.querySelector(".boot[data-boot]");
  if (boot) {
    // 兜底 1：无论发生什么，12s 后强制放行（重播时 running 标记保护）
    setTimeout(() => {
      if (!boot.classList.contains("off") && !boot.dataset.running) boot.classList.add("off");
    }, 12000);
    const start = () => setTimeout(() => rlBoot(boot).catch(() => boot.classList.add("off")), 250);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
    document.querySelector("#boot-replay")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      rlBoot(boot);
    });
    window.rlBoot = () => rlBoot(boot); // 控制台可手动重播
  }
}
document.addEventListener("DOMContentLoaded", rlActivate);
if (document.readyState !== "loading") rlActivate(); // 脚本晚于 DOMContentLoaded 加载时兜底
