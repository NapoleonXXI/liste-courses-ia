/*
 * ÉCRAN « PANIER » — DÉSACTIVÉ (v1.4)
 * -----------------------------------
 * Le suivi du panier est désormais intégré à l'onglet Liste (cases à cocher, progression,
 * total coché, reste estimé, boutons « Terminer les courses » et « Vider la liste »).
 * Ce fichier n'est PAS chargé par index.html.
 *
 * Pour réactiver :
 *  1. Coller PANIER_HTML comme dernière <section> de <main> dans index.html
 *     (et retirer de l'onglet Liste les boutons #finish / #reset, les ids doivent rester uniques).
 *  2. Ajouter dans <nav> : <button data-s="panier"><span>🧺</span>Panier</button>
 *  3. Coller PANIER_JS (renderPanier) avant « $('#finish').onclick » et appeler renderPanier();
 *     à la fin de updateStats().
 *  4. Dans l'appel de démarrage, ajouter 'panier' à la liste ['demande','liste'].
 */
const PANIER_HTML = `
<section class="screen" id="s-panier">
 <div class="card"><h2>Mon panier</h2>
  <div class="stats">
   <div>Total dépensé (estimé)<b id="pTotal">0,00 €</b></div>
   <div>Budget<b id="pBudget">—</b></div>
  </div>
  <div class="prog"><div id="pBar"></div></div>
  <div id="pMsg"></div>
 </div>
 <div class="card" id="pItems"></div>
 <button class="btn" id="finish">✅ Terminer les courses</button>
 <button class="btn danger" id="reset">Vider la liste</button>
</section>
`;
/* PANIER_JS :
function renderPanier(){
 const s=totals(),b=+profile.budget;
 $('#pTotal').textContent=eur(s.cart);$('#pBudget').textContent=b?eur(b)+(profile.budgetType==='week'?' /sem.':' /repas'):'—';
 const pct=b?Math.min(100,s.cart/b*100):0;$('#pBar').style.width=pct+'%';$('#pBar').style.background=s.cart>b&&b?'var(--err)':'';
 $('#pMsg').innerHTML=(b?budgetMsg(s.cart):'')+`<p class="note">Reste à acheter : ${s.t-s.c} article(s), ~${eur(s.remain)}. Prix estimés.</p>`;
 const c=list.items.filter(i=>i.checked);
 $('#pItems').innerHTML=c.length?'<h3>Articles dans le panier</h3>'+c.map(i=>`<div class="item"><div class="nm"><div>✔ ${esc(i.name)}</div><div class="iprice">${priceLine(i)}</div><span class="sub">${i.quantity} ${esc(i.unit)}</span></div></div>`).join(''):'<div class="empty">Aucun article coché pour le moment.</div>';
}
*/
