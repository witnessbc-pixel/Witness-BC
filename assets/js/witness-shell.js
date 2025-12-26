/* /assets/js/witness-shell.js • WitnessBC shell loader • v2025.12.25.4 */
(async function () {
  async function fetchText(url) {
    // Try cached, then fallback no-store
    try {
      const r1 = await fetch(url, { cache: "force-cache", credentials: "same-origin" });
      if (r1.ok) return await r1.text();
      throw new Error("cache fetch failed");
    } catch (_) {
      const r2 = await fetch(url, { cache: "no-store", credentials: "same-origin" });
      if (!r2.ok) throw new Error("fetch failed");
      return await r2.text();
    }
  }

  async function inject(id, url) {
    const el = document.getElementById(id);
    if (!el) return false;
    try {
      el.innerHTML = await fetchText(url);
      return true;
    } catch (e) {
      // Minimal safe fallback: do not break page
      return false;
    }
  }

  await inject("site-header", "/assets/partials/header.html");
  await inject("site-footer", "/assets/partials/footer.html");

  // Active nav state
  const active = (document.body.getAttribute("data-active") || "").trim();
  if (active) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      const href = a.getAttribute("href");
      if (href === active) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // Footer year (after injection)
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
