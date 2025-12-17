(async function () {
  const root = document.getElementById("stories");
  const updatedEl = document.getElementById("stories-updated");
  if (!root) return;

  const SUPPORT_URL = "https://buy.stripe.com/test_14AfZheov3gWfGlf33eIw00";

  function esc(s){
    return String(s||"").replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  // If a specific story is requested: /stories/?s=slug
  const params = new URLSearchParams(location.search);
  const onlySlug = (params.get("s") || "").trim();

  let data;
  try {
    const res = await fetch("/assets/data/stories.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load stories.json");
    data = await res.json();
  } catch (e) {
    root.innerHTML = `
      <div class="card">
        <div class="meta">Feed temporarily unavailable. Please try again later or email
          <a href="mailto:hello@witnessbc.com?subject=Stories%20feed%20issue%20%E2%80%94%20WitnessBC">hello@witnessbc.com</a>.
        </div>
      </div>
    `;
    return;
  }

  if (updatedEl && data.updated) updatedEl.textContent = data.updated;

  const items = Array.isArray(data.items) ? data.items : [];
  const filtered = onlySlug ? items.filter(x => x && x.slug === onlySlug) : items;

  if (!filtered.length) {
    root.innerHTML = `
      <div class="card">
        <div class="meta">No stories found.</div>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const slug = item.slug || "";
    const url = `${location.origin}/stories/?s=${encodeURIComponent(slug)}`;
    const tagsArr = Array.isArray(item.tags) ? item.tags : [];
    const tagsBadges = tagsArr.map(t => `<span class="badge">${esc(t)}</span>`).join(" ");

    const el = document.createElement("article");
    el.className = "story";

    // Needed for client-side filter/search in /stories/index.html
    el.setAttribute("data-story", "1");
    el.setAttribute("data-title", item.title || "");
    el.setAttribute("data-tags", tagsArr.join(","));

    el.innerHTML = `
      <div class="top">
        <div>
          <div class="badge">${esc(item.date || "")}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">${tagsBadges}</div>
      </div>

      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt)}</p>

      <div class="actions">
        <a class="chip" href="${SUPPORT_URL}" target="_blank" rel="noopener" aria-label="Support publishing via Stripe">Support</a>
        <button class="chip" type="button" data-share="1" aria-label="Share this story">Share</button>
        <button class="chip" type="button" data-copy="1" aria-label="Copy link">Copy link</button>
      </div>
    `;

    const shareBtn = el.querySelector('[data-share="1"]');
    const copyBtn = el.querySelector('[data-copy="1"]');

    shareBtn.addEventListener("click", async () => {
      const text = item.shareText || item.title || "WitnessBC story";
      try{
        if (navigator.share) {
          await navigator.share({ title: item.title, text, url });
        } else {
          await navigator.clipboard.writeText(url);
          shareBtn.textContent = "Copied";
          setTimeout(()=>shareBtn.textContent="Share", 900);
        }
      } catch (e) {}
    });

    copyBtn.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(url);
        copyBtn.textContent = "Copied";
        setTimeout(()=>copyBtn.textContent="Copy link", 900);
      } catch (e) {}
    });

    root.appendChild(el);
  });
})();
