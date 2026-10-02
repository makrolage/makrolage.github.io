async function loadStructure() {
  const status = document.getElementById("structure-status");
  try {
    const response = await fetch("data/structure.json", {cache:"no-cache"});
    if (!response.ok) throw new Error("Forskningsunderlaget saknas");
    const payload = await response.json();
    const data = payload.latest;
    if (!data) {status.textContent = "Ingen verifierad strukturbild tillgänglig. Forskningsinsamling och kontroll måste slutföras.";return;}
    const age = Math.floor((Date.now() - Date.parse(data.input_end + "T00:00:00Z"))/86400000);
    status.textContent = `RESEARCH · Senaste ingående handelsdag: ${data.input_end} (${age} dagar gammal).` + (payload.last_attempt_status !== "OK" ? " Senaste forskningskörningen misslyckades; tidigare verifierat resultat visas." : "");
    document.getElementById("structure-dates").textContent = `Datavintage hämtad ${data.source_observed_at.slice(0,10)}. Tidigare fönster slutar ${data.previous_window_end}.`;
    const names = {mean_correlation:"Medelkorrelation",pc1_share:"Första huvudkomponentens andel (%)",effective_rank:"Effektiv rang",equal_weight_volatility:"Likaviktad logavkastning: årlig volatilitet (%)",h1_count:"Antal H1-slingor",h1_total_persistence:"Total H1-persistens",h1_weighted_birth:"Persistensviktad födelseskala"};
    const tbody = document.getElementById("structure-metrics");
    for (const [key,label] of Object.entries(names)) {
      const row = document.createElement("tr");
      const heading = document.createElement("th");heading.textContent=label;row.appendChild(heading);
      for (const group of ["current","previous","changes"]) {
        const cell=document.createElement("td");cell.dataset.label={current:"Senaste",previous:"Tidigare",changes:"Skillnad"}[group];const value=data[group][key];
        const percent = ["pc1_share", "equal_weight_volatility"].includes(key);
        cell.textContent=value==null?"Saknas":new Intl.NumberFormat("sv-SE",{maximumFractionDigits:percent?2:4}).format(value * (percent?100:1)) + (percent && group === "changes" ? " pp" : "");
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    document.getElementById("structure-distance").textContent = `Topologiskt bottleneck-avstånd: ${data.h1_bottleneck.toFixed(4)}. RMS-förändring i korrelation: ${data.correlation_rms_change.toFixed(4)}.`;
  } catch (error) {status.textContent=`Forskningsbilden kunde inte laddas: ${error.message}`;}
}
loadStructure();
