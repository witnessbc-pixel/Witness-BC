/* /assets/js/toolkits.js • Toolkits behaviors • v2025.12.25.4 */
(function () {
  // ---- Details toggles (Bundles + individual toolkits) ----
  document.querySelectorAll("[data-details-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-details-toggle");
      var box = document.querySelector('[data-details="' + key + '"]');
      if (!box) return;

      var open = !box.hasAttribute("hidden");
      if (open) {
        box.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      } else {
        box.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---- Pay-link binder ----
  var LINKS = (window.WITNESS_PAY && window.WITNESS_PAY.links) ? window.WITNESS_PAY.links : {};
  function isPlaceholder(href) { return !href || String(href).includes("REPLACE_"); }

  function disableLink(a, reason) {
    a.setAttribute("aria-disabled", "true");
    a.classList.add("disabled");

    // Make it keyboard-focusable even if no href existed
    a.setAttribute("href", "#");
    a.setAttribute("title", reason || "Payment link coming soon.");

    a.addEventListener("click", function (e) { e.preventDefault(); });
    a.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") e.preventDefault();
    });
  }

  document.querySelectorAll("a[data-buy]").forEach(function (a) {
    var key = a.getAttribute("data-buy");
    var href = LINKS[key];

    if (!href || isPlaceholder(href)) {
      disableLink(a, "Payment link coming soon. Replace REPLACE_* in WITNESS_PAY.");
      return;
    }

    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
})();
