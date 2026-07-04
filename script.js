// Hier trägst du alle Modelle ein, die verglichen werden sollen.
// "name" ist der echte Tool-Name (nur für dich zur späteren Zuordnung),
// "hint" ist die neutrale Bezeichnung, die den Studierenden angezeigt wird.
const modelle = [
  { src: "models/meshy.glb", name: "Meshy", hint: "Modell A" },
  { src: "models/tripo.glb", name: "Tripo", hint: "Modell B" },
  { src: "models/mixamo.glb", name: "Mixamo", hint: "Modell C" },
  { src: "models/accurig.glb", name: "AccuRIG 2", hint: "Modell D" },
];

// Auf true stellen, sobald die Studie läuft, damit nur die neutrale
// Bezeichnung sichtbar ist und die echten Tool-Namen verborgen bleiben.
const blindbewertung = false;

function erzeugeKarte(modell) {
  const card = document.createElement("div");
  card.className = "card";

  const viewer = document.createElement("model-viewer");
  viewer.setAttribute("src", modell.src);
  viewer.setAttribute("camera-controls", "");
  viewer.setAttribute("auto-rotate", "");
  viewer.setAttribute("auto-rotate-delay", "3000");
  viewer.setAttribute("rotation-per-second", "20deg");
  viewer.setAttribute("autoplay", "");
  viewer.setAttribute("exposure", "1");
  viewer.setAttribute("shadow-intensity", "1");
  viewer.setAttribute("camera-orbit", "0deg 75deg 2.5m");

  const label = document.createElement("div");
  label.className = "card-label";

  const nameSpan = document.createElement("span");
  nameSpan.className = "name";
  nameSpan.textContent = blindbewertung ? modell.hint : modell.name;

  const hintSpan = document.createElement("span");
  hintSpan.className = "hint";
  hintSpan.textContent = blindbewertung ? "" : modell.hint;

  label.appendChild(nameSpan);
  label.appendChild(hintSpan);

  card.appendChild(viewer);
  card.appendChild(label);

  return card;
}

function baueGrid() {
  const grid = document.getElementById("model-grid");
  modelle.forEach((modell) => {
    grid.appendChild(erzeugeKarte(modell));
  });
}

document.addEventListener("DOMContentLoaded", baueGrid);
