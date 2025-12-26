(function () {
  const LINKS = (window.WITNESS_PAY && window.WITNESS_PAY.links) ? window.WITNESS_PAY.links : {};

  document.querySelectorAll("[data-buy]").forEach(el => {
    const key = el.getAttribute("data-buy");
    const href = LINKS[key];
    if (href) el.setAttribute("href", href);
  });
})();
