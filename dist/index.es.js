const f = {
  success: "Operation completed successfully!",
  error: "Critical system error detected!",
  info: "New update available.",
  warning: "Warning: This action cannot be undone.",
  custom: "Custom notification with special styling."
}, y = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
  custom: "✨"
};
function b() {
  let e = document.getElementById("grand-toast-container");
  return e || (e = document.createElement("div"), e.id = "grand-toast-container", document.body.appendChild(e)), e;
}
function x(e = {}) {
  const r = ["success", "error", "info", "warning", "custom"], i = ["slide", "bounce", "fade"], h = ["melt", "pixel", "hologram"], c = e.type && r.includes(e.type) ? e.type : "success", p = e.entranceAnim && i.includes(e.entranceAnim) ? e.entranceAnim : "slide", o = e.exitAnim && h.includes(e.exitAnim) ? e.exitAnim : "melt", l = typeof e.duration == "number" && e.duration > 0 ? e.duration : 3e3, v = typeof e.closable == "boolean" ? e.closable : !0, w = typeof e.showProgress == "boolean" ? e.showProgress : !1, E = b(), t = document.createElement("div");
  switch (t.className = `grand-toast ${c}`, t.setAttribute("role", "alert"), t.setAttribute("aria-live", "assertive"), t.setAttribute("aria-atomic", "true"), p) {
    case "bounce":
      t.style.animation = "grandEntranceBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
      break;
    case "fade":
      t.style.animation = "grandEntranceFade 0.5s ease-out forwards";
      break;
    default:
      t.style.animation = "grandEntranceSlide 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
  }
  e.background && (t.style.background = e.background);
  const d = document.createElement("div");
  d.className = "grand-toast-icon", d.innerHTML = e.icon || y[c] || y.custom, t.appendChild(d);
  const s = document.createElement("div");
  if (s.className = "grand-toast-content", e.title) {
    const n = document.createElement("h3");
    n.className = "grand-toast-title", n.textContent = e.title, s.appendChild(n);
  }
  const m = document.createElement("p");
  if (m.className = "grand-toast-message", m.textContent = e.message || f[c] || f.custom, s.appendChild(m), t.appendChild(s), v) {
    const n = document.createElement("button");
    n.className = "grand-toast-close", n.setAttribute("aria-label", "Close notification"), n.innerHTML = "×", n.onclick = () => u(t, o), t.appendChild(n);
  }
  let a = null;
  w && (a = document.createElement("div"), a.className = "grand-toast-progress", a.style.animation = `progress ${l}ms linear forwards`, t.appendChild(a)), E.appendChild(t);
  const g = setTimeout(() => {
    u(t, o);
  }, l);
  t.addEventListener("mouseenter", () => {
    clearTimeout(g), t.style.animationPlayState = "paused", a && (a.style.animationPlayState = "running");
  }), t.addEventListener("mouseleave", () => {
    t.style.animationPlayState = "running", a && (a.style.animationPlayState = "running");
    const n = setTimeout(() => {
      u(t, o);
    }, l);
    t.dataset.timeoutId = n.toString();
  }), t.dataset.timeoutId = g.toString();
}
function u(e, r = "melt") {
  switch (e.dataset.timeoutId && clearTimeout(parseInt(e.dataset.timeoutId)), e.style.animation = "none", e.classList.remove("pixel-exit", "hologram-exit"), e.offsetHeight, r) {
    case "pixel":
      e.classList.add("pixel-exit"), e.style.animation = "pixelDissolve 1s linear forwards";
      break;
    case "hologram":
      e.classList.add("hologram-exit"), e.style.animation = "hologramFlicker 0.8s ease-out forwards";
      break;
    default:
      e.style.animation = "meltAway 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards";
  }
  const i = () => {
    e && e.parentNode && e.parentNode.removeChild(e);
  };
  e.addEventListener("animationend", i, { once: !0 }), setTimeout(i, 1200);
}
b();
export {
  x as showToast
};
