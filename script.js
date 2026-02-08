// Lager dopapir-objekt
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

lagDopapir({
    navn:"test 18pk",
    butikk: "testenms",
    pris: 89.90,
    meter: 123,
    lag: 2,
    bilde: "delicate-16pk",

});
/*lagDopapir({
    navn: "Nytt produkt",
    butikk: "Nyttprodukt",
    pris: 999,
    meter: 999,
    lag: 3,
    forPris: 990,
    bilde: "images/supersoft-24pk.webp"
  }),

  */

// Manuell input (din “database”)
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
    butikk: "Spar/Eurospar",
    pris: 60,
    meter: 320,
    lag: 3,
    forPris: 79.90,
    bilde: "images/unik-16pk.webp"
  }),
];


// Sortering
dopapirListe.sort((a, b) => b.ranking - a.ranking);
const ukensKupp = dopapirListe[0];

// Toppliste
function visToppliste() {
  const ul = document.getElementById("toppliste");
  ul.innerHTML = "";

  dopapirListe.forEach((d, i) => {
    const li = document.createElement("li");

    if (i < 3) li.classList.add(`plass-${i + 1}`);
    if (i === 3) li.classList.add("plass-4");
    if (i === 4) li.classList.add("plass-5");

    const harTilbud = d.forPris !== null;

    li.innerHTML = `
      <div class="rad-topp">
        <span class="plass">${i + 1}.</span>
        <span class="navn">
        ${d.navn}
    ${harTilbud ? `<span class="tilbud-tag">Tilbud</span>` : ""}
        </span>
      </div>

      <div class="rad-bunn">
        <span class="butikk">${d.butikk}</span>

        <div class="pris-blokk">
          ${harTilbud ? `<div class="for-pris">${d.forPris.toFixed(2)} kr</div>` : ""}
          <div class="tilbud-linje">
            <span class="tilbud-pris">${d.pris.toFixed(2)} kr</span>
          </div>
          <div>${d.prisPer100m.toFixed(2)} kr / 100 m</div>
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
    <div>💰 ${d.prisPer100m.toFixed(2)} kr / 100 m</div>
  </div>
</div>
    `;

    li.addEventListener("click", () => {
  // Lukk alle andre
  document.querySelectorAll("#toppliste li").forEach(el => {
    if (el !== li) el.classList.remove("åpen");
  });

  // Toggle denne
  li.classList.toggle("åpen");
});


    ul.appendChild(li);
  });
}

// Ukens kupp
function visUkensKupp() {
  document.getElementById("ukens-kupp").innerHTML = `
    <div class="ukens-wrapper">

      ${ukensKupp.bilde ? `
        <div class="ukens-bilde">
          <img src="${ukensKupp.bilde}" alt="${ukensKupp.navn}" loading="lazy">
        </div>
      ` : ""}

      <div class="ukens-innhold">
        <div class="ukens-label">Ukens beste kjøp</div>

        <div class="ukens-navn">${ukensKupp.navn}</div>
        <div class="ukens-butikk">${ukensKupp.butikk}</div>

        <div class="ukens-metrics">
          <div>
            <strong>${ukensKupp.prisPer100m.toFixed(2)}</strong>
            <span>kr / 100 m</span>
          </div>
          <div>
            <strong>${ukensKupp.lag}</strong>
            <span>lag</span>
          </div>
        </div>
      </div>

    </div>
  `;
}


// Sist oppdatert
function visSistOppdatert() {
  const dato = new Date().toLocaleDateString("no-NO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("sist-oppdatert").innerText =
    `Sist oppdatert: ${dato}`;
}

// Init
visToppliste();
visUkensKupp();
visSistOppdatert();
