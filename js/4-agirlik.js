/* ====================== AĞIRLIKLAR SEKMESİ ====================== */
const AGIRLIK_TUR={esit:'tagBasic',dogrudan:'tagSubjective',ahp:'tagSubjective',bwm:'tagSubjective',entropi:'tagObjective',critic:'tagObjective',sd:'tagObjective',merec:'tagObjective'};
const kart=(ic,cls='')=>`<div class="bg-base-100 border border-base-300 rounded-box p-4 ${cls}">${ic}</div>`;
function cizAgirlik(){const p=P(),y=p.agirlik.yontem;
  $('#aYontemler').innerHTML=AGIRLIK_YONTEM.map(k=>`<button role="radio" aria-checked="${k===y}" data-ay="${k}" class="text-left rounded-box border p-3 transition-colors ${k===y?'border-primary bg-primary/5 ring-1 ring-primary':'border-base-300 bg-base-100 hover:border-base-content/30'}">
    <span class="flex items-center gap-2"><span class="font-semibold">${esc(yontemAd(k))}</span><span class="badge badge-xs ${AGIRLIK_TUR[k]==='tagObjective'?'badge-secondary':AGIRLIK_TUR[k]==='tagSubjective'?'badge-accent':'badge-ghost'}">${esc(t(AGIRLIK_TUR[k]))}</span></span>
    <span class="block text-xs text-base-content/65 mt-1 leading-snug">${esc(tAlt('yontemKisa',k))}</span></button>`).join('');
  $$('[data-ay]').forEach(b=>b.onclick=()=>{if(P().agirlik.yontem!==b.dataset.ay)islem(()=>{P().agirlik.yontem=b.dataset.ay})});
  const md=matrisDurum();let panel='';
  if(md.Cid.length<2)panel=uyariHtml(t('err_needCriteria'));
  else if(y==='esit')panel=kart(`<p class="text-sm leading-relaxed">${esc(t('equalNote',sayi(md.Cid.length)))}</p>`);
  else if(y==='dogrudan')panel=dogrudanPanel(md);
  else if(y==='ahp')panel=ahpPanel(md);
  else if(y==='bwm')panel=bwmPanel(md);
  else panel=kart(`<div class="text-sm leading-relaxed ipucu-metin">${guvenliHtml(tAlt('yontemAcik',y))}</div>`);
  $('#aPanel').innerHTML=panel;agirlikOlaylari(md);cizAgirlikSonuc()}
function cizAgirlikSonuc(){const R=hesapla(),ag=R.ag,md=R.md;
  if(ag.hata){$('#aSonuc').innerHTML=uyariHtml(hataMetni(ag));$('#aAdimlar').innerHTML='';$('#aGrafikPng').classList.add('hidden');rozetler();return}
  const sira=ag.w.map((w,j)=>j).sort((a,b)=>ag.w[b]-ag.w[a]);
  const mx=enb(ag.w),sr=siraBul(ag.w);
  $('#aSonuc').innerHTML=`<div class="space-y-2">${(ag.uyari||[]).map(u=>uyariHtml(u)).join('')}</div>${agirlikOzet(ag)}<ol class="mt-4 space-y-2.5">${sira.map(j=>`<li><div class="flex items-baseline gap-2 text-sm"><span class="rakam text-xs text-base-content/50 w-5">${sr[j]}</span><span class="flex-1 min-w-0 truncate" title="${esc(md.C[j])}">${esc(md.C[j])}</span><span class="rakam font-semibold">${esc(fmt(ag.w[j]))}</span></div>
    <div class="ml-7 h-2 rounded-full bg-base-200 mt-1"><div class="h-2 rounded-full ${sr[j]===1?'bg-primary':'bg-primary/55'}" style="width:${(ag.w[j]/mx*100).toFixed(1)}%"></div></div></li>`).join('')}</ol>`;
  $('#aGrafikPng').classList.remove('hidden');$('#aAdimlar').innerHTML=adimlarHtml(ag.adimlar);rozetler()}
function agirlikOzet(ag){if(ag.ahp){const a=ag.ahp;const iyi=a.cr<=0.1;return `<div class="flex flex-wrap gap-2 text-sm"><span class="badge ${iyi?'badge-success':'badge-warning'}">CR = ${esc(sayi(a.cr,4))}</span>${a.lmax!=null?`<span class="badge badge-ghost">λmax = ${esc(sayi(a.lmax,4))}</span><span class="badge badge-ghost">CI = ${esc(sayi(a.ci,4))}</span>`:''}${a.birlestir?`<span class="badge badge-ghost">${esc(t(a.birlestir==='aij'?'aggAij':'aggAip'))}</span>`:''}</div>`}
  if(ag.bwm)return `<div class="flex flex-wrap gap-2 text-sm">${ag.bwm.map((b,k)=>`<span class="badge ${b.esik!=null&&b.crI>b.esik?'badge-warning':'badge-success'}">${esc((b.ad||t('expertN',k+1))+': ξᴸ = '+sayi(b.xi,4)+', CRᴵ = '+sayi(b.crI,4))}</span>`).join('')}</div>`;return ''}

/* ---------- Doğrudan puan ---------- */
function dogrudanPanel(md){const d=P().agirlik.dogrudan;const top_=topla(md.Cid.map(id=>Math.max(0,+d[id]||0)));
  return kart(`<p class="text-sm text-base-content/70 mb-3">${esc(t('directLead'))}</p><div class="overflow-x-auto"><table class="stablo"><thead><tr><th>${esc(t('criterion'))}</th><th class="n">${esc(t('colScore'))}</th><th class="n">${esc(t('colWeight'))}</th></tr></thead><tbody>
    ${md.Cid.map((id,j)=>`<tr><th class="font-medium text-left">${esc(md.C[j])}</th><td class="n"><input type="text" inputmode="decimal" class="input input-sm w-28 text-right" data-dg="${esc(id)}" value="${d[id]==null?'':esc(sayiYaz(d[id]))}"></td><td class="n">${top_>0?esc(fmt((Math.max(0,+d[id]||0))/top_)):'-'}</td></tr>`).join('')}</tbody></table></div>`)}

/* ---------- Uzman çubuğu (AHP ve BWM ortak) ---------- */
function uzmanCubugu(tur,secili){const U=P().agirlik[tur].uzmanlar;
  return `<div class="flex flex-wrap items-center gap-2"><h2 class="font-semibold mr-1">${esc(t('experts'))}</h2>${ip(tur==='ahp'?'ahpUzman':'bwmUzman')}
    <div class="flex flex-wrap gap-1">${U.map((u,k)=>`<button class="btn btn-sm ${u.id===secili?'btn-primary':'btn-ghost border-base-300'}" data-usec="${esc(u.id)}">${esc(u.ad||t('expertN',k+1))}</button>`).join('')}</div>
    <button class="btn btn-sm btn-outline" data-uekle="${tur}">+ ${esc(t('addExpert'))}</button></div>
    ${secili?`<div class="flex flex-wrap items-center gap-2 mt-3"><input class="input input-sm w-56" data-uad="${esc(secili)}" value="${esc(U.find(u=>u.id===secili).ad)}" placeholder="${esc(t('expertNamePh'))}" aria-label="${esc(t('expertName'))}">
      ${tur==='ahp'?`<button class="btn btn-sm" data-ahpyap="${esc(secili)}">${esc(t('pasteMatrix'))}</button>`:''}<button class="btn btn-sm btn-ghost text-error" data-usil="${esc(secili)}">${esc(t('deleteExpert'))}</button></div>`:''}`}
function seciliUzman(tur){const U=P().agirlik[tur].uzmanlar;const k=tur==='ahp'?'ahpU':'bwmU';if(!U.some(u=>u.id===S[k]))S[k]=U[0]?.id||null;return S[k]}

/* ---------- AHP ---------- */
const pozDeger=p=>p<8?9-p:p>8?1/(p-7):1;
function degerPoz(v){if(v==null)return null;if(v>=1){const r=Math.round(v);return Math.max(0,8-(Math.min(9,r)-1))}const r=Math.round(1/v);return Math.min(16,8+(Math.min(9,r)-1))}
function ahpPanel(md){const p=P(),A=p.agirlik.ahp,sec=seciliUzman('ahp');const U=A.uzmanlar;
  let ic=uzmanCubugu('ahp',sec);
  if(U.length>1)ic+=`<label class="flex flex-wrap items-center gap-2 text-sm mt-3"><span>${esc(t('aggMethod'))}</span><select class="select select-sm w-72" id="ahpBir"><option value="aij" ${A.birlestir==='aij'?'selected':''}>${esc(t('aggAij'))}</option><option value="aip" ${A.birlestir==='aip'?'selected':''}>${esc(t('aggAip'))}</option></select>${ip('ahpBirlestir')}</label>`;
  if(!sec)return kart(ic+`<p class="text-sm text-base-content/65 mt-3">${esc(t('ahpNoExpertLead'))}</p>`);
  const u=U.find(x=>x.id===sec),n=md.Cid.length;const Am=ahpMatris(u.m,md.Cid);const eksik=Am.flat().filter(x=>x==null).length/2;let durum='';
  if(eksik)durum=`<span class="badge badge-warning">${esc(t('missingJudgements',sayi(eksik),sayi(n*(n-1)/2)))}</span>`;else{const tt=tutarlilik(Am);durum=`<span class="badge ${tt.cr<=0.1?'badge-success':'badge-warning'}">CR = ${esc(sayi(tt.cr,4))}</span>`;
    if(tt.cr>0.1&&n>2){const e=enTutarsiz(Am,tt.w);durum+=` <span class="text-xs text-base-content/70">${esc(t('ahpSuggest',md.C[e.i],md.C[e.j],saatyYaz(Am[e.i][e.j]),saatyYaz(e.oneri)))}</span>`}}
  const olcekEt=[9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9];
  const satirlar=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const v=Am[i][j],pz=degerPoz(v);
    satirlar.push(`<div class="grid grid-cols-1 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,10rem)] items-center gap-2 py-2 border-b border-base-300 last:border-0">
      <span class="text-sm font-medium md:text-right truncate" title="${esc(md.C[i])}">${esc(md.C[i])}</span>
      <div class="olcek" role="group" aria-label="${esc(md.C[i]+' / '+md.C[j])}">${olcekEt.map((e,k)=>`<button type="button" class="${k===8?'orta':''}" data-ahp="${i}|${j}|${k}" aria-pressed="${pz===k}" title="${esc(olcekIpucu(k,md.C[i],md.C[j]))}">${e}</button>`).join('')}</div>
      <span class="text-sm font-medium truncate" title="${esc(md.C[j])}">${esc(md.C[j])}</span></div>`)}
  ic+=`<div class="flex flex-wrap items-center gap-2 mt-4 mb-1"><h3 class="font-semibold text-sm mr-auto">${esc(t('pairwiseFor',u.ad||t('expertN',U.indexOf(u)+1)))}</h3>${durum}</div>
    <p class="text-xs text-base-content/60 mb-2">${esc(t('scaleNote'))}</p><div>${satirlar.join('')}</div>`;
  return kart(ic)}
function olcekIpucu(k,a,b){if(k===8)return t('scaleEqual',a,b);const v=k<8?9-k:k-7;const kim=k<8?a:b,diger=k<8?b:a;return t('scaleMore',kim,diger,v,tAlt('saaty',String(v))||'')}
function ahpYapistir(uid_){const md=matrisDurum();pencere(t('pasteMatrix'),`<p class="text-sm text-base-content/70 mb-2">${esc(t('pasteMatrixLead',sayi(md.Cid.length)))}</p><textarea id="amMetin" class="textarea w-full font-mono text-xs" rows="8"></textarea>`,
  [{ad:t('cancel'),d:null},{ad:t('apply'),c:'btn-primary',f:()=>{const sat=$('#amMetin').value.replace(/\r/g,'').split('\n').map(r=>r.trim()).filter(Boolean).map(r=>r.split(/\t|;|\s+/).filter(Boolean));
    let M=sat.map(r=>r.map(sayiOku));if(M.length&&M[0].some(x=>x==null))M=M.slice(1).map(r=>r.slice(1));else if(M.length&&M.every(r=>r[0]==null))M=M.map(r=>r.slice(1));
    const n=md.Cid.length;if(M.length<n||M.slice(0,n).some(r=>r.length<n||r.slice(0,n).some(x=>x==null||x<=0))){tost(t('matrixPasteBad',sayi(n)),'error');return false}
    islem(()=>{const u=P().agirlik.ahp.uzmanlar.find(x=>x.id===uid_);u.m={};for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)u.m[md.Cid[i]+'|'+md.Cid[j]]=M[i][j]});tost(t('pasted'))}}],{acilinca:()=>$('#amMetin').focus()})}

/* ---------- BWM ---------- */
function bwmPanel(md){const B=P().agirlik.bwm,sec=seciliUzman('bwm');let ic=uzmanCubugu('bwm',sec);
  if(!sec)return kart(ic+`<p class="text-sm text-base-content/65 mt-3">${esc(t('bwmNoExpertLead'))}</p>`);
  const u=B.uzmanlar.find(x=>x.id===sec);const sec1=(ad,k)=>`<label class="flex flex-col gap-1 text-sm"><span class="font-medium">${esc(t(ad))}</span><select class="select select-sm w-56" data-bsec="${k}"><option value="">${esc(t('choose'))}</option>${md.Cid.map((id,j)=>`<option value="${esc(id)}" ${u[k]===id?'selected':''}>${esc(md.C[j])}</option>`).join('')}</select></label>`;
  ic+=`<div class="flex flex-wrap gap-4 mt-4">${sec1('bwmBest','en')}${sec1('bwmWorst','kotu')}</div>`;
  if(u.en&&u.kotu){const sc=(k,id,v,kilit)=>`<select class="select select-sm w-20" data-bv="${k}|${esc(id)}" ${kilit?'disabled':''}>${kilit?'<option>1</option>':`<option value=""></option>${[1,2,3,4,5,6,7,8,9].map(x=>`<option ${+v===x?'selected':''}>${x}</option>`).join('')}`}</select>`;
    const enAd=md.C[md.Cid.indexOf(u.en)],kotuAd=md.C[md.Cid.indexOf(u.kotu)];
    ic+=`<p class="text-xs text-base-content/60 mt-4 mb-2">${esc(t('bwmScaleNote'))}</p><div class="overflow-x-auto"><table class="stablo"><thead><tr><th>${esc(t('criterion'))}</th><th class="n !whitespace-normal min-w-32">${esc(t('colBO',enAd))}</th><th class="n !whitespace-normal min-w-32">${esc(t('colOW',kotuAd))}</th></tr></thead><tbody>
      ${md.Cid.map((id,j)=>`<tr><th class="font-medium text-left">${esc(md.C[j])}</th><td class="n">${sc('bo',id,u.bo[id],id===u.en)}</td><td class="n">${sc('ow',id,u.ow[id],id===u.kotu)}</td></tr>`).join('')}</tbody></table></div>`}
  return kart(ic)}

/* ---------- Olaylar ---------- */
function agirlikOlaylari(md){const p=P();
  $$('[data-dg]').forEach(e=>e.onchange=()=>{const v=e.value.trim()===''?null:sayiOku(e.value);if(e.value.trim()!==''&&(v==null||v<0)){tost(t('notNumber'),'warning');return}islem(()=>{if(v==null)delete p.agirlik.dogrudan[e.dataset.dg];else p.agirlik.dogrudan[e.dataset.dg]=v})});
  $$('[data-usec]').forEach(b=>b.onclick=()=>{S[p.agirlik.yontem==='ahp'?'ahpU':'bwmU']=b.dataset.usec;cizAgirlik()});
  $$('[data-uekle]').forEach(b=>b.onclick=()=>{const tur=b.dataset.uekle;const id=uid();islem(()=>{const L=p.agirlik[tur].uzmanlar;L.push(tur==='ahp'?{id,ad:'',m:{}}:{id,ad:'',en:null,kotu:null,bo:{},ow:{}})},{cizme:true});S[tur==='ahp'?'ahpU':'bwmU']=id;ciz();const e=$(`[data-uad="${id}"]`);e&&e.focus()});
  $$('[data-uad]').forEach(e=>e.onchange=()=>{const tur=p.agirlik.yontem;const u=p.agirlik[tur].uzmanlar.find(x=>x.id===e.dataset.uad);if(u&&u.ad!==e.value.trim())islem(()=>{u.ad=e.value.trim()})});
  $$('[data-usil]').forEach(b=>b.onclick=async()=>{const tur=p.agirlik.yontem;const u=p.agirlik[tur].uzmanlar.find(x=>x.id===b.dataset.usil);if(!(await sor(t('deleteExpertQ',u.ad||'-'),t('delete'),1)))return;islem(()=>{p.agirlik[tur].uzmanlar=p.agirlik[tur].uzmanlar.filter(x=>x.id!==u.id)})});
  $$('[data-ahpyap]').forEach(b=>b.onclick=()=>ahpYapistir(b.dataset.ahpyap));
  const bir=$('#ahpBir');if(bir)bir.onchange=()=>islem(()=>{p.agirlik.ahp.birlestir=bir.value});
  $$('[data-ahp]').forEach(b=>b.onclick=()=>{const [i,j,k]=b.dataset.ahp.split('|').map(Number);const u=p.agirlik.ahp.uzmanlar.find(x=>x.id===S.ahpU);const a=md.Cid[i],c=md.Cid[j];
    const y=$('#ana').scrollTop;islem(()=>{delete u.m[c+'|'+a];u.m[a+'|'+c]=pozDeger(k)});$('#ana').scrollTop=y;const nb=$(`[data-ahp="${i}|${j}|${k}"]`);nb&&nb.focus()});
  $$('[data-bsec]').forEach(s=>s.onchange=()=>{const u=p.agirlik.bwm.uzmanlar.find(x=>x.id===S.bwmU);islem(()=>{u[s.dataset.bsec]=s.value||null;if(u.en&&u.kotu){u.bo[u.en]=1;u.ow[u.kotu]=1}})});
  $$('[data-bv]').forEach(s=>s.onchange=()=>{const u=p.agirlik.bwm.uzmanlar.find(x=>x.id===S.bwmU);const [k,id]=s.dataset.bv.split('|');const v=s.value?+s.value:null;
    islem(()=>{if(v==null)delete u[k][id];else u[k][id]=v;/* a_BW hem en iyinin en kötüye hem en kötünün... aynı yargıdır: iki yönde eş tutulur */
      if(k==='bo'&&id===u.kotu){if(v==null)delete u.ow[u.en];else u.ow[u.en]=v}if(k==='ow'&&id===u.en){if(v==null)delete u.bo[u.kotu];else u.bo[u.kotu]=v}})})}
