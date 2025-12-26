/* /assets/js/toolkits-free.js • Free toolkit helpers • v2025.12.25.4 */
(function () {
  async function copyFromSelector(sel) {
    var el = document.querySelector(sel);
    if (!el) return false;

    var text = (el.value !== undefined) ? el.value : el.textContent;

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback
      var ta = document.createElement("textarea");
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
    var initial = btn.textContent || "Copy template";
    btn.addEventListener("click", async function () {
      var sel = btn.getAttribute("data-copy");
      var ok = await copyFromSelector(sel);
      btn.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(function () { btn.textContent = initial; }, 1200);
    });
  });
})();
