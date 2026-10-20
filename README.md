# 🪨 Silex to Space 🚀

**Du premier silex à la conquête spatiale.**

Silex to Space est un jeu incrémental inspiré de Cookie Clicker, dans lequel tu développes ta production, débloques des technologies et progresses à travers les grandes étapes de l'évolution.

## 🎮 Le concept

Tout commence avec un simple silex. Collecte des ressources, améliore ta production et découvre de nouveaux éléments pour avancer vers ton objectif ultime : conquérir l'espace.

## ⚒️ Ressources et progression

- 🪨 **Silex** — Le début de l'aventure.
- 🥉 **Bronze** — Une nouvelle étape technologique.
- ⚙️ **Fer** — Poursuis ton évolution.
- 🔩 **Acier** — Des matériaux plus résistants.
- 🪶 **Aluminium** — Léger et polyvalent.
- 🧪 **Alliages avancés** — Des métaux aux propriétés inédites.
- 🛰️ **Titane** — Solide et léger, prêt pour les étoiles.
- 🔬 **Nanomatériaux** — La matière à l'échelle de l'infiniment petit.

## 📈 Fonctionnalités

- **Production automatique :** un système incrémental inspiré de Cookie Clicker.
- **Évolutions et technologies :** débloque de nouvelles possibilités.
- **Codex :** retrouve tes découvertes.
- **Succès :** accomplis différents objectifs.
- **Monuments :** dépense d'importantes quantités de ressources dans des constructions prestigieuses.
- **Secrets cachés :** découvre des actions inattendues pour obtenir +1 % de production par secret.
- **Wikipédia :** explore des articles encyclopédiques associés aux succès grâce à l'API Wikipédia.
- **Comètes aléatoires :** des comètes traversent l'écran à intervalle aléatoire. Clique dessus pour obtenir un bonus temporaire tiré au hasard :
  - 🔥 **Frénésie** : production ×7 pendant 20 s
  - 🌠 **Souffle cosmique** : production ×2 pendant 60 s
  - 👆 **Clics en or** : 10 par clic pendant 30 s

🔎 Exemple de secret : cliquer sur « Réinitialiser la partie », puis annuler, permet de débloquer le secret « Hésitation ».

## 🧪 Aperçu du jeu après un certain temps

Vous souhaitez découvrir à quoi ressemble le jeu après avoir accumulé des ressources ? Vous pouvez simuler une progression en quelques secondes :

1. Ouvrez la console du navigateur avec **F12**.
2. Copiez-collez le code suivant, puis appuyez sur **Entrée** :

```
etat.total.silex = 200000;
etat.stock.silex = 200000;
sauvegarder();
```

Vous disposerez ainsi de **200 000 silex** pour explorer le jeu avec davantage de ressources.

Pour faire apparaître une comète tout de suite, tapez `lancerComete()` dans la console.

## 🚧 État du développement

**Implémenté**

- Toutes les ressources : Silex, Bronze, Fer, Acier, Aluminium, Alliages avancés, Titane et Nanomatériaux
- Auto-clicker et production automatique
- Système d'évolutions et de technologies
- Codex et page des succès
- Monuments achetables avec des ressources
- Secrets cachés offrant +1 % de production chacun
- API Wikipédia liée aux succès
- Comètes aléatoires avec trois bonus temporaires (production ×7, production ×2, clics ×10)

**À venir**

- Davantage de bonus de comètes
- Villageois et développement progressif d'un village (ajout des technologies associés ?)
- Fusion d'éléments (ex. : Fer + Feu)

## 🛠️ Technologies

- HTML
- CSS
- JavaScript
- API Wikipédia

## 🚀 Le voyage continue

Chaque ressource est une étape. Chaque technologie ouvre de nouvelles possibilités. Et certains secrets ne demandent qu'à être découverts.

**Du silex aux étoiles, l'évolution ne fait que commencer.**
