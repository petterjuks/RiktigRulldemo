// ===============================
// Lager dopapir-objekt
// ===============================
function lagDopapir({
  navn,
  butikk,
  pris,
  meter,              // total meter i pakken
  lag,
  ruller = null,      // anbefalt å fylle inn
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
    // settes senere (etter normalisering)
    valueScore: 0,
    dealScore: 0,
    bilde
  };
}

// ===============================
// Database
// ===============================

/*

function lagDopapir({
  navn,
  butikk,
  pris,
  meter,              // total meter i pakken
  lag,
  ruller = null,      // anbefalt å fylle inn
  arkPerRull = null,  // valgfritt
  vektPerRullG = null,// valgfritt
  forPris = null,
  bilde = null
}) 

  */

const dopapirListe = [
  lagDopapir({
    navn: "Super Soft 24-pk",
    butikk: "Europris",
    pris: 119,
    meter: 528,
    lag: 3,
    bilde: "images/supersoft-24pk.webp"
  }),

  lagDopapir({
    navn: "Veltie 18-pk",
    butikk: "Europris",
    pris: 89.90,
    meter: 329,
    lag: 3,
    bilde: "images/veltie-18pk.webp"
  }),

  lagDopapir({
    navn: "Delicate 16-pk",
    butikk: "Europris",
    pris: 70.90,
    meter: 304,
    lag: 3,
    bilde: "images/delicate-16pk.webp"
  }),

  lagDopapir({
    navn: "Veltie 32-pk",
    butikk: "Europris",
    pris: 120,
    meter: 528,
    lag: 3,
    bilde: "images/veltie-32pk.webp"
  }),

  lagDopapir({
    navn: "Lambi 16-pk",
    butikk: "Europris",
    pris: 62.90,
    meter: 300.8,
    lag: 3,
    forPris:79.90,
    bilde: "images/lambi-16pk.webp"
  }),

  lagDopapir({
    navn: "Super Soft 6-pk",
    butikk: "Europris",
    pris: 39.90,
    meter: 132,
    lag: 3,
    bilde: "images/supersoft-6pk.webp"
  }),

  lagDopapir({
    navn: "Lambi 24-pk",
    butikk: "Coop",
    pris: 144.40,
    meter: 494.4,
    lag: 3,
    bilde: "images/lambi-24pk.jpg"
  }),

  lagDopapir({
    navn: "Lambi 12-pk",
    butikk: "Spar",
    pris: 109,
    meter: 247.2,
    lag: 3,
    bilde: "images/lambi-12pk.jpg"
  }),

  lagDopapir({
    navn: "Unik soft 16-pk",
    butikk: "Spar",
    pris: 79.90,
    meter: 320,
    lag: 3,
    bilde: "images/unik-16pk.webp"
  }),

  lagDopapir({
    navn: "Toalettpapir 24-pk",
    butikk: "REMA 1000",
    pris: 117.90,
    meter: 458.4,
    lag: 3,
    ruller:24,
    arkPerRull:153,
    vektPerRullG:89.5,
    bilde: "images/toalettpapir-24pk.avif"
  }),

    lagDopapir({
    navn: "Unik Soft 8pk",
    butikk: "Kiwi",
    pris: 39.90,
    meter: 171.2,
    lag: 3,
    ruller: 8,
    arkPerRull: 171,
    vektPerRullG: 104,
    bilde: "images/unik-8pk.webp"
  }),

    lagDopapir({
    navn: "Comfort Lotus 16pk",
    butikk: "Kiwi",
    pris: 59.90,
    meter: 295.2,
    lag: 3,
    ruller:16,
    arkPerRull:150,
    vektPerRullG:92,
    bilde: "images/lotus-16pk.webp"
  }),
   
    lagDopapir({
    navn: "Coop Toalettpapir 16pk",
    butikk: "Coop",
    pris: 70.90,
    meter: 353.6,
    lag: 3,
    ruller: 16,
    arkPerRull: 177,
    vektPerRullG: 97.2,
    bilde: "images/coop-16pk.jpg"
  }),

];

beregnScores(dopapirListe);

function beregnScores(liste) {
  // Hjelper: max av en verdi, men ignorer null/undefined
  const maxOf = (arr, fn) => {
    let m = 0;
    for (const x of arr) {
      const v = fn(x);
      if (v !== null && v !== undefined && Number.isFinite(v)) {
        if (v > m) m = v;
      }
    }
    return m || 1; // unngå deling på 0
  };

  // Basemetrikker vi normaliserer mot
  const maxMeterPerKrone = maxOf(liste, d => d.meter / d.pris);              // verdi
  const maxMeterPerRull  = maxOf(liste, d => d.meterPerRull);               // komfort
  const maxLag           = maxOf(liste, d => d.lag);
  const maxArkPerRull    = maxOf(liste, d => d.arkPerRull);
  const maxVektPerRull   = maxOf(liste, d => d.vektPerRullG);
  const maxRabatt        = maxOf(liste, d => d.rabattProsent);

  // Vekter (kan tweakes)
  const WEIGHTS_VALUE = {
    meterPerKrone: 0.80,
    meterPerRull:  0.10,
    lag:           0.08,
    arkPerRull:    0.02, // valgfri bonus
    vektPerRull:   0.00  // valgfri bonus (brukes bare når oppgitt)
  };

  const WEIGHTS_DEAL = {
    value:  0.35,
    rabatt: 0.65
  };

  for (const d of liste) {
    // Normaliserte delscore (0..1)
    const parts = {
      meterPerKrone: (d.meter / d.pris) / maxMeterPerKrone,
      meterPerRull:  d.meterPerRull ? (d.meterPerRull / maxMeterPerRull) : null,
      lag:           d.lag / maxLag,
      arkPerRull:    (d.arkPerRull !== null) ? (d.arkPerRull / maxArkPerRull) : null,
      vektPerRull:   (d.vektPerRullG !== null) ? (d.vektPerRullG / maxVektPerRull) : null
    };

    // Renormaliser vekter basert på hvilke deler som finnes
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

    // Rabatt score (0..1), hvis ingen rabatt: 0
    const rabattScore = maxRabatt ? (d.rabattProsent / maxRabatt) : 0;

    // Deal score kombinerer value + rabatt
    const dealScore =
      WEIGHTS_DEAL.value * valueScore +
      WEIGHTS_DEAL.rabatt * rabattScore;

    d.valueScore = valueScore;
    d.dealScore = dealScore;
  }

  return liste;
}

// ===============================
// Global state
// ===============================
let bareTilbud = false;

let visScoreDebug = true; // sett til false før lansering
// ===============================
// Hjelpefunksjoner
// ===============================
function hentSortertListe() {
  const liste = bareTilbud
    ? dopapirListe.filter(d => d.forPris !== null)
    : dopapirListe;

  return [...liste].sort((a, b) => b.valueScore - a.valueScore);
}

function hentUkensKupp() {
  const liste = bareTilbud
    ? dopapirListe.filter(d => d.forPris !== null)
    : dopapirListe;

  // Ukens kupp = høyeste dealScore (verdi + rabatt)
  const sortert = [...liste].sort((a, b) => b.dealScore - a.dealScore);
  return sortert.length ? sortert[0] : null;
}

// ===============================
// Toppliste (NY UI STRUCTURE)
// ===============================
function visToppliste() {
  const ul = document.getElementById("toppliste");
  ul.innerHTML = "";

  const liste = hentSortertListe();

  liste.forEach((d, i) => {
    const li = document.createElement("li");
    li.classList.add("kort");

    const harTilbud = d.forPris !== null;

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
    `;

   // Klikk-event
li.addEventListener("click", () => {
  // Lukk andre kort
  document.querySelectorAll("#toppliste li").forEach(el => {
    if (el !== li) el.classList.remove("åpen");
  });

  // Åpne/lukk detaljer for dette kortet
  li.classList.toggle("åpen");

  // Haptic feedback (kort vibrasjon på mobil)
  if (navigator.vibrate) {
    navigator.vibrate(30); // 30 ms "tap"
  }
});

ul.appendChild(li);

  });
}


// ===============================
// Ukens beste kjøp
// ===============================
function visUkensKupp() {
  const ukensKupp = hentUkensKupp();
  const container = document.getElementById("ukens-kupp");

  if (!ukensKupp) {
    container.innerHTML = "<div>Ingen produkter funnet</div>";
    return;
  }

  const harTilbud = ukensKupp.forPris !== null;

  container.innerHTML = `
    <div class="ukens-wrapper">

 <div class="ukens-venstre">
  <div class="ukens-label">UKENS KUPP</div>
  <div class="ukens-navn">${ukensKupp.navn}</div>
  <div class="ukens-butikk">${ukensKupp.butikk.toUpperCase()}</div>

  ${ukensKupp.bilde ? `
    <div class="ukens-bilde">
      <img src="${ukensKupp.bilde}" alt="${ukensKupp.navn}">
    </div>
  ` : ""}
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
document.getElementById("tilbudToggle")?.addEventListener("click", function () {
  bareTilbud = !bareTilbud;
  this.classList.toggle("aktiv");

  visToppliste();
  visUkensKupp();
});

// ===============================
// Init
// ===============================
visToppliste();
visUkensKupp();
visSistOppdatert();
