/* Free toolkit helpers • v2025.12.25.3 */

(function () {
  async function copyFromSelector(sel) {
    const el = document.querySelector(sel);
    if (!el) return false;

    const text = (el.value !== undefined) ? el.value : el.textContent;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch (err) {
        document.body.removeChild(ta);
        return false;
      }
    }
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const sel = btn.getAttribute("data-copy");
      const ok = await copyFromSelector(sel);
      btn.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(() => { btn.textContent = "Copy template"; }, 1200);
    });
  });
})();
