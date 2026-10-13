/* =========================================================
   SUCCÈS : des objectifs à atteindre, dont des secrets pour
   ceux qui testent des choses. Chaque succès débloqué augmente
   toute la production (voir BONUS_PAR_SUCCES dans game.js).
   S'appuie sur donnees.js, game.js et codex.js.
   ========================================================= */

/* ---------- Statistiques suivies ----------
   Elles font partie de "etat" : elles sont sauvegardées avec la partie. */
etat.stats = {
  clics: 0,
  clicsTitre: 0,
  clicsFichesVerrouillees: 0,
  relectures: 0,
  ouverturesCodex: 0,
  clicsOnglets: 0,
  secondesJouees: 0,
  meilleureRafale: 0,
  hesitations: 0,
  konami: 0,
  longueAbsence: false,
  derniereVisite: 0,
  ...etat.stats
};
const stats = etat.stats;

// Absence prolongée : on compare avec la dernière visite enregistrée
if (stats.derniereVisite && Date.now() - stats.derniereVisite > 3600 * 1000) {
  stats.longueAbsence = true;
}
stats.derniereVisite = Date.now();

let sansClic = 0;   // secondes depuis le dernier clic (non sauvegardé)

/* ---------- Outils pour les conditions ---------- */

function nbBatiments() {
  return Object.values(etat.possedes).reduce((somme, n) => somme + n, 0);
}

// Les fiches du Codex obtenues (le Codex est construit par codex.js)
function compterFiches() {
  let obtenues = 0;
  let total = 0;
  for (const rubrique of rubriques) {
    for (const fiche of rubrique.fiches) {
      total++;
      if (fiche.obtenue) obtenues++;
    }
  }
  return { obtenues, total };
}

/* ---------- La liste des succès ----------
   secret   : true = nom et condition cachés tant que non débloqué
   progres  : renvoie [valeur actuelle, valeur à atteindre] (facultatif) */
const SUCCES = [
  // ----- Étapes -----
  {
    id: "premier-eclat", nom: "Premier éclat", icone: "✨",
    description: "Cliquer une première fois",
    condition: () => stats.clics >= 1
  },
  {
    id: "echauffement", nom: "Échauffement", icone: "💪",
    description: "Cliquer 100 fois",
    condition: () => stats.clics >= 100,
    progres: () => [stats.clics, 100]
  },
  {
    id: "tendinite", nom: "Tendinite", icone: "🩹",
    description: "Cliquer 1 000 fois",
    condition: () => stats.clics >= 1000,
    progres: () => [stats.clics, 1000]
  },
  {
    id: "doigts-de-pierre", nom: "Doigts de pierre", icone: "🗿",
    description: "Cliquer 10 000 fois",
    condition: () => stats.clics >= 10000,
    progres: () => [stats.clics, 10000]
  },
  {
    id: "premier-employe", nom: "Premier employé", icone: "👷",
    description: "Acheter ta première évolution",
    condition: () => nbBatiments() >= 1
  },
  {
    id: "petite-equipe", nom: "Petite équipe", icone: "👥",
    description: "Posséder 10 évolutions",
    condition: () => nbBatiments() >= 10,
    progres: () => [nbBatiments(), 10]
  },
  {
    id: "armee", nom: "Armée de tailleurs", icone: "🪖",
    description: "Posséder 50 évolutions",
    condition: () => nbBatiments() >= 50,
    progres: () => [nbBatiments(), 50]
  },
  {
    id: "millionnaire", nom: "Millionnaire de la pierre", icone: "💰",
    description: "Produire 1 000 000 de silex",
    condition: () => etat.total.silex >= 1e6,
    progres: () => [Math.floor(etat.total.silex), 1e6]
  },
  {
    id: "milliardaire", nom: "Milliardaire préhistorique", icone: "🏦",
    description: "Produire 1 000 000 000 de silex",
    condition: () => etat.total.silex >= 1e9,
    progres: () => [Math.floor(etat.total.silex), 1e9]
  },
  {
    id: "collectionneur", nom: "Collectionneur", icone: "🗃️",
    description: "Obtenir 20 fiches du Codex",
    condition: () => compterFiches().obtenues >= 20,
    progres: () => [compterFiches().obtenues, 20]
  },
  {
    id: "completiste", nom: "Complétiste", icone: "🏅",
    description: "Obtenir toutes les fiches du Codex",
    condition: () => {
      const fiches = compterFiches();
      return fiches.total > 0 && fiches.obtenues === fiches.total;
    },
    progres: () => {
      const fiches = compterFiches();
      return [fiches.obtenues, fiches.total];
    }
  },
  {
    id: "bibliothecaire", nom: "Bibliothécaire", icone: "📚",
    description: "Ouvrir le Codex 10 fois",
    condition: () => stats.ouverturesCodex >= 10,
    progres: () => [stats.ouverturesCodex, 10]
  },
  {
    id: "archeologue", nom: "Archéologue", icone: "🏺",
    description: "Relire 5 découvertes depuis le Codex",
    condition: () => stats.relectures >= 5,
    progres: () => [stats.relectures, 5]
  },
  {
    id: "toujours-la", nom: "Toujours là", icone: "⏳",
    description: "Jouer pendant 1 heure",
    condition: () => stats.secondesJouees >= 3600
  },
  {
    id: "chasseur-de-trophees", nom: "Chasseur de trophées", icone: "🏆",
    description: "Débloquer 10 succès",
    condition: () => etat.succes.length >= 10,
    progres: () => [etat.succes.length, 10]
  },

  // ----- Secrets -----
  {
    id: "chatouilles", nom: "Chatouilles", icone: "🤭", secret: true,
    description: "Cliquer 10 fois sur le titre",
    condition: () => stats.clicsTitre >= 10
  },
  {
    id: "curieux", nom: "Curieux", icone: "🔍", secret: true,
    description: "Cliquer 5 fois sur des fiches « ? » du Codex",
    condition: () => stats.clicsFichesVerrouillees >= 5
  },
  {
    id: "rafale", nom: "Doigts de fée", icone: "⚡", secret: true,
    description: "Cliquer 8 fois en une seconde",
    condition: () => stats.meilleureRafale >= 8
  },
  {
    id: "zen", nom: "Zen", icone: "🧘", secret: true,
    description: "Laisser le jeu tourner 2 minutes sans cliquer",
    condition: () => sansClic >= 120 && calculer().production.silex > 0
  },
  {
    id: "oiseau-de-nuit", nom: "Oiseau de nuit", icone: "🦉", secret: true,
    description: "Jouer entre minuit et 5 h du matin",
    condition: () => new Date().getHours() < 5 && stats.clics >= 1 && sansClic < 60
  },
  {
    id: "hesitation", nom: "Hésitation", icone: "😅", secret: true,
    description: "Cliquer sur Réinitialiser… puis annuler",
    condition: () => stats.hesitations >= 1
  },
  {
    id: "code-secret", nom: "Code secret", icone: "🎮", secret: true,
    description: "Entrer le code Konami (↑ ↑ ↓ ↓ ← → ← → B A)",
    condition: () => stats.konami >= 1
  },
  {
    id: "radin", nom: "Radin", icone: "🐷", secret: true,
    description: "Avoir 1 500 silex en poche sans rien avoir acheté",
    condition: () => nbBatiments() === 0 && etat.technologies.length === 0 && etat.stock.silex >= 1500
  },
  {
    id: "retour-de-vacances", nom: "Retour de vacances", icone: "🏖️", secret: true,
    description: "Revenir jouer après plus d'une heure d'absence",
    condition: () => stats.longueAbsence
  },
  {
    id: "globe-trotter", nom: "Globe-trotter", icone: "🧭", secret: true,
    description: "Changer d'onglet 20 fois",
    condition: () => stats.clicsOnglets >= 20
  },
  {
    id: "eureka", nom: "Eurêka !", icone: "💡", secret: true,
    description: "Acheter ta première technologie",
    condition: () => etat.technologies.length >= 1
  },
  {
    id: "erudit", nom: "Érudit", icone: "🎓", secret: true,
    description: "Acheter toutes les technologies",
    condition: () => etat.technologies.length >= technologies.length
  },
  {
    id: "age-bronze", nom: "Âge du bronze", icone: "🥉", secret: true,
    description: "Débloquer le bronze",
    condition: () => ressourceConnue("bronze")
  },
  {
    id: "age-fer", nom: "Âge du fer", icone: "⚙️", secret: true,
    description: "Débloquer le fer",
    condition: () => ressourceConnue("fer")
  }
];

/* ---------- Déblocage et notification ---------- */

let zoneToasts = null;

function afficherToast(succes) {
  if (!zoneToasts) {
    zoneToasts = document.createElement("div");
    zoneToasts.id = "toasts";
    zoneToasts.setAttribute("popover", "manual");
    document.body.appendChild(zoneToasts);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  const icone = document.createElement("span");
  icone.className = "toast-icone";
  icone.textContent = succes.icone;

  const texte = document.createElement("div");
  const titre = document.createElement("strong");
  titre.textContent = "Succès débloqué !";
  const nom = document.createElement("span");
  nom.className = "toast-nom";
  nom.textContent = succes.nom;
  const bonus = document.createElement("small");
  bonus.textContent = "+" + formatDecimal.format(BONUS_PAR_SUCCES * 100) + " % de production";
  texte.append(titre, nom, bonus);

  toast.append(icone, texte);
  zoneToasts.appendChild(toast);

  toast.addEventListener("animationend", () => {
    toast.remove();
    if (!zoneToasts.children.length) {
      try { zoneToasts.hidePopover(); } catch (erreur) { /* navigateur ancien */ }
    }
  });

  // Le conteneur passe au premier plan, au-dessus des fenêtres ouvertes (Codex, etc.)
  try {
    if (zoneToasts.matches(":popover-open")) zoneToasts.hidePopover();
    zoneToasts.showPopover();
  } catch (erreur) {
    /* navigateur ancien : l'affichage normal suffit */
  }
}

function debloquerSucces(succes) {
  etat.succes.push(succes.id);
  sauvegarder();
  afficherToast(succes);
  mettreAJourSucces();
}

function verifierSucces() {
  for (const succes of SUCCES) {
    if (!etat.succes.includes(succes.id) && succes.condition()) {
      debloquerSucces(succes);
    }
  }
}

/* ---------- La fenêtre des succès ---------- */

const interfaceSucces = {
  fenetre: document.getElementById("succes"),
  bouton: document.getElementById("ouvrir-succes"),
  progression: document.getElementById("succes-progression"),
  barre: document.getElementById("succes-barre-remplie"),
  bonus: document.getElementById("succes-bonus"),
  contenu: document.getElementById("succes-contenu")
};

const groupes = [
  { titre: "Étapes", succes: SUCCES.filter((s) => !s.secret) },
  { titre: "Secrets", succes: SUCCES.filter((s) => s.secret) }
];

function creerFicheSucces(succes) {
  const noeud = document.createElement("div");
  noeud.className = "fiche verrouillee";
  noeud.innerHTML = `
    <div class="fiche-icone"></div>
    <strong class="fiche-nom"></strong>
    <small class="fiche-description"></small>
  `;
  return {
    succes,
    noeud,
    icone: noeud.querySelector(".fiche-icone"),
    nom: noeud.querySelector(".fiche-nom"),
    description: noeud.querySelector(".fiche-description"),
    obtenu: null   // pas encore calculé
  };
}

function construireSucces() {
  for (const groupe of groupes) {
    const section = document.createElement("section");
    section.className = "codex-rubrique";

    const titre = document.createElement("h3");
    titre.textContent = groupe.titre;
    groupe.compte = document.createElement("span");
    groupe.compte.className = "codex-compte";
    titre.appendChild(groupe.compte);

    const grille = document.createElement("div");
    grille.className = "codex-grille";

    groupe.fiches = groupe.succes.map((succes) => {
      const fiche = creerFicheSucces(succes);
      grille.appendChild(fiche.noeud);
      return fiche;
    });

    section.append(titre, grille);
    interfaceSucces.contenu.appendChild(section);
  }
}

// Met à jour une fiche. Renvoie true si le succès est débloqué.
function mettreAJourFicheSucces(fiche) {
  const succes = fiche.succes;
  const obtenu = etat.succes.includes(succes.id);

  if (obtenu !== fiche.obtenu) {
    fiche.obtenu = obtenu;
    fiche.noeud.classList.toggle("obtenue", obtenu);
    fiche.noeud.classList.toggle("verrouillee", !obtenu);
    fiche.nom.textContent = obtenu || !succes.secret ? succes.nom : "???";
    fiche.icone.textContent = obtenu ? succes.icone : "?";
  }

  // Le texte évolue avec la progression : on le recalcule à chaque fois
  let texte;
  if (obtenu) {
    texte = succes.description;
  } else if (succes.secret) {
    texte = "Succès secret : à toi de tester !";
  } else {
    texte = succes.description;
    if (succes.progres) {
      const [actuel, cible] = succes.progres();
      texte += " (" + formatEntier.format(Math.min(actuel, cible)) + "/" + formatEntier.format(cible) + ")";
    }
  }
  ecrire(fiche.description, texte);

  return obtenu;
}

function mettreAJourSucces() {
  for (const groupe of groupes) {
    let compte = 0;
    for (const fiche of groupe.fiches) {
      if (mettreAJourFicheSucces(fiche)) compte++;
    }
    ecrire(groupe.compte, compte + " / " + groupe.fiches.length);
  }

  const obtenus = etat.succes.length;
  ecrire(interfaceSucces.progression, obtenus + " succès sur " + SUCCES.length);
  ecrire(interfaceSucces.bouton, "🏆 Succès " + obtenus + "/" + SUCCES.length);
  ecrire(
    interfaceSucces.bonus,
    "Bonus de succès : +" + formatDecimal.format(BONUS_PAR_SUCCES * 100 * obtenus) + " % de production"
  );
  interfaceSucces.barre.style.width = (100 * obtenus) / SUCCES.length + "%";
}

interfaceSucces.bouton.addEventListener("click", () => {
  mettreAJourSucces();
  interfaceSucces.fenetre.showModal();
});

document.getElementById("succes-fermer").addEventListener("click", () => {
  interfaceSucces.fenetre.close();
});

// Un clic sur le fond sombre (en dehors du contenu) ferme aussi la fenêtre
interfaceSucces.fenetre.addEventListener("click", (e) => {
  if (e.target === interfaceSucces.fenetre) interfaceSucces.fenetre.close();
});

/* ---------- Suivi des actions du joueur ---------- */

// Clics sur les images des ressources (avec le calcul des rafales)
const clicsRecents = [];

function noterClic() {
  const maintenant = performance.now();
  clicsRecents.push(maintenant);
  while (clicsRecents[0] < maintenant - 1000) clicsRecents.shift();

  stats.clics++;
  stats.meilleureRafale = Math.max(stats.meilleureRafale, clicsRecents.length);
  sansClic = 0;
  verifierSucces();
}

for (const r of ressources) {
  affichages[r.id].image.addEventListener("click", noterClic);
  affichages[r.id].onglet.addEventListener("click", () => {
    stats.clicsOnglets++;
    verifierSucces();
  });
}

document.querySelector(".titre").addEventListener("click", () => {
  stats.clicsTitre++;
  verifierSucces();
});

document.getElementById("ouvrir-codex").addEventListener("click", () => {
  stats.ouverturesCodex++;
  verifierSucces();
});

// Clics sur les fiches du Codex : grisées (curieux) ou cliquables (relecture)
document.getElementById("codex-contenu").addEventListener("click", (e) => {
  const fiche = e.target.closest(".fiche");
  if (!fiche) return;
  if (fiche.classList.contains("verrouillee")) stats.clicsFichesVerrouillees++;
  else if (fiche.classList.contains("cliquable-fiche")) stats.relectures++;
  verifierSucces();
});

// Le gestionnaire de game.js passe en premier : si la partie n'a pas été
// réinitialisée, c'est que le joueur a annulé.
document.getElementById("reset")?.addEventListener("click", () => {
  if (!enReinitialisation) {
    stats.hesitations++;
    verifierSucces();
  }
});

// Code Konami
const CODE_KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let touches = [];

document.addEventListener("keydown", (e) => {
  touches.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  touches = touches.slice(-CODE_KONAMI.length);
  if (touches.join() === CODE_KONAMI.join()) {
    stats.konami++;
    verifierSucces();
  }
});

/* ---------- Horloges ---------- */

setInterval(() => {
  sansClic++;
  if (!document.hidden) stats.secondesJouees++;
  stats.derniereVisite = Date.now();
}, 1000);

setInterval(() => {
  verifierSucces();
  mettreAJourSucces();
}, 500);

construireSucces();
mettreAJourSucces();
verifierSucces();