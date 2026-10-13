/* =========================================================
   MONUMENTS : constructions uniques, payées avec plusieurs
   ressources à la fois, qui donnent un gros bonus de production.
   - Les données sont dans donnees.js (tableau "monuments").
   - Le bonus est appliqué par calculer() dans game.js.
   - Ce fichier gère la fenêtre, l'achat et le pop-up Wikipédia.
   À charger après game.js (et après codex.js / succes.js).
   ========================================================= */

// Multiplicateur global des prix :
// 1 = prix de donnees.js, 0.5 = moitié moins cher, 2 = deux fois plus cher
const FACTEUR_PRIX_MONUMENTS = 1;

const ecranMonuments = {
  fenetre: document.getElementById("monuments"),
  bouton: document.getElementById("ouvrir-monuments"),
  progression: document.getElementById("monuments-progression"),
  contenu: document.getElementById("monuments-contenu")
};

// Par sécurité : la liste des monuments construits existe toujours
etat.monuments = etat.monuments || sauvegarde.monuments || [];

/* ---------- Petits outils ---------- */

function nomDeRessource(id) {
  const ressource = ressources.find((r) => r.id === id);
  const nom = ressource ? ressource.nom : id;
  return nom.charAt(0).toUpperCase() + nom.slice(1);
}

// [unité, à partir de, suffixe]
const UNITES_NOMBRES = [[1e9, 1e9, " Md"], [1e6, 1e6, " M"], [1e3, 1e4, " k"]];

// 1 234 567 -> "1,2 M" (arrondi vers le bas : jamais "complet" avant l'heure)
function nombreCourt(n) {
  n = Math.floor(n);
  for (const [unite, minimum, suffixe] of UNITES_NOMBRES) {
    if (n >= minimum) return formatDecimal.format(Math.floor(n / (unite / 10)) / 10) + suffixe;
  }
  return formatEntier.format(n);
}

// "Toute la production ×2" ou "Production de silex ×1,5"
function effetEnTexte(monument) {
  const { ressource, facteur } = monument.effet;
  const cible = ressource === "toutes"
    ? "Toute la production"
    : "Production de " + nomDeRessource(ressource).toLowerCase();
  return cible + " ×" + formatDecimal.format(facteur);
}

function prixMonument(monument, ressource) {
  return Math.ceil(monument.cout[ressource] * FACTEUR_PRIX_MONUMENTS);
}

function estConstruit(monument) {
  return etat.monuments.includes(monument.id);
}

function monumentVisible(monument) {
  return estConstruit(monument) || estDebloque(monument.debloque);
}

function monumentFinancable(monument) {
  return Object.keys(monument.cout).every((r) => etat.stock[r] >= prixMonument(monument, r));
}

// L'objet attendu par ouvrirDecouverte() (game.js) : le même format que les paliers
function decouverteDe(monument) {
  return {
    titre: monument.titre || monument.nom,
    article: monument.article,
    texte: monument.texte,
    bonus: "Monument construit ! " + effetEnTexte(monument)
  };
}

/* ---------- Le bonus de production ----------
   On "enveloppe" calculer() de game.js : on lui laisse faire son calcul habituel
   (bâtiments, technologies, succès), puis on multiplie par les monuments construits.
   Comme ça, game.js n'a pas besoin d'être modifié. */

const calculerSansMonuments = calculer;

calculer = function () {
  const resultat = calculerSansMonuments();
  for (const monument of monuments) {
    if (!estConstruit(monument)) continue;
    const { ressource, facteur } = monument.effet;
    for (const r of ressources) {
      if (ressource !== "toutes" && ressource !== r.id) continue;
      resultat.multiplicateur[r.id] *= facteur;
      resultat.production[r.id] *= facteur;
    }
  }
  return resultat;
};

/* ---------- Construction d'un monument ---------- */

function construireMonument(monument) {
  if (estConstruit(monument) || !monumentFinancable(monument)) return;

  for (const ressource of Object.keys(monument.cout)) {
    etat.stock[ressource] -= prixMonument(monument, ressource);
  }
  etat.monuments.push(monument.id);

  sauvegarder();
  rafraichir();               // met à jour compteurs, production et boutique (game.js)
  mettreAJourMonuments();
  ouvrirDecouverte(decouverteDe(monument));   // le pop-up Wikipédia
}

/* ---------- La fenêtre : une carte par monument (créées une seule fois) ---------- */

function creerCarteMonument(monument) {
  const noeud = document.createElement("article");
  noeud.className = "monument verrouille";
  noeud.innerHTML = `
    <div class="monument-icone"></div>
    <div class="monument-corps">
      <strong class="monument-nom"></strong>
      <span class="monument-effet"></span>
      <ul class="monument-couts"></ul>
    </div>
    <div class="monument-action">
      <button class="acheter monument-bouton">Construire</button>
      <span class="monument-statut">Construit ✓</span>
    </div>
  `;

  // Une ligne par ressource du coût : nom, barre de progression, "possédé / prix"
  const listeCouts = noeud.querySelector(".monument-couts");
  const couts = Object.keys(monument.cout).map((ressource) => {
    const ligne = document.createElement("li");
    ligne.className = "cout-ligne";
    ligne.dataset.ressource = ressource;
    ligne.innerHTML = `
      <span class="cout-nom"></span>
      <span class="cout-barre"><span></span></span>
      <span class="cout-valeur"></span>
    `;
    listeCouts.appendChild(ligne);
    return {
      ressource,
      ligne,
      nom: ligne.querySelector(".cout-nom"),
      barre: ligne.querySelector(".cout-barre span"),
      valeur: ligne.querySelector(".cout-valeur")
    };
  });

  const carte = {
    monument,
    noeud,
    icone: noeud.querySelector(".monument-icone"),
    nom: noeud.querySelector(".monument-nom"),
    effet: noeud.querySelector(".monument-effet"),
    listeCouts,
    couts,
    bouton: noeud.querySelector(".monument-bouton"),
    statut: noeud.querySelector(".monument-statut")
  };

  carte.bouton.addEventListener("click", () => construireMonument(monument));

  // Un monument construit : un clic sur la carte rouvre sa fiche Wikipédia
  noeud.addEventListener("click", (e) => {
    if (!e.target.closest("button") && estConstruit(monument)) {
      ouvrirDecouverte(decouverteDe(monument));
    }
  });

  ecranMonuments.contenu.appendChild(noeud);
  return carte;
}

const cartesMonuments = monuments.map(creerCarteMonument);

/* ---------- Mise à jour ---------- */

function mettreAJourMonuments() {
  let visibles = 0;
  let construits = 0;
  let prets = 0;

  for (const carte of cartesMonuments) {
    const monument = carte.monument;
    const construit = estConstruit(monument);
    const visible = monumentVisible(monument);
    const pret = visible && !construit && monumentFinancable(monument);

    if (visible) visibles++;
    if (construit) construits++;
    if (pret) prets++;

    carte.noeud.classList.toggle("verrouille", !visible);
    carte.noeud.classList.toggle("disponible", visible && !construit);
    carte.noeud.classList.toggle("pret", pret);
    carte.noeud.classList.toggle("construit", construit);

    ecrire(carte.icone, visible ? (monument.icone || "🏛️") : "?");
    ecrire(carte.nom, visible ? monument.nom : "???");
    ecrire(carte.effet, visible ? effetEnTexte(monument) : "À découvrir en progressant");

    carte.listeCouts.hidden = !visible || construit;
    carte.bouton.hidden = !visible || construit;
    carte.statut.hidden = !construit;
    carte.bouton.disabled = !pret;

    if (visible && !construit) {
      for (const cout of carte.couts) {
        const prix = prixMonument(monument, cout.ressource);
        const possede = etat.stock[cout.ressource];
        ecrire(cout.nom, nomDeRessource(cout.ressource));
        ecrire(cout.valeur, nombreCourt(possede) + " / " + nombreCourt(prix));
        cout.barre.style.width = Math.min(100, (100 * possede) / prix) + "%";
        cout.ligne.classList.toggle("ok", possede >= prix);
      }
    }
  }

  const total = cartesMonuments.length;
  const pluriel = construits > 1 ? "s" : "";
  ecrire(ecranMonuments.progression, construits + " monument" + pluriel + " construit" + pluriel + " sur " + total);

  // Le bouton du pied de page : caché tant qu'aucun monument n'est visible,
  // il pulse tant qu'on ne l'a pas ouvert, puis quand un monument est payable
  const bouton = ecranMonuments.bouton;
  bouton.hidden = visibles === 0;
  ecrire(bouton, "🏛️ Monuments " + construits + "/" + total);
  const nouveau = visibles > 0 && !etat.ongletsVus.includes("monuments");
  bouton.classList.toggle("attention", nouveau || prets > 0);
}

/* ---------- Ouverture et fermeture ---------- */

ecranMonuments.bouton.addEventListener("click", () => {
  if (!etat.ongletsVus.includes("monuments")) {
    etat.ongletsVus.push("monuments");
    sauvegarder();
  }
  mettreAJourMonuments();
  ecranMonuments.fenetre.showModal();
});

document.getElementById("monuments-fermer").addEventListener("click", () => {
  ecranMonuments.fenetre.close();
});

// Un clic sur le fond sombre (en dehors du contenu) ferme aussi la fenêtre
ecranMonuments.fenetre.addEventListener("click", (e) => {
  if (e.target === ecranMonuments.fenetre) ecranMonuments.fenetre.close();
});

mettreAJourMonuments();
rafraichir();   // reprend les monuments déjà construits dans la production affichée
setInterval(mettreAJourMonuments, 500);   // garde le bouton et les barres à jour
