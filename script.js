// ===============================
// Konfig
// ===============================
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuKd8HZGg_vIEwLb0phrIq6-4qLo_ZkFLbOXCwoWSy0LHoC0MFyp6KWeJldIW8BcB9E7Y8cAa5hkxU/pub?output=csv";

// Sett til false før lansering
let visScoreDebug = false;

// ===============================
// Global state
// ===============================
let dopapirListe = [];
let bareTilbud = false;

// ===============================
// Lager dopapir-objekt
// ===============================
function lagDopapir({
  navn,
  butikk,
  pris,
  meter,              // total meter i pakken
  lag,
  ruller = null,      // anbefalt
  arkPerRull = null,  // valgfritt
  vektPerRullG = null,// valgfritt
  forPris = null,
  bilde = null
}) {
  const prisPerMeter = pris / meter;
  const prisPer100m = prisPerMeter * 100;

  const meterPerRull = ruller ? (meter / ruller) : null;
  const prisPerRull = ruller ? (pris / ruller) : null;

  const rabattProsent = (forPris && forPris > pris)
    ? (forPris - pris) / forPris
    : 0;

  return {
    navn,
    butikk,
    pris,
    forPris,
    meter,
    lag,
    ruller,
    arkPerRull,
    vektPerRullG,
    meterPerRull,
    prisPerRull,
    prisPer100m,
    rabattProsent,
    valueScore: 0,
    dealScore: 0,
    bilde
  };
}

// ===============================
// Score-beregning
// ===============================
function beregnScores(liste) {
  const maxOf = (arr, fn) => {
    let m = 0;
    for (const x of arr) {
      const v = fn(x);
      if (v !== null && v !== undefined && Number.isFinite(v)) {
        if (v > m) m = v;
      }
    }
    return m || 1;
  };

  const safe01 = (x) => (Number.isFinite(x) ? x : null);

  const maxMeterPerKrone = maxOf(liste, d => d.meter / d.pris);
  const maxMeterPerRull  = maxOf(liste, d => d.meterPerRull);
  const maxLag           = maxOf(liste, d => d.lag);
  const maxArkPerRull    = maxOf(liste, d => d.arkPerRull);
  const maxVektPerRull   = maxOf(liste, d => d.vektPerRullG);
  const maxRabatt        = maxOf(liste, d => d.rabattProsent);


    //Vekting
  // Vekter
  const WEIGHTS_VALUE = {
    meterPerKrone: 0.80,
    meterPerRull:  0.10,
    lag:           0.08,
    arkPerRull:    0.02,
    vektPerRull:   0.00
  };

  const WEIGHTS_DEAL = {
    value:  0.60,
    rabatt: 0.40
  };

  for (const d of liste) {
    const parts = {
      meterPerKrone: safe01((d.meter / d.pris) / maxMeterPerKrone),
      meterPerRull:  d.meterPerRull ? safe01(d.meterPerRull / maxMeterPerRull) : null,
      lag:           safe01(d.lag / maxLag),
      arkPerRull:    (d.arkPerRull !== null) ? safe01(d.arkPerRull / maxArkPerRull) : null,
      vektPerRull:   (d.vektPerRullG !== null) ? safe01(d.vektPerRullG / maxVektPerRull) : null
    };

    let weightSum = 0;
    for (const key of Object.keys(WEIGHTS_VALUE)) {
      if (parts[key] !== null) weightSum += WEIGHTS_VALUE[key];
    }
    if (weightSum === 0) weightSum = 1;

    let valueScore = 0;
    for (const key of Object.keys(WEIGHTS_VALUE)) {
      if (parts[key] !== null) {
        valueScore += (WEIGHTS_VALUE[key] / weightSum) * parts[key];
      }
    }

    const rabattScore = maxRabatt ? (d.rabattProsent / maxRabatt) : 0;

    const dealScore =
      WEIGHTS_DEAL.value * valueScore +
      WEIGHTS_DEAL.rabatt * rabattScore;

    d.valueScore = Number.isFinite(valueScore) ? valueScore : 0;
    d.dealScore = Number.isFinite(dealScore) ? dealScore : 0;
  }

  return liste;
}

// ===============================
// Sheets -> CSV parsing
// ===============================
function toNumberOrNull(x) {
  if (x === undefined || x === null) return null;
  const s = String(x).trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseCSV(text) {
  // Fjern BOM om den finnes
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  // Autodetekter delimiter
  const firstLine = text.split(/\r?\n/)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount  = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ";" : ",";

  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === delimiter && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }
    if ((c === "\n" || c === "\r") && !inQuotes) {
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
      }
      cur = "";
      row = [];
      if (c === "\r" && next === "\n") i++;
      continue;
    }
    cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

async function lastInnProdukterFraSheet() {
  const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Klarte ikke hente CSV fra Google Sheets");
  const csvText = await res.text();

  const grid = parseCSV(csvText).filter(r => r.some(cell => String(cell).trim() !== ""));
  if (grid.length < 2) {
    dopapirListe = [];
    return;
  }

  const headers = grid[0].map(h => String(h).trim());
  const dataRows = grid.slice(1);

  dopapirListe = dataRows
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = (r[i] ?? "").trim());
      return obj;
    })
    .filter(r => r.navn && r.butikk)
    .map(r => lagDopapir({
      navn: String(r.navn).trim(),
      butikk: String(r.butikk).trim(),
      pris: toNumberOrNull(r.pris),
      forPris: toNumberOrNull(r.forPris),
      meter: toNumberOrNull(r.meter),
      lag: toNumberOrNull(r.lag),
      ruller: toNumberOrNull(r.ruller),
      arkPerRull: toNumberOrNull(r.arkPerRull),
      vektPerRullG: toNumberOrNull(r.vektPerRullG),
      bilde: r.bilde ? String(r.bilde).trim() : null
    }))
    .filter(d => d.pris !== null && d.meter !== null && d.lag !== null);

  // ✅ DENNE var det du manglet:
  beregnScores(dopapirListe);
}

// ===============================
// Hjelpefunksjoner (sortering/valg)
// ===============================
function erTilbud(d) {
  return d.forPris !== null && d.forPris > d.pris;
}

function hentSortertListe() {
  const liste = bareTilbud
    ? dopapirListe.filter(erTilbud)
    : dopapirListe;

  return [...liste].sort((a, b) => (b.valueScore - a.valueScore));
}

function hentUkensKupp() {
  const liste = bareTilbud
    ? dopapirListe.filter(erTilbud)
    : dopapirListe;

  const sortert = [...liste].sort((a, b) => (b.dealScore - a.dealScore));
  return sortert.length ? sortert[0] : null;
}


// ===============================
// UI: Toppliste
// ===============================
function visToppliste() {
  const ul = document.getElementById("toppliste");
  ul.innerHTML = "";

  const liste = hentSortertListe();

  liste.forEach((d, i) => {
    const li = document.createElement("li");
    li.classList.add("kort");

    const harTilbud = erTilbud(d);

    li.innerHTML = `
      <div class="kort-wrapper">
        <div class="venstre">
          <div class="butikk-rad">
            <span class="butikk">${d.butikk.toUpperCase()}</span>
            ${harTilbud ? `<span class="tilbud-tag">TILBUD</span>` : ""}
          </div>

          <div class="produkt-rad">
            <span class="plass">${i + 1}.</span>
            <span class="navn">${d.navn}</span>
          </div>

          <div class="meter">
            ${d.prisPer100m.toFixed(2)} kr / 100m
          </div>
        </div>

        <div class="høyre">
          ${harTilbud ? `<div class="for-pris">${d.forPris.toFixed(2)}</div>` : ""}
          <div class="nå-pris">${d.pris.toFixed(2)}</div>
        </div>
      </div>

      <div class="detaljer">
        ${d.bilde ? `
          <div class="produktbilde">
            <img src="${d.bilde}" alt="${d.navn}" loading="lazy">
          </div>
        ` : ""}

        <div class="detaljinfo">

    

          <div class="spec-table">
            <div class="spec-row">
              <span class="spec-label">Lag</span>
              <span class="spec-value">${d.lag}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Ruller</span>
              <span class="spec-value">${d.ruller ?? "-"}</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Totalt</span>
              <span class="spec-value">${d.meter.toFixed(1)} m</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Pris</span>
              <span class="spec-value">${d.prisPer100m.toFixed(2)} kr / 100m</span>
            </div>
          </div>

          <div class="tech-section">
  <div class="tech-toggle">
  <span>Tekniske detaljer</span>
  <span class="chevron">⌄</span>
</div>

  <div class="tech-content">
          <div class="spec-divider"></div>

          <div class="spec-table">
            ${d.meterPerRull ? `
              <div class="spec-row">
                <span class="spec-label">Meter / rull</span>
                <span class="spec-value">${d.meterPerRull.toFixed(1)} m</span>
              </div>
            ` : ""}

            ${d.prisPerRull ? `
              <div class="spec-row">
                <span class="spec-label">Pris / rull</span>
                <span class="spec-value">${d.prisPerRull.toFixed(2)} kr</span>
              </div>
            ` : ""}

            ${d.arkPerRull !== null ? `
              <div class="spec-row">
                <span class="spec-label">Ark / rull</span>
                <span class="spec-value">${d.arkPerRull}</span>
              </div>
            ` : ""}

            ${d.vektPerRullG !== null ? `
              <div class="spec-row">
                <span class="spec-label">Vekt / rull</span>
                <span class="spec-value">${d.vektPerRullG} g</span>
              </div>
            ` : ""}
          </div>

          ${visScoreDebug ? `
            <div class="score-debug">
              <div>Value score: ${d.valueScore.toFixed(3)}</div>
              <div>Deal score: ${d.dealScore.toFixed(3)}</div>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll("#toppliste li").forEach(el => {
        if (el !== li) el.classList.remove("åpen");
      });

      li.classList.toggle("åpen");

      // Vibrasjon fungerer på Android, ikke på iOS (ok å ha uansett)
      if (navigator.vibrate) navigator.vibrate(30);
    });

    ul.appendChild(li);

   li.querySelector(".tech-toggle")?.addEventListener("click", function(e){
  e.stopPropagation();
  const section = this.closest(".tech-section");
  section.classList.toggle("open");
});

  });
}

// ===============================
// UI: Ukens kupp
// ===============================
function visUkensKupp() {
  const ukensKupp = hentUkensKupp();
  const container = document.getElementById("ukens-kupp");

  if (!ukensKupp) {
    container.innerHTML = "<div>Ingen produkter funnet</div>";
    return;
  }

  const harTilbud = erTilbud(ukensKupp);

  container.innerHTML = `
    <div class="ukens-wrapper">
      <div class="ukens-venstre">

        ${ukensKupp.bilde ? `
          <div class="ukens-bilde">
            <img src="${ukensKupp.bilde}" alt="${ukensKupp.navn}">
          </div>
        ` : ""}

        <div class="ukens-label">UKENS KUPP</div>
        <div class="ukens-navn">${ukensKupp.navn}</div>
        <div class="ukens-butikk">${ukensKupp.butikk.toUpperCase()}</div>

       
      </div>

      <div class="ukens-høyre">
        ${harTilbud ? `
          <div class="rabatt-badge">
            -${(ukensKupp.rabattProsent * 100).toFixed(0)}%
          </div>
        ` : ""}

        ${harTilbud ? `
          <div class="for-pris">
            ${ukensKupp.forPris.toFixed(2)} kr
          </div>
        ` : ""}

        <div class="nå-pris">
          ${ukensKupp.pris.toFixed(2)} kr
        </div>

        <div class="meter">
          ${ukensKupp.prisPer100m.toFixed(2)} kr / 100m
        </div>
      </div>
    </div>
  `;
}

// ===============================
// Sist oppdatert
// ===============================
function visSistOppdatert() {
  const dato = new Date().toLocaleDateString("no-NO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  document.getElementById("sist-oppdatert").innerText =
    `Sist oppdatert: ${dato}`;
}

// ===============================
// Toggle knapp
// ===============================
document.getElementById("tilbudToggle")?.addEventListener("change", function () {
  bareTilbud = this.checked;
  visToppliste();
  visUkensKupp();
});

// ===============================
// Init (Sheets-basert)
// ===============================
(async function init() {
  try {
    await lastInnProdukterFraSheet();
  } catch (e) {
    console.error(e);
    document.getElementById("ukens-kupp").innerHTML =
      "<div>Klarte ikke hente produkter akkurat nå.</div>";
  }

  visToppliste();
  visUkensKupp();
  visSistOppdatert();
})();