/*
 * ONGLET LISTE — DÉSACTIVÉ (v1.22)
 * --------------------------------
 * L'onglet « Liste » (articles, prix, cases à cocher, totaux, Terminer / Vider, ajout d'article)
 * a été retiré de l'interface. Ce fichier n'est PAS chargé par index.html.
 * Toujours présents dans index.html : generate(), simulate(), applyProfile(), la variable `list`,
 * save(), les prix (P, pp, fac), budgetMsg. La fonction render() y est réduite à un stub vide.
 *
 * Pour réactiver :
 *  1. Dans index.html, coller LISTE_HTML (ci-dessous) comme <section> dans <main> (avant #s-express).
 *  2. Ajouter dans <nav>, entre Demande et Mon profil : <button data-s="liste"><span>📝</span>Liste<i class="badge" id="badgeList" hidden></i></button>
 *  3. Remplacer le stub `function render(){}` (bloc « v1.22 Liste désactivée ») par LISTE_JS.
 *  4. Dans le handler submit de #searchForm, remettre :
 *       e.preventDefault();if(!$('#request').value.trim())return;$('#request').blur();await generate();if(list.items.length)go('liste')
 *  5. Ajouter 'liste' dans le tableau des écrans restaurés en bas du script (go([...].includes(sc)...)).
 *  6. Pour que les repas express génèrent une liste : dans $('#expressPanel').onclick, mettre
 *     $('#request').value=EXPRESS[i].q;$('#searchForm').requestSubmit()  (au lieu d'ouvrir l'aperçu).
 */

const LISTE_HTML = `<section class="screen" id="s-liste">
 <div class="card"><h2 id="listTitle">Ma liste</h2>
  <div class="prog"><div id="progBar"></div></div>
  <div class="stats">
   <div>Articles cochés<b id="stCount">0 / 0</b></div>
   <div>Progression<b id="stPct">0 %</b></div>
   <div>Dans le panier<b id="stCart">0,00 €</b></div>
   <div>Reste estimé<b id="stRemain">0,00 €</b></div>
  </div>
  <div id="listWarn"></div>
  <p class="note" id="factorInfo"></p>
  <p class="note">💡 Prix indicatifs estimés (moyennes supermarchés France), non contractuels.</p>
 </div>
 <div id="listBody"></div>
 <button class="btn" id="finish">✅ Terminer les courses</button>
 <button class="btn danger" id="reset">Vider la liste</button>
 <div class="card"><h3>Ajouter un article</h3>
  <input id="addName" placeholder="Nom de l'article">
  <div class="row" style="margin-top:8px"><input id="addQty" placeholder="Quantité" inputmode="decimal"><input id="addUnit" placeholder="Unité (g, pièce…)"></div>
  <button class="btn sec" id="addBtn">+ Ajouter</button>
 </div>
</section>`;

/* LISTE_JS (à coller tel quel dans le <script> de index.html) */
function totals(){const t=list.items.length,c=list.items.filter(i=>i.checked);const all=list.items.reduce((s,i)=>s+pp(i),0);const cart=c.reduce((s,i)=>s+pp(i),0);return {t,c:c.length,cart,remain:all-cart,all}}
function updateStats(){
 const s=totals();const pct=s.t?Math.round(s.c/s.t*100):0;
 $('#progBar').style.width=pct+'%';$('#stCount').textContent=`${s.c} / ${s.t}`;$('#stPct').textContent=pct+' %';$('#stCart').textContent=eur(s.cart);$('#stRemain').textContent=eur(s.remain);
 $('#listWarn').innerHTML=s.t?budgetMsg(s.all):'';
 $('#factorInfo').innerHTML=store?`🏪 Prix indicatifs chez <b>${esc(store.name)}</b> (niveau moyen ${fmtPct(Math.round((fac()-1)*100))}) : ${levelsText()}`:'🏪 Aucun magasin choisi : prix moyens nationaux.';
 const b=$('#badgeList');b.hidden=!(s.t-s.c);b.textContent=s.t-s.c;

}
function renderGen(){
 const g=LS.get('lastGen',null),el=$('#genResult');if(!g){el.innerHTML='';return}
 const items=list.items.filter(i=>g.ids.includes(i.id));if(!items.length){el.innerHTML='';return}
 const tot=items.reduce((s,i)=>s+pp(i),0);
 let h=`<div class="card"><h3>${g.source==='ia'?'🤖 Généré par IA':'🧪 Génération simulée'}</h3><div><b>${esc(g.title)}</b> — ${items.length} articles, ~${eur(tot)} pour ${profile.people} pers.</div>`;
 h+=`<p class="note">Prix indicatifs ${store?'chez <b>'+esc(store.name)+'</b>':'moyens (aucun magasin choisi)'}</p>`;
 h+='<div class="genlist">'+items.map(i=>`<div class="gl"><div class="iname">${esc(i.name)} <span class="sub">(${i.quantity} ${esc(i.unit)})</span></div><div class="iprice" data-price="${pp(i).toFixed(2)}">${priceLine(i)}</div></div>`).join('')+'</div>';
 if(g.generic)h+=`<div class="warn">Plat non reconnu : voici une liste générique équilibrée. Ajoutez une clé IA pour des résultats sur mesure.</div>`;
 if(g.notes&&g.notes.length)h+=`<div class="warn">Adapté à votre profil : ${g.notes.map(esc).join(' ; ')}</div>`;
 h+=budgetMsg(tot)+`<button class="btn" onclick="go('liste')">Voir ma liste →</button></div>`;el.innerHTML=h;
}
function render(){
 renderGen();
 $('#listTitle').textContent=list.title?'Ma liste : '+list.title:'Ma liste';
 const body=$('#listBody');
 if(!list.items.length){body.innerHTML='<div class="card empty">Votre liste est vide.<br>Allez dans « Demande » pour la générer ✨</div>';updateStats();return}
 const g={};list.items.forEach(i=>{(g[i.category]=g[i.category]||[]).push(i)});
 const cats=Object.keys(g).sort((a,b)=>(CAT_ORDER.indexOf(a)+99)%108-(CAT_ORDER.indexOf(b)+99)%108);
 body.innerHTML=cats.map(c=>`<div class="card"><h3>${esc(c)}</h3>${g[c].map(i=>`
  <div class="item${i.checked?' done':''}" data-id="${i.id}">
   <input type="checkbox" ${i.checked?'checked':''} aria-label="Cocher ${esc(i.name)}">
   <div class="nm"><div class="iname">${esc(i.name)}</div><div class="iprice" data-price="${pp(i).toFixed(2)}">${priceLine(i)}</div><span class="sub">en ${esc(i.unit)}</span>${i.alt?`<div class="sub alt">↺ ${esc(i.alt)}</div>`:''}</div>
   <input class="qty" type="number" min="0" step="any" inputmode="decimal" value="${i.quantity}" aria-label="Quantité">
   <button class="del" aria-label="Supprimer">✕</button></div>`).join('')}</div>`).join('');
 updateStats();
}
$('#listBody').addEventListener('change',e=>{
 const row=e.target.closest('.item');if(!row)return;const it=list.items.find(i=>i.id===row.dataset.id);if(!it)return;
 if(e.target.type==='checkbox'){it.checked=e.target.checked;row.classList.toggle('done',it.checked)}
 else if(e.target.classList.contains('qty')){const q=Math.max(0,+e.target.value||0);const known=P[it.name]||Object.keys(P).some(k=>norm(it.name).includes(norm(k)));it.price=+(known?priceFor(it.name,q,it.unit):(it.price||0)*q/(it.quantity||1)).toFixed(2);it.quantity=q;render()}
 save();updateStats();
});
$('#listBody').addEventListener('click',e=>{
 if(!e.target.classList.contains('del'))return;const id=e.target.closest('.item').dataset.id;
 list.items=list.items.filter(i=>i.id!==id);save();render();toast('Article supprimé');
});
$('#addBtn').onclick=()=>{
 const name=$('#addName').value.trim();if(!name){toast("Indiquez un nom d'article");return}
 const q=parseFloat(($('#addQty').value||'1').replace(',','.'))||1,u=$('#addUnit').value.trim()||'pièce';
 if(isBlocked(name).length)toast('⚠️ Cet article ne respecte pas votre profil');
 list.items.push({id:uid(),name,quantity:q,unit:u,category:guessCat(name),price:+priceFor(name,q,u).toFixed(2),alt:'',checked:false});
 save();render();$('#addName').value=$('#addQty').value=$('#addUnit').value='';toast('Article ajouté');
};

/* ---- Panier ---- */
$('#finish').onclick=()=>{const s=totals();if(!s.t){toast('Liste vide');return}
 if(!confirm(`Terminer les courses ? Total estimé : ${eur(s.cart)}. Les articles cochés seront retirés de la liste.`))return;
 const hist=LS.get('history',[]);hist.push({date:new Date().toISOString(),title:list.title,total:s.cart});LS.set('history',hist.slice(-50));
 list.items=list.items.filter(i=>!i.checked);if(!list.items.length)list.title='';save();render();toast('Courses terminées 🎉');};
$('#reset').onclick=()=>{if(!confirm('Vider complètement la liste ?'))return;list={title:'',items:[]};save();render();$('#genResult').innerHTML='';toast('Liste vidée')};
