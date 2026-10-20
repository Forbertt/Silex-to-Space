/* =========================================================
   LOGIQUE DU JEU
   Les données (ressources, paliers, bâtiments, technologies)
   se trouvent dans donnees.js, chargé avant ce fichier.
   ========================================================= */

/* ---------- Réglages ---------- */

const INTERVALLE_JEU = 100;          // ms entre deux mises à jour du jeu
const INTERVALLE_SAUVEGARDE = 2000;  // ms entre deux sauvegardes
const BONUS_PAR_SUCCES = 0.01;       // chaque succès débloqué : +1 % de production
const bonusComete = { production: 1, clic: 1 }; // modifié par comete.js
// Créés une seule fois : beaucoup plus rapide que toLocaleString() à chaque appel
const formatEntier = new Intl.NumberFormat("fr-FR");
const formatDecimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/* ---------- État et sauvegarde ---------- */

// Si la sauvegarde date de l'ancienne version (sans "stock"), on repart de zéro
function chargerSauvegarde() {
  try {
    const brute = JSON.parse(localStorage.getItem("sauvegarde"));
    return brute && brute.stock ? brute : {};
  } catch (erreur) {
    return {};
  }
}

const sauvegarde = chargerSauvegarde();
// Un compteur à zéro pour chaque ressource déclarée dans donnees.js
const zeros = Object.fromEntries(ressources.map((r) => [r.id, 0]));

const etat = {
  stock: { ...zeros, ...sauvegarde.stock },   // ce que le joueur possède
  total: { ...zeros, ...sauvegarde.total },   // tout ce qui a été produit
  paliersVus: sauvegarde.paliersVus || [],
  possedes: sauvegarde.possedes || {},                   // { apprenti: 2, ... }
  technologies: sauvegarde.technologies || [],           // ids des technologies acquises
  ongletsVus: sauvegarde.ongletsVus || ["silex"],        // onglets déjà visités
  succes: sauvegarde.succes || [],                       // ids des succès débloqués
  stats: sauvegarde.stats || {}                          // compteurs utilisés par les succès
};

let enReinitialisation = false;
let ongletActif = "silex";

function sauvegarder() {
  if (enReinitialisation) return;
  localStorage.setItem("sauvegarde", JSON.stringify(etat));
}

/* ---------- Calculs ---------- */

function estDebloque(condition) {
  return !condition || etat.total[condition.ressource] >= condition.quantite;
}

function prixActuel(amelioration) {
  const nombre = etat.possedes[amelioration.id] || 0;
  const croissance = amelioration.cout.croissance ?? CROISSANCE_PAR_DEFAUT;
  return Math.ceil(amelioration.cout.base * Math.pow(croissance, nombre));
}

// Un seul passage : production par seconde et multiplicateur de chaque ressource
function calculer() {
  const production = {};
  const multiplicateur = {};
  for (const r of ressources) {
    production[r.id] = 0;
    multiplicateur[r.id] = 1 + BONUS_PAR_SUCCES * etat.succes.length;   // bonus des succès
  }

  for (const t of technologies) {
    if (etat.technologies.includes(t.id)) {
      multiplicateur[t.effet.ressource] *= t.effet.facteur;
    }
  }
  for (const a of ameliorations) {
    production[a.produit] += (etat.possedes[a.id] || 0) * a.production;
  }
  for (const r of ressources) {
    production[r.id] *= multiplicateur[r.id] * bonusComete.production;
  }

  return { production, multiplicateur };
}

function acheterAmelioration(amelioration) {
  const prix = prixActuel(amelioration);
  if (etat.stock[amelioration.cout.ressource] < prix) return;
  etat.stock[amelioration.cout.ressource] -= prix;
  etat.possedes[amelioration.id] = (etat.possedes[amelioration.id] || 0) + 1;
  sauvegarder();
  rafraichir();
}

function acheterTechnologie(technologie) {
  if (etat.technologies.includes(technologie.id)) return;
  if (etat.stock[technologie.cout.ressource] < technologie.cout.prix) return;
  etat.stock[technologie.cout.ressource] -= technologie.cout.prix;
  etat.technologies.push(technologie.id);
  sauvegarder();
  rafraichir();
}

/* ---------- Éléments de la page ---------- */

const boutique = document.getElementById("boutique");
const titreTechnologies = document.getElementById("titre-technologies");
const barreOnglets = document.getElementById("onglets");

const popup = {
  fenetre: document.getElementById("decouverte"),
  titre: document.getElementById("decouverte-titre"),
  texte: document.getElementById("decouverte-texte"),
  bonus: document.getElementById("decouverte-bonus"),
  lien: document.getElementById("decouverte-lien"),
  image: document.getElementById("decouverte-image"),
  fermer: document.getElementById("decouverte-fermer")
};

// Les éléments d'affichage de chaque ressource, récupérés une seule fois
const affichages = {};
for (const r of ressources) {
  affichages[r.id] = {
    bloc: document.getElementById("score-" + r.id),
    compteur: document.getElementById("compteur-" + r.id),
    production: document.getElementById("production-" + r.id),
    onglet: document.querySelector('[data-onglet="' + r.id + '"]'),
    zone: document.getElementById("zone-" + r.id),
    image: document.getElementById("clic-" + r.id)
  };
}

// N'écrit dans la page que si le texte change (évite des repeints inutiles)
function ecrire(element, texte) {
  if (element.textContent !== texte) element.textContent = texte;
}

// Crée une ligne (bâtiment ou technologie) dans une liste
function creerLigne(idListe, element, auClic) {
  const ligne = document.createElement("div");
  ligne.className = "evolution";
  ligne.hidden = true;
  ligne.innerHTML = `
    <div class="evolution-infos">
      <strong>${element.nom}</strong><span class="possedes"></span>
      <small>${element.description}</small>
      <small class="rendement"></small>
    </div>
    <button class="acheter"><span class="cout"></span></button>
  `;
  document.getElementById(idListe).appendChild(ligne);

  const bouton = ligne.querySelector(".acheter");
  bouton.addEventListener("click", auClic);

  return {
    ligne,
    bouton,
    possedes: ligne.querySelector(".possedes"),
    rendement: ligne.querySelector(".rendement"),
    cout: ligne.querySelector(".cout")
  };
}

const interfacesAmeliorations = {};
for (const a of ameliorations) {
  interfacesAmeliorations[a.id] = creerLigne("liste-evolutions", a, () => acheterAmelioration(a));
}

const interfacesTechnologies = {};
for (const t of technologies) {
  interfacesTechnologies[t.id] = creerLigne("liste-technologies", t, () => acheterTechnologie(t));
}

/* ---------- Affichage ---------- */

// Affiche la zone de clic d'une ressource et cache les autres
function afficherOnglet(id) {
  ongletActif = id;
  for (const r of ressources) {
    affichages[r.id].zone.hidden = r.id !== id;
    affichages[r.id].onglet.classList.toggle("actif", r.id === id);
  }
  if (!etat.ongletsVus.includes(id)) {
    etat.ongletsVus.push(id);
    sauvegarder();
  }
  rafraichir();
}

function rafraichir() {
  const { production, multiplicateur } = calculer();

  // Compteurs et onglets
  let ressourcesDebloquees = 0;
  for (const r of ressources) {
    const ui = affichages[r.id];
    const debloque = estDebloque(r.debloque);
    if (debloque) ressourcesDebloquees++;

    ui.bloc.hidden = !debloque;
    ui.onglet.hidden = !debloque;
    ui.onglet.classList.toggle("nouveau", debloque && !etat.ongletsVus.includes(r.id));
    ecrire(ui.compteur, formatEntier.format(Math.floor(etat.stock[r.id])));
    ecrire(
      ui.production,
      production[r.id] > 0
        ? formatDecimal.format(production[r.id]) + " " + r.nom + " / seconde"
        : ""
    );
  }
  // La barre d'onglets n'apparaît que quand il y a plusieurs ressources
  barreOnglets.hidden = ressourcesDebloquees < 2;

  // Bâtiments : seuls ceux de l'onglet actif sont affichés
  let evolutionVisible = false;
  for (const a of ameliorations) {
    const ui = interfacesAmeliorations[a.id];
    const visible = a.produit === ongletActif && estDebloque(a.debloque);
    ui.ligne.hidden = !visible;
    if (!visible) continue;
    evolutionVisible = true;

    const nombre = etat.possedes[a.id] || 0;
    const unitaire = a.production * multiplicateur[a.produit];
    const prix = prixActuel(a);

    ecrire(ui.possedes, nombre > 0 ? "×" + nombre : "");
    ecrire(ui.rendement, formatDecimal.format(unitaire) + " " + a.produit + " / s chacun");
    ecrire(ui.cout, formatEntier.format(prix) + " " + a.cout.ressource);
    ui.bouton.disabled = etat.stock[a.cout.ressource] < prix;
  }

  // Technologies : affichées dans l'onglet de la ressource qui sert à les payer
  let technologieVisible = false;
  for (const t of technologies) {
    const ui = interfacesTechnologies[t.id];
    const acquise = etat.technologies.includes(t.id);
    const visible = t.cout.ressource === ongletActif && (acquise || estDebloque(t.debloque));
    ui.ligne.hidden = !visible;
    if (!visible) continue;
    technologieVisible = true;

    ecrire(
      ui.cout,
      acquise ? "Acquis ✓" : formatEntier.format(t.cout.prix) + " " + t.cout.ressource
    );
    ui.bouton.disabled = acquise || etat.stock[t.cout.ressource] < t.cout.prix;
  }

  titreTechnologies.hidden = !technologieVisible;
  boutique.hidden = !(evolutionVisible || technologieVisible);
}

function montrerPlusUn(x, y, valeur = 1) {
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = "+" + formatEntier.format(valeur);
  pop.style.left = x + "px";
  pop.style.top = y + "px";
  document.body.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}

/* ---------- Pop-up de découverte (API Wikipédia) ---------- */

function urlArticle(article) {
  return "https://fr.wikipedia.org/wiki/" + encodeURIComponent(article.replace(/ /g, "_"));
}

// Garde le début du texte, coupé proprement à la fin d'une phrase
function raccourcir(texte, max = 300) {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max);
  const finPhrase = coupe.lastIndexOf(". ");
  return finPhrase > 100 ? coupe.slice(0, finPhrase + 1) : coupe.trimEnd() + "…";
}

async function ouvrirDecouverte(palier) {
  // On ouvre tout de suite avec le contenu de secours, puis on le remplace
  popup.titre.textContent = palier.titre;
  popup.texte.textContent = "Chargement…";
  popup.lien.href = urlArticle(palier.article);
  popup.image.hidden = true;
  popup.bonus.hidden = !palier.bonus;
  popup.bonus.textContent = palier.bonus || "";
  popup.fenetre.showModal();

  try {
    const adresse = "https://fr.wikipedia.org/api/rest_v1/page/summary/" +
      encodeURIComponent(palier.article);
    const reponse = await fetch(adresse);
    if (!reponse.ok) throw new Error("Erreur " + reponse.status);
    const donnees = await reponse.json();

    popup.titre.textContent = donnees.title;
    popup.texte.textContent = raccourcir(donnees.extract);
    popup.lien.href = donnees.content_urls.desktop.page;

    if (donnees.thumbnail) {
      popup.image.src = donnees.thumbnail.source;
      popup.image.alt = donnees.title;
      popup.image.hidden = false;
    }
  } catch (erreur) {
    console.warn("Wikipédia indisponible, texte de secours utilisé.", erreur);
    popup.texte.textContent = palier.texte;
  }
}

function verifierPaliers() {
  if (popup.fenetre.open) return;   // un pop-up à la fois
  for (const palier of paliers) {
    const atteint = etat.total[palier.ressource] >= palier.seuil;
    if (atteint && !etat.paliersVus.includes(palier.id)) {
      etat.paliersVus.push(palier.id);
      sauvegarder();
      ouvrirDecouverte(palier);
      break;
    }
  }
}

popup.fermer.addEventListener("click", () => popup.fenetre.close());

/* ---------- Boucle de jeu ---------- */

for (const r of ressources) {
  // Un clic sur l'image d'une ressource en produit 1.
  // Pas de sauvegarde ici : elle se fait toutes les 2 secondes (voir plus bas).
  affichages[r.id].image.addEventListener("click", (e) => {
    etat.stock[r.id] += bonusComete.clic;
    etat.total[r.id] += bonusComete.clic;
    rafraichir();
    montrerPlusUn(e.clientX, e.clientY, bonusComete.clic);
    verifierPaliers();
  });

  affichages[r.id].onglet.addEventListener("click", () => afficherOnglet(r.id));
}

// Production automatique : on mesure le temps réellement écoulé,
// pour rester juste même si l'onglet du navigateur est en arrière-plan.
let dernierTick = performance.now();
setInterval(() => {
  const maintenant = performance.now();
  const secondes = (maintenant - dernierTick) / 1000;
  dernierTick = maintenant;

  const { production } = calculer();
  for (const r of ressources) {
    const gain = production[r.id] * secondes;
    if (gain > 0) {
      etat.stock[r.id] += gain;
      etat.total[r.id] += gain;
    }
  }
  rafraichir();
  verifierPaliers();
}, INTERVALLE_JEU);

/* ---------- Sauvegarde et réinitialisation ---------- */

setInterval(sauvegarder, INTERVALLE_SAUVEGARDE);
window.addEventListener("pagehide", sauvegarder);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) sauvegarder();
});

// Le "?." évite une erreur si le bouton de réinitialisation n'existe pas
document.getElementById("reset")?.addEventListener("click", () => {
  if (confirm("Effacer toute la progression ?")) {
    enReinitialisation = true;
    localStorage.clear();
    location.reload();
  }
});

afficherOnglet("silex");