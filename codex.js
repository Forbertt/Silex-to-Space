/* =========================================================
   CODEX : la collection de tout ce que le joueur a découvert.
   S'appuie sur donnees.js (le contenu) et game.js (l'état).
   ========================================================= */

// Quels indices afficher sur les fiches grisées :
//   "connues" : seulement ceux qui parlent d'une ressource déjà débloquée (sans spoil)
//   "tous"    : tous les indices ; le nom d'une ressource inconnue est masqué par "???"
//   "aucun"   : jamais d'indice ("À découvrir" partout)
const MODE_INDICES = "connues";

const codex = {
  fenetre: document.getElementById("codex"),
  bouton: document.getElementById("ouvrir-codex"),
  progression: document.getElementById("codex-progression"),
  barre: document.getElementById("codex-barre-remplie"),
  contenu: document.getElementById("codex-contenu")
};

/* ---------- Textes des indices ---------- */

function trouverRessource(id) {
  return ressources.find((r) => r.id === id);
}

// Une ressource est "connue" quand son compteur est débloqué
function ressourceConnue(id) {
  return estDebloque(trouverRessource(id).debloque);
}

// Le nom d'une ressource, masqué tant qu'elle est inconnue
function nomRessource(id) {
  return ressourceConnue(id) ? trouverRessource(id).nom : "???";
}

// "Produire 100 silex (82/100)" : la condition et l'avancement du joueur.
// Renvoie null quand l'indice ne doit pas être montré (voir MODE_INDICES).
function conditionEnTexte(condition) {
  const quantite = formatEntier.format(condition.quantite);

  if (!ressourceConnue(condition.ressource)) {
    return MODE_INDICES === "tous" ? "Produire " + quantite + " ???" : null;
  }

  const actuel = Math.min(Math.floor(etat.total[condition.ressource]), condition.quantite);
  return (
    "Produire " + quantite + " " + nomRessource(condition.ressource) +
    " (" + formatEntier.format(actuel) + "/" + quantite + ")"
  );
}

// "À acheter : 50 silex"
function achatEnTexte(montant, ressource) {
  const prix = formatEntier.format(montant);

  if (!ressourceConnue(ressource)) {
    return MODE_INDICES === "tous" ? "À acheter : " + prix + " ???" : null;
  }
  return "À acheter : " + prix + " " + nomRessource(ressource);
}

/* ---------- Les rubriques ----------
   Chacune sait lister ses éléments, dire s'ils sont obtenus et
   donner un indice pour les débloquer (ou null s'il faut le cacher).
   "icone" renvoie soit un emoji, soit un chemin d'image (img/...png). */
const rubriques = [
  {
    titre: "Ressources",
    elements: ressources,
    obtenu: (r) => estDebloque(r.debloque),
    nom: (r) => r.nom.charAt(0).toUpperCase() + r.nom.slice(1),
    description: () => "Ressource",
    indice: (r) => (r.debloque ? conditionEnTexte(r.debloque) : null),
    icone: (r) => affichages[r.id].image.getAttribute("src")
  },
  {
    titre: "Évolutions",
    elements: ameliorations,
    obtenu: (a) => (etat.possedes[a.id] || 0) > 0,
    nom: (a) => a.nom,
    description: (a) => a.description,
    indice: (a) => estDebloque(a.debloque)
      ? achatEnTexte(prixActuel(a), a.cout.ressource)
      : conditionEnTexte(a.debloque),
    icone: (a) => a.icone || "🏗️"
  },
  {
    titre: "Technologies",
    elements: technologies,
    obtenu: (t) => etat.technologies.includes(t.id),
    nom: (t) => t.nom,
    description: (t) => t.description,
    indice: (t) => estDebloque(t.debloque)
      ? achatEnTexte(t.cout.prix, t.cout.ressource)
      : conditionEnTexte(t.debloque),
    icone: (t) => t.icone || "💡"
  },
  {
    titre: "Découvertes",
    elements: paliers,
    obtenu: (p) => etat.paliersVus.includes(p.id),
    nom: (p) => p.titre,
    description: () => "Relire la découverte",
    indice: (p) => conditionEnTexte({ ressource: p.ressource, quantite: p.seuil }),
    icone: (p) => p.icone || "📖",
    auClic: (p) => ouvrirDecouverte(p)   // rouvre le pop-up Wikipédia
  }
];

/* ---------- Construction (une seule fois) ---------- */

function remplirIcone(conteneur, valeur) {
  conteneur.textContent = "";
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(valeur)) {
    const image = document.createElement("img");
    image.src = valeur;
    image.alt = "";
    image.draggable = false;
    conteneur.appendChild(image);
  } else {
    conteneur.textContent = valeur;
  }
}

function creerFiche(rubrique, element) {
  const noeud = document.createElement("div");
  noeud.className = "fiche verrouillee";
  noeud.innerHTML = `
    <div class="fiche-icone"></div>
    <strong class="fiche-nom"></strong>
    <small class="fiche-description"></small>
  `;

  if (rubrique.auClic) {
    noeud.addEventListener("click", () => {
      if (noeud.classList.contains("obtenue")) rubrique.auClic(element);
    });
  }

  return {
    element,
    noeud,
    icone: noeud.querySelector(".fiche-icone"),
    nom: noeud.querySelector(".fiche-nom"),
    description: noeud.querySelector(".fiche-description"),
    obtenue: null   // pas encore calculé
  };
}

function construireCodex() {
  for (const rubrique of rubriques) {
    const section = document.createElement("section");
    section.className = "codex-rubrique";

    const titre = document.createElement("h3");
    titre.textContent = rubrique.titre;
    rubrique.compte = document.createElement("span");
    rubrique.compte.className = "codex-compte";
    titre.appendChild(rubrique.compte);

    const grille = document.createElement("div");
    grille.className = "codex-grille";

    rubrique.fiches = rubrique.elements.map((element) => {
      const fiche = creerFiche(rubrique, element);
      grille.appendChild(fiche.noeud);
      return fiche;
    });

    section.append(titre, grille);
    codex.contenu.appendChild(section);
  }
}

/* ---------- Mise à jour ---------- */

// Met à jour une fiche. Renvoie true si elle est obtenue.
function mettreAJourFiche(rubrique, fiche) {
  const obtenue = rubrique.obtenu(fiche.element);

  // Le grand changement (grisé <-> obtenu) n'est fait que s'il y a un changement
  if (obtenue !== fiche.obtenue) {
    fiche.obtenue = obtenue;
    fiche.noeud.classList.toggle("obtenue", obtenue);
    fiche.noeud.classList.toggle("verrouillee", !obtenue);
    fiche.noeud.classList.toggle("cliquable-fiche", obtenue && Boolean(rubrique.auClic));
    fiche.nom.textContent = obtenue ? rubrique.nom(fiche.element) : "???";
    remplirIcone(fiche.icone, obtenue ? rubrique.icone(fiche.element) : "?");
  }

  // L'indice évolue avec la partie (progression, prix, ressources connues) :
  // on le recalcule à chaque fois
  let texte;
  if (obtenue) {
    texte = rubrique.description(fiche.element);
  } else {
    const indice = MODE_INDICES === "aucun" ? null : rubrique.indice(fiche.element);
    texte = indice || "À découvrir";
  }
  ecrire(fiche.description, texte);

  return obtenue;
}

function mettreAJourCodex() {
  let obtenus = 0;
  let total = 0;

  for (const rubrique of rubriques) {
    let compte = 0;
    for (const fiche of rubrique.fiches) {
      if (mettreAJourFiche(rubrique, fiche)) compte++;
    }
    ecrire(rubrique.compte, compte + " / " + rubrique.fiches.length);
    obtenus += compte;
    total += rubrique.fiches.length;
  }

  ecrire(codex.progression, obtenus + " découvertes sur " + total);
  ecrire(codex.bouton, "📖 Codex " + obtenus + "/" + total);
  codex.barre.style.width = (total > 0 ? (100 * obtenus) / total : 0) + "%";
}

/* ---------- Ouverture et fermeture ---------- */

codex.bouton.addEventListener("click", () => {
  mettreAJourCodex();
  codex.fenetre.showModal();
});

document.getElementById("codex-fermer").addEventListener("click", () => {
  codex.fenetre.close();
});

// Un clic sur le fond sombre (en dehors du contenu) ferme aussi le Codex
codex.fenetre.addEventListener("click", (e) => {
  if (e.target === codex.fenetre) codex.fenetre.close();
});

construireCodex();
mettreAJourCodex();
setInterval(mettreAJourCodex, 500);   // garde le bouton et les fiches à jour