/* ====================== SIRALAMA SEKMESİ ====================== */
function hazirlikUyarisi(R){if(!R.md.tamam)return uyariHtml(t('err_'+R.md.sorun,sayi(R.md.eksik)));if(R.ag.hata)return uyariHtml(t('weightsFirst')+' '+hataMetni(R.ag));return ''}
function cizSirala(){const p=P(),R=hesapla();
  $('#sYontemler').innerHTML=SIRALAMA_YONTEM.map(y=>{const on=p.yontemler.includes(y);return `<button class="btn btn-sm ${on?'btn-primary':'btn-outline border-base-300'}" data-sy="${y}" aria-pressed="${on}" title="${esc(tAlt('yontemKisa',y))}">${on?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>':''}${esc(yontemAd(y))}</button>`}).join('');
  $$('[data-sy]').forEach(b=>b.onclick=()=>islem(()=>{const y=b.dataset.sy,L=P().yontemler;if(L.includes(y)){if(L.length>1)P().yontemler=L.filter(x=>x!==y);else tost(t('oneMethodMin'),'warning')}else P().yontemler=SIRALAMA_YONTEM.filter(x=>L.includes(x)||x===y);if(!P().yontemler.includes(P().ana))P().ana=P().yontemler[0]}));
  $('#sAna').innerHTML=p.yontemler.map(y=>`<option value="${y}" ${y===p.ana?'selected':''}>${esc(yontemAd(y))}</option>`).join('');
  $('#sV').value=p.param.v;$('#sL').value=p.param.lambda;
  const hu=hazirlikUyarisi(R);$('#sUyari').innerHTML=hu;if(hu){$('#sOzet').innerHTML='';$('#sSonuclar').innerHTML='';return}
  const ana=R.yon[p.ana];
  if(ana&&!ana.hata){const sira=R.md.A.map((_,i)=>i).sort((a,b)=>ana.sira[a]-ana.sira[b]);
    $('#sOzet').innerHTML=`<div class="bg-base-100 border border-base-300 rounded-box p-5 grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] gap-6 items-center">
      <div><p class="text-sm text-base-content/60">${esc(t('bestBy',yontemAd(p.ana)))}</p><p class="text-2xl font-semibold mt-1">${esc(sira.filter(i=>ana.sira[i]===1).map(i=>R.md.A[i]).join(', '))}</p>
        <p class="text-sm text-base-content/70 mt-2">${esc(t(ana.buyukIyi?'higherBetter':'lowerBetter'))}</p>${p.ana==='vikor'?`<p class="text-sm mt-2">${esc(t('vikorCompromise',ana.vikor.uzlasi.map(i=>R.md.A[i]).join(', ')))}</p>`:''}
        <button class="btn btn-sm mt-4" id="sPng">PNG</button></div>
      <div class="grafik rounded-field overflow-hidden border border-base-300">${anaGrafik(R)}</div></div>`;
    $('#sPng').onclick=async()=>{try{const r=await svgPng(anaGrafik(R,true),3);indir(dosyaAd(P().ad)+'-'+p.ana+'.png',r.blob)}catch(e){tost(t('pngFail'),'error')}}}
  else $('#sOzet').innerHTML=uyariHtml(t('mainFailed',yontemAd(p.ana))+' '+hataMetni(ana));
  $('#sSonuclar').innerHTML=p.yontemler.map(y=>{const r=R.yon[y];if(!r)return '';if(r.hata)return kart(`<h2 class="font-semibold mb-2">${esc(yontemAd(y))}</h2>${uyariHtml(hataMetni(r))}`);
    const son=r.adimlar[r.adimlar.length-1];
    return `<div class="space-y-2"><div class="bg-base-100 border border-base-300 rounded-box p-4"><div class="flex flex-wrap items-center gap-2 mb-2"><h2 class="font-semibold mr-auto">${esc(yontemAd(y))}</h2><span class="text-xs text-base-content/60">${esc(t(r.buyukIyi?'higherBetter':'lowerBetter'))}</span>${ip('y_'+y)}</div>
      ${adimTablo(son,{ilk:row=>{const i=R.md.A.indexOf(row[0]);return i>=0&&r.sira[i]===1}})}</div>${adimlarHtml(r.adimlar.slice(0,-1),t('showStepsOf',yontemAd(y)))}</div>`}).join('')}
function anaGrafik(R,baslikli){const p=P(),r=R.yon[p.ana];const sira=R.md.A.map((_,i)=>i).sort((a,b)=>r.sira[a]-r.sira[b]);
  return cubukSvg(sira.map(i=>R.md.A[i]),sira.map(i=>r.skor[i]),{vurgu:0,baslik:baslikli?t('chartScores',yontemAd(p.ana)):null})}

/* ====================== KARŞILAŞTIRMA ====================== */
function isiRenk(s,m){const o=m>1?(s-1)/(m-1):0;return `background:color-mix(in oklab,var(--color-primary) ${Math.round((1-o)*55+4)}%,transparent)`}
function cizKarsilastir(){const R=hesapla();const hu=hazirlikUyarisi(R);$('#kUyari').innerHTML=hu;if(hu){$('#kSira').innerHTML=$('#kSpearman').innerHTML='';$('#kSpearmanOzet').textContent='';return}
  const K=karsilastirma(R);if(!K){$('#kUyari').innerHTML=uyariHtml(t('noValidMethod'));$('#kSira').innerHTML=$('#kSpearman').innerHTML='';return}
  const m=K.m;const satirSira=R.md.A.map((_,i)=>i).sort((a,b)=>K.genel[a]-K.genel[b]);
  $('#kSira').innerHTML=`<table class="stablo"><thead><tr><th>${esc(t('alternative'))}</th>${K.L.map(y=>`<th class="n">${esc(yontemAd(y))}</th>`).join('')}<th class="n">${esc(t('colMeanRank'))}</th><th class="n">${esc(t('colOverall'))}</th></tr></thead><tbody>
    ${satirSira.map(i=>`<tr><th class="font-medium text-left">${esc(R.md.A[i])}</th>${K.L.map(y=>{const s=R.yon[y].sira[i];return `<td class="n"><span class="isi" style="${isiRenk(s,m)}">${s}</span></td>`}).join('')}<td class="n">${esc(sayi(K.ortalama[i],2))}</td><td class="n font-semibold">${K.genel[i]}</td></tr>`).join('')}</tbody></table>`;
  if(K.L.length<2){$('#kSpearman').innerHTML=`<p class="p-4 text-sm text-base-content/60">${esc(t('needTwoMethods'))}</p>`;$('#kSpearmanOzet').textContent='';return}
  $('#kSpearman').innerHTML=`<table class="stablo"><thead><tr><th></th>${K.L.map(y=>`<th class="n">${esc(yontemAd(y))}</th>`).join('')}</tr></thead><tbody>${K.L.map((a,i)=>`<tr><th class="font-medium text-left">${esc(yontemAd(a))}</th>${K.rho[i].map((v,j)=>`<td class="n"><span class="isi" style="${i===j?'':`background:color-mix(in oklab,var(--color-secondary) ${Math.round(Math.max(0,v)*45)}%,transparent)`}">${esc(sayi(v,3))}</span></td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const ilkAyni=new Set(K.ilk).size===1;$('#kSpearmanOzet').textContent=t('spearmanSummary',sayi(K.min,3),sayi(K.max,3))+' '+(ilkAyni?t('sameFirst',R.md.A[K.ilk[0]]):t('diffFirst'))}

/* ====================== DUYARLILIK ====================== */
function cizDuyarlilik(){const p=P(),R=hesapla();const L=gecerliYontemler(R);if(!L.includes(p.duyarlilik.yontem))p.duyarlilik.yontem=L.includes(p.ana)?p.ana:(L[0]||'');
  $('#dYontem').innerHTML=L.map(y=>`<option value="${y}" ${y===p.duyarlilik.yontem?'selected':''}>${esc(yontemAd(y))}</option>`).join('');$('#dOran').value=p.duyarlilik.oranlar;
  const hu=hazirlikUyarisi(R);$('#dUyari').innerHTML=hu||(!L.length?uyariHtml(t('noValidMethod')):'');if(hu||!L.length){$('#dOzet').innerHTML=$('#dTablo').innerHTML='';return}
  const or=oranlarOku(p.duyarlilik.oranlar);if(!or.length){$('#dUyari').innerHTML=uyariHtml(t('sensNoRates'));$('#dOzet').innerHTML=$('#dTablo').innerHTML='';return}
  const D=duyarlilik(R,p.duyarlilik.yontem,or);if(!D||!D.senaryo.length){$('#dOzet').innerHTML=uyariHtml(t('sensNone'));$('#dTablo').innerHTML='';return}
  const md=R.md,ilk=D.temel.sira.indexOf(1);const n=D.senaryo.length;
  $('#dOzet').innerHTML=`<div class="grid sm:grid-cols-3 gap-3">${[[t('sensScenarios'),sayi(n)],[t('sensFirstSame',md.A[ilk]),`${sayi(D.ilkAyni)} / ${sayi(n)}`],[t('sensRhoMin'),sayi(D.rhoMin,3)]].map(([a,b])=>`<div class="bg-base-100 border border-base-300 rounded-box p-4"><p class="text-sm text-base-content/60">${esc(a)}</p><p class="text-2xl font-semibold mt-1 rakam">${esc(b)}</p></div>`).join('')}</div>
    <p class="text-sm text-base-content/75 mt-3">${esc(t(D.ilkAyni===n?'sensRobust':'sensNotRobust',sayi(D.ayni),sayi(n)))}</p>`;
  const bas=`<thead><tr><th>${esc(t('criterion'))}</th><th class="n">${esc(t('colChange'))}</th><th class="n">${esc(t('colNewWeight'))}</th>${md.A.map(a=>`<th class="n">${esc(kisalt(a,14))}</th>`).join('')}<th class="n">ρ</th></tr></thead>`;
  const temelSat=`<tr class="bg-base-200"><th class="text-left">${esc(t('baseCase'))}</th><td class="n">-</td><td class="n">-</td>${md.A.map((_,i)=>`<td class="n font-semibold">${D.temel.sira[i]}</td>`).join('')}<td class="n">1</td></tr>`;
  $('#dTablo').innerHTML=`<table class="stablo">${bas}<tbody>${temelSat}${D.senaryo.map(s=>`<tr><th class="font-medium text-left">${esc(md.C[s.j])}</th><td class="n">${esc(yuzdeYaz(s.o))}</td><td class="n">${esc(fmt(s.w[s.j]))}</td>${s.sira.map((x,i)=>`<td class="n">${x!==D.temel.sira[i]?`<span class="isi" style="background:color-mix(in oklab,var(--color-warning) 30%,transparent)">${x}</span>`:x}</td>`).join('')}<td class="n">${esc(sayi(s.rho,3))}</td></tr>`).join('')}</tbody></table>`}
