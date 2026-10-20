// comete.js : comètes aléatoires. Une comète traverse l'écran à intervalle
// aléatoire ; un clic dessus donne un bonus temporaire tiré au hasard.
// À charger APRÈS game.js (il utilise bonusComete, déclaré dans game.js).

(function () {
  /* ---------- Réglages ---------- */
  const DELAI_MIN = 45 * 1000;   // délai minimum entre deux comètes (ms)
  const DELAI_MAX = 120 * 1000;  // délai maximum (ms)
  const TRAVERSEE_MIN = 6000;    // durée de la traversée de l'écran (ms)
  const TRAVERSEE_MAX = 9000;

  // production : multiplicateur de production | clic : gain par clic
  const BONUS = [
    { id: "frenesie", nom: "Frénésie",         icone: "🔥", duree: 20, production: 7,  texte: "production ×7" },
    { id: "souffle",  nom: "Souffle cosmique", icone: "🌠", duree: 60, production: 2,  texte: "production ×2" },
    { id: "clics",    nom: "Clics en or",      icone: "👆", duree: 30, clic: 10,       texte: "clics ×10" }
  ];

  /* ---------- Style (injecté ici pour ne pas toucher à style.css) ---------- */
  const style = document.createElement("style");
  style.textContent = `
    .comete {
      position: fixed; left: 0; top: 0; z-index: 50;
      width: 170px; height: 44px;
      cursor: pointer; touch-action: manipulation;
      -webkit-tap-highlight-color: transparent; will-change: transform;
    }
    .comete::before { /* la queue */
      content: ""; position: absolute; left: 22px; right: 0; top: 50%;
      height: 14px; transform: translateY(-50%);
      background: linear-gradient(to right, rgba(255,233,176,.9), rgba(255,159,67,.45) 40%, transparent);
      border-radius: 0 999px 999px 0; filter: blur(2px);
    }
    .comete::after { /* la tête */
      content: ""; position: absolute; left: 0; top: 50%;
      width: 34px; height: 34px; transform: translateY(-50%); border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fff, #ffe9b0 40%, #ff9f43 100%);
      box-shadow: 0 0 18px 6px rgba(255,159,67,.6);
    }
    #bonus-comete {
      position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
      z-index: 40; display: flex; flex-direction: column; align-items: center;
      gap: 6px; pointer-events: none;
    }
    .bonus-actif {
      padding: 6px 14px; font-size: .85rem; font-weight: 700;
      color: var(--sable); background: var(--verre);
      border: 1px solid var(--feu); border-radius: 999px;
      box-shadow: 0 6px 20px rgba(0,0,0,.4);
    }
  `;
  document.head.appendChild(style);

  const panneau = document.createElement("div");
  panneau.id = "bonus-comete";
  document.body.appendChild(panneau);

  /* ---------- Bonus actifs ---------- */
  const actifs = {}; // { idBonus: { bonus, fin } }

  // Pas d'empilement : on garde le meilleur bonus de chaque type
  function recalculer() {
    let production = 1;
    let clic = 1;
    for (const { bonus } of Object.values(actifs)) {
      if (bonus.production) production = Math.max(production, bonus.production);
      if (bonus.clic) clic = Math.max(clic, bonus.clic);
    }
    bonusComete.production = production;
    bonusComete.clic = clic;
  }

  function afficherBonus() {
    panneau.innerHTML = Object.values(actifs).map(({ bonus, fin }) => {
      const reste = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      return `<div class="bonus-actif">${bonus.icone} ${bonus.nom} : ${bonus.texte} (${reste} s)</div>`;
    }).join("");
  }

  setInterval(() => {
    let expire = false;
    for (const id of Object.keys(actifs)) {
      if (actifs[id].fin <= Date.now()) {
        delete actifs[id];
        expire = true;
      }
    }
    if (expire) recalculer();
    afficherBonus();
  }, 250);

  function activer(bonus) {
    actifs[bonus.id] = { bonus, fin: Date.now() + bonus.duree * 1000 };
    recalculer();
    afficherBonus();
  }

  /* ---------- La comète ---------- */
  const alea = (min, max) => min + Math.random() * (max - min);
  let enCours = false;

  function texteFlottant(texte, x, y) {
    const pop = document.createElement("span");
    pop.className = "pop"; // réutilise l'animation du "+1"
    pop.textContent = texte;
    pop.style.left = x + "px";
    pop.style.top = y + "px";
    pop.style.fontSize = "1.1rem";
    pop.style.whiteSpace = "nowrap";
    document.body.appendChild(pop);
    pop.addEventListener("animationend", () => pop.remove());
  }

  function lancer() {
    if (enCours) return;
    enCours = true;

    const L = window.innerWidth;
    const H = window.innerHeight;

    // Départ au-dessus de l'écran (côté droit), arrivée sous l'écran (côté gauche)
    const x0 = alea(0.35, 1.0) * L;
    const y0 = -80;
    const x1 = x0 - alea(0.3, 0.8) * L;
    const y1 = H + 80;
    // La tête est à gauche de l'élément : on le tourne dans le sens du trajet
    const angle = Math.atan2(-(y1 - y0), -(x1 - x0));

    const el = document.createElement("div");
    el.className = "comete";
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Comète : clique pour un bonus");
    document.body.appendChild(el);

    const anim = el.animate(
      [
        { transform: `translate(${x0}px, ${y0}px) rotate(${angle}rad)` },
        { transform: `translate(${x1}px, ${y1}px) rotate(${angle}rad)` }
      ],
      { duration: alea(TRAVERSEE_MIN, TRAVERSEE_MAX), easing: "linear", fill: "forwards" }
    );

    function fin() {
      el.remove();
      enCours = false;
    }

    anim.onfinish = fin;

    // pointerdown plutôt que click : la cible bouge, un clic complet pourrait la rater
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      anim.cancel();
      fin();
      const bonus = BONUS[Math.floor(Math.random() * BONUS.length)];
      activer(bonus);
      texteFlottant(`${bonus.icone} ${bonus.nom} : ${bonus.texte} pendant ${bonus.duree} s`, e.clientX, e.clientY);
    });
  }

  /* ---------- Planification ---------- */
  function planifier() {
    setTimeout(() => {
      // Pas de comète si l'onglet est caché ou si une fenêtre est ouverte
      if (!document.hidden && !document.querySelector("dialog[open]")) lancer();
      planifier();
    }, alea(DELAI_MIN, DELAI_MAX));
  }
  planifier();

  // Pour tester : tape lancerComete() dans la console du navigateur (F12)
  window.lancerComete = lancer;
})();