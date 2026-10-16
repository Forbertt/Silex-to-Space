// ui.js : génère scores, onglets et zones de clic à partir d'une seule liste.
// Les id et classes produits sont identiques à l'ancien HTML (compteur-X, clic-X,
// production-X, score-X, zone-X, autel-X...), donc game.js n'a pas à changer.
// À charger APRÈS donnees.js et AVANT game.js.
(function () {
  const RESSOURCES = [
    { id: 'silex',         onglet: 'Silex',            score: 'silex taillés',      alt: 'Tailler un silex',               astuce: 'Clique sur le silex pour le tailler',               premiere: true },
    { id: 'bronze',        onglet: 'Bronze',           score: 'bronze',             alt: 'Forger du bronze',               astuce: 'Clique sur le bronze pour le forger' },
    { id: 'fer',           onglet: 'Fer',              score: 'fer',                alt: 'Forger du fer',                  astuce: 'Clique sur le fer pour le forger' },
    { id: 'acier',         onglet: 'Acier',            score: 'acier',              alt: "Forger de l'acier",              astuce: "Clique sur l'acier pour le forger" },
    { id: 'aluminium',     onglet: 'Aluminium',        score: 'aluminium',          alt: "Forger de l'aluminium",          astuce: "Clique sur l'aluminium pour le forger" },
    { id: 'alliage',       onglet: 'Alliages avancés', score: 'alliages avancés',   alt: "Forger de l'alliage avancé",     astuce: "Clique sur l'alliage avancé pour le forger" },
    { id: 'titane',        onglet: 'Titane',           score: 'titane',             alt: 'Forger du titane',               astuce: 'Clique sur le titane pour le forger' },
    { id: 'nanomateriaux', onglet: 'Nanomatériaux',    score: 'nanomatériaux',      alt: 'Forger des nanomatériaux',       astuce: 'Clique sur les nanomatériaux pour les forger' },
  ];

  // Scores
  document.getElementById('scores').innerHTML = RESSOURCES.map(r => `
    <div class="score" id="score-${r.id}"${r.premiere ? '' : ' hidden'}>
      <span id="compteur-${r.id}" class="compteur${r.premiere ? '' : ` compteur-${r.id}`}">0</span>
      <small>${r.score}</small>
      <small id="production-${r.id}" class="production"></small>
    </div>`).join('');

  // Onglets
  document.getElementById('onglets').innerHTML = RESSOURCES.map(r => `
    <button class="onglet${r.premiere ? ' actif' : ''}" data-onglet="${r.id}"${r.premiere ? '' : ' hidden'}>${r.onglet}</button>`).join('');

  // Zones de clic (insérées juste avant la boutique, comme dans l'ancien HTML)
  document.getElementById('boutique').insertAdjacentHTML('beforebegin', RESSOURCES.map(r => `
    <section class="zone" id="zone-${r.id}"${r.premiere ? '' : ' hidden'}>
      <div class="autel${r.premiere ? '' : ` autel-${r.id}`}">
        <img id="clic-${r.id}" class="cliquable" src="img/${r.id}.png" alt="${r.alt}"
             draggable="false" tabindex="0" role="button">
      </div>
      <p class="astuce">${r.astuce}</p>
    </section>`).join(''));

  // Accessibilité : Entrée / Espace déclenchent le clic sur l'image
  document.querySelectorAll('.cliquable').forEach(img => {
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click();
      }
    });
  });
})();
