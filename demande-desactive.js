/*
 * ONGLET « DEMANDE » COMPLET — DÉSACTIVÉ (v1.5)
 * ----------------------------------------------
 * Depuis v1.5 l'onglet Demande n'affiche qu'une barre de saisie type moteur de recherche (#request) :
 * Entrée => generate() puis bascule vers l'onglet Liste.
 * L'ancien contenu (bouton Générer, suggestions, sélecteur Personnes, ajout à la liste existante,
 * section « Supermarché le plus proche » avec géolocalisation / code postal, résultat détaillé,
 * réglages IA) est encore présent dans index.html mais MASQUÉ dans <div id="demandeLegacy" hidden>,
 * car la logique (magasin mémorisé, prix par rayon, IA, nombre de personnes) lit ces éléments.
 * En arrière-plan : le magasin déjà mémorisé (localStorage lcia_store) reste appliqué ; sans magasin,
 * prix moyens nationaux ; 2 personnes par défaut ; clé IA éventuellement déjà enregistrée utilisée.
 * Ce fichier n'est PAS chargé par la page.
 *
 * Pour réactiver l'ancien écran :
 *  1. Dans index.html, supprimer le <form id="searchForm"> et retirer l'attribut hidden de #demandeLegacy
 *     (ou remplacer tout le contenu de <section id="s-demande"> par DEMANDE_HTML ci-dessous).
 *  2. Dans DEMANDE_HTML, le champ s'appelle à nouveau id="request" (en v1.5 la copie masquée est "requestOld").
 *  3. Supprimer la règle CSS #s-demande.active{display:flex...} et le listener 'submit' de #searchForm.
 */
const DEMANDE_HTML = `
<section class="screen" id="s-demande">
 <div class="card"><h2>Que voulez-vous cuisiner ?</h2>
  <textarea id="request" placeholder="ex : des pâtes carbonara pour ce soir, une ratatouille…"></textarea>
  <div class="chips" id="suggest" style="margin-top:10px"></div>
  <div class="stepper"><span>Personnes</span><button type="button" id="pMinus" aria-label="Moins">−</button><output id="peopleVal">2</output><button type="button" id="pPlus" aria-label="Plus">+</button></div>
  <label style="display:flex;align-items:center;gap:10px;font-weight:400"><input type="checkbox" id="appendMode" style="width:24px;height:24px"> Ajouter à la liste existante</label>
  <button class="btn" id="generate">✨ Générer ma liste</button>
  <p class="note" id="modeInfo"></p>
 </div>
 <div class="card"><h3>📍 Supermarché le plus proche</h3>
  <div id="storeInfo" class="note" aria-live="polite">Position non demandée.</div>
  <div id="storeStatus" class="note" aria-live="polite"></div>
  <button class="btn sec" id="locate">📍 Me localiser</button>
  <div id="cityBox" hidden>
   <label for="cityInput">Ville ou code postal</label>
   <input id="cityInput" placeholder="ex : Lyon ou 69003" autocomplete="postal-code">
   <button class="btn sec" id="cityBtn">🔎 Chercher un magasin</button>
  </div>
  <button class="btn sec" id="changeStore" hidden>🔄 Changer de magasin</button>
  <button class="btn danger" id="forgetStore" hidden>🗑️ Oublier ce magasin</button>
 </div>
 <div id="genResult"></div>
 <div class="card settings"><details id="aiSettings"><summary>⚙️ Réglages IA (optionnel)</summary>
  <p class="note">Sans clé, l'app utilise une génération simulée hors ligne. La clé est stockée uniquement dans ce navigateur (localStorage).</p>
  <label for="apiKey">Clé API (compatible OpenAI)</label><input id="apiKey" type="password" placeholder="sk-..." autocomplete="off">
  <label for="apiBase">URL de base</label><input id="apiBase" value="https://api.openai.com/v1">
  <label for="apiModel">Modèle</label><input id="apiModel" value="gpt-4o-mini">
  <button class="btn sec" id="saveAi">Enregistrer les paramètres IA</button>
  <button class="btn danger" id="clearAi">Effacer la clé</button>
 </details></div>
</section>
`;
