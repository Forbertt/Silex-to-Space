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
  { id: "bronze", nom: "bronze", debloque: { ressource: "silex", quantite: 100000 } },
  { id: "fer", nom: "fer", debloque: { ressource: "bronze", quantite: 25000 } },
  { id: "acier", nom: "acier", debloque: { ressource: "fer", quantite: 20000 } },
  { id: "aluminium", nom: "aluminium", debloque: { ressource: "acier", quantite: 15000 } },
  { id: "alliage", nom: "alliages avancés", debloque: { ressource: "aluminium", quantite: 12000 } },
  { id: "titane", nom: "titane", debloque: { ressource: "alliage", quantite: 10000 } },
  { id: "nanomateriaux", nom: "nanomatériaux", debloque: { ressource: "titane", quantite: 8000 } }
];

// Découvertes Wikipédia, déclenchées par le total produit d'une ressource.
// "article" = titre exact de la page Wikipédia (le lien de secours s'en déduit) ;
// "texte" s'affiche si l'API ne répond pas ; "bonus" = ligne d'annonce (facultative).
const paliers = [
  // --- Silex ---
  {
    id: "silex-25", ressource: "silex", seuil: 25,
    titre: "Le silex",
    article: "Silex",
    texte: "Roche très dure qui se casse en bords tranchants : c'était l'outil préféré des premiers humains.",
    bonus: "Évolution débloquée : l'Apprenti tailleur, un auto-clicker lent !"
  },
  {
    id: "silex-100", ressource: "silex", seuil: 100,
    titre: "Chasseur-cueilleur",
    article: "Chasseur-cueilleur",
    texte: "Pendant des centaines de milliers d'années, les humains ont vécu de chasse et de cueillette, avec des outils de pierre.",
    bonus: "Évolution débloquée : le Chasseur de la tribu !"
  },
  {
    id: "silex-500", ressource: "silex", seuil: 500,
    titre: "La maîtrise du feu",
    article: "Maîtrise du feu",
    texte: "Le feu permet de se chauffer, de cuire les aliments et même de rendre certaines pierres plus faciles à tailler.",
    bonus: "Évolution débloquée : le Foyer de chauffe !"
  },
  {
    id: "silex-2500", ressource: "silex", seuil: 2500,
    titre: "La taille de la pierre",
    article: "Taille de la pierre",
    texte: "Tailler la pierre consiste à la façonner par éclats successifs pour obtenir des outils et des armes.",
    bonus: "Évolution débloquée : l'Atelier de la tribu !"
  },
  {
    id: "silex-10000", ressource: "silex", seuil: 10000,
    titre: "Les mines de silex",
    article: "Mine de silex",
    texte: "Au Néolithique, des groupes creusaient de véritables mines pour extraire le meilleur silex.",
    bonus: "Évolution débloquée : la Mine de silex !"
  },
  {
    id: "silex-50000", ressource: "silex", seuil: 50000,
    titre: "Le troc",
    article: "Troc",
    texte: "Bien avant la monnaie, les groupes échangeaient directement des biens, comme les outils et les matières premières.",
    bonus: "Évolution débloquée : le Comptoir d'échange !"
  },
  {
    id: "silex-100000", ressource: "silex", seuil: 100000,
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
  },
  {
    id: "fer-20000", ressource: "fer", seuil: 20000,
    titre: "La révolution industrielle",
    article: "Révolution industrielle",
    texte: "À partir du XVIIIe siècle, la vapeur et la production de fer en grande quantité transforment l'industrie, les transports et la vie quotidienne.",
    bonus: "Nouvelle ressource débloquée : l'acier ! Un nouvel onglet est apparu."
  },

  // --- Acier ---
  { 
    id: "acier-10", ressource: "acier", seuil: 10, titre: "L'acier", article: "Acier",
    texte: "L'acier est un alliage de fer et de carbone, bien plus solide et plus souple que le fer seul.",
    url: "https://fr.wikipedia.org/wiki/Acier",
    bonus: "Évolution débloquée : l'Apprenti aciériste !" },
  { 
    id: "acier-100", ressource: "acier", seuil: 100, titre: "Le procédé Bessemer", article: "Procédé Bessemer",
    texte: "Au milieu du XIXe siècle, Henry Bessemer souffle de l'air dans la fonte en fusion pour produire de l'acier en grande quantité.",
    url: "https://fr.wikipedia.org/wiki/Procédé_Bessemer",
    bonus: "Évolution débloquée : le Convertisseur Bessemer !" },
  { 
    id: "acier-500", ressource: "acier", seuil: 500, titre: "Les gratte-ciel", article: "Gratte-ciel",
    texte: "Sans charpente en acier, impossible de construire des tours qui touchent les nuages.",
    url: "https://fr.wikipedia.org/wiki/Gratte-ciel",
    bonus: "Évolution débloquée : l'Aciérie électrique !" },
  {
    id: "acier-15000", ressource: "acier", seuil: 15000, titre: "L'aluminium", article: "Aluminium",
    texte: "Isolé au XIXe siècle, l'aluminium fut d'abord extrêmement rare et coûteux. Léger et résistant à la corrosion, il devient courant grâce à l'électrolyse.",
    bonus: "Nouvelle ressource débloquée : l'aluminium ! Un nouvel onglet est apparu. L'Aluminerie t'y attend." },

    // --- Aluminium ---
    {
      id: "aluminium-10", ressource: "aluminium", seuil: 10, titre: "Feuille d'aluminium",
      article: "Feuille d'aluminium",
      texte: "La feuille d'aluminium, ou papier d'aluminium, est une tôle dont l'épaisseur est inférieure à 0,2 mm.",
      bonus: "Évolution débloquée : le Chapeau en aluminium !"
    },
    {
      id: "aluminium-100", ressource: "aluminium", seuil: 100,
      titre: "La bauxite",
      article: "Bauxite",
      texte: "La bauxite est la roche rougeâtre dont on extrait l'alumine, puis l'aluminium. On la trouve surtout dans les régions tropicales.",
      bonus: "Évolution débloquée : la Mine de bauxite !"
    },
    {
      id: "aluminium-500", ressource: "aluminium", seuil: 500,
      titre: "Le procédé Hall-Héroult",
      article: "Procédé Hall-Héroult",
      texte: "En 1886, Charles Hall et Paul Héroult inventent chacun de leur côté l'électrolyse de l'alumine dissoute dans la cryolithe, ce qui permet de produire l'aluminium à grande échelle.",
      bonus: "Évolution débloquée : la Cuve d'électrolyse !"
    },
    {
      id: "aluminium-12000", ressource: "aluminium", seuil: 12000,
      titre: "Le duralumin",
      article: "Duralumin",
      texte: "Le duralumin est un alliage d'aluminium mis au point en Allemagne par Alfred Wilm au début du XXe siècle. Léger et résistant, il a servi à construire les premiers avions métalliques.",
      bonus: "Nouvelle ressource débloquée : les alliages avancés ! Un nouvel onglet est apparu. Le Laboratoire de métallurgie t'y attend."
    },

    // --- Alliages avancés ---
    {
      id: "alliage-10", ressource: "alliage", seuil: 10,
      titre: "Les superalliages",
      article: "Superalliage",
      texte: "Un superalliage est un alliage conçu pour résister à de très hautes températures et à la corrosion, notamment dans les moteurs d'avion.",
      bonus: "Évolution débloquée : l'Apprenti métallurgiste !"
    },
    {
      id: "alliage-100", ressource: "alliage", seuil: 100,
      titre: "Le four à induction",
      article: "Four à induction",
      texte: "Un four à induction fait fondre le métal grâce à des courants électriques, sans flamme. On obtient ainsi des alliages très purs et très précis.",
      bonus: "Évolution débloquée : le Four à induction !"
    },
    {
      id: "alliage-500", ressource: "alliage", seuil: 500,
      titre: "Le turboréacteur",
      article: "Turboréacteur",
      texte: "Dans un turboréacteur, les aubes de turbine subissent des températures extrêmes : seuls les superalliages peuvent y résister.",
      bonus: "Évolution débloquée : la Fonderie de turbines !"
    },
    {
      id: "alliage-10000", ressource: "alliage", seuil: 10000,
      titre: "Le titane",
      article: "Titane",
      texte: "Le titane est un métal léger, très résistant et insensible à la corrosion. Il est utilisé en aéronautique, dans l'espace et en médecine.",
      bonus: "Nouvelle ressource débloquée : le titane ! Un nouvel onglet est apparu. Le Réacteur Kroll t'y attend."
    },

    // --- Titane ---
    {
      id: "titane-10", ressource: "titane", seuil: 10,
      titre: "Le procédé Kroll",
      article: "Procédé Kroll",
      texte: "Mis au point par William Kroll vers 1940, ce procédé produit du titane métallique à partir de tétrachlorure de titane et de magnésium.",
      bonus: "Évolution débloquée : l'Apprenti titanier !"
    },
    {
      id: "titane-100", ressource: "titane", seuil: 100,
      titre: "Le SR-71 Blackbird",
      article: "Lockheed SR-71 Blackbird",
      texte: "Pour résister à la chaleur d'un vol à plus de Mach 3, l'avion espion SR-71 était construit en grande partie en titane.",
      bonus: "Évolution débloquée : le Four sous vide !"
    },
    {
      id: "titane-500", ressource: "titane", seuil: 500,
      titre: "Le lanceur spatial",
      article: "Lanceur spatial",
      texte: "Un lanceur spatial est une fusée capable de placer une charge en orbite. Le titane y est employé pour les réservoirs et les pièces de moteur.",
      bonus: "Évolution débloquée : le Complexe métallurgique !"
    },
    {
      id: "titane-8000", ressource: "titane", seuil: 8000,
      titre: "Les nanomatériaux",
      article: "Nanomatériau",
      texte: "Un nanomatériau est un matériau dont la structure se mesure à l'échelle du nanomètre, un milliardième de mètre. À cette échelle, la matière acquiert des propriétés nouvelles.",
      bonus: "Nouvelle ressource débloquée : les nanomatériaux ! Un nouvel onglet est apparu. Le Laboratoire de nanotechnologie t'y attend."
    },

    // --- Nanomatériaux ---
    {
      id: "nanomateriaux-10", ressource: "nanomateriaux", seuil: 10,
      titre: "La nanotechnologie",
      article: "Nanotechnologie",
      texte: "La nanotechnologie consiste à étudier et à fabriquer des structures à l'échelle de quelques atomes.",
      bonus: "Évolution débloquée : l'Apprenti nanotechnicien !"
    },
    {
      id: "nanomateriaux-100", ressource: "nanomateriaux", seuil: 100,
      titre: "Les nanotubes de carbone",
      article: "Nanotube de carbone",
      texte: "Un nanotube de carbone est un feuillet de carbone enroulé en un tube de quelques nanomètres de diamètre, très léger et extrêmement résistant.",
      bonus: "Évolution débloquée : le Réacteur à nanotubes !"
    },
    {
      id: "nanomateriaux-500", ressource: "nanomateriaux", seuil: 500,
      titre: "Le graphène",
      article: "Graphène",
      texte: "Le graphène est une couche de carbone épaisse d'un seul atome, très résistante et excellente conductrice. Ses découvreurs ont reçu le prix Nobel de physique en 2010.",
      bonus: "Évolution débloquée : l'Usine de graphène !"
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
    debloque: { ressource: "silex", quantite: 25 },
    cout: { ressource: "silex", base: 50  },
    produit: "silex", production: 0.5
  },
  {
    id: "chasseur", nom: "Chasseur de la tribu", icone: "🏹",
    description: "Taille des pointes de lance",
    debloque: { ressource: "silex", quantite: 100 },
    cout: { ressource: "silex", base: 200 },
    produit: "silex", production: 2
  },
  {
    id: "foyer", nom: "Foyer de chauffe", icone: "🔥",
    description: "Le feu rend la taille plus facile",
    debloque: { ressource: "silex", quantite: 500 },
    cout: { ressource: "silex", base: 600 },
    produit: "silex", production: 8
  },
  {
    id: "atelier", nom: "Atelier de la tribu", icone: "🛖",
    description: "Plusieurs tailleurs au travail",
    debloque: { ressource: "silex", quantite: 2500 },
    cout: { ressource: "silex", base: 5000 },
    produit: "silex", production: 35
  },
  {
    id: "mine", nom: "Mine de silex", icone: "⛏️",
    description: "Du silex de qualité en abondance",
    debloque: { ressource: "silex", quantite: 10000 },
    cout: { ressource: "silex", base: 20000 },
    produit: "silex", production: 150
  },
  {
    id: "comptoir", nom: "Comptoir d'échange", icone: "🤝",
    description: "Le troc avec les tribus voisines",
    debloque: { ressource: "silex", quantite: 50000 },
    cout: { ressource: "silex", base: 100000 },
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
  },

  // --- Acier ---
  { 
    id: "apprenti-acieriste", nom: "Apprenti aciériste", icone: "🧑‍🏭",
    description: "Il surveille la coulée de l'acier.",
    debloque: { ressource: "acier", quantite: 10 },
    cout: { ressource: "acier", base: 20 },
    produit: "acier", production: 0.5
  },
  { 
    id: "convertisseur", nom: "Convertisseur Bessemer", icone: "🔥",
    description: "Transforme la fonte en acier à grande vitesse.",
    debloque: { ressource: "acier", quantite: 100 },
    cout: { ressource: "acier", base: 200 },
    produit: "acier", production: 3
  },
  {
    id: "acierie-electrique", nom: "Aciérie électrique", icone: "⚡",
    description: "Un arc électrique fait fondre la ferraille.",
    debloque: { ressource: "acier", quantite: 500 },
    cout: { ressource: "acier", base: 1500 },
    produit: "acier", production: 15
  },

  // le "pont" : payé en fer, c'est lui qui fait décoller la ressource
  { 
    id: "acierie-integree", nom: "Aciérie intégrée", icone: "🏭",
    description: "Du minerai à la poutrelle, tout sur un site.",
    debloque: { ressource: "fer", quantite: 1440000 },
    cout: { ressource: "fer", base: 1800000 },
    produit: "acier", production: 600
  },

  // --- Aluminium --- 
  { 
    id: "chapeau-aluminium", nom: "Chapeau en aluminium", icone: "🪖",
    description: "Coiffe composée d'une ou plusieurs feuille de papier aluminium.",
    debloque: { ressource: "aluminium", quantite: 10 },
    cout: { ressource: "aluminium", base: 20 },
    produit: "aluminium", production: 0.5
  },
  {
    id: "mine-bauxite", nom: "Mine de bauxite", icone: "⛏️",
    description: "Le minerai d'où l'on tire l'alumine.",
    debloque: { ressource: "aluminium", quantite: 100 },
    cout: { ressource: "aluminium", base: 250 },
    produit: "aluminium", production: 3
  },
  {
    id: "cuve-electrolyse", nom: "Cuve d'électrolyse", icone: "⚡",
    description: "L'électricité transforme l'alumine en métal.",
    debloque: { ressource: "aluminium", quantite: 500 },
    cout: { ressource: "aluminium", base: 2000 },
    produit: "aluminium", production: 15
  },

  // le "pont" : payé en acier, c'est lui qui fait décoller l'aluminium
  {
    id: "aluminerie", nom: "Aluminerie", icone: "🏭",
    description: "L'acier construit les cuves : de l'aluminium en continu.",
    debloque: { ressource: "acier", quantite: 15000 },
    cout: { ressource: "acier", base: 20000 },
    produit: "aluminium", production: 10
  },

  // --- Alliages avancés ---
  {
    id: "apprenti-metallurgiste", nom: "Apprenti métallurgiste", icone: "🧑‍🔬",
    description: "Il surveille la fonte des alliages.",
    debloque: { ressource: "alliage", quantite: 10 },
    cout: { ressource: "alliage", base: 30 },
    produit: "alliage", production: 0.5
  },
  {
    id: "four-induction", nom: "Four à induction", icone: "🔌",
    description: "Fait fondre les métaux sans flamme.",
    debloque: { ressource: "alliage", quantite: 100 },
    cout: { ressource: "alliage", base: 300 },
    produit: "alliage", production: 3
  },
  {
    id: "fonderie-turbines", nom: "Fonderie de turbines", icone: "🌀",
    description: "Des alliages qui résistent à la chaleur extrême.",
    debloque: { ressource: "alliage", quantite: 500 },
    cout: { ressource: "alliage", base: 2500 },
    produit: "alliage", production: 15
  },
  {
    id: "labo-metallurgie", nom: "Laboratoire de métallurgie", icone: "🔬",
    description: "L'aluminium sert de base à de nouveaux alliages.",
    debloque: { ressource: "aluminium", quantite: 12000 },
    cout: { ressource: "aluminium", base: 16000 },
    produit: "alliage", production: 10
  },

  // --- Titane ---
  {
    id: "apprenti-titanier", nom: "Apprenti titanier", icone: "👷",
    description: "Il surveille la réduction du titane.",
    debloque: { ressource: "titane", quantite: 10 },
    cout: { ressource: "titane", base: 40 },
    produit: "titane", production: 0.5
  },
  {
    id: "four-vide", nom: "Four sous vide", icone: "🌡️",
    description: "Le titane se travaille à l'abri de l'air.",
    debloque: { ressource: "titane", quantite: 100 },
    cout: { ressource: "titane", base: 400 },
    produit: "titane", production: 3
  },
  {
    id: "complexe-metallurgique", nom: "Complexe métallurgique", icone: "🏗️",
    description: "Une production de titane à grande échelle.",
    debloque: { ressource: "titane", quantite: 500 },
    cout: { ressource: "titane", base: 3000 },
    produit: "titane", production: 15
  },
  {
    id: "reacteur-kroll", nom: "Réacteur Kroll", icone: "⚗️",
    description: "Les alliages avancés servent à fabriquer du titane.",
    debloque: { ressource: "alliage", quantite: 10000 },
    cout: { ressource: "alliage", base: 13000 },
    produit: "titane", production: 10
  },

  // --- Nanomatériaux ---
  {
    id: "apprenti-nanotechnicien", nom: "Apprenti nanotechnicien", icone: "🥽",
    description: "Il manipule la matière atome par atome.",
    debloque: { ressource: "nanomateriaux", quantite: 10 },
    cout: { ressource: "nanomateriaux", base: 50 },
    produit: "nanomateriaux", production: 0.5
  },
  {
    id: "reacteur-nanotubes", nom: "Réacteur à nanotubes", icone: "🧪",
    description: "Fait pousser des tubes de carbone.",
    debloque: { ressource: "nanomateriaux", quantite: 100 },
    cout: { ressource: "nanomateriaux", base: 500 },
    produit: "nanomateriaux", production: 3
  },
  {
    id: "usine-graphene", nom: "Usine de graphène", icone: "🔷",
    description: "Des feuillets de carbone d'un atome d'épaisseur.",
    debloque: { ressource: "nanomateriaux", quantite: 500 },
    cout: { ressource: "nanomateriaux", base: 4000 },
    produit: "nanomateriaux", production: 15
  },
  {
    id: "labo-nano", nom: "Laboratoire de nanotechnologie", icone: "🧫",
    description: "Le titane sert de socle à la fabrication de nanomatériaux.",
    debloque: { ressource: "titane", quantite: 8000 },
    cout: { ressource: "titane", base: 11000 },
    produit: "nanomateriaux", production: 10
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
  },
  
  // --- Payés en acier --- 
  { 
    id: "outils-acier", nom: "Outils en acier", description: "Production de fer ×2", icone: "🔧",
    debloque: { ressource: "acier", quantite: 20 }, 
    cout: { ressource: "acier", prix: 100 }, 
    effet: { ressource: "fer", facteur: 2 }
  },

  // --- Payés en aluminium --- 
  { 
    id: "feuilles-aluminium", nom: "Feuilles d'aluminium", description: "Production d'acier ×2", icone: "🪖",
    debloque: { ressource: "aluminium", quantite: 20 }, 
    cout: { ressource: "aluminium", prix: 100 }, 
    effet: { ressource: "acier", facteur: 2 }
  },
  {
    id: "anodisation", nom: "Anodisation", icone: "✨",
    description: "Production d'aluminium ×2",
    debloque: { ressource: "aluminium", quantite: 200 },
    cout: { ressource: "aluminium", prix: 500 },
    effet: { ressource: "aluminium", facteur: 2 }
  },
  {
    id: "avions-aluminium", nom: "Avions en aluminium", icone: "✈️",
    description: "Production de silex ×3",
    debloque: { ressource: "aluminium", quantite: 300 },
    cout: { ressource: "aluminium", prix: 1000 },
    effet: { ressource: "silex", facteur: 3 }
  },

  // --- Payés en acier (suite) ---
  {
    id: "acier-trempe", nom: "Acier trempé", icone: "🗡️",
    description: "Production d'acier ×2",
    debloque: { ressource: "acier", quantite: 200 },
    cout: { ressource: "acier", prix: 500 },
    effet: { ressource: "acier", facteur: 2 }
  },
  {
    id: "chemins-de-fer", nom: "Chemins de fer", icone: "🚂",
    description: "Production de silex ×3",
    debloque: { ressource: "acier", quantite: 300 },
    cout: { ressource: "acier", prix: 1000 },
    effet: { ressource: "silex", facteur: 3 }
  },

  // --- Payés en alliages avancés ---
  {
    id: "alliages-legers", nom: "Alliages légers", icone: "🪶",
    description: "Production d'aluminium ×2",
    debloque: { ressource: "alliage", quantite: 20 },
    cout: { ressource: "alliage", prix: 150 },
    effet: { ressource: "aluminium", facteur: 2 }
  },
  {
    id: "traitement-thermique", nom: "Traitement thermique", icone: "🌡️",
    description: "Production d'alliages avancés ×2",
    debloque: { ressource: "alliage", quantite: 200 },
    cout: { ressource: "alliage", prix: 750 },
    effet: { ressource: "alliage", facteur: 2 }
  },
  {
    id: "turbines-haute-temperature", nom: "Turbines haute température", icone: "🌀",
    description: "Production de silex ×4",
    debloque: { ressource: "alliage", quantite: 300 },
    cout: { ressource: "alliage", prix: 1500 },
    effet: { ressource: "silex", facteur: 4 }
  },

  // --- Payés en titane ---
  {
    id: "eponge-titane", nom: "Éponge de titane", icone: "🧽",
    description: "Production d'alliages avancés ×2",
    debloque: { ressource: "titane", quantite: 20 },
    cout: { ressource: "titane", prix: 200 },
    effet: { ressource: "alliage", facteur: 2 }
  },
  {
    id: "soudage-argon", nom: "Soudage sous argon", icone: "🔥",
    description: "Production de titane ×2",
    debloque: { ressource: "titane", quantite: 200 },
    cout: { ressource: "titane", prix: 1000 },
    effet: { ressource: "titane", facteur: 2 }
  },
  {
    id: "coques-fusees", nom: "Coques de fusée", icone: "🚀",
    description: "Production de silex ×4",
    debloque: { ressource: "titane", quantite: 300 },
    cout: { ressource: "titane", prix: 2000 },
    effet: { ressource: "silex", facteur: 4 }
  },

  // --- Payés en nanomatériaux ---
  {
    id: "revetements-nano", nom: "Revêtements nanostructurés", icone: "🔬",
    description: "Production de titane ×2",
    debloque: { ressource: "nanomateriaux", quantite: 20 },
    cout: { ressource: "nanomateriaux", prix: 300 },
    effet: { ressource: "titane", facteur: 2 }
  },
  {
    id: "auto-assemblage", nom: "Auto-assemblage", icone: "🧲",
    description: "Production de nanomatériaux ×2",
    debloque: { ressource: "nanomateriaux", quantite: 200 },
    cout: { ressource: "nanomateriaux", prix: 1500 },
    effet: { ressource: "nanomateriaux", facteur: 2 }
  },
  {
    id: "ascenseur-spatial", nom: "Ascenseur spatial", icone: "🛰️",
    description: "Production de silex ×5",
    debloque: { ressource: "nanomateriaux", quantite: 300 },
    cout: { ressource: "nanomateriaux", prix: 3000 },
    effet: { ressource: "silex", facteur: 5 }
  },
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
