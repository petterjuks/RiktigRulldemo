// ===============================
// Lager dopapir-objekt
// ===============================
function lagDopapir({
  navn,
  butikk,
  pris,
  meter,
  lag,
  forPris = null,
  bilde = null
}) {
  const prisPerMeter = pris / meter;
  const prisPer100m = prisPerMeter * 100;
  const ranking = lag / prisPerMeter;

  return {
    navn,
    butikk,
    pris,
    forPris,
    meter,
    lag,
    prisPer100m,
    ranking,
    bilde
  };
}

// ===============================
// Database
// ===============================
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
    pris: 60,
    forPris: 79.90,
    meter: 300.8,
    lag: 3,
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
    pris: 139,
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
    pris: 60,
    meter: 320,
    lag: 3,
    forPris: 79.90,
    bilde: "images/unik-16pk.webp"
  }),
];

// ===============================
// Global state
// ===============================
let bareTilbud = false;

// ===============================
// Hjelpefunksjoner
// ===============================
function hentSortertListe() {
  const liste = bareTilbud
    ? dopapirListe.filter(d => d.forPris !== null)
    : dopapirListe;

  return [...liste].sort((a, b) => b.ranking - a.ranking);
}

function hentUkensKupp() {
  const liste = hentSortertListe();
  return liste.length > 0 ? liste[0] : null;
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
        <img src="${d.bilde}" alt="${d.navn}">
      </div>
    ` : ""}

    <div class="detaljinfo">
      <div>🧻 ${d.lag} lag</div>
      <div>📏 ${d.meter.toFixed(1)} meter</div>
      <div>💰 ${d.prisPer100m.toFixed(2)} kr / 100m</div>
    </div>
  </div>
`;

li.addEventListener("click", () => {
  document.querySelectorAll("#toppliste li").forEach(el => {
    if (el !== li) el.classList.remove("åpen");
  });

  li.classList.toggle("åpen");
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
        <div class="ukens-label">UKENS BESTE KJØP</div>
        <div class="ukens-navn">${ukensKupp.navn}</div>
        <div class="ukens-butikk">${ukensKupp.butikk.toUpperCase()}</div>

        ${ukensKupp.bilde ? `
          <div class="ukens-bilde">
            <img src="${ukensKupp.bilde}" alt="${ukensKupp.navn}">
          </div>
        ` : ""}
      </div>

      <div class="ukens-høyre">
        ${harTilbud ? `<div class="for-pris">${ukensKupp.forPris.toFixed(2)}</div>` : ""}
        <div class="nå-pris">${ukensKupp.pris.toFixed(2)}</div>
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
