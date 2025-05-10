const C = {
  success: "Operation completed successfully!",
  error: "Critical system error detected!",
  info: "New update available.",
  warning: "Warning: This action cannot be undone.",
  custom: "Custom notification with special styling."
}, F = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
  custom: "✨"
};
function T() {
  let e = document.getElementById("grand-toast-container");
  return e || (e = document.createElement("div"), e.id = "grand-toast-container", document.body.appendChild(e)), e;
}
function q(e = {}) {
  const g = ["success", "error", "info", "warning", "custom"], o = ["slide", "bounce", "fade"], s = ["melt", "pixel", "hologram"], c = ["top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center", "middle"], a = e.type && g.includes(e.type) ? e.type : "success", D = e.entranceAnim && o.includes(e.entranceAnim) ? e.entranceAnim : "slide", w = e.exitAnim && s.includes(e.exitAnim) ? e.exitAnim : "melt", $ = e.position && c.includes(e.position) ? e.position : "top-right", A = typeof e.duration == "number" && e.duration > 0 ? e.duration : 3e3, k = typeof e.closable == "boolean" ? e.closable : !0, l = typeof e.color == "string" ? e.color : "", f = typeof e.speed == "number" && e.speed > 0 ? e.speed : 600, P = typeof e.showProgress == "boolean" ? e.showProgress : !0, y = T();
  y.className = "grand-toast-container", y.classList.add($);
  const t = document.createElement("div");
  t.className = `grand-toast ${a}`, t.setAttribute("role", "alert"), t.setAttribute("aria-live", "assertive"), t.setAttribute("aria-atomic", "true");
  const b = `${f / 1e3}s`;
  switch (D) {
    case "bounce":
      t.style.animation = `grandEntranceBounce ${b} cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
      break;
    case "fade":
      t.style.animation = `grandEntranceFade ${b} ease-out forwards`;
      break;
    default:
      t.style.animation = `grandEntranceSlide ${b} cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
  }
  e.background && (t.style.background = e.background), l && (t.style.color = l);
  const p = document.createElement("div");
  p.className = "grand-toast-icon", p.innerHTML = e.icon || F[a] || F.custom, t.appendChild(p);
  const d = document.createElement("div");
  if (d.className = "grand-toast-content", e.title) {
    const n = document.createElement("h3");
    n.className = "grand-toast-title", n.textContent = e.title, d.appendChild(n);
  }
  const m = document.createElement("p");
  if (m.className = "grand-toast-message", m.textContent = e.message || C[a] || C.custom, l && (m.style.color = l), d.appendChild(m), t.appendChild(d), k) {
    const n = document.createElement("button");
    n.className = "grand-toast-close", n.setAttribute("aria-label", "Close notification"), n.innerHTML = "×", n.onclick = () => N(t, w, f), t.appendChild(n);
  }
  let r = null;
  P && (r = document.createElement("div"), r.className = "grand-toast-progress", r.setAttribute("aria-hidden", "true"), r.style.transform = "scaleX(1)", t.appendChild(r)), y.appendChild(t);
  let L = Date.now(), v = 0, x = 0, u = !1, i;
  const h = (n) => {
    if (u) return;
    const E = Date.now() - L - v, S = Math.max(0, 1 - E / A);
    if (r && (r.style.transform = `scaleX(${S})`), E >= A) {
      N(t, w, f);
      return;
    }
    i = requestAnimationFrame(h);
  };
  i = requestAnimationFrame(h), t.dataset.animationFrame = String(i), t.addEventListener("mouseenter", () => {
    u = !0, cancelAnimationFrame(i), x = Date.now();
  }), t.addEventListener("mouseleave", () => {
    u && (v += Date.now() - x, u = !1, i = requestAnimationFrame(h));
  });
}
function N(e, g = "melt", o = 600) {
  if (e.dataset.isDismissing) return;
  e.dataset.isDismissing = "true", e.dataset.animationFrame && cancelAnimationFrame(Number(e.dataset.animationFrame));
  const s = e.querySelector(".grand-toast-progress");
  s && (s.style.animationPlayState = "running", s.style.animation = "progress 200ms linear forwards"), e.style.animation = "none", e.style.transform = "none", e.style.opacity = "1", e.offsetHeight, setTimeout(() => {
    const a = `${o / 1e3}s`;
    switch (g) {
      case "pixel":
        e.classList.add("pixel-exit"), e.style.setProperty("--exit-duration", a), e.style.animation = `pixelDissolve ${a} linear forwards`;
        break;
      case "hologram":
        e.classList.add("hologram-exit"), e.style.animation = `hologramFlicker ${a} ease-out forwards`;
        break;
      default:
        e.style.animation = `meltAway ${a} cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards`;
    }
  }, 50);
  const c = () => {
    e && e.parentNode && e.parentNode.removeChild(e);
  };
  e.addEventListener("animationend", c, { once: !0 }), setTimeout(c, o + 100);
}
T();
export {
  q as showToast
};
