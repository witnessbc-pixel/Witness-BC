/* Toolkits pay-link binder • v2025.12.25.3 */

(function () {
  const LINKS = (window.WITNESS_PAY && window.WITNESS_PAY.links) ? window.WITNESS_PAY.links : {};
  const isPlaceholder = (href) => !href || String(href).includes("REPLACE_");

  function disable(a, reason) {
    a.setAttribute("aria-disabled", "true");
    a.classList.add("disabled");
    a.setAttribute("href", "#");
    a.setAttribute("role", "link");
    a.setAttribute("tabindex", "0");
    a.setAttribute("title", reason || "Payment link coming soon.");
    a.addEventListener("click", function (e) { e.preventDefault(); });
  }

  document.querySelectorAll("a[data-buy]").forEach(function (a) {
    const key = a.getAttribute("data-buy");
    const href = LINKS[key];

    if (!href || isPlaceholder(href)) {
      disable(a, "Payment link coming soon. Replace REPLACE_* in WITNESS_PAY.");
      return;
    }

    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
})();
