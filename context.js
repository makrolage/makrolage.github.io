async function renderContext() {
  const target = document.getElementById("context-cards");
  try {
    const response = await fetch("data/context.json", {cache: "no-cache"});
    if (!response.ok) throw new Error("Underlaget saknas");
    const data = await response.json();
    target.innerHTML = data.cards.map(card => {
      const latest = card.latest;
      const labels = {CURRENT: "Kontrollerad", STALE: "Aktualitet osäker", UNAVAILABLE: "Ej tillgänglig"};
      const dates = `Referens: ${esc(latest?.period || "saknas")} · ${esc(card.frequency)}`;
      const change = card.change == null ? "Jämförelse saknas" : `${card.change >= 0 ? "+" : ""}${number(card.change)} ${esc(card.change_unit || "indexenheter")} mot ${esc(card.compare_period)}`;
      const warning = card.last_attempt_status === "FAILED" ? "Senaste hämtningen misslyckades. Senast verifierade data visas." : card.error || "";
      const revision = card.first_collection ? "Första arkiveringen; historiska revisioner kan ännu inte jämföras." : `${card.new_observations} nya observationer och ${card.revised_observations} värderevisioner i senaste hämtningen (hela källan).`;
      return `<article class="domain-card context-card"><p class="eyebrow">${esc(card.dimension)}</p><h3>${esc(card.label)}</h3><p class="context-status" data-verified="${esc(card.verified_at)}" data-status="${esc(card.status)}">${labels[card.status]}</p><div class="card-score"><strong>${number(latest?.value)}</strong><span>${esc(card.unit)}</span></div><p>${esc(card.level || "Underlag saknas")}</p><p><b>Förändring:</b> ${change}</p><p>${dates}</p><p class="panel-subtitle">${esc(card.note)}</p>${warning ? `<p class="context-warning">${esc(warning)}</p>` : ""}<details><summary>Källa och uppdatering</summary><p><a href="${esc(card.source_url)}" target="_blank" rel="noopener noreferrer">${esc(card.provider)}</a></p><p>Kontrollerad ${formatDate(card.verified_at)}</p><p>${esc(revision)}</p><p>Historiken kan revideras. Förändringen beräknas inom samma senaste vintage.</p></details></article>`;
    }).join("");
    updateContextFreshness();
  } catch (error) {
    target.textContent = `Kompletterande lägesbild kunde inte laddas: ${error.message}`;
  }
}

function updateContextFreshness() {
  document.querySelectorAll(".context-status").forEach(el => {
    const verified = Date.parse(el.dataset.verified);
    if (el.dataset.status === "CURRENT" && (!Number.isFinite(verified) || Date.now() - verified > 96 * 3600000))
      el.textContent = "Aktualitet osäker";
  });
}
renderContext();
setInterval(updateContextFreshness, 60000);
