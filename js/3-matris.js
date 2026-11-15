/* ====================== ORTAK GÖSTERİM ====================== */
const SIRA_BASLIK=()=>new Set([t('colRank'),t('colRankS'),t('colRankR'),t('colRankQ')]);
function fmt(v,tamsayi){if(v==null||v==='')return '-';if(typeof v!=='number')return String(v);if(!isFinite(v))return '-';if(Math.abs(v)<1e-12)v=0;if(tamsayi)return sayi(v,0);
  const o=P().ondalik;const a=Math.abs(v);if(a!==0&&a<Math.pow(10,-o))return v.toExponential(2).replace('.',S.dil==='tr'?',':'.');return sayi(v,o)}
const fmtHam=v=>v==null?'-':typeof v!=='number'?String(v):Number(Math.abs(v)<1e-12?0:v).toLocaleString(S.dil,{maximumFractionDigits:10});
/* Türkçede yüzde işareti sayıdan önce gelir: +%25; İngilizcede sonra: +25%. */
const yuzdeYaz=o=>{const i=o>0?'+':o<0?'-':'',n=sayi(Math.abs(o),o%1?1:0);return S.dil==='tr'?i+'%'+n:i+n+'%'};
const yontemAd=y=>tAlt('yontemAd',y)||y.toUpperCase();
/* Bir adım tablosunu HTML'e çevirir. Sıra sütunları ve "n" satırı tamsayı gösterilir. */
function adimTablo(a,o={}){const sb=SIRA_BASLIK();const tam=a.sutun.map((s,j)=>sb.has(s)||!!(a.tam&&a.tam[j]));
  const bas=`<thead><tr>${a.sutun.map((s,j)=>`<th class="${j?'n':''}">${esc(s)}</th>`).join('')}</tr></thead>`;
  const gov=a.satirlar.map(r=>`<tr class="${o.ilk&&o.ilk(r)?'ilk':''}">${r.map((v,j)=>j===0?`<th class="font-medium text-left">${esc(v)}</th>`:`<td class="n">${esc(a.ham?fmtHam(v):fmt(v,tam[j]||r[0]==='n'))}</td>`).join('')}</tr>`).join('');
  return `<div class="overflow-x-auto"><table class="stablo">${bas}<tbody>${gov}</tbody></table></div>${a.not?`<p class="text-xs text-base-content/65 mt-2 leading-relaxed">${esc(a.not)}</p>`:''}`}
function adimlarHtml(L,baslik){if(!L||!L.length)return '';return `<details class="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box"><summary class="collapse-title font-semibold text-sm">${esc(baslik||t('showSteps'))} <span class="badge badge-sm ml-1">${L.length}</span></summary>
  <div class="collapse-content space-y-5">${L.map((a,i)=>`<div><h4 class="text-sm font-semibold mb-2">${i+1}. ${esc(t(a.k))}</h4>${adimTablo(a)}</div>`).join('')}</div></details>`}
const uyariHtml=(m,tur='warning')=>m?`<div role="alert" class="alert alert-${tur} alert-soft text-sm"><span>${esc(m)}</span></div>`:'';
const hataMetni=r=>r&&r.hata?t('err_'+r.hata,...(r.hataArg||[])):'';
/* Yatay çubuk grafik (raporda da kullanılır; renkler sabit, arka plan beyaz). */
function cubukSvg(etiket,deger,o={}){const n=etiket.length,W=680,sol=Math.min(230,16+Math.max(...etiket.map(e=>String(e).length))*7.2),sag=86,ust=o.baslik?40:14,sat=26,H=ust+n*sat+14;
  const mx=Math.max(...deger.map(Math.abs),1e-12);const g=W-sol-sag;const ri=o.renk||'#8c2a3c';
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Calibri, Segoe UI, Arial, sans-serif" font-size="13"><rect width="${W}" height="${H}" fill="#fff"/>`;
  if(o.baslik)s+=`<text x="16" y="24" font-size="15" font-weight="700" fill="#1c2230">${esc(o.baslik)}</text>`;
  etiket.forEach((e,i)=>{const y=ust+i*sat,v=deger[i],bw=Math.max(1,Math.abs(v)/mx*g);const ad=String(e).length>30?String(e).slice(0,29)+'…':String(e);
    s+=`<text x="${sol-10}" y="${y+17}" text-anchor="end" fill="#1c2230">${esc(ad)}</text><rect x="${sol}" y="${y+5}" width="${bw.toFixed(1)}" height="16" rx="3" fill="${o.vurgu===i?ri:ri}" fill-opacity="${o.vurgu==null||o.vurgu===i?1:.55}"/><text x="${(sol+bw+8).toFixed(1)}" y="${y+17}" fill="#3a4152">${esc(o.fmt?o.fmt(v):fmt(v))}</text>`});
  return s+'</svg>'}

/* ====================== KARAR MATRİSİ SEKMESİ ====================== */
const yonEtiket=y=>t(y==='min'?'dirMin':'dirMax');
function cizMatris(){const p=P(),C=p.kriterler,A=p.alternatifler,md=matrisDurum();
  $('#matrisOzet').textContent=t('matrixSummary',sayi(A.length),sayi(C.length),sayi(C.filter(k=>k.yon==='max').length),sayi(C.filter(k=>k.yon==='min').length));
  $('#mUyari').innerHTML=!C.length&&!A.length?uyariHtml(t('matrixEmpty'),'info'):md.sorun==='matrixIncomplete'?uyariHtml(t('err_matrixIncomplete',sayi(md.eksik))):md.sorun?uyariHtml(t('err_'+md.sorun)):'';
  const sil=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  const bas=`<thead><tr><th class="text-left px-3 py-2 text-xs font-semibold text-base-content/60 align-bottom">${esc(t('altCrit'))}</th>${C.map((k,j)=>`<th class="min-w-36"><div class="flex items-center"><input class="adhucre" data-kad="${esc(k.id)}" value="${esc(k.ad)}" placeholder="${esc(t('critN',j+1))}" aria-label="${esc(t('critName'))}"><button class="btn btn-ghost btn-xs btn-square text-base-content/50" data-ksil="${esc(k.id)}" title="${esc(t('deleteCrit'))}" aria-label="${esc(t('deleteCrit'))}">${sil}</button></div>
    <div class="px-2 pb-2"><div class="join w-full"><button class="join-item btn btn-xs flex-1 ${k.yon==='max'?'btn-success':'btn-ghost'}" data-kyon="${esc(k.id)}" data-v="max" aria-pressed="${k.yon==='max'}">${esc(t('dirMax'))}</button><button class="join-item btn btn-xs flex-1 ${k.yon==='min'?'btn-error':'btn-ghost'}" data-kyon="${esc(k.id)}" data-v="min" aria-pressed="${k.yon==='min'}">${esc(t('dirMin'))}</button></div></div></th>`).join('')}</tr></thead>`;
  const gov=A.map((a,i)=>`<tr><td><div class="flex items-center"><input class="adhucre" data-aad="${esc(a.id)}" value="${esc(a.ad)}" placeholder="${esc(t('altN',i+1))}" aria-label="${esc(t('altName'))}"><button class="btn btn-ghost btn-xs btn-square text-base-content/50" data-asil="${esc(a.id)}" title="${esc(t('deleteAlt'))}" aria-label="${esc(t('deleteAlt'))}">${sil}</button></div></td>${C.map((k,j)=>{const v=p.X[a.id]?.[k.id];return `<td><input class="hucre ${v==null?'bos':''}" inputmode="decimal" data-i="${i}" data-j="${j}" value="${v==null?'':esc(sayiYaz(v))}" aria-label="${esc((a.ad||t('altN',i+1))+' / '+(k.ad||t('critN',j+1)))}"></td>`}).join('')}</tr>`).join('');
  $('#matrisTablo').innerHTML=C.length||A.length?`<table class="mtablo">${bas}<tbody>${gov}</tbody></table>`:'';
  cizIstat()}
/* Sayıyı düzenleme kutusuna yazarken binlik ayıracı kullanılmaz. */
const sayiYaz=v=>{const s=String(+v.toPrecision(12));return S.dil==='tr'?s.replace('.',','):s};
function cizIstat(){const md=matrisDurum();if(!P().kriterler.length){$('#matrisIstat').innerHTML=`<p class="text-sm text-base-content/60">${esc(t('noData'))}</p>`;return}
  const p=P();const sat=p.kriterler.map((k,j)=>{const v=p.alternatifler.map(a=>p.X[a.id]?.[k.id]).filter(x=>x!=null);if(!v.length)return [md.C[j],yonEtiket(k.yon),'-','-','-','-','-'];const o=ort(v),s=ss(v);return [md.C[j],yonEtiket(k.yon),fmtHam(enk(v)),fmtHam(enb(v)),o,s,Math.abs(o)>EPS?s/Math.abs(o):null]});
  $('#matrisIstat').innerHTML=adimTablo(adim('',['',t('colDirection'),'Min','Maks',t('colMean'),t('colSd'),t('colCv')],sat))}
function hucreYaz(i,j,deger){const p=P(),a=p.alternatifler[i],k=p.kriterler[j];if(!a||!k)return;const v=deger===''?null:sayiOku(deger);
  const el=$(`#matrisTablo input.hucre[data-i="${i}"][data-j="${j}"]`);if(deger!==''&&v==null){el&&el.classList.add('hatali');tost(t('notNumber'),'warning');return}
  if((p.X[a.id][k.id]??null)===v){el&&el.classList.remove('hatali');return}
  islem(()=>{p.X[a.id][k.id]=v},{cizme:true});if(el){el.classList.remove('hatali');el.classList.toggle('bos',v==null)}matrisSonrasi()}
function matrisSonrasi(){const md=matrisDurum();$('#mUyari').innerHTML=md.sorun==='matrixIncomplete'?uyariHtml(t('err_matrixIncomplete',sayi(md.eksik))):md.sorun?uyariHtml(t('err_'+md.sorun)):'';cizIstat();rozetler()}
function altEkle(ad){const id=uid();P().alternatifler.push({id,ad:ad||''});P().X[id]={};P().kriterler.forEach(k=>P().X[id][k.id]=null);return id}
function kritEkle(ad,yon){const id=uid();P().kriterler.push({id,ad:ad||'',yon:yon||'max',birim:''});P().alternatifler.forEach(a=>P().X[a.id][id]=null);return id}
function kritSil(id){const p=P();p.kriterler=p.kriterler.filter(k=>k.id!==id);p.alternatifler.forEach(a=>delete p.X[a.id][id]);delete p.agirlik.dogrudan[id];
  p.agirlik.ahp.uzmanlar.forEach(u=>{for(const k of Object.keys(u.m))if(k.split('|').includes(id))delete u.m[k]});
  p.agirlik.bwm.uzmanlar.forEach(u=>{if(u.en===id)u.en=null;if(u.kotu===id)u.kotu=null;delete u.bo[id];delete u.ow[id]})}
function altSil(id){const p=P();p.alternatifler=p.alternatifler.filter(a=>a.id!==id);delete p.X[id]}
function odakla(i,j){const e=$(`#matrisTablo input.hucre[data-i="${i}"][data-j="${j}"]`);if(e){e.focus();e.select()}}
function matrisOlaylari(){const T=$('#matrisTablo');
  T.addEventListener('change',e=>{const x=e.target;if(x.classList.contains('hucre'))hucreYaz(+x.dataset.i,+x.dataset.j,x.value.trim());
    else if(x.dataset.kad){const k=P().kriterler.find(k=>k.id===x.dataset.kad);if(k&&k.ad!==x.value.trim())islem(()=>{k.ad=x.value.trim()},{cizme:true});cizIstat()}
    else if(x.dataset.aad){const a=P().alternatifler.find(a=>a.id===x.dataset.aad);if(a&&a.ad!==x.value.trim())islem(()=>{a.ad=x.value.trim()},{cizme:true})}});
  T.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.kyon){const k=P().kriterler.find(k=>k.id===b.dataset.kyon);if(k&&k.yon!==b.dataset.v)islem(()=>{k.yon=b.dataset.v})}
    else if(b.dataset.ksil){const k=P().kriterler.find(k=>k.id===b.dataset.ksil);const dolu=P().alternatifler.some(a=>P().X[a.id][k.id]!=null);
      const f=()=>islem(()=>{kritSil(k.id);gunlukEkle(t('logCritDel',k.ad))});if(dolu)sor(t('deleteCritQ',k.ad||'-'),t('delete'),1).then(r=>r&&f());else f()}
    else if(b.dataset.asil){const a=P().alternatifler.find(a=>a.id===b.dataset.asil);const dolu=P().kriterler.some(k=>P().X[a.id][k.id]!=null);
      const f=()=>islem(()=>{altSil(a.id);gunlukEkle(t('logAltDel',a.ad))});if(dolu)sor(t('deleteAltQ',a.ad||'-'),t('delete'),1).then(r=>r&&f());else f()}});
  T.addEventListener('keydown',e=>{const x=e.target;if(!x.classList.contains('hucre'))return;const i=+x.dataset.i,j=+x.dataset.j;
    if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();x.dispatchEvent(new Event('change',{bubbles:true}));if(i+1<P().alternatifler.length)odakla(i+1,j);else if(e.key==='Enter'){islem(()=>altEkle());setTimeout(()=>odakla(i+1,j),0)}}
    else if(e.key==='ArrowUp'){e.preventDefault();x.dispatchEvent(new Event('change',{bubbles:true}));if(i>0)odakla(i-1,j)}
    else if(e.key==='ArrowRight'&&x.selectionStart===x.value.length){x.dispatchEvent(new Event('change',{bubbles:true}));odakla(i,j+1)}
    else if(e.key==='ArrowLeft'&&x.selectionStart===0&&x.selectionEnd===0){x.dispatchEvent(new Event('change',{bubbles:true}));odakla(i,j-1)}});
  /* Excel'den bir hücre bloğu yapıştırılırsa, imlecin bulunduğu hücreden başlayarak doldurulur; gerekirse satır ve sütun eklenir. */
  T.addEventListener('paste',e=>{const x=e.target;if(!x.classList.contains('hucre'))return;const m=(e.clipboardData||window.clipboardData).getData('text');if(!/[\t\n]/.test(m.trim()))return;e.preventDefault();
    const sat=m.replace(/\r/g,'').replace(/\n+$/,'').split('\n').map(r=>r.split('\t'));const i0=+x.dataset.i,j0=+x.dataset.j;let hatali=0;
    islem(()=>{const p=P();while(p.alternatifler.length<i0+sat.length)altEkle();const gen=Math.max(...sat.map(r=>r.length));while(p.kriterler.length<j0+gen)kritEkle();
      sat.forEach((r,a)=>r.forEach((v,b)=>{const al=p.alternatifler[i0+a],k=p.kriterler[j0+b];const s=v.trim();if(s===''){p.X[al.id][k.id]=null;return}const n=sayiOku(s);if(n==null)hatali++;else p.X[al.id][k.id]=n}))});
    tost(hatali?t('pastedWithErrors',sayi(hatali)):t('pasted'),hatali?'warning':'success')});
  $('#mAltEkle').onclick=()=>{const i=P().alternatifler.length;islem(()=>altEkle());const e=$(`#matrisTablo [data-aad="${P().alternatifler[i].id}"]`);e&&e.focus()};
  $('#mKritEkle').onclick=()=>{const j=P().kriterler.length;islem(()=>kritEkle());const e=$(`#matrisTablo [data-kad="${P().kriterler[j].id}"]`);e&&e.focus()};
  $('#mYapistir').onclick=()=>tabloPencere(null)}

/* ====================== TABLO İÇE AKTARMA ======================
   Biçim: ilk satır kriter adları, ilk sütun alternatif adları. İsteğe bağlı ikinci satır kriter yönü (fayda/maliyet, max/min). */
const YON_MAX=new Set(['max','maks','maximum','fayda','benefit','b','+','yukarı','artan','yüksek','profit']),YON_MIN=new Set(['min','minimum','maliyet','cost','c','-','aşağı','azalan','düşük','kayıp']);
const yonOku=s=>{const k=katla(String(s??'').trim());return YON_MAX.has(k)?'max':YON_MIN.has(k)?'min':null};
function tabloCoz(sat,o){sat=sat.map(r=>r.map(x=>String(x??'').trim())).filter(r=>r.some(x=>x));if(!sat.length)return null;const gen=Math.max(...sat.map(r=>r.length));sat=sat.map(r=>{while(r.length<gen)r.push('');return r});
  let i=0;const bs=o.baslik?sat[i++]:null;let yonS=null;if(sat[i]&&sat[i].slice(o.adlar?1:0).filter(x=>x).every(x=>yonOku(x))&&sat[i].slice(o.adlar?1:0).some(x=>x)){yonS=sat[i++]}
  const veri=sat.slice(i);const j0=o.adlar?1:0;const krit=[];for(let j=j0;j<gen;j++)krit.push({ad:bs?bs[j]:'',yon:yonS?(yonOku(yonS[j])||'max'):'max'});
  const alt=veri.map((r,k)=>({ad:o.adlar?r[0]:'',v:r.slice(j0).map(x=>x===''?null:sayiOku(x)),ham:r.slice(j0)}));
  const hatali=alt.reduce((s,a)=>s+a.v.filter((x,j)=>x==null&&a.ham[j]!=='').length,0);return {krit,alt,hatali,yonVar:!!yonS}}
function tabloUygula(c){const p=P();p.kriterler=[];p.alternatifler=[];p.X={};const kid=c.krit.map(k=>kritEkle(k.ad,k.yon));c.alt.forEach(a=>{const id=altEkle(a.ad);a.v.forEach((v,j)=>{if(kid[j])p.X[id][kid[j]]=v})});
  p.agirlik.dogrudan={};p.agirlik.ahp.uzmanlar.forEach(u=>u.m={});p.agirlik.bwm.uzmanlar.forEach(u=>{u.en=u.kotu=null;u.bo={};u.ow={}})}
async function tabloPencere(satirlar,dosyaAdi){let secim=null;
  const d=await pencere(t('pasteTitle'),`<div class="space-y-3">${satirlar?`<p class="text-sm">${esc(t('fileRead',dosyaAdi||'',sayi(satirlar.length)))}</p>`:`<p class="text-sm text-base-content/70">${esc(t('pasteLead'))}</p><textarea id="yMetin" class="textarea w-full font-mono text-xs" rows="8" placeholder="${esc(t('pastePh'))}"></textarea>`}
    <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm"><label class="flex items-center gap-2"><input type="checkbox" class="checkbox checkbox-sm" id="yBaslik" checked><span>${esc(t('firstRowNames'))}</span></label>
    <label class="flex items-center gap-2"><input type="checkbox" class="checkbox checkbox-sm" id="yAdlar" checked><span>${esc(t('firstColNames'))}</span></label></div>
    <p class="text-xs text-base-content/60">${esc(t('dirRowNote'))}</p><div id="yOnizleme"></div></div>`,
    [{ad:t('cancel'),d:null},{ad:t('importReplace'),c:'btn-primary',d:'uygula',f:()=>{const c=oniz();if(!c||!c.alt.length||!c.krit.length){tost(t('nothingToImport'),'warning');return false}secim=c}}],
    {genis:true,ip:'iceAktar',acilinca:()=>{['#yBaslik','#yAdlar'].forEach(s=>$(s).onchange=oniz);const m=$('#yMetin');if(m){m.oninput=oniz;m.focus()}oniz()}});
  if(d!=='uygula'||!secim)return;const c=secim;
  if((P().alternatifler.length||P().kriterler.length)&&!(await sor(t('replaceQ'),t('importReplace'),1)))return;
  islem(()=>{tabloUygula(c);gunlukEkle(t('logImported',c.alt.length,c.krit.length))});tost(t('imported',sayi(c.alt.length),sayi(c.krit.length))+(c.hatali?' '+t('pastedWithErrors',sayi(c.hatali)):''),c.hatali?'warning':'success');if(S.sekme!=='matris')sekmeAc('matris');
  function oniz(){const sat=satirlar||(($('#yMetin')?.value)||'').replace(/\r/g,'').split('\n').map(r=>r.includes('\t')?r.split('\t'):r.split(/;/));
    const c=tabloCoz(sat,{baslik:$('#yBaslik').checked,adlar:$('#yAdlar').checked});const k=$('#yOnizleme');if(!c){k.innerHTML='';return null}
    const C=c.krit.map((x,j)=>(x.ad||t('critN',j+1))+' ('+yonEtiket(x.yon)+')');const L=c.alt.slice(0,6).map((a,i)=>[a.ad||t('altN',i+1),...a.v.map(v=>v==null?'':v)]);
    k.innerHTML=`<p class="text-sm font-medium mb-1">${esc(t('previewN',sayi(c.alt.length),sayi(c.krit.length)))}${c.yonVar?' '+esc(t('dirRowFound')):''}</p>${adimTablo(adim('',['',...C],L))}${c.hatali?uyariHtml(t('pastedWithErrors',sayi(c.hatali))):''}`;return c}}
async function iceAktar(){const f=await dosyaOku('.xlsx,.csv,.tsv,.txt');if(!f)return;try{let sat;if(/\.xlsx$/i.test(f.name))sat=await xlsxSatirlar(await f.arrayBuffer());else{const b=new Uint8Array(await f.arrayBuffer());let m;try{m=new TextDecoder('utf-8',{fatal:true}).decode(b)}catch(e){m=new TextDecoder('windows-1254').decode(b)}sat=csvSatirlar(m)}
  if(!sat.length)throw new Error();tabloPencere(sat,f.name)}catch(e){tost(t('badFile'),'error')}}
