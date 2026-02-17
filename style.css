/* ===================================
   Base
=================================== */

body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
               system-ui, sans-serif;
  background: #f2f2f2;
  margin: 0;
  padding: 1rem;
  color: #111;
  font-size: 16px; /* Standard app-tekst */
}

.app {
  max-width: 100vw;
  margin: 0 auto;
  padding: 0.4rem;
}


/* ===================================
   Toggle knapp
=================================== */

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.filter-knapp {
  background: #919191;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem; /* Litt større knapptekst */
  transition: background 0.3s, color 0.3s;
  font-weight: 500;
  color: #111;
  -webkit-tap-highlight-color: transparent;

}

.filter-knapp.aktiv {
  background: #d8d8d8;
  color: #000000;
}

/* ===================================
   Ukens beste kjøp
=================================== */

#ukens-kupp {
  background: #ffffff;
  border-radius: 24px;
  padding: 1.8rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 6px 14px rgba(0,0,0,0.05);
}

.ukens-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: stretch;
}

.ukens-venstre {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ukens-label {
  font-size: 1.5rem; /* Standard app-label */
}

.ukens-navn {
  font-size: 1.3rem; /* Hovedproduktnavn */
}

.ukens-butikk {
  font-size: 1rem;
  margin-bottom: 0.8rem;
}

.ukens-bilde {
  margin-top: auto;
}

.ukens-bilde img {
  width: 100%;
  max-width: 200px;
}

.ukens-høyre {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
   align-items: center; /* sentrer innhold horisontalt */
  text-align: center;  /* sentrer tekst */
}

.ukens-høyre .for-pris {
  text-decoration: line-through;
  color: #ff3b30;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: -0.3rem;
}

.ukens-høyre .nå-pris {
  font-size: 1.5rem;
  font-weight: 500;
  
}

.ukens-høyre .meter {
  font-size: 1.1rem;
  letter-spacing: -0.025rem;
  font-weight: 500;
}

/* ===================================
   Toppliste kort
=================================== */

#toppliste {
  list-style: none;
  padding: 0;
  margin: 0;
}

#toppliste li {
  background: #ffffff;
  border-radius: 24px;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Kort layout */

.kort-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.venstre {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Butikk + tilbud */

.butikk-rad {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  margin-top: 0.2rem;
   margin-left: 1.7rem; /* sett samme bredde som .plass */
}

.butikk {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
}

.tilbud-tag {
  background: #ff5757;
  color: rgb(0, 0, 0);
  font-size: 0.7rem;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
}

/* Produkt */

.produkt-rad + .meter {
  display: block;       /* Sørg for at den ligger på egen linje */
  margin-left: 1.7rem;  /* Linjer opp med navnet (ikke nummeret) */
  
  font-size: 0.85rem;
  color: #333;
}

/* Nummeret står først */
.plass {
  font-size: 1.3rem;
  font-weight: 500;
  flex-shrink: 0;
  padding-right: 0.5rem;
}

/* Navnet får sin egen kolonne */
.navn {
  font-size: 1.3rem;
  font-weight: 400;
  flex: 1;
}

/* Pris per meter */

.meter {
  font-size: 0.85rem;
  color: #333;
}

/* Høyre prisblokk */

.høyre {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.høyre .for-pris {
  text-decoration: line-through;
  color: #ff5757;
  font-size: 0.95rem;
}

.høyre .nå-pris {
  font-size: 1.3rem;
  font-weight: 400;
}

/* ===================================
   Sist oppdatert
=================================== */

#sist-oppdatert {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #777;
}

/* =========================
   Detaljvisning
========================= */

.detaljer {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: all 0.35s ease;
  margin-top: 0;
}

#toppliste li.åpen .detaljer {
  max-height: 500px;
  opacity: 1;
  margin-top: 1rem;
}



.produktbilde img {
  width: 100%;
  max-width: 180px;
  margin: 1rem auto;
  display: block;
}

.detaljinfo {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

html {
  scroll-behavior: smooth;
}
