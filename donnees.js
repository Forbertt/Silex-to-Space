/* =========================================================
   DONNÉES DU JEU
   Le seul fichier à modifier pour équilibrer le jeu ou
   ajouter du contenu (nouvelle ressource, bâtiment, etc.).
   "icone" (facultatif) = l'emoji affiché dans le Codex.
   ========================================================= */

// Hausse de prix à chaque exemplaire acheté (+15 %).
// Un bâtiment peut la remplacer : cout: { ressource: "silex", base: 50, croissance: 1.2 }
const CROISSANCE_PAR_DEFAUT = 1.15;

// Les ressources. "debloque" = condition pour afficher le compteur et l'onglet.
const ressources = [
  { id: "silex", nom: "silex" },
  { id: "bronze", nom: "bronze", debloque: { ressource: "silex", quantite: 200000 } },
  { id: "fer", nom: "fer", debloque: { ressource: "bronze", quantite: 25000 } }
];

// Découvertes Wikipédia, déclenchées par le total produit d'une ressource.
// "article" = titre exact de la page Wikipédia (le lien de secours s'en déduit) ;
// "texte" s'affiche si l'API ne répond pas ; "bonus" = ligne d'annonce (facultative).
const paliers = [
  // --- Silex ---
  {
    id: "silex-100", ressource: "silex", seuil: 100,
    titre: "Le silex",
    article: "Silex",
    texte: "Roche très dure qui se casse en bords tranchants : c'était l'outil préféré des premiers humains.",
    bonus: "Évolution débloquée : l'Apprenti tailleur, un auto-clicker lent !"
  },
  {
    id: "silex-300", ressource: "silex", seuil: 300,
    titre: "Chasseur-cueilleur",
    article: "Chasseur-cueilleur",
    texte: "Pendant des centaines de milliers d'années, les humains ont vécu de chasse et de cueillette, avec des outils de pierre.",
    bonus: "Évolution débloquée : le Chasseur de la tribu !"
  },
  {
    id: "silex-1000", ressource: "silex", seuil: 1000,
    titre: "La maîtrise du feu",
    article: "Maîtrise du feu",
    texte: "Le feu permet de se chauffer, de cuire les aliments et même de rendre certaines pierres plus faciles à tailler.",
    bonus: "Évolution débloquée : le Foyer de chauffe !"
  },
  {
    id: "silex-5000", ressource: "silex", seuil: 5000,
    titre: "La taille de la pierre",
    article: "Taille de la pierre",
    texte: "Tailler la pierre consiste à la façonner par éclats successifs pour obtenir des outils et des armes.",
    bonus: "Évolution débloquée : l'Atelier de la tribu !"
  },
  {
    id: "silex-20000", ressource: "silex", seuil: 20000,
    titre: "Les mines de silex",
    article: "Mine de silex",
    texte: "Au Néolithique, des groupes creusaient de véritables mines pour extraire le meilleur silex.",
    bonus: "Évolution débloquée : la Mine de silex !"
  },
  {
    id: "silex-100000", ressource: "silex", seuil: 100000,
    titre: "Le troc",
    article: "Troc",
    texte: "Bien avant la monnaie, les groupes échangeaient directement des biens, comme les outils et les matières premières.",
    bonus: "Évolution débloquée : le Comptoir d'échange !"
  },
  {
    id: "silex-200000", ressource: "silex", seuil: 200000,
    titre: "L'âge du bronze",
    article: "Âge du bronze",
    texte: "En mélangeant du cuivre et de l'étain, les humains inventent le bronze, un métal bien plus solide que la pierre.",
    bonus: "Nouvelle ressource débloquée : le bronze ! Un nouvel onglet est apparu. La Grande fonderie t'y attend."
  },

  // --- Bronze ---
  {
    id: "bronze-10", ressource: "bronze", seuil: 10,
    titre: "Le cuivre",
    article: "Cuivre",
    texte: "Le cuivre est l'un des premiers métaux travaillés par les humains. Mélangé à de l'étain, il donne le bronze.",
    bonus: "Évolution débloquée : l'Apprenti fondeur !"
  },
  {
    id: "bronze-100", ressource: "bronze", seuil: 100,
    titre: "Le forgeron",
    article: "Forgeron",
    texte: "Le forgeron travaille le métal chauffé au feu pour fabriquer des outils, des armes et des objets du quotidien.",
    bonus: "Évolution débloquée : la Forge !"
  },
  {
    id: "bronze-500", ressource: "bronze", seuil: 500,
    titre: "La fonderie",
    article: "Fonderie",
    texte: "Une fonderie fait fondre le métal pour le couler dans des moules et lui donner sa forme.",
    bonus: "Évolution débloquée : l'Atelier de forgerons !"
  },
  {
    id: "bronze-25000", ressource: "bronze", seuil: 25000,
    titre: "L'âge du fer",
    article: "Âge du fer",
    texte: "Plus abondant que le cuivre et l'étain, le fer remplace peu à peu le bronze pour fabriquer outils et armes.",
    bonus: "Nouvelle ressource débloquée : le fer ! Un nouvel onglet est apparu. L'Armurerie t'y attend."
  },

  // --- Fer ---
  {
    id: "fer-10", ressource: "fer", seuil: 10,
    titre: "La sidérurgie",
    article: "Sidérurgie",
    texte: "La sidérurgie regroupe les techniques qui permettent de produire du fer et de l'acier à partir du minerai.",
    bonus: "Évolution débloquée : l'Apprenti sidérurgiste !"
  },
  {
    id: "fer-100", ressource: "fer", seuil: 100,
    titre: "Le bas fourneau",
    article: "Bas fourneau",
    texte: "Le bas fourneau est un four d'argile qui chauffe le minerai de fer sans le faire fondre complètement.",
    bonus: "Évolution débloquée : le Bas fourneau !"
  },
  {
    id: "fer-500", ressource: "fer", seuil: 500,
    titre: "Le haut fourneau",
    article: "Haut fourneau",
    texte: "Bien plus grand qu'un bas fourneau, le haut fourneau fait fondre le fer et produit en continu.",
    bonus: "Évolution débloquée : le Haut fourneau !"
  }
];

// Bâtiments : achetables plusieurs fois, ils produisent une ressource en continu.
// "cout.ressource" = ce qu'il faut dépenser ; "produit" = ce qu'ils produisent
// (c'est aussi l'onglet dans lequel ils s'affichent).
const ameliorations = [
  // --- Onglet silex ---
  {
    id: "apprenti", nom: "Apprenti tailleur", icone: "🔨",
    description: "Un auto-clicker lent, mais fidèle",
    debloque: { ressource: "silex", quantite: 100 },
    cout: { ressource: "silex", base: 50 },
    produit: "silex", production: 0.5
  },
  {
    id: "chasseur", nom: "Chasseur de la tribu", icone: "🏹",
    description: "Taille des pointes de lance",
    debloque: { ressource: "silex", quantite: 300 },
    cout: { ressource: "silex", base: 250 },
    produit: "silex", production: 2
  },
  {
    id: "foyer", nom: "Foyer de chauffe", icone: "🔥",
    description: "Le feu rend la taille plus facile",
    debloque: { ressource: "silex", quantite: 1000 },
    cout: { ressource: "silex", base: 1000 },
    produit: "silex", production: 8
  },
  {
    id: "atelier", nom: "Atelier de la tribu", icone: "🛖",
    description: "Plusieurs tailleurs au travail",
    debloque: { ressource: "silex", quantite: 5000 },
    cout: { ressource: "silex", base: 5000 },
    produit: "silex", production: 35
  },
  {
    id: "mine", nom: "Mine de silex", icone: "⛏️",
    description: "Du silex de qualité en abondance",
    debloque: { ressource: "silex", quantite: 20000 },
    cout: { ressource: "silex", base: 25000 },
    produit: "silex", production: 150
  },
  {
    id: "comptoir", nom: "Comptoir d'échange", icone: "🤝",
    description: "Le troc avec les tribus voisines",
    debloque: { ressource: "silex", quantite: 100000 },
    cout: { ressource: "silex", base: 150000 },
    produit: "silex", production: 800
  },

  // --- Onglet bronze ---
  {
    id: "apprenti-fondeur", nom: "Apprenti fondeur", icone: "🏺",
    description: "Un auto-clicker lent pour le bronze",
    debloque: { ressource: "bronze", quantite: 10 },
    cout: { ressource: "bronze", base: 15 },
    produit: "bronze", production: 0.5
  },
  {
    id: "forge", nom: "Forge", icone: "⚒️",
    description: "Des forgerons qui produisent le bronze en série",
    debloque: { ressource: "bronze", quantite: 100 },
    cout: { ressource: "bronze", base: 150 },
    produit: "bronze", production: 3
  },
  {
    id: "atelier-forgerons", nom: "Atelier de forgerons", icone: "🛠️",
    description: "Plusieurs forges travaillent ensemble",
    debloque: { ressource: "bronze", quantite: 500 },
    cout: { ressource: "bronze", base: 1000 },
    produit: "bronze", production: 15
  },
  {
    id: "grande-fonderie", nom: "Grande fonderie", icone: "🏭",
    description: "Les silex alimentent les fours : du bronze en continu",
    debloque: { ressource: "silex", quantite: 200000 },
    cout: { ressource: "silex", base: 250000 },
    produit: "bronze", production: 10
  },

  // --- Onglet fer ---
  {
    id: "apprenti-siderurgiste", nom: "Apprenti sidérurgiste", icone: "🔩",
    description: "Un auto-clicker lent pour le fer",
    debloque: { ressource: "fer", quantite: 10 },
    cout: { ressource: "fer", base: 20 },
    produit: "fer", production: 0.5
  },
  {
    id: "bas-fourneau", nom: "Bas fourneau", icone: "♨️",
    description: "Un four d'argile qui transforme le minerai",
    debloque: { ressource: "fer", quantite: 100 },
    cout: { ressource: "fer", base: 200 },
    produit: "fer", production: 3
  },
  {
    id: "haut-fourneau", nom: "Haut fourneau", icone: "🏗️",
    description: "Une production de fer à grande échelle",
    debloque: { ressource: "fer", quantite: 500 },
    cout: { ressource: "fer", base: 1500 },
    produit: "fer", production: 15
  },
  {
    id: "armurerie", nom: "Armurerie", icone: "🛡️",
    description: "Le bronze finance l'outillage : du fer en continu",
    debloque: { ressource: "bronze", quantite: 25000 },
    cout: { ressource: "bronze", base: 30000 },
    produit: "fer", production: 10
  }
];

// Technologies : achat unique, elles multiplient la production d'une ressource.
// Elles s'affichent dans l'onglet de la ressource qui sert à les payer.
const technologies = [
  // --- Payées en bronze ---
  {
    id: "outils-bronze", nom: "Outils en bronze", icone: "🔧",
    description: "Production de silex ×2",
    debloque: { ressource: "bronze", quantite: 20 },
    cout: { ressource: "bronze", prix: 100 },
    effet: { ressource: "silex", facteur: 2 }
  },
  {
    id: "moules", nom: "Moules de fonderie", icone: "🧰",
    description: "Production de bronze ×2",
    debloque: { ressource: "bronze", quantite: 200 },
    cout: { ressource: "bronze", prix: 500 },
    effet: { ressource: "bronze", facteur: 2 }
  },
  {
    id: "haches-bronze", nom: "Haches en bronze", icone: "🪓",
    description: "Production de silex ×2 supplémentaire",
    debloque: { ressource: "bronze", quantite: 300 },
    cout: { ressource: "bronze", prix: 1000 },
    effet: { ressource: "silex", facteur: 2 }
  },

  // --- Payées en fer ---
  {
    id: "outils-fer", nom: "Outils en fer", icone: "⚙️",
    description: "Production de bronze ×2",
    debloque: { ressource: "fer", quantite: 20 },
    cout: { ressource: "fer", prix: 100 },
    effet: { ressource: "bronze", facteur: 2 }
  },
  {
    id: "soufflets", nom: "Soufflets perfectionnés", icone: "💨",
    description: "Production de fer ×2",
    debloque: { ressource: "fer", quantite: 200 },
    cout: { ressource: "fer", prix: 500 },
    effet: { ressource: "fer", facteur: 2 }
  },
  {
    id: "armes-fer", nom: "Armes en fer", icone: "⚔️",
    description: "Production de silex ×3",
    debloque: { ressource: "fer", quantite: 300 },
    cout: { ressource: "fer", prix: 1000 },
    effet: { ressource: "silex", facteur: 3 }
  }
];
/* ---------- Monuments ----------
   Constructions uniques, payées avec PLUSIEURS ressources à la fois.
   debloque : quand le monument apparaît (avant, sa fiche reste "???").
              Règle : jamais avant que toutes les ressources de son coût soient débloquées.
   cout     : { ressource: quantité, ... } : tout est dépensé d'un coup.
   effet    : { ressource: "silex" | "bronze" | "fer" | "toutes", facteur: 1.5 }
   article  : titre exact de la page Wikipédia (pop-up à la construction) ;
   texte    : résumé de secours si l'API ne répond pas. */
const monuments = [
  {
    id: "stonehenge", nom: "Stonehenge", icone: "🪨",
    debloque: { ressource: "silex", quantite: 50_000 },
    cout: { silex: 150_000 },
    effet: { ressource: "silex", facteur: 1.5 },
    article: "Stonehenge",
    texte: "Stonehenge est un monument mégalithique de cercles concentriques, édifié en plusieurs étapes entre le Néolithique et l'âge du bronze, dans le sud de l'Angleterre."
  },
  {
    id: "colosse", nom: "Colosse de Rhodes", icone: "🗿",
    debloque: { ressource: "bronze", quantite: 1_000 },
    cout: { silex: 5_000_000, bronze: 300_000 },
    effet: { ressource: "bronze", facteur: 1.5 },
    article: "Colosse de Rhodes",
    texte: "Le colosse de Rhodes était une statue monumentale en bronze du dieu Hélios, érigée au IIIe siècle avant notre ère et comptée parmi les sept merveilles du monde antique."
  },
  {
    id: "pyramide", nom: "Pyramide de Khéops", icone: "🔺",
    debloque: { ressource: "bronze", quantite: 25_000 },
    cout: { silex: 50_000_000, bronze: 1_000_000, fer: 500_000 },
    effet: { ressource: "toutes", facteur: 2 },
    article: "Pyramide de Khéops",
    texte: "La pyramide de Khéops, ou grande pyramide de Gizeh, est le tombeau présumé du pharaon Khéops. Elle fut édifiée il y a plus de 4 500 ans, sous la IVe dynastie."
  },
  {
    id: "muraille", nom: "Grande Muraille de Chine", icone: "🧱",
    debloque: { ressource: "fer", quantite: 50_000 },
    cout: { silex: 5_000_000_000, bronze: 20_000_000, fer: 10_000_000 },
    effet: { ressource: "toutes", facteur: 1.5 },
    article: "La Grande Muraille",
    texte: "La Grande Muraille est un ensemble de fortifications militaires chinoises, construites, détruites et reconstruites à plusieurs reprises pour défendre la frontière nord de la Chine."
  }
];
