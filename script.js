// Hier trägst du alle Modelle ein, die verglichen werden sollen.
// "name" ist der echte Tool-Name (nur für dich zur späteren Zuordnung),
// "hint" ist die neutrale Bezeichnung, die den Studierenden angezeigt wird.
//
// Optional: "animationen" legt fest, welche Clips in welcher Reihenfolge
// und mit welcher Beschriftung angezeigt werden sollen. Das ist nötig,
// sobald ein Tool eigene, abweichende Clip-Namen verwendet (z. B. Meshy).
// "clip" muss exakt dem Namen entsprechen, wie er in der glTF-Datei steht
// (per gltf-viewer.donmccurdy.com oder Browser-Konsole herausfinden).
// Der erste Eintrag in der Liste wird automatisch als Startanimation gesetzt.
// Ist "animationen" nicht angegeben, versucht das Skript die Clips
// automatisch anhand der globalen Liste weiter unten zuzuordnen.
//
// Optional: "kamera" enthält individuelle Kamera-Einstellungen für genau
// dieses Modell. Jeder Wert, der hier weggelassen wird, fällt auf den
// model-viewer-Standard bzw. auf "standardKamera" weiter unten zurück.
// Mögliche Felder:
//   orbit           -> camera-orbit, Form "Winkel Winkel Abstand", z. B. "0deg 75deg 2.5m"
//   target          -> camera-target, Form "X Y Z" in Metern, z. B. "0m 1m 0m"
//   minOrbit        -> min-camera-orbit, gleiche Form wie orbit, steuert wie nah man heranzoomen darf
//   maxOrbit        -> max-camera-orbit, gleiche Form wie orbit, steuert wie weit man herauszoomen darf
//   fieldOfView     -> field-of-view, z. B. "30deg"
//   minFieldOfView  -> min-field-of-view, Grenze fürs Heranzoomen über den Blickwinkel
//   maxFieldOfView  -> max-field-of-view, Grenze fürs Herauszoomen über den Blickwinkel
//
// Optional: "licht" enthält individuelle Beleuchtungseinstellungen für
// genau dieses Modell. Siehe "lichtAttribute" weiter unten für alle
// verfügbaren Felder.
const modelle = [
  {
    src: "models/Meshy_mit_Boden.glb",
    name: "Meshy",
    hint: "Modell A",
    animationen: [
      { clip: "Walk", label: "Gehen" },
     
      
      { clip: "Run", label: "Rennen" },
      { clip: "RunFast", label: "Rennen schnell" },
    ],
    kamera: {
      orbit: "0deg 75deg 3.5m",
    },
  },
  {
    src: "models/tripo.glb",
    name: "Tripo",
    hint: "Modell B",
     animationen: [
      { clip: "Idle", label: "Idle" },
      { clip: " Walk", label: "Gehen" },
      { clip: "Run", label: "Rennen" },
    ],
    kamera: {
      // Tripo scheint in einer anderen Ausgangsrotation exportiert worden
      // zu sein als die anderen Modelle. Wert bei Bedarf in Schritten von
      // 90deg anpassen (90deg, 180deg, -90deg), bis die Kamera frontal
      // auf die Figur schaut.
      orbit: "90deg 75deg 2.5m",
    },
    licht: {
      exposure: "0.8",
      shadowIntensity: "0.7",
    },
  },
  {
    src: "models/mixamo.glb",
    name: "Mixamo",
    hint: "Modell C",
      animationen: [
      { clip: "Idle", label: "Idle" },
      { clip: "Walk", label: "Gehen" },
      { clip: "SlowRun", label: "Rennen" },
       { clip: "FastRun", label: "Rennen schnell" },
    ],
    kamera: {
      orbit: "0deg 75deg 4.5m",
      // Seit der Boden mit exportiert wird, ist die Szenen-Bounding-Box
      // größer, deshalb hier einen festen Zielpunkt setzen, ungefähr auf
      // Hüft- bis Bauchhöhe des Charakters. Zweiter Wert = Höhe in Metern.
      target: "0m 1m 0m",
      // Erlaubt weiteres Herauszoomen per Mausrad/Pinch-Geste, nützlich
      // bei Animationen mit viel Vorwärtsbewegung (z. B. Fast Run).
      maxOrbit: "auto auto 6m",
      // Kurzfristige Abhilfe, solange der Boden in Blender noch nicht
      // neu skaliert wurde: fester Blickwinkel statt automatischer
      // Berechnung anhand der (durch den Boden stark vergrößerten)
      // Bounding Box. Wert bei Bedarf anpassen, kleinere Zahl = näher dran.
      fieldOfView: "30deg",
    },
  },
  {
    src: "models/accurig.glb",
    name: "AccuRIG 2",
    hint: "Modell D",
     animationen: [
      { clip: "Idle", label: "Idle" },
      { clip: "Walk", label: "Gehen" },
      { clip: "Run", label: "Rennen" },
    ],
    kamera: {
      orbit: "0deg 75deg 3.5m",
    },
  },
];

// Wird verwendet, wenn ein Modell in seinem "kamera"-Objekt ein Feld
// nicht angibt. "orbit" hat hier bewusst einen Wert, alle anderen Felder
// bleiben standardmäßig ungesetzt (model-viewer nutzt dann seinen eigenen
// automatischen Standard, meist "auto auto auto").
const standardKamera = {
  orbit: "0deg 75deg 2.5m",
};

// Ordnet die sprechenden Feldnamen aus "kamera" den tatsächlichen
// HTML-Attributen von model-viewer zu.
const kameraAttribute = {
  orbit: "camera-orbit",
  target: "camera-target",
  minOrbit: "min-camera-orbit",
  maxOrbit: "max-camera-orbit",
  fieldOfView: "field-of-view",
  minFieldOfView: "min-field-of-view",
  maxFieldOfView: "max-field-of-view",
};

function wendeKameraAn(viewer, kamera) {
  const einstellungen = { ...standardKamera, ...(kamera || {}) };
  Object.entries(einstellungen).forEach(([feld, wert]) => {
    if (!wert) return;
    const attribut = kameraAttribute[feld];
    if (attribut) viewer.setAttribute(attribut, wert);
  });
}

// Wird verwendet, wenn ein Modell in seinem "licht"-Objekt ein Feld nicht
// angibt. Entspricht den bisherigen festen Werten für alle Modelle.
const standardLicht = {
  exposure: "1",
  shadowIntensity: "1",
};

// Ordnet die sprechenden Feldnamen aus "licht" den tatsächlichen
// HTML-Attributen von model-viewer zu.
//   exposure          -> exposure, z. B. "1" (heller ab ca. 1.2, dunkler ab ca. 0.7)
//   shadowIntensity   -> shadow-intensity, 0 bis 1, Stärke des Kontaktschattens
//   shadowSoftness    -> shadow-softness, 0 bis 1, Weichheit der Schattenkante
//   environmentImage  -> environment-image, eigene HDRI-Datei oder "neutral"/"legacy"
//   skyboxImage       -> skybox-image, eigenes Bild als sichtbarer Hintergrund
const lichtAttribute = {
  exposure: "exposure",
  shadowIntensity: "shadow-intensity",
  shadowSoftness: "shadow-softness",
  environmentImage: "environment-image",
  skyboxImage: "skybox-image",
};

function wendeLichtAn(viewer, licht) {
  const einstellungen = { ...standardLicht, ...(licht || {}) };
  Object.entries(einstellungen).forEach(([feld, wert]) => {
    if (!wert) return;
    const attribut = lichtAttribute[feld];
    if (attribut) viewer.setAttribute(attribut, wert);
  });
}

// Auf true stellen, sobald die Studie läuft, damit nur die neutrale
// Bezeichnung sichtbar ist und die echten Tool-Namen verborgen bleiben.
const blindbewertung = true;

// Optional: lesbare Anzeigenamen für einzelne Animations-Clips.
// Der Schlüssel muss exakt dem Namen entsprechen, den du der Action
// in Blender vor dem Export gegeben hast (z. B. "Idle", "Walk").
// Clips, die hier nicht aufgeführt sind, werden einfach mit ihrem
// Originalnamen als Button-Beschriftung angezeigt.
const anzeigeName = {
  Idle: "Ruhe",
  Walk: "Gehen",
  SlowRun: "Rennen",
  FastRun: "Rennen schnell",
};

// Feste Reihenfolge für die Buttons, unabhängig davon, in welcher
// Reihenfolge model-viewer die Clips aus der Datei ausliest. Clips,
// die hier nicht aufgeführt sind, werden hinten angehängt.
const clipReihenfolge = ["Idle", "Walk", "SlowRun", "FastRun"];

// Entfernt Leerzeichen, Unter- und Bindestriche und schreibt klein,
// damit "Slow Run", "slow_run" und "SlowRun" als derselbe Clip erkannt
// werden. Das macht die Zuordnung unabhängig von der genauen Schreibweise,
// die je nach Export unterschiedlich ausfallen kann.
function normalisiere(name) {
  return name.toLowerCase().replace(/[\s_-]/g, "");
}

const anzeigeNameNormalisiert = Object.fromEntries(
  Object.entries(anzeigeName).map(([key, wert]) => [normalisiere(key), wert])
);

const clipReihenfolgeNormalisiert = clipReihenfolge.map(normalisiere);

function sortiereClips(clips) {
  const bekannt = clipReihenfolgeNormalisiert
    .map((norm) => clips.find((c) => normalisiere(c) === norm))
    .filter(Boolean);
  const unbekannt = clips.filter(
    (c) => !clipReihenfolgeNormalisiert.includes(normalisiere(c))
  );
  return [...bekannt, ...unbekannt];
}

// Ermittelt für ein Modell die anzuzeigende Animationsliste. Wenn beim
// Modell eine eigene "animationen"-Liste hinterlegt ist, wird nur diese
// verwendet (gefiltert auf tatsächlich vorhandene Clips). Sonst greift
// die automatische Erkennung über die globalen Listen oben.
function ermittleAnimationen(modell, verfuegbareClips) {
  if (modell.animationen) {
    return modell.animationen.filter((eintrag) =>
      verfuegbareClips.includes(eintrag.clip)
    );
  }
  return sortiereClips(verfuegbareClips).map((clipName) => ({
    clip: clipName,
    label: anzeigeNameNormalisiert[normalisiere(clipName)] || clipName,
  }));
}

function erzeugeKarte(modell) {
  const card = document.createElement("div");
  card.className = "card";

  const viewer = document.createElement("model-viewer");
  viewer.setAttribute("src", modell.src);
  viewer.setAttribute("camera-controls", "");
  viewer.setAttribute("autoplay", "");
  wendeLichtAn(viewer, modell.licht);
  wendeKameraAn(viewer, modell.kamera);

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

  // Play/Pause-Steuerung für die aktuell laufende Animation. Unabhängig
  // davon, welche Animation gerade über die Auswahl-Buttons aktiv ist.
  const abspielSteuerung = document.createElement("div");
  abspielSteuerung.className = "abspiel-steuerung";

  const playPauseBtn = document.createElement("button");
  playPauseBtn.textContent = "Pause";
  playPauseBtn.addEventListener("click", () => {
    if (viewer.paused) {
      viewer.play();
    } else {
      viewer.pause();
    }
  });

  // Die Button-Beschriftung bleibt so immer korrekt, auch wenn die
  // Animation z. B. durch einen Wechsel des Clips neu gestartet wird.
  viewer.addEventListener("play", () => {
    playPauseBtn.textContent = "Pause";
  });
  viewer.addEventListener("pause", () => {
    playPauseBtn.textContent = "Abspielen";
  });

  abspielSteuerung.appendChild(playPauseBtn);

  const animControls = document.createElement("div");
  animControls.className = "anim-controls";

  const debugPanel = document.createElement("div");
  debugPanel.className = "debug-panel";

  /*
  const animZeile = document.createElement("div");
  animZeile.className = "zeile";
  const animLabel = document.createElement("span");
  animLabel.className = "label";
  animLabel.textContent = "Clips:";
  const animWert = document.createElement("span");
  animWert.textContent = "wird geladen …";
  animZeile.appendChild(animLabel);
  animZeile.appendChild(animWert);

  const orbitZeile = document.createElement("div");
  orbitZeile.className = "zeile";
  const orbitLabel = document.createElement("span");
  orbitLabel.className = "label";
  orbitLabel.textContent = "Orbit:";
  const orbitWert = document.createElement("span");
  orbitWert.textContent = "-";
  orbitZeile.appendChild(orbitLabel);
  orbitZeile.appendChild(orbitWert);

  const targetZeile = document.createElement("div");
  targetZeile.className = "zeile";
  const targetLabel = document.createElement("span");
  targetLabel.className = "label";
  targetLabel.textContent = "Target:";
  const targetWert = document.createElement("span");
  targetWert.textContent = "-";
  targetZeile.appendChild(targetLabel);
  targetZeile.appendChild(targetWert);

  const kopierBtn = document.createElement("button");
  kopierBtn.textContent = "Config kopieren";

  debugPanel.appendChild(animZeile);
  debugPanel.appendChild(orbitZeile);
  debugPanel.appendChild(targetZeile);
  debugPanel.appendChild(kopierBtn);
  */

  card.appendChild(viewer);
  card.appendChild(label);
  card.appendChild(abspielSteuerung);
  card.appendChild(animControls);
  card.appendChild(debugPanel);

  // Live-Aktualisierung der Kamera-Werte im Debug-Panel, immer wenn
  // sich die Kamera durch Nutzerinteraktion oder Code verändert.
  /*
  const aktualisiereKameraWerte = () => {
    const orbit = viewer.getCameraOrbit();
    const target = viewer.getCameraTarget();
    orbitWert.textContent =
      `${orbit.theta.toFixed(2)}rad ${orbit.phi.toFixed(2)}rad ${orbit.radius.toFixed(2)}m`;
    targetWert.textContent =
      `${target.x.toFixed(2)}m ${target.y.toFixed(2)}m ${target.z.toFixed(2)}m`;
  };
  viewer.addEventListener("camera-change", aktualisiereKameraWerte);
  */

  // Sobald das Modell geladen ist, liest model-viewer selbst aus,
  // welche Animationen in der Datei enthalten sind. Nur wenn es
  // mehr als eine gibt, macht eine Auswahl überhaupt Sinn.
  viewer.addEventListener("load", () => {
    /*
    const rohClips = viewer.availableAnimations || [];
    animWert.textContent = rohClips.length ? rohClips.join(", ") : "keine gefunden";
    aktualisiereKameraWerte();

    kopierBtn.addEventListener("click", () => {
      const vorlage = rohClips
        .map((clip) => `      { clip: "${clip}", label: "" },`)
        .join("\n");
      const code = `animationen: [\n${vorlage}\n    ],`;
      navigator.clipboard.writeText(code).then(() => {
        kopierBtn.textContent = "Kopiert!";
        setTimeout(() => (kopierBtn.textContent = "Config kopieren"), 1500);
      });
    });
    */

    const animationen = ermittleAnimationen(modell, viewer.availableAnimations || []);
    if (animationen.length <= 1) return;

    // Der erste Eintrag der ermittelten Liste ist immer die Startanimation,
    // egal ob sie aus der festen Liste oder der Autoerkennung stammt.
    const standardClip = animationen[0].clip;
    viewer.animationName = standardClip;

    animationen.forEach(({ clip, label }) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      if (clip === standardClip) btn.classList.add("active");

      btn.addEventListener("click", () => {
        viewer.animationName = clip;
        viewer.currentTime = 0;
        viewer.play();

        animControls
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });

      animControls.appendChild(btn);
    });
  });

  return card;
}

function baueGrid() {
  const grid = document.getElementById("model-grid");
  modelle.forEach((modell) => {
    grid.appendChild(erzeugeKarte(modell));
  });
}

function initDebugToggle() {
  const btn = document.getElementById("debug-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const aktiv = document.body.classList.toggle("debug-aktiv");
    btn.textContent = aktiv ? "Debug-Infos ausblenden" : "Debug-Infos einblenden";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  baueGrid();
  initDebugToggle();
});