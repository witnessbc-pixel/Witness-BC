(async function () {
  async function inject(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.innerHTML = await res.text();
  }

  await inject("site-header", "/assets/partials/header.html");
  await inject("site-footer", "/assets/partials/footer.html");

  const active = (document.body.getAttribute("data-active") || "").trim();
  if (active) {
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.getAttribute("href") === active) a.classList.add("active");
    });
  }

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
