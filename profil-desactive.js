/*
 * PROFIL ALIMENTAIRE — DÉSACTIVÉ (v1.3)
 * --------------------------------------
 * L'écran « Profil » (préférences, allergies, budget) a été retiré de l'interface pour garder
 * l'app minimale (Demande, Liste, Panier + magasin). Ce fichier n'est PAS chargé par index.html.
 * La logique d'exclusion/substitution (PREFS, REST, SUBS, applyProfile, budgetMsg) est toujours
 * présente dans index.html ; elle tourne avec un profil neutre (aucune restriction, budget 0 = pas d'alerte).
 *
 * Pour réactiver :
 *  1. Dans index.html, coller PROFIL_HTML (ci-dessous) comme première <section> de <main>.
 *  2. Ajouter dans <nav> : <button data-s="profil"><span>👤</span>Profil</button>
 *  3. Remplacer la ligne `let profile={prefs:[],...}` par :
 *       let profile=LS.get('profile',{prefs:[],rest:[],other:'',people:2,budget:60,budgetType:'week'});
 *  4. Coller PROFIL_JS (ci-dessous) à la place du bloc « Profil désactivé » (loadProfile/setPeople),
 *     en gardant les lignes apiKey/apiBase/apiModel/modeInfo de loadProfile.
 *  5. Remplacer l'écran de démarrage par :
 *       go(LS.get('profileDone',false)?LS.get('screen','demande'):'profil');
 */
const PROFIL_HTML = `
<section class="screen" id="s-profil">
 <div class="card"><h2>Mon profil alimentaire</h2>
  <label>Préférences</label>
  <div class="chips" id="prefChips"></div>
  <label>Restrictions / allergies</label>
  <div class="chips" id="restChips"></div>
  <label for="restOther">Autres aliments à exclure (séparés par des virgules)</label>
  <input id="restOther" placeholder="ex : champignons, coriandre">
  <div class="row">
   <div><label for="people">Personnes</label><input id="people" type="number" min="1" max="20" value="2" inputmode="numeric"></div>
   <div><label for="budget">Budget (€)</label><input id="budget" type="number" min="0" step="1" value="60" inputmode="decimal"></div>
  </div>
  <label for="budgetType">Type de budget</label>
  <select id="budgetType"><option value="week">Par semaine</option><option value="meal">Par repas</option></select>
  <button class="btn" id="saveProfile">Enregistrer le profil</button>
 </div>

</section>
`;

/* PROFIL_JS — code d'origine :
/* ---- Profil ---- * /
function chips(el,opts,sel){el.innerHTML=opts.map(o=>`<button type="button" class="chip${sel.includes(o)?' on':''}" data-v="${esc(o)}">${esc(o)}</button>`).join('');el.onclick=e=>{const b=e.target.closest('.chip');if(b)b.classList.toggle('on')}}
function loadProfile(){
 chips($('#prefChips'),Object.keys(PREFS),profile.prefs);chips($('#restChips'),Object.keys(REST),profile.rest);
 $('#restOther').value=profile.other;$('#people').value=profile.people;$('#budget').value=profile.budget;$('#budgetType').value=profile.budgetType;
 $('#apiKey').value=ai.key;$('#apiBase').value=ai.base;$('#apiModel').value=ai.model;
 $('#hdrSub').textContent=`${profile.people} pers. · budget ${profile.budget} € ${profile.budgetType==='week'?'/sem.':'/repas'}`+(profile.prefs.length?' · '+profile.prefs.join(', '):'');
 $('#modeInfo').textContent=ai.key?`Mode IA : ${ai.model} (repli automatique sur la simulation en cas d'erreur).`:'Mode simulation hors ligne (aucune clé IA configurée).';
}
$('#saveProfile').onclick=()=>{
 profile={prefs:[...document.querySelectorAll('#prefChips .on')].map(b=>b.dataset.v),rest:[...document.querySelectorAll('#restChips .on')].map(b=>b.dataset.v),other:$('#restOther').value.trim(),people:Math.max(1,Math.min(20,parseInt($('#people').value)||1)),budget:Math.max(0,parseFloat($('#budget').value)||0),budgetType:$('#budgetType').value};
 LS.set('profile',profile);LS.set('profileDone',true);loadProfile();updateStats();toast('Profil enregistré ✔');go('demande');
};

*/
