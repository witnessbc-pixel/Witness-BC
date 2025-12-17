(async function () {
  const root = document.getElementById("stories");
  const updatedEl = document.getElementById("stories-updated");
  if (!root) return;

  const res = await fetch("/assets/data/stories.json", { cache: "no-store" });
  const data = await res.json();

  if (updatedEl && data.updated) updatedEl.textContent = data.updated;

  function esc(s){ return String(s||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  data.items.forEach(item => {
    const url = `${location.origin}/stories/?s=${encodeURIComponent(item.slug)}`;
    const tags = (item.tags || []).map(t => `<span class="badge">${esc(t)}</span>`).join(" ");

    const el = document.createElement("article");
    el.className = "story";
    el.innerHTML = `
      <div class="top">
        <div>
          <div class="badge">${esc(item.date || "")}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">${tags}</div>
      </div>

      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt)}</p>

      <div class="actions">
        <a class="chip" href="/send-a-tip/" aria-label="Support">Support</a>
        <button class="chip" type="button" data-share="1">Share</button>
        <button class="chip" type="button" data-copy="1">Copy link</button>
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
      }catch(e){}
    });

    copyBtn.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(url);
        copyBtn.textContent = "Copied";
        setTimeout(()=>copyBtn.textContent="Copy link", 900);
      }catch(e){}
    });

    root.appendChild(el);
  });
})();
