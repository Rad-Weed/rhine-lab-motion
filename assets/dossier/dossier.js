/* ══════════════════════════════════════════════════════════════════
   RHINE LAB — ARCHIVE DOSSIER / 运行时
   v0.14.0 · 音频总线 / 网点制版 / 拆封 / 入场 / 版式工具
   ══════════════════════════════════════════════════════════════════ */

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const EASE = {
  outCubic: (t) => 1 - Math.pow(1 - clamp01(t), 3),
  outQuart: (t) => 1 - Math.pow(1 - clamp01(t), 4),
  outExpo: (t) => { t = clamp01(t); return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); },
};
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return x - Math.floor(x); }

/* ── 音频：主总线 + 21 种合成音效（含纸质物件） ───────────────── */
const RL_SFX = {
  glass:  { f: 3200, type: "sine",     dur: 0.02,  g: 0.22, drop: 0.6 },
  ui:     { f: 640,  type: "square",   dur: 0.045, g: 0.15, drop: 0.6 },
  thump:  { f: 190,  type: "sine",     dur: 0.05,  g: 0.32, drop: 0.6 },
  type:   { f: 2200, type: "square",   dur: 0.02,  g: 0.15, drop: 0.5 },
  beep:   { f: 1200, type: "sine",     dur: 0.06,  g: 0.20, drop: 0.9 },
  chime:  { notes: [659.25, 880], type: "sine", dur: 0.16, g: 0.18, gap: 0.09 },
  alarm:  { notes: [880, 660, 880, 660], type: "square", dur: 0.09, g: 0.13, gap: 0.1 },
  scan:   { sweep: [400, 1600], type: "sawtooth", dur: 1.1, g: 0.16 },
  whoosh: { noise: true, dur: 0.32, g: 0.16, sweepFilter: [3200, 260] },
  step:   { f: 1400, type: "triangle", dur: 0.012, g: 0.13, drop: 0.7 },
  unlock: { notes: [523.25, 783.99], type: "sine", dur: 0.13, g: 0.18, gap: 0.09 },
  lock:   { notes: [392, 246.94], type: "square", dur: 0.1, g: 0.14, gap: 0.11 },
  power:  { sweep: [120, 480], type: "sawtooth", dur: 0.5, g: 0.18 },
  extract:{ noise: true, dur: 0.28, g: 0.2, sweepFilter: [500, 3000] },
  insert: { noise: true, dur: 0.26, g: 0.18, sweepFilter: [2800, 300] },
  glitch: { notes: [820, 320, 1650, 520], type: "square", dur: 0.012, g: 0.10, gap: 0.022 },
  error:  { notes: [220, 220], type: "square", dur: 0.12, g: 0.16, gap: 0.16 },
  /* 纸质物件 */
  paper:  { noise: true, dur: 0.42, g: 0.20, sweepFilter: [2400, 900], hp: 480 },
  stamp:  { notes: [140, 96], type: "sine", dur: 0.07, g: 0.30, gap: 0.04 },
  scratch:{ noise: true, dur: 0.19, g: 0.16, sweepFilter: [3600, 1400], hp: 900 },
  tear:   { noise: true, dur: 0.5,  g: 0.20, sweepFilter: [5200, 700], hp: 1200 },
};

function rlAC() {
  if (!window._rlAC) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    const c = new Ctor();
    const master = c.createGain();
    master.gain.value = 1;
    master.connect(c.destination);
    window._rlMaster = master;
    window._rlAC = c;
  }
  return window._rlAC;
}

function sfx(kind = "ui") {
  if (performance.now() < (window._rlMuteUntil || 0)) return;
  try {
    const ctx = rlAC();
    if (ctx.state === "suspended") ctx.resume();
    const P = RL_SFX[kind]; if (!P) return;
    const t0 = ctx.currentTime;
    if (P.noise) {
      const len = Math.ceil(ctx.sampleRate * P.dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {          // 轻微平滑，避免纯白噪过刺
        last = (last * 0.35) + ((Math.random() * 2 - 1) * 0.65);
        d[i] = last;
      }
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = "lowpass";
      flt.frequency.setValueAtTime(P.sweepFilter[0], t0);
      flt.frequency.exponentialRampToValueAtTime(P.sweepFilter[1], t0 + P.dur);
      const chain = [src, flt];
      if (P.hp) {
        const hp = ctx.createBiquadFilter(); hp.type = "highpass";
        hp.frequency.value = P.hp; chain.push(hp);
      }
      const g = ctx.createGain();
      g.gain.setValueAtTime(P.g, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + P.dur);
      chain.forEach((n, i) => n.connect(chain[i + 1] || g));
      g.connect(window._rlMaster);
      src.start(t0); src.stop(t0 + P.dur);
      return;
    }
    const play = (f, t) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = P.type; o.frequency.setValueAtTime(f, t);
      if (P.sweep) o.frequency.exponentialRampToValueAtTime(P.sweep[1], t + P.dur);
      else if (P.drop) o.frequency.exponentialRampToValueAtTime(f * P.drop, t + P.dur * 4);
      const stopAt = P.sweep ? P.dur : P.dur * 4;
      g.gain.setValueAtTime(P.g, t);
      g.gain.setValueAtTime(P.g, t + P.dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + stopAt);
      o.connect(g).connect(window._rlMaster); o.start(t); o.stop(t + stopAt + 0.02);
    };
    if (P.notes) P.notes.forEach((f, i) => play(f, t0 + i * (P.gap ?? 0)));
    else play(P.sweep ? P.sweep[0] : P.f, t0);
  } catch (e) { /* 无音频环境静默降级 */ }
}
let _lastGlass = 0, _lastPaper = 0;
function hoverGlass() { const n = performance.now(); if (n - _lastGlass > 80) { _lastGlass = n; sfx("glass"); } }
function hoverPaper() { const n = performance.now(); if (n - _lastPaper > 220) { _lastPaper = n; sfx("paper"); } }

/* ── 乱码解码 ─────────────────────────────────────────────────── */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
function scramble(el, { duration = 760, tail = 3, tick = 32 } = {}) {
  if (!el) return;
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
      out += GLYPHS[Math.floor(hash(i + (el.dataset.seed | 0) * 31, t) * GLYPHS.length)];
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(frame);
    else el.textContent = target;
  };
  if (el._rlCancel) el._rlCancel();
  el._rlCancel = () => cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}

/* ── 读数（支持小数位） ───────────────────────────────────────── */
function ode(el, to, dec = 0, duration = 1500) {
  if (!el) return;
  const t0 = performance.now();
  const fmt = (n) => dec > 0
    ? n.toFixed(dec)
    : Math.floor(n).toLocaleString("en-US");
  let raf;
  const frame = (now) => {
    const p = clamp01((now - t0) / duration);
    el.textContent = fmt(to * EASE.outExpo(p));
    if (p < 1) raf = requestAnimationFrame(frame);
    else el.textContent = fmt(to);
  };
  if (el._odeCancel) el._odeCancel();
  el._odeCancel = () => cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}

/* ── 网点制版：密度采样 → 45° 单色网点 ────────────────────────── */
function makeSampler(variant, w, h) {
  if (variant === "figure") {
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const o = off.getContext("2d");
    o.fillStyle = "#000";
    const cx = w * 0.5, hy = h * 0.36, hr = Math.min(w, h) * 0.155;
    o.beginPath(); o.arc(cx, hy, hr, 0, Math.PI * 2); o.fill();          // 头
    o.fillRect(cx - hr * 0.34, hy + hr * 0.82, hr * 0.68, hr * 0.5);     // 颈
    o.beginPath();                                                       // 肩
    o.moveTo(cx - hr * 1.9, h);
    o.quadraticCurveTo(cx - hr * 1.5, hy + hr * 1.15, cx - hr * 0.5, hy + hr * 1.2);
    o.lineTo(cx + hr * 0.5, hy + hr * 1.2);
    o.quadraticCurveTo(cx + hr * 1.5, hy + hr * 1.15, cx + hr * 1.9, h);
    o.closePath(); o.fill();
    o.fillStyle = "rgba(0,0,0,0)";                                       // 面部高光（挖空）
    o.globalCompositeOperation = "destination-out";
    o.beginPath(); o.arc(cx - hr * 0.34, hy - hr * 0.1, hr * 0.52, 0, Math.PI * 2); o.fill();
    const data = o.getImageData(0, 0, w, h).data;
    return (x, y) => {
      const i = ((y | 0) * w + (x | 0)) * 4;
      return (data[i + 3] / 255) * 0.72;
    };
  }
  if (variant === "orbit") {
    return (x, y) => {
      const dx = x - w / 2, dy = y - h / 2;
      const r = Math.hypot(dx, dy) / Math.min(w, h);
      const band = Math.abs(Math.sin(r * 26)) * 0.72;
      const fall = Math.max(0, 1 - r * 1.5);
      return clamp01(band * fall + 0.02);
    };
  }
  if (variant === "wave") {
    return (x, y) => {
      const u = x / w, v = y / h;
      const amp = Math.sin(v * 7.2 + Math.sin(u * 3.4) * 1.35);
      const edge = Math.sin(u * Math.PI);
      return clamp01((0.18 + Math.abs(amp) * 0.62) * edge);
    };
  }
  return (x, y) => {                                                     // noise floor
    const v = hash((x | 0) * 0.37 + (y | 0) * 0.91);
    const grad = 1 - (y / h) * 0.55;
    return clamp01(v * 0.55 * grad + 0.06);
  };
}

function halftone(cv, { animate = true } = {}) {
  if (cv.dataset.drawn) return;
  const cell = parseFloat(cv.dataset.cell) || 4;
  const variant = cv.dataset.halftone || "noise";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rect = cv.getBoundingClientRect();
  if (rect.width < 60 || rect.height < 40) return;   // 尺寸未就绪：不锁定，等下次
  cv.dataset.drawn = "1";
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);
  const sample = makeSampler(variant, w, h);
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);

  const draw = (progress) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#efece2"; ctx.fillRect(0, 0, w, h);
    const lim = Math.max(0, Math.floor(rows * progress));
    for (let ry = 0; ry < lim; ry++) {
      for (let cx = 0; cx < cols; cx++) {
        const x = cx * cell + cell / 2, y = ry * cell + cell / 2;
        const d = sample(x, y);
        if (d <= 0.03) continue;
        const isAcc = hash(cx * 3.1 + ry * 5.7) > 0.994;
        const r = Math.min(cell * 0.63, Math.sqrt(d) * cell * (isAcc ? 0.34 : 0.63));
        const jx = (hash(cx * 13.7 + ry * 7.3) - 0.5) * 0.32;
        const jy = (hash(cx * 7.1 + ry * 11.3) - 0.5) * 0.32;
        ctx.beginPath(); ctx.arc(x + jx, y + jy, r, 0, Math.PI * 2);
        ctx.fillStyle = isAcc ? "#e9521c" : "#151513";
        ctx.fill();
      }
    }
  };

  if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(1); return; }
  const t0 = performance.now(), dur = 780;
  (function step(now) {
    const p = clamp01((now - t0) / dur);
    draw(EASE.outCubic(p));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ── 条码 ─────────────────────────────────────────────────────── */
function barcode(cv) {
  const code = cv.dataset.barcode || "RL-X000";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = cv.width, h = cv.height;
  cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#151513";
  let x = 4;
  for (let i = 0; i < code.length; i++) {
    const c = code.charCodeAt(i);
    for (let k = 0; k < 4; k++) {
      const bar = 1 + Math.floor(hash(c * 0.7 + k * 3.1 + i) * 4);
      if (hash(c + k * 1.7) > 0.32) ctx.fillRect(x, 0, bar, h);
      x += bar + 1 + Math.floor(hash(c * 1.3 + k) * 3);
    }
    x += 3;
    if (x > w - 8) break;
  }
}

/* ── 拆封 ─────────────────────────────────────────────────────── */
function unseal() {
  const ov = document.getElementById("unseal");
  if (!ov || ov.classList.contains("off")) return;
  const seal = document.getElementById("seal");
  try { rlAC().resume(); } catch (e) {}
  sfx("tear");
  setTimeout(() => sfx("stamp"), 240);
  setTimeout(() => sfx("paper"), 420);
  seal?.classList.add("stamping");
  setTimeout(() => sfx("chime"), 520);
  setTimeout(() => {
    ov.classList.add("off");
    document.body.classList.remove("locked");
    window._unsealed = true;
    document.querySelectorAll(".cover [data-rev]").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), i * 70);
    });
    setTimeout(() => {
      document.querySelectorAll(".masthead [data-scramble], .cover [data-scramble]").forEach((el) => scramble(el));
    }, 180);
    const inf1 = document.querySelector("[data-inf-1]");
    const inf2 = document.querySelector("[data-inf-2]");
    [inf1, inf2].forEach((c) => {
      if (!c) return;
      const len = c.getTotalLength();
      c.style.strokeDasharray = len;
      c.style.strokeDashoffset = len;
      c.style.transition = "stroke-dashoffset 1.5s cubic-bezier(.33,1,.68,1)";
      requestAnimationFrame(() => requestAnimationFrame(() => (c.style.strokeDashoffset = 0)));
    });
  }, 300);
}

/* ── 入场 ─────────────────────────────────────────────────────── */
function initReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) { e.target.dataset.armed = "1"; return; }
      if (!window._unsealed) return;
      if (e.target.dataset.armed !== "1" && e.target.dataset.done === "1") return;
      e.target.dataset.done = "1";
      e.target.dataset.armed = "";
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-scramble]").forEach((el) => scramble(el));
      e.target.querySelectorAll("[data-ode]").forEach((el) => ode(el, +el.dataset.ode, +(el.dataset.dec || 0)));
      e.target.querySelectorAll("canvas[data-halftone]").forEach((cv) => halftone(cv));
      if (e.target.matches("canvas[data-halftone]")) halftone(e.target);
    });
  }, { threshold: 0.22 });
  document.querySelectorAll("[data-rev]").forEach((el) => {
    el.dataset.armed = "1";
    io.observe(el);
  });
  // 独立于版块的网点 / 读数
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = "1";
      if (e.target.matches("canvas[data-halftone]")) halftone(e.target);
      if (e.target.hasAttribute("data-ode")) ode(e.target, +e.target.dataset.ode, +(e.target.dataset.dec || 0));
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("canvas[data-halftone],[data-ode]").forEach((el) => io2.observe(el));
}

/* ── 导航：精确落位 + 落地音 + 章节指示 ───────────────────────── */
let _scrollRAF = null;
function scrollToEl(el, done) {
  const margin = 64;
  const startT = performance.now(), dur = 700;
  const startY = window.scrollY;
  if (_scrollRAF) cancelAnimationFrame(_scrollRAF);
  window._rlMuteUntil = startT + dur;
  (function step(now) {
    const p = Math.min(1, (now - startT) / dur);
    const e = EASE.outCubic(p);
    const target = el.getBoundingClientRect().top + window.scrollY - margin;
    window.scrollTo({ top: startY + (target - startY) * e, behavior: "instant" });
    if (p < 1) _scrollRAF = requestAnimationFrame(step);
    else { window._rlMuteUntil = 0; if (done) done(); }
  })(startT);
}

function initNav() {
  const links = [...document.querySelectorAll("#nav a[href^='#']")];
  links.forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute("href"));
    if (el) scrollToEl(el, () => sfx("beep"));
  }));
  const secs = [...document.querySelectorAll("section.spread")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = "#" + e.target.id;
      links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === id));
      const label = document.getElementById("hsec");
      if (label) label.textContent = "SEC." + e.target.id.replace("s", "");
    });
  }, { threshold: 0.35, rootMargin: "-20% 0px -40% 0px" });
  secs.forEach((s) => spy.observe(s));
}

/* ── 网格 / 基线 ──────────────────────────────────────────────── */
function initGrid() {
  const cols = document.getElementById("gridcols");
  if (cols) for (let i = 0; i < 12; i++) cols.appendChild(document.createElement("i"));
  const toggle = () => {
    document.body.classList.toggle("grid-on");
    sfx("ui");
  };
  document.getElementById("gridbtn")?.addEventListener("click", toggle);
  window.addEventListener("keydown", (e) => {
    if (e.target.closest("input,textarea")) return;
    if (e.code === "KeyG") toggle();
  });
}

/* ── HUD 坐标 ─────────────────────────────────────────────────── */
function initHud() {
  const hx = document.getElementById("hx"), hy = document.getElementById("hy");
  let raf = 0, px = 0, py = 0;
  window.addEventListener("pointermove", (e) => {
    px = e.clientX; py = e.clientY;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      if (hx) hx.textContent = String(px).padStart(4, "0");
      if (hy) hy.textContent = String(Math.round(window.scrollY + py)).padStart(4, "0");
    });
  }, { passive: true });
}

/* ── 纸张交互音 ───────────────────────────────────────────────── */
function initPaperSound() {
  document.querySelectorAll(".plate").forEach((p) => p.addEventListener("pointerenter", hoverPaper));
  document.querySelectorAll(".redact").forEach((r) => r.addEventListener("pointerenter", () => sfx("scratch")));
  document.querySelectorAll(".sticker,.stamp").forEach((s) => s.addEventListener("click", () => sfx("stamp")));
  document.querySelectorAll(".ix-row").forEach((r) => r.addEventListener("pointerenter", () => sfx("step")));
}

/* ── 启动 ─────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("canvas[data-barcode]").forEach(barcode);

  // 调试/截图直通：?skip=1 跳过拆封直接显示全部
  if (location.search.includes("skip")) {
    const ov0 = document.getElementById("unseal");
    ov0?.classList.add("off");
    document.body.classList.remove("locked");
    window._unsealed = true;
    document.querySelectorAll("[data-rev]").forEach((el) => el.classList.add("in"));
    setTimeout(() => {
      document.querySelectorAll("canvas[data-halftone]").forEach((cv) => halftone(cv, { animate: false }));
      document.querySelectorAll("[data-ode]").forEach((el) => ode(el, +el.dataset.ode, +(el.dataset.dec || 0), 1));
    }, 80);
    initReveals(); initNav(); initGrid(); initHud(); initPaperSound();
    if (location.hash) {
      setTimeout(() => {
        const t = document.querySelector(location.hash);
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 64, behavior: "instant" });
      }, 260);
    }
    return;
  }
  initReveals();
  initNav();
  initGrid();
  initHud();
  initPaperSound();

  const seal = document.getElementById("seal");
  const ov = document.getElementById("unseal");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    ov?.classList.add("off");
    document.body.classList.remove("locked");
    window._unsealed = true;
    document.querySelectorAll("[data-rev]").forEach((el) => el.classList.add("in"));
    document.querySelectorAll("canvas[data-halftone]").forEach((cv) => halftone(cv, { animate: false }));
    return;
  }
  seal?.addEventListener("click", unseal);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      if (ov && !ov.classList.contains("off")) { e.preventDefault(); unseal(); }
    }
  });
  // 兜底：25s 未操作自动拆封
  setTimeout(() => { if (ov && !ov.classList.contains("off")) {
    ov.classList.add("off"); document.body.classList.remove("locked");
    window._unsealed = true;
    document.querySelectorAll("[data-rev]").forEach((el) => el.classList.add("in"));
  } }, 25000);
});
