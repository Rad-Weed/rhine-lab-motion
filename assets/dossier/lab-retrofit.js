/* ══════════════════════════════════════════════════════════════════
   LAB RETROFIT — 版式层注入（不动演示逻辑）
   · 每个 section 变成一页：四角裁切标记 + 版口 running head + 页码
   · 页眉下加一条手册信息带
   ══════════════════════════════════════════════════════════════════ */
(function () {
  // 截图/调试直通：?skip=1 跳过终端开场
  if (location.search.includes("skip")) {
    document.querySelectorAll(".boot").forEach((b) => b.classList.add("off"));
    document.body.classList.remove("locked");
    const fz = document.createElement("style");
    fz.textContent = "*{animation-duration:.001s!important;animation-delay:0s!important;transition:none!important}/*freeze*/";
    document.head.appendChild(fz);
    const sy = new URLSearchParams(location.search).get("scroll");
    if (sy) setTimeout(() => window.scrollTo(0, +sy), 320);
  }
  const secs = [...document.querySelectorAll(".page section.section, .page section.mark-wrap")];
  secs.forEach((sec, i) => {
    // 四角裁切标记
    ["tl", "tr", "bl", "br"].forEach((p) => {
      if (sec.querySelector(":scope > .cm." + p)) return;
      const s = document.createElement("span");
      s.className = "cm " + p;
      sec.appendChild(s);
    });

    // 版口：把 "00 / TITLE" 变成 编号 + 标题 + 页码
    const h = [...sec.children].find((el) => el.classList && el.classList.contains("demo-h") && !el.classList.contains("conv"));
    if (h) {
      const m = h.textContent.trim().match(/^(\d{2})\s*\/\s*(.*)$/);
      if (m) {
        const rh = document.createElement("div");
        rh.className = "rh";
        const no = document.createElement("span"); no.className = "no"; no.textContent = m[1];
        const ti = document.createElement("span"); ti.className = "ti"; ti.textContent = m[2];
        const fo = document.createElement("span"); fo.className = "fo"; fo.textContent = "P." + String(i + 1).padStart(2, "0");
        rh.append(no, ti, fo);
        sec.insertBefore(rh, h);
        h.classList.add("conv");           // 原节点保留（字幕板仍读它），视觉隐藏
      }
    }

    // 页脚 folio
    if (!sec.querySelector(":scope > .folio")) {
      const f = document.createElement("div");
      f.className = "folio";
      f.textContent = "P." + String(i + 1).padStart(2, "0") + " — MOTION LAB";
      sec.appendChild(f);
    }
  });

  // 页眉下的手册信息带
  const head = document.querySelector(".hud-header");
  if (head && !document.querySelector(".lab-note")) {
    const n = document.createElement("div");
    n.className = "lab-note";
    n.innerHTML =
      "<span><b>MOTION LAB</b> / 动效手册 — 组件与交互参考库</span>" +
      "<span>MODULES " + String(secs.length).padStart(2, "0") + " · 21 SFX · KEYBOARD OK</span>" +
      "<span>REFERENCE BOOK, NOT A UI KIT</span>";
    head.parentNode.insertBefore(n, head.nextSibling);
  }
})();
