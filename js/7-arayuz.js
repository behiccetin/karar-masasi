/* ====================== ÇİZİM: GENEL ====================== */
function metinleriYaz(){document.documentElement.lang=S.dil;
  $$('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
  $$('[data-tp]').forEach(e=>e.placeholder=t(e.dataset.tp));
  $$('[data-tg]').forEach(e=>{const [g,k]=e.dataset.tg.split('.');e.textContent=tAlt(g,k)});
  $$('[data-ta]').forEach(e=>{e.setAttribute('aria-label',t(e.dataset.ta));e.title=t(e.dataset.ta)});
  $$('[data-ip]').forEach(e=>e.innerHTML=ip(e.dataset.ip));ipKapat();
  $('#kayitDurum').textContent=S.kaydedildi?t('saved'):'';$('#surumYaz').textContent=SURUM;
  $('#doiYaz').innerHTML=DOI?` DOI: <a class="link" href="https://doi.org/${DOI}" target="_blank" rel="noopener noreferrer">${DOI}</a>`:'';
  $('#dilSecM').innerHTML=$('#dilSec').innerHTML=Object.entries(DILLER).sort((a,b)=>a[1]._ad.localeCompare(b[1]._ad)).map(([k,v])=>`<option value="${esc(k)}" ${k===S.dil?'selected':''}>${esc(v._ad||k)}</option>`).join('');
  sekmeIsaretle()}
function sekmeIsaretle(){$$('[role=tab][data-sekme]').forEach(b=>{const on=b.dataset.sekme===S.sekme;b.classList.toggle('tab-active',on);b.setAttribute('aria-selected',on)})}
function sekmeAc(s){S.sekme=s;$$('.sekme').forEach(e=>e.classList.add('hidden'));$('#s-'+s).classList.remove('hidden');sekmeIsaretle();$('#ana').scrollTop=0;ciz()}
function rozetler(){const R=hesapla();const e=R.md.eksik;$('#rozetMatris').textContent=sayi(e);$('#rozetMatris').classList.toggle('hidden',!e);
  const ah=!!R.ag.hata&&R.md.Cid.length>=2&&!(OBJEKTIF.has(P().agirlik.yontem)&&!R.md.tamam);$('#rozetAgirlik').textContent='!';$('#rozetAgirlik').classList.toggle('hidden',!ah);
  $('#sekmelerMobil').innerHTML=$('#sekmeler').innerHTML.replace(/ id="[^"]*"/g,'');$$('#sekmelerMobil [data-sekme]').forEach(b=>b.onclick=()=>sekmeAc(b.dataset.sekme))}
/* Yeniden çizim sırasında silinen bir kutu blur/change tetikleyebilir; iç içe çizim bir sonraki tura ertelenir. */
let cizimde=false;
function ciz(){if(cizimde){setTimeout(ciz,0);return}cizimde=true;try{$('#projeAd').value=P().ad||'';rozetler();
  ({giris:cizGiris,matris:cizMatris,agirlik:cizAgirlik,sirala:cizSirala,karsilastir:cizKarsilastir,duyarlilik:cizDuyarlilik,rapor:cizRapor})[S.sekme]()}finally{cizimde=false}}

/* ====================== ANA SAYFA ====================== */
const LOGO=`<svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4v23M8 27h16M5 10h22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 10 1.5 18h7zM27 10l-3.5 8h7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M1.5 18a3.5 2 0 0 0 7 0zM23.5 18a3.5 2 0 0 0 7 0z" fill="#E7B65C"/><circle cx="16" cy="4.5" r="2" fill="#E7B65C"/></svg>`;
function cizGiris(){const g=k=>tAlt('giris',k),p=P(),dolu=p.alternatifler.length>0;const dugme=(arac,ad,cls)=>`<button class="btn ${cls}" data-garac="${arac}">${esc(ad)}</button>`;
  const devam=dolu?`<div class="bg-base-100 border border-base-300 rounded-box p-5 flex flex-wrap items-center gap-4"><div class="flex-1 min-w-48"><p class="text-sm text-base-content/60">${esc(g('devam'))}</p><p class="font-semibold text-lg">${esc(p.ad)}</p>
      <p class="text-sm text-base-content/60">${esc(t('matrixSummary',sayi(p.alternatifler.length),sayi(p.kriterler.length),sayi(p.kriterler.filter(k=>k.yon==='max').length),sayi(p.kriterler.filter(k=>k.yon==='min').length)))}</p></div><button class="btn btn-primary" data-garac="devam">${esc(g('devamBtn'))}</button></div>`:'';
  const yontemListe=(L)=>`<ul class="space-y-2.5">${L.map(y=>`<li><span class="font-semibold">${esc(yontemAd(y))}</span> <span class="text-base-content/70">${esc(tAlt('yontemKisa',y))}</span></li>`).join('')}</ul>`;
  $('#s-giris').innerHTML=`<div class="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16">
    <div class="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-10 items-center">
      <div>
        <div class="flex items-center gap-3 mb-6 text-primary">${LOGO}<span class="text-lg font-semibold text-base-content">Karar Masası</span><span class="badge badge-ghost badge-sm">v${SURUM}</span><button class="btn btn-xs btn-ghost ml-1 text-base-content" data-garac="atif">${esc(ga('atif','dugme'))}</button></div>
        <h1 class="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight max-w-xl">${esc(g('baslik'))}</h1>
        <p class="mt-5 text-base-content/75 leading-relaxed max-w-xl">${esc(g('alt'))}</p>
        <div class="flex flex-wrap gap-2 mt-8">${dugme('yeni',t('newProject'),'btn-primary')}${dugme('ornek',t('loadSample'),'btn-outline')}${dugme('ac',t('openProject'),'btn-ghost')}</div>
        ${dolu?'':`<p class="text-sm text-base-content/60 mt-4 max-w-xl">${esc(g('ornekNot'))}</p>`}
      </div>
      <div class="bg-base-100 border border-base-300 rounded-box p-5 sm:p-7 shadow-sm" aria-hidden="true">${girisDemo()}</div>
    </div>
    ${devam}
    <div class="grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-6"><h2 class="text-2xl font-semibold">${esc(g('neBaslik'))}</h2>
      <div class="space-y-4 text-base-content/80 leading-relaxed max-w-3xl"><p>${esc(g('ne1'))}</p><p>${esc(g('ne2'))}</p></div></div>
    <div><h2 class="text-2xl font-semibold mb-6">${esc(g('adimBaslik'))}</h2>
      <ol class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">${(g('adimlar')||[]).map(([b,a],i)=>`<li class="bg-base-100 border border-base-300 rounded-box p-5"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-content font-semibold text-sm">${i+1}</span><h3 class="font-semibold mt-3">${esc(b)}</h3><p class="text-sm text-base-content/70 mt-1 leading-relaxed">${esc(a)}</p></li>`).join('')}</ol></div>
    <div><h2 class="text-2xl font-semibold mb-6">${esc(g('yontemBaslik'))}</h2>
      <div class="grid md:grid-cols-2 gap-10 text-sm leading-relaxed">
        <div><h3 class="font-semibold text-base pb-2 mb-3 border-b border-base-300">${esc(g('agirlikBaslik'))}</h3>${yontemListe(AGIRLIK_YONTEM)}</div>
        <div><h3 class="font-semibold text-base pb-2 mb-3 border-b border-base-300">${esc(g('siraBaslik'))}</h3>${yontemListe(SIRALAMA_YONTEM)}</div></div></div>
    <div><h2 class="text-2xl font-semibold mb-6">${esc(g('ozBaslik'))}</h2>
      <div class="grid md:grid-cols-3 gap-8">${(g('ozGruplar')||[]).map(([b,L])=>`<div><h3 class="font-semibold pb-2 mb-3 border-b border-base-300">${esc(b)}</h3><ul class="space-y-2 text-sm text-base-content/80">${L.map(x=>`<li class="flex gap-2"><svg class="mt-0.5 flex-none text-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg><span>${esc(x)}</span></li>`).join('')}</ul></div>`).join('')}</div></div>
    <div class="grid md:grid-cols-2 gap-10">
      <div><h2 class="text-2xl font-semibold mb-4">${esc(g('kimBaslik'))}</h2><ul class="space-y-3 text-base-content/80">${(g('kimler')||[]).map(x=>`<li class="border-l-2 border-primary pl-3">${esc(x)}</li>`).join('')}</ul></div>
      <div><h2 class="text-2xl font-semibold mb-4">${esc(g('guvenBaslik'))}</h2><div class="space-y-3 text-base-content/80 leading-relaxed">${(g('guven')||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div></div>
    </div>
    <div class="bg-base-100 border border-base-300 rounded-box p-6 flex flex-wrap items-center gap-4"><p class="font-semibold text-lg flex-1 min-w-48">${esc(g('basla'))}</p><div class="flex flex-wrap gap-2">${dugme('yeni',t('newProject'),'btn-primary')}${dugme('ornek',t('loadSample'),'btn-outline')}${dugme('ac',t('openProject'),'btn-ghost')}</div></div>
    ${girisAtifHtml()}
  </div>`;
  $$('[data-garac]').forEach(b=>b.onclick=()=>{const a=b.dataset.garac;if(a==='devam'){sekmeAc(sonAsama());return}if(a==='atif'){atifPencere();return}ARAC[a]()});
  $$('[data-gkop]').forEach(b=>b.onclick=()=>kopyala(atifMetinleri()[b.dataset.gkop]))}
/* Ana sayfadaki örnek kart gerçek hesaptan gelir: örnek proje AHP ağırlıkları ve TOPSIS. */
function girisDemo(){const g=k=>tAlt('giris',k);const op=ornekProje(),md=matrisDurum(op),ag=agirlikHesap(op,md);if(ag.hata)return '';const r=SIRALA.topsis(md.X,md.yon,ag.w,baglam(op,md));
  const sw=ag.w.map((w,j)=>j).sort((a,b)=>ag.w[b]-ag.w[a]),sa=md.A.map((_,i)=>i).sort((a,b)=>r.sira[a]-r.sira[b]),mx=enb(ag.w);
  return `<p class="text-xs text-base-content/55">${esc(g('demoUst'))}</p><p class="text-lg font-semibold leading-snug mt-1">${esc(op.ad.replace(/^[^:]+:\s*/,''))}</p>
    <div class="grid sm:grid-cols-2 gap-6 mt-5"><div><p class="text-xs font-semibold text-base-content/60 mb-2">${esc(g('demoAgirlik'))}</p><div class="space-y-1.5">${sw.map(j=>`<div class="text-xs"><div class="flex justify-between gap-2"><span class="truncate">${esc(md.C[j])}</span><span class="rakam text-base-content/70">${esc(sayi(ag.w[j],3))}</span></div><div class="h-1.5 rounded-full bg-base-200 mt-1"><div class="h-1.5 rounded-full bg-secondary" style="width:${(ag.w[j]/mx*100).toFixed(1)}%"></div></div></div>`).join('')}</div></div>
    <div><p class="text-xs font-semibold text-base-content/60 mb-2">${esc(g('demoSira'))}</p><ol class="space-y-1.5">${sa.map((i,k)=>`<li class="flex items-center gap-2 text-sm ${k===0?'font-semibold':''}"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${k===0?'bg-primary text-primary-content':'bg-base-200'}">${r.sira[i]}</span><span class="flex-1 truncate">${esc(md.A[i])}</span><span class="rakam text-xs text-base-content/60">${esc(sayi(r.skor[i],3))}</span></li>`).join('')}</ol></div></div>
    <p class="text-xs text-base-content/55 mt-5">${esc(doldur(g('demoAlt'),{cr:sayi(ag.ahp.cr,3)}))}</p>`}
function girisAtifHtml(){const a=atifMetinleri();
  return `<section class="border-t border-base-300 pt-10 grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-6"><h2 class="text-2xl font-semibold">${esc(ga('atif','baslik'))}</h2>
    <div class="max-w-3xl"><p class="text-base-content/80 leading-relaxed">${esc(ga('atif','ne'))}</p>${doiSatiri()}
    <div class="mt-4 bg-base-100 border border-base-300 rounded-box p-4"><div class="flex items-center justify-between gap-3"><h3 class="text-sm font-semibold">${esc(ga('atif','apa'))}</h3><button class="btn btn-xs" data-gkop="apa">${esc(ga('atif','kopyala'))}</button></div>
    <p class="mt-2 text-sm leading-relaxed pl-6 -indent-6 break-words">${esc(a.apa)}</p></div>
    <button class="btn btn-sm btn-ghost mt-3" data-garac="atif">${esc(ga('atif','digerBicim'))}</button></div></section>`}
function sonAsama(){const R=hesapla();if(!R.md.tamam)return 'matris';if(R.ag.hata)return 'agirlik';return 'sirala'}

/* ====================== ÖRNEK PROJE (kurgusal veri) ====================== */
const ORNEK={ad:['Örnek: Lojistik depo yeri seçimi','Sample: Choosing a logistics warehouse site'],
  alt:[['Aday yer A','Aday yer B','Aday yer C','Aday yer D','Aday yer E'],['Site A','Site B','Site C','Site D','Site E']],
  krit:[['Arazi maliyeti (TL/m²)','Otoyola uzaklık (km)','Nitelikli işgücü (1-10)','Altyapı puanı (1-10)','Genişleme alanı (dönüm)'],['Land cost (per m²)','Distance to motorway (km)','Skilled labour (1-10)','Infrastructure (1-10)','Room to expand (decares)']],
  yon:['min','min','max','max','max'],
  X:[[1230,4.4,7,9,32],[1350,9.3,6,6,45],[1520,2.4,8,10,20],[930,10.6,4,6,107],[1450,7.1,8,6,35]],
  /* Üst üçgen yargıları: (1,2) (1,3) (1,4) (1,5) (2,3) (2,4) (2,5) (3,4) (3,5) (4,5) */
  ahp:[[2,2,2,3,2,2,3,1,2,2],[1,1,2,3,2,2,3,1,2,2],[2,1,2,3,1,1,2,2,3,2]],
  bwm:{en:0,kotu:4,bo:[1,2,3,4,6],ow:[6,4,3,2,1]}};
function ornekProje(){const k=S.dil==='tr'?0:1;const p=bosProje();p.ad=ORNEK.ad[k];
  p.kriterler=ORNEK.krit[k].map((ad,j)=>({id:'k'+(j+1),ad,yon:ORNEK.yon[j],birim:''}));p.alternatifler=ORNEK.alt[k].map((ad,i)=>({id:'a'+(i+1),ad}));
  p.X={};p.alternatifler.forEach((a,i)=>{p.X[a.id]={};p.kriterler.forEach((c,j)=>p.X[a.id][c.id]=ORNEK.X[i][j])});
  const ids=p.kriterler.map(c=>c.id);const ciftler=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)ciftler.push([ids[i],ids[j]]);
  p.agirlik.ahp.uzmanlar=ORNEK.ahp.map((L,u)=>({id:'u'+(u+1),ad:t('expertN',u+1),m:Object.fromEntries(ciftler.map(([a,b],z)=>[a+'|'+b,L[z]]))}));
  const B=ORNEK.bwm;p.agirlik.bwm.uzmanlar=[{id:'b1',ad:t('expertN',1),en:ids[B.en],kotu:ids[B.kotu],bo:Object.fromEntries(ids.map((id,j)=>[id,B.bo[j]])),ow:Object.fromEntries(ids.map((id,j)=>[id,B.ow[j]]))}];
  p.agirlik.yontem='ahp';p.yontemler=['topsis','vikor','waspas','edas','copras','marcos'];p.ana='topsis';return p}
async function ornekYukle(){if(P().alternatifler.length&&!(await sor(t('sampleQ'),t('loadSample'))))return;once();S.P=ornekProje();S.sonuc=null;kaydet();sekmeAc('matris');tost(t('sampleLoaded'))}

/* ====================== AYARLAR, GÜNLÜK, DİL ====================== */
function ayarPencere(){const p=P();pencere(t('toolSettings'),`<div class="space-y-4"><label class="flex items-center justify-between gap-3 text-sm"><span>${esc(t('decimals'))}</span><input type="number" min="2" max="8" class="input input-sm w-24" id="ayOnd" value="${p.ondalik}"></label>
  <label class="form-control text-sm"><span>${esc(t('projectNote'))}</span><textarea class="textarea textarea-sm w-full mt-1" rows="4" id="ayNot" placeholder="${esc(t('projectNotePh'))}">${esc(p.not||'')}</textarea></label></div>`,
  [{ad:t('cancel'),d:null},{ad:t('save'),c:'btn-primary',f:()=>{islem(()=>{p.ondalik=Math.min(8,Math.max(2,+$('#ayOnd').value||4));p.not=$('#ayNot').value})}}],{ip:'ayarlar'})}
function gunlukPencere(){const L=[...P().gunluk].reverse();pencere(t('toolLog'),`<div class="flex gap-2 mb-3"><input id="gNot" class="input input-sm flex-1" placeholder="${esc(t('logAddPh'))}"><button class="btn btn-sm btn-primary" id="gEkle">${esc(t('add'))}</button></div>
  ${L.length?`<ul class="text-sm divide-y divide-base-300 max-h-96 overflow-auto">${L.map(g=>`<li class="py-2"><span class="text-xs text-base-content/55">${esc(new Date(g.t).toLocaleString(S.dil))}</span><br>${esc(g.m)}</li>`).join('')}</ul>`:`<p class="text-sm text-base-content/60">${esc(t('logEmpty'))}</p>`}`,null,
  {acilinca:()=>{$('#gEkle').onclick=()=>{const v=$('#gNot').value.trim();if(!v)return;islem(()=>gunlukEkle(v),{cizme:true});$('#pencere').close();gunlukPencere()}}})}
function projeIndir(){indir(dosyaAd(P().ad)+'.karar.json',new Blob([JSON.stringify(P())],{type:'application/json'}));tost(t('projectSaved'))}
function dilSablon(){const {_kod,_ad,_cevirmen,...m}=DILLER.en;indir('karar-masasi-dil-sablonu.json',new Blob([JSON.stringify({_kod:'xx',_ad:'Language name in its own language',_cevirmen:'Your name',...m},null,1)],{type:'application/json'}))}
function temizle(v){if(typeof v==='string')return v;if(Array.isArray(v))return v.map(temizle).filter(x=>x!=null);if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v)){const y=temizle(x);if(y!=null)o[k]=y}return o}return null}
async function dilYukle(){const f=await dosyaOku('.json');if(!f)return;try{const j=JSON.parse(await f.text());if(!j._kod||!j._ad||!/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(j._kod))throw new Error(t('langBad'));
  const temiz=temizle(j);DILLER[j._kod]=temiz;const ek=JSON.parse(ls.al(KAYIT+'.diller')||'{}');ek[j._kod]=temiz;ls.koy(KAYIT+'.diller',JSON.stringify(ek));ls.koy(KAYIT+'.dil',j._kod);
  S.dil=j._kod;S.sonuc=null;metinleriYaz();ciz();const eksik=Object.keys(DILLER.en).filter(k=>temiz[k]===undefined).length;tost(t('langLoaded',j._ad)+(eksik?' '+t('langMissing',eksik):''))}catch(e){tost(e.message||t('langBad'),'error')}}
const ARAC={
  yeni:async()=>{if(P().alternatifler.length&&!(await sor(t('newProjectQ'),t('newProject'),1)))return;once();S.P=bosProje();S.sonuc=null;kaydet();sekmeAc('matris')},
  ac:async()=>{const f=await dosyaOku('.json,application/json');if(!f)return;try{const p=JSON.parse(await f.text());if(p.tur!=='karar-masasi')throw 0;once();S.P=projeDuzelt(p);S.sonuc=null;kaydet();sekmeAc(sonAsama());tost(t('projectLoaded'))}catch(e){tost(t('badProject'),'error')}},
  kaydet:projeIndir,ornek:ornekYukle,ice:iceAktar,ayar:ayarPencere,gunluk:gunlukPencere,atif:atifPencere,dilSablon,dilYukle};

/* ====================== OLAYLAR ====================== */
$$('[data-arac]').forEach(b=>b.addEventListener('click',()=>{document.activeElement&&document.activeElement.blur();ARAC[b.dataset.arac]()}));
$$('#sekmeler [data-sekme],#evBtn').forEach(b=>b.onclick=()=>sekmeAc(b.dataset.sekme));
$('#projeAd').onchange=e=>islem(()=>{P().ad=e.target.value.trim()||t('untitled')});
const dilDegis=v=>{S.dil=v;S.sonuc=null;ls.koy(KAYIT+'.dil',v);metinleriYaz();ciz()};
$('#dilSec').onchange=e=>dilDegis(e.target.value);$('#dilSecM').onchange=e=>dilDegis(e.target.value);
$('#temaSec').onchange=e=>ls.koy(KAYIT+'.tema',e.target.checked?'masa-gece':'masa');
$('#geriAl').onclick=geriAl;$('#yinele').onclick=yinele;$('#yenile').onclick=()=>location.reload();
$('#genelYardim').onclick=()=>pencere(tAlt('helpTitle','genel'),`<div class="text-sm leading-relaxed ipucu-metin">${guvenliHtml(tAlt('helpBody','genel'))}</div>`);
matrisOlaylari();
$('#aGrafikPng').onclick=async()=>{const R=hesapla();if(R.ag.hata)return;const sw=R.ag.w.map((w,j)=>j).sort((a,b)=>R.ag.w[b]-R.ag.w[a]);
  try{const r=await svgPng(cubukSvg(sw.map(j=>R.md.C[j]),sw.map(j=>R.ag.w[j]),{vurgu:0,baslik:t('weightsChartTitle',yontemAd(P().agirlik.yontem))}),3);indir(dosyaAd(P().ad)+'-agirliklar.png',r.blob)}catch(e){tost(t('pngFail'),'error')}};
$('#sAna').onchange=e=>islem(()=>{P().ana=e.target.value});
const parDegis=(k,e)=>{const v=sayiOku(e.target.value);if(v==null||v<0||v>1){tost(t('paramRange'),'warning');e.target.value=P().param[k];return}islem(()=>{P().param[k]=v})};
$('#sV').onchange=e=>parDegis('v',e);$('#sL').onchange=e=>parDegis('lambda',e);
$('#dYontem').onchange=e=>islem(()=>{P().duyarlilik.yontem=e.target.value});
$('#dOran').onchange=e=>islem(()=>{P().duyarlilik.oranlar=e.target.value});
$('#rAdim').onchange=e=>islem(()=>{P().adimRapor=e.target.checked},{cizme:true});
$('#rWord').onclick=async()=>{const b=$('#rWord');b.disabled=true;try{indir(dosyaAd(P().ad)+'-karar-raporu.docx',await wordRapor())}catch(e){console.error(e);tost(e.message||t('calcErrorShort'),'error')}finally{b.disabled=false}};
$('#rXlsx').onclick=()=>{try{indir(dosyaAd(P().ad)+'-karar-hesaplari.xlsx',xlsxRapor())}catch(e){console.error(e);tost(t('calcErrorShort'),'error')}};
$('#rCsv').onclick=()=>indir(dosyaAd(P().ad)+'-sonuclar.csv',sonucCsv());
$('#yontemKopya').onclick=()=>{const L=yontemMetni();if(!L.length){tost(t('reportNotReady'),'warning');return}kopyala(L.join('\n\n')+'\n\n'+ga('yontem','kaynakca')+'\n'+kaynakcaListesi().join('\n'))};
document.addEventListener('keydown',e=>{const ae=document.activeElement;const yaz=(/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)||ae.isContentEditable);if(yaz||$('#pencere').open)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();geriAl();return}
  if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){e.preventDefault();yinele()}});
addEventListener('dragover',e=>e.preventDefault());addEventListener('drop',e=>e.preventDefault());

/* ====================== BAŞLAT ====================== */
(async function(){
  try{Object.assign(DILLER,JSON.parse(ls.al(KAYIT+'.diller')||'{}'))}catch(_){}
  const d=ls.al(KAYIT+'.dil'),nl=(navigator.language||'tr').slice(0,2);S.dil=d&&DILLER[d]?d:(DILLER[nl]?nl:'en');
  const tm=ls.al(KAYIT+'.tema');if(tm==='masa-gece'||(!tm&&matchMedia('(prefers-color-scheme: dark)').matches))$('#temaSec').checked=true;
  await VT.ac();S.P=(await projeYukle())||bosProje();metinleriYaz();sekmeAc('giris');gecmisDugme()})();
